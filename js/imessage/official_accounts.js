(function initOfficialAccounts(value_2) {
  'use strict';

  const id_2 = "u2-official-youtu",
    text_4 = "有兔",
    text_5 = "嗨，我是有兔。告诉我你想做的主题、状态栏或世界书，我会生成真实预览，满意后可以存为预设。",
    content_3 = "嗨，我是有兔。你可以让我制作 iMessage 与线下主题、线下提示词条目、线下 HTML 模板、世界书，也能为 Char 或当前 User 撰写人设。告诉我用途、风格和目标；涉及写入时，我会先给你预览，确认后再应用。",
    version_2 = 2,
    value_7 = new Set(["status_template", "status_css", "home_css", "chat_css", "bubble_css", "group_css"]),
    value_8 = new Set(["offline_theme", "offline_prompt", "offline_html_template", "char_persona", "user_persona"]),
    value_9 = new Set([...value_7, "worldbook", ...value_8]),
    value_10 = new Set(["status_template", "status_css", "bubble_css"]),
    value_11 = new Map();
  let value_12 = null;
  const text_13 = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 96 96\"><rect width=\"96\" height=\"96\" rx=\"25\" fill=\"#111\"/><rect x=\"29\" y=\"15\" width=\"14\" height=\"38\" rx=\"9\" fill=\"#fff\" transform=\"rotate(-7 36 34)\"/><rect x=\"53\" y=\"15\" width=\"14\" height=\"38\" rx=\"9\" fill=\"#fff\" transform=\"rotate(7 60 34)\"/><rect x=\"22\" y=\"39\" width=\"52\" height=\"43\" rx=\"23\" fill=\"#fff\"/></svg>",
    value_14 = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(text_13);
  function handleAction_15(value_76) {
    return String(value_76 == null ? "" : value_76).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function handleAction_16(value_77) {
    if (value_77 == null) return value_77;
    if (typeof structuredClone === "function") return structuredClone(value_77);
    return JSON.parse(JSON.stringify(value_77));
  }
  function handleAction_17(value_78) {
    return JSON.stringify(value_78 == null ? null : value_78);
  }
  function handleAction_18() {
    const currentAccountId = value_2.getCurrentAccountId?.(),
      value_79 = Array.isArray(value_2.getAccounts?.()) ? value_2.getAccounts() : [];
    return currentAccountId == null ? null : value_79.find(value_80 => String(value_80?.id) === String(currentAccountId)) || null;
  }
  function handleAction_19(value_81) {
    const css_2 = String(value_81 || "").slice(0, 50000);
    if (!css_2.trim()) return {
      valid: false,
      error: "CSS 代码为空"
    };
    if (/<\/?(?:script|iframe|object|embed)\b/i.test(css_2) || /@import\b|(?:javascript|vbscript):|expression\s*\(/i.test(css_2)) return {
      valid: false,
      error: "CSS 中包含不安全内容"
    };
    return {
      valid: true,
      css: css_2
    };
  }
  function validate_2(value_83, message_84 = {}) {
    if (value_83 === "offline_theme") {
      const handleAction_19_85 = handleAction_19(message_84.customCss);
      if (!handleAction_19_85.valid) return handleAction_19_85;
      const trim_86 = String(message_84.narrativeColor || "").trim(),
        trim_87 = String(message_84.dialogueColor || "").trim();
      if (!/^#[0-9a-f]{6}$/i.test(trim_86) || !/^#[0-9a-f]{6}$/i.test(trim_87)) return {
        valid: false,
        error: "线下主题颜色必须使用 6 位十六进制色值"
      };
      return {
        valid: true,
        payload: {
          narrativeColor: trim_86.toUpperCase(),
          dialogueColor: trim_87.toUpperCase(),
          customCss: handleAction_19_85.css
        }
      };
    }
    if (value_83 === "offline_prompt") {
      const name_2 = String(message_84.name || "").trim().slice(0, 80),
        content_2 = String(message_84.content || "").trim().slice(0, 20000);
      if (!name_2 || !content_2) return {
        valid: false,
        error: "线下提示词的名称和内容不能为空"
      };
      return {
        valid: true,
        payload: {
          name: name_2,
          content: content_2,
          enabled: message_84.enabled !== false
        }
      };
    }
    if (value_83 === "offline_html_template") {
      const imOfflineRegex_90 = value_2.imOfflineRegex;
      if (!imOfflineRegex_90?.validateHtmlTemplateRule) return {
        valid: false,
        error: "线下 HTML 模板引擎未加载"
      };
      const validateHtmlTemplateRule_91 = imOfflineRegex_90.validateHtmlTemplateRule(message_84);
      if (!validateHtmlTemplateRule_91.valid) return {
        valid: false,
        error: validateHtmlTemplateRule_91.error
      };
      const string = String(validateHtmlTemplateRule_91.rule.html || "");
      if (/<\/?(?:script|iframe|object|embed|form|input|button)\b/i.test(string) || /\son[a-z]+\s*=|(?:javascript|vbscript):/i.test(string)) return {
        valid: false,
        error: "HTML 模板中包含不允许的标签或事件"
      };
      const sanitizeHtmlTemplate_92 = value_2.imApp?.sanitizeHtmlTemplate?.(string);
      if (!String(sanitizeHtmlTemplate_92 || "").trim()) return {
        valid: false,
        error: "HTML 模板不包含可用内容"
      };
      return {
        valid: true,
        payload: validateHtmlTemplateRule_91.rule
      };
    }
    if (value_83 === "char_persona" || value_83 === "user_persona") {
      const persona_2 = String(message_84.persona || "").trim().slice(0, 20000);
      if (!persona_2) return {
        valid: false,
        error: "人设正文不能为空"
      };
      return {
        valid: true,
        payload: {
          persona: persona_2
        }
      };
    }
    return {
      valid: false,
      error: "不支持的作品类型"
    };
  }
  function getSnapshot_2(value_94, value_95 = "") {
    if (value_94 === "offline_theme") return handleAction_16(value_2.imApp?.getOfflineThemeState?.().theme || null);
    if (value_94 === "offline_prompt") {
      const value_96 = value_2.imApp?.getGlobalOfflinePrompts?.() || value_2.imData?.offlinePrompts || [],
        index_2 = value_96.findIndex(value_98 => String(value_98?.id) === String(value_95));
      return index_2 >= 0 ? {
        index: index_2,
        item: handleAction_16(value_96[index_2])
      } : null;
    }
    if (value_94 === "offline_html_template") {
      const value_99 = value_2.imOfflineRegex?.normalizeHtmlTemplateRules?.(value_2.imData?.offlineHtmlTemplateRules) || [],
        index_3 = value_99.findIndex(value_101 => String(value_101?.id) === String(value_95));
      return index_3 >= 0 ? {
        index: index_3,
        item: handleAction_16(value_99[index_3])
      } : null;
    }
    if (value_94 === "char_persona") {
      const result = handleAction_30().find(value_102 => String(value_102.id) === String(value_95));
      return result ? {
        persona: String(result.persona || "")
      } : null;
    }
    if (value_94 === "user_persona") {
      const contact = value_95 === "__global_user__" ? null : value_95 ? (value_2.getAccounts?.() || []).find(value_103 => String(value_103?.id) === String(value_95)) : handleAction_18();
      return contact ? {
        accountId: String(contact.id),
        persona: String(contact.persona || "")
      } : {
        accountId: "__global_user__",
        persona: String(value_2.userState?.persona || "")
      };
    }
    return null;
  }
  function fingerprint_2(value_104, value_105 = "") {
    const handleAction_21_106 = getSnapshot_2(value_104, value_105);
    if (value_104 === "offline_prompt" || value_104 === "offline_html_template") return handleAction_21_106 ? handleAction_17(handleAction_21_106.item) : "";
    if (value_104 === "char_persona" || value_104 === "user_persona") return handleAction_21_106 ? handleAction_17(handleAction_21_106.persona) : "";
    return handleAction_21_106 ? handleAction_17(handleAction_21_106) : "";
  }
  async function handleAction_23(prompts_2, htmlTemplateRules_2) {
    if (!value_2.imApp?.saveGlobalOfflinePrompts) throw new Error("线下配置尚未就绪");
    return value_2.imApp.saveGlobalOfflinePrompts({
      prompts: prompts_2,
      presets: value_2.imData?.offlinePromptPresets || [],
      activePresetId: "",
      htmlTemplateRules: htmlTemplateRules_2
    });
  }
  async function apply_2(value_109, value_110, value_111 = "") {
    const handleAction_20_112 = validate_2(value_109, value_110);
    if (!handleAction_20_112.valid) throw new Error(handleAction_20_112.error);
    const payload_113 = handleAction_20_112.payload;
    if (value_109 === "offline_theme") {
      const previousSnapshot_2 = getSnapshot_2(value_109);
      return await value_2.imApp.saveOfflineThemeState({
        ...payload_113,
        customCssEnabled: true,
        activePresetId: ""
      }), {
        previousSnapshot: previousSnapshot_2,
        targetId: "",
        appliedFingerprint: fingerprint_2(value_109)
      };
    }
    if (value_109 === "offline_prompt") {
      const handleAction_16_118 = handleAction_16(value_2.imApp?.getGlobalOfflinePrompts?.() || value_2.imData?.offlinePrompts || []),
        handleAction_21_119 = getSnapshot_2(value_109, value_111),
        value_120 = handleAction_21_119?.item?.id || "official-offline-prompt-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
        options_121 = {
          ...(handleAction_21_119?.item || {}),
          id: value_120,
          name: payload_113.name,
          content: payload_113.content,
          enabled: payload_113.enabled,
          systemManaged: false,
          editable: true,
          deletable: true,
          alwaysEnabled: false
        };
      if (handleAction_21_119) handleAction_16_118.splice(handleAction_21_119.index, 1, options_121);else handleAction_16_118.push(options_121);
      return await handleAction_23(handleAction_16_118, value_2.imData?.offlineHtmlTemplateRules || []), {
        previousSnapshot: handleAction_21_119 ? {
          ...handleAction_21_119,
          created: false
        } : {
          created: true
        },
        targetId: value_120,
        appliedFingerprint: fingerprint_2(value_109, value_120)
      };
    }
    if (value_109 === "offline_html_template") {
      const handleAction_16_122 = handleAction_16(value_2.imOfflineRegex.normalizeHtmlTemplateRules(value_2.imData?.offlineHtmlTemplateRules)),
        handleAction_21_123 = getSnapshot_2(value_109, value_111),
        value_124 = handleAction_21_123?.item?.id || "official-offline-html-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
        options_125 = {
          ...payload_113,
          id: value_124,
          revision: Math.max(1, Number(handleAction_21_123?.item?.revision) || 0) + 1
        };
      if (handleAction_21_123) handleAction_16_122.splice(handleAction_21_123.index, 1, options_125);else handleAction_16_122.push(options_125);
      return await handleAction_23(value_2.imData?.offlinePrompts || [], handleAction_16_122), {
        previousSnapshot: handleAction_21_123 ? {
          ...handleAction_21_123,
          created: false
        } : {
          created: true
        },
        targetId: value_124,
        appliedFingerprint: fingerprint_2(value_109, value_124)
      };
    }
    if (value_109 === "char_persona") {
      const result_126 = handleAction_30().find(value_129 => String(value_129.id) === String(value_111));
      if (!result_126) throw new Error("请选择要写入的 Char");
      const previousSnapshot_3 = getSnapshot_2(value_109, value_111),
        value_128 = await value_2.imApp.commitScopedFriendChange(result_126, contact_130 => {
          contact_130.persona = payload_113.persona;
        }, {
          silent: true,
          syncSettings: true
        });
      if (!value_128) throw new Error("Char 人设保存失败");
      return {
        previousSnapshot: previousSnapshot_3,
        targetId: String(result_126.id),
        appliedFingerprint: fingerprint_2(value_109, result_126.id)
      };
    }
    const handleAction_18_114 = handleAction_18(),
      targetId_2 = handleAction_18_114 ? String(handleAction_18_114.id) : "__global_user__";
    if (value_111 && String(value_111) !== targetId_2) throw new Error("当前 User 已切换，请重新打开作品后再写入");
    const previousSnapshot_4 = getSnapshot_2(value_109, targetId_2);
    if (handleAction_18_114) {
      if (!value_2.updateAccountById?.(handleAction_18_114.id, {
        persona: payload_113.persona
      })) throw new Error("User 人设保存失败");
      await value_2.saveGlobalData?.();
    } else {
      value_2.userState = value_2.userState || {};
      value_2.userState.persona = payload_113.persona;
      if (!(await value_2.saveGlobalData?.())) throw new Error("User 人设保存失败");
    }
    return {
      previousSnapshot: previousSnapshot_4,
      targetId: targetId_2,
      appliedFingerprint: fingerprint_2(value_109, targetId_2)
    };
  }
  async function restore_2(value_131, value_132, contact_133) {
    if (value_131 === "offline_theme") return await value_2.imApp.saveOfflineThemeState(contact_133), true;
    if (value_131 === "offline_prompt") {
      const handleAction_16_134 = handleAction_16(value_2.imApp?.getGlobalOfflinePrompts?.() || value_2.imData?.offlinePrompts || []),
        index_135 = handleAction_16_134.findIndex(value_136 => String(value_136?.id) === String(value_132));
      if (index_135 < 0) throw new Error("原提示词条目已不存在");
      if (contact_133?.created) handleAction_16_134.splice(index_135, 1);else handleAction_16_134.splice(index_135, 1, contact_133.item);
      return await handleAction_23(handleAction_16_134, value_2.imData?.offlineHtmlTemplateRules || []), true;
    }
    if (value_131 === "offline_html_template") {
      const handleAction_16_137 = handleAction_16(value_2.imOfflineRegex.normalizeHtmlTemplateRules(value_2.imData?.offlineHtmlTemplateRules)),
        index_138 = handleAction_16_137.findIndex(value_139 => String(value_139?.id) === String(value_132));
      if (index_138 < 0) throw new Error("原 HTML 模板已不存在");
      if (contact_133?.created) handleAction_16_137.splice(index_138, 1);else handleAction_16_137.splice(index_138, 1, contact_133.item);
      return await handleAction_23(value_2.imData?.offlinePrompts || [], handleAction_16_137), true;
    }
    if (value_131 === "char_persona") {
      const result_140 = handleAction_30().find(value_142 => String(value_142.id) === String(value_132));
      if (!result_140) throw new Error("原 Char 已不存在");
      const value_141 = await value_2.imApp.commitScopedFriendChange(result_140, contact_143 => {
        contact_143.persona = String(contact_133?.persona || "");
      }, {
        silent: true,
        syncSettings: true
      });
      if (!value_141) throw new Error("Char 人设撤销失败");
      return true;
    }
    if (value_132 === "__global_user__") {
      value_2.userState = value_2.userState || {};
      value_2.userState.persona = String(contact_133?.persona || "");
      if (!(await value_2.saveGlobalData?.())) throw new Error("User 人设撤销失败");
      return true;
    }
    if (!value_2.updateAccountById?.(value_132, {
      persona: String(contact_133?.persona || "")
    })) throw new Error("原 Apple ID 已不存在");
    return await value_2.saveGlobalData?.(), true;
  }
  async function saveOfflineThemePreset_2(value_144, value_145) {
    const handleAction_20_146 = validate_2("offline_theme", value_145);
    if (!handleAction_20_146.valid) throw new Error(handleAction_20_146.error);
    const items = value_2.imApp?.getOfflineThemeState?.().presets || [],
      name_3 = String(value_144 || "").trim().slice(0, 80),
      result_148 = items.find(value_150 => String(value_150?.name || "").toLocaleLowerCase() === name_3.toLocaleLowerCase()),
      options_149 = {
        id: result_148?.id || "offline-theme-" + Date.now(),
        name: name_3,
        ...handleAction_20_146.payload
      };
    return await value_2.imApp.saveOfflineThemePresets(result_148 ? items.map(value_151 => value_151.id === result_148.id ? options_149 : value_151) : [...items, options_149]), true;
  }
  const u2OfficialCreationAgent_2 = {
    kinds: Array.from(value_8),
    validate: validate_2,
    getSnapshot: getSnapshot_2,
    fingerprint: fingerprint_2,
    apply: apply_2,
    restore: restore_2,
    saveOfflineThemePreset: saveOfflineThemePreset_2
  };
  value_2.u2OfficialCreationAgent = u2OfficialCreationAgent_2;
  function handleAction_27(value_152 = "official") {
    if (value_2.imChat?.createMessageId) return value_2.imChat.createMessageId(value_152);
    return value_152 + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
  }
  function handleAction_28(timestamp_2 = Date.now()) {
    return {
      id: handleAction_27("official-welcome"),
      role: "assistant",
      type: "text",
      content: content_3,
      timestamp: timestamp_2
    };
  }
  function get_2() {
    return (value_2.imData?.friends || []).find(value_154 => String(value_154?.id) === id_2 && value_154.type === "official") || null;
  }
  function handleAction_30() {
    return (value_2.imData?.friends || []).filter(value_155 => value_155 && value_155.type === "char" && String(value_155.id) !== id_2);
  }
  function handleAction_31() {
    const value_156 = typeof value_2.getApiPresets === "function" ? value_2.getApiPresets() : [];
    return Array.isArray(value_156) ? value_156 : [];
  }
  function resolveApiConfig_2(value_157) {
    const trim_158 = String(value_157?.officialApiPresetId || "").trim(),
      value_159 = trim_158 ? handleAction_31().find(value_161 => String(value_161?.id) === trim_158) : null;
    if (!value_159) throw new Error("请先在右上角 office 设置中选择有兔专用 API 预设");
    const options_160 = {
      provider: value_159.provider || "openai-compatible",
      endpoint: String(value_159.endpoint || "").trim(),
      apiKey: String(value_159.apiKey || "").trim(),
      model: String(value_159.model || "").trim(),
      temperature: value_159.temperature ?? value_159.temp ?? 0.7,
      frequencyPenalty: value_159.frequencyPenalty ?? 0
    };
    if (!options_160.endpoint || !options_160.apiKey || !options_160.model) throw new Error("有兔选择的 API 预设配置不完整，请重新选择");
    return options_160;
  }
  function handleAction_33(value_162) {
    const appElement = document.getElementById("app");
    if (value_162 && appElement && value_162.parentNode !== appElement) appElement.appendChild(value_162);
    return value_162;
  }
  function handleAction_34(value_163, value_164 = null) {
    if (!value_163) return;
    value_163.inert = false;
    value_163.removeAttribute("inert");
    value_163.setAttribute("aria-hidden", "false");
    value_2.openView?.(value_163);
    if (value_164) requestAnimationFrame(() => value_164.isConnected && value_164.focus({
      preventScroll: true
    }));
  }
  function handleAction_35(value_165, value_166 = null) {
    if (!value_165) return;
    const activeElement_167 = document.activeElement;
    activeElement_167 && value_165.contains(activeElement_167) && (value_166?.isConnected && typeof value_166.focus === "function" && value_166.focus({
      preventScroll: true
    }), value_165.contains(document.activeElement) && typeof activeElement_167.blur === "function" && activeElement_167.blur());
    value_2.closeView?.(value_165);
    value_165.inert = true;
    value_165.setAttribute("inert", "");
    value_165.setAttribute("aria-hidden", "true");
  }
  function handleAction_36() {
    const u2OfficialYoutuActionElement = document.getElementById("u2-official-youtu-action");
    if (u2OfficialYoutuActionElement) u2OfficialYoutuActionElement.textContent = get_2() ? "进入" : "添加";
  }
  async function add_2() {
    if (value_2.imApp?.ensureDataReady) await value_2.imApp.ensureDataReady();
    const handleAction_29_168 = get_2();
    if (handleAction_29_168) return enter_2(handleAction_29_168);
    const now_169 = Date.now(),
      friendData = value_2.imApp.normalizeFriendData({
        id: id_2,
        type: "official",
        nickname: text_4,
        realName: text_4,
        signature: "制作主题、线下配置、世界书与人设",
        avatarUrl: value_14,
        officialConversationActive: true,
        officialApiPresetId: "",
        messages: [handleAction_28(now_169)],
        memory: value_2.imApp.createDefaultMemory?.()
      }),
      value_170 = await value_2.imApp.commitFriendsChange(() => {
        if (!get_2()) value_2.imData.friends.push(friendData);
      }, {
        friendId: id_2,
        silent: true
      });
    if (!value_170) throw new Error("有兔添加失败");
    return handleAction_36(), value_2.imChat?.renderChatsList?.(), value_2.imChat?.updateChatsView?.(), enter_2(get_2() || friendData);
  }
  async function enter_2(value_171 = get_2()) {
    if (!value_171) return add_2();
    const value_172 = Array.isArray(value_171.messages) ? value_171.messages : [],
      value_173 = value_172[0],
      value_174 = value_172.length === 0,
      value_175 = value_173?.role === "assistant" && (String(value_173.id || "").startsWith("official-welcome-") || value_173.content === text_5) && value_173.content !== content_3,
      value_176 = !value_171.signature || value_171.signature === "帮你制作主题与世界书";
    if (value_171.officialConversationActive !== true || value_174 || value_175 || value_176) {
      const value_178 = await value_2.imApp.commitScopedFriendChange(value_171, value_179 => {
        value_179.officialConversationActive = true;
        if (value_176) value_179.signature = "制作主题、线下配置、世界书与人设";
        if (value_174) value_179.messages = [handleAction_28()];else value_175 && value_179.messages?.[0] && (value_179.messages[0].content = content_3);
      }, {
        silent: true,
        metaOnly: !value_174 && !value_175
      });
      if (!value_178) throw new Error("会话打开失败");
      value_171 = get_2() || value_171;
    }
    handleAction_36();
    const officialAccountsViewElement = document.getElementById("official-accounts-view");
    if (officialAccountsViewElement) handleAction_35(officialAccountsViewElement);
    value_2.imChat?.renderChatsList?.();
    const value_177 = value_2.imApp?.openChatTab || value_2.imChat?.openChatTab;
    if (typeof value_177 === "function") await value_177(value_171);
    return value_171;
  }
  async function clearHistory_2() {
    const handleAction_29_180 = get_2();
    if (!handleAction_29_180) return false;
    const value_181 = await value_2.imApp.resetFriendMessages(handleAction_29_180.id, {
      silent: true
    });
    if (!value_181) throw new Error("聊天记录清空失败");
    if (!(await value_2.imApp.appendFriendMessage(handleAction_29_180.id, handleAction_28(), {
      silent: true
    }))) throw new Error("开场白恢复失败");
    const handleAction_29_182 = get_2(),
      querySelector_183 = document.querySelector("#chat-interface-" + CSS.escape(String(handleAction_29_180.id)) + " .ins-chat-messages");
    if (querySelector_183 && value_2.imChat?.rerenderChatContainer) value_2.imChat.rerenderChatContainer(handleAction_29_182, querySelector_183, {
      scroll: true
    });
    return value_2.imChat?.renderChatsList?.(), true;
  }
  async function deleteConversation_2() {
    const handleAction_29_184 = get_2();
    if (!handleAction_29_184) return false;
    if (!(await value_2.imApp.resetFriendMessages(handleAction_29_184.id, {
      silent: true
    }))) throw new Error("会话删除失败");
    if (!(await value_2.imApp.commitScopedFriendChange(handleAction_29_184, value_185 => {
      value_185.officialConversationActive = false;
    }, {
      silent: true,
      metaOnly: true
    }))) throw new Error("会话状态保存失败");
    return stop_2(handleAction_29_184.id), value_2.imData.currentActiveFriend && String(value_2.imData.currentActiveFriend.id) === id_2 && (value_2.imData.currentActiveFriend = null, value_2.imChat?.updateChatsView?.()), document.getElementById("chat-interface-" + handleAction_29_184.id)?.remove(), value_2.imChat?.renderChatsList?.(), handleAction_36(), true;
  }
  function handleU2ApiPresetsUpdated() {
    const officialApiPresetSelectElement = document.getElementById("official-api-preset-select");
    if (!officialApiPresetSelectElement) return;
    const handleAction_29_186 = get_2(),
      string_187 = String(handleAction_29_186?.officialApiPresetId || "");
    officialApiPresetSelectElement.replaceChildren();
    const element = document.createElement("option");
    element.value = "";
    element.textContent = handleAction_31().length ? "选择 API 预设" : "暂无 API 预设";
    officialApiPresetSelectElement.appendChild(element);
    handleAction_31().forEach(value_188 => {
      const element_189 = document.createElement("option");
      element_189.value = String(value_188.id || "");
      element_189.textContent = value_188.name || value_188.model || "未命名预设";
      officialApiPresetSelectElement.appendChild(element_189);
    });
    officialApiPresetSelectElement.value = handleAction_31().some(value_190 => String(value_190.id) === string_187) ? string_187 : "";
  }
  async function handleAction_42(value_191) {
    const handleAction_29_192 = get_2();
    if (!handleAction_29_192) return false;
    const officialApiPresetId_2 = handleAction_31().some(value_194 => String(value_194.id) === String(value_191)) ? String(value_191) : "";
    return value_2.imApp.commitScopedFriendChange(handleAction_29_192, value_195 => {
      value_195.officialApiPresetId = officialApiPresetId_2;
    }, {
      silent: true,
      metaOnly: true
    });
  }
  function handleAction_43(value_196) {
    if (typeof value_196?.output_text === "string") return value_196.output_text;
    const content_197 = value_196?.choices?.[0]?.message?.content;
    if (typeof content_197 === "string") return content_197;
    if (Array.isArray(content_197)) return content_197.map(value_198 => value_198?.text || "").join("");
    if (Array.isArray(value_196?.output)) return value_196.output.flatMap(message_199 => message_199?.content || []).map(value_200 => value_200?.text || "").join("");
    return "";
  }
  function parseResponse_2(value_201) {
    let replace_202 = String(value_201 || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
    const indexOf_203 = replace_202.indexOf("{"),
      lastIndexOf_204 = replace_202.lastIndexOf("}");
    if (indexOf_203 >= 0 && lastIndexOf_204 > indexOf_203) replace_202 = replace_202.slice(indexOf_203, lastIndexOf_204 + 1);
    let value_205;
    try {
      value_205 = JSON.parse(replace_202);
    } catch (value_208) {
      throw new Error("返回格式不完整，无法生成安全预览");
    }
    if (!value_205 || typeof value_205 !== "object" || Array.isArray(value_205)) throw new Error("返回格式不是作品对象");
    const message_2 = String(value_205.message || "").trim().slice(0, 12000),
      artifacts_2 = (Array.isArray(value_205.artifacts) ? value_205.artifacts : []).slice(0, 5).map(handleAction_45).filter(Boolean);
    if (!message_2 && artifacts_2.length === 0) throw new Error("有兔没有返回可显示内容");
    return {
      message: message_2,
      artifacts: artifacts_2
    };
  }
  function handleAction_45(value_209, value_210) {
    if (!value_209 || typeof value_209 !== "object") return null;
    const kind_2 = String(value_209.kind || "").trim();
    if (!value_9.has(kind_2)) return null;
    const name_4 = String(value_209.name || "有兔作品 " + (value_210 + 1)).trim().slice(0, 100) || "有兔作品 " + (value_210 + 1),
      summary_2 = String(value_209.summary || "").trim().slice(0, 1000),
      value_214 = value_209.payload && typeof value_209.payload === "object" ? handleAction_16(value_209.payload) : {},
      value_215 = kind_2 === "worldbook" ? value_2.u2WorldBookAgent?.validate?.(value_214) : value_8.has(kind_2) ? u2OfficialCreationAgent_2.validate(kind_2, value_214) : value_2.u2ThemeAgent?.validate?.(kind_2, value_214);
    if (!value_215?.valid) return null;
    return {
      version: version_2,
      artifactId: "artifact-" + Date.now() + "-" + value_210 + "-" + Math.random().toString(36).slice(2, 7),
      kind: kind_2,
      name: name_4,
      summary: summary_2,
      payload: handleAction_16(value_215.payload || value_214),
      status: "draft",
      targetId: "",
      targetBookId: "",
      appliedAt: 0,
      previousSnapshot: null,
      appliedFingerprint: ""
    };
  }
  function handleAction_46(value_216, value_217, value_218 = {}) {
    const map_219 = handleAction_30().map(value_229 => ({
        id: String(value_229.id),
        name: value_229.nickname || value_229.realName || "Char"
      })),
      value_220 = value_2.u2WorldBookAgent?.list?.() || [],
      map_221 = (value_2.getWorldBooks?.() || []).filter(value_230 => value_230?.name && String(value_217 || "").includes(String(value_230.name))).slice(0, 3).map(value_231 => ({
        id: value_231.id,
        name: value_231.name,
        group: value_231.group,
        isGlobal: value_231.isGlobal === true,
        entries: value_231.entries
      })),
      value_222 = value_218.regenerateArtifact ? "\n本轮是在重新生成下面这个作品。请保持玩家原始需求，但生成一个新的替代版本；artifacts 只返回这个替代作品，不要复述旧代码：\n" + JSON.stringify(value_218.regenerateArtifact) : "",
      map_223 = handleAction_30().filter(value_232 => {
        const map_233 = [value_232.nickname, value_232.realName].filter(Boolean).map(String);
        return map_233.some(value_234 => String(value_217 || "").includes(value_234));
      }).slice(0, 3).map(contact_235 => ({
        id: String(contact_235.id),
        name: contact_235.nickname || contact_235.realName || "Char",
        persona: contact_235.persona || "",
        relationship: contact_235.relationship || ""
      })),
      handleAction_18_224 = handleAction_18(),
      value_225 = /\buser\b|用户|我的人设|当前人设/i.test(String(value_217 || "")) ? {
        id: handleAction_18_224?.id ?? "__global_user__",
        name: handleAction_18_224?.name || value_2.userState?.name || "User",
        persona: handleAction_18_224?.persona || value_2.userState?.persona || ""
      } : null,
      slice_226 = (value_2.imApp?.getGlobalOfflinePrompts?.() || value_2.imData?.offlinePrompts || []).filter(value_236 => value_236?.name && String(value_217 || "").includes(String(value_236.name))).slice(0, 3),
      slice_227 = (value_2.imOfflineRegex?.normalizeHtmlTemplateRules?.(value_2.imData?.offlineHtmlTemplateRules) || []).filter(value_237 => value_237?.scriptName && String(value_217 || "").includes(String(value_237.scriptName))).slice(0, 3),
      value_228 = /线下|见面|弹幕/i.test(String(value_217 || "")) ? value_2.imApp?.getOfflineThemeState?.().theme || null : null;
    return "你是 u2phone 内置创作助手“有兔”。你帮助玩家设计 iMessage Theme、线下聊天创作配置、世界书以及 Char/User 人设，并生成可预览的结构化作品。不要直接应用或修改玩家的任何配置；最终写入目标始终由玩家在作品卡中选择并确认。禁止声称已应用作品；禁止输出或请求执行 JavaScript、终端命令、文件修改、插件调用或网络脚本。\n\n可生成的 kind：\n- status_template: payload={\"prompt\":\"生成状态正文的中文提示词\",\"regex\":\"含命名组 thought 的正则\",\"html\":\"状态栏 HTML 模板\"}\n- status_css: payload={\"prompt\":\"生成状态正文的提示词\",\"css\":\"纯 CSS\"}\n- home_css、chat_css、bubble_css、group_css: payload={\"css\":\"纯 CSS\"}\n- worldbook: payload={\"name\":\"名称\",\"group\":\"分组或未分组\",\"isGlobal\":false,\"entries\":[{\"title\":\"词条名\",\"keyword\":\"\",\"content\":\"内容\",\"triggerMode\":\"permanent或keyword\",\"injectionPosition\":\"before_role、after_role或system_depth\",\"systemDepth\":4,\"order\":100,\"enabled\":true}]}\n- offline_theme: payload={\"narrativeColor\":\"#111111\",\"dialogueColor\":\"#8B8B8B\",\"customCss\":\"纯 CSS，使用 :scope 定位线下界面\"}\n- offline_prompt: payload={\"name\":\"条目名\",\"content\":\"完整提示词正文\",\"enabled\":true}\n- offline_html_template: payload={\"scriptName\":\"模板名\",\"findRegex\":\"/含 (?<name>...) 命名捕获组的正则/g\",\"html\":\"安全静态 HTML，用 {{name}} 插值\",\"disabled\":false,\"minDepth\":null,\"maxDepth\":null}\n- char_persona: payload={\"persona\":\"Char 完整人设正文\"}\n- user_persona: payload={\"persona\":\"当前 User 完整人设正文\"}\n\nTheme CSS 必须使用当前组件可用的真实选择器；不要生成 script、style 标签、事件属性或外部脚本。状态栏 HTML 只能使用安全静态 HTML 和内联样式，可用 {{thought}}、{{time}}、{{index}}、{{total}}、{{avatar}} 占位符。线下 CSS 可使用 :scope、.offline-chat-page、.offline-chat-message、.offline-chat-narration、.offline-chat-dialogue、.offline-chat-html-template，不要使用虚构选择器。线下 HTML 模板只处理 AI 输出，正则至少有一个命名捕获组，HTML 只使用对应 {{捕获组名}} 占位符。世界书内容必须完整可用，keyword 模式必须提供关键词。人设作品只写 persona 正文，不改姓名、昵称、签名或关系。玩家要求“一套”时可同时返回风格一致的线下主题、提示词和 HTML 模板。\n\n只输出一个合法 JSON 对象，不要 markdown、代码围栏或 JSON 外文字：\n{\"message\":\"给玩家的简短说明或追问\",\"artifacts\":[{\"kind\":\"上述类型\",\"name\":\"作品名\",\"summary\":\"改动摘要\",\"payload\":{}}]}\n如果需求不清楚，artifacts 返回 [] 并在 message 中追问。一次最多 5 个作品。\n\n可参考的普通角色：" + JSON.stringify(map_219) + "\n玩家本轮明确提到的 Char 当前资料：" + JSON.stringify(map_223) + "\n玩家本轮明确提到的 User 当前资料：" + JSON.stringify(value_225) + "\n当前线下主题快照（本轮相关时才提供）：" + JSON.stringify(value_228) + "\n玩家本轮明确提到的线下提示词：" + JSON.stringify(slice_226) + "\n玩家本轮明确提到的线下 HTML 模板：" + JSON.stringify(slice_227) + "\n现有世界书目录：" + JSON.stringify(value_220) + "\n玩家本轮明确提到的世界书完整内容：" + JSON.stringify(map_221) + value_222;
  }
  function handleAction_47(value_238) {
    const slice_239 = (Array.isArray(value_238.messages) ? value_238.messages : []).slice(-36);
    return slice_239.map(message_240 => {
      if (message_240.type === "official_artifact") {
        const value_241 = message_240.officialArtifact || {};
        return {
          role: "assistant",
          content: "[作品：" + (value_241.name || "未命名") + "；类型：" + (value_241.kind || "") + "；状态：" + (value_241.status || "draft") + "]"
        };
      }
      if (message_240.type === "official_file") {
        const value_242 = message_240.officialFile || {};
        return {
          role: "user",
          content: "[玩家上传文件：" + (value_242.name || "未命名") + "]\n" + String(value_242.text || "").slice(0, 12000)
        };
      }
      return {
        role: message_240.role === "user" ? "user" : "assistant",
        content: String(message_240.content || message_240.text || "").slice(0, 12000)
      };
    }).filter(message_243 => message_243.content);
  }
  function handleAction_48(value_244) {
    value_244?.querySelectorAll(".official-generation-row").forEach(value_245 => value_245.remove());
  }
  function handleAction_49(element_246, value_247) {
    if (!element_246) return null;
    handleAction_48(element_246);
    const element_248 = document.createElement("div");
    return element_248.className = "chat-row ai-row typing-row official-generation-row", element_248.innerHTML = "<div><div class=\"typing-indicator\"><div class=\"typing-dot\"></div><div class=\"typing-dot\"></div><div class=\"typing-dot\"></div></div></div>", element_246.appendChild(element_248), value_2.imChat?.scrollToBottom?.(element_246), element_248;
  }
  function handleAction_50(element_249, value_250, value_251 = "生成失败") {
    if (!element_249) return;
    handleAction_48(element_249);
    const element_252 = document.createElement("div");
    element_252.className = "official-generation-row official-generation-controls";
    const element_253 = document.createElement("button");
    element_253.type = "button";
    element_253.textContent = value_251 + " · 重试";
    element_253.addEventListener("click", () => generate_2(value_250, element_249, {
      source: "retry"
    }));
    element_252.appendChild(element_253);
    element_249.appendChild(element_252);
    value_2.imChat?.scrollToBottom?.(element_249);
  }
  async function handleAction_51(value_254, value_255) {
    if (!String(value_255 || "").trim()) return null;
    const options_256 = {
      id: handleAction_27("official-reply"),
      role: "assistant",
      type: "text",
      content: String(value_255).trim(),
      timestamp: Date.now()
    };
    return (await value_2.imApp.appendFriendMessage(value_254, options_256, {
      silent: true
    })) ? options_256 : null;
  }
  async function handleAction_52(value_257, officialArtifact_2) {
    const options_259 = {
      id: handleAction_27("official-artifact"),
      role: "assistant",
      type: "official_artifact",
      content: officialArtifact_2.summary || officialArtifact_2.name,
      officialArtifact: officialArtifact_2,
      timestamp: Date.now()
    };
    return (await value_2.imApp.appendFriendMessage(value_257, options_259, {
      silent: true
    })) ? options_259 : null;
  }
  async function generate_2(value_260 = get_2(), value_261 = null, value_262 = {}) {
    let value_263 = typeof value_260 === "object" ? value_260 : value_2.imApp?.getFriendById?.(value_260);
    value_263 = value_2.imApp?.getFriendById?.(value_263?.id) || value_263;
    if (!value_263 || value_263.type !== "official") return false;
    const friendId_2 = String(value_263.id);
    if (value_11.has(friendId_2)) {
      if (!value_262.silent) value_2.showToast?.("有兔正在生成中");
      return false;
    }
    const value_265 = value_261 || document.querySelector("#chat-interface-" + CSS.escape(friendId_2) + " .ins-chat-messages");
    let value_266;
    try {
      value_266 = resolveApiConfig_2(value_263);
    } catch (value_269) {
      return value_2.showToast?.(value_269.message), handleAction_50(value_265, value_263, "需要配置 API"), false;
    }
    const value_267 = new AbortController();
    value_11.set(friendId_2, value_267);
    value_2.dispatchEvent(new CustomEvent("u2:official-generation-state", {
      detail: {
        friendId: friendId_2,
        generating: true
      }
    }));
    const handleAction_49_268 = handleAction_49(value_265, value_263);
    if (value_262.triggerButton) value_262.triggerButton.style.opacity = "0.5";
    try {
      const handleAction_47_270 = handleAction_47(value_263),
        value_271 = [...handleAction_47_270].reverse().find(message_276 => message_276.role === "user")?.content || "",
        value_272 = value_2.u2Api?.resolveChatCompletionsEndpoint ? value_2.u2Api.resolveChatCompletionsEndpoint(value_266.endpoint) : value_266.endpoint.replace(/\/$/, "") + "/chat/completions",
        value_273 = await fetch(value_272, {
          method: "POST",
          headers: value_2.u2Api?.buildApiHeaders ? value_2.u2Api.buildApiHeaders(value_266, {
            "X-U2-Silent-Errors": "1"
          }) : {
            "Content-Type": "application/json",
            Authorization: "Bearer " + value_266.apiKey
          },
          signal: value_267.signal,
          body: JSON.stringify({
            model: value_266.model,
            messages: [{
              role: "system",
              content: handleAction_46(value_263, value_271, value_262)
            }, ...handleAction_47_270],
            temperature: Number.parseFloat(value_266.temperature) || 0.7,
            frequency_penalty: Number.parseFloat(value_266.frequencyPenalty) || 0
          })
        });
      if (!value_273.ok) {
        const value_277 = value_2.u2Api?.readApiError ? await value_2.u2Api.readApiError(value_273) : null;
        throw value_2.u2Api?.createHttpError?.(value_273, value_277) || Object.assign(new Error(value_277?.message || "API 请求失败 (HTTP " + value_273.status + ")"), {
          status: value_273.status
        });
      }
      const handleAction_44_274 = parseResponse_2(handleAction_43(await value_273.json()));
      if (handleAction_44_274.message) await handleAction_51(value_263.id, handleAction_44_274.message);
      for (const value_278 of handleAction_44_274.artifacts) await handleAction_52(value_263.id, value_278);
      const value_275 = get_2() || value_263;
      if (value_265 && value_2.imChat?.rerenderChatContainer) value_2.imChat.rerenderChatContainer(value_275, value_265, {
        scroll: true
      });
      return value_2.imChat?.renderChatsList?.(), true;
    } catch (value_279) {
      if (value_279?.name === "AbortError") return value_2.showToast?.("已停止生成"), false;
      console.error("Official account generation failed", value_279);
      !value_262.silent && value_2.u2Api?.isRequestError?.(value_279) && value_2.u2Api.reportError(value_279, {
        operation: "有兔回复生成"
      });
      await handleAction_51(value_263.id, "这次没有生成成功，可以点击重试。");
      const value_280 = get_2() || value_263;
      if (value_265 && value_2.imChat?.rerenderChatContainer) value_2.imChat.rerenderChatContainer(value_280, value_265, {
        scroll: true
      });
      return handleAction_50(value_265, value_280), false;
    } finally {
      handleAction_49_268?.remove();
      if (value_262.triggerButton) value_262.triggerButton.style.opacity = "1";
      if (value_11.get(friendId_2) === value_267) value_11["delete"](friendId_2);
      value_2.dispatchEvent(new CustomEvent("u2:official-generation-state", {
        detail: {
          friendId: friendId_2,
          generating: false
        }
      }));
    }
  }
  function stop_2(value_281 = id_2) {
    const friendId_3 = String(value_281),
      result_283 = value_11.get(friendId_3);
    if (!result_283) return false;
    return result_283.abort(), value_11["delete"](friendId_3), value_2.dispatchEvent(new CustomEvent("u2:official-generation-state", {
      detail: {
        friendId: friendId_3,
        generating: false
      }
    })), true;
  }
  function isGenerating_2(value_284 = id_2) {
    return value_11.has(String(value_284));
  }
  async function handleAction_56(value_285) {
    const trim_286 = String(value_285?.name || "").trim(),
      toLowerCase_287 = trim_286.toLowerCase();
    if (!/\.(txt|text|md|markdown|css|html?|json|docx)$/.test(toLowerCase_287)) throw new Error("支持 TXT、Markdown、CSS、HTML、JSON 和 DOCX 文件");
    if (Number(value_285?.size || 0) > 2097152) throw new Error("文件不能超过 2MB");
    if (toLowerCase_287.endsWith(".docx")) {
      await value_2.u2LoadVendorLibrary?.("mammoth");
      if (!value_2.mammoth?.extractRawText) throw new Error("DOCX 解析组件未加载");
      const value_288 = await value_2.mammoth.extractRawText({
        arrayBuffer: await value_285.arrayBuffer()
      });
      return String(value_288?.value || "").replace(/\u0000/g, "");
    }
    return String(await value_285.text()).replace(/\u0000/g, "");
  }
  async function uploadFile_2(value_289, value_290 = get_2(), value_291 = null) {
    let value_292 = typeof value_290 === "object" ? value_290 : value_2.imApp?.getFriendById?.(value_290);
    value_292 = value_2.imApp?.getFriendById?.(value_292?.id) || value_292;
    if (!value_292 || value_292.type !== "official" || !value_289) return false;
    if (isGenerating_2(value_292.id)) throw new Error("请先停止当前生成");
    const trim_293 = (await handleAction_56(value_289)).trim();
    if (!trim_293) throw new Error("文件内容为空");
    const options_294 = {
      id: handleAction_27("official-file"),
      role: "user",
      type: "official_file",
      content: "[文件] " + String(value_289.name || "未命名文件"),
      officialFile: {
        name: String(value_289.name || "未命名文件").slice(0, 180),
        type: String(value_289.type || "").slice(0, 120),
        size: Number(value_289.size || 0),
        text: trim_293.slice(0, 120000)
      },
      timestamp: Date.now()
    };
    if (!(await value_2.imApp.appendFriendMessage(value_292.id, options_294, {
      silent: true
    }))) throw new Error("文件消息保存失败");
    const value_295 = value_291 || document.querySelector("#chat-interface-" + CSS.escape(String(value_292.id)) + " .ins-chat-messages"),
      value_296 = get_2() || value_292;
    return value_2.imChat?.rerenderChatContainer?.(value_296, value_295, {
      scroll: true
    }), void generate_2(value_296, value_295, {
      source: "file"
    }), true;
  }
  function pickFile_2(value_297 = get_2(), value_298 = null) {
    let officialFileUploadInputElement = document.getElementById("official-file-upload-input");
    !officialFileUploadInputElement && (officialFileUploadInputElement = document.createElement("input"), officialFileUploadInputElement.id = "official-file-upload-input", officialFileUploadInputElement.type = "file", officialFileUploadInputElement.hidden = true, officialFileUploadInputElement.accept = ".txt,.text,.md,.markdown,.css,.html,.htm,.json,.docx,text/plain,text/css,text/html,application/json,application/vnd.openxmlformats-officedocument.wordprocessingml.document", document.getElementById("app")?.appendChild(officialFileUploadInputElement));
    officialFileUploadInputElement.onchange = async () => {
      const value_299 = officialFileUploadInputElement.files?.[0];
      officialFileUploadInputElement.value = "";
      if (!value_299) return;
      try {
        await uploadFile_2(value_299, value_297, value_298);
      } catch (value_300) {
        value_2.showToast?.(value_300.message || "文件上传失败");
      }
    };
    officialFileUploadInputElement.click();
  }
  function handleAction_59(value_301) {
    if (value_301.kind === "status_template" || value_301.kind === "worldbook" || value_8.has(value_301.kind)) return JSON.stringify(value_301.payload, null, 2);
    if (value_301.kind === "status_css") return "/* 状态生成提示词\n" + (value_301.payload.prompt || "") + "\n*/\n\n" + (value_301.payload.css || "");
    return String(value_301.payload.css || "");
  }
  function handleAction_60(value_302) {
    if (value_302 === "offline_theme") return "<div id=\"offline-chat-view\"><div class=\"offline-chat-page\"><div class=\"offline-chat-title\">Tonight</div><div class=\"offline-chat-message offline-chat-narration\">雨点落在窗沿，房间里只剩柔和的呼吸声。</div><div class=\"offline-chat-message offline-chat-dialogue\">“再坐近一点吧。”</div><section class=\"offline-chat-html-template\"><strong>深夜 · 靠窗</strong></section></div></div>";
    if (value_302 === "home_css") return "<div class=\"line-content\"><div class=\"line-profile\"><div><h2>Chats</h2><p>有兔主题预览</p></div></div><div class=\"chat-item\"><div class=\"chat-avatar\"></div><div class=\"chat-info\"><div class=\"chat-name\">有兔 <span>office</span></div><div class=\"chat-message\">满意后存为预设。</div></div></div></div>";
    if (value_302 === "group_css") return "<div class=\"active-chat-interface im-chat-group\"><div class=\"chat-top-bar\"><div class=\"ins-chat-name\">周末计划</div></div><div class=\"ins-chat-messages\"><div class=\"chat-row ai-row\"><div class=\"group-ai-bubble-wrap\"><div class=\"group-ai-speaker-name\">小兔</div><div class=\"ai-bubble\">一起去看海吧</div></div></div><div class=\"chat-row user-row\"><div class=\"user-bubble\">好呀</div></div></div></div>";
    return "<div class=\"active-chat-interface im-chat-single\"><div class=\"chat-top-bar\"><div class=\"ins-chat-name\">示例角色</div></div><div class=\"ins-chat-messages\"><div class=\"chat-row ai-row\"><div class=\"ai-bubble\">这是有兔生成的预览</div></div><div class=\"chat-row user-row\"><div class=\"user-bubble\">看起来不错</div></div></div></div>";
  }
  function handleAction_61(value_303) {
    const value_304 = value_303.kind === "offline_theme" ? value_303.payload.customCss : value_303.payload.css,
      replace_305 = String(value_304 || "").replace(/<\/style/gi, "<\\/style").replace(/:scope\b/g, "#offline-chat-view");
    if (value_303.kind === "offline_theme") {
      const value_306 = value_303.payload.narrativeColor || "#111111",
        value_307 = value_303.payload.dialogueColor || "#8B8B8B";
      return "<!doctype html><html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width\"><style>body{margin:0;padding:14px;background:#eee;font:14px -apple-system,BlinkMacSystemFont,sans-serif}#offline-chat-view{--offline-chat-narrative-color:" + value_306 + ";--offline-chat-dialogue-color:" + value_307 + ";padding:16px;border-radius:16px;background:#fff}.offline-chat-title{font-weight:800;margin-bottom:16px}.offline-chat-message{margin:12px 0;line-height:1.65}.offline-chat-narration{color:var(--offline-chat-narrative-color)}.offline-chat-dialogue{color:var(--offline-chat-dialogue-color)}.offline-chat-html-template{padding:10px;border:1px solid #ddd;border-radius:12px}" + replace_305 + "</style></head><body>" + handleAction_60(value_303.kind) + "</body></html>";
    }
    return "<!doctype html><html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width\"><style>body{margin:0;padding:14px;background:#f4f4f7;font:14px -apple-system,BlinkMacSystemFont,sans-serif;color:#111}.active-chat-interface,.line-content{display:block!important;min-height:132px;padding:12px;border-radius:16px;background:#fff}.chat-top-bar{padding:8px 0;border-bottom:1px solid #eee}.ins-chat-messages{padding:12px 0}.chat-row{display:flex;margin:8px 0}.user-row{justify-content:flex-end}.ai-bubble,.user-bubble{max-width:72%;padding:9px 12px;border-radius:16px;background:#eee}.user-bubble{background:#111;color:#fff}.chat-item{display:flex;gap:10px;align-items:center;padding:12px 0}.chat-avatar{width:40px;height:40px;border-radius:50%;background:#111}.chat-info{min-width:0}.chat-message{color:#888;margin-top:4px}.chat-name span{font-size:9px;color:#888}.line-profile p{color:#888}" + replace_305 + "</style></head><body><div id=\"theme-preview-root\">" + handleAction_60(value_303.kind) + "</div></body></html>";
  }
  function handleAction_62(element_308, value_309, value_310) {
    element_308.replaceChildren();
    if (value_309.kind === "worldbook") {
      const payload_312 = value_309.payload,
        value_313 = value_310?.value ? value_2.u2WorldBookAgent?.getSnapshot?.(value_310.value) : null,
        filter_314 = [value_313 ? "修改：" + value_313.name : "新建：" + payload_312.name, "分组：" + (payload_312.group || "未分组") + " · " + (payload_312.isGlobal ? "全局" : "非全局"), "词条：" + (Array.isArray(payload_312.entries) ? payload_312.entries.length : 0) + " 条", value_313 ? "原有 " + (Array.isArray(value_313.entries) ? value_313.entries.length : 0) + " 条 → 新内容 " + (Array.isArray(payload_312.entries) ? payload_312.entries.length : 0) + " 条" : "", ...(payload_312.entries || []).slice(0, 4).map(value_316 => "• " + value_316.title)].filter(Boolean),
        element_315 = document.createElement("div");
      element_315.className = "official-artifact-worldbook-preview";
      element_315.textContent = filter_314.join("\n");
      element_308.appendChild(element_315);
      return;
    }
    if (value_309.kind === "offline_prompt") {
      const element_317 = document.createElement("div");
      element_317.className = "official-artifact-text-preview";
      element_317.innerHTML = "<strong>" + handleAction_15(value_309.payload.name) + "</strong><span>" + (value_309.payload.enabled === false ? "默认停用" : "默认启用") + "</span><pre>" + handleAction_15(value_309.payload.content) + "</pre>";
      element_308.appendChild(element_317);
      return;
    }
    if (value_309.kind === "offline_html_template") {
      const element_318 = document.createElement("div");
      element_318.className = "official-artifact-template-preview";
      const replace_319 = String(value_309.payload.html || "").replace(/{{\s*([A-Za-z_$][\w$]*)\s*}}/g, (value_321, value_322) => "示例" + value_322),
        value_320 = value_2.imApp?.sanitizeHtmlTemplate?.(replace_319) || "";
      element_318.innerHTML = value_320 || "<span>HTML 模板无法预览</span>";
      element_308.appendChild(element_318);
      return;
    }
    if (value_309.kind === "char_persona" || value_309.kind === "user_persona") {
      const value_323 = value_309.kind === "user_persona" ? handleAction_18()?.id ?? "__global_user__" : value_310?.value || "",
        value_324 = getSnapshot_2(value_309.kind, value_323)?.persona || "",
        element_325 = document.createElement("div");
      element_325.className = "official-artifact-persona-preview";
      element_325.innerHTML = "<div><strong>当前人设</strong><p>" + handleAction_15(value_324 || "未填写") + "</p></div><div><strong>有兔作品</strong><p>" + handleAction_15(value_309.payload.persona) + "</p></div>";
      element_308.appendChild(element_325);
      return;
    }
    if (value_309.kind === "status_template") {
      const renderStatusTemplate_326 = value_2.imApp?.renderStatusTemplate?.(value_309.payload, {
          thought: "风吹过来时，也想离你更近一点。",
          createdAt: Date.now()
        }, {
          time: new Date().toLocaleString(),
          index: 1,
          total: 3,
          avatar: value_14
        }),
        element_327 = document.createElement("div");
      element_327.style.padding = "12px";
      if (renderStatusTemplate_326?.applied) element_327.innerHTML = renderStatusTemplate_326.html;else element_327.textContent = renderStatusTemplate_326?.error || "状态栏模板无法预览";
      element_308.appendChild(element_327);
      return;
    }
    const element_311 = document.createElement("iframe");
    element_311.setAttribute("sandbox", "");
    element_311.title = value_309.name + " 预览";
    element_311.srcdoc = handleAction_61(value_309);
    element_308.appendChild(element_311);
  }
  function handleAction_63(textContent_2, value_329, value_330 = null) {
    document.querySelector(".u2-official-modal")?.remove();
    const element_331 = document.createElement("div");
    element_331.className = "u2-official-modal";
    const element_332 = document.createElement("section");
    element_332.className = "u2-official-modal-card";
    const element_333 = document.createElement("div");
    element_333.className = "u2-official-modal-head";
    const element_334 = document.createElement("span");
    element_334.textContent = textContent_2;
    const element_335 = document.createElement("button");
    element_335.type = "button";
    element_335.innerHTML = "<i class=\"fas fa-times\"></i>";
    element_333.append(element_334, element_335);
    if (value_330) element_333.insertBefore(value_330, element_335);
    const element_336 = document.createElement("div");
    element_336.className = "u2-official-modal-content";
    element_336.appendChild(value_329);
    element_332.append(element_333, element_336);
    element_331.appendChild(element_332);
    handleAction_33(element_331);
    const handleClick = () => element_331.remove();
    return element_335.addEventListener("click", handleClick), element_331.addEventListener("click", event => {
      if (event.target === element_331) handleClick();
    }), element_331;
  }
  function handleAction_64(title_2, message_3, confirmText_2 = "应用") {
    return new Promise(value_341 => {
      if (typeof value_2.showCustomModal === "function") {
        value_2.showCustomModal({
          title: title_2,
          message: message_3,
          confirmText: confirmText_2,
          cancelText: "取消",
          onConfirm: () => value_341(true),
          onCancel: () => value_341(false)
        });
        return;
      }
      value_341(value_2.confirm(title_2 + "\n\n" + message_3));
    });
  }
  async function handleAction_65(value_342, message_343, value_344) {
    const value_345 = await value_2.imApp.updateFriendMessage(value_342.id, {
      id: message_343.id,
      timestamp: message_343.timestamp
    }, value_346 => {
      if (!value_346.officialArtifact) return;
      value_344(value_346.officialArtifact);
    }, {
      silent: true
    });
    if (!value_345) throw new Error("作品状态保存失败");
    return Object.assign(message_343, value_2.imApp.getFriendById(value_342.id)?.messages?.find(value_347 => String(value_347.id) === String(message_343.id)) || message_343), true;
  }
  function handleAction_66(value_348, value_349) {
    const value_350 = value_2.imApp.getFriendById(value_348.id) || value_348;
    if (value_349 && value_2.imChat?.rerenderChatContainer) value_2.imChat.rerenderChatContainer(value_350, value_349, {
      scroll: false
    });
  }
  function handleAction_67(value_351, value_352, value_353) {
    if (!value_353) return;
    const value_354 = value_2.imApp.getFriendById(value_351.id) || value_351,
      result_355 = value_354?.messages?.find(value_359 => String(value_359?.id) === String(value_352?.id)),
      result_356 = Array.from(value_353.querySelectorAll(".official-artifact-row")).find(value_360 => String(value_360.dataset.messageId || "") === String(value_352?.id || ""));
    if (!result_355?.officialArtifact || !result_356) {
      handleAction_66(value_354, value_353);
      return;
    }
    const officialArtifactPreviewElement = result_356.querySelector(".official-artifact-preview");
    renderOfficialArtifactBubble_2(result_355, value_354, value_353);
    const lastElementChild_357 = value_353.lastElementChild;
    if (!lastElementChild_357?.classList?.contains("official-artifact-row")) {
      handleAction_66(value_354, value_353);
      return;
    }
    const officialArtifactPreviewElement_358 = lastElementChild_357.querySelector(".official-artifact-preview");
    if (officialArtifactPreviewElement && officialArtifactPreviewElement_358) officialArtifactPreviewElement_358.replaceWith(officialArtifactPreviewElement);
    result_356.replaceWith(lastElementChild_357);
  }
  async function handleAction_68(value_361, value_362, value_363, value_364, value_365, value_366 = {}) {
    const value_367 = value_363.kind === "worldbook",
      value_368 = value_364?.value || "";
    if ((value_10.has(value_363.kind) || value_363.kind === "char_persona") && !value_368) throw new Error("请先选择应用角色");
    const value_369 = value_364?.selectedOptions?.[0]?.textContent || (value_363.kind === "offline_theme" ? "全局线下主题" : value_367 ? "新世界书" : "全局 Theme");
    if (!value_366.skipConfirm && !(await handleAction_64("应用有兔作品", "“" + value_363.name + "”将应用到：" + value_369))) return false;
    const value_370 = value_8.has(value_363.kind) ? await u2OfficialCreationAgent_2.apply(value_363.kind, value_363.payload, value_368) : value_367 ? await value_2.u2WorldBookAgent.apply(value_363.payload, value_368) : await value_2.u2ThemeAgent.apply(value_363.kind, value_363.payload, value_368);
    return await handleAction_65(value_361, value_362, value_371 => {
      value_371.status = "applied";
      value_371.targetId = value_8.has(value_363.kind) ? String(value_370.targetId || "") : value_367 ? "" : value_368;
      value_371.targetBookId = value_367 ? String(value_370.targetBookId || "") : "";
      value_371.previousSnapshot = handleAction_16(value_370.previousSnapshot);
      value_371.appliedFingerprint = value_370.appliedFingerprint || "";
      value_371.appliedAt = Date.now();
    }), value_2.showToast?.("作品已应用"), handleAction_67(value_361, value_362, value_365), true;
  }
  async function handleAction_69(value_372, value_373, value_374, value_375) {
    if (value_374.status !== "applied") throw new Error("这个作品当前不可撤销");
    const value_376 = value_8.has(value_374.kind) ? u2OfficialCreationAgent_2.fingerprint(value_374.kind, value_374.targetId) : value_374.kind === "worldbook" ? value_2.u2WorldBookAgent.fingerprint(value_374.targetBookId) : value_2.u2ThemeAgent.fingerprint(value_374.kind, value_374.targetId);
    if (value_376 !== value_374.appliedFingerprint) throw new Error("目标配置已经被再次修改，不能安全撤销");
    if (!(await handleAction_64("撤销作品", "恢复“" + value_374.name + "”应用前的配置？", "撤销"))) return false;
    if (value_8.has(value_374.kind)) await u2OfficialCreationAgent_2.restore(value_374.kind, value_374.targetId, value_374.previousSnapshot);else value_374.kind === "worldbook" ? await value_2.u2WorldBookAgent.restore(value_374.targetBookId, value_374.previousSnapshot) : await value_2.u2ThemeAgent.restore(value_374.kind, value_374.targetId, value_374.previousSnapshot);
    return await handleAction_65(value_372, value_373, value_377 => {
      value_377.status = "reverted";
      value_377.appliedFingerprint = "";
    }), value_2.showToast?.("已撤销作品"), handleAction_67(value_372, value_373, value_375), true;
  }
  function handleAction_70(value_378) {
    if (!value_10.has(value_378.kind) && value_378.kind !== "worldbook" && !["offline_prompt", "offline_html_template", "char_persona", "user_persona"].includes(value_378.kind)) return null;
    const label_2 = document.createElement("label");
    label_2.className = "official-artifact-target";
    const element_380 = document.createElement("span"),
      select_2 = document.createElement("select");
    if (value_378.kind === "worldbook") {
      element_380.textContent = "保存方式";
      select_2.innerHTML = "<option value=\"\">新建世界书</option>";
      (value_2.u2WorldBookAgent?.list?.() || []).forEach(value_382 => {
        const element_383 = document.createElement("option");
        element_383.value = String(value_382.id);
        element_383.textContent = "修改：" + value_382.name;
        select_2.appendChild(element_383);
      });
      if (value_378.status === "applied" && value_378.targetBookId) select_2.value = String(value_378.targetBookId);
    } else {
      if (value_378.kind === "offline_prompt") {
        element_380.textContent = "写入方式";
        select_2.innerHTML = "<option value=\"\">新增线下提示词条目</option>";
        (value_2.imApp?.getGlobalOfflinePrompts?.() || value_2.imData?.offlinePrompts || []).forEach(value_384 => {
          if (value_384?.systemManaged || value_384?.alwaysEnabled || value_384?.editable === false) return;
          select_2.add(new Option("覆盖：" + (value_384.name || "未命名条目"), String(value_384.id)));
        });
      } else {
        if (value_378.kind === "offline_html_template") {
          element_380.textContent = "写入方式";
          select_2.innerHTML = "<option value=\"\">新增 HTML 模板</option>";
          (value_2.imOfflineRegex?.normalizeHtmlTemplateRules?.(value_2.imData?.offlineHtmlTemplateRules) || []).forEach(value_385 => {
            select_2.add(new Option("覆盖：" + (value_385.scriptName || "未命名模板"), String(value_385.id)));
          });
        } else {
          if (value_378.kind === "user_persona") {
            const handleAction_18_386 = handleAction_18();
            element_380.textContent = "写入目标";
            select_2.add(new Option(handleAction_18_386 ? "当前 User：" + (handleAction_18_386.name || "Apple ID") : "当前全局 User", handleAction_18_386 ? String(handleAction_18_386.id) : "__global_user__"));
            select_2.disabled = true;
          } else {
            element_380.textContent = "应用到角色";
            select_2.innerHTML = "<option value=\"\">请选择角色</option>";
            handleAction_30().forEach(value_387 => {
              const element_388 = document.createElement("option");
              element_388.value = String(value_387.id);
              element_388.textContent = value_387.nickname || value_387.realName || "Char";
              select_2.appendChild(element_388);
            });
            if (value_378.targetId) select_2.value = String(value_378.targetId);
          }
        }
      }
    }
    if (value_378.targetId && value_8.has(value_378.kind)) select_2.value = String(value_378.targetId);
    if (value_378.status === "applied") select_2.disabled = true;
    return label_2.append(element_380, select_2), {
      label: label_2,
      select: select_2
    };
  }
  function renderOfficialArtifactBubble_2(message_389, value_390, element_391) {
    const regenerateArtifact_2 = message_389.officialArtifact;
    if (!regenerateArtifact_2 || !value_9.has(regenerateArtifact_2.kind)) return;
    const element_393 = document.createElement("div");
    element_393.className = "chat-row ai-row official-artifact-row";
    element_393.dataset.messageId = message_389.id || "";
    element_393.dataset.timestamp = String(message_389.timestamp || "");
    const element_394 = document.createElement("article");
    element_394.className = "official-artifact-card";
    const element_395 = document.createElement("div");
    element_395.className = "official-artifact-head";
    element_395.innerHTML = "<div class=\"official-artifact-kicker\">" + handleAction_15(regenerateArtifact_2.kind.replace(/_/g, " ")) + "</div><div class=\"official-artifact-title\">" + handleAction_15(regenerateArtifact_2.name) + "</div>" + (regenerateArtifact_2.summary ? "<div class=\"official-artifact-summary\">" + handleAction_15(regenerateArtifact_2.summary) + "</div>" : "");
    const element_396 = document.createElement("div");
    element_396.className = "official-artifact-body";
    const value_397 = value_8.has(regenerateArtifact_2.kind) ? handleAction_70(regenerateArtifact_2) : null;
    if (value_397) element_396.appendChild(value_397.label);
    const element_398 = document.createElement("div");
    element_398.className = "official-artifact-preview";
    element_396.appendChild(element_398);
    handleAction_62(element_398, regenerateArtifact_2, value_397?.select || null);
    value_397?.select?.addEventListener("change", () => handleAction_62(element_398, regenerateArtifact_2, value_397.select));
    const element_399 = document.createElement("div");
    element_399.className = "official-artifact-actions";
    const value_400 = (textContent_3, className_2 = "") => {
        const element_414 = document.createElement("button");
        element_414.type = "button";
        element_414.textContent = textContent_3;
        if (className_2) element_414.className = className_2;
        return element_399.appendChild(element_414), element_414;
      },
      value_400_401 = value_400("预览"),
      value_400_402 = value_400("重新生成"),
      value_400_403 = value_400("查看代码"),
      has_404 = value_8.has(regenerateArtifact_2.kind),
      options_405 = {
        offline_theme: "应用线下主题",
        offline_prompt: "添加到提示词",
        offline_html_template: "添加到 HTML 模板",
        char_persona: "写入 Char 人设",
        user_persona: "写入 User 人设"
      },
      value_406 = has_404 && regenerateArtifact_2.status !== "applied" ? value_400(options_405[regenerateArtifact_2.kind], "official-artifact-primary") : null,
      value_407 = has_404 && regenerateArtifact_2.status === "applied" ? value_400("撤销", "official-artifact-primary") : null,
      value_408 = !has_404 || regenerateArtifact_2.kind === "offline_theme",
      value_409 = value_408 ? value_400("存为预设", has_404 ? "" : "official-artifact-primary") : null,
      value_400_410 = value_400("继续修改");
    if (value_409) value_409.disabled = regenerateArtifact_2.status === "saved" || regenerateArtifact_2.presetSaved === true;
    value_400_401.addEventListener("click", () => {
      const element_415 = document.createElement("div");
      element_415.className = "official-artifact-preview";
      handleAction_62(element_415, regenerateArtifact_2, value_397?.select || null);
      handleAction_63(regenerateArtifact_2.name + " · 预览", element_415);
    });
    value_400_402.addEventListener("click", async () => {
      await generate_2(value_390, element_391, {
        source: "artifact-regenerate",
        regenerateArtifact: regenerateArtifact_2
      });
    });
    value_400_403.addEventListener("click", () => {
      const element_416 = document.createElement("pre");
      element_416.className = "u2-official-code";
      element_416.textContent = handleAction_59(regenerateArtifact_2);
      const element_417 = document.createElement("button");
      element_417.type = "button";
      element_417.textContent = "复制";
      element_417.addEventListener("click", async () => {
        await navigator.clipboard.writeText(handleAction_59(regenerateArtifact_2));
        value_2.showToast?.("代码已复制");
      });
      handleAction_63(regenerateArtifact_2.name + " · 代码", element_416, element_417);
    });
    value_406?.addEventListener("click", async () => {
      try {
        await handleAction_68(value_390, message_389, regenerateArtifact_2, value_397?.select || null, element_391);
      } catch (value_418) {
        value_2.showToast?.(value_418.message || "应用失败");
      }
    });
    value_407?.addEventListener("click", async () => {
      try {
        await handleAction_69(value_390, message_389, regenerateArtifact_2, element_391);
      } catch (value_419) {
        value_2.showToast?.(value_419.message || "撤销失败");
      }
    });
    value_409?.addEventListener("click", async () => {
      try {
        let targetBookId_2 = "";
        if (regenerateArtifact_2.kind === "worldbook") {
          const value_421 = await value_2.u2WorldBookAgent.apply(regenerateArtifact_2.payload, "");
          targetBookId_2 = String(value_421?.targetBookId || "");
          value_2.showToast?.("已保存为世界书预设");
        } else regenerateArtifact_2.kind === "offline_theme" ? (await u2OfficialCreationAgent_2.saveOfflineThemePreset(regenerateArtifact_2.name, regenerateArtifact_2.payload), value_2.showToast?.("已存为线下主题预设")) : (await value_2.u2ThemeAgent.savePreset(regenerateArtifact_2.kind, regenerateArtifact_2.name, regenerateArtifact_2.payload), value_2.showToast?.("已保存为 Theme 预设"));
        await handleAction_65(value_390, message_389, value_422 => {
          if (regenerateArtifact_2.kind === "offline_theme" && value_422.status === "applied") value_422.presetSaved = true;else value_422.status = "saved";
          value_422.targetBookId = targetBookId_2;
          value_422.savedAt = Date.now();
        });
        handleAction_67(value_390, message_389, element_391);
      } catch (value_423) {
        value_2.showToast?.(value_423.message || "保存失败");
      }
    });
    value_400_410.addEventListener("click", () => {
      const querySelector_424 = document.querySelector("#chat-interface-" + CSS.escape(String(value_390.id)) + " .chat-input");
      if (!querySelector_424) return;
      querySelector_424.value = "请继续修改作品“" + regenerateArtifact_2.name + "”：";
      querySelector_424.focus({
        preventScroll: true
      });
      querySelector_424.setSelectionRange(querySelector_424.value.length, querySelector_424.value.length);
    });
    const element_411 = document.createElement("div");
    element_411.className = "official-artifact-state";
    element_411.textContent = regenerateArtifact_2.status === "saved" ? "已存为预设" : regenerateArtifact_2.status === "applied" ? "已确认写入 · 可安全撤销" : regenerateArtifact_2.status === "reverted" ? "已撤销" : "预览不会修改当前配置";
    element_394.append(element_395, element_396, element_399, element_411);
    element_393.appendChild(element_394);
    element_391.appendChild(element_393);
  }
  function openDirectory_2() {
    const handleAction_33_425 = handleAction_33(document.getElementById("official-accounts-view"));
    handleAction_36();
    if (handleAction_33_425) handleAction_34(handleAction_33_425, document.getElementById("official-accounts-back-btn"));
  }
  function openSettings_2(value_426 = document.activeElement) {
    const handleAction_33_427 = handleAction_33(document.getElementById("official-chat-settings-sheet"));
    value_12 = value_426?.isConnected ? value_426 : null;
    handleU2ApiPresetsUpdated();
    handleAction_34(handleAction_33_427, document.getElementById("official-settings-close-btn"));
  }
  function handleAction_74() {
    const officialChatSettingsSheetElement = document.getElementById("official-chat-settings-sheet");
    if (officialChatSettingsSheetElement) handleAction_35(officialChatSettingsSheetElement, value_12);
    value_12 = null;
  }
  function handleAction_75() {
    handleAction_33(document.getElementById("official-accounts-view"));
    handleAction_33(document.getElementById("official-chat-settings-sheet"));
    document.getElementById("imessage-official-accounts-btn")?.addEventListener("click", openDirectory_2);
    document.getElementById("official-accounts-back-btn")?.addEventListener("click", () => {
      const officialAccountsViewElement_428 = document.getElementById("official-accounts-view");
      if (officialAccountsViewElement_428) handleAction_35(officialAccountsViewElement_428, document.getElementById("imessage-official-accounts-btn"));
    });
    document.getElementById("u2-official-youtu-action")?.addEventListener("click", async () => {
      try {
        await (get_2() ? enter_2() : add_2());
      } catch (value_429) {
        value_2.showToast?.(value_429.message || "操作失败");
      }
    });
    document.getElementById("official-api-preset-select")?.addEventListener("change", async event_430 => {
      if (!(await handleAction_42(event_430.target.value))) value_2.showToast?.("API 预设保存失败");
    });
    document.getElementById("official-settings-close-btn")?.addEventListener("click", handleAction_74);
    document.getElementById("official-clear-history-btn")?.addEventListener("click", async () => {
      if (!(await handleAction_64("清空聊天记录", "这会删除有兔的全部聊天消息，但保留当前会话。", "清空"))) return;
      try {
        await clearHistory_2();
        handleAction_74();
        value_2.showToast?.("聊天记录已清空");
      } catch (value_431) {
        value_2.showToast?.(value_431.message || "清空失败");
      }
    });
    document.getElementById("official-delete-conversation-btn")?.addEventListener("click", async () => {
      if (!(await handleAction_64("删除会话", "聊天记录将被永久删除，会话会从 Chats 隐藏，但有兔仍保持已添加。", "删除"))) return;
      try {
        await deleteConversation_2();
        handleAction_74();
        value_2.showToast?.("会话已删除");
      } catch (value_432) {
        value_2.showToast?.(value_432.message || "删除失败");
      }
    });
    document.addEventListener("click", event_433 => {
      if (!event_433.target.closest(".chat-menu-btn") || value_2.imData?.currentActiveFriend?.type !== "official") return;
      setTimeout(handleU2ApiPresetsUpdated, 0);
    }, true);
    value_2.addEventListener("u2:api-presets-updated", handleU2ApiPresetsUpdated);
    value_2.imChat = value_2.imChat || {};
    value_2.imChat.renderOfficialArtifactBubble = renderOfficialArtifactBubble_2;
    handleU2ApiPresetsUpdated();
    handleAction_36();
  }
  value_2.u2OfficialAccounts = {
    id: id_2,
    get: get_2,
    add: add_2,
    enter: enter_2,
    clearHistory: clearHistory_2,
    deleteConversation: deleteConversation_2,
    generate: generate_2,
    stop: stop_2,
    isGenerating: isGenerating_2,
    pickFile: pickFile_2,
    uploadFile: uploadFile_2,
    resolveApiConfig: resolveApiConfig_2,
    parseResponse: parseResponse_2,
    openDirectory: openDirectory_2,
    openSettings: openSettings_2,
    renderArtifact: renderOfficialArtifactBubble_2
  };
  (value_2.u2OnStorageReady || (handleDOMContentLoaded => document.addEventListener("DOMContentLoaded", handleDOMContentLoaded)))(handleAction_75);
})(window);
