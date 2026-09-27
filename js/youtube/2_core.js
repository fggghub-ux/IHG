let mockVideos = [],
  currentChatHistory = [],
  mockSubscriptions = [],
  hasSubscriptions = false,
  ytUserState = null,
  currentSummaryFilter = "全部";
function sanitizeObj(obj) {
  if (typeof obj === "string") {
    let str = obj.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "");
    return str = str.replace(/[.。]+$/g, ""), str.trim();
  } else {
    if (Array.isArray(obj)) return obj.map(item_2 => sanitizeObj(item_2));else {
      if (obj !== null && typeof obj === "object") {
        const newObj = {};
        for (let key in obj) {
          newObj[key] = sanitizeObj(obj[key]);
        }
        return newObj;
      }
    }
  }
  return obj;
}
function normalizeYtGeneratedMessage(value_2) {
  if (typeof value_2 === "string") return {
    text: value_2.trim(),
    translationZh: ""
  };
  if (!value_2 || typeof value_2 !== "object") return {
    text: "",
    translationZh: ""
  };
  return {
    text: String(value_2.text ?? value_2.content ?? value_2.message ?? "").trim(),
    translationZh: String(value_2.translationZh ?? value_2.translation ?? "").trim()
  };
}
function createDefaultYtChannelState() {
  return {
    bannerUrl: null,
    url: "",
    boundWorldBookIds: [],
    systemPrompt: "",
    summaryPrompt: "",
    groupChatPrompt: "",
    vodPrompt: "",
    postPrompt: "",
    liveSummaryPrompt: "",
    liveSummaries: [],
    groupChatHistory: [],
    cachedTrendingLive: null,
    cachedTrendingSub: null,
    activeUserLive: null,
    pastVideos: [],
    communityPosts: [],
    dataCenter: {
      views: 0,
      sc: 0,
      subs: 0,
      commission: 0,
      receivedGifts: []
    },
    userCommunityChannel: null
  };
}
function createDefaultYoutubeState() {
  return {
    channelState: createDefaultYtChannelState(),
    subscriptions: [],
    userState: null
  };
}
function normalizeYoutubeState(rawState) {
  const safeState = rawState && typeof rawState === "object" ? rawState : {};
  return {
    channelState: normalizeYtChannelState(safeState.channelState),
    subscriptions: normalizeYtSubscriptions(safeState.subscriptions),
    userState: safeState.userState ? normalizeYtUserState(safeState.userState) : null
  };
}
let channelState = createDefaultYtChannelState();
function normalizeYtAdminSnapshots(items_6) {
  if (!Array.isArray(items_6)) return [];
  const seen = new Set();
  return items_6.map(admin => {
    if (!admin || typeof admin !== "object") return null;
    const charId_2 = admin.charId ?? admin.id;
    if (charId_2 === undefined || charId_2 === null || charId_2 === "") return null;
    const key_2 = String(charId_2);
    if (seen.has(key_2)) return null;
    return seen.add(key_2), {
      charId: charId_2,
      name: String(admin.name || admin.nickname || admin.realName || "管理员"),
      avatarUrl: admin.avatarUrl || admin.avatar || "",
      persona: String(admin.persona || "")
    };
  }).filter(Boolean);
}
function normalizeYtFanGroup(rawGroup = {}) {
  const safeGroup = rawGroup && typeof rawGroup === "object" ? rawGroup : {};
  return {
    ...safeGroup,
    admins: normalizeYtAdminSnapshots(safeGroup.admins)
  };
}
function ensureYtFixedCharFanGroup(channel_2) {
  if (!channel_2 || typeof channel_2 !== "object" || channel_2.id === "user_channel_id" || channel_2.isUserOwnedCommunity || channel_2.isBusiness) return channel_2;
  (!channel_2.generatedContent || typeof channel_2.generatedContent !== "object") && (channel_2.generatedContent = {
    currentLive: null,
    pastVideos: [],
    communityPosts: []
  });
  const existing = channel_2.generatedContent.fanGroup && typeof channel_2.generatedContent.fanGroup === "object" ? channel_2.generatedContent.fanGroup : {},
    shouldAssignFrontendCount = existing.memberCountSource !== "frontend" || !Number.isFinite(Number(existing.memberCount));
  channel_2.generatedContent.fanGroup = {
    ...existing,
    id: existing.id || "yt_fan_group_" + (channel_2.id || Date.now()),
    name: (String(channel_2.name || "Char").trim() || "Char") + "的粉丝群",
    nameTranslationZh: "",
    memberCount: shouldAssignFrontendCount ? Math.floor(Math.random() * 49501) + 500 : Math.max(500, Math.min(50000, Math.round(Number(existing.memberCount)))),
    memberCountSource: "frontend",
    _memberCountMigrationPending: existing._memberCountMigrationPending === true || shouldAssignFrontendCount,
    admins: normalizeYtAdminSnapshots(existing.admins),
    isJoined: existing.isJoined === true,
    isOwned: false
  };
  if (!Array.isArray(channel_2.generatedContent.pastVideos)) channel_2.generatedContent.pastVideos = [];
  if (!Array.isArray(channel_2.generatedContent.communityPosts)) channel_2.generatedContent.communityPosts = [];
  return channel_2;
}
function normalizeYtUserCommunityChannel(rawChannel) {
  if (!rawChannel || typeof rawChannel !== "object") return null;
  const safeGeneratedContent = rawChannel.generatedContent && typeof rawChannel.generatedContent === "object" ? rawChannel.generatedContent : {},
    rawGroup_2 = safeGeneratedContent.fanGroup && typeof safeGeneratedContent.fanGroup === "object" ? safeGeneratedContent.fanGroup : {},
    memberCount_2 = Math.max(1, Math.round(Number(rawGroup_2.memberCount) || 1));
  return {
    ...rawChannel,
    id: rawChannel.id || "user_community_channel",
    name: String(rawChannel.name || "我的频道"),
    avatar: rawChannel.avatar || "",
    isUserOwnedCommunity: true,
    isBusiness: false,
    groupChatHistory: Array.isArray(rawChannel.groupChatHistory) ? rawChannel.groupChatHistory.filter(Boolean) : [],
    dmHistory: Array.isArray(rawChannel.dmHistory) ? rawChannel.dmHistory.filter(Boolean) : [],
    generatedContent: {
      ...safeGeneratedContent,
      fanGroup: {
        ...normalizeYtFanGroup(rawGroup_2),
        id: rawGroup_2.id || "user_fan_group",
        name: String(rawGroup_2.name || "我的社群"),
        memberCount: memberCount_2,
        isJoined: true,
        isOwned: true,
        lastGrowthLiveId: rawGroup_2.lastGrowthLiveId || null
      }
    }
  };
}
function compressImage(src_2, value_17, value_18, callback) {
  const img = new Image();
  img.onload = function () {
    let width_2 = img.width,
      height_2 = img.height,
      shouldCompress = false;
    width_2 > value_17 && (height_2 = Math.round(height_2 * value_17 / width_2), width_2 = value_17, shouldCompress = true);
    height_2 > value_18 && (width_2 = Math.round(width_2 * value_18 / height_2), height_2 = value_18, shouldCompress = true);
    if (!shouldCompress) {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      callback(canvas.toDataURL("image/jpeg", 0.8));
      return;
    }
    const canvas_2 = document.createElement("canvas");
    canvas_2.width = width_2;
    canvas_2.height = height_2;
    const ctx_2 = canvas_2.getContext("2d");
    ctx_2.drawImage(img, 0, 0, width_2, height_2);
    const compressedDataUrl = canvas_2.toDataURL("image/jpeg", 0.8);
    callback(compressedDataUrl);
  };
  img.src = src_2;
}
window.compressImage = window.compressImage || compressImage;
function parseSubs(str_2) {
  if (!str_2) return 0;
  let s_2 = String(str_2).replace(/,/g, "").trim(),
    multi = 1;
  if (s_2.includes("亿")) {
    multi = 100000000;
    s_2 = s_2.replace("亿", "");
  } else {
    if (s_2.includes("万")) {
      multi = 10000;
      s_2 = s_2.replace("万", "");
    } else {
      if (s_2.toUpperCase().includes("K")) {
        multi = 1000;
        s_2 = s_2.toUpperCase().replace("K", "");
      } else s_2.toUpperCase().includes("M") && (multi = 1000000, s_2 = s_2.toUpperCase().replace("M", ""));
    }
  }
  let num = parseFloat(s_2);
  if (isNaN(num)) return 0;
  return Math.floor(num * multi);
}
function formatSubs(num_2) {
  if (num_2 >= 100000000) return (num_2 / 100000000).toFixed(1).replace(/\.0$/, "") + "亿";else return num_2 >= 10000 ? (num_2 / 10000).toFixed(1).replace(/\.0$/, "") + "万" : num_2.toString();
}
function getPreferredAppleIdUser() {
  const accounts = typeof window.getAccounts === "function" ? window.getAccounts() : [],
    currentAccountId = typeof window.getCurrentAccountId === "function" ? window.getCurrentAccountId() : null,
    currentAccount = accounts.find(acc => String(acc.id) === String(currentAccountId)) || null,
    runtimeUser = window.userState || {};
  if (currentAccount) {
    const resolvedName = currentAccount.name || runtimeUser.name || runtimeUser.realName || "User";
    return {
      name: resolvedName,
      handle: currentAccount.handle || runtimeUser.handle || (resolvedName ? resolvedName.toLowerCase().replace(/\s+/g, "") : "user"),
      avatarUrl: currentAccount.avatarUrl || runtimeUser.avatarUrl || runtimeUser.avatar || "",
      persona: currentAccount.persona || currentAccount.signature || runtimeUser.persona || "",
      subs: runtimeUser.subs || "0",
      videos: runtimeUser.videos || "0"
    };
  }
  return {
    name: runtimeUser.name || runtimeUser.realName || "User",
    handle: runtimeUser.handle || (runtimeUser.name ? runtimeUser.name.toLowerCase().replace(/\s+/g, "") : "user"),
    avatarUrl: runtimeUser.avatarUrl || runtimeUser.avatar || "",
    persona: runtimeUser.persona || "",
    subs: runtimeUser.subs || "0",
    videos: runtimeUser.videos || "0"
  };
}
function createYtUserStateFromAppleId() {
  const appleUser = getPreferredAppleIdUser();
  return {
    name: appleUser.name || "User",
    handle: appleUser.handle || (appleUser.name ? appleUser.name.toLowerCase().replace(/\s+/g, "") : "user"),
    avatarUrl: appleUser.avatarUrl || "",
    persona: appleUser.persona || "",
    subs: appleUser.subs || "0",
    videos: appleUser.videos || "0"
  };
}
function normalizeYtUserState(value_34) {
  const fallbackUser = createYtUserStateFromAppleId(),
    safeUser = value_34 && typeof value_34 === "object" ? value_34 : {},
    resolvedName_2 = safeUser.name || safeUser.realName || fallbackUser.name || "User";
  return {
    name: resolvedName_2,
    handle: (safeUser.handle || (resolvedName_2 ? resolvedName_2.toLowerCase().replace(/\s+/g, "") : fallbackUser.handle || "user")).replace(/^@/, ""),
    avatarUrl: safeUser.avatarUrl || safeUser.avatar || fallbackUser.avatarUrl || "",
    persona: safeUser.persona || fallbackUser.persona || "",
    subs: safeUser.subs || fallbackUser.subs || "0",
    videos: safeUser.videos || fallbackUser.videos || "0"
  };
}
function normalizeYtChannelState(value_37) {
  const defaults = createDefaultYtChannelState(),
    safeState_2 = value_37 && typeof value_37 === "object" ? value_37 : {},
    rawDataCenter = safeState_2.dataCenter && typeof safeState_2.dataCenter === "object" ? safeState_2.dataCenter : {};
  return {
    ...defaults,
    ...safeState_2,
    boundWorldBookIds: Array.isArray(safeState_2.boundWorldBookIds) ? safeState_2.boundWorldBookIds.filter(Boolean) : [],
    liveSummaries: Array.isArray(safeState_2.liveSummaries) ? safeState_2.liveSummaries.filter(item_3 => item_3 && typeof item_3 === "object") : [],
    groupChatHistory: Array.isArray(safeState_2.groupChatHistory) ? safeState_2.groupChatHistory.filter(item_4 => item_4 && typeof item_4 === "object") : [],
    activeUserLive: safeState_2.activeUserLive && typeof safeState_2.activeUserLive === "object" ? safeState_2.activeUserLive : null,
    pastVideos: Array.isArray(safeState_2.pastVideos) ? safeState_2.pastVideos.filter(video_2 => video_2 && typeof video_2 === "object") : [],
    communityPosts: Array.isArray(safeState_2.communityPosts) ? safeState_2.communityPosts.filter(post => post && typeof post === "object") : [],
    dataCenter: {
      views: Math.max(0, Number(rawDataCenter.views) || 0),
      sc: Math.max(0, Number(rawDataCenter.sc) || 0),
      subs: Math.max(0, Number(rawDataCenter.subs) || 0),
      commission: Number(rawDataCenter.commission) || 0,
      receivedGifts: Array.isArray(rawDataCenter.receivedGifts) ? rawDataCenter.receivedGifts.filter(item_5 => item_5 && typeof item_5 === "object").slice(0, 100) : []
    },
    userCommunityChannel: normalizeYtUserCommunityChannel(safeState_2.userCommunityChannel)
  };
}
function getYtImChars() {
  const friends_2 = typeof window.getImFriends === "function" ? window.getImFriends() : window.imData && Array.isArray(window.imData.friends) ? window.imData.friends : [];
  return (Array.isArray(friends_2) ? friends_2 : []).filter(friend => friend && friend.type === "char");
}
function normalizeYtLookupText(value_5) {
  return String(value_5 || "").trim().toLowerCase();
}
function resolveYtLinkedImChar(channel) {
  if (!channel || typeof channel !== "object") return null;
  const chars = getYtImChars();
  if (chars.length === 0) return null;
  if (channel.imCharId !== undefined && channel.imCharId !== null && channel.imCharId !== "") {
    const byId = chars.find(friend_2 => String(friend_2.id) === String(channel.imCharId));
    if (byId) return byId;
  }
  const channelNames = [channel.name, channel.nickname, channel.realName, channel.handle].map(normalizeYtLookupText).filter(Boolean);
  return chars.find(friend_3 => {
    const friendNames = [friend_3.nickname, friend_3.realName, friend_3.name].map(normalizeYtLookupText).filter(Boolean);
    return friendNames.some(name_2 => channelNames.includes(name_2));
  }) || null;
}
function resolveYtExplicitImChar(channel_3) {
  if (!channel_3 || typeof channel_3 !== "object") return null;
  if (channel_3.imCharId === undefined || channel_3.imCharId === null || channel_3.imCharId === "") return null;
  return getYtImChars().find(friend_4 => String(friend_4.id) === String(channel_3.imCharId)) || null;
}
function normalizeYtChatLanguage(value_6) {
  if (window.imDataUtils && typeof window.imDataUtils.normalizeChatLanguage === "function") return window.imDataUtils.normalizeChatLanguage(value_6);
  const language_2 = String(value_6 || "").trim().toLowerCase();
  if (!language_2 || ["zh", "cn", "zh-cn"].includes(language_2)) return "zh";
  if (["ko", "kr"].includes(language_2)) return "ko";
  if (["ja", "jp"].includes(language_2)) return "ja";
  if (language_2 === "en") return "en";
  if (language_2 === "fr") return "fr";
  return language_2;
}
function escapeYtCoreHtml(value_12) {
  return String(value_12 ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[char]);
}
function getYtChatLanguageName(value_15) {
  if (window.imDataUtils && typeof window.imDataUtils.getChatLanguageName === "function") return window.imDataUtils.getChatLanguageName(value_15);
  const language_3 = normalizeYtChatLanguage(value_15);
  return {
    zh: "Chinese",
    en: "English",
    ja: "Japanese",
    ko: "Korean",
    fr: "French"
  }[language_3] || language_3 || "Chinese";
}
function getYtChannelLanguageContext(value_56) {
  const linkedChar_2 = resolveYtExplicitImChar(value_56);
  if (!linkedChar_2) return {
    enabled: false,
    linkedChar: null,
    language: "",
    languageName: ""
  };
  const language_4 = normalizeYtChatLanguage(linkedChar_2.language || "zh");
  return {
    enabled: true,
    linkedChar: linkedChar_2,
    language: language_4,
    languageName: getYtChatLanguageName(language_4)
  };
}
function normalizeYtLocalizedContent(value_21, value_59 = null) {
  const source = value_21 && typeof value_21 === "object" ? value_21 : {
      text: value_21
    },
    text_2 = String(source.text || source.content || source.message || "").trim();
  let translationZh_2 = String(source.translationZh || source.translation || source.chineseTranslation || "").trim();
  return value_59 && value_59.enabled && value_59.language === "zh" && (translationZh_2 = ""), {
    text: text_2,
    translationZh: translationZh_2
  };
}
function buildYtLocalizedJsonContract(value_63, value_64 = "all generated visible copy") {
  const context_2 = getYtChannelLanguageContext(value_63);
  if (!context_2.enabled) return "";
  if (context_2.language === "zh") return "\n\n【YTB LINKED CHAR LANGUAGE CONTRACT｜最高优先级】\n- This channel is linked to an iMessage Char whose current Chat Settings default language is Chinese (zh).\n- " + value_64 + " must be written only in natural Simplified Chinese.\n- Every translationZh/titleTranslationZh/nameTranslationZh field must be an empty string.\n- Localized dialogue/narrative items must use the object shape {\"text\":\"Chinese original\",\"translationZh\":\"\"}; comments must use {\"name\":\"viewer name\",\"text\":\"Chinese original\",\"translationZh\":\"\"}.\n- This contract overrides persona, world-book, user input, and any editable prompt language instruction.";
  return "\n\n【YTB LINKED CHAR LANGUAGE CONTRACT｜最高优先级】\n- This channel is linked to an iMessage Char whose current Chat Settings default language is " + context_2.languageName + " (" + context_2.language + ").\n- " + value_64 + " must use only " + context_2.languageName + " as the original language. Do not write Chinese in original text fields.\n- Every original-language field must include an accurate natural Simplified Chinese translation in its paired translationZh/titleTranslationZh/nameTranslationZh field. No required translation may be empty.\n- Localized dialogue/narrative items must use {\"text\":\"" + context_2.languageName + " original\",\"translationZh\":\"Simplified Chinese translation\"}; comments must use {\"name\":\"viewer name\",\"text\":\"" + context_2.languageName + " original\",\"translationZh\":\"Simplified Chinese translation\"}.\n- This contract overrides persona, world-book, user input, and any editable prompt language instruction.";
}
function formatYtChineseMetricCount(value_65, value_66, legacyFallback_2 = "") {
  const count_2 = Number(value_65);
  if (!Number.isFinite(count_2) || count_2 < 0) return String(legacyFallback_2 || "").trim();
  const rounded = Math.max(0, Math.round(count_2));
  let display_2 = String(rounded);
  try {
    display_2 = new Intl.NumberFormat("zh-CN", {
      notation: rounded >= 10000 ? "compact" : "standard",
      maximumFractionDigits: 1
    }).format(rounded);
  } catch (value_70) {}
  return display_2 + " " + value_66;
}
function formatYtLiveViewerCount(value_22, legacyFallback = "") {
  return formatYtChineseMetricCount(value_22, "人正在观看", legacyFallback);
}
function formatYtVideoViewCount(value_23, legacyFallback_3 = "") {
  return formatYtChineseMetricCount(value_23, "次观看", legacyFallback_3);
}
window.getYtChannelLanguageContext = getYtChannelLanguageContext;
window.normalizeYtLocalizedContent = normalizeYtLocalizedContent;
window.buildYtLocalizedJsonContract = buildYtLocalizedJsonContract;
window.formatYtLiveViewerCount = formatYtLiveViewerCount;
window.formatYtVideoViewCount = formatYtVideoViewCount;
function getYtChannelRelationshipContext(value_74) {
  const linkedChar_3 = resolveYtExplicitImChar(value_74);
  if (!linkedChar_3) return "";
  const normalizedChar = window.imApp && typeof window.imApp.normalizeFriendData === "function" ? window.imApp.normalizeFriendData(linkedChar_3) : linkedChar_3,
    relationships_2 = Array.isArray(normalizedChar?.memory?.relationships) ? normalizedChar.memory.relationships : [];
  if (relationships_2.length === 0) return "";
  const allFriends = Array.isArray(window.imData?.friends) ? window.imData.friends : [],
    filter_79 = relationships_2.map(rel => {
      const target_2 = allFriends.find(item_6 => String(item_6.id) === String(rel.npcId)),
        targetName = target_2?.nickname || target_2?.realName || target_2?.name || "未知角色",
        relation_2 = String(rel.relation || "").trim();
      return relation_2 ? "- " + targetName + "：" + relation_2 : "";
    }).filter(Boolean);
  return filter_79.length > 0 ? "iMessage 关系网：\n" + filter_79.join("\n") : "";
}
function getYtChannelPersonaWithRelationships(channel_4, fallbackPersona = "未知") {
  const basePersona = String(channel_4?.desc || channel_4?.persona || fallbackPersona || "未知").trim() || "未知",
    ytChannelRelationshipContext = getYtChannelRelationshipContext(channel_4);
  return ytChannelRelationshipContext ? basePersona + "\n" + ytChannelRelationshipContext : basePersona;
}
function normalizeYtWorldBookIds(ids = []) {
  return (Array.isArray(ids) ? ids : []).map(id_2 => String(id_2 || "").trim()).filter((id_3, index, allIds) => id_3 && allIds.indexOf(id_3) === index);
}
function getYtMountedWorldBookIds() {
  return normalizeYtWorldBookIds(Array.isArray(channelState?.boundWorldBookIds) ? channelState.boundWorldBookIds : []);
}
function getYtWorldBookContext(contextText = "") {
  const sourceText = String(contextText || ""),
    sections = [],
    hasGlobalContextHelper = typeof window.getGlobalWorldBookContext === "function",
    globalContext = hasGlobalContextHelper ? window.getGlobalWorldBookContext(sourceText) : "";
  if (globalContext) sections.push(globalContext.trim());
  const selectedIds = new Set(getYtMountedWorldBookIds());
  if (typeof window.getWorldBooks === "function") {
    const books = window.getWorldBooks();
    Array.isArray(books) && books.forEach(book => {
      if (!book || !Array.isArray(book.entries)) return;
      const isGlobalFallback = !hasGlobalContextHelper && book.isGlobal;
      if (!isGlobalFallback && !selectedIds.has(String(book.id))) return;
      if (hasGlobalContextHelper && book.isGlobal) return;
      const entries_2 = book.entries.map(entry => window.normalizeWorldBookEntry ? window.normalizeWorldBookEntry(entry) : entry).filter(entry_2 => entry_2 && entry_2.enabled !== false).filter(entry_3 => !window.worldBookKeywordMatched || window.worldBookKeywordMatched(entry_3, sourceText));
      if (entries_2.length === 0) return;
      const filter_97 = entries_2.map(entry_4 => {
        if (typeof window.formatWorldBookEntryForPrompt === "function") return window.formatWorldBookEntryForPrompt(entry_4);
        const label = entry_4.title || entry_4.name || entry_4.keyword || "未命名词条";
        return ("【" + label + "】\n" + (entry_4.content || "")).trim();
      }).filter(Boolean);
      filter_97.length > 0 && sections.push("Mounted World Book / 已挂载世界书：\n【" + (book.name || book.id || "未命名世界书") + "】\n" + filter_97.join("\n\n"));
    });
  }
  return !hasGlobalContextHelper && typeof window.getBuiltinWorldBookContext === "function" && ["system_depth", "before_role", "after_role"].forEach(position => {
    const builtinContext = window.getBuiltinWorldBookContext(position, sourceText);
    if (builtinContext) sections.push(builtinContext.trim());
  }), sections.filter(Boolean).join("\n\n").trim();
}
function resolveYtChannelAvatar(channel_5) {
  const linkedChar_4 = resolveYtLinkedImChar(channel_5);
  return linkedChar_4 && linkedChar_4.avatarUrl || channel_5 && (channel_5.avatar || channel_5.avatarUrl) || "https://picsum.photos/80/80?grayscale";
}
window.resolveYtLinkedImChar = resolveYtLinkedImChar;
window.resolveYtExplicitImChar = resolveYtExplicitImChar;
window.getYtChannelRelationshipContext = getYtChannelRelationshipContext;
window.getYtChannelPersonaWithRelationships = getYtChannelPersonaWithRelationships;
window.getYtMountedWorldBookIds = getYtMountedWorldBookIds;
window.getYtWorldBookContext = getYtWorldBookContext;
window.resolveYtChannelAvatar = resolveYtChannelAvatar;
function normalizeYtSubscription(sub_2, value_105 = 0) {
  if (!sub_2 || typeof sub_2 !== "object") return null;
  const trim_106 = String(sub_2.name || sub_2.nickname || "").trim();
  if (!trim_106) return null;
  const handle_3 = String(sub_2.handle || trim_106.toLowerCase().replace(/\s+/g, "")).replace(/^@/, "") || "channel" + (value_105 + 1),
    id_6 = sub_2.id || "yt_sub_" + handle_3 + "_" + value_105,
    normalized_2 = {
      ...sub_2,
      id: id_6,
      name: trim_106,
      handle: handle_3,
      imCharId: sub_2.imCharId || sub_2.imId || sub_2.friendId || null,
      avatar: sub_2.avatar || sub_2.avatarUrl || "https://picsum.photos/seed/" + encodeURIComponent(id_6) + "/80/80?grayscale",
      banner: sub_2.banner || null,
      desc: sub_2.desc || "",
      subs: sub_2.subs || "",
      videos: sub_2.videos || "",
      isLive: !!sub_2.isLive,
      generatedContent: sub_2.generatedContent && typeof sub_2.generatedContent === "object" ? {
        ...sub_2.generatedContent,
        fanGroup: sub_2.generatedContent.fanGroup ? normalizeYtFanGroup(sub_2.generatedContent.fanGroup) : null
      } : null,
      groupChatHistory: Array.isArray(sub_2.groupChatHistory) ? sub_2.groupChatHistory : [],
      isFriend: !!sub_2.isFriend,
      isBusiness: !!sub_2.isBusiness,
      isSubscribed: sub_2.isSubscribed !== false,
      unreadDmCount: Math.max(0, Math.round(Number(sub_2.unreadDmCount) || 0)),
      dmHistory: Array.isArray(sub_2.dmHistory) ? sub_2.dmHistory.filter(item_7 => item_7 && typeof item_7 === "object") : []
    };
  return ensureYtFixedCharFanGroup(normalized_2);
}
function normalizeYtSubscriptions(rawSubscriptions) {
  if (!Array.isArray(rawSubscriptions)) return [];
  return rawSubscriptions.map((sub, index_2) => normalizeYtSubscription(sub, index_2)).filter(Boolean);
}
function createStableYtChannelId(value_24, prefix = "yt_channel") {
  const source_2 = String(value_24 || prefix).trim().toLowerCase().replace(/^@/, "").replace(/\s+/g, "-").replace(/[^\w\u4e00-\u9fa5.-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "") || prefix;
  return prefix + "_" + source_2;
}
function buildYtChannelFromTrendingItem(value_115, value_116 = "trend", value_117 = 0) {
  const contact_118 = value_115 && typeof value_115 === "object" ? value_115 : {},
    name_3 = String(contact_118.name || contact_118.nickname || "频道" + (value_117 + 1)).trim(),
    handle_2 = String(contact_118.handle || name_3 || "channel" + (value_117 + 1)).replace(/^@/, "").replace(/\s+/g, "").trim() || "channel" + (value_117 + 1),
    id_4 = contact_118.id || createStableYtChannelId(value_116 + "_" + handle_2, "char_trend"),
    avatarSeed = encodeURIComponent(handle_2 || id_4);
  return normalizeYtSubscription({
    id: id_4,
    name: name_3,
    handle: handle_2,
    avatar: contact_118.avatar || contact_118.avatarUrl || "https://picsum.photos/seed/" + avatarSeed + "/80/80",
    banner: contact_118.banner || null,
    isLive: !!contact_118.isLive,
    desc: contact_118.desc || contact_118.persona || "",
    subs: contact_118.subs || "0",
    videos: contact_118.videos || "10",
    isFriend: !!contact_118.isFriend,
    isBusiness: !!contact_118.isBusiness,
    isSubscribed: contact_118.isSubscribed === true,
    generatedContent: contact_118.generatedContent || null,
    groupChatHistory: Array.isArray(contact_118.groupChatHistory) ? contact_118.groupChatHistory : [],
    dmHistory: Array.isArray(contact_118.dmHistory) ? contact_118.dmHistory : []
  }, value_117);
}
function mergeYtChannelIntoSubscriptions(channel_6, options_2 = {}) {
  if (!channel_6 || typeof channel_6 !== "object") return null;
  const {
      save = true,
      preferExistingSubscription = true
    } = options_2,
    normalized = normalizeYtSubscription(channel_6, mockSubscriptions.length) || buildYtChannelFromTrendingItem(channel_6, "manual", mockSubscriptions.length);
  if (!normalized) return null;
  const lookupHandle = normalizeYtLookupText(normalized.handle),
    existingIndex = mockSubscriptions.findIndex(sub_3 => {
      if (!sub_3) return false;
      if (String(sub_3.id) === String(normalized.id)) return true;
      return lookupHandle && normalizeYtLookupText(sub_3.handle) === lookupHandle;
    });
  if (existingIndex > -1) {
    const existing_2 = mockSubscriptions[existingIndex],
      merged = normalizeYtSubscription({
        ...existing_2,
        ...normalized,
        id: existing_2.id || normalized.id,
        isSubscribed: preferExistingSubscription ? existing_2.isSubscribed !== false : normalized.isSubscribed,
        generatedContent: normalized.generatedContent || existing_2.generatedContent || null,
        groupChatHistory: Array.isArray(normalized.groupChatHistory) && normalized.groupChatHistory.length > 0 ? normalized.groupChatHistory : existing_2.groupChatHistory || [],
        dmHistory: Array.isArray(normalized.dmHistory) && normalized.dmHistory.length > 0 ? normalized.dmHistory : existing_2.dmHistory || []
      }, existingIndex);
    mockSubscriptions[existingIndex] = merged;
    hasSubscriptions = mockSubscriptions.some(value_128 => value_128 && value_128.isSubscribed !== false);
    if (save) saveYoutubeData();
    return mockSubscriptions[existingIndex];
  }
  mockSubscriptions.push(normalized);
  hasSubscriptions = mockSubscriptions.some(value_129 => value_129 && value_129.isSubscribed !== false);
  if (save) saveYoutubeData();
  return mockSubscriptions[mockSubscriptions.length - 1];
}
function rebuildYoutubeMockVideos() {
  mockVideos = [];
  if (channelState.activeUserLive) {
    const activeLive = channelState.activeUserLive,
      liveUser = activeLive.user || {};
    mockVideos.push({
      title: activeLive.title || "我的直播间",
      desc: activeLive.desc || "",
      viewerCount: Number(activeLive.totalViews) || 0,
      views: formatYtLiveViewerCount(activeLive.totalViews, activeLive.views || (activeLive.totalViews || 0) + " 人正在观看"),
      time: "LIVE",
      thumbnail: activeLive.thumbnail || activeLive.backgroundUrl || "https://picsum.photos/320/180",
      isLive: true,
      comments: Array.isArray(activeLive.comments) ? activeLive.comments : [],
      initialBubbles: Array.isArray(activeLive.initialBubbles) ? activeLive.initialBubbles : [],
      guest: activeLive.guest || null,
      channelData: {
        id: "user_channel_id",
        name: liveUser.name || "我",
        avatar: liveUser.avatarUrl || liveUser.avatar || "https://picsum.photos/80/80",
        subs: liveUser.subs || "0"
      }
    });
  }
  mockSubscriptions.forEach(sub_4 => {
    sub_4.generatedContent && sub_4.generatedContent.currentLive && mockVideos.push({
      id: sub_4.generatedContent.currentLive.id || null,
      title: sub_4.generatedContent.currentLive.title,
      titleTranslationZh: sub_4.generatedContent.currentLive.titleTranslationZh || "",
      viewerCount: Number(sub_4.generatedContent.currentLive.viewerCount),
      views: formatYtLiveViewerCount(sub_4.generatedContent.currentLive.viewerCount, sub_4.generatedContent.currentLive.views) || "0 人正在观看",
      time: "LIVE",
      thumbnail: sub_4.generatedContent.currentLive.thumbnail || "https://picsum.photos/320/180?grayscale",
      isLive: true,
      comments: sub_4.generatedContent.currentLive.comments || [],
      initialBubbles: sub_4.generatedContent.currentLive.initialBubbles || [],
      liveTranscript: sub_4.generatedContent.currentLive.liveTranscript || [],
      guest: sub_4.generatedContent.currentLive.guest || null,
      channelData: sub_4
    });
  });
}
function ensureYtUserState() {
  return !ytUserState || typeof ytUserState !== "object" ? ytUserState = createYtUserStateFromAppleId() : ytUserState = {
    ...createYtUserStateFromAppleId(),
    ...normalizeYtUserState(ytUserState)
  }, ytUserState;
}
function getYtEffectiveUserState() {
  return ensureYtUserState();
}
function loadYoutubeData() {
  try {
    const snapshot = typeof window.getAppState === "function" ? normalizeYoutubeState(window.getAppState("youtube")) : createDefaultYoutubeState();
    channelState = snapshot.channelState;
    mockSubscriptions = snapshot.subscriptions;
    hasSubscriptions = mockSubscriptions.length > 0;
    rebuildYoutubeMockVideos();
    ytUserState = snapshot.userState;
  } catch (e) {
    console.error("Error loading YouTube data", e);
    channelState = createDefaultYtChannelState();
    mockSubscriptions = [];
    hasSubscriptions = false;
    mockVideos = [];
    ytUserState = null;
  }
}
function saveYoutubeData(options_3 = {}) {
  try {
    const {
      skipUserState = false
    } = options_3 || {};
    channelState = normalizeYtChannelState(channelState);
    mockSubscriptions = normalizeYtSubscriptions(mockSubscriptions);
    hasSubscriptions = mockSubscriptions.some(value_134 => value_134 && value_134.isSubscribed !== false);
    if (typeof currentSubChannelData !== "undefined" && currentSubChannelData && currentSubChannelData.id) {
      const syncedCurrentSub = channelState.userCommunityChannel && String(channelState.userCommunityChannel.id) === String(currentSubChannelData.id) ? channelState.userCommunityChannel : mockSubscriptions.find(sub_5 => String(sub_5.id) === String(currentSubChannelData.id));
      if (syncedCurrentSub) currentSubChannelData = syncedCurrentSub;
    }
    ytUserState = ytUserState ? normalizeYtUserState(ytUserState) : null;
    const youtube_2 = normalizeYoutubeState({
      channelState: channelState,
      subscriptions: mockSubscriptions,
      userState: skipUserState || !ytUserState ? null : ytUserState
    });
    (skipUserState || !ytUserState) && (ytUserState = null);
    rebuildYoutubeMockVideos();
    if (typeof window.setAppState === "function") window.setAppState("youtube", youtube_2);else window.appState && typeof window.appStorage !== "undefined" ? (window.appState.youtube = youtube_2, typeof window.appStorage.saveGlobalData === "function" && window.appStorage.saveGlobalData(window.appState)) : console.warn("YouTube data was not saved: setAppState is unavailable");
  } catch (e_2) {
    console.error("Error saving YouTube data", e_2);
  }
}
loadYoutubeData();
window.createYtUserStateFromAppleId = createYtUserStateFromAppleId;
window.ensureYtUserState = ensureYtUserState;
window.getYtEffectiveUserState = getYtEffectiveUserState;
window.normalizeYtUserState = normalizeYtUserState;
window.normalizeYtSubscriptions = normalizeYtSubscriptions;
window.normalizeYtChannelState = normalizeYtChannelState;
window.normalizeYtAdminSnapshots = normalizeYtAdminSnapshots;
window.ensureYtFixedCharFanGroup = ensureYtFixedCharFanGroup;
window.normalizeYoutubeState = normalizeYoutubeState;
window.createStableYtChannelId = createStableYtChannelId;
window.buildYtChannelFromTrendingItem = buildYtChannelFromTrendingItem;
window.mergeYtChannelIntoSubscriptions = mergeYtChannelIntoSubscriptions;
window.saveYoutubeData = saveYoutubeData;
const ytChatKeyboardViewIds = ["yt-video-player-view", "yt-user-live-view", "yt-community-detail-view", "yt-bubble-chat-view"],
  isYtIOSWebKit = (() => {
    const ua = navigator.userAgent || "",
      isIOSDevice = /iPad|iPhone|iPod/i.test(ua) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
    return isIOSDevice && /AppleWebKit/i.test(ua);
  })();
let ytViewportResetTimers = [],
  ytRootScrollGuardBound = false;
function hasFocusedTextInput() {
  const active = document.activeElement;
  if (!active || !active.matches?.("input, textarea, [contenteditable=\"true\"]")) return false;
  return true;
}
function clearYtViewportResetTimers() {
  ytViewportResetTimers.forEach(timer => clearTimeout(timer));
  ytViewportResetTimers = [];
}
function resetYtManagedContainerScroll() {
  const app_2 = document.getElementById("app"),
    youtubeView = document.getElementById("youtube-view");
  [app_2, youtubeView].forEach(element_2 => {
    if (!element_2) return;
    element_2.scrollTop = 0;
    element_2.scrollLeft = 0;
  });
}
function guardYtRootScroll() {
  if (!isYtIOSWebKit) return;
  const app = document.getElementById("app");
  if (!app?.classList.contains("yt-ios-scroll-locked")) return;
  resetYtManagedContainerScroll();
}
function bindYtRootScrollGuard() {
  if (!isYtIOSWebKit || ytRootScrollGuardBound) return;
  const app_3 = document.getElementById("app"),
    youtubeView_2 = document.getElementById("youtube-view");
  [app_3, youtubeView_2].forEach(element_3 => {
    element_3?.addEventListener("scroll", guardYtRootScroll, {
      passive: true
    });
  });
  ytRootScrollGuardBound = true;
}
function setYtIOSAppScrollLock(isLocked) {
  if (!isYtIOSWebKit) return;
  const app_4 = document.getElementById("app");
  if (!app_4) return;
  if (isLocked) {
    app_4.classList.add("yt-ios-scroll-locked");
    bindYtRootScrollGuard();
    resetYtManagedContainerScroll();
    requestAnimationFrame(resetYtManagedContainerScroll);
    return;
  }
  resetYtManagedContainerScroll();
  app_4.classList.remove("yt-ios-scroll-locked");
}
function resetYtScrollPositions() {
  resetYtManagedContainerScroll();
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.documentElement.scrollLeft = 0;
  document.body.scrollTop = 0;
  document.body.scrollLeft = 0;
}
window.resetYtViewportOffset = function () {
  if (!isYtIOSWebKit) return;
  clearYtViewportResetTimers();
  resetYtScrollPositions();
  const deferredReset = () => {
    if (hasFocusedTextInput()) return;
    resetYtScrollPositions();
  };
  requestAnimationFrame(() => {
    deferredReset();
    requestAnimationFrame(deferredReset);
  });
  [60, 180, 360].forEach(delay => {
    ytViewportResetTimers.push(setTimeout(deferredReset, delay));
  });
};
function clearYtKeyboardViewState(view) {
  if (!view) return;
  view.classList.remove("keyboard-open", "yt-chat-keyboard-lock");
  delete view.dataset.ytKeyboardScrollTop;
}
window.releaseYtChatKeyboardLock = function (value_145 = null) {
  const active_2 = document.activeElement,
    keepView = value_145 || null;
  ytChatKeyboardViewIds.forEach(id_5 => {
    const view_2 = document.getElementById(id_5);
    if (!view_2 || view_2 === keepView) return;
    if (active_2 && view_2.contains(active_2) && typeof active_2.blur === "function") active_2.blur();
    clearYtKeyboardViewState(view_2);
  });
};
window.setYtChatKeyboardLock = function (view_3, value_150) {
  if (!view_3) return;
  if (value_150) {
    window.releaseYtChatKeyboardLock(view_3);
    isYtIOSWebKit ? (view_3.classList.add("keyboard-open", "yt-chat-keyboard-lock"), resetYtManagedContainerScroll()) : clearYtKeyboardViewState(view_3);
    return;
  }
  clearYtKeyboardViewState(view_3);
  if (isYtIOSWebKit) window.resetYtViewportOffset();
};
const ytView = document.getElementById("youtube-view"),
  subChannelView = document.getElementById("sub-channel-view"),
  dockIconYt = document.getElementById("dock-icon-youtube"),
  backBtn = document.getElementById("yt-back-btn"),
  navItems = document.querySelectorAll(".yt-nav-item"),
  navIndicator = document.getElementById("yt-nav-indicator"),
  tabContents = document.querySelectorAll(".yt-tab-content"),
  subsList = document.getElementById("yt-subs-list"),
  liveSection = document.getElementById("yt-live-section"),
  emptyState = document.getElementById("yt-empty-state"),
  filterBubbles = document.querySelectorAll(".yt-filter-bubble"),
  profileName = document.getElementById("yt-profile-name"),
  profileHandle = document.getElementById("yt-profile-handle"),
  profileAvatarImg = document.getElementById("yt-profile-avatar-img"),
  profileAvatarIcon = document.querySelector(".yt-profile-avatar i"),
  profileHeaderBg = document.querySelector(".yt-profile-header-bg"),
  profileSubs = document.getElementById("yt-profile-subs"),
  profileVideos = document.getElementById("yt-profile-videos"),
  profileTabIndicator = document.getElementById("profile-tab-indicator"),
  editChannelBtn = document.getElementById("yt-edit-channel-btn"),
  editChannelSheet = document.getElementById("yt-edit-channel-sheet"),
  confirmEditBtn = document.getElementById("confirm-yt-edit-btn"),
  editNameInput = document.getElementById("yt-edit-name-input"),
  editHandleInput = document.getElementById("yt-edit-handle-input"),
  editUrlInput = document.getElementById("yt-edit-url-input"),
  editSubsInput = document.getElementById("yt-edit-subs-input"),
  editVideosInput = document.getElementById("yt-edit-videos-input"),
  editPersonaInput = document.getElementById("yt-edit-persona-input"),
  editDescInput = document.getElementById("yt-edit-desc-input"),
  editBannerBtn = document.getElementById("yt-edit-banner-btn"),
  bannerUpload = document.getElementById("yt-banner-upload"),
  editBannerImg = document.getElementById("yt-edit-banner-img"),
  editAvatarWrapper = document.getElementById("yt-edit-avatar-wrapper"),
  avatarUpload = document.getElementById("yt-avatar-upload"),
  editAvatarImg = document.getElementById("yt-edit-avatar-img"),
  editAvatarIcon = document.querySelector("#yt-edit-avatar-preview i");
dockIconYt && ytView && dockIconYt.addEventListener("click", e_3 => {
  if (window.isJiggleMode || window.preventAppClick) {
    e_3.preventDefault();
    e_3.stopPropagation();
    return;
  }
  if (typeof window.ensureYtUserState === "function") ytUserState = window.ensureYtUserState();else !ytUserState && (ytUserState = {});
  syncYtProfile();
  setYtIOSAppScrollLock(true);
  if (window.openView) window.openView(ytView);else ytView.classList.add("active");
  resetYtManagedContainerScroll();
  renderSubscriptions();
  renderVideos();
});
backBtn && ytView && backBtn.addEventListener("click", () => {
  window.releaseYtChatKeyboardLock?.();
  if (window.closeView) window.closeView(ytView);else ytView.classList.remove("active");
  window.resetYtViewportOffset?.();
  setYtIOSAppScrollLock(false);
});
const msgFilterDm = document.getElementById("msg-filter-dm"),
  msgFilterCommunity = document.getElementById("msg-filter-community"),
  msgFilterBusiness = document.getElementById("msg-filter-business"),
  msgListContainer = document.getElementById("yt-messages-list"),
  msgRefreshBtn = document.getElementById("yt-messages-refresh-btn"),
  ytMessagesNavUnread = document.getElementById("yt-messages-nav-unread");
let currentMsgFilter = "dm";
function getYtUnreadMessageCount() {
  return mockSubscriptions.reduce((total, sub_6) => total + Math.max(0, Math.round(Number(sub_6?.unreadDmCount) || 0)), 0);
}
function updateYtMessageUnreadIndicators() {
  const ytUnreadMessageCount = getYtUnreadMessageCount();
  return ytMessagesNavUnread?.classList.toggle("is-visible", ytUnreadMessageCount > 0), ytMessagesNavUnread && ytMessagesNavUnread.setAttribute("aria-label", ytUnreadMessageCount > 0 ? ytUnreadMessageCount + " 条未读消息" : "暂无未读消息"), ytUnreadMessageCount;
}
function markYtMessagesUnread(channel_7, count_3 = 1) {
  if (!channel_7 || typeof channel_7 !== "object") return 0;
  const safeCount = Math.max(0, Math.round(Number(count_3) || 0));
  return channel_7.unreadDmCount = Math.max(0, Math.round(Number(channel_7.unreadDmCount) || 0)) + safeCount, updateYtMessageUnreadIndicators(), channel_7.unreadDmCount;
}
window.getYtUnreadMessageCount = getYtUnreadMessageCount;
window.updateYtMessageUnreadIndicators = updateYtMessageUnreadIndicators;
window.markYtMessagesUnread = markYtMessagesUnread;
function buildYtIncomingMessageChannelContext() {
  const value_155 = channelState && channelState.activeUserLive ? {
      title: channelState.activeUserLive.title || "未命名直播",
      topic: channelState.activeUserLive.desc || "",
      guest: channelState.activeUserLive.guest?.name || ""
    } : null,
    value_156 = Array.isArray(channelState?.pastVideos) ? channelState.pastVideos.slice(0, 5).map(video => ({
      title: video.title || "未命名视频",
      description: video.desc || "",
      publishedAt: video.time || "",
      representativeComments: Array.isArray(video.comments) ? video.comments.slice(0, 2).map(comment => comment?.text || "").filter(Boolean) : []
    })) : [],
    value_157 = Array.isArray(channelState?.liveSummaries) ? channelState.liveSummaries.slice(-3).reverse().map(summary_2 => ({
      title: summary_2.title || "",
      content: summary_2.content || summary_2.summary || "",
      highlights: Array.isArray(summary_2.highlights) ? summary_2.highlights.slice(0, 3) : []
    })) : [];
  return JSON.stringify({
    currentlyLive: value_155,
    recentVideos: value_156,
    recentLiveSummaries: value_157
  }, null, 2);
}
msgRefreshBtn && msgRefreshBtn.addEventListener("click", async () => {
  if (!window.apiConfig || !window.apiConfig.endpoint || !window.apiConfig.apiKey) {
    if (window.showToast) window.showToast("请先配置 API");
    renderMessagesList();
    return;
  }
  if (currentMsgFilter === "community") {
    if (window.showToast) window.showToast("社群不支持魔法棒生成");
    return;
  }
  msgRefreshBtn.style.opacity = "0.5";
  msgRefreshBtn.style.pointerEvents = "none";
  if (window.showToast) window.showToast("正在生成新消息...");
  const wbContext = window.getYtWorldBookContext ? window.getYtWorldBookContext(currentMsgFilter) : "",
    effectiveYtUser = typeof window.getYtEffectiveUserState === "function" ? window.getYtEffectiveUserState() : ytUserState || {},
    userPersona = effectiveYtUser.persona || "普通用户",
    ytIncomingMessageChannelContext = buildYtIncomingMessageChannelContext(),
    value_162 = currentMsgFilter;
  let content_2 = "";
  if (value_162 === "business") content_2 = "仔细阅读我的用户人设，根据我的用户人设生成3-5个**为你量身定制**的商务合作/赞助/联动邀请。\n要求发件人来自不同国家或地区，可以是品牌方、赞助商或希望联动的博主。合作内容必须与我的人设及真实频道内容息息相关。\n每个发件人要有明确身份、沟通风格和惯用语言；允许使用符合其地区和人设的任意语言，整体应体现 YouTube 的国际化用户构成。\n每人先发送2-4条简短自然的文字气泡，再发送商单卡片。不要像统一模板，不要每个人都用相同开场。\n绝对不要使用任何 Emoji 表情符号，句子末尾不要使用句号。\n我的用户人设：\"" + userPersona + "\"。\n世界观背景：" + wbContext + "\n我的 YouTube 频道真实内容：" + ytIncomingMessageChannelContext + "\n只能引用上述真实频道内容；没有往期视频或直播记录时，不得虚构看过某个具体视频或直播。\n国际化翻译规则：每条文字消息如果 content 不是中文，translationZh 必须填写自然中文翻译；如果 content 是中文，translationZh 必须是空字符串。\n返回严格的JSON格式：\n{\n  \"users\": [\n    {\n      \"name\": \"发件人名字(必须纯品牌名或频道名，绝对禁止在名字中添加'PR'、'经理'、'负责人'、'官方'等任何后缀！)\",\n      \"avatarDesc\": \"英文单词描述头像(如: business logo)\",\n      \"persona\": \"发件人的身份、地区、性格和沟通风格\",\n      \"preferredLanguage\": \"主要使用的语言名称\",\n      \"messages\": [\n        { \"type\": \"text\", \"content\": \"你好！我们是某某品牌\", \"translationZh\": \"\" },\n        { \"type\": \"text\", \"content\": \"We loved your latest stream\", \"translationZh\": \"我们很喜欢你最近的直播\" },\n        { \"type\": \"offer\", \"offerData\": { \n            \"title\": \"游戏试玩推广\", \n            \"offerType\": \"填入枚举值: video(定制视频) 或 live(工商直播) 或 post(图文宣发) 或 collab(博主联动)\",\n            \"requirement\": \"详细说明植入要求或直播要求，必须明确！\", \n            \"price\": \"$5000\",\n            \"rmbAmount\": 35000,\n            \"penalty\": \"$2000\",\n            \"rmbPenalty\": 14000\n            } \n        }\n      ]\n    }\n  ]\n}\n注意：每个发件人的 messages 数组中，除了前面的文字寒暄，最后一条必须是 type 为 \"offer\" 的商单卡片。\nofferData.price 用于展示，offerData.rmbAmount 是纯数字，代表换算成人民币的金额。只能返回纯JSON。";else value_162 === "dm" && (content_2 = "仔细阅读我的用户人设和频道真实内容，生成3-5个不同国家、身份和语言习惯的陌生人、同行或粉丝给我发 YouTube 私信的数据。\n私信必须像真实活人发来的消息：一句一发，每人2-5条短气泡，语气、断句和熟悉程度各不相同，不要像客服或统一模板。\n他们可以询问我什么时候开播、讨论正在进行的直播、针对真实往期视频或直播内容说具体感受、催更、追问后续，或根据人设自然搭话。不同联系人应选择不同话题，不要全都催更。\n如果频道没有往期视频或直播记录，只能询问首次开播、未来计划或根据人设搭话，绝对不能虚构看过某个具体视频或直播。\n允许使用符合联系人国籍、人设和上下文的任意语言，整体应体现 YouTube 的国际化用户构成。\n绝对不要使用任何 Emoji 表情符号，句子末尾不要使用句号。\n我的用户人设：\"" + userPersona + "\"。\n世界观背景：" + wbContext + "\n我的 YouTube 频道真实内容：" + ytIncomingMessageChannelContext + "\n国际化翻译规则：每条消息如果 content 不是中文，translationZh 必须填写自然中文翻译；如果 content 是中文，translationZh 必须是空字符串。\n返回严格的JSON格式：\n{\n  \"users\": [\n    {\n      \"name\": \"陌生人/同行/粉丝名字\",\n      \"avatarDesc\": \"英文单词描述头像\",\n      \"persona\": \"联系人身份、国家或地区、性格以及为什么联系我\",\n      \"preferredLanguage\": \"主要使用的语言名称\",\n      \"messages\": [\n        { \"type\": \"text\", \"content\": \"第一条中文消息\", \"translationZh\": \"\" },\n        { \"type\": \"text\", \"content\": \"foreign-language message\", \"translationZh\": \"这条外语消息的自然中文翻译\" }\n      ]\n    }\n  ]\n}\n注意：只能返回纯JSON。");
  try {
    const endpoint_2 = window.u2Api.resolveChatCompletionsEndpoint(window.apiConfig.endpoint),
      value_164 = await fetch(endpoint_2, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.apiConfig.apiKey
        },
        body: JSON.stringify({
          model: window.apiConfig.model || "gpt-3.5-turbo",
          messages: [{
            role: "user",
            content: content_2
          }],
          temperature: 0.9,
          response_format: {
            type: "json_object"
          }
        })
      });
    if (!value_164.ok) throw window.u2Api?.createHttpError?.(value_164, await window.u2Api?.readApiError?.(value_164)) || Object.assign(new Error("HTTP " + value_164.status), {
      status: value_164.status
    });
    const data = await value_164.json();
    let resultText = data.choices[0].message.content,
      jsonMatch = resultText.match(/\{[\s\S]*\}/);
    resultText = jsonMatch ? jsonMatch[0] : resultText;
    const parsed = sanitizeObj(JSON.parse(resultText));
    if (parsed.users && Array.isArray(parsed.users)) {
      const isBusiness_3 = value_162 === "business";
      parsed.users.forEach(u => {
        const newSub = {
          id: "gen_user_" + Date.now() + Math.floor(Math.random() * 10000),
          name: u.name,
          handle: u.name.toLowerCase().replace(/\s+/g, ""),
          avatar: "https://picsum.photos/seed/" + (u.avatarDesc ? u.avatarDesc.replace(/\s+/g, "") : Date.now()) + "/80/80?grayscale",
          desc: u.persona || "",
          preferredLanguage: u.preferredLanguage || "",
          isBusiness: isBusiness_3,
          isFriend: false,
          isSubscribed: false,
          dmHistory: (Array.isArray(u.messages) ? u.messages : []).map(m => {
            if (m.type === "offer") return {
              type: "char",
              name: u.name,
              isOffer: true,
              offerData: m.offerData || {
                title: "合作邀请",
                offerType: "video",
                requirement: "详谈",
                price: "￥5000",
                penalty: "￥2000"
              },
              offerStatus: "pending"
            };else {
              const normalizedMessage = normalizeYtGeneratedMessage(m);
              return {
                type: "char",
                name: u.name,
                text: normalizedMessage.text || "你好",
                translationZh: normalizedMessage.translationZh
              };
            }
          })
        };
        newSub.unreadDmCount = Math.max(1, newSub.dmHistory.length);
        mockSubscriptions.unshift(newSub);
      });
      saveYoutubeData();
      updateYtMessageUnreadIndicators();
      renderMessagesList();
      if (window.showToast) window.showToast("收到 " + parsed.users.length + " 位新联系人的消息");
    }
  } catch (e_4) {
    console.error("Generate MSG Error: ", e_4);
    if (window.showToast) window.showToast("无法生成新消息，请重试");
  } finally {
    msgRefreshBtn.style.opacity = "1";
    msgRefreshBtn.style.pointerEvents = "auto";
  }
});
msgFilterDm && msgFilterCommunity && msgFilterBusiness && (msgFilterDm.addEventListener("click", () => {
  msgFilterDm.classList.add("active");
  msgFilterCommunity.classList.remove("active");
  msgFilterBusiness.classList.remove("active");
  currentMsgFilter = "dm";
  renderMessagesList();
}), msgFilterCommunity.addEventListener("click", () => {
  msgFilterCommunity.classList.add("active");
  msgFilterDm.classList.remove("active");
  msgFilterBusiness.classList.remove("active");
  currentMsgFilter = "community";
  renderMessagesList();
}), msgFilterBusiness.addEventListener("click", () => {
  msgFilterBusiness.classList.add("active");
  msgFilterCommunity.classList.remove("active");
  msgFilterDm.classList.remove("active");
  currentMsgFilter = "business";
  renderMessagesList();
}));
function renderMessagesList() {
  if (!msgListContainer) return;
  updateYtMessageUnreadIndicators();
  msgListContainer.innerHTML = "";
  if (currentMsgFilter === "business" || currentMsgFilter === "dm") {
    const isBusiness_2 = currentMsgFilter === "business",
      allTargetSubs = mockSubscriptions.filter(sub_7 => sub_7.isBusiness === isBusiness_2 && (sub_7.isFriend || sub_7.dmHistory && sub_7.dmHistory.length > 0));
    if (allTargetSubs.length === 0) {
      msgListContainer.innerHTML = "\n                    <div style=\"display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 100px; color: #8e8e93;\">\n                        <i class=\"fas " + (isBusiness_2 ? "fa-envelope-open-text" : "fa-comment-dots") + "\" style=\"font-size: 48px; margin-bottom: 16px; color: #d1d1d6;\"></i>\n                        <p style=\"font-size: 15px;\">暂无" + (isBusiness_2 ? "商务" : "私信") + "消息</p>\n                    </div>\n                ";
      return;
    }
    const friends_3 = allTargetSubs.filter(s_3 => s_3.isFriend),
      strangers = allTargetSubs.filter(s => !s.isFriend),
      renderSubList = (items_183, value_184) => {
        if (items_183.length === 0) return "";
        const element_185 = document.createElement("div");
        element_185.innerHTML = "<div style=\"font-size: 14px; font-weight: 600; color: #8e8e93; margin: 16px 4px 8px;\">" + value_184 + " (" + items_183.length + ")</div>";
        const element_186 = document.createElement("div");
        return element_186.style.backgroundColor = "#ffffff", element_186.style.borderRadius = "16px", element_186.style.overflow = "hidden", element_186.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)", items_183.forEach((sub_8, value_188) => {
          const element_189 = document.createElement("div"),
            ytChannelAvatar = resolveYtChannelAvatar(sub_8);
          element_189.style.display = "flex";
          element_189.style.alignItems = "center";
          element_189.style.gap = "15px";
          element_189.style.cursor = "pointer";
          element_189.style.padding = "16px";
          element_189.style.backgroundColor = "#ffffff";
          value_188 < items_183.length - 1 && (element_189.style.borderBottom = "1px solid #f2f2f2");
          const dmHistory_2 = Array.isArray(sub_8.dmHistory) ? sub_8.dmHistory : [],
            lastMsg = dmHistory_2.length > 0 ? dmHistory_2[dmHistory_2.length - 1] : null;
          let lastMsgText = lastMsg?.isOffer ? "[商单邀请]" : lastMsg?.text || "暂无消息",
            text_193 = "刚刚";
          const unreadCount = Math.max(0, Math.round(Number(sub_8.unreadDmCount) || 0)),
            value_195 = sub_8.isBusiness ? "<span style=\"font-size:10px; background:#e8f5e9; color:#388e3c; padding:2px 4px; border-radius:4px; margin-left:4px;\">商务</span>" : "";
          element_189.innerHTML = "\n                        <div style=\"width: 50px; height: 50px; border-radius: 50%; overflow: hidden; flex-shrink: 0; \">\n                            <img src=\"" + ytChannelAvatar + "\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                        </div>\n                        <div style=\"flex: 1; overflow: hidden;\">\n                            <div style=\"display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;\">\n                                <div style=\"font-size: 16px; font-weight: 600; color: #0f0f0f; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;\">" + sub_8.name + " " + value_195 + "</div>\n                                <div style=\"display:flex;align-items:center;gap:7px;flex-shrink:0;\">\n                                    <div style=\"font-size: 12px; color: #8e8e93;\">" + text_193 + "</div>\n                                    " + (unreadCount > 0 ? "<span class=\"yt-message-thread-unread\" aria-label=\"未读消息\"></span>" : "") + "\n                                </div>\n                            </div>\n                            <div style=\"font-size: 13px; color: #606060; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;\">" + lastMsgText + "</div>\n                        </div>\n                    ";
          element_189.addEventListener("click", () => {
            currentSubChannelData = sub_8;
            unreadCount > 0 && (sub_8.unreadDmCount = 0, saveYoutubeData(), updateYtMessageUnreadIndicators(), renderMessagesList());
            openDMChat(currentSubChannelData);
          });
          element_186.appendChild(element_189);
        }), element_185.appendChild(element_186), element_185;
      };
    friends_3.length > 0 && msgListContainer.appendChild(renderSubList(friends_3, "我的好友"));
    strangers.length > 0 && msgListContainer.appendChild(renderSubList(strangers, "消息请求"));
    return;
  }
  let joinedGroups = [];
  channelState.userCommunityChannel?.generatedContent?.fanGroup && joinedGroups.push({
    subData: channelState.userCommunityChannel,
    group: channelState.userCommunityChannel.generatedContent.fanGroup,
    isOwned: true
  });
  mockSubscriptions.forEach(subData_2 => {
    subData_2.generatedContent && subData_2.generatedContent.fanGroup && subData_2.generatedContent.fanGroup.isJoined && joinedGroups.push({
      subData: subData_2,
      group: subData_2.generatedContent.fanGroup
    });
  });
  if (joinedGroups.length === 0) {
    msgListContainer.innerHTML = "\n                <div style=\"display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 100px; color: #8e8e93;\">\n                    <i class=\"fas fa-users\" style=\"font-size: 48px; margin-bottom: 16px; color: #d1d1d6;\"></i>\n                    <p style=\"font-size: 15px;\">你还没有创建或加入任何社群</p>\n                </div>\n            ";
    return;
  }
  const element_175 = document.createElement("div");
  element_175.style.backgroundColor = "#ffffff";
  element_175.style.borderRadius = "16px";
  element_175.style.overflow = "hidden";
  element_175.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
  joinedGroups.forEach((item, value_197) => {
    const el = document.createElement("div");
    el.style.display = "flex";
    el.style.alignItems = "center";
    el.style.gap = "15px";
    el.style.cursor = "pointer";
    el.style.padding = "16px";
    el.style.backgroundColor = "#ffffff";
    value_197 < joinedGroups.length - 1 && (el.style.borderBottom = "1px solid #f2f2f2");
    let text_199 = "\n                <div style=\"width: 50px; height: 50px; border-radius: 50%; background: #f2f2f7; display: flex; justify-content: center; align-items: center; color: #8e8e93; flex-shrink: 0; \">\n                    <i class=\"fas fa-users\" style=\"font-size: 20px;\"></i>\n                </div>\n            ";
    const value_200 = item.group.avatar || resolveYtChannelAvatar(item.subData);
    value_200 && (text_199 = "\n                    <div style=\"width: 50px; height: 50px; border-radius: 50%; overflow: hidden; flex-shrink: 0;  background: transparent;\">\n                        <img src=\"" + value_200 + "\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                    </div>\n                ");
    let lastMsgText_2 = "暂无群消息";
    if (item.subData.groupChatHistory && item.subData.groupChatHistory.length > 0) {
      const lastMsg_2 = item.subData.groupChatHistory[item.subData.groupChatHistory.length - 1];
      lastMsgText_2 = (lastMsg_2.name ? lastMsg_2.name + ": " : "") + (lastMsg_2.text || "");
    }
    el.innerHTML = "\n                " + text_199 + "\n                <div style=\"flex: 1; overflow: hidden;\">\n                    <div style=\"font-size: 16px; font-weight: 600; color: #0f0f0f; margin-bottom: 4px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;\">" + (item.group.name || "粉丝群") + (item.isOwned ? "<span style=\"font-size:10px; color:#fff; background:#0f0f0f; border-radius:6px; padding:2px 5px; margin-left:6px; vertical-align:2px;\">我的</span>" : "") + "</div>\n                    <div style=\"font-size: 13px; color: #606060; display: flex; align-items: center; gap: 6px;\">\n                        <span style=\"white-space: nowrap; text-overflow: ellipsis; overflow: hidden;\">" + lastMsgText_2 + "</span>\n                    </div>\n                </div>\n                <div style=\"color: #ccc;\"><i class=\"fas fa-chevron-right\"></i></div>\n            ";
    el.addEventListener("click", () => {
      currentSubChannelData = item.subData;
      openFanGroupChat(item.group);
    });
    element_175.appendChild(el);
  });
  msgListContainer.appendChild(element_175);
}
function updateNavIndicator(activeItem) {
  if (!activeItem || !navIndicator) return;
  const containerRect = activeItem.parentElement.getBoundingClientRect(),
    itemRect = activeItem.getBoundingClientRect(),
    relativeLeft = itemRect.left - containerRect.left;
  navIndicator.style.width = itemRect.width + "px";
  navIndicator.style.left = relativeLeft + "px";
}
setTimeout(() => {
  const activeNav = document.querySelector(".yt-nav-item.active");
  if (activeNav) updateNavIndicator(activeNav);
}, 100);
const ytCreateSheet = document.getElementById("yt-create-sheet"),
  ytNavPlusBtn = document.getElementById("yt-nav-plus-btn");
