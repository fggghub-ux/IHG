(window.u2OnStorageReady || (callback => document.addEventListener("DOMContentLoaded", callback)))(() => {
  window.imChat = window.imChat || {};
  function formatProfileStatusLabel(value_2, isSleeping = false) {
    if (isSleeping) return "offline";
    const raw_2 = String(value_2 || "online").trim(),
      normalized = raw_2.toLowerCase();
    if (normalized === "offline" || raw_2 === "离线") return "offline";
    if (normalized === "online" || raw_2 === "在线") return "online";
    return raw_2 || "online";
  }
  async function commitStatusFriendChange(friendOrId, mutator, options = {}) {
    const commitOptions = {
      metaOnly: options.metaOnly !== false,
      ...options
    };
    return window.imApp.commitScopedFriendChange(friendOrId, mutator, {
      syncActive: true,
      ...commitOptions
    });
  }
  function ensureProfilePanelData(friend_2) {
    if (!friend_2) return window.imApp.createDefaultProfilePanel({});
    window.imApp.migrateSingleChatProfileStatus && window.imApp.migrateSingleChatProfileStatus(friend_2);
    const profilePanel_2 = window.imApp.createDefaultProfilePanel(friend_2);
    return friend_2.profilePanel = profilePanel_2, friend_2.latestThought = profilePanel_2.thought, friend_2.status = profilePanel_2.status || "online", profilePanel_2;
  }
  function getProfilePanelData_2(friend) {
    if (!friend) return window.imApp.createDefaultProfilePanel({});
    return ensureProfilePanelData(friend);
  }
  function getProfilePanelUiState_2(friendOrId_2) {
    const targetId = window.imApp.resolveFriendId(friendOrId_2),
      safeFriendId = targetId != null ? String(targetId) : "default",
      stateMap = window.imData.profilePanelUiStateByFriendId || (window.imData.profilePanelUiStateByFriendId = {}),
      value_34 = stateMap[safeFriendId];
    return (!value_34 || typeof value_34 !== "object") && (stateMap[safeFriendId] = {
      open: false,
      selectedHistoryIndex: 0
    }), (!Number.isInteger(stateMap[safeFriendId].selectedHistoryIndex) || stateMap[safeFriendId].selectedHistoryIndex < 0) && (stateMap[safeFriendId].selectedHistoryIndex = 0), stateMap[safeFriendId];
  }
  function escapeProfilePanelHtml(value_3) {
    return String(value_3 ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  const value_5 = new Set(["raw", "time", "index", "total", "avatar"]);
  function getStatusRenderMode_2(value_36) {
    if (!value_36 || value_36.type === "group") return "default";
    const trim_37 = String(value_36.statusRenderMode || "").trim();
    if (["template", "css", "default"].includes(trim_37)) return trim_37;
    if (value_36.statusTemplate?.enabled === true) return "template";
    if (value_36.statusCssEnabled && String(value_36.statusCss || "").trim()) return "css";
    return "default";
  }
  function handleAction_7(value_38, value_39) {
    const trim_40 = String(value_38?.statusCss || "").trim();
    if (!value_39 || getStatusRenderMode_2(value_38) !== "css" || value_38?.statusCssEnabled !== true || !trim_40) return false;
    const max_41 = Math.max(0, Number(value_39.createdAt) || 0);
    if (!max_41) return false;
    const max_42 = Math.max(0, Number(value_38.statusCssAppliedAt) || 0);
    return max_42 === 0 || max_41 >= max_42;
  }
  function handleAction_8(value_43, value_44, value_45) {
    if (!value_44) return;
    value_44.dataset.statusCssActive = handleAction_7(value_43, value_45) ? "true" : "false";
  }
  function handleAction_9(value_46) {
    const value_47 = new Set(),
      value_48 = /\(\?<([A-Za-z_$][\w$]*)>/g;
    let value_49;
    while (value_49 = value_48.exec(String(value_46 || ""))) {
      value_47.add(value_49[1]);
    }
    return Array.from(value_47);
  }
  function sanitizeHtmlTemplate_2(value_50) {
    const innerHTML_2 = String(value_50 || "");
    if (!innerHTML_2.trim() || typeof document === "undefined") return "";
    const element = document.createElement("template");
    return element.innerHTML = innerHTML_2, element.content.querySelectorAll("script, style, iframe, object, embed, link, meta, base, frame, frameset").forEach(value_51 => value_51.remove()), element.content.querySelectorAll("*").forEach(value_52 => {
      Array.from(value_52.attributes).forEach(value_53 => {
        const toLowerCase_54 = value_53.name.toLowerCase(),
          trim_55 = String(value_53.value || "").trim(),
          toLowerCase_56 = trim_55.replace(/[\u0000-\u001f\u007f\s]+/g, "").toLowerCase();
        if (toLowerCase_54.startsWith("on") || toLowerCase_54 === "srcdoc") {
          value_52.removeAttribute(value_53.name);
          return;
        }
        if (["href", "src", "action", "formaction", "xlink:href"].includes(toLowerCase_54) && /^(?:javascript|vbscript):/.test(toLowerCase_56)) {
          value_52.removeAttribute(value_53.name);
          return;
        }
        toLowerCase_54 === "style" && /(?:expression\s*\(|url\s*\(\s*['"]?\s*javascript:)/i.test(trim_55) && value_52.removeAttribute(value_53.name);
      });
    }), element.innerHTML;
  }
  function validateStatusTemplate_2(value_57) {
    const template_2 = window.imApp.createDefaultStatusTemplate ? window.imApp.createDefaultStatusTemplate(value_57 || {}) : {
        enabled: value_57?.enabled === true,
        prompt: String(value_57?.prompt || "").trim(),
        regex: String(value_57?.regex || "").trim(),
        html: String(value_57?.html || "").trim()
      },
      prompt_2 = String(value_57?.prompt || "").trim(),
      regex_2 = String(value_57?.regex || "").trim(),
      html_2 = String(value_57?.html || "").trim();
    if (!prompt_2) return {
      valid: false,
      error: "状态生成提示词不能为空",
      template: template_2
    };
    if (!regex_2) return {
      valid: false,
      error: "解析正则不能为空",
      template: template_2
    };
    if (!html_2) return {
      valid: false,
      error: "状态栏 HTML 不能为空",
      template: template_2
    };
    try {
      new RegExp(regex_2, "u");
    } catch (value_64) {
      return {
        valid: false,
        error: "解析正则无效：" + value_64.message,
        template: template_2
      };
    }
    const captureNames_2 = handleAction_9(regex_2);
    if (captureNames_2.length === 0) return {
      valid: false,
      error: "解析正则至少需要一个命名捕获组，例如 (?<thought>[\\s\\S]+)",
      template: template_2
    };
    const result = captureNames_2.find(value_65 => value_5.has(value_65));
    if (result) return {
      valid: false,
      error: "命名捕获组“" + result + "”是保留变量，请换一个名字",
      template: template_2
    };
    const handleAction_10_63 = sanitizeHtmlTemplate_2(html_2);
    if (!handleAction_10_63.trim()) return {
      valid: false,
      error: "状态栏 HTML 不包含可用内容",
      template: template_2
    };
    return {
      valid: true,
      error: "",
      template: {
        ...template_2,
        enabled: value_57?.enabled !== false,
        prompt: prompt_2,
        regex: regex_2,
        html: html_2
      },
      captureNames: captureNames_2
    };
  }
  function renderStatusTemplate_2(value_66, value_67, contact = {}) {
    const handleAction_11_68 = validateStatusTemplate_2(value_66);
    if (!handleAction_11_68.valid || value_66?.enabled !== true || !value_67) return {
      applied: false,
      html: "",
      error: handleAction_11_68.error || ""
    };
    let value_69;
    try {
      value_69 = String(value_67.thought || "").match(new RegExp(handleAction_11_68.template.regex, "u"));
    } catch (value_73) {
      return {
        applied: false,
        html: "",
        error: "解析正则无效"
      };
    }
    if (!value_69?.groups) return {
      applied: false,
      html: "",
      error: "当前状态未匹配解析正则"
    };
    const options_70 = {
        ...value_69.groups,
        raw: String(value_67.thought || ""),
        time: String(contact.time || ""),
        index: String(contact.index || ""),
        total: String(contact.total || ""),
        avatar: String(contact.avatar || "")
      },
      replace_71 = handleAction_11_68.template.html.replace(/{{\s*([A-Za-z_$][\w$]*)\s*}}/g, (value_74, value_75) => {
        if (!Object.prototype.hasOwnProperty.call(options_70, value_75)) return "";
        return escapeProfilePanelHtml(options_70[value_75]);
      }),
      html_3 = sanitizeHtmlTemplate_2(replace_71);
    if (!html_3.trim()) return {
      applied: false,
      html: "",
      error: "状态栏 HTML 不包含可用内容"
    };
    return {
      applied: true,
      html: html_3,
      error: "",
      captureNames: handleAction_11_68.captureNames,
      reservedVariables: Array.from(value_5)
    };
  }
  function getProfileStatusHistory_2(friend_3, panelOverride = null) {
    const panel_2 = panelOverride || window.imChat.getProfilePanelData(friend_3);
    return Array.isArray(panel_2.statusHistory) ? panel_2.statusHistory : [];
  }
  function getSelectedProfileStatus_2(value_78, value_79 = null) {
    const history_2 = getProfileStatusHistory_2(value_78, value_79),
      uiState_2 = window.imChat.getProfilePanelUiState(value_78),
      max_80 = Math.max(0, Math.min(uiState_2.selectedHistoryIndex || 0, Math.max(0, history_2.length - 1)));
    return uiState_2.selectedHistoryIndex = max_80, {
      history: history_2,
      index: max_80,
      snapshot: history_2[max_80] || null
    };
  }
  function handleAction_15(value_81, value_82) {
    const snapshot_2 = value_82?.snapshot;
    if (!snapshot_2 || value_81?.type === "group" || getStatusRenderMode_2(value_81) !== "template") return {
      applied: false,
      html: ""
    };
    const createdAt_2 = snapshot_2.createdAt ? new Date(snapshot_2.createdAt) : null,
      time_2 = createdAt_2 && !Number.isNaN(createdAt_2.getTime()) ? createdAt_2.toLocaleString() : "时间未记录";
    return renderStatusTemplate_2(value_81.statusTemplate, snapshot_2, {
      time: time_2,
      index: value_82.index + 1,
      total: value_82.history.length,
      avatar: value_81.avatarUrl || "https://picsum.photos/seed/char/100/100"
    });
  }
  function applySnapshotAsCurrent(panel_3, friend_4, snapshot_3) {
    if (!panel_3 || !friend_4) return;
    panel_3.thought = snapshot_3?.thought || "";
    panel_3.affection = typeof snapshot_3?.affection === "number" ? snapshot_3.affection : 0;
    panel_3.affectionChange = typeof snapshot_3?.affectionChange === "number" ? snapshot_3.affectionChange : 0;
    friend_4.latestThought = panel_3.thought;
  }
  async function editProfileStatusSnapshot_2(value_89, snapshotId, updates) {
    const targetFriend_2 = window.imApp.getFriendById(value_89);
    if (!targetFriend_2 || !snapshotId || !updates) return false;
    return commitStatusFriendChange(targetFriend_2, friend_5 => {
      const panel_4 = ensureProfilePanelData(friend_5),
        statusHistory_3 = Array.isArray(panel_4.statusHistory) ? panel_4.statusHistory : [],
        index_2 = statusHistory_3.findIndex(value_96 => String(value_96.id) === String(snapshotId));
      if (index_2 < 0) return;
      const snapshot_4 = statusHistory_3[index_2];
      if (typeof updates.thought === "string") snapshot_4.thought = updates.thought.trim();
      snapshot_4.legacy = false;
      panel_4.statusHistory = statusHistory_3;
      if (index_2 === 0) applySnapshotAsCurrent(panel_4, friend_5, snapshot_4);
    }, {
      silent: true
    });
  }
  async function deleteProfileStatusSnapshot_2(value_97, value_98) {
    const friendById_99 = window.imApp.getFriendById(value_97);
    if (!friendById_99 || !value_98) return false;
    return commitStatusFriendChange(friendById_99, friend_6 => {
      const panel_5 = ensureProfilePanelData(friend_6),
        statusHistory_2 = Array.isArray(panel_5.statusHistory) ? panel_5.statusHistory : [],
        index_3 = statusHistory_2.findIndex(value_104 => String(value_104.id) === String(value_98));
      if (index_3 < 0) return;
      statusHistory_2.splice(index_3, 1);
      panel_5.statusHistory = statusHistory_2;
      if (index_3 === 0) applySnapshotAsCurrent(panel_5, friend_6, statusHistory_2[0] || null);
    }, {
      silent: true
    });
  }
  function buildProfilePanelBody_2(friend_7, renderContext = {}) {
    const panel_6 = renderContext.panel || window.imChat.getProfilePanelData(friend_7),
      {
        history: history_3,
        index: index_4
      } = renderContext.statusSelection || getSelectedProfileStatus_2(friend_7, panel_6);
    if (history_3.length === 0) return "\n                <div class=\"chat-profile-panel-empty\">\n                    <div class=\"chat-profile-panel-empty-title\">暂无状态</div>\n                    <div class=\"chat-profile-panel-empty-desc\">生成新的聊天回复后，这里会保存完整状态记录。</div>\n                </div>\n            ";
    const snapshot_5 = history_3[index_4],
      createdAt_3 = snapshot_5.createdAt ? new Date(snapshot_5.createdAt) : null,
      timeLabel = createdAt_3 && !Number.isNaN(createdAt_3.getTime()) ? createdAt_3.toLocaleString() : "时间未记录",
      field = value_4 => escapeProfilePanelHtml(value_4 || "未记录"),
      value_114 = renderContext.templateResult || handleAction_15(friend_7, {
        history: history_3,
        index: index_4,
        snapshot: snapshot_5
      });
    if (value_114.applied) return value_114.html;
    return "\n            <div class=\"chat-profile-status-page\" data-selected-index=\"" + index_4 + "\" data-status-id=\"" + escapeProfilePanelHtml(snapshot_5.id) + "\">\n                <div class=\"chat-profile-status-time\">" + escapeProfilePanelHtml(timeLabel) + "</div>\n                <div class=\"gmp-inner-voice chat-profile-panel-thought\">" + field(snapshot_5.thought) + "</div>\n                <div class=\"chat-profile-status-counter\"><span>" + (index_4 + 1) + "</span> / " + history_3.length + "</div>\n            </div>\n        ";
  }
  function handleAction_19(value_116, panelEl_2, value_118 = null) {
    if (!value_116 || !panelEl_2) return;
    const panel_9 = value_118 || window.imChat.getProfilePanelData(value_116),
      statusSelection_2 = getSelectedProfileStatus_2(value_116, panel_9);
    handleAction_8(value_116, panelEl_2, statusSelection_2.snapshot);
    const handleAction_15_121 = handleAction_15(value_116, statusSelection_2),
      value_122 = handleAction_15_121.applied || !!panelEl_2.querySelector(".chat-profile-panel-card.is-status-template-card");
    if (value_122) {
      window.imChat.renderProfilePanel(value_116, panelEl_2);
      return;
    }
    const snapshot_123 = statusSelection_2.snapshot,
      contentEl = panelEl_2.querySelector(".chat-profile-panel-content");
    contentEl && (contentEl.innerHTML = buildProfilePanelBody_2(value_116, {
      panel: panel_9,
      statusSelection: statusSelection_2
    }));
    const affection_2 = typeof snapshot_123?.affection === "number" ? snapshot_123.affection : typeof panel_9.affection === "number" ? panel_9.affection : 0,
      affectionChange_2 = typeof snapshot_123?.affectionChange === "number" ? snapshot_123.affectionChange : typeof panel_9.affectionChange === "number" ? panel_9.affectionChange : 0,
      affectionEl = panelEl_2.querySelector(".chat-profile-status-affection span"),
      affectionChangeEl = panelEl_2.querySelector(".chat-profile-status-affection-change");
    if (affectionEl) affectionEl.textContent = String(affection_2);
    affectionChangeEl && (affectionChangeEl.textContent = affectionChange_2 >= 0 ? "+" + affectionChange_2 : String(affectionChange_2), affectionChangeEl.style.display = affectionChange_2 === 0 ? "none" : "");
    panelEl_2.querySelectorAll("[data-action=\"page-status\"]").forEach(button => {
      const isNewer = button.getAttribute("data-direction") === "newer";
      button.disabled = isNewer ? statusSelection_2.index <= 0 : statusSelection_2.index >= statusSelection_2.history.length - 1;
    });
  }
  function renderProfilePanel_2(friend_8, panelEl) {
    if (!friend_8 || !panelEl) return;
    const panel_7 = window.imChat.getProfilePanelData(friend_8),
      profilePanelUiState_128 = window.imChat.getProfilePanelUiState(friend_8),
      avatarUrl_2 = friend_8.avatarUrl || "https://picsum.photos/seed/char/100/100";
    let isSleeping_2 = false;
    if (typeof window.imApp.isCharacterSleeping === "function") isSleeping_2 = window.imApp.isCharacterSleeping(friend_8);else {
      if (friend_8.memory && friend_8.memory.schedule && friend_8.memory.schedule.enabled) {
        const now = new Date(),
          currentTotalMinutes = now.getHours() * 60 + now.getMinutes(),
          parseTime = timeStr => {
            if (!timeStr) return 0;
            const [h, m] = timeStr.split(":").map(Number);
            return (h || 0) * 60 + (m || 0);
          },
          sleepMin = parseTime(friend_8.memory.schedule.sleepTime || "23:00"),
          wakeMin = parseTime(friend_8.memory.schedule.wakeTime || "07:00");
        sleepMin > wakeMin ? isSleeping_2 = currentTotalMinutes >= sleepMin || currentTotalMinutes < wakeMin : isSleeping_2 = currentTotalMinutes >= sleepMin && currentTotalMinutes < wakeMin;
      }
    }
    const name_2 = friend_8.nickname || friend_8.realName || "Unknown",
      signature_2 = friend_8.signature || "这个人很懒，什么都没写",
      onlineLabel = formatProfileStatusLabel(panel_7.status || friend_8.status || "online", isSleeping_2),
      statusSelection_3 = getSelectedProfileStatus_2(friend_8, panel_7),
      snapshot_135 = statusSelection_3.snapshot;
    handleAction_8(friend_8, panelEl, snapshot_135);
    const canPageNewer = statusSelection_3.index > 0,
      canPageOlder = statusSelection_3.index < statusSelection_3.history.length - 1,
      value_138 = typeof snapshot_135?.affection === "number" ? snapshot_135.affection : typeof panel_7.affection === "number" ? panel_7.affection : 0,
      value_139 = typeof snapshot_135?.affectionChange === "number" ? snapshot_135.affectionChange : typeof panel_7.affectionChange === "number" ? panel_7.affectionChange : 0,
      value_140 = value_139 >= 0 ? "+" + value_139 : "" + value_139,
      templateResult_2 = handleAction_15(friend_8, statusSelection_3),
      value_142 = templateResult_2.applied ? "<div class=\"chat-profile-panel-template-content\">" + templateResult_2.html + "</div>" : "\n                <div class=\"gmp-header chat-profile-panel-header\" style=\"position: relative;\">\n                    <div class=\"gmp-avatar-wrapper\">\n                        <div class=\"gmp-avatar\"><img src=\"" + avatarUrl_2 + "\"></div>\n                        <div class=\"gmp-status-bubble chat-profile-panel-header-status\">" + onlineLabel + "</div>\n                    </div>\n                    <button type=\"button\" class=\"chat-profile-panel-close\" aria-label=\"关闭\">\n                        <i class=\"fas fa-times\"></i>\n                    </button>\n                </div>\n                <div class=\"gmp-body chat-profile-panel-body\">\n                    <div class=\"gmp-name-row\" style=\"display: flex; justify-content: space-between; align-items: center; width: 100%;\">\n                        <div class=\"gmp-name\">" + name_2 + "</div>\n                        <div style=\"display: flex; flex-direction: column; align-items: flex-end;\">\n                            <div class=\"chat-profile-status-affection\" style=\"background: #f2f2f7; color: #8e8e93; padding: 4px 10px; border-radius: 999px; font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 4px;\">\n                                <i class=\"fas fa-heart\"></i> <span>" + value_138 + "</span>\n                            </div>\n                            <div class=\"chat-profile-status-affection-change\" style=\"font-size: 10px; color: #8e8e93; margin-top: 4px; font-weight: 600; " + (value_139 === 0 ? "display:none;" : "") + "\">" + value_140 + "</div>\n                        </div>\n                    </div>\n                    <div class=\"gmp-signature\">" + signature_2 + "</div>\n                    <div class=\"chat-profile-panel-content\">\n                        " + window.imChat.buildProfilePanelBody(friend_8, {
        panel: panel_7,
        statusSelection: statusSelection_3,
        templateResult: templateResult_2
      }) + "\n                    </div>\n                </div>\n            ";
    panelEl.innerHTML = "\n            <div style=\"display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 320px; margin: 0 auto;\">\n                <div class=\"chat-profile-panel-card " + (templateResult_2.applied ? "is-status-template-card" : "") + "\" style=\"width: 100%;\">\n                    " + value_142 + "\n                    <div class=\"chat-profile-status-edit-overlay\" style=\"display:none;\">\n                        <form class=\"chat-profile-status-edit-card\">\n                            <div class=\"chat-profile-status-edit-title\">编辑状态</div>\n                            <label>状态内容<textarea name=\"thought\" rows=\"6\" required></textarea></label>\n                            <div class=\"chat-profile-status-edit-readonly\"></div>\n                            <div class=\"chat-profile-status-edit-actions\">\n                                <button type=\"button\" data-action=\"cancel-status-edit\">取消</button>\n                                <button type=\"submit\" class=\"is-primary\">保存</button>\n                            </div>\n                        </form>\n                    </div>\n                </div>\n                \n                <div class=\"chat-profile-panel-floating-tabs\" style=\"display: flex; flex-direction: row; gap: 8px; margin-top: 18px; z-index: 100;\">\n                    " + (templateResult_2.applied ? "<button type=\"button\" class=\"chat-profile-panel-action-btn chat-profile-panel-system-close\" aria-label=\"关闭\"><i class=\"fas fa-times\"></i></button>" : "") + "\n                    <button type=\"button\" class=\"chat-profile-panel-action-btn is-page\" data-action=\"page-status\" data-direction=\"newer\" aria-label=\"上一条状态\" " + (canPageNewer ? "" : "disabled") + "><i class=\"fas fa-chevron-left\"></i></button>\n                    <button type=\"button\" class=\"chat-profile-panel-action-btn\" data-action=\"edit-status\" aria-label=\"编辑状态\"><i class=\"fas fa-pen\"></i></button>\n                    <button type=\"button\" class=\"chat-profile-panel-action-btn is-danger\" data-action=\"delete-status\" aria-label=\"删除状态\"><i class=\"fas fa-trash-alt\"></i></button>\n                    <button type=\"button\" class=\"chat-profile-panel-action-btn is-page\" data-action=\"page-status\" data-direction=\"older\" aria-label=\"下一条状态\" " + (canPageOlder ? "" : "disabled") + "><i class=\"fas fa-chevron-right\"></i></button>\n                </div>\n            </div>\n        ";
    const closeBtn = panelEl.querySelector(".chat-profile-panel-close, .chat-profile-panel-system-close");
    closeBtn && closeBtn.addEventListener("click", e => {
      e.stopPropagation();
      window.imChat.hideProfilePanel(friend_8, panelEl);
    });
    panelEl.querySelectorAll("[data-action=\"page-status\"]").forEach(button_2 => {
      button_2.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        if (button_2.disabled) return;
        const latestFriend_2 = window.imApp.getFriendById(friend_8) || friend_8,
          panel_8 = window.imChat.getProfilePanelData(latestFriend_2),
          {
            history: history_4,
            index: index_5
          } = getSelectedProfileStatus_2(latestFriend_2, panel_8),
          direction = button_2.getAttribute("data-direction") === "newer" ? -1 : 1,
          selectedHistoryIndex_2 = index_5 + direction;
        if (selectedHistoryIndex_2 < 0 || selectedHistoryIndex_2 >= history_4.length) return;
        const profilePanelUiState_155 = window.imChat.getProfilePanelUiState(latestFriend_2);
        profilePanelUiState_155.selectedHistoryIndex = selectedHistoryIndex_2;
        handleAction_19(latestFriend_2, panelEl, panel_8);
      });
    });
    const editOverlay = panelEl.querySelector(".chat-profile-status-edit-overlay"),
      editForm = panelEl.querySelector(".chat-profile-status-edit-card"),
      closeStatusEditor = () => {
        if (!editOverlay) return;
        editOverlay.classList.remove("active");
        setTimeout(() => {
          if (!editOverlay.classList.contains("active")) editOverlay.style.display = "none";
        }, 180);
      };
    panelEl.querySelector("[data-action=\"cancel-status-edit\"]")?.addEventListener("click", closeStatusEditor);
    editOverlay?.addEventListener("click", e_2 => {
      if (e_2.target === editOverlay) closeStatusEditor();
    });
    panelEl.querySelector("[data-action=\"edit-status\"]")?.addEventListener("click", event_157 => {
      event_157.stopPropagation();
      const latestFriend_3 = window.imApp.getFriendById(friend_8) || friend_8,
        {
          snapshot: snapshot_6
        } = getSelectedProfileStatus_2(latestFriend_3);
      if (!snapshot_6 || !editOverlay || !editForm) {
        if (window.showToast) window.showToast("暂无可编辑的状态");
        return;
      }
      editForm.dataset.statusId = snapshot_6.id;
      const thoughtInput = editForm.elements.namedItem("thought");
      if (thoughtInput) thoughtInput.value = snapshot_6.thought || "";
      const readonly = editForm.querySelector(".chat-profile-status-edit-readonly");
      if (readonly) {
        const affectionText = typeof snapshot_6.affection === "number" ? snapshot_6.affection : "未记录",
          value_162 = typeof snapshot_6.affectionChange === "number" ? snapshot_6.affectionChange >= 0 ? "+" + snapshot_6.affectionChange : snapshot_6.affectionChange : "未记录";
        readonly.textContent = "好感度 " + affectionText + " · 本次变化 " + value_162;
      }
      editOverlay.style.display = "flex";
      requestAnimationFrame(() => editOverlay.classList.add("active"));
    });
    editForm?.addEventListener("submit", async e_3 => {
      e_3.preventDefault();
      e_3.stopPropagation();
      const thought_2 = String(editForm.elements.namedItem("thought")?.value || "").trim();
      if (!thought_2) {
        if (window.showToast) window.showToast("状态内容不能为空");
        return;
      }
      const saved_2 = await editProfileStatusSnapshot_2(friend_8, editForm.dataset.statusId, {
        thought: thought_2
      });
      if (!saved_2) {
        if (window.showToast) window.showToast("状态更新失败");
        return;
      }
      closeStatusEditor();
      const latestFriend_4 = window.imApp.getFriendById(friend_8) || friend_8;
      window.imChat.renderProfilePanel(latestFriend_4, panelEl);
      if (window.showToast) window.showToast("状态已更新");
    });
    panelEl.querySelector("[data-action=\"delete-status\"]")?.addEventListener("click", event_167 => {
      event_167.stopPropagation();
      const latestFriend = window.imApp.getFriendById(friend_8) || friend_8,
        {
          history: history_5,
          index: index_6,
          snapshot: snapshot_7
        } = getSelectedProfileStatus_2(latestFriend);
      if (!snapshot_7) {
        if (window.showToast) window.showToast("暂无可删除的状态");
        return;
      }
      const onConfirm_2 = async () => {
        const saved = await deleteProfileStatusSnapshot_2(latestFriend, snapshot_7.id);
        if (!saved) {
          if (window.showToast) window.showToast("状态删除失败");
          return;
        }
        const uiState = window.imChat.getProfilePanelUiState(latestFriend);
        uiState.selectedHistoryIndex = Math.max(0, Math.min(index_6, history_5.length - 2));
        const refreshedFriend = window.imApp.getFriendById(latestFriend) || latestFriend;
        window.imChat.renderProfilePanel(refreshedFriend, panelEl);
        if (window.showToast) window.showToast("状态已删除");
      };
      window.showCustomModal ? window.showCustomModal({
        title: "删除状态",
        message: index_6 === 0 ? "删除最新状态后，上一条状态会自动接替为当前状态。" : "确定删除当前查看的这条历史状态吗？",
        confirmText: "删除",
        cancelText: "取消",
        isDestructive: true,
        onConfirm: onConfirm_2
      }) : onConfirm_2();
    });
  }
  function showProfilePanel_2(friend_9, element_173) {
    if (!friend_9 || !element_173) return;
    const hadLegacyFields = window.imApp.migrateSingleChatProfileStatus ? window.imApp.migrateSingleChatProfileStatus(friend_9) : false;
    (hadLegacyFields || friend_9._profileStatusNeedsPersistence) && window.imApp.commitScopedFriendChange && void window.imApp.commitScopedFriendChange(friend_9, targetFriend => {
      window.imApp.migrateSingleChatProfileStatus(targetFriend);
      delete targetFriend._profileStatusNeedsPersistence;
    }, {
      syncActive: true,
      metaOnly: true,
      silent: true
    });
    const uiState_3 = window.imChat.getProfilePanelUiState(friend_9);
    uiState_3.open = true;
    uiState_3.selectedHistoryIndex = 0;
    window.imChat.renderProfilePanel(friend_9, element_173);
    element_173.style.display = "flex";
    requestAnimationFrame(() => {
      element_173.classList.add("active");
    });
  }
  function hideProfilePanel_2(value_176, element_177) {
    const profilePanelUiState_178 = window.imChat.getProfilePanelUiState(value_176);
    profilePanelUiState_178.open = false;
    if (!element_177) return;
    element_177.classList.remove("active");
    setTimeout(() => {
      !element_177.classList.contains("active") && (element_177.style.display = "none");
    }, 220);
  }
  function toggleProfilePanel_2(friend_10, panelEl_3) {
    if (!friend_10 || !panelEl_3) return;
    const profilePanelUiState_181 = window.imChat.getProfilePanelUiState(friend_10);
    profilePanelUiState_181.open && panelEl_3.classList.contains("active") ? window.imChat.hideProfilePanel(friend_10, panelEl_3) : window.imChat.showProfilePanel(friend_10, panelEl_3);
  }
  function refreshProfilePanel_2(value_182, value_183 = {}) {
    const value_184 = window.imApp.getFriendById?.(value_182) || (value_182 && typeof value_182 === "object" ? value_182 : null);
    if (!value_184 || value_184.type === "group") return false;
    const elementById = document.getElementById("chat-interface-" + value_184.id),
      chatProfilePanelOverlayElement = elementById?.querySelector(".chat-profile-panel-overlay");
    if (!chatProfilePanelOverlayElement) return false;
    if (value_183.reveal === true) return showProfilePanel_2(value_184, chatProfilePanelOverlayElement), true;
    const uiState_4 = window.imChat.getProfilePanelUiState(value_184);
    if (value_183.resetSelection === true) uiState_4.selectedHistoryIndex = 0;
    const contains_186 = chatProfilePanelOverlayElement.classList.contains("active");
    return renderProfilePanel_2(value_184, chatProfilePanelOverlayElement), !contains_186 && (chatProfilePanelOverlayElement.classList.remove("active"), chatProfilePanelOverlayElement.style.display = "none"), true;
  }
  function applyFriendStatusBarCss_2(value_187) {
    if (!value_187 || value_187.type === "group" || typeof document === "undefined") return;
    const replace_188 = encodeURIComponent(String(value_187.id || "")).replace(/%/g, "_"),
      id_2 = "friend-status-css-" + (replace_188 || "unknown");
    let elementById_190 = document.getElementById(id_2);
    const string_191 = String(value_187.statusCss || ""),
      value_192 = getStatusRenderMode_2(value_187) === "css" && value_187.statusCssEnabled && string_191.trim(),
      value_193 = "#chat-interface-" + value_187.id + " .chat-profile-panel-overlay[data-status-css-active=\"true\"]",
      textContent_2 = value_192 && window.imApp?.scopeUserCss ? window.imApp.scopeUserCss(string_191, value_193) : "";
    if (!textContent_2) return elementById_190?.remove(), false;
    !elementById_190 && (elementById_190 = document.createElement("style"), elementById_190.id = id_2, document.head.appendChild(elementById_190));
    if (elementById_190.textContent !== textContent_2) elementById_190.textContent = textContent_2;
    return true;
  }
  window.imChat.getProfilePanelData = getProfilePanelData_2;
  window.imChat.getProfilePanelUiState = getProfilePanelUiState_2;
  window.imChat.getProfileStatusHistory = getProfileStatusHistory_2;
  window.imChat.getSelectedProfileStatus = getSelectedProfileStatus_2;
  window.imChat.editProfileStatusSnapshot = editProfileStatusSnapshot_2;
  window.imChat.deleteProfileStatusSnapshot = deleteProfileStatusSnapshot_2;
  window.imChat.buildProfilePanelBody = buildProfilePanelBody_2;
  window.imChat.renderProfilePanel = renderProfilePanel_2;
  window.imChat.showProfilePanel = showProfilePanel_2;
  window.imChat.hideProfilePanel = hideProfilePanel_2;
  window.imChat.toggleProfilePanel = toggleProfilePanel_2;
  window.imChat.refreshProfilePanel = refreshProfilePanel_2;
  window.imApp.sanitizeHtmlTemplate = sanitizeHtmlTemplate_2;
  window.imApp.validateStatusTemplate = validateStatusTemplate_2;
  window.imApp.renderStatusTemplate = renderStatusTemplate_2;
  window.imApp.getStatusRenderMode = getStatusRenderMode_2;
  window.imChat.applyFriendStatusBarCss = applyFriendStatusBarCss_2;
  window.imApp.applyFriendStatusBarCss = applyFriendStatusBarCss_2;
});
