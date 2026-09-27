(function () {
  'use strict';

  window.userPhoneAccessUi = {
    _userPhoneAccessDraft: null,
    "isChar"(value_2) {
      return !!value_2 && value_2.type === "char";
    },
    "escapeHTML"(value_3) {
      return String(value_3 ?? "").replace(/[&<>"']/g, value_4 => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
      })[value_4]);
    },
    getUserPhoneAccessChars: function () {
      return (window.imData?.friends || []).filter(value_5 => value_5?.type === "char");
    },
    getUserPhoneRelationBadge: function (value_6, value_7) {
      if (!value_6 || !value_7) return {
        label: "不认识",
        detail: ""
      };
      if (String(value_6.id) === String(value_7.id)) return {
        label: "认识",
        detail: "当前 Char 本人"
      };
      const value_8 = value_13 => String(value_13?.targetId ?? value_13?.npcId ?? ""),
        items = Array.isArray(value_6.memory?.relationships) ? value_6.memory.relationships : [],
        items_9 = Array.isArray(value_7.memory?.relationships) ? value_7.memory.relationships : [],
        result = items.find(value_14 => value_8(value_14) === String(value_7.id)),
        result_10 = items_9.find(value_15 => value_8(value_15) === String(value_6.id));
      if (result || result_10) return {
        label: "认识",
        detail: String(result?.relation || result_10?.relation || "").trim().slice(0, 120)
      };
      const value_11 = new Set(items.map(value_8).filter(Boolean)),
        items_12 = [...new Set(items_9.map(value_8).filter(value_16 => value_11.has(value_16)))];
      if (items_12.length > 0) {
        const slice_17 = items_12.map(value_18 => {
          const result_19 = (window.imData?.friends || []).find(value_20 => String(value_20?.id) === value_18);
          return result_19?.nickname || result_19?.realname || result_19?.realName || result_19?.name || "";
        }).filter(Boolean).slice(0, 3);
        return {
          label: "有共友",
          detail: slice_17.length ? slice_17.join("、") : items_12.length + " 位共同人物"
        };
      }
      return {
        label: "不认识",
        detail: ""
      };
    },
    ensureUserPhoneAccessSheet: function () {
      let loversUserPhoneAccessSheetElement = document.getElementById("lovers-user-phone-access-sheet");
      if (loversUserPhoneAccessSheetElement) return loversUserPhoneAccessSheetElement;
      return loversUserPhoneAccessSheetElement = document.createElement("div"), loversUserPhoneAccessSheetElement.id = "lovers-user-phone-access-sheet", loversUserPhoneAccessSheetElement.className = "bottom-sheet-overlay detail-sheet-overlay lovers-user-phone-access-sheet", loversUserPhoneAccessSheetElement.innerHTML = "<div class=\"bottom-sheet lovers-user-phone-access-panel\" role=\"dialog\" aria-modal=\"true\" aria-label=\"反查手机权限设置\"></div>", (document.getElementById("app") || document.body).appendChild(loversUserPhoneAccessSheetElement), loversUserPhoneAccessSheetElement.addEventListener("click", event => {
        if (event.target !== loversUserPhoneAccessSheetElement) return;
        window.mobileInputCompat?.unregister?.(loversUserPhoneAccessSheetElement.querySelector(".lovers-user-phone-search"));
        this._userPhoneAccessDraft = null;
        window.closeView ? window.closeView(loversUserPhoneAccessSheetElement) : loversUserPhoneAccessSheetElement.style.display = "none";
      }), loversUserPhoneAccessSheetElement;
    },
    open: function (value_21) {
      const value_22 = (window.imData?.friends || []).find(value_24 => String(value_24?.id) === String(value_21?.id)) || value_21;
      if (!this.isChar(value_22)) {
        window.showToast?.("仅单聊 Char 可以使用反查手机");
        return;
      }
      const value_23 = window.imApp?.normalizeUserPhoneAccess ? window.imApp.normalizeUserPhoneAccess(value_22.userPhoneAccess) : {
        enabled: false,
        apiPresetId: "",
        allowedCharIds: [],
        autoTrigger: {
          enabled: false,
          frequency: "medium",
          nextRunAt: 0,
          lastRunAt: 0
        },
        privateFindings: [],
        accessLog: []
      };
      this._userPhoneAccessDraft = {
        friendId: String(value_22.id),
        enabled: value_23.enabled === true,
        apiPresetId: value_23.apiPresetId,
        autoTriggerEnabled: value_23.autoTrigger?.enabled === true,
        autoFrequency: value_23.autoTrigger?.frequency || "medium",
        allowedCharIds: value_23.allowedCharIds.slice(),
        search: ""
      };
      const userPhoneAccessSheet = this.ensureUserPhoneAccessSheet();
      this.renderUserPhoneAccessSheet();
      window.openView ? window.openView(userPhoneAccessSheet) : userPhoneAccessSheet.style.display = "flex";
    },
    renderUserPhoneAccessSheet: function () {
      const _userPhoneAccessDraft_25 = this._userPhoneAccessDraft,
        root_2 = document.getElementById("lovers-user-phone-access-sheet"),
        loversUserPhoneAccessPanelElement = root_2?.querySelector(".lovers-user-phone-access-panel");
      if (!_userPhoneAccessDraft_25 || !loversUserPhoneAccessPanelElement) return;
      const loversUserPhoneScrollElement = loversUserPhoneAccessPanelElement.querySelector(".lovers-user-phone-scroll"),
        max_27 = Math.max(0, Number(loversUserPhoneScrollElement?.scrollTop) || 0);
      window.mobileInputCompat?.unregister?.(loversUserPhoneAccessPanelElement.querySelector(".lovers-user-phone-search"));
      const result_28 = (window.imData?.friends || []).find(value_39 => String(value_39?.id) === _userPhoneAccessDraft_25.friendId);
      if (!this.isChar(result_28)) {
        window.closeView ? window.closeView(root_2) : root_2.style.display = "none";
        this._userPhoneAccessDraft = null;
        return;
      }
      const userPhoneAccessChars = this.getUserPhoneAccessChars(),
        value_29 = new Set(_userPhoneAccessDraft_25.allowedCharIds.map(String)),
        toLocaleLowerCase_30 = String(_userPhoneAccessDraft_25.search || "").trim().toLocaleLowerCase(),
        filter_31 = userPhoneAccessChars.filter(value_40 => {
          const toLocaleLowerCase_41 = ((value_40.nickname || "") + " " + (value_40.realname || value_40.realName || "")).toLocaleLowerCase();
          return !toLocaleLowerCase_30 || toLocaleLowerCase_41.includes(toLocaleLowerCase_30);
        }),
        items_32 = typeof window.getApiPresets === "function" ? window.getApiPresets() : [],
        some_33 = items_32.some(value_42 => String(value_42?.id) === String(_userPhoneAccessDraft_25.apiPresetId) && String(value_42?.endpoint || "").trim() && String(value_42?.apiKey || "").trim() && String(value_42?.model || "").trim()),
        value_34 = _userPhoneAccessDraft_25.enabled && _userPhoneAccessDraft_25.autoTriggerEnabled,
        value_35 = items_43 => items_43.map(value_44 => {
          const string = String(value_44.id),
            value_45 = value_44.nickname || value_44.realname || value_44.realName || "未命名 Char",
            value_46 = value_44.realname || value_44.realName || "",
            userPhoneRelationBadge = this.getUserPhoneRelationBadge(result_28, value_44),
            value_47 = value_44.avatarUrl ? "<img src=\"" + this.escapeHTML(value_44.avatarUrl) + "\" alt=\"\">" : "<i class=\"fas fa-user\"></i>";
          return "\n                <label class=\"lovers-user-phone-char-row\">\n                    <input type=\"checkbox\" data-user-phone-char-id=\"" + this.escapeHTML(string) + "\" " + (value_29.has(string) ? "checked" : "") + " " + (_userPhoneAccessDraft_25.enabled ? "" : "disabled") + ">\n                    <span class=\"lovers-user-phone-avatar\">" + value_47 + "</span>\n                    <span class=\"lovers-user-phone-char-copy\">\n                        <strong>" + this.escapeHTML(value_45) + "</strong>\n                        <small>" + (value_46 && value_46 !== value_45 ? this.escapeHTML(value_46) + " · " : "") + this.escapeHTML(userPhoneRelationBadge.label) + (userPhoneRelationBadge.detail ? " · " + this.escapeHTML(userPhoneRelationBadge.detail) : "") + "</small>\n                    </span>\n                    <span class=\"lovers-user-phone-check\"><i class=\"fas fa-check\"></i></span>\n                </label>";
        }).join("") || "<div class=\"lovers-user-phone-empty\">没有匹配的 Char</div>",
        value_35_36 = value_35(filter_31);
      loversUserPhoneAccessPanelElement.innerHTML = "\n            <div class=\"lovers-user-phone-header\">\n                <button type=\"button\" class=\"lovers-user-phone-cancel\">取消</button>\n                <div><strong>反查手机</strong><small>" + this.escapeHTML(result_28.nickname || result_28.realname || "Char") + " 的查阅权限</small></div>\n                <button type=\"button\" class=\"lovers-user-phone-save\">保存</button>\n            </div>\n            <div class=\"lovers-user-phone-scroll\">\n                <section class=\"lovers-user-phone-card\">\n                    <label class=\"lovers-user-phone-switch-row\">\n                        <span><strong>允许查手机</strong><small>开启后，普通单聊会把已授权内容直接提供给 Char，由其结合语义和人设决定是否使用</small></span>\n                        <input type=\"checkbox\" class=\"lovers-user-phone-enabled\" " + (_userPhoneAccessDraft_25.enabled ? "checked" : "") + ">\n                        <span class=\"lovers-user-phone-switch\"></span>\n                    </label>\n                </section>\n                <section class=\"lovers-user-phone-card " + (_userPhoneAccessDraft_25.enabled ? "" : "is-disabled") + "\">\n                    <div class=\"lovers-user-phone-section-title\"><div><strong>允许范围</strong><small>仅发送 User 备注和各自最近 20 条可见聊天</small></div><span>" + value_29.size + " / " + userPhoneAccessChars.length + "</span></div>\n                    <div class=\"lovers-user-phone-toolbar\">\n                        <label><i class=\"fas fa-search\"></i><input type=\"search\" class=\"lovers-user-phone-search\" value=\"" + this.escapeHTML(_userPhoneAccessDraft_25.search) + "\" placeholder=\"搜索 Char\" inputmode=\"text\" enterkeyhint=\"search\" autocomplete=\"off\" " + (_userPhoneAccessDraft_25.enabled ? "" : "disabled") + "></label>\n                        <button type=\"button\" data-user-phone-action=\"all\" " + (_userPhoneAccessDraft_25.enabled ? "" : "disabled") + ">全选</button>\n                        <button type=\"button\" data-user-phone-action=\"clear\" " + (_userPhoneAccessDraft_25.enabled ? "" : "disabled") + ">清空</button>\n                    </div>\n                    <div class=\"lovers-user-phone-char-list\">" + value_35_36 + "</div>\n                </section>\n                <section class=\"lovers-user-phone-card " + (_userPhoneAccessDraft_25.enabled ? "" : "is-disabled") + "\">\n                    <label class=\"lovers-user-phone-switch-row\">\n                        <span><strong>自动触发</strong><small>没有 User 新消息时，Char 也会按随机频率主动查看，并自行决定是否发私信</small></span>\n                        <input type=\"checkbox\" class=\"lovers-user-phone-auto-enabled\" " + (_userPhoneAccessDraft_25.autoTriggerEnabled ? "checked" : "") + " " + (_userPhoneAccessDraft_25.enabled ? "" : "disabled") + ">\n                        <span class=\"lovers-user-phone-switch\"></span>\n                    </label>\n                    <div class=\"lovers-user-phone-auto-fields " + (value_34 ? "" : "is-disabled") + "\">\n                        <label class=\"lovers-user-phone-field\"><span>自动触发 API 预设</span>\n                            <select class=\"lovers-user-phone-preset\" " + (value_34 ? "" : "disabled") + ">\n                                <option value=\"\">请选择系统 API 预设</option>\n                                " + items_32.map(value_48 => "<option value=\"" + this.escapeHTML(value_48.id) + "\" " + (String(value_48.id) === String(_userPhoneAccessDraft_25.apiPresetId) ? "selected" : "") + ">" + this.escapeHTML(value_48.name || value_48.model || "未命名预设") + (value_48.model ? " · " + this.escapeHTML(value_48.model) : "") + "</option>").join("") + "\n                            </select>\n                        </label>\n                        <label class=\"lovers-user-phone-field\"><span>巡查频率</span>\n                            <select class=\"lovers-user-phone-frequency\" " + (value_34 ? "" : "disabled") + ">\n                                <option value=\"low\" " + (_userPhoneAccessDraft_25.autoFrequency === "low" ? "selected" : "") + ">低 · 随机 4–8 小时</option>\n                                <option value=\"medium\" " + (_userPhoneAccessDraft_25.autoFrequency === "medium" ? "selected" : "") + ">中 · 随机 1–3 小时</option>\n                                <option value=\"high\" " + (_userPhoneAccessDraft_25.autoFrequency === "high" ? "selected" : "") + ">高 · 随机 15–45 分钟</option>\n                            </select>\n                        </label>\n                    </div>\n                    " + (_userPhoneAccessDraft_25.autoTriggerEnabled && _userPhoneAccessDraft_25.apiPresetId && !some_33 ? "<p class=\"lovers-user-phone-invalid\">所选预设已失效或配置不完整；自动触发前请重新选择。</p>" : "") + "\n                    <p class=\"lovers-user-phone-quota\"><i class=\"fas fa-bolt\"></i> 每次后台巡查只调用所选预设 1 次，会额外消耗额度；即使聊天没有新内容，Char 也可能只是想看看。</p>\n                </section>\n            </div>";
      const loversUserPhoneScrollElement_37 = loversUserPhoneAccessPanelElement.querySelector(".lovers-user-phone-scroll");
      if (loversUserPhoneScrollElement_37 && max_27 > 0) {
        const value_49 = () => {
          const max_50 = Math.max(0, loversUserPhoneScrollElement_37.scrollHeight - loversUserPhoneScrollElement_37.clientHeight);
          loversUserPhoneScrollElement_37.scrollTop = Math.min(max_27, max_50);
        };
        value_49();
        window.requestAnimationFrame?.(value_49);
      }
      loversUserPhoneAccessPanelElement.querySelector(".lovers-user-phone-cancel")?.addEventListener("click", () => {
        window.mobileInputCompat?.unregister?.(loversUserPhoneAccessPanelElement.querySelector(".lovers-user-phone-search"));
        this._userPhoneAccessDraft = null;
        window.closeView ? window.closeView(root_2) : root_2.style.display = "none";
      });
      loversUserPhoneAccessPanelElement.querySelector(".lovers-user-phone-save")?.addEventListener("click", () => void this.saveUserPhoneAccess());
      loversUserPhoneAccessPanelElement.querySelector(".lovers-user-phone-enabled")?.addEventListener("change", event_51 => {
        _userPhoneAccessDraft_25.enabled = event_51.target.checked;
        if (!_userPhoneAccessDraft_25.enabled) _userPhoneAccessDraft_25.autoTriggerEnabled = false;
        this.renderUserPhoneAccessSheet();
      });
      loversUserPhoneAccessPanelElement.querySelector(".lovers-user-phone-auto-enabled")?.addEventListener("change", event_52 => {
        _userPhoneAccessDraft_25.autoTriggerEnabled = _userPhoneAccessDraft_25.enabled && event_52.target.checked;
        this.renderUserPhoneAccessSheet();
      });
      loversUserPhoneAccessPanelElement.querySelector(".lovers-user-phone-preset")?.addEventListener("change", event_53 => {
        _userPhoneAccessDraft_25.apiPresetId = event_53.target.value;
        this.renderUserPhoneAccessSheet();
      });
      loversUserPhoneAccessPanelElement.querySelector(".lovers-user-phone-frequency")?.addEventListener("change", event_54 => {
        _userPhoneAccessDraft_25.autoFrequency = ["low", "medium", "high"].includes(event_54.target.value) ? event_54.target.value : "medium";
        this.renderUserPhoneAccessSheet();
      });
      const value_38 = () => {
        loversUserPhoneAccessPanelElement.querySelectorAll("[data-user-phone-char-id]").forEach(value_55 => value_55.addEventListener("change", () => {
          const string_56 = String(value_55.dataset.userPhoneCharId || ""),
            value_57 = new Set(_userPhoneAccessDraft_25.allowedCharIds.map(String));
          value_55.checked ? value_57.add(string_56) : value_57["delete"](string_56);
          _userPhoneAccessDraft_25.allowedCharIds = [...value_57];
          this.renderUserPhoneAccessSheet();
        }));
      };
      value_38();
      const input_2 = loversUserPhoneAccessPanelElement.querySelector(".lovers-user-phone-search");
      input_2?.addEventListener("input", event_58 => {
        _userPhoneAccessDraft_25.search = event_58.target.value;
        const toLocaleLowerCase_59 = String(_userPhoneAccessDraft_25.search || "").trim().toLocaleLowerCase(),
          filter_60 = userPhoneAccessChars.filter(value_61 => {
            const toLocaleLowerCase_62 = ((value_61.nickname || "") + " " + (value_61.realname || value_61.realName || "")).toLocaleLowerCase();
            return !toLocaleLowerCase_59 || toLocaleLowerCase_62.includes(toLocaleLowerCase_59);
          }),
          loversUserPhoneCharListElement = loversUserPhoneAccessPanelElement.querySelector(".lovers-user-phone-char-list");
        loversUserPhoneCharListElement && (loversUserPhoneCharListElement.innerHTML = value_35(filter_60), value_38());
      });
      input_2 && typeof window.mobileInputCompat?.register === "function" ? window.mobileInputCompat.register({
        input: input_2,
        root: root_2,
        scrollContainer: loversUserPhoneAccessPanelElement.querySelector(".lovers-user-phone-scroll"),
        onSend: () => {},
        allowEmpty: true,
        enterKeyHint: "search",
        blurAfterSend: true,
        restoreWindowScroll: false
      }) : input_2?.addEventListener("keydown", event_63 => {
        const value_64 = event_63.key === "Enter" && !event_63.isComposing && event_63.keyCode !== 229 && !event_63.shiftKey && !event_63.ctrlKey && !event_63.metaKey && !event_63.altKey;
        if (!value_64) return;
        event_63.preventDefault();
        input_2.blur();
      });
      loversUserPhoneAccessPanelElement.querySelector("[data-user-phone-action=\"all\"]")?.addEventListener("click", () => {
        _userPhoneAccessDraft_25.allowedCharIds = userPhoneAccessChars.map(value_65 => String(value_65.id));
        this.renderUserPhoneAccessSheet();
      });
      loversUserPhoneAccessPanelElement.querySelector("[data-user-phone-action=\"clear\"]")?.addEventListener("click", () => {
        _userPhoneAccessDraft_25.allowedCharIds = [];
        this.renderUserPhoneAccessSheet();
      });
    },
    saveUserPhoneAccess: async function () {
      const _userPhoneAccessDraft_66 = this._userPhoneAccessDraft;
      if (!_userPhoneAccessDraft_66) return;
      const result_67 = (window.imData?.friends || []).find(value_74 => String(value_74?.id) === _userPhoneAccessDraft_66.friendId);
      if (!this.isChar(result_67)) {
        this._userPhoneAccessDraft = null;
        const loversUserPhoneAccessSheetElement_75 = document.getElementById("lovers-user-phone-access-sheet");
        loversUserPhoneAccessSheetElement_75 && (window.mobileInputCompat?.unregister?.(loversUserPhoneAccessSheetElement_75.querySelector(".lovers-user-phone-search")), window.closeView ? window.closeView(loversUserPhoneAccessSheetElement_75) : loversUserPhoneAccessSheetElement_75.style.display = "none");
        window.showToast?.("当前 Char 已不可用，未保存设置");
        return;
      }
      const value_68 = typeof window.getApiPresets === "function" ? window.getApiPresets() : [],
        result_69 = value_68.find(value_76 => String(value_76?.id) === String(_userPhoneAccessDraft_66.apiPresetId) && String(value_76?.endpoint || "").trim() && String(value_76?.apiKey || "").trim() && String(value_76?.model || "").trim()),
        value_70 = new Set(this.getUserPhoneAccessChars().map(value_77 => String(value_77.id))),
        allowedCharIds_2 = [...new Set(_userPhoneAccessDraft_66.allowedCharIds.map(String))].filter(value_78 => value_70.has(value_78));
      if (_userPhoneAccessDraft_66.enabled && allowedCharIds_2.length === 0) {
        window.showToast?.("开启前请至少勾选一个 Char");
        return;
      }
      if (_userPhoneAccessDraft_66.enabled && _userPhoneAccessDraft_66.autoTriggerEnabled && !result_69) {
        window.showToast?.("开启自动触发前请选择有效的 API 预设");
        return;
      }
      const value_72 = await window.imApp?.commitScopedFriendChange?.(_userPhoneAccessDraft_66.friendId, value_79 => {
        const userPhoneAccess_2 = window.imApp.normalizeUserPhoneAccess(value_79.userPhoneAccess),
          enabled_81 = userPhoneAccess_2.autoTrigger.enabled,
          frequency_82 = userPhoneAccess_2.autoTrigger.frequency;
        userPhoneAccess_2.enabled = _userPhoneAccessDraft_66.enabled === true;
        userPhoneAccess_2.apiPresetId = String(_userPhoneAccessDraft_66.apiPresetId || "");
        userPhoneAccess_2.allowedCharIds = allowedCharIds_2;
        userPhoneAccess_2.autoTrigger.enabled = userPhoneAccess_2.enabled && _userPhoneAccessDraft_66.autoTriggerEnabled === true;
        userPhoneAccess_2.autoTrigger.frequency = ["low", "medium", "high"].includes(_userPhoneAccessDraft_66.autoFrequency) ? _userPhoneAccessDraft_66.autoFrequency : "medium";
        if (!userPhoneAccess_2.autoTrigger.enabled) userPhoneAccess_2.autoTrigger.nextRunAt = 0;else (!enabled_81 || frequency_82 !== userPhoneAccess_2.autoTrigger.frequency) && (userPhoneAccess_2.autoTrigger.nextRunAt = 0);
        userPhoneAccess_2.privateFindings = userPhoneAccess_2.enabled ? userPhoneAccess_2.privateFindings.filter(value_83 => value_83.charIds.every(value_84 => allowedCharIds_2.includes(String(value_84)))) : [];
        value_79.userPhoneAccess = userPhoneAccess_2;
      }, {
        silent: true,
        immediate: true,
        metaOnly: true,
        syncActive: true
      });
      if (!value_72) {
        window.showToast?.("保存失败，请稍后再试");
        return;
      }
      this._userPhoneAccessDraft = null;
      const loversUserPhoneAccessSheetElement_73 = document.getElementById("lovers-user-phone-access-sheet");
      window.mobileInputCompat?.unregister?.(loversUserPhoneAccessSheetElement_73?.querySelector(".lovers-user-phone-search"));
      window.closeView ? window.closeView(loversUserPhoneAccessSheetElement_73) : loversUserPhoneAccessSheetElement_73.style.display = "none";
      window.imChat?.refreshAutonomousActivityTimers?.();
      window.showToast?.(_userPhoneAccessDraft_66.enabled ? _userPhoneAccessDraft_66.autoTriggerEnabled ? "允许查手机和自动触发已开启" : "允许查手机已开启" : "允许查手机已关闭");
    }
  };
  window.addEventListener("u2:api-presets-updated", () => {
    const loversUserPhoneAccessSheetElement_85 = document.getElementById("lovers-user-phone-access-sheet");
    (loversUserPhoneAccessSheetElement_85?.classList.contains("active") || loversUserPhoneAccessSheetElement_85?.style.display === "flex") && window.userPhoneAccessUi.renderUserPhoneAccessSheet();
  });
})();
