const YT_DEFAULT_USER_AVATAR_URL = window.U2_DEFAULT_USER_AVATAR_URL || "assets/default-user-avatar.jpg";
let mockVideos = [],
  currentChatHistory = [],
  mockSubscriptions = [],
  hasSubscriptions = false,
  ytUserState = null,
  currentSummaryFilter = "全部";
function sanitizeObj(scopeValue128) {
  if (typeof scopeValue128 === "string") {
    let scopeValue129 = scopeValue128.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "");
    return scopeValue129 = scopeValue129.replace(/[.。]+$/g, ""), scopeValue129.trim();
  } else {
    if (Array.isArray(scopeValue128)) return scopeValue128.map(scopeValue130 => sanitizeObj(scopeValue130));else {
      if (scopeValue128 !== null && typeof scopeValue128 === "object") {
        const scopeValue131 = {};
        for (let scopeValue132 in scopeValue128) {
          scopeValue131[scopeValue132] = sanitizeObj(scopeValue128[scopeValue132]);
        }
        return scopeValue131;
      }
    }
  }
  return scopeValue128;
}
function normalizeYtGeneratedMessage(scopeValue133) {
  if (typeof scopeValue133 === "string") return {
    text: scopeValue133.trim(),
    translationZh: ""
  };
  if (!scopeValue133 || typeof scopeValue133 !== "object") return {
    text: "",
    translationZh: ""
  };
  return {
    text: String(scopeValue133.text ?? scopeValue133.content ?? scopeValue133.message ?? "").trim(),
    translationZh: String(scopeValue133.translationZh ?? scopeValue133.translation ?? "").trim()
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
function normalizeYoutubeState(scopeValue134) {
  const scopeValue135 = scopeValue134 && typeof scopeValue134 === "object" ? scopeValue134 : {};
  return {
    channelState: normalizeYtChannelState(scopeValue135.channelState),
    subscriptions: normalizeYtSubscriptions(scopeValue135.subscriptions),
    userState: scopeValue135.userState ? normalizeYtUserState(scopeValue135.userState) : null
  };
}
let channelState = createDefaultYtChannelState();
function normalizeYtAdminSnapshots(scopeValue136) {
  if (!Array.isArray(scopeValue136)) return [];
  const scopeValue137 = new Set();
  return scopeValue136.map(scopeValue138 => {
    if (!scopeValue138 || typeof scopeValue138 !== "object") return null;
    const scopeValue139 = scopeValue138.charId ?? scopeValue138.id;
    if (scopeValue139 === undefined || scopeValue139 === null || scopeValue139 === "") return null;
    const scopeValue140 = String(scopeValue139);
    if (scopeValue137.has(scopeValue140)) return null;
    return scopeValue137.add(scopeValue140), {
      charId: scopeValue139,
      name: String(scopeValue138.name || scopeValue138.nickname || scopeValue138.realName || "管理员"),
      avatarUrl: scopeValue138.avatarUrl || scopeValue138.avatar || "",
      persona: String(scopeValue138.persona || "")
    };
  }).filter(Boolean);
}
function normalizeYtFanGroup(scopeValue141 = {}) {
  const scopeValue142 = scopeValue141 && typeof scopeValue141 === "object" ? scopeValue141 : {};
  return {
    ...scopeValue142,
    admins: normalizeYtAdminSnapshots(scopeValue142.admins)
  };
}
function ensureYtFixedCharFanGroup(scopeValue143) {
  if (!scopeValue143 || typeof scopeValue143 !== "object" || scopeValue143.id === "user_channel_id" || scopeValue143.isUserOwnedCommunity || scopeValue143.isBusiness) return scopeValue143;
  (!scopeValue143.generatedContent || typeof scopeValue143.generatedContent !== "object") && (scopeValue143.generatedContent = {
    currentLive: null,
    pastVideos: [],
    communityPosts: []
  });
  const scopeValue144 = scopeValue143.generatedContent.fanGroup && typeof scopeValue143.generatedContent.fanGroup === "object" ? scopeValue143.generatedContent.fanGroup : {},
    scopeValue145 = scopeValue144.memberCountSource !== "frontend" || !Number.isFinite(Number(scopeValue144.memberCount));
  scopeValue143.generatedContent.fanGroup = {
    ...scopeValue144,
    id: scopeValue144.id || "yt_fan_group_" + (scopeValue143.id || Date.now()),
    name: (String(scopeValue143.name || "Char").trim() || "Char") + "的粉丝群",
    nameTranslationZh: "",
    memberCount: scopeValue145 ? Math.floor(Math.random() * 49501) + 500 : Math.max(500, Math.min(50000, Math.round(Number(scopeValue144.memberCount)))),
    memberCountSource: "frontend",
    _memberCountMigrationPending: scopeValue144._memberCountMigrationPending === true || scopeValue145,
    admins: normalizeYtAdminSnapshots(scopeValue144.admins),
    isJoined: scopeValue144.isJoined === true,
    isOwned: false
  };
  if (!Array.isArray(scopeValue143.generatedContent.pastVideos)) scopeValue143.generatedContent.pastVideos = [];
  if (!Array.isArray(scopeValue143.generatedContent.communityPosts)) scopeValue143.generatedContent.communityPosts = [];
  return scopeValue143;
}
function normalizeYtUserCommunityChannel(scopeValue146) {
  if (!scopeValue146 || typeof scopeValue146 !== "object") return null;
  const scopeValue147 = scopeValue146.generatedContent && typeof scopeValue146.generatedContent === "object" ? scopeValue146.generatedContent : {},
    scopeValue148 = scopeValue147.fanGroup && typeof scopeValue147.fanGroup === "object" ? scopeValue147.fanGroup : {},
    scopeValue149 = Math.max(1, Math.round(Number(scopeValue148.memberCount) || 1));
  return {
    ...scopeValue146,
    id: scopeValue146.id || "user_community_channel",
    name: String(scopeValue146.name || "我的频道"),
    avatar: scopeValue146.avatar || "",
    isUserOwnedCommunity: true,
    isBusiness: false,
    groupChatHistory: Array.isArray(scopeValue146.groupChatHistory) ? scopeValue146.groupChatHistory.filter(Boolean) : [],
    dmHistory: Array.isArray(scopeValue146.dmHistory) ? scopeValue146.dmHistory.filter(Boolean) : [],
    generatedContent: {
      ...scopeValue147,
      fanGroup: {
        ...normalizeYtFanGroup(scopeValue148),
        id: scopeValue148.id || "user_fan_group",
        name: String(scopeValue148.name || "我的社群"),
        memberCount: scopeValue149,
        isJoined: true,
        isOwned: true,
        lastGrowthLiveId: scopeValue148.lastGrowthLiveId || null
      }
    }
  };
}
function compressImage(scopeValue150, scopeValue151, scopeValue152, scopeValue153) {
  const scopeValue154 = new Image();
  scopeValue154.onload = function () {
    let scopeValue155 = scopeValue154.width,
      scopeValue156 = scopeValue154.height,
      scopeValue157 = false;
    scopeValue155 > scopeValue151 && (scopeValue156 = Math.round(scopeValue156 * scopeValue151 / scopeValue155), scopeValue155 = scopeValue151, scopeValue157 = true);
    scopeValue156 > scopeValue152 && (scopeValue155 = Math.round(scopeValue155 * scopeValue152 / scopeValue156), scopeValue156 = scopeValue152, scopeValue157 = true);
    if (!scopeValue157) {
      const scopeValue161 = document.createElement("canvas");
      scopeValue161.width = scopeValue154.width;
      scopeValue161.height = scopeValue154.height;
      const scopeValue162 = scopeValue161.getContext("2d");
      scopeValue162.drawImage(scopeValue154, 0, 0, scopeValue154.width, scopeValue154.height);
      scopeValue153(scopeValue161.toDataURL("image/jpeg", 0.8));
      return;
    }
    const scopeValue158 = document.createElement("canvas");
    scopeValue158.width = scopeValue155;
    scopeValue158.height = scopeValue156;
    const scopeValue159 = scopeValue158.getContext("2d");
    scopeValue159.drawImage(scopeValue154, 0, 0, scopeValue155, scopeValue156);
    const scopeValue160 = scopeValue158.toDataURL("image/jpeg", 0.8);
    scopeValue153(scopeValue160);
  };
  scopeValue154.src = scopeValue150;
}
window.compressImage = window.compressImage || compressImage;
function parseSubs(scopeValue163) {
  if (!scopeValue163) return 0;
  let scopeValue164 = String(scopeValue163).replace(/,/g, "").trim(),
    scopeValue165 = 1;
  if (scopeValue164.includes("亿")) {
    scopeValue165 = 100000000;
    scopeValue164 = scopeValue164.replace("亿", "");
  } else {
    if (scopeValue164.includes("万")) {
      scopeValue165 = 10000;
      scopeValue164 = scopeValue164.replace("万", "");
    } else {
      if (scopeValue164.toUpperCase().includes("K")) {
        scopeValue165 = 1000;
        scopeValue164 = scopeValue164.toUpperCase().replace("K", "");
      } else scopeValue164.toUpperCase().includes("M") && (scopeValue165 = 1000000, scopeValue164 = scopeValue164.toUpperCase().replace("M", ""));
    }
  }
  let scopeValue166 = parseFloat(scopeValue164);
  if (isNaN(scopeValue166)) return 0;
  return Math.floor(scopeValue166 * scopeValue165);
}
function formatSubs(scopeValue167) {
  if (scopeValue167 >= 100000000) return (scopeValue167 / 100000000).toFixed(1).replace(/\.0$/, "") + "亿";else return scopeValue167 >= 10000 ? (scopeValue167 / 10000).toFixed(1).replace(/\.0$/, "") + "万" : scopeValue167.toString();
}
function getPreferredAppleIdUser() {
  const scopeValue168 = typeof window.getAccounts === "function" ? window.getAccounts() : [],
    scopeValue169 = typeof window.getCurrentAccountId === "function" ? window.getCurrentAccountId() : null,
    scopeValue170 = scopeValue168.find(scopeValue172 => String(scopeValue172.id) === String(scopeValue169)) || null,
    scopeValue171 = window.userState || {};
  if (scopeValue170) {
    const scopeValue173 = scopeValue170.name || scopeValue171.name || scopeValue171.realName || "User";
    return {
      name: scopeValue173,
      handle: scopeValue170.handle || scopeValue171.handle || (scopeValue173 ? scopeValue173.toLowerCase().replace(/\s+/g, "") : "user"),
      avatarUrl: scopeValue170.avatarUrl || scopeValue171.avatarUrl || scopeValue171.avatar || YT_DEFAULT_USER_AVATAR_URL,
      persona: scopeValue170.persona || scopeValue170.signature || scopeValue171.persona || "",
      subs: scopeValue171.subs || "0",
      videos: scopeValue171.videos || "0"
    };
  }
  return {
    name: scopeValue171.name || scopeValue171.realName || "User",
    handle: scopeValue171.handle || (scopeValue171.name ? scopeValue171.name.toLowerCase().replace(/\s+/g, "") : "user"),
    avatarUrl: scopeValue171.avatarUrl || scopeValue171.avatar || YT_DEFAULT_USER_AVATAR_URL,
    persona: scopeValue171.persona || "",
    subs: scopeValue171.subs || "0",
    videos: scopeValue171.videos || "0"
  };
}
function createYtUserStateFromAppleId() {
  const scopeValue174 = getPreferredAppleIdUser();
  return {
    name: scopeValue174.name || "User",
    handle: scopeValue174.handle || (scopeValue174.name ? scopeValue174.name.toLowerCase().replace(/\s+/g, "") : "user"),
    avatarUrl: scopeValue174.avatarUrl || YT_DEFAULT_USER_AVATAR_URL,
    persona: scopeValue174.persona || "",
    subs: scopeValue174.subs || "0",
    videos: scopeValue174.videos || "0"
  };
}
function normalizeYtUserState(scopeValue175) {
  const scopeValue176 = createYtUserStateFromAppleId(),
    scopeValue177 = scopeValue175 && typeof scopeValue175 === "object" ? scopeValue175 : {},
    scopeValue178 = scopeValue177.name || scopeValue177.realName || scopeValue176.name || "User";
  return {
    name: scopeValue178,
    handle: (scopeValue177.handle || (scopeValue178 ? scopeValue178.toLowerCase().replace(/\s+/g, "") : scopeValue176.handle || "user")).replace(/^@/, ""),
    avatarUrl: scopeValue177.avatarUrl || scopeValue177.avatar || scopeValue176.avatarUrl || YT_DEFAULT_USER_AVATAR_URL,
    persona: scopeValue177.persona || scopeValue176.persona || "",
    subs: scopeValue177.subs || scopeValue176.subs || "0",
    videos: scopeValue177.videos || scopeValue176.videos || "0"
  };
}
function normalizeYtChannelState(scopeValue179) {
  const scopeValue180 = createDefaultYtChannelState(),
    scopeValue181 = scopeValue179 && typeof scopeValue179 === "object" ? scopeValue179 : {},
    scopeValue182 = scopeValue181.dataCenter && typeof scopeValue181.dataCenter === "object" ? scopeValue181.dataCenter : {};
  return {
    ...scopeValue180,
    ...scopeValue181,
    boundWorldBookIds: Array.isArray(scopeValue181.boundWorldBookIds) ? scopeValue181.boundWorldBookIds.filter(Boolean) : [],
    liveSummaries: Array.isArray(scopeValue181.liveSummaries) ? scopeValue181.liveSummaries.filter(scopeValue183 => scopeValue183 && typeof scopeValue183 === "object") : [],
    groupChatHistory: Array.isArray(scopeValue181.groupChatHistory) ? scopeValue181.groupChatHistory.filter(scopeValue184 => scopeValue184 && typeof scopeValue184 === "object") : [],
    activeUserLive: scopeValue181.activeUserLive && typeof scopeValue181.activeUserLive === "object" ? scopeValue181.activeUserLive : null,
    pastVideos: Array.isArray(scopeValue181.pastVideos) ? scopeValue181.pastVideos.filter(scopeValue185 => scopeValue185 && typeof scopeValue185 === "object") : [],
    communityPosts: Array.isArray(scopeValue181.communityPosts) ? scopeValue181.communityPosts.filter(scopeValue186 => scopeValue186 && typeof scopeValue186 === "object") : [],
    dataCenter: {
      views: Math.max(0, Number(scopeValue182.views) || 0),
      sc: Math.max(0, Number(scopeValue182.sc) || 0),
      subs: Math.max(0, Number(scopeValue182.subs) || 0),
      commission: Number(scopeValue182.commission) || 0,
      receivedGifts: Array.isArray(scopeValue182.receivedGifts) ? scopeValue182.receivedGifts.filter(scopeValue187 => scopeValue187 && typeof scopeValue187 === "object").slice(0, 100) : []
    },
    userCommunityChannel: normalizeYtUserCommunityChannel(scopeValue181.userCommunityChannel)
  };
}
function getYtImChars() {
  const scopeValue188 = typeof window.getImFriends === "function" ? window.getImFriends() : window.imData && Array.isArray(window.imData.friends) ? window.imData.friends : [];
  return (Array.isArray(scopeValue188) ? scopeValue188 : []).filter(scopeValue189 => scopeValue189 && scopeValue189.type === "char");
}
function normalizeYtLookupText(scopeValue190) {
  return String(scopeValue190 || "").trim().toLowerCase();
}
function resolveYtLinkedImChar(scopeValue191) {
  if (!scopeValue191 || typeof scopeValue191 !== "object") return null;
  const scopeValue192 = getYtImChars();
  if (scopeValue192.length === 0) return null;
  if (scopeValue191.imCharId !== undefined && scopeValue191.imCharId !== null && scopeValue191.imCharId !== "") {
    const scopeValue194 = scopeValue192.find(scopeValue195 => String(scopeValue195.id) === String(scopeValue191.imCharId));
    if (scopeValue194) return scopeValue194;
  }
  const scopeValue193 = [scopeValue191.name, scopeValue191.nickname, scopeValue191.realName, scopeValue191.handle].map(normalizeYtLookupText).filter(Boolean);
  return scopeValue192.find(scopeValue196 => {
    const scopeValue197 = [scopeValue196.nickname, scopeValue196.realName, scopeValue196.name].map(normalizeYtLookupText).filter(Boolean);
    return scopeValue197.some(scopeValue198 => scopeValue193.includes(scopeValue198));
  }) || null;
}
function resolveYtExplicitImChar(scopeValue199) {
  if (!scopeValue199 || typeof scopeValue199 !== "object") return null;
  if (scopeValue199.imCharId === undefined || scopeValue199.imCharId === null || scopeValue199.imCharId === "") return null;
  return getYtImChars().find(scopeValue200 => String(scopeValue200.id) === String(scopeValue199.imCharId)) || null;
}
function normalizeYtChatLanguage(scopeValue201) {
  if (window.imDataUtils && typeof window.imDataUtils.normalizeChatLanguage === "function") return window.imDataUtils.normalizeChatLanguage(scopeValue201);
  const scopeValue202 = String(scopeValue201 || "").trim().toLowerCase();
  if (!scopeValue202 || ["zh", "cn", "zh-cn"].includes(scopeValue202)) return "zh";
  if (["ko", "kr"].includes(scopeValue202)) return "ko";
  if (["ja", "jp"].includes(scopeValue202)) return "ja";
  if (scopeValue202 === "en") return "en";
  if (scopeValue202 === "fr") return "fr";
  return scopeValue202;
}
function escapeYtCoreHtml(scopeValue203) {
  return String(scopeValue203 ?? "").replace(/[&<>"']/g, scopeValue204 => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[scopeValue204]);
}
function getYtChatLanguageName(scopeValue205) {
  if (window.imDataUtils && typeof window.imDataUtils.getChatLanguageName === "function") return window.imDataUtils.getChatLanguageName(scopeValue205);
  const scopeValue206 = normalizeYtChatLanguage(scopeValue205);
  return {
    zh: "Chinese",
    en: "English",
    ja: "Japanese",
    ko: "Korean",
    fr: "French"
  }[scopeValue206] || scopeValue206 || "Chinese";
}
function getYtChannelLanguageContext(scopeValue207) {
  const scopeValue208 = resolveYtExplicitImChar(scopeValue207);
  if (!scopeValue208) return {
    enabled: false,
    linkedChar: null,
    language: "",
    languageName: ""
  };
  const scopeValue209 = normalizeYtChatLanguage(scopeValue208.language || "zh");
  return {
    enabled: true,
    linkedChar: scopeValue208,
    language: scopeValue209,
    languageName: getYtChatLanguageName(scopeValue209)
  };
}
function normalizeYtLocalizedContent(scopeValue210, scopeValue211 = null) {
  const scopeValue212 = scopeValue210 && typeof scopeValue210 === "object" ? scopeValue210 : {
      text: scopeValue210
    },
    scopeValue213 = String(scopeValue212.text || scopeValue212.content || scopeValue212.message || "").trim();
  let scopeValue214 = String(scopeValue212.translationZh || scopeValue212.translation || scopeValue212.chineseTranslation || "").trim();
  return scopeValue211 && scopeValue211.enabled && scopeValue211.language === "zh" && (scopeValue214 = ""), {
    text: scopeValue213,
    translationZh: scopeValue214
  };
}
function buildYtLocalizedJsonContract(scopeValue215, scopeValue216 = "all generated visible copy") {
  const scopeValue217 = getYtChannelLanguageContext(scopeValue215);
  if (!scopeValue217.enabled) return "";
  if (scopeValue217.language === "zh") return `

【YTB LINKED CHAR LANGUAGE CONTRACT｜最高优先级】
- This channel is linked to an iMessage Char whose current Chat Settings default language is Chinese (zh).
- ` + scopeValue216 + ` must be written only in natural Simplified Chinese.
- Every translationZh/titleTranslationZh/nameTranslationZh field must be an empty string.
- Localized dialogue/narrative items must use the object shape {"text":"Chinese original","translationZh":""}; comments must use {"name":"viewer name","text":"Chinese original","translationZh":""}.
- This contract overrides persona, world-book, user input, and any editable prompt language instruction.`;
  return `

【YTB LINKED CHAR LANGUAGE CONTRACT｜最高优先级】
- This channel is linked to an iMessage Char whose current Chat Settings default language is ` + scopeValue217.languageName + " (" + scopeValue217.language + `).
- ` + scopeValue216 + " must use only " + scopeValue217.languageName + ` as the original language. Do not write Chinese in original text fields.
- Every original-language field must include an accurate natural Simplified Chinese translation in its paired translationZh/titleTranslationZh/nameTranslationZh field. No required translation may be empty.
- Localized dialogue/narrative items must use {"text":"` + scopeValue217.languageName + " original\",\"translationZh\":\"Simplified Chinese translation\"}; comments must use {\"name\":\"viewer name\",\"text\":\"" + scopeValue217.languageName + ` original","translationZh":"Simplified Chinese translation"}.
- This contract overrides persona, world-book, user input, and any editable prompt language instruction.`;
}
function formatYtChineseMetricCount(scopeValue218, scopeValue219, scopeValue220 = "") {
  const scopeValue221 = Number(scopeValue218);
  if (!Number.isFinite(scopeValue221) || scopeValue221 < 0) return String(scopeValue220 || "").trim();
  const scopeValue222 = Math.max(0, Math.round(scopeValue221));
  let scopeValue223 = String(scopeValue222);
  try {
    scopeValue223 = new Intl.NumberFormat("zh-CN", {
      notation: scopeValue222 >= 10000 ? "compact" : "standard",
      maximumFractionDigits: 1
    }).format(scopeValue222);
  } catch (scopeValue224) {}
  return scopeValue223 + " " + scopeValue219;
}
function formatYtLiveViewerCount(scopeValue225, scopeValue226 = "") {
  return formatYtChineseMetricCount(scopeValue225, "人正在观看", scopeValue226);
}
function formatYtVideoViewCount(scopeValue227, scopeValue228 = "") {
  return formatYtChineseMetricCount(scopeValue227, "次观看", scopeValue228);
}
window.getYtChannelLanguageContext = getYtChannelLanguageContext;
window.normalizeYtLocalizedContent = normalizeYtLocalizedContent;
window.buildYtLocalizedJsonContract = buildYtLocalizedJsonContract;
window.formatYtLiveViewerCount = formatYtLiveViewerCount;
window.formatYtVideoViewCount = formatYtVideoViewCount;
function getYtChannelRelationshipContext(scopeValue229) {
  const scopeValue230 = resolveYtExplicitImChar(scopeValue229);
  if (!scopeValue230) return "";
  const scopeValue231 = window.imApp && typeof window.imApp.normalizeFriendData === "function" ? window.imApp.normalizeFriendData(scopeValue230) : scopeValue230,
    scopeValue232 = Array.isArray(scopeValue231?.memory?.relationships) ? scopeValue231.memory.relationships : [];
  if (scopeValue232.length === 0) return "";
  const scopeValue233 = Array.isArray(window.imData?.friends) ? window.imData.friends : [],
    scopeValue234 = scopeValue232.map(scopeValue235 => {
      const scopeValue236 = scopeValue233.find(scopeValue239 => String(scopeValue239.id) === String(scopeValue235.npcId)),
        scopeValue237 = scopeValue236?.nickname || scopeValue236?.realName || scopeValue236?.name || "未知角色",
        scopeValue238 = String(scopeValue235.relation || "").trim();
      return scopeValue238 ? "- " + scopeValue237 + "：" + scopeValue238 : "";
    }).filter(Boolean);
  return scopeValue234.length > 0 ? `iMessage 关系网：
` + scopeValue234.join(`
`) : "";
}
function getYtChannelPersonaWithRelationships(scopeValue240, scopeValue241 = "未知") {
  const scopeValue242 = String(scopeValue240?.desc || scopeValue240?.persona || scopeValue241 || "未知").trim() || "未知",
    scopeValue243 = getYtChannelRelationshipContext(scopeValue240);
  return scopeValue243 ? scopeValue242 + `
` + scopeValue243 : scopeValue242;
}
function normalizeYtWorldBookIds(scopeValue244 = []) {
  return (Array.isArray(scopeValue244) ? scopeValue244 : []).map(scopeValue245 => String(scopeValue245 || "").trim()).filter((scopeValue246, scopeValue247, scopeValue248) => scopeValue246 && scopeValue248.indexOf(scopeValue246) === scopeValue247);
}
function getYtMountedWorldBookIds() {
  return normalizeYtWorldBookIds(Array.isArray(channelState?.boundWorldBookIds) ? channelState.boundWorldBookIds : []);
}
function getYtWorldBookContext(scopeValue249 = "") {
  const scopeValue250 = String(scopeValue249 || ""),
    scopeValue251 = [],
    scopeValue252 = typeof window.getGlobalWorldBookContext === "function",
    scopeValue253 = scopeValue252 ? window.getGlobalWorldBookContext(scopeValue250) : "";
  if (scopeValue253) scopeValue251.push(scopeValue253.trim());
  const scopeValue254 = new Set(getYtMountedWorldBookIds());
  if (typeof window.getWorldBooks === "function") {
    const scopeValue255 = window.getWorldBooks();
    Array.isArray(scopeValue255) && scopeValue255.forEach(scopeValue256 => {
      if (!scopeValue256 || !Array.isArray(scopeValue256.entries)) return;
      const scopeValue257 = !scopeValue252 && scopeValue256.isGlobal;
      if (!scopeValue257 && !scopeValue254.has(String(scopeValue256.id))) return;
      if (scopeValue252 && scopeValue256.isGlobal) return;
      const scopeValue258 = scopeValue256.entries.map(scopeValue260 => window.normalizeWorldBookEntry ? window.normalizeWorldBookEntry(scopeValue260) : scopeValue260).filter(scopeValue261 => scopeValue261 && scopeValue261.enabled !== false).filter(scopeValue262 => !window.worldBookKeywordMatched || window.worldBookKeywordMatched(scopeValue262, scopeValue250));
      if (scopeValue258.length === 0) return;
      const scopeValue259 = scopeValue258.map(scopeValue263 => {
        if (typeof window.formatWorldBookEntryForPrompt === "function") return window.formatWorldBookEntryForPrompt(scopeValue263);
        const scopeValue264 = scopeValue263.title || scopeValue263.name || scopeValue263.keyword || "未命名词条";
        return ("【" + scopeValue264 + `】
` + (scopeValue263.content || "")).trim();
      }).filter(Boolean);
      scopeValue259.length > 0 && scopeValue251.push(`Mounted World Book / 已挂载世界书：
【` + (scopeValue256.name || scopeValue256.id || "未命名世界书") + `】
` + scopeValue259.join(`

`));
    });
  }
  return !scopeValue252 && typeof window.getBuiltinWorldBookContext === "function" && ["system_depth", "before_role", "after_role"].forEach(scopeValue265 => {
    const scopeValue266 = window.getBuiltinWorldBookContext(scopeValue265, scopeValue250);
    if (scopeValue266) scopeValue251.push(scopeValue266.trim());
  }), scopeValue251.filter(Boolean).join(`

`).trim();
}
function resolveYtChannelAvatar(scopeValue267) {
  const scopeValue268 = resolveYtLinkedImChar(scopeValue267);
  return scopeValue268 && scopeValue268.avatarUrl || scopeValue267 && (scopeValue267.avatar || scopeValue267.avatarUrl) || "https://picsum.photos/80/80?grayscale";
}
window.resolveYtLinkedImChar = resolveYtLinkedImChar;
window.resolveYtExplicitImChar = resolveYtExplicitImChar;
window.getYtChannelRelationshipContext = getYtChannelRelationshipContext;
window.getYtChannelPersonaWithRelationships = getYtChannelPersonaWithRelationships;
window.getYtMountedWorldBookIds = getYtMountedWorldBookIds;
window.getYtWorldBookContext = getYtWorldBookContext;
window.resolveYtChannelAvatar = resolveYtChannelAvatar;
function normalizeYtSubscription(scopeValue269, scopeValue270 = 0) {
  if (!scopeValue269 || typeof scopeValue269 !== "object") return null;
  const scopeValue271 = String(scopeValue269.name || scopeValue269.nickname || "").trim();
  if (!scopeValue271) return null;
  const scopeValue272 = String(scopeValue269.handle || scopeValue271.toLowerCase().replace(/\s+/g, "")).replace(/^@/, "") || "channel" + (scopeValue270 + 1),
    scopeValue273 = scopeValue269.id || "yt_sub_" + scopeValue272 + "_" + scopeValue270,
    scopeValue274 = {
      ...scopeValue269,
      id: scopeValue273,
      name: scopeValue271,
      handle: scopeValue272,
      imCharId: scopeValue269.imCharId || scopeValue269.imId || scopeValue269.friendId || null,
      avatar: scopeValue269.avatar || scopeValue269.avatarUrl || "https://picsum.photos/seed/" + encodeURIComponent(scopeValue273) + "/80/80?grayscale",
      banner: scopeValue269.banner || null,
      desc: scopeValue269.desc || "",
      subs: scopeValue269.subs || "",
      videos: scopeValue269.videos || "",
      isLive: !!scopeValue269.isLive,
      generatedContent: scopeValue269.generatedContent && typeof scopeValue269.generatedContent === "object" ? {
        ...scopeValue269.generatedContent,
        fanGroup: scopeValue269.generatedContent.fanGroup ? normalizeYtFanGroup(scopeValue269.generatedContent.fanGroup) : null
      } : null,
      groupChatHistory: Array.isArray(scopeValue269.groupChatHistory) ? scopeValue269.groupChatHistory : [],
      isFriend: !!scopeValue269.isFriend,
      isBusiness: !!scopeValue269.isBusiness,
      isSubscribed: scopeValue269.isSubscribed !== false,
      unreadDmCount: Math.max(0, Math.round(Number(scopeValue269.unreadDmCount) || 0)),
      dmHistory: Array.isArray(scopeValue269.dmHistory) ? scopeValue269.dmHistory.filter(scopeValue275 => scopeValue275 && typeof scopeValue275 === "object") : []
    };
  return ensureYtFixedCharFanGroup(scopeValue274);
}
function normalizeYtSubscriptions(scopeValue276) {
  if (!Array.isArray(scopeValue276)) return [];
  return scopeValue276.map((scopeValue277, scopeValue278) => normalizeYtSubscription(scopeValue277, scopeValue278)).filter(Boolean);
}
function createStableYtChannelId(scopeValue279, scopeValue280 = "yt_channel") {
  const scopeValue281 = String(scopeValue279 || scopeValue280).trim().toLowerCase().replace(/^@/, "").replace(/\s+/g, "-").replace(/[^\w\u4e00-\u9fa5.-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "") || scopeValue280;
  return scopeValue280 + "_" + scopeValue281;
}
function buildYtChannelFromTrendingItem(scopeValue282, scopeValue283 = "trend", scopeValue284 = 0) {
  const scopeValue285 = scopeValue282 && typeof scopeValue282 === "object" ? scopeValue282 : {},
    scopeValue286 = String(scopeValue285.name || scopeValue285.nickname || "频道" + (scopeValue284 + 1)).trim(),
    scopeValue287 = String(scopeValue285.handle || scopeValue286 || "channel" + (scopeValue284 + 1)).replace(/^@/, "").replace(/\s+/g, "").trim() || "channel" + (scopeValue284 + 1),
    scopeValue288 = scopeValue285.id || createStableYtChannelId(scopeValue283 + "_" + scopeValue287, "char_trend"),
    scopeValue289 = encodeURIComponent(scopeValue287 || scopeValue288);
  return normalizeYtSubscription({
    id: scopeValue288,
    name: scopeValue286,
    handle: scopeValue287,
    avatar: scopeValue285.avatar || scopeValue285.avatarUrl || "https://picsum.photos/seed/" + scopeValue289 + "/80/80",
    banner: scopeValue285.banner || null,
    isLive: !!scopeValue285.isLive,
    desc: scopeValue285.desc || scopeValue285.persona || "",
    subs: scopeValue285.subs || "0",
    videos: scopeValue285.videos || "10",
    isFriend: !!scopeValue285.isFriend,
    isBusiness: !!scopeValue285.isBusiness,
    isSubscribed: scopeValue285.isSubscribed === true,
    generatedContent: scopeValue285.generatedContent || null,
    groupChatHistory: Array.isArray(scopeValue285.groupChatHistory) ? scopeValue285.groupChatHistory : [],
    dmHistory: Array.isArray(scopeValue285.dmHistory) ? scopeValue285.dmHistory : []
  }, scopeValue284);
}
function mergeYtChannelIntoSubscriptions(scopeValue290, scopeValue291 = {}) {
  if (!scopeValue290 || typeof scopeValue290 !== "object") return null;
  const {
      save: scopeValue292 = true,
      preferExistingSubscription: scopeValue293 = true
    } = scopeValue291,
    scopeValue294 = normalizeYtSubscription(scopeValue290, mockSubscriptions.length) || buildYtChannelFromTrendingItem(scopeValue290, "manual", mockSubscriptions.length);
  if (!scopeValue294) return null;
  const scopeValue295 = normalizeYtLookupText(scopeValue294.handle),
    scopeValue296 = mockSubscriptions.findIndex(scopeValue297 => {
      if (!scopeValue297) return false;
      if (String(scopeValue297.id) === String(scopeValue294.id)) return true;
      return scopeValue295 && normalizeYtLookupText(scopeValue297.handle) === scopeValue295;
    });
  if (scopeValue296 > -1) {
    const scopeValue298 = mockSubscriptions[scopeValue296],
      scopeValue299 = normalizeYtSubscription({
        ...scopeValue298,
        ...scopeValue294,
        id: scopeValue298.id || scopeValue294.id,
        isSubscribed: scopeValue293 ? scopeValue298.isSubscribed !== false : scopeValue294.isSubscribed,
        generatedContent: scopeValue294.generatedContent || scopeValue298.generatedContent || null,
        groupChatHistory: Array.isArray(scopeValue294.groupChatHistory) && scopeValue294.groupChatHistory.length > 0 ? scopeValue294.groupChatHistory : scopeValue298.groupChatHistory || [],
        dmHistory: Array.isArray(scopeValue294.dmHistory) && scopeValue294.dmHistory.length > 0 ? scopeValue294.dmHistory : scopeValue298.dmHistory || []
      }, scopeValue296);
    mockSubscriptions[scopeValue296] = scopeValue299;
    hasSubscriptions = mockSubscriptions.some(scopeValue300 => scopeValue300 && scopeValue300.isSubscribed !== false);
    if (scopeValue292) saveYoutubeData();
    return mockSubscriptions[scopeValue296];
  }
  mockSubscriptions.push(scopeValue294);
  hasSubscriptions = mockSubscriptions.some(scopeValue301 => scopeValue301 && scopeValue301.isSubscribed !== false);
  if (scopeValue292) saveYoutubeData();
  return mockSubscriptions[mockSubscriptions.length - 1];
}
function rebuildYoutubeMockVideos() {
  mockVideos = [];
  if (channelState.activeUserLive) {
    const scopeValue302 = channelState.activeUserLive,
      scopeValue303 = scopeValue302.user || {};
    mockVideos.push({
      title: scopeValue302.title || "我的直播间",
      desc: scopeValue302.desc || "",
      viewerCount: Number(scopeValue302.totalViews) || 0,
      views: formatYtLiveViewerCount(scopeValue302.totalViews, scopeValue302.views || (scopeValue302.totalViews || 0) + " 人正在观看"),
      time: "LIVE",
      thumbnail: scopeValue302.thumbnail || scopeValue302.backgroundUrl || "https://picsum.photos/320/180",
      isLive: true,
      comments: Array.isArray(scopeValue302.comments) ? scopeValue302.comments : [],
      initialBubbles: Array.isArray(scopeValue302.initialBubbles) ? scopeValue302.initialBubbles : [],
      guest: scopeValue302.guest || null,
      channelData: {
        id: "user_channel_id",
        name: scopeValue303.name || "我",
        avatar: scopeValue303.avatarUrl || scopeValue303.avatar || "https://picsum.photos/80/80",
        subs: scopeValue303.subs || "0"
      }
    });
  }
  mockSubscriptions.forEach(scopeValue304 => {
    scopeValue304.generatedContent && scopeValue304.generatedContent.currentLive && mockVideos.push({
      id: scopeValue304.generatedContent.currentLive.id || null,
      title: scopeValue304.generatedContent.currentLive.title,
      titleTranslationZh: scopeValue304.generatedContent.currentLive.titleTranslationZh || "",
      viewerCount: Number(scopeValue304.generatedContent.currentLive.viewerCount),
      views: formatYtLiveViewerCount(scopeValue304.generatedContent.currentLive.viewerCount, scopeValue304.generatedContent.currentLive.views) || "0 人正在观看",
      time: "LIVE",
      thumbnail: scopeValue304.generatedContent.currentLive.thumbnail || "https://picsum.photos/320/180?grayscale",
      isLive: true,
      comments: scopeValue304.generatedContent.currentLive.comments || [],
      initialBubbles: scopeValue304.generatedContent.currentLive.initialBubbles || [],
      liveTranscript: scopeValue304.generatedContent.currentLive.liveTranscript || [],
      guest: scopeValue304.generatedContent.currentLive.guest || null,
      channelData: scopeValue304
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
    const scopeValue305 = typeof window.getAppState === "function" ? normalizeYoutubeState(window.getAppState("youtube")) : createDefaultYoutubeState();
    channelState = scopeValue305.channelState;
    mockSubscriptions = scopeValue305.subscriptions;
    hasSubscriptions = mockSubscriptions.length > 0;
    rebuildYoutubeMockVideos();
    ytUserState = scopeValue305.userState;
  } catch (scopeValue306) {
    console.error("Error loading YouTube data", scopeValue306);
    channelState = createDefaultYtChannelState();
    mockSubscriptions = [];
    hasSubscriptions = false;
    mockVideos = [];
    ytUserState = null;
  }
}
let youtubeSaveTimer = null,
  youtubeSavePending = false,
  youtubeSaveSkipUserState = false,
  youtubeSaveQueuedAt = 0;
function flushYoutubeData() {
  youtubeSaveTimer !== null && (clearTimeout(youtubeSaveTimer), youtubeSaveTimer = null);
  if (!youtubeSavePending) return;
  youtubeSavePending = false;
  youtubeSaveQueuedAt = 0;
  try {
    const scopeValue307 = normalizeYoutubeState({
      channelState: channelState,
      subscriptions: mockSubscriptions,
      userState: youtubeSaveSkipUserState ? null : ytUserState
    });
    youtubeSaveSkipUserState = false;
    if (typeof window.setAppState === "function") window.setAppState("youtube", scopeValue307);else window.appState && typeof window.appStorage !== "undefined" ? (window.appState.youtube = scopeValue307, typeof window.appStorage.saveGlobalData === "function" && window.appStorage.saveGlobalData(window.appState)) : console.warn("YouTube data was not saved: setAppState is unavailable");
  } catch (scopeValue308) {
    console.error("Error saving YouTube data", scopeValue308);
  }
}
function saveYoutubeData(scopeValue309 = {}) {
  if (!youtubeSavePending) youtubeSaveQueuedAt = Date.now();
  youtubeSavePending = true;
  youtubeSaveSkipUserState = youtubeSaveSkipUserState || !!scopeValue309?.skipUserState;
  if (youtubeSaveTimer !== null) clearTimeout(youtubeSaveTimer);
  youtubeSaveTimer = setTimeout(flushYoutubeData, Math.min(80, Math.max(0, 300 - (Date.now() - youtubeSaveQueuedAt))));
}
document.addEventListener("visibilitychange", () => {
  document.hidden && (flushYoutubeData(), window.saveGlobalData?.());
});
window.addEventListener("pagehide", () => {
  flushYoutubeData();
  window.saveGlobalData?.();
});
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
    const scopeValue310 = navigator.userAgent || "",
      scopeValue311 = /iPad|iPhone|iPod/i.test(scopeValue310) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
    return scopeValue311 && /AppleWebKit/i.test(scopeValue310);
  })();
let ytViewportResetTimers = [],
  ytRootScrollGuardBound = false;
function hasFocusedTextInput() {
  const scopeValue312 = document.activeElement;
  if (!scopeValue312 || !scopeValue312.matches?.("input, textarea, [contenteditable=\"true\"]")) return false;
  return true;
}
function clearYtViewportResetTimers() {
  ytViewportResetTimers.forEach(scopeValue313 => clearTimeout(scopeValue313));
  ytViewportResetTimers = [];
}
function resetYtManagedContainerScroll() {
  const scopeValue314 = document.getElementById("app"),
    scopeValue315 = document.getElementById("youtube-view");
  [scopeValue314, scopeValue315].forEach(scopeValue316 => {
    if (!scopeValue316) return;
    scopeValue316.scrollTop = 0;
    scopeValue316.scrollLeft = 0;
  });
}
function guardYtRootScroll() {
  if (!isYtIOSWebKit) return;
  const scopeValue317 = document.getElementById("app");
  if (!scopeValue317?.classList.contains("yt-ios-scroll-locked")) return;
  resetYtManagedContainerScroll();
}
function bindYtRootScrollGuard() {
  if (!isYtIOSWebKit || ytRootScrollGuardBound) return;
  const scopeValue323 = document.getElementById("app"),
    newScope321 = document.getElementById("youtube-view");
  [scopeValue323, newScope321].forEach(newScope322 => {
    newScope322?.["addEventListener"]("scroll", guardYtRootScroll, {
      passive: true
    });
  });
  ytRootScrollGuardBound = true;
}
function setYtIOSAppScrollLock(newScope323) {
  if (!isYtIOSWebKit) return;
  const newScope324 = document.getElementById("app");
  if (!newScope324) return;
  if (newScope323) {
    newScope324.classList.add("yt-ios-scroll-locked"), bindYtRootScrollGuard(), resetYtManagedContainerScroll(), requestAnimationFrame(resetYtManagedContainerScroll);
    return;
  }
  resetYtManagedContainerScroll(), newScope324.classList.remove("yt-ios-scroll-locked");
}
function resetYtScrollPositions() {
  resetYtManagedContainerScroll(), window.scrollTo(0, 0), document.documentElement.scrollTop = 0, document.documentElement.scrollLeft = 0, document.body.scrollTop = 0, document.body.scrollLeft = 0;
}
window.resetYtViewportOffset = function () {
  if (!isYtIOSWebKit) return;
  clearYtViewportResetTimers(), resetYtScrollPositions();
  const newScope325 = () => {
    if (hasFocusedTextInput()) return;
    resetYtScrollPositions();
  };
  requestAnimationFrame(() => {
    newScope325(), requestAnimationFrame(newScope325);
  }), [60, 180, 360].forEach(scopeValue324 => {
    ytViewportResetTimers.push(setTimeout(newScope325, scopeValue324));
  });
};
function clearYtKeyboardViewState(scopeValue325) {
  if (!scopeValue325) return;
  scopeValue325.classList.remove("keyboard-open", "yt-chat-keyboard-lock");
  delete scopeValue325.dataset.ytKeyboardScrollTop;
}
window.releaseYtChatKeyboardLock = function (scopeValue326 = null) {
  const scopeValue327 = document.activeElement,
    scopeValue328 = scopeValue326 || null;
  ytChatKeyboardViewIds.forEach(scopeValue329 => {
    const scopeValue330 = document.getElementById(scopeValue329);
    if (!scopeValue330 || scopeValue330 === scopeValue328) return;
    if (scopeValue327 && scopeValue330.contains(scopeValue327) && typeof scopeValue327.blur === "function") scopeValue327.blur();
    clearYtKeyboardViewState(scopeValue330);
  });
};
window.setYtChatKeyboardLock = function (scopeValue331, scopeValue332) {
  if (!scopeValue331) return;
  if (scopeValue332) {
    window.releaseYtChatKeyboardLock(scopeValue331);
    isYtIOSWebKit ? (scopeValue331.classList.add("keyboard-open", "yt-chat-keyboard-lock"), resetYtManagedContainerScroll()) : clearYtKeyboardViewState(scopeValue331);
    return;
  }
  clearYtKeyboardViewState(scopeValue331);
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
let navSwitchToken = 0;
const ytListRenderSnapshots = new WeakMap();
function renderYtList(newScope335, newScope336, newScope337) {
  const newScope338 = ytListRenderSnapshots.get(newScope335);
  if (newScope338 && newScope338.firstChild === newScope335.firstChild && newScope338.childCount === newScope335.childElementCount && newScope338.signature.length === newScope336.length && newScope336.every((newScope340, newScope341) => Object.is(newScope340, newScope338.signature[newScope341]))) {
    window.u2Perf?.["sample"]("youtube-list-reused", 0);
    return;
  }
  const newScope339 = window.u2Perf ? performance.now() : 0;
  newScope337(), ytListRenderSnapshots.set(newScope335, {
    signature: newScope336,
    firstChild: newScope335.firstChild,
    childCount: newScope335.childElementCount
  });
  if (window.u2Perf) window.u2Perf.sample("youtube-list-render", performance.now() - newScope339);
}
function getYtMessageListSignature() {
  const newScope342 = [currentMsgFilter];
  if (currentMsgFilter === "business" || currentMsgFilter === "dm") {
    const newScope343 = currentMsgFilter === "business";
    mockSubscriptions.forEach(newScope344 => {
      if (newScope344.isBusiness !== newScope343 || !(newScope344.isFriend || newScope344.dmHistory?.["length"])) return;
      const newScope345 = newScope344.dmHistory?.["at"](-1);
      newScope342.push(newScope344, newScope344.name, resolveYtChannelAvatar(newScope344), newScope344.isFriend, newScope344.unreadDmCount, newScope345?.["text"], newScope345?.["isOffer"]);
    });
  } else {
    const newScope346 = (newScope347, newScope348 = false) => {
      const newScope349 = newScope347?.["generatedContent"]?.["fanGroup"];
      if (!newScope349 || !newScope348 && !newScope349.isJoined) return;
      const newScope350 = newScope347.groupChatHistory?.["at"](-1);
      newScope342.push(newScope347, newScope349, newScope348, newScope349.name, newScope349.avatar || resolveYtChannelAvatar(newScope347), newScope350?.["name"], newScope350?.["text"]);
    };
    newScope346(channelState.userCommunityChannel, true), mockSubscriptions.forEach(newScope351 => newScope346(newScope351));
  }
  return newScope342;
}
dockIconYt && ytView && dockIconYt.addEventListener("click", scopeValue333 => {
  if (window.isJiggleMode || window.preventAppClick) {
    scopeValue333.preventDefault();
    scopeValue333.stopPropagation();
    return;
  }
  const newScope353 = ++navSwitchToken;
  if (typeof window.ensureYtUserState === "function") ytUserState = window.ensureYtUserState();else !ytUserState && (ytUserState = {});
  syncYtProfile();
  setYtIOSAppScrollLock(true);
  if (window.openView) window.openView(ytView);else ytView.classList.add("active");
  resetYtManagedContainerScroll(), requestAnimationFrame(() => {
    if (newScope353 !== navSwitchToken || !ytView.classList.contains("active")) return;
    const scopeValue334 = document.querySelector(".yt-nav-item.active");
    if (scopeValue334) updateNavIndicator(scopeValue334);
  }), requestAnimationFrame(() => setTimeout(() => {
    if (newScope353 !== navSwitchToken || !ytView.classList.contains("active")) return;
    document.getElementById("yt-home-tab")?.["classList"]["contains"]("active") && (renderSubscriptions(), renderVideos());
    if (document.getElementById("yt-messages-tab")?.["classList"]["contains"]("active")) renderMessagesList();
    window.flushYtPlayerChatRows?.(), window.refreshYtUserLiveUi?.();
  }, 0));
});
backBtn && ytView && backBtn.addEventListener("click", () => {
  navSwitchToken++, window.releaseYtChatKeyboardLock?.();
  if (window.closeView) window.closeView(ytView);else ytView.classList.remove("active");
  window.resetYtViewportOffset?.();
  setYtIOSAppScrollLock(false);
});
ytView?.["addEventListener"]("u2:view-closing", () => {
  navSwitchToken++;
});
const msgFilterDm = document.getElementById("msg-filter-dm"),
  msgFilterCommunity = document.getElementById("msg-filter-community"),
  msgFilterBusiness = document.getElementById("msg-filter-business"),
  msgListContainer = document.getElementById("yt-messages-list"),
  msgRefreshBtn = document.getElementById("yt-messages-refresh-btn"),
  ytMessagesNavUnread = document.getElementById("yt-messages-nav-unread");
let currentMsgFilter = "dm";
function getYtUnreadMessageCount() {
  return mockSubscriptions.reduce((scopeValue335, scopeValue336) => scopeValue335 + Math.max(0, Math.round(Number(scopeValue336?.unreadDmCount) || 0)), 0);
}
function updateYtMessageUnreadIndicators() {
  const scopeValue337 = getYtUnreadMessageCount();
  return ytMessagesNavUnread?.classList.toggle("is-visible", scopeValue337 > 0), ytMessagesNavUnread && ytMessagesNavUnread.setAttribute("aria-label", scopeValue337 > 0 ? scopeValue337 + " 条未读消息" : "暂无未读消息"), scopeValue337;
}
function markYtMessagesUnread(scopeValue338, scopeValue339 = 1) {
  if (!scopeValue338 || typeof scopeValue338 !== "object") return 0;
  const scopeValue340 = Math.max(0, Math.round(Number(scopeValue339) || 0));
  return scopeValue338.unreadDmCount = Math.max(0, Math.round(Number(scopeValue338.unreadDmCount) || 0)) + scopeValue340, updateYtMessageUnreadIndicators(), scopeValue338.unreadDmCount;
}
window.getYtUnreadMessageCount = getYtUnreadMessageCount;
window.updateYtMessageUnreadIndicators = updateYtMessageUnreadIndicators;
window.markYtMessagesUnread = markYtMessagesUnread;
function buildYtIncomingMessageChannelContext() {
  const scopeValue341 = channelState && channelState.activeUserLive ? {
      title: channelState.activeUserLive.title || "未命名直播",
      topic: channelState.activeUserLive.desc || "",
      guest: channelState.activeUserLive.guest?.name || ""
    } : null,
    scopeValue342 = Array.isArray(channelState?.pastVideos) ? channelState.pastVideos.slice(0, 5).map(scopeValue344 => ({
      title: scopeValue344.title || "未命名视频",
      description: scopeValue344.desc || "",
      publishedAt: scopeValue344.time || "",
      representativeComments: Array.isArray(scopeValue344.comments) ? scopeValue344.comments.slice(0, 2).map(scopeValue345 => scopeValue345?.text || "").filter(Boolean) : []
    })) : [],
    scopeValue343 = Array.isArray(channelState?.liveSummaries) ? channelState.liveSummaries.slice(-3).reverse().map(scopeValue346 => ({
      title: scopeValue346.title || "",
      content: scopeValue346.content || scopeValue346.summary || "",
      highlights: Array.isArray(scopeValue346.highlights) ? scopeValue346.highlights.slice(0, 3) : []
    })) : [];
  return JSON.stringify({
    currentlyLive: scopeValue341,
    recentVideos: scopeValue342,
    recentLiveSummaries: scopeValue343
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
  const scopeValue347 = window.getYtWorldBookContext ? window.getYtWorldBookContext(currentMsgFilter) : "",
    scopeValue348 = typeof window.getYtEffectiveUserState === "function" ? window.getYtEffectiveUserState() : ytUserState || {},
    scopeValue349 = scopeValue348.persona || "普通用户",
    scopeValue350 = buildYtIncomingMessageChannelContext(),
    scopeValue351 = currentMsgFilter;
  let scopeValue352 = "";
  if (scopeValue351 === "business") scopeValue352 = `仔细阅读我的用户人设，根据我的用户人设生成3-5个**为你量身定制**的商务合作/赞助/联动邀请。
要求发件人来自不同国家或地区，可以是品牌方、赞助商或希望联动的博主。合作内容必须与我的人设及真实频道内容息息相关。
每个发件人要有明确身份、沟通风格和惯用语言；允许使用符合其地区和人设的任意语言，整体应体现 YouTube 的国际化用户构成。
每人先发送2-4条简短自然的文字气泡，再发送商单卡片。不要像统一模板，不要每个人都用相同开场。
绝对不要使用任何 Emoji 表情符号，句子末尾不要使用句号。
我的用户人设："` + scopeValue349 + `"。
世界观背景：` + scopeValue347 + `
我的 YouTube 频道真实内容：` + scopeValue350 + `
只能引用上述真实频道内容；没有往期视频或直播记录时，不得虚构看过某个具体视频或直播。
国际化翻译规则：每条文字消息如果 content 不是中文，translationZh 必须填写自然中文翻译；如果 content 是中文，translationZh 必须是空字符串。
返回严格的JSON格式：
{
  "users": [
    {
      "name": "发件人名字(必须纯品牌名或频道名，绝对禁止在名字中添加'PR'、'经理'、'负责人'、'官方'等任何后缀！)",
      "avatarDesc": "英文单词描述头像(如: business logo)",
      "persona": "发件人的身份、地区、性格和沟通风格",
      "preferredLanguage": "主要使用的语言名称",
      "messages": [
        { "type": "text", "content": "你好！我们是某某品牌", "translationZh": "" },
        { "type": "text", "content": "We loved your latest stream", "translationZh": "我们很喜欢你最近的直播" },
        { "type": "offer", "offerData": { 
            "title": "游戏试玩推广", 
            "offerType": "填入枚举值: video(定制视频) 或 live(工商直播) 或 post(图文宣发) 或 collab(博主联动)",
            "requirement": "详细说明植入要求或直播要求，必须明确！", 
            "price": "$5000",
            "rmbAmount": 35000,
            "penalty": "$2000",
            "rmbPenalty": 14000
            } 
        }
      ]
    }
  ]
}
注意：每个发件人的 messages 数组中，除了前面的文字寒暄，最后一条必须是 type 为 "offer" 的商单卡片。
offerData.price 用于展示，offerData.rmbAmount 是纯数字，代表换算成人民币的金额。只能返回纯JSON。`;else scopeValue351 === "dm" && (scopeValue352 = `仔细阅读我的用户人设和频道真实内容，生成3-5个不同国家、身份和语言习惯的陌生人、同行或粉丝给我发 YouTube 私信的数据。
私信必须像真实活人发来的消息：一句一发，每人2-5条短气泡，语气、断句和熟悉程度各不相同，不要像客服或统一模板。
他们可以询问我什么时候开播、讨论正在进行的直播、针对真实往期视频或直播内容说具体感受、催更、追问后续，或根据人设自然搭话。不同联系人应选择不同话题，不要全都催更。
如果频道没有往期视频或直播记录，只能询问首次开播、未来计划或根据人设搭话，绝对不能虚构看过某个具体视频或直播。
允许使用符合联系人国籍、人设和上下文的任意语言，整体应体现 YouTube 的国际化用户构成。
绝对不要使用任何 Emoji 表情符号，句子末尾不要使用句号。
我的用户人设："` + scopeValue349 + `"。
世界观背景：` + scopeValue347 + `
我的 YouTube 频道真实内容：` + scopeValue350 + `
国际化翻译规则：每条消息如果 content 不是中文，translationZh 必须填写自然中文翻译；如果 content 是中文，translationZh 必须是空字符串。
返回严格的JSON格式：
{
  "users": [
    {
      "name": "陌生人/同行/粉丝名字",
      "avatarDesc": "英文单词描述头像",
      "persona": "联系人身份、国家或地区、性格以及为什么联系我",
      "preferredLanguage": "主要使用的语言名称",
      "messages": [
        { "type": "text", "content": "第一条中文消息", "translationZh": "" },
        { "type": "text", "content": "foreign-language message", "translationZh": "这条外语消息的自然中文翻译" }
      ]
    }
  ]
}
注意：只能返回纯JSON。`);
  try {
    const scopeValue353 = window.u2Api.resolveChatCompletionsEndpoint(window.apiConfig.endpoint),
      scopeValue354 = await fetch(scopeValue353, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.apiConfig.apiKey
        },
        body: JSON.stringify({
          model: window.apiConfig.model || "gpt-3.5-turbo",
          messages: [{
            role: "user",
            content: scopeValue352
          }],
          temperature: 0.9,
          response_format: {
            type: "json_object"
          }
        })
      });
    if (!scopeValue354.ok) throw window.u2Api?.createHttpError?.(scopeValue354, await window.u2Api?.readApiError?.(scopeValue354)) || Object.assign(new Error("HTTP " + scopeValue354.status), {
      status: scopeValue354.status
    });
    const scopeValue355 = await scopeValue354.json();
    let scopeValue356 = scopeValue355.choices[0].message.content,
      scopeValue357 = scopeValue356.match(/\{[\s\S]*\}/);
    scopeValue356 = scopeValue357 ? scopeValue357[0] : scopeValue356;
    const scopeValue358 = sanitizeObj(JSON.parse(scopeValue356));
    if (scopeValue358.users && Array.isArray(scopeValue358.users)) {
      const scopeValue359 = scopeValue351 === "business";
      scopeValue358.users.forEach(scopeValue360 => {
        const scopeValue361 = {
          id: "gen_user_" + Date.now() + Math.floor(Math.random() * 10000),
          name: scopeValue360.name,
          handle: scopeValue360.name.toLowerCase().replace(/\s+/g, ""),
          avatar: "https://picsum.photos/seed/" + (scopeValue360.avatarDesc ? scopeValue360.avatarDesc.replace(/\s+/g, "") : Date.now()) + "/80/80?grayscale",
          desc: scopeValue360.persona || "",
          preferredLanguage: scopeValue360.preferredLanguage || "",
          isBusiness: scopeValue359,
          isFriend: false,
          isSubscribed: false,
          dmHistory: (Array.isArray(scopeValue360.messages) ? scopeValue360.messages : []).map(scopeValue362 => {
            if (scopeValue362.type === "offer") return {
              type: "char",
              name: scopeValue360.name,
              isOffer: true,
              offerData: scopeValue362.offerData || {
                title: "合作邀请",
                offerType: "video",
                requirement: "详谈",
                price: "＄5000",
                penalty: "＄2000"
              },
              offerStatus: "pending"
            };else {
              const scopeValue363 = normalizeYtGeneratedMessage(scopeValue362);
              return {
                type: "char",
                name: scopeValue360.name,
                text: scopeValue363.text || "你好",
                translationZh: scopeValue363.translationZh
              };
            }
          })
        };
        scopeValue361.unreadDmCount = Math.max(1, scopeValue361.dmHistory.length);
        mockSubscriptions.unshift(scopeValue361);
      });
      saveYoutubeData();
      updateYtMessageUnreadIndicators();
      renderMessagesList();
      if (window.showToast) window.showToast("收到 " + scopeValue358.users.length + " 位新联系人的消息");
    }
  } catch (scopeValue364) {
    console.error("Generate MSG Error: ", scopeValue364);
    if (window.showToast) window.showToast("无法生成新消息，请重试");
  } finally {
    msgRefreshBtn.style.opacity = "1";
    msgRefreshBtn.style.pointerEvents = "auto";
  }
});
msgFilterDm && msgFilterCommunity && msgFilterBusiness && (msgFilterDm.addEventListener("click", () => {
  if (currentMsgFilter === "dm") return;
  msgFilterDm.classList.add("active");
  msgFilterCommunity.classList.remove("active");
  msgFilterBusiness.classList.remove("active");
  currentMsgFilter = "dm";
  renderMessagesList();
}), msgFilterCommunity.addEventListener("click", () => {
  if (currentMsgFilter === "community") return;
  msgFilterCommunity.classList.add("active");
  msgFilterDm.classList.remove("active");
  msgFilterBusiness.classList.remove("active");
  currentMsgFilter = "community";
  renderMessagesList();
}), msgFilterBusiness.addEventListener("click", () => {
  if (currentMsgFilter === "business") return;
  msgFilterBusiness.classList.add("active");
  msgFilterCommunity.classList.remove("active");
  msgFilterDm.classList.remove("active");
  currentMsgFilter = "business";
  renderMessagesList();
}));
function renderMessagesList() {
  if (!msgListContainer) return;
  return updateYtMessageUnreadIndicators(), renderYtList(msgListContainer, getYtMessageListSignature(), () => {
    msgListContainer.innerHTML = "";
    if (currentMsgFilter === "business" || currentMsgFilter === "dm") {
      const scopeValue367 = currentMsgFilter === "business",
        scopeValue368 = mockSubscriptions.filter(scopeValue372 => scopeValue372.isBusiness === scopeValue367 && (scopeValue372.isFriend || scopeValue372.dmHistory && scopeValue372.dmHistory.length > 0));
      if (scopeValue368.length === 0) {
        msgListContainer.innerHTML = "\n                    <div style=\"display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 100px; color: #8e8e93;\">\n                        <i class=\"fas " + (scopeValue367 ? "fa-envelope-open-text" : "fa-comment-dots") + "\" style=\"font-size: 48px; margin-bottom: 16px; color: #d1d1d6;\"></i>\n                        <p style=\"font-size: 15px;\">暂无" + (scopeValue367 ? "商务" : "私信") + "消息</p>\n                    </div>\n                ";
        return;
      }
      const scopeValue369 = scopeValue368.filter(scopeValue373 => scopeValue373.isFriend),
        scopeValue370 = scopeValue368.filter(scopeValue374 => !scopeValue374.isFriend),
        scopeValue371 = (scopeValue375, scopeValue376) => {
          if (scopeValue375.length === 0) return "";
          const scopeValue377 = document.createElement("div");
          scopeValue377.innerHTML = "<div style=\"font-size: 14px; font-weight: 600; color: #8e8e93; margin: 16px 4px 8px;\">" + scopeValue376 + " (" + scopeValue375.length + ")</div>";
          const scopeValue378 = document.createElement("div");
          return scopeValue378.style.backgroundColor = "#ffffff", scopeValue378.style.borderRadius = "16px", scopeValue378.style.overflow = "hidden", scopeValue378.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)", scopeValue375.forEach((scopeValue379, scopeValue380) => {
            const scopeValue381 = document.createElement("div"),
              scopeValue382 = resolveYtChannelAvatar(scopeValue379);
            scopeValue381.style.display = "flex", scopeValue381.style.alignItems = "center", scopeValue381.style.gap = "15px", scopeValue381.style.cursor = "pointer", scopeValue381.style.padding = "16px", scopeValue381.style.backgroundColor = "#ffffff";
            scopeValue380 < scopeValue375.length - 1 && (scopeValue381.style.borderBottom = "1px solid #f2f2f2");
            const scopeValue383 = Array.isArray(scopeValue379.dmHistory) ? scopeValue379.dmHistory : [],
              scopeValue384 = scopeValue383.length > 0 ? scopeValue383[scopeValue383.length - 1] : null;
            let scopeValue385 = scopeValue384?.["isOffer"] ? "[商单邀请]" : scopeValue384?.["text"] || "暂无消息",
              scopeValue386 = "刚刚";
            const scopeValue387 = Math.max(0, Math.round(Number(scopeValue379.unreadDmCount) || 0)),
              scopeValue388 = scopeValue379.isBusiness ? "<span style=\"font-size:10px; background:#e8f5e9; color:#388e3c; padding:2px 4px; border-radius:4px; margin-left:4px;\">商务</span>" : "";
            scopeValue381.innerHTML = "\n                        <div style=\"width: 50px; height: 50px; border-radius: 50%; overflow: hidden; flex-shrink: 0; \">\n                            <img src=\"" + scopeValue382 + "\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                        </div>\n                        <div style=\"flex: 1; overflow: hidden;\">\n                            <div style=\"display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;\">\n                                <div style=\"font-size: 16px; font-weight: 600; color: #0f0f0f; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;\">" + scopeValue379.name + " " + scopeValue388 + "</div>\n                                <div style=\"display:flex;align-items:center;gap:7px;flex-shrink:0;\">\n                                    <div style=\"font-size: 12px; color: #8e8e93;\">" + scopeValue386 + "</div>\n                                    " + (scopeValue387 > 0 ? "<span class=\"yt-message-thread-unread\" aria-label=\"未读消息\"></span>" : "") + "\n                                </div>\n                            </div>\n                            <div style=\"font-size: 13px; color: #606060; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;\">" + scopeValue385 + "</div>\n                        </div>\n                    ", scopeValue381.addEventListener("click", () => {
              currentSubChannelData = scopeValue379, scopeValue387 > 0 && (scopeValue379.unreadDmCount = 0, saveYoutubeData(), updateYtMessageUnreadIndicators(), scopeValue381.querySelector(".yt-message-thread-unread")?.["remove"]()), openDMChat(currentSubChannelData);
            }), scopeValue378.appendChild(scopeValue381);
          }), scopeValue377.appendChild(scopeValue378), scopeValue377;
        };
      scopeValue369.length > 0 && msgListContainer.appendChild(scopeValue371(scopeValue369, "我的好友"));
      scopeValue370.length > 0 && msgListContainer.appendChild(scopeValue371(scopeValue370, "消息请求"));
      return;
    }
    let scopeValue365 = [];
    channelState.userCommunityChannel?.["generatedContent"]?.["fanGroup"] && scopeValue365.push({
      subData: channelState.userCommunityChannel,
      group: channelState.userCommunityChannel.generatedContent.fanGroup,
      isOwned: true
    });
    mockSubscriptions.forEach(scopeValue389 => {
      scopeValue389.generatedContent && scopeValue389.generatedContent.fanGroup && scopeValue389.generatedContent.fanGroup.isJoined && scopeValue365.push({
        subData: scopeValue389,
        group: scopeValue389.generatedContent.fanGroup
      });
    });
    if (scopeValue365.length === 0) {
      msgListContainer.innerHTML = "\n                <div style=\"display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 100px; color: #8e8e93;\">\n                    <i class=\"fas fa-users\" style=\"font-size: 48px; margin-bottom: 16px; color: #d1d1d6;\"></i>\n                    <p style=\"font-size: 15px;\">你还没有创建或加入任何社群</p>\n                </div>\n            ";
      return;
    }
    const scopeValue366 = document.createElement("div");
    scopeValue366.style.backgroundColor = "#ffffff", scopeValue366.style.borderRadius = "16px", scopeValue366.style.overflow = "hidden", scopeValue366.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)", scopeValue365.forEach((scopeValue390, scopeValue391) => {
      const scopeValue392 = document.createElement("div");
      scopeValue392.style.display = "flex", scopeValue392.style.alignItems = "center", scopeValue392.style.gap = "15px", scopeValue392.style.cursor = "pointer", scopeValue392.style.padding = "16px", scopeValue392.style.backgroundColor = "#ffffff";
      scopeValue391 < scopeValue365.length - 1 && (scopeValue392.style.borderBottom = "1px solid #f2f2f2");
      let scopeValue393 = "\n                <div style=\"width: 50px; height: 50px; border-radius: 50%; background: #f2f2f7; display: flex; justify-content: center; align-items: center; color: #8e8e93; flex-shrink: 0; \">\n                    <i class=\"fas fa-users\" style=\"font-size: 20px;\"></i>\n                </div>\n            ";
      const scopeValue394 = scopeValue390.group.avatar || resolveYtChannelAvatar(scopeValue390.subData);
      scopeValue394 && (scopeValue393 = "\n                    <div style=\"width: 50px; height: 50px; border-radius: 50%; overflow: hidden; flex-shrink: 0;  background: transparent;\">\n                        <img src=\"" + scopeValue394 + "\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                    </div>\n                ");
      let scopeValue395 = "暂无群消息";
      if (scopeValue390.subData.groupChatHistory && scopeValue390.subData.groupChatHistory.length > 0) {
        const scopeValue396 = scopeValue390.subData.groupChatHistory[scopeValue390.subData.groupChatHistory.length - 1];
        scopeValue395 = (scopeValue396.name ? scopeValue396.name + ": " : "") + (scopeValue396.text || "");
      }
      scopeValue392.innerHTML = "\n                " + scopeValue393 + "\n                <div style=\"flex: 1; overflow: hidden;\">\n                    <div style=\"font-size: 16px; font-weight: 600; color: #0f0f0f; margin-bottom: 4px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;\">" + (scopeValue390.group.name || "粉丝群") + (scopeValue390.isOwned ? "<span style=\"font-size:10px; color:#fff; background:#0f0f0f; border-radius:6px; padding:2px 5px; margin-left:6px; vertical-align:2px;\">我的</span>" : "") + "</div>\n                    <div style=\"font-size: 13px; color: #606060; display: flex; align-items: center; gap: 6px;\">\n                        <span style=\"white-space: nowrap; text-overflow: ellipsis; overflow: hidden;\">" + scopeValue395 + "</span>\n                    </div>\n                </div>\n                <div style=\"color: #ccc;\"><i class=\"fas fa-chevron-right\"></i></div>\n            ", scopeValue392.addEventListener("click", () => {
        currentSubChannelData = scopeValue390.subData, openFanGroupChat(scopeValue390.group);
      }), scopeValue366.appendChild(scopeValue392);
    }), msgListContainer.appendChild(scopeValue366);
  });
}
function updateNavIndicator(scopeValue397) {
  if (!scopeValue397 || !navIndicator) return;
  const scopeValue398 = scopeValue397.offsetWidth;
  if (!scopeValue398) return;
  navIndicator.style.width = scopeValue398 + "px";
  navIndicator.style.transform = "translate3d(" + scopeValue397.offsetLeft + "px, 0, 0)";
  !navIndicator.classList.contains("is-ready") && requestAnimationFrame(() => navIndicator.classList.add("is-ready"));
}
setTimeout(() => {
  const scopeValue399 = document.querySelector(".yt-nav-item.active");
  if (scopeValue399) updateNavIndicator(scopeValue399);
}, 100);
const ytCreateSheet = document.getElementById("yt-create-sheet"),
  ytNavPlusBtn = document.getElementById("yt-nav-plus-btn");
