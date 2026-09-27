(function initImessageDataUtils(root, value_3) {
  const imDataUtils_2 = value_3();
  if (typeof module === "object" && module.exports) module.exports = imDataUtils_2;
  if (typeof window !== "undefined") window.imDataUtils = imDataUtils_2;else {
    if (root) root.imDataUtils = imDataUtils_2;
  }
})(typeof globalThis !== "undefined" ? globalThis : null, function createImessageDataUtils() {
  function pad2(value_4) {
    return String(value_4).padStart(2, "0");
  }
  function normalizeRoundLimit_2(value_5, fallback = 30) {
    const numeric = Number(value_5);
    return Number.isFinite(numeric) && numeric > 0 ? Math.min(999, Math.max(1, Math.round(numeric))) : fallback;
  }
  function normalizeMessageLimit_2(value_6, fallback_2 = 30) {
    return normalizeRoundLimit_2(value_6, fallback_2);
  }
  function normalizeChatMessageRange_2(minValue, maxValue, fallbackMin = 2, fallbackMax = 8) {
    const clamp = (value_7, fallback_3) => {
        const numeric_2 = Number(value_7);
        return Number.isFinite(numeric_2) ? Math.min(20, Math.max(1, Math.round(numeric_2))) : fallback_3;
      },
      min_2 = clamp(minValue, clamp(fallbackMin, 2)),
      max_2 = Math.max(min_2, clamp(maxValue, clamp(fallbackMax, 8)));
    return {
      min: min_2,
      max: max_2
    };
  }
  const items_8 = ["Asia/Shanghai", "Asia/Hong_Kong", "Asia/Taipei", "Asia/Tokyo", "Asia/Seoul", "Asia/Singapore", "Asia/Bangkok", "Asia/Kolkata", "Asia/Dubai", "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Moscow", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "America/Toronto", "America/Vancouver", "America/Sao_Paulo", "Australia/Sydney", "Pacific/Auckland", "UTC"],
    options = {
      上海: "Asia/Shanghai",
      shanghai: "Asia/Shanghai",
      北京: "Asia/Shanghai",
      beijing: "Asia/Shanghai",
      广州: "Asia/Shanghai",
      guangzhou: "Asia/Shanghai",
      深圳: "Asia/Shanghai",
      shenzhen: "Asia/Shanghai",
      成都: "Asia/Shanghai",
      chengdu: "Asia/Shanghai",
      重庆: "Asia/Shanghai",
      chongqing: "Asia/Shanghai",
      香港: "Asia/Hong_Kong",
      hongkong: "Asia/Hong_Kong",
      澳门: "Asia/Macau",
      macau: "Asia/Macau",
      台北: "Asia/Taipei",
      taipei: "Asia/Taipei",
      东京: "Asia/Tokyo",
      tokyo: "Asia/Tokyo",
      大阪: "Asia/Tokyo",
      osaka: "Asia/Tokyo",
      首尔: "Asia/Seoul",
      seoul: "Asia/Seoul",
      新加坡: "Asia/Singapore",
      singapore: "Asia/Singapore",
      曼谷: "Asia/Bangkok",
      bangkok: "Asia/Bangkok",
      孟买: "Asia/Kolkata",
      mumbai: "Asia/Kolkata",
      新德里: "Asia/Kolkata",
      delhi: "Asia/Kolkata",
      迪拜: "Asia/Dubai",
      dubai: "Asia/Dubai",
      伦敦: "Europe/London",
      london: "Europe/London",
      巴黎: "Europe/Paris",
      paris: "Europe/Paris",
      柏林: "Europe/Berlin",
      berlin: "Europe/Berlin",
      莫斯科: "Europe/Moscow",
      moscow: "Europe/Moscow",
      纽约: "America/New_York",
      newyork: "America/New_York",
      芝加哥: "America/Chicago",
      chicago: "America/Chicago",
      丹佛: "America/Denver",
      denver: "America/Denver",
      洛杉矶: "America/Los_Angeles",
      losangeles: "America/Los_Angeles",
      旧金山: "America/Los_Angeles",
      sanfrancisco: "America/Los_Angeles",
      多伦多: "America/Toronto",
      toronto: "America/Toronto",
      温哥华: "America/Vancouver",
      vancouver: "America/Vancouver",
      圣保罗: "America/Sao_Paulo",
      saopaulo: "America/Sao_Paulo",
      悉尼: "Australia/Sydney",
      sydney: "Australia/Sydney",
      墨尔本: "Australia/Melbourne",
      melbourne: "Australia/Melbourne",
      奥克兰: "Pacific/Auckland",
      auckland: "Pacific/Auckland"
    },
    options_9 = {
      中国: "Asia/Shanghai",
      china: "Asia/Shanghai",
      cn: "Asia/Shanghai",
      日本: "Asia/Tokyo",
      japan: "Asia/Tokyo",
      jp: "Asia/Tokyo",
      韩国: "Asia/Seoul",
      南韩: "Asia/Seoul",
      korea: "Asia/Seoul",
      kr: "Asia/Seoul",
      新加坡: "Asia/Singapore",
      singapore: "Asia/Singapore",
      sg: "Asia/Singapore",
      英国: "Europe/London",
      联合王国: "Europe/London",
      uk: "Europe/London",
      unitedkingdom: "Europe/London",
      法国: "Europe/Paris",
      france: "Europe/Paris",
      fr: "Europe/Paris",
      德国: "Europe/Berlin",
      germany: "Europe/Berlin",
      de: "Europe/Berlin",
      印度: "Asia/Kolkata",
      india: "Asia/Kolkata",
      阿联酋: "Asia/Dubai",
      uae: "Asia/Dubai",
      泰国: "Asia/Bangkok",
      thailand: "Asia/Bangkok",
      新西兰: "Pacific/Auckland",
      newzealand: "Pacific/Auckland"
    };
  function handleAction_10(value_65) {
    return String(value_65 || "").trim().toLocaleLowerCase().replace(/[\s._,'’\-\/]+/g, "");
  }
  const value_11 = new Map(),
    value_12 = new Map();
  let items_13 = null,
    auxiliaryTypes = null;
  function handleAction_15(value_66, value_67, value_68, value_69) {
    if (!value_66.has(value_67) && value_66.size >= value_69) value_66["delete"](value_66.keys().next().value);
    return value_66.set(value_67, value_68), value_68;
  }
  function isValidTimeZone_2(value_70) {
    const timeZone_2 = String(value_70 || "").trim();
    if (!timeZone_2) return false;
    if (value_11.has(timeZone_2)) return value_11.get(timeZone_2);
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: timeZone_2
      }).format(0), handleAction_15(value_11, timeZone_2, true, 512);
    } catch (value_72) {
      return handleAction_15(value_11, timeZone_2, false, 512);
    }
  }
  function getSupportedTimeZones_2() {
    if (items_13) return items_13.slice();
    let items_73 = [];
    try {
      if (typeof Intl.supportedValuesOf === "function") items_73 = Intl.supportedValuesOf("timeZone");
    } catch (value_75) {
      items_73 = [];
    }
    const value_74 = new Set(items_73);
    return items_13 = Array.from(new Set([...items_73, ...items_8])).filter(value_76 => value_74.has(value_76) || isValidTimeZone_2(value_76)).sort(), items_13.slice();
  }
  function resolveLocationTimeZone_2(value_77, value_78) {
    const handleAction_10_79 = handleAction_10(value_78),
      handleAction_10_80 = handleAction_10(value_77);
    if (!handleAction_10_79 && !handleAction_10_80) return "";
    if (handleAction_10_79 && options[handleAction_10_79] && isValidTimeZone_2(options[handleAction_10_79])) return options[handleAction_10_79];
    if (handleAction_10_79) {
      !auxiliaryTypes && (auxiliaryTypes = new Map(), getSupportedTimeZones_2().forEach(value_82 => {
        const messageType = handleAction_10(value_82.split("/").pop());
        if (!auxiliaryTypes.has(messageType)) auxiliaryTypes.set(messageType, value_82);
      }));
      const result = auxiliaryTypes.get(handleAction_10_79);
      if (result) return result;
    }
    const value_81 = options_9[handleAction_10_80] || "";
    return isValidTimeZone_2(value_81) ? value_81 : "";
  }
  function normalizeLocationProfile_2(schedule) {
    const source_2 = schedule && typeof schedule === "object" ? schedule : {},
      value_86 = schedule_2 => {
        const source_3 = schedule_2 && typeof schedule_2 === "object" ? schedule_2 : {},
          country_2 = String(source_3.country || "").trim().slice(0, 80),
          city_2 = String(source_3.city || "").trim().slice(0, 80),
          trim_94 = String(source_3.timeZone || "").trim(),
          timeZone_3 = isValidTimeZone_2(trim_94) ? trim_94 : resolveLocationTimeZone_2(country_2, city_2);
        return {
          country: country_2,
          city: city_2,
          timeZone: timeZone_3
        };
      },
      char_2 = value_86(source_2.char),
      user_2 = value_86(source_2.user),
      value_89 = !!(char_2.country && char_2.city && char_2.timeZone && user_2.country && user_2.city && user_2.timeZone);
    return {
      char: char_2,
      user: user_2,
      timeDifferenceEnabled: value_89 && source_2.timeDifferenceEnabled === true
    };
  }
  function getTimeZoneDateParts_2(value_96, value_97) {
    const value_98 = new Date(Number(value_96));
    if (Number.isNaN(value_98.getTime()) || !isValidTimeZone_2(value_97)) return null;
    const timeZone_4 = String(value_97).trim();
    let result_100 = value_12.get(timeZone_4);
    !result_100 && (result_100 = handleAction_15(value_12, timeZone_4, new Intl.DateTimeFormat("zh-CN", {
      timeZone: timeZone_4,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23"
    }), 48));
    const reduce_101 = result_100.formatToParts(value_98).reduce((value_102, value_103) => {
      if (value_103.type !== "literal") value_102[value_103.type] = value_103.value;
      return value_102;
    }, {});
    return reduce_101;
  }
  function formatDateTimeInTimeZone_2(value_8, fallback_4, value_106 = {}) {
    const handleAction_20_107 = getTimeZoneDateParts_2(value_8, fallback_4);
    if (!handleAction_20_107) return "";
    const value_108 = value_106.includeSeconds === false ? "" : ":" + handleAction_20_107.second,
      value_109 = value_106.includeWeekday === false ? "" : " " + handleAction_20_107.weekday;
    return handleAction_20_107.year + "年" + Number(handleAction_20_107.month) + "月" + Number(handleAction_20_107.day) + "日" + value_109 + " " + handleAction_20_107.hour + ":" + handleAction_20_107.minute + value_108;
  }
  function getTimeZoneOffsetMinutes_2(value_9, fallback_5) {
    const lastOfflineMeeting = getTimeZoneDateParts_2(value_9, fallback_5);
    if (!lastOfflineMeeting) return null;
    const uTC = Date.UTC(Number(lastOfflineMeeting.year), Number(lastOfflineMeeting.month) - 1, Number(lastOfflineMeeting.day), Number(lastOfflineMeeting.hour), Number(lastOfflineMeeting.minute), Number(lastOfflineMeeting.second));
    return Math.round((uTC - Number(value_9)) / 60000);
  }
  function formatUtcOffset_2(value_113) {
    const number = Number(value_113);
    if (!Number.isFinite(number)) return "UTC?";
    const value_114 = number >= 0 ? "+" : "-",
      abs_115 = Math.abs(number);
    return "UTC" + value_114 + Math.floor(abs_115 / 60) + ":" + pad2(abs_115 % 60);
  }
  function findMessageByReference_2(value_116, value_117, value_118) {
    const source_4 = Array.isArray(value_116) ? value_116 : [],
      id_2 = String(value_117 || "").trim(),
      timestamp_2 = String(value_118 || "").trim();
    if (id_2) {
      const byId = source_4.find(message_2 => message_2 && String(message_2.id || "") === id_2);
      if (byId) return byId;
    }
    return timestamp_2 ? source_4.find(message_3 => message_3 && String(message_3.timestamp || "") === timestamp_2) || null : null;
  }
  function normalizeChatLanguage_2(value_125) {
    const originalLanguage = String(value_125 || "").trim(),
      language_2 = originalLanguage.toLowerCase();
    if (!language_2 || ["zh", "cn", "zh-cn"].includes(language_2)) return "zh";
    if (["ko", "kr"].includes(language_2)) return "ko";
    if (["ja", "jp"].includes(language_2)) return "ja";
    if (language_2 === "en") return "en";
    if (language_2 === "fr") return "fr";
    if (["yue", "cantonese", "粤语", "廣東話"].includes(language_2)) return "yue";
    if (["ru", "russian", "俄语", "俄語"].includes(language_2)) return "ru";
    return originalLanguage || "zh";
  }
  function getChatLanguageName_2(value_10) {
    const language_3 = normalizeChatLanguage_2(value_10);
    return {
      zh: "Chinese",
      ko: "Korean",
      ja: "Japanese",
      en: "English",
      fr: "French",
      yue: "Cantonese",
      ru: "Russian"
    }[language_3] || language_3 || "Chinese";
  }
  function normalizeLocalizedContent_2(value_13, value_131, options_2 = {}) {
    const chatLanguage_25 = normalizeChatLanguage_2(value_131),
      source_5 = value_13 && typeof value_13 === "object" ? value_13 : {
        text: value_13
      },
      text_2 = String(source_5.text ?? source_5.content ?? "").trim();
    let translation_2 = String(source_5.translation ?? source_5.translationZh ?? source_5.trans ?? "").trim();
    if (!text_2) return null;
    if (chatLanguage_25 === "zh") translation_2 = "";
    if (chatLanguage_25 !== "zh" && options_2.requireTranslation !== false && !translation_2) return null;
    return {
      text: text_2,
      translation: translation_2,
      language: chatLanguage_25
    };
  }
  function hasLocalizedTranslation_2(value_15) {
    return !!String(value_15?.translation ?? value_15?.translationZh ?? value_15?.trans ?? "").trim();
  }
  function buildLocalizedJsonContract_2(value_137, value_138 = "content") {
    const chatLanguage_25_139 = normalizeChatLanguage_2(value_137),
      chatLanguageName_26 = getChatLanguageName_2(chatLanguage_25_139);
    if (chatLanguage_25_139 === "zh") return value_138 + ".text must be natural Simplified Chinese and " + value_138 + ".translation must be an empty string.";
    return value_138 + ".text must be written only in " + chatLanguageName_26 + "; " + value_138 + ".translation is mandatory and must be a natural accurate Simplified Chinese translation of that text.";
  }
  function parseBilingualDialogue_2(value_140, value_141) {
    const original_2 = String(value_140 || "").trim();
    if (!original_2) return {
      original: "",
      translation: ""
    };
    if (normalizeChatLanguage_2(value_141) === "zh") return {
      original: original_2,
      translation: ""
    };
    const match_2 = original_2.match(/^([\s\S]+)（([^（）]*[\u3400-\u9fff][^（）]*)）$/);
    if (!match_2) return {
      original: original_2,
      translation: ""
    };
    const original_3 = String(match_2[1] || "").trim(),
      translation_3 = String(match_2[2] || "").trim();
    if (!original_3 || !translation_3) return {
      original: original_2,
      translation: ""
    };
    return {
      original: original_3,
      translation: translation_3
    };
  }
  function normalizeGroupChatContexts_2(value_146, fallbackMessageLimit = 30) {
    const seenGroupIds = new Set();
    return (Array.isArray(value_146) ? value_146 : []).map(context => {
      if (!context || typeof context !== "object") return null;
      const groupId_2 = String(context.groupId ?? "").trim();
      if (!groupId_2 || seenGroupIds.has(groupId_2)) return null;
      return seenGroupIds.add(groupId_2), {
        groupId: groupId_2,
        messageLimit: normalizeMessageLimit_2(context.messageLimit, fallbackMessageLimit)
      };
    }).filter(Boolean);
  }
  function getRecentPublicGroupMessages_2(value_151, messageLimit_2 = 30) {
    const items_153 = Array.isArray(value_151) ? value_151 : [],
      messageLimit_6 = normalizeMessageLimit_2(messageLimit_2, 30),
      publicMessages = items_153.filter(value_156 => value_156?.excludedFromContext !== true && value_156?.noticeKind !== "group_private_to_user" && value_156?.noticeKind !== "group_friend_private_chat"),
      selectedMessages_2 = publicMessages.slice(-messageLimit_6);
    return {
      messageLimit: messageLimit_6,
      availableMessageCount: publicMessages.length,
      selectedMessageCount: selectedMessages_2.length,
      selectedMessages: selectedMessages_2
    };
  }
  function getRecentUserRounds_2(value_157, roundLimit_2 = 5) {
    const safeMessages = Array.isArray(value_157) ? value_157 : [],
      limit = normalizeRoundLimit_2(roundLimit_2, 5),
      userMessageIndexes = [];
    safeMessages.forEach((message_4, index_2) => {
      if (message_4?.role === "user") userMessageIndexes.push(index_2);
    });
    const selectedRounds_2 = Math.min(limit, userMessageIndexes.length),
      startIndex_2 = selectedRounds_2 > 0 ? userMessageIndexes[userMessageIndexes.length - selectedRounds_2] : safeMessages.length,
      selectedMessages_3 = selectedRounds_2 > 0 ? safeMessages.slice(startIndex_2) : [];
    return {
      roundLimit: limit,
      availableRounds: userMessageIndexes.length,
      selectedRounds: selectedRounds_2,
      selectedMessageCount: selectedMessages_3.length,
      startIndex: startIndex_2,
      selectedMessages: selectedMessages_3
    };
  }
  function parseMessageTimestamp(value_16) {
    if (value_16 === null || value_16 === undefined || value_16 === "") return null;
    const text_3 = typeof value_16 === "string" ? value_16.trim() : value_16;
    let timestamp_3 = typeof text_3 === "number" ? text_3 : /^\d+(?:\.\d+)?$/.test(text_3) ? Number(text_3) : NaN;
    Number.isFinite(timestamp_3) && timestamp_3 > 0 && timestamp_3 < 100000000000 && (timestamp_3 *= 1000);
    const date_2 = Number.isFinite(timestamp_3) ? new Date(timestamp_3) : new Date(text_3);
    return Number.isNaN(date_2.getTime()) ? null : date_2;
  }
  function formatMemoryEventTime_2(messages, fallbackTimestamp = Date.now()) {
    const dates = (Array.isArray(messages) ? messages : []).map(message_5 => parseMessageTimestamp(message_5?.timestamp)).filter(Boolean).sort((left, right) => left.getTime() - right.getTime()),
      fallbackDate = parseMessageTimestamp(fallbackTimestamp) || new Date(),
      start = dates[0] || fallbackDate,
      end = dates[dates.length - 1] || start,
      value_175 = value_180 => value_180.getFullYear() + "年" + pad2(value_180.getMonth() + 1) + "月" + pad2(value_180.getDate()) + "日",
      value_176 = value_181 => pad2(value_181.getHours()) + ":" + pad2(value_181.getMinutes()),
      startText = value_175(start) + " " + value_176(start),
      endText = value_175(end) + " " + value_176(end);
    if (startText === endText) return startText;
    if (value_175(start) === value_175(end)) return startText + "至" + value_176(end);
    return startText + "至" + endText;
  }
  function normalizeLocalDateTime(value_182) {
    const text_4 = String(value_182 || "").trim();
    if (!text_4) return "";
    const match_3 = text_4.match(/^(\d{4}-\d{2}-\d{2})[T\s](\d{2}:\d{2})/);
    return match_3 ? match_3[1] + "T" + match_3[2] : "";
  }
  function splitLocalDateTime(value_17) {
    const normalized = normalizeLocalDateTime(value_17);
    if (!normalized) return {
      date: "",
      time: ""
    };
    const [date_3, time_2] = normalized.split("T");
    return {
      date: date_3,
      time: time_2
    };
  }
  function handleAction_37(value_189) {
    const handleAction_35_190 = normalizeLocalDateTime(value_189);
    if (!handleAction_35_190) return "";
    const date_4 = new Date(handleAction_35_190);
    if (Number.isNaN(date_4.getTime())) return "";
    return date_4.getFullYear() + "年" + pad2(date_4.getMonth() + 1) + "月" + pad2(date_4.getDate()) + "日 " + pad2(date_4.getHours()) + ":" + pad2(date_4.getMinutes());
  }
  function normalizeScheduleEvent_2(value_192, value_193 = 0) {
    if (!value_192 || typeof value_192 !== "object") return null;
    const source_6 = {
        ...value_192
      },
      name_2 = String(source_6.name || source_6.title || "未命名行程").trim() || "未命名行程",
      recurrence_2 = String(source_6.recurrence || source_6.repeat || "").trim() === "daily" ? "daily" : "once",
      source_7 = String(source_6.source || "").trim() || "manual";
    let rawTime_2 = recurrence_2 === "daily" ? "" : normalizeLocalDateTime(source_6.rawTime || source_6.startAt);
    const rawParts = splitLocalDateTime(rawTime_2);
    let date_5 = recurrence_2 === "daily" ? "" : String(source_6.date || rawParts.date || "").trim(),
      startTime_2 = String(source_6.startTime || rawParts.time || "").trim().slice(0, 5);
    recurrence_2 !== "daily" && !rawTime_2 && /^\d{4}-\d{2}-\d{2}$/.test(date_5) && /^\d{2}:\d{2}$/.test(startTime_2) && (rawTime_2 = date_5 + "T" + startTime_2);
    if (recurrence_2 !== "daily" && (!date_5 || !startTime_2)) {
      const derived = splitLocalDateTime(rawTime_2);
      date_5 = date_5 || derived.date;
      startTime_2 = startTime_2 || derived.time;
    }
    const sourceEndText = String(source_6.endAt || source_6.endTime || "").trim();
    let endAt_2 = recurrence_2 === "daily" ? "" : normalizeLocalDateTime(sourceEndText),
      endTime_2 = /^\d{2}:\d{2}$/.test(sourceEndText) ? sourceEndText : splitLocalDateTime(endAt_2).time;
    if (recurrence_2 !== "daily" && !endAt_2 && date_5 && endTime_2) endAt_2 = date_5 + "T" + endTime_2;
    if (!endTime_2) endTime_2 = startTime_2;
    const handleAction_37_205 = handleAction_37(rawTime_2),
      handleAction_37_206 = handleAction_37(endAt_2),
      time_3 = recurrence_2 === "daily" && startTime_2 ? "每天 " + startTime_2 + (endTime_2 && endTime_2 !== startTime_2 ? " - " + endTime_2 : "") : handleAction_37_205 ? handleAction_37_206 && handleAction_37_206 !== handleAction_37_205 ? handleAction_37_205 + " - " + handleAction_37_206 : handleAction_37_205 : String(source_6.time || startTime_2 || "").trim();
    return {
      ...source_6,
      id: source_6.id != null ? source_6.id : "schedule-" + Date.now() + "-" + value_193,
      name: name_2,
      title: String(source_6.title || name_2).trim() || name_2,
      date: date_5,
      startTime: startTime_2,
      endTime: endTime_2,
      time: time_3,
      rawTime: rawTime_2,
      endAt: endAt_2,
      location: String(source_6.location || source_6.description || "").trim(),
      source: source_7,
      recurrence: recurrence_2,
      timestamp: Number(source_6.timestamp) || Date.now()
    };
  }
  function normalizeSchedule_2(schedule_3) {
    const source_8 = schedule_3 && typeof schedule_3 === "object" ? schedule_3 : {},
      events_2 = (Array.isArray(source_8.events) ? source_8.events : []).map(normalizeScheduleEvent_2).filter(Boolean).sort((left_2, right_2) => {
        if (left_2.recurrence === "daily" && right_2.recurrence !== "daily") return -1;
        if (left_2.recurrence !== "daily" && right_2.recurrence === "daily") return 1;
        if (left_2.recurrence === "daily" && right_2.recurrence === "daily") return String(left_2.startTime || "").localeCompare(String(right_2.startTime || ""));
        const value_214 = new Date(left_2.rawTime || 0).getTime() || Number(left_2.timestamp) || 0,
          value_215 = new Date(right_2.rawTime || 0).getTime() || Number(right_2.timestamp) || 0;
        return value_214 - value_215;
      });
    return {
      enabled: !!source_8.enabled,
      sleepTime: String(source_8.sleepTime || "23:00"),
      wakeTime: String(source_8.wakeTime || "07:00"),
      events: events_2
    };
  }
  function resolveSummaryStartIndex_2(value_216, count_2 = 0, value_218 = 0, value_219 = []) {
    const value_220 = Array.isArray(value_216) ? value_216 : [],
      value_221 = count_2 && typeof count_2 === "object" ? count_2 : {
        count: count_2
      },
      trim_222 = String(value_221.messageId || "").trim();
    if (trim_222) {
      const index_227 = value_220.findIndex(value_228 => String(value_228?.id || "") === trim_222);
      if (index_227 >= 0) return index_227 + 1;
    }
    const items_223 = Array.isArray(value_219) ? value_219 : [],
      sort_224 = items_223.slice().sort((value_229, value_230) => (Number(value_230?.sourceEndMessageCount) || 0) - (Number(value_229?.sourceEndMessageCount) || 0));
    for (const value_231 of sort_224) {
      const value_232 = Array.isArray(value_231?.sourceMessageIds) ? value_231.sourceMessageIds : [],
        trim_233 = String(value_231?.sourceEndMessageId || value_232[value_232.length - 1] || "").trim();
      if (!trim_233) continue;
      const index_234 = value_220.findIndex(value_235 => String(value_235?.id || "") === trim_233);
      if (index_234 >= 0) return index_234 + 1;
    }
    const number_225 = Number(value_221.order);
    if (Number.isFinite(number_225) && number_225 >= 0) {
      let value_236 = -1;
      for (let count_237 = 0; count_237 < value_220.length; count_237 += 1) {
        const number_238 = Number(value_220[count_237]?.__messageOrder);
        if (Number.isFinite(number_238) && number_238 <= number_225) value_236 = count_237;
      }
      if (value_236 >= 0) return value_236 + 1;
    }
    const value_226 = Number.isFinite(Number(value_221.count)) ? Number(value_221.count) : Number(value_218);
    return Math.min(value_220.length, Math.max(0, Math.round(value_226) || 0));
  }
  function getSummaryBatch_2(value_239, value_240 = 0, value_241 = 30, value_242 = {}) {
    const safeMessages_2 = Array.isArray(value_239) ? value_239 : [],
      startIndex_3 = resolveSummaryStartIndex_2(safeMessages_2, value_240, value_242.legacyCount, value_242.summaryEntries),
      limit_2 = normalizeRoundLimit_2(value_241);
    let availableRounds_2 = 0;
    for (let index_3 = startIndex_3; index_3 < safeMessages_2.length; index_3 += 1) {
      if (safeMessages_2[index_3]?.role === "user") availableRounds_2 += 1;
    }
    let selectedRounds_3 = 0,
      endIndex_2 = startIndex_3;
    for (let value_251 = startIndex_3; value_251 < safeMessages_2.length; value_251 += 1) {
      const message_6 = safeMessages_2[value_251];
      if (message_6?.role === "user") {
        if (selectedRounds_3 >= limit_2) break;
        selectedRounds_3 += 1;
      }
      endIndex_2 = value_251 + 1;
    }
    if (selectedRounds_3 === 0) endIndex_2 = startIndex_3;
    const selectedMessages_4 = safeMessages_2.slice(startIndex_3, endIndex_2);
    return {
      startIndex: startIndex_3,
      endIndex: endIndex_2,
      roundLimit: limit_2,
      availableRounds: availableRounds_2,
      unsummarizedMessageCount: safeMessages_2.length - startIndex_3,
      selectedRounds: selectedRounds_3,
      selectedMessageCount: selectedMessages_4.length,
      selectedMessages: selectedMessages_4,
      ready: availableRounds_2 >= limit_2
    };
  }
  function getGroupSummaryBatch_2(value_253, value_254 = 0, value_255 = 30, value_256 = {}) {
    const safeMessages_3 = Array.isArray(value_253) ? value_253 : [],
      startIndex_4 = resolveSummaryStartIndex_2(safeMessages_3, value_254, value_256.legacyCount, value_256.summaryEntries),
      roundLimit_3 = normalizeRoundLimit_2(value_255),
      value_260 = typeof value_256.isSourceMessage === "function" ? value_256.isSourceMessage : () => true,
      items_261 = [];
    let value_262 = null;
    for (let startIndex_5 = startIndex_4; startIndex_5 < safeMessages_3.length; startIndex_5 += 1) {
      const value_269 = safeMessages_3[startIndex_5];
      if (!value_260(value_269)) continue;
      const trim_270 = String(value_269?.role || "").trim();
      if (trim_270 === "user") {
        value_262 = {
          startIndex: startIndex_5,
          kind: "user",
          apiRunId: "",
          hasLegacyAssistant: false
        };
        items_261.push(value_262);
        continue;
      }
      if (trim_270 !== "assistant") continue;
      const apiRunId_2 = String(value_269?.apiRunId || "").trim(),
        value_272 = value_262?.kind === "user" && (apiRunId_2 && (!value_262.apiRunId || value_262.apiRunId === apiRunId_2) || !apiRunId_2 && !value_262.apiRunId),
        value_273 = value_262?.kind === "assistant" && (apiRunId_2 && value_262.apiRunId === apiRunId_2 || !apiRunId_2 && !value_262.apiRunId);
      if (value_272 || value_273) {
        if (apiRunId_2) value_262.apiRunId = apiRunId_2;else value_262.hasLegacyAssistant = true;
        continue;
      }
      value_262 = {
        startIndex: startIndex_5,
        kind: "assistant",
        apiRunId: apiRunId_2,
        hasLegacyAssistant: !apiRunId_2
      };
      items_261.push(value_262);
    }
    const availableRounds_3 = items_261.length,
      selectedRounds_4 = Math.min(roundLimit_3, availableRounds_3),
      endIndex_3 = selectedRounds_4 === 0 ? startIndex_4 : items_261[selectedRounds_4]?.startIndex ?? safeMessages_3.length,
      selectedMessages_5 = safeMessages_3.slice(startIndex_4, endIndex_3).filter(value_260),
      unsummarizedMessageCount_2 = safeMessages_3.slice(startIndex_4).filter(value_260).length;
    return {
      startIndex: startIndex_4,
      endIndex: endIndex_3,
      roundLimit: roundLimit_3,
      availableRounds: availableRounds_3,
      unsummarizedMessageCount: unsummarizedMessageCount_2,
      selectedRounds: selectedRounds_4,
      selectedMessageCount: selectedMessages_5.length,
      selectedMessages: selectedMessages_5,
      ready: availableRounds_3 >= roundLimit_3
    };
  }
  function classifySummaryRequestFailure_2(input = {}) {
    const status_2 = Math.max(0, Math.round(Number(input?.status) || 0)),
      kind_2 = String(input?.kind || "").trim().toLowerCase(),
      detail_2 = String(input?.message || input?.detail || "").toLowerCase(),
      detail_3 = String(input?.message || input?.detail || "").replace(/\s+/g, " ").trim().slice(0, 180),
      withStatus = value_282 => ({
        code: code_2,
        status: status_2,
        message: "" + value_282 + (status_2 > 0 ? "（HTTP " + status_2 + "）" : ""),
        detail: detail_3
      }),
      isContextLimit = status_2 === 413 || status_2 === 400 && /(?:context(?:[_\s-]?length)?|maximum context|too many tokens|token limit|prompt is too long|input is too long|request (?:body|entity|payload) too large|payload too large|上下文|令牌|请求体|载荷|内容过长|文本过长)/i.test(detail_2);
    let code_2 = "unknown";
    if (kind_2 === "persistence") return code_2 = "persistence_failed", withStatus("总结已生成，但保存到本地失败");
    if (kind_2 === "settings_persistence") return code_2 = "settings_persistence_failed", withStatus("摘要设置保存失败");
    if (kind_2 === "configuration") return code_2 = "configuration_invalid", withStatus(detail_3 || "摘要 API 配置不完整，请检查接口地址、密钥和模型");
    if (kind_2 === "source_changed") return code_2 = "source_changed", withStatus("总结来源聊天记录已变化，请重新生成总结");
    if (kind_2 === "response_format") return code_2 = "invalid_response", withStatus("摘要接口返回格式不兼容");
    if (kind_2 === "network") return code_2 = "network_failed", withStatus("无法连接摘要 API，请检查网络或跨域设置");
    if (isContextLimit) return code_2 = "context_limit", withStatus("本批对话过长，请降低总结轮数后重试");
    if (status_2 === 401) return code_2 = "unauthorized", withStatus("摘要 API 密钥无效或未授权");
    if (status_2 === 403) return code_2 = "forbidden", withStatus("当前摘要接口或模型没有权限");
    if (status_2 === 404) return code_2 = "not_found", withStatus("摘要 API 地址或模型不可用");
    if (status_2 === 408 || status_2 === 504) return code_2 = "timeout", withStatus("摘要请求超时，请稍后重试");
    if (status_2 === 429) return code_2 = "rate_limited", withStatus("摘要请求过于频繁或额度不足");
    if (status_2 >= 500 && status_2 <= 599) return code_2 = "server_error", withStatus("摘要 API 服务暂时异常，请稍后重试");
    if (status_2 === 400) return code_2 = "bad_request", withStatus(detail_3 ? "摘要接口拒绝请求：" + detail_3 : "摘要接口拒绝请求，请检查模型名称和接口兼容性");
    if (status_2 > 0) return code_2 = "http_error", withStatus("摘要 API 请求失败");
    return withStatus("摘要生成失败，请稍后重试");
  }
  function removeShortTermSummaryEntry_2(entries, entryId) {
    const safeEntries = Array.isArray(entries) ? entries : [];
    return safeEntries.filter(entry => !entry || String(entry.id) !== String(entryId));
  }
  function isSuccessfulOnlineAssistantReply_2(message_7) {
    if (!message_7 || message_7.role !== "assistant") return false;
    const auxiliaryTypes_2 = new Set(["system_notice", "pay_transfer", "group_red_packet", "html", "music_control", "recall", "call", "voice_call_record", "offline_meeting_record"]),
      messageType_2 = String(message_7.type || "").trim().toLowerCase();
    if (auxiliaryTypes_2.has(messageType_2)) return false;
    const visibleContent = String(message_7.text || message_7.transcript || message_7.description || message_7.content || "").trim();
    return visibleContent.length > 0;
  }
  function resolvePendingOfflineHandoff_2(value_287) {
    const safeMessages_4 = Array.isArray(value_287) ? value_287 : [],
      lastOfflineMeeting_2 = safeMessages_4.reduce((latest, message_8) => {
        if (!message_8 || message_8.type !== "offline_meeting_record") return latest;
        const timestamp_4 = Number(message_8.timestamp);
        if (!Number.isFinite(timestamp_4) || timestamp_4 <= 0) return latest;
        return !latest || timestamp_4 > Number(latest.timestamp) ? message_8 : latest;
      }, null);
    if (!lastOfflineMeeting_2) return null;
    const meetingTimestamp = Number(lastOfflineMeeting_2.timestamp),
      onlineMessagesAfterMeeting = safeMessages_4.filter(message_9 => message_9 && (message_9.role === "user" || message_9.role === "assistant") && Number(message_9.timestamp) > meetingTimestamp),
      hasUserReturnedOnline = onlineMessagesAfterMeeting.some(message_10 => message_10.role === "user"),
      hasCharacterRepliedOnline = onlineMessagesAfterMeeting.some(isSuccessfulOnlineAssistantReply_2);
    return hasUserReturnedOnline && !hasCharacterRepliedOnline ? lastOfflineMeeting_2 : null;
  }
  function normalizeOfflineMemoryTags_2(value_297, value_298 = []) {
    const tags = [],
      pushTag = candidate => {
        String(candidate || "").split(/[，,、；;\n|/。.!！?？]+/).map(tag => tag.trim().replace(/^[\-•·\s]+|[。.!！?？\s]+$/g, "")).filter(tag_2 => tag_2.length >= 2 && tag_2.length <= 32).forEach(tag_3 => {
          const key = tag_3.toLocaleLowerCase();
          if (!tags.some(existing => existing.toLocaleLowerCase() === key)) tags.push(tag_3);
        });
      };
    return pushTag("线下见面"), (Array.isArray(value_298) ? value_298 : [value_298]).forEach(pushTag), (Array.isArray(value_297) ? value_297 : [value_297]).forEach(pushTag), tags.slice(0, 6);
  }
  function parseLegacyOfflineMeetingSummary(value_302) {
    const raw_2 = String(value_302 || "").trim();
    if (!raw_2) return null;
    const lines = raw_2.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    let title_2 = "",
      summary_2 = "";
    const titleIndex = lines.findIndex(line_2 => /^标题[:：]/.test(line_2)),
      contentIndex = lines.findIndex(line_3 => /^(?:见面内容|总结)[:：]/.test(line_3));
    if (titleIndex >= 0) title_2 = lines[titleIndex].replace(/^标题[:：]\s*/, "").trim();
    if (contentIndex >= 0) {
      const firstLine = lines[contentIndex].replace(/^(?:见面内容|总结)[:：]\s*/, "").trim();
      summary_2 = [firstLine, ...lines.slice(contentIndex + 1)].filter(Boolean).join("\n\n");
    } else summary_2 = lines.filter((_, index_4) => index_4 !== titleIndex).join("\n\n").trim();
    if (!summary_2) return null;
    return {
      title: title_2 || "见面记录",
      summary: summary_2
    };
  }
  function parseOfflineMeetingArtifacts_2(value_312, options_3 = {}) {
    const raw_3 = String(value_312 || "").trim();
    if (!raw_3) return null;
    const cleanText = raw_3.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
    let parsed = null;
    try {
      parsed = JSON.parse(cleanText);
    } catch (value_328) {
      parsed = null;
    }
    const meetingPayload = parsed?.meetingSummary && typeof parsed.meetingSummary === "object" ? parsed.meetingSummary : null,
      legacyMeeting = meetingPayload ? null : parseLegacyOfflineMeetingSummary(cleanText),
      title_3 = String(meetingPayload?.title || legacyMeeting?.title || "").trim(),
      summary_3 = String(meetingPayload?.summary || meetingPayload?.content || legacyMeeting?.summary || "").trim();
    if (!summary_3) return null;
    const memoryPayload = parsed?.shortTermMemory && typeof parsed.shortTermMemory === "object" ? parsed.shortTermMemory : null,
      hasModelMemory = !!String(memoryPayload?.event || "").trim(),
      fallbackCandidates = [title_3, options_3.charName, options_3.userName],
      title_4 = String(hasModelMemory ? memoryPayload.title || title_3 : title_3).trim() || "线下见面",
      memoryEvent = String(hasModelMemory ? memoryPayload.event : summary_3).trim() || summary_3,
      memoryPoints_2 = String(hasModelMemory ? memoryPayload.memoryPoints || memoryEvent : summary_3).trim(),
      memoryTags_2 = normalizeOfflineMemoryTags_2(hasModelMemory ? memoryPayload.memoryTags : [], fallbackCandidates);
    return {
      meetingSummary: {
        title: title_3 || "见面记录",
        summary: summary_3
      },
      shortTermMemory: {
        title: title_4,
        time: String(options_3.dateText || "").trim(),
        event: memoryEvent,
        memoryPoints: memoryPoints_2,
        memoryTags: memoryTags_2,
        triggerKeywords: memoryTags_2.slice(),
        degree: "高",
        raw: raw_3
      },
      activatedEntryIds: Array.isArray(parsed?.activatedEntryIds) ? Array.from(new Set(parsed.activatedEntryIds.map(String).filter(Boolean))) : [],
      usedMemoryFallback: !hasModelMemory
    };
  }
  function parseStickerManifestText_2(text_5) {
    const items_2 = [],
      invalidLines_2 = [];
    return String(text_5 || "").split(/\r?\n/).forEach((value_332, value_333) => {
      const trimmed = value_332.trim();
      if (!trimmed) return;
      const urlMatch = trimmed.match(/https?:\/\/\S+$/i);
      if (!urlMatch) {
        invalidLines_2.push(value_333 + 1);
        return;
      }
      const rawName = trimmed.slice(0, urlMatch.index).trim(),
        name_3 = rawName.replace(/[\s\p{P}|｜=＝+＋~～]+$/u, "").trim();
      if (!name_3) {
        invalidLines_2.push(value_333 + 1);
        return;
      }
      try {
        const parsed_2 = new URL(urlMatch[0]);
        if (!["http:", "https:"].includes(parsed_2.protocol)) throw new Error("unsupported protocol");
        items_2.push({
          name: name_3,
          url: parsed_2.href
        });
      } catch (value_339) {
        invalidLines_2.push(value_333 + 1);
      }
    }), {
      items: items_2,
      invalidLines: invalidLines_2
    };
  }
  return {
    normalizeRoundLimit: normalizeRoundLimit_2,
    normalizeMessageLimit: normalizeMessageLimit_2,
    normalizeChatMessageRange: normalizeChatMessageRange_2,
    isValidTimeZone: isValidTimeZone_2,
    getSupportedTimeZones: getSupportedTimeZones_2,
    resolveLocationTimeZone: resolveLocationTimeZone_2,
    normalizeLocationProfile: normalizeLocationProfile_2,
    getTimeZoneDateParts: getTimeZoneDateParts_2,
    formatDateTimeInTimeZone: formatDateTimeInTimeZone_2,
    getTimeZoneOffsetMinutes: getTimeZoneOffsetMinutes_2,
    formatUtcOffset: formatUtcOffset_2,
    findMessageByReference: findMessageByReference_2,
    normalizeChatLanguage: normalizeChatLanguage_2,
    getChatLanguageName: getChatLanguageName_2,
    normalizeLocalizedContent: normalizeLocalizedContent_2,
    hasLocalizedTranslation: hasLocalizedTranslation_2,
    buildLocalizedJsonContract: buildLocalizedJsonContract_2,
    parseBilingualDialogue: parseBilingualDialogue_2,
    normalizeGroupChatContexts: normalizeGroupChatContexts_2,
    getRecentPublicGroupMessages: getRecentPublicGroupMessages_2,
    getRecentUserRounds: getRecentUserRounds_2,
    formatMemoryEventTime: formatMemoryEventTime_2,
    normalizeScheduleEvent: normalizeScheduleEvent_2,
    normalizeSchedule: normalizeSchedule_2,
    resolveSummaryStartIndex: resolveSummaryStartIndex_2,
    getSummaryBatch: getSummaryBatch_2,
    getGroupSummaryBatch: getGroupSummaryBatch_2,
    classifySummaryRequestFailure: classifySummaryRequestFailure_2,
    removeShortTermSummaryEntry: removeShortTermSummaryEntry_2,
    isSuccessfulOnlineAssistantReply: isSuccessfulOnlineAssistantReply_2,
    resolvePendingOfflineHandoff: resolvePendingOfflineHandoff_2,
    normalizeOfflineMemoryTags: normalizeOfflineMemoryTags_2,
    parseOfflineMeetingArtifacts: parseOfflineMeetingArtifacts_2,
    parseStickerManifestText: parseStickerManifestText_2
  };
});
