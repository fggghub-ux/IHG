(function () {
  'use strict';

  const SETTINGS_KEY = "homeWidgetPanelEnhanceSettings",
    DESKTOP_STATE_KEY = "desktop",
    WIDGET_DEFAULTS = {
      profile: {
        color: "rgba(255, 255, 255, 0.7)"
      },
      pet: {
        color: "rgba(255, 255, 255, 0.7)"
      },
      music: {
        color: "rgba(255, 255, 255, 0.7)"
      },
      couple: {
        color: "rgba(255, 255, 255, 0.85)"
      },
      photo: {
        color: "rgba(255, 255, 255, 0.7)"
      },
      notification: {
        color: "rgba(255, 255, 255, 0.7)"
      },
      socialPost: {
        color: "rgba(255, 255, 255, 0.96)"
      },
      html: {
        color: "rgba(255, 255, 255, 0.7)"
      }
    },
    WIDGET_TEXT_DEFAULTS = {
      profileTitle: "i 🤍uuu so..@kendall",
      profileBio: "Te amo mucho...",
      profilePosts: "19",
      profileFollowers: "7119.1K",
      profileFollowing: "8",
      petText: "irrelevant",
      musicTitle: "But...",
      musicArtist: "- Drake",
      musicLyric1: "Whit no makeup she a ten",
      musicLyric2: "And she the best with that head",
      musicLyric3: "Even better than Karrine",
      coupleLeft: "-.-",
      coupleRight: "TT",
      photoTitle: "callmekim",
      photoBody: "",
      notificationTitle: "Entanglement",
      notificationDesc: "If it’s not mine, it’s not special.",
      postAuthor: "you",
      postBody: "If you still exist in this world, then no matter what this world is like, it is meaningful to me."
    },
    options = {
      profile: [{
        key: "profileTitle",
        label: "名称"
      }, {
        key: "profileBio",
        label: "个人简介",
        multiline: true
      }, {
        key: "profilePosts",
        label: "Posts"
      }, {
        key: "profileFollowers",
        label: "Followers"
      }, {
        key: "profileFollowing",
        label: "Following"
      }],
      pet: [{
        key: "petText",
        label: "气泡文字"
      }],
      music: [{
        key: "musicTitle",
        label: "标题"
      }, {
        key: "musicLyric1",
        label: "歌词 1"
      }, {
        key: "musicLyric2",
        label: "歌词 2"
      }, {
        key: "musicLyric3",
        label: "歌词 3"
      }],
      couple: [{
        key: "coupleLeft",
        label: "左侧文字"
      }, {
        key: "coupleRight",
        label: "右侧文字"
      }],
      notification: [{
        key: "notificationTitle",
        label: "标题"
      }, {
        key: "notificationDesc",
        label: "内容",
        multiline: true
      }],
      socialPost: [{
        key: "postAuthor",
        label: "名字"
      }, {
        key: "postBody",
        label: "文案",
        multiline: true
      }]
    },
    options_2 = {
      profile: [{
        key: "avatar",
        label: "头像"
      }],
      pet: [{
        key: "pet",
        label: "图片"
      }],
      music: [{
        key: "cover",
        label: "封面"
      }],
      couple: [{
        key: "left",
        label: "左侧图片"
      }, {
        key: "right",
        label: "右侧图片"
      }],
      photo: [{
        key: "photo",
        label: "图片 1"
      }, {
        key: "photo2",
        label: "图片 2"
      }, {
        key: "photo3",
        label: "图片 3"
      }],
      notification: [{
        key: "avatar",
        label: "头像"
      }],
      socialPost: [{
        key: "avatar",
        label: "头像"
      }, {
        key: "postImage",
        label: "横图"
      }]
    };
  let libraryObserver = null,
    batteryLevel = 100;
  document.addEventListener("DOMContentLoaded", init);
  function init() {
    ensureStatusBar();
    ensurePanelSwitches();
    applyHomeChromeSettings();
    enhanceLibraryWhenReady();
    updateStatusClock();
    setInterval(updateStatusClock, 30000);
    initBattery();
  }
  function loadSettings() {
    try {
      const parsed = window.StorageManager?.load(SETTINGS_KEY, {}) || {};
      return {
        showStatusBar: parsed.showStatusBar === true,
        showSearch: parsed.showSearch !== false
      };
    } catch (error) {
      return {
        showStatusBar: false,
        showSearch: true
      };
    }
  }
  function saveSettings(next) {
    window.StorageManager?.save(SETTINGS_KEY, next);
  }
  function getDesktopState() {
    try {
      if (typeof window.getAppState === "function") {
        const state = window.getAppState(DESKTOP_STATE_KEY);
        if (state && typeof state === "object") return state;
      }
    } catch (error_2) {
      console.warn("[home_widget_panel_enhance] getAppState failed", error_2);
    }
    try {
      if (window.StorageManager && typeof window.StorageManager.load === "function") {
        const state_2 = window.StorageManager.load("home_desktop_state");
        if (state_2 && typeof state_2 === "object") return state_2;
      }
    } catch (error_3) {
      console.warn("[home_widget_panel_enhance] StorageManager load failed", error_3);
    }
    return null;
  }
  function bindScrollFriendlyLibraryTouch_2(state_3) {
    try {
      if (typeof window.setAppState === "function") {
        window.setAppState(DESKTOP_STATE_KEY, state_3);
        return;
      }
    } catch (error_4) {
      console.warn("[home_widget_panel_enhance] setAppState failed", error_4);
    }
    try {
      window.StorageManager && typeof window.StorageManager.save === "function" && window.StorageManager.save("home_desktop_state", state_3);
    } catch (error_5) {
      console.warn("[home_widget_panel_enhance] StorageManager save failed", error_5);
    }
  }
  function ensurePanelSwitches() {
    const form = document.querySelector(".home-widget-form"),
      library_2 = document.getElementById("home-widget-library");
    if (!form || !library_2 || document.getElementById("home-panel-chrome-settings")) return;
    const settings = loadSettings(),
      group = document.createElement("div");
    group.className = "home-widget-panel-settings";
    group.id = "home-panel-chrome-settings";
    group.appendChild(createSettingRow({
      title: "显示状态栏",
      desc: "顶部时间、电量等仿 iPhone 状态",
      inputId: "home-statusbar-toggle",
      checked: settings.showStatusBar,
      onChange: function (checked_2) {
        const next_2 = Object.assign({}, loadSettings(), {
          showStatusBar: checked_2
        });
        saveSettings(next_2);
        applyHomeChromeSettings();
      }
    }));
    group.appendChild(createSettingRow({
      title: "显示搜索",
      desc: "主界面底栏上方 Search 样式",
      inputId: "home-search-toggle",
      checked: settings.showSearch,
      onChange: function (checked_3) {
        const next_3 = Object.assign({}, loadSettings(), {
          showSearch: checked_3
        });
        saveSettings(next_3);
        applyHomeChromeSettings();
      }
    }));
    form.insertBefore(group, library_2);
  }
  function createSettingRow(options_3) {
    const row = document.createElement("div");
    row.className = "home-widget-setting-row";
    const element_27 = document.createElement("div"),
      title_2 = document.createElement("span");
    title_2.textContent = options_3.title;
    const desc_2 = document.createElement("small");
    desc_2.textContent = options_3.desc;
    element_27.appendChild(title_2);
    element_27.appendChild(desc_2);
    const label_2 = document.createElement("label");
    label_2.className = "toggle-switch";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = options_3.inputId;
    input.checked = !!options_3.checked;
    const element_31 = document.createElement("span");
    return element_31.className = "slider", input.addEventListener("change", function () {
      options_3.onChange(input.checked);
    }), label_2.appendChild(input), label_2.appendChild(element_31), row.appendChild(element_27), row.appendChild(label_2), row;
  }
  function applyHomeChromeSettings() {
    const settings_2 = loadSettings();
    document.body.classList.toggle("home-statusbar-visible", settings_2.showStatusBar);
    document.body.classList.toggle("home-search-hidden", !settings_2.showSearch);
    const statusToggle = document.getElementById("home-statusbar-toggle"),
      searchToggle = document.getElementById("home-search-toggle");
    if (statusToggle) statusToggle.checked = settings_2.showStatusBar;
    if (searchToggle) searchToggle.checked = settings_2.showSearch;
  }
  function ensureStatusBar() {
    const app = document.getElementById("app");
    if (!app || document.getElementById("home-ios-status-bar")) return;
    const bar = document.createElement("div");
    bar.className = "home-ios-status-bar";
    bar.id = "home-ios-status-bar";
    const left = document.createElement("div");
    left.className = "home-ios-status-left";
    left.id = "home-ios-status-time";
    left.textContent = "9:41";
    const right = document.createElement("div");
    right.className = "home-ios-status-right";
    const signal = document.createElement("i");
    signal.className = "fas fa-signal";
    const wifi = document.createElement("i");
    wifi.className = "fas fa-wifi";
    const battery = document.createElement("div");
    battery.className = "home-ios-battery";
    battery.setAttribute("aria-label", "battery");
    const batteryLevelEl = document.createElement("div");
    batteryLevelEl.className = "home-ios-battery-level";
    batteryLevelEl.id = "home-ios-battery-level";
    battery.appendChild(batteryLevelEl);
    right.appendChild(signal);
    right.appendChild(wifi);
    right.appendChild(battery);
    bar.appendChild(left);
    bar.appendChild(right);
    app.insertBefore(bar, app.firstChild);
  }
  function updateStatusClock() {
    const timeEl = document.getElementById("home-ios-status-time");
    if (!timeEl) return;
    const now = new Date();
    timeEl.textContent = now.getHours() + ":" + String(now.getMinutes()).padStart(2, "0");
    const batteryEl = document.getElementById("home-ios-battery-level");
    batteryEl && batteryEl.style.setProperty("--battery-level", Math.max(8, Math.min(100, batteryLevel)) + "%");
  }
  function initBattery() {
    if (!navigator.getBattery) return;
    navigator.getBattery().then(function (battery_2) {
      const sync = function () {
        batteryLevel = Math.round((battery_2.level || 1) * 100);
        updateStatusClock();
      };
      sync();
      battery_2.addEventListener("levelchange", sync);
    })["catch"](function () {});
  }
  function enhanceLibraryWhenReady() {
    const library = document.getElementById("home-widget-library");
    if (!library) {
      setTimeout(enhanceLibraryWhenReady, 250);
      return;
    }
    enhanceLibraryCards();
    if (libraryObserver) libraryObserver.disconnect();
    libraryObserver = new MutationObserver(enhanceLibraryCards);
    libraryObserver.observe(library, {
      childList: true
    });
    bindScrollFriendlyLibraryTouch(library);
    library.addEventListener("click", onLibraryClick, true);
    library.addEventListener("input", onLibraryInput, true);
    library.addEventListener("change", onLibraryChange, true);
  }
  function bindScrollFriendlyLibraryTouch(library_3) {
    if (library_3.dataset.scrollFriendlyTouchBound === "1") return;
    library_3.dataset.scrollFriendlyTouchBound = "1";
    let startX = 0,
      startY = 0,
      moved = false;
    library_3.addEventListener("pointerdown", function (event) {
      if (event.pointerType !== "touch") return;
      startX = event.clientX;
      startY = event.clientY;
      moved = false;
    }, {
      passive: true
    });
    library_3.addEventListener("pointermove", function (event_2) {
      if (event_2.pointerType !== "touch") return;
      const dx = Math.abs(event_2.clientX - startX),
        dy = Math.abs(event_2.clientY - startY);
      if (dx > 8 || dy > 8) moved = true;
    }, {
      passive: true
    });
    library_3.addEventListener("click", function (event_3) {
      if (!moved) return;
      event_3.preventDefault();
      event_3.stopPropagation();
      moved = false;
    }, true);
  }
  function enhanceLibraryCards() {
    const library_4 = document.getElementById("home-widget-library");
    if (!library_4) return;
    library_4.querySelectorAll(".home-widget-library-card").forEach(function (card_2) {
      const widgetId_42 = card_2.dataset.widgetId;
      if (!widgetId_42) return;
      if (card_2.classList.contains("is-added")) {
        card_2.disabled = false;
        card_2.removeAttribute("role");
        card_2.removeAttribute("tabindex");
        card_2.setAttribute("aria-expanded", card_2.classList.contains("home-widget-card-expanded") ? "true" : "false");
        if (!card_2.querySelector(".home-widget-card-chevron")) {
          const toggle_2 = document.createElement("button");
          toggle_2.className = "home-widget-card-chevron";
          toggle_2.type = "button";
          toggle_2.setAttribute("aria-label", card_2.classList.contains("home-widget-card-expanded") ? "收起小组件设置" : "展开小组件设置");
          const icon_2 = document.createElement("i");
          icon_2.className = "fas fa-chevron-down";
          toggle_2.appendChild(icon_2);
          card_2.appendChild(toggle_2);
        }
        !card_2.querySelector(".home-widget-card-controls") ? card_2.appendChild(createControls(card_2)) : syncControl(card_2);
      } else {
        card_2.classList.remove("home-widget-card-expanded");
        const controls = card_2.querySelector(".home-widget-card-controls");
        if (controls) controls.remove();
        const chevron = card_2.querySelector(".home-widget-card-chevron");
        if (chevron) chevron.remove();
      }
    });
  }
  function onLibraryClick(event_4) {
    const toggle_3 = event_4.target.closest(".home-widget-card-chevron"),
      card_3 = toggle_3 && toggle_3.closest(".home-widget-library-card.is-added");
    if (!card_3) return;
    event_4.preventDefault();
    event_4.stopPropagation();
    card_3.classList.toggle("home-widget-card-expanded");
    const isExpanded = card_3.classList.contains("home-widget-card-expanded");
    card_3.setAttribute("aria-expanded", isExpanded ? "true" : "false");
    toggle_3.setAttribute("aria-label", isExpanded ? "收起小组件设置" : "展开小组件设置");
    syncControl(card_3);
  }
  function onLibraryInput(event_5) {
    const imageUrlInput = event_5.target.closest(".home-widget-image-url-input");
    if (imageUrlInput) {
      const closest_57 = imageUrlInput.closest(".home-widget-library-card"),
        value_58 = closest_57 && closest_57.dataset.widgetId,
        imageField_59 = imageUrlInput.dataset.imageField,
        src_2 = imageUrlInput.value.trim();
      if (!value_58 || !imageField_59) return;
      (!src_2 || isRemoteImageUrl(src_2)) && (setWidgetImage(value_58, imageField_59, src_2), syncImageButton(closest_57, imageField_59, src_2));
      return;
    }
    const textField_2 = event_5.target.closest(".home-widget-text-input");
    if (textField_2) {
      const closest_61 = textField_2.closest(".home-widget-library-card"),
        widgetId_2 = closest_61 && closest_61.dataset.widgetId,
        field_2 = textField_2.dataset.textField;
      if (!widgetId_2 || !field_2) return;
      setWidgetText(widgetId_2, field_2, textField_2.value);
      return;
    }
    const slider = event_5.target.closest(".home-widget-opacity-slider");
    if (!slider) return;
    const closest_53 = slider.closest(".home-widget-library-card"),
      value_54 = closest_53 && closest_53.dataset.widgetId,
      value_55 = closest_53 && closest_53.dataset.widgetType || resolveWidgetType(value_54);
    if (!value_54 || !value_55) return;
    const alpha = Number(slider.value) / 100;
    handleAction_13(value_54, value_55, alpha);
    syncControl(closest_53, alpha);
  }
  function onLibraryChange(event_6) {
    const imageInput = event_6.target.closest(".home-widget-image-input");
    if (!imageInput) return;
    const card = imageInput.closest(".home-widget-library-card"),
      widgetId_3 = card && card.dataset.widgetId,
      field = imageInput.dataset.imageField,
      file = imageInput.files && imageInput.files[0];
    imageInput.value = "";
    if (!widgetId_3 || !field || !file) return;
    readWidgetImage(file).then(function (imageData) {
      setWidgetImage(widgetId_3, field, imageData);
      syncImageButton(card, field, imageData);
    })["catch"](function (error_6) {
      console.warn("[home_widget_panel_enhance] image read failed", error_6);
    });
  }
  function createControls(card_4) {
    const widgetId_4 = card_4.dataset.widgetId,
      value_71 = card_4.dataset.widgetType || resolveWidgetType(widgetId_4),
      alpha_2 = getWidgetAlpha(widgetId_4, value_71),
      handleAction_9_73 = getWidgetConfig(widgetId_4, value_71),
      panel = document.createElement("div");
    panel.className = "home-widget-card-controls";
    const textSection = document.createElement("div");
    textSection.className = "home-widget-editor-section";
    textSection.appendChild(createSectionTitle("内容"));
    const items = options[value_71] || [];
    items.forEach(function (value_86) {
      textSection.appendChild(handleAction_7(value_86, handleAction_9_73));
    });
    const items_76 = options_2[value_71] || [],
      imageSection = document.createElement("div");
    imageSection.className = "home-widget-editor-section";
    imageSection.appendChild(createSectionTitle("图片"));
    items_76.forEach(function (value_87) {
      imageSection.appendChild(handleAction_8(value_87, handleAction_9_73));
    });
    const label_3 = document.createElement("div");
    label_3.className = "home-widget-opacity-label";
    const labelText = document.createElement("span");
    labelText.textContent = "组件背景透明度";
    const value_2 = document.createElement("span");
    value_2.className = "home-widget-opacity-value";
    value_2.textContent = Math.round(alpha_2 * 100) + "%";
    label_3.appendChild(labelText);
    label_3.appendChild(value_2);
    const row_2 = document.createElement("div");
    row_2.className = "home-widget-opacity-row";
    const slider_2 = document.createElement("input");
    slider_2.className = "home-widget-opacity-slider";
    slider_2.type = "range";
    slider_2.min = "0";
    slider_2.max = "100";
    slider_2.step = "1";
    slider_2.value = String(Math.round(alpha_2 * 100));
    slider_2.setAttribute("aria-label", "组件背景透明度");
    const resetBtn = document.createElement("button");
    resetBtn.className = "home-widget-reset-btn";
    resetBtn.type = "button";
    resetBtn.title = "重置透明度";
    resetBtn.setAttribute("aria-label", "重置透明度");
    const resetIcon = document.createElement("i");
    resetIcon.className = "fas fa-rotate-left";
    resetBtn.appendChild(resetIcon);
    resetBtn.addEventListener("click", function (event_7) {
      event_7.preventDefault();
      event_7.stopPropagation();
      const type_2 = card_4.dataset.widgetType || resolveWidgetType(widgetId_4);
      resetWidgetAlpha(widgetId_4, type_2);
      syncControl(card_4);
    });
    row_2.appendChild(slider_2);
    row_2.appendChild(resetBtn);
    const element_85 = document.createElement("div");
    element_85.className = "home-widget-editor-section";
    element_85.appendChild(label_3);
    element_85.appendChild(row_2);
    if (items.length) panel.appendChild(textSection);
    if (items_76.length) panel.appendChild(imageSection);
    return panel.appendChild(element_85), panel;
  }
  function createSectionTitle(textContent_2) {
    const title_3 = document.createElement("div");
    return title_3.className = "home-widget-editor-title", title_3.textContent = textContent_2, title_3;
  }
  function handleAction_7(field_3, config_2) {
    const label_4 = document.createElement("label");
    label_4.className = "home-widget-editor-field";
    const element_95 = document.createElement("span");
    element_95.textContent = field_3.label;
    const input_2 = document.createElement(field_3.multiline ? "textarea" : "input");
    input_2.className = "home-widget-text-input";
    input_2.dataset.textField = field_3.key;
    input_2.value = getWidgetTextValue(config_2, field_3.key);
    if (!field_3.multiline) input_2.type = "text";
    if (field_3.multiline) input_2.rows = 2;
    return label_4.appendChild(element_95), label_4.appendChild(input_2), label_4;
  }
  function handleAction_8(field_4, config_3) {
    const row_3 = document.createElement("div");
    row_3.className = "home-widget-image-field";
    const button = document.createElement("button");
    button.className = "home-widget-image-btn";
    button.type = "button";
    button.dataset.imageField = field_4.key;
    button.setAttribute("aria-label", "更换" + field_4.label);
    const widgetImageValue = getWidgetImageValue(config_3, field_4.key),
      preview = document.createElement("span");
    preview.className = "home-widget-image-thumb";
    preview.dataset.imageField = field_4.key;
    setImageThumb(preview, widgetImageValue);
    const element_102 = document.createElement("span");
    element_102.textContent = field_4.label;
    const element_103 = document.createElement("i");
    element_103.className = "fas fa-image";
    button.appendChild(preview);
    button.appendChild(element_102);
    button.appendChild(element_103);
    const input_3 = document.createElement("input");
    input_3.className = "home-widget-image-input";
    input_3.type = "file";
    input_3.accept = "image/*";
    input_3.dataset.imageField = field_4.key;
    const urlInput = document.createElement("input");
    return urlInput.className = "home-widget-image-url-input", urlInput.type = "url", urlInput.inputMode = "url", urlInput.placeholder = "图片链接 URL", urlInput.dataset.imageField = field_4.key, urlInput.value = isRemoteImageUrl(widgetImageValue) ? widgetImageValue : "", button.addEventListener("click", function (event_8) {
      event_8.preventDefault();
      event_8.stopPropagation();
      input_3.click();
    }), row_3.appendChild(button), row_3.appendChild(input_3), row_3.appendChild(urlInput), row_3;
  }
  function syncControl(card_5, forcedAlpha) {
    const widgetId_5 = card_5 && card_5.dataset.widgetId,
      widgetType_2 = card_5 && card_5.dataset.widgetType || resolveWidgetType(widgetId_5);
    if (!widgetId_5 || !widgetType_2) return;
    const config = getWidgetConfig(widgetId_5, widgetType_2),
      alpha_3 = typeof forcedAlpha === "number" ? forcedAlpha : getWidgetAlpha(widgetId_5, widgetType_2),
      value_3 = Math.round(alpha_3 * 100),
      slider_3 = card_5.querySelector(".home-widget-opacity-slider"),
      label_5 = card_5.querySelector(".home-widget-opacity-value");
    if (slider_3) slider_3.value = String(value_3);
    if (label_5) label_5.textContent = value_3 + "%";
    card_5.querySelectorAll(".home-widget-text-input").forEach(function (input_4) {
      const focused = document.activeElement === input_4;
      if (!focused) input_4.value = getWidgetTextValue(config, input_4.dataset.textField);
    });
    card_5.querySelectorAll(".home-widget-image-thumb").forEach(function (thumb) {
      setImageThumb(thumb, getWidgetImageValue(config, thumb.dataset.imageField));
    });
    card_5.querySelectorAll(".home-widget-image-url-input").forEach(function (input_5) {
      const focused_2 = document.activeElement === input_5,
        src_3 = getWidgetImageValue(config, input_5.dataset.imageField);
      if (!focused_2) input_5.value = isRemoteImageUrl(src_3) ? src_3 : "";
    });
  }
  function syncImageButton(card_6, field_5, src_4) {
    if (!card_6 || !field_5) return;
    const thumb_2 = card_6.querySelector(".home-widget-image-thumb[data-image-field=\"" + cssEscape(field_5) + "\"]");
    if (thumb_2) setImageThumb(thumb_2, src_4);
    const input_6 = card_6.querySelector(".home-widget-image-url-input[data-image-field=\"" + cssEscape(field_5) + "\"]");
    if (input_6 && document.activeElement !== input_6) input_6.value = isRemoteImageUrl(src_4) ? src_4 : "";
  }
  function resolveWidgetType(widgetId_6) {
    const state_4 = getDesktopState();
    return state_4 && state_4.widgets && state_4.widgets[widgetId_6] && state_4.widgets[widgetId_6].type || inferTypeFromId(widgetId_6);
  }
  function inferTypeFromId(value_124) {
    const id_2 = value_124 || "";
    if (id_2.includes("profile")) return "profile";
    if (id_2.includes("pet")) return "pet";
    if (id_2.includes("music")) return "music";
    if (id_2.includes("couple")) return "couple";
    if (id_2.includes("notification")) return "notification";
    if (id_2.includes("social-post") || id_2.includes("socialPost")) return "socialPost";
    return "photo";
  }
  function getWidgetConfig(widgetId_7, widgetType_3) {
    const type_3 = widgetType_3 || resolveWidgetType(widgetId_7) || "photo",
      state_5 = getDesktopState(),
      current = state_5 && state_5.widgets && state_5.widgets[widgetId_7] ? state_5.widgets[widgetId_7] : {};
    return {
      type: type_3,
      color: current.color || WIDGET_DEFAULTS[type_3] && WIDGET_DEFAULTS[type_3].color || "rgba(255,255,255,0.7)",
      text: Object.assign({}, WIDGET_TEXT_DEFAULTS, current.text || {}),
      images: Object.assign({}, current.images || {})
    };
  }
  function getWidgetTextValue(config_4, field_6) {
    return String(config_4 && config_4.text && config_4.text[field_6] || WIDGET_TEXT_DEFAULTS[field_6] || "");
  }
  function getWidgetImageValue(config_5, field_7) {
    return config_5 && config_5.images && config_5.images[field_7] || "";
  }
  function setWidgetText(widgetId_8, field_8, value_4) {
    const config_6 = getWidgetConfig(widgetId_8);
    config_6.text[field_8] = value_4;
    updateWidgetConfig(widgetId_8, {
      text: config_6.text
    });
  }
  function setWidgetImage(widgetId_9, field_9, value_5) {
    const config_7 = getWidgetConfig(widgetId_9);
    config_7.images[field_9] = value_5;
    updateWidgetConfig(widgetId_9, {
      images: config_7.images
    });
  }
  function updateWidgetConfig(widgetId_10, patch) {
    if (!widgetId_10 || !patch) return null;
    if (typeof window.updateHomeWidgetConfigFromPanel === "function") return window.updateHomeWidgetConfigFromPanel(widgetId_10, patch);
    const state_6 = getDesktopState();
    if (!state_6 || !state_6.widgets) return null;
    const type_4 = patch.type || resolveWidgetType(widgetId_10) || "photo",
      current_2 = state_6.widgets[widgetId_10] || {},
      next_4 = Object.assign({}, current_2, patch, {
        type: current_2.type || type_4,
        text: Object.assign({}, WIDGET_TEXT_DEFAULTS, current_2.text || {}, patch.text || {}),
        images: Object.assign({}, current_2.images || {}, patch.images || {})
      });
    state_6.widgets[widgetId_10] = next_4;
    bindScrollFriendlyLibraryTouch_2(state_6);
    if (typeof window.renderHomeDesktop === "function") window.renderHomeDesktop();
    return next_4;
  }
  function setImageThumb(thumb_3, src_5) {
    if (!thumb_3) return;
    const value_6 = src_5 || "";
    if (thumb_3.dataset.thumbSrc === value_6) return;
    thumb_3.dataset.thumbSrc = value_6;
    thumb_3.innerHTML = "";
    if (value_6) {
      const img = document.createElement("img");
      img.src = value_6;
      img.alt = "";
      thumb_3.appendChild(img);
    } else {
      const icon = document.createElement("i");
      icon.className = "fas fa-image";
      thumb_3.appendChild(icon);
    }
  }
  function isRemoteImageUrl(value_7) {
    return /^https?:\/\//i.test(String(value_7 || "").trim());
  }
  function readWidgetImage(value_152) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function (event_9) {
        const raw = event_9.target && event_9.target.result;
        if (!raw || typeof raw !== "string") {
          reject(new Error("Failed to read image"));
          return;
        }
        window.compressImage ? window.compressImage(raw, 512, 512, resolve) : resolve(raw);
      };
      reader.onerror = function () {
        reject(new Error("Failed to read image"));
      };
      reader.readAsDataURL(value_152);
    });
  }
  function cssEscape(value_8) {
    if (window.CSS && typeof window.CSS.escape === "function") return window.CSS.escape(value_8);
    return String(value_8).replace(/["\\]/g, "\\$&");
  }
  function getWidgetAlpha(widgetId_11, widgetType_4) {
    const state_7 = getDesktopState(),
      savedColor = state_7 && state_7.widgets && state_7.widgets[widgetId_11] && state_7.widgets[widgetId_11].color,
      color_2 = savedColor || WIDGET_DEFAULTS[widgetType_4] && WIDGET_DEFAULTS[widgetType_4].color || "rgba(255,255,255,0.7)";
    return parseColor(color_2).a;
  }
  function handleAction_13(widgetId_12, widgetType_5, alpha_4) {
    const desktopState_166 = getDesktopState();
    if (!desktopState_166 || !desktopState_166.widgets) return;
    const current_3 = desktopState_166.widgets[widgetId_12] || {},
      defaultColor_2 = WIDGET_DEFAULTS[widgetType_5] && WIDGET_DEFAULTS[widgetType_5].color || "rgba(255,255,255,0.7)",
      parsed_2 = parseColor(current_3.color || defaultColor_2),
      color_3 = "rgba(" + parsed_2.r + ", " + parsed_2.g + ", " + parsed_2.b + ", " + roundAlpha(alpha_4) + ")";
    updateWidgetConfig(widgetId_12, {
      type: current_3.type || widgetType_5,
      color: color_3
    });
    applyWidgetColor(widgetId_12, widgetType_5, color_3);
  }
  function resetWidgetAlpha(widgetId_13, widgetType_6) {
    const state_8 = getDesktopState();
    if (!state_8 || !state_8.widgets) return;
    const defaultColor = WIDGET_DEFAULTS[widgetType_6] && WIDGET_DEFAULTS[widgetType_6].color || "rgba(255,255,255,0.7)";
    updateWidgetConfig(widgetId_13, {
      type: state_8.widgets[widgetId_13] && state_8.widgets[widgetId_13].type || widgetType_6,
      color: defaultColor
    });
    applyWidgetColor(widgetId_13, widgetType_6, defaultColor);
  }
  function applyWidgetColor(widgetId_14, widgetType_7, backgroundColor_2) {
    const widget = document.getElementById(widgetId_14);
    if (!widget) return;
    if (["profile", "music", "photo", "notification", "socialPost", "html"].includes(widgetType_7)) {
      widget.style.backgroundColor = backgroundColor_2;
      return;
    }
    if (widgetType_7 === "pet") {
      const petSurface = widget.querySelector(".pet-widget-img-wrapper");
      if (petSurface) petSurface.style.backgroundColor = backgroundColor_2;
      return;
    }
    widgetType_7 === "couple" && widget.querySelectorAll(".couple-img-wrapper, .couple-bubble").forEach(function (el) {
      el.style.backgroundColor = backgroundColor_2;
    });
  }
  function parseColor(color_4) {
    const fallback = {
      r: 255,
      g: 255,
      b: 255,
      a: 0.7
    };
    if (!color_4 || typeof color_4 !== "string") return fallback;
    const rgba = color_4.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i);
    if (rgba) return {
      r: clampColor(rgba[1]),
      g: clampColor(rgba[2]),
      b: clampColor(rgba[3]),
      a: rgba[4] === undefined ? 1 : Math.max(0, Math.min(1, Number(rgba[4]) || 0))
    };
    const hex = color_4.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hex) {
      let value_9 = hex[1];
      if (value_9.length === 3) value_9 = value_9.split("").map(function (ch) {
        return ch + ch;
      }).join("");
      return {
        r: parseInt(value_9.slice(0, 2), 16),
        g: parseInt(value_9.slice(2, 4), 16),
        b: parseInt(value_9.slice(4, 6), 16),
        a: 1
      };
    }
    return fallback;
  }
  function clampColor(value_10) {
    return Math.max(0, Math.min(255, Math.round(Number(value_10) || 0)));
  }
  function roundAlpha(value_11) {
    return Math.max(0, Math.min(1, Number(value_11))).toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  }
})();