if (ytNavPlusBtn && ytCreateSheet) {
  ytNavPlusBtn.addEventListener("click", () => {
    ytCreateSheet.classList.add("active");
  });
  ytCreateSheet.addEventListener("mousedown", scopeValue401 => {
    scopeValue401.target === ytCreateSheet && ytCreateSheet.classList.remove("active");
  });
  const scopeValue400 = ytCreateSheet.querySelectorAll(".yt-create-bubble-btn");
  scopeValue400.forEach((scopeValue402, scopeValue403) => {
    scopeValue402.addEventListener("click", () => {
      ytCreateSheet.classList.remove("active");
      if (scopeValue403 === 0) {
        const scopeValue404 = document.getElementById("yt-user-live-setup-sheet");
        if (scopeValue404) scopeValue404.classList.add("active");
      } else {
        if (scopeValue403 === 1) {
          if (typeof window.openYtUserPostComposer === "function") window.openYtUserPostComposer();
        } else {
          if (scopeValue403 === 2) {
            if (typeof window.openYtUserCommunityCreator === "function") window.openYtUserCommunityCreator();
          }
        }
      }
    });
  });
}
navItems.forEach(scopeValue405 => {
  scopeValue405.addEventListener("click", () => {
    if (scopeValue405.classList.contains("yt-nav-item-center")) return;
    if (scopeValue405.classList.contains("active")) return;
    const scopeValue406 = ++navSwitchToken;
    updateNavIndicator(scopeValue405);
    navItems.forEach(scopeValue408 => scopeValue408.classList.remove("active"));
    scopeValue405.classList.add("active");
    const scopeValue407 = scopeValue405.getAttribute("data-target");
    tabContents.forEach(scopeValue409 => {
      scopeValue409.classList.remove("yt-tab-enter");
      scopeValue409.id === scopeValue407 ? (scopeValue409.classList.add("active"), scopeValue409.classList.add("yt-tab-enter")) : scopeValue409.classList.remove("active");
    });
    if (scopeValue407 === "yt-messages-tab" || scopeValue407 === "yt-home-tab") {
      const scopeValue410 = scopeValue407 === "yt-messages-tab" && msgListContainer?.["childElementCount"] ? 190 : 0;
      requestAnimationFrame(() => setTimeout(() => {
        if (scopeValue406 !== navSwitchToken || !ytView.classList.contains("active") || !document.getElementById(scopeValue407)?.["classList"]["contains"]("active")) return;
        if (scopeValue407 === "yt-messages-tab") renderMessagesList();else renderSubscriptions(), renderVideos();
      }, scopeValue410));
    }
  });
});
window.addEventListener("resize", () => {
  const scopeValue411 = document.querySelector(".yt-nav-item.active");
  if (scopeValue411) updateNavIndicator(scopeValue411);
});
function renderSubscriptions() {
  if (!subsList) return;
  const newScope432 = [];
  return mockSubscriptions.forEach(scopeValue415 => {
    scopeValue415.isSubscribed !== false && newScope432.push(scopeValue415, scopeValue415.name, resolveYtChannelAvatar(scopeValue415), scopeValue415.isLive);
  }), renderYtList(subsList, newScope432, () => {
    subsList.innerHTML = "", document.querySelector(".yt-subscriptions-wrapper").style.display = "flex", hasSubscriptions = mockSubscriptions.some(scopeValue417 => scopeValue417 && scopeValue417.isSubscribed !== false);
    if (!hasSubscriptions || mockSubscriptions.length === 0) {
      const scopeValue418 = document.createElement("div");
      scopeValue418.className = "yt-sub-item", scopeValue418.innerHTML = "\n                <div class=\"yt-sub-avatar\">\n                    <i class=\"fas fa-user\"></i>\n                </div>\n                <span class=\"yt-sub-name\">暂无订阅</span>\n            ", subsList.appendChild(scopeValue418);
      return;
    }
    const scopeValue419 = mockSubscriptions.filter(scopeValue428 => scopeValue428.isSubscribed !== false);
    if (scopeValue419.length === 0 && mockSubscriptions.length > 0) {
      const scopeValue427 = document.createElement("div");
      scopeValue427.className = "yt-sub-item", scopeValue427.innerHTML = "\n                <div class=\"yt-sub-avatar\">\n                    <i class=\"fas fa-user\"></i>\n                </div>\n                <span class=\"yt-sub-name\">暂无订阅</span>\n            ", subsList.appendChild(scopeValue427);
    } else {
      const scopeValue425 = document.createDocumentFragment();
      scopeValue419.forEach(newScope442 => {
        const newScope443 = document.createElement("div"),
          newScope444 = resolveYtChannelAvatar(newScope442);
        newScope443.className = "yt-sub-item " + (newScope442.isLive ? "has-live" : ""), newScope443.innerHTML = "\n                    <div class=\"yt-sub-avatar\">\n                        <img src=\"" + newScope444 + "\" alt=\"" + newScope442.name + "\" loading=\"lazy\" decoding=\"async\">\n                    </div>\n                    <span class=\"yt-sub-name\">" + newScope442.name + "</span>\n                ", newScope443.addEventListener("click", newScope445 => {
          newScope445.stopPropagation();
          if (newScope442.id === "user_channel_id") {
            const newScope446 = document.querySelector(".yt-nav-item[data-target=\"yt-profile-tab\"]");
            if (newScope446) newScope446.click();
          } else {
            if (window.openSubChannelView) window.openSubChannelView(newScope442);
          }
        }), scopeValue425.appendChild(newScope443);
      }), subsList.appendChild(scopeValue425);
    }
    const newScope435 = document.querySelector(".yt-sub-all-btn"),
      scopeValue414 = document.getElementById("yt-all-subs-sheet");
    newScope435 && scopeValue414 && (newScope435.onclick = () => {
      const newScope447 = document.getElementById("yt-all-subs-list");
      newScope447.innerHTML = "";
      const newScope448 = mockSubscriptions.filter(newScope450 => {
        if (!newScope450) return false;
        return newScope450.isSubscribed !== false || !!resolveYtExplicitImChar(newScope450);
      });
      newScope448.length === 0 && (newScope447.innerHTML = "\n                        <div style=\"display:flex; flex-direction:column; align-items:center; padding:44px 16px; color:#8e8e93; text-align:center;\">\n                            <i class=\"fas fa-user-plus\" style=\"font-size:36px; color:#d1d1d6; margin-bottom:12px;\"></i>\n                            <div style=\"font-size:14px;\">暂无 Char 或已订阅频道</div>\n                        </div>\n                    ");
      const newScope449 = document.createDocumentFragment();
      newScope448.forEach(newScope451 => {
        const newScope452 = document.createElement("div"),
          newScope453 = resolveYtChannelAvatar(newScope451);
        newScope452.className = "account-card", newScope452.innerHTML = "\n                        <div class=\"account-content\" style=\"cursor:pointer;\">\n                            <div class=\"account-avatar\"><img src=\"" + newScope453 + "\" loading=\"lazy\" decoding=\"async\" style=\"width:100%;height:100%;object-fit:cover;border-radius:50%;\"></div>\n                            <div class=\"account-info\">\n                                <div class=\"account-name\">" + newScope451.name + "</div>\n                                <div class=\"account-detail\">" + (newScope451.subs || "0") + " 订阅者</div>\n                            </div>\n                        </div>\n                    ", newScope452.addEventListener("click", () => {
          scopeValue414.classList.remove("active"), openSubChannelView(newScope451);
        }), newScope449.appendChild(newScope452);
      }), newScope447.appendChild(newScope449), scopeValue414.classList.add("active");
    });
  });
}
const allSubsSheet = document.getElementById("yt-all-subs-sheet");
allSubsSheet?.addEventListener("mousedown", scopeValue432 => {
  if (scopeValue432.target === allSubsSheet) allSubsSheet.classList.remove("active");
});
let currentFilter = "全部";
filterBubbles.forEach(scopeValue433 => {
  scopeValue433.addEventListener("click", () => {
    if (scopeValue433.classList.contains("active")) return;
    filterBubbles.forEach(scopeValue434 => scopeValue434.classList.remove("active"));
    scopeValue433.classList.add("active");
    currentFilter = scopeValue433.textContent;
    renderVideos();
  });
});
function renderVideos() {
  if (!liveSection || !emptyState) return;
  rebuildYoutubeMockVideos();
  const newScope457 = [currentFilter];
  return mockVideos.forEach(newScope458 => {
    const newScope459 = newScope458.channelData;
    if (!newScope459 || newScope459.isSubscribed === false || currentFilter === "正在直播" && !newScope458.isLive) return;
    const newScope460 = newScope459.id === "user_channel_id" ? channelState.activeUserLive : newScope459.generatedContent?.["currentLive"];
    newScope457.push(newScope459.id === "user_channel_id" ? newScope460 : newScope459, newScope459.id, newScope459.name, resolveYtChannelAvatar(newScope459), newScope458.id, newScope458.title, newScope458.titleTranslationZh, newScope458.thumbnail, newScope458.isLive, newScope458.views, newScope458.time, newScope458.viewerCount, newScope458.desc, newScope460?.["comments"], newScope460?.["initialBubbles"], newScope460?.["liveTranscript"], newScope458.guest);
  }), renderYtList(liveSection, newScope457, () => {
    liveSection.innerHTML = "";
    let scopeValue435 = mockVideos;
    currentFilter === "正在直播" && (scopeValue435 = mockVideos.filter(scopeValue438 => scopeValue438.isLive));
    if (scopeValue435.length === 0) {
      liveSection.style.display = "none", emptyState.style.display = "flex", emptyState.querySelector("p").textContent = "暂无符合条件的视频";
      return;
    }
    liveSection.style.display = "flex", emptyState.style.display = "none";
    const scopeValue436 = scopeValue435.filter(scopeValue439 => scopeValue439.channelData && scopeValue439.channelData.isSubscribed !== false);
    if (scopeValue436.length === 0) {
      liveSection.style.display = "none", emptyState.style.display = "flex", emptyState.querySelector("p").textContent = "暂无符合条件的视频";
      return;
    }
    const scopeValue437 = document.createDocumentFragment();
    scopeValue436.forEach((scopeValue440, scopeValue441) => {
      const scopeValue442 = scopeValue440.channelData,
        scopeValue443 = resolveYtChannelAvatar(scopeValue442),
        scopeValue444 = scopeValue440.isLive ? "<div class=\"yt-live-badge\"><i class=\"fas fa-broadcast-tower\" style=\"font-size: 10px;\"></i> LIVE</div>" : "",
        scopeValue445 = document.createElement("div");
      scopeValue445.className = "yt-video-card", scopeValue445.innerHTML = "\n                <div class=\"yt-video-thumbnail\">\n                    <img src=\"" + (scopeValue440.thumbnail || "https://picsum.photos/320/180?grayscale") + "\" alt=\"Thumbnail\" loading=\"" + (scopeValue441 < 2 ? "eager" : "lazy") + "\" decoding=\"async\">\n                    " + scopeValue444 + "\n                </div>\n                <div class=\"yt-video-info\">\n                    <div class=\"yt-video-avatar\" style=\"cursor: pointer; border: 1px solid #e5e5e5; transition: transform 0.2s;\">\n                        <img src=\"" + scopeValue443 + "\" alt=\"" + scopeValue442.name + "\" loading=\"lazy\" decoding=\"async\">\n                    </div>\n                    <div class=\"yt-video-details\">\n                        <h3 class=\"yt-video-title\">" + escapeYtCoreHtml(scopeValue440.title || "无标题") + "</h3>\n                        " + (scopeValue440.titleTranslationZh ? "<div class=\"yt-video-title-translation\">" + escapeYtCoreHtml(scopeValue440.titleTranslationZh) + "</div>" : "") + "\n                        <p class=\"yt-video-meta\">" + escapeYtCoreHtml(scopeValue442.name) + " • " + escapeYtCoreHtml(scopeValue440.views || "0") + " • " + escapeYtCoreHtml(scopeValue440.time || "刚刚") + "</p>\n                    </div>\n                </div>\n            ", scopeValue445.addEventListener("click", () => {
        if (scopeValue442.id === "user_channel_id") {
          if (scopeValue440.isLive) {
            if (typeof window.openYtUserLiveView === "function") window.openYtUserLiveView();else {
              const scopeValue447 = document.getElementById("yt-user-live-view");
              if (scopeValue447) scopeValue447.classList.add("active");
            }
          } else {
            const scopeValue448 = document.querySelector(".yt-nav-item[data-target=\"yt-profile-tab\"]");
            if (scopeValue448) scopeValue448.click();
          }
        } else openVideoPlayer(scopeValue440);
      });
      const scopeValue446 = scopeValue445.querySelector(".yt-video-avatar");
      scopeValue446.addEventListener("click", scopeValue449 => {
        scopeValue449.stopPropagation();
        if (scopeValue442.id === "user_channel_id") {
          const scopeValue450 = document.querySelector(".yt-nav-item[data-target=\"yt-profile-tab\"]");
          if (scopeValue450) scopeValue450.click();
        } else openSubChannelView(scopeValue442);
      }), scopeValue437.appendChild(scopeValue445);
    }), liveSection.appendChild(scopeValue437);
  });
}
function syncYtProfile() {
  const scopeValue451 = document.getElementById("yt-data-center-btn"),
    scopeValue452 = document.getElementById("yt-data-center-sheet");
  scopeValue451 && scopeValue452 && !scopeValue451.dataset.bound && (scopeValue451.dataset.bound = "true", scopeValue451.addEventListener("click", scopeValue454 => {
    scopeValue454.stopPropagation();
    if (window.renderDataCenter) window.renderDataCenter();
    scopeValue452.classList.add("active");
  }));
  const scopeValue453 = typeof window.getYtEffectiveUserState === "function" ? window.getYtEffectiveUserState() : ytUserState;
  if (scopeValue453) {
    ytUserState = scopeValue453;
    const scopeValue455 = scopeValue453.name || "User";
    if (profileName) profileName.textContent = scopeValue455;
    const scopeValue456 = scopeValue453.handle || scopeValue455.toLowerCase().replace(/\s+/g, "");
    if (profileHandle) profileHandle.textContent = "@" + scopeValue456;
    if (scopeValue453.avatarUrl) {
      profileAvatarImg && (profileAvatarImg.src = scopeValue453.avatarUrl, profileAvatarImg.style.display = "block");
      if (profileAvatarIcon) profileAvatarIcon.style.display = "none";
    } else {
      if (profileAvatarImg) profileAvatarImg.style.display = "none";
      if (profileAvatarIcon) profileAvatarIcon.style.display = "block";
    }
    if (channelState.bannerUrl && profileHeaderBg) profileHeaderBg.style.backgroundImage = "url('" + channelState.bannerUrl + "')";else profileHeaderBg && (profileHeaderBg.style.backgroundImage = "none");
    profileSubs && (profileSubs.textContent = (scopeValue453.subs || "0") + " 订阅者");
    profileVideos && (profileVideos.textContent = (scopeValue453.videos || "0") + " 视频");
  }
}
editChannelBtn && editChannelSheet && editChannelBtn.addEventListener("click", () => {
  const scopeValue457 = typeof window.getYtEffectiveUserState === "function" ? window.getYtEffectiveUserState() : ytUserState;
  if (!scopeValue457) return;
  ytUserState = scopeValue457;
  const scopeValue458 = scopeValue457.name || "",
    scopeValue459 = scopeValue457.handle || scopeValue458.toLowerCase().replace(/\s+/g, "");
  if (editNameInput) editNameInput.value = scopeValue458;
  if (editHandleInput) editHandleInput.value = scopeValue459;
  if (editUrlInput) editUrlInput.value = channelState.url || "youtube.com/@" + scopeValue459;
  if (editSubsInput) editSubsInput.value = scopeValue457.subs || "";
  if (editVideosInput) editVideosInput.value = scopeValue457.videos || "";
  if (editPersonaInput) editPersonaInput.value = scopeValue457.persona || "";
  if (scopeValue457.avatarUrl && editAvatarImg) {
    editAvatarImg.src = scopeValue457.avatarUrl;
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
editHandleInput && editUrlInput && editHandleInput.addEventListener("input", scopeValue460 => {
  const scopeValue461 = scopeValue460.target.value.replace(/^@/, "");
  editUrlInput.value = scopeValue461 ? "youtube.com/@" + scopeValue461 : "youtube.com/@";
});
editBannerBtn && bannerUpload && (editBannerBtn.addEventListener("click", () => bannerUpload.click()), bannerUpload.addEventListener("change", scopeValue462 => {
  const scopeValue463 = scopeValue462.target.files[0];
  if (scopeValue463) {
    const scopeValue464 = new FileReader();
    scopeValue464.onload = scopeValue465 => {
      window.compressImage ? window.compressImage(scopeValue465.target.result, 800, 800, scopeValue466 => {
        editBannerImg && (editBannerImg.src = scopeValue466, editBannerImg.style.display = "block");
      }) : editBannerImg && (editBannerImg.src = scopeValue465.target.result, editBannerImg.style.display = "block");
    };
    scopeValue464.readAsDataURL(scopeValue463);
  }
}));
editAvatarWrapper && avatarUpload && (editAvatarWrapper.addEventListener("click", scopeValue467 => {
  scopeValue467.target.tagName !== "INPUT" && (scopeValue467.preventDefault(), avatarUpload.click());
}), avatarUpload.addEventListener("change", scopeValue468 => {
  const scopeValue469 = scopeValue468.target.files[0];
  if (scopeValue469) {
    const scopeValue470 = new FileReader();
    scopeValue470.onload = scopeValue471 => {
      if (window.compressImage) window.compressImage(scopeValue471.target.result, 300, 300, scopeValue472 => {
        editAvatarImg && (editAvatarImg.src = scopeValue472, editAvatarImg.style.display = "block");
        if (editAvatarIcon) editAvatarIcon.style.display = "none";
      });else {
        editAvatarImg && (editAvatarImg.src = scopeValue471.target.result, editAvatarImg.style.display = "block");
        if (editAvatarIcon) editAvatarIcon.style.display = "none";
      }
    };
    scopeValue470.readAsDataURL(scopeValue469);
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
editChannelSheet && editChannelSheet.addEventListener("mousedown", scopeValue473 => {
  scopeValue473.target === editChannelSheet && editChannelSheet.classList.remove("active");
});
function refreshYoutubeUiAfterHydration() {
  updateYtMessageUnreadIndicators();
  if (!ytView || !ytView.classList.contains("active")) return;
  syncYtProfile();
  document.getElementById("yt-home-tab")?.classList.contains("active") && (renderSubscriptions(), renderVideos());
  const scopeValue474 = document.querySelector(".yt-nav-item.active");
  scopeValue474?.getAttribute("data-target") === "yt-messages-tab" && renderMessagesList();
}
window.globalDataReadyPromise && typeof window.globalDataReadyPromise.then === "function" ? window.youtubeDataReadyPromise = window.globalDataReadyPromise.then(() => {
  return loadYoutubeData(), refreshYoutubeUiAfterHydration(), true;
})["catch"](scopeValue475 => {
  return console.warn("YouTube global data recovery failed:", scopeValue475), false;
}) : window.youtubeDataReadyPromise = Promise.resolve(true);
