const WB_UNGROUPED = "未分组";
let worldBooks = [],
  wbGroups = [],
  activeWbGroupName = null,
  editingBookId = null,
  activeEntryId = null,
  tempEntries = [],
  draftIsGlobal = false,
  editorInitialSnapshot = "",
  editingGroupName = null,
  wbFolderEditMode = false,
  wbEditorExitPending = false;
const wbBookTokenCache = new Map();
function getWbElement(scopeValue79) {
  return document.getElementById(scopeValue79);
}
function openWbOverlay(scopeValue80) {
  const scopeValue81 = getWbElement(scopeValue80);
  if (scopeValue81 && window.openView) window.openView(scopeValue81);
}
function closeWbOverlay(scopeValue82) {
  const scopeValue83 = getWbElement(scopeValue82);
  if (scopeValue83 && window.closeView) window.closeView(scopeValue83);
}
function openWorldBookGuide() {
  window.openAppGuideModal?.({
    eyebrow: "WORLD BOOK / GUIDE",
    title: "世界书使用教程",
    intro: "世界书用来给生成内容补充设定和规则。先建世界书，再添加词条，最后决定它在哪些场景生效。",
    sections: [{
      label: "01 / TRIGGER",
      title: "触发模式与关键词",
      items: [{
        title: "永久生效",
        text: "只要这本世界书参与本次生成，词条就会加入。适合长期有效的人设、背景或规则。"
      }, {
        title: "关键词触发",
        text: "本次生成的上下文出现任意一个关键词时，词条才会加入。适合只在特定话题出现的设定。"
      }, {
        title: "关键词怎么填",
        text: "多个词可以用中文逗号、英文逗号或顿号分隔。系统按原文包含关系匹配，建议填写容易在对话中出现的明确词语。"
      }]
    }, {
      label: "02 / POSITION",
      title: "注入位置与系统深度",
      items: [{
        title: "角色前",
        text: "放在角色人设前，适合世界观、通用背景和整体规则。"
      }, {
        title: "角色后",
        text: "放在角色人设后，适合对角色表现作补充或限定。"
      }, {
        title: "系统深度",
        text: "放入系统深度规则区，适合需要优先参考的规则。普通设定通常选角色前或角色后即可。"
      }, {
        title: "深度数字",
        text: "只有选“系统深度”时才显示。同一区域的词条按数字从小到大排列；不确定时保留默认的 4。数字不代表模型能力，也不保证规则一定被遵守。"
      }]
    }, {
      label: "03 / SCOPE",
      title: "全局启用与单独挂载",
      items: [{
        title: "全局启用",
        text: "这本世界书会自动参与所有支持全局世界书的内容生成，适合到处都需要的共同设定。"
      }, {
        title: "单独挂载",
        text: "在支持挂载的角色、聊天或作品等位置手动选择，只让对应内容使用这本书。想限定使用范围时，关闭“全局启用”后再挂载。"
      }]
    }],
    note: {
      title: "破限世界书使用提醒",
      text: "破限类世界书只需要挂载一本，不要多本一起挂。想换效果时，先卸下当前一本，再挂另一本；可以轮换使用。"
    }
  });
}
function escapeHtml(scopeValue84 = "") {
  return String(scopeValue84).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function escapeAttr(scopeValue85 = "") {
  return escapeHtml(scopeValue85);
}
function normalizeGroupName(scopeValue86) {
  const scopeValue87 = String(scopeValue86 || "").trim();
  return scopeValue87 || WB_UNGROUPED;
}
function normalizeGroups() {
  const scopeValue88 = new Set();
  wbGroups = (Array.isArray(wbGroups) ? wbGroups : []).map(scopeValue89 => String(scopeValue89 || "").trim()).filter(scopeValue90 => scopeValue90 && scopeValue90 !== WB_UNGROUPED).filter(scopeValue91 => {
    if (scopeValue88.has(scopeValue91)) return false;
    return scopeValue88.add(scopeValue91), true;
  });
}
function getAllDisplayGroups() {
  normalizeGroups();
  const scopeValue92 = worldBooks.map(scopeValue93 => normalizeGroupName(scopeValue93 && scopeValue93.group)).filter(scopeValue94 => scopeValue94 !== WB_UNGROUPED && !wbGroups.includes(scopeValue94));
  return [...wbGroups, ...Array.from(new Set(scopeValue92)), WB_UNGROUPED];
}
function invalidateWorldBookRenderCache() {
  wbBookTokenCache.clear();
}
function invalidateWorldBookLocalBindings() {}
function saveWorldBooksData() {
  invalidateWorldBookRenderCache();
  window.StorageManager && (window.StorageManager.save("u2_worldBooks", worldBooks), window.StorageManager.save("u2_wbGroups", wbGroups));
}
function getBookTokenCount(scopeValue95) {
  if (!scopeValue95 || scopeValue95.id == null) return calculateTokens(scopeValue95 && scopeValue95.entries);
  const scopeValue96 = String(scopeValue95.id);
  if (wbBookTokenCache.has(scopeValue96)) return wbBookTokenCache.get(scopeValue96);
  const scopeValue97 = calculateTokens(scopeValue95.entries);
  return wbBookTokenCache.set(scopeValue96, scopeValue97), scopeValue97;
}
function calculateTokens(scopeValue98) {
  const scopeValue99 = (Array.isArray(scopeValue98) ? scopeValue98 : []).filter(newScope100 => newScope100 && newScope100.enabled !== false).map(scopeValue100 => "" + (scopeValue100 && scopeValue100.title || "") + (scopeValue100 && scopeValue100.keyword || "") + (scopeValue100 && scopeValue100.content || "")).join("");
  return Math.ceil(scopeValue99.length * 1.5) || 0;
}
window.calculateTokens = calculateTokens;
window.invalidateWorldBookLocalBindings = invalidateWorldBookLocalBindings;
window.getWorldBooks = () => Array.isArray(worldBooks) ? worldBooks : [];
window.getVisibleWorldBookMountIds = (scopeValue101 = []) => {
  const scopeValue102 = new Set(worldBooks.filter(scopeValue103 => scopeValue103 && !scopeValue103.isGlobal).map(scopeValue104 => String(scopeValue104.id)));
  return (Array.isArray(scopeValue101) ? scopeValue101 : []).map(String).filter((scopeValue105, newScope107, newScope108) => scopeValue102.has(scopeValue105) && newScope108.indexOf(scopeValue105) === newScope107);
};
function cloneWorldBookAgentValue(scopeValue106) {
  if (typeof structuredClone === "function") return structuredClone(scopeValue106);
  return JSON.parse(JSON.stringify(scopeValue106));
}
function normalizeWorldBookAgentEntries(scopeValue107) {
  return (Array.isArray(scopeValue107) ? scopeValue107 : []).slice(0, 200).map((scopeValue108, scopeValue109) => {
    const scopeValue110 = window.normalizeWorldBookEntry ? window.normalizeWorldBookEntry(scopeValue108 || {}) : scopeValue108 || {},
      scopeValue111 = scopeValue110.triggerMode === "keyword" ? "keyword" : "permanent";
    return {
      id: scopeValue110.id || "wb-entry-" + Date.now() + "-" + scopeValue109,
      title: String(scopeValue110.title || scopeValue110.name || scopeValue110.keyword || "词条 " + (scopeValue109 + 1)).trim().slice(0, 160),
      keyword: scopeValue111 === "keyword" ? String(scopeValue110.keyword || "").trim().slice(0, 500) : "",
      content: String(scopeValue110.content || "").trim().slice(0, 50000),
      triggerMode: scopeValue111,
      injectionPosition: ["before_role", "after_role", "system_depth"].includes(scopeValue110.injectionPosition) ? scopeValue110.injectionPosition : "before_role",
      systemDepth: Number.isFinite(Number(scopeValue110.systemDepth)) ? Number(scopeValue110.systemDepth) : 4,
      order: Number.isFinite(Number(scopeValue110.order)) ? Number(scopeValue110.order) : 100,
      recursive: false,
      enabled: scopeValue110.enabled !== false
    };
  }).filter(scopeValue112 => scopeValue112.content && (scopeValue112.triggerMode !== "keyword" || scopeValue112.keyword));
}
function normalizeWorldBookAgentPayload(scopeValue113 = {}) {
  const scopeValue114 = String(scopeValue113.name || "").trim().slice(0, 120),
    scopeValue115 = normalizeWorldBookAgentEntries(scopeValue113.entries);
  if (!scopeValue114) throw new Error("世界书名称为空");
  if (scopeValue115.length === 0) throw new Error("世界书至少需要一个有效词条");
  return {
    name: scopeValue114,
    group: normalizeGroupName(scopeValue113.group),
    isGlobal: scopeValue113.isGlobal === true,
    entries: scopeValue115
  };
}
function getWorldBookAgentSnapshot(scopeValue116) {
  const scopeValue117 = worldBooks.find(scopeValue118 => String(scopeValue118?.id) === String(scopeValue116));
  return scopeValue117 ? cloneWorldBookAgentValue(scopeValue117) : null;
}
function getWorldBookAgentFingerprint(scopeValue119) {
  const scopeValue120 = getWorldBookAgentSnapshot(scopeValue119);
  return scopeValue120 ? JSON.stringify(scopeValue120) : "";
}
function finishWorldBookAgentMutation() {
  saveWorldBooksData();
  renderWorldBooks({
    force: true
  });
  window.dispatchEvent(new CustomEvent("u2:worldbooks-updated", {
    detail: {
      books: window.u2WorldBookAgent.list()
    }
  }));
}
window.u2WorldBookAgent = {
  list() {
    return worldBooks.map(scopeValue121 => ({
      id: scopeValue121.id,
      name: String(scopeValue121.name || ""),
      group: normalizeGroupName(scopeValue121.group),
      isGlobal: scopeValue121.isGlobal === true,
      entryCount: Array.isArray(scopeValue121.entries) ? scopeValue121.entries.length : 0
    }));
  },
  getSnapshot: getWorldBookAgentSnapshot,
  fingerprint: getWorldBookAgentFingerprint,
  validate(scopeValue122) {
    try {
      return {
        valid: true,
        payload: normalizeWorldBookAgentPayload(scopeValue122)
      };
    } catch (scopeValue123) {
      return {
        valid: false,
        error: scopeValue123.message || "世界书作品无效"
      };
    }
  },
  async apply(scopeValue124, scopeValue125 = "") {
    const scopeValue126 = normalizeWorldBookAgentPayload(scopeValue124),
      scopeValue127 = scopeValue125 ? worldBooks.find(scopeValue130 => String(scopeValue130?.id) === String(scopeValue125)) : null;
    if (scopeValue125 && !scopeValue127) throw new Error("要修改的世界书不存在");
    const scopeValue128 = scopeValue127 ? cloneWorldBookAgentValue(scopeValue127) : null,
      scopeValue129 = scopeValue127 ? scopeValue127.id : "youtu-wb-" + Date.now();
    scopeValue127 ? Object.assign(scopeValue127, scopeValue126) : worldBooks.push({
      id: scopeValue129,
      ...scopeValue126,
      attachedRoles: []
    });
    if (scopeValue126.group !== WB_UNGROUPED && !wbGroups.includes(scopeValue126.group)) wbGroups.push(scopeValue126.group);
    return finishWorldBookAgentMutation(), {
      targetBookId: scopeValue129,
      previousSnapshot: scopeValue128,
      appliedFingerprint: getWorldBookAgentFingerprint(scopeValue129)
    };
  },
  async restore(scopeValue131, scopeValue132) {
    const scopeValue133 = worldBooks.findIndex(scopeValue134 => String(scopeValue134?.id) === String(scopeValue131));
    if (scopeValue132) {
      if (scopeValue133 < 0) throw new Error("原世界书已不存在");
      worldBooks[scopeValue133] = cloneWorldBookAgentValue(scopeValue132);
    } else {
      if (scopeValue133 < 0) return true;
      worldBooks.splice(scopeValue133, 1);
    }
    return finishWorldBookAgentMutation(), true;
  }
};
function normalizeEntryForEditor(scopeValue135 = {}, scopeValue136 = 0) {
  const scopeValue137 = window.normalizeWorldBookEntry,
    scopeValue138 = scopeValue137 ? scopeValue137(scopeValue135) : scopeValue135;
  return {
    ...scopeValue138,
    __editorId: Date.now() + "-" + scopeValue136 + "-" + Math.random().toString(36).slice(2, 8),
    title: String(scopeValue138.title || scopeValue138.name || scopeValue138.keyword || "词条 " + (scopeValue136 + 1)),
    keyword: String(scopeValue138.keyword || ""),
    content: String(scopeValue138.content || ""),
    triggerMode: scopeValue138.triggerMode === "keyword" ? "keyword" : "permanent",
    injectionPosition: ["before_role", "after_role", "system_depth"].includes(scopeValue138.injectionPosition) ? scopeValue138.injectionPosition : "before_role",
    systemDepth: Number.isFinite(Number(scopeValue138.systemDepth)) ? Number(scopeValue138.systemDepth) : 4,
    order: Number.isFinite(Number(scopeValue138.order)) ? Number(scopeValue138.order) : 100,
    recursive: false,
    enabled: scopeValue138.enabled !== false
  };
}
function createDefaultEntry(scopeValue139 = 0) {
  return normalizeEntryForEditor({
    title: "词条 " + (scopeValue139 + 1),
    content: "",
    keyword: "",
    triggerMode: "permanent",
    injectionPosition: "before_role",
    systemDepth: 4,
    order: 100,
    enabled: true
  }, scopeValue139);
}
function showCenteredConfirm({
  title: scopeValue141 = "确认操作",
  message: scopeValue142 = "确定继续吗？",
  confirmText: scopeValue143 = "确认",
  cancelText: scopeValue144 = "取消",
  isDestructive: scopeValue145 = false,
  onConfirm: scopeValue140
} = {}) {
  if (typeof window.showCustomModal === "function") {
    window.showCustomModal({
      title: scopeValue141,
      message: scopeValue142,
      confirmText: scopeValue143,
      cancelText: scopeValue144,
      isDestructive: scopeValue145,
      onConfirm: scopeValue140
    });
    return;
  }
  getWbElement("wb-inline-confirm-overlay")?.remove();
  const scopeValue146 = document.createElement("div");
  scopeValue146.id = "wb-inline-confirm-overlay";
  scopeValue146.className = "bottom-sheet-overlay wb-centered-modal-overlay active";
  scopeValue146.innerHTML = `
        <div class="wb-centered-modal-card wb-group-modal-card wb-inline-confirm-card">
            <div class="wb-centered-modal-header"><div class="wb-centered-modal-title">` + escapeHtml(scopeValue141) + `</div></div>
            <div class="wb-centered-modal-body wb-inline-confirm-body">
                <div class="wb-inline-confirm-message">` + escapeHtml(scopeValue142) + `</div>
                <div class="wb-inline-confirm-actions">
                    <button type="button" class="wb-inline-confirm-btn wb-inline-confirm-cancel">` + escapeHtml(scopeValue144) + `</button>
                    <button type="button" class="wb-inline-confirm-btn ` + (scopeValue145 ? "wb-inline-confirm-danger" : "wb-inline-confirm-confirm") + "\">" + escapeHtml(scopeValue143) + `</button>
                </div>
            </div>
        </div>`;
  const scopeValue147 = () => scopeValue146.remove();
  scopeValue146.querySelector(".wb-inline-confirm-cancel").addEventListener("click", scopeValue147);
  scopeValue146.querySelector(scopeValue145 ? ".wb-inline-confirm-danger" : ".wb-inline-confirm-confirm").addEventListener("click", () => {
    scopeValue147();
    if (typeof scopeValue140 === "function") scopeValue140();
  });
  scopeValue146.addEventListener("click", scopeValue148 => {
    if (scopeValue148.target === scopeValue146) scopeValue147();
  });
  (getWbElement("app") || document.body).appendChild(scopeValue146);
}
function showWbMainPage() {
  activeWbGroupName = null;
  getWbElement("wb-files-main-page")?.classList.add("active");
  getWbElement("wb-files-group-page")?.classList.remove("active");
  getWbElement("wb-files-editor-page")?.classList.remove("active");
  renderWorldBooks({
    force: true
  });
}
function openWbGroupPage(scopeValue149) {
  activeWbGroupName = normalizeGroupName(scopeValue149);
  getWbElement("wb-files-main-page")?.classList.remove("active");
  getWbElement("wb-files-editor-page")?.classList.remove("active");
  getWbElement("wb-files-group-page")?.classList.add("active");
  renderGroupBookList(activeWbGroupName);
}
function showEditorPage() {
  getWbElement("wb-files-main-page")?.classList.remove("active");
  getWbElement("wb-files-group-page")?.classList.remove("active");
  getWbElement("wb-files-editor-page")?.classList.add("active");
}
function isWorldBookEditableElement(scopeValue150) {
  if (!scopeValue150 || scopeValue150.disabled) return false;
  const scopeValue151 = String(scopeValue150.tagName || "").toUpperCase();
  return scopeValue151 === "INPUT" || scopeValue151 === "TEXTAREA" || scopeValue151 === "SELECT" || scopeValue150.isContentEditable || scopeValue150.getAttribute?.("contenteditable") === "true";
}
function waitForWorldBookKeyboardToClose(scopeValue152 = 460) {
  const scopeValue153 = getWbElement("wb-files-editor-page"),
    scopeValue154 = document.activeElement,
    scopeValue155 = !!window.mobileInputCompat?.isAndroid || /Android/i.test(navigator.userAgent || "");
  if (!scopeValue153 || !scopeValue155 || !scopeValue154 || !scopeValue153.contains(scopeValue154) || !isWorldBookEditableElement(scopeValue154)) return Promise.resolve();
  scopeValue154.blur();
  const scopeValue156 = window.visualViewport;
  if (!scopeValue156) return new Promise(scopeValue161 => window.setTimeout(scopeValue161, 280));
  const scopeValue157 = Date.now(),
    scopeValue158 = Math.round(scopeValue156.height || 0);
  let scopeValue159 = scopeValue158,
    scopeValue160 = 0;
  return new Promise(scopeValue162 => {
    let scopeValue163 = false;
    const scopeValue164 = () => {
        if (scopeValue163) return;
        scopeValue163 = true;
        scopeValue162();
      },
      scopeValue165 = window.setTimeout(scopeValue164, scopeValue152),
      scopeValue166 = () => {
        if (scopeValue163) return;
        const scopeValue167 = Math.round(scopeValue156.height || 0);
        scopeValue160 = Math.abs(scopeValue167 - scopeValue159) <= 1 ? scopeValue160 + 1 : 0;
        scopeValue159 = scopeValue167;
        const scopeValue168 = scopeValue167 >= scopeValue158 + 72;
        if (scopeValue168 && scopeValue160 >= 2 || Date.now() - scopeValue157 >= scopeValue152) {
          window.clearTimeout(scopeValue165);
          scopeValue164();
          return;
        }
        window.requestAnimationFrame(scopeValue166);
      };
    window.requestAnimationFrame(scopeValue166);
  });
}
function leaveWorldBookEditor(scopeValue169) {
  if (wbEditorExitPending) return;
  wbEditorExitPending = true;
  waitForWorldBookKeyboardToClose()["finally"](() => {
    wbEditorExitPending = false;
    scopeValue169();
  });
}
function getBooksInGroup(scopeValue170) {
  const scopeValue171 = normalizeGroupName(scopeValue170);
  return worldBooks.filter(scopeValue172 => normalizeGroupName(scopeValue172 && scopeValue172.group) === scopeValue171);
}
let lastRenderHash = "",
  lastRenderGroupsSnapshot = "";
function createFolderElement(scopeValue173) {
  const scopeValue174 = normalizeGroupName(scopeValue173),
    scopeValue175 = getBooksInGroup(scopeValue174).length,
    scopeValue176 = document.createElement("button");
  return scopeValue176.type = "button", scopeValue176.className = "wb-notes-row wb-folder-row" + (wbFolderEditMode ? " is-editing" : ""), scopeValue176.dataset.group = scopeValue174, scopeValue176.innerHTML = `
        <span class="wb-row-icon wb-folder-icon"><i class="far fa-folder"></i></span>
        <span class="wb-row-main"><strong>` + escapeHtml(scopeValue174) + `</strong></span>
        <span class="wb-row-count">` + scopeValue175 + `</span>
        <i class="fas fa-chevron-right wb-row-chevron"></i>
        ` + (scopeValue174 === WB_UNGROUPED ? "" : "<span class=\"wb-row-edit-actions\"><i class=\"fas fa-pen\" data-action=\"rename\"></i><i class=\"far fa-trash-alt\" data-action=\"delete\"></i></span>"), scopeValue176.addEventListener("click", scopeValue177 => {
    const scopeValue178 = scopeValue177.target.closest("[data-action]")?.dataset.action;
    if (scopeValue178 === "rename") {
      scopeValue177.stopPropagation();
      openGroupNameDialog(scopeValue174);
    } else {
      if (scopeValue178 === "delete") {
        scopeValue177.stopPropagation();
        deleteGroupByName(scopeValue174);
      } else !wbFolderEditMode && openWbGroupPage(scopeValue174);
    }
  }), scopeValue176;
}
function renderWorldBooks({
  force: scopeValue179 = false
} = {}) {
  normalizeGroups();
  const scopeValue180 = getWbElement("wb-folder-list");
  if (!scopeValue180) return;
  const scopeValue181 = getAllDisplayGroups(),
    scopeValue182 = JSON.stringify(scopeValue181.map(scopeValue184 => ({
      name: scopeValue184,
      count: getBooksInGroup(scopeValue184).length
    })));
  if (!scopeValue179 && lastRenderHash === scopeValue182) {
    if (activeWbGroupName) renderGroupBookList(activeWbGroupName);
    return;
  }
  lastRenderHash = scopeValue182;
  const scopeValue183 = document.createDocumentFragment();
  scopeValue181.forEach(scopeValue185 => scopeValue183.appendChild(createFolderElement(scopeValue185)));
  scopeValue180.replaceChildren(scopeValue183);
  if (activeWbGroupName) renderGroupBookList(activeWbGroupName);
}
function createBookListItemElement(scopeValue186) {
  const scopeValue187 = document.createElement("button"),
    scopeValue188 = Array.isArray(scopeValue186.entries) ? scopeValue186.entries.length : 0,
    scopeValue189 = getBookTokenCount(scopeValue186);
  return scopeValue187.type = "button", scopeValue187.className = "wb-notes-row wb-book-row", scopeValue187.dataset.id = String(scopeValue186.id), scopeValue187.innerHTML = `
        <span class="wb-row-icon wb-book-icon"><i class="far fa-note-sticky"></i></span>
        <span class="wb-row-main"><strong>` + escapeHtml(scopeValue186.name || "未命名世界书") + "</strong><small>" + scopeValue188 + " 个词条 · " + scopeValue189 + " Tokens" + (scopeValue186.isGlobal ? " · 全局启用" : "") + `</small></span>
        <i class="fas fa-chevron-right wb-row-chevron"></i>`, scopeValue187.addEventListener("click", () => openBookModal(scopeValue186)), scopeValue187;
}
function renderGroupBookList(scopeValue190) {
  const scopeValue191 = normalizeGroupName(scopeValue190),
    scopeValue192 = getBooksInGroup(scopeValue191),
    scopeValue193 = getWbElement("wb-group-large-title"),
    scopeValue194 = getWbElement("wb-group-count-line"),
    scopeValue195 = getWbElement("wb-group-book-list");
  if (scopeValue193) scopeValue193.textContent = scopeValue191;
  if (scopeValue194) scopeValue194.textContent = scopeValue192.length + " 本世界书";
  if (!scopeValue195) return;
  const scopeValue196 = JSON.stringify(scopeValue192.map(scopeValue198 => ({
    id: scopeValue198.id,
    name: scopeValue198.name,
    isGlobal: scopeValue198.isGlobal,
    entries: scopeValue198.entries?.length
  })));
  if (lastRenderGroupsSnapshot === scopeValue196 && scopeValue191 === activeWbGroupName) return;
  lastRenderGroupsSnapshot = scopeValue196;
  if (!scopeValue192.length) {
    scopeValue195.innerHTML = "<div class=\"wb-files-empty-state\"><i class=\"far fa-folder-open\"></i><span>这个文件夹还没有世界书</span></div>";
    return;
  }
  const scopeValue197 = document.createDocumentFragment();
  scopeValue192.forEach(scopeValue199 => scopeValue197.appendChild(createBookListItemElement(scopeValue199)));
  scopeValue195.replaceChildren(scopeValue197);
}
function renderWorldBookTab() {
  renderWorldBooks({
    force: true
  });
}
function renderWorldBookGlobalTab() {
  const scopeValue200 = getWbElement("wb-global-list");
  if (!scopeValue200) return;
  const scopeValue201 = worldBooks.filter(scopeValue202 => scopeValue202.isGlobal);
  scopeValue200.textContent = scopeValue201.length + " 本全局世界书";
}
function renderWorldBookLocalTab() {}
function normalizeBookForSave() {
  return tempEntries.map((scopeValue203, scopeValue204) => {
    const scopeValue205 = normalizeEntryForEditor(scopeValue203, scopeValue204),
      {
        __editorId: scopeValue206,
        ...scopeValue207
      } = scopeValue205;
    return {
      ...scopeValue207,
      title: String(scopeValue203.title || "").trim() || "词条 " + (scopeValue204 + 1),
      keyword: scopeValue203.triggerMode === "keyword" ? String(scopeValue203.keyword || "").trim() : "",
      content: String(scopeValue203.content || "").trim(),
      triggerMode: scopeValue203.triggerMode === "keyword" ? "keyword" : "permanent",
      injectionPosition: ["before_role", "after_role", "system_depth"].includes(scopeValue203.injectionPosition) ? scopeValue203.injectionPosition : "before_role",
      systemDepth: Number.isFinite(Number(scopeValue203.systemDepth)) ? Number(scopeValue203.systemDepth) : 4,
      order: 100,
      recursive: false,
      enabled: scopeValue203.enabled !== false
    };
  });
}
function renderAddBookGroupSelect() {
  const scopeValue208 = getWbElement("add-book-group-input");
  if (!scopeValue208) return;
  const scopeValue209 = normalizeGroupName(scopeValue208.value);
  scopeValue208.innerHTML = getAllDisplayGroups().map(scopeValue210 => "<option value=\"" + escapeAttr(scopeValue210) + "\">" + escapeHtml(scopeValue210) + "</option>").join("");
  scopeValue208.value = getAllDisplayGroups().includes(scopeValue209) ? scopeValue209 : WB_UNGROUPED;
}
function getEditorSnapshot() {
  return JSON.stringify({
    name: getWbElement("add-book-name-input")?.value || "",
    group: normalizeGroupName(getWbElement("add-book-group-input")?.value),
    isGlobal: !!draftIsGlobal,
    entries: tempEntries.map(({
      __editorId: scopeValue211,
      ...scopeValue212
    }) => scopeValue212)
  });
}
function isEditorDirty() {
  return getEditorSnapshot() !== editorInitialSnapshot;
}
function openBookModal(scopeValue213 = null, scopeValue214 = null, scopeValue215 = null) {
  editingBookId = scopeValue213 ? scopeValue213.id : null;
  const scopeValue216 = getWbElement("add-book-name-input"),
    scopeValue217 = getWbElement("add-book-group-input"),
    scopeValue218 = getWbElement("wb-editor-global-toggle"),
    scopeValue219 = getWbElement("delete-world-book-btn");
  renderAddBookGroupSelect();
  if (scopeValue213) {
    if (scopeValue216) scopeValue216.value = scopeValue213.name || "";
    if (scopeValue217) scopeValue217.value = normalizeGroupName(scopeValue213.group);
    tempEntries = (Array.isArray(scopeValue213.entries) ? scopeValue213.entries : []).map(normalizeEntryForEditor);
    draftIsGlobal = !!scopeValue213.isGlobal;
    if (scopeValue219) scopeValue219.hidden = false;
  } else {
    if (scopeValue216) scopeValue216.value = "";
    if (scopeValue217) scopeValue217.value = normalizeGroupName(scopeValue214 || activeWbGroupName || WB_UNGROUPED);
    tempEntries = [createDefaultEntry(0)];
    draftIsGlobal = false;
    if (scopeValue219) scopeValue219.hidden = true;
  }
  if (scopeValue218) scopeValue218.checked = draftIsGlobal;
  activeEntryId = scopeValue215 || tempEntries[0]?.__editorId || null;
  getWbElement("wb-editor-back-label").textContent = activeWbGroupName || "世界书";
  renderEntries();
  editorInitialSnapshot = getEditorSnapshot();
  showEditorPage();
  window.setTimeout(() => scopeValue216?.focus(), 0);
}
function addEntry() {
  const scopeValue220 = createDefaultEntry(tempEntries.length);
  tempEntries.push(scopeValue220);
  activeEntryId = scopeValue220.__editorId;
  renderEntries();
}
function deleteEntry(scopeValue221) {
  showCenteredConfirm({
    title: "删除词条",
    message: "确定要删除这个词条吗？",
    confirmText: "删除",
    isDestructive: true,
    onConfirm: () => {
      tempEntries = tempEntries.filter(scopeValue222 => scopeValue222.__editorId !== scopeValue221);
      if (!tempEntries.length) tempEntries = [createDefaultEntry(0)];
      activeEntryId = tempEntries[0].__editorId;
      renderEntries();
    }
  });
}
function renderEntries() {
  const scopeValue223 = getWbElement("wb-entries-list-container");
  if (!scopeValue223) return;
  const scopeValue224 = document.createDocumentFragment();
  tempEntries.forEach((scopeValue225, scopeValue226) => {
    const scopeValue227 = scopeValue225.__editorId === activeEntryId,
      scopeValue228 = document.createElement("article");
    scopeValue228.className = "wb-entry-note" + (scopeValue227 ? " expanded" : "") + (scopeValue225.enabled === false ? " is-disabled" : ""), scopeValue228.dataset.entryId = scopeValue225.__editorId;
    const scopeValue229 = scopeValue225.triggerMode === "keyword",
      scopeValue230 = scopeValue225.injectionPosition === "system_depth";
    scopeValue228.innerHTML = "\n            <header class=\"wb-entry-note-head\">\n                <button type=\"button\" class=\"wb-entry-expand-btn\" aria-expanded=\"" + scopeValue227 + "\">\n                    <span><strong>" + escapeHtml(scopeValue225.title || "词条 " + (scopeValue226 + 1)) + "</strong><small><span class=\"wb-entry-disabled-label\" " + (scopeValue225.enabled === false ? "" : "hidden") + ">已停用 · </span>" + (scopeValue229 ? "关键词触发" : "永久生效") + " · " + (scopeValue225.injectionPosition === "after_role" ? "角色后" : scopeValue230 ? "系统深度" : "角色前") + "</small></span><i class=\"fas fa-chevron-right\"></i>\n                </button>\n                <label class=\"wb-entry-enable-control\"><input type=\"checkbox\" role=\"switch\" class=\"wb-entry-enabled-input\" aria-label=\"启用词条 " + escapeAttr(scopeValue225.title || "词条 " + (scopeValue226 + 1)) + "\" " + (scopeValue225.enabled !== false ? "checked" : "") + "><span aria-hidden=\"true\"></span></label>\n                <button type=\"button\" class=\"wb-entry-delete-btn\" aria-label=\"删除词条\"><i class=\"far fa-trash-alt\"></i></button>\n            </header>\n            <div class=\"wb-entry-note-body\" " + (scopeValue227 ? "" : "hidden") + ">\n                <input type=\"text\" class=\"wb-entry-title-input\" placeholder=\"词条标题\" value=\"" + escapeAttr(scopeValue225.title) + "\" aria-label=\"词条标题\">\n                <textarea class=\"wb-entry-body-textarea\" placeholder=\"输入词条内容…\" aria-label=\"词条内容\">" + escapeHtml(scopeValue225.content) + "</textarea>\n                <details class=\"wb-entry-settings\" " + (scopeValue229 || scopeValue230 ? "open" : "") + ">\n                    <summary>词条设置 <i class=\"fas fa-chevron-right\"></i></summary>\n                    <div class=\"wb-entry-settings-content\">\n                        <label class=\"wb-entry-field\"><span>触发模式</span><select class=\"wb-entry-trigger-mode\"><option value=\"permanent\" " + (scopeValue225.triggerMode === "permanent" ? "selected" : "") + ">永久生效</option><option value=\"keyword\" " + (scopeValue229 ? "selected" : "") + ">关键词触发</option></select></label>\n                        <label class=\"wb-entry-field wb-entry-keyword-field\" " + (scopeValue229 ? "" : "hidden") + "><span>关键词（多个用逗号分隔）</span><input type=\"text\" class=\"wb-entry-keyword-input\" placeholder=\"输入关键词\" value=\"" + escapeAttr(scopeValue225.keyword) + "\"></label>\n                        <label class=\"wb-entry-field\"><span>注入位置</span><select class=\"wb-entry-injection-position\"><option value=\"before_role\" " + (scopeValue225.injectionPosition === "before_role" ? "selected" : "") + ">角色前</option><option value=\"after_role\" " + (scopeValue225.injectionPosition === "after_role" ? "selected" : "") + ">角色后</option><option value=\"system_depth\" " + (scopeValue230 ? "selected" : "") + ">系统深度</option></select></label>\n                        <label class=\"wb-entry-field wb-entry-depth-field\" " + (scopeValue230 ? "" : "hidden") + "><span>系统深度</span><input type=\"number\" min=\"0\" class=\"wb-entry-system-depth-input\" value=\"" + scopeValue225.systemDepth + "\"></label>\n                    </div>\n                </details>\n            </div>";
    const scopeValue231 = scopeValue228.querySelector(".wb-entry-expand-btn");
    scopeValue231.addEventListener("click", () => {
      activeEntryId = activeEntryId === scopeValue225.__editorId ? null : scopeValue225.__editorId, renderEntries();
    }), scopeValue228.querySelector(".wb-entry-delete-btn").addEventListener("click", () => deleteEntry(scopeValue225.__editorId)), scopeValue228.querySelector(".wb-entry-enabled-input").addEventListener("change", newScope236 => {
      scopeValue225.enabled = newScope236.target.checked, scopeValue228.classList.toggle("is-disabled", !scopeValue225.enabled), scopeValue228.querySelector(".wb-entry-disabled-label").hidden = scopeValue225.enabled;
    }), scopeValue228.querySelector(".wb-entry-title-input").addEventListener("input", scopeValue233 => {
      scopeValue225.title = scopeValue233.target.value;
    });
    const scopeValue232 = scopeValue228.querySelector(".wb-entry-body-textarea");
    scopeValue232.addEventListener("input", scopeValue234 => {
      scopeValue225.content = scopeValue234.target.value;
    });
    scopeValue228.querySelector(".wb-entry-keyword-input").addEventListener("input", scopeValue235 => {
      scopeValue225.keyword = scopeValue235.target.value;
    });
    scopeValue228.querySelector(".wb-entry-trigger-mode").addEventListener("change", scopeValue236 => {
      scopeValue225.triggerMode = scopeValue236.target.value === "keyword" ? "keyword" : "permanent";
      renderEntries();
    });
    scopeValue228.querySelector(".wb-entry-injection-position").addEventListener("change", scopeValue237 => {
      scopeValue225.injectionPosition = scopeValue237.target.value;
      renderEntries();
    });
    scopeValue228.querySelector(".wb-entry-system-depth-input").addEventListener("input", scopeValue238 => {
      const scopeValue239 = Number.parseInt(scopeValue238.target.value, 10);
      scopeValue225.systemDepth = Number.isFinite(scopeValue239) ? scopeValue239 : 4;
    });
    scopeValue224.appendChild(scopeValue228);
  });
  scopeValue223.replaceChildren(scopeValue224);
}
function finishEditor() {
  if (wbEditorExitPending) return;
  const scopeValue240 = String(getWbElement("add-book-name-input")?.value || "").trim(),
    scopeValue241 = normalizeGroupName(getWbElement("add-book-group-input")?.value);
  if (!scopeValue240) {
    window.showToast?.("请输入世界书名称");
    getWbElement("add-book-name-input")?.focus();
    return;
  }
  const scopeValue242 = normalizeBookForSave();
  for (let scopeValue243 = 0; scopeValue243 < scopeValue242.length; scopeValue243 += 1) {
    if (!scopeValue242[scopeValue243].content) {
      activeEntryId = tempEntries[scopeValue243].__editorId;
      renderEntries();
      window.showToast?.("请填写“" + scopeValue242[scopeValue243].title + "”的内容");
      return;
    }
    if (scopeValue242[scopeValue243].triggerMode === "keyword" && !scopeValue242[scopeValue243].keyword) {
      activeEntryId = tempEntries[scopeValue243].__editorId;
      renderEntries();
      window.showToast?.("请填写“" + scopeValue242[scopeValue243].title + "”的关键词");
      return;
    }
  }
  if (editingBookId != null) {
    const scopeValue244 = worldBooks.find(scopeValue245 => String(scopeValue245.id) === String(editingBookId));
    if (scopeValue244) Object.assign(scopeValue244, {
      name: scopeValue240,
      group: scopeValue241,
      entries: scopeValue242,
      isGlobal: draftIsGlobal
    });
  } else {
    editingBookId = Date.now();
    worldBooks.push({
      id: editingBookId,
      name: scopeValue240,
      group: scopeValue241,
      entries: scopeValue242,
      isGlobal: draftIsGlobal,
      attachedRoles: []
    });
  }
  if (scopeValue241 !== WB_UNGROUPED && !wbGroups.includes(scopeValue241)) wbGroups.push(scopeValue241);
  saveWorldBooksData();
  editorInitialSnapshot = getEditorSnapshot();
  renderWorldBooks({
    force: true
  });
  leaveWorldBookEditor(() => {
    if (activeWbGroupName) {
      if (normalizeGroupName(activeWbGroupName) === scopeValue241) openWbGroupPage(scopeValue241);else showWbMainPage();
    } else showWbMainPage();
    window.showToast?.("世界书已保存");
  });
}
function requestCloseEditor() {
  if (wbEditorExitPending) return;
  if (!isEditorDirty()) {
    leaveWorldBookEditor(() => activeWbGroupName ? openWbGroupPage(activeWbGroupName) : showWbMainPage());
    return;
  }
  showCenteredConfirm({
    title: "放弃未保存的更改？",
    message: "返回后，本次编辑不会保存。",
    confirmText: "放弃更改",
    isDestructive: true,
    onConfirm: () => leaveWorldBookEditor(() => activeWbGroupName ? openWbGroupPage(activeWbGroupName) : showWbMainPage())
  });
}
function deleteCurrentBook() {
  if (editingBookId == null || wbEditorExitPending) return;
  showCenteredConfirm({
    title: "删除世界书",
    message: "确定要删除这本世界书吗？此操作不可恢复。",
    confirmText: "删除",
    isDestructive: true,
    onConfirm: () => {
      worldBooks = worldBooks.filter(scopeValue246 => String(scopeValue246.id) !== String(editingBookId));
      saveWorldBooksData();
      leaveWorldBookEditor(() => activeWbGroupName ? openWbGroupPage(activeWbGroupName) : showWbMainPage());
      window.showToast?.("世界书已删除");
    }
  });
}
function openGroupNameDialog(scopeValue247 = null) {
  editingGroupName = scopeValue247;
  getWbElement("wb-group-name-modal-title").textContent = scopeValue247 ? "重命名文件夹" : "新建文件夹";
  const scopeValue248 = getWbElement("wb-group-name-input");
  scopeValue248.value = scopeValue247 || "";
  openWbOverlay("wb-group-name-overlay");
  window.setTimeout(() => scopeValue248.focus(), 0);
}
function saveGroupName() {
  const scopeValue249 = getWbElement("wb-group-name-input"),
    scopeValue250 = String(scopeValue249?.value || "").trim();
  normalizeGroups();
  if (!scopeValue250) return window.showToast?.("请输入文件夹名称");
  if (scopeValue250 === WB_UNGROUPED) return window.showToast?.("“未分组”是系统文件夹");
  if (wbGroups.includes(scopeValue250) && scopeValue250 !== editingGroupName) return window.showToast?.("该文件夹已存在");
  if (editingGroupName) {
    wbGroups = wbGroups.map(scopeValue251 => scopeValue251 === editingGroupName ? scopeValue250 : scopeValue251);
    worldBooks.forEach(scopeValue252 => {
      if (normalizeGroupName(scopeValue252.group) === editingGroupName) scopeValue252.group = scopeValue250;
    });
    if (activeWbGroupName === editingGroupName) activeWbGroupName = scopeValue250;
  } else wbGroups.push(scopeValue250);
  normalizeGroups();
  saveWorldBooksData();
  closeWbOverlay("wb-group-name-overlay");
  renderWorldBooks({
    force: true
  });
  if (activeWbGroupName) renderGroupBookList(activeWbGroupName);
  window.showToast?.(editingGroupName ? "文件夹已重命名" : "文件夹已创建");
}
function deleteGroupByName(scopeValue253) {
  const scopeValue254 = normalizeGroupName(scopeValue253);
  if (scopeValue254 === WB_UNGROUPED) return;
  showCenteredConfirm({
    title: "删除文件夹",
    message: "“" + scopeValue254 + "”内的世界书会移到“未分组”。",
    confirmText: "删除",
    isDestructive: true,
    onConfirm: () => {
      wbGroups = wbGroups.filter(scopeValue255 => scopeValue255 !== scopeValue254);
      worldBooks.forEach(scopeValue256 => {
        if (normalizeGroupName(scopeValue256.group) === scopeValue254) scopeValue256.group = WB_UNGROUPED;
      });
      saveWorldBooksData();
      if (activeWbGroupName === scopeValue254) showWbMainPage();else renderWorldBooks({
        force: true
      });
      window.showToast?.("文件夹已删除");
    }
  });
}
function toggleGroupMoreMenu() {
  const scopeValue257 = getWbElement("wb-group-more-menu");
  if (!scopeValue257 || !activeWbGroupName) return;
  if (!scopeValue257.hidden) {
    scopeValue257.hidden = true;
    return;
  }
  const scopeValue258 = activeWbGroupName !== WB_UNGROUPED;
  scopeValue257.innerHTML = `
        <button type="button" data-menu-action="import"><i class="fas fa-file-import"></i>导入世界书</button>
        ` + (scopeValue258 ? "<button type=\"button\" data-menu-action=\"rename\"><i class=\"fas fa-pen\"></i>重命名文件夹</button><button type=\"button\" class=\"is-danger\" data-menu-action=\"delete\"><i class=\"far fa-trash-alt\"></i>删除文件夹</button>" : "");
  scopeValue257.hidden = false;
  scopeValue257.querySelectorAll("[data-menu-action]").forEach(scopeValue259 => scopeValue259.addEventListener("click", () => {
    const scopeValue260 = scopeValue259.dataset.menuAction;
    scopeValue257.hidden = true;
    if (scopeValue260 === "import") triggerWorldBookImport();
    if (scopeValue260 === "rename") openGroupNameDialog(activeWbGroupName);
    if (scopeValue260 === "delete") deleteGroupByName(activeWbGroupName);
  }));
}
function getFileBaseName(scopeValue261 = "") {
  return String(scopeValue261 || "导入的世界书").replace(/\.[^/.]+$/, "") || "导入的世界书";
}
function isSupportedWorldBookImportFile(scopeValue262) {
  const scopeValue263 = String(scopeValue262?.name || "").toLowerCase();
  return scopeValue263.endsWith(".txt") || scopeValue263.endsWith(".docx");
}
async function readWorldBookImportText(scopeValue264) {
  if (String(scopeValue264?.name || "").toLowerCase().endsWith(".docx")) {
    try {
      await window.u2LoadVendorLibrary?.("mammoth");
    } catch (scopeValue266) {
      console.warn("[worldbook] Could not load DOCX parser.", scopeValue266);
    }
    if (!window.mammoth?.extractRawText) throw new Error("DOCX 解析器加载失败，请先另存为 TXT 后导入");
    const scopeValue265 = await window.mammoth.extractRawText({
      arrayBuffer: await scopeValue264.arrayBuffer()
    });
    if (!String(scopeValue265?.value || "").trim()) throw new Error("DOCX 文件内容为空");
    return scopeValue265.value;
  }
  return scopeValue264.text();
}
function sanitizeImportedWorldBook(scopeValue267, scopeValue268 = "导入的世界书") {
  const scopeValue269 = scopeValue267 && typeof scopeValue267 === "object" ? scopeValue267 : {},
    scopeValue270 = (Array.isArray(scopeValue269.entries) ? scopeValue269.entries : [{
      title: scopeValue269.name || scopeValue268,
      content: scopeValue269.content || ""
    }]).map((scopeValue271, scopeValue272) => normalizeEntryForEditor(scopeValue271, scopeValue272)).filter(scopeValue273 => String(scopeValue273.content || "").trim()).map(({
      __editorId: scopeValue274,
      ...scopeValue275
    }) => scopeValue275);
  return {
    id: Date.now() + Math.floor(Math.random() * 10000),
    name: String(scopeValue269.name || scopeValue268).trim() || scopeValue268,
    group: normalizeGroupName(scopeValue269.group || activeWbGroupName || WB_UNGROUPED),
    entries: scopeValue270.length ? scopeValue270 : [{
      title: "正文",
      content: "空白内容",
      keyword: "",
      triggerMode: "permanent",
      injectionPosition: "before_role",
      systemDepth: 4,
      order: 100,
      recursive: false,
      enabled: true
    }],
    isGlobal: !!scopeValue269.isGlobal,
    attachedRoles: Array.isArray(scopeValue269.attachedRoles) ? scopeValue269.attachedRoles : []
  };
}
function parseImportedWorldBooks(scopeValue276, scopeValue277, scopeValue278 = activeWbGroupName || WB_UNGROUPED) {
  const scopeValue279 = getFileBaseName(scopeValue277?.name || ""),
    scopeValue280 = String(scopeValue276 || "").trim();
  if (!scopeValue280) throw new Error("文件内容为空");
  return [sanitizeImportedWorldBook({
    name: scopeValue279,
    group: scopeValue278,
    entries: [{
      title: scopeValue279,
      content: scopeValue280
    }]
  }, scopeValue279)];
}
async function importWorldBookFiles(scopeValue281) {
  const scopeValue282 = Array.from(scopeValue281 || []);
  if (!scopeValue282.length) return;
  const scopeValue283 = activeWbGroupName || WB_UNGROUPED;
  const scopeValue284 = [],
    scopeValue285 = new Set(worldBooks.map(scopeValue288 => String(scopeValue288.id)));
  let scopeValue286 = 0,
    scopeValue287 = Date.now();
  for (const scopeValue289 of scopeValue282) {
    try {
      if (!isSupportedWorldBookImportFile(scopeValue289)) throw new Error("仅支持 TXT 和 DOCX 文件");
      const scopeValue290 = await readWorldBookImportText(scopeValue289),
        newScope295 = parseImportedWorldBooks(scopeValue290, scopeValue289, scopeValue283);
      for (const scopeValue291 of newScope295) {
        while (scopeValue285.has(String(scopeValue287))) scopeValue287++;
        scopeValue291.id = scopeValue287++;
        scopeValue285.add(String(scopeValue291.id));
        scopeValue284.push(scopeValue291);
      }
    } catch (scopeValue292) {
      scopeValue286++;
      console.warn("[worldbook] Failed to import file:", scopeValue289?.name, scopeValue292);
    }
  }
  if (scopeValue284.length) {
    worldBooks.push(...scopeValue284);
    if (scopeValue283 !== WB_UNGROUPED && !wbGroups.includes(scopeValue283)) wbGroups.push(scopeValue283);
    saveWorldBooksData();
    renderWorldBooks({
      force: true
    });
    if (activeWbGroupName) renderGroupBookList(activeWbGroupName);
  }
  window.showToast?.(scopeValue286 ? `导入完成：成功 ${scopeValue284.length} 本，失败 ${scopeValue286} 个文件` : `已导入 ${scopeValue284.length} 本世界书`);
}
function triggerWorldBookImport() {
  getWbElement("wb-import-file")?.click();
}
function makeSearchSnippet(scopeValue293, scopeValue294) {
  const scopeValue295 = String(scopeValue293 || "").replace(/\s+/g, " ").trim(),
    scopeValue296 = scopeValue295.toLowerCase().indexOf(scopeValue294.toLowerCase());
  if (scopeValue296 < 0) return scopeValue295.slice(0, 76);
  return "" + (scopeValue296 > 18 ? "…" : "") + scopeValue295.slice(Math.max(0, scopeValue296 - 18), scopeValue296 + scopeValue294.length + 52) + (scopeValue296 + scopeValue294.length + 52 < scopeValue295.length ? "…" : "");
}
function renderSearchResults(scopeValue297) {
  const scopeValue298 = getWbElement("wb-search-results");
  if (!scopeValue298) return;
  const scopeValue299 = String(scopeValue297 || "").trim().toLowerCase();
  if (!scopeValue299) {
    scopeValue298.hidden = true;
    scopeValue298.replaceChildren();
    return;
  }
  const scopeValue300 = 30,
    scopeValue301 = [];
  let scopeValue302 = 0;
  for (const scopeValue304 of worldBooks) {
    if (scopeValue302 >= scopeValue300) break;
    const scopeValue305 = String(scopeValue304.name || "");
    if (scopeValue305.toLowerCase().includes(scopeValue299)) {
      scopeValue301.push({
        book: scopeValue304,
        entry: null,
        snippet: makeSearchSnippet(scopeValue305, scopeValue299)
      });
      scopeValue302++;
      if (scopeValue302 >= scopeValue300) break;
    }
    const scopeValue306 = Array.isArray(scopeValue304.entries) ? scopeValue304.entries : [];
    for (let scopeValue307 = 0; scopeValue307 < scopeValue306.length; scopeValue307++) {
      if (scopeValue302 >= scopeValue300) break;
      const scopeValue308 = scopeValue306[scopeValue307],
        scopeValue309 = [scopeValue308.title, scopeValue308.keyword, scopeValue308.content].join(`
`);
      scopeValue309.toLowerCase().includes(scopeValue299) && (scopeValue301.push({
        book: scopeValue304,
        entryIndex: scopeValue307,
        snippet: makeSearchSnippet(scopeValue309, scopeValue299)
      }), scopeValue302++);
    }
  }
  scopeValue298.hidden = false;
  if (!scopeValue301.length) {
    scopeValue298.innerHTML = "<div class=\"wb-search-empty\">没有找到匹配的世界书或词条</div>";
    return;
  }
  const scopeValue303 = document.createDocumentFragment();
  scopeValue301.forEach((scopeValue310, scopeValue311) => {
    const scopeValue312 = document.createElement("button");
    scopeValue312.type = "button";
    scopeValue312.className = "wb-search-result";
    scopeValue312.dataset.resultIndex = String(scopeValue311);
    scopeValue312.innerHTML = `
            <span class="wb-row-icon wb-book-icon"><i class="far fa-note-sticky"></i></span>
            <span><strong>` + escapeHtml(scopeValue310.entryIndex == null ? scopeValue310.book.name || "未命名世界书" : scopeValue310.book.entries[scopeValue310.entryIndex].title || "未命名词条") + "</strong><small>" + escapeHtml(normalizeGroupName(scopeValue310.book.group)) + " · " + escapeHtml(scopeValue310.snippet) + `</small></span><i class="fas fa-chevron-right"></i>
        `;
    scopeValue312.addEventListener("click", () => {
      getWbElement("wb-search-input").value = "";
      renderSearchResults("");
      const scopeValue313 = Array.isArray(scopeValue310.book.entries) ? scopeValue310.book.entries : [],
        scopeValue314 = Number.isInteger(scopeValue310.entryIndex) ? scopeValue313[scopeValue310.entryIndex] : null;
      openBookModal(scopeValue310.book, null, scopeValue314 ? undefined : null);
      if (scopeValue314) {
        const scopeValue315 = tempEntries[scopeValue310.entryIndex];
        activeEntryId = scopeValue315?.__editorId || activeEntryId;
        renderEntries();
      }
    });
    scopeValue303.appendChild(scopeValue312);
  });
  scopeValue298.replaceChildren(scopeValue303);
}
window.renderWorldBooks = renderWorldBooks;
window.renderWorldBookTab = renderWorldBookTab;
window.renderWorldBookGlobalTab = renderWorldBookGlobalTab;
window.renderWorldBookLocalTab = renderWorldBookLocalTab;
window.renderWorldBookSelector = function scopeValue318(scopeValue316 = [], scopeValue317) {
  let scopeValue319 = [],
    scopeValue320 = getWbElement("wb-selector-sheet");
  !scopeValue320 && (scopeValue320 = document.createElement("div"), scopeValue320.id = "wb-selector-sheet", scopeValue320.className = "bottom-sheet-overlay detail-sheet-overlay", scopeValue320.style.zIndex = "1150", scopeValue320.innerHTML = `
            <div class="bottom-sheet wb-selector-panel">
                <div class="sheet-handle"></div><div class="sheet-title">选择世界书</div>
                <div class="wb-selector-body"><div class="wb-selector-field"><label for="wb-selector-group-select">选择分组</label><select id="wb-selector-group-select" class="wb-native-select"></select></div><div class="wb-selector-field"><label for="wb-selector-book-select">选择世界书</label><select id="wb-selector-book-select" class="wb-native-select"></select><div id="wb-selector-empty" class="wb-selector-empty"></div></div><div class="wb-selector-preview-head"><span>已挂载</span><span id="wb-selector-mounted-count">0 项</span></div><div id="wb-selector-mounted-list" class="wb-selector-mounted-list"></div></div>
                <div class="wb-selector-actions"><button type="button" class="sheet-action wb-selector-action-btn" id="wb-selector-cancel-btn">取消</button><button type="button" class="sheet-action confirm-action wb-selector-action-btn" id="wb-selector-confirm-btn">保存</button></div>
            </div>`, (getWbElement("app") || document.body).appendChild(scopeValue320), scopeValue320.addEventListener("click", scopeValue330 => {
    if (scopeValue330.target === scopeValue320) window.closeView?.(scopeValue320);
  }));
  const scopeValue321 = scopeValue320.querySelector("#wb-selector-group-select"),
    scopeValue322 = scopeValue320.querySelector("#wb-selector-book-select"),
    scopeValue323 = scopeValue320.querySelector("#wb-selector-empty"),
    scopeValue324 = scopeValue320.querySelector("#wb-selector-mounted-list"),
    scopeValue325 = scopeValue320.querySelector("#wb-selector-mounted-count"),
    scopeValue326 = scopeValue331 => worldBooks.find(scopeValue332 => String(scopeValue332.id) === String(scopeValue331)),
    scopeValue327 = () => {
      const scopeValue333 = normalizeGroupName(scopeValue321.value),
        scopeValue334 = getAllDisplayGroups();
      scopeValue321.innerHTML = scopeValue334.map(scopeValue335 => "<option value=\"" + escapeAttr(scopeValue335) + "\">" + escapeHtml(scopeValue335) + "</option>").join("");
      scopeValue321.value = scopeValue334.includes(scopeValue333) ? scopeValue333 : scopeValue334[0];
    },
    scopeValue328 = () => {
      const scopeValue336 = new Set(scopeValue319.map(String)),
        scopeValue337 = getBooksInGroup(scopeValue321.value),
        newScope343 = scopeValue337.filter(scopeValue339 => !scopeValue339.isGlobal && !scopeValue336.has(String(scopeValue339.id)));
      scopeValue322.disabled = newScope343.length === 0, scopeValue322.innerHTML = newScope343.length ? "<option value=\"\">选择要挂载的世界书</option>" + newScope343.map(scopeValue340 => "<option value=\"" + escapeAttr(scopeValue340.id) + "\">" + escapeHtml(scopeValue340.name || "未命名世界书") + " · +" + getBookTokenCount(scopeValue340) + " Tokens</option>").join("") : "<option value=\"\">暂无可挂载世界书</option>", scopeValue323.textContent = newScope343.length ? "" : scopeValue337.length > 0 && scopeValue337.every(scopeValue341 => scopeValue341.isGlobal) ? "此文件夹的世界书均已全局启用" : "此文件夹没有可挂载的世界书";
    },
    scopeValue329 = () => {
      const scopeValue342 = window.getVisibleWorldBookMountIds(scopeValue319);
      scopeValue325.textContent = scopeValue342.length + " 项";
      scopeValue324.innerHTML = scopeValue342.length ? scopeValue342.map(scopeValue343 => {
        const scopeValue344 = scopeValue326(scopeValue343);
        if (!scopeValue344) return "";
        return "<div class=\"wb-selector-mounted-card\"><div class=\"wb-selector-mounted-icon\"><i class=\"fas fa-book\"></i></div><div class=\"wb-selector-mounted-info\"><div class=\"wb-selector-mounted-name\">" + escapeHtml(scopeValue344.name || "未命名世界书") + "</div><div class=\"wb-selector-mounted-meta\">" + escapeHtml(normalizeGroupName(scopeValue344.group)) + " · +" + getBookTokenCount(scopeValue344) + " Tokens</div></div><button type=\"button\" class=\"wb-selector-remove-btn\" data-id=\"" + escapeAttr(scopeValue343) + "\" aria-label=\"移除\"><i class=\"fas fa-times\"></i></button></div>";
      }).join("") : "<div class=\"wb-selector-mounted-empty\">还没有挂载世界书</div>";
      scopeValue324.querySelectorAll(".wb-selector-remove-btn").forEach(scopeValue345 => scopeValue345.addEventListener("click", () => {
        scopeValue319 = scopeValue319.filter(scopeValue346 => String(scopeValue346) !== String(scopeValue345.dataset.id));
        scopeValue329();
        scopeValue328();
      }));
    };
  scopeValue319 = (Array.isArray(scopeValue316) ? scopeValue316 : []).map(String).filter((scopeValue347, scopeValue348, scopeValue349) => scopeValue349.indexOf(scopeValue347) === scopeValue348 && scopeValue326(scopeValue347));
  scopeValue327();
  scopeValue328();
  scopeValue329();
  scopeValue321.onchange = scopeValue328;
  scopeValue322.onchange = () => {
    scopeValue322.value && (scopeValue319.push(String(scopeValue322.value)), scopeValue328(), scopeValue329());
  };
  scopeValue320.querySelector("#wb-selector-cancel-btn").onclick = () => window.closeView?.(scopeValue320);
  scopeValue320.querySelector("#wb-selector-confirm-btn").onclick = () => {
    window.closeView?.(scopeValue320);
    if (typeof scopeValue317 === "function") scopeValue317([...scopeValue319]);
  };
  window.openView?.(scopeValue320);
};
window.renderLegacyWorldBookSelector = window.renderWorldBookSelector;
window.autoSaveSummaryToWorldBook = function scopeValue352(scopeValue350, scopeValue351) {
  worldBooks.push({
    id: Date.now(),
    name: scopeValue350 || "自动总结",
    group: WB_UNGROUPED,
    isGlobal: true,
    attachedRoles: [],
    entries: [{
      title: "总结内容",
      content: scopeValue351,
      keyword: "",
      triggerMode: "permanent",
      injectionPosition: "before_role",
      systemDepth: 4,
      order: 100,
      recursive: false,
      enabled: true
    }]
  });
  saveWorldBooksData();
  renderWorldBooks({
    force: true
  });
  window.showToast?.("已自动生成全局世界书");
};
let wbSearchTimer = null;
const WB_SEARCH_DEBOUNCE_MS = 200;
function initializeWorldBookUi() {
  if (typeof UI !== "undefined") UI.views.worldBook = getWbElement("world-book-view");
  window.mobileInputCompat?.registerFocusScope?.({
    selector: "#world-book-view",
    priority: 20,
    preferFocusScope: true,
    resolveScrollContainer(scopeValue353, scopeValue354) {
      return scopeValue354?.querySelector("#wb-files-editor-page.active .wb-editor-scroll") || null;
    },
    scrollBehavior: "focus"
  });
  getWbElement("world-book-back-btn")?.addEventListener("click", () => closeWbOverlay("world-book-view"));
  getWbElement("wb-folder-add-btn")?.addEventListener("click", () => openGroupNameDialog());
  getWbElement("wb-help-btn")?.addEventListener("click", openWorldBookGuide);
  getWbElement("wb-folder-edit-btn")?.addEventListener("click", scopeValue355 => {
    wbFolderEditMode = !wbFolderEditMode;
    const scopeValue356 = scopeValue355.currentTarget;
    scopeValue356.classList.toggle("is-active", wbFolderEditMode);
    scopeValue356.setAttribute("aria-pressed", String(wbFolderEditMode));
    scopeValue356.setAttribute("aria-label", wbFolderEditMode ? "完成编辑" : "编辑文件夹");
    scopeValue356.title = wbFolderEditMode ? "完成编辑" : "编辑文件夹";
    scopeValue356.querySelector("i").className = wbFolderEditMode ? "fas fa-check" : "fas fa-pen";
    renderWorldBooks({
      force: true
    });
  });
  getWbElement("wb-main-add-book-btn")?.addEventListener("click", () => openBookModal());
  getWbElement("wb-group-back-btn")?.addEventListener("click", showWbMainPage);
  getWbElement("wb-group-add-book-btn")?.addEventListener("click", () => openBookModal(null, activeWbGroupName));
  getWbElement("wb-group-more-btn")?.addEventListener("click", toggleGroupMoreMenu);
  getWbElement("wb-editor-back-btn")?.addEventListener("click", requestCloseEditor);
  getWbElement("wb-editor-done-btn")?.addEventListener("click", finishEditor);
  getWbElement("add-book-entry-btn")?.addEventListener("click", addEntry);
  getWbElement("delete-world-book-btn")?.addEventListener("click", deleteCurrentBook);
  getWbElement("wb-editor-global-toggle")?.addEventListener("change", scopeValue357 => {
    draftIsGlobal = scopeValue357.target.checked;
  });
  getWbElement("wb-group-name-cancel-btn")?.addEventListener("click", () => closeWbOverlay("wb-group-name-overlay"));
  getWbElement("wb-group-name-confirm-btn")?.addEventListener("click", saveGroupName);
  getWbElement("wb-group-name-input")?.addEventListener("keydown", scopeValue358 => {
    if (scopeValue358.key !== "Enter" || scopeValue358.isComposing || scopeValue358.keyCode === 229) return;
    scopeValue358.preventDefault();
    saveGroupName();
  });
  getWbElement("wb-import-file")?.addEventListener("change", async scopeValue359 => {
    const scopeValue360 = Array.from(scopeValue359.target.files || []);
    scopeValue359.target.value = "";
    await importWorldBookFiles(scopeValue360);
  });
  getWbElement("wb-search-input")?.addEventListener("input", scopeValue361 => {
    if (wbSearchTimer) clearTimeout(wbSearchTimer);
    wbSearchTimer = setTimeout(() => {
      wbSearchTimer = null;
      renderSearchResults(scopeValue361.target.value);
    }, WB_SEARCH_DEBOUNCE_MS);
  });
  document.addEventListener("click", scopeValue362 => {
    const scopeValue363 = getWbElement("wb-group-more-menu");
    if (scopeValue363 && !scopeValue363.hidden && !scopeValue363.contains(scopeValue362.target) && !scopeValue362.target.closest("#wb-group-more-btn")) scopeValue363.hidden = true;
  });
}
(window.u2OnStorageReady || (scopeValue364 => document.addEventListener("DOMContentLoaded", scopeValue364)))(() => {
  window.StorageManager && (worldBooks = window.StorageManager.load("u2_worldBooks", []), wbGroups = window.StorageManager.load("u2_wbGroups", []));
  normalizeGroups();
  renderWorldBooks({
    force: true
  });
});
initializeWorldBookUi();
