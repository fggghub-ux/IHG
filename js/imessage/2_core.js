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
window.imApp.DEFAULT_STATUS_PROMPT = "固定使用简体中文，写角色此刻没有说出口的三句真实心声。每句约10个汉字，每行一句，共三行；不要添加序号、引号、标题、前缀或解释。";
window.imApp.DEFAULT_STATUS_TEMPLATE_REGEX = "(?<thought>[\\s\\S]+)";
window.imApp.DEFAULT_STATUS_TEMPLATE_HTML = "<div class=\"chat-profile-status-page\" data-selected-index=\"{{index}}\">\n    <div class=\"chat-profile-status-time\">{{time}}</div>\n    <div class=\"gmp-inner-voice chat-profile-panel-thought\">{{thought}}</div>\n    <div class=\"chat-profile-status-counter\"><span>{{index}}</span> / {{total}}</div>\n</div>";
window.imApp.createDefaultStatusTemplate = function (value_16 = {}) {
  return {
    enabled: value_16.enabled === true,
    prompt: typeof value_16.prompt === "string" && value_16.prompt.trim() ? value_16.prompt.trim() : window.imApp.DEFAULT_STATUS_PROMPT,
    regex: typeof value_16.regex === "string" && value_16.regex.trim() ? value_16.regex.trim() : window.imApp.DEFAULT_STATUS_TEMPLATE_REGEX,
    html: typeof value_16.html === "string" && value_16.html.trim() ? value_16.html.trim() : window.imApp.DEFAULT_STATUS_TEMPLATE_HTML
  };
};
window.imApp.DEFAULT_SINGLE_CHAT_COT_PROMPT = "请按以下顺序完整分析：\n1. 当前具体日期、时间与时间段，以及这对本轮场景和聊天承接意味着什么。\n2. 结合自己的核心人设、性格、当前情绪和与 User 的关系，分析自己现在最真实的想法与适合的回应方式。\n3. 结合 User 人设、当前消息的内容与语气，分析 User 此刻的需求、感受和适合被怎样回应。";
window.imApp.scopeUserCss = function (css_2, scope_2) {
  if (!css_2 || !scope_2) return "";
  function handleAction_19(value_23, value_24) {
    let depth = 0,
      quote = null,
      inComment = false;
    for (let i = value_24; i < value_23.length; i += 1) {
      const char_2 = value_23[i],
        next = value_23[i + 1];
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
  function splitSelectorList(selectorText) {
    const selectors = [];
    let current = "",
      squareDepth = 0,
      parenDepth = 0,
      quote_2 = null;
    for (let i_2 = 0; i_2 < selectorText.length; i_2 += 1) {
      const char_3 = selectorText[i_2];
      if (quote_2) {
        current += char_3;
        if (char_3 === "\\") {
          i_2 += 1;
          current += selectorText[i_2] || "";
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
  function scopeSelector(value_39) {
    const trimmed = value_39.trim();
    if (!trimmed) return trimmed;
    if (trimmed.includes(":scope")) return trimmed.replace(/:scope/g, scope_2);
    if (trimmed === ":root" || trimmed === "html" || trimmed === "body") return scope_2;
    if (trimmed.startsWith(scope_2)) return trimmed;
    return scope_2 + " " + trimmed;
  }
  function handleAction_22(text_2) {
    let text_42 = "",
      cursor = 0;
    while (cursor < text_2.length) {
      const openIndex = text_2.indexOf("{", cursor);
      if (openIndex === -1) {
        text_42 += text_2.slice(cursor);
        break;
      }
      const prelude = text_2.slice(cursor, openIndex),
        trimmedPrelude = prelude.trim(),
        closeIndex = handleAction_19(text_2, openIndex);
      if (closeIndex === -1) {
        text_42 += text_2.slice(cursor);
        break;
      }
      const body_2 = text_2.slice(openIndex + 1, closeIndex),
        lowerPrelude = trimmedPrelude.toLowerCase();
      if (!trimmedPrelude) text_42 += text_2.slice(cursor, closeIndex + 1);else {
        if (lowerPrelude.startsWith("@media") || lowerPrelude.startsWith("@supports") || lowerPrelude.startsWith("@container") || lowerPrelude.startsWith("@layer")) text_42 += prelude + "{" + handleAction_22(body_2) + "}";else {
          if (lowerPrelude.startsWith("@keyframes") || lowerPrelude.startsWith("@-webkit-keyframes") || lowerPrelude.startsWith("@font-face") || lowerPrelude.startsWith("@property") || lowerPrelude.startsWith("@page")) text_42 += text_2.slice(cursor, closeIndex + 1);else {
            if (trimmedPrelude.startsWith("@")) text_42 += text_2.slice(cursor, closeIndex + 1);else {
              const leadingWhitespace = prelude.match(/^\s*/)?.[0] || "",
                scopedPrelude = splitSelectorList(trimmedPrelude).map(scopeSelector).join(", ");
              text_42 += "" + leadingWhitespace + scopedPrelude + "{" + body_2 + "}";
            }
          }
        }
      }
      cursor = closeIndex + 1;
    }
    return text_42;
  }
  return handleAction_22(String(css_2));
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
window.imApp.normalizeOfflineThemeState = function (value_52) {
  const defaults = window.imApp.createDefaultOfflineThemeState(),
    source_3 = value_52 && typeof value_52 === "object" ? value_52 : {},
    normalizeColor = (value_8, fallback) => {
      const color_2 = String(value_8 || "").trim();
      return /^#[0-9a-fA-F]{6}$/.test(color_2) ? color_2.toUpperCase() : fallback;
    },
    customCss_2 = typeof source_3.customCss === "string" ? source_3.customCss : "",
    replaceAll_56 = customCss_2.replaceAll("offline-tavern", "offline-chat");
  return {
    narrativeColor: normalizeColor(source_3.narrativeColor, defaults.narrativeColor),
    dialogueColor: normalizeColor(source_3.dialogueColor, defaults.dialogueColor),
    customCss: replaceAll_56,
    customCssEnabled: !!replaceAll_56.trim(),
    activePresetId: String(source_3.activePresetId || "").trim()
  };
};
window.imApp.normalizeOfflineThemePresets = function (presets_2) {
  const source_4 = Array.isArray(presets_2) ? presets_2 : [],
    value_61 = new Set(),
    usedNames = new Set();
  return source_4.map((value_63, value_64) => {
    const item_2 = value_63 && typeof value_63 === "object" ? value_63 : {},
      theme_2 = window.imApp.normalizeOfflineThemeState(item_2),
      name_3 = String(item_2.name || "").trim() || "线下主题 " + (value_64 + 1),
      normalizedName = name_3.toLocaleLowerCase();
    let id_7 = String(item_2.id || "").trim() || "offline-theme-" + (value_64 + 1);
    while (value_61.has(id_7)) id_7 = id_7 + "-" + (value_64 + 1);
    if (usedNames.has(normalizedName)) return null;
    return value_61.add(id_7), usedNames.add(normalizedName), {
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
    item_3 = window.imData.offlineThemeInitialized ? window.imData.offlineTheme : imessageUiState?.offlineTheme || window.imData.offlineTheme,
    value_70 = window.imData.offlineThemeInitialized ? window.imData.offlineThemePresets : imessageUiState?.offlineThemePresets || window.imData.offlineThemePresets,
    offlineTheme_2 = window.imApp.normalizeOfflineThemeState(item_3),
    offlineThemePresets_2 = window.imApp.normalizeOfflineThemePresets(value_70);
  return offlineTheme_2.activePresetId && !offlineThemePresets_2.some(preset_2 => preset_2.id === offlineTheme_2.activePresetId) && (offlineTheme_2.activePresetId = ""), window.imData.offlineTheme = offlineTheme_2, window.imData.offlineThemePresets = offlineThemePresets_2, {
    theme: offlineTheme_2,
    presets: offlineThemePresets_2
  };
};
window.imApp.applyOfflineChatTheme = function (value_74 = null) {
  const offlineTheme_4 = window.imApp.normalizeOfflineThemeState(value_74 || window.imApp.getOfflineThemeState().theme);
  window.imData.offlineTheme = offlineTheme_4;
  ["offline-chat-view", "offline-chat-barrage-view"].forEach(value_76 => {
    const elementById = document.getElementById(value_76);
    if (!elementById) return;
    elementById.style.setProperty("--offline-chat-narrative-color", offlineTheme_4.narrativeColor);
    elementById.style.setProperty("--offline-chat-dialogue-color", offlineTheme_4.dialogueColor);
  });
  let offlineChatCustomThemeStyleElement = document.getElementById("offline-chat-custom-theme-style");
  return !offlineChatCustomThemeStyleElement && (offlineChatCustomThemeStyleElement = document.createElement("style"), offlineChatCustomThemeStyleElement.id = "offline-chat-custom-theme-style", document.head.appendChild(offlineChatCustomThemeStyleElement)), offlineChatCustomThemeStyleElement.textContent = offlineTheme_4.customCssEnabled && offlineTheme_4.customCss.trim() ? window.imApp.scopeUserCss(offlineTheme_4.customCss, OFFLINE_THEME_SCOPE) : "", offlineTheme_4;
};
window.imApp.saveOfflineThemeState = async function (value_77) {
  const theme_4 = window.imApp.applyOfflineChatTheme(value_77);
  return window.imData.offlineThemeInitialized = true, await Promise.resolve(window.imApp.saveImessageUiState?.()), document.dispatchEvent(new CustomEvent("u2:offline-theme-changed", {
    detail: {
      theme: theme_4
    }
  })), theme_4;
};
window.imApp.saveOfflineThemePresets = async function (value_79) {
  const offlineThemePresets_4 = window.imApp.normalizeOfflineThemePresets(value_79);
  return window.imData.offlineThemePresets = offlineThemePresets_4, window.imData.offlineThemeInitialized = true, await Promise.resolve(window.imApp.saveImessageUiState?.()), document.dispatchEvent(new CustomEvent("u2:offline-theme-changed", {
    detail: {
      presets: offlineThemePresets_4
    }
  })), offlineThemePresets_4;
};
window.imApp.applyGlobalChatCss = function (themeState_2 = window.u2ThemeState || {}) {
  const id_2 = "global-imessage-chat-css";
  let elementById_83 = document.getElementById(id_2);
  !elementById_83 && (elementById_83 = document.createElement("style"), elementById_83.id = id_2, document.head.appendChild(elementById_83));
  const enabled_2 = !!themeState_2.imessageChatCssEnabled,
    css_3 = typeof themeState_2.imessageChatCss === "string" ? themeState_2.imessageChatCss : "",
    textContent_2 = enabled_2 && css_3.trim() ? window.imApp.scopeUserCss(css_3, ".active-chat-interface.im-chat-single") : "";
  if (elementById_83.textContent !== textContent_2) elementById_83.textContent = textContent_2;
};
window.imApp.setActiveThemeSurface = function (surface = "home") {
  const imessageView = document.getElementById("imessage-view");
  if (!imessageView) return;
  imessageView.dataset.imActiveSurface = String(surface || "home");
};
function applyGlobalSurfaceCss({
  styleId: id_8,
  enabled: enabled_3,
  css: css_4,
  scope: scope_3
}) {
  let elementById_91 = document.getElementById(id_8);
  !elementById_91 && (elementById_91 = document.createElement("style"), elementById_91.id = id_8, document.head.appendChild(elementById_91));
  const textContent_3 = enabled_3 && typeof css_4 === "string" && css_4.trim() ? window.imApp.scopeUserCss(css_4, scope_3) : "";
  if (elementById_91.textContent !== textContent_3) elementById_91.textContent = textContent_3;
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
  let elementById_95 = document.getElementById(id_3);
  !elementById_95 && (elementById_95 = document.createElement("style"), elementById_95.id = id_3, document.head.appendChild(elementById_95));
  const enabled_4 = !!themeState_3.imessageGroupCssEnabled,
    css_5 = typeof themeState_3.imessageGroupCss === "string" ? themeState_3.imessageGroupCss : "",
    textContent_4 = enabled_4 && css_5.trim() ? window.imApp.scopeUserCss(css_5, ".active-chat-interface.im-chat-group") : "";
  if (elementById_95.textContent !== textContent_4) elementById_95.textContent = textContent_4;
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
window.imApp.normalizeAutonomousTask = function (value_99) {
  const defaultTask = window.imApp.createDefaultAutonomousTask(),
    source_5 = value_99 && typeof value_99 === "object" ? value_99 : {},
    minInterval = Number(source_5.minIntervalMinutes),
    maxInterval = Number(source_5.maxIntervalMinutes),
    normalizedMin = Number.isFinite(minInterval) ? Math.max(1, Math.round(minInterval)) : defaultTask.minIntervalMinutes,
    maxIntervalMinutes_2 = Number.isFinite(maxInterval) ? Math.max(normalizedMin, Math.round(maxInterval)) : Math.max(normalizedMin, defaultTask.maxIntervalMinutes);
  return {
    enabled: !!source_5.enabled,
    minIntervalMinutes: normalizedMin,
    maxIntervalMinutes: maxIntervalMinutes_2,
    nextRunAt: Math.max(0, Number(source_5.nextRunAt) || defaultTask.nextRunAt),
    lastRunAt: Math.max(0, Number(source_5.lastRunAt) || defaultTask.lastRunAt)
  };
};
window.imApp.createDefaultAutonomousActivity = function () {
  return {
    reply: window.imApp.createDefaultAutonomousTask(),
    moment: window.imApp.createDefaultAutonomousTask()
  };
};
window.imApp.normalizeAutonomousActivity = function (value_104) {
  const source_6 = value_104 && typeof value_104 === "object" ? value_104 : {},
    hasNestedTasks = source_6.reply && typeof source_6.reply === "object" || source_6.moment && typeof source_6.moment === "object",
    legacyReplySource = hasNestedTasks ? source_6.reply : source_6;
  return {
    reply: window.imApp.normalizeAutonomousTask(legacyReplySource),
    moment: window.imApp.normalizeAutonomousTask(source_6.moment)
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
window.imApp.normalizeGeneratedContactProfile = function (mount, value_109 = {}) {
  const source_7 = mount && typeof mount === "object" && !Array.isArray(mount) ? mount : {},
    options_111 = {
      nickname: 80,
      realName: 80,
      signature: 240,
      persona: 8000,
      referrerRelation: 200
    },
    value_112 = value_114 => String(source_7[value_114] || "").trim(),
    options_113 = {
      nickname: value_112("nickname"),
      realName: value_112("realName"),
      signature: value_112("signature"),
      persona: value_112("persona"),
      referrerRelation: value_112("referrerRelation")
    };
  if (value_109.strict === true) {
    if (!options_113.nickname || !options_113.realName || !options_113.signature || !options_113.persona || !options_113.referrerRelation) return null;
    if (Object.entries(options_111).some(([value_115, value_116]) => options_113[value_115].length > value_116)) return null;
    if (source_7.type && source_7.type !== "char") return null;
    if (["id", "targetId", "contactId"].some(value_117 => Object.prototype.hasOwnProperty.call(source_7, value_117))) return null;
  }
  return {
    type: "char",
    nickname: options_113.nickname.slice(0, options_111.nickname),
    realName: options_113.realName.slice(0, options_111.realName),
    signature: options_113.signature.slice(0, options_111.signature),
    persona: options_113.persona.slice(0, options_111.persona),
    referrerRelation: options_113.referrerRelation.slice(0, options_111.referrerRelation),
    avatarUrl: value_109.strict === true ? "" : typeof source_7.avatarUrl === "string" ? source_7.avatarUrl.trim() : "",
    avatarAssetId: value_109.strict === true ? "" : typeof source_7.avatarAssetId === "string" ? source_7.avatarAssetId.trim() : ""
  };
};
window.imApp.normalizeFriendRequests = function (value_118) {
  const value_119 = new Set();
  return (Array.isArray(value_118) ? value_118 : []).map(value_120 => {
    if (!value_120 || typeof value_120 !== "object") return null;
    const id_9 = String(value_120.id || "").trim(),
      contactId_2 = String(value_120.contactId || "").trim();
    if (!id_9 || !contactId_2 || value_119.has(id_9)) return null;
    const profile_2 = window.imApp.normalizeGeneratedContactProfile(value_120.profile, {
      strict: true
    });
    if (!profile_2) return null;
    return value_119.add(id_9), {
      id: id_9,
      contactId: contactId_2,
      sourceFriendId: String(value_120.sourceFriendId || "").trim(),
      sourceMessageId: String(value_120.sourceMessageId || "").trim(),
      createdAt: Math.max(0, Number(value_120.createdAt) || Date.now()),
      seenAt: Math.max(0, Number(value_120.seenAt) || 0),
      status: "pending",
      profile: profile_2
    };
  }).filter(Boolean).slice(-100);
};
window.imApp.saveFriendRequests = async function (value_123, value_124 = {}) {
  const friendRequests_3 = window.imApp.normalizeFriendRequests(window.imData.friendRequests),
    friendRequests_2 = window.imApp.normalizeFriendRequests(value_123);
  window.imData.friendRequests = friendRequests_2;
  try {
    window.imApp.saveImessageUiState?.();
    if (value_124.flush !== false && typeof window.saveGlobalData === "function") {
      const value_127 = await Promise.resolve(window.saveGlobalData());
      if (value_127 === false) throw new Error("Failed to persist friend requests");
    }
    return window.dispatchEvent(new CustomEvent("u2:friend-requests-changed", {
      detail: {
        count: friendRequests_2.length
      }
    })), true;
  } catch (value_128) {
    return console.error("Failed to save friend requests", value_128), window.imData.friendRequests = friendRequests_3, window.imApp.saveImessageUiState?.(), false;
  }
};
window.imApp.normalizeChatApiUsage = function (mount_2, value_130 = {}) {
  const source_8 = mount_2 && typeof mount_2 === "object" && !Array.isArray(mount_2) ? mount_2 : {},
    value_132 = (...value_139) => {
      for (const value_140 of value_139) {
        const number_141 = Number(source_8[value_140]);
        if (Number.isFinite(number_141) && number_141 >= 0) return Math.round(number_141);
      }
      return null;
    },
    inputTokens_2 = value_132("prompt_tokens", "input_tokens", "promptTokens", "inputTokens", "promptTokenCount", "inputTokenCount"),
    outputTokens_2 = value_132("completion_tokens", "output_tokens", "completionTokens", "outputTokens", "candidatesTokenCount", "outputTokenCount"),
    value_132_135 = value_132("total_tokens", "totalTokens", "totalTokenCount"),
    totalTokens_2 = value_132_135 != null ? value_132_135 : inputTokens_2 != null && outputTokens_2 != null ? inputTokens_2 + outputTokens_2 : null;
  if (inputTokens_2 == null && outputTokens_2 == null && totalTokens_2 == null) return null;
  const recordedAt_2 = Number(value_130.recordedAt || source_8.recordedAt || source_8.completedAt) || Date.now(),
    number_138 = Number(value_130.requestMessageCount || source_8.requestMessageCount);
  return {
    inputTokens: inputTokens_2,
    outputTokens: outputTokens_2,
    totalTokens: totalTokens_2,
    model: String(value_130.model || source_8.model || "").trim().slice(0, 200),
    source: String(value_130.source || source_8.source || "chat").trim().slice(0, 80) || "chat",
    requestMessageCount: Number.isFinite(number_138) && number_138 >= 0 ? Math.round(number_138) : null,
    recordedAt: recordedAt_2
  };
};
window.imApp.getLastChatApiUsage = function (value_142) {
  return window.imApp.normalizeChatApiUsage(value_142?.lastChatApiUsage || null);
};
window.imApp.recordLastChatApiUsage = async function (value_143, value_144, value_145 = {}) {
  const chatApiUsage = window.imApp.normalizeChatApiUsage(value_144, value_145);
  if (!chatApiUsage || !window.imApp.commitFriendMetaPatch) return false;
  try {
    const value_146 = await window.imApp.commitFriendMetaPatch(window.imApp.resolveFriendId(value_143), {
      lastChatApiUsage: chatApiUsage
    }, {
      silent: true
    });
    return value_146 && typeof window.CustomEvent === "function" && window.dispatchEvent(new CustomEvent("u2:chat-api-usage-updated", {
      detail: {
        friendId: String(window.imApp.resolveFriendId(value_143) || ""),
        usage: chatApiUsage
      }
    })), value_146;
  } catch (value_147) {
    return console.warn("[iMessage] Failed to persist actual chat API usage", value_147), false;
  }
};
window.imApp.createDefaultLinkedAccountBot = function () {
  return {
    enabled: false,
    intervalSeconds: 60,
    lastRunAt: 0
  };
};
window.imApp.normalizeLinkedAccountBot = function (value_148) {
  const defaultBot = window.imApp.createDefaultLinkedAccountBot(),
    source_9 = value_148 && typeof value_148 === "object" ? value_148 : {},
    intervalSeconds_2 = Number(source_9.intervalSeconds);
  return {
    enabled: !!source_9.enabled,
    intervalSeconds: Number.isFinite(intervalSeconds_2) ? Math.max(5, Math.min(86400, Math.round(intervalSeconds_2))) : defaultBot.intervalSeconds,
    lastRunAt: Number(source_9.lastRunAt) || defaultBot.lastRunAt
  };
};
window.imApp.normalizeLinkedAccountChats = function (chats) {
  if (!Array.isArray(chats)) return [];
  return chats.map((contact_152, value_153) => {
    if (!contact_152 || typeof contact_152 !== "object") return null;
    const messages_2 = Array.isArray(contact_152.messages) ? contact_152.messages.map((message_4, messageIndex) => {
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
      updatedAt_2 = Number(contact_152.updatedAt) || (messages_2.length > 0 ? messages_2[messages_2.length - 1].timestamp : now_2);
    return {
      id: contact_152.id || "linked-chat-" + updatedAt_2 + "-" + value_153,
      name: typeof contact_152.name === "string" && contact_152.name.trim() ? contact_152.name.trim() : "Linked Friend " + (value_153 + 1),
      realName: typeof contact_152.realName === "string" && contact_152.realName.trim() ? contact_152.realName.trim() : typeof contact_152.name === "string" ? contact_152.name.trim() : "",
      remark: typeof contact_152.remark === "string" ? contact_152.remark.trim() : "",
      handle: typeof contact_152.handle === "string" ? contact_152.handle.trim() : "",
      persona: typeof contact_152.persona === "string" ? contact_152.persona.trim() : "",
      relationship: typeof contact_152.relationship === "string" ? contact_152.relationship.trim() : "",
      avatarSeed: typeof contact_152.avatarSeed === "string" && contact_152.avatarSeed.trim() ? contact_152.avatarSeed.trim() : typeof contact_152.handle === "string" && contact_152.handle.trim() ? contact_152.handle.trim() : typeof contact_152.name === "string" ? contact_152.name.trim() : "linked-" + value_153,
      sourceNpcId: contact_152.sourceNpcId != null ? String(contact_152.sourceNpcId) : "",
      messages: messages_2,
      createdAt: Number(contact_152.createdAt) || updatedAt_2,
      updatedAt: updatedAt_2,
      readAt: Number(contact_152.readAt) || 0
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
window.imApp.normalizeMemoryRecallLimits = function (value_166) {
  const source_10 = value_166 && typeof value_166 === "object" ? value_166 : {},
    normalizeLimit = (candidate, fallback_2 = 30) => {
      const numeric = Math.round(Number(candidate));
      return Number.isFinite(numeric) && numeric > 0 ? Math.min(100, Math.max(1, numeric)) : fallback_2;
    };
  return {
    shortTerm: normalizeLimit(source_10.shortTerm, 30),
    longTerm: normalizeLimit(source_10.longTerm, 30)
  };
};
window.imApp.normalizeXDirectMessageMount = function (mount_3) {
  const fallback_3 = window.imApp.createDefaultXDirectMessageMount(),
    source_11 = mount_3 && typeof mount_3 === "object" && !Array.isArray(mount_3) ? mount_3 : {},
    parsedLimit = Number(source_11.limit);
  return {
    enabled: source_11.enabled !== false,
    limit: Number.isFinite(parsedLimit) ? Math.max(1, Math.min(50, Math.floor(parsedLimit))) : fallback_3.limit,
    dmId: source_11.dmId == null ? "" : String(source_11.dmId)
  };
};
window.imApp.normalizeBstagePopMount = function (mount_4) {
  const source_12 = mount_4 && typeof mount_4 === "object" && !Array.isArray(mount_4) ? mount_4 : {};
  return {
    enabled: source_12.enabled === true,
    teamId: source_12.teamId == null ? "" : String(source_12.teamId),
    memberId: source_12.memberId == null ? "" : String(source_12.memberId)
  };
};
window.imApp.isCharacterSleeping = function (value_175) {
  if (!value_175 || !value_175.memory || !value_175.memory.schedule || !value_175.memory.schedule.enabled) return false;
  const schedule_176 = value_175.memory.schedule,
    value_177 = schedule_176.sleepTime || "23:00",
    value_178 = schedule_176.wakeTime || "07:00";
  if (value_177 === value_178) return false;
  const now_3 = new Date(),
    currentHours = now_3.getHours(),
    currentMinutes = now_3.getMinutes(),
    currentTotalMinutes = currentHours * 60 + currentMinutes,
    parseTime = timeStr => {
      const parts = timeStr.split(":");
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    },
    value_181_182 = parseTime(value_177),
    value_181_183 = parseTime(value_178);
  return value_181_182 < value_181_183 ? currentTotalMinutes >= value_181_182 && currentTotalMinutes < value_181_183 : currentTotalMinutes >= value_181_182 || currentTotalMinutes < value_181_183;
};
window.imApp.normalizeProfileStatusHistory = function (friend_3 = {}) {
  const panel_2 = friend_3?.profilePanel && typeof friend_3.profilePanel === "object" ? friend_3.profilePanel : {},
    hasStatusHistory = Array.isArray(panel_2.statusHistory) && panel_2.statusHistory.length > 0,
    source_13 = hasStatusHistory ? panel_2.statusHistory : Array.isArray(panel_2.thoughtHistory) ? panel_2.thoughtHistory : [],
    thought_2 = String(panel_2.thought || friend_3?.latestThought || "").trim(),
    filter_189 = source_13.map((value_190, index_2) => {
      const sourceItem = value_190 && typeof value_190 === "object" ? value_190 : {},
        thought_3 = String(sourceItem.thought ?? sourceItem.content ?? "").trim(),
        canEnrichCurrent = !hasStatusHistory && index_2 === 0 && thought_3 && thought_3 === thought_2,
        value_195 = key_2 => {
          if (typeof sourceItem[key_2] === "number" && Number.isFinite(sourceItem[key_2])) return sourceItem[key_2];
          if (canEnrichCurrent && typeof panel_2[key_2] === "number" && Number.isFinite(panel_2[key_2])) return panel_2[key_2];
          return null;
        };
      return {
        id: String(sourceItem.id || "status-" + (sourceItem.createdAt || sourceItem.time || index_2)),
        thought: thought_3,
        affection: value_195("affection"),
        affectionChange: value_195("affectionChange"),
        createdAt: sourceItem.createdAt || sourceItem.time || null,
        legacy: sourceItem.legacy === true || !hasStatusHistory && !canEnrichCurrent
      };
    }).filter(value_197 => value_197.thought);
  return filter_189.length === 0 && thought_2 && filter_189.push({
    id: "status-current-" + (friend_3?.id || "friend"),
    thought: thought_2,
    affection: typeof panel_2.affection === "number" ? panel_2.affection : 0,
    affectionChange: typeof panel_2.affectionChange === "number" ? panel_2.affectionChange : 0,
    createdAt: null,
    legacy: false
  }), filter_189;
};
window.imApp.migrateSingleChatProfileStatus = function (friend_4 = {}) {
  if (!friend_4 || friend_4.type === "group") return false;
  const legacyKeys = ["location", "action", "mood", "expression"];
  let enabled_200 = false;
  const stripLegacyFields = target_2 => {
      if (!target_2 || typeof target_2 !== "object") return;
      legacyKeys.forEach(value_202 => {
        Object.prototype.hasOwnProperty.call(target_2, value_202) && (delete target_2[value_202], enabled_200 = true);
      });
    },
    panel = friend_4.profilePanel;
  return panel && typeof panel === "object" && (stripLegacyFields(panel), Object.prototype.hasOwnProperty.call(panel, "events") && (delete panel.events, enabled_200 = true), ["statusHistory", "thoughtHistory"].forEach(historyKey => {
    if (!Array.isArray(panel[historyKey])) return;
    panel[historyKey].forEach(stripLegacyFields);
  })), enabled_200;
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
window.imApp.normalizeFavoriteUserMessages = function (value_204) {
  const seenMessageIds = new Set();
  return (Array.isArray(value_204) ? value_204 : []).map((item_4, value_207) => {
    if (!item_4 || typeof item_4 !== "object") return null;
    const messageId_2 = String(item_4.messageId || "").trim(),
      messageText_2 = String(item_4.messageText || "").trim(),
      reason_2 = String(item_4.reason || "").trim();
    if (!messageId_2 || !messageText_2 || !reason_2 || seenMessageIds.has(messageId_2)) return null;
    seenMessageIds.add(messageId_2);
    const createdAt_2 = Math.max(0, Number(item_4.createdAt) || 0),
      messageTimestamp_2 = Math.max(0, Number(item_4.messageTimestamp) || 0);
    return {
      id: String(item_4.id || "favorite-" + messageId_2 + "-" + (createdAt_2 || value_207)),
      messageId: messageId_2,
      messageText: messageText_2,
      messageType: item_4.messageType === "voice_message" ? "voice_message" : "text",
      messageTimestamp: messageTimestamp_2,
      reason: reason_2,
      createdAt: createdAt_2,
      sourceApiRunId: String(item_4.sourceApiRunId || "")
    };
  }).filter(Boolean).sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0));
};
window.imApp.normalizeChatBlockState = function (value_213) {
  const value_214 = value_213 && typeof value_213 === "object" ? value_213 : {};
  return {
    userBlocksChar: value_214.userBlocksChar === true,
    charBlocksUser: value_214.charBlocksUser === true,
    userBlockedAt: Math.max(0, Number(value_214.userBlockedAt) || 0),
    charBlockedAt: Math.max(0, Number(value_214.charBlockedAt) || 0),
    userBlockReason: String(value_214.userBlockReason || "").trim().slice(0, 500),
    charBlockReason: String(value_214.charBlockReason || "").trim().slice(0, 500)
  };
};
window.imApp.normalizePendingLovesUnbindRequest = function (item_5) {
  if (!item_5 || typeof item_5 !== "object") return null;
  const requestId_2 = String(item_5.requestId || item_5.id || "").trim(),
    createdAt_3 = Math.max(0, Number(item_5.createdAt) || 0);
  if (!requestId_2 || !createdAt_3 || item_5.status !== "pending") return null;
  return {
    requestId: requestId_2,
    createdAt: createdAt_3,
    status: "pending"
  };
};
window.imApp.getPendingLovesUnbindRequest = function (friend_6) {
  const pendingLovesUnbindRequest_219 = window.imApp.normalizePendingLovesUnbindRequest(friend_6?.pendingLovesUnbindRequest);
  if (!pendingLovesUnbindRequest_219) return null;
  const result_220 = (Array.isArray(friend_6?.messages) ? friend_6.messages : []).find(value_221 => {
    return value_221?.type === "loves_unbind_request" && String(value_221.requestId || value_221.id || "") === pendingLovesUnbindRequest_219.requestId && value_221.requestStatus === "pending";
  });
  return result_220 || {
    id: pendingLovesUnbindRequest_219.requestId,
    requestId: pendingLovesUnbindRequest_219.requestId,
    type: "loves_unbind_request",
    role: "user",
    requestStatus: "pending",
    timestamp: pendingLovesUnbindRequest_219.createdAt
  };
};
window.imApp.createLovesUnbindRequestMessage = function (categoryName_2, value_223 = Date.now()) {
  const trim_224 = String(categoryName_2 || "").trim();
  if (!trim_224) return null;
  return {
    id: trim_224,
    requestId: trim_224,
    role: "user",
    type: "loves_unbind_request",
    requestStatus: "pending",
    content: "User 申请解除 Loves 关系",
    text: "申请解除 Loves 关系",
    timestamp: Math.max(0, Number(value_223) || Date.now())
  };
};
window.imApp.reconcilePendingLovesUnbindRequest = async function (value_225) {
  const targetId_2 = value_225?.id ?? value_225;
  if (targetId_2 == null) return null;
  let value_227 = window.imApp.getFriendById?.(targetId_2) || value_225;
  if (!value_227 || value_227.type === "group" || value_227.type === "official") return null;
  window.imApp.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(value_227));
  value_227 = window.imApp.getFriendById?.(targetId_2) || value_227;
  const pendingLovesUnbindRequest_228 = window.imApp.normalizePendingLovesUnbindRequest(value_227?.pendingLovesUnbindRequest);
  if (!pendingLovesUnbindRequest_228) return null;
  const selected = (Array.isArray(value_227.messages) ? value_227.messages : []).find(value_231 => {
    return value_231?.type === "loves_unbind_request" && String(value_231.requestId || value_231.id || "") === pendingLovesUnbindRequest_228.requestId && value_231.requestStatus === "pending";
  });
  if (selected) return selected;
  const lovesUnbindRequestMessage = window.imApp.createLovesUnbindRequestMessage(pendingLovesUnbindRequest_228.requestId, pendingLovesUnbindRequest_228.createdAt);
  if (!lovesUnbindRequestMessage || !window.imApp.appendFriendMessage) return null;
  const value_230 = await window.imApp.appendFriendMessage(value_227.id, lovesUnbindRequestMessage, {
    silent: true
  });
  return value_230 ? lovesUnbindRequestMessage : null;
};
window.imApp.submitLovesUnbindRequest = async function (value_232) {
  const value_233 = value_232?.id ?? value_232;
  let value_234 = window.imApp.getFriendById?.(value_233) || value_232;
  if (!value_234 || value_234.type === "group" || value_234.type === "official" || value_234.hasLovesSpace !== true) return null;
  window.imApp.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(value_234));
  value_234 = window.imApp.getFriendById?.(value_233) || value_234;
  if (!value_234 || value_234.type === "group" || value_234.type === "official" || value_234.hasLovesSpace !== true) return null;
  if (window.imApp.getPendingLovesUnbindRequest(value_234)) return null;
  const createdAt_7 = Date.now(),
    requestId_3 = window.imChat?.createMessageId ? window.imChat.createMessageId("loves-unbind") : "loves-unbind-" + createdAt_7,
    targetMessage_2 = window.imApp.createLovesUnbindRequestMessage(requestId_3, createdAt_7);
  if (!targetMessage_2) return null;
  let enabled_238 = false;
  const value_239 = await window.imApp.commitScopedFriendChange(value_234.id, targetFriend_2 => {
    if (targetFriend_2.hasLovesSpace !== true || window.imApp.getPendingLovesUnbindRequest(targetFriend_2)) return;
    if (!Array.isArray(targetFriend_2.messages)) targetFriend_2.messages = [];
    targetFriend_2.pendingLovesUnbindRequest = {
      requestId: requestId_3,
      createdAt: createdAt_7,
      status: "pending"
    };
    targetFriend_2.messages.push(targetMessage_2);
    enabled_238 = true;
  }, {
    silent: true,
    immediate: true,
    metaOnly: false,
    syncActive: true
  });
  if (!value_239 || !enabled_238) return null;
  const value_240 = window.imApp.getFriendById?.(value_234.id) || value_234,
    querySelector_241 = document.querySelector("#chat-interface-" + value_234.id + " .ins-chat-messages");
  return querySelector_241 && window.imChat?.rerenderChatContainer && window.imChat.rerenderChatContainer(value_240, querySelector_241, {
    scroll: true
  }), targetMessage_2;
};
window.imApp.resolveLovesUnbindRequest = async function (value_243, categoryName_3, value_245, value_246 = {}) {
  const value_247 = value_243?.id ?? value_243;
  let value_248 = window.imApp.getFriendById?.(value_247) || value_243;
  const requestId_4 = String(categoryName_3 || "").trim(),
    decision_3 = value_245 === "accept" ? "accept" : value_245 === "reject" ? "reject" : "";
  if (!value_248 || !requestId_4 || !decision_3) return false;
  await window.imApp.reconcilePendingLovesUnbindRequest?.(value_248);
  value_248 = window.imApp.getFriendById?.(value_247) || value_248;
  if (!value_248) return false;
  const decidedAt_2 = Date.now();
  let message_5 = false;
  const excludedRecord = await window.imApp.commitScopedFriendChange(value_248.id, value_256 => {
    const pendingLovesUnbindRequest_257 = window.imApp.normalizePendingLovesUnbindRequest(value_256.pendingLovesUnbindRequest),
      result_258 = (value_256.messages || []).find(value_259 => {
        return value_259?.type === "loves_unbind_request" && String(value_259.requestId || value_259.id || "") === requestId_4;
      });
    if (!pendingLovesUnbindRequest_257 || pendingLovesUnbindRequest_257.requestId !== requestId_4 || !result_258 || result_258.requestStatus !== "pending") return;
    result_258.requestStatus = decision_3 === "accept" ? "accepted" : "rejected";
    result_258.decision = decision_3;
    result_258.decidedAt = decidedAt_2;
    value_256.pendingLovesUnbindRequest = null;
    decision_3 === "accept" && (value_256.hasLovesSpace = false, value_256.pendingLovesInvite = false);
    value_256.messages.push({
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
      apiRunId: String(value_246.apiRunId || "")
    });
    message_5 = true;
  }, {
    silent: true,
    immediate: true,
    metaOnly: false,
    syncActive: true
  });
  if (!excludedRecord || !message_5) return false;
  const value_254 = window.imApp.getFriendById?.(value_248.id) || value_248,
    querySelector_255 = document.querySelector("#chat-interface-" + value_248.id + " .ins-chat-messages");
  return querySelector_255 && window.imChat?.rerenderChatContainer && window.imChat.rerenderChatContainer(value_254, querySelector_255, {
    scroll: true
  }), window.lovesApp?.handleUnbindDecision?.(value_254, decision_3), true;
};
window.imApp.getPendingUnblockRequest = function (friend_7, value_261) {
  const value_262 = value_261 === "assistant" ? "assistant" : "user";
  return (Array.isArray(friend_7?.messages) ? friend_7.messages : []).slice().reverse().find(value_263 => value_263?.type === "unblock_request" && value_263.requesterRole === value_262 && value_263.requestStatus === "pending") || null;
};
window.imApp.createChatBlockNotice = function (noticeKind_4, timestamp_5 = Date.now()) {
  const options_266 = {
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
    content: options_266[noticeKind_4] || "拉黑状态已更新",
    text: options_266[noticeKind_4] || "拉黑状态已更新",
    timestamp: timestamp_5
  };
};
window.imApp.commitChatBlockState = async function (value_267, value_268, value_269, item_6 = {}) {
  const value_271 = window.imApp.getFriendById?.(value_267) || value_267;
  if (!value_271 || value_271.type === "group" || value_271.type === "official") return false;
  const value_272 = value_268 === "userBlocksChar",
    value_273 = value_272 ? "userBlocksChar" : "charBlocksUser",
    value_274 = value_272 ? "userBlockedAt" : "charBlockedAt",
    value_275 = value_272 ? "userBlockReason" : "charBlockReason",
    value_276 = value_269 ? value_272 ? "user_blocked_char" : "char_blocked_user" : value_272 ? "user_unblocked_char" : "char_unblocked_user",
    decidedAt_3 = Date.now(),
    value_278 = await window.imApp.commitScopedFriendChange(value_271.id, targetFriend_3 => {
      targetFriend_3.blockState = window.imApp.normalizeChatBlockState(targetFriend_3.blockState);
      targetFriend_3.blockState[value_273] = value_269 === true;
      targetFriend_3.blockState[value_274] = value_269 ? decidedAt_3 : 0;
      targetFriend_3.blockState[value_275] = value_269 ? String(item_6.reason || "").trim().slice(0, 500) : "";
      if (!Array.isArray(targetFriend_3.messages)) targetFriend_3.messages = [];
      !value_269 && value_272 && targetFriend_3.messages.forEach(value_282 => {
        value_282?.type === "unblock_request" && value_282.requesterRole === "assistant" && value_282.requestStatus === "pending" && (value_282.requestStatus = item_6.requestStatus || "resolved", value_282.decidedAt = decidedAt_3, value_282.decision = item_6.decision || "unblocked");
      });
      !value_269 && !value_272 && targetFriend_3.messages.forEach(value_283 => {
        value_283?.type === "unblock_request" && value_283.requesterRole === "user" && value_283.requestStatus === "pending" && (value_283.requestStatus = item_6.requestStatus || "accepted", value_283.decidedAt = decidedAt_3, value_283.decision = item_6.decision || "accept");
      });
      const targetMessage_3 = window.imApp.createChatBlockNotice(value_276, decidedAt_3);
      if (value_269 && item_6.reason) targetMessage_3.payload = {
        reason: String(item_6.reason).trim().slice(0, 500)
      };
      targetFriend_3.messages.push(targetMessage_3);
    }, {
      silent: true,
      immediate: true,
      metaOnly: false,
      syncActive: true,
      syncSettings: true
    }),
    value_279 = window.imApp.getFriendById?.(value_271.id) || value_271,
    querySelector_280 = document.querySelector("#chat-interface-" + value_271.id + " .ins-chat-messages");
  return value_278 && querySelector_280 && window.imChat?.rerenderChatContainer && window.imChat.rerenderChatContainer(value_279, querySelector_280, {
    scroll: true
  }), value_278;
};
window.imApp.submitUnblockRequest = async function (value_284, value_285, categoryName_4, value_287 = {}) {
  const value_288 = window.imApp.getFriendById?.(value_284) || value_284,
    value_289 = value_285 === "assistant" ? "assistant" : "user",
    slice_290 = String(categoryName_4 || "").trim().slice(0, 500);
  if (!value_288 || value_288.type === "group" || value_288.type === "official" || !slice_290) return null;
  if (window.imApp.getPendingUnblockRequest(value_288, value_289)) return null;
  const timestamp_6 = Date.now(),
    options_292 = {
      id: window.imChat?.createMessageId ? window.imChat.createMessageId("unblock") : "unblock-" + timestamp_6,
      role: value_289,
      type: "unblock_request",
      requesterRole: value_289,
      requestText: slice_290,
      requestStatus: "pending",
      content: slice_290,
      timestamp: timestamp_6,
      apiRunId: value_287.apiRunId || ""
    },
    value_293 = await window.imApp.appendFriendMessage(value_288.id, options_292, {
      silent: true,
      immediate: true
    });
  if (!value_293) return null;
  const value_294 = window.imApp.getFriendById?.(value_288.id) || value_288,
    querySelector_295 = document.querySelector("#chat-interface-" + value_288.id + " .ins-chat-messages");
  return querySelector_295 && window.imChat?.rerenderChatContainer && window.imChat.rerenderChatContainer(value_294, querySelector_295, {
    scroll: true
  }), options_292;
};
window.imApp.resolveUnblockRequest = async function (value_296, value_297, value_298) {
  const excludedRecord_2 = window.imApp.getFriendById?.(value_296) || value_296,
    decision_2 = value_298 === "accept" ? "accept" : value_298 === "reject" ? "reject" : "";
  if (!excludedRecord_2 || !decision_2) return false;
  const decidedAt_4 = Date.now();
  let message_6 = "";
  const excludedRecord_3 = await window.imApp.commitScopedFriendChange(excludedRecord_2.id, value_306 => {
    const result_307 = (value_306.messages || []).find(value_308 => String(value_308?.id || "") === String(value_297));
    if (!result_307 || result_307.type !== "unblock_request" || result_307.requestStatus !== "pending") return;
    message_6 = result_307.requesterRole;
    result_307.requestStatus = decision_2 === "accept" ? "accepted" : "rejected";
    result_307.decision = decision_2;
    result_307.decidedAt = decidedAt_4;
    if (decision_2 === "accept") {
      value_306.blockState = window.imApp.normalizeChatBlockState(value_306.blockState);
      result_307.requesterRole === "assistant" ? (value_306.blockState.userBlocksChar = false, value_306.blockState.userBlockedAt = 0, value_306.blockState.userBlockReason = "") : (value_306.blockState.charBlocksUser = false, value_306.blockState.charBlockedAt = 0, value_306.blockState.charBlockReason = "");
      const value_309 = result_307.requesterRole === "assistant" ? "user_unblocked_char" : "char_unblocked_user";
      value_306.messages.push(window.imApp.createChatBlockNotice(value_309, decidedAt_4));
    }
  }, {
    silent: true,
    immediate: true,
    metaOnly: false,
    syncActive: true,
    syncSettings: true
  });
  if (!excludedRecord_3 || !message_6) return false;
  const value_304 = window.imApp.getFriendById?.(excludedRecord_2.id) || excludedRecord_2,
    querySelector_305 = document.querySelector("#chat-interface-" + excludedRecord_2.id + " .ins-chat-messages");
  return querySelector_305 && window.imChat?.rerenderChatContainer && window.imChat.rerenderChatContainer(value_304, querySelector_305, {
    scroll: true
  }), true;
};
window.imApp.createMemoryRequestMessage = function (value_310, message_311 = {}) {
  const entry_2 = value_310 && typeof value_310 === "object" ? value_310 : {},
    value_313 = (categoryName_5, value_319 = 1200) => String(categoryName_5 || "").trim().slice(0, value_319),
    content_6 = value_313(entry_2.content, 1800);
  if (!content_6) return null;
  const timestamp_7 = Number(message_311.timestamp) || Date.now(),
    value_313_316 = value_313(message_311.requestId || (window.imChat?.createMessageId ? window.imChat.createMessageId("memory-request") : "memory-request-" + timestamp_7 + "-" + Math.random().toString(36).slice(2, 8)), 160);
  if (!value_313_316) return null;
  const normalizeMemoryTriggerKeywords_317 = window.imChat?.normalizeMemoryTriggerKeywords;
  return {
    id: value_313_316,
    memoryRequestId: value_313_316,
    role: "assistant",
    type: "memory_request",
    requestStatus: "pending",
    excludedFromContext: true,
    content: content_6,
    timestamp: timestamp_7,
    apiRunId: String(message_311.apiRunId || ""),
    memoryPayload: {
      title: value_313(entry_2.title || "珍视回忆", 120) || "珍视回忆",
      content: content_6,
      detail: value_313(entry_2.detail, 1800),
      reason: value_313(entry_2.reason, 1200),
      createdAt: value_313(entry_2.createdAt || message_311.createdAt, 120),
      sourceThought: value_313(entry_2.sourceThought, 1800),
      triggerKeywords: typeof normalizeMemoryTriggerKeywords_317 === "function" ? normalizeMemoryTriggerKeywords_317(entry_2.triggerKeywords || []) : Array.isArray(entry_2.triggerKeywords) ? entry_2.triggerKeywords.map(value_320 => value_313(value_320, 32)).filter(Boolean).slice(0, 6) : []
    }
  };
};
const pendingMemoryRequestDecisions = new Set();
window.imApp.resolveMemoryRequest = async function (value_321, categoryName_6, value_323) {
  const value_324 = window.imApp.getFriendById?.(value_321) || value_321,
    sourceEventId_2 = String(categoryName_6 || "").trim();
  if (!value_324 || value_324.type === "group" || !sourceEventId_2 || !["confirm", "cancel"].includes(value_323) || !window.imStorage?.commitMemoryRequestDecision) return false;
  const key_3 = value_324.id + ":" + sourceEventId_2;
  if (pendingMemoryRequestDecisions.has(key_3)) return false;
  pendingMemoryRequestDecisions.add(key_3);
  try {
    const value_327 = async () => {
      const result_328 = (Array.isArray(value_324.messages) ? value_324.messages : []).find(value_333 => value_333?.type === "memory_request" && String(value_333.memoryRequestId || value_333.id || "") === sourceEventId_2);
      if (!result_328 || result_328.requestStatus !== "pending") return false;
      const message_329 = result_328.memoryPayload && typeof result_328.memoryPayload === "object" ? result_328.memoryPayload : {},
        content_7 = String(message_329.content || result_328.content || "").trim();
      if (value_323 === "confirm" && !content_7) return false;
      let memory_6 = null;
      if (value_323 === "confirm") {
        const memory_2 = value_324.memory && typeof value_324.memory === "object" ? value_324.memory : window.imApp.createDefaultMemory(),
          options_335 = {
            id: "cherished-" + sourceEventId_2,
            title: String(message_329.title || "珍视回忆").trim() || "珍视回忆",
            content: content_7,
            detail: String(message_329.detail || "").trim(),
            reason: String(message_329.reason || "").trim(),
            sourceEventId: sourceEventId_2,
            createdAt: String(message_329.createdAt || "").trim(),
            sourceThought: String(message_329.sourceThought || value_324.profilePanel?.thought || value_324.latestThought || "").trim(),
            triggerKeywords: typeof window.imChat?.normalizeMemoryTriggerKeywords === "function" ? window.imChat.normalizeMemoryTriggerKeywords(message_329.triggerKeywords || []) : Array.isArray(message_329.triggerKeywords) ? message_329.triggerKeywords : []
          },
          value_336 = Array.isArray(memory_2.cherishedEntries) ? memory_2.cherishedEntries : [],
          some_337 = value_336.some(message_340 => message_340 && (String(message_340.sourceEventId || "") === sourceEventId_2 || String(message_340.content || "").trim() === options_335.content)),
          trim_338 = [options_335.title ? "【" + options_335.title + "】" : "", options_335.content, options_335.reason ? "原因：" + options_335.reason : ""].filter(Boolean).join("\n").trim(),
          trim_339 = String(memory_2.cherished || "").trim();
        memory_6 = {
          ...memory_2,
          cherishedEntries: some_337 ? value_336 : [...value_336, options_335],
          cherished: trim_338 && !trim_339.includes(options_335.content) ? trim_339 ? trim_339 + "\n\n" + trim_338 : trim_338 : trim_339
        };
      }
      const value_332 = await window.imStorage.commitMemoryRequestDecision(value_324.id, result_328, memory_6, value_323);
      if (!value_332) return false;
      if (memory_6) {
        value_324.memory = memory_6;
        const result_341 = window.imApp.saveState?.pendingFriendPatches?.get(String(value_324.id));
        result_341 && Object.prototype.hasOwnProperty.call(result_341, "memory") && (result_341.memory = memory_6);
      }
      return result_328.requestStatus = value_332.status, result_328.decidedAt = value_332.decidedAt, true;
    };
    return window.imApp.runFriendPersistenceTask ? await window.imApp.runFriendPersistenceTask(value_324.id, value_327) : await value_327();
  } catch (value_342) {
    return console.error("Failed to resolve memory request", value_342), false;
  } finally {
    pendingMemoryRequestDecisions["delete"](key_3);
  }
};
window.imApp.normalizeUserPhoneAccess = function (mount_5) {
  const source_14 = mount_5 && typeof mount_5 === "object" && !Array.isArray(mount_5) ? mount_5 : {},
    value_345 = (categoryName_7, value_353 = 500) => String(categoryName_7 || "").trim().slice(0, value_353),
    value_346 = (value_354, value_355 = 200) => {
      const value_356 = new Set();
      return (Array.isArray(value_354) ? value_354 : []).map(value_357 => value_345(value_357, 160)).filter(value_358 => {
        if (!value_358 || value_356.has(value_358)) return false;
        return value_356.add(value_358), true;
      }).slice(0, value_355);
    },
    privateFindings_2 = (Array.isArray(source_14.privateFindings) ? source_14.privateFindings : []).map((item_7, value_360) => {
      if (!item_7 || typeof item_7 !== "object") return null;
      const charIds_2 = value_346(item_7.charIds, 100),
        summary_3 = value_345(item_7.summary, 2400);
      if (!summary_3 || charIds_2.length === 0) return null;
      const createdAt_4 = Math.max(0, Number(item_7.createdAt) || 0);
      return {
        id: value_345(item_7.id, 180) || "user-phone-finding-" + (createdAt_4 || value_360),
        createdAt: createdAt_4,
        triggerUserMessageId: value_345(item_7.triggerUserMessageId, 180),
        apiRunId: value_345(item_7.apiRunId, 180),
        source: value_345(item_7.source, 80),
        reason: value_345(item_7.reason, 300),
        charIds: charIds_2,
        scopeKey: value_345(item_7.scopeKey, 2000),
        summary: summary_3,
        timeAssessment: value_345(item_7.timeAssessment, 1200),
        emotionalReaction: value_345(item_7.emotionalReaction, 800),
        responseHints: (Array.isArray(item_7.responseHints) ? item_7.responseHints : []).map(value_364 => value_345(value_364, 500)).filter(Boolean).slice(0, 8)
      };
    }).filter(Boolean).sort((value_365, value_366) => value_365.createdAt - value_366.createdAt).slice(-20),
    accessLog_2 = (Array.isArray(source_14.accessLog) ? source_14.accessLog : []).map((item_8, value_368) => {
      if (!item_8 || typeof item_8 !== "object") return null;
      const createdAt_5 = Math.max(0, Number(item_8.createdAt) || 0);
      return {
        id: value_345(item_8.id, 180) || "user-phone-log-" + (createdAt_5 || value_368),
        createdAt: createdAt_5,
        status: item_8.status === "success" ? "success" : "failed",
        mode: item_8.mode === "auto" ? "auto" : "chat",
        outcome: ["sent", "silent", "used", "failed"].includes(item_8.outcome) ? item_8.outcome : item_8.status === "success" ? "used" : "failed",
        source: value_345(item_8.source, 80),
        apiRunId: value_345(item_8.apiRunId, 180),
        reason: value_345(item_8.reason, 300),
        contacts: (Array.isArray(item_8.contacts) ? item_8.contacts : []).map(value_370 => ({
          id: value_345(value_370?.id, 160),
          remark: value_345(value_370?.remark, 160)
        })).filter(value_371 => value_371.id || value_371.remark).slice(0, 100),
        error: value_345(item_8.error, 500)
      };
    }).filter(Boolean).sort((value_372, value_373) => value_372.createdAt - value_373.createdAt).slice(-50),
    value_349 = source_14.autoTrigger && typeof source_14.autoTrigger === "object" ? source_14.autoTrigger : {},
    frequency_2 = ["low", "medium", "high"].includes(value_349.frequency) ? value_349.frequency : "medium",
    enabled_5 = source_14.enabled === true;
  return {
    enabled: enabled_5,
    apiPresetId: value_345(source_14.apiPresetId, 180),
    allowedCharIds: value_346(source_14.allowedCharIds, 200),
    autoTrigger: {
      enabled: enabled_5 && value_349.enabled === true,
      frequency: frequency_2,
      nextRunAt: enabled_5 && value_349.enabled === true ? Math.max(0, Number(value_349.nextRunAt) || 0) : 0,
      lastRunAt: Math.max(0, Number(value_349.lastRunAt) || 0)
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
    value_377 = normalized_2.type === "official";
  normalized_2.officialConversationActive = value_377 && normalized_2.officialConversationActive === true;
  normalized_2.officialApiPresetId = value_377 ? String(normalized_2.officialApiPresetId || "").trim() : "";
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
    presets_4 = (Array.isArray(imagePromptConfig_2.presets) ? imagePromptConfig_2.presets : []).map((preset_3, value_393) => {
      if (!preset_3 || typeof preset_3 !== "object") return null;
      const name_4 = String(preset_3.name || "").trim().slice(0, 80),
        slice_395 = String(preset_3.basePrompt ?? preset_3.prompt ?? "").trim().slice(0, 8000);
      if (!name_4 || !slice_395) return null;
      const id_4 = String(preset_3.id || "image-preset-" + normalized_2.id + "-" + value_393).trim();
      if (!id_4 || promptPresetIds.has(id_4)) return null;
      promptPresetIds.add(id_4);
      const createdAt_6 = Math.max(0, Number(preset_3.createdAt) || Date.now());
      return {
        id: id_4,
        name: name_4,
        prompt: slice_395,
        basePrompt: slice_395,
        charAppearance: String(preset_3.charAppearance || "").trim().slice(0, 4000),
        userAppearance: String(preset_3.userAppearance || "").trim().slice(0, 4000),
        artistPrompt: String(preset_3.artistPrompt || "").trim().slice(0, 4000),
        negativePrompt: String(preset_3.negativePrompt || "").trim().slice(0, 4000),
        createdAt: createdAt_6,
        updatedAt: Math.max(createdAt_6, Number(preset_3.updatedAt) || createdAt_6)
      };
    }).filter(Boolean).slice(0, 30),
    activePresetId_2 = promptPresetIds.has(String(imagePromptConfig_2.activePresetId || "").trim()) ? String(imagePromptConfig_2.activePresetId).trim() : "",
    slice_382 = String(imagePromptConfig_2.basePrompt ?? imagePromptConfig_2.lastPrompt ?? "").trim().slice(0, 8000);
  normalized_2.imagePromptConfig = {
    charAppearance: String(imagePromptConfig_2.charAppearance || "").trim().slice(0, 4000),
    userAppearance: String(imagePromptConfig_2.userAppearance || "").trim().slice(0, 4000),
    artistPrompt: String(imagePromptConfig_2.artistPrompt || "").trim().slice(0, 4000),
    negativePrompt: String(imagePromptConfig_2.negativePrompt || "").trim().slice(0, 4000),
    basePrompt: slice_382,
    lastPrompt: slice_382,
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
      const value_402 = (value_12, value_405 = 1200) => String(value_12 || "").replace(/\s+/g, " ").trim().slice(0, value_405),
        visits_2 = (Array.isArray(target_3.visits) ? target_3.visits : []).map(value_406 => {
          if (!value_406 || typeof value_406 !== "object") return null;
          const charId_2 = value_402(value_406.charId, 160),
            remark_2 = value_402(value_406.remark, 160),
            innerOs_2 = String(value_406.innerOs || "").replace(/\s+/g, " ").trim(),
            durationSeconds_2 = Math.min(120, Math.max(1, Math.round(Number(value_406.durationSeconds) || 1)));
          if (!charId_2 || !remark_2 || !innerOs_2) return null;
          return {
            charId: charId_2,
            remark: remark_2,
            durationSeconds: durationSeconds_2,
            innerOs: innerOs_2
          };
        }).filter(Boolean).slice(0, 100);
      target_3.role = "assistant";
      target_3.content = "查手机记录";
      target_3.excludedFromContext = true;
      target_3.phoneAccessMode = target_3.phoneAccessMode === "auto" ? "auto" : "chat";
      target_3.visits = visits_2;
      target_3.totalDurationSeconds = visits_2.reduce((value_411, value_412) => value_411 + value_412.durationSeconds, 0);
      target_3.apiRunId = value_402(target_3.apiRunId, 180);
      return;
    }
    if (target_3.type === "system_notice" && target_3.noticeKind === "user_phone_access") {
      target_3.role = "system";
      target_3.excludedFromContext = true;
      target_3.apiRunId = String(target_3.apiRunId || "").trim().slice(0, 180);
      return;
    }
    if (target_3.type === "memory_request") {
      const value_413 = (categoryName_8, value_417 = 1200) => String(categoryName_8 || "").trim().slice(0, value_417),
        entry_3 = target_3.memoryPayload && typeof target_3.memoryPayload === "object" ? target_3.memoryPayload : {},
        memoryRequestId_2 = value_413(target_3.memoryRequestId || target_3.id || "memory-request-" + (target_3.timestamp || 0), 160),
        content_8 = value_413(entry_3.content || target_3.requestText || target_3.content, 1800);
      target_3.role = "assistant";
      target_3.excludedFromContext = true;
      target_3.memoryRequestId = memoryRequestId_2;
      target_3.requestStatus = ["pending", "confirmed", "cancelled"].includes(target_3.requestStatus) ? target_3.requestStatus : Array.isArray(normalized_2.memory?.cherishedEntries) && normalized_2.memory.cherishedEntries.some(item => String(item?.sourceEventId || "") === memoryRequestId_2) ? "confirmed" : "pending";
      target_3.memoryPayload = {
        title: value_413(entry_3.title || "珍视回忆", 120) || "珍视回忆",
        content: content_8,
        detail: value_413(entry_3.detail, 1800),
        reason: value_413(entry_3.reason, 1200),
        createdAt: value_413(entry_3.createdAt || target_3.requestTime, 120),
        sourceThought: value_413(entry_3.sourceThought, 1800),
        triggerKeywords: Array.isArray(entry_3.triggerKeywords) ? entry_3.triggerKeywords.map(value_418 => value_413(value_418, 32)).filter(Boolean).slice(0, 6) : []
      };
      return;
    }
    if (target_3.type === "system_notice" || target_3.type && target_3.type !== "text") return;
    const value_399 = Number(target_3.timestamp) || 0,
      value_400 = target_3.role === "user" && normalized_2.blockState.charBlocksUser === true && normalized_2.blockState.charBlockedAt > 0 && value_399 >= normalized_2.blockState.charBlockedAt,
      value_401 = target_3.role === "assistant" && normalized_2.blockState.userBlocksChar === true && normalized_2.blockState.userBlockedAt > 0 && value_399 >= normalized_2.blockState.userBlockedAt;
    target_3.deliveryStatus !== "blocked" && (value_400 || value_401) && (target_3.deliveryStatus = "blocked", target_3.excludedFromContext = true, target_3.blockedDirection = value_400 ? "char_blocks_user" : "user_blocks_char");
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
  const value_386 = normalized_2.statusTemplate && typeof normalized_2.statusTemplate === "object";
  if (isGroupChat_2) {
    normalized_2.statusTemplate = null;
    delete normalized_2._statusTemplateNeedsPersistence;
  } else {
    if (value_386) {
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
  normalized_2.leftGroupMemberSnapshot = isGroupChat_2 && Array.isArray(normalized_2.leftGroupMemberSnapshot) ? normalized_2.leftGroupMemberSnapshot.filter(item_9 => item_9 && item_9.id != null).map(item_10 => ({
    id: item_10.id,
    nickname: item_10.nickname || "",
    realName: item_10.realName || ""
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
    statusHistory: Array.isArray(normalized_2.profilePanel.statusHistory) ? normalized_2.profilePanel.statusHistory.map(item_11 => item_11 && typeof item_11 === "object" ? {
      ...item_11
    } : item_11) : normalized_2.profilePanel.statusHistory,
    thoughtHistory: Array.isArray(normalized_2.profilePanel.thoughtHistory) ? normalized_2.profilePanel.thoughtHistory.map(item_12 => item_12 && typeof item_12 === "object" ? {
      ...item_12
    } : item_12) : normalized_2.profilePanel.thoughtHistory
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
    shortTermEntries: Array.isArray(memory_3.shortTermEntries) ? memory_3.shortTermEntries.map((entry_6, value_427) => ({
      id: entry_6?.id != null ? entry_6.id : "shortterm-" + value_427,
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
    longTermEntries: Array.isArray(memory_3.longTermEntries) ? memory_3.longTermEntries.map((existing_2, value_433) => ({
      id: existing_2?.id != null ? existing_2.id : "longterm-" + value_433,
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
      const max_435 = Math.max(0, Number(memory_3.lastSummaryMessageCount) || 0),
        item_13 = memory_3.summaryCursor && typeof memory_3.summaryCursor === "object" ? memory_3.summaryCursor : {};
      return {
        messageId: String(item_13.messageId || "").trim(),
        order: Number.isFinite(Number(item_13.order)) ? Number(item_13.order) : -1,
        count: Math.max(0, Number.isFinite(Number(item_13.count)) ? Number(item_13.count) : max_435)
      };
    })(),
    cherished: memory_3.cherished || defaultMemory.cherished,
    cherishedEntries: Array.isArray(memory_3.cherishedEntries) ? memory_3.cherishedEntries.map((message_437, value_438) => ({
      id: message_437?.id != null ? message_437.id : "cherished-" + value_438,
      title: message_437?.title || "长期记忆",
      content: message_437?.content || "",
      detail: message_437?.detail || "",
      reason: message_437?.reason || "",
      sourceEventId: message_437?.sourceEventId || "",
      createdAt: message_437?.createdAt || "",
      sourceThought: message_437?.sourceThought || "",
      triggerKeywords: Array.isArray(message_437?.triggerKeywords) ? message_437.triggerKeywords.map(categoryName_14 => String(categoryName_14 || "").trim()).filter(Boolean) : message_437?.keyword ? [String(message_437.keyword).trim()] : []
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
    crossGroupMemorySettings: memory_3.crossGroupMemorySettings && typeof memory_3.crossGroupMemorySettings === "object" && !Array.isArray(memory_3.crossGroupMemorySettings) ? Object.fromEntries(Object.entries(memory_3.crossGroupMemorySettings).map(([value_443, value_444]) => [value_443, value_444 !== false])) : defaultMemory.crossGroupMemorySettings
  }, normalized_2;
};
window.imApp.applyGeneratedShortTermMemory = function (friend_9, entry_7, options_3 = {}) {
  if (!friend_9 || !entry_7) return null;
  friend_9.memory = window.imApp.normalizeFriendData(friend_9).memory;
  if (!Array.isArray(friend_9.memory.shortTermEntries)) friend_9.memory.shortTermEntries = [];
  const startDate = options_3.now instanceof Date ? options_3.now : new Date(options_3.now || Date.now()),
    value_449 = value_454 => String(value_454).padStart(2, "0"),
    lastActivatedAt_2 = options_3.nowString || startDate.getFullYear() + "年" + value_449(startDate.getMonth() + 1) + "月" + value_449(startDate.getDate()) + "日 " + value_449(startDate.getHours()) + ":" + value_449(startDate.getMinutes()),
    activatedIds = new Set((Array.isArray(options_3.activatedEntryIds) ? options_3.activatedEntryIds : []).map(String).filter(Boolean)),
    parseMemoryDate = value_14 => {
      if (!value_14) return null;
      if (typeof value_14 === "number") {
        const date_2 = new Date(value_14);
        return Number.isNaN(date_2.getTime()) ? null : date_2;
      }
      const normalized_3 = String(value_14).trim().replace(/年/g, "-").replace(/月/g, "-").replace(/日/g, " ").replace(/\./g, "-").replace(/\//g, "-"),
        value_457 = new Date(normalized_3);
      return Number.isNaN(value_457.getTime()) ? null : value_457;
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
      value_463 = Array.isArray(entry_7.sourceMessageIds) ? entry_7.sourceMessageIds : [];
    friend_9.memory.lastSummaryMessageCount = lastSummaryMessageCount_2;
    friend_9.memory.summaryCursor = {
      messageId: String(entry_7.sourceEndMessageId || value_463[value_463.length - 1] || "").trim(),
      order: Number.isFinite(Number(entry_7.sourceEndMessageOrder)) ? Number(entry_7.sourceEndMessageOrder) : -1,
      count: lastSummaryMessageCount_2
    };
  }
  return normalizedEntry;
};
window.imApp.commitShortTermMemoryPromotion = async function (value_464, draft_2, sourceEntryIds) {
  const friend_10 = window.imApp.getFriendById(value_464),
    selectedIds_2 = Array.from(new Set((Array.isArray(sourceEntryIds) ? sourceEntryIds : []).map(value_15 => String(value_15 || "").trim()).filter(Boolean)));
  if (!friend_10 || selectedIds_2.length === 0 || !draft_2 || typeof draft_2 !== "object") return false;
  const normalizeTags = value_19 => window.imChat?.normalizeMemoryTriggerKeywords ? window.imChat.normalizeMemoryTriggerKeywords(value_19) : (Array.isArray(value_19) ? value_19 : [value_19]).map(item_14 => String(item_14 || "").trim()).filter(Boolean).slice(0, 6),
    title_2 = String(draft_2.title || "").trim() || "长期记忆",
    content_2 = String(draft_2.content || "").trim(),
    time_2 = String(draft_2.time || "").trim(),
    triggerKeywords_2 = normalizeTags(draft_2.triggerKeywords || draft_2.memoryTags || []);
  if (!content_2) return false;
  const id_5 = "promoted-ltm-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
    value_474 = await window.imApp.commitScopedFriendChange(friend_10, targetFriend_4 => {
      targetFriend_4.memory = window.imApp.normalizeFriendData(targetFriend_4).memory;
      const shortTermEntries_2 = Array.isArray(targetFriend_4.memory.shortTermEntries) ? targetFriend_4.memory.shortTermEntries : [],
        selectedEntries = shortTermEntries_2.filter(entry_8 => selectedIds_2.includes(String(entry_8?.id || "")));
      if (selectedEntries.length !== selectedIds_2.length) throw new Error("Selected short-term memories are no longer available");
      if (!Array.isArray(targetFriend_4.memory.longTermEntries)) targetFriend_4.memory.longTermEntries = [];
      targetFriend_4.memory.longTermEntries.push({
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
      targetFriend_4.memory.shortTermEntries = shortTermEntries_2.filter(entry_9 => !selectedIds_2.includes(String(entry_9?.id || "")));
      targetFriend_4.memory.recallPresentation = null;
      window.imApp.clearFriendRuntimeMessageContext?.(targetFriend_4);
    }, {
      silent: true,
      immediate: true,
      syncActive: true,
      syncSettings: true
    });
  if (!value_474) return false;
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
  return memberIds.map(memberId_2 => {
    const member_2 = (window.imData?.friends || []).find(item_15 => String(item_15.id) === String(memberId_2));
    return {
      id: memberId_2,
      nickname: member_2?.nickname || "",
      realName: member_2?.realName || ""
    };
  });
};
window.imApp.getContextLimit = function (value_487, value_488 = {}) {
  const normalizedFriend_2 = value_488.friendIsNormalized === true && value_487 ? value_487 : window.imApp.normalizeFriendData(value_487 || {}),
    defaultContextLimit = normalizedFriend_2.type === "group" ? 100 : 50;
  if (normalizedFriend_2.memory?.context?.enabled === false) return 0;
  return Number(normalizedFriend_2.memory?.context?.limit) > 0 ? Number(normalizedFriend_2.memory.context.limit) : defaultContextLimit;
};
window.imApp.getRecentContextMessages = function (value_491, value_492 = {}) {
  const value_493 = value_492.friendIsNormalized === true && value_491 ? value_491 : window.imApp.normalizeFriendData(value_491 || {}),
    contextLimit = window.imApp.getContextLimit(value_493, {
      friendIsNormalized: true
    }),
    allMessages = (Array.isArray(value_493.messages) ? value_493.messages : []).filter(value_497 => value_497?.excludedFromContext !== true);
  if (contextLimit <= 0 || allMessages.length === 0) return [];
  if (value_493.type === "group") return allMessages.slice(-contextLimit);
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
window.imApp.getGroupChatMemoryCandidates = function (value_499) {
  const normalizedFriend = window.imApp.normalizeFriendData(value_499 || {});
  if (!normalizedFriend || normalizedFriend.type === "group" || normalizedFriend.type === "official") return [];
  return (window.imData?.friends || []).filter(group_5 => {
    if (!group_5 || group_5.type !== "group" || !Array.isArray(group_5.members)) return false;
    const isDirectMember = group_5.members.some(memberRef => String(memberRef) === String(normalizedFriend.id) || String(memberRef) === String(normalizedFriend.nickname) || String(memberRef) === String(normalizedFriend.realName)),
      isResolvedMember = window.imChat?.getGroupMemberFriends ? window.imChat.getGroupMemberFriends(group_5).some(member_3 => String(member_3?.id) === String(normalizedFriend.id)) : false;
    return isDirectMember || isResolvedMember;
  });
};
window.imApp.getEligibleGroupChatMemoryContexts = function (value_504) {
  const normalizedFriend_3 = window.imApp.normalizeFriendData(value_504 || {}),
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
window.imApp.createRecalledNoticeMessage = function (value_515, options_4 = {}) {
  const original = value_515 && typeof value_515 === "object" ? value_515 : {},
    actorRole_2 = options_4.actorRole === "user" ? "user" : "assistant",
    actorName_2 = String(options_4.actorName || "").trim(),
    timestamp_3 = Number(options_4.timestamp || original.timestamp) || Date.now(),
    notice = {
      id: original.id || options_4.id || (window.imChat?.createMessageId ? window.imChat.createMessageId("notice") : "notice_" + timestamp_3),
      role: "system",
      type: "system_notice",
      noticeKind: "message_recalled",
      actorRole: actorRole_2,
      actorName: actorName_2,
      content: actorRole_2 === "user" ? "你撤回了一条消息" : (actorName_2 || "对方") + "撤回了一条消息",
      timestamp: timestamp_3
    };
  actorRole_2 !== "user" && typeof options_4.recalledContent === "string" && options_4.recalledContent.trim() && (notice.payload = {
    recalledContent: options_4.recalledContent.trim(),
    recalledTranslation: typeof options_4.recalledTranslation === "string" ? options_4.recalledTranslation.trim() : ""
  });
  if (options_4.apiRunId) notice.apiRunId = options_4.apiRunId;
  return notice;
};
window.imApp.formatSceneNarrationForApiContext = function (noticeText, value_523 = {}) {
  const value_524 = value_523.source === "dynamic_action" ? "narrator_dynamic_action" : "scene_director";
  return "<SCENE_NARRATION source=\"" + value_524 + "\" attribution=\"none\">\ncontent_json: " + JSON.stringify(String(noticeText || "")) + "\ninterpretation_rules:\n- This is an out-of-character scene narration event, not a message, spoken line, inner thought, intention, or automatically performed action from User.\n- Do not reply as though User said this text. Do not attribute it to User or any character unless the narration explicitly names that character as the actor.\n- If the narration explicitly states that a named character performed an action, treat that action as an already established scene fact and continue from its result.\n- Preserve this event's chronological place in the scene and continue the story from it.\n</SCENE_NARRATION>";
};
window.imApp.formatSystemNoticeForApiContext = function (value_525) {
  const message_526 = value_525 || {},
    noticeKind_2 = message_526.noticeKind || "",
    value_528 = message_526.content || message_526.text || "";
  if (noticeKind_2 === "group_left") return "[系统事件：User 已退出群聊。]";
  if (noticeKind_2 === "group_rejoined") return "[系统事件：User 重新进入群聊。]";
  if (noticeKind_2 === "narration") return window.imApp.formatSceneNarrationForApiContext(value_528, {
    source: message_526.narrationSource
  });
  if (noticeKind_2 === "offline_meeting_active") return "";
  if (noticeKind_2 === "group_private_to_user") return "[系统事件：有群成员向 User 发送了私信。其他群成员默认不知道私信内容。]";
  if (noticeKind_2 === "group_friend_private_chat") return "[系统事件：有群成员与自己的好友进行了私聊。私聊内容只属于该成员，其他群成员默认不知道。]";
  if (noticeKind_2 === "message_recalled") {
    if (message_526.actorRole === "user") return "[系统事件：User 撤回了一条消息。你只知道发生了撤回，无法读取被撤回的原文。]";
    const trim_529 = String(message_526.actorName || "").trim();
    return trim_529 ? "[系统事件：" + trim_529 + " 撤回了一条消息。]" : "[系统事件：你撤回了一条消息。]";
  }
  return value_528 ? "[系统事件：" + value_528 + "]" : "[系统事件]";
};
window.imApp.stripFakeLinkHtmlForApiContext = function (value_20, maxLength = 20000) {
  return String(value_20 == null ? "" : value_20).replace(/<\s*(script|style|iframe|object|embed|svg|canvas)[\s\S]*?<\s*\/\s*\1\s*>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, "\"").replace(/&#039;/gi, "'").replace(/\s+/g, " ").trim().slice(0, Math.max(1000, Number(maxLength) || 20000));
};
window.imApp.formatFakeLinkMessageForApiContext = function (value_531, options_5 = {}) {
  const normalizedMessage_2 = value_531 || {},
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
window.imApp.formatMessageForApiContext = function (value_547, value_548, options_6 = {}) {
  const normalizedFriend_4 = options_6.friendIsNormalized === true && value_548 ? value_548 : window.imApp.normalizeFriendData(value_548 || {}),
    normalizedMessage_3 = value_547 || {},
    value_552 = normalizedFriend_4.type === "group";
  let value_553 = normalizedMessage_3.content || "";
  if (normalizedMessage_3.excludedFromContext === true || normalizedMessage_3.type === "user_phone_access_card" || normalizedMessage_3.type === "system_notice" && normalizedMessage_3.noticeKind === "user_phone_access") return null;
  if (normalizedMessage_3.type === "memory_request") return null;
  if (normalizedMessage_3.type === "unblock_request") {
    const value_554 = normalizedMessage_3.requesterRole === "assistant" ? "Char" : "User",
      value_555 = normalizedMessage_3.requestStatus || "pending";
    return {
      role: normalizedMessage_3.requesterRole === "assistant" ? "assistant" : "user",
      content: "[解除拉黑申请｜requestId=" + normalizedMessage_3.id + "｜申请方=" + value_554 + "｜状态=" + value_555 + "]\n理由：" + (normalizedMessage_3.requestText || normalizedMessage_3.content || "")
    };
  }
  if (normalizedMessage_3.type === "loves_unbind_request") return {
    role: "system",
    content: "[Loves 解绑申请｜requestId=" + (normalizedMessage_3.requestId || normalizedMessage_3.id) + "｜状态=" + (normalizedMessage_3.requestStatus || "pending") + "] User 请求解除与 Char 的 Loves 关系。"
  };
  if (normalizedMessage_3.type === "loves_unbind_decision") {
    const value_556 = normalizedMessage_3.decision === "accept" ? "同意解绑" : "拒绝解绑";
    return {
      role: "system",
      content: "[Loves 解绑结果｜requestId=" + (normalizedMessage_3.requestId || "") + "] Char 已" + value_556 + "。"
    };
  }
  if (normalizedMessage_3.type === "together_listening_invite") {
    const value_557 = String(normalizedMessage_3.title || "未知歌曲").trim() || "未知歌曲",
      value_558 = String(normalizedMessage_3.artist || "未知歌手").trim() || "未知歌手",
      value_559 = normalizedMessage_3.inviteStatus === "accepted" ? "User 已同意，你们已进入一起听" : "等待 User 决定是否一起听";
    return {
      role: "assistant",
      content: "[你向 User 发出了一起听邀请：" + value_557 + " - " + value_558 + "；" + value_559 + "。]"
    };
  }
  if (normalizedMessage_3.type === "system_notice") return {
    role: "system",
    content: window.imApp.formatSystemNoticeForApiContext(normalizedMessage_3)
  };
  if (normalizedMessage_3.type === "chat_record_forward") value_553 = window.imApp.formatChatRecordForwardForApiContext ? window.imApp.formatChatRecordForwardForApiContext(normalizedMessage_3) : "[User 转发了一份聊天记录]";else {
    if (normalizedMessage_3.type === "group_poll") {
      const pollOptions_2 = Array.isArray(normalizedMessage_3.pollOptions) ? normalizedMessage_3.pollOptions : [],
        pollVotes_2 = Array.isArray(normalizedMessage_3.pollVotes) ? normalizedMessage_3.pollVotes : [],
        optionById = new Map(pollOptions_2.map(option => [String(option?.id || ""), String(option?.text || "")])),
        map_563 = pollVotes_2.map(vote => {
          const voterName_2 = String(vote?.voterName || vote?.voterId || "未知成员"),
            optionText = optionById.get(String(vote?.optionId || "")) || "未知选项";
          return voterName_2 + " → " + optionText;
        });
      value_553 = ["[User 发起了一项公开单选群投票：" + (normalizedMessage_3.pollQuestion || "未命名投票") + "]", "选项：" + (pollOptions_2.map(option_2 => option_2?.text || "").filter(Boolean).join(" / ") || "无"), "投票结果：" + (map_563.length > 0 ? map_563.join("；") : "暂时无人投票"), normalizedMessage_3.pollStatus === "pending" ? "角色投票仍在进行中。" : ""].filter(Boolean).join("\n");
    } else {
      if (normalizedMessage_3.type === "fake_link") value_553 = window.imApp.formatFakeLinkMessageForApiContext(normalizedMessage_3, options_6);else {
        if (normalizedMessage_3.type === "voice_message") {
          const voiceText = normalizedMessage_3.transcript || normalizedMessage_3.text || "";
          value_553 = normalizedMessage_3.role === "user" ? "[用户发了一条语音消息，语音内容：" + voiceText + "]" : "[你发了一条语音消息，语音内容：" + voiceText + "]";
        } else {
          if (normalizedMessage_3.type === "sticker") {
            const stickerName_2 = normalizedMessage_3.stickerName || normalizedMessage_3.text || "表情包",
              stickerCategory_2 = normalizedMessage_3.stickerCategory || "",
              value_570 = stickerCategory_2 ? stickerCategory_2 + " / " + stickerName_2 : stickerName_2;
            value_553 = normalizedMessage_3.role === "user" ? "[用户发了一个表情包：" + value_570 + "]" : "[你发了一个表情包：" + value_570 + "]";
          } else {
            if (normalizedMessage_3.type === "offline_meeting_record") {
              const dateText_2 = normalizedMessage_3.dateText || "",
                title_4 = normalizedMessage_3.title || "见面记录",
                summary_2 = normalizedMessage_3.summary || normalizedMessage_3.content || "",
                items_574 = [options_6.includeTime !== false ? "线下见面结束于：" + (dateText_2 || "未知") : "线下见面已经结束", "标题：" + title_4, "总结：" + summary_2];
              return {
                role: "system",
                content: window.imApp.formatSceneNarrationForApiContext(items_574.join("\n"))
              };
            } else {
              if (normalizedMessage_3.type === "voice_call_record") {
                const duration_2 = normalizedMessage_3.duration || 0,
                  value_576 = Math.floor(duration_2 / 60) + "分" + duration_2 % 60 + "秒",
                  callMessages_2 = normalizedMessage_3.callMessages || [],
                  statusText_2 = normalizedMessage_3.statusText || "通话记录";
                if (statusText_2 === "已拒绝") value_553 = "[提示：" + (normalizedMessage_3.isSelf ? "对方" : "你") + "刚刚拒绝了这通语音通话。]";else {
                  if (statusText_2 === "已取消") value_553 = "[提示：" + (normalizedMessage_3.isSelf ? "你" : "对方") + "刚刚取消了这通语音通话。]";else {
                    if (callMessages_2.length > 0) {
                      const userName_2 = options_6.userName || window.userState?.name || "User",
                        charName = normalizedFriend_4.nickname || "对方",
                        join_581 = callMessages_2.map(m => {
                          const speaker_2 = m.isSelf ? userName_2 : charName,
                            parts_2 = [];
                          if (m.actionText) parts_2.push(String(m.actionText).trim());
                          if (m.thoughtText) parts_2.push("心声：" + String(m.thoughtText).trim());
                          if (m.text) parts_2.push(speaker_2 + "：「" + String(m.text).trim() + "」");
                          return parts_2.join("\n  ");
                        }).filter(Boolean).join("\n  ");
                      value_553 = "[提示：你们刚刚完成了一通语音通话，时长 " + value_576 + "。通话期间的交流内容如下：\n  " + join_581 + "\n（通话已结束，请直接用普通文字回复）]";
                    } else value_553 = "[提示：你们刚刚完成了一通语音通话，时长 " + value_576 + "，未产生可识别的文本记录。（通话已结束，请直接用普通文字回复）]";
                  }
                }
              } else {
                if (normalizedMessage_3.type === "html" && normalizedMessage_3.shopGift) {
                  const value_585 = normalizedMessage_3.shopGift || {},
                    value_586 = String(value_585.itemName || "商品").trim() || "商品",
                    value_587 = Number(value_585.price) || 0,
                    trim_588 = String(value_585.paymentMethod || "").trim();
                  value_553 = "[User 赠送给你一份礼物]\n商品：" + value_586 + "\n价值：¥" + value_587.toFixed(2) + (trim_588 ? "\n付款方式：" + trim_588 : "");
                } else {
                  if (normalizedMessage_3.type === "moment_forward") try {
                    const momentData = JSON.parse(normalizedMessage_3.content),
                      momentText_2 = momentData.text || "无配文";
                    value_553 = "[转发了一条朋友圈, 内容: \"" + momentText_2 + "\"]";
                    momentData.img && (momentData.imgDesc ? value_553 += " (附带图片: " + momentData.imgDesc + ")" : value_553 += " (附带图片)");
                  } catch (value_591) {
                    value_553 = "[转发了一条朋友圈]";
                  } else {
                    if (normalizedMessage_3.type === "image") {
                      const imageDescription = normalizedMessage_3.text || normalizedMessage_3.description || normalizedMessage_3.fileName || "无描述";
                      value_553 = "[发送了一张图片：" + imageDescription + "]";
                    } else {
                      if (normalizedMessage_3.type === "location") {
                        const trim_593 = String(normalizedMessage_3.locationName || normalizedMessage_3.name || "共享位置").trim(),
                          trim_594 = String(normalizedMessage_3.locationAddress || normalizedMessage_3.address || "").trim(),
                          trim_595 = String(normalizedMessage_3.locationNameTranslation || normalizedMessage_3.nameTranslation || "").trim(),
                          trim_596 = String(normalizedMessage_3.locationAddressTranslation || normalizedMessage_3.addressTranslation || "").trim();
                        value_553 = "[发送了一个定位：" + trim_593 + (trim_595 ? "（" + trim_595 + "）" : "") + (trim_594 ? "，详细地址：" + trim_594 + (trim_596 ? "（" + trim_596 + "）" : "") : "") + "]";
                      } else {
                        if (normalizedMessage_3.type === "pay_transfer") {
                          const payAmount = Number(normalizedMessage_3.amount) || 0,
                            payDesc = normalizedMessage_3.description || "转账",
                            payTarget = normalizedMessage_3.targetName || normalizedFriend_4.nickname || "对方";
                          if (normalizedMessage_3.payKind === "family_card_pending") value_553 = "[用户赠送给你一张额度 ¥" + payAmount.toFixed(2) + " 的亲属卡，等待你决定收下或退回。]";else {
                            if (normalizedMessage_3.payKind === "family_card_accepted") value_553 = "[用户赠送给你的额度 ¥" + payAmount.toFixed(2) + " 的亲属卡已被你收下。]";else {
                              if (normalizedMessage_3.payKind === "family_card_rejected") value_553 = "[用户赠送给你的额度 ¥" + payAmount.toFixed(2) + " 的亲属卡已被你退回。]";else {
                                if (normalizedMessage_3.payKind === "family_card_unbound") value_553 = "[用户赠送给你的亲属卡已解绑，原额度为 ¥" + payAmount.toFixed(2) + "。]";else {
                                  if (normalizedMessage_3.payKind === "family_card_adjust") value_553 = "[用户将赠送给你的亲属卡额度从 ¥" + Number(normalizedMessage_3.previousLimit || 0).toFixed(2) + " 调整到 ¥" + payAmount.toFixed(2) + "。]";else {
                                    if (normalizedMessage_3.payKind === "family_card_accept_notice" || normalizedMessage_3.payKind === "family_card_reject_notice") value_553 = "[你" + (normalizedMessage_3.payKind === "family_card_accept_notice" ? "收下" : "退回") + "了用户赠送的亲属卡。]";else {
                                      if (normalizedMessage_3.payKind === "user_to_char") value_553 = "[用户刚刚向你转账 ¥" + payAmount.toFixed(2) + "，备注：" + payDesc + "，对象：" + payTarget + "。你可以收下这笔钱，也可以退回，或者正常回复。]";else {
                                        if (normalizedMessage_3.payKind === "char_received") value_553 = "[你刚刚收下了用户的一笔转账 ¥" + payAmount.toFixed(2) + "，备注：" + payDesc + "。]";else {
                                          if (normalizedMessage_3.payKind === "char_to_user_pending") value_553 = "[你刚刚向用户发起了一笔转账 ¥" + payAmount.toFixed(2) + "，备注：" + payDesc + "，等待用户领取。]";else {
                                            if (normalizedMessage_3.payKind === "char_to_user_claimed" || normalizedMessage_3.payKind === "user_received_from_char") value_553 = "[用户已领取你的转账 ¥" + payAmount.toFixed(2) + "，备注：" + payDesc + "。]";else {
                                              if (normalizedMessage_3.payKind === "user_rejected_from_char") value_553 = "[用户退回了你的转账 ¥" + payAmount.toFixed(2) + "，备注：" + payDesc + "。]";else (normalizedMessage_3.payKind === "char_to_user_rejected" || normalizedMessage_3.payKind === "user_to_char_rejected") && (value_553 = "[你刚刚退回了用户的转账 ¥" + payAmount.toFixed(2) + "，备注：" + payDesc + "。]");
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
  if (value_552) {
    const userName_3 = String(normalizedMessage_3.userIdentity?.name || options_6.userName || window.imApp.getGroupUserIdentity(normalizedFriend_4).name || "User").trim() || "User";
    if (normalizedMessage_3.role === "user") return normalizedMessage_3.replyTo && (value_553 = "[引用了消息：\"" + normalizedMessage_3.replyTo + "\"]\n" + value_553), {
      role: "user",
      content: "User(" + userName_3 + "): " + value_553
    };
    const assistantSpeaker = typeof normalizedMessage_3.speaker === "string" && normalizedMessage_3.speaker.trim() ? normalizedMessage_3.speaker.trim() : "群成员";
    return normalizedMessage_3.replyTo && (value_553 = "[引用了消息：\"" + normalizedMessage_3.replyTo + "\"]\n" + value_553), {
      role: "assistant",
      content: assistantSpeaker + ": " + value_553
    };
  }
  return normalizedMessage_3.role === "user" && normalizedMessage_3.replyTo && (value_553 = "[用户引用了消息：\"" + normalizedMessage_3.replyTo + "\"]\n" + value_553), {
    role: normalizedMessage_3.role,
    content: value_553
  };
};
window.imApp.buildApiContextMessages = function (value_602, options_7 = {}) {
  const friendData_604 = window.imApp.normalizeFriendData(value_602 || {}),
    recentMessages = window.imApp.getRecentContextMessages(friendData_604, {
      friendIsNormalized: true
    });
  let latestLinkIndex = -1;
  return recentMessages.forEach((message_8, index_4) => {
    if (message_8 && message_8.type === "fake_link") latestLinkIndex = index_4;
  }), recentMessages.map((message_9, value_608) => {
    const formattedMessage = window.imApp.formatMessageForApiContext(message_9, friendData_604, {
      ...options_7,
      friendIsNormalized: true,
      expandLinkContent: message_9 && message_9.type === "fake_link" ? value_608 === latestLinkIndex : options_7.expandLinkContent
    });
    if (!formattedMessage || !options_7.includeContextMetadata) return formattedMessage;
    return {
      ...formattedMessage,
      _contextMessageId: String(message_9?.id || ""),
      _contextTimestamp: Number(message_9?.timestamp) || 0
    };
  }).filter(item_16 => item_16 && item_16.role && typeof item_16.content === "string" && item_16.content.trim());
};
window.imApp.buildLinkedAccountMemoryContext = function (value_611, options_8 = {}) {
  const normalizedFriend_5 = window.imApp.normalizeFriendData(value_611 || {}),
    linkedChats = Array.isArray(normalizedFriend_5.linkedAccountChats) ? normalizedFriend_5.linkedAccountChats : [];
  if (linkedChats.length === 0) return "";
  const charName_2 = normalizedFriend_5.nickname || normalizedFriend_5.realName || "Char",
    value_616 = options_8?.includeTime !== false,
    maxMessagesPerFriend_2 = Math.max(1, Number(options_8.maxMessagesPerFriend) || 4),
    value_618 = value_620 => {
      const value_621 = Number(value_620) || 0;
      if (!value_621) return "未知时间";
      const startDate_2 = new Date(value_621),
        value_623 = value_624 => String(value_624).padStart(2, "0");
      return startDate_2.getFullYear() + "-" + value_623(startDate_2.getMonth() + 1) + "-" + value_623(startDate_2.getDate()) + " " + value_623(startDate_2.getHours()) + ":" + value_623(startDate_2.getMinutes());
    },
    lines = ["Linked Friend Memory / 关联好友记忆:", "These are private friend chats belonging to the character. They are context about the character's own friends, not messages from the current User."];
  return linkedChats.forEach((chat, value_626) => {
    const displayName_2 = chat.remark || chat.name || chat.realName || "Friend " + (value_626 + 1),
      realName_2 = chat.realName || chat.name || displayName_2,
      recentMessages_2 = Array.isArray(chat.messages) ? chat.messages.slice(-maxMessagesPerFriend_2) : [];
    lines.push("");
    lines.push("Friend " + (value_626 + 1) + ": " + displayName_2);
    lines.push("Real Name: " + (realName_2 || "Unknown"));
    lines.push("Remark: " + (chat.remark || displayName_2 || "None"));
    lines.push("Relationship: " + (chat.relationship || "None"));
    lines.push("Persona: " + (chat.persona || "None"));
    lines.push("Recent private messages, fixed to the latest 2 rounds:");
    recentMessages_2.length === 0 ? lines.push("None") : recentMessages_2.forEach(message_10 => {
      const speaker_3 = message_10.role === "char" ? charName_2 : displayName_2,
        value_632 = value_616 ? "[" + value_618(message_10.timestamp) + "] " : "";
      lines.push("" + value_632 + speaker_3 + ": " + (message_10.text || ""));
    });
  }), lines.join("\n");
};
window.imApp.getXDirectMessageMountCandidates = function (value_633) {
  const friendId_2 = window.imApp.resolveFriendId(value_633);
  if (friendId_2 == null) return [];
  const value_635 = typeof window.getAppState === "function" ? window.getAppState("x") : window.__xFallbackState,
    directMessages = Array.isArray(value_635?.xDirectMessages) ? value_635.xDirectMessages : [],
    getMessageText = message_11 => {
      if (!message_11 || typeof message_11 !== "object") return "";
      if (message_11.type === "post-card") {
        const post_2 = message_11.postSnapshot || message_11.post || {};
        return ("[X Post] " + String(post_2.text || post_2.content || "").trim()).trim();
      }
      return String(message_11.text || message_11.content || message_11.message || "").trim();
    };
  return directMessages.filter(item_17 => item_17 && String(item_17.sourceFriendId || "") === String(friendId_2)).map((item_18, index_5) => {
    const messages_3 = Array.isArray(item_18.messages) ? item_18.messages : [],
      lastMessage = messages_3[messages_3.length - 1] || null,
      updatedAt_3 = Number(lastMessage?.createdAt || lastMessage?.timestamp || item_18.updatedAt || item_18.addedAt) || 0;
    return {
      id: String(item_18.id || ""),
      name: String(item_18.name || item_18.nickname || item_18.realName || "X Char"),
      handle: String(item_18.handle || ""),
      messages: messages_3,
      messageCount: messages_3.length,
      lastMessageText: getMessageText(lastMessage),
      updatedAt: updatedAt_3,
      index: index_5
    };
  }).filter(value_646 => value_646.id).sort((left_2, right) => right.updatedAt - left_2.updatedAt || left_2.index - right.index);
};
window.imApp.buildXDirectMessageMemoryContext = function (value_648, options_9 = {}) {
  const normalizedFriend_6 = window.imApp.normalizeFriendData(value_648 || {});
  if (normalizedFriend_6.type === "group") return "";
  const mount_6 = window.imApp.normalizeXDirectMessageMount(normalizedFriend_6.memory?.xDirectMessageMount);
  if (!mount_6.enabled) return "";
  const xDirectMessageMountCandidates = window.imApp.getXDirectMessageMountCandidates(normalizedFriend_6),
    mountedThread = xDirectMessageMountCandidates.find(value_674 => value_674.id === mount_6.dmId) || (!mount_6.dmId ? xDirectMessageMountCandidates[0] : null);
  if (!mountedThread) return "";
  const requestedLimit = Number(options_9.maxMessages),
    value_653 = options_9?.includeTime !== false,
    limit_3 = Number.isFinite(requestedLimit) ? Math.max(1, Math.min(50, Math.floor(requestedLimit))) : mount_6.limit,
    value_655 = normalizedFriend_6.nickname || normalizedFriend_6.realName || "Char",
    xCharName = mountedThread.name || "X Char",
    sanitize = value_21 => String(value_21 == null ? "" : value_21).replace(/[<>]/g, character => character === "<" ? "‹" : "›").slice(0, 800),
    formatTime_2 = value_676 => {
      const timestamp_4 = Number(value_676) || 0;
      if (!timestamp_4) return "Unknown time";
      const startDate_3 = new Date(timestamp_4),
        value_679 = value_680 => String(value_680).padStart(2, "0");
      return startDate_3.getFullYear() + "-" + value_679(startDate_3.getMonth() + 1) + "-" + value_679(startDate_3.getDate()) + " " + value_679(startDate_3.getHours()) + ":" + value_679(startDate_3.getMinutes());
    },
    formatMessage = message_13 => {
      if (!message_13 || typeof message_13 !== "object") return "";
      const isPostCard = message_13.type === "post-card",
        post_3 = isPostCard ? message_13.postSnapshot || message_13.post || {} : null,
        rawText = isPostCard ? "[X Post] " + (post_3?.name || "") + " " + (post_3?.text || post_3?.content || "") : message_13.text || message_13.content || message_13.message || "",
        text_4 = sanitize(rawText).trim();
      if (!text_4) return "";
      const speaker_4 = message_13.source === "user" || message_13.sender === "user" ? "User" : xCharName,
        value_687 = value_653 ? "[" + formatTime_2(message_13.createdAt || message_13.timestamp) + "] " : "";
      return "" + value_687 + speaker_4 + ": " + text_4;
    },
    xState = typeof window.getAppState === "function" ? window.getAppState("x") : window.__xFallbackState,
    directMessages_2 = Array.isArray(xState?.xDirectMessages) ? xState.xDirectMessages : [],
    allXPosts = Array.isArray(xState?.xGeneratedPosts) ? xState.xGeneratedPosts : [],
    rawMountedThread = directMessages_2.find(item_19 => String(item_19?.id || "") === String(mountedThread.id)) || {},
    normalizeIdentity = value_22 => String(value_22 == null ? "" : value_22).split("·")[0].trim().replace(/^@/, "").toLocaleLowerCase(),
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
    value_668 = (post_10, value_701) => {
      const text_5 = sanitize(getPostText(post_10)).trim();
      if (!text_5) return "";
      const topic = sanitize(post_10?.topicTag || "").trim(),
        value_704 = value_653 ? "[" + formatTime_2(getPostTimestamp(post_10)) + "] " : "";
      return "" + value_704 + value_701 + " posted on X" + (topic ? " (" + topic + ")" : "") + ": " + text_5;
    },
    collectRecentPosts = (posts, value_706) => {
      const seen = new Set();
      return (Array.isArray(posts) ? posts : []).slice().filter(post_11 => getPostText(post_11)).sort((left_3, right_2) => getPostTimestamp(right_2) - getPostTimestamp(left_3)).filter(value_711 => {
        const key_5 = String(value_711?.id || "") || getPostTimestamp(value_711) + ":" + getPostText(value_711);
        if (seen.has(key_5)) return false;
        return seen.add(key_5), true;
      }).slice(0, limit_3).sort((value_713, value_714) => getPostTimestamp(value_713) - getPostTimestamp(value_714)).map(value_715 => value_668(value_715, value_706)).filter(Boolean);
    },
    recentMessages_3 = mountedThread.messages.slice().sort((left_4, right_3) => Number(left_4?.createdAt || left_4?.timestamp || 0) - Number(right_3?.createdAt || right_3?.timestamp || 0)).slice(-limit_3).map(formatMessage).filter(Boolean),
    recentUserPosts = collectRecentPosts(allXPosts.filter(isCurrentUserPost), "User"),
    charProfilePosts = [...(Array.isArray(rawMountedThread.profilePosts) ? rawMountedThread.profilePosts : []), ...allXPosts.filter(isMountedCharPost)],
    recentCharPosts = collectRecentPosts(charProfilePosts, "Current Char (" + xCharName + ")");
  if (recentMessages_3.length === 0 && recentUserPosts.length === 0 && recentCharPosts.length === 0) return "";
  return "<mounted_x_direct_message_context>\nSource: mounted X app social context for the same Char. This is prior cross-platform context, not a message sent in the current iMessage thread.\nMounted X thread: " + sanitize(xCharName) + (mountedThread.handle ? " (" + sanitize(mountedThread.handle) + ")" : "") + "\nUse it only to maintain continuity with User. Do not say other characters saw it, and do not present any of this as an iMessage bubble.\nCurrent iMessage Char: " + sanitize(value_655) + "\n\n<x_private_direct_messages>\nScope: prior one-to-one private X direct messages between User and the current Char. These are neither public posts nor iMessage bubbles.\n" + (recentMessages_3.length ? recentMessages_3.join("\n") : "None") + "\n</x_private_direct_messages>\n\n<x_user_public_posts>\nScope: User's public X posts.\nOwnership hard rule: every post in this block was authored and publicly posted by User, not by you (the current Char). Never claim, imply, remember, or refer to any of these posts as your own.\n" + (recentUserPosts.length ? recentUserPosts.join("\n") : "None") + "\n</x_user_public_posts>\n\n<x_current_char_own_public_posts>\nScope: the current Char's own public X profile posts.\nOwnership hard rule: every post in this block was authored and publicly posted by you, the current Char. Treat it as your own public content; do not deny authorship or describe it as User's or someone else's post.\n" + (recentCharPosts.length ? recentCharPosts.join("\n") : "None") + "\n</x_current_char_own_public_posts>\n</mounted_x_direct_message_context>";
};
window.imApp.getBstagePopMountCandidates = function () {
  const value_718 = typeof window.getAppState === "function" ? window.getAppState("bstage") : window.__bstageGlobalState,
    items_719 = [value_718?.bstageUserTeamState, ...(Array.isArray(value_718?.teams) ? value_718.teams : [])];
  return items_719.filter(item_20 => item_20 && item_20.id != null).flatMap(normalized_4 => (Array.isArray(normalized_4.members) ? normalized_4.members : []).filter(value_722 => value_722 && value_722.id != null && !value_722.isUserMember && String(value_722.id) !== "__bstage_user_member__").map(member_4 => ({
    teamId: String(normalized_4.id),
    memberId: String(member_4.id),
    teamName: String(normalized_4.id) === "__bstage_user_team__" || normalized_4.isUserTeam ? "我的团队" : String(normalized_4.name || "未命名团队"),
    name: String(member_4.name || "未命名 Char"),
    sourceFriendId: member_4.sourceFriendId == null ? "" : String(member_4.sourceFriendId),
    member: member_4
  })));
};
window.imApp.getMountedBstagePopMember = function (value_724) {
  const bstagePopMount_725 = window.imApp.normalizeBstagePopMount(value_724?.memory?.bstagePopMount);
  if (!bstagePopMount_725.teamId || !bstagePopMount_725.memberId) return null;
  return window.imApp.getBstagePopMountCandidates().find(value_726 => value_726.teamId === bstagePopMount_725.teamId && value_726.memberId === bstagePopMount_725.memberId) || null;
};
window.imApp.formatCrossAppActivityTime = function (value_727) {
  const number_728 = Number(value_727);
  if (!Number.isFinite(number_728) || number_728 <= 0) return "";
  const startDate_4 = new Date(number_728);
  if (Number.isNaN(startDate_4.getTime())) return "";
  const value_730 = value_731 => String(value_731).padStart(2, "0");
  return startDate_4.getFullYear() + "-" + value_730(startDate_4.getMonth() + 1) + "-" + value_730(startDate_4.getDate()) + " " + value_730(startDate_4.getHours()) + ":" + value_730(startDate_4.getMinutes());
};
window.imApp.sanitizeCrossAppActivity = function (value_25) {
  return String(value_25 == null ? "" : value_25).replace(/[<>]/g, character_2 => character_2 === "<" ? "‹" : "›").replace(/\s+/g, " ").trim().slice(0, 400);
};
window.imApp.buildBstagePopMemoryContext = function (value_734) {
  const friendData_735 = window.imApp.normalizeFriendData(value_734 || {});
  if (friendData_735.type !== "char") return "";
  const mount_7 = window.imApp.normalizeBstagePopMount(friendData_735.memory?.bstagePopMount);
  if (!mount_7.enabled) return "";
  const mountedThread_2 = window.imApp.getMountedBstagePopMember(friendData_735);
  if (!mountedThread_2) return "";
  const items_737 = Array.isArray(mountedThread_2.member.chatHistory) ? mountedThread_2.member.chatHistory : [],
    filter_738 = items_737.filter(value_739 => value_739 && value_739.isUser === false && ["text", "image"].includes(value_739.type)).slice(-10).map(message_740 => {
      const value_741 = message_740.type === "image" ? "[图片] " + (message_740.imgDesc || "") : message_740.text,
        mountedThread_3 = window.imApp.sanitizeCrossAppActivity(value_741);
      if (!mountedThread_3) return "";
      const formatCrossAppActivityTime_743 = window.imApp.formatCrossAppActivityTime(message_740.timestamp);
      return "" + (formatCrossAppActivityTime_743 ? "[" + formatCrossAppActivityTime_743 + "] " : "") + mountedThread_3;
    }).filter(Boolean);
  if (!filter_738.length) return "";
  return "<mounted_bstage_pop_activity>\nSource: your own recent b.stage POP messages as the same Char. This account belongs to you; these are activities you did, not messages in the current iMessage chat.\nDo not infer what any fan said, who the fan is, or that a POP fan is User. Do not reproduce this as iMessage bubbles.\n" + filter_738.join("\n") + "\n</mounted_bstage_pop_activity>";
};
window.imApp.buildImessageCharActivityForBstage = async function (value_744, value_745) {
  const filter_746 = (window.imData?.friends || []).filter(value_750 => {
    if (!value_750 || value_750.type !== "char") return false;
    const bstagePopMount_751 = window.imApp.normalizeBstagePopMount(value_750.memory?.bstagePopMount);
    return bstagePopMount_751.enabled && bstagePopMount_751.teamId === String(value_744) && bstagePopMount_751.memberId === String(value_745);
  });
  if (filter_746.length !== 1) return "";
  const value_747 = filter_746[0],
    value_748 = await window.imApp.ensureFriendRecentMessagesLoaded(value_747, {
      limit: 90
    }),
    filter_749 = (Array.isArray(value_748) ? value_748 : []).filter(message_752 => message_752 && message_752.role === "assistant" && !["system_notice", "date"].includes(message_752.type)).slice(-10).map(message_753 => {
      const value_754 = message_753.type === "image" ? "[图片] " + (message_753.description || message_753.imgDesc || message_753.text || "") : message_753.content || message_753.text || "",
        mountedThread_4 = window.imApp.sanitizeCrossAppActivity(value_754);
      if (!mountedThread_4) return "";
      const formatCrossAppActivityTime_756 = window.imApp.formatCrossAppActivityTime(message_753.timestamp);
      return "" + (formatCrossAppActivityTime_756 ? "[" + formatCrossAppActivityTime_756 + "] " : "") + mountedThread_4;
    }).filter(Boolean);
  if (!filter_749.length) return "";
  return "<private_imessage_char_activity>\nThese are your own recent iMessage remarks, private background about your activities only. The current POP fan is not the iMessage User. Never quote, paraphrase, hint at, or disclose the iMessage private conversation, User's identity, relationship, or personal details to POP fans. Use only non-private facts about your own day for consistency.\n" + filter_749.join("\n") + "\n</private_imessage_char_activity>";
};
window.imApp.getMomentMessages = function () {
  return Array.isArray(window.imData.momentMessages) ? window.imData.momentMessages : [];
};
window.imApp.setMomentMessages = function (messages_4) {
  window.imData.momentMessages = Array.isArray(messages_4) ? messages_4 : [];
};
const recentFriendMessageWindows = new Map(),
  recentFriendMessageLoadPromises = new Map();
window.imApp.getFriendMessageCount = function (value_758) {
  const value_759 = typeof value_758 === "object" && value_758 !== null ? value_758 : (window.imData.friends || []).find(value_762 => String(value_762?.id) === String(value_758));
  if (!value_759) return 0;
  if (value_759.messagesLoaded === true && Array.isArray(value_759.messages)) return value_759.messages.length;
  const number_760 = Number(value_759.messageCount);
  if (Number.isFinite(number_760) && number_760 >= 0) return Math.round(number_760);
  const number_761 = Number(recentFriendMessageWindows.get(String(value_759.id))?.totalCount);
  if (Number.isFinite(number_761) && number_761 >= 0) return Math.round(number_761);
  return Array.isArray(value_759.messages) ? value_759.messages.length : 0;
};
window.imApp.repairFriendMessageCount = function (value_763, value_764) {
  if (!value_763 || !Number.isFinite(Number(value_764)) || Number(value_764) < 0) return false;
  const messageCount_2 = Math.round(Number(value_764)),
    number_766 = Number(value_763.messageCount);
  value_763.messageCount = messageCount_2;
  if (number_766 === messageCount_2 || !window.imStorage?.patchFriendMeta) return false;
  return Promise.resolve(window.imStorage.patchFriendMeta(value_763.id, {
    messageCount: messageCount_2
  }))["catch"](value_767 => console.warn("Failed to repair friend message count", value_763.id, value_767)), true;
};
window.imApp.getFriendRecentMessageWindow = function (friendOrId_2) {
  const targetId_3 = typeof friendOrId_2 === "object" && friendOrId_2 !== null ? friendOrId_2.id : friendOrId_2;
  if (targetId_3 == null) return null;
  return recentFriendMessageWindows.get(String(targetId_3)) || null;
};
window.imApp.restoreLoadedMemoryRequests = function (normalizedFriend_7, value_771) {
  const value_772 = new Set((Array.isArray(normalizedFriend_7?.memory?.cherishedEntries) ? normalizedFriend_7.memory.cherishedEntries : []).map(value_773 => String(value_773?.sourceEventId || "")).filter(Boolean));
  return (Array.isArray(value_771) ? value_771 : []).forEach(message_774 => {
    if (message_774?.type !== "memory_request") return;
    const memoryRequestId_3 = String(message_774.memoryRequestId || message_774.id || "");
    message_774.memoryRequestId = memoryRequestId_3;
    !["pending", "confirmed", "cancelled"].includes(message_774.requestStatus) && (message_774.requestStatus = value_772.has(memoryRequestId_3) ? "confirmed" : "pending");
    (!message_774.memoryPayload || typeof message_774.memoryPayload !== "object") && (message_774.memoryPayload = {
      title: "珍视回忆",
      content: String(message_774.content || "")
    });
    message_774.excludedFromContext = true;
  }), value_771;
};
window.imApp.ensureFriendRecentMessagesLoaded = async function (friendOrId_3, options_10 = {}) {
  const targetId_4 = typeof friendOrId_3 === "object" && friendOrId_3 !== null ? friendOrId_3.id : friendOrId_3;
  if (targetId_4 == null) return [];
  const runId_2 = String(targetId_4),
    targetFriend_5 = (window.imData.friends || []).find(value_784 => String(value_784.id) === runId_2);
  if (!targetFriend_5) return [];
  if (targetFriend_5.messagesLoaded && Array.isArray(targetFriend_5.messages)) return targetFriend_5.messages;
  const result_781 = recentFriendMessageWindows.get(runId_2);
  if (result_781?.loaded && Array.isArray(targetFriend_5.messages)) return targetFriend_5.messages;
  const selected_2 = recentFriendMessageLoadPromises.get(runId_2);
  if (selected_2) return selected_2;
  if (!window.imStorage?.loadRecentMessagesByFriendId) return window.imApp.ensureFriendMessagesLoaded ? window.imApp.ensureFriendMessagesLoaded(targetFriend_5, options_10) : [];
  const cotSummary_2 = (async () => {
    try {
      const friend_12 = await window.imStorage.loadRecentMessagesByFriendId(runId_2, {
        limit: options_10.limit || 90
      });
      targetFriend_5.messages = window.imApp.restoreLoadedMemoryRequests(targetFriend_5, Array.isArray(friend_12?.messages) ? friend_12.messages : []);
      targetFriend_5.messagesLoaded = false;
      window.imApp.repairFriendMessageCount(targetFriend_5, friend_12?.totalCount);
      recentFriendMessageWindows.set(runId_2, {
        loaded: true,
        hasMore: friend_12?.hasMore === true,
        oldestOrder: Number.isFinite(Number(friend_12?.oldestOrder)) ? Number(friend_12.oldestOrder) : null,
        totalCount: window.imApp.getFriendMessageCount(targetFriend_5)
      });
      if (typeof options_10.onLoaded === "function") options_10.onLoaded(targetFriend_5.messages, targetFriend_5);
      return targetFriend_5.messages;
    } catch (value_786) {
      return console.error("Failed to load recent friend messages", value_786), window.imApp.ensureFriendMessagesLoaded ? window.imApp.ensureFriendMessagesLoaded(targetFriend_5, options_10) : [];
    } finally {
      recentFriendMessageLoadPromises.get(runId_2) === cotSummary_2 && recentFriendMessageLoadPromises["delete"](runId_2);
    }
  })();
  return recentFriendMessageLoadPromises.set(runId_2, cotSummary_2), cotSummary_2;
};
window.imApp.loadEarlierFriendMessages = async function (friendOrId_4, value_788 = {}) {
  const targetId_5 = typeof friendOrId_4 === "object" && friendOrId_4 !== null ? friendOrId_4.id : friendOrId_4;
  if (targetId_5 == null) return {
    messages: [],
    addedCount: 0,
    hasMore: false
  };
  const string_790 = String(targetId_5),
    friend_14 = (window.imData.friends || []).find(value_798 => String(value_798.id) === string_790),
    result_792 = recentFriendMessageWindows.get(string_790);
  if (!friend_14 || friend_14.messagesLoaded || !result_792?.hasMore || !window.imStorage?.loadRecentMessagesByFriendId) return {
    messages: Array.isArray(friend_14?.messages) ? friend_14.messages : [],
    addedCount: 0,
    hasMore: result_792?.hasMore === true
  };
  const friend_15 = await window.imStorage.loadRecentMessagesByFriendId(string_790, {
      limit: value_788.limit || 60,
      beforeOrder: result_792.oldestOrder
    }),
    restoreLoadedMemoryRequests_794 = window.imApp.restoreLoadedMemoryRequests(friend_14, Array.isArray(friend_15?.messages) ? friend_15.messages : []);
  window.imApp.repairFriendMessageCount(friend_14, friend_15?.totalCount);
  const items_795 = Array.isArray(friend_14.messages) ? friend_14.messages : [],
    value_796 = new Set(items_795.map(value_799 => String(value_799?.id || "")).filter(Boolean)),
    filter_797 = restoreLoadedMemoryRequests_794.filter(value_800 => !value_800?.id || !value_796.has(String(value_800.id)));
  return friend_14.messages = [...filter_797, ...items_795], recentFriendMessageWindows.set(string_790, {
    loaded: true,
    hasMore: friend_15?.hasMore === true,
    oldestOrder: Number.isFinite(Number(friend_15?.oldestOrder)) ? Number(friend_15.oldestOrder) : result_792.oldestOrder,
    totalCount: window.imApp.getFriendMessageCount(friend_14)
  }), {
    messages: friend_14.messages,
    addedCount: filter_797.length,
    hasMore: friend_15?.hasMore === true
  };
};
window.imApp.ensureFriendMessagesLoaded = async function (friendOrId_5, options_11 = {}) {
  const targetId_6 = typeof friendOrId_5 === "object" && friendOrId_5 !== null ? friendOrId_5.id : friendOrId_5;
  if (targetId_6 == null) return [];
  const targetFriend_6 = (window.imData.friends || []).find(value_805 => String(value_805.id) === String(targetId_6));
  if (!targetFriend_6) return [];
  if (targetFriend_6.messagesLoaded && Array.isArray(targetFriend_6.messages)) return recentFriendMessageWindows["delete"](String(targetId_6)), targetFriend_6.messages;
  try {
    const result_806 = recentFriendMessageWindows.get(String(targetId_6)),
      value_807 = Array.isArray(targetFriend_6.messages) ? targetFriend_6.messages : [],
      presetId_2 = String(value_807[0]?.id || ""),
      value_809 = typeof document !== "undefined" ? document.querySelector("#chat-interface-" + targetId_6 + " .ins-chat-messages") : null,
      value_810 = Number(value_809?._imHistoryState?.visibleStartIndex) || 0;
    if (!window.imStorage || !window.imStorage.loadMessagesByFriendId) {
      if (options_11.requireComplete === true && targetFriend_6.messagesLoaded !== true) throw new Error("Complete friend message storage is unavailable");
      return targetFriend_6.messages = Array.isArray(targetFriend_6.messages) ? targetFriend_6.messages : [], targetFriend_6.messagesLoaded = true, targetFriend_6.messages;
    }
    const loadedMessages = await window.imStorage.loadMessagesByFriendId(targetId_6);
    targetFriend_6.messages = window.imApp.restoreLoadedMemoryRequests(targetFriend_6, Array.isArray(loadedMessages) ? loadedMessages : []);
    targetFriend_6.messagesLoaded = true;
    recentFriendMessageWindows["delete"](String(targetId_6));
    window.imApp.repairFriendMessageCount(targetFriend_6, targetFriend_6.messages.length);
    if (result_806 && value_809?._imHistoryState && presetId_2) {
      const visibleEndIndex_2 = targetFriend_6.messages.findIndex(item_21 => String(item_21?.id || "") === presetId_2);
      visibleEndIndex_2 >= 0 && (value_809._imHistoryState.visibleStartIndex = visibleEndIndex_2 + value_810, Number.isFinite(Number(value_809._imHistoryState.visibleEndIndex)) && (value_809._imHistoryState.visibleEndIndex += visibleEndIndex_2), value_809._imHistoryState.totalMessages = targetFriend_6.messages.length);
    }
    if (targetFriend_6.messages.length > 0) {
      const visibleMessages = targetFriend_6.messages.filter(message_15 => window.imApp.getFriendMessagePreview(message_15)),
        lastMessage_2 = visibleMessages.length > 0 ? visibleMessages[visibleMessages.length - 1] : null;
      targetFriend_6.lastMessageTimestamp = Number(lastMessage_2?.timestamp) || targetFriend_6.lastMessageTimestamp || 0;
      targetFriend_6.lastMessagePreview = (lastMessage_2 ? window.imApp.getFriendMessagePreview(lastMessage_2) : "") || targetFriend_6.lastMessagePreview || "";
    }
    return typeof options_11.onLoaded === "function" && options_11.onLoaded(targetFriend_6.messages, targetFriend_6), targetFriend_6.messages;
  } catch (e_2) {
    console.error("Failed to load friend messages on demand", e_2);
    targetFriend_6.messages = Array.isArray(targetFriend_6.messages) ? targetFriend_6.messages : [];
    targetFriend_6.messagesLoaded = false;
    if (options_11.requireComplete === true) throw e_2;
    return targetFriend_6.messages;
  }
};
window.imApp.getMomentsCoverUrl = function () {
  return window.imData.momentsCoverUrl || null;
};
window.imApp.setMomentsCoverUrl = function (url_2) {
  window.imData.momentsCoverUrl = url_2 || null;
};
window.imApp.cloneDataSnapshot = function (value_27) {
  if (typeof structuredClone === "function") return structuredClone(value_27);
  return JSON.parse(JSON.stringify(value_27));
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
window.imApp.getFriendMessagePreview = function (value_823) {
  const targetMessage_4 = value_823 || {};
  if (targetMessage_4.type === "memory_request") return "";
  if (targetMessage_4.type === "user_phone_access_card") {
    const value_825 = Array.isArray(targetMessage_4.visits) ? targetMessage_4.visits : [];
    return "[查手机记录] 查看了 " + value_825.length + " 个聊天";
  }
  if (targetMessage_4.type === "chat_record_forward") return window.imApp.getChatRecordPreview ? window.imApp.getChatRecordPreview(targetMessage_4) : "[聊天记录]";
  if (targetMessage_4.type === "image") {
    const desc = targetMessage_4.text || targetMessage_4.description || "";
    return desc ? ("[图片] " + desc).trim() : "[图片]";
  }
  if (targetMessage_4.type === "location") {
    const value_827 = targetMessage_4.locationName || targetMessage_4.name || "共享位置",
      value_828 = targetMessage_4.locationAddress || targetMessage_4.address || "",
      value_829 = targetMessage_4.locationNameTranslation || targetMessage_4.nameTranslation || "",
      value_830 = targetMessage_4.locationAddressTranslation || targetMessage_4.addressTranslation || "";
    return ("[位置] " + value_827 + (value_829 ? "（" + value_829 + "）" : "") + (value_828 ? " — " + value_828 + (value_830 ? "（" + value_830 + "）" : "") : "")).trim();
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
    } catch (value_834) {}
    return content_3 ? ("[朋友圈] " + content_3).trim() : "[朋友圈]";
  }
  if (targetMessage_4.type === "pay_transfer") return ("[转账] " + (targetMessage_4.description || "")).trim();
  if (targetMessage_4.type === "group_red_packet") return ("[群红包] " + (targetMessage_4.description || "")).trim();
  if (targetMessage_4.type === "voice_call_record") return targetMessage_4.text || ("[语音通话记录] " + (targetMessage_4.statusText || "")).trim();
  if (targetMessage_4.type === "together_listening_invite") {
    const value_835 = targetMessage_4.title || "未知歌曲";
    return "[一起听] " + value_835 + (targetMessage_4.inviteStatus === "accepted" ? " · 已接受" : "");
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
      value_840 = targetMessage_4.content || targetMessage_4.text || "";
    if (noticeKind_3 === "group_left") return "你已退出群聊";
    if (noticeKind_3 === "group_rejoined") return "你重新进入群聊";
    if (noticeKind_3 === "narration") return ("[旁白] " + value_840).trim();
    if (noticeKind_3 === "offline_meeting_active") return "";
    if (noticeKind_3 === "message_recalled") {
      if (targetMessage_4.actorRole === "user") return "你撤回了一条消息";
      const trim_841 = String(targetMessage_4.actorName || "").trim();
      return (trim_841 || "对方") + "撤回了一条消息";
    }
    return value_840;
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
window.imApp.clearFriendUnread = async function (value_849, options_12 = {}) {
  const safeFriendId_2 = String(value_849),
    targetFriend_7 = (window.imData.friends || []).find(value_853 => String(value_853.id) === safeFriendId_2);
  if (!targetFriend_7) return false;
  if (!targetFriend_7.unreadCount) {
    if (window.imApp.updateChatsUnreadBadges) window.imApp.updateChatsUnreadBadges();
    return true;
  }
  targetFriend_7.unreadCount = 0;
  try {
    if (window.imStorage?.saveFriendMeta) await window.imStorage.saveFriendMeta(targetFriend_7);else window.imApp.commitFriendChange && (await window.imApp.commitFriendChange(safeFriendId_2, friend_18 => {
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
  return friend_19.messages.forEach((value_857, __messageOrder_4) => {
    value_857 && typeof value_857 === "object" && (value_857.__messageOrder = __messageOrder_4);
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
  page?.querySelectorAll(".typing-row").forEach(value_868 => value_868.remove());
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
window.imApp.resolveFriendId = function (value_872) {
  if (value_872 && typeof value_872 === "object") return value_872.id;
  return value_872;
};
window.imApp.getFriendById = function (friendOrId) {
  const targetId = window.imApp.resolveFriendId(friendOrId);
  if (targetId == null) return null;
  return (window.imData.friends || []).find(friend_22 => String(friend_22.id) === String(targetId)) || null;
};
window.imApp.commitScopedFriendChange = async function (value_874, value_875, options_13 = {}) {
  if (!window.imApp.commitFriendChange) return false;
  const friendId_877 = window.imApp.resolveFriendId(value_874);
  if (friendId_877 == null) return false;
  return window.imApp.commitFriendChange(friendId_877, (targetFriend_8, friends_2, targetIndex) => {
    if (!targetFriend_8) return;
    return options_13.syncActive !== false && window.imApp.syncActiveFriendReference(targetFriend_8), options_13.syncSettings === true && window.imApp.syncSettingsFriendReference(targetFriend_8), typeof options_13.onTargetResolved === "function" && options_13.onTargetResolved(targetFriend_8, friends_2, targetIndex), typeof value_875 === "function" ? value_875(targetFriend_8, friends_2, targetIndex) : undefined;
  }, options_13);
};
window.imApp.runFriendPersistenceTask = async function (value_881, task) {
  const string_882 = String(value_881),
    value_883 = window.imApp.saveState.friendFlushChains.get(string_882) || Promise.resolve(),
    then_884 = value_883["catch"](() => false).then(async () => {
      return task();
    });
  window.imApp.saveState.friendFlushChains.set(string_882, then_884);
  try {
    return await then_884;
  } finally {
    window.imApp.saveState.friendFlushChains.get(string_882) === then_884 && window.imApp.saveState.friendFlushChains["delete"](string_882);
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
window.imApp.markFriendDirty = function (value_885) {
  if (value_885 == null) return;
  const safeFriendId_4 = String(value_885),
    currentRevision = window.imApp.saveState.friendRevisions.get(safeFriendId_4) || 0;
  window.imApp.saveState.friendRevisions.set(safeFriendId_4, currentRevision + 1);
  window.imApp.saveState.friendDirtyIds.add(safeFriendId_4);
  window.imApp.saveState.dirty = true;
};
window.imApp.markMomentDirty = function (value_888) {
  if (value_888 == null) return;
  const safeMomentId_2 = String(value_888),
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
window.imApp.persistGlobalData = async function (value_891 = {}) {
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage || !window.imStorage.saveGlobalData) throw new Error("imStorage.saveGlobalData unavailable");
    const payload_2 = window.imApp.buildPersistedData();
    return await window.imStorage.saveGlobalData(payload_2), window.imApp.saveState.lastError = null, true;
  } catch (lastError_2) {
    return console.error("Failed to persist iMessage global data", lastError_2), window.imApp.saveState.lastError = lastError_2, !value_891.silent && window.showToast && window.showToast("保存失败，可能是浏览器存储不可用"), false;
  }
};
window.imApp.persistFriendData = async function (friendId_3, options_14 = {}) {
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage || !window.imStorage.saveFriend) throw new Error("imStorage.saveFriend unavailable");
    const result_895 = (window.imData.friends || []).find(value_897 => String(value_897.id) === String(friendId_3));
    if (!result_895) return window.imStorage.deleteFriend && (await window.imStorage.deleteFriend(friendId_3)), window.imApp.saveState.lastError = null, true;
    const shouldPersistMetaOnly = options_14.metaOnly === true && !!window.imStorage.saveFriendMetaOnly;
    if (shouldPersistMetaOnly && window.imStorage.patchFriendMeta) {
      const pendingPatch = window.imApp.saveState.pendingFriendPatches.get(String(friendId_3)) || {};
      Object.keys(pendingPatch).length > 0 && (await window.imStorage.patchFriendMeta(friendId_3, pendingPatch));
    } else {
      const friendSnapshot = window.imApp.cloneDataSnapshot(result_895);
      shouldPersistMetaOnly ? await window.imStorage.saveFriendMetaOnly(friendSnapshot) : await window.imStorage.saveFriend(friendSnapshot, {
        skipMessages: options_14.includeMessages === false
      });
    }
    return window.imApp.saveState.lastError = null, true;
  } catch (lastError_3) {
    return console.error("Failed to persist friend data", lastError_3), window.imApp.saveState.lastError = lastError_3, !options_14.silent && window.showToast && window.showToast("好友数据保存失败"), false;
  }
};
window.imApp.persistMomentData = async function (momentId_2, value_902 = {}) {
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage) throw new Error("imStorage unavailable");
    const targetMoment = (window.imData.moments || []).find(moment_2 => String(moment_2.id) === String(momentId_2));
    if (!targetMoment) return window.imStorage.deleteMoment && (await window.imStorage.deleteMoment(momentId_2)), window.imApp.saveState.lastError = null, true;
    if (!window.imStorage.saveMoment) throw new Error("imStorage.saveMoment unavailable");
    return await window.imStorage.saveMoment(window.imApp.cloneDataSnapshot(targetMoment)), window.imApp.saveState.lastError = null, true;
  } catch (lastError_4) {
    return console.error("Failed to persist moment data", lastError_4), window.imApp.saveState.lastError = lastError_4, !value_902.silent && window.showToast && window.showToast("朋友圈数据保存失败"), false;
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
window.imApp.requestChatsListRefresh = function (value_908 = {}) {
  imChatListRenderDirty = true;
  if (imChatListRenderBatchDepth > 0 || isImChatConversationOpen()) return false;
  if (value_908.immediate) {
    if (imChatListRenderTimer) clearTimeout(imChatListRenderTimer);
    return flushImChatListRender(), true;
  }
  if (imChatListRenderTimer) return false;
  return imChatListRenderTimer = setTimeout(flushImChatListRender, IM_CHAT_LIST_RENDER_DEBOUNCE_MS), true;
};
window.imApp.beginChatsListRefreshBatch = function () {
  imChatListRenderBatchDepth += 1;
  let enabled_909 = false;
  return () => {
    if (enabled_909) return;
    enabled_909 = true;
    imChatListRenderBatchDepth = Math.max(0, imChatListRenderBatchDepth - 1);
    imChatListRenderBatchDepth === 0 && imChatListRenderDirty && window.imApp.requestChatsListRefresh();
  };
};
window.imApp.markChatsListRendered = function () {
  imChatListRenderDirty = false;
  imChatListRenderTimer && (clearTimeout(imChatListRenderTimer), imChatListRenderTimer = null);
};
window.imApp.appendFriendMessage = async function (value_910, value_911, value_912 = {}) {
  const friendId_4 = String(value_910),
    targetFriend_9 = (window.imData.friends || []).find(value_923 => String(value_923.id) === friendId_4);
  if (!targetFriend_9) return false;
  if (!Array.isArray(targetFriend_9.messages) && window.imApp.ensureFriendRecentMessagesLoaded) await window.imApp.ensureFriendRecentMessagesLoaded(targetFriend_9);else !Array.isArray(targetFriend_9.messages) && window.imApp.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(targetFriend_9));
  if (!Array.isArray(targetFriend_9.messages)) targetFriend_9.messages = [];
  const targetMessage = value_911 && typeof value_911 === "object" ? value_911 : {};
  window.imApp.captureGroupUserIdentity(targetFriend_9, targetMessage);
  const unreadCount_2 = Math.max(0, Number(targetFriend_9.unreadCount) || 0),
    messagesLoaded_916 = targetFriend_9.messagesLoaded,
    messageCount_3 = Math.max(0, Number(targetFriend_9.messageCount) || 0),
    lastMessageTimestamp_2 = Math.max(0, Number(targetFriend_9.lastMessageTimestamp) || 0),
    lastMessagePreview_2 = String(targetFriend_9.lastMessagePreview || ""),
    max_920 = Math.max(targetFriend_9.messages.length, Math.max(0, Number(targetFriend_9.messageCount) || 0), targetFriend_9.messages.reduce((value_924, value_925) => {
      const number_926 = Number(value_925?.__messageOrder);
      return Number.isFinite(number_926) ? Math.max(value_924, number_926 + 1) : value_924;
    }, 0)),
    __messageOrder_2 = max_920;
  targetMessage.__messageOrder = __messageOrder_2;
  targetFriend_9.messages.push(targetMessage);
  targetFriend_9.messagesLoaded === false ? (targetFriend_9.messageCount = max_920 + 1, targetFriend_9.lastMessageTimestamp = Number(targetMessage.timestamp) || Date.now(), targetFriend_9.lastMessagePreview = window.imApp.getFriendMessagePreview(targetMessage) || targetFriend_9.lastMessagePreview || "") : window.imApp.syncFriendMessageSummary(targetFriend_9);
  const isIncomingMessage = targetMessage.role !== "user",
    isActiveChat = window.imData.currentActiveFriend && String(window.imData.currentActiveFriend.id) === friendId_4;
  isIncomingMessage && !isActiveChat && (targetFriend_9.unreadCount = Math.max(0, Number(targetFriend_9.unreadCount) || 0) + 1);
  window.imApp.syncActiveFriendReference(targetFriend_9);
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage?.commitFriendMessage) throw new Error("Incremental friend message persistence unavailable");
    const value_927 = await window.imApp.runFriendPersistenceTask(friendId_4, async () => {
      return window.imStorage.commitFriendMessage(targetFriend_9, targetMessage, __messageOrder_2);
    });
    value_927 && value_927.id && !targetMessage.id && (targetMessage.id = value_927.id);
    targetMessage.__messageOrder = __messageOrder_2;
    window.imApp.saveState.lastError = null;
    if (window.imApp.requestChatsListRefresh) window.imApp.requestChatsListRefresh();
    return typeof CustomEvent === "function" && window.dispatchEvent(new CustomEvent("u2:friend-message-appended", {
      detail: {
        friendId: friendId_4,
        messageId: String(targetMessage.id || "")
      }
    })), isIncomingMessage && !window.imApp.isChatConversationOpen?.() && window.u2SystemNotifications?.notifyIncomingMessage && window.u2SystemNotifications.notifyIncomingMessage({
      friend: targetFriend_9,
      message: targetMessage
    }), true;
  } catch (lastError_5) {
    console.error("Failed to append friend message", lastError_5);
    targetFriend_9.messages = targetFriend_9.messages.filter((item_22, index_6) => {
      if (item_22 === targetMessage) return false;
      if (targetMessage.id && item_22?.id && String(item_22.id) === String(targetMessage.id)) return false;
      return !(index_6 === __messageOrder_2 && item_22?.timestamp != null && targetMessage.timestamp != null && String(item_22.timestamp) === String(targetMessage.timestamp));
    });
    messagesLoaded_916 === false ? (targetFriend_9.messagesLoaded = false, targetFriend_9.messageCount = messageCount_3, targetFriend_9.lastMessageTimestamp = lastMessageTimestamp_2, targetFriend_9.lastMessagePreview = lastMessagePreview_2) : (window.imApp.reindexFriendMessages(targetFriend_9), window.imApp.syncFriendMessageSummary(targetFriend_9));
    targetFriend_9.unreadCount = unreadCount_2;
    window.imApp.syncActiveFriendReference(targetFriend_9);
    if (window.imApp.requestChatsListRefresh) window.imApp.requestChatsListRefresh();
    return window.imApp.saveState.lastError = lastError_5, !value_912.silent && window.showToast && window.showToast("消息保存失败"), false;
  }
};
window.imApp.updateFriendMessage = async function (value_931, value_932, value_933, value_934 = {}) {
  const string_935 = String(value_931),
    targetFriend_10 = (window.imData.friends || []).find(value_941 => String(value_941.id) === string_935);
  if (!targetFriend_10) return false;
  window.imApp.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(targetFriend_10));
  if (!Array.isArray(targetFriend_10.messages)) return false;
  const __messageOrder_3 = window.imApp.findFriendMessageIndex(targetFriend_10, value_932);
  if (__messageOrder_3 < 0) return false;
  const previousMessage = window.imApp.cloneDataSnapshot(targetFriend_10.messages[__messageOrder_3]),
    targetMessage_5 = targetFriend_10.messages[__messageOrder_3],
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
    value_939_940 = getApiContextFingerprint(previousMessage);
  try {
    typeof value_933 === "function" && (await value_933(targetMessage_5, targetFriend_10, __messageOrder_3));
    targetMessage_5.__messageOrder = __messageOrder_3;
    window.imApp.syncFriendMessageSummary(targetFriend_10);
    window.imApp.syncActiveFriendReference(targetFriend_10);
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage?.commitFriendMessage) throw new Error("Incremental friend message persistence unavailable");
    const persistedMessage = await window.imApp.runFriendPersistenceTask(string_935, async () => {
      return window.imStorage.commitFriendMessage(targetFriend_10, targetMessage_5, __messageOrder_3);
    });
    return persistedMessage && persistedMessage.id && !targetMessage_5.id && (targetMessage_5.id = persistedMessage.id), persistedMessage && ["contentAssetId", "stickerAssetId", "senderAvatarAssetId"].forEach(field => {
      Object.prototype.hasOwnProperty.call(persistedMessage, field) && (targetMessage_5[field] = persistedMessage[field] || "");
    }), targetMessage_5.__messageOrder = __messageOrder_3, getApiContextFingerprint(targetMessage_5) !== value_939_940 && window.imApp.clearFriendRuntimeMessageContext(targetFriend_10), window.imApp.syncActiveFriendReference(targetFriend_10), window.imApp.syncSettingsFriendReference(targetFriend_10), window.imApp.saveState.lastError = null, true;
  } catch (lastError_6) {
    return console.error("Failed to update friend message", lastError_6), targetFriend_10.messages[__messageOrder_3] = previousMessage, window.imApp.syncFriendMessageSummary(targetFriend_10), window.imApp.syncActiveFriendReference(targetFriend_10), window.imApp.saveState.lastError = lastError_6, !value_934.silent && window.showToast && window.showToast("消息保存失败"), false;
  }
};
window.imApp.removeFriendMessages = async function (value_946, descriptors, value_948 = {}) {
  const safeFriendId_5 = String(value_946),
    targetFriend = (window.imData.friends || []).find(value_969 => String(value_969.id) === safeFriendId_5);
  if (!targetFriend) return false;
  window.imApp.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(targetFriend));
  if (!Array.isArray(targetFriend.messages)) return false;
  const descriptorList = Array.isArray(descriptors) ? descriptors : [descriptors],
    messages_7 = window.imApp.cloneDataSnapshot(targetFriend.messages),
    previousFriend = typeof value_948.beforePersist === "function" ? window.imApp.cloneDataSnapshot(targetFriend) : null,
    pendingRegenerateContext_2 = window.imApp.cloneDataSnapshot(targetFriend.pendingRegenerateContext || null),
    recallPresentation_4 = window.imApp.cloneDataSnapshot(targetFriend.memory?.recallPresentation || null),
    currentReplyText_2 = window.imData.currentReplyText || null,
    currentReplyMessageId_2 = window.imData.currentReplyMessageId || null,
    cloneDataSnapshot_956 = window.imApp.cloneDataSnapshot(targetFriend.memory?.summaryCursor || null),
    lastSummaryMessageCount_4 = Math.max(0, Number(targetFriend.memory?.lastSummaryMessageCount) || 0),
    presetId_3 = String(cloneDataSnapshot_956?.messageId || "").trim(),
    min_959 = Math.min(messages_7.length, Math.max(0, Number(cloneDataSnapshot_956?.count) || lastSummaryMessageCount_4)),
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
    normalizeReplyReferenceText = value_32 => String(value_32 || "").replace(/\s+/g, " ").trim();
  removedMessages.forEach(message_21 => {
    [message_21?.content, message_21?.text, message_21?.transcript, message_21?.description, message_21?.fakeLinkData?.title, message_21?.fakeLinkData?.summary].forEach(value_33 => {
      const text_6 = normalizeReplyReferenceText(value_33);
      if (text_6) removedReplyTexts.add(text_6);
    });
    const primaryText = normalizeReplyReferenceText(message_21?.content || message_21?.text || message_21?.transcript || message_21?.description),
      translationText = normalizeReplyReferenceText(message_21?.translation);
    if (primaryText && translationText) removedReplyTexts.add(primaryText + " " + translationText);
  });
  let enabled_963 = false,
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
    (replyMessageId && removedMessageIds.has(replyMessageId) || replyText && removedReplyTexts.has(replyText)) && (delete message_25.replyToMessageId, delete message_25.replyTo, enabled_963 = true);
  });
  const recallPresentation_3 = targetFriend.memory?.recallPresentation;
  if (recallPresentation_3) {
    const triggerUserMessageId_2 = String(recallPresentation_3.triggerUserMessageId || "").trim(),
      presentationRunId = String(recallPresentation_3.apiRunId || "").trim(),
      triggerStillExists = !triggerUserMessageId_2 || targetFriend.messages.some(message_26 => message_26?.role === "user" && String(message_26.id || "") === triggerUserMessageId_2),
      anchorStillExists = !presentationRunId || targetFriend.messages.some(message_27 => message_27?.role === "assistant" && String(message_27.apiRunId || "") === presentationRunId);
    (triggerUserMessageId_2 && removedMessageIds.has(triggerUserMessageId_2) || presentationRunId && removedApiRunIds.has(presentationRunId) || !triggerStillExists || !anchorStillExists) && (targetFriend.memory.recallPresentation = null);
  }
  if (typeof value_948.beforePersist === "function") try {
    value_948.beforePersist(targetFriend);
  } catch (value_998) {
    console.error("Failed to apply friend message removal metadata", value_998);
    previousFriend ? (Object.keys(targetFriend).forEach(key_6 => delete targetFriend[key_6]), Object.assign(targetFriend, previousFriend)) : targetFriend.messages = messages_7;
    window.imApp.reindexFriendMessages(targetFriend);
    window.imApp.syncFriendMessageSummary(targetFriend);
    window.imApp.syncActiveFriendReference(targetFriend);
    window.imApp.syncSettingsFriendReference(targetFriend);
    if (!value_948.silent && window.showToast) window.showToast("删除消息失败");
    return false;
  }
  window.imApp.reindexFriendMessages(targetFriend);
  targetFriend.memory = targetFriend.memory || window.imApp.createDefaultMemory();
  const value_966 = presetId_3 ? targetFriend.messages.findIndex(item_23 => String(item_23?.id || "") === presetId_3) : -1,
    lastSummaryMessageCount_3 = value_966 >= 0 ? value_966 + 1 : Math.max(0, min_959 - sortedRemovalIndexes.filter(value_1001 => value_1001 < min_959).length),
    value_968 = lastSummaryMessageCount_3 > 0 ? targetFriend.messages[lastSummaryMessageCount_3 - 1] : null;
  targetFriend.memory.lastSummaryMessageCount = lastSummaryMessageCount_3;
  targetFriend.memory.summaryCursor = {
    messageId: String(value_968?.id || "").trim(),
    order: Number.isFinite(Number(value_968?.__messageOrder)) ? Number(value_968.__messageOrder) : -1,
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
      if (canDeleteWithoutReindex && !enabled_963 && removableIds.length === removedMessages.length && window.imStorage?.deleteFriendMessages) await window.imStorage.deleteFriendMessages(removableIds);else {
        if (window.imStorage?.replaceFriendMessages) await window.imStorage.replaceFriendMessages(safeFriendId_5, targetFriend.messages);else throw new Error("Friend message removal persistence unavailable");
      }
      return await window.imStorage.saveFriendMeta(targetFriend), true;
    }), window.imApp.saveState.lastError = null, !value_948.preserveRegenerateSnapshots && removedApiRunIds.size > 0 && window.imChat?.purgeRegenerateRunSnapshots && window.imChat.purgeRegenerateRunSnapshots(safeFriendId_5, Array.from(removedApiRunIds)), true;
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
      targetFriend.memory.summaryCursor = cloneDataSnapshot_956 || {
        messageId: "",
        order: -1,
        count: lastSummaryMessageCount_4
      };
    }
    return window.imData.currentReplyText = currentReplyText_2, window.imData.currentReplyMessageId = currentReplyMessageId_2, window.imApp.reindexFriendMessages(targetFriend), window.imApp.syncFriendMessageSummary(targetFriend), window.imApp.syncActiveFriendReference(targetFriend), window.imApp.syncSettingsFriendReference(targetFriend), window.imApp.saveState.lastError = lastError_7, !value_948.silent && window.showToast && window.showToast("删除消息失败"), false;
  }
};
window.imApp.resetFriendMessages = async function (value_1006, value_1007 = {}) {
  const string_1008 = String(value_1006),
    targetFriend_11 = (window.imData.friends || []).find(value_1013 => String(value_1013.id) === string_1008);
  if (!targetFriend_11) return false;
  window.imApp.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(targetFriend_11));
  const previousFriend_2 = window.imApp.cloneDataSnapshot(targetFriend_11),
    filter_1011 = (Array.isArray(targetFriend_11.messages) ? targetFriend_11.messages : []).map(message_29 => String(message_29?.apiRunId || "").trim()).filter(Boolean),
    result_1012 = window.imApp.saveState.friendTimers.get(string_1008);
  if (result_1012) clearTimeout(result_1012.timer || result_1012);
  window.imApp.saveState.friendTimers["delete"](string_1008);
  window.imApp.saveState.friendDirtyIds["delete"](string_1008);
  window.imChat?.invalidateFriendConversation && window.imChat.invalidateFriendConversation(string_1008);
  targetFriend_11.messages = [];
  targetFriend_11.unreadCount = 0;
  targetFriend_11.memory = window.imApp.normalizeFriendData(targetFriend_11).memory;
  targetFriend_11.memory.lastSummaryMessageCount = 0;
  targetFriend_11.memory.recallPresentation = null;
  if (targetFriend_11.pendingRegenerateContext) delete targetFriend_11.pendingRegenerateContext;
  window.imApp.syncFriendMessageSummary(targetFriend_11);
  window.imApp.clearFriendRuntimeMessageContext(targetFriend_11);
  window.imApp.syncActiveFriendReference(targetFriend_11);
  window.imApp.syncSettingsFriendReference(targetFriend_11);
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage?.replaceFriendMessages || !window.imStorage?.saveFriendMeta) throw new Error("Friend message reset persistence unavailable");
    await window.imApp.runFriendPersistenceTask(string_1008, async () => {
      return await window.imStorage.replaceFriendMessages(string_1008, []), await window.imStorage.saveFriendMeta(targetFriend_11), true;
    });
    window.imApp.saveState.lastError = null;
    filter_1011.length > 0 && window.imChat?.purgeRegenerateRunSnapshots && window.imChat.purgeRegenerateRunSnapshots(string_1008, filter_1011);
    if (window.imApp.updateChatsUnreadBadges) window.imApp.updateChatsUnreadBadges();
    return true;
  } catch (lastError_8) {
    return console.error("Failed to reset friend messages", lastError_8), Object.keys(targetFriend_11).forEach(key_8 => delete targetFriend_11[key_8]), Object.assign(targetFriend_11, previousFriend_2), window.imApp.reindexFriendMessages(targetFriend_11), window.imApp.syncFriendMessageSummary(targetFriend_11), window.imApp.syncActiveFriendReference(targetFriend_11), window.imApp.syncSettingsFriendReference(targetFriend_11), window.imApp.saveState.lastError = lastError_8, !value_1007.silent && window.showToast && window.showToast("聊天记录清空失败"), false;
  }
};
window.imApp.buildFriendMetaPatch = function (previousFriend_3, nextFriend) {
  if (!nextFriend || typeof nextFriend !== "object") return {};
  if (!previousFriend_3 || typeof previousFriend_3 !== "object") {
    const cloneDataSnapshot_1020 = window.imApp.cloneDataSnapshot(nextFriend);
    return delete cloneDataSnapshot_1020.messages, cloneDataSnapshot_1020;
  }
  const patch = {};
  return Object.keys(nextFriend).forEach(key_9 => {
    if (key_9 === "messages") return;
    const previousValue = previousFriend_3[key_9],
      nextValue = nextFriend[key_9];
    let changed = previousValue !== nextValue;
    if (previousValue && nextValue && typeof previousValue === "object" && typeof nextValue === "object") try {
      changed = JSON.stringify(previousValue) !== JSON.stringify(nextValue);
    } catch (value_1025) {
      changed = true;
    }
    if (changed) patch[key_9] = window.imApp.cloneDataSnapshot(nextValue);
  }), patch;
};
window.imApp.resetFriendConversation = async function (value_1026, value_1027 = {}) {
  const safeFriendId_6 = String(value_1026),
    targetFriend_12 = (window.imData.friends || []).find(value_1032 => String(value_1032.id) === safeFriendId_6);
  if (!targetFriend_12) return false;
  window.imApp.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(targetFriend_12));
  const previousFriend_4 = window.imApp.cloneDataSnapshot(targetFriend_12),
    result_1031 = window.imApp.saveState.friendTimers.get(safeFriendId_6);
  if (result_1031) clearTimeout(result_1031);
  window.imApp.saveState.friendTimers["delete"](safeFriendId_6);
  window.imApp.saveState.friendDirtyIds["delete"](safeFriendId_6);
  window.imChat?.invalidateFriendConversation && window.imChat.invalidateFriendConversation(safeFriendId_6);
  targetFriend_12.messages = [];
  targetFriend_12.unreadCount = 0;
  targetFriend_12.memory = window.imApp.createClearedConversationMemory(targetFriend_12.memory || {});
  targetFriend_12.profilePanel = window.imApp.createDefaultProfilePanel({});
  targetFriend_12.latestThought = "";
  targetFriend_12.status = "online";
  if (targetFriend_12.type === "group") targetFriend_12.memberProfiles = {};
  if (targetFriend_12.pendingRegenerateContext) delete targetFriend_12.pendingRegenerateContext;
  window.imApp.syncFriendMessageSummary(targetFriend_12);
  window.imApp.clearFriendRuntimeMessageContext(targetFriend_12);
  window.imApp.syncActiveFriendReference(targetFriend_12);
  window.imApp.syncSettingsFriendReference(targetFriend_12);
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage?.replaceFriendMessages || !window.imStorage?.saveFriendMeta) throw new Error("Friend conversation reset persistence unavailable");
    await window.imApp.runFriendPersistenceTask(safeFriendId_6, async () => {
      return await window.imStorage.replaceFriendMessages(safeFriendId_6, []), await window.imStorage.saveFriendMeta(targetFriend_12), true;
    });
    window.imApp.saveState.lastError = null;
    if (window.imApp.updateChatsUnreadBadges) window.imApp.updateChatsUnreadBadges();
    return true;
  } catch (lastError_9) {
    console.error("Failed to reset friend conversation", lastError_9);
    Object.keys(targetFriend_12).forEach(key_10 => delete targetFriend_12[key_10]);
    Object.assign(targetFriend_12, previousFriend_4);
    window.imApp.reindexFriendMessages(targetFriend_12);
    window.imApp.syncFriendMessageSummary(targetFriend_12);
    window.imApp.syncActiveFriendReference(targetFriend_12);
    window.imApp.syncSettingsFriendReference(targetFriend_12);
    window.imApp.saveState.lastError = lastError_9;
    try {
      window.imStorage?.replaceFriendMessages && window.imStorage?.saveFriendMeta && (await window.imApp.runFriendPersistenceTask(safeFriendId_6, async () => {
        return await window.imStorage.replaceFriendMessages(safeFriendId_6, previousFriend_4.messages || []), await window.imStorage.saveFriendMeta(previousFriend_4), true;
      }));
    } catch (rollbackError) {
      console.error("Failed to roll back friend conversation reset", rollbackError);
    }
    return !value_1027.silent && window.showToast && window.showToast("聊天记录与上下文清空失败"), false;
  }
};
window.imApp.persistMomentMessagesData = async function (value_1036 = {}) {
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage || !window.imStorage.saveMomentMessages) throw new Error("imStorage.saveMomentMessages unavailable");
    return await window.imStorage.saveMomentMessages(window.imApp.cloneDataSnapshot(Array.isArray(window.imData.momentMessages) ? window.imData.momentMessages : [])), window.imApp.saveState.lastError = null, true;
  } catch (lastError_10) {
    return console.error("Failed to persist moment message data", lastError_10), window.imApp.saveState.lastError = lastError_10, !value_1036.silent && window.showToast && window.showToast("朋友圈通知保存失败"), false;
  }
};
window.imApp.persistStickersData = async function (value_1038 = {}) {
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage || !window.imStorage.saveStickers) throw new Error("imStorage.saveStickers unavailable");
    return await window.imStorage.saveStickers(window.imApp.cloneDataSnapshot(Array.isArray(window.imData.stickers) ? window.imData.stickers : [])), window.imApp.saveState.lastError = null, true;
  } catch (lastError_11) {
    return console.error("Failed to persist sticker data", lastError_11), window.imApp.saveState.lastError = lastError_11, !value_1038.silent && window.showToast && window.showToast("表情包保存失败"), false;
  }
};
window.imApp.persistMomentsCoverData = async function (value_1040 = {}) {
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage || !window.imStorage.saveMomentsCover) throw new Error("imStorage.saveMomentsCover unavailable");
    return await window.imStorage.saveMomentsCover(window.imData.momentsCoverUrl || null), window.imApp.saveState.lastError = null, true;
  } catch (lastError_12) {
    return console.error("Failed to persist moments cover data", lastError_12), window.imApp.saveState.lastError = lastError_12, !value_1040.silent && window.showToast && window.showToast("朋友圈封面保存失败"), false;
  }
};
window.imApp.flushFriendSave = async function (value_1042, options_15 = {}) {
  const safeFriendId_7 = String(value_1042),
    timerRecord = window.imApp.saveState.friendTimers.get(safeFriendId_7);
  timerRecord && (clearTimeout(timerRecord.timer || timerRecord), window.imApp.saveState.friendTimers["delete"](safeFriendId_7));
  const value_1046 = window.imApp.saveState.friendFlushChains.get(safeFriendId_7) || Promise.resolve(),
    then_1047 = value_1046["catch"](() => false).then(async () => {
      const value_1048 = window.imApp.saveState.friendRevisions.get(safeFriendId_7) || 0,
        timerOptions_2 = timerRecord && typeof timerRecord === "object" ? timerRecord.options || {} : {},
        persistOptions = {
          ...timerOptions_2,
          ...options_15
        },
        saved_2 = await window.imApp.persistFriendData(safeFriendId_7, persistOptions);
      if (saved_2) {
        const value_1052 = window.imApp.saveState.friendRevisions.get(safeFriendId_7) || 0;
        value_1052 === value_1048 && (window.imApp.saveState.friendDirtyIds["delete"](safeFriendId_7), window.imApp.saveState.pendingFriendPatches["delete"](safeFriendId_7));
      }
      return window.imApp.saveState.dirty = window.imApp.saveState.friendDirtyIds.size > 0 || window.imApp.saveState.momentDirtyIds.size > 0 || window.imApp.saveState.momentMessagesDirty || window.imApp.saveState.stickersDirty || window.imApp.saveState.momentsCoverDirty, saved_2;
    });
  window.imApp.saveState.friendFlushChains.set(safeFriendId_7, then_1047);
  try {
    return await then_1047;
  } finally {
    window.imApp.saveState.friendFlushChains.get(safeFriendId_7) === then_1047 && window.imApp.saveState.friendFlushChains["delete"](safeFriendId_7);
  }
};
window.imApp.scheduleFriendSave = function (value_1053, options_16 = {}) {
  if (value_1053 == null) return false;
  const safeFriendId = String(value_1053),
    delay_2 = Number.isFinite(Number(options_16.delay)) ? Number(options_16.delay) : 500;
  window.imApp.markFriendDirty(safeFriendId);
  const result_1056 = window.imApp.saveState.friendTimers.get(safeFriendId);
  result_1056 && clearTimeout(result_1056.timer || result_1056);
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
window.imApp.flushMomentSave = async function (value_1058, options_17 = {}) {
  const safeMomentId_3 = String(value_1058),
    result_1061 = window.imApp.saveState.momentTimers.get(safeMomentId_3);
  result_1061 && (clearTimeout(result_1061), window.imApp.saveState.momentTimers["delete"](safeMomentId_3));
  const previousChain = window.imApp.saveState.momentFlushChains.get(safeMomentId_3) || Promise.resolve(),
    nextChain = previousChain["catch"](() => false).then(async () => {
      const value_1064 = window.imApp.saveState.momentRevisions.get(safeMomentId_3) || 0,
        saved_3 = await window.imApp.persistMomentData(safeMomentId_3, options_17);
      if (saved_3) {
        const value_1066 = window.imApp.saveState.momentRevisions.get(safeMomentId_3) || 0;
        value_1066 === value_1064 && window.imApp.saveState.momentDirtyIds["delete"](safeMomentId_3);
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
window.imApp.scheduleMomentSave = function (value_1067, options_18 = {}) {
  if (value_1067 == null) return false;
  const safeMomentId = String(value_1067),
    delay_3 = Number.isFinite(Number(options_18.delay)) ? Number(options_18.delay) : 500;
  window.imApp.markMomentDirty(safeMomentId);
  const result_1070 = window.imApp.saveState.momentTimers.get(safeMomentId);
  result_1070 && clearTimeout(result_1070);
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
window.imApp.commitGlobalChange = async function (value_1090, options_24 = {}) {
  const persistedData_1092 = window.imApp.buildPersistedData();
  try {
    typeof value_1090 === "function" && (await value_1090());
    if (options_24.immediate === false) return window.imApp.scheduleGlobalSave({
      delay: options_24.delay,
      silent: options_24.silent !== false
    }), typeof options_24.onSuccess === "function" && options_24.onSuccess(window.imData), true;
    const saved_12 = await window.imApp.flushGlobalSave({
      silent: !!options_24.silent
    });
    if (!saved_12) return window.imData.friends = persistedData_1092.friends, window.imData.moments = persistedData_1092.moments, window.imData.momentMessages = persistedData_1092.momentMessages, window.imData.stickers = persistedData_1092.stickers, window.imData.momentsCoverUrl = persistedData_1092.momentsCoverUrl, typeof options_24.onRollback === "function" && options_24.onRollback(window.imData), false;
    return typeof options_24.onSuccess === "function" && options_24.onSuccess(window.imData), true;
  } catch (e_3) {
    return console.error("Failed to commit global change", e_3), window.imData.friends = persistedData_1092.friends, window.imData.moments = persistedData_1092.moments, window.imData.momentMessages = persistedData_1092.momentMessages, window.imData.stickers = persistedData_1092.stickers, window.imData.momentsCoverUrl = persistedData_1092.momentsCoverUrl, typeof options_24.onRollback === "function" && options_24.onRollback(window.imData), !options_24.silent && window.showToast && window.showToast("保存失败，已撤销本次修改"), false;
  }
};
window.imApp.commitFriendChange = async function (friendId_6, value_1096, options_25 = {}) {
  let friends_3 = Array.isArray(window.imData.friends) ? window.imData.friends : [],
    index_1099 = friends_3.findIndex(value_1102 => String(value_1102.id) === String(friendId_6));
  const value_1100 = index_1099 > -1 ? friends_3[index_1099] : null;
  value_1100 && value_1100.messagesLoaded === false && options_25.metaOnly !== true && window.imApp.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(value_1100), friends_3 = Array.isArray(window.imData.friends) ? window.imData.friends : [], index_1099 = friends_3.findIndex(value_1103 => String(value_1103.id) === String(friendId_6)));
  let previousFriend_5 = null;
  if (index_1099 > -1) {
    if (options_25.metaOnly === true) {
      const {
        messages: messages_9,
        ...value_1105
      } = friends_3[index_1099];
      previousFriend_5 = window.imApp.cloneDataSnapshot(value_1105);
      Object.prototype.hasOwnProperty.call(friends_3[index_1099], "messages") && (previousFriend_5.messages = messages_9);
    } else previousFriend_5 = window.imApp.cloneDataSnapshot(friends_3[index_1099]);
  }
  try {
    const targetFriend_13 = index_1099 > -1 ? friends_3[index_1099] : null;
    typeof value_1096 === "function" && (await value_1096(targetFriend_13, friends_3, index_1099));
    if (options_25.metaOnly === true && targetFriend_13) {
      const safeFriendId_8 = String(friendId_6),
        nextPatch = window.imApp.buildFriendMetaPatch(previousFriend_5, targetFriend_13),
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
    if (!saved_13) return index_1099 > -1 && (previousFriend_5 ? window.imData.friends[index_1099] = previousFriend_5 : window.imData.friends.splice(index_1099, 1)), typeof options_25.onRollback === "function" && options_25.onRollback(window.imData.friends), false;
    return typeof options_25.onSuccess === "function" && options_25.onSuccess(window.imData.friends), true;
  } catch (e_4) {
    return console.error("Failed to commit friend change", e_4), index_1099 > -1 && (previousFriend_5 ? window.imData.friends[index_1099] = previousFriend_5 : window.imData.friends.splice(index_1099, 1)), typeof options_25.onRollback === "function" && options_25.onRollback(window.imData.friends), !options_25.silent && window.showToast && window.showToast("保存失败，已撤销本次修改"), false;
  }
};
window.imApp.commitFriendsChange = async function (value_1111, options_26 = {}) {
  window.imApp.ensureDataReady && !window.imData.ready && (await window.imApp.ensureDataReady());
  const friends_4 = window.imApp.cloneDataSnapshot(Array.isArray(window.imData.friends) ? window.imData.friends : []);
  try {
    typeof value_1111 === "function" && (await value_1111());
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
window.imApp.commitMomentChange = async function (momentId_4, value_1124, options_27 = {}) {
  const moments_2 = Array.isArray(window.imData.moments) ? window.imData.moments : [],
    index_1127 = moments_2.findIndex(value_1129 => String(value_1129.id) === String(momentId_4)),
    value_1128 = index_1127 > -1 ? window.imApp.cloneDataSnapshot(moments_2[index_1127]) : null;
  try {
    const value_1130 = index_1127 > -1 ? moments_2[index_1127] : null;
    typeof value_1124 === "function" && (await value_1124(value_1130, moments_2, index_1127));
    window.imApp.markMomentDirty(momentId_4);
    if (options_27.immediate === false) return window.imApp.scheduleMomentSave(momentId_4, {
      delay: options_27.delay,
      silent: options_27.silent !== false
    }), typeof options_27.onSuccess === "function" && options_27.onSuccess(window.imData.moments), true;
    const saved_15 = await window.imApp.flushMomentSave(momentId_4, {
      silent: !!options_27.silent
    });
    if (!saved_15) return index_1127 > -1 && (value_1128 ? window.imData.moments[index_1127] = value_1128 : window.imData.moments.splice(index_1127, 1)), typeof options_27.onRollback === "function" && options_27.onRollback(window.imData.moments), false;
    return typeof options_27.onSuccess === "function" && options_27.onSuccess(window.imData.moments), true;
  } catch (e_6) {
    return console.error("Failed to commit moment change", e_6), index_1127 > -1 && (value_1128 ? window.imData.moments[index_1127] = value_1128 : window.imData.moments.splice(index_1127, 1)), typeof options_27.onRollback === "function" && options_27.onRollback(window.imData.moments), !options_27.silent && window.showToast && window.showToast("朋友圈保存失败，已撤销本次修改"), false;
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
    const result_1138 = window.imApp.saveState.momentTimers.get(safeMomentId_4);
    result_1138 && (clearTimeout(result_1138), window.imApp.saveState.momentTimers["delete"](safeMomentId_4));
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
window.imApp.saveMomentsCover = async function (value_1158, value_1159 = {}) {
  window.imData.momentsCoverUrl = value_1158 || null;
  window.imApp.markMomentsCoverDirty();
  if (value_1159.immediate === false) return window.imApp.scheduleGlobalSave({
    delay: value_1159.delay,
    silent: value_1159.silent !== false
  }), window.imData.momentsCoverUrl;
  const saved_19 = await window.imApp.flushMomentsCoverSave(value_1159);
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
window.getGlobalWorldBookContextByPosition = function (position_2 = "before_role", contextText_2 = "", value_1165 = {}) {
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
    keywordMatched = window.worldBookKeywordMatched ? window.worldBookKeywordMatched : function (value_1173, value_1174 = "") {
      if (!value_1173 || value_1173.triggerMode !== "keyword") return true;
      const value_1175 = value_1173.keyword ? String(value_1173.keyword).trim() : "";
      if (!value_1175) return false;
      return String(value_1174 || "").includes(value_1175);
    },
    value_1168 = window.formatWorldBookEntryForPrompt ? window.formatWorldBookEntryForPrompt : function (message_1176) {
      const value_1177 = message_1176.title ? String(message_1176.title).trim() : "未命名词条",
        value_1178 = message_1176.keyword ? String(message_1176.keyword).trim() : "",
        value_1179 = message_1176.content ? String(message_1176.content).trim() : "",
        value_1180 = message_1176.triggerMode === "keyword" ? "关键词" : "永久";
      let text_1181 = "角色前";
      if (message_1176.injectionPosition === "after_role") text_1181 = "角色后";
      if (message_1176.injectionPosition === "system_depth") text_1181 = "系统深度";
      let value_1182 = "【" + value_1177 + "】\n";
      return value_1182 += "触发机制: " + value_1180 + "\n", value_1182 += "注入位置: " + text_1181 + "\n", message_1176.injectionPosition === "system_depth" && (value_1182 += "深度: " + message_1176.systemDepth + "\n", value_1182 += "顺序: " + message_1176.order + "\n"), message_1176.triggerMode === "keyword" && value_1178 && (value_1182 += "关键词: " + value_1178 + "\n"), value_1179 && (value_1182 += "内容:\n" + value_1179 + "\n"), value_1182.trim();
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
  const items_1171 = [];
  if (positionEntries.length > 0) {
    positionEntries.sort((value_1191, value_1192) => {
      if (position_2 === "system_depth") {
        if (value_1191.systemDepth !== value_1192.systemDepth) return value_1191.systemDepth - value_1192.systemDepth;
        return value_1191.order - value_1192.order;
      }
      return value_1191.order - value_1192.order;
    });
    let value_1190 = titleMap[position_2] + ":\n";
    positionEntries.forEach(value_1193 => {
      value_1190 += "〔" + value_1193.__bookName + "〕\n" + value_1168(value_1193) + "\n\n";
    });
    items_1171.push(value_1190.trim());
  }
  if (value_1165.includeBuiltin !== false && window.getBuiltinWorldBookContext) {
    const builtinSection = window.getBuiltinWorldBookContext(position_2, contextText_2);
    builtinSection && items_1171.push(builtinSection.trim());
  }
  return items_1171.join("\n\n").trim();
};
window.getGlobalWorldBookContext = function (contextText = "") {
  const positions = ["system_depth", "before_role", "after_role"],
    sections = positions.map(position_3 => window.getGlobalWorldBookContextByPosition(position_3, contextText)).filter(Boolean);
  return sections.join("\n\n").trim();
};
window.imApp.getWorldBookContextForFriendByPosition = function (value_1197 = "before_role", value_1198 = null, value_1199 = "", value_1200 = {}) {
  const value_1201 = window.normalizeWorldBookEntry ? window.normalizeWorldBookEntry : function (message_1209 = {}) {
      return {
        title: message_1209.title || message_1209.name || message_1209.keyword || "未命名词条",
        keyword: message_1209.keyword || "",
        content: message_1209.content || "",
        triggerMode: message_1209.triggerMode === "keyword" ? "keyword" : "permanent",
        injectionPosition: ["before_role", "after_role", "system_depth"].includes(message_1209.injectionPosition) ? message_1209.injectionPosition : "before_role",
        systemDepth: Number.isFinite(Number(message_1209.systemDepth)) ? Number(message_1209.systemDepth) : 4,
        order: Number.isFinite(Number(message_1209.order)) ? Number(message_1209.order) : 100,
        enabled: message_1209.enabled !== false
      };
    },
    value_1202 = window.worldBookKeywordMatched ? window.worldBookKeywordMatched : function (value_1210, value_1211 = "") {
      if (!value_1210 || value_1210.triggerMode !== "keyword") return true;
      const value_1212 = value_1210.keyword ? String(value_1210.keyword).trim() : "";
      if (!value_1212) return false;
      return String(value_1211 || "").includes(value_1212);
    },
    value_1203 = window.formatWorldBookEntryForPrompt ? window.formatWorldBookEntryForPrompt : function (message_1213) {
      const value_1214 = message_1213.title ? String(message_1213.title).trim() : "未命名词条",
        value_1215 = message_1213.keyword ? String(message_1213.keyword).trim() : "",
        value_1216 = message_1213.content ? String(message_1213.content).trim() : "",
        value_1217 = message_1213.triggerMode === "keyword" ? "关键词" : "永久";
      let text_1218 = "角色前";
      if (message_1213.injectionPosition === "after_role") text_1218 = "角色后";
      if (message_1213.injectionPosition === "system_depth") text_1218 = "系统深度";
      let value_1219 = "【" + value_1214 + "】\n";
      return value_1219 += "触发机制: " + value_1217 + "\n", value_1219 += "注入位置: " + text_1218 + "\n", message_1213.injectionPosition === "system_depth" && (value_1219 += "深度: " + message_1213.systemDepth + "\n", value_1219 += "顺序: " + message_1213.order + "\n"), message_1213.triggerMode === "keyword" && value_1215 && (value_1219 += "关键词: " + value_1215 + "\n"), value_1216 && (value_1219 += "内容:\n" + value_1216 + "\n"), value_1219.trim();
    },
    options_1204 = {
      before_role: "Bound World Book / 绑定角色前",
      after_role: "Bound World Book / 绑定角色后",
      system_depth: "Bound World Book / 绑定系统深度"
    },
    items_1205 = [],
    value_1206 = value_1200.includeGlobal === false ? "" : window.getGlobalWorldBookContextByPosition?.(value_1197, value_1199, value_1200) || "";
  value_1206 && items_1205.push(value_1206.trim());
  const value_1207 = value_1198 ? window.imApp.normalizeFriendData(value_1198) : null,
    value_1208 = value_1207 && Array.isArray(value_1207.boundBooks) ? value_1207.boundBooks.map(value_1220 => String(value_1220)) : [];
  if (value_1208.length > 0 && window.getWorldBooks) {
    const presentedEntries = window.getWorldBooks(),
      items_1222 = [];
    Array.isArray(presentedEntries) && presentedEntries.filter(value_1223 => value_1223 && value_1208.includes(String(value_1223.id)) && Array.isArray(value_1223.entries)).forEach(value_1224 => {
      value_1224.entries.map(value_1225 => value_1201(value_1225)).filter(value_1226 => value_1226 && value_1226.enabled !== false).filter(value_1227 => value_1227.injectionPosition === value_1197).filter(value_1228 => value_1202(value_1228, value_1199)).forEach(value_1229 => {
        items_1222.push({
          ...value_1229,
          __bookName: value_1224.name || "未命名世界书"
        });
      });
    });
    if (items_1222.length > 0) {
      items_1222.sort((value_1231, value_1232) => {
        if (value_1197 === "system_depth") {
          if (value_1231.systemDepth !== value_1232.systemDepth) return value_1231.systemDepth - value_1232.systemDepth;
          return value_1231.order - value_1232.order;
        }
        return value_1231.order - value_1232.order;
      });
      let value_1230 = options_1204[value_1197] + ":\n";
      items_1222.forEach(value_1233 => {
        value_1230 += "〔" + value_1233.__bookName + "〕\n" + value_1203(value_1233) + "\n\n";
      });
      items_1205.push(value_1230.trim());
    }
  }
  return items_1205.join("\n\n").trim();
};
window.getWorldBookContextForFriendByPosition = function (value_1234 = "before_role", value_1235 = null, value_1236 = "", value_1237 = {}) {
  return window.imApp.getWorldBookContextForFriendByPosition(value_1234, value_1235, value_1236, value_1237);
};
window.imApp.commitFriendMetaPatch = async function (value_1238, value_1239, value_1240 = {}) {
  const string_1241 = String(value_1238),
    result_1242 = (window.imData.friends || []).find(value_1245 => String(value_1245.id) === string_1241);
  if (!result_1242 || !value_1239 || typeof value_1239 !== "object") return false;
  const filter_1243 = Object.entries(value_1239).filter(([value_1246]) => value_1246 !== "id" && value_1246 !== "messages");
  if (filter_1243.length === 0) return true;
  const items_1244 = new Map(filter_1243.map(([value_1247]) => [value_1247, {
    present: Object.prototype.hasOwnProperty.call(result_1242, value_1247),
    value: result_1242[value_1247]
  }]));
  filter_1243.forEach(([value_1248, value_1249]) => {
    result_1242[value_1248] = value_1249;
  });
  window.imApp.syncActiveFriendReference(result_1242);
  window.imApp.syncSettingsFriendReference(result_1242);
  try {
    if (window.imApp.ensureDataReady) await window.imApp.ensureDataReady();
    if (!window.imStorage?.patchFriendMeta) throw new Error("Incremental friend metadata persistence unavailable");
    await window.imApp.runFriendPersistenceTask(string_1241, () => window.imStorage.patchFriendMeta(string_1241, value_1239));
    window.imApp.saveState.lastError = null;
    if (typeof value_1240.onSuccess === "function") value_1240.onSuccess(result_1242);
    return true;
  } catch (lastError_14) {
    items_1244.forEach((value_1251, value_1252) => {
      if (result_1242[value_1252] !== value_1239[value_1252]) return;
      if (value_1251.present) result_1242[value_1252] = value_1251.value;else delete result_1242[value_1252];
    });
    window.imApp.syncActiveFriendReference(result_1242);
    window.imApp.syncSettingsFriendReference(result_1242);
    window.imApp.saveState.lastError = lastError_14;
    console.error("Failed to patch friend metadata", lastError_14);
    if (!value_1240.silent && window.showToast) window.showToast("好友数据保存失败");
    if (typeof value_1240.onRollback === "function") value_1240.onRollback(result_1242);
    return false;
  }
};
window.imApp.getWorldBookContextForFriendByPosition = function (value_1253 = "before_role", value_1254 = null, value_1255 = "", value_1256 = {}) {
  const value_1257 = window.normalizeWorldBookEntry ? window.normalizeWorldBookEntry : function (message_1265 = {}) {
      return {
        title: message_1265.title || message_1265.name || message_1265.keyword || "未命名词条",
        keyword: message_1265.keyword || "",
        content: message_1265.content || "",
        triggerMode: message_1265.triggerMode === "keyword" ? "keyword" : "permanent",
        injectionPosition: ["before_role", "after_role", "system_depth"].includes(message_1265.injectionPosition) ? message_1265.injectionPosition : "before_role",
        systemDepth: Number.isFinite(Number(message_1265.systemDepth)) ? Number(message_1265.systemDepth) : 4,
        order: Number.isFinite(Number(message_1265.order)) ? Number(message_1265.order) : 100,
        enabled: message_1265.enabled !== false
      };
    },
    value_1258 = window.worldBookKeywordMatched ? window.worldBookKeywordMatched : function (value_1266, value_1267 = "") {
      if (!value_1266 || value_1266.triggerMode !== "keyword") return true;
      const value_1268 = value_1266.keyword ? String(value_1266.keyword).trim() : "";
      if (!value_1268) return false;
      return String(value_1267 || "").includes(value_1268);
    },
    value_1259 = window.formatWorldBookEntryForPrompt ? window.formatWorldBookEntryForPrompt : function (message_1269) {
      const value_1270 = message_1269.title ? String(message_1269.title).trim() : "未命名词条",
        value_1271 = message_1269.keyword ? String(message_1269.keyword).trim() : "",
        value_1272 = message_1269.content ? String(message_1269.content).trim() : "",
        value_1273 = message_1269.triggerMode === "keyword" ? "关键词" : "永久";
      let text_1274 = "角色前";
      if (message_1269.injectionPosition === "after_role") text_1274 = "角色后";
      if (message_1269.injectionPosition === "system_depth") text_1274 = "系统深度";
      let value_1275 = "【" + value_1270 + "】\n";
      return value_1275 += "触发机制: " + value_1273 + "\n", value_1275 += "注入位置: " + text_1274 + "\n", message_1269.injectionPosition === "system_depth" && (value_1275 += "深度: " + message_1269.systemDepth + "\n", value_1275 += "顺序: " + message_1269.order + "\n"), message_1269.triggerMode === "keyword" && value_1271 && (value_1275 += "关键词: " + value_1271 + "\n"), value_1272 && (value_1275 += "内容:\n" + value_1272 + "\n"), value_1275.trim();
    },
    options_1260 = {
      before_role: "Bound World Book / 绑定角色前",
      after_role: "Bound World Book / 绑定角色后",
      system_depth: "Bound World Book / 绑定系统深度"
    },
    items_1261 = [],
    value_1262 = value_1256.includeGlobal === false ? "" : window.getGlobalWorldBookContextByPosition?.(value_1253, value_1255, value_1256) || "";
  value_1262 && items_1261.push(value_1262.trim());
  const value_1263 = value_1254 ? window.imApp.normalizeFriendData(value_1254) : null,
    value_1264 = value_1263 && Array.isArray(value_1263.boundBooks) ? value_1263.boundBooks.map(value_1276 => String(value_1276)) : [];
  if (value_1264.length > 0 && window.getWorldBooks) {
    const presentedEntries_2 = window.getWorldBooks(),
      items_1278 = [];
    Array.isArray(presentedEntries_2) && presentedEntries_2.filter(value_1279 => value_1279 && value_1264.includes(String(value_1279.id)) && Array.isArray(value_1279.entries)).forEach(value_1280 => {
      value_1280.entries.map(value_1281 => value_1257(value_1281)).filter(value_1282 => value_1282 && value_1282.enabled !== false).filter(value_1283 => value_1283.injectionPosition === value_1253).filter(value_1284 => value_1258(value_1284, value_1255)).forEach(value_1285 => {
        items_1278.push({
          ...value_1285,
          __bookName: value_1280.name || "未命名世界书"
        });
      });
    });
    if (items_1278.length > 0) {
      items_1278.sort((value_1287, value_1288) => {
        if (value_1253 === "system_depth") {
          if (value_1287.systemDepth !== value_1288.systemDepth) return value_1287.systemDepth - value_1288.systemDepth;
          return value_1287.order - value_1288.order;
        }
        return value_1287.order - value_1288.order;
      });
      let value_1286 = options_1260[value_1253] + ":\n";
      items_1278.forEach(value_1289 => {
        value_1286 += "〔" + value_1289.__bookName + "〕\n" + value_1259(value_1289) + "\n\n";
      });
      items_1261.push(value_1286.trim());
    }
  }
  return items_1261.join("\n\n").trim();
};
window.getWorldBookContextForFriendByPosition = function (value_1290 = "before_role", value_1291 = null, value_1292 = "", value_1293 = {}) {
  return window.imApp.getWorldBookContextForFriendByPosition(value_1290, value_1291, value_1292, value_1293);
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
window.imApp.formatTime = function (value_1297) {
  if (!value_1297) return "";
  const date_3 = new Date(value_1297),
    now_4 = new Date(),
    value_1300 = date_3.toDateString() === now_4.toDateString(),
    yesterday = new Date(now_4);
  yesterday.setDate(now_4.getDate() - 1);
  const value_1302 = date_3.toDateString() === yesterday.toDateString(),
    hours_2 = date_3.getHours().toString().padStart(2, "0"),
    minutes_2 = date_3.getMinutes().toString().padStart(2, "0");
  if (value_1300) return hours_2 + ":" + minutes_2;
  if (value_1302) return "Yesterday";
  return date_3.getMonth() + 1 + "/" + date_3.getDate() + " " + hours_2 + ":" + minutes_2;
};
window.imApp.addMomentNotification = async function (type_2, user_4, momentId_6, contentOrPayload = "", thought_4 = "") {
  const payload_3 = contentOrPayload && typeof contentOrPayload === "object" ? contentOrPayload : {
      content: contentOrPayload,
      thought: thought_4
    },
    notif = {
      id: Date.now(),
      type: type_2,
      userId: user_4.id || user_4.userId,
      userName: user_4.nickname || user_4.name,
      userAvatar: user_4.avatarUrl || user_4.avatar,
      momentId: momentId_6,
      momentImg: null,
      momentText: null,
      content: String(payload_3.content || "").trim(),
      contentTranslation: String(payload_3.contentTranslation || payload_3.translation || "").trim(),
      thought: String(payload_3.thought || "").trim(),
      thoughtTranslation: String(payload_3.thoughtTranslation || "").trim(),
      language: window.imDataUtils?.normalizeChatLanguage ? window.imDataUtils.normalizeChatLanguage(payload_3.language || user_4.language || "zh") : String(payload_3.language || user_4.language || "zh"),
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
      }))["catch"](value_1340 => console.warn("Failed to migrate legacy iMessage status templates", value_1340));
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
  } catch (value_1348) {
    console.error("Failed to lazy load stickers", value_1348);
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
    const value_1349 = window.imStorage?.loadStickerMetadata ? await window.imStorage.loadStickerMetadata() : [];
    window.imData.stickerMetadata = Array.isArray(value_1349) ? value_1349 : [];
    window.imData.stickerMetadataLoaded = true;
  } catch (value_1350) {
    console.error("Failed to load sticker metadata", value_1350);
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
  async function compressImageFile_2(value_1390, options_34 = {}) {
    if (!value_1390) return null;
    const {
        maxWidth = 1080,
        maxHeight = 1080,
        mimeType = "image/jpeg",
        quality = 0.82
      } = options_34,
      value_1392 = await readFileAsDataUrl_2(value_1390);
    if (!value_1392) return null;
    const img_4 = await loadImageFromDataUrl(value_1392),
      naturalWidth_2 = img_4.naturalWidth || img_4.width || 0,
      naturalHeight_2 = img_4.naturalHeight || img_4.height || 0;
    if (!naturalWidth_2 || !naturalHeight_2) return value_1392;
    const scale = Math.min(1, maxWidth / naturalWidth_2, maxHeight / naturalHeight_2),
      width_2 = Math.max(1, Math.round(naturalWidth_2 * scale)),
      height_2 = Math.max(1, Math.round(naturalHeight_2 * scale)),
      element_1399 = document.createElement("canvas");
    element_1399.width = width_2;
    element_1399.height = height_2;
    const ctx = element_1399.getContext("2d");
    if (!ctx) return value_1392;
    return ctx.drawImage(img_4, 0, 0, width_2, height_2), canvasToDataUrl(element_1399, mimeType, quality);
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
      imgElement_1406 = modalReferenceFacePreview?.querySelector("img"),
      iElement_1407 = modalReferenceFacePreview?.querySelector("i");
    if (modalReferenceFaceGroup) modalReferenceFaceGroup.style.display = referenceFace_2 ? "flex" : "none";
    if (modalReferenceFaceTitle) modalReferenceFaceTitle.textContent = referenceFace_2?.title || "角色参考脸";
    if (modalReferenceFaceStatus) modalReferenceFaceStatus.textContent = src_3 ? referenceFace_2?.fileName || "已上传" : "尚未上传";
    if (modalReferenceFaceUploadBtn) modalReferenceFaceUploadBtn.textContent = src_3 ? "更换" : "上传";
    if (modalReferenceFaceDeleteBtn) modalReferenceFaceDeleteBtn.style.display = src_3 ? "" : "none";
    imgElement_1406 && iElement_1407 && (src_3 ? (imgElement_1406.src = src_3, imgElement_1406.style.display = "block", iElement_1407.style.display = "none") : (imgElement_1406.removeAttribute("src"), imgElement_1406.style.display = "none", iElement_1407.style.display = ""));
    if (modalToggleGroup) modalToggleGroup.style.display = src_3 ? "flex" : "none";
    if (modalToggleLabel) modalToggleLabel.textContent = "本次使用参考脸";
    modalToggleInput && (modalToggleInput.checked = src_3 && enableAfterUpload, modalToggleInput.disabled = !src_3);
    handleAction_1362();
  }
  function handleAction_1362() {
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
        value_1411 = options_35.secondaryTextarea && typeof options_35.secondaryTextarea === "object" ? options_35.secondaryTextarea : null;
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
      modalSecondaryTextareaGroupElement && (modalSecondaryTextareaGroupElement.style.display = value_1411 ? "block" : "none");
      modalSecondaryTextareaLabelElement && (modalSecondaryTextareaLabelElement.textContent = value_1411?.label || "翻译");
      modalSecondaryTextareaElement && (modalSecondaryTextareaElement.value = value_1411?.defaultValue || "", modalSecondaryTextareaElement.placeholder = value_1411?.placeholder || "");
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
        handleAction_1362();
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
  function closeCustomModal_2(value_1418 = true) {
    if (!customModalOverlay) return;
    customModalOverlay.classList.remove("active");
    setTimeout(() => {
      customModalOverlay.style.display = "none";
    }, 300);
    value_1418 && typeof currentModalCancelCallback === "function" && currentModalCancelCallback(getCurrentModalPromptState());
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
  modalReferenceFaceInput?.addEventListener("change", async event_1421 => {
    const value_1422 = event_1421.target.files?.[0];
    event_1421.target.value = "";
    if (!value_1422 || typeof currentModalReferenceFace?.onUpload !== "function") return;
    try {
      modalReferenceFaceUploadBtn.disabled = true;
      const result_2 = await currentModalReferenceFace.onUpload(value_1422);
      result_2?.imageUrl && renderModalReferenceFace({
        ...currentModalReferenceFace,
        ...result_2
      }, true);
    } catch (value_1424) {
      window.showToast?.(value_1424?.message || "参考脸上传失败");
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
      const value_34 = String((await currentModalImageComposer.onRecognize(currentModalImageComposer.imageUrl)) || "").trim();
      if (!value_34) throw new Error("识图接口没有返回图片内容");
      if (modalTextareaGroup?.style.display === "block" && modalTextarea) modalTextarea.value = value_34;else {
        if (modalInput) modalInput.value = value_34;
      }
      window.showToast?.("已生成图片内容");
    } catch (value_1431) {
      window.showToast?.(value_1431?.message || "图片识别失败");
    } finally {
      modalImageComposerRecognizeBtn.disabled = false;
      modalImageComposerRecognizeBtn.textContent = "识图生成图片内容";
    }
  });
  modalGenerationPresetSelect?.addEventListener("change", async () => {
    const generationPrompt_2 = currentModalGenerationPrompt;
    if (!generationPrompt_2) return;
    const presetId_4 = String(modalGenerationPresetSelect.value || "").trim(),
      preset_6 = (Array.isArray(generationPrompt_2.presets) ? generationPrompt_2.presets : []).find(item_24 => String(item_24?.id || "") === presetId_4);
    if (preset_6) {
      if (modalTextarea) modalTextarea.value = preset_6.basePrompt || preset_6.prompt || "";
      if (modalGenerationCharAppearance) modalGenerationCharAppearance.value = preset_6.charAppearance || "";
      if (modalGenerationUserAppearance) modalGenerationUserAppearance.value = preset_6.userAppearance || "";
      if (modalGenerationArtistPrompt) modalGenerationArtistPrompt.value = preset_6.artistPrompt || "";
      if (modalGenerationNegativePrompt) modalGenerationNegativePrompt.value = preset_6.negativePrompt || "";
    }
    if (typeof generationPrompt_2.onPresetSelect === "function") try {
      await generationPrompt_2.onPresetSelect(presetId_4, preset_6 || null);
    } catch (value_1436) {
      window.showToast?.(value_1436?.message || "提示词预设切换失败");
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
      existing_4 = (Array.isArray(generationPrompt_3.presets) ? generationPrompt_3.presets : []).find(item_25 => String(item_25?.name || "").trim() === name_6),
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
      presets_3 = (Array.isArray(generationPrompt_3.presets) ? generationPrompt_3.presets : []).filter(item_26 => String(item_26?.id || "") !== String(preset_7.id));
    presets_3.push(preset_7);
    generationPrompt_3.presets = presets_3.slice(-30);
    generationPrompt_3.activePresetId = preset_7.id;
    if (modalGenerationPresetSelect) {
      const option_4 = Array.from(modalGenerationPresetSelect.options).find(item_27 => item_27.value === preset_7.id);
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
    } catch (value_1450) {
      window.showToast?.(value_1450?.message || "提示词预设保存失败");
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
  function handleAction_1367() {
    const stickersViewEl = document.getElementById("stickers-view"),
      appEl = document.getElementById("app");
    return stickersViewEl && appEl && stickersViewEl.parentNode !== appEl && appEl.appendChild(stickersViewEl), stickersViewEl;
  }
  const imServiceItems = document.querySelectorAll(".line-service-item");
  imServiceItems.forEach(value_1453 => {
    value_1453.addEventListener("click", async () => {
      if (value_1453.dataset.imessageService === "stickers") {
        try {
          window.imApp?.ensureStickersReady && (await window.imApp.ensureStickersReady());
        } catch (value_1455) {
          console.error("Failed to lazy load stickers", value_1455);
          if (window.showToast) window.showToast("表情数据加载失败");
        }
        const handleAction_1367_1454 = handleAction_1367();
        handleAction_1367_1454 && window.openView ? (handleAction_1367_1454.style.display = "flex", window.openView(handleAction_1367_1454), typeof renderStickersView_2 === "function" && renderStickersView_2()) : console.error("Stickers view or openView not found");
      } else {}
    });
  });
  const stickersView = handleAction_1367(),
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
      const bottomSheetElement_1456 = addStickerSheet.querySelector(".bottom-sheet");
      if (bottomSheetElement_1456) bottomSheetElement_1456.style.transform = "translateY(0)";
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
  }), stickerLocalUploadInput.addEventListener("change", event_1458 => {
    const files_2 = event_1458.target.files;
    if (!files_2 || files_2.length === 0) return;
    pendingLocalStickers = [];
    stickerLocalPreview && (stickerLocalPreview.innerHTML = "", stickerLocalPreview.classList.add("has-items"));
    Array.from(files_2).forEach(async (file_3, value_1461) => {
      try {
        const value_1462 = window.imApp.compressImageFile ? await window.imApp.compressImageFile(file_3, {
            maxWidth: 256,
            maxHeight: 256,
            mimeType: "image/jpeg",
            quality: 0.8
          }) : await window.imApp.readFileAsDataUrl(file_3),
          name_7 = file_3.name.replace(/\.[^/.]+$/, "") || "sticker_" + (value_1461 + 1),
          stickerObj = {
            name: name_7,
            url: value_1462
          };
        pendingLocalStickers.push(stickerObj);
        if (stickerLocalPreview) {
          const previewContainer = document.createElement("div");
          previewContainer.className = "sticker-preview-item";
          const previewImg = document.createElement("img");
          previewImg.src = value_1462;
          previewImg.className = "sticker-preview-img";
          const nameInput = document.createElement("input");
          nameInput.type = "text";
          nameInput.value = name_7;
          nameInput.className = "sticker-name-input";
          nameInput.placeholder = "名称";
          nameInput.addEventListener("input", () => {
            const idx = pendingLocalStickers.findIndex(s => s.url === value_1462);
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
      const join_1478 = parsed_2.items.map(value_1479 => value_1479.name + " " + value_1479.url).join("\n");
      if (stickerUrlInput) {
        const existing_5 = stickerUrlInput.value.trim();
        stickerUrlInput.value = existing_5 ? existing_5 + "\n" + join_1478 : join_1478;
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
      items_1484 = parsedManifest.items;
    if (parsedManifest.invalidLines.length > 0) {
      if (showToast_2) showToast_2("第 " + parsedManifest.invalidLines.join("、") + " 行格式无效，请修改后重试");
      return;
    }
    const items_2 = [...pendingLocalStickers, ...items_1484];
    if (items_2.length === 0) {
      if (showToast_2) showToast_2("请添加至少一张表情");
      return;
    }
    const saved_22 = window.imApp.commitStickersChange ? await window.imApp.commitStickersChange(() => {
      if (!window.imData.stickers) window.imData.stickers = [];
      let result_1487 = window.imData.stickers.find(value_1488 => value_1488.categoryName === categoryName_15);
      result_1487 ? result_1487.items = Array.isArray(result_1487.items) ? result_1487.items.concat(items_2) : [...items_2] : window.imData.stickers.push({
        categoryName: categoryName_15,
        items: items_2
      });
    }, {
      silent: true
    }) : window.imApp.saveStickers ? await (async () => {
      if (!window.imData.stickers) window.imData.stickers = [];
      let result_1489 = window.imData.stickers.find(value_1490 => value_1490.categoryName === categoryName_15);
      return result_1489 ? result_1489.items = Array.isArray(result_1489.items) ? result_1489.items.concat(items_2) : [...items_2] : window.imData.stickers.push({
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
    return (Array.isArray(window.imData.friends) ? window.imData.friends : []).filter(value_1491 => value_1491 && value_1491.id != null && value_1491.type !== "group" && value_1491.type !== "official");
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
        item_28 = document.createElement("label");
      item_28.style.cssText = "display:flex; align-items:center; gap:12px; padding:10px; border-radius:16px; cursor:pointer;";
      item_28.innerHTML = "\n                <input type=\"checkbox\" data-friend-id=\"" + char_4.id + "\" " + (selected_3 ? "checked" : "") + " style=\"width:18px; height:18px; accent-color:#111;\">\n                <div style=\"width:34px; height:34px; border-radius:50%; overflow:hidden; background:#f2f2f7; color:#8e8e93; display:flex; align-items:center; justify-content:center; flex-shrink:0;\">\n                    " + (char_4.avatarUrl ? "<img src=\"" + char_4.avatarUrl + "\" style=\"width:100%; height:100%; object-fit:cover;\">" : "<span>" + String(char_4.nickname || char_4.realName || "?").charAt(0) + "</span>") + "\n                </div>\n                <div style=\"min-width:0; flex:1; font-size:14px; color:#111; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;\">" + (char_4.nickname || char_4.realName || "Char") + "</div>\n            ";
      list.appendChild(item_28);
    });
    saveBtn.onclick = async () => {
      const checkedIds = new Set(Array.from(list.querySelectorAll("input[type=\"checkbox\"]:checked")).map(input => String(input.dataset.friendId))),
        map_1502 = chars.map(char_5 => String(char_5.id)),
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
          friendIds: map_1502,
          metaOnly: true
        }) : false;
      if (!saved_23) {
        if (showToast_2) showToast_2("Bind failed");
        return;
      }
      const activeFriend = window.imData.currentActiveFriend;
      if (activeFriend && map_1502.includes(String(activeFriend.id))) {
        const latestActive = (window.imData.friends || []).find(friend_28 => String(friend_28.id) === String(activeFriend.id));
        if (latestActive) window.imData.currentActiveFriend = latestActive;
      }
      const settingsFriend = window.imData.currentSettingsFriend;
      if (settingsFriend && map_1502.includes(String(settingsFriend.id))) {
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
  function handleAction_1370(keepBatchMode) {
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
        const sort_1521 = Array.from(selectedStickers).sort((value_1524, value_1525) => {
            const [aCat, map_1527] = value_1524.split("-").map(Number),
              [bCat, map_1529] = value_1525.split("-").map(Number);
            if (aCat !== bCat) return bCat - aCat;
            return map_1529 - map_1527;
          }),
          length_1522 = sort_1521.length,
          value_1523 = window.imApp.commitStickersChange ? await window.imApp.commitStickersChange(() => {
            sort_1521.forEach(value_1530 => {
              const [map_1531, map_1532] = value_1530.split("-").map(Number);
              window.imData.stickers[map_1531]?.items?.[map_1532] && window.imData.stickers[map_1531].items.splice(map_1532, 1);
            });
            window.imData.stickers = (window.imData.stickers || []).filter(value_1533 => Array.isArray(value_1533.items) && value_1533.items.length > 0);
          }, {
            silent: true
          }) : window.imApp.saveStickers ? await (async () => {
            return sort_1521.forEach(value_1534 => {
              const [map_1535, map_1536] = value_1534.split("-").map(Number);
              window.imData.stickers[map_1535]?.items?.[map_1536] && window.imData.stickers[map_1535].items.splice(map_1536, 1);
            }), window.imData.stickers = (window.imData.stickers || []).filter(value_1537 => Array.isArray(value_1537.items) && value_1537.items.length > 0), window.imApp.saveStickers({
              silent: true
            });
          })() : false;
        if (!value_1523) {
          if (showToast_2) showToast_2("表情删除失败");
          return;
        }
        batchDeleteMode = false;
        selectedStickers.clear();
        if (stickersEditBtn) stickersEditBtn.innerHTML = "<i class=\"fas fa-pen\"></i>";
        renderStickersView_2();
        if (showToast_2) showToast_2("已删除 " + length_1522 + " 张表情");
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
      deleteBtn.addEventListener("click", async event_1546 => {
        event_1546.stopPropagation();
        if (confirm("删除分类 \"" + category.categoryName + "\" ?")) {
          const value_1547 = window.imApp.commitStickersChange ? await window.imApp.commitStickersChange(() => {
            window.imData.stickers.splice(catIndex, 1);
          }, {
            silent: true
          }) : window.imApp.saveStickers ? await (async () => {
            return window.imData.stickers.splice(catIndex, 1), window.imApp.saveStickers({
              silent: true
            });
          })() : false;
          if (!value_1547) {
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
      category.items.forEach((value_1549, value_1550) => {
        const item_29 = document.createElement("div");
        item_29.className = "sticker-item";
        item_29.style.position = "relative";
        const element_1552 = document.createElement("img");
        element_1552.src = value_1549.url;
        element_1552.alt = value_1549.name;
        element_1552.title = value_1549.name;
        if (batchDeleteMode) {
          const checkbox = document.createElement("div");
          checkbox.className = "sticker-select-checkbox";
          checkbox.dataset.key = catIndex + "-" + value_1550;
          const has_1554 = selectedStickers.has(catIndex + "-" + value_1550);
          checkbox.style.cssText = "position: absolute; top: 4px; left: 4px; width: 22px; height: 22px; border-radius: 50%; background: " + (has_1554 ? "#007aff" : "rgba(255,255,255,0.9)") + "; border: 2px solid " + (has_1554 ? "#007aff" : "#ccc") + "; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #fff; cursor: pointer; z-index: 5; ";
          has_1554 && (checkbox.innerHTML = "<i class=\"fas fa-check\"></i>", item_29.style.outline = "2px solid #007aff", item_29.style.borderRadius = "8px");
          const toggleSelect = event_1556 => {
            if (event_1556) event_1556.stopPropagation();
            const value_1557 = catIndex + "-" + value_1550;
            selectedStickers.has(value_1557) ? (selectedStickers["delete"](value_1557), checkbox.innerHTML = "", checkbox.style.borderColor = "#ccc", checkbox.style.background = "rgba(255,255,255,0.9)", item_29.style.outline = "none") : (selectedStickers.add(value_1557), checkbox.innerHTML = "<i class=\"fas fa-check\"></i>", checkbox.style.borderColor = "#007aff", checkbox.style.background = "#007aff", item_29.style.outline = "2px solid #007aff");
            const batchSelectInfoElement = document.getElementById("batch-select-info");
            if (batchSelectInfoElement) batchSelectInfoElement.textContent = "已选择 " + selectedStickers.size + " 项";
          };
          checkbox.addEventListener("click", toggleSelect);
          item_29.addEventListener("click", () => toggleSelect());
          item_29.appendChild(checkbox);
        }
        item_29.appendChild(element_1552);
        if (!batchDeleteMode) {
          let pressTimer;
          item_29.addEventListener("touchstart", () => {
            pressTimer = setTimeout(() => {
              batchDeleteMode = true;
              selectedStickers.add(catIndex + "-" + value_1550);
              if (stickersEditBtn) stickersEditBtn.innerHTML = "<i class=\"fas fa-check\"></i>";
              renderStickersView_2(true);
            }, 800);
          });
          item_29.addEventListener("touchend", () => clearTimeout(pressTimer));
          item_29.addEventListener("touchmove", () => clearTimeout(pressTimer));
          item_29.addEventListener("contextmenu", event_1559 => {
            event_1559.preventDefault();
            batchDeleteMode = true;
            selectedStickers.add(catIndex + "-" + value_1550);
            if (stickersEditBtn) stickersEditBtn.innerHTML = "<i class=\"fas fa-check\"></i>";
            renderStickersView_2(true);
          });
        }
        grid.appendChild(item_29);
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
    const items_1562 = Array.isArray(category_3.items) ? category_3.items : [];
    if (stickerDetailTitle) stickerDetailTitle.textContent = category_3.categoryName || "表情包";
    if (stickerDetailCount) stickerDetailCount.textContent = items_1562.length + " 张 · 已绑定 " + getStickerBoundFriends(category_3.categoryName).length + " 位角色";
    if (stickerDetailBatchBar) stickerDetailBatchBar.hidden = !batchDeleteMode;
    const batchSelectInfoElement_1563 = document.getElementById("batch-select-info");
    if (batchSelectInfoElement_1563) batchSelectInfoElement_1563.textContent = "已选择 " + selectedStickers.size + " 项";
    if (stickersEditBtn) stickersEditBtn.innerHTML = batchDeleteMode ? "<i class=\"fas fa-check\"></i>" : "<i class=\"fas fa-pen\"></i>";
    stickerDetailGrid.innerHTML = "";
    items_1562.forEach((value_1564, stickerIndex) => {
      if (!value_1564?.url) return;
      const item_30 = document.createElement("button");
      item_30.type = "button";
      item_30.className = "sticker-item sticker-detail-item";
      item_30.title = value_1564.name || "Sticker " + (stickerIndex + 1);
      const element_1567 = document.createElement("img");
      element_1567.src = value_1564.url;
      element_1567.alt = value_1564.name || "";
      item_30.appendChild(element_1567);
      if (batchDeleteMode) {
        const selected_4 = selectedStickers.has(String(stickerIndex));
        item_30.classList.toggle("selected", selected_4);
        const checkbox_2 = document.createElement("span");
        checkbox_2.className = "sticker-select-checkbox";
        checkbox_2.innerHTML = selected_4 ? "<i class=\"fas fa-check\"></i>" : "";
        item_30.appendChild(checkbox_2);
        item_30.addEventListener("click", () => {
          const string_1570 = String(stickerIndex);
          if (selectedStickers.has(string_1570)) selectedStickers["delete"](string_1570);else selectedStickers.add(string_1570);
          renderStickerDetail();
        });
      }
      stickerDetailGrid.appendChild(item_30);
    });
    stickerDetailBindBtn && (stickerDetailBindBtn.onclick = () => openStickerBindingDialog(category_3.categoryName));
    stickerDetailDeleteCategoryBtn && (stickerDetailDeleteCategoryBtn.onclick = async () => {
      if (!confirm("删除分类 \"" + category_3.categoryName + "\" ?")) return;
      const saved_24 = await window.imApp.commitStickersChange(() => {
        window.imData.stickers = (window.imData.stickers || []).filter(item_31 => item_31 !== category_3);
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
  function renderStickersView_2(value_1574) {
    if (!stickersListContainer) return;
    !value_1574 && (batchDeleteMode = false, selectedStickers.clear());
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
      const element_1581 = document.createElement("span");
      element_1581.textContent = items_3.length + " 张 · " + getStickerBoundFriends(category_4.categoryName).length + " 位角色";
      copy.appendChild(title_7);
      copy.appendChild(element_1581);
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
        window.imData.stickers = (window.imData.stickers || []).filter(item_32 => Array.isArray(item_32.items) && item_32.items.length > 0);
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
    lineNavIndicator = document.getElementById("line-nav-indicator"),
    imBottomNavContainer = document.querySelector(".line-bottom-nav-container"),
    imContent = document.querySelector(".line-content"),
    chatsContent = document.getElementById("chats-content"),
    memoryLocationSheet = document.getElementById("memory-location-sheet"),
    memoryLocationSheetContent = document.getElementById("memory-location-sheet-content"),
    memorySocialCloseElement = document.getElementById("memory-social-close");
  let value_1372 = null;
  const value_1373 = () => {
    if (!memoryLocationSheet?.classList.contains("memory-social-centered")) return;
    if (window.closeView) window.closeView(memoryLocationSheet);
    if (value_1372?.isConnected) value_1372.focus({
      preventScroll: true
    });
    value_1372 = null;
  };
  memorySocialCloseElement?.addEventListener("click", value_1373);
  memoryLocationSheet?.addEventListener("click", event_1590 => {
    if (event_1590.target === memoryLocationSheet) value_1373();
  });
  document.addEventListener("keydown", value_1591 => {
    if (value_1591.key === "Escape" && memoryLocationSheet?.classList.contains("active")) value_1373();
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
    const items_1595 = Array.isArray(window.imData?.friends) ? window.imData.friends : [];
    return items_1595.filter(value_1596 => value_1596 && value_1596.type !== "group" && value_1596.type !== "npc" && value_1596.type !== "official");
  }
  function escapeMemoryHtml(value_35) {
    return String(value_35 == null ? "" : value_35).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function setMemoryFriendSelection(friend_30) {
    if (!friend_30) return;
    currentMemoryFriendId = friend_30.id;
  }
  function renderMemoryView_2() {
    memoryLocationSheetContent && memoryLocationSheetContent.innerHTML !== "" && renderMemoryLocationSheet(currentMemoryLocation || "iphone");
  }
  function renderScheduleModal() {
    const toMinutes = value_37 => {
        const match_2 = /^(\d{2}):(\d{2})$/.exec(String(value_37 || "").trim());
        if (!match_2) return -1;
        const hours_3 = Number(match_2[1]),
          minutes_3 = Number(match_2[2]);
        return hours_3 >= 0 && hours_3 < 24 && minutes_3 >= 0 && minutes_3 < 60 ? hours_3 * 60 + minutes_3 : -1;
      },
      toLocalInputValue = (value_40, fallback_4 = "") => {
        const normalized = String(value_40 || "").trim();
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(normalized)) return normalized;
        return fallback_4;
      },
      value_1601 = () => {
        const value_1613 = new Date();
        value_1613.setMinutes(value_1613.getMinutes() - value_1613.getTimezoneOffset());
        const value_1614 = new Date(Date.now() + 3600000);
        return value_1614.setMinutes(value_1614.getMinutes() - value_1614.getTimezoneOffset()), {
          start: value_1613.toISOString().slice(0, 16),
          end: value_1614.toISOString().slice(0, 16)
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
          defaults_2 = value_1601();
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
      const value_1623 = eventNameInput ? eventNameInput.value.trim() : "",
        recurrence_4 = recurrenceInput?.value === "once" ? "once" : "daily",
        existingEvent = Array.isArray(schedule_3.events) ? schedule_3.events.find(item_33 => String(item_33.id) === String(scheduleEditorEventId)) : null;
      if (!value_1623) {
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
          name: value_1623,
          title: value_1623,
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
          name: value_1623,
          title: value_1623,
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
      await window.imApp.commitScopedFriendChange(friend_31, targetFriend_14 => {
        targetFriend_14.memory = targetFriend_14.memory || window.imApp.createDefaultMemory();
        const currentSchedule_2 = targetFriend_14.memory.schedule || window.imApp.createDefaultMemory().schedule,
          events_2 = Array.isArray(currentSchedule_2.events) ? currentSchedule_2.events.slice() : [],
          existingIndex = events_2.findIndex(item_34 => String(item_34?.id) === String(scheduleEditorEventId));
        if (existingIndex >= 0) events_2.splice(existingIndex, 1, eventData);else events_2.push(eventData);
        targetFriend_14.memory.schedule = window.imDataUtils?.normalizeSchedule ? window.imDataUtils.normalizeSchedule({
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
        await window.imApp.commitScopedFriendChange(friend_31, targetFriend_15 => {
          const currentSchedule = targetFriend_15.memory?.schedule || window.imApp.createDefaultMemory().schedule;
          targetFriend_15.memory = targetFriend_15.memory || window.imApp.createDefaultMemory();
          targetFriend_15.memory.schedule = window.imDataUtils?.normalizeSchedule ? window.imDataUtils.normalizeSchedule({
            ...currentSchedule,
            events: (currentSchedule.events || []).filter(item_35 => String(item_35?.id) !== String(eventId))
          }) : {
            ...currentSchedule,
            events: (currentSchedule.events || []).filter(item_36 => String(item_36?.id) !== String(eventId))
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
      const value_1647 = schedule_3.wakeTime || "07:00",
        value_1648 = schedule_3.sleepTime || "23:00",
        events_3 = Array.isArray(schedule_3.events) ? schedule_3.events : [];
      let innerHTML_2 = "<div style=\"position: absolute; left: 24px; top: 10px; bottom: 10px; width: 2px; background: #e5e5ea; z-index: 1;\"></div>";
      innerHTML_2 += "\n                <div style=\"position: relative; z-index: 2; display: flex; align-items: flex-start;\">\n                    <div style=\"width: 10px; height: 10px; border-radius: 50%; background: #007aff; margin-right: 15px; margin-top: 5px;  flex-shrink: 0;\"></div>\n                    <div>\n                        <div style=\"font-size: 16px; font-weight: 600; color: #111;\">起床</div>\n                        <div style=\"font-size: 13px; color: #8e8e93; margin-top: 2px;\">" + value_1647 + " - 开启新的一天</div>\n                    </div>\n                </div>\n            ";
      events_3.forEach(evt => {
        innerHTML_2 += "\n                    <div style=\"position: relative; z-index: 2; display: flex; align-items: flex-start;\">\n                        <div style=\"width: 10px; height: 10px; border-radius: 50%; background: #8e8e93; margin-right: 15px; margin-top: 15px;  flex-shrink: 0;\"></div>\n                        <div class=\"schedule-event-card\" data-event-id=\"" + evt.id + "\" style=\"background: #f2f2f7; border-radius: 16px; padding: 12px 16px; flex: 1; cursor: pointer; \">\n                            <div style=\"font-size: 15px; font-weight: 600; color: #111;\">" + escapeMemoryHtml(evt.name || evt.title || "未命名行程") + "</div>\n                            <div style=\"font-size: 13px; color: #8e8e93; margin-top: 4px;\">" + escapeMemoryHtml(evt.time || ((evt.date || "") + " " + (evt.startTime || "")).trim()) + "</div>\n                        </div>\n                    </div>\n                ";
      });
      innerHTML_2 += "\n                <div style=\"position: relative; z-index: 2; display: flex; align-items: flex-start;\">\n                    <div style=\"width: 10px; height: 10px; border-radius: 50%; background: #5856d6; margin-right: 15px; margin-top: 5px;  flex-shrink: 0;\"></div>\n                    <div>\n                        <div style=\"font-size: 16px; font-weight: 600; color: #111;\">睡觉</div>\n                        <div style=\"font-size: 13px; color: #8e8e93; margin-top: 2px;\">" + value_1648 + " - 休息时间到了</div>\n                    </div>\n                </div>\n            ";
      timeline.innerHTML = innerHTML_2;
      const eventCards = timeline.querySelectorAll(".schedule-event-card");
      eventCards.forEach(card_3 => {
        card_3.addEventListener("click", () => {
          const eventId_2 = card_3.getAttribute("data-event-id"),
            result_1653 = events_3.find(value_1654 => String(value_1654.id) === String(eventId_2));
          if (result_1653) openScheduleEditor(result_1653);
        });
      });
    }
  }
  function getCurrentMemoryFriend_2() {
    const value_1655 = Array.isArray(window.imData?.friends) ? window.imData.friends : [],
      selected_5 = value_1655.find(value_1657 => String(value_1657.id) === String(currentMemoryFriendId));
    if (selected_5) return selected_5;
    return getMemoryFriends()[0] || null;
  }
  function formatManualMemoryTime(startDate_7 = new Date()) {
    const value_1659 = value_1660 => String(value_1660).padStart(2, "0");
    return startDate_7.getFullYear() + "年" + value_1659(startDate_7.getMonth() + 1) + "月" + value_1659(startDate_7.getDate()) + "日 " + value_1659(startDate_7.getHours()) + ":" + value_1659(startDate_7.getMinutes());
  }
  function handleAction_1378(value_41) {
    if (window.imChat?.normalizeMemoryTriggerKeywords) return window.imChat.normalizeMemoryTriggerKeywords(value_41);
    return String(value_41 || "").split(/[,，、；;\n|/]+/).map(tag => tag.trim()).filter(Boolean).slice(0, 12);
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
  function normalizeMemoryRecallLimit(value_42, fallback_5 = 30) {
    const numeric_2 = Math.round(Number(value_42));
    return Number.isFinite(numeric_2) && numeric_2 > 0 ? Math.min(100, Math.max(1, numeric_2)) : fallback_5;
  }
  async function saveMemoryRecallLimit(kind_2, value_1674) {
    const friend_34 = getCurrentMemoryFriend_2();
    if (!friend_34) return false;
    const normalizedFriend_12 = window.imApp.normalizeFriendData(friend_34),
      fallback_6 = normalizedFriend_12.memory?.recallLimits?.[kind_2] || 30,
      limit_4 = normalizeMemoryRecallLimit(value_1674, fallback_6),
      saved_26 = await window.imApp.commitScopedFriendChange(friend_34, targetFriend_16 => {
        targetFriend_16.memory = window.imApp.normalizeFriendData(targetFriend_16).memory;
        targetFriend_16.memory.recallLimits = window.imApp.normalizeMemoryRecallLimits({
          ...targetFriend_16.memory.recallLimits,
          [kind_2]: limit_4
        });
        targetFriend_16.memory.recallPresentation = null;
        window.imApp.clearFriendRuntimeMessageContext?.(targetFriend_16);
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
  async function handleAction_1379() {
    const pending = pendingMemoryPromotion;
    if (!pending) return false;
    const friend_36 = window.imApp.getFriendById?.(pending.friendId) || getCurrentMemoryFriend_2(),
      title_8 = String(memoryPromotionTitleInput?.value || "").trim(),
      content_4 = String(memoryPromotionContentInput?.value || "").trim(),
      time_3 = String(memoryPromotionTimeInput?.value || "").trim(),
      triggerKeywords_3 = handleAction_1378(memoryPromotionTagsInput?.value || "");
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
  function openMemoryEntryEditor(value_45, entry_18 = null, collection_4 = "") {
    if (!memoryEntryEditorModal) return;
    const isShort = value_45 === "short",
      value_43 = collection_4 || (isShort ? "shortTermEntries" : "longTermEntries"),
      value_44 = entry_18?.time || entry_18?.createdAt || formatManualMemoryTime(),
      tags = isShort ? window.imChat?.getShortTermMemoryTags ? window.imChat.getShortTermMemoryTags(entry_18 || {}) : entry_18?.memoryTags || entry_18?.triggerKeywords || [] : entry_18?.triggerKeywords || [];
    if (memoryEntryEditorTitle) memoryEntryEditorTitle.textContent = entry_18 ? "编辑" + (isShort ? "短期" : "长期") + "记忆" : "新增" + (isShort ? "短期" : "长期") + "记忆";
    if (memoryEntryEditorKind) memoryEntryEditorKind.value = value_45;
    if (memoryEntryEditorId) memoryEntryEditorId.value = entry_18?.id == null ? "" : String(entry_18.id);
    if (memoryEntryEditorCollection) memoryEntryEditorCollection.value = value_43;
    if (memoryEntryEditorTitleInput) memoryEntryEditorTitleInput.value = entry_18?.title || "";
    if (memoryEntryEditorTimeInput) memoryEntryEditorTimeInput.value = value_44;
    if (memoryEntryEditorContentInput) memoryEntryEditorContentInput.value = isShort ? entry_18?.event || entry_18?.content || "" : entry_18?.content || "";
    if (memoryEntryEditorContentLabel) memoryEntryEditorContentLabel.textContent = isShort ? "事件内容" : "记忆内容";
    if (memoryEntryEditorTagsInput) memoryEntryEditorTagsInput.value = Array.isArray(tags) ? tags.join("，") : "";
    if (memoryEntryEditorDegreeRow) memoryEntryEditorDegreeRow.style.display = isShort ? "flex" : "none";
    if (memoryEntryEditorDegreeSelect) memoryEntryEditorDegreeSelect.value = entry_18?.degree || "高";
    if (window.openView) window.openView(memoryEntryEditorModal);
  }
  async function handleAction_1380() {
    const friend_38 = getCurrentMemoryFriend_2();
    if (!friend_38) return false;
    const kind_3 = memoryEntryEditorKind?.value === "long" ? "long" : "short",
      isShort_2 = kind_3 === "short",
      collection_5 = memoryEntryEditorCollection?.value || (isShort_2 ? "shortTermEntries" : "longTermEntries"),
      existingId = String(memoryEntryEditorId?.value || ""),
      title_9 = String(memoryEntryEditorTitleInput?.value || "").trim() || (isShort_2 ? "手动记忆" : "长期记忆"),
      time_4 = String(memoryEntryEditorTimeInput?.value || "").trim() || formatManualMemoryTime(),
      content_5 = String(memoryEntryEditorContentInput?.value || "").trim(),
      triggerKeywords_4 = handleAction_1378(memoryEntryEditorTagsInput?.value || "");
    if (!content_5) {
      if (window.showToast) window.showToast("请输入记忆内容");
      return memoryEntryEditorContentInput?.focus(), false;
    }
    const id_6 = existingId || (isShort_2 ? "manual-stm" : "manual-ltm") + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      saved_27 = await window.imApp.commitScopedFriendChange(friend_38, targetFriend_17 => {
        targetFriend_17.memory = window.imApp.normalizeFriendData(targetFriend_17).memory;
        if (!Array.isArray(targetFriend_17.memory[collection_5])) targetFriend_17.memory[collection_5] = [];
        const entries_4 = targetFriend_17.memory[collection_5],
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
        targetFriend_17.memory.recallPresentation = null;
        window.imApp.clearFriendRuntimeMessageContext?.(targetFriend_17);
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
    const value_1725 = await window.imApp.commitScopedFriendChange(friend_39, targetFriend_18 => {
      targetFriend_18.memory = window.imApp.normalizeFriendData(targetFriend_18).memory;
      const entries_5 = Array.isArray(targetFriend_18.memory[collection_6]) ? targetFriend_18.memory[collection_6] : [];
      targetFriend_18.memory[collection_6] = entries_5.filter(item_37 => String(item_37?.id) !== String(entry_20.id));
      if (collection_6 === "shortTermEntries") {
        const reduce_1729 = targetFriend_18.memory.shortTermEntries.reduce((value_1732, value_1733) => {
            const max_1734 = Math.max(0, Number(value_1733?.sourceEndMessageCount) || 0),
              max_1735 = Math.max(0, Number(value_1732?.sourceEndMessageCount) || 0);
            return max_1734 >= max_1735 ? value_1733 : value_1732;
          }, null),
          lastSummaryMessageCount_5 = Math.max(0, Number(reduce_1729?.sourceEndMessageCount) || 0),
          value_1731 = Array.isArray(reduce_1729?.sourceMessageIds) ? reduce_1729.sourceMessageIds : [];
        targetFriend_18.memory.lastSummaryMessageCount = lastSummaryMessageCount_5;
        targetFriend_18.memory.summaryCursor = {
          messageId: String(reduce_1729?.sourceEndMessageId || value_1731[value_1731.length - 1] || "").trim(),
          order: Number.isFinite(Number(reduce_1729?.sourceEndMessageOrder)) ? Number(reduce_1729.sourceEndMessageOrder) : -1,
          count: lastSummaryMessageCount_5
        };
      }
      targetFriend_18.memory.recallPresentation = null;
      window.imApp.clearFriendRuntimeMessageContext?.(targetFriend_18);
    }, {
      silent: true,
      syncActive: true,
      syncSettings: true
    });
    if (!value_1725) return false;
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
        const saved = await deleteMemoryEntry(entry_21, collection_7, options_37);
        if (window.showToast) window.showToast(saved ? "记忆已删除" : "删除失败");
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
  async function deleteShortTermMemoryEntry(entry_22, value_1742 = {}) {
    if (!entry_22) return false;
    const friend_40 = getCurrentMemoryFriend_2();
    if (!friend_40) return false;
    const value_1744 = await window.imApp.commitScopedFriendChange(friend_40, targetFriend_19 => {
      if (!targetFriend_19) return;
      targetFriend_19.memory = targetFriend_19.memory || window.imApp.createDefaultMemory();
      if (!Array.isArray(targetFriend_19.memory.shortTermEntries)) targetFriend_19.memory.shortTermEntries = [];
      const entries_6 = Array.isArray(targetFriend_19.memory.shortTermEntries) ? targetFriend_19.memory.shortTermEntries : [];
      targetFriend_19.memory.shortTermEntries = window.imDataUtils?.removeShortTermSummaryEntry ? window.imDataUtils.removeShortTermSummaryEntry(entries_6, entry_22.id) : entries_6.filter(item_38 => !item_38 || String(item_38.id) !== String(entry_22.id));
      const presentedEntries_3 = targetFriend_19.memory.recallPresentation?.recall?.shortTermEntries;
      Array.isArray(presentedEntries_3) && presentedEntries_3.some(item_39 => String(item_39?.id) === String(entry_22.id)) && (targetFriend_19.memory.recallPresentation = null);
      window.imApp.clearFriendRuntimeMessageContext && window.imApp.clearFriendRuntimeMessageContext(targetFriend_19);
    }, {
      silent: true
    });
    if (!value_1744) return false;
    return value_1742.closeDetail && window.closeView && memoryEntryDetailModal && window.closeView(memoryEntryDetailModal), renderMemoryLocationSheet("iphone"), renderMemoryView_2(), window.dispatchEvent(new CustomEvent("u2:memory-entries-updated", {
      detail: {
        friendId: String(friend_40.id),
        action: "delete",
        collection: "shortTermEntries",
        entryId: String(entry_22.id)
      }
    })), true;
  }
  function handleAction_1381(entry_23, options_38 = {}) {
    const value_1752 = async () => {
      const saved_28 = await deleteShortTermMemoryEntry(entry_23, options_38);
      if (window.showToast) window.showToast(saved_28 ? "已删除短期记忆" : "删除失败");
    };
    if (window.showCustomModal) {
      window.showCustomModal({
        title: "删除已总结记录",
        message: "确定彻底删除这条已总结记录吗？这会同时从角色记忆上下文中移除，无法恢复。",
        confirmText: "删除",
        isDestructive: true,
        onConfirm: value_1752
      });
      return;
    }
    window.confirm("确定彻底删除这条已总结记录吗？这会同时从角色记忆上下文中移除，无法恢复。") && value_1752();
  }
  function showMemoryEntryDetail(entry_24, kind_4 = "short", collection_8 = "shortTermEntries") {
    if (!entry_24 || !memoryEntryDetailModal || !memoryEntryDetailBody) return;
    if (memoryEntryDetailTitle) memoryEntryDetailTitle.textContent = entry_24.title || "记忆详情";
    const isShort_3 = kind_4 === "short",
      memoryTags_2 = isShort_3 ? window.imChat?.getShortTermMemoryTags ? window.imChat.getShortTermMemoryTags(entry_24) : Array.isArray(entry_24.memoryTags) ? entry_24.memoryTags : [] : Array.isArray(entry_24.triggerKeywords) ? entry_24.triggerKeywords : [];
    memoryEntryDetailBody.innerHTML = "\n            <div class=\"memory-entry-field\">\n                <div class=\"memory-entry-field-label\">时间</div>\n                <div class=\"memory-entry-field-value\">" + escapeMemoryHtml(entry_24.time || entry_24.createdAt || "") + "</div>\n            </div>\n            <div class=\"memory-entry-field\">\n                <div class=\"memory-entry-field-label\">" + (isShort_3 ? "事件" : "内容") + "</div>\n                <div class=\"memory-entry-field-value\">" + escapeMemoryHtml(isShort_3 ? entry_24.event || entry_24.content || "" : entry_24.content || "") + "</div>\n            </div>\n            <div class=\"memory-entry-field\">\n                <div class=\"memory-entry-field-label\">记忆标签</div>\n                <div class=\"memory-entry-field-value\" style=\"display:flex; flex-wrap:wrap; gap:6px;\">" + (memoryTags_2.length > 0 ? memoryTags_2.map(value_1759 => "<span style=\"padding:3px 8px; border-radius:999px; background:#e8f2ff; color:#007aff; font-size:12px; font-weight:600;\">" + escapeMemoryHtml(value_1759) + "</span>").join("") : "暂无标签") + "</div>\n            </div>\n            " + (isShort_3 ? "<div class=\"memory-entry-field\">\n                <div class=\"memory-entry-field-label\">记忆程度</div>\n                <div class=\"memory-entry-field-value\">" + escapeMemoryHtml(entry_24.degree || "高") + "</div>\n            </div>" : "") + "\n            <div style=\"display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:20px;\">\n                <button type=\"button\" id=\"memory-entry-detail-edit-btn\" style=\"width:100%; padding:12px; border-radius:12px; background:#e8f2ff; color:#007aff; border:none; font-size:15px; font-weight:600; cursor:pointer;\">\n                    <i class=\"fas fa-pen\"></i> 编辑\n                </button>\n                <button type=\"button\" id=\"memory-entry-detail-delete-btn\" style=\"width: 100%; padding: 12px; border-radius: 12px; background: #ffe5e5; color: #ff3b30; border: none; font-size: 15px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;\">\n                    <i class=\"fas fa-trash-alt\"></i> 删除这条记忆\n                </button>\n            </div>\n        ";
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
    const value_1761 = location_2 === "x-dm";
    memoryLocationSheet?.classList.toggle("memory-social-centered", value_1761);
    const memoryLocationBottomSheetElement = memoryLocationSheet?.querySelector(".memory-location-bottom-sheet");
    value_1761 ? (memoryLocationBottomSheetElement?.setAttribute("role", "dialog"), memoryLocationBottomSheetElement?.setAttribute("aria-modal", "true"), memoryLocationBottomSheetElement?.setAttribute("aria-label", "社交帐号")) : (memoryLocationBottomSheetElement?.removeAttribute("role"), memoryLocationBottomSheetElement?.removeAttribute("aria-modal"), memoryLocationBottomSheetElement?.removeAttribute("aria-label"));
    const friend_41 = getCurrentMemoryFriend_2(),
      normalizedFriend_13 = friend_41 ? window.imApp.normalizeFriendData(friend_41) : null;
    if (location_2 === "x-dm") {
      if (!normalizedFriend_13 || normalizedFriend_13.type !== "char") {
        memoryLocationSheetContent.innerHTML = "\n                    <div class=\"memory-sheet-title\">社交帐号</div>\n                    <div class=\"memory-short-list\">\n                        <div class=\"memory-short-empty\">仅支持 iMessage 单聊 Char 关联社交帐号。</div>\n                    </div>\n                ";
        return;
      }
      const mount_8 = window.imApp.normalizeXDirectMessageMount(normalizedFriend_13.memory?.xDirectMessageMount),
        xDirectMessageMountCandidates_1767 = window.imApp.getXDirectMessageMountCandidates(normalizedFriend_13),
        selected_6 = xDirectMessageMountCandidates_1767.find(value_1778 => value_1778.id === mount_8.dmId) || (!mount_8.dmId ? xDirectMessageMountCandidates_1767[0] : null),
        selectedIsMissing = Boolean(mount_8.dmId && !selected_6),
        value_1769 = selected_6 ? "" + selected_6.name + (selected_6.handle ? " · " + selected_6.handle : "") : "",
        savedMount = {
          ...mount_8,
          dmId: selected_6?.id || mount_8.dmId
        },
        savedMount_2 = window.imApp.normalizeBstagePopMount(normalizedFriend_13.memory?.bstagePopMount),
        mounted_2 = window.imApp.getBstagePopMountCandidates(),
        mountedBstagePopMember_1772 = window.imApp.getMountedBstagePopMember(normalizedFriend_13),
        boolean_1773 = Boolean(savedMount_2.teamId && savedMount_2.memberId && !mountedBstagePopMember_1772),
        safeCategoryName_2 = mounted_2.find(value_1779 => value_1779.sourceFriendId === String(normalizedFriend_13.id)),
        items_1775 = safeCategoryName_2 ? [safeCategoryName_2, ...mounted_2.filter(name_9 => name_9 !== safeCategoryName_2)] : mounted_2;
      memoryLocationSheetContent.innerHTML = "\n                <div class=\"memory-sheet-title\">社交帐号</div>\n                <p class=\"memory-social-intro\">关联同一 Char 的活动，仅在生成回复时参考；两边聊天记录保持独立。</p>\n                <div class=\"memory-social-list\">\n                    <section class=\"memory-social-card\">\n                        <div class=\"memory-social-row\">\n                            <span class=\"memory-social-mark memory-social-mark-x\"><i class=\"fab fa-x-twitter\"></i></span>\n                            <span class=\"memory-social-main\"><strong>X</strong><small>" + (selected_6 ? escapeMemoryHtml(value_1769) : selectedIsMissing ? "关联已失效" : "暂无对应私信") + "</small></span>\n                            <input id=\"memory-x-dm-enabled\" type=\"checkbox\" aria-label=\"开启 X 社交帐号上下文\" " + (mount_8.enabled ? "checked" : "") + " " + (selected_6 ? "" : "disabled") + ">\n                        </div>\n                        <div class=\"memory-social-detail\">参考 X 私信、User 帖子和 Char 主页帖子。</div>\n                        <label class=\"memory-social-setting\">每类参考条数 <input id=\"memory-x-dm-limit\" type=\"number\" min=\"1\" max=\"50\" step=\"1\" value=\"" + mount_8.limit + "\" aria-label=\"X 社交帐号每类上下文条数\"> <span>条/类</span></label>\n                        " + (xDirectMessageMountCandidates_1767.length === 0 ? "<div class=\"memory-social-note\">请先在 X 中从 iMessage 导入该 Char 并创建私信。</div>" : "") + "\n                    </section>\n                    <section class=\"memory-social-card\">\n                        <div class=\"memory-social-row\">\n                            <span class=\"memory-social-mark memory-social-mark-pop\">P</span>\n                            <span class=\"memory-social-main\"><strong>Bstage POP</strong><small>" + (mountedBstagePopMember_1772 ? escapeMemoryHtml(mountedBstagePopMember_1772.name + " · " + mountedBstagePopMember_1772.teamName) : boolean_1773 ? "关联已失效，请重新选择 Char" : "未关联 Char") + "</small></span>\n                            <input id=\"memory-bstage-pop-enabled\" type=\"checkbox\" aria-label=\"开启 Bstage POP 记忆互通\" " + (savedMount_2.enabled ? "checked" : "") + " " + (mountedBstagePopMember_1772 ? "" : "disabled") + ">\n                        </div>\n                        <div class=\"memory-social-detail\">仅互通 Char 自己的近期内容；不读取 POP 粉丝发言。</div>\n                        <label class=\"memory-social-select-label\" for=\"memory-bstage-pop-select\">关联 Char</label>\n                        <select id=\"memory-bstage-pop-select\" aria-label=\"选择 Bstage POP Char\">\n                            <option value=\"\">请选择 Char</option>\n                            " + items_1775.map((value_1781, value_1782) => "<option value=\"" + value_1782 + "\" " + (mountedBstagePopMember_1772 && value_1781.teamId === mountedBstagePopMember_1772.teamId && value_1781.memberId === mountedBstagePopMember_1772.memberId ? "selected" : "") + ">" + escapeMemoryHtml(value_1781.name + " · " + value_1781.teamName + (value_1781 === safeCategoryName_2 ? "（从此 Char 拉取）" : "")) + "</option>").join("") + "\n                        </select>\n                        " + (mounted_2.length === 0 ? "<div class=\"memory-social-note\">请先在 Bstage 从 iMessage 拉取该 Char，或创建 Char 成员。</div>" : "") + "\n                    </section>\n                </div>\n            ";
      const saveMount = async nextMount => {
        const saved_29 = await window.imApp.commitScopedFriendChange(friend_41, targetFriend_20 => {
          targetFriend_20.memory = window.imApp.normalizeFriendData(targetFriend_20).memory;
          targetFriend_20.memory.xDirectMessageMount = window.imApp.normalizeXDirectMessageMount(nextMount);
        }, {
          silent: true,
          syncActive: true,
          syncSettings: true
        });
        if (!saved_29) {
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
      const saveMount_2 = async nextMount_1787 => {
        const value_1788 = await window.imApp.commitScopedFriendChange(friend_41, targetFriend_1789 => {
          targetFriend_1789.memory = window.imApp.normalizeFriendData(targetFriend_1789).memory;
          targetFriend_1789.memory.bstagePopMount = window.imApp.normalizeBstagePopMount(nextMount_1787);
        }, {
          silent: true,
          syncActive: true,
          syncSettings: true
        });
        if (!value_1788) {
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
      memoryLocationSheetContent.querySelector("#memory-bstage-pop-select")?.addEventListener("change", event_1790 => {
        const value_1791 = event_1790.target.value === "" ? null : items_1775[Number(event_1790.target.value)];
        saveMount_2(value_1791 ? {
          enabled: true,
          teamId: value_1791.teamId,
          memberId: value_1791.memberId
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
        items_1795 = [...longTermEntries_2, ...cherishedEntries_2];
      memoryLocationSheetContent.innerHTML = "\n                <div class=\"memory-sheet-title-row\">\n                    <div class=\"memory-sheet-title\">长期记忆</div>\n                    <button type=\"button\" class=\"memory-sheet-add-btn\" data-memory-add-kind=\"long\" aria-label=\"新增长期记忆\"><i class=\"fas fa-plus\"></i></button>\n                </div>\n                <div class=\"memory-recall-limit-row\">\n                    <span>读取条数 <small>长期记忆与珍视回忆共用</small></span>\n                    <input type=\"number\" min=\"1\" max=\"100\" step=\"1\" value=\"" + escapeMemoryHtml(normalizedFriend_13.memory?.recallLimits?.longTerm || 30) + "\" data-memory-recall-limit=\"longTerm\" aria-label=\"长期记忆读取条数\">\n                </div>\n                <div class=\"memory-short-list\">\n                    " + (items_1795.length === 0 ? "<div class=\"memory-short-empty\">暂无长期记忆</div>" : items_1795.slice().reverse().map(({
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
    selectAllButton?.addEventListener("click", event_1811 => {
      event_1811.preventDefault();
      const checked_2 = selectedIds_5.size !== entries_7.length;
      memoryLocationSheetContent.querySelectorAll(".memory-short-select").forEach(input_2 => {
        input_2.checked = checked_2;
        const string_1814 = String(input_2.getAttribute("data-memory-select-id") || "");
        if (checked_2) selectedIds_5.add(string_1814);else selectedIds_5["delete"](string_1814);
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
        const attribute_1816 = btn_2.getAttribute("data-memory-entry-id"),
          result_1817 = entries_7.find(value_1818 => String(value_1818.id) === String(attribute_1816));
        if (result_1817) showMemoryEntryDetail(result_1817);
      };
      btn_2.addEventListener("click", event_14 => {
        const targetEl = event_14.target instanceof Element ? event_14.target : null;
        if (targetEl?.closest(".memory-short-delete-btn")) return;
        if (targetEl?.closest(".memory-short-select")) return;
        openEntry();
      });
      btn_2.addEventListener("keydown", event_1820 => {
        const value_1821 = event_1820.target instanceof Element ? event_1820.target : null;
        if (value_1821?.closest(".memory-short-delete-btn")) return;
        if (value_1821?.closest(".memory-short-select")) return;
        (event_1820.key === "Enter" || event_1820.key === " ") && (event_1820.preventDefault(), openEntry());
      });
      const deleteBtn_3 = btn_2.querySelector(".memory-short-delete-btn");
      deleteBtn_3 && deleteBtn_3.addEventListener("click", event_1822 => {
        event_1822.preventDefault();
        event_1822.stopPropagation();
        const attribute_1823 = btn_2.getAttribute("data-memory-entry-id"),
          target_4 = entries_7.find(value_1825 => String(value_1825.id) === String(attribute_1823));
        if (target_4) confirmDeleteMemoryEntry(target_4, "shortTermEntries");
      });
      const selectInput = btn_2.querySelector(".memory-short-select");
      selectInput?.addEventListener("change", () => {
        const string_1826 = String(selectInput.getAttribute("data-memory-select-id") || "");
        if (selectInput.checked) selectedIds_5.add(string_1826);else selectedIds_5["delete"](string_1826);
        refreshPromotionSelection();
      });
    });
  }
  window.imApp.openMemoryLocationForFriend = function (value_1827, value_1828) {
    const value_1829 = window.imApp.getFriendById ? window.imApp.getFriendById(value_1827) : (window.imData.friends || []).find(value_1830 => String(value_1830.id) === String(value_1827?.id ?? value_1827));
    if (!value_1829) return false;
    setMemoryFriendSelection(value_1829);
    renderMemoryLocationSheet(value_1828);
    if (memoryLocationSheet && window.openView) {
      if (value_1828 === "x-dm") value_1372 = document.activeElement;
      window.openView(memoryLocationSheet);
      if (value_1828 === "x-dm") memorySocialCloseElement?.focus({
        preventScroll: true
      });
      return true;
    }
    return false;
  };
  window.imApp.openMemoryScheduleForFriend = function (value_1831) {
    const value_1832 = window.imApp.getFriendById ? window.imApp.getFriendById(value_1831) : (window.imData.friends || []).find(value_1833 => String(value_1833.id) === String(value_1831?.id ?? value_1831));
    if (!value_1832) return false;
    setMemoryFriendSelection(value_1832);
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
  [memoryEntryEditorClose, memoryEntryEditorCancel].forEach(value_1834 => {
    value_1834?.addEventListener("click", closeMemoryEntryEditor);
  });
  memoryEntryEditorSave?.addEventListener("click", () => void handleAction_1380());
  memoryEntryEditorModal?.addEventListener("click", event_1835 => {
    if (event_1835.target === memoryEntryEditorModal) closeMemoryEntryEditor();
  });
  [memoryPromotionPreviewClose, memoryPromotionPreviewCancel].forEach(value_1836 => {
    value_1836?.addEventListener("click", closeMemoryPromotionPreview);
  });
  memoryPromotionPreviewConfirm?.addEventListener("click", () => void handleAction_1379());
  memoryPromotionPreviewModal?.addEventListener("click", event_1837 => {
    if (event_1837.target === memoryPromotionPreviewModal) closeMemoryPromotionPreview();
  });
  scheduleClose && scheduleModal && scheduleClose.addEventListener("click", () => {
    if (window.closeView) window.closeView(scheduleModal);
  });
  window.imApp.renderMemoryView = renderMemoryView_2;
  function hideAllTabs_2() {
    const activeElement_1838 = document.activeElement;
    [imContent, chatsContent, momentsContent].some(value_1840 => value_1840?.contains(activeElement_1838)) && document.getElementById("imessage-view")?.focus({
      preventScroll: true
    });
    if (imContent) imContent.style.display = "none";
    if (chatsContent) chatsContent.style.display = "none";
    momentsContent && (momentsContent.style.display = "none", momentsContent.classList.remove("active"), momentsContent.setAttribute("aria-hidden", "true"));
    if (imContent) imContent.setAttribute("aria-hidden", "true");
    if (chatsContent) chatsContent.setAttribute("aria-hidden", "true");
    if (navHomeBtn) navHomeBtn.classList.remove("active");
    if (navChatsBtn) navChatsBtn.classList.remove("active");
    const lineHeaderRightElement_1839 = document.querySelector(".line-header-right");
    if (lineHeaderRightElement_1839) lineHeaderRightElement_1839.style.display = "flex";
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
  window.imApp.hideAllTabs = hideAllTabs_2;
  window.imApp.setActiveThemeSurface(navChatsBtn?.classList.contains("active") ? "chats" : "home");
  setTimeout(() => {
    if (window.imApp.applyAllSavedCss) window.imApp.applyAllSavedCss();
  }, 100);
});
