(window.u2OnStorageReady || (callback => document.addEventListener("DOMContentLoaded", callback)))(() => {
  const {
    apiConfig: apiConfig_2,
    userState: userState_2
  } = window;
  window.imChat = window.imChat || {};
  const imChat_3 = window.imChat;
  function handleAction_4(friend_2) {
    if (!friend_2) return {
      hasMessages: false,
      preview: "No messages",
      timestamp: 0,
      count: 0
    };
    const loadedMessages = Array.isArray(friend_2.messages) ? friend_2.messages : [],
      lastLoadedMsg = loadedMessages.length > 0 ? loadedMessages[loadedMessages.length - 1] : null;
    let preview_2 = typeof friend_2.lastMessagePreview === "string" ? friend_2.lastMessagePreview : "",
      timestamp_2 = Number(friend_2.lastMessageTimestamp) || 0,
      count_2 = window.imApp.getFriendMessageCount ? window.imApp.getFriendMessageCount(friend_2) : Number(friend_2.messageCount) || loadedMessages.length || 0;
    if (lastLoadedMsg) {
      preview_2 = window.imApp.getFriendMessagePreview ? window.imApp.getFriendMessagePreview(lastLoadedMsg) || preview_2 || "" : lastLoadedMsg.content || lastLoadedMsg.text || preview_2 || "";
      timestamp_2 = Number(lastLoadedMsg.timestamp) || timestamp_2 || 0;
      if (friend_2.messagesLoaded === true) count_2 = loadedMessages.length;
    }
    return {
      hasMessages: count_2 > 0,
      preview: preview_2 || "No messages",
      timestamp: timestamp_2,
      count: count_2
    };
  }
  function updateChatsView_2() {
    const emptyState = document.getElementById("chats-empty-state"),
      listContainer = document.getElementById("chats-list-container"),
      lineHeader = document.querySelector(".line-header"),
      chatsContent = document.getElementById("chats-content"),
      imBottomNavContainer = document.querySelector(".line-bottom-nav-container"),
      id_23 = window.imData.currentActiveFriend?.id;
    chatsContent && Array.from(chatsContent.children).forEach(element => {
      if (element.classList.contains("active-chat-interface")) {
        const value_24 = id_23 != null && element.id === "chat-interface-" + id_23;
        element.style.display = value_24 ? "flex" : "none";
        !value_24 && window.imChat?.disposeOnlineChatBottomFollower?.(element.querySelector(".ins-chat-messages"));
      }
    });
    if (window.imData.currentActiveFriend) {
      window.imApp?.setActiveThemeSurface?.("chat-detail");
      if (emptyState) emptyState.style.display = "none";
      if (listContainer) listContainer.style.display = "none";
      if (imBottomNavContainer) imBottomNavContainer.style.display = "none";
      if (lineHeader) lineHeader.style.display = "none";
      const pageId = "chat-interface-" + window.imData.currentActiveFriend.id,
        page = document.getElementById(pageId);
      if (page) {
        const container = page.querySelector(".ins-chat-messages");
        window.imChat.settleOnlineChatAtLatest ? window.imChat.settleOnlineChatAtLatest(container) : window.imChat.scrollToBottom(container, {
          force: true
        });
      }
    } else {
      window.imApp?.setActiveThemeSurface?.("chats");
      if (imBottomNavContainer) imBottomNavContainer.style.display = "flex";
      if (lineHeader) lineHeader.style.display = "flex";
      window.imChat.renderChatsList();
      const hasChats = window.imData.friends.some(value_27 => {
        const handleAction_4_28 = handleAction_4(value_27);
        return handleAction_4_28.hasMessages || !!value_27.isPinned || value_27.type === "official" && value_27.officialConversationActive === true;
      });
      if (hasChats) {
        if (emptyState) emptyState.style.display = "none";
        if (listContainer) listContainer.style.display = "block";
      } else {
        if (emptyState) emptyState.style.display = "flex";
        if (listContainer) listContainer.style.display = "none";
      }
    }
    if (window.imApp.updateChatsUnreadBadges) window.imApp.updateChatsUnreadBadges();
  }
  function handleAction_6(friend_3) {
    if (friend_3.type === "group") return friend_3.avatarUrl ? "<img src=\"" + friend_3.avatarUrl + "\">" : "<div style=\"width: 100%; height: 100%; background: linear-gradient(135deg, #ff9a9e, #fecfef); color: white; display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: 20px;\">" + friend_3.nickname.charAt(0).toUpperCase() + "</div>";
    return friend_3.avatarUrl ? "<img src=\"" + friend_3.avatarUrl + "\">" : "<i class=\"fas fa-user\"></i>";
  }
  function handleAction_7(value_30) {
    let nickname_31 = value_30.nickname;
    if (value_30.type === "group") nickname_31 += " <span style=\"background:#e5e5ea; color:#8e8e93; font-size:10px; padding:2px 6px; border-radius:10px; margin-left:6px; vertical-align: middle;\">group</span>";else value_30.type === "official" && (nickname_31 += " <span style=\"background:#e5e5ea; color:#8e8e93; font-size:10px; padding:2px 6px; border-radius:10px; margin-left:6px; vertical-align: middle;\">office</span>");
    return nickname_31;
  }
  function handleAction_8(value_32) {
    if (value_32.unreadCount && value_32.unreadCount > 0) return "<div class=\"chat-unread-badge\">" + (value_32.unreadCount > 99 ? "99+" : value_32.unreadCount) + "</div>";
    return "";
  }
  function handleAction_9(value_33, value_34) {
    const friendId_2 = String(value_33.id),
      item = document.createElement("div");
    return item.className = value_34 ? "chat-item pinned" : "chat-item", item.dataset.friendId = friendId_2, item.addEventListener("click", () => {
      const friend_4 = window.imApp?.getFriendById?.(friendId_2) || value_33;
      window.imChat.openChatTab(friend_4);
    }), item;
  }
  function handleAction_10(value_37, value_38, message_39) {
    return [String(value_37?.id ?? ""), value_38 ? 1 : 0, String(value_37?.type || ""), String(value_37?.nickname || ""), String(value_37?.avatarUrl || ""), String(message_39?.preview || ""), Number(message_39?.timestamp) || 0, Math.max(0, Number(value_37?.unreadCount) || 0)].join("");
  }
  function handleAction_11(element_40, value_41, value_42, summary_2 = handleAction_4(value_41)) {
    const renderKey_2 = handleAction_10(value_41, value_42, summary_2);
    if (element_40.dataset.renderKey === renderKey_2) return false;
    const preview_45 = summary_2.preview,
      timeStr = summary_2.timestamp && window.imApp.formatTime ? window.imApp.formatTime(summary_2.timestamp) : "";
    return element_40.className = value_42 ? "chat-item pinned" : "chat-item", element_40.dataset.friendId = String(value_41.id), element_40.innerHTML = value_42 ? "\n                <div style=\"position: relative; display: inline-block;\">\n                    <div class=\"chat-avatar\">" + handleAction_6(value_41) + "</div>\n                    " + handleAction_8(value_41) + "\n                </div>\n                <div class=\"chat-info\">\n                    <div class=\"chat-row-top\">\n                        <div class=\"chat-name\">" + handleAction_7(value_41) + "</div>\n                        <div style=\"display: flex; flex-direction: column; align-items: flex-end;\">\n                            <div class=\"chat-time\">" + timeStr + "</div>\n                        </div>\n                    </div>\n                    <div class=\"chat-message\">" + preview_45 + "</div>\n                </div>\n                <div class=\"pin-icon\"><i class=\"fas fa-thumbtack\"></i></div>\n            " : "\n                <div style=\"position: relative; display: inline-block;\">\n                    <div class=\"chat-avatar\">" + handleAction_6(value_41) + "</div>\n                    " + handleAction_8(value_41) + "\n                </div>\n                <div class=\"chat-info\">\n                    <div class=\"chat-row-top\">\n                        <div class=\"chat-name\">" + handleAction_7(value_41) + "</div>\n                        <div style=\"display: flex; flex-direction: column; align-items: flex-end;\">\n                            <div class=\"chat-time\">" + timeStr + "</div>\n                        </div>\n                    </div>\n                    <div class=\"chat-message\">" + preview_45 + "</div>\n                </div>\n            ", element_40.dataset.renderKey = renderKey_2, true;
  }
  let text_12 = "",
    enabled = false;
  const value_13 = new Set();
  function handleAction_14(value_47) {
    if (enabled || !window.imApp?.ensureFriendRecentMessagesLoaded) return;
    const slice_48 = (Array.isArray(value_47) ? value_47 : []).map(value_50 => value_50?.friend).filter(value_51 => value_51?.id != null && !value_13.has(String(value_51.id))).slice(0, 4);
    if (slice_48.length === 0) return;
    enabled = true;
    const value_49 = async () => {
      try {
        for (const value_52 of slice_48) {
          const string_53 = String(value_52.id);
          value_13.add(string_53);
          await window.imApp.ensureFriendRecentMessagesLoaded(value_52, {
            limit: 60
          });
        }
      } finally {
        enabled = false;
      }
    };
    typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(() => void value_49(), {
      timeout: 900
    }) : setTimeout(() => void value_49(), 80);
  }
  function handleAction_15(value_54, items, value_55) {
    const value_56 = new Set();
    let firstElementChild_57 = value_54.firstElementChild;
    return items.forEach(({
      friend: friend_5,
      summary: summary_3
    }) => {
      const string_60 = String(friend_5.id);
      value_56.add(string_60);
      let result = value_55.get(string_60);
      !result && (result = handleAction_9(friend_5, !!friend_5.isPinned), value_55.set(string_60, result));
      handleAction_11(result, friend_5, !!friend_5.isPinned, summary_3);
      result === firstElementChild_57 ? firstElementChild_57 = firstElementChild_57.nextElementSibling : value_54.insertBefore(result, firstElementChild_57);
    }), value_56;
  }
  function handleAction_16(value_61, value_62) {
    Array.from(value_61.children).forEach(value_63 => {
      if (!value_62.has(String(value_63.dataset.friendId || ""))) value_63.remove();
    });
  }
  function renderChatsList_2() {
    const chatsList = document.getElementById("chats-list");
    if (!chatsList) return;
    const filter_64 = window.imData.friends.map(friend_6 => ({
      friend: friend_6,
      summary: handleAction_4(friend_6)
    })).filter(value_73 => value_73.summary.hasMessages || value_73.friend.isPinned || value_73.friend.type === "official" && value_73.friend.officialConversationActive === true);
    filter_64.sort((value_74, value_75) => {
      if (value_74.friend.isPinned !== value_75.friend.isPinned) return value_74.friend.isPinned ? -1 : 1;
      return value_75.summary.timestamp - value_74.summary.timestamp;
    });
    handleAction_14(filter_64);
    const join_65 = filter_64.map(value_76 => handleAction_10(value_76.friend, !!value_76.friend.isPinned, value_76.summary)).join(""),
      length_66 = chatsList.querySelectorAll(".chat-item").length;
    if (text_12 === join_65 && length_66 === filter_64.length) {
      if (window.imApp.markChatsListRendered) window.imApp.markChatsListRendered();
      return false;
    }
    let pinnedContainer = chatsList.querySelector(".pinned-chats-container");
    !pinnedContainer && (pinnedContainer = document.createElement("div"), pinnedContainer.className = "pinned-chats-container", chatsList.appendChild(pinnedContainer));
    let normalContainer = chatsList.querySelector(".normal-chats-container");
    !normalContainer && (normalContainer = document.createElement("div"), normalContainer.className = "normal-chats-container", chatsList.appendChild(normalContainer));
    const value_67 = new Map();
    [...pinnedContainer.children, ...normalContainer.children].forEach(element_77 => {
      if (element_77.classList.contains("chat-item")) value_67.set(String(element_77.dataset.friendId || ""), element_77);
    });
    const filter_68 = filter_64.filter(value_78 => value_78.friend.isPinned),
      filter_69 = filter_64.filter(value_79 => !value_79.friend.isPinned),
      handleAction_15_70 = handleAction_15(pinnedContainer, filter_68, value_67),
      handleAction_15_71 = handleAction_15(normalContainer, filter_69, value_67);
    handleAction_16(pinnedContainer, handleAction_15_70);
    handleAction_16(normalContainer, handleAction_15_71);
    filter_68.length === 0 && pinnedContainer.parentNode === chatsList && (pinnedContainer.innerHTML = "");
    filter_69.length === 0 && (normalContainer.innerHTML = "");
    text_12 = join_65;
    if (window.imApp.updateChatsUnreadBadges) window.imApp.updateChatsUnreadBadges();
    if (window.imApp.markChatsListRendered) window.imApp.markChatsListRendered();
    return true;
  }
  window.imChat.updateChatsView = updateChatsView_2;
  window.imChat.renderChatsList = renderChatsList_2;
});
