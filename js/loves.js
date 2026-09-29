window.lovesApp = {
  view: null,
  backBtn: null,
  initialized: false,
  currentWeiboAccount: "main",
  currentComputerApp: null,
  currentFriend: null,
  currentSelectedFriendId: null,
  lovesProgrammaticScrollUntil: 0,
  _realTimeJobsStarted: false,
  _realTimeTimer: null,
  _momentReplyQueues: new Map(),
  _androidFocusScopeCleanup: null,
  persistFriendState: async function (value_2 = this.currentFriend, value_3 = {}) {
    if (!value_2) return false;
    if (window.imApp && typeof window.imApp.commitScopedFriendChange === "function") {
      const value_4 = await window.imApp.commitScopedFriendChange(value_2, currentFriend_5 => {
        this.currentFriend && String(this.currentFriend.id) === String(currentFriend_5.id) && (this.currentFriend = currentFriend_5);
      }, {
        silent: value_3.silent !== false,
        syncActive: true,
        metaOnly: value_3.metaOnly === true
      });
      return !!value_4;
    }
    if (typeof window.saveGlobalData === "function") return await window.saveGlobalData(), true;
    return false;
  },
  bindLongPress: function (element_2, callback) {
    let pressTimer = null,
      count = 0,
      count_7 = 0;
    const start = e => {
        if (e.type === "mousedown" && e.button !== 0) return;
        e.type === "touchstart" ? (count = e.touches[0].clientX, count_7 = e.touches[0].clientY) : (count = e.clientX, count_7 = e.clientY);
        pressTimer === null && (pressTimer = setTimeout(() => {
          pressTimer = null;
          callback(e);
        }, 600));
      },
      cancel = () => {
        pressTimer !== null && (clearTimeout(pressTimer), pressTimer = null);
      },
      move = e_2 => {
        if (pressTimer === null) return;
        let currentX = e_2.type === "touchmove" ? e_2.touches[0].clientX : e_2.clientX,
          currentY = e_2.type === "touchmove" ? e_2.touches[0].clientY : e_2.clientY;
        (Math.abs(currentX - count) > 10 || Math.abs(currentY - count_7) > 10) && cancel();
      };
    element_2.addEventListener("mousedown", start);
    element_2.addEventListener("touchstart", start, {
      passive: true
    });
    element_2.addEventListener("mousemove", move);
    element_2.addEventListener("touchmove", move, {
      passive: true
    });
    element_2.addEventListener("mouseup", cancel);
    element_2.addEventListener("touchend", cancel);
    element_2.addEventListener("mouseleave", cancel);
    element_2.addEventListener("touchcancel", cancel);
  },
  showDeleteConfirm: function (text_2, onConfirm) {
    const result_2 = window.confirm("确定要删除 \"" + text_2 + "\" 吗？");
    if (result_2) {
      Promise.resolve(onConfirm()).then(() => {});
      if (window.showToast) window.showToast("已删除");
    }
  },
  escapeHTML: function (value_7) {
    return String(value_7 ?? "").replace(/[&<>"']/g, char_2 => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    })[char_2]);
  },
  normalizeFriendPhoneLanguage: function (value_13) {
    if (window.imDataUtils?.normalizeChatLanguage) return window.imDataUtils.normalizeChatLanguage(value_13 || "zh");
    const language_2 = String(value_13 || "zh").trim().toLowerCase();
    if (["zh", "cn", "zh-cn"].includes(language_2)) return "zh";
    if (["ko", "kr"].includes(language_2)) return "ko";
    if (["ja", "jp"].includes(language_2)) return "ja";
    return language_2 || "zh";
  },
  getFriendPhoneLanguageName: function (value_14) {
    if (window.imDataUtils?.getChatLanguageName) return window.imDataUtils.getChatLanguageName(value_14 || "zh");
    return {
      zh: "Chinese",
      en: "English",
      ja: "Japanese",
      ko: "Korean",
      fr: "French"
    }[this.normalizeFriendPhoneLanguage(value_14)] || String(value_14 || "Chinese");
  },
  resolveLovesMomentLanguage: function (friend = this.currentFriend) {
    return this.normalizeFriendPhoneLanguage(friend?.language || "zh");
  },
  buildLovesMomentLocalizationContract: function (value_20 = this.currentFriend, subject_2 = "content") {
    const language_3 = this.resolveLovesMomentLanguage(value_20);
    if (window.imDataUtils?.buildLocalizedJsonContract) return window.imDataUtils.buildLocalizedJsonContract(language_3, subject_2);
    const friendPhoneLanguageName = this.getFriendPhoneLanguageName(language_3);
    return language_3 === "zh" ? subject_2 + ".text must be natural Simplified Chinese and " + subject_2 + ".translation must be an empty string." : subject_2 + ".text must be written only in " + friendPhoneLanguageName + "; " + subject_2 + ".translation is mandatory and must be a natural accurate Simplified Chinese translation of that text.";
  },
  normalizeLovesMomentLocalizedContent: function (value_16, value_23 = this.currentFriend) {
    const language_4 = this.resolveLovesMomentLanguage(value_23);
    if (window.imDataUtils?.normalizeLocalizedContent) return window.imDataUtils.normalizeLocalizedContent(value_16, language_4);
    const source_2 = value_16 && typeof value_16 === "object" ? value_16 : {
        text: value_16
      },
      text_3 = String(source_2.text ?? source_2.content ?? "").trim();
    let translation_2 = String(source_2.translation ?? source_2.translationZh ?? "").trim();
    if (!text_3) return null;
    if (language_4 === "zh") translation_2 = "";
    if (language_4 !== "zh" && !translation_2) return null;
    return {
      text: text_3,
      translation: translation_2,
      language: language_4
    };
  },
  getLovesMomentTranslation: function (record) {
    if (!record || typeof record !== "object") return "";
    return String(record.translation ?? record.translationZh ?? record.textTranslationZh ?? record.textTranslation ?? "").trim();
  },
  renderLovesMomentTranslation: function (value_28, value_29) {
    const trim_30 = String(value_28 || "").trim();
    if (!trim_30) return "";
    const escapeHTML_31 = this.escapeHTML(value_29);
    return "<button type=\"button\" class=\"loves-moment-translate-toggle\" aria-expanded=\"false\" aria-controls=\"" + escapeHTML_31 + "\" data-loves-translation-target=\"" + escapeHTML_31 + "\">翻译</button><div class=\"loves-moment-translation\" id=\"" + escapeHTML_31 + "\" hidden>" + this.escapeHTML(trim_30).replace(/\n/g, "<br>") + "</div>";
  },
  bindLovesMomentTranslationControls: function (container) {
    if (!container) return;
    container.querySelectorAll(".loves-moment-translate-toggle").forEach(control_2 => {
      const handleClick = event_34 => {
        event_34.preventDefault();
        event_34.stopPropagation();
        const targetId = control_2.getAttribute("data-loves-translation-target"),
          translation_3 = targetId ? document.getElementById(targetId) : null;
        if (!translation_3) return;
        const hidden_2 = control_2.getAttribute("aria-expanded") === "true";
        control_2.setAttribute("aria-expanded", String(!hidden_2));
        control_2.textContent = hidden_2 ? "翻译" : "收起";
        translation_3.hidden = hidden_2;
      };
      control_2.addEventListener("click", handleClick);
    });
  },
  formatFriendPhoneGeneratedAt: function (value_37, value_38 = Date.now()) {
    const timestamp_2 = Number(value_37);
    if (!Number.isFinite(timestamp_2) || timestamp_2 <= 0) return "";
    const date_2 = new Date(timestamp_2);
    if (Number.isNaN(date_2.getTime())) return "";
    const now_2 = new Date(value_38),
      value_41 = value_44 => String(value_44).padStart(2, "0"),
      value_42 = value_41(date_2.getHours()) + ":" + value_41(date_2.getMinutes()),
      isToday = !Number.isNaN(now_2.getTime()) && date_2.getFullYear() === now_2.getFullYear() && date_2.getMonth() === now_2.getMonth() && date_2.getDate() === now_2.getDate();
    return isToday ? value_42 : date_2.getFullYear() + "/" + value_41(date_2.getMonth() + 1) + "/" + value_41(date_2.getDate()) + " " + value_42;
  },
  getFriendPhoneTranslation: function (value_45, value_46) {
    if (!value_45 || typeof value_45 !== "object") return "";
    return String(value_45[value_46 + "TranslationZh"] ?? value_45[value_46 + "Translation"] ?? (value_46 === "text" ? value_45.translationZh ?? value_45.translation : "") ?? "").trim();
  },
  getFriendPhoneChineseContactName: function (record_2, field = "name", fallback_2 = "未知联系人") {
    if (!record_2 || typeof record_2 !== "object") return String(fallback_2 || "未知联系人");
    const fallbackName = String(fallback_2 || "未知联系人"),
      translation_4 = this.getFriendPhoneTranslation(record_2, field),
      original_2 = String(record_2[field] ?? "").trim(),
      hasChinese = value_18 => /[\u3400-\u9fff]/.test(String(value_18 || ""));
    if (hasChinese(translation_4)) return translation_4;
    if (hasChinese(original_2)) return original_2;
    return fallbackName;
  },
  renderFriendPhoneLocalized: function (record_3, field_2, options_2 = {}) {
    const original_3 = this.escapeHTML(record_3?.[field_2] ?? options_2.fallback ?? "").replace(/\n/g, "<br>"),
      translation_5 = this.escapeHTML(this.getFriendPhoneTranslation(record_3, field_2)).replace(/\n/g, "<br>");
    if (!translation_5) return original_3;
    const value_58 = "friend-phone-translation-" + String(record_3?.batchId || "legacy") + "-" + String(options_2.id || field_2) + "-" + Math.random().toString(36).slice(2, 8);
    return original_3 + "<span class=\"friend-phone-translate-toggle\" role=\"button\" tabindex=\"0\" aria-expanded=\"false\" aria-controls=\"" + value_58 + "\">Translate</span><span class=\"friend-phone-translation\" id=\"" + value_58 + "\" hidden>" + translation_5 + "</span>";
  },
  renderFriendPhoneGeneratedTime: function (record_4, value_60 = "") {
    const formatFriendPhoneGeneratedAt_61 = this.formatFriendPhoneGeneratedAt(record_4?.generatedAt);
    return formatFriendPhoneGeneratedAt_61 ? "<span class=\"friend-phone-generated-time " + value_60 + "\">" + this.escapeHTML(formatFriendPhoneGeneratedAt_61) + "</span>" : "";
  },
  bindFriendPhoneTranslationDelegation: function (phoneView) {
    if (!phoneView || phoneView.dataset.translationBound === "1") return;
    const toggle_2 = control_3 => {
      const targetId_2 = control_3.getAttribute("aria-controls"),
        target_2 = targetId_2 ? document.getElementById(targetId_2) : control_3.querySelector(".friend-phone-translation");
      if (!target_2) return;
      const hidden_3 = control_3.getAttribute("aria-expanded") === "true";
      control_3.setAttribute("aria-expanded", String(!hidden_3));
      target_2.hidden = hidden_3;
    };
    phoneView.addEventListener("click", event_2 => {
      const control = event_2.target.closest(".friend-phone-translate-toggle, .friend-phone-bubble-translatable");
      if (!control || !phoneView.contains(control)) return;
      event_2.preventDefault();
      event_2.stopPropagation();
      toggle_2(control);
    }, true);
    phoneView.addEventListener("keydown", event_3 => {
      if (!["Enter", " "].includes(event_3.key)) return;
      const control_4 = event_3.target.closest(".friend-phone-translate-toggle, .friend-phone-bubble-translatable");
      if (!control_4 || !phoneView.contains(control_4)) return;
      event_3.preventDefault();
      toggle_2(control_4);
    });
    phoneView.dataset.translationBound = "1";
  },
  stripAndStampFriendPhoneGeneratedTree: function (value_24, generatedAt_2, batchId_2) {
    if (Array.isArray(value_24)) return value_24.map(item_2 => this.stripAndStampFriendPhoneGeneratedTree(item_2, generatedAt_2, batchId_2));
    if (!value_24 || typeof value_24 !== "object") return value_24;
    const blockedTimeKeys = new Set(["time", "createdAt", "timestamp", "addedTime", "recentCallTime", "date", "datetime"]),
      output = {};
    return Object.entries(value_24).forEach(([key_2, item_3]) => {
      if (blockedTimeKeys.has(key_2)) return;
      output[key_2] = this.stripAndStampFriendPhoneGeneratedTree(item_3, generatedAt_2, batchId_2);
    }), output.generatedAt = generatedAt_2, output.batchId = batchId_2, output;
  },
  validateFriendPhoneLocalizedTree: function (value_76, language_5, value_78 = "root") {
    if (this.normalizeFriendPhoneLanguage(language_5) === "zh") return [];
    const machineFields = new Set(["id", "batchId", "kind", "sender", "type", "icon", "color", "cardNumber", "loops", "steps", "sleepHours", "sleepMinutes", "heartRate", "weight", "height", "totalAssets", "amount", "isIncome", "reposts", "likes", "url", "avatarUrl", "result", "kda", "winRate"]),
      missingPaths = [],
      isChineseOnlyContactField = (key_3, currentPath) => {
        if (key_3 === "contactName" || key_3 === "userRemark") return true;
        return key_3 === "name" && /^phone\.call\.(?:recentCalls|contacts)\[\d+\]$/.test(currentPath);
      },
      isUnrestrictedLanguageField = (key_4, currentPath_2) => {
        if (key_4 === "name" && /^phone\.music\.(?:recent|favorites|top)\[\d+\]$/.test(currentPath_2)) return true;
        if (currentPath_2.startsWith("phone.weibo")) return key_4 !== "text";
        if (currentPath_2.startsWith("phone.files")) return key_4 !== "content";
        if (!currentPath_2.startsWith("phone.game")) return false;
        return !["desc", "innerThoughts", "postGameReflection", "thoughts"].includes(key_4);
      },
      value_83 = (items_87, value_88) => {
        if (Array.isArray(items_87)) return items_87.forEach((value_89, value_90) => value_83(value_89, value_88 + "[" + value_90 + "]"));
        if (!items_87 || typeof items_87 !== "object") return;
        Object.entries(items_87).forEach(([key_5, value_92]) => {
          if (key_5.endsWith("TranslationZh") || key_5.endsWith("Translation") || key_5 === "translationZh" || key_5 === "translation") return;
          if (typeof value_92 === "string" && value_92.trim() && !machineFields.has(key_5) && !isChineseOnlyContactField(key_5, value_88) && !isUnrestrictedLanguageField(key_5, value_88)) {
            const trim_93 = String(items_87[key_5 + "TranslationZh"] ?? (key_5 === "text" ? items_87.translationZh ?? items_87.translation : "") ?? "").trim();
            if (!trim_93) missingPaths.push(value_88 + "." + key_5);
          } else {
            if (value_92 && typeof value_92 === "object") value_83(value_92, value_88 + "." + key_5);
          }
        });
      };
    value_83(value_76, value_78);
    if (missingPaths.length) console.warn("[Loves] 好友手机内容缺少中文翻译，已按原文降级展示：", missingPaths);
    return missingPaths;
  },
  clearFriendPhoneChineseTranslations: function (value_25) {
    if (Array.isArray(value_25)) return value_25.forEach(item_4 => this.clearFriendPhoneChineseTranslations(item_4));
    if (!value_25 || typeof value_25 !== "object") return;
    Object.keys(value_25).forEach(key_6 => {
      if (key_6.endsWith("TranslationZh") || key_6 === "translationZh" || key_6 === "translation") value_25[key_6] = "";else this.clearFriendPhoneChineseTranslations(value_25[key_6]);
    });
  },
  mergeFriendPhoneNamedRecords: function (value_97, items_98, key_7 = "name", mergeItem = null) {
    const remaining = Array.isArray(items_98) ? items_98.slice() : [];
    return (Array.isArray(value_97) ? value_97 : []).map(item_5 => {
      const index_2 = remaining.findIndex(existing => String(existing?.[key_7] || "").trim().toLocaleLowerCase() === String(item_5?.[key_7] || "").trim().toLocaleLowerCase()),
        existing_2 = index_2 >= 0 ? remaining.splice(index_2, 1)[0] : null;
      return mergeItem && existing_2 ? mergeItem(item_5, existing_2) : item_5;
    }).concat(remaining);
  },
  normalizeFriendPhoneWeiboPostComments: function (posts_2, max_2 = 5) {
    if (!Array.isArray(posts_2)) return [];
    const safeMax = this.clampFriendGenCount(max_2, 5, 1, 20);
    return posts_2.map(post => {
      if (!post || typeof post !== "object" || Array.isArray(post)) return post;
      return {
        ...post,
        comments: Array.isArray(post.comments) ? post.comments.filter(comment => comment && (typeof comment === "object" || typeof comment === "string")).slice(0, safeMax) : []
      };
    });
  },
  mergeFriendPhoneGeneratedData: function (friend_2, parsed_2, options_3 = {}) {
    const generatedAt_3 = Number(options_3.generatedAt) || Date.now(),
      batchId_3 = options_3.batchId || "phone-" + generatedAt_3 + "-" + Math.random().toString(36).slice(2, 8),
      language_6 = this.normalizeFriendPhoneLanguage(friend_2?.language || "zh"),
      clean = this.stripAndStampFriendPhoneGeneratedTree(parsed_2, generatedAt_3, batchId_3);
    if (language_6 === "zh") this.clearFriendPhoneChineseTranslations(clean);
    if (options_3.skipValidation !== true) this.validateFriendPhoneLocalizedTree(clean, language_6, "phone");
    const next_2 = {};
    if (clean.music) {
      const normalizeSong = value_114 => {
        const options_115 = {
          ...(value_114 || {})
        };
        return delete options_115.nameTranslationZh, delete options_115.nameTranslation, options_115;
      };
      next_2.musicData = {
        ...clean.music,
        recent: Array.isArray(clean.music.recent) ? clean.music.recent.map(normalizeSong) : [],
        favorites: Array.isArray(clean.music.favorites) ? clean.music.favorites.map(normalizeSong) : [],
        top: Array.isArray(clean.music.top) ? clean.music.top.map(normalizeSong) : []
      };
    }
    if (clean.health) {
      const snapshot = {
        ...clean.health,
        generatedAt: generatedAt_3,
        batchId: batchId_3
      };
      next_2.healthData = {
        ...snapshot,
        history: [snapshot]
      };
    }
    if (clean.pay) {
      const snapshot_2 = {
        ...clean.pay,
        generatedAt: generatedAt_3,
        batchId: batchId_3
      };
      next_2.payData = {
        ...snapshot_2,
        recentTransactions: Array.isArray(clean.pay.recentTransactions) ? clean.pay.recentTransactions : [],
        snapshots: [snapshot_2]
      };
    }
    if (clean.safari) next_2.safariData = {
      recentSearches: Array.isArray(clean.safari.recentSearches) ? clean.safari.recentSearches : [],
      privateSearches: Array.isArray(clean.safari.privateSearches) ? clean.safari.privateSearches : []
    };
    if (clean.call) next_2.callData = {
      ...clean.call,
      recentCalls: Array.isArray(clean.call.recentCalls) ? clean.call.recentCalls : [],
      contacts: Array.isArray(clean.call.contacts) ? clean.call.contacts : []
    };
    if (clean.files) next_2.filesData = {
      ...clean.files,
      tags: Array.isArray(clean.files.tags) ? clean.files.tags : [],
      recent: Array.isArray(clean.files.recent) ? clean.files.recent : []
    };
    if (clean.game) {
      const stripTranslations = (value_119, items_120) => {
          const options_121 = {
            ...(value_119 || {})
          };
          return items_120.forEach(value_122 => {
            delete options_121[value_122 + "TranslationZh"];
            delete options_121[value_122 + "Translation"];
          }), options_121;
        },
        gameRoot = stripTranslations(clean.game, ["playerName", "totalHours"]);
      next_2.gameData = {
        ...gameRoot,
        recentGames: Array.isArray(clean.game.recentGames) ? clean.game.recentGames.map(game_2 => {
          const normalizedGame = stripTranslations(game_2, ["name", "hours", "rank", "winRate"]);
          return {
            ...normalizedGame,
            matches: Array.isArray(game_2?.matches) ? game_2.matches.map(match_2 => stripTranslations(match_2, ["result", "kda", "hero"])) : game_2?.matches
          };
        }) : []
      };
    }
    if (clean.weibo) {
      const replaceAccount = fresh => ({
        ...(fresh || {}),
        posts: Array.isArray(fresh?.posts) ? fresh.posts : [],
        album: Array.isArray(fresh?.album) ? fresh.album : [],
        liked: Array.isArray(fresh?.liked) ? fresh.liked : []
      });
      next_2.weiboData = {
        mainAccount: replaceAccount(clean.weibo.mainAccount || clean.weibo.main || clean.weibo),
        altAccount: replaceAccount(clean.weibo.altAccount || clean.weibo.alt || {})
      };
    }
    return {
      next: next_2,
      generatedAt: generatedAt_3,
      batchId: batchId_3
    };
  },
  getLocalDateKey: function (value_126 = new Date()) {
    const date_3 = value_126 instanceof Date ? value_126 : new Date(value_126);
    if (Number.isNaN(date_3.getTime())) return this.getLocalDateKey(new Date());
    const fullYear = date_3.getFullYear(),
      padStart_128 = String(date_3.getMonth() + 1).padStart(2, "0"),
      day = String(date_3.getDate()).padStart(2, "0");
    return fullYear + "-" + padStart_128 + "-" + day;
  },
  parseDateKey: function (dateKey) {
    if (!dateKey || typeof dateKey !== "string") return new Date();
    const parts = dateKey.split("-").map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return new Date();
    return new Date(parts[0], parts[1] - 1, parts[2]);
  },
  getLocalDayOrdinal: function (value_26 = new Date()) {
    const date_4 = value_26 instanceof Date ? value_26 : new Date(value_26);
    if (Number.isNaN(date_4.getTime())) return this.getLocalDayOrdinal(new Date());
    return Math.floor(Date.UTC(date_4.getFullYear(), date_4.getMonth(), date_4.getDate()) / 86400000);
  },
  addLocalDateDays: function (value_132, value_133 = 1) {
    const baseDate = this.parseDateKey(value_132);
    return baseDate.setDate(baseDate.getDate() + value_133), this.getLocalDateKey(baseDate);
  },
  findLovesAcceptanceTimestamp: function (value_135) {
    const messages_2 = Array.isArray(value_135?.messages) ? value_135.messages : [],
      acceptedMessage = messages_2.find(message_2 => {
        const text_4 = String(message_2?.text || message_2?.content || "");
        return text_4.includes("[ACCEPT_INVITE]") || text_4.includes("【邀请已接受】") || text_4.includes("【情侣空间】我接受了你的邀请") || text_4.includes("TA 已接受了你的情侣空间邀请") || text_4.includes("我已经接受了你的情侣空间邀请");
      }),
      timestamp_3 = Number(acceptedMessage?.timestamp);
    return Number.isFinite(timestamp_3) && timestamp_3 > 0 ? timestamp_3 : 0;
  },
  ensureLovesStartTime: function (friend_3, fallbackTimestamp = Date.now()) {
    if (!friend_3 || !friend_3.hasLovesSpace) return {
      timestamp: 0,
      changed: false
    };
    const timestamp_4 = Number(friend_3.lovesSpaceStartTime);
    if (Number.isFinite(timestamp_4) && timestamp_4 > 0) return {
      timestamp: timestamp_4,
      changed: false
    };
    const recovered = this.findLovesAcceptanceTimestamp(friend_3),
      fallback_3 = Number(fallbackTimestamp),
      value_145 = recovered || (Number.isFinite(fallback_3) && fallback_3 > 0 ? fallback_3 : Date.now());
    return friend_3.lovesSpaceStartTime = value_145, {
      timestamp: value_145,
      changed: true
    };
  },
  getLovesDaysCount: function (friend_4, now_3 = new Date()) {
    const startTimestamp = Number(friend_4?.lovesSpaceStartTime);
    if (!Number.isFinite(startTimestamp) || startTimestamp <= 0) return 1;
    const startDay = this.getLocalDayOrdinal(new Date(startTimestamp)),
      currentDay = this.getLocalDayOrdinal(now_3);
    return Math.max(1, currentDay - startDay + 1);
  },
  syncDailySavingsForFriend: async function (friend_5, now_4 = new Date(), value_152 = {}) {
    if (!friend_5 || !friend_5.hasLovesSpace) return false;
    const startState_2 = this.ensureLovesStartTime(friend_5, now_4.getTime()),
      startDateKey = this.getLocalDateKey(startState_2.timestamp),
      todayKey = this.getLocalDateKey(now_4),
      savings_2 = this.ensureSavingsData(friend_5),
      existingDailyDates = new Set(savings_2.records.filter(record_5 => record_5?.source === "char_daily" || String(record_5?.id || "").startsWith("sav_char_daily_")).map(record_6 => record_6.date).filter(Boolean));
    let cursor_2 = this.getLocalDayOrdinal(this.parseDateKey(startDateKey)) > this.getLocalDayOrdinal(now_4) ? todayKey : startDateKey,
      changed_156 = startState_2.changed,
      count_157 = 0;
    while (cursor_2 <= todayKey && count_157 < 20000) {
      if (!existingDailyDates.has(cursor_2)) {
        const isToday_2 = cursor_2 === todayKey,
          recordDate = isToday_2 ? new Date(now_4) : this.parseDateKey(cursor_2);
        if (!isToday_2) recordDate.setHours(12, 0, 0, 0);
        savings_2.records.unshift({
          id: "sav_char_daily_" + cursor_2,
          amount: Math.floor(Math.random() * 100) + 1,
          actor: "char",
          date: cursor_2,
          note: "Char 每日存钱",
          source: "char_daily",
          timestamp: recordDate.getTime()
        });
        existingDailyDates.add(cursor_2);
        changed_156 = true;
      }
      if (cursor_2 === todayKey) break;
      cursor_2 = this.addLocalDateDays(cursor_2, 1);
      count_157 += 1;
    }
    return changed_156 && value_152.persist !== false && (await this.persistFriendState(friend_5, {
      metaOnly: true,
      silent: true
    })), changed_156;
  },
  syncAllLovesRealTimeData: async function () {
    if (window.imApp?.ensureDataReady) await window.imApp.ensureDataReady();
    const items_162 = Array.isArray(window.imData?.friends) ? window.imData.friends : [],
      filter_163 = items_162.filter(value_164 => this.isLovesChar(value_164) && value_164.hasLovesSpace);
    for (const value_165 of filter_163) {
      !Number(value_165.lovesSpaceStartTime) && window.imApp?.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(value_165));
      await this.syncDailySavingsForFriend(value_165);
    }
    if (this.currentFriend?.hasLovesSpace) this.updateDaysCount(this.currentFriend);
    document.getElementById("lovers-savings-view")?.classList.contains("active") && this.renderSavingsJar();
  },
  scheduleNextRealTimeSync: function () {
    if (this._realTimeTimer) clearTimeout(this._realTimeTimer);
    const now_5 = new Date(),
      nextMidnight = new Date(now_5);
    nextMidnight.setHours(24, 0, 1, 0);
    this._realTimeTimer = setTimeout(async () => {
      await this.syncAllLovesRealTimeData();
      this.scheduleNextRealTimeSync();
    }, Math.max(1000, nextMidnight.getTime() - now_5.getTime()));
  },
  startRealTimeJobs: function () {
    if (this._realTimeJobsStarted) return;
    this._realTimeJobsStarted = true;
    const refresh = () => {
      void this.syncAllLovesRealTimeData()["finally"](() => this.scheduleNextRealTimeSync());
    };
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") refresh();
    });
    window.addEventListener("focus", refresh);
    refresh();
  },
  formatMoney: function (amount_2) {
    const value_27 = Number(amount_2) || 0;
    return "¥" + value_27.toLocaleString("zh-CN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  },
  init: function () {
    if (this.initialized) return;
    this.view = document.getElementById("lovers-space-view");
    this.backBtn = document.getElementById("lovers-space-back-btn");
    if (!this.view) return;
    this.bindAndroidInputFocusScope();
    this.bindEvents();
    this.bindLauncherButton();
    this.initialized = true;
    this.startRealTimeJobs();
    console.log("Loves app initialized");
  },
  bindAndroidInputFocusScope: function () {
    if (!window.mobileInputCompat?.registerFocusScope) return;
    !this._androidFocusScopeCleanup && (this._androidFocusScopeCleanup = window.mobileInputCompat.registerFocusScope({
      selector: "#lovers-space-view, #lovers-savings-view, #lovers-friend-phone-view, #lovers-friend-computer-view, .bottom-sheet-overlay[id^=\"lovers-\"], .bottom-sheet-overlay[id^=\"friend-\"]"
    }));
    !this._androidSavingsFocusScopeCleanup && (this._androidSavingsFocusScopeCleanup = window.mobileInputCompat.registerFocusScope({
      selector: "#lovers-savings-settings-sheet, #lovers-savings-deposit-sheet, #lovers-savings-withdraw-sheet",
      priority: 20,
      preferFocusScope: true,
      resolveScrollContainer: (value_170, element_171) => element_171?.querySelector(".bottom-sheet") || null,
      scrollBehavior: "focus"
    }));
  },
  bindEvents: function () {
    this.backBtn && this.backBtn.addEventListener("click", () => {
      this.close();
    });
    document.getElementById("lovers-space-avatar-switch")?.addEventListener("click", () => this.openCharSwitch());
    document.getElementById("lovers-char-switch-close")?.addEventListener("click", () => this.closeCharSwitch());
    document.getElementById("lovers-char-switch-overlay")?.addEventListener("click", event_172 => {
      if (event_172.target.id === "lovers-char-switch-overlay") this.closeCharSwitch();
    });
    document.getElementById("lovers-char-switch-list")?.addEventListener("click", event_173 => {
      const closest_174 = event_173.target.closest("[data-loves-char-id]");
      if (!closest_174) return;
      const result_175 = this.getTopFriends().find(value_176 => String(value_176.id) === closest_174.dataset.lovesCharId);
      result_175 && (this.closeCharSwitch(), this.enterLovesSpace(result_175));
    });
    document.getElementById("lovers-space-invite-btn")?.addEventListener("click", () => {
      const currentChar = this.getCurrentChar();
      if (currentChar && !currentChar.hasLovesSpace && !currentChar.pendingLovesInvite) void this.sendInviteCard(currentChar);
    });
    window.addEventListener?.("u2:friend-removed", () => {
      if (this.view?.classList.contains("active")) this.refreshSelectedChar();
    });
    document.addEventListener("imessage-data-ready", () => {
      if (this.view?.classList.contains("active")) this.refreshSelectedChar();
    });
    !this._sharedSavingsDelegated && (document.addEventListener("click", e_3 => {
      const savingsBtn = e_3.target.closest("#lovers-shared-savings-btn");
      if (!savingsBtn) return;
      e_3.preventDefault();
      e_3.stopPropagation();
      const friendId_2 = savingsBtn.dataset.friendId;
      !this.currentFriend && friendId_2 && (this.currentFriend = window.imData?.friends?.find(friend_6 => String(friend_6.id) === String(friendId_2)) || null);
      this.openSavingsJar();
    }), this._sharedSavingsDelegated = true);
    !this._anniversaryBound && (document.getElementById("lovers-anniversary-back")?.addEventListener("click", () => this.closeAnniversaryView()), document.getElementById("lovers-anniversary-add")?.addEventListener("click", () => this.openAnniversaryEditor()), document.getElementById("lovers-anniversary-cancel")?.addEventListener("click", () => this.closeAnniversaryEditor()), document.getElementById("lovers-anniversary-form")?.addEventListener("submit", event_181 => {
      event_181.preventDefault();
      void this.saveAnniversary();
    }), document.getElementById("lovers-anniversary-delete")?.addEventListener("click", () => void this.deleteAnniversary()), document.getElementById("lovers-anniversary-list")?.addEventListener("click", event_182 => {
      const closest_183 = event_182.target.closest("[data-anniversary-id]");
      if (closest_183) this.openAnniversaryEditor(closest_183.dataset.anniversaryId);
    }), this._anniversaryBound = true);
    const loversSpaceMenuBtnElement = document.getElementById("lovers-space-menu-btn");
    loversSpaceMenuBtnElement && loversSpaceMenuBtnElement.dataset.lovesUnbindBound !== "true" && (loversSpaceMenuBtnElement.dataset.lovesUnbindBound = "true", loversSpaceMenuBtnElement.addEventListener("click", event_184 => {
      event_184.preventDefault();
      event_184.stopPropagation();
      this.openUnbindMenu();
    }));
  },
  ensureUnbindMenu: function () {
    let localized = document.getElementById("lovers-unbind-sheet");
    if (localized) return localized;
    return localized = document.createElement("div"), localized.id = "lovers-unbind-sheet", localized.className = "bottom-sheet-overlay detail-sheet-overlay lovers-unbind-sheet", localized.innerHTML = "\n            <div class=\"bottom-sheet lovers-unbind-panel\">\n                <div class=\"sheet-handle\"></div>\n                <div class=\"lovers-unbind-sheet-title\">Loves 设置</div>\n                <button type=\"button\" id=\"lovers-unbind-action\" class=\"lovers-unbind-action\">解绑</button>\n                <button type=\"button\" id=\"lovers-unbind-cancel\" class=\"lovers-unbind-cancel\">取消</button>\n            </div>\n        ", (document.getElementById("app") || document.body).appendChild(localized), localized.addEventListener("click", event_185 => {
      if (event_185.target === localized) window.closeView?.(localized);
    }), localized.querySelector("#lovers-unbind-cancel")?.addEventListener("click", () => window.closeView?.(localized)), localized;
  },
  openUnbindMenu: function () {
    const currentFriend_6 = (window.imData?.friends || []).find(value_188 => String(value_188.id) === String(this.currentFriend?.id)) || this.currentFriend;
    if (!currentFriend_6 || currentFriend_6.hasLovesSpace !== true) {
      window.showToast?.("当前没有可解绑的 Loves 关系");
      return;
    }
    this.currentFriend = currentFriend_6;
    const unbindMenu = this.ensureUnbindMenu(),
      loversUnbindActionElement = unbindMenu.querySelector("#lovers-unbind-action"),
      disabled_2 = !!window.imApp?.getPendingLovesUnbindRequest?.(currentFriend_6);
    loversUnbindActionElement && (loversUnbindActionElement.disabled = disabled_2, loversUnbindActionElement.textContent = disabled_2 ? "解绑申请处理中" : "解绑", loversUnbindActionElement.onclick = () => {
      if (!disabled_2) void this.requestLovesUnbind(currentFriend_6, unbindMenu);
    });
    window.openView ? window.openView(unbindMenu) : unbindMenu.style.display = "flex";
  },
  requestLovesUnbind: async function (value_189, element_190 = null) {
    const value_191 = (window.imData?.friends || []).find(value_193 => String(value_193.id) === String(value_189?.id)) || value_189;
    if (!value_191 || value_191.hasLovesSpace !== true) return;
    if (window.imApp?.getPendingLovesUnbindRequest?.(value_191)) {
      window.showToast?.("已有待处理的解绑申请");
      return;
    }
    if (!window.confirm("确定要向 " + (value_191.nickname || value_191.realname || "对方") + " 申请解除 Loves 关系吗？")) return;
    const loversUnbindActionElement_192 = element_190?.querySelector("#lovers-unbind-action");
    if (loversUnbindActionElement_192) loversUnbindActionElement_192.disabled = true;
    try {
      const value_194 = await window.imApp?.submitLovesUnbindRequest?.(value_191);
      if (!value_194) throw new Error("解绑申请发送失败");
      window.closeView?.(element_190);
      const loversSpaceViewElement = document.getElementById("lovers-space-view");
      if (loversSpaceViewElement) window.closeView ? window.closeView(loversSpaceViewElement) : loversSpaceViewElement.classList.remove("active");
      const activeFriend = (window.imData?.friends || []).find(value_197 => String(value_197.id) === String(value_191.id)) || value_191;
      if (window.imApp?.openChatTab) await window.imApp.openChatTab(activeFriend);
      const container_2 = document.querySelector("#chat-interface-" + activeFriend.id + " .ins-chat-messages");
      container_2 && window.imChat?.rerenderChatContainer && window.imChat.rerenderChatContainer(activeFriend, container_2, {
        scroll: true
      });
      window.showToast?.("解绑申请已发送");
    } catch (value_198) {
      console.error("[Loves] unbind request failed", value_198);
      window.showToast?.(String(value_198?.message || "解绑申请发送失败").slice(0, 80));
      if (loversUnbindActionElement_192) loversUnbindActionElement_192.disabled = false;
    }
  },
  handleUnbindDecision: function (currentFriend_7, value_200) {
    if (!currentFriend_7) return;
    if (String(this.currentFriend?.id || "") === String(currentFriend_7.id)) this.currentFriend = currentFriend_7;
    if (this.view?.classList.contains("active")) this.refreshSelectedChar();
  },
  bindLauncherButton: function () {
    const launcher = document.getElementById("app-loves-btn");
    if (!launcher || launcher.dataset.lovesLauncherBound === "true") return;
    launcher.dataset.lovesLauncherBound = "true";
    launcher.addEventListener("click", event_201 => {
      event_201.preventDefault();
      event_201.stopPropagation();
      window.lovesApp && typeof window.lovesApp.open === "function" && window.lovesApp.open();
    });
  },
  bindSharedSavingsButton: function (currentFriend_2 = this.currentFriend) {
    const sharedSavingsBtn = document.getElementById("lovers-shared-savings-btn");
    if (!sharedSavingsBtn) return;
    currentFriend_2 && currentFriend_2.id !== undefined && (sharedSavingsBtn.dataset.friendId = String(currentFriend_2.id));
    sharedSavingsBtn.onclick = event_203 => {
      event_203.preventDefault();
      event_203.stopPropagation();
      if (currentFriend_2) this.currentFriend = currentFriend_2;
      !this.currentFriend && sharedSavingsBtn.dataset.friendId && (this.currentFriend = window.imData?.friends?.find(item_6 => String(item_6.id) === String(sharedSavingsBtn.dataset.friendId)) || null);
      this.openSavingsJar();
    };
  },
  getAnniversaryDate: function (value_205) {
    const exec_206 = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value_205 || ""));
    if (!exec_206) return null;
    const number_207 = Number(exec_206[1]),
      number_208 = Number(exec_206[2]),
      number_209 = Number(exec_206[3]),
      value_210 = new Date(number_207, number_208 - 1, number_209);
    return value_210.getFullYear() === number_207 && value_210.getMonth() === number_208 - 1 && value_210.getDate() === number_209 ? value_210 : null;
  },
  getAnniversaryCountdown: function (value_211, date_5 = new Date()) {
    const original_4 = this.getAnniversaryDate(value_211?.date);
    if (!original_4) return null;
    const value_213 = Date.UTC(date_5.getFullYear(), date_5.getMonth(), date_5.getDate()) / 86400000;
    let date_6 = original_4;
    if (value_211.annual !== false) {
      const value_216 = value_217 => new Date(value_217, original_4.getMonth(), Math.min(original_4.getDate(), new Date(value_217, original_4.getMonth() + 1, 0).getDate()));
      date_6 = original_4.getFullYear() > date_5.getFullYear() ? original_4 : value_216(date_5.getFullYear());
      if (Date.UTC(date_6.getFullYear(), date_6.getMonth(), date_6.getDate()) / 86400000 < value_213) date_6 = value_216(date_5.getFullYear() + 1);
    }
    const value_215 = Date.UTC(date_6.getFullYear(), date_6.getMonth(), date_6.getDate()) / 86400000;
    return {
      days: value_215 - value_213,
      next: date_6,
      original: original_4
    };
  },
  getAnniversaries: function (value_218 = this.currentFriend) {
    return Array.isArray(value_218?.lovesData?.anniversaries) ? value_218.lovesData.anniversaries : [];
  },
  openAnniversaryView: function () {
    const currentFriend_8 = this.getCurrentChar(),
      loversAnniversaryViewElement = document.getElementById("lovers-anniversary-view");
    if (!currentFriend_8?.hasLovesSpace || !loversAnniversaryViewElement) return;
    this.currentFriend = currentFriend_8;
    loversAnniversaryViewElement.hidden = false;
    this.renderAnniversaries();
    document.getElementById("lovers-anniversary-back")?.focus();
  },
  closeAnniversaryView: function () {
    this.closeAnniversaryEditor();
    const loversAnniversaryViewElement_220 = document.getElementById("lovers-anniversary-view");
    if (loversAnniversaryViewElement_220) loversAnniversaryViewElement_220.hidden = true;
    document.getElementById("lovers-shared-anniversary-btn")?.focus();
  },
  renderAnniversaries: function () {
    const sharedSavingsBtn_2 = document.getElementById("lovers-anniversary-list"),
      loversAnniversaryEmptyElement = document.getElementById("lovers-anniversary-empty");
    if (!sharedSavingsBtn_2) return;
    const sort_221 = this.getAnniversaries().map(item_23 => ({
      item: item_23,
      countdown: this.getAnniversaryCountdown(item_23)
    })).filter(value_223 => value_223.countdown && String(value_223.item.name || "").trim()).sort((value_224, value_225) => {
      const value_226 = value_224.countdown.days < 0 ? Infinity : value_224.countdown.days,
        value_227 = value_225.countdown.days < 0 ? Infinity : value_225.countdown.days;
      return value_226 - value_227 || String(value_224.item.name).localeCompare(String(value_225.item.name));
    });
    sharedSavingsBtn_2.innerHTML = sort_221.map(({
      item: item_24,
      countdown: countdown_2
    }) => {
      const {
          next: next_3,
          days: days_2
        } = countdown_2,
        value_232 = days_2 === 0 ? "就是今天" : days_2 > 0 ? "还有 " + days_2 + " 天" : "已过去 " + -days_2 + " 天";
      return "<button type=\"button\" class=\"lovers-anniversary-card\" data-anniversary-id=\"" + this.escapeHTML(item_24.id) + "\" aria-label=\"编辑" + this.escapeHTML(item_24.name) + "\">\n                <span class=\"lovers-anniversary-date-box\"><strong>" + String(next_3.getDate()).padStart(2, "0") + "</strong><small>" + (next_3.getMonth() + 1) + "月</small></span>\n                <span class=\"lovers-anniversary-card-copy\"><strong>" + this.escapeHTML(item_24.name) + "</strong><small>" + this.escapeHTML(item_24.date) + " · " + (item_24.annual === false ? "只纪念这一次" : "每年重复") + "</small></span>\n                <span class=\"lovers-anniversary-count\">" + value_232 + "</span>\n            </button>";
    }).join("");
    if (loversAnniversaryEmptyElement) loversAnniversaryEmptyElement.hidden = sort_221.length > 0;
  },
  openAnniversaryEditor: function (value_233 = "") {
    const loversAnniversaryEditorElement = document.getElementById("lovers-anniversary-editor"),
      loversAnniversaryFormElement = document.getElementById("lovers-anniversary-form");
    if (!loversAnniversaryEditorElement || !loversAnniversaryFormElement) return;
    const result_234 = this.getAnniversaries().find(value_235 => String(value_235.id) === String(value_233));
    loversAnniversaryFormElement.dataset.anniversaryId = result_234 ? String(result_234.id) : "";
    document.getElementById("lovers-anniversary-form-title").textContent = result_234 ? "编辑纪念日" : "添加纪念日";
    document.getElementById("lovers-anniversary-name").value = result_234?.name || "";
    document.getElementById("lovers-anniversary-date").value = result_234?.date || this.getLocalDateKey(new Date());
    document.getElementById("lovers-anniversary-annual").checked = result_234?.annual !== false;
    document.getElementById("lovers-anniversary-delete").hidden = !result_234;
    loversAnniversaryEditorElement.hidden = false;
    document.getElementById("lovers-anniversary-name")?.focus();
  },
  closeAnniversaryEditor: function () {
    const loversAnniversaryEditorElement_236 = document.getElementById("lovers-anniversary-editor");
    if (loversAnniversaryEditorElement_236) loversAnniversaryEditorElement_236.hidden = true;
  },
  saveAnniversary: async function () {
    if (this._anniversarySaving) return;
    const currentFriend_3 = this.getCurrentChar(),
      loversAnniversaryFormElement_238 = document.getElementById("lovers-anniversary-form"),
      name_4 = document.getElementById("lovers-anniversary-name")?.value.trim().slice(0, 40),
      date_8 = document.getElementById("lovers-anniversary-date")?.value;
    if (!currentFriend_3?.hasLovesSpace || !loversAnniversaryFormElement_238 || !name_4 || !this.getAnniversaryDate(date_8)) {
      window.showToast?.("请填写名称和有效日期");
      return;
    }
    this._anniversarySaving = true;
    const anniversaries_3 = this.getAnniversaries(currentFriend_3).map(value_246 => ({
      ...value_246
    }));
    if (!currentFriend_3.lovesData) currentFriend_3.lovesData = {};
    const items_242 = currentFriend_3.lovesData.anniversaries = [...anniversaries_3],
      anniversaryId_243 = loversAnniversaryFormElement_238.dataset.anniversaryId,
      result_244 = items_242.find(value_247 => String(value_247.id) === String(anniversaryId_243)),
      options_245 = {
        id: result_244?.id || "ann_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
        name: name_4,
        date: date_8,
        annual: document.getElementById("lovers-anniversary-annual").checked
      };
    if (result_244) Object.assign(result_244, options_245);else items_242.push(options_245);
    try {
      if (!(await this.persistFriendState(currentFriend_3, {
        metaOnly: true
      }))) throw new Error("save failed");
      this.currentFriend = currentFriend_3;
      this.closeAnniversaryEditor();
      this.renderAnniversaries();
      window.showToast?.("纪念日已保存");
    } catch (value_248) {
      currentFriend_3.lovesData.anniversaries = anniversaries_3;
      window.showToast?.("保存失败，请重试");
    } finally {
      this._anniversarySaving = false;
    }
  },
  deleteAnniversary: async function () {
    if (this._anniversarySaving) return;
    const currentChar_249 = this.getCurrentChar(),
      entryId = document.getElementById("lovers-anniversary-form")?.dataset.anniversaryId,
      anniversaries_2 = this.getAnniversaries(currentChar_249),
      result_251 = anniversaries_2.find(value_252 => String(value_252.id) === String(entryId));
    if (!currentChar_249?.hasLovesSpace || !result_251 || !window.confirm("删除“" + result_251.name + "”？")) return;
    this._anniversarySaving = true;
    currentChar_249.lovesData.anniversaries = anniversaries_2.filter(item_7 => String(item_7.id) !== String(entryId));
    try {
      if (!(await this.persistFriendState(currentChar_249, {
        metaOnly: true
      }))) throw new Error("delete failed");
      this.closeAnniversaryEditor();
      this.renderAnniversaries();
      window.showToast?.("纪念日已删除");
    } catch (value_254) {
      currentChar_249.lovesData.anniversaries = anniversaries_2;
      window.showToast?.("删除失败，请重试");
    } finally {
      this._anniversarySaving = false;
    }
  },
  bindFabClick: function () {
    const loversSpaceFabElement = document.getElementById("lovers-space-fab");
    if (!loversSpaceFabElement) return;
    loversSpaceFabElement.style.transform = "";
    loversSpaceFabElement.style.touchAction = "auto";
    loversSpaceFabElement.onclick = event_255 => {
      event_255.preventDefault();
      event_255.stopPropagation();
      if (!this.getCurrentChar()?.hasLovesSpace) return;
      const savingsView = document.getElementById("lovers-savings-view");
      if (savingsView && savingsView.classList.contains("active")) {
        this.openSavingsDepositSheet("user");
        return;
      }
      const activeTab = document.querySelector(".lovers-space-tab.active");
      if (activeTab) {
        const attribute_256 = activeTab.getAttribute("data-tab");
        if (attribute_256 === "moments") this.openPublishView();else {
          if (window.showToast) window.showToast("此板块暂不支持添加");
        }
      } else this.openPublishView();
    };
  },
  openPublishView: function () {
    const currentFriend_9 = this.getCurrentChar();
    if (!currentFriend_9?.hasLovesSpace) return;
    this.currentFriend = currentFriend_9;
    const loversPublishViewElement = document.getElementById("lovers-publish-view");
    if (!loversPublishViewElement) return;
    if (window.openView) window.openView(loversPublishViewElement);
    document.getElementById("lovers-publish-text").value = "";
    const loversPublishImagesContainerElement = document.getElementById("lovers-publish-images-container"),
      addBtn = document.getElementById("lovers-publish-add-img-btn");
    loversPublishImagesContainerElement.innerHTML = "";
    loversPublishImagesContainerElement.appendChild(addBtn);
    this.currentPublishImages = [];
    const cancelBtn = document.getElementById("lovers-publish-cancel");
    cancelBtn && (cancelBtn.onclick = () => {
      if (window.closeView) window.closeView(loversPublishViewElement);
    });
    const fileInput = document.getElementById("lovers-publish-file-input");
    addBtn && fileInput && (addBtn.onclick = () => fileInput.click(), fileInput.onchange = event_258 => {
      const files_2 = event_258.target.files;
      if (!files_2 || files_2.length === 0) return;
      for (let count_260 = 0; count_260 < files_2.length; count_260++) {
        const value_261 = files_2[count_260],
          reader_2 = new FileReader();
        reader_2.onload = ev => {
          this.currentPublishImages.push(ev.target.result);
          this.renderPublishImagePreview();
        };
        reader_2.readAsDataURL(value_261);
      }
      fileInput.value = "";
    });
    const publishBtn = document.getElementById("lovers-publish-btn");
    publishBtn && (publishBtn.onclick = () => {
      const text_5 = document.getElementById("lovers-publish-text").value.trim();
      if (!text_5 && this.currentPublishImages.length === 0) {
        if (window.showToast) window.showToast("写点什么或添加图片吧");
        return;
      }
      const moment = {
        id: "lm_" + Date.now(),
        text: text_5,
        images: [...this.currentPublishImages],
        timestamp: Date.now(),
        likes: 0,
        comments: []
      };
      !this.currentFriend.lovesData && (this.currentFriend.lovesData = {
        moments: []
      });
      !this.currentFriend.lovesData.moments && (this.currentFriend.lovesData.moments = []);
      this.currentFriend.lovesData.moments.unshift(moment);
      this.persistFriendState();
      if (window.showToast) window.showToast("发布成功");
      if (window.closeView) window.closeView(loversPublishViewElement);
      this.renderLovesMoments();
    });
  },
  renderPublishImagePreview: function () {
    const loversPublishImagesContainerElement_265 = document.getElementById("lovers-publish-images-container"),
      loversPublishAddImgBtnElement_266 = document.getElementById("lovers-publish-add-img-btn");
    if (!loversPublishImagesContainerElement_265 || !loversPublishAddImgBtnElement_266) return;
    loversPublishImagesContainerElement_265.innerHTML = "";
    (this.currentPublishImages || []).forEach((src_3, index_3) => {
      const wrapper = document.createElement("div");
      wrapper.className = "lovers-publish-image";
      const element_270 = document.createElement("img");
      element_270.src = src_3;
      element_270.alt = "动态图片 " + (index_3 + 1);
      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.setAttribute("aria-label", "删除第 " + (index_3 + 1) + " 张图片");
      delBtn.innerHTML = "<i class=\"fas fa-times\"></i>";
      delBtn.onclick = () => {
        this.currentPublishImages.splice(index_3, 1);
        this.renderPublishImagePreview();
      };
      wrapper.appendChild(element_270);
      wrapper.appendChild(delBtn);
      loversPublishImagesContainerElement_265.appendChild(wrapper);
    });
    loversPublishImagesContainerElement_265.appendChild(loversPublishAddImgBtnElement_266);
  },
  renderLovesMoments: function () {
    const list = document.getElementById("lovers-moments-list"),
      empty = document.getElementById("lovers-moments-empty");
    if (!list || !empty || !this.currentFriend) return;
    const moments_2 = this.currentFriend.lovesData?.moments || [];
    if (moments_2.length === 0) {
      list.style.display = "none";
      empty.style.display = "flex";
      return;
    }
    list.style.display = "flex";
    empty.style.display = "none";
    const userAvatar = window.userState?.avatarUrl || window.imData?.profile?.avatarUrl,
      value_274 = window.userState?.name || window.imData?.profile?.name || "我",
      escapeHTML_275 = this.escapeHTML(value_274);
    let innerHTML_2 = "";
    moments_2.forEach((m_2, value_278) => {
      const date_7 = new Date(m_2.timestamp),
        value_280 = date_7.getMonth() + 1 + "-" + date_7.getDate() + " " + date_7.getHours().toString().padStart(2, "0") + ":" + date_7.getMinutes().toString().padStart(2, "0"),
        displayAvatar = m_2.isChar ? this.currentFriend.avatarUrl : userAvatar,
        value_282 = m_2.isChar ? this.currentFriend.nickname || this.currentFriend.realname || "TA" : value_274,
        escapeHTML_283 = this.escapeHTML(value_282),
        escapeHTML_284 = this.escapeHTML(m_2.text),
        escapeHTML_285 = this.escapeHTML(displayAvatar || ""),
        escapeHTML_286 = this.escapeHTML(userAvatar || ""),
        value_287 = m_2.isChar ? this.renderLovesMomentTranslation(this.getLovesMomentTranslation(m_2), "loves-moment-post-translation-" + value_278) : "";
      let text_288 = "";
      if (m_2.images && m_2.images.length > 0) {
        const imageLayout = m_2.images.length === 1 ? "is-one" : m_2.images.length === 2 ? "is-two" : "is-many";
        text_288 = "<div class=\"loves-moment-images " + imageLayout + "\">";
        m_2.images.forEach((value_291, value_292) => {
          text_288 += "<img src=\"" + this.escapeHTML(value_291) + "\" alt=\"动态图片 " + (value_292 + 1) + "\">";
        });
        text_288 += "</div>";
      }
      let text_289 = "";
      m_2.comments && m_2.comments.length > 0 && (text_289 = "<div class=\"loves-moment-comments\">", m_2.comments.forEach((value_293, value_294) => {
        const value_295 = value_293.isChar ? this.currentFriend.nickname || this.currentFriend.realname || "TA" : value_274,
          escapeHTML_296 = this.escapeHTML(value_295),
          escapeHTML_297 = this.escapeHTML(value_293.text),
          value_298 = value_293.isChar ? this.renderLovesMomentTranslation(this.getLovesMomentTranslation(value_293), "loves-moment-comment-translation-" + value_278 + "-" + value_294) : "";
        text_289 += "\n                        <div class=\"loves-moment-comment " + (value_293.isChar ? "is-char" : "") + "\">\n                            <div class=\"loves-moment-comment-copy\" onclick=\"window.lovesApp.replyToComment(" + value_278 + ", " + value_294 + ")\"><div><span class=\"loves-moment-comment-author\">" + escapeHTML_296 + "</span>：" + escapeHTML_297 + "</div>" + value_298 + "</div>\n                            <button type=\"button\" class=\"loves-moment-comment-delete\" aria-label=\"删除评论\" title=\"删除评论\" onclick=\"window.lovesApp.deleteComment(" + value_278 + ", " + value_294 + ")\">&times;</button>\n                        </div>\n                    ";
      }), text_289 += "</div>");
      innerHTML_2 += "\n            <article class=\"loves-moment-card\">\n                <div class=\"loves-moment-head\">\n                    <div class=\"loves-moment-author\">\n                        <div class=\"loves-moment-avatar\">\n                            " + (displayAvatar ? "<img src=\"" + escapeHTML_285 + "\" alt=\"" + escapeHTML_283 + "\">" : "<i class=\"fas fa-user\"></i>") + "\n                        </div>\n                        <div class=\"loves-moment-author-copy\">\n                            <div class=\"loves-moment-name\">" + escapeHTML_283 + "</div>\n                            <div class=\"loves-moment-time\">" + value_280 + "</div>\n                        </div>\n                    </div>\n                    <div class=\"loves-moment-actions\">\n                        <button type=\"button\" class=\"loves-moment-more\" aria-label=\"动态选项\" onclick=\"window.lovesApp.toggleMomentMenu(" + value_278 + ")\"><i class=\"fas fa-ellipsis-h\"></i></button>\n                        <div id=\"loves-moment-menu-" + value_278 + "\" class=\"loves-moment-menu\">\n                            <button type=\"button\" onclick=\"window.lovesApp.requestCharComment(" + value_278 + ")\"><i class=\"fas fa-comment-dots\"></i><span>让 TA 评论</span></button>\n                            <button type=\"button\" class=\"is-danger\" onclick=\"window.lovesApp.deleteMoment(" + value_278 + ")\"><i class=\"fas fa-trash-alt\"></i><span>删除动态</span></button>\n                        </div>\n                    </div>\n                </div>\n                \n                " + (m_2.text ? "<div class=\"loves-moment-body\">" + escapeHTML_284 + "</div>" + value_287 : "") + "\n                " + text_288 + "\n                \n                <div class=\"loves-moment-toolbar\">\n                    <button type=\"button\" class=\"" + (m_2.isLiked ? "is-liked" : "") + "\" onclick=\"window.lovesApp.toggleMomentLike(" + value_278 + ")\"><i class=\"" + (m_2.isLiked ? "fas" : "far") + " fa-heart\"></i><span>" + (m_2.likes || 0) + "</span></button>\n                    <button type=\"button\" onclick=\"window.lovesApp.addMomentComment(" + value_278 + ")\"><i class=\"far fa-comment-dots\"></i><span>" + (m_2.comments ? m_2.comments.length : 0) + "</span></button>\n                </div>\n                \n                " + text_289 + "\n                <div class=\"loves-moment-composer\">\n                    <div class=\"loves-moment-composer-avatar\">\n                        " + (userAvatar ? "<img src=\"" + escapeHTML_286 + "\" alt=\"" + escapeHTML_275 + "\">" : "<i class=\"fas fa-user\"></i>") + "\n                    </div>\n                    <input type=\"text\" class=\"loves-moment-comment-input\" data-moment-idx=\"" + value_278 + "\" inputmode=\"text\" enterkeyhint=\"send\" autocomplete=\"off\" placeholder=\"" + (m_2.isChar ? "评论 TA 的动态..." : "添加评论...") + "\">\n                    <button type=\"button\" class=\"loves-moment-comment-send\" data-moment-idx=\"" + value_278 + "\">发送</button>\n                </div>\n            </article>\n            ";
    });
    list.innerHTML = innerHTML_2;
    this.bindLovesMomentTranslationControls(list);
    list.querySelectorAll(".loves-moment-comment-send").forEach(value_299 => {
      value_299.addEventListener("click", () => {
        const idx_2 = parseInt(value_299.dataset.momentIdx, 10),
          input_2 = list.querySelector(".loves-moment-comment-input[data-moment-idx=\"" + idx_2 + "\"]");
        this.addMomentComment(idx_2, input_2 ? input_2.value : "", {
          restoreComposerFocus: document.activeElement === input_2
        });
      });
    });
    list.querySelectorAll(".loves-moment-comment-input").forEach(input => {
      input.addEventListener("keydown", e_4 => {
        const isSendEnter_2 = window.mobileInputCompat?.isSendEnter ? window.mobileInputCompat.isSendEnter(e_4) : e_4.key === "Enter" && !e_4.shiftKey && !e_4.ctrlKey && !e_4.metaKey && !e_4.altKey && !e_4.isComposing && e_4.keyCode !== 229;
        if (!isSendEnter_2) return;
        e_4.preventDefault();
        const idx = parseInt(input.dataset.momentIdx, 10);
        this.addMomentComment(idx, input.value, {
          restoreComposerFocus: true
        });
      });
    });
    !this._menuClickBound && (document.addEventListener("click", e_5 => {
      if (!e_5.target.closest("[id^=\"loves-moment-menu-\"]") && !e_5.target.closest(".fa-ellipsis-h")) {
        const menus = document.querySelectorAll("[id^=\"loves-moment-menu-\"]");
        menus.forEach(m => m.style.display = "none");
      }
    }), this._menuClickBound = true);
  },
  updateDaysCount: function (friend_7) {
    const daysEl = document.getElementById("lovers-space-days");
    if (!daysEl || !friend_7) return;
    const startState = this.ensureLovesStartTime(friend_7);
    daysEl.textContent = String(this.getLovesDaysCount(friend_7));
    if (startState.changed) void this.persistFriendState(friend_7, {
      metaOnly: true,
      silent: true
    });
  },
  toggleMomentMenu: function (idx_3) {
    const menus_2 = document.querySelectorAll("[id^=\"loves-moment-menu-\"]");
    menus_2.forEach((m_3, i) => {
      if (i !== idx_3) m_3.style.display = "none";
    });
    const targetMenu = document.getElementById("loves-moment-menu-" + idx_3);
    targetMenu && (targetMenu.style.display = targetMenu.style.display === "none" ? "block" : "none");
  },
  deleteMoment: function (idx_4) {
    if (!this.currentFriend || !this.currentFriend.lovesData || !this.currentFriend.lovesData.moments) return;
    const elementById_308 = document.getElementById("loves-moment-menu-" + idx_4);
    if (elementById_308) elementById_308.style.display = "none";
    this.showDeleteConfirm("这条动态", () => {
      this.currentFriend.lovesData.moments.splice(idx_4, 1);
      this.persistFriendState();
      this.renderLovesMoments();
    });
  },
  deleteComment: function (mIdx, cIdx) {
    if (!this.currentFriend || !this.currentFriend.lovesData || !this.currentFriend.lovesData.moments) return;
    const m_4 = this.currentFriend.lovesData.moments[mIdx];
    if (!m_4 || !m_4.comments) return;
    this.showDeleteConfirm("这条评论", () => {
      m_4.comments.splice(cIdx, 1);
      this.persistFriendState();
      this.renderLovesMoments();
    });
  },
  addMomentComment: function (mIdx_2, value_311 = "", value_312 = {}) {
    if (!this.currentFriend || !this.currentFriend.lovesData || !this.currentFriend.lovesData.moments) return;
    const m_5 = this.currentFriend.lovesData.moments[mIdx_2];
    if (!m_5) return;
    let commentText = String(value_311 || "").trim();
    if (!commentText) {
      const prompted = prompt(m_5.isChar ? "评论 TA 的动态：" : "添加评论：");
      if (prompted === null) return;
      commentText = prompted.trim();
    }
    if (!commentText) return;
    if (!m_5.comments) m_5.comments = [];
    m_5.comments.push({
      text: commentText,
      isChar: false,
      timestamp: Date.now()
    });
    this.persistFriendState();
    this.renderLovesMoments();
    value_312.restoreComposerFocus && requestAnimationFrame(() => {
      const querySelector_316 = document.querySelector(".loves-moment-comment-input[data-moment-idx=\"" + mIdx_2 + "\"]");
      if (!querySelector_316) return;
      try {
        querySelector_316.focus({
          preventScroll: true
        });
      } catch (value_317) {
        querySelector_316.focus();
      }
    });
    m_5.isChar === true && this.requestCharComment(mIdx_2, {
      reason: "user_comment",
      userComment: commentText,
      silentMissingApi: true
    });
  },
  replyToComment: function (mIdx_3, cIdx_2) {
    if (!this.currentFriend || !this.currentFriend.lovesData || !this.currentFriend.lovesData.moments) return;
    const m_6 = this.currentFriend.lovesData.moments[mIdx_3];
    if (!m_6 || !m_6.comments || !m_6.comments[cIdx_2]) return;
    const targetComment = m_6.comments[cIdx_2],
      targetName_2 = targetComment.isChar ? this.currentFriend.nickname || this.currentFriend.realname || "TA" : "我",
      replyText = prompt("回复 " + targetName_2 + "：");
    replyText !== null && replyText.trim() !== "" && (m_6.comments.push({
      text: "回复 @" + targetName_2 + " : " + replyText.trim(),
      isChar: false,
      timestamp: Date.now()
    }), this.persistFriendState(), this.renderLovesMoments(), targetComment.isChar === true && this.requestCharComment(mIdx_3, {
      reason: "user_comment",
      userComment: replyText.trim(),
      targetCommentText: String(targetComment.text || "").trim(),
      silentMissingApi: true
    }));
  },
  requestCharComment: function (idx_5, options_4 = {}) {
    const friend_8 = this.currentFriend,
      moment_2 = friend_8?.lovesData?.moments?.[idx_5];
    if (!friend_8 || !moment_2) return Promise.resolve(false);
    !moment_2.id && (moment_2.id = "lm_" + (Number(moment_2.timestamp) || Date.now()) + "_" + idx_5, void this.persistFriendState(friend_8, {
      metaOnly: true,
      silent: true
    }));
    const elementById_328 = document.getElementById("loves-moment-menu-" + idx_5);
    if (elementById_328) elementById_328.style.display = "none";
    return this.queueCharCommentRequest(friend_8.id, moment_2.id, options_4);
  },
  queueCharCommentRequest: function (friendId_3, momentId, options_5 = {}) {
    const queueKey = friendId_3 + ":" + momentId,
      previous = this._momentReplyQueues.get(queueKey) || Promise.resolve(),
      next_4 = previous["catch"](() => false).then(() => this.executeCharCommentRequest(friendId_3, momentId, {
        ...options_5
      }))["finally"](() => {
        this._momentReplyQueues.get(queueKey) === next_4 && this._momentReplyQueues["delete"](queueKey);
      });
    return this._momentReplyQueues.set(queueKey, next_4), next_4;
  },
  executeCharCommentRequest: async function (friendId_4, momentId_2, options_6 = {}) {
    let friend_9 = window.imData?.friends?.find(value_340 => String(value_340.id) === String(friendId_4)),
      moment_3 = friend_9?.lovesData?.moments?.find(value_341 => String(value_341.id) === String(momentId_2));
    if (!friend_9 || !moment_3) return false;
    const apiConfig_2 = window.getApiConfig ? window.getApiConfig() : window.apiConfig || {};
    if (!apiConfig_2.endpoint || !apiConfig_2.apiKey) {
      if (window.showToast) window.showToast("请先在系统设置中配置 API");
      return false;
    }
    moment_3._charReplyPendingCount = Math.max(0, Number(moment_3._charReplyPendingCount) || 0) + 1;
    moment_3._charReplyPending = true;
    if (window.showToast) window.showToast(options_6.reason === "user_comment" ? "TA 正在回复..." : "正在生成评论...");
    try {
      if (window.imApp?.ensureFriendMessagesLoaded) {
        await window.imApp.ensureFriendMessagesLoaded(friend_9);
        friend_9 = window.imData?.friends?.find(item_8 => String(item_8.id) === String(friendId_4)) || friend_9;
        moment_3 = friend_9?.lovesData?.moments?.find(item_9 => String(item_9.id) === String(momentId_2));
        if (!moment_3) return false;
      }
      let text_342 = "";
      if (window.getGlobalWorldBookContextByPosition) {
        text_342 = window.getGlobalWorldBookContextByPosition("system_depth") || "";
        const globalWorldBookContextByPosition = window.getGlobalWorldBookContextByPosition("before_role");
        if (globalWorldBookContextByPosition) text_342 += "\n" + globalWorldBookContextByPosition;
      }
      const userPersona = (window.getUserState ? window.getUserState() : window.userState || {})?.persona || "普通用户",
        value_344 = friend_9.persona || "普通角色",
        value_345 = Array.isArray(friend_9.messages) ? friend_9.messages.slice(-10).map(msg => {
          const sender_2 = msg?.role === "user" || msg?.sender === "me" ? "User" : "Char";
          return sender_2 + ": " + (msg?.text || msg?.content || "[特殊消息]");
        }).join("\n") : "",
        momentContent = moment_3.text || "[只有图片]",
        imageCount = Array.isArray(moment_3.images) ? moment_3.images.length : 0,
        isCharMoment = moment_3.isChar === true,
        charLanguage = this.resolveLovesMomentLanguage(friend_9),
        friendPhoneLanguageName_350 = this.getFriendPhoneLanguageName(charLanguage),
        momentAuthor = isCharMoment ? "角色(Char)" : "用户(User)";
      let value_352 = momentAuthor + "发布了一条动态：\n文字内容：" + momentContent + "\n附带图片数量：" + imageCount + " 张";
      if (options_6.targetCommentText) {
        value_352 += "\nChar 之前在动态下评论：" + options_6.targetCommentText;
        value_352 += "\nUser 刚刚回复 Char：" + (options_6.userComment || "");
      } else options_6.userComment && (value_352 += "\nUser 刚刚在这条 Char 动态下评论：" + options_6.userComment);
      let prompt_2 = options_6.reason === "user_comment" ? "你现在要扮演给定的角色(Char)。User 刚刚在动态评论区直接回应了你。请生成2-5条连续、自然的公开评论回复，并且可选生成0-2条相关私聊消息。\n" : isCharMoment ? "你现在要扮演给定的角色(Char)。这条动态是 Char 自己发布的，请生成1-3条补充评论，并给 User 发送1-3条相关私聊消息。\n" : "你现在要扮演给定的角色(Char)，为 User 发布的动态写1-2条评论，并给 User 发送1-3条相关私聊消息。\n";
      if (text_342) prompt_2 += "\n【世界书设定】：\n" + text_342 + "\n";
      prompt_2 += "\n【角色 (Char) 人设】：\n" + value_344 + "\n";
      prompt_2 += "\n【用户 (User) 人设】：\n" + userPersona + "\n";
      if (value_345) prompt_2 += "\n【近期聊天上下文(最近10条)】：\n" + value_345 + "\n";
      prompt_2 += "\n【动态与评论现场】：\n" + value_352 + "\n";
      prompt_2 += "\n要求：\n1. 内容必须符合人设、世界观和近期关系氛围。\n2. Char 在 iMessage 中配置的默认语言是 " + friendPhoneLanguageName_350 + "。comments 和 messages 中每一条都必须遵守以下语言规则：" + this.buildLovesMomentLocalizationContract(friend_9, "each item") + "。\n3. 只返回纯 JSON 对象，格式为 {\"comments\":[{\"text\":\"公开回复\",\"translation\":\"中文翻译或空字符串\"}],\"messages\":[{\"text\":\"私聊消息\",\"translation\":\"中文翻译或空字符串\"}]}，不要返回 Markdown。\n4. comments " + (options_6.reason === "user_comment" ? "必须包含2-5条 Char 对 User 的连续直接回复" : isCharMoment ? "包含1-3条" : "包含1-2条") + "；messages " + (options_6.reason === "user_comment" ? "包含0-2条，可以为空数组" : "包含1-3条") + "。\n5. 每个数组元素只写一条自然消息，不要带 Char/User 标签，不要把多条回复合并在一个字符串里。";
      const endpoint_2 = window.u2Api.resolveChatCompletionsEndpoint(apiConfig_2.endpoint),
        response = await fetch(endpoint_2, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + apiConfig_2.apiKey
          },
          body: JSON.stringify({
            model: apiConfig_2.model || "gpt-3.5-turbo",
            messages: [{
              role: "system",
              content: "你是角色扮演对话助手，必须严格返回指定 JSON 对象。"
            }, {
              role: "user",
              content: prompt_2
            }],
            temperature: parseFloat(apiConfig_2.temperature) || 0.7
          })
        });
      if (!response.ok) {
        const value_368 = await window.u2Api?.readApiError?.(response);
        throw window.u2Api?.createHttpError?.(response, value_368) || Object.assign(new Error("API Request Failed: HTTP " + response.status), {
          status: response.status
        });
      }
      const payload = await response.json(),
        resultText_2 = payload.choices?.[0]?.message?.content || "";
      let trim_357 = resultText_2.replace(/```json/gi, "").replace(/```/g, "").trim();
      const match_358 = trim_357.match(/\{[\s\S]*\}/);
      if (match_358) trim_357 = match_358[0];
      const parsed_3 = JSON.parse(trim_357),
        normalizeLocalizedList = (list_2, limit_2) => {
          if (!Array.isArray(list_2)) return [];
          const source_3 = list_2.slice(0, limit_2);
          return source_3.map(item_10 => {
            const localized_2 = this.normalizeLovesMomentLocalizedContent(item_10, friend_9);
            if (localized_2) return localized_2;
            const text_6 = String(item_10 && typeof item_10 === "object" ? item_10.text ?? item_10.content ?? "" : item_10 ?? "").trim();
            return text_6 ? {
              text: text_6,
              translation: "",
              language: charLanguage
            } : null;
          }).filter(Boolean);
        },
        comments_2 = normalizeLocalizedList(parsed_3.comments, options_6.reason === "user_comment" ? 5 : isCharMoment ? 3 : 2),
        privateMessages = normalizeLocalizedList(parsed_3.messages, options_6.reason === "user_comment" ? 2 : 3);
      if (options_6.reason === "user_comment" && comments_2.length < 2) throw new Error("API must return 2-5 public replies");
      if (options_6.reason !== "user_comment" && comments_2.length === 0 && privateMessages.length === 0) throw new Error("No comments or messages generated");
      friend_9 = window.imData?.friends?.find(item_11 => String(item_11.id) === String(friendId_4));
      moment_3 = friend_9?.lovesData?.moments?.find(value_375 => String(value_375.id) === String(momentId_2));
      if (!friend_9 || !moment_3) return false;
      if (!Array.isArray(moment_3.comments)) moment_3.comments = [];
      const now_363 = Date.now();
      comments_2.forEach((value_376, value_377) => {
        moment_3.comments.push({
          id: "lmc_" + now_363 + "_" + value_377,
          text: value_376.text,
          translation: value_376.translation,
          language: value_376.language,
          isChar: true,
          timestamp: now_363 + value_377
        });
      });
      for (let count_378 = 0; count_378 < privateMessages.length; count_378 += 1) {
        const value_379 = privateMessages[count_378],
          timestamp_6 = now_363 + (count_378 + 1) * 1000,
          options_381 = {
            id: window.imChat?.createMessageId ? window.imChat.createMessageId("msg") : "msg_" + timestamp_6 + "_" + count_378,
            sender: friend_9.id,
            role: "assistant",
            text: value_379.text,
            content: value_379.text,
            translation: value_379.translation,
            language: value_379.language,
            timestamp: timestamp_6,
            time: new Date(timestamp_6).toLocaleTimeString("zh-CN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
            }),
            type: "text"
          };
        if (window.imApp?.appendFriendMessage) await window.imApp.appendFriendMessage(friend_9.id, options_381, {
          silent: false
        });else {
          if (!Array.isArray(friend_9.messages)) friend_9.messages = [];
          friend_9.messages.push(options_381);
        }
      }
      await this.persistFriendState(friend_9, {
        metaOnly: true
      });
      this.currentFriend && String(this.currentFriend.id) === String(friendId_4) && (this.currentFriend = friend_9, this.renderLovesMoments());
      if (window.showToast) window.showToast(privateMessages.length > 0 ? "评论与消息发送成功" : "回复已生成");
      return true;
    } catch (error_2) {
      console.error("Comment API Error:", error_2);
      if (options_6.reason === "user_comment" && window.u2Api?.isRequestError?.(error_2)) window.u2Api.reportError(error_2, {
        operation: "评论回复生成"
      });else window.showToast && window.showToast(error_2 instanceof SyntaxError || /2-5 public replies/.test(String(error_2?.message || "")) ? "AI 生成内容格式错误" : "API 请求失败，无法评论");
      return false;
    } finally {
      const result_383 = window.imData?.friends?.find(value_385 => String(value_385.id) === String(friendId_4)),
        liveMoment = result_383?.lovesData?.moments?.find(value_386 => String(value_386.id) === String(momentId_2));
      liveMoment && (liveMoment._charReplyPendingCount = Math.max(0, Number(liveMoment._charReplyPendingCount) || 1) - 1, liveMoment._charReplyPending = liveMoment._charReplyPendingCount > 0);
    }
  },
  toggleMomentLike: function (idx_6) {
    if (!this.currentFriend || !this.currentFriend.lovesData || !this.currentFriend.lovesData.moments) return;
    const m_7 = this.currentFriend.lovesData.moments[idx_6];
    m_7.isLiked = !m_7.isLiked;
    m_7.likes = (m_7.likes || 0) + (m_7.isLiked ? 1 : -1);
    if (m_7.likes < 0) m_7.likes = 0;
    this.persistFriendState();
    this.renderLovesMoments();
  },
  ensureSavingsData: function (friend_10 = this.currentFriend) {
    if (!friend_10) return {
      goal: 5200,
      records: [],
      withdrawals: []
    };
    if (!friend_10.lovesData) friend_10.lovesData = {};
    (!friend_10.lovesData.savings || typeof friend_10.lovesData.savings !== "object") && (friend_10.lovesData.savings = {});
    const savings_3 = friend_10.lovesData.savings;
    !Number.isFinite(Number(savings_3.goal)) || Number(savings_3.goal) <= 0 ? savings_3.goal = 5200 : savings_3.goal = Number(savings_3.goal);
    if (!Array.isArray(savings_3.records)) savings_3.records = [];
    savings_3.records = savings_3.records.map((record_7, value_392) => ({
      id: record_7.id || "sav_" + Date.now() + "_" + value_392,
      amount: Math.max(0, Number(record_7.amount) || 0),
      actor: record_7.actor === "char" ? "char" : "user",
      date: record_7.date || this.getLocalDateKey(record_7.timestamp || new Date()),
      note: String(record_7.note || ""),
      source: record_7.source === "char_daily" || String(record_7.id || "").startsWith("sav_char_daily_") ? "char_daily" : "",
      timestamp: Number(record_7.timestamp) || Date.now()
    })).filter(value_393 => value_393.amount > 0);
    if (!Array.isArray(savings_3.withdrawals)) savings_3.withdrawals = [];
    return savings_3.withdrawals = savings_3.withdrawals.map((record_8, value_395) => ({
      id: record_8.id || "wd_" + Date.now() + "_" + value_395,
      amount: Math.max(0, Number(record_8.amount) || 0),
      actor: "user",
      date: record_8.date || this.getLocalDateKey(record_8.timestamp || new Date()),
      reason: String(record_8.reason || record_8.note || ""),
      decisionReason: String(record_8.decisionReason || ""),
      timestamp: Number(record_8.timestamp) || Date.now()
    })).filter(value_396 => value_396.amount > 0), savings_3;
  },
  getSavingsSummary: function (savings_4 = this.ensureSavingsData()) {
    const records_2 = Array.isArray(savings_4.records) ? savings_4.records : [],
      summary_2 = records_2.reduce((nextSummary, record_9) => {
        const amount_3 = Number(record_9.amount) || 0;
        nextSummary.total += amount_3;
        if (record_9.actor === "char") nextSummary.char += amount_3;else nextSummary.user += amount_3;
        return nextSummary;
      }, {
        total: 0,
        user: 0,
        char: 0,
        withdrawn: 0
      }),
      withdrawals_2 = Array.isArray(savings_4.withdrawals) ? savings_4.withdrawals : [];
    return summary_2.withdrawn = withdrawals_2.reduce((sum, record_10) => sum + (Number(record_10.amount) || 0), 0), summary_2.total = Math.max(0, summary_2.total - summary_2.withdrawn), summary_2;
  },
  setSavingsFabCovered: function (value_404) {
    const fab = document.getElementById("lovers-space-fab");
    if (!fab) return;
    if (value_404) {
      fab.dataset.savingsFabCovered !== "1" && (fab.dataset.savingsPreviousDisplay = fab.style.display || "", fab.dataset.savingsPreviousZIndex = fab.style.zIndex || "");
      fab.dataset.savingsFabCovered = "1";
      fab.style.display = "none";
      return;
    }
    const hasActiveSavingsSheet = ["lovers-savings-deposit-sheet", "lovers-savings-settings-sheet", "lovers-savings-withdraw-sheet", "lovers-savings-withdraw-result-modal"].some(id_2 => document.getElementById(id_2)?.classList.contains("active"));
    if (hasActiveSavingsSheet) return;
    fab.dataset.savingsFabCovered === "1" && (fab.style.display = fab.dataset.savingsPreviousDisplay || "", fab.style.zIndex = fab.dataset.savingsPreviousZIndex || "", delete fab.dataset.savingsFabCovered, delete fab.dataset.savingsPreviousDisplay, delete fab.dataset.savingsPreviousZIndex);
  },
  closeSavingsSheet: function (sheet_2, value_409 = {}) {
    if (!sheet_2) return;
    if (window.closeView) window.closeView(sheet_2);else sheet_2.classList.remove("active");
    !value_409.keepFabHidden && setTimeout(() => this.setSavingsFabCovered(false), 0);
  },
  openSavingsSheet: function (element_410, focusEl = null) {
    if (!element_410) return;
    element_410.onclick = event_412 => {
      event_412.target === element_410 && (event_412.stopPropagation(), this.closeSavingsSheet(element_410));
    };
    this.setSavingsFabCovered(true);
    if (window.openView) window.openView(element_410);else element_410.classList.add("active");
    if (focusEl) setTimeout(() => focusEl.focus(), 80);
  },
  getSavingsApiEndpoint: function () {
    if (!window.apiConfig || !window.apiConfig.endpoint || !window.apiConfig.apiKey) return "";
    return window.u2Api.resolveChatCompletionsEndpoint(window.apiConfig.endpoint);
  },
  parseSavingsJsonObject: function (resultText) {
    let jsonStr = String(resultText || "").replace(/```json/gi, "").replace(/```/g, "").trim();
    const match_3 = jsonStr.match(/\{[\s\S]*\}/);
    if (match_3) jsonStr = match_3[0];
    return JSON.parse(jsonStr);
  },
  createSavingsMessageId: function (prefix = "msg") {
    return window.imChat && window.imChat.createMessageId ? window.imChat.createMessageId(prefix) : prefix + "_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
  },
  appendSavingsChatMessage: async function (friend_11, msgObj, options_7 = {}) {
    if (!friend_11 || !msgObj) return false;
    let saved_2 = false;
    if (window.imApp && window.imApp.appendFriendMessage) saved_2 = await window.imApp.appendFriendMessage(friend_11.id, msgObj, {
      silent: options_7.silent !== false
    });else {
      if (!Array.isArray(friend_11.messages)) friend_11.messages = [];
      friend_11.messages.push(msgObj);
      saved_2 = true;
    }
    if (!saved_2) return false;
    const activeFriend_2 = window.imData?.currentActiveFriend && String(window.imData.currentActiveFriend.id) === String(friend_11.id) ? window.imData.currentActiveFriend : friend_11,
      page = document.getElementById("chat-interface-" + friend_11.id),
      container_3 = page ? page.querySelector(".ins-chat-messages") : null,
      isActiveChat = container_3 && window.imData?.currentActiveFriend && String(window.imData.currentActiveFriend.id) === String(friend_11.id);
    if (isActiveChat && window.imChat?.appendMessageToContainer) {
      const appended = window.imChat.appendMessageToContainer(activeFriend_2, container_3, msgObj, {
        scroll: true
      });
      !appended && window.imChat.rerenderChatContainer && window.imChat.rerenderChatContainer(activeFriend_2, container_3, {
        scroll: true
      });
    }
    return true;
  },
  normalizeSavingsWithdrawResult: function (parsed_4, value_424, value_425) {
    const decision_2 = parsed_4?.decision === "reject" ? "reject" : "approve",
      defaultReason = decision_2 === "reject" ? "这笔我先不同意，" + value_425 + "这个理由还不够明确。" : "可以，这次先从存钱罐给你提 " + value_424.toFixed(2) + "。",
      reason_2 = String(parsed_4?.reason || parsed_4?.decisionReason || parsed_4?.approveReason || parsed_4?.rejectReason || defaultReason).trim() || defaultReason;
    let messages_3 = Array.isArray(parsed_4?.messages) ? parsed_4.messages.map(item_12 => String(item_12 || "").trim()).filter(Boolean) : [];
    const fallbackMessages = decision_2 === "reject" ? ["这笔我先不同意，" + value_425 + "这个理由我还想再问清楚一点。", "你先别急着提，跟我说说到底怎么用。"] : ["可以，你先拿去用。", value_424 <= 50 ? "就提 " + value_424.toFixed(2) + " 够不够？" : "这笔我同意，记得别乱花。"];
    fallbackMessages.forEach(text_7 => {
      if (messages_3.length < 2) messages_3.push(text_7);
    });
    messages_3 = messages_3.slice(0, 5);
    const rawExtra = parsed_4?.extraSupport && typeof parsed_4.extraSupport === "object" ? parsed_4.extraSupport : parsed_4?.payment && typeof parsed_4.payment === "object" ? parsed_4.payment : {};
    let extraType = String(rawExtra.type || "none").trim();
    if (extraType === "red_packet") extraType = "transfer";
    if (!["none", "transfer", "family_card", "family_card_increase"].includes(extraType)) extraType = "none";
    const value_433 = Number.isFinite(Number(rawExtra.amount)) && Number(rawExtra.amount) > 0 ? Math.round(Number(rawExtra.amount) * 100) / 100 : 0;
    if (value_433 <= 0) extraType = "none";
    return {
      decision: decision_2,
      reason: reason_2,
      messages: messages_3,
      extraSupport: {
        type: extraType,
        amount: value_433,
        description: String(rawExtra.description || "TA 额外补贴").trim() || "TA 额外补贴"
      }
    };
  },
  openSavingsJar: function () {
    const currentFriend_10 = this.getCurrentChar();
    if (!currentFriend_10?.hasLovesSpace) {
      if (window.showToast) window.showToast("请先进入情侣空间");
      return;
    }
    this.currentFriend = currentFriend_10;
    const sharedSavingsBtn_3 = document.getElementById("lovers-savings-view");
    if (!sharedSavingsBtn_3) return;
    this.ensureSavingsData();
    const loversSpaceViewElement_438 = document.getElementById("lovers-space-view");
    loversSpaceViewElement_438 && sharedSavingsBtn_3.parentElement !== loversSpaceViewElement_438 && loversSpaceViewElement_438.appendChild(sharedSavingsBtn_3);
    sharedSavingsBtn_3.classList.add("active");
    const fab_2 = document.getElementById("lovers-space-fab");
    fab_2 && (fab_2.hidden = false, fab_2.setAttribute("aria-label", "我存钱"), fab_2.title = "我存钱", fab_2.style.removeProperty("display"), fab_2.style.removeProperty("z-index"), fab_2.classList.add("is-savings-mode"));
    const backBtn_2 = document.getElementById("lovers-savings-back-btn");
    backBtn_2 && (backBtn_2.onclick = () => {
      sharedSavingsBtn_3.classList.remove("active");
      fab_2 && (fab_2.classList.remove("is-savings-mode"), fab_2.hidden = !this.getCurrentChar()?.hasLovesSpace || !this.view?.querySelector(".lovers-space-tab[data-tab=\"moments\"]")?.classList.contains("active"), fab_2.setAttribute("aria-label", "添加内容"), fab_2.title = "", fab_2.style.removeProperty("display"), fab_2.style.removeProperty("z-index"));
    });
    const addBtn_2 = document.getElementById("lovers-savings-add-btn");
    addBtn_2 && (addBtn_2.onclick = () => this.openSavingsSettingsSheet());
    const dateFilter = document.getElementById("lovers-savings-date-filter");
    dateFilter && (dateFilter.onchange = () => this.renderSavingsJar());
    this.renderSavingsJar();
  },
  renderSavingsJar: function () {
    if (!this.currentFriend) return;
    const savings_5 = this.ensureSavingsData(),
      summary_3 = this.getSavingsSummary(savings_5),
      textContent_3 = this.currentFriend.nickname || this.currentFriend.realname || "TA",
      textContent_2 = window.userState?.name || window.imData?.profile?.name || "我",
      percent = savings_5.goal > 0 ? Math.min(100, Math.round(summary_3.total / savings_5.goal * 100)) : 0,
      totalEl = document.getElementById("lovers-savings-total"),
      goalEl = document.getElementById("lovers-savings-goal"),
      percentEl = document.getElementById("lovers-savings-percent"),
      progressEl = document.getElementById("lovers-savings-progress"),
      userAmountEl = document.getElementById("lovers-savings-user-amount"),
      charAmountEl = document.getElementById("lovers-savings-char-amount"),
      userNameEl = document.getElementById("lovers-savings-user-name"),
      charNameEl = document.getElementById("lovers-savings-char-name"),
      leftEl = document.getElementById("lovers-savings-left"),
      loversSavingsDateFilterElement_444 = document.getElementById("lovers-savings-date-filter"),
      selectedDateLabel = document.getElementById("lovers-savings-selected-date"),
      loversSavingsRecordsElement = document.getElementById("lovers-savings-records");
    if (totalEl) totalEl.textContent = this.formatMoney(summary_3.total);
    if (goalEl) goalEl.textContent = "目标 " + this.formatMoney(savings_5.goal);
    if (percentEl) percentEl.textContent = percent + "%";
    if (progressEl) progressEl.style.width = percent + "%";
    if (userAmountEl) userAmountEl.textContent = this.formatMoney(summary_3.user);
    if (charAmountEl) charAmountEl.textContent = this.formatMoney(summary_3.char);
    if (userNameEl) userNameEl.textContent = textContent_2;
    if (charNameEl) charNameEl.textContent = textContent_3;
    if (leftEl) leftEl.textContent = summary_3.total >= savings_5.goal ? "目标已达成" : "还差 " + this.formatMoney(savings_5.goal - summary_3.total);
    loversSavingsDateFilterElement_444 && !loversSavingsDateFilterElement_444.value && (loversSavingsDateFilterElement_444.value = this.getLocalDateKey());
    const selectedDate = loversSavingsDateFilterElement_444?.value || this.getLocalDateKey(),
      dateKey_446 = this.parseDateKey(selectedDate);
    selectedDateLabel && (selectedDateLabel.textContent = dateKey_446.getMonth() + 1 + "月" + dateKey_446.getDate() + "日");
    const depositRecords = savings_5.records.filter(record_11 => record_11.date === selectedDate).map(record_12 => ({
        ...record_12,
        kind: "deposit"
      })),
      withdrawalRecords = (Array.isArray(savings_5.withdrawals) ? savings_5.withdrawals : []).filter(record_13 => record_13.date === selectedDate).map(record_14 => ({
        ...record_14,
        kind: "withdrawal"
      })),
      dayRecords = depositRecords.concat(withdrawalRecords).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)),
      dayUser = depositRecords.filter(record_15 => record_15.actor !== "char").reduce((sum_2, record_16) => sum_2 + Number(record_16.amount || 0), 0),
      dayChar = depositRecords.filter(record_17 => record_17.actor === "char").reduce((sum_3, record_18) => sum_3 + Number(record_18.amount || 0), 0),
      dayUserEl = document.getElementById("lovers-savings-day-user"),
      dayCharEl = document.getElementById("lovers-savings-day-char");
    if (dayUserEl) dayUserEl.textContent = this.formatMoney(dayUser);
    if (dayCharEl) dayCharEl.textContent = this.formatMoney(dayChar);
    if (!loversSavingsRecordsElement) return;
    if (dayRecords.length === 0) {
      loversSavingsRecordsElement.innerHTML = "\n                <div class=\"lovers-savings-empty\">\n                    <i class=\"fas fa-piggy-bank\"></i>\n                    <div>这天还没有存入记录</div>\n                </div>\n            ";
      return;
    }
    loversSavingsRecordsElement.innerHTML = dayRecords.map(record_19 => {
      const isWithdrawal = record_19.kind === "withdrawal",
        isChar_2 = record_19.actor === "char",
        value_465 = isChar_2 ? textContent_3 : textContent_2,
        time_2 = new Date(record_19.timestamp || Date.now()).toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        });
      return "\n                <div class=\"lovers-savings-record " + (isWithdrawal ? "is-withdrawal" : "") + "\" data-record-id=\"" + record_19.id + "\">\n                    <div class=\"lovers-savings-record-icon " + (isChar_2 ? "is-char" : "is-user") + "\">\n                        <i class=\"fas " + (isWithdrawal ? "fa-arrow-up-from-bracket" : isChar_2 ? "fa-heart" : "fa-coins") + "\"></i>\n                    </div>\n                    <div class=\"lovers-savings-record-main\">\n                        <div class=\"lovers-savings-record-top\">\n                            <span>" + (isWithdrawal ? "提款到 Pay" : this.escapeHTML(value_465)) + "</span>\n                            <strong>" + (isWithdrawal ? "-" : "") + this.formatMoney(record_19.amount) + "</strong>\n                        </div>\n                        <div class=\"lovers-savings-record-meta\">\n                            <span>" + time_2 + "</span>\n                            " + (isWithdrawal ? "<span>" + this.escapeHTML(record_19.reason || "存钱罐提款") + "</span>" : record_19.note ? "<span>" + this.escapeHTML(record_19.note) + "</span>" : "") + "\n                        </div>\n                    </div>\n                </div>\n            ";
    }).join("");
  },
  openSavingsDepositSheet: function (defaultActor = "user") {
    if (!this.currentFriend) return;
    const sharedSavingsBtn_4 = document.getElementById("lovers-savings-deposit-sheet");
    if (!sharedSavingsBtn_4) return;
    const loversSavingsViewElement_468 = document.getElementById("lovers-savings-view");
    loversSavingsViewElement_468 && sharedSavingsBtn_4.parentElement !== loversSavingsViewElement_468 && loversSavingsViewElement_468.appendChild(sharedSavingsBtn_4);
    const loversSavingsAmountInputElement = document.getElementById("lovers-savings-amount-input"),
      dateInput = document.getElementById("lovers-savings-date-input"),
      loversSavingsNoteInputElement = document.getElementById("lovers-savings-note-input"),
      actorInput = document.getElementById("lovers-savings-actor-input"),
      value_469 = this.currentFriend.nickname || this.currentFriend.realname || "TA";
    if (loversSavingsAmountInputElement) loversSavingsAmountInputElement.value = "";
    if (dateInput) dateInput.value = this.getLocalDateKey();
    if (loversSavingsNoteInputElement) loversSavingsNoteInputElement.value = "";
    actorInput && (actorInput.innerHTML = "\n                <option value=\"user\">我</option>\n                <option value=\"char\">" + this.escapeHTML(value_469) + "</option>\n            ", actorInput.value = defaultActor === "char" ? "char" : "user");
    const cancelBtn_2 = document.getElementById("lovers-savings-deposit-cancel");
    if (cancelBtn_2) cancelBtn_2.onclick = () => this.closeSavingsSheet(sharedSavingsBtn_4);
    const saveBtn = document.getElementById("lovers-savings-deposit-save");
    saveBtn && (saveBtn.onclick = () => this.addSavingsRecord());
    this.openSavingsSheet(sharedSavingsBtn_4, loversSavingsAmountInputElement);
  },
  openSavingsSettingsSheet: function () {
    if (!this.currentFriend) return;
    const sheet = document.getElementById("lovers-savings-settings-sheet");
    if (!sheet) return;
    const loversSavingsViewElement_470 = document.getElementById("lovers-savings-view");
    loversSavingsViewElement_470 && sheet.parentElement !== loversSavingsViewElement_470 && loversSavingsViewElement_470.appendChild(sheet);
    const savings_6 = this.ensureSavingsData(),
      goalInput = document.getElementById("lovers-savings-goal-input");
    if (goalInput) goalInput.value = String(savings_6.goal || 5200);
    const cancelBtn_3 = document.getElementById("lovers-savings-settings-cancel");
    if (cancelBtn_3) cancelBtn_3.onclick = () => this.closeSavingsSheet(sheet);
    const saveBtn_2 = document.getElementById("lovers-savings-settings-save");
    if (saveBtn_2) saveBtn_2.onclick = () => this.saveSavingsSettings();
    const withdrawBtn = document.getElementById("lovers-savings-withdraw-btn");
    withdrawBtn && (withdrawBtn.onclick = () => {
      this.closeSavingsSheet(sheet, {
        keepFabHidden: true
      });
      this.openSavingsWithdrawSheet();
    });
    this.openSavingsSheet(sheet, goalInput);
  },
  saveSavingsSettings: function () {
    if (!this.currentFriend) return;
    const loversSavingsSettingsSheetElement = document.getElementById("lovers-savings-settings-sheet"),
      loversSavingsGoalInputElement_472 = document.getElementById("lovers-savings-goal-input"),
      nextGoal = Number(loversSavingsGoalInputElement_472?.value);
    if (!Number.isFinite(nextGoal) || nextGoal <= 0) {
      if (window.showToast) window.showToast("请输入有效目标金额");
      return;
    }
    const savings_7 = this.ensureSavingsData();
    savings_7.goal = Math.round(nextGoal * 100) / 100;
    this.persistFriendState();
    this.renderSavingsJar();
    this.closeSavingsSheet(loversSavingsSettingsSheetElement);
    if (window.showToast) window.showToast("目标已更新");
  },
  openSavingsWithdrawSheet: function () {
    if (!this.currentFriend) return;
    const sharedSavingsBtn_5 = document.getElementById("lovers-savings-withdraw-sheet");
    if (!sharedSavingsBtn_5) return;
    const loversSavingsViewElement_475 = document.getElementById("lovers-savings-view");
    loversSavingsViewElement_475 && sharedSavingsBtn_5.parentElement !== loversSavingsViewElement_475 && loversSavingsViewElement_475.appendChild(sharedSavingsBtn_5);
    const loversSavingsWithdrawAmountInputElement = document.getElementById("lovers-savings-withdraw-amount-input"),
      loversSavingsWithdrawReasonInputElement = document.getElementById("lovers-savings-withdraw-reason-input");
    if (loversSavingsWithdrawAmountInputElement) loversSavingsWithdrawAmountInputElement.value = "";
    if (loversSavingsWithdrawReasonInputElement) loversSavingsWithdrawReasonInputElement.value = "";
    const cancelBtn_4 = document.getElementById("lovers-savings-withdraw-cancel");
    if (cancelBtn_4) cancelBtn_4.onclick = () => this.closeSavingsSheet(sharedSavingsBtn_5);
    const sendBtn = document.getElementById("lovers-savings-withdraw-send");
    sendBtn && (sendBtn.disabled = false, sendBtn.textContent = "发送请求", sendBtn.onclick = () => this.sendSavingsWithdrawRequest());
    this.openSavingsSheet(sharedSavingsBtn_5, loversSavingsWithdrawAmountInputElement);
  },
  sendSavingsWithdrawRequest: async function () {
    if (!this.currentFriend) return;
    const loversSavingsWithdrawSheetElement_476 = document.getElementById("lovers-savings-withdraw-sheet"),
      loversSavingsWithdrawAmountInputElement_477 = document.getElementById("lovers-savings-withdraw-amount-input"),
      reasonInput = document.getElementById("lovers-savings-withdraw-reason-input"),
      loversSavingsWithdrawSendElement_479 = document.getElementById("lovers-savings-withdraw-send"),
      amount_4 = Number(loversSavingsWithdrawAmountInputElement_477?.value),
      reason_3 = String(reasonInput?.value || "").trim();
    if (!Number.isFinite(amount_4) || amount_4 <= 0) {
      if (window.showToast) window.showToast("请输入有效提款金额");
      return;
    }
    if (!reason_3) {
      if (window.showToast) window.showToast("请输入提款理由");
      return;
    }
    const endpoint_3 = this.getSavingsApiEndpoint();
    if (!endpoint_3 || !window.apiConfig?.apiKey) {
      if (window.showToast) window.showToast("请先在系统设置中配置 API");
      return;
    }
    const friend_12 = this.currentFriend;
    window.imApp?.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(friend_12));
    const savings_8 = this.ensureSavingsData(friend_12),
      savingsSummary_484 = this.getSavingsSummary(savings_8),
      value_485 = friend_12.nickname || friend_12.realname || friend_12.realName || friend_12.name || "TA",
      value_486 = window.userState?.persona || "普通用户",
      value_487 = friend_12.persona || "普通角色",
      recentMessages = Array.isArray(friend_12.messages) ? friend_12.messages.slice(-10) : [],
      join_489 = recentMessages.map(msg_2 => {
        const sender_3 = msg_2.role === "user" || msg_2.sender === "me" ? "User" : "Char";
        let content_2 = msg_2.text || msg_2.content || "";
        return msg_2.type === "pay_transfer" && (content_2 = ("[支付卡片] " + (msg_2.description || msg_2.cardTitle || "") + " " + (msg_2.amount ? "¥" + Number(msg_2.amount).toFixed(2) : "")).trim()), content_2 = String(content_2 || "[特殊消息]").replace(/<[^>]+>/g, "").slice(0, 180), sender_3 + ": " + content_2;
      }).join("\n");
    let text_490 = "";
    if (window.getGlobalWorldBookContextByPosition) {
      text_490 = window.getGlobalWorldBookContextByPosition("system_depth") || "";
      const globalWorldBookContextByPosition_495 = window.getGlobalWorldBookContextByPosition("before_role");
      if (globalWorldBookContextByPosition_495) text_490 += "\n" + globalWorldBookContextByPosition_495;
    }
    const value_491 = "你现在扮演 Char，需要处理情侣共享存钱罐的一次提款请求。\n\n【提款请求】\nUser 想从存钱罐提款：¥" + amount_4.toFixed(2) + "\n提款理由：" + reason_3 + "\n\n【存钱罐状态】\n存钱目标：" + this.formatMoney(savings_8.goal) + "\n当前总额：" + this.formatMoney(savingsSummary_484.total) + "\nUser 已存：" + this.formatMoney(savingsSummary_484.user) + "\nChar 已存：" + this.formatMoney(savingsSummary_484.char) + "\n\n" + (text_490 ? "【世界书设定】\n" + text_490 + "\n\n" : "") + "【角色(Char)人设】\n" + value_487 + "\n\n【用户(User)人设】\n" + value_486 + "\n\n" + (join_489 ? "【近期 iMessage 上下文】\n" + join_489 + "\n\n" : "") + "要求：\n1. 你必须以 Char 的身份决定同意或拒绝这次提款，decision 只能是 \"approve\" 或 \"reject\"。\n2. 返回 reason，作为 Char 给出的同意理由或拒绝理由，语气要符合人设和上下文。\n3. 提款本金来自存钱罐，不是 Char 的钱；如果同意，系统会把这笔钱直接转入 User 的 Pay，并从存钱罐余额扣除。\n4. 生成 messages 数组，包含 2-5 条 Char 会发给 User 的 iMessage 单聊文本，要围绕提款理由自然展开。\n5. extraSupport 是 Char 额外拿自己的钱或亲属卡补贴 User，完全看 Char 本人意愿，不是强制项；不想额外补贴时必须写 {\"type\":\"none\"}。如果补贴，type 可为 \"transfer\"、\"family_card\"、\"family_card_increase\"。\n6. 如果拒绝，extraSupport.type 必须是 \"none\"。\n7. 如果提款金额超过当前总额，必须拒绝。\n8. 只返回纯 JSON，不要 Markdown，不要多余解释。格式如下：\n{\"decision\":\"approve\",\"reason\":\"可以，你先拿去买吃的。\",\"messages\":[\"吃什么？\",\"就提这么点够不够？\"],\"extraSupport\":{\"type\":\"none\"}}";
    loversSavingsWithdrawSendElement_479 && (loversSavingsWithdrawSendElement_479.disabled = true, loversSavingsWithdrawSendElement_479.textContent = "发送中");
    if (window.showToast) window.showToast("正在发送提款请求...");
    try {
      const response_2 = await fetch(endpoint_3, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.apiConfig.apiKey
        },
        body: JSON.stringify({
          model: window.apiConfig.model || "gpt-3.5-turbo",
          messages: [{
            role: "system",
            content: "你是角色扮演对话助手，必须严格返回合法 JSON 对象。"
          }, {
            role: "user",
            content: value_491
          }],
          temperature: 0.75
        })
      });
      if (!response_2.ok) {
        const value_500 = await window.u2Api?.readApiError?.(response_2);
        throw window.u2Api?.createHttpError?.(response_2, value_500) || Object.assign(new Error("API Request Failed: HTTP " + response_2.status), {
          status: response_2.status
        });
      }
      const payload_2 = await response_2.json(),
        resultText_3 = payload_2.choices?.[0]?.message?.content || "",
        parsed_5 = this.parseSavingsJsonObject(resultText_3),
        result_3 = this.normalizeSavingsWithdrawResult(parsed_5, Math.round(amount_4 * 100) / 100, reason_3);
      result_3.decision === "approve" && amount_4 > savingsSummary_484.total && (result_3.decision = "reject", result_3.reason = "存钱罐当前只有 " + this.formatMoney(savingsSummary_484.total) + "，不够提款 " + this.formatMoney(amount_4) + "。", result_3.extraSupport = {
        type: "none",
        amount: 0,
        description: ""
      });
      const baseTime = Date.now();
      if (result_3.decision === "approve") {
        if (typeof window.addPayTransaction !== "function") throw new Error("Pay API unavailable");
        const incomeSuccess = window.addPayTransaction(amount_4, "存钱罐提款 · " + value_485, "income");
        if (!incomeSuccess) throw new Error("Pay income failed");
        const value_502 = new Date(),
          localDateKey_503 = this.getLocalDateKey(value_502);
        savings_8.withdrawals.unshift({
          id: "wd_" + Date.now(),
          amount: Math.round(amount_4 * 100) / 100,
          actor: "user",
          date: localDateKey_503,
          reason: reason_3,
          decisionReason: result_3.reason,
          timestamp: value_502.getTime()
        });
        const loversSavingsDateFilterElement_504 = document.getElementById("lovers-savings-date-filter");
        if (loversSavingsDateFilterElement_504) loversSavingsDateFilterElement_504.value = localDateKey_503;
      }
      for (let idx_7 = 0; idx_7 < result_3.messages.length; idx_7++) {
        const timestamp_5 = baseTime + (idx_7 + 1) * 1000,
          value_507 = result_3.messages[idx_7],
          msgObj_2 = {
            id: this.createSavingsMessageId("msg"),
            sender: friend_12.id,
            role: "assistant",
            type: "text",
            text: value_507,
            content: value_507,
            timestamp: timestamp_5,
            time: new Date(timestamp_5).toLocaleTimeString("zh-CN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
            })
          };
        await this.appendSavingsChatMessage(friend_12, msgObj_2, {
          silent: false
        });
      }
      if (result_3.decision === "approve" && result_3.extraSupport.type !== "none") {
        const paymentMsg = this.createSavingsPaymentMessage(friend_12, result_3.extraSupport, baseTime + (result_3.messages.length + 1) * 1000);
        paymentMsg && (await this.appendSavingsChatMessage(friend_12, paymentMsg, {
          silent: false
        }));
      }
      await this.persistFriendState(friend_12);
      this.renderSavingsJar();
      this.closeSavingsSheet(loversSavingsWithdrawSheetElement_476, {
        keepFabHidden: true
      });
      this.openSavingsWithdrawResultModal({
        decision: result_3.decision,
        reason: result_3.reason,
        amount: Math.round(amount_4 * 100) / 100
      });
    } catch (err) {
      console.error("Savings withdraw request failed:", err);
      if (!window.u2Api?.isRequestError?.(err) || !window.u2Api.reportError(err, {
        operation: "提款请求生成"
      })) {
        if (window.showToast) window.showToast("提款请求发送失败，请重试");
      }
      loversSavingsWithdrawSendElement_479 && (loversSavingsWithdrawSendElement_479.disabled = false, loversSavingsWithdrawSendElement_479.textContent = "发送请求");
    }
  },
  openSavingsWithdrawResultModal: function (result_4) {
    const modal_2 = document.getElementById("lovers-savings-withdraw-result-modal");
    if (!modal_2) return;
    const loversSavingsViewElement_511 = document.getElementById("lovers-savings-view");
    loversSavingsViewElement_511 && modal_2.parentElement !== loversSavingsViewElement_511 && loversSavingsViewElement_511.appendChild(modal_2);
    const approved = result_4?.decision === "approve",
      titleEl = document.getElementById("lovers-savings-withdraw-result-title"),
      amountEl = document.getElementById("lovers-savings-withdraw-result-amount"),
      labelEl = document.getElementById("lovers-savings-withdraw-result-reason-label"),
      reasonEl = document.getElementById("lovers-savings-withdraw-result-reason-text"),
      iconEl = document.getElementById("lovers-savings-withdraw-result-icon"),
      closeBtn = document.getElementById("lovers-savings-withdraw-result-close"),
      okBtn = document.getElementById("lovers-savings-withdraw-result-ok");
    modal_2.classList.toggle("is-approved", approved);
    modal_2.classList.toggle("is-rejected", !approved);
    if (titleEl) titleEl.textContent = approved ? "TA 已同意" : "TA 已拒绝";
    if (amountEl) amountEl.textContent = this.formatMoney(result_4?.amount || 0);
    if (labelEl) labelEl.textContent = approved ? "同意理由" : "拒绝理由";
    if (reasonEl) reasonEl.textContent = result_4?.reason || (approved ? "TA 同意了这次提款。" : "TA 拒绝了这次提款。");
    iconEl && (iconEl.innerHTML = "<i class=\"fas " + (approved ? "fa-check" : "fa-xmark") + "\"></i>");
    const closeModal = () => this.closeSavingsSheet(modal_2);
    if (closeBtn) closeBtn.onclick = closeModal;
    if (okBtn) okBtn.onclick = closeModal;
    this.openSavingsSheet(modal_2);
  },
  createSavingsPaymentMessage: function (friend_13, payment_2, timestamp_7 = Date.now()) {
    if (!friend_13 || !payment_2 || payment_2.type === "none") return null;
    const amount_5 = Number(payment_2.amount) || 0;
    if (!Number.isFinite(amount_5) || amount_5 <= 0) return null;
    const value_518 = friend_13.nickname || friend_13.realname || friend_13.realName || friend_13.name || "Char",
      value_519 = window.userState?.name || window.userState?.realName || window.userState?.nickname || window.imData?.profile?.name || "User",
      description_2 = String(payment_2.description || "存钱罐提款").trim() || "存钱罐提款";
    if (payment_2.type === "family_card" || payment_2.type === "family_card_increase") {
      let value_521 = payment_2.type === "family_card_increase" ? "提升亲属卡额度" : "赠送亲属卡";
      if (typeof window.addOrUpdateFamilyCard === "function") {
        const result_5 = window.addOrUpdateFamilyCard(friend_13.id, value_518, amount_5);
        value_521 = result_5?.action === "increase" ? "提升亲属卡额度" : "赠送亲属卡";
      }
      return {
        id: this.createSavingsMessageId("pay"),
        sender: friend_13.id,
        role: "assistant",
        type: "pay_transfer",
        payKind: "system_notification",
        payDirection: "char_to_user",
        amount: amount_5,
        description: value_521 + " ¥" + amount_5.toFixed(2),
        payerName: value_518,
        payeeName: value_519,
        senderName: value_518,
        receiverName: value_519,
        targetName: value_519,
        cardTitle: value_521,
        payStatus: "completed",
        content: "[亲属卡] " + value_521 + " ¥" + amount_5.toFixed(2),
        timestamp: timestamp_7
      };
    }
    return {
      id: this.createSavingsMessageId("pay"),
      sender: friend_13.id,
      role: "assistant",
      type: "pay_transfer",
      payKind: "char_to_user_pending",
      payDirection: "char_to_user",
      amount: amount_5,
      description: description_2,
      payerName: value_518,
      payeeName: value_519,
      senderName: value_518,
      receiverName: value_519,
      targetName: value_519,
      cardTitle: "转账",
      payStatus: "pending",
      content: "[转账] " + description_2 + " ¥" + amount_5.toFixed(2),
      timestamp: timestamp_7
    };
  },
  addSavingsRecord: function () {
    if (!this.currentFriend) return;
    const loversSavingsAmountInputElement_523 = document.getElementById("lovers-savings-amount-input"),
      loversSavingsDateInputElement_524 = document.getElementById("lovers-savings-date-input"),
      noteInput = document.getElementById("lovers-savings-note-input"),
      actorInput_2 = document.getElementById("lovers-savings-actor-input"),
      loversSavingsDepositSheetElement_527 = document.getElementById("lovers-savings-deposit-sheet"),
      amount_6 = Number(loversSavingsAmountInputElement_523?.value);
    if (!Number.isFinite(amount_6) || amount_6 <= 0) {
      if (window.showToast) window.showToast("请输入有效金额");
      return;
    }
    const savings_9 = this.ensureSavingsData(),
      value_530 = loversSavingsDateInputElement_524?.value || this.getLocalDateKey(),
      now_6 = new Date(),
      recordDate_2 = this.parseDateKey(value_530);
    recordDate_2.setHours(now_6.getHours(), now_6.getMinutes(), now_6.getSeconds(), now_6.getMilliseconds());
    savings_9.records.unshift({
      id: "sav_" + Date.now(),
      amount: Math.round(amount_6 * 100) / 100,
      actor: actorInput_2?.value === "char" ? "char" : "user",
      date: value_530,
      note: (noteInput?.value || "").trim(),
      timestamp: recordDate_2.getTime()
    });
    const loversSavingsDateFilterElement_533 = document.getElementById("lovers-savings-date-filter");
    if (loversSavingsDateFilterElement_533) loversSavingsDateFilterElement_533.value = value_530;
    this.persistFriendState();
    this.renderSavingsJar();
    this.closeSavingsSheet(loversSavingsDepositSheetElement_527);
    if (window.showToast) window.showToast("已存入存钱罐");
  },
  open: function () {
    if (!this.initialized) this.init();
    if (!this.view) return;
    const appContainer = document.getElementById("app");
    appContainer && (appContainer.scrollTop = 0, appContainer.scrollLeft = 0);
    this.scanForAcceptance();
    if (typeof window.openView === "function") window.openView(this.view);else this.view.classList.add("active");
    this.refreshSelectedChar();
  },
  scanForAcceptance: function () {
    const friends_2 = window.imData?.friends || [];
    let enabled_535 = false;
    friends_2.forEach(friend_14 => {
      if (!this.isLovesChar(friend_14)) return;
      if (friend_14.pendingLovesInvite && !friend_14.hasLovesSpace) {
        const msgs = Array.isArray(friend_14.messages) ? friend_14.messages : [];
        for (let value_538 = msgs.length - 1; value_538 >= 0; value_538--) {
          const msg_3 = msgs[value_538];
          if (msg_3.sender !== "me" && msg_3.text && msg_3.text.includes("[ACCEPT_INVITE]")) {
            friend_14.hasLovesSpace = true;
            friend_14.pendingLovesInvite = false;
            !Number(friend_14.lovesSpaceStartTime) && (friend_14.lovesSpaceStartTime = Number(msg_3.timestamp) || Date.now());
            msg_3.text = msg_3.text.replace(/\[ACCEPT_INVITE\]/g, "").trim();
            msg_3.content && (msg_3.content = msg_3.content.replace(/\[ACCEPT_INVITE\]/g, "").trim());
            const options_540 = {
              id: window.imChat && window.imChat.createMessageId ? window.imChat.createMessageId("msg") : "msg_" + Date.now(),
              sender: msg_3.sender,
              role: "assistant",
              content: "<div class=\"loves-invite-bubble\" style=\"background:#fff; border-radius:16px; padding:12px; border:1px solid #e5e5ea;  color:#111; max-width:220px; margin:2px;\">\n                                <div style=\"display:flex; align-items:center; gap:8px; margin-bottom:8px;\">\n                                    <div style=\"width:28px; height:28px; border-radius:8px; background:#ff2d55; color:#fff; display:flex; justify-content:center; align-items:center; font-size:14px;\"><i class=\"fas fa-heart\"></i></div>\n                                    <div style=\"font-size:14px; font-weight:700;\">邀请已接受</div>\n                                </div>\n                                <div style=\"font-size:13px; color:#333; line-height:1.4;\">TA 已接受了你的情侣空间邀请。</div>\n                            </div>",
              text: "【邀请已接受】TA 已接受了你的情侣空间邀请。",
              timestamp: Date.now(),
              time: new Date().toLocaleTimeString("zh-CN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
              }),
              type: "html"
            };
            msgs.push(options_540);
            void this.syncDailySavingsForFriend(friend_14, new Date(), {
              persist: false
            });
            enabled_535 = true;
            break;
          }
        }
      }
    });
    enabled_535 && friends_2.forEach(friend_15 => {
      if (friend_15.hasLovesSpace) this.persistFriendState(friend_15, {
        metaOnly: true
      });
    });
  },
  handleInviteAccepted: async function (friend_16) {
    if (!this.isLovesChar(friend_16)) return;
    const lovesSpaceStartTime_2 = Date.now();
    friend_16.hasLovesSpace = true;
    friend_16.pendingLovesInvite = false;
    if (!Number(friend_16.lovesSpaceStartTime)) friend_16.lovesSpaceStartTime = lovesSpaceStartTime_2;
    const acceptMsg = {
      id: window.imChat && window.imChat.createMessageId ? window.imChat.createMessageId("msg") : "msg_" + Date.now(),
      sender: friend_16.id,
      role: "assistant",
      content: "<div class=\"loves-invite-bubble\" style=\"background:#fff; border-radius:16px; padding:12px; border:1px solid #e5e5ea;  color:#111; max-width:220px; margin:2px;\">\n                <div style=\"display:flex; align-items:center; gap:8px; margin-bottom:8px;\">\n                    <div style=\"width:28px; height:28px; border-radius:8px; background:#ff2d55; color:#fff; display:flex; justify-content:center; align-items:center; font-size:14px;\"><i class=\"fas fa-heart\"></i></div>\n                    <div style=\"font-size:14px; font-weight:700;\">邀请已接受</div>\n                </div>\n                <div style=\"font-size:13px; color:#333; line-height:1.4;\">我已经接受了你的情侣空间邀请，现在我们可以一起使用了。</div>\n            </div>",
      text: "【情侣空间】我接受了你的邀请",
      timestamp: lovesSpaceStartTime_2 - 100,
      type: "html"
    };
    if (window.imApp && window.imApp.appendFriendMessage) await window.imApp.appendFriendMessage(friend_16.id, acceptMsg, {
      silent: true
    });else friend_16.messages && Array.isArray(friend_16.messages) && friend_16.messages.push(acceptMsg);
    await this.syncDailySavingsForFriend(friend_16, new Date(lovesSpaceStartTime_2), {
      persist: false
    });
    await this.persistFriendState(friend_16, {
      metaOnly: true
    });
    String(this.currentFriend?.id || "") === String(friend_16.id) && this.view?.classList.contains("active") && this.enterLovesSpace(friend_16);
    const pageId = "chat-interface-" + friend_16.id,
      page_2 = document.getElementById(pageId);
    if (page_2) {
      const container_4 = page_2.querySelector(".ins-chat-messages");
      container_4 && window.imChat && window.imChat.appendMessageToContainer && window.imChat.appendMessageToContainer(friend_16, container_4, acceptMsg);
    }
    const detailName = document.getElementById("loves-detail-name"),
      lovesDetailAreaElement = document.getElementById("loves-detail-area");
    if (lovesDetailAreaElement && lovesDetailAreaElement.style.display === "flex" && detailName) {
      const expectedName = friend_16.nickname || friend_16.realname || "Unknown";
      detailName.textContent === expectedName && this.showFriendDetail(friend_16);
    }
  },
  isLovesChar: function (value_548) {
    return !!value_548 && value_548.type === "char";
  },
  getTopFriends: function () {
    const items_549 = Array.isArray(window.imData?.friends) ? window.imData.friends : [];
    return items_549.filter(value_550 => this.isLovesChar(value_550));
  },
  getCurrentChar: function () {
    return this.getTopFriends().find(value_551 => String(value_551.id) === String(this.currentFriend?.id)) || null;
  },
  getRememberedCharId: function () {
    try {
      return window.localStorage?.getItem("lovesSelectedCharId") || "";
    } catch (value_552) {
      return "";
    }
  },
  rememberChar: function (value_553) {
    try {
      window.localStorage?.setItem("lovesSelectedCharId", String(value_553.id));
    } catch (value_554) {}
  },
  refreshSelectedChar: function () {
    const validFriends = this.getTopFriends(),
      rememberedCharId = this.getRememberedCharId(),
      value_555 = validFriends.find(value_556 => String(value_556.id) === rememberedCharId) || validFriends.find(value_557 => value_557.hasLovesSpace) || validFriends[0] || null;
    if (value_555) this.enterLovesSpace(value_555);else {
      this.currentFriend = null;
      this.renderRelationshipState(null);
    }
  },
  renderCharSwitch: function () {
    const sharedSavingsBtn_6 = document.getElementById("lovers-char-switch-list");
    if (!sharedSavingsBtn_6) return;
    sharedSavingsBtn_6.replaceChildren();
    this.getTopFriends().forEach(value_558 => {
      const delBtn_2 = document.createElement("button");
      delBtn_2.type = "button";
      delBtn_2.className = "lovers-char-switch-row";
      delBtn_2.dataset.lovesCharId = String(value_558.id);
      delBtn_2.setAttribute("aria-current", String(value_558.id) === String(this.currentFriend?.id) ? "true" : "false");
      const element_560 = document.createElement("span");
      element_560.className = "lovers-char-switch-avatar";
      if (value_558.avatarUrl) {
        const element_564 = document.createElement("img");
        element_564.src = value_558.avatarUrl;
        element_564.alt = "";
        element_560.appendChild(element_564);
      } else element_560.innerHTML = "<i class=\"fas fa-user\" aria-hidden=\"true\"></i>";
      const element_561 = document.createElement("span");
      element_561.className = "lovers-char-switch-copy";
      const element_562 = document.createElement("strong");
      element_562.textContent = value_558.nickname || value_558.realname || "Char";
      const element_563 = document.createElement("small");
      element_563.textContent = value_558.hasLovesSpace ? "已建立关系" : value_558.pendingLovesInvite ? "等待接受邀请" : "未邀请";
      element_561.append(element_562, element_563);
      delBtn_2.append(element_560, element_561);
      sharedSavingsBtn_6.appendChild(delBtn_2);
    });
  },
  openCharSwitch: function () {
    const sharedSavingsBtn_7 = document.getElementById("lovers-char-switch-overlay");
    if (!sharedSavingsBtn_7) return;
    this.renderCharSwitch();
    sharedSavingsBtn_7.inert = false;
    sharedSavingsBtn_7.setAttribute("aria-hidden", "false");
    sharedSavingsBtn_7.classList.add("active");
    sharedSavingsBtn_7.querySelector(".lovers-char-switch-row[aria-current=\"true\"]")?.focus();
  },
  closeCharSwitch: function () {
    const sharedSavingsBtn_8 = document.getElementById("lovers-char-switch-overlay");
    if (!sharedSavingsBtn_8) return;
    sharedSavingsBtn_8.classList.remove("active");
    sharedSavingsBtn_8.inert = true;
    sharedSavingsBtn_8.setAttribute("aria-hidden", "true");
    document.getElementById("lovers-space-avatar-switch")?.focus();
  },
  renderRelationshipState: function (value_566) {
    const value_567 = !!value_566?.hasLovesSpace;
    this.view?.classList.toggle("has-relationship", value_567);
    const loversSpaceNoCharElement = document.getElementById("lovers-space-no-char"),
      loversSpaceHeroElement = document.getElementById("lovers-space-hero"),
      loversSpaceInviteStateElement = document.getElementById("lovers-space-invite-state"),
      loversSpaceDaysCardElement = document.getElementById("lovers-space-days-card"),
      loversSpaceTabContentAreaElement = document.getElementById("lovers-space-tab-content-area"),
      loversSpaceTabsContainerElement = document.getElementById("lovers-space-tabs-container"),
      loversSpaceFabElement_568 = document.getElementById("lovers-space-fab"),
      loversSpaceMenuBtnElement_569 = document.getElementById("lovers-space-menu-btn");
    if (loversSpaceNoCharElement) loversSpaceNoCharElement.hidden = !!value_566;
    if (loversSpaceHeroElement) loversSpaceHeroElement.hidden = !value_566;
    if (loversSpaceInviteStateElement) loversSpaceInviteStateElement.hidden = !value_566 || value_567;
    if (loversSpaceDaysCardElement) loversSpaceDaysCardElement.hidden = !value_567;
    if (loversSpaceTabContentAreaElement) loversSpaceTabContentAreaElement.hidden = !value_567;
    if (loversSpaceTabsContainerElement) loversSpaceTabsContainerElement.hidden = !value_567;
    if (loversSpaceMenuBtnElement_569) loversSpaceMenuBtnElement_569.hidden = !value_567;
    if (loversSpaceFabElement_568) loversSpaceFabElement_568.hidden = !value_567 || !document.getElementById("lovers-savings-view")?.classList.contains("active") && !this.view?.querySelector(".lovers-space-tab[data-tab=\"moments\"]")?.classList.contains("active");
    if (value_566) {
      const textContent_4 = value_566.nickname || value_566.realname || "Char",
        loversSpaceCurrentCharElement = document.getElementById("lovers-space-current-char"),
        loversSpaceAvatarSwitchElement = document.getElementById("lovers-space-avatar-switch");
      if (loversSpaceCurrentCharElement) loversSpaceCurrentCharElement.textContent = textContent_4;
      if (loversSpaceAvatarSwitchElement) loversSpaceAvatarSwitchElement.setAttribute("aria-label", "当前是 " + textContent_4 + "，点击切换 Char");
      if (!value_567) {
        const hidden_4 = !!value_566.pendingLovesInvite,
          loversSpaceInviteTitleElement = document.getElementById("lovers-space-invite-title"),
          loversSpaceInviteCopyElement = document.getElementById("lovers-space-invite-copy"),
          loversSpaceInviteBtnElement = document.getElementById("lovers-space-invite-btn");
        if (loversSpaceInviteTitleElement) loversSpaceInviteTitleElement.textContent = hidden_4 ? "邀请已发送" : "邀请 " + textContent_4 + " 加入恋人空间";
        if (loversSpaceInviteCopyElement) loversSpaceInviteCopyElement.textContent = hidden_4 ? "等待 TA 接受邀请后，就可以一起使用这里。" : "邀请后，等 TA 接受即可开始共享生活。";
        if (loversSpaceInviteBtnElement) loversSpaceInviteBtnElement.hidden = hidden_4;
      }
    }
  },
  showFriendDetail: function (friend_572) {},
  sendInviteCard: async function (friend_17) {
    friend_17 = this.getTopFriends().find(value_576 => String(value_576.id) === String(friend_17?.id));
    if (!friend_17 || friend_17.hasLovesSpace || friend_17.pendingLovesInvite) return;
    const inviteMsg = {
      id: window.imChat && window.imChat.createMessageId ? window.imChat.createMessageId("msg") : "msg_" + Date.now(),
      sender: "me",
      role: "user",
      content: "<div class=\"loves-invite-bubble\" style=\"background:#fff; border-radius:16px; padding:12px; border:1px solid #e5e5ea;  color:#111; max-width:220px; margin:2px;\">\n                <div style=\"display:flex; align-items:center; gap:8px; margin-bottom:8px;\">\n                    <div style=\"width:28px; height:28px; border-radius:8px; background:#000; color:#fff; display:flex; justify-content:center; align-items:center; font-size:14px;\"><i class=\"fas fa-heart\"></i></div>\n                    <div style=\"font-size:14px; font-weight:700;\">Loves 邀请</div>\n                </div>\n                <div style=\"font-size:13px; color:#333; line-height:1.4; margin-bottom:8px;\">我向你发送了情侣空间的邀请，快来接受吧！</div>\n                <div style=\"font-size:11px; color:#8e8e93;\">点击接受进入专属空间</div>\n            </div>",
      text: "【情侣空间邀请】我向你发送了情侣空间的邀请，快来接受吧！",
      timestamp: Date.now(),
      time: new Date().toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }),
      type: "html"
    };
    let saved_3 = true;
    if (window.imApp && window.imApp.appendFriendMessage) saved_3 = await window.imApp.appendFriendMessage(friend_17.id, inviteMsg, {
      silent: false
    });else friend_17.messages && Array.isArray(friend_17.messages) ? friend_17.messages.push(inviteMsg) : friend_17.messages = [inviteMsg];
    if (!saved_3) return;
    friend_17.pendingLovesInvite = true;
    await this.persistFriendState(friend_17, {
      metaOnly: true
    });
    window.showToast && window.showToast("已向 " + (friend_17.nickname || friend_17.realname) + " 发送邀请！");
    if (String(this.currentFriend?.id || "") === String(friend_17.id)) this.renderRelationshipState(friend_17);
  },
  getWeiboRandomAvatar: function (friend_18) {
    const seed = encodeURIComponent(String(friend_18?.id || friend_18?.nickname || Date.now()));
    return "https://picsum.photos/seed/weibo_alt_" + seed + "/160/160";
  },
  getWeiboRandomImage: function (value_579, value_580 = 0, value_581 = "main") {
    const encodeURIComponent_582 = encodeURIComponent((value_579?.id || value_579?.nickname || "friend") + "_" + value_581 + "_" + value_580);
    return "https://picsum.photos/seed/weibo_photo_" + encodeURIComponent_582 + "/600/600";
  },
  getWeiboRandomCover: function (value_583, value_584 = "main") {
    const encodeURIComponent_585 = encodeURIComponent((value_583?.id || value_583?.nickname || "friend") + "_" + value_584);
    return "https://picsum.photos/seed/weibo_cover_" + encodeURIComponent_585 + "/800/300";
  },
  normalizeWeiboPost: function (value_586, value_587 = 0, value_588 = false) {
    const message_589 = value_586 && typeof value_586 === "object" ? value_586 : {},
      items_590 = Array.isArray(message_589.comments) ? message_589.comments : [],
      map_591 = items_590.map((text_12, value_593) => {
        if (typeof text_12 === "string") return {
          author: "评论用户" + (value_593 + 1),
          text: text_12
        };
        return {
          ...text_12,
          author: text_12?.author || text_12?.name || "评论用户" + (value_593 + 1),
          text: text_12?.text || text_12?.content || "说得很对。"
        };
      });
    return {
      ...message_589,
      id: message_589.id || "post_" + Date.now() + "_" + value_587,
      author: message_589.author || message_589.name || "",
      text: message_589.text || message_589.content || message_589.title || "",
      time: message_589.time || message_589.createdAt || "",
      source: message_589.source || "来自 iPhone",
      comments: map_591.slice(0, 5),
      reposts: message_589.reposts ?? message_589.repostCount ?? Math.max(1, value_587 + 2),
      likes: message_589.likes ?? message_589.likeCount ?? (value_588 ? 128 + value_587 * 31 : 76 + value_587 * 27),
      likedByMe: value_588 || message_589.likedByMe === true
    };
  },
  normalizeWeiboAlbumItem: function (value_594, index_4 = 0, friend_19 = null, account_2 = "main") {
    const message_598 = value_594 && typeof value_594 === "object" ? value_594 : {};
    return {
      ...message_598,
      id: message_598.id || "album_" + account_2 + "_" + index_4,
      url: message_598.url || message_598.image || message_598.imageUrl || this.getWeiboRandomImage(friend_19, index_4, account_2),
      description: message_598.description || message_598.desc || message_598.content || ""
    };
  },
  getDefaultWeiboData: function (friend_20) {
    return {
      mainAccount: {
        signature: "",
        posts: [],
        album: [],
        liked: []
      }
    };
  },
  clampFriendGenCount: function (value_30, fallback_4, min_2, max_3) {
    const parsed = Number.parseInt(value_30, 10);
    if (!Number.isFinite(parsed)) return fallback_4;
    return Math.min(max_3, Math.max(min_2, parsed));
  },
  getFriendPhoneGenCounts: function (friend_21) {
    const saved_4 = friend_21?.phoneGenCounts && typeof friend_21.phoneGenCounts === "object" ? friend_21.phoneGenCounts : {};
    return {
      musicTop: this.clampFriendGenCount(saved_4.musicTop, 3, 1, 10),
      safariTotal: this.clampFriendGenCount(saved_4.safariTotal, 10, 2, 30),
      gameTotal: this.clampFriendGenCount(saved_4.gameTotal, 2, 1, 5),
      callTotal: this.clampFriendGenCount(saved_4.callTotal, 5, 1, 20),
      weiboPostsTotal: this.clampFriendGenCount(saved_4.weiboPostsTotal, 10, 2, 20),
      weiboPhotosTotal: this.clampFriendGenCount(saved_4.weiboPhotosTotal, 6, 2, 12)
    };
  },
  splitFriendGenTotal: function (total_2) {
    return {
      primary: Math.ceil(total_2 / 2),
      secondary: Math.floor(total_2 / 2)
    };
  },
  getFriendComputerGenCounts: function (friend_22) {
    const saved = friend_22?.computerGenCounts && typeof friend_22.computerGenCounts === "object" ? friend_22.computerGenCounts : {};
    return {
      mail: this.clampFriendGenCount(saved.mail, 6, 1, 12),
      calendar: this.clampFriendGenCount(saved.calendar, 5, 1, 10),
      notes: this.clampFriendGenCount(saved.notes, 5, 1, 10),
      files: this.clampFriendGenCount(saved.files, 6, 1, 12)
    };
  },
  getCurrentRealTimeContext: function (baseDate_2 = new Date()) {
    const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
      value_610 = value_611 => String(value_611).padStart(2, "0");
    return baseDate_2.getFullYear() + "年" + value_610(baseDate_2.getMonth() + 1) + "月" + value_610(baseDate_2.getDate()) + "日 " + weekdays[baseDate_2.getDay()] + " " + value_610(baseDate_2.getHours()) + ":" + value_610(baseDate_2.getMinutes()) + ":" + value_610(baseDate_2.getSeconds());
  },
  getRecentSingleChatRounds: function (messages_4, roundLimit = 20) {
    if (!Array.isArray(messages_4)) return [];
    const safeLimit = this.clampFriendGenCount(roundLimit, 20, 1, 50);
    return messages_4.slice(-(safeLimit * 2));
  },
  getRecentSingleChatMessages: function (messages_5, messageLimit = 20) {
    if (!Array.isArray(messages_5)) return [];
    const safeLimit_2 = this.clampFriendGenCount(messageLimit, 20, 1, 50);
    return messages_5.slice(-safeLimit_2);
  },
  buildFriendPhoneExistingContentContext: function (value_615, selectedApps, maxEntries = 160) {
    const roots = {
        music: value_615?.musicData,
        health: value_615?.healthData,
        pay: value_615?.payData,
        game: value_615?.gameData,
        call: value_615?.callData,
        safari: value_615?.safariData,
        weibo: value_615?.weiboData,
        files: value_615?.filesData
      },
      readableKeys = new Set(["text", "content", "keyword", "title", "description", "thoughts", "dream", "stepsThoughts", "heartRateStatus", "dialogue", "callReason", "innerThoughts", "postGameReflection", "desc", "name", "contactName", "userRemark", "signature", "artist", "hero", "rank", "result", "source"]),
      entries_2 = [],
      value_620 = new Set(),
      visit = (value_31, value_622 = "") => {
        if (entries_2.length >= maxEntries || value_31 == null) return;
        if (Array.isArray(value_31)) return value_31.forEach((value_623, value_624) => visit(value_623, value_622 + "[" + value_624 + "]"));
        if (typeof value_31 !== "object") return;
        Object.entries(value_31).forEach(([key_8, value_626]) => {
          if (entries_2.length >= maxEntries || /TranslationZh$|^(?:generatedAt|batchId|time|date|timestamp)$/i.test(key_8)) return;
          const value_627 = value_622 ? value_622 + "." + key_8 : key_8;
          if (typeof value_626 === "string" && readableKeys.has(key_8)) {
            const text_8 = value_626.trim(),
              normalized = text_8.toLocaleLowerCase().replace(/\s+/g, " ");
            text_8 && !value_620.has(normalized) && !/^(?:https?:|data:|#[0-9a-f]{3,8}$)/i.test(text_8) && (value_620.add(normalized), entries_2.push(value_627 + ": " + text_8.slice(0, 240)));
          } else visit(value_626, value_627);
        });
      };
    return (Array.isArray(selectedApps) ? selectedApps : []).forEach(app => visit(roots[app], app)), entries_2.join("\n");
  },
  normalizeFriendComputerData: function (value_630, friend_23) {
    const source_4 = value_630 && typeof value_630 === "object" ? value_630 : {},
      resume_2 = source_4.resume && typeof source_4.resume === "object" ? source_4.resume : {},
      list_3 = (value_34, limit) => Array.isArray(value_34) ? value_34.filter(Boolean).slice(0, limit) : [],
      name_2 = friend_23?.nickname || friend_23?.realname || friend_23?.realName || friend_23?.name || "好友";
    return {
      resume: {
        name: name_2,
        avatarUrl: friend_23?.avatarUrl || "",
        realName: friend_23?.realname || friend_23?.realName || resume_2.realName || "",
        gender: resume_2.gender || "",
        age: resume_2.age || "",
        birthday: resume_2.birthday || "",
        height: resume_2.height || "",
        weight: resume_2.weight || "",
        ethnicity: resume_2.ethnicity || "",
        nationality: resume_2.nationality || "",
        title: resume_2.title || "",
        email: resume_2.email || "",
        phone: resume_2.phone || "",
        location: resume_2.location || "",
        summary: resume_2.summary || "",
        skills: list_3(resume_2.skills, 12),
        experience: list_3(resume_2.experience, 6),
        education: list_3(resume_2.education, 4),
        projects: list_3(resume_2.projects, 6),
        certificates: list_3(resume_2.certificates, 6),
        languages: list_3(resume_2.languages, 6)
      },
      mail: list_3(source_4.mail, 12),
      calendar: list_3(source_4.calendar, 10),
      notes: list_3(source_4.notes, 10),
      files: list_3(source_4.files, 12),
      generatedAt: source_4.generatedAt || ""
    };
  },
  normalizeWeiboAccount: function (value_637, friend_24, account = "main") {
    const source_5 = value_637 && typeof value_637 === "object" ? value_637 : {},
      displayName = friend_24?.nickname || friend_24?.realname || friend_24?.realName || friend_24?.name || "好友",
      isAlt = account === "alt",
      name_3 = isAlt ? source_5.name || "未公开小号" : displayName,
      avatarUrl_2 = isAlt ? source_5.avatarUrl || this.getWeiboRandomAvatar(friend_24) : friend_24?.avatarUrl || "",
      posts_3 = Array.isArray(source_5.posts) ? source_5.posts : [],
      album_2 = Array.isArray(source_5.album) ? source_5.album : [],
      liked_2 = Array.isArray(source_5.liked) ? source_5.liked.slice(0, 3) : [];
    return {
      ...source_5,
      name: name_3,
      signature: source_5.signature || "",
      avatarUrl: avatarUrl_2,
      posts: posts_3.map((post_2, index_5) => this.normalizeWeiboPost(post_2, index_5, false)),
      album: album_2.map((item_13, index_6) => this.normalizeWeiboAlbumItem(item_13, index_6, friend_24, account)),
      liked: liked_2.map((post_3, index_7) => this.normalizeWeiboPost(post_3, index_7, true))
    };
  },
  getFriendWeiboData: function (friend_25) {
    const hasGeneratedData = friend_25?.weiboData && typeof friend_25.weiboData === "object",
      data_2 = hasGeneratedData ? friend_25.weiboData : this.getDefaultWeiboData(friend_25);
    return {
      mainAccount: this.normalizeWeiboAccount(data_2.mainAccount || data_2.main || data_2, friend_25, "main"),
      altAccount: hasGeneratedData && data_2.altAccount ? this.normalizeWeiboAccount(data_2.altAccount, friend_25, "alt") : null
    };
  },
  renderWeiboAvatarHtml: function (value_656, value_657 = 40) {
    const escapeHTML_658 = this.escapeHTML(value_656 || "");
    return "\n            <div style=\"width: " + value_657 + "px; height: " + value_657 + "px; border-radius: 50%; background: linear-gradient(135deg, #fff2e2, #ffd2c2); display: flex; align-items: center; justify-content: center; color: #ff8200; flex-shrink: 0; overflow: hidden;\">\n                " + (escapeHTML_658 ? "<img src=\"" + escapeHTML_658 + "\" style=\"width: 100%; height: 100%; object-fit: cover;\">" : "<i class=\"fas fa-user\"></i>") + "\n            </div>\n        ";
  },
  renderWeiboPostCard: function (post_4, accountData_2, options_8 = {}) {
    const escapeHTML_662 = this.escapeHTML(post_4.author || options_8.authorName || accountData_2.name || "微博用户"),
      safeText = this.escapeHTML(post_4.text || "").replace(/\n/g, "<br>"),
      safeTime = this.escapeHTML(this.formatFriendPhoneGeneratedAt(post_4.generatedAt) || post_4.time || ""),
      safeSource = this.escapeHTML(post_4.source || "来自 iPhone"),
      commentCount = Array.isArray(post_4.comments) ? post_4.comments.length : 0,
      value_667 = options_8.images && options_8.images.length ? "\n            <div style=\"display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-top: 10px;\">\n                " + options_8.images.slice(0, 3).map(value_668 => "<div style=\"aspect-ratio: 1; border-radius: 8px; overflow: hidden; background: #f2f2f2;\"><img src=\"" + this.escapeHTML(value_668.url) + "\" style=\"width: 100%; height: 100%; object-fit: cover;\"></div>").join("") + "\n            </div>\n        " : "";
    return "\n            <div class=\"friend-weibo-post-card\" data-post-type=\"" + (options_8.type || "home") + "\" data-index=\"" + (options_8.index || 0) + "\" style=\"background: #fff; padding: 14px 16px; cursor: pointer;\">\n                " + (options_8.likedLabel ? "<div style=\"font-size: 12px; color: #999; margin-bottom: 8px;\">赞过 @" + escapeHTML_662 + " 的微博</div>" : "") + "\n                <div style=\"display: flex; gap: 10px;\">\n                    " + (options_8.likedLabel ? "" : this.renderWeiboAvatarHtml(accountData_2.avatarUrl, 40)) + "\n                    <div style=\"flex: 1; min-width: 0;\">\n                        " + (options_8.likedLabel ? "" : "\n                        <div style=\"display: flex; align-items: center; justify-content: space-between; gap: 8px;\">\n                            <div>\n                                <div style=\"font-size: 15px; font-weight: 700; color: #111;\">" + escapeHTML_662 + "</div>\n                                <div style=\"font-size: 12px; color: #999; margin-top: 2px;\">" + safeTime + " " + safeSource + "</div>\n                            </div>\n                            <i class=\"fas fa-ellipsis-h\" style=\"color: #999;\"></i>\n                        </div>") + "\n                        <div style=\"font-size: 15px; color: #222; line-height: 1.55; " + (options_8.likedLabel ? "" : "margin-top: 10px;") + "\">" + safeText + "</div>\n                        " + value_667 + "\n                        <div style=\"display: flex; justify-content: space-between; align-items: center; margin-top: 13px; color: #888; font-size: 13px;\">\n                            <span><i class=\"far fa-comment-dots\"></i> " + (commentCount || Math.max(3, Number(options_8.index || 0) + 3)) + "</span>\n                            <span><i class=\"fas fa-retweet\"></i> " + this.escapeHTML(post_4.reposts ?? 0) + "</span>\n                            <span style=\"" + (post_4.likedByMe ? "color: #ff8200;" : "") + "\"><i class=\"" + (post_4.likedByMe ? "fas" : "far") + " fa-heart\"></i> " + (post_4.likedByMe ? "已赞" : this.escapeHTML(post_4.likes ?? 0)) + "</span>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        ";
  },
  showWeiboPostDetail: function (post_5, accountData_3, value_671 = {}) {
    const escapeHTML_672 = this.escapeHTML(post_5.author || value_671.authorName || accountData_3.name || "微博用户"),
      safeText_2 = this.renderFriendPhoneLocalized(post_5, "text", {
        id: "weibo-detail-text"
      }),
      items_674 = Array.isArray(post_5.comments) ? post_5.comments : [],
      value_675 = items_674.length ? items_674.map(comment_2 => "\n            <div style=\"padding: 10px 0; border-top: 1px solid #f2f2f2;\">\n                <span style=\"font-size: 13px; font-weight: 700; color: #333;\">" + this.escapeHTML(comment_2.author || "评论用户") + "</span>\n                <span style=\"font-size: 13px; color: #333; line-height: 1.5;\">：" + this.renderFriendPhoneLocalized(comment_2, "text", {
        id: "comment-text"
      }) + "</span>\n            </div>\n        ").join("") : "<div style=\"padding: 12px 0; color: #999; font-size: 13px;\">暂无评论</div>",
      value_676 = value_671.images && value_671.images.length ? "\n            <div style=\"display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; margin: 14px 0;\">\n                " + value_671.images.map((value_679, value_680) => "<div class=\"friend-weibo-detail-image\" data-index=\"" + value_680 + "\" style=\"aspect-ratio: 1; border-radius: 8px; overflow: hidden; background: #f2f2f2; cursor: pointer;\"><img src=\"" + this.escapeHTML(value_679.url) + "\" style=\"width: 100%; height: 100%; object-fit: cover;\"></div>").join("") + "\n            </div>\n        " : "",
      content_3 = "\n            <div style=\"display: flex; align-items: center; gap: 10px; margin-bottom: 14px;\">\n                " + this.renderWeiboAvatarHtml(accountData_3.avatarUrl, 44) + "\n                <div style=\"min-width: 0;\">\n                    <div style=\"font-size: 16px; font-weight: 800; color: #111;\">" + escapeHTML_672 + "</div>\n                    <div style=\"font-size: 12px; color: #999;\">" + this.escapeHTML(this.formatFriendPhoneGeneratedAt(post_5.generatedAt) || post_5.time || "") + " " + this.escapeHTML(post_5.source || "来自 iPhone") + "</div>\n                </div>\n            </div>\n            <div style=\"font-size: 16px; color: #222; line-height: 1.65; word-break: break-word;\">" + safeText_2 + "</div>\n            " + value_676 + "\n            <div style=\"display: flex; justify-content: space-around; color: #777; font-size: 13px; padding: 12px 0; border-top: 1px solid #f2f2f2; border-bottom: 1px solid #f2f2f2; margin-top: 14px;\">\n                <span><i class=\"far fa-comment-dots\"></i> " + items_674.length + "</span>\n                <span><i class=\"fas fa-retweet\"></i> " + this.escapeHTML(post_5.reposts ?? 0) + "</span>\n                <span style=\"" + (post_5.likedByMe ? "color: #ff8200;" : "") + "\"><i class=\"" + (post_5.likedByMe ? "fas" : "far") + " fa-heart\"></i> " + this.escapeHTML(post_5.likes ?? 0) + "</span>\n            </div>\n            <div style=\"font-size: 14px; font-weight: 800; margin: 16px 0 4px; color: #111;\">评论</div>\n            " + value_675 + "\n        ";
    this.showDetailModal("微博详情", content_3);
    setTimeout(() => {
      document.querySelectorAll("#loves-detail-modal .friend-weibo-detail-image").forEach(value_681 => {
        value_681.addEventListener("click", () => {
          const number_682 = Number(value_681.getAttribute("data-index") || 0),
            image_2 = value_671.images?.[number_682];
          if (image_2) this.showWeiboImageDetail(image_2);
        });
      });
    }, 30);
  },
  showWeiboImageDetail: function (item_14) {
    const safeUrl = this.escapeHTML(item_14.url || ""),
      safeDesc = this.escapeHTML(item_14.description || "").replace(/\n/g, "<br>"),
      content_4 = "\n            <div style=\"width: 100%; aspect-ratio: 1; border-radius: 14px; overflow: hidden; background: #f2f2f2; margin-bottom: 14px;\">\n                " + (safeUrl ? "<img src=\"" + safeUrl + "\" style=\"width: 100%; height: 100%; object-fit: cover;\">" : "<div style=\"height: 100%; display: flex; align-items: center; justify-content: center; color: #999;\"><i class=\"far fa-image\" style=\"font-size: 40px;\"></i></div>") + "\n            </div>\n            <div style=\"font-size: 15px; color: #222; line-height: 1.6; word-break: break-word;\">" + (safeDesc || "暂无描述") + "</div>\n        ";
    this.showDetailModal("相册详情", content_4);
  },
  renderFriendWeibo: function (friend_26) {
    const weiboView = document.getElementById("friend-weibo-view");
    if (!weiboView) return;
    const hasGeneratedWeiboData = !!(friend_26?.weiboData && typeof friend_26.weiboData === "object"),
      allData = this.getFriendWeiboData(friend_26);
    if (this.currentWeiboAccount === "alt" && !allData.altAccount) this.currentWeiboAccount = "main";
    const accountKey = this.currentWeiboAccount === "alt" ? "altAccount" : "mainAccount",
      accountData = allData[accountKey] || allData.mainAccount,
      profileName = document.getElementById("friend-weibo-profile-name"),
      signatureEl = document.getElementById("friend-weibo-profile-signature"),
      postCountEl = document.getElementById("friend-weibo-post-count"),
      switchBtn = document.getElementById("friend-weibo-switch-account-btn"),
      coverEl = document.getElementById("friend-weibo-cover");
    if (profileName) profileName.textContent = accountData.name || "微博用户";
    if (signatureEl) signatureEl.textContent = accountData.signature || "";
    if (postCountEl) postCountEl.textContent = String((accountData.posts || []).length);
    if (switchBtn) switchBtn.textContent = this.currentWeiboAccount === "alt" ? "切换大号" : "切换账号";
    if (coverEl) {
      const coverUrl = hasGeneratedWeiboData ? this.getWeiboRandomCover(friend_26, this.currentWeiboAccount) : "";
      coverEl.style.backgroundImage = coverUrl ? "linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.34)), url(\"" + coverUrl + "\")" : "none";
      coverEl.style.backgroundSize = "cover";
      coverEl.style.backgroundPosition = "center";
      coverEl.style.backgroundColor = coverUrl ? "" : "#f2f2f2";
    }
    weiboView.querySelectorAll(".friend-weibo-avatar-img").forEach(element_692 => {
      accountData.avatarUrl ? (element_692.src = accountData.avatarUrl, element_692.style.display = "block") : (element_692.removeAttribute("src"), element_692.style.display = "none");
    });
    weiboView.querySelectorAll(".friend-weibo-avatar-icon").forEach(icon_2 => {
      icon_2.style.display = accountData.avatarUrl ? "none" : "inline-block";
    });
    const homeList = document.getElementById("friend-weibo-home-list"),
      albumGrid = document.getElementById("friend-weibo-album-grid"),
      likedList = document.getElementById("friend-weibo-liked-list"),
      albumImages = accountData.album || [];
    if (homeList) {
      const posts_4 = accountData.posts || [];
      homeList.innerHTML = posts_4.length ? posts_4.map((post_6, index_8) => {
        const previewImages = index_8 === 0 ? albumImages.slice(0, 3) : [];
        return this.renderWeiboPostCard(post_6, accountData, {
          type: "home",
          index: index_8,
          images: previewImages
        });
      }).join("") : "<div style=\"padding: 38px 16px; text-align: center; color: #999; font-size: 14px;\">暂无微博<br><span style=\"font-size: 12px; display: inline-block; margin-top: 6px;\">请在设置中生成</span></div>";
      homeList.querySelectorAll(".friend-weibo-post-card").forEach(card => {
        card.addEventListener("click", () => {
          const index_9 = Number(card.getAttribute("data-index") || 0);
          this.showWeiboPostDetail(posts_4[index_9], accountData, {
            images: index_9 === 0 ? albumImages.slice(0, 3) : []
          });
        });
      });
    }
    albumGrid && (albumGrid.innerHTML = albumImages.length ? albumImages.map((value_699, value_700) => "\n                <div class=\"friend-weibo-album-item\" data-index=\"" + value_700 + "\" style=\"aspect-ratio: 1; border-radius: 6px; overflow: hidden; background: #f2f2f2; cursor: pointer; position: relative;\">\n                    <img src=\"" + this.escapeHTML(value_699.url) + "\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                </div>\n            ").join("") : "<div style=\"grid-column: span 3; padding: 38px 0; text-align: center; color: #999; font-size: 14px;\">暂无相册</div>", albumGrid.querySelectorAll(".friend-weibo-album-item").forEach(itemEl => {
      itemEl.addEventListener("click", () => {
        const index_10 = Number(itemEl.getAttribute("data-index") || 0);
        this.showWeiboImageDetail(albumImages[index_10]);
      });
    }));
    if (likedList) {
      const likedPosts = accountData.liked || [];
      likedList.innerHTML = likedPosts.length ? likedPosts.map((post_7, index_11) => {
        return this.renderWeiboPostCard(post_7, accountData, {
          type: "liked",
          index: index_11,
          likedLabel: true,
          authorName: post_7.author || "微博用户"
        });
      }).join("") : "<div style=\"padding: 38px 16px; text-align: center; color: #999; font-size: 14px;\">暂无赞过</div>";
      likedList.querySelectorAll(".friend-weibo-post-card").forEach(card_2 => {
        card_2.addEventListener("click", () => {
          const index_12 = Number(card_2.getAttribute("data-index") || 0);
          this.showWeiboPostDetail(likedPosts[index_12], accountData, {
            authorName: likedPosts[index_12]?.author || "微博用户"
          });
        });
      });
    }
  },
  enterLovesSpace: function (value_706) {
    const result_707 = this.getTopFriends().find(value_709 => String(value_709.id) === String(value_706?.id));
    if (!result_707) return;
    value_706 = result_707;
    const spaceView = document.getElementById("lovers-space-view");
    if (spaceView) {
      document.getElementById("lovers-anniversary-view")?.setAttribute("hidden", "");
      this.closeAnniversaryEditor();
      if (window.openView) window.openView(spaceView);
      this.currentFriend = value_706;
      this.rememberChar(value_706);
      this.renderRelationshipState(value_706);
      spaceView.querySelector(".lovers-space-scrollable")?.scrollTo?.({
        top: 0,
        behavior: "instant"
      });
      const loversSpaceUserAvatarElement = document.getElementById("lovers-space-user-avatar"),
        myAvatarIcon = document.getElementById("lovers-space-user-icon");
      let src_2 = window.userState?.avatarUrl || window.imData?.profile?.avatarUrl;
      if (!src_2) {
        const domAvatar = document.getElementById("edit-avatar-img") || document.getElementById("custom-avatar-img-desktop");
        domAvatar && domAvatar.src && !domAvatar.src.endsWith("html") && domAvatar.style.display !== "none" && (src_2 = domAvatar.src);
      }
      if (src_2) {
        loversSpaceUserAvatarElement && (loversSpaceUserAvatarElement.src = src_2, loversSpaceUserAvatarElement.style.display = "block");
        if (myAvatarIcon) myAvatarIcon.style.display = "none";
      } else {
        if (loversSpaceUserAvatarElement) loversSpaceUserAvatarElement.style.display = "none";
        if (myAvatarIcon) myAvatarIcon.style.display = "block";
      }
      const friendAvatarImg = document.getElementById("lovers-space-friend-avatar"),
        friendAvatarIcon = document.getElementById("lovers-space-friend-icon");
      if (value_706.avatarUrl) {
        friendAvatarImg && (friendAvatarImg.src = value_706.avatarUrl, friendAvatarImg.style.display = "block");
        if (friendAvatarIcon) friendAvatarIcon.style.display = "none";
      } else {
        if (friendAvatarImg) friendAvatarImg.style.display = "none";
        if (friendAvatarIcon) friendAvatarIcon.style.display = "block";
      }
      if (!value_706.hasLovesSpace) return;
      const value_711 = value_706.nickname || value_706.realname || "TA",
        escapeHTML_712 = this.escapeHTML(value_711),
        devicesList = document.getElementById("lovers-devices-list");
      if (devicesList) {
        devicesList.innerHTML = "\n                    <button type=\"button\" id=\"friend-computer-device-item\" class=\"lovers-shared-tile\" aria-label=\"打开" + escapeHTML_712 + "的电脑\">\n                        <span class=\"lovers-shared-tile-icon\"><i class=\"fas fa-laptop\" aria-hidden=\"true\"></i></span>\n                        <strong>" + escapeHTML_712 + " 的电脑</strong>\n                    </button>\n                    <button type=\"button\" id=\"lovers-shared-savings-btn\" class=\"lovers-shared-tile\" aria-label=\"打开存钱罐\">\n                        <span class=\"lovers-shared-tile-icon\"><i class=\"fas fa-piggy-bank\" aria-hidden=\"true\"></i></span>\n                        <strong>存钱罐</strong>\n                    </button>\n                    <button type=\"button\" id=\"lovers-shared-anniversary-btn\" class=\"lovers-shared-tile\" aria-label=\"打开纪念日\">\n                        <span class=\"lovers-shared-tile-icon\"><i class=\"far fa-calendar-alt\" aria-hidden=\"true\"></i></span>\n                        <strong>纪念日</strong>\n                    </button>\n                ";
        const friendComputerItem = document.getElementById("friend-computer-device-item");
        friendComputerItem && friendComputerItem.addEventListener("click", () => this.openFriendComputer(value_706));
        document.getElementById("lovers-shared-anniversary-btn")?.addEventListener("click", () => this.openAnniversaryView());
      }
      this.bindSharedSavingsButton(value_706);
      this.updateDaysCount(value_706);
      void this.syncDailySavingsForFriend(value_706).then(value_715 => {
        value_715 && document.getElementById("lovers-savings-view")?.classList.contains("active") && this.renderSavingsJar();
      });
      this.bindFabClick();
      this.renderLovesMoments();
      const tabs_2 = spaceView.querySelectorAll(".lovers-space-tab"),
        indicator = document.getElementById("lovers-space-tab-indicator"),
        panels = spaceView.querySelectorAll(".lovers-space-panel"),
        tabsContainer = spaceView.querySelector(".lovers-space-tabs-container");
      tabsContainer && !tabsContainer.dataset.bound && (tabsContainer.dataset.bound = "true", tabs_2.forEach(value_716 => {
        value_716.addEventListener("click", event_717 => {
          tabs_2.forEach(t => {
            t.classList.remove("active");
            t.setAttribute("aria-selected", "false");
          });
          panels.forEach(p => {
            p.classList.remove("active");
          });
          const target_3 = event_717.currentTarget;
          target_3.classList.add("active");
          target_3.setAttribute("aria-selected", "true");
          const offsetLeft_719 = target_3.offsetLeft,
            offsetWidth_720 = target_3.offsetWidth;
          indicator && (indicator.style.left = offsetLeft_719 + (offsetWidth_720 - 30) / 2 + "px");
          const tabName = target_3.getAttribute("data-tab"),
            panel = document.getElementById("lovers-panel-" + tabName);
          panel && panel.classList.add("active");
          document.getElementById("lovers-space-fab")?.toggleAttribute("hidden", tabName !== "moments");
          spaceView.querySelector(".lovers-space-scrollable")?.scrollTo?.({
            top: 0,
            behavior: "instant"
          });
        });
      }));
      tabs_2.length > 0 && indicator && setTimeout(() => {
        const value_723 = tabs_2[0],
          offsetLeft_724 = value_723.offsetLeft,
          offsetWidth_725 = value_723.offsetWidth;
        indicator.style.left = offsetLeft_724 + (offsetWidth_725 - 30) / 2 + "px";
      }, 10);
    }
  },
  openFriendComputer: function (currentFriend_4) {
    const view_2 = document.getElementById("lovers-friend-computer-view");
    if (!view_2) return;
    this.currentFriend = currentFriend_4;
    const value_728 = currentFriend_4.nickname || currentFriend_4.realname || currentFriend_4.realName || currentFriend_4.name || "TA",
      owner = document.getElementById("friend-mac-owner-name");
    if (owner) owner.textContent = value_728 + " 的 Mac";
    const desktop = document.getElementById("friend-mac-desktop");
    desktop && (desktop.classList.toggle("has-custom-background", !!currentFriend_4.computerBg), desktop.style.backgroundImage = currentFriend_4.computerBg ? "url(\"" + String(currentFriend_4.computerBg).replace(/"/g, "%22") + "\")" : "");
    if (window.openView) window.openView(view_2);
    const back = document.getElementById("friend-computer-back-btn");
    if (back) back.onclick = () => {
      this.closeFriendComputerApp();
      if (window.closeView) window.closeView(view_2);
    };
    const close_2 = document.getElementById("friend-mac-window-close");
    if (close_2) close_2.onclick = () => this.closeFriendComputerApp();
    view_2.querySelectorAll(".friend-mac-dock [data-computer-app]").forEach(button_2 => {
      button_2.onclick = () => {
        if (this.currentComputerApp === button_2.dataset.computerApp && !document.getElementById("friend-mac-window")?.hidden) {
          this.closeFriendComputerApp();
          return;
        }
        this.openFriendComputerApp(button_2.dataset.computerApp);
      };
    });
  },
  closeFriendComputerApp: function () {
    const win = document.getElementById("friend-mac-window");
    if (win) win.hidden = true;
    document.getElementById("lovers-friend-computer-view")?.classList.remove("app-open");
    this.currentComputerApp = null;
    document.querySelectorAll(".friend-mac-dock [data-computer-app]").forEach(button_3 => button_3.classList.remove("active"));
  },
  openFriendComputerApp: function (app_2) {
    const titles = {
        resume: "简历",
        mail: "邮件",
        calendar: "日历",
        notes: "备忘录",
        files: "文件",
        settings: "系统设置"
      },
      win_2 = document.getElementById("friend-mac-window"),
      title_2 = document.getElementById("friend-mac-window-title"),
      content_5 = document.getElementById("friend-mac-window-content");
    if (!win_2 || !content_5 || !titles[app_2]) return;
    const data = this.normalizeFriendComputerData(this.currentFriend?.computerData, this.currentFriend);
    win_2.hidden = false;
    document.getElementById("lovers-friend-computer-view")?.classList.add("app-open");
    this.currentComputerApp = app_2;
    if (title_2) title_2.textContent = titles[app_2];
    document.querySelectorAll(".friend-mac-dock [data-computer-app]").forEach(button_4 => button_4.classList.toggle("active", button_4.dataset.computerApp === app_2));
    const renderers = {
      resume: () => this.renderFriendComputerResume(data.resume),
      mail: () => this.renderFriendComputerCollection("mail", data.mail),
      calendar: () => this.renderFriendComputerCollection("calendar", data.calendar),
      notes: () => this.renderFriendComputerCollection("notes", data.notes),
      files: () => this.renderFriendComputerCollection("files", data.files),
      settings: () => this.renderFriendComputerSettings()
    };
    content_5.innerHTML = renderers[app_2]();
    this.bindFriendComputerContent(app_2);
  },
  renderFriendComputerResume: function (resume_3) {
    const e_6 = value_740 => this.escapeHTML(String(value_740 || ""));
    if (!resume_3.title && !resume_3.summary && resume_3.experience.length === 0) return "<div class=\"friend-mac-empty\"><i class=\"fas fa-id-card\"></i><strong>还没有简历</strong><p>在系统设置中生成符合 Char 人设的职业资料。</p></div>";
    const value_737 = (value_741, items_742, value_743) => items_742.length ? "<section><h3>" + value_741 + "</h3>" + items_742.map(value_743).join("") + "</section>" : "",
      value_738 = resume_3.avatarUrl ? "<img src=\"" + e_6(resume_3.avatarUrl) + "\" alt=\"\">" : "<i class=\"fas fa-user\"></i>",
      personalInfo = [["真实姓名", resume_3.realName], ["性别", resume_3.gender], ["年龄", resume_3.age], ["出生日期", resume_3.birthday], ["身高", resume_3.height], ["体重", resume_3.weight], ["民族", resume_3.ethnicity], ["国籍", resume_3.nationality]].filter(([, value_50]) => value_50);
    return "<article class=\"friend-mac-resume\">\n            <header><div class=\"friend-mac-resume-avatar\">" + value_738 + "</div><div><h1>" + e_6(resume_3.name) + "</h1><h2>" + e_6(resume_3.title) + "</h2><p>" + [resume_3.email, resume_3.phone, resume_3.location].filter(Boolean).map(e_6).join(" · ") + "</p></div></header>\n            " + (personalInfo.length ? "<section><h3>个人信息</h3><div class=\"friend-mac-personal-grid\">" + personalInfo.map(([value_745, value_746]) => "<div><span>" + value_745 + "</span><strong>" + e_6(value_746) + "</strong></div>").join("") + "</div></section>" : "") + "\n            " + (resume_3.summary ? "<section><h3>个人简介</h3><p>" + e_6(resume_3.summary) + "</p></section>" : "") + "\n            " + value_737("专业技能", resume_3.skills, value_747 => "<span class=\"friend-mac-skill\">" + e_6(typeof value_747 === "string" ? value_747 : value_747.name) + "</span>") + "\n            " + value_737("工作经历", resume_3.experience, message_748 => "<div class=\"friend-mac-resume-item\"><b>" + e_6(message_748.role || message_748.title) + "</b><time>" + e_6(message_748.period) + "</time><strong>" + e_6(message_748.company) + "</strong><p>" + e_6(message_748.description) + "</p></div>") + "\n            " + value_737("项目经历", resume_3.projects, value_749 => "<div class=\"friend-mac-resume-item\"><b>" + e_6(value_749.name) + "</b><time>" + e_6(value_749.period) + "</time><p>" + e_6(value_749.description) + "</p></div>") + "\n            " + value_737("教育经历", resume_3.education, value_750 => "<div class=\"friend-mac-resume-item\"><b>" + e_6(value_750.school) + "</b><time>" + e_6(value_750.period) + "</time><p>" + e_6(value_750.degree || value_750.major) + "</p></div>") + "\n            " + value_737("证书", resume_3.certificates, value_751 => "<span class=\"friend-mac-line-item\">" + e_6(typeof value_751 === "string" ? value_751 : value_751.name) + "</span>") + "\n            " + value_737("语言", resume_3.languages, value_752 => "<span class=\"friend-mac-line-item\">" + e_6(typeof value_752 === "string" ? value_752 : value_752.name + " · " + (value_752.level || "")) + "</span>") + "\n        </article>";
  },
  renderFriendComputerCollection: function (value_753, items_754) {
    const e_7 = value_757 => this.escapeHTML(String(value_757 || ""));
    if (!items_754.length) return "<div class=\"friend-mac-empty\"><i class=\"fas fa-" + (value_753 === "mail" ? "envelope" : value_753 === "calendar" ? "calendar-alt" : value_753 === "notes" ? "sticky-note" : "folder") + "\"></i><strong>暂无内容</strong><p>在系统设置中生成这项工作数据。</p></div>";
    const labels = {
      mail: "收件箱",
      calendar: "工作日程",
      notes: "全部备忘录",
      files: "工作文件"
    };
    return "<div class=\"friend-mac-split\"><aside><h2>" + labels[value_753] + "</h2>" + items_754.map((item_15, value_759) => "<button type=\"button\" class=\"friend-mac-list-item" + (value_759 === 0 ? " active" : "") + "\" data-computer-item=\"" + value_759 + "\"><b>" + e_7(item_15.subject || item_15.title || item_15.name) + "</b><span>" + e_7(item_15.sender || item_15.date || item_15.modifiedAt || item_15.time) + "</span><small>" + e_7(item_15.preview || item_15.folder || item_15.type || item_15.location) + "</small></button>").join("") + "</aside><article id=\"friend-mac-detail\"></article></div>";
  },
  bindFriendComputerContent: function (app_3) {
    if (app_3 === "settings") {
      const button_5 = document.getElementById("friend-computer-generate-btn");
      if (button_5) button_5.onclick = () => this.generateFriendComputerData(button_5);
      const urlButton = document.getElementById("friend-computer-bg-url-apply");
      if (urlButton) urlButton.onclick = () => this.applyFriendComputerBackgroundUrl();
      const upload = document.getElementById("friend-computer-bg-upload");
      if (upload) upload.onchange = event_4 => this.uploadFriendComputerBackground(event_4);
      const reset = document.getElementById("friend-computer-bg-reset");
      if (reset) reset.onclick = () => this.saveFriendComputerBackground("");
      const realTimeToggle = document.getElementById("friend-computer-real-time-toggle");
      if (realTimeToggle) realTimeToggle.onchange = () => {
        this.currentFriend.computerIncludeRealTime = realTimeToggle.checked;
        this.persistFriendState(this.currentFriend, {
          silent: true
        });
      };
      return;
    }
    if (!["mail", "calendar", "notes", "files"].includes(app_3)) return;
    const data_3 = this.normalizeFriendComputerData(this.currentFriend?.computerData, this.currentFriend)[app_3],
      detail = document.getElementById("friend-mac-detail"),
      renderDetail = value_763 => {
        const item_16 = data_3[value_763] || {},
          e_8 = value_766 => this.escapeHTML(String(value_766 || ""));
        if (detail) detail.innerHTML = "<span class=\"friend-mac-detail-meta\">" + e_8(item_16.sender || item_16.date || item_16.modifiedAt || item_16.time || item_16.type) + "</span><h1>" + e_8(item_16.subject || item_16.title || item_16.name) + "</h1>" + (item_16.location ? "<h3><i class=\"fas fa-map-marker-alt\"></i> " + e_8(item_16.location) + "</h3>" : "") + "<div class=\"friend-mac-detail-body\">" + e_8(item_16.body || item_16.content || item_16.description || item_16.preview).replace(/\n/g, "<br>") + "</div>";
      };
    document.querySelectorAll(".friend-mac-list-item").forEach(button_6 => button_6.onclick = () => {
      document.querySelectorAll(".friend-mac-list-item").forEach(item_17 => item_17.classList.remove("active"));
      button_6.classList.add("active");
      renderDetail(Number(button_6.dataset.computerItem));
    });
    renderDetail(0);
  },
  renderFriendComputerSettings: function () {
    const counts_2 = this.getFriendComputerGenCounts(this.currentFriend),
      selected = Array.isArray(this.currentFriend?.computerGenApps) ? this.currentFriend.computerGenApps : ["resume", "mail", "calendar", "notes", "files"],
      rows = [["resume", "简历", "id-card", null], ["mail", "邮件", "envelope", counts_2.mail], ["calendar", "日历", "calendar-alt", counts_2.calendar], ["notes", "备忘录", "sticky-note", counts_2.notes], ["files", "文件", "folder", counts_2.files]];
    return "<div class=\"friend-mac-settings\"><header><span>APPEARANCE</span><h1>桌面与数据</h1><p>管理这台 Mac 的桌面背景和工作内容。</p></header>\n            <section class=\"friend-mac-wallpaper-settings\"><h2>桌面背景</h2><div class=\"friend-mac-wallpaper-row\"><input type=\"url\" id=\"friend-computer-bg-url\" placeholder=\"粘贴图片 URL\" value=\"" + this.escapeHTML(this.currentFriend?.computerBg?.startsWith("http") ? this.currentFriend.computerBg : "") + "\"><button type=\"button\" id=\"friend-computer-bg-url-apply\">应用</button></div><div class=\"friend-mac-wallpaper-actions\"><label><i class=\"fas fa-arrow-up-from-bracket\"></i><span>上传图片</span><input type=\"file\" id=\"friend-computer-bg-upload\" accept=\"image/*\" hidden></label><button type=\"button\" id=\"friend-computer-bg-reset\"><i class=\"fas fa-rotate-left\"></i><span>恢复默认</span></button></div></section>\n            <div class=\"friend-mac-settings-heading\"><span>GENERATOR</span><h2>生成工作数据</h2><p>仅覆盖选中的应用。</p></div><label class=\"friend-real-time-option friend-mac-real-time\"><span><i class=\"fas fa-clock\"></i><strong>使用真实时间</strong><small>加入当前日期、星期与准确时间</small></span><input type=\"checkbox\" id=\"friend-computer-real-time-toggle\" " + (this.currentFriend?.computerIncludeRealTime !== false ? "checked" : "") + "></label><div class=\"friend-mac-settings-list\">" + rows.map(([value_771, value_772, value_773, value_774]) => "<label><input type=\"checkbox\" class=\"computer-gen-checkbox\" value=\"" + value_771 + "\" " + (selected.includes(value_771) ? "checked" : "") + "><i class=\"fas fa-" + value_773 + "\"></i><strong>" + value_772 + "</strong>" + (value_774 ? "<input type=\"number\" class=\"computer-gen-count\" data-count-key=\"" + value_771 + "\" min=\"1\" max=\"" + (value_771 === "mail" || value_771 === "files" ? 12 : 10) + "\" value=\"" + value_774 + "\">" : "<span>完整模板</span>") + "</label>").join("") + "</div><button type=\"button\" id=\"friend-computer-generate-btn\" class=\"friend-mac-generate\"><i class=\"fas fa-wand-magic-sparkles\"></i><span>生成选中的应用数据</span></button><small class=\"friend-mac-generated-at\">" + (this.currentFriend?.computerData?.generatedAt ? "上次生成：" + this.escapeHTML(this.currentFriend.computerData.generatedAt) : "尚未生成电脑数据") + "</small></div>";
  },
  applyFriendComputerBackgroundUrl: function () {
    const input_3 = document.getElementById("friend-computer-bg-url"),
      value_56 = input_3?.value.trim() || "";
    if (!value_56) return window.showToast?.("请输入图片 URL");
    try {
      const parsed_6 = new URL(value_56);
      if (!["http:", "https:"].includes(parsed_6.protocol)) throw new Error("unsupported");
      this.saveFriendComputerBackground(parsed_6.href);
    } catch (value_777) {
      window.showToast?.("请输入有效的 http 或 https 图片 URL");
    }
  },
  uploadFriendComputerBackground: function (event_5) {
    const file_2 = event_5?.target?.files?.[0];
    if (!file_2) return;
    if (!file_2.type.startsWith("image/")) return window.showToast?.("请选择图片文件");
    const reader = new FileReader();
    reader.onload = () => this.saveFriendComputerBackground(String(reader.result || ""));
    reader.onerror = () => window.showToast?.("图片读取失败");
    reader.readAsDataURL(file_2);
  },
  saveFriendComputerBackground: async function (computerBg_2) {
    if (!this.currentFriend) return;
    this.currentFriend.computerBg = computerBg_2;
    const desktop_2 = document.getElementById("friend-mac-desktop");
    desktop_2 && (desktop_2.classList.toggle("has-custom-background", !!computerBg_2), desktop_2.style.backgroundImage = computerBg_2 ? "url(\"" + String(computerBg_2).replace(/"/g, "%22") + "\")" : "");
    await this.persistFriendState(this.currentFriend);
    window.showToast?.(computerBg_2 ? "桌面背景已更新" : "已恢复默认背景");
    this.openFriendComputerApp("settings");
  },
  generateFriendComputerData: async function (button_7) {
    const friend_27 = this.currentFriend;
    if (!friend_27 || button_7.disabled) return;
    const selected_2 = Array.from(document.querySelectorAll(".computer-gen-checkbox:checked")).map(input_4 => input_4.value);
    if (!selected_2.length) return window.showToast?.("请至少选择一个应用");
    if (!window.apiConfig?.endpoint || !window.apiConfig?.apiKey) return window.showToast?.("请先在系统设置中配置 API");
    const computerGenCounts_2 = this.getFriendComputerGenCounts({
      computerGenCounts: Object.fromEntries(Array.from(document.querySelectorAll(".computer-gen-count")).map(input_5 => [input_5.dataset.countKey, input_5.value]))
    });
    friend_27.computerGenApps = selected_2;
    friend_27.computerGenCounts = computerGenCounts_2;
    const realTimeToggle_2 = document.getElementById("friend-computer-real-time-toggle");
    friend_27.computerIncludeRealTime = realTimeToggle_2 ? realTimeToggle_2.checked : friend_27.computerIncludeRealTime !== false;
    await this.persistFriendState(friend_27, {
      silent: true
    });
    let globalRule = "";
    if (window.getGlobalWorldBookContextByPosition) globalRule = [window.getGlobalWorldBookContextByPosition("system_depth"), window.getGlobalWorldBookContextByPosition("before_role")].filter(Boolean).join("\n");
    const join_787 = this.getRecentSingleChatRounds(friend_27.messages, 20).map(value_794 => (value_794.sender === "me" ? "User" : "Char") + ": " + (value_794.text || "[特殊消息]")).join("\n"),
      requirements = {
        resume: "resume：完整职业简历，包含 realName、gender、age、birthday、height、weight、ethnicity、nationality、title、email、phone、location、summary、skills、experience、education、projects、certificates、languages。age 为带“岁”的年龄，身高体重须带单位，经历字段使用 role/company/period/description，教育使用 school/degree/major/period，项目使用 name/period/description。",
        mail: "mail：严格 " + computerGenCounts_2.mail + " 封工作邮件，每项包含 subject、sender、time、preview、body。",
        calendar: "calendar：严格 " + computerGenCounts_2.calendar + " 条工作日程，每项包含 title、date、time、location、description。",
        notes: "notes：严格 " + computerGenCounts_2.notes + " 条工作备忘录，每项包含 title、modifiedAt、preview、content。",
        files: "files：严格 " + computerGenCounts_2.files + " 个工作文件，每项包含 name、folder、type、modifiedAt、content。"
      },
      value_789 = friend_27.computerIncludeRealTime !== false ? "\n【当前真实时间】" + this.getCurrentRealTimeContext() : "",
      content_6 = "为 Char 的私人电脑生成真实、克制、符合职业与人设的工作数据。只能输出合法 JSON，不要 Markdown。" + value_789 + "\n【Char 人设】" + (friend_27.persona || "普通角色") + "\n【User 人设】" + (window.userState?.persona || "普通用户") + "\n【世界书】" + globalRule + "\n【近期聊天】" + join_787 + "\n【选中字段】\n" + selected_2.map(key_9 => requirements[key_9]).join("\n") + "\n只返回一个对象，且只能包含这些顶层字段：" + selected_2.join("、") + "。内容避免模板化和重复，所有文本使用中文或符合角色背景的自然语言。",
      chatCompletionsEndpoint_791 = window.u2Api.resolveChatCompletionsEndpoint(window.apiConfig.endpoint);
    button_7.disabled = true;
    button_7.innerHTML = "<i class=\"fas fa-spinner fa-spin\"></i><span>正在生成...</span>";
    window.showToast?.("正在生成电脑数据，请稍候...");
    try {
      const response_3 = await fetch(chatCompletionsEndpoint_791, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.apiConfig.apiKey
        },
        body: JSON.stringify({
          model: window.apiConfig.model || "gpt-3.5-turbo",
          messages: [{
            role: "system",
            content: "你是数据生成助手，只返回合法 JSON。"
          }, {
            role: "user",
            content: content_6
          }],
          temperature: 0.7
        })
      });
      if (!response_3.ok) {
        const value_801 = await window.u2Api?.readApiError?.(response_3);
        throw window.u2Api?.createHttpError?.(response_3, value_801) || Object.assign(new Error("HTTP " + response_3.status), {
          status: response_3.status
        });
      }
      const payload_3 = await response_3.json(),
        text_9 = payload_3.choices?.[0]?.message?.content || "",
        match_4 = text_9.match(/\{[\s\S]*\}/),
        parsed_7 = JSON.parse(match_4 ? match_4[0] : text_9.replace(/```json|```/gi, "").trim()),
        merged = {
          ...(friend_27.computerData || {})
        };
      selected_2.forEach(key_10 => {
        if (Object.prototype.hasOwnProperty.call(parsed_7, key_10)) merged[key_10] = parsed_7[key_10];
      });
      merged.generatedAt = new Date().toLocaleString("zh-CN", {
        hour12: false
      });
      friend_27.computerData = this.normalizeFriendComputerData(merged, friend_27);
      friend_27.computerData.generatedAt = merged.generatedAt;
      await this.persistFriendState(friend_27);
      window.showToast?.("电脑数据生成成功");
      this.openFriendComputerApp("settings");
    } catch (error_3) {
      console.error("Friend computer generation failed:", error_3);
      if (!window.u2Api?.isRequestError?.(error_3) || !window.u2Api.reportError(error_3, {
        operation: "电脑数据生成"
      })) window.showToast?.("生成失败：" + String(error_3.message || "未知错误").slice(0, 50));
      button_7.disabled = false;
      button_7.innerHTML = "<i class=\"fas fa-wand-magic-sparkles\"></i><span>生成选中的应用数据</span>";
    }
  },
  openFriendPhone: function (friend_28) {
    const loversFriendPhoneViewElement = document.getElementById("lovers-friend-phone-view");
    if (!loversFriendPhoneViewElement || friend_28?.type !== "char") return;
    String(this.currentFriend?.id || "") !== String(friend_28?.id || "") && (this._healthHistoryIndex = 0, this._payHistoryIndex = 0);
    this.currentFriend = friend_28;
    loversFriendPhoneViewElement.style.backgroundImage = "none";
    this.bindFriendPhoneTranslationDelegation(loversFriendPhoneViewElement);
    if (window.openView) window.openView(loversFriendPhoneViewElement);
    const backBtn_3 = document.getElementById("friend-phone-back-btn");
    backBtn_3 && (backBtn_3.onclick = () => {
      if (window.closeView) window.closeView(loversFriendPhoneViewElement);
    });
    const settingsSheet = document.getElementById("friend-phone-settings-sheet"),
      settingsBtn = document.getElementById("friend-phone-app-settings");
    settingsBtn && settingsSheet && (settingsBtn.onclick = () => window.openView(settingsSheet));
    const settingsBackBtn = document.getElementById("friend-settings-back-btn");
    settingsBackBtn && settingsSheet && (settingsBackBtn.onclick = () => {
      if (window.closeView) window.closeView(settingsSheet);
    });
    const getGenAppCheckboxes = () => Array.from(document.querySelectorAll(".gen-app-checkbox")),
      items_805 = ["music", "health", "pay", "game", "call", "safari", "weibo", "files"],
      genCountInputs = {
        musicTop: document.getElementById("friend-gen-music-top-count"),
        safariTotal: document.getElementById("friend-gen-safari-count"),
        gameTotal: document.getElementById("friend-gen-game-count"),
        callTotal: document.getElementById("friend-gen-call-count"),
        weiboPostsTotal: document.getElementById("friend-gen-weibo-post-count"),
        weiboPhotosTotal: document.getElementById("friend-gen-weibo-photo-count")
      },
      realTimeToggle_3 = document.getElementById("friend-phone-real-time-toggle"),
      chatContextToggle = document.getElementById("friend-phone-chat-context-toggle"),
      getSavedGenApps = () => {
        return Array.isArray(friend_28.phoneGenApps) ? friend_28.phoneGenApps.filter(value_810 => value_810 !== "imessage") : items_805;
      },
      applySavedGenApps = () => {
        const savedApps = getSavedGenApps();
        getGenAppCheckboxes().forEach(cb => {
          cb.checked = savedApps.includes(cb.value);
        });
      },
      saveGenApps = () => {
        friend_28.phoneGenApps = getGenAppCheckboxes().filter(cb_2 => cb_2.checked).map(cb_3 => cb_3.value);
        this.persistFriendState(friend_28, {
          silent: true
        });
      },
      syncGenRows = () => {
        getGenAppCheckboxes().forEach(cb_4 => {
          const row = cb_4.closest(".friend-gen-limit-row");
          if (!row) return;
          row.classList.toggle("is-disabled", !cb_4.checked);
          row.querySelectorAll("input[type=\"number\"]").forEach(input_6 => {
            input_6.disabled = !cb_4.checked;
          });
        });
      },
      applySavedGenCounts = () => {
        const counts = this.getFriendPhoneGenCounts(friend_28);
        Object.entries(genCountInputs).forEach(([key_11, input_7]) => {
          if (input_7) input_7.value = String(counts[key_11]);
        });
      },
      saveGenCounts = () => {
        const phoneGenCounts_2 = this.getFriendPhoneGenCounts({
          phoneGenCounts: Object.fromEntries(Object.entries(genCountInputs).map(([key_12, input_8]) => [key_12, input_8?.value]))
        });
        return friend_28.phoneGenCounts = phoneGenCounts_2, Object.entries(genCountInputs).forEach(([value_819, value_820]) => {
          if (value_820) value_820.value = String(phoneGenCounts_2[value_819]);
        }), this.persistFriendState(friend_28, {
          silent: true
        }), phoneGenCounts_2;
      };
    getGenAppCheckboxes().forEach(cb_5 => {
      cb_5.onchange = () => {
        syncGenRows();
        saveGenApps();
      };
    });
    Object.values(genCountInputs).forEach(input_9 => {
      if (input_9) input_9.onchange = () => saveGenCounts();
    });
    realTimeToggle_3 && (realTimeToggle_3.checked = friend_28.phoneIncludeRealTime !== false, realTimeToggle_3.onchange = () => {
      friend_28.phoneIncludeRealTime = realTimeToggle_3.checked;
      this.persistFriendState(friend_28, {
        silent: true
      });
    });
    chatContextToggle && (chatContextToggle.checked = friend_28.phoneIncludeChatContext !== false, chatContextToggle.onchange = () => {
      friend_28.phoneIncludeChatContext = chatContextToggle.checked;
      this.persistFriendState(friend_28, {
        silent: true
      });
    });
    applySavedGenApps();
    applySavedGenCounts();
    syncGenRows();
    const genConfirmBtn = document.getElementById("friend-phone-gen-confirm-btn");
    genConfirmBtn && (genConfirmBtn.onclick = async () => {
      saveGenApps();
      const genCounts = saveGenCounts(),
        selectedApps_2 = getSavedGenApps(),
        phoneIncludeRealTime_2 = realTimeToggle_3 ? realTimeToggle_3.checked : friend_28.phoneIncludeRealTime !== false,
        phoneIncludeChatContext_2 = chatContextToggle ? chatContextToggle.checked : friend_28.phoneIncludeChatContext !== false;
      friend_28.phoneIncludeRealTime = phoneIncludeRealTime_2;
      friend_28.phoneIncludeChatContext = phoneIncludeChatContext_2;
      const safariSplit = this.splitFriendGenTotal(genCounts.safariTotal),
        weiboPostSplit = this.splitFriendGenTotal(genCounts.weiboPostsTotal),
        weiboPhotoSplit = this.splitFriendGenTotal(genCounts.weiboPhotosTotal);
      if (selectedApps_2.length === 0) {
        if (window.showToast) window.showToast("请至少选择一个应用");
        return;
      }
      if (!window.apiConfig || !window.apiConfig.endpoint || !window.apiConfig.apiKey) {
        if (window.showToast) window.showToast("请先在系统设置中配置 API");
        return;
      }
      let text_829 = "";
      if (window.getGlobalWorldBookContextByPosition) {
        text_829 = window.getGlobalWorldBookContextByPosition("system_depth") || "";
        const globalWorldBookContextByPosition_842 = window.getGlobalWorldBookContextByPosition("before_role");
        if (globalWorldBookContextByPosition_842) text_829 += "\n" + globalWorldBookContextByPosition_842;
      }
      const value_830 = window.userState?.persona || "普通用户",
        value_831 = friend_28.persona || "普通角色";
      let text_832 = "";
      if (phoneIncludeChatContext_2) {
        const messageFriend = await this.ensureFriendPhoneMessagesLoaded(friend_28),
          msgs_2 = this.getRecentSingleChatMessages(messageFriend?.messages, 20);
        msgs_2.length > 0 && (text_832 = msgs_2.map(m_8 => {
          const sender_4 = this.isFriendPhoneUserMessage(m_8) ? "User" : "Char";
          return sender_4 + ": " + this.getFriendPhoneMessageText(m_8);
        }).join("\n"));
      }
      const phoneLanguage = this.normalizeFriendPhoneLanguage(friend_28.language || "zh"),
        friendPhoneLanguageName_834 = this.getFriendPhoneLanguageName(phoneLanguage);
      let content_7 = "你现在要模拟生成一部手机里不同应用的数据。请严格遵循给定的世界观设定、角色人设和聊天上下文，生成符合角色性格的JSON格式数据。\n";
      content_7 += "\n【最高优先级语言与翻译协议】\n- 所有 AI 创作的可读字符串原文必须只使用 Char 的默认语言：" + friendPhoneLanguageName_834 + " (" + phoneLanguage + ")。\n- 联系人例外：通话记录和通讯录的 name 必须直接使用自然的简体中文姓名，不得使用外文姓名，不需要额外翻译字段。\n- 音乐例外：music 内每首歌的 name 必须使用歌曲真实、正常的官方歌名，保留歌名本来的语言，不受 Char 默认语言限制，不返回 nameTranslationZh。\n- 游戏例外：game 中除 highlights[].desc、innerThoughts、postGameReflection（兼容 thoughts）外，其余字段均不受 Char 默认语言限制，也不需要任何 TranslationZh 字段；仅这四类叙事字段遵循 Char 默认语言并返回中文翻译。\n- 微博例外：weibo 只有帖子正文 text 和评论正文 comments[].text 遵循 Char 默认语言并返回 textTranslationZh；账号名、昵称、签名、作者名、来源、相册描述等其他字段不限制语言，也不返回翻译字段。\n- 文件例外：files 只有文件详情正文 items[].content 遵循 Char 默认语言并返回 contentTranslationZh；标签名与文件标题不限制语言，也不返回翻译字段。\n- 除以上例外，对每个可读字符串字段 field，都必须同时返回 fieldTranslationZh。原文非中文时，fieldTranslationZh 必须是自然准确的简体中文翻译；原文为中文时必须为空字符串。\n- sender、type、icon、数值、布尔值、URL、ID、银行卡号等机器字段不翻译。\n";
      content_7 += "\n【最高优先级时间协议】不要返回 time、date、createdAt、timestamp、addedTime、recentCallTime 等记录时间字段，也不要为应用记录编造时间戳；真实生成时间始终由前端写入。\n";
      if (phoneIncludeRealTime_2) content_7 += "\n【当前真实时间】" + this.getCurrentRealTimeContext() + "\n- 仅将它用于理解当前季节、昼夜、作息、近期事件与内容语境，让生成内容具有自然的时间感知；不要把它复制成 JSON 时间字段。\n";
      content_7 += "\n【覆盖规则】本次勾选应用的生成结果会完整覆盖该应用旧数据。请生成一套独立、完整的新内容，不要续写或依赖旧手机数据。\n";
      if (text_829) content_7 += "\n【世界书设定】：\n" + text_829 + "\n";
      content_7 += "\n【角色 (Char) 人设】：\n" + value_831 + "\n";
      content_7 += "\n【用户 (User) 人设】：\n" + value_830 + "\n";
      if (text_832) content_7 += "\n【固定挂载的最近 20 条单聊上下文】：\n" + text_832 + "\n";
      content_7 += "\n根据选择的应用返回对应的数据。\n";
      const options_836 = {
          safari: "[safari]: 严格生成 " + safariSplit.primary + " 条公开模式的日常搜索，以及 " + safariSplit.secondary + " 条无痕模式下符合其隐私、疑问或不愿公开心境的搜索内容，共 " + genCounts.safariTotal + " 条。搜索主题、关键词长度、网页来源和详情表达需要自然多样，不要把无痕内容机械等同于阴暗或猎奇。",
          files: "[files]: 生成符合角色人设的文件列表，其中 tags 内必须包含能够体现其性格、癖好、或对 User 的看法的隐私内容（如小说草稿、私密日记、账单等），需生成 2-3 个标签，每个标签 1-3 个新文件，确保文件名不要与历史已有的重复。标签名和文件标题不限制语言且不需要翻译；只有文件详情 content 按 Char 默认语言生成并提供中文翻译。",
          call: "[call]: 严格生成 " + genCounts.callTotal + " 条通话记录，并生成与记录中联系人对应的详细联系人信息。recentCalls 和 contacts 的 name 必须直接使用自然的简体中文姓名，不要返回外文联系人名；其余内容必须符合角色人设与交际圈。请避免使用不符合 JSON 标准的单引号。",
          music: "[music]: 听歌排行 top 严格生成 " + genCounts.musicTop + " 首，风格应极大程度体现其人设与心境；歌曲 name 必须使用真实、正常的官方歌名，保留原本语言，不要翻译歌名，也不要返回 nameTranslationZh。每首歌必须包含循环次数（纯数字）和不少于 20 字的细腻心声。recent 和 favorites 保持自然数量，不受排行榜数量限制。",
          health: "[health]: 严格符合其人设（如是否运动、熬夜、体型等）生成近期睡眠、步数、身高和体重；dream 写约 30 字的昨夜梦境；stepsThoughts 写约 30 字的跑步或运动时心理活动；heartRate 必须是符合当前状态的纯数字 BPM，heartRateStatus 是与该心率匹配的简短状态。",
          pay: "[pay]: 生成符合人设的银行卡总金额和近期不少于 5 条收支记录。",
          game: "[game]: 严格生成 " + genCounts.gameTotal + " 个符合人设的游戏。只有高光时刻 highlights[].desc、局内心声 innerThoughts、局后复盘 postGameReflection 受 Char 默认语言限制并需要中文翻译；游戏名、玩家名、段位、英雄、结果、时长等其余字段可使用其正常语言，不要返回翻译字段。每局必须包含结果、KDA(如8/2/5)、使用英雄、高光时刻(数组)、内心戏(30字)、复盘(30字)，不得包含时间。格式必须完全符合提供的JSON模板，不要使用特殊字符。",
          weibo: "[weibo]: 生成完整微博资料。只有帖子正文 text 和评论正文 comments[].text 按 Char 默认语言生成并提供中文翻译；账号名、昵称、签名、评论作者名、来源、相册描述等其他字段不限制语言且不需要翻译。大号严格生成 " + weiboPostSplit.primary + " 条主页帖子和 " + weiboPhotoSplit.primary + " 张相册照片；小号严格生成 " + weiboPostSplit.secondary + " 条主页帖子和 " + weiboPhotoSplit.secondary + " 张相册照片。每条主页帖子尽量生成 2-5 条自然评论；大号和小号的赞过列表各保持 3 条。大号像可被熟人看到的公开主页，小号则贴近隐藏身份，可以写关于 User 的情绪、珍视的记忆、关系思考或只有小号才敢保存的瞬间，但不要让所有内容围绕 User，也不要让小号只有负面情绪。所有帖子必须在主题、篇幅、语气、叙事视角和互动氛围上有真实差异，禁止套用固定开头、固定剧情、编号化文案、同义改写和重复句式；照片描述也要覆盖不同主体、场景、构图、光线和拍摄质感。小号头像 avatarUrl 可以留空，由系统随机补图。"
        },
        promptParts = {
          safari: "\"safari\": {\n  \"recentSearches\": [\n    {\"keyword\": \"搜索关键词1\", \"keywordTranslationZh\": \"中文翻译或空字符串\", \"title\": \"网页标题1\", \"titleTranslationZh\": \"中文翻译或空字符串\", \"content\": \"网页内容(如知乎,百度百科等真实浏览器内容50-100字)\", \"contentTranslationZh\": \"中文翻译或空字符串\"}\n  ],\n  \"privateSearches\": [\n    {\"keyword\": \"无痕搜索词1\", \"keywordTranslationZh\": \"中文翻译或空字符串\", \"title\": \"无痕网页标题1\", \"titleTranslationZh\": \"中文翻译或空字符串\", \"content\": \"隐私搜索详情内容(50-100字)\", \"contentTranslationZh\": \"中文翻译或空字符串\"}\n  ]\n}",
          files: "\"files\": {\n  \"tags\": [\n    {\"name\": \"新标签名称，不限制语言\", \"color\": \"#ff3b30\", \"items\": [{\"title\": \"新文件名，不限制语言\", \"content\": \"一段极度符合人设的私密内容(50-100字)\", \"contentTranslationZh\": \"中文翻译或空字符串\"}]}\n  ]\n}",
          call: "\"call\": {\n  \"recentCalls\": [\n    {\"name\": \"简体中文联系人名\", \"type\": \"incoming/outgoing/missed\", \"dialogue\": \"通话内容原文\", \"dialogueTranslationZh\": \"中文翻译或空字符串\"}\n  ],\n  \"contacts\": [\n    {\"name\": \"简体中文联系人名\", \"callReason\": \"通话原因原文\", \"callReasonTranslationZh\": \"中文翻译或空字符串\"}\n  ]\n}",
          music: "\"music\": {\n  \"recent\": [{\"name\": \"歌曲真实官方歌名（保留原本语言）\", \"artist\": \"歌手1\", \"artistTranslationZh\": \"中文翻译或空字符串\"}],\n  \"favorites\": [{\"name\": \"歌曲真实官方歌名（保留原本语言）\", \"artist\": \"最爱歌手1\", \"artistTranslationZh\": \"中文翻译或空字符串\"}],\n  \"top\": [{\"name\": \"歌曲真实官方歌名（保留原本语言）\", \"artist\": \"歌手1\", \"artistTranslationZh\": \"中文翻译或空字符串\", \"loops\": 156, \"thoughts\": \"听这首歌时的内心情感与心声，要非常符合人设且细腻，不少于30字\", \"thoughtsTranslationZh\": \"中文翻译或空字符串\"}]\n}",
          health: "\"health\": {\n  \"steps\": \"步数纯数字\",\n  \"stepsThoughts\": \"跑步或运动时的心理活动，约30字\",\n  \"stepsThoughtsTranslationZh\": \"中文翻译或空字符串\",\n  \"sleepHours\": \"睡眠小时数纯数字\",\n  \"sleepMinutes\": \"睡眠分钟数纯数字\",\n  \"dream\": \"昨夜梦境内容，约30字\",\n  \"dreamTranslationZh\": \"中文翻译或空字符串\",\n  \"heartRate\": \"当前心率纯数字BPM\",\n  \"heartRateStatus\": \"符合心率与角色状态的简短描述\",\n  \"heartRateStatusTranslationZh\": \"中文翻译或空字符串\",\n  \"weight\": \"体重\",\n  \"height\": \"身高\"\n}",
          pay: "\"pay\": {\n  \"totalAssets\": \"24560.88\",\n  \"recentTransactions\": [\n    {\"title\": \"交易标题原文\", \"titleTranslationZh\": \"中文翻译或空字符串\", \"amount\": \"-128.00\", \"isIncome\": false}\n  ]\n}",
          game: "\"game\": {\n  \"playerName\": \"正常游戏内 ID，不限制语言\",\n  \"totalHours\": \"200小时\",\n  \"recentGames\": [\n    {\"name\": \"正常游戏名，不限制语言\", \"hours\": \"50小时\", \"rank\": \"正常段位，不限制语言\", \"winRate\": \"65%\", \"icon\": \"fas fa-gamepad\", \"matches\": [\n      {\"result\": \"正常对局结果，不限制语言\", \"kda\": \"8/2/5\", \"hero\": \"正常英雄名，不限制语言\", \"highlights\": [{\"desc\": \"高光描述原文\", \"descTranslationZh\": \"中文翻译或空字符串\"}], \"innerThoughts\": \"局内心声原文\", \"innerThoughtsTranslationZh\": \"中文翻译或空字符串\", \"postGameReflection\": \"复盘原文\", \"postGameReflectionTranslationZh\": \"中文翻译或空字符串\"}\n    ]}\n  ]\n}",
          weibo: "\"weibo\": {\n  \"mainAccount\": {\n    \"name\": \"大号昵称，不限制语言\",\n    \"signature\": \"符合 Char 公开形象的签名，不限制语言\",\n    \"posts\": [\n      {\"text\": \"自然且各不相同的大号帖子正文\", \"textTranslationZh\": \"中文翻译或空字符串\", \"source\": \"真实来源，不限制语言\", \"comments\": [{\"author\": \"评论用户名，不限制语言\", \"text\": \"贴合该帖语境的评论\", \"textTranslationZh\": \"中文翻译或空字符串\"}], \"reposts\": 6, \"likes\": 128}\n    ],\n    \"album\": [\n      {\"description\": \"具体且不重复的图片主体、场景、构图和质感描述20-50字，不限制语言\"}\n    ],\n    \"liked\": [\n      {\"author\": \"被赞博主名，不限制语言\", \"text\": \"符合大号公开兴趣的赞过帖子\", \"textTranslationZh\": \"中文翻译或空字符串\", \"source\": \"真实来源，不限制语言\", \"comments\": [], \"reposts\": 12, \"likes\": 241}\n    ]\n  },\n  \"altAccount\": {\n    \"name\": \"符合隐藏身份的小号名，不限制语言\",\n    \"signature\": \"符合小号隐秘状态的签名，不限制语言\",\n    \"avatarUrl\": \"\",\n    \"posts\": [\n      {\"text\": \"符合隐藏身份且主题自然多样的小号帖子正文\", \"textTranslationZh\": \"中文翻译或空字符串\", \"source\": \"真实来源，不限制语言\", \"comments\": [{\"author\": \"评论用户名，不限制语言\", \"text\": \"贴合该帖语境的评论\", \"textTranslationZh\": \"中文翻译或空字符串\"}], \"reposts\": 1, \"likes\": 19}\n    ],\n    \"album\": [\n      {\"description\": \"符合小号状态且与其他照片不同的具体画面描述20-50字，不限制语言\"}\n    ],\n    \"liked\": [\n      {\"author\": \"被赞博主名，不限制语言\", \"text\": \"符合小号隐秘兴趣的赞过帖子\", \"textTranslationZh\": \"中文翻译或空字符串\", \"source\": \"真实来源，不限制语言\", \"comments\": [], \"reposts\": 2, \"likes\": 33}\n    ]\n  }\n}"
        };
      content_7 += "\n【各应用生成要求】：\n";
      selectedApps_2.forEach(value_846 => {
        content_7 += options_836[value_846] + "\n";
      });
      content_7 += "\n请包含以下字段（根据选择包含对应的对象）：\n{\n";
      let selectedPrompts = selectedApps_2.map(app_4 => promptParts[app_4]).join(",\n").replace(/"(?:time|date|createdAt|timestamp|addedTime|recentCallTime)"\s*:\s*"[^"]*"\s*,?/g, "");
      content_7 += selectedPrompts + "\n}";
      content_7 += "\n注意：必须且只能返回合法的 JSON 字符串，不要包含任何多余的文字说明，不要 Markdown 标记。确保 JSON 格式绝对正确，键名和字符串都使用双引号。";
      if (window.showToast) window.showToast("正在生成符合设定的数据，请稍候...");
      const messages_6 = [{
          role: "system",
          content: "你是一个数据生成助手。只能返回合法的 JSON 字符串。"
        }, {
          role: "user",
          content: content_7
        }],
        model_2 = window.apiConfig.model || "gpt-3.5-turbo",
        endpoint_4 = window.u2Api.resolveChatCompletionsEndpoint(window.apiConfig.endpoint);
      fetch(endpoint_4, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.apiConfig.apiKey
        },
        body: JSON.stringify({
          model: model_2,
          messages: messages_6,
          temperature: 0.7
        })
      }).then(async response_4 => {
        if (!response_4.ok) {
          let apiDetail_2 = "HTTP error! status: " + response_4.status;
          try {
            const errorBody = await response_4.text();
            console.error("API Error Response Body:", errorBody);
            const errorObj = JSON.parse(errorBody);
            errorObj.error && errorObj.error.message ? apiDetail_2 = errorObj.error.message : apiDetail_2 += " - " + errorBody;
          } catch (value_852) {}
          throw Object.assign(new Error(apiDetail_2), {
            status: response_4.status,
            apiDetail: apiDetail_2
          });
        }
        return response_4.json();
      }).then(value_853 => {
        let resultText_4 = value_853.choices?.[0]?.message?.content || "",
          jsonStr_2 = resultText_4;
        const match_856 = resultText_4.match(/\{[\s\S]*\}/);
        match_856 ? jsonStr_2 = match_856[0] : jsonStr_2 = resultText_4.replace(/```json/gi, "").replace(/```/g, "").trim();
        try {
          const parsed_8 = JSON.parse(jsonStr_2),
            missingApps = selectedApps_2.filter(app_5 => !parsed_8?.[app_5] || typeof parsed_8[app_5] !== "object");
          if (missingApps.length) throw new Error("缺少应用数据：" + missingApps.join("、"));
          const requireCount = (value_865, value_866, value_867) => {
              if (!Array.isArray(value_865) || value_865.length !== value_866) throw new Error(value_867 + " 数量必须为 " + value_866);
            },
            requireRange = (value_868, value_869, value_870, value_871) => {
              if (!Array.isArray(value_868) || value_868.length < value_869 || value_868.length > value_870) throw new Error(value_871 + " 数量必须为 " + value_869 + "-" + value_870);
            };
          if (parsed_8.music) requireCount(parsed_8.music.top, genCounts.musicTop, "音乐排行");
          parsed_8.safari && (requireCount(parsed_8.safari.recentSearches, safariSplit.primary, "Safari 公开搜索"), requireCount(parsed_8.safari.privateSearches, safariSplit.secondary, "Safari 无痕搜索"));
          if (parsed_8.game) requireCount(parsed_8.game.recentGames, genCounts.gameTotal, "游戏");
          if (parsed_8.call) requireCount(parsed_8.call.recentCalls, genCounts.callTotal, "通话记录");
          parsed_8.weibo && (requireCount(parsed_8.weibo.mainAccount?.posts, weiboPostSplit.primary, "微博大号帖子"), requireCount(parsed_8.weibo.altAccount?.posts, weiboPostSplit.secondary, "微博小号帖子"), requireCount(parsed_8.weibo.mainAccount?.album, weiboPhotoSplit.primary, "微博大号相册"), requireCount(parsed_8.weibo.altAccount?.album, weiboPhotoSplit.secondary, "微博小号相册"), requireCount(parsed_8.weibo.mainAccount?.liked, 3, "微博大号赞过"), requireCount(parsed_8.weibo.altAccount?.liked, 3, "微博小号赞过"), parsed_8.weibo.mainAccount.posts = this.normalizeFriendPhoneWeiboPostComments(parsed_8.weibo.mainAccount.posts, 5), parsed_8.weibo.altAccount.posts = this.normalizeFriendPhoneWeiboPostComments(parsed_8.weibo.altAccount.posts, 5));
          parsed_8.files && (requireRange(parsed_8.files.tags, 2, 3, "文件标签"), parsed_8.files.tags.forEach((value_872, value_873) => requireRange(value_872?.items, 1, 3, "文件标签 " + (value_873 + 1))));
          if (parsed_8.pay) requireRange(parsed_8.pay.recentTransactions, 5, 50, "钱包交易");
          this.validateFriendPhoneLocalizedTree(parsed_8, friend_28.language || "zh", "phone");
          const generationDraft = {};
          parsed_8.music && (generationDraft.musicData = {
            recent: Array.isArray(parsed_8.music.recent) ? parsed_8.music.recent : [],
            favorites: Array.isArray(parsed_8.music.favorites) ? parsed_8.music.favorites : [],
            top: Array.isArray(parsed_8.music.top) ? parsed_8.music.top.slice(0, genCounts.musicTop) : []
          });
          parsed_8.health && (generationDraft.healthData = parsed_8.health);
          parsed_8.pay && (generationDraft.payData = {
            ...parsed_8.pay,
            recentTransactions: Array.isArray(parsed_8.pay.recentTransactions) ? parsed_8.pay.recentTransactions : []
          });
          parsed_8.game && (generationDraft.gameData = {
            ...parsed_8.game,
            recentGames: Array.isArray(parsed_8.game.recentGames) ? parsed_8.game.recentGames.slice(0, genCounts.gameTotal) : []
          });
          parsed_8.call && (generationDraft.callData = {
            ...parsed_8.call,
            recentCalls: Array.isArray(parsed_8.call.recentCalls) ? parsed_8.call.recentCalls.slice(0, genCounts.callTotal) : [],
            contacts: Array.isArray(parsed_8.call.contacts) ? parsed_8.call.contacts : []
          });
          parsed_8.safari && (generationDraft.safariData = {
            recentSearches: Array.isArray(parsed_8.safari.recentSearches) ? parsed_8.safari.recentSearches.slice(0, safariSplit.primary) : [],
            privateSearches: Array.isArray(parsed_8.safari.privateSearches) ? parsed_8.safari.privateSearches.slice(0, safariSplit.secondary) : []
          });
          parsed_8.files && (generationDraft.filesData = {
            ...parsed_8.files,
            tags: Array.isArray(parsed_8.files.tags) ? parsed_8.files.tags : [],
            recent: Array.isArray(parsed_8.files.recent) ? parsed_8.files.recent : []
          });
          if (parsed_8.weibo) {
            const rawWeibo = parsed_8.weibo || {},
              ensureAccount = (rawAccount, accountKey_2) => {
                const isAltAccount = accountKey_2 === "altAccount",
                  normalized_2 = this.normalizeWeiboAccount(rawAccount || {}, friend_28, accountKey_2 === "altAccount" ? "alt" : "main"),
                  postLimit = isAltAccount ? weiboPostSplit.secondary : weiboPostSplit.primary,
                  photoLimit = isAltAccount ? weiboPhotoSplit.secondary : weiboPhotoSplit.primary;
                return normalized_2.posts = normalized_2.posts.slice(0, postLimit), normalized_2.album = normalized_2.album.slice(0, photoLimit).map((item_18, index_13) => ({
                  ...item_18,
                  url: item_18.url || this.getWeiboRandomImage(friend_28, index_13, isAltAccount ? "alt" : "main")
                })), normalized_2.liked = normalized_2.liked.slice(0, 3), isAltAccount && !normalized_2.avatarUrl && (normalized_2.avatarUrl = this.getWeiboRandomAvatar(friend_28)), normalized_2;
              };
            generationDraft.weiboData = {
              mainAccount: ensureAccount(rawWeibo.mainAccount || rawWeibo.main || rawWeibo, "mainAccount"),
              altAccount: ensureAccount(rawWeibo.altAccount || rawWeibo.alt || {}, "altAccount")
            };
          }
          const normalizedPayload = {};
          if (generationDraft.musicData) normalizedPayload.music = generationDraft.musicData;
          if (generationDraft.healthData) normalizedPayload.health = generationDraft.healthData;
          if (generationDraft.payData) normalizedPayload.pay = generationDraft.payData;
          if (generationDraft.gameData) normalizedPayload.game = generationDraft.gameData;
          if (generationDraft.callData) normalizedPayload.call = generationDraft.callData;
          if (generationDraft.safariData) normalizedPayload.safari = generationDraft.safariData;
          if (generationDraft.filesData) normalizedPayload.files = generationDraft.filesData;
          if (generationDraft.weiboData) normalizedPayload.weibo = generationDraft.weiboData;
          const mergedGeneration = this.mergeFriendPhoneGeneratedData(friend_28, normalizedPayload, {
            generatedAt: Date.now(),
            skipValidation: true
          });
          Object.assign(friend_28, mergedGeneration.next);
          this.persistFriendState(friend_28);
          if (window.showToast) window.showToast("生成成功");
          window.closeView && window.closeView(settingsSheet);
        } catch (e_9) {
          console.error("JSON Parse error", e_9, "\nOriginal Text:", resultText_4, "\nExtracted:", jsonStr_2);
          if (window.showToast) window.showToast("生成数据解析失败，AI可能输出了非标准JSON格式，请重试");
        }
      })["catch"](err_2 => {
        console.error("API Error:", err_2);
        let displayMsg = err_2.message || "未知网络错误";
        displayMsg.length > 50 && (displayMsg = displayMsg.substring(0, 50) + "...");
        if (!window.u2Api?.isRequestError?.(err_2) || !window.u2Api.reportError(err_2, {
          operation: "手机数据生成"
        })) {
          if (window.showToast) window.showToast("API 请求失败: " + displayMsg);else alert("API 请求失败: " + displayMsg);
        }
      });
    });
    const imsgBtn = document.getElementById("friend-phone-app-imessage");
    if (imsgBtn) imsgBtn.onclick = () => window.cphoneApp?.openMessages();
    const filesBtn = document.getElementById("friend-phone-app-files"),
      filesView = document.getElementById("friend-files-view"),
      filesRecentlyDeletedView = document.getElementById("friend-files-recently-deleted-view"),
      filesRecentlyDeletedBackBtn = document.getElementById("friend-files-recently-deleted-back-btn"),
      filesRecentlyDeletedList = document.getElementById("friend-files-recently-deleted-list");
    !window.lovesApp._filesRecentlyDeletedBound && (document.addEventListener("click", e_10 => {
      const targetBtn = e_10.target.closest("#filesRecentlyDeletedBtn");
      if (targetBtn && filesRecentlyDeletedView) {
        if (window.openView) window.openView(filesRecentlyDeletedView);
        const activeFriend_3 = window.lovesApp.currentFriend;
        filesRecentlyDeletedList && (activeFriend_3 && activeFriend_3.filesData && activeFriend_3.filesData.recentlyDeleted && activeFriend_3.filesData.recentlyDeleted.length > 0 ? filesRecentlyDeletedList.innerHTML = activeFriend_3.filesData.recentlyDeleted.map(value_888 => "\n                                <div style=\"background: #fff; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; align-items: center;  position: relative; cursor: pointer;\">\n                                    <div style=\"width: 100%; aspect-ratio: 1; background: #f2f2f7; border-radius: 8px; margin-bottom: 8px; display: flex; justify-content: center; align-items: center; color: #8e8e93; font-size: 30px;\">\n                                        " + (value_888.type === "image" ? "<i class=\"fas fa-image\"></i>" : "<i class=\"far fa-file-alt\"></i>") + "\n                                    </div>\n                                    <div style=\"font-size: 13px; font-weight: 500; color: #111; text-align: center; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;\">" + value_888.name + "</div>\n                                    <div style=\"font-size: 11px; color: #8e8e93; margin-top: 4px;\">" + (value_888.size || "未知大小") + "</div>\n                                    <div style=\"position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.5); color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 6px;\">" + (value_888.daysLeft || "30") + "天</div>\n                                </div>\n                            ").join("") : filesRecentlyDeletedList.innerHTML = "<div style=\"grid-column: span 3; text-align: center; color: #8e8e93; padding: 40px 0;\">最近删除为空</div>");
      }
    }), filesRecentlyDeletedBackBtn && filesRecentlyDeletedView && filesRecentlyDeletedBackBtn.addEventListener("click", () => {
      if (window.closeView) window.closeView(filesRecentlyDeletedView);
    }), window.lovesApp._filesRecentlyDeletedBound = true);
    filesBtn && filesView && (filesBtn.onclick = () => {
      if (window.openView) window.openView(filesView);
      const tagsList = document.getElementById("friend-files-tags-list");
      tagsList && (friend_28.filesData && friend_28.filesData.tags ? (tagsList.innerHTML = friend_28.filesData.tags.map((tag_2, value_890) => {
        const value_891 = tag_2.items ? tag_2.items.map((item_19, value_893) => {
          const encodeURIComponent_894 = encodeURIComponent(JSON.stringify(item_19));
          return "\n                                    <div class=\"file-item-clickable\" data-item=\"" + encodeURIComponent_894 + "\" style=\"display: flex; align-items: center; padding: 12px 15px; border-top: 1px solid #f0f0f0; cursor: pointer; background: #fff;\">\n                                        <i class=\"far fa-file-alt\" style=\"color: #8e8e93; font-size: 18px; margin-right: 12px;\"></i>\n                                        <span style=\"font-size: 16px; color: #111; flex: 1;\">" + this.escapeHTML(item_19.title || "未命名文件") + this.renderFriendPhoneGeneratedTime(item_19) + "</span>\n                                        <i class=\"fas fa-chevron-right\" style=\"color: #c7c7cc; font-size: 14px;\"></i>\n                                    </div>\n                                ";
        }).join("") : "";
        return "\n                                <div style=\"border-radius: 12px; overflow: hidden;  margin-bottom: 10px;\">\n                                    <div style=\"display: flex; align-items: center; padding: 12px 15px; background: #fff;\">\n                                        <div style=\"width: 12px; height: 12px; border-radius: 50%; background: " + (tag_2.color || "#ff9500") + "; margin-right: 12px;\"></div>\n                                        <span style=\"font-size: 17px; font-weight: 600; color: #111; flex: 1;\">" + this.escapeHTML(tag_2.name || "未命名标签") + "</span>\n                                    </div>\n                                    " + value_891 + "\n                                </div>\n                            ";
      }).join(""), setTimeout(() => {
        const fileItems = tagsList.querySelectorAll(".file-item-clickable");
        fileItems.forEach(el => {
          el.addEventListener("click", function (event_896) {
            event_896.preventDefault();
            event_896.stopPropagation();
            try {
              const item_20 = JSON.parse(decodeURIComponent(this.getAttribute("data-item")));
              window.lovesApp.showDetailModal(item_20.title, "<div style=\"white-space: pre-wrap; font-size: 15px; line-height: 1.6; color: #333;\">" + window.lovesApp.renderFriendPhoneLocalized(item_20, "content", {
                id: "file-content"
              }) + "</div>" + window.lovesApp.renderFriendPhoneGeneratedTime(item_20));
            } catch (err_3) {
              console.error("File item parse error", err_3);
            }
          });
          window.lovesApp.bindLongPress(el, function () {
            try {
              const item_21 = JSON.parse(decodeURIComponent(el.getAttribute("data-item")));
              window.lovesApp.showDeleteConfirm(item_21.title, () => {
                friend_28.filesData && friend_28.filesData.tags && (friend_28.filesData.tags.forEach(tag => {
                  if (tag.items) {
                    const idx_8 = tag.items.findIndex(i_2 => i_2.title === item_21.title && i_2.content === item_21.content);
                    if (idx_8 !== -1) tag.items.splice(idx_8, 1);
                  }
                }), filesBtn.onclick());
              });
            } catch (value_902) {}
          });
        });
      }, 50)) : tagsList.innerHTML = "<div style=\"padding: 30px; text-align: center; color: #8e8e93; font-size: 14px;\">暂无文件数据<br><span style=\"font-size: 12px; margin-top: 5px; display: inline-block;\">请在设置中生成</span></div>");
    });
    const filesBackBtn = document.getElementById("friend-files-back-btn");
    if (filesBackBtn) filesBackBtn.onclick = () => {
      if (window.closeView) window.closeView(filesView);
    };
    const safariBtn = document.getElementById("friend-phone-app-safari"),
      safariView = document.getElementById("friend-safari-view");
    safariBtn && safariView && (safariBtn.onclick = () => {
      if (window.openView) window.openView(safariView);
      const topbar = document.getElementById("friend-safari-topbar"),
        searchBar = document.getElementById("friend-safari-search-bar"),
        backBtnIcon = document.getElementById("friend-safari-back-btn"),
        normalMode = document.getElementById("friend-safari-normal-mode"),
        privateMode = document.getElementById("friend-safari-private-mode"),
        dock = document.getElementById("friend-safari-dock"),
        privateToggleBtn = document.getElementById("friend-safari-private-btn");
      let enabled_904 = false;
      safariView.classList.remove("is-private");
      dock.style.background = "rgba(255,255,255,0.95)";
      dock.style.color = "#111";
      normalMode.style.opacity = "1";
      normalMode.style.pointerEvents = "auto";
      normalMode.style.transform = "translateY(0)";
      privateMode.style.opacity = "0";
      privateMode.style.pointerEvents = "none";
      privateMode.style.transform = "translateY(20px)";
      privateToggleBtn && (privateToggleBtn.onclick = () => {
        enabled_904 = !enabled_904;
        safariView.classList.toggle("is-private", enabled_904);
        enabled_904 ? (safariView.style.background = "#000", topbar.style.background = "#000", searchBar.style.background = "#1c1c1e", searchBar.style.color = "#8e8e93", backBtnIcon.style.color = "#fff", dock.style.background = "rgba(0,0,0,0.95)", dock.style.color = "#fff", dock.style.borderTop = "1px solid transparent", normalMode.style.opacity = "0", normalMode.style.pointerEvents = "none", normalMode.style.transform = "translateY(-20px)", privateMode.style.opacity = "1", privateMode.style.pointerEvents = "auto", privateMode.style.transform = "translateY(0)") : (safariView.style.background = "#f4f4f5", topbar.style.background = "#f4f4f5", searchBar.style.background = "#e5e5ea", searchBar.style.color = "#8e8e93", backBtnIcon.style.color = "#111", dock.style.background = "rgba(255,255,255,0.95)", dock.style.color = "#111", dock.style.borderTop = "1px solid #f0f0f0", privateMode.style.opacity = "0", privateMode.style.pointerEvents = "none", privateMode.style.transform = "translateY(20px)", normalMode.style.opacity = "1", normalMode.style.pointerEvents = "auto", normalMode.style.transform = "translateY(0)");
      });
      const historyList = document.getElementById("friend-safari-history-list"),
        privateHistoryList = document.getElementById("friend-safari-private-history-list");
      historyList && (friend_28.safariData && friend_28.safariData.recentSearches ? (historyList.innerHTML = friend_28.safariData.recentSearches.map((value_905, value_906) => {
        let value_907 = typeof value_905 === "string" ? value_905 : value_905.keyword || "未知搜索";
        return "\n                        <div class=\"safari-history-item-new\" data-idx=\"" + value_906 + "\" style=\"display: flex; align-items: center; gap: 15px; padding: 16px 0; border-bottom: 1px solid rgba(0,0,0,0.04); cursor: pointer;\">\n                            <i class=\"fas fa-search\" style=\"color: #c7c7cc; font-size: 14px; pointer-events: none;\"></i>\n                            <span style=\"font-size: 16px; color: #111; font-weight: 500; flex:1;\">" + this.escapeHTML(value_907) + (typeof value_905 === "object" ? this.renderFriendPhoneGeneratedTime(value_905) : "") + "</span>\n                        </div>\n                        ";
      }).join(""), setTimeout(() => {
        try {
          const items_2 = historyList.querySelectorAll(".safari-history-item-new");
          items_2.forEach(value_908 => {
            value_908.addEventListener("click", function (event_909) {
              event_909.preventDefault();
              event_909.stopPropagation();
              const attribute_910 = this.getAttribute("data-idx"),
                s = friend_28.safariData.recentSearches[attribute_910];
              typeof s === "object" && s.title && s.content ? window.lovesApp.showBrowserDetailModal(s.title, s.content, false, s) : window.lovesApp.showBrowserDetailModal("搜索记录", "无更多详情", false);
            });
            window.lovesApp.bindLongPress(value_908, function () {
              const idx_9 = value_908.getAttribute("data-idx"),
                value_913 = friend_28.safariData.recentSearches[idx_9],
                text_10 = typeof value_913 === "string" ? value_913 : value_913.keyword || "未知搜索";
              window.lovesApp.showDeleteConfirm(text_10, () => {
                friend_28.safariData.recentSearches.splice(idx_9, 1);
                safariBtn.onclick();
              });
            });
          });
        } catch (err_4) {
          console.error("Safari normal bind error", err_4);
        }
      }, 50)) : historyList.innerHTML = "<div style=\"padding: 30px; text-align: center; color: #8e8e93; font-size: 14px;\">暂无搜索数据<br><span style=\"font-size: 12px; margin-top: 5px; display: inline-block;\">请在设置中生成</span></div>");
      privateHistoryList && (friend_28.safariData && friend_28.safariData.privateSearches ? (privateHistoryList.innerHTML = friend_28.safariData.privateSearches.map((value_916, value_917) => {
        let value_918 = typeof value_916 === "string" ? value_916 : value_916.keyword || "未知记录";
        return "\n                        <div class=\"safari-private-item-new\" data-idx=\"" + value_917 + "\" style=\"display: flex; align-items: center; gap: 15px; padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer;\">\n                            <i class=\"fas fa-search\" style=\"color: #666; font-size: 14px; pointer-events: none;\"></i>\n                            <span style=\"font-size: 16px; color: #fff; font-weight: 500; flex:1;\">" + this.escapeHTML(value_918) + (typeof value_916 === "object" ? this.renderFriendPhoneGeneratedTime(value_916, "is-dark") : "") + "</span>\n                        </div>\n                        ";
      }).join(""), setTimeout(() => {
        try {
          const items_3 = privateHistoryList.querySelectorAll(".safari-private-item-new");
          items_3.forEach(value_919 => {
            value_919.addEventListener("click", function (event_920) {
              event_920.preventDefault();
              event_920.stopPropagation();
              const attribute_921 = this.getAttribute("data-idx"),
                s_2 = friend_28.safariData.privateSearches[attribute_921];
              typeof s_2 === "object" && s_2.title && s_2.content ? window.lovesApp.showBrowserDetailModal(s_2.title, s_2.content, true, s_2) : window.lovesApp.showBrowserDetailModal("隐私记录", "无更多详情", true);
            });
            window.lovesApp.bindLongPress(value_919, function () {
              const idx_10 = value_919.getAttribute("data-idx"),
                value_924 = friend_28.safariData.privateSearches[idx_10],
                text_11 = typeof value_924 === "string" ? value_924 : value_924.keyword || "未知记录";
              window.lovesApp.showDeleteConfirm(text_11, () => {
                friend_28.safariData.privateSearches.splice(idx_10, 1);
                safariBtn.onclick();
              });
            });
          });
        } catch (err_5) {
          console.error("Safari private bind error", err_5);
        }
      }, 50)) : privateHistoryList.innerHTML = "<div style=\"padding: 30px; text-align: center; color: #666; font-size: 14px;\">暂无无痕搜索数据<br><span style=\"font-size: 12px; margin-top: 5px; display: inline-block;\">请在设置中生成</span></div>");
    });
    const friendSafariBackBtnElement = document.getElementById("friend-safari-back-btn");
    if (friendSafariBackBtnElement) friendSafariBackBtnElement.onclick = () => {
      if (window.closeView) window.closeView(safariView);
    };
    const weiboBtn = document.getElementById("friend-phone-app-weibo"),
      weiboView_2 = document.getElementById("friend-weibo-view");
    weiboBtn && weiboView_2 && (weiboBtn.onclick = () => {
      this.currentWeiboAccount = "main";
      this.renderFriendWeibo(friend_28);
      const tabs = Array.from(weiboView_2.querySelectorAll(".friend-weibo-tab")),
        pages = document.getElementById("friend-weibo-pages"),
        setActiveWeiboTab = activeIndex => {
          tabs.forEach((tab, index_14) => {
            const isActive = index_14 === activeIndex;
            tab.style.color = isActive ? "#111" : "#777";
            tab.style.fontWeight = isActive ? "700" : "600";
            const line = tab.querySelector(".friend-weibo-tab-line");
            if (line) line.style.display = isActive ? "block" : "none";
          });
        };
      pages && tabs.length && (tabs.forEach((tab_2, index_15) => {
        tab_2.onclick = () => {
          pages.scrollTo({
            left: index_15 * pages.clientWidth,
            behavior: "smooth"
          });
          setActiveWeiboTab(index_15);
        };
      }), pages.onscroll = () => {
        const pageWidth = pages.clientWidth || 1,
          activeIndex_2 = Math.max(0, Math.min(2, Math.round(pages.scrollLeft / pageWidth)));
        setActiveWeiboTab(activeIndex_2);
      }, pages.scrollTo({
        left: 0,
        behavior: "auto"
      }), setActiveWeiboTab(0));
      if (window.openView) window.openView(weiboView_2);
    });
    const friendWeiboSwitchAccountBtnElement_809 = document.getElementById("friend-weibo-switch-account-btn");
    friendWeiboSwitchAccountBtnElement_809 && (friendWeiboSwitchAccountBtnElement_809.onclick = event_932 => {
      event_932.preventDefault();
      event_932.stopPropagation();
      const data_4 = this.getFriendWeiboData(friend_28);
      if (this.currentWeiboAccount === "main") {
        if (!data_4.altAccount) {
          if (window.showToast) window.showToast("暂无微博小号数据，请在生成设置中生成微博");
          return;
        }
        this.currentWeiboAccount = "alt";
      } else this.currentWeiboAccount = "main";
      this.renderFriendWeibo(friend_28);
      if (window.showToast) window.showToast(this.currentWeiboAccount === "alt" ? "已切换到微博小号" : "已切换到微博大号");
    });
    const weiboBackBtn = document.getElementById("friend-weibo-back-btn");
    if (weiboBackBtn) weiboBackBtn.onclick = () => {
      if (window.closeView) window.closeView(weiboView_2);
    };
    const musicBtn = document.getElementById("friend-phone-app-music"),
      musicView = document.getElementById("friend-music-view");
    musicBtn && musicView && (musicBtn.onclick = () => {
      if (window.openView) window.openView(musicView);
      const musicContent = document.getElementById("friend-music-content");
      if (musicContent) {
        let musicData_2 = friend_28.musicData;
        if (!musicData_2 || !musicData_2.top || musicData_2.top.length === 0) musicContent.innerHTML = "<div style=\"padding: 50px 20px; text-align: center; color: #8e8e93; font-size: 15px;\">暂无音乐数据<br><span style=\"font-size: 13px; margin-top: 8px; display: inline-block;\">请在设置中生成</span></div>";else {
          const join_935 = (musicData_2.top || []).map((song, value_937) => "\n                            <div class=\"music-history-item\" data-idx=\"" + value_937 + "\" style=\"display: flex; align-items: center; gap: 15px; padding: 10px 0; border-bottom: 1px solid #f0f0f0; cursor: pointer;\">\n                                <div style=\"font-size: 16px; font-weight: 700; color: #111; width: 20px; text-align: center;\">" + (value_937 + 1) + "</div>\n                                <div style=\"width: 50px; height: 50px; border-radius: 6px; background: #111; flex-shrink: 0; display: flex; justify-content: center; align-items: center; color: #fff;\">\n                                    <i class=\"fas fa-music\"></i>\n                                </div>\n                                <div style=\"flex: 1; display: flex; flex-direction: column; pointer-events: none;\">\n                                    <div style=\"font-size: 16px; font-weight: 600; color: #111;\">" + this.escapeHTML(song.name || "未知歌曲") + "</div>\n                                    <div style=\"font-size: 13px; color: #8e8e93;\">" + this.renderFriendPhoneLocalized(song, "artist", {
            id: "song-artist-" + value_937
          }) + this.renderFriendPhoneGeneratedTime(song) + "</div>\n                                </div>\n                                <i class=\"fas fa-ellipsis-v\" style=\"color: #c7c7cc; pointer-events: none;\"></i>\n                            </div>\n                        ").join("");
          musicContent.innerHTML = "\n                        <div style=\"padding: 20px 16px; background: #fff;\">\n                            <div style=\"font-size: 28px; font-weight: 800; color: #111; margin-bottom: 20px; letter-spacing: -0.5px;\">APPLE</div>\n                            <div style=\"display: flex; gap: 15px; overflow-x: auto; padding-bottom: 15px;\">\n                                <div style=\"min-width: 140px; display: flex; flex-direction: column; gap: 10px;\">\n                                    <div style=\"width: 140px; height: 140px; border-radius: 12px; background: #f4f4f5; display: flex; justify-content: center; align-items: center; color: #111; font-size: 30px; \">\n                                        <i class=\"fas fa-history\"></i>\n                                    </div>\n                                    <div style=\"font-size: 15px; font-weight: 700; color: #111;\">Recently</div>\n                                    <div style=\"font-size: 13px; color: #8e8e93;\">" + (musicData_2.recent ? musicData_2.recent.length : 0) + " Songs</div>\n                                </div>\n                                <div style=\"min-width: 140px; display: flex; flex-direction: column; gap: 10px;\">\n                                    <div style=\"width: 140px; height: 140px; border-radius: 12px; background: #111; display: flex; justify-content: center; align-items: center; color: #fff; font-size: 30px; \">\n                                        <i class=\"fas fa-heart\"></i>\n                                    </div>\n                                    <div style=\"font-size: 15px; font-weight: 700; color: #111;\">Favorites</div>\n                                    <div style=\"font-size: 13px; color: #8e8e93;\">" + (musicData_2.favorites ? musicData_2.favorites.length : 0) + " Songs</div>\n                                </div>\n                            </div>\n                        </div>\n                        <div style=\"padding: 10px 16px 30px; background: #fff; border-top: 1px solid #f0f0f0;\">\n                            <div style=\"font-size: 22px; font-weight: 700; color: #111; margin-bottom: 15px; margin-top: 10px;\">RANKINGS</div>\n                            <div style=\"display: flex; flex-direction: column; gap: 5px;\">\n                                " + join_935 + "\n                            </div>\n                        </div>\n                        ";
        }
        setTimeout(() => {
          try {
            const items_4 = musicContent.querySelectorAll(".music-history-item");
            items_4.forEach(value_938 => {
              value_938.addEventListener("click", function (event_939) {
                event_939.preventDefault();
                event_939.stopPropagation();
                const attribute_940 = this.getAttribute("data-idx"),
                  song_2 = musicData_2.top[attribute_940],
                  loops_2 = parseInt(song_2.loops) || Math.floor(Math.random() * 100) + 10,
                  fallback_5 = song_2.thoughts || "这首歌旋律很好听，每次听都能让我安静下来。",
                  content_8 = "\n                                        <div style=\"display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 20px;\">\n                                            <div style=\"width: 80px; height: 80px; border-radius: 50%; background: #111; display: flex; justify-content: center; align-items: center; color: #fff; font-size: 30px; margin-bottom: 15px; \">\n                                                <i class=\"fas fa-compact-disc\"></i>\n                                            </div>\n                                            <div style=\"font-size: 22px; font-weight: 800; color: #111; margin-bottom: 4px;\">" + window.lovesApp.escapeHTML(song_2.name || "未知歌曲") + "</div>\n                                            <div style=\"font-size: 15px; color: #8e8e93;\">" + window.lovesApp.renderFriendPhoneLocalized(song_2, "artist", {
                    id: "song-detail-artist"
                  }) + window.lovesApp.renderFriendPhoneGeneratedTime(song_2) + "</div>\n                                        </div>\n                                        \n                                        <div style=\"background: #f4f4f5; border-radius: 16px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;\">\n                                            <div style=\"display: flex; align-items: center; gap: 8px;\">\n                                                <div style=\"width: 32px; height: 32px; border-radius: 8px; background: #fff; display: flex; justify-content: center; align-items: center; color: #111;\">\n                                                    <i class=\"fas fa-redo-alt\" style=\"font-size: 14px;\"></i>\n                                                </div>\n                                                <span style=\"font-size: 15px; font-weight: 600; color: #111;\">Repeated</span>\n                                            </div>\n                                            <div style=\"font-size: 20px; font-weight: 800; color: #111;\">" + loops_2 + " <span style=\"font-size: 13px; font-weight: 500; color: #8e8e93;\">次</span></div>\n                                        </div>\n\n                                        <div style=\"background: #111; border-radius: 16px; padding: 20px; border-left: 4px solid #fff;\">\n                                            <div style=\"font-weight: 700; color: #fff; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;\">\n                                                <i class=\"fas fa-headphones-alt\" style=\"color: #fff;\"></i> 听歌心声\n                                            </div>\n                                            <div style=\"color: #ccc; line-height: 1.6; font-size: 14px; font-style: italic;\">\n                                                “" + window.lovesApp.renderFriendPhoneLocalized(song_2, "thoughts", {
                    fallback: fallback_5,
                    id: "song-thoughts"
                  }) + "”\n                                            </div>\n                                        </div>\n                                    ";
                window.lovesApp.showDetailModal("SINGLE", content_8);
              });
              window.lovesApp.bindLongPress(value_938, function () {
                const idx_11 = value_938.getAttribute("data-idx"),
                  song_3 = musicData_2.top[idx_11];
                window.lovesApp.showDeleteConfirm(song_3.name, () => {
                  musicData_2.top.splice(idx_11, 1);
                  musicBtn.onclick();
                });
              });
            });
          } catch (err_6) {
            console.error("Music bind error", err_6);
          }
        }, 50);
      }
    });
    const musicBackBtn = document.getElementById("friend-music-back-btn");
    if (musicBackBtn) musicBackBtn.onclick = () => {
      if (window.closeView) window.closeView(musicView);
    };
    const callBtn = document.getElementById("friend-phone-app-call"),
      callView = document.getElementById("friend-phonecall-view");
    callBtn && callView && (callBtn.onclick = () => {
      if (window.openView) window.openView(callView);
      const tabRecent = document.getElementById("friend-call-tab-recent"),
        tabContacts = document.getElementById("friend-call-tab-contacts"),
        listRecent = document.getElementById("friend-call-list"),
        listContacts = document.getElementById("friend-contact-list");
      tabRecent && tabContacts && listRecent && listContacts && (tabRecent.onclick = () => {
        tabRecent.classList.add("active");
        tabContacts.classList.remove("active");
        tabRecent.style.background = "#fff";
        tabRecent.style.color = "#111";
        tabRecent.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
        tabContacts.style.background = "transparent";
        tabContacts.style.color = "#8e8e93";
        tabContacts.style.boxShadow = "none";
        listRecent.style.display = "block";
        listContacts.style.display = "none";
      }, tabContacts.onclick = () => {
        tabContacts.classList.add("active");
        tabRecent.classList.remove("active");
        tabContacts.style.background = "#fff";
        tabContacts.style.color = "#111";
        tabContacts.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
        tabRecent.style.background = "transparent";
        tabRecent.style.color = "#8e8e93";
        tabRecent.style.boxShadow = "none";
        listContacts.style.display = "block";
        listRecent.style.display = "none";
      });
      if (listRecent && friend_28.callData && friend_28.callData.recentCalls) {
        listRecent.innerHTML = friend_28.callData.recentCalls.map((value_948, value_949) => {
          let typeIcon = "";
          if (value_948.type === "missed") typeIcon = "<i class=\"fas fa-phone-slash\" style=\"color: #ff3b30; font-size: 10px;\"></i>";else value_948.type === "outgoing" ? typeIcon = "<i class=\"fas fa-phone\" style=\"color: #8e8e93; font-size: 10px;\"></i>" : typeIcon = "<i class=\"fas fa-phone-alt\" style=\"color: #8e8e93; font-size: 10px;\"></i>";
          return "\n                        <div class=\"call-history-item-new\" data-idx=\"" + value_949 + "\" style=\"display: flex; align-items: center; padding: 15px 0; cursor: pointer;\">\n                            <div style=\"flex: 1; display: flex; flex-direction: column; pointer-events: none;\">\n                                <div style=\"font-size: 18px; font-weight: 600; color: " + (value_948.type === "missed" ? "#ff3b30" : "#111") + ";\">" + this.escapeHTML(this.getFriendPhoneChineseContactName(value_948)) + "</div>\n                                <div style=\"font-size: 14px; color: #8e8e93; display: flex; align-items: center; gap: 6px; margin-top: 4px;\">\n                                    " + typeIcon + "\n                                    <span>" + (value_948.type === "missed" ? "未接来电" : "语音通话") + "</span>\n                                </div>\n                            </div>\n                            <div style=\"display: flex; align-items: center; gap: 15px; pointer-events: none;\">\n                                <span style=\"color: #8e8e93; font-size: 14px;\">" + this.escapeHTML(this.formatFriendPhoneGeneratedAt(value_948.generatedAt) || value_948.time || "") + "</span>\n                                <i class=\"fas fa-info-circle\" style=\"color: #007aff; font-size: 22px;\"></i>\n                            </div>\n                        </div>";
        }).join("");
        if (listContacts) {
          const fallbackContactNames = new Set(),
            fallbackContacts = friend_28.callData.recentCalls.reduce((items_5, call_2) => {
              const chineseName = this.getFriendPhoneChineseContactName(call_2);
              if (!chineseName || fallbackContactNames.has(chineseName)) return items_5;
              return fallbackContactNames.add(chineseName), items_5.push({
                name: chineseName,
                addedTime: "未知时间",
                recentCallTime: "近期",
                callReason: "日常联系"
              }), items_5;
            }, []),
            _parsedContacts_2 = Array.isArray(friend_28.callData.contacts) && friend_28.callData.contacts.length ? friend_28.callData.contacts : fallbackContacts;
          friend_28.callData._parsedContacts = _parsedContacts_2;
          listContacts.innerHTML = _parsedContacts_2.map((value_956, value_957) => "\n                            <div class=\"contact-item-new\" data-idx=\"" + value_957 + "\" style=\"display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e5ea; cursor: pointer;\">\n                                <div style=\"width: 40px; height: 40px; border-radius: 50%; background: #f2f2f7; display: flex; justify-content: center; align-items: center; color: #8e8e93; margin-right: 15px; font-size: 16px; pointer-events: none;\">\n                                    <i class=\"fas fa-user\"></i>\n                                </div>\n                                <div style=\"flex: 1; font-size: 16px; font-weight: 600; color: #111;\">" + this.escapeHTML(this.getFriendPhoneChineseContactName(value_956)) + "</div>\n                                <i class=\"fas fa-info-circle\" style=\"color: #007aff; font-size: 20px; pointer-events: none;\"></i>\n                            </div>\n                        ").join("");
        }
        setTimeout(() => {
          try {
            const items_6 = listRecent.querySelectorAll(".call-history-item-new");
            items_6.forEach(value_958 => {
              value_958.addEventListener("click", function (event_959) {
                event_959.preventDefault();
                event_959.stopPropagation();
                const attribute_960 = this.getAttribute("data-idx"),
                  c = friend_28.callData.recentCalls[attribute_960];
                window.lovesApp.showCallDetailModal(c);
              });
              window.lovesApp.bindLongPress(value_958, function () {
                const idx_12 = value_958.getAttribute("data-idx"),
                  c_2 = friend_28.callData.recentCalls[idx_12];
                window.lovesApp.showDeleteConfirm(c_2.name + "的通话记录", () => {
                  friend_28.callData.recentCalls.splice(idx_12, 1);
                  callBtn.onclick();
                });
              });
            });
            if (listContacts && friend_28.callData._parsedContacts) {
              const contactItems = listContacts.querySelectorAll(".contact-item-new");
              contactItems.forEach(value_964 => {
                value_964.addEventListener("click", function (event_965) {
                  event_965.preventDefault();
                  event_965.stopPropagation();
                  const idx_13 = this.getAttribute("data-idx"),
                    c_3 = friend_28.callData._parsedContacts[idx_13];
                  window.lovesApp.showContactDetailModal(c_3);
                });
              });
            }
          } catch (err_7) {
            console.error("Call bind error", err_7);
          }
        }, 50);
      } else listRecent && (listRecent.innerHTML = "<div style=\"padding: 30px; text-align: center; color: #8e8e93; font-size: 14px;\">暂无通话记录<br><span style=\"font-size: 12px; margin-top: 5px; display: inline-block;\">请在设置中生成</span></div>", listContacts && (listContacts.innerHTML = "<div style=\"padding: 30px; text-align: center; color: #8e8e93; font-size: 14px;\">暂无联系人</div>"));
    });
    const callBackBtn = document.getElementById("friend-phonecall-back-btn");
    if (callBackBtn) callBackBtn.onclick = () => {
      if (window.closeView) window.closeView(callView);
    };
    const healthBtn = document.getElementById("friend-phone-app-health"),
      healthView = document.getElementById("friend-health-view");
    healthBtn && healthView && (healthBtn.onclick = () => {
      if (window.openView) window.openView(healthView);
      const healthContent = document.getElementById("friend-health-content");
      if (healthContent) {
        if (!friend_28.healthData) healthContent.innerHTML = "<div style=\"padding: 50px 20px; text-align: center; color: #8e8e93; font-size: 15px;\">暂无健康数据<br><span style=\"font-size: 13px; margin-top: 8px; display: inline-block;\">请在设置中生成</span></div>";else {
          const healthHistory = Array.isArray(friend_28.healthData.history) && friend_28.healthData.history.length ? friend_28.healthData.history : [friend_28.healthData],
            healthIndex = Math.min(Number(this._healthHistoryIndex) || 0, healthHistory.length - 1),
            healthData_2 = healthHistory[healthIndex] || friend_28.healthData,
            value_972 = new Date(),
            stepsThoughts = this.renderFriendPhoneLocalized(healthData_2, "stepsThoughts", {
              fallback: "暂无运动心声",
              id: "health-steps-thoughts"
            }),
            dream = this.renderFriendPhoneLocalized(healthData_2, "dream", {
              fallback: "暂无梦境记录",
              id: "health-dream"
            }),
            heartRate_2 = this.escapeHTML(healthData_2.heartRate || "--"),
            heartRateStatus = this.renderFriendPhoneLocalized(healthData_2, "heartRateStatus", {
              fallback: "暂无状态",
              id: "health-heart-status"
            }),
            join_977 = healthHistory.map((value_979, value_980) => "<option value=\"" + value_980 + "\" " + (value_980 === healthIndex ? "selected" : "") + ">" + this.escapeHTML(this.formatFriendPhoneGeneratedAt(value_979.generatedAt) || "旧记录 " + (value_980 + 1)) + "</option>").join(""),
            join_978 = [-2, -1, 0, 1, 2].map(value_981 => {
              const d = new Date(value_972);
              d.setDate(value_972.getDate() + value_981);
              const date_983 = d.getDate(),
                weekStr = ["日", "一", "二", "三", "四", "五", "六"][d.getDay()],
                value_985 = value_981 === 0;
              return "\n                            <div style=\"display: flex; flex-direction: column; align-items: center; justify-content: center; width: 44px; height: 56px; border-radius: 14px; background: " + (value_985 ? "#111" : "transparent") + "; color: " + (value_985 ? "#fff" : "#8e8e93") + "; flex-shrink: 0; cursor: pointer; \">\n                                <div style=\"font-size: 11px; font-weight: 600; margin-bottom: 2px;\">" + weekStr + "</div>\n                                <div style=\"font-size: 16px; font-weight: 800;\">" + date_983 + "</div>\n                            </div>\n                        ";
            }).join("");
          healthContent.innerHTML = "\n                        <!-- 顶部日期选择 -->\n                        <label class=\"friend-phone-history-picker\"><span>生成记录</span><select id=\"friend-health-history-select\">" + join_977 + "</select></label>\n                        <div style=\"display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;\">\n                            <div style=\"font-size: 28px; font-weight: 800; color: #111; letter-spacing: -0.5px;\">摘要</div>\n                            <div style=\"width: 32px; height: 32px; border-radius: 50%; background: #f2f2f7; display: flex; justify-content: center; align-items: center; color: #111; font-size: 14px; cursor: pointer;\">\n                                <i class=\"fas fa-calendar-day\"></i>\n                            </div>\n                        </div>\n                        \n                        <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; background: #fff; border-radius: 20px; padding: 8px; \">\n                            " + join_978 + "\n                        </div>\n\n                        <!-- 步数卡片 -->\n                        <div style=\"background: #fff; border-radius: 24px; padding: 22px; margin-bottom: 15px; border: 1px solid #f0f0f0; \">\n                            <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;\">\n                                <div style=\"display: flex; align-items: center; gap: 8px; color: #111; font-weight: 600;\">\n                                    <div style=\"width: 28px; height: 28px; border-radius: 8px; background: #f2f2f7; display: flex; justify-content: center; align-items: center;\"><i class=\"fas fa-shoe-prints\" style=\"font-size: 12px; color: #ff3b30;\"></i></div>\n                                    <span>步数</span>\n                                </div>\n                                <div style=\"font-size: 12px; color: #8e8e93; font-weight: 600;\">14:20 更新</div>\n                            </div>\n                            <div style=\"font-size: 42px; font-weight: 800; color: #111; display: flex; align-items: baseline; gap: 6px; letter-spacing: -1px;\">\n                                " + (healthData_2.steps || "0") + " <span style=\"font-size: 15px; color: #8e8e93; font-weight: 600; letter-spacing: 0;\">步</span>\n                            </div>\n                            <div style=\"margin-top: 14px; padding-top: 13px; border-top: 1px solid #f0f0f0; color: #666; font-size: 13px; line-height: 1.65;\">" + stepsThoughts + "</div>\n                        </div>\n\n                        <!-- 睡眠卡片 -->\n                        <div style=\"background: #fff; border-radius: 24px; padding: 22px; margin-bottom: 15px; border: 1px solid #f0f0f0; \">\n                            <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;\">\n                                <div style=\"display: flex; align-items: center; gap: 8px; color: #111; font-weight: 600;\">\n                                    <div style=\"width: 28px; height: 28px; border-radius: 8px; background: #f2f2f7; display: flex; justify-content: center; align-items: center;\"><i class=\"fas fa-bed\" style=\"font-size: 12px; color: #5856d6;\"></i></div>\n                                    <span>睡眠</span>\n                                </div>\n                                <div style=\"font-size: 12px; color: #8e8e93; font-weight: 600;\">昨晚记录</div>\n                            </div>\n                            <div style=\"font-size: 36px; font-weight: 800; color: #111; display: flex; align-items: baseline; gap: 6px; letter-spacing: -0.5px;\">\n                                " + (healthData_2.sleepHours || "0") + " <span style=\"font-size: 15px; color: #8e8e93; font-weight: 600; letter-spacing: 0;\">小时</span> \n                                " + (healthData_2.sleepMinutes || "0") + " <span style=\"font-size: 15px; color: #8e8e93; font-weight: 600; letter-spacing: 0;\">分钟</span>\n                            </div>\n                            <div style=\"margin-top: 14px; padding-top: 13px; border-top: 1px solid #f0f0f0; color: #666; font-size: 13px; line-height: 1.65;\">" + dream + "</div>\n                        </div>\n\n                        <!-- 当前心率 -->\n                        <div style=\"background: #fff; border-radius: 24px; padding: 22px; margin-bottom: 15px; border: 1px solid #f0f0f0; display: flex; align-items: center; justify-content: space-between; gap: 16px;\">\n                            <div>\n                                <div style=\"display: flex; align-items: center; gap: 8px; color: #111; font-weight: 600; margin-bottom: 10px;\">\n                                    <div style=\"width: 28px; height: 28px; border-radius: 8px; background: #fff0f2; display: flex; justify-content: center; align-items: center;\"><i class=\"fas fa-heartbeat\" style=\"font-size: 13px; color: #ff2d55;\"></i></div>\n                                    <span>实时心率</span>\n                                </div>\n                                <div style=\"color: #8e8e93; font-size: 13px;\">" + heartRateStatus + "</div>\n                            </div>\n                            <div style=\"color: #111; display: flex; align-items: baseline; gap: 5px; flex-shrink: 0;\">\n                                <span style=\"font-size: 40px; font-weight: 800;\">" + heartRate_2 + "</span>\n                                <span style=\"color: #8e8e93; font-size: 12px; font-weight: 600;\">BPM</span>\n                            </div>\n                        </div>\n\n                        <!-- 身体指标 -->\n                        <div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 15px;\">\n                            <div style=\"background: #fff; border-radius: 24px; padding: 20px; border: 1px solid #f0f0f0; \">\n                                <div style=\"display: flex; align-items: center; gap: 8px; color: #111; font-weight: 600; margin-bottom: 16px;\">\n                                    <div style=\"width: 28px; height: 28px; border-radius: 8px; background: #f2f2f7; display: flex; justify-content: center; align-items: center;\"><i class=\"fas fa-weight\" style=\"font-size: 12px; color: #007aff;\"></i></div>\n                                    <span>体重</span>\n                                </div>\n                                <div style=\"font-size: 28px; font-weight: 800; color: #111; letter-spacing: -0.5px;\">" + (healthData_2.weight || "-") + " <span style=\"font-size: 13px; color: #8e8e93; font-weight: 600; letter-spacing: 0;\">kg</span></div>\n                            </div>\n                            <div style=\"background: #fff; border-radius: 24px; padding: 20px; border: 1px solid #f0f0f0; \">\n                                <div style=\"display: flex; align-items: center; gap: 8px; color: #111; font-weight: 600; margin-bottom: 16px;\">\n                                    <div style=\"width: 28px; height: 28px; border-radius: 8px; background: #f2f2f7; display: flex; justify-content: center; align-items: center;\"><i class=\"fas fa-ruler-vertical\" style=\"font-size: 12px; color: #ff9500;\"></i></div>\n                                    <span>身高</span>\n                                </div>\n                                <div style=\"font-size: 28px; font-weight: 800; color: #111; letter-spacing: -0.5px;\">" + (healthData_2.height || "-") + " <span style=\"font-size: 13px; color: #8e8e93; font-weight: 600; letter-spacing: 0;\">cm</span></div>\n                            </div>\n                        </div>\n                    ";
          const healthHistorySelect = document.getElementById("friend-health-history-select");
          if (healthHistorySelect) healthHistorySelect.onchange = () => {
            this._healthHistoryIndex = Number(healthHistorySelect.value) || 0;
            healthBtn.onclick();
          };
        }
      }
    });
    const healthBackBtn = document.getElementById("friend-health-back-btn");
    if (healthBackBtn) healthBackBtn.onclick = () => {
      if (window.closeView) window.closeView(healthView);
    };
    const payBtn = document.getElementById("friend-phone-app-pay"),
      payView = document.getElementById("friend-pay-view");
    payBtn && payView && (payBtn.onclick = () => {
      if (window.openView) window.openView(payView);
      const payContent = document.getElementById("friend-pay-content");
      if (payContent) {
        const payHistory = Array.isArray(friend_28.payData?.snapshots) && friend_28.payData.snapshots.length ? friend_28.payData.snapshots : friend_28.payData ? [friend_28.payData] : [],
          payIndex = Math.min(Number(this._payHistoryIndex) || 0, Math.max(0, payHistory.length - 1));
        let payData_2 = payHistory[payIndex] || friend_28.payData;
        if (!payData_2) payContent.innerHTML = "<div style=\"padding: 50px 20px; text-align: center; color: #8e8e93; font-size: 15px;\">暂无钱包数据<br><span style=\"font-size: 13px; margin-top: 8px; display: inline-block;\">请在设置中生成</span></div>";else {
          const join_989 = payHistory.map((value_993, value_994) => "<option value=\"" + value_994 + "\" " + (value_994 === payIndex ? "selected" : "") + ">" + this.escapeHTML(this.formatFriendPhoneGeneratedAt(value_993.generatedAt) || "旧记录 " + (value_994 + 1)) + "</option>").join("");
          let cards_2 = payData_2.cards;
          if (!cards_2) {
            const totalStr = String(payData_2.totalAssets || "0").replace(/,/g, ""),
              total_3 = parseFloat(totalStr) || 0,
              txs = payData_2.recentTransactions || [];
            cards_2 = [{
              id: "card1",
              bankName: "黑金储蓄卡",
              cardType: "Debit",
              cardNumber: "**** **** **** 8888",
              amount: (total_3 * 0.6).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }),
              transactions: txs.filter((_, i_3) => i_3 % 2 === 0)
            }, {
              id: "card2",
              bankName: "白金信用卡",
              cardType: "Credit",
              cardNumber: "**** **** **** 1234",
              amount: (total_3 * 0.4).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }),
              transactions: txs.filter((__2, i_4) => i_4 % 2 !== 0)
            }, {
              id: "card3",
              bankName: "虚拟支付卡",
              cardType: "Prepaid",
              cardNumber: "**** **** **** 9999",
              amount: "0.00",
              transactions: []
            }];
            friend_28.payData && (friend_28.payData.cards = cards_2);
          }
          let count_991 = 0;
          const value_992 = () => {
            const join_1001 = cards_2.map((value_1006, i_5) => {
                const value_1008 = i_5 === count_991;
                let translateY = 0,
                  count_1010 = 1,
                  count_1011 = 1,
                  count_1012 = 100;
                const bgStyles = ["linear-gradient(135deg, #111, #1a1a1c)", "linear-gradient(135deg, #141416, #222)", "linear-gradient(135deg, #0a0a0c, #161618)"],
                  bgStyle = bgStyles[i_5 % bgStyles.length],
                  text_1015 = "#fff",
                  subtitleColor = "rgba(255,255,255,0.6)",
                  borderColor = "rgba(255,255,255,0.15)";
                if (!value_1008) {
                  let rank_2 = i_5 - count_991;
                  rank_2 < 0 && (rank_2 += cards_2.length);
                  translateY = 40 + (rank_2 - 1) * 20;
                  count_1010 = 1 - 0.06 * rank_2;
                  count_1012 = 10 - rank_2;
                } else {
                  translateY = -10;
                  count_1010 = 1.02;
                  count_1012 = 100;
                }
                const transCSS = "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.6s ease";
                return "\n                                <div class=\"pay-wallet-card\" data-idx=\"" + i_5 + "\" style=\"position: absolute; top: 0; left: 0; right: 0; height: 180px; background: " + bgStyle + "; border-radius: 20px; padding: 20px; color: " + text_1015 + ";  transition: " + transCSS + "; transform: translateY(" + translateY + "px) scale(" + count_1010 + "); opacity: " + count_1011 + "; z-index: " + count_1012 + "; cursor: pointer; border: 1px solid rgba(255,255,255,0.08);\">\n                                    <div style=\"display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;\">\n                                        <div style=\"font-size: 16px; font-weight: 700; letter-spacing: 0.5px;\">" + value_1006.bankName + "</div>\n                                        <div style=\"font-size: 11px; color: " + subtitleColor + "; border: 1px solid " + borderColor + "; padding: 2px 10px; border-radius: 12px; font-weight: 600;\">" + value_1006.cardType + "</div>\n                                    </div>\n                                    <div style=\"font-size: 20px; font-family: monospace; letter-spacing: 2px; margin-bottom: 20px; text-shadow: 0 1px 2px rgba(0,0,0,0.5);\">" + value_1006.cardNumber + "</div>\n                                    <div style=\"display: flex; justify-content: space-between; align-items: flex-end;\">\n                                        <div>\n                                            <div style=\"font-size: 11px; color: " + subtitleColor + "; margin-bottom: 4px; font-weight: 500;\">当前金额</div>\n                                            <div style=\"font-size: 22px; font-weight: 800; letter-spacing: -0.5px;\">¥ " + value_1006.amount + "</div>\n                                        </div>\n                                        <i class=\"fab fa-cc-visa\" style=\"font-size: 28px; color: " + text_1015 + "; opacity: 0.7;\"></i>\n                                    </div>\n                                </div>\n                            ";
              }).join(""),
              value_1002 = cards_2[count_991],
              value_1003 = value_1002.transactions && value_1002.transactions.length > 0 ? value_1002.transactions.map(tx => "\n                            <div style=\"display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #f0f0f0;\">\n                                <div style=\"display: flex; align-items: center; gap: 12px;\">\n                                    <div style=\"width: 40px; height: 40px; border-radius: 12px; background: #f4f4f5; display: flex; justify-content: center; align-items: center; color: #111; font-size: 14px;\">\n                                        <i class=\"" + (tx.isIncome ? "fas fa-arrow-down" : "fas fa-arrow-up") + "\" style=\"transform: " + (tx.isIncome ? "none" : "rotate(45deg)") + ";\"></i>\n                                    </div>\n                                    <div>\n                                        <div style=\"font-size: 15px; font-weight: 600; color: #111; margin-bottom: 2px;\">" + this.renderFriendPhoneLocalized(tx, "title", {
                id: "pay-title"
              }) + "</div>\n                                        <div style=\"font-size: 12px; color: #8e8e93; font-weight: 500;\">" + this.escapeHTML(this.formatFriendPhoneGeneratedAt(tx.generatedAt) || tx.time || "") + "</div>\n                                    </div>\n                                </div>\n                                <div style=\"font-size: 16px; font-weight: 700; color: #111;\">" + (tx.isIncome ? "+" : "") + tx.amount + "</div>\n                            </div>\n                        ").join("") : "<div style=\"padding: 30px; text-align: center; color: #8e8e93; font-size: 13px;\">暂无交易记录</div>",
              maxTranslateY = 50 + Math.max(0, cards_2.length - 2) * 20,
              containerHeight = maxTranslateY + 45 + 180;
            payContent.innerHTML = "\n                            <div style=\"padding:16px 20px 0;\"><label class=\"friend-phone-history-picker\"><span>生成记录</span><select id=\"friend-pay-history-select\">" + join_989 + "</select></label></div>\n                            <style>\n                            #pay-tx-container { animation: fadeUp 0.4s ease-out forwards; } \n                            @keyframes fadeUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }\n                            </style>\n                            <div style=\"padding: 20px;\">\n                                <div style=\"font-size: 34px; font-weight: 800; color: #111; margin-bottom: 25px; letter-spacing: -0.5px;\">Cards</div>\n                                <div id=\"pay-cards-container\" style=\"position: relative; width: 100%; height: " + containerHeight + "px; margin-bottom: 10px;\">\n                                    " + join_1001 + "\n                                </div>\n                            </div>\n                            \n                            <div style=\"padding: 0 20px 40px;\" id=\"pay-tx-container\">\n                                <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;\">\n                                    <div style=\"font-size: 20px; font-weight: 800; color: #111; letter-spacing: -0.5px;\">Transactions</div>\n                                    <div style=\"width: 32px; height: 32px; border-radius: 16px; background: #e5e5ea; display: flex; justify-content: center; align-items: center; color: #111; font-size: 14px;\">\n                                        <i class=\"fas fa-search\"></i>\n                                    </div>\n                                </div>\n                                <div style=\"background: #fff; border-radius: 20px; padding: 0 20px; \">\n                                    " + value_1003 + "\n                                </div>\n                            </div>\n                        ";
            const payHistorySelect = document.getElementById("friend-pay-history-select");
            if (payHistorySelect) payHistorySelect.onchange = () => {
              this._payHistoryIndex = Number(payHistorySelect.value) || 0;
              payBtn.onclick();
            };
            const container_5 = document.getElementById("pay-cards-container");
            container_5 && container_5.querySelectorAll(".pay-wallet-card").forEach(el_2 => {
              el_2.onclick = () => {
                const idx_14 = parseInt(el_2.getAttribute("data-idx"));
                idx_14 !== count_991 && (count_991 = idx_14, value_992());
              };
            });
          };
          value_992();
        }
      }
    });
    const payBackBtn = document.getElementById("friend-pay-back-btn");
    if (payBackBtn) payBackBtn.onclick = () => {
      if (window.closeView) window.closeView(payView);
    };
    const gameBtn = document.getElementById("friend-phone-app-game"),
      gameView = document.getElementById("friend-game-view");
    gameBtn && gameView && (gameBtn.onclick = () => {
      if (window.openView) window.openView(gameView);
      const gameContent = document.getElementById("friend-game-content");
      if (gameContent && friend_28.gameData) {
        const value_1023 = friend_28.gameData.recentGames ? friend_28.gameData.recentGames.map((g, value_1025) => {
          return "\n                        <div class=\"game-history-item-new\" data-idx=\"" + value_1025 + "\" style=\"background: #1c1c1e; border: 1px solid #2c2c2e; border-radius: 20px; padding: 18px; display: flex; gap: 16px; align-items: center; cursor: pointer;\">\n                            <div style=\"width: 56px; height: 56px; border-radius: 16px; background: #2c2c2e; display: flex; justify-content: center; align-items: center; font-size: 24px; color: #fff; pointer-events: none;\">\n                                <i class=\"" + (g.icon || "fas fa-gamepad") + "\"></i>\n                            </div>\n                            <div style=\"flex: 1; pointer-events: none;\">\n                                <div style=\"font-size: 17px; font-weight: 600; color: #fff; letter-spacing: 0.5px;\">" + this.escapeHTML(g.name || "未知游戏") + "</div>\n                                <div style=\"font-size: 13px; color: #8e8e93; margin-top: 4px;\">时长: " + g.hours + "</div>\n                                <div style=\"display: flex; align-items: center; gap: 10px; margin-top: 10px;\">\n                                    <div style=\"background: #3a3a3c; color: #fff; font-size: 11px; padding: 3px 10px; border-radius: 6px; font-weight: 600;\">" + this.escapeHTML(g.rank || "未定级") + "</div>\n                                    <div style=\"font-size: 12px; color: #8e8e93;\">胜率: <span style=\"color: #fff; font-weight: 500;\">" + g.winRate + "</span>" + this.renderFriendPhoneGeneratedTime(g, "is-dark") + "</div>\n                                </div>\n                            </div>\n                        </div>\n                    ";
        }).join("") : "";
        gameContent.innerHTML = "\n                        <div style=\"display: flex; align-items: center; gap: 15px; margin-bottom: 30px;\">\n                            <div style=\"width: 70px; height: 70px; border-radius: 50%; background: #1c1c1e; display: flex; justify-content: center; align-items: center; font-size: 30px; color: #fff; border: 2px solid #3a3a3c;\">\n                                <i class=\"fas fa-user\"></i>\n                            </div>\n                            <div>\n                                <div style=\"font-size: 20px; font-weight: 700; color: #fff; letter-spacing: 0.5px;\">" + this.escapeHTML(friend_28.gameData.playerName || "Player One") + "</div>\n                                <div style=\"font-size: 13px; color: #8e8e93; margin-top: 6px;\">游戏总时长: <span style=\"color: #fff; font-weight: 500;\">" + (friend_28.gameData.totalHours || "0 小时") + "</span></div>\n                            </div>\n                        </div>\n                        <div style=\"font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 15px;\">常玩的游戏</div>\n                        <div style=\"display: flex; flex-direction: column; gap: 15px;\">\n                            " + value_1023 + "\n                        </div>\n                    ";
        setTimeout(() => {
          try {
            const items_7 = gameContent.querySelectorAll(".game-history-item-new");
            items_7.forEach(value_1026 => {
              window.lovesApp.bindLongPress(value_1026, function () {
                const idx_15 = value_1026.getAttribute("data-idx"),
                  g_2 = friend_28.gameData.recentGames[idx_15];
                window.lovesApp.showDeleteConfirm(g_2.name, () => {
                  friend_28.gameData.recentGames.splice(idx_15, 1);
                  gameBtn.onclick();
                });
              });
              value_1026.addEventListener("click", function (event_1029) {
                event_1029.preventDefault();
                event_1029.stopPropagation();
                const attribute_1030 = this.getAttribute("data-idx"),
                  g_3 = friend_28.gameData.recentGames[attribute_1030];
                let content_9 = "";
                if (Array.isArray(g_3.matches)) {
                  content_9 += "<div style=\"background: #f4f4f5; border-radius: 24px; padding: 16px; margin-bottom: 16px;\">\n                                            <div style=\"font-weight: 700; color: #111; margin-bottom: 12px; padding-left: 4px; display: flex; align-items: center; gap: 8px;\"><i class=\"fas fa-gamepad\" style=\"color: #111;\"></i> 近期对局 (点击查看单局详情)</div>";
                  g_3.matches.forEach((m_9, value_1034) => {
                    const isWin = m_9.result === "胜利" || m_9.result === "Win",
                      bgColor = isWin ? "#111" : "#fff",
                      textColor = isWin ? "#fff" : "#8e8e93",
                      value_1038 = isWin ? "#fff" : "#111",
                      kdaBgColor = isWin ? "#333" : "#f4f4f5",
                      value_1040 = isWin ? "#fff" : "#111",
                      value_1041 = isWin ? "#fff" : "#111",
                      encodeURIComponent_1042 = encodeURIComponent(JSON.stringify(m_9));
                    content_9 += "\n                                            <div class=\"game-match-item\" data-match=\"" + encodeURIComponent_1042 + "\" style=\"display: flex; align-items: center; justify-content: space-between; background: " + bgColor + "; border: 1px solid #e5e5ea; border-radius: 16px; padding: 16px; margin-bottom: 10px; cursor: pointer;\">\n                                                <div style=\"display: flex; flex-direction: column; align-items: center; gap: 6px; width: 50px; pointer-events: none;\">\n                                                    <div style=\"width: 40px; height: 40px; border-radius: 50%; background: rgba(142,142,147,0.1); display: flex; justify-content: center; align-items: center; color: " + value_1041 + "; font-size: 16px;\">\n                                                        <i class=\"fas fa-user\"></i>\n                                                    </div>\n                                                    <div style=\"font-size: 11px; font-weight: 500; color: " + textColor + "; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; text-align: center;\">" + window.lovesApp.escapeHTML(m_9.hero || "我方") + "</div>\n                                                </div>\n                                                \n                                                <div style=\"display: flex; flex-direction: column; align-items: center; flex: 1; pointer-events: none;\">\n                                                    <div style=\"font-size: 18px; font-weight: 800; color: " + value_1038 + "; letter-spacing: 1px;\">" + m_9.result + "</div>\n                                                    <div style=\"font-size: 11px; color: #8e8e93; margin-top: 6px;\">" + window.lovesApp.escapeHTML(window.lovesApp.formatFriendPhoneGeneratedAt(m_9.generatedAt) || m_9.time || "") + "</div>\n                                                    <div style=\"font-size: 12px; font-weight: 700; color: " + value_1040 + "; margin-top: 8px; background: " + kdaBgColor + "; padding: 4px 10px; border-radius: 8px;\">KDA: " + (m_9.kda || "-/-/-") + "</div>\n                                                </div>\n\n                                                <div style=\"display: flex; flex-direction: column; align-items: center; gap: 6px; width: 50px; pointer-events: none;\">\n                                                    <div style=\"width: 40px; height: 40px; border-radius: 50%; background: rgba(142,142,147,0.1); display: flex; justify-content: center; align-items: center; color: " + value_1041 + "; font-size: 16px;\">\n                                                        <i class=\"fas fa-skull\"></i>\n                                                    </div>\n                                                    <div style=\"font-size: 11px; font-weight: 500; color: " + textColor + ";\">敌方</div>\n                                                </div>\n                                            </div>";
                  });
                  content_9 += "</div>";
                } else typeof g_3.matches === "string" && g_3.matches && (content_9 += "<div style=\"background: #f4f4f5; border-radius: 24px; padding: 16px; margin-bottom: 16px;\">\n                                            <div style=\"font-weight: 700; color: #111; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;\"><i class=\"fas fa-history\" style=\"color: #111;\"></i> 近期对局</div>\n                                            <div style=\"color: #333; line-height: 1.6; font-size: 14px;\">" + g_3.matches.replace(/\n/g, "<br>") + "</div>\n                                        </div>");
                g_3.innerThoughts && !Array.isArray(g_3.matches) && (content_9 += "<div style=\"background: #f4f4f5; border-radius: 24px; padding: 16px; margin-bottom: 16px; border-left: 4px solid #111;\">\n                                            <div style=\"font-weight: 700; color: #111; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;\"><i class=\"fas fa-headset\" style=\"color: #111;\"></i> 局内心声</div>\n                                            <div style=\"color: #333; line-height: 1.6; font-size: 14px; font-style: italic;\">“" + window.lovesApp.renderFriendPhoneLocalized(g_3, "innerThoughts", {
                  id: "game-thoughts"
                }) + "”</div>\n                                        </div>");
                g_3.postGameReflection && !Array.isArray(g_3.matches) && (content_9 += "<div style=\"background: #111; border-radius: 24px; padding: 16px; margin-bottom: 16px;\">\n                                            <div style=\"font-weight: 700; color: #fff; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;\"><i class=\"fas fa-clipboard-list\" style=\"color: #fff;\"></i> 局后复盘</div>\n                                            <div style=\"color: #ccc; line-height: 1.6; font-size: 14px;\">" + window.lovesApp.renderFriendPhoneLocalized(g_3, "postGameReflection", {
                  id: "game-reflection"
                }) + "</div>\n                                        </div>");
                if (!content_9) content_9 = "暂无更多数据";
                window.lovesApp.showDetailModal(g_3.name + " - 战绩列表", content_9);
                setTimeout(() => {
                  const matchItems = document.querySelectorAll(".game-match-item");
                  matchItems.forEach(value_1043 => {
                    value_1043.addEventListener("click", function () {
                      const matchStr = this.getAttribute("data-match");
                      if (matchStr) try {
                        const m_10 = JSON.parse(decodeURIComponent(matchStr));
                        let matchDetailContent = "";
                        matchDetailContent += "\n                                                            <div style=\"background: #f4f4f5; border-radius: 20px; padding: 16px; margin-bottom: 16px;\">\n                                                                <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;\">\n                                                                    <div style=\"font-weight: 800; font-size: 20px; color: " + (m_10.result === "胜利" || m_10.result === "Win" ? "#111" : "#8e8e93") + ";\">" + m_10.result + "</div>\n                                                                    <div style=\"font-weight: 700; color: #111; background: #e5e5ea; padding: 4px 10px; border-radius: 8px;\">KDA: " + (m_10.kda || "-/-/-") + "</div>\n                                                                </div>\n                                                                <div style=\"display: flex; align-items: center; gap: 8px; color: #8e8e93; font-size: 13px;\">\n                                                                    <i class=\"fas fa-clock\"></i> " + window.lovesApp.escapeHTML(window.lovesApp.formatFriendPhoneGeneratedAt(m_10.generatedAt) || m_10.time || "") + " | 英雄: " + window.lovesApp.escapeHTML(m_10.hero || "未知") + "\n                                                                </div>\n                                                            </div>\n                                                        ";
                        if (m_10.highlights && Array.isArray(m_10.highlights) && m_10.highlights.length > 0) {
                          let join_1047 = m_10.highlights.map(h => "\n                                                                <div style=\"display: flex; gap: 12px; margin-bottom: 8px; align-items: flex-start;\">\n                                                                    <div style=\"font-weight: 700; color: #111; font-size: 13px; background: #e5e5ea; padding: 2px 6px; border-radius: 4px; flex-shrink: 0;\">" + window.lovesApp.escapeHTML(window.lovesApp.formatFriendPhoneGeneratedAt(h.generatedAt) || "") + "</div>\n                                                                    <div style=\"color: #333; font-size: 14px; line-height: 1.4;\">" + window.lovesApp.renderFriendPhoneLocalized(h, "desc", {
                            id: "match-highlight"
                          }) + "</div>\n                                                                </div>\n                                                            ").join("");
                          matchDetailContent += "\n                                                                <div style=\"background: #fff; border: 1px solid #e5e5ea; border-radius: 20px; padding: 16px; margin-bottom: 16px;\">\n                                                                    <div style=\"font-weight: 700; color: #111; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;\"><i class=\"fas fa-bolt\" style=\"color: #111;\"></i> 高光时刻</div>\n                                                                    " + join_1047 + "\n                                                                </div>\n                                                            ";
                        }
                        m_10.innerThoughts && (matchDetailContent += "\n                                                                <div style=\"background: #f4f4f5; border-radius: 20px; padding: 16px; margin-bottom: 16px; border-left: 4px solid #111;\">\n                                                                    <div style=\"font-weight: 700; color: #111; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;\"><i class=\"fas fa-headset\" style=\"color: #111;\"></i> 局内心声</div>\n                                                                    <div style=\"color: #333; line-height: 1.6; font-size: 14px; font-style: italic;\">“" + window.lovesApp.renderFriendPhoneLocalized(m_10, "innerThoughts", {
                          id: "match-thoughts"
                        }) + "”</div>\n                                                                </div>\n                                                            ");
                        if (m_10.postGameReflection || m_10.thoughts) {
                          const fallback_6 = m_10.postGameReflection || m_10.thoughts;
                          matchDetailContent += "\n                                                                <div style=\"background: #111; border-radius: 20px; padding: 16px; margin-bottom: 16px;\">\n                                                                    <div style=\"font-weight: 700; color: #fff; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;\"><i class=\"fas fa-clipboard-list\" style=\"color: #fff;\"></i> 局后复盘</div>\n                                                                    <div style=\"color: #ccc; line-height: 1.6; font-size: 14px;\">" + window.lovesApp.renderFriendPhoneLocalized(m_10, m_10.postGameReflection ? "postGameReflection" : "thoughts", {
                            fallback: fallback_6,
                            id: "match-reflection"
                          }) + "</div>\n                                                                </div>\n                                                            ";
                        }
                        if (!matchDetailContent) matchDetailContent = "暂无详情数据";
                        window.lovesApp.showDetailModal("单局详情", matchDetailContent);
                      } catch (e_11) {
                        console.error("Parse match data error", e_11);
                      }
                    });
                  });
                }, 100);
              });
            });
          } catch (err_8) {
            console.error("Game bind error", err_8);
          }
        }, 50);
      } else gameContent && (gameContent.innerHTML = "<div style=\"padding: 50px 20px; text-align: center; color: #8e8e93; font-size: 15px;\">暂无游戏数据<br><span style=\"font-size: 13px; margin-top: 8px; display: inline-block;\">请在设置中生成</span></div>");
    });
    const gameBackBtn = document.getElementById("friend-game-back-btn");
    if (gameBackBtn) gameBackBtn.onclick = () => {
      if (window.closeView) window.closeView(gameView);
    };
  },
  showContactDetailModal: function (contactData) {
    try {
      const oldModals = document.querySelectorAll("#loves-contact-detail-modal");
      oldModals.forEach(value_1061 => value_1061.remove());
      const modal_3 = document.createElement("div");
      modal_3.id = "loves-contact-detail-modal";
      modal_3.style.position = "fixed";
      modal_3.style.top = "0";
      modal_3.style.left = "0";
      modal_3.style.width = "100%";
      modal_3.style.height = "100%";
      modal_3.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
      modal_3.style.zIndex = "2147483647";
      modal_3.style.display = "flex";
      modal_3.style.flexDirection = "column";
      modal_3.style.justifyContent = "flex-end";
      const element_1054 = document.createElement("div");
      element_1054.style.backgroundColor = "#f2f2f7";
      element_1054.style.borderTopLeftRadius = "24px";
      element_1054.style.borderTopRightRadius = "24px";
      element_1054.style.width = "100%";
      element_1054.style.maxHeight = "85%";
      element_1054.style.display = "flex";
      element_1054.style.flexDirection = "column";
      element_1054.style.pointerEvents = "auto";
      element_1054.style.boxShadow = "0 -4px 20px rgba(0,0,0,0.1)";
      const element_1055 = document.createElement("div");
      element_1055.style.width = "36px";
      element_1055.style.height = "5px";
      element_1055.style.backgroundColor = "#ccc";
      element_1055.style.borderRadius = "3px";
      element_1055.style.margin = "10px auto 15px";
      const element_1056 = document.createElement("div");
      element_1056.style.flex = "1";
      element_1056.style.overflowY = "auto";
      element_1056.style.padding = "0 20px 20px";
      const value_1057 = "\n                <div style=\"display: flex; flex-direction: column; align-items: center; margin-bottom: 25px;\">\n                    <div style=\"width: 80px; height: 80px; border-radius: 50%; background: #e5e5ea; display: flex; justify-content: center; align-items: center; color: #8e8e93; font-size: 34px; margin-bottom: 10px; \">\n                        <i class=\"fas fa-user\"></i>\n                    </div>\n                    <div style=\"font-size: 24px; font-weight: 600; color: #111;\">" + this.escapeHTML(this.getFriendPhoneChineseContactName(contactData)) + "</div>\n                </div>\n            ",
        text_1058 = "\n                <div style=\"display: flex; justify-content: space-between; gap: 10px; margin-bottom: 25px;\">\n                    <div style=\"flex: 1; background: #fff; padding: 12px 0; border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; color: #007aff;\">\n                        <i class=\"fas fa-comment\" style=\"font-size: 20px;\"></i>\n                        <span style=\"font-size: 11px; font-weight: 500;\">信息</span>\n                    </div>\n                    <div style=\"flex: 1; background: #fff; padding: 12px 0; border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; color: #007aff;\">\n                        <i class=\"fas fa-phone-alt\" style=\"font-size: 20px;\"></i>\n                        <span style=\"font-size: 11px; font-weight: 500;\">电话</span>\n                    </div>\n                    <div style=\"flex: 1; background: #fff; padding: 12px 0; border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; color: #007aff;\">\n                        <i class=\"fas fa-video\" style=\"font-size: 20px;\"></i>\n                        <span style=\"font-size: 11px; font-weight: 500;\">视频</span>\n                    </div>\n                    <div style=\"flex: 1; background: #fff; padding: 12px 0; border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; color: #007aff;\">\n                        <i class=\"fas fa-envelope\" style=\"font-size: 20px;\"></i>\n                        <span style=\"font-size: 11px; font-weight: 500;\">邮件</span>\n                    </div>\n                </div>\n            ",
        value_1059 = "\n                <div style=\"background: #fff; border-radius: 16px; padding: 16px; margin-bottom: 15px; display: flex; flex-direction: column; gap: 15px;\">\n                    <div style=\"display: flex; flex-direction: column; gap: 4px;\">\n                        <div style=\"font-size: 13px; color: #8e8e93;\">添加为联系人日期</div>\n                        <div style=\"font-size: 15px; font-weight: 500; color: #111;\">" + this.escapeHTML(this.formatFriendPhoneGeneratedAt(contactData.generatedAt) || "旧数据") + "</div>\n                    </div>\n                    <div style=\"height: 1px; background: #f2f2f7;\"></div>\n                    <div style=\"display: flex; flex-direction: column; gap: 4px;\">\n                        <div style=\"font-size: 13px; color: #8e8e93;\">近期通话时间</div>\n                        <div style=\"font-size: 15px; font-weight: 500; color: #111;\">" + this.escapeHTML(this.formatFriendPhoneGeneratedAt(contactData.generatedAt) || "旧数据") + "</div>\n                    </div>\n                </div>\n            ",
        value_1060 = "\n                <div style=\"background: #fff; border-radius: 16px; padding: 16px;\">\n                    <div style=\"font-size: 13px; color: #8e8e93; margin-bottom: 8px;\">通话原因</div>\n                    <div style=\"font-size: 15px; color: #333; line-height: 1.5; word-break: break-word;\">\n                        " + this.renderFriendPhoneLocalized(contactData, "callReason", {
          fallback: "暂无说明",
          id: "contact-reason"
        }) + "\n                    </div>\n                </div>\n            ";
      element_1056.innerHTML = value_1057 + text_1058 + value_1059 + value_1060;
      element_1054.appendChild(element_1055);
      element_1054.appendChild(element_1056);
      modal_3.addEventListener("click", event_1062 => {
        event_1062.target === modal_3 && (modal_3.style.opacity = "0", element_1054.style.transform = "translateY(100%)", setTimeout(() => modal_3.remove(), 250));
      });
      modal_3.style.opacity = "0";
      modal_3.style.transition = "opacity 0.25s ease";
      element_1054.style.transform = "translateY(100%)";
      element_1054.style.transition = "transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)";
      modal_3.appendChild(element_1054);
      document.body.appendChild(modal_3);
      this.bindFriendPhoneTranslationDelegation(modal_3);
      void modal_3.offsetWidth;
      modal_3.style.opacity = "1";
      element_1054.style.transform = "translateY(0)";
    } catch (e_12) {
      console.error("Error showing contact detail modal:", e_12);
    }
  },
  showCallDetailModal: function (callData_2) {
    try {
      const oldModals_2 = document.querySelectorAll("#loves-call-detail-modal");
      oldModals_2.forEach(value_1076 => value_1076.remove());
      const modal_4 = document.createElement("div");
      modal_4.id = "loves-call-detail-modal";
      modal_4.style.position = "fixed";
      modal_4.style.top = "0";
      modal_4.style.left = "0";
      modal_4.style.width = "100%";
      modal_4.style.height = "100%";
      modal_4.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
      modal_4.style.zIndex = "2147483647";
      modal_4.style.display = "flex";
      modal_4.style.flexDirection = "column";
      modal_4.style.justifyContent = "flex-end";
      let text_1066 = "语音通话",
        text_1067 = "#8e8e93";
      if (callData_2.type === "missed") {
        text_1066 = "未接来电";
        text_1067 = "#ff3b30";
      } else callData_2.type === "outgoing" ? text_1066 = "呼出通话" : text_1066 = "呼入通话";
      const fallback_7 = callData_2.dialogue || "无对话记录",
        element_1069 = document.createElement("div");
      element_1069.style.backgroundColor = "#f2f2f7";
      element_1069.style.borderTopLeftRadius = "24px";
      element_1069.style.borderTopRightRadius = "24px";
      element_1069.style.width = "100%";
      element_1069.style.maxHeight = "85%";
      element_1069.style.display = "flex";
      element_1069.style.flexDirection = "column";
      element_1069.style.pointerEvents = "auto";
      element_1069.style.boxShadow = "0 -4px 20px rgba(0,0,0,0.1)";
      const element_1070 = document.createElement("div");
      element_1070.style.width = "36px";
      element_1070.style.height = "5px";
      element_1070.style.backgroundColor = "#ccc";
      element_1070.style.borderRadius = "3px";
      element_1070.style.margin = "10px auto 15px";
      const element_1071 = document.createElement("div");
      element_1071.style.flex = "1";
      element_1071.style.overflowY = "auto";
      element_1071.style.padding = "0 20px 20px";
      const value_1072 = "\n                <div style=\"display: flex; flex-direction: column; align-items: center; margin-bottom: 25px;\">\n                    <div style=\"width: 80px; height: 80px; border-radius: 50%; background: #e5e5ea; display: flex; justify-content: center; align-items: center; color: #8e8e93; font-size: 34px; margin-bottom: 10px; \">\n                        <i class=\"fas fa-user\"></i>\n                    </div>\n                    <div style=\"font-size: 24px; font-weight: 600; color: #111;\">" + this.escapeHTML(this.getFriendPhoneChineseContactName(callData_2)) + "</div>\n                </div>\n            ",
        text_1073 = "\n                <div style=\"display: flex; justify-content: space-between; gap: 10px; margin-bottom: 25px;\">\n                    <div style=\"flex: 1; background: #fff; padding: 12px 0; border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; color: #007aff;\">\n                        <i class=\"fas fa-comment\" style=\"font-size: 20px;\"></i>\n                        <span style=\"font-size: 11px; font-weight: 500;\">信息</span>\n                    </div>\n                    <div style=\"flex: 1; background: #fff; padding: 12px 0; border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; color: #007aff;\">\n                        <i class=\"fas fa-phone-alt\" style=\"font-size: 20px;\"></i>\n                        <span style=\"font-size: 11px; font-weight: 500;\">电话</span>\n                    </div>\n                    <div style=\"flex: 1; background: #fff; padding: 12px 0; border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; color: #007aff;\">\n                        <i class=\"fas fa-video\" style=\"font-size: 20px;\"></i>\n                        <span style=\"font-size: 11px; font-weight: 500;\">视频</span>\n                    </div>\n                    <div style=\"flex: 1; background: #fff; padding: 12px 0; border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; color: #007aff;\">\n                        <i class=\"fas fa-envelope\" style=\"font-size: 20px;\"></i>\n                        <span style=\"font-size: 11px; font-weight: 500;\">邮件</span>\n                    </div>\n                </div>\n            ",
        value_1074 = "\n                <div style=\"background: #fff; border-radius: 16px; padding: 16px; margin-bottom: 15px;\">\n                    <div style=\"font-size: 15px; font-weight: 600; color: #111; margin-bottom: 8px;\">" + this.escapeHTML(this.formatFriendPhoneGeneratedAt(callData_2.generatedAt) || callData_2.time || "") + "</div>\n                    <div style=\"font-size: 14px; color: " + text_1067 + ";\">" + text_1066 + "</div>\n                </div>\n            ",
        value_1075 = "\n                <div style=\"background: #fff; border-radius: 16px; padding: 16px;\">\n                    <div style=\"font-size: 13px; font-weight: 600; color: #8e8e93; margin-bottom: 12px; text-transform: uppercase;\">录音转写记录</div>\n                    <div style=\"font-size: 15px; color: #333; line-height: 1.6; word-break: break-word;\">\n                        " + this.renderFriendPhoneLocalized(callData_2, "dialogue", {
          fallback: fallback_7,
          id: "call-dialogue"
        }) + "\n                    </div>\n                </div>\n            ";
      element_1071.innerHTML = value_1072 + text_1073 + value_1074 + value_1075;
      element_1069.appendChild(element_1070);
      element_1069.appendChild(element_1071);
      modal_4.addEventListener("click", event_1077 => {
        event_1077.target === modal_4 && (modal_4.style.opacity = "0", element_1069.style.transform = "translateY(100%)", setTimeout(() => modal_4.remove(), 250));
      });
      modal_4.style.opacity = "0";
      modal_4.style.transition = "opacity 0.25s ease";
      element_1069.style.transform = "translateY(100%)";
      element_1069.style.transition = "transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)";
      modal_4.appendChild(element_1069);
      document.body.appendChild(modal_4);
      this.bindFriendPhoneTranslationDelegation(modal_4);
      void modal_4.offsetWidth;
      modal_4.style.opacity = "1";
      element_1069.style.transform = "translateY(0)";
    } catch (e_13) {
      console.error("Error showing call detail modal:", e_13);
    }
  },
  showDetailModal: function (innerText_2, innerHTML_3) {
    try {
      const oldModals_3 = document.querySelectorAll("#loves-detail-modal");
      oldModals_3.forEach(value_1085 => value_1085.remove());
      const modal = document.createElement("div");
      modal.id = "loves-detail-modal";
      modal.style.position = "fixed";
      modal.style.top = "0";
      modal.style.left = "0";
      modal.style.width = "100%";
      modal.style.height = "100%";
      modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      modal.style.zIndex = "2147483647";
      modal.style.display = "flex";
      modal.style.justifyContent = "center";
      modal.style.alignItems = "center";
      const card_3 = document.createElement("div");
      card_3.style.backgroundColor = "#fff";
      card_3.style.borderRadius = "16px";
      card_3.style.width = "80%";
      card_3.style.maxWidth = "300px";
      card_3.style.padding = "20px";
      card_3.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
      card_3.style.position = "relative";
      card_3.style.maxHeight = "80%";
      card_3.style.overflowY = "auto";
      card_3.style.pointerEvents = "auto";
      const closeBtn_2 = document.createElement("i");
      closeBtn_2.className = "fas fa-times";
      closeBtn_2.style.position = "absolute";
      closeBtn_2.style.top = "15px";
      closeBtn_2.style.right = "15px";
      closeBtn_2.style.fontSize = "20px";
      closeBtn_2.style.color = "#8e8e93";
      closeBtn_2.style.cursor = "pointer";
      closeBtn_2.onclick = e_14 => {
        e_14.stopPropagation();
        modal.remove();
      };
      const titleEl_2 = document.createElement("div");
      titleEl_2.id = "loves-detail-modal-title";
      titleEl_2.style.fontSize = "20px";
      titleEl_2.style.fontWeight = "800";
      titleEl_2.style.color = "#111";
      titleEl_2.style.marginBottom = "18px";
      titleEl_2.style.paddingRight = "20px";
      titleEl_2.innerText = innerText_2;
      const contentEl = document.createElement("div");
      contentEl.id = "loves-detail-modal-content";
      contentEl.style.fontSize = "15px";
      contentEl.style.color = "#333";
      contentEl.style.lineHeight = "1.6";
      contentEl.innerHTML = innerHTML_3;
      card_3.appendChild(closeBtn_2);
      card_3.appendChild(titleEl_2);
      card_3.appendChild(contentEl);
      modal.appendChild(card_3);
      modal.addEventListener("click", event_1087 => {
        event_1087.target === modal && modal.remove();
      });
      document.body.appendChild(modal);
      this.bindFriendPhoneTranslationDelegation(modal);
    } catch (e_15) {
      console.error("Error showing detail modal:", e_15);
    }
  },
  showBrowserDetailModal: function (title_3, content_10, isDark = false, record_20 = null) {
    try {
      const oldModals_4 = document.querySelectorAll("#loves-browser-detail-modal");
      oldModals_4.forEach(value_1109 => value_1109.remove());
      const modal_5 = document.createElement("div");
      modal_5.id = "loves-browser-detail-modal";
      modal_5.style.position = "fixed";
      modal_5.style.top = "0";
      modal_5.style.left = "0";
      modal_5.style.width = "100%";
      modal_5.style.height = "100%";
      modal_5.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      modal_5.style.zIndex = "2147483647";
      modal_5.style.display = "flex";
      modal_5.style.flexDirection = "column";
      modal_5.style.justifyContent = "flex-end";
      const backgroundColor_2 = isDark ? "#000" : "#f4f4f5",
        backgroundColor_3 = isDark ? "#1c1c1e" : "#fff",
        color_3 = isDark ? "#fff" : "#111",
        color_2 = isDark ? "#ccc" : "#333",
        borderColor_2 = isDark ? "transparent" : "rgba(0,0,0,0.05)",
        card_4 = document.createElement("div");
      card_4.style.backgroundColor = backgroundColor_2;
      card_4.style.borderTopLeftRadius = "24px";
      card_4.style.borderTopRightRadius = "24px";
      card_4.style.width = "100%";
      card_4.style.height = "92%";
      card_4.style.display = "flex";
      card_4.style.flexDirection = "column";
      card_4.style.pointerEvents = "auto";
      card_4.style.boxShadow = "0 -4px 24px rgba(0,0,0,0.1)";
      const header = document.createElement("div");
      header.style.height = "54px";
      header.style.display = "flex";
      header.style.alignItems = "center";
      header.style.justifyContent = "space-between";
      header.style.padding = "0 20px";
      header.style.backgroundColor = backgroundColor_2;
      header.style.borderBottom = "1px solid " + borderColor_2;
      header.style.borderTopLeftRadius = "24px";
      header.style.borderTopRightRadius = "24px";
      header.style.flexShrink = "0";
      const doneBtn = document.createElement("div");
      doneBtn.innerText = "完成";
      doneBtn.style.color = color_3;
      doneBtn.style.fontSize = "16px";
      doneBtn.style.fontWeight = "600";
      doneBtn.style.cursor = "pointer";
      doneBtn.onclick = () => {
        modal_5.style.opacity = "0";
        card_4.style.transform = "translateY(100%)";
        setTimeout(() => modal_5.remove(), 250);
      };
      const headerDomain = document.createElement("div");
      headerDomain.style.display = "flex";
      headerDomain.style.alignItems = "center";
      headerDomain.style.justifyContent = "center";
      headerDomain.style.gap = "6px";
      headerDomain.style.fontSize = "13px";
      headerDomain.style.fontWeight = "500";
      headerDomain.style.color = "#8e8e93";
      headerDomain.style.flex = "1";
      headerDomain.innerHTML = "<i class=\"fas fa-lock\" style=\"font-size: 10px;\"></i> search.com";
      const shareBtn = document.createElement("div");
      shareBtn.innerHTML = "<i class=\"fas fa-share-square\"></i>";
      shareBtn.style.color = color_3;
      shareBtn.style.fontSize = "20px";
      header.appendChild(doneBtn);
      header.appendChild(headerDomain);
      header.appendChild(shareBtn);
      const contentWrap = document.createElement("div");
      contentWrap.style.flex = "1";
      contentWrap.style.overflowY = "auto";
      contentWrap.style.padding = "0";
      contentWrap.style.backgroundColor = backgroundColor_2;
      const pagePaper = document.createElement("div");
      pagePaper.style.backgroundColor = backgroundColor_3;
      pagePaper.style.margin = "20px";
      pagePaper.style.borderRadius = "24px";
      pagePaper.style.padding = "30px 24px";
      pagePaper.style.boxShadow = isDark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.03)";
      const titleEl_3 = document.createElement("h1");
      titleEl_3.style.fontSize = "24px";
      titleEl_3.style.fontWeight = "800";
      titleEl_3.style.color = color_3;
      titleEl_3.style.marginBottom = "24px";
      titleEl_3.style.lineHeight = "1.4";
      titleEl_3.style.letterSpacing = "-0.5px";
      titleEl_3.innerHTML = record_20 ? this.renderFriendPhoneLocalized(record_20, "title", {
        id: "browser-title"
      }) : this.escapeHTML(title_3);
      const textEl = document.createElement("div");
      textEl.style.fontSize = "16px";
      textEl.style.color = color_2;
      textEl.style.lineHeight = "1.8";
      textEl.style.wordBreak = "break-word";
      textEl.innerHTML = record_20 ? this.renderFriendPhoneLocalized(record_20, "content", {
        id: "browser-content"
      }) : this.escapeHTML(content_10).replace(/\n/g, "<br>");
      const generatedTime = this.renderFriendPhoneGeneratedTime(record_20, isDark ? "is-dark" : "");
      pagePaper.appendChild(titleEl_3);
      pagePaper.appendChild(textEl);
      if (generatedTime) textEl.insertAdjacentHTML("afterend", generatedTime);
      contentWrap.appendChild(pagePaper);
      card_4.appendChild(header);
      card_4.appendChild(contentWrap);
      modal_5.addEventListener("click", event_1110 => {
        event_1110.target === modal_5 && (modal_5.style.opacity = "0", card_4.style.transform = "translateY(100%)", setTimeout(() => modal_5.remove(), 250));
      });
      modal_5.style.opacity = "0";
      modal_5.style.transition = "opacity 0.25s ease";
      card_4.style.transform = "translateY(100%)";
      card_4.style.transition = "transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)";
      modal_5.appendChild(card_4);
      document.body.appendChild(modal_5);
      this.bindFriendPhoneTranslationDelegation(modal_5);
      void modal_5.offsetWidth;
      modal_5.style.opacity = "1";
      card_4.style.transform = "translateY(0)";
    } catch (e_16) {
      console.error("Error showing browser detail modal:", e_16);
    }
  },
  getCanonicalFriendForPhone: function (friend_29) {
    if (!friend_29?.id) return friend_29;
    return (window.imData?.friends || []).find(item_22 => String(item_22?.id) === String(friend_29.id)) || friend_29;
  },
  ensureFriendPhoneMessagesLoaded: async function (friend_30) {
    const canonicalFriend = this.getCanonicalFriendForPhone(friend_30);
    return window.imApp?.ensureFriendMessagesLoaded && (await window.imApp.ensureFriendMessagesLoaded(canonicalFriend)), canonicalFriend;
  },
  getFriendPhoneUserContextMessages: function (friend_31, limit_3 = 10) {
    const canonicalMessages = Array.isArray(friend_31?.messages) ? friend_31.messages : [],
      legacyMessages = Array.isArray(window.imData?.messages?.[friend_31?.id]) ? window.imData.messages[friend_31.id] : [],
      source_6 = canonicalMessages.length ? canonicalMessages : legacyMessages;
    return source_6.slice(-Math.max(1, Number(limit_3) || 10));
  },
  getFriendPhoneMessageText: function (message_3) {
    const directText = message_3?.content ?? message_3?.text ?? message_3?.transcript ?? message_3?.voiceTranscript;
    if (String(directText ?? "").trim()) return String(directText).trim();
    const typeLabels = {
      image: "[图片]",
      sticker: "[表情]",
      voice: "[语音]",
      voice_message: "[语音]",
      video: "[视频]",
      file: "[文件]",
      payment: "[转账]",
      transfer: "[转账]",
      location: "[位置]"
    };
    return typeLabels[message_3?.type] || "[特殊消息]";
  },
  isFriendPhoneUserMessage: function (message_4) {
    return message_4?.role === "user" || message_4?.sender === "me" || message_4?.sender === "user";
  },
  close: function () {
    if (this.view) {
      this.closeCharSwitch();
      if (window.closeView) window.closeView(this.view);else this.view.classList.remove("active");
      const lovesDetailAreaElement_1122 = document.getElementById("loves-detail-area");
      if (lovesDetailAreaElement_1122) lovesDetailAreaElement_1122.style.display = "none";
    }
  }
};
(window.u2OnStorageReady || (callback_2 => document.addEventListener("DOMContentLoaded", callback_2)))(() => {
  setTimeout(() => {
    window.lovesApp && window.lovesApp.init();
  }, 100);
});
