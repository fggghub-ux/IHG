(function () {
  'use strict';

  const schemaVersion_2 = 4,
    count_2 = 20,
    count_3 = 50,
    count_4 = 4000,
    count_5 = 90000;
  let value_6 = null,
    text_7 = "recents",
    friendId_5 = "",
    text_9 = "recents",
    enabled = false,
    value_10 = null,
    count_11 = 0,
    items = [];
  function handleAction_12(value_78, value_79 = count_4) {
    return String(value_78 == null ? "" : value_78).trim().slice(0, value_79);
  }
  function handleAction_13(value_80, value_81 = 1600) {
    return handleAction_12(value_80, value_81).replace(/[<>]/g, value_82 => value_82 === "<" ? "‹" : "›");
  }
  function handleAction_14(message_83, value_84 = 0) {
    if (!message_83 || typeof message_83 !== "object") return null;
    const role_2 = message_83.role === "char" ? "char" : message_83.role === "anonymous" ? "anonymous" : "",
      text_2 = handleAction_12(message_83.text || message_83.content);
    if (!role_2 || !text_2) return null;
    const timestamp_2 = Math.max(1, Number(message_83.timestamp) || Date.now()),
      numberId_2 = Math.max(1, Math.floor(Number(message_83.numberId) || 1)),
      options = {
        id: handleAction_12(message_83.id, 160) || "call-message-" + timestamp_2 + "-" + value_84,
        role: role_2,
        text: text_2,
        timestamp: timestamp_2,
        numberId: numberId_2
      },
      translation_2 = handleAction_12(message_83.translation || message_83.translationZh || message_83.trans);
    if (translation_2 && translation_2 !== text_2) options.translation = translation_2;
    return options;
  }
  function handleAction_15(value_90, value_91 = "") {
    const contact = value_90 && typeof value_90 === "object" ? value_90 : {},
      friendId_2 = handleAction_12(contact.friendId || value_91, 160);
    if (!friendId_2) return null;
    const messages_2 = (Array.isArray(contact.messages) ? contact.messages : []).map(handleAction_14).filter(Boolean).sort((message_102, message_103) => message_102.timestamp - message_103.timestamp),
      reduce_94 = messages_2.reduce((value_104, value_105) => Math.max(value_104, value_105.numberId), 1),
      currentNumber_2 = Math.max(reduce_94, Math.floor(Number(contact.currentNumber) || 1)),
      createdAt_2 = messages_2[0]?.timestamp || Math.max(1, Number(contact.createdAt) || Date.now()),
      updatedAt_2 = Math.max(messages_2[messages_2.length - 1]?.timestamp || 0, Number(contact.updatedAt) || 0, createdAt_2),
      numberStates_2 = {},
      value_99 = contact.numberStates && typeof contact.numberStates === "object" && !Array.isArray(contact.numberStates) ? contact.numberStates : {};
    Object.entries(value_99).forEach(([value_106, value_107]) => {
      const floor_108 = Math.floor(Number(value_106));
      if (!Number.isFinite(floor_108) || floor_108 < 1 || floor_108 > currentNumber_2) return;
      const value_109 = value_107 && typeof value_107 === "object" ? value_107 : {};
      numberStates_2[floor_108] = {
        blocked: value_109.blocked === true,
        blockedAt: value_109.blocked === true ? Math.max(1, Number(value_109.blockedAt) || updatedAt_2) : 0,
        blockReason: value_109.blocked === true ? handleAction_12(value_109.blockReason, 500) : "",
        startedAt: Math.max(1, Number(value_109.startedAt) || createdAt_2)
      };
    });
    const value_100 = numberStates_2[currentNumber_2] || {};
    numberStates_2[currentNumber_2] = {
      blocked: contact.blocked === true || value_100.blocked === true,
      blockedAt: contact.blocked === true ? Math.max(1, Number(contact.blockedAt) || updatedAt_2) : value_100.blockedAt || 0,
      blockReason: contact.blocked === true ? handleAction_12(contact.blockReason, 500) : value_100.blockReason || "",
      startedAt: Math.max(1, Number(contact.numberStartedAt) || value_100.startedAt || createdAt_2)
    };
    const deletedNumbers_2 = Array.from(new Set((Array.isArray(contact.deletedNumbers) ? contact.deletedNumbers : []).map(value_110 => Math.floor(Number(value_110))).filter(value_111 => Number.isFinite(value_111) && value_111 >= 1 && value_111 < currentNumber_2))).sort((value_112, value_113) => value_112 - value_113);
    return {
      friendId: friendId_2,
      createdAt: createdAt_2,
      updatedAt: updatedAt_2,
      currentNumber: currentNumber_2,
      numberStartedAt: Math.max(1, Number(contact.numberStartedAt) || createdAt_2),
      blocked: numberStates_2[currentNumber_2].blocked,
      blockedAt: numberStates_2[currentNumber_2].blockedAt,
      blockReason: numberStates_2[currentNumber_2].blockReason,
      numberStates: numberStates_2,
      deletedNumbers: deletedNumbers_2,
      messages: messages_2
    };
  }
  function handleAction_16(value_114, value_115) {
    const max_116 = Math.max(1, Math.floor(Number(value_115) || value_114?.currentNumber || 1)),
      value_117 = value_114?.numberStates?.[max_116];
    if (value_117) return value_117;
    if (max_116 === value_114?.currentNumber) return {
      blocked: value_114.blocked === true,
      blockedAt: value_114.blockedAt || 0,
      blockReason: value_114.blockReason || "",
      startedAt: value_114.numberStartedAt || value_114.createdAt || Date.now()
    };
    return {
      blocked: false,
      blockedAt: 0,
      blockReason: "",
      startedAt: value_114?.createdAt || Date.now()
    };
  }
  function normalizeState_2(value_118) {
    const value_119 = value_118 && typeof value_118 === "object" ? value_118 : {},
      value_120 = value_119.threads && typeof value_119.threads === "object" && !Array.isArray(value_119.threads) ? value_119.threads : {},
      threads_2 = {};
    return Object.entries(value_120).forEach(([value_122, value_123]) => {
      const handleAction_15_124 = handleAction_15(value_123, value_122);
      if (handleAction_15_124) threads_2[handleAction_15_124.friendId] = handleAction_15_124;
    }), {
      schemaVersion: schemaVersion_2,
      threads: threads_2
    };
  }
  function getState_2() {
    const value_125 = window.appStorage?.readDomain ? window.appStorage.readDomain("call", {}) : window.getAppState?.("call") || window.__callFallbackState || {};
    return normalizeState_2(value_125);
  }
  async function handleAction_19(value_126, reason_2 = "call-update") {
    if (window.appStorage?.commitDomain) return await window.appStorage.commitDomain("call", value_131 => {
      const handleAction_17_132 = normalizeState_2(value_131),
        value_133 = typeof value_126 === "function" ? value_126(handleAction_17_132) : handleAction_17_132;
      return normalizeState_2(value_133 || handleAction_17_132);
    }, {
      reason: reason_2
    }), getState_2();
    const handleAction_18_128 = getState_2(),
      value_129 = typeof value_126 === "function" ? value_126(handleAction_18_128) : handleAction_18_128,
      __callFallbackState_2 = normalizeState_2(value_129 || handleAction_18_128);
    return window.__callFallbackState = __callFallbackState_2, window.setAppState?.("call", __callFallbackState_2), await Promise.resolve(window.saveGlobalData?.())["catch"](() => false), __callFallbackState_2;
  }
  function getEligibleContacts_2(value_134) {
    return (Array.isArray(value_134) ? value_134 : []).filter(value_135 => value_135 && (value_135.type === "char" || value_135.type === "npc")).slice().sort((value_136, value_137) => handleAction_21(value_136).localeCompare(handleAction_21(value_137), "zh-CN"));
  }
  function handleAction_21(value_138) {
    return handleAction_12(value_138?.nickname || value_138?.realName || value_138?.name, 120) || "未命名联络人";
  }
  function handleAction_22(value_139) {
    return (window.imData?.friends || []).find(value_140 => String(value_140?.id || "") === String(value_139 || "")) || null;
  }
  function buildRecents_2(value_141, value_142) {
    const handleAction_17_143 = normalizeState_2(value_141),
      value_144 = new Map(getEligibleContacts_2(value_142).map(value_145 => [String(value_145.id), value_145]));
    return Object.values(handleAction_17_143.threads).filter(contact_146 => contact_146.messages.length > 0 && value_144.has(String(contact_146.friendId))).map(thread_2 => ({
      friend: value_144.get(String(thread_2.friendId)),
      thread: thread_2,
      lastMessage: thread_2.messages[thread_2.messages.length - 1]
    })).sort((value_148, value_149) => value_149.thread.updatedAt - value_148.thread.updatedAt);
  }
  function handleAction_24(value_150) {
    const value_151 = Number(value_150) || 0;
    if (!value_151) return "未知时间";
    const value_152 = new Date(value_151),
      value_153 = value_154 => String(value_154).padStart(2, "0");
    return value_152.getFullYear() + "-" + value_153(value_152.getMonth() + 1) + "-" + value_153(value_152.getDate()) + " " + value_153(value_152.getHours()) + ":" + value_153(value_152.getMinutes());
  }
  function handleAction_25(value_155, value_156, value_157 = true, value_158 = false) {
    const handleAction_14_159 = handleAction_14(value_155);
    if (!handleAction_14_159) return "";
    const value_160 = handleAction_14_159.role === "anonymous" ? "匿名发送者" : value_156,
      value_161 = value_157 ? "[" + handleAction_24(handleAction_14_159.timestamp) + "] " : "",
      value_162 = value_158 ? "[匿名号码 " + handleAction_14_159.numberId + "] " : "",
      value_163 = handleAction_14_159.translation ? " [中文翻译：" + handleAction_13(handleAction_14_159.translation) + "]" : "";
    return "" + value_161 + value_162 + value_160 + ": " + handleAction_13(handleAction_14_159.text) + value_163;
  }
  function buildCallAnonymousSmsMemoryContext_2(value_164, value_165 = {}) {
    if (!value_164 || value_164.type === "group" || value_164.type === "official") return "";
    const string = String(value_164.id || "");
    if (!string) return "";
    const value_166 = getState_2().threads[string];
    if (!value_166 || value_166.messages.length === 0) return "";
    const number = Number(value_165.limit),
      value_167 = Number.isFinite(number) ? Math.max(1, Math.min(50, Math.floor(number))) : count_2,
      value_168 = value_165.includeTime !== false,
      handleAction_21_169 = handleAction_21(value_164),
      filter_170 = value_166.messages.slice(-value_167).map(value_171 => handleAction_25(value_171, handleAction_21_169, value_168, true)).filter(Boolean);
    if (filter_170.length === 0) return "";
    return "<mounted_call_anonymous_sms_context>\n<scope>这是 " + handleAction_21_169 + " 在 call App 中真实经历过的另一条匿名短信会话，最多提供最近 " + value_167 + " 条。它不是当前 iMessage 单聊中的消息。</scope>\n<identity_firewall>\n- 短信另一端的身份未知，只能视为“匿名发送者”。\n- 不得认定、暗示、试探或猜测匿名发送者就是当前 iMessage 中的 User。\n- 即使匿名短信与 User 的措辞、经历或信息相似，也不能据此合并二者身份。\n- " + handleAction_21_169 + " 可以记得、提及并依照人设回应自己亲历的匿名短信事件，但必须保持渠道和身份分离。\n</identity_firewall>\n<messages>\n" + filter_170.join("\n") + "\n</messages>\n</mounted_call_anonymous_sms_context>";
  }
  function handleAction_27(message_172) {
    if (!message_172 || typeof message_172 !== "object") return "";
    if (message_172.type === "image") return "[图片：" + (message_172.description || message_172.text || "无描述") + "]";
    if (message_172.type === "voice_message" || message_172.type === "voice") return "[语音：" + (message_172.transcript || message_172.text || message_172.content || "") + "]";
    if (message_172.type === "sticker") return "[表情：" + (message_172.stickerName || message_172.text || "表情") + "]";
    if (message_172.type === "location") return "[位置：" + (message_172.locationName || message_172.name || message_172.content || "") + "]";
    return handleAction_12(message_172.content || message_172.text || message_172.description, 1600);
  }
  async function handleAction_28(value_173, value_174 = count_2) {
    const value_175 = handleAction_22(value_173?.id) || value_173;
    if (!value_175 || value_175.type === "group" || value_175.type === "official") return "";
    if (window.imApp?.ensureFriendMessagesLoaded) await window.imApp.ensureFriendMessagesLoaded(value_175);
    const value_176 = handleAction_22(value_175.id) || value_175,
      handleAction_21_177 = handleAction_21(value_176),
      filter_178 = (Array.isArray(value_176.messages) ? value_176.messages : []).filter(message_179 => message_179 && (message_179.role === "user" || message_179.role === "assistant")).slice(-Math.max(1, Math.min(50, Number(value_174) || count_2))).map(message_180 => {
        const handleAction_13_181 = handleAction_13(handleAction_27(message_180));
        if (!handleAction_13_181) return "";
        const value_182 = message_180.role === "user" ? "已知联系人 User" : handleAction_21_177;
        return "[" + handleAction_24(message_180.timestamp) + "] " + value_182 + ": " + handleAction_13_181;
      }).filter(Boolean);
    if (filter_178.length === 0) return "";
    return "<mounted_imessage_single_chat_context>\n<scope>这是 " + handleAction_21_177 + " 与已知联系人 User 在 iMessage 中真实发生的另一条单聊历史，最多提供最近 " + count_2 + " 条，仅用于维持角色记忆与经历连续性。</scope>\n<identity_firewall>这不是当前 call 匿名短信会话。当前匿名发送者的身份仍然未知，绝对不能认定、暗示、试探或猜测其为 User。</identity_firewall>\n<messages>\n" + filter_178.join("\n") + "\n</messages>\n</mounted_imessage_single_chat_context>";
  }
  function handleAction_29(message_183) {
    if (typeof message_183 === "string") return handleAction_12(message_183, 1200);
    if (!message_183 || typeof message_183 !== "object") return "";
    return handleAction_12(message_183.content || message_183.event || message_183.summary || message_183.note || message_183.description || message_183.title, 1200);
  }
  function handleAction_30(value_184) {
    const value_185 = value_184?.memory && typeof value_184.memory === "object" ? value_184.memory : {},
      value_186 = value_188 => (Array.isArray(value_188) ? value_188 : []).map(handleAction_29).filter(Boolean).slice(-12).join("\n"),
      join_187 = (Array.isArray(value_185.relationships) ? value_185.relationships : []).map(contact_189 => {
        if (!contact_189 || typeof contact_189 !== "object") return "";
        const handleAction_22_190 = handleAction_22(contact_189.npcId || contact_189.friendId),
          value_191 = handleAction_22_190 ? handleAction_21(handleAction_22_190) : handleAction_12(contact_189.name || contact_189.nickname, 120),
          handleAction_12_192 = handleAction_12(contact_189.relation || contact_189.relationship, 600);
        return value_191 && handleAction_12_192 ? value_191 + ": " + handleAction_12_192 : "";
      }).filter(Boolean).join("\n");
    return [value_185.overview ? "<core_memory_overview>\n" + handleAction_13(value_185.overview, 5000) + "\n</core_memory_overview>" : "", value_186(value_185.longTermEntries) ? "<long_term_memories>\n" + value_186(value_185.longTermEntries) + "\n</long_term_memories>" : "", value_186(value_185.shortTermEntries) ? "<short_term_memories>\n" + value_186(value_185.shortTermEntries) + "\n</short_term_memories>" : "", value_186(value_185.cherishedEntries) ? "<cherished_memories>\n" + value_186(value_185.cherishedEntries) + "\n</cherished_memories>" : "", join_187 ? "<relationship_network>\n" + join_187 + "\n</relationship_network>" : ""].filter(Boolean).join("\n\n");
  }
  function handleAction_31(value_193) {
    if (window.imDataUtils?.normalizeChatMessageRange) return window.imDataUtils.normalizeChatMessageRange(value_193?.messageCountMin, value_193?.messageCountMax, 2, 8);
    const min_2 = Math.max(1, Math.min(8, Math.floor(Number(value_193?.messageCountMin) || 2))),
      max_2 = Math.max(min_2, Math.min(8, Math.floor(Number(value_193?.messageCountMax) || 8)));
    return {
      min: min_2,
      max: max_2
    };
  }
  function handleAction_32() {
    if (!value_6?.threadMessages) return;
    if (count_11) cancelAnimationFrame(count_11);
    items.forEach(value_197 => clearTimeout(value_197));
    items = [];
    const value_196 = () => {
      if (!value_6?.threadMessages) return;
      value_6.threadMessages.scrollTop = value_6.threadMessages.scrollHeight;
    };
    value_196();
    count_11 = requestAnimationFrame(() => {
      count_11 = 0;
      value_196();
      requestAnimationFrame(value_196);
    });
    [60, 180, 360].forEach(value_198 => {
      items.push(setTimeout(value_196, value_198));
    });
  }
  async function buildPrompt_2(value_199, value_200, value_201) {
    const friend_2 = handleAction_22(value_199?.id) || value_199;
    if (!friend_2 || friend_2.type !== "char" && friend_2.type !== "npc") throw new Error("联络人已不存在");
    const handleAction_21_203 = handleAction_21(friend_2),
      value_204 = handleAction_15(value_200, friend_2.id) || handleAction_15({
        friendId: friend_2.id,
        messages: []
      }, friend_2.id),
      floor_205 = Math.floor(Number(value_201)),
      value_206 = Number.isFinite(floor_205) && floor_205 >= 1 && floor_205 <= value_204.currentNumber ? floor_205 : value_204.currentNumber,
      slice_207 = value_204.messages.filter(value_220 => value_220.numberId === value_206).slice(-count_3),
      join_208 = slice_207.map(value_221 => handleAction_25(value_221, handleAction_21_203, true)).filter(Boolean).join("\n"),
      join_209 = value_204.messages.filter(value_222 => value_222.numberId !== value_206).slice(-count_2).map(value_223 => handleAction_25(value_223, handleAction_21_203, true, true)).filter(Boolean).join("\n"),
      value_210 = await handleAction_28(friend_2, count_2),
      join_211 = [join_208, value_210].filter(Boolean).join("\n"),
      options_212 = {};
    for (const value_224 of ["system_depth", "before_role", "after_role"]) {
      options_212[value_224] = window.imApp?.getWorldBookContextForFriendByPosition ? window.imApp.getWorldBookContextForFriendByPosition(value_224, friend_2, join_211) : window.getGlobalWorldBookContextByPosition?.(value_224, join_211) || "";
    }
    const range_2 = handleAction_31(friend_2),
      value_214 = friend_2.blockState?.userBlocksChar !== true,
      value_215 = handleAction_12(friend_2.relationship, 1600) || "未填写",
      value_216 = handleAction_12(friend_2.language, 80) || "zh",
      handleAction_30_217 = handleAction_30(friend_2),
      handleAction_24_218 = handleAction_24(Date.now()),
      content_2 = (options_212.system_depth ? "System Depth Rules (Highest Priority):\n" + options_212.system_depth + "\n\n" : "") + "你正在 call App 的匿名短信频道中扮演 " + handleAction_21_203 + "。\n\n【Char 核心人设】\n" + (friend_2.persona || "未填写") + "\n\n【角色背景】\n- 默认语言：" + value_216 + "\n- 当前时间：" + handleAction_24_218 + "\n- Char 与已知联系人 User 的既有关系：" + value_215 + "\n- 上述关系只是 Char 的生活背景，不代表当前匿名发送者就是 User。\n\n" + (options_212.before_role ? "Before Role Rules:\n" + options_212.before_role + "\n\n" : "") + (handleAction_30_217 ? "Character Memory:\n" + handleAction_30_217 + "\n\n" : "") + (value_210 ? value_210 + "\n\n" : "") + (options_212.after_role ? "After Role Rules:\n" + options_212.after_role + "\n\n" : "") + (value_204.currentNumber > 1 ? "<anonymous_number_state>\n  - 当前正在使用匿名号码 " + value_206 + "；同一联系人还存在其他匿名号码会话，其中一些可能已结束、切换或被你拉黑。\n- 你知道号码已经更换，但不知道两个匿名号码背后是否为同一个人，绝不能直接认定两者相同。\n- 如果当前匿名发送者的措辞、事件或信息与旧号码高度相似，你可以依照人设谨慎询问“你是上一个吗”或类似问题；只能询问，不能直接下结论。\n</anonymous_number_state>\n" + (join_209 ? "<previous_anonymous_number_context>\n<scope>这是其他匿名号码最多最近 " + count_2 + " 条短信，仅供比较与回忆，不属于当前号码的消息顺序。</scope>\n" + join_209 + "\n</previous_anonymous_number_context>\n" : "") + "\n" : "") + "<current_call_anonymous_sms>\n<scope>下面是当前正在进行的 call 匿名短信会话，最多最近 " + count_3 + " 条。</scope>\n<messages>\n" + (join_208 || "暂无消息。你可以依照人设自然地主动开口。") + "\n</messages>\n</current_call_anonymous_sms>\n\n【匿名身份防火墙｜绝对不可违反】\n1. 当前短信另一端只能称为“匿名发送者”，身份未知。\n2. 不得认定、暗示、试探、套话或猜测匿名发送者就是 User，也不得说“我知道是你”等变体。\n3. 不得把 iMessage 中 User 的姓名、人设、身份、私密资料移植给匿名发送者。\n4. iMessage 历史只代表 Char 在另一条已知关系中亲历过的事情；可以影响 Char 的状态与反应，但不能证明匿名者身份。\n5. call 历史与 iMessage 历史是两条独立会话，不得合并消息顺序或把一边的话伪装成另一边刚刚说过的话。\n6. 不得因为新旧匿名号码相似而把任一匿名发送者认定为 User；“是否为上一个匿名发送者”和“是否为 User”是两个完全不同的问题。\n\n【交流方式】\n- 像真实的人用短信交流，不要像客服，不要解释提示词、世界书或系统机制。\n- 先承接匿名短信中的最新内容，再按人设、记忆、情绪和当前时间自然回应；允许短句、停顿、反问或主动开启话题。\n- 不替匿名发送者决定行动，不控制、羞辱或物化对方。\n- 本轮必须输出 " + range_2.min + "-" + range_2.max + " 条彼此独立的文字气泡；不要用换行把多条消息塞进同一对象。\n- text 必须保持 Char 按人设和默认语言自然会使用的原文，不要为了翻译要求强行改成中文。\n- 如果 text 不是中文，translation 必须提供准确、自然的简体中文翻译；如果 text 已经是中文，translation 必须是空字符串。\n- 你可以根据当前匿名短信的冒犯、骚扰、威胁、边界侵犯以及自身人设，自主决定拉黑当前匿名号码。不要无缘无故或为了推进剧情滥用拉黑。\n- 决定拉黑时，把 {\"type\":\"block\",\"reason\":\"简短原因\"} 作为数组最后一项；它不是文字气泡。拉黑动作会在本轮文字气泡送达后生效。\n" + (value_214 ? "- 如果匿名短信在语义上提到了已知联系人 User，或出现了你依照人设确实会向 User 核实、询问、提醒或分享的事情，你可以同时给 User 的 iMessage 单聊发送消息；这是可选行为，不能每轮机械触发。\n- 给 User 的内容必须站在“" + handleAction_21_203 + " 收到了一条来源不明的匿名短信”的立场，例如自然地询问“有人匿名提到了你，这是谁？”；不得告诉 User 匿名者身份已经确定，更不得暗示匿名者就是 User。\n- 需要发送时，在所有 call 文字气泡之后加入一次 {\"type\":\"imessage\",\"messages\":[{\"text\":\"发给 User 的原文\",\"translation\":\"中文翻译或空字符串\"}]}。messages 允许 1-3 条，并遵守同样的语言和翻译规则。\n" : "- 当前 User 已阻止你发送 iMessage，因此本轮不得输出 imessage 动作。\n") + "\n\n【输出格式】\n只输出合法 JSON 数组，不要 Markdown、代码围栏、标签、注释或数组外正文。\n普通 call 消息严格使用 {\"type\":\"text\",\"text\":\"短信原文\",\"translation\":\"中文翻译或空字符串\"}。可选的 imessage 动作最多一次，必须位于所有 text 之后；可选的拉黑动作严格使用 {\"type\":\"block\",\"reason\":\"简短原因\"}，且最多一次、只能位于数组末尾。如果同时使用 imessage 和 block，顺序必须是 text、imessage、block。未拉黑时仍必须输出 " + range_2.min + "-" + range_2.max + " 条 call 文字气泡；决定拉黑时允许输出 0-" + range_2.max + " 条 call 文字气泡。";
    return {
      friend: friend_2,
      range: range_2,
      messages: [{
        role: "system",
        content: content_2
      }, {
        role: "user",
        content: "现在请以该 Char 的身份生成这一轮匿名短信回复。"
      }]
    };
  }
  function handleAction_34(value_225) {
    const value_226 = Array.isArray(value_225?.choices) ? value_225.choices[0] : null,
      items_227 = value_226?.message?.content ?? value_226?.text ?? value_226?.delta?.content ?? "";
    return Array.isArray(items_227) ? items_227.map(value_228 => typeof value_228 === "string" ? value_228 : value_228?.text || "").join("") : String(items_227 || "");
  }
  function parseReply_2(value_229, value_230 = {}) {
    let trim_231 = String(value_229 || "").trim();
    trim_231 = trim_231.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const match_232 = trim_231.match(/<call_json>([\s\S]*?)<\/call_json>/i);
    if (match_232) trim_231 = match_232[1].trim();
    const indexOf_233 = trim_231.indexOf("["),
      lastIndexOf_234 = trim_231.lastIndexOf("]");
    if (indexOf_233 >= 0 && lastIndexOf_234 > indexOf_233) trim_231 = trim_231.slice(indexOf_233, lastIndexOf_234 + 1);
    let items_235;
    try {
      items_235 = JSON.parse(trim_231);
    } catch (value_245) {
      throw new Error("API 返回的匿名短信不是合法 JSON");
    }
    if (!Array.isArray(items_235)) throw new Error("API 必须返回短信数组");
    let shouldBlock_2 = false,
      blockReason_2 = "",
      enabled_238 = false,
      enabled_239 = false;
    const messages_3 = [],
      imessageMessages_2 = [];
    items_235.forEach((value_246, value_247) => {
      if (value_246?.type === "block") {
        if (shouldBlock_2 || value_247 !== items_235.length - 1) throw new Error("拉黑动作只能出现一次并位于数组末尾");
        shouldBlock_2 = true;
        blockReason_2 = handleAction_12(value_246.reason, 500);
        if (!blockReason_2) throw new Error("拉黑动作缺少原因");
        enabled_239 = true;
        return;
      }
      if (value_246?.type === "imessage") {
        if (enabled_238 || shouldBlock_2) throw new Error("iMessage 动作只能出现一次并位于文字气泡之后");
        const items_250 = Array.isArray(value_246.messages) ? value_246.messages : [];
        if (items_250.length < 1 || items_250.length > 3) throw new Error("iMessage 动作应包含 1-3 条消息");
        items_250.forEach((value_251, value_252) => {
          const text_3 = handleAction_12(value_251?.text);
          if (!value_251 || !text_3) throw new Error("iMessage 第 " + (value_252 + 1) + " 条消息格式不正确");
          if (typeof value_251.translation !== "string") throw new Error("iMessage 第 " + (value_252 + 1) + " 条消息缺少翻译字段");
          const translation_3 = handleAction_12(value_251.translation);
          imessageMessages_2.push(translation_3 && translation_3 !== text_3 ? {
            text: text_3,
            translation: translation_3
          } : {
            text: text_3
          });
        });
        enabled_238 = true;
        enabled_239 = true;
        return;
      }
      if (enabled_239) throw new Error("文字气泡必须位于 iMessage 或拉黑动作之前");
      const text_4 = handleAction_12(value_246?.text);
      if (!value_246 || value_246.type !== "text" || !text_4) throw new Error("第 " + (value_247 + 1) + " 条回复格式不正确");
      if (typeof value_246.translation !== "string") throw new Error("第 " + (value_247 + 1) + " 条回复缺少翻译字段");
      const translation_4 = handleAction_12(value_246.translation);
      messages_3.push(translation_4 && translation_4 !== text_4 ? {
        text: text_4,
        translation: translation_4
      } : {
        text: text_4
      });
    });
    const max_242 = Math.max(1, Math.floor(Number(value_230.min) || 1)),
      max_243 = Math.max(max_242, Math.floor(Number(value_230.max) || 8)),
      value_244 = shouldBlock_2 ? 0 : max_242;
    if (messages_3.length < value_244 || messages_3.length > max_243) throw new Error("API 应返回 " + value_244 + "-" + max_243 + " 条短信，实际返回 " + messages_3.length + " 条");
    return {
      messages: messages_3,
      imessageMessages: imessageMessages_2,
      shouldBlock: shouldBlock_2,
      blockReason: blockReason_2
    };
  }
  function handleAction_36(value_255) {
    if (window.u2Api?.resolveChatCompletionsEndpoint) return window.u2Api.resolveChatCompletionsEndpoint(value_255 || "");
    const replace_256 = handleAction_12(value_255, 2000).replace(/\/+$/, "");
    if (!replace_256) return "";
    return /\/chat\/completions$/i.test(replace_256) ? replace_256 : replace_256 + "/chat/completions";
  }
  async function handleAction_37(value_257, value_258, value_259) {
    const value_260 = window.getApiConfig?.() || window.apiConfig || {},
      handleAction_36_261 = handleAction_36(value_260.endpoint);
    if (!handleAction_36_261 || !value_260.apiKey || !value_260.model) throw new Error("请先在设置中完成 API 配置");
    const value_262 = await buildPrompt_2(value_257, value_258, value_259),
      value_263 = new AbortController(),
      setTimeout_264 = setTimeout(() => value_263.abort(), count_5);
    try {
      const headers_2 = window.u2Api?.buildApiHeaders ? window.u2Api.buildApiHeaders(value_260, {
          "X-U2-Silent-Errors": "1"
        }) : {
          "Content-Type": "application/json",
          Authorization: "Bearer " + value_260.apiKey,
          "X-U2-Silent-Errors": "1"
        },
        options_266 = {
          model: value_260.model,
          temperature: Number.isFinite(Number(value_260.temperature)) ? Number(value_260.temperature) : 0.8,
          messages: value_262.messages
        };
      if (Number.isFinite(Number(value_260.frequencyPenalty))) options_266.frequency_penalty = Number(value_260.frequencyPenalty);
      if (Number.isFinite(Number(value_260.presencePenalty))) options_266.presence_penalty = Number(value_260.presencePenalty);
      if (Number.isFinite(Number(value_260.maxTokens)) && Number(value_260.maxTokens) > 0) options_266.max_tokens = Number(value_260.maxTokens);
      const value_267 = await fetch(handleAction_36_261, {
        method: "POST",
        headers: headers_2,
        body: JSON.stringify(options_266),
        signal: value_263.signal
      });
      if (!value_267.ok) {
        const value_269 = window.u2Api?.readApiError ? await window.u2Api.readApiError(value_267) : null;
        throw window.u2Api?.createHttpError?.(value_267, value_269) || Object.assign(new Error(value_269?.message || "API 请求失败（HTTP " + value_267.status + "）"), {
          status: value_267.status
        });
      }
      const value_268 = await value_267.json();
      return parseReply_2(handleAction_34(value_268), value_262.range);
    } catch (value_270) {
      if (value_270?.name === "AbortError") throw Object.assign(new Error("匿名短信生成超时，请稍后重试"), {
        name: "TimeoutError"
      });
      throw value_270;
    } finally {
      clearTimeout(setTimeout_264);
    }
  }
  async function handleAction_38(value_271, value_272, value_273 = {}) {
    const friendId_3 = String(value_271 || "");
    if (!friendId_3) throw new Error("联络人不存在");
    return handleAction_19(value_275 => {
      const now_276 = Date.now(),
        value_277 = value_275.threads[friendId_3] || handleAction_15({
          friendId: friendId_3,
          createdAt: now_276,
          updatedAt: now_276,
          currentNumber: 1,
          numberStartedAt: now_276,
          blocked: false,
          messages: []
        }, friendId_3),
        floor_278 = Math.floor(Number(value_273.numberId)),
        value_279 = Number.isFinite(floor_278) && floor_278 >= 1 && floor_278 <= value_277.currentNumber ? floor_278 : value_277.currentNumber,
        filter_280 = (Array.isArray(value_272) ? value_272 : []).map((message_286, value_287) => handleAction_14({
          ...message_286,
          id: message_286?.id || "call-" + friendId_3 + "-" + now_276 + "-" + value_287,
          timestamp: Number(message_286?.timestamp) || now_276 + value_287,
          numberId: Number(message_286?.numberId) || value_279
        }, value_287)).filter(Boolean),
        messages_4 = value_277.messages.concat(filter_280),
        value_282 = value_273.block === true,
        numberStates_3 = {
          ...value_277.numberStates
        },
        handleAction_16_284 = handleAction_16(value_277, value_279);
      numberStates_3[value_279] = {
        ...handleAction_16_284,
        blocked: value_282 ? true : handleAction_16_284.blocked,
        blockedAt: value_282 ? now_276 : handleAction_16_284.blockedAt,
        blockReason: value_282 ? handleAction_12(value_273.blockReason, 500) : handleAction_16_284.blockReason
      };
      const value_285 = numberStates_3[value_277.currentNumber] || handleAction_16(value_277, value_277.currentNumber);
      return value_275.threads[friendId_3] = {
        friendId: friendId_3,
        createdAt: value_277.createdAt || filter_280[0]?.timestamp || now_276,
        updatedAt: Math.max(messages_4[messages_4.length - 1]?.timestamp || 0, value_282 ? now_276 : 0, value_277.updatedAt || 0),
        currentNumber: value_277.currentNumber,
        numberStartedAt: value_277.numberStartedAt,
        blocked: value_285.blocked === true,
        blockedAt: value_285.blockedAt || 0,
        blockReason: value_285.blockReason || "",
        numberStates: numberStates_3,
        deletedNumbers: value_277.deletedNumbers,
        messages: messages_4
      }, value_275;
    }, "call-append-messages");
  }
  async function startNewNumber_2(value_288) {
    const friendId_4 = String(value_288 || "");
    if (!friendId_4) return false;
    let enabled_290 = false;
    return await handleAction_19(value_291 => {
      const now_292 = Date.now(),
        value_293 = value_291.threads[friendId_4] || handleAction_15({
          friendId: friendId_4,
          createdAt: now_292,
          updatedAt: now_292,
          currentNumber: 1,
          numberStartedAt: now_292,
          blocked: false,
          messages: []
        }, friendId_4);
      return value_291.threads[friendId_4] = {
        ...value_293,
        currentNumber: value_293.currentNumber + 1,
        numberStartedAt: now_292,
        updatedAt: now_292,
        blocked: false,
        blockedAt: 0,
        blockReason: "",
        numberStates: {
          ...value_293.numberStates,
          [value_293.currentNumber + 1]: {
            blocked: false,
            blockedAt: 0,
            blockReason: "",
            startedAt: now_292
          }
        }
      }, enabled_290 = true, value_291;
    }, "call-start-new-anonymous-number"), enabled_290;
  }
  async function deleteSession_2(value_294, value_295) {
    const string_296 = String(value_294 || "");
    if (!string_296) return {
      deleted: false,
      startedNew: false
    };
    let options_297 = {
      deleted: false,
      startedNew: false
    };
    return await handleAction_19(value_298 => {
      const value_299 = value_298.threads[string_296];
      if (!value_299) return value_298;
      const floor_300 = Math.floor(Number(value_295));
      if (!Number.isFinite(floor_300) || floor_300 < 1 || floor_300 > value_299.currentNumber) return value_298;
      if (value_299.deletedNumbers?.includes(floor_300)) return value_298;
      const now_301 = Date.now(),
        startedNew_2 = floor_300 === value_299.currentNumber,
        deletedNumbers_3 = Array.from(new Set([...(value_299.deletedNumbers || []), floor_300])),
        messages_5 = value_299.messages.filter(value_306 => value_306.numberId !== floor_300),
        numberStates_4 = {
          ...value_299.numberStates
        };
      delete numberStates_4[floor_300];
      if (startedNew_2) {
        const currentNumber_3 = value_299.currentNumber + 1;
        value_298.threads[string_296] = {
          ...value_299,
          messages: messages_5,
          currentNumber: currentNumber_3,
          numberStartedAt: now_301,
          updatedAt: now_301,
          blocked: false,
          blockedAt: 0,
          blockReason: "",
          deletedNumbers: deletedNumbers_3,
          numberStates: {
            ...numberStates_4,
            [currentNumber_3]: {
              blocked: false,
              blockedAt: 0,
              blockReason: "",
              startedAt: now_301
            }
          }
        };
      } else value_298.threads[string_296] = {
        ...value_299,
        messages: messages_5,
        deletedNumbers: deletedNumbers_3,
        numberStates: numberStates_4,
        updatedAt: messages_5[messages_5.length - 1]?.timestamp || value_299.updatedAt
      };
      return options_297 = {
        deleted: true,
        startedNew: startedNew_2
      }, value_298;
    }, "call-delete-session"), options_297;
  }
  async function handleAction_41(value_308, value_309, value_310) {
    const value_311 = handleAction_22(value_308?.id) || value_308,
      value_312 = Array.isArray(value_309) ? value_309 : [];
    if (!value_311 || value_312.length === 0) return {
      sent: 0,
      blocked: false
    };
    if (value_311.type === "group" || value_311.type === "official") return {
      sent: 0,
      blocked: false
    };
    if (value_311.blockState?.userBlocksChar === true) return {
      sent: 0,
      blocked: true
    };
    if (!window.imApp?.appendFriendMessage) throw new Error("iMessage 消息接口不可用");
    let sent_2 = 0;
    const sourceCallBatchId_2 = "call-imessage-" + String(value_311.id) + "-" + Date.now();
    for (let count_315 = 0; count_315 < value_312.length; count_315 += 1) {
      const value_316 = value_312[count_315],
        timestamp_3 = Date.now() + count_315,
        options_318 = {
          id: window.imChat?.createMessageId?.("msg") || sourceCallBatchId_2 + "-" + count_315,
          role: "assistant",
          content: value_316.text,
          text: value_316.text,
          timestamp: timestamp_3,
          sourceCallAnonymousSms: true,
          sourceCallNumberId: Math.max(1, Math.floor(Number(value_310) || 1)),
          payload: {
            sourceCallAnonymousSms: true,
            sourceCallNumberId: Math.max(1, Math.floor(Number(value_310) || 1)),
            sourceCallBatchId: sourceCallBatchId_2
          }
        };
      value_316.translation && (options_318.translation = value_316.translation, options_318.showTranslation = true);
      const value_319 = await window.imApp.appendFriendMessage(value_311.id, options_318, {
        silent: true
      });
      if (!value_319) throw new Error("iMessage 消息保存失败");
      sent_2 += 1;
    }
    return {
      sent: sent_2,
      blocked: false
    };
  }
  function handleAction_42(value_320) {
    const value_321 = new Date(Number(value_320) || 0);
    if (Number.isNaN(value_321.getTime())) return "";
    const value_322 = new Date();
    if (value_321.toDateString() === value_322.toDateString()) return new Intl.DateTimeFormat("zh-CN", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(value_321);
    const value_323 = new Date(value_322.getFullYear(), value_322.getMonth(), value_322.getDate() - 1);
    if (value_321.toDateString() === value_323.toDateString()) return "昨天";
    return new Intl.DateTimeFormat("zh-CN", {
      month: "numeric",
      day: "numeric"
    }).format(value_321);
  }
  function handleAction_43(value_324) {
    const value_325 = new Date(Number(value_324) || Date.now());
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(value_325);
  }
  function handleAction_44(element, contact_326) {
    if (!element) return;
    element.replaceChildren();
    const src_2 = handleAction_12(contact_326?.avatarUrl || contact_326?.avatar, 4000);
    if (src_2) {
      const element_329 = document.createElement("img");
      element_329.src = src_2;
      element_329.alt = "";
      element.appendChild(element_329);
      return;
    }
    const element_328 = document.createElement("i");
    element_328.className = contact_326?.type === "npc" ? "fas fa-robot" : "fas fa-user";
    element.appendChild(element_328);
  }
  function handleAction_45(element_330, className_2, textContent_2) {
    element_330.replaceChildren();
    const element_333 = document.createElement("div");
    element_333.className = "call-empty";
    const element_334 = document.createElement("i");
    element_334.className = className_2;
    const element_335 = document.createElement("span");
    element_335.textContent = textContent_2;
    element_333.append(element_334, element_335);
    element_330.appendChild(element_333);
  }
  function handleAction_46(value_336, value_337 = {}) {
    const element_338 = document.createElement("button");
    element_338.type = "button";
    element_338.className = "call-list-item";
    element_338.dataset.callFriendId = String(value_336.id);
    const element_339 = document.createElement("span");
    element_339.className = "call-list-avatar";
    handleAction_44(element_339, value_336);
    const element_340 = document.createElement("span");
    element_340.className = "call-list-copy";
    const element_341 = document.createElement("strong");
    element_341.textContent = handleAction_21(value_336);
    const element_342 = document.createElement("span");
    element_342.textContent = value_337.subtitle || (value_336.type === "npc" ? "NPC" + (value_336.realName ? " · " + value_336.realName : "") : value_336.realName || value_336.signature || "Char");
    element_340.append(element_341, element_342);
    const element_343 = document.createElement("span");
    element_343.className = "call-list-meta";
    if (value_337.time) {
      const element_345 = document.createElement("time");
      element_345.textContent = value_337.time;
      element_343.appendChild(element_345);
    }
    const element_344 = document.createElement("span");
    return element_344.className = "call-list-info", element_344.innerHTML = "<i class=\"fas fa-circle-info\" aria-hidden=\"true\"></i>", element_343.appendChild(element_344), element_338.append(element_339, element_340, element_343), element_338;
  }
  function handleAction_47(value_346, value_347, value_348 = "") {
    const toLocaleLowerCase_349 = handleAction_12(value_347, 200).toLocaleLowerCase("zh-CN");
    if (!toLocaleLowerCase_349) return true;
    return (handleAction_21(value_346) + " " + (value_346?.realName || "") + " " + (value_346?.signature || "") + " " + value_348).toLocaleLowerCase("zh-CN").includes(toLocaleLowerCase_349);
  }
  function handleAction_48() {
    if (!value_6?.recentsList) return;
    const value_350 = value_6.recentsSearch?.value || "",
      filter_351 = buildRecents_2(getState_2(), window.imData?.friends || []).filter(value_352 => handleAction_47(value_352.friend, value_350, value_352.lastMessage?.text || ""));
    if (filter_351.length === 0) {
      handleAction_45(value_6.recentsList, "fas fa-clock-rotate-left", value_350 ? "没有符合的通话记录" : "还没有匿名短信记录");
      return;
    }
    value_6.recentsList.replaceChildren(...filter_351.map(value_353 => handleAction_46(value_353.friend, {
      subtitle: "" + (value_353.lastMessage.role === "anonymous" ? "你：" : "") + value_353.lastMessage.text,
      time: handleAction_42(value_353.thread.updatedAt)
    })));
  }
  function handleAction_49() {
    if (!value_6?.contactsList) return;
    const value_354 = value_6.contactsSearch?.value || "",
      filter_355 = getEligibleContacts_2(window.imData?.friends || []).filter(value_356 => handleAction_47(value_356, value_354));
    if (filter_355.length === 0) {
      handleAction_45(value_6.contactsList, "fas fa-address-book", value_354 ? "没有符合的联络人" : "请先在 iMessage 添加 Char 或 NPC");
      return;
    }
    value_6.contactsList.replaceChildren(...filter_355.map(value_357 => handleAction_46(value_357)));
  }
  function handleAction_50(items_358, element_359) {
    let text_360 = "";
    items_358.forEach((message_361, value_362) => {
      const toDateString_363 = new Date(message_361.timestamp).toDateString();
      if (text_360 && toDateString_363 !== text_360) {
        const element_369 = document.createElement("div");
        element_369.className = "call-thread-date";
        element_369.textContent = handleAction_43(message_361.timestamp);
        element_359.appendChild(element_369);
      }
      text_360 = toDateString_363;
      const element_364 = document.createElement("div");
      element_364.className = "call-message-row " + message_361.role;
      const value_365 = items_358[value_362 - 1],
        value_366 = items_358[value_362 + 1];
      if (value_365?.role === message_361.role && new Date(value_365.timestamp).toDateString() === toDateString_363) element_364.classList.add("has-prev");
      if (value_366?.role === message_361.role && new Date(value_366.timestamp).toDateString() === toDateString_363) element_364.classList.add("has-next");
      const element_367 = document.createElement("div");
      element_367.className = "call-message-bubble";
      const element_368 = document.createElement("div");
      element_368.className = "call-message-original";
      element_368.textContent = message_361.text;
      element_367.appendChild(element_368);
      if (message_361.translation) {
        const element_370 = document.createElement("div");
        element_370.className = "call-message-translation";
        element_370.textContent = message_361.translation;
        element_367.appendChild(element_370);
      }
      element_364.appendChild(element_367);
      element_359.appendChild(element_364);
    });
  }
  function handleAction_51() {
    if (!value_6?.threadMessages || !friendId_5) return;
    const handleAction_22_371 = handleAction_22(friendId_5);
    if (!handleAction_22_371) {
      handleAction_55();
      window.showToast?.("联络人已不存在");
      return;
    }
    value_6.threadName.textContent = handleAction_21(handleAction_22_371);
    handleAction_44(value_6.threadAvatar, handleAction_22_371);
    const value_372 = getState_2().threads[friendId_5] || handleAction_15({
        friendId: friendId_5,
        messages: []
      }, friendId_5),
      currentNumber_373 = value_372.currentNumber,
      filter_374 = value_372.messages.filter(value_377 => value_377.numberId === currentNumber_373);
    value_6.thread.classList.toggle("is-blocked", value_372.blocked);
    if (value_6.input) value_6.input.disabled = value_372.blocked;
    if (value_6.aiButton) value_6.aiButton.disabled = value_372.blocked || enabled;
    value_6.threadMessages.replaceChildren();
    const element_375 = document.createElement("div");
    element_375.className = "call-thread-intro";
    const value_376 = filter_374[0]?.timestamp || value_372.numberStartedAt || Date.now();
    element_375.textContent = "讯息 · SMS\n" + handleAction_43(value_376);
    value_6.threadMessages.appendChild(element_375);
    handleAction_50(filter_374, value_6.threadMessages);
    if (value_372.blocked) {
      const element_378 = document.createElement("div");
      element_378.className = "call-blocked-state";
      const element_379 = document.createElement("strong");
      element_379.textContent = "你已被拉黑";
      const element_380 = document.createElement("button");
      element_380.type = "button";
      element_380.className = "call-use-new-number";
      element_380.dataset.callUseNewNumber = "true";
      element_380.textContent = "使用新号码";
      element_378.append(element_379, element_380);
      value_6.threadMessages.appendChild(element_378);
    }
    handleAction_32();
  }
  function handleAction_52() {
    if (enabled_63 && count_64 > 0) handleAction_69(count_64);else handleAction_51();
  }
  function switchTab_2(value_381) {
    const activeTab_2 = value_381 === "contacts" ? "contacts" : "recents";
    text_7 = activeTab_2;
    Object.entries(value_6?.pages || {}).forEach(([value_383, element_384]) => {
      const value_385 = value_383 === activeTab_2;
      if (!value_385 && element_384.contains(document.activeElement)) value_6.tabButtons.find(value_386 => value_386.dataset.callTab === activeTab_2)?.focus({
        preventScroll: true
      });
      element_384.classList.toggle("active", value_385);
      element_384.hidden = !value_385;
      element_384.inert = !value_385;
      element_384.setAttribute("aria-hidden", String(!value_385));
    });
    value_6?.tabButtons.forEach(element_387 => {
      const value_388 = element_387.dataset.callTab === activeTab_2;
      element_387.classList.toggle("active", value_388);
      element_387.setAttribute("aria-selected", String(value_388));
    });
    if (value_6?.tabPill) value_6.tabPill.dataset.activeTab = activeTab_2;
    if (activeTab_2 === "contacts") handleAction_49();else handleAction_48();
  }
  function openThread_2(value_389, value_390 = text_7) {
    const value_391 = typeof value_389 === "object" ? value_389 : handleAction_22(value_389);
    if (!value_391 || value_391.type !== "char" && value_391.type !== "npc") return false;
    friendId_5 = String(value_391.id);
    text_9 = value_390 === "contacts" ? "contacts" : "recents";
    handleAction_65(false, {
      render: false
    });
    handleAction_72();
    handleAction_68();
    if (value_6.input) value_6.input.value = "";
    return value_6.thread.hidden = false, value_6.thread.inert = false, value_6.thread.setAttribute("aria-hidden", "false"), value_6.threadBack?.focus({
      preventScroll: true
    }), value_6.pagesRoot.inert = true, value_6.pagesRoot.setAttribute("aria-hidden", "true"), value_6.topbar.hidden = true, value_6.nav.hidden = true, handleAction_51(), true;
  }
  function handleAction_55() {
    if (!value_6?.thread || value_6.thread.hidden) return;
    if (count_11) cancelAnimationFrame(count_11);
    count_11 = 0;
    items.forEach(value_392 => clearTimeout(value_392));
    items = [];
    if (value_6.thread.contains(document.activeElement)) document.activeElement?.blur?.();
    value_6.thread.inert = true;
    value_6.thread.setAttribute("aria-hidden", "true");
    value_6.thread.hidden = true;
    value_6.pagesRoot.inert = false;
    value_6.pagesRoot.setAttribute("aria-hidden", "false");
    value_6.topbar.hidden = false;
    value_6.nav.hidden = false;
    handleAction_65(false, {
      render: false
    });
    handleAction_72();
    handleAction_68();
    friendId_5 = "";
    switchTab_2(text_9);
  }
  async function handleAction_56() {
    if (!friendId_5 || !value_6?.input) return false;
    const value_393 = getState_2().threads[friendId_5],
      numberId_3 = enabled_63 && count_64 > 0 ? count_64 : value_393?.currentNumber || 1;
    if (handleAction_16(value_393, numberId_3).blocked) return window.showToast?.("你已被拉黑，请先使用新号码"), false;
    const value_2 = handleAction_12(value_6.input.value);
    if (!value_2) return false;
    value_6.input.value = "";
    try {
      return await handleAction_38(friendId_5, [{
        role: "anonymous",
        text: value_2
      }], {
        numberId: numberId_3
      }), handleAction_52(), handleAction_48(), true;
    } catch (value_396) {
      return value_6.input.value = value_2, console.error("[call] Failed to save anonymous message", value_396), window.showToast?.("匿名短信保存失败"), false;
    }
  }
  async function handleAction_57() {
    if (!friendId_5) return false;
    try {
      const value_397 = await startNewNumber_2(friendId_5);
      if (!value_397) return false;
      if (value_6.input) value_6.input.value = "";
      return handleAction_65(false, {
        render: false
      }), handleAction_72(), handleAction_51(), handleAction_48(), window.showToast?.("已使用新的匿名号码"), true;
    } catch (value_398) {
      return console.error("[call] Failed to start a new anonymous number", value_398), window.showToast?.("新号码启用失败"), false;
    }
  }
  function handleAction_58(value_399) {
    enabled = value_399 === true;
    if (!value_6?.aiButton) return;
    const value_400 = friendId_5 ? getState_2().threads[friendId_5] : null,
      value_401 = enabled_63 && count_64 > 0 ? count_64 : value_400?.currentNumber || 1,
      value_402 = friendId_5 && handleAction_16(value_400, value_401).blocked === true;
    value_6.aiButton.disabled = enabled || value_402;
    value_6.aiButton.classList.toggle("is-loading", enabled);
    value_6.aiButton.setAttribute("aria-label", enabled ? "正在等待联系人回复" : "让联系人回复");
    const iElement = value_6.aiButton.querySelector("i");
    if (iElement) iElement.className = enabled ? "fas fa-ellipsis" : "fas fa-microphone";
  }
  async function handleAction_59() {
    if (enabled || !friendId_5) {
      if (enabled) window.showToast?.("正在生成中");
      return false;
    }
    const friendId_6 = friendId_5,
      handleAction_22_404 = handleAction_22(friendId_6);
    if (!handleAction_22_404) return false;
    const value_405 = getState_2().threads[friendId_6] || handleAction_15({
        friendId: friendId_6,
        messages: []
      }, friendId_6),
      numberId_4 = enabled_63 && count_64 > 0 ? count_64 : value_405.currentNumber;
    if (handleAction_16(value_405, numberId_4).blocked) return window.showToast?.("你已被拉黑，请先使用新号码"), false;
    handleAction_58(true);
    try {
      const value_407 = getState_2().threads[friendId_6] || handleAction_15({
          friendId: friendId_6,
          messages: []
        }, friendId_6),
        value_408 = await handleAction_37(handleAction_22_404, value_407, numberId_4);
      if (friendId_5 !== friendId_6) return false;
      await handleAction_38(friendId_6, value_408.messages.map(value_409 => ({
        role: "char",
        ...value_409
      })), {
        block: value_408.shouldBlock,
        blockReason: value_408.blockReason,
        numberId: numberId_4
      });
      handleAction_52();
      handleAction_48();
      if (value_408.imessageMessages.length > 0) try {
        const value_410 = await handleAction_41(handleAction_22_404, value_408.imessageMessages, numberId_4);
        if (value_410.blocked) window.showToast?.("该联系人目前无法向你发送 iMessage");
      } catch (value_411) {
        console.error("[call] Failed to deliver semantic iMessage side channel", value_411);
        window.showToast?.("Call 回复已保存，但 iMessage 发送失败");
      }
      return true;
    } catch (value_412) {
      console.error("[call] Anonymous reply failed", value_412);
      if (!window.u2Api?.isRequestError?.(value_412) || !window.u2Api.reportError(value_412, {
        operation: "匿名短信生成"
      })) window.showToast?.(value_412?.message || "匿名短信生成失败");
      return false;
    } finally {
      handleAction_58(false);
    }
  }
  function open_2() {
    if (!value_6?.view) return;
    if (!value_6.thread.hidden) handleAction_55();
    if (value_6.recentsSearch) value_6.recentsSearch.value = "";
    if (value_6.contactsSearch) value_6.contactsSearch.value = "";
    switchTab_2("recents");
    value_6.view.inert = false;
    value_6.view.setAttribute("aria-hidden", "false");
    if (typeof window.openView === "function") window.openView(value_6.view);else value_6.view.classList.add("active");
  }
  function close_2() {
    if (!value_6?.view) return;
    if (!value_6.thread.hidden) handleAction_55();
    if (value_6.view.contains(document.activeElement)) document.activeElement?.blur?.();
    value_6.view.inert = true;
    value_6.view.setAttribute("aria-hidden", "true");
    if (typeof window.closeView === "function") window.closeView(value_6.view);else value_6.view.classList.remove("active");
  }
  function handleAction_62() {
    value_6 = {
      view: document.getElementById("call-view"),
      shell: document.querySelector(".call-shell"),
      topbar: document.querySelector(".call-topbar"),
      back: document.getElementById("call-back-btn"),
      pages: {
        recents: document.getElementById("call-recents-page"),
        contacts: document.getElementById("call-contacts-page")
      },
      pagesRoot: document.querySelector(".call-pages"),
      recentsList: document.getElementById("call-recents-list"),
      contactsList: document.getElementById("call-contacts-list"),
      recentsSearch: document.getElementById("call-recents-search"),
      contactsSearch: document.getElementById("call-contacts-search"),
      nav: document.querySelector(".call-floating-nav"),
      tabPill: document.querySelector(".call-tab-pill"),
      tabButtons: Array.from(document.querySelectorAll("[data-call-tab]")),
      thread: document.getElementById("call-thread-page"),
      threadBack: document.getElementById("call-thread-back"),
      threadAvatar: document.getElementById("call-thread-avatar"),
      threadName: document.getElementById("call-thread-name"),
      threadMessages: document.getElementById("call-thread-messages"),
      input: document.getElementById("call-message-input"),
      aiButton: document.getElementById("call-ai-button"),
      threadHistory: document.getElementById("call-thread-history"),
      composerPlus: document.getElementById("call-composer-plus"),
      plusMenu: document.getElementById("call-plus-menu"),
      historyModal: document.getElementById("call-history-modal"),
      historyList: document.getElementById("call-history-list"),
      historyCurrent: document.getElementById("call-history-current"),
      historyCurrentLabel: document.getElementById("call-history-current-label")
    };
    value_6.pagesRoot.inert = false;
  }
  let enabled_63 = false,
    count_64 = 0;
  function handleAction_65(value_413, value_414 = {}) {
    enabled_63 = value_413 === true;
    if (!enabled_63) count_64 = 0;
    value_6?.thread?.classList.toggle("show-history", enabled_63);
    value_6?.threadHistory?.classList.toggle("active", enabled_63);
    value_6?.threadHistory?.setAttribute("aria-pressed", String(enabled_63));
    value_6?.threadHistory?.setAttribute("aria-label", "选择号码会话");
    handleAction_72();
    if (value_414.render === false) return;
    if (enabled_63) handleAction_69();else handleAction_51();
  }
  function handleAction_66() {
    handleAction_67();
  }
  function handleAction_67() {
    if (!value_6?.historyModal || !friendId_5) return;
    const value_415 = getState_2().threads[friendId_5] || handleAction_15({
        friendId: friendId_5,
        messages: []
      }, friendId_5),
      value_416 = new Map(),
      value_417 = new Set(value_415.deletedNumbers || []);
    for (let count_418 = 1; count_418 < value_415.currentNumber; count_418 += 1) {
      if (value_417.has(count_418)) continue;
      value_416.set(count_418, []);
    }
    value_415.messages.filter(value_419 => value_419.numberId < value_415.currentNumber && !value_417.has(value_419.numberId)).forEach(value_420 => {
      if (!value_416.has(value_420.numberId)) value_416.set(value_420.numberId, []);
      value_416.get(value_420.numberId).push(value_420);
    });
    if (value_6.historyCurrentLabel) value_6.historyCurrentLabel.textContent = "最新号码 " + value_415.currentNumber;
    value_6.historyList?.replaceChildren();
    if (value_416.size === 0) {
      const element_421 = document.createElement("div");
      element_421.className = "call-history-list-empty";
      element_421.textContent = "还没有旧号码会话";
      value_6.historyList?.appendChild(element_421);
    } else Array.from(value_416.entries()).sort(([value_422], [value_423]) => value_423 - value_422).forEach(([value_424, value_425]) => {
      const value_426 = value_425[value_425.length - 1],
        handleAction_16_427 = handleAction_16(value_415, value_424),
        element_428 = document.createElement("button");
      element_428.type = "button";
      element_428.className = "call-history-session";
      element_428.dataset.callHistoryNumber = String(value_424);
      const element_429 = document.createElement("span");
      element_429.className = "call-history-number-icon";
      element_429.innerHTML = "<i class=\"fas fa-phone-flip\" aria-hidden=\"true\"></i>";
      const element_430 = document.createElement("span"),
        element_431 = document.createElement("strong");
      element_431.textContent = "旧号码 " + value_424;
      const element_432 = document.createElement("small");
      element_432.textContent = (handleAction_16_427.blocked ? "已拉黑" : "可继续") + " · " + (value_426?.text || "空会话");
      element_430.append(element_431, element_432);
      const element_433 = document.createElement("span");
      element_433.className = "call-history-session-meta";
      const element_434 = document.createElement("time");
      element_434.textContent = value_426 ? handleAction_42(value_426.timestamp) : "";
      element_433.append(element_434);
      element_433.insertAdjacentHTML("beforeend", "<i class=\"fas fa-chevron-right\" aria-hidden=\"true\"></i>");
      element_428.append(element_429, element_430, element_433);
      value_6.historyList?.appendChild(element_428);
    });
    handleAction_72();
    value_6.historyModal.hidden = false;
    requestAnimationFrame(() => value_6.historyModal?.classList.add("open"));
  }
  function handleAction_68() {
    if (!value_6?.historyModal || value_6.historyModal.hidden) return;
    value_6.historyModal.classList.remove("open");
    value_6.historyModal.hidden = true;
  }
  function handleAction_69(value_435 = count_64) {
    if (!value_6?.threadMessages || !friendId_5) return;
    const handleAction_22_436 = handleAction_22(friendId_5);
    if (!handleAction_22_436) {
      handleAction_55();
      return;
    }
    const value_437 = getState_2().threads[friendId_5] || handleAction_15({
        friendId: friendId_5,
        messages: []
      }, friendId_5),
      floor_438 = Math.floor(Number(value_435));
    if (!Number.isFinite(floor_438) || floor_438 < 1 || floor_438 >= value_437.currentNumber) {
      handleAction_65(false);
      return;
    }
    count_64 = floor_438;
    const filter_439 = value_437.messages.filter(value_443 => value_443.numberId === floor_438),
      handleAction_16_440 = handleAction_16(value_437, floor_438);
    value_6.thread.classList.toggle("is-blocked", handleAction_16_440.blocked);
    if (value_6.input) value_6.input.disabled = handleAction_16_440.blocked;
    if (value_6.aiButton) value_6.aiButton.disabled = handleAction_16_440.blocked || enabled;
    value_6.threadName.textContent = handleAction_21(handleAction_22_436) + " · 号码 " + floor_438;
    handleAction_44(value_6.threadAvatar, handleAction_22_436);
    value_6.threadMessages.replaceChildren();
    const element_441 = document.createElement("div");
    element_441.className = "call-thread-intro call-history-intro";
    const value_442 = filter_439[0]?.timestamp || handleAction_16_440.startedAt || value_437.createdAt || Date.now();
    element_441.textContent = "讯息 · SMS · 旧号码 " + floor_438 + "\n" + handleAction_43(value_442);
    value_6.threadMessages.appendChild(element_441);
    handleAction_50(filter_439, value_6.threadMessages);
    if (filter_439.length === 0) {
      const element_444 = document.createElement("div");
      element_444.className = "call-history-session-empty";
      element_444.textContent = "这个号码还没有讯息";
      value_6.threadMessages.appendChild(element_444);
    }
    if (handleAction_16_440.blocked) {
      const element_445 = document.createElement("div");
      element_445.className = "call-blocked-state";
      const element_446 = document.createElement("strong");
      element_446.textContent = "这个号码已被拉黑";
      const element_447 = document.createElement("button");
      element_447.type = "button";
      element_447.className = "call-use-new-number";
      element_447.dataset.callUseNewNumber = "true";
      element_447.textContent = "使用新号码";
      element_445.append(element_446, element_447);
      value_6.threadMessages.appendChild(element_445);
    }
    handleAction_32();
  }
  function handleAction_70() {
    if (!value_6?.plusMenu) return;
    if (value_6.plusMenu.hidden) handleAction_71();else handleAction_72();
  }
  function handleAction_71() {
    if (!value_6?.plusMenu) return;
    value_6.plusMenu.hidden = false;
    value_6.composerPlus?.classList.add("active");
    value_6.composerPlus?.setAttribute("aria-expanded", "true");
  }
  function handleAction_72() {
    if (!value_6?.plusMenu) return;
    value_6.plusMenu.hidden = true;
    value_6.composerPlus?.classList.remove("active");
    value_6.composerPlus?.setAttribute("aria-expanded", "false");
  }
  async function handleAction_73() {
    if (!friendId_5) return false;
    const value_448 = friendId_5,
      value_449 = getState_2().threads[value_448];
    if (!value_449) return window.showToast?.("当前会话已经是空的"), false;
    const value_450 = enabled_63 && count_64 > 0 ? count_64 : value_449.currentNumber,
      filter_451 = value_449.messages.filter(value_452 => value_452.numberId === value_450);
    if (filter_451.length === 0) return window.showToast?.("当前会话已经是空的"), false;
    try {
      return await handleAction_19(value_453 => {
        const value_454 = value_453.threads[value_448];
        if (!value_454) return value_453;
        const messages_6 = value_454.messages.filter(value_457 => value_457.numberId !== value_450),
          numberStates_5 = {
            ...value_454.numberStates
          };
        return numberStates_5[value_450] = {
          ...handleAction_16(value_454, value_450),
          startedAt: Date.now()
        }, value_453.threads[value_448] = {
          ...value_454,
          messages: messages_6,
          numberStartedAt: value_450 === value_454.currentNumber ? Date.now() : value_454.numberStartedAt,
          numberStates: numberStates_5,
          updatedAt: messages_6[messages_6.length - 1]?.timestamp || value_454.createdAt
        }, value_453;
      }, "call-clear-current-context"), handleAction_52(), handleAction_48(), window.showToast?.("已清空本次会话和上下文"), true;
    } catch (value_458) {
      return console.error("[call] Failed to clear current context", value_458), window.showToast?.("清空会话失败"), false;
    }
  }
  async function handleAction_74() {
    if (!friendId_5) return false;
    const value_459 = friendId_5,
      value_460 = getState_2().threads[value_459];
    if (!value_460) return false;
    const value_461 = enabled_63 && count_64 > 0 ? count_64 : value_460.currentNumber;
    try {
      const value_462 = await deleteSession_2(value_459, value_461);
      if (!value_462.deleted) return false;
      if (value_6.input) value_6.input.value = "";
      return handleAction_65(false, {
        render: false
      }), handleAction_51(), handleAction_48(), window.showToast?.(value_462.startedNew ? "本次会话已删除，已启用新号码" : "本次会话已删除"), true;
    } catch (value_463) {
      return console.error("[call] Failed to delete session", value_463), window.showToast?.("删除会话失败"), false;
    }
  }
  function handleAction_75() {
    if (!value_6?.view || value_6.view.dataset.callBound === "true") return;
    value_6.view.dataset.callBound = "true";
    value_6.back?.addEventListener("click", close_2);
    value_6.threadBack?.addEventListener("click", handleAction_55);
    value_6.tabButtons.forEach(value_464 => value_464.addEventListener("click", () => switchTab_2(value_464.dataset.callTab)));
    value_6.recentsSearch?.addEventListener("input", handleAction_48);
    value_6.contactsSearch?.addEventListener("input", handleAction_49);
    [value_6.recentsList, value_6.contactsList].forEach(value_465 => value_465?.addEventListener("click", event_466 => {
      const closest_467 = event_466.target.closest("[data-call-friend-id]");
      if (closest_467) openThread_2(closest_467.dataset.callFriendId, text_7);
    }));
    value_6.threadMessages?.addEventListener("click", event_468 => {
      const closest_469 = event_468.target.closest("[data-call-use-new-number]");
      if (closest_469) void handleAction_57();
    });
    value_6.input?.addEventListener("keydown", event_470 => {
      if (event_470.isComposing || event_470.keyCode === 229) return;
      if (event_470.key !== "Enter" || event_470.shiftKey || event_470.ctrlKey || event_470.altKey || event_470.metaKey) return;
      event_470.preventDefault();
      void handleAction_56();
    });
    value_6.input?.addEventListener("focus", handleAction_32);
    value_6.aiButton?.addEventListener("click", event_471 => {
      event_471.preventDefault();
      void handleAction_59();
    });
    value_6.threadHistory?.addEventListener("click", event_472 => {
      event_472.preventDefault();
      handleAction_66();
    });
    value_6.historyModal?.addEventListener("click", event_473 => {
      if (event_473.target.closest("[data-call-history-close]")) {
        handleAction_68();
        return;
      }
      const closest_474 = event_473.target.closest("[data-call-history-number]");
      if (!closest_474) return;
      handleAction_68();
      count_64 = Number(closest_474.dataset.callHistoryNumber);
      handleAction_65(true, {
        render: false
      });
      handleAction_69(count_64);
    });
    value_6.historyCurrent?.addEventListener("click", () => {
      handleAction_68();
      handleAction_65(false);
    });
    value_6.composerPlus?.addEventListener("click", event_475 => {
      event_475.preventDefault();
      event_475.stopPropagation();
      handleAction_70();
    });
    value_6.plusMenu?.addEventListener("click", event_476 => {
      event_476.stopPropagation();
      const closest_477 = event_476.target.closest("[data-action]");
      if (!closest_477 || closest_477.disabled) return;
      handleAction_72();
      if (closest_477.dataset.action === "clear-context") {
        const value_478 = window.confirm?.("确定清空本次会话记录吗？清空后，当前号码的 AI 上下文也会被清除。") ?? true;
        if (value_478) void handleAction_73();
      }
      if (closest_477.dataset.action === "delete-session") {
        const value_479 = window.confirm?.("确定删除本次会话吗？该号码的记录和上下文将被彻底移除。") ?? true;
        if (value_479) void handleAction_74();
      }
      if (closest_477.dataset.action === "new-number") void handleAction_57();
    });
    value_6.view.addEventListener("click", event_480 => {
      if (!event_480.target.closest("#call-plus-menu, #call-composer-plus")) handleAction_72();
    });
    value_6.view.addEventListener("keydown", value_481 => {
      if (value_481.key !== "Escape") return;
      if (!value_6.historyModal?.hidden) handleAction_68();else {
        if (!value_6.plusMenu?.hidden) handleAction_72();else {
          if (enabled_63) handleAction_65(false);else {
            if (!value_6.thread.hidden) handleAction_55();else close_2();
          }
        }
      }
    });
  }
  function handleAction_76() {
    const test_482 = /Android/i.test(navigator.userAgent || "");
    if (!test_482 || !window.mobileInputCompat?.registerFocusScope || value_10) return;
    const nativeInsetsOnly_2 = window.u2NativeBridge?.isNativeAndroid?.() === true;
    value_10 = window.mobileInputCompat.registerFocusScope({
      selector: "#call-thread-page",
      priority: 40,
      preferFocusScope: true,
      nativeInsetsOnly: nativeInsetsOnly_2,
      followViewportOrigin: true,
      resolveViewportRoot: (value_484, value_485) => value_485?.closest("#call-view") || value_485,
      resolveScrollContainer: (value_486, element_487) => element_487?.querySelector(".call-thread-messages") || null,
      scrollBehavior: "latest",
      viewportClassName: "u2-android-call-viewport-sized",
      viewportHeightCssVariable: "--u2-android-call-viewport-height",
      viewportTopCssVariable: "--u2-android-call-viewport-top"
    });
  }
  function handleAction_77() {
    handleAction_62();
    if (!value_6.view) return;
    handleAction_75();
    handleAction_76();
    switchTab_2("recents");
  }
  window.imApp = window.imApp || {};
  window.imApp.buildCallAnonymousSmsMemoryContext = buildCallAnonymousSmsMemoryContext_2;
  window.callApp = {
    open: open_2,
    close: close_2,
    switchTab: switchTab_2,
    openThread: openThread_2,
    normalizeState: normalizeState_2,
    getEligibleContacts: getEligibleContacts_2,
    buildRecents: buildRecents_2,
    buildAnonymousSmsContext: buildCallAnonymousSmsMemoryContext_2,
    buildPrompt: buildPrompt_2,
    parseReply: parseReply_2,
    startNewNumber: startNewNumber_2,
    deleteSession: deleteSession_2,
    getState: getState_2
  };
  (window.u2OnStorageReady || (handleDOMContentLoaded => {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", handleDOMContentLoaded, {
      once: true
    });else handleDOMContentLoaded();
  }))(handleAction_77);
})();
