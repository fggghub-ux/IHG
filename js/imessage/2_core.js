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
};
window.imApp = window.imApp || {};
window.imApp.getGroupUserIdentity = function (group_2, options_2 = {}) {
  const user_2 = window.getUserState ? window.getUserState() : window.userState || {},
    accounts = typeof window.getAccounts === "function" ? window.getAccounts() : [],
    currentAccountId = typeof window.getCurrentAccountId === "function" ? window.getCurrentAccountId() : null,
    currentAccount = accounts.find(account => String(account?.id) === String(currentAccountId)) || null,
    override = !options_2.ignoreOverride && group_2?.type === "group" ? group_2.memory?.userOverride : null,
    source_2 = override || currentAccount || user_2 || {},
    name_2 = String(source_2.name || source_2.realName || source_2.nickname || user_2.name || user_2.realName || "User").trim() || "User";
  return {
    accountId: String(source_2.id || currentAccount?.id || user_2.id || ""),
    name: name_2,
    avatarUrl: String(source_2.avatarUrl || source_2.avatar || user_2.avatarUrl || user_2.avatar || "assets/moren-thumb.jpg"),
    persona: String(source_2.persona || source_2.signature || user_2.persona || ""),
    signature: String(source_2.signature || source_2.persona || user_2.signature || "")
  };
};
window.imApp.captureGroupUserIdentity = function (group_3, message_2) {
  if (!group_3 || group_3.type !== "group" || !message_2 || message_2.role !== "user") return message_2;
  if (message_2.userIdentity && typeof message_2.userIdentity === "object" && String(message_2.userIdentity.name || "").trim()) return message_2;
  const identity = window.imApp.getGroupUserIdentity(group_3);
  return message_2.userIdentity = {
    accountId: identity.accountId,
    name: identity.name,
    avatarUrl: identity.avatarUrl
  }, message_2;
};
window.imApp.getMessageUserIdentity = function (friend_2, message_3) {
  if (friend_2?.type === "group" && message_3?.role === "user") {
    const snapshot = message_3.userIdentity;
    if (snapshot && typeof snapshot === "object" && String(snapshot.name || "").trim()) {
      const legacyFallback = window.imApp.getGroupUserIdentity(friend_2, {
        ignoreOverride: true
      });
      return {
        accountId: String(snapshot.accountId || ""),
        name: String(snapshot.name).trim(),
        avatarUrl: String(snapshot.avatarUrl || legacyFallback.avatarUrl || "assets/moren-thumb.jpg"),
        persona: legacyFallback.persona,
        signature: legacyFallback.signature
      };
    }
    return window.imApp.getGroupUserIdentity(friend_2, {
      ignoreOverride: true
    });
  }
  const user_3 = window.getUserState ? window.getUserState() : window.userState || {};
  return {
    accountId: String(user_3.id || ""),
    name: String(user_3.name || user_3.realName || user_3.nickname || "User"),
    avatarUrl: String(user_3.avatarUrl || user_3.avatar || "assets/moren-thumb.jpg"),
    persona: String(user_3.persona || ""),
    signature: String(user_3.signature || "")
  };
};
window.imApp.getCharUserIdentity = function (value_16) {
  const user_4 = window.getUserState ? window.getUserState() : window.userState || {},
    accounts_2 = typeof window.getAccounts === "function" ? window.getAccounts() : [],
    override_2 = accounts_2.find(value_27 => String(value_27?.id) === String(value_16?.boundAccountId || "")),
    currentAccountId_2 = typeof window.getCurrentAccountId === "function" ? window.getCurrentAccountId() : null,
    currentAccount_2 = accounts_2.find(account_2 => String(account_2?.id) === String(currentAccountId_2)),
    source_3 = override_2 || currentAccount_2 || user_4 || {},
    user_5 = override_2 ? {} : user_4,
    accountId_2 = String(source_3.id || user_4.id || "__default__"),
    accountName_2 = String(source_3.name || source_3.realName || source_3.nickname || user_5.name || "User").trim() || "User",
    userRemarksByAccount_25 = value_16?.userRemarksByAccount,
    remark_2 = userRemarksByAccount_25 && typeof userRemarksByAccount_25 === "object" && Object.prototype.hasOwnProperty.call(userRemarksByAccount_25, accountId_2) ? String(userRemarksByAccount_25[accountId_2] || "").trim().slice(0, 80) : "";
  return {
    accountId: accountId_2,
    accountName: accountName_2,
    remark: remark_2,
    name: remark_2 || accountName_2,
    avatarUrl: String(source_3.avatarUrl || source_3.avatar || user_5.avatarUrl || user_5.avatar || ""),
    persona: String(source_3.persona || source_3.signature || user_5.persona || "")
  };
};
window.imApp.commitCharUserRemark = async function (memberId_2, value_30, value_31, apiRunId_2) {
  const value_33 = typeof value_31 === "string" ? value_31 : "",
    trim_34 = value_33.trim();
  if (!trim_34 || trim_34.length > 80 || /[\u0000-\u001f\u007f]/.test(value_33)) return {
    saved: true,
    changed: false
  };
  const member_2 = (window.imData?.friends || []).find(item_2 => String(item_2.id) === String(memberId_2)),
    charUserIdentity = window.imApp.getCharUserIdentity(member_2);
  if (member_2?.type !== "char" || charUserIdentity.accountId !== String(value_30) || charUserIdentity.remark === trim_34) return {
    saved: true,
    changed: false
  };
  let notice_2 = null;
  const saved_31 = await window.imApp.commitFriendChange(memberId_2, targetFriend_2 => {
    const charUserIdentity_40 = window.imApp.getCharUserIdentity(targetFriend_2);
    if (targetFriend_2?.type !== "char" || charUserIdentity_40.accountId !== String(value_30) || charUserIdentity_40.remark === trim_34) return;
    targetFriend_2.messages = Array.isArray(targetFriend_2.messages) ? targetFriend_2.messages : [];
    if (targetFriend_2.messages.some(value_42 => value_42?.noticeKind === "user_remark_changed" && String(value_42.apiRunId || "") === String(apiRunId_2))) return;
    targetFriend_2.userRemarksByAccount = {
      ...(targetFriend_2.userRemarksByAccount || {}),
      [value_30]: trim_34
    };
    const value_41 = String(targetFriend_2.nickname || targetFriend_2.realName || "Char").trim() || "Char";
    notice_2 = {
      id: apiRunId_2 + "-user-remark",
      role: "system",
      type: "system_notice",
      noticeKind: "user_remark_changed",
      excludedFromContext: true,
      content: value_41 + "更改了你的备注",
      timestamp: Date.now(),
      apiRunId: apiRunId_2
    };
    targetFriend_2.messages.push(notice_2);
    window.imApp.syncFriendMessageSummary?.(targetFriend_2);
  }, {
    silent: true,
    immediate: true,
    includeMessages: true,
    syncActive: true
  });
  return saved_31 && notice_2 && window.dispatchEvent(new CustomEvent("u2:char-user-remark-changed", {
    detail: {
      friendId: String(memberId_2),
      accountId: String(value_30)
    }
  })), {
    saved: saved_31,
    changed: !!(saved_31 && notice_2),
    notice: notice_2
  };
};
window.imApp.DEFAULT_STATUS_PROMPT = "固定使用简体中文，写角色此刻没有说出口的三句真实心声。每句约10个汉字，每行一句，共三行；不要添加序号、引号、标题、前缀或解释。";
window.imApp.DEFAULT_STATUS_TEMPLATE_REGEX = "(?<thought>[\\s\\S]+)";
window.imApp.DEFAULT_STATUS_TEMPLATE_HTML = "<div class=\"chat-profile-status-page\" data-selected-index=\"{{index}}\">\n    <div class=\"chat-profile-status-time\">{{time}}</div>\n    <div class=\"gmp-inner-voice chat-profile-panel-thought\">{{thought}}</div>\n    <div class=\"chat-profile-status-counter\"><span>{{index}}</span> / {{total}}</div>\n</div>";
window.imApp.createDefaultStatusTemplate = function (value_43 = {}) {
  return {
    enabled: value_43.enabled === true,
    prompt: typeof value_43.prompt === "string" && value_43.prompt.trim() ? value_43.prompt.trim() : window.imApp.DEFAULT_STATUS_PROMPT,
    regex: typeof value_43.regex === "string" && value_43.regex.trim() ? value_43.regex.trim() : window.imApp.DEFAULT_STATUS_TEMPLATE_REGEX,
    html: typeof value_43.html === "string" && value_43.html.trim() ? value_43.html.trim() : window.imApp.DEFAULT_STATUS_TEMPLATE_HTML
  };
};
window.imApp.DEFAULT_SINGLE_CHAT_COT_PROMPT = "请按以下顺序完整分析：\n1. 当前具体日期、时间与时间段，以及这对本轮场景和聊天承接意味着什么。\n2. 结合自己的核心人设、性格、当前情绪和与 User 的关系，分析自己现在最真实的想法与适合的回应方式。\n3. 结合 User 人设、当前消息的内容与语气，分析 User 此刻的需求、感受和适合被怎样回应。";
window.imApp.scopeUserCss = function (css_2, scope_2) {
  if (!css_2 || !scope_2) return "";
  function handleAction_46(value_50, value_51) {
    let depth = 0,
      quote = null,
      inComment = false;
    for (let i = value_51; i < value_50.length; i += 1) {
      const char_2 = value_50[i],
        next = value_50[i + 1];
      if (inComment) {
        char_2 === "*" && next === "/" && (inComment = false, i += 1);
        continue;
      }
      if (quote) {
        if (char_2 === "\\") i += 1;else char_2 === quote && (quote = null);
        continue;
      }
      if (char_2 === "/" && next === "*") {
        inComment = true;
        i += 1;
        continue;
      }
      if (char_2 === "\"" || char_2 === "'") {
        quote = char_2;
        continue;
      }
      if (char_2 === "{") depth += 1;
      if (char_2 === "}") {
        depth -= 1;
        if (depth === 0) return i;
      }
    }
    return -1;
  }
  function splitSelectorList(selectorText_2) {
    const selectors = [];
    let current = "",
      squareDepth = 0,
      parenDepth = 0,
      quote_2 = null;
    for (let i_2 = 0; i_2 < selectorText_2.length; i_2 += 1) {
      const char_3 = selectorText_2[i_2];
      if (quote_2) {
        current += char_3;
        if (char_3 === "\\") {
          i_2 += 1;
          current += selectorText_2[i_2] || "";
        } else char_3 === quote_2 && (quote_2 = null);
        continue;
      }
      if (char_3 === "\"" || char_3 === "'") {
        quote_2 = char_3;
        current += char_3;
        continue;
      }
      if (char_3 === "[") squareDepth += 1;
      if (char_3 === "]") squareDepth = Math.max(0, squareDepth - 1);
      if (char_3 === "(") parenDepth += 1;
      if (char_3 === ")") parenDepth = Math.max(0, parenDepth - 1);
      char_3 === "," && squareDepth === 0 && parenDepth === 0 ? (selectors.push(current.trim()), current = "") : current += char_3;
    }
    if (current.trim()) selectors.push(current.trim());
    return selectors;
  }
  function scopeSelector(value_66) {
    const trimmed = value_66.trim();
    if (!trimmed) return trimmed;
    if (trimmed.includes(":scope")) return trimmed.replace(/:scope/g, scope_2);
    if (trimmed === ":root" || trimmed === "html" || trimmed === "body") return scope_2;
    if (trimmed.startsWith(scope_2)) return trimmed;
    return scope_2 + " " + trimmed;
  }
  function handleAction_49(text_2) {
    let text_69 = "",
      cursor = 0;
    while (cursor < text_2.length) {
      const openIndex = text_2.indexOf("{", cursor);
      if (openIndex === -1) {
        text_69 += text_2.slice(cursor);
        break;
      }
      const prelude = text_2.slice(cursor, openIndex),
        trimmedPrelude = prelude.trim(),
        closeIndex = handleAction_46(text_2, openIndex);
      if (closeIndex === -1) {
        text_69 += text_2.slice(cursor);
        break;
      }
      const body_2 = text_2.slice(openIndex + 1, closeIndex),
        lowerPrelude = trimmedPrelude.toLowerCase();
      if (!trimmedPrelude) text_69 += text_2.slice(cursor, closeIndex + 1);else {
        if (lowerPrelude.startsWith("@media") || lowerPrelude.startsWith("@supports") || lowerPrelude.startsWith("@container") || lowerPrelude.startsWith("@layer")) text_69 += prelude + "{" + handleAction_49(body_2) + "}";else {
          if (lowerPrelude.startsWith("@keyframes") || lowerPrelude.startsWith("@-webkit-keyframes") || lowerPrelude.startsWith("@font-face") || lowerPrelude.startsWith("@property") || lowerPrelude.startsWith("@page")) text_69 += text_2.slice(cursor, closeIndex + 1);else {
            if (trimmedPrelude.startsWith("@")) text_69 += text_2.slice(cursor, closeIndex + 1);else {
              const leadingWhitespace = prelude.match(/^\s*/)?.[0] || "",
                scopedPrelude = splitSelectorList(trimmedPrelude).map(scopeSelector).join(", ");
              text_69 += "" + leadingWhitespace + scopedPrelude + "{" + body_2 + "}";
            }
          }
        }
      }
      cursor = closeIndex + 1;
    }
    return text_69;
  }
  return handleAction_49(String(css_2));
};
window.imApp.getSingleChatThemePreviewMarkup = function (value_79 = "theme-css-preview-chat") {
  return "<div id=\"" + value_79 + "\" class=\"active-chat-interface im-chat-interface im-chat-single\">\n        <div class=\"chat-sticky-container is-friend\"><div class=\"chat-top-bar im-chat-top-bar\">\n            <div class=\"im-chat-header-left\"><div class=\"ins-chat-header im-chat-header-main\">\n                <div class=\"im-chat-avatar-wrap\"><div class=\"ins-chat-avatar\"></div></div>\n                <div class=\"im-chat-title-wrap\"><div class=\"ins-chat-name\">示例角色</div><div class=\"ins-chat-sign\">在线</div></div>\n            </div></div>\n        </div></div>\n        <div class=\"ins-chat-messages\">\n            <div class=\"chat-row ai-row has-next\"><div class=\"chat-bubble ai-bubble\">这是对方的消息</div></div>\n            <div class=\"chat-row user-row has-prev\"><div class=\"chat-bubble user-bubble\">这是我的消息</div></div>\n        </div>\n        <div class=\"ins-chat-input-container\"><div class=\"ins-chat-input-wrapper\"><input class=\"ins-message-input chat-input\" placeholder=\"iMessage...\"></div></div>\n    </div>";
};
window.imApp.getSingleChatThemePreviewDocument = function (value_80, value_81) {
  const text_82 = "theme-css-preview-chat",
    value_83 = value_81 === "bubble_css" ? "#" + text_82 : ".active-chat-interface.im-chat-single",
    replace_84 = window.imApp.scopeUserCss(String(value_80 || ""), value_83).replace(/<\/style/gi, "<\\/style");
  return "<!doctype html><html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width\"><style>\n        *{box-sizing:border-box}html,body{margin:0;min-height:100%;font:13px -apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif;color:#111}\n        body{padding:12px;background:#f2f2f7}.active-chat-interface.im-chat-single{position:relative;display:flex;flex-direction:column;min-height:230px;overflow:hidden;border-radius:16px;background:#fff}\n        .chat-sticky-container{padding:10px 12px;border-bottom:1px solid #eee}.chat-top-bar,.im-chat-header-left,.ins-chat-header{display:flex;align-items:center;gap:8px}\n        .ins-chat-avatar{width:30px;height:30px;border-radius:50%;background:#d1d1d6}.ins-chat-name{font-weight:700}.ins-chat-sign{color:#8e8e93;font-size:10px}\n        .ins-chat-messages{flex:1;padding:14px 12px}.chat-row{display:flex;margin:8px 0}.chat-row.user-row{justify-content:flex-end}\n        .chat-bubble{max-width:76%;padding:9px 12px;border-radius:16px}.ai-bubble{background:#e5e5ea}.user-bubble{background:#2c2c2e;color:#fff}\n        .ins-chat-input-container{padding:9px 12px;border-top:1px solid #eee}.ins-message-input{width:100%;padding:8px 10px;border:0;border-radius:14px;background:#f2f2f7}\n        " + replace_84 + "\n    </style></head><body>" + window.imApp.getSingleChatThemePreviewMarkup(text_82) + "</body></html>";
};
window.imApp.validateSingleChatThemeCss = function (css_3, value_86) {
  if (value_86 !== "chat_css" && value_86 !== "bubble_css") return {
    valid: true
  };
  if (!String(css_3 || "").trim()) return {
    valid: false,
    error: "CSS 代码为空"
  };
  if (typeof document === "undefined" || !document.head || !window.imApp.scopeUserCss) return {
    valid: false,
    error: "聊天 CSS 校验组件未加载"
  };
  const text_87 = "theme-css-preview-chat",
    scope_3 = value_86 === "chat_css" ? ".active-chat-interface.im-chat-single" : "#" + text_87,
    textContent_6 = window.imApp.scopeUserCss(css_3, scope_3),
    element = document.createElement("div");
  element.innerHTML = window.imApp.getSingleChatThemePreviewMarkup(text_87);
  const element_90 = document.createElement("style");
  element_90.media = "not all";
  element_90.textContent = textContent_6;
  document.head.appendChild(element_90);
  let items_91 = [];
  try {
    const value_93 = value_94 => {
      for (const element_95 of Array.from(value_94 || [])) {
        if (typeof element_95.selectorText === "string" && element_95.style?.length) items_91.push(element_95.selectorText);else {
          if (element_95.cssRules) value_93(element_95.cssRules);
        }
      }
    };
    value_93(element_90.sheet?.cssRules);
  } catch (value_96) {
    return {
      valid: false,
      error: "CSS 语法无法解析"
    };
  } finally {
    element_90.remove();
  }
  if (!items_91.length) return {
    valid: false,
    error: "CSS 中没有可用的样式规则"
  };
  const value_92 = value_97 => {
    const replace_98 = value_97.replace(/::(?:before|after|first-letter|first-line|selection)\b/gi, "").replace(/:(?:hover|active|focus|focus-visible|focus-within)\b/gi, "");
    try {
      return !!element.querySelector(replace_98);
    } catch (value_99) {
      return false;
    }
  };
  if (!items_91.some(value_92)) return {
    valid: false,
    error: "CSS 选择器未命中单聊界面（例如 " + items_91[0].slice(0, 100) + "）。请使用 :scope 或真实的 .chat-row、.chat-bubble 等类名，不要重复写聊天根节点。"
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
window.imApp.normalizeOfflineThemeState = function (value_100) {
  const defaults = window.imApp.createDefaultOfflineThemeState(),
    source_4 = value_100 && typeof value_100 === "object" ? value_100 : {},
    normalizeColor = (value_8, fallback) => {
      const color_2 = String(value_8 || "").trim();
      return /^#[0-9a-fA-F]{6}$/.test(color_2) ? color_2.toUpperCase() : fallback;
    },
    customCss_2 = typeof source_4.customCss === "string" ? source_4.customCss : "",
    replaceAll_104 = customCss_2.replaceAll("offline-tavern", "offline-chat");
  return {
    narrativeColor: normalizeColor(source_4.narrativeColor, defaults.narrativeColor),
    dialogueColor: normalizeColor(source_4.dialogueColor, defaults.dialogueColor),
    customCss: replaceAll_104,
    customCssEnabled: !!replaceAll_104.trim(),
    activePresetId: String(source_4.activePresetId || "").trim()
  };
};
window.imApp.normalizeOfflineThemePresets = function (presets_2) {
  const source_5 = Array.isArray(presets_2) ? presets_2 : [],
    value_109 = new Set(),
    usedNames = new Set();
  return source_5.map((value_111, value_112) => {
    const item_3 = value_111 && typeof value_111 === "object" ? value_111 : {},
      theme_2 = window.imApp.normalizeOfflineThemeState(item_3),
      name_3 = String(item_3.name || "").trim() || "线下主题 " + (value_112 + 1),
      normalizedName = name_3.toLocaleLowerCase();
    let id_7 = String(item_3.id || "").trim() || "offline-theme-" + (value_112 + 1);
    while (value_109.has(id_7)) id_7 = id_7 + "-" + (value_112 + 1);
    if (usedNames.has(normalizedName)) return null;
    return value_109.add(id_7), usedNames.add(normalizedName), {
      id: id_7,
      name: name_3,
      narrativeColor: theme_2.narrativeColor,
      dialogueColor: theme_2.dialogueColor,
      customCss: theme_2.customCss
    };
  }).filter(Boolean);
};
const OFFLINE_THEME_SCOPE = ":is(#offline-chat-view, #offline-chat-barrage-view)";
window.imApp.getOfflineThemeState = function () {
  const imessageUiState = window.imApp.getImessageUiState?.(),
    item_4 = window.imData.offlineThemeInitialized ? window.imData.offlineTheme : imessageUiState?.offlineTheme || window.imData.offlineTheme,
    value_118 = window.imData.offlineThemeInitialized ? window.imData.offlineThemePresets : imessageUiState?.offlineThemePresets || window.imData.offlineThemePresets,
    offlineTheme_2 = window.imApp.normalizeOfflineThemeState(item_4),
    offlineThemePresets_2 = window.imApp.normalizeOfflineThemePresets(value_118);
  return offlineTheme_2.activePresetId && !offlineThemePresets_2.some(preset_2 => preset_2.id === offlineTheme_2.activePresetId) && (offlineTheme_2.activePresetId = ""), window.imData.offlineTheme = offlineTheme_2, window.imData.offlineThemePresets = offlineThemePresets_2, {
    theme: offlineTheme_2,
    presets: offlineThemePresets_2
  };
};
window.imApp.applyOfflineChatTheme = function (value_122 = null) {
  const offlineTheme_4 = window.imApp.normalizeOfflineThemeState(value_122 || window.imApp.getOfflineThemeState().theme);
  window.imData.offlineTheme = offlineTheme_4;
  ["offline-chat-view", "offline-chat-barrage-view"].forEach(value_124 => {
    const elementById = document.getElementById(value_124);
    if (!elementById) return;
    elementById.style.setProperty("--offline-chat-narrative-color", offlineTheme_4.narrativeColor);
    elementById.style.setProperty("--offline-chat-dialogue-color", offlineTheme_4.dialogueColor);
  });
  let offlineChatCustomThemeStyleElement = document.getElementById("offline-chat-custom-theme-style");
  return !offlineChatCustomThemeStyleElement && (offlineChatCustomThemeStyleElement = document.createElement("style"), offlineChatCustomThemeStyleElement.id = "offline-chat-custom-theme-style", document.head.appendChild(offlineChatCustomThemeStyleElement)), offlineChatCustomThemeStyleElement.textContent = offlineTheme_4.customCssEnabled && offlineTheme_4.customCss.trim() ? window.imApp.scopeUserCss(offlineTheme_4.customCss, OFFLINE_THEME_SCOPE) : "", offlineTheme_4;
};
window.imApp.saveOfflineThemeState = async function (value_125) {
  const theme_4 = window.imApp.applyOfflineChatTheme(value_125);
  return window.imData.offlineThemeInitialized = true, await Promise.resolve(window.imApp.saveImessageUiState?.()), document.dispatchEvent(new CustomEvent("u2:offline-theme-changed", {
    detail: {
      theme: theme_4
    }
  })), theme_4;
};
window.imApp.saveOfflineThemePresets = async function (value_127) {
  const offlineThemePresets_4 = window.imApp.normalizeOfflineThemePresets(value_127);
  return window.imData.offlineThemePresets = offlineThemePresets_4, window.imData.offlineThemeInitialized = true, await Promise.resolve(window.imApp.saveImessageUiState?.()), document.dispatchEvent(new CustomEvent("u2:offline-theme-changed", {
    detail: {
      presets: offlineThemePresets_4
    }
  })), offlineThemePresets_4;
};
window.imApp.applyGlobalChatCss = function (themeState_2 = window.u2ThemeState || {}) {
  const id_2 = "global-imessage-chat-css";
  let elementById_131 = document.getElementById(id_2);
  !elementById_131 && (elementById_131 = document.createElement("style"), elementById_131.id = id_2, document.head.appendChild(elementById_131));
  const enabled_2 = !!themeState_2.imessageChatCssEnabled,
    css_4 = typeof themeState_2.imessageChatCss === "string" ? themeState_2.imessageChatCss : "",
    textContent_2 = enabled_2 && css_4.trim() ? window.imApp.scopeUserCss(css_4, ".active-chat-interface.im-chat-single") : "";
  if (elementById_131.textContent !== textContent_2) elementById_131.textContent = textContent_2;
};
window.imApp.setActiveThemeSurface = function (surface = "home") {
  const imessageView = document.getElementById("imessage-view");
  if (!imessageView) return;
  imessageView.dataset.imActiveSurface = String(surface || "home");
};
function applyGlobalSurfaceCss({
  styleId: id_8,
  enabled: enabled_3,
  css: css_5,
  scope: scope_4
}) {
  let elementById_139 = document.getElementById(id_8);
  !elementById_139 && (elementById_139 = document.createElement("style"), elementById_139.id = id_8, document.head.appendChild(elementById_139));
  const textContent_3 = enabled_3 && typeof css_5 === "string" && css_5.trim() ? window.imApp.scopeUserCss(css_5, scope_4) : "";
  if (elementById_139.textContent !== textContent_3) elementById_139.textContent = textContent_3;
}
window.imApp.applyGlobalHomeCss = function (themeState = window.u2ThemeState || {}) {
  applyGlobalSurfaceCss({
    styleId: "global-imessage-home-css",
    enabled: !!themeState.imessageHomeCssEnabled,
    css: themeState.imessageHomeCss,
    scope: "#imessage-view:is([data-im-active-surface=\"home\"], [data-im-active-surface=\"chats\"])"
  });
};
window.imApp.applyGlobalGroupCss = function (themeState_3 = window.u2ThemeState || {}) {
  const id_3 = "global-imessage-group-css";
  let elementById_143 = document.getElementById(id_3);
  !elementById_143 && (elementById_143 = document.createElement("style"), elementById_143.id = id_3, document.head.appendChild(elementById_143));
  const enabled_4 = !!themeState_3.imessageGroupCssEnabled,
    css_6 = typeof themeState_3.imessageGroupCss === "string" ? themeState_3.imessageGroupCss : "",
    textContent_4 = enabled_4 && css_6.trim() ? window.imApp.scopeUserCss(css_6, ".active-chat-interface.im-chat-group") : "";
  if (elementById_143.textContent !== textContent_4) elementById_143.textContent = textContent_4;
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
window.imApp.normalizeAutonomousTask = function (value_147) {
  const defaultTask = window.imApp.createDefaultAutonomousTask(),
    source_6 = value_147 && typeof value_147 === "object" ? value_147 : {},
    minInterval = Number(source_6.minIntervalMinutes),
    maxInterval = Number(source_6.maxIntervalMinutes),
    normalizedMin = Number.isFinite(minInterval) ? Math.max(1, Math.round(minInterval)) : defaultTask.minIntervalMinutes,
    maxIntervalMinutes_2 = Number.isFinite(maxInterval) ? Math.max(normalizedMin, Math.round(maxInterval)) : Math.max(normalizedMin, defaultTask.maxIntervalMinutes);
  return {
    enabled: !!source_6.enabled,
    minIntervalMinutes: normalizedMin,
    maxIntervalMinutes: maxIntervalMinutes_2,
    nextRunAt: Math.max(0, Number(source_6.nextRunAt) || defaultTask.nextRunAt),
    lastRunAt: Math.max(0, Number(source_6.lastRunAt) || defaultTask.lastRunAt)
  };
};
window.imApp.createDefaultAutonomousActivity = function () {
  return {
    reply: window.imApp.createDefaultAutonomousTask(),
    moment: window.imApp.createDefaultAutonomousTask()
  };
};
window.imApp.normalizeAutonomousActivity = function (value_152) {
  const source_7 = value_152 && typeof value_152 === "object" ? value_152 : {},
    hasNestedTasks = source_7.reply && typeof source_7.reply === "object" || source_7.moment && typeof source_7.moment === "object",
    legacyReplySource = hasNestedTasks ? source_7.reply : source_7;
  return {
    reply: window.imApp.normalizeAutonomousTask(legacyReplySource),
    moment: window.imApp.normalizeAutonomousTask(source_7.moment)
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
window.imApp.normalizeGeneratedContactProfile = function (mount, value_157 = {}) {
  const source_8 = mount && typeof mount === "object" && !Array.isArray(mount) ? mount : {},
    options_159 = {
      nickname: 80,
      realName: 80,
      signature: 240,
      persona: 8000,
      referrerRelation: 200
    },
    value_160 = value_162 => String(source_8[value_162] || "").trim(),
    options_161 = {
      nickname: value_160("nickname"),
      realName: value_160("realName"),
      signature: value_160("signature"),
      persona: value_160("persona"),
      referrerRelation: value_160("referrerRelation")
    };
  if (value_157.strict === true) {
    if (!options_161.nickname || !options_161.realName || !options_161.signature || !options_161.persona || !options_161.referrerRelation) return null;
    if (Object.entries(options_159).some(([value_163, value_164]) => options_161[value_163].length > value_164)) return null;
    if (source_8.type && source_8.type !== "char") return null;
    if (["id", "targetId", "contactId"].some(value_165 => Object.prototype.hasOwnProperty.call(source_8, value_165))) return null;
  }
  return {
    type: "char",
    nickname: options_161.nickname.slice(0, options_159.nickname),
    realName: options_161.realName.slice(0, options_159.realName),
    signature: options_161.signature.slice(0, options_159.signature),
    persona: options_161.persona.slice(0, options_159.persona),
    referrerRelation: options_161.referrerRelation.slice(0, options_159.referrerRelation),
    avatarUrl: value_157.strict === true ? "" : typeof source_8.avatarUrl === "string" ? source_8.avatarUrl.trim() : "",
    avatarAssetId: value_157.strict === true ? "" : typeof source_8.avatarAssetId === "string" ? source_8.avatarAssetId.trim() : ""
  };
};
window.imApp.normalizeFriendRequests = function (value_166) {
  const value_167 = new Set();
  return (Array.isArray(value_166) ? value_166 : []).map(value_168 => {
    if (!value_168 || typeof value_168 !== "object") return null;
    const id_9 = String(value_168.id || "").trim(),
      contactId_2 = String(value_168.contactId || "").trim();
    if (!id_9 || !contactId_2 || value_167.has(id_9)) return null;
    const profile_2 = window.imApp.normalizeGeneratedContactProfile(value_168.profile, {
      strict: true
    });
    if (!profile_2) return null;
    return value_167.add(id_9), {
      id: id_9,
      contactId: contactId_2,
      sourceFriendId: String(value_168.sourceFriendId || "").trim(),
      sourceMessageId: String(value_168.sourceMessageId || "").trim(),
      createdAt: Math.max(0, Number(value_168.createdAt) || Date.now()),
      seenAt: Math.max(0, Number(value_168.seenAt) || 0),
      status: "pending",
      profile: profile_2
    };
  }).filter(Boolean).slice(-100);
};
window.imApp.saveFriendRequests = async function (value_171, value_172 = {}) {
  const friendRequests_3 = window.imApp.normalizeFriendRequests(window.imData.friendRequests),
    friendRequests_2 = window.imApp.normalizeFriendRequests(value_171);
  window.imData.friendRequests = friendRequests_2;
  try {
    window.imApp.saveImessageUiState?.();
    if (value_172.flush !== false && typeof window.saveGlobalData === "function") {
      const value_175 = await Promise.resolve(window.saveGlobalData());
      if (value_175 === false) throw new Error("Failed to persist friend requests");
    }
    return window.dispatchEvent(new CustomEvent("u2:friend-requests-changed", {
      detail: {
        count: friendRequests_2.length
      }
    })), true;
  } catch (value_176) {
    return console.error("Failed to save friend requests", value_176), window.imData.friendRequests = friendRequests_3, window.imApp.saveImessageUiState?.(), false;
  }
};
window.imApp.normalizeChatApiUsage = function (mount_2, value_178 = {}) {
  const source_9 = mount_2 && typeof mount_2 === "object" && !Array.isArray(mount_2) ? mount_2 : {},
    value_180 = (...value_187) => {
      for (const value_188 of value_187) {
        const number_189 = Number(source_9[value_188]);
        if (Number.isFinite(number_189) && number_189 >= 0) return Math.round(number_189);
      }
      return null;
    },
    inputTokens_2 = value_180("prompt_tokens", "input_tokens", "promptTokens", "inputTokens", "promptTokenCount", "inputTokenCount"),
    outputTokens_2 = value_180("completion_tokens", "output_tokens", "completionTokens", "outputTokens", "candidatesTokenCount", "outputTokenCount"),
    value_180_183 = value_180("total_tokens", "totalTokens", "totalTokenCount"),
    totalTokens_2 = value_180_183 != null ? value_180_183 : inputTokens_2 != null && outputTokens_2 != null ? inputTokens_2 + outputTokens_2 : null;
  if (inputTokens_2 == null && outputTokens_2 == null && totalTokens_2 == null) return null;
  const recordedAt_2 = Number(value_178.recordedAt || source_9.recordedAt || source_9.completedAt) || Date.now(),
    number_186 = Number(value_178.requestMessageCount || source_9.requestMessageCount);
  return {
    inputTokens: inputTokens_2,
    outputTokens: outputTokens_2,
    totalTokens: totalTokens_2,
    model: String(value_178.model || source_9.model || "").trim().slice(0, 200),
    source: String(value_178.source || source_9.source || "chat").trim().slice(0, 80) || "chat",
    requestMessageCount: Number.isFinite(number_186) && number_186 >= 0 ? Math.round(number_186) : null,
    recordedAt: recordedAt_2
  };
};
window.imApp.getLastChatApiUsage = function (value_190) {
  return window.imApp.normalizeChatApiUsage(value_190?.lastChatApiUsage || null);
};
window.imApp.recordLastChatApiUsage = async function (value_191, value_192, value_193 = {}) {
  const chatApiUsage = window.imApp.normalizeChatApiUsage(value_192, value_193);
  if (!chatApiUsage || !window.imApp.commitFriendMetaPatch) return false;
  try {
    const value_194 = await window.imApp.commitFriendMetaPatch(window.imApp.resolveFriendId(value_191), {
      lastChatApiUsage: chatApiUsage
    }, {
      silent: true
    });
    return value_194 && typeof window.CustomEvent === "function" && window.dispatchEvent(new CustomEvent("u2:chat-api-usage-updated", {
      detail: {
        friendId: String(window.imApp.resolveFriendId(value_191) || ""),
        usage: chatApiUsage
      }
    })), value_194;
  } catch (value_195) {
    return console.warn("[iMessage] Failed to persist actual chat API usage", value_195), false;
  }
};
window.imApp.createDefaultLinkedAccountBot = function () {
  return {
    enabled: false,
    intervalSeconds: 60,
    lastRunAt: 0
  };
};
window.imApp.normalizeLinkedAccountBot = function (value_196) {
  const defaultBot = window.imApp.createDefaultLinkedAccountBot(),
    source_10 = value_196 && typeof value_196 === "object" ? value_196 : {},
    intervalSeconds_2 = Number(source_10.intervalSeconds);
  return {
    enabled: !!source_10.enabled,
    intervalSeconds: Number.isFinite(intervalSeconds_2) ? Math.max(5, Math.min(86400, Math.round(intervalSeconds_2))) : defaultBot.intervalSeconds,
    lastRunAt: Number(source_10.lastRunAt) || defaultBot.lastRunAt
  };
};
window.imApp.normalizeLinkedAccountChats = function (chats) {
  if (!Array.isArray(chats)) return [];
  return chats.map((contact_200, value_201) => {
    if (!contact_200 || typeof contact_200 !== "object") return null;
    const messages_2 = Array.isArray(contact_200.messages) ? contact_200.messages.map((message_4, messageIndex) => {
        if (!message_4 || typeof message_4 !== "object") return null;
        const text_3 = typeof message_4.text === "string" ? message_4.text.trim() : typeof message_4.content === "string" ? message_4.content.trim() : "";
        if (!text_3) return null;
        const role_2 = message_4.role === "char" ? "char" : "account",
          timestamp_2 = Number(message_4.timestamp) || Date.now() + messageIndex,
          normalizedMessage = {
            id: message_4.id || "linked-msg-" + timestamp_2 + "-" + messageIndex,
            role: role_2,
            text: text_3,
            timestamp: timestamp_2
          },
          translation_2 = typeof message_4.translation === "string" && message_4.translation.trim() ? message_4.translation.trim() : typeof message_4.translationZh === "string" && message_4.translationZh.trim() ? message_4.translationZh.trim() : typeof message_4.trans === "string" && message_4.trans.trim() ? message_4.trans.trim() : "";
        if (translation_2) normalizedMessage.translation = translation_2;
        const round_2 = Number(message_4.round);
        if (Number.isFinite(round_2) && round_2 > 0) normalizedMessage.round = round_2;
        const orderInTurn_2 = Number(message_4.orderInTurn);
        if (Number.isFinite(orderInTurn_2) && orderInTurn_2 >= 0) normalizedMessage.orderInTurn = orderInTurn_2;
        return normalizedMessage;
      }).filter(Boolean) : [],
      now_2 = Date.now(),
      updatedAt_2 = Number(contact_200.updatedAt) || (messages_2.length > 0 ? messages_2[messages_2.length - 1].timestamp : now_2);
    return {
      id: contact_200.id || "linked-chat-" + updatedAt_2 + "-" + value_201,
      name: typeof contact_200.name === "string" && contact_200.name.trim() ? contact_200.name.trim() : "Linked Friend " + (value_201 + 1),
      realName: typeof contact_200.realName === "string" && contact_200.realName.trim() ? contact_200.realName.trim() : typeof contact_200.name === "string" ? contact_200.name.trim() : "",
      remark: typeof contact_200.remark === "string" ? contact_200.remark.trim() : "",
      handle: typeof contact_200.handle === "string" ? contact_200.handle.trim() : "",
      persona: typeof contact_200.persona === "string" ? contact_200.persona.trim() : "",
      relationship: typeof contact_200.relationship === "string" ? contact_200.relationship.trim() : "",
      avatarSeed: typeof contact_200.avatarSeed === "string" && contact_200.avatarSeed.trim() ? contact_200.avatarSeed.trim() : typeof contact_200.handle === "string" && contact_200.handle.trim() ? contact_200.handle.trim() : typeof contact_200.name === "string" ? contact_200.name.trim() : "linked-" + value_201,
      sourceNpcId: contact_200.sourceNpcId != null ? String(contact_200.sourceNpcId) : "",
      messages: messages_2,
      createdAt: Number(contact_200.createdAt) || updatedAt_2,
      updatedAt: updatedAt_2,
      readAt: Number(contact_200.readAt) || 0
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
window.imApp.normalizeMemoryRecallLimits = function (value_214) {
  const source_11 = value_214 && typeof value_214 === "object" ? value_214 : {},
    normalizeLimit = (candidate, fallback_2 = 30) => {
      const numeric = Math.round(Number(candidate));
      return Number.isFinite(numeric) && numeric > 0 ? Math.min(100, Math.max(1, numeric)) : fallback_2;
    };
  return {
    shortTerm: normalizeLimit(source_11.shortTerm, 30),
    longTerm: normalizeLimit(source_11.longTerm, 30)
  };
};
window.imApp.normalizeXDirectMessageMount = function (mount_3) {
  const fallback_3 = window.imApp.createDefaultXDirectMessageMount(),
    source_12 = mount_3 && typeof mount_3 === "object" && !Array.isArray(mount_3) ? mount_3 : {},
    parsedLimit = Number(source_12.limit);
  return {
    enabled: source_12.enabled !== false,
    limit: Number.isFinite(parsedLimit) ? Math.max(1, Math.min(50, Math.floor(parsedLimit))) : fallback_3.limit,
    dmId: source_12.dmId == null ? "" : String(source_12.dmId)
  };
};
window.imApp.normalizeBstagePopMount = function (mount_4) {
  const source_13 = mount_4 && typeof mount_4 === "object" && !Array.isArray(mount_4) ? mount_4 : {};
  return {
    enabled: source_13.enabled === true,
    teamId: source_13.teamId == null ? "" : String(source_13.teamId),
    memberId: source_13.memberId == null ? "" : String(source_13.memberId)
  };
};
window.imApp.isCharacterSleeping = function (value_223) {
  if (!value_223 || !value_223.memory || !value_223.memory.schedule || !value_223.memory.schedule.enabled) return false;
  const schedule_224 = value_223.memory.schedule,
    value_225 = schedule_224.sleepTime || "23:00",
    value_226 = schedule_224.wakeTime || "07:00";
  if (value_225 === value_226) return false;
  const now_3 = new Date(),
    currentHours = now_3.getHours(),
    currentMinutes = now_3.getMinutes(),
    currentTotalMinutes = currentHours * 60 + currentMinutes,
    parseTime = timeStr => {
      const parts = timeStr.split(":");
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    },
    value_229_230 = parseTime(value_225),
    value_229_231 = parseTime(value_226);
  return value_229_230 < value_229_231 ? currentTotalMinutes >= value_229_230 && currentTotalMinutes < value_229_231 : currentTotalMinutes >= value_229_230 || currentTotalMinutes < value_229_231;
};
window.imApp.normalizeProfileStatusHistory = function (friend_3 = {}) {
  const panel_2 = friend_3?.profilePanel && typeof friend_3.profilePanel === "object" ? friend_3.profilePanel : {},
    hasStatusHistory = Array.isArray(panel_2.statusHistory) && panel_2.statusHistory.length > 0,
    source_14 = hasStatusHistory ? panel_2.statusHistory : Array.isArray(panel_2.thoughtHistory) ? panel_2.thoughtHistory : [],
    thought_2 = String(panel_2.thought || friend_3?.latestThought || "").trim(),
    filter_237 = source_14.map((value_238, index_2) => {
      const sourceItem = value_238 && typeof value_238 === "object" ? value_238 : {},
        thought_3 = String(sourceItem.thought ?? sourceItem.content ?? "").trim(),
        canEnrichCurrent = !hasStatusHistory && index_2 === 0 && thought_3 && thought_3 === thought_2,
        value_243 = key_2 => {
          if (typeof sourceItem[key_2] === "number" && Number.isFinite(sourceItem[key_2])) return sourceItem[key_2];
          if (canEnrichCurrent && typeof panel_2[key_2] === "number" && Number.isFinite(panel_2[key_2])) return panel_2[key_2];
          return null;
        };
      return {
        id: String(sourceItem.id || "status-" + (sourceItem.createdAt || sourceItem.time || index_2)),
        thought: thought_3,
        affection: value_243("affection"),
        affectionChange: value_243("affectionChange"),
        createdAt: sourceItem.createdAt || sourceItem.time || null,
        legacy: sourceItem.legacy === true || !hasStatusHistory && !canEnrichCurrent
      };
    }).filter(value_245 => value_245.thought);
  return filter_237.length === 0 && thought_2 && filter_237.push({
    id: "status-current-" + (friend_3?.id || "friend"),
    thought: thought_2,
    affection: typeof panel_2.affection === "number" ? panel_2.affection : 0,
    affectionChange: typeof panel_2.affectionChange === "number" ? panel_2.affectionChange : 0,
    createdAt: null,
    legacy: false
  }), filter_237;
};
window.imApp.migrateSingleChatProfileStatus = function (friend_4 = {}) {
  if (!friend_4 || friend_4.type === "group") return false;
  const legacyKeys = ["location", "action", "mood", "expression"];
  let enabled_248 = false;
  const stripLegacyFields = target_2 => {
      if (!target_2 || typeof target_2 !== "object") return;
      legacyKeys.forEach(value_250 => {
        Object.prototype.hasOwnProperty.call(target_2, value_250) && (delete target_2[value_250], enabled_248 = true);
      });
    },
    panel = friend_4.profilePanel;
  return panel && typeof panel === "object" && (stripLegacyFields(panel), Object.prototype.hasOwnProperty.call(panel, "events") && (delete panel.events, enabled_248 = true), ["statusHistory", "thoughtHistory"].forEach(historyKey => {
    if (!Array.isArray(panel[historyKey])) return;
    panel[historyKey].forEach(stripLegacyFields);
  })), enabled_248;
};
window.imApp.createDefaultProfilePanel = function (friend_5 = {}) {
  return window.imApp.migrateSingleChatProfileStatus(friend_5), {
    thought: friend_5?.profilePanel?.thought || friend_5?.latestThought || "",
    affection: typeof friend_5?.profilePanel?.affection === "number" ? friend_5.profilePanel.affection : 0,
    affectionChange: typeof friend_5?.profilePanel?.affectionChange === "number" ? friend_5.profilePanel.affectionChange : 0,
    status: friend_5?.profilePanel?.status || friend_5?.status || "online",
    thoughtHistory: Array.isArray(friend_5?.profilePanel?.thoughtHistory) ? friend_5.profilePanel.thoughtHistory : [],
    statusHistory: window.imApp.normalizeProfileStatusHistory(friend_5)
  };
};
window.imApp.normalizeFavoriteUserMessages = function (value_252) {
  const seenMessageIds = new Set();
  return (Array.isArray(value_252) ? value_252 : []).map((item_5, value_255) => {
    if (!item_5 || typeof item_5 !== "object") return null;
    const messageId_2 = String(item_5.messageId || "").trim(),
      messageText_2 = String(item_5.messageText || "").trim(),
      reason_2 = String(item_5.reason || "").trim();
    if (!messageId_2 || !messageText_2 || !reason_2 || seenMessageIds.has(messageId_2)) return null;
    seenMessageIds.add(messageId_2);
    const createdAt_2 = Math.max(0, Number(item_5.createdAt) || 0),
      messageTimestamp_2 = Math.max(0, Number(item_5.messageTimestamp) || 0);
    return {
      id: String(item_5.id || "favorite-" + messageId_2 + "-" + (createdAt_2 || value_255)),
      messageId: messageId_2,
      messageText: messageText_2,
      messageType: item_5.messageType === "voice_message" ? "voice_message" : "text",
      messageTimestamp: messageTimestamp_2,
      reason: reason_2,
      createdAt: createdAt_2,
      sourceApiRunId: String(item_5.sourceApiRunId || "")
    };
  }).filter(Boolean).sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0));
};
window.imApp.normalizeChatBlockState = function (value_261) {
  const value_262 = value_261 && typeof value_261 === "object" ? value_261 : {};
  return {
    userBlocksChar: value_262.userBlocksChar === true,
    charBlocksUser: value_262.charBlocksUser === true,
    userBlockedAt: Math.max(0, Number(value_262.userBlockedAt) || 0),
    charBlockedAt: Math.max(0, Number(value_262.charBlockedAt) || 0),
    userBlockReason: String(value_262.userBlockReason || "").trim().slice(0, 500),
    charBlockReason: String(value_262.charBlockReason || "").trim().slice(0, 500)
  };
};
window.imApp.normalizePendingLovesUnbindRequest = function (item_6) {
  if (!item_6 || typeof item_6 !== "object") return null;
  const requestId_2 = String(item_6.requestId || item_6.id || "").trim(),
    createdAt_3 = Math.max(0, Number(item_6.createdAt) || 0);
  if (!requestId_2 || !createdAt_3 || item_6.status !== "pending") return null;
  return {
    requestId: requestId_2,
    createdAt: createdAt_3,
    status: "pending"
  };
};
window.imApp.getPendingLovesUnbindRequest = function (friend_6) {
  const pendingLovesUnbindRequest_267 = window.imApp.normalizePendingLovesUnbindRequest(friend_6?.pendingLovesUnbindRequest);
  if (!pendingLovesUnbindRequest_267) return null;
  const result_268 = (Array.isArray(friend_6?.messages) ? friend_6.messages : []).find(value_269 => {
    return value_269?.type === "loves_unbind_request" && String(value_269.requestId || value_269.id || "") === pendingLovesUnbindRequest_267.requestId && value_269.requestStatus === "pending";
  });
  return result_268 || {
    id: pendingLovesUnbindRequest_267.requestId,
    requestId: pendingLovesUnbindRequest_267.requestId,
    type: "loves_unbind_request",
    role: "user",
    requestStatus: "pending",
    timestamp: pendingLovesUnbindRequest_267.createdAt
  };
};
window.imApp.createLovesUnbindRequestMessage = function (categoryName_2, value_271 = Date.now()) {
  const trim_272 = String(categoryName_2 || "").trim();
  if (!trim_272) return null;
  return {
    id: trim_272,
    requestId: trim_272,
    role: "user",
    type: "loves_unbind_request",
    requestStatus: "pending",
    content: "User 申请解除 Loves 关系",
    text: "申请解除 Loves 关系",
    timestamp: Math.max(0, Number(value_271) || Date.now())
  };
};
window.imApp.reconcilePendingLovesUnbindRequest = async function (value_273) {
  const targetId_2 = value_273?.id ?? value_273;
  if (targetId_2 == null) return null;
  let value_275 = window.imApp.getFriendById?.(targetId_2) || value_273;
  if (!value_275 || value_275.type === "group" || value_275.type === "official") return null;
  window.imApp.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(value_275));
  value_275 = window.imApp.getFriendById?.(targetId_2) || value_275;
  const pendingLovesUnbindRequest_276 = window.imApp.normalizePendingLovesUnbindRequest(value_275?.pendingLovesUnbindRequest);
  if (!pendingLovesUnbindRequest_276) return null;
  const selected = (Array.isArray(value_275.messages) ? value_275.messages : []).find(value_279 => {
    return value_279?.type === "loves_unbind_request" && String(value_279.requestId || value_279.id || "") === pendingLovesUnbindRequest_276.requestId && value_279.requestStatus === "pending";
  });
  if (selected) return selected;
  const lovesUnbindRequestMessage = window.imApp.createLovesUnbindRequestMessage(pendingLovesUnbindRequest_276.requestId, pendingLovesUnbindRequest_276.createdAt);
  if (!lovesUnbindRequestMessage || !window.imApp.appendFriendMessage) return null;
  const value_278 = await window.imApp.appendFriendMessage(value_275.id, lovesUnbindRequestMessage, {
    silent: true
  });
  return value_278 ? lovesUnbindRequestMessage : null;
};
window.imApp.submitLovesUnbindRequest = async function (value_280) {
  const value_281 = value_280?.id ?? value_280;
  let value_282 = window.imApp.getFriendById?.(value_281) || value_280;
  if (!value_282 || value_282.type === "group" || value_282.type === "official" || value_282.hasLovesSpace !== true) return null;
  window.imApp.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(value_282));
  value_282 = window.imApp.getFriendById?.(value_281) || value_282;
  if (!value_282 || value_282.type === "group" || value_282.type === "official" || value_282.hasLovesSpace !== true) return null;
  if (window.imApp.getPendingLovesUnbindRequest(value_282)) return null;
  const createdAt_7 = Date.now(),
    requestId_3 = window.imChat?.createMessageId ? window.imChat.createMessageId("loves-unbind") : "loves-unbind-" + createdAt_7,
    targetMessage_2 = window.imApp.createLovesUnbindRequestMessage(requestId_3, createdAt_7);
  if (!targetMessage_2) return null;
  let enabled_286 = false;
  const value_287 = await window.imApp.commitScopedFriendChange(value_282.id, targetFriend_3 => {
    if (targetFriend_3.hasLovesSpace !== true || window.imApp.getPendingLovesUnbindRequest(targetFriend_3)) return;
    if (!Array.isArray(targetFriend_3.messages)) targetFriend_3.messages = [];
    targetFriend_3.pendingLovesUnbindRequest = {
      requestId: requestId_3,
      createdAt: createdAt_7,
      status: "pending"
    };
    targetFriend_3.messages.push(targetMessage_2);
    enabled_286 = true;
  }, {
    silent: true,
    immediate: true,
    metaOnly: false,
    syncActive: true
  });
  if (!value_287 || !enabled_286) return null;
  const value_288 = window.imApp.getFriendById?.(value_282.id) || value_282,
    querySelector_289 = document.querySelector("#chat-interface-" + value_282.id + " .ins-chat-messages");
  return querySelector_289 && window.imChat?.rerenderChatContainer && window.imChat.rerenderChatContainer(value_288, querySelector_289, {
    scroll: true
  }), targetMessage_2;
};
window.imApp.resolveLovesUnbindRequest = async function (value_291, categoryName_3, value_293, value_294 = {}) {
  const value_295 = value_291?.id ?? value_291;
  let value_296 = window.imApp.getFriendById?.(value_295) || value_291;
  const requestId_4 = String(categoryName_3 || "").trim(),
    decision_3 = value_293 === "accept" ? "accept" : value_293 === "reject" ? "reject" : "";
  if (!value_296 || !requestId_4 || !decision_3) return false;
  await window.imApp.reconcilePendingLovesUnbindRequest?.(value_296);
  value_296 = window.imApp.getFriendById?.(value_295) || value_296;
  if (!value_296) return false;
  const decidedAt_2 = Date.now();
  let message_5 = false;
  const excludedRecord = await window.imApp.commitScopedFriendChange(value_296.id, value_304 => {
    const pendingLovesUnbindRequest_305 = window.imApp.normalizePendingLovesUnbindRequest(value_304.pendingLovesUnbindRequest),
      result_306 = (value_304.messages || []).find(value_307 => {
        return value_307?.type === "loves_unbind_request" && String(value_307.requestId || value_307.id || "") === requestId_4;
      });
    if (!pendingLovesUnbindRequest_305 || pendingLovesUnbindRequest_305.requestId !== requestId_4 || !result_306 || result_306.requestStatus !== "pending") return;
    result_306.requestStatus = decision_3 === "accept" ? "accepted" : "rejected";
    result_306.decision = decision_3;
    result_306.decidedAt = decidedAt_2;
    value_304.pendingLovesUnbindRequest = null;
    decision_3 === "accept" && (value_304.hasLovesSpace = false, value_304.pendingLovesInvite = false);
    value_304.messages.push({
      id: window.imChat?.createMessageId ? window.imChat.createMessageId("loves-unbind-result") : "loves-unbind-result-" + decidedAt_2,
      requestId: requestId_4,
      role: "assistant",
      type: "loves_unbind_decision",
      decision: decision_3,
      requestStatus: decision_3 === "accept" ? "accepted" : "rejected",
      content: decision_3 === "accept" ? "Char 已同意解绑" : "Char 已拒绝解绑",
      text: decision_3 === "accept" ? "Char 已同意解绑" : "Char 已拒绝解绑",
      timestamp: decidedAt_2,
      decidedAt: decidedAt_2,
      apiRunId: String(value_294.apiRunId || "")
    });
    message_5 = true;
  }, {
    silent: true,
    immediate: true,
    metaOnly: false,
    syncActive: true
  });
  if (!excludedRecord || !message_5) return false;
  const value_302 = window.imApp.getFriendById?.(value_296.id) || value_296,
    querySelector_303 = document.querySelector("#chat-interface-" + value_296.id + " .ins-chat-messages");
  return querySelector_303 && window.imChat?.rerenderChatContainer && window.imChat.rerenderChatContainer(value_302, querySelector_303, {
    scroll: true
  }), window.lovesApp?.handleUnbindDecision?.(value_302, decision_3), true;
};
window.imApp.getPendingUnblockRequest = function (friend_7, value_309) {
  const value_310 = value_309 === "assistant" ? "assistant" : "user";
  return (Array.isArray(friend_7?.messages) ? friend_7.messages : []).slice().reverse().find(value_311 => value_311?.type === "unblock_request" && value_311.requesterRole === value_310 && value_311.requestStatus === "pending") || null;
};
window.imApp.createChatBlockNotice = function (noticeKind_4, timestamp_5 = Date.now()) {
  const options_314 = {
    user_blocked_char: "你已将对方拉黑",
    char_blocked_user: "你已被拉黑",
    user_unblocked_char: "你已解除拉黑",
    char_unblocked_user: "对方已解除拉黑"
  };
  return {
    id: window.imChat?.createMessageId ? window.imChat.createMessageId("notice") : "notice-" + timestamp_5,
    role: "system",
    type: "system_notice",
    noticeKind: noticeKind_4,
    content: options_314[noticeKind_4] || "拉黑状态已更新",
    text: options_314[noticeKind_4] || "拉黑状态已更新",
    timestamp: timestamp_5
  };
};
window.imApp.commitChatBlockState = async function (value_315, value_316, value_317, item_7 = {}) {
  const value_319 = window.imApp.getFriendById?.(value_315) || value_315;
  if (!value_319 || value_319.type === "group" || value_319.type === "official") return false;
  const value_320 = value_316 === "userBlocksChar",
    value_321 = value_320 ? "userBlocksChar" : "charBlocksUser",
    value_322 = value_320 ? "userBlockedAt" : "charBlockedAt",
    value_323 = value_320 ? "userBlockReason" : "charBlockReason",
    value_324 = value_317 ? value_320 ? "user_blocked_char" : "char_blocked_user" : value_320 ? "user_unblocked_char" : "char_unblocked_user",
    decidedAt_3 = Date.now(),
    value_326 = await window.imApp.commitScopedFriendChange(value_319.id, targetFriend_4 => {
      targetFriend_4.blockState = window.imApp.normalizeChatBlockState(targetFriend_4.blockState);
      targetFriend_4.blockState[value_321] = value_317 === true;
      targetFriend_4.blockState[value_322] = value_317 ? decidedAt_3 : 0;
      targetFriend_4.blockState[value_323] = value_317 ? String(item_7.reason || "").trim().slice(0, 500) : "";
      if (!Array.isArray(targetFriend_4.messages)) targetFriend_4.messages = [];
      !value_317 && value_320 && targetFriend_4.messages.forEach(value_330 => {
        value_330?.type === "unblock_request" && value_330.requesterRole === "assistant" && value_330.requestStatus === "pending" && (value_330.requestStatus = item_7.requestStatus || "resolved", value_330.decidedAt = decidedAt_3, value_330.decision = item_7.decision || "unblocked");
      });
      !value_317 && !value_320 && targetFriend_4.messages.forEach(value_331 => {
        value_331?.type === "unblock_request" && value_331.requesterRole === "user" && value_331.requestStatus === "pending" && (value_331.requestStatus = item_7.requestStatus || "accepted", value_331.decidedAt = decidedAt_3, value_331.decision = item_7.decision || "accept");
      });
      const targetMessage_3 = window.imApp.createChatBlockNotice(value_324, decidedAt_3);
      if (value_317 && item_7.reason) targetMessage_3.payload = {
        reason: String(item_7.reason).trim().slice(0, 500)
      };
      targetFriend_4.messages.push(targetMessage_3);
    }, {
      silent: true,
      immediate: true,
      metaOnly: false,
      syncActive: true,
      syncSettings: true
    }),
    value_327 = window.imApp.getFriendById?.(value_319.id) || value_319,
    querySelector_328 = document.querySelector("#chat-interface-" + value_319.id + " .ins-chat-messages");
  return value_326 && querySelector_328 && window.imChat?.rerenderChatContainer && window.imChat.rerenderChatContainer(value_327, querySelector_328, {
    scroll: true
  }), value_326;
};
window.imApp.submitUnblockRequest = async function (value_332, value_333, categoryName_4, value_335 = {}) {
  const value_336 = window.imApp.getFriendById?.(value_332) || value_332,
    value_337 = value_333 === "assistant" ? "assistant" : "user",
    slice_338 = String(categoryName_4 || "").trim().slice(0, 500);
  if (!value_336 || value_336.type === "group" || value_336.type === "official" || !slice_338) return null;
  if (window.imApp.getPendingUnblockRequest(value_336, value_337)) return null;
  const timestamp_6 = Date.now(),
    options_340 = {
      id: window.imChat?.createMessageId ? window.imChat.createMessageId("unblock") : "unblock-" + timestamp_6,
      role: value_337,
      type: "unblock_request",
      requesterRole: value_337,
      requestText: slice_338,
      requestStatus: "pending",
      content: slice_338,
      timestamp: timestamp_6,
      apiRunId: value_335.apiRunId || ""
    },
    value_341 = await window.imApp.appendFriendMessage(value_336.id, options_340, {
      silent: true,
      immediate: true
    });
  if (!value_341) return null;
  const value_342 = window.imApp.getFriendById?.(value_336.id) || value_336,
    querySelector_343 = document.querySelector("#chat-interface-" + value_336.id + " .ins-chat-messages");
  return querySelector_343 && window.imChat?.rerenderChatContainer && window.imChat.rerenderChatContainer(value_342, querySelector_343, {
    scroll: true
  }), options_340;
};
window.imApp.resolveUnblockRequest = async function (value_344, value_345, value_346) {
  const excludedRecord_2 = window.imApp.getFriendById?.(value_344) || value_344,
    decision_2 = value_346 === "accept" ? "accept" : value_346 === "reject" ? "reject" : "";
  if (!excludedRecord_2 || !decision_2) return false;
  const decidedAt_4 = Date.now();
  let message_6 = "";
  const excludedRecord_3 = await window.imApp.commitScopedFriendChange(excludedRecord_2.id, value_354 => {
    const result_355 = (value_354.messages || []).find(value_356 => String(value_356?.id || "") === String(value_345));
    if (!result_355 || result_355.type !== "unblock_request" || result_355.requestStatus !== "pending") return;
    message_6 = result_355.requesterRole;
    result_355.requestStatus = decision_2 === "accept" ? "accepted" : "rejected";
    result_355.decision = decision_2;
    result_355.decidedAt = decidedAt_4;
    if (decision_2 === "accept") {
      value_354.blockState = window.imApp.normalizeChatBlockState(value_354.blockState);
      result_355.requesterRole === "assistant" ? (value_354.blockState.userBlocksChar = false, value_354.blockState.userBlockedAt = 0, value_354.blockState.userBlockReason = "") : (value_354.blockState.charBlocksUser = false, value_354.blockState.charBlockedAt = 0, value_354.blockState.charBlockReason = "");
      const value_357 = result_355.requesterRole === "assistant" ? "user_unblocked_char" : "char_unblocked_user";
      value_354.messages.push(window.imApp.createChatBlockNotice(value_357, decidedAt_4));
    }
  }, {
    silent: true,
    immediate: true,
    metaOnly: false,
    syncActive: true,
    syncSettings: true
  });
  if (!excludedRecord_3 || !message_6) return false;
  const value_352 = window.imApp.getFriendById?.(excludedRecord_2.id) || excludedRecord_2,
    querySelector_353 = document.querySelector("#chat-interface-" + excludedRecord_2.id + " .ins-chat-messages");
  return querySelector_353 && window.imChat?.rerenderChatContainer && window.imChat.rerenderChatContainer(value_352, querySelector_353, {
    scroll: true
  }), true;
};
window.imApp.createMemoryRequestMessage = function (value_358, message_359 = {}) {
  const entry_2 = value_358 && typeof value_358 === "object" ? value_358 : {},
    value_361 = (categoryName_5, value_367 = 1200) => String(categoryName_5 || "").trim().slice(0, value_367),
    content_6 = value_361(entry_2.content, 1800);
  if (!content_6) return null;
  const timestamp_7 = Number(message_359.timestamp) || Date.now(),
    value_361_364 = value_361(message_359.requestId || (window.imChat?.createMessageId ? window.imChat.createMessageId("memory-request") : "memory-request-" + timestamp_7 + "-" + Math.random().toString(36).slice(2, 8)), 160);
  if (!value_361_364) return null;
  const normalizeMemoryTriggerKeywords_365 = window.imChat?.normalizeMemoryTriggerKeywords;
  return {
    id: value_361_364,
    memoryRequestId: value_361_364,
    role: "assistant",
    type: "memory_request",
    requestStatus: "pending",
    excludedFromContext: true,
    content: content_6,
    timestamp: timestamp_7,
    apiRunId: String(message_359.apiRunId || ""),
    memoryPayload: {
      title: value_361(entry_2.title || "珍视回忆", 120) || "珍视回忆",
      content: content_6,
      detail: value_361(entry_2.detail, 1800),
      reason: value_361(entry_2.reason, 1200),
      createdAt: value_361(entry_2.createdAt || message_359.createdAt, 120),
      sourceThought: value_361(entry_2.sourceThought, 1800),
      triggerKeywords: typeof normalizeMemoryTriggerKeywords_365 === "function" ? normalizeMemoryTriggerKeywords_365(entry_2.triggerKeywords || []) : Array.isArray(entry_2.triggerKeywords) ? entry_2.triggerKeywords.map(value_368 => value_361(value_368, 32)).filter(Boolean).slice(0, 6) : []
    }
  };
};
const pendingMemoryRequestDecisions = new Set();
window.imApp.resolveMemoryRequest = async function (value_369, categoryName_6, value_371) {
  const value_372 = window.imApp.getFriendById?.(value_369) || value_369,
    sourceEventId_2 = String(categoryName_6 || "").trim();
  if (!value_372 || value_372.type === "group" || !sourceEventId_2 || !["confirm", "cancel"].includes(value_371) || !window.imStorage?.commitMemoryRequestDecision) return false;
  const key_3 = value_372.id + ":" + sourceEventId_2;
  if (pendingMemoryRequestDecisions.has(key_3)) return false;
  pendingMemoryRequestDecisions.add(key_3);
  try {
    const value_375 = async () => {
      const result_376 = (Array.isArray(value_372.messages) ? value_372.messages : []).find(value_381 => value_381?.type === "memory_request" && String(value_381.memoryRequestId || value_381.id || "") === sourceEventId_2);
      if (!result_376 || result_376.requestStatus !== "pending") return false;
      const message_377 = result_376.memoryPayload && typeof result_376.memoryPayload === "object" ? result_376.memoryPayload : {},
        content_7 = String(message_377.content || result_376.content || "").trim();
      if (value_371 === "confirm" && !content_7) return false;
      let memory_6 = null;
      if (value_371 === "confirm") {
        const memory_2 = value_372.memory && typeof value_372.memory === "object" ? value_372.memory : window.imApp.createDefaultMemory(),
          options_383 = {
            id: "cherished-" + sourceEventId_2,
            title: String(message_377.title || "珍视回忆").trim() || "珍视回忆",
            content: content_7,
            detail: String(message_377.detail || "").trim(),
            reason: String(message_377.reason || "").trim(),
            sourceEventId: sourceEventId_2,
            createdAt: String(message_377.createdAt || "").trim(),
            sourceThought: String(message_377.sourceThought || value_372.profilePanel?.thought || value_372.latestThought || "").trim(),
            triggerKeywords: typeof window.imChat?.normalizeMemoryTriggerKeywords === "function" ? window.imChat.normalizeMemoryTriggerKeywords(message_377.triggerKeywords || []) : Array.isArray(message_377.triggerKeywords) ? message_377.triggerKeywords : []
          },
          value_384 = Array.isArray(memory_2.cherishedEntries) ? memory_2.cherishedEntries : [],
          some_385 = value_384.some(message_388 => message_388 && (String(message_388.sourceEventId || "") === sourceEventId_2 || String(message_388.content || "").trim() === options_383.content)),
          trim_386 = [options_383.title ? "【" + options_383.title + "】" : "", options_383.content, options_383.reason ? "原因：" + options_383.reason : ""].filter(Boolean).join("\n").trim(),
          trim_387 = String(memory_2.cherished || "").trim();
        memory_6 = {
          ...memory_2,
          cherishedEntries: some_385 ? value_384 : [...value_384, options_383],
          cherished: trim_386 && !trim_387.includes(options_383.content) ? trim_387 ? trim_387 + "\n\n" + trim_386 : trim_386 : trim_387
        };
      }
      const value_380 = await window.imStorage.commitMemoryRequestDecision(value_372.id, result_376, memory_6, value_371);
      if (!value_380) return false;
      if (memory_6) {
        value_372.memory = memory_6;
        const result_389 = window.imApp.saveState?.pendingFriendPatches?.get(String(value_372.id));
        result_389 && Object.prototype.hasOwnProperty.call(result_389, "memory") && (result_389.memory = memory_6);
      }
      return result_376.requestStatus = value_380.status, result_376.decidedAt = value_380.decidedAt, true;
    };
    return window.imApp.runFriendPersistenceTask ? await window.imApp.runFriendPersistenceTask(value_372.id, value_375) : await value_375();
  } catch (value_390) {
    return console.error("Failed to resolve memory request", value_390), false;
  } finally {
    pendingMemoryRequestDecisions["delete"](key_3);
  }
};
window.imApp.normalizeUserPhoneAccess = function (mount_5) {
  const source_15 = mount_5 && typeof mount_5 === "object" && !Array.isArray(mount_5) ? mount_5 : {},
    value_393 = (categoryName_7, value_401 = 500) => String(categoryName_7 || "").trim().slice(0, value_401),
    value_394 = (value_402, value_403 = 200) => {
      const value_404 = new Set();
      return (Array.isArray(value_402) ? value_402 : []).map(value_405 => value_393(value_405, 160)).filter(value_406 => {
        if (!value_406 || value_404.has(value_406)) return false;
        return value_404.add(value_406), true;
      }).slice(0, value_403);
    },
    privateFindings_2 = (Array.isArray(source_15.privateFindings) ? source_15.privateFindings : []).map((item_8, value_408) => {
      if (!item_8 || typeof item_8 !== "object") return null;
      const charIds_2 = value_394(item_8.charIds, 100),
        summary_3 = value_393(item_8.summary, 2400);
      if (!summary_3 || charIds_2.length === 0) return null;
      const createdAt_4 = Math.max(0, Number(item_8.createdAt) || 0);
      return {
        id: value_393(item_8.id, 180) || "user-phone-finding-" + (createdAt_4 || value_408),
        createdAt: createdAt_4,
        triggerUserMessageId: value_393(item_8.triggerUserMessageId, 180),
        apiRunId: value_393(item_8.apiRunId, 180),
        source: value_393(item_8.source, 80),
        reason: value_393(item_8.reason, 300),
        charIds: charIds_2,
        scopeKey: value_393(item_8.scopeKey, 2000),
        summary: summary_3,
        timeAssessment: value_393(item_8.timeAssessment, 1200),
        emotionalReaction: value_393(item_8.emotionalReaction, 800),
        responseHints: (Array.isArray(item_8.responseHints) ? item_8.responseHints : []).map(value_412 => value_393(value_412, 500)).filter(Boolean).slice(0, 8)
      };
    }).filter(Boolean).sort((value_413, value_414) => value_413.createdAt - value_414.createdAt).slice(-20),
    accessLog_2 = (Array.isArray(source_15.accessLog) ? source_15.accessLog : []).map((item_9, value_416) => {
      if (!item_9 || typeof item_9 !== "object") return null;
      const createdAt_5 = Math.max(0, Number(item_9.createdAt) || 0);
      return {
        id: value_393(item_9.id, 180) || "user-phone-log-" + (createdAt_5 || value_416),
        createdAt: createdAt_5,
        status: item_9.status === "success" ? "success" : "failed",
        mode: item_9.mode === "auto" ? "auto" : "chat",
        outcome: ["sent", "silent", "used", "failed"].includes(item_9.outcome) ? item_9.outcome : item_9.status === "success" ? "used" : "failed",
        source: value_393(item_9.source, 80),
        apiRunId: value_393(item_9.apiRunId, 180),
        reason: value_393(item_9.reason, 300),
        contacts: (Array.isArray(item_9.contacts) ? item_9.contacts : []).map(value_418 => ({
          id: value_393(value_418?.id, 160),
          remark: value_393(value_418?.remark, 160)
        })).filter(value_419 => value_419.id || value_419.remark).slice(0, 100),
        error: value_393(item_9.error, 500)
      };
    }).filter(Boolean).sort((value_420, value_421) => value_420.createdAt - value_421.createdAt).slice(-50),
    value_397 = source_15.autoTrigger && typeof source_15.autoTrigger === "object" ? source_15.autoTrigger : {},
    frequency_2 = ["low", "medium", "high"].includes(value_397.frequency) ? value_397.frequency : "medium",
    enabled_5 = source_15.enabled === true;
  return {
    enabled: enabled_5,
    apiPresetId: value_393(source_15.apiPresetId, 180),
    allowedCharIds: value_394(source_15.allowedCharIds, 200),
    autoTrigger: {
      enabled: enabled_5 && value_397.enabled === true,
      frequency: frequency_2,
      nextRunAt: enabled_5 && value_397.enabled === true ? Math.max(0, Number(value_397.nextRunAt) || 0) : 0,
      lastRunAt: Math.max(0, Number(value_397.lastRunAt) || 0)
    },
    privateFindings: privateFindings_2,
    accessLog: accessLog_2
  };
};
window.imApp.normalizeFriendData = function (friend_8) {
  const normalized_2 = {
    ...friend_8
  };
  normalized_2.lovesData && typeof normalized_2.lovesData === "object" && Object.prototype.hasOwnProperty.call(normalized_2.lovesData, "diaries") && (normalized_2.lovesData = {
    ...normalized_2.lovesData
  }, delete normalized_2.lovesData.diaries);
  normalized_2.id = normalized_2.id != null ? normalized_2.id : Date.now();
  normalized_2.type = normalized_2.type || "char";
  const isGroupChat_2 = normalized_2.type === "group",
    value_425 = normalized_2.type === "official";
  normalized_2.officialConversationActive = value_425 && normalized_2.officialConversationActive === true;
  normalized_2.officialApiPresetId = value_425 ? String(normalized_2.officialApiPresetId || "").trim() : "";
  normalized_2.realName = normalized_2.realName || "";
  normalized_2.nickname = normalized_2.nickname || (normalized_2.type === "npc" ? "New NPC" : "New Friend");
  normalized_2.signature = normalized_2.signature || "No Signature";
  normalized_2.persona = normalized_2.persona || "";
  normalized_2.relationship = typeof normalized_2.relationship === "string" ? normalized_2.relationship.trim() : "";
  normalized_2.avatarUrl = normalized_2.avatarUrl || null;
  normalized_2.avatarAssetId = normalized_2.avatarAssetId || null;
  normalized_2.imageFaceReferenceUrl = normalized_2.imageFaceReferenceUrl || null;
  normalized_2.imageFaceReferenceAssetId = normalized_2.imageFaceReferenceAssetId || null;
  normalized_2.imageFaceReferenceFileName = normalized_2.imageFaceReferenceFileName || "";
  const imagePromptConfig_2 = normalized_2.imagePromptConfig && typeof normalized_2.imagePromptConfig === "object" ? normalized_2.imagePromptConfig : {},
    promptPresetIds = new Set(),
    presets_4 = (Array.isArray(imagePromptConfig_2.presets) ? imagePromptConfig_2.presets : []).map((preset_3, value_441) => {
      if (!preset_3 || typeof preset_3 !== "object") return null;
      const name_4 = String(preset_3.name || "").trim().slice(0, 80),
        slice_443 = String(preset_3.basePrompt ?? preset_3.prompt ?? "").trim().slice(0, 8000);
      if (!name_4 || !slice_443) return null;
      const id_4 = String(preset_3.id || "image-preset-" + normalized_2.id + "-" + value_441).trim();
      if (!id_4 || promptPresetIds.has(id_4)) return null;
      promptPresetIds.add(id_4);
      const createdAt_6 = Math.max(0, Number(preset_3.createdAt) || Date.now());
      return {
        id: id_4,
        name: name_4,
        prompt: slice_443,
        basePrompt: slice_443,
        charAppearance: String(preset_3.charAppearance || "").trim().slice(0, 4000),
        userAppearance: String(preset_3.userAppearance || "").trim().slice(0, 4000),
        artistPrompt: String(preset_3.artistPrompt || "").trim().slice(0, 4000),
        negativePrompt: String(preset_3.negativePrompt || "").trim().slice(0, 4000),
        createdAt: createdAt_6,
        updatedAt: Math.max(createdAt_6, Number(preset_3.updatedAt) || createdAt_6)
      };
    }).filter(Boolean).slice(0, 30),
    activePresetId_2 = promptPresetIds.has(String(imagePromptConfig_2.activePresetId || "").trim()) ? String(imagePromptConfig_2.activePresetId).trim() : "",
    slice_430 = String(imagePromptConfig_2.basePrompt ?? imagePromptConfig_2.lastPrompt ?? "").trim().slice(0, 8000);
  normalized_2.imagePromptConfig = {
    charAppearance: String(imagePromptConfig_2.charAppearance || "").trim().slice(0, 4000),
    userAppearance: String(imagePromptConfig_2.userAppearance || "").trim().slice(0, 4000),
    artistPrompt: String(imagePromptConfig_2.artistPrompt || "").trim().slice(0, 4000),
    negativePrompt: String(imagePromptConfig_2.negativePrompt || "").trim().slice(0, 4000),
    basePrompt: slice_430,
    lastPrompt: slice_430,
    activePresetId: activePresetId_2,
    autoGenerate: imagePromptConfig_2.autoGenerate === true,
    autoUseReferenceFace: imagePromptConfig_2.autoUseReferenceFace === true && !!(normalized_2.imageFaceReferenceUrl || normalized_2.imageFaceReferenceAssetId),
    presets: presets_4
  };
  normalized_2.messages = Array.isArray(normalized_2.messages) ? normalized_2.messages : [];
  normalized_2.userPhoneAccess = window.imApp.normalizeUserPhoneAccess(normalized_2.userPhoneAccess);
  normalized_2.type !== "char" && (normalized_2.userPhoneAccess.enabled = false, normalized_2.userPhoneAccess.autoTrigger.enabled = false, normalized_2.userPhoneAccess.autoTrigger.nextRunAt = 0);
  normalized_2.language = String(normalized_2.language || "zh").trim() || "zh";
  const chatMessageRange = window.imDataUtils?.normalizeChatMessageRange ? window.imDataUtils.normalizeChatMessageRange(normalized_2.messageCountMin, normalized_2.messageCountMax, 2, 8) : {
    min: Math.min(20, Math.max(1, Math.round(Number(normalized_2.messageCountMin) || 2))),
    max: Math.min(20, Math.max(1, Math.round(Number(normalized_2.messageCountMax) || 8)))
  };
  normalized_2.messageCountMin = chatMessageRange.min;
  normalized_2.messageCountMax = Math.max(chatMessageRange.min, chatMessageRange.max);
  normalized_2.favoriteUserMessages = window.imApp.normalizeFavoriteUserMessages(normalized_2.favoriteUserMessages);
  normalized_2.anonymousQa = window.imGame?.normalizeAnonymousQaData ? window.imGame.normalizeAnonymousQaData(normalized_2.anonymousQa) : {
    entries: []
  };
  normalized_2.chatBg = normalized_2.chatBg || null;
  normalized_2.chatBgAssetId = normalized_2.chatBgAssetId || null;
  normalized_2.customCssEnabled = !!normalized_2.customCssEnabled;
  normalized_2.customCss = normalized_2.customCss || "";
  normalized_2.chatCssEnabled = !!normalized_2.chatCssEnabled;
  normalized_2.chatCss = normalized_2.chatCss || "";
  normalized_2.statusCssEnabled = !!normalized_2.statusCssEnabled;
  normalized_2.statusCss = normalized_2.statusCss || "";
  normalized_2.statusCssPrompt = isGroupChat_2 ? "" : typeof normalized_2.statusCssPrompt === "string" ? normalized_2.statusCssPrompt : "";
  normalized_2.statusCssAppliedAt = isGroupChat_2 ? 0 : Math.max(0, Number(normalized_2.statusCssAppliedAt) || 0);
  const statusRenderMode_2 = String(normalized_2.statusRenderMode || "").trim();
  normalized_2.isPinned = !!normalized_2.isPinned;
  normalized_2.unreadCount = Math.max(0, Number(normalized_2.unreadCount) || 0);
  normalized_2.showTimestamp = !!normalized_2.showTimestamp;
  normalized_2.timeAware = normalized_2.timeAware !== false;
  normalized_2.locationProfile = window.imDataUtils?.normalizeLocationProfile ? window.imDataUtils.normalizeLocationProfile(normalized_2.locationProfile) : {
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
    timeDifferenceEnabled: false
  };
  if (normalized_2.timeAware === false) normalized_2.locationProfile.timeDifferenceEnabled = false;
  normalized_2.allowRoleRecall = normalized_2.allowRoleRecall !== false;
  normalized_2.allowCharBlock = !isGroupChat_2 && normalized_2.allowCharBlock === true;
  normalized_2.blockState = isGroupChat_2 ? window.imApp.normalizeChatBlockState(null) : window.imApp.normalizeChatBlockState(normalized_2.blockState);
  normalized_2.pendingLovesUnbindRequest = isGroupChat_2 ? null : window.imApp.normalizePendingLovesUnbindRequest(normalized_2.pendingLovesUnbindRequest);
  !isGroupChat_2 && normalized_2.messages.forEach(target_3 => {
    if (!target_3 || typeof target_3 !== "object") return;
    if (target_3.type === "unblock_request") {
      target_3.requesterRole !== "assistant" && target_3.requesterRole !== "user" && (target_3.requesterRole = target_3.role === "assistant" ? "assistant" : "user");
      if (!target_3.requestText) target_3.requestText = String(target_3.content || "").slice(0, 500);
      !["pending", "accepted", "rejected", "resolved"].includes(target_3.requestStatus) && (target_3.requestStatus = "pending");
      return;
    }
    if (target_3.type === "loves_unbind_request") {
      target_3.requestId = String(target_3.requestId || target_3.id || "");
      if (!["pending", "accepted", "rejected"].includes(target_3.requestStatus)) target_3.requestStatus = "pending";
      return;
    }
    if (target_3.type === "loves_unbind_decision") {
      target_3.requestId = String(target_3.requestId || "");
      target_3.decision = target_3.decision === "accept" ? "accept" : "reject";
      target_3.requestStatus = target_3.decision === "accept" ? "accepted" : "rejected";
      return;
    }
    if (target_3.type === "together_listening_invite") {
      target_3.role = "assistant";
      target_3.trackId = String(target_3.trackId || "");
      target_3.playlistId = String(target_3.playlistId || "");
      target_3.playlistName = String(target_3.playlistName || "未命名歌单");
      target_3.title = String(target_3.title || "未知歌曲");
      target_3.artist = String(target_3.artist || "未知歌手");
      target_3.inviteStatus = target_3.inviteStatus === "accepted" ? "accepted" : "pending";
      return;
    }
    if (target_3.type === "user_phone_access_card") {
      const value_450 = (value_12, value_453 = 1200) => String(value_12 || "").replace(/\s+/g, " ").trim().slice(0, value_453),
        visits_2 = (Array.isArray(target_3.visits) ? target_3.visits : []).map(value_454 => {
          if (!value_454 || typeof value_454 !== "object") return null;
          const charId_2 = value_450(value_454.charId, 160),
            remark_3 = value_450(value_454.remark, 160),
            innerOs_2 = String(value_454.innerOs || "").replace(/\s+/g, " ").trim(),
            durationSeconds_2 = Math.min(120, Math.max(1, Math.round(Number(value_454.durationSeconds) || 1)));
          if (!charId_2 || !remark_3 || !innerOs_2) return null;
          return {
            charId: charId_2,
            remark: remark_3,
            durationSeconds: durationSeconds_2,
            innerOs: innerOs_2
          };
        }).filter(Boolean).slice(0, 100);
      target_3.role = "assistant";
      target_3.content = "查手机记录";
      target_3.excludedFromContext = true;
      target_3.phoneAccessMode = target_3.phoneAccessMode === "auto" ? "auto" : "chat";
      target_3.visits = visits_2;
      target_3.totalDurationSeconds = visits_2.reduce((value_459, value_460) => value_459 + value_460.durationSeconds, 0);
      target_3.apiRunId = value_450(target_3.apiRunId, 180);
      return;
    }
    if (target_3.type === "system_notice" && ["user_phone_access", "user_remark_changed"].includes(target_3.noticeKind)) {
      target_3.role = "system";
      target_3.excludedFromContext = true;
      target_3.apiRunId = String(target_3.apiRunId || "").trim().slice(0, 180);
      return;
    }
    if (target_3.type === "memory_request") {
      const value_461 = (categoryName_8, value_465 = 1200) => String(categoryName_8 || "").trim().slice(0, value_465),
        entry_3 = target_3.memoryPayload && typeof target_3.memoryPayload === "object" ? target_3.memoryPayload : {},
        memoryRequestId_2 = value_461(target_3.memoryRequestId || target_3.id || "memory-request-" + (target_3.timestamp || 0), 160),
        content_8 = value_461(entry_3.content || target_3.requestText || target_3.content, 1800);
      target_3.role = "assistant";
      target_3.excludedFromContext = true;
      target_3.memoryRequestId = memoryRequestId_2;
      target_3.requestStatus = ["pending", "confirmed", "cancelled"].includes(target_3.requestStatus) ? target_3.requestStatus : Array.isArray(normalized_2.memory?.cherishedEntries) && normalized_2.memory.cherishedEntries.some(item => String(item?.sourceEventId || "") === memoryRequestId_2) ? "confirmed" : "pending";
      target_3.memoryPayload = {
        title: value_461(entry_3.title || "珍视回忆", 120) || "珍视回忆",
        content: content_8,
        detail: value_461(entry_3.detail, 1800),
        reason: value_461(entry_3.reason, 1200),
        createdAt: value_461(entry_3.createdAt || target_3.requestTime, 120),
        sourceThought: value_461(entry_3.sourceThought, 1800),
        triggerKeywords: Array.isArray(entry_3.triggerKeywords) ? entry_3.triggerKeywords.map(value_466 => value_461(value_466, 32)).filter(Boolean).slice(0, 6) : []
      };
      return;
    }
    if (target_3.type === "system_notice" || target_3.type && target_3.type !== "text") return;
    const value_447 = Number(target_3.timestamp) || 0,
      value_448 = target_3.role === "user" && normalized_2.blockState.charBlocksUser === true && normalized_2.blockState.charBlockedAt > 0 && value_447 >= normalized_2.blockState.charBlockedAt,
      value_449 = target_3.role === "assistant" && normalized_2.blockState.userBlocksChar === true && normalized_2.blockState.userBlockedAt > 0 && value_447 >= normalized_2.blockState.userBlockedAt;
    target_3.deliveryStatus !== "blocked" && (value_448 || value_449) && (target_3.deliveryStatus = "blocked", target_3.excludedFromContext = true, target_3.blockedDirection = value_448 ? "char_blocks_user" : "user_blocks_char");
  });
  normalized_2.allowGroupMemberPrivateChats = isGroupChat_2 && normalized_2.allowGroupMemberPrivateChats !== false;
  normalized_2.allowGroupMemberFriendPrivateChats = isGroupChat_2 && normalized_2.allowGroupMemberFriendPrivateChats !== false;
  normalized_2.autoExpandTranslation = normalized_2.autoExpandTranslation === true;
  normalized_2.showGroupUserAvatar = isGroupChat_2 && normalized_2.showGroupUserAvatar === true;
  normalized_2.onlinePromptPresetId = typeof normalized_2.onlinePromptPresetId === "string" ? normalized_2.onlinePromptPresetId.trim() : "";
  const cotDefaultVersion_2 = Number(normalized_2.cotDefaultVersion) || 0;
  normalized_2.cotEnabled = cotDefaultVersion_2 >= 2 && normalized_2.cotEnabled === true;
  normalized_2.cotDefaultVersion = 2;
  normalized_2.cotPrompt = typeof normalized_2.cotPrompt === "string" ? normalized_2.cotPrompt : "";
  normalized_2.statusPromptEnabled = normalized_2.statusPromptEnabled === true;
  normalized_2.statusPrompt = typeof normalized_2.statusPrompt === "string" ? normalized_2.statusPrompt : "";
  normalized_2.statusPrompt.trim() === "生成角色此刻没有说出口的心声。内容贴合本轮聊天、人设、关系进展和已绑定世界书。" && (normalized_2.statusPrompt = window.imApp.DEFAULT_STATUS_PROMPT);
  normalized_2.statusPromptEnabled && !normalized_2.statusPrompt.trim() && (normalized_2.statusPrompt = window.imApp.DEFAULT_STATUS_PROMPT);
  const value_434 = normalized_2.statusTemplate && typeof normalized_2.statusTemplate === "object";
  if (isGroupChat_2) {
    normalized_2.statusTemplate = null;
    delete normalized_2._statusTemplateNeedsPersistence;
  } else {
    if (value_434) {
      normalized_2.statusTemplate = window.imApp.createDefaultStatusTemplate(normalized_2.statusTemplate);
      normalized_2._statusTemplateNeedsPersistence = normalized_2._statusTemplateNeedsPersistence === true;
    } else normalized_2.statusPromptEnabled && normalized_2.statusPrompt.trim() ? (normalized_2.statusTemplate = window.imApp.createDefaultStatusTemplate({
      enabled: true,
      prompt: normalized_2.statusPrompt
    }), normalized_2._statusTemplateNeedsPersistence = true) : (normalized_2.statusTemplate = window.imApp.createDefaultStatusTemplate(), delete normalized_2._statusTemplateNeedsPersistence);
  }
  if (isGroupChat_2) normalized_2.statusRenderMode = "default";else {
    if (["template", "css", "default"].includes(statusRenderMode_2)) normalized_2.statusRenderMode = statusRenderMode_2;else {
      if (normalized_2.statusTemplate?.enabled === true) normalized_2.statusRenderMode = "template";else normalized_2.statusCssEnabled && String(normalized_2.statusCss || "").trim() ? normalized_2.statusRenderMode = "css" : normalized_2.statusRenderMode = "default";
    }
  }
  normalized_2.offlineStreamEnabled = normalized_2.offlineStreamEnabled !== false;
  normalized_2.offlineEpisodeMode = normalized_2.offlineEpisodeMode === true;
  normalized_2.offlineAutoImageGeneration = !isGroupChat_2 && normalized_2.offlineAutoImageGeneration === true;
  normalized_2.offlineRequestReasoning = true;
  normalized_2.offlineMaxResponseTokens = 30000;
  normalized_2.offlineMaxResponseTokensVersion = 2;
  normalized_2.dynamicActionNarrationEnabled = !!normalized_2.dynamicActionNarrationEnabled;
  normalized_2.timestampPosition = normalized_2.timestampPosition === "outside" ? "outside" : "inside";
  normalized_2.boundBooks = Array.isArray(normalized_2.boundBooks) ? normalized_2.boundBooks : [];
  normalized_2.momentsCover = normalized_2.momentsCover || null;
  normalized_2.momentsCoverAssetId = normalized_2.momentsCoverAssetId || null;
  normalized_2.members = Array.isArray(normalized_2.members) ? normalized_2.members : [];
  normalized_2.leftGroupAt = isGroupChat_2 ? Number(normalized_2.leftGroupAt) || 0 : 0;
  normalized_2.groupObserverMode = isGroupChat_2 && normalized_2.groupObserverMode === true && normalized_2.leftGroupAt > 0;
  normalized_2.leftGroupMemberSnapshot = isGroupChat_2 && Array.isArray(normalized_2.leftGroupMemberSnapshot) ? normalized_2.leftGroupMemberSnapshot.filter(item_10 => item_10 && item_10.id != null).map(item_11 => ({
    id: item_11.id,
    nickname: item_11.nickname || "",
    realName: item_11.realName || ""
  })) : [];
  normalized_2.memberProfiles = friend_8.memberProfiles && typeof friend_8.memberProfiles === "object" ? friend_8.memberProfiles : {};
  normalized_2.botEnabled = !!normalized_2.botEnabled;
  delete normalized_2.offlineRegexScripts;
  normalized_2.offlineSummarySettings = {
    apiPresetId: String(normalized_2.offlineSummarySettings?.apiPresetId || "").trim(),
    prompt: String(normalized_2.offlineSummarySettings?.prompt || "").trim().slice(0, 12000)
  };
  normalized_2.linkedAccountBot = window.imApp.normalizeLinkedAccountBot(normalized_2.linkedAccountBot);
  normalized_2.linkedAccountChats = window.imApp.normalizeLinkedAccountChats(normalized_2.linkedAccountChats);
  !isGroupChat_2 && normalized_2.profilePanel && typeof normalized_2.profilePanel === "object" && (normalized_2.profilePanel = {
    ...normalized_2.profilePanel,
    statusHistory: Array.isArray(normalized_2.profilePanel.statusHistory) ? normalized_2.profilePanel.statusHistory.map(item_12 => item_12 && typeof item_12 === "object" ? {
      ...item_12
    } : item_12) : normalized_2.profilePanel.statusHistory,
    thoughtHistory: Array.isArray(normalized_2.profilePanel.thoughtHistory) ? normalized_2.profilePanel.thoughtHistory.map(item_13 => item_13 && typeof item_13 === "object" ? {
      ...item_13
    } : item_13) : normalized_2.profilePanel.thoughtHistory
  }, window.imApp.migrateSingleChatProfileStatus(normalized_2) && (normalized_2._profileStatusNeedsPersistence = true));
  normalized_2.profilePanel = window.imApp.createDefaultProfilePanel(normalized_2);
  normalized_2.latestThought = normalized_2.profilePanel.thought;
  normalized_2.status = normalized_2.profilePanel.status || normalized_2.status || "online";
  const defaultMemory = window.imApp.createDefaultMemory(),
    memory_3 = normalized_2.memory || {},
    recallPresentationSource = memory_3.recallPresentation && typeof memory_3.recallPresentation === "object" ? memory_3.recallPresentation : null,
    normalizeRecallPresentationEntries = entries_2 => (Array.isArray(entries_2) ? entries_2 : []).filter(entry_4 => entry_4 && typeof entry_4 === "object").slice(0, 100).map(entry_5 => ({
      ...entry_5
    })),
    recallPresentation_2 = recallPresentationSource && recallPresentationSource.apiRunId && recallPresentationSource.recall && typeof recallPresentationSource.recall === "object" ? {
      apiRunId: String(recallPresentationSource.apiRunId),
      triggerUserMessageId: String(recallPresentationSource.triggerUserMessageId || ""),
      createdAt: Number(recallPresentationSource.createdAt) || 0,
      recall: {
        friendId: String(recallPresentationSource.recall.friendId || normalized_2.id || ""),
        isGroupChat: !!recallPresentationSource.recall.isGroupChat,
        shortTermEntries: normalizeRecallPresentationEntries(recallPresentationSource.recall.shortTermEntries),
        longTermEntries: normalizeRecallPresentationEntries(recallPresentationSource.recall.longTermEntries),
        cherishedEntries: normalizeRecallPresentationEntries(recallPresentationSource.recall.cherishedEntries)
      }
    } : null,
    schedule_2 = window.imDataUtils?.normalizeSchedule ? window.imDataUtils.normalizeSchedule(memory_3.schedule) : {
      enabled: !!memory_3.schedule?.enabled,
      sleepTime: memory_3.schedule?.sleepTime || defaultMemory.schedule.sleepTime,
      wakeTime: memory_3.schedule?.wakeTime || defaultMemory.schedule.wakeTime,
      events: Array.isArray(memory_3.schedule?.events) ? memory_3.schedule.events : []
    };
  return normalized_2.memory = {
    overview: memory_3.overview || defaultMemory.overview,
    anniversaries: memory_3.anniversaries || defaultMemory.anniversaries,
    schedule: schedule_2,
    context: {
      enabled: typeof memory_3.context?.enabled === "boolean" ? memory_3.context.enabled : defaultMemory.context.enabled,
      limit: Number(memory_3.context?.limit) > 0 ? Number(memory_3.context.limit) : isGroupChat_2 ? 100 : defaultMemory.context.limit,
      notes: memory_3.context?.notes || defaultMemory.context.notes
    },
    recallLimits: window.imApp.normalizeMemoryRecallLimits(memory_3.recallLimits),
    summary: {
      enabled: typeof memory_3.summary?.enabled === "boolean" ? memory_3.summary.enabled : defaultMemory.summary.enabled,
      limit: Number(memory_3.summary?.limit) > 0 ? Number(memory_3.summary.limit) : defaultMemory.summary.limit,
      roundLimit: window.imDataUtils?.normalizeRoundLimit ? window.imDataUtils.normalizeRoundLimit(memory_3.summary?.roundLimit, defaultMemory.summary.roundLimit) : Number(memory_3.summary?.roundLimit) > 0 ? Math.round(Number(memory_3.summary.roundLimit)) : defaultMemory.summary.roundLimit,
      prompt: memory_3.summary?.prompt || defaultMemory.summary.prompt,
      apiPresetId: String(memory_3.summary?.apiPresetId || defaultMemory.summary.apiPresetId || "")
    },
    autonomous: window.imApp.normalizeAutonomousActivity(memory_3.autonomous),
    longTerm: memory_3.longTerm || defaultMemory.longTerm,
    shortTermEntries: Array.isArray(memory_3.shortTermEntries) ? memory_3.shortTermEntries.map((entry_6, value_475) => ({
      id: entry_6?.id != null ? entry_6.id : "shortterm-" + value_475,
      title: entry_6?.title || "对话总结",
      time: entry_6?.time || entry_6?.createdAt || "",
      event: entry_6?.event || entry_6?.content || "",
      memoryPoints: entry_6?.memoryPoints || entry_6?.points || "",
      memoryTags: Array.isArray(entry_6?.memoryTags) ? entry_6.memoryTags.map(categoryName_9 => String(categoryName_9 || "").trim()).filter(Boolean) : [],
      degree: entry_6?.degree || "高",
      lastActivatedAt: entry_6?.lastActivatedAt || entry_6?.activatedAt || entry_6?.time || entry_6?.createdAt || "",
      triggerKeywords: Array.isArray(entry_6?.triggerKeywords) ? entry_6.triggerKeywords.map(categoryName_10 => String(categoryName_10 || "").trim()).filter(Boolean) : Array.isArray(entry_6?.memoryTags) ? entry_6.memoryTags.map(categoryName_11 => String(categoryName_11 || "").trim()).filter(Boolean) : entry_6?.keyword ? [String(entry_6.keyword).trim()] : [],
      sourceType: String(entry_6?.sourceType || "").trim(),
      sourceId: String(entry_6?.sourceId || "").trim(),
      raw: entry_6?.raw || "",
      sourceCount: Math.max(0, Number(entry_6?.sourceCount) || 0),
      sourceRoundCount: Math.max(0, Number(entry_6?.sourceRoundCount) || 0),
      sourceStartMessageCount: Math.max(0, Number(entry_6?.sourceStartMessageCount) || 0),
      sourceEndMessageCount: Math.max(0, Number(entry_6?.sourceEndMessageCount) || 0),
      sourceStartMessageId: String(entry_6?.sourceStartMessageId || "").trim(),
      sourceEndMessageId: String(entry_6?.sourceEndMessageId || "").trim(),
      sourceStartMessageOrder: Number.isFinite(Number(entry_6?.sourceStartMessageOrder)) ? Number(entry_6.sourceStartMessageOrder) : -1,
      sourceEndMessageOrder: Number.isFinite(Number(entry_6?.sourceEndMessageOrder)) ? Number(entry_6.sourceEndMessageOrder) : -1,
      sourceMessageIds: Array.isArray(entry_6?.sourceMessageIds) ? entry_6.sourceMessageIds.map(categoryName_12 => String(categoryName_12 || "").trim()).filter(Boolean) : [],
      sourceRoundLimit: Math.max(0, Number(entry_6?.sourceRoundLimit) || 0)
    })) : defaultMemory.shortTermEntries,
    groupChatContexts: window.imDataUtils?.normalizeGroupChatContexts ? window.imDataUtils.normalizeGroupChatContexts(memory_3.groupChatContexts) : defaultMemory.groupChatContexts,
    longTermEntries: Array.isArray(memory_3.longTermEntries) ? memory_3.longTermEntries.map((existing_2, value_481) => ({
      id: existing_2?.id != null ? existing_2.id : "longterm-" + value_481,
      title: existing_2?.title || "长期记忆",
      content: existing_2?.content || "",
      createdAt: existing_2?.createdAt || existing_2?.time || "",
      time: existing_2?.time || existing_2?.createdAt || "",
      sourceType: String(existing_2?.sourceType || "").trim(),
      sourceId: String(existing_2?.sourceId || "").trim(),
      triggerKeywords: Array.isArray(existing_2?.triggerKeywords) ? existing_2.triggerKeywords.map(categoryName_13 => String(categoryName_13 || "").trim()).filter(Boolean) : existing_2?.keyword ? [String(existing_2.keyword).trim()] : []
    })) : defaultMemory.longTermEntries,
    lastSummaryMessageCount: typeof memory_3.lastSummaryMessageCount === "number" ? memory_3.lastSummaryMessageCount : 0,
    summaryCursor: (() => {
      const max_483 = Math.max(0, Number(memory_3.lastSummaryMessageCount) || 0),
        item_14 = memory_3.summaryCursor && typeof memory_3.summaryCursor === "object" ? memory_3.summaryCursor : {};
      return {
        messageId: String(item_14.messageId || "").trim(),
        order: Number.isFinite(Number(item_14.order)) ? Number(item_14.order) : -1,
        count: Math.max(0, Number.isFinite(Number(item_14.count)) ? Number(item_14.count) : max_483)
      };
    })(),
    cherished: memory_3.cherished || defaultMemory.cherished,
    cherishedEntries: Array.isArray(memory_3.cherishedEntries) ? memory_3.cherishedEntries.map((message_485, value_486) => ({
      id: message_485?.id != null ? message_485.id : "cherished-" + value_486,
      title: message_485?.title || "长期记忆",
      content: message_485?.content || "",
      detail: message_485?.detail || "",
      reason: message_485?.reason || "",
      sourceEventId: message_485?.sourceEventId || "",
      createdAt: message_485?.createdAt || "",
      sourceThought: message_485?.sourceThought || "",
      triggerKeywords: Array.isArray(message_485?.triggerKeywords) ? message_485.triggerKeywords.map(categoryName_14 => String(categoryName_14 || "").trim()).filter(Boolean) : message_485?.keyword ? [String(message_485.keyword).trim()] : []
    })) : defaultMemory.cherishedEntries,
    relationships: Array.isArray(memory_3.relationships) ? memory_3.relationships : defaultMemory.relationships,
    xDirectMessageMount: window.imApp.normalizeXDirectMessageMount(memory_3.xDirectMessageMount),
    bstagePopMount: window.imApp.normalizeBstagePopMount(memory_3.bstagePopMount),
    recallPresentation: recallPresentation_2,
    userOverride: memory_3.userOverride || null,
    mountSettings: memory_3.mountSettings && typeof memory_3.mountSettings === "object" && !Array.isArray(memory_3.mountSettings) ? {
      ...memory_3.mountSettings
    } : defaultMemory.mountSettings,
    mountLimits: memory_3.mountLimits && typeof memory_3.mountLimits === "object" && !Array.isArray(memory_3.mountLimits) ? Object.fromEntries(Object.entries(memory_3.mountLimits).map(([key_4, value_13]) => {
      const limit_2 = Number(value_13);
      return [key_4, Number.isFinite(limit_2) && limit_2 > 0 ? Math.max(1, Math.floor(limit_2)) : 20];
    })) : defaultMemory.mountLimits,
    crossGroupMemorySettings: memory_3.crossGroupMemorySettings && typeof memory_3.crossGroupMemorySettings === "object" && !Array.isArray(memory_3.crossGroupMemorySettings) ? Object.fromEntries(Object.entries(memory_3.crossGroupMemorySettings).map(([value_491, value_492]) => [value_491, value_492 !== false])) : defaultMemory.crossGroupMemorySettings
  }, normalized_2;
};
window.imApp.applyGeneratedShortTermMemory = function (friend_9, entry_7, options_3 = {}) {
  if (!friend_9 || !entry_7) return null;
  friend_9.memory = window.imApp.normalizeFriendData(friend_9).memory;
  if (!Array.isArray(friend_9.memory.shortTermEntries)) friend_9.memory.shortTermEntries = [];
  const startDate = options_3.now instanceof Date ? options_3.now : new Date(options_3.now || Date.now()),
    value_497 = value_502 => String(value_502).padStart(2, "0"),
    lastActivatedAt_2 = options_3.nowString || startDate.getFullYear() + "年" + value_497(startDate.getMonth() + 1) + "月" + value_497(startDate.getDate()) + "日 " + value_497(startDate.getHours()) + ":" + value_497(startDate.getMinutes()),
    activatedIds = new Set((Array.isArray(options_3.activatedEntryIds) ? options_3.activatedEntryIds : []).map(String).filter(Boolean)),
    parseMemoryDate = value_14 => {
      if (!value_14) return null;
      if (typeof value_14 === "number") {
        const date_2 = new Date(value_14);
        return Number.isNaN(date_2.getTime()) ? null : date_2;
      }
      const normalized_3 = String(value_14).trim().replace(/年/g, "-").replace(/月/g, "-").replace(/日/g, " ").replace(/\./g, "-").replace(/\//g, "-"),
        value_505 = new Date(normalized_3);
      return Number.isNaN(value_505.getTime()) ? null : value_505;
    };
  friend_9.memory.shortTermEntries.forEach(existing_3 => {
    if (!existing_3) return;
    if (activatedIds.has(String(existing_3.id))) {
      existing_3.degree = "高";
      existing_3.lastActivatedAt = lastActivatedAt_2;
      return;
    }
    const anchorDate = parseMemoryDate(existing_3.lastActivatedAt || existing_3.time || existing_3.createdAt || "");
    if (!anchorDate) return;
    const ageDays = (startDate.getTime() - anchorDate.getTime()) / 86400000;
    if (ageDays > 30) existing_3.degree = "遗忘";else {
      if (ageDays > 7) existing_3.degree = "低";else {
        if (ageDays > 1 && existing_3.degree === "高") existing_3.degree = "中";
      }
    }
  });
  const normalizedEntry = {
      ...entry_7,
      id: entry_7.id || "stm-" + Date.now(),
      time: entry_7.time || lastActivatedAt_2,
      degree: "高",
      lastActivatedAt: lastActivatedAt_2,
      sourceType: String(entry_7.sourceType || "").trim(),
      sourceId: String(entry_7.sourceId || "").trim()
    },
    sourceIndex = normalizedEntry.sourceType && normalizedEntry.sourceId ? friend_9.memory.shortTermEntries.findIndex(existing => String(existing?.sourceType || "") === normalizedEntry.sourceType && String(existing?.sourceId || "") === normalizedEntry.sourceId) : -1;
  sourceIndex >= 0 ? (normalizedEntry.id = friend_9.memory.shortTermEntries[sourceIndex]?.id || normalizedEntry.id, friend_9.memory.shortTermEntries[sourceIndex] = {
    ...friend_9.memory.shortTermEntries[sourceIndex],
    ...normalizedEntry
  }) : friend_9.memory.shortTermEntries.push(normalizedEntry);
  if (options_3.updateSummaryCursor !== false) {
    const lastSummaryMessageCount_2 = Number(entry_7.sourceEndMessageCount) || (Array.isArray(friend_9.messages) ? friend_9.messages.length : 0),
      value_511 = Array.isArray(entry_7.sourceMessageIds) ? entry_7.sourceMessageIds : [];
    friend_9.memory.lastSummaryMessageCount = lastSummaryMessageCount_2;
    friend_9.memory.summaryCursor = {
      messageId: String(entry_7.sourceEndMessageId || value_511[value_511.length - 1] || "").trim(),
      order: Number.isFinite(Number(entry_7.sourceEndMessageOrder)) ? Number(entry_7.sourceEndMessageOrder) : -1,
      count: lastSummaryMessageCount_2
    };
  }
  return normalizedEntry;
};
window.imApp.commitShortTermMemoryPromotion = async function (value_512, draft_2, sourceEntryIds) {
  const friend_10 = window.imApp.getFriendById(value_512),
    selectedIds_2 = Array.from(new Set((Array.isArray(sourceEntryIds) ? sourceEntryIds : []).map(value_15 => String(value_15 || "").trim()).filter(Boolean)));
  if (!friend_10 || selectedIds_2.length === 0 || !draft_2 || typeof draft_2 !== "object") return false;
  const normalizeTags = value_19 => window.imChat?.normalizeMemoryTriggerKeywords ? window.imChat.normalizeMemoryTriggerKeywords(value_19) : (Array.isArray(value_19) ? value_19 : [value_19]).map(item_15 => String(item_15 || "").trim()).filter(Boolean).slice(0, 6),
    title_2 = String(draft_2.title || "").trim() || "长期记忆",
    content_2 = String(draft_2.content || "").trim(),
    time_2 = String(draft_2.time || "").trim(),
    triggerKeywords_2 = normalizeTags(draft_2.triggerKeywords || draft_2.memoryTags || []);
  if (!content_2) return false;
  const id_5 = "promoted-ltm-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
    value_522 = await window.imApp.commitScopedFriendChange(friend_10, targetFriend_5 => {
      targetFriend_5.memory = window.imApp.normalizeFriendData(targetFriend_5).memory;
      const shortTermEntries_2 = Array.isArray(targetFriend_5.memory.shortTermEntries) ? targetFriend_5.memory.shortTermEntries : [],
        selectedEntries = shortTermEntries_2.filter(entry_8 => selectedIds_2.includes(String(entry_8?.id || "")));
      if (selectedEntries.length !== selectedIds_2.length) throw new Error("Selected short-term memories are no longer available");
      if (!Array.isArray(targetFriend_5.memory.longTermEntries)) targetFriend_5.memory.longTermEntries = [];
      targetFriend_5.memory.longTermEntries.push({
        id: id_5,
        title: title_2,
        content: content_2,
        time: time_2 || new Date().toISOString(),
        createdAt: time_2 || new Date().toISOString(),
        triggerKeywords: triggerKeywords_2,
        sourceType: "manual",
        sourceId: id_5,
        promotedFromShortTermIds: selectedIds_2
      });
      targetFriend_5.memory.shortTermEntries = shortTermEntries_2.filter(entry_9 => !selectedIds_2.includes(String(entry_9?.id || "")));
      targetFriend_5.memory.recallPresentation = null;
      window.imApp.clearFriendRuntimeMessageContext?.(targetFriend_5);
    }, {
      silent: true,
      immediate: true,
      syncActive: true,
      syncSettings: true
    });
  if (!value_522) return false;
  return window.dispatchEvent(new CustomEvent("u2:memory-entries-updated", {
    detail: {
      friendId: String(friend_10.id),
      action: "promote",
      collection: "longTermEntries",
      entryId: id_5,
      removedShortTermEntryIds: selectedIds_2
    }
  })), {
    id: id_5
  };
};
window.imApp.createGroupMemberSnapshot = function (group_4) {
  if (!group_4 || group_4.type !== "group") return [];
  const memberIds = Array.isArray(group_4.members) ? group_4.members : [];
  return memberIds.map(memberId_3 => {
    const member_3 = (window.imData?.friends || []).find(item_16 => String(item_16.id) === String(memberId_3));
    return {
      id: memberId_3,
      nickname: member_3?.nickname || "",
      realName: member_3?.realName || ""
    };
  });
};
window.imApp.getContextLimit = function (value_535, value_536 = {}) {
  const normalizedFriend_2 = value_536.friendIsNormalized === true && value_535 ? value_535 : window.imApp.normalizeFriendData(value_535 || {}),
    defaultContextLimit = normalizedFriend_2.type === "group" ? 100 : 50;
  if (normalizedFriend_2.memory?.context?.enabled === false) return 0;
  return Number(normalizedFriend_2.memory?.context?.limit) > 0 ? Number(normalizedFriend_2.memory.context.limit) : defaultContextLimit;
};
window.imApp.getRecentContextMessages = function (value_539, value_540 = {}) {
  const value_541 = value_540.friendIsNormalized === true && value_539 ? value_539 : window.imApp.normalizeFriendData(value_539 || {}),
    contextLimit = window.imApp.getContextLimit(value_541, {
      friendIsNormalized: true
    }),
    allMessages = (Array.isArray(value_541.messages) ? value_541.messages : []).filter(value_545 => value_545?.excludedFromContext !== true);
  if (contextLimit <= 0 || allMessages.length === 0) return [];
  if (value_541.type === "group") return allMessages.slice(-contextLimit);
  const boundedStartIndex = Math.max(0, allMessages.length - contextLimit);
  let roundStartIndex = -1;
  for (let index_3 = boundedStartIndex; index_3 >= 0; index_3 -= 1) {
    if (allMessages[index_3]?.role === "user") {
      roundStartIndex = index_3;
      break;
    }
  }
  return roundStartIndex >= 0 ? allMessages.slice(roundStartIndex) : allMessages.slice(-contextLimit);
};
window.imApp.getGroupChatMemoryCandidates = function (value_547) {
  const normalizedFriend = window.imApp.normalizeFriendData(value_547 || {});
  if (!normalizedFriend || normalizedFriend.type === "group" || normalizedFriend.type === "official") return [];
  return (window.imData?.friends || []).filter(group_5 => {
    if (!group_5 || group_5.type !== "group" || !Array.isArray(group_5.members)) return false;
    const isDirectMember = group_5.members.some(memberRef => String(memberRef) === String(normalizedFriend.id) || String(memberRef) === String(normalizedFriend.nickname) || String(memberRef) === String(normalizedFriend.realName)),
      isResolvedMember = window.imChat?.getGroupMemberFriends ? window.imChat.getGroupMemberFriends(group_5).some(member_4 => String(member_4?.id) === String(normalizedFriend.id)) : false;
    return isDirectMember || isResolvedMember;
  });
};
window.imApp.getEligibleGroupChatMemoryContexts = function (value_552) {
  const normalizedFriend_3 = window.imApp.normalizeFriendData(value_552 || {}),
    contexts = window.imDataUtils?.normalizeGroupChatContexts ? window.imDataUtils.normalizeGroupChatContexts(normalizedFriend_3.memory?.groupChatContexts) : [],
    groupsById = new Map(window.imApp.getGroupChatMemoryCandidates(normalizedFriend_3).map(group_6 => [String(group_6.id), group_6]));
  return contexts.map(context_2 => ({
    ...context_2,
    group: groupsById.get(String(context_2.groupId)) || null
  })).filter(context_3 => context_3.group);
};
window.imApp.loadEligibleGroupChatMemoryContexts = async function (friend_11) {
  const initialContexts = window.imApp.getEligibleGroupChatMemoryContexts(friend_11);
  if (initialContexts.length === 0) return [];
  if (window.imApp.ensureFriendRecentMessagesLoaded) await Promise.all(initialContexts.map(({
    group: group_8,
    messageLimit: messageLimit_2
  }) => window.imApp.ensureFriendRecentMessagesLoaded(group_8, {
    limit: Math.max(1, Number(messageLimit_2) || 30)
  })));else window.imApp.ensureFriendMessagesLoaded && (await Promise.all(initialContexts.map(({
    group: group_7
  }) => window.imApp.ensureFriendMessagesLoaded(group_7))));
  const liveFriend = window.imApp.getFriendById(friend_11) || friend_11;
  return window.imApp.getEligibleGroupChatMemoryContexts(liveFriend);
};
window.imApp.isRecallableUserMessage = function (message_7) {
  if (!message_7 || message_7.role !== "user") return false;
  const blockedTypes = new Set(["system_notice", "pay_transfer", "group_red_packet", "group_poll", "voice_call_record", "offline_meeting_record", "html"]);
  return !blockedTypes.has(String(message_7.type || "").trim());
};
window.imApp.createRecalledNoticeMessage = function (value_563, options_4 = {}) {
  const original = value_563 && typeof value_563 === "object" ? value_563 : {},
    actorRole_2 = options_4.actorRole === "user" ? "user" : "assistant",
    actorName_2 = String(options_4.actorName || "").trim(),
    timestamp_3 = Number(options_4.timestamp || original.timestamp) || Date.now(),
    notice_3 = {
      id: original.id || options_4.id || (window.imChat?.createMessageId ? window.imChat.createMessageId("notice") : "notice_" + timestamp_3),
      role: "system",
      type: "system_notice",
      noticeKind: "message_recalled",
      actorRole: actorRole_2,
      actorName: actorName_2,
      content: actorRole_2 === "user" ? "你撤回了一条消息" : (actorName_2 || "对方") + "撤回了一条消息",
      timestamp: timestamp_3
    };
  actorRole_2 !== "user" && typeof options_4.recalledContent === "string" && options_4.recalledContent.trim() && (notice_3.payload = {
    recalledContent: options_4.recalledContent.trim(),
    recalledTranslation: typeof options_4.recalledTranslation === "string" ? options_4.recalledTranslation.trim() : ""
  });
  if (options_4.apiRunId) notice_3.apiRunId = options_4.apiRunId;
  return notice_3;
};
window.imApp.formatSceneNarrationForApiContext = function (noticeText, value_571 = {}) {
  const value_572 = value_571.source === "dynamic_action" ? "narrator_dynamic_action" : "scene_director";
  return "<SCENE_NARRATION source=\"" + value_572 + "\" attribution=\"none\">\ncontent_json: " + JSON.stringify(String(noticeText || "")) + "\ninterpretation_rules:\n- This is an out-of-character scene narration event, not a message, spoken line, inner thought, intention, or automatically performed action from User.\n- Do not reply as though User said this text. Do not attribute it to User or any character unless the narration explicitly names that character as the actor.\n- If the narration explicitly states that a named character performed an action, treat that action as an already established scene fact and continue from its result.\n- Preserve this event's chronological place in the scene and continue the story from it.\n</SCENE_NARRATION>";
};
window.imApp.formatSystemNoticeForApiContext = function (value_573) {
  const message_574 = value_573 || {},
    noticeKind_2 = message_574.noticeKind || "",
    value_576 = message_574.content || message_574.text || "";
  if (noticeKind_2 === "group_left") return "[系统事件：User 已退出群聊。]";
  if (noticeKind_2 === "group_rejoined") return "[系统事件：User 重新进入群聊。]";
  if (noticeKind_2 === "narration") return window.imApp.formatSceneNarrationForApiContext(value_576, {
    source: message_574.narrationSource
  });
  if (noticeKind_2 === "offline_meeting_active") return "";
  if (noticeKind_2 === "group_private_to_user") return "[系统事件：有群成员向 User 发送了私信。其他群成员默认不知道私信内容。]";
  if (noticeKind_2 === "group_friend_private_chat") return "[系统事件：有群成员与自己的好友进行了私聊。私聊内容只属于该成员，其他群成员默认不知道。]";
  if (noticeKind_2 === "message_recalled") {
    if (message_574.actorRole === "user") return "[系统事件：User 撤回了一条消息。你只知道发生了撤回，无法读取被撤回的原文。]";
    const trim_577 = String(message_574.actorName || "").trim();
    return trim_577 ? "[系统事件：" + trim_577 + " 撤回了一条消息。]" : "[系统事件：你撤回了一条消息。]";
  }
  return value_576 ? "[系统事件：" + value_576 + "]" : "[系统事件]";
};
window.imApp.stripFakeLinkHtmlForApiContext = function (value_21, maxLength = 20000) {
  return String(value_21 == null ? "" : value_21).replace(/<\s*(script|style|iframe|object|embed|svg|canvas)[\s\S]*?<\s*\/\s*\1\s*>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, "\"").replace(/&#039;/gi, "'").replace(/\s+/g, " ").trim().slice(0, Math.max(1000, Number(maxLength) || 20000));
};
window.imApp.formatFakeLinkMessageForApiContext = function (value_579, options_5 = {}) {
  const normalizedMessage_2 = value_579 || {},
    fakeLinkData_2 = normalizedMessage_2.fakeLinkData && typeof normalizedMessage_2.fakeLinkData === "object" ? normalizedMessage_2.fakeLinkData : {},
    displayUrl_2 = String(fakeLinkData_2.displayUrl || fakeLinkData_2.canonicalUrl || normalizedMessage_2.content || "").trim(),
    platformLabel = String(fakeLinkData_2.siteName || fakeLinkData_2.domain || "假网页").trim(),
    title_3 = String(fakeLinkData_2.title || displayUrl_2 || "未命名假网页").trim(),
    description_2 = String(fakeLinkData_2.summary || "").trim(),
    webPage_2 = fakeLinkData_2.webPage && typeof fakeLinkData_2.webPage === "object" ? fakeLinkData_2.webPage : null,
    pageHtmlText = webPage_2 && webPage_2.html ? window.imApp.stripFakeLinkHtmlForApiContext(webPage_2.html, options_5.maxLinkBodyChars || 20000) : "",
    bodyText_2 = String(fakeLinkData_2.bodyText || fakeLinkData_2.pageText || pageHtmlText || "").trim(),
    webTheme = webPage_2 ? String(webPage_2.theme || "").trim() : "",
    expandContent = options_5.expandLinkContent !== false,
    maxBodyChars = Math.max(1000, Number(options_5.maxLinkBodyChars) || 20000),
    fakeLines = ["[User 分享了一个站内假网页]", "站点：" + platformLabel, "标题：" + title_3, "显示地址：" + displayUrl_2];
  if (description_2) fakeLines.push("摘要：" + description_2);
  if (!bodyText_2) return fakeLines.push("正文状态：用户未填写正文，只能参考标题、域名和摘要。"), fakeLines.join("\n");
  if (!expandContent) return fakeLines.push("页面摘要：" + (description_2 || bodyText_2.slice(0, 500))), fakeLines.push("正文状态：这是较早的假网页记录，本轮只保留摘要。"), fakeLines.join("\n");
  const fakeInjectedBody = bodyText_2.slice(0, maxBodyChars);
  return fakeLines.push("页面正文：\n" + fakeInjectedBody), bodyText_2.length > fakeInjectedBody.length && fakeLines.push("正文状态：内容过长，已截断。"), fakeLines.join("\n");
};
window.imApp.formatMessageForApiContext = function (value_595, value_596, options_6 = {}) {
  const normalizedFriend_4 = options_6.friendIsNormalized === true && value_596 ? value_596 : window.imApp.normalizeFriendData(value_596 || {}),
    normalizedMessage_3 = value_595 || {},
    value_600 = normalizedFriend_4.type === "group";
  let value_601 = normalizedMessage_3.content || "";
  if (normalizedMessage_3.excludedFromContext === true || normalizedMessage_3.type === "user_phone_access_card" || normalizedMessage_3.type === "system_notice" && ["user_phone_access", "user_remark_changed"].includes(normalizedMessage_3.noticeKind)) return null;
  if (normalizedMessage_3.type === "memory_request") return null;
  if (normalizedMessage_3.type === "unblock_request") {
    const value_602 = normalizedMessage_3.requesterRole === "assistant" ? "Char" : "User",
      value_603 = normalizedMessage_3.requestStatus || "pending";
    return {
      role: normalizedMessage_3.requesterRole === "assistant" ? "assistant" : "user",
      content: "[解除拉黑申请｜requestId=" + normalizedMessage_3.id + "｜申请方=" + value_602 + "｜状态=" + value_603 + "]\n理由：" + (normalizedMessage_3.requestText || normalizedMessage_3.content || "")
    };
  }
  if (normalizedMessage_3.type === "loves_unbind_request") return {
    role: "system",
    content: "[Loves 解绑申请｜requestId=" + (normalizedMessage_3.requestId || normalizedMessage_3.id) + "｜状态=" + (normalizedMessage_3.requestStatus || "pending") + "] User 请求解除与 Char 的 Loves 关系。"
  };
  if (normalizedMessage_3.type === "loves_unbind_decision") {
    const value_604 = normalizedMessage_3.decision === "accept" ? "同意解绑" : "拒绝解绑";
    return {
      role: "system",
      content: "[Loves 解绑结果｜requestId=" + (normalizedMessage_3.requestId || "") + "] Char 已" + value_604 + "。"
    };
  }
  if (normalizedMessage_3.type === "together_listening_invite") {
    const value_605 = String(normalizedMessage_3.title || "未知歌曲").trim() || "未知歌曲",
      value_606 = String(normalizedMessage_3.artist || "未知歌手").trim() || "未知歌手",
      value_607 = normalizedMessage_3.inviteStatus === "accepted" ? "User 已同意，你们已进入一起听" : "等待 User 决定是否一起听";
    return {
      role: "assistant",
      content: "[你向 User 发出了一起听邀请：" + value_605 + " - " + value_606 + "；" + value_607 + "。]"
    };
  }
  if (normalizedMessage_3.type === "system_notice") return {
    role: "system",
    content: window.imApp.formatSystemNoticeForApiContext(normalizedMessage_3)
  };
  if (normalizedMessage_3.type === "chat_record_forward") value_601 = window.imApp.formatChatRecordForwardForApiContext ? window.imApp.formatChatRecordForwardForApiContext(normalizedMessage_3) : "[User 转发了一份聊天记录]";else {
    if (normalizedMessage_3.type === "group_poll") {
      const pollOptions_2 = Array.isArray(normalizedMessage_3.pollOptions) ? normalizedMessage_3.pollOptions : [],
        pollVotes_2 = Array.isArray(normalizedMessage_3.pollVotes) ? normalizedMessage_3.pollVotes : [],
        optionById = new Map(pollOptions_2.map(option => [String(option?.id || ""), String(option?.text || "")])),
        map_611 = pollVotes_2.map(vote => {
          const voterName_2 = String(vote?.voterName || vote?.voterId || "未知成员"),
            optionText = optionById.get(String(vote?.optionId || "")) || "未知选项";
          return voterName_2 + " → " + optionText;
        });
      value_601 = ["[User 发起了一项公开单选群投票：" + (normalizedMessage_3.pollQuestion || "未命名投票") + "]", "选项：" + (pollOptions_2.map(option_2 => option_2?.text || "").filter(Boolean).join(" / ") || "无"), "投票结果：" + (map_611.length > 0 ? map_611.join("；") : "暂时无人投票"), normalizedMessage_3.pollStatus === "pending" ? "角色投票仍在进行中。" : ""].filter(Boolean).join("\n");
    } else {
      if (normalizedMessage_3.type === "fake_link") value_601 = window.imApp.formatFakeLinkMessageForApiContext(normalizedMessage_3, options_6);else {
        if (normalizedMessage_3.type === "voice_message") {
          const voiceText = normalizedMessage_3.transcript || normalizedMessage_3.text || "";
          value_601 = normalizedMessage_3.role === "user" ? "[用户发了一条语音消息，语音内容：" + voiceText + "]" : "[你发了一条语音消息，语音内容：" + voiceText + "]";
        } else {
          if (normalizedMessage_3.type === "sticker") {
            const stickerName_2 = normalizedMessage_3.stickerName || normalizedMessage_3.text || "表情包",
              stickerCategory_2 = normalizedMessage_3.stickerCategory || "",
              value_619 = stickerCategory_2 ? stickerCategory_2 + " / " + stickerName_2 : stickerName_2;
            value_601 = normalizedMessage_3.role === "user" ? "[用户发了一个表情包：" + value_619 + "]" : "[你发了一个表情包：" + value_619 + "]";
          } else {
            if (normalizedMessage_3.type === "offline_meeting_record") {
              const dateText_2 = normalizedMessage_3.dateText || "",
                title_4 = normalizedMessage_3.title || "见面记录",
                summary_2 = normalizedMessage_3.summary || normalizedMessage_3.content || "",
                items_623 = [options_6.includeTime !== false ? "线下见面结束于：" + (dateText_2 || "未知") : "线下见面已经结束", "标题：" + title_4, "总结：" + summary_2];
              return {
                role: "system",
                content: window.imApp.formatSceneNarrationForApiContext(items_623.join("\n"))
              };
            } else {
              if (normalizedMessage_3.type === "voice_call_record") {
                const duration_2 = normalizedMessage_3.duration || 0,
                  value_625 = Math.floor(duration_2 / 60) + "分" + duration_2 % 60 + "秒",
                  callMessages_2 = normalizedMessage_3.callMessages || [],
                  statusText_2 = normalizedMessage_3.statusText || "通话记录";
                if (statusText_2 === "已拒绝") value_601 = "[提示：" + (normalizedMessage_3.isSelf ? "对方" : "你") + "刚刚拒绝了这通语音通话。]";else {
                  if (statusText_2 === "已取消") value_601 = "[提示：" + (normalizedMessage_3.isSelf ? "你" : "对方") + "刚刚取消了这通语音通话。]";else {
                    if (callMessages_2.length > 0) {
                      const userName_2 = options_6.userName || window.userState?.name || "User",
                        charName = normalizedFriend_4.nickname || "对方",
                        join_630 = callMessages_2.map(m => {
                          const speaker_2 = m.isSelf ? userName_2 : charName,
                            parts_2 = [];
                          if (m.actionText) parts_2.push(String(m.actionText).trim());
                          if (m.thoughtText) parts_2.push("心声：" + String(m.thoughtText).trim());
                          if (m.text) parts_2.push(speaker_2 + "：「" + String(m.text).trim() + "」");
                          return parts_2.join("\n  ");
                        }).filter(Boolean).join("\n  ");
                      value_601 = "[提示：你们刚刚完成了一通语音通话，时长 " + value_625 + "。通话期间的交流内容如下：\n  " + join_630 + "\n（通话已结束，请直接用普通文字回复）]";
                    } else value_601 = "[提示：你们刚刚完成了一通语音通话，时长 " + value_625 + "，未产生可识别的文本记录。（通话已结束，请直接用普通文字回复）]";
                  }
                }
              } else {
                if (normalizedMessage_3.type === "html" && normalizedMessage_3.shopGift) {
                  const value_634 = normalizedMessage_3.shopGift || {},
                    value_635 = String(value_634.itemName || "商品").trim() || "商品",
                    value_636 = Number(value_634.price) || 0,
                    trim_637 = String(value_634.paymentMethod || "").trim();
                  value_601 = "[User 赠送给你一份礼物]\n商品：" + value_635 + "\n价值：¥" + value_636.toFixed(2) + (trim_637 ? "\n付款方式：" + trim_637 : "");
                } else {
                  if (normalizedMessage_3.type === "moment_forward") try {
                    const momentData = JSON.parse(normalizedMessage_3.content),
                      momentText_2 = momentData.text || "无配文";
                    value_601 = "[转发了一条朋友圈, 内容: \"" + momentText_2 + "\"]";
                    momentData.img && (momentData.imgDesc ? value_601 += " (附带图片: " + momentData.imgDesc + ")" : value_601 += " (附带图片)");
                  } catch (value_640) {
                    value_601 = "[转发了一条朋友圈]";
                  } else {
                    if (normalizedMessage_3.type === "image") {
                      const imageDescription = normalizedMessage_3.text || normalizedMessage_3.description || normalizedMessage_3.fileName || "无描述";
                      value_601 = "[发送了一张图片：" + imageDescription + "]";
                    } else {
                      if (normalizedMessage_3.type === "location") {
                        const trim_642 = String(normalizedMessage_3.locationName || normalizedMessage_3.name || "共享位置").trim(),
                          trim_643 = String(normalizedMessage_3.locationAddress || normalizedMessage_3.address || "").trim(),
                          trim_644 = String(normalizedMessage_3.locationNameTranslation || normalizedMessage_3.nameTranslation || "").trim(),
                          trim_645 = String(normalizedMessage_3.locationAddressTranslation || normalizedMessage_3.addressTranslation || "").trim();
                        value_601 = "[发送了一个定位：" + trim_642 + (trim_644 ? "（" + trim_644 + "）" : "") + (trim_643 ? "，详细地址：" + trim_643 + (trim_645 ? "（" + trim_645 + "）" : "") : "") + "]";
                      } else {
                        if (normalizedMessage_3.type === "pay_transfer") {
                          const payAmount = Number(normalizedMessage_3.amount) || 0,
                            payDesc = normalizedMessage_3.description || "转账",
                            payTarget = normalizedMessage_3.targetName || normalizedFriend_4.nickname || "对方";
                          if (normalizedMessage_3.payKind === "family_card_pending") value_601 = "[用户赠送给你一张额度 ¥" + payAmount.toFixed(2) + " 的亲属卡，等待你决定收下或退回。]";else {
                            if (normalizedMessage_3.payKind === "family_card_accepted") value_601 = "[用户赠送给你的额度 ¥" + payAmount.toFixed(2) + " 的亲属卡已被你收下。]";else {
                              if (normalizedMessage_3.payKind === "family_card_rejected") value_601 = "[用户赠送给你的额度 ¥" + payAmount.toFixed(2) + " 的亲属卡已被你退回。]";else {
                                if (normalizedMessage_3.payKind === "family_card_unbound") value_601 = "[用户赠送给你的亲属卡已解绑，原额度为 ¥" + payAmount.toFixed(2) + "。]";else {
                                  if (normalizedMessage_3.payKind === "family_card_adjust") value_601 = "[用户将赠送给你的亲属卡额度从 ¥" + Number(normalizedMessage_3.previousLimit || 0).toFixed(2) + " 调整到 ¥" + payAmount.toFixed(2) + "。]";else {
                                    if (normalizedMessage_3.payKind === "family_card_accept_notice" || normalizedMessage_3.payKind === "family_card_reject_notice") value_601 = "[你" + (normalizedMessage_3.payKind === "family_card_accept_notice" ? "收下" : "退回") + "了用户赠送的亲属卡。]";else {
                                      if (normalizedMessage_3.payKind === "user_to_char") value_601 = "[用户刚刚向你转账 ¥" + payAmount.toFixed(2) + "，备注：" + payDesc + "，对象：" + payTarget + "。你可以收下这笔钱，也可以退回，或者正常回复。]";else {
                                        if (normalizedMessage_3.payKind === "char_received") value_601 = "[你刚刚收下了用户的一笔转账 ¥" + payAmount.toFixed(2) + "，备注：" + payDesc + "。]";else {
                                          if (normalizedMessage_3.payKind === "char_to_user_pending") value_601 = "[你刚刚向用户发起了一笔转账 ¥" + payAmount.toFixed(2) + "，备注：" + payDesc + "，等待用户领取。]";else {
                                            if (normalizedMessage_3.payKind === "char_to_user_claimed" || normalizedMessage_3.payKind === "user_received_from_char") value_601 = "[用户已领取你的转账 ¥" + payAmount.toFixed(2) + "，备注：" + payDesc + "。]";else {
                                              if (normalizedMessage_3.payKind === "user_rejected_from_char") value_601 = "[用户退回了你的转账 ¥" + payAmount.toFixed(2) + "，备注：" + payDesc + "。]";else (normalizedMessage_3.payKind === "char_to_user_rejected" || normalizedMessage_3.payKind === "user_to_char_rejected") && (value_601 = "[你刚刚退回了用户的转账 ¥" + payAmount.toFixed(2) + "，备注：" + payDesc + "。]");
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
  if (value_600) {
    const userName_3 = String(normalizedMessage_3.userIdentity?.name || options_6.userName || window.imApp.getGroupUserIdentity(normalizedFriend_4).name || "User").trim() || "User";
    if (normalizedMessage_3.role === "user") return normalizedMessage_3.replyTo && (value_601 = "[引用了消息：\"" + normalizedMessage_3.replyTo + "\"]\n" + value_601), {
      role: "user",
      content: "User(" + userName_3 + "): " + value_601
    };
    const assistantSpeaker = typeof normalizedMessage_3.speaker === "string" && normalizedMessage_3.speaker.trim() ? normalizedMessage_3.speaker.trim() : "群成员";
    return normalizedMessage_3.replyTo && (value_601 = "[引用了消息：\"" + normalizedMessage_3.replyTo + "\"]\n" + value_601), {
      role: "assistant",
      content: assistantSpeaker + ": " + value_601
    };
  }
  return normalizedMessage_3.role === "user" && normalizedMessage_3.replyTo && (value_601 = "[用户引用了消息：\"" + normalizedMessage_3.replyTo + "\"]\n" + value_601), {
    role: normalizedMessage_3.role,
    content: value_601
  };
};
window.imApp.buildApiContextMessages = function (value_651, options_7 = {}) {
  const friendData_653 = window.imApp.normalizeFriendData(value_651 || {}),
    recentMessages = window.imApp.getRecentContextMessages(friendData_653, {
      friendIsNormalized: true
    });
  let latestLinkIndex = -1;
  return recentMessages.forEach((message_8, index_4) => {
    if (message_8 && message_8.type === "fake_link") latestLinkIndex = index_4;
  }), recentMessages.map((message_9, value_657) => {
    const formattedMessage = window.imApp.formatMessageForApiContext(message_9, friendData_653, {
      ...options_7,
      friendIsNormalized: true,
      expandLinkContent: message_9 && message_9.type === "fake_link" ? value_657 === latestLinkIndex : options_7.expandLinkContent
    });
    if (!formattedMessage || !options_7.includeContextMetadata) return formattedMessage;
    return {
      ...formattedMessage,
      _contextMessageId: String(message_9?.id || ""),
      _contextTimestamp: Number(message_9?.timestamp) || 0
    };
  }).filter(item_17 => item_17 && item_17.role && typeof item_17.content === "string" && item_17.content.trim());
};
window.imApp.buildLinkedAccountMemoryContext = function (value_660, options_8 = {}) {
  const normalizedFriend_5 = window.imApp.normalizeFriendData(value_660 || {}),
    linkedChats = Array.isArray(normalizedFriend_5.linkedAccountChats) ? normalizedFriend_5.linkedAccountChats : [];
  if (linkedChats.length === 0) return "";
  const charName_2 = normalizedFriend_5.nickname || normalizedFriend_5.realName || "Char",
    value_665 = options_8?.includeTime !== false,
    maxMessagesPerFriend_2 = Math.max(1, Number(options_8.maxMessagesPerFriend) || 4),
    value_667 = value_669 => {
      const value_670 = Number(value_669) || 0;
      if (!value_670) return "未知时间";
      const startDate_2 = new Date(value_670),
        value_672 = value_673 => String(value_673).padStart(2, "0");
      return startDate_2.getFullYear() + "-" + value_672(startDate_2.getMonth() + 1) + "-" + value_672(startDate_2.getDate()) + " " + value_672(startDate_2.getHours()) + ":" + value_672(startDate_2.getMinutes());
    },
    lines = ["Linked Friend Memory / 关联好友记忆:", "These are private friend chats belonging to the character. They are context about the character's own friends, not messages from the current User."];
  return linkedChats.forEach((chat, value_675) => {
    const displayName_2 = chat.remark || chat.name || chat.realName || "Friend " + (value_675 + 1),
      realName_2 = chat.realName || chat.name || displayName_2,
      recentMessages_2 = Array.isArray(chat.messages) ? chat.messages.slice(-maxMessagesPerFriend_2) : [];
    lines.push("");
    lines.push("Friend " + (value_675 + 1) + ": " + displayName_2);
    lines.push("Real Name: " + (realName_2 || "Unknown"));
    lines.push("Remark: " + (chat.remark || displayName_2 || "None"));
    lines.push("Relationship: " + (chat.relationship || "None"));
    lines.push("Persona: " + (chat.persona || "None"));
    lines.push("Recent private messages, fixed to the latest 2 rounds:");
    recentMessages_2.length === 0 ? lines.push("None") : recentMessages_2.forEach(message_10 => {
      const speaker_3 = message_10.role === "char" ? charName_2 : displayName_2,
        value_681 = value_665 ? "[" + value_667(message_10.timestamp) + "] " : "";
      lines.push("" + value_681 + speaker_3 + ": " + (message_10.text || ""));
    });
  }), lines.join("\n");
};
window.imApp.getXDirectMessageMountCandidates = function (value_682) {
  const friendId_2 = window.imApp.resolveFriendId(value_682);
  if (friendId_2 == null) return [];
  const value_684 = typeof window.getAppState === "function" ? window.getAppState("x") : window.__xFallbackState,
    directMessages = Array.isArray(value_684?.xDirectMessages) ? value_684.xDirectMessages : [],
    getMessageText = message_11 => {
      if (!message_11 || typeof message_11 !== "object") return "";
      if (message_11.type === "post-card") {
        const post_2 = message_11.postSnapshot || message_11.post || {};
        return ("[X Post] " + String(post_2.text || post_2.content || "").trim()).trim();
      }
      return String(message_11.text || message_11.content || message_11.message || "").trim();
    };
  return directMessages.filter(item_18 => item_18 && String(item_18.sourceFriendId || "") === String(friendId_2)).map((item_19, index_5) => {
    const messages_3 = Array.isArray(item_19.messages) ? item_19.messages : [],
      lastMessage = messages_3[messages_3.length - 1] || null,
      updatedAt_3 = Number(lastMessage?.createdAt || lastMessage?.timestamp || item_19.updatedAt || item_19.addedAt) || 0;
    return {
      id: String(item_19.id || ""),
      name: String(item_19.name || item_19.nickname || item_19.realName || "X Char"),
      handle: String(item_19.handle || ""),
      messages: messages_3,
      messageCount: messages_3.length,
      lastMessageText: getMessageText(lastMessage),
      updatedAt: updatedAt_3,
      index: index_5
    };
  }).filter(value_695 => value_695.id).sort((left_2, right) => right.updatedAt - left_2.updatedAt || left_2.index - right.index);
};
window.imApp.buildXDirectMessageMemoryContext = function (value_697, options_9 = {}) {
  const normalizedFriend_6 = window.imApp.normalizeFriendData(value_697 || {});
  if (normalizedFriend_6.type === "group") return "";
  const mount_6 = window.imApp.normalizeXDirectMessageMount(normalizedFriend_6.memory?.xDirectMessageMount);
  if (!mount_6.enabled) return "";
  const xDirectMessageMountCandidates = window.imApp.getXDirectMessageMountCandidates(normalizedFriend_6),
    mountedThread = xDirectMessageMountCandidates.find(value_723 => value_723.id === mount_6.dmId) || (!mount_6.dmId ? xDirectMessageMountCandidates[0] : null);
  if (!mountedThread) return "";
  const requestedLimit = Number(options_9.maxMessages),
    value_702 = options_9?.includeTime !== false,
    limit_3 = Number.isFinite(requestedLimit) ? Math.max(1, Math.min(50, Math.floor(requestedLimit))) : mount_6.limit,
    value_704 = normalizedFriend_6.nickname || normalizedFriend_6.realName || "Char",
    xCharName = mountedThread.name || "X Char",
    sanitize = value_22 => String(value_22 == null ? "" : value_22).replace(/[<>]/g, character => character === "<" ? "‹" : "›").slice(0, 800),
    formatTime_2 = value_725 => {
      const timestamp_4 = Number(value_725) || 0;
      if (!timestamp_4) return "Unknown time";
      const startDate_3 = new Date(timestamp_4),
        value_728 = value_729 => String(value_729).padStart(2, "0");
      return startDate_3.getFullYear() + "-" + value_728(startDate_3.getMonth() + 1) + "-" + value_728(startDate_3.getDate()) + " " + value_728(startDate_3.getHours()) + ":" + value_728(startDate_3.getMinutes());
    },
    formatMessage = message_13 => {
      if (!message_13 || typeof message_13 !== "object") return "";
      const isPostCard = message_13.type === "post-card",
        post_3 = isPostCard ? message_13.postSnapshot || message_13.post || {} : null,
        rawText = isPostCard ? "[X Post] " + (post_3?.name || "") + " " + (post_3?.text || post_3?.content || "") : message_13.text || message_13.content || message_13.message || "",
        text_4 = sanitize(rawText).trim();
      if (!text_4) return "";
      const speaker_4 = message_13.source === "user" || message_13.sender === "user" ? "User" : xCharName,
        value_736 = value_702 ? "[" + formatTime_2(message_13.createdAt || message_13.timestamp) + "] " : "";
      return "" + value_736 + speaker_4 + ": " + text_4;
    },
    xState = typeof window.getAppState === "function" ? window.getAppState("x") : window.__xFallbackState,
    directMessages_2 = Array.isArray(xState?.xDirectMessages) ? xState.xDirectMessages : [],
    allXPosts = Array.isArray(xState?.xGeneratedPosts) ? xState.xGeneratedPosts : [],
    rawMountedThread = directMessages_2.find(item_20 => String(item_20?.id || "") === String(mountedThread.id)) || {},
    normalizeIdentity = value_23 => String(value_23 == null ? "" : value_23).split("·")[0].trim().replace(/^@/, "").toLocaleLowerCase(),
    getPostTimestamp = post_4 => Number(post_4?.createdAt || post_4?.timestamp || post_4?.publishedAt || 0) || 0,
    getPostText = post_5 => String(post_5?.text || post_5?.content || "").trim(),
    getPostAuthorHandle = post_6 => normalizeIdentity(post_6?.handle || post_6?.authorHandle || post_6?.accountHandle),
    getPostAuthorName = post_7 => String(post_7?.authorName || post_7?.name || post_7?.displayName || "").trim(),
    currentUserHandle = normalizeIdentity(xState?.xData?.handle),
    mountedCharHandle = normalizeIdentity(mountedThread.handle),
    mountedCharName = String(mountedThread.name || "").trim().toLocaleLowerCase(),
    isCurrentUserPost = post_8 => {
      const authorId_2 = String(post_8?.authorId || post_8?.accountId || "").trim();
      if (authorId_2 === "me" || authorId_2 === "user:self" || authorId_2 === "current-user") return true;
      const authorHandle_2 = getPostAuthorHandle(post_8);
      return Boolean(currentUserHandle && authorHandle_2 && currentUserHandle === authorHandle_2);
    },
    isMountedCharPost = post_9 => {
      const authorId_3 = String(post_9?.authorId || post_9?.profileOwnerId || post_9?.accountId || "").trim();
      if (authorId_3 && authorId_3 === String(mountedThread.id)) return true;
      const authorHandle_3 = getPostAuthorHandle(post_9);
      if (mountedCharHandle && authorHandle_3 && mountedCharHandle === authorHandle_3) return true;
      return !authorHandle_3 && !!mountedCharName && getPostAuthorName(post_9).toLocaleLowerCase() === mountedCharName;
    },
    value_717 = (post_10, value_750) => {
      const text_5 = sanitize(getPostText(post_10)).trim();
      if (!text_5) return "";
      const topic = sanitize(post_10?.topicTag || "").trim(),
        value_753 = value_702 ? "[" + formatTime_2(getPostTimestamp(post_10)) + "] " : "";
      return "" + value_753 + value_750 + " posted on X" + (topic ? " (" + topic + ")" : "") + ": " + text_5;
    },
    collectRecentPosts = (posts, value_755) => {
      const seen = new Set();
      return (Array.isArray(posts) ? posts : []).slice().filter(post_11 => getPostText(post_11)).sort((left_3, right_2) => getPostTimestamp(right_2) - getPostTimestamp(left_3)).filter(value_760 => {
        const key_5 = String(value_760?.id || "") || getPostTimestamp(value_760) + ":" + getPostText(value_760);
        if (seen.has(key_5)) return false;
        return seen.add(key_5), true;
      }).slice(0, limit_3).sort((value_762, value_763) => getPostTimestamp(value_762) - getPostTimestamp(value_763)).map(value_764 => value_717(value_764, value_755)).filter(Boolean);
    },
    recentMessages_3 = mountedThread.messages.slice().sort((left_4, right_3) => Number(left_4?.createdAt || left_4?.timestamp || 0) - Number(right_3?.createdAt || right_3?.timestamp || 0)).slice(-limit_3).map(formatMessage).filter(Boolean),
    recentUserPosts = collectRecentPosts(allXPosts.filter(isCurrentUserPost), "User"),
    charProfilePosts = [...(Array.isArray(rawMountedThread.profilePosts) ? rawMountedThread.profilePosts : []), ...allXPosts.filter(isMountedCharPost)],
    recentCharPosts = collectRecentPosts(charProfilePosts, "Current Char (" + xCharName + ")");
  if (recentMessages_3.length === 0 && recentUserPosts.length === 0 && recentCharPosts.length === 0) return "";
  return "<mounted_x_direct_message_context>\nSource: mounted X app social context for the same Char. This is prior cross-platform context, not a message sent in the current iMessage thread.\nMounted X thread: " + sanitize(xCharName) + (mountedThread.handle ? " (" + sanitize(mountedThread.handle) + ")" : "") + "\nUse it only to maintain continuity with User. Do not say other characters saw it, and do not present any of this as an iMessage bubble.\nCurrent iMessage Char: " + sanitize(value_704) + "\n\n<x_private_direct_messages>\nScope: prior one-to-one private X direct messages between User and the current Char. These are neither public posts nor iMessage bubbles.\n" + (recentMessages_3.length ? recentMessages_3.join("\n") : "None") + "\n</x_private_direct_messages>\n\n<x_user_public_posts>\nScope: User's public X posts.\nOwnership hard rule: every post in this block was authored and publicly posted by User, not by you (the current Char). Never claim, imply, remember, or refer to any of these posts as your own.\n" + (recentUserPosts.length ? recentUserPosts.join("\n") : "None") + "\n</x_user_public_posts>\n\n<x_current_char_own_public_posts>\nScope: the current Char's own public X profile posts.\nOwnership hard rule: every post in this block was authored and publicly posted by you, the current Char. Treat it as your own public content; do not deny authorship or describe it as User's or someone else's post.\n" + (recentCharPosts.length ? recentCharPosts.join("\n") : "None") + "\n</x_current_char_own_public_posts>\n</mounted_x_direct_message_context>";
};
window.imApp.getBstagePopMountCandidates = function () {
  const value_767 = typeof window.getAppState === "function" ? window.getAppState("bstage") : window.__bstageGlobalState,
    items_768 = [value_767?.bstageUserTeamState, ...(Array.isArray(value_767?.teams) ? value_767.teams : [])];
  return items_768.filter(item_21 => item_21 && item_21.id != null).flatMap(normalized_4 => (Array.isArray(normalized_4.members) ? normalized_4.members : []).filter(value_771 => value_771 && value_771.id != null && !value_771.isUserMember && String(value_771.id) !== "__bstage_user_member__").map(member_5 => ({
    teamId: String(normalized_4.id),
    memberId: String(member_5.id),
    teamName: String(normalized_4.id) === "__bstage_user_team__" || normalized_4.isUserTeam ? "我的团队" : String(normalized_4.name || "未命名团队"),
    name: String(member_5.name || "未命名 Char"),
    sourceFriendId: member_5.sourceFriendId == null ? "" : String(member_5.sourceFriendId),
    member: member_5
  })));
};
window.imApp.getMountedBstagePopMember = function (value_773) {
  const bstagePopMount_774 = window.imApp.normalizeBstagePopMount(value_773?.memory?.bstagePopMount);
  if (!bstagePopMount_774.teamId || !bstagePopMount_774.memberId) return null;
  return window.imApp.getBstagePopMountCandidates().find(value_775 => value_775.teamId === bstagePopMount_774.teamId && value_775.memberId === bstagePopMount_774.memberId) || null;
};
window.imApp.formatCrossAppActivityTime = function (value_776) {
  const number_777 = Number(value_776);
  if (!Number.isFinite(number_777) || number_777 <= 0) return "";
  const startDate_4 = new Date(number_777);
  if (Number.isNaN(startDate_4.getTime())) return "";
  const value_779 = value_780 => String(value_780).padStart(2, "0");
  return startDate_4.getFullYear() + "-" + value_779(startDate_4.getMonth() + 1) + "-" + value_779(startDate_4.getDate()) + " " + value_779(startDate_4.getHours()) + ":" + value_779(startDate_4.getMinutes());
};
window.imApp.sanitizeCrossAppActivity = function (value_25) {
  return String(value_25 == null ? "" : value_25).replace(/[<>]/g, character_2 => character_2 === "<" ? "‹" : "›").replace(/\s+/g, " ").trim().slice(0, 400);
};
window.imApp.buildBstagePopMemoryContext = function (value_783) {
  const friendData_784 = window.imApp.normalizeFriendData(value_783 || {});
  if (friendData_784.type !== "char") return "";
  const mount_7 = window.imApp.normalizeBstagePopMount(friendData_784.memory?.bstagePopMount);
  if (!mount_7.enabled) return "";
  const mountedThread_2 = window.imApp.getMountedBstagePopMember(friendData_784);
  if (!mountedThread_2) return "";
  const items_786 = Array.isArray(mountedThread_2.member.chatHistory) ? mountedThread_2.member.chatHistory : [],
    filter_787 = items_786.filter(value_788 => value_788 && value_788.isUser === false && ["text", "image"].includes(value_788.type)).slice(-10).map(message_789 => {
      const value_790 = message_789.type === "image" ? "[图片] " + (message_789.imgDesc || "") : message_789.text,
        mountedThread_3 = window.imApp.sanitizeCrossAppActivity(value_790);
      if (!mountedThread_3) return "";
      const formatCrossAppActivityTime_792 = window.imApp.formatCrossAppActivityTime(message_789.timestamp);
      return "" + (formatCrossAppActivityTime_792 ? "[" + formatCrossAppActivityTime_792 + "] " : "") + mountedThread_3;
    }).filter(Boolean);
  if (!filter_787.length) return "";
  return "<mounted_bstage_pop_activity>\nSource: your own recent b.stage POP messages as the same Char. This account belongs to you; these are activities you did, not messages in the current iMessage chat.\nDo not infer what any fan said, who the fan is, or that a POP fan is User. Do not reproduce this as iMessage bubbles.\n" + filter_787.join("\n") + "\n</mounted_bstage_pop_activity>";
};
window.imApp.buildImessageCharActivityForBstage = async function (value_793, value_794) {
  const filter_795 = (window.imData?.friends || []).filter(value_799 => {
    if (!value_799 || value_799.type !== "char") return false;
    const bstagePopMount_800 = window.imApp.normalizeBstagePopMount(value_799.memory?.bstagePopMount);
    return bstagePopMount_800.enabled && bstagePopMount_800.teamId === String(value_793) && bstagePopMount_800.memberId === String(value_794);
  });
  if (filter_795.length !== 1) return "";
  const value_796 = filter_795[0],
    value_797 = await window.imApp.ensureFriendRecentMessagesLoaded(value_796, {
      limit: 90
    }),
    filter_798 = (Array.isArray(value_797) ? value_797 : []).filter(message_801 => message_801 && message_801.role === "assistant" && !["system_notice", "date"].includes(message_801.type)).slice(-10).map(message_802 => {
      const value_803 = message_802.type === "image" ? "[图片] " + (message_802.description || message_802.imgDesc || message_802.text || "") : message_802.content || message_802.text || "",
        mountedThread_4 = window.imApp.sanitizeCrossAppActivity(value_803);
      if (!mountedThread_4) return "";
      const formatCrossAppActivityTime_805 = window.imApp.formatCrossAppActivityTime(message_802.timestamp);
      return "" + (formatCrossAppActivityTime_805 ? "[" + formatCrossAppActivityTime_805 + "] " : "") + mountedThread_4;
    }).filter(Boolean);
  if (!filter_798.length) return "";
  return "<private_imessage_char_activity>\nThese are your own recent iMessage remarks, private background about your activities only. The current POP fan is not the iMessage User. Never quote, paraphrase, hint at, or disclose the iMessage private conversation, User's identity, relationship, or personal details to POP fans. Use only non-private facts about your own day for consistency.\n" + filter_798.join("\n") + "\n</private_imessage_char_activity>";
};
window.imApp.getMomentMessages = function () {
  return Array.isArray(window.imData.momentMessages) ? window.imData.momentMessages : [];
};
window.imApp.setMomentMessages = function (messages_4) {
  window.imData.momentMessages = Array.isArray(messages_4) ? messages_4 : [];
};
const recentFriendMessageWindows = new Map(),
  recentFriendMessageLoadPromises = new Map();
window.imApp.getFriendMessageCount = function (value_807) {
  const value_808 = typeof value_807 === "object" && value_807 !== null ? value_807 : (window.imData.friends || []).find(value_811 => String(value_811?.id) === String(value_807));
  if (!value_808) return 0;
  if (value_808.messagesLoaded === true && Array.isArray(value_808.messages)) return value_808.messages.length;
  const number_809 = Number(value_808.messageCount);
  if (Number.isFinite(number_809) && number_809 >= 0) return Math.round(number_809);
  const number_810 = Number(recentFriendMessageWindows.get(String(value_808.id))?.totalCount);
  if (Number.isFinite(number_810) && number_810 >= 0) return Math.round(number_810);
  return Array.isArray(value_808.messages) ? value_808.messages.length : 0;
};
window.imApp.repairFriendMessageCount = function (value_812, value_813) {
  if (!value_812 || !Number.isFinite(Number(value_813)) || Number(value_813) < 0) return false;
  const messageCount_2 = Math.round(Number(value_813)),
    number_815 = Number(value_812.messageCount);
  value_812.messageCount = messageCount_2;
  if (number_815 === messageCount_2 || !window.imStorage?.patchFriendMeta) return false;
  return Promise.resolve(window.imStorage.patchFriendMeta(value_812.id, {
    messageCount: messageCount_2
  }))["catch"](value_816 => console.warn("Failed to repair friend message count", value_812.id, value_816)), true;
};
window.imApp.getFriendRecentMessageWindow = function (friendOrId_2) {
  const targetId_3 = typeof friendOrId_2 === "object" && friendOrId_2 !== null ? friendOrId_2.id : friendOrId_2;
  if (targetId_3 == null) return null;
  return recentFriendMessageWindows.get(String(targetId_3)) || null;
};
window.imApp.restoreLoadedMemoryRequests = function (normalizedFriend_7, value_820) {
  const value_821 = new Set((Array.isArray(normalizedFriend_7?.memory?.cherishedEntries) ? normalizedFriend_7.memory.cherishedEntries : []).map(value_822 => String(value_822?.sourceEventId || "")).filter(Boolean));
  return (Array.isArray(value_820) ? value_820 : []).forEach(message_823 => {
    if (message_823?.type !== "memory_request") return;
    const memoryRequestId_3 = String(message_823.memoryRequestId || message_823.id || "");
    message_823.memoryRequestId = memoryRequestId_3;
    !["pending", "confirmed", "cancelled"].includes(message_823.requestStatus) && (message_823.requestStatus = value_821.has(memoryRequestId_3) ? "confirmed" : "pending");
    (!message_823.memoryPayload || typeof message_823.memoryPayload !== "object") && (message_823.memoryPayload = {
      title: "珍视回忆",
      content: String(message_823.content || "")
    });
    message_823.excludedFromContext = true;
  }), value_820;
};
window.imApp.ensureFriendRecentMessagesLoaded = async function (friendOrId_3, options_10 = {}) {
  const targetId_4 = typeof friendOrId_3 === "object" && friendOrId_3 !== null ? friendOrId_3.id : friendOrId_3;
  if (targetId_4 == null) return [];
  const runId_2 = String(targetId_4),
    targetFriend_6 = (window.imData.friends || []).find(value_833 => String(value_833.id) === runId_2);
  if (!targetFriend_6) return [];
  if (targetFriend_6.messagesLoaded && Array.isArray(targetFriend_6.messages)) return targetFriend_6.messages;
  const result_830 = recentFriendMessageWindows.get(runId_2);
  if (result_830?.loaded && Array.isArray(targetFriend_6.messages)) return targetFriend_6.messages;
  const selected_2 = recentFriendMessageLoadPromises.get(runId_2);
  if (selected_2) return selected_2;
  if (!window.imStorage?.loadRecentMessagesByFriendId) return window.imApp.ensureFriendMessagesLoaded ? window.imApp.ensureFriendMessagesLoaded(targetFriend_6, options_10) : [];
  const cotSummary_2 = (async () => {
    try {
      const friend_12 = await window.imStorage.loadRecentMessagesByFriendId(runId_2, {
        limit: options_10.limit || 90
      });
      targetFriend_6.messages = window.imApp.restoreLoadedMemoryRequests(targetFriend_6, Array.isArray(friend_12?.messages) ? friend_12.messages : []);
      targetFriend_6.messagesLoaded = false;
      window.imApp.repairFriendMessageCount(targetFriend_6, friend_12?.totalCount);
      recentFriendMessageWindows.set(runId_2, {
        loaded: true,
        hasMore: friend_12?.hasMore === true,
        oldestOrder: Number.isFinite(Number(friend_12?.oldestOrder)) ? Number(friend_12.oldestOrder) : null,
        totalCount: window.imApp.getFriendMessageCount(targetFriend_6)
      });
      if (typeof options_10.onLoaded === "function") options_10.onLoaded(targetFriend_6.messages, targetFriend_6);
      return targetFriend_6.messages;
    } catch (value_835) {
      return console.error("Failed to load recent friend messages", value_835), window.imApp.ensureFriendMessagesLoaded ? window.imApp.ensureFriendMessagesLoaded(targetFriend_6, options_10) : [];
    } finally {
      recentFriendMessageLoadPromises.get(runId_2) === cotSummary_2 && recentFriendMessageLoadPromises["delete"](runId_2);
    }
  })();
  return recentFriendMessageLoadPromises.set(runId_2, cotSummary_2), cotSummary_2;
};
window.imApp.loadEarlierFriendMessages = async function (friendOrId_4, value_837 = {}) {
  const targetId_5 = typeof friendOrId_4 === "object" && friendOrId_4 !== null ? friendOrId_4.id : friendOrId_4;
  if (targetId_5 == null) return {
    messages: [],
    addedCount: 0,
    hasMore: false
  };
  const string_839 = String(targetId_5),
    friend_14 = (window.imData.friends || []).find(value_847 => String(value_847.id) === string_839),
    result_841 = recentFriendMessageWindows.get(string_839);
  if (!friend_14 || friend_14.messagesLoaded || !result_841?.hasMore || !window.imStorage?.loadRecentMessagesByFriendId) return {
    messages: Array.isArray(friend_14?.messages) ? friend_14.messages : [],
    addedCount: 0,
    hasMore: result_841?.hasMore === true
  };
  const friend_15 = await window.imStorage.loadRecentMessagesByFriendId(string_839, {
      limit: value_837.limit || 60,
      beforeOrder: result_841.oldestOrder
    }),
    restoreLoadedMemoryRequests_843 = window.imApp.restoreLoadedMemoryRequests(friend_14, Array.isArray(friend_15?.messages) ? friend_15.messages : []);
  window.imApp.repairFriendMessageCount(friend_14, friend_15?.totalCount);
  const items_844 = Array.isArray(friend_14.messages) ? friend_14.messages : [],
    value_845 = new Set(items_844.map(value_848 => String(value_848?.id || "")).filter(Boolean)),
    filter_846 = restoreLoadedMemoryRequests_843.filter(value_849 => !value_849?.id || !value_845.has(String(value_849.id)));
  return friend_14.messages = [...filter_846, ...items_844], recentFriendMessageWindows.set(string_839, {
    loaded: true,
    hasMore: friend_15?.hasMore === true,
    oldestOrder: Number.isFinite(Number(friend_15?.oldestOrder)) ? Number(friend_15.oldestOrder) : result_841.oldestOrder,
    totalCount: window.imApp.getFriendMessageCount(friend_14)
  }), {
    messages: friend_14.messages,
    addedCount: filter_846.length,
    hasMore: friend_15?.hasMore === true
  };
};
window.imApp.ensureFriendMessagesLoaded = async function (friendOrId_5, options_11 = {}) {
  const targetId_6 = typeof friendOrId_5 === "object" && friendOrId_5 !== null ? friendOrId_5.id : friendOrId_5;
  if (targetId_6 == null) return [];
  const targetFriend_7 = (window.imData.friends || []).find(value_854 => String(value_854.id) === String(targetId_6));
  if (!targetFriend_7) return [];
  if (targetFriend_7.messagesLoaded && Array.isArray(targetFriend_7.messages)) return recentFriendMessageWindows["delete"](String(targetId_6)), targetFriend_7.messages;
  try {
    const result_855 = recentFriendMessageWindows.get(String(targetId_6)),
      value_856 = Array.isArray(targetFriend_7.messages) ? targetFriend_7.messages : [],
      presetId_2 = String(value_856[0]?.id || ""),
      value_858 = typeof document !== "undefined" ? document.querySelector("#chat-interface-" + targetId_6 + " .ins-chat-messages") : null,
      value_859 = Number(value_858?._imHistoryState?.visibleStartIndex) || 0;
    if (!window.imStorage || !window.imStorage.loadMessagesByFriendId) {
      if (options_11.requireComplete === true && targetFriend_7.messagesLoaded !== true) throw new Error("Complete friend message storage is unavailable");
      return targetFriend_7.messages = Array.isArray(targetFriend_7.messages) ? targetFriend_7.messages : [], targetFriend_7.messagesLoaded = true, targetFriend_7.messages;
    }
    const loadedMessages = await window.imStorage.loadMessagesByFriendId(targetId_6);
    targetFriend_7.messages = window.imApp.restoreLoadedMemoryRequests(targetFriend_7, Array.isArray(loadedMessages) ? loadedMessages : []);
    targetFriend_7.messagesLoaded = true;
    recentFriendMessageWindows["delete"](String(targetId_6));
    window.imApp.repairFriendMessageCount(targetFriend_7, targetFriend_7.messages.length);
    if (result_855 && value_858?._imHistoryState && presetId_2) {
      const visibleEndIndex_2 = targetFriend_7.messages.findIndex(item_22 => String(item_22?.id || "") === presetId_2);
      visibleEndIndex_2 >= 0 && (value_858._imHistoryState.visibleStartIndex = visibleEndIndex_2 + value_859, Number.isFinite(Number(value_858._imHistoryState.visibleEndIndex)) && (value_858._imHistoryState.visibleEndIndex += visibleEndIndex_2), value_858._imHistoryState.totalMessages = targetFriend_7.messages.length);
    }
    if (targetFriend_7.messages.length > 0) {
      const visibleMessages = targetFriend_7.messages.filter(message_15 => window.imApp.getFriendMessagePreview(message_15)),
        lastMessage_2 = visibleMessages.length > 0 ? visibleMessages[visibleMessages.length - 1] : null;
      targetFriend_7.lastMessageTimestamp = Number(lastMessage_2?.timestamp) || targetFriend_7.lastMessageTimestamp || 0;
      targetFriend_7.lastMessagePreview = (lastMessage_2 ? window.imApp.getFriendMessagePreview(lastMessage_2) : "") || targetFriend_7.lastMessagePreview || "";
    }
    return typeof options_11.onLoaded === "function" && options_11.onLoaded(targetFriend_7.messages, targetFriend_7), targetFriend_7.messages;
  } catch (e_2) {
    console.error("Failed to load friend messages on demand", e_2);
    targetFriend_7.messages = Array.isArray(targetFriend_7.messages) ? targetFriend_7.messages : [];
    targetFriend_7.messagesLoaded = false;
    if (options_11.requireComplete === true) throw e_2;
    return targetFriend_7.messages;
  }
};
window.imApp.getMomentsCoverUrl = function () {
  return window.imData.momentsCoverUrl || null;
};
window.imApp.setMomentsCoverUrl = function (url_2) {
  window.imData.momentsCoverUrl = url_2 || null;
};
window.imApp.cloneDataSnapshot = function (value_34) {
  if (typeof structuredClone === "function") return structuredClone(value_34);
  return JSON.parse(JSON.stringify(value_34));
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
window.imApp.markMomentsLoaded = function (loaded_2 = true) {
  window.imData.momentsLoaded = !!loaded_2;
};
window.imApp.markMomentMessagesLoaded = function (loaded_3 = true) {
  window.imData.momentMessagesLoaded = !!loaded_3;
};
window.imApp.markStickersLoaded = function (loaded_4 = true) {
  window.imData.stickersLoaded = !!loaded_4;
};
window.imApp.getFriendMessagePreview = function (value_872) {
  const targetMessage_4 = value_872 || {};
  if (targetMessage_4.type === "memory_request") return "";
  if (targetMessage_4.type === "user_phone_access_card") {
    const value_874 = Array.isArray(targetMessage_4.visits) ? targetMessage_4.visits : [];
    return "[查手机记录] 查看了 " + value_874.length + " 个聊天";
  }
  if (targetMessage_4.type === "chat_record_forward") return window.imApp.getChatRecordPreview ? window.imApp.getChatRecordPreview(targetMessage_4) : "[聊天记录]";
  if (targetMessage_4.type === "image") {
    const desc = targetMessage_4.text || targetMessage_4.description || "";
    return desc ? ("[图片] " + desc).trim() : "[图片]";
  }
  if (targetMessage_4.type === "location") {
    const value_876 = targetMessage_4.locationName || targetMessage_4.name || "共享位置",
      value_877 = targetMessage_4.locationAddress || targetMessage_4.address || "",
      value_878 = targetMessage_4.locationNameTranslation || targetMessage_4.nameTranslation || "",
      value_879 = targetMessage_4.locationAddressTranslation || targetMessage_4.addressTranslation || "";
    return ("[位置] " + value_876 + (value_878 ? "（" + value_878 + "）" : "") + (value_877 ? " — " + value_877 + (value_879 ? "（" + value_879 + "）" : "") : "")).trim();
  }
  if (targetMessage_4.type === "voice_message") return ("[语音] " + (targetMessage_4.transcript || targetMessage_4.text || "")).trim();
  if (targetMessage_4.type === "sticker") {
    const name_5 = targetMessage_4.stickerName || targetMessage_4.text || "";
    return name_5 ? ("[表情包] " + name_5).trim() : "[表情包]";
  }
  if (targetMessage_4.type === "moment_forward") {
    let content_3 = "";
    try {
      if (targetMessage_4.content) {
        const parsed = JSON.parse(targetMessage_4.content);
        content_3 = parsed.text || "";
      }
    } catch (value_883) {}
    return content_3 ? ("[朋友圈] " + content_3).trim() : "[朋友圈]";
  }
  if (targetMessage_4.type === "pay_transfer") return ("[转账] " + (targetMessage_4.description || "")).trim();
  if (targetMessage_4.type === "group_red_packet") return ("[群红包] " + (targetMessage_4.description || "")).trim();
  if (targetMessage_4.type === "voice_call_record") return targetMessage_4.text || ("[语音通话记录] " + (targetMessage_4.statusText || "")).trim();
  if (targetMessage_4.type === "together_listening_invite") {
    const value_884 = targetMessage_4.title || "未知歌曲";
    return "[一起听] " + value_884 + (targetMessage_4.inviteStatus === "accepted" ? " · 已接受" : "");
  }
  if (targetMessage_4.type === "fake_link") {
    const fakeLinkData_3 = targetMessage_4.fakeLinkData && typeof targetMessage_4.fakeLinkData === "object" ? targetMessage_4.fakeLinkData : {},
      label_2 = fakeLinkData_3.siteName || "假链接",
      title_5 = fakeLinkData_3.title || targetMessage_4.content || "";
    return ("[" + label_2 + "] " + title_5).trim();
  }
  if (targetMessage_4.type === "offline_meeting_record") return "[见面记录]";
  if (targetMessage_4.type === "system_notice") {
    const noticeKind_3 = targetMessage_4.noticeKind || "",
      value_889 = targetMessage_4.content || targetMessage_4.text || "";
    if (noticeKind_3 === "group_left") return "你已退出群聊";
    if (noticeKind_3 === "group_rejoined") return "你重新进入群聊";
    if (noticeKind_3 === "narration") return ("[旁白] " + value_889).trim();
    if (noticeKind_3 === "offline_meeting_active") return "";
    if (noticeKind_3 === "message_recalled") {
      if (targetMessage_4.actorRole === "user") return "你撤回了一条消息";
      const trim_890 = String(targetMessage_4.actorName || "").trim();
      return (trim_890 || "对方") + "撤回了一条消息";
    }
    return value_889;
  }
  if (targetMessage_4.type === "html") return targetMessage_4.text || "[卡片消息]";
  return targetMessage_4.content || targetMessage_4.text || "";
};
window.imApp.syncFriendMessageSummary = function (friend_16) {
  if (!friend_16) return null;
  const messages_5 = Array.isArray(friend_16.messages) ? friend_16.messages : [],
    visibleMessages_2 = messages_5.filter(message_16 => window.imApp.getFriendMessagePreview(message_16)),
    lastMessage_3 = visibleMessages_2.length > 0 ? visibleMessages_2[visibleMessages_2.length - 1] : null;
  return friend_16.messages = messages_5, friend_16.messagesLoaded = true, friend_16.messageCount = messages_5.length, friend_16.lastMessageTimestamp = Number(lastMessage_3?.timestamp) || 0, friend_16.lastMessagePreview = lastMessage_3 ? window.imApp.getFriendMessagePreview(lastMessage_3) : "", friend_16;
};
window.imApp.getTotalUnreadCount = function () {
  return (Array.isArray(window.imData.friends) ? window.imData.friends : []).reduce((total, friend_17) => total + Math.max(0, Number(friend_17?.unreadCount) || 0), 0);
};
window.imApp.updateChatsUnreadBadges = function () {
  const navChatsBtn_2 = document.getElementById("nav-chats-btn");
  if (!navChatsBtn_2) return;
  let badge = navChatsBtn_2.querySelector(".nav-chats-unread-badge");
  const totalUnread = window.imApp.getTotalUnreadCount(),
    shouldShow = totalUnread > 0 && !navChatsBtn_2.classList.contains("active");
  !badge && (badge = document.createElement("div"), badge.className = "nav-chats-unread-badge", badge.style.cssText = "position:absolute; top:6px; right:14px; min-width:16px; height:16px; padding:0 4px; border-radius:999px; background:#ff3b30; color:#fff; font-size:10px; font-weight:700; line-height:16px; text-align:center; box-sizing:border-box; display:none; pointer-events:none;", navChatsBtn_2.style.position = navChatsBtn_2.style.position || "relative", navChatsBtn_2.appendChild(badge));
  badge.textContent = totalUnread > 99 ? "99+" : String(totalUnread);
  badge.style.display = shouldShow ? "block" : "none";
};
window.imApp.clearFriendUnread = async function (value_898, options_12 = {}) {
  const safeFriendId_2 = String(value_898),
    targetFriend_8 = (window.imData.friends || []).find(value_902 => String(value_902.id) === safeFriendId_2);
  if (!targetFriend_8) return false;
  if (!targetFriend_8.unreadCount) {
    if (window.imApp.updateChatsUnreadBadges) window.imApp.updateChatsUnreadBadges();
    return true;
  }
  targetFriend_8.unreadCount = 0;
  try {
    if (window.imStorage?.saveFriendMeta) await window.imStorage.saveFriendMeta(targetFriend_8);else window.imApp.commitFriendChange && (await window.imApp.commitFriendChange(safeFriendId_2, friend_18 => {
      if (friend_18) friend_18.unreadCount = 0;
    }, {
      silent: true,
      metaOnly: true
    }));
  } catch (error_2) {
    console.error("Failed to clear unread count", error_2);
    if (!options_12.silent && window.showToast) window.showToast("未读状态保存失败");
    return false;
  } finally {
    if (window.imChat?.renderChatsList) window.imChat.renderChatsList();
    if (window.imApp.updateChatsUnreadBadges) window.imApp.updateChatsUnreadBadges();
  }
  return true;
};
window.imApp.reindexFriendMessages = function (friend_19) {
  if (!friend_19 || !Array.isArray(friend_19.messages)) return [];
  return friend_19.messages.forEach((value_906, __messageOrder_4) => {
    value_906 && typeof value_906 === "object" && (value_906.__messageOrder = __messageOrder_4);
  }), friend_19.messages;
};
window.imApp.findFriendMessageIndex = function (friend_20, descriptor_2) {
  const messages_6 = Array.isArray(friend_20?.messages) ? friend_20.messages : [];
  if (messages_6.length === 0 || descriptor_2 == null) return -1;
  if (typeof descriptor_2 === "function") return messages_6.findIndex(descriptor_2);
  const descriptorId = typeof descriptor_2 === "object" && descriptor_2 !== null && descriptor_2.id != null ? String(descriptor_2.id) : typeof descriptor_2 !== "object" ? String(descriptor_2) : null,
    descriptorTimestamp = typeof descriptor_2 === "object" && descriptor_2 !== null && descriptor_2.timestamp != null ? String(descriptor_2.timestamp) : null;
  return messages_6.findIndex(message_17 => {
    if (!message_17) return false;
    if (descriptorId && message_17.id != null && String(message_17.id) === descriptorId) return true;
    if (descriptorTimestamp && message_17.timestamp != null && String(message_17.timestamp) === descriptorTimestamp) return true;
    return false;
  });
};
window.imApp.syncActiveFriendReference = function (currentActiveFriend_2) {
  if (!currentActiveFriend_2) return;
  window.imData.currentActiveFriend && String(window.imData.currentActiveFriend.id) === String(currentActiveFriend_2.id) && (window.imData.currentActiveFriend = currentActiveFriend_2);
};
window.imApp.syncSettingsFriendReference = function (currentSettingsFriend_2) {
  if (!currentSettingsFriend_2) return;
  window.imData.currentSettingsFriend && String(window.imData.currentSettingsFriend.id) === String(currentSettingsFriend_2.id) && (window.imData.currentSettingsFriend = currentSettingsFriend_2);
};
window.imApp.clearFriendRuntimeMessageContext = function (friend_21) {
  if (!friend_21) return;
  if (friend_21.pendingRegenerateContext) delete friend_21.pendingRegenerateContext;
  if (window.imData.currentReplyText) window.imData.currentReplyText = null;
  if (window.imData.currentReplyMessageId) window.imData.currentReplyMessageId = null;
  const safeFriendId_3 = String(friend_21.id);
  window.imData.profilePanelUiStateByFriendId && delete window.imData.profilePanelUiStateByFriendId[safeFriendId_3];
  const page = document.getElementById("chat-interface-" + friend_21.id),
    replyPreview = page ? page.querySelector(".reply-preview-container") : null;
  replyPreview && (replyPreview.style.display = "none", replyPreview.querySelectorAll("[data-reply-text], .reply-preview-text").forEach(node => {
    node.textContent = "";
  }));
  page?.querySelectorAll(".typing-row").forEach(value_918 => value_918.remove());
  page?.querySelectorAll(".chat-profile-panel-overlay").forEach(overlay => {
    overlay.classList.remove("active");
    overlay.style.display = "none";
  });
  window.imData.currentActiveRow && (window.imData.currentActiveRow.classList?.remove("message-active"), window.imData.currentActiveRow = null);
};
window.imApp.createClearedConversationMemory = function (memory_4 = {}) {
  const normalizedMemory = window.imApp.normalizeFriendData({
      id: "__conversation_reset__",
      memory: memory_4
    }).memory,
    cleared = window.imApp.createDefaultMemory();
  return cleared.context = {
    enabled: normalizedMemory.context.enabled,
    limit: normalizedMemory.context.limit,
    notes: ""
  }, cleared.summary = {
    enabled: normalizedMemory.summary.enabled,
    limit: normalizedMemory.summary.limit,
    roundLimit: normalizedMemory.summary.roundLimit || 30,
    prompt: normalizedMemory.summary.prompt || "",
    apiPresetId: normalizedMemory.summary.apiPresetId || ""
  }, cleared.autonomous = window.imApp.cloneDataSnapshot(normalizedMemory.autonomous), cleared.schedule = {
    enabled: !!normalizedMemory.schedule.enabled,
    sleepTime: normalizedMemory.schedule.sleepTime || "23:00",
    wakeTime: normalizedMemory.schedule.wakeTime || "07:00",
    events: []
  }, cleared.userOverride = normalizedMemory.userOverride ? window.imApp.cloneDataSnapshot(normalizedMemory.userOverride) : null, cleared.mountSettings = window.imApp.cloneDataSnapshot(normalizedMemory.mountSettings || {}), cleared.mountLimits = window.imApp.cloneDataSnapshot(normalizedMemory.mountLimits || {}), cleared.crossGroupMemorySettings = window.imApp.cloneDataSnapshot(normalizedMemory.crossGroupMemorySettings || {}), cleared.groupChatContexts = window.imApp.cloneDataSnapshot(normalizedMemory.groupChatContexts || []), cleared.lastSummaryMessageCount = 0, cleared;
};
window.imApp.resolveFriendId = function (value_922) {
  if (value_922 && typeof value_922 === "object") return value_922.id;
  return value_922;
};
window.imApp.getFriendById = function (friendOrId) {
  const targetId = window.imApp.resolveFriendId(friendOrId);
  if (targetId == null) return null;
  return (window.imData.friends || []).find(friend_22 => String(friend_22.id) === String(targetId)) || null;
};
window.imApp.commitScopedFriendChange = async function (value_924, value_925, options_13 = {}) {
  if (!window.imApp.commitFriendChange) return false;
  const friendId_927 = window.imApp.resolveFriendId(value_924);
  if (friendId_927 == null) return false;
  return window.imApp.commitFriendChange(friendId_927, (targetFriend_9, friends_2, targetIndex) => {
    if (!targetFriend_9) return;
    return options_13.syncActive !== false && window.imApp.syncActiveFriendReference(targetFriend_9), options_13.syncSettings === true && window.imApp.syncSettingsFriendReference(targetFriend_9), typeof options_13.onTargetResolved === "function" && options_13.onTargetResolved(targetFriend_9, friends_2, targetIndex), typeof value_925 === "function" ? value_925(targetFriend_9, friends_2, targetIndex) : undefined;
  }, options_13);
};
window.imApp.runFriendPersistenceTask = async function (value_931, task) {
  const string_932 = String(value_931),
    value_933 = window.imApp.saveState.friendFlushChains.get(string_932) || Promise.resolve(),
    then_934 = value_933["catch"](() => false).then(async () => {
      return task();
    });
  window.imApp.saveState.friendFlushChains.set(string_932, then_934);
  try {
    return await then_934;
  } finally {
    window.imApp.saveState.friendFlushChains.get(string_932) === then_934 && window.imApp.saveState.friendFlushChains["delete"](string_932);
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
window.imApp.markFriendDirty = function (value_935) {
  if (value_935 == null) return;
  const safeFriendId_4 = String(value_935),
    currentRevision = window.imApp.saveState.friendRevisions.get(safeFriendId_4) || 0;
  window.imApp.saveState.friendRevisions.set(safeFriendId_4, currentRevision + 1);
  window.imApp.saveState.friendDirtyIds.add(safeFriendId_4);
  window.imApp.saveState.dirty = true;
};
window.imApp.markMomentDirty = function (value_938) {
  if (value_938 == null) return;
  const safeMomentId_2 = String(value_938),
    currentRevision_2 = window.imApp.saveState.momentRevisions.get(safeMomentId_2) || 0;
  window.imApp.saveState.momentRevisions.set(safeMomentId_2, currentRevision_2 + 1);
  window.imApp.saveState.momentDirtyIds.add(safeMomentId_2);
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
window.imApp.persistGlobalData = async function (value_941 = {}) {
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage || !window.imStorage.saveGlobalData) throw new Error("imStorage.saveGlobalData unavailable");
    const payload_2 = window.imApp.buildPersistedData();
    return await window.imStorage.saveGlobalData(payload_2), window.imApp.saveState.lastError = null, true;
  } catch (lastError_2) {
    return console.error("Failed to persist iMessage global data", lastError_2), window.imApp.saveState.lastError = lastError_2, !value_941.silent && window.showToast && window.showToast("保存失败，可能是浏览器存储不可用"), false;
  }
};
window.imApp.persistFriendData = async function (friendId_3, options_14 = {}) {
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage || !window.imStorage.saveFriend) throw new Error("imStorage.saveFriend unavailable");
    const result_945 = (window.imData.friends || []).find(value_947 => String(value_947.id) === String(friendId_3));
    if (!result_945) return window.imStorage.deleteFriend && (await window.imStorage.deleteFriend(friendId_3)), window.imApp.saveState.lastError = null, true;
    const shouldPersistMetaOnly = options_14.metaOnly === true && !!window.imStorage.saveFriendMetaOnly;
    if (shouldPersistMetaOnly && window.imStorage.patchFriendMeta) {
      const pendingPatch = window.imApp.saveState.pendingFriendPatches.get(String(friendId_3)) || {};
      Object.keys(pendingPatch).length > 0 && (await window.imStorage.patchFriendMeta(friendId_3, pendingPatch));
    } else {
      const friendSnapshot = window.imApp.cloneDataSnapshot(result_945);
      shouldPersistMetaOnly ? await window.imStorage.saveFriendMetaOnly(friendSnapshot) : await window.imStorage.saveFriend(friendSnapshot, {
        skipMessages: options_14.includeMessages === false
      });
    }
    return window.imApp.saveState.lastError = null, true;
  } catch (lastError_3) {
    return console.error("Failed to persist friend data", lastError_3), window.imApp.saveState.lastError = lastError_3, !options_14.silent && window.showToast && window.showToast("好友数据保存失败"), false;
  }
};
window.imApp.persistMomentData = async function (momentId_2, value_952 = {}) {
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage) throw new Error("imStorage unavailable");
    const targetMoment = (window.imData.moments || []).find(moment_2 => String(moment_2.id) === String(momentId_2));
    if (!targetMoment) return window.imStorage.deleteMoment && (await window.imStorage.deleteMoment(momentId_2)), window.imApp.saveState.lastError = null, true;
    if (!window.imStorage.saveMoment) throw new Error("imStorage.saveMoment unavailable");
    return await window.imStorage.saveMoment(window.imApp.cloneDataSnapshot(targetMoment)), window.imApp.saveState.lastError = null, true;
  } catch (lastError_4) {
    return console.error("Failed to persist moment data", lastError_4), window.imApp.saveState.lastError = lastError_4, !value_952.silent && window.showToast && window.showToast("朋友圈数据保存失败"), false;
  }
};
const IM_CHAT_LIST_RENDER_DEBOUNCE_MS = 180;
let imChatListRenderTimer = null,
  imChatListRenderBatchDepth = 0,
  imChatListRenderDirty = false;
function isImChatConversationOpen() {
  if (document.hidden) return false;
  const activeFriendId = window.imData?.currentActiveFriend?.id;
  if (activeFriendId == null || activeFriendId === "") return false;
  const imessageView_2 = document.getElementById("imessage-view");
  if (!imessageView_2 || !imessageView_2.classList.contains("active") && !imessageView_2.classList.contains("library-together-popup")) return false;
  const page_2 = document.getElementById("chat-interface-" + activeFriendId);
  return !!page_2 && page_2.style.display !== "none";
}
function flushImChatListRender() {
  imChatListRenderTimer = null;
  if (!imChatListRenderDirty || imChatListRenderBatchDepth > 0 || isImChatConversationOpen()) return;
  imChatListRenderDirty = false;
  if (window.imChat?.renderChatsList) window.imChat.renderChatsList();else {
    if (window.imApp.updateChatsUnreadBadges) window.imApp.updateChatsUnreadBadges();
  }
}
window.imApp.isChatConversationOpen = isImChatConversationOpen;
window.imApp.requestChatsListRefresh = function (value_958 = {}) {
  imChatListRenderDirty = true;
  if (imChatListRenderBatchDepth > 0 || isImChatConversationOpen()) return false;
  if (value_958.immediate) {
    if (imChatListRenderTimer) clearTimeout(imChatListRenderTimer);
    return flushImChatListRender(), true;
  }
  if (imChatListRenderTimer) return false;
  return imChatListRenderTimer = setTimeout(flushImChatListRender, IM_CHAT_LIST_RENDER_DEBOUNCE_MS), true;
};
window.imApp.beginChatsListRefreshBatch = function () {
  imChatListRenderBatchDepth += 1;
  let enabled_959 = false;
  return () => {
    if (enabled_959) return;
    enabled_959 = true;
    imChatListRenderBatchDepth = Math.max(0, imChatListRenderBatchDepth - 1);
    imChatListRenderBatchDepth === 0 && imChatListRenderDirty && window.imApp.requestChatsListRefresh();
  };
};
window.imApp.markChatsListRendered = function () {
  imChatListRenderDirty = false;
  imChatListRenderTimer && (clearTimeout(imChatListRenderTimer), imChatListRenderTimer = null);
};
window.imApp.appendFriendMessage = async function (value_960, value_961, value_962 = {}) {
  const friendId_4 = String(value_960),
    targetFriend_10 = (window.imData.friends || []).find(value_973 => String(value_973.id) === friendId_4);
  if (!targetFriend_10) return false;
  if (!Array.isArray(targetFriend_10.messages) && window.imApp.ensureFriendRecentMessagesLoaded) await window.imApp.ensureFriendRecentMessagesLoaded(targetFriend_10);else !Array.isArray(targetFriend_10.messages) && window.imApp.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(targetFriend_10));
  if (!Array.isArray(targetFriend_10.messages)) targetFriend_10.messages = [];
  const targetMessage = value_961 && typeof value_961 === "object" ? value_961 : {};
  window.imApp.captureGroupUserIdentity(targetFriend_10, targetMessage);
  const unreadCount_2 = Math.max(0, Number(targetFriend_10.unreadCount) || 0),
    messagesLoaded_966 = targetFriend_10.messagesLoaded,
    messageCount_3 = Math.max(0, Number(targetFriend_10.messageCount) || 0),
    lastMessageTimestamp_2 = Math.max(0, Number(targetFriend_10.lastMessageTimestamp) || 0),
    lastMessagePreview_2 = String(targetFriend_10.lastMessagePreview || ""),
    max_970 = Math.max(targetFriend_10.messages.length, Math.max(0, Number(targetFriend_10.messageCount) || 0), targetFriend_10.messages.reduce((value_974, value_975) => {
      const number_976 = Number(value_975?.__messageOrder);
      return Number.isFinite(number_976) ? Math.max(value_974, number_976 + 1) : value_974;
    }, 0)),
    __messageOrder_2 = max_970;
  targetMessage.__messageOrder = __messageOrder_2;
  targetFriend_10.messages.push(targetMessage);
  targetFriend_10.messagesLoaded === false ? (targetFriend_10.messageCount = max_970 + 1, targetFriend_10.lastMessageTimestamp = Number(targetMessage.timestamp) || Date.now(), targetFriend_10.lastMessagePreview = window.imApp.getFriendMessagePreview(targetMessage) || targetFriend_10.lastMessagePreview || "") : window.imApp.syncFriendMessageSummary(targetFriend_10);
  const isIncomingMessage = targetMessage.role !== "user",
    isActiveChat = window.imData.currentActiveFriend && String(window.imData.currentActiveFriend.id) === friendId_4;
  isIncomingMessage && !isActiveChat && (targetFriend_10.unreadCount = Math.max(0, Number(targetFriend_10.unreadCount) || 0) + 1);
  window.imApp.syncActiveFriendReference(targetFriend_10);
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage?.commitFriendMessage) throw new Error("Incremental friend message persistence unavailable");
    const value_977 = await window.imApp.runFriendPersistenceTask(friendId_4, async () => {
      return window.imStorage.commitFriendMessage(targetFriend_10, targetMessage, __messageOrder_2);
    });
    value_977 && value_977.id && !targetMessage.id && (targetMessage.id = value_977.id);
    targetMessage.__messageOrder = __messageOrder_2;
    window.imApp.saveState.lastError = null;
    if (window.imApp.requestChatsListRefresh) window.imApp.requestChatsListRefresh();
    return typeof CustomEvent === "function" && window.dispatchEvent(new CustomEvent("u2:friend-message-appended", {
      detail: {
        friendId: friendId_4,
        messageId: String(targetMessage.id || "")
      }
    })), isIncomingMessage && !window.imApp.isChatConversationOpen?.() && window.u2SystemNotifications?.notifyIncomingMessage && window.u2SystemNotifications.notifyIncomingMessage({
      friend: targetFriend_10,
      message: targetMessage
    }), true;
  } catch (lastError_5) {
    console.error("Failed to append friend message", lastError_5);
    targetFriend_10.messages = targetFriend_10.messages.filter((item_23, index_6) => {
      if (item_23 === targetMessage) return false;
      if (targetMessage.id && item_23?.id && String(item_23.id) === String(targetMessage.id)) return false;
      return !(index_6 === __messageOrder_2 && item_23?.timestamp != null && targetMessage.timestamp != null && String(item_23.timestamp) === String(targetMessage.timestamp));
    });
    messagesLoaded_966 === false ? (targetFriend_10.messagesLoaded = false, targetFriend_10.messageCount = messageCount_3, targetFriend_10.lastMessageTimestamp = lastMessageTimestamp_2, targetFriend_10.lastMessagePreview = lastMessagePreview_2) : (window.imApp.reindexFriendMessages(targetFriend_10), window.imApp.syncFriendMessageSummary(targetFriend_10));
    targetFriend_10.unreadCount = unreadCount_2;
    window.imApp.syncActiveFriendReference(targetFriend_10);
    if (window.imApp.requestChatsListRefresh) window.imApp.requestChatsListRefresh();
    return window.imApp.saveState.lastError = lastError_5, !value_962.silent && window.showToast && window.showToast("消息保存失败"), false;
  }
};
window.imApp.updateFriendMessage = async function (value_981, value_982, value_983, value_984 = {}) {
  const string_985 = String(value_981),
    targetFriend_11 = (window.imData.friends || []).find(value_991 => String(value_991.id) === string_985);
  if (!targetFriend_11) return false;
  window.imApp.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(targetFriend_11));
  if (!Array.isArray(targetFriend_11.messages)) return false;
  const __messageOrder_3 = window.imApp.findFriendMessageIndex(targetFriend_11, value_982);
  if (__messageOrder_3 < 0) return false;
  const previousMessage = window.imApp.cloneDataSnapshot(targetFriend_11.messages[__messageOrder_3]),
    targetMessage_5 = targetFriend_11.messages[__messageOrder_3],
    getApiContextFingerprint = message_18 => JSON.stringify({
      role: message_18?.role || "",
      type: message_18?.type || "",
      content: message_18?.content || "",
      text: message_18?.text || "",
      transcript: message_18?.transcript || "",
      description: message_18?.description || "",
      replyTo: message_18?.replyTo || "",
      replyToMessageId: message_18?.replyToMessageId || ""
    }),
    value_989_990 = getApiContextFingerprint(previousMessage);
  try {
    typeof value_983 === "function" && (await value_983(targetMessage_5, targetFriend_11, __messageOrder_3));
    targetMessage_5.__messageOrder = __messageOrder_3;
    window.imApp.syncFriendMessageSummary(targetFriend_11);
    window.imApp.syncActiveFriendReference(targetFriend_11);
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage?.commitFriendMessage) throw new Error("Incremental friend message persistence unavailable");
    const persistedMessage = await window.imApp.runFriendPersistenceTask(string_985, async () => {
      return window.imStorage.commitFriendMessage(targetFriend_11, targetMessage_5, __messageOrder_3);
    });
    return persistedMessage && persistedMessage.id && !targetMessage_5.id && (targetMessage_5.id = persistedMessage.id), persistedMessage && ["contentAssetId", "stickerAssetId", "senderAvatarAssetId"].forEach(field => {
      Object.prototype.hasOwnProperty.call(persistedMessage, field) && (targetMessage_5[field] = persistedMessage[field] || "");
    }), targetMessage_5.__messageOrder = __messageOrder_3, getApiContextFingerprint(targetMessage_5) !== value_989_990 && window.imApp.clearFriendRuntimeMessageContext(targetFriend_11), window.imApp.syncActiveFriendReference(targetFriend_11), window.imApp.syncSettingsFriendReference(targetFriend_11), window.imApp.saveState.lastError = null, true;
  } catch (lastError_6) {
    return console.error("Failed to update friend message", lastError_6), targetFriend_11.messages[__messageOrder_3] = previousMessage, window.imApp.syncFriendMessageSummary(targetFriend_11), window.imApp.syncActiveFriendReference(targetFriend_11), window.imApp.saveState.lastError = lastError_6, !value_984.silent && window.showToast && window.showToast("消息保存失败"), false;
  }
};
window.imApp.removeFriendMessages = async function (value_996, descriptors, value_998 = {}) {
  const safeFriendId_5 = String(value_996),
    targetFriend = (window.imData.friends || []).find(value_1019 => String(value_1019.id) === safeFriendId_5);
  if (!targetFriend) return false;
  window.imApp.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(targetFriend));
  if (!Array.isArray(targetFriend.messages)) return false;
  const descriptorList = Array.isArray(descriptors) ? descriptors : [descriptors],
    messages_7 = window.imApp.cloneDataSnapshot(targetFriend.messages),
    previousFriend = typeof value_998.beforePersist === "function" ? window.imApp.cloneDataSnapshot(targetFriend) : null,
    pendingRegenerateContext_2 = window.imApp.cloneDataSnapshot(targetFriend.pendingRegenerateContext || null),
    recallPresentation_4 = window.imApp.cloneDataSnapshot(targetFriend.memory?.recallPresentation || null),
    currentReplyText_2 = window.imData.currentReplyText || null,
    currentReplyMessageId_2 = window.imData.currentReplyMessageId || null,
    cloneDataSnapshot_1006 = window.imApp.cloneDataSnapshot(targetFriend.memory?.summaryCursor || null),
    lastSummaryMessageCount_4 = Math.max(0, Number(targetFriend.memory?.lastSummaryMessageCount) || 0),
    presetId_3 = String(cloneDataSnapshot_1006?.messageId || "").trim(),
    min_1009 = Math.min(messages_7.length, Math.max(0, Number(cloneDataSnapshot_1006?.count) || lastSummaryMessageCount_4)),
    removalIndexes = new Set();
  descriptorList.forEach(descriptor => {
    const index_7 = window.imApp.findFriendMessageIndex(targetFriend, descriptor);
    if (index_7 > -1) removalIndexes.add(index_7);
  });
  if (removalIndexes.size === 0) return true;
  const sortedRemovalIndexes = Array.from(removalIndexes).sort((a_2, b_2) => a_2 - b_2),
    removedMessages = targetFriend.messages.filter((_, index_8) => removalIndexes.has(index_8)),
    removedMessageIds = new Set(removedMessages.map(message_19 => String(message_19?.id || "").trim()).filter(Boolean)),
    removedApiRunIds = new Set(removedMessages.map(message_20 => String(message_20?.apiRunId || "").trim()).filter(Boolean)),
    removedReplyTexts = new Set(),
    normalizeReplyReferenceText = value_35 => String(value_35 || "").replace(/\s+/g, " ").trim();
  removedMessages.forEach(message_21 => {
    [message_21?.content, message_21?.text, message_21?.transcript, message_21?.description, message_21?.fakeLinkData?.title, message_21?.fakeLinkData?.summary].forEach(value_40 => {
      const text_6 = normalizeReplyReferenceText(value_40);
      if (text_6) removedReplyTexts.add(text_6);
    });
    const primaryText = normalizeReplyReferenceText(message_21?.content || message_21?.text || message_21?.transcript || message_21?.description),
      translationText = normalizeReplyReferenceText(message_21?.translation);
    if (primaryText && translationText) removedReplyTexts.add(primaryText + " " + translationText);
  });
  let enabled_1013 = false,
    canDeleteWithoutReindex = sortedRemovalIndexes.every((index_9, removalOrder) => {
      return index_9 === messages_7.length - sortedRemovalIndexes.length + removalOrder;
    });
  window.imChat?.invalidateFriendConversation && window.imChat.invalidateFriendConversation(safeFriendId_5);
  targetFriend.messages = targetFriend.messages.filter((__2, index_10) => !removalIndexes.has(index_10));
  const removedCotByRunId = new Map();
  removedMessages.forEach(message_22 => {
    const runId_3 = String(message_22?.apiRunId || "").trim(),
      cotSummary_3 = typeof message_22?.cotSummary === "string" ? message_22.cotSummary.trim() : "";
    runId_3 && cotSummary_3 && !removedCotByRunId.has(runId_3) && removedCotByRunId.set(runId_3, cotSummary_3);
  });
  removedCotByRunId.forEach((cotSummary_4, runId) => {
    const runMessages = targetFriend.messages.filter(message_23 => message_23 && message_23.role !== "user" && String(message_23.apiRunId || "").trim() === runId);
    if (runMessages.length === 0 || runMessages.some(message_24 => String(message_24.cotSummary || "").trim())) return;
    runMessages[0].cotSummary = cotSummary_4;
    canDeleteWithoutReindex = false;
  });
  targetFriend.messages.forEach(message_25 => {
    if (!message_25) return;
    const replyMessageId = String(message_25.replyToMessageId || "").trim(),
      replyText = normalizeReplyReferenceText(message_25.replyTo);
    (replyMessageId && removedMessageIds.has(replyMessageId) || replyText && removedReplyTexts.has(replyText)) && (delete message_25.replyToMessageId, delete message_25.replyTo, enabled_1013 = true);
  });
  const recallPresentation_3 = targetFriend.memory?.recallPresentation;
  if (recallPresentation_3) {
    const triggerUserMessageId_2 = String(recallPresentation_3.triggerUserMessageId || "").trim(),
      presentationRunId = String(recallPresentation_3.apiRunId || "").trim(),
      triggerStillExists = !triggerUserMessageId_2 || targetFriend.messages.some(message_26 => message_26?.role === "user" && String(message_26.id || "") === triggerUserMessageId_2),
      anchorStillExists = !presentationRunId || targetFriend.messages.some(message_27 => message_27?.role === "assistant" && String(message_27.apiRunId || "") === presentationRunId);
    (triggerUserMessageId_2 && removedMessageIds.has(triggerUserMessageId_2) || presentationRunId && removedApiRunIds.has(presentationRunId) || !triggerStillExists || !anchorStillExists) && (targetFriend.memory.recallPresentation = null);
  }
  if (typeof value_998.beforePersist === "function") try {
    value_998.beforePersist(targetFriend);
  } catch (value_1048) {
    console.error("Failed to apply friend message removal metadata", value_1048);
    previousFriend ? (Object.keys(targetFriend).forEach(key_6 => delete targetFriend[key_6]), Object.assign(targetFriend, previousFriend)) : targetFriend.messages = messages_7;
    window.imApp.reindexFriendMessages(targetFriend);
    window.imApp.syncFriendMessageSummary(targetFriend);
    window.imApp.syncActiveFriendReference(targetFriend);
    window.imApp.syncSettingsFriendReference(targetFriend);
    if (!value_998.silent && window.showToast) window.showToast("删除消息失败");
    return false;
  }
  window.imApp.reindexFriendMessages(targetFriend);
  targetFriend.memory = targetFriend.memory || window.imApp.createDefaultMemory();
  const value_1016 = presetId_3 ? targetFriend.messages.findIndex(item_24 => String(item_24?.id || "") === presetId_3) : -1,
    lastSummaryMessageCount_3 = value_1016 >= 0 ? value_1016 + 1 : Math.max(0, min_1009 - sortedRemovalIndexes.filter(value_1051 => value_1051 < min_1009).length),
    value_1018 = lastSummaryMessageCount_3 > 0 ? targetFriend.messages[lastSummaryMessageCount_3 - 1] : null;
  targetFriend.memory.lastSummaryMessageCount = lastSummaryMessageCount_3;
  targetFriend.memory.summaryCursor = {
    messageId: String(value_1018?.id || "").trim(),
    order: Number.isFinite(Number(value_1018?.__messageOrder)) ? Number(value_1018.__messageOrder) : -1,
    count: lastSummaryMessageCount_3
  };
  window.imApp.syncFriendMessageSummary(targetFriend);
  window.imApp.clearFriendRuntimeMessageContext(targetFriend);
  window.imApp.syncActiveFriendReference(targetFriend);
  window.imApp.syncSettingsFriendReference(targetFriend);
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage?.saveFriendMeta) throw new Error("Friend meta persistence unavailable");
    const removableIds = removedMessages.map(message_28 => message_28?.id ? String(message_28.id) : null).filter(Boolean);
    return await window.imApp.runFriendPersistenceTask(safeFriendId_5, async () => {
      if (canDeleteWithoutReindex && !enabled_1013 && removableIds.length === removedMessages.length && window.imStorage?.deleteFriendMessages) await window.imStorage.deleteFriendMessages(removableIds);else {
        if (window.imStorage?.replaceFriendMessages) await window.imStorage.replaceFriendMessages(safeFriendId_5, targetFriend.messages);else throw new Error("Friend message removal persistence unavailable");
      }
      return await window.imStorage.saveFriendMeta(targetFriend), true;
    }), window.imApp.saveState.lastError = null, !value_998.preserveRegenerateSnapshots && removedApiRunIds.size > 0 && window.imChat?.purgeRegenerateRunSnapshots && window.imChat.purgeRegenerateRunSnapshots(safeFriendId_5, Array.from(removedApiRunIds)), true;
  } catch (lastError_7) {
    console.error("Failed to remove friend messages", lastError_7);
    if (previousFriend) {
      Object.keys(targetFriend).forEach(key_7 => delete targetFriend[key_7]);
      Object.assign(targetFriend, previousFriend);
    } else {
      targetFriend.messages = messages_7;
      if (pendingRegenerateContext_2) targetFriend.pendingRegenerateContext = pendingRegenerateContext_2;else {
        if (targetFriend.pendingRegenerateContext) delete targetFriend.pendingRegenerateContext;
      }
      targetFriend.memory = targetFriend.memory || window.imApp.createDefaultMemory();
      targetFriend.memory.recallPresentation = recallPresentation_4;
      targetFriend.memory.lastSummaryMessageCount = lastSummaryMessageCount_4;
      targetFriend.memory.summaryCursor = cloneDataSnapshot_1006 || {
        messageId: "",
        order: -1,
        count: lastSummaryMessageCount_4
      };
    }
    return window.imData.currentReplyText = currentReplyText_2, window.imData.currentReplyMessageId = currentReplyMessageId_2, window.imApp.reindexFriendMessages(targetFriend), window.imApp.syncFriendMessageSummary(targetFriend), window.imApp.syncActiveFriendReference(targetFriend), window.imApp.syncSettingsFriendReference(targetFriend), window.imApp.saveState.lastError = lastError_7, !value_998.silent && window.showToast && window.showToast("删除消息失败"), false;
  }
};
window.imApp.resetFriendMessages = async function (value_1056, value_1057 = {}) {
  const string_1058 = String(value_1056),
    targetFriend_12 = (window.imData.friends || []).find(value_1063 => String(value_1063.id) === string_1058);
  if (!targetFriend_12) return false;
  window.imApp.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(targetFriend_12));
  const previousFriend_2 = window.imApp.cloneDataSnapshot(targetFriend_12),
    filter_1061 = (Array.isArray(targetFriend_12.messages) ? targetFriend_12.messages : []).map(message_29 => String(message_29?.apiRunId || "").trim()).filter(Boolean),
    result_1062 = window.imApp.saveState.friendTimers.get(string_1058);
  if (result_1062) clearTimeout(result_1062.timer || result_1062);
  window.imApp.saveState.friendTimers["delete"](string_1058);
  window.imApp.saveState.friendDirtyIds["delete"](string_1058);
  window.imChat?.invalidateFriendConversation && window.imChat.invalidateFriendConversation(string_1058);
  targetFriend_12.messages = [];
  targetFriend_12.unreadCount = 0;
  targetFriend_12.memory = window.imApp.normalizeFriendData(targetFriend_12).memory;
  targetFriend_12.memory.lastSummaryMessageCount = 0;
  targetFriend_12.memory.recallPresentation = null;
  if (targetFriend_12.pendingRegenerateContext) delete targetFriend_12.pendingRegenerateContext;
  window.imApp.syncFriendMessageSummary(targetFriend_12);
  window.imApp.clearFriendRuntimeMessageContext(targetFriend_12);
  window.imApp.syncActiveFriendReference(targetFriend_12);
  window.imApp.syncSettingsFriendReference(targetFriend_12);
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage?.replaceFriendMessages || !window.imStorage?.saveFriendMeta) throw new Error("Friend message reset persistence unavailable");
    await window.imApp.runFriendPersistenceTask(string_1058, async () => {
      return await window.imStorage.replaceFriendMessages(string_1058, []), await window.imStorage.saveFriendMeta(targetFriend_12), true;
    });
    window.imApp.saveState.lastError = null;
    filter_1061.length > 0 && window.imChat?.purgeRegenerateRunSnapshots && window.imChat.purgeRegenerateRunSnapshots(string_1058, filter_1061);
    if (window.imApp.updateChatsUnreadBadges) window.imApp.updateChatsUnreadBadges();
    return true;
  } catch (lastError_8) {
    return console.error("Failed to reset friend messages", lastError_8), Object.keys(targetFriend_12).forEach(key_8 => delete targetFriend_12[key_8]), Object.assign(targetFriend_12, previousFriend_2), window.imApp.reindexFriendMessages(targetFriend_12), window.imApp.syncFriendMessageSummary(targetFriend_12), window.imApp.syncActiveFriendReference(targetFriend_12), window.imApp.syncSettingsFriendReference(targetFriend_12), window.imApp.saveState.lastError = lastError_8, !value_1057.silent && window.showToast && window.showToast("聊天记录清空失败"), false;
  }
};
window.imApp.buildFriendMetaPatch = function (previousFriend_3, nextFriend) {
  if (!nextFriend || typeof nextFriend !== "object") return {};
  if (!previousFriend_3 || typeof previousFriend_3 !== "object") {
    const cloneDataSnapshot_1070 = window.imApp.cloneDataSnapshot(nextFriend);
    return delete cloneDataSnapshot_1070.messages, cloneDataSnapshot_1070;
  }
  const patch = {};
  return Object.keys(nextFriend).forEach(key_9 => {
    if (key_9 === "messages") return;
    const previousValue = previousFriend_3[key_9],
      nextValue = nextFriend[key_9];
    let changed_2 = previousValue !== nextValue;
    if (previousValue && nextValue && typeof previousValue === "object" && typeof nextValue === "object") try {
      changed_2 = JSON.stringify(previousValue) !== JSON.stringify(nextValue);
    } catch (value_1075) {
      changed_2 = true;
    }
    if (changed_2) patch[key_9] = window.imApp.cloneDataSnapshot(nextValue);
  }), patch;
};
window.imApp.resetFriendConversation = async function (value_1076, value_1077 = {}) {
  const safeFriendId_6 = String(value_1076),
    targetFriend_13 = (window.imData.friends || []).find(value_1082 => String(value_1082.id) === safeFriendId_6);
  if (!targetFriend_13) return false;
  window.imApp.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(targetFriend_13));
  const previousFriend_4 = window.imApp.cloneDataSnapshot(targetFriend_13),
    result_1081 = window.imApp.saveState.friendTimers.get(safeFriendId_6);
  if (result_1081) clearTimeout(result_1081);
  window.imApp.saveState.friendTimers["delete"](safeFriendId_6);
  window.imApp.saveState.friendDirtyIds["delete"](safeFriendId_6);
  window.imChat?.invalidateFriendConversation && window.imChat.invalidateFriendConversation(safeFriendId_6);
  targetFriend_13.messages = [];
  targetFriend_13.unreadCount = 0;
  targetFriend_13.memory = window.imApp.createClearedConversationMemory(targetFriend_13.memory || {});
  targetFriend_13.profilePanel = window.imApp.createDefaultProfilePanel({});
  targetFriend_13.latestThought = "";
  targetFriend_13.status = "online";
  if (targetFriend_13.type === "group") targetFriend_13.memberProfiles = {};
  if (targetFriend_13.pendingRegenerateContext) delete targetFriend_13.pendingRegenerateContext;
  window.imApp.syncFriendMessageSummary(targetFriend_13);
  window.imApp.clearFriendRuntimeMessageContext(targetFriend_13);
  window.imApp.syncActiveFriendReference(targetFriend_13);
  window.imApp.syncSettingsFriendReference(targetFriend_13);
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage?.replaceFriendMessages || !window.imStorage?.saveFriendMeta) throw new Error("Friend conversation reset persistence unavailable");
    await window.imApp.runFriendPersistenceTask(safeFriendId_6, async () => {
      return await window.imStorage.replaceFriendMessages(safeFriendId_6, []), await window.imStorage.saveFriendMeta(targetFriend_13), true;
    });
    window.imApp.saveState.lastError = null;
    if (window.imApp.updateChatsUnreadBadges) window.imApp.updateChatsUnreadBadges();
    return true;
  } catch (lastError_9) {
    console.error("Failed to reset friend conversation", lastError_9);
    Object.keys(targetFriend_13).forEach(key_10 => delete targetFriend_13[key_10]);
    Object.assign(targetFriend_13, previousFriend_4);
    window.imApp.reindexFriendMessages(targetFriend_13);
    window.imApp.syncFriendMessageSummary(targetFriend_13);
    window.imApp.syncActiveFriendReference(targetFriend_13);
    window.imApp.syncSettingsFriendReference(targetFriend_13);
    window.imApp.saveState.lastError = lastError_9;
    try {
      window.imStorage?.replaceFriendMessages && window.imStorage?.saveFriendMeta && (await window.imApp.runFriendPersistenceTask(safeFriendId_6, async () => {
        return await window.imStorage.replaceFriendMessages(safeFriendId_6, previousFriend_4.messages || []), await window.imStorage.saveFriendMeta(previousFriend_4), true;
      }));
    } catch (rollbackError) {
      console.error("Failed to roll back friend conversation reset", rollbackError);
    }
    return !value_1077.silent && window.showToast && window.showToast("聊天记录与上下文清空失败"), false;
  }
};
window.imApp.persistMomentMessagesData = async function (value_1086 = {}) {
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage || !window.imStorage.saveMomentMessages) throw new Error("imStorage.saveMomentMessages unavailable");
    return await window.imStorage.saveMomentMessages(window.imApp.cloneDataSnapshot(Array.isArray(window.imData.momentMessages) ? window.imData.momentMessages : [])), window.imApp.saveState.lastError = null, true;
  } catch (lastError_10) {
    return console.error("Failed to persist moment message data", lastError_10), window.imApp.saveState.lastError = lastError_10, !value_1086.silent && window.showToast && window.showToast("朋友圈通知保存失败"), false;
  }
};
window.imApp.persistStickersData = async function (value_1088 = {}) {
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage || !window.imStorage.saveStickers) throw new Error("imStorage.saveStickers unavailable");
    return await window.imStorage.saveStickers(window.imApp.cloneDataSnapshot(Array.isArray(window.imData.stickers) ? window.imData.stickers : [])), window.imApp.saveState.lastError = null, true;
  } catch (lastError_11) {
    return console.error("Failed to persist sticker data", lastError_11), window.imApp.saveState.lastError = lastError_11, !value_1088.silent && window.showToast && window.showToast("表情包保存失败"), false;
  }
};
window.imApp.persistMomentsCoverData = async function (value_1090 = {}) {
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage || !window.imStorage.saveMomentsCover) throw new Error("imStorage.saveMomentsCover unavailable");
    return await window.imStorage.saveMomentsCover(window.imData.momentsCoverUrl || null), window.imApp.saveState.lastError = null, true;
  } catch (lastError_12) {
    return console.error("Failed to persist moments cover data", lastError_12), window.imApp.saveState.lastError = lastError_12, !value_1090.silent && window.showToast && window.showToast("朋友圈封面保存失败"), false;
  }
};
window.imApp.flushFriendSave = async function (value_1092, options_15 = {}) {
  const safeFriendId_7 = String(value_1092),
    timerRecord = window.imApp.saveState.friendTimers.get(safeFriendId_7);
  timerRecord && (clearTimeout(timerRecord.timer || timerRecord), window.imApp.saveState.friendTimers["delete"](safeFriendId_7));
  const value_1096 = window.imApp.saveState.friendFlushChains.get(safeFriendId_7) || Promise.resolve(),
    then_1097 = value_1096["catch"](() => false).then(async () => {
      const value_1098 = window.imApp.saveState.friendRevisions.get(safeFriendId_7) || 0,
        timerOptions_2 = timerRecord && typeof timerRecord === "object" ? timerRecord.options || {} : {},
        persistOptions = {
          ...timerOptions_2,
          ...options_15
        },
        saved_2 = await window.imApp.persistFriendData(safeFriendId_7, persistOptions);
      if (saved_2) {
        const value_1102 = window.imApp.saveState.friendRevisions.get(safeFriendId_7) || 0;
        value_1102 === value_1098 && (window.imApp.saveState.friendDirtyIds["delete"](safeFriendId_7), window.imApp.saveState.pendingFriendPatches["delete"](safeFriendId_7));
      }
      return window.imApp.saveState.dirty = window.imApp.saveState.friendDirtyIds.size > 0 || window.imApp.saveState.momentDirtyIds.size > 0 || window.imApp.saveState.momentMessagesDirty || window.imApp.saveState.stickersDirty || window.imApp.saveState.momentsCoverDirty, saved_2;
    });
  window.imApp.saveState.friendFlushChains.set(safeFriendId_7, then_1097);
  try {
    return await then_1097;
  } finally {
    window.imApp.saveState.friendFlushChains.get(safeFriendId_7) === then_1097 && window.imApp.saveState.friendFlushChains["delete"](safeFriendId_7);
  }
};
window.imApp.scheduleFriendSave = function (value_1103, options_16 = {}) {
  if (value_1103 == null) return false;
  const safeFriendId = String(value_1103),
    delay_2 = Number.isFinite(Number(options_16.delay)) ? Number(options_16.delay) : 500;
  window.imApp.markFriendDirty(safeFriendId);
  const result_1106 = window.imApp.saveState.friendTimers.get(safeFriendId);
  result_1106 && clearTimeout(result_1106.timer || result_1106);
  const timerOptions = {
      silent: options_16.silent !== false,
      metaOnly: options_16.metaOnly === true,
      includeMessages: options_16.includeMessages
    },
    timer_2 = setTimeout(() => {
      window.imApp.flushFriendSave(safeFriendId, timerOptions);
    }, Math.max(0, delay_2));
  return window.imApp.saveState.friendTimers.set(safeFriendId, {
    timer: timer_2,
    options: timerOptions
  }), true;
};
window.imApp.flushMomentSave = async function (value_1108, options_17 = {}) {
  const safeMomentId_3 = String(value_1108),
    result_1111 = window.imApp.saveState.momentTimers.get(safeMomentId_3);
  result_1111 && (clearTimeout(result_1111), window.imApp.saveState.momentTimers["delete"](safeMomentId_3));
  const previousChain = window.imApp.saveState.momentFlushChains.get(safeMomentId_3) || Promise.resolve(),
    nextChain = previousChain["catch"](() => false).then(async () => {
      const value_1114 = window.imApp.saveState.momentRevisions.get(safeMomentId_3) || 0,
        saved_3 = await window.imApp.persistMomentData(safeMomentId_3, options_17);
      if (saved_3) {
        const value_1116 = window.imApp.saveState.momentRevisions.get(safeMomentId_3) || 0;
        value_1116 === value_1114 && window.imApp.saveState.momentDirtyIds["delete"](safeMomentId_3);
      }
      return window.imApp.saveState.dirty = window.imApp.saveState.friendDirtyIds.size > 0 || window.imApp.saveState.momentDirtyIds.size > 0 || window.imApp.saveState.momentMessagesDirty || window.imApp.saveState.stickersDirty || window.imApp.saveState.momentsCoverDirty, saved_3;
    });
  window.imApp.saveState.momentFlushChains.set(safeMomentId_3, nextChain);
  try {
    return await nextChain;
  } finally {
    window.imApp.saveState.momentFlushChains.get(safeMomentId_3) === nextChain && window.imApp.saveState.momentFlushChains["delete"](safeMomentId_3);
  }
};
window.imApp.scheduleMomentSave = function (value_1117, options_18 = {}) {
  if (value_1117 == null) return false;
  const safeMomentId = String(value_1117),
    delay_3 = Number.isFinite(Number(options_18.delay)) ? Number(options_18.delay) : 500;
  window.imApp.markMomentDirty(safeMomentId);
  const result_1120 = window.imApp.saveState.momentTimers.get(safeMomentId);
  result_1120 && clearTimeout(result_1120);
  const timer_3 = setTimeout(() => {
    window.imApp.flushMomentSave(safeMomentId, {
      silent: options_18.silent !== false
    });
  }, Math.max(0, delay_3));
  return window.imApp.saveState.momentTimers.set(safeMomentId, timer_3), true;
};
window.imApp.flushMomentMessagesSave = async function (options_19 = {}) {
  const saved_4 = await window.imApp.persistMomentMessagesData(options_19);
  return saved_4 && (window.imApp.saveState.momentMessagesDirty = false), window.imApp.saveState.dirty = window.imApp.saveState.friendDirtyIds.size > 0 || window.imApp.saveState.momentDirtyIds.size > 0 || window.imApp.saveState.momentMessagesDirty || window.imApp.saveState.stickersDirty || window.imApp.saveState.momentsCoverDirty, saved_4;
};
window.imApp.flushStickersSave = async function (options_20 = {}) {
  const saved_5 = await window.imApp.persistStickersData(options_20);
  return saved_5 && (window.imApp.saveState.stickersDirty = false), window.imApp.saveState.dirty = window.imApp.saveState.friendDirtyIds.size > 0 || window.imApp.saveState.momentDirtyIds.size > 0 || window.imApp.saveState.momentMessagesDirty || window.imApp.saveState.stickersDirty || window.imApp.saveState.momentsCoverDirty, saved_5;
};
window.imApp.flushMomentsCoverSave = async function (options_21 = {}) {
  const saved_6 = await window.imApp.persistMomentsCoverData(options_21);
  return saved_6 && (window.imApp.saveState.momentsCoverDirty = false), window.imApp.saveState.dirty = window.imApp.saveState.friendDirtyIds.size > 0 || window.imApp.saveState.momentDirtyIds.size > 0 || window.imApp.saveState.momentMessagesDirty || window.imApp.saveState.stickersDirty || window.imApp.saveState.momentsCoverDirty, saved_6;
};
window.imApp.flushGlobalSave = async function (options_22 = {}) {
  window.imApp.saveState.timer && (clearTimeout(window.imApp.saveState.timer), window.imApp.saveState.timer = null);
  if (window.imApp.saveState.isSaving) return window.imApp.saveState.hasPendingSave = true, true;
  window.imApp.saveState.isSaving = true;
  try {
    do {
      window.imApp.saveState.hasPendingSave = false;
      const dirtyFriendIds = Array.from(window.imApp.saveState.friendDirtyIds),
        dirtyMomentIds = Array.from(window.imApp.saveState.momentDirtyIds);
      for (const friendId_5 of dirtyFriendIds) {
        const saved_7 = await window.imApp.flushFriendSave(friendId_5, options_22);
        if (!saved_7) return false;
      }
      for (const momentId_3 of dirtyMomentIds) {
        const saved_8 = await window.imApp.flushMomentSave(momentId_3, options_22);
        if (!saved_8) return false;
      }
      if (window.imApp.saveState.momentMessagesDirty) {
        const saved_9 = await window.imApp.flushMomentMessagesSave(options_22);
        if (!saved_9) return false;
      }
      if (window.imApp.saveState.stickersDirty) {
        const saved_10 = await window.imApp.flushStickersSave(options_22);
        if (!saved_10) return false;
      }
      if (window.imApp.saveState.momentsCoverDirty) {
        const saved_11 = await window.imApp.flushMomentsCoverSave(options_22);
        if (!saved_11) return false;
      }
      window.imApp.saveState.dirty = window.imApp.saveState.friendDirtyIds.size > 0 || window.imApp.saveState.momentDirtyIds.size > 0 || window.imApp.saveState.momentMessagesDirty || window.imApp.saveState.stickersDirty || window.imApp.saveState.momentsCoverDirty;
    } while (window.imApp.saveState.hasPendingSave);
    return true;
  } finally {
    window.imApp.saveState.isSaving = false;
  }
};
window.imApp.scheduleGlobalSave = function (options_23 = {}) {
  const delay_4 = Number.isFinite(Number(options_23.delay)) ? Number(options_23.delay) : window.imApp.saveState.delay;
  return window.imApp.saveState.dirty = true, window.imApp.saveState.timer && clearTimeout(window.imApp.saveState.timer), window.imApp.saveState.timer = setTimeout(() => {
    window.imApp.flushGlobalSave({
      silent: options_23.silent !== false
    });
  }, Math.max(0, delay_4)), true;
};
window.imApp.commitGlobalChange = async function (value_1140, options_24 = {}) {
  const persistedData_1142 = window.imApp.buildPersistedData();
  try {
    typeof value_1140 === "function" && (await value_1140());
    if (options_24.immediate === false) return window.imApp.scheduleGlobalSave({
      delay: options_24.delay,
      silent: options_24.silent !== false
    }), typeof options_24.onSuccess === "function" && options_24.onSuccess(window.imData), true;
    const saved_12 = await window.imApp.flushGlobalSave({
      silent: !!options_24.silent
    });
    if (!saved_12) return window.imData.friends = persistedData_1142.friends, window.imData.moments = persistedData_1142.moments, window.imData.momentMessages = persistedData_1142.momentMessages, window.imData.stickers = persistedData_1142.stickers, window.imData.momentsCoverUrl = persistedData_1142.momentsCoverUrl, typeof options_24.onRollback === "function" && options_24.onRollback(window.imData), false;
    return typeof options_24.onSuccess === "function" && options_24.onSuccess(window.imData), true;
  } catch (e_3) {
    return console.error("Failed to commit global change", e_3), window.imData.friends = persistedData_1142.friends, window.imData.moments = persistedData_1142.moments, window.imData.momentMessages = persistedData_1142.momentMessages, window.imData.stickers = persistedData_1142.stickers, window.imData.momentsCoverUrl = persistedData_1142.momentsCoverUrl, typeof options_24.onRollback === "function" && options_24.onRollback(window.imData), !options_24.silent && window.showToast && window.showToast("保存失败，已撤销本次修改"), false;
  }
};
window.imApp.commitFriendChange = async function (friendId_6, value_1146, options_25 = {}) {
  let friends_3 = Array.isArray(window.imData.friends) ? window.imData.friends : [],
    index_1149 = friends_3.findIndex(value_1152 => String(value_1152.id) === String(friendId_6));
  const value_1150 = index_1149 > -1 ? friends_3[index_1149] : null;
  value_1150 && value_1150.messagesLoaded === false && options_25.metaOnly !== true && window.imApp.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(value_1150), friends_3 = Array.isArray(window.imData.friends) ? window.imData.friends : [], index_1149 = friends_3.findIndex(value_1153 => String(value_1153.id) === String(friendId_6)));
  let previousFriend_5 = null;
  if (index_1149 > -1) {
    if (options_25.metaOnly === true) {
      const {
        messages: messages_9,
        ...value_1155
      } = friends_3[index_1149];
      previousFriend_5 = window.imApp.cloneDataSnapshot(value_1155);
      Object.prototype.hasOwnProperty.call(friends_3[index_1149], "messages") && (previousFriend_5.messages = messages_9);
    } else previousFriend_5 = window.imApp.cloneDataSnapshot(friends_3[index_1149]);
  }
  try {
    const targetFriend_14 = index_1149 > -1 ? friends_3[index_1149] : null;
    typeof value_1146 === "function" && (await value_1146(targetFriend_14, friends_3, index_1149));
    if (options_25.metaOnly === true && targetFriend_14) {
      const safeFriendId_8 = String(friendId_6),
        nextPatch = window.imApp.buildFriendMetaPatch(previousFriend_5, targetFriend_14),
        existingPatch = window.imApp.saveState.pendingFriendPatches.get(safeFriendId_8) || {};
      window.imApp.saveState.pendingFriendPatches.set(safeFriendId_8, {
        ...existingPatch,
        ...nextPatch
      });
    }
    window.imApp.markFriendDirty(friendId_6);
    if (options_25.immediate === false) return window.imApp.scheduleFriendSave(friendId_6, {
      delay: options_25.delay,
      silent: options_25.silent !== false,
      metaOnly: options_25.metaOnly === true,
      includeMessages: options_25.includeMessages
    }), typeof options_25.onSuccess === "function" && options_25.onSuccess(window.imData.friends), true;
    const saved_13 = await window.imApp.flushFriendSave(friendId_6, {
      silent: !!options_25.silent,
      metaOnly: options_25.metaOnly === true,
      includeMessages: options_25.includeMessages
    });
    if (!saved_13) return index_1149 > -1 && (previousFriend_5 ? window.imData.friends[index_1149] = previousFriend_5 : window.imData.friends.splice(index_1149, 1)), typeof options_25.onRollback === "function" && options_25.onRollback(window.imData.friends), false;
    return typeof options_25.onSuccess === "function" && options_25.onSuccess(window.imData.friends), true;
  } catch (e_4) {
    return console.error("Failed to commit friend change", e_4), index_1149 > -1 && (previousFriend_5 ? window.imData.friends[index_1149] = previousFriend_5 : window.imData.friends.splice(index_1149, 1)), typeof options_25.onRollback === "function" && options_25.onRollback(window.imData.friends), !options_25.silent && window.showToast && window.showToast("保存失败，已撤销本次修改"), false;
  }
};
window.imApp.commitFriendsChange = async function (value_1161, options_26 = {}) {
  window.imApp.ensureDataReady && !window.imData.ready && (await window.imApp.ensureDataReady());
  const friends_4 = window.imApp.cloneDataSnapshot(Array.isArray(window.imData.friends) ? window.imData.friends : []);
  try {
    typeof value_1161 === "function" && (await value_1161());
    const currentFriendIds = (window.imData.friends || []).map(friend_23 => String(friend_23.id)),
      deletedFriendIds_2 = Array.isArray(options_26.deletedFriendIds) ? options_26.deletedFriendIds.map(String) : friends_4.map(friend_24 => String(friend_24.id)).filter(friendId_7 => !currentFriendIds.includes(friendId_7)),
      friendIds_2 = Array.isArray(options_26.friendIds) ? Array.from(new Set([...options_26.friendIds.map(String), ...deletedFriendIds_2])) : options_26.friendId != null ? Array.from(new Set([String(options_26.friendId), ...deletedFriendIds_2])) : Array.from(new Set([...currentFriendIds, ...deletedFriendIds_2]));
    friendIds_2.forEach(friendId_8 => window.imApp.markFriendDirty(friendId_8));
    if (options_26.immediate === false) return friendIds_2.length === 1 ? window.imApp.scheduleFriendSave(friendIds_2[0], {
      delay: options_26.delay,
      silent: options_26.silent !== false,
      metaOnly: options_26.metaOnly === true,
      includeMessages: options_26.includeMessages
    }) : window.imApp.scheduleGlobalSave({
      delay: options_26.delay,
      silent: options_26.silent !== false
    }), typeof options_26.onSuccess === "function" && options_26.onSuccess(window.imData.friends), true;
    const saved_14 = friendIds_2.length === 1 ? await window.imApp.flushFriendSave(friendIds_2[0], {
      silent: !!options_26.silent,
      metaOnly: options_26.metaOnly === true,
      includeMessages: options_26.includeMessages
    }) : await window.imApp.flushGlobalSave({
      silent: !!options_26.silent
    });
    if (!saved_14) return window.imData.friends = friends_4, typeof options_26.onRollback === "function" && options_26.onRollback(window.imData.friends), false;
    return typeof options_26.onSuccess === "function" && options_26.onSuccess(window.imData.friends), deletedFriendIds_2.forEach(friendId_9 => {
      window.dispatchEvent(new CustomEvent("u2:friend-removed", {
        detail: {
          friendId: friendId_9
        }
      }));
    }), true;
  } catch (e_5) {
    return console.error("Failed to commit friends change", e_5), window.imData.friends = friends_4, typeof options_26.onRollback === "function" && options_26.onRollback(window.imData.friends), !options_26.silent && window.showToast && window.showToast("保存失败，已撤销本次修改"), false;
  }
};
window.imApp.commitMomentChange = async function (momentId_4, value_1174, options_27 = {}) {
  const moments_2 = Array.isArray(window.imData.moments) ? window.imData.moments : [],
    index_1177 = moments_2.findIndex(value_1179 => String(value_1179.id) === String(momentId_4)),
    value_1178 = index_1177 > -1 ? window.imApp.cloneDataSnapshot(moments_2[index_1177]) : null;
  try {
    const value_1180 = index_1177 > -1 ? moments_2[index_1177] : null;
    typeof value_1174 === "function" && (await value_1174(value_1180, moments_2, index_1177));
    window.imApp.markMomentDirty(momentId_4);
    if (options_27.immediate === false) return window.imApp.scheduleMomentSave(momentId_4, {
      delay: options_27.delay,
      silent: options_27.silent !== false
    }), typeof options_27.onSuccess === "function" && options_27.onSuccess(window.imData.moments), true;
    const saved_15 = await window.imApp.flushMomentSave(momentId_4, {
      silent: !!options_27.silent
    });
    if (!saved_15) return index_1177 > -1 && (value_1178 ? window.imData.moments[index_1177] = value_1178 : window.imData.moments.splice(index_1177, 1)), typeof options_27.onRollback === "function" && options_27.onRollback(window.imData.moments), false;
    return typeof options_27.onSuccess === "function" && options_27.onSuccess(window.imData.moments), true;
  } catch (e_6) {
    return console.error("Failed to commit moment change", e_6), index_1177 > -1 && (value_1178 ? window.imData.moments[index_1177] = value_1178 : window.imData.moments.splice(index_1177, 1)), typeof options_27.onRollback === "function" && options_27.onRollback(window.imData.moments), !options_27.silent && window.showToast && window.showToast("朋友圈保存失败，已撤销本次修改"), false;
  }
};
window.imApp.deleteMomentPermanently = async function (momentId_5, options_28 = {}) {
  if (momentId_5 == null) return false;
  const safeMomentId_4 = String(momentId_5);
  let moments_3 = [],
    momentMessages_2 = [];
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (window.imApp.ensureMomentsReady) await window.imApp.ensureMomentsReady();
    if (window.imApp.ensureMomentMessagesReady) await window.imApp.ensureMomentMessagesReady();
    moments_3 = window.imApp.cloneDataSnapshot(Array.isArray(window.imData.moments) ? window.imData.moments : []);
    momentMessages_2 = window.imApp.cloneDataSnapshot(Array.isArray(window.imData.momentMessages) ? window.imData.momentMessages : []);
    const result_1188 = window.imApp.saveState.momentTimers.get(safeMomentId_4);
    result_1188 && (clearTimeout(result_1188), window.imApp.saveState.momentTimers["delete"](safeMomentId_4));
    const pendingFlush = window.imApp.saveState.momentFlushChains.get(safeMomentId_4);
    pendingFlush && (await pendingFlush["catch"](() => false));
    window.imData.moments = (Array.isArray(window.imData.moments) ? window.imData.moments : []).filter(moment_3 => String(moment_3?.id) !== safeMomentId_4);
    window.imData.momentMessages = (Array.isArray(window.imData.momentMessages) ? window.imData.momentMessages : []).filter(msg => String(msg?.momentId) !== safeMomentId_4);
    window.imApp.saveState.momentDirtyIds["delete"](safeMomentId_4);
    window.imApp.saveState.momentRevisions["delete"](safeMomentId_4);
    window.imApp.saveState.momentFlushChains["delete"](safeMomentId_4);
    if (window.imStorage?.deleteMoment) {
      const deleted = await window.imStorage.deleteMoment(momentId_5);
      if (deleted === false) throw new Error("deleteMoment failed");
    }
    if (window.imStorage?.saveMoments) {
      const savedMoments = await window.imStorage.saveMoments(window.imData.moments);
      if (savedMoments === false) throw new Error("saveMoments failed");
    } else {
      if (window.imApp.saveMoments) {
        const saved_16 = await window.imApp.saveMoments({
          silent: options_28.silent !== false
        });
        if (!saved_16) throw new Error("saveMoments failed");
      }
    }
    if (window.imStorage?.saveMomentMessages) {
      const savedMessages = await window.imStorage.saveMomentMessages(window.imData.momentMessages);
      if (savedMessages === false) throw new Error("saveMomentMessages failed");
      window.imApp.saveState.momentMessagesDirty = false;
    } else {
      if (window.imApp.saveMomentMessages) {
        const saved_17 = await window.imApp.saveMomentMessages({
          silent: options_28.silent !== false
        });
        if (!saved_17) throw new Error("saveMomentMessages failed");
      }
    }
    return window.imApp.saveState.lastError = null, window.imApp.saveState.dirty = window.imApp.saveState.friendDirtyIds.size > 0 || window.imApp.saveState.momentDirtyIds.size > 0 || window.imApp.saveState.momentMessagesDirty || window.imApp.saveState.stickersDirty || window.imApp.saveState.momentsCoverDirty, true;
  } catch (lastError_13) {
    console.error("Failed to permanently delete moment", lastError_13);
    window.imData.moments = moments_3;
    window.imData.momentMessages = momentMessages_2;
    window.imApp.saveState.lastError = lastError_13;
    try {
      window.imStorage?.saveMoments && (await window.imStorage.saveMoments(moments_3));
      window.imStorage?.saveMomentMessages && (await window.imStorage.saveMomentMessages(momentMessages_2));
    } catch (restoreError) {
      console.error("Failed to restore moment deletion rollback", restoreError);
    }
    return !options_28.silent && window.showToast && window.showToast("朋友圈删除失败，已恢复"), false;
  }
};
window.imApp.saveFriends = async function (options_29 = {}) {
  return window.imApp.flushGlobalSave(options_29);
};
window.imApp.saveMoments = async function (options_30 = {}) {
  return window.imApp.flushGlobalSave(options_30);
};
window.imApp.saveMomentMessages = async function (options_31 = {}) {
  window.imApp.markMomentMessagesDirty();
  if (options_31.immediate === false) return window.imApp.scheduleGlobalSave({
    delay: options_31.delay,
    silent: options_31.silent !== false
  }), true;
  return window.imApp.flushMomentMessagesSave(options_31);
};
window.imApp.saveStickers = async function (options_32 = {}) {
  window.imApp.markStickersDirty();
  if (options_32.immediate === false) return window.imApp.scheduleGlobalSave({
    delay: options_32.delay,
    silent: options_32.silent !== false
  }), true;
  return window.imApp.flushStickersSave(options_32);
};
window.imApp.commitStickersChange = async function (mutator, options_33 = {}) {
  const stickers_2 = window.imApp.cloneDataSnapshot(Array.isArray(window.imData.stickers) ? window.imData.stickers : []);
  try {
    typeof mutator === "function" && (await mutator(window.imData.stickers));
    window.imApp.markStickersDirty();
    if (options_33.immediate === false) return window.imApp.scheduleGlobalSave({
      delay: options_33.delay,
      silent: options_33.silent !== false
    }), typeof options_33.onSuccess === "function" && options_33.onSuccess(window.imData.stickers), window.dispatchEvent(new CustomEvent("u2:stickers-data-changed", {
      detail: {
        stickers: window.imData.stickers
      }
    })), true;
    const saved_18 = await window.imApp.flushStickersSave({
      silent: !!options_33.silent
    });
    if (!saved_18) return window.imData.stickers = stickers_2, typeof options_33.onRollback === "function" && options_33.onRollback(window.imData.stickers), false;
    return typeof options_33.onSuccess === "function" && options_33.onSuccess(window.imData.stickers), window.dispatchEvent(new CustomEvent("u2:stickers-data-changed", {
      detail: {
        stickers: window.imData.stickers
      }
    })), true;
  } catch (e_7) {
    return console.error("Failed to commit stickers change", e_7), window.imData.stickers = stickers_2, typeof options_33.onRollback === "function" && options_33.onRollback(window.imData.stickers), !options_33.silent && window.showToast && window.showToast("表情包保存失败，已撤销本次修改"), false;
  }
};
window.imApp.saveMomentsCover = async function (value_1208, value_1209 = {}) {
  window.imData.momentsCoverUrl = value_1208 || null;
  window.imApp.markMomentsCoverDirty();
  if (value_1209.immediate === false) return window.imApp.scheduleGlobalSave({
    delay: value_1209.delay,
    silent: value_1209.silent !== false
  }), window.imData.momentsCoverUrl;
  const saved_19 = await window.imApp.flushMomentsCoverSave(value_1209);
  return saved_19 ? window.imData.momentsCoverUrl : null;
};
window.imApp.getStorageUsage = async function () {
  try {
    if (!window.imStorage || !window.imStorage.measureApproximateUsage) return 0;
    return await window.imStorage.measureApproximateUsage();
  } catch (e_8) {
    return console.error("Failed to measure iMessage storage usage", e_8), 0;
  }
};
window.imApp.clearRuntimeCache = function () {
  try {
    return window.imStorage?.clearRuntimeAssetCache && window.imStorage.clearRuntimeAssetCache(), window.imStorage?.pruneRuntimeAssetCache && window.imStorage.pruneRuntimeAssetCache(0), true;
  } catch (e_9) {
    return console.error("Failed to clear iMessage runtime cache", e_9), false;
  }
};
window.getGlobalWorldBookContextByPosition = function (position_2 = "before_role", contextText_2 = "", value_1215 = {}) {
  const normalizeEntry = window.normalizeWorldBookEntry ? window.normalizeWorldBookEntry : function (entry_10 = {}) {
      return {
        title: entry_10.title || entry_10.name || entry_10.keyword || "未命名词条",
        keyword: entry_10.keyword || "",
        content: entry_10.content || "",
        triggerMode: entry_10.triggerMode === "keyword" ? "keyword" : "permanent",
        injectionPosition: ["before_role", "after_role", "system_depth"].includes(entry_10.injectionPosition) ? entry_10.injectionPosition : "before_role",
        systemDepth: Number.isFinite(Number(entry_10.systemDepth)) ? Number(entry_10.systemDepth) : 4,
        order: Number.isFinite(Number(entry_10.order)) ? Number(entry_10.order) : 100,
        recursive: false,
        enabled: entry_10.enabled !== false
      };
    },
    keywordMatched = window.worldBookKeywordMatched ? window.worldBookKeywordMatched : function (value_1223, value_1224 = "") {
      if (!value_1223 || value_1223.triggerMode !== "keyword") return true;
      const value_1225 = value_1223.keyword ? String(value_1223.keyword).trim() : "";
      if (!value_1225) return false;
      return String(value_1224 || "").includes(value_1225);
    },
    value_1218 = window.formatWorldBookEntryForPrompt ? window.formatWorldBookEntryForPrompt : function (message_1226) {
      const value_1227 = message_1226.title ? String(message_1226.title).trim() : "未命名词条",
        value_1228 = message_1226.keyword ? String(message_1226.keyword).trim() : "",
        value_1229 = message_1226.content ? String(message_1226.content).trim() : "",
        value_1230 = message_1226.triggerMode === "keyword" ? "关键词" : "永久";
      let text_1231 = "角色前";
      if (message_1226.injectionPosition === "after_role") text_1231 = "角色后";
      if (message_1226.injectionPosition === "system_depth") text_1231 = "系统深度";
      let value_1232 = "【" + value_1227 + "】\n";
      return value_1232 += "触发机制: " + value_1230 + "\n", value_1232 += "注入位置: " + text_1231 + "\n", message_1226.injectionPosition === "system_depth" && (value_1232 += "深度: " + message_1226.systemDepth + "\n", value_1232 += "顺序: " + message_1226.order + "\n"), message_1226.triggerMode === "keyword" && value_1228 && (value_1232 += "关键词: " + value_1228 + "\n"), value_1229 && (value_1232 += "内容:\n" + value_1229 + "\n"), value_1232.trim();
    },
    titleMap = {
      before_role: "World Book / 角色前",
      after_role: "World Book / 角色后",
      system_depth: "World Book / 系统深度"
    },
    positionEntries = [];
  if (window.getWorldBooks) {
    const allBooks = window.getWorldBooks();
    if (Array.isArray(allBooks) && allBooks.length > 0) {
      const globalBooks = allBooks.filter(book => book && book.isGlobal && Array.isArray(book.entries) && book.entries.length > 0);
      globalBooks.forEach(book_2 => {
        book_2.entries.map(entry_11 => normalizeEntry(entry_11)).filter(entry_12 => entry_12 && entry_12.enabled !== false).filter(entry_13 => entry_13.injectionPosition === position_2).filter(entry_14 => keywordMatched(entry_14, contextText_2)).forEach(entry_15 => {
          positionEntries.push({
            ...entry_15,
            __bookName: book_2.name || "未命名世界书"
          });
        });
      });
    }
  }
  const items_1221 = [];
  if (positionEntries.length > 0) {
    positionEntries.sort((value_1241, value_1242) => {
      if (position_2 === "system_depth") {
        if (value_1241.systemDepth !== value_1242.systemDepth) return value_1241.systemDepth - value_1242.systemDepth;
        return value_1241.order - value_1242.order;
      }
      return value_1241.order - value_1242.order;
    });
    let value_1240 = titleMap[position_2] + ":\n";
    positionEntries.forEach(value_1243 => {
      value_1240 += "〔" + value_1243.__bookName + "〕\n" + value_1218(value_1243) + "\n\n";
    });
    items_1221.push(value_1240.trim());
  }
  if (value_1215.includeBuiltin !== false && window.getBuiltinWorldBookContext) {
    const builtinSection = window.getBuiltinWorldBookContext(position_2, contextText_2);
    builtinSection && items_1221.push(builtinSection.trim());
  }
  return items_1221.join("\n\n").trim();
};
window.getGlobalWorldBookContext = function (contextText = "") {
  const positions = ["system_depth", "before_role", "after_role"],
    sections = positions.map(position_3 => window.getGlobalWorldBookContextByPosition(position_3, contextText)).filter(Boolean);
  return sections.join("\n\n").trim();
};
window.imApp.getWorldBookContextForFriendByPosition = function (value_1247 = "before_role", value_1248 = null, value_1249 = "", value_1250 = {}) {
  const value_1251 = window.normalizeWorldBookEntry ? window.normalizeWorldBookEntry : function (message_1259 = {}) {
      return {
        title: message_1259.title || message_1259.name || message_1259.keyword || "未命名词条",
        keyword: message_1259.keyword || "",
        content: message_1259.content || "",
        triggerMode: message_1259.triggerMode === "keyword" ? "keyword" : "permanent",
        injectionPosition: ["before_role", "after_role", "system_depth"].includes(message_1259.injectionPosition) ? message_1259.injectionPosition : "before_role",
        systemDepth: Number.isFinite(Number(message_1259.systemDepth)) ? Number(message_1259.systemDepth) : 4,
        order: Number.isFinite(Number(message_1259.order)) ? Number(message_1259.order) : 100,
        enabled: message_1259.enabled !== false
      };
    },
    value_1252 = window.worldBookKeywordMatched ? window.worldBookKeywordMatched : function (value_1260, value_1261 = "") {
      if (!value_1260 || value_1260.triggerMode !== "keyword") return true;
      const value_1262 = value_1260.keyword ? String(value_1260.keyword).trim() : "";
      if (!value_1262) return false;
      return String(value_1261 || "").includes(value_1262);
    },
    value_1253 = window.formatWorldBookEntryForPrompt ? window.formatWorldBookEntryForPrompt : function (message_1263) {
      const value_1264 = message_1263.title ? String(message_1263.title).trim() : "未命名词条",
        value_1265 = message_1263.keyword ? String(message_1263.keyword).trim() : "",
        value_1266 = message_1263.content ? String(message_1263.content).trim() : "",
        value_1267 = message_1263.triggerMode === "keyword" ? "关键词" : "永久";
      let text_1268 = "角色前";
      if (message_1263.injectionPosition === "after_role") text_1268 = "角色后";
      if (message_1263.injectionPosition === "system_depth") text_1268 = "系统深度";
      let value_1269 = "【" + value_1264 + "】\n";
      return value_1269 += "触发机制: " + value_1267 + "\n", value_1269 += "注入位置: " + text_1268 + "\n", message_1263.injectionPosition === "system_depth" && (value_1269 += "深度: " + message_1263.systemDepth + "\n", value_1269 += "顺序: " + message_1263.order + "\n"), message_1263.triggerMode === "keyword" && value_1265 && (value_1269 += "关键词: " + value_1265 + "\n"), value_1266 && (value_1269 += "内容:\n" + value_1266 + "\n"), value_1269.trim();
    },
    options_1254 = {
      before_role: "Bound World Book / 绑定角色前",
      after_role: "Bound World Book / 绑定角色后",
      system_depth: "Bound World Book / 绑定系统深度"
    },
    items_1255 = [],
    value_1256 = value_1250.includeGlobal === false ? "" : window.getGlobalWorldBookContextByPosition?.(value_1247, value_1249, value_1250) || "";
  value_1256 && items_1255.push(value_1256.trim());
  const value_1257 = value_1248 ? window.imApp.normalizeFriendData(value_1248) : null,
    value_1258 = value_1257 && Array.isArray(value_1257.boundBooks) ? value_1257.boundBooks.map(value_1270 => String(value_1270)) : [];
  if (value_1258.length > 0 && window.getWorldBooks) {
    const presentedEntries = window.getWorldBooks(),
      items_1272 = [];
    Array.isArray(presentedEntries) && presentedEntries.filter(value_1273 => value_1273 && value_1258.includes(String(value_1273.id)) && Array.isArray(value_1273.entries)).forEach(value_1274 => {
      value_1274.entries.map(value_1275 => value_1251(value_1275)).filter(value_1276 => value_1276 && value_1276.enabled !== false).filter(value_1277 => value_1277.injectionPosition === value_1247).filter(value_1278 => value_1252(value_1278, value_1249)).forEach(value_1279 => {
        items_1272.push({
          ...value_1279,
          __bookName: value_1274.name || "未命名世界书"
        });
      });
    });
    if (items_1272.length > 0) {
      items_1272.sort((value_1281, value_1282) => {
        if (value_1247 === "system_depth") {
          if (value_1281.systemDepth !== value_1282.systemDepth) return value_1281.systemDepth - value_1282.systemDepth;
          return value_1281.order - value_1282.order;
        }
        return value_1281.order - value_1282.order;
      });
      let value_1280 = options_1254[value_1247] + ":\n";
      items_1272.forEach(value_1283 => {
        value_1280 += "〔" + value_1283.__bookName + "〕\n" + value_1253(value_1283) + "\n\n";
      });
      items_1255.push(value_1280.trim());
    }
  }
  return items_1255.join("\n\n").trim();
};
window.getWorldBookContextForFriendByPosition = function (value_1284 = "before_role", value_1285 = null, value_1286 = "", value_1287 = {}) {
  return window.imApp.getWorldBookContextForFriendByPosition(value_1284, value_1285, value_1286, value_1287);
};
window.imApp.commitFriendMetaPatch = async function (value_1288, value_1289, value_1290 = {}) {
  const string_1291 = String(value_1288),
    result_1292 = (window.imData.friends || []).find(value_1295 => String(value_1295.id) === string_1291);
  if (!result_1292 || !value_1289 || typeof value_1289 !== "object") return false;
  const filter_1293 = Object.entries(value_1289).filter(([value_1296]) => value_1296 !== "id" && value_1296 !== "messages");
  if (filter_1293.length === 0) return true;
  const items_1294 = new Map(filter_1293.map(([value_1297]) => [value_1297, {
    present: Object.prototype.hasOwnProperty.call(result_1292, value_1297),
    value: result_1292[value_1297]
  }]));
  filter_1293.forEach(([value_1298, value_1299]) => {
    result_1292[value_1298] = value_1299;
  });
  window.imApp.syncActiveFriendReference(result_1292);
  window.imApp.syncSettingsFriendReference(result_1292);
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage?.patchFriendMeta) throw new Error("Incremental friend metadata persistence unavailable");
    await window.imApp.runFriendPersistenceTask(string_1291, () => window.imStorage.patchFriendMeta(string_1291, value_1289));
    window.imApp.saveState.lastError = null;
    if (typeof value_1290.onSuccess === "function") value_1290.onSuccess(result_1292);
    return true;
  } catch (lastError_14) {
    items_1294.forEach((value_1301, value_1302) => {
      if (result_1292[value_1302] !== value_1289[value_1302]) return;
      if (value_1301.present) result_1292[value_1302] = value_1301.value;else delete result_1292[value_1302];
    });
    window.imApp.syncActiveFriendReference(result_1292);
    window.imApp.syncSettingsFriendReference(result_1292);
    window.imApp.saveState.lastError = lastError_14;
    console.error("Failed to patch friend metadata", lastError_14);
    if (!value_1290.silent && window.showToast) window.showToast("好友数据保存失败");
    if (typeof value_1290.onRollback === "function") value_1290.onRollback(result_1292);
    return false;
  }
};
window.imApp.getWorldBookContextForFriendByPosition = function (value_1303 = "before_role", value_1304 = null, value_1305 = "", value_1306 = {}) {
  const value_1307 = window.normalizeWorldBookEntry ? window.normalizeWorldBookEntry : function (message_1315 = {}) {
      return {
        title: message_1315.title || message_1315.name || message_1315.keyword || "未命名词条",
        keyword: message_1315.keyword || "",
        content: message_1315.content || "",
        triggerMode: message_1315.triggerMode === "keyword" ? "keyword" : "permanent",
        injectionPosition: ["before_role", "after_role", "system_depth"].includes(message_1315.injectionPosition) ? message_1315.injectionPosition : "before_role",
        systemDepth: Number.isFinite(Number(message_1315.systemDepth)) ? Number(message_1315.systemDepth) : 4,
        order: Number.isFinite(Number(message_1315.order)) ? Number(message_1315.order) : 100,
        enabled: message_1315.enabled !== false
      };
    },
    value_1308 = window.worldBookKeywordMatched ? window.worldBookKeywordMatched : function (value_1316, value_1317 = "") {
      if (!value_1316 || value_1316.triggerMode !== "keyword") return true;
      const value_1318 = value_1316.keyword ? String(value_1316.keyword).trim() : "";
      if (!value_1318) return false;
      return String(value_1317 || "").includes(value_1318);
    },
    value_1309 = window.formatWorldBookEntryForPrompt ? window.formatWorldBookEntryForPrompt : function (message_1319) {
      const value_1320 = message_1319.title ? String(message_1319.title).trim() : "未命名词条",
        value_1321 = message_1319.keyword ? String(message_1319.keyword).trim() : "",
        value_1322 = message_1319.content ? String(message_1319.content).trim() : "",
        value_1323 = message_1319.triggerMode === "keyword" ? "关键词" : "永久";
      let text_1324 = "角色前";
      if (message_1319.injectionPosition === "after_role") text_1324 = "角色后";
      if (message_1319.injectionPosition === "system_depth") text_1324 = "系统深度";
      let value_1325 = "【" + value_1320 + "】\n";
      return value_1325 += "触发机制: " + value_1323 + "\n", value_1325 += "注入位置: " + text_1324 + "\n", message_1319.injectionPosition === "system_depth" && (value_1325 += "深度: " + message_1319.systemDepth + "\n", value_1325 += "顺序: " + message_1319.order + "\n"), message_1319.triggerMode === "keyword" && value_1321 && (value_1325 += "关键词: " + value_1321 + "\n"), value_1322 && (value_1325 += "内容:\n" + value_1322 + "\n"), value_1325.trim();
    },
    options_1310 = {
      before_role: "Bound World Book / 绑定角色前",
      after_role: "Bound World Book / 绑定角色后",
      system_depth: "Bound World Book / 绑定系统深度"
    },
    items_1311 = [],
    value_1312 = value_1306.includeGlobal === false ? "" : window.getGlobalWorldBookContextByPosition?.(value_1303, value_1305, value_1306) || "";
  value_1312 && items_1311.push(value_1312.trim());
  const value_1313 = value_1304 ? window.imApp.normalizeFriendData(value_1304) : null,
    value_1314 = value_1313 && Array.isArray(value_1313.boundBooks) ? value_1313.boundBooks.map(value_1326 => String(value_1326)) : [];
  if (value_1314.length > 0 && window.getWorldBooks) {
    const presentedEntries_2 = window.getWorldBooks(),
      items_1328 = [];
    Array.isArray(presentedEntries_2) && presentedEntries_2.filter(value_1329 => value_1329 && value_1314.includes(String(value_1329.id)) && Array.isArray(value_1329.entries)).forEach(value_1330 => {
      value_1330.entries.map(value_1331 => value_1307(value_1331)).filter(value_1332 => value_1332 && value_1332.enabled !== false).filter(value_1333 => value_1333.injectionPosition === value_1303).filter(value_1334 => value_1308(value_1334, value_1305)).forEach(value_1335 => {
        items_1328.push({
          ...value_1335,
          __bookName: value_1330.name || "未命名世界书"
        });
      });
    });
    if (items_1328.length > 0) {
      items_1328.sort((value_1337, value_1338) => {
        if (value_1303 === "system_depth") {
          if (value_1337.systemDepth !== value_1338.systemDepth) return value_1337.systemDepth - value_1338.systemDepth;
          return value_1337.order - value_1338.order;
        }
        return value_1337.order - value_1338.order;
      });
      let value_1336 = options_1310[value_1303] + ":\n";
      items_1328.forEach(value_1339 => {
        value_1336 += "〔" + value_1339.__bookName + "〕\n" + value_1309(value_1339) + "\n\n";
      });
      items_1311.push(value_1336.trim());
    }
  }
  return items_1311.join("\n\n").trim();
};
window.getWorldBookContextForFriendByPosition = function (value_1340 = "before_role", value_1341 = null, value_1342 = "", value_1343 = {}) {
  return window.imApp.getWorldBookContextForFriendByPosition(value_1340, value_1341, value_1342, value_1343);
};
window.getImFriends = () => window.imData.friends;
window.addImFriend = async function (friendData_2) {
  const friend_25 = window.imApp.normalizeFriendData({
      id: Date.now(),
      type: friendData_2.type || "char",
      realName: friendData_2.realName || "",
      nickname: friendData_2.nickname || "New Friend",
      signature: friendData_2.signature || "No Signature",
      persona: friendData_2.persona || "",
      avatarUrl: friendData_2.avatarUrl || null,
      messages: [],
      chatBg: null,
      customCssEnabled: false,
      customCss: "",
      memory: window.imApp.createDefaultMemory()
    }),
    saved_20 = window.imApp.commitFriendsChange ? await window.imApp.commitFriendsChange(() => {
      window.imData.friends.push(friend_25);
    }, {
      friendId: friend_25.id,
      silent: true
    }) : false;
  if (!saved_20) {
    if (window.showToast) window.showToast("添加好友保存失败");
    return false;
  }
  if (window.imApp.renderFriendsList) window.imApp.renderFriendsList();
  if (window.showToast) window.showToast("已添加好友: " + friend_25.nickname);
  return true;
};
window.imApp.formatTime = function (value_1347) {
  if (!value_1347) return "";
  const date_3 = new Date(value_1347),
    now_4 = new Date(),
    value_1350 = date_3.toDateString() === now_4.toDateString(),
    yesterday = new Date(now_4);
  yesterday.setDate(now_4.getDate() - 1);
  const value_1352 = date_3.toDateString() === yesterday.toDateString(),
    hours_2 = date_3.getHours().toString().padStart(2, "0"),
    minutes_2 = date_3.getMinutes().toString().padStart(2, "0");
  if (value_1350) return hours_2 + ":" + minutes_2;
  if (value_1352) return "Yesterday";
  return date_3.getMonth() + 1 + "/" + date_3.getDate() + " " + hours_2 + ":" + minutes_2;
};
window.imApp.addMomentNotification = async function (type_2, user_6, momentId_6, contentOrPayload = "", thought_4 = "") {
  const payload_3 = contentOrPayload && typeof contentOrPayload === "object" ? contentOrPayload : {
      content: contentOrPayload,
      thought: thought_4
    },
    notif = {
      id: Date.now(),
      type: type_2,
      userId: user_6.id || user_6.userId,
      userName: user_6.nickname || user_6.name,
      userAvatar: user_6.avatarUrl || user_6.avatar,
      momentId: momentId_6,
      momentImg: null,
      momentText: null,
      content: String(payload_3.content || "").trim(),
      contentTranslation: String(payload_3.contentTranslation || payload_3.translation || "").trim(),
      thought: String(payload_3.thought || "").trim(),
      thoughtTranslation: String(payload_3.thoughtTranslation || "").trim(),
      language: window.imDataUtils?.normalizeChatLanguage ? window.imDataUtils.normalizeChatLanguage(payload_3.language || user_6.language || "zh") : String(payload_3.language || user_6.language || "zh"),
      time: Date.now(),
      read: false
    },
    m_2 = window.imData.moments.find(x => x.id === momentId_6);
  if (m_2) {
    if (m_2.images && m_2.images.length > 0) {
      const img_2 = m_2.images[0];
      notif.momentImg = typeof img_2 === "object" ? img_2.src : img_2;
    }
    notif.momentText = m_2.text;
  }
  const momentMessages_3 = Array.isArray(window.imData.momentMessages) ? typeof structuredClone === "function" ? structuredClone(window.imData.momentMessages) : JSON.parse(JSON.stringify(window.imData.momentMessages)) : [];
  window.imData.momentMessages.unshift(notif);
  const saved_21 = await window.imApp.saveMomentMessages({
    silent: true
  });
  if (!saved_21) {
    window.imData.momentMessages = momentMessages_3;
    if (window.imApp.renderMomentsMessages) window.imApp.renderMomentsMessages();
    if (window.imApp.updateMomentsNewMessageBubble) window.imApp.updateMomentsNewMessageBubble();
    if (window.showToast) window.showToast("朋友圈消息保存失败");
    return false;
  }
  if (window.imApp.renderMomentsMessages) window.imApp.renderMomentsMessages();
  if (window.imApp.updateMomentsNewMessageBubble) window.imApp.updateMomentsNewMessageBubble();
  return window.dispatchEvent(new CustomEvent("u2:moment-notification-added", {
    detail: {
      notificationId: notif.id
    }
  })), true;
};
window.imApp.getImessageUiState = function () {
  const rawState = typeof window.getAppState === "function" ? window.getAppState("imessage") : null,
    safeState = rawState && typeof rawState === "object" ? rawState : {},
    uiState_2 = safeState.uiState && typeof safeState.uiState === "object" ? safeState.uiState : {},
    hasLegacyOfflineThemeCss = theme_3 => typeof theme_3?.customCss === "string" && theme_3.customCss.includes("offline-tavern"),
    needsOfflineThemeCssMigration_2 = hasLegacyOfflineThemeCss(uiState_2.offlineTheme) || Array.isArray(uiState_2.offlineThemePresets) && uiState_2.offlineThemePresets.some(hasLegacyOfflineThemeCss),
    offlineThemePresets_3 = window.imApp.normalizeOfflineThemePresets(uiState_2.offlineThemePresets),
    offlineTheme_3 = window.imApp.normalizeOfflineThemeState(uiState_2.offlineTheme);
  return offlineTheme_3.activePresetId && !offlineThemePresets_3.some(preset_4 => preset_4.id === offlineTheme_3.activePresetId) && (offlineTheme_3.activePresetId = ""), {
    cssPresets: Array.isArray(uiState_2.cssPresets) ? uiState_2.cssPresets : [],
    offlineTheme: offlineTheme_3,
    offlineThemePresets: offlineThemePresets_3,
    hasOfflineTheme: !!(uiState_2.offlineTheme && typeof uiState_2.offlineTheme === "object"),
    needsOfflineThemeCssMigration: needsOfflineThemeCssMigration_2,
    offlinePrompts: Array.isArray(uiState_2.offlinePrompts) ? uiState_2.offlinePrompts : [],
    offlinePromptPresets: Array.isArray(uiState_2.offlinePromptPresets) ? uiState_2.offlinePromptPresets : [],
    onlinePromptPresets: window.imApp.onlinePrompts?.normalizePresets(uiState_2.onlinePromptPresets) || [],
    offlinePromptActivePresetId: String(uiState_2.offlinePromptActivePresetId || "").trim(),
    offlinePromptsInitialized: uiState_2.offlinePromptsInitialized === true,
    offlineTextReplacementRules: Array.isArray(uiState_2.offlineTextReplacementRules) ? uiState_2.offlineTextReplacementRules : [],
    offlineHtmlTemplateRules: Array.isArray(uiState_2.offlineHtmlTemplateRules) ? uiState_2.offlineHtmlTemplateRules : [],
    friendRequests: window.imApp.normalizeFriendRequests ? window.imApp.normalizeFriendRequests(uiState_2.friendRequests) : Array.isArray(uiState_2.friendRequests) ? uiState_2.friendRequests : []
  };
};
window.imApp.saveImessageUiState = function () {
  const currentState = typeof window.getAppState === "function" ? window.getAppState("imessage") || {} : {},
    nextState = {
      ...currentState,
      uiState: {
        ...(currentState && currentState.uiState && typeof currentState.uiState === "object" ? currentState.uiState : {}),
        cssPresets: Array.isArray(window.imData.cssPresets) ? window.imData.cssPresets : [],
        offlineTheme: window.imApp.normalizeOfflineThemeState(window.imData.offlineTheme),
        offlineThemePresets: window.imApp.normalizeOfflineThemePresets(window.imData.offlineThemePresets),
        offlinePrompts: Array.isArray(window.imData.offlinePrompts) ? window.imData.offlinePrompts : [],
        offlinePromptPresets: Array.isArray(window.imData.offlinePromptPresets) ? window.imData.offlinePromptPresets : [],
        onlinePromptPresets: window.imApp.onlinePrompts?.normalizePresets(window.imData.onlinePromptPresets) || [],
        offlinePromptActivePresetId: String(window.imData.offlinePromptActivePresetId || "").trim(),
        offlinePromptsInitialized: window.imData.offlinePromptsInitialized === true,
        offlineTextReplacementRules: Array.isArray(window.imData.offlineTextReplacementRules) ? window.imData.offlineTextReplacementRules : [],
        offlineHtmlTemplateRules: Array.isArray(window.imData.offlineHtmlTemplateRules) ? window.imData.offlineHtmlTemplateRules : [],
        friendRequests: window.imApp.normalizeFriendRequests ? window.imApp.normalizeFriendRequests(window.imData.friendRequests) : Array.isArray(window.imData.friendRequests) ? window.imData.friendRequests : []
      }
    };
  if (typeof window.setAppState === "function") window.setAppState("imessage", nextState);else window.saveGlobalData && window.saveGlobalData();
  return nextState;
};
window.imApp.initializeData = async function () {
  if (window.imData.ready) return window.imData;
  try {
    if (window.imStorage) {
      if (window.__iisoNeedsLegacyStorageReset && window.imStorage.clearAllData) try {
        await window.imStorage.clearAllData();
        console.warn("Legacy iMessage IndexedDB data cleared due to storage schema upgrade.");
      } catch (clearError) {
        console.error("Failed to clear legacy iMessage IndexedDB data during schema upgrade", clearError);
      } finally {
        window.__iisoNeedsLegacyStorageReset = false;
      }
      const initialPayload = {
          friends: window.imStorage.loadFriends ? await window.imStorage.loadFriends() : [],
          momentsCoverUrl: window.imStorage.loadMomentsCoverUrl ? await window.imStorage.loadMomentsCoverUrl() : null
        },
        legacySocialAccountFriendIds = [],
        legacySocialAccountFriendIds_2 = [];
      window.imData.friends = Array.isArray(initialPayload.friends) ? initialPayload.friends.map(friend_26 => {
        Array.isArray(friend_26?.memory?.socialAccounts) && friend_26.id != null && legacySocialAccountFriendIds.push(String(friend_26.id));
        const normalizedFriend_8 = window.imApp.normalizeFriendData(friend_26);
        return normalizedFriend_8._statusTemplateNeedsPersistence === true && normalizedFriend_8.id != null && (legacySocialAccountFriendIds_2.push(String(normalizedFriend_8.id)), delete normalizedFriend_8._statusTemplateNeedsPersistence), normalizedFriend_8.messages = Array.isArray(friend_26.messages) ? friend_26.messages : [], normalizedFriend_8.messagesLoaded = friend_26.messagesLoaded === true, normalizedFriend_8.lastMessagePreview = typeof friend_26.lastMessagePreview === "string" ? friend_26.lastMessagePreview : "", normalizedFriend_8.lastMessageTimestamp = Number(friend_26.lastMessageTimestamp) || 0, normalizedFriend_8.messageCount = Number(friend_26.messageCount) || normalizedFriend_8.messages.length || 0, normalizedFriend_8;
      }) : [];
      window.imData.moments = [];
      window.imData.momentMessages = [];
      window.imData.stickers = [];
      window.imData.momentsCoverUrl = initialPayload.momentsCoverUrl || null;
      window.imData.momentsLoaded = false;
      window.imData.momentMessagesLoaded = false;
      window.imData.stickersLoaded = false;
      legacySocialAccountFriendIds.length > 0 && window.imStorage.saveFriendMeta && Promise.all(legacySocialAccountFriendIds.map(friendId_10 => {
        const normalizedFriend_9 = window.imApp.getFriendById(friendId_10);
        return normalizedFriend_9 ? window.imStorage.saveFriendMeta(normalizedFriend_9) : null;
      }))["catch"](error_3 => console.warn("Failed to remove legacy social-account memory data", error_3));
      legacySocialAccountFriendIds_2.length > 0 && window.imStorage.saveFriendMeta && Promise.all(legacySocialAccountFriendIds_2.map(friendId_11 => {
        const normalizedFriend_10 = window.imApp.getFriendById(friendId_11);
        return normalizedFriend_10 ? window.imStorage.saveFriendMeta(normalizedFriend_10) : null;
      }))["catch"](value_1390 => console.warn("Failed to migrate legacy iMessage status templates", value_1390));
    } else console.warn("imStorage not available, iMessage will run with volatile in-memory state.");
    const globalUiState = window.imApp.getImessageUiState ? window.imApp.getImessageUiState() : {
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
    window.imData.cssPresets = Array.isArray(globalUiState.cssPresets) ? globalUiState.cssPresets : [];
    window.imData.offlineTheme = window.imApp.normalizeOfflineThemeState(globalUiState.offlineTheme);
    window.imData.offlineThemePresets = window.imApp.normalizeOfflineThemePresets(globalUiState.offlineThemePresets);
    window.imData.offlineThemeInitialized = !!globalUiState.hasOfflineTheme;
    window.imData.offlinePrompts = Array.isArray(globalUiState.offlinePrompts) ? globalUiState.offlinePrompts : [];
    window.imData.offlinePromptPresets = Array.isArray(globalUiState.offlinePromptPresets) ? globalUiState.offlinePromptPresets : [];
    window.imData.onlinePromptPresets = window.imApp.onlinePrompts?.normalizePresets(globalUiState.onlinePromptPresets) || [];
    window.imData.offlinePromptActivePresetId = String(globalUiState.offlinePromptActivePresetId || "").trim();
    window.imData.offlinePromptsInitialized = globalUiState.offlinePromptsInitialized === true;
    window.imData.offlineTextReplacementRules = Array.isArray(globalUiState.offlineTextReplacementRules) ? globalUiState.offlineTextReplacementRules : [];
    window.imData.offlineHtmlTemplateRules = Array.isArray(globalUiState.offlineHtmlTemplateRules) ? globalUiState.offlineHtmlTemplateRules : [];
    window.imData.friendRequests = window.imApp.normalizeFriendRequests(globalUiState.friendRequests);
    globalUiState.needsOfflineThemeCssMigration && window.imApp.saveImessageUiState && window.imApp.saveImessageUiState();
    window.imData.ready = true;
    window.appStorage?.setMeta && window.appStorage.setMeta("imessage_runtime", {
      storageMode: "indexeddb",
      dataVersion: 3,
      friendsCount: Array.isArray(window.imData.friends) ? window.imData.friends.length : 0,
      lastSyncAt: Date.now()
    })["catch"](error_4 => console.warn("Failed to persist iMessage runtime metadata", error_4));
    document.dispatchEvent(new CustomEvent("imessage-data-ready"));
  } catch (e_10) {
    console.error("Failed to initialize iMessage data", e_10);
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
    const moments_4 = window.imStorage?.loadMoments ? await window.imStorage.loadMoments() : [];
    window.imData.moments = Array.isArray(moments_4) ? moments_4 : [];
    window.imData.momentsLoaded = true;
  } catch (e_11) {
    console.error("Failed to lazy load moments", e_11);
    window.imData.moments = Array.isArray(window.imData.moments) ? window.imData.moments : [];
    window.imData.momentsLoaded = true;
  }
  return window.imData.moments;
};
window.imApp.ensureMomentMessagesReady = async function () {
  if (window.imData.momentMessagesLoaded) return Array.isArray(window.imData.momentMessages) ? window.imData.momentMessages : [];
  if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
  try {
    const messages_8 = window.imStorage?.loadMomentMessages ? await window.imStorage.loadMomentMessages() : [];
    window.imData.momentMessages = Array.isArray(messages_8) ? messages_8 : [];
    window.imData.momentMessagesLoaded = true;
  } catch (e_12) {
    console.error("Failed to lazy load moment messages", e_12);
    window.imData.momentMessages = Array.isArray(window.imData.momentMessages) ? window.imData.momentMessages : [];
    window.imData.momentMessagesLoaded = true;
  }
  return window.imData.momentMessages;
};
window.imApp.ensureStickersReady = async function () {
  if (window.imData.stickersLoaded) return Array.isArray(window.imData.stickers) ? window.imData.stickers : [];
  if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
  try {
    const stickers_3 = window.imStorage?.loadStickers ? await window.imStorage.loadStickers() : [];
    window.imData.stickers = Array.isArray(stickers_3) ? stickers_3 : [];
    window.imData.stickersLoaded = true;
  } catch (value_1398) {
    console.error("Failed to lazy load stickers", value_1398);
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
    const value_1399 = window.imStorage?.loadStickerMetadata ? await window.imStorage.loadStickerMetadata() : [];
    window.imData.stickerMetadata = Array.isArray(value_1399) ? value_1399 : [];
    window.imData.stickerMetadataLoaded = true;
  } catch (value_1400) {
    console.error("Failed to load sticker metadata", value_1400);
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
(window.u2OnStorageReady || (callback => document.addEventListener("DOMContentLoaded", callback)))(() => {
  const {
    UI: UI_2,
    userState: userState_2,
    apiConfig: apiConfig_2,
    openView: openView_2,
    closeView: closeView_2,
    showToast: showToast_2,
    syncUIs: syncUIs_2
  } = window;
  async function readFileAsDataUrl_2(file) {
    return new Promise((resolve_2, reject) => {
      if (!file) {
        reject(new Error("No file provided"));
        return;
      }
      const reader = new FileReader();
      reader.onload = event_2 => resolve_2(event_2.target?.result || null);
      reader.onerror = () => reject(reader.error || new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }
  async function loadImageFromDataUrl(dataUrl) {
    return new Promise((resolve_3, reject_2) => {
      const img_3 = new Image();
      img_3.onload = () => resolve_3(img_3);
      img_3.onerror = () => reject_2(new Error("Failed to load image"));
      img_3.src = dataUrl;
    });
  }
  function canvasToDataUrl(canvas, mimeType_2 = "image/jpeg", quality_2 = 0.82) {
    try {
      return canvas.toDataURL(mimeType_2, quality_2);
    } catch (e) {
      return canvas.toDataURL();
    }
  }
  async function compressImageFile_2(value_1440, options_34 = {}) {
    if (!value_1440) return null;
    const {
        maxWidth = 1080,
        maxHeight = 1080,
        mimeType = "image/jpeg",
        quality = 0.82
      } = options_34,
      value_1442 = await readFileAsDataUrl_2(value_1440);
    if (!value_1442) return null;
    const img_4 = await loadImageFromDataUrl(value_1442),
      naturalWidth_2 = img_4.naturalWidth || img_4.width || 0,
      naturalHeight_2 = img_4.naturalHeight || img_4.height || 0;
    if (!naturalWidth_2 || !naturalHeight_2) return value_1442;
    const scale = Math.min(1, maxWidth / naturalWidth_2, maxHeight / naturalHeight_2),
      width_2 = Math.max(1, Math.round(naturalWidth_2 * scale)),
      height_2 = Math.max(1, Math.round(naturalHeight_2 * scale)),
      element_1449 = document.createElement("canvas");
    element_1449.width = width_2;
    element_1449.height = height_2;
    const ctx = element_1449.getContext("2d");
    if (!ctx) return value_1442;
    return ctx.drawImage(img_4, 0, 0, width_2, height_2), canvasToDataUrl(element_1449, mimeType, quality);
  }
  window.imApp = window.imApp || {};
  window.imApp.readFileAsDataUrl = readFileAsDataUrl_2;
  window.imApp.compressImageFile = compressImageFile_2;
  const customModalOverlay = document.getElementById("custom-modal-overlay"),
    modalTitle = document.getElementById("modal-title"),
    modalConfirmContent = document.getElementById("modal-confirm-content"),
    modalPromptContent = document.getElementById("modal-prompt-content"),
    modalMessage = document.getElementById("modal-message"),
    modalInput = document.getElementById("modal-input"),
    modalInputGroup = document.getElementById("modal-input-group"),
    modalTextareaGroup = document.getElementById("modal-textarea-group"),
    modalTextarea = document.getElementById("modal-textarea"),
    modalTextareaLabelElement = document.getElementById("modal-textarea-label"),
    modalSecondaryTextareaGroupElement = document.getElementById("modal-secondary-textarea-group"),
    modalSecondaryTextareaLabelElement = document.getElementById("modal-secondary-textarea-label"),
    modalSecondaryTextareaElement = document.getElementById("modal-secondary-textarea"),
    modalToggleGroup = document.getElementById("modal-toggle-group"),
    modalToggleLabel = document.getElementById("modal-toggle-label"),
    modalToggleInput = document.getElementById("modal-toggle-input"),
    modalReferenceFaceGroup = document.getElementById("modal-reference-face-group"),
    modalReferenceFacePreview = document.getElementById("modal-reference-face-preview"),
    modalReferenceFaceTitle = document.getElementById("modal-reference-face-title"),
    modalReferenceFaceStatus = document.getElementById("modal-reference-face-status"),
    modalReferenceFaceUploadBtn = document.getElementById("modal-reference-face-upload-btn"),
    modalReferenceFaceDeleteBtn = document.getElementById("modal-reference-face-delete-btn"),
    modalReferenceFaceInput = document.getElementById("modal-reference-face-input"),
    modalImageComposerGroup = document.getElementById("modal-image-composer-group"),
    modalImageComposerPreview = document.getElementById("modal-image-composer-preview"),
    modalImageComposerStatus = document.getElementById("modal-image-composer-status"),
    modalImageComposerUploadBtn = document.getElementById("modal-image-composer-upload-btn"),
    modalImageComposerRemoveBtn = document.getElementById("modal-image-composer-remove-btn"),
    modalImageComposerRecognizeBtn = document.getElementById("modal-image-composer-recognize-btn"),
    modalImageComposerInput = document.getElementById("modal-image-composer-input"),
    modalGenerationPromptGroup = document.getElementById("modal-generation-prompt-group"),
    modalGenerationPresetSelect = document.getElementById("modal-generation-preset-select"),
    modalGenerationSavePresetBtn = document.getElementById("modal-generation-save-preset-btn"),
    modalAutoImageGenerationToggle = document.getElementById("modal-auto-image-generation-toggle"),
    modalAutoReferenceFaceToggle = document.getElementById("modal-auto-reference-face-toggle"),
    modalAutoReferenceFaceHint = document.getElementById("modal-auto-reference-face-hint"),
    modalGenerationCharAppearance = document.getElementById("modal-generation-char-appearance"),
    modalGenerationUserAppearance = document.getElementById("modal-generation-user-appearance"),
    modalGenerationArtistPrompt = document.getElementById("modal-generation-artist-prompt"),
    modalGenerationNegativePrompt = document.getElementById("modal-generation-negative-prompt"),
    modalConfirmBtn = document.getElementById("modal-confirm-btn"),
    modalCancelBtn = document.getElementById("modal-cancel-btn"),
    modalPromptConfirmBtn = document.getElementById("modal-prompt-confirm-btn");
  let currentModalCallback = null,
    currentModalCancelCallback = null,
    currentModalReferenceFace = null,
    currentModalImageComposer = null,
    currentModalGenerationPrompt = null;
  function renderModalImageComposer(composer) {
    currentModalImageComposer = composer || null;
    const src_2 = String(composer?.imageUrl || ""),
      imgElement = modalImageComposerPreview?.querySelector("img"),
      iElement = modalImageComposerPreview?.querySelector("i");
    if (modalImageComposerGroup) modalImageComposerGroup.style.display = composer ? "block" : "none";
    if (modalImageComposerStatus) modalImageComposerStatus.textContent = src_2 ? composer?.fileName || "已选择图片" : "未选择图片时发送虚拟图片";
    if (modalImageComposerUploadBtn) modalImageComposerUploadBtn.textContent = src_2 ? "更换" : "上传";
    if (modalImageComposerRemoveBtn) modalImageComposerRemoveBtn.style.display = src_2 ? "" : "none";
    if (modalImageComposerRecognizeBtn) modalImageComposerRecognizeBtn.style.display = src_2 ? "block" : "none";
    imgElement && iElement && (src_2 ? (imgElement.src = src_2, imgElement.style.display = "block", iElement.style.display = "none") : (imgElement.removeAttribute("src"), imgElement.style.display = "none", iElement.style.display = ""));
  }
  function renderModalReferenceFace(referenceFace_2, enableAfterUpload = false) {
    currentModalReferenceFace = referenceFace_2 || null;
    const src_3 = String(referenceFace_2?.imageUrl || ""),
      imgElement_1456 = modalReferenceFacePreview?.querySelector("img"),
      iElement_1457 = modalReferenceFacePreview?.querySelector("i");
    if (modalReferenceFaceGroup) modalReferenceFaceGroup.style.display = referenceFace_2 ? "flex" : "none";
    if (modalReferenceFaceTitle) modalReferenceFaceTitle.textContent = referenceFace_2?.title || "角色参考脸";
    if (modalReferenceFaceStatus) modalReferenceFaceStatus.textContent = src_3 ? referenceFace_2?.fileName || "已上传" : "尚未上传";
    if (modalReferenceFaceUploadBtn) modalReferenceFaceUploadBtn.textContent = src_3 ? "更换" : "上传";
    if (modalReferenceFaceDeleteBtn) modalReferenceFaceDeleteBtn.style.display = src_3 ? "" : "none";
    imgElement_1456 && iElement_1457 && (src_3 ? (imgElement_1456.src = src_3, imgElement_1456.style.display = "block", iElement_1457.style.display = "none") : (imgElement_1456.removeAttribute("src"), imgElement_1456.style.display = "none", iElement_1457.style.display = ""));
    if (modalToggleGroup) modalToggleGroup.style.display = src_3 ? "flex" : "none";
    if (modalToggleLabel) modalToggleLabel.textContent = "本次使用参考脸";
    modalToggleInput && (modalToggleInput.checked = src_3 && enableAfterUpload, modalToggleInput.disabled = !src_3);
    handleAction_1412();
  }
  function handleAction_1412() {
    if (!modalAutoReferenceFaceToggle) return;
    const hasReferenceFace = !!String(currentModalReferenceFace?.imageUrl || "").trim();
    modalAutoReferenceFaceToggle.disabled = !hasReferenceFace;
    if (!hasReferenceFace) modalAutoReferenceFaceToggle.checked = false;
    modalAutoReferenceFaceHint && (modalAutoReferenceFaceHint.textContent = hasReferenceFace ? "自动生图时使用当前角色参考脸" : "请先上传角色参考脸");
  }
  function showCustomModal_2(options_35) {
    if (!customModalOverlay) return;
    modalTitle.textContent = options_35.title || "提示";
    currentModalCallback = options_35.onConfirm;
    currentModalCancelCallback = options_35.onCancel;
    currentModalReferenceFace = null;
    currentModalImageComposer = null;
    currentModalGenerationPrompt = options_35.generationPrompt || null;
    if (options_35.type === "prompt") {
      const useTextarea = options_35.multiline === true,
        value_1461 = options_35.secondaryTextarea && typeof options_35.secondaryTextarea === "object" ? options_35.secondaryTextarea : null;
      modalConfirmBtn.style.display = "none";
      modalPromptConfirmBtn.style.display = "block";
      modalConfirmContent.style.display = "none";
      modalPromptContent.style.display = "block";
      modalMessage.textContent = options_35.message || "";
      if (modalInputGroup) modalInputGroup.style.display = useTextarea ? "none" : "";
      if (modalTextareaGroup) modalTextareaGroup.style.display = useTextarea ? "block" : "none";
      modalInput && (modalInput.value = useTextarea ? "" : options_35.defaultValue || "", modalInput.placeholder = options_35.placeholder || "");
      modalTextarea && (modalTextarea.value = useTextarea ? options_35.defaultValue || "" : "", modalTextarea.placeholder = options_35.placeholder || "");
      modalTextareaLabelElement && (modalTextareaLabelElement.textContent = options_35.textareaLabel || "", modalTextareaLabelElement.style.display = useTextarea && options_35.textareaLabel ? "block" : "none");
      modalSecondaryTextareaGroupElement && (modalSecondaryTextareaGroupElement.style.display = value_1461 ? "block" : "none");
      modalSecondaryTextareaLabelElement && (modalSecondaryTextareaLabelElement.textContent = value_1461?.label || "翻译");
      modalSecondaryTextareaElement && (modalSecondaryTextareaElement.value = value_1461?.defaultValue || "", modalSecondaryTextareaElement.placeholder = value_1461?.placeholder || "");
      if (options_35.imageComposer) renderModalImageComposer(options_35.imageComposer);else {
        if (modalImageComposerGroup) modalImageComposerGroup.style.display = "none";
      }
      if (modalGenerationPromptGroup) modalGenerationPromptGroup.style.display = options_35.generationPrompt ? "block" : "none";
      if (modalGenerationPresetSelect) {
        modalGenerationPresetSelect.replaceChildren();
        const currentOption = document.createElement("option");
        currentOption.value = "";
        currentOption.textContent = "当前编辑内容";
        modalGenerationPresetSelect.appendChild(currentOption);
        (Array.isArray(options_35.generationPrompt?.presets) ? options_35.generationPrompt.presets : []).forEach(preset_5 => {
          const option_3 = document.createElement("option");
          option_3.value = String(preset_5.id || "");
          option_3.textContent = String(preset_5.name || "未命名预设");
          modalGenerationPresetSelect.appendChild(option_3);
        });
        modalGenerationPresetSelect.value = String(options_35.generationPrompt?.activePresetId || "");
        modalGenerationPresetSelect.disabled = !options_35.generationPrompt?.presets?.length;
      }
      modalAutoImageGenerationToggle && (modalAutoImageGenerationToggle.checked = options_35.generationPrompt?.autoGenerate === true);
      modalAutoReferenceFaceToggle && (modalAutoReferenceFaceToggle.checked = options_35.generationPrompt?.autoUseReferenceFace === true);
      if (modalGenerationCharAppearance) modalGenerationCharAppearance.value = options_35.generationPrompt?.charAppearance || "";
      if (modalGenerationUserAppearance) modalGenerationUserAppearance.value = options_35.generationPrompt?.userAppearance || "";
      if (modalGenerationArtistPrompt) modalGenerationArtistPrompt.value = options_35.generationPrompt?.artistPrompt || "";
      if (modalGenerationNegativePrompt) modalGenerationNegativePrompt.value = options_35.generationPrompt?.negativePrompt || "";
      if (options_35.referenceFace) renderModalReferenceFace(options_35.referenceFace);else {
        if (modalReferenceFaceGroup) modalReferenceFaceGroup.style.display = "none";
        if (modalToggleGroup) modalToggleGroup.style.display = options_35.toggle ? "flex" : "none";
        if (modalToggleLabel) modalToggleLabel.textContent = options_35.toggle?.label || "";
        modalToggleInput && (modalToggleInput.checked = !!options_35.toggle?.checked, modalToggleInput.disabled = !!options_35.toggle?.disabled);
        handleAction_1412();
      }
      modalPromptConfirmBtn.textContent = options_35.confirmText || "确认";
      modalPromptConfirmBtn.style.background = options_35.confirmTone === "dark" ? "#111" : "#007aff";
      modalPromptConfirmBtn.style.color = "#fff";
    } else {
      modalConfirmBtn.style.display = "block";
      modalPromptConfirmBtn.style.display = "none";
      modalConfirmContent.style.display = "block";
      modalPromptContent.style.display = "none";
      if (modalToggleGroup) modalToggleGroup.style.display = "none";
      if (modalSecondaryTextareaGroupElement) modalSecondaryTextareaGroupElement.style.display = "none";
      if (modalReferenceFaceGroup) modalReferenceFaceGroup.style.display = "none";
      if (modalImageComposerGroup) modalImageComposerGroup.style.display = "none";
      if (modalGenerationPromptGroup) modalGenerationPromptGroup.style.display = "none";
      modalGenerationPresetSelect && (modalGenerationPresetSelect.replaceChildren(), modalGenerationPresetSelect.disabled = true);
      if (modalAutoImageGenerationToggle) modalAutoImageGenerationToggle.checked = false;
      modalAutoReferenceFaceToggle && (modalAutoReferenceFaceToggle.checked = false, modalAutoReferenceFaceToggle.disabled = true);
      if (modalAutoReferenceFaceHint) modalAutoReferenceFaceHint.textContent = "请先上传角色参考脸";
      modalMessage.textContent = options_35.message || "";
      modalConfirmBtn.textContent = options_35.confirmText || "确认";
      const isDeleteAction = options_35.isDestructive && String(options_35.confirmText || "").trim() === "删除",
        isDarkAction = options_35.confirmTone === "dark";
      modalConfirmBtn.style.color = isDeleteAction || isDarkAction ? "#fff" : options_35.isDestructive ? "#ff3b30" : "#2c2c2e";
      modalConfirmBtn.style.background = isDeleteAction || isDarkAction ? "#111" : "";
      modalConfirmBtn.style.borderRadius = isDeleteAction ? "12px" : "";
      modalConfirmBtn.style.fontWeight = isDeleteAction ? "700" : "";
    }
    customModalOverlay.style.display = "flex";
    void customModalOverlay.offsetWidth;
    customModalOverlay.classList.add("active");
    const bottomSheetElement = customModalOverlay.querySelector(".bottom-sheet");
    if (bottomSheetElement) bottomSheetElement.style.transform = "translateY(0)";
    options_35.type === "prompt" && (options_35.multiline === true ? setTimeout(() => modalTextarea?.focus(), 300) : setTimeout(() => modalInput.focus(), 300));
  }
  function getCurrentModalPromptState() {
    const promptValue_2 = modalTextareaGroup?.style.display === "block" ? modalTextarea?.value || "" : modalInput?.value || "";
    return {
      promptValue: promptValue_2,
      secondaryValue: modalSecondaryTextareaGroupElement?.style.display === "block" ? modalSecondaryTextareaElement?.value || "" : null,
      toggleChecked: !!modalToggleInput?.checked,
      referenceImage: currentModalReferenceFace?.imageUrl || "",
      uploadedImage: currentModalImageComposer?.imageUrl || "",
      uploadedFileName: currentModalImageComposer?.fileName || "",
      charAppearance: modalGenerationCharAppearance?.value || "",
      userAppearance: modalGenerationUserAppearance?.value || "",
      artistPrompt: modalGenerationArtistPrompt?.value || "",
      negativePrompt: modalGenerationNegativePrompt?.value || "",
      activePresetId: modalGenerationPresetSelect?.value || "",
      autoGenerate: modalAutoImageGenerationToggle?.checked === true,
      autoUseReferenceFace: modalAutoReferenceFaceToggle?.checked === true,
      presets: Array.isArray(currentModalGenerationPrompt?.presets) ? currentModalGenerationPrompt.presets : []
    };
  }
  function closeCustomModal_2(value_1468 = true) {
    if (!customModalOverlay) return;
    customModalOverlay.classList.remove("active");
    setTimeout(() => {
      customModalOverlay.style.display = "none";
    }, 300);
    value_1468 && typeof currentModalCancelCallback === "function" && currentModalCancelCallback(getCurrentModalPromptState());
    currentModalCallback = null;
    currentModalCancelCallback = null;
    currentModalReferenceFace = null;
    currentModalImageComposer = null;
    currentModalGenerationPrompt = null;
  }
  window.imApp.showCustomModal = showCustomModal_2;
  window.imApp.closeCustomModal = closeCustomModal_2;
  window.showCustomModal = showCustomModal_2;
  window.closeCustomModal = closeCustomModal_2;
  if (modalCancelBtn) modalCancelBtn.addEventListener("click", () => closeCustomModal_2(true));
  modalConfirmBtn && modalConfirmBtn.addEventListener("click", () => {
    if (currentModalCallback) currentModalCallback(true);
    closeCustomModal_2(false);
  });
  modalPromptConfirmBtn && modalPromptConfirmBtn.addEventListener("click", () => {
    const modalState = getCurrentModalPromptState(),
      callbackResult = currentModalCallback ? currentModalCallback(modalState.promptValue, modalState) : undefined;
    if (callbackResult === false) return;
    closeCustomModal_2(false);
  });
  modalReferenceFaceUploadBtn?.addEventListener("click", () => modalReferenceFaceInput?.click());
  modalReferenceFaceInput?.addEventListener("change", async event_1471 => {
    const value_1472 = event_1471.target.files?.[0];
    event_1471.target.value = "";
    if (!value_1472 || typeof currentModalReferenceFace?.onUpload !== "function") return;
    try {
      modalReferenceFaceUploadBtn.disabled = true;
      const result_2 = await currentModalReferenceFace.onUpload(value_1472);
      result_2?.imageUrl && renderModalReferenceFace({
        ...currentModalReferenceFace,
        ...result_2
      }, true);
    } catch (value_1474) {
      window.showToast?.(value_1474?.message || "参考脸上传失败");
    } finally {
      modalReferenceFaceUploadBtn.disabled = false;
    }
  });
  modalReferenceFaceDeleteBtn?.addEventListener("click", async () => {
    if (typeof currentModalReferenceFace?.onDelete !== "function") return;
    try {
      modalReferenceFaceDeleteBtn.disabled = true;
      await currentModalReferenceFace.onDelete();
      renderModalReferenceFace({
        ...currentModalReferenceFace,
        imageUrl: "",
        fileName: ""
      });
    } catch (error_5) {
      window.showToast?.(error_5?.message || "参考脸删除失败");
    } finally {
      modalReferenceFaceDeleteBtn.disabled = false;
    }
  });
  modalImageComposerUploadBtn?.addEventListener("click", () => modalImageComposerInput?.click());
  modalImageComposerInput?.addEventListener("change", async event_3 => {
    const file_2 = event_3.target.files?.[0];
    event_3.target.value = "";
    if (!file_2 || typeof currentModalImageComposer?.onUpload !== "function") return;
    try {
      modalImageComposerUploadBtn.disabled = true;
      const result_3 = await currentModalImageComposer.onUpload(file_2);
      if (result_3?.imageUrl) renderModalImageComposer({
        ...currentModalImageComposer,
        ...result_3
      });
    } catch (error_6) {
      window.showToast?.(error_6?.message || "图片处理失败");
    } finally {
      modalImageComposerUploadBtn.disabled = false;
    }
  });
  modalImageComposerRemoveBtn?.addEventListener("click", () => {
    renderModalImageComposer({
      ...currentModalImageComposer,
      imageUrl: "",
      fileName: ""
    });
  });
  modalImageComposerRecognizeBtn?.addEventListener("click", async () => {
    if (!currentModalImageComposer?.imageUrl || typeof currentModalImageComposer?.onRecognize !== "function") return;
    try {
      modalImageComposerRecognizeBtn.disabled = true;
      modalImageComposerRecognizeBtn.textContent = "正在识图…";
      const value_46 = String((await currentModalImageComposer.onRecognize(currentModalImageComposer.imageUrl)) || "").trim();
      if (!value_46) throw new Error("识图接口没有返回图片内容");
      if (modalTextareaGroup?.style.display === "block" && modalTextarea) modalTextarea.value = value_46;else {
        if (modalInput) modalInput.value = value_46;
      }
      window.showToast?.("已生成图片内容");
    } catch (value_1481) {
      window.showToast?.(value_1481?.message || "图片识别失败");
    } finally {
      modalImageComposerRecognizeBtn.disabled = false;
      modalImageComposerRecognizeBtn.textContent = "识图生成图片内容";
    }
  });
  modalGenerationPresetSelect?.addEventListener("change", async () => {
    const generationPrompt_2 = currentModalGenerationPrompt;
    if (!generationPrompt_2) return;
    const presetId_4 = String(modalGenerationPresetSelect.value || "").trim(),
      preset_6 = (Array.isArray(generationPrompt_2.presets) ? generationPrompt_2.presets : []).find(item_25 => String(item_25?.id || "") === presetId_4);
    if (preset_6) {
      if (modalTextarea) modalTextarea.value = preset_6.basePrompt || preset_6.prompt || "";
      if (modalGenerationCharAppearance) modalGenerationCharAppearance.value = preset_6.charAppearance || "";
      if (modalGenerationUserAppearance) modalGenerationUserAppearance.value = preset_6.userAppearance || "";
      if (modalGenerationArtistPrompt) modalGenerationArtistPrompt.value = preset_6.artistPrompt || "";
      if (modalGenerationNegativePrompt) modalGenerationNegativePrompt.value = preset_6.negativePrompt || "";
    }
    if (typeof generationPrompt_2.onPresetSelect === "function") try {
      await generationPrompt_2.onPresetSelect(presetId_4, preset_6 || null);
    } catch (value_1486) {
      window.showToast?.(value_1486?.message || "提示词预设切换失败");
    }
  });
  modalGenerationSavePresetBtn?.addEventListener("click", async () => {
    const generationPrompt_3 = currentModalGenerationPrompt;
    if (!generationPrompt_3) return;
    const prompt_2 = String(modalTextarea?.value || modalInput?.value || "").trim();
    if (!prompt_2) {
      window.showToast?.("请输入生图提示词后再保存预设");
      return;
    }
    const defaultName = modalGenerationPresetSelect?.selectedOptions?.[0]?.textContent || "",
      name_6 = String(window.prompt("请输入预设名称", defaultName === "当前编辑内容" ? "" : defaultName) || "").trim();
    if (!name_6) return;
    const updatedAt_4 = Date.now(),
      existing_4 = (Array.isArray(generationPrompt_3.presets) ? generationPrompt_3.presets : []).find(item_26 => String(item_26?.name || "").trim() === name_6),
      preset_7 = {
        id: existing_4?.id || "image-preset-" + updatedAt_4 + "-" + Math.random().toString(36).slice(2, 7),
        name: name_6,
        prompt: prompt_2,
        basePrompt: prompt_2,
        charAppearance: String(modalGenerationCharAppearance?.value || "").trim(),
        userAppearance: String(modalGenerationUserAppearance?.value || "").trim(),
        artistPrompt: String(modalGenerationArtistPrompt?.value || "").trim(),
        negativePrompt: String(modalGenerationNegativePrompt?.value || "").trim(),
        createdAt: existing_4?.createdAt || updatedAt_4,
        updatedAt: updatedAt_4
      },
      presets_3 = (Array.isArray(generationPrompt_3.presets) ? generationPrompt_3.presets : []).filter(item_27 => String(item_27?.id || "") !== String(preset_7.id));
    presets_3.push(preset_7);
    generationPrompt_3.presets = presets_3.slice(-30);
    generationPrompt_3.activePresetId = preset_7.id;
    if (modalGenerationPresetSelect) {
      const option_4 = Array.from(modalGenerationPresetSelect.options).find(item_28 => item_28.value === preset_7.id);
      if (!option_4) {
        const newOption = document.createElement("option");
        newOption.value = preset_7.id;
        newOption.textContent = preset_7.name;
        modalGenerationPresetSelect.appendChild(newOption);
      }
      modalGenerationPresetSelect.disabled = false;
      modalGenerationPresetSelect.value = preset_7.id;
    }
    try {
      typeof generationPrompt_3.onSavePreset === "function" && (await generationPrompt_3.onSavePreset({
        preset: preset_7,
        presets: generationPrompt_3.presets,
        activePresetId: preset_7.id
      }));
      window.showToast?.("提示词预设已保存");
    } catch (value_1500) {
      window.showToast?.(value_1500?.message || "提示词预设保存失败");
    }
  });
  customModalOverlay && customModalOverlay.addEventListener("click", e_13 => {
    if (e_13.target === customModalOverlay) closeCustomModal_2(true);
  });
  const imessageView_3 = document.getElementById("imessage-view"),
    dockIcon = document.getElementById("dock-icon-imessage");
  dockIcon && dockIcon.addEventListener("click", e_14 => {
    if (window.isJiggleMode || window.preventAppClick) {
      e_14.preventDefault();
      e_14.stopPropagation();
      return;
    }
    if (syncUIs_2) syncUIs_2();
    openView_2(imessageView_3);
    if (window.imApp.syncMomentsUser) window.imApp.syncMomentsUser();
    if (window.imApp.renderFriendsList) window.imApp.renderFriendsList();
    if (window.imApp.renderGroupsList) window.imApp.renderGroupsList();
    if (window.imApp.updateChatsUnreadBadges) window.imApp.updateChatsUnreadBadges();
  });
  const imHeaderLeft = document.querySelector(".line-header-left");
  imHeaderLeft && imHeaderLeft.addEventListener("click", () => {
    closeView_2(imessageView_3);
  });
  const imHeaderRight = document.querySelector(".line-header-right");
  if (imHeaderRight) {
    const bookmarkBtn = imHeaderRight.querySelector(".fa-bookmark"),
      settingsBtn = imHeaderRight.querySelector(".fa-cog");
    if (bookmarkBtn) bookmarkBtn.addEventListener("click", () => {
      if (window.showToast) window.showToast("Bookmark clicked");
    });
    if (settingsBtn) settingsBtn.addEventListener("click", () => {
      if (window.showToast) window.showToast("Settings clicked");
    });
  }
  function handleAction_1417() {
    const stickersViewEl = document.getElementById("stickers-view"),
      appEl = document.getElementById("app");
    return stickersViewEl && appEl && stickersViewEl.parentNode !== appEl && appEl.appendChild(stickersViewEl), stickersViewEl;
  }
  const imServiceItems = document.querySelectorAll(".line-service-item");
  imServiceItems.forEach(value_1503 => {
    value_1503.addEventListener("click", async () => {
      if (value_1503.dataset.imessageService === "stickers") {
        try {
          window.imApp?.ensureStickersReady && (await window.imApp.ensureStickersReady());
        } catch (value_1505) {
          console.error("Failed to lazy load stickers", value_1505);
          if (window.showToast) window.showToast("表情数据加载失败");
        }
        const handleAction_1417_1504 = handleAction_1417();
        handleAction_1417_1504 && window.openView ? (handleAction_1417_1504.style.display = "flex", window.openView(handleAction_1417_1504), typeof renderStickersView_2 === "function" && renderStickersView_2()) : console.error("Stickers view or openView not found");
      } else {}
    });
  });
  const stickersView = handleAction_1417(),
    stickersBackBtn = document.getElementById("stickers-back-btn"),
    stickersAddBtn = document.getElementById("stickers-add-btn"),
    stickersEditBtn = document.getElementById("stickers-edit-btn"),
    addStickerSheet = document.getElementById("add-sticker-sheet"),
    stickersListContainer = document.getElementById("stickers-list-container"),
    stickerCategoryNameInput = document.getElementById("sticker-category-name"),
    stickerLocalUploadBtn = document.getElementById("sticker-local-upload-btn"),
    stickerLocalUploadInput = document.getElementById("sticker-local-upload-input"),
    stickerLocalPreview = document.getElementById("sticker-local-preview"),
    stickerUrlInput = document.getElementById("sticker-url-input"),
    confirmAddStickerBtn = document.getElementById("confirm-add-sticker-btn"),
    stickerManifestUploadBtn = document.getElementById("sticker-manifest-upload-btn"),
    stickerManifestUploadInput = document.getElementById("sticker-manifest-upload-input"),
    stickerDetailSheet = document.getElementById("sticker-category-detail-sheet"),
    stickerDetailTitle = document.getElementById("sticker-detail-title"),
    stickerDetailCount = document.getElementById("sticker-detail-count"),
    stickerDetailGrid = document.getElementById("sticker-detail-grid"),
    stickerDetailBindBtn = document.getElementById("sticker-detail-bind-btn"),
    stickerDetailDeleteCategoryBtn = document.getElementById("sticker-detail-delete-category-btn"),
    stickerDetailBatchBar = document.getElementById("sticker-detail-batch-bar"),
    stickerBatchDeleteBtn = document.getElementById("batch-delete-toggle");
  let pendingLocalStickers = [],
    activeStickerCategoryName = "";
  stickersBackBtn && stickersView && stickersBackBtn.addEventListener("click", () => {
    if (window.closeView) window.closeView(stickersView);else stickersView.style.display = "none";
  });
  stickersAddBtn && stickersAddBtn.addEventListener("click", () => {
    if (addStickerSheet) {
      addStickerSheet.style.display = "flex";
      void addStickerSheet.offsetWidth;
      addStickerSheet.classList.add("active");
      const bottomSheetElement_1506 = addStickerSheet.querySelector(".bottom-sheet");
      if (bottomSheetElement_1506) bottomSheetElement_1506.style.transform = "translateY(0)";
      if (stickerCategoryNameInput) stickerCategoryNameInput.value = "";
      if (stickerUrlInput) stickerUrlInput.value = "";
      stickerLocalPreview && (stickerLocalPreview.innerHTML = "", stickerLocalPreview.classList.remove("has-items"));
      pendingLocalStickers = [];
    }
  });
  function closeAddStickerSheet() {
    addStickerSheet && (addStickerSheet.classList.remove("active"), setTimeout(() => {
      addStickerSheet.style.display = "none";
      stickerLocalPreview && (stickerLocalPreview.innerHTML = "", stickerLocalPreview.classList.remove("has-items"));
      pendingLocalStickers = [];
    }, 300));
  }
  addStickerSheet && addStickerSheet.addEventListener("click", e_15 => {
    if (e_15.target === addStickerSheet) closeAddStickerSheet();
  });
  stickerLocalUploadBtn && stickerLocalUploadInput && (stickerLocalUploadBtn.addEventListener("click", () => {
    stickerLocalUploadInput.click();
  }), stickerLocalUploadInput.addEventListener("change", event_1508 => {
    const files_2 = event_1508.target.files;
    if (!files_2 || files_2.length === 0) return;
    pendingLocalStickers = [];
    stickerLocalPreview && (stickerLocalPreview.innerHTML = "", stickerLocalPreview.classList.add("has-items"));
    Array.from(files_2).forEach(async (file_3, value_1511) => {
      try {
        const value_1512 = window.imApp.compressImageFile ? await window.imApp.compressImageFile(file_3, {
            maxWidth: 256,
            maxHeight: 256,
            mimeType: "image/jpeg",
            quality: 0.8
          }) : await window.imApp.readFileAsDataUrl(file_3),
          name_7 = file_3.name.replace(/\.[^/.]+$/, "") || "sticker_" + (value_1511 + 1),
          stickerObj = {
            name: name_7,
            url: value_1512
          };
        pendingLocalStickers.push(stickerObj);
        if (stickerLocalPreview) {
          const previewContainer = document.createElement("div");
          previewContainer.className = "sticker-preview-item";
          const previewImg = document.createElement("img");
          previewImg.src = value_1512;
          previewImg.className = "sticker-preview-img";
          const nameInput = document.createElement("input");
          nameInput.type = "text";
          nameInput.value = name_7;
          nameInput.className = "sticker-name-input";
          nameInput.placeholder = "名称";
          nameInput.addEventListener("input", () => {
            const idx = pendingLocalStickers.findIndex(s => s.url === value_1512);
            idx !== -1 && (pendingLocalStickers[idx].name = nameInput.value || name_7);
          });
          previewContainer.appendChild(previewImg);
          previewContainer.appendChild(nameInput);
          stickerLocalPreview.appendChild(previewContainer);
        }
      } catch (error_7) {
        console.error("Failed to process sticker image", error_7);
        if (showToast_2) showToast_2("表情图片处理失败");
      }
    });
    stickerLocalUploadInput.value = "";
  }));
  async function readStickerManifestFile(file_4) {
    const fileName_2 = String(file_4?.name || "").toLowerCase();
    if (fileName_2.endsWith(".docx")) {
      await window.u2LoadVendorLibrary?.("mammoth");
      if (!window.mammoth?.extractRawText) throw new Error("DOCX 解析组件未加载");
      const result_4 = await window.mammoth.extractRawText({
        arrayBuffer: await file_4.arrayBuffer()
      });
      return String(result_4?.value || "");
    }
    return String(await file_4.text()).replace(/\u0000/g, "");
  }
  stickerManifestUploadBtn && stickerManifestUploadInput && (stickerManifestUploadBtn.addEventListener("click", () => stickerManifestUploadInput.click()), stickerManifestUploadInput.addEventListener("change", async () => {
    const file_5 = stickerManifestUploadInput.files?.[0];
    stickerManifestUploadInput.value = "";
    if (!file_5) return;
    const lowerName = String(file_5.name || "").toLowerCase();
    if (!lowerName.endsWith(".txt") && !lowerName.endsWith(".text") && !lowerName.endsWith(".docx")) {
      if (showToast_2) showToast_2("仅支持 TXT 和 DOCX 文件");
      return;
    }
    try {
      const text_7 = await readStickerManifestFile(file_5),
        parsed_2 = window.imDataUtils?.parseStickerManifestText ? window.imDataUtils.parseStickerManifestText(text_7) : {
          items: [],
          invalidLines: []
        };
      if (parsed_2.items.length === 0) {
        if (showToast_2) showToast_2("文件中没有有效的名称和 URL 记录");
        return;
      }
      const join_1528 = parsed_2.items.map(value_1529 => value_1529.name + " " + value_1529.url).join("\n");
      if (stickerUrlInput) {
        const existing_5 = stickerUrlInput.value.trim();
        stickerUrlInput.value = existing_5 ? existing_5 + "\n" + join_1528 : join_1528;
        stickerUrlInput.focus();
      }
      showToast_2 && showToast_2(parsed_2.invalidLines.length > 0 ? "已读取 " + parsed_2.items.length + " 条，第 " + parsed_2.invalidLines.join("、") + " 行格式无效" : "已读取 " + parsed_2.items.length + " 条贴图记录");
    } catch (error_8) {
      console.error("Failed to import sticker manifest", error_8);
      if (showToast_2) showToast_2(error_8?.message || "贴图清单读取失败");
    }
  }));
  confirmAddStickerBtn && confirmAddStickerBtn.addEventListener("click", async () => {
    const categoryName_15 = stickerCategoryNameInput ? stickerCategoryNameInput.value.trim() : "";
    if (!categoryName_15) {
      if (showToast_2) showToast_2("请输入分类名称");
      return;
    }
    const parsedManifest = window.imDataUtils?.parseStickerManifestText ? window.imDataUtils.parseStickerManifestText(stickerUrlInput?.value || "") : {
        items: [],
        invalidLines: []
      },
      items_1534 = parsedManifest.items;
    if (parsedManifest.invalidLines.length > 0) {
      if (showToast_2) showToast_2("第 " + parsedManifest.invalidLines.join("、") + " 行格式无效，请修改后重试");
      return;
    }
    const items_2 = [...pendingLocalStickers, ...items_1534];
    if (items_2.length === 0) {
      if (showToast_2) showToast_2("请添加至少一张表情");
      return;
    }
    const saved_22 = window.imApp.commitStickersChange ? await window.imApp.commitStickersChange(() => {
      if (!window.imData.stickers) window.imData.stickers = [];
      let result_1537 = window.imData.stickers.find(value_1538 => value_1538.categoryName === categoryName_15);
      result_1537 ? result_1537.items = Array.isArray(result_1537.items) ? result_1537.items.concat(items_2) : [...items_2] : window.imData.stickers.push({
        categoryName: categoryName_15,
        items: items_2
      });
    }, {
      silent: true
    }) : window.imApp.saveStickers ? await (async () => {
      if (!window.imData.stickers) window.imData.stickers = [];
      let result_1539 = window.imData.stickers.find(value_1540 => value_1540.categoryName === categoryName_15);
      return result_1539 ? result_1539.items = Array.isArray(result_1539.items) ? result_1539.items.concat(items_2) : [...items_2] : window.imData.stickers.push({
        categoryName: categoryName_15,
        items: items_2
      }), window.imApp.saveStickers({
        silent: true
      });
    })() : false;
    if (!saved_22) {
      if (showToast_2) showToast_2("表情包保存失败");
      return;
    }
    renderStickersView_2();
    closeAddStickerSheet();
    if (showToast_2) showToast_2("已添加 " + items_2.length + " 张表情到 \"" + categoryName_15 + "\"");
  });
  let batchDeleteMode = false,
    selectedStickers = new Set();
  stickersEditBtn && stickersEditBtn.addEventListener("click", () => {
    batchDeleteMode = !batchDeleteMode;
    selectedStickers.clear();
    stickersEditBtn.innerHTML = batchDeleteMode ? "<i class=\"fas fa-check\"></i>" : "<i class=\"fas fa-pen\"></i>";
    renderStickersView_2(batchDeleteMode);
  });
  function getStickerBindableFriends() {
    return (Array.isArray(window.imData.friends) ? window.imData.friends : []).filter(value_1541 => value_1541 && value_1541.id != null && value_1541.type !== "group" && value_1541.type !== "official");
  }
  function getStickerBoundFriends(categoryName_16) {
    return getStickerBindableFriends().filter(friend_27 => Array.isArray(friend_27.mountedStickers) && friend_27.mountedStickers.includes(categoryName_16));
  }
  function openStickerBindingDialog(categoryName_17) {
    const safeCategoryName = String(categoryName_17 || "").trim();
    if (!safeCategoryName) return;
    const chars = getStickerBindableFriends();
    if (chars.length === 0) {
      if (showToast_2) showToast_2("No chars available");
      return;
    }
    let overlay_2 = document.getElementById("sticker-bind-role-overlay");
    !overlay_2 && (overlay_2 = document.createElement("div"), overlay_2.id = "sticker-bind-role-overlay", overlay_2.style.cssText = "position:fixed; inset:0; z-index:10020; display:none; align-items:center; justify-content:center; background:rgba(0,0,0,0.24); padding:18px;", overlay_2.innerHTML = "\n                <div class=\"sticker-bind-role-card\" style=\"width:min(100%,360px); max-height:78vh; display:flex; flex-direction:column; background:#fff; border-radius:24px;  overflow:hidden;\">\n                    <div style=\"display:flex; align-items:center; justify-content:space-between; padding:16px 18px; border-bottom:1px solid #f2f2f7;\">\n                        <div style=\"min-width:0;\">\n                            <div style=\"font-size:17px; font-weight:800; color:#111;\">Bind Roles</div>\n                            <div class=\"sticker-bind-role-subtitle\" style=\"font-size:12px; color:#8e8e93; margin-top:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;\"></div>\n                        </div>\n                        <button type=\"button\" class=\"sticker-bind-role-close\" style=\"width:32px; height:32px; border:none; border-radius:50%; background:#f2f2f7; color:#636366; cursor:pointer;\"><i class=\"fas fa-times\"></i></button>\n                    </div>\n                    <div class=\"sticker-bind-role-list\" style=\"padding:8px; overflow-y:auto;\"></div>\n                    <div style=\"display:flex; gap:8px; padding:12px 14px 14px; border-top:1px solid #f2f2f7;\">\n                        <button type=\"button\" class=\"sticker-bind-role-cancel\" style=\"flex:1; height:42px; border:none; border-radius:16px; background:#f2f2f7; color:#555; font-size:15px; font-weight:700; cursor:pointer;\">Cancel</button>\n                        <button type=\"button\" class=\"sticker-bind-role-save\" style=\"flex:1; height:42px; border:none; border-radius:16px; background:#111; color:#fff; font-size:15px; font-weight:800; cursor:pointer;\">Save</button>\n                    </div>\n                </div>\n            ", document.body.appendChild(overlay_2), overlay_2.addEventListener("click", event_4 => {
      if (event_4.target === overlay_2) overlay_2.style.display = "none";
    }), overlay_2.querySelector(".sticker-bind-role-close")?.addEventListener("click", () => {
      overlay_2.style.display = "none";
    }), overlay_2.querySelector(".sticker-bind-role-cancel")?.addEventListener("click", () => {
      overlay_2.style.display = "none";
    }));
    const subtitle = overlay_2.querySelector(".sticker-bind-role-subtitle"),
      list = overlay_2.querySelector(".sticker-bind-role-list"),
      saveBtn = overlay_2.querySelector(".sticker-bind-role-save");
    if (subtitle) subtitle.textContent = safeCategoryName;
    if (!list || !saveBtn) return;
    list.innerHTML = "";
    chars.forEach(char_4 => {
      const selected_3 = Array.isArray(char_4.mountedStickers) && char_4.mountedStickers.includes(safeCategoryName),
        item_29 = document.createElement("label");
      item_29.style.cssText = "display:flex; align-items:center; gap:12px; padding:10px; border-radius:16px; cursor:pointer;";
      item_29.innerHTML = "\n                <input type=\"checkbox\" data-friend-id=\"" + char_4.id + "\" " + (selected_3 ? "checked" : "") + " style=\"width:18px; height:18px; accent-color:#111;\">\n                <div style=\"width:34px; height:34px; border-radius:50%; overflow:hidden; background:#f2f2f7; color:#8e8e93; display:flex; align-items:center; justify-content:center; flex-shrink:0;\">\n                    " + (char_4.avatarUrl ? "<img src=\"" + char_4.avatarUrl + "\" style=\"width:100%; height:100%; object-fit:cover;\">" : "<span>" + String(char_4.nickname || char_4.realName || "?").charAt(0) + "</span>") + "\n                </div>\n                <div style=\"min-width:0; flex:1; font-size:14px; color:#111; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;\">" + (char_4.nickname || char_4.realName || "Char") + "</div>\n            ";
      list.appendChild(item_29);
    });
    saveBtn.onclick = async () => {
      const checkedIds = new Set(Array.from(list.querySelectorAll("input[type=\"checkbox\"]:checked")).map(input => String(input.dataset.friendId))),
        map_1552 = chars.map(char_5 => String(char_5.id)),
        saved_23 = window.imApp.commitFriendsChange ? await window.imApp.commitFriendsChange(() => {
          chars.forEach(char_6 => {
            const shouldBind = checkedIds.has(String(char_6.id)),
              mounted = Array.isArray(char_6.mountedStickers) ? char_6.mountedStickers : [],
              nextMounted = mounted.filter(name_8 => name_8 !== safeCategoryName);
            if (shouldBind) nextMounted.push(safeCategoryName);
            char_6.mountedStickers = Array.from(new Set(nextMounted));
          });
        }, {
          silent: true,
          friendIds: map_1552,
          metaOnly: true
        }) : false;
      if (!saved_23) {
        if (showToast_2) showToast_2("Bind failed");
        return;
      }
      const activeFriend = window.imData.currentActiveFriend;
      if (activeFriend && map_1552.includes(String(activeFriend.id))) {
        const latestActive = (window.imData.friends || []).find(friend_28 => String(friend_28.id) === String(activeFriend.id));
        if (latestActive) window.imData.currentActiveFriend = latestActive;
      }
      const settingsFriend = window.imData.currentSettingsFriend;
      if (settingsFriend && map_1552.includes(String(settingsFriend.id))) {
        const latestSettings = (window.imData.friends || []).find(friend_29 => String(friend_29.id) === String(settingsFriend.id));
        if (latestSettings) window.imData.currentSettingsFriend = latestSettings;
      }
      overlay_2.style.display = "none";
      renderStickersView_2(true);
      window.dispatchEvent(new CustomEvent("u2:stickers-binding-changed", {
        detail: {
          categoryName: safeCategoryName,
          boundFriendIds: Array.from(checkedIds)
        }
      }));
      if (showToast_2) showToast_2("Bound");
    };
    overlay_2.style.display = "flex";
  }
  function handleAction_1420(keepBatchMode) {
    if (!stickersListContainer) return;
    stickersListContainer.innerHTML = "";
    if (!keepBatchMode) {
      batchDeleteMode = false;
      selectedStickers.clear();
      if (stickersEditBtn) stickersEditBtn.innerHTML = "<i class=\"fas fa-pen\"></i>";
    }
    const stickers_4 = window.imData.stickers || [];
    if (stickers_4.length === 0) {
      stickersListContainer.innerHTML = "<div style=\"text-align: center; color: #8e8e93; padding: 40px;\">No stickers yet. Tap + to add.</div>";
      return;
    }
    if (batchDeleteMode) {
      const batchBar = document.createElement("div");
      batchBar.id = "batch-delete-bar";
      batchBar.style.cssText = "position: sticky; top: 0; z-index: 50; display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; background: rgba(255,255,255,0.95);   border-radius: 16px; margin-bottom: 12px; ";
      const selectInfo = document.createElement("div");
      selectInfo.id = "batch-select-info";
      selectInfo.style.cssText = "font-size: 14px; color: #8e8e93; font-weight: 500;";
      selectInfo.textContent = "已选择 " + selectedStickers.size + " 项";
      const batchDeleteBtn = document.createElement("div");
      batchDeleteBtn.id = "batch-delete-toggle";
      batchDeleteBtn.style.cssText = "background: #ff3b30; color: #fff; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px;";
      batchDeleteBtn.innerHTML = "<i class=\"fas fa-trash\"></i> 删除所选";
      batchDeleteBtn.addEventListener("click", async () => {
        if (selectedStickers.size === 0) {
          if (showToast_2) showToast_2("请先选择要删除的表情");
          return;
        }
        const sort_1571 = Array.from(selectedStickers).sort((value_1574, value_1575) => {
            const [aCat, map_1577] = value_1574.split("-").map(Number),
              [bCat, map_1579] = value_1575.split("-").map(Number);
            if (aCat !== bCat) return bCat - aCat;
            return map_1579 - map_1577;
          }),
          length_1572 = sort_1571.length,
          value_1573 = window.imApp.commitStickersChange ? await window.imApp.commitStickersChange(() => {
            sort_1571.forEach(value_1580 => {
              const [map_1581, map_1582] = value_1580.split("-").map(Number);
              window.imData.stickers[map_1581]?.items?.[map_1582] && window.imData.stickers[map_1581].items.splice(map_1582, 1);
            });
            window.imData.stickers = (window.imData.stickers || []).filter(value_1583 => Array.isArray(value_1583.items) && value_1583.items.length > 0);
          }, {
            silent: true
          }) : window.imApp.saveStickers ? await (async () => {
            return sort_1571.forEach(value_1584 => {
              const [map_1585, map_1586] = value_1584.split("-").map(Number);
              window.imData.stickers[map_1585]?.items?.[map_1586] && window.imData.stickers[map_1585].items.splice(map_1586, 1);
            }), window.imData.stickers = (window.imData.stickers || []).filter(value_1587 => Array.isArray(value_1587.items) && value_1587.items.length > 0), window.imApp.saveStickers({
              silent: true
            });
          })() : false;
        if (!value_1573) {
          if (showToast_2) showToast_2("表情删除失败");
          return;
        }
        batchDeleteMode = false;
        selectedStickers.clear();
        if (stickersEditBtn) stickersEditBtn.innerHTML = "<i class=\"fas fa-pen\"></i>";
        renderStickersView_2();
        if (showToast_2) showToast_2("已删除 " + length_1572 + " 张表情");
      });
      batchBar.appendChild(selectInfo);
      batchBar.appendChild(batchDeleteBtn);
      stickersListContainer.appendChild(batchBar);
    }
    stickers_4.forEach((category, catIndex) => {
      const card = document.createElement("div");
      card.className = "sticker-category-card";
      card.style.cssText = "background: #fff; border: 1px solid #f2f2f7; border-radius: 14px; padding: 0; overflow: hidden;  display: flex; flex-direction: column; max-height: 350px; margin-bottom: 12px;";
      const header = document.createElement("div");
      header.className = "sticker-category-header";
      header.style.cssText = "display: flex; align-items: center; justify-content: space-between; gap: 8px; cursor: pointer; position: relative; min-height: 42px; padding: 7px 12px; flex-shrink: 0; border-bottom: 1px solid #f2f2f7;";
      const leftContainer = document.createElement("div");
      leftContainer.style.cssText = "display: flex; align-items: center; gap: 6px; min-width: 90px;";
      const bindBtn = document.createElement("button");
      bindBtn.type = "button";
      bindBtn.className = "sticker-category-bind";
      const boundCount = getStickerBoundFriends(category.categoryName).length;
      bindBtn.innerHTML = "<i class=\"fas fa-user-plus\"></i><span>" + (boundCount || "") + "</span>";
      bindBtn.title = "Bind roles";
      bindBtn.style.cssText = "height: 28px; min-width: 44px; border: none; border-radius: 14px; background: #f7f7fa; color: #111; display: inline-flex; align-items: center; justify-content: center; gap: 5px; padding: 0 9px; font-size: 12px; font-weight: 700; cursor: pointer;";
      bindBtn.addEventListener("click", e_16 => {
        e_16.stopPropagation();
        openStickerBindingDialog(category.categoryName);
      });
      leftContainer.appendChild(bindBtn);
      const title_6 = document.createElement("div");
      title_6.className = "sticker-category-title";
      title_6.textContent = category.categoryName;
      title_6.style.cssText = "position: absolute; left: 50%; transform: translateX(-50%); font-size: 14px; font-weight: 600; color: #000; white-space: nowrap; pointer-events: none;";
      const rightContainer = document.createElement("div");
      rightContainer.style.cssText = "display: flex; align-items: center; gap: 4px; margin-left: auto;";
      const deleteBtn = document.createElement("div");
      deleteBtn.className = "sticker-category-delete";
      deleteBtn.innerHTML = "<i class=\"fas fa-times\"></i>";
      deleteBtn.style.cssText = "color: #ff3b30; cursor: pointer; font-size: 13px; width: 28px; height: 28px; padding: 0; display: none; border-radius: 50%; align-items: center; justify-content: center; transition: background 0.2s;";
      deleteBtn.addEventListener("click", async event_1596 => {
        event_1596.stopPropagation();
        if (confirm("删除分类 \"" + category.categoryName + "\" ?")) {
          const value_1597 = window.imApp.commitStickersChange ? await window.imApp.commitStickersChange(() => {
            window.imData.stickers.splice(catIndex, 1);
          }, {
            silent: true
          }) : window.imApp.saveStickers ? await (async () => {
            return window.imData.stickers.splice(catIndex, 1), window.imApp.saveStickers({
              silent: true
            });
          })() : false;
          if (!value_1597) {
            if (showToast_2) showToast_2("分类删除失败");
            return;
          }
          renderStickersView_2();
          if (showToast_2) showToast_2("已删除分类 \"" + category.categoryName + "\"");
        }
      });
      const collapseIcon = document.createElement("div");
      collapseIcon.className = "sticker-category-collapse-icon";
      collapseIcon.style.cssText = "color: #8e8e93; font-size: 13px; transition: transform 0.3s; padding: 6px;";
      collapseIcon.innerHTML = "<i class=\"fas fa-chevron-down\"></i>";
      rightContainer.appendChild(deleteBtn);
      rightContainer.appendChild(collapseIcon);
      header.appendChild(leftContainer);
      header.appendChild(title_6);
      header.appendChild(rightContainer);
      const grid = document.createElement("div");
      grid.className = "sticker-grid";
      grid.style.overflowY = "auto";
      grid.style.flex = "1";
      grid.style.minHeight = "0";
      grid.style.padding = "12px 12px 12px 12px";
      grid.style.alignContent = "start";
      let isCollapsed = category.collapsed || false;
      isCollapsed ? (grid.style.display = "none", collapseIcon.querySelector("i").style.transform = "rotate(-90deg)", deleteBtn.style.display = "none") : deleteBtn.style.display = "flex";
      header.addEventListener("click", e_17 => {
        if (e_17.target.closest(".sticker-category-delete")) return;
        if (e_17.target.closest(".sticker-category-bind")) return;
        isCollapsed = !isCollapsed;
        category.collapsed = isCollapsed;
        grid.style.display = isCollapsed ? "none" : "grid";
        collapseIcon.querySelector("i").style.transform = isCollapsed ? "rotate(-90deg)" : "rotate(0deg)";
        deleteBtn.style.display = isCollapsed ? "none" : "flex";
      });
      category.items.forEach((value_1599, value_1600) => {
        const item_30 = document.createElement("div");
        item_30.className = "sticker-item";
        item_30.style.position = "relative";
        const element_1602 = document.createElement("img");
        element_1602.src = value_1599.url;
        element_1602.alt = value_1599.name;
        element_1602.title = value_1599.name;
        if (batchDeleteMode) {
          const checkbox = document.createElement("div");
          checkbox.className = "sticker-select-checkbox";
          checkbox.dataset.key = catIndex + "-" + value_1600;
          const has_1604 = selectedStickers.has(catIndex + "-" + value_1600);
          checkbox.style.cssText = "position: absolute; top: 4px; left: 4px; width: 22px; height: 22px; border-radius: 50%; background: " + (has_1604 ? "#007aff" : "rgba(255,255,255,0.9)") + "; border: 2px solid " + (has_1604 ? "#007aff" : "#ccc") + "; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #fff; cursor: pointer; z-index: 5; ";
          has_1604 && (checkbox.innerHTML = "<i class=\"fas fa-check\"></i>", item_30.style.outline = "2px solid #007aff", item_30.style.borderRadius = "8px");
          const toggleSelect = event_1606 => {
            if (event_1606) event_1606.stopPropagation();
            const value_1607 = catIndex + "-" + value_1600;
            selectedStickers.has(value_1607) ? (selectedStickers["delete"](value_1607), checkbox.innerHTML = "", checkbox.style.borderColor = "#ccc", checkbox.style.background = "rgba(255,255,255,0.9)", item_30.style.outline = "none") : (selectedStickers.add(value_1607), checkbox.innerHTML = "<i class=\"fas fa-check\"></i>", checkbox.style.borderColor = "#007aff", checkbox.style.background = "#007aff", item_30.style.outline = "2px solid #007aff");
            const batchSelectInfoElement = document.getElementById("batch-select-info");
            if (batchSelectInfoElement) batchSelectInfoElement.textContent = "已选择 " + selectedStickers.size + " 项";
          };
          checkbox.addEventListener("click", toggleSelect);
          item_30.addEventListener("click", () => toggleSelect());
          item_30.appendChild(checkbox);
        }
        item_30.appendChild(element_1602);
        if (!batchDeleteMode) {
          let pressTimer;
          item_30.addEventListener("touchstart", () => {
            pressTimer = setTimeout(() => {
              batchDeleteMode = true;
              selectedStickers.add(catIndex + "-" + value_1600);
              if (stickersEditBtn) stickersEditBtn.innerHTML = "<i class=\"fas fa-check\"></i>";
              renderStickersView_2(true);
            }, 800);
          });
          item_30.addEventListener("touchend", () => clearTimeout(pressTimer));
          item_30.addEventListener("touchmove", () => clearTimeout(pressTimer));
          item_30.addEventListener("contextmenu", event_1609 => {
            event_1609.preventDefault();
            batchDeleteMode = true;
            selectedStickers.add(catIndex + "-" + value_1600);
            if (stickersEditBtn) stickersEditBtn.innerHTML = "<i class=\"fas fa-check\"></i>";
            renderStickersView_2(true);
          });
        }
        grid.appendChild(item_30);
      });
      card.appendChild(header);
      card.appendChild(grid);
      stickersListContainer.appendChild(card);
    });
  }
  function getActiveStickerCategory() {
    return (window.imData.stickers || []).find(category_2 => category_2?.categoryName === activeStickerCategoryName) || null;
  }
  function renderStickerDetail() {
    if (!stickerDetailGrid) return;
    const category_3 = getActiveStickerCategory();
    if (!category_3) {
      if (stickerDetailSheet && window.closeView) window.closeView(stickerDetailSheet);
      activeStickerCategoryName = "";
      return;
    }
    const items_1612 = Array.isArray(category_3.items) ? category_3.items : [];
    if (stickerDetailTitle) stickerDetailTitle.textContent = category_3.categoryName || "表情包";
    if (stickerDetailCount) stickerDetailCount.textContent = items_1612.length + " 张 · 已绑定 " + getStickerBoundFriends(category_3.categoryName).length + " 位角色";
    if (stickerDetailBatchBar) stickerDetailBatchBar.hidden = !batchDeleteMode;
    const batchSelectInfoElement_1613 = document.getElementById("batch-select-info");
    if (batchSelectInfoElement_1613) batchSelectInfoElement_1613.textContent = "已选择 " + selectedStickers.size + " 项";
    if (stickersEditBtn) stickersEditBtn.innerHTML = batchDeleteMode ? "<i class=\"fas fa-check\"></i>" : "<i class=\"fas fa-pen\"></i>";
    stickerDetailGrid.innerHTML = "";
    items_1612.forEach((value_1614, stickerIndex) => {
      if (!value_1614?.url) return;
      const item_31 = document.createElement("button");
      item_31.type = "button";
      item_31.className = "sticker-item sticker-detail-item";
      item_31.title = value_1614.name || "Sticker " + (stickerIndex + 1);
      const element_1617 = document.createElement("img");
      element_1617.src = value_1614.url;
      element_1617.alt = value_1614.name || "";
      item_31.appendChild(element_1617);
      if (batchDeleteMode) {
        const selected_4 = selectedStickers.has(String(stickerIndex));
        item_31.classList.toggle("selected", selected_4);
        const checkbox_2 = document.createElement("span");
        checkbox_2.className = "sticker-select-checkbox";
        checkbox_2.innerHTML = selected_4 ? "<i class=\"fas fa-check\"></i>" : "";
        item_31.appendChild(checkbox_2);
        item_31.addEventListener("click", () => {
          const string_1620 = String(stickerIndex);
          if (selectedStickers.has(string_1620)) selectedStickers["delete"](string_1620);else selectedStickers.add(string_1620);
          renderStickerDetail();
        });
      }
      stickerDetailGrid.appendChild(item_31);
    });
    stickerDetailBindBtn && (stickerDetailBindBtn.onclick = () => openStickerBindingDialog(category_3.categoryName));
    stickerDetailDeleteCategoryBtn && (stickerDetailDeleteCategoryBtn.onclick = async () => {
      if (!confirm("删除分类 \"" + category_3.categoryName + "\" ?")) return;
      const saved_24 = await window.imApp.commitStickersChange(() => {
        window.imData.stickers = (window.imData.stickers || []).filter(item_32 => item_32 !== category_3);
      }, {
        silent: true
      });
      if (!saved_24) {
        if (showToast_2) showToast_2("分类删除失败");
        return;
      }
      activeStickerCategoryName = "";
      batchDeleteMode = false;
      selectedStickers.clear();
      if (stickerDetailSheet && window.closeView) window.closeView(stickerDetailSheet);
      renderStickersView_2();
      if (showToast_2) showToast_2("已删除分类 \"" + category_3.categoryName + "\"");
    });
  }
  function openStickerCategoryDetail(categoryName_18) {
    activeStickerCategoryName = String(categoryName_18 || "");
    batchDeleteMode = false;
    selectedStickers.clear();
    renderStickerDetail();
    if (stickerDetailSheet && window.openView) window.openView(stickerDetailSheet);
  }
  function renderStickersView_2(value_1624) {
    if (!stickersListContainer) return;
    !value_1624 && (batchDeleteMode = false, selectedStickers.clear());
    stickersListContainer.innerHTML = "";
    const stickers_5 = Array.isArray(window.imData.stickers) ? window.imData.stickers : [];
    if (stickers_5.length === 0) {
      stickersListContainer.innerHTML = "<div class=\"stickers-empty-state\"><i class=\"far fa-face-smile\"></i><strong>还没有表情包</strong><span>点击右上角添加第一个分组</span></div>";
      return;
    }
    stickers_5.forEach(category_4 => {
      if (!category_4) return;
      const items_3 = Array.isArray(category_4.items) ? category_4.items : [],
        card_2 = document.createElement("button");
      card_2.type = "button";
      card_2.className = "sticker-group-card";
      const preview = document.createElement("span");
      preview.className = "sticker-group-preview";
      items_3.slice(0, 4).forEach(sticker => {
        const cell = document.createElement("span");
        cell.className = "sticker-group-preview-cell";
        if (sticker?.url) {
          const image = document.createElement("img");
          image.src = sticker.url;
          image.alt = sticker.name || "";
          cell.appendChild(image);
        }
        preview.appendChild(cell);
      });
      while (preview.children.length < 4) {
        const cell_2 = document.createElement("span");
        cell_2.className = "sticker-group-preview-cell empty";
        preview.appendChild(cell_2);
      }
      const copy = document.createElement("span");
      copy.className = "sticker-group-copy";
      const title_7 = document.createElement("strong");
      title_7.textContent = category_4.categoryName || "未命名分组";
      const element_1631 = document.createElement("span");
      element_1631.textContent = items_3.length + " 张 · " + getStickerBoundFriends(category_4.categoryName).length + " 位角色";
      copy.appendChild(title_7);
      copy.appendChild(element_1631);
      card_2.appendChild(preview);
      card_2.appendChild(copy);
      card_2.addEventListener("click", () => openStickerCategoryDetail(category_4.categoryName));
      stickersListContainer.appendChild(card_2);
    });
    if (activeStickerCategoryName && getActiveStickerCategory()) renderStickerDetail();
  }
  stickerBatchDeleteBtn && stickerBatchDeleteBtn.addEventListener("click", async () => {
    const category_5 = getActiveStickerCategory();
    if (!category_5 || selectedStickers.size === 0) {
      if (showToast_2) showToast_2("请先选择要删除的表情");
      return;
    }
    const selectedIndexes = Array.from(selectedStickers).map(Number).sort((a_3, b_3) => b_3 - a_3),
      saved_25 = await window.imApp.commitStickersChange(() => {
        selectedIndexes.forEach(index_11 => category_5.items.splice(index_11, 1));
        window.imData.stickers = (window.imData.stickers || []).filter(item_33 => Array.isArray(item_33.items) && item_33.items.length > 0);
      }, {
        silent: true
      });
    if (!saved_25) {
      if (showToast_2) showToast_2("表情删除失败");
      return;
    }
    batchDeleteMode = false;
    selectedStickers.clear();
    if (!getActiveStickerCategory()) {
      activeStickerCategoryName = "";
      if (stickerDetailSheet && window.closeView) window.closeView(stickerDetailSheet);
    }
    renderStickersView_2();
    if (showToast_2) showToast_2("已删除 " + selectedIndexes.length + " 张表情");
  });
  stickerDetailSheet && stickerDetailSheet.addEventListener("click", event_5 => {
    if (event_5.target !== stickerDetailSheet) return;
    batchDeleteMode = false;
    selectedStickers.clear();
    if (window.closeView) window.closeView(stickerDetailSheet);
  });
  window.imApp.renderStickersView = renderStickersView_2;
  const groupsToggle = document.getElementById("groups-toggle");
  groupsToggle && groupsToggle.addEventListener("click", () => {
    groupsToggle.parentElement.classList.toggle("collapsed");
  });
  const friendsToggle = document.getElementById("friends-toggle");
  friendsToggle && friendsToggle.addEventListener("click", () => {
    friendsToggle.parentElement.classList.toggle("collapsed");
  });
  const npcsToggle = document.getElementById("npcs-toggle");
  npcsToggle && npcsToggle.addEventListener("click", () => {
    npcsToggle.parentElement.classList.toggle("collapsed");
  });
  const navHomeBtn = document.getElementById("nav-home-btn"),
    navChatsBtn = document.getElementById("nav-chats-btn"),
    navMomentsBtn = document.getElementById("nav-moments-btn"),
    lineNavIndicator = document.getElementById("line-nav-indicator"),
    imBottomNavContainer = document.querySelector(".line-bottom-nav-container"),
    imContent = document.querySelector(".line-content"),
    chatsContent = document.getElementById("chats-content"),
    memoryLocationSheet = document.getElementById("memory-location-sheet"),
    memoryLocationSheetContent = document.getElementById("memory-location-sheet-content"),
    memorySocialCloseElement = document.getElementById("memory-social-close");
  let value_1422 = null;
  const value_1423 = () => {
    if (!memoryLocationSheet?.classList.contains("memory-social-centered")) return;
    if (window.closeView) window.closeView(memoryLocationSheet);
    if (value_1422?.isConnected) value_1422.focus({
      preventScroll: true
    });
    value_1422 = null;
  };
  memorySocialCloseElement?.addEventListener("click", value_1423);
  memoryLocationSheet?.addEventListener("click", event_1640 => {
    if (event_1640.target === memoryLocationSheet) value_1423();
  });
  document.addEventListener("keydown", value_1641 => {
    if (value_1641.key === "Escape" && memoryLocationSheet?.classList.contains("active")) value_1423();
  });
  const memoryEntryDetailModal = document.getElementById("memory-entry-detail-modal"),
    scheduleModal = document.getElementById("chat-memory-schedule-modal"),
    scheduleClose = document.getElementById("chat-memory-schedule-close"),
    scheduleAddModal = document.getElementById("chat-memory-schedule-add-modal"),
    memoryEntryDetailTitle = document.getElementById("memory-entry-detail-title"),
    memoryEntryDetailBody = document.getElementById("memory-entry-detail-body"),
    memoryEntryDetailClose = document.getElementById("memory-entry-detail-close"),
    memoryEntryEditorModal = document.getElementById("memory-entry-editor-modal"),
    memoryEntryEditorTitle = document.getElementById("memory-entry-editor-title"),
    memoryEntryEditorKind = document.getElementById("memory-entry-editor-kind"),
    memoryEntryEditorId = document.getElementById("memory-entry-editor-id"),
    memoryEntryEditorCollection = document.getElementById("memory-entry-editor-collection"),
    memoryEntryEditorTitleInput = document.getElementById("memory-entry-editor-title-input"),
    memoryEntryEditorTimeInput = document.getElementById("memory-entry-editor-time-input"),
    memoryEntryEditorContentInput = document.getElementById("memory-entry-editor-content-input"),
    memoryEntryEditorContentLabel = document.getElementById("memory-entry-editor-content-label"),
    memoryEntryEditorTagsInput = document.getElementById("memory-entry-editor-tags-input"),
    memoryEntryEditorDegreeRow = document.getElementById("memory-entry-editor-degree-row"),
    memoryEntryEditorDegreeSelect = document.getElementById("memory-entry-editor-degree-select"),
    memoryEntryEditorClose = document.getElementById("memory-entry-editor-close"),
    memoryEntryEditorCancel = document.getElementById("memory-entry-editor-cancel"),
    memoryEntryEditorSave = document.getElementById("memory-entry-editor-save"),
    memoryPromotionPreviewModal = document.getElementById("memory-promotion-preview-modal"),
    memoryPromotionPreviewClose = document.getElementById("memory-promotion-preview-close"),
    memoryPromotionPreviewCancel = document.getElementById("memory-promotion-preview-cancel"),
    memoryPromotionPreviewConfirm = document.getElementById("memory-promotion-preview-confirm"),
    memoryPromotionTitleInput = document.getElementById("memory-promotion-title-input"),
    memoryPromotionTimeInput = document.getElementById("memory-promotion-time-input"),
    memoryPromotionContentInput = document.getElementById("memory-promotion-content-input"),
    memoryPromotionTagsInput = document.getElementById("memory-promotion-tags-input"),
    momentsContent = document.getElementById("moments-content");
  let currentMemoryFriendId = null,
    currentMemoryLocation = "iphone",
    scheduleEditorEventId = null,
    pendingMemoryPromotion = null;
  function updateLineNavIndicator(activeItem) {
    if (!activeItem || !lineNavIndicator) return;
    const containerRect = activeItem.parentElement.getBoundingClientRect(),
      itemRect = activeItem.getBoundingClientRect(),
      relativeLeft = itemRect.left - containerRect.left;
    lineNavIndicator.style.width = itemRect.width + "px";
    lineNavIndicator.style.left = relativeLeft + "px";
  }
  setTimeout(() => {
    if (navHomeBtn && navHomeBtn.classList.contains("active")) updateLineNavIndicator(navHomeBtn);
  }, 100);
  function getMemoryFriends() {
    const items_1645 = Array.isArray(window.imData?.friends) ? window.imData.friends : [];
    return items_1645.filter(value_1646 => value_1646 && value_1646.type !== "group" && value_1646.type !== "npc" && value_1646.type !== "official");
  }
  function escapeMemoryHtml(value_47) {
    return String(value_47 == null ? "" : value_47).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function setMemoryFriendSelection(friend_30) {
    if (!friend_30) return;
    currentMemoryFriendId = friend_30.id;
  }
  function renderMemoryView_2() {
    memoryLocationSheetContent && memoryLocationSheetContent.innerHTML !== "" && renderMemoryLocationSheet(currentMemoryLocation || "iphone");
  }
  function renderScheduleModal() {
    const toMinutes = value_48 => {
        const match_2 = /^(\d{2}):(\d{2})$/.exec(String(value_48 || "").trim());
        if (!match_2) return -1;
        const hours_3 = Number(match_2[1]),
          minutes_3 = Number(match_2[2]);
        return hours_3 >= 0 && hours_3 < 24 && minutes_3 >= 0 && minutes_3 < 60 ? hours_3 * 60 + minutes_3 : -1;
      },
      toLocalInputValue = (value_49, fallback_4 = "") => {
        const normalized = String(value_49 || "").trim();
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(normalized)) return normalized;
        return fallback_4;
      },
      value_1651 = () => {
        const value_1663 = new Date();
        value_1663.setMinutes(value_1663.getMinutes() - value_1663.getTimezoneOffset());
        const value_1664 = new Date(Date.now() + 3600000);
        return value_1664.setMinutes(value_1664.getMinutes() - value_1664.getTimezoneOffset()), {
          start: value_1663.toISOString().slice(0, 16),
          end: value_1664.toISOString().slice(0, 16)
        };
      },
      friend_31 = getCurrentMemoryFriend_2();
    if (!friend_31) return;
    const normalizedFriend_11 = window.imApp.normalizeFriendData ? window.imApp.normalizeFriendData(friend_31) : friend_31;
    friend_31.memory = normalizedFriend_11.memory || friend_31.memory || window.imApp.createDefaultMemory?.() || {};
    !friend_31.memory.schedule && (friend_31.memory.schedule = window.imApp.createDefaultMemory?.().schedule || {
      enabled: false,
      sleepTime: "23:00",
      wakeTime: "07:00",
      events: []
    });
    const enabledToggle = document.getElementById("chat-memory-schedule-enabled-toggle"),
      sleepText = document.getElementById("chat-memory-schedule-sleep-text"),
      wakeText = document.getElementById("chat-memory-schedule-wake-text"),
      sleepPicker = document.getElementById("chat-memory-schedule-sleep-picker"),
      wakePicker = document.getElementById("chat-memory-schedule-wake-picker"),
      timeline = document.getElementById("chat-memory-schedule-timeline"),
      addScheduleBtn = document.getElementById("chat-memory-schedule-add-btn"),
      generateScheduleBtn = document.getElementById("chat-memory-schedule-generate-btn"),
      editorTitle = document.getElementById("chat-memory-schedule-editor-title"),
      eventNameInput = document.getElementById("chat-memory-schedule-add-name"),
      recurrenceInput = document.getElementById("chat-memory-schedule-add-recurrence"),
      dailyFields = document.getElementById("chat-memory-schedule-daily-fields"),
      onceFields = document.getElementById("chat-memory-schedule-once-fields"),
      dailyStartInput = document.getElementById("chat-memory-schedule-add-daily-start"),
      dailyEndInput = document.getElementById("chat-memory-schedule-add-daily-end"),
      onceStartInput = document.getElementById("chat-memory-schedule-add-start"),
      onceEndInput = document.getElementById("chat-memory-schedule-add-end"),
      confirmAddBtn = document.getElementById("chat-memory-schedule-add-confirm-btn"),
      deleteScheduleBtn = document.getElementById("chat-memory-schedule-delete-btn"),
      schedule_3 = friend_31.memory.schedule,
      applyScheduleEditorRecurrence = recurrence_2 => {
        const isDaily = recurrence_2 !== "once";
        if (recurrenceInput) recurrenceInput.value = isDaily ? "daily" : "once";
        if (dailyFields) dailyFields.hidden = !isDaily;
        if (onceFields) onceFields.hidden = isDaily;
      },
      openScheduleEditor = (event_6 = null) => {
        scheduleEditorEventId = event_6 ? String(event_6.id) : null;
        const recurrence_3 = event_6?.recurrence === "once" ? "once" : "daily",
          defaults_2 = value_1651();
        if (editorTitle) editorTitle.textContent = event_6 ? "编辑行程" : "添加行程";
        if (eventNameInput) eventNameInput.value = event_6?.name || event_6?.title || "";
        applyScheduleEditorRecurrence(recurrence_3);
        if (dailyStartInput) dailyStartInput.value = event_6?.startTime || "09:00";
        if (dailyEndInput) dailyEndInput.value = event_6?.endTime || "10:00";
        if (onceStartInput) onceStartInput.value = toLocalInputValue(event_6?.rawTime, defaults_2.start);
        if (onceEndInput) onceEndInput.value = toLocalInputValue(event_6?.endAt, defaults_2.end);
        if (deleteScheduleBtn) deleteScheduleBtn.hidden = !event_6;
        if (scheduleAddModal && window.openView) window.openView(scheduleAddModal);
      };
    enabledToggle && (enabledToggle.checked = !!schedule_3.enabled, enabledToggle.onchange = async e_18 => {
      await window.imApp.commitScopedFriendChange(friend_31, f => {
        if (!f.memory.schedule) f.memory.schedule = {};
        f.memory.schedule.enabled = e_18.target.checked;
      }, {
        silent: true
      });
      renderScheduleModal();
    });
    if (generateScheduleBtn) {
      const isDirectCharacter = friend_31.type !== "group";
      generateScheduleBtn.hidden = !isDirectCharacter;
      generateScheduleBtn.onclick = async () => {
        if (!isDirectCharacter || !window.imChat?.generateScheduleForFriend) {
          if (window.showToast) window.showToast("仅单个角色可生成日程");
          return;
        }
        const textContent_5 = generateScheduleBtn.textContent;
        generateScheduleBtn.disabled = true;
        generateScheduleBtn.textContent = "生成中...";
        try {
          const result_5 = await window.imChat.generateScheduleForFriend(friend_31);
          !result_5?.success && window.showToast && window.showToast(result_5?.error || "日程生成失败，请稍后重试");
        } finally {
          generateScheduleBtn.disabled = false;
          generateScheduleBtn.textContent = textContent_5;
          renderScheduleModal();
        }
      };
    }
    recurrenceInput && (recurrenceInput.onchange = () => applyScheduleEditorRecurrence(recurrenceInput.value));
    addScheduleBtn && (addScheduleBtn.onclick = () => openScheduleEditor());
    confirmAddBtn && (confirmAddBtn.onclick = async () => {
      const value_1673 = eventNameInput ? eventNameInput.value.trim() : "",
        recurrence_4 = recurrenceInput?.value === "once" ? "once" : "daily",
        existingEvent = Array.isArray(schedule_3.events) ? schedule_3.events.find(item_34 => String(item_34.id) === String(scheduleEditorEventId)) : null;
      if (!value_1673) {
        if (window.showToast) window.showToast("请输入行程名称");
        return;
      }
      let eventData;
      if (recurrence_4 === "daily") {
        const startTime_2 = dailyStartInput?.value || "",
          endTime_2 = dailyEndInput?.value || "";
        if (toMinutes(startTime_2) < 0 || toMinutes(endTime_2) < 0) {
          if (window.showToast) window.showToast("请输入有效的开始和结束时间");
          return;
        }
        if (toMinutes(endTime_2) <= toMinutes(startTime_2)) {
          if (window.showToast) window.showToast("每天重复的结束时间必须晚于开始时间");
          return;
        }
        eventData = {
          id: existingEvent?.id ?? "schedule-" + Date.now(),
          name: value_1673,
          title: value_1673,
          startTime: startTime_2,
          endTime: endTime_2,
          recurrence: "daily",
          source: existingEvent?.source === "generated" ? "manual" : existingEvent?.source || "manual",
          timestamp: existingEvent?.timestamp || Date.now()
        };
      } else {
        const rawTime_2 = onceStartInput?.value || "",
          endAt_2 = onceEndInput?.value || "";
        if (!rawTime_2 || !endAt_2 || new Date(rawTime_2) >= new Date(endAt_2)) {
          if (window.showToast) window.showToast("结束时间必须晚于开始时间");
          return;
        }
        const startDate_5 = new Date(rawTime_2),
          startDate_6 = new Date(endAt_2);
        eventData = {
          id: existingEvent?.id ?? "schedule-" + Date.now(),
          name: value_1673,
          title: value_1673,
          date: startDate_5.getFullYear() + "-" + String(startDate_5.getMonth() + 1).padStart(2, "0") + "-" + String(startDate_5.getDate()).padStart(2, "0"),
          startTime: String(startDate_5.getHours()).padStart(2, "0") + ":" + String(startDate_5.getMinutes()).padStart(2, "0"),
          endTime: String(startDate_6.getHours()).padStart(2, "0") + ":" + String(startDate_6.getMinutes()).padStart(2, "0"),
          rawTime: rawTime_2,
          endAt: endAt_2,
          recurrence: "once",
          source: existingEvent?.source === "generated" ? "manual" : existingEvent?.source || "manual",
          timestamp: existingEvent?.timestamp || Date.now()
        };
      }
      await window.imApp.commitScopedFriendChange(friend_31, targetFriend_15 => {
        targetFriend_15.memory = targetFriend_15.memory || window.imApp.createDefaultMemory();
        const currentSchedule_2 = targetFriend_15.memory.schedule || window.imApp.createDefaultMemory().schedule,
          events_2 = Array.isArray(currentSchedule_2.events) ? currentSchedule_2.events.slice() : [],
          existingIndex = events_2.findIndex(item_35 => String(item_35?.id) === String(scheduleEditorEventId));
        if (existingIndex >= 0) events_2.splice(existingIndex, 1, eventData);else events_2.push(eventData);
        targetFriend_15.memory.schedule = window.imDataUtils?.normalizeSchedule ? window.imDataUtils.normalizeSchedule({
          ...currentSchedule_2,
          events: events_2
        }) : {
          ...currentSchedule_2,
          events: events_2
        };
      }, {
        silent: true
      });
      scheduleEditorEventId = null;
      if (scheduleAddModal && window.closeView) window.closeView(scheduleAddModal);
      renderScheduleModal();
    });
    deleteScheduleBtn && (deleteScheduleBtn.onclick = () => {
      const eventId = scheduleEditorEventId;
      if (eventId == null) return;
      const onConfirm_2 = async () => {
        await window.imApp.commitScopedFriendChange(friend_31, targetFriend_16 => {
          const currentSchedule = targetFriend_16.memory?.schedule || window.imApp.createDefaultMemory().schedule;
          targetFriend_16.memory = targetFriend_16.memory || window.imApp.createDefaultMemory();
          targetFriend_16.memory.schedule = window.imDataUtils?.normalizeSchedule ? window.imDataUtils.normalizeSchedule({
            ...currentSchedule,
            events: (currentSchedule.events || []).filter(item_36 => String(item_36?.id) !== String(eventId))
          }) : {
            ...currentSchedule,
            events: (currentSchedule.events || []).filter(item_37 => String(item_37?.id) !== String(eventId))
          };
        }, {
          silent: true
        });
        scheduleEditorEventId = null;
        if (scheduleAddModal && window.closeView) window.closeView(scheduleAddModal);
        renderScheduleModal();
      };
      window.imApp.showCustomModal ? window.imApp.showCustomModal({
        title: "删除行程",
        message: "确定删除这条行程吗？",
        isDestructive: true,
        confirmText: "删除",
        onConfirm: onConfirm_2
      }) : void onConfirm_2();
    });
    sleepText && sleepPicker && (sleepText.textContent = schedule_3.sleepTime || "23:00", sleepPicker.value = schedule_3.sleepTime || "23:00", sleepPicker.onchange = async e_19 => {
      sleepText.textContent = e_19.target.value;
      await window.imApp.commitScopedFriendChange(friend_31, f_2 => {
        if (!f_2.memory.schedule) f_2.memory.schedule = {};
        f_2.memory.schedule.sleepTime = e_19.target.value;
      }, {
        silent: true
      });
      renderScheduleModal();
    });
    wakeText && wakePicker && (wakeText.textContent = schedule_3.wakeTime || "07:00", wakePicker.value = schedule_3.wakeTime || "07:00", wakePicker.onchange = async e_20 => {
      wakeText.textContent = e_20.target.value;
      await window.imApp.commitScopedFriendChange(friend_31, f_3 => {
        if (!f_3.memory.schedule) f_3.memory.schedule = {};
        f_3.memory.schedule.wakeTime = e_20.target.value;
      }, {
        silent: true
      });
      renderScheduleModal();
    });
    if (timeline) {
      const value_1697 = schedule_3.wakeTime || "07:00",
        value_1698 = schedule_3.sleepTime || "23:00",
        events_3 = Array.isArray(schedule_3.events) ? schedule_3.events : [];
      let innerHTML_2 = "<div style=\"position: absolute; left: 24px; top: 10px; bottom: 10px; width: 2px; background: #e5e5ea; z-index: 1;\"></div>";
      innerHTML_2 += "\n                <div style=\"position: relative; z-index: 2; display: flex; align-items: flex-start;\">\n                    <div style=\"width: 10px; height: 10px; border-radius: 50%; background: #007aff; margin-right: 15px; margin-top: 5px;  flex-shrink: 0;\"></div>\n                    <div>\n                        <div style=\"font-size: 16px; font-weight: 600; color: #111;\">起床</div>\n                        <div style=\"font-size: 13px; color: #8e8e93; margin-top: 2px;\">" + value_1697 + " - 开启新的一天</div>\n                    </div>\n                </div>\n            ";
      events_3.forEach(evt => {
        innerHTML_2 += "\n                    <div style=\"position: relative; z-index: 2; display: flex; align-items: flex-start;\">\n                        <div style=\"width: 10px; height: 10px; border-radius: 50%; background: #8e8e93; margin-right: 15px; margin-top: 15px;  flex-shrink: 0;\"></div>\n                        <div class=\"schedule-event-card\" data-event-id=\"" + evt.id + "\" style=\"background: #f2f2f7; border-radius: 16px; padding: 12px 16px; flex: 1; cursor: pointer; \">\n                            <div style=\"font-size: 15px; font-weight: 600; color: #111;\">" + escapeMemoryHtml(evt.name || evt.title || "未命名行程") + "</div>\n                            <div style=\"font-size: 13px; color: #8e8e93; margin-top: 4px;\">" + escapeMemoryHtml(evt.time || ((evt.date || "") + " " + (evt.startTime || "")).trim()) + "</div>\n                        </div>\n                    </div>\n                ";
      });
      innerHTML_2 += "\n                <div style=\"position: relative; z-index: 2; display: flex; align-items: flex-start;\">\n                    <div style=\"width: 10px; height: 10px; border-radius: 50%; background: #5856d6; margin-right: 15px; margin-top: 5px;  flex-shrink: 0;\"></div>\n                    <div>\n                        <div style=\"font-size: 16px; font-weight: 600; color: #111;\">睡觉</div>\n                        <div style=\"font-size: 13px; color: #8e8e93; margin-top: 2px;\">" + value_1698 + " - 休息时间到了</div>\n                    </div>\n                </div>\n            ";
      timeline.innerHTML = innerHTML_2;
      const eventCards = timeline.querySelectorAll(".schedule-event-card");
      eventCards.forEach(card_3 => {
        card_3.addEventListener("click", () => {
          const eventId_2 = card_3.getAttribute("data-event-id"),
            result_1703 = events_3.find(value_1704 => String(value_1704.id) === String(eventId_2));
          if (result_1703) openScheduleEditor(result_1703);
        });
      });
    }
  }
  function getCurrentMemoryFriend_2() {
    const value_1705 = Array.isArray(window.imData?.friends) ? window.imData.friends : [],
      selected_5 = value_1705.find(value_1707 => String(value_1707.id) === String(currentMemoryFriendId));
    if (selected_5) return selected_5;
    return getMemoryFriends()[0] || null;
  }
  function formatManualMemoryTime(startDate_7 = new Date()) {
    const value_1709 = value_1710 => String(value_1710).padStart(2, "0");
    return startDate_7.getFullYear() + "年" + value_1709(startDate_7.getMonth() + 1) + "月" + value_1709(startDate_7.getDate()) + "日 " + value_1709(startDate_7.getHours()) + ":" + value_1709(startDate_7.getMinutes());
  }
  function handleAction_1428(value_52) {
    if (window.imChat?.normalizeMemoryTriggerKeywords) return window.imChat.normalizeMemoryTriggerKeywords(value_52);
    return String(value_52 || "").split(/[,，、；;\n|/]+/).map(tag => tag.trim()).filter(Boolean).slice(0, 12);
  }
  function getMemoryEntryCollection(friend_32, collection_2) {
    const memory_5 = friend_32?.memory || {};
    return Array.isArray(memory_5[collection_2]) ? memory_5[collection_2] : [];
  }
  function findMemoryEntry(friend_33, collection_3, entryId_2) {
    return getMemoryEntryCollection(friend_33, collection_3).find(entry_16 => String(entry_16?.id) === String(entryId_2)) || null;
  }
  function closeMemoryEntryEditor() {
    if (memoryEntryEditorModal && window.closeView) window.closeView(memoryEntryEditorModal);
  }
  function normalizeMemoryRecallLimit(value_54, fallback_5 = 30) {
    const numeric_2 = Math.round(Number(value_54));
    return Number.isFinite(numeric_2) && numeric_2 > 0 ? Math.min(100, Math.max(1, numeric_2)) : fallback_5;
  }
  async function saveMemoryRecallLimit(kind_2, value_1724) {
    const friend_34 = getCurrentMemoryFriend_2();
    if (!friend_34) return false;
    const normalizedFriend_12 = window.imApp.normalizeFriendData(friend_34),
      fallback_6 = normalizedFriend_12.memory?.recallLimits?.[kind_2] || 30,
      limit_4 = normalizeMemoryRecallLimit(value_1724, fallback_6),
      saved_26 = await window.imApp.commitScopedFriendChange(friend_34, targetFriend_17 => {
        targetFriend_17.memory = window.imApp.normalizeFriendData(targetFriend_17).memory;
        targetFriend_17.memory.recallLimits = window.imApp.normalizeMemoryRecallLimits({
          ...targetFriend_17.memory.recallLimits,
          [kind_2]: limit_4
        });
        targetFriend_17.memory.recallPresentation = null;
        window.imApp.clearFriendRuntimeMessageContext?.(targetFriend_17);
      }, {
        silent: true,
        immediate: true,
        syncActive: true,
        syncSettings: true
      });
    if (!saved_26) {
      if (window.showToast) window.showToast("读取条数保存失败");
      return false;
    }
    return window.dispatchEvent(new CustomEvent("u2:memory-entries-updated", {
      detail: {
        friendId: String(friend_34.id),
        action: "recall-limit",
        kind: kind_2,
        limit: limit_4
      }
    })), renderMemoryLocationSheet(currentMemoryLocation), true;
  }
  function closeMemoryPromotionPreview() {
    pendingMemoryPromotion = null;
    if (memoryPromotionPreviewModal && window.closeView) window.closeView(memoryPromotionPreviewModal);
  }
  function openMemoryPromotionPreview(friend_35, selectedIds_3, draft) {
    if (!memoryPromotionPreviewModal) return;
    pendingMemoryPromotion = {
      friendId: String(friend_35.id),
      selectedIds: selectedIds_3.map(String)
    };
    if (memoryPromotionTitleInput) memoryPromotionTitleInput.value = draft.title || "";
    if (memoryPromotionTimeInput) memoryPromotionTimeInput.value = draft.time || "";
    if (memoryPromotionContentInput) memoryPromotionContentInput.value = draft.content || "";
    if (memoryPromotionTagsInput) memoryPromotionTagsInput.value = (draft.triggerKeywords || []).join("，");
    if (window.openView) window.openView(memoryPromotionPreviewModal);
  }
  async function handleAction_1429() {
    const pending = pendingMemoryPromotion;
    if (!pending) return false;
    const friend_36 = window.imApp.getFriendById?.(pending.friendId) || getCurrentMemoryFriend_2(),
      title_8 = String(memoryPromotionTitleInput?.value || "").trim(),
      content_4 = String(memoryPromotionContentInput?.value || "").trim(),
      time_3 = String(memoryPromotionTimeInput?.value || "").trim(),
      triggerKeywords_3 = handleAction_1428(memoryPromotionTagsInput?.value || "");
    if (!title_8 || !content_4 || triggerKeywords_3.length === 0) {
      if (window.showToast) window.showToast("请填写标题、内容和至少一个召回标签");
      return false;
    }
    if (!friend_36 || !window.imApp.commitShortTermMemoryPromotion) return false;
    memoryPromotionPreviewConfirm && (memoryPromotionPreviewConfirm.disabled = true, memoryPromotionPreviewConfirm.textContent = "保存中...");
    try {
      const result_6 = await window.imApp.commitShortTermMemoryPromotion(friend_36, {
        title: title_8,
        content: content_4,
        time: time_3,
        triggerKeywords: triggerKeywords_3
      }, pending.selectedIds);
      if (!result_6) {
        if (window.showToast) window.showToast("长期记忆保存失败，短期记忆未删除");
        return false;
      }
      closeMemoryPromotionPreview();
      renderMemoryLocationSheet("iphone");
      renderMemoryView_2();
      if (window.showToast) window.showToast("已归纳为长期记忆");
      return true;
    } finally {
      memoryPromotionPreviewConfirm && (memoryPromotionPreviewConfirm.disabled = false, memoryPromotionPreviewConfirm.textContent = "确认归纳并删除原短期记忆");
    }
  }
  async function generateMemoryPromotion(friend_37, selectedIds_4) {
    const entries_3 = (Array.isArray(friend_37?.memory?.shortTermEntries) ? friend_37.memory.shortTermEntries : []).filter(entry_17 => selectedIds_4.includes(String(entry_17?.id || "")));
    if (entries_3.length === 0 || entries_3.length !== selectedIds_4.length) {
      if (window.showToast) window.showToast("所选短期记忆已变更，请重新选择");
      renderMemoryLocationSheet("iphone");
      return;
    }
    if (!window.imApp.generateShortTermMemoryPromotionDraft) {
      if (window.showToast) window.showToast("归纳功能尚未初始化");
      return;
    }
    try {
      if (window.showToast) window.showToast("正在归纳长期记忆...");
      const draft_3 = await window.imApp.generateShortTermMemoryPromotionDraft(friend_37, entries_3);
      openMemoryPromotionPreview(friend_37, selectedIds_4, draft_3);
    } catch (error_9) {
      console.error("Short-term memory promotion failed", error_9);
      const message_30 = error_9?.summaryFailure?.message || error_9?.message || "归纳失败，请检查 API 配置";
      if (window.showToast) window.showToast("归纳失败：" + message_30);
    }
  }
  function openMemoryEntryEditor(value_61, entry_18 = null, collection_4 = "") {
    if (!memoryEntryEditorModal) return;
    const isShort = value_61 === "short",
      value_59 = collection_4 || (isShort ? "shortTermEntries" : "longTermEntries"),
      value_60 = entry_18?.time || entry_18?.createdAt || formatManualMemoryTime(),
      tags = isShort ? window.imChat?.getShortTermMemoryTags ? window.imChat.getShortTermMemoryTags(entry_18 || {}) : entry_18?.memoryTags || entry_18?.triggerKeywords || [] : entry_18?.triggerKeywords || [];
    if (memoryEntryEditorTitle) memoryEntryEditorTitle.textContent = entry_18 ? "编辑" + (isShort ? "短期" : "长期") + "记忆" : "新增" + (isShort ? "短期" : "长期") + "记忆";
    if (memoryEntryEditorKind) memoryEntryEditorKind.value = value_61;
    if (memoryEntryEditorId) memoryEntryEditorId.value = entry_18?.id == null ? "" : String(entry_18.id);
    if (memoryEntryEditorCollection) memoryEntryEditorCollection.value = value_59;
    if (memoryEntryEditorTitleInput) memoryEntryEditorTitleInput.value = entry_18?.title || "";
    if (memoryEntryEditorTimeInput) memoryEntryEditorTimeInput.value = value_60;
    if (memoryEntryEditorContentInput) memoryEntryEditorContentInput.value = isShort ? entry_18?.event || entry_18?.content || "" : entry_18?.content || "";
    if (memoryEntryEditorContentLabel) memoryEntryEditorContentLabel.textContent = isShort ? "事件内容" : "记忆内容";
    if (memoryEntryEditorTagsInput) memoryEntryEditorTagsInput.value = Array.isArray(tags) ? tags.join("，") : "";
    if (memoryEntryEditorDegreeRow) memoryEntryEditorDegreeRow.style.display = isShort ? "flex" : "none";
    if (memoryEntryEditorDegreeSelect) memoryEntryEditorDegreeSelect.value = entry_18?.degree || "高";
    if (window.openView) window.openView(memoryEntryEditorModal);
  }
  async function handleAction_1430() {
    const friend_38 = getCurrentMemoryFriend_2();
    if (!friend_38) return false;
    const kind_3 = memoryEntryEditorKind?.value === "long" ? "long" : "short",
      isShort_2 = kind_3 === "short",
      collection_5 = memoryEntryEditorCollection?.value || (isShort_2 ? "shortTermEntries" : "longTermEntries"),
      existingId = String(memoryEntryEditorId?.value || ""),
      title_9 = String(memoryEntryEditorTitleInput?.value || "").trim() || (isShort_2 ? "手动记忆" : "长期记忆"),
      time_4 = String(memoryEntryEditorTimeInput?.value || "").trim() || formatManualMemoryTime(),
      content_5 = String(memoryEntryEditorContentInput?.value || "").trim(),
      triggerKeywords_4 = handleAction_1428(memoryEntryEditorTagsInput?.value || "");
    if (!content_5) {
      if (window.showToast) window.showToast("请输入记忆内容");
      return memoryEntryEditorContentInput?.focus(), false;
    }
    const id_6 = existingId || (isShort_2 ? "manual-stm" : "manual-ltm") + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      saved_27 = await window.imApp.commitScopedFriendChange(friend_38, targetFriend_18 => {
        targetFriend_18.memory = window.imApp.normalizeFriendData(targetFriend_18).memory;
        if (!Array.isArray(targetFriend_18.memory[collection_5])) targetFriend_18.memory[collection_5] = [];
        const entries_4 = targetFriend_18.memory[collection_5],
          index_12 = entries_4.findIndex(entry_19 => String(entry_19?.id) === id_6),
          previous = index_12 >= 0 ? entries_4[index_12] : null;
        let nextEntry;
        isShort_2 ? nextEntry = {
          ...(previous || {}),
          id: id_6,
          title: title_9,
          time: time_4,
          event: content_5,
          memoryTags: triggerKeywords_4,
          triggerKeywords: triggerKeywords_4,
          degree: memoryEntryEditorDegreeSelect?.value || previous?.degree || "高",
          lastActivatedAt: previous?.lastActivatedAt || time_4,
          sourceType: previous?.sourceType || "manual",
          sourceId: previous?.sourceId || id_6
        } : nextEntry = {
          ...(previous || {}),
          id: id_6,
          title: title_9,
          content: content_5,
          time: time_4,
          createdAt: time_4,
          triggerKeywords: triggerKeywords_4,
          sourceType: previous?.sourceType || "manual",
          sourceId: previous?.sourceId || id_6
        };
        if (index_12 >= 0) entries_4[index_12] = nextEntry;else entries_4.push(nextEntry);
        targetFriend_18.memory.recallPresentation = null;
        window.imApp.clearFriendRuntimeMessageContext?.(targetFriend_18);
      }, {
        silent: true,
        syncActive: true,
        syncSettings: true
      });
    if (!saved_27) {
      if (window.showToast) window.showToast("记忆保存失败");
      return false;
    }
    closeMemoryEntryEditor();
    renderMemoryLocationSheet(currentMemoryLocation);
    renderMemoryView_2();
    window.dispatchEvent(new CustomEvent("u2:memory-entries-updated", {
      detail: {
        friendId: String(friend_38.id),
        action: "upsert",
        collection: collection_5,
        entryId: id_6
      }
    }));
    if (window.showToast) window.showToast(existingId ? "记忆已更新" : "记忆已添加");
    return true;
  }
  async function deleteMemoryEntry(entry_20, collection_6, options_36 = {}) {
    if (!entry_20) return false;
    const friend_39 = getCurrentMemoryFriend_2();
    if (!friend_39) return false;
    const value_1775 = await window.imApp.commitScopedFriendChange(friend_39, targetFriend_19 => {
      targetFriend_19.memory = window.imApp.normalizeFriendData(targetFriend_19).memory;
      const entries_5 = Array.isArray(targetFriend_19.memory[collection_6]) ? targetFriend_19.memory[collection_6] : [];
      targetFriend_19.memory[collection_6] = entries_5.filter(item_38 => String(item_38?.id) !== String(entry_20.id));
      if (collection_6 === "shortTermEntries") {
        const reduce_1779 = targetFriend_19.memory.shortTermEntries.reduce((value_1782, value_1783) => {
            const max_1784 = Math.max(0, Number(value_1783?.sourceEndMessageCount) || 0),
              max_1785 = Math.max(0, Number(value_1782?.sourceEndMessageCount) || 0);
            return max_1784 >= max_1785 ? value_1783 : value_1782;
          }, null),
          lastSummaryMessageCount_5 = Math.max(0, Number(reduce_1779?.sourceEndMessageCount) || 0),
          value_1781 = Array.isArray(reduce_1779?.sourceMessageIds) ? reduce_1779.sourceMessageIds : [];
        targetFriend_19.memory.lastSummaryMessageCount = lastSummaryMessageCount_5;
        targetFriend_19.memory.summaryCursor = {
          messageId: String(reduce_1779?.sourceEndMessageId || value_1781[value_1781.length - 1] || "").trim(),
          order: Number.isFinite(Number(reduce_1779?.sourceEndMessageOrder)) ? Number(reduce_1779.sourceEndMessageOrder) : -1,
          count: lastSummaryMessageCount_5
        };
      }
      targetFriend_19.memory.recallPresentation = null;
      window.imApp.clearFriendRuntimeMessageContext?.(targetFriend_19);
    }, {
      silent: true,
      syncActive: true,
      syncSettings: true
    });
    if (!value_1775) return false;
    if (options_36.closeDetail && memoryEntryDetailModal && window.closeView) window.closeView(memoryEntryDetailModal);
    return renderMemoryLocationSheet(currentMemoryLocation), renderMemoryView_2(), window.dispatchEvent(new CustomEvent("u2:memory-entries-updated", {
      detail: {
        friendId: String(friend_39.id),
        action: "delete",
        collection: collection_6,
        entryId: String(entry_20.id)
      }
    })), true;
  }
  function confirmDeleteMemoryEntry(entry_21, collection_7, options_37 = {}) {
    const onConfirm_3 = async () => {
        const saved_28 = await deleteMemoryEntry(entry_21, collection_7, options_37);
        if (window.showToast) window.showToast(saved_28 ? "记忆已删除" : "删除失败");
      },
      label_3 = collection_7 === "shortTermEntries" ? "短期记忆" : "长期记忆";
    if (window.showCustomModal) window.showCustomModal({
      title: "删除" + label_3,
      message: "确定彻底删除这条记忆吗？删除后无法恢复。",
      confirmText: "删除",
      isDestructive: true,
      onConfirm: onConfirm_3
    });else window.confirm("确定彻底删除这条记忆吗？") && onConfirm_3();
  }
  async function deleteShortTermMemoryEntry(entry_22, value_1793 = {}) {
    if (!entry_22) return false;
    const friend_40 = getCurrentMemoryFriend_2();
    if (!friend_40) return false;
    const value_1795 = await window.imApp.commitScopedFriendChange(friend_40, targetFriend_20 => {
      if (!targetFriend_20) return;
      targetFriend_20.memory = targetFriend_20.memory || window.imApp.createDefaultMemory();
      if (!Array.isArray(targetFriend_20.memory.shortTermEntries)) targetFriend_20.memory.shortTermEntries = [];
      const entries_6 = Array.isArray(targetFriend_20.memory.shortTermEntries) ? targetFriend_20.memory.shortTermEntries : [];
      targetFriend_20.memory.shortTermEntries = window.imDataUtils?.removeShortTermSummaryEntry ? window.imDataUtils.removeShortTermSummaryEntry(entries_6, entry_22.id) : entries_6.filter(item_39 => !item_39 || String(item_39.id) !== String(entry_22.id));
      const presentedEntries_3 = targetFriend_20.memory.recallPresentation?.recall?.shortTermEntries;
      Array.isArray(presentedEntries_3) && presentedEntries_3.some(item_40 => String(item_40?.id) === String(entry_22.id)) && (targetFriend_20.memory.recallPresentation = null);
      window.imApp.clearFriendRuntimeMessageContext && window.imApp.clearFriendRuntimeMessageContext(targetFriend_20);
    }, {
      silent: true
    });
    if (!value_1795) return false;
    return value_1793.closeDetail && window.closeView && memoryEntryDetailModal && window.closeView(memoryEntryDetailModal), renderMemoryLocationSheet("iphone"), renderMemoryView_2(), window.dispatchEvent(new CustomEvent("u2:memory-entries-updated", {
      detail: {
        friendId: String(friend_40.id),
        action: "delete",
        collection: "shortTermEntries",
        entryId: String(entry_22.id)
      }
    })), true;
  }
  function handleAction_1431(entry_23, options_38 = {}) {
    const value_1803 = async () => {
      const saved_29 = await deleteShortTermMemoryEntry(entry_23, options_38);
      if (window.showToast) window.showToast(saved_29 ? "已删除短期记忆" : "删除失败");
    };
    if (window.showCustomModal) {
      window.showCustomModal({
        title: "删除已总结记录",
        message: "确定彻底删除这条已总结记录吗？这会同时从角色记忆上下文中移除，无法恢复。",
        confirmText: "删除",
        isDestructive: true,
        onConfirm: value_1803
      });
      return;
    }
    window.confirm("确定彻底删除这条已总结记录吗？这会同时从角色记忆上下文中移除，无法恢复。") && value_1803();
  }
  function showMemoryEntryDetail(entry_24, kind_4 = "short", collection_8 = "shortTermEntries") {
    if (!entry_24 || !memoryEntryDetailModal || !memoryEntryDetailBody) return;
    if (memoryEntryDetailTitle) memoryEntryDetailTitle.textContent = entry_24.title || "记忆详情";
    const isShort_3 = kind_4 === "short",
      memoryTags_2 = isShort_3 ? window.imChat?.getShortTermMemoryTags ? window.imChat.getShortTermMemoryTags(entry_24) : Array.isArray(entry_24.memoryTags) ? entry_24.memoryTags : [] : Array.isArray(entry_24.triggerKeywords) ? entry_24.triggerKeywords : [];
    memoryEntryDetailBody.innerHTML = "\n            <div class=\"memory-entry-field\">\n                <div class=\"memory-entry-field-label\">时间</div>\n                <div class=\"memory-entry-field-value\">" + escapeMemoryHtml(entry_24.time || entry_24.createdAt || "") + "</div>\n            </div>\n            <div class=\"memory-entry-field\">\n                <div class=\"memory-entry-field-label\">" + (isShort_3 ? "事件" : "内容") + "</div>\n                <div class=\"memory-entry-field-value\">" + escapeMemoryHtml(isShort_3 ? entry_24.event || entry_24.content || "" : entry_24.content || "") + "</div>\n            </div>\n            <div class=\"memory-entry-field\">\n                <div class=\"memory-entry-field-label\">记忆标签</div>\n                <div class=\"memory-entry-field-value\" style=\"display:flex; flex-wrap:wrap; gap:6px;\">" + (memoryTags_2.length > 0 ? memoryTags_2.map(value_1810 => "<span style=\"padding:3px 8px; border-radius:999px; background:#e8f2ff; color:#007aff; font-size:12px; font-weight:600;\">" + escapeMemoryHtml(value_1810) + "</span>").join("") : "暂无标签") + "</div>\n            </div>\n            " + (isShort_3 ? "<div class=\"memory-entry-field\">\n                <div class=\"memory-entry-field-label\">记忆程度</div>\n                <div class=\"memory-entry-field-value\">" + escapeMemoryHtml(entry_24.degree || "高") + "</div>\n            </div>" : "") + "\n            <div style=\"display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:20px;\">\n                <button type=\"button\" id=\"memory-entry-detail-edit-btn\" style=\"width:100%; padding:12px; border-radius:12px; background:#e8f2ff; color:#007aff; border:none; font-size:15px; font-weight:600; cursor:pointer;\">\n                    <i class=\"fas fa-pen\"></i> 编辑\n                </button>\n                <button type=\"button\" id=\"memory-entry-detail-delete-btn\" style=\"width: 100%; padding: 12px; border-radius: 12px; background: #ffe5e5; color: #ff3b30; border: none; font-size: 15px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;\">\n                    <i class=\"fas fa-trash-alt\"></i> 删除这条记忆\n                </button>\n            </div>\n        ";
    const editBtn = document.getElementById("memory-entry-detail-edit-btn");
    editBtn && editBtn.addEventListener("click", () => {
      if (window.closeView) window.closeView(memoryEntryDetailModal);
      openMemoryEntryEditor(kind_4, entry_24, collection_8);
    });
    const deleteBtn_2 = document.getElementById("memory-entry-detail-delete-btn");
    deleteBtn_2 && deleteBtn_2.addEventListener("click", () => {
      confirmDeleteMemoryEntry(entry_24, collection_8, {
        closeDetail: true
      });
    });
    if (window.openView) window.openView(memoryEntryDetailModal);
  }
  function renderMemoryLocationSheet(location_2) {
    if (!memoryLocationSheetContent) return;
    location_2 = location_2 || "iphone";
    currentMemoryLocation = location_2;
    const value_1812 = location_2 === "x-dm";
    memoryLocationSheet?.classList.toggle("memory-social-centered", value_1812);
    const memoryLocationBottomSheetElement = memoryLocationSheet?.querySelector(".memory-location-bottom-sheet");
    value_1812 ? (memoryLocationBottomSheetElement?.setAttribute("role", "dialog"), memoryLocationBottomSheetElement?.setAttribute("aria-modal", "true"), memoryLocationBottomSheetElement?.setAttribute("aria-label", "社交帐号")) : (memoryLocationBottomSheetElement?.removeAttribute("role"), memoryLocationBottomSheetElement?.removeAttribute("aria-modal"), memoryLocationBottomSheetElement?.removeAttribute("aria-label"));
    const friend_41 = getCurrentMemoryFriend_2(),
      normalizedFriend_13 = friend_41 ? window.imApp.normalizeFriendData(friend_41) : null;
    if (location_2 === "x-dm") {
      if (!normalizedFriend_13 || normalizedFriend_13.type !== "char") {
        memoryLocationSheetContent.innerHTML = "\n                    <div class=\"memory-sheet-title\">社交帐号</div>\n                    <div class=\"memory-short-list\">\n                        <div class=\"memory-short-empty\">仅支持 iMessage 单聊 Char 关联社交帐号。</div>\n                    </div>\n                ";
        return;
      }
      const mount_8 = window.imApp.normalizeXDirectMessageMount(normalizedFriend_13.memory?.xDirectMessageMount),
        xDirectMessageMountCandidates_1818 = window.imApp.getXDirectMessageMountCandidates(normalizedFriend_13),
        selected_6 = xDirectMessageMountCandidates_1818.find(value_1829 => value_1829.id === mount_8.dmId) || (!mount_8.dmId ? xDirectMessageMountCandidates_1818[0] : null),
        selectedIsMissing = Boolean(mount_8.dmId && !selected_6),
        value_1820 = selected_6 ? "" + selected_6.name + (selected_6.handle ? " · " + selected_6.handle : "") : "",
        savedMount = {
          ...mount_8,
          dmId: selected_6?.id || mount_8.dmId
        },
        savedMount_2 = window.imApp.normalizeBstagePopMount(normalizedFriend_13.memory?.bstagePopMount),
        mounted_2 = window.imApp.getBstagePopMountCandidates(),
        mountedBstagePopMember_1823 = window.imApp.getMountedBstagePopMember(normalizedFriend_13),
        boolean_1824 = Boolean(savedMount_2.teamId && savedMount_2.memberId && !mountedBstagePopMember_1823),
        safeCategoryName_2 = mounted_2.find(value_1830 => value_1830.sourceFriendId === String(normalizedFriend_13.id)),
        items_1826 = safeCategoryName_2 ? [safeCategoryName_2, ...mounted_2.filter(name_9 => name_9 !== safeCategoryName_2)] : mounted_2;
      memoryLocationSheetContent.innerHTML = "\n                <div class=\"memory-sheet-title\">社交帐号</div>\n                <p class=\"memory-social-intro\">关联同一 Char 的活动，仅在生成回复时参考；两边聊天记录保持独立。</p>\n                <div class=\"memory-social-list\">\n                    <section class=\"memory-social-card\">\n                        <div class=\"memory-social-row\">\n                            <span class=\"memory-social-mark memory-social-mark-x\"><i class=\"fab fa-x-twitter\"></i></span>\n                            <span class=\"memory-social-main\"><strong>X</strong><small>" + (selected_6 ? escapeMemoryHtml(value_1820) : selectedIsMissing ? "关联已失效" : "暂无对应私信") + "</small></span>\n                            <input id=\"memory-x-dm-enabled\" type=\"checkbox\" aria-label=\"开启 X 社交帐号上下文\" " + (mount_8.enabled ? "checked" : "") + " " + (selected_6 ? "" : "disabled") + ">\n                        </div>\n                        <div class=\"memory-social-detail\">参考 X 私信、User 帖子和 Char 主页帖子。</div>\n                        <label class=\"memory-social-setting\">每类参考条数 <input id=\"memory-x-dm-limit\" type=\"number\" min=\"1\" max=\"50\" step=\"1\" value=\"" + mount_8.limit + "\" aria-label=\"X 社交帐号每类上下文条数\"> <span>条/类</span></label>\n                        " + (xDirectMessageMountCandidates_1818.length === 0 ? "<div class=\"memory-social-note\">请先在 X 中从 iMessage 导入该 Char 并创建私信。</div>" : "") + "\n                    </section>\n                    <section class=\"memory-social-card\">\n                        <div class=\"memory-social-row\">\n                            <span class=\"memory-social-mark memory-social-mark-pop\">P</span>\n                            <span class=\"memory-social-main\"><strong>Bstage POP</strong><small>" + (mountedBstagePopMember_1823 ? escapeMemoryHtml(mountedBstagePopMember_1823.name + " · " + mountedBstagePopMember_1823.teamName) : boolean_1824 ? "关联已失效，请重新选择 Char" : "未关联 Char") + "</small></span>\n                            <input id=\"memory-bstage-pop-enabled\" type=\"checkbox\" aria-label=\"开启 Bstage POP 记忆互通\" " + (savedMount_2.enabled ? "checked" : "") + " " + (mountedBstagePopMember_1823 ? "" : "disabled") + ">\n                        </div>\n                        <div class=\"memory-social-detail\">仅互通 Char 自己的近期内容；不读取 POP 粉丝发言。</div>\n                        <label class=\"memory-social-select-label\" for=\"memory-bstage-pop-select\">关联 Char</label>\n                        <select id=\"memory-bstage-pop-select\" aria-label=\"选择 Bstage POP Char\">\n                            <option value=\"\">请选择 Char</option>\n                            " + items_1826.map((value_1832, value_1833) => "<option value=\"" + value_1833 + "\" " + (mountedBstagePopMember_1823 && value_1832.teamId === mountedBstagePopMember_1823.teamId && value_1832.memberId === mountedBstagePopMember_1823.memberId ? "selected" : "") + ">" + escapeMemoryHtml(value_1832.name + " · " + value_1832.teamName + (value_1832 === safeCategoryName_2 ? "（从此 Char 拉取）" : "")) + "</option>").join("") + "\n                        </select>\n                        " + (mounted_2.length === 0 ? "<div class=\"memory-social-note\">请先在 Bstage 从 iMessage 拉取该 Char，或创建 Char 成员。</div>" : "") + "\n                    </section>\n                </div>\n            ";
      const saveMount = async nextMount => {
        const saved_30 = await window.imApp.commitScopedFriendChange(friend_41, targetFriend_21 => {
          targetFriend_21.memory = window.imApp.normalizeFriendData(targetFriend_21).memory;
          targetFriend_21.memory.xDirectMessageMount = window.imApp.normalizeXDirectMessageMount(nextMount);
        }, {
          silent: true,
          syncActive: true,
          syncSettings: true
        });
        if (!saved_30) {
          if (window.showToast) window.showToast("X 社交帐号上下文保存失败");
          return false;
        }
        return window.dispatchEvent(new CustomEvent("u2:memory-entries-updated", {
          detail: {
            friendId: String(friend_41.id),
            action: "x-dm-mount"
          }
        })), renderMemoryLocationSheet("x-dm"), true;
      };
      memoryLocationSheetContent.querySelector("#memory-x-dm-enabled")?.addEventListener("change", event_7 => {
        saveMount({
          ...savedMount,
          enabled: event_7.target.checked
        });
      });
      memoryLocationSheetContent.querySelector("#memory-x-dm-limit")?.addEventListener("change", event_8 => {
        saveMount({
          ...savedMount,
          limit: event_8.target.value
        });
      });
      const saveMount_2 = async nextMount_1838 => {
        const value_1839 = await window.imApp.commitScopedFriendChange(friend_41, targetFriend_1840 => {
          targetFriend_1840.memory = window.imApp.normalizeFriendData(targetFriend_1840).memory;
          targetFriend_1840.memory.bstagePopMount = window.imApp.normalizeBstagePopMount(nextMount_1838);
        }, {
          silent: true,
          syncActive: true,
          syncSettings: true
        });
        if (!value_1839) {
          if (window.showToast) window.showToast("Bstage POP 关联保存失败");
          return;
        }
        window.dispatchEvent(new CustomEvent("u2:memory-entries-updated", {
          detail: {
            friendId: String(friend_41.id),
            action: "bstage-pop-mount"
          }
        }));
        renderMemoryLocationSheet("x-dm");
      };
      memoryLocationSheetContent.querySelector("#memory-bstage-pop-select")?.addEventListener("change", event_1841 => {
        const value_1842 = event_1841.target.value === "" ? null : items_1826[Number(event_1841.target.value)];
        saveMount_2(value_1842 ? {
          enabled: true,
          teamId: value_1842.teamId,
          memberId: value_1842.memberId
        } : {
          enabled: false,
          teamId: "",
          memberId: ""
        });
      });
      memoryLocationSheetContent.querySelector("#memory-bstage-pop-enabled")?.addEventListener("change", event_9 => {
        saveMount_2({
          ...savedMount_2,
          enabled: event_9.target.checked
        });
      });
      return;
    }
    if (location_2 === "downloads") {
      const longTermEntries_2 = Array.isArray(normalizedFriend_13?.memory?.longTermEntries) ? normalizedFriend_13.memory.longTermEntries.map(entry_25 => ({
          entry: entry_25,
          collection: "longTermEntries"
        })) : [],
        cherishedEntries_2 = Array.isArray(normalizedFriend_13?.memory?.cherishedEntries) ? normalizedFriend_13.memory.cherishedEntries.map(entry_26 => ({
          entry: entry_26,
          collection: "cherishedEntries"
        })) : [],
        items_1846 = [...longTermEntries_2, ...cherishedEntries_2];
      memoryLocationSheetContent.innerHTML = "\n                <div class=\"memory-sheet-title-row\">\n                    <div class=\"memory-sheet-title\">长期记忆</div>\n                    <button type=\"button\" class=\"memory-sheet-add-btn\" data-memory-add-kind=\"long\" aria-label=\"新增长期记忆\"><i class=\"fas fa-plus\"></i></button>\n                </div>\n                <div class=\"memory-recall-limit-row\">\n                    <span>读取条数 <small>长期记忆与珍视回忆共用</small></span>\n                    <input type=\"number\" min=\"1\" max=\"100\" step=\"1\" value=\"" + escapeMemoryHtml(normalizedFriend_13.memory?.recallLimits?.longTerm || 30) + "\" data-memory-recall-limit=\"longTerm\" aria-label=\"长期记忆读取条数\">\n                </div>\n                <div class=\"memory-short-list\">\n                    " + (items_1846.length === 0 ? "<div class=\"memory-short-empty\">暂无长期记忆</div>" : items_1846.slice().reverse().map(({
        entry: entry_27,
        collection: collection_10
      }) => "\n                        <div class=\"memory-short-item memory-long-summary-item\" role=\"button\" tabindex=\"0\" data-memory-entry-id=\"" + escapeMemoryHtml(entry_27.id) + "\" data-memory-collection=\"" + collection_10 + "\">\n                            <span class=\"memory-short-summary-title\">" + escapeMemoryHtml(entry_27.title || "长期记忆") + "</span>\n                            <div class=\"memory-short-actions\">\n                                <span style=\"font-size:11px; color:#8e8e93;\">" + (collection_10 === "cherishedEntries" ? "珍视" : "长期") + "</span>\n                                <button type=\"button\" class=\"memory-short-delete-btn\" aria-label=\"删除长期记忆\"><i class=\"fas fa-trash-alt\"></i></button>\n                                <i class=\"fas fa-chevron-right\"></i>\n                            </div>\n                        </div>\n                    ").join("")) + "\n                </div>\n            ";
      memoryLocationSheetContent.querySelector("[data-memory-recall-limit=\"longTerm\"]")?.addEventListener("change", event_10 => {
        void saveMemoryRecallLimit("longTerm", event_10.target.value);
      });
      memoryLocationSheetContent.querySelector("[data-memory-add-kind=\"long\"]")?.addEventListener("click", () => openMemoryEntryEditor("long"));
      memoryLocationSheetContent.querySelectorAll(".memory-long-summary-item").forEach(btn => {
        const resolveEntry = () => {
          const entryId_3 = btn.getAttribute("data-memory-entry-id"),
            collection_9 = btn.getAttribute("data-memory-collection") || "longTermEntries";
          return {
            collection: collection_9,
            entry: findMemoryEntry(getCurrentMemoryFriend_2(), collection_9, entryId_3)
          };
        };
        btn.addEventListener("click", event_11 => {
          if (event_11.target instanceof Element && event_11.target.closest(".memory-short-delete-btn")) return;
          const resolved = resolveEntry();
          if (resolved.entry) showMemoryEntryDetail(resolved.entry, "long", resolved.collection);
        });
        btn.querySelector(".memory-short-delete-btn")?.addEventListener("click", event_12 => {
          event_12.preventDefault();
          event_12.stopPropagation();
          const resolved_2 = resolveEntry();
          if (resolved_2.entry) confirmDeleteMemoryEntry(resolved_2.entry, resolved_2.collection);
        });
      });
      return;
    }
    if (location_2 !== "iphone") {
      memoryLocationSheetContent.innerHTML = "";
      return;
    }
    const entries_7 = Array.isArray(normalizedFriend_13?.memory?.shortTermEntries) ? normalizedFriend_13.memory.shortTermEntries : [];
    memoryLocationSheetContent.innerHTML = "\n            <div class=\"memory-sheet-title-row\">\n                <div class=\"memory-sheet-title\">短期记忆</div>\n                <div class=\"memory-sheet-toolbar\">\n                    <button type=\"button\" class=\"memory-sheet-text-btn\" data-memory-select-all>全选</button>\n                    <button type=\"button\" class=\"memory-sheet-add-btn\" data-memory-add-kind=\"short\" aria-label=\"新增短期记忆\"><i class=\"fas fa-plus\"></i></button>\n                </div>\n            </div>\n            <div class=\"memory-recall-limit-row\">\n                <span>读取条数 <small>按相关度最多注入</small></span>\n                <input type=\"number\" min=\"1\" max=\"100\" step=\"1\" value=\"" + escapeMemoryHtml(normalizedFriend_13.memory?.recallLimits?.shortTerm || 30) + "\" data-memory-recall-limit=\"shortTerm\" aria-label=\"短期记忆读取条数\">\n            </div>\n            <div class=\"memory-short-list\">\n                " + (entries_7.length === 0 ? "<div class=\"memory-short-empty\">暂无短期记忆</div>" : entries_7.slice().reverse().map(entry_28 => "\n                    <div class=\"memory-short-item memory-short-summary-item\" role=\"button\" tabindex=\"0\" data-memory-entry-id=\"" + entry_28.id + "\">\n                        <input type=\"checkbox\" class=\"memory-short-select\" data-memory-select-id=\"" + escapeMemoryHtml(entry_28.id) + "\" aria-label=\"选择" + escapeMemoryHtml(entry_28.title || "短期记忆") + "\">\n                        <span class=\"memory-short-summary-title\">" + escapeMemoryHtml(entry_28.title || "对话总结") + "</span>\n                        <div class=\"memory-short-actions\">\n                            <button type=\"button\" class=\"memory-short-delete-btn\" aria-label=\"删除已总结记录\" title=\"删除已总结记录\"><i class=\"fas fa-trash-alt\"></i></button>\n                            <i class=\"fas fa-chevron-right\"></i>\n                        </div>\n                    </div>\n                ").join("")) + "\n            </div>\n            <button type=\"button\" class=\"memory-promotion-btn\" data-memory-promote disabled>归纳为长期记忆</button>\n        ";
    memoryLocationSheetContent.querySelector("[data-memory-recall-limit=\"shortTerm\"]")?.addEventListener("change", event_13 => {
      void saveMemoryRecallLimit("shortTerm", event_13.target.value);
    });
    memoryLocationSheetContent.querySelector("[data-memory-add-kind=\"short\"]")?.addEventListener("click", () => openMemoryEntryEditor("short"));
    const selectedIds_5 = new Set(),
      selectAllButton = memoryLocationSheetContent.querySelector("[data-memory-select-all]"),
      promoteButton = memoryLocationSheetContent.querySelector("[data-memory-promote]"),
      refreshPromotionSelection = () => {
        const allSelected = entries_7.length > 0 && selectedIds_5.size === entries_7.length;
        if (selectAllButton) selectAllButton.textContent = allSelected ? "取消全选" : "全选";
        if (promoteButton) {
          const isPromoting = promoteButton.dataset.memoryPromoting === "true";
          if (isPromoting) {
            promoteButton.disabled = true;
            promoteButton.textContent = "正在归纳...";
            return;
          }
          promoteButton.disabled = selectedIds_5.size === 0;
          promoteButton.textContent = selectedIds_5.size > 0 ? "归纳 " + selectedIds_5.size + " 条为长期记忆" : "归纳为长期记忆";
        }
      };
    selectAllButton?.addEventListener("click", event_1862 => {
      event_1862.preventDefault();
      const checked_2 = selectedIds_5.size !== entries_7.length;
      memoryLocationSheetContent.querySelectorAll(".memory-short-select").forEach(input_2 => {
        input_2.checked = checked_2;
        const string_1865 = String(input_2.getAttribute("data-memory-select-id") || "");
        if (checked_2) selectedIds_5.add(string_1865);else selectedIds_5["delete"](string_1865);
      });
      refreshPromotionSelection();
    });
    promoteButton?.addEventListener("click", async () => {
      if (promoteButton.dataset.memoryPromoting === "true" || selectedIds_5.size === 0) return;
      promoteButton.dataset.memoryPromoting = "true";
      promoteButton.setAttribute("aria-busy", "true");
      refreshPromotionSelection();
      try {
        await generateMemoryPromotion(normalizedFriend_13, Array.from(selectedIds_5));
      } finally {
        delete promoteButton.dataset.memoryPromoting;
        promoteButton.removeAttribute("aria-busy");
        if (promoteButton.isConnected) refreshPromotionSelection();
      }
    });
    memoryLocationSheetContent.querySelectorAll(".memory-short-summary-item").forEach(btn_2 => {
      const openEntry = () => {
        const attribute_1867 = btn_2.getAttribute("data-memory-entry-id"),
          result_1868 = entries_7.find(value_1869 => String(value_1869.id) === String(attribute_1867));
        if (result_1868) showMemoryEntryDetail(result_1868);
      };
      btn_2.addEventListener("click", event_14 => {
        const targetEl = event_14.target instanceof Element ? event_14.target : null;
        if (targetEl?.closest(".memory-short-delete-btn")) return;
        if (targetEl?.closest(".memory-short-select")) return;
        openEntry();
      });
      btn_2.addEventListener("keydown", event_1871 => {
        const value_1872 = event_1871.target instanceof Element ? event_1871.target : null;
        if (value_1872?.closest(".memory-short-delete-btn")) return;
        if (value_1872?.closest(".memory-short-select")) return;
        (event_1871.key === "Enter" || event_1871.key === " ") && (event_1871.preventDefault(), openEntry());
      });
      const deleteBtn_3 = btn_2.querySelector(".memory-short-delete-btn");
      deleteBtn_3 && deleteBtn_3.addEventListener("click", event_1873 => {
        event_1873.preventDefault();
        event_1873.stopPropagation();
        const attribute_1874 = btn_2.getAttribute("data-memory-entry-id"),
          target_4 = entries_7.find(value_1876 => String(value_1876.id) === String(attribute_1874));
        if (target_4) confirmDeleteMemoryEntry(target_4, "shortTermEntries");
      });
      const selectInput = btn_2.querySelector(".memory-short-select");
      selectInput?.addEventListener("change", () => {
        const string_1877 = String(selectInput.getAttribute("data-memory-select-id") || "");
        if (selectInput.checked) selectedIds_5.add(string_1877);else selectedIds_5["delete"](string_1877);
        refreshPromotionSelection();
      });
    });
  }
  window.imApp.openMemoryLocationForFriend = function (value_1878, value_1879) {
    const value_1880 = window.imApp.getFriendById ? window.imApp.getFriendById(value_1878) : (window.imData.friends || []).find(value_1881 => String(value_1881.id) === String(value_1878?.id ?? value_1878));
    if (!value_1880) return false;
    setMemoryFriendSelection(value_1880);
    renderMemoryLocationSheet(value_1879);
    if (memoryLocationSheet && window.openView) {
      if (value_1879 === "x-dm") value_1422 = document.activeElement;
      window.openView(memoryLocationSheet);
      if (value_1879 === "x-dm") memorySocialCloseElement?.focus({
        preventScroll: true
      });
      return true;
    }
    return false;
  };
  window.imApp.openMemoryScheduleForFriend = function (value_1882) {
    const value_1883 = window.imApp.getFriendById ? window.imApp.getFriendById(value_1882) : (window.imData.friends || []).find(value_1884 => String(value_1884.id) === String(value_1882?.id ?? value_1882));
    if (!value_1883) return false;
    setMemoryFriendSelection(value_1883);
    if (scheduleModal && window.openView) return renderScheduleModal(), window.openView(scheduleModal), true;
    return false;
  };
  window.imApp.getCurrentMemoryFriend = getCurrentMemoryFriend_2;
  window.imApp.refreshMemoryLocationSheet = function (location) {
    renderMemoryLocationSheet(location || currentMemoryLocation || "iphone");
  };
  memoryEntryDetailClose && memoryEntryDetailModal && memoryEntryDetailClose.addEventListener("click", () => {
    if (window.closeView) window.closeView(memoryEntryDetailModal);
  });
  [memoryEntryEditorClose, memoryEntryEditorCancel].forEach(value_1885 => {
    value_1885?.addEventListener("click", closeMemoryEntryEditor);
  });
  memoryEntryEditorSave?.addEventListener("click", () => void handleAction_1430());
  memoryEntryEditorModal?.addEventListener("click", event_1886 => {
    if (event_1886.target === memoryEntryEditorModal) closeMemoryEntryEditor();
  });
  [memoryPromotionPreviewClose, memoryPromotionPreviewCancel].forEach(value_1887 => {
    value_1887?.addEventListener("click", closeMemoryPromotionPreview);
  });
  memoryPromotionPreviewConfirm?.addEventListener("click", () => void handleAction_1429());
  memoryPromotionPreviewModal?.addEventListener("click", event_1888 => {
    if (event_1888.target === memoryPromotionPreviewModal) closeMemoryPromotionPreview();
  });
  scheduleClose && scheduleModal && scheduleClose.addEventListener("click", () => {
    if (window.closeView) window.closeView(scheduleModal);
  });
  window.imApp.renderMemoryView = renderMemoryView_2;
  function hideAllTabs_2() {
    const activeElement_1889 = document.activeElement;
    [imContent, chatsContent, momentsContent].some(value_1891 => value_1891?.contains(activeElement_1889)) && document.getElementById("imessage-view")?.focus({
      preventScroll: true
    });
    if (imContent) imContent.style.display = "none";
    if (chatsContent) chatsContent.style.display = "none";
    momentsContent && (momentsContent.style.display = "none", momentsContent.classList.remove("active"), momentsContent.setAttribute("aria-hidden", "true"));
    if (imContent) imContent.setAttribute("aria-hidden", "true");
    if (chatsContent) chatsContent.setAttribute("aria-hidden", "true");
    if (navHomeBtn) navHomeBtn.classList.remove("active");
    if (navChatsBtn) navChatsBtn.classList.remove("active");
    if (navMomentsBtn) navMomentsBtn.classList.remove("active");
    const lineHeaderRightElement_1890 = document.querySelector(".line-header-right");
    if (lineHeaderRightElement_1890) lineHeaderRightElement_1890.style.display = "flex";
  }
  navHomeBtn && navHomeBtn.addEventListener("click", () => {
    hideAllTabs_2();
    window.imApp.setActiveThemeSurface("home");
    if (imContent) imContent.style.display = "block";
    if (imContent) imContent.setAttribute("aria-hidden", "false");
    if (imBottomNavContainer) imBottomNavContainer.style.display = "flex";
    navHomeBtn.classList.add("active");
    updateLineNavIndicator(navHomeBtn);
    if (window.imApp.renderFriendsList) window.imApp.renderFriendsList();
    if (window.imApp.renderGroupsList) window.imApp.renderGroupsList();
  });
  navChatsBtn && navChatsBtn.addEventListener("click", () => {
    hideAllTabs_2();
    window.imApp.setActiveThemeSurface("chats");
    if (chatsContent) {
      chatsContent.style.display = "flex";
      chatsContent.style.flexDirection = "column";
      chatsContent.setAttribute("aria-hidden", "false");
      if (window.imApp.updateChatsView) window.imApp.updateChatsView();
    }
    navChatsBtn.classList.add("active");
    updateLineNavIndicator(navChatsBtn);
    if (window.imApp.updateChatsUnreadBadges) window.imApp.updateChatsUnreadBadges();
  });
  navMomentsBtn && navMomentsBtn.addEventListener("click", () => {
    if (window.imApp.openMoments) window.imApp.openMoments();
    navMomentsBtn.classList.add("active");
    updateLineNavIndicator(navMomentsBtn);
    if (window.imApp.updateChatsUnreadBadges) window.imApp.updateChatsUnreadBadges();
  });
  window.imApp.hideAllTabs = hideAllTabs_2;
  window.imApp.setActiveThemeSurface(navChatsBtn?.classList.contains("active") ? "chats" : navMomentsBtn?.classList.contains("active") ? "moments" : "home");
  setTimeout(() => {
    if (window.imApp.applyAllSavedCss) window.imApp.applyAllSavedCss();
  }, 100);
});
