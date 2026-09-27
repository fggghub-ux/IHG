(window.u2OnStorageReady || (callback => document.addEventListener("DOMContentLoaded", callback)))(() => {
  const {
      openView: openView_3,
      closeView: closeView_2,
      showToast: showToast_2
    } = window,
    createGroupSheet = document.getElementById("create-group-sheet"),
    groupPrivateChatDetailModal_2 = document.getElementById("group-details-sheet"),
    groupEditSheet = document.getElementById("group-edit-sheet"),
    groupDetailsEditBtn = document.getElementById("group-details-edit-btn"),
    groupDetailsSettingsBtn = document.getElementById("group-details-settings-btn"),
    groupDetailsSearchBtnElement = document.getElementById("group-details-search-btn"),
    groupContextSettingsSheet = document.getElementById("group-context-settings-sheet"),
    groupDetailsMoreBtn = document.getElementById("group-details-more-btn"),
    groupMoreSheet = document.getElementById("group-more-sheet"),
    groupMemberManageSheet = document.getElementById("group-member-manage-sheet"),
    groupCallBtn = document.getElementById("group-call-btn"),
    groupPollBtn = document.getElementById("group-poll-btn"),
    groupPollCreateSheet = document.getElementById("group-poll-create-sheet"),
    groupPollCreateClose = document.getElementById("group-poll-create-close"),
    groupPollQuestionInput = document.getElementById("group-poll-question-input"),
    groupPollOptionsList = document.getElementById("group-poll-options-list"),
    groupPollOptionCount = document.getElementById("group-poll-option-count"),
    groupPollAddOptionBtn = document.getElementById("group-poll-add-option-btn"),
    groupPollSubmitBtn = document.getElementById("group-poll-submit-btn"),
    groupCallInviteSheet = document.getElementById("group-call-invite-sheet"),
    groupCallMembersList = document.getElementById("group-call-members-list"),
    groupCallStartBtn = document.getElementById("group-call-start-btn"),
    groupContextEnabledToggle = document.getElementById("group-context-enabled-toggle"),
    groupContextLimitInput = document.getElementById("group-context-limit-input"),
    groupTimeAwareToggle = document.getElementById("group-time-aware-toggle"),
    groupAutoExpandTranslationToggle = document.getElementById("group-auto-expand-translation-toggle"),
    groupShowUserAvatarToggle = document.getElementById("group-show-user-avatar-toggle"),
    groupMemberPrivateChatsToggle = document.getElementById("group-member-private-chats-toggle"),
    groupMemberFriendPrivateChatsToggle = document.getElementById("group-member-friend-private-chats-toggle"),
    groupManualSummaryBtn = document.getElementById("group-manual-summary-btn"),
    groupMemoryShortTermBtn = document.getElementById("group-memory-shortterm-btn"),
    groupMemoryLongTermBtn = document.getElementById("group-memory-longterm-btn"),
    groupMemoryShortTermCount = document.getElementById("group-memory-shortterm-count"),
    groupMemoryLongTermCount = document.getElementById("group-memory-longterm-count"),
    groupWorldBookBtnElement = document.getElementById("group-world-book-btn"),
    groupWorldBookCountElement = document.getElementById("group-world-book-count"),
    groupSummaryMoreStats = document.getElementById("group-summary-more-stats"),
    groupSummaryMoreList = document.getElementById("group-summary-more-list"),
    confirmGroupContextBtn = document.getElementById("confirm-group-context-btn"),
    confirmGroupEditBtn = document.getElementById("confirm-group-edit-btn"),
    groupEditNameInput = document.getElementById("group-edit-name-input"),
    groupBgUploadIcon = document.getElementById("group-bg-upload-icon"),
    groupBgResetIcon = document.getElementById("group-bg-reset-icon"),
    groupBgUpload = document.getElementById("group-bg-upload"),
    groupAddMemberBtn = document.getElementById("group-add-member-btn"),
    groupAddMemberSheet = document.getElementById("group-add-member-sheet"),
    groupAddMemberList = document.getElementById("group-add-member-list"),
    groupPrivateChatDetailModal = document.getElementById("group-private-chat-detail-modal"),
    groupPrivateChatDetailTitle = document.getElementById("group-private-chat-detail-title"),
    groupPrivateChatDetailSubtitle = document.getElementById("group-private-chat-detail-subtitle"),
    groupPrivateChatDetailMessages = document.getElementById("group-private-chat-detail-messages"),
    groupPrivateChatDetailClose = document.getElementById("group-private-chat-detail-close");
  let tempGroupMembers = [],
    currentViewingGroup = null;
  function escapeGroupHtml(value_2) {
    return String(value_2 ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  function handleAction_5(value_21) {
    const value_22 = Number(value_21) || 0;
    if (!value_22) return "";
    const date = new Date(value_22);
    return date.getMonth() + 1 + "/" + date.getDate() + " " + date.getHours().toString().padStart(2, "0") + ":" + date.getMinutes().toString().padStart(2, "0");
  }
  function getPrivateChatMessageTranslation(message_2) {
    if (!message_2 || typeof message_2 !== "object") return "";
    return typeof message_2.translation === "string" && message_2.translation.trim() ? message_2.translation.trim() : typeof message_2.translationZh === "string" && message_2.translationZh.trim() ? message_2.translationZh.trim() : typeof message_2.trans === "string" && message_2.trans.trim() ? message_2.trans.trim() : "";
  }
  function handleAction_6(message_3) {
    const text_2 = escapeGroupHtml(message_3?.text || ""),
      privateChatMessageTranslation = getPrivateChatMessageTranslation(message_3);
    if (!privateChatMessageTranslation) return "<div class=\"group-private-chat-detail-bubble\"><span class=\"group-private-chat-detail-original\">" + text_2 + "</span></div>";
    return "\n            <button type=\"button\" class=\"group-private-chat-detail-bubble has-translation\" aria-expanded=\"false\" title=\"点击展开翻译\">\n                <span class=\"group-private-chat-detail-original\">" + text_2 + "</span>\n                <span class=\"group-private-chat-detail-translation\" hidden>" + escapeGroupHtml(privateChatMessageTranslation) + "</span>\n            </button>\n        ";
  }
  function togglePrivateChatDetailTranslation(button) {
    if (!button) return;
    const translation_2 = button.querySelector(".group-private-chat-detail-translation");
    if (!translation_2) return;
    const willExpand = translation_2.hidden;
    translation_2.hidden = !willExpand;
    button.classList.toggle("is-expanded", willExpand);
    button.setAttribute("aria-expanded", willExpand ? "true" : "false");
    button.title = willExpand ? "点击收起翻译" : "点击展开翻译";
  }
  function closeGroupPrivateChatDetail() {
    if (groupPrivateChatDetailModal) closeView_2(groupPrivateChatDetailModal);
  }
  window.imApp.openGroupPrivateChatDetail = function (snapshot) {
    if (!groupPrivateChatDetailModal || !groupPrivateChatDetailMessages || !snapshot) return false;
    const senderName_2 = snapshot.senderName || "群成员",
      recipientName_2 = snapshot.recipientName || "好友",
      messages_2 = Array.isArray(snapshot.messages) ? snapshot.messages : [];
    if (messages_2.length === 0) return false;
    return groupPrivateChatDetailTitle && (groupPrivateChatDetailTitle.textContent = senderName_2 + " 与 " + recipientName_2), groupPrivateChatDetailSubtitle && (groupPrivateChatDetailSubtitle.textContent = "本次私信记录 · " + messages_2.length + " 条"), groupPrivateChatDetailMessages.innerHTML = messages_2.map((message_4, index_2) => {
      const isSender = message_4?.role === "char",
        displayName = isSender ? senderName_2 : recipientName_2,
        previousRole = index_2 > 0 ? messages_2[index_2 - 1]?.role : null,
        isGroupStart = index_2 === 0 || previousRole !== message_4?.role;
      return "\n                <div class=\"group-private-chat-detail-row" + (isSender ? " is-sender" : "") + (isGroupStart ? " is-group-start" : "") + "\">\n                    " + (isGroupStart ? "<div class=\"group-private-chat-detail-name\">" + escapeGroupHtml(displayName) + "</div>" : "") + "\n                    " + handleAction_6(message_4) + "\n                </div>\n            ";
    }).join(""), groupPrivateChatDetailMessages.querySelectorAll(".group-private-chat-detail-bubble.has-translation").forEach(bubble => {
      bubble.addEventListener("click", () => togglePrivateChatDetailTranslation(bubble));
    }), openView_3(groupPrivateChatDetailModal), requestAnimationFrame(() => {
      groupPrivateChatDetailMessages.scrollTop = 0;
    }), true;
  };
  function isSelectableGroupMember(friend) {
    return !!friend && (friend.type === "char" || friend.type === "npc");
  }
  function getAvailableGroupAccounts() {
    return typeof window.getAccounts === "function" ? window.getAccounts() : [];
  }
  async function commitCurrentGroupChange(value_37, value_38 = {}) {
    if (!currentViewingGroup) return false;
    return window.imApp.commitScopedFriendChange(currentViewingGroup, value_39 => {
      if (!value_39) return;
      return currentViewingGroup = value_39, value_37(value_39);
    }, {
      syncActive: true,
      metaOnly: value_38.metaOnly !== false,
      ...value_38
    });
  }
  async function commitContactsFriendChange(friendOrId, mutator, options_2 = {}) {
    return window.imApp.commitScopedFriendChange(friendOrId, mutator, {
      syncActive: false,
      metaOnly: options_2.metaOnly !== false,
      ...options_2
    });
  }
  function resolveLatestGroup(groupOrId = currentViewingGroup) {
    const groupId_2 = groupOrId && typeof groupOrId === "object" ? groupOrId.id : groupOrId,
      group_2 = (window.imData?.friends || []).find(item_2 => String(item_2.id) === String(groupId_2)) || (groupOrId && typeof groupOrId === "object" ? groupOrId : null);
    if (!group_2 || group_2.type !== "group") return null;
    return group_2.memory = window.imApp.normalizeFriendData(group_2).memory, currentViewingGroup = group_2, group_2;
  }
  function getResolvedGroupMembers(group_3) {
    if (!group_3 || group_3.type !== "group") return [];
    if (typeof window.imChat?.getGroupMemberFriends === "function") return window.imChat.getGroupMemberFriends(group_3);
    const seenIds = new Set();
    return (Array.isArray(group_3.members) ? group_3.members : []).map(memberRef => {
      const normalizedRef = String(memberRef == null ? "" : memberRef).trim();
      if (!normalizedRef) return null;
      return (window.imData?.friends || []).find(friend_2 => isSelectableGroupMember(friend_2) && (String(friend_2.id) === normalizedRef || String(friend_2.nickname || "").trim() === normalizedRef || String(friend_2.realName || "").trim() === normalizedRef)) || null;
    }).filter(value_48 => {
      if (!value_48) return false;
      const memberId_2 = String(value_48.id);
      if (seenIds.has(memberId_2)) return false;
      return seenIds.add(memberId_2), true;
    });
  }
  function getCanonicalGroupMemberIds(group_4) {
    return getResolvedGroupMembers(group_4).map(member => String(member.id));
  }
  function getGroupMemberCount(group_5) {
    const userIsInGroup = !(group_5 && Number(group_5.leftGroupAt) > 0);
    return getResolvedGroupMembers(group_5).length + (userIsInGroup ? 1 : 0);
  }
  function formatGroupMemberCount(count_2) {
    const safeCount = Math.max(0, Number(count_2) || 0);
    return safeCount + " member" + (safeCount === 1 ? "" : "s");
  }
  function syncGroupHeaderMemberCount(group_6) {
    if (!group_6?.id) return;
    const page = document.getElementById("chat-interface-" + group_6.id),
      signEl = page ? page.querySelector(".ins-chat-sign") : null;
    if (signEl) signEl.textContent = formatGroupMemberCount(getGroupMemberCount(group_6));
  }
  function refreshGroupMembershipUi(group_7) {
    const refreshedGroup = resolveLatestGroup(group_7) || group_7;
    if (!refreshedGroup) return null;
    syncGroupHeaderMemberCount(refreshedGroup);
    if (window.imApp.openGroupDetails) window.imApp.openGroupDetails(refreshedGroup);
    if (window.imApp.renderGroupsList) window.imApp.renderGroupsList({
      force: true
    });
    if (window.imChat?.renderChatsList) window.imChat.renderChatsList();
    return refreshedGroup;
  }
  window.imApp.calculateChatMemoryTokenEstimate = window.imApp.calculateChatMemoryTokenEstimate || function (value_55) {
    const value_56 = window.imApp.getLastChatApiUsage ? window.imApp.getLastChatApiUsage(value_55) : null;
    return Number.isFinite(Number(value_56?.totalTokens)) ? Math.max(0, Math.round(Number(value_56.totalTokens))) : 0;
  };
  function renderGroupSummaryMorePanel_2(value_57 = currentViewingGroup) {
    const latestGroup = resolveLatestGroup(value_57);
    if (!latestGroup) return;
    const value_58 = Array.isArray(latestGroup.messages) ? latestGroup.messages : [],
      value_59 = window.imApp.getFriendMessageCount ? window.imApp.getFriendMessageCount(latestGroup) : Number(latestGroup.messageCount) || value_58.length,
      summaries = Array.isArray(latestGroup.memory?.shortTermEntries) ? latestGroup.memory.shortTermEntries : [],
      value_61 = window.imApp.getLastChatApiUsage ? window.imApp.getLastChatApiUsage(latestGroup) : null,
      tokenEstimate = window.imApp.calculateChatMemoryTokenEstimate ? window.imApp.calculateChatMemoryTokenEstimate(latestGroup) : 0,
      value_63 = value_61?.inputTokens != null || value_61?.outputTokens != null ? "输入 " + (value_61?.inputTokens != null ? Math.max(0, Math.round(Number(value_61.inputTokens))).toLocaleString() : "—") + " · 输出 " + (value_61?.outputTokens != null ? Math.max(0, Math.round(Number(value_61.outputTokens))).toLocaleString() : "—") : "发送消息后显示；需接口返回 usage";
    groupSummaryMoreStats && (groupSummaryMoreStats.innerHTML = "\n                <div class=\"group-summary-stat-card\">\n                    <span>群聊总条数</span>\n                    <strong>" + value_59 + "</strong>\n                </div>\n                <div class=\"group-summary-stat-card\">\n                    <span>最近一次 API 实测</span>\n                    <strong>" + (value_61?.totalTokens != null ? tokenEstimate.toLocaleString() + " TK" : value_61 ? "未返回总量" : "暂未实测") + "</strong>\n                    <small>" + value_63 + "</small>\n                </div>\n            ");
    if (!groupSummaryMoreList) return;
    if (summaries.length === 0) {
      groupSummaryMoreList.innerHTML = "<div class=\"group-summary-empty\">暂无群聊总结</div>";
      return;
    }
    groupSummaryMoreList.innerHTML = summaries.slice().reverse().map(entry => "\n            <button type=\"button\" class=\"group-summary-card\" data-summary-id=\"" + escapeGroupHtml(entry.id || "") + "\">\n                <div class=\"group-summary-card-main\">\n                    <div class=\"group-summary-card-title\">" + escapeGroupHtml(entry.title || "群聊总结") + "</div>\n                    <div class=\"group-summary-card-time\">" + escapeGroupHtml(entry.time || "未记录时间") + "</div>\n                    <div class=\"group-summary-card-event\">" + escapeGroupHtml(entry.event || entry.memoryPoints || "点击编辑这条总结") + "</div>\n                </div>\n                <span class=\"group-summary-card-delete\" data-summary-delete=\"" + escapeGroupHtml(entry.id || "") + "\" title=\"删除总结\" aria-label=\"删除总结\">\n                    <i class=\"fas fa-trash-alt\"></i>\n                </span>\n            </button>\n        ").join("");
    groupSummaryMoreList.querySelectorAll(".group-summary-card").forEach(card => {
      card.addEventListener("click", event_2 => {
        const deleteTarget = event_2.target.closest("[data-summary-delete]");
        if (deleteTarget) {
          event_2.preventDefault();
          event_2.stopPropagation();
          deleteGroupSummary_2(deleteTarget.getAttribute("data-summary-delete") || "");
          return;
        }
        openGroupSummaryDetail_2(card.getAttribute("data-summary-id") || "");
      });
    });
  }
  function hideGroupSummaryDetailModal() {
    const modal = document.getElementById("group-summary-detail-modal");
    if (modal && window.closeView) window.closeView(modal);
  }
  function handleAction_9() {
    let modal_2 = document.getElementById("group-summary-detail-modal");
    if (modal_2) return modal_2;
    return modal_2 = document.createElement("div"), modal_2.id = "group-summary-detail-modal", modal_2.className = "bottom-sheet-overlay detail-sheet-overlay wb-centered-modal-overlay group-summary-detail-modal", modal_2.style.zIndex = "920", modal_2.innerHTML = "\n            <div class=\"wb-centered-modal-card group-summary-detail-card\">\n                <div class=\"group-summary-detail-header\">\n                    <div>\n                        <div class=\"group-summary-detail-title\">编辑群聊总结</div>\n                        <div class=\"group-summary-detail-subtitle\" id=\"group-summary-detail-subtitle\"></div>\n                    </div>\n                    <button type=\"button\" class=\"group-summary-detail-close\" aria-label=\"关闭\">\n                        <i class=\"fas fa-times\"></i>\n                    </button>\n                </div>\n                <div class=\"group-summary-detail-body\">\n                    <label class=\"group-summary-detail-field\">\n                        <span>标题</span>\n                        <input type=\"text\" id=\"group-summary-detail-title-input\" maxlength=\"40\">\n                    </label>\n                    <label class=\"group-summary-detail-field\">\n                        <span>事件</span>\n                        <textarea id=\"group-summary-detail-event-input\" rows=\"5\"></textarea>\n                    </label>\n                    <label class=\"group-summary-detail-field\">\n                        <span>记忆点</span>\n                        <textarea id=\"group-summary-detail-points-input\" rows=\"4\"></textarea>\n                    </label>\n                    <div class=\"group-summary-detail-actions\">\n                        <button type=\"button\" class=\"group-summary-detail-delete\" id=\"group-summary-detail-delete-btn\">删除</button>\n                        <button type=\"button\" class=\"group-summary-detail-save\" id=\"group-summary-detail-save-btn\">保存</button>\n                    </div>\n                </div>\n            </div>\n        ", document.body.appendChild(modal_2), modal_2.addEventListener("click", event_67 => {
      if (event_67.target === modal_2) hideGroupSummaryDetailModal();
    }), modal_2.querySelector(".group-summary-detail-close")?.addEventListener("click", hideGroupSummaryDetailModal), modal_2.querySelector("#group-summary-detail-save-btn")?.addEventListener("click", () => {
      saveGroupSummaryDetail(modal_2.dataset.summaryId || "");
    }), modal_2.querySelector("#group-summary-detail-delete-btn")?.addEventListener("click", () => {
      deleteGroupSummary_2(modal_2.dataset.summaryId || "", {
        closeDetail: true
      });
    }), modal_2;
  }
  function openGroupSummaryDetail_2(value_68) {
    const latestGroup_69 = resolveLatestGroup();
    if (!latestGroup_69 || !value_68) return;
    const value_70 = Array.isArray(latestGroup_69.memory?.shortTermEntries) ? latestGroup_69.memory.shortTermEntries : [],
      entry_2 = value_70.find(value_72 => String(value_72.id) === String(value_68));
    if (!entry_2) return;
    const modal_3 = handleAction_9();
    modal_3.dataset.summaryId = String(entry_2.id);
    const titleInput = modal_3.querySelector("#group-summary-detail-title-input"),
      eventInput = modal_3.querySelector("#group-summary-detail-event-input"),
      pointsInput = modal_3.querySelector("#group-summary-detail-points-input"),
      subtitle = modal_3.querySelector("#group-summary-detail-subtitle");
    if (titleInput) titleInput.value = entry_2.title || "群聊总结";
    if (eventInput) eventInput.value = entry_2.event || "";
    if (pointsInput) pointsInput.value = entry_2.memoryPoints || "";
    if (subtitle) subtitle.textContent = entry_2.time ? "总结时间：" + entry_2.time : "总结时间：未记录";
    if (window.openView) window.openView(modal_3);
  }
  async function saveGroupSummaryDetail(value_73) {
    if (!value_73) return;
    const modal_4 = handleAction_9(),
      title_2 = String(modal_4.querySelector("#group-summary-detail-title-input")?.value || "").trim() || "群聊总结",
      event_3 = String(modal_4.querySelector("#group-summary-detail-event-input")?.value || "").trim(),
      memoryPoints_2 = String(modal_4.querySelector("#group-summary-detail-points-input")?.value || "").trim(),
      saved_2 = await commitCurrentGroupChange(value_79 => {
        value_79.memory = window.imApp.normalizeFriendData(value_79).memory;
        const value_80 = Array.isArray(value_79.memory.shortTermEntries) ? value_79.memory.shortTermEntries : [],
          entry_3 = value_80.find(value_82 => String(value_82.id) === String(value_73));
        if (!entry_3) return;
        entry_3.title = title_2;
        entry_3.event = event_3;
        entry_3.memoryPoints = memoryPoints_2;
      }, {
        silent: true
      });
    if (!saved_2) {
      if (window.showToast) window.showToast("群聊总结保存失败");
      return;
    }
    renderGroupSummaryMorePanel_2(currentViewingGroup);
    if (window.imApp.renderMemoryView) window.imApp.renderMemoryView();
    hideGroupSummaryDetailModal();
    if (window.showToast) window.showToast("群聊总结已保存");
  }
  async function removeGroupSummaryEntry(entryId, options_3 = {}) {
    const saved = await commitCurrentGroupChange(targetGroup => {
      targetGroup.memory = window.imApp.normalizeFriendData(targetGroup).memory;
      const entries = Array.isArray(targetGroup.memory.shortTermEntries) ? targetGroup.memory.shortTermEntries : [];
      targetGroup.memory.shortTermEntries = window.imDataUtils?.removeShortTermSummaryEntry ? window.imDataUtils.removeShortTermSummaryEntry(entries, entryId) : entries.filter(item => !item || String(item.id) !== String(entryId));
    }, {
      silent: true
    });
    if (!saved) {
      if (window.showToast) window.showToast("群聊总结删除失败");
      return;
    }
    renderGroupSummaryMorePanel_2(currentViewingGroup);
    if (window.imApp.renderMemoryView) window.imApp.renderMemoryView();
    if (options_3.closeDetail) hideGroupSummaryDetailModal();
    if (window.showToast) window.showToast("群聊总结已删除");
  }
  function deleteGroupSummary_2(entryId_2, options_4 = {}) {
    if (!entryId_2) return;
    const doDelete = () => removeGroupSummaryEntry(entryId_2, options_4);
    if (window.showCustomModal) {
      window.showCustomModal({
        title: "删除群聊总结",
        message: "确定删除这条群聊总结吗？此操作不可恢复。",
        confirmText: "删除",
        isDestructive: true,
        onConfirm: doDelete
      });
      return;
    }
    if (window.confirm && !window.confirm("确定删除这条群聊总结吗？")) return;
    doDelete();
  }
  window.imApp.renderGroupSummaryMorePanel = renderGroupSummaryMorePanel_2;
  window.imApp.openGroupSummaryDetail = openGroupSummaryDetail_2;
  window.imApp.deleteGroupSummary = deleteGroupSummary_2;
  function getGroupUserDisplayMeta(group_8) {
    if (window.imApp?.getGroupUserIdentity) {
      const identity = window.imApp.getGroupUserIdentity(group_8);
      return {
        id: identity.accountId || "__user__",
        name: identity.name,
        avatarUrl: identity.avatarUrl,
        persona: identity.persona,
        signature: identity.signature
      };
    }
    const currentAccountId = typeof window.getCurrentAccountId === "function" ? window.getCurrentAccountId() : null,
      accounts = getAvailableGroupAccounts(),
      currentAccount = accounts.find(acc_2 => String(acc_2.id) === String(currentAccountId)) || null,
      override = group_8 && group_8.memory ? group_8.memory.userOverride || null : null,
      fallbackName = window.userState && (window.userState.name || window.userState.realName) || currentAccount?.name || "Me",
      fallbackAvatar = window.userState && (window.userState.avatarUrl || window.userState.avatar) || currentAccount?.avatarUrl || currentAccount?.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(fallbackName) + "&background=random";
    return {
      id: override?.id || currentAccount?.id || "__user__",
      name: override?.name || fallbackName,
      avatarUrl: override?.avatarUrl || override?.avatar || fallbackAvatar,
      persona: override?.persona || currentAccount?.persona || (window.userState ? window.userState.persona : "") || "",
      signature: override?.signature || currentAccount?.signature || ""
    };
  }
  function setGroupAvatar(src_2) {
    const groupAvatarImgElement = document.getElementById("group-avatar-img"),
      icon = document.getElementById("group-avatar-icon");
    if (!groupAvatarImgElement || !icon) return;
    src_2 ? (groupAvatarImgElement.src = src_2, groupAvatarImgElement.style.display = "block", icon.style.display = "none") : (groupAvatarImgElement.src = "", groupAvatarImgElement.style.display = "none", icon.style.display = "block");
  }
  function updateCreateGroupConfirmBtn() {
    const confirmCreateGroupBtnElement_93 = document.getElementById("confirm-create-group-btn");
    if (!confirmCreateGroupBtnElement_93) return;
    tempGroupMembers.length > 0 ? (confirmCreateGroupBtnElement_93.style.opacity = "1", confirmCreateGroupBtnElement_93.style.pointerEvents = "auto") : (confirmCreateGroupBtnElement_93.style.opacity = "0.5", confirmCreateGroupBtnElement_93.style.pointerEvents = "none");
  }
  function renderCreateGroupMembersList() {
    const list = document.getElementById("create-group-members-list");
    if (!list) return;
    list.innerHTML = "";
    const filter_94 = window.imData.friends.filter(isSelectableGroupMember);
    filter_94.forEach(value_95 => {
      const element_96 = document.createElement("div");
      element_96.className = "line-list-item";
      const friendId_2 = String(value_95.id),
        isSelected = tempGroupMembers.some(id_2 => String(id_2) === friendId_2),
        value_99 = value_95.avatarUrl ? "<img src=\"" + value_95.avatarUrl + "\" style=\"width:100%;height:100%;object-fit:cover;\">" : value_95.type === "npc" ? "<i class=\"fas fa-robot\"></i>" : "<i class=\"fas fa-user\"></i>";
      element_96.innerHTML = "\n                <div style=\"width: 24px; height: 24px; border-radius: 50%; border: 1px solid " + (isSelected ? "#007aff" : "#c7c7cc") + "; background: " + (isSelected ? "#007aff" : "transparent") + "; display: flex; justify-content: center; align-items: center; color: #fff; font-size: 12px; margin-right: 5px;\">\n                    " + (isSelected ? "<i class=\"fas fa-check\"></i>" : "") + "\n                </div>\n                <div class=\"line-item-avatar\">" + value_99 + "</div>\n                <div class=\"line-item-text\" style=\"flex: 1;\">" + value_95.nickname + "</div>\n            ";
      element_96.addEventListener("click", () => {
        isSelected ? tempGroupMembers = tempGroupMembers.filter(value_101 => String(value_101) !== friendId_2) : tempGroupMembers.push(friendId_2);
        renderCreateGroupMembersList();
        updateCreateGroupConfirmBtn();
      });
      list.appendChild(element_96);
    });
  }
  function openCreateGroupSheet() {
    tempGroupMembers = [];
    const nameInput = document.getElementById("group-name-input");
    if (nameInput) nameInput.value = "";
    const includeUserInput = document.getElementById("create-group-include-user");
    if (includeUserInput) includeUserInput.checked = true;
    setGroupAvatar(null);
    renderCreateGroupMembersList();
    updateCreateGroupConfirmBtn();
    openView_3(createGroupSheet);
  }
  let lastGroupsListSnapshot = [];
  function getGroupsListRenderSnapshot() {
    return (window.imData.friends || []).filter(friend_3 => friend_3.type === "group").map(group_9 => ({
      group: group_9,
      id: group_9.id,
      nickname: group_9.nickname,
      avatarUrl: group_9.avatarUrl || ""
    }));
  }
  function isSameGroupsListSnapshot(nextSnapshot) {
    return nextSnapshot.length === lastGroupsListSnapshot.length && nextSnapshot.every((row, index) => {
      const previous = lastGroupsListSnapshot[index];
      return previous && previous.group === row.group && previous.id === row.id && previous.nickname === row.nickname && previous.avatarUrl === row.avatarUrl;
    });
  }
  function renderGroupsList_2(options_5 = {}) {
    const groupsContent = document.getElementById("groups-content");
    if (!groupsContent) return;
    const nextSnapshot_2 = getGroupsListRenderSnapshot(),
      hasCurrentItems = groupsContent.children.length === nextSnapshot_2.length + 1;
    if (!options_5.force && hasCurrentItems && isSameGroupsListSnapshot(nextSnapshot_2)) return false;
    groupsContent.innerHTML = "\n            <div class=\"line-list-item\" id=\"create-group-trigger\">\n                <div class=\"line-item-icon bg-light\"><i class=\"fas fa-users\"></i></div>\n                <div class=\"line-item-text\">Create group</div>\n            </div>\n        ";
    const createGroupTrigger = document.getElementById("create-group-trigger");
    createGroupTrigger && createGroupTrigger.addEventListener("click", () => {
      openCreateGroupSheet();
    });
    const groups = window.imData.friends.filter(f_2 => f_2.type === "group");
    return groups.forEach(group_10 => {
      const item_3 = document.createElement("div");
      item_3.className = "line-list-item";
      const value_111 = group_10.avatarUrl ? "<img src=\"" + group_10.avatarUrl + "\" style=\"width:100%;height:100%;object-fit:cover;\">" : "<div style=\"width: 100%; height: 100%; background: linear-gradient(135deg, #ff9a9e, #fecfef); color: white; display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: 20px;\">" + group_10.nickname.charAt(0).toUpperCase() + "</div>";
      item_3.innerHTML = "\n                <div class=\"line-item-avatar\">" + value_111 + "</div>\n                <div class=\"line-item-text\">" + group_10.nickname + "</div>\n            ";
      item_3.addEventListener("click", () => {
        if (window.imApp.openChatTab) window.imApp.openChatTab(group_10);
      });
      groupsContent.appendChild(item_3);
    }), lastGroupsListSnapshot = nextSnapshot_2, true;
  }
  function handleAction_15() {
    if (!currentViewingGroup || !groupEditSheet) return;
    groupEditNameInput && (groupEditNameInput.value = currentViewingGroup.nickname || "");
    openView_3(groupEditSheet);
  }
  function handleAction_16() {
    if (!currentViewingGroup || !groupContextSettingsSheet) return;
    currentViewingGroup = resolveLatestGroup(currentViewingGroup) || currentViewingGroup;
    window.imApp.refreshOnlinePromptSettingsLabel?.(currentViewingGroup);
    currentViewingGroup.memory = currentViewingGroup.memory || window.imApp.createDefaultMemory();
    currentViewingGroup.memory.context = currentViewingGroup.memory.context || {};
    const checked_2 = typeof currentViewingGroup.memory.context.enabled === "boolean" ? currentViewingGroup.memory.context.enabled : true,
      value_3 = Number(currentViewingGroup.memory.context.limit) > 0 ? Number(currentViewingGroup.memory.context.limit) : 100;
    groupContextEnabledToggle && (groupContextEnabledToggle.checked = checked_2);
    groupContextLimitInput && (groupContextLimitInput.value = value_3);
    groupTimeAwareToggle && (groupTimeAwareToggle.checked = currentViewingGroup.timeAware !== false);
    groupAutoExpandTranslationToggle && (groupAutoExpandTranslationToggle.checked = currentViewingGroup.autoExpandTranslation === true);
    groupShowUserAvatarToggle && (groupShowUserAvatarToggle.checked = currentViewingGroup.showGroupUserAvatar === true);
    groupMemberPrivateChatsToggle && (groupMemberPrivateChatsToggle.checked = currentViewingGroup.allowGroupMemberPrivateChats !== false);
    groupMemberFriendPrivateChatsToggle && (groupMemberFriendPrivateChatsToggle.checked = currentViewingGroup.allowGroupMemberFriendPrivateChats !== false);
    refreshGroupMemoryCounts(currentViewingGroup);
    handleAction_17(currentViewingGroup);
    openView_3(groupContextSettingsSheet);
  }
  function refreshGroupMemoryCounts(group_11) {
    const normalized = group_11 ? window.imApp.normalizeFriendData(group_11) : null,
      memory_2 = normalized?.memory || {},
      shortCount = Array.isArray(memory_2.shortTermEntries) ? memory_2.shortTermEntries.length : 0,
      longCount = Array.isArray(memory_2.longTermEntries) ? memory_2.longTermEntries.length : 0;
    if (groupMemoryShortTermCount) groupMemoryShortTermCount.textContent = shortCount > 0 ? shortCount + "项" : "";
    if (groupMemoryLongTermCount) groupMemoryLongTermCount.textContent = longCount > 0 ? longCount + "项" : "";
  }
  function handleAction_17(group_12) {
    const normalized_2 = group_12 ? window.imApp.normalizeFriendData(group_12) : null,
      value_121 = Array.isArray(normalized_2?.boundBooks) ? normalized_2.boundBooks.length : 0;
    if (groupWorldBookCountElement) groupWorldBookCountElement.textContent = value_121 > 0 ? value_121 + "本" : "";
  }
  function openGroupAddMemberSheet() {
    if (!currentViewingGroup || !groupAddMemberSheet || !groupAddMemberList) return;
    groupAddMemberList.innerHTML = "";
    const filter_122 = window.imData.friends.filter(isSelectableGroupMember),
      currentMemberIds = new Set(getCanonicalGroupMemberIds(currentViewingGroup));
    filter_122.forEach(friend_4 => {
      const isAlreadyInGroup = currentMemberIds.has(String(friend_4.id)),
        element_126 = document.createElement("div");
      element_126.className = "line-list-item";
      isAlreadyInGroup && (element_126.style.opacity = "0.5", element_126.style.pointerEvents = "none");
      const value_127 = friend_4.avatarUrl ? "<img src=\"" + friend_4.avatarUrl + "\" style=\"width:100%;height:100%;object-fit:cover;\">" : friend_4.type === "npc" ? "<i class=\"fas fa-robot\"></i>" : "<i class=\"fas fa-user\"></i>";
      element_126.innerHTML = "\n                <div class=\"line-item-avatar\">" + value_127 + "</div>\n                <div class=\"line-item-text\" style=\"flex: 1;\">" + friend_4.nickname + "</div>\n                " + (isAlreadyInGroup ? "<div style=\"font-size: 13px; color: #8e8e93; margin-right: 15px;\">已在群内</div>" : "<div style=\"width: 28px; height: 28px; border-radius: 50%; background: #007aff; color: #fff; display: flex; justify-content: center; align-items: center; cursor: pointer; margin-right: 15px;\"><i class=\"fas fa-plus\" style=\"font-size: 12px;\"></i></div>") + "\n            ";
      !isAlreadyInGroup && element_126.addEventListener("click", async () => {
        const value_128 = await commitCurrentGroupChange(targetGroup_2 => {
          const members_2 = getCanonicalGroupMemberIds(targetGroup_2);
          !members_2.includes(String(friend_4.id)) && members_2.push(String(friend_4.id));
          targetGroup_2.members = members_2;
        }, {
          silent: true
        });
        if (!value_128) {
          if (window.showToast) window.showToast("邀请 " + friend_4.nickname + " 失败");
          return;
        }
        element_126.style.opacity = "0.5";
        element_126.style.pointerEvents = "none";
        element_126.innerHTML = "\n                        <div class=\"line-item-avatar\">" + value_127 + "</div>\n                        <div class=\"line-item-text\" style=\"flex: 1;\">" + friend_4.nickname + "</div>\n                        <div style=\"font-size: 13px; color: #8e8e93; margin-right: 15px;\">已在群内</div>\n                    ";
        refreshGroupMembershipUi(currentViewingGroup);
        if (window.showToast) window.showToast("已邀请 " + friend_4.nickname + " 加入群聊");
      });
      groupAddMemberList.appendChild(element_126);
    });
    openView_3(groupAddMemberSheet);
  }
  let count = 0;
  window.imApp.openGroupDetails = function (group_13) {
    if (!group_13 || group_13.type !== "group") return;
    currentViewingGroup = resolveLatestGroup(group_13) || group_13;
    group_13 = currentViewingGroup;
    const avatarText = document.getElementById("group-details-avatar-text"),
      groupDetailsAvatarImgElement = document.getElementById("group-details-avatar-img");
    group_13.avatarUrl ? (groupDetailsAvatarImgElement.src = group_13.avatarUrl, groupDetailsAvatarImgElement.style.display = "block", avatarText.style.display = "none") : (groupDetailsAvatarImgElement.style.display = "none", avatarText.style.display = "block", avatarText.textContent = group_13.nickname.charAt(0).toUpperCase());
    document.getElementById("group-details-name").textContent = group_13.nickname;
    const count_3 = getGroupMemberCount(group_13);
    document.getElementById("group-details-count").textContent = formatGroupMemberCount(count_3);
    const listContainer = document.getElementById("group-details-members-list"),
      value_131 = ++count;
    if (listContainer) listContainer.textContent = "正在载入成员…";
    if (groupPrivateChatDetailModal_2) openView_3(groupPrivateChatDetailModal_2);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (value_131 !== count || !groupPrivateChatDetailModal_2?.classList.contains("active")) return;
      const userMeta = getGroupUserDisplayMeta(group_13),
        name_133 = userMeta.name,
        myAvatarUrl = userMeta.avatarUrl;
      let innerHTML_2 = Number(group_13.leftGroupAt) > 0 ? "" : "\n            <div class=\"group-detail-member-item\" data-id=\"__user__\" style=\"padding: 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f2f2f7; cursor: pointer;\">\n                <div style=\"display: flex; align-items: center; gap: 15px;\">\n                    <div style=\"width: 40px; height: 40px; border-radius: 50%; background: #e5e5ea; display: flex; justify-content: center; align-items: center; overflow: hidden;\">\n                        <img src=\"" + myAvatarUrl + "\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                    </div>\n                    <div>\n                        <div style=\"font-size: 16px; font-weight: 600; color: #000;\">" + name_133 + "</div>\n                        <div style=\"font-size: 12px; color: #007aff;\">online</div>\n                    </div>\n                </div>\n                <div style=\"font-size: 12px; color: #8e8e93; background: #f2f2f7; padding: 2px 8px; border-radius: 10px; color: #c084fc; background: #f3e8ff;\">owner</div>\n            </div>\n        ";
      getResolvedGroupMembers(group_13).forEach(value_136 => {
        const value_137 = value_136.avatarUrl ? "<img src=\"" + value_136.avatarUrl + "\" style=\"width: 100%; height: 100%; object-fit: cover;\">" : "<i class=\"fas fa-user\" style=\"color: #fff;\"></i>";
        innerHTML_2 += "\n                    <div class=\"group-detail-member-item\" data-id=\"" + value_136.id + "\" style=\"padding: 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f2f2f7; cursor: pointer;\">\n                        <div style=\"display: flex; align-items: center; gap: 15px;\">\n                            <div style=\"width: 40px; height: 40px; border-radius: 50%; background: #c7c7cc; display: flex; justify-content: center; align-items: center; overflow: hidden;\">\n                                " + value_137 + "\n                            </div>\n                            <div>\n                                <div style=\"font-size: 16px; font-weight: 600; color: #000;\">" + value_136.nickname + "</div>\n                                <div style=\"font-size: 12px; color: #8e8e93;\">offline</div>\n                            </div>\n                        </div>\n                    </div>\n                ";
      });
      if (listContainer) {
        listContainer.innerHTML = innerHTML_2;
        const memberItems = listContainer.querySelectorAll(".group-detail-member-item");
        memberItems.forEach(item_4 => {
          item_4.addEventListener("click", () => {
            const memberId_3 = item_4.getAttribute("data-id");
            memberId_3 === "__user__" ? window.openView && document.getElementById("group-account-switch-sheet") && window.imApp && window.imApp.showGroupAccountSwitchSheet && window.imApp.showGroupAccountSwitchSheet(currentViewingGroup) : window.imApp && window.imApp.showGroupMemberManageSheet && window.imApp.showGroupMemberManageSheet(currentViewingGroup, memberId_3);
          });
        });
      }
    }));
  };
  window.imApp.showGroupAccountSwitchSheet = function (value_139) {
    const sheet_2 = document.getElementById("group-account-switch-sheet"),
      listContainer_2 = document.getElementById("group-account-switch-list");
    if (!sheet_2 || !listContainer_2 || !value_139) return;
    const latestGroup_2 = resolveLatestGroup(value_139) || value_139,
      selectedAccountId = String(getGroupUserDisplayMeta(latestGroup_2).id || "");
    listContainer_2.innerHTML = "";
    listContainer_2.setAttribute("role", "radiogroup");
    listContainer_2.setAttribute("aria-label", "选择群内身份");
    const accounts_2 = getAvailableGroupAccounts();
    if (accounts_2.length === 0) {
      listContainer_2.innerHTML = "<div style=\"text-align: center; color: #8e8e93; padding: 20px;\">暂无可用账号，请先在设置中添加 Apple ID</div>";
      window.openView(sheet_2);
      return;
    }
    accounts_2.forEach(acc => {
      const isSelected_2 = String(acc.id || "") === selectedAccountId;
      let isSaving = false;
      const item_5 = document.createElement("div");
      item_5.className = "group-detail-member-item" + (isSelected_2 ? " is-selected" : "");
      item_5.setAttribute("role", "radio");
      item_5.setAttribute("aria-checked", isSelected_2 ? "true" : "false");
      item_5.tabIndex = 0;
      item_5.style.cssText = "padding: 12px 16px; background: #fff; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; cursor: pointer;  margin-bottom: 10px;";
      const accountAvatarUrl = acc.avatarUrl || acc.avatar || "",
        value_147 = accountAvatarUrl ? "<img src=\"" + accountAvatarUrl + "\" style=\"width: 100%; height: 100%; object-fit: cover;\">" : "<i class=\"fas fa-user\"></i>";
      item_5.innerHTML = "\n                <div style=\"display: flex; align-items: center; gap: 15px;\">\n                    <div style=\"width: 44px; height: 44px; border-radius: 50%; background: #e5e5ea; display: flex; justify-content: center; align-items: center; color: #8e8e93; font-size: 20px; overflow: hidden;\">\n                        " + value_147 + "\n                    </div>\n                    <div>\n                        <div style=\"font-size: 16px; font-weight: 600; color: #000;\">" + (acc.name || "User") + "</div>\n                        <div style=\"font-size: 12px; color: #8e8e93;\">" + (acc.signature || acc.persona || "No Signature") + "</div>\n                    </div>\n                </div>\n                <i class=\"fas fa-check\" aria-hidden=\"true\" style=\"color:#007aff;visibility:" + (isSelected_2 ? "visible" : "hidden") + ";\"></i>\n            ";
      item_5.addEventListener("click", async () => {
        if (isSelected_2) {
          window.closeView(sheet_2);
          return;
        }
        if (isSaving) return;
        isSaving = true;
        item_5.style.pointerEvents = "none";
        const saved_3 = await commitContactsFriendChange(latestGroup_2, targetGroup_3 => {
          targetGroup_3.memory = targetGroup_3.memory || window.imApp.createDefaultMemory();
          targetGroup_3.memory.userOverride = {
            id: acc.id,
            name: acc.name || "User",
            avatarUrl: acc.avatarUrl || acc.avatar || "",
            persona: acc.persona || "",
            signature: acc.signature || ""
          };
        }, {
          silent: true
        });
        if (!saved_3) {
          isSaving = false;
          item_5.style.removeProperty("pointer-events");
          if (window.showToast) window.showToast("群身份切换保存失败");
          return;
        }
        const currentActiveFriend_4 = resolveLatestGroup(latestGroup_2) || latestGroup_2;
        currentViewingGroup = currentActiveFriend_4;
        window.imApp.openGroupDetails && window.imApp.openGroupDetails(currentActiveFriend_4);
        if (window.imData.currentActiveFriend && String(window.imData.currentActiveFriend.id) === String(currentActiveFriend_4.id)) {
          window.imData.currentActiveFriend = currentActiveFriend_4;
          const elementById_151 = document.getElementById("chat-interface-" + currentActiveFriend_4.id),
            insChatMessagesElement = elementById_151?.querySelector(".ins-chat-messages");
          insChatMessagesElement && window.imChat?.rerenderChatContainer && window.imChat.rerenderChatContainer(currentActiveFriend_4, insChatMessagesElement, {
            scroll: true
          });
        }
        window.closeView(sheet_2);
        if (window.showToast) window.showToast("已将您的发言身份切换为: " + acc.name);
      });
      item_5.addEventListener("keydown", event_152 => {
        (event_152.key === "Enter" || event_152.key === " ") && (event_152.preventDefault(), item_5.click());
      });
      listContainer_2.appendChild(item_5);
    });
    window.openView(sheet_2);
  };
  window.imApp.showGroupMemberManageSheet = function (value_153, memberId_4) {
    const sheet_3 = groupMemberManageSheet || document.getElementById("group-member-manage-sheet");
    if (!sheet_3 || !value_153) return;
    const latestGroup_3 = resolveLatestGroup(value_153) || value_153;
    currentViewingGroup = latestGroup_3;
    const targetMember = window.imData.friends.find(value_158 => String(value_158.id) === String(memberId_4));
    if (!targetMember) return;
    const avatarImg = document.getElementById("gmm-avatar"),
      avatarIcon = document.getElementById("gmm-avatar-icon");
    targetMember.avatarUrl ? (avatarImg.src = targetMember.avatarUrl, avatarImg.style.display = "block", avatarIcon.style.display = "none") : (avatarImg.style.display = "none", avatarIcon.style.display = "block");
    document.getElementById("gmm-name").textContent = targetMember.nickname || "群成员";
    const gmmMemoryToggleElement = document.getElementById("gmm-memory-toggle"),
      memoryLimitInput = document.getElementById("gmm-memory-limit-input"),
      memoryLimitInput_2 = document.getElementById("gmm-cross-group-memory-toggle");
    if (gmmMemoryToggleElement) {
      const newToggle = gmmMemoryToggleElement.cloneNode(true);
      gmmMemoryToggleElement.parentNode.replaceChild(newToggle, gmmMemoryToggleElement);
      let newLimitInput = null;
      memoryLimitInput && (newLimitInput = memoryLimitInput.cloneNode(true), memoryLimitInput.parentNode.replaceChild(newLimitInput, memoryLimitInput));
      let includeUserInput_2 = null;
      memoryLimitInput_2 && (includeUserInput_2 = memoryLimitInput_2.cloneNode(true), memoryLimitInput_2.parentNode.replaceChild(includeUserInput_2, memoryLimitInput_2));
      newToggle.disabled = false;
      if (newLimitInput) newLimitInput.disabled = false;
      const groupMemory = latestGroup_3.memory || {},
        mountSettings_2 = groupMemory.mountSettings || {},
        mountLimits_2 = groupMemory.mountLimits || {},
        mountSettings_3 = groupMemory.crossGroupMemorySettings || {};
      newToggle.checked = mountSettings_2[String(memberId_4)] !== false;
      newLimitInput && (newLimitInput.value = mountLimits_2[memberId_4] || 20);
      includeUserInput_2 && (includeUserInput_2.checked = mountSettings_3[String(memberId_4)] !== false);
      const saveSettings = async () => {
        const checked_166 = newToggle.checked,
          limitVal = newLimitInput ? parseInt(newLimitInput.value) || 20 : 20,
          includeUser = includeUserInput_2 ? includeUserInput_2.checked : true;
        latestGroup_3.memory = latestGroup_3.memory || window.imApp.createDefaultMemory();
        latestGroup_3.memory.mountSettings = latestGroup_3.memory.mountSettings || {};
        latestGroup_3.memory.mountLimits = latestGroup_3.memory.mountLimits || {};
        latestGroup_3.memory.crossGroupMemorySettings = latestGroup_3.memory.crossGroupMemorySettings || {};
        latestGroup_3.memory.mountSettings[memberId_4] = checked_166;
        latestGroup_3.memory.mountLimits[memberId_4] = limitVal;
        latestGroup_3.memory.crossGroupMemorySettings[memberId_4] = includeUser;
        await commitCurrentGroupChange(value_169 => {
          value_169.memory = value_169.memory || window.imApp.createDefaultMemory();
          value_169.memory.mountSettings = value_169.memory.mountSettings || {};
          value_169.memory.mountLimits = value_169.memory.mountLimits || {};
          value_169.memory.crossGroupMemorySettings = value_169.memory.crossGroupMemorySettings || {};
          value_169.memory.mountSettings[memberId_4] = checked_166;
          value_169.memory.mountLimits[memberId_4] = limitVal;
          value_169.memory.crossGroupMemorySettings[memberId_4] = includeUser;
        }, {
          silent: true
        });
      };
      newToggle.addEventListener("change", async e => {
        await saveSettings();
        if (window.showToast) window.showToast(e.target.checked ? "已开启单聊挂载" : "已关闭单聊挂载");
      });
      newLimitInput && newLimitInput.addEventListener("change", async () => {
        await saveSettings();
      });
      includeUserInput_2 && includeUserInput_2.addEventListener("change", async event_170 => {
        await saveSettings();
        if (window.showToast) window.showToast(event_170.target.checked ? "已开启跨群记忆" : "已关闭跨群记忆");
      });
    }
    const gmmKickBtnElement = document.getElementById("gmm-kick-btn");
    if (gmmKickBtnElement) {
      const cloneNode_171 = gmmKickBtnElement.cloneNode(true);
      gmmKickBtnElement.parentNode.replaceChild(cloneNode_171, gmmKickBtnElement);
      cloneNode_171.addEventListener("click", () => {
        const value_172 = resolveLatestGroup(latestGroup_3) || latestGroup_3;
        if (!value_172) return;
        const memberName = targetMember.nickname || "群成员";
        window.showCustomModal({
          title: "踢出群聊",
          message: "确定要将“" + memberName + "”从“" + (value_172.nickname || "群聊") + "”中移除吗？该成员的角色和单聊记录不会被删除，群聊历史也会保留。",
          confirmText: "删除",
          isDestructive: true,
          onConfirm: async () => {
            currentViewingGroup = value_172;
            const memberKey = String(memberId_4),
              memberStorageKeys = Array.from(new Set([memberKey, String(targetMember.nickname || "").trim(), String(targetMember.realName || "").trim()].filter(Boolean))),
              saved_4 = await commitCurrentGroupChange(targetGroup_4 => {
                targetGroup_4.members = getCanonicalGroupMemberIds(targetGroup_4).filter(id_3 => String(id_3) !== memberKey);
                targetGroup_4.memory && (targetGroup_4.memory.mountSettings && memberStorageKeys.forEach(key_2 => delete targetGroup_4.memory.mountSettings[key_2]), targetGroup_4.memory.mountLimits && memberStorageKeys.forEach(key_3 => delete targetGroup_4.memory.mountLimits[key_3]), targetGroup_4.memory.crossGroupMemorySettings && memberStorageKeys.forEach(value_182 => delete targetGroup_4.memory.crossGroupMemorySettings[value_182]));
                targetGroup_4.memberProfiles && memberStorageKeys.forEach(key_4 => delete targetGroup_4.memberProfiles[key_4]);
              }, {
                silent: true,
                metaOnly: true,
                syncActive: true
              });
            if (!saved_4) {
              if (window.showToast) window.showToast("删除成员失败");
              return;
            }
            const value_177 = resolveLatestGroup(value_172.id) || value_172;
            closeView_2(sheet_3);
            refreshGroupMembershipUi(value_177);
            groupCallInviteSheet?.classList.contains("active") && (selectedGroupCallMembers = selectedGroupCallMembers.filter(value_184 => String(value_184) !== memberKey), renderGroupCallInviteList());
            if (window.showToast) window.showToast("已删除 " + memberName);
          }
        });
      });
    }
    window.openView(sheet_3);
  };
  if (createGroupSheet) {
    const createGroupTrigger_2 = document.querySelector("#groups-content .line-list-item");
    createGroupTrigger_2 && createGroupTrigger_2.addEventListener("click", () => {
      openCreateGroupSheet();
    });
  }
  const cancelCreateGroupBtn = document.getElementById("cancel-create-group-btn");
  cancelCreateGroupBtn && cancelCreateGroupBtn.addEventListener("click", () => {
    closeView_2(createGroupSheet);
  });
  const groupAvatarWrapper = document.getElementById("group-avatar-wrapper"),
    groupAvatarUpload = document.getElementById("group-avatar-upload");
  groupAvatarWrapper && groupAvatarUpload && (groupAvatarWrapper.addEventListener("click", e_2 => {
    if (e_2.target.tagName !== "INPUT") groupAvatarUpload.click();
  }), groupAvatarUpload.addEventListener("change", async e_3 => {
    const file = e_3.target.files[0];
    if (!file) return;
    try {
      const nextAvatar = window.imApp.compressImageFile ? await window.imApp.compressImageFile(file, {
        maxWidth: 256,
        maxHeight: 256,
        mimeType: "image/jpeg",
        quality: 0.8
      }) : await window.imApp.readFileAsDataUrl(file);
      setGroupAvatar(nextAvatar);
    } catch (error_2) {
      console.error("Failed to process group avatar", error_2);
      if (showToast_2) showToast_2("群头像处理失败");
    }
  }));
  const confirmCreateGroupBtnElement = document.getElementById("confirm-create-group-btn");
  confirmCreateGroupBtnElement && confirmCreateGroupBtnElement.addEventListener("click", async () => {
    if (tempGroupMembers.length === 0) return;
    let groupName = document.getElementById("group-name-input").value.trim();
    if (!groupName) {
      const memberNames = tempGroupMembers.map(id_4 => {
        const f = window.imData.friends.find(x => String(x.id) === String(id_4));
        return f ? f.nickname : "";
      }).filter(Boolean);
      groupName = memberNames.join(", ");
      if (groupName.length > 20) groupName = groupName.substring(0, 20) + "...";
    }
    const img = document.getElementById("group-avatar-img"),
      avatarUrl_2 = img && img.style.display === "block" ? img.src : null,
      includeUserInput_3 = document.getElementById("create-group-include-user"),
      includeUser_2 = includeUserInput_3 ? includeUserInput_3.checked : true,
      value_192 = includeUser_2 ? 0 : Date.now(),
      group_14 = window.imApp.normalizeFriendData({
        id: "group_" + Date.now(),
        type: "group",
        realName: groupName,
        nickname: groupName,
        signature: "Group Chat",
        persona: "",
        avatarUrl: avatarUrl_2,
        members: Array.from(new Set(tempGroupMembers.map(id_5 => String(id_5)))),
        leftGroupAt: value_192,
        groupObserverMode: !includeUser_2,
        messages: [],
        chatBg: null,
        customCssEnabled: false,
        customCss: "",
        isPinned: false,
        memory: window.imApp.createDefaultMemory()
      });
    !includeUser_2 && window.imApp.createGroupMemberSnapshot && (group_14.leftGroupMemberSnapshot = window.imApp.createGroupMemberSnapshot(group_14));
    const saved_5 = window.imApp.commitFriendsChange ? await window.imApp.commitFriendsChange(() => {
      window.imData.friends.push(group_14);
    }, {
      silent: true
    }) : false;
    if (!saved_5) {
      if (window.showToast) window.showToast("创建群聊保存失败");
      return;
    }
    renderGroupsList_2();
    closeView_2(createGroupSheet);
    if (window.showToast) window.showToast(includeUser_2 ? "群聊已创建" : "旁观群聊已创建");
  });
  window.imApp.renderGroupsList = renderGroupsList_2;
  renderGroupsList_2();
  window.addEventListener("u2:group-summary-updated", event_4 => {
    const groupId_3 = event_4?.detail?.groupId;
    if (!groupId_3 || !currentViewingGroup || String(currentViewingGroup.id) !== String(groupId_3)) return;
    renderGroupSummaryMorePanel_2(currentViewingGroup);
  });
  groupPrivateChatDetailModal_2 && groupPrivateChatDetailModal_2.addEventListener("click", event_200 => {
    if (event_200.target === groupPrivateChatDetailModal_2) closeView_2(groupPrivateChatDetailModal_2);
  });
  [groupMemberManageSheet, groupMoreSheet].forEach(sheet => {
    if (!sheet) return;
    sheet.addEventListener("click", event_5 => {
      if (event_5.target === sheet) closeView_2(sheet);
    });
  });
  groupEditSheet && groupEditSheet.addEventListener("click", event_202 => {
    if (event_202.target === groupEditSheet) closeView_2(groupEditSheet);
  });
  groupPrivateChatDetailModal && groupPrivateChatDetailModal.addEventListener("click", event_203 => {
    if (event_203.target === groupPrivateChatDetailModal) closeGroupPrivateChatDetail();
  });
  groupPrivateChatDetailClose && groupPrivateChatDetailClose.addEventListener("click", closeGroupPrivateChatDetail);
  groupContextSettingsSheet && groupContextSettingsSheet.addEventListener("click", event_204 => {
    if (event_204.target === groupContextSettingsSheet) closeView_2(groupContextSettingsSheet);
  });
  groupDetailsEditBtn && groupDetailsEditBtn.addEventListener("click", () => {
    handleAction_15();
  });
  const groupOnlinePromptSettingsBtnElement = document.getElementById("group-online-prompt-settings-btn");
  groupOnlinePromptSettingsBtnElement && (groupOnlinePromptSettingsBtnElement.addEventListener("click", () => {
    if (currentViewingGroup) window.imApp.openOnlinePromptSettings?.(resolveLatestGroup(currentViewingGroup) || currentViewingGroup);
  }), groupOnlinePromptSettingsBtnElement.addEventListener("keydown", event_205 => {
    (event_205.key === "Enter" || event_205.key === " ") && (event_205.preventDefault(), groupOnlinePromptSettingsBtnElement.click());
  }));
  groupDetailsSettingsBtn && groupDetailsSettingsBtn.addEventListener("click", () => {
    handleAction_16();
  });
  groupDetailsSearchBtnElement?.addEventListener("click", () => {
    const latestGroup_206 = resolveLatestGroup(currentViewingGroup);
    if (latestGroup_206) window.imChat?.openChatHistorySearch?.(latestGroup_206);
  });
  groupManualSummaryBtn && groupManualSummaryBtn.addEventListener("click", () => {
    const currentSettingsFriend_2 = resolveLatestGroup(currentViewingGroup);
    if (!currentSettingsFriend_2) return;
    window.imData.currentSettingsFriend = currentSettingsFriend_2;
    if (window.imChat?.openManualSummaryModal) window.imChat.openManualSummaryModal(currentSettingsFriend_2);else window.showToast && window.showToast("总结功能尚未初始化");
  });
  groupMemoryShortTermBtn?.addEventListener("click", () => {
    const group_15 = resolveLatestGroup(currentViewingGroup);
    if (group_15) window.imApp.openMemoryLocationForFriend?.(group_15, "iphone");
  });
  groupMemoryLongTermBtn?.addEventListener("click", () => {
    const group_16 = resolveLatestGroup(currentViewingGroup);
    if (group_16) window.imApp.openMemoryLocationForFriend?.(group_16, "downloads");
  });
  groupWorldBookBtnElement?.addEventListener("click", () => {
    const latestGroup_210 = resolveLatestGroup(currentViewingGroup);
    if (!latestGroup_210) return;
    if (typeof window.renderWorldBookSelector !== "function") {
      window.showToast?.("世界书选择器尚未初始化");
      return;
    }
    window.renderWorldBookSelector(latestGroup_210.boundBooks || [], async value_211 => {
      const value_212 = await commitCurrentGroupChange(value_213 => {
        value_213.boundBooks = Array.isArray(value_211) ? [...value_211] : [];
      }, {
        silent: true
      });
      currentViewingGroup = resolveLatestGroup(currentViewingGroup) || currentViewingGroup;
      handleAction_17(currentViewingGroup);
      window.showToast?.(value_212 ? "群聊世界书已更新" : "群聊世界书保存失败");
    });
  });
  window.addEventListener("u2:memory-entries-updated", event_6 => {
    if (!currentViewingGroup || String(event_6.detail?.friendId || "") !== String(currentViewingGroup.id)) return;
    currentViewingGroup = resolveLatestGroup(currentViewingGroup) || currentViewingGroup;
    refreshGroupMemoryCounts(currentViewingGroup);
  });
  groupDetailsMoreBtn && groupDetailsMoreBtn.addEventListener("click", () => {
    if (groupMoreSheet) {
      renderGroupSummaryMorePanel_2(currentViewingGroup);
      if (window.openView) window.openView(groupMoreSheet);else {
        groupMoreSheet.style.display = "flex";
        setTimeout(() => {
          groupMoreSheet.style.opacity = "1";
        }, 10);
      }
    }
  });
  function createGroupPollOptionId(value_215 = 0) {
    return "poll-option-" + Date.now() + "-" + value_215 + "-" + Math.random().toString(36).slice(2, 7);
  }
  function resetGroupPollForm() {
    if (groupPollQuestionInput) groupPollQuestionInput.value = "";
    if (!groupPollOptionsList) return;
    groupPollOptionsList.innerHTML = "";
    addGroupPollOptionRow();
    addGroupPollOptionRow();
    updateGroupPollOptionControls();
  }
  function updateGroupPollOptionControls() {
    if (!groupPollOptionsList) return;
    const rows = Array.from(groupPollOptionsList.querySelectorAll(".group-poll-option-row"));
    rows.forEach((row_2, index_3) => {
      const indexEl = row_2.querySelector(".group-poll-option-index"),
        removeBtn = row_2.querySelector(".group-poll-option-remove");
      if (indexEl) indexEl.textContent = String(index_3 + 1);
      if (removeBtn) removeBtn.hidden = rows.length <= 2;
    });
    if (groupPollOptionCount) groupPollOptionCount.textContent = rows.length + " / 10";
    if (groupPollAddOptionBtn) groupPollAddOptionBtn.disabled = rows.length >= 10;
  }
  function addGroupPollOptionRow(value_219 = "") {
    if (!groupPollOptionsList) return;
    const currentCount = groupPollOptionsList.querySelectorAll(".group-poll-option-row").length;
    if (currentCount >= 10) return;
    const row_3 = document.createElement("div");
    row_3.className = "group-poll-option-row";
    row_3.innerHTML = "\n            <span class=\"group-poll-option-index\">" + (currentCount + 1) + "</span>\n            <input type=\"text\" class=\"group-poll-option-input\" maxlength=\"60\" placeholder=\"选项 " + (currentCount + 1) + "\" value=\"" + escapeGroupHtml(value_219) + "\">\n            <button type=\"button\" class=\"group-poll-option-remove\" aria-label=\"删除选项\"><i class=\"fas fa-minus-circle\"></i></button>\n        ";
    row_3.querySelector(".group-poll-option-remove")?.addEventListener("click", () => {
      if (groupPollOptionsList.querySelectorAll(".group-poll-option-row").length <= 2) return;
      row_3.remove();
      updateGroupPollOptionControls();
    });
    groupPollOptionsList.appendChild(row_3);
    updateGroupPollOptionControls();
  }
  function getGroupPollFormValues() {
    const question_2 = String(groupPollQuestionInput?.value || "").trim(),
      options_6 = Array.from(groupPollOptionsList?.querySelectorAll(".group-poll-option-input") || []).map(input => String(input.value || "").trim());
    return {
      question: question_2,
      options: options_6
    };
  }
  function validateGroupPollForm(question_3, options_7) {
    if (!question_3) return "请输入投票内容";
    if (options_7.length < 2) return "至少需要两个选项";
    if (options_7.some(option => !option)) return "请填写完整的投票选项";
    const normalizedOptions = options_7.map(option_2 => option_2.toLocaleLowerCase());
    if (new Set(normalizedOptions).size !== normalizedOptions.length) return "投票选项不能重复";
    return "";
  }
  function buildGroupPollContextText(message_5) {
    const question_4 = String(message_5?.pollQuestion || "").trim(),
      options_8 = Array.isArray(message_5?.pollOptions) ? message_5.pollOptions : [],
      votes = Array.isArray(message_5?.pollVotes) ? message_5.pollVotes : [],
      optionById = new Map(options_8.map(option_3 => [String(option_3.id), option_3.text])),
      map_232 = votes.map(vote_2 => (vote_2.voterName || vote_2.voterId) + " → " + (optionById.get(String(vote_2.optionId)) || "未知选项"));
    return "[群投票：" + question_4 + "\n选项：" + options_8.map(option_4 => option_4.text).join(" / ") + "\n当前投票：" + (map_232.length > 0 ? map_232.join("；") : "暂无") + "]";
  }
  function getGroupPollMessage(groupId_4, messageId) {
    const group_17 = resolveLatestGroup(groupId_4);
    if (!group_17 || !Array.isArray(group_17.messages)) return null;
    return group_17.messages.find(message_6 => String(message_6?.id) === String(messageId) && message_6?.type === "group_poll") || null;
  }
  function rerenderGroupPollMessage(value_239, id_6) {
    const group_18 = resolveLatestGroup(value_239),
      message_7 = getGroupPollMessage(value_239, id_6),
      elementById_242 = document.getElementById("chat-interface-" + value_239),
      container = elementById_242?.querySelector(".ins-chat-messages");
    group_18 && message_7 && container && window.imChat?.replaceMessageInContainer && window.imChat.replaceMessageInContainer(group_18, container, message_7, {
      id: id_6
    }, {
      scroll: false
    });
  }
  async function updateGroupPollMessage(groupId_5, messageId_2, mutator_2) {
    const saved_6 = await window.imApp.updateFriendMessage(groupId_5, {
      id: messageId_2
    }, message_8 => {
      if (!message_8 || message_8.type !== "group_poll") return;
      mutator_2(message_8);
      message_8.content = buildGroupPollContextText(message_8);
    }, {
      silent: true
    });
    if (saved_6) rerenderGroupPollMessage(groupId_5, messageId_2);
    return saved_6;
  }
  window.imChat = window.imChat || {};
  window.imChat.applyGroupPollRoleVotes = async function (value_249, value_250, roleVotes) {
    const group_19 = resolveLatestGroup(value_249),
      message_9 = getGroupPollMessage(value_249, value_250);
    if (!group_19 || !message_9 || !Array.isArray(roleVotes)) return false;
    const members_3 = (Array.isArray(group_19.members) ? group_19.members : []).map(memberId_5 => (window.imData?.friends || []).find(friend_5 => String(friend_5.id) === String(memberId_5))).filter(Boolean),
      memberById = new Map(members_3.map(member_2 => [String(member_2.id), member_2])),
      optionIds = new Set((message_9.pollOptions || []).map(option_5 => String(option_5.id)));
    return updateGroupPollMessage(value_249, value_250, targetMessage_2 => {
      const existingVotes = Array.isArray(targetMessage_2.pollVotes) ? targetMessage_2.pollVotes : [],
        votedMemberIds = new Set(existingVotes.filter(vote_3 => vote_3?.voterType === "member").map(vote_4 => String(vote_4.voterId))),
        acceptedVotes = [];
      roleVotes.forEach(vote_5 => {
        const memberId_6 = String(vote_5?.memberId || vote_5?.voterId || ""),
          optionId_2 = String(vote_5?.optionId || ""),
          member_3 = memberById.get(memberId_6);
        if (!member_3 || !optionIds.has(optionId_2) || votedMemberIds.has(memberId_6)) return;
        votedMemberIds.add(memberId_6);
        acceptedVotes.push({
          voterId: memberId_6,
          voterName: member_3.nickname || member_3.realName || memberId_6,
          optionId: optionId_2,
          voterType: "member"
        });
      });
      targetMessage_2.pollVotes = [...existingVotes, ...acceptedVotes];
      targetMessage_2.pollStatus = "completed";
      targetMessage_2.pollError = "";
    });
  };
  window.imChat.selectGroupPollOption = async function (groupId_6, messageId_3, optionId_3) {
    const group_20 = resolveLatestGroup(groupId_6),
      message_10 = getGroupPollMessage(groupId_6, messageId_3);
    if (!group_20 || !message_10 || !(message_10.pollOptions || []).some(option_6 => String(option_6.id) === String(optionId_3))) return false;
    const userIdentity = window.imApp?.getGroupUserIdentity ? window.imApp.getGroupUserIdentity(group_20) : getGroupUserDisplayMeta(group_20);
    return updateGroupPollMessage(groupId_6, messageId_3, targetMessage => {
      const memberVotes = (Array.isArray(targetMessage.pollVotes) ? targetMessage.pollVotes : []).filter(vote => vote?.voterType === "member");
      targetMessage.pollVotes = [{
        voterId: "__user__",
        voterName: userIdentity.name,
        voterAvatarUrl: userIdentity.avatarUrl,
        optionId: String(optionId_3),
        voterType: "user"
      }, ...memberVotes];
      targetMessage.pollStatus = "idle";
      targetMessage.pollError = "";
    });
  };
  groupPollBtn && groupPollBtn.addEventListener("click", () => {
    if (!resolveLatestGroup(currentViewingGroup)) return;
    resetGroupPollForm();
    closeView_2(groupMoreSheet);
    if (window.openView) window.openView(groupPollCreateSheet);
    setTimeout(() => groupPollQuestionInput?.focus(), 120);
  });
  groupPollCreateClose?.addEventListener("click", () => closeView_2(groupPollCreateSheet));
  groupPollAddOptionBtn?.addEventListener("click", () => {
    addGroupPollOptionRow();
    const inputs = groupPollOptionsList?.querySelectorAll(".group-poll-option-input");
    inputs?.[inputs.length - 1]?.focus();
  });
  groupPollSubmitBtn?.addEventListener("click", async () => {
    const group_21 = resolveLatestGroup(currentViewingGroup);
    if (!group_21) return;
    const {
        question: question_5,
        options: options_9
      } = getGroupPollFormValues(),
      validationError = validateGroupPollForm(question_5, options_9);
    if (validationError) {
      if (window.showToast) window.showToast(validationError);
      return;
    }
    groupPollSubmitBtn.disabled = true;
    const timestamp_2 = Date.now(),
      message_11 = {
        id: window.imChat?.createMessageId ? window.imChat.createMessageId("poll") : "poll-" + timestamp_2,
        role: "user",
        type: "group_poll",
        timestamp: timestamp_2,
        pollId: "group-poll-" + timestamp_2 + "-" + Math.random().toString(36).slice(2, 8),
        pollQuestion: question_5,
        pollOptions: options_9.map((text_3, index_4) => ({
          id: createGroupPollOptionId(index_4),
          text: text_3
        })),
        pollVotes: [],
        pollStatus: "idle",
        pollError: ""
      };
    message_11.content = buildGroupPollContextText(message_11);
    try {
      const saved_7 = await window.imApp.appendFriendMessage(group_21.id, message_11);
      if (!saved_7) return;
      const liveGroup = resolveLatestGroup(group_21.id) || group_21,
        elementById_287 = document.getElementById("chat-interface-" + group_21.id),
        container_2 = elementById_287?.querySelector(".ins-chat-messages");
      container_2 && window.imChat?.appendMessageToContainer && window.imChat.appendMessageToContainer(liveGroup, container_2, message_11);
      closeView_2(groupPollCreateSheet);
      closeView_2(document.getElementById("group-details-sheet"));
    } finally {
      groupPollSubmitBtn.disabled = false;
    }
  });
  let selectedGroupCallMembers = [];
  function renderGroupCallInviteList() {
    if (!groupCallMembersList || !currentViewingGroup) return;
    groupCallMembersList.innerHTML = "";
    const allMembers = [...currentViewingGroup.members];
    allMembers.forEach((memberId_7, value_291) => {
      const friend_6 = window.imData.friends.find(f_3 => f_3.id === memberId_7);
      if (!friend_6) return;
      const isSelected_3 = selectedGroupCallMembers.includes(friend_6.id),
        item_6 = document.createElement("div");
      item_6.className = "group-detail-member-item";
      item_6.style.cssText = "padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: " + (value_291 === allMembers.length - 1 ? "none" : "1px solid #f2f2f7") + "; cursor: pointer;";
      const value_295 = friend_6.avatarUrl ? "<img src=\"" + friend_6.avatarUrl + "\" style=\"width: 100%; height: 100%; object-fit: cover;\">" : friend_6.type === "npc" ? "<i class=\"fas fa-robot\"></i>" : "<i class=\"fas fa-user\"></i>";
      item_6.innerHTML = "\n                <div style=\"display: flex; align-items: center; gap: 15px;\">\n                    <div style=\"width: 40px; height: 40px; border-radius: 50%; background: #e5e5ea; display: flex; justify-content: center; align-items: center; color: #8e8e93; overflow: hidden;\">\n                        " + value_295 + "\n                    </div>\n                    <div style=\"font-size: 16px; font-weight: 500; color: #000;\">" + friend_6.nickname + "</div>\n                </div>\n                <div style=\"width: 24px; height: 24px; border-radius: 50%; border: 1px solid " + (isSelected_3 ? "#34c759" : "#c7c7cc") + "; background: " + (isSelected_3 ? "#34c759" : "transparent") + "; display: flex; justify-content: center; align-items: center; color: #fff; font-size: 12px;\">\n                    " + (isSelected_3 ? "<i class=\"fas fa-check\"></i>" : "") + "\n                </div>\n            ";
      item_6.addEventListener("click", () => {
        isSelected_3 ? selectedGroupCallMembers = selectedGroupCallMembers.filter(id_7 => id_7 !== friend_6.id) : selectedGroupCallMembers.push(friend_6.id);
        renderGroupCallInviteList();
      });
      groupCallMembersList.appendChild(item_6);
    });
    groupCallStartBtn && (selectedGroupCallMembers.length > 0 ? (groupCallStartBtn.style.opacity = "1", groupCallStartBtn.style.pointerEvents = "auto") : (groupCallStartBtn.style.opacity = "0.5", groupCallStartBtn.style.pointerEvents = "none"));
  }
  groupCallBtn && groupCallBtn.addEventListener("click", () => {
    if (!currentViewingGroup) return;
    closeView_2(groupMoreSheet);
    closeView_2(document.getElementById("group-details-sheet"));
    selectedGroupCallMembers = [...currentViewingGroup.members];
    renderGroupCallInviteList();
    if (window.openView) window.openView(groupCallInviteSheet);
  });
  groupCallStartBtn && groupCallStartBtn.addEventListener("click", event_298 => {
    event_298.preventDefault();
    event_298.stopPropagation();
    if (!groupCallInviteSheet || !groupCallInviteSheet.classList.contains("active") || window.getComputedStyle(groupCallInviteSheet).pointerEvents === "none") return;
    if (!currentViewingGroup || selectedGroupCallMembers.length === 0) return;
    closeView_2(groupCallInviteSheet);
    window.imChat && window.imChat.openGroupVoiceCall && window.imChat.openGroupVoiceCall(currentViewingGroup, selectedGroupCallMembers);
  });
  const clearGroupChatHistoryBtn = document.getElementById("clear-group-chat-history-btn");
  clearGroupChatHistoryBtn && clearGroupChatHistoryBtn.addEventListener("click", async () => {
    if (!currentViewingGroup) return;
    window.showCustomModal({
      title: "清空聊天记录",
      message: "确定要清空群聊 \"" + currentViewingGroup.nickname + "\" 的线上聊天记录吗？群聊记忆和成员状态栏会保留，此操作不可恢复。",
      confirmText: "清空",
      isDestructive: true,
      onConfirm: async () => {
        const id_299 = currentViewingGroup.id,
          value_300 = await window.imApp.resetFriendMessages(id_299);
        if (value_300) {
          const value_301 = resolveLatestGroup(id_299) || currentViewingGroup;
          currentViewingGroup = value_301;
          if (window.showToast) window.showToast("群聊记录已清空，群聊记忆和成员状态栏已保留");
          if (window.imApp.openChatTab) window.imApp.openChatTab(value_301);
        }
      }
    });
  });
  const leaveGroupChatBtn = document.getElementById("leave-group-chat-btn");
  leaveGroupChatBtn && leaveGroupChatBtn.addEventListener("click", async () => {
    if (!currentViewingGroup) return;
    window.showCustomModal({
      title: "退出群聊",
      message: "确定要退出群聊 \"" + currentViewingGroup.nickname + "\" 吗？",
      confirmText: "退出",
      isDestructive: true,
      onConfirm: async () => {
        const groupId_7 = currentViewingGroup.id,
          leftAt = Date.now(),
          saved_8 = window.imApp.commitScopedFriendChange ? await window.imApp.commitScopedFriendChange(groupId_7, targetGroup_5 => {
            if (!targetGroup_5) return;
            targetGroup_5.leftGroupAt = leftAt;
            targetGroup_5.groupObserverMode = false;
            targetGroup_5.leftGroupMemberSnapshot = window.imApp.createGroupMemberSnapshot ? window.imApp.createGroupMemberSnapshot(targetGroup_5) : [];
          }, {
            syncActive: true,
            syncSettings: true,
            metaOnly: true,
            silent: true
          }) : false;
        if (!saved_8) {
          if (window.showToast) window.showToast("退出群聊失败");
          return;
        }
        const currentActiveFriend_2 = (window.imData.friends || []).find(item_7 => String(item_7.id) === String(groupId_7)) || currentViewingGroup;
        currentViewingGroup = currentActiveFriend_2;
        const groupLeftNotice = {
          id: "sys-" + Date.now(),
          role: "system",
          type: "system_notice",
          noticeKind: "group_left",
          content: "你已退出群聊",
          text: "你已退出群聊",
          timestamp: Date.now()
        };
        await window.imApp.appendFriendMessage(groupId_7, groupLeftNotice, {
          silent: true
        });
        if (window.showToast) window.showToast("已退出群聊");
        window.closeView(document.getElementById("group-context-settings-sheet"));
        window.closeView(document.getElementById("group-details-sheet"));
        if (window.imData.currentActiveFriend && String(window.imData.currentActiveFriend.id) === String(groupId_7)) {
          window.imData.currentActiveFriend = currentActiveFriend_2;
          const page_2 = document.getElementById("chat-interface-" + groupId_7);
          page_2 && window.imChat?.syncGroupExitState && window.imChat.syncGroupExitState(currentActiveFriend_2, page_2);
          const msgContainer = page_2 ? page_2.querySelector(".ins-chat-messages") : null;
          msgContainer && window.imChat?.rerenderChatContainer && window.imChat.rerenderChatContainer(currentActiveFriend_2, msgContainer, {
            scroll: true
          });
        }
        if (window.imApp.openChatTab) window.imApp.openChatTab(currentActiveFriend_2);
      }
    });
  });
  const dismissGroupChatBtn = document.getElementById("dismiss-group-chat-btn");
  dismissGroupChatBtn && dismissGroupChatBtn.addEventListener("click", async () => {
    if (!currentViewingGroup) return;
    window.showCustomModal({
      title: "解散群聊",
      message: "确定要解散群聊 \"" + currentViewingGroup.nickname + "\" 吗？所有相关数据将被删除且不可恢复。",
      confirmText: "解散",
      isDestructive: true,
      onConfirm: async () => {
        const saved_9 = await window.imApp.commitFriendsChange(() => {
          window.imData.friends = window.imData.friends.filter(f_4 => String(f_4.id) !== String(currentViewingGroup.id));
        }, {
          silent: true
        });
        if (saved_9) {
          window.imStorage && window.imStorage.deleteFriend && (await window.imStorage.deleteFriend(currentViewingGroup.id));
          if (window.showToast) window.showToast("群聊已解散");
          window.closeView(document.getElementById("group-context-settings-sheet"));
          window.closeView(document.getElementById("group-details-sheet"));
          const elementById_312 = document.getElementById("chat-interface-" + currentViewingGroup.id);
          elementById_312 && elementById_312.remove();
          window.imData.currentActiveFriend && window.imData.currentActiveFriend.id === currentViewingGroup.id && (window.imData.currentActiveFriend = null, window.imChat && window.imChat.updateChatsView && window.imChat.updateChatsView());
          currentViewingGroup = null;
          if (window.imApp.renderGroupsList) window.imApp.renderGroupsList();
        }
      }
    });
  });
  confirmGroupEditBtn && confirmGroupEditBtn.addEventListener("click", async () => {
    if (!currentViewingGroup) return;
    const newName = groupEditNameInput ? groupEditNameInput.value.trim() : "";
    if (newName) {
      const saved_10 = await commitCurrentGroupChange(targetGroup_6 => {
        targetGroup_6.nickname = newName;
        targetGroup_6.realName = newName;
      }, {
        silent: true
      });
      if (!saved_10) {
        if (window.showToast) window.showToast("群聊名称保存失败");
        return;
      }
      const groupDetailsNameElement = document.getElementById("group-details-name");
      if (groupDetailsNameElement) groupDetailsNameElement.textContent = newName;
      const chatNameEl = document.getElementById("active-chat-name"),
        groupChatHeaderEl = document.getElementById("active-chat-header");
      if (window.imData.currentActiveFriend && window.imData.currentActiveFriend.id === currentViewingGroup.id) {
        chatNameEl && (chatNameEl.textContent = newName);
        if (groupChatHeaderEl) {
          const nameDiv = groupChatHeaderEl.querySelector(".ins-chat-name");
          if (nameDiv) nameDiv.textContent = newName;
        }
      }
      renderGroupsList_2();
    }
    closeView_2(groupEditSheet);
  });
  confirmGroupContextBtn && confirmGroupContextBtn.addEventListener("click", async () => {
    if (!currentViewingGroup) return;
    const enabled_2 = !!(groupContextEnabledToggle && groupContextEnabledToggle.checked),
      timeAware_2 = groupTimeAwareToggle ? !!groupTimeAwareToggle.checked : currentViewingGroup.timeAware !== false,
      autoExpandTranslation_2 = groupAutoExpandTranslationToggle ? !!groupAutoExpandTranslationToggle.checked : currentViewingGroup.autoExpandTranslation === true,
      showGroupUserAvatar_2 = groupShowUserAvatarToggle?.checked === true,
      allowGroupMemberPrivateChats_2 = groupMemberPrivateChatsToggle ? !!groupMemberPrivateChatsToggle.checked : currentViewingGroup.allowGroupMemberPrivateChats !== false,
      allowGroupMemberFriendPrivateChats_2 = groupMemberFriendPrivateChatsToggle ? !!groupMemberFriendPrivateChatsToggle.checked : currentViewingGroup.allowGroupMemberFriendPrivateChats !== false;
    let limit_2 = groupContextLimitInput ? Number(groupContextLimitInput.value) : 100;
    (!Number.isFinite(limit_2) || limit_2 <= 0) && (limit_2 = 100);
    limit_2 = Math.max(1, Math.floor(limit_2));
    groupContextLimitInput && (groupContextLimitInput.value = limit_2);
    const saved_11 = await commitCurrentGroupChange(targetGroup_7 => {
      targetGroup_7.memory = targetGroup_7.memory || window.imApp.createDefaultMemory();
      targetGroup_7.memory.context = targetGroup_7.memory.context || {};
      targetGroup_7.memory.context.enabled = enabled_2;
      targetGroup_7.memory.context.limit = limit_2;
      targetGroup_7.timeAware = timeAware_2;
      targetGroup_7.autoExpandTranslation = autoExpandTranslation_2;
      targetGroup_7.showGroupUserAvatar = showGroupUserAvatar_2;
      targetGroup_7.allowGroupMemberPrivateChats = allowGroupMemberPrivateChats_2;
      targetGroup_7.allowGroupMemberFriendPrivateChats = allowGroupMemberFriendPrivateChats_2;
    }, {
      silent: true
    });
    if (!saved_11) {
      if (window.showToast) window.showToast("群上下文设置保存失败");
      return;
    }
    const latestGroup_4 = resolveLatestGroup(currentViewingGroup) || currentViewingGroup,
      elementById_324 = document.getElementById("chat-interface-" + latestGroup_4.id),
      activeContainer = elementById_324?.querySelector(".ins-chat-messages");
    activeContainer && window.imChat?.syncGroupUserAvatarState && window.imChat.syncGroupUserAvatarState(latestGroup_4, activeContainer);
    closeView_2(groupContextSettingsSheet);
    if (window.showToast) window.showToast("设置已保存");
  });
  groupContextLimitInput && groupContextLimitInput.addEventListener("change", async () => {
    if (!currentViewingGroup) return;
    let limit_3 = Number(groupContextLimitInput.value);
    (!Number.isFinite(limit_3) || limit_3 <= 0) && (limit_3 = Number(currentViewingGroup.memory?.context?.limit) || 100);
    limit_3 = Math.max(1, Math.floor(limit_3));
    const saved_12 = await commitCurrentGroupChange(targetGroup_8 => {
        targetGroup_8.memory = window.imApp.normalizeFriendData(targetGroup_8).memory;
        targetGroup_8.memory.context.limit = limit_3;
      }, {
        silent: true
      }),
      latestGroup_5 = resolveLatestGroup(currentViewingGroup) || currentViewingGroup;
    groupContextLimitInput.value = Number(latestGroup_5.memory?.context?.limit) > 0 ? Number(latestGroup_5.memory.context.limit) : 100;
    if (!saved_12 && window.showToast) window.showToast("群上下文条数保存失败");
  });
  groupBgUploadIcon && groupBgUpload && (groupBgUploadIcon.addEventListener("click", () => {
    groupBgUpload.click();
  }), groupBgUpload.addEventListener("change", async event_331 => {
    const file_2 = event_331.target.files[0];
    if (file_2 && currentViewingGroup) try {
      const value_333 = window.imApp.compressImageFile ? await window.imApp.compressImageFile(file_2, {
          maxWidth: 1280,
          maxHeight: 1280,
          mimeType: "image/jpeg",
          quality: 0.82
        }) : await window.imApp.readFileAsDataUrl(file_2),
        saved_13 = await commitCurrentGroupChange(targetGroup_9 => {
          targetGroup_9.chatBg = value_333;
        }, {
          silent: true
        });
      if (!saved_13) {
        if (window.showToast) window.showToast("群聊背景保存失败");
        return;
      }
      if (window.imData.currentActiveFriend && window.imData.currentActiveFriend.id === currentViewingGroup.id) {
        if (window.imApp.applyFriendBg) window.imApp.applyFriendBg(currentViewingGroup);
      }
      if (window.showToast) window.showToast("群聊背景已更新");
    } catch (error_3) {
      console.error("Failed to process group background", error_3);
      if (showToast_2) showToast_2("群背景处理失败");
    }
    event_331.target.value = "";
  }));
  groupBgResetIcon && groupBgResetIcon.addEventListener("click", async () => {
    if (currentViewingGroup) {
      const saved_14 = await commitCurrentGroupChange(targetGroup_10 => {
        targetGroup_10.chatBg = null;
      }, {
        silent: true
      });
      if (!saved_14) {
        if (window.showToast) window.showToast("群聊背景重置失败");
        return;
      }
      if (window.imData.currentActiveFriend && window.imData.currentActiveFriend.id === currentViewingGroup.id) {
        if (window.imApp.applyFriendBg) window.imApp.applyFriendBg(currentViewingGroup);
      }
      if (window.showToast) window.showToast("群聊背景已重置");
    }
  });
  const groupAvatarUploadBtn = document.getElementById("group-details-avatar-upload-btn"),
    groupAvatarInput = document.getElementById("group-details-avatar-input");
  groupAvatarUploadBtn && groupAvatarInput && (groupAvatarUploadBtn.addEventListener("click", () => {
    groupAvatarInput.click();
  }), groupAvatarInput.addEventListener("change", async event_339 => {
    const value_340 = event_339.target.files[0];
    if (value_340 && currentViewingGroup) try {
      const value_341 = window.imApp.compressImageFile ? await window.imApp.compressImageFile(value_340, {
          maxWidth: 256,
          maxHeight: 256,
          mimeType: "image/jpeg",
          quality: 0.8
        }) : await window.imApp.readFileAsDataUrl(value_340),
        saved_15 = await commitCurrentGroupChange(targetGroup_11 => {
          targetGroup_11.avatarUrl = value_341;
        }, {
          silent: true
        });
      if (!saved_15) {
        if (window.showToast) window.showToast("群头像保存失败");
        return;
      }
      const groupDetailsAvatarImgElement_343 = document.getElementById("group-details-avatar-img"),
        avatarText_2 = document.getElementById("group-details-avatar-text");
      groupDetailsAvatarImgElement_343 && (groupDetailsAvatarImgElement_343.src = value_341, groupDetailsAvatarImgElement_343.style.display = "block");
      if (avatarText_2) avatarText_2.style.display = "none";
      const currentActiveFriend_3 = (window.imData.friends || []).find(item_8 => String(item_8.id) === String(currentViewingGroup.id)) || currentViewingGroup;
      currentViewingGroup = currentActiveFriend_3;
      window.imData.currentActiveFriend && String(window.imData.currentActiveFriend.id) === String(currentViewingGroup.id) && (window.imData.currentActiveFriend = currentActiveFriend_3);
      window.imChat && window.imChat.refreshGroupHeaderAvatar && window.imChat.refreshGroupHeaderAvatar(currentActiveFriend_3);
      renderGroupsList_2();
      window.imChat && window.imChat.renderChatsList && window.imChat.renderChatsList();
      if (window.showToast) window.showToast("群头像已更新");
    } catch (error_4) {
      console.error("Failed to process group details avatar", error_4);
      if (showToast_2) showToast_2("群头像处理失败");
    }
    event_339.target.value = "";
  }));
  groupAddMemberBtn && groupAddMemberBtn.addEventListener("click", () => {
    if (!currentViewingGroup) return;
    openGroupAddMemberSheet();
  });
  groupAddMemberSheet && groupAddMemberSheet.addEventListener("click", event_349 => {
    if (event_349.target === groupAddMemberSheet) closeView_2(groupAddMemberSheet);
  });
});
