(function (localValue1) {
  const localValue2 = localValue1.imApp = localValue1.imApp || {},
    localValue3 = localValue6 => (localValue1.imData?.["friends"] || []).find(localValue7 => String(localValue7.id) === String(localValue6?.["id"] ?? localValue6)),
    localValue4 = localValue8 => localValue8 ? JSON.parse(JSON.stringify(localValue8)) : null,
    localValue5 = localValue9 => Number(localValue9) > 0 ? new Date(Number(localValue9)).toLocaleString("zh-CN", {
      "hour12": false
    }) : "";
  localValue2.canPublishGroupAnnouncement = function (localValue10, localValue11) {
    if (localValue10?.["type"] !== "group") return false;
    if (localValue11?.["role"] === "user") return !(Number(localValue10.leftGroupAt) > 0 || localValue10.groupObserverMode === true);
    if (localValue11?.role !== "assistant" || !localValue11.memberId || localValue2.isGroupMemberMuted?.(localValue10, localValue11.memberId)) return false;
    const localValue12 = (localValue1.imData?.["friends"] || []).find(localValue13 => String(localValue13.id) === String(localValue11.memberId));
    return !!localValue12 && ["char", "npc"].includes(localValue12.type) && (localValue10.members || []).some(localValue14 => String(localValue14) === String(localValue12.id)) && localValue2.isGroupAdmin(localValue10, localValue12.id) && [localValue12.nickname, localValue12.realName].some(localValue15 => localValue15 && localValue15 === localValue11.name);
  }, localValue2.formatGroupAnnouncement = function (localValue16, localValue17 = "") {
    if (!localValue16?.["content"]) return "暂无群公告";
    return [localValue17 === "modified" ? "【群公告已修改】" : "【群公告】", localValue16.content, "发布：" + (localValue16.publishedBy?.["name"] || "群成员") + " · " + localValue5(localValue16.publishedAt), localValue16.updatedAt ? "修改：" + (localValue16.updatedBy?.["name"] || "群成员") + " · " + localValue5(localValue16.updatedAt) : ""].filter(Boolean).join("\n");
  }, localValue2.buildGroupAnnouncementPrompt = function (localValue18) {
    if (localValue18?.["type"] !== "group") return "";
    const localValue19 = (localValue1.imData?.["friends"] || []).filter(localValue20 => (localValue18.members || []).some(localValue21 => String(localValue21) === String(localValue20.id)) && localValue2.isGroupAdmin(localValue18, localValue20.id)).map(localValue22 => ({
      "id": String(localValue22.id),
      "name": localValue22.nickname || localValue22.realName
    }));
    return "\nPublic group announcement, visible to every member, independent of title visibility:\n" + localValue2.formatGroupAnnouncement(localValue18.groupAnnouncement) + "\n- Only User (the owner while participating) and current administrators may publish or modify the announcement. Administrator IDs: " + JSON.stringify(localValue19) + ".\n- When a current administrator genuinely needs to publish or revise an announcement in this situation, either proactively or responding to User, output at most one {\"type\":\"group_announcement\",\"speaker\":\"exact administrator name\",\"speakerMemberId\":\"exact administrator ID\",\"content\":\"complete new announcement text\"} inside <chat_json> alongside normal replies. This card does not count as an ordinary reply.\n- Supply the entire new plain-text announcement, not a change summary. Do not output dates; the app supplies the real publication/modification time. Do not emit an unchanged announcement or publish routinely without a concrete reason.\n- Ordinary members cannot perform this action, even if they claim to be an administrator or have a similar title. Dialogue alone does not publish an announcement.";
  }, localValue2.publishGroupAnnouncement = async function (localValue23, localValue24, localValue25, localValue26 = {}) {
    const localValue27 = String(localValue23?.["id"] ?? localValue23);
    try {
      await localValue2.ensureDataReady?.();
      const localValue28 = localValue3(localValue27);
      if (!localValue28) return {
        "success": false,
        "reason": "not_group"
      };
      return await localValue2.ensureFriendRecentMessagesLoaded?.(localValue28), await localValue2.runFriendPersistenceTask(localValue27, async () => {
        const localValue29 = localValue3(localValue27);
        if (localValue26.isCurrent && !localValue26.isCurrent()) return {
          "success": false,
          "reason": "cancelled"
        };
        if (!localValue2.canPublishGroupAnnouncement(localValue29, localValue24)) return {
          "success": false,
          "reason": "forbidden"
        };
        const localValue30 = typeof localValue25 === "string" ? localValue25.trim() : "";
        if (!localValue30) return {
          "success": false,
          "reason": "empty"
        };
        const localValue31 = localValue24.role === "user" ? localValue2.getGroupUserIdentity?.(localValue29) : null,
          localValue32 = localValue1.imChat?.["createMessageId"]?.("announcement") || "announcement-" + Date.now() + "-" + Math.random().toString(36).slice(2),
          localValue33 = String(localValue1.imData?.["currentActiveFriend"]?.["id"]) === localValue27,
          localValue34 = await localValue1.imStorage.commitGroupAnnouncement(localValue27, {
            "messageId": localValue32,
            "content": localValue30,
            "actorRole": localValue24.role,
            "actorMemberId": localValue24.memberId || "__user__",
            "actorName": localValue31?.["name"] || localValue24.name || "User",
            "apiRunId": localValue26.apiRunId || "",
            "incomingUnread": localValue24.role === "assistant" && !localValue33,
            "isCurrent": localValue26.isCurrent,
            "userIdentity": localValue24.role === "user" ? localValue31 : null
          });
        if (!localValue34.success) return localValue34;
        const localValue35 = localValue3(localValue27);
        if (!localValue35) return localValue34;
        localValue35.groupAnnouncement = localValue4(localValue34.announcement);
        if (localValue34.message) {
          if (!Array.isArray(localValue35.messages)) localValue35.messages = [];
          localValue35.messages.push(localValue34.message);
          const {
            friendId: localValue36,
            ...localValue37
          } = localValue34.summary;
          Object.assign(localValue35, localValue37), localValue2.syncActiveFriendReference?.(localValue35), localValue2.syncSettingsFriendReference?.(localValue35);
          const localValue38 = localValue1.document?.["getElementById"]("chat-interface-" + localValue27)?.["querySelector"](".ins-chat-messages");
          localValue33 && localValue38 && (localValue1.imChat?.["renderMessageBubble"]?.(localValue34.message, localValue35, localValue38, localValue34.message.timestamp), localValue1.imChat?.["scrollToBottom"]?.(localValue38));
          localValue2.requestChatsListRefresh?.();
          if (typeof localValue1.CustomEvent === "function") localValue1.dispatchEvent(new localValue1.CustomEvent("u2:friend-message-appended", {
            "detail": {
              "friendId": localValue27,
              "messageId": localValue34.message.id
            }
          }));
        }
        if (typeof localValue1.CustomEvent === "function") localValue1.dispatchEvent(new localValue1.CustomEvent("u2:group-announcement-updated", {
          "detail": {
            "groupId": localValue27
          }
        }));
        return localValue34;
      });
    } catch (localValue39) {
      return console.error("[iMessage] Group announcement save failed", localValue39), {
        "success": false,
        "reason": "save_failed"
      };
    }
  }, (localValue1.u2OnStorageReady || (localValue40 => localValue1.document.addEventListener("DOMContentLoaded", localValue40)))(() => {
    const localValue41 = localValue1.document.getElementById("group-announcement-sheet");
    if (!localValue41) return;
    const localValue42 = localValue50 => localValue1.document.getElementById("group-announcement-" + localValue50);
    let localValue43 = "",
      localValue44 = null,
      localValue45 = false,
      localValue46 = false,
      localValue47 = null;
    const localValue48 = () => {
      localValue1.closeView(localValue41), localValue47?.["focus"]?.();
    };
    function localValue49() {
      const localValue51 = localValue3(localValue43),
        localValue52 = localValue45 ? localValue44 : localValue51?.["groupAnnouncement"],
        localValue53 = !localValue45 && localValue2.canPublishGroupAnnouncement(localValue51, {
          "role": "user"
        });
      localValue42("title").textContent = localValue45 ? "群公告 · 历史记录" : "群公告", localValue42("meta").textContent = localValue52?.["content"] ? ["发布：" + (localValue52.publishedBy?.["name"] || "群成员") + " · " + localValue5(localValue52.publishedAt), localValue52.updatedAt ? "修改：" + (localValue52.updatedBy?.["name"] || "群成员") + " · " + localValue5(localValue52.updatedAt) : ""].filter(Boolean).join("\n") : "", localValue42("content").textContent = localValue52?.["content"] || "暂无群公告", localValue42("content").hidden = localValue46, localValue42("input").hidden = !localValue46, localValue42("input-label").hidden = !localValue46, localValue42("edit").hidden = localValue46 || !localValue53, localValue42("save").hidden = !localValue46 || !localValue53, localValue42("cancel").hidden = !localValue46, localValue42("edit").textContent = localValue52 ? "修改公告" : "发布公告", localValue42("save").textContent = localValue52 ? "保存修改" : "发布公告", localValue42("save").disabled = !localValue42("input").value.trim();
    }
    localValue2.openGroupAnnouncement = function (localValue54, localValue55) {
      const localValue56 = localValue3(localValue54);
      if (!localValue56 || localValue56.type !== "group") return false;
      return localValue43 = String(localValue56.id), localValue45 = !!localValue55, localValue44 = localValue4(localValue55), localValue46 = false, localValue47 = localValue1.document.activeElement, localValue49(), localValue1.openView(localValue41), localValue42("close").focus(), true;
    }, localValue42("close").addEventListener("click", localValue48), localValue41.addEventListener("click", localValue57 => {
      if (localValue57.target === localValue41) localValue48();
    }), localValue41.addEventListener("keydown", localValue58 => {
      localValue58.key === "Escape" && (localValue58.stopPropagation(), localValue48());
    }), localValue42("edit").addEventListener("click", () => {
      const localValue59 = localValue3(localValue43);
      if (!localValue2.canPublishGroupAnnouncement(localValue59, {
        "role": "user"
      })) return;
      localValue46 = true, localValue42("input").value = localValue59.groupAnnouncement?.["content"] || "", localValue49(), localValue42("input").focus();
    }), localValue42("cancel").addEventListener("click", () => {
      localValue46 = false, localValue49();
    }), localValue42("input").addEventListener("input", () => {
      localValue42("save").disabled = !localValue42("input").value.trim();
    }), localValue42("save").addEventListener("click", async () => {
      if (localValue42("save").disabled) return;
      localValue42("save").disabled = true;
      const localValue60 = await localValue2.publishGroupAnnouncement(localValue43, {
        "role": "user"
      }, localValue42("input").value);
      localValue60.success ? (localValue46 = false, localValue49(), localValue1.showToast?.(localValue60.unchanged ? "公告内容未变化" : "群公告已保存")) : (localValue42("save").disabled = false, localValue1.showToast?.(localValue60.reason === "forbidden" ? "当前无法发布群公告" : "群公告保存失败"));
    }), localValue1.addEventListener("u2:group-announcement-updated", localValue61 => {
      if (String(localValue61.detail?.["groupId"]) === localValue43 && !localValue46 && !localValue45) localValue49();
    });
  });
})(typeof window !== "undefined" ? window : globalThis);