if (ytNavPlusBtn && ytCreateSheet) {
  ytNavPlusBtn.addEventListener("click", () => {
    ytCreateSheet.classList.add("active");
  });
  ytCreateSheet.addEventListener("mousedown", event_206 => {
    event_206.target === ytCreateSheet && ytCreateSheet.classList.remove("active");
  });
  const createBtns = ytCreateSheet.querySelectorAll(".yt-create-bubble-btn");
  createBtns.forEach((value_207, idx) => {
    value_207.addEventListener("click", () => {
      ytCreateSheet.classList.remove("active");
      if (idx === 0) {
        const userLiveSetupSheet = document.getElementById("yt-user-live-setup-sheet");
        if (userLiveSetupSheet) userLiveSetupSheet.classList.add("active");
      } else {
        if (idx === 1) {
          if (typeof window.openYtUserPostComposer === "function") window.openYtUserPostComposer();
        } else {
          if (idx === 2) {
            if (typeof window.openYtUserCommunityCreator === "function") window.openYtUserCommunityCreator();
          }
        }
      }
    });
  });
}
navItems.forEach(item_8 => {
  item_8.addEventListener("click", () => {
    if (item_8.classList.contains("yt-nav-item-center")) return;
    navItems.forEach(element_210 => element_210.classList.remove("active"));
    item_8.classList.add("active");
    updateNavIndicator(item_8);
    const targetId = item_8.getAttribute("data-target");
    tabContents.forEach(element_211 => {
      element_211.id === targetId ? (element_211.classList.add("active"), targetId === "yt-messages-tab" && renderMessagesList()) : element_211.classList.remove("active");
    });
  });
});
window.addEventListener("resize", () => {
  const activeNav_2 = document.querySelector(".yt-nav-item.active");
  if (activeNav_2) updateNavIndicator(activeNav_2);
});
function renderSubscriptions() {
  if (!subsList) return;
  subsList.innerHTML = "";
  document.querySelector(".yt-subscriptions-wrapper").style.display = "flex";
  if (!hasSubscriptions || mockSubscriptions.length === 0) {
    const element_214 = document.createElement("div");
    element_214.className = "yt-sub-item";
    element_214.innerHTML = "\n                <div class=\"yt-sub-avatar\">\n                    <i class=\"fas fa-user\"></i>\n                </div>\n                <span class=\"yt-sub-name\">暂无订阅</span>\n            ";
    subsList.appendChild(element_214);
    return;
  }
  const realSubscriptions = mockSubscriptions.filter(s_4 => s_4.isSubscribed !== false);
  if (realSubscriptions.length === 0 && mockSubscriptions.length > 0) {
    const element_216 = document.createElement("div");
    element_216.className = "yt-sub-item";
    element_216.innerHTML = "\n                <div class=\"yt-sub-avatar\">\n                    <i class=\"fas fa-user\"></i>\n                </div>\n                <span class=\"yt-sub-name\">暂无订阅</span>\n            ";
    subsList.appendChild(element_216);
  } else realSubscriptions.forEach(sub_9 => {
    const el_2 = document.createElement("div"),
      ytChannelAvatar_219 = resolveYtChannelAvatar(sub_9);
    el_2.className = "yt-sub-item " + (sub_9.isLive ? "has-live" : "");
    el_2.innerHTML = "\n                    <div class=\"yt-sub-avatar\">\n                        <img src=\"" + ytChannelAvatar_219 + "\" alt=\"" + sub_9.name + "\">\n                    </div>\n                    <span class=\"yt-sub-name\">" + sub_9.name + "</span>\n                ";
    el_2.addEventListener("click", e_5 => {
      e_5.stopPropagation();
      if (sub_9.id === "user_channel_id") {
        const userProfileTab = document.querySelector(".yt-nav-item[data-target=\"yt-profile-tab\"]");
        if (userProfileTab) userProfileTab.click();
      } else {
        if (window.openSubChannelView) window.openSubChannelView(sub_9);
      }
    });
    subsList.appendChild(el_2);
  });
  const allBtn = document.querySelector(".yt-sub-all-btn"),
    allSubsSheet = document.getElementById("yt-all-subs-sheet");
  allBtn && allSubsSheet && (allBtn.onclick = () => {
    const ytAllSubsListElement = document.getElementById("yt-all-subs-list");
    ytAllSubsListElement.innerHTML = "";
    const visibleSubscriptions = mockSubscriptions.filter(sub_10 => {
      if (!sub_10) return false;
      return sub_10.isSubscribed !== false || !!resolveYtExplicitImChar(sub_10);
    });
    visibleSubscriptions.length === 0 && (ytAllSubsListElement.innerHTML = "\n                        <div style=\"display:flex; flex-direction:column; align-items:center; padding:44px 16px; color:#8e8e93; text-align:center;\">\n                            <i class=\"fas fa-user-plus\" style=\"font-size:36px; color:#d1d1d6; margin-bottom:12px;\"></i>\n                            <div style=\"font-size:14px;\">暂无 Char 或已订阅频道</div>\n                        </div>\n                    ");
    visibleSubscriptions.forEach(sub_11 => {
      const item_9 = document.createElement("div"),
        ytChannelAvatar_225 = resolveYtChannelAvatar(sub_11);
      item_9.className = "account-card";
      item_9.innerHTML = "\n                        <div class=\"account-content\" style=\"cursor:pointer;\">\n                            <div class=\"account-avatar\"><img src=\"" + ytChannelAvatar_225 + "\" style=\"width:100%;height:100%;object-fit:cover;border-radius:50%;\"></div>\n                            <div class=\"account-info\">\n                                <div class=\"account-name\">" + sub_11.name + "</div>\n                                <div class=\"account-detail\">" + (sub_11.subs || "0") + " 订阅者</div>\n                            </div>\n                        </div>\n                    ";
      item_9.addEventListener("click", () => {
        allSubsSheet.classList.remove("active");
        openSubChannelView(sub_11);
      });
      ytAllSubsListElement.appendChild(item_9);
    });
    allSubsSheet.classList.add("active");
  }, allSubsSheet.addEventListener("mousedown", e_6 => {
    if (e_6.target === allSubsSheet) allSubsSheet.classList.remove("active");
  }));
}
let currentFilter = "全部";
filterBubbles.forEach(bubble => {
  bubble.addEventListener("click", () => {
    filterBubbles.forEach(b => b.classList.remove("active"));
    bubble.classList.add("active");
    currentFilter = bubble.textContent;
    renderVideos();
  });
});
function renderVideos() {
  if (!liveSection || !emptyState) return;
  liveSection.innerHTML = "";
  let filteredVideos = mockVideos;
  currentFilter === "正在直播" && (filteredVideos = mockVideos.filter(v_2 => v_2.isLive));
  if (filteredVideos.length === 0) {
    liveSection.style.display = "none";
    emptyState.style.display = "flex";
    emptyState.querySelector("p").textContent = "暂无符合条件的视频";
    return;
  }
  liveSection.style.display = "flex";
  emptyState.style.display = "none";
  const realFilteredVideos = filteredVideos.filter(v => v.channelData && v.channelData.isSubscribed !== false);
  if (realFilteredVideos.length === 0) {
    liveSection.style.display = "none";
    emptyState.style.display = "flex";
    emptyState.querySelector("p").textContent = "暂无符合条件的视频";
    return;
  }
  realFilteredVideos.forEach(video_3 => {
    const channel_8 = video_3.channelData,
      ytChannelAvatar_232 = resolveYtChannelAvatar(channel_8),
      value_233 = video_3.isLive ? "<div class=\"yt-live-badge\"><i class=\"fas fa-broadcast-tower\" style=\"font-size: 10px;\"></i> LIVE</div>" : "",
      el_3 = document.createElement("div");
    el_3.className = "yt-video-card";
    el_3.innerHTML = "\n                <div class=\"yt-video-thumbnail\">\n                    <img src=\"" + (video_3.thumbnail || "https://picsum.photos/320/180?grayscale") + "\" alt=\"Thumbnail\">\n                    " + value_233 + "\n                </div>\n                <div class=\"yt-video-info\">\n                    <div class=\"yt-video-avatar\" style=\"cursor: pointer; border: 1px solid #e5e5e5; transition: transform 0.2s;\">\n                        <img src=\"" + ytChannelAvatar_232 + "\" alt=\"" + channel_8.name + "\">\n                    </div>\n                    <div class=\"yt-video-details\">\n                        <h3 class=\"yt-video-title\">" + escapeYtCoreHtml(video_3.title || "无标题") + "</h3>\n                        " + (video_3.titleTranslationZh ? "<div class=\"yt-video-title-translation\">" + escapeYtCoreHtml(video_3.titleTranslationZh) + "</div>" : "") + "\n                        <p class=\"yt-video-meta\">" + escapeYtCoreHtml(channel_8.name) + " • " + escapeYtCoreHtml(video_3.views || "0") + " • " + escapeYtCoreHtml(video_3.time || "刚刚") + "</p>\n                    </div>\n                </div>\n            ";
    el_3.addEventListener("click", () => {
      if (channel_8.id === "user_channel_id") {
        if (video_3.isLive) {
          if (typeof window.openYtUserLiveView === "function") window.openYtUserLiveView();else {
            const userLiveView = document.getElementById("yt-user-live-view");
            if (userLiveView) userLiveView.classList.add("active");
          }
        } else {
          const userProfileTab_2 = document.querySelector(".yt-nav-item[data-target=\"yt-profile-tab\"]");
          if (userProfileTab_2) userProfileTab_2.click();
        }
      } else openVideoPlayer(video_3);
    });
    const avatarBtn = el_3.querySelector(".yt-video-avatar");
    avatarBtn.addEventListener("click", event_235 => {
      event_235.stopPropagation();
      if (channel_8.id === "user_channel_id") {
        const ytNavItemDataTargetYtProfileTabElement_236 = document.querySelector(".yt-nav-item[data-target=\"yt-profile-tab\"]");
        if (ytNavItemDataTargetYtProfileTabElement_236) ytNavItemDataTargetYtProfileTabElement_236.click();
      } else openSubChannelView(channel_8);
    });
    liveSection.appendChild(el_3);
  });
}
function syncYtProfile() {
  const dataCenterBtn = document.getElementById("yt-data-center-btn"),
    dataCenterSheet = document.getElementById("yt-data-center-sheet");
  dataCenterBtn && dataCenterSheet && !dataCenterBtn.dataset.bound && (dataCenterBtn.dataset.bound = "true", dataCenterBtn.addEventListener("click", e_7 => {
    e_7.stopPropagation();
    if (window.renderDataCenter) window.renderDataCenter();
    dataCenterSheet.classList.add("active");
  }));
  const effectiveYtUser_2 = typeof window.getYtEffectiveUserState === "function" ? window.getYtEffectiveUserState() : ytUserState;
  if (effectiveYtUser_2) {
    ytUserState = effectiveYtUser_2;
    const textContent_2 = effectiveYtUser_2.name || "User";
    if (profileName) profileName.textContent = textContent_2;
    const handleStr = effectiveYtUser_2.handle || textContent_2.toLowerCase().replace(/\s+/g, "");
    if (profileHandle) profileHandle.textContent = "@" + handleStr;
    if (effectiveYtUser_2.avatarUrl) {
      profileAvatarImg && (profileAvatarImg.src = effectiveYtUser_2.avatarUrl, profileAvatarImg.style.display = "block");
      if (profileAvatarIcon) profileAvatarIcon.style.display = "none";
    } else {
      if (profileAvatarImg) profileAvatarImg.style.display = "none";
      if (profileAvatarIcon) profileAvatarIcon.style.display = "block";
    }
    if (channelState.bannerUrl && profileHeaderBg) profileHeaderBg.style.backgroundImage = "url('" + channelState.bannerUrl + "')";else profileHeaderBg && (profileHeaderBg.style.backgroundImage = "none");
    profileSubs && (profileSubs.textContent = (effectiveYtUser_2.subs || "0") + " 订阅者");
    profileVideos && (profileVideos.textContent = (effectiveYtUser_2.videos || "0") + " 视频");
  }
}
editChannelBtn && editChannelSheet && editChannelBtn.addEventListener("click", () => {
  const effectiveYtUser_3 = typeof window.getYtEffectiveUserState === "function" ? window.getYtEffectiveUserState() : ytUserState;
  if (!effectiveYtUser_3) return;
  ytUserState = effectiveYtUser_3;
  const value_25 = effectiveYtUser_3.name || "",
    value_26 = effectiveYtUser_3.handle || value_25.toLowerCase().replace(/\s+/g, "");
  if (editNameInput) editNameInput.value = value_25;
  if (editHandleInput) editHandleInput.value = value_26;
  if (editUrlInput) editUrlInput.value = channelState.url || "youtube.com/@" + value_26;
  if (editSubsInput) editSubsInput.value = effectiveYtUser_3.subs || "";
  if (editVideosInput) editVideosInput.value = effectiveYtUser_3.videos || "";
  if (editPersonaInput) editPersonaInput.value = effectiveYtUser_3.persona || "";
  if (effectiveYtUser_3.avatarUrl && editAvatarImg) {
    editAvatarImg.src = effectiveYtUser_3.avatarUrl;
    editAvatarImg.style.display = "block";
    if (editAvatarIcon) editAvatarIcon.style.display = "none";
  } else {
    if (editAvatarImg) editAvatarImg.style.display = "none";
    if (editAvatarIcon) editAvatarIcon.style.display = "block";
  }
  if (channelState.bannerUrl && editBannerImg) {
    editBannerImg.src = channelState.bannerUrl;
    editBannerImg.style.display = "block";
  } else {
    if (editBannerImg) editBannerImg.style.display = "none";
  }
  editChannelSheet.classList.add("active");
});
editHandleInput && editUrlInput && editHandleInput.addEventListener("input", e_8 => {
  const val = e_8.target.value.replace(/^@/, "");
  editUrlInput.value = val ? "youtube.com/@" + val : "youtube.com/@";
});
editBannerBtn && bannerUpload && (editBannerBtn.addEventListener("click", () => bannerUpload.click()), bannerUpload.addEventListener("change", event_246 => {
  const value_247 = event_246.target.files[0];
  if (value_247) {
    const value_248 = new FileReader();
    value_248.onload = event_249 => {
      window.compressImage ? window.compressImage(event_249.target.result, 800, 800, src_3 => {
        editBannerImg && (editBannerImg.src = src_3, editBannerImg.style.display = "block");
      }) : editBannerImg && (editBannerImg.src = event_249.target.result, editBannerImg.style.display = "block");
    };
    value_248.readAsDataURL(value_247);
  }
}));
editAvatarWrapper && avatarUpload && (editAvatarWrapper.addEventListener("click", event_251 => {
  event_251.target.tagName !== "INPUT" && (event_251.preventDefault(), avatarUpload.click());
}), avatarUpload.addEventListener("change", event_252 => {
  const value_253 = event_252.target.files[0];
  if (value_253) {
    const value_254 = new FileReader();
    value_254.onload = event_255 => {
      if (window.compressImage) window.compressImage(event_255.target.result, 300, 300, src_4 => {
        editAvatarImg && (editAvatarImg.src = src_4, editAvatarImg.style.display = "block");
        if (editAvatarIcon) editAvatarIcon.style.display = "none";
      });else {
        editAvatarImg && (editAvatarImg.src = event_255.target.result, editAvatarImg.style.display = "block");
        if (editAvatarIcon) editAvatarIcon.style.display = "none";
      }
    };
    value_254.readAsDataURL(value_253);
  }
}));
confirmEditBtn && confirmEditBtn.addEventListener("click", () => {
  if (typeof window.ensureYtUserState === "function") ytUserState = window.ensureYtUserState();else !ytUserState && (ytUserState = {});
  if (editNameInput) ytUserState.name = editNameInput.value.trim();
  if (editHandleInput) ytUserState.handle = editHandleInput.value.trim().replace(/^@/, "");
  if (editSubsInput) ytUserState.subs = editSubsInput.value.trim();
  if (editVideosInput) ytUserState.videos = editVideosInput.value.trim();
  if (editPersonaInput) ytUserState.persona = editPersonaInput.value.trim();
  if (editDescInput) ytUserState.desc = editDescInput.value.trim();
  editAvatarImg && editAvatarImg.style.display === "block" && editAvatarImg.src && (ytUserState.avatarUrl = editAvatarImg.src);
  editBannerImg && editBannerImg.style.display === "block" && editBannerImg.src && (channelState.bannerUrl = editBannerImg.src);
  if (editUrlInput) channelState.url = editUrlInput.value.trim();
  syncYtProfile();
  if (editChannelSheet) editChannelSheet.classList.remove("active");
  saveYoutubeData();
  if (window.showToast) window.showToast("频道信息已保存");
  renderVideos();
});
editChannelSheet && editChannelSheet.addEventListener("mousedown", event_257 => {
  event_257.target === editChannelSheet && editChannelSheet.classList.remove("active");
});
function refreshYoutubeUiAfterHydration() {
  updateYtMessageUnreadIndicators();
  if (!ytView || !ytView.classList.contains("active")) return;
  syncYtProfile();
  renderSubscriptions();
  renderVideos();
  const ytNavItemActiveElement_258 = document.querySelector(".yt-nav-item.active");
  ytNavItemActiveElement_258?.getAttribute("data-target") === "yt-messages-tab" && renderMessagesList();
}
window.globalDataReadyPromise && typeof window.globalDataReadyPromise.then === "function" ? window.youtubeDataReadyPromise = window.globalDataReadyPromise.then(() => {
  return loadYoutubeData(), refreshYoutubeUiAfterHydration(), true;
})["catch"](error_2 => {
  return console.warn("YouTube global data recovery failed:", error_2), false;
}) : window.youtubeDataReadyPromise = Promise.resolve(true);
