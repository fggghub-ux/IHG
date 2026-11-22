window.imData = {
  friends: [],
  friendRequests: [],
  moments: [],
  momentMessages: [],
  currentActiveFriend: null,
  currentSettingsFriend: null,
  currentDetailMoment: null,
  currentOpenUserId: "me",
  pendingImages: [],
  isPublishing: false,
  currentEditImageIndex: -1,
  cssPresets: [],
  offlineTheme: {
    narrativeColor: "#111111",
    dialogueColor: "#8B8B8B",
    customCss: "",
    customCssEnabled: false,
    activePresetId: ""
  },
  offlineThemePresets: [],
  offlineThemeInitialized: false,
  offlinePrompts: [],
  offlinePromptPresets: [],
  onlinePromptPresets: [],
  onlineCotPresets: [],
  offlinePromptActivePresetId: "",
  offlinePromptsInitialized: false,
  offlineTextReplacementRules: [],
  offlineHtmlTemplateRules: [],
  tempSelectedBookIds: [],
  tempRelationshipDrafts: [],
  isRelationshipPickerVisible: false,
  longPressTimer: null,
  currentActiveRow: null,
  currentReplyMessageId: null,
  batchSelectMode: false,
  batchSelectionFriendId: "",
  batchSelectedMessages: new Map(),
  stickers: [],
  stickerMetadata: [],
  momentsCoverUrl: null,
  profilePanelUiStateByFriendId: {},
  ready: false,
  momentsLoaded: false,
  momentMessagesLoaded: false,
  stickerMetadataLoaded: false,
  stickersLoaded: false
}, window.imApp = window.imApp || {}, window.imApp.buildShopGiftCardHtml = function (chatCoreNewScope11 = {}) {
  const chatCoreNewScope12 = chatCoreNewScope18 => String(chatCoreNewScope18 == null ? "" : chatCoreNewScope18).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"),
    chatCoreNewScope13 = chatCoreNewScope11.senderRole === "assistant",
    chatCoreNewScope14 = chatCoreNewScope12(chatCoreNewScope11.itemName || "商品"),
    chatCoreNewScope15 = Number(chatCoreNewScope11.price),
    chatCoreNewScope16 = Number.isFinite(chatCoreNewScope15) && chatCoreNewScope15 > 0 ? chatCoreNewScope15.toFixed(2) : "0.00",
    chatCoreNewScope17 = chatCoreNewScope13 ? "由 " + chatCoreNewScope12(chatCoreNewScope11.senderName || "Char") + " 赠送" : "由 " + chatCoreNewScope12(chatCoreNewScope11.paymentMethod || "Pay") + " 支付";
  return "\n        <div class=\"im-shop-gift-card\" role=\"group\" aria-label=\"" + (chatCoreNewScope13 ? "送你礼物" : "收到礼物") + "\">\n            <div class=\"im-shop-gift-heading\">\n                <span class=\"im-shop-gift-mark\" aria-hidden=\"true\"><i class=\"fas fa-gift\"></i></span>\n                <span class=\"im-shop-gift-heading-text\"><small>GIFT</small><strong>" + (chatCoreNewScope13 ? "送你礼物" : "收到礼物") + "</strong></span>\n            </div>\n            <div class=\"im-shop-gift-item\">" + chatCoreNewScope14 + "</div>\n            <div class=\"im-shop-gift-value\"><span>礼物价值</span><strong>¥" + chatCoreNewScope16 + "</strong></div>\n            <div class=\"im-shop-gift-footer\">" + chatCoreNewScope17 + "</div>\n        </div>\n    ";
}, window.imApp.getGroupUserIdentity = function (chatCoreScopeValue11, chatCoreScopeValue12 = {}) {
  const chatCoreScopeValue13 = window.getUserState ? window.getUserState() : window.userState || {},
    chatCoreScopeValue14 = typeof window.getAccounts === "function" ? window.getAccounts() : [],
    chatCoreScopeValue15 = typeof window.getCurrentAccountId === "function" ? window.getCurrentAccountId() : null,
    chatCoreScopeValue16 = chatCoreScopeValue14.find(chatCoreScopeValue21 => String(chatCoreScopeValue21?.id) === String(chatCoreScopeValue15)) || null,
    chatCoreScopeValue17 = !chatCoreScopeValue12.ignoreOverride && chatCoreScopeValue11?.type === "group" ? chatCoreScopeValue11.memory?.userOverride : null,
    chatCoreScopeValue18 = chatCoreScopeValue17 || chatCoreScopeValue16 || chatCoreScopeValue13 || {},
    chatCoreScopeValue19 = chatCoreScopeValue17?.id != null ? chatCoreScopeValue14.find(chatCoreScopeValue22 => String(chatCoreScopeValue22?.id) === String(chatCoreScopeValue17.id)) || null : chatCoreScopeValue16,
    chatCoreScopeValue20 = String(chatCoreScopeValue18.name || chatCoreScopeValue18.realName || chatCoreScopeValue18.nickname || chatCoreScopeValue13.name || chatCoreScopeValue13.realName || "User").trim() || "User";
  return {
    accountId: String(chatCoreScopeValue18.id || chatCoreScopeValue16?.id || chatCoreScopeValue13.id || ""),
    name: chatCoreScopeValue20,
    avatarUrl: String(chatCoreScopeValue19 ? chatCoreScopeValue19.avatarUrl || chatCoreScopeValue19.avatar || "assets/moren-thumb.jpg" : chatCoreScopeValue18.avatarUrl || chatCoreScopeValue18.avatar || chatCoreScopeValue13.avatarUrl || chatCoreScopeValue13.avatar || "assets/moren-thumb.jpg"),
    persona: String(chatCoreScopeValue18.persona || chatCoreScopeValue18.signature || chatCoreScopeValue13.persona || ""),
    signature: String(chatCoreScopeValue18.signature || chatCoreScopeValue18.persona || chatCoreScopeValue13.signature || "")
  };
};
window.imApp.getGroupUserAvatarUrl = function (chatCoreScopeValue23, chatCoreScopeValue24 = null) {
  const chatCoreScopeValue25 = chatCoreScopeValue24?.role === "user" ? chatCoreScopeValue24.userIdentity : null;
  if (chatCoreScopeValue25 && typeof chatCoreScopeValue25 === "object") {
    const chatCoreScopeValue26 = String(chatCoreScopeValue25.accountId || "");
    if (chatCoreScopeValue26) {
      const chatCoreScopeValue27 = typeof window.getAccounts === "function" ? window.getAccounts() : [],
        chatCoreScopeValue28 = chatCoreScopeValue27.find(chatCoreScopeValue29 => String(chatCoreScopeValue29?.id) === chatCoreScopeValue26);
      if (chatCoreScopeValue28) return String(chatCoreScopeValue28.avatarUrl || chatCoreScopeValue28.avatar || "assets/moren-thumb.jpg");
      return String(chatCoreScopeValue25.avatarUrl || "assets/moren-thumb.jpg");
    }
  }
  return window.imApp.getGroupUserIdentity(chatCoreScopeValue23).avatarUrl;
};
window.imApp.captureGroupUserIdentity = function (chatCoreScopeValue30, chatCoreScopeValue31) {
  if (!chatCoreScopeValue30 || chatCoreScopeValue30.type !== "group" || !chatCoreScopeValue31 || chatCoreScopeValue31.role !== "user") return chatCoreScopeValue31;
  if (chatCoreScopeValue31.userIdentity && typeof chatCoreScopeValue31.userIdentity === "object" && String(chatCoreScopeValue31.userIdentity.name || "").trim()) return chatCoreScopeValue31;
  const chatCoreScopeValue32 = window.imApp.getGroupUserIdentity(chatCoreScopeValue30);
  return chatCoreScopeValue31.userIdentity = {
    accountId: chatCoreScopeValue32.accountId,
    name: chatCoreScopeValue32.name,
    avatarUrl: chatCoreScopeValue32.avatarUrl
  }, chatCoreScopeValue31;
};
window.imApp.getMessageUserIdentity = function (chatCoreScopeValue33, chatCoreScopeValue34) {
  if (chatCoreScopeValue33?.type === "group" && chatCoreScopeValue34?.role === "user") {
    const chatCoreScopeValue36 = chatCoreScopeValue34.userIdentity;
    if (chatCoreScopeValue36 && typeof chatCoreScopeValue36 === "object" && String(chatCoreScopeValue36.name || "").trim()) {
      const chatCoreScopeValue37 = window.imApp.getGroupUserIdentity(chatCoreScopeValue33, {
        ignoreOverride: true
      });
      return {
        accountId: String(chatCoreScopeValue36.accountId || ""),
        name: String(chatCoreScopeValue36.name).trim(),
        avatarUrl: String(chatCoreScopeValue36.avatarUrl || chatCoreScopeValue37.avatarUrl || "assets/moren-thumb.jpg"),
        persona: chatCoreScopeValue37.persona,
        signature: chatCoreScopeValue37.signature
      };
    }
    return window.imApp.getGroupUserIdentity(chatCoreScopeValue33, {
      ignoreOverride: true
    });
  }
  const chatCoreScopeValue35 = window.getUserState ? window.getUserState() : window.userState || {};
  return {
    accountId: String(chatCoreScopeValue35.id || ""),
    name: String(chatCoreScopeValue35.name || chatCoreScopeValue35.realName || chatCoreScopeValue35.nickname || "User"),
    avatarUrl: String(chatCoreScopeValue35.avatarUrl || chatCoreScopeValue35.avatar || "assets/moren-thumb.jpg"),
    persona: String(chatCoreScopeValue35.persona || ""),
    signature: String(chatCoreScopeValue35.signature || "")
  };
};
window.imApp.getChatUserAvatarUrl = function (chatCoreScopeValue38, chatCoreScopeValue39) {
  const chatCoreScopeValue40 = typeof window.getAccounts === "function" ? window.getAccounts() : [];
  const chatCoreScopeValue41 = chatCoreScopeValue39 || chatCoreScopeValue40.find(chatCoreScopeValue43 => String(chatCoreScopeValue43?.id) === String(chatCoreScopeValue38?.boundAccountId || "")) || (window.getUserState ? window.getUserState() : window.userState) || {};
  const chatCoreScopeValue42 = chatCoreScopeValue38?.separateUserAvatarEnabled === true && chatCoreScopeValue38?.type !== "group" ? chatCoreScopeValue38.userAvatarsByAccount?.[String(chatCoreScopeValue41.id || chatCoreScopeValue38.boundAccountId || "__default__")] : "";
  return String(chatCoreScopeValue42 || chatCoreScopeValue41.avatarUrl || chatCoreScopeValue41.avatar || "");
};
window.imApp.isChatNoticeDismissed = (chatCoreScopeValue44, chatCoreScopeValue45) => chatCoreScopeValue44?.dismissedChatNotices?.[chatCoreScopeValue45] === true;
window.imApp.dismissChatNotice = async (chatCoreScopeValue46, chatCoreScopeValue47) => window.imApp.commitFriendChange(chatCoreScopeValue46, chatCoreScopeValue48 => {
  chatCoreScopeValue48.dismissedChatNotices = {
    ...(chatCoreScopeValue48.dismissedChatNotices || {}),
    [chatCoreScopeValue47]: true
  };
}, {
  silent: true,
  metaOnly: true
});
window.imApp.getCharUserIdentity = function (chatCoreScopeValue49) {
  const chatCoreScopeValue50 = window.getUserState ? window.getUserState() : window.userState || {},
    chatCoreScopeValue51 = typeof window.getAccounts === "function" ? window.getAccounts() : [],
    chatCoreScopeValue52 = chatCoreScopeValue51.find(chatCoreScopeValue61 => String(chatCoreScopeValue61?.id) === String(chatCoreScopeValue49?.boundAccountId || "")),
    chatCoreScopeValue53 = typeof window.getCurrentAccountId === "function" ? window.getCurrentAccountId() : null,
    chatCoreScopeValue54 = chatCoreScopeValue51.find(chatCoreScopeValue62 => String(chatCoreScopeValue62?.id) === String(chatCoreScopeValue53)),
    chatCoreScopeValue55 = chatCoreScopeValue52 || chatCoreScopeValue54 || chatCoreScopeValue50 || {},
    chatCoreScopeValue56 = chatCoreScopeValue52 ? {} : chatCoreScopeValue50,
    chatCoreScopeValue57 = String(chatCoreScopeValue55.id || chatCoreScopeValue50.id || "__default__"),
    chatCoreScopeValue58 = String(chatCoreScopeValue55.name || chatCoreScopeValue55.realName || chatCoreScopeValue55.nickname || chatCoreScopeValue56.name || "User").trim() || "User",
    chatCoreScopeValue59 = chatCoreScopeValue49?.userRemarksByAccount,
    chatCoreScopeValue60 = chatCoreScopeValue59 && typeof chatCoreScopeValue59 === "object" && Object.prototype.hasOwnProperty.call(chatCoreScopeValue59, chatCoreScopeValue57) ? String(chatCoreScopeValue59[chatCoreScopeValue57] || "").trim().slice(0, 80) : "";
  return {
    accountId: chatCoreScopeValue57,
    accountName: chatCoreScopeValue58,
    remark: chatCoreScopeValue60,
    name: chatCoreScopeValue60 || chatCoreScopeValue58,
    avatarUrl: String(chatCoreScopeValue55.avatarUrl || chatCoreScopeValue55.avatar || chatCoreScopeValue56.avatarUrl || chatCoreScopeValue56.avatar || ""),
    persona: String(chatCoreScopeValue55.persona || chatCoreScopeValue55.signature || chatCoreScopeValue56.persona || "")
  };
};
window.imApp.setCustomChatTime = async function (chatCoreScopeValue63, chatCoreScopeValue64, chatCoreScopeValue65, chatCoreScopeValue66 = "") {
  const chatCoreScopeValue67 = window.imApp.getFriendById(chatCoreScopeValue63);
  const chatCoreScopeValue68 = window.imDataUtils;
  if (!chatCoreScopeValue68?.isCustomChatTimeEnabled(chatCoreScopeValue67)) return false;
  const chatCoreScopeValue69 = chatCoreScopeValue68.normalizeChatTimeAnchors([{
    sourceTimestamp: chatCoreScopeValue64,
    sceneTimestamp: chatCoreScopeValue65,
    messageId: chatCoreScopeValue66
  }]);
  if (chatCoreScopeValue69.length !== 1) return false;
  const chatCoreScopeValue70 = await window.imApp.commitScopedFriendChange(chatCoreScopeValue63, chatCoreScopeValue71 => {
    if (!chatCoreScopeValue68.isCustomChatTimeEnabled(chatCoreScopeValue71)) throw new Error("Custom chat time is disabled");
    chatCoreScopeValue71.customTimeAnchors = chatCoreScopeValue68.normalizeChatTimeAnchors([...(chatCoreScopeValue71.customTimeAnchors || []), chatCoreScopeValue69[0]]);
  }, {
    silent: true,
    immediate: true,
    metaOnly: true,
    syncActive: true,
    syncSettings: true
  });
  if (!chatCoreScopeValue70) {
    const chatCoreScopeValue72 = window.imApp.getFriendById(chatCoreScopeValue63);
    chatCoreScopeValue72 && (window.imApp.syncActiveFriendReference?.(chatCoreScopeValue72), window.imApp.syncSettingsFriendReference?.(chatCoreScopeValue72));
  }
  return chatCoreScopeValue70;
};
window.imApp.commitCharRelationship = async function (chatCoreScopeValue73, chatCoreScopeValue74, chatCoreScopeValue75) {
  const chatCoreScopeValue76 = typeof chatCoreScopeValue74 === "string" ? chatCoreScopeValue74 : "";
  const chatCoreScopeValue77 = chatCoreScopeValue76.trim();
  if (!chatCoreScopeValue75 || !chatCoreScopeValue77 || chatCoreScopeValue77.length > 120 || /[\u0000-\u001f\u007f]/.test(chatCoreScopeValue76)) return {
    saved: true,
    changed: false
  };
  const chatCoreScopeValue78 = window.imApp.getFriendById?.(chatCoreScopeValue73) || (window.imData?.friends || []).find(chatCoreScopeValue81 => String(chatCoreScopeValue81.id) === String(chatCoreScopeValue73));
  if (chatCoreScopeValue78?.type !== "char" || String(chatCoreScopeValue78.relationship || "").trim() === chatCoreScopeValue77) return {
    saved: true,
    changed: false
  };
  let chatCoreScopeValue79 = null;
  const chatCoreScopeValue80 = await window.imApp.commitFriendChange(chatCoreScopeValue73, chatCoreScopeValue82 => {
    if (chatCoreScopeValue82.type !== "char" || String(chatCoreScopeValue82.relationship || "").trim() === chatCoreScopeValue77) return;
    chatCoreScopeValue82.messages = Array.isArray(chatCoreScopeValue82.messages) ? chatCoreScopeValue82.messages : [];
    if (chatCoreScopeValue82.messages.some(chatCoreScopeValue85 => chatCoreScopeValue85?.noticeKind === "relationship_changed" && String(chatCoreScopeValue85.apiRunId || "") === String(chatCoreScopeValue75))) return;
    const chatCoreScopeValue83 = String(chatCoreScopeValue82.relationship || "");
    chatCoreScopeValue82.relationship = chatCoreScopeValue77;
    const chatCoreScopeValue84 = chatCoreScopeValue82.nickname || chatCoreScopeValue82.realName || "Char";
    chatCoreScopeValue79 = {
      id: chatCoreScopeValue75 + "-relationship",
      role: "system",
      type: "system_notice",
      noticeKind: "relationship_changed",
      excludedFromContext: true,
      content: chatCoreScopeValue84 + "现在认为你们的关系为" + chatCoreScopeValue77,
      relationshipChange: {
        oldRelationship: chatCoreScopeValue83,
        newRelationship: chatCoreScopeValue77
      },
      timestamp: Date.now(),
      apiRunId: chatCoreScopeValue75
    };
    chatCoreScopeValue82.messages.push(chatCoreScopeValue79);
    window.imApp.syncFriendMessageSummary?.(chatCoreScopeValue82);
  }, {
    silent: true,
    immediate: true,
    includeMessages: true,
    syncActive: true,
    syncSettings: true
  });
  if (!chatCoreScopeValue80) {
    const chatCoreScopeValue86 = window.imApp.getFriendById?.(chatCoreScopeValue73);
    chatCoreScopeValue86 && (window.imApp.syncActiveFriendReference?.(chatCoreScopeValue86), window.imApp.syncSettingsFriendReference?.(chatCoreScopeValue86));
  }
  if (chatCoreScopeValue80 && chatCoreScopeValue79 && String(window.imData.currentSettingsFriend?.id) === String(chatCoreScopeValue73)) {
    window.imData.currentSettingsFriend.relationship = chatCoreScopeValue77;
    const chatCoreScopeValue87 = typeof document !== "undefined" ? document.getElementById("char-relationship-input") : null;
    if (chatCoreScopeValue87) chatCoreScopeValue87.value = chatCoreScopeValue77;
  }
  return {
    saved: chatCoreScopeValue80,
    changed: !!(chatCoreScopeValue80 && chatCoreScopeValue79),
    notice: chatCoreScopeValue80 ? chatCoreScopeValue79 : null
  };
}, window.imApp.setCustomChatTime = async function (chatCoreNewScope86, chatCoreNewScope87, chatCoreNewScope88, chatCoreNewScope89 = "") {
  const chatCoreNewScope90 = window.imApp.getFriendById(chatCoreNewScope86),
    chatCoreNewScope91 = window.imDataUtils;
  if (!chatCoreNewScope91?.["isCustomChatTimeEnabled"](chatCoreNewScope90)) return false;
  const chatCoreNewScope92 = chatCoreNewScope91.normalizeChatTimeAnchors([{
    sourceTimestamp: chatCoreNewScope87,
    sceneTimestamp: chatCoreNewScope88,
    messageId: chatCoreNewScope89
  }]);
  if (chatCoreNewScope92.length !== 1) return false;
  const chatCoreNewScope93 = await window.imApp.commitScopedFriendChange(chatCoreNewScope86, chatCoreNewScope94 => {
    if (!chatCoreNewScope91.isCustomChatTimeEnabled(chatCoreNewScope94)) throw new Error("Custom chat time is disabled");
    chatCoreNewScope94.customTimeAnchors = chatCoreNewScope91.normalizeChatTimeAnchors([...(chatCoreNewScope94.customTimeAnchors || []), chatCoreNewScope92[0]]);
  }, {
    silent: true,
    immediate: true,
    metaOnly: true,
    syncActive: true,
    syncSettings: true
  });
  if (!chatCoreNewScope93) {
    const chatCoreNewScope95 = window.imApp.getFriendById(chatCoreNewScope86);
    chatCoreNewScope95 && (window.imApp.syncActiveFriendReference?.(chatCoreNewScope95), window.imApp.syncSettingsFriendReference?.(chatCoreNewScope95));
  }
  return chatCoreNewScope93;
}, window.imApp.commitCharUserRemark = async function (chatCoreScopeValue88, chatCoreScopeValue89, chatCoreScopeValue90, chatCoreScopeValue91) {
  const chatCoreScopeValue92 = typeof chatCoreScopeValue90 === "string" ? chatCoreScopeValue90 : "",
    chatCoreScopeValue93 = chatCoreScopeValue92.trim();
  if (!chatCoreScopeValue93 || chatCoreScopeValue93.length > 80 || /[\u0000-\u001f\u007f]/.test(chatCoreScopeValue92)) return {
    saved: true,
    changed: false
  };
  const chatCoreScopeValue94 = (window.imData?.friends || []).find(chatCoreScopeValue98 => String(chatCoreScopeValue98.id) === String(chatCoreScopeValue88)),
    chatCoreScopeValue95 = window.imApp.getCharUserIdentity(chatCoreScopeValue94);
  if (chatCoreScopeValue94?.type !== "char" || chatCoreScopeValue95.accountId !== String(chatCoreScopeValue89) || chatCoreScopeValue95.remark === chatCoreScopeValue93) return {
    saved: true,
    changed: false
  };
  let chatCoreScopeValue96 = null;
  const chatCoreScopeValue97 = await window.imApp.commitFriendChange(chatCoreScopeValue88, chatCoreScopeValue99 => {
    const chatCoreScopeValue100 = window.imApp.getCharUserIdentity(chatCoreScopeValue99);
    if (chatCoreScopeValue99?.type !== "char" || chatCoreScopeValue100.accountId !== String(chatCoreScopeValue89) || chatCoreScopeValue100.remark === chatCoreScopeValue93) return;
    chatCoreScopeValue99.messages = Array.isArray(chatCoreScopeValue99.messages) ? chatCoreScopeValue99.messages : [];
    if (chatCoreScopeValue99.messages.some(chatCoreScopeValue102 => chatCoreScopeValue102?.noticeKind === "user_remark_changed" && String(chatCoreScopeValue102.apiRunId || "") === String(chatCoreScopeValue91))) return;
    chatCoreScopeValue99.userRemarksByAccount = {
      ...(chatCoreScopeValue99.userRemarksByAccount || {}),
      [chatCoreScopeValue89]: chatCoreScopeValue93
    };
    const chatCoreScopeValue101 = String(chatCoreScopeValue99.nickname || chatCoreScopeValue99.realName || "Char").trim() || "Char";
    chatCoreScopeValue96 = {
      id: chatCoreScopeValue91 + "-user-remark",
      role: "system",
      type: "system_notice",
      noticeKind: "user_remark_changed",
      excludedFromContext: true,
      content: chatCoreScopeValue101 + "更改了你的备注",
      timestamp: Date.now(),
      apiRunId: chatCoreScopeValue91,
      remarkChange: {
        oldRemark: chatCoreScopeValue100.remark,
        newRemark: chatCoreScopeValue93
      }
    };
    chatCoreScopeValue99.messages.push(chatCoreScopeValue96);
    window.imApp.syncFriendMessageSummary?.(chatCoreScopeValue99);
  }, {
    silent: true,
    immediate: true,
    includeMessages: true,
    syncActive: true
  });
  return chatCoreScopeValue97 && chatCoreScopeValue96 && window.dispatchEvent(new CustomEvent("u2:char-user-remark-changed", {
    detail: {
      friendId: String(chatCoreScopeValue88),
      accountId: String(chatCoreScopeValue89)
    }
  })), {
    saved: chatCoreScopeValue97,
    changed: !!(chatCoreScopeValue97 && chatCoreScopeValue96),
    notice: chatCoreScopeValue96
  };
};
window.imApp.DEFAULT_STATUS_PROMPT = "Write exactly three genuine, unspoken thoughts the character has right now in Simplified Chinese. Each line should contain about 10 Chinese characters. Use exactly three lines, one thought per line, with no numbering, quotation marks, title, prefix, or explanation.";
window.imApp.DEFAULT_STATUS_TEMPLATE_REGEX = "(?<thought>[\\s\\S]+)";
window.imApp.DEFAULT_STATUS_TEMPLATE_HTML = "<div class=\"chat-profile-status-page\" data-selected-index=\"{{index}}\">\n    <div class=\"chat-profile-status-time\">{{time}}</div>\n    <div class=\"gmp-inner-voice chat-profile-panel-thought\">{{thought}}</div>\n    <div class=\"chat-profile-status-counter\"><span>{{index}}</span> / {{total}}</div>\n</div>";
window.imApp.createDefaultStatusTemplate = function (chatCoreScopeValue103 = {}) {
  return {
    enabled: chatCoreScopeValue103.enabled === true,
    prompt: typeof chatCoreScopeValue103.prompt === "string" && chatCoreScopeValue103.prompt.trim() ? chatCoreScopeValue103.prompt.trim() : window.imApp.DEFAULT_STATUS_PROMPT,
    regex: typeof chatCoreScopeValue103.regex === "string" && chatCoreScopeValue103.regex.trim() ? chatCoreScopeValue103.regex.trim() : window.imApp.DEFAULT_STATUS_TEMPLATE_REGEX,
    html: typeof chatCoreScopeValue103.html === "string" && chatCoreScopeValue103.html.trim() ? chatCoreScopeValue103.html.trim() : window.imApp.DEFAULT_STATUS_TEMPLATE_HTML
  };
};
window.imApp.DEFAULT_SINGLE_CHAT_COT_PROMPT = "请按以下顺序完整分析：\n1. 当前具体日期、时间与时间段，以及这对本轮场景和聊天承接意味着什么。\n2. 结合自己的核心人设、性格、当前情绪和与 User 的关系，分析自己现在最真实的想法与适合的回应方式。\n3. 结合 User 人设、当前消息的内容与语气，分析 User 此刻的需求、感受和适合被怎样回应。";
window.imApp.scopeUserCss = function (chatCoreScopeValue104, chatCoreScopeValue105) {
  if (!chatCoreScopeValue104 || !chatCoreScopeValue105) return "";
  function chatCoreScopeValue106(chatCoreScopeValue110, chatCoreScopeValue111) {
    let chatCoreScopeValue112 = 0,
      chatCoreScopeValue113 = null,
      chatCoreScopeValue114 = false;
    for (let chatCoreScopeValue115 = chatCoreScopeValue111; chatCoreScopeValue115 < chatCoreScopeValue110.length; chatCoreScopeValue115 += 1) {
      const chatCoreScopeValue116 = chatCoreScopeValue110[chatCoreScopeValue115],
        chatCoreScopeValue117 = chatCoreScopeValue110[chatCoreScopeValue115 + 1];
      if (chatCoreScopeValue114) {
        chatCoreScopeValue116 === "*" && chatCoreScopeValue117 === "/" && (chatCoreScopeValue114 = false, chatCoreScopeValue115 += 1);
        continue;
      }
      if (chatCoreScopeValue113) {
        if (chatCoreScopeValue116 === "\\") chatCoreScopeValue115 += 1;else chatCoreScopeValue116 === chatCoreScopeValue113 && (chatCoreScopeValue113 = null);
        continue;
      }
      if (chatCoreScopeValue116 === "/" && chatCoreScopeValue117 === "*") {
        chatCoreScopeValue114 = true;
        chatCoreScopeValue115 += 1;
        continue;
      }
      if (chatCoreScopeValue116 === "\"" || chatCoreScopeValue116 === "'") {
        chatCoreScopeValue113 = chatCoreScopeValue116;
        continue;
      }
      if (chatCoreScopeValue116 === "{") chatCoreScopeValue112 += 1;
      if (chatCoreScopeValue116 === "}") {
        chatCoreScopeValue112 -= 1;
        if (chatCoreScopeValue112 === 0) return chatCoreScopeValue115;
      }
    }
    return -1;
  }
  function chatCoreScopeValue107(chatCoreScopeValue118) {
    const chatCoreScopeValue119 = [];
    let chatCoreScopeValue120 = "",
      chatCoreScopeValue121 = 0,
      chatCoreScopeValue122 = 0,
      chatCoreScopeValue123 = null;
    for (let chatCoreScopeValue124 = 0; chatCoreScopeValue124 < chatCoreScopeValue118.length; chatCoreScopeValue124 += 1) {
      const chatCoreScopeValue125 = chatCoreScopeValue118[chatCoreScopeValue124];
      if (chatCoreScopeValue123) {
        chatCoreScopeValue120 += chatCoreScopeValue125;
        if (chatCoreScopeValue125 === "\\") {
          chatCoreScopeValue124 += 1;
          chatCoreScopeValue120 += chatCoreScopeValue118[chatCoreScopeValue124] || "";
        } else chatCoreScopeValue125 === chatCoreScopeValue123 && (chatCoreScopeValue123 = null);
        continue;
      }
      if (chatCoreScopeValue125 === "\"" || chatCoreScopeValue125 === "'") {
        chatCoreScopeValue123 = chatCoreScopeValue125;
        chatCoreScopeValue120 += chatCoreScopeValue125;
        continue;
      }
      if (chatCoreScopeValue125 === "[") chatCoreScopeValue121 += 1;
      if (chatCoreScopeValue125 === "]") chatCoreScopeValue121 = Math.max(0, chatCoreScopeValue121 - 1);
      if (chatCoreScopeValue125 === "(") chatCoreScopeValue122 += 1;
      if (chatCoreScopeValue125 === ")") chatCoreScopeValue122 = Math.max(0, chatCoreScopeValue122 - 1);
      chatCoreScopeValue125 === "," && chatCoreScopeValue121 === 0 && chatCoreScopeValue122 === 0 ? (chatCoreScopeValue119.push(chatCoreScopeValue120.trim()), chatCoreScopeValue120 = "") : chatCoreScopeValue120 += chatCoreScopeValue125;
    }
    if (chatCoreScopeValue120.trim()) chatCoreScopeValue119.push(chatCoreScopeValue120.trim());
    return chatCoreScopeValue119;
  }
  function chatCoreScopeValue108(chatCoreScopeValue126) {
    const chatCoreScopeValue127 = chatCoreScopeValue126.trim();
    if (!chatCoreScopeValue127) return chatCoreScopeValue127;
    if (chatCoreScopeValue127.includes(":scope")) return chatCoreScopeValue127.replace(/:scope/g, chatCoreScopeValue105);
    if (chatCoreScopeValue127 === ":root" || chatCoreScopeValue127 === "html" || chatCoreScopeValue127 === "body") return chatCoreScopeValue105;
    if (chatCoreScopeValue127.startsWith(chatCoreScopeValue105)) return chatCoreScopeValue127;
    return chatCoreScopeValue105 + " " + chatCoreScopeValue127;
  }
  function chatCoreScopeValue109(chatCoreScopeValue128) {
    let chatCoreScopeValue129 = "",
      chatCoreScopeValue130 = 0;
    while (chatCoreScopeValue130 < chatCoreScopeValue128.length) {
      const chatCoreScopeValue131 = chatCoreScopeValue128.indexOf("{", chatCoreScopeValue130);
      if (chatCoreScopeValue131 === -1) {
        chatCoreScopeValue129 += chatCoreScopeValue128.slice(chatCoreScopeValue130);
        break;
      }
      const chatCoreScopeValue132 = chatCoreScopeValue128.slice(chatCoreScopeValue130, chatCoreScopeValue131),
        chatCoreScopeValue133 = chatCoreScopeValue132.trim(),
        chatCoreScopeValue134 = chatCoreScopeValue106(chatCoreScopeValue128, chatCoreScopeValue131);
      if (chatCoreScopeValue134 === -1) {
        chatCoreScopeValue129 += chatCoreScopeValue128.slice(chatCoreScopeValue130);
        break;
      }
      const chatCoreScopeValue135 = chatCoreScopeValue128.slice(chatCoreScopeValue131 + 1, chatCoreScopeValue134),
        chatCoreScopeValue136 = chatCoreScopeValue133.toLowerCase();
      if (!chatCoreScopeValue133) chatCoreScopeValue129 += chatCoreScopeValue128.slice(chatCoreScopeValue130, chatCoreScopeValue134 + 1);else {
        if (chatCoreScopeValue136.startsWith("@media") || chatCoreScopeValue136.startsWith("@supports") || chatCoreScopeValue136.startsWith("@container") || chatCoreScopeValue136.startsWith("@layer")) chatCoreScopeValue129 += chatCoreScopeValue132 + "{" + chatCoreScopeValue109(chatCoreScopeValue135) + "}";else {
          if (chatCoreScopeValue136.startsWith("@keyframes") || chatCoreScopeValue136.startsWith("@-webkit-keyframes") || chatCoreScopeValue136.startsWith("@font-face") || chatCoreScopeValue136.startsWith("@property") || chatCoreScopeValue136.startsWith("@page")) chatCoreScopeValue129 += chatCoreScopeValue128.slice(chatCoreScopeValue130, chatCoreScopeValue134 + 1);else {
            if (chatCoreScopeValue133.startsWith("@")) chatCoreScopeValue129 += chatCoreScopeValue128.slice(chatCoreScopeValue130, chatCoreScopeValue134 + 1);else {
              const chatCoreScopeValue137 = chatCoreScopeValue132.match(/^\s*/)?.[0] || "",
                chatCoreScopeValue138 = chatCoreScopeValue107(chatCoreScopeValue133).map(chatCoreScopeValue108).join(", ");
              chatCoreScopeValue129 += "" + chatCoreScopeValue137 + chatCoreScopeValue138 + "{" + chatCoreScopeValue135 + "}";
            }
          }
        }
      }
      chatCoreScopeValue130 = chatCoreScopeValue134 + 1;
    }
    return chatCoreScopeValue129;
  }
  return chatCoreScopeValue109(String(chatCoreScopeValue104));
};
window.imApp.getSingleChatThemePreviewMarkup = function (chatCoreScopeValue139 = "theme-css-preview-chat") {
  return "<div id=\"" + chatCoreScopeValue139 + `" class="active-chat-interface im-chat-interface im-chat-single">
        <div class="chat-sticky-container is-friend"><div class="chat-top-bar im-chat-top-bar">
            <div class="im-chat-header-left"><div class="ins-chat-header im-chat-header-main">
                <div class="im-chat-avatar-wrap"><div class="ins-chat-avatar"></div></div>
                <div class="im-chat-title-wrap"><div class="ins-chat-name">示例角色</div><div class="ins-chat-sign">在线</div></div>
            </div></div>
        </div></div>
        <div class="ins-chat-messages">
            <div class="chat-row ai-row has-next"><div class="chat-bubble ai-bubble">这是对方的消息</div></div>
            <div class="chat-row user-row has-prev"><div class="chat-bubble user-bubble">这是我的消息</div></div>
        </div>
        <div class="ins-chat-input-container"><div class="ins-chat-input-wrapper"><input class="ins-message-input chat-input" placeholder="iMessage..."></div></div>
    </div>`;
};
window.imApp.getSingleChatThemePreviewDocument = function (chatCoreScopeValue140, chatCoreScopeValue141) {
  const chatCoreScopeValue142 = "theme-css-preview-chat",
    chatCoreScopeValue143 = chatCoreScopeValue141 === "bubble_css" ? "#" + chatCoreScopeValue142 : ".active-chat-interface.im-chat-single",
    chatCoreScopeValue144 = window.imApp.scopeUserCss(String(chatCoreScopeValue140 || ""), chatCoreScopeValue143).replace(/<\/style/gi, "<\\/style");
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>
        *{box-sizing:border-box}html,body{margin:0;min-height:100%;font:13px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#111}
        body{padding:12px;background:#f2f2f7}.active-chat-interface.im-chat-single{position:relative;display:flex;flex-direction:column;min-height:230px;overflow:hidden;border-radius:16px;background:#fff}
        .chat-sticky-container{padding:10px 12px;border-bottom:1px solid #eee}.chat-top-bar,.im-chat-header-left,.ins-chat-header{display:flex;align-items:center;gap:8px}
        .ins-chat-avatar{width:30px;height:30px;border-radius:50%;background:#d1d1d6}.ins-chat-name{font-weight:700}.ins-chat-sign{color:#8e8e93;font-size:10px}
        .ins-chat-messages{flex:1;padding:14px 12px}.chat-row{display:flex;margin:8px 0}.chat-row.user-row{justify-content:flex-end}
        .chat-bubble{max-width:76%;padding:9px 12px;border-radius:16px}.ai-bubble{background:#e5e5ea}.user-bubble{background:#2c2c2e;color:#fff}
        .ins-chat-input-container{padding:9px 12px;border-top:1px solid #eee}.ins-message-input{width:100%;padding:8px 10px;border:0;border-radius:14px;background:#f2f2f7}
        ` + chatCoreScopeValue144 + `
    </style></head><body>` + window.imApp.getSingleChatThemePreviewMarkup(chatCoreScopeValue142) + "</body></html>";
};
window.imApp.validateSingleChatThemeCss = function (chatCoreScopeValue145, chatCoreScopeValue146) {
  if (chatCoreScopeValue146 !== "chat_css" && chatCoreScopeValue146 !== "bubble_css") return {
    valid: true
  };
  if (!String(chatCoreScopeValue145 || "").trim()) return {
    valid: false,
    error: "CSS 代码为空"
  };
  if (typeof document === "undefined" || !document.head || !window.imApp.scopeUserCss) return {
    valid: false,
    error: "聊天 CSS 校验组件未加载"
  };
  const chatCoreScopeValue147 = "theme-css-preview-chat",
    chatCoreScopeValue148 = chatCoreScopeValue146 === "chat_css" ? ".active-chat-interface.im-chat-single" : "#" + chatCoreScopeValue147,
    chatCoreScopeValue149 = window.imApp.scopeUserCss(chatCoreScopeValue145, chatCoreScopeValue148),
    chatCoreScopeValue150 = document.createElement("div");
  chatCoreScopeValue150.innerHTML = window.imApp.getSingleChatThemePreviewMarkup(chatCoreScopeValue147);
  const chatCoreScopeValue151 = document.createElement("style");
  chatCoreScopeValue151.media = "not all";
  chatCoreScopeValue151.textContent = chatCoreScopeValue149;
  document.head.appendChild(chatCoreScopeValue151);
  let chatCoreScopeValue152 = [];
  try {
    const chatCoreScopeValue154 = chatCoreScopeValue155 => {
      for (const chatCoreScopeValue156 of Array.from(chatCoreScopeValue155 || [])) {
        if (typeof chatCoreScopeValue156.selectorText === "string" && chatCoreScopeValue156.style?.length) chatCoreScopeValue152.push(chatCoreScopeValue156.selectorText);else {
          if (chatCoreScopeValue156.cssRules) chatCoreScopeValue154(chatCoreScopeValue156.cssRules);
        }
      }
    };
    chatCoreScopeValue154(chatCoreScopeValue151.sheet?.cssRules);
  } catch (chatCoreScopeValue157) {
    return {
      valid: false,
      error: "CSS 语法无法解析"
    };
  } finally {
    chatCoreScopeValue151.remove();
  }
  if (!chatCoreScopeValue152.length) return {
    valid: false,
    error: "CSS 中没有可用的样式规则"
  };
  const chatCoreScopeValue153 = chatCoreScopeValue158 => {
    const chatCoreScopeValue159 = chatCoreScopeValue158.replace(/::(?:before|after|first-letter|first-line|selection)\b/gi, "").replace(/:(?:hover|active|focus|focus-visible|focus-within)\b/gi, "");
    try {
      return !!chatCoreScopeValue150.querySelector(chatCoreScopeValue159);
    } catch (chatCoreScopeValue160) {
      return false;
    }
  };
  if (!chatCoreScopeValue152.some(chatCoreScopeValue153)) return {
    valid: false,
    error: "CSS 选择器未命中单聊界面（例如 " + chatCoreScopeValue152[0].slice(0, 100) + "）。请使用 :scope 或真实的 .chat-row、.chat-bubble 等类名，不要重复写聊天根节点。"
  };
  return {
    valid: true
  };
};
window.imApp.createDefaultOfflineThemeState = function () {
  return {
    narrativeColor: "#111111",
    dialogueColor: "#8B8B8B",
    customCss: "",
    customCssEnabled: false,
    activePresetId: ""
  };
};
window.imApp.normalizeOfflineThemeState = function (chatCoreScopeValue161) {
  const chatCoreScopeValue162 = window.imApp.createDefaultOfflineThemeState(),
    chatCoreScopeValue163 = chatCoreScopeValue161 && typeof chatCoreScopeValue161 === "object" ? chatCoreScopeValue161 : {},
    chatCoreScopeValue164 = (chatCoreScopeValue167, chatCoreScopeValue168) => {
      const chatCoreScopeValue169 = String(chatCoreScopeValue167 || "").trim();
      return /^#[0-9a-fA-F]{6}$/.test(chatCoreScopeValue169) ? chatCoreScopeValue169.toUpperCase() : chatCoreScopeValue168;
    },
    chatCoreScopeValue165 = typeof chatCoreScopeValue163.customCss === "string" ? chatCoreScopeValue163.customCss : "",
    chatCoreScopeValue166 = chatCoreScopeValue165.replaceAll("offline-tavern", "offline-chat");
  return {
    narrativeColor: chatCoreScopeValue164(chatCoreScopeValue163.narrativeColor, chatCoreScopeValue162.narrativeColor),
    dialogueColor: chatCoreScopeValue164(chatCoreScopeValue163.dialogueColor, chatCoreScopeValue162.dialogueColor),
    customCss: chatCoreScopeValue166,
    customCssEnabled: !!chatCoreScopeValue166.trim(),
    activePresetId: String(chatCoreScopeValue163.activePresetId || "").trim()
  };
};
window.imApp.normalizeOfflineThemePresets = function (chatCoreScopeValue170) {
  const chatCoreScopeValue171 = Array.isArray(chatCoreScopeValue170) ? chatCoreScopeValue170 : [],
    chatCoreScopeValue172 = new Set(),
    chatCoreScopeValue173 = new Set();
  return chatCoreScopeValue171.map((chatCoreScopeValue174, chatCoreScopeValue175) => {
    const chatCoreScopeValue176 = chatCoreScopeValue174 && typeof chatCoreScopeValue174 === "object" ? chatCoreScopeValue174 : {},
      chatCoreScopeValue177 = window.imApp.normalizeOfflineThemeState(chatCoreScopeValue176),
      chatCoreScopeValue178 = String(chatCoreScopeValue176.name || "").trim() || "线下主题 " + (chatCoreScopeValue175 + 1),
      chatCoreScopeValue179 = chatCoreScopeValue178.toLocaleLowerCase();
    let chatCoreScopeValue180 = String(chatCoreScopeValue176.id || "").trim() || "offline-theme-" + (chatCoreScopeValue175 + 1);
    while (chatCoreScopeValue172.has(chatCoreScopeValue180)) chatCoreScopeValue180 = chatCoreScopeValue180 + "-" + (chatCoreScopeValue175 + 1);
    if (chatCoreScopeValue173.has(chatCoreScopeValue179)) return null;
    return chatCoreScopeValue172.add(chatCoreScopeValue180), chatCoreScopeValue173.add(chatCoreScopeValue179), {
      id: chatCoreScopeValue180,
      name: chatCoreScopeValue178,
      narrativeColor: chatCoreScopeValue177.narrativeColor,
      dialogueColor: chatCoreScopeValue177.dialogueColor,
      customCss: chatCoreScopeValue177.customCss
    };
  }).filter(Boolean);
};
const chatCoreScopeValue0 = ":is(#offline-chat-view, #offline-chat-barrage-view)";
window.imApp.getOfflineThemeState = function () {
  const chatCoreScopeValue181 = window.imApp.getImessageUiState?.(),
    chatCoreScopeValue182 = window.imData.offlineThemeInitialized ? window.imData.offlineTheme : chatCoreScopeValue181?.offlineTheme || window.imData.offlineTheme,
    chatCoreScopeValue183 = window.imData.offlineThemeInitialized ? window.imData.offlineThemePresets : chatCoreScopeValue181?.offlineThemePresets || window.imData.offlineThemePresets,
    chatCoreScopeValue184 = window.imApp.normalizeOfflineThemeState(chatCoreScopeValue182),
    chatCoreScopeValue185 = window.imApp.normalizeOfflineThemePresets(chatCoreScopeValue183);
  return chatCoreScopeValue184.activePresetId && !chatCoreScopeValue185.some(chatCoreScopeValue186 => chatCoreScopeValue186.id === chatCoreScopeValue184.activePresetId) && (chatCoreScopeValue184.activePresetId = ""), window.imData.offlineTheme = chatCoreScopeValue184, window.imData.offlineThemePresets = chatCoreScopeValue185, {
    theme: chatCoreScopeValue184,
    presets: chatCoreScopeValue185
  };
};
window.imApp.applyOfflineChatTheme = function (chatCoreScopeValue187 = null) {
  const chatCoreScopeValue188 = window.imApp.normalizeOfflineThemeState(chatCoreScopeValue187 || window.imApp.getOfflineThemeState().theme);
  window.imData.offlineTheme = chatCoreScopeValue188;
  ["offline-chat-view", "offline-chat-barrage-view"].forEach(chatCoreScopeValue190 => {
    const chatCoreScopeValue191 = document.getElementById(chatCoreScopeValue190);
    if (!chatCoreScopeValue191) return;
    chatCoreScopeValue191.style.setProperty("--offline-chat-narrative-color", chatCoreScopeValue188.narrativeColor);
    chatCoreScopeValue191.style.setProperty("--offline-chat-dialogue-color", chatCoreScopeValue188.dialogueColor);
  });
  let chatCoreScopeValue189 = document.getElementById("offline-chat-custom-theme-style");
  return !chatCoreScopeValue189 && (chatCoreScopeValue189 = document.createElement("style"), chatCoreScopeValue189.id = "offline-chat-custom-theme-style", document.head.appendChild(chatCoreScopeValue189)), chatCoreScopeValue189.textContent = chatCoreScopeValue188.customCssEnabled && chatCoreScopeValue188.customCss.trim() ? window.imApp.scopeUserCss(chatCoreScopeValue188.customCss, chatCoreScopeValue0) : "", chatCoreScopeValue188;
};
window.imApp.saveOfflineThemeState = async function (chatCoreScopeValue192) {
  const chatCoreScopeValue193 = window.imApp.applyOfflineChatTheme(chatCoreScopeValue192);
  return window.imData.offlineThemeInitialized = true, await Promise.resolve(window.imApp.saveImessageUiState?.()), document.dispatchEvent(new CustomEvent("u2:offline-theme-changed", {
    detail: {
      theme: chatCoreScopeValue193
    }
  })), chatCoreScopeValue193;
};
window.imApp.saveOfflineThemePresets = async function (chatCoreScopeValue194) {
  const chatCoreScopeValue195 = window.imApp.normalizeOfflineThemePresets(chatCoreScopeValue194);
  return window.imData.offlineThemePresets = chatCoreScopeValue195, window.imData.offlineThemeInitialized = true, await Promise.resolve(window.imApp.saveImessageUiState?.()), document.dispatchEvent(new CustomEvent("u2:offline-theme-changed", {
    detail: {
      presets: chatCoreScopeValue195
    }
  })), chatCoreScopeValue195;
};
window.imApp.applyGlobalChatCss = function (chatCoreScopeValue196 = window.u2ThemeState || {}) {
  const chatCoreScopeValue197 = "global-imessage-chat-css";
  let chatCoreScopeValue198 = document.getElementById(chatCoreScopeValue197);
  !chatCoreScopeValue198 && (chatCoreScopeValue198 = document.createElement("style"), chatCoreScopeValue198.id = chatCoreScopeValue197, document.head.appendChild(chatCoreScopeValue198));
  const chatCoreScopeValue199 = !!chatCoreScopeValue196.imessageChatCssEnabled,
    chatCoreScopeValue200 = typeof chatCoreScopeValue196.imessageChatCss === "string" ? chatCoreScopeValue196.imessageChatCss : "",
    chatCoreScopeValue201 = chatCoreScopeValue199 && chatCoreScopeValue200.trim() ? window.imApp.scopeUserCss(chatCoreScopeValue200, ".active-chat-interface.im-chat-single") : "";
  if (chatCoreScopeValue198.textContent !== chatCoreScopeValue201) chatCoreScopeValue198.textContent = chatCoreScopeValue201;
};
window.imApp.setActiveThemeSurface = function (chatCoreScopeValue202 = "home") {
  const chatCoreScopeValue203 = document.getElementById("imessage-view");
  if (!chatCoreScopeValue203) return;
  chatCoreScopeValue203.dataset.imActiveSurface = String(chatCoreScopeValue202 || "home");
};
function chatCoreScopeValue1({
  styleId: chatCoreScopeValue204,
  enabled: chatCoreScopeValue205,
  css: chatCoreScopeValue206,
  scope: chatCoreScopeValue207
}) {
  let chatCoreScopeValue208 = document.getElementById(chatCoreScopeValue204);
  !chatCoreScopeValue208 && (chatCoreScopeValue208 = document.createElement("style"), chatCoreScopeValue208.id = chatCoreScopeValue204, document.head.appendChild(chatCoreScopeValue208));
  const chatCoreScopeValue209 = chatCoreScopeValue205 && typeof chatCoreScopeValue206 === "string" && chatCoreScopeValue206.trim() ? window.imApp.scopeUserCss(chatCoreScopeValue206, chatCoreScopeValue207) : "";
  if (chatCoreScopeValue208.textContent !== chatCoreScopeValue209) chatCoreScopeValue208.textContent = chatCoreScopeValue209;
}
window.imApp.applyGlobalHomeCss = function (chatCoreScopeValue210 = window.u2ThemeState || {}) {
  chatCoreScopeValue1({
    styleId: "global-imessage-home-css",
    enabled: !!chatCoreScopeValue210.imessageHomeCssEnabled,
    css: chatCoreScopeValue210.imessageHomeCss,
    scope: "#imessage-view:is([data-im-active-surface=\"home\"], [data-im-active-surface=\"chats\"])"
  });
};
window.imApp.applyGlobalGroupCss = function (chatCoreScopeValue211 = window.u2ThemeState || {}) {
  const chatCoreScopeValue212 = "global-imessage-group-css";
  let chatCoreScopeValue213 = document.getElementById(chatCoreScopeValue212);
  !chatCoreScopeValue213 && (chatCoreScopeValue213 = document.createElement("style"), chatCoreScopeValue213.id = chatCoreScopeValue212, document.head.appendChild(chatCoreScopeValue213));
  const chatCoreScopeValue214 = !!chatCoreScopeValue211.imessageGroupCssEnabled,
    chatCoreScopeValue215 = typeof chatCoreScopeValue211.imessageGroupCss === "string" ? chatCoreScopeValue211.imessageGroupCss : "",
    chatCoreScopeValue216 = chatCoreScopeValue214 && chatCoreScopeValue215.trim() ? window.imApp.scopeUserCss(chatCoreScopeValue215, ".active-chat-interface.im-chat-group") : "";
  if (chatCoreScopeValue213.textContent !== chatCoreScopeValue216) chatCoreScopeValue213.textContent = chatCoreScopeValue216;
};
window.imApp.createDefaultAutonomousTask = function () {
  return {
    enabled: false,
    minIntervalMinutes: 30,
    maxIntervalMinutes: 240,
    nextRunAt: 0,
    lastRunAt: 0
  };
};
window.imApp.normalizeAutonomousTask = function (chatCoreScopeValue217) {
  const chatCoreScopeValue218 = window.imApp.createDefaultAutonomousTask(),
    chatCoreScopeValue219 = chatCoreScopeValue217 && typeof chatCoreScopeValue217 === "object" ? chatCoreScopeValue217 : {},
    chatCoreScopeValue220 = Number(chatCoreScopeValue219.minIntervalMinutes),
    chatCoreScopeValue221 = Number(chatCoreScopeValue219.maxIntervalMinutes),
    chatCoreScopeValue222 = Number.isFinite(chatCoreScopeValue220) ? Math.max(1, Math.round(chatCoreScopeValue220)) : chatCoreScopeValue218.minIntervalMinutes,
    chatCoreScopeValue223 = Number.isFinite(chatCoreScopeValue221) ? Math.max(chatCoreScopeValue222, Math.round(chatCoreScopeValue221)) : Math.max(chatCoreScopeValue222, chatCoreScopeValue218.maxIntervalMinutes);
  return {
    enabled: !!chatCoreScopeValue219.enabled,
    minIntervalMinutes: chatCoreScopeValue222,
    maxIntervalMinutes: chatCoreScopeValue223,
    nextRunAt: Math.max(0, Number(chatCoreScopeValue219.nextRunAt) || chatCoreScopeValue218.nextRunAt),
    lastRunAt: Math.max(0, Number(chatCoreScopeValue219.lastRunAt) || chatCoreScopeValue218.lastRunAt)
  };
};
window.imApp.createDefaultAutonomousActivity = function () {
  return {
    reply: window.imApp.createDefaultAutonomousTask(),
    moment: window.imApp.createDefaultAutonomousTask()
  };
};
window.imApp.normalizeAutonomousActivity = function (chatCoreScopeValue224) {
  const chatCoreScopeValue225 = chatCoreScopeValue224 && typeof chatCoreScopeValue224 === "object" ? chatCoreScopeValue224 : {},
    chatCoreScopeValue226 = chatCoreScopeValue225.reply && typeof chatCoreScopeValue225.reply === "object" || chatCoreScopeValue225.moment && typeof chatCoreScopeValue225.moment === "object",
    chatCoreScopeValue227 = chatCoreScopeValue226 ? chatCoreScopeValue225.reply : chatCoreScopeValue225;
  return {
    reply: window.imApp.normalizeAutonomousTask(chatCoreScopeValue227),
    moment: window.imApp.normalizeAutonomousTask(chatCoreScopeValue225.moment)
  };
};
window.imApp.createDefaultMemory = function () {
  return {
    overview: "",
    anniversaries: "",
    context: {
      enabled: true,
      limit: 50,
      notes: ""
    },
    recallLimits: {
      shortTerm: 30,
      longTerm: 30
    },
    summary: {
      enabled: false,
      limit: 80,
      roundLimit: 30,
      prompt: "",
      apiPresetId: ""
    },
    autonomous: window.imApp.createDefaultAutonomousActivity(),
    longTerm: "",
    shortTermEntries: [],
    groupChatContexts: [],
    cherished: "",
    longTermEntries: [],
    cherishedEntries: [],
    relationships: [],
    xDirectMessageMount: {
      enabled: true,
      limit: 10,
      dmId: ""
    },
    bstagePopMount: {
      enabled: false,
      teamId: "",
      memberId: ""
    },
    schedule: {
      enabled: false,
      sleepTime: "23:00",
      wakeTime: "07:00",
      events: []
    },
    lastSummaryMessageCount: 0,
    summaryCursor: {
      messageId: "",
      order: -1,
      count: 0
    },
    mountSettings: {},
    mountLimits: {},
    crossGroupMemorySettings: {},
    recallPresentation: null
  };
};
window.imApp.normalizeGeneratedContactProfile = function (chatCoreScopeValue228, chatCoreScopeValue229 = {}) {
  const chatCoreScopeValue230 = chatCoreScopeValue228 && typeof chatCoreScopeValue228 === "object" && !Array.isArray(chatCoreScopeValue228) ? chatCoreScopeValue228 : {},
    chatCoreScopeValue231 = {
      nickname: 80,
      realName: 80,
      signature: 240,
      persona: 8000,
      referrerRelation: 200
    },
    chatCoreScopeValue232 = chatCoreScopeValue234 => String(chatCoreScopeValue230[chatCoreScopeValue234] || "").trim(),
    chatCoreScopeValue233 = {
      nickname: chatCoreScopeValue232("nickname"),
      realName: chatCoreScopeValue232("realName"),
      signature: chatCoreScopeValue232("signature"),
      persona: chatCoreScopeValue232("persona"),
      referrerRelation: chatCoreScopeValue232("referrerRelation")
    };
  if (chatCoreScopeValue229.strict === true) {
    if (!chatCoreScopeValue233.nickname || !chatCoreScopeValue233.realName || !chatCoreScopeValue233.signature || !chatCoreScopeValue233.persona || !chatCoreScopeValue233.referrerRelation) return null;
    if (Object.entries(chatCoreScopeValue231).some(([chatCoreScopeValue235, chatCoreScopeValue236]) => chatCoreScopeValue233[chatCoreScopeValue235].length > chatCoreScopeValue236)) return null;
    if (chatCoreScopeValue230.type && chatCoreScopeValue230.type !== "char") return null;
    if (["id", "targetId", "contactId"].some(chatCoreScopeValue237 => Object.prototype.hasOwnProperty.call(chatCoreScopeValue230, chatCoreScopeValue237))) return null;
  }
  return {
    type: "char",
    nickname: chatCoreScopeValue233.nickname.slice(0, chatCoreScopeValue231.nickname),
    realName: chatCoreScopeValue233.realName.slice(0, chatCoreScopeValue231.realName),
    signature: chatCoreScopeValue233.signature.slice(0, chatCoreScopeValue231.signature),
    persona: chatCoreScopeValue233.persona.slice(0, chatCoreScopeValue231.persona),
    referrerRelation: chatCoreScopeValue233.referrerRelation.slice(0, chatCoreScopeValue231.referrerRelation),
    avatarUrl: chatCoreScopeValue229.strict === true ? "" : typeof chatCoreScopeValue230.avatarUrl === "string" ? chatCoreScopeValue230.avatarUrl.trim() : "",
    avatarAssetId: chatCoreScopeValue229.strict === true ? "" : typeof chatCoreScopeValue230.avatarAssetId === "string" ? chatCoreScopeValue230.avatarAssetId.trim() : ""
  };
};
window.imApp.normalizeFriendRequests = function (chatCoreScopeValue238) {
  const chatCoreScopeValue239 = new Set();
  return (Array.isArray(chatCoreScopeValue238) ? chatCoreScopeValue238 : []).map(chatCoreScopeValue240 => {
    if (!chatCoreScopeValue240 || typeof chatCoreScopeValue240 !== "object") return null;
    const chatCoreScopeValue241 = String(chatCoreScopeValue240.id || "").trim(),
      chatCoreScopeValue242 = String(chatCoreScopeValue240.contactId || "").trim();
    if (!chatCoreScopeValue241 || !chatCoreScopeValue242 || chatCoreScopeValue239.has(chatCoreScopeValue241)) return null;
    const chatCoreScopeValue243 = window.imApp.normalizeGeneratedContactProfile(chatCoreScopeValue240.profile, {
      strict: true
    });
    if (!chatCoreScopeValue243) return null;
    return chatCoreScopeValue239.add(chatCoreScopeValue241), {
      id: chatCoreScopeValue241,
      contactId: chatCoreScopeValue242,
      sourceFriendId: String(chatCoreScopeValue240.sourceFriendId || "").trim(),
      sourceMessageId: String(chatCoreScopeValue240.sourceMessageId || "").trim(),
      createdAt: Math.max(0, Number(chatCoreScopeValue240.createdAt) || Date.now()),
      seenAt: Math.max(0, Number(chatCoreScopeValue240.seenAt) || 0),
      status: "pending",
      profile: chatCoreScopeValue243
    };
  }).filter(Boolean).slice(-100);
};
window.imApp.saveFriendRequests = async function (chatCoreScopeValue244, chatCoreScopeValue245 = {}) {
  const chatCoreScopeValue246 = window.imApp.normalizeFriendRequests(window.imData.friendRequests),
    chatCoreScopeValue247 = window.imApp.normalizeFriendRequests(chatCoreScopeValue244);
  window.imData.friendRequests = chatCoreScopeValue247;
  try {
    window.imApp.saveImessageUiState?.();
    if (chatCoreScopeValue245.flush !== false && typeof window.saveGlobalData === "function") {
      const chatCoreScopeValue248 = await Promise.resolve(window.saveGlobalData());
      if (chatCoreScopeValue248 === false) throw new Error("Failed to persist friend requests");
    }
    return window.dispatchEvent(new CustomEvent("u2:friend-requests-changed", {
      detail: {
        count: chatCoreScopeValue247.length
      }
    })), true;
  } catch (chatCoreScopeValue249) {
    return console.error("Failed to save friend requests", chatCoreScopeValue249), window.imData.friendRequests = chatCoreScopeValue246, window.imApp.saveImessageUiState?.(), false;
  }
};
window.imApp.normalizeChatApiUsage = function (chatCoreScopeValue250, chatCoreScopeValue251 = {}) {
  const chatCoreScopeValue252 = chatCoreScopeValue250 && typeof chatCoreScopeValue250 === "object" && !Array.isArray(chatCoreScopeValue250) ? chatCoreScopeValue250 : {},
    chatCoreScopeValue253 = (...chatCoreScopeValue260) => {
      for (const chatCoreScopeValue261 of chatCoreScopeValue260) {
        const chatCoreScopeValue262 = Number(chatCoreScopeValue252[chatCoreScopeValue261]);
        if (Number.isFinite(chatCoreScopeValue262) && chatCoreScopeValue262 >= 0) return Math.round(chatCoreScopeValue262);
      }
      return null;
    },
    chatCoreScopeValue254 = chatCoreScopeValue253("prompt_tokens", "input_tokens", "promptTokens", "inputTokens", "promptTokenCount", "inputTokenCount"),
    chatCoreScopeValue255 = chatCoreScopeValue253("completion_tokens", "output_tokens", "completionTokens", "outputTokens", "candidatesTokenCount", "outputTokenCount"),
    chatCoreScopeValue256 = chatCoreScopeValue253("total_tokens", "totalTokens", "totalTokenCount"),
    chatCoreScopeValue257 = chatCoreScopeValue256 != null ? chatCoreScopeValue256 : chatCoreScopeValue254 != null && chatCoreScopeValue255 != null ? chatCoreScopeValue254 + chatCoreScopeValue255 : null;
  if (chatCoreScopeValue254 == null && chatCoreScopeValue255 == null && chatCoreScopeValue257 == null) return null;
  const chatCoreScopeValue258 = Number(chatCoreScopeValue251.recordedAt || chatCoreScopeValue252.recordedAt || chatCoreScopeValue252.completedAt) || Date.now(),
    chatCoreScopeValue259 = Number(chatCoreScopeValue251.requestMessageCount || chatCoreScopeValue252.requestMessageCount);
  return {
    inputTokens: chatCoreScopeValue254,
    outputTokens: chatCoreScopeValue255,
    totalTokens: chatCoreScopeValue257,
    model: String(chatCoreScopeValue251.model || chatCoreScopeValue252.model || "").trim().slice(0, 200),
    source: String(chatCoreScopeValue251.source || chatCoreScopeValue252.source || "chat").trim().slice(0, 80) || "chat",
    requestMessageCount: Number.isFinite(chatCoreScopeValue259) && chatCoreScopeValue259 >= 0 ? Math.round(chatCoreScopeValue259) : null,
    recordedAt: chatCoreScopeValue258
  };
};
window.imApp.getLastChatApiUsage = function (chatCoreScopeValue263) {
  return window.imApp.normalizeChatApiUsage(chatCoreScopeValue263?.lastChatApiUsage || null);
};
window.imApp.recordLastChatApiUsage = async function (chatCoreScopeValue264, chatCoreScopeValue265, chatCoreScopeValue266 = {}) {
  const chatCoreScopeValue267 = window.imApp.normalizeChatApiUsage(chatCoreScopeValue265, chatCoreScopeValue266);
  if (!chatCoreScopeValue267 || !window.imApp.commitFriendMetaPatch) return false;
  try {
    const chatCoreScopeValue268 = await window.imApp.commitFriendMetaPatch(window.imApp.resolveFriendId(chatCoreScopeValue264), {
      lastChatApiUsage: chatCoreScopeValue267
    }, {
      silent: true
    });
    return chatCoreScopeValue268 && typeof window.CustomEvent === "function" && window.dispatchEvent(new CustomEvent("u2:chat-api-usage-updated", {
      detail: {
        friendId: String(window.imApp.resolveFriendId(chatCoreScopeValue264) || ""),
        usage: chatCoreScopeValue267
      }
    })), chatCoreScopeValue268;
  } catch (chatCoreScopeValue269) {
    return console.warn("[iMessage] Failed to persist actual chat API usage", chatCoreScopeValue269), false;
  }
};
window.imApp.createDefaultLinkedAccountBot = function () {
  return {
    enabled: false,
    intervalSeconds: 60,
    lastRunAt: 0
  };
};
window.imApp.normalizeLinkedAccountBot = function (chatCoreScopeValue270) {
  const chatCoreScopeValue271 = window.imApp.createDefaultLinkedAccountBot(),
    chatCoreScopeValue272 = chatCoreScopeValue270 && typeof chatCoreScopeValue270 === "object" ? chatCoreScopeValue270 : {},
    chatCoreScopeValue273 = Number(chatCoreScopeValue272.intervalSeconds);
  return {
    enabled: !!chatCoreScopeValue272.enabled,
    intervalSeconds: Number.isFinite(chatCoreScopeValue273) ? Math.max(5, Math.min(86400, Math.round(chatCoreScopeValue273))) : chatCoreScopeValue271.intervalSeconds,
    lastRunAt: Number(chatCoreScopeValue272.lastRunAt) || chatCoreScopeValue271.lastRunAt
  };
};
window.imApp.normalizeLinkedAccountChats = function (chatCoreScopeValue274) {
  if (!Array.isArray(chatCoreScopeValue274)) return [];
  return chatCoreScopeValue274.map((chatCoreScopeValue275, chatCoreScopeValue276) => {
    if (!chatCoreScopeValue275 || typeof chatCoreScopeValue275 !== "object") return null;
    const chatCoreScopeValue277 = Array.isArray(chatCoreScopeValue275.messages) ? chatCoreScopeValue275.messages.map((chatCoreScopeValue280, chatCoreScopeValue281) => {
        if (!chatCoreScopeValue280 || typeof chatCoreScopeValue280 !== "object") return null;
        const chatCoreScopeValue282 = typeof chatCoreScopeValue280.text === "string" ? chatCoreScopeValue280.text.trim() : typeof chatCoreScopeValue280.content === "string" ? chatCoreScopeValue280.content.trim() : "";
        if (!chatCoreScopeValue282) return null;
        const chatCoreScopeValue283 = chatCoreScopeValue280.role === "char" ? "char" : "account",
          chatCoreScopeValue284 = Number(chatCoreScopeValue280.timestamp) || Date.now() + chatCoreScopeValue281,
          chatCoreScopeValue285 = {
            id: chatCoreScopeValue280.id || "linked-msg-" + chatCoreScopeValue284 + "-" + chatCoreScopeValue281,
            role: chatCoreScopeValue283,
            text: chatCoreScopeValue282,
            timestamp: chatCoreScopeValue284
          },
          chatCoreScopeValue286 = typeof chatCoreScopeValue280.translation === "string" && chatCoreScopeValue280.translation.trim() ? chatCoreScopeValue280.translation.trim() : typeof chatCoreScopeValue280.translationZh === "string" && chatCoreScopeValue280.translationZh.trim() ? chatCoreScopeValue280.translationZh.trim() : typeof chatCoreScopeValue280.trans === "string" && chatCoreScopeValue280.trans.trim() ? chatCoreScopeValue280.trans.trim() : "";
        if (chatCoreScopeValue286) chatCoreScopeValue285.translation = chatCoreScopeValue286;
        const chatCoreScopeValue287 = Number(chatCoreScopeValue280.round);
        if (Number.isFinite(chatCoreScopeValue287) && chatCoreScopeValue287 > 0) chatCoreScopeValue285.round = chatCoreScopeValue287;
        const chatCoreScopeValue288 = Number(chatCoreScopeValue280.orderInTurn);
        if (Number.isFinite(chatCoreScopeValue288) && chatCoreScopeValue288 >= 0) chatCoreScopeValue285.orderInTurn = chatCoreScopeValue288;
        return chatCoreScopeValue285;
      }).filter(Boolean) : [],
      chatCoreScopeValue278 = Date.now(),
      chatCoreScopeValue279 = Number(chatCoreScopeValue275.updatedAt) || (chatCoreScopeValue277.length > 0 ? chatCoreScopeValue277[chatCoreScopeValue277.length - 1].timestamp : chatCoreScopeValue278);
    return {
      id: chatCoreScopeValue275.id || "linked-chat-" + chatCoreScopeValue279 + "-" + chatCoreScopeValue276,
      name: typeof chatCoreScopeValue275.name === "string" && chatCoreScopeValue275.name.trim() ? chatCoreScopeValue275.name.trim() : "Linked Friend " + (chatCoreScopeValue276 + 1),
      realName: typeof chatCoreScopeValue275.realName === "string" && chatCoreScopeValue275.realName.trim() ? chatCoreScopeValue275.realName.trim() : typeof chatCoreScopeValue275.name === "string" ? chatCoreScopeValue275.name.trim() : "",
      remark: typeof chatCoreScopeValue275.remark === "string" ? chatCoreScopeValue275.remark.trim() : "",
      handle: typeof chatCoreScopeValue275.handle === "string" ? chatCoreScopeValue275.handle.trim() : "",
      persona: typeof chatCoreScopeValue275.persona === "string" ? chatCoreScopeValue275.persona.trim() : "",
      relationship: typeof chatCoreScopeValue275.relationship === "string" ? chatCoreScopeValue275.relationship.trim() : "",
      avatarSeed: typeof chatCoreScopeValue275.avatarSeed === "string" && chatCoreScopeValue275.avatarSeed.trim() ? chatCoreScopeValue275.avatarSeed.trim() : typeof chatCoreScopeValue275.handle === "string" && chatCoreScopeValue275.handle.trim() ? chatCoreScopeValue275.handle.trim() : typeof chatCoreScopeValue275.name === "string" ? chatCoreScopeValue275.name.trim() : "linked-" + chatCoreScopeValue276,
      sourceNpcId: chatCoreScopeValue275.sourceNpcId != null ? String(chatCoreScopeValue275.sourceNpcId) : "",
      messages: chatCoreScopeValue277,
      createdAt: Number(chatCoreScopeValue275.createdAt) || chatCoreScopeValue279,
      updatedAt: chatCoreScopeValue279,
      readAt: Number(chatCoreScopeValue275.readAt) || 0
    };
  }).filter(Boolean);
};
window.imApp.createDefaultXDirectMessageMount = function () {
  return {
    enabled: true,
    limit: 10,
    dmId: ""
  };
};
window.imApp.normalizeMemoryRecallLimits = function (chatCoreScopeValue289) {
  const chatCoreScopeValue290 = chatCoreScopeValue289 && typeof chatCoreScopeValue289 === "object" ? chatCoreScopeValue289 : {},
    chatCoreScopeValue291 = (chatCoreScopeValue292, chatCoreScopeValue293 = 30) => {
      const chatCoreScopeValue294 = Math.round(Number(chatCoreScopeValue292));
      return Number.isFinite(chatCoreScopeValue294) && chatCoreScopeValue294 > 0 ? Math.min(100, Math.max(1, chatCoreScopeValue294)) : chatCoreScopeValue293;
    };
  return {
    shortTerm: chatCoreScopeValue291(chatCoreScopeValue290.shortTerm, 30),
    longTerm: chatCoreScopeValue291(chatCoreScopeValue290.longTerm, 30)
  };
};
window.imApp.normalizeXDirectMessageMount = function (chatCoreScopeValue295) {
  const chatCoreScopeValue296 = window.imApp.createDefaultXDirectMessageMount(),
    chatCoreScopeValue297 = chatCoreScopeValue295 && typeof chatCoreScopeValue295 === "object" && !Array.isArray(chatCoreScopeValue295) ? chatCoreScopeValue295 : {},
    chatCoreScopeValue298 = Number(chatCoreScopeValue297.limit);
  return {
    enabled: chatCoreScopeValue297.enabled !== false,
    limit: Number.isFinite(chatCoreScopeValue298) ? Math.max(1, Math.min(50, Math.floor(chatCoreScopeValue298))) : chatCoreScopeValue296.limit,
    dmId: chatCoreScopeValue297.dmId == null ? "" : String(chatCoreScopeValue297.dmId)
  };
};
window.imApp.normalizeBstagePopMount = function (chatCoreScopeValue299) {
  const chatCoreScopeValue300 = chatCoreScopeValue299 && typeof chatCoreScopeValue299 === "object" && !Array.isArray(chatCoreScopeValue299) ? chatCoreScopeValue299 : {};
  return {
    enabled: chatCoreScopeValue300.enabled === true,
    teamId: chatCoreScopeValue300.teamId == null ? "" : String(chatCoreScopeValue300.teamId),
    memberId: chatCoreScopeValue300.memberId == null ? "" : String(chatCoreScopeValue300.memberId)
  };
};
window.imApp.isCharacterSleeping = function (chatCoreScopeValue301, chatCoreScopeValue302) {
  if (!chatCoreScopeValue301 || !chatCoreScopeValue301.memory || !chatCoreScopeValue301.memory.schedule || !chatCoreScopeValue301.memory.schedule.enabled) return false;
  const chatCoreScopeValue303 = chatCoreScopeValue301.memory.schedule;
  const chatCoreScopeValue304 = chatCoreScopeValue303.sleepTime || "23:00";
  const chatCoreScopeValue305 = chatCoreScopeValue303.wakeTime || "07:00";
  if (chatCoreScopeValue304 === chatCoreScopeValue305) return false;
  const chatCoreScopeValue306 = new Date(chatCoreScopeValue302 == null ? window.imDataUtils?.getChatTimestamp?.(chatCoreScopeValue301, Date.now()) ?? Date.now() : chatCoreScopeValue302);
  const chatCoreScopeValue307 = chatCoreScopeValue306.getHours();
  const chatCoreScopeValue308 = chatCoreScopeValue306.getMinutes();
  const chatCoreScopeValue309 = chatCoreScopeValue307 * 60 + chatCoreScopeValue308;
  const chatCoreScopeValue310 = chatCoreScopeValue313 => {
    const chatCoreScopeValue314 = chatCoreScopeValue313.split(":");
    return parseInt(chatCoreScopeValue314[0], 10) * 60 + parseInt(chatCoreScopeValue314[1], 10);
  };
  const chatCoreScopeValue311 = chatCoreScopeValue310(chatCoreScopeValue304);
  const chatCoreScopeValue312 = chatCoreScopeValue310(chatCoreScopeValue305);
  return chatCoreScopeValue311 < chatCoreScopeValue312 ? chatCoreScopeValue309 >= chatCoreScopeValue311 && chatCoreScopeValue309 < chatCoreScopeValue312 : chatCoreScopeValue309 >= chatCoreScopeValue311 || chatCoreScopeValue309 < chatCoreScopeValue312;
};
window.imApp.normalizeProfileStatusHistory = function (chatCoreScopeValue315 = {}) {
  const chatCoreScopeValue316 = chatCoreScopeValue315?.profilePanel && typeof chatCoreScopeValue315.profilePanel === "object" ? chatCoreScopeValue315.profilePanel : {},
    chatCoreScopeValue317 = Array.isArray(chatCoreScopeValue316.statusHistory) && chatCoreScopeValue316.statusHistory.length > 0,
    chatCoreScopeValue318 = chatCoreScopeValue317 ? chatCoreScopeValue316.statusHistory : Array.isArray(chatCoreScopeValue316.thoughtHistory) ? chatCoreScopeValue316.thoughtHistory : [],
    chatCoreScopeValue319 = String(chatCoreScopeValue316.thought || chatCoreScopeValue315?.latestThought || "").trim(),
    chatCoreScopeValue320 = chatCoreScopeValue318.map((chatCoreScopeValue321, chatCoreScopeValue322) => {
      const chatCoreScopeValue323 = chatCoreScopeValue321 && typeof chatCoreScopeValue321 === "object" ? chatCoreScopeValue321 : {},
        chatCoreScopeValue324 = String(chatCoreScopeValue323.thought ?? chatCoreScopeValue323.content ?? "").trim(),
        chatCoreScopeValue325 = !chatCoreScopeValue317 && chatCoreScopeValue322 === 0 && chatCoreScopeValue324 && chatCoreScopeValue324 === chatCoreScopeValue319,
        chatCoreScopeValue326 = chatCoreScopeValue327 => {
          if (typeof chatCoreScopeValue323[chatCoreScopeValue327] === "number" && Number.isFinite(chatCoreScopeValue323[chatCoreScopeValue327])) return chatCoreScopeValue323[chatCoreScopeValue327];
          if (chatCoreScopeValue325 && typeof chatCoreScopeValue316[chatCoreScopeValue327] === "number" && Number.isFinite(chatCoreScopeValue316[chatCoreScopeValue327])) return chatCoreScopeValue316[chatCoreScopeValue327];
          return null;
        };
      return {
        id: String(chatCoreScopeValue323.id || "status-" + (chatCoreScopeValue323.createdAt || chatCoreScopeValue323.time || chatCoreScopeValue322)),
        thought: chatCoreScopeValue324,
        affection: chatCoreScopeValue326("affection"),
        affectionChange: chatCoreScopeValue326("affectionChange"),
        createdAt: chatCoreScopeValue323.createdAt || chatCoreScopeValue323.time || null,
        legacy: chatCoreScopeValue323.legacy === true || !chatCoreScopeValue317 && !chatCoreScopeValue325
      };
    }).filter(chatCoreScopeValue328 => chatCoreScopeValue328.thought);
  return chatCoreScopeValue320.length === 0 && chatCoreScopeValue319 && chatCoreScopeValue320.push({
    id: "status-current-" + (chatCoreScopeValue315?.id || "friend"),
    thought: chatCoreScopeValue319,
    affection: typeof chatCoreScopeValue316.affection === "number" ? chatCoreScopeValue316.affection : 0,
    affectionChange: typeof chatCoreScopeValue316.affectionChange === "number" ? chatCoreScopeValue316.affectionChange : 0,
    createdAt: null,
    legacy: false
  }), chatCoreScopeValue320;
};
window.imApp.migrateSingleChatProfileStatus = function (chatCoreScopeValue329 = {}) {
  if (!chatCoreScopeValue329 || chatCoreScopeValue329.type === "group") return false;
  const chatCoreScopeValue330 = ["location", "action", "mood", "expression"];
  let chatCoreScopeValue331 = false;
  const chatCoreScopeValue332 = chatCoreScopeValue334 => {
      if (!chatCoreScopeValue334 || typeof chatCoreScopeValue334 !== "object") return;
      chatCoreScopeValue330.forEach(chatCoreScopeValue335 => {
        Object.prototype.hasOwnProperty.call(chatCoreScopeValue334, chatCoreScopeValue335) && (delete chatCoreScopeValue334[chatCoreScopeValue335], chatCoreScopeValue331 = true);
      });
    },
    chatCoreScopeValue333 = chatCoreScopeValue329.profilePanel;
  return chatCoreScopeValue333 && typeof chatCoreScopeValue333 === "object" && (chatCoreScopeValue332(chatCoreScopeValue333), Object.prototype.hasOwnProperty.call(chatCoreScopeValue333, "events") && (delete chatCoreScopeValue333.events, chatCoreScopeValue331 = true), ["statusHistory", "thoughtHistory"].forEach(chatCoreScopeValue336 => {
    if (!Array.isArray(chatCoreScopeValue333[chatCoreScopeValue336])) return;
    chatCoreScopeValue333[chatCoreScopeValue336].forEach(chatCoreScopeValue332);
  })), chatCoreScopeValue331;
};
window.imApp.createDefaultProfilePanel = function (chatCoreScopeValue337 = {}) {
  return window.imApp.migrateSingleChatProfileStatus(chatCoreScopeValue337), {
    thought: chatCoreScopeValue337?.profilePanel?.thought || chatCoreScopeValue337?.latestThought || "",
    affection: typeof chatCoreScopeValue337?.profilePanel?.affection === "number" ? chatCoreScopeValue337.profilePanel.affection : 0,
    affectionChange: typeof chatCoreScopeValue337?.profilePanel?.affectionChange === "number" ? chatCoreScopeValue337.profilePanel.affectionChange : 0,
    status: chatCoreScopeValue337?.profilePanel?.status || chatCoreScopeValue337?.status || "online",
    thoughtHistory: Array.isArray(chatCoreScopeValue337?.profilePanel?.thoughtHistory) ? chatCoreScopeValue337.profilePanel.thoughtHistory : [],
    statusHistory: window.imApp.normalizeProfileStatusHistory(chatCoreScopeValue337)
  };
};
window.imApp.normalizeFavoriteUserMessages = function (chatCoreScopeValue338) {
  const chatCoreScopeValue339 = new Set();
  return (Array.isArray(chatCoreScopeValue338) ? chatCoreScopeValue338 : []).map((chatCoreScopeValue340, chatCoreScopeValue341) => {
    if (!chatCoreScopeValue340 || typeof chatCoreScopeValue340 !== "object") return null;
    const chatCoreScopeValue342 = String(chatCoreScopeValue340.messageId || "").trim(),
      chatCoreScopeValue343 = String(chatCoreScopeValue340.messageText || "").trim(),
      chatCoreScopeValue344 = String(chatCoreScopeValue340.reason || "").trim();
    if (!chatCoreScopeValue342 || !chatCoreScopeValue343 || !chatCoreScopeValue344 || chatCoreScopeValue339.has(chatCoreScopeValue342)) return null;
    chatCoreScopeValue339.add(chatCoreScopeValue342);
    const chatCoreScopeValue345 = Math.max(0, Number(chatCoreScopeValue340.createdAt) || 0),
      chatCoreScopeValue346 = Math.max(0, Number(chatCoreScopeValue340.messageTimestamp) || 0);
    return {
      id: String(chatCoreScopeValue340.id || "favorite-" + chatCoreScopeValue342 + "-" + (chatCoreScopeValue345 || chatCoreScopeValue341)),
      messageId: chatCoreScopeValue342,
      messageText: chatCoreScopeValue343,
      messageType: chatCoreScopeValue340.messageType === "file" ? "file" : chatCoreScopeValue340.messageType === "voice_message" ? "voice_message" : "text",
      ...(chatCoreScopeValue340.messageType === "file" && chatCoreScopeValue340.fileData ? {
        fileData: {
          ...chatCoreScopeValue340.fileData
        }
      } : {}),
      messageTimestamp: chatCoreScopeValue346,
      reason: chatCoreScopeValue344,
      createdAt: chatCoreScopeValue345,
      sourceApiRunId: String(chatCoreScopeValue340.sourceApiRunId || "")
    };
  }).filter(Boolean).sort((chatCoreScopeValue347, chatCoreScopeValue348) => (Number(chatCoreScopeValue348.createdAt) || 0) - (Number(chatCoreScopeValue347.createdAt) || 0));
};
window.imApp.normalizeChatBlockState = function (chatCoreScopeValue349) {
  const chatCoreScopeValue350 = chatCoreScopeValue349 && typeof chatCoreScopeValue349 === "object" ? chatCoreScopeValue349 : {};
  return {
    userBlocksChar: chatCoreScopeValue350.userBlocksChar === true,
    charBlocksUser: chatCoreScopeValue350.charBlocksUser === true,
    userBlockedAt: Math.max(0, Number(chatCoreScopeValue350.userBlockedAt) || 0),
    charBlockedAt: Math.max(0, Number(chatCoreScopeValue350.charBlockedAt) || 0),
    userBlockReason: String(chatCoreScopeValue350.userBlockReason || "").trim().slice(0, 500),
    charBlockReason: String(chatCoreScopeValue350.charBlockReason || "").trim().slice(0, 500)
  };
};
window.imApp.normalizePendingLovesUnbindRequest = function (chatCoreScopeValue351) {
  if (!chatCoreScopeValue351 || typeof chatCoreScopeValue351 !== "object") return null;
  const chatCoreScopeValue352 = String(chatCoreScopeValue351.requestId || chatCoreScopeValue351.id || "").trim(),
    chatCoreScopeValue353 = Math.max(0, Number(chatCoreScopeValue351.createdAt) || 0);
  if (!chatCoreScopeValue352 || !chatCoreScopeValue353 || chatCoreScopeValue351.status !== "pending") return null;
  return {
    requestId: chatCoreScopeValue352,
    createdAt: chatCoreScopeValue353,
    status: "pending"
  };
};
window.imApp.getPendingLovesUnbindRequest = function (chatCoreScopeValue354) {
  const chatCoreScopeValue355 = window.imApp.normalizePendingLovesUnbindRequest(chatCoreScopeValue354?.pendingLovesUnbindRequest);
  if (!chatCoreScopeValue355) return null;
  const chatCoreScopeValue356 = (Array.isArray(chatCoreScopeValue354?.messages) ? chatCoreScopeValue354.messages : []).find(chatCoreScopeValue357 => {
    return chatCoreScopeValue357?.type === "loves_unbind_request" && String(chatCoreScopeValue357.requestId || chatCoreScopeValue357.id || "") === chatCoreScopeValue355.requestId && chatCoreScopeValue357.requestStatus === "pending";
  });
  return chatCoreScopeValue356 || {
    id: chatCoreScopeValue355.requestId,
    requestId: chatCoreScopeValue355.requestId,
    type: "loves_unbind_request",
    role: "user",
    requestStatus: "pending",
    timestamp: chatCoreScopeValue355.createdAt
  };
};
window.imApp.createLovesUnbindRequestMessage = function (chatCoreScopeValue358, chatCoreScopeValue359 = Date.now()) {
  const chatCoreScopeValue360 = String(chatCoreScopeValue358 || "").trim();
  if (!chatCoreScopeValue360) return null;
  return {
    id: chatCoreScopeValue360,
    requestId: chatCoreScopeValue360,
    role: "user",
    type: "loves_unbind_request",
    requestStatus: "pending",
    content: "User 申请解除 Loves 关系",
    text: "申请解除 Loves 关系",
    timestamp: Math.max(0, Number(chatCoreScopeValue359) || Date.now())
  };
};
window.imApp.reconcilePendingLovesUnbindRequest = async function (chatCoreScopeValue361) {
  const chatCoreScopeValue362 = chatCoreScopeValue361?.id ?? chatCoreScopeValue361;
  if (chatCoreScopeValue362 == null) return null;
  let chatCoreScopeValue363 = window.imApp.getFriendById?.(chatCoreScopeValue362) || chatCoreScopeValue361;
  if (!chatCoreScopeValue363 || chatCoreScopeValue363.type === "group" || chatCoreScopeValue363.type === "official") return null;
  window.imApp.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(chatCoreScopeValue363));
  chatCoreScopeValue363 = window.imApp.getFriendById?.(chatCoreScopeValue362) || chatCoreScopeValue363;
  const chatCoreScopeValue364 = window.imApp.normalizePendingLovesUnbindRequest(chatCoreScopeValue363?.pendingLovesUnbindRequest);
  if (!chatCoreScopeValue364) return null;
  const chatCoreScopeValue365 = (Array.isArray(chatCoreScopeValue363.messages) ? chatCoreScopeValue363.messages : []).find(chatCoreScopeValue368 => {
    return chatCoreScopeValue368?.type === "loves_unbind_request" && String(chatCoreScopeValue368.requestId || chatCoreScopeValue368.id || "") === chatCoreScopeValue364.requestId && chatCoreScopeValue368.requestStatus === "pending";
  });
  if (chatCoreScopeValue365) return chatCoreScopeValue365;
  const chatCoreScopeValue366 = window.imApp.createLovesUnbindRequestMessage(chatCoreScopeValue364.requestId, chatCoreScopeValue364.createdAt);
  if (!chatCoreScopeValue366 || !window.imApp.appendFriendMessage) return null;
  const chatCoreScopeValue367 = await window.imApp.appendFriendMessage(chatCoreScopeValue363.id, chatCoreScopeValue366, {
    silent: true
  });
  return chatCoreScopeValue367 ? chatCoreScopeValue366 : null;
};
window.imApp.submitLovesUnbindRequest = async function (chatCoreScopeValue369) {
  const chatCoreScopeValue370 = chatCoreScopeValue369?.id ?? chatCoreScopeValue369;
  let chatCoreScopeValue371 = window.imApp.getFriendById?.(chatCoreScopeValue370) || chatCoreScopeValue369;
  if (!chatCoreScopeValue371 || chatCoreScopeValue371.type === "group" || chatCoreScopeValue371.type === "official" || chatCoreScopeValue371.hasLovesSpace !== true) return null;
  window.imApp.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(chatCoreScopeValue371));
  chatCoreScopeValue371 = window.imApp.getFriendById?.(chatCoreScopeValue370) || chatCoreScopeValue371;
  if (!chatCoreScopeValue371 || chatCoreScopeValue371.type === "group" || chatCoreScopeValue371.type === "official" || chatCoreScopeValue371.hasLovesSpace !== true) return null;
  if (window.imApp.getPendingLovesUnbindRequest(chatCoreScopeValue371)) return null;
  const chatCoreScopeValue372 = Date.now(),
    chatCoreScopeValue373 = window.imChat?.createMessageId ? window.imChat.createMessageId("loves-unbind") : "loves-unbind-" + chatCoreScopeValue372,
    chatCoreScopeValue374 = window.imApp.createLovesUnbindRequestMessage(chatCoreScopeValue373, chatCoreScopeValue372);
  if (!chatCoreScopeValue374) return null;
  let chatCoreScopeValue375 = false;
  const chatCoreScopeValue376 = await window.imApp.commitScopedFriendChange(chatCoreScopeValue371.id, chatCoreScopeValue379 => {
    if (chatCoreScopeValue379.hasLovesSpace !== true || window.imApp.getPendingLovesUnbindRequest(chatCoreScopeValue379)) return;
    if (!Array.isArray(chatCoreScopeValue379.messages)) chatCoreScopeValue379.messages = [];
    chatCoreScopeValue379.pendingLovesUnbindRequest = {
      requestId: chatCoreScopeValue373,
      createdAt: chatCoreScopeValue372,
      status: "pending"
    };
    chatCoreScopeValue379.messages.push(chatCoreScopeValue374);
    chatCoreScopeValue375 = true;
  }, {
    silent: true,
    immediate: true,
    metaOnly: false,
    syncActive: true
  });
  if (!chatCoreScopeValue376 || !chatCoreScopeValue375) return null;
  const chatCoreScopeValue377 = window.imApp.getFriendById?.(chatCoreScopeValue371.id) || chatCoreScopeValue371,
    chatCoreScopeValue378 = document.querySelector("#chat-interface-" + chatCoreScopeValue371.id + " .ins-chat-messages");
  return chatCoreScopeValue378 && window.imChat?.rerenderChatContainer && window.imChat.rerenderChatContainer(chatCoreScopeValue377, chatCoreScopeValue378, {
    scroll: true
  }), chatCoreScopeValue374;
};
window.imApp.resolveLovesUnbindRequest = async function (chatCoreScopeValue380, chatCoreScopeValue381, chatCoreScopeValue382, chatCoreScopeValue383 = {}) {
  const chatCoreScopeValue384 = chatCoreScopeValue380?.id ?? chatCoreScopeValue380;
  let chatCoreScopeValue385 = window.imApp.getFriendById?.(chatCoreScopeValue384) || chatCoreScopeValue380;
  const chatCoreScopeValue386 = String(chatCoreScopeValue381 || "").trim(),
    chatCoreScopeValue387 = chatCoreScopeValue382 === "accept" ? "accept" : chatCoreScopeValue382 === "reject" ? "reject" : "";
  if (!chatCoreScopeValue385 || !chatCoreScopeValue386 || !chatCoreScopeValue387) return false;
  await window.imApp.reconcilePendingLovesUnbindRequest?.(chatCoreScopeValue385);
  chatCoreScopeValue385 = window.imApp.getFriendById?.(chatCoreScopeValue384) || chatCoreScopeValue385;
  if (!chatCoreScopeValue385) return false;
  const chatCoreScopeValue388 = Date.now();
  let chatCoreScopeValue389 = false;
  const chatCoreScopeValue390 = await window.imApp.commitScopedFriendChange(chatCoreScopeValue385.id, chatCoreScopeValue393 => {
    const chatCoreScopeValue394 = window.imApp.normalizePendingLovesUnbindRequest(chatCoreScopeValue393.pendingLovesUnbindRequest),
      chatCoreScopeValue395 = (chatCoreScopeValue393.messages || []).find(chatCoreScopeValue396 => {
        return chatCoreScopeValue396?.type === "loves_unbind_request" && String(chatCoreScopeValue396.requestId || chatCoreScopeValue396.id || "") === chatCoreScopeValue386;
      });
    if (!chatCoreScopeValue394 || chatCoreScopeValue394.requestId !== chatCoreScopeValue386 || !chatCoreScopeValue395 || chatCoreScopeValue395.requestStatus !== "pending") return;
    chatCoreScopeValue395.requestStatus = chatCoreScopeValue387 === "accept" ? "accepted" : "rejected";
    chatCoreScopeValue395.decision = chatCoreScopeValue387;
    chatCoreScopeValue395.decidedAt = chatCoreScopeValue388;
    chatCoreScopeValue393.pendingLovesUnbindRequest = null;
    chatCoreScopeValue387 === "accept" && (chatCoreScopeValue393.hasLovesSpace = false, chatCoreScopeValue393.pendingLovesInvite = false);
    chatCoreScopeValue393.messages.push({
      id: window.imChat?.createMessageId ? window.imChat.createMessageId("loves-unbind-result") : "loves-unbind-result-" + chatCoreScopeValue388,
      requestId: chatCoreScopeValue386,
      role: "assistant",
      type: "loves_unbind_decision",
      decision: chatCoreScopeValue387,
      requestStatus: chatCoreScopeValue387 === "accept" ? "accepted" : "rejected",
      content: chatCoreScopeValue387 === "accept" ? "Char 已同意解绑" : "Char 已拒绝解绑",
      text: chatCoreScopeValue387 === "accept" ? "Char 已同意解绑" : "Char 已拒绝解绑",
      timestamp: chatCoreScopeValue388,
      decidedAt: chatCoreScopeValue388,
      apiRunId: String(chatCoreScopeValue383.apiRunId || "")
    });
    chatCoreScopeValue389 = true;
  }, {
    silent: true,
    immediate: true,
    metaOnly: false,
    syncActive: true
  });
  if (!chatCoreScopeValue390 || !chatCoreScopeValue389) return false;
  const chatCoreScopeValue391 = window.imApp.getFriendById?.(chatCoreScopeValue385.id) || chatCoreScopeValue385,
    chatCoreScopeValue392 = document.querySelector("#chat-interface-" + chatCoreScopeValue385.id + " .ins-chat-messages");
  chatCoreScopeValue392 && window.imChat?.rerenderChatContainer && window.imChat.rerenderChatContainer(chatCoreScopeValue391, chatCoreScopeValue392, {
    scroll: true
  });
  try {
    window.lovesApp?.handleUnbindDecision?.(chatCoreScopeValue391, chatCoreScopeValue387);
  } catch (chatCoreScopeValue397) {
    console.error("[iMessage] Loves failed to handle the unbind decision", chatCoreScopeValue397);
  }
  return true;
};
window.imApp.getPendingUnblockRequest = function (chatCoreScopeValue398, chatCoreScopeValue399) {
  const chatCoreScopeValue400 = chatCoreScopeValue399 === "assistant" ? "assistant" : "user";
  return (Array.isArray(chatCoreScopeValue398?.messages) ? chatCoreScopeValue398.messages : []).slice().reverse().find(chatCoreScopeValue401 => chatCoreScopeValue401?.type === "unblock_request" && chatCoreScopeValue401.requesterRole === chatCoreScopeValue400 && chatCoreScopeValue401.requestStatus === "pending") || null;
};
window.imApp.createChatBlockNotice = function (chatCoreScopeValue402, chatCoreScopeValue403 = Date.now()) {
  const chatCoreScopeValue404 = {
    user_blocked_char: "你已将对方拉黑",
    char_blocked_user: "你已被拉黑",
    user_unblocked_char: "你已解除拉黑",
    char_unblocked_user: "对方已解除拉黑"
  };
  return {
    id: window.imChat?.createMessageId ? window.imChat.createMessageId("notice") : "notice-" + chatCoreScopeValue403,
    role: "system",
    type: "system_notice",
    noticeKind: chatCoreScopeValue402,
    content: chatCoreScopeValue404[chatCoreScopeValue402] || "拉黑状态已更新",
    text: chatCoreScopeValue404[chatCoreScopeValue402] || "拉黑状态已更新",
    timestamp: chatCoreScopeValue403
  };
};
window.imApp.commitChatBlockState = async function (chatCoreScopeValue405, chatCoreScopeValue406, chatCoreScopeValue407, chatCoreScopeValue408 = {}) {
  const chatCoreScopeValue409 = window.imApp.getFriendById?.(chatCoreScopeValue405) || chatCoreScopeValue405;
  if (!chatCoreScopeValue409 || chatCoreScopeValue409.type === "group" || chatCoreScopeValue409.type === "official") return false;
  const chatCoreScopeValue410 = chatCoreScopeValue406 === "userBlocksChar",
    chatCoreScopeValue411 = chatCoreScopeValue410 ? "userBlocksChar" : "charBlocksUser",
    chatCoreScopeValue412 = chatCoreScopeValue410 ? "userBlockedAt" : "charBlockedAt",
    chatCoreScopeValue413 = chatCoreScopeValue410 ? "userBlockReason" : "charBlockReason",
    chatCoreScopeValue414 = chatCoreScopeValue407 ? chatCoreScopeValue410 ? "user_blocked_char" : "char_blocked_user" : chatCoreScopeValue410 ? "user_unblocked_char" : "char_unblocked_user",
    chatCoreScopeValue415 = Date.now(),
    chatCoreScopeValue416 = await window.imApp.commitScopedFriendChange(chatCoreScopeValue409.id, chatCoreScopeValue419 => {
      chatCoreScopeValue419.blockState = window.imApp.normalizeChatBlockState(chatCoreScopeValue419.blockState);
      chatCoreScopeValue419.blockState[chatCoreScopeValue411] = chatCoreScopeValue407 === true;
      chatCoreScopeValue419.blockState[chatCoreScopeValue412] = chatCoreScopeValue407 ? chatCoreScopeValue415 : 0;
      chatCoreScopeValue419.blockState[chatCoreScopeValue413] = chatCoreScopeValue407 ? String(chatCoreScopeValue408.reason || "").trim().slice(0, 500) : "";
      if (!Array.isArray(chatCoreScopeValue419.messages)) chatCoreScopeValue419.messages = [];
      !chatCoreScopeValue407 && chatCoreScopeValue410 && chatCoreScopeValue419.messages.forEach(chatCoreScopeValue421 => {
        chatCoreScopeValue421?.type === "unblock_request" && chatCoreScopeValue421.requesterRole === "assistant" && chatCoreScopeValue421.requestStatus === "pending" && (chatCoreScopeValue421.requestStatus = chatCoreScopeValue408.requestStatus || "resolved", chatCoreScopeValue421.decidedAt = chatCoreScopeValue415, chatCoreScopeValue421.decision = chatCoreScopeValue408.decision || "unblocked");
      });
      !chatCoreScopeValue407 && !chatCoreScopeValue410 && chatCoreScopeValue419.messages.forEach(chatCoreScopeValue422 => {
        chatCoreScopeValue422?.type === "unblock_request" && chatCoreScopeValue422.requesterRole === "user" && chatCoreScopeValue422.requestStatus === "pending" && (chatCoreScopeValue422.requestStatus = chatCoreScopeValue408.requestStatus || "accepted", chatCoreScopeValue422.decidedAt = chatCoreScopeValue415, chatCoreScopeValue422.decision = chatCoreScopeValue408.decision || "accept");
      });
      const chatCoreScopeValue420 = window.imApp.createChatBlockNotice(chatCoreScopeValue414, chatCoreScopeValue415);
      if (chatCoreScopeValue407 && chatCoreScopeValue408.reason) chatCoreScopeValue420.payload = {
        reason: String(chatCoreScopeValue408.reason).trim().slice(0, 500)
      };
      chatCoreScopeValue419.messages.push(chatCoreScopeValue420);
    }, {
      silent: true,
      immediate: true,
      metaOnly: false,
      syncActive: true,
      syncSettings: true
    }),
    chatCoreScopeValue417 = window.imApp.getFriendById?.(chatCoreScopeValue409.id) || chatCoreScopeValue409,
    chatCoreScopeValue418 = document.querySelector("#chat-interface-" + chatCoreScopeValue409.id + " .ins-chat-messages");
  return chatCoreScopeValue416 && chatCoreScopeValue418 && window.imChat?.rerenderChatContainer && window.imChat.rerenderChatContainer(chatCoreScopeValue417, chatCoreScopeValue418, {
    scroll: true
  }), chatCoreScopeValue416;
};
window.imApp.submitUnblockRequest = async function (chatCoreScopeValue423, chatCoreScopeValue424, chatCoreScopeValue425, chatCoreScopeValue426 = {}) {
  const chatCoreScopeValue427 = window.imApp.getFriendById?.(chatCoreScopeValue423) || chatCoreScopeValue423,
    chatCoreScopeValue428 = chatCoreScopeValue424 === "assistant" ? "assistant" : "user",
    chatCoreScopeValue429 = String(chatCoreScopeValue425 || "").trim().slice(0, 500);
  if (!chatCoreScopeValue427 || chatCoreScopeValue427.type === "group" || chatCoreScopeValue427.type === "official" || !chatCoreScopeValue429) return null;
  if (window.imApp.getPendingUnblockRequest(chatCoreScopeValue427, chatCoreScopeValue428)) return null;
  const chatCoreScopeValue430 = Date.now(),
    chatCoreScopeValue431 = {
      id: window.imChat?.createMessageId ? window.imChat.createMessageId("unblock") : "unblock-" + chatCoreScopeValue430,
      role: chatCoreScopeValue428,
      type: "unblock_request",
      requesterRole: chatCoreScopeValue428,
      requestText: chatCoreScopeValue429,
      requestStatus: "pending",
      content: chatCoreScopeValue429,
      timestamp: chatCoreScopeValue430,
      apiRunId: chatCoreScopeValue426.apiRunId || ""
    },
    chatCoreScopeValue432 = await window.imApp.appendFriendMessage(chatCoreScopeValue427.id, chatCoreScopeValue431, {
      silent: true,
      immediate: true
    });
  if (!chatCoreScopeValue432) return null;
  const chatCoreScopeValue433 = window.imApp.getFriendById?.(chatCoreScopeValue427.id) || chatCoreScopeValue427,
    chatCoreScopeValue434 = document.querySelector("#chat-interface-" + chatCoreScopeValue427.id + " .ins-chat-messages");
  return chatCoreScopeValue434 && window.imChat?.rerenderChatContainer && window.imChat.rerenderChatContainer(chatCoreScopeValue433, chatCoreScopeValue434, {
    scroll: true
  }), chatCoreScopeValue431;
};
window.imApp.resolveUnblockRequest = async function (chatCoreScopeValue435, chatCoreScopeValue436, chatCoreScopeValue437) {
  const chatCoreScopeValue438 = window.imApp.getFriendById?.(chatCoreScopeValue435) || chatCoreScopeValue435,
    chatCoreScopeValue439 = chatCoreScopeValue437 === "accept" ? "accept" : chatCoreScopeValue437 === "reject" ? "reject" : "";
  if (!chatCoreScopeValue438 || !chatCoreScopeValue439) return false;
  const chatCoreScopeValue440 = Date.now();
  let chatCoreScopeValue441 = "";
  const chatCoreScopeValue442 = await window.imApp.commitScopedFriendChange(chatCoreScopeValue438.id, chatCoreScopeValue445 => {
    const chatCoreScopeValue446 = (chatCoreScopeValue445.messages || []).find(chatCoreScopeValue447 => String(chatCoreScopeValue447?.id || "") === String(chatCoreScopeValue436));
    if (!chatCoreScopeValue446 || chatCoreScopeValue446.type !== "unblock_request" || chatCoreScopeValue446.requestStatus !== "pending") return;
    chatCoreScopeValue441 = chatCoreScopeValue446.requesterRole;
    chatCoreScopeValue446.requestStatus = chatCoreScopeValue439 === "accept" ? "accepted" : "rejected";
    chatCoreScopeValue446.decision = chatCoreScopeValue439;
    chatCoreScopeValue446.decidedAt = chatCoreScopeValue440;
    if (chatCoreScopeValue439 === "accept") {
      chatCoreScopeValue445.blockState = window.imApp.normalizeChatBlockState(chatCoreScopeValue445.blockState);
      chatCoreScopeValue446.requesterRole === "assistant" ? (chatCoreScopeValue445.blockState.userBlocksChar = false, chatCoreScopeValue445.blockState.userBlockedAt = 0, chatCoreScopeValue445.blockState.userBlockReason = "") : (chatCoreScopeValue445.blockState.charBlocksUser = false, chatCoreScopeValue445.blockState.charBlockedAt = 0, chatCoreScopeValue445.blockState.charBlockReason = "");
      const chatCoreScopeValue448 = chatCoreScopeValue446.requesterRole === "assistant" ? "user_unblocked_char" : "char_unblocked_user";
      chatCoreScopeValue445.messages.push(window.imApp.createChatBlockNotice(chatCoreScopeValue448, chatCoreScopeValue440));
    }
  }, {
    silent: true,
    immediate: true,
    metaOnly: false,
    syncActive: true,
    syncSettings: true
  });
  if (!chatCoreScopeValue442 || !chatCoreScopeValue441) return false;
  const chatCoreScopeValue443 = window.imApp.getFriendById?.(chatCoreScopeValue438.id) || chatCoreScopeValue438,
    chatCoreScopeValue444 = document.querySelector("#chat-interface-" + chatCoreScopeValue438.id + " .ins-chat-messages");
  return chatCoreScopeValue444 && window.imChat?.rerenderChatContainer && window.imChat.rerenderChatContainer(chatCoreScopeValue443, chatCoreScopeValue444, {
    scroll: true
  }), true;
};
window.imApp.createMemoryRequestMessage = function (chatCoreScopeValue449, chatCoreScopeValue450 = {}) {
  const chatCoreScopeValue451 = chatCoreScopeValue449 && typeof chatCoreScopeValue449 === "object" ? chatCoreScopeValue449 : {},
    chatCoreScopeValue452 = (chatCoreScopeValue456, chatCoreScopeValue457 = 1200) => String(chatCoreScopeValue456 || "").trim().slice(0, chatCoreScopeValue457),
    chatCoreScopeValue453 = chatCoreScopeValue452(chatCoreScopeValue451.content, 1800);
  if (!chatCoreScopeValue453) return null;
  const chatCoreScopeValue454 = Number(chatCoreScopeValue450.timestamp) || Date.now(),
    chatCoreScopeValue455 = chatCoreScopeValue452(chatCoreScopeValue450.requestId || (window.imChat?.createMessageId ? window.imChat.createMessageId("memory-request") : "memory-request-" + chatCoreScopeValue454 + "-" + Math.random().toString(36).slice(2, 8)), 160);
  if (!chatCoreScopeValue455) return null;
  return {
    id: chatCoreScopeValue455,
    memoryRequestId: chatCoreScopeValue455,
    role: "assistant",
    type: "memory_request",
    requestStatus: "pending",
    excludedFromContext: true,
    content: chatCoreScopeValue453,
    timestamp: chatCoreScopeValue454,
    apiRunId: String(chatCoreScopeValue450.apiRunId || ""),
    memoryPayload: {
      title: chatCoreScopeValue452(chatCoreScopeValue451.title || "珍视回忆", 120) || "珍视回忆",
      content: chatCoreScopeValue453,
      detail: chatCoreScopeValue452(chatCoreScopeValue451.detail, 1800),
      reason: chatCoreScopeValue452(chatCoreScopeValue451.reason, 1200),
      createdAt: chatCoreScopeValue452(chatCoreScopeValue451.createdAt || chatCoreScopeValue450.createdAt, 120),
      sourceThought: chatCoreScopeValue452(chatCoreScopeValue451.sourceThought, 1800)
    }
  };
};
const chatCoreScopeValue2 = new Set();
window.imApp.resolveMemoryRequest = async function (chatCoreScopeValue458, chatCoreScopeValue459, chatCoreScopeValue460) {
  const chatCoreScopeValue461 = window.imApp.getFriendById?.(chatCoreScopeValue458) || chatCoreScopeValue458,
    chatCoreScopeValue462 = String(chatCoreScopeValue459 || "").trim();
  if (!chatCoreScopeValue461 || chatCoreScopeValue461.type === "group" || !chatCoreScopeValue462 || !["confirm", "cancel"].includes(chatCoreScopeValue460) || !window.imStorage?.commitMemoryRequestDecision) return false;
  const chatCoreScopeValue463 = chatCoreScopeValue461.id + ":" + chatCoreScopeValue462;
  if (chatCoreScopeValue2.has(chatCoreScopeValue463)) return false;
  chatCoreScopeValue2.add(chatCoreScopeValue463);
  try {
    const chatCoreScopeValue464 = async () => {
      const chatCoreScopeValue465 = (Array.isArray(chatCoreScopeValue461.messages) ? chatCoreScopeValue461.messages : []).find(chatCoreScopeValue470 => chatCoreScopeValue470?.type === "memory_request" && String(chatCoreScopeValue470.memoryRequestId || chatCoreScopeValue470.id || "") === chatCoreScopeValue462);
      if (!chatCoreScopeValue465 || chatCoreScopeValue465.requestStatus !== "pending") return false;
      const chatCoreScopeValue466 = chatCoreScopeValue465.memoryPayload && typeof chatCoreScopeValue465.memoryPayload === "object" ? chatCoreScopeValue465.memoryPayload : {},
        chatCoreScopeValue467 = String(chatCoreScopeValue466.content || chatCoreScopeValue465.content || "").trim();
      if (chatCoreScopeValue460 === "confirm" && !chatCoreScopeValue467) return false;
      let chatCoreScopeValue468 = null;
      if (chatCoreScopeValue460 === "confirm") {
        const chatCoreScopeValue471 = chatCoreScopeValue461.memory && typeof chatCoreScopeValue461.memory === "object" ? chatCoreScopeValue461.memory : window.imApp.createDefaultMemory(),
          chatCoreScopeValue472 = {
            id: "cherished-" + chatCoreScopeValue462,
            title: String(chatCoreScopeValue466.title || "珍视回忆").trim() || "珍视回忆",
            content: chatCoreScopeValue467,
            detail: String(chatCoreScopeValue466.detail || "").trim(),
            reason: String(chatCoreScopeValue466.reason || "").trim(),
            sourceEventId: chatCoreScopeValue462,
            createdAt: String(chatCoreScopeValue466.createdAt || "").trim(),
            sourceThought: String(chatCoreScopeValue466.sourceThought || chatCoreScopeValue461.profilePanel?.thought || chatCoreScopeValue461.latestThought || "").trim(),
            triggerKeywords: typeof window.imChat?.normalizeMemoryTriggerKeywords === "function" ? window.imChat.normalizeMemoryTriggerKeywords(chatCoreScopeValue466.triggerKeywords || []) : Array.isArray(chatCoreScopeValue466.triggerKeywords) ? chatCoreScopeValue466.triggerKeywords : []
          },
          chatCoreScopeValue473 = Array.isArray(chatCoreScopeValue471.cherishedEntries) ? chatCoreScopeValue471.cherishedEntries : [],
          chatCoreScopeValue474 = chatCoreScopeValue473.some(chatCoreScopeValue477 => chatCoreScopeValue477 && (String(chatCoreScopeValue477.sourceEventId || "") === chatCoreScopeValue462 || String(chatCoreScopeValue477.content || "").trim() === chatCoreScopeValue472.content)),
          chatCoreScopeValue475 = [chatCoreScopeValue472.title ? "【" + chatCoreScopeValue472.title + "】" : "", chatCoreScopeValue472.content, chatCoreScopeValue472.reason ? "原因：" + chatCoreScopeValue472.reason : ""].filter(Boolean).join(`
`).trim(),
          chatCoreScopeValue476 = String(chatCoreScopeValue471.cherished || "").trim();
        chatCoreScopeValue468 = {
          ...chatCoreScopeValue471,
          cherishedEntries: chatCoreScopeValue474 ? chatCoreScopeValue473 : [...chatCoreScopeValue473, chatCoreScopeValue472],
          cherished: chatCoreScopeValue475 && !chatCoreScopeValue476.includes(chatCoreScopeValue472.content) ? chatCoreScopeValue476 ? chatCoreScopeValue476 + `

` + chatCoreScopeValue475 : chatCoreScopeValue475 : chatCoreScopeValue476
        };
      }
      const chatCoreScopeValue469 = await window.imStorage.commitMemoryRequestDecision(chatCoreScopeValue461.id, chatCoreScopeValue465, chatCoreScopeValue468, chatCoreScopeValue460);
      if (!chatCoreScopeValue469) return false;
      if (chatCoreScopeValue468) {
        chatCoreScopeValue461.memory = chatCoreScopeValue468;
        const chatCoreScopeValue478 = window.imApp.saveState?.pendingFriendPatches?.get(String(chatCoreScopeValue461.id));
        chatCoreScopeValue478 && Object.prototype.hasOwnProperty.call(chatCoreScopeValue478, "memory") && (chatCoreScopeValue478.memory = chatCoreScopeValue468);
      }
      return chatCoreScopeValue465.requestStatus = chatCoreScopeValue469.status, chatCoreScopeValue465.decidedAt = chatCoreScopeValue469.decidedAt, true;
    };
    return window.imApp.runFriendPersistenceTask ? await window.imApp.runFriendPersistenceTask(chatCoreScopeValue461.id, chatCoreScopeValue464) : await chatCoreScopeValue464();
  } catch (chatCoreScopeValue479) {
    return console.error("Failed to resolve memory request", chatCoreScopeValue479), false;
  } finally {
    chatCoreScopeValue2["delete"](chatCoreScopeValue463);
  }
};
window.imApp.normalizeUserPhoneAccess = function (chatCoreScopeValue480) {
  const chatCoreScopeValue481 = chatCoreScopeValue480 && typeof chatCoreScopeValue480 === "object" && !Array.isArray(chatCoreScopeValue480) ? chatCoreScopeValue480 : {},
    chatCoreScopeValue482 = (chatCoreScopeValue489, chatCoreScopeValue490 = 500) => String(chatCoreScopeValue489 || "").trim().slice(0, chatCoreScopeValue490),
    chatCoreScopeValue483 = (chatCoreScopeValue491, chatCoreScopeValue492 = 200) => {
      const chatCoreScopeValue493 = new Set();
      return (Array.isArray(chatCoreScopeValue491) ? chatCoreScopeValue491 : []).map(chatCoreScopeValue494 => chatCoreScopeValue482(chatCoreScopeValue494, 160)).filter(chatCoreScopeValue495 => {
        if (!chatCoreScopeValue495 || chatCoreScopeValue493.has(chatCoreScopeValue495)) return false;
        return chatCoreScopeValue493.add(chatCoreScopeValue495), true;
      }).slice(0, chatCoreScopeValue492);
    },
    chatCoreScopeValue484 = (Array.isArray(chatCoreScopeValue481.privateFindings) ? chatCoreScopeValue481.privateFindings : []).map((chatCoreScopeValue496, chatCoreScopeValue497) => {
      if (!chatCoreScopeValue496 || typeof chatCoreScopeValue496 !== "object") return null;
      const chatCoreScopeValue498 = chatCoreScopeValue483(chatCoreScopeValue496.charIds, 100),
        chatCoreScopeValue499 = chatCoreScopeValue482(chatCoreScopeValue496.summary, 2400);
      if (!chatCoreScopeValue499 || chatCoreScopeValue498.length === 0) return null;
      const chatCoreScopeValue500 = Math.max(0, Number(chatCoreScopeValue496.createdAt) || 0);
      return {
        id: chatCoreScopeValue482(chatCoreScopeValue496.id, 180) || "user-phone-finding-" + (chatCoreScopeValue500 || chatCoreScopeValue497),
        createdAt: chatCoreScopeValue500,
        triggerUserMessageId: chatCoreScopeValue482(chatCoreScopeValue496.triggerUserMessageId, 180),
        apiRunId: chatCoreScopeValue482(chatCoreScopeValue496.apiRunId, 180),
        source: chatCoreScopeValue482(chatCoreScopeValue496.source, 80),
        reason: chatCoreScopeValue482(chatCoreScopeValue496.reason, 300),
        charIds: chatCoreScopeValue498,
        scopeKey: chatCoreScopeValue482(chatCoreScopeValue496.scopeKey, 2000),
        summary: chatCoreScopeValue499,
        timeAssessment: chatCoreScopeValue482(chatCoreScopeValue496.timeAssessment, 1200),
        emotionalReaction: chatCoreScopeValue482(chatCoreScopeValue496.emotionalReaction, 800),
        responseHints: (Array.isArray(chatCoreScopeValue496.responseHints) ? chatCoreScopeValue496.responseHints : []).map(chatCoreScopeValue501 => chatCoreScopeValue482(chatCoreScopeValue501, 500)).filter(Boolean).slice(0, 8)
      };
    }).filter(Boolean).sort((chatCoreScopeValue502, chatCoreScopeValue503) => chatCoreScopeValue502.createdAt - chatCoreScopeValue503.createdAt).slice(-20),
    chatCoreScopeValue485 = (Array.isArray(chatCoreScopeValue481.accessLog) ? chatCoreScopeValue481.accessLog : []).map((chatCoreScopeValue504, chatCoreScopeValue505) => {
      if (!chatCoreScopeValue504 || typeof chatCoreScopeValue504 !== "object") return null;
      const chatCoreScopeValue506 = Math.max(0, Number(chatCoreScopeValue504.createdAt) || 0);
      return {
        id: chatCoreScopeValue482(chatCoreScopeValue504.id, 180) || "user-phone-log-" + (chatCoreScopeValue506 || chatCoreScopeValue505),
        createdAt: chatCoreScopeValue506,
        status: chatCoreScopeValue504.status === "success" ? "success" : "failed",
        mode: chatCoreScopeValue504.mode === "auto" ? "auto" : "chat",
        outcome: ["sent", "silent", "used", "failed"].includes(chatCoreScopeValue504.outcome) ? chatCoreScopeValue504.outcome : chatCoreScopeValue504.status === "success" ? "used" : "failed",
        source: chatCoreScopeValue482(chatCoreScopeValue504.source, 80),
        apiRunId: chatCoreScopeValue482(chatCoreScopeValue504.apiRunId, 180),
        reason: chatCoreScopeValue482(chatCoreScopeValue504.reason, 300),
        contacts: (Array.isArray(chatCoreScopeValue504.contacts) ? chatCoreScopeValue504.contacts : []).map(chatCoreScopeValue507 => ({
          id: chatCoreScopeValue482(chatCoreScopeValue507?.id, 160),
          remark: chatCoreScopeValue482(chatCoreScopeValue507?.remark, 160)
        })).filter(chatCoreScopeValue508 => chatCoreScopeValue508.id || chatCoreScopeValue508.remark).slice(0, 100),
        error: chatCoreScopeValue482(chatCoreScopeValue504.error, 500)
      };
    }).filter(Boolean).sort((chatCoreScopeValue509, chatCoreScopeValue510) => chatCoreScopeValue509.createdAt - chatCoreScopeValue510.createdAt).slice(-50),
    chatCoreScopeValue486 = chatCoreScopeValue481.autoTrigger && typeof chatCoreScopeValue481.autoTrigger === "object" ? chatCoreScopeValue481.autoTrigger : {},
    chatCoreScopeValue487 = ["low", "medium", "high"].includes(chatCoreScopeValue486.frequency) ? chatCoreScopeValue486.frequency : "medium",
    chatCoreScopeValue488 = chatCoreScopeValue481.enabled === true;
  return {
    enabled: chatCoreScopeValue488,
    apiPresetId: chatCoreScopeValue482(chatCoreScopeValue481.apiPresetId, 180),
    allowedCharIds: chatCoreScopeValue483(chatCoreScopeValue481.allowedCharIds, 200),
    autoTrigger: {
      enabled: chatCoreScopeValue488 && chatCoreScopeValue486.enabled === true,
      frequency: chatCoreScopeValue487,
      nextRunAt: chatCoreScopeValue488 && chatCoreScopeValue486.enabled === true ? Math.max(0, Number(chatCoreScopeValue486.nextRunAt) || 0) : 0,
      lastRunAt: Math.max(0, Number(chatCoreScopeValue486.lastRunAt) || 0)
    },
    privateFindings: chatCoreScopeValue484,
    accessLog: chatCoreScopeValue485
  };
};
window.imApp.normalizeFriendData = function (chatCoreScopeValue511) {
  const chatCoreScopeValue512 = {
    ...chatCoreScopeValue511
  };
  chatCoreScopeValue512.lovesData && typeof chatCoreScopeValue512.lovesData === "object" && Object.prototype.hasOwnProperty.call(chatCoreScopeValue512.lovesData, "diaries") && (chatCoreScopeValue512.lovesData = {
    ...chatCoreScopeValue512.lovesData
  }, delete chatCoreScopeValue512.lovesData.diaries);
  chatCoreScopeValue512.id = chatCoreScopeValue512.id != null ? chatCoreScopeValue512.id : Date.now(), chatCoreScopeValue512.type = chatCoreScopeValue512.type || "char";
  const chatCoreScopeValue513 = chatCoreScopeValue512.type === "group",
    chatCoreScopeValue514 = chatCoreScopeValue512.type === "official";
  chatCoreScopeValue512.officialConversationActive = chatCoreScopeValue514 && chatCoreScopeValue512.officialConversationActive === true, chatCoreScopeValue512.officialApiPresetId = chatCoreScopeValue514 ? String(chatCoreScopeValue512.officialApiPresetId || "").trim() : "", chatCoreScopeValue512.realName = chatCoreScopeValue512.realName || "", chatCoreScopeValue512.nickname = chatCoreScopeValue512.nickname || (chatCoreScopeValue512.type === "npc" ? "New NPC" : "New Friend"), chatCoreScopeValue512.signature = chatCoreScopeValue512.signature || "No Signature", chatCoreScopeValue512.persona = chatCoreScopeValue512.persona || "", chatCoreScopeValue512.relationship = typeof chatCoreScopeValue512.relationship === "string" ? chatCoreScopeValue512.relationship.trim() : "", chatCoreScopeValue512.avatarUrl = chatCoreScopeValue512.avatarUrl || null, chatCoreScopeValue512.avatarAssetId = chatCoreScopeValue512.avatarAssetId || null, chatCoreScopeValue512.imageFaceReferenceUrl = chatCoreScopeValue512.imageFaceReferenceUrl || null, chatCoreScopeValue512.imageFaceReferenceAssetId = chatCoreScopeValue512.imageFaceReferenceAssetId || null, chatCoreScopeValue512.imageFaceReferenceFileName = chatCoreScopeValue512.imageFaceReferenceFileName || "";
  const chatCoreScopeValue515 = chatCoreScopeValue512.imagePromptConfig && typeof chatCoreScopeValue512.imagePromptConfig === "object" ? chatCoreScopeValue512.imagePromptConfig : {},
    chatCoreScopeValue516 = new Set(),
    chatCoreScopeValue517 = (Array.isArray(chatCoreScopeValue515.presets) ? chatCoreScopeValue515.presets : []).map((chatCoreScopeValue531, chatCoreScopeValue532) => {
      if (!chatCoreScopeValue531 || typeof chatCoreScopeValue531 !== "object") return null;
      const chatCoreScopeValue533 = String(chatCoreScopeValue531.name || "").trim().slice(0, 80),
        chatCoreScopeValue534 = String(chatCoreScopeValue531.basePrompt ?? chatCoreScopeValue531.prompt ?? "").trim().slice(0, 8000);
      if (!chatCoreScopeValue533 || !chatCoreScopeValue534) return null;
      const chatCoreScopeValue535 = String(chatCoreScopeValue531.id || "image-preset-" + chatCoreScopeValue512.id + "-" + chatCoreScopeValue532).trim();
      if (!chatCoreScopeValue535 || chatCoreScopeValue516.has(chatCoreScopeValue535)) return null;
      chatCoreScopeValue516.add(chatCoreScopeValue535);
      const chatCoreScopeValue536 = Math.max(0, Number(chatCoreScopeValue531.createdAt) || Date.now());
      return {
        id: chatCoreScopeValue535,
        name: chatCoreScopeValue533,
        prompt: chatCoreScopeValue534,
        basePrompt: chatCoreScopeValue534,
        charAppearance: String(chatCoreScopeValue531.charAppearance || "").trim().slice(0, 4000),
        userAppearance: String(chatCoreScopeValue531.userAppearance || "").trim().slice(0, 4000),
        artistPrompt: String(chatCoreScopeValue531.artistPrompt || "").trim().slice(0, 4000),
        negativePrompt: String(chatCoreScopeValue531.negativePrompt || "").trim().slice(0, 4000),
        createdAt: chatCoreScopeValue536,
        updatedAt: Math.max(chatCoreScopeValue536, Number(chatCoreScopeValue531.updatedAt) || chatCoreScopeValue536)
      };
    }).filter(Boolean).slice(0, 30),
    chatCoreScopeValue518 = window.appStorage?.["readDomain"]?.("settings", {})?.["imagePromptPresetLibrary"]?.["presets"] || [],
    chatCoreNewScope527 = chatCoreScopeValue516.has(String(chatCoreScopeValue515.activePresetId || "").trim()) || chatCoreScopeValue518.some(chatCoreNewScope545 => chatCoreNewScope545.id === String(chatCoreScopeValue515.activePresetId || "").trim()) ? String(chatCoreScopeValue515.activePresetId).trim() : "",
    chatCoreScopeValue519 = String(chatCoreScopeValue515.basePrompt ?? chatCoreScopeValue515.lastPrompt ?? "").trim().slice(0, 8000);
  chatCoreScopeValue512.imagePromptConfig = {
    charAppearance: String(chatCoreScopeValue515.charAppearance || "").trim().slice(0, 4000),
    userAppearance: String(chatCoreScopeValue515.userAppearance || "").trim().slice(0, 4000),
    artistPrompt: String(chatCoreScopeValue515.artistPrompt || "").trim().slice(0, 4000),
    negativePrompt: String(chatCoreScopeValue515.negativePrompt || "").trim().slice(0, 4000),
    basePrompt: chatCoreScopeValue519,
    lastPrompt: chatCoreScopeValue519,
    activePresetId: chatCoreNewScope527,
    autoGenerate: chatCoreScopeValue515.autoGenerate === true,
    presets: chatCoreScopeValue517
  };
  chatCoreScopeValue512.messages = Array.isArray(chatCoreScopeValue512.messages) ? chatCoreScopeValue512.messages : [];
  chatCoreScopeValue512.userPhoneAccess = window.imApp.normalizeUserPhoneAccess(chatCoreScopeValue512.userPhoneAccess);
  chatCoreScopeValue512.language = String(chatCoreScopeValue512.language || "zh").trim() || "zh";
  const chatCoreScopeValue520 = window.imDataUtils?.normalizeChatMessageRange ? window.imDataUtils.normalizeChatMessageRange(chatCoreScopeValue512.messageCountMin, chatCoreScopeValue512.messageCountMax, 2, 8) : {
    min: Math.min(20, Math.max(1, Math.round(Number(chatCoreScopeValue512.messageCountMin) || 2))),
    max: Math.min(20, Math.max(1, Math.round(Number(chatCoreScopeValue512.messageCountMax) || 8)))
  };
  chatCoreScopeValue512.messageCountMin = chatCoreScopeValue520.min;
  chatCoreScopeValue512.messageCountMax = Math.max(chatCoreScopeValue520.min, chatCoreScopeValue520.max);
  chatCoreScopeValue512.favoriteUserMessages = window.imApp.normalizeFavoriteUserMessages(chatCoreScopeValue512.favoriteUserMessages);
  chatCoreScopeValue512.anonymousQa = window.imGame?.normalizeAnonymousQaData ? window.imGame.normalizeAnonymousQaData(chatCoreScopeValue512.anonymousQa) : {
    entries: []
  };
  chatCoreScopeValue512.chatBg = chatCoreScopeValue512.chatBg || null;
  chatCoreScopeValue512.chatBgAssetId = chatCoreScopeValue512.chatBgAssetId || null;
  chatCoreScopeValue512.customCssEnabled = !!chatCoreScopeValue512.customCssEnabled;
  chatCoreScopeValue512.customCss = chatCoreScopeValue512.customCss || "";
  chatCoreScopeValue512.chatCssEnabled = !!chatCoreScopeValue512.chatCssEnabled;
  chatCoreScopeValue512.chatCss = chatCoreScopeValue512.chatCss || "";
  chatCoreScopeValue512.statusCssEnabled = !!chatCoreScopeValue512.statusCssEnabled;
  chatCoreScopeValue512.statusCss = chatCoreScopeValue512.statusCss || "";
  chatCoreScopeValue512.statusCssPrompt = chatCoreScopeValue513 ? "" : typeof chatCoreScopeValue512.statusCssPrompt === "string" ? chatCoreScopeValue512.statusCssPrompt : "";
  chatCoreScopeValue512.statusCssAppliedAt = chatCoreScopeValue513 ? 0 : Math.max(0, Number(chatCoreScopeValue512.statusCssAppliedAt) || 0);
  const chatCoreScopeValue521 = String(chatCoreScopeValue512.statusRenderMode || "").trim();
  chatCoreScopeValue512.isPinned = !!chatCoreScopeValue512.isPinned, chatCoreScopeValue512.unreadCount = Math.max(0, Number(chatCoreScopeValue512.unreadCount) || 0), chatCoreScopeValue512.showTimestamp = !!chatCoreScopeValue512.showTimestamp, chatCoreScopeValue512.showEveryMessageAvatar = chatCoreScopeValue512.showEveryMessageAvatar === true, chatCoreScopeValue512.continuousBubbles = chatCoreScopeValue512.continuousBubbles !== false, chatCoreScopeValue512.replyStyle = chatCoreScopeValue512.replyStyle === "outside" ? "outside" : "inside", chatCoreScopeValue512.timeAware = chatCoreScopeValue512.timeAware === true, chatCoreScopeValue512.customTimeEnabled = chatCoreScopeValue512.type === "char" && chatCoreScopeValue512.customTimeEnabled === true, chatCoreScopeValue512.customTimeAnchors = window.imDataUtils?.["normalizeChatTimeAnchors"]?.(chatCoreScopeValue512.customTimeAnchors) || [], chatCoreScopeValue512.autoReplyEnabled = chatCoreScopeValue512.autoReplyEnabled === true, chatCoreScopeValue512.awayReturnEnabled = chatCoreScopeValue512.type === "char" && chatCoreScopeValue512.awayReturnEnabled === true, chatCoreScopeValue512.awayActivity = chatCoreScopeValue512.type === "char" && chatCoreScopeValue512.awayActivity && typeof chatCoreScopeValue512.awayActivity === "object" ? window.imChat?.["awayActivity"] ? window.imChat.awayActivity.normalize(chatCoreScopeValue512.awayActivity) : chatCoreScopeValue512.awayActivity : null, chatCoreScopeValue512.autoReplyDelayEnabled = chatCoreScopeValue512.autoReplyDelayEnabled === true, chatCoreScopeValue512.autoReplyDelaySeconds = Number.isInteger(Number(chatCoreScopeValue512.autoReplyDelaySeconds)) && Number(chatCoreScopeValue512.autoReplyDelaySeconds) >= 1 && Number(chatCoreScopeValue512.autoReplyDelaySeconds) <= 3600 ? Number(chatCoreScopeValue512.autoReplyDelaySeconds) : 3, chatCoreScopeValue512.separateUserAvatarEnabled = chatCoreScopeValue512.separateUserAvatarEnabled === true, chatCoreScopeValue512.userAvatarsByAccount = chatCoreScopeValue512.userAvatarsByAccount && typeof chatCoreScopeValue512.userAvatarsByAccount === "object" && !Array.isArray(chatCoreScopeValue512.userAvatarsByAccount) ? chatCoreScopeValue512.userAvatarsByAccount : {}, chatCoreScopeValue512.locationProfile = window.imDataUtils?.["normalizeLocationProfile"] ? window.imDataUtils.normalizeLocationProfile(chatCoreScopeValue512.locationProfile) : {
    char: {
      country: "",
      city: "",
      timeZone: ""
    },
    user: {
      country: "",
      city: "",
      timeZone: ""
    },
    timeDifferenceEnabled: false,
    weatherAwareEnabled: false,
    longDistanceEnabled: false
  };
  if (chatCoreScopeValue512.timeAware === false) chatCoreScopeValue512.locationProfile.timeDifferenceEnabled = false;
  chatCoreScopeValue512.allowRoleRecall = chatCoreScopeValue512.type === "char" ? chatCoreScopeValue512.allowRoleRecall === true : chatCoreScopeValue512.allowRoleRecall !== false;
  chatCoreScopeValue512.allowCharBlock = !chatCoreScopeValue513 && chatCoreScopeValue512.allowCharBlock === true;
  chatCoreScopeValue512.blockState = chatCoreScopeValue513 ? window.imApp.normalizeChatBlockState(null) : window.imApp.normalizeChatBlockState(chatCoreScopeValue512.blockState);
  chatCoreScopeValue512.pendingLovesUnbindRequest = chatCoreScopeValue513 ? null : window.imApp.normalizePendingLovesUnbindRequest(chatCoreScopeValue512.pendingLovesUnbindRequest);
  chatCoreScopeValue512.thoughtStatusEnabled = chatCoreScopeValue512.thoughtStatusEnabled !== false;
  if (!chatCoreScopeValue513) chatCoreScopeValue512.allowCharCherishedMemory = chatCoreScopeValue512.allowCharCherishedMemory !== false;
  !chatCoreScopeValue513 && chatCoreScopeValue512.messages.forEach(chatCoreScopeValue537 => {
    if (!chatCoreScopeValue537 || typeof chatCoreScopeValue537 !== "object") return;
    if (chatCoreScopeValue537.type === "unblock_request") {
      chatCoreScopeValue537.requesterRole !== "assistant" && chatCoreScopeValue537.requesterRole !== "user" && (chatCoreScopeValue537.requesterRole = chatCoreScopeValue537.role === "assistant" ? "assistant" : "user");
      if (!chatCoreScopeValue537.requestText) chatCoreScopeValue537.requestText = String(chatCoreScopeValue537.content || "").slice(0, 500);
      !["pending", "accepted", "rejected", "resolved"].includes(chatCoreScopeValue537.requestStatus) && (chatCoreScopeValue537.requestStatus = "pending");
      return;
    }
    if (chatCoreScopeValue537.type === "loves_unbind_request") {
      chatCoreScopeValue537.requestId = String(chatCoreScopeValue537.requestId || chatCoreScopeValue537.id || "");
      if (!["pending", "accepted", "rejected"].includes(chatCoreScopeValue537.requestStatus)) chatCoreScopeValue537.requestStatus = "pending";
      return;
    }
    if (chatCoreScopeValue537.type === "loves_unbind_decision") {
      chatCoreScopeValue537.requestId = String(chatCoreScopeValue537.requestId || "");
      chatCoreScopeValue537.decision = chatCoreScopeValue537.decision === "accept" ? "accept" : "reject";
      chatCoreScopeValue537.requestStatus = chatCoreScopeValue537.decision === "accept" ? "accepted" : "rejected";
      return;
    }
    if (chatCoreScopeValue537.type === "together_listening_invite") {
      chatCoreScopeValue537.role = "assistant";
      chatCoreScopeValue537.trackId = String(chatCoreScopeValue537.trackId || "");
      chatCoreScopeValue537.playlistId = String(chatCoreScopeValue537.playlistId || "");
      chatCoreScopeValue537.playlistName = String(chatCoreScopeValue537.playlistName || "未命名歌单");
      chatCoreScopeValue537.title = String(chatCoreScopeValue537.title || "未知歌曲");
      chatCoreScopeValue537.artist = String(chatCoreScopeValue537.artist || "未知歌手");
      chatCoreScopeValue537.inviteStatus = chatCoreScopeValue537.inviteStatus === "accepted" ? "accepted" : "pending";
      return;
    }
    if (chatCoreScopeValue537.type === "offline_invite") {
      const chatCoreScopeValue541 = (chatCoreScopeValue542, chatCoreScopeValue543) => String(chatCoreScopeValue542 || "").replace(/\s+/g, " ").trim().slice(0, chatCoreScopeValue543);
      chatCoreScopeValue537.role = "assistant";
      chatCoreScopeValue537.title = chatCoreScopeValue541(chatCoreScopeValue537.title, 40);
      chatCoreScopeValue537.invitationText = chatCoreScopeValue541(chatCoreScopeValue537.invitationText, 200);
      chatCoreScopeValue537.place = chatCoreScopeValue541(chatCoreScopeValue537.place, 80);
      chatCoreScopeValue537.inviteStatus = ["pending", "accepted", "declined", "superseded"].includes(chatCoreScopeValue537.inviteStatus) ? chatCoreScopeValue537.inviteStatus : "pending";
      chatCoreScopeValue537.respondedAt = Math.max(0, Number(chatCoreScopeValue537.respondedAt) || 0);
      chatCoreScopeValue537.content = "[线下邀请] " + chatCoreScopeValue537.title;
      return;
    }
    if (chatCoreScopeValue537.type === "user_phone_access_card") {
      const chatCoreScopeValue544 = (chatCoreScopeValue546, chatCoreScopeValue547 = 1200) => String(chatCoreScopeValue546 || "").replace(/\s+/g, " ").trim().slice(0, chatCoreScopeValue547);
      const chatCoreScopeValue545 = (Array.isArray(chatCoreScopeValue537.visits) ? chatCoreScopeValue537.visits : []).map(chatCoreScopeValue548 => {
        if (!chatCoreScopeValue548 || typeof chatCoreScopeValue548 !== "object") return null;
        const chatCoreScopeValue549 = chatCoreScopeValue544(chatCoreScopeValue548.charId, 160),
          chatCoreScopeValue550 = chatCoreScopeValue544(chatCoreScopeValue548.remark, 160),
          chatCoreScopeValue551 = String(chatCoreScopeValue548.innerOs || "").replace(/\s+/g, " ").trim(),
          chatCoreScopeValue552 = Math.min(120, Math.max(1, Math.round(Number(chatCoreScopeValue548.durationSeconds) || 1)));
        if (!chatCoreScopeValue549 || !chatCoreScopeValue550 || !chatCoreScopeValue551) return null;
        return {
          charId: chatCoreScopeValue549,
          remark: chatCoreScopeValue550,
          durationSeconds: chatCoreScopeValue552,
          innerOs: chatCoreScopeValue551
        };
      }).filter(Boolean).slice(0, 100);
      chatCoreScopeValue537.role = "assistant";
      chatCoreScopeValue537.content = "查手机记录";
      chatCoreScopeValue537.excludedFromContext = true;
      chatCoreScopeValue537.phoneAccessMode = chatCoreScopeValue537.phoneAccessMode === "auto" ? "auto" : "chat";
      chatCoreScopeValue537.visits = chatCoreScopeValue545;
      chatCoreScopeValue537.totalDurationSeconds = chatCoreScopeValue545.reduce((chatCoreScopeValue553, chatCoreScopeValue554) => chatCoreScopeValue553 + chatCoreScopeValue554.durationSeconds, 0);
      chatCoreScopeValue537.apiRunId = chatCoreScopeValue544(chatCoreScopeValue537.apiRunId, 180);
      return;
    }
    if (chatCoreScopeValue537.type === "system_notice" && ["user_phone_access", "user_remark_changed", "relationship_changed"].includes(chatCoreScopeValue537.noticeKind)) {
      chatCoreScopeValue537.role = "system";
      chatCoreScopeValue537.excludedFromContext = true;
      chatCoreScopeValue537.apiRunId = String(chatCoreScopeValue537.apiRunId || "").trim().slice(0, 180);
      return;
    }
    if (chatCoreScopeValue537.type === "memory_request") {
      const chatCoreScopeValue555 = (chatCoreScopeValue559, chatCoreScopeValue560 = 1200) => String(chatCoreScopeValue559 || "").trim().slice(0, chatCoreScopeValue560);
      const chatCoreScopeValue556 = chatCoreScopeValue537.memoryPayload && typeof chatCoreScopeValue537.memoryPayload === "object" ? chatCoreScopeValue537.memoryPayload : {};
      const chatCoreScopeValue557 = chatCoreScopeValue555(chatCoreScopeValue537.memoryRequestId || chatCoreScopeValue537.id || "memory-request-" + (chatCoreScopeValue537.timestamp || 0), 160);
      const chatCoreScopeValue558 = chatCoreScopeValue555(chatCoreScopeValue556.content || chatCoreScopeValue537.requestText || chatCoreScopeValue537.content, 1800);
      chatCoreScopeValue537.role = "assistant";
      chatCoreScopeValue537.excludedFromContext = true;
      chatCoreScopeValue537.memoryRequestId = chatCoreScopeValue557;
      chatCoreScopeValue537.requestStatus = ["pending", "confirmed", "cancelled"].includes(chatCoreScopeValue537.requestStatus) ? chatCoreScopeValue537.requestStatus : Array.isArray(chatCoreScopeValue512.memory?.cherishedEntries) && chatCoreScopeValue512.memory.cherishedEntries.some(chatCoreScopeValue561 => String(chatCoreScopeValue561?.sourceEventId || "") === chatCoreScopeValue557) ? "confirmed" : "pending";
      chatCoreScopeValue537.memoryPayload = {
        title: chatCoreScopeValue555(chatCoreScopeValue556.title || "珍视回忆", 120) || "珍视回忆",
        content: chatCoreScopeValue558,
        detail: chatCoreScopeValue555(chatCoreScopeValue556.detail, 1800),
        reason: chatCoreScopeValue555(chatCoreScopeValue556.reason, 1200),
        createdAt: chatCoreScopeValue555(chatCoreScopeValue556.createdAt || chatCoreScopeValue537.requestTime, 120),
        sourceThought: chatCoreScopeValue555(chatCoreScopeValue556.sourceThought, 1800),
        triggerKeywords: Array.isArray(chatCoreScopeValue556.triggerKeywords) ? chatCoreScopeValue556.triggerKeywords.map(chatCoreScopeValue562 => chatCoreScopeValue555(chatCoreScopeValue562, 32)).filter(Boolean).slice(0, 6) : []
      };
      return;
    }
    if (chatCoreScopeValue537.type === "system_notice" || chatCoreScopeValue537.type && chatCoreScopeValue537.type !== "text") return;
    const chatCoreScopeValue538 = Number(chatCoreScopeValue537.timestamp) || 0;
    const chatCoreScopeValue539 = chatCoreScopeValue537.role === "user" && chatCoreScopeValue512.blockState.charBlocksUser === true && chatCoreScopeValue512.blockState.charBlockedAt > 0 && chatCoreScopeValue538 >= chatCoreScopeValue512.blockState.charBlockedAt;
    const chatCoreScopeValue540 = chatCoreScopeValue537.role === "assistant" && chatCoreScopeValue512.blockState.userBlocksChar === true && chatCoreScopeValue512.blockState.userBlockedAt > 0 && chatCoreScopeValue538 >= chatCoreScopeValue512.blockState.userBlockedAt;
    chatCoreScopeValue537.deliveryStatus !== "blocked" && (chatCoreScopeValue539 || chatCoreScopeValue540) && (chatCoreScopeValue537.deliveryStatus = "blocked", chatCoreScopeValue537.excludedFromContext = true, chatCoreScopeValue537.blockedDirection = chatCoreScopeValue539 ? "char_blocks_user" : "user_blocks_char");
  });
  chatCoreScopeValue512.allowGroupMemberPrivateChats = chatCoreScopeValue513 && chatCoreScopeValue512.allowGroupMemberPrivateChats !== false;
  chatCoreScopeValue512.allowGroupMemberFriendPrivateChats = chatCoreScopeValue513 && chatCoreScopeValue512.allowGroupMemberFriendPrivateChats !== false;
  chatCoreScopeValue512.autoExpandTranslation = chatCoreScopeValue512.autoExpandTranslation === true;
  chatCoreScopeValue512.showGroupUserAvatar = chatCoreScopeValue513 && chatCoreScopeValue512.showGroupUserAvatar === true;
  chatCoreScopeValue512.onlinePromptPresetId = typeof chatCoreScopeValue512.onlinePromptPresetId === "string" ? chatCoreScopeValue512.onlinePromptPresetId.trim() : "";
  chatCoreScopeValue512.builtinLivingVibeEnabled = chatCoreScopeValue512.builtinLivingVibeEnabled !== false;
  chatCoreScopeValue512.builtinPunctuationEnabled = typeof chatCoreScopeValue512.builtinPunctuationEnabled === "boolean" ? chatCoreScopeValue512.builtinPunctuationEnabled : chatCoreScopeValue512.builtinLivingVibeEnabled;
  const chatCoreScopeValue523 = Number(chatCoreScopeValue512.cotDefaultVersion) || 0;
  chatCoreScopeValue512.cotEnabled = chatCoreScopeValue523 >= 2 && chatCoreScopeValue512.cotEnabled === true;
  chatCoreScopeValue512.cotDefaultVersion = 2;
  chatCoreScopeValue512.cotPrompt = typeof chatCoreScopeValue512.cotPrompt === "string" ? chatCoreScopeValue512.cotPrompt : "";
  chatCoreScopeValue512.statusPromptEnabled = chatCoreScopeValue512.statusPromptEnabled === true;
  chatCoreScopeValue512.statusPrompt = typeof chatCoreScopeValue512.statusPrompt === "string" ? chatCoreScopeValue512.statusPrompt : "";
  chatCoreScopeValue512.statusPrompt.trim() === "生成角色此刻没有说出口的心声。内容贴合本轮聊天、人设、关系进展和已绑定世界书。" && (chatCoreScopeValue512.statusPrompt = window.imApp.DEFAULT_STATUS_PROMPT);
  chatCoreScopeValue512.statusPromptEnabled && !chatCoreScopeValue512.statusPrompt.trim() && (chatCoreScopeValue512.statusPrompt = window.imApp.DEFAULT_STATUS_PROMPT);
  const chatCoreScopeValue524 = chatCoreScopeValue512.statusTemplate && typeof chatCoreScopeValue512.statusTemplate === "object";
  if (chatCoreScopeValue513) {
    chatCoreScopeValue512.statusTemplate = null;
    delete chatCoreScopeValue512._statusTemplateNeedsPersistence;
  } else {
    if (chatCoreScopeValue524) {
      chatCoreScopeValue512.statusTemplate = window.imApp.createDefaultStatusTemplate(chatCoreScopeValue512.statusTemplate);
      chatCoreScopeValue512._statusTemplateNeedsPersistence = chatCoreScopeValue512._statusTemplateNeedsPersistence === true;
    } else chatCoreScopeValue512.statusPromptEnabled && chatCoreScopeValue512.statusPrompt.trim() ? (chatCoreScopeValue512.statusTemplate = window.imApp.createDefaultStatusTemplate({
      enabled: true,
      prompt: chatCoreScopeValue512.statusPrompt
    }), chatCoreScopeValue512._statusTemplateNeedsPersistence = true) : (chatCoreScopeValue512.statusTemplate = window.imApp.createDefaultStatusTemplate(), delete chatCoreScopeValue512._statusTemplateNeedsPersistence);
  }
  if (chatCoreScopeValue513) chatCoreScopeValue512.statusRenderMode = "default";else {
    if (["template", "css", "default"].includes(chatCoreScopeValue521)) chatCoreScopeValue512.statusRenderMode = chatCoreScopeValue521;else {
      if (chatCoreScopeValue512.statusTemplate?.enabled === true) chatCoreScopeValue512.statusRenderMode = "template";else chatCoreScopeValue512.statusCssEnabled && String(chatCoreScopeValue512.statusCss || "").trim() ? chatCoreScopeValue512.statusRenderMode = "css" : chatCoreScopeValue512.statusRenderMode = "default";
    }
  }
  chatCoreScopeValue512.offlineStreamEnabled = chatCoreScopeValue512.offlineStreamEnabled !== false;
  chatCoreScopeValue512.offlineApiPresetId = String(chatCoreScopeValue512.offlineApiPresetId || "").trim();
  chatCoreScopeValue512.offlineEpisodeMode = chatCoreScopeValue512.offlineEpisodeMode === true;
  chatCoreScopeValue512.offlineAutoImageGeneration = !chatCoreScopeValue513 && chatCoreScopeValue512.offlineAutoImageGeneration === true;
  chatCoreScopeValue512.offlineRequestReasoning = true;
  chatCoreScopeValue512.offlineMaxResponseTokens = 30000;
  chatCoreScopeValue512.offlineMaxResponseTokensVersion = 2;
  chatCoreScopeValue512.dynamicActionNarrationEnabled = !!chatCoreScopeValue512.dynamicActionNarrationEnabled;
  chatCoreScopeValue512.timestampPosition = chatCoreScopeValue512.timestampPosition === "outside" ? "outside" : "inside";
  chatCoreScopeValue512.boundBooks = Array.isArray(chatCoreScopeValue512.boundBooks) ? chatCoreScopeValue512.boundBooks : [];
  chatCoreScopeValue512.momentsCover = chatCoreScopeValue512.momentsCover || null;
  chatCoreScopeValue512.momentsCoverAssetId = chatCoreScopeValue512.momentsCoverAssetId || null;
  chatCoreScopeValue512.members = Array.isArray(chatCoreScopeValue512.members) ? chatCoreScopeValue512.members : [];
  chatCoreScopeValue513 && window.imApp.normalizeGroupTitleData && window.imApp.normalizeGroupTitleData(chatCoreScopeValue512);
  chatCoreScopeValue512.leftGroupAt = chatCoreScopeValue513 ? Number(chatCoreScopeValue512.leftGroupAt) || 0 : 0;
  chatCoreScopeValue512.groupObserverMode = chatCoreScopeValue513 && chatCoreScopeValue512.groupObserverMode === true && chatCoreScopeValue512.leftGroupAt > 0;
  chatCoreScopeValue512.leftGroupMemberSnapshot = chatCoreScopeValue513 && Array.isArray(chatCoreScopeValue512.leftGroupMemberSnapshot) ? chatCoreScopeValue512.leftGroupMemberSnapshot.filter(chatCoreScopeValue563 => chatCoreScopeValue563 && chatCoreScopeValue563.id != null).map(chatCoreScopeValue564 => ({
    id: chatCoreScopeValue564.id,
    nickname: chatCoreScopeValue564.nickname || "",
    realName: chatCoreScopeValue564.realName || ""
  })) : [];
  chatCoreScopeValue512.memberProfiles = chatCoreScopeValue511.memberProfiles && typeof chatCoreScopeValue511.memberProfiles === "object" ? chatCoreScopeValue511.memberProfiles : {};
  chatCoreScopeValue512.botEnabled = !!chatCoreScopeValue512.botEnabled;
  delete chatCoreScopeValue512.offlineRegexScripts;
  chatCoreScopeValue512.offlineSummarySettings = {
    apiPresetId: String(chatCoreScopeValue512.offlineSummarySettings?.apiPresetId || "").trim(),
    prompt: String(chatCoreScopeValue512.offlineSummarySettings?.prompt || "").trim().slice(0, 12000)
  };
  chatCoreScopeValue512.linkedAccountBot = window.imApp.normalizeLinkedAccountBot(chatCoreScopeValue512.linkedAccountBot);
  chatCoreScopeValue512.linkedAccountChats = window.imApp.normalizeLinkedAccountChats(chatCoreScopeValue512.linkedAccountChats);
  !chatCoreScopeValue513 && chatCoreScopeValue512.profilePanel && typeof chatCoreScopeValue512.profilePanel === "object" && (chatCoreScopeValue512.profilePanel = {
    ...chatCoreScopeValue512.profilePanel,
    statusHistory: Array.isArray(chatCoreScopeValue512.profilePanel.statusHistory) ? chatCoreScopeValue512.profilePanel.statusHistory.map(chatCoreScopeValue565 => chatCoreScopeValue565 && typeof chatCoreScopeValue565 === "object" ? {
      ...chatCoreScopeValue565
    } : chatCoreScopeValue565) : chatCoreScopeValue512.profilePanel.statusHistory,
    thoughtHistory: Array.isArray(chatCoreScopeValue512.profilePanel.thoughtHistory) ? chatCoreScopeValue512.profilePanel.thoughtHistory.map(chatCoreScopeValue566 => chatCoreScopeValue566 && typeof chatCoreScopeValue566 === "object" ? {
      ...chatCoreScopeValue566
    } : chatCoreScopeValue566) : chatCoreScopeValue512.profilePanel.thoughtHistory
  }, window.imApp.migrateSingleChatProfileStatus(chatCoreScopeValue512) && (chatCoreScopeValue512._profileStatusNeedsPersistence = true));
  chatCoreScopeValue512.profilePanel = window.imApp.createDefaultProfilePanel(chatCoreScopeValue512);
  chatCoreScopeValue512.latestThought = chatCoreScopeValue512.profilePanel.thought;
  chatCoreScopeValue512.status = chatCoreScopeValue512.profilePanel.status || chatCoreScopeValue512.status || "online";
  const chatCoreScopeValue525 = window.imApp.createDefaultMemory();
  const chatCoreScopeValue526 = chatCoreScopeValue512.memory || {};
  const chatCoreScopeValue527 = chatCoreScopeValue526.recallPresentation && typeof chatCoreScopeValue526.recallPresentation === "object" ? chatCoreScopeValue526.recallPresentation : null;
  const chatCoreScopeValue528 = chatCoreScopeValue567 => (Array.isArray(chatCoreScopeValue567) ? chatCoreScopeValue567 : []).filter(chatCoreScopeValue568 => chatCoreScopeValue568 && typeof chatCoreScopeValue568 === "object").map(chatCoreScopeValue569 => ({
    ...chatCoreScopeValue569
  }));
  const chatCoreScopeValue529 = chatCoreScopeValue527 && chatCoreScopeValue527.apiRunId && chatCoreScopeValue527.recall && typeof chatCoreScopeValue527.recall === "object" ? {
    apiRunId: String(chatCoreScopeValue527.apiRunId),
    triggerUserMessageId: String(chatCoreScopeValue527.triggerUserMessageId || ""),
    createdAt: Number(chatCoreScopeValue527.createdAt) || 0,
    recall: {
      friendId: String(chatCoreScopeValue527.recall.friendId || chatCoreScopeValue512.id || ""),
      isGroupChat: !!chatCoreScopeValue527.recall.isGroupChat,
      shortTermEntries: chatCoreScopeValue528(chatCoreScopeValue527.recall.shortTermEntries),
      longTermEntries: chatCoreScopeValue528(chatCoreScopeValue527.recall.longTermEntries),
      cherishedEntries: chatCoreScopeValue528(chatCoreScopeValue527.recall.cherishedEntries)
    }
  } : null;
  const chatCoreScopeValue530 = window.imDataUtils?.normalizeSchedule ? window.imDataUtils.normalizeSchedule(chatCoreScopeValue526.schedule) : {
    enabled: !!chatCoreScopeValue526.schedule?.enabled,
    sleepTime: chatCoreScopeValue526.schedule?.sleepTime || chatCoreScopeValue525.schedule.sleepTime,
    wakeTime: chatCoreScopeValue526.schedule?.wakeTime || chatCoreScopeValue525.schedule.wakeTime,
    events: Array.isArray(chatCoreScopeValue526.schedule?.events) ? chatCoreScopeValue526.schedule.events : []
  };
  chatCoreScopeValue512.memory = {
    overview: chatCoreScopeValue526.overview || chatCoreScopeValue525.overview,
    anniversaries: chatCoreScopeValue526.anniversaries || chatCoreScopeValue525.anniversaries,
    schedule: chatCoreScopeValue530,
    context: {
      enabled: typeof chatCoreScopeValue526.context?.enabled === "boolean" ? chatCoreScopeValue526.context.enabled : chatCoreScopeValue525.context.enabled,
      limit: Number(chatCoreScopeValue526.context?.limit) > 0 ? Number(chatCoreScopeValue526.context.limit) : chatCoreScopeValue513 ? 100 : chatCoreScopeValue525.context.limit,
      notes: chatCoreScopeValue526.context?.notes || chatCoreScopeValue525.context.notes
    },
    recallLimits: window.imApp.normalizeMemoryRecallLimits(chatCoreScopeValue526.recallLimits),
    summary: {
      enabled: typeof chatCoreScopeValue526.summary?.enabled === "boolean" ? chatCoreScopeValue526.summary.enabled : chatCoreScopeValue525.summary.enabled,
      limit: Number(chatCoreScopeValue526.summary?.limit) > 0 ? Number(chatCoreScopeValue526.summary.limit) : chatCoreScopeValue525.summary.limit,
      roundLimit: window.imDataUtils?.normalizeRoundLimit ? window.imDataUtils.normalizeRoundLimit(chatCoreScopeValue526.summary?.roundLimit, chatCoreScopeValue525.summary.roundLimit) : Number(chatCoreScopeValue526.summary?.roundLimit) > 0 ? Math.round(Number(chatCoreScopeValue526.summary.roundLimit)) : chatCoreScopeValue525.summary.roundLimit,
      prompt: chatCoreScopeValue526.summary?.prompt || chatCoreScopeValue525.summary.prompt,
      apiPresetId: String(chatCoreScopeValue526.summary?.apiPresetId || chatCoreScopeValue525.summary.apiPresetId || "")
    },
    autonomous: window.imApp.normalizeAutonomousActivity(chatCoreScopeValue526.autonomous),
    longTerm: chatCoreScopeValue526.longTerm || chatCoreScopeValue525.longTerm,
    shortTermEntries: Array.isArray(chatCoreScopeValue526.shortTermEntries) ? chatCoreScopeValue526.shortTermEntries.map((chatCoreScopeValue570, chatCoreScopeValue571) => ({
      id: chatCoreScopeValue570?.id != null ? chatCoreScopeValue570.id : "shortterm-" + chatCoreScopeValue571,
      title: chatCoreScopeValue570?.title || "对话总结",
      time: chatCoreScopeValue570?.time || chatCoreScopeValue570?.createdAt || "",
      event: chatCoreScopeValue570?.event || chatCoreScopeValue570?.content || "",
      memoryPoints: chatCoreScopeValue570?.memoryPoints || chatCoreScopeValue570?.points || "",
      memoryTags: Array.isArray(chatCoreScopeValue570?.memoryTags) ? chatCoreScopeValue570.memoryTags.map(chatCoreScopeValue572 => String(chatCoreScopeValue572 || "").trim()).filter(Boolean) : [],
      degree: chatCoreScopeValue570?.degree || "高",
      lastActivatedAt: chatCoreScopeValue570?.lastActivatedAt || chatCoreScopeValue570?.activatedAt || chatCoreScopeValue570?.time || chatCoreScopeValue570?.createdAt || "",
      triggerKeywords: Array.isArray(chatCoreScopeValue570?.triggerKeywords) ? chatCoreScopeValue570.triggerKeywords.map(chatCoreScopeValue573 => String(chatCoreScopeValue573 || "").trim()).filter(Boolean) : Array.isArray(chatCoreScopeValue570?.memoryTags) ? chatCoreScopeValue570.memoryTags.map(chatCoreScopeValue574 => String(chatCoreScopeValue574 || "").trim()).filter(Boolean) : chatCoreScopeValue570?.keyword ? [String(chatCoreScopeValue570.keyword).trim()] : [],
      sourceType: String(chatCoreScopeValue570?.sourceType || "").trim(),
      sourceId: String(chatCoreScopeValue570?.sourceId || "").trim(),
      raw: chatCoreScopeValue570?.raw || "",
      sourceCount: Math.max(0, Number(chatCoreScopeValue570?.sourceCount) || 0),
      sourceRoundCount: Math.max(0, Number(chatCoreScopeValue570?.sourceRoundCount) || 0),
      sourceStartMessageCount: Math.max(0, Number(chatCoreScopeValue570?.sourceStartMessageCount) || 0),
      sourceEndMessageCount: Math.max(0, Number(chatCoreScopeValue570?.sourceEndMessageCount) || 0),
      sourceStartMessageId: String(chatCoreScopeValue570?.sourceStartMessageId || "").trim(),
      sourceEndMessageId: String(chatCoreScopeValue570?.sourceEndMessageId || "").trim(),
      sourceStartMessageOrder: Number.isFinite(Number(chatCoreScopeValue570?.sourceStartMessageOrder)) ? Number(chatCoreScopeValue570.sourceStartMessageOrder) : -1,
      sourceEndMessageOrder: Number.isFinite(Number(chatCoreScopeValue570?.sourceEndMessageOrder)) ? Number(chatCoreScopeValue570.sourceEndMessageOrder) : -1,
      sourceMessageIds: Array.isArray(chatCoreScopeValue570?.sourceMessageIds) ? chatCoreScopeValue570.sourceMessageIds.map(chatCoreScopeValue575 => String(chatCoreScopeValue575 || "").trim()).filter(Boolean) : [],
      sourceRoundLimit: Math.max(0, Number(chatCoreScopeValue570?.sourceRoundLimit) || 0)
    })) : chatCoreScopeValue525.shortTermEntries,
    groupChatContexts: window.imDataUtils?.normalizeGroupChatContexts ? window.imDataUtils.normalizeGroupChatContexts(chatCoreScopeValue526.groupChatContexts) : chatCoreScopeValue525.groupChatContexts,
    longTermEntries: Array.isArray(chatCoreScopeValue526.longTermEntries) ? chatCoreScopeValue526.longTermEntries.map((chatCoreScopeValue576, chatCoreScopeValue577) => ({
      id: chatCoreScopeValue576?.id != null ? chatCoreScopeValue576.id : "longterm-" + chatCoreScopeValue577,
      title: chatCoreScopeValue576?.title || "长期记忆",
      content: chatCoreScopeValue576?.content || "",
      createdAt: chatCoreScopeValue576?.createdAt || chatCoreScopeValue576?.time || "",
      time: chatCoreScopeValue576?.time || chatCoreScopeValue576?.createdAt || "",
      sourceType: String(chatCoreScopeValue576?.sourceType || "").trim(),
      sourceId: String(chatCoreScopeValue576?.sourceId || "").trim(),
      triggerKeywords: Array.isArray(chatCoreScopeValue576?.triggerKeywords) ? chatCoreScopeValue576.triggerKeywords.map(chatCoreScopeValue578 => String(chatCoreScopeValue578 || "").trim()).filter(Boolean) : chatCoreScopeValue576?.keyword ? [String(chatCoreScopeValue576.keyword).trim()] : []
    })) : chatCoreScopeValue525.longTermEntries,
    lastSummaryMessageCount: typeof chatCoreScopeValue526.lastSummaryMessageCount === "number" ? chatCoreScopeValue526.lastSummaryMessageCount : 0,
    summaryCursor: (() => {
      const chatCoreScopeValue579 = Math.max(0, Number(chatCoreScopeValue526.lastSummaryMessageCount) || 0),
        chatCoreScopeValue580 = chatCoreScopeValue526.summaryCursor && typeof chatCoreScopeValue526.summaryCursor === "object" ? chatCoreScopeValue526.summaryCursor : {};
      return {
        messageId: String(chatCoreScopeValue580.messageId || "").trim(),
        order: Number.isFinite(Number(chatCoreScopeValue580.order)) ? Number(chatCoreScopeValue580.order) : -1,
        count: Math.max(0, Number.isFinite(Number(chatCoreScopeValue580.count)) ? Number(chatCoreScopeValue580.count) : chatCoreScopeValue579)
      };
    })(),
    cherished: chatCoreScopeValue526.cherished || chatCoreScopeValue525.cherished,
    cherishedEntries: Array.isArray(chatCoreScopeValue526.cherishedEntries) ? chatCoreScopeValue526.cherishedEntries.map((chatCoreScopeValue581, chatCoreScopeValue582) => ({
      id: chatCoreScopeValue581?.id != null ? chatCoreScopeValue581.id : "cherished-" + chatCoreScopeValue582,
      title: chatCoreScopeValue581?.title || "长期记忆",
      content: chatCoreScopeValue581?.content || "",
      detail: chatCoreScopeValue581?.detail || "",
      reason: chatCoreScopeValue581?.reason || "",
      sourceEventId: chatCoreScopeValue581?.sourceEventId || "",
      createdAt: chatCoreScopeValue581?.createdAt || "",
      sourceThought: chatCoreScopeValue581?.sourceThought || "",
      triggerKeywords: Array.isArray(chatCoreScopeValue581?.triggerKeywords) ? chatCoreScopeValue581.triggerKeywords.map(chatCoreScopeValue583 => String(chatCoreScopeValue583 || "").trim()).filter(Boolean) : chatCoreScopeValue581?.keyword ? [String(chatCoreScopeValue581.keyword).trim()] : []
    })) : chatCoreScopeValue525.cherishedEntries,
    relationships: Array.isArray(chatCoreScopeValue526.relationships) ? chatCoreScopeValue526.relationships : chatCoreScopeValue525.relationships,
    xDirectMessageMount: window.imApp.normalizeXDirectMessageMount(chatCoreScopeValue526.xDirectMessageMount),
    bstagePopMount: window.imApp.normalizeBstagePopMount(chatCoreScopeValue526.bstagePopMount),
    recallPresentation: chatCoreScopeValue529,
    userOverride: chatCoreScopeValue526.userOverride || null,
    mountSettings: chatCoreScopeValue526.mountSettings && typeof chatCoreScopeValue526.mountSettings === "object" && !Array.isArray(chatCoreScopeValue526.mountSettings) ? {
      ...chatCoreScopeValue526.mountSettings
    } : chatCoreScopeValue525.mountSettings,
    mountLimits: chatCoreScopeValue526.mountLimits && typeof chatCoreScopeValue526.mountLimits === "object" && !Array.isArray(chatCoreScopeValue526.mountLimits) ? Object.fromEntries(Object.entries(chatCoreScopeValue526.mountLimits).map(([chatCoreScopeValue584, chatCoreScopeValue585]) => {
      const chatCoreScopeValue586 = Number(chatCoreScopeValue585);
      return [chatCoreScopeValue584, Number.isFinite(chatCoreScopeValue586) && chatCoreScopeValue586 > 0 ? Math.max(1, Math.floor(chatCoreScopeValue586)) : 20];
    })) : chatCoreScopeValue525.mountLimits,
    crossGroupMemorySettings: chatCoreScopeValue526.crossGroupMemorySettings && typeof chatCoreScopeValue526.crossGroupMemorySettings === "object" && !Array.isArray(chatCoreScopeValue526.crossGroupMemorySettings) ? Object.fromEntries(Object.entries(chatCoreScopeValue526.crossGroupMemorySettings).map(([chatCoreScopeValue587, chatCoreScopeValue588]) => [chatCoreScopeValue587, chatCoreScopeValue588 !== false])) : chatCoreScopeValue525.crossGroupMemorySettings
  };
  return chatCoreScopeValue512;
};
window.imApp.applyGeneratedShortTermMemory = function (chatCoreScopeValue589, chatCoreScopeValue590, chatCoreScopeValue591 = {}) {
  if (!chatCoreScopeValue589 || !chatCoreScopeValue590) return null;
  chatCoreScopeValue589.memory = window.imApp.normalizeFriendData(chatCoreScopeValue589).memory;
  if (!Array.isArray(chatCoreScopeValue589.memory.shortTermEntries)) chatCoreScopeValue589.memory.shortTermEntries = [];
  const chatCoreScopeValue592 = chatCoreScopeValue591.now instanceof Date ? chatCoreScopeValue591.now : new Date(chatCoreScopeValue591.now || Date.now()),
    chatCoreScopeValue593 = chatCoreScopeValue599 => String(chatCoreScopeValue599).padStart(2, "0"),
    chatCoreScopeValue594 = chatCoreScopeValue591.nowString || chatCoreScopeValue592.getFullYear() + "年" + chatCoreScopeValue593(chatCoreScopeValue592.getMonth() + 1) + "月" + chatCoreScopeValue593(chatCoreScopeValue592.getDate()) + "日 " + chatCoreScopeValue593(chatCoreScopeValue592.getHours()) + ":" + chatCoreScopeValue593(chatCoreScopeValue592.getMinutes()),
    chatCoreScopeValue595 = new Set((Array.isArray(chatCoreScopeValue591.activatedEntryIds) ? chatCoreScopeValue591.activatedEntryIds : []).map(String).filter(Boolean)),
    chatCoreScopeValue596 = chatCoreScopeValue600 => {
      if (!chatCoreScopeValue600) return null;
      if (typeof chatCoreScopeValue600 === "number") {
        const chatCoreScopeValue603 = new Date(chatCoreScopeValue600);
        return Number.isNaN(chatCoreScopeValue603.getTime()) ? null : chatCoreScopeValue603;
      }
      const chatCoreScopeValue601 = String(chatCoreScopeValue600).trim().replace(/年/g, "-").replace(/月/g, "-").replace(/日/g, " ").replace(/\./g, "-").replace(/\//g, "-"),
        chatCoreScopeValue602 = new Date(chatCoreScopeValue601);
      return Number.isNaN(chatCoreScopeValue602.getTime()) ? null : chatCoreScopeValue602;
    };
  chatCoreScopeValue589.memory.shortTermEntries.forEach(chatCoreScopeValue604 => {
    if (!chatCoreScopeValue604) return;
    if (chatCoreScopeValue595.has(String(chatCoreScopeValue604.id))) {
      chatCoreScopeValue604.degree = "高";
      chatCoreScopeValue604.lastActivatedAt = chatCoreScopeValue594;
      return;
    }
    const chatCoreScopeValue605 = chatCoreScopeValue596(chatCoreScopeValue604.lastActivatedAt || chatCoreScopeValue604.time || chatCoreScopeValue604.createdAt || "");
    if (!chatCoreScopeValue605) return;
    const chatCoreScopeValue606 = (chatCoreScopeValue592.getTime() - chatCoreScopeValue605.getTime()) / 86400000;
    if (chatCoreScopeValue606 > 30) chatCoreScopeValue604.degree = "遗忘";else {
      if (chatCoreScopeValue606 > 7) chatCoreScopeValue604.degree = "低";else {
        if (chatCoreScopeValue606 > 1 && chatCoreScopeValue604.degree === "高") chatCoreScopeValue604.degree = "中";
      }
    }
  });
  const chatCoreScopeValue597 = {
      ...chatCoreScopeValue590,
      id: chatCoreScopeValue590.id || "stm-" + Date.now(),
      time: chatCoreScopeValue590.time || chatCoreScopeValue594,
      degree: "高",
      lastActivatedAt: chatCoreScopeValue594,
      sourceType: String(chatCoreScopeValue590.sourceType || "").trim(),
      sourceId: String(chatCoreScopeValue590.sourceId || "").trim()
    },
    chatCoreScopeValue598 = chatCoreScopeValue597.sourceType && chatCoreScopeValue597.sourceId ? chatCoreScopeValue589.memory.shortTermEntries.findIndex(chatCoreScopeValue607 => String(chatCoreScopeValue607?.sourceType || "") === chatCoreScopeValue597.sourceType && String(chatCoreScopeValue607?.sourceId || "") === chatCoreScopeValue597.sourceId) : -1;
  chatCoreScopeValue598 >= 0 ? (chatCoreScopeValue597.id = chatCoreScopeValue589.memory.shortTermEntries[chatCoreScopeValue598]?.id || chatCoreScopeValue597.id, chatCoreScopeValue589.memory.shortTermEntries[chatCoreScopeValue598] = {
    ...chatCoreScopeValue589.memory.shortTermEntries[chatCoreScopeValue598],
    ...chatCoreScopeValue597
  }) : chatCoreScopeValue589.memory.shortTermEntries.push(chatCoreScopeValue597);
  if (chatCoreScopeValue591.updateSummaryCursor !== false) {
    const chatCoreScopeValue608 = Number(chatCoreScopeValue590.sourceEndMessageCount) || (Array.isArray(chatCoreScopeValue589.messages) ? chatCoreScopeValue589.messages.length : 0),
      chatCoreScopeValue609 = Array.isArray(chatCoreScopeValue590.sourceMessageIds) ? chatCoreScopeValue590.sourceMessageIds : [];
    chatCoreScopeValue589.memory.lastSummaryMessageCount = chatCoreScopeValue608;
    chatCoreScopeValue589.memory.summaryCursor = {
      messageId: String(chatCoreScopeValue590.sourceEndMessageId || chatCoreScopeValue609[chatCoreScopeValue609.length - 1] || "").trim(),
      order: Number.isFinite(Number(chatCoreScopeValue590.sourceEndMessageOrder)) ? Number(chatCoreScopeValue590.sourceEndMessageOrder) : -1,
      count: chatCoreScopeValue608
    };
  }
  return chatCoreScopeValue597;
};
window.imApp.commitShortTermMemoryPromotion = async function (chatCoreScopeValue610, chatCoreScopeValue611, chatCoreScopeValue612) {
  const chatCoreScopeValue613 = window.imApp.getFriendById(chatCoreScopeValue610),
    chatCoreScopeValue614 = Array.from(new Set((Array.isArray(chatCoreScopeValue612) ? chatCoreScopeValue612 : []).map(chatCoreScopeValue620 => String(chatCoreScopeValue620 || "").trim()).filter(Boolean)));
  if (!chatCoreScopeValue613 || chatCoreScopeValue614.length === 0 || !chatCoreScopeValue611 || typeof chatCoreScopeValue611 !== "object") return false;
  const chatCoreScopeValue615 = String(chatCoreScopeValue611.title || "").trim() || "长期记忆",
    chatCoreScopeValue616 = String(chatCoreScopeValue611.content || "").trim(),
    chatCoreScopeValue617 = String(chatCoreScopeValue611.time || "").trim();
  if (!chatCoreScopeValue616) return false;
  const chatCoreScopeValue618 = "promoted-ltm-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
    chatCoreScopeValue619 = await window.imApp.commitScopedFriendChange(chatCoreScopeValue613, chatCoreScopeValue621 => {
      chatCoreScopeValue621.memory = window.imApp.normalizeFriendData(chatCoreScopeValue621).memory;
      const chatCoreScopeValue622 = Array.isArray(chatCoreScopeValue621.memory.shortTermEntries) ? chatCoreScopeValue621.memory.shortTermEntries : [],
        chatCoreScopeValue623 = chatCoreScopeValue622.filter(chatCoreScopeValue624 => chatCoreScopeValue614.includes(String(chatCoreScopeValue624?.id || "")));
      if (chatCoreScopeValue623.length !== chatCoreScopeValue614.length) throw new Error("Selected short-term memories are no longer available");
      if (!Array.isArray(chatCoreScopeValue621.memory.longTermEntries)) chatCoreScopeValue621.memory.longTermEntries = [];
      chatCoreScopeValue621.memory.longTermEntries.push({
        id: chatCoreScopeValue618,
        title: chatCoreScopeValue615,
        content: chatCoreScopeValue616,
        time: chatCoreScopeValue617 || new Date().toISOString(),
        createdAt: chatCoreScopeValue617 || new Date().toISOString(),
        sourceType: "manual",
        sourceId: chatCoreScopeValue618,
        promotedFromShortTermIds: chatCoreScopeValue614
      });
      chatCoreScopeValue621.memory.shortTermEntries = chatCoreScopeValue622.filter(chatCoreScopeValue625 => !chatCoreScopeValue614.includes(String(chatCoreScopeValue625?.id || "")));
      chatCoreScopeValue621.memory.recallPresentation = null;
      window.imApp.clearFriendRuntimeMessageContext?.(chatCoreScopeValue621);
    }, {
      silent: true,
      immediate: true,
      syncActive: true,
      syncSettings: true
    });
  if (!chatCoreScopeValue619) return false;
  return window.dispatchEvent(new CustomEvent("u2:memory-entries-updated", {
    detail: {
      friendId: String(chatCoreScopeValue613.id),
      action: "promote",
      collection: "longTermEntries",
      entryId: chatCoreScopeValue618,
      removedShortTermEntryIds: chatCoreScopeValue614
    }
  })), {
    id: chatCoreScopeValue618
  };
};
window.imApp.createGroupMemberSnapshot = function (chatCoreScopeValue626) {
  if (!chatCoreScopeValue626 || chatCoreScopeValue626.type !== "group") return [];
  const chatCoreScopeValue627 = Array.isArray(chatCoreScopeValue626.members) ? chatCoreScopeValue626.members : [];
  return chatCoreScopeValue627.map(chatCoreScopeValue628 => {
    const chatCoreScopeValue629 = (window.imData?.friends || []).find(chatCoreScopeValue630 => String(chatCoreScopeValue630.id) === String(chatCoreScopeValue628));
    return {
      id: chatCoreScopeValue628,
      nickname: chatCoreScopeValue629?.nickname || "",
      realName: chatCoreScopeValue629?.realName || ""
    };
  });
};
window.imApp.getContextLimit = function (chatCoreScopeValue631, chatCoreScopeValue632 = {}) {
  const chatCoreScopeValue633 = chatCoreScopeValue632.friendIsNormalized === true && chatCoreScopeValue631 ? chatCoreScopeValue631 : window.imApp.normalizeFriendData(chatCoreScopeValue631 || {}),
    chatCoreScopeValue634 = chatCoreScopeValue633.type === "group" ? 100 : 50;
  if (chatCoreScopeValue633.memory?.context?.enabled === false) return 0;
  return Number(chatCoreScopeValue633.memory?.context?.limit) > 0 ? Number(chatCoreScopeValue633.memory.context.limit) : chatCoreScopeValue634;
};
window.imApp.getRecentContextMessages = function (chatCoreScopeValue635, chatCoreScopeValue636 = {}) {
  const chatCoreScopeValue637 = chatCoreScopeValue636.friendIsNormalized === true && chatCoreScopeValue635 ? chatCoreScopeValue635 : window.imApp.normalizeFriendData(chatCoreScopeValue635 || {}),
    chatCoreScopeValue638 = window.imApp.getContextLimit(chatCoreScopeValue637, {
      friendIsNormalized: true
    }),
    chatCoreScopeValue639 = (Array.isArray(chatCoreScopeValue637.messages) ? chatCoreScopeValue637.messages : []).filter(chatCoreScopeValue642 => chatCoreScopeValue642?.excludedFromContext !== true);
  if (chatCoreScopeValue638 <= 0 || chatCoreScopeValue639.length === 0) return [];
  if (chatCoreScopeValue637.type === "group") return chatCoreScopeValue639.slice(-chatCoreScopeValue638);
  const chatCoreScopeValue640 = Math.max(0, chatCoreScopeValue639.length - chatCoreScopeValue638);
  let chatCoreScopeValue641 = -1;
  for (let chatCoreScopeValue643 = chatCoreScopeValue640; chatCoreScopeValue643 >= 0; chatCoreScopeValue643 -= 1) {
    if (chatCoreScopeValue639[chatCoreScopeValue643]?.role === "user") {
      chatCoreScopeValue641 = chatCoreScopeValue643;
      break;
    }
  }
  return chatCoreScopeValue641 >= 0 ? chatCoreScopeValue639.slice(chatCoreScopeValue641) : chatCoreScopeValue639.slice(-chatCoreScopeValue638);
};
window.imApp.getGroupChatMemoryCandidates = function (chatCoreScopeValue644) {
  const chatCoreScopeValue645 = window.imApp.normalizeFriendData(chatCoreScopeValue644 || {});
  if (!chatCoreScopeValue645 || chatCoreScopeValue645.type === "group" || chatCoreScopeValue645.type === "official") return [];
  return (window.imData?.friends || []).filter(chatCoreScopeValue646 => {
    if (!chatCoreScopeValue646 || chatCoreScopeValue646.type !== "group" || !Array.isArray(chatCoreScopeValue646.members)) return false;
    const chatCoreScopeValue647 = chatCoreScopeValue646.members.some(chatCoreScopeValue649 => String(chatCoreScopeValue649) === String(chatCoreScopeValue645.id) || String(chatCoreScopeValue649) === String(chatCoreScopeValue645.nickname) || String(chatCoreScopeValue649) === String(chatCoreScopeValue645.realName)),
      chatCoreScopeValue648 = window.imChat?.getGroupMemberFriends ? window.imChat.getGroupMemberFriends(chatCoreScopeValue646).some(chatCoreScopeValue650 => String(chatCoreScopeValue650?.id) === String(chatCoreScopeValue645.id)) : false;
    return chatCoreScopeValue647 || chatCoreScopeValue648;
  });
};
window.imApp.getEligibleGroupChatMemoryContexts = function (chatCoreScopeValue651) {
  const chatCoreScopeValue652 = window.imApp.normalizeFriendData(chatCoreScopeValue651 || {}),
    chatCoreScopeValue653 = window.imDataUtils?.normalizeGroupChatContexts ? window.imDataUtils.normalizeGroupChatContexts(chatCoreScopeValue652.memory?.groupChatContexts) : [],
    chatCoreScopeValue654 = new Map(window.imApp.getGroupChatMemoryCandidates(chatCoreScopeValue652).map(chatCoreScopeValue655 => [String(chatCoreScopeValue655.id), chatCoreScopeValue655]));
  return chatCoreScopeValue653.map(chatCoreScopeValue656 => ({
    ...chatCoreScopeValue656,
    group: chatCoreScopeValue654.get(String(chatCoreScopeValue656.groupId)) || null
  })).filter(chatCoreScopeValue657 => chatCoreScopeValue657.group);
};
window.imApp.loadEligibleGroupChatMemoryContexts = async function (chatCoreScopeValue658) {
  const chatCoreScopeValue659 = window.imApp.getEligibleGroupChatMemoryContexts(chatCoreScopeValue658);
  if (chatCoreScopeValue659.length === 0) return [];
  if (window.imApp.ensureFriendRecentMessagesLoaded) await Promise.all(chatCoreScopeValue659.map(({
    group: chatCoreScopeValue661,
    messageLimit: chatCoreScopeValue662
  }) => window.imApp.ensureFriendRecentMessagesLoaded(chatCoreScopeValue661, {
    limit: Math.max(1, Number(chatCoreScopeValue662) || 30)
  })));else window.imApp.ensureFriendMessagesLoaded && (await Promise.all(chatCoreScopeValue659.map(({
    group: chatCoreScopeValue663
  }) => window.imApp.ensureFriendMessagesLoaded(chatCoreScopeValue663))));
  const chatCoreScopeValue660 = window.imApp.getFriendById(chatCoreScopeValue658) || chatCoreScopeValue658;
  return window.imApp.getEligibleGroupChatMemoryContexts(chatCoreScopeValue660);
};
window.imApp.isRecallableUserMessage = function (chatCoreScopeValue664) {
  if (!chatCoreScopeValue664 || chatCoreScopeValue664.role !== "user") return false;
  const chatCoreScopeValue665 = new Set(["system_notice", "pay_transfer", "group_red_packet", "group_poll", "group_announcement", "voice_call_record", "offline_meeting_record", "html"]);
  return !chatCoreScopeValue665.has(String(chatCoreScopeValue664.type || "").trim());
};
window.imApp.createRecalledNoticeMessage = function (chatCoreScopeValue666, chatCoreScopeValue667 = {}) {
  const chatCoreScopeValue668 = chatCoreScopeValue666 && typeof chatCoreScopeValue666 === "object" ? chatCoreScopeValue666 : {},
    chatCoreScopeValue669 = chatCoreScopeValue667.actorRole === "user" ? "user" : "assistant",
    chatCoreScopeValue670 = String(chatCoreScopeValue667.actorName || "").trim(),
    chatCoreScopeValue671 = Number(chatCoreScopeValue667.timestamp || chatCoreScopeValue668.timestamp) || Date.now(),
    chatCoreScopeValue672 = {
      id: chatCoreScopeValue668.id || chatCoreScopeValue667.id || (window.imChat?.createMessageId ? window.imChat.createMessageId("notice") : "notice_" + chatCoreScopeValue671),
      role: "system",
      type: "system_notice",
      noticeKind: "message_recalled",
      actorRole: chatCoreScopeValue669,
      actorName: chatCoreScopeValue670,
      content: chatCoreScopeValue669 === "user" ? "你撤回了一条消息" : (chatCoreScopeValue670 || "对方") + "撤回了一条消息",
      timestamp: chatCoreScopeValue671
    };
  chatCoreScopeValue669 !== "user" && typeof chatCoreScopeValue667.recalledContent === "string" && chatCoreScopeValue667.recalledContent.trim() && (chatCoreScopeValue672.payload = {
    recalledContent: chatCoreScopeValue667.recalledContent.trim(),
    recalledTranslation: typeof chatCoreScopeValue667.recalledTranslation === "string" ? chatCoreScopeValue667.recalledTranslation.trim() : ""
  });
  if (chatCoreScopeValue667.apiRunId) chatCoreScopeValue672.apiRunId = chatCoreScopeValue667.apiRunId;
  return chatCoreScopeValue672;
};
window.imApp.formatSceneNarrationForApiContext = function (chatCoreScopeValue673, chatCoreScopeValue674 = {}) {
  const chatCoreScopeValue675 = chatCoreScopeValue674.source === "dynamic_action" ? "narrator_dynamic_action" : "scene_director";
  return "<SCENE_NARRATION source=\"" + chatCoreScopeValue675 + `" attribution="none">
content_json: ` + JSON.stringify(String(chatCoreScopeValue673 || "")) + `
interpretation_rules:
- This is an out-of-character scene narration event, not a message, spoken line, inner thought, intention, or automatically performed action from User.
- Do not reply as though User said this text. Do not attribute it to User or any character unless the narration explicitly names that character as the actor.
- If the narration explicitly states that a named character performed an action, treat that action as an already established scene fact and continue from its result.
- Preserve this event's chronological place in the scene and continue the story from it.
</SCENE_NARRATION>`;
};
window.imApp.formatSystemNoticeForApiContext = function (chatCoreScopeValue676, chatCoreScopeValue677) {
  const chatCoreScopeValue678 = chatCoreScopeValue676 || {},
    chatCoreScopeValue679 = chatCoreScopeValue678.noticeKind || "",
    chatCoreScopeValue680 = window.imApp.getGroupManagementNoticeText ? window.imApp.getGroupManagementNoticeText(chatCoreScopeValue677, chatCoreScopeValue678) : chatCoreScopeValue678.content || chatCoreScopeValue678.text || "";
  if (chatCoreScopeValue679 === "group_left") return "[系统事件：User 已退出群聊。]";
  if (chatCoreScopeValue679 === "group_rejoined") return "[系统事件：User 重新进入群聊。]";
  if (["group_admin_promoted", "group_admin_removed", "group_title_changed"].includes(chatCoreScopeValue679)) {
    if (!chatCoreScopeValue680) return "";
    const chatCoreScopeValue681 = String(chatCoreScopeValue678.targetMemberId || "").trim(),
      chatCoreScopeValue682 = chatCoreScopeValue681 && chatCoreScopeValue681 !== "__user__" ? "；目标成员 ID：" + chatCoreScopeValue681 : "";
    return "[群内公开事件：" + chatCoreScopeValue680 + chatCoreScopeValue682 + "]";
  }
  if (chatCoreScopeValue679 === "narration") return window.imApp.formatSceneNarrationForApiContext(chatCoreScopeValue680, {
    source: chatCoreScopeValue678.narrationSource
  });
  if (chatCoreScopeValue679 === "offline_meeting_active") return "";
  if (chatCoreScopeValue679 === "group_private_to_user") return "[系统事件：有群成员向 User 发送了私信。其他群成员默认不知道私信内容。]";
  if (chatCoreScopeValue679 === "group_friend_private_chat") return "[系统事件：有群成员与自己的好友进行了私聊。私聊内容只属于该成员，其他群成员默认不知道。]";
  if (chatCoreScopeValue679 === "message_recalled") {
    if (chatCoreScopeValue678.actorRole === "user") return "[系统事件：User 撤回了一条消息。你只知道发生了撤回，无法读取被撤回的原文。]";
    const chatCoreScopeValue683 = String(chatCoreScopeValue678.actorName || "").trim();
    return chatCoreScopeValue683 ? "[系统事件：" + chatCoreScopeValue683 + " 撤回了一条消息。]" : "[系统事件：你撤回了一条消息。]";
  }
  if (chatCoreScopeValue679 === "family_card_spend") {
    const chatCoreScopeValue684 = chatCoreScopeValue678.familyCardSpend || {},
      chatCoreScopeValue685 = Number(chatCoreScopeValue684.amount),
      chatCoreScopeValue686 = Number(chatCoreScopeValue684.balance),
      chatCoreNewScope696 = String(chatCoreScopeValue684.title || "消费").trim().slice(0, 160);
    if (!Number.isFinite(chatCoreScopeValue685) || chatCoreScopeValue685 <= 0) return "";
    return "[亲属卡消费通知：User 使用了你赠送的亲属卡，消费 ¥" + chatCoreScopeValue685.toFixed(2) + "，用途：" + chatCoreNewScope696 + (Number.isFinite(chatCoreScopeValue686) ? "，剩余额度 ¥" + chatCoreScopeValue686.toFixed(2) : "") + "。]";
  }
  return chatCoreScopeValue680 ? "[系统事件：" + chatCoreScopeValue680 + "]" : "[系统事件]";
};
window.imApp.stripFakeLinkHtmlForApiContext = function (chatCoreScopeValue687, chatCoreScopeValue688 = 20000) {
  return String(chatCoreScopeValue687 == null ? "" : chatCoreScopeValue687).replace(/<\s*(script|style|iframe|object|embed|svg|canvas)[\s\S]*?<\s*\/\s*\1\s*>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, "\"").replace(/&#039;/gi, "'").replace(/\s+/g, " ").trim().slice(0, Math.max(1000, Number(chatCoreScopeValue688) || 20000));
};
window.imApp.formatFakeLinkMessageForApiContext = function (chatCoreScopeValue689, chatCoreScopeValue690 = {}) {
  const chatCoreScopeValue691 = chatCoreScopeValue689 || {},
    chatCoreScopeValue692 = chatCoreScopeValue691.fakeLinkData && typeof chatCoreScopeValue691.fakeLinkData === "object" ? chatCoreScopeValue691.fakeLinkData : {},
    chatCoreScopeValue693 = String(chatCoreScopeValue692.displayUrl || chatCoreScopeValue692.canonicalUrl || chatCoreScopeValue691.content || "").trim(),
    chatCoreScopeValue694 = String(chatCoreScopeValue692.siteName || chatCoreScopeValue692.domain || "Webpage").trim(),
    chatCoreScopeValue695 = String(chatCoreScopeValue692.title || chatCoreScopeValue693 || "Untitled webpage").trim(),
    chatCoreScopeValue696 = String(chatCoreScopeValue692.summary || "").trim(),
    chatCoreScopeValue697 = chatCoreScopeValue692.webPage && typeof chatCoreScopeValue692.webPage === "object" ? chatCoreScopeValue692.webPage : null,
    chatCoreScopeValue698 = chatCoreScopeValue697 && chatCoreScopeValue697.html ? window.imApp.stripFakeLinkHtmlForApiContext(chatCoreScopeValue697.html, chatCoreScopeValue690.maxLinkBodyChars || 20000) : "",
    chatCoreScopeValue699 = String(chatCoreScopeValue692.bodyText || chatCoreScopeValue692.pageText || chatCoreScopeValue698 || "").trim(),
    chatCoreScopeValue700 = chatCoreScopeValue697 ? String(chatCoreScopeValue697.theme || "").trim() : "",
    chatCoreScopeValue701 = chatCoreScopeValue690.expandLinkContent !== false,
    chatCoreScopeValue702 = Math.max(1000, Number(chatCoreScopeValue690.maxLinkBodyChars) || 20000),
    chatCoreScopeValue703 = ["[" + (chatCoreScopeValue691.role === "assistant" ? chatCoreScopeValue691.speaker || chatCoreScopeValue691.senderName || "Char" : "User") + " shared a webpage]", "Site: " + chatCoreScopeValue694, "Title: " + chatCoreScopeValue695, "Displayed URL: " + chatCoreScopeValue693];
  if (chatCoreScopeValue696) chatCoreScopeValue703.push("Summary: " + chatCoreScopeValue696);
  if (!chatCoreScopeValue699) return chatCoreScopeValue703.push("Body status: no page body is available; use only title, domain, and summary."), chatCoreScopeValue703.join("\n");
  if (!chatCoreScopeValue701) return chatCoreScopeValue703.push("Page summary: " + (chatCoreScopeValue696 || chatCoreScopeValue699.slice(0, 500))), chatCoreScopeValue703.push("Body status: this is an older webpage record; only its summary is retained this turn."), chatCoreScopeValue703.join("\n");
  const chatCoreScopeValue704 = chatCoreScopeValue699.slice(0, chatCoreScopeValue702);
  return chatCoreScopeValue703.push("Page body:\n" + chatCoreScopeValue704), chatCoreScopeValue699.length > chatCoreScopeValue704.length && chatCoreScopeValue703.push("Body status: long content was truncated."), chatCoreScopeValue703.join("\n");
};
window.imApp.formatMessageForApiContext = function (chatCoreScopeValue705, chatCoreScopeValue706, chatCoreScopeValue707 = {}) {
  if (chatCoreScopeValue705?.type === "file" && chatCoreScopeValue705.excludedFromContext !== true) return {
    role: chatCoreScopeValue705.role,
    content: window.imChat.formatFileForContext(chatCoreScopeValue705, chatCoreScopeValue707)
  };
  const chatCoreScopeValue708 = chatCoreScopeValue707.friendIsNormalized === true && chatCoreScopeValue706 ? chatCoreScopeValue706 : window.imApp.normalizeFriendData(chatCoreScopeValue706 || {});
  const chatCoreScopeValue709 = chatCoreScopeValue705 || {};
  const chatCoreScopeValue710 = chatCoreScopeValue708.type === "group";
  if (chatCoreScopeValue709.type === "gift" && chatCoreScopeValue709.excludedFromContext !== true) {
    const chatCoreScopeValue712 = chatCoreScopeValue709.shopGift || {};
    const chatCoreScopeValue713 = chatCoreScopeValue709.giftName || chatCoreScopeValue712.itemName || "Gift";
    const chatCoreScopeValue714 = Number(chatCoreScopeValue709.giftValue ?? chatCoreScopeValue712.price) || 0;
    const chatCoreScopeValue715 = chatCoreScopeValue709.giftDescription || chatCoreScopeValue712.note || "";
    return {
      role: chatCoreScopeValue709.role,
      content: `[${chatCoreScopeValue709.role === "assistant" ? "你赠送给 User" : "User 赠送给你"}一份礼物]\n商品：${chatCoreScopeValue713}\n价值：$${chatCoreScopeValue714.toFixed(2)}${chatCoreScopeValue715 ? `\n赠礼备注：${chatCoreScopeValue715}` : ""}`
    };
  }
  let chatCoreScopeValue711 = chatCoreScopeValue709.content || "";
  if (chatCoreScopeValue709.excludedFromContext === true || chatCoreScopeValue709.type === "user_phone_access_card" || chatCoreScopeValue709.type === "system_notice" && ["user_phone_access", "user_remark_changed", "relationship_changed"].includes(chatCoreScopeValue709.noticeKind)) return null;
  if (chatCoreScopeValue709.type === "memory_request") return null;
  if (chatCoreScopeValue709.type === "unblock_request") {
    const chatCoreScopeValue716 = chatCoreScopeValue709.requesterRole === "assistant" ? "Char" : "User";
    const chatCoreScopeValue717 = chatCoreScopeValue709.requestStatus || "pending";
    return {
      role: chatCoreScopeValue709.requesterRole === "assistant" ? "assistant" : "user",
      content: "[解除拉黑申请｜requestId=" + chatCoreScopeValue709.id + "｜申请方=" + chatCoreScopeValue716 + "｜状态=" + chatCoreScopeValue717 + "]\n理由：" + (chatCoreScopeValue709.requestText || chatCoreScopeValue709.content || "")
    };
  }
  if (chatCoreScopeValue709.type === "loves_unbind_request") return {
    role: "system",
    content: "[Loves 解绑申请｜requestId=" + (chatCoreScopeValue709.requestId || chatCoreScopeValue709.id) + "｜状态=" + (chatCoreScopeValue709.requestStatus || "pending") + "] User 请求解除与 Char 的 Loves 关系。"
  };
  if (chatCoreScopeValue709.type === "loves_unbind_decision") {
    const chatCoreScopeValue718 = chatCoreScopeValue709.decision === "accept" ? "同意解绑" : "拒绝解绑";
    return {
      role: "system",
      content: "[Loves 解绑结果｜requestId=" + (chatCoreScopeValue709.requestId || "") + "] Char 已" + chatCoreScopeValue718 + "。"
    };
  }
  if (chatCoreScopeValue709.type === "together_listening_invite") {
    const chatCoreScopeValue719 = String(chatCoreScopeValue709.title || "未知歌曲").trim() || "未知歌曲";
    const chatCoreScopeValue720 = String(chatCoreScopeValue709.artist || "未知歌手").trim() || "未知歌手";
    const chatCoreScopeValue721 = chatCoreScopeValue709.inviteStatus === "accepted" ? "User 已同意，你们已进入一起听" : "等待 User 决定是否一起听";
    return {
      role: "assistant",
      content: "[你向 User 发出了一起听邀请：" + chatCoreScopeValue719 + " - " + chatCoreScopeValue720 + "；" + chatCoreScopeValue721 + "。]"
    };
  }
  if (chatCoreScopeValue709.type === "offline_invite") {
    const chatCoreScopeValue722 = {
      pending: "等待 User 回应",
      accepted: "User 已接受并进入线下",
      declined: "User 已婉拒",
      superseded: "邀请已失效"
    }[chatCoreScopeValue709.inviteStatus] || "等待 User 回应";
    return {
      role: "assistant",
      content: "[你向 User 发出线下邀请：" + (chatCoreScopeValue709.title || "") + "；" + (chatCoreScopeValue709.invitationText || "") + (chatCoreScopeValue709.place ? "；地点：" + chatCoreScopeValue709.place : "") + "；" + chatCoreScopeValue722 + "。]"
    };
  }
  if (chatCoreScopeValue709.type === "system_notice") return {
    role: "system",
    content: window.imApp.formatSystemNoticeForApiContext(chatCoreScopeValue709, chatCoreScopeValue706)
  };
  if (chatCoreScopeValue709.type === "chat_record_forward") chatCoreScopeValue711 = window.imApp.formatChatRecordForwardForApiContext ? window.imApp.formatChatRecordForwardForApiContext(chatCoreScopeValue709) : "[User 转发了一份聊天记录]";else {
    if (chatCoreScopeValue709.type === "group_announcement") chatCoreScopeValue711 = window.imApp.formatGroupAnnouncement(chatCoreScopeValue709.payload?.["announcement"], chatCoreScopeValue709.payload?.["action"]);else {
      if (chatCoreScopeValue709.type === "group_poll") {
        const chatCoreScopeValue723 = Array.isArray(chatCoreScopeValue709.pollOptions) ? chatCoreScopeValue709.pollOptions : [],
          chatCoreScopeValue724 = Array.isArray(chatCoreScopeValue709.pollVotes) ? chatCoreScopeValue709.pollVotes : [],
          chatCoreScopeValue725 = new Map(chatCoreScopeValue723.map(chatCoreScopeValue727 => [String(chatCoreScopeValue727?.["id"] || ""), String(chatCoreScopeValue727?.["text"] || "")])),
          chatCoreScopeValue726 = chatCoreScopeValue724.map(chatCoreScopeValue728 => {
            const chatCoreScopeValue729 = String(chatCoreScopeValue728?.["voterName"] || chatCoreScopeValue728?.["voterId"] || "未知成员"),
              chatCoreScopeValue730 = chatCoreScopeValue725.get(String(chatCoreScopeValue728?.["optionId"] || "")) || "未知选项";
            return chatCoreScopeValue729 + " → " + chatCoreScopeValue730;
          });
        chatCoreScopeValue711 = ["[User 发起了一项公开单选群投票：" + (chatCoreScopeValue709.pollQuestion || "未命名投票") + "]", "选项：" + (chatCoreScopeValue723.map(chatCoreScopeValue731 => chatCoreScopeValue731?.["text"] || "").filter(Boolean).join(" / ") || "无"), "投票结果：" + (chatCoreScopeValue726.length > 0 ? chatCoreScopeValue726.join("；") : "暂时无人投票"), chatCoreScopeValue709.pollStatus === "pending" ? "角色投票仍在进行中。" : ""].filter(Boolean).join("\n");
      } else {
        if (chatCoreScopeValue709.type === "file") chatCoreScopeValue711 = window.imChat.formatFileForContext(chatCoreScopeValue709, chatCoreScopeValue707);else {
          if (chatCoreScopeValue709.type === "fake_link") chatCoreScopeValue711 = window.imApp.formatFakeLinkMessageForApiContext(chatCoreScopeValue709, chatCoreScopeValue707);else {
            if (chatCoreScopeValue709.type === "voice_message") {
              const chatCoreScopeValue732 = chatCoreScopeValue709.transcript || chatCoreScopeValue709.text || "";
              chatCoreScopeValue711 = chatCoreScopeValue709.role === "user" ? "[用户发了一条语音消息，语音内容：" + chatCoreScopeValue732 + "]" : "[你发了一条语音消息，语音内容：" + chatCoreScopeValue732 + "]";
            } else {
              if (chatCoreScopeValue709.type === "sticker") {
                const chatCoreScopeValue733 = chatCoreScopeValue709.stickerName || chatCoreScopeValue709.text || "表情包",
                  chatCoreScopeValue734 = chatCoreScopeValue709.stickerCategory || "",
                  chatCoreScopeValue735 = chatCoreScopeValue734 ? chatCoreScopeValue734 + " / " + chatCoreScopeValue733 : chatCoreScopeValue733;
                chatCoreScopeValue711 = chatCoreScopeValue709.role === "user" ? "[用户发了一个表情包：" + chatCoreScopeValue735 + "]" : "[你发了一个表情包：" + chatCoreScopeValue735 + "]";
              } else {
                if (chatCoreScopeValue709.type === "offline_meeting_record") {
                  const chatCoreScopeValue736 = chatCoreScopeValue709.dateText || "",
                    chatCoreScopeValue737 = chatCoreScopeValue709.title || "见面记录",
                    chatCoreScopeValue738 = chatCoreScopeValue709.summary || chatCoreScopeValue709.content || "",
                    chatCoreScopeValue739 = [chatCoreScopeValue707.includeTime !== false ? "线下见面结束于：" + (chatCoreScopeValue736 || "未知") : "线下见面已经结束", "标题：" + chatCoreScopeValue737, "总结：" + chatCoreScopeValue738];
                  return {
                    role: "system",
                    content: window.imApp.formatSceneNarrationForApiContext(chatCoreScopeValue739.join("\n"))
                  };
                } else {
                  if (chatCoreScopeValue709.type === "voice_call_record") {
                    const chatCoreScopeValue740 = chatCoreScopeValue709.duration || 0,
                      chatCoreScopeValue741 = Math.floor(chatCoreScopeValue740 / 60) + "分" + chatCoreScopeValue740 % 60 + "秒",
                      chatCoreScopeValue742 = chatCoreScopeValue709.callMessages || [],
                      chatCoreScopeValue743 = chatCoreScopeValue709.statusText || "通话记录";
                    if (chatCoreScopeValue743 === "已拒绝") chatCoreScopeValue711 = "[提示：" + (chatCoreScopeValue709.isSelf ? "对方" : "你") + "刚刚拒绝了这通" + (chatCoreScopeValue709.isVideo ? "视频" : "语音") + "通话。]";else {
                      if (chatCoreScopeValue743 === "已取消") chatCoreScopeValue711 = "[提示：" + (chatCoreScopeValue709.isSelf ? "你" : "对方") + "刚刚取消了这通" + (chatCoreScopeValue709.isVideo ? "视频" : "语音") + "通话。]";else {
                        if (chatCoreScopeValue742.length > 0) {
                          const chatCoreScopeValue744 = chatCoreScopeValue707.userName || window.userState?.["name"] || "User",
                            chatCoreScopeValue745 = chatCoreScopeValue708.nickname || "对方",
                            chatCoreScopeValue746 = chatCoreScopeValue742.map(chatCoreScopeValue747 => {
                              const chatCoreScopeValue748 = chatCoreScopeValue747.isSelf ? chatCoreScopeValue744 : chatCoreScopeValue745,
                                chatCoreScopeValue749 = [];
                              if (chatCoreScopeValue747.actionText) chatCoreScopeValue749.push(String(chatCoreScopeValue747.actionText).trim());
                              if (chatCoreScopeValue747.thoughtText) chatCoreScopeValue749.push("心声：" + String(chatCoreScopeValue747.thoughtText).trim());
                              if (chatCoreScopeValue747.visualSummary) chatCoreScopeValue749.push("当时可见画面：" + String(chatCoreScopeValue747.visualSummary).trim());
                              if (chatCoreScopeValue747.text) chatCoreScopeValue749.push(chatCoreScopeValue748 + "：「" + String(chatCoreScopeValue747.text).trim() + "」");
                              return chatCoreScopeValue749.join("\n  ");
                            }).filter(Boolean).join("\n  ");
                          chatCoreScopeValue711 = "[提示：你们刚刚完成了一通" + (chatCoreScopeValue709.isVideo ? "视频" : "语音") + "通话，时长 " + chatCoreScopeValue741 + "。通话期间的交流内容如下：\n  " + chatCoreScopeValue746 + "\n（通话已结束，请直接用普通文字回复）]";
                        } else chatCoreScopeValue711 = "[提示：你们刚刚完成了一通" + (chatCoreScopeValue709.isVideo ? "视频" : "语音") + "通话，时长 " + chatCoreScopeValue741 + "，未产生可识别的文本记录。（通话已结束，请直接用普通文字回复）]";
                      }
                    }
                  } else {
                    if (chatCoreScopeValue709.type === "html" && chatCoreScopeValue709.shopGift) {
                      const chatCoreScopeValue750 = chatCoreScopeValue709.shopGift || {},
                        chatCoreScopeValue751 = String(chatCoreScopeValue750.itemName || "商品").trim() || "商品",
                        chatCoreScopeValue752 = Number(chatCoreScopeValue750.price) || 0,
                        chatCoreScopeValue753 = String(chatCoreScopeValue750.paymentMethod || "").trim();
                      chatCoreScopeValue711 = chatCoreScopeValue709.role === "assistant" || chatCoreScopeValue750.senderRole === "assistant" ? "[你赠送给 User 一份礼物]\n商品：" + chatCoreScopeValue751 + "\n价值：¥" + chatCoreScopeValue752.toFixed(2) : "[User 赠送给你一份礼物]\n商品：" + chatCoreScopeValue751 + "\n价值：¥" + chatCoreScopeValue752.toFixed(2) + (chatCoreScopeValue753 ? "\n付款方式：" + chatCoreScopeValue753 : "");
                    } else {
                      if (chatCoreScopeValue709.type === "moment_forward") try {
                        const chatCoreScopeValue754 = JSON.parse(chatCoreScopeValue709.content),
                          chatCoreScopeValue755 = chatCoreScopeValue754.text || "无配文";
                        chatCoreScopeValue711 = "[转发了一条朋友圈, 内容: \"" + chatCoreScopeValue755 + "\"]", chatCoreScopeValue754.img && (chatCoreScopeValue754.imgDesc ? chatCoreScopeValue711 += " (附带图片: " + chatCoreScopeValue754.imgDesc + ")" : chatCoreScopeValue711 += " (附带图片)");
                      } catch (chatCoreScopeValue756) {
                        chatCoreScopeValue711 = "[转发了一条朋友圈]";
                      } else {
                        if (chatCoreScopeValue709.type === "image") {
                          const chatCoreScopeValue757 = chatCoreScopeValue709.text || chatCoreScopeValue709.description || chatCoreScopeValue709.fileName || "无描述",
                            chatCoreScopeValue758 = 1 + (Array.isArray(chatCoreScopeValue709.albumImages) ? chatCoreScopeValue709.albumImages.length : 0);
                          chatCoreScopeValue711 = "[发送了" + (chatCoreScopeValue758 > 1 ? chatCoreScopeValue758 + "张" : "一张") + "图片：" + chatCoreScopeValue757 + "]";
                        } else {
                          if (chatCoreScopeValue709.type === "location") {
                            const chatCoreScopeValue759 = String(chatCoreScopeValue709.locationName || chatCoreScopeValue709.name || "共享位置").trim(),
                              chatCoreScopeValue760 = String(chatCoreScopeValue709.locationAddress || chatCoreScopeValue709.address || "").trim(),
                              chatCoreScopeValue761 = String(chatCoreScopeValue709.locationNameTranslation || chatCoreScopeValue709.nameTranslation || "").trim(),
                              chatCoreScopeValue762 = String(chatCoreScopeValue709.locationAddressTranslation || chatCoreScopeValue709.addressTranslation || "").trim();
                            chatCoreScopeValue711 = "[发送了一个定位：" + chatCoreScopeValue759 + (chatCoreScopeValue761 ? "（" + chatCoreScopeValue761 + "）" : "") + (chatCoreScopeValue760 ? "，详细地址：" + chatCoreScopeValue760 + (chatCoreScopeValue762 ? "（" + chatCoreScopeValue762 + "）" : "") : "") + "]";
                          } else {
                            if (chatCoreScopeValue709.type === "pay_transfer") {
                              const chatCoreScopeValue763 = Number(chatCoreScopeValue709.amount) || 0,
                                chatCoreScopeValue764 = chatCoreScopeValue709.description || "转账",
                                chatCoreScopeValue765 = chatCoreScopeValue709.targetName || chatCoreScopeValue708.nickname || "对方";
                              if (chatCoreScopeValue709.payKind === "family_card_pending") chatCoreScopeValue711 = "[用户赠送给你一张额度 ¥" + chatCoreScopeValue763.toFixed(2) + " 的亲属卡，等待你决定收下或退回。]";else {
                                if (chatCoreScopeValue709.payKind === "family_card_accepted") chatCoreScopeValue711 = "[用户赠送给你的额度 ¥" + chatCoreScopeValue763.toFixed(2) + " 的亲属卡已被你收下。]";else {
                                  if (chatCoreScopeValue709.payKind === "family_card_rejected") chatCoreScopeValue711 = "[用户赠送给你的额度 ¥" + chatCoreScopeValue763.toFixed(2) + " 的亲属卡已被你退回。]";else {
                                    if (chatCoreScopeValue709.payKind === "family_card_unbound") chatCoreScopeValue711 = "[用户赠送给你的亲属卡已解绑，原额度为 ¥" + chatCoreScopeValue763.toFixed(2) + "。]";else {
                                      if (chatCoreScopeValue709.payKind === "family_card_adjust") chatCoreScopeValue711 = "[用户将赠送给你的亲属卡额度从 ¥" + Number(chatCoreScopeValue709.previousLimit || 0).toFixed(2) + " 调整到 ¥" + chatCoreScopeValue763.toFixed(2) + "。]";else {
                                        if (chatCoreScopeValue709.payKind === "family_card_accept_notice" || chatCoreScopeValue709.payKind === "family_card_reject_notice") chatCoreScopeValue711 = "[你" + (chatCoreScopeValue709.payKind === "family_card_accept_notice" ? "收下" : "退回") + "了用户赠送的亲属卡。]";else {
                                          if (chatCoreScopeValue709.payKind === "user_to_char") chatCoreScopeValue711 = "[用户刚刚向你转账 ¥" + chatCoreScopeValue763.toFixed(2) + "，备注：" + chatCoreScopeValue764 + "，对象：" + chatCoreScopeValue765 + "。你可以收下这笔钱，也可以退回，或者正常回复。]";else {
                                            if (chatCoreScopeValue709.payKind === "char_received") chatCoreScopeValue711 = "[你刚刚收下了用户的一笔转账 ¥" + chatCoreScopeValue763.toFixed(2) + "，备注：" + chatCoreScopeValue764 + "。]";else {
                                              if (chatCoreScopeValue709.payKind === "char_to_user_pending") chatCoreScopeValue711 = "[你刚刚向用户发起了一笔转账 ¥" + chatCoreScopeValue763.toFixed(2) + "，备注：" + chatCoreScopeValue764 + "，等待用户领取。]";else {
                                                if (chatCoreScopeValue709.payKind === "char_to_user_claimed" || chatCoreScopeValue709.payKind === "user_received_from_char") chatCoreScopeValue711 = "[用户已领取你的转账 ¥" + chatCoreScopeValue763.toFixed(2) + "，备注：" + chatCoreScopeValue764 + "。]";else {
                                                  if (chatCoreScopeValue709.payKind === "user_rejected_from_char") chatCoreScopeValue711 = "[用户退回了你的转账 ¥" + chatCoreScopeValue763.toFixed(2) + "，备注：" + chatCoreScopeValue764 + "。]";else (chatCoreScopeValue709.payKind === "char_to_user_rejected" || chatCoreScopeValue709.payKind === "user_to_char_rejected") && (chatCoreScopeValue711 = "[你刚刚退回了用户的转账 ¥" + chatCoreScopeValue763.toFixed(2) + "，备注：" + chatCoreScopeValue764 + "。]");
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  if (chatCoreScopeValue710) {
    const chatCoreScopeValue766 = String(chatCoreScopeValue709.userIdentity?.name || chatCoreScopeValue707.userName || window.imApp.getGroupUserIdentity(chatCoreScopeValue708).name || "User").trim() || "User";
    if (chatCoreScopeValue709.role === "user") {
      chatCoreScopeValue709.replyTo && (chatCoreScopeValue711 = "[引用了消息：\"" + chatCoreScopeValue709.replyTo + "\"]\n" + chatCoreScopeValue711);
      return {
        role: "user",
        content: "User(" + chatCoreScopeValue766 + "): " + chatCoreScopeValue711
      };
    }
    const chatCoreScopeValue767 = typeof chatCoreScopeValue709.speaker === "string" && chatCoreScopeValue709.speaker.trim() ? chatCoreScopeValue709.speaker.trim() : "群成员";
    chatCoreScopeValue709.replyTo && (chatCoreScopeValue711 = "[引用了消息：\"" + chatCoreScopeValue709.replyTo + "\"]\n" + chatCoreScopeValue711);
    return {
      role: "assistant",
      content: chatCoreScopeValue767 + ": " + chatCoreScopeValue711
    };
  }
  chatCoreScopeValue709.role === "user" && chatCoreScopeValue709.replyTo && (chatCoreScopeValue711 = "[用户引用了消息：\"" + chatCoreScopeValue709.replyTo + "\"]\n" + chatCoreScopeValue711);
  return {
    role: chatCoreScopeValue709.role,
    content: chatCoreScopeValue711
  };
};
window.imApp.buildApiContextMessages = function (chatCoreScopeValue768, chatCoreScopeValue769 = {}) {
  const chatCoreScopeValue770 = window.imApp.normalizeFriendData(chatCoreScopeValue768 || {}),
    chatCoreScopeValue771 = window.imApp.getRecentContextMessages(chatCoreScopeValue770, {
      friendIsNormalized: true
    }),
    chatCoreScopeValue772 = window.imChat?.["allocateFileContext"]?.(chatCoreScopeValue771);
  let chatCoreScopeValue773 = -1;
  return chatCoreScopeValue771.forEach((chatCoreScopeValue774, chatCoreScopeValue775) => {
    if (chatCoreScopeValue774 && chatCoreScopeValue774.type === "fake_link") chatCoreScopeValue773 = chatCoreScopeValue775;
  }), chatCoreScopeValue771.map((chatCoreScopeValue776, chatCoreScopeValue777) => {
    const chatCoreScopeValue778 = window.imApp.formatMessageForApiContext(chatCoreScopeValue776, chatCoreScopeValue770, {
      ...chatCoreScopeValue769,
      friendIsNormalized: true,
      maxFileBodyChars: chatCoreScopeValue772?.["get"](chatCoreScopeValue776) ?? chatCoreScopeValue769.maxFileBodyChars,
      expandLinkContent: chatCoreScopeValue776 && chatCoreScopeValue776.type === "fake_link" ? chatCoreScopeValue777 === chatCoreScopeValue773 : chatCoreScopeValue769.expandLinkContent
    });
    if (!chatCoreScopeValue778 || !chatCoreScopeValue769.includeContextMetadata) return chatCoreScopeValue778;
    return {
      ...chatCoreScopeValue778,
      _contextMessageId: String(chatCoreScopeValue776?.["id"] || ""),
      _contextTimestamp: Number(chatCoreScopeValue776?.["timestamp"]) || 0
    };
  }).filter(chatCoreScopeValue779 => chatCoreScopeValue779 && chatCoreScopeValue779.role && typeof chatCoreScopeValue779.content === "string" && chatCoreScopeValue779.content.trim());
};
window.imApp.buildLinkedAccountMemoryContext = function (chatCoreScopeValue780, chatCoreScopeValue781 = {}) {
  const chatCoreScopeValue782 = window.imApp.normalizeFriendData(chatCoreScopeValue780 || {}),
    chatCoreScopeValue783 = Array.isArray(chatCoreScopeValue782.linkedAccountChats) ? chatCoreScopeValue782.linkedAccountChats : [];
  if (chatCoreScopeValue783.length === 0) return "";
  const chatCoreScopeValue784 = chatCoreScopeValue782.nickname || chatCoreScopeValue782.realName || "Char",
    chatCoreScopeValue785 = chatCoreScopeValue781?.includeTime !== false,
    chatCoreScopeValue786 = Math.max(1, Number(chatCoreScopeValue781.maxMessagesPerFriend) || 4),
    chatCoreScopeValue787 = chatCoreScopeValue789 => {
      const chatCoreScopeValue790 = Number(chatCoreScopeValue789) || 0;
      if (!chatCoreScopeValue790) return "未知时间";
      const chatCoreScopeValue791 = new Date(chatCoreScopeValue790);
      return window.imDataUtils?.formatUsDateTime ? window.imDataUtils.formatUsDateTime(chatCoreScopeValue791) : chatCoreScopeValue791.toLocaleString("en-US", {
        hour12: true
      });
    },
    chatCoreScopeValue788 = ["Linked Friend Memory / 关联好友记忆:", "These are private friend chats belonging to the character. They are context about the character's own friends, not messages from the current User."];
  return chatCoreScopeValue783.forEach((chatCoreScopeValue792, chatCoreScopeValue793) => {
    const chatCoreScopeValue794 = chatCoreScopeValue792.remark || chatCoreScopeValue792.name || chatCoreScopeValue792.realName || "Friend " + (chatCoreScopeValue793 + 1),
      chatCoreScopeValue795 = chatCoreScopeValue792.realName || chatCoreScopeValue792.name || chatCoreScopeValue794,
      chatCoreScopeValue796 = Array.isArray(chatCoreScopeValue792.messages) ? chatCoreScopeValue792.messages.slice(-chatCoreScopeValue786) : [];
    chatCoreScopeValue788.push("");
    chatCoreScopeValue788.push("Friend " + (chatCoreScopeValue793 + 1) + ": " + chatCoreScopeValue794);
    chatCoreScopeValue788.push("Real Name: " + (chatCoreScopeValue795 || "Unknown"));
    chatCoreScopeValue788.push("Remark: " + (chatCoreScopeValue792.remark || chatCoreScopeValue794 || "None"));
    chatCoreScopeValue788.push("Relationship: " + (chatCoreScopeValue792.relationship || "None"));
    chatCoreScopeValue788.push("Persona: " + (chatCoreScopeValue792.persona || "None"));
    chatCoreScopeValue788.push("Recent private messages, fixed to the latest 2 rounds:");
    chatCoreScopeValue796.length === 0 ? chatCoreScopeValue788.push("None") : chatCoreScopeValue796.forEach(chatCoreScopeValue797 => {
      const chatCoreScopeValue798 = chatCoreScopeValue797.role === "char" ? chatCoreScopeValue784 : chatCoreScopeValue794,
        chatCoreScopeValue799 = chatCoreScopeValue785 ? "[" + chatCoreScopeValue787(chatCoreScopeValue797.timestamp) + "] " : "";
      chatCoreScopeValue788.push("" + chatCoreScopeValue799 + chatCoreScopeValue798 + ": " + (chatCoreScopeValue797.text || ""));
    });
  }), chatCoreScopeValue788.join(`
`);
};
window.imApp.getXDirectMessageMountCandidates = function (chatCoreScopeValue800) {
  const chatCoreScopeValue801 = window.imApp.resolveFriendId(chatCoreScopeValue800);
  if (chatCoreScopeValue801 == null) return [];
  const chatCoreScopeValue802 = typeof window.getAppState === "function" ? window.getAppState("x") : window.__xFallbackState,
    chatCoreScopeValue803 = Array.isArray(chatCoreScopeValue802?.xDirectMessages) ? chatCoreScopeValue802.xDirectMessages : [],
    chatCoreScopeValue804 = chatCoreScopeValue805 => {
      if (!chatCoreScopeValue805 || typeof chatCoreScopeValue805 !== "object") return "";
      if (chatCoreScopeValue805.type === "post-card") {
        const chatCoreScopeValue806 = chatCoreScopeValue805.postSnapshot || chatCoreScopeValue805.post || {};
        return ("[X Post] " + String(chatCoreScopeValue806.text || chatCoreScopeValue806.content || "").trim()).trim();
      }
      return String(chatCoreScopeValue805.text || chatCoreScopeValue805.content || chatCoreScopeValue805.message || "").trim();
    };
  return chatCoreScopeValue803.filter(chatCoreScopeValue807 => chatCoreScopeValue807 && String(chatCoreScopeValue807.sourceFriendId || "") === String(chatCoreScopeValue801)).map((chatCoreScopeValue808, chatCoreScopeValue809) => {
    const chatCoreScopeValue810 = Array.isArray(chatCoreScopeValue808.messages) ? chatCoreScopeValue808.messages : [],
      chatCoreScopeValue811 = chatCoreScopeValue810[chatCoreScopeValue810.length - 1] || null,
      chatCoreScopeValue812 = Number(chatCoreScopeValue811?.createdAt || chatCoreScopeValue811?.timestamp || chatCoreScopeValue808.updatedAt || chatCoreScopeValue808.addedAt) || 0;
    return {
      id: String(chatCoreScopeValue808.id || ""),
      name: String(chatCoreScopeValue808.name || chatCoreScopeValue808.nickname || chatCoreScopeValue808.realName || "X Char"),
      handle: String(chatCoreScopeValue808.handle || ""),
      messages: chatCoreScopeValue810,
      messageCount: chatCoreScopeValue810.length,
      lastMessageText: chatCoreScopeValue804(chatCoreScopeValue811),
      updatedAt: chatCoreScopeValue812,
      index: chatCoreScopeValue809
    };
  }).filter(chatCoreScopeValue813 => chatCoreScopeValue813.id).sort((chatCoreScopeValue814, chatCoreScopeValue815) => chatCoreScopeValue815.updatedAt - chatCoreScopeValue814.updatedAt || chatCoreScopeValue814.index - chatCoreScopeValue815.index);
};
window.imApp.buildXDirectMessageMemoryContext = function (chatCoreScopeValue816, chatCoreScopeValue817 = {}) {
  const chatCoreScopeValue818 = window.imApp.normalizeFriendData(chatCoreScopeValue816 || {});
  if (chatCoreScopeValue818.type === "group") return "";
  const chatCoreScopeValue819 = window.imApp.normalizeXDirectMessageMount(chatCoreScopeValue818.memory?.xDirectMessageMount);
  if (!chatCoreScopeValue819.enabled) return "";
  const chatCoreScopeValue820 = window.imApp.getXDirectMessageMountCandidates(chatCoreScopeValue818),
    chatCoreScopeValue821 = chatCoreScopeValue820.find(chatCoreScopeValue850 => chatCoreScopeValue850.id === chatCoreScopeValue819.dmId) || (!chatCoreScopeValue819.dmId ? chatCoreScopeValue820[0] : null);
  if (!chatCoreScopeValue821) return "";
  const chatCoreScopeValue822 = Number(chatCoreScopeValue817.maxMessages),
    chatCoreScopeValue823 = chatCoreScopeValue817?.includeTime !== false,
    chatCoreScopeValue824 = Number.isFinite(chatCoreScopeValue822) ? Math.max(1, Math.min(50, Math.floor(chatCoreScopeValue822))) : chatCoreScopeValue819.limit,
    chatCoreScopeValue825 = chatCoreScopeValue818.nickname || chatCoreScopeValue818.realName || "Char",
    chatCoreScopeValue826 = chatCoreScopeValue821.name || "X Char",
    chatCoreScopeValue827 = chatCoreScopeValue851 => String(chatCoreScopeValue851 == null ? "" : chatCoreScopeValue851).replace(/[<>]/g, chatCoreScopeValue852 => chatCoreScopeValue852 === "<" ? "‹" : "›").slice(0, 800),
    chatCoreScopeValue828 = chatCoreScopeValue853 => {
      const chatCoreScopeValue854 = Number(chatCoreScopeValue853) || 0;
      if (!chatCoreScopeValue854) return "Unknown time";
      const chatCoreScopeValue855 = new Date(chatCoreScopeValue854);
      return window.imDataUtils?.formatUsDateTime ? window.imDataUtils.formatUsDateTime(chatCoreScopeValue855) : chatCoreScopeValue855.toLocaleString("en-US", {
        hour12: true
      });
    },
    chatCoreNewScope837 = chatCoreNewScope866 => {
      if (!chatCoreNewScope866 || typeof chatCoreNewScope866 !== "object") return "";
      const chatCoreNewScope867 = chatCoreNewScope866.type === "post-card",
        chatCoreNewScope868 = chatCoreNewScope867 ? chatCoreNewScope866.postSnapshot || chatCoreNewScope866.post || {} : null,
        chatCoreNewScope869 = chatCoreNewScope867 ? "[X Post] " + (chatCoreNewScope868?.["name"] || "") + " " + (chatCoreNewScope868?.["text"] || chatCoreNewScope868?.["content"] || "") : chatCoreNewScope866.text || chatCoreNewScope866.content || chatCoreNewScope866.message || "",
        chatCoreNewScope870 = chatCoreScopeValue827(chatCoreNewScope869).trim();
      if (!chatCoreNewScope870) return "";
      const chatCoreNewScope871 = chatCoreNewScope866.source === "user" || chatCoreNewScope866.sender === "user" ? "User" : chatCoreScopeValue826,
        chatCoreNewScope872 = chatCoreScopeValue823 ? "[" + chatCoreScopeValue828(chatCoreNewScope866.createdAt || chatCoreNewScope866.timestamp) + "] " : "";
      return "" + chatCoreNewScope872 + chatCoreNewScope871 + ": " + chatCoreNewScope870;
    },
    chatCoreNewScope838 = typeof window.getAppState === "function" ? window.getAppState("x") : window.__xFallbackState,
    chatCoreNewScope839 = Array.isArray(chatCoreNewScope838?.["xDirectMessages"]) ? chatCoreNewScope838.xDirectMessages : [],
    chatCoreScopeValue832 = Array.isArray(chatCoreNewScope838?.["xGeneratedPosts"]) ? chatCoreNewScope838.xGeneratedPosts : [],
    chatCoreScopeValue833 = chatCoreNewScope839.find(chatCoreScopeValue890 => String(chatCoreScopeValue890?.["id"] || "") === String(chatCoreScopeValue821.id)) || {},
    chatCoreNewScope842 = chatCoreNewScope874 => String(chatCoreNewScope874 == null ? "" : chatCoreNewScope874).split("·")[0].trim().replace(/^@/, "").toLocaleLowerCase(),
    chatCoreNewScope843 = chatCoreScopeValue891 => Number(chatCoreScopeValue891?.["createdAt"] || chatCoreScopeValue891?.["timestamp"] || chatCoreScopeValue891?.["publishedAt"] || 0) || 0,
    chatCoreNewScope844 = chatCoreNewScope876 => String(chatCoreNewScope876?.["text"] || chatCoreNewScope876?.["content"] || "").trim(),
    chatCoreNewScope845 = chatCoreNewScope877 => chatCoreNewScope842(chatCoreNewScope877?.["handle"] || chatCoreNewScope877?.["authorHandle"] || chatCoreNewScope877?.["accountHandle"]),
    chatCoreNewScope846 = chatCoreNewScope878 => String(chatCoreNewScope878?.["authorName"] || chatCoreNewScope878?.["name"] || chatCoreNewScope878?.["displayName"] || "").trim(),
    chatCoreNewScope847 = chatCoreNewScope842(chatCoreNewScope838?.["xData"]?.["handle"]),
    chatCoreNewScope848 = chatCoreNewScope842(chatCoreScopeValue821.handle),
    chatCoreNewScope849 = String(chatCoreScopeValue821.name || "").trim().toLocaleLowerCase(),
    chatCoreScopeValue842 = chatCoreNewScope879 => {
      const chatCoreNewScope880 = String(chatCoreNewScope879?.["authorId"] || chatCoreNewScope879?.["accountId"] || "").trim();
      if (chatCoreNewScope880 === "me" || chatCoreNewScope880 === "user:self" || chatCoreNewScope880 === "current-user") return true;
      const chatCoreNewScope881 = chatCoreNewScope845(chatCoreNewScope879);
      return Boolean(chatCoreNewScope847 && chatCoreNewScope881 && chatCoreNewScope847 === chatCoreNewScope881);
    },
    chatCoreScopeValue843 = chatCoreNewScope882 => {
      const chatCoreNewScope883 = String(chatCoreNewScope882?.["authorId"] || chatCoreNewScope882?.["profileOwnerId"] || chatCoreNewScope882?.["accountId"] || "").trim();
      if (chatCoreNewScope883 && chatCoreNewScope883 === String(chatCoreScopeValue821.id)) return true;
      const chatCoreNewScope884 = chatCoreNewScope845(chatCoreNewScope882);
      if (chatCoreNewScope848 && chatCoreNewScope884 && chatCoreNewScope848 === chatCoreNewScope884) return true;
      return !chatCoreNewScope884 && !!chatCoreNewScope849 && chatCoreNewScope846(chatCoreNewScope882).toLocaleLowerCase() === chatCoreNewScope849;
    },
    chatCoreNewScope852 = (chatCoreNewScope885, chatCoreNewScope886) => {
      const chatCoreNewScope887 = chatCoreScopeValue827(chatCoreNewScope844(chatCoreNewScope885)).trim();
      if (!chatCoreNewScope887) return "";
      const chatCoreNewScope888 = chatCoreScopeValue827(chatCoreNewScope885?.["topicTag"] || "").trim(),
        chatCoreNewScope889 = chatCoreScopeValue823 ? "[" + chatCoreScopeValue828(chatCoreNewScope843(chatCoreNewScope885)) + "] " : "";
      return "" + chatCoreNewScope889 + chatCoreNewScope886 + " posted on X" + (chatCoreNewScope888 ? " (" + chatCoreNewScope888 + ")" : "") + ": " + chatCoreNewScope887;
    },
    chatCoreScopeValue845 = (chatCoreNewScope890, chatCoreNewScope891) => {
      const chatCoreNewScope892 = new Set();
      return (Array.isArray(chatCoreNewScope890) ? chatCoreNewScope890 : []).slice().filter(chatCoreNewScope893 => chatCoreNewScope844(chatCoreNewScope893)).sort((chatCoreNewScope894, chatCoreNewScope895) => chatCoreNewScope843(chatCoreNewScope895) - chatCoreNewScope843(chatCoreNewScope894)).filter(chatCoreNewScope896 => {
        const chatCoreNewScope897 = String(chatCoreNewScope896?.["id"] || "") || chatCoreNewScope843(chatCoreNewScope896) + ":" + chatCoreNewScope844(chatCoreNewScope896);
        if (chatCoreNewScope892.has(chatCoreNewScope897)) return false;
        return chatCoreNewScope892.add(chatCoreNewScope897), true;
      }).slice(0, chatCoreScopeValue824).sort((chatCoreNewScope898, chatCoreNewScope899) => chatCoreNewScope843(chatCoreNewScope898) - chatCoreNewScope843(chatCoreNewScope899)).map(chatCoreNewScope900 => chatCoreNewScope852(chatCoreNewScope900, chatCoreNewScope891)).filter(Boolean);
    },
    chatCoreScopeValue846 = chatCoreScopeValue821.messages.slice().sort((chatCoreNewScope901, chatCoreScopeValue892) => Number(chatCoreNewScope901?.["createdAt"] || chatCoreNewScope901?.["timestamp"] || 0) - Number(chatCoreScopeValue892?.["createdAt"] || chatCoreScopeValue892?.["timestamp"] || 0)).slice(-chatCoreScopeValue824).map(chatCoreNewScope837).filter(Boolean),
    chatCoreScopeValue847 = chatCoreScopeValue845(chatCoreScopeValue832.filter(chatCoreScopeValue842), "User"),
    chatCoreScopeValue848 = [...(Array.isArray(chatCoreScopeValue833.profilePosts) ? chatCoreScopeValue833.profilePosts : []), ...chatCoreScopeValue832.filter(chatCoreScopeValue843)],
    chatCoreScopeValue849 = chatCoreScopeValue845(chatCoreScopeValue848, "Current Char (" + chatCoreScopeValue826 + ")");
  if (chatCoreScopeValue846.length === 0 && chatCoreScopeValue847.length === 0 && chatCoreScopeValue849.length === 0) return "";
  return `<mounted_x_direct_message_context>
Source: mounted X app social context for the same Char. This is prior cross-platform context, not a message sent in the current iMessage thread.
Mounted X thread: ` + chatCoreScopeValue827(chatCoreScopeValue826) + (chatCoreScopeValue821.handle ? " (" + chatCoreScopeValue827(chatCoreScopeValue821.handle) + ")" : "") + `
Use it only to maintain continuity with User. Do not say other characters saw it, and do not present any of this as an iMessage bubble.
Current iMessage Char: ` + chatCoreScopeValue827(chatCoreScopeValue825) + `

<x_private_direct_messages>
Scope: prior one-to-one private X direct messages between User and the current Char. These are neither public posts nor iMessage bubbles.
` + (chatCoreScopeValue846.length ? chatCoreScopeValue846.join(`
`) : "None") + `
</x_private_direct_messages>

<x_user_public_posts>
Scope: User's public X posts.
Ownership hard rule: every post in this block was authored and publicly posted by User, not by you (the current Char). Never claim, imply, remember, or refer to any of these posts as your own.
` + (chatCoreScopeValue847.length ? chatCoreScopeValue847.join(`
`) : "None") + `
</x_user_public_posts>

<x_current_char_own_public_posts>
Scope: the current Char's own public X profile posts.
Ownership hard rule: every post in this block was authored and publicly posted by you, the current Char. Treat it as your own public content; do not deny authorship or describe it as User's or someone else's post.
` + (chatCoreScopeValue849.length ? chatCoreScopeValue849.join(`
`) : "None") + `
</x_current_char_own_public_posts>
</mounted_x_direct_message_context>`;
};
window.imApp.getBstagePopMountCandidates = function () {
  const chatCoreScopeValue893 = typeof window.getAppState === "function" ? window.getAppState("bstage") : window.__bstageGlobalState,
    chatCoreScopeValue894 = [chatCoreScopeValue893?.bstageUserTeamState, ...(Array.isArray(chatCoreScopeValue893?.teams) ? chatCoreScopeValue893.teams : [])];
  return chatCoreScopeValue894.filter(chatCoreScopeValue895 => chatCoreScopeValue895 && chatCoreScopeValue895.id != null).flatMap(chatCoreScopeValue896 => (Array.isArray(chatCoreScopeValue896.members) ? chatCoreScopeValue896.members : []).filter(chatCoreScopeValue897 => chatCoreScopeValue897 && chatCoreScopeValue897.id != null && !chatCoreScopeValue897.isUserMember && String(chatCoreScopeValue897.id) !== "__bstage_user_member__").map(chatCoreScopeValue898 => ({
    teamId: String(chatCoreScopeValue896.id),
    memberId: String(chatCoreScopeValue898.id),
    teamName: String(chatCoreScopeValue896.id) === "__bstage_user_team__" || chatCoreScopeValue896.isUserTeam ? "我的团队" : String(chatCoreScopeValue896.name || "未命名团队"),
    name: String(chatCoreScopeValue898.name || "未命名 Char"),
    sourceFriendId: chatCoreScopeValue898.sourceFriendId == null ? "" : String(chatCoreScopeValue898.sourceFriendId),
    member: chatCoreScopeValue898
  })));
};
window.imApp.getMountedBstagePopMember = function (chatCoreScopeValue899) {
  const chatCoreScopeValue900 = window.imApp.normalizeBstagePopMount(chatCoreScopeValue899?.memory?.bstagePopMount);
  if (!chatCoreScopeValue900.teamId || !chatCoreScopeValue900.memberId) return null;
  return window.imApp.getBstagePopMountCandidates().find(chatCoreScopeValue901 => chatCoreScopeValue901.teamId === chatCoreScopeValue900.teamId && chatCoreScopeValue901.memberId === chatCoreScopeValue900.memberId) || null;
};
window.imApp.formatCrossAppActivityTime = function (chatCoreScopeValue902) {
  const chatCoreScopeValue903 = Number(chatCoreScopeValue902);
  if (!Number.isFinite(chatCoreScopeValue903) || chatCoreScopeValue903 <= 0) return "";
  const chatCoreScopeValue904 = new Date(chatCoreScopeValue903);
  if (Number.isNaN(chatCoreScopeValue904.getTime())) return "";
  const chatCoreScopeValue905 = chatCoreScopeValue906 => String(chatCoreScopeValue906).padStart(2, "0");
  return chatCoreScopeValue904.getFullYear() + "-" + chatCoreScopeValue905(chatCoreScopeValue904.getMonth() + 1) + "-" + chatCoreScopeValue905(chatCoreScopeValue904.getDate()) + " " + chatCoreScopeValue905(chatCoreScopeValue904.getHours()) + ":" + chatCoreScopeValue905(chatCoreScopeValue904.getMinutes());
};
window.imApp.sanitizeCrossAppActivity = function (chatCoreScopeValue907) {
  return String(chatCoreScopeValue907 == null ? "" : chatCoreScopeValue907).replace(/[<>]/g, chatCoreScopeValue908 => chatCoreScopeValue908 === "<" ? "‹" : "›").replace(/\s+/g, " ").trim().slice(0, 400);
};
window.imApp.buildBstagePopMemoryContext = function (chatCoreScopeValue909) {
  const chatCoreScopeValue910 = window.imApp.normalizeFriendData(chatCoreScopeValue909 || {});
  if (chatCoreScopeValue910.type !== "char") return "";
  const chatCoreScopeValue911 = window.imApp.normalizeBstagePopMount(chatCoreScopeValue910.memory?.bstagePopMount);
  if (!chatCoreScopeValue911.enabled) return "";
  const chatCoreScopeValue912 = window.imApp.getMountedBstagePopMember(chatCoreScopeValue910);
  if (!chatCoreScopeValue912) return "";
  const chatCoreScopeValue913 = Array.isArray(chatCoreScopeValue912.member.chatHistory) ? chatCoreScopeValue912.member.chatHistory : [],
    chatCoreScopeValue914 = chatCoreScopeValue913.filter(chatCoreScopeValue915 => chatCoreScopeValue915 && chatCoreScopeValue915.isUser === false && ["text", "image"].includes(chatCoreScopeValue915.type)).slice(-10).map(chatCoreScopeValue916 => {
      const chatCoreScopeValue917 = chatCoreScopeValue916.type === "image" ? "[图片] " + (chatCoreScopeValue916.imgDesc || "") : chatCoreScopeValue916.text,
        chatCoreScopeValue918 = window.imApp.sanitizeCrossAppActivity(chatCoreScopeValue917);
      if (!chatCoreScopeValue918) return "";
      const chatCoreScopeValue919 = window.imApp.formatCrossAppActivityTime(chatCoreScopeValue916.timestamp);
      return "" + (chatCoreScopeValue919 ? "[" + chatCoreScopeValue919 + "] " : "") + chatCoreScopeValue918;
    }).filter(Boolean);
  if (!chatCoreScopeValue914.length) return "";
  return `<mounted_bstage_pop_activity>
Source: your own recent b.stage POP messages as the same Char. This account belongs to you; these are activities you did, not messages in the current iMessage chat.
Do not infer what any fan said, who the fan is, or that a POP fan is User. Do not reproduce this as iMessage bubbles.
` + chatCoreScopeValue914.join(`
`) + `
</mounted_bstage_pop_activity>`;
};
window.imApp.buildImessageCharActivityForBstage = async function (chatCoreScopeValue920, chatCoreScopeValue921) {
  const chatCoreScopeValue922 = (window.imData?.friends || []).filter(chatCoreScopeValue926 => {
    if (!chatCoreScopeValue926 || chatCoreScopeValue926.type !== "char") return false;
    const chatCoreScopeValue927 = window.imApp.normalizeBstagePopMount(chatCoreScopeValue926.memory?.bstagePopMount);
    return chatCoreScopeValue927.enabled && chatCoreScopeValue927.teamId === String(chatCoreScopeValue920) && chatCoreScopeValue927.memberId === String(chatCoreScopeValue921);
  });
  if (chatCoreScopeValue922.length !== 1) return "";
  const chatCoreScopeValue923 = chatCoreScopeValue922[0],
    chatCoreScopeValue924 = await window.imApp.ensureFriendRecentMessagesLoaded(chatCoreScopeValue923, {
      limit: 90
    }),
    chatCoreScopeValue925 = (Array.isArray(chatCoreScopeValue924) ? chatCoreScopeValue924 : []).filter(chatCoreScopeValue928 => chatCoreScopeValue928 && chatCoreScopeValue928.role === "assistant" && !["system_notice", "date"].includes(chatCoreScopeValue928.type)).slice(-10).map(chatCoreScopeValue929 => {
      const chatCoreScopeValue930 = chatCoreScopeValue929.type === "image" ? "[图片] " + (chatCoreScopeValue929.description || chatCoreScopeValue929.imgDesc || chatCoreScopeValue929.text || "") : chatCoreScopeValue929.content || chatCoreScopeValue929.text || "",
        chatCoreScopeValue931 = window.imApp.sanitizeCrossAppActivity(chatCoreScopeValue930);
      if (!chatCoreScopeValue931) return "";
      const chatCoreScopeValue932 = window.imApp.formatCrossAppActivityTime(chatCoreScopeValue929.timestamp);
      return "" + (chatCoreScopeValue932 ? "[" + chatCoreScopeValue932 + "] " : "") + chatCoreScopeValue931;
    }).filter(Boolean);
  if (!chatCoreScopeValue925.length) return "";
  return `<private_imessage_char_activity>
These are your own recent iMessage remarks, private background about your activities only. The current POP fan is not the iMessage User. Never quote, paraphrase, hint at, or disclose the iMessage private conversation, User's identity, relationship, or personal details to POP fans. Use only non-private facts about your own day for consistency.
` + chatCoreScopeValue925.join(`
`) + `
</private_imessage_char_activity>`;
};
window.imApp.getMomentMessages = function () {
  return Array.isArray(window.imData.momentMessages) ? window.imData.momentMessages : [];
};
window.imApp.setMomentMessages = function (chatCoreScopeValue933) {
  window.imData.momentMessages = Array.isArray(chatCoreScopeValue933) ? chatCoreScopeValue933 : [];
};
const chatCoreScopeValue3 = new Map();
const chatCoreScopeValue4 = new Map();
window.imApp.getFriendMessageCount = function (chatCoreScopeValue934) {
  const chatCoreScopeValue935 = typeof chatCoreScopeValue934 === "object" && chatCoreScopeValue934 !== null ? chatCoreScopeValue934 : (window.imData.friends || []).find(chatCoreScopeValue938 => String(chatCoreScopeValue938?.id) === String(chatCoreScopeValue934));
  if (!chatCoreScopeValue935) return 0;
  if (chatCoreScopeValue935.messagesLoaded === true && Array.isArray(chatCoreScopeValue935.messages)) return chatCoreScopeValue935.messages.length;
  const chatCoreScopeValue936 = Number(chatCoreScopeValue935.messageCount);
  if (Number.isFinite(chatCoreScopeValue936) && chatCoreScopeValue936 >= 0) return Math.round(chatCoreScopeValue936);
  const chatCoreScopeValue937 = Number(chatCoreScopeValue3.get(String(chatCoreScopeValue935.id))?.totalCount);
  if (Number.isFinite(chatCoreScopeValue937) && chatCoreScopeValue937 >= 0) return Math.round(chatCoreScopeValue937);
  return Array.isArray(chatCoreScopeValue935.messages) ? chatCoreScopeValue935.messages.length : 0;
};
window.imApp.repairFriendMessageCount = function (chatCoreScopeValue939, chatCoreScopeValue940) {
  if (!chatCoreScopeValue939 || !Number.isFinite(Number(chatCoreScopeValue940)) || Number(chatCoreScopeValue940) < 0) return false;
  const chatCoreScopeValue941 = Math.round(Number(chatCoreScopeValue940)),
    chatCoreScopeValue942 = Number(chatCoreScopeValue939.messageCount);
  chatCoreScopeValue939.messageCount = chatCoreScopeValue941;
  if (chatCoreScopeValue942 === chatCoreScopeValue941 || !window.imStorage?.patchFriendMeta) return false;
  return Promise.resolve(window.imStorage.patchFriendMeta(chatCoreScopeValue939.id, {
    messageCount: chatCoreScopeValue941
  }))["catch"](chatCoreScopeValue943 => console.warn("Failed to repair friend message count", chatCoreScopeValue939.id, chatCoreScopeValue943)), true;
};
window.imApp.getFriendRecentMessageWindow = function (chatCoreScopeValue944) {
  const chatCoreScopeValue945 = typeof chatCoreScopeValue944 === "object" && chatCoreScopeValue944 !== null ? chatCoreScopeValue944.id : chatCoreScopeValue944;
  if (chatCoreScopeValue945 == null) return null;
  return chatCoreScopeValue3.get(String(chatCoreScopeValue945)) || null;
};
window.imApp.restoreLoadedMemoryRequests = function (chatCoreScopeValue946, chatCoreScopeValue947) {
  const chatCoreScopeValue948 = new Set((Array.isArray(chatCoreScopeValue946?.memory?.cherishedEntries) ? chatCoreScopeValue946.memory.cherishedEntries : []).map(chatCoreScopeValue949 => String(chatCoreScopeValue949?.sourceEventId || "")).filter(Boolean));
  return (Array.isArray(chatCoreScopeValue947) ? chatCoreScopeValue947 : []).forEach(chatCoreScopeValue950 => {
    if (chatCoreScopeValue950?.type !== "memory_request") return;
    const chatCoreScopeValue951 = String(chatCoreScopeValue950.memoryRequestId || chatCoreScopeValue950.id || "");
    chatCoreScopeValue950.memoryRequestId = chatCoreScopeValue951;
    !["pending", "confirmed", "cancelled"].includes(chatCoreScopeValue950.requestStatus) && (chatCoreScopeValue950.requestStatus = chatCoreScopeValue948.has(chatCoreScopeValue951) ? "confirmed" : "pending");
    (!chatCoreScopeValue950.memoryPayload || typeof chatCoreScopeValue950.memoryPayload !== "object") && (chatCoreScopeValue950.memoryPayload = {
      title: "珍视回忆",
      content: String(chatCoreScopeValue950.content || "")
    });
    chatCoreScopeValue950.excludedFromContext = true;
  }), chatCoreScopeValue947;
};
window.imApp.ensureFriendRecentMessagesLoaded = async function (chatCoreScopeValue952, chatCoreScopeValue953 = {}) {
  const chatCoreScopeValue954 = typeof chatCoreScopeValue952 === "object" && chatCoreScopeValue952 !== null ? chatCoreScopeValue952.id : chatCoreScopeValue952;
  if (chatCoreScopeValue954 == null) return [];
  const chatCoreScopeValue955 = String(chatCoreScopeValue954),
    chatCoreScopeValue956 = (window.imData.friends || []).find(chatCoreScopeValue960 => String(chatCoreScopeValue960.id) === chatCoreScopeValue955);
  if (!chatCoreScopeValue956) return [];
  if (chatCoreScopeValue956.messagesLoaded && Array.isArray(chatCoreScopeValue956.messages)) return chatCoreScopeValue956.messages;
  const chatCoreScopeValue957 = chatCoreScopeValue3.get(chatCoreScopeValue955);
  if (chatCoreScopeValue957?.loaded && Array.isArray(chatCoreScopeValue956.messages)) return chatCoreScopeValue956.messages;
  const chatCoreScopeValue958 = chatCoreScopeValue4.get(chatCoreScopeValue955);
  if (chatCoreScopeValue958) return chatCoreScopeValue958;
  if (!window.imStorage?.loadRecentMessagesByFriendId) return window.imApp.ensureFriendMessagesLoaded ? window.imApp.ensureFriendMessagesLoaded(chatCoreScopeValue956, chatCoreScopeValue953) : [];
  const chatCoreScopeValue959 = (async () => {
    try {
      const chatCoreScopeValue961 = await window.imStorage.loadRecentMessagesByFriendId(chatCoreScopeValue955, {
        limit: chatCoreScopeValue953.limit || 90
      });
      chatCoreScopeValue956.messages = window.imApp.restoreLoadedMemoryRequests(chatCoreScopeValue956, Array.isArray(chatCoreScopeValue961?.messages) ? chatCoreScopeValue961.messages : []);
      chatCoreScopeValue956.messagesLoaded = false;
      window.imApp.repairFriendMessageCount(chatCoreScopeValue956, chatCoreScopeValue961?.totalCount);
      chatCoreScopeValue3.set(chatCoreScopeValue955, {
        loaded: true,
        hasMore: chatCoreScopeValue961?.hasMore === true,
        oldestOrder: Number.isFinite(Number(chatCoreScopeValue961?.oldestOrder)) ? Number(chatCoreScopeValue961.oldestOrder) : null,
        totalCount: window.imApp.getFriendMessageCount(chatCoreScopeValue956)
      });
      if (typeof chatCoreScopeValue953.onLoaded === "function") chatCoreScopeValue953.onLoaded(chatCoreScopeValue956.messages, chatCoreScopeValue956);
      return chatCoreScopeValue956.messages;
    } catch (chatCoreScopeValue962) {
      return console.error("Failed to load recent friend messages", chatCoreScopeValue962), window.imApp.ensureFriendMessagesLoaded ? window.imApp.ensureFriendMessagesLoaded(chatCoreScopeValue956, chatCoreScopeValue953) : [];
    } finally {
      chatCoreScopeValue4.get(chatCoreScopeValue955) === chatCoreScopeValue959 && chatCoreScopeValue4["delete"](chatCoreScopeValue955);
    }
  })();
  return chatCoreScopeValue4.set(chatCoreScopeValue955, chatCoreScopeValue959), chatCoreScopeValue959;
};
window.imApp.loadEarlierFriendMessages = async function (chatCoreScopeValue963, chatCoreScopeValue964 = {}) {
  const chatCoreScopeValue965 = typeof chatCoreScopeValue963 === "object" && chatCoreScopeValue963 !== null ? chatCoreScopeValue963.id : chatCoreScopeValue963;
  if (chatCoreScopeValue965 == null) return {
    messages: [],
    addedCount: 0,
    hasMore: false
  };
  const chatCoreScopeValue966 = String(chatCoreScopeValue965),
    chatCoreScopeValue967 = (window.imData.friends || []).find(chatCoreScopeValue974 => String(chatCoreScopeValue974.id) === chatCoreScopeValue966),
    chatCoreScopeValue968 = chatCoreScopeValue3.get(chatCoreScopeValue966);
  if (!chatCoreScopeValue967 || chatCoreScopeValue967.messagesLoaded || !chatCoreScopeValue968?.hasMore || !window.imStorage?.loadRecentMessagesByFriendId) return {
    messages: Array.isArray(chatCoreScopeValue967?.messages) ? chatCoreScopeValue967.messages : [],
    addedCount: 0,
    hasMore: chatCoreScopeValue968?.hasMore === true
  };
  const chatCoreScopeValue969 = await window.imStorage.loadRecentMessagesByFriendId(chatCoreScopeValue966, {
      limit: chatCoreScopeValue964.limit || 60,
      beforeOrder: chatCoreScopeValue968.oldestOrder
    }),
    chatCoreScopeValue970 = window.imApp.restoreLoadedMemoryRequests(chatCoreScopeValue967, Array.isArray(chatCoreScopeValue969?.messages) ? chatCoreScopeValue969.messages : []);
  window.imApp.repairFriendMessageCount(chatCoreScopeValue967, chatCoreScopeValue969?.totalCount);
  const chatCoreScopeValue971 = Array.isArray(chatCoreScopeValue967.messages) ? chatCoreScopeValue967.messages : [],
    chatCoreScopeValue972 = new Set(chatCoreScopeValue971.map(chatCoreScopeValue975 => String(chatCoreScopeValue975?.id || "")).filter(Boolean)),
    chatCoreScopeValue973 = chatCoreScopeValue970.filter(chatCoreScopeValue976 => !chatCoreScopeValue976?.id || !chatCoreScopeValue972.has(String(chatCoreScopeValue976.id)));
  return chatCoreScopeValue967.messages = [...chatCoreScopeValue973, ...chatCoreScopeValue971], chatCoreScopeValue3.set(chatCoreScopeValue966, {
    loaded: true,
    hasMore: chatCoreScopeValue969?.hasMore === true,
    oldestOrder: Number.isFinite(Number(chatCoreScopeValue969?.oldestOrder)) ? Number(chatCoreScopeValue969.oldestOrder) : chatCoreScopeValue968.oldestOrder,
    totalCount: window.imApp.getFriendMessageCount(chatCoreScopeValue967)
  }), {
    messages: chatCoreScopeValue967.messages,
    addedCount: chatCoreScopeValue973.length,
    hasMore: chatCoreScopeValue969?.hasMore === true
  };
};
window.imApp.ensureFriendMessagesLoaded = async function (chatCoreScopeValue977, chatCoreScopeValue978 = {}) {
  const chatCoreScopeValue979 = typeof chatCoreScopeValue977 === "object" && chatCoreScopeValue977 !== null ? chatCoreScopeValue977.id : chatCoreScopeValue977;
  if (chatCoreScopeValue979 == null) return [];
  const chatCoreScopeValue980 = (window.imData.friends || []).find(chatCoreScopeValue981 => String(chatCoreScopeValue981.id) === String(chatCoreScopeValue979));
  if (!chatCoreScopeValue980) return [];
  if (chatCoreScopeValue980.messagesLoaded && Array.isArray(chatCoreScopeValue980.messages)) return chatCoreScopeValue3["delete"](String(chatCoreScopeValue979)), chatCoreScopeValue980.messages;
  try {
    const chatCoreScopeValue982 = chatCoreScopeValue3.get(String(chatCoreScopeValue979)),
      chatCoreScopeValue983 = Array.isArray(chatCoreScopeValue980.messages) ? chatCoreScopeValue980.messages : [],
      chatCoreScopeValue984 = String(chatCoreScopeValue983[0]?.id || ""),
      chatCoreScopeValue985 = typeof document !== "undefined" ? document.querySelector("#chat-interface-" + chatCoreScopeValue979 + " .ins-chat-messages") : null,
      chatCoreScopeValue986 = Number(chatCoreScopeValue985?._imHistoryState?.visibleStartIndex) || 0;
    if (!window.imStorage || !window.imStorage.loadMessagesByFriendId) {
      if (chatCoreScopeValue978.requireComplete === true && chatCoreScopeValue980.messagesLoaded !== true) throw new Error("Complete friend message storage is unavailable");
      return chatCoreScopeValue980.messages = Array.isArray(chatCoreScopeValue980.messages) ? chatCoreScopeValue980.messages : [], chatCoreScopeValue980.messagesLoaded = true, chatCoreScopeValue980.messages;
    }
    const chatCoreScopeValue987 = await window.imStorage.loadMessagesByFriendId(chatCoreScopeValue979);
    chatCoreScopeValue980.messages = window.imApp.restoreLoadedMemoryRequests(chatCoreScopeValue980, Array.isArray(chatCoreScopeValue987) ? chatCoreScopeValue987 : []);
    chatCoreScopeValue980.messagesLoaded = true;
    chatCoreScopeValue3["delete"](String(chatCoreScopeValue979));
    window.imApp.repairFriendMessageCount(chatCoreScopeValue980, chatCoreScopeValue980.messages.length);
    if (chatCoreScopeValue982 && chatCoreScopeValue985?._imHistoryState && chatCoreScopeValue984) {
      const chatCoreScopeValue988 = chatCoreScopeValue980.messages.findIndex(chatCoreScopeValue989 => String(chatCoreScopeValue989?.id || "") === chatCoreScopeValue984);
      chatCoreScopeValue988 >= 0 && (chatCoreScopeValue985._imHistoryState.visibleStartIndex = chatCoreScopeValue988 + chatCoreScopeValue986, Number.isFinite(Number(chatCoreScopeValue985._imHistoryState.visibleEndIndex)) && (chatCoreScopeValue985._imHistoryState.visibleEndIndex += chatCoreScopeValue988), chatCoreScopeValue985._imHistoryState.totalMessages = chatCoreScopeValue980.messages.length);
    }
    if (chatCoreScopeValue980.messages.length > 0) {
      const chatCoreScopeValue990 = chatCoreScopeValue980.messages.filter(chatCoreScopeValue992 => window.imApp.getFriendMessagePreview(chatCoreScopeValue992, chatCoreScopeValue980)),
        chatCoreScopeValue991 = chatCoreScopeValue990.length > 0 ? chatCoreScopeValue990[chatCoreScopeValue990.length - 1] : null;
      chatCoreScopeValue980.lastMessageTimestamp = Number(chatCoreScopeValue991?.timestamp) || chatCoreScopeValue980.lastMessageTimestamp || 0;
      chatCoreScopeValue980.lastMessagePreview = (chatCoreScopeValue991 ? window.imApp.getFriendMessagePreview(chatCoreScopeValue991, chatCoreScopeValue980) : "") || (chatCoreScopeValue980.type === "group" && chatCoreScopeValue980.showGroupTitles === false ? "" : chatCoreScopeValue980.lastMessagePreview) || "";
    }
    return typeof chatCoreScopeValue978.onLoaded === "function" && chatCoreScopeValue978.onLoaded(chatCoreScopeValue980.messages, chatCoreScopeValue980), chatCoreScopeValue980.messages;
  } catch (chatCoreScopeValue993) {
    console.error("Failed to load friend messages on demand", chatCoreScopeValue993);
    chatCoreScopeValue980.messages = Array.isArray(chatCoreScopeValue980.messages) ? chatCoreScopeValue980.messages : [];
    chatCoreScopeValue980.messagesLoaded = false;
    if (chatCoreScopeValue978.requireComplete === true) throw chatCoreScopeValue993;
    return chatCoreScopeValue980.messages;
  }
};
window.imApp.getMomentsCoverUrl = function () {
  return window.imData.momentsCoverUrl || null;
};
window.imApp.setMomentsCoverUrl = function (chatCoreScopeValue994) {
  window.imData.momentsCoverUrl = chatCoreScopeValue994 || null;
};
window.imApp.cloneDataSnapshot = function (chatCoreScopeValue995) {
  if (typeof structuredClone === "function") return structuredClone(chatCoreScopeValue995);
  return JSON.parse(JSON.stringify(chatCoreScopeValue995));
};
window.imApp.buildPersistedData = function () {
  return {
    friends: window.imApp.cloneDataSnapshot(Array.isArray(window.imData.friends) ? window.imData.friends : []),
    moments: window.imApp.cloneDataSnapshot(Array.isArray(window.imData.moments) ? window.imData.moments : []),
    momentMessages: window.imApp.cloneDataSnapshot(Array.isArray(window.imData.momentMessages) ? window.imData.momentMessages : []),
    stickers: window.imApp.cloneDataSnapshot(Array.isArray(window.imData.stickers) ? window.imData.stickers : []),
    momentsCoverUrl: window.imData.momentsCoverUrl || null
  };
};
window.imApp.markMomentsLoaded = function (chatCoreScopeValue996 = true) {
  window.imData.momentsLoaded = !!chatCoreScopeValue996;
};
window.imApp.markMomentMessagesLoaded = function (chatCoreScopeValue997 = true) {
  window.imData.momentMessagesLoaded = !!chatCoreScopeValue997;
};
window.imApp.markStickersLoaded = function (chatCoreScopeValue998 = true) {
  window.imData.stickersLoaded = !!chatCoreScopeValue998;
};
window.imApp.isGiftContextMessage = function (chatCoreScopeValue999) {
  return chatCoreScopeValue999?.role === "system" && [chatCoreScopeValue999.content, chatCoreScopeValue999.text].some(chatCoreScopeValue1000 => typeof chatCoreScopeValue1000 === "string" && /^\[Gift event\]/.test(chatCoreScopeValue1000.trim()));
};
window.imApp.getFriendMessagePreview = function (chatCoreScopeValue1001, chatCoreScopeValue1002) {
  if (chatCoreScopeValue1001?.type === "file") return "[文件] " + (chatCoreScopeValue1001.fileData?.name || "未命名文件");
  const chatCoreScopeValue1003 = chatCoreScopeValue1001 || {};
  if (chatCoreScopeValue1003.type === "group_announcement") return "[群公告] " + (chatCoreScopeValue1003.payload?.["announcement"]?.["content"] || chatCoreScopeValue1003.text || "");
  if (chatCoreScopeValue1003.type === "file") return "[文件] " + (chatCoreScopeValue1003.fileData?.["name"] || "未命名文件");
  if (chatCoreScopeValue1003.type === "memory_request") return "";
  if (chatCoreScopeValue1003.type === "user_phone_access_card") {
    const chatCoreScopeValue1004 = Array.isArray(chatCoreScopeValue1003.visits) ? chatCoreScopeValue1003.visits : [];
    return "[查手机记录] 查看了 " + chatCoreScopeValue1004.length + " 个聊天";
  }
  if (chatCoreScopeValue1003.type === "chat_record_forward") return window.imApp.getChatRecordPreview ? window.imApp.getChatRecordPreview(chatCoreScopeValue1003) : "[聊天记录]";
  if (chatCoreScopeValue1003.type === "image") {
    const chatCoreScopeValue1005 = chatCoreScopeValue1003.text || chatCoreScopeValue1003.description || "",
      chatCoreScopeValue1006 = 1 + (Array.isArray(chatCoreScopeValue1003.albumImages) ? chatCoreScopeValue1003.albumImages.length : 0),
      chatCoreScopeValue1007 = chatCoreScopeValue1006 > 1 ? "[图片×" + chatCoreScopeValue1006 + "]" : "[图片]";
    return chatCoreScopeValue1005 ? (chatCoreScopeValue1007 + " " + chatCoreScopeValue1005).trim() : chatCoreScopeValue1007;
  }
  if (chatCoreScopeValue1003.type === "location") {
    const chatCoreScopeValue1008 = chatCoreScopeValue1003.locationName || chatCoreScopeValue1003.name || "共享位置",
      chatCoreScopeValue1009 = chatCoreScopeValue1003.locationAddress || chatCoreScopeValue1003.address || "",
      chatCoreScopeValue1010 = chatCoreScopeValue1003.locationNameTranslation || chatCoreScopeValue1003.nameTranslation || "",
      chatCoreScopeValue1011 = chatCoreScopeValue1003.locationAddressTranslation || chatCoreScopeValue1003.addressTranslation || "";
    return ("[位置] " + chatCoreScopeValue1008 + (chatCoreScopeValue1010 ? "（" + chatCoreScopeValue1010 + "）" : "") + (chatCoreScopeValue1009 ? " — " + chatCoreScopeValue1009 + (chatCoreScopeValue1011 ? "（" + chatCoreScopeValue1011 + "）" : "") : "")).trim();
  }
  if (chatCoreScopeValue1003.type === "voice_message") return ("[语音] " + (chatCoreScopeValue1003.transcript || chatCoreScopeValue1003.text || "")).trim();
  if (chatCoreScopeValue1003.type === "sticker") {
    const chatCoreScopeValue1012 = chatCoreScopeValue1003.stickerName || chatCoreScopeValue1003.text || "";
    return chatCoreScopeValue1012 ? ("[表情包] " + chatCoreScopeValue1012).trim() : "[表情包]";
  }
  if (chatCoreScopeValue1003.type === "moment_forward") {
    let chatCoreScopeValue1013 = "";
    try {
      if (chatCoreScopeValue1003.content) {
        const chatCoreScopeValue1014 = JSON.parse(chatCoreScopeValue1003.content);
        chatCoreScopeValue1013 = chatCoreScopeValue1014.text || "";
      }
    } catch (chatCoreScopeValue1015) {}
    return chatCoreScopeValue1013 ? ("[朋友圈] " + chatCoreScopeValue1013).trim() : "[朋友圈]";
  }
  if (chatCoreScopeValue1003.type === "pay_transfer") return ("[转账] " + (chatCoreScopeValue1003.description || "")).trim();
  if (chatCoreScopeValue1003.type === "gift") return `[Gift] ${chatCoreScopeValue1003.giftName || chatCoreScopeValue1003.text || ""}`.trim();
  if (chatCoreScopeValue1003.type === "group_red_packet") return ("[群红包] " + (chatCoreScopeValue1003.description || "")).trim();
  if (chatCoreScopeValue1003.type === "voice_call_record") return chatCoreScopeValue1003.text || ("[语音通话记录] " + (chatCoreScopeValue1003.statusText || "")).trim();
  if (chatCoreScopeValue1003.type === "together_listening_invite") {
    const chatCoreScopeValue1016 = chatCoreScopeValue1003.title || "未知歌曲";
    return "[一起听] " + chatCoreScopeValue1016 + (chatCoreScopeValue1003.inviteStatus === "accepted" ? " · 已接受" : "");
  }
  if (chatCoreScopeValue1003.type === "offline_invite") {
    const chatCoreScopeValue1017 = chatCoreScopeValue1003.inviteStatus === "accepted" ? " · 已接受" : chatCoreScopeValue1003.inviteStatus === "declined" ? " · 已婉拒" : chatCoreScopeValue1003.inviteStatus === "superseded" ? " · 已失效" : "";
    return "[线下邀请] " + (chatCoreScopeValue1003.title || "见面") + chatCoreScopeValue1017;
  }
  if (chatCoreScopeValue1003.type === "fake_link") {
    const chatCoreScopeValue1018 = chatCoreScopeValue1003.fakeLinkData && typeof chatCoreScopeValue1003.fakeLinkData === "object" ? chatCoreScopeValue1003.fakeLinkData : {},
      chatCoreScopeValue1019 = chatCoreScopeValue1018.siteName || "假链接",
      chatCoreScopeValue1020 = chatCoreScopeValue1018.title || chatCoreScopeValue1003.content || "";
    return ("[" + chatCoreScopeValue1019 + "] " + chatCoreScopeValue1020).trim();
  }
  if (chatCoreScopeValue1003.type === "offline_meeting_record") return "[见面记录]";
  if (chatCoreScopeValue1003.type === "system_notice") {
    const chatCoreScopeValue1021 = chatCoreScopeValue1003.noticeKind || "",
      chatCoreScopeValue1022 = window.imApp.getGroupManagementNoticeText ? window.imApp.getGroupManagementNoticeText(chatCoreScopeValue1002, chatCoreScopeValue1003) : chatCoreScopeValue1003.content || chatCoreScopeValue1003.text || "";
    if (chatCoreScopeValue1021 === "group_title_changed" && !chatCoreScopeValue1022) return "";
    if (chatCoreScopeValue1021 === "group_left") return "你已退出群聊";
    if (chatCoreScopeValue1021 === "group_rejoined") return "你重新进入群聊";
    if (chatCoreScopeValue1021 === "narration") return ("[旁白] " + chatCoreScopeValue1022).trim();
    if (chatCoreScopeValue1021 === "offline_meeting_active") return "";
    if (chatCoreScopeValue1021 === "message_recalled") {
      if (chatCoreScopeValue1003.actorRole === "user") return "你撤回了一条消息";
      const chatCoreScopeValue1023 = String(chatCoreScopeValue1003.actorName || "").trim();
      return (chatCoreScopeValue1023 || "对方") + "撤回了一条消息";
    }
    return chatCoreScopeValue1022;
  }
  if (chatCoreScopeValue1003.type === "html") return chatCoreScopeValue1003.text || "[卡片消息]";
  return chatCoreScopeValue1003.content || chatCoreScopeValue1003.text || "";
};
window.imApp.syncFriendMessageSummary = function (chatCoreScopeValue1024) {
  if (!chatCoreScopeValue1024) return null;
  const chatCoreScopeValue1025 = Array.isArray(chatCoreScopeValue1024.messages) ? chatCoreScopeValue1024.messages : [],
    chatCoreScopeValue1026 = chatCoreScopeValue1025.filter(chatCoreScopeValue1028 => window.imApp.getFriendMessagePreview(chatCoreScopeValue1028, chatCoreScopeValue1024)),
    chatCoreScopeValue1027 = chatCoreScopeValue1026.length > 0 ? chatCoreScopeValue1026[chatCoreScopeValue1026.length - 1] : null;
  return chatCoreScopeValue1024.messages = chatCoreScopeValue1025, chatCoreScopeValue1024.messagesLoaded = true, chatCoreScopeValue1024.messageCount = chatCoreScopeValue1025.length, chatCoreScopeValue1024.lastMessageTimestamp = Number(chatCoreScopeValue1027?.timestamp) || 0, chatCoreScopeValue1024.lastMessagePreview = chatCoreScopeValue1027 ? window.imApp.getFriendMessagePreview(chatCoreScopeValue1027, chatCoreScopeValue1024) : "", chatCoreScopeValue1024;
};
window.imApp.getTotalUnreadCount = function () {
  return (Array.isArray(window.imData.friends) ? window.imData.friends : []).reduce((chatCoreScopeValue1029, chatCoreScopeValue1030) => chatCoreScopeValue1029 + Math.max(0, Number(chatCoreScopeValue1030?.unreadCount) || 0), 0);
};
window.imApp.updateChatsUnreadBadges = function () {
  const chatCoreScopeValue1031 = document.getElementById("nav-chats-btn");
  if (!chatCoreScopeValue1031) return;
  let chatCoreScopeValue1032 = chatCoreScopeValue1031.querySelector(".nav-chats-unread-badge");
  const chatCoreScopeValue1033 = window.imApp.getTotalUnreadCount(),
    chatCoreScopeValue1034 = chatCoreScopeValue1033 > 0 && !chatCoreScopeValue1031.classList.contains("active");
  !chatCoreScopeValue1032 && (chatCoreScopeValue1032 = document.createElement("div"), chatCoreScopeValue1032.className = "nav-chats-unread-badge", chatCoreScopeValue1032.style.cssText = "position:absolute; top:6px; right:14px; min-width:16px; height:16px; padding:0 4px; border-radius:999px; background:#ff3b30; color:#fff; font-size:10px; font-weight:700; line-height:16px; text-align:center; box-sizing:border-box; display:none; pointer-events:none;", chatCoreScopeValue1031.style.position = chatCoreScopeValue1031.style.position || "relative", chatCoreScopeValue1031.appendChild(chatCoreScopeValue1032));
  chatCoreScopeValue1032.textContent = chatCoreScopeValue1033 > 99 ? "99+" : String(chatCoreScopeValue1033);
  chatCoreScopeValue1032.style.display = chatCoreScopeValue1034 ? "block" : "none";
};
window.imApp.clearFriendUnread = async function (chatCoreScopeValue1035, chatCoreScopeValue1036 = {}) {
  const chatCoreScopeValue1037 = String(chatCoreScopeValue1035),
    chatCoreScopeValue1038 = (window.imData.friends || []).find(chatCoreScopeValue1039 => String(chatCoreScopeValue1039.id) === chatCoreScopeValue1037);
  if (!chatCoreScopeValue1038) return false;
  if (!chatCoreScopeValue1038.unreadCount) {
    if (window.imApp.updateChatsUnreadBadges) window.imApp.updateChatsUnreadBadges();
    return true;
  }
  chatCoreScopeValue1038.unreadCount = 0;
  try {
    if (window.imStorage?.saveFriendMeta) await window.imStorage.saveFriendMeta(chatCoreScopeValue1038);else window.imApp.commitFriendChange && (await window.imApp.commitFriendChange(chatCoreScopeValue1037, chatCoreScopeValue1040 => {
      if (chatCoreScopeValue1040) chatCoreScopeValue1040.unreadCount = 0;
    }, {
      silent: true,
      metaOnly: true
    }));
  } catch (chatCoreScopeValue1041) {
    console.error("Failed to clear unread count", chatCoreScopeValue1041);
    if (!chatCoreScopeValue1036.silent && window.showToast) window.showToast("未读状态保存失败");
    return false;
  } finally {
    if (window.imChat?.renderChatsList) window.imChat.renderChatsList();
    if (window.imApp.updateChatsUnreadBadges) window.imApp.updateChatsUnreadBadges();
  }
  return true;
};
window.imApp.reindexFriendMessages = function (chatCoreScopeValue1042) {
  if (!chatCoreScopeValue1042 || !Array.isArray(chatCoreScopeValue1042.messages)) return [];
  return chatCoreScopeValue1042.messages.forEach((chatCoreScopeValue1043, chatCoreScopeValue1044) => {
    chatCoreScopeValue1043 && typeof chatCoreScopeValue1043 === "object" && (chatCoreScopeValue1043.__messageOrder = chatCoreScopeValue1044);
  }), chatCoreScopeValue1042.messages;
};
window.imApp.findFriendMessageIndex = function (chatCoreScopeValue1045, chatCoreScopeValue1046) {
  const chatCoreScopeValue1047 = Array.isArray(chatCoreScopeValue1045?.messages) ? chatCoreScopeValue1045.messages : [];
  if (chatCoreScopeValue1047.length === 0 || chatCoreScopeValue1046 == null) return -1;
  if (typeof chatCoreScopeValue1046 === "function") return chatCoreScopeValue1047.findIndex(chatCoreScopeValue1046);
  const chatCoreScopeValue1048 = typeof chatCoreScopeValue1046 === "object" && chatCoreScopeValue1046 !== null && chatCoreScopeValue1046.id != null ? String(chatCoreScopeValue1046.id) : typeof chatCoreScopeValue1046 !== "object" ? String(chatCoreScopeValue1046) : null,
    chatCoreScopeValue1049 = typeof chatCoreScopeValue1046 === "object" && chatCoreScopeValue1046 !== null && chatCoreScopeValue1046.timestamp != null ? String(chatCoreScopeValue1046.timestamp) : null;
  if (chatCoreScopeValue1048) {
    const chatCoreNewScope1058 = chatCoreScopeValue1047.findIndex(chatCoreScopeValue1050 => chatCoreScopeValue1050?.["id"] != null && String(chatCoreScopeValue1050.id) === chatCoreScopeValue1048);
    if (chatCoreNewScope1058 >= 0) return chatCoreNewScope1058;
  }
  return chatCoreScopeValue1047.findIndex(chatCoreNewScope1060 => {
    if (!chatCoreNewScope1060) return false;
    if (chatCoreScopeValue1049 && chatCoreNewScope1060.timestamp != null && String(chatCoreNewScope1060.timestamp) === chatCoreScopeValue1049) return true;
    return false;
  });
};
window.imApp.syncActiveFriendReference = function (chatCoreScopeValue1051) {
  if (!chatCoreScopeValue1051) return;
  window.imData.currentActiveFriend && String(window.imData.currentActiveFriend.id) === String(chatCoreScopeValue1051.id) && (window.imData.currentActiveFriend = chatCoreScopeValue1051);
};
window.imApp.syncSettingsFriendReference = function (chatCoreScopeValue1052) {
  if (!chatCoreScopeValue1052) return;
  window.imData.currentSettingsFriend && String(window.imData.currentSettingsFriend.id) === String(chatCoreScopeValue1052.id) && (window.imData.currentSettingsFriend = chatCoreScopeValue1052);
};
window.imApp.clearFriendRuntimeMessageContext = function (chatCoreScopeValue1053) {
  if (!chatCoreScopeValue1053) return;
  if (chatCoreScopeValue1053.pendingRegenerateContext) delete chatCoreScopeValue1053.pendingRegenerateContext;
  if (window.imData.currentReplyText) window.imData.currentReplyText = null;
  if (window.imData.currentReplyMessageId) window.imData.currentReplyMessageId = null;
  const chatCoreScopeValue1054 = String(chatCoreScopeValue1053.id);
  window.imData.profilePanelUiStateByFriendId && delete window.imData.profilePanelUiStateByFriendId[chatCoreScopeValue1054];
  const chatCoreScopeValue1055 = document.getElementById("chat-interface-" + chatCoreScopeValue1053.id),
    chatCoreScopeValue1056 = chatCoreScopeValue1055 ? chatCoreScopeValue1055.querySelector(".reply-preview-container") : null;
  chatCoreScopeValue1056 && (chatCoreScopeValue1056.style.display = "none", chatCoreScopeValue1056.querySelectorAll("[data-reply-text], .reply-preview-text").forEach(chatCoreScopeValue1057 => {
    chatCoreScopeValue1057.textContent = "";
  }));
  chatCoreScopeValue1055?.querySelectorAll(".typing-row").forEach(chatCoreScopeValue1058 => chatCoreScopeValue1058.remove());
  chatCoreScopeValue1055?.querySelectorAll(".chat-profile-panel-overlay").forEach(chatCoreScopeValue1059 => {
    chatCoreScopeValue1059.classList.remove("active");
    chatCoreScopeValue1059.style.display = "none";
  });
  window.imData.currentActiveRow && (window.imData.currentActiveRow.classList?.remove("message-active"), window.imData.currentActiveRow = null);
};
window.imApp.createClearedConversationMemory = function (chatCoreScopeValue1060 = {}) {
  const chatCoreScopeValue1061 = window.imApp.normalizeFriendData({
      id: "__conversation_reset__",
      memory: chatCoreScopeValue1060
    }).memory,
    chatCoreScopeValue1062 = window.imApp.createDefaultMemory();
  return chatCoreScopeValue1062.context = {
    enabled: chatCoreScopeValue1061.context.enabled,
    limit: chatCoreScopeValue1061.context.limit,
    notes: ""
  }, chatCoreScopeValue1062.summary = {
    enabled: chatCoreScopeValue1061.summary.enabled,
    limit: chatCoreScopeValue1061.summary.limit,
    roundLimit: chatCoreScopeValue1061.summary.roundLimit || 30,
    prompt: chatCoreScopeValue1061.summary.prompt || "",
    apiPresetId: chatCoreScopeValue1061.summary.apiPresetId || ""
  }, chatCoreScopeValue1062.autonomous = window.imApp.cloneDataSnapshot(chatCoreScopeValue1061.autonomous), chatCoreScopeValue1062.schedule = {
    enabled: !!chatCoreScopeValue1061.schedule.enabled,
    sleepTime: chatCoreScopeValue1061.schedule.sleepTime || "23:00",
    wakeTime: chatCoreScopeValue1061.schedule.wakeTime || "07:00",
    events: []
  }, chatCoreScopeValue1062.userOverride = chatCoreScopeValue1061.userOverride ? window.imApp.cloneDataSnapshot(chatCoreScopeValue1061.userOverride) : null, chatCoreScopeValue1062.mountSettings = window.imApp.cloneDataSnapshot(chatCoreScopeValue1061.mountSettings || {}), chatCoreScopeValue1062.mountLimits = window.imApp.cloneDataSnapshot(chatCoreScopeValue1061.mountLimits || {}), chatCoreScopeValue1062.crossGroupMemorySettings = window.imApp.cloneDataSnapshot(chatCoreScopeValue1061.crossGroupMemorySettings || {}), chatCoreScopeValue1062.groupChatContexts = window.imApp.cloneDataSnapshot(chatCoreScopeValue1061.groupChatContexts || []), chatCoreScopeValue1062.lastSummaryMessageCount = 0, chatCoreScopeValue1062;
};
window.imApp.resolveFriendId = function (chatCoreScopeValue1063) {
  if (chatCoreScopeValue1063 && typeof chatCoreScopeValue1063 === "object") return chatCoreScopeValue1063.id;
  return chatCoreScopeValue1063;
};
window.imApp.getFriendById = function (chatCoreScopeValue1064) {
  const chatCoreScopeValue1065 = window.imApp.resolveFriendId(chatCoreScopeValue1064);
  if (chatCoreScopeValue1065 == null) return null;
  return (window.imData.friends || []).find(chatCoreScopeValue1066 => String(chatCoreScopeValue1066.id) === String(chatCoreScopeValue1065)) || null;
};
window.imApp.commitScopedFriendChange = async function (chatCoreScopeValue1067, chatCoreScopeValue1068, chatCoreScopeValue1069 = {}) {
  if (!window.imApp.commitFriendChange) return false;
  const chatCoreScopeValue1070 = window.imApp.resolveFriendId(chatCoreScopeValue1067);
  if (chatCoreScopeValue1070 == null) return false;
  return window.imApp.commitFriendChange(chatCoreScopeValue1070, (chatCoreScopeValue1071, chatCoreScopeValue1072, chatCoreScopeValue1073) => {
    if (!chatCoreScopeValue1071) return;
    return chatCoreScopeValue1069.syncActive !== false && window.imApp.syncActiveFriendReference(chatCoreScopeValue1071), chatCoreScopeValue1069.syncSettings === true && window.imApp.syncSettingsFriendReference(chatCoreScopeValue1071), typeof chatCoreScopeValue1069.onTargetResolved === "function" && chatCoreScopeValue1069.onTargetResolved(chatCoreScopeValue1071, chatCoreScopeValue1072, chatCoreScopeValue1073), typeof chatCoreScopeValue1068 === "function" ? chatCoreScopeValue1068(chatCoreScopeValue1071, chatCoreScopeValue1072, chatCoreScopeValue1073) : undefined;
  }, chatCoreScopeValue1069);
};
window.imApp.runFriendPersistenceTask = async function (chatCoreScopeValue1074, chatCoreScopeValue1075) {
  const chatCoreScopeValue1076 = String(chatCoreScopeValue1074),
    chatCoreScopeValue1077 = window.imApp.saveState.friendFlushChains.get(chatCoreScopeValue1076) || Promise.resolve(),
    chatCoreScopeValue1078 = chatCoreScopeValue1077["catch"](() => false).then(async () => {
      return chatCoreScopeValue1075();
    });
  window.imApp.saveState.friendFlushChains.set(chatCoreScopeValue1076, chatCoreScopeValue1078);
  try {
    return await chatCoreScopeValue1078;
  } finally {
    window.imApp.saveState.friendFlushChains.get(chatCoreScopeValue1076) === chatCoreScopeValue1078 && window.imApp.saveState.friendFlushChains["delete"](chatCoreScopeValue1076);
  }
};
window.imApp.saveState = {
  timer: null,
  delay: 800,
  dirty: false,
  isSaving: false,
  hasPendingSave: false,
  lastError: null,
  friendTimers: new Map(),
  momentTimers: new Map(),
  friendDirtyIds: new Set(),
  momentDirtyIds: new Set(),
  friendFlushChains: new Map(),
  momentFlushChains: new Map(),
  friendRevisions: new Map(),
  momentRevisions: new Map(),
  pendingFriendPatches: new Map(),
  momentMessagesDirty: false,
  stickersDirty: false,
  momentsCoverDirty: false
};
window.imApp.markFriendDirty = function (chatCoreScopeValue1079) {
  if (chatCoreScopeValue1079 == null) return;
  const chatCoreScopeValue1080 = String(chatCoreScopeValue1079),
    chatCoreScopeValue1081 = window.imApp.saveState.friendRevisions.get(chatCoreScopeValue1080) || 0;
  window.imApp.saveState.friendRevisions.set(chatCoreScopeValue1080, chatCoreScopeValue1081 + 1);
  window.imApp.saveState.friendDirtyIds.add(chatCoreScopeValue1080);
  window.imApp.saveState.dirty = true;
};
window.imApp.markMomentDirty = function (chatCoreScopeValue1082) {
  if (chatCoreScopeValue1082 == null) return;
  const chatCoreScopeValue1083 = String(chatCoreScopeValue1082),
    chatCoreScopeValue1084 = window.imApp.saveState.momentRevisions.get(chatCoreScopeValue1083) || 0;
  window.imApp.saveState.momentRevisions.set(chatCoreScopeValue1083, chatCoreScopeValue1084 + 1);
  window.imApp.saveState.momentDirtyIds.add(chatCoreScopeValue1083);
  window.imApp.saveState.dirty = true;
};
window.imApp.markMomentMessagesDirty = function () {
  window.imApp.saveState.momentMessagesDirty = true;
  window.imApp.saveState.dirty = true;
};
window.imApp.markStickersDirty = function () {
  window.imApp.saveState.stickersDirty = true;
  window.imApp.saveState.dirty = true;
};
window.imApp.markMomentsCoverDirty = function () {
  window.imApp.saveState.momentsCoverDirty = true;
  window.imApp.saveState.dirty = true;
};
window.imApp.persistGlobalData = async function (chatCoreScopeValue1085 = {}) {
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage || !window.imStorage.saveGlobalData) throw new Error("imStorage.saveGlobalData unavailable");
    const chatCoreScopeValue1086 = window.imApp.buildPersistedData();
    return await window.imStorage.saveGlobalData(chatCoreScopeValue1086), window.imApp.saveState.lastError = null, true;
  } catch (chatCoreScopeValue1087) {
    return console.error("Failed to persist iMessage global data", chatCoreScopeValue1087), window.imApp.saveState.lastError = chatCoreScopeValue1087, !chatCoreScopeValue1085.silent && window.showToast && window.showToast("保存失败，可能是浏览器存储不可用"), false;
  }
};
window.imApp.persistFriendData = async function (chatCoreScopeValue1088, chatCoreScopeValue1089 = {}) {
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage || !window.imStorage.saveFriend) throw new Error("imStorage.saveFriend unavailable");
    const chatCoreScopeValue1090 = (window.imData.friends || []).find(chatCoreScopeValue1092 => String(chatCoreScopeValue1092.id) === String(chatCoreScopeValue1088));
    if (!chatCoreScopeValue1090) return window.imStorage.deleteFriend && (await window.imStorage.deleteFriend(chatCoreScopeValue1088)), window.imApp.saveState.lastError = null, true;
    const chatCoreScopeValue1091 = chatCoreScopeValue1089.metaOnly === true && !!window.imStorage.saveFriendMetaOnly;
    if (chatCoreScopeValue1091 && window.imStorage.patchFriendMeta) {
      const chatCoreScopeValue1093 = window.imApp.saveState.pendingFriendPatches.get(String(chatCoreScopeValue1088)) || {};
      Object.keys(chatCoreScopeValue1093).length > 0 && (await window.imStorage.patchFriendMeta(chatCoreScopeValue1088, chatCoreScopeValue1093));
    } else {
      const chatCoreScopeValue1094 = window.imApp.cloneDataSnapshot(chatCoreScopeValue1090);
      chatCoreScopeValue1091 ? await window.imStorage.saveFriendMetaOnly(chatCoreScopeValue1094) : await window.imStorage.saveFriend(chatCoreScopeValue1094, {
        skipMessages: chatCoreScopeValue1089.includeMessages === false
      });
    }
    return window.imApp.saveState.lastError = null, true;
  } catch (chatCoreScopeValue1095) {
    return console.error("Failed to persist friend data", chatCoreScopeValue1095), window.imApp.saveState.lastError = chatCoreScopeValue1095, !chatCoreScopeValue1089.silent && window.showToast && window.showToast("好友数据保存失败"), false;
  }
};
window.imApp.persistMomentData = async function (chatCoreScopeValue1096, chatCoreScopeValue1097 = {}) {
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage) throw new Error("imStorage unavailable");
    const chatCoreScopeValue1098 = (window.imData.moments || []).find(chatCoreScopeValue1099 => String(chatCoreScopeValue1099.id) === String(chatCoreScopeValue1096));
    if (!chatCoreScopeValue1098) return window.imStorage.deleteMoment && (await window.imStorage.deleteMoment(chatCoreScopeValue1096)), window.imApp.saveState.lastError = null, true;
    if (!window.imStorage.saveMoment) throw new Error("imStorage.saveMoment unavailable");
    return await window.imStorage.saveMoment(window.imApp.cloneDataSnapshot(chatCoreScopeValue1098)), window.imApp.saveState.lastError = null, true;
  } catch (chatCoreScopeValue1100) {
    return console.error("Failed to persist moment data", chatCoreScopeValue1100), window.imApp.saveState.lastError = chatCoreScopeValue1100, !chatCoreScopeValue1097.silent && window.showToast && window.showToast("朋友圈数据保存失败"), false;
  }
};
const chatCoreScopeValue5 = 180;
let chatCoreScopeValue6 = null;
let chatCoreScopeValue7 = 0;
let chatCoreScopeValue8 = false;
function chatCoreScopeValue9() {
  if (document.hidden) return false;
  const chatCoreScopeValue1101 = window.imData?.currentActiveFriend?.id;
  if (chatCoreScopeValue1101 == null || chatCoreScopeValue1101 === "") return false;
  const chatCoreScopeValue1102 = document.getElementById("imessage-view");
  if (!chatCoreScopeValue1102 || !chatCoreScopeValue1102.classList.contains("active") && !chatCoreScopeValue1102.classList.contains("library-together-popup")) return false;
  const chatCoreScopeValue1103 = document.getElementById("chat-interface-" + chatCoreScopeValue1101);
  return !!chatCoreScopeValue1103 && chatCoreScopeValue1103.style.display !== "none";
}
function chatCoreScopeValue10() {
  chatCoreScopeValue6 = null;
  if (!chatCoreScopeValue8 || chatCoreScopeValue7 > 0 || chatCoreScopeValue9()) return;
  chatCoreScopeValue8 = false;
  if (window.imChat?.renderChatsList) window.imChat.renderChatsList();else {
    if (window.imApp.updateChatsUnreadBadges) window.imApp.updateChatsUnreadBadges();
  }
}
window.imApp.isChatConversationOpen = chatCoreScopeValue9;
window.imApp.requestChatsListRefresh = function (chatCoreScopeValue1104 = {}) {
  chatCoreScopeValue8 = true;
  if (chatCoreScopeValue7 > 0 || chatCoreScopeValue9()) return false;
  if (chatCoreScopeValue1104.immediate) {
    if (chatCoreScopeValue6) clearTimeout(chatCoreScopeValue6);
    return chatCoreScopeValue10(), true;
  }
  if (chatCoreScopeValue6) return false;
  return chatCoreScopeValue6 = setTimeout(chatCoreScopeValue10, chatCoreScopeValue5), true;
};
window.imApp.beginChatsListRefreshBatch = function () {
  chatCoreScopeValue7 += 1;
  let chatCoreScopeValue1105 = false;
  return () => {
    if (chatCoreScopeValue1105) return;
    chatCoreScopeValue1105 = true;
    chatCoreScopeValue7 = Math.max(0, chatCoreScopeValue7 - 1);
    chatCoreScopeValue7 === 0 && chatCoreScopeValue8 && window.imApp.requestChatsListRefresh();
  };
};
window.imApp.markChatsListRendered = function () {
  chatCoreScopeValue8 = false;
  chatCoreScopeValue6 && (clearTimeout(chatCoreScopeValue6), chatCoreScopeValue6 = null);
};
window.imApp.appendFriendMessage = async function (chatCoreScopeValue1106, chatCoreScopeValue1107, chatCoreScopeValue1108 = {}) {
  const chatCoreScopeValue1109 = String(chatCoreScopeValue1106),
    chatCoreScopeValue1110 = (window.imData.friends || []).find(chatCoreScopeValue1121 => String(chatCoreScopeValue1121.id) === chatCoreScopeValue1109);
  if (!chatCoreScopeValue1110) return false;
  if (!Array.isArray(chatCoreScopeValue1110.messages) && window.imApp.ensureFriendRecentMessagesLoaded) await window.imApp.ensureFriendRecentMessagesLoaded(chatCoreScopeValue1110);else !Array.isArray(chatCoreScopeValue1110.messages) && window.imApp.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(chatCoreScopeValue1110));
  if (!Array.isArray(chatCoreScopeValue1110.messages)) chatCoreScopeValue1110.messages = [];
  const chatCoreScopeValue1111 = chatCoreScopeValue1107 && typeof chatCoreScopeValue1107 === "object" ? chatCoreScopeValue1107 : {};
  chatCoreScopeValue1110.type === "group" && chatCoreScopeValue1110.thoughtStatusEnabled === false && chatCoreScopeValue1111.role === "assistant" && delete chatCoreScopeValue1111.thought;
  window.imApp.captureGroupUserIdentity(chatCoreScopeValue1110, chatCoreScopeValue1111);
  const chatCoreScopeValue1112 = Math.max(0, Number(chatCoreScopeValue1110.unreadCount) || 0),
    chatCoreScopeValue1113 = chatCoreScopeValue1110.messagesLoaded,
    chatCoreScopeValue1114 = Math.max(0, Number(chatCoreScopeValue1110.messageCount) || 0),
    chatCoreScopeValue1115 = Math.max(0, Number(chatCoreScopeValue1110.lastMessageTimestamp) || 0),
    chatCoreScopeValue1116 = String(chatCoreScopeValue1110.lastMessagePreview || ""),
    chatCoreScopeValue1117 = Math.max(chatCoreScopeValue1110.messages.length, Math.max(0, Number(chatCoreScopeValue1110.messageCount) || 0), chatCoreScopeValue1110.messages.reduce((chatCoreScopeValue1122, chatCoreScopeValue1123) => {
      const chatCoreScopeValue1124 = Number(chatCoreScopeValue1123?.__messageOrder);
      return Number.isFinite(chatCoreScopeValue1124) ? Math.max(chatCoreScopeValue1122, chatCoreScopeValue1124 + 1) : chatCoreScopeValue1122;
    }, 0)),
    chatCoreScopeValue1118 = chatCoreScopeValue1117;
  chatCoreScopeValue1111.__messageOrder = chatCoreScopeValue1118;
  chatCoreScopeValue1110.messages.push(chatCoreScopeValue1111);
  chatCoreScopeValue1110.messagesLoaded === false ? (chatCoreScopeValue1110.messageCount = chatCoreScopeValue1117 + 1, chatCoreScopeValue1110.lastMessageTimestamp = Number(chatCoreScopeValue1111.timestamp) || Date.now(), chatCoreScopeValue1110.lastMessagePreview = window.imApp.getFriendMessagePreview(chatCoreScopeValue1111, chatCoreScopeValue1110) || (chatCoreScopeValue1110.type === "group" && chatCoreScopeValue1110.showGroupTitles === false ? "" : chatCoreScopeValue1110.lastMessagePreview) || "") : window.imApp.syncFriendMessageSummary(chatCoreScopeValue1110);
  const chatCoreScopeValue1119 = chatCoreScopeValue1111.role !== "user" && chatCoreScopeValue1111.noticeKind !== "away_activity",
    chatCoreScopeValue1120 = window.imData.currentActiveFriend && String(window.imData.currentActiveFriend.id) === chatCoreScopeValue1109;
  chatCoreScopeValue1119 && !chatCoreScopeValue1120 && (chatCoreScopeValue1110.unreadCount = Math.max(0, Number(chatCoreScopeValue1110.unreadCount) || 0) + 1);
  window.imApp.syncActiveFriendReference(chatCoreScopeValue1110);
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage?.commitFriendMessage) throw new Error("Incremental friend message persistence unavailable");
    const chatCoreScopeValue1125 = await window.imApp.runFriendPersistenceTask(chatCoreScopeValue1109, async () => {
      return window.imStorage.commitFriendMessage(chatCoreScopeValue1110, chatCoreScopeValue1111, chatCoreScopeValue1118);
    });
    chatCoreScopeValue1125 && chatCoreScopeValue1125.id && !chatCoreScopeValue1111.id && (chatCoreScopeValue1111.id = chatCoreScopeValue1125.id);
    if (Array.isArray(chatCoreScopeValue1111.albumImages) && chatCoreScopeValue1111.albumImages.length && chatCoreScopeValue1125) {
      chatCoreScopeValue1111.contentAssetId = chatCoreScopeValue1125.contentAssetId || chatCoreScopeValue1111.contentAssetId || "";
      chatCoreScopeValue1111.albumImages = Array.isArray(chatCoreScopeValue1125.albumImages) ? chatCoreScopeValue1125.albumImages.map(chatCoreScopeValue1126 => ({
        ...chatCoreScopeValue1126
      })) : chatCoreScopeValue1111.albumImages;
      if (chatCoreScopeValue1111.contentAssetId && window.appStorage?.getAssetUrl) try {
        chatCoreScopeValue1111.content = (await window.appStorage.getAssetUrl(chatCoreScopeValue1111.contentAssetId)) || chatCoreScopeValue1111.content;
      } catch (chatCoreScopeValue1127) {}
    }
    chatCoreScopeValue1111.__messageOrder = chatCoreScopeValue1118;
    window.imApp.saveState.lastError = null;
    if (window.imApp.requestChatsListRefresh) window.imApp.requestChatsListRefresh();
    return typeof CustomEvent === "function" && window.dispatchEvent(new CustomEvent("u2:friend-message-appended", {
      detail: {
        friendId: chatCoreScopeValue1109,
        messageId: String(chatCoreScopeValue1111.id || "")
      }
    })), chatCoreScopeValue1119 && !window.imApp.isChatConversationOpen?.() && window.u2SystemNotifications?.notifyIncomingMessage && window.u2SystemNotifications.notifyIncomingMessage({
      friend: chatCoreScopeValue1110,
      message: chatCoreScopeValue1111
    }), true;
  } catch (chatCoreScopeValue1128) {
    console.error("Failed to append friend message", chatCoreScopeValue1128);
    chatCoreScopeValue1110.messages = chatCoreScopeValue1110.messages.filter((chatCoreScopeValue1129, chatCoreScopeValue1130) => {
      if (chatCoreScopeValue1129 === chatCoreScopeValue1111) return false;
      if (chatCoreScopeValue1111.id && chatCoreScopeValue1129?.id && String(chatCoreScopeValue1129.id) === String(chatCoreScopeValue1111.id)) return false;
      return !(chatCoreScopeValue1130 === chatCoreScopeValue1118 && chatCoreScopeValue1129?.timestamp != null && chatCoreScopeValue1111.timestamp != null && String(chatCoreScopeValue1129.timestamp) === String(chatCoreScopeValue1111.timestamp));
    });
    chatCoreScopeValue1113 === false ? (chatCoreScopeValue1110.messagesLoaded = false, chatCoreScopeValue1110.messageCount = chatCoreScopeValue1114, chatCoreScopeValue1110.lastMessageTimestamp = chatCoreScopeValue1115, chatCoreScopeValue1110.lastMessagePreview = chatCoreScopeValue1116) : (window.imApp.reindexFriendMessages(chatCoreScopeValue1110), window.imApp.syncFriendMessageSummary(chatCoreScopeValue1110));
    chatCoreScopeValue1110.unreadCount = chatCoreScopeValue1112;
    window.imApp.syncActiveFriendReference(chatCoreScopeValue1110);
    if (window.imApp.requestChatsListRefresh) window.imApp.requestChatsListRefresh();
    return window.imApp.saveState.lastError = chatCoreScopeValue1128, !chatCoreScopeValue1108.silent && window.showToast && window.showToast("消息保存失败"), false;
  }
};
window.imApp.updateFriendMessage = async function (chatCoreScopeValue1131, chatCoreScopeValue1132, chatCoreScopeValue1133, chatCoreScopeValue1134 = {}) {
  const chatCoreScopeValue1135 = String(chatCoreScopeValue1131),
    chatCoreScopeValue1136 = (window.imData.friends || []).find(chatCoreScopeValue1142 => String(chatCoreScopeValue1142.id) === chatCoreScopeValue1135);
  if (!chatCoreScopeValue1136) return false;
  window.imApp.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(chatCoreScopeValue1136));
  if (!Array.isArray(chatCoreScopeValue1136.messages)) return false;
  const chatCoreScopeValue1137 = window.imApp.findFriendMessageIndex(chatCoreScopeValue1136, chatCoreScopeValue1132);
  if (chatCoreScopeValue1137 < 0) return false;
  const chatCoreScopeValue1138 = window.imApp.cloneDataSnapshot(chatCoreScopeValue1136.messages[chatCoreScopeValue1137]),
    chatCoreScopeValue1139 = chatCoreScopeValue1136.messages[chatCoreScopeValue1137],
    chatCoreScopeValue1140 = chatCoreScopeValue1143 => JSON.stringify({
      role: chatCoreScopeValue1143?.role || "",
      type: chatCoreScopeValue1143?.type || "",
      content: chatCoreScopeValue1143?.content || "",
      text: chatCoreScopeValue1143?.text || "",
      transcript: chatCoreScopeValue1143?.transcript || "",
      description: chatCoreScopeValue1143?.description || "",
      replyTo: chatCoreScopeValue1143?.replyTo || "",
      replyToMessageId: chatCoreScopeValue1143?.replyToMessageId || ""
    }),
    chatCoreScopeValue1141 = chatCoreScopeValue1140(chatCoreScopeValue1138);
  try {
    typeof chatCoreScopeValue1133 === "function" && (await chatCoreScopeValue1133(chatCoreScopeValue1139, chatCoreScopeValue1136, chatCoreScopeValue1137));
    chatCoreScopeValue1139.__messageOrder = chatCoreScopeValue1137;
    window.imApp.syncFriendMessageSummary(chatCoreScopeValue1136);
    window.imApp.syncActiveFriendReference(chatCoreScopeValue1136);
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage?.commitFriendMessage) throw new Error("Incremental friend message persistence unavailable");
    const chatCoreScopeValue1144 = await window.imApp.runFriendPersistenceTask(chatCoreScopeValue1135, async () => {
      return window.imStorage.commitFriendMessage(chatCoreScopeValue1136, chatCoreScopeValue1139, chatCoreScopeValue1137);
    });
    return chatCoreScopeValue1144 && chatCoreScopeValue1144.id && !chatCoreScopeValue1139.id && (chatCoreScopeValue1139.id = chatCoreScopeValue1144.id), chatCoreScopeValue1144 && ["contentAssetId", "stickerAssetId", "senderAvatarAssetId"].forEach(chatCoreScopeValue1145 => {
      Object.prototype.hasOwnProperty.call(chatCoreScopeValue1144, chatCoreScopeValue1145) && (chatCoreScopeValue1139[chatCoreScopeValue1145] = chatCoreScopeValue1144[chatCoreScopeValue1145] || "");
    }), chatCoreScopeValue1139.__messageOrder = chatCoreScopeValue1137, chatCoreScopeValue1140(chatCoreScopeValue1139) !== chatCoreScopeValue1141 && window.imApp.clearFriendRuntimeMessageContext(chatCoreScopeValue1136), window.imApp.syncActiveFriendReference(chatCoreScopeValue1136), window.imApp.syncSettingsFriendReference(chatCoreScopeValue1136), window.imApp.saveState.lastError = null, true;
  } catch (chatCoreScopeValue1146) {
    return console.error("Failed to update friend message", chatCoreScopeValue1146), chatCoreScopeValue1136.messages[chatCoreScopeValue1137] = chatCoreScopeValue1138, window.imApp.syncFriendMessageSummary(chatCoreScopeValue1136), window.imApp.syncActiveFriendReference(chatCoreScopeValue1136), window.imApp.saveState.lastError = chatCoreScopeValue1146, !chatCoreScopeValue1134.silent && window.showToast && window.showToast("消息保存失败"), false;
  }
};
window.imApp.removeFriendMessages = async function (chatCoreScopeValue1147, chatCoreScopeValue1148, chatCoreScopeValue1149 = {}) {
  const chatCoreScopeValue1150 = String(chatCoreScopeValue1147),
    chatCoreScopeValue1151 = (window.imData.friends || []).find(chatCoreScopeValue1177 => String(chatCoreScopeValue1177.id) === chatCoreScopeValue1150);
  if (!chatCoreScopeValue1151) return false;
  window.imApp.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(chatCoreScopeValue1151));
  if (!Array.isArray(chatCoreScopeValue1151.messages)) return false;
  const chatCoreScopeValue1152 = Array.isArray(chatCoreScopeValue1148) ? chatCoreScopeValue1148 : [chatCoreScopeValue1148],
    chatCoreScopeValue1153 = window.imApp.cloneDataSnapshot(chatCoreScopeValue1151.messages),
    chatCoreScopeValue1154 = typeof chatCoreScopeValue1149.beforePersist === "function" ? window.imApp.cloneDataSnapshot(chatCoreScopeValue1151) : null,
    chatCoreScopeValue1155 = window.imApp.cloneDataSnapshot(chatCoreScopeValue1151.pendingRegenerateContext || null),
    chatCoreScopeValue1156 = window.imApp.cloneDataSnapshot(chatCoreScopeValue1151.awayActivity || null),
    chatCoreNewScope1166 = window.imApp.cloneDataSnapshot(chatCoreScopeValue1151.memory?.["recallPresentation"] || null),
    chatCoreScopeValue1157 = window.imData.currentReplyText || null,
    chatCoreScopeValue1158 = window.imData.currentReplyMessageId || null,
    chatCoreScopeValue1159 = window.imApp.cloneDataSnapshot(chatCoreScopeValue1151.memory?.summaryCursor || null),
    chatCoreScopeValue1160 = Math.max(0, Number(chatCoreScopeValue1151.memory?.lastSummaryMessageCount) || 0),
    chatCoreScopeValue1161 = String(chatCoreScopeValue1159?.messageId || "").trim(),
    chatCoreScopeValue1162 = Math.min(chatCoreScopeValue1153.length, Math.max(0, Number(chatCoreScopeValue1159?.count) || chatCoreScopeValue1160)),
    chatCoreScopeValue1163 = new Set();
  chatCoreScopeValue1152.forEach(chatCoreScopeValue1178 => {
    const descriptor = chatCoreScopeValue1178?.id
      ? { id: chatCoreScopeValue1178.id }
      : chatCoreScopeValue1178;
    const chatCoreScopeValue1179 = window.imApp.findFriendMessageIndex(chatCoreScopeValue1151, descriptor);
    if (chatCoreScopeValue1179 > -1) chatCoreScopeValue1163.add(chatCoreScopeValue1179);
  });
  if (chatCoreScopeValue1163.size === 0) return true;
  const chatCoreScopeValue1164 = Array.from(chatCoreScopeValue1163).sort((chatCoreScopeValue1180, chatCoreScopeValue1181) => chatCoreScopeValue1180 - chatCoreScopeValue1181),
    chatCoreScopeValue1165 = chatCoreScopeValue1151.messages.filter((chatCoreScopeValue1182, chatCoreScopeValue1183) => chatCoreScopeValue1163.has(chatCoreScopeValue1183)),
    chatCoreScopeValue1166 = new Set(chatCoreScopeValue1165.map(chatCoreScopeValue1184 => String(chatCoreScopeValue1184?.id || "").trim()).filter(Boolean)),
    chatCoreScopeValue1167 = new Set(chatCoreScopeValue1165.map(chatCoreScopeValue1185 => String(chatCoreScopeValue1185?.apiRunId || "").trim()).filter(Boolean)),
    chatCoreScopeValue1168 = new Set(),
    chatCoreScopeValue1169 = chatCoreScopeValue1186 => String(chatCoreScopeValue1186 || "").replace(/\s+/g, " ").trim();
  chatCoreScopeValue1165.forEach(chatCoreScopeValue1187 => {
    [chatCoreScopeValue1187?.["content"], chatCoreScopeValue1187?.["text"], chatCoreScopeValue1187?.["transcript"], chatCoreScopeValue1187?.["description"], chatCoreScopeValue1187?.["fakeLinkData"]?.["title"], chatCoreScopeValue1187?.["fakeLinkData"]?.["summary"]].forEach(chatCoreNewScope1200 => {
      const chatCoreNewScope1201 = chatCoreScopeValue1169(chatCoreNewScope1200);
      if (chatCoreNewScope1201) chatCoreScopeValue1168.add(chatCoreNewScope1201);
    });
    const chatCoreScopeValue1188 = chatCoreScopeValue1169(chatCoreScopeValue1187?.content || chatCoreScopeValue1187?.text || chatCoreScopeValue1187?.transcript || chatCoreScopeValue1187?.description),
      chatCoreScopeValue1189 = chatCoreScopeValue1169(chatCoreScopeValue1187?.translation);
    if (chatCoreScopeValue1188 && chatCoreScopeValue1189) chatCoreScopeValue1168.add(chatCoreScopeValue1188 + " " + chatCoreScopeValue1189);
  });
  let chatCoreScopeValue1170 = false,
    chatCoreScopeValue1171 = chatCoreScopeValue1164.every((chatCoreScopeValue1192, chatCoreScopeValue1193) => {
      return chatCoreScopeValue1192 === chatCoreScopeValue1153.length - chatCoreScopeValue1164.length + chatCoreScopeValue1193;
    });
  chatCoreScopeValue1149.preserveConversationRuntime !== true && window.imChat?.["invalidateFriendConversation"] && window.imChat.invalidateFriendConversation(chatCoreScopeValue1150);
  chatCoreScopeValue1151.messages = chatCoreScopeValue1151.messages.filter((chatCoreScopeValue1194, chatCoreScopeValue1195) => !chatCoreScopeValue1163.has(chatCoreScopeValue1195)), window.imChat?.["awayActivity"]?.["removeSources"](chatCoreScopeValue1151, chatCoreScopeValue1165);
  if (chatCoreScopeValue1151.awayActivity !== null && JSON.stringify(chatCoreScopeValue1156) !== JSON.stringify(chatCoreScopeValue1151.awayActivity)) chatCoreScopeValue1171 = false;
  const chatCoreScopeValue1172 = new Map();
  chatCoreScopeValue1165.forEach(chatCoreScopeValue1196 => {
    const chatCoreScopeValue1197 = String(chatCoreScopeValue1196?.apiRunId || "").trim(),
      chatCoreScopeValue1198 = typeof chatCoreScopeValue1196?.cotSummary === "string" ? chatCoreScopeValue1196.cotSummary.trim() : "";
    chatCoreScopeValue1197 && chatCoreScopeValue1198 && !chatCoreScopeValue1172.has(chatCoreScopeValue1197) && chatCoreScopeValue1172.set(chatCoreScopeValue1197, chatCoreScopeValue1198);
  });
  chatCoreScopeValue1172.forEach((chatCoreScopeValue1199, chatCoreScopeValue1200) => {
    const chatCoreScopeValue1201 = chatCoreScopeValue1151.messages.filter(chatCoreScopeValue1202 => chatCoreScopeValue1202 && chatCoreScopeValue1202.role !== "user" && String(chatCoreScopeValue1202.apiRunId || "").trim() === chatCoreScopeValue1200);
    if (chatCoreScopeValue1201.length === 0 || chatCoreScopeValue1201.some(chatCoreScopeValue1203 => String(chatCoreScopeValue1203.cotSummary || "").trim())) return;
    chatCoreScopeValue1201[0].cotSummary = chatCoreScopeValue1199;
    chatCoreScopeValue1171 = false;
  });
  chatCoreScopeValue1151.messages.forEach(chatCoreScopeValue1204 => {
    if (!chatCoreScopeValue1204) return;
    const chatCoreScopeValue1205 = String(chatCoreScopeValue1204.replyToMessageId || "").trim(),
      chatCoreScopeValue1206 = chatCoreScopeValue1169(chatCoreScopeValue1204.replyTo);
    (chatCoreScopeValue1205 && chatCoreScopeValue1166.has(chatCoreScopeValue1205) || chatCoreScopeValue1206 && chatCoreScopeValue1168.has(chatCoreScopeValue1206)) && (delete chatCoreScopeValue1204.replyToMessageId, delete chatCoreScopeValue1204.replyTo, chatCoreScopeValue1170 = true);
  });
  const chatCoreScopeValue1173 = chatCoreScopeValue1151.memory?.recallPresentation;
  if (chatCoreScopeValue1173) {
    const chatCoreScopeValue1207 = String(chatCoreScopeValue1173.triggerUserMessageId || "").trim(),
      chatCoreScopeValue1208 = String(chatCoreScopeValue1173.apiRunId || "").trim(),
      chatCoreScopeValue1209 = !chatCoreScopeValue1207 || chatCoreScopeValue1151.messages.some(chatCoreScopeValue1211 => chatCoreScopeValue1211?.role === "user" && String(chatCoreScopeValue1211.id || "") === chatCoreScopeValue1207),
      chatCoreScopeValue1210 = !chatCoreScopeValue1208 || chatCoreScopeValue1151.messages.some(chatCoreScopeValue1212 => chatCoreScopeValue1212?.role === "assistant" && String(chatCoreScopeValue1212.apiRunId || "") === chatCoreScopeValue1208);
    (chatCoreScopeValue1207 && chatCoreScopeValue1166.has(chatCoreScopeValue1207) || chatCoreScopeValue1208 && chatCoreScopeValue1167.has(chatCoreScopeValue1208) || !chatCoreScopeValue1209 || !chatCoreScopeValue1210) && (chatCoreScopeValue1151.memory.recallPresentation = null);
  }
  if (typeof chatCoreScopeValue1149.beforePersist === "function") try {
    chatCoreScopeValue1149.beforePersist(chatCoreScopeValue1151);
  } catch (chatCoreScopeValue1213) {
    console.error("Failed to apply friend message removal metadata", chatCoreScopeValue1213);
    chatCoreScopeValue1154 ? (Object.keys(chatCoreScopeValue1151).forEach(chatCoreScopeValue1214 => delete chatCoreScopeValue1151[chatCoreScopeValue1214]), Object.assign(chatCoreScopeValue1151, chatCoreScopeValue1154)) : chatCoreScopeValue1151.messages = chatCoreScopeValue1153;
    window.imApp.reindexFriendMessages(chatCoreScopeValue1151);
    window.imApp.syncFriendMessageSummary(chatCoreScopeValue1151);
    window.imApp.syncActiveFriendReference(chatCoreScopeValue1151);
    window.imApp.syncSettingsFriendReference(chatCoreScopeValue1151);
    if (!chatCoreScopeValue1149.silent && window.showToast) window.showToast("删除消息失败");
    return false;
  }
  window.imApp.reindexFriendMessages(chatCoreScopeValue1151);
  chatCoreScopeValue1151.memory = chatCoreScopeValue1151.memory || window.imApp.createDefaultMemory();
  const chatCoreScopeValue1174 = chatCoreScopeValue1161 ? chatCoreScopeValue1151.messages.findIndex(chatCoreScopeValue1215 => String(chatCoreScopeValue1215?.id || "") === chatCoreScopeValue1161) : -1,
    chatCoreScopeValue1175 = chatCoreScopeValue1174 >= 0 ? chatCoreScopeValue1174 + 1 : Math.max(0, chatCoreScopeValue1162 - chatCoreScopeValue1164.filter(chatCoreScopeValue1216 => chatCoreScopeValue1216 < chatCoreScopeValue1162).length),
    chatCoreScopeValue1176 = chatCoreScopeValue1175 > 0 ? chatCoreScopeValue1151.messages[chatCoreScopeValue1175 - 1] : null;
  chatCoreScopeValue1151.memory.lastSummaryMessageCount = chatCoreScopeValue1175;
  chatCoreScopeValue1151.memory.summaryCursor = {
    messageId: String(chatCoreScopeValue1176?.id || "").trim(),
    order: Number.isFinite(Number(chatCoreScopeValue1176?.__messageOrder)) ? Number(chatCoreScopeValue1176.__messageOrder) : -1,
    count: chatCoreScopeValue1175
  };
  window.imApp.syncFriendMessageSummary(chatCoreScopeValue1151);
  chatCoreScopeValue1149.preserveConversationRuntime !== true && window.imApp.clearFriendRuntimeMessageContext(chatCoreScopeValue1151);
  window.imApp.syncActiveFriendReference(chatCoreScopeValue1151);
  window.imApp.syncSettingsFriendReference(chatCoreScopeValue1151);
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage?.saveFriendMeta) throw new Error("Friend meta persistence unavailable");
    const chatCoreScopeValue1217 = chatCoreScopeValue1165.map(chatCoreScopeValue1218 => chatCoreScopeValue1218?.id ? String(chatCoreScopeValue1218.id) : null).filter(Boolean);
    return await window.imApp.runFriendPersistenceTask(chatCoreScopeValue1150, async () => {
      if (chatCoreScopeValue1171 && !chatCoreScopeValue1170 && chatCoreScopeValue1217.length === chatCoreScopeValue1165.length && window.imStorage?.deleteFriendMessages) await window.imStorage.deleteFriendMessages(chatCoreScopeValue1217);else {
        if (window.imStorage?.replaceFriendMessages) await window.imStorage.replaceFriendMessages(chatCoreScopeValue1150, chatCoreScopeValue1151.messages);else throw new Error("Friend message removal persistence unavailable");
      }
      return await window.imStorage.saveFriendMeta(chatCoreScopeValue1151), true;
    }), window.imApp.saveState.lastError = null, !chatCoreScopeValue1149.preserveRegenerateSnapshots && chatCoreScopeValue1167.size > 0 && window.imChat?.purgeRegenerateRunSnapshots && window.imChat.purgeRegenerateRunSnapshots(chatCoreScopeValue1150, Array.from(chatCoreScopeValue1167)), true;
  } catch (chatCoreScopeValue1219) {
    console.error("Failed to remove friend messages", chatCoreScopeValue1219);
    if (chatCoreScopeValue1154) Object.keys(chatCoreScopeValue1151).forEach(chatCoreScopeValue1220 => delete chatCoreScopeValue1151[chatCoreScopeValue1220]), Object.assign(chatCoreScopeValue1151, chatCoreScopeValue1154);else {
      chatCoreScopeValue1151.messages = chatCoreScopeValue1153, chatCoreScopeValue1151.awayActivity = chatCoreScopeValue1156;
      if (chatCoreScopeValue1155) chatCoreScopeValue1151.pendingRegenerateContext = chatCoreScopeValue1155;else {
        if (chatCoreScopeValue1151.pendingRegenerateContext) delete chatCoreScopeValue1151.pendingRegenerateContext;
      }
      chatCoreScopeValue1151.memory = chatCoreScopeValue1151.memory || window.imApp.createDefaultMemory(), chatCoreScopeValue1151.memory.recallPresentation = chatCoreNewScope1166, chatCoreScopeValue1151.memory.lastSummaryMessageCount = chatCoreScopeValue1160, chatCoreScopeValue1151.memory.summaryCursor = chatCoreScopeValue1159 || {
        messageId: "",
        order: -1,
        count: chatCoreScopeValue1160
      };
    }
    return window.imData.currentReplyText = chatCoreScopeValue1157, window.imData.currentReplyMessageId = chatCoreScopeValue1158, window.imApp.reindexFriendMessages(chatCoreScopeValue1151), window.imApp.syncFriendMessageSummary(chatCoreScopeValue1151), window.imApp.syncActiveFriendReference(chatCoreScopeValue1151), window.imApp.syncSettingsFriendReference(chatCoreScopeValue1151), window.imApp.saveState.lastError = chatCoreScopeValue1219, !chatCoreScopeValue1149.silent && window.showToast && window.showToast("删除消息失败"), false;
  }
};
window.imApp.resetFriendMessages = async function (chatCoreScopeValue1221, chatCoreScopeValue1222 = {}) {
  const chatCoreScopeValue1223 = String(chatCoreScopeValue1221),
    chatCoreScopeValue1224 = (window.imData.friends || []).find(chatCoreScopeValue1228 => String(chatCoreScopeValue1228.id) === chatCoreScopeValue1223);
  if (!chatCoreScopeValue1224) return false;
  window.imApp.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(chatCoreScopeValue1224));
  const chatCoreScopeValue1225 = window.imApp.cloneDataSnapshot(chatCoreScopeValue1224),
    chatCoreScopeValue1226 = (Array.isArray(chatCoreScopeValue1224.messages) ? chatCoreScopeValue1224.messages : []).map(chatCoreScopeValue1229 => String(chatCoreScopeValue1229?.apiRunId || "").trim()).filter(Boolean),
    chatCoreScopeValue1227 = window.imApp.saveState.friendTimers.get(chatCoreScopeValue1223);
  if (chatCoreScopeValue1227) clearTimeout(chatCoreScopeValue1227.timer || chatCoreScopeValue1227);
  window.imApp.saveState.friendTimers["delete"](chatCoreScopeValue1223), window.imApp.saveState.friendDirtyIds["delete"](chatCoreScopeValue1223);
  window.imChat?.["invalidateFriendConversation"] && window.imChat.invalidateFriendConversation(chatCoreScopeValue1223);
  chatCoreScopeValue1224.messages = [], chatCoreScopeValue1224.unreadCount = 0, chatCoreScopeValue1224.awayActivity = null, chatCoreScopeValue1224.memory = window.imApp.normalizeFriendData(chatCoreScopeValue1224).memory, chatCoreScopeValue1224.memory.lastSummaryMessageCount = 0, chatCoreScopeValue1224.memory.recallPresentation = null;
  if (chatCoreScopeValue1224.pendingRegenerateContext) delete chatCoreScopeValue1224.pendingRegenerateContext;
  window.imApp.syncFriendMessageSummary(chatCoreScopeValue1224);
  window.imApp.clearFriendRuntimeMessageContext(chatCoreScopeValue1224);
  window.imApp.syncActiveFriendReference(chatCoreScopeValue1224);
  window.imApp.syncSettingsFriendReference(chatCoreScopeValue1224);
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage?.replaceFriendMessages || !window.imStorage?.saveFriendMeta) throw new Error("Friend message reset persistence unavailable");
    await window.imApp.runFriendPersistenceTask(chatCoreScopeValue1223, async () => {
      return await window.imStorage.replaceFriendMessages(chatCoreScopeValue1223, []), await window.imStorage.saveFriendMeta(chatCoreScopeValue1224), true;
    });
    window.imApp.saveState.lastError = null;
    chatCoreScopeValue1226.length > 0 && window.imChat?.purgeRegenerateRunSnapshots && window.imChat.purgeRegenerateRunSnapshots(chatCoreScopeValue1223, chatCoreScopeValue1226);
    if (window.imApp.updateChatsUnreadBadges) window.imApp.updateChatsUnreadBadges();
    return true;
  } catch (chatCoreScopeValue1230) {
    return console.error("Failed to reset friend messages", chatCoreScopeValue1230), Object.keys(chatCoreScopeValue1224).forEach(chatCoreScopeValue1231 => delete chatCoreScopeValue1224[chatCoreScopeValue1231]), Object.assign(chatCoreScopeValue1224, chatCoreScopeValue1225), window.imApp.reindexFriendMessages(chatCoreScopeValue1224), window.imApp.syncFriendMessageSummary(chatCoreScopeValue1224), window.imApp.syncActiveFriendReference(chatCoreScopeValue1224), window.imApp.syncSettingsFriendReference(chatCoreScopeValue1224), window.imApp.saveState.lastError = chatCoreScopeValue1230, !chatCoreScopeValue1222.silent && window.showToast && window.showToast("聊天记录清空失败"), false;
  }
};
window.imApp.buildFriendMetaPatch = function (chatCoreScopeValue1232, chatCoreScopeValue1233) {
  if (!chatCoreScopeValue1233 || typeof chatCoreScopeValue1233 !== "object") return {};
  if (!chatCoreScopeValue1232 || typeof chatCoreScopeValue1232 !== "object") {
    const chatCoreScopeValue1235 = window.imApp.cloneDataSnapshot(chatCoreScopeValue1233);
    return delete chatCoreScopeValue1235.messages, chatCoreScopeValue1235;
  }
  const chatCoreScopeValue1234 = {};
  return Object.keys(chatCoreScopeValue1233).forEach(chatCoreScopeValue1236 => {
    if (chatCoreScopeValue1236 === "messages") return;
    const chatCoreScopeValue1237 = chatCoreScopeValue1232[chatCoreScopeValue1236],
      chatCoreScopeValue1238 = chatCoreScopeValue1233[chatCoreScopeValue1236];
    let chatCoreScopeValue1239 = chatCoreScopeValue1237 !== chatCoreScopeValue1238;
    if (chatCoreScopeValue1237 && chatCoreScopeValue1238 && typeof chatCoreScopeValue1237 === "object" && typeof chatCoreScopeValue1238 === "object") try {
      chatCoreScopeValue1239 = JSON.stringify(chatCoreScopeValue1237) !== JSON.stringify(chatCoreScopeValue1238);
    } catch (chatCoreScopeValue1240) {
      chatCoreScopeValue1239 = true;
    }
    if (chatCoreScopeValue1239) chatCoreScopeValue1234[chatCoreScopeValue1236] = window.imApp.cloneDataSnapshot(chatCoreScopeValue1238);
  }), chatCoreScopeValue1234;
};
window.imApp.resetFriendConversation = async function (chatCoreScopeValue1241, chatCoreScopeValue1242 = {}) {
  const chatCoreScopeValue1243 = String(chatCoreScopeValue1241),
    chatCoreScopeValue1244 = (window.imData.friends || []).find(chatCoreScopeValue1247 => String(chatCoreScopeValue1247.id) === chatCoreScopeValue1243);
  if (!chatCoreScopeValue1244) return false;
  window.imApp.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(chatCoreScopeValue1244));
  const chatCoreScopeValue1245 = window.imApp.cloneDataSnapshot(chatCoreScopeValue1244),
    chatCoreScopeValue1246 = window.imApp.saveState.friendTimers.get(chatCoreScopeValue1243);
  if (chatCoreScopeValue1246) clearTimeout(chatCoreScopeValue1246);
  window.imApp.saveState.friendTimers["delete"](chatCoreScopeValue1243), window.imApp.saveState.friendDirtyIds["delete"](chatCoreScopeValue1243);
  window.imChat?.["invalidateFriendConversation"] && window.imChat.invalidateFriendConversation(chatCoreScopeValue1243);
  chatCoreScopeValue1244.messages = [], chatCoreScopeValue1244.unreadCount = 0, chatCoreScopeValue1244.memory = window.imApp.createClearedConversationMemory(chatCoreScopeValue1244.memory || {}), chatCoreScopeValue1244.awayActivity = null, chatCoreScopeValue1244.profilePanel = window.imApp.createDefaultProfilePanel({}), chatCoreScopeValue1244.latestThought = "", chatCoreScopeValue1244.status = "online";
  if (chatCoreScopeValue1244.type === "group") chatCoreScopeValue1244.memberProfiles = {};
  if (chatCoreScopeValue1244.pendingRegenerateContext) delete chatCoreScopeValue1244.pendingRegenerateContext;
  window.imApp.syncFriendMessageSummary(chatCoreScopeValue1244);
  window.imApp.clearFriendRuntimeMessageContext(chatCoreScopeValue1244);
  window.imApp.syncActiveFriendReference(chatCoreScopeValue1244);
  window.imApp.syncSettingsFriendReference(chatCoreScopeValue1244);
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage?.replaceFriendMessages || !window.imStorage?.saveFriendMeta) throw new Error("Friend conversation reset persistence unavailable");
    await window.imApp.runFriendPersistenceTask(chatCoreScopeValue1243, async () => {
      return await window.imStorage.replaceFriendMessages(chatCoreScopeValue1243, []), await window.imStorage.saveFriendMeta(chatCoreScopeValue1244), true;
    });
    window.imApp.saveState.lastError = null;
    if (window.imApp.updateChatsUnreadBadges) window.imApp.updateChatsUnreadBadges();
    return true;
  } catch (chatCoreScopeValue1248) {
    console.error("Failed to reset friend conversation", chatCoreScopeValue1248);
    Object.keys(chatCoreScopeValue1244).forEach(chatCoreScopeValue1249 => delete chatCoreScopeValue1244[chatCoreScopeValue1249]);
    Object.assign(chatCoreScopeValue1244, chatCoreScopeValue1245);
    window.imApp.reindexFriendMessages(chatCoreScopeValue1244);
    window.imApp.syncFriendMessageSummary(chatCoreScopeValue1244);
    window.imApp.syncActiveFriendReference(chatCoreScopeValue1244);
    window.imApp.syncSettingsFriendReference(chatCoreScopeValue1244);
    window.imApp.saveState.lastError = chatCoreScopeValue1248;
    try {
      window.imStorage?.replaceFriendMessages && window.imStorage?.saveFriendMeta && (await window.imApp.runFriendPersistenceTask(chatCoreScopeValue1243, async () => {
        return await window.imStorage.replaceFriendMessages(chatCoreScopeValue1243, chatCoreScopeValue1245.messages || []), await window.imStorage.saveFriendMeta(chatCoreScopeValue1245), true;
      }));
    } catch (chatCoreScopeValue1250) {
      console.error("Failed to roll back friend conversation reset", chatCoreScopeValue1250);
    }
    return !chatCoreScopeValue1242.silent && window.showToast && window.showToast("聊天记录与上下文清空失败"), false;
  }
};
window.imApp.persistMomentMessagesData = async function (chatCoreScopeValue1251 = {}) {
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage || !window.imStorage.saveMomentMessages) throw new Error("imStorage.saveMomentMessages unavailable");
    return await window.imStorage.saveMomentMessages(window.imApp.cloneDataSnapshot(Array.isArray(window.imData.momentMessages) ? window.imData.momentMessages : [])), window.imApp.saveState.lastError = null, true;
  } catch (chatCoreScopeValue1252) {
    return console.error("Failed to persist moment message data", chatCoreScopeValue1252), window.imApp.saveState.lastError = chatCoreScopeValue1252, !chatCoreScopeValue1251.silent && window.showToast && window.showToast("朋友圈通知保存失败"), false;
  }
};
window.imApp.persistStickersData = async function (chatCoreScopeValue1253 = {}) {
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage || !window.imStorage.saveStickers) throw new Error("imStorage.saveStickers unavailable");
    return await window.imStorage.saveStickers(window.imApp.cloneDataSnapshot(Array.isArray(window.imData.stickers) ? window.imData.stickers : [])), window.imApp.saveState.lastError = null, true;
  } catch (chatCoreScopeValue1254) {
    return console.error("Failed to persist sticker data", chatCoreScopeValue1254), window.imApp.saveState.lastError = chatCoreScopeValue1254, !chatCoreScopeValue1253.silent && window.showToast && window.showToast("表情包保存失败"), false;
  }
};
window.imApp.persistMomentsCoverData = async function (chatCoreScopeValue1255 = {}) {
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage || !window.imStorage.saveMomentsCover) throw new Error("imStorage.saveMomentsCover unavailable");
    return await window.imStorage.saveMomentsCover(window.imData.momentsCoverUrl || null), window.imApp.saveState.lastError = null, true;
  } catch (chatCoreScopeValue1256) {
    return console.error("Failed to persist moments cover data", chatCoreScopeValue1256), window.imApp.saveState.lastError = chatCoreScopeValue1256, !chatCoreScopeValue1255.silent && window.showToast && window.showToast("朋友圈封面保存失败"), false;
  }
};
window.imApp.flushFriendSave = async function (chatCoreScopeValue1257, chatCoreScopeValue1258 = {}) {
  const chatCoreScopeValue1259 = String(chatCoreScopeValue1257),
    chatCoreScopeValue1260 = window.imApp.saveState.friendTimers.get(chatCoreScopeValue1259);
  chatCoreScopeValue1260 && (clearTimeout(chatCoreScopeValue1260.timer || chatCoreScopeValue1260), window.imApp.saveState.friendTimers["delete"](chatCoreScopeValue1259));
  const chatCoreScopeValue1261 = window.imApp.saveState.friendFlushChains.get(chatCoreScopeValue1259) || Promise.resolve(),
    chatCoreScopeValue1262 = chatCoreScopeValue1261["catch"](() => false).then(async () => {
      const chatCoreScopeValue1263 = window.imApp.saveState.friendRevisions.get(chatCoreScopeValue1259) || 0,
        chatCoreScopeValue1264 = chatCoreScopeValue1260 && typeof chatCoreScopeValue1260 === "object" ? chatCoreScopeValue1260.options || {} : {},
        chatCoreScopeValue1265 = {
          ...chatCoreScopeValue1264,
          ...chatCoreScopeValue1258
        },
        chatCoreScopeValue1266 = await window.imApp.persistFriendData(chatCoreScopeValue1259, chatCoreScopeValue1265);
      if (chatCoreScopeValue1266) {
        const chatCoreScopeValue1267 = window.imApp.saveState.friendRevisions.get(chatCoreScopeValue1259) || 0;
        chatCoreScopeValue1267 === chatCoreScopeValue1263 && (window.imApp.saveState.friendDirtyIds["delete"](chatCoreScopeValue1259), window.imApp.saveState.pendingFriendPatches["delete"](chatCoreScopeValue1259));
      }
      return window.imApp.saveState.dirty = window.imApp.saveState.friendDirtyIds.size > 0 || window.imApp.saveState.momentDirtyIds.size > 0 || window.imApp.saveState.momentMessagesDirty || window.imApp.saveState.stickersDirty || window.imApp.saveState.momentsCoverDirty, chatCoreScopeValue1266;
    });
  window.imApp.saveState.friendFlushChains.set(chatCoreScopeValue1259, chatCoreScopeValue1262);
  try {
    return await chatCoreScopeValue1262;
  } finally {
    window.imApp.saveState.friendFlushChains.get(chatCoreScopeValue1259) === chatCoreScopeValue1262 && window.imApp.saveState.friendFlushChains["delete"](chatCoreScopeValue1259);
  }
};
window.imApp.scheduleFriendSave = function (chatCoreScopeValue1268, chatCoreScopeValue1269 = {}) {
  if (chatCoreScopeValue1268 == null) return false;
  const chatCoreScopeValue1270 = String(chatCoreScopeValue1268),
    chatCoreScopeValue1271 = Number.isFinite(Number(chatCoreScopeValue1269.delay)) ? Number(chatCoreScopeValue1269.delay) : 500;
  window.imApp.markFriendDirty(chatCoreScopeValue1270);
  const chatCoreScopeValue1272 = window.imApp.saveState.friendTimers.get(chatCoreScopeValue1270);
  chatCoreScopeValue1272 && clearTimeout(chatCoreScopeValue1272.timer || chatCoreScopeValue1272);
  const chatCoreScopeValue1273 = {
      silent: chatCoreScopeValue1269.silent !== false,
      metaOnly: chatCoreScopeValue1269.metaOnly === true,
      includeMessages: chatCoreScopeValue1269.includeMessages
    },
    chatCoreScopeValue1274 = setTimeout(() => {
      window.imApp.flushFriendSave(chatCoreScopeValue1270, chatCoreScopeValue1273);
    }, Math.max(0, chatCoreScopeValue1271));
  return window.imApp.saveState.friendTimers.set(chatCoreScopeValue1270, {
    timer: chatCoreScopeValue1274,
    options: chatCoreScopeValue1273
  }), true;
};
window.imApp.flushMomentSave = async function (chatCoreScopeValue1275, chatCoreScopeValue1276 = {}) {
  const chatCoreScopeValue1277 = String(chatCoreScopeValue1275),
    chatCoreScopeValue1278 = window.imApp.saveState.momentTimers.get(chatCoreScopeValue1277);
  chatCoreScopeValue1278 && (clearTimeout(chatCoreScopeValue1278), window.imApp.saveState.momentTimers["delete"](chatCoreScopeValue1277));
  const chatCoreScopeValue1279 = window.imApp.saveState.momentFlushChains.get(chatCoreScopeValue1277) || Promise.resolve(),
    chatCoreScopeValue1280 = chatCoreScopeValue1279["catch"](() => false).then(async () => {
      const chatCoreScopeValue1281 = window.imApp.saveState.momentRevisions.get(chatCoreScopeValue1277) || 0,
        chatCoreScopeValue1282 = await window.imApp.persistMomentData(chatCoreScopeValue1277, chatCoreScopeValue1276);
      if (chatCoreScopeValue1282) {
        const chatCoreScopeValue1283 = window.imApp.saveState.momentRevisions.get(chatCoreScopeValue1277) || 0;
        chatCoreScopeValue1283 === chatCoreScopeValue1281 && window.imApp.saveState.momentDirtyIds["delete"](chatCoreScopeValue1277);
      }
      return window.imApp.saveState.dirty = window.imApp.saveState.friendDirtyIds.size > 0 || window.imApp.saveState.momentDirtyIds.size > 0 || window.imApp.saveState.momentMessagesDirty || window.imApp.saveState.stickersDirty || window.imApp.saveState.momentsCoverDirty, chatCoreScopeValue1282;
    });
  window.imApp.saveState.momentFlushChains.set(chatCoreScopeValue1277, chatCoreScopeValue1280);
  try {
    return await chatCoreScopeValue1280;
  } finally {
    window.imApp.saveState.momentFlushChains.get(chatCoreScopeValue1277) === chatCoreScopeValue1280 && window.imApp.saveState.momentFlushChains["delete"](chatCoreScopeValue1277);
  }
};
window.imApp.scheduleMomentSave = function (chatCoreScopeValue1284, chatCoreScopeValue1285 = {}) {
  if (chatCoreScopeValue1284 == null) return false;
  const chatCoreScopeValue1286 = String(chatCoreScopeValue1284),
    chatCoreScopeValue1287 = Number.isFinite(Number(chatCoreScopeValue1285.delay)) ? Number(chatCoreScopeValue1285.delay) : 500;
  window.imApp.markMomentDirty(chatCoreScopeValue1286);
  const chatCoreScopeValue1288 = window.imApp.saveState.momentTimers.get(chatCoreScopeValue1286);
  chatCoreScopeValue1288 && clearTimeout(chatCoreScopeValue1288);
  const chatCoreScopeValue1289 = setTimeout(() => {
    window.imApp.flushMomentSave(chatCoreScopeValue1286, {
      silent: chatCoreScopeValue1285.silent !== false
    });
  }, Math.max(0, chatCoreScopeValue1287));
  return window.imApp.saveState.momentTimers.set(chatCoreScopeValue1286, chatCoreScopeValue1289), true;
};
window.imApp.flushMomentMessagesSave = async function (chatCoreScopeValue1290 = {}) {
  const chatCoreScopeValue1291 = await window.imApp.persistMomentMessagesData(chatCoreScopeValue1290);
  return chatCoreScopeValue1291 && (window.imApp.saveState.momentMessagesDirty = false), window.imApp.saveState.dirty = window.imApp.saveState.friendDirtyIds.size > 0 || window.imApp.saveState.momentDirtyIds.size > 0 || window.imApp.saveState.momentMessagesDirty || window.imApp.saveState.stickersDirty || window.imApp.saveState.momentsCoverDirty, chatCoreScopeValue1291;
};
window.imApp.flushStickersSave = async function (chatCoreScopeValue1292 = {}) {
  const chatCoreScopeValue1293 = await window.imApp.persistStickersData(chatCoreScopeValue1292);
  return chatCoreScopeValue1293 && (window.imApp.saveState.stickersDirty = false), window.imApp.saveState.dirty = window.imApp.saveState.friendDirtyIds.size > 0 || window.imApp.saveState.momentDirtyIds.size > 0 || window.imApp.saveState.momentMessagesDirty || window.imApp.saveState.stickersDirty || window.imApp.saveState.momentsCoverDirty, chatCoreScopeValue1293;
};
window.imApp.flushMomentsCoverSave = async function (chatCoreScopeValue1294 = {}) {
  const chatCoreScopeValue1295 = await window.imApp.persistMomentsCoverData(chatCoreScopeValue1294);
  return chatCoreScopeValue1295 && (window.imApp.saveState.momentsCoverDirty = false), window.imApp.saveState.dirty = window.imApp.saveState.friendDirtyIds.size > 0 || window.imApp.saveState.momentDirtyIds.size > 0 || window.imApp.saveState.momentMessagesDirty || window.imApp.saveState.stickersDirty || window.imApp.saveState.momentsCoverDirty, chatCoreScopeValue1295;
};
window.imApp.flushGlobalSave = async function (chatCoreScopeValue1296 = {}) {
  window.imApp.saveState.timer && (clearTimeout(window.imApp.saveState.timer), window.imApp.saveState.timer = null);
  if (window.imApp.saveState.isSaving) return window.imApp.saveState.hasPendingSave = true, true;
  window.imApp.saveState.isSaving = true;
  try {
    do {
      window.imApp.saveState.hasPendingSave = false;
      const chatCoreScopeValue1297 = Array.from(window.imApp.saveState.friendDirtyIds),
        chatCoreScopeValue1298 = Array.from(window.imApp.saveState.momentDirtyIds);
      for (const chatCoreScopeValue1299 of chatCoreScopeValue1297) {
        const chatCoreScopeValue1300 = await window.imApp.flushFriendSave(chatCoreScopeValue1299, chatCoreScopeValue1296);
        if (!chatCoreScopeValue1300) return false;
      }
      for (const chatCoreScopeValue1301 of chatCoreScopeValue1298) {
        const chatCoreScopeValue1302 = await window.imApp.flushMomentSave(chatCoreScopeValue1301, chatCoreScopeValue1296);
        if (!chatCoreScopeValue1302) return false;
      }
      if (window.imApp.saveState.momentMessagesDirty) {
        const chatCoreScopeValue1303 = await window.imApp.flushMomentMessagesSave(chatCoreScopeValue1296);
        if (!chatCoreScopeValue1303) return false;
      }
      if (window.imApp.saveState.stickersDirty) {
        const chatCoreScopeValue1304 = await window.imApp.flushStickersSave(chatCoreScopeValue1296);
        if (!chatCoreScopeValue1304) return false;
      }
      if (window.imApp.saveState.momentsCoverDirty) {
        const chatCoreScopeValue1305 = await window.imApp.flushMomentsCoverSave(chatCoreScopeValue1296);
        if (!chatCoreScopeValue1305) return false;
      }
      window.imApp.saveState.dirty = window.imApp.saveState.friendDirtyIds.size > 0 || window.imApp.saveState.momentDirtyIds.size > 0 || window.imApp.saveState.momentMessagesDirty || window.imApp.saveState.stickersDirty || window.imApp.saveState.momentsCoverDirty;
    } while (window.imApp.saveState.hasPendingSave);
    return true;
  } finally {
    window.imApp.saveState.isSaving = false;
  }
};
window.imApp.scheduleGlobalSave = function (chatCoreScopeValue1306 = {}) {
  const chatCoreScopeValue1307 = Number.isFinite(Number(chatCoreScopeValue1306.delay)) ? Number(chatCoreScopeValue1306.delay) : window.imApp.saveState.delay;
  return window.imApp.saveState.dirty = true, window.imApp.saveState.timer && clearTimeout(window.imApp.saveState.timer), window.imApp.saveState.timer = setTimeout(() => {
    window.imApp.flushGlobalSave({
      silent: chatCoreScopeValue1306.silent !== false
    });
  }, Math.max(0, chatCoreScopeValue1307)), true;
};
window.imApp.commitGlobalChange = async function (chatCoreScopeValue1308, chatCoreScopeValue1309 = {}) {
  const chatCoreScopeValue1310 = window.imApp.buildPersistedData();
  try {
    typeof chatCoreScopeValue1308 === "function" && (await chatCoreScopeValue1308());
    if (chatCoreScopeValue1309.immediate === false) return window.imApp.scheduleGlobalSave({
      delay: chatCoreScopeValue1309.delay,
      silent: chatCoreScopeValue1309.silent !== false
    }), typeof chatCoreScopeValue1309.onSuccess === "function" && chatCoreScopeValue1309.onSuccess(window.imData), true;
    const chatCoreScopeValue1311 = await window.imApp.flushGlobalSave({
      silent: !!chatCoreScopeValue1309.silent
    });
    if (!chatCoreScopeValue1311) return window.imData.friends = chatCoreScopeValue1310.friends, window.imData.moments = chatCoreScopeValue1310.moments, window.imData.momentMessages = chatCoreScopeValue1310.momentMessages, window.imData.stickers = chatCoreScopeValue1310.stickers, window.imData.momentsCoverUrl = chatCoreScopeValue1310.momentsCoverUrl, typeof chatCoreScopeValue1309.onRollback === "function" && chatCoreScopeValue1309.onRollback(window.imData), false;
    return typeof chatCoreScopeValue1309.onSuccess === "function" && chatCoreScopeValue1309.onSuccess(window.imData), true;
  } catch (chatCoreScopeValue1312) {
    return console.error("Failed to commit global change", chatCoreScopeValue1312), window.imData.friends = chatCoreScopeValue1310.friends, window.imData.moments = chatCoreScopeValue1310.moments, window.imData.momentMessages = chatCoreScopeValue1310.momentMessages, window.imData.stickers = chatCoreScopeValue1310.stickers, window.imData.momentsCoverUrl = chatCoreScopeValue1310.momentsCoverUrl, typeof chatCoreScopeValue1309.onRollback === "function" && chatCoreScopeValue1309.onRollback(window.imData), !chatCoreScopeValue1309.silent && window.showToast && window.showToast("保存失败，已撤销本次修改"), false;
  }
};
window.imApp.commitFriendChange = async function (chatCoreScopeValue1313, chatCoreScopeValue1314, chatCoreScopeValue1315 = {}) {
  let chatCoreScopeValue1316 = Array.isArray(window.imData.friends) ? window.imData.friends : [],
    chatCoreScopeValue1317 = chatCoreScopeValue1316.findIndex(chatCoreScopeValue1320 => String(chatCoreScopeValue1320.id) === String(chatCoreScopeValue1313));
  const chatCoreScopeValue1318 = chatCoreScopeValue1317 > -1 ? chatCoreScopeValue1316[chatCoreScopeValue1317] : null;
  chatCoreScopeValue1318 && chatCoreScopeValue1318.messagesLoaded === false && chatCoreScopeValue1315.metaOnly !== true && window.imApp.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(chatCoreScopeValue1318), chatCoreScopeValue1316 = Array.isArray(window.imData.friends) ? window.imData.friends : [], chatCoreScopeValue1317 = chatCoreScopeValue1316.findIndex(chatCoreScopeValue1321 => String(chatCoreScopeValue1321.id) === String(chatCoreScopeValue1313)));
  let chatCoreScopeValue1319 = null;
  if (chatCoreScopeValue1317 > -1) {
    if (chatCoreScopeValue1315.metaOnly === true) {
      const {
        messages: chatCoreScopeValue1322,
        ...chatCoreScopeValue1323
      } = chatCoreScopeValue1316[chatCoreScopeValue1317];
      chatCoreScopeValue1319 = window.imApp.cloneDataSnapshot(chatCoreScopeValue1323);
      Object.prototype.hasOwnProperty.call(chatCoreScopeValue1316[chatCoreScopeValue1317], "messages") && (chatCoreScopeValue1319.messages = chatCoreScopeValue1322);
    } else chatCoreScopeValue1319 = window.imApp.cloneDataSnapshot(chatCoreScopeValue1316[chatCoreScopeValue1317]);
  }
  try {
    const chatCoreScopeValue1324 = chatCoreScopeValue1317 > -1 ? chatCoreScopeValue1316[chatCoreScopeValue1317] : null;
    typeof chatCoreScopeValue1314 === "function" && (await chatCoreScopeValue1314(chatCoreScopeValue1324, chatCoreScopeValue1316, chatCoreScopeValue1317));
    if (chatCoreScopeValue1315.metaOnly === true && chatCoreScopeValue1324) {
      const chatCoreScopeValue1326 = String(chatCoreScopeValue1313),
        chatCoreScopeValue1327 = window.imApp.buildFriendMetaPatch(chatCoreScopeValue1319, chatCoreScopeValue1324),
        chatCoreScopeValue1328 = window.imApp.saveState.pendingFriendPatches.get(chatCoreScopeValue1326) || {};
      window.imApp.saveState.pendingFriendPatches.set(chatCoreScopeValue1326, {
        ...chatCoreScopeValue1328,
        ...chatCoreScopeValue1327
      });
    }
    window.imApp.markFriendDirty(chatCoreScopeValue1313);
    if (chatCoreScopeValue1315.immediate === false) return window.imApp.scheduleFriendSave(chatCoreScopeValue1313, {
      delay: chatCoreScopeValue1315.delay,
      silent: chatCoreScopeValue1315.silent !== false,
      metaOnly: chatCoreScopeValue1315.metaOnly === true,
      includeMessages: chatCoreScopeValue1315.includeMessages
    }), typeof chatCoreScopeValue1315.onSuccess === "function" && chatCoreScopeValue1315.onSuccess(window.imData.friends), true;
    const chatCoreScopeValue1325 = await window.imApp.flushFriendSave(chatCoreScopeValue1313, {
      silent: !!chatCoreScopeValue1315.silent,
      metaOnly: chatCoreScopeValue1315.metaOnly === true,
      includeMessages: chatCoreScopeValue1315.includeMessages
    });
    if (!chatCoreScopeValue1325) return chatCoreScopeValue1317 > -1 && (chatCoreScopeValue1319 ? window.imData.friends[chatCoreScopeValue1317] = chatCoreScopeValue1319 : window.imData.friends.splice(chatCoreScopeValue1317, 1)), typeof chatCoreScopeValue1315.onRollback === "function" && chatCoreScopeValue1315.onRollback(window.imData.friends), false;
    return typeof chatCoreScopeValue1315.onSuccess === "function" && chatCoreScopeValue1315.onSuccess(window.imData.friends), true;
  } catch (chatCoreScopeValue1329) {
    return console.error("Failed to commit friend change", chatCoreScopeValue1329), chatCoreScopeValue1317 > -1 && (chatCoreScopeValue1319 ? window.imData.friends[chatCoreScopeValue1317] = chatCoreScopeValue1319 : window.imData.friends.splice(chatCoreScopeValue1317, 1)), typeof chatCoreScopeValue1315.onRollback === "function" && chatCoreScopeValue1315.onRollback(window.imData.friends), !chatCoreScopeValue1315.silent && window.showToast && window.showToast("保存失败，已撤销本次修改"), false;
  }
};
window.imApp.commitFriendsChange = async function (chatCoreScopeValue1330, chatCoreScopeValue1331 = {}) {
  window.imApp.ensureDataReady && !window.imData.ready && (await window.imApp.ensureDataReady());
  const chatCoreScopeValue1332 = window.imApp.cloneDataSnapshot(Array.isArray(window.imData.friends) ? window.imData.friends : []);
  try {
    typeof chatCoreScopeValue1330 === "function" && (await chatCoreScopeValue1330());
    const chatCoreScopeValue1333 = (window.imData.friends || []).map(chatCoreScopeValue1337 => String(chatCoreScopeValue1337.id)),
      chatCoreScopeValue1334 = Array.isArray(chatCoreScopeValue1331.deletedFriendIds) ? chatCoreScopeValue1331.deletedFriendIds.map(String) : chatCoreScopeValue1332.map(chatCoreScopeValue1338 => String(chatCoreScopeValue1338.id)).filter(chatCoreScopeValue1339 => !chatCoreScopeValue1333.includes(chatCoreScopeValue1339)),
      chatCoreScopeValue1335 = Array.isArray(chatCoreScopeValue1331.friendIds) ? Array.from(new Set([...chatCoreScopeValue1331.friendIds.map(String), ...chatCoreScopeValue1334])) : chatCoreScopeValue1331.friendId != null ? Array.from(new Set([String(chatCoreScopeValue1331.friendId), ...chatCoreScopeValue1334])) : Array.from(new Set([...chatCoreScopeValue1333, ...chatCoreScopeValue1334]));
    chatCoreScopeValue1335.forEach(chatCoreScopeValue1340 => window.imApp.markFriendDirty(chatCoreScopeValue1340));
    if (chatCoreScopeValue1331.immediate === false) return chatCoreScopeValue1335.length === 1 ? window.imApp.scheduleFriendSave(chatCoreScopeValue1335[0], {
      delay: chatCoreScopeValue1331.delay,
      silent: chatCoreScopeValue1331.silent !== false,
      metaOnly: chatCoreScopeValue1331.metaOnly === true,
      includeMessages: chatCoreScopeValue1331.includeMessages
    }) : window.imApp.scheduleGlobalSave({
      delay: chatCoreScopeValue1331.delay,
      silent: chatCoreScopeValue1331.silent !== false
    }), typeof chatCoreScopeValue1331.onSuccess === "function" && chatCoreScopeValue1331.onSuccess(window.imData.friends), true;
    const chatCoreScopeValue1336 = chatCoreScopeValue1335.length === 1 ? await window.imApp.flushFriendSave(chatCoreScopeValue1335[0], {
      silent: !!chatCoreScopeValue1331.silent,
      metaOnly: chatCoreScopeValue1331.metaOnly === true,
      includeMessages: chatCoreScopeValue1331.includeMessages
    }) : await window.imApp.flushGlobalSave({
      silent: !!chatCoreScopeValue1331.silent
    });
    if (!chatCoreScopeValue1336) return window.imData.friends = chatCoreScopeValue1332, typeof chatCoreScopeValue1331.onRollback === "function" && chatCoreScopeValue1331.onRollback(window.imData.friends), false;
    return typeof chatCoreScopeValue1331.onSuccess === "function" && chatCoreScopeValue1331.onSuccess(window.imData.friends), chatCoreScopeValue1334.forEach(chatCoreScopeValue1341 => {
      window.dispatchEvent(new CustomEvent("u2:friend-removed", {
        detail: {
          friendId: chatCoreScopeValue1341
        }
      }));
    }), true;
  } catch (chatCoreScopeValue1342) {
    return console.error("Failed to commit friends change", chatCoreScopeValue1342), window.imData.friends = chatCoreScopeValue1332, typeof chatCoreScopeValue1331.onRollback === "function" && chatCoreScopeValue1331.onRollback(window.imData.friends), !chatCoreScopeValue1331.silent && window.showToast && window.showToast("保存失败，已撤销本次修改"), false;
  }
};
window.imApp.changeFriendType = async function (chatCoreScopeValue1343, chatCoreScopeValue1344) {
  const chatCoreScopeValue1345 = String(window.imApp.resolveFriendId(chatCoreScopeValue1343) ?? "");
  const chatCoreScopeValue1346 = window.imApp.getFriendById(chatCoreScopeValue1345);
  if (!chatCoreScopeValue1345 || !chatCoreScopeValue1346 || !["char", "npc"].includes(chatCoreScopeValue1346.type) || !["char", "npc"].includes(chatCoreScopeValue1344)) return false;
  if (chatCoreScopeValue1346.type === chatCoreScopeValue1344) return true;
  const chatCoreScopeValue1347 = chatCoreScopeValue1346.type;
  const chatCoreScopeValue1348 = [chatCoreScopeValue1345];
  return window.imApp.commitFriendsChange(() => {
    const chatCoreScopeValue1349 = window.imApp.getFriendById(chatCoreScopeValue1345);
    if (!chatCoreScopeValue1349 || chatCoreScopeValue1349.type !== chatCoreScopeValue1347) throw new Error("角色身份已变化");
    chatCoreScopeValue1349.type = chatCoreScopeValue1344;
    (window.imData.friends || []).forEach(chatCoreScopeValue1350 => {
      const chatCoreScopeValue1351 = chatCoreScopeValue1350?.memory?.relationships;
      if (!Array.isArray(chatCoreScopeValue1351)) return;
      let chatCoreScopeValue1352 = false;
      chatCoreScopeValue1351.forEach(chatCoreScopeValue1353 => {
        if (String(chatCoreScopeValue1353?.targetId ?? chatCoreScopeValue1353?.npcId ?? "") !== chatCoreScopeValue1345) return;
        chatCoreScopeValue1353.targetType = chatCoreScopeValue1344;
        chatCoreScopeValue1352 = true;
      });
      if (chatCoreScopeValue1352) chatCoreScopeValue1348.push(String(chatCoreScopeValue1350.id));
    });
  }, {
    friendIds: chatCoreScopeValue1348,
    includeMessages: false,
    silent: true
  });
};
window.imApp.commitMomentChange = async function (chatCoreScopeValue1354, chatCoreScopeValue1355, chatCoreScopeValue1356 = {}) {
  const chatCoreScopeValue1357 = Array.isArray(window.imData.moments) ? window.imData.moments : [],
    chatCoreScopeValue1358 = chatCoreScopeValue1357.findIndex(chatCoreScopeValue1360 => String(chatCoreScopeValue1360.id) === String(chatCoreScopeValue1354)),
    chatCoreScopeValue1359 = chatCoreScopeValue1358 > -1 ? window.imApp.cloneDataSnapshot(chatCoreScopeValue1357[chatCoreScopeValue1358]) : null;
  try {
    const chatCoreScopeValue1361 = chatCoreScopeValue1358 > -1 ? chatCoreScopeValue1357[chatCoreScopeValue1358] : null;
    typeof chatCoreScopeValue1355 === "function" && (await chatCoreScopeValue1355(chatCoreScopeValue1361, chatCoreScopeValue1357, chatCoreScopeValue1358));
    window.imApp.markMomentDirty(chatCoreScopeValue1354);
    if (chatCoreScopeValue1356.immediate === false) return window.imApp.scheduleMomentSave(chatCoreScopeValue1354, {
      delay: chatCoreScopeValue1356.delay,
      silent: chatCoreScopeValue1356.silent !== false
    }), typeof chatCoreScopeValue1356.onSuccess === "function" && chatCoreScopeValue1356.onSuccess(window.imData.moments), true;
    const chatCoreScopeValue1362 = await window.imApp.flushMomentSave(chatCoreScopeValue1354, {
      silent: !!chatCoreScopeValue1356.silent
    });
    if (!chatCoreScopeValue1362) return chatCoreScopeValue1358 > -1 && (chatCoreScopeValue1359 ? window.imData.moments[chatCoreScopeValue1358] = chatCoreScopeValue1359 : window.imData.moments.splice(chatCoreScopeValue1358, 1)), typeof chatCoreScopeValue1356.onRollback === "function" && chatCoreScopeValue1356.onRollback(window.imData.moments), false;
    return typeof chatCoreScopeValue1356.onSuccess === "function" && chatCoreScopeValue1356.onSuccess(window.imData.moments), true;
  } catch (chatCoreScopeValue1363) {
    return console.error("Failed to commit moment change", chatCoreScopeValue1363), chatCoreScopeValue1358 > -1 && (chatCoreScopeValue1359 ? window.imData.moments[chatCoreScopeValue1358] = chatCoreScopeValue1359 : window.imData.moments.splice(chatCoreScopeValue1358, 1)), typeof chatCoreScopeValue1356.onRollback === "function" && chatCoreScopeValue1356.onRollback(window.imData.moments), !chatCoreScopeValue1356.silent && window.showToast && window.showToast("朋友圈保存失败，已撤销本次修改"), false;
  }
};
window.imApp.deleteMomentPermanently = async function (chatCoreScopeValue1364, chatCoreScopeValue1365 = {}) {
  if (chatCoreScopeValue1364 == null) return false;
  const chatCoreScopeValue1366 = String(chatCoreScopeValue1364);
  let chatCoreScopeValue1367 = [],
    chatCoreScopeValue1368 = [];
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (window.imApp.ensureMomentsReady) await window.imApp.ensureMomentsReady();
    if (window.imApp.ensureMomentMessagesReady) await window.imApp.ensureMomentMessagesReady();
    chatCoreScopeValue1367 = window.imApp.cloneDataSnapshot(Array.isArray(window.imData.moments) ? window.imData.moments : []);
    chatCoreScopeValue1368 = window.imApp.cloneDataSnapshot(Array.isArray(window.imData.momentMessages) ? window.imData.momentMessages : []);
    const chatCoreScopeValue1369 = window.imApp.saveState.momentTimers.get(chatCoreScopeValue1366);
    chatCoreScopeValue1369 && (clearTimeout(chatCoreScopeValue1369), window.imApp.saveState.momentTimers["delete"](chatCoreScopeValue1366));
    const chatCoreScopeValue1370 = window.imApp.saveState.momentFlushChains.get(chatCoreScopeValue1366);
    chatCoreScopeValue1370 && (await chatCoreScopeValue1370["catch"](() => false));
    window.imData.moments = (Array.isArray(window.imData.moments) ? window.imData.moments : []).filter(chatCoreScopeValue1371 => String(chatCoreScopeValue1371?.id) !== chatCoreScopeValue1366);
    window.imData.momentMessages = (Array.isArray(window.imData.momentMessages) ? window.imData.momentMessages : []).filter(chatCoreScopeValue1372 => String(chatCoreScopeValue1372?.momentId) !== chatCoreScopeValue1366);
    window.imApp.saveState.momentDirtyIds["delete"](chatCoreScopeValue1366);
    window.imApp.saveState.momentRevisions["delete"](chatCoreScopeValue1366);
    window.imApp.saveState.momentFlushChains["delete"](chatCoreScopeValue1366);
    if (window.imStorage?.deleteMoment) {
      const chatCoreScopeValue1373 = await window.imStorage.deleteMoment(chatCoreScopeValue1364);
      if (chatCoreScopeValue1373 === false) throw new Error("deleteMoment failed");
    }
    if (window.imStorage?.saveMoments) {
      const chatCoreScopeValue1374 = await window.imStorage.saveMoments(window.imData.moments);
      if (chatCoreScopeValue1374 === false) throw new Error("saveMoments failed");
    } else {
      if (window.imApp.saveMoments) {
        const chatCoreScopeValue1375 = await window.imApp.saveMoments({
          silent: chatCoreScopeValue1365.silent !== false
        });
        if (!chatCoreScopeValue1375) throw new Error("saveMoments failed");
      }
    }
    if (window.imStorage?.saveMomentMessages) {
      const chatCoreScopeValue1376 = await window.imStorage.saveMomentMessages(window.imData.momentMessages);
      if (chatCoreScopeValue1376 === false) throw new Error("saveMomentMessages failed");
      window.imApp.saveState.momentMessagesDirty = false;
    } else {
      if (window.imApp.saveMomentMessages) {
        const chatCoreScopeValue1377 = await window.imApp.saveMomentMessages({
          silent: chatCoreScopeValue1365.silent !== false
        });
        if (!chatCoreScopeValue1377) throw new Error("saveMomentMessages failed");
      }
    }
    return window.imApp.saveState.lastError = null, window.imApp.saveState.dirty = window.imApp.saveState.friendDirtyIds.size > 0 || window.imApp.saveState.momentDirtyIds.size > 0 || window.imApp.saveState.momentMessagesDirty || window.imApp.saveState.stickersDirty || window.imApp.saveState.momentsCoverDirty, true;
  } catch (chatCoreScopeValue1378) {
    console.error("Failed to permanently delete moment", chatCoreScopeValue1378);
    window.imData.moments = chatCoreScopeValue1367;
    window.imData.momentMessages = chatCoreScopeValue1368;
    window.imApp.saveState.lastError = chatCoreScopeValue1378;
    try {
      window.imStorage?.saveMoments && (await window.imStorage.saveMoments(chatCoreScopeValue1367));
      window.imStorage?.saveMomentMessages && (await window.imStorage.saveMomentMessages(chatCoreScopeValue1368));
    } catch (chatCoreScopeValue1379) {
      console.error("Failed to restore moment deletion rollback", chatCoreScopeValue1379);
    }
    return !chatCoreScopeValue1365.silent && window.showToast && window.showToast("朋友圈删除失败，已恢复"), false;
  }
};
window.imApp.saveFriends = async function (chatCoreScopeValue1380 = {}) {
  return window.imApp.flushGlobalSave(chatCoreScopeValue1380);
};
window.imApp.saveMoments = async function (chatCoreScopeValue1381 = {}) {
  return window.imApp.flushGlobalSave(chatCoreScopeValue1381);
};
window.imApp.saveMomentMessages = async function (chatCoreScopeValue1382 = {}) {
  window.imApp.markMomentMessagesDirty();
  if (chatCoreScopeValue1382.immediate === false) return window.imApp.scheduleGlobalSave({
    delay: chatCoreScopeValue1382.delay,
    silent: chatCoreScopeValue1382.silent !== false
  }), true;
  return window.imApp.flushMomentMessagesSave(chatCoreScopeValue1382);
};
window.imApp.saveStickers = async function (chatCoreScopeValue1383 = {}) {
  window.imApp.markStickersDirty();
  if (chatCoreScopeValue1383.immediate === false) return window.imApp.scheduleGlobalSave({
    delay: chatCoreScopeValue1383.delay,
    silent: chatCoreScopeValue1383.silent !== false
  }), true;
  return window.imApp.flushStickersSave(chatCoreScopeValue1383);
};
window.imApp.commitStickersChange = async function (chatCoreScopeValue1384, chatCoreScopeValue1385 = {}) {
  const chatCoreScopeValue1386 = window.imApp.cloneDataSnapshot(Array.isArray(window.imData.stickers) ? window.imData.stickers : []);
  try {
    typeof chatCoreScopeValue1384 === "function" && (await chatCoreScopeValue1384(window.imData.stickers));
    window.imApp.markStickersDirty();
    if (chatCoreScopeValue1385.immediate === false) return window.imApp.scheduleGlobalSave({
      delay: chatCoreScopeValue1385.delay,
      silent: chatCoreScopeValue1385.silent !== false
    }), typeof chatCoreScopeValue1385.onSuccess === "function" && chatCoreScopeValue1385.onSuccess(window.imData.stickers), window.dispatchEvent(new CustomEvent("u2:stickers-data-changed", {
      detail: {
        stickers: window.imData.stickers
      }
    })), true;
    const chatCoreScopeValue1387 = await window.imApp.flushStickersSave({
      silent: !!chatCoreScopeValue1385.silent
    });
    if (!chatCoreScopeValue1387) return window.imData.stickers = chatCoreScopeValue1386, typeof chatCoreScopeValue1385.onRollback === "function" && chatCoreScopeValue1385.onRollback(window.imData.stickers), false;
    return typeof chatCoreScopeValue1385.onSuccess === "function" && chatCoreScopeValue1385.onSuccess(window.imData.stickers), window.dispatchEvent(new CustomEvent("u2:stickers-data-changed", {
      detail: {
        stickers: window.imData.stickers
      }
    })), true;
  } catch (chatCoreScopeValue1388) {
    return console.error("Failed to commit stickers change", chatCoreScopeValue1388), window.imData.stickers = chatCoreScopeValue1386, typeof chatCoreScopeValue1385.onRollback === "function" && chatCoreScopeValue1385.onRollback(window.imData.stickers), !chatCoreScopeValue1385.silent && window.showToast && window.showToast("表情包保存失败，已撤销本次修改"), false;
  }
};
window.imApp.saveMomentsCover = async function (chatCoreScopeValue1389, chatCoreScopeValue1390 = {}) {
  window.imData.momentsCoverUrl = chatCoreScopeValue1389 || null;
  window.imApp.markMomentsCoverDirty();
  if (chatCoreScopeValue1390.immediate === false) return window.imApp.scheduleGlobalSave({
    delay: chatCoreScopeValue1390.delay,
    silent: chatCoreScopeValue1390.silent !== false
  }), window.imData.momentsCoverUrl;
  const chatCoreScopeValue1391 = await window.imApp.flushMomentsCoverSave(chatCoreScopeValue1390);
  return chatCoreScopeValue1391 ? window.imData.momentsCoverUrl : null;
};
window.imApp.getStorageUsage = async function () {
  try {
    if (!window.imStorage || !window.imStorage.measureApproximateUsage) return 0;
    return await window.imStorage.measureApproximateUsage();
  } catch (chatCoreScopeValue1392) {
    return console.error("Failed to measure iMessage storage usage", chatCoreScopeValue1392), 0;
  }
};
window.imApp.clearRuntimeCache = function () {
  try {
    return window.imStorage?.clearRuntimeAssetCache && window.imStorage.clearRuntimeAssetCache(), window.imStorage?.pruneRuntimeAssetCache && window.imStorage.pruneRuntimeAssetCache(0), true;
  } catch (chatCoreScopeValue1393) {
    return console.error("Failed to clear iMessage runtime cache", chatCoreScopeValue1393), false;
  }
};
window.getGlobalWorldBookContextByPosition = function (chatCoreScopeValue1394 = "before_role", chatCoreScopeValue1395 = "", chatCoreScopeValue1396 = {}) {
  const chatCoreScopeValue1397 = window.normalizeWorldBookEntry ? window.normalizeWorldBookEntry : function (chatCoreScopeValue1403 = {}) {
      return {
        title: chatCoreScopeValue1403.title || chatCoreScopeValue1403.name || chatCoreScopeValue1403.keyword || "未命名词条",
        keyword: chatCoreScopeValue1403.keyword || "",
        content: chatCoreScopeValue1403.content || "",
        triggerMode: chatCoreScopeValue1403.triggerMode === "keyword" ? "keyword" : "permanent",
        injectionPosition: ["before_role", "after_role", "system_depth"].includes(chatCoreScopeValue1403.injectionPosition) ? chatCoreScopeValue1403.injectionPosition : "before_role",
        systemDepth: Number.isFinite(Number(chatCoreScopeValue1403.systemDepth)) ? Number(chatCoreScopeValue1403.systemDepth) : 4,
        order: Number.isFinite(Number(chatCoreScopeValue1403.order)) ? Number(chatCoreScopeValue1403.order) : 100,
        recursive: false,
        enabled: chatCoreScopeValue1403.enabled !== false
      };
    },
    chatCoreScopeValue1398 = window.worldBookKeywordMatched ? window.worldBookKeywordMatched : function (chatCoreScopeValue1404, chatCoreScopeValue1405 = "") {
      if (!chatCoreScopeValue1404 || chatCoreScopeValue1404.triggerMode !== "keyword") return true;
      const chatCoreScopeValue1406 = chatCoreScopeValue1404.keyword ? String(chatCoreScopeValue1404.keyword).trim() : "";
      if (!chatCoreScopeValue1406) return false;
      return String(chatCoreScopeValue1405 || "").includes(chatCoreScopeValue1406);
    },
    chatCoreScopeValue1399 = window.formatWorldBookEntryForPrompt ? window.formatWorldBookEntryForPrompt : function (chatCoreScopeValue1407) {
      const chatCoreScopeValue1408 = chatCoreScopeValue1407.title ? String(chatCoreScopeValue1407.title).trim() : "未命名词条",
        chatCoreScopeValue1409 = chatCoreScopeValue1407.keyword ? String(chatCoreScopeValue1407.keyword).trim() : "",
        chatCoreScopeValue1410 = chatCoreScopeValue1407.content ? String(chatCoreScopeValue1407.content).trim() : "",
        chatCoreScopeValue1411 = chatCoreScopeValue1407.triggerMode === "keyword" ? "关键词" : "永久";
      let chatCoreScopeValue1412 = "角色前";
      if (chatCoreScopeValue1407.injectionPosition === "after_role") chatCoreScopeValue1412 = "角色后";
      if (chatCoreScopeValue1407.injectionPosition === "system_depth") chatCoreScopeValue1412 = "系统深度";
      let chatCoreScopeValue1413 = "【" + chatCoreScopeValue1408 + `】
`;
      return chatCoreScopeValue1413 += "触发机制: " + chatCoreScopeValue1411 + `
`, chatCoreScopeValue1413 += "注入位置: " + chatCoreScopeValue1412 + `
`, chatCoreScopeValue1407.injectionPosition === "system_depth" && (chatCoreScopeValue1413 += "深度: " + chatCoreScopeValue1407.systemDepth + `
`, chatCoreScopeValue1413 += "顺序: " + chatCoreScopeValue1407.order + `
`), chatCoreScopeValue1407.triggerMode === "keyword" && chatCoreScopeValue1409 && (chatCoreScopeValue1413 += "关键词: " + chatCoreScopeValue1409 + `
`), chatCoreScopeValue1410 && (chatCoreScopeValue1413 += `内容:
` + chatCoreScopeValue1410 + `
`), chatCoreScopeValue1413.trim();
    },
    chatCoreScopeValue1400 = {
      before_role: "World Book / 角色前",
      after_role: "World Book / 角色后",
      system_depth: "World Book / 系统深度"
    },
    chatCoreScopeValue1401 = [];
  if (window.getWorldBooks) {
    const chatCoreScopeValue1414 = window.getWorldBooks();
    if (Array.isArray(chatCoreScopeValue1414) && chatCoreScopeValue1414.length > 0) {
      const chatCoreScopeValue1415 = chatCoreScopeValue1414.filter(chatCoreScopeValue1416 => chatCoreScopeValue1416 && chatCoreScopeValue1416.isGlobal && Array.isArray(chatCoreScopeValue1416.entries) && chatCoreScopeValue1416.entries.length > 0);
      chatCoreScopeValue1415.forEach(chatCoreScopeValue1417 => {
        chatCoreScopeValue1417.entries.map(chatCoreScopeValue1418 => chatCoreScopeValue1397(chatCoreScopeValue1418)).filter(chatCoreScopeValue1419 => chatCoreScopeValue1419 && chatCoreScopeValue1419.enabled !== false).filter(chatCoreScopeValue1420 => chatCoreScopeValue1420.injectionPosition === chatCoreScopeValue1394).filter(chatCoreScopeValue1421 => chatCoreScopeValue1398(chatCoreScopeValue1421, chatCoreScopeValue1395)).forEach(chatCoreScopeValue1422 => {
          chatCoreScopeValue1401.push({
            ...chatCoreScopeValue1422,
            __bookName: chatCoreScopeValue1417.name || "未命名世界书"
          });
        });
      });
    }
  }
  const chatCoreScopeValue1402 = [];
  if (chatCoreScopeValue1401.length > 0) {
    chatCoreScopeValue1401.sort((chatCoreScopeValue1424, chatCoreScopeValue1425) => {
      if (chatCoreScopeValue1394 === "system_depth") {
        if (chatCoreScopeValue1424.systemDepth !== chatCoreScopeValue1425.systemDepth) return chatCoreScopeValue1424.systemDepth - chatCoreScopeValue1425.systemDepth;
        return chatCoreScopeValue1424.order - chatCoreScopeValue1425.order;
      }
      return chatCoreScopeValue1424.order - chatCoreScopeValue1425.order;
    });
    let chatCoreScopeValue1423 = chatCoreScopeValue1400[chatCoreScopeValue1394] + `:
`;
    chatCoreScopeValue1401.forEach(chatCoreScopeValue1426 => {
      chatCoreScopeValue1423 += "〔" + chatCoreScopeValue1426.__bookName + `〕
` + chatCoreScopeValue1399(chatCoreScopeValue1426) + `

`;
    });
    chatCoreScopeValue1402.push(chatCoreScopeValue1423.trim());
  }
  if (chatCoreScopeValue1396.includeBuiltin !== false && window.getBuiltinWorldBookContext) {
    const chatCoreScopeValue1427 = window.getBuiltinWorldBookContext(chatCoreScopeValue1394, chatCoreScopeValue1395, chatCoreScopeValue1396);
    chatCoreScopeValue1427 && chatCoreScopeValue1402.push(chatCoreScopeValue1427.trim());
  }
  return chatCoreScopeValue1402.join(`

`).trim();
};
window.getGlobalWorldBookContext = function (chatCoreScopeValue1428 = "") {
  const chatCoreScopeValue1429 = ["system_depth", "before_role", "after_role"],
    chatCoreScopeValue1430 = chatCoreScopeValue1429.map(chatCoreScopeValue1431 => window.getGlobalWorldBookContextByPosition(chatCoreScopeValue1431, chatCoreScopeValue1428)).filter(Boolean);
  return chatCoreScopeValue1430.join(`

`).trim();
};
window.imApp.getWorldBookContextForFriendByPosition = function (chatCoreScopeValue1432 = "before_role", chatCoreScopeValue1433 = null, chatCoreScopeValue1434 = "", chatCoreScopeValue1435 = {}) {
  const chatCoreScopeValue1436 = window.normalizeWorldBookEntry ? window.normalizeWorldBookEntry : function (chatCoreScopeValue1444 = {}) {
      return {
        title: chatCoreScopeValue1444.title || chatCoreScopeValue1444.name || chatCoreScopeValue1444.keyword || "未命名词条",
        keyword: chatCoreScopeValue1444.keyword || "",
        content: chatCoreScopeValue1444.content || "",
        triggerMode: chatCoreScopeValue1444.triggerMode === "keyword" ? "keyword" : "permanent",
        injectionPosition: ["before_role", "after_role", "system_depth"].includes(chatCoreScopeValue1444.injectionPosition) ? chatCoreScopeValue1444.injectionPosition : "before_role",
        systemDepth: Number.isFinite(Number(chatCoreScopeValue1444.systemDepth)) ? Number(chatCoreScopeValue1444.systemDepth) : 4,
        order: Number.isFinite(Number(chatCoreScopeValue1444.order)) ? Number(chatCoreScopeValue1444.order) : 100,
        enabled: chatCoreScopeValue1444.enabled !== false
      };
    },
    chatCoreScopeValue1437 = window.worldBookKeywordMatched ? window.worldBookKeywordMatched : function (chatCoreScopeValue1445, chatCoreScopeValue1446 = "") {
      if (!chatCoreScopeValue1445 || chatCoreScopeValue1445.triggerMode !== "keyword") return true;
      const chatCoreScopeValue1447 = chatCoreScopeValue1445.keyword ? String(chatCoreScopeValue1445.keyword).trim() : "";
      if (!chatCoreScopeValue1447) return false;
      return String(chatCoreScopeValue1446 || "").includes(chatCoreScopeValue1447);
    },
    chatCoreScopeValue1438 = window.formatWorldBookEntryForPrompt ? window.formatWorldBookEntryForPrompt : function (chatCoreScopeValue1448) {
      const chatCoreScopeValue1449 = chatCoreScopeValue1448.title ? String(chatCoreScopeValue1448.title).trim() : "未命名词条",
        chatCoreScopeValue1450 = chatCoreScopeValue1448.keyword ? String(chatCoreScopeValue1448.keyword).trim() : "",
        chatCoreScopeValue1451 = chatCoreScopeValue1448.content ? String(chatCoreScopeValue1448.content).trim() : "",
        chatCoreScopeValue1452 = chatCoreScopeValue1448.triggerMode === "keyword" ? "关键词" : "永久";
      let chatCoreScopeValue1453 = "角色前";
      if (chatCoreScopeValue1448.injectionPosition === "after_role") chatCoreScopeValue1453 = "角色后";
      if (chatCoreScopeValue1448.injectionPosition === "system_depth") chatCoreScopeValue1453 = "系统深度";
      let chatCoreScopeValue1454 = "【" + chatCoreScopeValue1449 + `】
`;
      return chatCoreScopeValue1454 += "触发机制: " + chatCoreScopeValue1452 + `
`, chatCoreScopeValue1454 += "注入位置: " + chatCoreScopeValue1453 + `
`, chatCoreScopeValue1448.injectionPosition === "system_depth" && (chatCoreScopeValue1454 += "深度: " + chatCoreScopeValue1448.systemDepth + `
`, chatCoreScopeValue1454 += "顺序: " + chatCoreScopeValue1448.order + `
`), chatCoreScopeValue1448.triggerMode === "keyword" && chatCoreScopeValue1450 && (chatCoreScopeValue1454 += "关键词: " + chatCoreScopeValue1450 + `
`), chatCoreScopeValue1451 && (chatCoreScopeValue1454 += `内容:
` + chatCoreScopeValue1451 + `
`), chatCoreScopeValue1454.trim();
    },
    chatCoreScopeValue1439 = {
      before_role: "Bound World Book / 绑定角色前",
      after_role: "Bound World Book / 绑定角色后",
      system_depth: "Bound World Book / 绑定系统深度"
    },
    chatCoreScopeValue1440 = [],
    chatCoreScopeValue1441 = chatCoreScopeValue1435.includeGlobal === false ? "" : window.getGlobalWorldBookContextByPosition?.(chatCoreScopeValue1432, chatCoreScopeValue1434, chatCoreScopeValue1435) || "";
  chatCoreScopeValue1441 && chatCoreScopeValue1440.push(chatCoreScopeValue1441.trim());
  const chatCoreScopeValue1442 = chatCoreScopeValue1433 ? window.imApp.normalizeFriendData(chatCoreScopeValue1433) : null,
    chatCoreScopeValue1443 = chatCoreScopeValue1442 && Array.isArray(chatCoreScopeValue1442.boundBooks) ? chatCoreScopeValue1442.boundBooks.map(chatCoreScopeValue1455 => String(chatCoreScopeValue1455)) : [];
  if (chatCoreScopeValue1443.length > 0 && window.getWorldBooks) {
    const chatCoreScopeValue1456 = window.getWorldBooks(),
      chatCoreScopeValue1457 = [];
    Array.isArray(chatCoreScopeValue1456) && chatCoreScopeValue1456.filter(chatCoreScopeValue1458 => chatCoreScopeValue1458 && !chatCoreScopeValue1458.isGlobal && chatCoreScopeValue1443.includes(String(chatCoreScopeValue1458.id)) && Array.isArray(chatCoreScopeValue1458.entries)).forEach(chatCoreScopeValue1459 => {
      chatCoreScopeValue1459.entries.map(chatCoreScopeValue1460 => chatCoreScopeValue1436(chatCoreScopeValue1460)).filter(chatCoreScopeValue1461 => chatCoreScopeValue1461 && chatCoreScopeValue1461.enabled !== false).filter(chatCoreScopeValue1462 => chatCoreScopeValue1462.injectionPosition === chatCoreScopeValue1432).filter(chatCoreScopeValue1463 => chatCoreScopeValue1437(chatCoreScopeValue1463, chatCoreScopeValue1434)).forEach(chatCoreScopeValue1464 => {
        chatCoreScopeValue1457.push({
          ...chatCoreScopeValue1464,
          __bookName: chatCoreScopeValue1459.name || "未命名世界书"
        });
      });
    });
    if (chatCoreScopeValue1457.length > 0) {
      chatCoreScopeValue1457.sort((chatCoreScopeValue1466, chatCoreScopeValue1467) => {
        if (chatCoreScopeValue1432 === "system_depth") {
          if (chatCoreScopeValue1466.systemDepth !== chatCoreScopeValue1467.systemDepth) return chatCoreScopeValue1466.systemDepth - chatCoreScopeValue1467.systemDepth;
          return chatCoreScopeValue1466.order - chatCoreScopeValue1467.order;
        }
        return chatCoreScopeValue1466.order - chatCoreScopeValue1467.order;
      });
      let chatCoreScopeValue1465 = chatCoreScopeValue1439[chatCoreScopeValue1432] + `:
`;
      chatCoreScopeValue1457.forEach(chatCoreScopeValue1468 => {
        chatCoreScopeValue1465 += "〔" + chatCoreScopeValue1468.__bookName + `〕
` + chatCoreScopeValue1438(chatCoreScopeValue1468) + `

`;
      });
      chatCoreScopeValue1440.push(chatCoreScopeValue1465.trim());
    }
  }
  return chatCoreScopeValue1440.join(`

`).trim();
};
window.getWorldBookContextForFriendByPosition = function (chatCoreScopeValue1469 = "before_role", chatCoreScopeValue1470 = null, chatCoreScopeValue1471 = "", chatCoreScopeValue1472 = {}) {
  return window.imApp.getWorldBookContextForFriendByPosition(chatCoreScopeValue1469, chatCoreScopeValue1470, chatCoreScopeValue1471, chatCoreScopeValue1472);
};
window.imApp.commitFriendMetaPatch = async function (chatCoreScopeValue1473, chatCoreScopeValue1474, chatCoreScopeValue1475 = {}) {
  const chatCoreScopeValue1476 = String(chatCoreScopeValue1473),
    chatCoreScopeValue1477 = (window.imData.friends || []).find(chatCoreScopeValue1480 => String(chatCoreScopeValue1480.id) === chatCoreScopeValue1476);
  if (!chatCoreScopeValue1477 || !chatCoreScopeValue1474 || typeof chatCoreScopeValue1474 !== "object") return false;
  const chatCoreScopeValue1478 = Object.entries(chatCoreScopeValue1474).filter(([chatCoreScopeValue1481]) => chatCoreScopeValue1481 !== "id" && chatCoreScopeValue1481 !== "messages");
  if (chatCoreScopeValue1478.length === 0) return true;
  const chatCoreScopeValue1479 = new Map(chatCoreScopeValue1478.map(([chatCoreScopeValue1482]) => [chatCoreScopeValue1482, {
    present: Object.prototype.hasOwnProperty.call(chatCoreScopeValue1477, chatCoreScopeValue1482),
    value: chatCoreScopeValue1477[chatCoreScopeValue1482]
  }]));
  chatCoreScopeValue1478.forEach(([chatCoreScopeValue1483, chatCoreScopeValue1484]) => {
    chatCoreScopeValue1477[chatCoreScopeValue1483] = chatCoreScopeValue1484;
  });
  window.imApp.syncActiveFriendReference(chatCoreScopeValue1477);
  window.imApp.syncSettingsFriendReference(chatCoreScopeValue1477);
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage?.patchFriendMeta) throw new Error("Incremental friend metadata persistence unavailable");
    await window.imApp.runFriendPersistenceTask(chatCoreScopeValue1476, () => window.imStorage.patchFriendMeta(chatCoreScopeValue1476, chatCoreScopeValue1474));
    window.imApp.saveState.lastError = null;
    if (typeof chatCoreScopeValue1475.onSuccess === "function") chatCoreScopeValue1475.onSuccess(chatCoreScopeValue1477);
    return true;
  } catch (chatCoreScopeValue1485) {
    chatCoreScopeValue1479.forEach((chatCoreScopeValue1486, chatCoreScopeValue1487) => {
      if (chatCoreScopeValue1477[chatCoreScopeValue1487] !== chatCoreScopeValue1474[chatCoreScopeValue1487]) return;
      if (chatCoreScopeValue1486.present) chatCoreScopeValue1477[chatCoreScopeValue1487] = chatCoreScopeValue1486.value;else delete chatCoreScopeValue1477[chatCoreScopeValue1487];
    });
    window.imApp.syncActiveFriendReference(chatCoreScopeValue1477);
    window.imApp.syncSettingsFriendReference(chatCoreScopeValue1477);
    window.imApp.saveState.lastError = chatCoreScopeValue1485;
    console.error("Failed to patch friend metadata", chatCoreScopeValue1485);
    if (!chatCoreScopeValue1475.silent && window.showToast) window.showToast("好友数据保存失败");
    if (typeof chatCoreScopeValue1475.onRollback === "function") chatCoreScopeValue1475.onRollback(chatCoreScopeValue1477);
    return false;
  }
};
window.imApp.getWorldBookContextForFriendByPosition = function (chatCoreScopeValue1488 = "before_role", chatCoreScopeValue1489 = null, chatCoreScopeValue1490 = "", chatCoreScopeValue1491 = {}) {
  const chatCoreScopeValue1492 = window.normalizeWorldBookEntry ? window.normalizeWorldBookEntry : function (chatCoreScopeValue1500 = {}) {
      return {
        title: chatCoreScopeValue1500.title || chatCoreScopeValue1500.name || chatCoreScopeValue1500.keyword || "未命名词条",
        keyword: chatCoreScopeValue1500.keyword || "",
        content: chatCoreScopeValue1500.content || "",
        triggerMode: chatCoreScopeValue1500.triggerMode === "keyword" ? "keyword" : "permanent",
        injectionPosition: ["before_role", "after_role", "system_depth"].includes(chatCoreScopeValue1500.injectionPosition) ? chatCoreScopeValue1500.injectionPosition : "before_role",
        systemDepth: Number.isFinite(Number(chatCoreScopeValue1500.systemDepth)) ? Number(chatCoreScopeValue1500.systemDepth) : 4,
        order: Number.isFinite(Number(chatCoreScopeValue1500.order)) ? Number(chatCoreScopeValue1500.order) : 100,
        enabled: chatCoreScopeValue1500.enabled !== false
      };
    },
    chatCoreScopeValue1493 = window.worldBookKeywordMatched ? window.worldBookKeywordMatched : function (chatCoreScopeValue1501, chatCoreScopeValue1502 = "") {
      if (!chatCoreScopeValue1501 || chatCoreScopeValue1501.triggerMode !== "keyword") return true;
      const chatCoreScopeValue1503 = chatCoreScopeValue1501.keyword ? String(chatCoreScopeValue1501.keyword).trim() : "";
      if (!chatCoreScopeValue1503) return false;
      return String(chatCoreScopeValue1502 || "").includes(chatCoreScopeValue1503);
    },
    chatCoreScopeValue1494 = window.formatWorldBookEntryForPrompt ? window.formatWorldBookEntryForPrompt : function (chatCoreScopeValue1504) {
      const chatCoreScopeValue1505 = chatCoreScopeValue1504.title ? String(chatCoreScopeValue1504.title).trim() : "未命名词条",
        chatCoreScopeValue1506 = chatCoreScopeValue1504.keyword ? String(chatCoreScopeValue1504.keyword).trim() : "",
        chatCoreScopeValue1507 = chatCoreScopeValue1504.content ? String(chatCoreScopeValue1504.content).trim() : "",
        chatCoreScopeValue1508 = chatCoreScopeValue1504.triggerMode === "keyword" ? "关键词" : "永久";
      let chatCoreScopeValue1509 = "角色前";
      if (chatCoreScopeValue1504.injectionPosition === "after_role") chatCoreScopeValue1509 = "角色后";
      if (chatCoreScopeValue1504.injectionPosition === "system_depth") chatCoreScopeValue1509 = "系统深度";
      let chatCoreScopeValue1510 = "【" + chatCoreScopeValue1505 + `】
`;
      return chatCoreScopeValue1510 += "触发机制: " + chatCoreScopeValue1508 + `
`, chatCoreScopeValue1510 += "注入位置: " + chatCoreScopeValue1509 + `
`, chatCoreScopeValue1504.injectionPosition === "system_depth" && (chatCoreScopeValue1510 += "深度: " + chatCoreScopeValue1504.systemDepth + `
`, chatCoreScopeValue1510 += "顺序: " + chatCoreScopeValue1504.order + `
`), chatCoreScopeValue1504.triggerMode === "keyword" && chatCoreScopeValue1506 && (chatCoreScopeValue1510 += "关键词: " + chatCoreScopeValue1506 + `
`), chatCoreScopeValue1507 && (chatCoreScopeValue1510 += `内容:
` + chatCoreScopeValue1507 + `
`), chatCoreScopeValue1510.trim();
    },
    chatCoreScopeValue1495 = {
      before_role: "Bound World Book / 绑定角色前",
      after_role: "Bound World Book / 绑定角色后",
      system_depth: "Bound World Book / 绑定系统深度"
    },
    chatCoreScopeValue1496 = [],
    chatCoreScopeValue1497 = chatCoreScopeValue1491.includeGlobal === false ? "" : window.getGlobalWorldBookContextByPosition?.(chatCoreScopeValue1488, chatCoreScopeValue1490, chatCoreScopeValue1491) || "";
  chatCoreScopeValue1497 && chatCoreScopeValue1496.push(chatCoreScopeValue1497.trim());
  const chatCoreScopeValue1498 = chatCoreScopeValue1489 ? window.imApp.normalizeFriendData(chatCoreScopeValue1489) : null,
    chatCoreScopeValue1499 = chatCoreScopeValue1498 && Array.isArray(chatCoreScopeValue1498.boundBooks) ? chatCoreScopeValue1498.boundBooks.map(chatCoreScopeValue1511 => String(chatCoreScopeValue1511)) : [];
  if (chatCoreScopeValue1499.length > 0 && window.getWorldBooks) {
    const chatCoreScopeValue1512 = window.getWorldBooks(),
      chatCoreScopeValue1513 = [];
    Array.isArray(chatCoreScopeValue1512) && chatCoreScopeValue1512.filter(chatCoreScopeValue1514 => chatCoreScopeValue1514 && !chatCoreScopeValue1514.isGlobal && chatCoreScopeValue1499.includes(String(chatCoreScopeValue1514.id)) && Array.isArray(chatCoreScopeValue1514.entries)).forEach(chatCoreScopeValue1515 => {
      chatCoreScopeValue1515.entries.map(chatCoreScopeValue1516 => chatCoreScopeValue1492(chatCoreScopeValue1516)).filter(chatCoreScopeValue1517 => chatCoreScopeValue1517 && chatCoreScopeValue1517.enabled !== false).filter(chatCoreScopeValue1518 => chatCoreScopeValue1518.injectionPosition === chatCoreScopeValue1488).filter(chatCoreScopeValue1519 => chatCoreScopeValue1493(chatCoreScopeValue1519, chatCoreScopeValue1490)).forEach(chatCoreScopeValue1520 => {
        chatCoreScopeValue1513.push({
          ...chatCoreScopeValue1520,
          __bookName: chatCoreScopeValue1515.name || "未命名世界书"
        });
      });
    });
    if (chatCoreScopeValue1513.length > 0) {
      chatCoreScopeValue1513.sort((chatCoreScopeValue1522, chatCoreScopeValue1523) => {
        if (chatCoreScopeValue1488 === "system_depth") {
          if (chatCoreScopeValue1522.systemDepth !== chatCoreScopeValue1523.systemDepth) return chatCoreScopeValue1522.systemDepth - chatCoreScopeValue1523.systemDepth;
          return chatCoreScopeValue1522.order - chatCoreScopeValue1523.order;
        }
        return chatCoreScopeValue1522.order - chatCoreScopeValue1523.order;
      });
      let chatCoreScopeValue1521 = chatCoreScopeValue1495[chatCoreScopeValue1488] + `:
`;
      chatCoreScopeValue1513.forEach(chatCoreScopeValue1524 => {
        chatCoreScopeValue1521 += "〔" + chatCoreScopeValue1524.__bookName + `〕
` + chatCoreScopeValue1494(chatCoreScopeValue1524) + `

`;
      });
      chatCoreScopeValue1496.push(chatCoreScopeValue1521.trim());
    }
  }
  return chatCoreScopeValue1496.join(`

`).trim();
};
window.getWorldBookContextForFriendByPosition = function (chatCoreScopeValue1525 = "before_role", chatCoreScopeValue1526 = null, chatCoreScopeValue1527 = "", chatCoreScopeValue1528 = {}) {
  return window.imApp.getWorldBookContextForFriendByPosition(chatCoreScopeValue1525, chatCoreScopeValue1526, chatCoreScopeValue1527, chatCoreScopeValue1528);
};
window.getImFriends = () => window.imData.friends;
window.addImFriend = async function (chatCoreScopeValue1529) {
  const chatCoreScopeValue1530 = window.imApp.normalizeFriendData({
      id: Date.now(),
      type: chatCoreScopeValue1529.type || "char",
      realName: chatCoreScopeValue1529.realName || "",
      nickname: chatCoreScopeValue1529.nickname || "New Friend",
      signature: chatCoreScopeValue1529.signature || "No Signature",
      persona: chatCoreScopeValue1529.persona || "",
      avatarUrl: chatCoreScopeValue1529.avatarUrl || null,
      messages: [],
      chatBg: null,
      customCssEnabled: false,
      customCss: "",
      memory: window.imApp.createDefaultMemory()
    }),
    chatCoreScopeValue1531 = window.imApp.commitFriendsChange ? await window.imApp.commitFriendsChange(() => {
      window.imData.friends.push(chatCoreScopeValue1530);
    }, {
      friendId: chatCoreScopeValue1530.id,
      silent: true
    }) : false;
  if (!chatCoreScopeValue1531) {
    if (window.showToast) window.showToast("添加好友保存失败");
    return false;
  }
  if (window.imApp.renderFriendsList) window.imApp.renderFriendsList();
  if (window.showToast) window.showToast("已添加好友: " + chatCoreScopeValue1530.nickname);
  return true;
};
window.imApp.formatTime = function (chatCoreScopeValue1532) {
  if (!chatCoreScopeValue1532) return "";
  const chatCoreScopeValue1533 = new Date(chatCoreScopeValue1532);
  if (Number.isNaN(chatCoreScopeValue1533.getTime())) return "";
  const chatCoreScopeValue1534 = new Date();
  const chatCoreScopeValue1535 = chatCoreScopeValue1538 => Date.UTC(chatCoreScopeValue1538.getFullYear(), chatCoreScopeValue1538.getMonth(), chatCoreScopeValue1538.getDate());
  const chatCoreScopeValue1536 = Math.round((chatCoreScopeValue1535(chatCoreScopeValue1534) - chatCoreScopeValue1535(chatCoreScopeValue1533)) / 86400000);
  const chatCoreScopeValue1537 = window.imDataUtils?.formatUsTime ? window.imDataUtils.formatUsTime(chatCoreScopeValue1533) : chatCoreScopeValue1533.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
  if (chatCoreScopeValue1536 === 0) return chatCoreScopeValue1537;
  if (chatCoreScopeValue1536 === 1) return "Yesterday";
  if (chatCoreScopeValue1536 >= 2 && chatCoreScopeValue1536 <= 6) {
    return chatCoreScopeValue1533.toLocaleDateString("en-US", {
      weekday: "long"
    });
  }
  return chatCoreScopeValue1533.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit"
  });
};
window.imApp.addMomentNotification = async function (chatCoreScopeValue1539, chatCoreScopeValue1540, chatCoreScopeValue1541, chatCoreScopeValue1542 = "", chatCoreScopeValue1543 = "") {
  const chatCoreScopeValue1544 = chatCoreScopeValue1542 && typeof chatCoreScopeValue1542 === "object" ? chatCoreScopeValue1542 : {
      content: chatCoreScopeValue1542,
      thought: chatCoreScopeValue1543
    },
    chatCoreScopeValue1545 = {
      id: Date.now(),
      type: chatCoreScopeValue1539,
      userId: chatCoreScopeValue1540.id || chatCoreScopeValue1540.userId,
      userName: chatCoreScopeValue1540.nickname || chatCoreScopeValue1540.name,
      userAvatar: chatCoreScopeValue1540.avatarUrl || chatCoreScopeValue1540.avatar,
      momentId: chatCoreScopeValue1541,
      momentImg: null,
      momentText: null,
      content: String(chatCoreScopeValue1544.content || "").trim(),
      contentTranslation: String(chatCoreScopeValue1544.contentTranslation || chatCoreScopeValue1544.translation || "").trim(),
      thought: String(chatCoreScopeValue1544.thought || "").trim(),
      thoughtTranslation: String(chatCoreScopeValue1544.thoughtTranslation || "").trim(),
      language: window.imDataUtils?.normalizeChatLanguage ? window.imDataUtils.normalizeChatLanguage(chatCoreScopeValue1544.language || chatCoreScopeValue1540.language || "zh") : String(chatCoreScopeValue1544.language || chatCoreScopeValue1540.language || "zh"),
      time: Date.now(),
      read: false
    },
    chatCoreScopeValue1546 = window.imData.moments.find(chatCoreScopeValue1549 => chatCoreScopeValue1549.id === chatCoreScopeValue1541);
  if (chatCoreScopeValue1546) {
    if (chatCoreScopeValue1546.images && chatCoreScopeValue1546.images.length > 0) {
      const chatCoreScopeValue1550 = chatCoreScopeValue1546.images[0];
      chatCoreScopeValue1545.momentImg = typeof chatCoreScopeValue1550 === "object" ? chatCoreScopeValue1550.src : chatCoreScopeValue1550;
    }
    chatCoreScopeValue1545.momentText = chatCoreScopeValue1546.text;
  }
  const chatCoreScopeValue1547 = Array.isArray(window.imData.momentMessages) ? typeof structuredClone === "function" ? structuredClone(window.imData.momentMessages) : JSON.parse(JSON.stringify(window.imData.momentMessages)) : [];
  window.imData.momentMessages.unshift(chatCoreScopeValue1545);
  const chatCoreScopeValue1548 = await window.imApp.saveMomentMessages({
    silent: true
  });
  if (!chatCoreScopeValue1548) {
    window.imData.momentMessages = chatCoreScopeValue1547;
    if (window.imApp.renderMomentsMessages) window.imApp.renderMomentsMessages();
    if (window.imApp.updateMomentsNewMessageBubble) window.imApp.updateMomentsNewMessageBubble();
    if (window.showToast) window.showToast("朋友圈消息保存失败");
    return false;
  }
  if (window.imApp.renderMomentsMessages) window.imApp.renderMomentsMessages();
  if (window.imApp.updateMomentsNewMessageBubble) window.imApp.updateMomentsNewMessageBubble();
  return window.dispatchEvent(new CustomEvent("u2:moment-notification-added", {
    detail: {
      notificationId: chatCoreScopeValue1545.id
    }
  })), true;
};
window.imApp.getImessageUiState = function () {
  const chatCoreScopeValue1551 = typeof window.getAppState === "function" ? window.getAppState("imessage") : null,
    chatCoreScopeValue1552 = chatCoreScopeValue1551 && typeof chatCoreScopeValue1551 === "object" ? chatCoreScopeValue1551 : {},
    chatCoreScopeValue1553 = chatCoreScopeValue1552.uiState && typeof chatCoreScopeValue1552.uiState === "object" ? chatCoreScopeValue1552.uiState : {},
    chatCoreScopeValue1554 = chatCoreScopeValue1558 => typeof chatCoreScopeValue1558?.customCss === "string" && chatCoreScopeValue1558.customCss.includes("offline-tavern"),
    chatCoreScopeValue1555 = chatCoreScopeValue1554(chatCoreScopeValue1553.offlineTheme) || Array.isArray(chatCoreScopeValue1553.offlineThemePresets) && chatCoreScopeValue1553.offlineThemePresets.some(chatCoreScopeValue1554),
    chatCoreScopeValue1556 = window.imApp.normalizeOfflineThemePresets(chatCoreScopeValue1553.offlineThemePresets),
    chatCoreScopeValue1557 = window.imApp.normalizeOfflineThemeState(chatCoreScopeValue1553.offlineTheme);
  return chatCoreScopeValue1557.activePresetId && !chatCoreScopeValue1556.some(chatCoreScopeValue1559 => chatCoreScopeValue1559.id === chatCoreScopeValue1557.activePresetId) && (chatCoreScopeValue1557.activePresetId = ""), {
    cssPresets: Array.isArray(chatCoreScopeValue1553.cssPresets) ? chatCoreScopeValue1553.cssPresets : [],
    offlineTheme: chatCoreScopeValue1557,
    offlineThemePresets: chatCoreScopeValue1556,
    hasOfflineTheme: !!(chatCoreScopeValue1553.offlineTheme && typeof chatCoreScopeValue1553.offlineTheme === "object"),
    needsOfflineThemeCssMigration: chatCoreScopeValue1555,
    offlinePrompts: Array.isArray(chatCoreScopeValue1553.offlinePrompts) ? chatCoreScopeValue1553.offlinePrompts : [],
    offlinePromptPresets: Array.isArray(chatCoreScopeValue1553.offlinePromptPresets) ? chatCoreScopeValue1553.offlinePromptPresets : [],
    onlinePromptPresets: window.imApp.onlinePrompts?.["normalizePresets"](chatCoreScopeValue1553.onlinePromptPresets) || [],
    onlineCotPresets: window.u2ConfigPresets?.["normalizePresets"](chatCoreScopeValue1553.onlineCotPresets) || [],
    offlinePromptActivePresetId: String(chatCoreScopeValue1553.offlinePromptActivePresetId || "").trim(),
    offlinePromptsInitialized: chatCoreScopeValue1553.offlinePromptsInitialized === true,
    offlineTextReplacementRules: Array.isArray(chatCoreScopeValue1553.offlineTextReplacementRules) ? chatCoreScopeValue1553.offlineTextReplacementRules : [],
    offlineHtmlTemplateRules: Array.isArray(chatCoreScopeValue1553.offlineHtmlTemplateRules) ? chatCoreScopeValue1553.offlineHtmlTemplateRules : [],
    friendRequests: window.imApp.normalizeFriendRequests ? window.imApp.normalizeFriendRequests(chatCoreScopeValue1553.friendRequests) : Array.isArray(chatCoreScopeValue1553.friendRequests) ? chatCoreScopeValue1553.friendRequests : []
  };
};
window.imApp.saveImessageUiState = function () {
  const chatCoreScopeValue1560 = typeof window.getAppState === "function" ? window.getAppState("imessage") || {} : {},
    chatCoreScopeValue1561 = {
      ...chatCoreScopeValue1560,
      uiState: {
        ...(chatCoreScopeValue1560 && chatCoreScopeValue1560.uiState && typeof chatCoreScopeValue1560.uiState === "object" ? chatCoreScopeValue1560.uiState : {}),
        cssPresets: Array.isArray(window.imData.cssPresets) ? window.imData.cssPresets : [],
        offlineTheme: window.imApp.normalizeOfflineThemeState(window.imData.offlineTheme),
        offlineThemePresets: window.imApp.normalizeOfflineThemePresets(window.imData.offlineThemePresets),
        offlinePrompts: Array.isArray(window.imData.offlinePrompts) ? window.imData.offlinePrompts : [],
        offlinePromptPresets: Array.isArray(window.imData.offlinePromptPresets) ? window.imData.offlinePromptPresets : [],
        onlinePromptPresets: window.imApp.onlinePrompts?.["normalizePresets"](window.imData.onlinePromptPresets) || [],
        onlineCotPresets: window.u2ConfigPresets?.["normalizePresets"](window.imData.onlineCotPresets) || [],
        offlinePromptActivePresetId: String(window.imData.offlinePromptActivePresetId || "").trim(),
        offlinePromptsInitialized: window.imData.offlinePromptsInitialized === true,
        offlineTextReplacementRules: Array.isArray(window.imData.offlineTextReplacementRules) ? window.imData.offlineTextReplacementRules : [],
        offlineHtmlTemplateRules: Array.isArray(window.imData.offlineHtmlTemplateRules) ? window.imData.offlineHtmlTemplateRules : [],
        friendRequests: window.imApp.normalizeFriendRequests ? window.imApp.normalizeFriendRequests(window.imData.friendRequests) : Array.isArray(window.imData.friendRequests) ? window.imData.friendRequests : []
      }
    };
  if (typeof window.setAppState === "function") window.setAppState("imessage", chatCoreScopeValue1561);else window.saveGlobalData && window.saveGlobalData();
  return chatCoreScopeValue1561;
};
window.imApp.initializeData = async function () {
  if (window.imData.ready) return window.imData;
  try {
    if (window.imStorage) {
      if (window.__iisoNeedsLegacyStorageReset && window.imStorage.clearAllData) try {
        await window.imStorage.clearAllData();
        console.warn("Legacy iMessage IndexedDB data cleared due to storage schema upgrade.");
      } catch (chatCoreScopeValue1566) {
        console.error("Failed to clear legacy iMessage IndexedDB data during schema upgrade", chatCoreScopeValue1566);
      } finally {
        window.__iisoNeedsLegacyStorageReset = false;
      }
      const chatCoreScopeValue1563 = {
          friends: window.imStorage.loadFriends ? await window.imStorage.loadFriends() : [],
          momentsCoverUrl: window.imStorage.loadMomentsCoverUrl ? await window.imStorage.loadMomentsCoverUrl() : null
        },
        chatCoreScopeValue1564 = [],
        chatCoreScopeValue1565 = [];
      window.imData.friends = Array.isArray(chatCoreScopeValue1563.friends) ? chatCoreScopeValue1563.friends.map(chatCoreScopeValue1567 => {
        Array.isArray(chatCoreScopeValue1567?.memory?.socialAccounts) && chatCoreScopeValue1567.id != null && chatCoreScopeValue1564.push(String(chatCoreScopeValue1567.id));
        const chatCoreScopeValue1568 = window.imApp.normalizeFriendData(chatCoreScopeValue1567);
        return chatCoreScopeValue1568._statusTemplateNeedsPersistence === true && chatCoreScopeValue1568.id != null && (chatCoreScopeValue1565.push(String(chatCoreScopeValue1568.id)), delete chatCoreScopeValue1568._statusTemplateNeedsPersistence), chatCoreScopeValue1568.messages = Array.isArray(chatCoreScopeValue1567.messages) ? chatCoreScopeValue1567.messages : [], chatCoreScopeValue1568.messagesLoaded = chatCoreScopeValue1567.messagesLoaded === true, chatCoreScopeValue1568.lastMessagePreview = typeof chatCoreScopeValue1567.lastMessagePreview === "string" ? chatCoreScopeValue1567.lastMessagePreview : "", chatCoreScopeValue1568.lastMessageTimestamp = Number(chatCoreScopeValue1567.lastMessageTimestamp) || 0, chatCoreScopeValue1568.messageCount = Number(chatCoreScopeValue1567.messageCount) || chatCoreScopeValue1568.messages.length || 0, chatCoreScopeValue1568;
      }) : [];
      window.imData.moments = [];
      window.imData.momentMessages = [];
      window.imData.stickers = [];
      window.imData.momentsCoverUrl = chatCoreScopeValue1563.momentsCoverUrl || null;
      window.imData.momentsLoaded = false;
      window.imData.momentMessagesLoaded = false;
      window.imData.stickersLoaded = false;
      chatCoreScopeValue1564.length > 0 && window.imStorage.saveFriendMeta && Promise.all(chatCoreScopeValue1564.map(chatCoreScopeValue1569 => {
        const chatCoreScopeValue1570 = window.imApp.getFriendById(chatCoreScopeValue1569);
        return chatCoreScopeValue1570 ? window.imStorage.saveFriendMeta(chatCoreScopeValue1570) : null;
      }))["catch"](chatCoreScopeValue1571 => console.warn("Failed to remove legacy social-account memory data", chatCoreScopeValue1571));
      chatCoreScopeValue1565.length > 0 && window.imStorage.saveFriendMeta && Promise.all(chatCoreScopeValue1565.map(chatCoreScopeValue1572 => {
        const chatCoreScopeValue1573 = window.imApp.getFriendById(chatCoreScopeValue1572);
        return chatCoreScopeValue1573 ? window.imStorage.saveFriendMeta(chatCoreScopeValue1573) : null;
      }))["catch"](chatCoreScopeValue1574 => console.warn("Failed to migrate legacy iMessage status templates", chatCoreScopeValue1574));
    } else console.warn("imStorage not available, iMessage will run with volatile in-memory state.");
    const chatCoreScopeValue1562 = window.imApp.getImessageUiState ? window.imApp.getImessageUiState() : {
      cssPresets: [],
      offlineTheme: window.imApp.createDefaultOfflineThemeState(),
      offlineThemePresets: [],
      hasOfflineTheme: false,
      offlinePrompts: [],
      offlinePromptPresets: [],
      offlinePromptActivePresetId: "",
      offlinePromptsInitialized: false,
      offlineTextReplacementRules: [],
      offlineHtmlTemplateRules: []
    };
    window.imData.cssPresets = Array.isArray(chatCoreScopeValue1562.cssPresets) ? chatCoreScopeValue1562.cssPresets : [], window.imData.offlineTheme = window.imApp.normalizeOfflineThemeState(chatCoreScopeValue1562.offlineTheme), window.imData.offlineThemePresets = window.imApp.normalizeOfflineThemePresets(chatCoreScopeValue1562.offlineThemePresets), window.imData.offlineThemeInitialized = !!chatCoreScopeValue1562.hasOfflineTheme, window.imData.offlinePrompts = Array.isArray(chatCoreScopeValue1562.offlinePrompts) ? chatCoreScopeValue1562.offlinePrompts : [], window.imData.offlinePromptPresets = Array.isArray(chatCoreScopeValue1562.offlinePromptPresets) ? chatCoreScopeValue1562.offlinePromptPresets : [], window.imData.onlinePromptPresets = window.imApp.onlinePrompts?.["normalizePresets"](chatCoreScopeValue1562.onlinePromptPresets) || [], window.imData.onlineCotPresets = window.u2ConfigPresets?.["normalizePresets"](chatCoreScopeValue1562.onlineCotPresets) || [], window.imData.offlinePromptActivePresetId = String(chatCoreScopeValue1562.offlinePromptActivePresetId || "").trim(), window.imData.offlinePromptsInitialized = chatCoreScopeValue1562.offlinePromptsInitialized === true, window.imData.offlineTextReplacementRules = Array.isArray(chatCoreScopeValue1562.offlineTextReplacementRules) ? chatCoreScopeValue1562.offlineTextReplacementRules : [], window.imData.offlineHtmlTemplateRules = Array.isArray(chatCoreScopeValue1562.offlineHtmlTemplateRules) ? chatCoreScopeValue1562.offlineHtmlTemplateRules : [], window.imData.friendRequests = window.imApp.normalizeFriendRequests(chatCoreScopeValue1562.friendRequests), chatCoreScopeValue1562.needsOfflineThemeCssMigration && window.imApp.saveImessageUiState && window.imApp.saveImessageUiState(), window.imData.ready = true, window.appStorage?.["setMeta"] && window.appStorage.setMeta("imessage_runtime", {
      storageMode: "indexeddb",
      dataVersion: 3,
      friendsCount: Array.isArray(window.imData.friends) ? window.imData.friends.length : 0,
      lastSyncAt: Date.now()
    })["catch"](chatCoreScopeValue1575 => console.warn("Failed to persist iMessage runtime metadata", chatCoreScopeValue1575));
    document.dispatchEvent(new CustomEvent("imessage-data-ready"));
  } catch (chatCoreScopeValue1576) {
    console.error("Failed to initialize iMessage data", chatCoreScopeValue1576);
    window.imData.ready = true;
    document.dispatchEvent(new CustomEvent("imessage-data-ready"));
  }
  return window.imData;
};
window.imApp.dataReadyPromise = window.imApp.initializeData();
window.imApp.ensureDataReady = async function () {
  return window.imApp.dataReadyPromise;
};
window.imApp.ensureMomentsReady = async function () {
  if (window.imData.momentsLoaded) return Array.isArray(window.imData.moments) ? window.imData.moments : [];
  if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
  try {
    const chatCoreScopeValue1577 = window.imStorage?.loadMoments ? await window.imStorage.loadMoments() : [];
    window.imData.moments = Array.isArray(chatCoreScopeValue1577) ? chatCoreScopeValue1577 : [];
    window.imData.momentsLoaded = true;
  } catch (chatCoreScopeValue1578) {
    console.error("Failed to lazy load moments", chatCoreScopeValue1578);
    window.imData.moments = Array.isArray(window.imData.moments) ? window.imData.moments : [];
    window.imData.momentsLoaded = true;
  }
  return window.imData.moments;
};
window.imApp.ensureMomentMessagesReady = async function () {
  if (window.imData.momentMessagesLoaded) return Array.isArray(window.imData.momentMessages) ? window.imData.momentMessages : [];
  if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
  try {
    const chatCoreScopeValue1579 = window.imStorage?.loadMomentMessages ? await window.imStorage.loadMomentMessages() : [];
    window.imData.momentMessages = Array.isArray(chatCoreScopeValue1579) ? chatCoreScopeValue1579 : [];
    window.imData.momentMessagesLoaded = true;
  } catch (chatCoreScopeValue1580) {
    console.error("Failed to lazy load moment messages", chatCoreScopeValue1580);
    window.imData.momentMessages = Array.isArray(window.imData.momentMessages) ? window.imData.momentMessages : [];
    window.imData.momentMessagesLoaded = true;
  }
  return window.imData.momentMessages;
};
window.imApp.ensureStickersReady = async function () {
  if (window.imData.stickersLoaded) return Array.isArray(window.imData.stickers) ? window.imData.stickers : [];
  if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
  try {
    const chatCoreScopeValue1581 = window.imStorage?.loadStickers ? await window.imStorage.loadStickers() : [];
    window.imData.stickers = Array.isArray(chatCoreScopeValue1581) ? chatCoreScopeValue1581 : [];
    window.imData.stickersLoaded = true;
  } catch (chatCoreScopeValue1582) {
    console.error("Failed to lazy load stickers", chatCoreScopeValue1582);
    window.imData.stickers = Array.isArray(window.imData.stickers) ? window.imData.stickers : [];
    window.imData.stickersLoaded = true;
  }
  return window.imData.stickers;
};
window.imApp.ensureStickerMetadataReady = async function () {
  if (window.imData.stickersLoaded) return Array.isArray(window.imData.stickers) ? window.imData.stickers : [];
  if (window.imData.stickerMetadataLoaded) return window.imData.stickerMetadata;
  if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
  try {
    const chatCoreScopeValue1583 = window.imStorage?.loadStickerMetadata ? await window.imStorage.loadStickerMetadata() : [];
    window.imData.stickerMetadata = Array.isArray(chatCoreScopeValue1583) ? chatCoreScopeValue1583 : [];
    window.imData.stickerMetadataLoaded = true;
  } catch (chatCoreScopeValue1584) {
    console.error("Failed to load sticker metadata", chatCoreScopeValue1584);
    window.imData.stickerMetadata = [];
    window.imData.stickerMetadataLoaded = true;
  }
  return window.imData.stickerMetadata;
};
document.addEventListener("visibilitychange", () => {
  document.visibilityState === "hidden" && window.imApp?.saveState?.dirty && window.imApp.flushGlobalSave({
    silent: true
  });
});
window.addEventListener("pagehide", () => {
  window.imApp?.saveState?.dirty && window.imApp.flushGlobalSave({
    silent: true
  });
});
(window.u2OnStorageReady || (chatCoreScopeValue1585 => document.addEventListener("DOMContentLoaded", chatCoreScopeValue1585)))(() => {
  const {
    UI: chatCoreScopeValue1586,
    userState: chatCoreScopeValue1587,
    apiConfig: chatCoreScopeValue1588,
    openView: chatCoreScopeValue1589,
    closeView: chatCoreScopeValue1590,
    showToast: chatCoreScopeValue1591,
    syncUIs: chatCoreScopeValue1592
  } = window;
  async function chatCoreScopeValue1593(chatCoreScopeValue1786) {
    return new Promise((chatCoreScopeValue1787, chatCoreScopeValue1788) => {
      if (!chatCoreScopeValue1786) {
        chatCoreScopeValue1788(new Error("No file provided"));
        return;
      }
      const chatCoreScopeValue1789 = new FileReader();
      chatCoreScopeValue1789.onload = chatCoreScopeValue1790 => chatCoreScopeValue1787(chatCoreScopeValue1790.target?.result || null);
      chatCoreScopeValue1789.onerror = () => chatCoreScopeValue1788(chatCoreScopeValue1789.error || new Error("Failed to read file"));
      chatCoreScopeValue1789.readAsDataURL(chatCoreScopeValue1786);
    });
  }
  async function chatCoreScopeValue1594(chatCoreScopeValue1791) {
    return new Promise((chatCoreScopeValue1792, chatCoreScopeValue1793) => {
      const chatCoreScopeValue1794 = new Image();
      chatCoreScopeValue1794.onload = () => chatCoreScopeValue1792(chatCoreScopeValue1794);
      chatCoreScopeValue1794.onerror = () => chatCoreScopeValue1793(new Error("Failed to load image"));
      chatCoreScopeValue1794.src = chatCoreScopeValue1791;
    });
  }
  function chatCoreScopeValue1595(chatCoreScopeValue1795, chatCoreScopeValue1796 = "image/jpeg", chatCoreScopeValue1797 = 0.82) {
    try {
      return chatCoreScopeValue1795.toDataURL(chatCoreScopeValue1796, chatCoreScopeValue1797);
    } catch (chatCoreScopeValue1798) {
      return chatCoreScopeValue1795.toDataURL();
    }
  }
  async function chatCoreScopeValue1596(chatCoreScopeValue1799, chatCoreScopeValue1800 = {}) {
    if (!chatCoreScopeValue1799) return null;
    const {
        maxWidth: chatCoreScopeValue1801 = 1080,
        maxHeight: chatCoreScopeValue1802 = 1080,
        mimeType: chatCoreScopeValue1803 = "image/jpeg",
        quality: chatCoreScopeValue1804 = 0.82
      } = chatCoreScopeValue1800,
      chatCoreScopeValue1805 = await chatCoreScopeValue1593(chatCoreScopeValue1799);
    if (!chatCoreScopeValue1805) return null;
    const chatCoreScopeValue1806 = await chatCoreScopeValue1594(chatCoreScopeValue1805),
      chatCoreScopeValue1807 = chatCoreScopeValue1806.naturalWidth || chatCoreScopeValue1806.width || 0,
      chatCoreScopeValue1808 = chatCoreScopeValue1806.naturalHeight || chatCoreScopeValue1806.height || 0;
    if (!chatCoreScopeValue1807 || !chatCoreScopeValue1808) return chatCoreScopeValue1805;
    const chatCoreScopeValue1809 = Math.min(1, chatCoreScopeValue1801 / chatCoreScopeValue1807, chatCoreScopeValue1802 / chatCoreScopeValue1808),
      chatCoreScopeValue1810 = Math.max(1, Math.round(chatCoreScopeValue1807 * chatCoreScopeValue1809)),
      chatCoreScopeValue1811 = Math.max(1, Math.round(chatCoreScopeValue1808 * chatCoreScopeValue1809)),
      chatCoreScopeValue1812 = document.createElement("canvas");
    chatCoreScopeValue1812.width = chatCoreScopeValue1810;
    chatCoreScopeValue1812.height = chatCoreScopeValue1811;
    const chatCoreScopeValue1813 = chatCoreScopeValue1812.getContext("2d");
    if (!chatCoreScopeValue1813) return chatCoreScopeValue1805;
    return chatCoreScopeValue1813.drawImage(chatCoreScopeValue1806, 0, 0, chatCoreScopeValue1810, chatCoreScopeValue1811), chatCoreScopeValue1595(chatCoreScopeValue1812, chatCoreScopeValue1803, chatCoreScopeValue1804);
  }
  window.imApp = window.imApp || {}, window.imApp.readFileAsDataUrl = chatCoreScopeValue1593, window.imApp.compressImageFile = chatCoreScopeValue1596;
  const chatCoreScopeValue1597 = document.getElementById("custom-modal-overlay"),
    chatCoreScopeValue1598 = document.getElementById("modal-title"),
    chatCoreScopeValue1599 = document.getElementById("modal-confirm-content"),
    chatCoreScopeValue1600 = document.getElementById("modal-prompt-content"),
    chatCoreScopeValue1601 = document.getElementById("modal-message"),
    chatCoreScopeValue1602 = document.getElementById("modal-input"),
    chatCoreScopeValue1603 = document.getElementById("modal-input-group"),
    chatCoreScopeValue1604 = document.getElementById("modal-textarea-group"),
    chatCoreScopeValue1605 = document.getElementById("modal-textarea"),
    chatCoreScopeValue1606 = document.getElementById("modal-textarea-label"),
    chatCoreScopeValue1607 = document.getElementById("modal-secondary-textarea-group"),
    chatCoreScopeValue1608 = document.getElementById("modal-secondary-textarea-label"),
    chatCoreScopeValue1609 = document.getElementById("modal-secondary-textarea"),
    chatCoreScopeValue1610 = document.getElementById("modal-toggle-group"),
    chatCoreScopeValue1611 = document.getElementById("modal-toggle-label"),
    chatCoreScopeValue1612 = document.getElementById("modal-toggle-input"),
    chatCoreScopeValue1613 = document.getElementById("modal-reference-face-group"),
    chatCoreScopeValue1614 = document.getElementById("modal-reference-face-preview"),
    chatCoreScopeValue1615 = document.getElementById("modal-reference-face-title"),
    chatCoreScopeValue1616 = document.getElementById("modal-reference-face-status"),
    chatCoreScopeValue1617 = document.getElementById("modal-reference-face-upload-btn"),
    chatCoreScopeValue1618 = document.getElementById("modal-reference-face-delete-btn"),
    chatCoreScopeValue1619 = document.getElementById("modal-reference-face-input"),
    chatCoreScopeValue1620 = document.getElementById("modal-user-reference-face-preview"),
    chatCoreScopeValue1621 = document.getElementById("modal-user-reference-face-title"),
    chatCoreScopeValue1622 = document.getElementById("modal-user-reference-face-status"),
    chatCoreScopeValue1623 = document.getElementById("modal-user-reference-face-upload-btn"),
    chatCoreScopeValue1624 = document.getElementById("modal-user-reference-face-delete-btn"),
    chatCoreScopeValue1625 = document.getElementById("modal-user-reference-face-input"),
    chatCoreScopeValue1626 = document.getElementById("modal-reference-face-warning"),
    chatCoreScopeValue1627 = document.getElementById("modal-image-composer-group"),
    chatCoreScopeValue1628 = document.getElementById("modal-image-composer-preview"),
    chatCoreScopeValue1629 = document.getElementById("modal-image-composer-status"),
    chatCoreScopeValue1630 = document.getElementById("modal-image-composer-upload-btn"),
    chatCoreScopeValue1631 = document.getElementById("modal-image-composer-remove-btn"),
    chatCoreScopeValue1632 = document.getElementById("modal-image-composer-input"),
    chatCoreScopeValue1633 = document.getElementById("modal-image-composer-list"),
    chatCoreScopeValue1634 = document.getElementById("modal-generation-prompt-group"),
    chatCoreScopeValue1635 = document.getElementById("modal-generation-preset-group"),
    chatCoreScopeValue1636 = document.getElementById("modal-generation-preset-select"),
    chatCoreScopeValue1637 = document.getElementById("modal-generation-save-preset-btn"),
    chatCoreNewScope1649 = document.getElementById("modal-generation-delete-preset-btn"),
    chatCoreScopeValue1638 = document.getElementById("modal-auto-image-generation-toggle"),
    chatCoreScopeValue1639 = document.getElementById("modal-generation-char-appearance"),
    chatCoreScopeValue1640 = document.getElementById("modal-generation-user-appearance"),
    chatCoreScopeValue1641 = document.getElementById("modal-generation-artist-prompt"),
    chatCoreScopeValue1642 = document.getElementById("modal-generation-negative-prompt"),
    chatCoreScopeValue1653 = document.getElementById("modal-generation-subjects"),
    chatCoreScopeValue1654 = document.getElementById("modal-prompt-error"),
    chatCoreScopeValue1643 = document.getElementById("modal-confirm-btn"),
    chatCoreScopeValue1644 = document.getElementById("modal-cancel-btn"),
    chatCoreScopeValue1645 = document.getElementById("modal-prompt-confirm-btn");
  let chatCoreScopeValue1646 = null,
    chatCoreScopeValue1647 = null,
    chatCoreScopeValue1648 = null,
    chatCoreScopeValue1649 = null,
    chatCoreScopeValue1650 = null,
    chatCoreScopeValue1651 = 0,
    chatCoreScopeValue1652 = false;
  function chatCoreNewScope1667(chatCoreNewScope1826 = chatCoreScopeValue1650) {
    if (!chatCoreScopeValue1636 || !chatCoreNewScope1826) return;
    chatCoreScopeValue1636.replaceChildren();
    const chatCoreNewScope1827 = document.createElement("option");
    chatCoreNewScope1827.value = "", chatCoreNewScope1827.textContent = chatCoreNewScope1826.presetsLoading ? "正在读取全局预设…" : "当前编辑内容", chatCoreScopeValue1636.appendChild(chatCoreNewScope1827), (chatCoreNewScope1826.presets || []).forEach(chatCoreNewScope1829 => {
      const chatCoreNewScope1830 = document.createElement("option");
      chatCoreNewScope1830.value = chatCoreNewScope1829.id, chatCoreNewScope1830.textContent = chatCoreNewScope1829.name, chatCoreScopeValue1636.appendChild(chatCoreNewScope1830);
    }), chatCoreScopeValue1636.value = chatCoreNewScope1826.activePresetId || "";
    const chatCoreNewScope1828 = chatCoreScopeValue1652 || chatCoreNewScope1826.presetsLoading || chatCoreNewScope1826.presetSaving || chatCoreNewScope1826.presetDeleting;
    chatCoreScopeValue1636.disabled = chatCoreNewScope1828 || !chatCoreNewScope1826.presets?.["length"];
    if (chatCoreScopeValue1637) chatCoreScopeValue1637.disabled = chatCoreNewScope1828;
    if (chatCoreNewScope1649) chatCoreNewScope1649.disabled = chatCoreNewScope1828 || !(chatCoreNewScope1826.presets || []).some(chatCoreNewScope1831 => chatCoreNewScope1831.id === chatCoreNewScope1826.activePresetId);
  }
  function chatCoreScopeValue1655(chatCoreNewScope1832) {
    chatCoreScopeValue1652 = chatCoreNewScope1832;
    chatCoreScopeValue1645 && (chatCoreScopeValue1645.setAttribute("aria-disabled", String(chatCoreNewScope1832)), chatCoreScopeValue1645.style.pointerEvents = chatCoreNewScope1832 ? "none" : "");
    chatCoreScopeValue1644 && (chatCoreScopeValue1644.setAttribute("aria-disabled", String(chatCoreNewScope1832)), chatCoreScopeValue1644.style.pointerEvents = chatCoreNewScope1832 ? "none" : "");
    if (chatCoreScopeValue1630) chatCoreScopeValue1630.disabled = chatCoreNewScope1832;
    if (chatCoreScopeValue1631) chatCoreScopeValue1631.disabled = chatCoreNewScope1832;
    chatCoreScopeValue1633?.["querySelectorAll"]("button")["forEach"](chatCoreNewScope1833 => {
      chatCoreNewScope1833.disabled = chatCoreNewScope1832;
    });
    chatCoreScopeValue1650?.["showSubjects"] && (chatCoreScopeValue1600?.["querySelectorAll"]("input, textarea, select, button")["forEach"](chatCoreNewScope1834 => {
      chatCoreNewScope1834.disabled = chatCoreNewScope1832;
    }), chatCoreNewScope1669());
    if (chatCoreScopeValue1650) chatCoreNewScope1667();
  }
  function chatCoreNewScope1669() {
    chatCoreScopeValue1653?.["querySelectorAll"]("[data-image-reference]")["forEach"](chatCoreNewScope1835 => {
      const chatCoreNewScope1836 = chatCoreScopeValue1653.querySelector("[data-image-subject=\"" + chatCoreNewScope1835.dataset.imageReference + "\"]");
      if (!chatCoreNewScope1836?.["checked"]) chatCoreNewScope1835.checked = false;
      chatCoreNewScope1835.disabled = chatCoreScopeValue1652 || !chatCoreNewScope1836?.["checked"];
    });
  }
  chatCoreScopeValue1653?.["addEventListener"]("change", chatCoreNewScope1669);
  function chatCoreScopeValue1656(chatCoreScopeValue1817) {
    chatCoreScopeValue1649 = chatCoreScopeValue1817 || null;
    const chatCoreScopeValue1818 = Array.isArray(chatCoreScopeValue1817?.images) ? chatCoreScopeValue1817.images : [],
      chatCoreScopeValue1819 = String(chatCoreScopeValue1818[0]?.imageUrl || chatCoreScopeValue1817?.imageUrl || ""),
      chatCoreScopeValue1820 = chatCoreScopeValue1628?.querySelector("img"),
      chatCoreScopeValue1821 = chatCoreScopeValue1628?.querySelector("i");
    if (chatCoreScopeValue1627) chatCoreScopeValue1627.style.display = chatCoreScopeValue1817 ? "block" : "none";
    if (chatCoreScopeValue1629) chatCoreScopeValue1629.textContent = chatCoreScopeValue1817?.status || (chatCoreScopeValue1819 ? "已选择 " + (chatCoreScopeValue1818.length || 1) + " 张图片（最多 9 张）" : "未选择图片时发送虚拟图片");
    if (chatCoreScopeValue1630) chatCoreScopeValue1630.textContent = chatCoreScopeValue1819 ? "添加" : "上传";
    if (chatCoreScopeValue1631) chatCoreScopeValue1631.style.display = "none";
    chatCoreScopeValue1820 && chatCoreScopeValue1821 && (chatCoreScopeValue1819 ? (chatCoreScopeValue1820.src = chatCoreScopeValue1819, chatCoreScopeValue1820.style.display = "block", chatCoreScopeValue1821.style.display = "none") : (chatCoreScopeValue1820.removeAttribute("src"), chatCoreScopeValue1820.style.display = "none", chatCoreScopeValue1821.style.display = ""));
    chatCoreScopeValue1633 && (chatCoreScopeValue1633.replaceChildren(), chatCoreScopeValue1818.forEach((chatCoreScopeValue1822, chatCoreScopeValue1823) => {
      const chatCoreScopeValue1824 = document.createElement("div");
      chatCoreScopeValue1824.className = "modal-image-composer-item";
      const chatCoreScopeValue1825 = document.createElement("img");
      chatCoreScopeValue1825.src = chatCoreScopeValue1822.imageUrl || "";
      chatCoreScopeValue1825.alt = chatCoreScopeValue1822.fileName || "第 " + (chatCoreScopeValue1823 + 1) + " 张图片";
      chatCoreScopeValue1825.loading = "lazy";
      chatCoreScopeValue1825.decoding = "async";
      const chatCoreScopeValue1826 = document.createElement("button");
      chatCoreScopeValue1826.type = "button";
      chatCoreScopeValue1826.textContent = "×";
      chatCoreScopeValue1826.setAttribute("aria-label", "移除第 " + (chatCoreScopeValue1823 + 1) + " 张图片");
      chatCoreScopeValue1826.dataset.imageIndex = String(chatCoreScopeValue1823);
      chatCoreScopeValue1826.disabled = chatCoreScopeValue1652;
      chatCoreScopeValue1824.append(chatCoreScopeValue1825, chatCoreScopeValue1826);
      chatCoreScopeValue1633.appendChild(chatCoreScopeValue1824);
    }));
  }
  function chatCoreScopeValue1657(chatCoreScopeValue1827, chatCoreScopeValue1828) {
    if (!chatCoreScopeValue1648) chatCoreScopeValue1648 = {};
    chatCoreScopeValue1648[chatCoreScopeValue1827] = chatCoreScopeValue1828 || null;
    const chatCoreScopeValue1829 = chatCoreScopeValue1827 === "user",
      chatCoreScopeValue1830 = chatCoreScopeValue1829 ? chatCoreScopeValue1620 : chatCoreScopeValue1614,
      chatCoreScopeValue1831 = chatCoreScopeValue1829 ? chatCoreScopeValue1621 : chatCoreScopeValue1615,
      chatCoreScopeValue1832 = chatCoreScopeValue1829 ? chatCoreScopeValue1622 : chatCoreScopeValue1616,
      chatCoreScopeValue1833 = chatCoreScopeValue1829 ? chatCoreScopeValue1623 : chatCoreScopeValue1617,
      chatCoreScopeValue1834 = chatCoreScopeValue1829 ? chatCoreScopeValue1624 : chatCoreScopeValue1618,
      chatCoreScopeValue1835 = String(chatCoreScopeValue1828?.imageUrl || ""),
      chatCoreScopeValue1836 = chatCoreScopeValue1830?.querySelector("img"),
      chatCoreScopeValue1837 = chatCoreScopeValue1830?.querySelector("i");
    if (chatCoreScopeValue1831) chatCoreScopeValue1831.textContent = chatCoreScopeValue1828?.title || (chatCoreScopeValue1829 ? "User" : "Char");
    if (chatCoreScopeValue1832) chatCoreScopeValue1832.textContent = chatCoreScopeValue1835 ? chatCoreScopeValue1828?.fileName || "已上传" : "尚未上传";
    if (chatCoreScopeValue1833) chatCoreScopeValue1833.textContent = chatCoreScopeValue1835 ? "更换" : "上传";
    if (chatCoreScopeValue1834) chatCoreScopeValue1834.style.display = chatCoreScopeValue1835 ? "" : "none";
    chatCoreScopeValue1836 && chatCoreScopeValue1837 && (chatCoreScopeValue1835 ? (chatCoreScopeValue1836.src = chatCoreScopeValue1835, chatCoreScopeValue1836.style.display = "block", chatCoreScopeValue1837.style.display = "none") : (chatCoreScopeValue1836.removeAttribute("src"), chatCoreScopeValue1836.style.display = "none", chatCoreScopeValue1837.style.display = ""));
    const chatCoreScopeValue1838 = !!chatCoreScopeValue1648.char?.imageUrl && !!chatCoreScopeValue1648.user?.imageUrl,
      chatCoreScopeValue1839 = window.getActiveImageGenerationConfig?.()?.provider || window.getImageGenerationConfig?.()?.activeProvider;
    if (chatCoreScopeValue1626) chatCoreScopeValue1626.style.display = chatCoreScopeValue1838 && chatCoreScopeValue1839 === "novelai" ? "block" : "none";
  }
  async function chatCoreScopeValue1658(chatCoreScopeValue1840, chatCoreScopeValue1841 = {}) {
    const chatCoreScopeValue1842 = String(chatCoreScopeValue1840 || "").trim();
    if (!/^data:image\//i.test(chatCoreScopeValue1842)) return null;
    const {
      size: chatCoreScopeValue1843 = 256,
      mimeType: chatCoreScopeValue1844 = "image/jpeg",
      quality: chatCoreScopeValue1845 = 0.84
    } = chatCoreScopeValue1841;
    const chatCoreScopeValue1846 = Math.max(1, Math.min(512, Math.round(Number(chatCoreScopeValue1843) || 256)));
    const chatCoreScopeValue1847 = await chatCoreScopeValue1594(chatCoreScopeValue1842);
    const chatCoreScopeValue1848 = chatCoreScopeValue1847.naturalWidth || chatCoreScopeValue1847.width || 0;
    const chatCoreScopeValue1849 = chatCoreScopeValue1847.naturalHeight || chatCoreScopeValue1847.height || 0;
    const chatCoreScopeValue1850 = Math.min(chatCoreScopeValue1848, chatCoreScopeValue1849);
    if (!chatCoreScopeValue1850) return null;
    const chatCoreScopeValue1851 = document.createElement("canvas");
    chatCoreScopeValue1851.width = chatCoreScopeValue1846;
    chatCoreScopeValue1851.height = chatCoreScopeValue1846;
    const chatCoreScopeValue1852 = chatCoreScopeValue1851.getContext("2d");
    if (!chatCoreScopeValue1852) return null;
    const chatCoreScopeValue1853 = Math.max(0, Math.round((chatCoreScopeValue1848 - chatCoreScopeValue1850) / 2));
    const chatCoreScopeValue1854 = Math.max(0, Math.round((chatCoreScopeValue1849 - chatCoreScopeValue1850) / 2));
    chatCoreScopeValue1852.drawImage(chatCoreScopeValue1847, chatCoreScopeValue1853, chatCoreScopeValue1854, chatCoreScopeValue1850, chatCoreScopeValue1850, 0, 0, chatCoreScopeValue1846, chatCoreScopeValue1846);
    return chatCoreScopeValue1595(chatCoreScopeValue1851, chatCoreScopeValue1844, chatCoreScopeValue1845);
  }
  window.imApp.createSquareAvatarFromDataUrl = chatCoreScopeValue1658;
  function chatCoreScopeValue1659(chatCoreScopeValue1855) {
    if (!chatCoreScopeValue1597) return;
    chatCoreScopeValue1597.dataset.keepBackground = String(chatCoreScopeValue1855.isolateChatBackground === true);
    if (!chatCoreScopeValue1855.isolateChatBackground) {
      chatCoreScopeValue1597.classList.remove("im-chat-back-count-modal", "im-chats-status-modal");
      if (chatCoreScopeValue1602) chatCoreScopeValue1602.inputMode = "text";
    }
    chatCoreScopeValue1651++;
    chatCoreScopeValue1655(false);
    chatCoreScopeValue1598.textContent = chatCoreScopeValue1855.title || "提示";
    chatCoreScopeValue1646 = chatCoreScopeValue1855.onConfirm;
    chatCoreScopeValue1647 = chatCoreScopeValue1855.onCancel;
    chatCoreScopeValue1648 = null;
    chatCoreScopeValue1649 = null;
    chatCoreScopeValue1597.dataset.ownerId = chatCoreScopeValue1855.ownerId || "";
    chatCoreScopeValue1650 = chatCoreScopeValue1855.generationPrompt ? {
      ...chatCoreScopeValue1855.generationPrompt
    } : null;
    chatCoreScopeValue1597.classList.toggle("is-image-generation", !!chatCoreScopeValue1855.generationPrompt);
    const chatCoreScopeValue1856 = !!chatCoreScopeValue1855.generationPrompt && !/iPhone|iPod/.test(navigator.userAgent) && (/iPad/.test(navigator.userAgent) || /Mac/.test(navigator.userAgent + navigator.platform) && navigator.maxTouchPoints > 1);
    chatCoreScopeValue1597.classList.toggle("is-ipad-image-generation", chatCoreScopeValue1856);
    if (chatCoreScopeValue1654) {
      chatCoreScopeValue1654.textContent = "";
      chatCoreScopeValue1654.hidden = true;
    }
    if (chatCoreScopeValue1653) {
      chatCoreScopeValue1653.hidden = chatCoreScopeValue1855.generationPrompt?.showSubjects !== true;
      chatCoreScopeValue1653.querySelectorAll("input").forEach(chatCoreScopeValue1858 => {
        chatCoreScopeValue1858.checked = chatCoreScopeValue1855.generationPrompt?.[chatCoreScopeValue1858.name] === true;
      });
      chatCoreNewScope1669();
    }
    if (chatCoreScopeValue1650 && window.u2ImagePromptPresets) {
      const chatCoreNewScope1863 = chatCoreScopeValue1650,
        chatCoreNewScope1864 = chatCoreScopeValue1651;
      chatCoreNewScope1863.presetsLoading = true, chatCoreNewScope1863.presets = [], window.u2ImagePromptPresets.load(chatCoreScopeValue1855.generationPrompt.presets || []).then(chatCoreNewScope1865 => {
        if (chatCoreNewScope1864 !== chatCoreScopeValue1651) return;
        chatCoreNewScope1863.presets = chatCoreNewScope1865;
      })["catch"](chatCoreNewScope1866 => {
        if (chatCoreNewScope1864 === chatCoreScopeValue1651) window.showToast?.(chatCoreNewScope1866.message || "全局预设读取失败");
      })["finally"](() => {
        if (chatCoreNewScope1864 !== chatCoreScopeValue1651) return;
        chatCoreNewScope1863.presetsLoading = false, chatCoreNewScope1667(chatCoreNewScope1863);
      });
    }
    if (chatCoreScopeValue1855.type === "prompt") {
      const chatCoreScopeValue1859 = chatCoreScopeValue1855.multiline === true;
      const chatCoreScopeValue1860 = chatCoreScopeValue1855.secondaryTextarea && typeof chatCoreScopeValue1855.secondaryTextarea === "object" ? chatCoreScopeValue1855.secondaryTextarea : null;
      chatCoreScopeValue1643.style.display = "none";
      chatCoreScopeValue1645.style.display = "block";
      chatCoreScopeValue1599.style.display = "none";
      chatCoreScopeValue1600.style.display = "block";
      chatCoreScopeValue1601.textContent = chatCoreScopeValue1855.message || "";
      if (chatCoreScopeValue1603) chatCoreScopeValue1603.style.display = chatCoreScopeValue1859 ? "none" : "";
      if (chatCoreScopeValue1604) chatCoreScopeValue1604.style.display = chatCoreScopeValue1859 ? "block" : "none";
      chatCoreScopeValue1602 && (chatCoreScopeValue1602.value = chatCoreScopeValue1859 ? "" : chatCoreScopeValue1855.defaultValue || "", chatCoreScopeValue1602.placeholder = chatCoreScopeValue1855.placeholder || "");
      chatCoreScopeValue1605 && (chatCoreScopeValue1605.value = chatCoreScopeValue1859 ? chatCoreScopeValue1855.defaultValue || "" : "", chatCoreScopeValue1605.placeholder = chatCoreScopeValue1855.placeholder || "");
      chatCoreScopeValue1606 && (chatCoreScopeValue1606.textContent = chatCoreScopeValue1855.textareaLabel || "", chatCoreScopeValue1606.style.display = chatCoreScopeValue1859 && chatCoreScopeValue1855.textareaLabel ? "block" : "none");
      chatCoreScopeValue1607 && (chatCoreScopeValue1607.style.display = chatCoreScopeValue1860 ? "block" : "none");
      chatCoreScopeValue1608 && (chatCoreScopeValue1608.textContent = chatCoreScopeValue1860?.label || "翻译");
      chatCoreScopeValue1609 && (chatCoreScopeValue1609.value = chatCoreScopeValue1860?.defaultValue || "", chatCoreScopeValue1609.placeholder = chatCoreScopeValue1860?.placeholder || "");
      if (chatCoreScopeValue1855.imageComposer) chatCoreScopeValue1656(chatCoreScopeValue1855.imageComposer);else {
        if (chatCoreScopeValue1627) chatCoreScopeValue1627.style.display = "none";
      }
      if (chatCoreScopeValue1634) chatCoreScopeValue1634.style.display = chatCoreScopeValue1855.generationPrompt ? "block" : "none";
      if (chatCoreScopeValue1635) chatCoreScopeValue1635.style.display = chatCoreScopeValue1855.generationPrompt && chatCoreScopeValue1855.generationPrompt.showPresets !== false ? "flex" : "none";
      chatCoreNewScope1667();
      chatCoreScopeValue1638 && (chatCoreScopeValue1638.checked = chatCoreScopeValue1855.generationPrompt?.["autoGenerate"] === true);
      const chatCoreScopeValue1861 = document.getElementById("modal-auto-image-generation-group");
      if (chatCoreScopeValue1861) chatCoreScopeValue1861.style.display = chatCoreScopeValue1855.generationPrompt?.showAutoGenerate === false ? "none" : "flex";
      if (chatCoreScopeValue1639) chatCoreScopeValue1639.value = chatCoreScopeValue1855.generationPrompt?.charAppearance || "";
      if (chatCoreScopeValue1640) chatCoreScopeValue1640.value = chatCoreScopeValue1855.generationPrompt?.userAppearance || "";
      if (chatCoreScopeValue1641) chatCoreScopeValue1641.value = chatCoreScopeValue1855.generationPrompt?.artistPrompt || "";
      if (chatCoreScopeValue1642) chatCoreScopeValue1642.value = chatCoreScopeValue1855.generationPrompt?.negativePrompt || "";
      const chatCoreScopeValue1862 = chatCoreScopeValue1855.referenceFaces || (chatCoreScopeValue1855.referenceFace ? {
        char: chatCoreScopeValue1855.referenceFace
      } : null);
      if (chatCoreScopeValue1862) {
        if (chatCoreScopeValue1613) chatCoreScopeValue1613.style.display = "block";
        if (chatCoreScopeValue1610) chatCoreScopeValue1610.style.display = "none";
        chatCoreScopeValue1657("char", chatCoreScopeValue1862.char);
        chatCoreScopeValue1657("user", chatCoreScopeValue1862.user);
      } else {
        if (chatCoreScopeValue1613) chatCoreScopeValue1613.style.display = "none";
        if (chatCoreScopeValue1610) chatCoreScopeValue1610.style.display = chatCoreScopeValue1855.toggle ? "flex" : "none";
        if (chatCoreScopeValue1611) chatCoreScopeValue1611.textContent = chatCoreScopeValue1855.toggle?.label || "";
        chatCoreScopeValue1612 && (chatCoreScopeValue1612.checked = !!chatCoreScopeValue1855.toggle?.checked, chatCoreScopeValue1612.disabled = !!chatCoreScopeValue1855.toggle?.disabled);
      }
      chatCoreScopeValue1645.textContent = chatCoreScopeValue1855.confirmText || "确认";
      chatCoreScopeValue1645.style.background = chatCoreScopeValue1855.confirmTone === "dark" ? "#111" : "#007aff";
      chatCoreScopeValue1645.style.color = "#fff";
    } else {
      chatCoreScopeValue1643.style.display = "block";
      chatCoreScopeValue1645.style.display = "none";
      chatCoreScopeValue1599.style.display = "block";
      chatCoreScopeValue1600.style.display = "none";
      if (chatCoreScopeValue1610) chatCoreScopeValue1610.style.display = "none";
      if (chatCoreScopeValue1607) chatCoreScopeValue1607.style.display = "none";
      if (chatCoreScopeValue1613) chatCoreScopeValue1613.style.display = "none";
      if (chatCoreScopeValue1627) chatCoreScopeValue1627.style.display = "none";
      if (chatCoreScopeValue1634) chatCoreScopeValue1634.style.display = "none";
      if (chatCoreScopeValue1635) chatCoreScopeValue1635.style.display = "none";
      chatCoreScopeValue1636 && (chatCoreScopeValue1636.replaceChildren(), chatCoreScopeValue1636.disabled = true);
      if (chatCoreScopeValue1638) chatCoreScopeValue1638.checked = false;
      chatCoreScopeValue1601.textContent = chatCoreScopeValue1855.message || "";
      chatCoreScopeValue1643.textContent = chatCoreScopeValue1855.confirmText || "确认";
      const chatCoreScopeValue1866 = chatCoreScopeValue1855.isDestructive && String(chatCoreScopeValue1855.confirmText || "").trim() === "删除";
      const chatCoreScopeValue1867 = chatCoreScopeValue1855.confirmTone === "dark";
      chatCoreScopeValue1643.style.color = chatCoreScopeValue1866 || chatCoreScopeValue1867 ? "#fff" : chatCoreScopeValue1855.isDestructive ? "#ff3b30" : "#2c2c2e";
      chatCoreScopeValue1643.style.background = chatCoreScopeValue1866 || chatCoreScopeValue1867 ? "#111" : "";
      chatCoreScopeValue1643.style.borderRadius = chatCoreScopeValue1866 ? "12px" : "";
      chatCoreScopeValue1643.style.fontWeight = chatCoreScopeValue1866 ? "700" : "";
    }
    chatCoreScopeValue1597.style.display = "flex";
    void chatCoreScopeValue1597.offsetWidth;
    chatCoreScopeValue1597.classList.add("active");
    const chatCoreScopeValue1857 = chatCoreScopeValue1597.querySelector(".bottom-sheet");
    if (chatCoreScopeValue1857) chatCoreScopeValue1857.style.transform = "translateY(0)";
    if (chatCoreScopeValue1855.type === "prompt" && chatCoreScopeValue1855.autoFocus !== false) {
      const chatCoreScopeValue1868 = chatCoreScopeValue1651;
      setTimeout(() => {
        if (chatCoreScopeValue1868 !== chatCoreScopeValue1651 || !chatCoreScopeValue1597.classList.contains("active")) return;
        const chatCoreScopeValue1869 = chatCoreScopeValue1855.multiline === true ? chatCoreScopeValue1605 : chatCoreScopeValue1602;
        chatCoreScopeValue1869?.focus({
          preventScroll: true
        });
      }, 300);
    }
  }
  function chatCoreScopeValue1660() {
    const chatCoreScopeValue1870 = chatCoreScopeValue1651,
      chatCoreScopeValue1871 = chatCoreScopeValue1604?.style.display === "block" ? chatCoreScopeValue1605?.value || "" : chatCoreScopeValue1602?.value || "";
    return {
      promptValue: chatCoreScopeValue1871,
      secondaryValue: chatCoreScopeValue1607?.style.display === "block" ? chatCoreScopeValue1609?.value || "" : null,
      toggleChecked: !!chatCoreScopeValue1612?.checked,
      referenceImage: chatCoreScopeValue1648?.char?.imageUrl || "",
      uploadedImage: chatCoreScopeValue1649?.imageUrl || "",
      uploadedFileName: chatCoreScopeValue1649?.fileName || "",
      uploadedImages: Array.isArray(chatCoreScopeValue1649?.images) ? chatCoreScopeValue1649.images.slice() : [],
      setImageStatus: chatCoreScopeValue1872 => {
        if (chatCoreScopeValue1651 === chatCoreScopeValue1870 && chatCoreScopeValue1649) {
          chatCoreScopeValue1649.status = String(chatCoreScopeValue1872 || "");
          if (chatCoreScopeValue1629) chatCoreScopeValue1629.textContent = chatCoreScopeValue1649.status || (chatCoreScopeValue1649.images?.length ? "已选择 " + chatCoreScopeValue1649.images.length + " 张图片（最多 9 张）" : "未选择图片时发送虚拟图片");
        }
      },
      isCurrent: () => chatCoreScopeValue1651 === chatCoreScopeValue1870 && chatCoreScopeValue1597.classList.contains("active"),
      setPromptError: chatCoreScopeValue1873 => {
        if (chatCoreScopeValue1651 !== chatCoreScopeValue1870 || !chatCoreScopeValue1654) return;
        chatCoreScopeValue1654.textContent = String(chatCoreScopeValue1873 || ""), chatCoreScopeValue1654.hidden = !chatCoreScopeValue1873;
      },
      ...(chatCoreScopeValue1650?.showSubjects ? Object.fromEntries(Array.from(chatCoreScopeValue1653?.querySelectorAll("input") || [], chatCoreScopeValue1874 => [chatCoreScopeValue1874.name, chatCoreScopeValue1874.checked])) : {}),
      charAppearance: chatCoreScopeValue1639?.value || "",
      userAppearance: chatCoreScopeValue1640?.value || "",
      artistPrompt: chatCoreScopeValue1641?.value || "",
      negativePrompt: chatCoreScopeValue1642?.value || "",
      activePresetId: chatCoreScopeValue1636?.value || "",
      autoGenerate: chatCoreScopeValue1650?.showAutoGenerate === false ? chatCoreScopeValue1650.autoGenerate === true : chatCoreScopeValue1638?.checked === true,
      presets: Array.isArray(chatCoreScopeValue1650?.presets) ? chatCoreScopeValue1650.presets : []
    };
  }
  function chatCoreScopeValue1661(chatCoreScopeValue1875 = true) {
    if (!chatCoreScopeValue1597) return;
    const chatCoreScopeValue1876 = chatCoreScopeValue1647;
    const chatCoreScopeValue1877 = chatCoreScopeValue1660();
    chatCoreScopeValue1651++;
    chatCoreScopeValue1655(false);
    if (chatCoreScopeValue1597.contains(document.activeElement)) document.activeElement.blur();
    chatCoreScopeValue1597.classList.remove("active");
    chatCoreScopeValue1597.classList.remove("im-chat-back-count-modal", "im-chats-status-modal");
    if (chatCoreScopeValue1602) chatCoreScopeValue1602.inputMode = "text";
    const chatCoreScopeValue1878 = chatCoreScopeValue1651;
    setTimeout(() => {
      if (chatCoreScopeValue1878 === chatCoreScopeValue1651 && !chatCoreScopeValue1597.classList.contains("active")) {
        chatCoreScopeValue1597.style.display = "none";
      }
    }, 300);
    chatCoreScopeValue1646 = null;
    chatCoreScopeValue1647 = null;
    chatCoreScopeValue1648 = null;
    chatCoreScopeValue1597.classList.remove("is-image-generation", "is-ipad-image-generation");
    chatCoreScopeValue1649 = null;
    chatCoreScopeValue1650 = null;
    delete chatCoreScopeValue1597.dataset.ownerId;
    if (chatCoreScopeValue1875 && typeof chatCoreScopeValue1876 === "function") chatCoreScopeValue1876(chatCoreScopeValue1877);
  }
  window.imApp.showCustomModal = chatCoreScopeValue1659;
  window.imApp.closeCustomModal = chatCoreScopeValue1661;
  window.showCustomModal = chatCoreScopeValue1659;
  window.closeCustomModal = chatCoreScopeValue1661;
  if (chatCoreScopeValue1644) chatCoreScopeValue1644.addEventListener("click", () => {
    if (!chatCoreScopeValue1652) chatCoreScopeValue1661(true);
  });
  chatCoreScopeValue1643 && chatCoreScopeValue1643.addEventListener("click", () => {
    if (chatCoreScopeValue1646) chatCoreScopeValue1646(true);
    chatCoreScopeValue1661(false);
  });
  chatCoreScopeValue1645 && chatCoreScopeValue1645.addEventListener("click", async () => {
    if (chatCoreScopeValue1652) return;
    const chatCoreScopeValue1879 = chatCoreScopeValue1660(),
      chatCoreScopeValue1880 = chatCoreScopeValue1651,
      chatCoreScopeValue1881 = chatCoreScopeValue1645.textContent;
    try {
      chatCoreScopeValue1655(true);
      chatCoreScopeValue1645.textContent = "处理中…";
      const chatCoreScopeValue1882 = chatCoreScopeValue1646 ? await chatCoreScopeValue1646(chatCoreScopeValue1879.promptValue, chatCoreScopeValue1879) : undefined;
      if (chatCoreScopeValue1651 !== chatCoreScopeValue1880 || chatCoreScopeValue1882 === false) return;
      chatCoreScopeValue1661(false);
    } catch (chatCoreScopeValue1883) {
      if (chatCoreScopeValue1651 === chatCoreScopeValue1880) window.showToast?.(chatCoreScopeValue1883?.message || "操作失败，请重试");
    } finally {
      chatCoreScopeValue1651 === chatCoreScopeValue1880 && (chatCoreScopeValue1655(false), chatCoreScopeValue1645.textContent = chatCoreScopeValue1881);
    }
  });
  function chatCoreScopeValue1662(chatCoreScopeValue1884, chatCoreScopeValue1885, chatCoreScopeValue1886, chatCoreScopeValue1887) {
    chatCoreScopeValue1885?.addEventListener("click", () => chatCoreScopeValue1887?.click());
    chatCoreScopeValue1887?.addEventListener("change", async chatCoreScopeValue1888 => {
      const chatCoreScopeValue1889 = chatCoreScopeValue1888.target.files?.[0];
      chatCoreScopeValue1888.target.value = "";
      const chatCoreScopeValue1890 = chatCoreScopeValue1648?.[chatCoreScopeValue1884];
      if (!chatCoreScopeValue1889 || typeof chatCoreScopeValue1890?.onUpload !== "function") return;
      const chatCoreScopeValue1891 = chatCoreScopeValue1651;
      try {
        chatCoreScopeValue1885.disabled = true;
        const chatCoreScopeValue1892 = await chatCoreScopeValue1890.onUpload(chatCoreScopeValue1889);
        chatCoreScopeValue1651 === chatCoreScopeValue1891 && chatCoreScopeValue1892?.imageUrl && chatCoreScopeValue1657(chatCoreScopeValue1884, {
          ...chatCoreScopeValue1890,
          ...chatCoreScopeValue1892
        });
      } catch (chatCoreScopeValue1893) {
        window.showToast?.(chatCoreScopeValue1893?.message || "参考脸上传失败");
      } finally {
        chatCoreScopeValue1885.disabled = false;
      }
    });
    chatCoreScopeValue1886?.addEventListener("click", async () => {
      const chatCoreScopeValue1894 = chatCoreScopeValue1648?.[chatCoreScopeValue1884];
      if (typeof chatCoreScopeValue1894?.onDelete !== "function") return;
      const chatCoreScopeValue1895 = chatCoreScopeValue1651;
      try {
        chatCoreScopeValue1886.disabled = true;
        await chatCoreScopeValue1894.onDelete();
        chatCoreScopeValue1651 === chatCoreScopeValue1895 && chatCoreScopeValue1657(chatCoreScopeValue1884, {
          ...chatCoreScopeValue1894,
          imageUrl: "",
          fileName: ""
        });
      } catch (chatCoreScopeValue1896) {
        window.showToast?.(chatCoreScopeValue1896?.message || "参考脸删除失败");
      } finally {
        chatCoreScopeValue1886.disabled = false;
      }
    });
  }
  chatCoreScopeValue1662("char", chatCoreScopeValue1617, chatCoreScopeValue1618, chatCoreScopeValue1619);
  chatCoreScopeValue1662("user", chatCoreScopeValue1623, chatCoreScopeValue1624, chatCoreScopeValue1625);
  chatCoreScopeValue1630?.addEventListener("click", () => chatCoreScopeValue1632?.click());
  chatCoreScopeValue1632?.addEventListener("change", async chatCoreScopeValue1897 => {
    const chatCoreScopeValue1898 = Array.from(chatCoreScopeValue1897.target.files || []);
    chatCoreScopeValue1897.target.value = "";
    if (!chatCoreScopeValue1898.length || typeof chatCoreScopeValue1649?.onUpload !== "function" || chatCoreScopeValue1652) return;
    const chatCoreScopeValue1899 = chatCoreScopeValue1651;
    try {
      chatCoreScopeValue1655(true);
      const chatCoreScopeValue1900 = await chatCoreScopeValue1649.onUpload(chatCoreScopeValue1898, chatCoreScopeValue1649.images || []);
      chatCoreScopeValue1651 === chatCoreScopeValue1899 && chatCoreScopeValue1900?.images && chatCoreScopeValue1656({
        ...chatCoreScopeValue1649,
        ...chatCoreScopeValue1900,
        status: ""
      });
    } catch (chatCoreScopeValue1901) {
      window.showToast?.(chatCoreScopeValue1901?.message || "图片处理失败");
    } finally {
      if (chatCoreScopeValue1651 === chatCoreScopeValue1899) chatCoreScopeValue1655(false);
    }
  });
  chatCoreScopeValue1631?.addEventListener("click", () => {
    chatCoreScopeValue1656({
      ...chatCoreScopeValue1649,
      images: [],
      imageUrl: "",
      fileName: "",
      status: ""
    });
  });
  chatCoreScopeValue1633?.addEventListener("click", chatCoreScopeValue1902 => {
    const chatCoreScopeValue1903 = chatCoreScopeValue1902.target.closest("button[data-image-index]");
    if (!chatCoreScopeValue1903 || chatCoreScopeValue1652) return;
    const chatCoreScopeValue1904 = Number(chatCoreScopeValue1903.dataset.imageIndex),
      chatCoreScopeValue1905 = Array.isArray(chatCoreScopeValue1649?.images) ? chatCoreScopeValue1649.images : [];
    chatCoreScopeValue1656({
      ...chatCoreScopeValue1649,
      images: chatCoreScopeValue1905.filter((chatCoreScopeValue1906, chatCoreScopeValue1907) => chatCoreScopeValue1907 !== chatCoreScopeValue1904),
      imageUrl: chatCoreScopeValue1904 === 0 ? chatCoreScopeValue1905[1]?.imageUrl || "" : chatCoreScopeValue1649.imageUrl,
      fileName: chatCoreScopeValue1904 === 0 ? chatCoreScopeValue1905[1]?.fileName || "" : chatCoreScopeValue1649.fileName,
      status: ""
    });
  });
  chatCoreScopeValue1636?.addEventListener("change", async () => {
    const chatCoreScopeValue1908 = chatCoreScopeValue1650;
    if (!chatCoreScopeValue1908) return;
    const chatCoreScopeValue1909 = String(chatCoreScopeValue1636.value || "").trim();
    chatCoreScopeValue1908.activePresetId = chatCoreScopeValue1909;
    const chatCoreScopeValue1910 = (Array.isArray(chatCoreScopeValue1908.presets) ? chatCoreScopeValue1908.presets : []).find(chatCoreScopeValue1911 => String(chatCoreScopeValue1911?.["id"] || "") === chatCoreScopeValue1909);
    if (chatCoreScopeValue1910) {
      const chatCoreNewScope1916 = chatCoreScopeValue1908.basePromptTarget === "secondary" ? chatCoreScopeValue1609 : chatCoreScopeValue1605;
      if (chatCoreNewScope1916) chatCoreNewScope1916.value = chatCoreScopeValue1910.basePrompt ?? chatCoreScopeValue1910.prompt ?? "";
      if (chatCoreScopeValue1639) chatCoreScopeValue1639.value = chatCoreScopeValue1910.charAppearance || "";
      if (chatCoreScopeValue1640) chatCoreScopeValue1640.value = chatCoreScopeValue1910.userAppearance || "";
      if (chatCoreScopeValue1641) chatCoreScopeValue1641.value = chatCoreScopeValue1910.artistPrompt || "";
      if (chatCoreScopeValue1642) chatCoreScopeValue1642.value = chatCoreScopeValue1910.negativePrompt || "";
    }
    chatCoreNewScope1667(chatCoreScopeValue1908);
    if (typeof chatCoreScopeValue1908.onPresetSelect === "function") try {
      await chatCoreScopeValue1908.onPresetSelect(chatCoreScopeValue1909, chatCoreScopeValue1910 || null);
    } catch (chatCoreScopeValue1912) {
      window.showToast?.(chatCoreScopeValue1912?.message || "提示词预设切换失败");
    }
  });
  chatCoreScopeValue1637?.addEventListener("click", async () => {
    const chatCoreScopeValue1913 = chatCoreScopeValue1650;
    if (!chatCoreScopeValue1913 || chatCoreScopeValue1913.presetsLoading || chatCoreScopeValue1913.presetSaving || chatCoreScopeValue1913.presetDeleting || chatCoreScopeValue1652) return;
    const chatCoreScopeValue1914 = chatCoreScopeValue1913.basePromptTarget === "secondary" ? chatCoreScopeValue1609 : chatCoreScopeValue1605,
      chatCoreNewScope1920 = String(chatCoreScopeValue1914?.["value"] || "").trim();
    if (![chatCoreNewScope1920, chatCoreScopeValue1639?.["value"], chatCoreScopeValue1640?.["value"], chatCoreScopeValue1641?.["value"], chatCoreScopeValue1642?.["value"]].some(chatCoreNewScope1927 => String(chatCoreNewScope1927 || "").trim())) {
      window.showToast?.("请填写至少一项生图提示词后再保存预设");
      return;
    }
    const chatCoreScopeValue1915 = chatCoreScopeValue1636?.selectedOptions?.[0]?.textContent || "",
      chatCoreScopeValue1916 = String(window.prompt("请输入预设名称", chatCoreScopeValue1915 === "当前编辑内容" ? "" : chatCoreScopeValue1915) || "").trim();
    if (!chatCoreScopeValue1916) return;
    const chatCoreScopeValue1917 = Date.now(),
      chatCoreScopeValue1918 = (Array.isArray(chatCoreScopeValue1913.presets) ? chatCoreScopeValue1913.presets : []).find(chatCoreScopeValue1921 => String(chatCoreScopeValue1921?.name || "").trim() === chatCoreScopeValue1916),
      chatCoreScopeValue1919 = {
        id: chatCoreScopeValue1918?.id || "image-preset-" + chatCoreScopeValue1917 + "-" + Math.random().toString(36).slice(2, 7),
        name: chatCoreScopeValue1916,
        prompt: chatCoreNewScope1920,
        basePrompt: chatCoreNewScope1920,
        charAppearance: String(chatCoreScopeValue1639?.["value"] || "").trim(),
        userAppearance: String(chatCoreScopeValue1640?.["value"] || "").trim(),
        artistPrompt: String(chatCoreScopeValue1641?.["value"] || "").trim(),
        negativePrompt: String(chatCoreScopeValue1642?.["value"] || "").trim(),
        createdAt: chatCoreScopeValue1918?.["createdAt"] || chatCoreScopeValue1917,
        updatedAt: chatCoreScopeValue1917
      },
      chatCoreScopeValue1920 = chatCoreScopeValue1651;
    chatCoreScopeValue1913.presetSaving = true, chatCoreNewScope1667();
    try {
      let chatCoreNewScope1929;
      if (window.u2ImagePromptPresets) chatCoreNewScope1929 = await window.u2ImagePromptPresets.save(chatCoreScopeValue1919);else throw new Error("全局预设存储尚未加载，请刷新后重试");
      if (chatCoreScopeValue1920 !== chatCoreScopeValue1651) return;
      chatCoreScopeValue1913.presets = chatCoreNewScope1929.presets, chatCoreScopeValue1913.activePresetId = chatCoreNewScope1929.preset.id, window.showToast?.("提示词预设已保存");
    } catch (chatCoreScopeValue1926) {
      if (chatCoreScopeValue1920 === chatCoreScopeValue1651) window.showToast?.(chatCoreScopeValue1926?.["message"] || "提示词预设保存失败");
    } finally {
      chatCoreScopeValue1913.presetSaving = false;
      if (chatCoreScopeValue1920 === chatCoreScopeValue1651) chatCoreNewScope1667();
    }
  }), chatCoreNewScope1649?.["addEventListener"]("click", async () => {
    const chatCoreNewScope1931 = chatCoreScopeValue1650;
    if (!chatCoreNewScope1931 || chatCoreScopeValue1652 || chatCoreNewScope1931.presetsLoading || chatCoreNewScope1931.presetSaving || chatCoreNewScope1931.presetDeleting) return;
    const chatCoreNewScope1932 = chatCoreNewScope1931.presets?.["find"](chatCoreNewScope1934 => chatCoreNewScope1934.id === chatCoreNewScope1931.activePresetId);
    if (!chatCoreNewScope1932) return;
    const chatCoreNewScope1933 = chatCoreScopeValue1651;
    chatCoreNewScope1931.presetDeleting = true, chatCoreNewScope1667();
    try {
      if (!window.u2ImagePromptPresets?.["remove"]) throw new Error("全局预设存储尚未加载，请刷新后重试");
      const chatCoreNewScope1935 = await window.u2ImagePromptPresets.remove(chatCoreNewScope1932.id);
      if (chatCoreNewScope1933 !== chatCoreScopeValue1651) return;
      chatCoreNewScope1931.presets = chatCoreNewScope1935, chatCoreNewScope1931.activePresetId = "", window.showToast?.("预设已删除，当前提示词保持不变");
    } catch (chatCoreNewScope1936) {
      if (chatCoreNewScope1933 === chatCoreScopeValue1651) window.showToast?.(chatCoreNewScope1936?.["message"] || "提示词预设删除失败");
    } finally {
      chatCoreNewScope1931.presetDeleting = false;
      if (chatCoreNewScope1933 === chatCoreScopeValue1651) chatCoreNewScope1667();
    }
  });
  chatCoreScopeValue1597 && chatCoreScopeValue1597.addEventListener("click", chatCoreScopeValue1927 => {
    if (chatCoreScopeValue1927.target === chatCoreScopeValue1597 && !chatCoreScopeValue1652) chatCoreScopeValue1661(true);
  });
  const chatCoreScopeValue1663 = document.getElementById("imessage-view");
  const chatCoreScopeValue1664 = document.getElementById("dock-icon-imessage");
  chatCoreScopeValue1664 && chatCoreScopeValue1664.addEventListener("click", chatCoreScopeValue1928 => {
    if (window.isJiggleMode || window.preventAppClick) {
      chatCoreScopeValue1928.preventDefault();
      chatCoreScopeValue1928.stopPropagation();
      return;
    }
    if (chatCoreScopeValue1592) chatCoreScopeValue1592();
    chatCoreScopeValue1589(chatCoreScopeValue1663);
    if (window.imApp.syncMomentsUser) window.imApp.syncMomentsUser();
    if (window.imApp.renderFriendsList) window.imApp.renderFriendsList();
    if (window.imApp.renderGroupsList) window.imApp.renderGroupsList();
    if (window.imApp.updateChatsUnreadBadges) window.imApp.updateChatsUnreadBadges();
  });
  const chatCoreScopeValue1665 = document.querySelector(".line-header-left");
  chatCoreScopeValue1665 && chatCoreScopeValue1665.addEventListener("click", () => {
    chatCoreScopeValue1590(chatCoreScopeValue1663);
  });
  const chatCoreScopeValue1666 = document.getElementById("chats-edit-btn");
  if (chatCoreScopeValue1666) {
    chatCoreScopeValue1666.addEventListener("click", () => {
      if (chatCoreScopeValue1665) chatCoreScopeValue1665.click();else chatCoreScopeValue1590(chatCoreScopeValue1663);
    });
  }
  const chatCoreScopeValue1667 = document.querySelector(".line-header-right");
  if (chatCoreScopeValue1667) {
    const chatCoreScopeValue1929 = chatCoreScopeValue1667.querySelector(".fa-bookmark");
    const chatCoreScopeValue1930 = chatCoreScopeValue1667.querySelector(".fa-cog");
    if (chatCoreScopeValue1929) chatCoreScopeValue1929.addEventListener("click", () => {
      if (window.showToast) window.showToast("Bookmark clicked");
    });
    if (chatCoreScopeValue1930) chatCoreScopeValue1930.addEventListener("click", () => {
      window.openImessageTutorial120();
    });
  }
  function chatCoreScopeValue1668() {
    const chatCoreScopeValue1931 = document.getElementById("stickers-view"),
      chatCoreScopeValue1932 = document.getElementById("app");
    return chatCoreScopeValue1931 && chatCoreScopeValue1932 && chatCoreScopeValue1931.parentNode !== chatCoreScopeValue1932 && chatCoreScopeValue1932.appendChild(chatCoreScopeValue1931), chatCoreScopeValue1931;
  }
  const chatCoreScopeValue1669 = document.querySelectorAll(".line-service-item");
  chatCoreScopeValue1669.forEach(chatCoreScopeValue1933 => {
    chatCoreScopeValue1933.addEventListener("click", async () => {
      if (chatCoreScopeValue1933.dataset.imessageService === "stickers") {
        try {
          window.imApp?.ensureStickersReady && (await window.imApp.ensureStickersReady());
        } catch (chatCoreScopeValue1935) {
          console.error("Failed to lazy load stickers", chatCoreScopeValue1935);
          if (window.showToast) window.showToast("表情数据加载失败");
        }
        const chatCoreScopeValue1934 = chatCoreScopeValue1668();
        chatCoreScopeValue1934 && window.openView ? (chatCoreScopeValue1934.style.display = "flex", window.openView(chatCoreScopeValue1934), typeof chatCoreScopeValue1705 === "function" && chatCoreScopeValue1705()) : console.error("Stickers view or openView not found");
      } else {}
    });
  });
  const chatCoreScopeValue1670 = chatCoreScopeValue1668();
  const chatCoreScopeValue1671 = document.getElementById("stickers-back-btn");
  const chatCoreScopeValue1672 = document.getElementById("stickers-add-btn");
  const chatCoreScopeValue1673 = document.getElementById("stickers-edit-btn");
  const chatCoreScopeValue1674 = document.getElementById("add-sticker-sheet");
  const chatCoreScopeValue1675 = document.getElementById("stickers-list-container");
  const chatCoreScopeValue1676 = document.getElementById("sticker-category-name");
  const chatCoreScopeValue1677 = document.getElementById("sticker-local-upload-btn");
  const chatCoreScopeValue1678 = document.getElementById("sticker-local-upload-input");
  const chatCoreScopeValue1679 = document.getElementById("sticker-local-preview");
  const chatCoreScopeValue1680 = document.getElementById("sticker-url-input");
  const chatCoreScopeValue1681 = document.getElementById("confirm-add-sticker-btn");
  const chatCoreScopeValue1682 = document.getElementById("sticker-manifest-upload-btn");
  const chatCoreScopeValue1683 = document.getElementById("sticker-manifest-upload-input");
  const chatCoreScopeValue1684 = document.getElementById("sticker-category-detail-sheet");
  const chatCoreScopeValue1685 = document.getElementById("sticker-detail-title");
  const chatCoreScopeValue1686 = document.getElementById("sticker-detail-count");
  const chatCoreScopeValue1687 = document.getElementById("sticker-detail-grid");
  const chatCoreScopeValue1688 = document.getElementById("sticker-detail-bind-btn");
  const chatCoreScopeValue1689 = document.getElementById("sticker-detail-delete-category-btn");
  const chatCoreScopeValue1690 = document.getElementById("sticker-detail-batch-bar");
  const chatCoreScopeValue1691 = document.getElementById("batch-delete-toggle");
  let chatCoreScopeValue1692 = [];
  let chatCoreScopeValue1693 = "";
  chatCoreScopeValue1671 && chatCoreScopeValue1670 && chatCoreScopeValue1671.addEventListener("click", () => {
    if (window.closeView) window.closeView(chatCoreScopeValue1670);else chatCoreScopeValue1670.style.display = "none";
  });
  chatCoreScopeValue1672 && chatCoreScopeValue1672.addEventListener("click", () => {
    if (chatCoreScopeValue1674) {
      chatCoreScopeValue1674.style.display = "flex";
      void chatCoreScopeValue1674.offsetWidth;
      chatCoreScopeValue1674.classList.add("active");
      const chatCoreScopeValue1936 = chatCoreScopeValue1674.querySelector(".bottom-sheet");
      if (chatCoreScopeValue1936) chatCoreScopeValue1936.style.transform = "translateY(0)";
      if (chatCoreScopeValue1676) chatCoreScopeValue1676.value = "";
      if (chatCoreScopeValue1680) chatCoreScopeValue1680.value = "";
      chatCoreScopeValue1679 && (chatCoreScopeValue1679.innerHTML = "", chatCoreScopeValue1679.classList.remove("has-items"));
      chatCoreScopeValue1692 = [];
    }
  });
  function chatCoreScopeValue1694() {
    chatCoreScopeValue1674 && (chatCoreScopeValue1674.classList.remove("active"), setTimeout(() => {
      chatCoreScopeValue1674.style.display = "none";
      chatCoreScopeValue1679 && (chatCoreScopeValue1679.innerHTML = "", chatCoreScopeValue1679.classList.remove("has-items"));
      chatCoreScopeValue1692 = [];
    }, 300));
  }
  chatCoreScopeValue1674 && chatCoreScopeValue1674.addEventListener("click", chatCoreScopeValue1937 => {
    if (chatCoreScopeValue1937.target === chatCoreScopeValue1674) chatCoreScopeValue1694();
  });
  chatCoreScopeValue1677 && chatCoreScopeValue1678 && (chatCoreScopeValue1677.addEventListener("click", () => {
    chatCoreScopeValue1678.click();
  }), chatCoreScopeValue1678.addEventListener("change", chatCoreScopeValue1938 => {
    const chatCoreScopeValue1939 = chatCoreScopeValue1938.target.files;
    if (!chatCoreScopeValue1939 || chatCoreScopeValue1939.length === 0) return;
    chatCoreScopeValue1692 = [];
    chatCoreScopeValue1679 && (chatCoreScopeValue1679.innerHTML = "", chatCoreScopeValue1679.classList.add("has-items"));
    Array.from(chatCoreScopeValue1939).forEach(async (chatCoreScopeValue1940, chatCoreScopeValue1941) => {
      try {
        const chatCoreScopeValue1942 = window.imApp.compressImageFile ? await window.imApp.compressImageFile(chatCoreScopeValue1940, {
            maxWidth: 256,
            maxHeight: 256,
            mimeType: "image/jpeg",
            quality: 0.8
          }) : await window.imApp.readFileAsDataUrl(chatCoreScopeValue1940),
          chatCoreScopeValue1943 = chatCoreScopeValue1940.name.replace(/\.[^/.]+$/, "") || "sticker_" + (chatCoreScopeValue1941 + 1),
          chatCoreScopeValue1944 = {
            name: chatCoreScopeValue1943,
            url: chatCoreScopeValue1942
          };
        chatCoreScopeValue1692.push(chatCoreScopeValue1944);
        if (chatCoreScopeValue1679) {
          const chatCoreScopeValue1945 = document.createElement("div");
          chatCoreScopeValue1945.className = "sticker-preview-item";
          const chatCoreScopeValue1946 = document.createElement("img");
          chatCoreScopeValue1946.src = chatCoreScopeValue1942;
          chatCoreScopeValue1946.className = "sticker-preview-img";
          const chatCoreScopeValue1947 = document.createElement("input");
          chatCoreScopeValue1947.type = "text";
          chatCoreScopeValue1947.value = chatCoreScopeValue1943;
          chatCoreScopeValue1947.className = "sticker-name-input";
          chatCoreScopeValue1947.placeholder = "名称";
          chatCoreScopeValue1947.addEventListener("input", () => {
            const chatCoreScopeValue1948 = chatCoreScopeValue1692.findIndex(chatCoreScopeValue1949 => chatCoreScopeValue1949.url === chatCoreScopeValue1942);
            chatCoreScopeValue1948 !== -1 && (chatCoreScopeValue1692[chatCoreScopeValue1948].name = chatCoreScopeValue1947.value || chatCoreScopeValue1943);
          });
          chatCoreScopeValue1945.appendChild(chatCoreScopeValue1946);
          chatCoreScopeValue1945.appendChild(chatCoreScopeValue1947);
          chatCoreScopeValue1679.appendChild(chatCoreScopeValue1945);
        }
      } catch (chatCoreScopeValue1950) {
        console.error("Failed to process sticker image", chatCoreScopeValue1950);
        if (chatCoreScopeValue1591) chatCoreScopeValue1591("表情图片处理失败");
      }
    });
    chatCoreScopeValue1678.value = "";
  }));
  async function chatCoreScopeValue1695(chatCoreScopeValue1951) {
    const chatCoreScopeValue1952 = String(chatCoreScopeValue1951?.name || "").toLowerCase();
    if (chatCoreScopeValue1952.endsWith(".docx")) {
      await window.u2LoadVendorLibrary?.("mammoth");
      if (!window.mammoth?.extractRawText) throw new Error("DOCX 解析组件未加载");
      const chatCoreScopeValue1953 = await window.mammoth.extractRawText({
        arrayBuffer: await chatCoreScopeValue1951.arrayBuffer()
      });
      return String(chatCoreScopeValue1953?.value || "");
    }
    return String(await chatCoreScopeValue1951.text()).replace(/\u0000/g, "");
  }
  chatCoreScopeValue1682 && chatCoreScopeValue1683 && (chatCoreScopeValue1682.addEventListener("click", () => chatCoreScopeValue1683.click()), chatCoreScopeValue1683.addEventListener("change", async () => {
    const chatCoreScopeValue1954 = chatCoreScopeValue1683.files?.[0];
    chatCoreScopeValue1683.value = "";
    if (!chatCoreScopeValue1954) return;
    const chatCoreScopeValue1955 = String(chatCoreScopeValue1954.name || "").toLowerCase();
    if (!chatCoreScopeValue1955.endsWith(".txt") && !chatCoreScopeValue1955.endsWith(".text") && !chatCoreScopeValue1955.endsWith(".docx")) {
      if (chatCoreScopeValue1591) chatCoreScopeValue1591("仅支持 TXT 和 DOCX 文件");
      return;
    }
    try {
      const chatCoreScopeValue1956 = await chatCoreScopeValue1695(chatCoreScopeValue1954),
        chatCoreScopeValue1957 = window.imDataUtils?.parseStickerManifestText ? window.imDataUtils.parseStickerManifestText(chatCoreScopeValue1956) : {
          items: [],
          invalidLines: []
        };
      if (chatCoreScopeValue1957.items.length === 0) {
        if (chatCoreScopeValue1591) chatCoreScopeValue1591("文件中没有有效的名称和 URL 记录");
        return;
      }
      const chatCoreScopeValue1958 = chatCoreScopeValue1957.items.map(chatCoreScopeValue1959 => chatCoreScopeValue1959.name + " " + chatCoreScopeValue1959.url).join(`
`);
      if (chatCoreScopeValue1680) {
        const chatCoreScopeValue1960 = chatCoreScopeValue1680.value.trim();
        chatCoreScopeValue1680.value = chatCoreScopeValue1960 ? chatCoreScopeValue1960 + `
` + chatCoreScopeValue1958 : chatCoreScopeValue1958;
        chatCoreScopeValue1680.focus();
      }
      chatCoreScopeValue1591 && chatCoreScopeValue1591(chatCoreScopeValue1957.invalidLines.length > 0 ? "已读取 " + chatCoreScopeValue1957.items.length + " 条，第 " + chatCoreScopeValue1957.invalidLines.join("、") + " 行格式无效" : "已读取 " + chatCoreScopeValue1957.items.length + " 条贴图记录");
    } catch (chatCoreScopeValue1961) {
      console.error("Failed to import sticker manifest", chatCoreScopeValue1961);
      if (chatCoreScopeValue1591) chatCoreScopeValue1591(chatCoreScopeValue1961?.message || "贴图清单读取失败");
    }
  }));
  chatCoreScopeValue1681 && chatCoreScopeValue1681.addEventListener("click", async () => {
    const chatCoreScopeValue1962 = chatCoreScopeValue1676 ? chatCoreScopeValue1676.value.trim() : "";
    if (!chatCoreScopeValue1962) {
      if (chatCoreScopeValue1591) chatCoreScopeValue1591("请输入分类名称");
      return;
    }
    const chatCoreScopeValue1963 = window.imDataUtils?.parseStickerManifestText ? window.imDataUtils.parseStickerManifestText(chatCoreScopeValue1680?.value || "") : {
        items: [],
        invalidLines: []
      },
      chatCoreScopeValue1964 = chatCoreScopeValue1963.items;
    if (chatCoreScopeValue1963.invalidLines.length > 0) {
      if (chatCoreScopeValue1591) chatCoreScopeValue1591("第 " + chatCoreScopeValue1963.invalidLines.join("、") + " 行格式无效，请修改后重试");
      return;
    }
    const chatCoreScopeValue1965 = [...chatCoreScopeValue1692, ...chatCoreScopeValue1964];
    if (chatCoreScopeValue1965.length === 0) {
      if (chatCoreScopeValue1591) chatCoreScopeValue1591("请添加至少一张表情");
      return;
    }
    const chatCoreScopeValue1966 = window.imApp.commitStickersChange ? await window.imApp.commitStickersChange(() => {
      if (!window.imData.stickers) window.imData.stickers = [];
      let chatCoreScopeValue1967 = window.imData.stickers.find(chatCoreScopeValue1968 => chatCoreScopeValue1968.categoryName === chatCoreScopeValue1962);
      chatCoreScopeValue1967 ? chatCoreScopeValue1967.items = Array.isArray(chatCoreScopeValue1967.items) ? chatCoreScopeValue1967.items.concat(chatCoreScopeValue1965) : [...chatCoreScopeValue1965] : window.imData.stickers.push({
        categoryName: chatCoreScopeValue1962,
        items: chatCoreScopeValue1965
      });
    }, {
      silent: true
    }) : window.imApp.saveStickers ? await (async () => {
      if (!window.imData.stickers) window.imData.stickers = [];
      let chatCoreScopeValue1969 = window.imData.stickers.find(chatCoreScopeValue1970 => chatCoreScopeValue1970.categoryName === chatCoreScopeValue1962);
      return chatCoreScopeValue1969 ? chatCoreScopeValue1969.items = Array.isArray(chatCoreScopeValue1969.items) ? chatCoreScopeValue1969.items.concat(chatCoreScopeValue1965) : [...chatCoreScopeValue1965] : window.imData.stickers.push({
        categoryName: chatCoreScopeValue1962,
        items: chatCoreScopeValue1965
      }), window.imApp.saveStickers({
        silent: true
      });
    })() : false;
    if (!chatCoreScopeValue1966) {
      if (chatCoreScopeValue1591) chatCoreScopeValue1591("表情包保存失败");
      return;
    }
    chatCoreScopeValue1705();
    chatCoreScopeValue1694();
    if (chatCoreScopeValue1591) chatCoreScopeValue1591("已添加 " + chatCoreScopeValue1965.length + " 张表情到 \"" + chatCoreScopeValue1962 + "\"");
  });
  let chatCoreScopeValue1696 = false;
  let chatCoreScopeValue1697 = new Set();
  chatCoreScopeValue1673 && chatCoreScopeValue1673.addEventListener("click", () => {
    chatCoreScopeValue1696 = !chatCoreScopeValue1696;
    chatCoreScopeValue1697.clear();
    chatCoreScopeValue1673.innerHTML = chatCoreScopeValue1696 ? "<i class=\"fas fa-check\"></i>" : "<i class=\"fas fa-pen\"></i>";
    chatCoreScopeValue1705(chatCoreScopeValue1696);
  });
  function chatCoreScopeValue1698() {
    return (Array.isArray(window.imData.friends) ? window.imData.friends : []).filter(chatCoreScopeValue1971 => chatCoreScopeValue1971 && chatCoreScopeValue1971.id != null && chatCoreScopeValue1971.type !== "group" && chatCoreScopeValue1971.type !== "official");
  }
  function chatCoreScopeValue1699(chatCoreScopeValue1972) {
    return chatCoreScopeValue1698().filter(chatCoreScopeValue1973 => Array.isArray(chatCoreScopeValue1973.mountedStickers) && chatCoreScopeValue1973.mountedStickers.includes(chatCoreScopeValue1972));
  }
  function chatCoreScopeValue1700(chatCoreScopeValue1974) {
    const chatCoreScopeValue1975 = String(chatCoreScopeValue1974 || "").trim();
    if (!chatCoreScopeValue1975) return;
    const chatCoreScopeValue1976 = chatCoreScopeValue1698();
    if (chatCoreScopeValue1976.length === 0) {
      if (chatCoreScopeValue1591) chatCoreScopeValue1591("No chars available");
      return;
    }
    let chatCoreScopeValue1977 = document.getElementById("sticker-bind-role-overlay");
    !chatCoreScopeValue1977 && (chatCoreScopeValue1977 = document.createElement("div"), chatCoreScopeValue1977.id = "sticker-bind-role-overlay", chatCoreScopeValue1977.style.cssText = "position:fixed; inset:0; z-index:10020; display:none; align-items:center; justify-content:center; background:rgba(0,0,0,0.24); padding:18px;", chatCoreScopeValue1977.innerHTML = `
                <div class="sticker-bind-role-card" style="width:min(100%,360px); max-height:78vh; display:flex; flex-direction:column; background:#fff; border-radius:24px;  overflow:hidden;">
                    <div style="display:flex; align-items:center; justify-content:space-between; padding:16px 18px; border-bottom:1px solid #f2f2f7;">
                        <div style="min-width:0;">
                            <div style="font-size:17px; font-weight:800; color:#111;">Bind Roles</div>
                            <div class="sticker-bind-role-subtitle" style="font-size:12px; color:#8e8e93; margin-top:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"></div>
                        </div>
                        <button type="button" class="sticker-bind-role-close" style="width:32px; height:32px; border:none; border-radius:50%; background:#f2f2f7; color:#636366; cursor:pointer;"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="sticker-bind-role-list" style="padding:8px; overflow-y:auto;"></div>
                    <div style="display:flex; gap:8px; padding:12px 14px 14px; border-top:1px solid #f2f2f7;">
                        <button type="button" class="sticker-bind-role-cancel" style="flex:1; height:42px; border:none; border-radius:16px; background:#f2f2f7; color:#555; font-size:15px; font-weight:700; cursor:pointer;">Cancel</button>
                        <button type="button" class="sticker-bind-role-save" style="flex:1; height:42px; border:none; border-radius:16px; background:#111; color:#fff; font-size:15px; font-weight:800; cursor:pointer;">Save</button>
                    </div>
                </div>
            `, document.body.appendChild(chatCoreScopeValue1977), chatCoreScopeValue1977.addEventListener("click", chatCoreScopeValue1981 => {
      if (chatCoreScopeValue1981.target === chatCoreScopeValue1977) chatCoreScopeValue1977.style.display = "none";
    }), chatCoreScopeValue1977.querySelector(".sticker-bind-role-close")?.addEventListener("click", () => {
      chatCoreScopeValue1977.style.display = "none";
    }), chatCoreScopeValue1977.querySelector(".sticker-bind-role-cancel")?.addEventListener("click", () => {
      chatCoreScopeValue1977.style.display = "none";
    }));
    const chatCoreScopeValue1978 = chatCoreScopeValue1977.querySelector(".sticker-bind-role-subtitle"),
      chatCoreScopeValue1979 = chatCoreScopeValue1977.querySelector(".sticker-bind-role-list"),
      chatCoreScopeValue1980 = chatCoreScopeValue1977.querySelector(".sticker-bind-role-save");
    if (chatCoreScopeValue1978) chatCoreScopeValue1978.textContent = chatCoreScopeValue1975;
    if (!chatCoreScopeValue1979 || !chatCoreScopeValue1980) return;
    chatCoreScopeValue1979.innerHTML = "";
    chatCoreScopeValue1976.forEach(chatCoreScopeValue1982 => {
      const chatCoreScopeValue1983 = Array.isArray(chatCoreScopeValue1982.mountedStickers) && chatCoreScopeValue1982.mountedStickers.includes(chatCoreScopeValue1975),
        chatCoreScopeValue1984 = document.createElement("label");
      chatCoreScopeValue1984.style.cssText = "display:flex; align-items:center; gap:12px; padding:10px; border-radius:16px; cursor:pointer;";
      chatCoreScopeValue1984.innerHTML = `
                <input type="checkbox" data-friend-id="` + chatCoreScopeValue1982.id + "\" " + (chatCoreScopeValue1983 ? "checked" : "") + ` style="width:18px; height:18px; accent-color:#111;">
                <div style="width:34px; height:34px; border-radius:50%; overflow:hidden; background:#f2f2f7; color:#8e8e93; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                    ` + (chatCoreScopeValue1982.avatarUrl ? "<img src=\"" + chatCoreScopeValue1982.avatarUrl + "\" style=\"width:100%; height:100%; object-fit:cover;\">" : "<span>" + String(chatCoreScopeValue1982.nickname || chatCoreScopeValue1982.realName || "?").charAt(0) + "</span>") + `
                </div>
                <div style="min-width:0; flex:1; font-size:14px; color:#111; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">` + (chatCoreScopeValue1982.nickname || chatCoreScopeValue1982.realName || "Char") + `</div>
            `;
      chatCoreScopeValue1979.appendChild(chatCoreScopeValue1984);
    });
    chatCoreScopeValue1980.onclick = async () => {
      const chatCoreScopeValue1985 = new Set(Array.from(chatCoreScopeValue1979.querySelectorAll("input[type=\"checkbox\"]:checked")).map(chatCoreScopeValue1990 => String(chatCoreScopeValue1990.dataset.friendId))),
        chatCoreScopeValue1986 = chatCoreScopeValue1976.map(chatCoreScopeValue1991 => String(chatCoreScopeValue1991.id)),
        chatCoreScopeValue1987 = window.imApp.commitFriendsChange ? await window.imApp.commitFriendsChange(() => {
          chatCoreScopeValue1976.forEach(chatCoreScopeValue1992 => {
            const chatCoreScopeValue1993 = chatCoreScopeValue1985.has(String(chatCoreScopeValue1992.id)),
              chatCoreScopeValue1994 = Array.isArray(chatCoreScopeValue1992.mountedStickers) ? chatCoreScopeValue1992.mountedStickers : [],
              chatCoreScopeValue1995 = chatCoreScopeValue1994.filter(chatCoreScopeValue1996 => chatCoreScopeValue1996 !== chatCoreScopeValue1975);
            if (chatCoreScopeValue1993) chatCoreScopeValue1995.push(chatCoreScopeValue1975);
            chatCoreScopeValue1992.mountedStickers = Array.from(new Set(chatCoreScopeValue1995));
          });
        }, {
          silent: true,
          friendIds: chatCoreScopeValue1986,
          metaOnly: true
        }) : false;
      if (!chatCoreScopeValue1987) {
        if (chatCoreScopeValue1591) chatCoreScopeValue1591("Bind failed");
        return;
      }
      const chatCoreScopeValue1988 = window.imData.currentActiveFriend;
      if (chatCoreScopeValue1988 && chatCoreScopeValue1986.includes(String(chatCoreScopeValue1988.id))) {
        const chatCoreScopeValue1997 = (window.imData.friends || []).find(chatCoreScopeValue1998 => String(chatCoreScopeValue1998.id) === String(chatCoreScopeValue1988.id));
        if (chatCoreScopeValue1997) window.imData.currentActiveFriend = chatCoreScopeValue1997;
      }
      const chatCoreScopeValue1989 = window.imData.currentSettingsFriend;
      if (chatCoreScopeValue1989 && chatCoreScopeValue1986.includes(String(chatCoreScopeValue1989.id))) {
        const chatCoreScopeValue1999 = (window.imData.friends || []).find(chatCoreScopeValue2000 => String(chatCoreScopeValue2000.id) === String(chatCoreScopeValue1989.id));
        if (chatCoreScopeValue1999) window.imData.currentSettingsFriend = chatCoreScopeValue1999;
      }
      chatCoreScopeValue1977.style.display = "none";
      chatCoreScopeValue1705(true);
      window.dispatchEvent(new CustomEvent("u2:stickers-binding-changed", {
        detail: {
          categoryName: chatCoreScopeValue1975,
          boundFriendIds: Array.from(chatCoreScopeValue1985)
        }
      }));
      if (chatCoreScopeValue1591) chatCoreScopeValue1591("Bound");
    };
    chatCoreScopeValue1977.style.display = "flex";
  }
  function chatCoreScopeValue1701(chatCoreScopeValue2001) {
    if (!chatCoreScopeValue1675) return;
    chatCoreScopeValue1675.innerHTML = "";
    if (!chatCoreScopeValue2001) {
      chatCoreScopeValue1696 = false;
      chatCoreScopeValue1697.clear();
      if (chatCoreScopeValue1673) chatCoreScopeValue1673.innerHTML = "<i class=\"fas fa-pen\"></i>";
    }
    const chatCoreScopeValue2002 = window.imData.stickers || [];
    if (chatCoreScopeValue2002.length === 0) {
      chatCoreScopeValue1675.innerHTML = "<div style=\"text-align: center; color: #8e8e93; padding: 40px;\">No stickers yet. Tap + to add.</div>";
      return;
    }
    if (chatCoreScopeValue1696) {
      const chatCoreScopeValue2003 = document.createElement("div");
      chatCoreScopeValue2003.id = "batch-delete-bar";
      chatCoreScopeValue2003.style.cssText = "position: sticky; top: 0; z-index: 50; display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; background: rgba(255,255,255,0.95);   border-radius: 16px; margin-bottom: 12px; ";
      const chatCoreScopeValue2004 = document.createElement("div");
      chatCoreScopeValue2004.id = "batch-select-info";
      chatCoreScopeValue2004.style.cssText = "font-size: 14px; color: #8e8e93; font-weight: 500;";
      chatCoreScopeValue2004.textContent = "已选择 " + chatCoreScopeValue1697.size + " 项";
      const chatCoreScopeValue2005 = document.createElement("div");
      chatCoreScopeValue2005.id = "batch-delete-toggle";
      chatCoreScopeValue2005.style.cssText = "background: #ff3b30; color: #fff; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px;";
      chatCoreScopeValue2005.innerHTML = "<i class=\"fas fa-trash\"></i> 删除所选";
      chatCoreScopeValue2005.addEventListener("click", async () => {
        if (chatCoreScopeValue1697.size === 0) {
          if (chatCoreScopeValue1591) chatCoreScopeValue1591("请先选择要删除的表情");
          return;
        }
        const chatCoreScopeValue2006 = Array.from(chatCoreScopeValue1697).sort((chatCoreScopeValue2009, chatCoreScopeValue2010) => {
            const [chatCoreScopeValue2011, chatCoreScopeValue2012] = chatCoreScopeValue2009.split("-").map(Number),
              [chatCoreScopeValue2013, chatCoreScopeValue2014] = chatCoreScopeValue2010.split("-").map(Number);
            if (chatCoreScopeValue2011 !== chatCoreScopeValue2013) return chatCoreScopeValue2013 - chatCoreScopeValue2011;
            return chatCoreScopeValue2014 - chatCoreScopeValue2012;
          }),
          chatCoreScopeValue2007 = chatCoreScopeValue2006.length,
          chatCoreScopeValue2008 = window.imApp.commitStickersChange ? await window.imApp.commitStickersChange(() => {
            chatCoreScopeValue2006.forEach(chatCoreScopeValue2015 => {
              const [chatCoreScopeValue2016, chatCoreScopeValue2017] = chatCoreScopeValue2015.split("-").map(Number);
              window.imData.stickers[chatCoreScopeValue2016]?.items?.[chatCoreScopeValue2017] && window.imData.stickers[chatCoreScopeValue2016].items.splice(chatCoreScopeValue2017, 1);
            });
            window.imData.stickers = (window.imData.stickers || []).filter(chatCoreScopeValue2018 => Array.isArray(chatCoreScopeValue2018.items) && chatCoreScopeValue2018.items.length > 0);
          }, {
            silent: true
          }) : window.imApp.saveStickers ? await (async () => {
            return chatCoreScopeValue2006.forEach(chatCoreScopeValue2019 => {
              const [chatCoreScopeValue2020, chatCoreScopeValue2021] = chatCoreScopeValue2019.split("-").map(Number);
              window.imData.stickers[chatCoreScopeValue2020]?.items?.[chatCoreScopeValue2021] && window.imData.stickers[chatCoreScopeValue2020].items.splice(chatCoreScopeValue2021, 1);
            }), window.imData.stickers = (window.imData.stickers || []).filter(chatCoreScopeValue2022 => Array.isArray(chatCoreScopeValue2022.items) && chatCoreScopeValue2022.items.length > 0), window.imApp.saveStickers({
              silent: true
            });
          })() : false;
        if (!chatCoreScopeValue2008) {
          if (chatCoreScopeValue1591) chatCoreScopeValue1591("表情删除失败");
          return;
        }
        chatCoreScopeValue1696 = false;
        chatCoreScopeValue1697.clear();
        if (chatCoreScopeValue1673) chatCoreScopeValue1673.innerHTML = "<i class=\"fas fa-pen\"></i>";
        chatCoreScopeValue1705();
        if (chatCoreScopeValue1591) chatCoreScopeValue1591("已删除 " + chatCoreScopeValue2007 + " 张表情");
      });
      chatCoreScopeValue2003.appendChild(chatCoreScopeValue2004);
      chatCoreScopeValue2003.appendChild(chatCoreScopeValue2005);
      chatCoreScopeValue1675.appendChild(chatCoreScopeValue2003);
    }
    chatCoreScopeValue2002.forEach((chatCoreScopeValue2023, chatCoreScopeValue2024) => {
      const chatCoreScopeValue2025 = document.createElement("div");
      chatCoreScopeValue2025.className = "sticker-category-card";
      chatCoreScopeValue2025.style.cssText = "background: #fff; border: 1px solid #f2f2f7; border-radius: 14px; padding: 0; overflow: hidden;  display: flex; flex-direction: column; max-height: 350px; margin-bottom: 12px;";
      const chatCoreScopeValue2026 = document.createElement("div");
      chatCoreScopeValue2026.className = "sticker-category-header";
      chatCoreScopeValue2026.style.cssText = "display: flex; align-items: center; justify-content: space-between; gap: 8px; cursor: pointer; position: relative; min-height: 42px; padding: 7px 12px; flex-shrink: 0; border-bottom: 1px solid #f2f2f7;";
      const chatCoreScopeValue2027 = document.createElement("div");
      chatCoreScopeValue2027.style.cssText = "display: flex; align-items: center; gap: 6px; min-width: 90px;";
      const chatCoreScopeValue2028 = document.createElement("button");
      chatCoreScopeValue2028.type = "button";
      chatCoreScopeValue2028.className = "sticker-category-bind";
      const chatCoreScopeValue2029 = chatCoreScopeValue1699(chatCoreScopeValue2023.categoryName).length;
      chatCoreScopeValue2028.innerHTML = "<i class=\"fas fa-user-plus\"></i><span>" + (chatCoreScopeValue2029 || "") + "</span>";
      chatCoreScopeValue2028.title = "Bind roles";
      chatCoreScopeValue2028.style.cssText = "height: 28px; min-width: 44px; border: none; border-radius: 14px; background: #f7f7fa; color: #111; display: inline-flex; align-items: center; justify-content: center; gap: 5px; padding: 0 9px; font-size: 12px; font-weight: 700; cursor: pointer;";
      chatCoreScopeValue2028.addEventListener("click", chatCoreScopeValue2036 => {
        chatCoreScopeValue2036.stopPropagation();
        chatCoreScopeValue1700(chatCoreScopeValue2023.categoryName);
      });
      chatCoreScopeValue2027.appendChild(chatCoreScopeValue2028);
      const chatCoreScopeValue2030 = document.createElement("div");
      chatCoreScopeValue2030.className = "sticker-category-title";
      chatCoreScopeValue2030.textContent = chatCoreScopeValue2023.categoryName;
      chatCoreScopeValue2030.style.cssText = "position: absolute; left: 50%; transform: translateX(-50%); font-size: 14px; font-weight: 600; color: #000; white-space: nowrap; pointer-events: none;";
      const chatCoreScopeValue2031 = document.createElement("div");
      chatCoreScopeValue2031.style.cssText = "display: flex; align-items: center; gap: 4px; margin-left: auto;";
      const chatCoreScopeValue2032 = document.createElement("div");
      chatCoreScopeValue2032.className = "sticker-category-delete";
      chatCoreScopeValue2032.innerHTML = "<i class=\"fas fa-times\"></i>";
      chatCoreScopeValue2032.style.cssText = "color: #ff3b30; cursor: pointer; font-size: 13px; width: 28px; height: 28px; padding: 0; display: none; border-radius: 50%; align-items: center; justify-content: center; transition: background 0.2s;";
      chatCoreScopeValue2032.addEventListener("click", async chatCoreScopeValue2037 => {
        chatCoreScopeValue2037.stopPropagation();
        if (confirm("删除分类 \"" + chatCoreScopeValue2023.categoryName + "\" ?")) {
          const chatCoreScopeValue2038 = window.imApp.commitStickersChange ? await window.imApp.commitStickersChange(() => {
            window.imData.stickers.splice(chatCoreScopeValue2024, 1);
          }, {
            silent: true
          }) : window.imApp.saveStickers ? await (async () => {
            return window.imData.stickers.splice(chatCoreScopeValue2024, 1), window.imApp.saveStickers({
              silent: true
            });
          })() : false;
          if (!chatCoreScopeValue2038) {
            if (chatCoreScopeValue1591) chatCoreScopeValue1591("分类删除失败");
            return;
          }
          chatCoreScopeValue1705();
          if (chatCoreScopeValue1591) chatCoreScopeValue1591("已删除分类 \"" + chatCoreScopeValue2023.categoryName + "\"");
        }
      });
      const chatCoreScopeValue2033 = document.createElement("div");
      chatCoreScopeValue2033.className = "sticker-category-collapse-icon";
      chatCoreScopeValue2033.style.cssText = "color: #8e8e93; font-size: 13px; transition: transform 0.3s; padding: 6px;";
      chatCoreScopeValue2033.innerHTML = "<i class=\"fas fa-chevron-down\"></i>";
      chatCoreScopeValue2031.appendChild(chatCoreScopeValue2032);
      chatCoreScopeValue2031.appendChild(chatCoreScopeValue2033);
      chatCoreScopeValue2026.appendChild(chatCoreScopeValue2027);
      chatCoreScopeValue2026.appendChild(chatCoreScopeValue2030);
      chatCoreScopeValue2026.appendChild(chatCoreScopeValue2031);
      const chatCoreScopeValue2034 = document.createElement("div");
      chatCoreScopeValue2034.className = "sticker-grid";
      chatCoreScopeValue2034.style.overflowY = "auto";
      chatCoreScopeValue2034.style.flex = "1";
      chatCoreScopeValue2034.style.minHeight = "0";
      chatCoreScopeValue2034.style.padding = "12px 12px 12px 12px";
      chatCoreScopeValue2034.style.alignContent = "start";
      let chatCoreScopeValue2035 = chatCoreScopeValue2023.collapsed || false;
      chatCoreScopeValue2035 ? (chatCoreScopeValue2034.style.display = "none", chatCoreScopeValue2033.querySelector("i").style.transform = "rotate(-90deg)", chatCoreScopeValue2032.style.display = "none") : chatCoreScopeValue2032.style.display = "flex";
      chatCoreScopeValue2026.addEventListener("click", chatCoreScopeValue2039 => {
        if (chatCoreScopeValue2039.target.closest(".sticker-category-delete")) return;
        if (chatCoreScopeValue2039.target.closest(".sticker-category-bind")) return;
        chatCoreScopeValue2035 = !chatCoreScopeValue2035;
        chatCoreScopeValue2023.collapsed = chatCoreScopeValue2035;
        chatCoreScopeValue2034.style.display = chatCoreScopeValue2035 ? "none" : "grid";
        chatCoreScopeValue2033.querySelector("i").style.transform = chatCoreScopeValue2035 ? "rotate(-90deg)" : "rotate(0deg)";
        chatCoreScopeValue2032.style.display = chatCoreScopeValue2035 ? "none" : "flex";
      });
      chatCoreScopeValue2023.items.forEach((chatCoreScopeValue2040, chatCoreScopeValue2041) => {
        const chatCoreScopeValue2042 = document.createElement("div");
        chatCoreScopeValue2042.className = "sticker-item";
        chatCoreScopeValue2042.style.position = "relative";
        const chatCoreScopeValue2043 = document.createElement("img");
        chatCoreScopeValue2043.src = chatCoreScopeValue2040.url;
        chatCoreScopeValue2043.alt = chatCoreScopeValue2040.name;
        chatCoreScopeValue2043.title = chatCoreScopeValue2040.name;
        if (chatCoreScopeValue1696) {
          const chatCoreScopeValue2044 = document.createElement("div");
          chatCoreScopeValue2044.className = "sticker-select-checkbox";
          chatCoreScopeValue2044.dataset.key = chatCoreScopeValue2024 + "-" + chatCoreScopeValue2041;
          const chatCoreScopeValue2045 = chatCoreScopeValue1697.has(chatCoreScopeValue2024 + "-" + chatCoreScopeValue2041);
          chatCoreScopeValue2044.style.cssText = "position: absolute; top: 4px; left: 4px; width: 22px; height: 22px; border-radius: 50%; background: " + (chatCoreScopeValue2045 ? "#007aff" : "rgba(255,255,255,0.9)") + "; border: 2px solid " + (chatCoreScopeValue2045 ? "#007aff" : "#ccc") + "; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #fff; cursor: pointer; z-index: 5; ";
          chatCoreScopeValue2045 && (chatCoreScopeValue2044.innerHTML = "<i class=\"fas fa-check\"></i>", chatCoreScopeValue2042.style.outline = "2px solid #007aff", chatCoreScopeValue2042.style.borderRadius = "8px");
          const chatCoreScopeValue2046 = chatCoreScopeValue2047 => {
            if (chatCoreScopeValue2047) chatCoreScopeValue2047.stopPropagation();
            const chatCoreScopeValue2048 = chatCoreScopeValue2024 + "-" + chatCoreScopeValue2041;
            chatCoreScopeValue1697.has(chatCoreScopeValue2048) ? (chatCoreScopeValue1697["delete"](chatCoreScopeValue2048), chatCoreScopeValue2044.innerHTML = "", chatCoreScopeValue2044.style.borderColor = "#ccc", chatCoreScopeValue2044.style.background = "rgba(255,255,255,0.9)", chatCoreScopeValue2042.style.outline = "none") : (chatCoreScopeValue1697.add(chatCoreScopeValue2048), chatCoreScopeValue2044.innerHTML = "<i class=\"fas fa-check\"></i>", chatCoreScopeValue2044.style.borderColor = "#007aff", chatCoreScopeValue2044.style.background = "#007aff", chatCoreScopeValue2042.style.outline = "2px solid #007aff");
            const chatCoreScopeValue2049 = document.getElementById("batch-select-info");
            if (chatCoreScopeValue2049) chatCoreScopeValue2049.textContent = "已选择 " + chatCoreScopeValue1697.size + " 项";
          };
          chatCoreScopeValue2044.addEventListener("click", chatCoreScopeValue2046);
          chatCoreScopeValue2042.addEventListener("click", () => chatCoreScopeValue2046());
          chatCoreScopeValue2042.appendChild(chatCoreScopeValue2044);
        }
        chatCoreScopeValue2042.appendChild(chatCoreScopeValue2043);
        if (!chatCoreScopeValue1696) {
          let chatCoreScopeValue2050;
          chatCoreScopeValue2042.addEventListener("touchstart", () => {
            chatCoreScopeValue2050 = setTimeout(() => {
              chatCoreScopeValue1696 = true;
              chatCoreScopeValue1697.add(chatCoreScopeValue2024 + "-" + chatCoreScopeValue2041);
              if (chatCoreScopeValue1673) chatCoreScopeValue1673.innerHTML = "<i class=\"fas fa-check\"></i>";
              chatCoreScopeValue1705(true);
            }, 800);
          });
          chatCoreScopeValue2042.addEventListener("touchend", () => clearTimeout(chatCoreScopeValue2050));
          chatCoreScopeValue2042.addEventListener("touchmove", () => clearTimeout(chatCoreScopeValue2050));
          chatCoreScopeValue2042.addEventListener("contextmenu", chatCoreScopeValue2051 => {
            chatCoreScopeValue2051.preventDefault();
            chatCoreScopeValue1696 = true;
            chatCoreScopeValue1697.add(chatCoreScopeValue2024 + "-" + chatCoreScopeValue2041);
            if (chatCoreScopeValue1673) chatCoreScopeValue1673.innerHTML = "<i class=\"fas fa-check\"></i>";
            chatCoreScopeValue1705(true);
          });
        }
        chatCoreScopeValue2034.appendChild(chatCoreScopeValue2042);
      });
      chatCoreScopeValue2025.appendChild(chatCoreScopeValue2026);
      chatCoreScopeValue2025.appendChild(chatCoreScopeValue2034);
      chatCoreScopeValue1675.appendChild(chatCoreScopeValue2025);
    });
  }
  function chatCoreScopeValue1702() {
    return (window.imData.stickers || []).find(chatCoreScopeValue2052 => chatCoreScopeValue2052?.categoryName === chatCoreScopeValue1693) || null;
  }
  function chatCoreScopeValue1703() {
    if (!chatCoreScopeValue1687) return;
    const chatCoreScopeValue2053 = chatCoreScopeValue1702();
    if (!chatCoreScopeValue2053) {
      if (chatCoreScopeValue1684 && window.closeView) window.closeView(chatCoreScopeValue1684);
      chatCoreScopeValue1693 = "";
      return;
    }
    const chatCoreScopeValue2054 = Array.isArray(chatCoreScopeValue2053.items) ? chatCoreScopeValue2053.items : [];
    if (chatCoreScopeValue1685) chatCoreScopeValue1685.textContent = chatCoreScopeValue2053.categoryName || "表情包";
    if (chatCoreScopeValue1686) chatCoreScopeValue1686.textContent = chatCoreScopeValue2054.length + " 张 · 已绑定 " + chatCoreScopeValue1699(chatCoreScopeValue2053.categoryName).length + " 位角色";
    if (chatCoreScopeValue1690) chatCoreScopeValue1690.hidden = !chatCoreScopeValue1696;
    const chatCoreScopeValue2055 = document.getElementById("batch-select-info");
    if (chatCoreScopeValue2055) chatCoreScopeValue2055.textContent = "已选择 " + chatCoreScopeValue1697.size + " 项";
    if (chatCoreScopeValue1673) chatCoreScopeValue1673.innerHTML = chatCoreScopeValue1696 ? "<i class=\"fas fa-check\"></i>" : "<i class=\"fas fa-pen\"></i>";
    chatCoreScopeValue1687.innerHTML = "";
    chatCoreScopeValue2054.forEach((chatCoreScopeValue2056, chatCoreScopeValue2057) => {
      if (!chatCoreScopeValue2056?.url) return;
      const chatCoreScopeValue2058 = document.createElement("button");
      chatCoreScopeValue2058.type = "button";
      chatCoreScopeValue2058.className = "sticker-item sticker-detail-item";
      chatCoreScopeValue2058.title = chatCoreScopeValue2056.name || "Sticker " + (chatCoreScopeValue2057 + 1);
      const chatCoreScopeValue2059 = document.createElement("img");
      chatCoreScopeValue2059.src = chatCoreScopeValue2056.url;
      chatCoreScopeValue2059.alt = chatCoreScopeValue2056.name || "";
      chatCoreScopeValue2058.appendChild(chatCoreScopeValue2059);
      if (chatCoreScopeValue1696) {
        const chatCoreScopeValue2060 = chatCoreScopeValue1697.has(String(chatCoreScopeValue2057));
        chatCoreScopeValue2058.classList.toggle("selected", chatCoreScopeValue2060);
        const chatCoreScopeValue2061 = document.createElement("span");
        chatCoreScopeValue2061.className = "sticker-select-checkbox";
        chatCoreScopeValue2061.innerHTML = chatCoreScopeValue2060 ? "<i class=\"fas fa-check\"></i>" : "";
        chatCoreScopeValue2058.appendChild(chatCoreScopeValue2061);
        chatCoreScopeValue2058.addEventListener("click", () => {
          const chatCoreScopeValue2062 = String(chatCoreScopeValue2057);
          if (chatCoreScopeValue1697.has(chatCoreScopeValue2062)) chatCoreScopeValue1697["delete"](chatCoreScopeValue2062);else chatCoreScopeValue1697.add(chatCoreScopeValue2062);
          chatCoreScopeValue1703();
        });
      }
      chatCoreScopeValue1687.appendChild(chatCoreScopeValue2058);
    });
    chatCoreScopeValue1688 && (chatCoreScopeValue1688.onclick = () => chatCoreScopeValue1700(chatCoreScopeValue2053.categoryName));
    chatCoreScopeValue1689 && (chatCoreScopeValue1689.onclick = async () => {
      if (!confirm("删除分类 \"" + chatCoreScopeValue2053.categoryName + "\" ?")) return;
      const chatCoreScopeValue2063 = await window.imApp.commitStickersChange(() => {
        window.imData.stickers = (window.imData.stickers || []).filter(chatCoreScopeValue2064 => chatCoreScopeValue2064 !== chatCoreScopeValue2053);
      }, {
        silent: true
      });
      if (!chatCoreScopeValue2063) {
        if (chatCoreScopeValue1591) chatCoreScopeValue1591("分类删除失败");
        return;
      }
      chatCoreScopeValue1693 = "";
      chatCoreScopeValue1696 = false;
      chatCoreScopeValue1697.clear();
      if (chatCoreScopeValue1684 && window.closeView) window.closeView(chatCoreScopeValue1684);
      chatCoreScopeValue1705();
      if (chatCoreScopeValue1591) chatCoreScopeValue1591("已删除分类 \"" + chatCoreScopeValue2053.categoryName + "\"");
    });
  }
  function chatCoreScopeValue1704(chatCoreScopeValue2065) {
    chatCoreScopeValue1693 = String(chatCoreScopeValue2065 || "");
    chatCoreScopeValue1696 = false;
    chatCoreScopeValue1697.clear();
    chatCoreScopeValue1703();
    if (chatCoreScopeValue1684 && window.openView) window.openView(chatCoreScopeValue1684);
  }
  function chatCoreScopeValue1705(chatCoreScopeValue2066) {
    if (!chatCoreScopeValue1675) return;
    !chatCoreScopeValue2066 && (chatCoreScopeValue1696 = false, chatCoreScopeValue1697.clear());
    chatCoreScopeValue1675.innerHTML = "";
    const chatCoreScopeValue2067 = Array.isArray(window.imData.stickers) ? window.imData.stickers : [];
    if (chatCoreScopeValue2067.length === 0) {
      chatCoreScopeValue1675.innerHTML = "<div class=\"stickers-empty-state\"><i class=\"far fa-face-smile\"></i><strong>还没有表情包</strong><span>点击右上角添加第一个分组</span></div>";
      return;
    }
    chatCoreScopeValue2067.forEach(chatCoreScopeValue2068 => {
      if (!chatCoreScopeValue2068) return;
      const chatCoreScopeValue2069 = Array.isArray(chatCoreScopeValue2068.items) ? chatCoreScopeValue2068.items : [],
        chatCoreScopeValue2070 = document.createElement("button");
      chatCoreScopeValue2070.type = "button";
      chatCoreScopeValue2070.className = "sticker-group-card";
      const chatCoreScopeValue2071 = document.createElement("span");
      chatCoreScopeValue2071.className = "sticker-group-preview";
      chatCoreScopeValue2069.slice(0, 4).forEach(chatCoreScopeValue2075 => {
        const chatCoreScopeValue2076 = document.createElement("span");
        chatCoreScopeValue2076.className = "sticker-group-preview-cell";
        if (chatCoreScopeValue2075?.url) {
          const chatCoreScopeValue2077 = document.createElement("img");
          chatCoreScopeValue2077.src = chatCoreScopeValue2075.url;
          chatCoreScopeValue2077.alt = chatCoreScopeValue2075.name || "";
          chatCoreScopeValue2076.appendChild(chatCoreScopeValue2077);
        }
        chatCoreScopeValue2071.appendChild(chatCoreScopeValue2076);
      });
      while (chatCoreScopeValue2071.children.length < 4) {
        const chatCoreScopeValue2078 = document.createElement("span");
        chatCoreScopeValue2078.className = "sticker-group-preview-cell empty";
        chatCoreScopeValue2071.appendChild(chatCoreScopeValue2078);
      }
      const chatCoreScopeValue2072 = document.createElement("span");
      chatCoreScopeValue2072.className = "sticker-group-copy";
      const chatCoreScopeValue2073 = document.createElement("strong");
      chatCoreScopeValue2073.textContent = chatCoreScopeValue2068.categoryName || "未命名分组";
      const chatCoreScopeValue2074 = document.createElement("span");
      chatCoreScopeValue2074.textContent = chatCoreScopeValue2069.length + " 张 · " + chatCoreScopeValue1699(chatCoreScopeValue2068.categoryName).length + " 位角色";
      chatCoreScopeValue2072.appendChild(chatCoreScopeValue2073);
      chatCoreScopeValue2072.appendChild(chatCoreScopeValue2074);
      chatCoreScopeValue2070.appendChild(chatCoreScopeValue2071);
      chatCoreScopeValue2070.appendChild(chatCoreScopeValue2072);
      chatCoreScopeValue2070.addEventListener("click", () => chatCoreScopeValue1704(chatCoreScopeValue2068.categoryName));
      chatCoreScopeValue1675.appendChild(chatCoreScopeValue2070);
    });
    if (chatCoreScopeValue1693 && chatCoreScopeValue1702()) chatCoreScopeValue1703();
  }
  chatCoreScopeValue1691 && chatCoreScopeValue1691.addEventListener("click", async () => {
    const chatCoreScopeValue2079 = chatCoreScopeValue1702();
    if (!chatCoreScopeValue2079 || chatCoreScopeValue1697.size === 0) {
      if (chatCoreScopeValue1591) chatCoreScopeValue1591("请先选择要删除的表情");
      return;
    }
    const chatCoreScopeValue2080 = Array.from(chatCoreScopeValue1697).map(Number).sort((chatCoreScopeValue2082, chatCoreScopeValue2083) => chatCoreScopeValue2083 - chatCoreScopeValue2082),
      chatCoreScopeValue2081 = await window.imApp.commitStickersChange(() => {
        chatCoreScopeValue2080.forEach(chatCoreScopeValue2084 => chatCoreScopeValue2079.items.splice(chatCoreScopeValue2084, 1));
        window.imData.stickers = (window.imData.stickers || []).filter(chatCoreScopeValue2085 => Array.isArray(chatCoreScopeValue2085.items) && chatCoreScopeValue2085.items.length > 0);
      }, {
        silent: true
      });
    if (!chatCoreScopeValue2081) {
      if (chatCoreScopeValue1591) chatCoreScopeValue1591("表情删除失败");
      return;
    }
    chatCoreScopeValue1696 = false;
    chatCoreScopeValue1697.clear();
    if (!chatCoreScopeValue1702()) {
      chatCoreScopeValue1693 = "";
      if (chatCoreScopeValue1684 && window.closeView) window.closeView(chatCoreScopeValue1684);
    }
    chatCoreScopeValue1705();
    if (chatCoreScopeValue1591) chatCoreScopeValue1591("已删除 " + chatCoreScopeValue2080.length + " 张表情");
  });
  chatCoreScopeValue1684 && chatCoreScopeValue1684.addEventListener("click", chatCoreScopeValue2086 => {
    if (chatCoreScopeValue2086.target !== chatCoreScopeValue1684) return;
    chatCoreScopeValue1696 = false;
    chatCoreScopeValue1697.clear();
    if (window.closeView) window.closeView(chatCoreScopeValue1684);
  });
  window.imApp.renderStickersView = chatCoreScopeValue1705;
  const chatCoreScopeValue1706 = document.getElementById("groups-toggle");
  chatCoreScopeValue1706 && chatCoreScopeValue1706.addEventListener("click", () => {
    chatCoreScopeValue1706.parentElement.classList.toggle("collapsed");
  });
  const chatCoreScopeValue1707 = document.getElementById("friends-toggle");
  chatCoreScopeValue1707 && chatCoreScopeValue1707.addEventListener("click", () => {
    chatCoreScopeValue1707.parentElement.classList.toggle("collapsed");
  });
  const chatCoreScopeValue1708 = document.getElementById("npcs-toggle");
  chatCoreScopeValue1708 && chatCoreScopeValue1708.addEventListener("click", () => {
    chatCoreScopeValue1708.parentElement.classList.toggle("collapsed");
  });
  const chatCoreScopeValue1709 = document.getElementById("nav-home-btn");
  const chatCoreScopeValue1710 = document.getElementById("nav-chats-btn");
  const chatCoreScopeValue1711 = document.getElementById("nav-moments-btn");
  const chatCoreScopeValue1712 = document.getElementById("line-nav-indicator");
  const chatCoreScopeValue1713 = document.querySelector(".line-bottom-nav-container");
  const chatCoreScopeValue1714 = document.querySelector(".line-content");
  const chatCoreScopeValue1715 = document.getElementById("chats-content");
  const chatCoreScopeValue1716 = document.getElementById("memory-location-sheet");
  const chatCoreScopeValue1717 = document.getElementById("memory-location-sheet-content");
  const chatCoreScopeValue1718 = document.getElementById("memory-social-close");
  const chatCoreScopeValue1719 = document.getElementById("memory-library-header-title");
  const chatCoreScopeValue1720 = document.getElementById("memory-library-header-subtitle");
  let chatCoreScopeValue1721 = null;
  const chatCoreScopeValue1722 = () => {
    if (!chatCoreScopeValue1716?.classList.contains("active")) return;
    if (window.closeView) window.closeView(chatCoreScopeValue1716);
    if (chatCoreScopeValue1721?.isConnected) chatCoreScopeValue1721.focus({
      preventScroll: true
    });
    chatCoreScopeValue1721 = null;
  };
  chatCoreScopeValue1718?.addEventListener("click", chatCoreScopeValue1722);
  chatCoreScopeValue1716?.addEventListener("click", chatCoreScopeValue2087 => {
    if (chatCoreScopeValue2087.target === chatCoreScopeValue1716) chatCoreScopeValue1722();
  });
  document.addEventListener("keydown", chatCoreScopeValue2088 => {
    if (chatCoreScopeValue2088.key !== "Escape" || !chatCoreScopeValue1716?.classList.contains("active")) return;
    if (document.querySelector("#memory-entry-detail-modal.active, #memory-entry-editor-modal.active, #memory-promotion-preview-modal.active")) return;
    chatCoreScopeValue1722();
  });
  const chatCoreScopeValue1723 = document.getElementById("memory-entry-detail-modal");
  const chatCoreScopeValue1724 = document.getElementById("chat-memory-schedule-modal");
  const chatCoreScopeValue1725 = document.getElementById("chat-memory-schedule-close");
  const chatCoreScopeValue1726 = document.getElementById("chat-memory-schedule-add-modal");
  const chatCoreScopeValue1727 = document.getElementById("memory-entry-detail-title");
  const chatCoreScopeValue1728 = document.getElementById("memory-entry-detail-body");
  const chatCoreScopeValue1729 = document.getElementById("memory-entry-detail-close");
  const chatCoreScopeValue1730 = document.getElementById("memory-entry-editor-modal");
  const chatCoreScopeValue1731 = document.getElementById("memory-entry-editor-title");
  const chatCoreScopeValue1732 = document.getElementById("memory-entry-editor-kind");
  const chatCoreScopeValue1733 = document.getElementById("memory-entry-editor-id");
  const chatCoreScopeValue1734 = document.getElementById("memory-entry-editor-collection");
  const chatCoreScopeValue1735 = document.getElementById("memory-entry-editor-title-input");
  const chatCoreScopeValue1736 = document.getElementById("memory-entry-editor-time-input");
  const chatCoreScopeValue1737 = document.getElementById("memory-entry-editor-content-input");
  const chatCoreScopeValue1738 = document.getElementById("memory-entry-editor-content-label");
  const chatCoreScopeValue1739 = document.getElementById("memory-entry-editor-tags-row");
  const chatCoreScopeValue1740 = document.getElementById("memory-entry-editor-tags-input");
  const chatCoreScopeValue1741 = document.getElementById("memory-entry-editor-degree-row");
  const chatCoreScopeValue1742 = document.getElementById("memory-entry-editor-degree-select");
  const chatCoreScopeValue1743 = document.getElementById("memory-entry-editor-close");
  const chatCoreScopeValue1744 = document.getElementById("memory-entry-editor-cancel");
  const chatCoreScopeValue1745 = document.getElementById("memory-entry-editor-save");
  const chatCoreScopeValue1746 = document.getElementById("memory-promotion-preview-modal");
  const chatCoreScopeValue1747 = document.getElementById("memory-promotion-preview-close");
  const chatCoreScopeValue1748 = document.getElementById("memory-promotion-preview-cancel");
  const chatCoreScopeValue1749 = document.getElementById("memory-promotion-preview-confirm");
  const chatCoreScopeValue1750 = document.getElementById("memory-promotion-title-input");
  const chatCoreScopeValue1751 = document.getElementById("memory-promotion-time-input");
  const chatCoreScopeValue1752 = document.getElementById("memory-promotion-content-input");
  const chatCoreScopeValue1753 = document.getElementById("moments-content");
  let chatCoreScopeValue1754 = null;
  let chatCoreScopeValue1755 = "iphone";
  let chatCoreScopeValue1756 = null;
  let chatCoreScopeValue1757 = null;
  function chatCoreScopeValue1758(chatCoreScopeValue2089) {
    if (!chatCoreScopeValue2089 || !chatCoreScopeValue1712) return;
    const chatCoreScopeValue2090 = chatCoreScopeValue2089.parentElement.getBoundingClientRect(),
      chatCoreScopeValue2091 = chatCoreScopeValue2089.getBoundingClientRect(),
      chatCoreScopeValue2092 = chatCoreScopeValue2091.left - chatCoreScopeValue2090.left,
      chatCoreScopeValue2093 = chatCoreScopeValue2091.width;
    chatCoreScopeValue1712.style.width = chatCoreScopeValue2093 + "px";
    chatCoreScopeValue1712.style.transform = `translateX(${chatCoreScopeValue2092}px)`;
  }
  setTimeout(() => {
    if (chatCoreScopeValue1709 && chatCoreScopeValue1709.classList.contains("active")) chatCoreScopeValue1758(chatCoreScopeValue1709);
  }, 100);
  function chatCoreScopeValue1759() {
    const chatCoreScopeValue2094 = Array.isArray(window.imData?.friends) ? window.imData.friends : [];
    return chatCoreScopeValue2094.filter(chatCoreScopeValue2095 => chatCoreScopeValue2095 && chatCoreScopeValue2095.type !== "group" && chatCoreScopeValue2095.type !== "npc" && chatCoreScopeValue2095.type !== "official");
  }
  function chatCoreScopeValue1760(chatCoreScopeValue2096) {
    return String(chatCoreScopeValue2096 == null ? "" : chatCoreScopeValue2096).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function chatCoreScopeValue1761(chatCoreScopeValue2097) {
    if (!chatCoreScopeValue2097) return;
    chatCoreScopeValue1754 = chatCoreScopeValue2097.id;
  }
  function chatCoreScopeValue1762() {
    chatCoreScopeValue1717 && chatCoreScopeValue1717.innerHTML !== "" && chatCoreScopeValue1783(chatCoreScopeValue1755 || "iphone");
  }
  function chatCoreScopeValue1763() {
    const chatCoreScopeValue2098 = chatCoreScopeValue2125 => {
        const chatCoreScopeValue2126 = /^(\d{2}):(\d{2})$/.exec(String(chatCoreScopeValue2125 || "").trim());
        if (!chatCoreScopeValue2126) return -1;
        const chatCoreScopeValue2127 = Number(chatCoreScopeValue2126[1]),
          chatCoreScopeValue2128 = Number(chatCoreScopeValue2126[2]);
        return chatCoreScopeValue2127 >= 0 && chatCoreScopeValue2127 < 24 && chatCoreScopeValue2128 >= 0 && chatCoreScopeValue2128 < 60 ? chatCoreScopeValue2127 * 60 + chatCoreScopeValue2128 : -1;
      },
      chatCoreScopeValue2099 = (chatCoreScopeValue2129, chatCoreScopeValue2130 = "") => {
        const chatCoreScopeValue2131 = String(chatCoreScopeValue2129 || "").trim();
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(chatCoreScopeValue2131)) return chatCoreScopeValue2131;
        return chatCoreScopeValue2130;
      },
      chatCoreScopeValue2100 = () => {
        const chatCoreScopeValue2132 = new Date();
        chatCoreScopeValue2132.setMinutes(chatCoreScopeValue2132.getMinutes() - chatCoreScopeValue2132.getTimezoneOffset());
        const chatCoreScopeValue2133 = new Date(Date.now() + 3600000);
        return chatCoreScopeValue2133.setMinutes(chatCoreScopeValue2133.getMinutes() - chatCoreScopeValue2133.getTimezoneOffset()), {
          start: chatCoreScopeValue2132.toISOString().slice(0, 16),
          end: chatCoreScopeValue2133.toISOString().slice(0, 16)
        };
      },
      chatCoreScopeValue2101 = chatCoreScopeValue1764();
    if (!chatCoreScopeValue2101) return;
    const chatCoreScopeValue2102 = window.imApp.normalizeFriendData ? window.imApp.normalizeFriendData(chatCoreScopeValue2101) : chatCoreScopeValue2101;
    chatCoreScopeValue2101.memory = chatCoreScopeValue2102.memory || chatCoreScopeValue2101.memory || window.imApp.createDefaultMemory?.() || {};
    !chatCoreScopeValue2101.memory.schedule && (chatCoreScopeValue2101.memory.schedule = window.imApp.createDefaultMemory?.().schedule || {
      enabled: false,
      sleepTime: "23:00",
      wakeTime: "07:00",
      events: []
    });
    const chatCoreScopeValue2103 = document.getElementById("chat-memory-schedule-enabled-toggle"),
      chatCoreScopeValue2104 = document.getElementById("chat-memory-schedule-sleep-text"),
      chatCoreScopeValue2105 = document.getElementById("chat-memory-schedule-wake-text"),
      chatCoreScopeValue2106 = document.getElementById("chat-memory-schedule-sleep-picker"),
      chatCoreScopeValue2107 = document.getElementById("chat-memory-schedule-wake-picker"),
      chatCoreScopeValue2108 = document.getElementById("chat-memory-schedule-timeline"),
      chatCoreScopeValue2109 = document.getElementById("chat-memory-schedule-add-btn"),
      chatCoreScopeValue2110 = document.getElementById("chat-memory-schedule-generate-btn"),
      chatCoreScopeValue2111 = document.getElementById("chat-memory-schedule-editor-title"),
      chatCoreScopeValue2112 = document.getElementById("chat-memory-schedule-add-name"),
      chatCoreScopeValue2113 = document.getElementById("chat-memory-schedule-add-recurrence"),
      chatCoreScopeValue2114 = document.getElementById("chat-memory-schedule-daily-fields"),
      chatCoreScopeValue2115 = document.getElementById("chat-memory-schedule-once-fields"),
      chatCoreScopeValue2116 = document.getElementById("chat-memory-schedule-add-daily-start"),
      chatCoreScopeValue2117 = document.getElementById("chat-memory-schedule-add-daily-end"),
      chatCoreScopeValue2118 = document.getElementById("chat-memory-schedule-add-start"),
      chatCoreScopeValue2119 = document.getElementById("chat-memory-schedule-add-end"),
      chatCoreScopeValue2120 = document.getElementById("chat-memory-schedule-add-confirm-btn"),
      chatCoreScopeValue2121 = document.getElementById("chat-memory-schedule-delete-btn"),
      chatCoreScopeValue2122 = chatCoreScopeValue2101.memory.schedule,
      chatCoreScopeValue2123 = chatCoreScopeValue2134 => {
        const chatCoreScopeValue2135 = chatCoreScopeValue2134 !== "once";
        if (chatCoreScopeValue2113) chatCoreScopeValue2113.value = chatCoreScopeValue2135 ? "daily" : "once";
        if (chatCoreScopeValue2114) chatCoreScopeValue2114.hidden = !chatCoreScopeValue2135;
        if (chatCoreScopeValue2115) chatCoreScopeValue2115.hidden = chatCoreScopeValue2135;
      },
      chatCoreScopeValue2124 = (chatCoreScopeValue2136 = null) => {
        chatCoreScopeValue1756 = chatCoreScopeValue2136 ? String(chatCoreScopeValue2136.id) : null;
        const chatCoreScopeValue2137 = chatCoreScopeValue2136?.recurrence === "once" ? "once" : "daily",
          chatCoreScopeValue2138 = chatCoreScopeValue2100();
        if (chatCoreScopeValue2111) chatCoreScopeValue2111.textContent = chatCoreScopeValue2136 ? "编辑行程" : "添加行程";
        if (chatCoreScopeValue2112) chatCoreScopeValue2112.value = chatCoreScopeValue2136?.name || chatCoreScopeValue2136?.title || "";
        chatCoreScopeValue2123(chatCoreScopeValue2137);
        if (chatCoreScopeValue2116) chatCoreScopeValue2116.value = chatCoreScopeValue2136?.startTime || "09:00";
        if (chatCoreScopeValue2117) chatCoreScopeValue2117.value = chatCoreScopeValue2136?.endTime || "10:00";
        if (chatCoreScopeValue2118) chatCoreScopeValue2118.value = chatCoreScopeValue2099(chatCoreScopeValue2136?.rawTime, chatCoreScopeValue2138.start);
        if (chatCoreScopeValue2119) chatCoreScopeValue2119.value = chatCoreScopeValue2099(chatCoreScopeValue2136?.endAt, chatCoreScopeValue2138.end);
        if (chatCoreScopeValue2121) chatCoreScopeValue2121.hidden = !chatCoreScopeValue2136;
        if (chatCoreScopeValue1726 && window.openView) window.openView(chatCoreScopeValue1726);
      };
    chatCoreScopeValue2103 && (chatCoreScopeValue2103.checked = !!chatCoreScopeValue2122.enabled, chatCoreScopeValue2103.onchange = async chatCoreScopeValue2139 => {
      await window.imApp.commitScopedFriendChange(chatCoreScopeValue2101, chatCoreScopeValue2140 => {
        if (!chatCoreScopeValue2140.memory.schedule) chatCoreScopeValue2140.memory.schedule = {};
        chatCoreScopeValue2140.memory.schedule.enabled = chatCoreScopeValue2139.target.checked;
      }, {
        silent: true
      });
      chatCoreScopeValue1763();
    });
    if (chatCoreScopeValue2110) {
      const chatCoreScopeValue2141 = chatCoreScopeValue2101.type !== "group";
      chatCoreScopeValue2110.hidden = !chatCoreScopeValue2141;
      chatCoreScopeValue2110.onclick = async () => {
        if (!chatCoreScopeValue2141 || !window.imChat?.generateScheduleForFriend) {
          if (window.showToast) window.showToast("仅单个角色可生成日程");
          return;
        }
        const chatCoreScopeValue2142 = chatCoreScopeValue2110.textContent;
        chatCoreScopeValue2110.disabled = true;
        chatCoreScopeValue2110.textContent = "生成中...";
        try {
          const chatCoreScopeValue2143 = await window.imChat.generateScheduleForFriend(chatCoreScopeValue2101);
          !chatCoreScopeValue2143?.success && window.showToast && window.showToast(chatCoreScopeValue2143?.error || "日程生成失败，请稍后重试");
        } finally {
          chatCoreScopeValue2110.disabled = false;
          chatCoreScopeValue2110.textContent = chatCoreScopeValue2142;
          chatCoreScopeValue1763();
        }
      };
    }
    chatCoreScopeValue2113 && (chatCoreScopeValue2113.onchange = () => chatCoreScopeValue2123(chatCoreScopeValue2113.value));
    chatCoreScopeValue2109 && (chatCoreScopeValue2109.onclick = () => chatCoreScopeValue2124());
    chatCoreScopeValue2120 && (chatCoreScopeValue2120.onclick = async () => {
      const chatCoreScopeValue2144 = chatCoreScopeValue2112 ? chatCoreScopeValue2112.value.trim() : "",
        chatCoreScopeValue2145 = chatCoreScopeValue2113?.value === "once" ? "once" : "daily",
        chatCoreScopeValue2146 = Array.isArray(chatCoreScopeValue2122.events) ? chatCoreScopeValue2122.events.find(chatCoreScopeValue2148 => String(chatCoreScopeValue2148.id) === String(chatCoreScopeValue1756)) : null;
      if (!chatCoreScopeValue2144) {
        if (window.showToast) window.showToast("请输入行程名称");
        return;
      }
      let chatCoreScopeValue2147;
      if (chatCoreScopeValue2145 === "daily") {
        const chatCoreScopeValue2149 = chatCoreScopeValue2116?.value || "",
          chatCoreScopeValue2150 = chatCoreScopeValue2117?.value || "";
        if (chatCoreScopeValue2098(chatCoreScopeValue2149) < 0 || chatCoreScopeValue2098(chatCoreScopeValue2150) < 0) {
          if (window.showToast) window.showToast("请输入有效的开始和结束时间");
          return;
        }
        if (chatCoreScopeValue2098(chatCoreScopeValue2150) <= chatCoreScopeValue2098(chatCoreScopeValue2149)) {
          if (window.showToast) window.showToast("每天重复的结束时间必须晚于开始时间");
          return;
        }
        chatCoreScopeValue2147 = {
          id: chatCoreScopeValue2146?.id ?? "schedule-" + Date.now(),
          name: chatCoreScopeValue2144,
          title: chatCoreScopeValue2144,
          startTime: chatCoreScopeValue2149,
          endTime: chatCoreScopeValue2150,
          recurrence: "daily",
          source: chatCoreScopeValue2146?.source === "generated" ? "manual" : chatCoreScopeValue2146?.source || "manual",
          timestamp: chatCoreScopeValue2146?.timestamp || Date.now()
        };
      } else {
        const chatCoreScopeValue2151 = chatCoreScopeValue2118?.value || "",
          chatCoreScopeValue2152 = chatCoreScopeValue2119?.value || "";
        if (!chatCoreScopeValue2151 || !chatCoreScopeValue2152 || new Date(chatCoreScopeValue2151) >= new Date(chatCoreScopeValue2152)) {
          if (window.showToast) window.showToast("结束时间必须晚于开始时间");
          return;
        }
        const chatCoreScopeValue2153 = new Date(chatCoreScopeValue2151),
          chatCoreScopeValue2154 = new Date(chatCoreScopeValue2152);
        chatCoreScopeValue2147 = {
          id: chatCoreScopeValue2146?.id ?? "schedule-" + Date.now(),
          name: chatCoreScopeValue2144,
          title: chatCoreScopeValue2144,
          date: chatCoreScopeValue2153.getFullYear() + "-" + String(chatCoreScopeValue2153.getMonth() + 1).padStart(2, "0") + "-" + String(chatCoreScopeValue2153.getDate()).padStart(2, "0"),
          startTime: String(chatCoreScopeValue2153.getHours()).padStart(2, "0") + ":" + String(chatCoreScopeValue2153.getMinutes()).padStart(2, "0"),
          endTime: String(chatCoreScopeValue2154.getHours()).padStart(2, "0") + ":" + String(chatCoreScopeValue2154.getMinutes()).padStart(2, "0"),
          rawTime: chatCoreScopeValue2151,
          endAt: chatCoreScopeValue2152,
          recurrence: "once",
          source: chatCoreScopeValue2146?.source === "generated" ? "manual" : chatCoreScopeValue2146?.source || "manual",
          timestamp: chatCoreScopeValue2146?.timestamp || Date.now()
        };
      }
      await window.imApp.commitScopedFriendChange(chatCoreScopeValue2101, chatCoreScopeValue2155 => {
        chatCoreScopeValue2155.memory = chatCoreScopeValue2155.memory || window.imApp.createDefaultMemory();
        const chatCoreScopeValue2156 = chatCoreScopeValue2155.memory.schedule || window.imApp.createDefaultMemory().schedule,
          chatCoreScopeValue2157 = Array.isArray(chatCoreScopeValue2156.events) ? chatCoreScopeValue2156.events.slice() : [],
          chatCoreScopeValue2158 = chatCoreScopeValue2157.findIndex(chatCoreScopeValue2159 => String(chatCoreScopeValue2159?.id) === String(chatCoreScopeValue1756));
        if (chatCoreScopeValue2158 >= 0) chatCoreScopeValue2157.splice(chatCoreScopeValue2158, 1, chatCoreScopeValue2147);else chatCoreScopeValue2157.push(chatCoreScopeValue2147);
        chatCoreScopeValue2155.memory.schedule = window.imDataUtils?.normalizeSchedule ? window.imDataUtils.normalizeSchedule({
          ...chatCoreScopeValue2156,
          events: chatCoreScopeValue2157
        }) : {
          ...chatCoreScopeValue2156,
          events: chatCoreScopeValue2157
        };
      }, {
        silent: true
      });
      chatCoreScopeValue1756 = null;
      if (chatCoreScopeValue1726 && window.closeView) window.closeView(chatCoreScopeValue1726);
      chatCoreScopeValue1763();
    });
    chatCoreScopeValue2121 && (chatCoreScopeValue2121.onclick = () => {
      const chatCoreScopeValue2160 = chatCoreScopeValue1756;
      if (chatCoreScopeValue2160 == null) return;
      const chatCoreScopeValue2161 = async () => {
        await window.imApp.commitScopedFriendChange(chatCoreScopeValue2101, chatCoreScopeValue2162 => {
          const chatCoreScopeValue2163 = chatCoreScopeValue2162.memory?.schedule || window.imApp.createDefaultMemory().schedule;
          chatCoreScopeValue2162.memory = chatCoreScopeValue2162.memory || window.imApp.createDefaultMemory();
          chatCoreScopeValue2162.memory.schedule = window.imDataUtils?.normalizeSchedule ? window.imDataUtils.normalizeSchedule({
            ...chatCoreScopeValue2163,
            events: (chatCoreScopeValue2163.events || []).filter(chatCoreScopeValue2164 => String(chatCoreScopeValue2164?.id) !== String(chatCoreScopeValue2160))
          }) : {
            ...chatCoreScopeValue2163,
            events: (chatCoreScopeValue2163.events || []).filter(chatCoreScopeValue2165 => String(chatCoreScopeValue2165?.id) !== String(chatCoreScopeValue2160))
          };
        }, {
          silent: true
        });
        chatCoreScopeValue1756 = null;
        if (chatCoreScopeValue1726 && window.closeView) window.closeView(chatCoreScopeValue1726);
        chatCoreScopeValue1763();
      };
      window.imApp.showCustomModal ? window.imApp.showCustomModal({
        title: "删除行程",
        message: "确定删除这条行程吗？",
        isDestructive: true,
        confirmText: "删除",
        onConfirm: chatCoreScopeValue2161
      }) : void chatCoreScopeValue2161();
    });
    chatCoreScopeValue2104 && chatCoreScopeValue2106 && (chatCoreScopeValue2104.textContent = chatCoreScopeValue2122.sleepTime || "23:00", chatCoreScopeValue2106.value = chatCoreScopeValue2122.sleepTime || "23:00", chatCoreScopeValue2106.onchange = async chatCoreScopeValue2166 => {
      chatCoreScopeValue2104.textContent = chatCoreScopeValue2166.target.value;
      await window.imApp.commitScopedFriendChange(chatCoreScopeValue2101, chatCoreScopeValue2167 => {
        if (!chatCoreScopeValue2167.memory.schedule) chatCoreScopeValue2167.memory.schedule = {};
        chatCoreScopeValue2167.memory.schedule.sleepTime = chatCoreScopeValue2166.target.value;
      }, {
        silent: true
      });
      chatCoreScopeValue1763();
    });
    chatCoreScopeValue2105 && chatCoreScopeValue2107 && (chatCoreScopeValue2105.textContent = chatCoreScopeValue2122.wakeTime || "07:00", chatCoreScopeValue2107.value = chatCoreScopeValue2122.wakeTime || "07:00", chatCoreScopeValue2107.onchange = async chatCoreScopeValue2168 => {
      chatCoreScopeValue2105.textContent = chatCoreScopeValue2168.target.value;
      await window.imApp.commitScopedFriendChange(chatCoreScopeValue2101, chatCoreScopeValue2169 => {
        if (!chatCoreScopeValue2169.memory.schedule) chatCoreScopeValue2169.memory.schedule = {};
        chatCoreScopeValue2169.memory.schedule.wakeTime = chatCoreScopeValue2168.target.value;
      }, {
        silent: true
      });
      chatCoreScopeValue1763();
    });
    if (chatCoreScopeValue2108) {
      const chatCoreScopeValue2170 = chatCoreScopeValue2122.wakeTime || "07:00",
        chatCoreScopeValue2171 = chatCoreScopeValue2122.sleepTime || "23:00",
        chatCoreScopeValue2172 = Array.isArray(chatCoreScopeValue2122.events) ? chatCoreScopeValue2122.events : [];
      let chatCoreScopeValue2173 = "<div style=\"position: absolute; left: 24px; top: 10px; bottom: 10px; width: 2px; background: #e5e5ea; z-index: 1;\"></div>";
      chatCoreScopeValue2173 += `
                <div style="position: relative; z-index: 2; display: flex; align-items: flex-start;">
                    <div style="width: 10px; height: 10px; border-radius: 50%; background: #007aff; margin-right: 15px; margin-top: 5px;  flex-shrink: 0;"></div>
                    <div>
                        <div style="font-size: 16px; font-weight: 600; color: #111;">起床</div>
                        <div style="font-size: 13px; color: #8e8e93; margin-top: 2px;">` + chatCoreScopeValue2170 + ` - 开启新的一天</div>
                    </div>
                </div>
            `;
      chatCoreScopeValue2172.forEach(chatCoreScopeValue2175 => {
        chatCoreScopeValue2173 += `
                    <div style="position: relative; z-index: 2; display: flex; align-items: flex-start;">
                        <div style="width: 10px; height: 10px; border-radius: 50%; background: #8e8e93; margin-right: 15px; margin-top: 15px;  flex-shrink: 0;"></div>
                        <div class="schedule-event-card" data-event-id="` + chatCoreScopeValue2175.id + `" style="background: #f2f2f7; border-radius: 16px; padding: 12px 16px; flex: 1; cursor: pointer; ">
                            <div style="font-size: 15px; font-weight: 600; color: #111;">` + chatCoreScopeValue1760(chatCoreScopeValue2175.name || chatCoreScopeValue2175.title || "未命名行程") + `</div>
                            <div style="font-size: 13px; color: #8e8e93; margin-top: 4px;">` + chatCoreScopeValue1760(chatCoreScopeValue2175.time || ((chatCoreScopeValue2175.date || "") + " " + (chatCoreScopeValue2175.startTime || "")).trim()) + `</div>
                        </div>
                    </div>
                `;
      });
      chatCoreScopeValue2173 += `
                <div style="position: relative; z-index: 2; display: flex; align-items: flex-start;">
                    <div style="width: 10px; height: 10px; border-radius: 50%; background: #5856d6; margin-right: 15px; margin-top: 5px;  flex-shrink: 0;"></div>
                    <div>
                        <div style="font-size: 16px; font-weight: 600; color: #111;">睡觉</div>
                        <div style="font-size: 13px; color: #8e8e93; margin-top: 2px;">` + chatCoreScopeValue2171 + ` - 休息时间到了</div>
                    </div>
                </div>
            `;
      chatCoreScopeValue2108.innerHTML = chatCoreScopeValue2173;
      const chatCoreScopeValue2174 = chatCoreScopeValue2108.querySelectorAll(".schedule-event-card");
      chatCoreScopeValue2174.forEach(chatCoreScopeValue2176 => {
        chatCoreScopeValue2176.addEventListener("click", () => {
          const chatCoreScopeValue2177 = chatCoreScopeValue2176.getAttribute("data-event-id"),
            chatCoreScopeValue2178 = chatCoreScopeValue2172.find(chatCoreScopeValue2179 => String(chatCoreScopeValue2179.id) === String(chatCoreScopeValue2177));
          if (chatCoreScopeValue2178) chatCoreScopeValue2124(chatCoreScopeValue2178);
        });
      });
    }
  }
  function chatCoreScopeValue1764() {
    const chatCoreScopeValue2180 = Array.isArray(window.imData?.friends) ? window.imData.friends : [],
      chatCoreScopeValue2181 = chatCoreScopeValue2180.find(chatCoreScopeValue2182 => String(chatCoreScopeValue2182.id) === String(chatCoreScopeValue1754));
    if (chatCoreScopeValue2181) return chatCoreScopeValue2181;
    return chatCoreScopeValue1759()[0] || null;
  }
  function chatCoreScopeValue1765(chatCoreScopeValue2183 = new Date()) {
    return window.imDataUtils?.formatUsDateTime ? window.imDataUtils.formatUsDateTime(chatCoreScopeValue2183) : chatCoreScopeValue2183.toLocaleString("en-US", {
      hour12: true
    });
  }
  function chatCoreScopeValue1766(chatCoreScopeValue2184) {
    if (window.imChat?.normalizeMemoryTriggerKeywords) return window.imChat.normalizeMemoryTriggerKeywords(chatCoreScopeValue2184);
    return String(chatCoreScopeValue2184 || "").split(/[,，、；;\n|/]+/).map(chatCoreScopeValue2185 => chatCoreScopeValue2185.trim()).filter(Boolean).slice(0, 12);
  }
  function chatCoreScopeValue1767(chatCoreScopeValue2186, chatCoreScopeValue2187) {
    const chatCoreScopeValue2188 = chatCoreScopeValue2186?.memory || {};
    return Array.isArray(chatCoreScopeValue2188[chatCoreScopeValue2187]) ? chatCoreScopeValue2188[chatCoreScopeValue2187] : [];
  }
  function chatCoreScopeValue1768(chatCoreNewScope2204, chatCoreNewScope2205, chatCoreNewScope2206) {
    return chatCoreScopeValue1767(chatCoreNewScope2204, chatCoreNewScope2205).find(chatCoreScopeValue2216 => String(chatCoreScopeValue2216?.["id"]) === String(chatCoreNewScope2206)) || null;
  }
  function chatCoreScopeValue1769() {
    if (chatCoreScopeValue1730 && window.closeView) window.closeView(chatCoreScopeValue1730);
  }
  function chatCoreNewScope1783(chatCoreNewScope2208, chatCoreNewScope2209 = 30) {
    const chatCoreNewScope2210 = Math.round(Number(chatCoreNewScope2208));
    return Number.isFinite(chatCoreNewScope2210) && chatCoreNewScope2210 > 0 ? Math.min(100, Math.max(1, chatCoreNewScope2210)) : chatCoreNewScope2209;
  }
  async function chatCoreNewScope1784(chatCoreNewScope2211, chatCoreNewScope2212) {
    const chatCoreNewScope2213 = chatCoreScopeValue1764();
    if (!chatCoreNewScope2213) return false;
    const chatCoreNewScope2214 = window.imApp.normalizeFriendData(chatCoreNewScope2213),
      chatCoreNewScope2215 = chatCoreNewScope2214.memory?.["recallLimits"]?.[chatCoreNewScope2211] || 30,
      chatCoreNewScope2216 = chatCoreNewScope1783(chatCoreNewScope2212, chatCoreNewScope2215),
      chatCoreNewScope2217 = await window.imApp.commitScopedFriendChange(chatCoreNewScope2213, chatCoreNewScope2218 => {
        chatCoreNewScope2218.memory = window.imApp.normalizeFriendData(chatCoreNewScope2218).memory, chatCoreNewScope2218.memory.recallLimits = window.imApp.normalizeMemoryRecallLimits({
          ...chatCoreNewScope2218.memory.recallLimits,
          [chatCoreNewScope2211]: chatCoreNewScope2216
        }), chatCoreNewScope2218.memory.recallPresentation = null, window.imApp.clearFriendRuntimeMessageContext?.(chatCoreNewScope2218);
      }, {
        silent: true,
        immediate: true,
        syncActive: true,
        syncSettings: true
      });
    if (!chatCoreNewScope2217) {
      if (window.showToast) window.showToast("读取条数保存失败");
      return false;
    }
    return window.dispatchEvent(new CustomEvent("u2:memory-entries-updated", {
      detail: {
        friendId: String(chatCoreNewScope2213.id),
        action: "recall-limit",
        kind: chatCoreNewScope2211,
        limit: chatCoreNewScope2216
      }
    })), chatCoreScopeValue1783(chatCoreScopeValue1755), true;
  }
  function chatCoreScopeValue1772() {
    chatCoreScopeValue1757 = null;
    if (chatCoreScopeValue1746 && window.closeView) window.closeView(chatCoreScopeValue1746);
  }
  function chatCoreScopeValue1773(chatCoreNewScope2219, chatCoreNewScope2220, chatCoreNewScope2221) {
    if (!chatCoreScopeValue1746) return;
    chatCoreScopeValue1757 = {
      friendId: String(chatCoreNewScope2219.id),
      selectedIds: chatCoreNewScope2220.map(String)
    };
    if (chatCoreScopeValue1750) chatCoreScopeValue1750.value = chatCoreNewScope2221.title || "";
    if (chatCoreScopeValue1751) chatCoreScopeValue1751.value = chatCoreNewScope2221.time || "";
    if (chatCoreScopeValue1752) chatCoreScopeValue1752.value = chatCoreNewScope2221.content || "";
    if (window.openView) window.openView(chatCoreScopeValue1746);
  }
  async function chatCoreScopeValue1774() {
    const chatCoreNewScope2222 = chatCoreScopeValue1757;
    if (!chatCoreNewScope2222) return false;
    const chatCoreNewScope2223 = window.imApp.getFriendById?.(chatCoreNewScope2222.friendId) || chatCoreScopeValue1764(),
      chatCoreNewScope2224 = String(chatCoreScopeValue1750?.["value"] || "").trim(),
      chatCoreNewScope2225 = String(chatCoreScopeValue1752?.["value"] || "").trim(),
      chatCoreNewScope2226 = String(chatCoreScopeValue1751?.["value"] || "").trim();
    if (!chatCoreNewScope2224 || !chatCoreNewScope2225) {
      if (window.showToast) window.showToast("请填写标题和内容");
      return false;
    }
    if (!chatCoreNewScope2223 || !window.imApp.commitShortTermMemoryPromotion) return false;
    chatCoreScopeValue1749 && (chatCoreScopeValue1749.disabled = true, chatCoreScopeValue1749.textContent = "保存中...");
    try {
      const chatCoreNewScope2227 = await window.imApp.commitShortTermMemoryPromotion(chatCoreNewScope2223, {
        title: chatCoreNewScope2224,
        content: chatCoreNewScope2225,
        time: chatCoreNewScope2226
      }, chatCoreNewScope2222.selectedIds);
      if (!chatCoreNewScope2227) {
        if (window.showToast) window.showToast("长期记忆保存失败，短期记忆未删除");
        return false;
      }
      chatCoreScopeValue1772();
      chatCoreScopeValue1783("iphone");
      chatCoreScopeValue1762();
      if (window.showToast) window.showToast("已归纳为长期记忆");
      return true;
    } finally {
      chatCoreScopeValue1749 && (chatCoreScopeValue1749.disabled = false, chatCoreScopeValue1749.textContent = "确认归纳并删除原短期记忆");
    }
  }
  async function chatCoreNewScope1788(chatCoreNewScope2228, chatCoreNewScope2229) {
    const chatCoreNewScope2230 = (Array.isArray(chatCoreNewScope2228?.["memory"]?.["shortTermEntries"]) ? chatCoreNewScope2228.memory.shortTermEntries : []).filter(chatCoreNewScope2231 => chatCoreNewScope2229.includes(String(chatCoreNewScope2231?.["id"] || "")));
    if (chatCoreNewScope2230.length === 0 || chatCoreNewScope2230.length !== chatCoreNewScope2229.length) {
      if (window.showToast) window.showToast("所选短期记忆已变更，请重新选择");
      chatCoreScopeValue1783("iphone");
      return;
    }
    if (!window.imApp.generateShortTermMemoryPromotionDraft) {
      if (window.showToast) window.showToast("归纳功能尚未初始化");
      return;
    }
    try {
      if (window.showToast) window.showToast("正在归纳长期记忆...");
      const chatCoreScopeValue2217 = await window.imApp.generateShortTermMemoryPromotionDraft(chatCoreNewScope2228, chatCoreNewScope2230);
      chatCoreScopeValue1773(chatCoreNewScope2228, chatCoreNewScope2229, chatCoreScopeValue2217);
    } catch (chatCoreScopeValue2218) {
      console.error("Short-term memory promotion failed", chatCoreScopeValue2218);
      const chatCoreScopeValue2219 = chatCoreScopeValue2218?.summaryFailure?.message || chatCoreScopeValue2218?.message || "归纳失败，请检查 API 配置";
      if (window.showToast) window.showToast("归纳失败：" + chatCoreScopeValue2219);
    }
  }
  function chatCoreScopeValue1776(chatCoreScopeValue2220, chatCoreScopeValue2221 = null, chatCoreScopeValue2222 = "") {
    if (!chatCoreScopeValue1730) return;
    const chatCoreScopeValue2223 = chatCoreScopeValue2220 === "short",
      chatCoreScopeValue2224 = chatCoreScopeValue2222 || (chatCoreScopeValue2223 ? "shortTermEntries" : "longTermEntries"),
      chatCoreScopeValue2225 = chatCoreScopeValue2221?.time || chatCoreScopeValue2221?.createdAt || chatCoreScopeValue1765(),
      chatCoreScopeValue2226 = chatCoreScopeValue2223 ? window.imChat?.getShortTermMemoryTags ? window.imChat.getShortTermMemoryTags(chatCoreScopeValue2221 || {}) : chatCoreScopeValue2221?.memoryTags || chatCoreScopeValue2221?.triggerKeywords || [] : [];
    if (chatCoreScopeValue1731) chatCoreScopeValue1731.textContent = chatCoreScopeValue2221 ? "编辑" + (chatCoreScopeValue2223 ? "短期" : "长期") + "记忆" : "新增" + (chatCoreScopeValue2223 ? "短期" : "长期") + "记忆";
    if (chatCoreScopeValue1732) chatCoreScopeValue1732.value = chatCoreScopeValue2220;
    if (chatCoreScopeValue1733) chatCoreScopeValue1733.value = chatCoreScopeValue2221?.id == null ? "" : String(chatCoreScopeValue2221.id);
    if (chatCoreScopeValue1734) chatCoreScopeValue1734.value = chatCoreScopeValue2224;
    if (chatCoreScopeValue1735) chatCoreScopeValue1735.value = chatCoreScopeValue2221?.title || "";
    if (chatCoreScopeValue1736) chatCoreScopeValue1736.value = chatCoreScopeValue2225;
    if (chatCoreScopeValue1737) chatCoreScopeValue1737.value = chatCoreScopeValue2223 ? chatCoreScopeValue2221?.event || chatCoreScopeValue2221?.content || "" : chatCoreScopeValue2221?.content || "";
    if (chatCoreScopeValue1738) chatCoreScopeValue1738.textContent = chatCoreScopeValue2223 ? "事件内容" : "记忆内容";
    if (chatCoreScopeValue1739) chatCoreScopeValue1739.style.display = chatCoreScopeValue2223 ? "flex" : "none";
    if (chatCoreScopeValue1740) chatCoreScopeValue1740.value = Array.isArray(chatCoreScopeValue2226) ? chatCoreScopeValue2226.join("，") : "";
    if (chatCoreScopeValue1741) chatCoreScopeValue1741.style.display = chatCoreScopeValue2223 ? "flex" : "none";
    if (chatCoreScopeValue1742) chatCoreScopeValue1742.value = chatCoreScopeValue2221?.degree || "高";
    if (window.openView) window.openView(chatCoreScopeValue1730);
  }
  async function chatCoreScopeValue1777() {
    const chatCoreScopeValue2227 = chatCoreScopeValue1764();
    if (!chatCoreScopeValue2227) return false;
    const chatCoreScopeValue2228 = chatCoreScopeValue1732?.value === "long" ? "long" : "short",
      chatCoreScopeValue2229 = chatCoreScopeValue2228 === "short",
      chatCoreScopeValue2230 = chatCoreScopeValue1734?.value || (chatCoreScopeValue2229 ? "shortTermEntries" : "longTermEntries"),
      chatCoreScopeValue2231 = String(chatCoreScopeValue1733?.value || ""),
      chatCoreScopeValue2232 = String(chatCoreScopeValue1735?.value || "").trim() || (chatCoreScopeValue2229 ? "手动记忆" : "长期记忆"),
      chatCoreScopeValue2233 = String(chatCoreScopeValue1736?.value || "").trim() || chatCoreScopeValue1765(),
      chatCoreScopeValue2234 = String(chatCoreScopeValue1737?.value || "").trim(),
      chatCoreScopeValue2235 = chatCoreScopeValue2229 ? chatCoreScopeValue1766(chatCoreScopeValue1740?.value || "") : [];
    if (!chatCoreScopeValue2234) {
      if (window.showToast) window.showToast("请输入记忆内容");
      return chatCoreScopeValue1737?.focus(), false;
    }
    const chatCoreScopeValue2236 = chatCoreScopeValue2231 || (chatCoreScopeValue2229 ? "manual-stm" : "manual-ltm") + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      chatCoreScopeValue2237 = await window.imApp.commitScopedFriendChange(chatCoreScopeValue2227, chatCoreScopeValue2238 => {
        chatCoreScopeValue2238.memory = window.imApp.normalizeFriendData(chatCoreScopeValue2238).memory;
        if (!Array.isArray(chatCoreScopeValue2238.memory[chatCoreScopeValue2230])) chatCoreScopeValue2238.memory[chatCoreScopeValue2230] = [];
        const chatCoreScopeValue2239 = chatCoreScopeValue2238.memory[chatCoreScopeValue2230],
          chatCoreScopeValue2240 = chatCoreScopeValue2239.findIndex(chatCoreScopeValue2243 => String(chatCoreScopeValue2243?.id) === chatCoreScopeValue2236),
          chatCoreScopeValue2241 = chatCoreScopeValue2240 >= 0 ? chatCoreScopeValue2239[chatCoreScopeValue2240] : null;
        let chatCoreScopeValue2242;
        chatCoreScopeValue2229 ? chatCoreScopeValue2242 = {
          ...(chatCoreScopeValue2241 || {}),
          id: chatCoreScopeValue2236,
          title: chatCoreScopeValue2232,
          time: chatCoreScopeValue2233,
          event: chatCoreScopeValue2234,
          memoryTags: chatCoreScopeValue2235,
          triggerKeywords: chatCoreScopeValue2235,
          degree: chatCoreScopeValue1742?.value || chatCoreScopeValue2241?.degree || "高",
          lastActivatedAt: chatCoreScopeValue2241?.lastActivatedAt || chatCoreScopeValue2233,
          sourceType: chatCoreScopeValue2241?.sourceType || "manual",
          sourceId: chatCoreScopeValue2241?.sourceId || chatCoreScopeValue2236
        } : chatCoreScopeValue2242 = {
          ...(chatCoreScopeValue2241 || {}),
          id: chatCoreScopeValue2236,
          title: chatCoreScopeValue2232,
          content: chatCoreScopeValue2234,
          time: chatCoreScopeValue2233,
          createdAt: chatCoreScopeValue2233,
          sourceType: chatCoreScopeValue2241?.sourceType || "manual",
          sourceId: chatCoreScopeValue2241?.sourceId || chatCoreScopeValue2236
        };
        if (chatCoreScopeValue2240 >= 0) chatCoreScopeValue2239[chatCoreScopeValue2240] = chatCoreScopeValue2242;else chatCoreScopeValue2239.push(chatCoreScopeValue2242);
        chatCoreScopeValue2238.memory.recallPresentation = null;
        window.imApp.clearFriendRuntimeMessageContext?.(chatCoreScopeValue2238);
      }, {
        silent: true,
        syncActive: true,
        syncSettings: true
      });
    if (!chatCoreScopeValue2237) {
      if (window.showToast) window.showToast("记忆保存失败");
      return false;
    }
    chatCoreScopeValue1769();
    chatCoreScopeValue1783(chatCoreScopeValue1755);
    chatCoreScopeValue1762();
    window.dispatchEvent(new CustomEvent("u2:memory-entries-updated", {
      detail: {
        friendId: String(chatCoreScopeValue2227.id),
        action: "upsert",
        collection: chatCoreScopeValue2230,
        entryId: chatCoreScopeValue2236
      }
    }));
    if (window.showToast) window.showToast(chatCoreScopeValue2231 ? "记忆已更新" : "记忆已添加");
    return true;
  }
  async function chatCoreScopeValue1778(chatCoreScopeValue2244, chatCoreScopeValue2245, chatCoreScopeValue2246 = {}) {
    if (!chatCoreScopeValue2244) return false;
    const chatCoreScopeValue2247 = chatCoreScopeValue1764();
    if (!chatCoreScopeValue2247) return false;
    const chatCoreScopeValue2248 = await window.imApp.commitScopedFriendChange(chatCoreScopeValue2247, chatCoreScopeValue2249 => {
      chatCoreScopeValue2249.memory = window.imApp.normalizeFriendData(chatCoreScopeValue2249).memory;
      const chatCoreScopeValue2250 = Array.isArray(chatCoreScopeValue2249.memory[chatCoreScopeValue2245]) ? chatCoreScopeValue2249.memory[chatCoreScopeValue2245] : [];
      chatCoreScopeValue2249.memory[chatCoreScopeValue2245] = chatCoreScopeValue2250.filter(chatCoreScopeValue2251 => String(chatCoreScopeValue2251?.id) !== String(chatCoreScopeValue2244.id));
      if (chatCoreScopeValue2245 === "shortTermEntries") {
        const chatCoreScopeValue2252 = chatCoreScopeValue2249.memory.shortTermEntries.reduce((chatCoreScopeValue2255, chatCoreScopeValue2256) => {
            const chatCoreScopeValue2257 = Math.max(0, Number(chatCoreScopeValue2256?.sourceEndMessageCount) || 0),
              chatCoreScopeValue2258 = Math.max(0, Number(chatCoreScopeValue2255?.sourceEndMessageCount) || 0);
            return chatCoreScopeValue2257 >= chatCoreScopeValue2258 ? chatCoreScopeValue2256 : chatCoreScopeValue2255;
          }, null),
          chatCoreScopeValue2253 = Math.max(0, Number(chatCoreScopeValue2252?.sourceEndMessageCount) || 0),
          chatCoreScopeValue2254 = Array.isArray(chatCoreScopeValue2252?.sourceMessageIds) ? chatCoreScopeValue2252.sourceMessageIds : [];
        chatCoreScopeValue2249.memory.lastSummaryMessageCount = chatCoreScopeValue2253;
        chatCoreScopeValue2249.memory.summaryCursor = {
          messageId: String(chatCoreScopeValue2252?.sourceEndMessageId || chatCoreScopeValue2254[chatCoreScopeValue2254.length - 1] || "").trim(),
          order: Number.isFinite(Number(chatCoreScopeValue2252?.sourceEndMessageOrder)) ? Number(chatCoreScopeValue2252.sourceEndMessageOrder) : -1,
          count: chatCoreScopeValue2253
        };
      }
      chatCoreScopeValue2249.memory.recallPresentation = null;
      window.imApp.clearFriendRuntimeMessageContext?.(chatCoreScopeValue2249);
    }, {
      silent: true,
      syncActive: true,
      syncSettings: true
    });
    if (!chatCoreScopeValue2248) return false;
    if (chatCoreScopeValue2246.closeDetail && chatCoreScopeValue1723 && window.closeView) window.closeView(chatCoreScopeValue1723);
    return chatCoreScopeValue1783(chatCoreScopeValue1755), chatCoreScopeValue1762(), window.dispatchEvent(new CustomEvent("u2:memory-entries-updated", {
      detail: {
        friendId: String(chatCoreScopeValue2247.id),
        action: "delete",
        collection: chatCoreScopeValue2245,
        entryId: String(chatCoreScopeValue2244.id)
      }
    })), true;
  }
  function chatCoreScopeValue1779(chatCoreScopeValue2259, chatCoreScopeValue2260, chatCoreScopeValue2261 = {}) {
    const chatCoreScopeValue2262 = async () => {
        const chatCoreScopeValue2264 = await chatCoreScopeValue1778(chatCoreScopeValue2259, chatCoreScopeValue2260, chatCoreScopeValue2261);
        if (window.showToast) window.showToast(chatCoreScopeValue2264 ? "记忆已删除" : "删除失败");
      },
      chatCoreScopeValue2263 = chatCoreScopeValue2260 === "shortTermEntries" ? "短期记忆" : "长期记忆";
    if (window.showCustomModal) window.showCustomModal({
      title: "删除" + chatCoreScopeValue2263,
      message: "确定彻底删除这条记忆吗？删除后无法恢复。",
      confirmText: "删除",
      isDestructive: true,
      onConfirm: chatCoreScopeValue2262
    });else window.confirm("确定彻底删除这条记忆吗？") && chatCoreScopeValue2262();
  }
  async function chatCoreScopeValue1780(chatCoreScopeValue2265, chatCoreScopeValue2266 = {}) {
    if (!chatCoreScopeValue2265) return false;
    const chatCoreScopeValue2267 = chatCoreScopeValue1764();
    if (!chatCoreScopeValue2267) return false;
    const chatCoreScopeValue2268 = await window.imApp.commitScopedFriendChange(chatCoreScopeValue2267, chatCoreScopeValue2269 => {
      if (!chatCoreScopeValue2269) return;
      chatCoreScopeValue2269.memory = chatCoreScopeValue2269.memory || window.imApp.createDefaultMemory();
      if (!Array.isArray(chatCoreScopeValue2269.memory.shortTermEntries)) chatCoreScopeValue2269.memory.shortTermEntries = [];
      const chatCoreScopeValue2270 = Array.isArray(chatCoreScopeValue2269.memory.shortTermEntries) ? chatCoreScopeValue2269.memory.shortTermEntries : [];
      chatCoreScopeValue2269.memory.shortTermEntries = window.imDataUtils?.removeShortTermSummaryEntry ? window.imDataUtils.removeShortTermSummaryEntry(chatCoreScopeValue2270, chatCoreScopeValue2265.id) : chatCoreScopeValue2270.filter(chatCoreScopeValue2272 => !chatCoreScopeValue2272 || String(chatCoreScopeValue2272.id) !== String(chatCoreScopeValue2265.id));
      const chatCoreScopeValue2271 = chatCoreScopeValue2269.memory.recallPresentation?.recall?.shortTermEntries;
      Array.isArray(chatCoreScopeValue2271) && chatCoreScopeValue2271.some(chatCoreScopeValue2273 => String(chatCoreScopeValue2273?.id) === String(chatCoreScopeValue2265.id)) && (chatCoreScopeValue2269.memory.recallPresentation = null);
      window.imApp.clearFriendRuntimeMessageContext && window.imApp.clearFriendRuntimeMessageContext(chatCoreScopeValue2269);
    }, {
      silent: true
    });
    if (!chatCoreScopeValue2268) return false;
    return chatCoreScopeValue2266.closeDetail && window.closeView && chatCoreScopeValue1723 && window.closeView(chatCoreScopeValue1723), chatCoreScopeValue1783("iphone"), chatCoreScopeValue1762(), window.dispatchEvent(new CustomEvent("u2:memory-entries-updated", {
      detail: {
        friendId: String(chatCoreScopeValue2267.id),
        action: "delete",
        collection: "shortTermEntries",
        entryId: String(chatCoreScopeValue2265.id)
      }
    })), true;
  }
  function chatCoreScopeValue1781(chatCoreScopeValue2274, chatCoreScopeValue2275 = {}) {
    const chatCoreScopeValue2276 = async () => {
      const chatCoreScopeValue2277 = await chatCoreScopeValue1780(chatCoreScopeValue2274, chatCoreScopeValue2275);
      if (window.showToast) window.showToast(chatCoreScopeValue2277 ? "已删除短期记忆" : "删除失败");
    };
    if (window.showCustomModal) {
      window.showCustomModal({
        title: "删除已总结记录",
        message: "确定彻底删除这条已总结记录吗？这会同时从角色记忆上下文中移除，无法恢复。",
        confirmText: "删除",
        isDestructive: true,
        onConfirm: chatCoreScopeValue2276
      });
      return;
    }
    window.confirm("确定彻底删除这条已总结记录吗？这会同时从角色记忆上下文中移除，无法恢复。") && chatCoreScopeValue2276();
  }
  function chatCoreScopeValue1782(chatCoreScopeValue2278, chatCoreScopeValue2279 = "short", chatCoreScopeValue2280 = "shortTermEntries") {
    if (!chatCoreScopeValue2278 || !chatCoreScopeValue1723 || !chatCoreScopeValue1728) return;
    if (chatCoreScopeValue1727) chatCoreScopeValue1727.textContent = chatCoreScopeValue2278.title || "记忆详情";
    const chatCoreScopeValue2281 = chatCoreScopeValue2279 === "short",
      chatCoreScopeValue2282 = chatCoreScopeValue2281 ? window.imChat?.getShortTermMemoryTags ? window.imChat.getShortTermMemoryTags(chatCoreScopeValue2278) : Array.isArray(chatCoreScopeValue2278.memoryTags) ? chatCoreScopeValue2278.memoryTags : [] : [];
    chatCoreScopeValue1728.innerHTML = `
            <div class="memory-entry-field">
                <div class="memory-entry-field-label">时间</div>
                <div class="memory-entry-field-value">` + chatCoreScopeValue1760(chatCoreScopeValue2278.time || chatCoreScopeValue2278.createdAt || "") + `</div>
            </div>
            <div class="memory-entry-field">
                <div class="memory-entry-field-label">` + (chatCoreScopeValue2281 ? "事件" : "内容") + `</div>
                <div class="memory-entry-field-value">` + chatCoreScopeValue1760(chatCoreScopeValue2281 ? chatCoreScopeValue2278.event || chatCoreScopeValue2278.content || "" : chatCoreScopeValue2278.content || "") + `</div>
            </div>
            ` + (chatCoreScopeValue2281 ? `<div class="memory-entry-field">
                <div class="memory-entry-field-label">记忆标签</div>
                <div class="memory-entry-field-value" style="display:flex; flex-wrap:wrap; gap:6px;">` + (chatCoreScopeValue2282.length > 0 ? chatCoreScopeValue2282.map(chatCoreScopeValue2285 => "<span style=\"padding:3px 8px; border-radius:999px; background:#e8f2ff; color:#007aff; font-size:12px; font-weight:600;\">" + chatCoreScopeValue1760(chatCoreScopeValue2285) + "</span>").join("") : "暂无标签") + `</div>
            </div>` : "") + `
            ` + (chatCoreScopeValue2281 ? `<div class="memory-entry-field">
                <div class="memory-entry-field-label">记忆程度</div>
                <div class="memory-entry-field-value">` + chatCoreScopeValue1760(chatCoreScopeValue2278.degree || "高") + `</div>
            </div>` : "") + `
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:20px;">
                <button type="button" id="memory-entry-detail-edit-btn" style="width:100%; padding:12px; border-radius:12px; background:#e8f2ff; color:#007aff; border:none; font-size:15px; font-weight:600; cursor:pointer;">
                    <i class="fas fa-pen"></i> 编辑
                </button>
                <button type="button" id="memory-entry-detail-delete-btn" style="width: 100%; padding: 12px; border-radius: 12px; background: #ffe5e5; color: #ff3b30; border: none; font-size: 15px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                    <i class="fas fa-trash-alt"></i> 删除这条记忆
                </button>
            </div>
        `;
    const chatCoreScopeValue2283 = document.getElementById("memory-entry-detail-edit-btn");
    chatCoreScopeValue2283 && chatCoreScopeValue2283.addEventListener("click", () => {
      if (window.closeView) window.closeView(chatCoreScopeValue1723);
      chatCoreScopeValue1776(chatCoreScopeValue2279, chatCoreScopeValue2278, chatCoreScopeValue2280);
    });
    const chatCoreScopeValue2284 = document.getElementById("memory-entry-detail-delete-btn");
    chatCoreScopeValue2284 && chatCoreScopeValue2284.addEventListener("click", () => {
      chatCoreScopeValue1779(chatCoreScopeValue2278, chatCoreScopeValue2280, {
        closeDetail: true
      });
    });
    if (window.openView) window.openView(chatCoreScopeValue1723);
  }
  function chatCoreScopeValue1783(chatCoreScopeValue2286) {
    if (!chatCoreScopeValue1717) return;
    chatCoreScopeValue2286 = chatCoreScopeValue2286 || "iphone";
    chatCoreScopeValue1755 = chatCoreScopeValue2286;
    const chatCoreScopeValue2287 = chatCoreScopeValue2286 === "x-dm",
      chatCoreScopeValue2288 = chatCoreScopeValue2286 === "iphone" || chatCoreScopeValue2286 === "downloads";
    chatCoreScopeValue1716?.classList.toggle("memory-social-centered", chatCoreScopeValue2287);
    chatCoreScopeValue1716?.classList.toggle("memory-library-centered", chatCoreScopeValue2288);
    const chatCoreScopeValue2289 = chatCoreScopeValue1716?.querySelector(".memory-location-bottom-sheet");
    chatCoreScopeValue2287 || chatCoreScopeValue2288 ? (chatCoreScopeValue2289?.setAttribute("role", "dialog"), chatCoreScopeValue2289?.setAttribute("aria-modal", "true"), chatCoreScopeValue2289?.setAttribute("aria-label", chatCoreScopeValue2287 ? "社交帐号" : chatCoreScopeValue2286 === "downloads" ? "长期记忆" : "短期记忆")) : (chatCoreScopeValue2289?.removeAttribute("role"), chatCoreScopeValue2289?.removeAttribute("aria-modal"), chatCoreScopeValue2289?.removeAttribute("aria-label"));
    if (chatCoreScopeValue1718) chatCoreScopeValue1718.setAttribute("aria-label", chatCoreScopeValue2287 ? "关闭社交帐号" : "关闭记忆弹窗");
    if (chatCoreScopeValue1719) chatCoreScopeValue1719.textContent = chatCoreScopeValue2286 === "downloads" ? "长期记忆" : "短期记忆";
    const chatCoreScopeValue2290 = chatCoreScopeValue1764(),
      chatCoreScopeValue2291 = chatCoreScopeValue2290 ? window.imApp.normalizeFriendData(chatCoreScopeValue2290) : null;
    if (chatCoreScopeValue1720 && chatCoreScopeValue2288) {
      const chatCoreScopeValue2299 = chatCoreScopeValue2291?.type === "group",
        chatCoreScopeValue2300 = chatCoreScopeValue2286 === "downloads" ? (chatCoreScopeValue2291?.memory?.longTermEntries?.length || 0) + (chatCoreScopeValue2291?.memory?.cherishedEntries?.length || 0) + (!chatCoreScopeValue2299 && String(chatCoreScopeValue2291?.memory?.longTerm || "").trim() ? 1 : 0) : chatCoreScopeValue2291?.memory?.shortTermEntries?.length || 0;
      chatCoreScopeValue1720.textContent = chatCoreScopeValue2286 === "downloads" ? chatCoreScopeValue2299 ? chatCoreScopeValue2300 + " 条记录 · 手动长期记忆每轮常驻" : chatCoreScopeValue2300 + " 条记录 · 线上聊天每轮常驻" : chatCoreScopeValue2300 + " 条记录 · 关键词优先，启用向量记忆时补充语义";
    }
    const chatCoreScopeValue2292 = (chatCoreScopeValue2301, chatCoreScopeValue2302) => {
        if (!chatCoreScopeValue2302) return "";
        const chatCoreScopeValue2303 = window.imChat?.getShortTermMemoryTags?.(chatCoreScopeValue2301) || chatCoreScopeValue2301?.memoryTags || [],
          chatCoreScopeValue2304 = (Array.isArray(chatCoreScopeValue2303) ? chatCoreScopeValue2303 : []).map(chatCoreScopeValue2305 => String(chatCoreScopeValue2305 || "").trim()).filter(Boolean);
        if (!chatCoreScopeValue2304.length) return "";
        return "<div class=\"memory-short-tags\">" + chatCoreScopeValue2304.slice(0, 3).map(chatCoreScopeValue2306 => "<span>" + chatCoreScopeValue1760(chatCoreScopeValue2306) + "</span>").join("") + (chatCoreScopeValue2304.length > 3 ? "<span>+" + (chatCoreScopeValue2304.length - 3) + "</span>" : "") + "</div>";
      },
      chatCoreScopeValue2293 = chatCoreScopeValue2307 => chatCoreScopeValue1760(String(chatCoreScopeValue2307 || "").trim().slice(0, 140));
    if (chatCoreScopeValue2286 === "x-dm") {
      if (!chatCoreScopeValue2291 || chatCoreScopeValue2291.type !== "char") {
        chatCoreScopeValue1717.innerHTML = `
                    <div class="memory-sheet-title">社交帐号</div>
                    <div class="memory-short-list">
                        <div class="memory-short-empty">仅支持 iMessage 单聊 Char 关联社交帐号。</div>
                    </div>
                `;
        return;
      }
      const chatCoreScopeValue2308 = window.imApp.normalizeXDirectMessageMount(chatCoreScopeValue2291.memory?.xDirectMessageMount),
        chatCoreScopeValue2309 = window.imApp.getXDirectMessageMountCandidates(chatCoreScopeValue2291),
        chatCoreScopeValue2310 = chatCoreScopeValue2309.find(chatCoreScopeValue2322 => chatCoreScopeValue2322.id === chatCoreScopeValue2308.dmId) || (!chatCoreScopeValue2308.dmId ? chatCoreScopeValue2309[0] : null),
        chatCoreScopeValue2311 = Boolean(chatCoreScopeValue2308.dmId && !chatCoreScopeValue2310),
        chatCoreScopeValue2312 = chatCoreScopeValue2310 ? "" + chatCoreScopeValue2310.name + (chatCoreScopeValue2310.handle ? " · " + chatCoreScopeValue2310.handle : "") : "",
        chatCoreScopeValue2313 = {
          ...chatCoreScopeValue2308,
          dmId: chatCoreScopeValue2310?.id || chatCoreScopeValue2308.dmId
        },
        chatCoreScopeValue2314 = window.imApp.normalizeBstagePopMount(chatCoreScopeValue2291.memory?.bstagePopMount),
        chatCoreScopeValue2315 = window.imApp.getBstagePopMountCandidates(),
        chatCoreScopeValue2316 = window.imApp.getMountedBstagePopMember(chatCoreScopeValue2291),
        chatCoreScopeValue2317 = Boolean(chatCoreScopeValue2314.teamId && chatCoreScopeValue2314.memberId && !chatCoreScopeValue2316),
        chatCoreScopeValue2318 = chatCoreScopeValue2315.find(chatCoreScopeValue2323 => chatCoreScopeValue2323.sourceFriendId === String(chatCoreScopeValue2291.id)),
        chatCoreScopeValue2319 = chatCoreScopeValue2318 ? [chatCoreScopeValue2318, ...chatCoreScopeValue2315.filter(chatCoreScopeValue2324 => chatCoreScopeValue2324 !== chatCoreScopeValue2318)] : chatCoreScopeValue2315;
      chatCoreScopeValue1717.innerHTML = `
                <div class="memory-sheet-title">社交帐号</div>
                <p class="memory-social-intro">关联同一 Char 的活动，仅在生成回复时参考；两边聊天记录保持独立。</p>
                <div class="memory-social-list">
                    <section class="memory-social-card">
                        <div class="memory-social-row">
                            <span class="memory-social-mark memory-social-mark-x"><i class="fab fa-x-twitter"></i></span>
                            <span class="memory-social-main"><strong>X</strong><small>` + (chatCoreScopeValue2310 ? chatCoreScopeValue1760(chatCoreScopeValue2312) : chatCoreScopeValue2311 ? "关联已失效" : "暂无对应私信") + `</small></span>
                            <input id="memory-x-dm-enabled" type="checkbox" aria-label="开启 X 社交帐号上下文" ` + (chatCoreScopeValue2308.enabled ? "checked" : "") + " " + (chatCoreScopeValue2310 ? "" : "disabled") + `>
                        </div>
                        <div class="memory-social-detail">参考 X 私信、User 帖子和 Char 主页帖子。</div>
                        <label class="memory-social-setting">每类参考条数 <input id="memory-x-dm-limit" type="number" min="1" max="50" step="1" value="` + chatCoreScopeValue2308.limit + `" aria-label="X 社交帐号每类上下文条数"> <span>条/类</span></label>
                        ` + (chatCoreScopeValue2309.length === 0 ? "<div class=\"memory-social-note\">请先在 X 中从 iMessage 导入该 Char 并创建私信。</div>" : "") + `
                    </section>
                    <section class="memory-social-card">
                        <div class="memory-social-row">
                            <span class="memory-social-mark memory-social-mark-pop">P</span>
                            <span class="memory-social-main"><strong>Bstage POP</strong><small>` + (chatCoreScopeValue2316 ? chatCoreScopeValue1760(chatCoreScopeValue2316.name + " · " + chatCoreScopeValue2316.teamName) : chatCoreScopeValue2317 ? "关联已失效，请重新选择 Char" : "未关联 Char") + `</small></span>
                            <input id="memory-bstage-pop-enabled" type="checkbox" aria-label="开启 Bstage POP 记忆互通" ` + (chatCoreScopeValue2314.enabled ? "checked" : "") + " " + (chatCoreScopeValue2316 ? "" : "disabled") + `>
                        </div>
                        <div class="memory-social-detail">仅互通 Char 自己的近期内容；不读取 POP 粉丝发言。</div>
                        <label class="memory-social-select-label" for="memory-bstage-pop-select">关联 Char</label>
                        <select id="memory-bstage-pop-select" aria-label="选择 Bstage POP Char">
                            <option value="">请选择 Char</option>
                            ` + chatCoreScopeValue2319.map((chatCoreScopeValue2325, chatCoreScopeValue2326) => "<option value=\"" + chatCoreScopeValue2326 + "\" " + (chatCoreScopeValue2316 && chatCoreScopeValue2325.teamId === chatCoreScopeValue2316.teamId && chatCoreScopeValue2325.memberId === chatCoreScopeValue2316.memberId ? "selected" : "") + ">" + chatCoreScopeValue1760(chatCoreScopeValue2325.name + " · " + chatCoreScopeValue2325.teamName + (chatCoreScopeValue2325 === chatCoreScopeValue2318 ? "（从此 Char 拉取）" : "")) + "</option>").join("") + `
                        </select>
                        ` + (chatCoreScopeValue2315.length === 0 ? "<div class=\"memory-social-note\">请先在 Bstage 从 iMessage 拉取该 Char，或创建 Char 成员。</div>" : "") + `
                    </section>
                </div>
            `;
      const chatCoreScopeValue2320 = async chatCoreScopeValue2327 => {
        const chatCoreScopeValue2328 = await window.imApp.commitScopedFriendChange(chatCoreScopeValue2290, chatCoreScopeValue2329 => {
          chatCoreScopeValue2329.memory = window.imApp.normalizeFriendData(chatCoreScopeValue2329).memory;
          chatCoreScopeValue2329.memory.xDirectMessageMount = window.imApp.normalizeXDirectMessageMount(chatCoreScopeValue2327);
        }, {
          silent: true,
          syncActive: true,
          syncSettings: true
        });
        if (!chatCoreScopeValue2328) {
          if (window.showToast) window.showToast("X 社交帐号上下文保存失败");
          return false;
        }
        return window.dispatchEvent(new CustomEvent("u2:memory-entries-updated", {
          detail: {
            friendId: String(chatCoreScopeValue2290.id),
            action: "x-dm-mount"
          }
        })), chatCoreScopeValue1783("x-dm"), true;
      };
      chatCoreScopeValue1717.querySelector("#memory-x-dm-enabled")?.addEventListener("change", chatCoreScopeValue2330 => {
        chatCoreScopeValue2320({
          ...chatCoreScopeValue2313,
          enabled: chatCoreScopeValue2330.target.checked
        });
      });
      chatCoreScopeValue1717.querySelector("#memory-x-dm-limit")?.addEventListener("change", chatCoreScopeValue2331 => {
        chatCoreScopeValue2320({
          ...chatCoreScopeValue2313,
          limit: chatCoreScopeValue2331.target.value
        });
      });
      const chatCoreScopeValue2321 = async chatCoreScopeValue2332 => {
        const chatCoreScopeValue2333 = await window.imApp.commitScopedFriendChange(chatCoreScopeValue2290, chatCoreScopeValue2334 => {
          chatCoreScopeValue2334.memory = window.imApp.normalizeFriendData(chatCoreScopeValue2334).memory;
          chatCoreScopeValue2334.memory.bstagePopMount = window.imApp.normalizeBstagePopMount(chatCoreScopeValue2332);
        }, {
          silent: true,
          syncActive: true,
          syncSettings: true
        });
        if (!chatCoreScopeValue2333) {
          if (window.showToast) window.showToast("Bstage POP 关联保存失败");
          return;
        }
        window.dispatchEvent(new CustomEvent("u2:memory-entries-updated", {
          detail: {
            friendId: String(chatCoreScopeValue2290.id),
            action: "bstage-pop-mount"
          }
        }));
        chatCoreScopeValue1783("x-dm");
      };
      chatCoreScopeValue1717.querySelector("#memory-bstage-pop-select")?.addEventListener("change", chatCoreScopeValue2335 => {
        const chatCoreScopeValue2336 = chatCoreScopeValue2335.target.value === "" ? null : chatCoreScopeValue2319[Number(chatCoreScopeValue2335.target.value)];
        chatCoreScopeValue2321(chatCoreScopeValue2336 ? {
          enabled: true,
          teamId: chatCoreScopeValue2336.teamId,
          memberId: chatCoreScopeValue2336.memberId
        } : {
          enabled: false,
          teamId: "",
          memberId: ""
        });
      });
      chatCoreScopeValue1717.querySelector("#memory-bstage-pop-enabled")?.addEventListener("change", chatCoreScopeValue2337 => {
        chatCoreScopeValue2321({
          ...chatCoreScopeValue2314,
          enabled: chatCoreScopeValue2337.target.checked
        });
      });
      return;
    }
    if (chatCoreScopeValue2286 === "downloads") {
      const chatCoreScopeValue2338 = Array.isArray(chatCoreScopeValue2291?.memory?.longTermEntries) ? chatCoreScopeValue2291.memory.longTermEntries.map(chatCoreScopeValue2341 => ({
          entry: chatCoreScopeValue2341,
          collection: "longTermEntries"
        })) : [],
        chatCoreScopeValue2339 = Array.isArray(chatCoreScopeValue2291?.memory?.cherishedEntries) ? chatCoreScopeValue2291.memory.cherishedEntries.map(chatCoreScopeValue2342 => ({
          entry: chatCoreScopeValue2342,
          collection: "cherishedEntries"
        })) : [],
        chatCoreScopeValue2340 = [...chatCoreScopeValue2338, ...chatCoreScopeValue2339];
      chatCoreScopeValue1717.innerHTML = `
                <div class="memory-sheet-title-row">
                    <div class="memory-library-section-label">全部记忆</div>
                    <button type="button" class="memory-sheet-add-btn" data-memory-add-kind="long" aria-label="新增长期记忆"><i class="fas fa-plus"></i></button>
                </div>
                <div class="memory-short-list">
                    ` + (chatCoreScopeValue2340.length === 0 && (chatCoreScopeValue2291?.type === "group" || !chatCoreScopeValue2291?.memory?.longTerm) ? "<div class=\"memory-short-empty\">暂无长期记忆</div>" : chatCoreScopeValue2340.slice().reverse().map(({
        entry: chatCoreScopeValue2343,
        collection: chatCoreScopeValue2344
      }) => `
                        <div class="memory-short-item memory-long-summary-item" role="button" tabindex="0" data-memory-entry-id="` + chatCoreScopeValue1760(chatCoreScopeValue2343.id) + "\" data-memory-collection=\"" + chatCoreScopeValue2344 + `">
                            <div class="memory-short-main">
                                <div class="memory-short-summary-title">` + chatCoreScopeValue1760(chatCoreScopeValue2343.title || "长期记忆") + `</div>
                                <div class="memory-short-meta"><span>` + (chatCoreScopeValue2344 === "cherishedEntries" ? "珍视回忆" : "长期记忆") + "</span><span>" + (chatCoreScopeValue2291?.type === "group" && (chatCoreScopeValue2344 === "cherishedEntries" || String(chatCoreScopeValue2343.sourceType || "") !== "manual") ? "不注入群聊" : "每轮常驻") + "</span>" + (chatCoreScopeValue2343.time || chatCoreScopeValue2343.createdAt ? "<span>" + chatCoreScopeValue1760(chatCoreScopeValue2343.time || chatCoreScopeValue2343.createdAt) + "</span>" : "") + `</div>
                                <div class="memory-short-preview">` + chatCoreScopeValue2293(chatCoreScopeValue2343.content || chatCoreScopeValue2343.detail || chatCoreScopeValue2343.reason) + `</div>
                            </div>
                            <div class="memory-short-actions">
                                <button type="button" class="memory-short-delete-btn" aria-label="删除长期记忆"><i class="fas fa-trash-alt"></i></button>
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                    `).join("")) + `
                    ` + (chatCoreScopeValue2291?.type !== "group" && chatCoreScopeValue2291?.memory?.longTerm ? "<div class=\"memory-short-item memory-legacy-item\"><div class=\"memory-short-main\"><div class=\"memory-short-summary-title\">旧版长期记忆文本</div><div class=\"memory-short-meta\">每轮常驻</div><div class=\"memory-short-preview\">" + chatCoreScopeValue2293(chatCoreScopeValue2291.memory.longTerm) + "</div></div></div>" : "") + `
                </div>
            `;
      chatCoreScopeValue1717.querySelector("[data-memory-add-kind=\"long\"]")?.addEventListener("click", () => chatCoreScopeValue1776("long"));
      chatCoreScopeValue1717.querySelectorAll(".memory-long-summary-item").forEach(chatCoreScopeValue2345 => {
        const chatCoreScopeValue2346 = () => {
          const chatCoreScopeValue2347 = chatCoreScopeValue2345.getAttribute("data-memory-entry-id"),
            chatCoreScopeValue2348 = chatCoreScopeValue2345.getAttribute("data-memory-collection") || "longTermEntries";
          return {
            collection: chatCoreScopeValue2348,
            entry: chatCoreScopeValue1768(chatCoreScopeValue1764(), chatCoreScopeValue2348, chatCoreScopeValue2347)
          };
        };
        chatCoreScopeValue2345.addEventListener("click", chatCoreScopeValue2349 => {
          if (chatCoreScopeValue2349.target instanceof Element && chatCoreScopeValue2349.target.closest(".memory-short-delete-btn")) return;
          const chatCoreScopeValue2350 = chatCoreScopeValue2346();
          if (chatCoreScopeValue2350.entry) chatCoreScopeValue1782(chatCoreScopeValue2350.entry, "long", chatCoreScopeValue2350.collection);
        });
        chatCoreScopeValue2345.querySelector(".memory-short-delete-btn")?.addEventListener("click", chatCoreScopeValue2351 => {
          chatCoreScopeValue2351.preventDefault();
          chatCoreScopeValue2351.stopPropagation();
          const chatCoreScopeValue2352 = chatCoreScopeValue2346();
          if (chatCoreScopeValue2352.entry) chatCoreScopeValue1779(chatCoreScopeValue2352.entry, chatCoreScopeValue2352.collection);
        });
      });
      return;
    }
    if (chatCoreScopeValue2286 !== "iphone") {
      chatCoreScopeValue1717.innerHTML = "";
      return;
    }
    const chatCoreScopeValue2294 = Array.isArray(chatCoreScopeValue2291?.["memory"]?.["shortTermEntries"]) ? chatCoreScopeValue2291.memory.shortTermEntries : [];
    chatCoreScopeValue1717.innerHTML = "\n            <div class=\"memory-sheet-title-row\">\n                <div class=\"memory-library-section-label\">记忆条目</div>\n                <div class=\"memory-sheet-toolbar\">\n                    <button type=\"button\" class=\"memory-sheet-text-btn\" data-memory-select-all>全选</button>\n                    <button type=\"button\" class=\"memory-sheet-add-btn\" data-memory-add-kind=\"short\" aria-label=\"新增短期记忆\"><i class=\"fas fa-plus\"></i></button>\n                </div>\n            </div>\n            <div class=\"memory-recall-limit-row\">\n                <span>本轮最多召回 <small>关键词优先，语义补充</small></span>\n                <input type=\"number\" min=\"1\" max=\"100\" step=\"1\" value=\"" + chatCoreScopeValue1760(chatCoreScopeValue2291.memory?.["recallLimits"]?.["shortTerm"] || 30) + "\" data-memory-recall-limit=\"shortTerm\" aria-label=\"短期记忆读取条数\">\n            </div>\n            <div class=\"memory-short-list\">\n                " + (chatCoreScopeValue2294.length === 0 ? "<div class=\"memory-short-empty\">暂无短期记忆</div>" : chatCoreScopeValue2294.slice().reverse().map(chatCoreScopeValue2353 => "\n                    <div class=\"memory-short-item memory-short-summary-item\" role=\"button\" tabindex=\"0\" data-memory-entry-id=\"" + chatCoreScopeValue1760(chatCoreScopeValue2353.id) + "\">\n                        <input type=\"checkbox\" class=\"memory-short-select\" data-memory-select-id=\"" + chatCoreScopeValue1760(chatCoreScopeValue2353.id) + "\" aria-label=\"选择" + chatCoreScopeValue1760(chatCoreScopeValue2353.title || "短期记忆") + "\">\n                        <div class=\"memory-short-main\">\n                            <div class=\"memory-short-summary-title\">" + chatCoreScopeValue1760(chatCoreScopeValue2353.title || "对话总结") + "</div>\n                            <div class=\"memory-short-meta\"><span>" + chatCoreScopeValue1760(chatCoreScopeValue2353.degree || "高") + "权重</span>" + (chatCoreScopeValue2353.time || chatCoreScopeValue2353.createdAt ? "<span>" + chatCoreScopeValue1760(chatCoreScopeValue2353.time || chatCoreScopeValue2353.createdAt) + "</span>" : "") + "</div>\n                            <div class=\"memory-short-preview\">" + chatCoreScopeValue2293(chatCoreScopeValue2353.event || chatCoreScopeValue2353.content) + "</div>\n                            " + chatCoreScopeValue2292(chatCoreScopeValue2353, true) + "\n                        </div>\n                        <div class=\"memory-short-actions\">\n                            <button type=\"button\" class=\"memory-short-delete-btn\" aria-label=\"删除已总结记录\" title=\"删除已总结记录\"><i class=\"fas fa-trash-alt\"></i></button>\n                            <i class=\"fas fa-chevron-right\"></i>\n                        </div>\n                    </div>\n                ").join("")) + "\n            </div>\n            <button type=\"button\" class=\"memory-promotion-btn\" data-memory-promote disabled>归纳为长期记忆</button>\n        ", chatCoreScopeValue1717.querySelector("[data-memory-recall-limit=\"shortTerm\"]")?.["addEventListener"]("change", chatCoreScopeValue2354 => {
      void chatCoreNewScope1784("shortTerm", chatCoreScopeValue2354.target.value);
    }), chatCoreScopeValue1717.querySelector("[data-memory-add-kind=\"short\"]")?.["addEventListener"]("click", () => chatCoreScopeValue1776("short"));
    const chatCoreScopeValue2295 = new Set(),
      chatCoreScopeValue2296 = chatCoreScopeValue1717.querySelector("[data-memory-select-all]"),
      chatCoreScopeValue2297 = chatCoreScopeValue1717.querySelector("[data-memory-promote]"),
      chatCoreScopeValue2298 = () => {
        const chatCoreScopeValue2355 = chatCoreScopeValue2294.length > 0 && chatCoreScopeValue2295.size === chatCoreScopeValue2294.length;
        if (chatCoreScopeValue2296) chatCoreScopeValue2296.textContent = chatCoreScopeValue2355 ? "取消全选" : "全选";
        if (chatCoreScopeValue2297) {
          const chatCoreScopeValue2356 = chatCoreScopeValue2297.dataset.memoryPromoting === "true";
          if (chatCoreScopeValue2356) {
            chatCoreScopeValue2297.disabled = true;
            chatCoreScopeValue2297.textContent = "正在归纳...";
            return;
          }
          chatCoreScopeValue2297.disabled = chatCoreScopeValue2295.size === 0;
          chatCoreScopeValue2297.textContent = chatCoreScopeValue2295.size > 0 ? "归纳 " + chatCoreScopeValue2295.size + " 条为长期记忆" : "归纳为长期记忆";
        }
      };
    chatCoreScopeValue2296?.addEventListener("click", chatCoreScopeValue2357 => {
      chatCoreScopeValue2357.preventDefault();
      const chatCoreScopeValue2358 = chatCoreScopeValue2295.size !== chatCoreScopeValue2294.length;
      chatCoreScopeValue1717.querySelectorAll(".memory-short-select").forEach(chatCoreScopeValue2359 => {
        chatCoreScopeValue2359.checked = chatCoreScopeValue2358;
        const chatCoreScopeValue2360 = String(chatCoreScopeValue2359.getAttribute("data-memory-select-id") || "");
        if (chatCoreScopeValue2358) chatCoreScopeValue2295.add(chatCoreScopeValue2360);else chatCoreScopeValue2295["delete"](chatCoreScopeValue2360);
      });
      chatCoreScopeValue2298();
    });
    chatCoreScopeValue2297?.addEventListener("click", async () => {
      if (chatCoreScopeValue2297.dataset.memoryPromoting === "true" || chatCoreScopeValue2295.size === 0) return;
      chatCoreScopeValue2297.dataset.memoryPromoting = "true";
      chatCoreScopeValue2297.setAttribute("aria-busy", "true");
      chatCoreScopeValue2298();
      try {
        await chatCoreNewScope1788(chatCoreScopeValue2291, Array.from(chatCoreScopeValue2295));
      } finally {
        delete chatCoreScopeValue2297.dataset.memoryPromoting;
        chatCoreScopeValue2297.removeAttribute("aria-busy");
        if (chatCoreScopeValue2297.isConnected) chatCoreScopeValue2298();
      }
    });
    chatCoreScopeValue1717.querySelectorAll(".memory-short-summary-item").forEach(chatCoreScopeValue2361 => {
      const chatCoreScopeValue2362 = () => {
        const chatCoreScopeValue2365 = chatCoreScopeValue2361.getAttribute("data-memory-entry-id"),
          chatCoreScopeValue2366 = chatCoreScopeValue2294.find(chatCoreScopeValue2367 => String(chatCoreScopeValue2367.id) === String(chatCoreScopeValue2365));
        if (chatCoreScopeValue2366) chatCoreScopeValue1782(chatCoreScopeValue2366);
      };
      chatCoreScopeValue2361.addEventListener("click", chatCoreScopeValue2368 => {
        const chatCoreScopeValue2369 = chatCoreScopeValue2368.target instanceof Element ? chatCoreScopeValue2368.target : null;
        if (chatCoreScopeValue2369?.closest(".memory-short-delete-btn")) return;
        if (chatCoreScopeValue2369?.closest(".memory-short-select")) return;
        chatCoreScopeValue2362();
      });
      chatCoreScopeValue2361.addEventListener("keydown", chatCoreScopeValue2370 => {
        const chatCoreScopeValue2371 = chatCoreScopeValue2370.target instanceof Element ? chatCoreScopeValue2370.target : null;
        if (chatCoreScopeValue2371?.closest(".memory-short-delete-btn")) return;
        if (chatCoreScopeValue2371?.closest(".memory-short-select")) return;
        (chatCoreScopeValue2370.key === "Enter" || chatCoreScopeValue2370.key === " ") && (chatCoreScopeValue2370.preventDefault(), chatCoreScopeValue2362());
      });
      const chatCoreScopeValue2363 = chatCoreScopeValue2361.querySelector(".memory-short-delete-btn");
      chatCoreScopeValue2363 && chatCoreScopeValue2363.addEventListener("click", chatCoreScopeValue2372 => {
        chatCoreScopeValue2372.preventDefault();
        chatCoreScopeValue2372.stopPropagation();
        const chatCoreScopeValue2373 = chatCoreScopeValue2361.getAttribute("data-memory-entry-id"),
          chatCoreScopeValue2374 = chatCoreScopeValue2294.find(chatCoreScopeValue2375 => String(chatCoreScopeValue2375.id) === String(chatCoreScopeValue2373));
        if (chatCoreScopeValue2374) chatCoreScopeValue1779(chatCoreScopeValue2374, "shortTermEntries");
      });
      const chatCoreScopeValue2364 = chatCoreScopeValue2361.querySelector(".memory-short-select");
      chatCoreScopeValue2364?.addEventListener("change", () => {
        const chatCoreScopeValue2376 = String(chatCoreScopeValue2364.getAttribute("data-memory-select-id") || "");
        if (chatCoreScopeValue2364.checked) chatCoreScopeValue2295.add(chatCoreScopeValue2376);else chatCoreScopeValue2295["delete"](chatCoreScopeValue2376);
        chatCoreScopeValue2298();
      });
    });
  }
  window.imApp.openMemoryLocationForFriend = function (chatCoreScopeValue2377, chatCoreScopeValue2378) {
    const chatCoreScopeValue2379 = window.imApp.getFriendById ? window.imApp.getFriendById(chatCoreScopeValue2377) : (window.imData.friends || []).find(chatCoreScopeValue2380 => String(chatCoreScopeValue2380.id) === String(chatCoreScopeValue2377?.id ?? chatCoreScopeValue2377));
    if (!chatCoreScopeValue2379) return false;
    if (!chatCoreScopeValue1716?.classList.contains("active")) chatCoreScopeValue1721 = document.activeElement;
    chatCoreScopeValue1761(chatCoreScopeValue2379);
    chatCoreScopeValue1783(chatCoreScopeValue2378);
    if (chatCoreScopeValue1716 && window.openView) return window.openView(chatCoreScopeValue1716), chatCoreScopeValue1718?.focus({
      preventScroll: true
    }), true;
    return false;
  };
  window.imApp.openMemoryScheduleForFriend = function (chatCoreScopeValue2381) {
    const chatCoreScopeValue2382 = window.imApp.getFriendById ? window.imApp.getFriendById(chatCoreScopeValue2381) : (window.imData.friends || []).find(chatCoreScopeValue2383 => String(chatCoreScopeValue2383.id) === String(chatCoreScopeValue2381?.id ?? chatCoreScopeValue2381));
    if (!chatCoreScopeValue2382) return false;
    chatCoreScopeValue1761(chatCoreScopeValue2382);
    if (chatCoreScopeValue1724 && window.openView) return chatCoreScopeValue1763(), window.openView(chatCoreScopeValue1724), true;
    return false;
  }, window.imApp.getCurrentMemoryFriend = chatCoreScopeValue1764, window.imApp.refreshMemoryLocationSheet = function (chatCoreNewScope2399) {
    chatCoreScopeValue1783(chatCoreNewScope2399 || chatCoreScopeValue1755 || "iphone");
  };
  chatCoreScopeValue1729 && chatCoreScopeValue1723 && chatCoreScopeValue1729.addEventListener("click", () => {
    if (window.closeView) window.closeView(chatCoreScopeValue1723);
  });
  [chatCoreScopeValue1743, chatCoreScopeValue1744].forEach(chatCoreNewScope2400 => {
    chatCoreNewScope2400?.["addEventListener"]("click", chatCoreScopeValue1769);
  }), chatCoreScopeValue1745?.["addEventListener"]("click", () => void chatCoreScopeValue1777()), chatCoreScopeValue1730?.["addEventListener"]("click", chatCoreScopeValue2386 => {
    if (chatCoreScopeValue2386.target === chatCoreScopeValue1730) chatCoreScopeValue1769();
  });
  [chatCoreScopeValue1747, chatCoreScopeValue1748].forEach(chatCoreScopeValue2387 => {
    chatCoreScopeValue2387?.addEventListener("click", chatCoreScopeValue1772);
  });
  chatCoreScopeValue1749?.addEventListener("click", () => void chatCoreScopeValue1774());
  chatCoreScopeValue1746?.addEventListener("click", chatCoreScopeValue2388 => {
    if (chatCoreScopeValue2388.target === chatCoreScopeValue1746) chatCoreScopeValue1772();
  });
  chatCoreScopeValue1725 && chatCoreScopeValue1724 && chatCoreScopeValue1725.addEventListener("click", () => {
    if (window.closeView) window.closeView(chatCoreScopeValue1724);
  });
  window.imApp.renderMemoryView = chatCoreScopeValue1762;
  function chatCoreScopeValue1784() {
    const chatCoreScopeValue2389 = document.activeElement;
    [chatCoreScopeValue1714, chatCoreScopeValue1715, chatCoreScopeValue1753].some(chatCoreScopeValue2391 => chatCoreScopeValue2391?.contains(chatCoreScopeValue2389)) && document.getElementById("imessage-view")?.focus({
      preventScroll: true
    });
    if (chatCoreScopeValue1714) chatCoreScopeValue1714.style.display = "none";
    if (chatCoreScopeValue1715) chatCoreScopeValue1715.style.display = "none";
    chatCoreScopeValue1753 && (chatCoreScopeValue1753.style.display = "none", chatCoreScopeValue1753.classList.remove("active"), chatCoreScopeValue1753.setAttribute("aria-hidden", "true"));
    if (chatCoreScopeValue1714) chatCoreScopeValue1714.setAttribute("aria-hidden", "true");
    if (chatCoreScopeValue1715) chatCoreScopeValue1715.setAttribute("aria-hidden", "true");
    if (chatCoreScopeValue1709) chatCoreScopeValue1709.classList.remove("active");
    if (chatCoreScopeValue1710) chatCoreScopeValue1710.classList.remove("active");
    if (chatCoreScopeValue1711) chatCoreScopeValue1711.classList.remove("active");
    const chatCoreScopeValue2390 = document.querySelector(".line-header-right");
    if (chatCoreScopeValue2390) chatCoreScopeValue2390.style.display = "flex";
  }
  chatCoreScopeValue1709 && chatCoreScopeValue1709.addEventListener("click", () => {
    chatCoreScopeValue1784();
    window.imApp.setActiveThemeSurface("home");
    if (chatCoreScopeValue1714) chatCoreScopeValue1714.style.display = "block";
    if (chatCoreScopeValue1714) chatCoreScopeValue1714.setAttribute("aria-hidden", "false");
    if (chatCoreScopeValue1713) chatCoreScopeValue1713.style.display = "flex";
    chatCoreScopeValue1709.classList.add("active");
    chatCoreScopeValue1758(chatCoreScopeValue1709);
    if (window.imApp.renderFriendsList) window.imApp.renderFriendsList();
    if (window.imApp.renderGroupsList) window.imApp.renderGroupsList();
  });
  chatCoreScopeValue1710 && chatCoreScopeValue1710.addEventListener("click", () => {
    chatCoreScopeValue1784();
    window.imApp.setActiveThemeSurface("chats");
    if (chatCoreScopeValue1715) {
      chatCoreScopeValue1715.style.display = "flex";
      chatCoreScopeValue1715.style.flexDirection = "column";
      chatCoreScopeValue1715.setAttribute("aria-hidden", "false");
      if (window.imApp.updateChatsView) window.imApp.updateChatsView();
    }
    chatCoreScopeValue1710.classList.add("active");
    chatCoreScopeValue1758(chatCoreScopeValue1710);
    if (window.imApp.updateChatsUnreadBadges) window.imApp.updateChatsUnreadBadges();
  });
  window.imApp.hideAllTabs = chatCoreScopeValue1784;
  window.imApp.updateLineNavIndicator = chatCoreScopeValue1758;
  window.imApp.setActiveThemeSurface(chatCoreScopeValue1710?.classList.contains("active") ? "chats" : "home");
  setTimeout(() => {
    if (window.imApp.applyAllSavedCss) window.imApp.applyAllSavedCss();
  }, 100);
  function chatCoreScopeValue1785() {
    chatCoreScopeValue1653?.querySelectorAll("[data-image-reference]").forEach(chatCoreScopeValue2392 => {
      const chatCoreScopeValue2393 = chatCoreScopeValue1653.querySelector("[data-image-subject=\"" + chatCoreScopeValue2392.dataset.imageReference + "\"]");
      if (!chatCoreScopeValue2393?.checked) chatCoreScopeValue2392.checked = false;
      chatCoreScopeValue2392.disabled = chatCoreScopeValue1652 || !chatCoreScopeValue2393?.checked;
    });
  }
});
