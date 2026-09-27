(function () {
  'use strict';

  const text = "appstore",
    schemaVersion_2 = 1,
    items = [{
      id: "anonymous-qa",
      name: "匿名问答",
      category: "社交 · 角色互动",
      keywords: "匿名 问答 提问 来信 char game",
      description: "选择一位 Char，看看 TA 会怎样回答匿名来信。",
      version: "1.0.0",
      permissions: ["characters", "ai"],
      icon: "fas fa-user-secret",
      bg: "#111111",
      fg: "#ffffff",
      builtin: true
    }],
    options = {
      today: "appstore-today-page",
      app: "appstore-app-page",
      search: "appstore-search-page"
    };
  let value_2 = null,
    text_3 = "today",
    text_4 = "today",
    value_5 = null,
    value_6 = null,
    count_7 = 0,
    value_8 = null,
    count_9 = 0,
    value_10 = null,
    value_11 = null,
    value_12 = null,
    options_13 = {
      schemaVersion: schemaVersion_2,
      installedBuiltinIds: []
    };
  const value_14 = new Set();
  function handleAction_15() {
    value_2 = {
      view: document.getElementById("appstore-view"),
      back: document.getElementById("appstore-back-btn"),
      date: document.getElementById("appstore-today-date"),
      appList: document.getElementById("appstore-app-list"),
      myApps: document.getElementById("appstore-my-apps"),
      myAppsEmpty: document.getElementById("appstore-my-apps-empty"),
      copyTemplate: document.getElementById("appstore-copy-template-btn"),
      importButton: document.getElementById("appstore-import-app-btn"),
      importInput: document.getElementById("appstore-import-app-input"),
      installOverlay: document.getElementById("appstore-install-overlay"),
      installIcon: document.getElementById("appstore-install-icon"),
      installMode: document.getElementById("appstore-install-mode"),
      installTitle: document.getElementById("appstore-install-title"),
      installDescription: document.getElementById("appstore-install-description"),
      installVersion: document.getElementById("appstore-install-version"),
      installPermissions: document.getElementById("appstore-install-permission-list"),
      installCancel: document.getElementById("appstore-install-cancel"),
      installConfirm: document.getElementById("appstore-install-confirm"),
      detailOverlay: document.getElementById("appstore-detail-overlay"),
      detailIcon: document.getElementById("appstore-detail-icon"),
      detailMode: document.getElementById("appstore-detail-mode"),
      detailTitle: document.getElementById("appstore-detail-title"),
      detailDescription: document.getElementById("appstore-detail-description"),
      detailVersion: document.getElementById("appstore-detail-version"),
      detailPermissions: document.getElementById("appstore-detail-permission-list"),
      detailCancel: document.getElementById("appstore-detail-cancel"),
      detailExport: document.getElementById("appstore-detail-export"),
      detailOpen: document.getElementById("appstore-detail-open"),
      detailUninstall: document.getElementById("appstore-detail-uninstall"),
      searchInput: document.getElementById("appstore-search-input"),
      searchClear: document.getElementById("appstore-search-clear"),
      searchSuggestions: document.getElementById("appstore-search-suggestions"),
      searchSummary: document.getElementById("appstore-search-summary"),
      searchResults: document.getElementById("appstore-search-results"),
      searchEmpty: document.getElementById("appstore-search-empty"),
      emptyClear: document.getElementById("appstore-empty-clear"),
      learnMore: document.getElementById("appstore-u2-learn-more"),
      status: document.getElementById("appstore-live-status"),
      tabPill: document.querySelector(".appstore-tab-pill"),
      pages: Object.fromEntries(Object.entries(options).map(([value_59, value_60]) => [value_59, document.getElementById(value_60)])),
      tabButtons: Array.from(document.querySelectorAll("[data-appstore-tab]")),
      suggestionButtons: Array.from(document.querySelectorAll("[data-appstore-suggestion]"))
    };
  }
  function handleAction_16(value_61) {
    return String(value_61).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  function handleAction_17(value_62) {
    const items_63 = Array.isArray(value_62?.installedBuiltinIds) ? value_62.installedBuiltinIds : [],
      value_64 = new Set(items.map(value_65 => value_65.id));
    return {
      schemaVersion: schemaVersion_2,
      installedBuiltinIds: Array.from(new Set(items_63.map(String).filter(value_66 => value_64.has(value_66))))
    };
  }
  function handleAction_18(value_67) {
    return options_13.installedBuiltinIds.includes(String(value_67 || ""));
  }
  function handleAction_19(value_68) {
    const value_69 = value_68.custom && String(value_68.iconValue || "").startsWith("data:image/") ? "<span class=\"appstore-list-icon custom-app-icon has-image\" style=\"background-image:url('" + handleAction_16(value_68.iconValue) + "')\"></span>" : value_68.custom ? "<span class=\"appstore-list-icon custom-app-icon\">" + handleAction_16(value_68.iconValue || "🎮") + "</span>" : "",
      value_70 = value_69 || (value_68.letter ? "<span class=\"appstore-list-icon is-letter\" style=\"--icon-bg:" + value_68.bg + ";--icon-fg:" + value_68.fg + "\">" + handleAction_16(value_68.letter) + "</span>" : "<span class=\"appstore-list-icon\" style=\"--icon-bg:" + value_68.bg + ";--icon-fg:" + value_68.fg + "\"><i class=\"" + handleAction_16(value_68.icon) + "\" aria-hidden=\"true\"></i></span>"),
      value_71 = value_68.builtin && handleAction_18(value_68.id),
      value_72 = value_68.builtin && value_14.has(value_68.id),
      value_73 = value_68.custom ? "<button type=\"button\" class=\"appstore-get-btn\" data-custom-app-open=\"" + handleAction_16(value_68.id) + "\">进入</button>" : "<button type=\"button\" class=\"appstore-get-btn" + (value_72 ? " is-loading" : "") + "\" data-builtin-app-action=\"" + handleAction_16(value_68.id) + "\" aria-label=\"" + (value_71 ? "进入" : "获取") + " " + handleAction_16(value_68.name) + "\" aria-busy=\"" + (value_72 ? "true" : "false") + "\"" + (value_72 ? " disabled" : "") + ">" + (value_72 ? "<i class=\"fas fa-spinner\" aria-hidden=\"true\"></i><span class=\"sr-only\">下载中</span>" : value_71 ? "进入" : "GET") + "</button>",
      value_74 = value_68.custom ? " data-custom-app-detail=\"" + handleAction_16(value_68.id) + "\"" : " data-builtin-app-detail=\"" + handleAction_16(value_68.id) + "\"";
    return "<article class=\"appstore-app-row is-detailable\" data-appstore-name=\"" + handleAction_16(value_68.name) + "\"" + value_74 + " role=\"button\" tabindex=\"0\" aria-label=\"查看 " + handleAction_16(value_68.name) + " 详情\">\n            " + value_70 + "\n            <span class=\"appstore-list-copy\"><strong>" + handleAction_16(value_68.name) + "</strong><span>" + handleAction_16(value_68.category) + "</span></span>\n            " + value_73 + "\n        </article>";
  }
  function handleAction_20(element, items_75) {
    if (!element) return;
    element.innerHTML = items_75.map(handleAction_19).join("");
  }
  function handleAction_21(value_76) {
    return String(value_76 || "").trim().toLocaleLowerCase("zh-CN");
  }
  function search_2(value_77) {
    const handleAction_21_78 = handleAction_21(value_77);
    if (!handleAction_21_78) return items.slice();
    return items.filter(value_79 => handleAction_21(value_79.name + " " + value_79.category + " " + value_79.keywords).includes(handleAction_21_78));
  }
  function handleAction_23() {
    const items_80 = window.customAppRuntime?.getInstalledApps?.() || [];
    return items_80.map(value_81 => ({
      id: value_81.id,
      name: value_81.name,
      category: "本地 App · v" + value_81.version,
      keywords: "本地 自制 游戏 " + (value_81.description || ""),
      iconValue: value_81.icon,
      custom: true
    }));
  }
  function handleAction_24(value_82) {
    const handleAction_21_83 = handleAction_21(value_82),
      items_84 = [...items, ...handleAction_23()];
    if (!handleAction_21_83) return items_84;
    return items_84.filter(value_85 => handleAction_21(value_85.name + " " + value_85.category + " " + value_85.keywords).includes(handleAction_21_83));
  }
  function handleAction_25() {
    const handleAction_23_86 = handleAction_23();
    handleAction_20(value_2?.myApps, handleAction_23_86);
    if (value_2?.myApps) value_2.myApps.hidden = handleAction_23_86.length === 0;
    if (value_2?.myAppsEmpty) value_2.myAppsEmpty.hidden = handleAction_23_86.length !== 0;
  }
  function handleAction_26() {
    handleAction_20(value_2?.appList, items);
    handleAction_25();
    handleAction_27();
  }
  function handleAction_27() {
    if (!value_2) return;
    const value_87 = value_2.searchInput?.value || "",
      handleAction_24_88 = handleAction_24(value_87);
    handleAction_20(value_2.searchResults, handleAction_24_88);
    if (value_2.searchClear) value_2.searchClear.hidden = !value_87;
    if (value_2.searchSuggestions) value_2.searchSuggestions.hidden = Boolean(value_87);
    value_2.searchSummary && (value_2.searchSummary.textContent = value_87 ? handleAction_24_88.length + " 个搜索结果" : "全部 App", value_2.searchSummary.hidden = handleAction_24_88.length === 0);
    if (value_2.searchResults) value_2.searchResults.hidden = handleAction_24_88.length === 0;
    if (value_2.searchEmpty) value_2.searchEmpty.hidden = handleAction_24_88.length !== 0;
  }
  function handleAction_28() {
    if (!value_2?.searchInput) return;
    value_2.searchInput.value = "";
    handleAction_27();
  }
  async function handleAction_29() {
    if (!window.appStorage) return;
    try {
      await window.appStorage.ready;
      options_13 = handleAction_17(window.appStorage.readDomain(text, options_13));
      handleAction_26();
    } catch (value_89) {
      console.warn("[appstore] Failed to load installed built-in apps.", value_89);
    }
  }
  function handleAction_30(value_90) {
    return new Promise(value_91 => window.setTimeout(value_91, value_90));
  }
  function handleAction_31(value_92) {
    if (value_92 !== "anonymous-qa") return;
    if (typeof window.imGame?.openAnonymousQa !== "function") {
      handleAction_54("匿名问答尚未准备好，请稍后重试");
      return;
    }
    void window.imGame.openAnonymousQa();
  }
  async function handleAction_32(value_93) {
    const result = items.find(value_94 => value_94.id === String(value_93 || ""));
    if (!result || value_14.has(result.id)) return;
    if (handleAction_18(result.id)) {
      handleAction_31(result.id);
      return;
    }
    if (!window.appStorage?.commitDomain) {
      handleAction_54("本地存储尚未准备好");
      return;
    }
    value_14.add(result.id);
    handleAction_26();
    try {
      await handleAction_30(900);
      const handleAction_17_95 = handleAction_17({
        ...options_13,
        installedBuiltinIds: [...options_13.installedBuiltinIds, result.id]
      });
      await window.appStorage.commitDomain(text, handleAction_17_95, {
        critical: true,
        reason: "appstore-builtin-install"
      });
      options_13 = handleAction_17_95;
      handleAction_54(result.name + " 已下载");
    } catch (value_96) {
      handleAction_54(value_96?.message || "下载失败，请稍后重试");
    } finally {
      value_14["delete"](result.id);
      handleAction_26();
    }
  }
  function handleAction_33(value_97) {
    if (value_97 === "ai") return "<span><i class=\"fas fa-wand-magic-sparkles\" aria-hidden=\"true\"></i>使用已配置的 AI 模型</span>";
    if (value_97 === "characters") return "<span><i class=\"fas fa-user\" aria-hidden=\"true\"></i>读取角色基础资料</span>";
    if (value_97 === "profile") return "<span><i class=\"fas fa-id-card\" aria-hidden=\"true\"></i>读取 User 名字与人设</span>";
    return "";
  }
  function handleAction_34(element_98, value_99) {
    if (!element_98) return;
    const string = String(value_99 || "🎮"),
      startsWith_100 = string.startsWith("data:image/");
    element_98.classList.toggle("has-image", startsWith_100);
    element_98.style.removeProperty("background-color");
    element_98.style.removeProperty("color");
    element_98.style.backgroundImage = startsWith_100 ? "url(\"" + string.replace(/"/g, "%22") + "\")" : "";
    element_98.textContent = startsWith_100 ? "" : string;
  }
  function handleAction_35(value_101) {
    if (!value_2?.detailIcon) return;
    value_2.detailIcon.classList.remove("has-image");
    value_2.detailIcon.style.backgroundImage = "";
    value_2.detailIcon.style.backgroundColor = value_101.bg || "#111";
    value_2.detailIcon.style.color = value_101.fg || "#fff";
    value_2.detailIcon.innerHTML = "<i class=\"" + handleAction_16(value_101.icon) + "\" aria-hidden=\"true\"></i>";
  }
  function handleAction_36(value_102) {
    if (!value_2?.installOverlay) return;
    value_11 = value_102;
    value_2.installMode.textContent = value_102.isUpdate ? "更新本地 App · 存档会保留" : "安装本地 App";
    value_2.installTitle.textContent = value_102.name;
    value_2.installDescription.textContent = value_102.description || "这个 App 没有填写说明。";
    value_2.installVersion.textContent = "版本 " + value_102.version + " · " + value_102.id;
    value_2.installPermissions.innerHTML = value_102.permissions.length ? value_102.permissions.map(handleAction_33).join("") : "<span><i class=\"fas fa-lock\" aria-hidden=\"true\"></i>不申请额外权限</span>";
    handleAction_34(value_2.installIcon, value_102.icon);
    value_2.installConfirm.textContent = value_102.isUpdate ? "更新" : "安装";
    value_2.installOverlay.hidden = false;
    value_2.installConfirm.focus();
  }
  function handleAction_37() {
    value_11 = null;
    if (value_2?.installOverlay) value_2.installOverlay.hidden = true;
  }
  function handleAction_38(value_103) {
    const app_104 = window.customAppRuntime?.getApp?.(value_103);
    if (!app_104 || !value_2?.detailOverlay) return;
    value_12 = {
      type: "custom",
      id: app_104.id
    };
    handleAction_34(value_2.detailIcon, app_104.icon);
    value_2.detailMode.textContent = "已安装的本地 App";
    value_2.detailTitle.textContent = app_104.name;
    value_2.detailDescription.textContent = app_104.description || "这个 App 没有填写说明。";
    value_2.detailVersion.textContent = "版本 " + app_104.version + " · " + app_104.id;
    value_2.detailPermissions.innerHTML = app_104.permissions.length ? app_104.permissions.map(handleAction_33).join("") : "<span><i class=\"fas fa-lock\" aria-hidden=\"true\"></i>不申请额外权限</span>";
    value_2.detailOverlay.dataset.detailType = "custom";
    value_2.detailExport.hidden = false;
    value_2.detailExport.disabled = false;
    value_2.detailUninstall.hidden = false;
    value_2.detailOpen.textContent = "进入";
    value_2.detailOverlay.hidden = false;
    value_2.detailOpen?.focus();
  }
  function handleAction_39(value_105) {
    const result_106 = items.find(value_107 => value_107.id === String(value_105 || ""));
    if (!result_106 || !value_2?.detailOverlay) return;
    value_12 = {
      type: "builtin",
      id: result_106.id
    };
    handleAction_35(result_106);
    value_2.detailMode.textContent = "热门应用";
    value_2.detailTitle.textContent = result_106.name;
    value_2.detailDescription.textContent = result_106.description;
    value_2.detailVersion.textContent = "版本 " + result_106.version + " · " + result_106.category;
    value_2.detailPermissions.innerHTML = result_106.permissions.map(handleAction_33).join("");
    value_2.detailOverlay.dataset.detailType = "builtin";
    value_2.detailExport.hidden = true;
    value_2.detailUninstall.hidden = true;
    value_2.detailOpen.textContent = handleAction_18(result_106.id) ? "进入" : "GET";
    value_2.detailOverlay.hidden = false;
    value_2.detailOpen?.focus();
  }
  function handleAction_40() {
    value_12 = null;
    if (value_2?.detailOverlay) value_2.detailOverlay.hidden = true;
  }
  function handleAction_41() {
    const value_108 = value_12;
    if (!value_108) return;
    if (value_108.type === "builtin") {
      handleAction_40();
      void handleAction_32(value_108.id);
      return;
    }
    window.customAppRuntime?.open?.(value_108.id)["catch"](value_109 => handleAction_54(value_109?.message || "无法进入 App"));
  }
  async function handleAction_42() {
    const value_110 = value_12;
    if (value_110?.type !== "custom" || !window.customAppRuntime?.exportApp) return;
    value_2.detailExport.disabled = true;
    try {
      const value_111 = await window.customAppRuntime.exportApp(value_110.id);
      if (value_111 === "downloaded" || value_111 === "shared") handleAction_54("App 已导出");else {
        if (value_111 !== "cancelled") handleAction_54("App 导出失败");
      }
    } catch (value_112) {
      handleAction_54(value_112?.message || "App 导出失败");
    } finally {
      value_2.detailExport.disabled = false;
    }
  }
  async function handleAction_43(value_113) {
    if (!value_113 || !window.customAppRuntime) return;
    try {
      const value_114 = await window.customAppRuntime.inspectFile(value_113);
      handleAction_36(value_114);
    } catch (value_115) {
      handleAction_54(value_115?.message || "无法导入这个 App");
    }
  }
  async function handleAction_44() {
    if (!window.customAppRuntime?.copyTemplate) return;
    value_2.copyTemplate.disabled = true;
    try {
      await window.customAppRuntime.copyTemplate();
      handleAction_54("完整 HTML 模板已复制");
    } catch (value_116) {
      handleAction_54(value_116?.message || "模板复制失败");
    } finally {
      value_2.copyTemplate.disabled = false;
    }
  }
  async function handleAction_45() {
    const value_117 = value_11;
    if (!value_117 || !window.customAppRuntime) return;
    value_2.installConfirm.disabled = true;
    try {
      const value_118 = await window.customAppRuntime.install(value_117);
      handleAction_37();
      handleAction_25();
      handleAction_27();
      handleAction_54(value_117.isUpdate ? value_118.name + " 已更新，原存档已保留" : value_118.name + " 已安装到桌面");
    } catch (value_119) {
      handleAction_54(value_119?.message || "安装失败");
    } finally {
      value_2.installConfirm.disabled = false;
    }
  }
  async function handleAction_46(value_120) {
    const app_121 = window.customAppRuntime?.getApp?.(value_120);
    if (!app_121) return;
    if (!window.confirm("卸载“" + app_121.name + "”？\n\nApp 本体和它的本地存档都会删除。")) return;
    try {
      await window.customAppRuntime.uninstall(value_120);
      handleAction_40();
      handleAction_25();
      handleAction_27();
      handleAction_54(app_121.name + " 已卸载");
    } catch (value_122) {
      handleAction_54(value_122?.message || "卸载失败");
    }
  }
  function switchTab_2(value_123) {
    if (!value_2 || !options[value_123]) return;
    text_3 = value_123;
    value_2.tabPill?.classList.toggle("search-active", value_123 === "search");
    (value_123 === "today" || value_123 === "app") && (text_4 = value_123, value_2.tabPill?.setAttribute("data-active-tab", value_123));
    Object.entries(value_2.pages).forEach(([value_124, element_125]) => {
      if (!element_125) return;
      const value_126 = value_124 === value_123;
      if (!value_126) {
        const activeElement_127 = document.activeElement;
        activeElement_127 && element_125.contains(activeElement_127) && typeof activeElement_127.blur === "function" && activeElement_127.blur();
      }
      element_125.hidden = false;
      element_125.classList.toggle("active", value_126);
      element_125.setAttribute("aria-hidden", String(!value_126));
      element_125.inert = !value_126;
    });
    value_2.tabButtons.forEach(element_128 => {
      const value_129 = element_128.dataset.appstoreTab === value_123;
      element_128.classList.toggle("active", value_129);
      element_128.getAttribute("role") === "tab" ? element_128.setAttribute("aria-selected", String(value_129)) : element_128.setAttribute("aria-pressed", String(value_129));
    });
    value_2.pages[value_123]?.querySelector(".appstore-page-scroll")?.scrollTo?.({
      top: 0,
      behavior: "auto"
    });
    if (value_123 === "search") handleAction_27();
  }
  function handleAction_48() {
    if (!value_2?.tabPill) return;
    if (count_9) window.cancelAnimationFrame(count_9);
    count_9 = 0;
    value_10 = null;
    value_8 = null;
    value_2.tabPill.classList.remove("dragging");
    value_2.tabPill.style.removeProperty("--slider-left");
    value_2.tabPill.setAttribute("data-active-tab", text_4);
  }
  function handleAction_49(value_130) {
    if (!value_2?.tabPill) return text_4;
    const value_131 = value_8;
    if (value_131) return value_130 < value_131.left + value_131.width / 2 ? "today" : "app";
    const boundingClientRect = value_2.tabPill.getBoundingClientRect();
    return value_130 < boundingClientRect.left + boundingClientRect.width / 2 ? "today" : "app";
  }
  function handleAction_50(value_132) {
    if (!value_2?.tabPill) return;
    const value_133 = value_8;
    if (!value_133) return;
    const max_134 = Math.max(value_133.inset, Math.min(value_133.width - value_133.inset - value_133.sliderWidth, value_132 - value_133.left - value_133.sliderWidth / 2));
    value_2.tabPill.style.setProperty("--slider-left", max_134 + "px");
  }
  function handleAction_51(value_135) {
    value_10 = value_135;
    if (count_9) return;
    count_9 = window.requestAnimationFrame(() => {
      count_9 = 0;
      handleAction_50(value_10);
    });
  }
  function handleAction_52() {
    if (!value_2?.tabPill) return;
    value_2.tabPill.setAttribute("data-active-tab", text_4);
    value_2.tabPill.addEventListener("pointerdown", event => {
      if (!event.target.closest("[data-appstore-tab=\"today\"], [data-appstore-tab=\"app\"]")) return;
      value_6 = event.pointerId;
      const boundingClientRect_136 = value_2.tabPill.getBoundingClientRect(),
        inset_2 = 5;
      value_8 = {
        left: boundingClientRect_136.left,
        width: boundingClientRect_136.width,
        inset: inset_2,
        sliderWidth: (boundingClientRect_136.width - inset_2 * 2) / 2
      };
      value_2.tabPill.classList.add("dragging");
      value_2.tabPill.setPointerCapture?.(event.pointerId);
      handleAction_50(event.clientX);
    });
    value_2.tabPill.addEventListener("pointermove", event_138 => {
      if (value_6 !== event_138.pointerId) return;
      handleAction_51(event_138.clientX);
    });
    value_2.tabPill.addEventListener("pointerup", event_139 => {
      if (value_6 !== event_139.pointerId) return;
      const handleAction_49_140 = handleAction_49(event_139.clientX);
      value_6 = null;
      count_7 = Date.now() + 220;
      switchTab_2(handleAction_49_140);
      handleAction_48();
    });
    value_2.tabPill.addEventListener("pointercancel", value_141 => {
      if (value_6 !== value_141.pointerId) return;
      value_6 = null;
      handleAction_48();
    });
  }
  function handleAction_53() {
    if (!value_2?.date) return;
    const textContent_2 = new Intl.DateTimeFormat("zh-CN", {
      month: "long",
      day: "numeric",
      weekday: "long"
    }).format(new Date());
    value_2.date.textContent = textContent_2;
  }
  function handleAction_54(value_143) {
    const textContent_3 = String(value_143 || "");
    if (typeof window.showToast === "function") {
      window.showToast(textContent_3);
      return;
    }
    if (!value_2?.status) return;
    window.clearTimeout(value_5);
    value_2.status.textContent = textContent_3;
    value_2.status.classList.add("show");
    value_5 = window.setTimeout(() => value_2?.status?.classList.remove("show"), 2200);
  }
  function open_2() {
    if (!value_2?.view) return;
    handleAction_28();
    switchTab_2("today");
    handleAction_53();
    value_2.view.inert = false;
    value_2.view.setAttribute("aria-hidden", "false");
    if (typeof window.openView === "function") window.openView(value_2.view);else value_2.view.classList.add("active");
  }
  function close_2() {
    if (!value_2?.view) return;
    handleAction_37();
    handleAction_40();
    const activeElement_145 = document.activeElement;
    activeElement_145 && value_2.view.contains(activeElement_145) && typeof activeElement_145.blur === "function" && activeElement_145.blur();
    value_2.view.inert = true;
    value_2.view.setAttribute("aria-hidden", "true");
    if (typeof window.closeView === "function") window.closeView(value_2.view);else value_2.view.classList.remove("active");
    handleAction_28();
    switchTab_2("today");
  }
  function handleAction_57() {
    if (!value_2?.view || value_2.view.dataset.appstoreBound === "true") return;
    value_2.view.dataset.appstoreBound = "true";
    value_2.back?.addEventListener("click", close_2);
    value_2.tabButtons.forEach(value_146 => value_146.addEventListener("click", () => {
      if (Date.now() < count_7 && value_146.dataset.appstoreTab !== "search") return;
      switchTab_2(value_146.dataset.appstoreTab);
    }));
    handleAction_52();
    value_2.searchInput?.addEventListener("input", handleAction_27);
    value_2.searchClear?.addEventListener("click", handleAction_28);
    value_2.emptyClear?.addEventListener("click", handleAction_28);
    value_2.suggestionButtons.forEach(value_147 => value_147.addEventListener("click", () => {
      if (!value_2.searchInput) return;
      value_2.searchInput.value = value_147.dataset.appstoreSuggestion || "";
      handleAction_27();
    }));
    value_2.learnMore?.addEventListener("click", () => handleAction_54("U2phone: Chat, create, and live — all in one place."));
    value_2.copyTemplate?.addEventListener("click", handleAction_44);
    value_2.importButton?.addEventListener("click", () => value_2.importInput?.click());
    value_2.importInput?.addEventListener("change", () => {
      const value_148 = value_2.importInput.files?.[0];
      value_2.importInput.value = "";
      if (value_148) handleAction_43(value_148);
    });
    value_2.installCancel?.addEventListener("click", handleAction_37);
    value_2.installConfirm?.addEventListener("click", handleAction_45);
    value_2.installOverlay?.addEventListener("click", event_149 => {
      if (event_149.target === value_2.installOverlay) handleAction_37();
    });
    value_2.detailCancel?.addEventListener("click", handleAction_40);
    value_2.detailExport?.addEventListener("click", () => void handleAction_42());
    value_2.detailOpen?.addEventListener("click", handleAction_41);
    value_2.detailUninstall?.addEventListener("click", () => {
      if (value_12?.type === "custom") void handleAction_46(value_12.id);
    });
    value_2.detailOverlay?.addEventListener("click", event_150 => {
      if (event_150.target === value_2.detailOverlay) handleAction_40();
    });
    value_2.view.addEventListener("keydown", event_151 => {
      const closest_152 = event_151.target.closest?.("[data-custom-app-detail], [data-builtin-app-detail]");
      if (!closest_152 || event_151.target.closest?.("[data-custom-app-open]") || event_151.key !== "Enter" && event_151.key !== " ") return;
      event_151.preventDefault();
      if (closest_152.dataset.customAppDetail) handleAction_38(closest_152.dataset.customAppDetail);else handleAction_39(closest_152.dataset.builtinAppDetail);
    });
    value_2.view.addEventListener("click", event_153 => {
      const closest_154 = event_153.target.closest("[data-custom-app-open]");
      if (closest_154) {
        event_153.preventDefault();
        event_153.stopPropagation();
        window.customAppRuntime?.open?.(closest_154.dataset.customAppOpen)["catch"](value_158 => handleAction_54(value_158?.message || "无法进入 App"));
        return;
      }
      const closest_155 = event_153.target.closest("[data-builtin-app-action]");
      if (closest_155) {
        event_153.preventDefault();
        event_153.stopPropagation();
        void handleAction_32(closest_155.dataset.builtinAppAction);
        return;
      }
      const closest_156 = event_153.target.closest("[data-custom-app-detail], [data-builtin-app-detail]");
      if (closest_156) {
        if (closest_156.dataset.customAppDetail) handleAction_38(closest_156.dataset.customAppDetail);else handleAction_39(closest_156.dataset.builtinAppDetail);
        return;
      }
      const closest_157 = event_153.target.closest("[data-appstore-get]");
      if (!closest_157) return;
      event_153.preventDefault();
      event_153.stopPropagation();
      handleAction_54("演示商店暂不支持安装");
    });
  }
  function handleDOMContentLoaded() {
    handleAction_15();
    if (!value_2.view) return;
    handleAction_26();
    handleAction_53();
    handleAction_57();
    switchTab_2("today");
    void handleAction_29();
    window.customAppRuntime?.ready?.().then(() => {
      handleAction_25();
      handleAction_27();
    });
    window.addEventListener("u2-custom-apps-changed", () => {
      handleAction_25();
      handleAction_27();
    });
  }
  window.appStoreApp = {
    open: open_2,
    close: close_2,
    switchTab: switchTab_2,
    search: search_2,
    getActiveTab: () => text_3
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", handleDOMContentLoaded, {
    once: true
  });else handleDOMContentLoaded();
})();
