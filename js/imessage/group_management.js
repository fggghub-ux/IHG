(function (appWindow) {
  const imApp = appWindow.imApp = appWindow.imApp || {},
    clone = value => value == null ? null : JSON.parse(JSON.stringify(value)),
    resolveFriend = friendOrId => imApp.getFriendById?.(friendOrId?.id ?? friendOrId) || (appWindow.imData?.friends || []).find(friend => String(friend.id) === String(friendOrId?.id ?? friendOrId)),
    normalizeMemberId = value => {
      const id = String(value ?? "").trim();
      return id && !["__proto__", "prototype", "constructor", "__user__"].includes(id) ? id : "";
    },
    isMember = (group, memberId) => !!normalizeMemberId(memberId) && (group?.members || []).some(id => String(id) === String(memberId)),
    isAdmin = (group, memberId) => isMember(group, memberId) && (group.adminMemberIds || []).some(id => String(id) === String(memberId)),
    memberName = member => member?.nickname || member?.realName || "群成员",
    createMessageId = prefix => appWindow.imChat?.createMessageId?.(prefix) || prefix + "-" + Date.now() + "-" + Math.random().toString(36).slice(2),
    formatMuteDuration = minutes => minutes % 1440 === 0 ? minutes / 1440 + " 天" : minutes % 60 === 0 ? minutes / 60 + " 小时" : minutes + " 分钟";
  function ensureGroupManagementData(group) {
    for (const key of ["groupMutes", "groupMuteRequests", "groupMuteRevisions"]) {
      if (!group[key] || typeof group[key] !== "object" || Array.isArray(group[key])) group[key] = {};
    }
    return group;
  }
  imApp.isGroupMemberMuted = (group, memberId, now = Date.now()) => isMember(group, memberId) && Number(group?.groupMutes?.[normalizeMemberId(memberId)]?.until) > now;
  function isValidActor(group, actor, member) {
    if (actor?.role === "user") return !(Number(group.leftGroupAt) > 0 || group.groupObserverMode === true);
    return actor?.role === "assistant" && isMember(group, actor.memberId) && ["char", "npc"].includes(member?.type) && String(member.id) === String(actor.memberId) && [member.nickname, member.realName].some(name => name && name === actor.name);
  }
  function canManageGroup(group, actor, member, targetMemberId = "") {
    if (!isValidActor(group, actor, member)) return false;
    if (actor.role === "user") return true;
    return isAdmin(group, actor.memberId) && !imApp.isGroupMemberMuted(group, actor.memberId) && (!targetMemberId || isMember(group, targetMemberId) && !isAdmin(group, targetMemberId));
  }
  imApp.canManageGroupMember = (group, actor, targetMemberId) => canManageGroup(group, actor, resolveFriend(actor?.memberId), targetMemberId);
  imApp.markGroupMutedDelivery = function (group, message) {
    if (group?.type !== "group" || message?.role !== "assistant" || ["system_notice", "group_unmute_request"].includes(message.type)) return false;
    const speaker = appWindow.imChat?.normalizeGroupSpeaker?.(group, message.speaker, message.speakerMemberId || null);
    if (!speaker || !imApp.isGroupMemberMuted(group, speaker.id)) return false;
    return message.deliveryStatus = "blocked", message.excludedFromContext = true, message.payload = {
      ...message.payload,
      groupMuted: true,
      groupMuteId: group.groupMutes[String(speaker.id)].id
    }, true;
  };
  function applyManagementResult(group, result) {
    if (result.message) {
      if (!Array.isArray(group.messages)) group.messages = [];
      group.messages.push(result.message);
    }
    if (result.updatedRequest) {
      const pendingRequest = (group.messages || []).find(message => message.id === result.updatedRequest.id);
      if (pendingRequest) Object.assign(pendingRequest, {
        requestStatus: result.updatedRequest.requestStatus,
        decidedAt: result.updatedRequest.decidedAt,
        decision: result.updatedRequest.decision
      });
    }
    const {
      friendId: _friendId,
      ...summary
    } = result.summary || {};
    Object.assign(group, summary);
    imApp.syncActiveFriendReference?.(group);
    imApp.syncSettingsFriendReference?.(group);
    const messages = appWindow.document?.getElementById("chat-interface-" + group.id)?.querySelector(".ins-chat-messages");
    if (messages) appWindow.imChat?.rerenderChatContainer?.(group, messages, {
      scroll: true
    });
    imApp.requestChatsListRefresh?.();
    imApp.renderGroupsList?.();
    if (String(appWindow.imData?.currentActiveFriend?.id) === String(group.id)) {
      const chat = appWindow.document?.getElementById("chat-interface-" + group.id),
        header = chat?.querySelector(".ins-chat-name");
      if (header) header.textContent = group.nickname;
    }
    if (typeof appWindow.CustomEvent === "function") appWindow.dispatchEvent(new appWindow.CustomEvent("u2:group-management-updated", {
      detail: {
        groupId: group.id
      }
    }));
    scheduleNextExpiry();
  }
  imApp.performGroupManagement = async function (groupOrId, actor, action, options = {}) {
    const groupId = String(groupOrId?.id ?? groupOrId);
    try {
      await imApp.ensureDataReady?.();
      const initialGroup = resolveFriend(groupId);
      if (!initialGroup || initialGroup.type !== "group") return {
        success: false,
        reason: "not_group"
      };
      await imApp.ensureFriendRecentMessagesLoaded?.(initialGroup);
      const targetMemberId = normalizeMemberId(action.targetMemberId || (action.type === "group_unmute_request" ? actor.memberId : "")),
        requestId = String(action.requestId || initialGroup.groupMuteRequests?.[targetMemberId]?.requestId || ""),
        result = await imApp.runFriendPersistenceTask(groupId, () => appWindow.imStorage.commitGroupManagement(groupId, {
          actorMemberId: actor.memberId,
          targetMemberId: targetMemberId,
          requestId: requestId,
          isCurrent: options.isCurrent,
          incomingUnread: actor.role === "assistant" && String(appWindow.imData?.currentActiveFriend?.id) !== groupId,
          "reduce"(group, actorMember, targetMember, request) {
            ensureGroupManagementData(group);
            const now = Date.now(),
              type = action.type,
              isExpiry = actor.role === "system" && type === "group_mute_expired",
              isRequest = type === "group_unmute_request";
            if (!isExpiry && !(isRequest ? isValidActor(group, actor, actorMember) && actor.role === "assistant" && String(actor.memberId) === targetMemberId : canManageGroup(group, actor, actorMember, type === "group_rename" ? "" : targetMemberId))) return {
              success: false,
              reason: "forbidden"
            };
            if (type !== "group_rename" && (!targetMemberId || !isMember(group, targetMemberId) || !targetMember)) return {
              success: false,
              reason: "not_member"
            };
            const identity = actor.role === "user" ? imApp.getGroupUserIdentity?.(resolveFriend(groupId) || group) : null,
              actorName = identity?.name || actor.name || (actor.role === "user" ? "User" : "系统"),
              messageId = createMessageId("group-management"),
              message = {
                id: messageId,
                role: "system",
                type: "system_notice",
                noticeKind: type,
                actorRole: actor.role,
                actorName: actorName,
                timestamp: now,
                apiRunId: options.apiRunId || "",
                payload: {}
              };
            let notice = "",
              updatedRequest = null;
            const key = type === "group_rename" ? "name" : targetMemberId,
              beforeRevision = key === "name" ? group.groupNameRevision : group.groupMuteRevisions[key],
              before = key === "name" ? {
                nickname: group.nickname,
                realName: group.realName
              } : {
                mute: clone(group.groupMutes[key]),
                request: clone(group.groupMuteRequests[key])
              },
              resolveRequest = status => {
                const pending = group.groupMuteRequests[targetMemberId];
                pending && request?.id === pending.requestId && request.friendId === groupId && (updatedRequest = {
                  ...request,
                  requestStatus: status,
                  decidedAt: now,
                  decision: status === "accepted" ? "accept" : status === "rejected" ? "reject" : ""
                });
                delete group.groupMuteRequests[targetMemberId];
              };
            if (type === "group_rename") {
              const name = String(action.name || "").trim();
              if (!name || name.length > 80) return {
                success: false,
                reason: "invalid_name"
              };
              if (name === group.nickname) return {
                success: true,
                unchanged: true
              };
              group.nickname = group.realName = name;
              notice = actorName + " 修改了群名为「" + name + "」";
            } else {
              if (type === "group_mute") {
                const minutes = Number(action.durationMinutes);
                if (!Number.isSafeInteger(minutes) || minutes < 1 || !Number.isSafeInteger(now + minutes * 60000) || now + minutes * 60000 > 8640000000000000) return {
                  success: false,
                  reason: "invalid_duration"
                };
                resolveRequest("resolved");
                group.groupMutes[targetMemberId] = {
                  id: messageId,
                  actorMemberId: actor.role === "user" ? "__user__" : String(actor.memberId),
                  actorName: actorName,
                  startedAt: now,
                  until: now + minutes * 60000,
                  apiRunId: options.apiRunId || ""
                };
                notice = actorName + " 将 " + memberName(targetMember) + " 禁言 " + formatMuteDuration(minutes);
              } else {
                if (isRequest) {
                  const reason = String(action.reason || "").trim().slice(0, 500);
                  if (!reason || !imApp.isGroupMemberMuted(group, targetMemberId)) return {
                    success: false,
                    reason: "not_muted"
                  };
                  if (group.groupMuteRequests[targetMemberId] && request?.friendId === groupId && request.requestStatus === "pending") return {
                    success: false,
                    reason: "pending"
                  };
                  group.groupMuteRequests[targetMemberId] = {
                    requestId: messageId,
                    muteId: group.groupMutes[targetMemberId].id,
                    reason: reason
                  };
                  Object.assign(message, {
                    role: "assistant",
                    type: "group_unmute_request",
                    speaker: memberName(targetMember),
                    speakerMemberId: targetMemberId,
                    requestStatus: "pending",
                    requestText: reason
                  });
                  message.payload.targetMemberId = targetMemberId;
                  notice = memberName(targetMember) + " 申请解除禁言：" + reason;
                } else {
                  if (["group_unmute", "group_mute_expired", "group_unmute_decision"].includes(type)) {
                    const mute = group.groupMutes[targetMemberId];
                    if (!mute) return {
                      success: false,
                      reason: "not_muted"
                    };
                    if (isExpiry && (mute.until > now || action.muteId && mute.id !== action.muteId)) return {
                      success: false,
                      reason: "not_expired"
                    };
                    if (type === "group_unmute_decision") {
                      const pending = group.groupMuteRequests[targetMemberId];
                      if (!pending || pending.requestId !== action.requestId || pending.muteId !== mute.id || mute.until <= now || request?.friendId !== groupId || request.requestStatus !== "pending" || !["accept", "reject"].includes(action.decision)) return {
                        success: false,
                        reason: "stale_request"
                      };
                      resolveRequest(action.decision === "accept" ? "accepted" : "rejected");
                      notice = actorName + " " + (action.decision === "accept" ? "同意" : "拒绝") + "了 " + memberName(targetMember) + " 的解除禁言申请";
                    } else resolveRequest("resolved");
                    (type !== "group_unmute_decision" || action.decision === "accept") && (delete group.groupMutes[targetMemberId], notice = isExpiry ? memberName(targetMember) + " 的禁言已到期，已自动解除" : actorName + " 解除了 " + memberName(targetMember) + " 的禁言");
                  } else return {
                    success: false,
                    reason: "invalid_action"
                  };
                }
              }
            }
            if (key === "name") group.groupNameRevision = messageId;else group.groupMuteRevisions[key] = messageId;
            return message.payload.groupManagementChange = {
              key: key,
              before: before,
              beforeRevision: beforeRevision || null,
              revision: messageId,
              previousRequest: request ? clone(request) : null
            }, message.payload.targetMemberId = targetMemberId, message.content = message.text = notice, {
              success: true,
              message: message,
              updatedRequest: updatedRequest
            };
          }
        }));
      if (result.success && !result.unchanged) {
        const group = resolveFriend(groupId);
        for (const key of ["nickname", "realName", "groupNameRevision", "groupMutes", "groupMuteRequests", "groupMuteRevisions"]) {
          if (Object.prototype.hasOwnProperty.call(result.group, key)) group[key] = clone(result.group[key]);
        }
        applyManagementResult(group, result);
      }
      return result;
    } catch (error) {
      return appWindow.console?.error?.("[iMessage] Group management failed", error), {
        success: false,
        reason: "save_failed"
      };
    }
  };
  imApp.reconcileGroupMutes = async function (groupOrId) {
    const group = resolveFriend(groupOrId);
    if (!group || group.type !== "group") return;
    for (const [memberId, mute] of Object.entries(group.groupMutes || {})) {
      isMember(group, memberId) && Number(mute?.until) <= Date.now() && (await imApp.performGroupManagement(group.id, {
        role: "system"
      }, {
        type: "group_mute_expired",
        targetMemberId: memberId,
        muteId: mute.id
      }));
    }
    scheduleNextExpiry();
  };
  let expiryTimer = null;
  function scheduleNextExpiry() {
    if (expiryTimer) clearTimeout(expiryTimer);
    const groups = (appWindow.imData?.friends || []).filter(friend => friend.type === "group"),
      expiryTimes = groups.flatMap(group => Object.entries(group.groupMutes || {}).filter(([memberId]) => isMember(group, memberId)).map(([, mute]) => Number(mute?.until))).filter(Number.isFinite);
    expiryTimer = expiryTimes.length ? setTimeout(() => {
      expiryTimer = null;
      reconcileAllGroupMutes();
    }, Math.max(1000, Math.min(2147483647, Math.min(...expiryTimes) - Date.now()))) : null;
  }
  async function reconcileAllGroupMutes() {
    for (const friend of appWindow.imData?.friends || []) if (friend.type === "group") await imApp.reconcileGroupMutes(friend);
  }
  imApp.restoreGroupManagementRun = function (group, messages) {
    ensureGroupManagementData(group);
    for (const message of [...messages].reverse()) {
      const change = message.payload?.groupManagementChange;
      if (!change) continue;
      const revision = change.key === "name" ? group.groupNameRevision : group.groupMuteRevisions[change.key];
      if (revision !== change.revision) continue;
      if (change.key === "name") Object.assign(group, change.before), group.groupNameRevision = change.beforeRevision;else {
        for (const [key, value] of [["groupMutes", change.before.mute], ["groupMuteRequests", change.before.request]]) {
          if (value) group[key][change.key] = clone(value);else delete group[key][change.key];
        }
        group.groupMuteRevisions[change.key] = change.beforeRevision;
        const request = (group.messages || []).find(message => message.id === change.previousRequest?.id);
        if (request) Object.assign(request, {
          requestStatus: change.previousRequest.requestStatus,
          decidedAt: change.previousRequest.decidedAt,
          decision: change.previousRequest.decision
        });
      }
    }
  };
  imApp.buildGroupManagementPrompt = function (group) {
    const members = (group.members || []).map(memberId => ({
      memberId: String(memberId),
      name: memberName(resolveFriend(memberId)),
      muted: imApp.isGroupMemberMuted(group, memberId),
      until: group.groupMutes?.[memberId]?.until || 0,
      pendingRequest: group.groupMuteRequests?.[memberId] || null
    }));
    return "\nPublic group management (independent of title visibility): " + JSON.stringify(members) + "\n- User is the owner. Only the owner and unmuted administrators can rename this group. Administrators can mute/unmute ordinary members, including those muted by the owner; never the owner or another administrator. Muted administrators cannot manage anything.\n- You may act autonomously when the story gives a concrete reason, never mechanically each turn. Dialogue alone changes nothing. Put these structured actions inside <chat_json> in event order with exact speaker and speakerMemberId. Never impersonate User.\n- Rename: {\"type\":\"group_rename\",\"speaker\":\"admin name\",\"speakerMemberId\":\"admin ID\",\"name\":\"new group name, 1-80 characters\"}.\n- Mute: {\"type\":\"group_mute\",\"speaker\":\"admin name\",\"speakerMemberId\":\"admin ID\",\"targetMemberId\":\"ordinary member ID\",\"durationMinutes\":60}. Duration must be a positive whole number of minutes, never permanent.\n- Early release: {\"type\":\"group_unmute\",\"speaker\":\"admin name\",\"speakerMemberId\":\"admin ID\",\"targetMemberId\":\"ordinary member ID\"}.\n- Muted members cannot deliver ordinary public messages, media, locations, payments, votes, announcements or management actions. They need not participate in ordinary group replies. They may independently submit {\"type\":\"group_unmute_request\",\"speaker\":\"muted member name\",\"speakerMemberId\":\"muted member ID\",\"reason\":\"specific natural reason\"}. Do not duplicate a pending request. They may also DM User only if the existing private-chat switch permits it.\n- An unmuted administrator may decide a pending ordinary member's request with {\"type\":\"group_unmute_decision\",\"speaker\":\"admin name\",\"speakerMemberId\":\"admin ID\",\"targetMemberId\":\"requester ID\",\"requestId\":\"exact pending request ID\",\"decision\":\"accept|reject\"}.\n- Public rename/mute/release notices are real shared events. Failed ordinary messages are not delivered and other members cannot know their contents. If no member can speak publicly, an application/action-only response or empty <chat_json>[]</chat_json> is valid.\n- Members may share a virtual location naturally: {\"type\":\"location\",\"speaker\":\"member name\",\"speakerMemberId\":\"member ID\",\"name\":\"place name\",\"address\":\"optional detailed address\",\"nameTranslation\":\"Chinese translation if non-Chinese\",\"addressTranslation\":\"Chinese translation if non-Chinese\"}. Use that speaker's mapped language, with Simplified Chinese translations for non-Chinese names/addresses; limit name to 80 and address to 160 characters.";
  };
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
  imApp.renderGroupUnmuteRequest = function (message, group, container) {
    const row = appWindow.document.createElement("div");
    row.className = "chat-row group-unmute-request-row";
    row.dataset.messageId = message.id;
    row.dataset.timestamp = String(message.timestamp);
    const targetMemberId = message.payload?.targetMemberId || message.speakerMemberId,
      request = group.groupMuteRequests?.[targetMemberId],
      canDecide = message.requestStatus === "pending" && request?.requestId === message.id && imApp.isGroupMemberMuted(group, targetMemberId),
      statusLabel = canDecide ? "等待处理" : {
        accepted: "已同意",
        rejected: "已拒绝"
      }[message.requestStatus] || "已结束";
    row.innerHTML = "<div class=\"group-unmute-request-card\"><strong>" + escapeHtml(message.speaker) + " 申请解除禁言</strong><p>" + escapeHtml(message.requestText || message.content) + "</p><small>" + statusLabel + "</small>" + (canDecide && canManageGroup(group, {
      role: "user"
    }) ? "<div class=\"group-management-buttons\"><button data-decision=\"reject\">拒绝</button><button data-decision=\"accept\">同意</button></div>" : "") + "</div>";
    for (const button of row.querySelectorAll("[data-decision]")) button.addEventListener("click", async () => {
      row.querySelectorAll("button").forEach(button => button.disabled = true);
      const result = await imApp.performGroupManagement(group.id, {
        role: "user"
      }, {
        type: "group_unmute_decision",
        targetMemberId: targetMemberId,
        requestId: message.id,
        decision: button.dataset.decision
      });
      !result.success && (appWindow.showToast?.("申请处理失败，请重试"), row.querySelectorAll("button").forEach(button => button.disabled = false));
    });
    return container.appendChild(row), row;
  };
  imApp.openGroupMuteDialog = function (groupId, memberId) {
    const group = resolveFriend(groupId),
      member = resolveFriend(memberId);
    if (!group || !member || !canManageGroup(group, {
      role: "user"
    }, null, memberId)) return;
    appWindow.document.querySelector(".group-mute-dialog-overlay")?.remove();
    const overlay = appWindow.document.createElement("div");
    overlay.className = "group-mute-dialog-overlay";
    const mute = group.groupMutes?.[memberId];
    overlay.innerHTML = "<section class=\"group-mute-dialog\" role=\"dialog\" aria-modal=\"true\" aria-label=\"禁止发言\"><strong>禁止 " + escapeHtml(memberName(member)) + " 发言</strong>" + (imApp.isGroupMemberMuted(group, memberId) ? "<p>禁言至 " + escapeHtml(new Date(mute.until).toLocaleString()) + "</p>" : "") + "<label>禁言时长<select class=\"group-mute-preset\" aria-label=\"禁言时长\">" + [10, 60, 720, 1440, 10080, 43200].map(minutes => "<option value=\"" + minutes + "\">" + formatMuteDuration(minutes) + "</option>").join("") + "<option value=\"custom\">自定义</option></select></label><div class=\"group-mute-custom\" hidden><input type=\"number\" min=\"1\" step=\"1\" value=\"1\" aria-label=\"自定义时长\"><select aria-label=\"时长单位\"><option value=\"1\">分钟</option><option value=\"60\">小时</option><option value=\"1440\">天</option></select></div><div class=\"group-management-buttons\"><button data-action=\"cancel\">取消</button>" + (imApp.isGroupMemberMuted(group, memberId) ? "<button data-action=\"unmute\">解除禁言</button>" : "") + "<button data-action=\"mute\">确认禁言</button></div></section>";
    (appWindow.document.getElementById("app") || appWindow.document.body).appendChild(overlay);
    const preset = overlay.querySelector(".group-mute-preset"),
      customDuration = overlay.querySelector(".group-mute-custom");
    preset.addEventListener("change", () => {
      customDuration.hidden = preset.value !== "custom";
    });
    overlay.addEventListener("keydown", event => {
      if (event.key === "Escape") overlay.remove();
    });
    overlay.addEventListener("click", async event => {
      if (event.target === overlay || event.target.dataset.action === "cancel") {
        overlay.remove();
        return;
      }
      const choice = event.target.dataset.action;
      if (!["mute", "unmute"].includes(choice)) return;
      const customValue = Number(customDuration.querySelector("input").value),
        durationMinutes = preset.value === "custom" ? customValue * Number(customDuration.querySelector("select").value) : Number(preset.value);
      if (choice === "mute" && (preset.value === "custom" && (!Number.isSafeInteger(customValue) || customValue < 1) || !Number.isSafeInteger(durationMinutes) || durationMinutes < 1)) {
        appWindow.showToast?.("请输入正整数时长");
        return;
      }
      overlay.querySelectorAll("button").forEach(button => button.disabled = true);
      const result = await imApp.performGroupManagement(group.id, {
        role: "user"
      }, {
        type: "group_" + choice,
        targetMemberId: memberId,
        durationMinutes: durationMinutes
      });
      result.success ? (overlay.remove(), appWindow.showToast?.(choice === "mute" ? "已禁止发言" : "已解除禁言")) : (overlay.querySelectorAll("button").forEach(button => button.disabled = false), appWindow.showToast?.("禁言设置保存失败"));
    });
    preset.focus();
  };
  appWindow.addEventListener?.("u2:group-management-updated", scheduleNextExpiry);
  appWindow.addEventListener?.("u2:background-activity-tick", reconcileAllGroupMutes);
  appWindow.addEventListener?.("focus", reconcileAllGroupMutes);
  appWindow.addEventListener?.("u2:native-resume", reconcileAllGroupMutes);
  appWindow.document?.addEventListener("visibilitychange", () => {
    if (!appWindow.document.hidden) reconcileAllGroupMutes();
  });
  appWindow.document?.addEventListener("imessage-data-ready", reconcileAllGroupMutes);
  (appWindow.u2OnStorageReady || (callback => appWindow.document?.addEventListener("DOMContentLoaded", callback)))(scheduleNextExpiry);
})(typeof window !== "undefined" ? window : globalThis);
