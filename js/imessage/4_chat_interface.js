(window.u2OnStorageReady || (callback => document.addEventListener("DOMContentLoaded", callback)))(() => {
  const {
    apiConfig: apiConfig_2,
    userState: userState_2
  } = window;
  window.imChat = window.imChat || {};
  const imChat_2 = window.imChat,
    isAndroid = /Android/i.test(navigator.userAgent || ""),
    nativeInsetsOnly_2 = isAndroid && window.u2NativeBridge?.isNativeAndroid?.() === true;
  isAndroid && window.mobileInputCompat?.registerFocusScope && !imChat_2._androidChatFocusScopeCleanup && (imChat_2._androidChatFocusScopeCleanup = window.mobileInputCompat.registerFocusScope({
    selector: ".active-chat-interface",
    priority: 40,
    preferFocusScope: true,
    nativeInsetsOnly: nativeInsetsOnly_2,
    followViewportOrigin: true,
    resolveViewportRoot: (value_27, value_28) => value_28?.closest("#imessage-view") || value_28,
    resolveScrollContainer: (value_29, element) => element?.querySelector(".ins-chat-messages") || null,
    scrollBehavior: "latest",
    viewportClassName: "u2-android-chat-viewport-sized",
    viewportHeightCssVariable: "--u2-android-chat-viewport-height",
    viewportTopCssVariable: "--u2-android-chat-viewport-top"
  }));
  isAndroid && window.mobileInputCompat?.registerFocusScope && !imChat_2._androidOfflineFocusScopeCleanup && (imChat_2._androidOfflineFocusScopeCleanup = window.mobileInputCompat.registerFocusScope({
    selector: "#offline-chat-view",
    priority: 40,
    preferFocusScope: true,
    nativeInsetsOnly: nativeInsetsOnly_2,
    followViewportOrigin: true,
    resolveScrollContainer: (value_30, element_31) => value_30?.id === "offline-chat-input" ? null : element_31?.querySelector(".offline-chat-content"),
    scrollBehavior: "focus",
    viewportClassName: "u2-android-chat-viewport-sized",
    viewportHeightCssVariable: "--u2-android-chat-viewport-height",
    viewportTopCssVariable: "--u2-android-chat-viewport-top"
  }));
  function getBatchRowDescriptor_2(row_2) {
    if (!row_2 || !row_2.classList?.contains("chat-row") || row_2.classList.contains("memory-recall-narration") || row_2.classList.contains("unblock-request-row")) return null;
    const id_2 = String(row_2.getAttribute("data-message-id") || "").trim(),
      timestamp_2 = String(row_2.getAttribute("data-timestamp") || "").trim();
    if (!id_2 && !timestamp_2) return null;
    return {
      key: id_2 ? "id:" + id_2 : "timestamp:" + timestamp_2,
      id: id_2 || null,
      timestamp: timestamp_2 || null
    };
  }
  function ensureBatchSelectionMap() {
    return !(window.imData.batchSelectedMessages instanceof Map) && (window.imData.batchSelectedMessages = new Map()), window.imData.batchSelectedMessages;
  }
  function syncBatchSelectionUi_2(friend_2, value_36 = null) {
    const friendId_2 = String(friend_2?.id || window.imData.currentActiveFriend?.id || ""),
      activePage = value_36 || document.getElementById("chat-interface-" + friendId_2);
    if (!activePage) return;
    const isActiveSelection = !!window.imData.batchSelectMode && String(window.imData.batchSelectionFriendId || "") === friendId_2,
      selection = ensureBatchSelectionMap(),
      topBar = activePage.querySelector(".chat-top-bar"),
      batchHeader = activePage.querySelector(".chat-batch-header"),
      insChatInputWrapperElement = activePage.querySelector(".ins-chat-input-wrapper");
    if (topBar) topBar.style.display = isActiveSelection ? "none" : "flex";
    if (batchHeader) batchHeader.style.display = isActiveSelection ? "flex" : "none";
    if (insChatInputWrapperElement) insChatInputWrapperElement.style.display = isActiveSelection ? "none" : "flex";
    activePage.querySelectorAll(".chat-checkbox-wrapper").forEach(wrapper => {
      const row_3 = wrapper.closest(".chat-row"),
        descriptor_2 = getBatchRowDescriptor_2(row_3),
        selected = !!descriptor_2 && selection.has(descriptor_2.key);
      wrapper.style.display = isActiveSelection ? "flex" : "none";
      const icon = wrapper.querySelector("i");
      if (!icon) return;
      icon.className = selected ? "fas fa-check-circle chat-checkbox" : "far fa-circle chat-checkbox";
      icon.style.color = selected ? "#111111" : "#c7c7cc";
    });
    const selectedCount = isActiveSelection ? selection.size : 0,
      count_2 = activePage.querySelector(".chat-batch-selection-count");
    if (count_2) count_2.textContent = "已选择 " + selectedCount + " 条";
    const batchDeleteBtnElement = activePage.querySelector(".batch-delete-btn"),
      batchForwardBtnElement = activePage.querySelector(".batch-forward-btn");
    batchForwardBtnElement && (batchForwardBtnElement.disabled = selectedCount === 0, batchForwardBtnElement.style.opacity = selectedCount === 0 ? "0.4" : "1");
    batchDeleteBtnElement && (batchDeleteBtnElement.disabled = selectedCount === 0, batchDeleteBtnElement.style.opacity = selectedCount === 0 ? "0.4" : "1");
  }
  function exitBatchSelectMode_2(friend = window.imData.currentActiveFriend, page = null) {
    const friendId_3 = String(friend?.id || window.imData.batchSelectionFriendId || "");
    window.imData.batchSelectMode = false;
    window.imData.batchSelectionFriendId = "";
    ensureBatchSelectionMap().clear();
    syncBatchSelectionUi_2({
      id: friendId_3
    }, page);
  }
  function enterBatchSelectMode_2(value_45, value_46, value_47 = null) {
    const batchSelectionFriendId_2 = String(value_45?.id || ""),
      descriptor_3 = getBatchRowDescriptor_2(value_46);
    if (!batchSelectionFriendId_2 || !descriptor_3) return false;
    const batchSelectionMap_50 = ensureBatchSelectionMap();
    return batchSelectionMap_50.clear(), batchSelectionMap_50.set(descriptor_3.key, descriptor_3), window.imData.batchSelectMode = true, window.imData.batchSelectionFriendId = batchSelectionFriendId_2, syncBatchSelectionUi_2(value_45, value_47), true;
  }
  function toggleBatchRowSelection_2(value_51, value_52, value_53 = null) {
    const friendId_4 = String(value_51?.id || "");
    if (!window.imData.batchSelectMode || String(window.imData.batchSelectionFriendId || "") !== friendId_4) return false;
    const descriptor_4 = getBatchRowDescriptor_2(value_52);
    if (!descriptor_4) return false;
    const batchSelectionMap_56 = ensureBatchSelectionMap();
    if (batchSelectionMap_56.has(descriptor_4.key)) batchSelectionMap_56["delete"](descriptor_4.key);else batchSelectionMap_56.set(descriptor_4.key, descriptor_4);
    return syncBatchSelectionUi_2(value_51, value_53), true;
  }
  imChat_2.getBatchRowDescriptor = getBatchRowDescriptor_2;
  imChat_2.syncBatchSelectionUi = syncBatchSelectionUi_2;
  imChat_2.enterBatchSelectMode = enterBatchSelectMode_2;
  imChat_2.exitBatchSelectMode = exitBatchSelectMode_2;
  imChat_2.toggleBatchRowSelection = toggleBatchRowSelection_2;
  function formatStatusLabel(value_4, isSleeping = false) {
    if (isSleeping) return "offline";
    const raw = String(value_4 || "online").trim(),
      normalized = raw.toLowerCase();
    if (normalized === "offline" || raw === "离线") return "offline";
    if (normalized === "online" || raw === "在线") return "online";
    return raw || "online";
  }
  function normalizeStatusForStorage(value_61) {
    const raw_2 = String(value_61 || "").trim(),
      normalized_2 = raw_2.toLowerCase();
    if (!raw_2 || normalized_2 === "online" || raw_2 === "在线") return "online";
    if (normalized_2 === "offline" || raw_2 === "离线") return "offline";
    return raw_2;
  }
  function formatGroupMemberCount(count_3) {
    const safeCount = Math.max(0, Number(count_3) || 0);
    return safeCount + " member" + (safeCount === 1 ? "" : "s");
  }
  function handleAction_15(value_66) {
    if (!value_66 || document.activeElement === value_66) return;
    try {
      value_66.focus({
        preventScroll: true
      });
    } catch (value_67) {
      value_66.focus();
    }
  }
  function closeStaleGroupCallSheets() {
    ["group-call-invite-sheet", "group-more-sheet"].forEach(id_3 => {
      const sheet = document.getElementById(id_3);
      if (!sheet) return;
      sheet.classList.remove("active");
      sheet.style.pointerEvents = "";
    });
  }
  function renderTogetherListeningPlayer_2(friendOrId) {
    const friendId_5 = String(typeof friendOrId === "object" ? friendOrId?.id ?? "" : friendOrId ?? "");
    if (!friendId_5) return;
    const friend_3 = (window.imData?.friends || []).find(item_2 => String(item_2.id) === friendId_5) || (typeof friendOrId === "object" ? friendOrId : null),
      page_2 = document.getElementById("chat-interface-" + friendId_5),
      card_2 = page_2?.querySelector(".im-together-listening-player");
    if (!card_2) return;
    const snapshot = friend_3?.type === "char" && window.libraryApp?.getTogetherListeningSnapshot ? window.libraryApp.getTogetherListeningSnapshot(friendId_5) : null;
    card_2.hidden = !snapshot;
    if (!snapshot) return;
    const art = card_2.querySelector(".im-together-listening-art"),
      title_2 = card_2.querySelector(".im-together-listening-title"),
      artist_2 = card_2.querySelector(".im-together-listening-artist"),
      play = card_2.querySelector("[data-together-listening-control=\"toggle\"]");
    if (art) {
      art.innerHTML = snapshot.coverUrl ? "" : "<i class=\"fas fa-music\"></i>";
      if (snapshot.coverUrl) {
        const image = document.createElement("img");
        image.src = snapshot.coverUrl;
        image.alt = "";
        image.referrerPolicy = "no-referrer";
        art.appendChild(image);
      }
    }
    if (title_2) title_2.textContent = snapshot.title || "未知歌曲";
    if (artist_2) artist_2.textContent = snapshot.artist || "未知歌手";
    play && (play.innerHTML = "<i class=\"fas " + (snapshot.isPlaying ? "fa-pause" : "fa-play") + "\"></i>", play.setAttribute("aria-label", snapshot.isPlaying ? "暂停" : "播放"));
    card_2.style.setProperty("--together-progress", Math.round((snapshot.progress || 0) * 10000) / 100 + "%");
  }
  imChat_2.renderTogetherListeningPlayer = renderTogetherListeningPlayer_2;
  !imChat_2._togetherListeningEventBound && (imChat_2._togetherListeningEventBound = true, window.addEventListener("library:together-listening-change", () => {
    document.querySelectorAll(".im-together-listening-player").forEach(card_3 => {
      const page_3 = card_3.closest(".active-chat-interface"),
        friendId_6 = String(page_3?.id || "").replace(/^chat-interface-/, "");
      if (friendId_6) renderTogetherListeningPlayer_2(friendId_6);
    });
  }));
  function getGroupAvatarInitial(friend_4) {
    return String(friend_4?.nickname || friend_4?.realName || "G").charAt(0).toUpperCase();
  }
  function renderGroupHeaderAvatarInnerHtml(friend_5) {
    const avatarUrl_2 = friend_5?.avatarUrl || "";
    if (avatarUrl_2) return "<img class=\"im-group-header-avatar-img\" src=\"" + avatarUrl_2 + "\" alt=\"\">";
    return "<div class=\"im-group-header-avatar-fallback\">" + getGroupAvatarInitial(friend_5) + "</div>";
  }
  imChat_2.refreshGroupHeaderAvatar = function (groupOrId_2) {
    const groupId_2 = groupOrId_2 && typeof groupOrId_2 === "object" ? groupOrId_2.id : groupOrId_2;
    if (groupId_2 == null) return false;
    const latestGroup = (window.imData?.friends || []).find(item_3 => String(item_3.id) === String(groupId_2)) || (groupOrId_2 && typeof groupOrId_2 === "object" ? groupOrId_2 : null);
    if (!latestGroup || latestGroup.type !== "group") return false;
    const page_4 = document.getElementById("chat-interface-" + latestGroup.id);
    if (!page_4) return false;
    const inner = page_4.querySelector(".group-header-right-avatar-inner");
    if (!inner) return false;
    return inner.innerHTML = renderGroupHeaderAvatarInnerHtml(latestGroup), true;
  };
  function getLiveGroup(groupOrId) {
    const groupId = groupOrId && typeof groupOrId === "object" ? groupOrId.id : groupOrId;
    if (groupId == null) return groupOrId && typeof groupOrId === "object" ? groupOrId : null;
    return (window.imData?.friends || []).find(item => String(item.id) === String(groupId)) || (groupOrId && typeof groupOrId === "object" ? groupOrId : null);
  }
  function isLeftGroup(group) {
    return group && group.type === "group" && Number(group.leftGroupAt) > 0;
  }
  function getGroupMemberCount(group_2) {
    const memberCount = typeof window.imChat?.getGroupMemberFriends === "function" ? window.imChat.getGroupMemberFriends(group_2).length : new Set((Array.isArray(group_2?.members) ? group_2.members : []).map(memberId_2 => String(memberId_2))).size;
    return memberCount + (isLeftGroup(group_2) ? 0 : 1);
  }
  async function rejoinGroupChat(value_88, page_5) {
    const liveGroup = getLiveGroup(value_88);
    if (!liveGroup || liveGroup.type !== "group") return false;
    const saved_2 = window.imApp?.commitScopedFriendChange ? await window.imApp.commitScopedFriendChange(liveGroup.id, targetGroup => {
      if (!targetGroup) return;
      targetGroup.leftGroupAt = 0;
      targetGroup.groupObserverMode = false;
      targetGroup.leftGroupMemberSnapshot = [];
    }, {
      syncActive: true,
      metaOnly: true,
      silent: true
    }) : false;
    if (!saved_2) {
      if (window.showToast) window.showToast("重新进入失败");
      return false;
    }
    const groupRejoinedNotice = {
      id: "sys-" + Date.now(),
      role: "system",
      type: "system_notice",
      noticeKind: "group_rejoined",
      content: "你重新进入群聊",
      text: "你重新进入群聊",
      timestamp: Date.now()
    };
    await window.imApp.appendFriendMessage(liveGroup.id, groupRejoinedNotice, {
      silent: true
    });
    const latestGroup_2 = getLiveGroup(liveGroup) || liveGroup;
    if (window.showToast) window.showToast("已重新进入群聊");
    if (page_5) imChat_2.syncGroupExitState(latestGroup_2, page_5);
    const msgContainer = page_5 ? page_5.querySelector(".ins-chat-messages") : null;
    msgContainer && window.imChat?.rerenderChatContainer && window.imChat.rerenderChatContainer(latestGroup_2, msgContainer, {
      scroll: true
    });
    if (window.imApp.openChatTab) window.imApp.openChatTab(latestGroup_2);
    return true;
  }
  imChat_2.syncGroupExitState = function (value_93, page_6) {
    const group_3 = getLiveGroup(value_93);
    if (!group_3 || group_3.type !== "group" || !page_6) return false;
    const disabled_2 = isLeftGroup(group_3),
      insChatInputWrapperElement_97 = page_6.querySelector(".ins-chat-input-wrapper"),
      leftBar = page_6.querySelector(".im-left-group-bar"),
      input = page_6.querySelector(".chat-input"),
      replyPreviewContainerElement = page_6.querySelector(".reply-preview-container"),
      atMentionListElement = page_6.querySelector(".at-mention-list");
    if (insChatInputWrapperElement_97) insChatInputWrapperElement_97.style.display = disabled_2 ? "none" : "flex";
    if (leftBar) leftBar.style.display = disabled_2 ? "flex" : "none";
    input && (input.disabled = disabled_2, input.value = disabled_2 ? "" : input.value);
    if (disabled_2 && replyPreviewContainerElement) replyPreviewContainerElement.style.display = "none";
    if (disabled_2 && atMentionListElement) atMentionListElement.style.display = "none";
    const rejoinBtn = leftBar ? leftBar.querySelector(".im-left-group-rejoin-btn") : null,
      aiBtn = leftBar ? leftBar.querySelector(".im-left-group-ai-btn") : null,
      stateLabel = leftBar ? leftBar.querySelector(".im-left-group-label") : null,
      msgContainer_2 = page_6.querySelector(".ins-chat-messages");
    if (stateLabel) stateLabel.textContent = group_3.groupObserverMode ? "旁观群聊" : "已退出该群";
    if (rejoinBtn) rejoinBtn.style.display = group_3.groupObserverMode ? "none" : "";
    return rejoinBtn && (rejoinBtn.onclick = e => {
      e.preventDefault();
      void rejoinGroupChat(group_3, page_6);
    }), aiBtn && (aiBtn.onclick = event => {
      event.preventDefault();
      if (!window.imChat?.handleAiReply) {
        if (window.showToast) window.showToast("无法调用 AI 接口");
        return;
      }
      const latestGroup_3 = getLiveGroup(group_3) || group_3;
      if (!window.showCustomModal) {
        window.imChat.handleAiReply(latestGroup_3, msgContainer_2, aiBtn, {
          source: "left_group_continue"
        });
        return;
      }
      window.showCustomModal({
        type: "prompt",
        multiline: true,
        title: "推进剧情",
        message: "可以输入你希望群成员接下来聊的方向；留空则由他们自由发展。",
        placeholder: "例如：让他们聊聊刚才发生的事（可留空）",
        confirmText: "推进",
        confirmTone: "dark",
        onConfirm: value_102 => {
          const trim_103 = String(value_102 || "").trim(),
            extraSystemPrompt_2 = trim_103 ? "【旁观推进提示｜仅影响本轮群聊】\n旁观者希望群成员接下来围绕以下方向自然聊天：" + trim_103 + "\n这不是 User 在群内发送的消息，不得让任何成员声称看到 User 发言，也不得让 User 出现在群内。" : "";
          window.imChat.handleAiReply(latestGroup_3, msgContainer_2, aiBtn, {
            source: "left_group_continue",
            continueWithoutUser: true,
            extraSystemPrompt: extraSystemPrompt_2
          });
        }
      });
    }), true;
  };
  const IM_CHAT_PAGE_CACHE_LIMIT = 10;
  function touchChatPageCache(page_7) {
    if (page_7) page_7.dataset.imChatCacheUsedAt = String(Date.now());
  }
  function pruneHiddenChatPages_2(options_2 = {}) {
    const chatsContent = document.getElementById("chats-content");
    if (!chatsContent) return 0;
    const keepFriendId_2 = options_2.keepFriendId == null ? "" : String(options_2.keepFriendId),
      activeFriendId = window.imData?.currentActiveFriend?.id == null ? "" : String(window.imData.currentActiveFriend.id),
      pages = Array.from(chatsContent.querySelectorAll(".active-chat-interface[id^=\"chat-interface-\"]")),
      candidates = pages.filter(page_8 => {
        const friendId_7 = String(page_8.id).replace(/^chat-interface-/, "");
        return friendId_7 !== keepFriendId_2 && friendId_7 !== activeFriendId && page_8.style.display === "none";
      }).sort((left_2, right_2) => (Number(left_2.dataset.imChatCacheUsedAt) || 0) - (Number(right_2.dataset.imChatCacheUsedAt) || 0));
    let overflow_2 = Math.max(0, pages.length - IM_CHAT_PAGE_CACHE_LIMIT);
    while (overflow_2 > 0 && candidates.length > 0) {
      const shift_115 = candidates.shift();
      window.imChat?.disposeOnlineChatBottomFollower?.(shift_115.querySelector(".ins-chat-messages"));
      shift_115.remove();
      overflow_2 -= 1;
    }
    return Math.max(0, pages.length - IM_CHAT_PAGE_CACHE_LIMIT - overflow_2);
  }
  window.imChat.pruneHiddenChatPages = pruneHiddenChatPages_2;
  let count_19 = 0;
  function handleAction_20(value_116, element_117) {
    if (!value_116 || !element_117) return {
      shell: null,
      cachedPage: null
    };
    const pageId = "chat-interface-" + value_116.id,
      cachedPage_2 = document.getElementById(pageId);
    Array.from(element_117.children).forEach(element_122 => {
      element_122.classList?.contains("active-chat-interface") && (element_122.style.display = "none", window.imChat?.disposeOnlineChatBottomFollower?.(element_122.querySelector(".ins-chat-messages")));
    });
    const chatsEmptyStateElement = document.getElementById("chats-empty-state"),
      chatsListContainerElement = document.getElementById("chats-list-container"),
      lineHeaderElement = document.querySelector(".line-header"),
      lineBottomNavContainerElement = document.querySelector(".line-bottom-nav-container");
    if (chatsEmptyStateElement) chatsEmptyStateElement.style.display = "none";
    if (chatsListContainerElement) chatsListContainerElement.style.display = "none";
    if (lineHeaderElement) lineHeaderElement.style.display = "none";
    if (lineBottomNavContainerElement) lineBottomNavContainerElement.style.display = "none";
    if (cachedPage_2) {
      cachedPage_2.style.display = "flex";
      const insChatMessagesElement_123 = cachedPage_2.querySelector(".ins-chat-messages");
      return window.imChat?.settleOnlineChatAtLatest?.(insChatMessagesElement_123), {
        shell: null,
        cachedPage: cachedPage_2
      };
    }
    const friendRecentMessageWindow = window.imApp?.getFriendRecentMessageWindow?.(value_116),
      value_120 = value_116.messagesLoaded === true || friendRecentMessageWindow?.loaded === true || Array.isArray(value_116.messages) && value_116.messages.length > 0 || Math.max(0, Number(value_116.messageCount) || 0) === 0;
    if (value_120) return {
      shell: null,
      cachedPage: null
    };
    const shell_2 = document.createElement("div");
    return shell_2.className = "active-chat-interface im-chat-interface im-chat-loading-shell", shell_2.dataset.friendId = String(value_116.id), shell_2.innerHTML = "\n        <div class=\"im-chat-loading-header\">\n            <i class=\"fas fa-chevron-left\" aria-hidden=\"true\"></i>\n            <span></span>\n        </div>\n        <div class=\"im-chat-loading-body\" role=\"status\" aria-live=\"polite\">\n            <span class=\"im-chat-loading-spinner\" aria-hidden=\"true\"></span>\n            <span>正在载入对话…</span>\n        </div>\n    ", shell_2.querySelector(".im-chat-loading-header span").textContent = value_116.nickname || value_116.realName || "聊天", element_117.appendChild(shell_2), {
      shell: shell_2,
      cachedPage: null
    };
  }
  async function openChatTab_2(friend_6) {
    const value_125 = ++count_19,
      chatsContent_2 = document.getElementById("chats-content"),
      navChatsBtn = document.getElementById("nav-chats-btn");
    window.imApp?.setActiveThemeSurface?.("chat-detail");
    closeStaleGroupCallSheets();
    const currentActiveFriend_2 = (window.imData.friends || []).find(item_4 => String(item_4.id) === String(friend_6.id)) || friend_6;
    window.imData.currentActiveFriend = currentActiveFriend_2;
    const handleAction_20_128 = handleAction_20(currentActiveFriend_2, chatsContent_2);
    if (window.imApp.ensureFriendRecentMessagesLoaded) await window.imApp.ensureFriendRecentMessagesLoaded(friend_6, {
      onLoaded: (value_140, currentActiveFriend_4) => {
        window.imData.currentActiveFriend && String(window.imData.currentActiveFriend.id) === String(currentActiveFriend_4.id) && (window.imData.currentActiveFriend = currentActiveFriend_4);
      }
    });else window.imApp.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(friend_6));
    currentActiveFriend_2.pendingLovesUnbindRequest && window.imApp.reconcilePendingLovesUnbindRequest && (await window.imApp.reconcilePendingLovesUnbindRequest(friend_6));
    if (value_125 !== count_19) {
      handleAction_20_128.shell?.remove();
      return;
    }
    const currentActiveFriend_3 = (window.imData.friends || []).find(item_5 => String(item_5.id) === String(friend_6.id)) || friend_6;
    window.imData.batchSelectMode && String(window.imData.batchSelectionFriendId || "") !== String(currentActiveFriend_3.id) && exitBatchSelectMode_2(window.imData.currentActiveFriend);
    window.imData.currentActiveFriend = currentActiveFriend_3;
    friend_6 = currentActiveFriend_3;
    window.imApp.clearFriendUnread && void window.imApp.clearFriendUnread(friend_6.id, {
      silent: true
    });
    let id_4 = "chat-interface-" + friend_6.id,
      page_9 = document.getElementById(id_4);
    const isGroupChat = friend_6.type === "group",
      isNpcChat = friend_6.type === "npc",
      value_134 = friend_6.type === "official",
      className_2 = "active-chat-interface im-chat-interface " + (isGroupChat ? "im-chat-group" : isNpcChat ? "im-chat-npc" : value_134 ? "im-chat-official" : "im-chat-single"),
      isSleeping_2 = window.imApp.isCharacterSleeping(friend_6),
      statusLabel = formatStatusLabel(isSleeping_2 ? "offline" : "online", isSleeping_2),
      value_138 = isSleeping_2 ? "#8e8e93" : "#34c759";
    page_9 && (page_9.className = className_2, page_9.style.setProperty("--im-chat-status-color", value_138), touchChatPageCache(page_9), window.imApp.applyFriendCss && window.imApp.applyFriendCss(friend_6));
    if (!page_9) {
      page_9 = document.createElement("div");
      page_9.id = id_4;
      page_9.className = className_2;
      page_9.style.display = "none";
      touchChatPageCache(page_9);
      page_9.style.setProperty("--im-chat-status-color", value_138);
      let value_143;
      isGroupChat ? value_143 = renderGroupHeaderAvatarInnerHtml(friend_6) : value_143 = friend_6.avatarUrl ? "<img src=\"" + friend_6.avatarUrl + "\" style=\"display: block;\">" : "<i class=\"fas fa-user\"></i>";
      const value_144 = isGroupChat ? "position: relative; top: 0; padding: 0 16px; align-items: center; justify-content: space-between; display: flex; pointer-events: none; width: 100%;" : "position: relative; top: 0; padding: 0 16px; align-items: center;";
      let text_145 = "";
      if (isGroupChat) text_145 = "<div class=\"im-chat-group-title-wrap\" style=\"display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 0; padding: 4px 16px; background: rgba(242, 242, 247, 0.85);   border-radius: 40px;  pointer-events: auto;\">\n                        <div class=\"ins-chat-name\" style=\"font-size: 14px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;\">" + friend_6.nickname + "</div>\n                        <div class=\"ins-chat-sign\" style=\"font-size: 11px; font-weight: 500; color: #8e8e93; margin-top: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 4px;\">" + formatGroupMemberCount(getGroupMemberCount(friend_6)) + "</div>\n                   </div>";else {
        if (friend_6.type === "official") text_145 = "<div class=\"im-chat-avatar-wrap\">\n                        <div class=\"ins-chat-avatar\" style=\"pointer-events: none;\">\n                            " + value_143 + "\n                        </div>\n                   </div>\n                   <div class=\"im-chat-title-wrap\">\n                        <div class=\"ins-chat-name\">" + friend_6.nickname + "</div>\n                        <div class=\"ins-chat-sign\"><div class=\"im-chat-status-dot\"></div><span>" + statusLabel + "</span></div>\n                   </div>";else isNpcChat ? text_145 = "<div class=\"im-chat-avatar-wrap\">\n                        <div class=\"ins-chat-avatar\">\n                            " + value_143 + "\n                        </div>\n                   </div>\n                   <div class=\"im-chat-title-wrap\">\n                        <div class=\"ins-chat-name\">" + friend_6.nickname + "</div>\n                   </div>" : text_145 = "<div class=\"im-chat-avatar-wrap\">\n                        <div class=\"ins-chat-avatar\">\n                            " + value_143 + "\n                        </div>\n                   </div>\n                   <div class=\"im-chat-title-wrap\">\n                        <div class=\"ins-chat-name\">" + friend_6.nickname + "</div>\n                        <div class=\"ins-chat-sign\"><div class=\"im-chat-status-dot\"></div><span>" + statusLabel + "</span></div>\n                   </div>";
      }
      let text_146 = "";
      if (isGroupChat) text_146 = "<button type=\"button\" class=\"group-header-right-avatar\" aria-label=\"打开群聊详情\" title=\"群聊详情\">\n                        <div class=\"group-header-right-avatar-inner\">" + value_143 + "</div>\n                   </button>";else {
        if (friend_6.type === "official") text_146 = "<button type=\"button\" class=\"chat-menu-btn im-chat-icon-btn official-settings-btn\" aria-label=\"office 设置\" title=\"office 设置\"><i class=\"fas fa-bars\"></i></button>";else isNpcChat ? text_146 = "<button type=\"button\" class=\"chat-menu-btn im-chat-icon-btn\" aria-label=\"聊天设置\" title=\"聊天设置\"><i class=\"fas fa-bars\" aria-hidden=\"true\"></i></button>" : text_146 = "<button type=\"button\" class=\"chat-call-btn im-chat-icon-btn\" aria-label=\"视频通话\" title=\"视频通话\"><i class=\"fas fa-phone-alt\" aria-hidden=\"true\"></i></button>\n                   <button type=\"button\" class=\"chat-menu-btn im-chat-icon-btn\" aria-label=\"聊天设置\" title=\"聊天设置\"><i class=\"fas fa-bars\" aria-hidden=\"true\"></i></button>";
      }
      const value_147 = isGroupChat ? "<button type=\"button\" class=\"chat-back-btn im-chat-back-btn im-chat-group-back-btn\" aria-label=\"返回聊天列表\" title=\"返回聊天列表\"><i class=\"fas fa-chevron-left\" aria-hidden=\"true\"></i></button>" : "<button type=\"button\" class=\"chat-back-btn im-chat-back-btn\" aria-label=\"返回聊天列表\" title=\"返回聊天列表\"><i class=\"fas fa-chevron-left\" aria-hidden=\"true\"></i></button>";
      let text_148 = "";
      isGroupChat ? text_148 = "\n                    <div class=\"chat-top-bar\" style=\"" + value_144 + "\">\n                        " + value_147 + "\n                        <div style=\"display: flex; align-items: center; justify-content: center; flex: 1; pointer-events: none;\" class=\"ins-chat-header\" id=\"active-chat-header\">\n                            " + text_145 + "\n                        </div>\n                        <div id=\"active-chat-right-avatar-container\">\n                            " + text_146 + "\n                        </div>\n                    </div>\n                " : text_148 = "\n                    <div class=\"chat-top-bar im-chat-top-bar\">\n                        <div class=\"im-chat-header-left\">\n                            " + value_147 + "\n                            <div class=\"ins-chat-header im-chat-header-main\">\n                                " + text_145 + "\n                            </div>\n                        </div>\n                        <div class=\"im-chat-actions\">\n                            " + text_146 + "\n                        </div>\n                    </div>\n                ";
      page_9.innerHTML = "\n                <div class=\"chat-sticky-container " + (isGroupChat ? "is-group" : "is-friend") + "\">\n                    " + text_148 + "\n                    <div class=\"chat-batch-header\" style=\"display:none; align-items:center; justify-content:space-between; min-height:46px; padding:0 14px; color:#111; pointer-events:auto;\">\n                        <button type=\"button\" class=\"chat-cancel-batch-btn im-chat-cancel-batch-btn\">取消</button>\n                        <div class=\"chat-batch-selection-count\" style=\"font-size:16px; font-weight:600;\">已选择 0 条</div>\n                        <div class=\"chat-batch-actions\">\n                            <button type=\"button\" class=\"batch-forward-btn\">转发</button>\n                            <button type=\"button\" class=\"batch-delete-btn\">删除</button>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"ins-chat-messages\"></div>\n                <button type=\"button\" class=\"im-chat-scroll-latest\" aria-label=\"回到最新消息\" aria-hidden=\"true\" tabindex=\"-1\">\n                    <i class=\"fas fa-chevron-down\" aria-hidden=\"true\"></i>\n                </button>\n                <div class=\"ins-chat-input-container\">\n                    <div class=\"im-together-listening-player\" hidden>\n                        <button class=\"im-together-listening-main\" type=\"button\" aria-label=\"打开正在播放\">\n                            <span class=\"im-together-listening-art\"><i class=\"fas fa-music\"></i></span>\n                            <span class=\"im-together-listening-copy\"><strong class=\"im-together-listening-title\">未知歌曲</strong><small class=\"im-together-listening-artist\">未知歌手</small></span>\n                        </button>\n                        <button class=\"im-together-listening-control\" type=\"button\" data-together-listening-control=\"toggle\" aria-label=\"播放\"><i class=\"fas fa-play\"></i></button>\n                        <button class=\"im-together-listening-control\" type=\"button\" data-together-listening-control=\"next\" aria-label=\"下一首\"><i class=\"fas fa-forward-step\"></i></button>\n                        <span class=\"im-together-listening-progress\"></span>\n                    </div>\n                    <div class=\"reply-preview-container\" style=\"display:none; padding: 10px 14px; background: #f2f2f7; border-radius: 18px; margin-bottom: 10px; font-size: 13px; color: #8e8e93; position: relative; margin-left: 10px; margin-right: 10px; max-width: fit-content; border: 1px solid #e5e5ea; \">\n                        <div class=\"reply-preview-text\" style=\"white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 24px; color: #333; max-width: 250px;\"></div>\n                        <button type=\"button\" class=\"reply-cancel-btn\" aria-label=\"取消回复\" title=\"取消回复\" style=\"position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; border-radius: 50%; background: #ccc; color: #fff; display: flex; justify-content: center; align-items: center; cursor: pointer; font-size: 10px;\"><i class=\"fas fa-times\" aria-hidden=\"true\"></i></button>\n                    </div>\n                    <div class=\"ins-chat-input-wrapper\">\n                        " + (isNpcChat ? "" : "<button type=\"button\" class=\"ins-input-icon plus-btn\" aria-label=\"添加附件\" title=\"添加附件\"><i class=\"fas fa-plus\" aria-hidden=\"true\"></i></button>") + "\n                        <input type=\"text\" placeholder=\"imessage...\" class=\"ins-message-input chat-input\" inputmode=\"text\" enterkeyhint=\"send\" autocomplete=\"off\">\n                        <div class=\"im-chat-input-actions\">\n                            " + (value_134 ? "<button type=\"button\" class=\"send-btn-icon mic-btn official-send-control\" aria-label=\"发送给LHV\" title=\"发送给LHV\"><i class=\"fas fa-arrow-up\"></i></button>" : "<button type=\"button\" class=\"send-btn-icon send-btn\" aria-label=\"发送消息\" title=\"发送消息\"><i class=\"fas fa-paper-plane\" aria-hidden=\"true\"></i></button><button type=\"button\" class=\"send-btn-icon mic-btn\" aria-label=\"生成回复\" title=\"生成回复\"><i class=\"fas fa-arrow-down\" aria-hidden=\"true\"></i></button>") + "\n                        </div>\n                    </div>\n                    " + (isGroupChat ? "\n                    <div class=\"im-left-group-bar\" style=\"display:none; align-items:center; justify-content:space-between; gap:10px; margin:0 10px; padding:8px 10px; border-radius:22px; background:#f2f2f7; border:1px solid #e5e5ea;\">\n                        <div class=\"im-left-group-label\" style=\"font-size:14px; color:#8e8e93; font-weight:600; white-space:nowrap;\">" + (friend_6.groupObserverMode ? "旁观群聊" : "已退出该群") + "</div>\n                        <div style=\"display:flex; align-items:center; gap:8px; min-width:0;\">\n                            <button type=\"button\" class=\"im-left-group-rejoin-btn\" style=\"display:" + (friend_6.groupObserverMode ? "none" : "") + "; border:0; border-radius:18px; background:#007aff; color:#fff; height:34px; padding:0 12px; font-size:14px; font-weight:700; cursor:pointer; white-space:nowrap;\">重新进入</button>\n                            <button type=\"button\" class=\"im-left-group-ai-btn\" aria-label=\"推进剧情\" title=\"推进剧情\" style=\"border:0; border-radius:50%; background:#1c1c1e; color:#fff; width:34px; height:34px; padding:0; display:flex; align-items:center; justify-content:center; font-size:14px; cursor:pointer; flex-shrink:0;\"><i class=\"fas fa-arrow-down\"></i></button>\n                        </div>\n                    </div>\n                    " : "") + "\n                </div>\n            ";
      if (chatsContent_2) chatsContent_2.appendChild(page_9);
      handleAction_20_128.shell?.remove();
      window.imApp.applyFriendCss && window.imApp.applyFriendCss(friend_6);
      window.imApp.applyGlobalChatCss && window.imApp.applyGlobalChatCss(window.u2ThemeState || {});
      const backBtn = page_9.querySelector(".chat-back-btn");
      backBtn && backBtn.addEventListener("click", () => {
        if (profilePanelOverlay) {
          const latestFriend = window.imApp.getFriendById(friend_6) || friend_6;
          window.imChat.hideProfilePanel(latestFriend, profilePanelOverlay);
        }
        if (window.imData.batchSelectMode) imChat_2.exitBatchSelectMode(friend_6, page_9);
        window.imData.currentActiveFriend = null;
        window.imApp?.setActiveThemeSurface?.("chats");
        window.imChat.updateChatsView();
      });
      const cancelBatchBtn = page_9.querySelector(".chat-cancel-batch-btn"),
        menuBtn = page_9.querySelector(".chat-menu-btn"),
        callBtn = page_9.querySelector(".chat-call-btn"),
        batchForwardBtnElement_149 = page_9.querySelector(".batch-forward-btn"),
        batchDeleteBtnElement_150 = page_9.querySelector(".batch-delete-btn");
      function exitBatchSelectMode_3() {
        imChat_2.exitBatchSelectMode(friend_6, page_9);
      }
      window.imChat.ensureTransferDetailOverlayForExistingPage(page_9, friend_6);
      window.imChat.ensureRedPacketDetailOverlayForExistingPage(page_9, friend_6);
      callBtn && callBtn.addEventListener("click", () => {
        const friendId_9 = String(friend_6?.id ?? "").trim();
        if (!friendId_9) return;
        let callOverlay = document.getElementById("custom-call-overlay");
        if (!callOverlay) {
          callOverlay = document.createElement("div");
          callOverlay.id = "custom-call-overlay";
          callOverlay.style.position = "fixed";
          callOverlay.style.inset = "0";
          callOverlay.style.backgroundColor = "rgba(0,0,0,0.4)";
          callOverlay.style.zIndex = "10000";
          callOverlay.style.display = "flex";
          callOverlay.style.alignItems = "flex-end";
          callOverlay.style.justifyContent = "center";
          const sheet_2 = document.createElement("div");
          sheet_2.style.width = "100%";
          sheet_2.style.backgroundColor = "transparent";
          sheet_2.style.padding = "10px";
          sheet_2.style.boxSizing = "border-box";
          sheet_2.style.paddingBottom = "max(10px, env(safe-area-inset-bottom))";
          const menuGroup = document.createElement("div");
          menuGroup.style.backgroundColor = "#fff";
          menuGroup.style.borderRadius = "14px";
          menuGroup.style.overflow = "hidden";
          const videoBtn = document.createElement("div");
          videoBtn.innerText = "视频通话";
          videoBtn.style.padding = "18px 0";
          videoBtn.style.textAlign = "center";
          videoBtn.style.fontSize = "20px";
          videoBtn.style.color = "#007aff";
          videoBtn.style.borderBottom = "1px solid #e5e5ea";
          videoBtn.style.cursor = "pointer";
          videoBtn.addEventListener("click", e_2 => {
            e_2.stopPropagation();
            callOverlay.style.display = "none";
            if (window.showToast) window.showToast("视频通话功能开发中...");
          });
          const element_169 = document.createElement("div");
          element_169.innerText = "语音通话";
          element_169.style.padding = "18px 0";
          element_169.style.textAlign = "center";
          element_169.style.fontSize = "20px";
          element_169.style.color = "#007aff";
          element_169.style.cursor = "pointer";
          element_169.addEventListener("click", event_171 => {
            event_171.stopPropagation();
            callOverlay.style.display = "none";
            const friendId_8 = String(callOverlay.dataset.friendId || "").trim(),
              friend_7 = window.imApp?.getFriendById?.(friendId_8) || (window.imData?.friends || []).find(item_6 => String(item_6.id) === friendId_8);
            if (!friend_7) {
              if (window.showToast) window.showToast("联系人不存在或已被删除");
              return;
            }
            if (window.imChat && window.imChat.openVoiceCall) window.imChat.openVoiceCall(friend_7);else {
              if (window.showToast) window.showToast("语音通话准备中...");
            }
          });
          menuGroup.appendChild(videoBtn);
          menuGroup.appendChild(element_169);
          sheet_2.appendChild(menuGroup);
          callOverlay.appendChild(sheet_2);
          document.body.appendChild(callOverlay);
          callOverlay.addEventListener("click", event_175 => {
            event_175.target === callOverlay && (callOverlay.style.display = "none");
          });
        }
        callOverlay.dataset.friendId = friendId_9;
        callOverlay.style.display = "flex";
      });
      cancelBatchBtn && cancelBatchBtn.addEventListener("click", () => {
        exitBatchSelectMode_3();
      });
      batchForwardBtnElement_149 && batchForwardBtnElement_149.addEventListener("click", () => {
        if (String(window.imData.batchSelectionFriendId || "") !== String(friend_6.id)) return;
        const liveFriend = window.imApp.getFriendById ? window.imApp.getFriendById(friend_6.id) || friend_6 : friend_6,
          descriptors = Array.from(ensureBatchSelectionMap().values()),
          messages_2 = window.imApp.findForwardMessagesByDescriptors ? window.imApp.findForwardMessagesByDescriptors(liveFriend, descriptors) : [];
        window.imChat.openChatRecordForwardPicker?.(liveFriend, messages_2, {
          onSuccess: () => exitBatchSelectMode_3()
        });
      });
      batchDeleteBtnElement_150 && batchDeleteBtnElement_150.addEventListener("click", () => {
        if (String(window.imData.batchSelectionFriendId || "") !== String(friend_6.id)) return;
        const selection_2 = ensureBatchSelectionMap(),
          selectedDescriptors = Array.from(selection_2.values()).map(descriptor => ({
            id: descriptor.id || null,
            timestamp: descriptor.timestamp || null
          })).filter(descriptor_5 => descriptor_5.id || descriptor_5.timestamp);
        if (selectedDescriptors.length === 0) {
          if (window.showToast) window.showToast("请选择要删除的消息");
          return;
        }
        window.showCustomModal && window.showCustomModal({
          title: "删除消息",
          message: "确定要删除选中的 " + selectedDescriptors.length + " 条消息吗？",
          confirmText: "删除",
          cancelText: "取消",
          isDestructive: true,
          confirmTone: "dark",
          onConfirm: async () => {
            const saved = window.imApp.removeFriendMessages ? await window.imApp.removeFriendMessages(friend_6.id, selectedDescriptors, {
              silent: true
            }) : window.imApp.commitFriendChange ? await window.imApp.commitFriendChange(friend_6.id, targetFriend => {
              if (!targetFriend || !Array.isArray(targetFriend.messages)) return;
              targetFriend.messages = targetFriend.messages.filter(m => !selectedDescriptors.some(descriptor_6 => {
                if (!m) return true;
                if (descriptor_6.id && String(m.id) === String(descriptor_6.id)) return true;
                if (descriptor_6.timestamp && String(m.timestamp) === String(descriptor_6.timestamp)) return true;
                return false;
              }));
            }, {
              silent: true
            }) : false;
            if (!saved) {
              if (window.showToast) window.showToast("删除失败，消息已恢复");
              const failedContainer = page_9.querySelector(".ins-chat-messages");
              if (failedContainer) {
                failedContainer.innerHTML = "";
                const failedFriend = window.imApp.getFriendById ? window.imApp.getFriendById(friend_6.id) || friend_6 : friend_6;
                window.imChat.renderChatHistory(failedFriend, failedContainer);
                window.imChat.scrollToBottom(failedContainer);
                imChat_2.syncBatchSelectionUi(failedFriend, page_9);
              }
              return;
            }
            const container = page_9.querySelector(".ins-chat-messages");
            if (container) {
              container.innerHTML = "";
              const latestFriend_2 = window.imApp.getFriendById ? window.imApp.getFriendById(friend_6.id) || friend_6 : friend_6;
              window.imChat.renderChatHistory(latestFriend_2, container);
              window.imChat.scrollToBottom(container);
            }
            exitBatchSelectMode_3();
          }
        });
      });
      const msgContainerProxy = page_9.querySelector(".ins-chat-messages");
      msgContainerProxy && msgContainerProxy.addEventListener("click", e_3 => {
        const row = e_3.target.closest(".chat-row");
        if (window.imData.batchSelectMode) {
          e_3.stopPropagation();
          e_3.preventDefault();
          if (row) imChat_2.toggleBatchRowSelection(friend_6, row, page_9);
          return;
        }
      }, true);
      const replyCancelBtn = page_9.querySelector(".reply-cancel-btn");
      replyCancelBtn && replyCancelBtn.addEventListener("click", () => {
        window.imData.currentReplyText = null;
        window.imData.currentReplyMessageId = null;
        const preview = page_9.querySelector(".reply-preview-container");
        if (preview) preview.style.display = "none";
      });
      let profilePanelOverlay = page_9.querySelector(".chat-profile-panel-overlay");
      !profilePanelOverlay && (profilePanelOverlay = document.createElement("div"), profilePanelOverlay.className = "chat-profile-panel-overlay", profilePanelOverlay.style.display = "none", page_9.appendChild(profilePanelOverlay), profilePanelOverlay.addEventListener("click", e_4 => {
        if (e_4.target === profilePanelOverlay) {
          const latestFriend_3 = window.imApp.getFriendById(friend_6) || friend_6;
          window.imChat.hideProfilePanel(latestFriend_3, profilePanelOverlay);
        }
      }));
      const avatarContainer = page_9.querySelector(".ins-chat-avatar"),
        insChatHeaderElement = page_9.querySelector(".ins-chat-header");
      function handleClick(e_5) {
        if (friend_6.type === "official" || friend_6.type === "group" || friend_6.type === "npc") return;
        e_5.stopPropagation();
        const latestFriend_4 = window.imApp.getFriendById(friend_6) || friend_6;
        window.imChat.toggleProfilePanel(latestFriend_4, profilePanelOverlay);
      }
      avatarContainer && (friend_6.type === "official" || friend_6.type === "npc" ? avatarContainer.style.cursor = "default" : (avatarContainer.style.cursor = "pointer", avatarContainer.addEventListener("click", handleClick)));
      insChatHeaderElement && friend_6.type !== "group" && (friend_6.type === "official" || friend_6.type === "npc" ? insChatHeaderElement.style.cursor = "default" : (insChatHeaderElement.style.cursor = "pointer", insChatHeaderElement.addEventListener("click", handleClick)));
      page_9.addEventListener("click", e_6 => {
        if (profilePanelOverlay && profilePanelOverlay.classList.contains("active") && !e_6.target.closest(".chat-profile-panel-card") && !e_6.target.closest(".ins-chat-avatar") && !e_6.target.closest(".ins-chat-header")) {
          const latestFriend_5 = window.imApp.getFriendById(friend_6) || friend_6;
          window.imChat.hideProfilePanel(latestFriend_5, profilePanelOverlay);
        }
      });
      if (friend_6.type === "group") {
        const rightAvatar = page_9.querySelector(".group-header-right-avatar");
        rightAvatar && rightAvatar.addEventListener("click", () => {
          window.imApp.openGroupDetails && window.imApp.openGroupDetails(friend_6);
        });
        const insChatHeaderElement_190 = page_9.querySelector(".ins-chat-header");
        insChatHeaderElement_190 && insChatHeaderElement_190.addEventListener("click", () => {
          window.imApp.openGroupDetails && window.imApp.openGroupDetails(friend_6);
        });
        const messagesArea = page_9.querySelector(".ins-chat-messages");
        if (messagesArea) {
          let isDragging = false,
            startY = 0;
          messagesArea.addEventListener("touchstart", e_7 => {
            isDragging = false;
            startY = e_7.touches[0].clientY;
          }, {
            passive: true
          });
          messagesArea.addEventListener("touchmove", e_8 => {
            Math.abs(e_8.touches[0].clientY - startY) > 10 && (isDragging = true);
          }, {
            passive: true
          });
          messagesArea.addEventListener("touchend", value_194 => {
            if (isDragging) {
              const chatInputElement_195 = page_9.querySelector(".chat-input");
              chatInputElement_195 && document.activeElement === chatInputElement_195 && chatInputElement_195.blur();
            }
            isDragging = false;
          }, {
            passive: true
          });
          messagesArea.addEventListener("click", e_9 => {
            const chatInputElement_197 = page_9.querySelector(".chat-input");
            chatInputElement_197 && document.activeElement === chatInputElement_197 && chatInputElement_197.blur();
            const avatarSlot = e_9.target.closest(".group-ai-avatar-slot");
            if (avatarSlot) {
              const row_4 = avatarSlot.closest(".ai-row");
              if (row_4) {
                const speakerName = row_4.getAttribute("data-speaker"),
                  speakerMemberId_2 = row_4.getAttribute("data-speaker-member-id"),
                  thought_2 = row_4.getAttribute("data-thought");
                if (speakerName || speakerMemberId_2) {
                  const latestGroup_4 = window.imApp.getFriendById ? window.imApp.getFriendById(friend_6.id) || friend_6 : friend_6,
                    speakerInfo = window.imChat.normalizeGroupSpeaker ? window.imChat.normalizeGroupSpeaker(latestGroup_4, speakerName, speakerMemberId_2) : null;
                  speakerInfo && window.imChat.showGroupMemberProfileCard && window.imChat.showGroupMemberProfileCard(speakerInfo, page_9, avatarSlot, latestGroup_4, thought_2);
                }
              }
            }
          });
        }
      }
      menuBtn && friend_6.type !== "group" && menuBtn.addEventListener("click", () => {
        if (friend_6.type === "official") {
          const officialSettingsSheet = document.getElementById("official-chat-settings-sheet");
          if (officialSettingsSheet) {
            if (window.u2OfficialAccounts?.openSettings) window.u2OfficialAccounts.openSettings(menuBtn);else window.openView ? (officialSettingsSheet.inert = false, officialSettingsSheet.setAttribute("aria-hidden", "false"), window.openView(officialSettingsSheet)) : (officialSettingsSheet.style.display = "flex", setTimeout(() => {
              officialSettingsSheet.style.opacity = "1";
              const bottomSheet = officialSettingsSheet.querySelector(".bottom-sheet");
              if (bottomSheet) bottomSheet.style.transform = "translateY(0)";
            }, 10));
          }
          return;
        }
        window.imApp.openChatSettingsForFriend && window.imApp.openChatSettingsForFriend(friend_6);
      });
      const input_2 = page_9.querySelector(".chat-input"),
        sendBtn = page_9.querySelector(".send-btn"),
        micBtn = page_9.querySelector(".mic-btn"),
        plusBtn = page_9.querySelector(".plus-btn"),
        msgContainer_3 = page_9.querySelector(".ins-chat-messages"),
        togetherPlayer = page_9.querySelector(".im-together-listening-player");
      togetherPlayer && (togetherPlayer.querySelector(".im-together-listening-main")?.addEventListener("click", () => {
        window.libraryApp?.openTogetherListeningPlayer?.(friend_6.id);
      }), togetherPlayer.querySelectorAll("[data-together-listening-control]").forEach(button => {
        button.addEventListener("click", () => {
          const action_2 = button.dataset.togetherListeningControl;
          window.libraryApp?.controlTogetherListening?.(friend_6.id, {
            action: action_2
          });
        });
      }), renderTogetherListeningPlayer_2(friend_6));
      const handleClick_2 = event_206 => {
        if (event_206 && typeof event_206.preventDefault === "function") event_206.preventDefault();
        if (input_2) input_2.blur();
        if (friend_6.type === "official") {
          window.u2OfficialAccounts?.pickFile?.(friend_6, msgContainer_3);
          return;
        }
        window.imChat.openAttachmentSheet && window.imChat.openAttachmentSheet();
      };
      plusBtn && plusBtn.addEventListener("click", handleClick_2);
      input_2 && (input_2.addEventListener("focus", () => {
        page_9.classList.add("keyboard-open");
        const attachmentSheet = document.getElementById("chat-attachment-sheet");
        if (attachmentSheet) {
          const overlay_2 = attachmentSheet.querySelector(".sheet-overlay"),
            content_2 = attachmentSheet.querySelector(".sheet-content");
          if (overlay_2) overlay_2.style.opacity = "0";
          if (content_2) content_2.style.transform = "translateY(100%)";
          attachmentSheet.style.display = "none";
        }
        setTimeout(() => window.imChat?.followOnlineChatBottom?.(msgContainer_3), 100);
      }), input_2.addEventListener("blur", () => {
        page_9.classList.remove("keyboard-open");
      }));
      let value_157 = null,
        currentMentionQuery = "",
        mentionStartIndex = -1;
      function renderMentionList(query, inputEl) {
        if (friend_6.type !== "group" || !friend_6.members) return;
        const atMentionListElement_208 = page_9.querySelector(".at-mention-list");
        if (!atMentionListElement_208) return;
        const members_2 = window.imChat.getGroupMemberFriends(friend_6),
          allOptions = [{
            id: "all",
            nickname: "全体成员",
            isAll: true
          }, ...members_2],
          filtered = allOptions.filter(m_2 => m_2.isAll || m_2.nickname && m_2.nickname.toLowerCase().includes(query.toLowerCase()));
        if (filtered.length === 0) {
          atMentionListElement_208.style.display = "none";
          return;
        }
        atMentionListElement_208.innerHTML = "";
        filtered.forEach(value_211 => {
          const item_7 = document.createElement("div");
          item_7.className = "at-mention-item";
          let text_213 = "";
          if (value_211.isAll) text_213 = "<i class=\"fas fa-users\" style=\"color: #007aff;\"></i>";else value_211.avatarUrl ? text_213 = "<img src=\"" + value_211.avatarUrl + "\">" : text_213 = "<i class=\"fas fa-user\"></i>";
          item_7.innerHTML = "\n                        <div class=\"at-mention-avatar\">" + text_213 + "</div>\n                        <div class=\"at-mention-name\">" + (value_211.isAll ? value_211.nickname : value_211.nickname) + "</div>\n                    ";
          item_7.addEventListener("click", event_214 => {
            event_214.preventDefault();
            event_214.stopPropagation();
            const text_2 = inputEl.value,
              before = text_2.substring(0, mentionStartIndex),
              after = text_2.substring(inputEl.selectionStart),
              mentionText = value_211.isAll ? "@全体成员 " : "@" + value_211.nickname + " ";
            inputEl.value = before + mentionText + after;
            const newCursorPos = before.length + mentionText.length;
            inputEl.setSelectionRange(newCursorPos, newCursorPos);
            handleAction_15(inputEl);
            atMentionListElement_208.style.display = "none";
            mentionStartIndex = -1;
            currentMentionQuery = "";
          });
          atMentionListElement_208.appendChild(item_7);
        });
        atMentionListElement_208.style.display = "flex";
      }
      input_2.addEventListener("input", value_220 => {
        if (friend_6.type !== "group") return;
        const text_3 = input_2.value,
          cursorPos = input_2.selectionStart;
        let foundAt = -1;
        for (let i = cursorPos - 1; i >= 0; i--) {
          if (text_3[i] === "@") {
            foundAt = i;
            break;
          }
          if (text_3[i] === " " || text_3[i] === "\n") break;
        }
        if (foundAt !== -1) {
          mentionStartIndex = foundAt;
          currentMentionQuery = text_3.substring(foundAt + 1, cursorPos);
          let listContainer = page_9.querySelector(".at-mention-list");
          if (!listContainer) {
            listContainer = document.createElement("div");
            listContainer.className = "at-mention-list";
            const inputWrapper = page_9.querySelector(".ins-chat-input-wrapper");
            inputWrapper.parentNode.insertBefore(listContainer, inputWrapper);
          }
          renderMentionList(currentMentionQuery, input_2);
        } else {
          mentionStartIndex = -1;
          currentMentionQuery = "";
          const listContainer_2 = page_9.querySelector(".at-mention-list");
          if (listContainer_2) listContainer_2.style.display = "none";
        }
      });
      let enabled = false;
      const value_161 = () => {
        if (enabled) return;
        enabled = true;
        sendBtn && (sendBtn.disabled = true, sendBtn.classList.add("is-sending"));
        Promise.resolve().then(() => window.imChat.handleSend(window.imData.currentActiveFriend || friend_6, input_2, msgContainer_3))["catch"](value_229 => {
          console.error("[iMessage] failed to send message", value_229);
          window.showToast?.("消息发送失败");
        })["finally"](() => {
          enabled = false;
          sendBtn && (sendBtn.disabled = false, sendBtn.classList.remove("is-sending"));
        });
        const atMentionListElement_228 = page_9.querySelector(".at-mention-list");
        if (atMentionListElement_228) atMentionListElement_228.style.display = "none";
      };
      input_2.addEventListener("keydown", e_10 => {
        if (e_10.isComposing || e_10.keyCode === 229) return;
        if (e_10.key !== "Enter" || e_10.shiftKey || e_10.ctrlKey || e_10.altKey || e_10.metaKey) return;
        e_10.preventDefault();
        value_161();
      });
      const handleClick_3 = event_231 => {
        if (event_231 && typeof event_231.preventDefault === "function") event_231.preventDefault();
        value_161();
      };
      sendBtn && sendBtn.addEventListener("click", handleClick_3);
      const value_163 = (value_232 = false) => {
          if (!value_134 || !micBtn) return;
          const value_233 = value_232 === true;
          micBtn.classList.toggle("is-generating", value_233);
          micBtn.setAttribute("aria-label", value_233 ? "停止LHV生成" : "发送给LHV");
          micBtn.setAttribute("title", value_233 ? "停止生成" : "发送给LHV");
          const icon_2 = micBtn.querySelector("i");
          if (icon_2) icon_2.className = value_233 ? "fas fa-pause" : "fas fa-arrow-up";
        },
        handleClick_4 = event_235 => {
          if (event_235 && typeof event_235.preventDefault === "function") event_235.preventDefault();
          if (value_134) {
            const u2OfficialAccounts_237 = window.u2OfficialAccounts;
            if (u2OfficialAccounts_237?.isGenerating?.(friend_6.id)) {
              u2OfficialAccounts_237.stop(friend_6.id);
              return;
            }
            if (input_2?.value.trim()) window.imChat.handleSend(window.imData.currentActiveFriend || friend_6, input_2, msgContainer_3);
            return;
          }
          console.log("Mic button clicked!");
          const currentFriend = window.imData.currentActiveFriend || friend_6;
          if (window.imChat && window.imChat.handleAiReply) window.imChat.handleAiReply(currentFriend, msgContainer_3, micBtn);else {
            console.error("window.imChat.handleAiReply is not defined");
            if (window.showToast) window.showToast("无法调用 AI 接口");
          }
        };
      micBtn.addEventListener("click", handleClick_4);
      value_134 && (value_163(window.u2OfficialAccounts?.isGenerating?.(friend_6.id) === true), window.addEventListener("u2:official-generation-state", value_238 => {
        if (String(value_238.detail?.friendId || "") !== String(friend_6.id)) return;
        value_163(value_238.detail?.generating === true);
      }));
      window.imChat.renderChatHistory(friend_6, msgContainer_3, {
        resetWindow: true
      });
    } else {
      window.imChat.ensureTransferDetailOverlayForExistingPage(page_9, friend_6);
      window.imChat.ensureRedPacketDetailOverlayForExistingPage(page_9, friend_6);
      isGroupChat && window.imChat.refreshGroupHeaderAvatar && window.imChat.refreshGroupHeaderAvatar(friend_6);
      const insChatMessagesElement_239 = page_9.querySelector(".ins-chat-messages"),
        canReuseHistory = window.imChat.isChatHistoryRenderCurrent?.(friend_6, insChatMessagesElement_239);
      !canReuseHistory && (insChatMessagesElement_239.innerHTML = "", window.imChat.renderChatHistory(friend_6, insChatMessagesElement_239, {
        resetWindow: true
      }));
      handleAction_20_128.shell?.remove();
    }
    if (window.imApp.applyFriendBg) window.imApp.applyFriendBg(friend_6);
    if (window.imApp.initTimestampSetting) window.imApp.initTimestampSetting(friend_6);
    if (page_9) {
      page_9.classList.toggle("show-timestamps", !!friend_6.showTimestamp);
      page_9.classList.toggle("timestamp-outside", !!friend_6.showTimestamp && friend_6.timestampPosition === "outside");
      if (friend_6.isPinned) page_9.classList.add("pinned-chat");else page_9.classList.remove("pinned-chat");
      if (window.imApp.applyFriendStatusBarCss) window.imApp.applyFriendStatusBarCss(friend_6);
      isGroupChat && window.imChat.syncGroupExitState && window.imChat.syncGroupExitState(friend_6, page_9);
    }
    if (navChatsBtn) {
      if (navChatsBtn.classList.contains("active")) window.imChat.updateChatsView();else navChatsBtn.click();
    }
    pruneHiddenChatPages_2({
      keepFriendId: friend_6.id
    });
  }
  function measureContextMenuSafeInset(element_241, value_242) {
    const probe = document.createElement("div");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText = "position:absolute; visibility:hidden; pointer-events:none; width:0; height:var(" + value_242 + ", 0px);";
    element_241.appendChild(probe);
    const value_5 = Math.max(0, probe.getBoundingClientRect().height || 0);
    return probe.remove(), value_5;
  }
  function fitContextMenuToViewport_2() {
    const msgContextMenu_2 = document.getElementById("msg-context-menu"),
      bubbleClone = document.getElementById("msg-context-bubble-clone"),
      reactionBar = document.getElementById("msg-reaction-bar"),
      mainActions = document.getElementById("msg-context-actions"),
      moreActions = document.getElementById("msg-context-more-actions"),
      screenEl = document.getElementById("app") || document.body;
    if (!msgContextMenu_2 || !bubbleClone || !screenEl) return;
    const screenRect = screenEl.getBoundingClientRect(),
      visualViewport_2 = window.visualViewport,
      visibleViewportTop = visualViewport_2 ? visualViewport_2.offsetTop : 0,
      visibleViewportBottom = visualViewport_2 ? visualViewport_2.offsetTop + visualViewport_2.height : document.documentElement.clientHeight,
      localViewportTop = Math.max(0, visibleViewportTop - screenRect.top),
      localViewportBottom = Math.min(screenRect.height, visibleViewportBottom - screenRect.top),
      safeInsetTop = measureContextMenuSafeInset(screenEl, "--safe-top"),
      safeInsetBottom = measureContextMenuSafeInset(screenEl, "--safe-bottom"),
      safeTop = Math.max(localViewportTop + 16 + safeInsetTop, 60),
      safeBottom = Math.max(safeTop + 120, localViewportBottom - Math.max(20, safeInsetBottom + 12)),
      availableHeight = Math.max(120, safeBottom - safeTop),
      visibleActions = moreActions && getComputedStyle(moreActions).display !== "none" ? moreActions : mainActions,
      gap_2 = parseFloat(getComputedStyle(msgContextMenu_2).gap) || 6,
      reactionHeight = reactionBar?.getBoundingClientRect().height || 0,
      actionsHeight = visibleActions?.getBoundingClientRect().height || 0,
      chromeHeight = reactionHeight + actionsHeight + gap_2 * 2,
      bubbleHeightLimit = Math.max(64, availableHeight - chromeHeight);
    bubbleClone.style.maxHeight = bubbleHeightLimit + "px";
    bubbleClone.style.overflowY = "auto";
    bubbleClone.style.overscrollBehavior = "contain";
    bubbleClone.style.flexShrink = "1";
    if (reactionBar) reactionBar.style.flexShrink = "0";
    if (mainActions) mainActions.style.flexShrink = "0";
    if (moreActions) moreActions.style.flexShrink = "0";
    msgContextMenu_2.style.maxHeight = availableHeight + "px";
    msgContextMenu_2.style.overflowY = "auto";
    msgContextMenu_2.style.overscrollBehavior = "contain";
    const activeBubble = window.imData.currentActiveRow?.querySelector(".chat-bubble, .sticker-message-wrap"),
      activeBubbleRect = activeBubble?.getBoundingClientRect(),
      desiredCenter = activeBubbleRect ? activeBubbleRect.top + activeBubbleRect.height / 2 - screenRect.top : safeTop + availableHeight / 2,
      measuredHeight = Math.min(msgContextMenu_2.scrollHeight || msgContextMenu_2.getBoundingClientRect().height, availableHeight),
      nextTop = Math.min(Math.max(desiredCenter - measuredHeight / 2, safeTop), Math.max(safeTop, safeBottom - measuredHeight));
    msgContextMenu_2.style.top = nextTop + "px";
  }
  function showContextMenu_2(row_5, value_267) {
    const msgContextOverlayElement = document.getElementById("msg-context-overlay"),
      msgContextMenu = document.getElementById("msg-context-menu");
    if (!msgContextOverlayElement || !msgContextMenu || row_5?.classList?.contains("unblock-request-row")) return;
    if (navigator.vibrate) navigator.vibrate(50);
    window.imData.currentActiveRow = row_5;
    row_5.classList.add("message-active");
    const bubble = row_5.querySelector(".chat-bubble") || row_5.querySelector(".sticker-message-wrap");
    if (!bubble) return;
    const value_269 = document.getElementById("app") || document.body,
      screenRect_2 = value_269.getBoundingClientRect(),
      sourceBubbleRect = bubble.getBoundingClientRect(),
      isUserRow = row_5.classList.contains("user-row"),
      isCardBubble = bubble.classList.contains("im-card-bubble") || !!bubble.querySelector(".chat-link-card, .chat-fake-link-card, .pay-transfer-card, .voice-call-record-card"),
      msgContextBubbleCloneElement_274 = document.getElementById("msg-context-bubble-clone");
    if (msgContextBubbleCloneElement_274) {
      msgContextBubbleCloneElement_274.innerHTML = "";
      const activeFriend = window.imData.currentActiveFriend;
      activeFriend?.id != null ? msgContextBubbleCloneElement_274.setAttribute("data-current-friend-id", String(activeFriend.id)) : msgContextBubbleCloneElement_274.removeAttribute("data-current-friend-id");
      const clonedRow = document.createElement("div");
      clonedRow.className = ["chat-row", "msg-context-row-clone", isUserRow ? "user-row" : "ai-row", row_5.classList.contains("has-prev") ? "has-prev" : "", row_5.classList.contains("has-next") ? "has-next" : ""].filter(Boolean).join(" ");
      const clonedBubble = bubble.cloneNode(true);
      clonedBubble.style.margin = "0";
      if (isCardBubble) {
        const cloneWidth = Math.max(180, Math.min(sourceBubbleRect.width || 260, 270, screenRect_2.width - 48));
        clonedBubble.classList.add("msg-context-card-clone");
        clonedBubble.style.width = cloneWidth + "px";
        clonedBubble.style.maxWidth = cloneWidth + "px";
        clonedBubble.style.flex = "0 0 auto";
        clonedBubble.querySelectorAll(".chat-link-card, .chat-fake-link-card").forEach(card => {
          card.style.width = "100%";
          card.style.maxWidth = "100%";
          card.style.boxSizing = "border-box";
        });
      } else clonedBubble.style.maxWidth = "100%";
      clonedRow.appendChild(clonedBubble);
      msgContextBubbleCloneElement_274.appendChild(clonedRow);
    }
    const msgContextMoreActionsElement_275 = document.getElementById("msg-context-more-actions"),
      mainActions_2 = document.getElementById("msg-context-actions");
    if (msgContextMoreActionsElement_275) msgContextMoreActionsElement_275.style.display = "none";
    if (mainActions_2) mainActions_2.style.display = "flex";
    const recallAction = msgContextMenu.querySelector("[data-action=\"recall\"]"),
      speakAction = msgContextMenu.querySelector("[data-action=\"speak\"]"),
      activeFriend_2 = window.imData.currentActiveFriend,
      messageId = row_5.getAttribute("data-message-id"),
      messageTimestamp = row_5.getAttribute("data-timestamp"),
      targetMessage = activeFriend_2 && Array.isArray(activeFriend_2.messages) ? activeFriend_2.messages.find(message_2 => {
        if (!message_2) return false;
        if (messageId && String(message_2.id) === String(messageId)) return true;
        return messageTimestamp && String(message_2.timestamp) === String(messageTimestamp);
      }) : null;
    if (recallAction) {
      const canRecall = row_5.classList.contains("user-row") && !!window.imApp?.isRecallableUserMessage?.(targetMessage);
      recallAction.style.display = canRecall ? "flex" : "none";
    }
    if (speakAction) {
      const groupTtsMessage = targetMessage || {
          role: row_5.classList.contains("user-row") ? "user" : "assistant",
          speaker: row_5.getAttribute("data-speaker") || "",
          speakerMemberId: row_5.getAttribute("data-speaker-member-id") || null,
          senderAvatarUrl: row_5.getAttribute("data-sender-avatar-url") || ""
        },
        canSpeakGroupMessage = activeFriend_2?.type === "group" && !!window.u2Tts?.canSpeakMessage?.(activeFriend_2, groupTtsMessage);
      speakAction.style.display = activeFriend_2?.type === "group" ? canSpeakGroupMessage ? "flex" : "none" : "flex";
    }
    msgContextOverlayElement.style.display = "flex";
    msgContextOverlayElement.style.opacity = "1";
    const menuWidth = Math.min(screenRect_2.width - 32, 300);
    msgContextMenu.style.width = menuWidth + "px";
    isUserRow ? (msgContextMenu.style.alignItems = "flex-end", msgContextMenu.style.right = "16px", msgContextMenu.style.left = "auto") : (msgContextMenu.style.alignItems = "flex-start", msgContextMenu.style.left = "16px", msgContextMenu.style.right = "auto");
    msgContextMenu.style.transformOrigin = isUserRow ? "top right" : "top left";
    requestAnimationFrame(() => {
      fitContextMenuToViewport_2();
      msgContextMenu.style.opacity = "1";
      msgContextMenu.style.transform = "scale(1)";
    });
  }
  function closeContextMenu_2() {
    const msgContextOverlayElement_288 = document.getElementById("msg-context-overlay"),
      msgContextMenu_3 = document.getElementById("msg-context-menu");
    if (!msgContextOverlayElement_288 || !msgContextMenu_3) return;
    msgContextMenu_3.style.opacity = "0";
    msgContextMenu_3.style.transform = "scale(0.85)";
    window.imData.currentActiveRow && (window.imData.currentActiveRow.classList.remove("message-active"), window.imData.currentActiveRow = null);
    setTimeout(() => {
      msgContextOverlayElement_288.style.display = "none";
      const failedContainer_2 = document.getElementById("msg-context-bubble-clone");
      failedContainer_2 && (failedContainer_2.innerHTML = "", failedContainer_2.removeAttribute("data-current-friend-id"));
    }, 250);
  }
  function showGroupMemberProfileCard_2(speakerInfo_2, value_292, value_293, group_4, historicalThought = null) {
    if (!value_292) return;
    const latestGroup_5 = group_4 && window.imApp.getFriendById ? window.imApp.getFriendById(group_4.id || group_4) || group_4 : group_4,
      memberProfileKey = String(speakerInfo_2?.id ?? speakerInfo_2?.memberId ?? "");
    let overlay = document.getElementById("global-gmp-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "global-gmp-overlay";
      overlay.className = "group-member-profile-overlay";
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.backgroundColor = "rgba(0,0,0,0.4)";
      overlay.style.zIndex = "9999";
      overlay.style.display = "none";
      overlay.style.opacity = "0";
      overlay.style.transition = "opacity 0.3s ease";
      const card_4 = document.createElement("div");
      card_4.className = "group-member-profile-card";
      overlay.appendChild(card_4);
      document.body.appendChild(overlay);
      overlay.addEventListener("click", event_311 => {
        event_311.target === overlay && (overlay.style.opacity = "0", card_4.classList.remove("active"), setTimeout(() => overlay.style.display = "none", 300));
      });
    }
    const card_5 = overlay.querySelector(".group-member-profile-card"),
      avatarUrl_3 = speakerInfo_2.avatarUrl || "https://picsum.photos/seed/char/100/100",
      name = speakerInfo_2.nickname || "群成员",
      signature_2 = speakerInfo_2.signature || "这个人很懒，什么都没写",
      title_3 = speakerInfo_2.groupTitle || "";
    let groupProfile = {};
    latestGroup_5 && latestGroup_5.memberProfiles && (groupProfile = latestGroup_5.memberProfiles[memberProfileKey] || latestGroup_5.memberProfiles[speakerInfo_2.id] || {});
    const hasHistoricalThought = typeof historicalThought === "string" && historicalThought.trim(),
      thought_3 = hasHistoricalThought ? historicalThought.trim() : groupProfile.thought || "暂无心声";
    let isSleeping_3 = false;
    const members_3 = window.imChat.getGroupMemberFriends(latestGroup_5),
      actualMember = members_3.find(m_3 => String(m_3.id) === memberProfileKey);
    actualMember && (isSleeping_3 = window.imApp.isCharacterSleeping(actualMember));
    const innerText_2 = formatStatusLabel(groupProfile.status || "online", isSleeping_3),
      value_308 = isSleeping_3 ? "#8e8e93" : "#34c759";
    let value_309 = title_3 ? "<div class=\"gmp-title\">" + title_3 + "</div>" : "";
    card_5.innerHTML = "\n            <div class=\"gmp-header\">\n                <div class=\"gmp-avatar-wrapper\">\n                    <div class=\"gmp-avatar\"><img src=\"" + avatarUrl_3 + "\"></div>\n                    <div class=\"gmp-status-bubble\" contenteditable=\"" + (isSleeping_3 ? "false" : "true") + "\" spellcheck=\"false\">" + innerText_2 + "</div>\n                </div>\n            </div>\n            <div class=\"gmp-body\">\n                <div class=\"gmp-name-row\">\n                    <div class=\"gmp-name\">" + name + "</div>\n                    " + value_309 + "\n                </div>\n                <div class=\"gmp-signature\">" + signature_2 + "</div>\n                <div class=\"gmp-inner-voice\">" + thought_3 + "</div>\n            </div>\n        ";
    const statusBubble = card_5.querySelector(".gmp-status-bubble");
    statusBubble.addEventListener("blur", async e_11 => {
      const status_2 = normalizeStatusForStorage(e_11.target.innerText);
      if (latestGroup_5) {
        const saved_3 = window.imApp.commitFriendChange ? await window.imApp.commitFriendChange(latestGroup_5.id, targetGroup_2 => {
          if (!targetGroup_2) return;
          if (!targetGroup_2.memberProfiles) targetGroup_2.memberProfiles = {};
          !targetGroup_2.memberProfiles[memberProfileKey] && (targetGroup_2.memberProfiles[memberProfileKey] = {
            thought: "暂无心声",
            status: "online",
            updatedAt: 0
          });
          targetGroup_2.memberProfiles[memberProfileKey].status = status_2;
          targetGroup_2.memberProfiles[memberProfileKey].updatedAt = Date.now();
        }, {
          silent: true
        }) : false;
        if (!saved_3) {
          e_11.target.innerText = innerText_2;
          if (window.showToast) window.showToast("状态保存失败");
          return;
        }
        e_11.target.innerText = formatStatusLabel(status_2, isSleeping_3);
      } else e_11.target.innerText = innerText_2;
    });
    overlay.style.display = "block";
    card_5.style.display = "flex";
    if (value_293) {
      const rect = value_293.getBoundingClientRect(),
        cardWidth = 300,
        cardHeight = card_5.offsetHeight || 380;
      let top_2 = rect.bottom + 10,
        left_3 = rect.left;
      const viewportWidth = Math.max(0, window.visualViewport?.width || document.documentElement.clientWidth || window.innerWidth || 0),
        viewportHeight = Math.max(0, window.visualViewport?.height || document.documentElement.clientHeight || window.innerHeight || 0);
      left_3 + cardWidth > viewportWidth - 20 && (left_3 = viewportWidth - cardWidth - 20);
      top_2 + cardHeight > viewportHeight - 20 && (top_2 = rect.top - cardHeight - 10);
      const originY = top_2 < rect.top ? "bottom" : "top",
        originX = left_3 === rect.left ? "left" : "right";
      card_5.style.top = top_2 + "px";
      card_5.style.left = left_3 + "px";
      card_5.style.transformOrigin = originX + " " + originY;
    } else {
      card_5.style.top = "50%";
      card_5.style.left = "50%";
      card_5.style.transform = "translate(-50%, -50%) scale(0.85)";
      card_5.style.transformOrigin = "center center";
    }
    void overlay.offsetHeight;
    void card_5.offsetHeight;
    overlay.style.opacity = "1";
    card_5.classList.add("active");
    value_293 && (card_5.style.transform = "scale(1)");
  }
  window.imChat.openChatTab = openChatTab_2;
  window.imChat.showContextMenu = showContextMenu_2;
  window.imChat.fitContextMenuToViewport = fitContextMenuToViewport_2;
  window.imChat.closeContextMenu = closeContextMenu_2;
  window.imChat.showGroupMemberProfileCard = showGroupMemberProfileCard_2;
});
