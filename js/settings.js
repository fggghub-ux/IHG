(function () {
  const scopeValue0 = "assets/default-user-avatar.jpg";
  window.U2_DEFAULT_USER_AVATAR_URL = scopeValue0;
  let scopeValue1 = [],
    scopeValue2 = null,
    scopeValue3 = {
      name: "",
      phone: "",
      persona: "",
      avatarUrl: null
    };
  function scopeValue4(scopeValue29) {
    if (typeof structuredClone === "function") return structuredClone(scopeValue29);
    return JSON.parse(JSON.stringify(scopeValue29));
  }
  function scopeValue5() {
    const scopeValue30 = scopeValue1.find(scopeValue31 => String(scopeValue31.id) === String(scopeValue2));
    return scopeValue30 ? (scopeValue3.name = scopeValue30.name || "", scopeValue3.phone = scopeValue30.phone || "", scopeValue3.persona = scopeValue30.persona || "", scopeValue3.signature = scopeValue30.signature || "", scopeValue3.avatarUrl = scopeValue30.avatarUrl || null) : (scopeValue3.name = "", scopeValue3.phone = "", scopeValue3.persona = "", scopeValue3.signature = "", scopeValue3.avatarUrl = null), window.userState = scopeValue3, scopeValue3;
  }
  function scopeValue6(scopeValue32 = {}) {
    window.userState = scopeValue3;
    const scopeValue33 = {
      userState: scopeValue4(scopeValue3),
      ...scopeValue32
    };
    window.dispatchEvent(new CustomEvent("user-state-updated", {
      detail: scopeValue33
    }));
    scopeValue32.avatarChanged && window.dispatchEvent(new CustomEvent("avatar-updated", {
      detail: scopeValue33
    }));
  }
  function scopeValue7() {
    window.getAccounts = () => scopeValue1;
    window.getCurrentAccountId = () => scopeValue2;
    window.setCurrentAccountId = scopeValue34 => {
      return scopeValue2 = scopeValue34, scopeValue5(), scopeValue9({
        immediate: true
      }), scopeValue6({
        avatarChanged: true
      }), scopeValue2;
    };
  }
  let scopeValue8 = null;
  function scopeValue9({
    immediate: scopeValue35 = false
  } = {}) {
    scopeValue5();
    if (!window.appStorage?.commitDomain) return Promise.resolve(false);
    if (scopeValue35) return scopeValue8 && (clearTimeout(scopeValue8), scopeValue8 = null), scopeValue10();
    return new Promise(scopeValue36 => {
      if (scopeValue8) clearTimeout(scopeValue8);
      scopeValue8 = setTimeout(() => {
        scopeValue8 = null;
        scopeValue10().then(scopeValue36);
      }, 300);
    });
  }
  function scopeValue10() {
    return window.appStorage.commitDomain("settings", scopeValue37 => {
      const scopeValue38 = scopeValue4(scopeValue27);
      if (scopeValue38.bgAssetId && /^blob:/i.test(scopeValue38.bgUrl || "")) scopeValue38.bgUrl = null;
      scopeValue38.apps?.forEach(scopeValue40 => {
        if (scopeValue40.iconAssetId && /^blob:/i.test(scopeValue40.icon || "")) scopeValue40.icon = null;
      });
      const scopeValue39 = {
        ...scopeValue37,
        userState: scopeValue4(scopeValue3),
        accounts: scopeValue4(scopeValue1),
        currentAccountId: scopeValue2,
        apiConfig: scopeValue4(scopeValue11),
        vectorMemoryConfig: scopeValue4(scopeValue12),
        visionConfig: scopeValue4(scopeValue14),
        imageGenerationConfig: scopeValue4(scopeValue13),
        ttsConfig: scopeValue4(scopeValue15),
        apiPresets: scopeValue4(scopeValue16),
        imageGenerationPresets: scopeValue4(newScope16),
        ttsPresets: scopeValue4(newScope17),
        fetchedModels: scopeValue4(scopeValue17),
        assistiveBallSettings: scopeValue4(scopeValue19),
        themeState: scopeValue38
      };
      delete scopeValue39.minimaxConfig;
      return scopeValue39;
    }, {
      critical: true,
      reason: "settings-update"
    })["catch"](scopeValue41 => {
      console.warn("Failed to persist settings:", scopeValue41);
      return false;
    });
  }
  scopeValue7();
  let scopeValue11 = {
      provider: "openai-compatible",
      endpoint: "",
      apiKey: "",
      model: "",
      temperature: 0.7,
      frequencyPenalty: 0,
      maxTokens: null,
      streamEnabled: false
    },
    scopeValue12 = window.getVectorMemoryConfig ? window.getVectorMemoryConfig() : window.vectorMemoryConfig || {},
    scopeValue13 = window.u2ImageGeneration ? window.u2ImageGeneration.normalizeConfig(window.imageGenerationConfig) : window.imageGenerationConfig || {
      activeProvider: "gemini",
      providers: {}
    },
    scopeValue14 = window.u2ImageUnderstanding ? window.u2ImageUnderstanding.normalizeConfig(window.visionConfig) : window.getVisionConfig ? window.getVisionConfig() : window.visionConfig || {
      activeProvider: "gemini",
      providers: {}
    },
    scopeValue15 = window.u2Tts ? window.u2Tts.getConfig() : window.getTtsConfig ? window.getTtsConfig() : window.ttsConfig || {
      activeProvider: "minimax",
      providers: {}
    },
    scopeValue16 = [],
    newScope16 = [],
    newScope17 = [],
    scopeValue17 = [];
  window.getApiPresets = function scopeValue42() {
    return scopeValue4(Array.isArray(scopeValue16) ? scopeValue16 : []);
  };
  function scopeValue18() {
    window.dispatchEvent(new CustomEvent("u2:api-presets-updated", {
      detail: {
        presets: window.getApiPresets()
      }
    }));
  }
  let scopeValue19 = {
      enabled: false,
      x: null,
      y: null,
      size: 58,
      opacity: 0.72,
      imageUrl: ""
    },
    scopeValue20 = {};
  const scopeValue21 = "system-ui, -apple-system, BlinkMacSystemFont, \"PingFang SC\", sans-serif",
    scopeValue22 = ["home", "bubble", "chat", "group", "status"],
    scopeValue23 = [{
      key: "system-default",
      label: "默认",
      cssName: "",
      family: scopeValue21,
      sources: {
        woff2: "",
        woff: "",
        ttf: "",
        otf: ""
      }
    }];
  const scopeValue24 = "assets/app-icons/";
  const scopeValue25 = {
    "app-icon-1": scopeValue24 + "pay.jpg",
    "app-icon-2": scopeValue24 + "tiktok.jpg",
    "app-icon-3": scopeValue24 + "bstage.jpg",
    "app-icon-4": scopeValue24 + "x.jpg",
    "app-icon-5": scopeValue24 + "shop.jpg",
    "app-icon-6": scopeValue24 + "library.jpg",
    "app-icon-7": scopeValue24 + "netflix.jpg",
    "app-icon-8": scopeValue24 + "lover.jpg",
    "app-icon-9": scopeValue24 + "appstore.jpg",
    "app-icon-10": scopeValue24 + "gallery.jpg",
    "app-icon-11": scopeValue24 + "mcp.jpg",
    "app-icon-12": scopeValue24 + "ao3.jpg",
    "app-icon-13": scopeValue24 + "diary.jpg",
    "app-icon-14": scopeValue24 + "call.jpg",
    "app-icon-15": scopeValue24 + "cphone.jpg",
    "app-icon-16": scopeValue24 + "cycle.jpg",
    "app-icon-17": scopeValue24 + "treasure.jpg",
    "dock-icon-settings": scopeValue24 + "settings.jpg",
    "dock-icon-imessage": scopeValue24 + "imessage.jpg",
    "dock-icon-youtube": scopeValue24 + "youtube.jpg"
  };
  function scopeValue26(scopeValue43) {
    return Object.values(scopeValue25).find(scopeValue44 => scopeValue43 === scopeValue44 + ".jpg") || scopeValue43;
  }
  let scopeValue27 = {
    bgUrl: null,
    uiChineseEnabled: false,
    apps: [{
      id: "app-icon-1",
      name: "Pay",
      icon: scopeValue25["app-icon-1"]
    }, {
      id: "app-icon-2",
      name: "TikTok",
      icon: scopeValue25["app-icon-2"]
    }, {
      id: "app-icon-3",
      name: "b.stage",
      icon: scopeValue25["app-icon-3"]
    }, {
      id: "app-icon-4",
      name: "X",
      icon: scopeValue25["app-icon-4"]
    }, {
      id: "app-icon-5",
      name: "Shop",
      icon: scopeValue25["app-icon-5"]
    }, {
      id: "app-icon-6",
      name: "Library",
      icon: scopeValue25["app-icon-6"]
    }, {
      id: "app-icon-7",
      name: "Netflix",
      icon: scopeValue25["app-icon-7"]
    }, {
      id: "app-icon-8",
      name: "Loves",
      icon: scopeValue25["app-icon-8"]
    }, {
      id: "app-icon-9",
      name: "App Store",
      icon: scopeValue25["app-icon-9"]
    }, {
      id: "app-icon-10",
      name: "Gallery",
      icon: scopeValue25["app-icon-10"]
    }, {
      id: "app-icon-11",
      name: "MCP",
      icon: scopeValue25["app-icon-11"]
    }, {
      id: "app-icon-12",
      name: "AO3",
      icon: scopeValue25["app-icon-12"]
    }, {
      id: "app-icon-13",
      name: "Diary",
      icon: scopeValue25["app-icon-13"]
    }, {
      id: "app-icon-14",
      name: "call",
      icon: scopeValue25["app-icon-14"]
    }, {
      id: "app-icon-15",
      name: "Cphone",
      icon: scopeValue25["app-icon-15"]
    }, {
      id: "app-icon-16",
      name: "Cycle",
      icon: scopeValue25["app-icon-16"]
    }, {
      id: "app-icon-17",
      name: "Treasure",
      icon: scopeValue25["app-icon-17"]
    }, {
      id: "dock-icon-settings",
      name: "设置",
      icon: scopeValue25["dock-icon-settings"]
    }, {
      id: "dock-icon-imessage",
      name: "信息",
      icon: scopeValue25["dock-icon-imessage"]
    }, {
      id: "dock-icon-youtube",
      name: "YouTube",
      icon: scopeValue25["dock-icon-youtube"]
    }],
    fontMode: "preset",
    fontPresetKey: "system-default",
    fontFamily: scopeValue21,
    fontCssName: "",
    fontSize: 16,
    fontSources: {
      woff2: "",
      woff: "",
      ttf: "",
      otf: ""
    },
    fontSourceType: "preset",
    fontAssetId: "",
    fontFormat: "",
    savedFontPresets: [],
    imessageCssPresets: {
      home: [],
      bubble: [],
      chat: [],
      group: [],
      status: []
    },
    imessageStatusTemplatePresets: [],
    imessageHomeCssEnabled: false,
    imessageHomeCss: "",
    imessageChatCssEnabled: false,
    imessageChatCss: "",
    imessageGroupCssEnabled: false,
    imessageGroupCss: ""
  };
  window.u2ThemeState = scopeValue27;
  let scopeValue28 = false;
  (window.u2OnStorageReady || (scopeValue45 => document.addEventListener("DOMContentLoaded", scopeValue45)))(async () => {
    let scopeValue46 = null;
    try {
      await window.appStorage?.ready;
      scopeValue46 = typeof window.appStorage?.readDomain === "function" ? window.appStorage.readDomain("settings", {}) : null;
    } catch (scopeValue504) {
      console.warn("Failed to hydrate settings from IndexedDB:", scopeValue504);
    }
    let scopeValue47 = false,
      scopeValue48 = false;
    if (scopeValue46 && typeof scopeValue46 === "object") {
      scopeValue11 = {
        ...scopeValue11,
        ...(scopeValue46.apiConfig || {})
      };
      scopeValue11 = window.u2Api.sanitizeApiConfig(scopeValue11);
      if (scopeValue11.endpoint) try {
        scopeValue11.endpoint = window.u2Api.normalizeApiEndpoint(scopeValue11.endpoint, scopeValue11.provider);
      } catch (scopeValue507) {
        console.warn("Saved API endpoint is invalid:", scopeValue507);
      }
      scopeValue12 = window.u2Api?.normalizeVectorMemoryConfig ? window.u2Api.normalizeVectorMemoryConfig(scopeValue46.vectorMemoryConfig || scopeValue12) : {
        ...scopeValue12,
        ...(scopeValue46.vectorMemoryConfig || {})
      }, scopeValue13 = window.u2ImageGeneration ? window.u2ImageGeneration.normalizeConfig(scopeValue46.imageGenerationConfig || scopeValue13) : scopeValue46.imageGenerationConfig || scopeValue13, scopeValue14 = window.u2ImageUnderstanding ? window.u2ImageUnderstanding.normalizeConfig(scopeValue46.visionConfig || scopeValue14) : scopeValue46.visionConfig || scopeValue14, scopeValue48 = !scopeValue46.ttsConfig && !!scopeValue46.minimaxConfig, scopeValue15 = window.u2Tts ? window.u2Tts.normalizeConfig(scopeValue46.ttsConfig || scopeValue46.minimaxConfig || scopeValue15) : scopeValue46.ttsConfig || scopeValue46.minimaxConfig || scopeValue15, scopeValue16 = Array.isArray(scopeValue46.apiPresets) ? scopeValue46.apiPresets : [], newScope16 = window.u2ConfigPresets.normalizePresets(scopeValue46.imageGenerationPresets), newScope17 = window.u2ConfigPresets.normalizePresets(scopeValue46.ttsPresets), scopeValue17 = Array.isArray(scopeValue46.fetchedModels) ? scopeValue46.fetchedModels : [], scopeValue19 = {
        ...scopeValue19,
        ...(scopeValue46.assistiveBallSettings || {})
      };
      scopeValue1 = Array.isArray(scopeValue46.accounts) ? scopeValue46.accounts : [];
      scopeValue2 = scopeValue46.currentAccountId ?? null;
      const scopeValue505 = scopeValue46.userState;
      scopeValue505 && typeof scopeValue505 === "object" && (scopeValue3 = {
        ...scopeValue3,
        ...scopeValue505
      });
      scopeValue2 && scopeValue5();
      const scopeValue506 = scopeValue46.themeState;
      scopeValue506 && (Array.isArray(scopeValue506.apps) && (scopeValue506.apps.forEach(scopeValue508 => {
        const scopeValue509 = scopeValue27.apps.find(scopeValue510 => scopeValue510.id === scopeValue508.id);
        if (scopeValue509) {
          scopeValue509.icon = scopeValue508.icon || scopeValue25[scopeValue508.id] || null;
          scopeValue509.iconAssetId = scopeValue508.iconAssetId || "";
          if (scopeValue508.id === "app-icon-6") scopeValue509.name = "Library";else {
            if (scopeValue508.id === "app-icon-10") scopeValue509.name = "Gallery";else scopeValue508.id === "app-icon-8" && scopeValue508.name === "Diary" ? scopeValue509.name = "Loves" : scopeValue509.name = scopeValue508.name || scopeValue509.name;
          }
        } else scopeValue27.apps.push(scopeValue508);
      }), delete scopeValue506.apps), scopeValue27 = {
        ...scopeValue27,
        ...scopeValue506
      });
      scopeValue27.uiChineseEnabled = scopeValue27.uiChineseEnabled === true;
      scopeValue27.imessageHomeCssEnabled = scopeValue27.imessageHomeCssEnabled === true;
      scopeValue27.imessageHomeCss = typeof scopeValue27.imessageHomeCss === "string" ? scopeValue27.imessageHomeCss : "";
      scopeValue27.imessageCssPresets = scopeValue101(scopeValue27.imessageCssPresets);
      scopeValue27.imessageStatusTemplatePresets = scopeValue102(scopeValue27.imessageStatusTemplatePresets);
      scopeValue22.forEach(scopeValue511 => {
        if (scopeValue27.imessageCssPresets[scopeValue511].length > 0) return;
        const scopeValue512 = window.appStorage?.loadLegacyKey ? window.appStorage.loadLegacyKey("u2_theme_" + scopeValue511 + "Presets", []) : [],
          scopeValue513 = scopeValue101({
            [scopeValue511]: scopeValue512
          })[scopeValue511];
        scopeValue513.length > 0 && (scopeValue27.imessageCssPresets[scopeValue511] = scopeValue513, scopeValue47 = true);
      });
      window.u2ThemeState = scopeValue27;
      await scopeValue261();
      scopeValue84();
    }
    await newScope275(), scopeValue27.uiChineseEnabled = scopeValue27.uiChineseEnabled === true, window.u2ThemeState = scopeValue27, window.u2UiTranslation?.["setEnabled"](scopeValue27.uiChineseEnabled);
    (scopeValue47 || scopeValue48) && (await scopeValue9());
    window.apiConfig = scopeValue11;
    window.vectorMemoryConfig = scopeValue12;
    window.visionConfig = scopeValue14;
    window.imageGenerationConfig = scopeValue13;
    window.u2Tts && typeof window.u2Tts.setConfig === "function" ? scopeValue15 = window.u2Tts.setConfig(scopeValue15) : window.ttsConfig = scopeValue15;
    window.userState = scopeValue3;
    scopeValue7();
    scopeValue6({
      avatarChanged: true,
      source: "settings-hydration"
    });
    UI.views.settings = document.getElementById("settings-view");
    UI.views.edit = document.getElementById("edit-view");
    UI.overlays.accountSwitcher = document.getElementById("account-sheet-overlay");
    UI.overlays.personaDetail = document.getElementById("persona-detail-sheet");
    UI.overlays.aboutDevice = document.getElementById("about-device-sheet");
    UI.lists.accounts = document.getElementById("account-list");
    UI.inputs = {
      detailName: document.getElementById("detail-name-input"),
      detailPhone: document.getElementById("detail-phone-input"),
      detailSignature: document.getElementById("detail-signature-input"),
      detailPersona: document.getElementById("detail-persona-input"),
      detailAvatarImg: document.getElementById("detail-avatar-img"),
      detailAvatarIcon: document.querySelector("#user-detail-avatar-wrapper .fa-user"),
      apiProvider: document.getElementById("api-provider-select"),
      apiProviderHint: document.getElementById("api-provider-hint"),
      apiEndpoint: document.getElementById("api-endpoint-input"),
      apiKey: document.getElementById("api-key-input"),
      apiModel: document.getElementById("api-model-select"),
      apiModelPickerToggle: document.getElementById("api-model-picker-toggle"),
      apiModelPicker: document.getElementById("api-model-picker"),
      apiModelSearch: document.getElementById("api-model-search-input"),
      apiModelList: document.getElementById("api-model-list"),
      apiTemp: document.getElementById("api-temp-input"),
      apiStream: document.getElementById("api-stream-enabled"),
      apiMaxTokens: document.getElementById("api-max-tokens-input"),
      apiFrequencyPenalty: document.getElementById("api-frequency-penalty-input"),
      vectorMemoryEnabled: document.getElementById("vector-memory-enabled-toggle"),
      vectorMemoryProvider: document.getElementById("vector-memory-provider-select"),
      vectorMemoryEndpoint: document.getElementById("vector-memory-endpoint-input"),
      vectorMemoryApiKey: document.getElementById("vector-memory-api-key-input"),
      vectorMemoryModel: document.getElementById("vector-memory-model-select"),
      vectorMemoryCustomModel: document.getElementById("vector-memory-custom-model-input"),
      vectorMemoryCustomModelRow: document.getElementById("vector-memory-custom-model-row"),
      vectorMemoryCustomEndpointRow: document.getElementById("vector-memory-custom-endpoint-row"),
      vectorMemoryIndexStatus: document.getElementById("vector-memory-index-status"),
      visionProvider: document.getElementById("vision-provider-select"),
      visionEndpoint: document.getElementById("vision-endpoint-input"),
      visionApiKey: document.getElementById("vision-key-input"),
      visionModel: document.getElementById("vision-model-input"),
      visionModelSelect: document.getElementById("vision-model-select"),
      visionKeyLabel: document.getElementById("vision-key-label"),
      visionEndpointHint: document.getElementById("vision-endpoint-hint"),
      imageProvider: document.getElementById("image-generation-provider-select"),
      imageEndpoint: document.getElementById("image-generation-endpoint-input"),
      imageApiKey: document.getElementById("image-generation-key-input"),
      imageModel: document.getElementById("image-generation-model-input"),
      imageModelSelect: document.getElementById("image-generation-model-select"),
      imageSize: document.getElementById("image-generation-size-select"),
      imageKeyLabel: document.getElementById("image-generation-key-label"),
      imageEndpointHint: document.getElementById("image-generation-endpoint-hint"),
      bgActivityToggle: document.getElementById("bg-activity-toggle"),
      systemNotificationToggle: document.getElementById("system-notification-toggle"),
      notificationSettingsGroup: document.getElementById("notification-settings-group"),
      notificationSoundSettings: document.getElementById("notification-sound-settings"),
      notificationSoundFileName: document.getElementById("notification-sound-file-name"),
      notificationSoundUploadBtn: document.getElementById("notification-sound-upload-btn"),
      notificationSoundUploadLabel: document.getElementById("notification-sound-upload-label"),
      notificationSoundFileInput: document.getElementById("notification-sound-file-input"),
      notificationSoundActions: document.getElementById("notification-sound-actions"),
      notificationSoundPreviewBtn: document.getElementById("notification-sound-preview-btn"),
      notificationSoundRemoveBtn: document.getElementById("notification-sound-remove-btn"),
      ttsProvider: document.getElementById("tts-provider-select"),
      ttsEndpoint: document.getElementById("tts-endpoint-input"),
      ttsApiKey: document.getElementById("tts-key-input"),
      ttsModel: document.getElementById("tts-model-input"),
      ttsModelSelect: document.getElementById("tts-model-select"),
      ttsKeyLabel: document.getElementById("tts-key-label"),
      ttsModelLabel: document.getElementById("tts-model-label"),
      ttsModelSelectLabel: document.getElementById("tts-model-select-label"),
      ttsExtraFields: document.getElementById("tts-provider-extra-fields"),
      ttsEndpointHint: document.getElementById("tts-endpoint-hint"),
      presetName: document.getElementById("preset-name-input")
    };
    UI.lists.presets = document.getElementById("preset-list");
    UI.overlays.apiConfig = document.getElementById("api-config-sheet");
    UI.overlays.vectorMemoryConfig = document.getElementById("vector-memory-config-sheet");
    UI.overlays.visionConfig = document.getElementById("vision-config-sheet");
    UI.overlays.imageGenerationConfig = document.getElementById("image-generation-config-sheet");
    UI.overlays.ttsConfig = document.getElementById("tts-config-sheet");
    UI.overlays.savePreset = document.getElementById("save-preset-name-sheet");
    UI.overlays.loadPreset = document.getElementById("load-preset-list-sheet");
    UI.overlays.assistiveBallSettings = document.getElementById("assistive-ball-settings-sheet");
    UI.inputs.assistiveBallToggle = document.getElementById("assistive-ball-toggle");
    UI.inputs.assistiveBallOpacity = document.getElementById("assistive-ball-opacity-range");
    UI.inputs.assistiveBallOpacityValue = document.getElementById("assistive-ball-opacity-value");
    UI.inputs.assistiveBallSize = document.getElementById("assistive-ball-size-range");
    UI.inputs.assistiveBallSizeValue = document.getElementById("assistive-ball-size-value");
    UI.inputs.assistiveBallImageUrl = document.getElementById("assistive-ball-image-url-input");
    UI.inputs.assistiveBallImageUrlApply = document.getElementById("assistive-ball-image-url-apply-btn");
    UI.inputs.assistiveBallImageUpload = document.getElementById("assistive-ball-image-upload-btn");
    UI.inputs.assistiveBallImageFile = document.getElementById("assistive-ball-image-file-input");
    UI.inputs.assistiveBallImageReset = document.getElementById("assistive-ball-image-reset-btn");
    function scopeValue49() {
      openView(UI.overlays.apiConfig);
    }
    function newScope46() {
      scopeValue438(false), closeView(UI.overlays.apiConfig);
    }
    function scopeValue51() {
      closeView(UI.overlays.vectorMemoryConfig);
    }
    UI.overlays.apiConfig && UI.overlays.apiConfig.addEventListener("click", scopeValue514 => {
      scopeValue514.target === UI.overlays.apiConfig && (scopeValue514.stopPropagation(), newScope46());
    });
    UI.overlays.vectorMemoryConfig && UI.overlays.vectorMemoryConfig.addEventListener("click", scopeValue515 => {
      scopeValue515.target === UI.overlays.vectorMemoryConfig && (scopeValue515.stopPropagation(), scopeValue51());
    });
    UI.overlays.visionConfig && UI.overlays.visionConfig.addEventListener("click", scopeValue516 => {
      scopeValue516.target === UI.overlays.visionConfig && (scopeValue516.stopPropagation(), closeView(UI.overlays.visionConfig));
    });
    UI.overlays.imageGenerationConfig && UI.overlays.imageGenerationConfig.addEventListener("click", scopeValue517 => {
      scopeValue517.target === UI.overlays.imageGenerationConfig && (scopeValue517.stopPropagation(), closeView(UI.overlays.imageGenerationConfig));
    });
    const scopeValue52 = document.getElementById("dock-icon-settings");
    scopeValue52 && scopeValue52.addEventListener("click", scopeValue518 => {
      syncUIs();
      openView(UI.views.settings);
    });
    const scopeValue53 = document.getElementById("settings-title-back-btn");
    scopeValue53 && scopeValue53.addEventListener("click", () => closeView(UI.views.settings));
    const scopeValue54 = document.getElementById("about-device-btn"),
      scopeValue55 = document.getElementById("about-device-sheet"),
      scopeValue56 = document.getElementById("about-device-close-btn"),
      scopeValue57 = document.getElementById("about-device-disclaimer-btn"),
      scopeValue58 = document.getElementById("about-device-changelog-btn");
    scopeValue54 && scopeValue55 && scopeValue54.addEventListener("click", () => {
      const scopeValue519 = document.getElementById("about-device-app-name");
      if (scopeValue519) scopeValue519.textContent = "LHV";
      openView(scopeValue55);
    });
    scopeValue56 && scopeValue55 && scopeValue56.addEventListener("click", () => closeView(scopeValue55));
    scopeValue57?.addEventListener("click", () => window.u2AboutInfoModal?.open("disclaimer"));
    scopeValue58?.addEventListener("click", () => window.u2AboutInfoModal?.open("changelog"));
    const scopeValue59 = document.getElementById("data-management-btn"),
      scopeValue60 = document.getElementById("data-management-sheet"),
      scopeValue61 = document.getElementById("data-management-close-btn"),
      scopeValue62 = document.getElementById("u2-auth-sign-out-btn");
    scopeValue59 && scopeValue60 && scopeValue59.addEventListener("click", () => {
      openView(scopeValue60);
    });
    scopeValue61 && scopeValue60 && scopeValue61.addEventListener("click", () => closeView(scopeValue60));
    scopeValue62?.addEventListener("click", async () => {
      scopeValue62.disabled = true;
      try {
        if (scopeValue60) closeView(scopeValue60);
        await window.u2Auth?.logout();
      } catch (scopeValue520) {
        console.error("[auth] Failed to sign out:", scopeValue520);
      } finally {
        scopeValue62.disabled = false;
      }
    });
    const scopeValue63 = document.getElementById("apple-id-trigger");
    scopeValue63 && scopeValue63.addEventListener("click", scopeValue521 => {
      scopeValue521.stopPropagation();
      syncUIs();
      openView(UI.views.edit);
    });
    const scopeValue64 = document.getElementById("edit-back-btn");
    scopeValue64 && scopeValue64.addEventListener("click", () => closeView(UI.views.edit));
    function scopeValue65(scopeValue522, scopeValue523 = {}) {
      return new Promise((scopeValue524, scopeValue525) => {
        if (!scopeValue522) {
          scopeValue525(new Error("No file selected"));
          return;
        }
        const {
            maxWidth: scopeValue526 = 1024,
            maxHeight: scopeValue527 = 1024,
            quality: scopeValue528 = 0.82,
            outputType: scopeValue529 = "image/jpeg"
          } = scopeValue523,
          scopeValue530 = new FileReader();
        scopeValue530.onload = scopeValue531 => {
          const scopeValue532 = scopeValue531?.target?.result;
          if (!scopeValue532 || typeof scopeValue532 !== "string") {
            scopeValue525(new Error("Failed to read file"));
            return;
          }
          const scopeValue533 = new Image();
          scopeValue533.onload = () => {
            let {
              width: scopeValue534,
              height: scopeValue535
            } = scopeValue533;
            if (!scopeValue534 || !scopeValue535) {
              scopeValue524(scopeValue532);
              return;
            }
            const scopeValue536 = scopeValue526 / scopeValue534,
              scopeValue537 = scopeValue527 / scopeValue535,
              scopeValue538 = Math.min(1, scopeValue536, scopeValue537),
              scopeValue539 = Math.max(1, Math.round(scopeValue534 * scopeValue538)),
              scopeValue540 = Math.max(1, Math.round(scopeValue535 * scopeValue538)),
              scopeValue541 = document.createElement("canvas");
            scopeValue541.width = scopeValue539;
            scopeValue541.height = scopeValue540;
            const scopeValue542 = scopeValue541.getContext("2d");
            if (!scopeValue542) {
              scopeValue524(scopeValue532);
              return;
            }
            scopeValue542.drawImage(scopeValue533, 0, 0, scopeValue539, scopeValue540);
            try {
              const scopeValue543 = scopeValue541.toDataURL(scopeValue529, scopeValue528);
              scopeValue524(scopeValue543 || scopeValue532);
            } catch (scopeValue544) {
              console.warn("Failed to compress image, using original data url.", scopeValue544);
              scopeValue524(scopeValue532);
            }
          };
          scopeValue533.onerror = () => scopeValue525(new Error("Failed to load image for compression"));
          scopeValue533.src = scopeValue532;
        };
        scopeValue530.onerror = () => scopeValue525(new Error("Failed to read file"));
        scopeValue530.readAsDataURL(scopeValue522);
      });
    }
    window.readImageAsCompressedDataUrl = scopeValue65;
    const scopeValue66 = document.getElementById("main-edit-avatar-wrapper"),
      scopeValue67 = document.getElementById("main-avatar-upload");
    scopeValue66 && scopeValue67 && (scopeValue66.addEventListener("click", scopeValue545 => {
      if (scopeValue545.target.tagName !== "INPUT") scopeValue67.click();
    }), scopeValue67.addEventListener("change", async scopeValue546 => {
      const scopeValue547 = scopeValue546.target.files[0];
      if (scopeValue547) try {
        const scopeValue548 = await scopeValue65(scopeValue547, {
          maxWidth: 256,
          maxHeight: 256,
          quality: 0.72
        });
        scopeValue3.avatarUrl = scopeValue548;
        const scopeValue549 = scopeValue1.find(scopeValue550 => scopeValue550.id === scopeValue2);
        scopeValue549 && (scopeValue549.avatarUrl = scopeValue548);
        const avatarSaved = await scopeValue9({ immediate: true });
        syncUIs();
        scopeValue6({
          avatarChanged: true
        });
        showToast(avatarSaved ? "头像已更新" : "头像已更新，但未能保存，请重试");
      } catch (scopeValue551) {
        console.error("Failed to process avatar upload", scopeValue551);
        showToast("头像处理失败");
      }
      scopeValue546.target.value = "";
    }));
    let scopeValue68 = false,
      scopeValue69 = null;
    const scopeValue70 = document.getElementById("switch-account-btn");
    scopeValue70 && scopeValue70.addEventListener("click", () => {
      scopeValue71();
      openView(UI.overlays.accountSwitcher);
    });
    function scopeValue71() {
      if (!UI.lists.accounts) return;
      UI.lists.accounts.innerHTML = "";
      scopeValue1.forEach(scopeValue552 => {
        const scopeValue553 = document.createElement("div");
        scopeValue553.className = "account-card " + (scopeValue552.id === scopeValue2 ? "selected" : "");
        scopeValue552.id === scopeValue2 && (scopeValue553.style.backgroundColor = "#e8f2ff");
        const scopeValue554 = scopeValue552.avatarUrl ? "<img src=\"" + scopeValue552.avatarUrl + "\" alt=\"\">" : "<i class=\"fas fa-user\"></i>";
        scopeValue553.innerHTML = `
                    <div class="account-content">
                        <div class="account-avatar">` + scopeValue554 + `</div>
                        <div class="account-info">
                            <div class="account-name">` + scopeValue552.name + `</div>
                            <div class="account-detail">` + (scopeValue552.phone || "No Phone") + `</div>
                        </div>
                        <i class="fas fa-times delete-icon"></i>
                    </div>
                `;
        scopeValue553.querySelector(".account-content").addEventListener("click", scopeValue555 => {
          if (scopeValue555.target.classList.contains("delete-icon") || scopeValue555.target.closest(".delete-icon")) return;
          scopeValue2 = scopeValue552.id;
          if (window.setCurrentAccountId) window.setCurrentAccountId(scopeValue552.id);
          scopeValue71();
          scopeValue68 = false;
          scopeValue69 = scopeValue552.id;
          UI.inputs.detailName.value = scopeValue552.name || "";
          UI.inputs.detailPhone.value = scopeValue552.phone || "";
          if (UI.inputs.detailSignature) UI.inputs.detailSignature.value = scopeValue552.signature || "";
          UI.inputs.detailPersona.value = scopeValue552.persona || "";
          scopeValue73(scopeValue552.avatarUrl);
          openView(UI.overlays.personaDetail);
        });
        scopeValue553.querySelector(".delete-icon").addEventListener("click", scopeValue556 => {
          scopeValue556.stopPropagation();
          if (confirm("Delete account \"" + scopeValue552.name + "\"?")) {
            scopeValue1 = scopeValue1.filter(scopeValue557 => scopeValue557.id !== scopeValue552.id);
            if (scopeValue2 === scopeValue552.id) {
              scopeValue2 = scopeValue1.length > 0 ? scopeValue1[0].id : null;
              if (window.setCurrentAccountId) window.setCurrentAccountId(scopeValue2);
              const scopeValue558 = scopeValue1.find(scopeValue559 => scopeValue559.id === scopeValue2);
              scopeValue3.name = scopeValue558?.name || "";
              scopeValue3.phone = scopeValue558?.phone || "";
              scopeValue3.persona = scopeValue558?.signature || scopeValue558?.persona || "";
              scopeValue3.avatarUrl = scopeValue558?.avatarUrl || null;
            }
            scopeValue381();
            syncUIs();
            scopeValue6({
              avatarChanged: true
            });
            scopeValue71();
          }
        });
        UI.lists.accounts.appendChild(scopeValue553);
      });
    }
    window.updateAccountById = function (scopeValue560, scopeValue561 = {}) {
      const scopeValue562 = scopeValue1.find(scopeValue565 => String(scopeValue565.id) === String(scopeValue560));
      if (!scopeValue562) return false;
      const scopeValue563 = scopeValue562.avatarUrl || null;
      if (typeof scopeValue561 === "function") scopeValue561(scopeValue562);else scopeValue561 && typeof scopeValue561 === "object" && Object.assign(scopeValue562, scopeValue561);
      const scopeValue564 = scopeValue563 !== (scopeValue562.avatarUrl || null);
      String(scopeValue2) === String(scopeValue562.id) && scopeValue5();
      scopeValue381();
      if (window.syncUIs) window.syncUIs();
      return window.dispatchEvent(new CustomEvent("account-updated", {
        detail: {
          account: scopeValue4(scopeValue562),
          accountId: scopeValue562.id,
          avatarChanged: scopeValue564
        }
      })), scopeValue6({
        avatarChanged: scopeValue564
      }), scopeValue71(), true;
    };
    document.getElementById("add-account-btn")?.addEventListener("click", () => {
      scopeValue68 = true;
      scopeValue69 = Date.now();
      UI.inputs.detailName.value = "";
      UI.inputs.detailPhone.value = "";
      if (UI.inputs.detailSignature) UI.inputs.detailSignature.value = "";
      UI.inputs.detailPersona.value = "";
      scopeValue73(null);
      openView(UI.overlays.personaDetail);
    });
    document.getElementById("save-id-btn")?.addEventListener("click", () => {
      const scopeValue566 = scopeValue1.find(scopeValue567 => scopeValue567.id === scopeValue2);
      scopeValue566 ? (scopeValue3.name = scopeValue566.name, scopeValue3.phone = scopeValue566.phone, scopeValue3.persona = scopeValue566.persona, scopeValue3.signature = scopeValue566.signature, scopeValue3.avatarUrl = scopeValue566.avatarUrl) : (scopeValue3.name = "", scopeValue3.phone = "", scopeValue3.persona = "", scopeValue3.signature = "", scopeValue3.avatarUrl = null);
      scopeValue381();
      syncUIs();
      scopeValue6({
        avatarChanged: true
      });
      closeView(UI.overlays.accountSwitcher);
    });
    document.getElementById("confirm-sync-btn")?.addEventListener("click", async () => {
      const scopeValue568 = UI.inputs.detailName.value || "New User",
        scopeValue569 = UI.inputs.detailPhone.value,
        scopeValue570 = UI.inputs.detailSignature ? UI.inputs.detailSignature.value : "",
        scopeValue571 = UI.inputs.detailPersona.value,
        scopeValue572 = UI.inputs.detailAvatarImg.style.display === "block" && UI.inputs.detailAvatarImg.dataset.defaultAvatar !== "true" ? UI.inputs.detailAvatarImg.src : null;
      if (scopeValue68) {
        scopeValue1.push({
          id: scopeValue69,
          name: scopeValue568,
          phone: scopeValue569,
          signature: scopeValue570,
          persona: scopeValue571,
          avatarUrl: scopeValue572
        });
        scopeValue2 = scopeValue69;
      } else {
        const scopeValue573 = scopeValue1.find(scopeValue574 => scopeValue574.id === scopeValue69);
        scopeValue573 && (scopeValue573.name = scopeValue568, scopeValue573.phone = scopeValue569, scopeValue573.signature = scopeValue570, scopeValue573.persona = scopeValue571, scopeValue573.avatarUrl = scopeValue572);
      }
      scopeValue68 = false;
      String(scopeValue2) === String(scopeValue69) && scopeValue5();
      const accountSaved = await scopeValue9({ immediate: true });
      syncUIs();
      scopeValue6({
        avatarChanged: true
      });
      scopeValue71();
      closeView(UI.overlays.personaDetail);
      showToast(accountSaved ? "资料已保存" : "资料保存失败，请重试");
    });
    const scopeValue72 = document.getElementById("user-detail-avatar-wrapper");
    scopeValue72 && scopeValue72.addEventListener("click", scopeValue575 => {
      if (scopeValue575.target.tagName !== "INPUT") document.getElementById("detail-avatar-upload").click();
    });
    document.getElementById("detail-avatar-upload")?.addEventListener("change", async scopeValue576 => {
      const scopeValue577 = scopeValue576.target.files[0];
      if (scopeValue577) try {
        const scopeValue578 = await scopeValue65(scopeValue577, {
          maxWidth: 256,
          maxHeight: 256,
          quality: 0.72
        });
        scopeValue73(scopeValue578);
      } catch (scopeValue579) {
        console.error("Failed to process detail avatar upload", scopeValue579);
        showToast("头像处理失败");
      }
    });
    function scopeValue73(scopeValue580) {
      UI.inputs.detailAvatarImg.src = scopeValue580 || scopeValue0;
      UI.inputs.detailAvatarImg.dataset.defaultAvatar = scopeValue580 ? "false" : "true";
      UI.inputs.detailAvatarImg.style.display = "block";
      if (UI.inputs.detailAvatarIcon) UI.inputs.detailAvatarIcon.style.display = "none";
    }
    const newScope70 = window.syncUIs;
    function renderAccountAvatar(image, placeholder) {
      if (image) {
        image.src = scopeValue3.avatarUrl || scopeValue0;
        image.style.display = "block";
      }
      if (placeholder) placeholder.style.display = "none";
    }
    window.syncUIs = function () {
      newScope70 && newScope70();
      const newScope583 = document.getElementById("settings-name"),
        scopeValue591 = document.getElementById("settings-avatar-img"),
        scopeValue592 = document.querySelector(".apple-id-avatar-small .fa-user");
      newScope583 && (newScope583.textContent = scopeValue3.name || "未登录 Apple ID");
      renderAccountAvatar(scopeValue591, scopeValue592);
      const newScope586 = document.getElementById("display-name"),
        newScope587 = document.getElementById("display-phone"),
        newScope588 = document.getElementById("display-signature"),
        newScope589 = document.getElementById("edit-avatar-img"),
        newScope590 = document.querySelector("#edit-avatar-preview .fa-user");
      if (newScope586) newScope586.textContent = scopeValue3.name || "未登录 Apple ID";
      if (newScope587) newScope587.textContent = scopeValue3.phone || "暂无手机号";
      if (newScope588) newScope588.textContent = scopeValue3.signature || "添加账号后可同步头像、名称与签名";
      renderAccountAvatar(newScope589, newScope590);
      const newScope591 = document.getElementById("imessage-profile-name"),
        newScope592 = document.getElementById("imessage-profile-sign"),
        newScope593 = document.getElementById("imessage-avatar-img"),
        newScope594 = document.getElementById("imessage-avatar-icon");
      if (newScope591) newScope591.textContent = scopeValue3.name || "Default User";
      if (newScope592) newScope592.textContent = scopeValue3.signature || "No Signature";
      renderAccountAvatar(newScope593, newScope594);
    };
    window.syncUIs && window.syncUIs();
    document.getElementById("close-account-sheet-btn")?.addEventListener("click", () => {
      closeView(UI.overlays.accountSwitcher);
    });
    document.getElementById("close-persona-sheet-btn")?.addEventListener("click", () => {
      closeView(UI.overlays.personaDetail);
    });
    const scopeValue75 = document.getElementById("world-book-main-btn");
    scopeValue75 && scopeValue75.addEventListener("click", scopeValue593 => {
      scopeValue593.stopPropagation();
      window.renderWorldBooks && window.renderWorldBooks();
      const scopeValue594 = document.getElementById("world-book-view");
      scopeValue594 && openView(scopeValue594);
    });
    const scopeValue76 = document.getElementById("theme-config-btn"),
      scopeValue77 = document.getElementById("imessage-themes-btn"),
      scopeValue78 = document.getElementById("theme-config-sheet"),
      scopeValue79 = document.getElementById("theme-config-back-btn"),
      scopeValue80 = document.getElementById("desktop-theme-config-sheet"),
      scopeValue81 = document.getElementById("global-ui-translation-toggle");
    function scopeValue82() {
      if (scopeValue81) scopeValue81.checked = scopeValue27.uiChineseEnabled === true;
    }
    async function scopeValue83(scopeValue595, {
      persist: scopeValue596 = true
    } = {}) {
      return scopeValue27.uiChineseEnabled = scopeValue595 === true, window.u2ThemeState = scopeValue27, window.u2UiTranslation?.setEnabled(scopeValue27.uiChineseEnabled), scopeValue286(scopeValue27), scopeValue285(), scopeValue82(), scopeValue596 ? scopeValue381() : true;
    }
    scopeValue82();
    scopeValue81 && scopeValue81.addEventListener("change", async () => {
      const scopeValue597 = scopeValue81.checked,
        scopeValue598 = await scopeValue83(scopeValue597);
      showToast(scopeValue598 ? scopeValue597 ? "Global UI: Chinese" : "Global UI: English" : "全局翻译保存失败，当前效果未持久化");
    });
    async function scopeValue84() {
      window.u2ThemeState = scopeValue27;
      scopeValue279(scopeValue27);
      scopeValue286(scopeValue27);
      window.imApp && window.imApp.applyGlobalChatCss && window.imApp.applyGlobalChatCss(scopeValue27);
      window.imApp?.applyGlobalHomeCss?.(scopeValue27);
      window.imApp && window.imApp.applyGlobalGroupCss && window.imApp.applyGlobalGroupCss(scopeValue27);
      if (scopeValue28) await scopeValue366(scopeValue27);
    }
    function scopeValue85() {
      scopeValue340();
      const scopeValue599 = document.getElementById("theme-bg-url-input");
      if (scopeValue599) scopeValue599.value = scopeValue27.bgUrl || "";
      scopeValue368();
      scopeValue373();
      scopeValue367();
      scopeValue285();
      scopeValue252();
      scopeValue255();
      openView(scopeValue80);
    }
    const scopeValue86 = `/* 线下界面真实可编辑源码
   :scope 会自动限定到线下主界面和弹幕详情页。 */

:scope {
  --offline-chat-narrative-color: #111111;
  --offline-chat-dialogue-color: #8B8B8B;
  background: #ffffff;
  color: #111111;
}

.offline-chat-header,
.offline-chat-input-area {
  background: rgba(255, 255, 255, 0.96);
  border-color: rgba(0, 0, 0, 0.08);
}

.offline-chat-bubble-text,
.offline-chat-paragraph {
  color: var(--offline-chat-narrative-color);
}

.offline-chat-dialogue,
.offline-chat-speech {
  color: var(--offline-chat-dialogue-color);
}

.offline-chat-bubble.user { background: #fafafa; }
.offline-chat-bubble.ai { background: #ffffff; }
.offline-chat-choice-btn {
  background: #ffffff;
  color: #111111;
  border: 1px solid #d8d8dc;
}`,
      scopeValue87 = {
        narrativeColor: document.getElementById("theme-offline-narrative-color"),
        narrativeValue: document.getElementById("theme-offline-narrative-value"),
        narrativeSwatch: document.getElementById("theme-offline-narrative-swatch"),
        dialogueColor: document.getElementById("theme-offline-dialogue-color"),
        dialogueValue: document.getElementById("theme-offline-dialogue-value"),
        dialogueSwatch: document.getElementById("theme-offline-dialogue-swatch"),
        css: document.getElementById("theme-offline-css-input"),
        clear: document.getElementById("theme-offline-clear-btn"),
        copy: document.getElementById("theme-offline-copy-btn"),
        apply: document.getElementById("theme-offline-apply-btn"),
        export: document.getElementById("theme-offline-export-btn"),
        import: document.getElementById("theme-offline-import-btn"),
        importInput: document.getElementById("theme-offline-import-input"),
        presetSelect: document.getElementById("theme-offline-preset-select"),
        presetDelete: document.getElementById("theme-offline-preset-delete-btn"),
        presetName: document.getElementById("theme-offline-preset-name"),
        presetSave: document.getElementById("theme-offline-preset-save-btn"),
        reset: document.getElementById("theme-offline-reset-btn")
      };
    let scopeValue88 = window.imApp.getOfflineThemeState?.().theme || window.imApp.createDefaultOfflineThemeState?.() || {
        narrativeColor: "#111111",
        dialogueColor: "#8B8B8B",
        customCss: "",
        customCssEnabled: false,
        activePresetId: ""
      },
      scopeValue89 = window.imApp.getOfflineThemeState?.().presets || [],
      scopeValue90 = null,
      scopeValue91 = false;
    function scopeValue92() {
      const scopeValue600 = scopeValue87.presetSelect;
      if (!scopeValue600) return;
      scopeValue600.replaceChildren(new Option("自定义主题", ""));
      scopeValue89.forEach(scopeValue601 => scopeValue600.add(new Option(scopeValue601.name, scopeValue601.id)));
      scopeValue600.value = scopeValue89.some(scopeValue602 => scopeValue602.id === scopeValue88.activePresetId) ? scopeValue88.activePresetId : "";
      if (scopeValue87.presetDelete) scopeValue87.presetDelete.disabled = !scopeValue600.value;
    }
    function scopeValue93({
      includeCss: scopeValue603 = true
    } = {}) {
      const scopeValue604 = [["narrativeColor", "narrativeValue", "narrativeSwatch"], ["dialogueColor", "dialogueValue", "dialogueSwatch"]];
      scopeValue604.forEach(([scopeValue605, scopeValue606, scopeValue607]) => {
        if (scopeValue87[scopeValue605]) scopeValue87[scopeValue605].value = scopeValue88[scopeValue605];
        if (scopeValue87[scopeValue606]) scopeValue87[scopeValue606].value = scopeValue88[scopeValue605];
        if (scopeValue87[scopeValue607]) scopeValue87[scopeValue607].style.backgroundColor = scopeValue88[scopeValue605];
      });
      if (scopeValue603 && scopeValue87.css) scopeValue87.css.value = scopeValue88.customCss || "";
      scopeValue92();
    }
    function scopeValue94() {
      const scopeValue608 = window.imApp.getOfflineThemeState?.();
      scopeValue608 && (scopeValue88 = scopeValue608.theme, scopeValue89 = scopeValue608.presets);
      scopeValue91 = false;
      scopeValue93();
    }
    async function scopeValue95(scopeValue609, {
      toast: scopeValue610 = ""
    } = {}) {
      scopeValue91 = false;
      scopeValue88 = window.imApp.normalizeOfflineThemeState ? window.imApp.normalizeOfflineThemeState(scopeValue609) : {
        ...scopeValue88,
        ...scopeValue609
      };
      scopeValue88 = await window.imApp.saveOfflineThemeState(scopeValue88);
      scopeValue93();
      if (scopeValue610) showToast(scopeValue610);
      return scopeValue88;
    }
    function scopeValue96() {
      window.imApp.applyOfflineChatTheme?.(scopeValue88);
      if (scopeValue90) window.clearTimeout(scopeValue90);
      scopeValue90 = window.setTimeout(() => {
        scopeValue90 = null;
        scopeValue95(scopeValue88)["catch"](scopeValue611 => {
          console.error("Offline theme persistence failed", scopeValue611);
          showToast("线下主题保存失败");
        });
      }, 350);
    }
    function scopeValue97(scopeValue612, scopeValue613) {
      if (!/^#[0-9a-fA-F]{6}$/.test(String(scopeValue613 || "").trim())) return false;
      scopeValue88 = window.imApp.normalizeOfflineThemeState({
        ...scopeValue88,
        [scopeValue612]: scopeValue613,
        activePresetId: ""
      });
      scopeValue93({
        includeCss: false
      });
      if (!scopeValue91) scopeValue96();
      return true;
    }
    scopeValue87.narrativeColor?.addEventListener("input", scopeValue614 => scopeValue97("narrativeColor", scopeValue614.target.value));
    scopeValue87.dialogueColor?.addEventListener("input", scopeValue615 => scopeValue97("dialogueColor", scopeValue615.target.value));
    [["narrativeColor", scopeValue87.narrativeValue], ["dialogueColor", scopeValue87.dialogueValue]].forEach(([scopeValue616, scopeValue617]) => {
      scopeValue617?.addEventListener("input", () => scopeValue97(scopeValue616, scopeValue617.value));
      scopeValue617?.addEventListener("blur", () => {
        scopeValue617.value = scopeValue88[scopeValue616];
      });
    });
    scopeValue87.apply?.addEventListener("click", () => scopeValue95({
      ...scopeValue88,
      customCss: scopeValue87.css?.value || "",
      activePresetId: scopeValue88.activePresetId || ""
    }, {
      toast: (scopeValue87.css?.value || "").trim() ? "线下 CSS 已应用" : "线下 CSS 已关闭"
    }));
    scopeValue87.css?.addEventListener("input", () => {
      scopeValue88 = {
        ...scopeValue88,
        activePresetId: ""
      };
      scopeValue92();
    });
    scopeValue87.clear?.addEventListener("click", () => scopeValue95({
      ...scopeValue88,
      customCss: "",
      activePresetId: ""
    }, {
      toast: "已清空线下 CSS"
    }));
    scopeValue87.copy?.addEventListener("click", async () => {
      try {
        if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(scopeValue86);else {
          const scopeValue618 = document.createElement("textarea");
          scopeValue618.value = scopeValue86;
          scopeValue618.style.cssText = "position:fixed;opacity:0;pointer-events:none;";
          document.body.appendChild(scopeValue618);
          scopeValue618.select();
          document.execCommand("copy");
          scopeValue618.remove();
        }
        showToast("已复制线下界面真实源码");
      } catch (scopeValue619) {
        console.error("Copy offline theme source failed", scopeValue619);
        showToast("复制失败，请稍后重试");
      }
    });
    scopeValue87.presetSelect?.addEventListener("change", () => {
      const scopeValue620 = scopeValue89.find(scopeValue621 => scopeValue621.id === scopeValue87.presetSelect.value);
      if (!scopeValue620) {
        scopeValue88 = {
          ...scopeValue88,
          activePresetId: ""
        };
        scopeValue92();
        return;
      }
      scopeValue90 && (window.clearTimeout(scopeValue90), scopeValue90 = null);
      scopeValue91 = true;
      scopeValue88 = window.imApp.normalizeOfflineThemeState({
        ...scopeValue620,
        activePresetId: scopeValue620.id
      });
      scopeValue93();
      showToast("已载入主题“" + scopeValue620.name + "”，请保存并应用");
    });
    scopeValue87.presetSave?.addEventListener("click", async () => {
      const scopeValue622 = String(scopeValue87.presetName?.value || "").trim();
      if (!scopeValue622) {
        showToast("请输入主题预设名称");
        scopeValue87.presetName?.focus();
        return;
      }
      const scopeValue623 = scopeValue89.find(scopeValue626 => scopeValue626.name.toLocaleLowerCase() === scopeValue622.toLocaleLowerCase()),
        scopeValue624 = scopeValue623?.id || "offline-theme-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
        scopeValue625 = {
          id: scopeValue624,
          name: scopeValue622,
          narrativeColor: scopeValue88.narrativeColor,
          dialogueColor: scopeValue88.dialogueColor,
          customCss: scopeValue87.css?.value || ""
        };
      scopeValue89 = await window.imApp.saveOfflineThemePresets(scopeValue623 ? scopeValue89.map(scopeValue627 => scopeValue627.id === scopeValue624 ? scopeValue625 : scopeValue627) : scopeValue89.concat(scopeValue625));
      if (scopeValue87.presetName) scopeValue87.presetName.value = "";
      await scopeValue95({
        ...scopeValue625,
        activePresetId: scopeValue624
      }, {
        toast: scopeValue623 ? "主题预设已更新" : "主题预设已保存"
      });
    });
    scopeValue87.presetDelete?.addEventListener("click", () => {
      const scopeValue628 = scopeValue87.presetSelect?.value || "";
      if (!scopeValue628) return;
      const scopeValue629 = scopeValue89.find(scopeValue631 => scopeValue631.id === scopeValue628),
        scopeValue630 = async () => {
          const scopeValue632 = scopeValue91,
            scopeValue633 = window.imApp.getOfflineThemeState?.().theme || scopeValue88;
          scopeValue89 = await window.imApp.saveOfflineThemePresets(scopeValue89.filter(scopeValue634 => scopeValue634.id !== scopeValue628));
          scopeValue632 ? (scopeValue91 = false, scopeValue88 = scopeValue633, scopeValue93(), showToast("主题预设已删除")) : await scopeValue95({
            ...scopeValue633,
            activePresetId: ""
          }, {
            toast: "主题预设已删除"
          });
        };
      window.showCustomModal && scopeValue629 ? window.showCustomModal({
        title: "删除主题预设",
        message: "确定删除“" + scopeValue629.name + "”吗？",
        confirmText: "删除",
        cancelText: "取消",
        isDestructive: true,
        onConfirm: scopeValue630
      }) : void scopeValue630();
    });
    scopeValue87.reset?.addEventListener("click", () => scopeValue95(window.imApp.createDefaultOfflineThemeState(), {
      toast: "已恢复默认线下主题"
    }));
    scopeValue87["export"]?.addEventListener("click", async () => {
      const scopeValue635 = scopeValue89.find(scopeValue639 => scopeValue639.id === scopeValue88.activePresetId),
        scopeValue636 = scopeValue635?.name || "自定义线下主题",
        scopeValue637 = {
          type: "u2-offline-theme",
          version: 1,
          name: scopeValue636,
          theme: {
            narrativeColor: scopeValue88.narrativeColor,
            dialogueColor: scopeValue88.dialogueColor,
            customCss: scopeValue87.css?.value || ""
          }
        },
        scopeValue638 = await window.u2ExportFile({
          blob: new Blob([JSON.stringify(scopeValue637, null, 2)], {
            type: "application/json"
          }),
          fileName: (scopeValue636.replace(/[\\/:*?"<>|]/g, "_") || "offline-theme") + ".json",
          title: "U2 线下主题"
        });
      if (scopeValue638 === "shared" || scopeValue638 === "downloaded") showToast("线下主题已导出");else {
        if (scopeValue638 === "failed") showToast("线下主题导出失败");
      }
    });
    scopeValue87["import"]?.addEventListener("click", () => scopeValue87.importInput?.click());
    scopeValue87.importInput?.addEventListener("change", async () => {
      const scopeValue640 = scopeValue87.importInput.files?.[0];
      scopeValue87.importInput.value = "";
      if (!scopeValue640) return;
      try {
        const scopeValue641 = JSON.parse(await scopeValue640.text()),
          scopeValue642 = scopeValue641?.theme && typeof scopeValue641.theme === "object" ? scopeValue641.theme : scopeValue641;
        if (!scopeValue642 || typeof scopeValue642 !== "object") throw new Error("Invalid offline theme file");
        const scopeValue643 = window.imApp.normalizeOfflineThemeState(scopeValue642),
          scopeValue644 = String(scopeValue641?.name || scopeValue642.name || scopeValue640.name.replace(/\.json$/i, "") || "导入主题").trim().slice(0, 40) || "导入主题",
          scopeValue645 = scopeValue89.find(scopeValue648 => scopeValue648.name.toLocaleLowerCase() === scopeValue644.toLocaleLowerCase()),
          scopeValue646 = scopeValue645?.id || "offline-theme-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
          scopeValue647 = {
            id: scopeValue646,
            name: scopeValue644,
            narrativeColor: scopeValue643.narrativeColor,
            dialogueColor: scopeValue643.dialogueColor,
            customCss: scopeValue643.customCss
          };
        scopeValue89 = await window.imApp.saveOfflineThemePresets(scopeValue645 ? scopeValue89.map(scopeValue649 => scopeValue649.id === scopeValue646 ? scopeValue647 : scopeValue649) : scopeValue89.concat(scopeValue647));
        await scopeValue95({
          ...scopeValue647,
          activePresetId: scopeValue646
        }, {
          toast: "已导入并应用主题：" + scopeValue644
        });
      } catch (scopeValue650) {
        console.error("Import offline theme failed", scopeValue650);
        showToast("主题文件无效，导入失败");
      }
    });
    document.addEventListener("imessage-data-ready", scopeValue94);
    scopeValue93();
    function scopeValue98() {
      scopeValue94();
      scopeValue167.clear();
      scopeValue168.clear();
      scopeValue166 = "all";
      scopeValue164.forEach(scopeValue653 => {
        scopeValue653.checked = scopeValue653.value === "all";
      });
      const scopeValue651 = window.imData?.currentSettingsFriend || window.imData?.currentActiveFriend || null;
      scopeValue187(scopeValue651);
      const scopeValue652 = scopeValue186();
      scopeValue183(scopeValue652);
      void scopeValue198(scopeValue652);
      scopeValue220(scopeValue652);
      scopeValue178();
      scopeValue179(scopeValue652);
      scopeValue180();
      openView(scopeValue78);
    }
    function scopeValue99() {
      const scopeValue654 = document.querySelector(".im-theme-tabs .theme-tab.active"),
        scopeValue655 = scopeValue654?.getAttribute("data-target") || "theme-tab-home";
      if (scopeValue655 === "theme-tab-home") return "home";
      if (scopeValue655 === "theme-tab-chat") return "chat";
      if (scopeValue655 === "theme-tab-group") return "group";
      if (scopeValue655 === "theme-tab-status") return "status";
      if (scopeValue655 === "theme-tab-offline") return "offline";
      return "bubble";
    }
    scopeValue78 && window.mobileInputCompat?.registerFocusScope && window.mobileInputCompat.registerFocusScope({
      selector: "#theme-config-sheet",
      preferFocusScope: true,
      resolveScrollContainer: (scopeValue656, scopeValue657) => scopeValue657.querySelector(".im-theme-content"),
      scrollBehavior: "focus",
      viewportClassName: "u2-android-theme-viewport-sized",
      viewportHeightCssVariable: "--u2-android-theme-viewport-height",
      viewportTopCssVariable: "--u2-android-theme-viewport-top"
    });
    async function scopeValue100(scopeValue658 = scopeValue99()) {
      const scopeValue659 = scopeValue658 || scopeValue99();
      if (scopeValue659 === "home") {
        const scopeValue663 = scopeValue107,
          scopeValue664 = scopeValue663 ? scopeValue663.value : "";
        scopeValue27.imessageHomeCss = scopeValue664;
        scopeValue27.imessageHomeCssEnabled = !!scopeValue664.trim();
        window.u2ThemeState = scopeValue27;
        window.imApp?.applyGlobalHomeCss?.(scopeValue27);
        const scopeValue665 = await scopeValue381(),
          scopeValue666 = "首页与会话列表样式";
        showToast(scopeValue665 ? scopeValue664.trim() ? scopeValue666 + " 已应用" : scopeValue666 + " 已清空" : scopeValue666 + " 保存失败，当前效果未持久化");
        if (scopeValue665) scopeValue178("home");
        return scopeValue665;
      }
      if (scopeValue659 === "chat") {
        const scopeValue667 = scopeValue119 ? scopeValue119.value : "";
        if (scopeValue166 === "friend") {
          const scopeValue669 = scopeValue186();
          if (!scopeValue669) return showToast("请先选择一个单聊好友"), false;
          const scopeValue670 = await window.imApp?.commitScopedFriendChange?.(scopeValue669, scopeValue671 => {
            scopeValue671.chatCss = scopeValue667;
            scopeValue671.chatCssEnabled = !!scopeValue667.trim();
          }, {
            silent: true,
            syncSettings: true
          });
          if (!scopeValue670) return showToast("当前好友单聊样式保存失败"), false;
          return window.imApp?.applyFriendCss?.(scopeValue200(scopeValue669)), scopeValue172(), showToast(scopeValue667.trim() ? "当前好友单聊样式已应用" : "当前好友单聊样式已清空"), true;
        }
        scopeValue27.imessageChatCss = scopeValue667;
        scopeValue27.imessageChatCssEnabled = !!scopeValue667.trim();
        window.u2ThemeState = scopeValue27;
        window.imApp && window.imApp.applyGlobalChatCss && window.imApp.applyGlobalChatCss(scopeValue27);
        const scopeValue668 = await scopeValue381();
        showToast(scopeValue668 ? scopeValue667.trim() ? "聊天页样式已应用" : "聊天页样式已清空" : "聊天页样式保存失败，当前效果未持久化");
        if (scopeValue668) scopeValue172();
        return scopeValue668;
      }
      if (scopeValue659 === "group") {
        const scopeValue672 = scopeValue121 ? scopeValue121.value : "";
        scopeValue27.imessageGroupCss = scopeValue672;
        scopeValue27.imessageGroupCssEnabled = !!scopeValue672.trim();
        window.u2ThemeState = scopeValue27;
        window.imApp && window.imApp.applyGlobalGroupCss && window.imApp.applyGlobalGroupCss(scopeValue27);
        const scopeValue673 = await scopeValue381();
        showToast(scopeValue673 ? scopeValue672.trim() ? "群聊样式已应用" : "群聊样式已清空" : "群聊样式保存失败，当前效果未持久化");
        if (scopeValue673) scopeValue178("group");
        return scopeValue673;
      }
      if (scopeValue659 === "status") {
        const scopeValue674 = String(scopeValue143?.value || "template"),
          scopeValue675 = scopeValue674 === "css" ? await scopeValue202() : scopeValue674 === "default" ? await scopeValue203() : await scopeValue201();
        if (scopeValue675) scopeValue178("status");
        return scopeValue675;
      }
      const scopeValue660 = scopeValue186();
      if (!scopeValue660) return showToast("请先选择一个单聊好友"), false;
      const scopeValue661 = scopeValue113,
        scopeValue662 = scopeValue661 ? scopeValue661.value : "";
      if (window.imApp && window.imApp.commitScopedFriendChange) {
        const scopeValue676 = await window.imApp.commitScopedFriendChange(scopeValue660, scopeValue677 => {
          scopeValue677.customCss = scopeValue662;
          scopeValue677.customCssEnabled = !!scopeValue662.trim();
        }, {
          silent: true,
          syncSettings: true
        });
        if (scopeValue676) {
          const scopeValue678 = scopeValue200(scopeValue660);
          if (window.imApp.applyFriendCss) window.imApp.applyFriendCss(scopeValue678);
          scopeValue220(scopeValue678);
          scopeValue178("bubble");
          showToast("当前好友气泡样式已应用");
        } else showToast("当前好友气泡样式保存失败");
        return scopeValue676;
      }
      return false;
    }
    function scopeValue101(scopeValue679) {
      const scopeValue680 = scopeValue679 && typeof scopeValue679 === "object" ? scopeValue679 : {};
      return scopeValue22.reduce((scopeValue681, scopeValue682) => {
        const scopeValue683 = new Set();
        return scopeValue681[scopeValue682] = (Array.isArray(scopeValue680[scopeValue682]) ? scopeValue680[scopeValue682] : []).map((scopeValue684, scopeValue685) => ({
          id: String(scopeValue684?.id || scopeValue682 + "-preset-" + scopeValue685),
          name: String(scopeValue684?.name || "").trim(),
          css: typeof scopeValue684?.css === "string" ? scopeValue684.css : ""
        })).filter(scopeValue686 => scopeValue686.name && scopeValue686.css.trim()).filter(scopeValue687 => {
          if (scopeValue683.has(scopeValue687.name)) return false;
          return scopeValue683.add(scopeValue687.name), true;
        }), scopeValue681;
      }, {});
    }
    function scopeValue102(scopeValue688) {
      const scopeValue689 = Array.isArray(scopeValue688) ? scopeValue688 : [],
        scopeValue690 = new Set();
      return scopeValue689.map((scopeValue691, scopeValue692) => {
        const scopeValue693 = String(scopeValue691?.name || "").trim(),
          scopeValue694 = String(scopeValue691?.prompt || "").trim(),
          scopeValue695 = String(scopeValue691?.regex || "").trim(),
          scopeValue696 = String(scopeValue691?.html || "").trim();
        if (!scopeValue693 || !scopeValue694 || !scopeValue695 || !scopeValue696) return null;
        return {
          id: String(scopeValue691?.id || "status-template-preset-" + scopeValue692),
          name: scopeValue693,
          prompt: scopeValue694,
          regex: scopeValue695,
          html: scopeValue696
        };
      }).filter(Boolean).filter(scopeValue697 => {
        if (scopeValue690.has(scopeValue697.name)) return false;
        return scopeValue690.add(scopeValue697.name), true;
      });
    }
    scopeValue76 && scopeValue80 && scopeValue76.addEventListener("click", scopeValue698 => {
      scopeValue698.stopPropagation();
      scopeValue85();
    });
    scopeValue77 && scopeValue78 && scopeValue77.addEventListener("click", scopeValue699 => {
      scopeValue699.stopPropagation();
      scopeValue98();
    });
    scopeValue79 && scopeValue78 && scopeValue79.addEventListener("click", () => {
      if (scopeValue175() && !window.confirm("当前 Theme 有未保存的修改，确定放弃吗？")) return;
      scopeValue178();
      closeView(scopeValue78);
    });
    const scopeValue103 = document.querySelectorAll(".theme-tab"),
      scopeValue104 = document.querySelectorAll(".theme-tab-content");
    function scopeValue105(scopeValue700, {
      focus: scopeValue701 = false
    } = {}) {
      const scopeValue702 = scopeValue700?.getAttribute("data-target");
      if (!scopeValue702) return;
      scopeValue103.forEach(scopeValue703 => {
        const scopeValue704 = scopeValue703 === scopeValue700;
        scopeValue703.classList.toggle("active", scopeValue704);
        scopeValue703.setAttribute("aria-selected", String(scopeValue704));
      });
      scopeValue104.forEach(scopeValue705 => {
        const scopeValue706 = scopeValue705.id === scopeValue702;
        scopeValue705.classList.toggle("active", scopeValue706);
        scopeValue705.hidden = !scopeValue706;
      });
      scopeValue180();
      if (scopeValue701) scopeValue700.focus({
        preventScroll: true
      });
    }
    function scopeValue106(scopeValue707, scopeValue708) {
      scopeValue707.forEach((scopeValue709, scopeValue710) => {
        scopeValue709.addEventListener("keydown", scopeValue711 => {
          const scopeValue712 = ["ArrowLeft", "ArrowRight", "Home", "End"];
          if (!scopeValue712.includes(scopeValue711.key)) return;
          scopeValue711.preventDefault();
          let scopeValue713 = scopeValue710;
          if (scopeValue711.key === "ArrowLeft") scopeValue713 = (scopeValue710 - 1 + scopeValue707.length) % scopeValue707.length;
          if (scopeValue711.key === "ArrowRight") scopeValue713 = (scopeValue710 + 1) % scopeValue707.length;
          if (scopeValue711.key === "Home") scopeValue713 = 0;
          if (scopeValue711.key === "End") scopeValue713 = scopeValue707.length - 1;
          scopeValue708(scopeValue707[scopeValue713], {
            focus: true
          });
        });
      });
    }
    scopeValue103.forEach(scopeValue714 => {
      scopeValue714.addEventListener("click", () => {
        scopeValue105(scopeValue714);
      });
    });
    scopeValue106(Array.from(scopeValue103), scopeValue105);
    const scopeValue107 = document.getElementById("theme-home-css-input"),
      scopeValue108 = document.getElementById("theme-home-clear-btn"),
      scopeValue109 = document.getElementById("theme-home-copy-btn"),
      scopeValue110 = document.getElementById("theme-home-save-btn"),
      scopeValue111 = document.getElementById("theme-home-preset-name"),
      scopeValue112 = document.getElementById("theme-home-preset-list"),
      scopeValue113 = document.getElementById("theme-bubble-css-input"),
      scopeValue114 = document.getElementById("theme-bubble-clear-btn"),
      scopeValue115 = document.getElementById("theme-bubble-copy-btn"),
      scopeValue116 = document.getElementById("theme-chat-copy-btn"),
      scopeValue117 = document.getElementById("theme-bubble-save-btn"),
      scopeValue118 = document.getElementById("theme-bubble-preset-name"),
      scopeValue119 = document.getElementById("theme-chat-css-input"),
      scopeValue120 = document.getElementById("theme-chat-clear-btn"),
      scopeValue121 = document.getElementById("theme-group-css-input"),
      scopeValue122 = document.getElementById("theme-group-clear-btn"),
      scopeValue123 = document.getElementById("theme-group-copy-btn"),
      scopeValue124 = document.getElementById("theme-chat-save-btn"),
      scopeValue125 = document.getElementById("theme-chat-preset-name"),
      scopeValue126 = document.getElementById("theme-chat-preset-list"),
      scopeValue127 = document.getElementById("theme-group-save-btn"),
      scopeValue128 = document.getElementById("theme-group-preset-name"),
      scopeValue129 = document.getElementById("theme-group-preset-list"),
      scopeValue130 = document.getElementById("theme-status-template-prompt"),
      scopeValue131 = document.getElementById("theme-status-template-regex"),
      scopeValue132 = document.getElementById("theme-status-template-html"),
      scopeValue133 = document.getElementById("theme-status-template-generate-btn"),
      scopeValue134 = document.getElementById("theme-status-more-actions"),
      scopeValue135 = scopeValue134?.closest(".im-theme-workspace-footer"),
      scopeValue136 = document.querySelectorAll("[data-status-render-action]"),
      scopeValue137 = document.getElementById("theme-status-clear-btn"),
      scopeValue138 = document.getElementById("theme-status-copy-btn"),
      scopeValue139 = document.getElementById("theme-status-template-import-btn"),
      scopeValue140 = document.getElementById("theme-status-template-export-btn"),
      scopeValue141 = document.getElementById("theme-status-template-import-input"),
      scopeValue142 = document.getElementById("theme-status-target-select"),
      scopeValue143 = document.getElementById("theme-status-render-mode"),
      scopeValue144 = document.querySelectorAll("[data-status-render-panel]"),
      scopeValue145 = document.getElementById("theme-status-css-prompt"),
      scopeValue146 = document.getElementById("theme-status-css-input"),
      scopeValue147 = document.getElementById("theme-status-css-save-btn"),
      scopeValue148 = document.getElementById("theme-status-css-preset-name"),
      scopeValue149 = document.getElementById("theme-status-css-preset-list"),
      scopeValue150 = document.getElementById("theme-status-save-btn"),
      scopeValue151 = document.getElementById("theme-status-preset-name"),
      scopeValue152 = document.getElementById("theme-status-preset-list"),
      scopeValue153 = document.getElementById("theme-css-import-input"),
      scopeValue154 = document.querySelectorAll("[data-theme-import-type]");
    let scopeValue155 = "",
      scopeValue156 = "";
    const scopeValue157 = document.getElementById("theme-bubble-preset-list"),
      scopeValue158 = document.getElementById("theme-friend-target-bar"),
      scopeValue159 = document.getElementById("theme-friend-target-avatar"),
      scopeValue160 = document.getElementById("theme-friend-target-name"),
      scopeValue161 = {
        bubble: document.getElementById("theme-bubble-preview")
      },
      scopeValue162 = document.getElementById("theme-draft-indicator"),
      scopeValue163 = {
        sections: new Set()
      },
      scopeValue164 = document.querySelectorAll("input[name=\"theme-chat-scope\"]"),
      scopeValue165 = document.getElementById("theme-chat-scope-summary");
    let scopeValue166 = "all";
    const scopeValue167 = new Map(),
      scopeValue168 = new Set();
    function scopeValue169(scopeValue715 = scopeValue166, scopeValue716 = scopeValue156) {
      return scopeValue715 === "friend" ? "friend:" + scopeValue716 : "all";
    }
    function scopeValue170() {
      const scopeValue717 = scopeValue169();
      scopeValue167.set(scopeValue717, scopeValue119?.value || "");
      scopeValue168.add(scopeValue717);
      scopeValue177("chat");
    }
    function scopeValue171() {
      if (!scopeValue119) return;
      const scopeValue718 = scopeValue169(),
        scopeValue719 = scopeValue166 === "friend" ? scopeValue186() : null;
      scopeValue119.value = scopeValue167.has(scopeValue718) ? scopeValue167.get(scopeValue718) : scopeValue166 === "friend" ? scopeValue719?.chatCss || "" : scopeValue27.imessageChatCss || "";
      if (scopeValue165) scopeValue165.textContent = scopeValue166 === "friend" ? "仅应用到 " + (scopeValue719?.nickname || "所选好友") : "应用到全部单聊";
    }
    function scopeValue172() {
      const scopeValue720 = scopeValue169();
      scopeValue167["delete"](scopeValue720);
      scopeValue168["delete"](scopeValue720);
      if (scopeValue168.size === 0) scopeValue178("chat");
    }
    function scopeValue173(scopeValue721) {
      const scopeValue722 = scopeValue721 === "friend" ? "friend" : "all";
      if (scopeValue722 === scopeValue166) return;
      scopeValue166 = scopeValue722;
      scopeValue164.forEach(scopeValue723 => {
        scopeValue723.checked = scopeValue723.value === scopeValue722;
      });
      scopeValue171();
      scopeValue180();
      scopeValue220(scopeValue186());
    }
    scopeValue164.forEach(scopeValue724 => scopeValue724.addEventListener("change", () => {
      if (scopeValue724.checked) scopeValue173(scopeValue724.value);
    }));
    function scopeValue174() {
      return Array.from(scopeValue163.sections);
    }
    function scopeValue175(scopeValue725 = "") {
      return scopeValue725 ? scopeValue163.sections.has(scopeValue725) : scopeValue163.sections.size > 0;
    }
    function scopeValue176() {
      if (!scopeValue162) return;
      scopeValue162.textContent = scopeValue175() ? "未保存 · " + scopeValue174().length + " 项修改" : "iMessage 样式工具";
    }
    function scopeValue177(scopeValue726) {
      if (!scopeValue726) return;
      scopeValue163.sections.add(scopeValue726);
      scopeValue176();
    }
    function scopeValue178(scopeValue727 = "") {
      if (scopeValue727) scopeValue163.sections["delete"](scopeValue727);else scopeValue163.sections.clear();
      scopeValue176();
    }
    function scopeValue179(scopeValue728 = scopeValue186()) {
      scopeValue160 && (scopeValue160.textContent = scopeValue728 ? scopeValue728.nickname || scopeValue728.realName || "单聊 " + scopeValue728.id : "暂无可用单聊好友");
      scopeValue159 && (scopeValue159.src = scopeValue728?.avatarUrl || "https://picsum.photos/seed/char/100/100", scopeValue159.alt = scopeValue728 ? (scopeValue160?.textContent || "好友") + "的头像" : "");
    }
    function scopeValue180() {
      if (!scopeValue158) return;
      const scopeValue729 = scopeValue99();
      scopeValue158.hidden = scopeValue729 !== "bubble" && scopeValue729 !== "status" && !(scopeValue729 === "chat" && scopeValue166 === "friend");
      if (!scopeValue158.hidden) scopeValue179();
    }
    function scopeValue181() {
      return "<div class=\"preview-chat\"><div class=\"chat-row ai-row\"><div class=\"chat-bubble ai-bubble\">这是对方的消息</div></div><div class=\"chat-row user-row\"><div class=\"chat-bubble user-bubble\">这是我的消息</div></div></div>";
    }
    function scopeValue182(scopeValue730) {
      const scopeValue731 = scopeValue161[scopeValue730],
        scopeValue732 = scopeValue207(scopeValue730);
      if (!scopeValue731 || !scopeValue732) return;
      scopeValue731.srcdoc = window.imApp?.["getSingleChatThemePreviewDocument"]?.(scopeValue732.value, "bubble_css") || "";
    }
    function scopeValue183(newScope733 = scopeValue186()) {
      if (scopeValue107) scopeValue107.value = scopeValue27.imessageHomeCss || "";
      if (scopeValue119) scopeValue119.value = scopeValue27.imessageChatCss || "";
      if (scopeValue121) scopeValue121.value = scopeValue27.imessageGroupCss || "";
      if (scopeValue113) scopeValue113.value = newScope733?.["customCss"] || "";
      scopeValue197(newScope733), scopeValue181("bubble");
    }
    function scopeValue184() {
      return window.imApp?.createDefaultStatusTemplate ? window.imApp.createDefaultStatusTemplate() : {
        enabled: false,
        prompt: window.imApp?.DEFAULT_STATUS_PROMPT || "",
        regex: "(?<thought>[\\s\\S]+)",
        html: "<div class=\"gmp-inner-voice chat-profile-panel-thought\">{{thought}}</div>"
      };
    }
    function scopeValue185() {
      return (window.imData?.friends || []).filter(scopeValue735 => scopeValue735 && scopeValue735.id != null && scopeValue735.type === "char");
    }
    function scopeValue186() {
      const scopeValue736 = String(scopeValue142?.value || "").trim(),
        scopeValue737 = scopeValue736 ? scopeValue185().find(scopeValue741 => String(scopeValue741.id) === scopeValue736) : null,
        scopeValue738 = window.imData?.currentSettingsFriend || window.imData?.currentActiveFriend || null,
        scopeValue739 = scopeValue737 || scopeValue738,
        scopeValue740 = scopeValue739 ? window.imApp?.getFriendById?.(scopeValue739.id) || scopeValue739 : null;
      return scopeValue740?.type === "char" ? scopeValue740 : null;
    }
    function scopeValue187(scopeValue742 = null) {
      if (!scopeValue142) return;
      const scopeValue743 = scopeValue185(),
        scopeValue744 = String(scopeValue142.value || "").trim(),
        scopeValue745 = String(scopeValue742?.id || scopeValue744 || window.imData?.currentSettingsFriend?.id || window.imData?.currentActiveFriend?.id || "").trim();
      scopeValue142.innerHTML = "";
      if (scopeValue743.length === 0) {
        const scopeValue747 = document.createElement("option");
        scopeValue747.value = "";
        scopeValue747.textContent = "暂无可用单聊";
        scopeValue142.appendChild(scopeValue747);
        scopeValue142.disabled = true;
        scopeValue179(null);
        return;
      }
      scopeValue743.forEach(scopeValue748 => {
        const scopeValue749 = document.createElement("option");
        scopeValue749.value = String(scopeValue748.id);
        scopeValue749.textContent = scopeValue748.nickname || scopeValue748.realName || "单聊 " + String(scopeValue748.id);
        scopeValue142.appendChild(scopeValue749);
      });
      const scopeValue746 = scopeValue743.some(scopeValue750 => String(scopeValue750.id) === scopeValue745) ? scopeValue745 : String(scopeValue743[0].id);
      scopeValue142.value = scopeValue746;
      scopeValue142.disabled = false;
      scopeValue156 = scopeValue746;
      scopeValue179(scopeValue186());
    }
    function scopeValue188(scopeValue751 = scopeValue186()) {
      if (typeof window.imApp?.getStatusRenderMode === "function") return window.imApp.getStatusRenderMode(scopeValue751);
      const scopeValue752 = String(scopeValue751?.statusRenderMode || "").trim();
      if (["template", "css", "default"].includes(scopeValue752)) return scopeValue752;
      if (scopeValue751?.statusTemplate?.enabled === true) return "template";
      if (scopeValue751?.statusCssEnabled && String(scopeValue751.statusCss || "").trim()) return "css";
      return "default";
    }
    function scopeValue189(scopeValue753 = scopeValue188()) {
      const scopeValue754 = ["template", "css", "default"].includes(scopeValue753) ? scopeValue753 : "default";
      if (scopeValue143) scopeValue143.value = scopeValue754;
      scopeValue144.forEach(scopeValue756 => {
        const scopeValue757 = scopeValue756.getAttribute("data-status-render-panel") === scopeValue754;
        scopeValue756.hidden = !scopeValue757;
      });
      let scopeValue755 = false;
      scopeValue136.forEach(scopeValue758 => {
        const scopeValue759 = String(scopeValue758.getAttribute("data-status-render-action") || "").split(/\s+/).filter(Boolean),
          scopeValue760 = scopeValue759.includes(scopeValue754);
        scopeValue758.hidden = !scopeValue760;
        scopeValue755 ||= scopeValue760;
      });
      if (scopeValue134) {
        scopeValue134.hidden = !scopeValue755;
        if (!scopeValue755) scopeValue134.open = false;
      }
      scopeValue135?.classList.toggle("is-status-actions-hidden", !scopeValue755);
    }
    function scopeValue190(scopeValue761 = true) {
      return {
        enabled: scopeValue761,
        prompt: String(scopeValue130?.value || "").trim(),
        regex: String(scopeValue131?.value || "").trim(),
        html: String(scopeValue132?.value || "").trim()
      };
    }
    const scopeValue191 = "u2-imessage-status-template",
      scopeValue192 = 1;
    function scopeValue193(scopeValue762) {
      const scopeValue763 = window.imApp?.validateStatusTemplate?.({
        enabled: true,
        prompt: scopeValue762?.prompt,
        regex: scopeValue762?.regex,
        html: scopeValue762?.html
      });
      if (!scopeValue763?.valid) throw new Error(scopeValue763?.error || "状态栏模板格式无效");
      return scopeValue763.template;
    }
    function scopeValue194() {
      const scopeValue764 = scopeValue193(scopeValue190(true));
      return {
        format: scopeValue191,
        version: scopeValue192,
        template: {
          prompt: scopeValue764.prompt,
          regex: scopeValue764.regex,
          html: scopeValue764.html
        }
      };
    }
    function scopeValue195(scopeValue765) {
      let scopeValue766;
      try {
        scopeValue766 = JSON.parse(String(scopeValue765 || ""));
      } catch (scopeValue767) {
        throw new Error("模板文件不是有效 JSON");
      }
      if (!scopeValue766 || typeof scopeValue766 !== "object" || Array.isArray(scopeValue766) || scopeValue766.format !== scopeValue191 || scopeValue766.version !== scopeValue192 || !scopeValue766.template || typeof scopeValue766.template !== "object" || Array.isArray(scopeValue766.template)) throw new Error("不是可识别的状态栏模板文件");
      return scopeValue193(scopeValue766.template);
    }
    function scopeValue196(scopeValue768) {
      if (scopeValue130) scopeValue130.value = scopeValue768.prompt;
      if (scopeValue131) scopeValue131.value = scopeValue768.regex;
      if (scopeValue132) scopeValue132.value = scopeValue768.html;
      scopeValue177("status");
    }
    function scopeValue197(scopeValue769 = scopeValue186()) {
      const scopeValue770 = scopeValue769?.statusTemplate && typeof scopeValue769.statusTemplate === "object" ? scopeValue769.statusTemplate : scopeValue184();
      if (scopeValue130) scopeValue130.value = scopeValue770.prompt || scopeValue184().prompt;
      if (scopeValue131) scopeValue131.value = scopeValue770.regex || scopeValue184().regex;
      if (scopeValue132) scopeValue132.value = scopeValue770.html || scopeValue184().html;
      if (scopeValue145) scopeValue145.value = scopeValue769?.statusCssPrompt || "";
      if (scopeValue146) scopeValue146.value = scopeValue769?.statusCss || "";
      scopeValue189(scopeValue188(scopeValue769));
    }
    async function scopeValue198(scopeValue771 = scopeValue186()) {
      if (!scopeValue771 || scopeValue771.type === "group" || scopeValue771._statusTemplateNeedsPersistence !== true || !window.imApp?.commitScopedFriendChange) return true;
      return window.imApp.commitScopedFriendChange(scopeValue771, scopeValue772 => {
        (!scopeValue772.statusTemplate || typeof scopeValue772.statusTemplate !== "object") && (scopeValue772.statusTemplate = window.imApp?.createDefaultStatusTemplate ? window.imApp.createDefaultStatusTemplate({
          enabled: scopeValue772.statusPromptEnabled === true,
          prompt: scopeValue772.statusPrompt
        }) : scopeValue184());
        !["template", "css", "default"].includes(scopeValue772.statusRenderMode) && (scopeValue772.statusRenderMode = scopeValue772.statusTemplate.enabled ? "template" : "default");
        delete scopeValue772._statusTemplateNeedsPersistence;
      }, {
        silent: true,
        syncSettings: true
      });
    }
    function scopeValue199(scopeValue773) {
      if (!scopeValue773 || scopeValue773.type === "group") return;
      if (window.imChat?.refreshProfilePanel) {
        window.imChat.refreshProfilePanel(scopeValue773);
        return;
      }
      const scopeValue774 = document.getElementById("chat-interface-" + scopeValue773.id),
        scopeValue775 = scopeValue774?.querySelector(".chat-profile-panel-overlay.active");
      scopeValue775 && window.imChat?.renderProfilePanel && window.imChat.renderProfilePanel(scopeValue773, scopeValue775);
    }
    function scopeValue200(scopeValue776) {
      return window.imApp?.getFriendById?.(scopeValue776?.id) || scopeValue776 || scopeValue186();
    }
    async function scopeValue201() {
      const scopeValue777 = scopeValue186();
      if (!scopeValue777) return showToast("请先在上方选择一个单聊好友"), false;
      const scopeValue778 = window.imApp?.validateStatusTemplate?.(scopeValue190(true));
      if (!scopeValue778?.valid) return showToast(scopeValue778?.error || "状态栏模板校验失败"), false;
      const scopeValue779 = await window.imApp.commitScopedFriendChange(scopeValue777, scopeValue781 => {
        scopeValue781.statusTemplate = scopeValue778.template;
        scopeValue781.statusRenderMode = "template";
        delete scopeValue781._statusTemplateNeedsPersistence;
      }, {
        silent: true,
        syncSettings: true
      });
      if (!scopeValue779) return showToast("状态栏模板保存失败"), false;
      const scopeValue780 = scopeValue200(scopeValue777);
      return window.imApp.applyFriendStatusBarCss?.(scopeValue780), scopeValue199(scopeValue780), scopeValue220(scopeValue780), scopeValue189("template"), showToast("已应用 HTML 状态栏模板"), true;
    }
    async function scopeValue202() {
      const scopeValue782 = scopeValue186();
      if (!scopeValue782) return showToast("请先在上方选择一个单聊好友"), false;
      const scopeValue783 = String(scopeValue146?.value || ""),
        scopeValue784 = String(scopeValue145?.value || "").trim(),
        scopeValue785 = scopeValue783.trim() ? Date.now() : 0,
        scopeValue786 = await window.imApp.commitScopedFriendChange(scopeValue782, scopeValue788 => {
          scopeValue788.statusCss = scopeValue783;
          scopeValue788.statusCssEnabled = !!scopeValue783.trim();
          scopeValue788.statusCssPrompt = scopeValue784;
          scopeValue788.statusCssAppliedAt = scopeValue785;
          scopeValue788.statusRenderMode = scopeValue783.trim() ? "css" : "default";
        }, {
          silent: true,
          syncSettings: true
        });
      if (!scopeValue786) return showToast("状态栏 CSS 保存失败"), false;
      const scopeValue787 = scopeValue200(scopeValue782);
      return window.imApp.applyFriendStatusBarCss?.(scopeValue787), scopeValue199(scopeValue787), scopeValue189(scopeValue783.trim() ? "css" : "default"), scopeValue220(scopeValue787), showToast(scopeValue783.trim() ? "已应用纯 CSS 状态栏" : "已恢复系统默认状态栏"), true;
    }
    async function scopeValue203() {
      const scopeValue789 = scopeValue186();
      if (!scopeValue789) return scopeValue189("default"), showToast("先选择单聊好友后即可应用系统默认状态栏"), false;
      const scopeValue790 = await window.imApp.commitScopedFriendChange(scopeValue789, scopeValue792 => {
        scopeValue792.statusRenderMode = "default";
        scopeValue792.statusCssAppliedAt = 0;
      }, {
        silent: true,
        syncSettings: true
      });
      if (!scopeValue790) return showToast("恢复系统默认状态栏失败"), false;
      const scopeValue791 = scopeValue200(scopeValue789);
      return window.imApp.applyFriendStatusBarCss?.(scopeValue791), scopeValue199(scopeValue791), scopeValue189("default"), showToast("已使用系统默认状态栏"), true;
    }
    function scopeValue204() {
      if (!window.confirm("清空模板草稿？保存并应用后才会影响当前状态栏。")) return;
      const scopeValue793 = scopeValue184();
      if (scopeValue130) scopeValue130.value = scopeValue793.prompt;
      if (scopeValue131) scopeValue131.value = scopeValue793.regex;
      if (scopeValue132) scopeValue132.value = scopeValue793.html;
      scopeValue177("status");
      showToast("模板草稿已恢复默认，等待保存并应用");
    }
    function scopeValue205() {
      if (!window.confirm("清空 CSS 草稿？保存并应用后才会影响当前状态栏。")) return;
      if (scopeValue146) scopeValue146.value = "";
      scopeValue177("status");
      showToast("CSS 草稿已清空，等待保存并应用");
    }
    function scopeValue206() {
      const scopeValue794 = String(scopeValue143?.value || scopeValue188());
      if (scopeValue794 === "css") {
        scopeValue205();
        return;
      }
      if (scopeValue794 === "template") scopeValue204();
    }
    scopeValue142?.addEventListener("change", () => {
      const scopeValue795 = String(scopeValue142.value || "").trim();
      if ((scopeValue175("bubble") || scopeValue175("status")) && !window.confirm("切换好友会放弃当前好友与状态栏的未保存修改，确定继续吗？")) {
        scopeValue142.value = scopeValue156;
        return;
      }
      scopeValue156 = scopeValue795;
      const scopeValue796 = scopeValue186();
      if (scopeValue166 === "friend") scopeValue171();
      if (scopeValue113) scopeValue113.value = scopeValue796?.customCss || "";
      scopeValue197(scopeValue796);
      if (scopeValue152) scopeValue152.value = "";
      void scopeValue198(scopeValue796);
      scopeValue220(scopeValue796);
      scopeValue178("bubble");
      scopeValue178("status");
      scopeValue179(scopeValue796);
      scopeValue182("bubble");
    });
    scopeValue143?.addEventListener("change", () => {
      scopeValue189(scopeValue143.value);
      scopeValue177("status");
    });
    scopeValue133?.addEventListener("click", async () => {
      const scopeValue797 = scopeValue186();
      if (!scopeValue797) {
        showToast("请先在上方选择一个单聊好友");
        return;
      }
      const scopeValue798 = String(scopeValue143?.value || "template");
      if (!["template", "css"].includes(scopeValue798)) {
        showToast("请先选择 HTML 模板或纯 CSS 并保存，再生成最新状态");
        return;
      }
      if (!window.imChat?.generateProfileStatus) {
        showToast("状态生成器尚未就绪，请稍后再试");
        return;
      }
      scopeValue133.disabled = true;
      try {
        if (!(await scopeValue100("status"))) return;
        const scopeValue799 = scopeValue200(scopeValue797),
          scopeValue800 = await window.imChat.generateProfileStatus(scopeValue799, {
            reveal: true
          });
        if (!scopeValue800?.success) {
          showToast(scopeValue800?.reason || "状态生成失败");
          return;
        }
        showToast("已生成并展示最新状态");
      } finally {
        scopeValue133.disabled = false;
      }
    });
    scopeValue137?.addEventListener("click", scopeValue206);
    scopeValue140?.addEventListener("click", async () => {
      try {
        const scopeValue801 = new Blob([JSON.stringify(scopeValue194(), null, 2)], {
            type: "application/json;charset=utf-8"
          }),
          scopeValue802 = await window.u2ExportFile({
            blob: scopeValue801,
            fileName: "u2-imessage-status-template-" + new Date().toISOString().slice(0, 10) + ".json",
            title: "iMessage 状态栏模板"
          });
        if (scopeValue802 === "shared" || scopeValue802 === "downloaded") showToast("状态栏模板已导出");else {
          if (scopeValue802 === "failed") showToast("状态栏模板导出失败");
        }
      } catch (scopeValue803) {
        console.error("Failed to export iMessage status template", scopeValue803);
        showToast(scopeValue803?.message || "状态栏模板导出失败");
      }
    });
    scopeValue139?.addEventListener("click", () => scopeValue141?.click());
    scopeValue141?.addEventListener("change", async () => {
      const scopeValue804 = scopeValue141.files?.[0];
      scopeValue141.value = "";
      if (!scopeValue804) return;
      if (!String(scopeValue804.name || "").toLowerCase().endsWith(".json")) {
        showToast("请选择 JSON 状态栏模板文件");
        return;
      }
      try {
        const scopeValue805 = scopeValue195(await scopeValue804.text());
        if (String(scopeValue130?.value || "").trim() || String(scopeValue131?.value || "").trim() || String(scopeValue132?.value || "").trim()) {
          if (!window.confirm("导入会替换当前未应用的状态栏模板内容，确定继续吗？")) return;
        }
        scopeValue196(scopeValue805);
        showToast("状态栏模板已导入，请确认内容后点击应用");
      } catch (scopeValue806) {
        console.error("Failed to import iMessage status template", scopeValue806);
        showToast(scopeValue806?.message || "状态栏模板导入失败");
      }
    });
    [scopeValue130, scopeValue131, scopeValue132].forEach(scopeValue807 => {
      scopeValue807?.addEventListener("input", () => {
        scopeValue177("status");
      });
    });
    function scopeValue207(scopeValue808 = scopeValue99()) {
      if (scopeValue808 === "home") return scopeValue107;
      if (scopeValue808 === "chat") return scopeValue119;
      if (scopeValue808 === "group") return scopeValue121;
      if (scopeValue808 === "status") return scopeValue146;
      return scopeValue113;
    }
    document.querySelectorAll("[data-theme-draft-section]").forEach(scopeValue809 => {
      scopeValue809.addEventListener("input", () => {
        const scopeValue810 = scopeValue809.getAttribute("data-theme-draft-section");
        if (scopeValue810 === "chat") scopeValue170();else scopeValue177(scopeValue810);
        if (scopeValue810 === "bubble") scopeValue182("bubble");
      });
    });
    document.querySelectorAll("[data-theme-apply-type]").forEach(scopeValue811 => {
      scopeValue811.addEventListener("click", () => {
        const scopeValue812 = scopeValue811.getAttribute("data-theme-apply-type");
        scopeValue100(scopeValue812)["catch"](scopeValue813 => {
          console.warn("Failed to save iMessage Theme workspace:", scopeValue813);
          showToast("Theme 保存失败，当前效果未持久化");
        });
      });
    });
    async function scopeValue208(scopeValue814) {
      const scopeValue815 = String(scopeValue814?.name || "").toLowerCase();
      if (!scopeValue815.endsWith(".txt") && !scopeValue815.endsWith(".docx")) throw new Error("仅支持 TXT 和 DOCX 文件");
      let scopeValue816 = "";
      if (scopeValue815.endsWith(".docx")) {
        await window.u2LoadVendorLibrary?.("mammoth");
        if (!window.mammoth?.extractRawText) throw new Error("DOCX 解析组件未加载，请检查网络后重试");
        const scopeValue818 = await window.mammoth.extractRawText({
          arrayBuffer: await scopeValue814.arrayBuffer()
        });
        scopeValue816 = String(scopeValue818?.value || "");
      } else scopeValue816 = String(await scopeValue814.text());
      const scopeValue817 = scopeValue816.replace(/\r\n?/g, `
`).replace(/\u0000/g, "");
      if (!scopeValue817.trim()) throw new Error("文件内容为空");
      return scopeValue817;
    }
    scopeValue153 && scopeValue154.length && (scopeValue154.forEach(scopeValue819 => {
      scopeValue819.addEventListener("click", () => {
        scopeValue155 = scopeValue819.getAttribute("data-theme-import-type") || scopeValue99();
        scopeValue153.click();
      });
    }), scopeValue153.addEventListener("change", async () => {
      const scopeValue820 = scopeValue153.files?.[0],
        scopeValue821 = scopeValue155 || scopeValue99();
      scopeValue155 = "";
      scopeValue153.value = "";
      if (!scopeValue820) return;
      try {
        const scopeValue822 = await scopeValue208(scopeValue820),
          scopeValue823 = scopeValue207(scopeValue821);
        if (!scopeValue823) throw new Error("未找到 CSS 编辑器");
        if (scopeValue823.value.trim() && !window.confirm("导入内容会替换当前未应用的 CSS，确定继续吗？")) return;
        scopeValue823.value = scopeValue822;
        scopeValue823.dispatchEvent(new Event("input", {
          bubbles: true
        }));
        showToast("CSS 已导入，请确认后点击应用");
      } catch (scopeValue824) {
        console.error("Failed to import Theme CSS", scopeValue824);
        showToast(scopeValue824?.message || "CSS 导入失败");
      }
    }));
    function scopeValue209(scopeValue825, scopeValue826, scopeValue827) {
      if (!window.confirm("清空" + scopeValue827 + "草稿？保存并应用后才会影响界面。")) return;
      if (scopeValue826) scopeValue826.value = "";
      scopeValue177(scopeValue825);
      if (scopeValue825 === "chat") scopeValue170();
      if (scopeValue825 === "bubble") scopeValue182("bubble");
      showToast(scopeValue827 + "草稿已清空，等待保存并应用");
    }
    function scopeValue210() {
      scopeValue209("home", scopeValue107, "首页与会话列表样式");
    }
    scopeValue108?.addEventListener("click", scopeValue210);
    scopeValue114?.addEventListener("click", () => scopeValue209("bubble", scopeValue113, "当前好友气泡样式"));
    scopeValue120?.addEventListener("click", () => scopeValue209("chat", scopeValue119, "聊天页样式"));
    scopeValue122?.addEventListener("click", () => scopeValue209("group", scopeValue121, "群聊样式"));
    function scopeValue211(scopeValue828, scopeValue829, scopeValue830) {
      scopeValue828?.addEventListener("click", () => {
        navigator.clipboard.writeText(scopeValue829).then(() => {
          showToast(scopeValue830);
        })["catch"](scopeValue831 => {
          console.error("Copy failed", scopeValue831);
          showToast("复制失败");
        });
      });
    }
    scopeValue211(scopeValue109, `:scope {
  background: #ffffff;
}
:scope .line-header {
  background: rgba(255, 255, 255, 0.96);
}
:scope .line-content {
  color: #111111;
}
:scope .line-profile,
:scope .line-search-bar,
:scope .line-service-item,
:scope .line-list-item {
  background: #ffffff;
  border-color: #f2f2f7;
}
:scope .line-bottom-nav {
  background: rgba(255, 255, 255, 0.92);
}
:scope .chats-content,
:scope .chats-list-container {
  background: transparent;
}
:scope .chat-item {
  background: #ffffff;
  border-color: #f2f2f7;
}
:scope .chat-avatar {
  border-radius: 50%;
}
:scope .chat-name { color: #111111; }
:scope .chat-message,
:scope .chat-time { color: #8e8e93; }
:scope .chats-empty-state { color: #111111; }`, "已复制 Home 与 Chats 界面源码");
    scopeValue115 && scopeValue115.addEventListener("click", () => {
      const scopeValue832 = `/* iMessage 当前单聊 UI；:scope 表示当前聊天页。 */

:scope .ins-chat-messages.avatar-mode-two {
    --im-message-avatar-size: calc(37px * var(--theme-font-scale, 1));
    --im-message-avatar-gap: calc(8px * var(--theme-font-scale, 1));
    --im-message-avatar-radius: 50%;
}
:scope .ins-chat-messages.avatar-mode-two .chat-row:has(> .im-message-avatar) {
    position: relative;
    box-sizing: border-box;
    margin-top: calc(12px * var(--theme-font-scale, 1)) !important;
}
:scope .ins-chat-messages.avatar-mode-two .chat-row:has(> .im-message-avatar):first-child {
    margin-top: 0 !important;
}
:scope .ins-chat-messages.avatar-mode-two .chat-row > .im-message-avatar {
    display: block;
}
:scope .ins-chat-messages.avatar-mode-two .chat-row.user-row:has(> .im-message-avatar) {
    padding-right: calc(var(--im-message-avatar-size) + var(--im-message-avatar-gap));
}
:scope .ins-chat-messages.avatar-mode-two .chat-row.ai-row:has(> .im-message-avatar) {
    padding-left: calc(var(--im-message-avatar-size) + var(--im-message-avatar-gap));
}
:scope .im-message-avatar.is-user {
    right: 0;
}
:scope .im-message-avatar.is-assistant {
    left: 0;
}
:scope
    .ins-chat-messages.avatar-mode-two
    .chat-row.user-row:has(> .im-message-avatar)
    .user-bubble,
:scope
    .ins-chat-messages.avatar-mode-two
    .chat-row.ai-row:has(> .im-message-avatar)
    .ai-bubble {
    border-radius: 20px !important;
}
:scope .chat-timestamp {
    margin: 16px 0 6px;
    padding: 10px 0 5px;
    flex-direction: column;
    align-items: center;
    color: #8e8e93;
    font-size: 11px;
}
:scope .chat-timestamp::before {
    content: 'iMessage';
    display: block;
    margin-bottom: -1px;
    color: #8e8e93;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.2px;
}
:scope .chat-timestamp span {
    padding: 0;
    border-radius: 0;
    background: transparent;
    color: #8e8e93;
    font-size: 11px;
    font-weight: 400;
}
:scope .chat-bubble:is(:not(.im-card-bubble):not(.voice-message-bubble), .im-text-bubble-shell) {
    max-width: 77%;
    padding: calc(8px * var(--theme-font-scale, 1)) calc(12px * var(--theme-font-scale, 1));
    border: 0;
    border-radius: calc(22px * var(--theme-font-scale, 1));
    box-shadow: none;
    font-size: 15px;
    line-height: 1.5;
}
:scope .user-bubble:is(:not(.im-card-bubble):not(.voice-message-bubble), .im-text-bubble-shell) {
    background-color: #a0a0a0;
    color: #fff;
}
:scope .ai-bubble:is(:not(.im-card-bubble):not(.voice-message-bubble), .im-text-bubble-shell) {
    background-color: #e9e9ea;
    color: #000;
}
:scope .user-row.has-prev .user-bubble:is(:not(.im-card-bubble):not(.voice-message-bubble), .im-text-bubble-shell),
:scope .user-row.has-next .user-bubble:is(:not(.im-card-bubble):not(.voice-message-bubble), .im-text-bubble-shell),
:scope .ai-row.has-prev .ai-bubble:is(:not(.im-card-bubble):not(.voice-message-bubble), .im-text-bubble-shell),
:scope .ai-row.has-next .ai-bubble:is(:not(.im-card-bubble):not(.voice-message-bubble), .im-text-bubble-shell) {
    border-radius: 22px;
}
:scope
    .chat-row:not(.has-next)
    .chat-bubble:is(:not(.im-card-bubble):not(.voice-message-bubble), .im-text-bubble-shell)::after {
    content: '';
    position: absolute;
    width: 15px;
    height: 15px;
    display: block;
    background-repeat: no-repeat;
    background-size: contain;
}
:scope
    .chat-row:not(.has-next)
    .user-bubble:is(:not(.im-card-bubble):not(.voice-message-bubble), .im-text-bubble-shell)::after {
    right: 7px;
    bottom: -5px;
    transform-origin: bottom left;
    transform: rotate(16deg);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath d='M14.385 165.341h723.828s-102.718 111.789 136.16 498.070c199.609 111.789 29.591 144.852-58.757 137.075-97.893-15.633-301.441-20.846-861.266-208.137z' fill='%23a0a0a0'/%3E%3C/svg%3E");
}
:scope
    .chat-row:not(.has-next)
    .ai-bubble:is(:not(.im-card-bubble):not(.voice-message-bubble), .im-text-bubble-shell)::after {
    left: -7px;
    bottom: -10px;
    transform-origin: bottom right;
    transform: rotate(-16deg) scaleX(-1);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath d='M14.385 165.341h723.828s-102.718 111.789 136.16 498.070c199.609 111.789 29.591 144.852-58.757 137.075-97.893-15.633-301.441-20.846-861.266-208.137z' fill='%23e9e9ea'/%3E%3C/svg%3E");
}`;
      navigator.clipboard.writeText(scopeValue832).then(() => {
        if (window.showToast) window.showToast("已复制真实气泡源码");
      })["catch"](scopeValue833 => {
        console.error("Copy failed", scopeValue833);
        if (window.showToast) window.showToast("复制失败");
      });
    });
    scopeValue116 && scopeValue116.addEventListener("click", () => {
      const scopeValue834 = `/* iMessage 当前单聊 UI；:scope 表示当前聊天页。 */

:scope .ins-chat-messages.avatar-mode-two {
    --im-message-avatar-size: calc(37px * var(--theme-font-scale, 1));
    --im-message-avatar-gap: calc(8px * var(--theme-font-scale, 1));
    --im-message-avatar-radius: 50%;
}
:scope .ins-chat-messages.avatar-mode-two .chat-row:has(> .im-message-avatar) {
    position: relative;
    box-sizing: border-box;
    margin-top: calc(12px * var(--theme-font-scale, 1)) !important;
}
:scope .ins-chat-messages.avatar-mode-two .chat-row:has(> .im-message-avatar):first-child {
    margin-top: 0 !important;
}
:scope .ins-chat-messages.avatar-mode-two .chat-row > .im-message-avatar {
    display: block;
}
:scope .ins-chat-messages.avatar-mode-two .chat-row.user-row:has(> .im-message-avatar) {
    padding-right: calc(var(--im-message-avatar-size) + var(--im-message-avatar-gap));
}
:scope .ins-chat-messages.avatar-mode-two .chat-row.ai-row:has(> .im-message-avatar) {
    padding-left: calc(var(--im-message-avatar-size) + var(--im-message-avatar-gap));
}
:scope .im-message-avatar.is-user {
    right: 0;
}
:scope .im-message-avatar.is-assistant {
    left: 0;
}
:scope
    .ins-chat-messages.avatar-mode-two
    .chat-row.user-row:has(> .im-message-avatar)
    .user-bubble,
:scope
    .ins-chat-messages.avatar-mode-two
    .chat-row.ai-row:has(> .im-message-avatar)
    .ai-bubble {
    border-radius: 20px !important;
}
:scope .user-row.has-prev .voice-message-bubble,
:scope .user-row.has-next .voice-message-bubble {
    border-radius: 22px;
}
:scope .user-row .voice-message-bubble {
    background: #a0a0a0;
    color: #fff;
}
:scope .user-row:not(.has-next) .voice-message-bubble::after {
    content: '';
    position: absolute;
    width: 15px;
    height: 15px;
    bottom: -5px;
    display: block;
    background-repeat: no-repeat;
    background-size: contain;
    right: 7px;
    transform: rotate(16deg);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath d='M14.385 165.341h723.828s-102.718 111.789 136.16 498.070c199.609 111.789 29.591 144.852-58.757 137.075-97.893-15.633-301.441-20.846-861.266-208.137z' fill='%23a0a0a0'/%3E%3C/svg%3E");
}
:scope .typing-row {
    min-height: 56px;
    margin: 8px 0 10px;
    position: relative;
}
:scope .typing-indicator {
    width: 76px;
    height: 48px;
    margin: 0 0 0 4px;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    position: relative;
    overflow: visible;
}
:scope .typing-indicator .typing-dot {
    display: none;
}
:scope .typing-indicator::before {
    content: '';
    position: absolute;
    left: 4px;
    bottom: 2px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #e9e9ea;
    box-shadow: -8px 6px 0 -4px #e9e9ea;
    z-index: 1;
}
:scope .typing-indicator::after {
    content: '';
    position: absolute;
    left: 10px;
    bottom: 0;
    width: 60px;
    height: 36px;
    border-radius: 20px;
    background-color: #e9e9ea;
    background-image:
        radial-gradient(circle, rgba(142, 142, 147, 1) 50%, transparent 55%),
        radial-gradient(circle, rgba(142, 142, 147, 0.3) 50%, transparent 55%),
        radial-gradient(circle, rgba(142, 142, 147, 0.3) 50%, transparent 55%);
    background-size: 10px 10px;
    background-repeat: no-repeat;
    background-position:
        14px 14px,
        26px 14px,
        38px 14px;
    animation: imChatTypingDots 1s infinite linear;
    z-index: 2;
}
:scope .ins-chat-input-container {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 22px;
    width: 100%;
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
    -webkit-backdrop-filter: none !important;
    backdrop-filter: none !important;
    z-index: 30;
    pointer-events: none;
    padding: 10px 15px calc(5px + env(safe-area-inset-bottom, 0px)) !important;
}
:scope .ins-chat-input-wrapper {
    position: relative;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent !important;
    box-shadow: none !important;
    min-height: 42px !important;
    gap: 10px !important;
}
:scope .ins-chat-input-wrapper::before {
    background-color: rgba(255, 255, 255, 0.15) !important;
    -webkit-backdrop-filter: blur(5px) saturate(200%) !important;
    backdrop-filter: blur(5px) saturate(200%) !important;
    box-shadow:
        inset 0 1px 1px -0.5px rgba(255, 255, 255, 0.6),
        inset 0 -0.5px 1px -0.5px rgba(255, 255, 255, 0.1),
        0 0 0 0.7px rgba(255, 255, 255, 0.2),
        0 2px 6px rgba(0, 0, 0, 0.06) !important;
    content: '';
    position: absolute;
    inset: 0 0 0 52px;
    pointer-events: none;
    left: 52px !important;
    border-radius: 25px !important;
}
:scope .ins-input-icon {
    margin: 0;
    padding: 0;
    border-radius: 50%;
    background-clip: border-box;
    color: #000;
    font-weight: 300;
    z-index: 1;
    width: 39px !important;
    height: 39px !important;
    font-size: 24px !important;
}
:scope .ins-message-input {
    padding: 0 6px 0 18px;
    color: #111;
    z-index: 1;
    height: 42px !important;
    padding-left: 18px !important;
    font-size: 16px !important;
}
:scope .send-btn-icon {
    background: transparent;
    font-size: 17px;
    width: 24px !important;
    height: 24px !important;
    flex-basis: 24px !important;
}
:scope .mic-btn::after {
    content: '';
    display: block;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238e8e93' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z'/%3E%3Cpath d='M19 10v2a7 7 0 0 1-14 0v-2'/%3E%3Cline x1='12' y1='19' x2='12' y2='23'/%3E%3Cline x1='8' y1='23' x2='16' y2='23'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    width: 20px !important;
    height: 20px !important;
}
:scope .im-chat-input-actions {
    z-index: 1;
    gap: 3px !important;
    padding-right: 7px !important;
}
:scope .user-row .voice-message-bubble {
    max-width: min(77%, 240px) !important;
    padding: 8px 12px !important;
    align-self: flex-end !important;
    box-sizing: border-box !important;
    width: max-content !important;
    min-width: 0 !important;
    height: auto !important;
    min-height: 0 !important;
    max-height: none !important;
    flex: 0 0 auto !important;
}
:scope .user-row .voice-message-bubble-inner {
    width: max-content !important;
    height: auto !important;
    min-height: 0 !important;
    max-height: none !important;
    flex: 0 0 auto !important;
}
:scope {
    --im-chat-message-top-space: 110px;
    --im-chat-message-padding-x: 15px;
    --im-chat-input-container-bg: transparent;
    --im-chat-input-bg: transparent;
    --im-chat-input-space: calc(72px + env(safe-area-inset-bottom, 0px));
    background-color: #feffff !important;
    background-image: var(--im-chat-bg-image, none) !important;
}
:scope .chat-sticky-container.is-friend {
    min-height: 128px;
    padding-bottom: 38px;
    box-sizing: border-box;
    border: 0;
    background: linear-gradient(to bottom, #feffff 25%, rgba(254, 255, 255, 0) 100%);
}
:scope .im-chat-top-bar {
    min-height: 108px;
    padding: 0 15px !important;
    box-sizing: border-box;
}
:scope .im-chat-header-left {
    display: contents;
}
:scope .im-chat-header-main {
    position: absolute;
    top: 23px;
    left: 50%;
    width: auto;
    margin: 0;
    transform: translateX(-50%);
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    z-index: 3;
}
:scope .im-chat-avatar-wrap,
:scope .ins-chat-avatar {
    width: 55px;
    height: 55px;
}
:scope .im-chat-avatar-wrap {
    position: relative;
    z-index: 5;
}
:scope .ins-chat-avatar {
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}
:scope .im-chat-title-wrap {
    height: 32px;
    min-width: 66px;
    max-width: min(56vw, 240px);
    margin: -1px 0 0;
    padding: 4px 27px 4px 16px;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.15);
    -webkit-backdrop-filter: blur(5px) saturate(200%);
    backdrop-filter: blur(5px) saturate(200%);
    box-shadow:
        inset 0 1px 1px -0.5px rgba(255, 255, 255, 0.6),
        inset 0 -0.5px 1px -0.5px rgba(255, 255, 255, 0.1),
        0 0 0 0.7px rgba(255, 255, 255, 0.2),
        0 2px 6px rgba(0, 0, 0, 0.06);
    position: relative;
    z-index: 2;
}
:scope .im-chat-title-wrap::after {
    content: '\\203A';
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-55%);
    color: #b3b3b6;
    font-size: 28px;
    font-weight: 400;
    line-height: 1;
}
:scope .ins-chat-name {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #2d2d2d;
    font-size: 18px;
    font-weight: 600;
    line-height: 1;
}
:scope .im-chat-back-btn,
:scope .im-chat-icon-btn,
:scope .ins-input-icon,
:scope .ins-chat-input-wrapper::before {
    background-color: rgba(255, 255, 255, 0.15);
    -webkit-backdrop-filter: blur(5px) saturate(200%);
    backdrop-filter: blur(5px) saturate(200%);
    box-shadow:
        inset 0 1px 1px -0.5px rgba(255, 255, 255, 0.6),
        inset 0 -0.5px 1px -0.5px rgba(255, 255, 255, 0.1),
        0 0 0 0.7px rgba(255, 255, 255, 0.2),
        0 2px 6px rgba(0, 0, 0, 0.06);
}
:scope .im-chat-back-btn {
    position: absolute;
    top: 9px;
    left: 15px;
    width: 42px;
    min-width: 42px;
    height: 42px;
    padding: 0;
    gap: 0;
    border-radius: 30px;
    box-sizing: border-box;
    transition:
        min-width 0.2s ease,
        width 0.2s ease,
        padding 0.2s ease;
}
:scope .im-chat-back-btn.has-count {
    width: auto;
    min-width: 65px;
    max-width: min(38vw, 180px);
    padding: 0 8px 0 6px;
    gap: 5px;
}
:scope .im-chat-back-restore-hotspot {
    position: absolute;
    top: 9px;
    height: 42px;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    touch-action: manipulation;
    left: 59px !important;
    width: 38px !important;
    z-index: 80 !important;
    pointer-events: auto !important;
}
:scope .im-chat-back-restore-hotspot[hidden] {
    display: none !important;
}
:scope .im-chat-back-chevron {
    width: 22px;
    height: 24px;
    fill: none;
    stroke: #000;
    stroke-width: 3.6;
    stroke-linecap: round;
    stroke-linejoin: round;
    pointer-events: none;
}
:scope .im-chat-back-count {
    display: inline-flex;
    min-width: 24px;
    height: 24px;
    padding: 0 7px;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border-radius: 999px;
    background: #000;
    color: #fff;
    font-size: 14px;
    font-weight: 800;
    line-height: 1;
    cursor: text;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
:scope .im-chat-back-count[hidden] {
    display: none !important;
}
:scope .im-chat-actions {
    position: absolute;
    top: 9px;
    right: 15px;
}
:scope .im-chat-icon-btn {
    width: 42px;
    height: 42px;
    padding: 0;
    border-radius: 50%;
    color: #000;
    font-size: 21px;
}
:scope .im-chat-icon-btn svg {
    width: 24px;
    height: 24px;
    fill: none;
    stroke: #000;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}
:scope .ins-chat-messages {
    padding-top: calc(110px + env(safe-area-inset-top, 0px));
    gap: 3px;
    padding-bottom: calc(var(--im-chat-input-space) + 22px);
}
:scope .chat-timestamp {
    margin: 16px 0 6px;
    padding: 10px 0 5px;
    flex-direction: column;
    align-items: center;
    color: #8e8e93;
    font-size: 11px;
}
:scope .chat-timestamp::before {
    content: 'iMessage';
    display: block;
    margin-bottom: -1px;
    color: #8e8e93;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.2px;
}
:scope .chat-timestamp span {
    padding: 0;
    border-radius: 0;
    background: transparent;
    color: #8e8e93;
    font-size: 11px;
    font-weight: 400;
}
:scope .chat-row.user-row + .chat-row.ai-row,
:scope .chat-row.ai-row + .chat-row.user-row {
    margin-top: 35px;
}
:scope .chat-bubble:is(:not(.im-card-bubble):not(.voice-message-bubble), .im-text-bubble-shell) {
    max-width: 77%;
    padding: calc(8px * var(--theme-font-scale, 1)) calc(12px * var(--theme-font-scale, 1));
    border: 0;
    border-radius: calc(22px * var(--theme-font-scale, 1));
    box-shadow: none;
    font-size: 15px;
    line-height: 1.5;
}
:scope .user-bubble:is(:not(.im-card-bubble):not(.voice-message-bubble), .im-text-bubble-shell) {
    background-color: #a0a0a0;
    color: #fff;
}
:scope .ai-bubble:is(:not(.im-card-bubble):not(.voice-message-bubble), .im-text-bubble-shell) {
    background-color: #e9e9ea;
    color: #000;
}
:scope .user-row.has-prev .user-bubble:is(:not(.im-card-bubble):not(.voice-message-bubble), .im-text-bubble-shell),
:scope .user-row.has-next .user-bubble:is(:not(.im-card-bubble):not(.voice-message-bubble), .im-text-bubble-shell),
:scope .ai-row.has-prev .ai-bubble:is(:not(.im-card-bubble):not(.voice-message-bubble), .im-text-bubble-shell),
:scope .ai-row.has-next .ai-bubble:is(:not(.im-card-bubble):not(.voice-message-bubble), .im-text-bubble-shell) {
    border-radius: 22px;
}
:scope
    .chat-row:not(.has-next)
    .chat-bubble:is(:not(.im-card-bubble):not(.voice-message-bubble), .im-text-bubble-shell)::after {
    content: '';
    position: absolute;
    width: 15px;
    height: 15px;
    display: block;
    background-repeat: no-repeat;
    background-size: contain;
}
:scope
    .chat-row:not(.has-next)
    .user-bubble:is(:not(.im-card-bubble):not(.voice-message-bubble), .im-text-bubble-shell)::after {
    right: 7px;
    bottom: -5px;
    transform-origin: bottom left;
    transform: rotate(16deg);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath d='M14.385 165.341h723.828s-102.718 111.789 136.16 498.070c199.609 111.789 29.591 144.852-58.757 137.075-97.893-15.633-301.441-20.846-861.266-208.137z' fill='%23a0a0a0'/%3E%3C/svg%3E");
}
:scope
    .chat-row:not(.has-next)
    .ai-bubble:is(:not(.im-card-bubble):not(.voice-message-bubble), .im-text-bubble-shell)::after {
    left: -7px;
    bottom: -10px;
    transform-origin: bottom right;
    transform: rotate(-16deg) scaleX(-1);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath d='M14.385 165.341h723.828s-102.718 111.789 136.16 498.070c199.609 111.789 29.591 144.852-58.757 137.075-97.893-15.633-301.441-20.846-861.266-208.137z' fill='%23e9e9ea'/%3E%3C/svg%3E");
}
:scope .ins-chat-input-container > * {
    pointer-events: auto;
}
:scope .ins-message-input::placeholder {
    color: #999;
    opacity: 1;
}
:scope .send-btn {
    color: #8e8e93;
    opacity: 0;
}
:scope .mic-btn {
    color: #8e8e93;
    font-size: 0;
    position: relative;
}
:scope .mic-btn i {
    display: none;
}
@media (min-width: 768px) {
    :scope .chat-sticky-container.is-friend {
        min-height: 154px;
        padding-bottom: 46px;
    }
    :scope .im-chat-top-bar {
        min-height: 130px;
        padding-left: 24px !important;
        padding-right: 24px !important;
    }
    :scope .im-chat-header-main {
        top: 29px;
    }
    :scope .im-chat-avatar-wrap,

    :scope .ins-chat-avatar {
        width: 66px;
        height: 66px;
    }
    :scope .im-chat-title-wrap {
        height: 38px;
        min-width: 78px;
        max-width: min(46vw, 290px);
        padding: 5px 32px 5px 19px;
        border-radius: 24px;
    }
    :scope .ins-chat-name {
        font-size: 21px;
    }
    :scope .im-chat-back-btn,

    :scope .im-chat-icon-btn {
        top: 16px;
        width: 50px;
        min-width: 50px;
        height: 50px;
    }
    :scope .im-chat-actions {
        top: 16px;
        right: 24px;
    }
    :scope .im-chat-back-btn {
        left: 24px;
    }
    :scope .im-chat-back-chevron {
        width: 26px;
        height: 29px;
    }
    :scope .im-chat-back-btn.has-count {
        width: auto;
        min-width: 78px;
        max-width: min(30vw, 220px);
        padding: 0 10px 0 7px;
        gap: 6px;
    }
    :scope .im-chat-back-restore-hotspot {
        top: 16px;
        left: 82px;
        width: 112px;
        height: 50px;
    }
    :scope .im-chat-back-count {
        min-width: 28px;
        height: 28px;
        padding: 0 9px;
        font-size: 16px;
    }
    :scope .im-chat-icon-btn svg {
        width: 29px;
        height: 29px;
    }
    :scope .ins-chat-messages {
        padding-top: calc(134px + env(safe-area-inset-top, 0px));
        padding-left: 28px;
        padding-right: 28px;
    }
    :scope .ins-chat-input-container {
        padding: 13px 28px calc(10px + env(safe-area-inset-bottom, 0px));
    }
    :scope .ins-chat-input-wrapper {
        min-height: 50px;
        gap: 12px;
    }
    :scope .ins-chat-input-wrapper::before {
        left: 62px;
        border-radius: 30px;
    }
    :scope .ins-input-icon {
        width: 47px;
        height: 47px;
        font-size: 29px;
    }
    :scope .ins-message-input {
        height: 50px;
        padding-left: 22px;
        font-size: 18px;
    }
    :scope .send-btn-icon {
        width: 29px;
        height: 29px;
        flex-basis: 29px;
    }
    :scope .mic-btn::after {
        width: 24px;
        height: 24px;
    }
    :scope .im-chat-input-actions {
        gap: 6px;
        padding-right: 10px;
    }
    :scope .chat-timestamp,

    :scope .chat-timestamp span {
        font-size: 13px;
    }
    :scope .chat-timestamp::before {
        font-size: 14px;
    }
}
@media (min-width: 768px) {
    :scope .ins-chat-input-container {
        padding: 10px 15px calc(5px + env(safe-area-inset-bottom, 0px)) !important;
    }
    :scope .ins-chat-input-wrapper {
        min-height: 42px !important;
        gap: 10px !important;
    }
    :scope .ins-chat-input-wrapper::before {
        left: 52px !important;
        border-radius: 25px !important;
    }
    :scope .ins-input-icon {
        width: 39px !important;
        height: 39px !important;
        font-size: 24px !important;
    }
    :scope .ins-message-input {
        height: 42px !important;
        padding-left: 18px !important;
        font-size: 16px !important;
    }
    :scope .send-btn-icon {
        width: 24px !important;
        height: 24px !important;
        flex-basis: 24px !important;
    }
    :scope .mic-btn::after {
        width: 20px !important;
        height: 20px !important;
    }
    :scope .im-chat-input-actions {
        gap: 3px !important;
        padding-right: 7px !important;
    }
    :scope .im-chat-back-restore-hotspot {
        left: 70px !important;
        width: 42px !important;
    }
}
:scope .user-row .voice-message-bubble {
    max-width: min(70%, 240px) !important;
    width: max-content !important;
    min-width: 0 !important;
    height: auto !important;
    min-height: 0 !important;
    max-height: none !important;
    flex: 0 0 auto !important;
}`;
      navigator.clipboard.writeText(scopeValue834).then(() => {
        if (window.showToast) window.showToast("已复制真实单聊 Chat 源码");
      })["catch"](scopeValue835 => {
        console.error("Copy failed", scopeValue835);
        if (window.showToast) window.showToast("复制失败");
      });
    });
    scopeValue123 && scopeValue123.addEventListener("click", () => {
      const scopeValue836 = `/* iMessage Group CSS source
   Runtime root: .active-chat-interface.im-chat-group
   :scope represents that group-chat root. Card selectors below match the
   individual card styles rendered in group chats; height follows content with a cap. */

:scope {
  --group-chat-bg: #ffffff;
  --group-chat-input-bg: #ffffff;
  --group-chat-accent: #007aff;
  --im-group-header-surface: #ffffff;
  --im-group-header-shadow: 0 2px 10px rgba(0, 0, 0, .12);
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  background: var(--group-chat-bg);
}

:scope .chat-sticky-container.is-group {
  background: transparent;
  border-bottom: 0;
  z-index: 20;
}

/* 群聊悬浮顶栏：分别修改返回、标题胶囊和右侧头像即可生效。 */
:scope .im-chat-group-top-bar { display: grid; grid-template-columns: 40px minmax(0, 1fr) 40px; align-items: center; gap: 8px; padding: 0 16px; }
:scope .im-chat-group-header { display: flex; align-items: center; justify-content: center; min-width: 0; margin: 0; pointer-events: none; }
:scope .im-chat-group-back-btn,
:scope .group-header-right-avatar { width: 40px; height: 40px; border: 0; border-radius: 50%; background: var(--im-group-header-surface); box-shadow: var(--im-group-header-shadow); color: #1c1c1e; }
:scope .im-chat-group-back-btn { font-size: 18px; }
:scope .im-chat-group-title-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 0; max-width: min(100%, 210px); min-height: 40px; padding: 4px 14px; border-radius: 999px; background: var(--im-group-header-surface); box-shadow: var(--im-group-header-shadow); pointer-events: auto; cursor: pointer; }
:scope .im-chat-group-title-wrap .ins-chat-name,
:scope .im-chat-group-title-wrap .ins-chat-sign { display: block; max-width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-align: center; }
:scope .im-chat-group-title-wrap .ins-chat-name { color: #111; font-size: 14px; font-weight: 700; line-height: 1.15; }
:scope .im-chat-group-title-wrap .ins-chat-sign { margin-top: 0; color: #8e8e93; font-size: 11px; font-weight: 500; line-height: 1.2; }
:scope .im-chat-group-right { display: flex; justify-content: flex-end; min-width: 0; }
:scope .group-header-right-avatar-inner { width: 34px; height: 34px; }
:scope .ins-chat-messages { flex: 1; min-height: 0; background: transparent; }
:scope .ins-chat-input-container { background: var(--group-chat-input-bg); border-top: 1px solid #e5e5ea; }

:scope .group-ai-bubble-wrap { display: flex; align-items: flex-end; gap: 8px; }
:scope .group-ai-speaker-name { color: #6d6d72; font-size: 12px; }
:scope .group-ai-bubble-row { align-items: flex-end; }
:scope .group-ai-avatar-slot { width: 34px; height: 34px; }
:scope .group-ai-avatar-placeholder { background: #e5e5ea; color: #6d6d72; }

:scope .group-poll-card { width: min(232px, 64vw); border: 1px solid #e5e5ea; border-radius: 14px; background: #fff; }
:scope .group-poll-card-head { padding: 11px 12px 9px; border-bottom: 1px solid #f2f2f7; }
:scope .group-poll-card-kicker { color: var(--group-chat-accent); }
:scope .group-poll-card-title { color: #111; }
:scope .group-poll-card-options { padding: 0 10px; }
:scope .group-poll-card-option { border-color: #e5e5ea; }
:scope .group-poll-card-option.is-user-selected { border-color: var(--group-chat-accent); }
:scope .group-poll-radio { border-color: #8e8e93; }
:scope .group-poll-card-option.is-user-selected .group-poll-radio { border-color: var(--group-chat-accent); }
:scope .group-poll-voters, :scope .group-poll-voter { color: #6d6d72; }
:scope .group-poll-card-footer { color: #8e8e93; }

:scope .group-red-packet-card { width: 100%; max-width: 268px; padding: 12px 14px; border: 1px solid rgba(0,0,0,.08); border-radius: 18px; background: #fff; color: #111; }
:scope .group-red-packet-main { display: flex; align-items: center; gap: 12px; }
:scope .group-red-packet-icon { width: 40px; height: 40px; border-radius: 14px; background: #111; color: #fff; }
:scope .group-red-packet-title { color: #111; font-size: 15px; }
:scope .group-red-packet-status { color: #8e8e93; font-size: 12px; }
:scope .group-red-packet-amount { margin-top: 10px; color: #111; font-size: 26px; }
:scope .group-voice-call-record-card { max-width: 80%; padding: 10px 16px; border-radius: 18px; background: rgba(0, 0, 0, .05); }

:scope .chat-system-row .system-notice-card,
:scope .group-system-notice-card,
:scope .system-notice-group_join,
:scope .system-notice-group_left,
:scope .system-notice-red_packet_claim { background: rgba(142,142,147,.14); color: #6d6d72; }
:scope .group-private-chat-view-link { color: var(--group-chat-accent); }
`;
      navigator.clipboard.writeText(scopeValue836).then(() => {
        if (window.showToast) window.showToast("已复制 Group CSS 源码");
      })["catch"](scopeValue837 => {
        console.error("Copy failed", scopeValue837);
        if (window.showToast) window.showToast("复制失败");
      });
    });
    const scopeValue212 = `/* iMessage 真实状态资料卡源码（仅单聊）
   运行时根节点：.chat-profile-panel-overlay
   提示：在状态栏 CSS 编辑器里，:scope 代表当前好友的资料卡遮罩层。 */

:scope {
  background: rgba(0, 0, 0, 0.22);
  padding: calc(88px + env(safe-area-inset-top, 0px)) 16px 24px;
}

:scope .chat-profile-panel-card {
  width: min(100%, 320px);
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.18);
}

:scope .gmp-header,
:scope .chat-profile-panel-header {
  height: 88px;
  background: linear-gradient(180deg, #f2f2f7 0%, #ffffff 100%);
}

:scope .gmp-avatar-wrapper {
  bottom: -34px;
  left: 18px;
}

:scope .gmp-avatar {
  width: 66px;
  height: 66px;
  border: 3px solid #ffffff;
  background: #e5e5ea;
}

:scope .gmp-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:scope .gmp-status-bubble {
  border: 1px solid #e5e5ea;
  border-radius: 14px;
  background: #ffffff;
  color: #333333;
  padding: 4px 10px;
  font-size: 12px;
}

:scope .chat-profile-panel-close {
  background: rgba(255, 255, 255, 0.92);
  color: #111111;
}

:scope .gmp-body,
:scope .chat-profile-panel-body {
  padding: 46px 16px 16px;
}

:scope .gmp-name {
  color: #000000;
  font-size: 18px;
  font-weight: 700;
}

:scope .gmp-signature,
:scope .chat-profile-panel-section-label {
  color: #8e8e93;
}

:scope .chat-profile-panel-content {
  max-height: min(40vh, 320px);
  overflow-y: auto;
}

:scope .chat-profile-panel-thought {
  min-height: 108px;
  color: #222222;
  white-space: pre-wrap;
  word-break: break-word;
}

:scope .gmp-inner-voice {
  border-radius: 16px;
  background: #f2f2f7;
  color: #333333;
  padding: 10px 12px;
}

:scope .chat-profile-panel-meta-row {
  color: #8e8e93;
}
`;
    scopeValue211(scopeValue138, scopeValue212, "已复制真实状态栏 CSS 源码");
    function scopeValue213() {
      return scopeValue27.imessageStatusTemplatePresets = scopeValue102(scopeValue27.imessageStatusTemplatePresets), scopeValue27.imessageStatusTemplatePresets;
    }
    async function scopeValue214(scopeValue838) {
      return scopeValue27.imessageStatusTemplatePresets = scopeValue102(scopeValue838), window.u2ThemeState = scopeValue27, scopeValue381();
    }
    function scopeValue215() {
      if (!scopeValue152) return;
      const scopeValue839 = scopeValue213(),
        scopeValue840 = scopeValue152.value;
      scopeValue152.replaceChildren(new Option("选择预设", ""));
      scopeValue839.forEach(scopeValue842 => scopeValue152.add(new Option(scopeValue842.name, scopeValue842.id)));
      scopeValue152.value = scopeValue839.some(scopeValue843 => scopeValue843.id === scopeValue840) ? scopeValue840 : "";
      const scopeValue841 = document.getElementById("theme-status-preset-delete-btn");
      if (scopeValue841) scopeValue841.disabled = !scopeValue152.value;
      if (scopeValue152.dataset.bound === "true") return;
      scopeValue152.dataset.bound = "true";
      scopeValue152.addEventListener("change", () => {
        const scopeValue844 = scopeValue213().find(scopeValue845 => scopeValue845.id === scopeValue152.value);
        if (scopeValue841) scopeValue841.disabled = !scopeValue844;
        if (!scopeValue844) return;
        if (scopeValue130) scopeValue130.value = scopeValue844.prompt;
        if (scopeValue131) scopeValue131.value = scopeValue844.regex;
        if (scopeValue132) scopeValue132.value = scopeValue844.html;
        scopeValue177("status");
        showToast("已载入状态栏模板预设“" + scopeValue844.name + "”，请保存并应用");
      });
      scopeValue841?.addEventListener("click", async () => {
        const scopeValue846 = scopeValue152.value,
          scopeValue847 = scopeValue213().find(scopeValue849 => scopeValue849.id === scopeValue846);
        if (!scopeValue847 || !window.confirm("删除预设“" + scopeValue847.name + "”？")) return;
        const scopeValue848 = await scopeValue214(scopeValue213().filter(scopeValue850 => scopeValue850.id !== scopeValue846));
        if (!scopeValue848) {
          showToast("删除状态栏模板预设失败");
          return;
        }
        scopeValue215();
        showToast("状态栏模板预设已删除");
      });
    }
    async function scopeValue216() {
      const scopeValue851 = String(scopeValue151?.value || "").trim();
      if (!scopeValue851) {
        showToast("请输入预设名字");
        return;
      }
      const scopeValue852 = window.imApp?.validateStatusTemplate?.(scopeValue190(true));
      if (!scopeValue852?.valid) {
        showToast(scopeValue852?.error || "状态栏模板校验失败");
        return;
      }
      const scopeValue853 = scopeValue213(),
        scopeValue854 = {
          id: "status-template-preset-" + Date.now(),
          name: scopeValue851,
          prompt: scopeValue852.template.prompt,
          regex: scopeValue852.template.regex,
          html: scopeValue852.template.html
        },
        scopeValue855 = scopeValue853.findIndex(scopeValue857 => scopeValue857.name === scopeValue851);
      if (scopeValue855 >= 0) scopeValue854.id = scopeValue853[scopeValue855].id;
      const scopeValue856 = scopeValue855 >= 0 ? scopeValue853.map((scopeValue858, scopeValue859) => scopeValue859 === scopeValue855 ? scopeValue854 : scopeValue858) : [...scopeValue853, scopeValue854];
      if (!(await scopeValue214(scopeValue856))) {
        showToast("预设“" + scopeValue851 + "”保存失败");
        return;
      }
      if (scopeValue151) scopeValue151.value = "";
      scopeValue215();
      showToast("预设“" + scopeValue851 + "”已保存");
    }
    scopeValue150?.addEventListener("click", () => {
      void scopeValue216();
    });
    function scopeValue217(scopeValue860) {
      return scopeValue27.imessageCssPresets = scopeValue101(scopeValue27.imessageCssPresets), scopeValue27.imessageCssPresets[scopeValue860] || [];
    }
    async function scopeValue218(scopeValue861, scopeValue862) {
      return scopeValue27.imessageCssPresets = {
        ...scopeValue101(scopeValue27.imessageCssPresets),
        [scopeValue861]: scopeValue101({
          [scopeValue861]: scopeValue862
        })[scopeValue861]
      }, window.u2ThemeState = scopeValue27, scopeValue381();
    }
    function scopeValue219(scopeValue863, scopeValue864, scopeValue865) {
      if (!scopeValue864) return;
      const scopeValue866 = scopeValue217(scopeValue863);
      scopeValue864.replaceChildren(new Option("选择预设", ""));
      scopeValue866.forEach(scopeValue870 => scopeValue864.add(new Option(scopeValue870.name, scopeValue870.id)));
      const scopeValue867 = scopeValue866.find(scopeValue871 => scopeValue871.css === scopeValue865?.value);
      scopeValue864.value = scopeValue867?.id || "";
      const scopeValue868 = scopeValue863 === "status" ? "theme-status-css-preset-delete-btn" : "theme-" + scopeValue863 + "-preset-delete-btn",
        scopeValue869 = document.getElementById(scopeValue868);
      if (scopeValue869) scopeValue869.disabled = !scopeValue864.value;
      if (scopeValue864.dataset.bound === "true") return;
      scopeValue864.dataset.bound = "true";
      scopeValue864.addEventListener("change", () => {
        const scopeValue872 = scopeValue217(scopeValue863).find(scopeValue873 => scopeValue873.id === scopeValue864.value);
        if (scopeValue869) scopeValue869.disabled = !scopeValue872;
        if (!scopeValue872 || !scopeValue865) return;
        scopeValue865.value = scopeValue872.css;
        if (scopeValue863 === "chat") scopeValue170();else scopeValue177(scopeValue863);
        if (scopeValue863 === "bubble") scopeValue182("bubble");
        showToast("已载入预设“" + scopeValue872.name + "”，请保存并应用");
      });
      scopeValue869?.addEventListener("click", async () => {
        const scopeValue874 = scopeValue864.value,
          scopeValue875 = scopeValue217(scopeValue863).find(scopeValue877 => scopeValue877.id === scopeValue874);
        if (!scopeValue875 || !window.confirm("删除预设“" + scopeValue875.name + "”？")) return;
        const scopeValue876 = await scopeValue218(scopeValue863, scopeValue217(scopeValue863).filter(scopeValue878 => scopeValue878.id !== scopeValue874));
        scopeValue876 ? (scopeValue220(scopeValue186() || window.imData?.currentSettingsFriend), showToast("预设已删除")) : showToast("预设删除失败");
      });
    }
    function scopeValue220(scopeValue879 = scopeValue186() || window.imData?.currentSettingsFriend) {
      scopeValue219("bubble", scopeValue157, scopeValue113);
      scopeValue219("home", scopeValue112, scopeValue107);
      scopeValue219("chat", scopeValue126, scopeValue119);
      scopeValue219("group", scopeValue129, scopeValue121);
      scopeValue219("status", scopeValue149, scopeValue146);
      scopeValue215();
    }
    function scopeValue221(scopeValue880, scopeValue881, scopeValue882, scopeValue883, scopeValue884) {
      scopeValue881 && scopeValue881.addEventListener("click", async () => {
        let scopeValue885;
        if (scopeValue880 === "home") scopeValue885 = scopeValue107;else {
          if (scopeValue880 === "bubble") scopeValue885 = scopeValue113;else {
            if (scopeValue880 === "chat") scopeValue885 = scopeValue119;else {
              if (scopeValue880 === "group") scopeValue885 = scopeValue121;else {
                if (scopeValue880 === "status") scopeValue885 = scopeValue146;
              }
            }
          }
        }
        const scopeValue886 = scopeValue882 ? scopeValue882.value.trim() : "",
          scopeValue887 = scopeValue885 ? scopeValue885.value.trim() : "";
        if (!scopeValue886) {
          if (window.showToast) window.showToast("请输入预设名字");
          return;
        }
        if (!scopeValue887) {
          if (window.showToast) window.showToast("CSS 代码不能为空");
          return;
        }
        const scopeValue888 = scopeValue217(scopeValue880),
          scopeValue889 = scopeValue888.findIndex(scopeValue891 => scopeValue891.name === scopeValue886);
        scopeValue889 >= 0 ? scopeValue888[scopeValue889] = {
          ...scopeValue888[scopeValue889],
          css: scopeValue887
        } : scopeValue888.push({
          id: scopeValue880 + "-preset-" + Date.now(),
          name: scopeValue886,
          css: scopeValue887
        });
        const scopeValue890 = await scopeValue218(scopeValue880, scopeValue888);
        if (!scopeValue890) {
          if (window.showToast) window.showToast("预设 \"" + scopeValue886 + "\" 保存失败");
          return;
        }
        scopeValue220(scopeValue186() || window.imData?.currentSettingsFriend);
        if (scopeValue882) scopeValue882.value = "";
        if (window.showToast) window.showToast("预设 \"" + scopeValue886 + "\" 已保存");
      });
      scopeValue883 && scopeValue219(scopeValue880, scopeValue883, scopeValue884);
    }
    scopeValue221("home", scopeValue110, scopeValue111, scopeValue112, scopeValue107);
    scopeValue221("bubble", scopeValue117, scopeValue118, scopeValue157, scopeValue113);
    scopeValue221("chat", scopeValue124, scopeValue125, scopeValue126, scopeValue119);
    scopeValue221("group", scopeValue127, scopeValue128, scopeValue129, scopeValue121);
    scopeValue221("status", scopeValue147, scopeValue148, scopeValue149, scopeValue146);
    function scopeValue222(scopeValue892) {
      if (typeof window.mobileInputCompat?.isSendEnter === "function") return window.mobileInputCompat.isSendEnter(scopeValue892);
      return scopeValue892?.key === "Enter" && !scopeValue892.isComposing && scopeValue892.keyCode !== 229 && !scopeValue892.shiftKey && !scopeValue892.ctrlKey && !scopeValue892.metaKey && !scopeValue892.altKey;
    }
    function scopeValue223(scopeValue893, scopeValue894) {
      if (!scopeValue893 || !scopeValue894) return;
      scopeValue893.setAttribute("enterkeyhint", "done");
      const scopeValue895 = () => scopeValue894.click();
      if (typeof window.mobileInputCompat?.register === "function") {
        window.mobileInputCompat.register({
          input: scopeValue893,
          onSend: scopeValue895,
          enterKeyHint: "done",
          blurAfterSend: false,
          restoreWindowScroll: false
        });
        return;
      }
      scopeValue893.addEventListener("keydown", scopeValue896 => {
        if (!scopeValue222(scopeValue896)) return;
        scopeValue896.preventDefault();
        if (!String(scopeValue893.value || "").trim()) return;
        scopeValue895();
      });
    }
    [[scopeValue111, scopeValue110], [scopeValue125, scopeValue124], [scopeValue118, scopeValue117], [scopeValue128, scopeValue127], [scopeValue151, scopeValue150], [scopeValue148, scopeValue147]].forEach(([scopeValue897, scopeValue898]) => scopeValue223(scopeValue897, scopeValue898));
    scopeValue131?.setAttribute("enterkeyhint", "next");
    scopeValue131?.addEventListener("keydown", scopeValue899 => {
      if (!scopeValue222(scopeValue899)) return;
      scopeValue899.preventDefault();
      scopeValue132?.focus({
        preventScroll: true
      });
    });
    window.imApp = window.imApp || {};
    window.imApp.refreshChatThemePresetUi = () => {};
    const scopeValue224 = new Set(["status_template", "status_css", "home_css", "chat_css", "bubble_css", "group_css"]);
    function scopeValue225(scopeValue900) {
      if (!scopeValue900) return null;
      const scopeValue901 = window.imApp?.getFriendById?.(scopeValue900) || null;
      return scopeValue901 && scopeValue901.type === "char" ? scopeValue901 : null;
    }
    function scopeValue226(scopeValue902) {
      return scopeValue4(scopeValue902 == null ? null : scopeValue902);
    }
    function scopeValue227(scopeValue903, scopeValue904 = "") {
      if (!scopeValue224.has(scopeValue903)) return null;
      if (scopeValue903 === "home_css") return {
        css: scopeValue27.imessageHomeCss || "",
        enabled: scopeValue27.imessageHomeCssEnabled === true
      };
      if (scopeValue903 === "chat_css") return {
        css: scopeValue27.imessageChatCss || "",
        enabled: scopeValue27.imessageChatCssEnabled === true
      };
      if (scopeValue903 === "group_css") return {
        css: scopeValue27.imessageGroupCss || "",
        enabled: scopeValue27.imessageGroupCssEnabled === true
      };
      const scopeValue905 = scopeValue225(scopeValue904);
      if (!scopeValue905) return null;
      if (scopeValue903 === "bubble_css") return {
        css: scopeValue905.customCss || "",
        enabled: scopeValue905.customCssEnabled === true
      };
      if (scopeValue903 === "status_css") return {
        css: scopeValue905.statusCss || "",
        prompt: scopeValue905.statusCssPrompt || "",
        enabled: scopeValue905.statusCssEnabled === true,
        renderMode: scopeValue905.statusRenderMode || "default"
      };
      return {
        template: scopeValue226(scopeValue905.statusTemplate || scopeValue184()),
        renderMode: scopeValue905.statusRenderMode || "default"
      };
    }
    function scopeValue228(scopeValue906, scopeValue907 = "") {
      const scopeValue908 = scopeValue227(scopeValue906, scopeValue907);
      return scopeValue908 ? JSON.stringify(scopeValue908) : "";
    }
    function scopeValue229(scopeValue909, scopeValue910 = {}) {
      if (!scopeValue224.has(scopeValue909)) return {
        valid: false,
        error: "不支持的主题作品类型"
      };
      if (scopeValue909 === "status_template") {
        const scopeValue912 = window.imApp?.validateStatusTemplate?.({
          enabled: true,
          prompt: scopeValue910.prompt,
          regex: scopeValue910.regex,
          html: scopeValue910.html
        });
        return scopeValue912?.valid ? {
          valid: true,
          payload: scopeValue912.template
        } : {
          valid: false,
          error: scopeValue912?.error || "状态栏模板校验失败"
        };
      }
      const scopeValue911 = String(scopeValue910.css || "").slice(0, 50000);
      if (!scopeValue911.trim()) return {
        valid: false,
        error: "CSS 代码为空"
      };
      if (/<\/?(?:script|iframe|object|embed)\b/i.test(scopeValue911)) return {
        valid: false,
        error: "CSS 中包含不允许的 HTML 内容"
      };
      if (/@import\b|(?:javascript|vbscript):|expression\s*\(/i.test(scopeValue911)) return {
        valid: false,
        error: "CSS 中包含不允许的外部导入或脚本表达式"
      };
      if (scopeValue909 === "chat_css" || scopeValue909 === "bubble_css") {
        const newScope912 = window.imApp?.["validateSingleChatThemeCss"]?.(scopeValue911, scopeValue909);
        if (!newScope912?.["valid"]) return {
          valid: false,
          error: newScope912?.["error"] || "聊天 CSS 校验组件未加载"
        };
      }
      return {
        valid: true,
        payload: scopeValue909 === "status_css" ? {
          css: scopeValue911,
          prompt: String(scopeValue910.prompt || "").trim().slice(0, 8000)
        } : {
          css: scopeValue911
        }
      };
    }
    async function scopeValue230(scopeValue926, newScope914, newScope915 = "") {
      const scopeValue923 = scopeValue229(scopeValue926, newScope914);
      if (!scopeValue923.valid) throw new Error(scopeValue923.error);
      const newScope917 = scopeValue227(scopeValue926, newScope915);
      if (["bubble_css", "status_css", "status_template"].includes(scopeValue926) && !newScope917) throw new Error("请选择要应用的普通单聊角色");
      if (scopeValue926 === "home_css" || scopeValue926 === "chat_css" || scopeValue926 === "group_css") {
        const scopeValue932 = {
            home_css: ["imessageHomeCss", "imessageHomeCssEnabled", "applyGlobalHomeCss"],
            chat_css: ["imessageChatCss", "imessageChatCssEnabled", "applyGlobalChatCss"],
            group_css: ["imessageGroupCss", "imessageGroupCssEnabled", "applyGlobalGroupCss"]
          },
          [scopeValue919, scopeValue920, scopeValue921] = scopeValue932[scopeValue926];
        scopeValue27[scopeValue919] = scopeValue923.payload.css;
        scopeValue27[scopeValue920] = true;
        window.u2ThemeState = scopeValue27;
        window.imApp?.[scopeValue921]?.(scopeValue27);
        if (!(await scopeValue381())) throw new Error("主题保存失败");
      } else {
        const newScope922 = scopeValue225(newScope915),
          scopeValue929 = await window.imApp.commitScopedFriendChange(newScope922, newScope925 => {
            if (scopeValue926 === "bubble_css") newScope925.customCss = scopeValue923.payload.css, newScope925.customCssEnabled = true;else scopeValue926 === "status_css" ? (newScope925.statusCss = scopeValue923.payload.css, newScope925.statusCssPrompt = scopeValue923.payload.prompt, newScope925.statusCssEnabled = true, newScope925.statusRenderMode = "css") : (newScope925.statusTemplate = scopeValue923.payload, newScope925.statusRenderMode = "template", delete newScope925._statusTemplateNeedsPersistence);
          }, {
            silent: true,
            syncSettings: true
          });
        if (!scopeValue929) throw new Error("主题保存失败");
        const newScope924 = scopeValue225(newScope915);
        window.imApp.applyFriendCss?.(newScope924), window.imApp.applyFriendStatusBarCss?.(newScope924), scopeValue199(newScope924), scopeValue220(newScope924);
      }
      return {
        previousSnapshot: newScope917,
        appliedFingerprint: scopeValue228(scopeValue926, newScope915)
      };
    }
    async function scopeValue231(newScope926, scopeValue927, scopeValue928) {
      if (!scopeValue928) throw new Error("缺少可撤销快照");
      if (newScope926 === "home_css" || newScope926 === "chat_css" || newScope926 === "group_css") {
        const newScope932 = {
            home_css: ["imessageHomeCss", "imessageHomeCssEnabled", "applyGlobalHomeCss"],
            chat_css: ["imessageChatCss", "imessageChatCssEnabled", "applyGlobalChatCss"],
            group_css: ["imessageGroupCss", "imessageGroupCssEnabled", "applyGlobalGroupCss"]
          },
          [newScope933, newScope934, newScope935] = newScope932[newScope926];
        scopeValue27[newScope933] = String(scopeValue928.css || ""), scopeValue27[newScope934] = scopeValue928.enabled === true, window.u2ThemeState = scopeValue27, window.imApp?.[newScope935]?.(scopeValue27);
        if (!(await scopeValue381())) throw new Error("撤销保存失败");
        return true;
      }
      const newScope929 = scopeValue225(scopeValue927);
      if (!newScope929) throw new Error("原应用角色已不存在");
      const scopeValue930 = await window.imApp.commitScopedFriendChange(newScope929, scopeValue936 => {
        if (newScope926 === "bubble_css") scopeValue936.customCss = String(scopeValue928.css || ""), scopeValue936.customCssEnabled = scopeValue928.enabled === true;else newScope926 === "status_css" ? (scopeValue936.statusCss = String(scopeValue928.css || ""), scopeValue936.statusCssPrompt = String(scopeValue928.prompt || ""), scopeValue936.statusCssEnabled = scopeValue928.enabled === true, scopeValue936.statusRenderMode = scopeValue928.renderMode || "default") : (scopeValue936.statusTemplate = window.imApp.createDefaultStatusTemplate(scopeValue928.template || {}), scopeValue936.statusRenderMode = scopeValue928.renderMode || "default");
      }, {
        silent: true,
        syncSettings: true
      });
      if (!scopeValue930) throw new Error("撤销保存失败");
      const scopeValue931 = scopeValue225(scopeValue927);
      return window.imApp.applyFriendCss?.(scopeValue931), window.imApp.applyFriendStatusBarCss?.(scopeValue931), scopeValue199(scopeValue931), scopeValue220(scopeValue931), true;
    }
    async function scopeValue232(scopeValue937, scopeValue938, scopeValue939) {
      const scopeValue940 = String(scopeValue938 || "").trim().slice(0, 80);
      if (!scopeValue940) throw new Error("作品名称为空");
      const scopeValue941 = scopeValue229(scopeValue937, scopeValue939);
      if (!scopeValue941.valid) throw new Error(scopeValue941.error);
      if (scopeValue937 === "status_template") {
        const scopeValue942 = scopeValue102(scopeValue27.imessageStatusTemplatePresets),
          scopeValue943 = {
            id: "status-template-" + Date.now(),
            name: scopeValue940,
            ...scopeValue941.payload
          },
          scopeValue944 = scopeValue942.findIndex(scopeValue946 => scopeValue946.name === scopeValue940);
        if (scopeValue944 >= 0) scopeValue943.id = scopeValue942[scopeValue944].id;
        const scopeValue945 = scopeValue944 >= 0 ? scopeValue942.map((scopeValue947, scopeValue948) => scopeValue948 === scopeValue944 ? scopeValue943 : scopeValue947) : [...scopeValue942, scopeValue943];
        if (!(await scopeValue214(scopeValue945))) throw new Error("预设保存失败");
      } else {
        const scopeValue949 = {
            home_css: "home",
            chat_css: "chat",
            group_css: "group",
            bubble_css: "bubble",
            status_css: "status"
          },
          scopeValue950 = scopeValue949[scopeValue937],
          scopeValue951 = scopeValue217(scopeValue950),
          scopeValue952 = {
            id: scopeValue950 + "-preset-" + Date.now(),
            name: scopeValue940,
            css: scopeValue941.payload.css
          },
          scopeValue953 = scopeValue951.findIndex(scopeValue955 => scopeValue955.name === scopeValue940);
        if (scopeValue953 >= 0) scopeValue952.id = scopeValue951[scopeValue953].id;
        const scopeValue954 = scopeValue953 >= 0 ? scopeValue951.map((scopeValue956, scopeValue957) => scopeValue957 === scopeValue953 ? scopeValue952 : scopeValue956) : [...scopeValue951, scopeValue952];
        if (!(await scopeValue218(scopeValue950, scopeValue954))) throw new Error("预设保存失败");
      }
      return scopeValue220(scopeValue186() || window.imData?.currentSettingsFriend), true;
    }
    window.u2ThemeAgent = {
      kinds: Array.from(scopeValue224),
      validate: scopeValue229,
      getSnapshot: scopeValue227,
      fingerprint: scopeValue228,
      apply: scopeValue230,
      restore: scopeValue231,
      savePreset: scopeValue232
    }, scopeValue220();
    const scopeValue233 = "u2-home-theme",
      scopeValue234 = 2,
      scopeValue235 = new Set([1, scopeValue234]),
      scopeValue236 = document.getElementById("theme-export-btn"),
      scopeValue237 = document.getElementById("theme-import-file-input"),
      scopeValue238 = document.getElementById("theme-bg-upload-btn"),
      scopeValue239 = document.getElementById("theme-bg-reset-btn"),
      scopeValue240 = document.getElementById("theme-bg-file-input"),
      scopeValue241 = "desktop_theme_presets",
      scopeValue242 = document.getElementById("desktop-preset-name"),
      scopeValue243 = document.getElementById("desktop-preset-list"),
      scopeValue244 = document.getElementById("desktop-preset-count"),
      scopeValue245 = document.getElementById("desktop-preset-status"),
      scopeValue246 = document.getElementById("desktop-preset-switch-dialog"),
      scopeValue247 = document.getElementById("desktop-preset-dialog-name"),
      newScope243 = window.u2NativeBridge?.["isNativeAndroid"]?.() === true;
    window.mobileInputCompat?.["isAndroid"] && scopeValue242 && window.mobileInputCompat?.["registerFocusScope"] && window.mobileInputCompat.registerFocusScope({
      selector: "#desktop-preset-name",
      priority: 50,
      nativeInsetsOnly: true
    });
    scopeValue246 && window.mobileInputCompat?.["registerFocusScope"] && window.mobileInputCompat.registerFocusScope({
      selector: "#desktop-preset-switch-dialog",
      preferFocusScope: true,
      nativeInsetsOnly: newScope243,
      resolveScrollContainer: (newScope958, newScope959) => newScope959,
      scrollBehavior: "focus",
      viewportClassName: "u2-android-desktop-preset-viewport-sized",
      viewportHeightCssVariable: "--u2-android-desktop-preset-viewport-height",
      viewportTopCssVariable: "--u2-android-desktop-preset-viewport-top"
    });
    let scopeValue248 = false,
      scopeValue249 = false,
      scopeValue250 = {
        version: 1,
        activeId: "",
        fingerprint: "",
        presets: []
      };
    const scopeValue251 = scopeValue958 => "desktop_theme_preset:" + scopeValue958;
    function scopeValue252() {
      const scopeValue959 = window.appStorage?.readDomain?.(scopeValue241, {}) || {};
      scopeValue250 = {
        version: 1,
        activeId: typeof scopeValue959.activeId === "string" ? scopeValue959.activeId : "",
        fingerprint: typeof scopeValue959.fingerprint === "string" ? scopeValue959.fingerprint : "",
        presets: Array.isArray(scopeValue959.presets) ? scopeValue959.presets.filter(scopeValue960 => scopeValue960 && scopeValue960.id && scopeValue960.name) : []
      };
      return scopeValue250;
    }
    async function scopeValue253(scopeValue961) {
      await window.appStorage.commitDomain(scopeValue241, () => scopeValue961, {
        critical: true,
        reason: "desktop-theme-presets"
      });
      scopeValue250 = scopeValue961;
      scopeValue255();
    }
    function scopeValue254(scopeValue962, scopeValue963 = "") {
      scopeValue248 = scopeValue962;
      if (scopeValue245) scopeValue245.textContent = scopeValue963;
      document.querySelectorAll("#desktop-preset-save, #desktop-preset-list button").forEach(scopeValue964 => {
        scopeValue964.disabled = scopeValue962;
      });
    }
    function scopeValue255() {
      if (!scopeValue243) return;
      scopeValue243.replaceChildren();
      scopeValue244 && (scopeValue244.textContent = String(scopeValue250.presets.length), scopeValue244.setAttribute("aria-label", scopeValue250.presets.length + " 套预设"));
      if (!scopeValue250.presets.length) {
        const scopeValue965 = document.createElement("p");
        scopeValue965.className = "desktop-preset-empty";
        scopeValue965.setAttribute("aria-label", "暂无桌面预设");
        const scopeValue966 = document.createElement("i");
        scopeValue966.className = "far fa-images";
        scopeValue966.setAttribute("aria-hidden", "true");
        scopeValue965.appendChild(scopeValue966);
        scopeValue243.appendChild(scopeValue965);
        return;
      }
      scopeValue250.presets.forEach(scopeValue967 => {
        const scopeValue968 = document.createElement("div");
        scopeValue968.className = "desktop-preset-card";
        if (scopeValue967.id === scopeValue250.activeId) scopeValue968.classList.add("is-active");
        scopeValue968.setAttribute("role", "listitem");
        const scopeValue969 = document.createElement("div");
        scopeValue969.className = "desktop-preset-card-main";
        const scopeValue970 = document.createElement("strong");
        const scopeValue971 = document.createElement("span");
        scopeValue971.textContent = scopeValue967.name;
        scopeValue970.appendChild(scopeValue971);
        if (scopeValue967.id === scopeValue250.activeId) {
          const scopeValue975 = document.createElement("i");
          scopeValue975.className = "fas fa-circle-check";
          scopeValue975.setAttribute("aria-label", "当前预设");
          scopeValue970.appendChild(scopeValue975);
        }
        const scopeValue972 = document.createElement("small");
        const scopeValue973 = scopeValue967.updatedAt ? new Date(scopeValue967.updatedAt).toLocaleDateString("zh-CN") : "";
        scopeValue972.textContent = scopeValue973;
        scopeValue969.append(scopeValue970, scopeValue972);
        const scopeValue974 = document.createElement("div");
        scopeValue974.className = "desktop-preset-card-actions";
        [["切换", "fa-arrow-right-arrow-left", () => scopeValue272(scopeValue967.id)], ["覆盖", "fa-floppy-disk", () => scopeValue269(scopeValue967.name, scopeValue967.id)], ["删除", "fa-trash-can", () => scopeValue273(scopeValue967.id)]].forEach(([scopeValue976, scopeValue977, scopeValue978]) => {
          const scopeValue979 = document.createElement("button");
          scopeValue979.type = "button";
          scopeValue979.setAttribute("aria-label", scopeValue976 + "预设“" + scopeValue967.name + "”");
          scopeValue979.title = scopeValue976 + "预设“" + scopeValue967.name + "”";
          const scopeValue980 = document.createElement("i");
          scopeValue980.className = "fas " + scopeValue977;
          scopeValue980.setAttribute("aria-hidden", "true");
          scopeValue979.appendChild(scopeValue980);
          scopeValue979.className = "desktop-preset-action desktop-preset-" + (scopeValue976 === "切换" ? "switch" : scopeValue976 === "覆盖" ? "overwrite" : "delete");
          scopeValue979.disabled = scopeValue248;
          scopeValue979.addEventListener("click", scopeValue978);
          scopeValue974.appendChild(scopeValue979);
        });
        scopeValue968.append(scopeValue969, scopeValue974);
        scopeValue243.appendChild(scopeValue968);
      });
    }
    async function scopeValue256(scopeValue981) {
      const scopeValue982 = await scopeValue981.arrayBuffer();
      if (!window.crypto?.subtle) return "random_" + Date.now() + "_" + Math.random().toString(36).slice(2);
      const scopeValue983 = await window.crypto.subtle.digest("SHA-256", scopeValue982);
      return Array.from(new Uint8Array(scopeValue983), scopeValue984 => scopeValue984.toString(16).padStart(2, "0")).join("");
    }
    async function scopeValue257(scopeValue985, scopeValue986) {
      const scopeValue987 = "desktop_theme_" + scopeValue986 + "_" + (await scopeValue256(scopeValue985));
      !(await window.appStorage.getAssetBlob(scopeValue987)) && (await window.appStorage.saveAssetFromBlob(scopeValue987, scopeValue985, {
        ownerType: "desktop_theme_preset",
        kind: scopeValue986
      }));
      return scopeValue987;
    }
    async function scopeValue258(scopeValue988, scopeValue989 = "") {
      if (typeof scopeValue988 === "string" && scopeValue988.startsWith("data:")) return window.appStorage.dataUrlToBlob(scopeValue988);
      if (typeof scopeValue988 === "string" && /^https?:\/\//i.test(scopeValue988)) return null;
      if (scopeValue989) {
        const scopeValue990 = await window.appStorage.getAssetBlob(scopeValue989);
        if (scopeValue990) return scopeValue990;
        throw new Error("主题图片资源已丢失");
      }
      if (typeof scopeValue988 !== "string") return null;
      if (scopeValue988.startsWith("blob:")) return (await fetch(scopeValue988)).blob();
      return null;
    }
    async function scopeValue259(scopeValue991, scopeValue992 = "") {
      scopeValue992 = String(scopeValue992 || "");
      if (!scopeValue991 && !scopeValue992) return null;
      if (typeof scopeValue991 === "string" && /^https?:\/\//i.test(scopeValue991)) return {
        url: scopeValue991
      };
      if (typeof scopeValue991 === "string" && scopeValue991.startsWith("data:")) return {
        assetId: await scopeValue257(window.appStorage.dataUrlToBlob(scopeValue991), "image")
      };
      if (scopeValue992.startsWith("desktop_theme_")) {
        if (await window.appStorage.getAssetBlob(scopeValue992)) return {
          assetId: scopeValue992
        };
      }
      const scopeValue993 = await scopeValue258(scopeValue991, scopeValue992);
      if (scopeValue993) return {
        assetId: await scopeValue257(scopeValue993, "image")
      };
      return {
        url: String(scopeValue991)
      };
    }
    async function scopeValue260(scopeValue994) {
      if (!scopeValue994) return {
        url: null,
        assetId: ""
      };
      if (scopeValue994.assetId) {
        const scopeValue995 = await window.appStorage.getAssetUrl(scopeValue994.assetId);
        if (!scopeValue995) throw new Error("预设图片资源已丢失");
        return {
          url: scopeValue995,
          assetId: scopeValue994.assetId
        };
      }
      return {
        url: scopeValue26(scopeValue994.url) || null,
        assetId: ""
      };
    }
    async function scopeValue261() {
      const scopeValue996 = [];
      if (scopeValue27.bgAssetId) scopeValue996.push((async () => {
        try {
          scopeValue27.bgUrl = (await scopeValue260({
            assetId: scopeValue27.bgAssetId
          })).url;
        } catch (scopeValue997) {
          console.warn("Missing desktop background asset", scopeValue997);
          scopeValue27.bgAssetId = "";
          scopeValue27.bgUrl = null;
        }
      })());
      scopeValue27.apps.forEach(scopeValue998 => {
        if (!scopeValue998.iconAssetId) return;
        scopeValue996.push((async () => {
          try {
            scopeValue998.icon = (await scopeValue260({
              assetId: scopeValue998.iconAssetId
            })).url;
          } catch (scopeValue999) {
            console.warn("Missing desktop icon asset", scopeValue999);
            scopeValue998.iconAssetId = "";
            scopeValue998.icon = null;
          }
        })());
      });
      await Promise.all(scopeValue996);
    }
    async function scopeValue262() {
      if (typeof scopeValue27.bgUrl === "string" && scopeValue27.bgUrl.startsWith("data:")) {
        const scopeValue1000 = await scopeValue259(scopeValue27.bgUrl);
        scopeValue27.bgAssetId = scopeValue1000.assetId;
        scopeValue27.bgUrl = (await scopeValue260(scopeValue1000)).url;
      }
      for (const scopeValue1001 of scopeValue27.apps) {
        if (typeof scopeValue1001.icon === "string" && scopeValue1001.icon.startsWith("data:")) {
          const scopeValue1002 = await scopeValue259(scopeValue1001.icon);
          scopeValue1001.iconAssetId = scopeValue1002.assetId;
          scopeValue1001.icon = (await scopeValue260(scopeValue1002)).url;
        }
      }
      return scopeValue381();
    }
    async function scopeValue263() {
      if ((await window.desktopDataReadyPromise) === false) throw new Error("桌面数据尚未恢复，无法保存预设");
      const scopeValue1003 = window.getHomeWidgetThemeConfigs?.() || {};
      const scopeValue1004 = {
        background: await scopeValue259(scopeValue27.bgUrl, scopeValue27.bgAssetId || ""),
        apps: {},
        widgets: {}
      };
      for (const scopeValue1005 of scopeValue27.apps) {
        scopeValue1004.apps[String(scopeValue1005.id)] = await scopeValue259(scopeValue1005.icon, scopeValue1005.iconAssetId || "");
      }
      for (const [scopeValue1006, scopeValue1007] of Object.entries(scopeValue1003)) {
        if (!scopeValue1007 || typeof scopeValue1007 !== "object") continue;
        const scopeValue1008 = {
          type: scopeValue1007.type,
          name: scopeValue1007.name,
          color: scopeValue1007.color,
          text: scopeValue1007.text || {},
          images: {}
        };
        for (const [scopeValue1010, scopeValue1011] of Object.entries(scopeValue1007.images || {})) {
          scopeValue1008.images[scopeValue1010] = await scopeValue259(scopeValue1011, scopeValue1007.imageAssetIds?.[scopeValue1010] || "");
        }
        const scopeValue1009 = typeof scopeValue1007.html === "string" ? scopeValue1007.html : "";
        if (scopeValue1009.length > 16384) scopeValue1008.htmlAssetId = await scopeValue257(new Blob([scopeValue1009], {
          type: "text/html"
        }), "html");else scopeValue1008.html = scopeValue1009;
        scopeValue1004.widgets[scopeValue1006] = scopeValue1008;
      }
      return scopeValue1004;
    }
    async function scopeValue264(scopeValue1012, scopeValue1013 = null) {
      const scopeValue1014 = await scopeValue260(scopeValue1012.background);
      const scopeValue1015 = {};
      const scopeValue1016 = {};
      for (const [scopeValue1017, scopeValue1018] of Object.entries(scopeValue1012.apps || {})) scopeValue1015[scopeValue1017] = await scopeValue260(scopeValue1018);
      for (const [scopeValue1019, scopeValue1020] of Object.entries(scopeValue1012.widgets || {})) {
        if (scopeValue1013 && scopeValue1013[scopeValue1019] !== scopeValue1020.type) continue;
        const scopeValue1021 = {};
        const scopeValue1022 = {};
        for (const [scopeValue1026, scopeValue1027] of Object.entries(scopeValue1020.images || {})) {
          const scopeValue1028 = await scopeValue260(scopeValue1027);
          scopeValue1021[scopeValue1026] = scopeValue1028.url;
          if (scopeValue1028.assetId) scopeValue1022[scopeValue1026] = scopeValue1028.assetId;
        }
        let scopeValue1023 = scopeValue1020.html || "";
        if (scopeValue1020.htmlAssetId) {
          const scopeValue1029 = await window.appStorage.getAssetBlob(scopeValue1020.htmlAssetId);
          if (!scopeValue1029) throw new Error("预设 HTML 资源已丢失");
          scopeValue1023 = await scopeValue1029.text();
        }
        const {
          htmlAssetId: scopeValue1024,
          ...scopeValue1025
        } = scopeValue1020;
        scopeValue1016[scopeValue1019] = {
          ...scopeValue1025,
          images: scopeValue1021,
          imageAssetIds: scopeValue1022,
          html: scopeValue1023
        };
      }
      return {
        background: scopeValue1014,
        apps: scopeValue1015,
        widgets: scopeValue1016
      };
    }
    async function scopeValue265(scopeValue1030) {
      const scopeValue1031 = new Set();
      if (scopeValue1030.background.url) scopeValue1031.add(scopeValue1030.background.url);
      Object.values(scopeValue1030.apps).forEach(scopeValue1034 => {
        if (scopeValue1034.url) scopeValue1031.add(scopeValue1034.url);
      });
      Object.values(scopeValue1030.widgets).forEach(scopeValue1035 => {
        Object.values(scopeValue1035.images || {}).forEach(scopeValue1036 => {
          if (scopeValue1036) scopeValue1031.add(scopeValue1036);
        });
      });
      const scopeValue1032 = [...scopeValue1031];
      const scopeValue1033 = async () => {
        while (scopeValue1032.length) {
          const scopeValue1037 = new Image();
          scopeValue1037.src = scopeValue1032.shift();
          try {
            if (scopeValue1037.decode) await scopeValue1037.decode();else await new Promise((scopeValue1038, scopeValue1039) => {
              scopeValue1037.onload = scopeValue1038;
              scopeValue1037.onerror = scopeValue1039;
              if (scopeValue1037.complete) (scopeValue1037.naturalWidth ? scopeValue1038 : scopeValue1039)();
            });
          } catch (scopeValue1040) {
            throw new Error("预设图片加载失败，桌面未切换");
          }
        }
      };
      await Promise.all([scopeValue1033(), scopeValue1033()]);
    }
    async function scopeValue266() {
      const scopeValue1041 = window.getHomeWidgetThemeConfigs?.() || {};
      const scopeValue1042 = (scopeValue1046, scopeValue1047) => scopeValue1047 && (!scopeValue1046 || String(scopeValue1046).startsWith("blob:")) ? "asset:" + scopeValue1047 : scopeValue1046 || "";
      const scopeValue1043 = {
        background: scopeValue1042(scopeValue27.bgUrl, scopeValue27.bgAssetId),
        apps: scopeValue27.apps.map(scopeValue1048 => [scopeValue1048.id, scopeValue1042(scopeValue1048.icon, scopeValue1048.iconAssetId)]),
        widgets: Object.entries(scopeValue1041).map(([scopeValue1049, scopeValue1050]) => [scopeValue1049, {
          type: scopeValue1050.type,
          name: scopeValue1050.name,
          color: scopeValue1050.color,
          text: scopeValue1050.text || {},
          images: Object.entries(scopeValue1050.images || {}).map(([scopeValue1051, scopeValue1052]) => [scopeValue1051, scopeValue1042(scopeValue1052, scopeValue1050.imageAssetIds?.[scopeValue1051])]),
          html: scopeValue1050.html || ""
        }])
      };
      const scopeValue1044 = new TextEncoder().encode(JSON.stringify(scopeValue1043));
      if (!window.crypto?.subtle) {
        let scopeValue1053 = 2166136261;
        return scopeValue1044.forEach(newScope1056 => {
          scopeValue1053 = Math.imul(scopeValue1053 ^ newScope1056, 16777619);
        }), scopeValue1044.length + ":" + (scopeValue1053 >>> 0);
      }
      const scopeValue1045 = await window.crypto.subtle.digest("SHA-256", scopeValue1044);
      return Array.from(new Uint8Array(scopeValue1045), scopeValue1055 => scopeValue1055.toString(16).padStart(2, "0")).join("");
    }
    function scopeValue267(scopeValue1056, scopeValue1057, scopeValue1058 = "") {
      if (!scopeValue1056) return !scopeValue1057 && !scopeValue1058;
      if (scopeValue1056.assetId) return scopeValue1056.assetId === scopeValue1058 && (!scopeValue1057 || String(scopeValue1057).startsWith("blob:"));
      return (scopeValue1056.url || null) === (scopeValue1057 || null) && !scopeValue1058;
    }
    async function scopeValue268() {
      const scopeValue1059 = window.appStorage.readDomain(scopeValue251(scopeValue250.activeId), {}).snapshot;
      if (!scopeValue1059) return true;
      if (!scopeValue267(scopeValue1059.background, scopeValue27.bgUrl, scopeValue27.bgAssetId || "")) return true;
      for (const scopeValue1062 of scopeValue27.apps) {
        if (!Object.prototype.hasOwnProperty.call(scopeValue1059.apps || {}, scopeValue1062.id)) continue;
        if (!scopeValue267(scopeValue1059.apps[scopeValue1062.id], scopeValue1062.icon, scopeValue1062.iconAssetId || "")) return true;
      }
      const scopeValue1060 = window.getHomeWidgetPresetTargets?.() || {};
      const scopeValue1061 = window.getHomeWidgetThemeConfigs?.() || {};
      for (const [scopeValue1063, scopeValue1064] of Object.entries(scopeValue1059.widgets || {})) {
        if (scopeValue1060[scopeValue1063] !== scopeValue1064.type || !scopeValue1061[scopeValue1063]) continue;
        const scopeValue1065 = scopeValue1061[scopeValue1063];
        if (scopeValue1065.name !== scopeValue1064.name || scopeValue1065.color !== scopeValue1064.color || JSON.stringify(scopeValue1065.text || {}) !== JSON.stringify(scopeValue1064.text || {})) return true;
        const scopeValue1066 = scopeValue1064.htmlAssetId ? await (await window.appStorage.getAssetBlob(scopeValue1064.htmlAssetId))?.text() : scopeValue1064.html || "";
        if (scopeValue1066 === undefined || (scopeValue1065.html || "") !== scopeValue1066) return true;
        const scopeValue1067 = scopeValue1065.images || {};
        const scopeValue1068 = scopeValue1064.images || {};
        const scopeValue1069 = Object.keys(scopeValue1067).sort();
        const scopeValue1070 = Object.keys(scopeValue1068).sort();
        if (JSON.stringify(scopeValue1069) !== JSON.stringify(scopeValue1070)) return true;
        for (const scopeValue1071 of scopeValue1070) {
          if (!scopeValue267(scopeValue1068[scopeValue1071], scopeValue1067[scopeValue1071], scopeValue1065.imageAssetIds?.[scopeValue1071] || "")) return true;
        }
      }
      return false;
    }
    async function scopeValue269(scopeValue1072, scopeValue1073 = "") {
      if (scopeValue248) return false;
      const scopeValue1074 = String(scopeValue1072 || "").trim();
      if (!scopeValue1074) {
        scopeValue242?.focus();
        showToast("请先填写预设名称");
        return false;
      }
      if (!scopeValue1073 && scopeValue250.presets.some(scopeValue1078 => scopeValue1078.name === scopeValue1074)) {
        showToast("已有同名预设，请使用“覆盖”");
        return false;
      }
      scopeValue254(true, "正在保存预设…");
      const scopeValue1075 = {
        bgUrl: scopeValue27.bgUrl,
        bgAssetId: scopeValue27.bgAssetId || "",
        apps: scopeValue27.apps.map(scopeValue1079 => ({
          id: scopeValue1079.id,
          icon: scopeValue1079.icon,
          iconAssetId: scopeValue1079.iconAssetId || ""
        }))
      };
      let scopeValue1076 = null;
      let scopeValue1077 = false;
      try {
        const scopeValue1080 = await scopeValue263();
        const scopeValue1081 = await scopeValue264(scopeValue1080);
        scopeValue1076 = window.getHomeWidgetThemeConfigs?.() || null;
        scopeValue1077 = true;
        if ((await scopeValue262()) === false) throw new Error("当前主题保存失败");
        if ((await window.applyHomeWidgetPresetVisuals?.(scopeValue1081.widgets)) === false) throw new Error("小组件保存失败");
        const scopeValue1082 = await scopeValue266();
        const scopeValue1083 = scopeValue250.presets.find(scopeValue1089 => scopeValue1089.id === scopeValue1073);
        const scopeValue1084 = new Date().toISOString();
        const scopeValue1085 = {
          id: scopeValue1083?.id || "desktop-preset-" + Date.now() + "-" + Math.random().toString(36).slice(2),
          name: scopeValue1074,
          createdAt: scopeValue1083?.createdAt || scopeValue1084,
          updatedAt: scopeValue1084
        };
        const scopeValue1086 = scopeValue251(scopeValue1085.id);
        const scopeValue1087 = scopeValue1083 ? window.appStorage.readDomain(scopeValue1086, {}).snapshot : null;
        await window.appStorage.commitDomain(scopeValue1086, () => ({
          version: 1,
          snapshot: scopeValue1080
        }), {
          critical: true,
          reason: "desktop-theme-preset-save"
        });
        const scopeValue1088 = {
          ...scopeValue250,
          activeId: scopeValue1085.id,
          fingerprint: scopeValue1082,
          presets: scopeValue1083 ? scopeValue250.presets.map(scopeValue1090 => scopeValue1090.id === scopeValue1083.id ? scopeValue1085 : scopeValue1090) : [...scopeValue250.presets, scopeValue1085]
        };
        try {
          await scopeValue253(scopeValue1088);
        } catch (scopeValue1091) {
          await window.appStorage.commitDomain(scopeValue1086, () => scopeValue1087 ? {
            version: 1,
            snapshot: scopeValue1087
          } : {
            version: 1,
            deleted: true
          });
          throw scopeValue1091;
        }
        if (scopeValue1087) setTimeout(() => window.appStorage.releaseAssetsFromDeletedRecords([scopeValue1087])["catch"](console.warn), 0);
        if (scopeValue242) scopeValue242.value = "";
        showToast("桌面预设已保存");
        return true;
      } catch (scopeValue1092) {
        if (scopeValue1077) {
          scopeValue27.bgUrl = scopeValue1075.bgUrl;
          scopeValue27.bgAssetId = scopeValue1075.bgAssetId;
          scopeValue27.apps.forEach(scopeValue1093 => {
            const scopeValue1094 = scopeValue1075.apps.find(scopeValue1095 => scopeValue1095.id === scopeValue1093.id);
            scopeValue1094 && (scopeValue1093.icon = scopeValue1094.icon, scopeValue1093.iconAssetId = scopeValue1094.iconAssetId);
          });
          scopeValue279(scopeValue27);
          scopeValue286(scopeValue27);
          try {
            if (scopeValue1076) await window.applyHomeWidgetPresetVisuals?.(scopeValue1076);
            await scopeValue381();
          } catch (scopeValue1096) {
            console.error("Failed to restore desktop after preset save", scopeValue1096);
          }
        }
        console.error("Failed to save desktop preset", scopeValue1092);
        showToast(scopeValue1092?.message || "预设保存失败");
        return false;
      } finally {
        scopeValue254(false);
        scopeValue255();
      }
    }
    function scopeValue270() {
      return new Promise(scopeValue1097 => {
        if (!scopeValue246) return scopeValue1097({
          action: "cancel"
        });
        const scopeValue1098 = scopeValue250.presets.some(scopeValue1105 => scopeValue1105.id === scopeValue250.activeId);
        scopeValue247.hidden = scopeValue1098;
        scopeValue247.value = scopeValue242?.value.trim() || "";
        const scopeValue1099 = document.activeElement;
        scopeValue246.hidden = false;
        const scopeValue1100 = document.getElementById("desktop-preset-dialog-cancel");
        const scopeValue1101 = document.getElementById("desktop-preset-dialog-discard");
        const scopeValue1102 = document.getElementById("desktop-preset-dialog-save");
        const scopeValue1103 = scopeValue1106 => {
          if (scopeValue1106 === "save" && !scopeValue1098 && !scopeValue247.value.trim()) {
            scopeValue247.focus();
            showToast("请先填写当前配置的预设名称");
            return;
          }
          scopeValue246.hidden = true;
          scopeValue1100.onclick = scopeValue1101.onclick = scopeValue1102.onclick = null;
          scopeValue246.removeEventListener("keydown", scopeValue1104);
          scopeValue1099?.focus?.();
          scopeValue1097({
            action: scopeValue1106,
            name: scopeValue247.value.trim()
          });
        };
        const scopeValue1104 = scopeValue1107 => {
          if (scopeValue1107.key === "Escape") scopeValue1103("cancel");else scopeValue1107.target === scopeValue247 && scopeValue222(scopeValue1107) && (scopeValue1107.preventDefault(), scopeValue1103("save"));
        };
        scopeValue1100.onclick = () => scopeValue1103("cancel");
        scopeValue1101.onclick = () => scopeValue1103("discard");
        scopeValue1102.onclick = () => scopeValue1103("save");
        scopeValue246.addEventListener("keydown", scopeValue1104);
        (scopeValue1098 ? scopeValue1100 : scopeValue247).focus();
      });
    }
    async function scopeValue271(scopeValue1108) {
      scopeValue254(true, "正在加载图片并切换…");
      const scopeValue1109 = {
        bgUrl: scopeValue27.bgUrl,
        bgAssetId: scopeValue27.bgAssetId || "",
        apps: scopeValue27.apps.map(scopeValue1111 => ({
          id: scopeValue1111.id,
          icon: scopeValue1111.icon,
          iconAssetId: scopeValue1111.iconAssetId || ""
        }))
      };
      let scopeValue1110 = null;
      try {
        if ((await window.desktopDataReadyPromise) === false) throw new Error("桌面数据尚未恢复，无法切换预设");
        const scopeValue1112 = window.appStorage.readDomain(scopeValue251(scopeValue1108.id), {}).snapshot;
        if (!scopeValue1112) throw new Error("预设内容已丢失");
        const scopeValue1113 = await scopeValue264(scopeValue1112, window.getHomeWidgetPresetTargets?.() || null);
        await scopeValue265(scopeValue1113);
        scopeValue1110 = window.getHomeWidgetThemeConfigs?.() || {};
        await new Promise(scopeValue1115 => requestAnimationFrame(scopeValue1115));
        scopeValue27.bgUrl = scopeValue1113.background.url;
        scopeValue27.bgAssetId = scopeValue1113.background.assetId;
        scopeValue27.apps.forEach(scopeValue1116 => {
          if (!Object.prototype.hasOwnProperty.call(scopeValue1113.apps, scopeValue1116.id)) return;
          scopeValue1116.icon = scopeValue1113.apps[scopeValue1116.id].url;
          scopeValue1116.iconAssetId = scopeValue1113.apps[scopeValue1116.id].assetId;
        });
        scopeValue279(scopeValue27);
        scopeValue286(scopeValue27);
        if ((await window.applyHomeWidgetPresetVisuals?.(scopeValue1113.widgets)) === false) throw new Error("小组件保存失败");
        if ((await scopeValue381()) === false) throw new Error("主题保存失败");
        const scopeValue1114 = await scopeValue266();
        await scopeValue253({
          ...scopeValue250,
          activeId: scopeValue1108.id,
          fingerprint: scopeValue1114
        });
        scopeValue285();
        showToast("已切换到“" + scopeValue1108.name + "”");
        return true;
      } catch (scopeValue1117) {
        scopeValue27.bgUrl = scopeValue1109.bgUrl;
        scopeValue27.bgAssetId = scopeValue1109.bgAssetId;
        scopeValue27.apps.forEach(scopeValue1118 => {
          const scopeValue1119 = scopeValue1109.apps.find(scopeValue1120 => scopeValue1120.id === scopeValue1118.id);
          scopeValue1119 && (scopeValue1118.icon = scopeValue1119.icon, scopeValue1118.iconAssetId = scopeValue1119.iconAssetId);
        });
        scopeValue279(scopeValue27);
        scopeValue286(scopeValue27);
        if (scopeValue1110) try {
          await window.applyHomeWidgetPresetVisuals?.(scopeValue1110);
        } catch (scopeValue1121) {
          console.error("Failed to restore widgets", scopeValue1121);
        }
        await scopeValue381();
        scopeValue285();
        console.error("Failed to apply desktop preset", scopeValue1117);
        showToast(scopeValue1117?.message || "预设切换失败");
        return false;
      } finally {
        scopeValue254(false);
        scopeValue255();
      }
    }
    async function scopeValue272(scopeValue1122) {
      if (scopeValue248 || scopeValue249) return;
      scopeValue249 = true;
      try {
        const scopeValue1123 = scopeValue250.presets.find(scopeValue1126 => scopeValue1126.id === scopeValue1122);
        if (!scopeValue1123) return;
        const scopeValue1124 = await scopeValue266();
        const scopeValue1125 = !scopeValue250.activeId || !scopeValue250.fingerprint || scopeValue1124 !== scopeValue250.fingerprint && (await scopeValue268());
        if (scopeValue1123.id === scopeValue250.activeId && !scopeValue1125) return;
        if (scopeValue1125) {
          const scopeValue1127 = await scopeValue270();
          if (scopeValue1127.action === "cancel") return;
          if (scopeValue1127.action === "save") {
            const scopeValue1128 = scopeValue250.presets.find(scopeValue1129 => scopeValue1129.id === scopeValue250.activeId);
            if (!(await scopeValue269(scopeValue1128?.name || scopeValue1127.name, scopeValue1128?.id || ""))) return;
            if (scopeValue1123.id === scopeValue250.activeId) return;
          }
        }
        await scopeValue271(scopeValue250.presets.find(scopeValue1130 => scopeValue1130.id === scopeValue1122) || scopeValue1123);
      } catch (scopeValue1131) {
        console.error("Failed to switch desktop preset", scopeValue1131);
        showToast("预设切换失败");
      } finally {
        scopeValue249 = false;
      }
    }
    async function scopeValue273(scopeValue1132) {
      if (scopeValue248) return;
      const scopeValue1133 = scopeValue250.presets.find(scopeValue1135 => scopeValue1135.id === scopeValue1132);
      if (!scopeValue1133 || !window.confirm("删除桌面预设“" + scopeValue1133.name + "”？")) return;
      scopeValue254(true, "正在删除预设…");
      const scopeValue1134 = scopeValue250;
      try {
        const scopeValue1136 = scopeValue251(scopeValue1132);
        const scopeValue1137 = window.appStorage.readDomain(scopeValue1136, {}).snapshot;
        await scopeValue253({
          ...scopeValue250,
          activeId: scopeValue250.activeId === scopeValue1132 ? "" : scopeValue250.activeId,
          fingerprint: scopeValue250.activeId === scopeValue1132 ? "" : scopeValue250.fingerprint,
          presets: scopeValue250.presets.filter(scopeValue1138 => scopeValue1138.id !== scopeValue1132)
        });
        await window.appStorage.commitDomain(scopeValue1136, () => ({
          version: 1,
          deleted: true
        }), {
          critical: true,
          reason: "desktop-theme-preset-delete"
        });
        if (scopeValue1137) setTimeout(() => window.appStorage.releaseAssetsFromDeletedRecords([scopeValue1137])["catch"](console.warn), 0);
        showToast("桌面预设已删除");
      } catch (scopeValue1139) {
        if (!scopeValue250.presets.some(scopeValue1140 => scopeValue1140.id === scopeValue1132)) try {
          await scopeValue253(scopeValue1134);
        } catch (scopeValue1141) {
          console.error("Failed to restore preset index", scopeValue1141);
        }
        console.error("Failed to delete desktop preset", scopeValue1139);
        showToast("删除失败，请重试");
      } finally {
        scopeValue254(false);
        scopeValue255();
      }
    }
    scopeValue252();
    scopeValue255();
    document.getElementById("desktop-preset-save")?.addEventListener("click", () => scopeValue269(scopeValue242?.value));
    scopeValue242?.addEventListener("keydown", scopeValue1142 => {
      if (!scopeValue222(scopeValue1142)) return;
      scopeValue1142.preventDefault();
      const scopeValue1143 = scopeValue242.value;
      scopeValue242.blur();
      scopeValue269(scopeValue1143);
    });
    function scopeValue274() {
      const scopeValue1144 = typeof window.getHomeWidgetThemeConfigs === "function" ? window.getHomeWidgetThemeConfigs() : window.getAppState?.("desktop")?.widgets || {};
      return {
        format: scopeValue233,
        version: scopeValue234,
        exportedAt: new Date().toISOString(),
        background: scopeValue27.bgUrl ?? null,
        apps: scopeValue27.apps.map(scopeValue1145 => ({
          id: String(scopeValue1145.id),
          name: String(scopeValue1145.name || ""),
          icon: scopeValue1145.icon ?? null
        })),
        widgets: scopeValue1144
      };
    }
    async function scopeValue275() {
      const scopeValue1146 = scopeValue274();
      const scopeValue1147 = async (scopeValue1148, scopeValue1149) => {
        const scopeValue1150 = await scopeValue258(scopeValue1148, scopeValue1149 || "");
        return scopeValue1150 ? window.appStorage.blobToDataUrl(scopeValue1150) : scopeValue1148;
      };
      scopeValue1146.background = await scopeValue1147(scopeValue1146.background, scopeValue27.bgAssetId);
      for (let scopeValue1151 = 0; scopeValue1151 < scopeValue1146.apps.length; scopeValue1151 += 1) {
        scopeValue1146.apps[scopeValue1151].icon = await scopeValue1147(scopeValue1146.apps[scopeValue1151].icon, scopeValue27.apps[scopeValue1151]?.iconAssetId);
      }
      for (const scopeValue1152 of Object.values(scopeValue1146.widgets || {})) {
        if (!scopeValue1152 || typeof scopeValue1152 !== "object") continue;
        for (const [scopeValue1153, scopeValue1154] of Object.entries(scopeValue1152.images || {})) {
          scopeValue1152.images[scopeValue1153] = await scopeValue1147(scopeValue1154, scopeValue1152.imageAssetIds?.[scopeValue1153]);
        }
        delete scopeValue1152.imageAssetIds;
      }
      return scopeValue1146;
    }
    function scopeValue276(scopeValue1155) {
      let scopeValue1156;
      try {
        scopeValue1156 = JSON.parse(String(scopeValue1155 || ""));
      } catch (scopeValue1159) {
        throw new Error("主题文件不是有效的 JSON");
      }
      if (!scopeValue1156 || typeof scopeValue1156 !== "object" || Array.isArray(scopeValue1156)) throw new Error("主题文件结构无效");
      if (scopeValue1156.format !== scopeValue233) throw new Error("这不是 U2 主屏主题文件");
      if (!scopeValue235.has(scopeValue1156.version)) throw new Error("不支持的主题文件版本：" + (scopeValue1156.version ?? "未知"));
      if (!Object.prototype.hasOwnProperty.call(scopeValue1156, "background") || scopeValue1156.background !== null && typeof scopeValue1156.background !== "string") throw new Error("主题背景数据无效");
      if (!Array.isArray(scopeValue1156.apps)) throw new Error("主题图标数据无效");
      const scopeValue1157 = new Map();
      scopeValue1156.apps.forEach(scopeValue1160 => {
        if (!scopeValue1160 || typeof scopeValue1160 !== "object" || Array.isArray(scopeValue1160)) throw new Error("主题图标项目无效");
        const scopeValue1161 = typeof scopeValue1160.id === "string" ? scopeValue1160.id.trim() : "";
        if (!scopeValue1161 || scopeValue1160.icon !== null && typeof scopeValue1160.icon !== "string") throw new Error("主题图标项目缺少有效 ID 或图标");
        if (scopeValue1157.has(scopeValue1161)) throw new Error("主题图标 ID 重复：" + scopeValue1161);
        scopeValue1157.set(scopeValue1161, scopeValue1160.icon);
      });
      let scopeValue1158 = null;
      if (scopeValue1156.version >= 2) {
        if (!scopeValue1156.widgets || typeof scopeValue1156.widgets !== "object" || Array.isArray(scopeValue1156.widgets)) throw new Error("主题小组件数据无效");
        scopeValue1158 = Object.create(null);
        Object.entries(scopeValue1156.widgets).forEach(([scopeValue1162, scopeValue1163]) => {
          if (!scopeValue1162 || !scopeValue1163 || typeof scopeValue1163 !== "object" || Array.isArray(scopeValue1163)) throw new Error("主题小组件项目无效");
          scopeValue1158[scopeValue1162] = scopeValue1163;
        });
      }
      return {
        background: scopeValue1156.background,
        apps: scopeValue1157,
        widgets: scopeValue1158
      };
    }
    function scopeValue277(scopeValue1164, scopeValue1165, scopeValue1166) {
      const scopeValue1167 = {};
      for (const [scopeValue1168, scopeValue1169] of Object.entries(scopeValue1164 || {})) {
        const scopeValue1170 = scopeValue1165[scopeValue1168];
        if (!scopeValue1170 || !scopeValue1166[scopeValue1168] || scopeValue1166[scopeValue1168] !== scopeValue1170.type || scopeValue1169.type && scopeValue1169.type !== scopeValue1170.type) continue;
        const scopeValue1171 = scopeValue1169.images && typeof scopeValue1169.images === "object" && !Array.isArray(scopeValue1169.images) ? scopeValue1169.images : {};
        const scopeValue1172 = {
          ...(scopeValue1170.imageAssetIds || {})
        };
        for (const scopeValue1173 of Object.keys(scopeValue1171)) delete scopeValue1172[scopeValue1173];
        scopeValue1167[scopeValue1168] = {
          type: scopeValue1170.type,
          name: typeof scopeValue1169.name === "string" ? scopeValue1169.name : scopeValue1170.name,
          color: typeof scopeValue1169.color === "string" ? scopeValue1169.color : scopeValue1170.color,
          text: scopeValue1169.text && typeof scopeValue1169.text === "object" && !Array.isArray(scopeValue1169.text) ? {
            ...(scopeValue1170.text || {}),
            ...scopeValue1169.text
          } : scopeValue1170.text,
          images: {
            ...(scopeValue1170.images || {}),
            ...scopeValue1171
          },
          imageAssetIds: scopeValue1172,
          html: typeof scopeValue1169.html === "string" ? scopeValue1169.html : scopeValue1170.html
        };
      }
      return scopeValue1167;
    }
    async function scopeValue278(scopeValue1174) {
      if (!window.desktopDataReadyPromise || (await window.desktopDataReadyPromise) === false) throw new Error("桌面数据尚未恢复，无法导入主题");
      const scopeValue1175 = {
        bgUrl: scopeValue27.bgUrl,
        bgAssetId: scopeValue27.bgAssetId || "",
        apps: scopeValue27.apps.map(scopeValue1180 => ({
          id: scopeValue1180.id,
          icon: scopeValue1180.icon,
          iconAssetId: scopeValue1180.iconAssetId || ""
        }))
      };
      const scopeValue1176 = window.getHomeWidgetThemeConfigs?.() || {};
      const scopeValue1177 = scopeValue277(scopeValue1174.widgets, scopeValue1176, window.getHomeWidgetPresetTargets?.() || {});
      const scopeValue1178 = Object.fromEntries(Object.keys(scopeValue1177).map(scopeValue1181 => [scopeValue1181, scopeValue1176[scopeValue1181]]));
      if (Object.keys(scopeValue1177).length && typeof window.applyHomeWidgetPresetVisuals !== "function") throw new Error("桌面小组件尚未准备好，无法导入主题");
      let scopeValue1179 = false;
      try {
        scopeValue1179 = true;
        scopeValue27.bgUrl = scopeValue1174.background;
        scopeValue27.bgAssetId = "";
        scopeValue27.apps.forEach(scopeValue1182 => {
          scopeValue1174.apps.has(String(scopeValue1182.id)) && (scopeValue1182.icon = scopeValue1174.apps.get(String(scopeValue1182.id)), scopeValue1182.iconAssetId = "");
        });
        scopeValue279(scopeValue27);
        scopeValue286(scopeValue27);
        if (Object.keys(scopeValue1177).length && (await window.applyHomeWidgetPresetVisuals(scopeValue1177)) === false) throw new Error("小组件保存失败");
        if ((await scopeValue262()) === false) throw new Error("主题保存失败");
        scopeValue252();
        scopeValue250.activeId && (await scopeValue253({
          ...scopeValue250,
          activeId: "",
          fingerprint: ""
        }));
        scopeValue285();
      } catch (scopeValue1183) {
        if (scopeValue1179) {
          scopeValue27.bgUrl = scopeValue1175.bgUrl;
          scopeValue27.bgAssetId = scopeValue1175.bgAssetId;
          scopeValue27.apps.forEach(scopeValue1184 => {
            const scopeValue1185 = scopeValue1175.apps.find(scopeValue1186 => scopeValue1186.id === scopeValue1184.id);
            scopeValue1185 && (scopeValue1184.icon = scopeValue1185.icon, scopeValue1184.iconAssetId = scopeValue1185.iconAssetId);
          });
          scopeValue279(scopeValue27);
          scopeValue286(scopeValue27);
          try {
            if (Object.keys(scopeValue1178).length) await window.applyHomeWidgetPresetVisuals(scopeValue1178);
            await scopeValue381();
            scopeValue285();
          } catch (scopeValue1187) {
            console.error("Failed to restore home theme after import", scopeValue1187);
          }
        }
        throw scopeValue1183;
      }
    }
    scopeValue236 && scopeValue236.addEventListener("click", async () => {
      try {
        const scopeValue1188 = JSON.stringify(await scopeValue275(), null, 2);
        const scopeValue1189 = new Blob([scopeValue1188], {
          type: "application/json;charset=utf-8"
        });
        const scopeValue1190 = await window.u2ExportFile({
          blob: scopeValue1189,
          fileName: "u2-home-theme-" + new Date().toISOString().slice(0, 10) + ".json",
          title: "U2 主屏主题"
        });
        if (scopeValue1190 === "shared" || scopeValue1190 === "downloaded") showToast("主屏主题已导出");else {
          if (scopeValue1190 === "failed") showToast("主题导出失败");
        }
      } catch (scopeValue1191) {
        console.error("Failed to export home theme", scopeValue1191);
        showToast("主题导出失败");
      }
    });
    scopeValue237 && scopeValue237.addEventListener("change", async () => {
      const scopeValue1192 = scopeValue237.files?.[0];
      scopeValue237.value = "";
      if (!scopeValue1192) return;
      if (!String(scopeValue1192.name || "").toLowerCase().endsWith(".json")) {
        showToast("请选择 JSON 主题文件");
        return;
      }
      try {
        const scopeValue1193 = scopeValue276(await scopeValue1192.text());
        await scopeValue278(scopeValue1193);
        showToast("主屏主题已导入");
      } catch (scopeValue1194) {
        console.error("Failed to import home theme", scopeValue1194);
        showToast(scopeValue1194?.message || "主题导入失败");
      }
    });
    if (scopeValue238) scopeValue238.addEventListener("click", () => scopeValue240?.click());
    scopeValue239 && scopeValue239.addEventListener("click", () => {
      scopeValue27.bgUrl = null;
      scopeValue27.bgAssetId = "";
      scopeValue280("背景已重置");
    });
    scopeValue240 && scopeValue240.addEventListener("change", scopeValue1195 => {
      const scopeValue1196 = scopeValue1195.target.files[0];
      if (scopeValue1196) {
        const scopeValue1197 = new FileReader();
        scopeValue1197.onload = scopeValue1198 => {
          window.compressImage ? window.compressImage(scopeValue1198.target.result, 1080, 1920, scopeValue1199 => {
            scopeValue27.bgUrl = scopeValue1199;
            scopeValue280("背景已更新");
          }) : (scopeValue27.bgUrl = scopeValue1198.target.result, scopeValue280("背景已更新"));
        };
        scopeValue1197.readAsDataURL(scopeValue1196);
      }
      scopeValue1195.target.value = "";
    });
    async function newScope275() {
      const scopeValue1202 = typeof scopeValue27.bgUrl === "string" ? scopeValue27.bgUrl.trim() : "";
      scopeValue1202 && typeof Image === "function" && (await new Promise(newScope1203 => {
        const newScope1204 = new Image();
        let newScope1205 = false;
        const newScope1206 = () => {
            if (newScope1205) return;
            newScope1205 = true, clearTimeout(newScope1207), newScope1204.onload = null, newScope1204.onerror = null, newScope1203();
          },
          newScope1207 = setTimeout(newScope1206, 8000);
        newScope1204.onload = async () => {
          try {
            await newScope1204.decode?.();
          } catch (newScope1208) {}
          newScope1206();
        }, newScope1204.onerror = newScope1206, newScope1204.src = scopeValue1202;
      })), scopeValue279(scopeValue27), window.markDesktopThemeReady?.();
    }
    function scopeValue279(newScope1209) {
      const scopeValue1201 = document.getElementById("app");
      if (!scopeValue1201) return;
      const newScope1211 = typeof newScope1209.bgUrl === "string" ? newScope1209.bgUrl.trim() : "";
      newScope1211 ? (scopeValue1201.style.backgroundImage = "url(" + newScope1211 + ")", scopeValue1201.style.backgroundSize = "cover", scopeValue1201.style.backgroundPosition = "center", scopeValue1201.style.backgroundColor = "transparent", document.body.style.backgroundImage = "url(" + newScope1211 + ")", document.body.style.backgroundSize = "cover", document.body.style.backgroundPosition = "center") : (scopeValue1201.style.backgroundImage = "", scopeValue1201.style.backgroundColor = "", document.body.style.backgroundImage = "", document.body.style.backgroundSize = "", document.body.style.backgroundPosition = ""), window.dispatchEvent(new CustomEvent("u2:home-wallpaper-changed"));
    }
    async function scopeValue280(scopeValue1203 = "") {
      scopeValue279(scopeValue27);
      try {
        if ((await scopeValue262()) === false) throw new Error("save failed");
        if (scopeValue1203) showToast(scopeValue1203);
      } catch (scopeValue1204) {
        console.error("Failed to save desktop background", scopeValue1204);
        showToast("背景保存失败");
      }
    }
    const scopeValue281 = document.getElementById("theme-app-list"),
      scopeValue282 = document.getElementById("theme-app-file-input"),
      scopeValue283 = document.getElementById("theme-reset-all-icons-btn");
    let scopeValue284 = -1;
    scopeValue283 && scopeValue283.addEventListener("click", () => {
      scopeValue27.apps.forEach(scopeValue1205 => {
        scopeValue1205.icon = scopeValue25[scopeValue1205.id] || null;
        scopeValue1205.iconAssetId = "";
      });
      scopeValue287("应用图标已全部重置");
    });
    scopeValue282 && scopeValue282.addEventListener("change", async scopeValue1206 => {
      const scopeValue1207 = scopeValue1206.target.files?.[0],
        scopeValue1208 = scopeValue284;
      try {
        if (!scopeValue1207 || scopeValue1208 < 0 || !scopeValue27.apps[scopeValue1208]) return;
        const scopeValue1209 = await scopeValue65(scopeValue1207, {
            maxWidth: 150,
            maxHeight: 150,
            outputType: "image/png"
          }),
          scopeValue1210 = scopeValue27.apps[scopeValue1208]?.name || "应用";
        scopeValue27.apps[scopeValue1208].icon = scopeValue1209;
        scopeValue27.apps[scopeValue1208].iconAssetId = "";
        scopeValue287(scopeValue1210 + " 图标已更新");
      } catch (scopeValue1211) {
        console.error("Failed to process app icon.", scopeValue1211);
        showToast("图标处理失败，请更换图片后重试");
      } finally {
        scopeValue1206.target.value = "";
      }
    });
    function scopeValue285() {
      if (!scopeValue281) return;
      scopeValue281.innerHTML = "";
      scopeValue27.apps.forEach((scopeValue1212, scopeValue1213) => {
        const scopeValue1214 = document.createElement("div"),
          scopeValue1215 = window.u2UiTranslation?.getAppName ? window.u2UiTranslation.getAppName(scopeValue1212) : scopeValue1212.name;
        scopeValue1214.className = "form-item";
        scopeValue1214.style.padding = "8px 16px";
        scopeValue1214.style.height = "60px";
        scopeValue1214.style.display = "flex";
        scopeValue1214.style.justifyContent = "space-between";
        scopeValue1214.style.alignItems = "center";
        scopeValue1214.style.borderBottom = "1px solid #f2f2f7";
        let scopeValue1216 = "";
        scopeValue1212.icon ? scopeValue1216 = "<div style=\"width: 40px; height: 40px; border-radius: 10px; background-image: url('" + scopeValue1212.icon + "'); background-size: cover; background-position: center; border: 1px solid #e5e5ea; flex-shrink: 0;\"></div>" : scopeValue1216 = "<div style=\"width: 40px; height: 40px; border-radius: 10px; background-color: #f2f2f7; border: 1px solid #e5e5ea; display: flex; align-items: center; justify-content: center; color: #c7c7cc; flex-shrink: 0;\"><i class=\"fas fa-image\"></i></div>";
        scopeValue1214.innerHTML = `
                    <div style="display: flex; align-items: center; flex: 1;">
                        ` + scopeValue1216 + `
                        <div style="margin-left: 12px; font-size: 16px; font-weight: 500; color: #000;">` + scopeValue1215 + `</div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <div class="reset-single-app-btn" style="width: 32px; height: 32px; border-radius: 50%; background: #ffebee; color: #ff3b30; display: flex; justify-content: center; align-items: center; cursor: pointer;">
                            <i class="fas fa-undo" style="font-size: 14px;"></i>
                        </div>
                        <div class="upload-single-app-btn" style="width: 32px; height: 32px; border-radius: 50%; background: #e8f5e9; color: #34c759; display: flex; justify-content: center; align-items: center; cursor: pointer;">
                            <i class="fas fa-upload" style="font-size: 14px;"></i>
                        </div>
                    </div>
                `;
        const scopeValue1217 = scopeValue1214.querySelector(".reset-single-app-btn");
        scopeValue1217.addEventListener("click", scopeValue1219 => {
          scopeValue1219.stopPropagation();
          scopeValue27.apps[scopeValue1213].icon = scopeValue25[scopeValue1212.id] || null;
          scopeValue27.apps[scopeValue1213].iconAssetId = "";
          scopeValue287(scopeValue1212.name + " 图标已重置");
        });
        const scopeValue1218 = scopeValue1214.querySelector(".upload-single-app-btn");
        scopeValue1218.addEventListener("click", scopeValue1220 => {
          scopeValue1220.stopPropagation();
          scopeValue284 = scopeValue1213;
          scopeValue282?.click();
        });
        scopeValue281.appendChild(scopeValue1214);
      });
    }
    function scopeValue286(scopeValue1221) {
      if (!Array.isArray(scopeValue1221.apps)) return;
      scopeValue1221.apps.forEach(scopeValue1222 => {
        if (!scopeValue1222.iconAssetId) scopeValue1222.icon = scopeValue26(scopeValue1222.icon);
        scopeValue288(scopeValue1222);
      });
    }
    async function scopeValue287(scopeValue1223 = "") {
      scopeValue286(scopeValue27), scopeValue285();
      try {
        if ((await scopeValue262()) === false) throw new Error("save failed");
        if (scopeValue1223) showToast(scopeValue1223);
      } catch (newScope1233) {
        console.error("Failed to save desktop icons", newScope1233), showToast("应用图标保存失败");
      }
    }
    function scopeValue288(scopeValue1224) {
      const scopeValue1225 = document.getElementById(scopeValue1224.id);
      if (!scopeValue1225) return;
      const scopeValue1226 = scopeValue1225.classList.contains("app-item") ? scopeValue1225 : scopeValue1225.closest(".app-item"),
        scopeValue1227 = scopeValue1225.classList.contains("app-icon") ? scopeValue1225 : scopeValue1225.querySelector(".app-icon") || scopeValue1226?.querySelector(".app-icon"),
        scopeValue1228 = scopeValue1226 ? scopeValue1226.querySelector(".app-name") : scopeValue1225.querySelector(".app-name");
      scopeValue1228 && scopeValue1224.name && (window.u2UiTranslation?.applyAppName ? window.u2UiTranslation.applyAppName(scopeValue1228, scopeValue1224) : scopeValue1228.textContent = scopeValue1224.name);
      if (!scopeValue1227) return;
      const scopeValue1229 = (scopeValue1231, scopeValue1232 = "") => {
        return scopeValue1227.innerHTML = "<i class=\"" + scopeValue1231 + "\" style=\"" + scopeValue1232 + "\"></i>", scopeValue1227.querySelector("i");
      };
      const scopeValue1230 = scopeValue1224.icon || (scopeValue1224.id === "app-icon-8" ? scopeValue25["app-icon-8"] : "");
      if (scopeValue1230) {
        scopeValue1227.innerHTML = "";
        scopeValue1227.classList.add("has-custom-app-icon");
        scopeValue1227.style.setProperty("background", `url(${scopeValue1230}) center / cover no-repeat`, "important");
        scopeValue1227.style.setProperty("background-image", `url(${scopeValue1230})`, "important");
        scopeValue1227.style.setProperty("background-size", "cover", "important");
        scopeValue1227.style.setProperty("background-position", "center", "important");
        scopeValue1227.style.setProperty("background-repeat", "no-repeat", "important");
        scopeValue1227.style.setProperty("background-color", "transparent", "important");
        scopeValue1227.style.setProperty("border", "none", "important");
      } else {
        scopeValue1227.classList.remove("has-custom-app-icon");
        scopeValue1227.style.removeProperty("background");
        scopeValue1227.style.removeProperty("background-image");
        scopeValue1227.style.removeProperty("background-size");
        scopeValue1227.style.removeProperty("background-position");
        scopeValue1227.style.removeProperty("background-repeat");
        scopeValue1227.style.removeProperty("background-color");
        scopeValue1227.style.removeProperty("border");
        scopeValue1227.style.removeProperty("box-shadow");
        scopeValue1227.style.backgroundImage = "none";
        scopeValue1227.style.backgroundSize = "";
        scopeValue1227.style.backgroundPosition = "";
        scopeValue1227.style.backgroundColor = "";
        scopeValue1227.style.color = "";
        scopeValue1227.style.border = "1px solid #e5e5ea";
        scopeValue1227.style.display = "flex";
        scopeValue1227.style.justifyContent = "center";
        scopeValue1227.style.alignItems = "center";
        scopeValue1227.innerHTML = "";
        const scopeValue1233 = !!window.u2ThemeState?.bgUrl,
          scopeValue1234 = scopeValue1233 ? "rgba(255, 255, 255, 0.7)" : "#ffffff",
          scopeValue1235 = scopeValue1233 ? "rgba(255, 255, 255, 0.8)" : "linear-gradient(180deg, #ffffff 0%, #f2f2f7 100%)";
        if (scopeValue1224.id === "dock-icon-settings") {
          scopeValue1227.style.background = scopeValue1234;
          scopeValue1227.style.color = "#1c1c1e";
          scopeValue1229("fas fa-cog");
        } else {
          if (scopeValue1224.id === "dock-icon-imessage") {
            scopeValue1227.style.background = scopeValue1235;
            scopeValue1227.style.color = "#1c1c1e";
            scopeValue1229("fas fa-comment");
          } else {
            if (scopeValue1224.id === "dock-icon-youtube") {
              scopeValue1227.style.background = scopeValue1234;
              scopeValue1227.style.color = "#1c1c1e";
              scopeValue1227.style.fontSize = "38px";
              scopeValue1229("fab fa-youtube");
            } else {
              if (scopeValue1224.id === "app-icon-1") {
                scopeValue1227.style.background = scopeValue1234;
                scopeValue1227.style.color = "#1c1c1e";
                scopeValue1229("fas fa-wallet");
              } else {
                if (scopeValue1224.id === "app-icon-2") {
                  scopeValue1227.style.background = scopeValue1234;
                  scopeValue1227.style.color = "#1c1c1e";
                  scopeValue1229("fab fa-tiktok");
                } else {
                  if (scopeValue1224.id === "app-icon-3") {
                    scopeValue1227.style.background = scopeValue1234;
                    scopeValue1227.style.color = "#1c1c1e";
                    scopeValue1229("fas fa-layer-group", "font-size: 26px;");
                  } else {
                    if (scopeValue1224.id === "app-icon-4") {
                      scopeValue1227.style.background = scopeValue1234;
                      scopeValue1227.style.color = "#1c1c1e";
                      scopeValue1229("fa-brands fa-x-twitter", "font-size: 26px;");
                    } else {
                      if (scopeValue1224.id === "app-icon-5") {
                        scopeValue1227.style.background = scopeValue1234;
                        scopeValue1227.style.color = "#1c1c1e";
                        scopeValue1229("fas fa-shopping-bag", "color: #1c1c1e; font-size: 30px; filter: none;");
                      } else {
                        if (scopeValue1224.id === "app-icon-6") {
                          scopeValue1227.style.background = "#ffffff";
                          scopeValue1227.style.color = "#1c1c1e";
                          scopeValue1227.style.fontSize = "27px";
                          scopeValue1227.style.border = "1px solid #e5e5ea";
                          scopeValue1229("fas fa-book-open", "color: #1c1c1e; font-size: 27px; filter: none;");
                        } else {
                          if (scopeValue1224.id === "app-icon-7") {
                            scopeValue1227.style.background = scopeValue1234;
                            scopeValue1227.style.color = "#1c1c1e";
                            scopeValue1227.style.border = scopeValue1233 ? "none" : "1px solid #e5e5ea";
                            scopeValue1227.style.fontSize = "32px";
                            scopeValue1227.style.fontWeight = "900";
                            scopeValue1227.style.fontFamily = "Arial, sans-serif";
                            scopeValue1227.style.letterSpacing = "-1px";
                            scopeValue1227.innerHTML = "N";
                          } else {
                            if (scopeValue1224.id === "app-icon-8") {
                              scopeValue1227.style.background = scopeValue1234;
                              scopeValue1227.style.color = "#1c1c1e";
                              scopeValue1229("fas fa-heart", "color: #1c1c1e; font-size: 28px;");
                            } else {
                              if (scopeValue1224.id === "app-icon-9") {
                                scopeValue1227.style.background = scopeValue1234;
                                scopeValue1227.style.color = "#1c1c1e";
                                scopeValue1229("fab fa-app-store-ios", "color: #1c1c1e; font-size: 29px;");
                              } else {
                                if (scopeValue1224.id === "app-icon-10") {
                                  scopeValue1227.style.background = scopeValue1234;
                                  scopeValue1227.style.color = "#1c1c1e";
                                  scopeValue1229("fas fa-images", "color: #1c1c1e; font-size: 27px;");
                                } else {
                                  if (scopeValue1224.id === "app-icon-11") {
                                    scopeValue1227.style.background = scopeValue1234;
                                    scopeValue1227.style.color = "#1c1c1e";
                                    scopeValue1229("fas fa-plug", "color: #1c1c1e; font-size: 27px;");
                                  } else {
                                    if (scopeValue1224.id === "app-icon-12") {
                                      scopeValue1227.style.background = scopeValue1234;
                                      scopeValue1227.style.color = "#1c1c1e";
                                      scopeValue1229("fas fa-book", "color: #1c1c1e; font-size: 28px;");
                                    } else {
                                      if (scopeValue1224.id === "app-icon-13") {
                                        scopeValue1227.style.background = scopeValue1234;
                                        scopeValue1227.style.color = "#1c1c1e";
                                        scopeValue1229("fas fa-book-open", "color: #1c1c1e; font-size: 27px;");
                                      } else {
                                        if (scopeValue1224.id === "app-icon-14") {
                                          scopeValue1227.style.background = scopeValue1234;
                                          scopeValue1227.style.color = "#1c1c1e";
                                          scopeValue1229("fas fa-phone", "color: #1c1c1e; font-size: 27px; transform: rotate(-12deg);");
                                        } else scopeValue1224.id === "app-icon-15" ? (scopeValue1227.style.background = scopeValue1234, scopeValue1227.style.color = "#1c1c1e", scopeValue1229("fas fa-mobile-screen-button", "color: #1c1c1e; font-size: 27px;")) : scopeValue1224.id === "app-icon-16" && (scopeValue1227.style.background = "#ffffff", scopeValue1227.style.color = "#1c1c1e", scopeValue1229("fas fa-circle-notch", "color: #1c1c1e; font-size: 27px;"));
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    const scopeValue289 = document.getElementById("theme-font-btn"),
      scopeValue290 = document.getElementById("theme-font-modal"),
      scopeValue291 = document.getElementById("theme-font-close-btn"),
      scopeValue292 = document.getElementById("theme-font-modal-preview"),
      scopeValue293 = document.getElementById("theme-font-modal-user-preset-list"),
      scopeValue294 = document.getElementById("theme-font-name-input"),
      scopeValue295 = document.getElementById("theme-font-url-input"),
      scopeValue296 = document.getElementById("theme-font-local-name-input"),
      scopeValue297 = document.getElementById("theme-font-upload-btn"),
      scopeValue298 = document.getElementById("theme-font-file-input"),
      scopeValue299 = document.getElementById("theme-font-file-status"),
      scopeValue300 = document.getElementById("theme-font-add-btn"),
      scopeValue301 = Array.from(document.querySelectorAll(".theme-font-source-tab")),
      scopeValue302 = Array.from(document.querySelectorAll(".theme-font-source-panel")),
      scopeValue303 = document.getElementById("theme-font-size-slider"),
      scopeValue304 = document.getElementById("theme-font-size-value"),
      scopeValue305 = "Aa 你好 Hello 123",
      scopeValue306 = 20971520,
      scopeValue307 = 5242880,
      scopeValue308 = new Set(["ttf", "otf", "woff", "woff2"]),
      scopeValue309 = 16,
      scopeValue310 = ["script", "style", "link", "meta", "svg", "path", "canvas", "video", "audio", ".app-icon", ".icon-placeholder", "i", ".fa", ".fas", ".far", ".fab", ".fal", ".fa-solid", ".fa-regular", ".fa-brands", "#theme-bubble-css-input", "#theme-chat-css-input", "#theme-group-css-input", "#theme-status-template-prompt", "#theme-status-template-regex", "#theme-status-template-html", "#bubble-css-input", "#status-css-input", "textarea[placeholder*=\"CSS\"]", "textarea[placeholder*=\"css\"]"].join(","),
      scopeValue311 = ["#u2-login-screen", ".mcp-page", ".mcp-token-dialog", ".app-view", ".settings-view", ".edit-view", ".bottom-sheet-overlay", ".tk-sub-profile-view", ".tk-tab-content", ".yt-tab-content", ".x-tab-content", ".modal-overlay", ".wb-centered-modal-overlay", ".toast-bubble"].join(","),
      scopeValue312 = [".mcp-page.active", ".mcp-token-dialog.active", ".app-view.active", ".settings-view.active", ".edit-view.active", ".bottom-sheet-overlay.active", ".tk-sub-profile-view.active", ".tk-tab-content.active", ".yt-tab-content.active", ".x-tab-content.active", ".modal-overlay.active", ".wb-centered-modal-overlay.active", ".toast-bubble.show"].join(","),
      scopeValue313 = [".mcp-page:not(.active)", ".mcp-token-dialog:not(.active)", "#u2-login-screen.is-hidden", ".app-view:not(.active)", ".settings-view:not(.active)", ".edit-view:not(.active)", ".bottom-sheet-overlay:not(.active)", ".tk-sub-profile-view:not(.active)", ".tk-tab-content:not(.active)", ".yt-tab-content:not(.active)", ".x-tab-content:not(.active)", "[hidden]", "[aria-hidden=\"true\"]"].join(","),
      scopeValue314 = ["#pages-container", "#dock", ".page-indicators", ".home-search-pill", "#home-ios-status-bar"].join(","),
      scopeValue315 = new Map(),
      scopeValue316 = new Set(),
      scopeValue317 = new WeakSet(),
      scopeValue318 = new WeakSet(),
      scopeValue319 = new WeakSet(),
      scopeValue320 = new WeakMap(),
      scopeValue321 = new Set();
    let scopeValue322 = null,
      scopeValue323 = null,
      scopeValue324 = "local",
      scopeValue325 = 0,
      scopeValue326 = null,
      scopeValue327 = null,
      scopeValue328 = 0,
      scopeValue329 = 0;
    function scopeValue330(scopeValue1236 = {}) {
      return {
        woff2: typeof scopeValue1236.woff2 === "string" ? scopeValue1236.woff2.trim() : "",
        woff: typeof scopeValue1236.woff === "string" ? scopeValue1236.woff.trim() : "",
        ttf: typeof scopeValue1236.ttf === "string" ? scopeValue1236.ttf.trim() : "",
        otf: typeof scopeValue1236.otf === "string" ? scopeValue1236.otf.trim() : ""
      };
    }
    function scopeValue331(scopeValue1237) {
      const scopeValue1238 = Number(scopeValue1237);
      if (!Number.isFinite(scopeValue1238)) return 16;
      return Math.min(24, Math.max(12, Math.round(scopeValue1238)));
    }
    function scopeValue332(scopeValue1239) {
      const scopeValue1240 = String(scopeValue1239 || "").trim().replace(/["']/g, "").replace(/[{}]/g, "").replace(/\s+/g, " ");
      return scopeValue1240 || "CustomThemeFont";
    }
    function scopeValue333(scopeValue1241) {
      return scopeValue332(scopeValue1241).slice(0, 60);
    }
    function scopeValue334(scopeValue1242) {
      return "\"" + scopeValue332(scopeValue1242) + "\", " + scopeValue21;
    }
    function scopeValue335(scopeValue1243) {
      const scopeValue1244 = String(scopeValue1243 || "font").replace(/[^a-z0-9_-]/gi, "_");
      return "U2ThemeFont_" + scopeValue1244 + "_" + Date.now().toString(36);
    }
    function scopeValue336(scopeValue1245) {
      const scopeValue1246 = String(scopeValue1245 || "").trim().toLowerCase().replace(/^\./, "");
      return scopeValue308.has(scopeValue1246) ? scopeValue1246 : "";
    }
    function scopeValue337(scopeValue1247) {
      const scopeValue1248 = String(scopeValue1247 || "").split("?")[0].split("#")[0].toLowerCase(),
        scopeValue1249 = scopeValue1248.match(/\.([a-z0-9]+)$/);
      return scopeValue336(scopeValue1249?.[1]);
    }
    function scopeValue338(scopeValue1250) {
      if (scopeValue1250 === "ttf") return "truetype";
      if (scopeValue1250 === "otf") return "opentype";
      return scopeValue1250;
    }
    function scopeValue339(scopeValue1251 = {}, scopeValue1252 = 0) {
      const scopeValue1253 = typeof scopeValue1251.id === "string" && scopeValue1251.id ? scopeValue1251.id : "font_preset_" + Date.now() + "_" + scopeValue1252,
        scopeValue1254 = scopeValue333(scopeValue1251.name || scopeValue1251.label || scopeValue1251.cssName || "CustomFont" + (scopeValue1252 + 1)),
        scopeValue1255 = typeof scopeValue1251.fontAssetId === "string" ? scopeValue1251.fontAssetId : "",
        scopeValue1256 = scopeValue1251.sourceType === "local" || scopeValue1255 ? "local" : "link",
        scopeValue1257 = scopeValue330(scopeValue1251.sources),
        scopeValue1258 = scopeValue1257.woff2 || scopeValue1257.woff || scopeValue1257.ttf || scopeValue1257.otf || "",
        scopeValue1259 = scopeValue336(scopeValue1251.fontFormat) || scopeValue337(scopeValue1258),
        scopeValue1260 = scopeValue332(scopeValue1251.cssName || scopeValue1254);
      return {
        id: scopeValue1253,
        type: "user",
        name: scopeValue1254,
        label: scopeValue1254,
        cssName: scopeValue1260,
        family: scopeValue334(scopeValue1260),
        sourceType: scopeValue1256,
        fontAssetId: scopeValue1255,
        fontFormat: scopeValue1259,
        sources: scopeValue1257
      };
    }
    function scopeValue340() {
      if (!scopeValue27 || typeof scopeValue27 !== "object") return;
      if (!scopeValue27.fontMode) scopeValue27.fontMode = "preset";
      if (!scopeValue27.fontPresetKey) scopeValue27.fontPresetKey = "system-default";
      if (!scopeValue27.fontFamily) scopeValue27.fontFamily = scopeValue21;
      if (typeof scopeValue27.fontCssName !== "string") scopeValue27.fontCssName = "";
      scopeValue27.fontSize = scopeValue331(scopeValue27.fontSize);
      scopeValue27.fontSources = scopeValue330(scopeValue27.fontSources);
      scopeValue27.fontSourceType = ["preset", "local", "link"].includes(scopeValue27.fontSourceType) ? scopeValue27.fontSourceType : "preset";
      scopeValue27.fontAssetId = typeof scopeValue27.fontAssetId === "string" ? scopeValue27.fontAssetId : "";
      scopeValue27.fontFormat = scopeValue336(scopeValue27.fontFormat);
      scopeValue27.savedFontPresets = Array.isArray(scopeValue27.savedFontPresets) ? scopeValue27.savedFontPresets.map((scopeValue1261, scopeValue1262) => scopeValue339(scopeValue1261, scopeValue1262)) : [];
      if (scopeValue27.fontMode === "saved" && !scopeValue27.savedFontPresets.some(scopeValue1263 => scopeValue1263.id === scopeValue27.fontPresetKey)) {
        const scopeValue1264 = scopeValue27.fontSources.woff2 || scopeValue27.fontSources.woff || scopeValue27.fontSources.ttf || scopeValue27.fontSources.otf || "";
        if (scopeValue1264) {
          const scopeValue1265 = scopeValue339({
            id: "font_preset_migrated_" + Date.now(),
            name: scopeValue27.fontCssName || "迁移字体",
            cssName: scopeValue27.fontCssName || "MigratedThemeFont",
            sourceType: "link",
            sources: scopeValue27.fontSources,
            fontFormat: scopeValue27.fontFormat
          });
          scopeValue27.savedFontPresets.push(scopeValue1265);
          scopeValue27.fontPresetKey = scopeValue1265.id;
        }
      }
      if (scopeValue27.fontMode !== "saved") {
        const scopeValue1266 = scopeValue23.find(scopeValue1267 => scopeValue1267.key === scopeValue27.fontPresetKey) || scopeValue23[0];
        scopeValue27.fontMode = "preset";
        scopeValue27.fontPresetKey = scopeValue1266.key;
        scopeValue27.fontFamily = scopeValue1266.family || scopeValue21;
        scopeValue27.fontCssName = scopeValue1266.cssName || "";
        scopeValue27.fontSources = scopeValue330(scopeValue1266.sources);
        scopeValue27.fontSourceType = "preset";
        scopeValue27.fontAssetId = "";
        scopeValue27.fontFormat = "";
      }
    }
    function scopeValue341(scopeValue1268 = scopeValue27) {
      scopeValue340();
      if (scopeValue1268.fontMode === "saved") {
        const scopeValue1270 = scopeValue1268.savedFontPresets.find(scopeValue1271 => scopeValue1271.id === scopeValue1268.fontPresetKey);
        if (scopeValue1270) return {
          ...scopeValue1270,
          type: "user"
        };
      }
      const scopeValue1269 = scopeValue23.find(scopeValue1272 => scopeValue1272.key === scopeValue1268.fontPresetKey) || scopeValue23[0];
      return {
        ...scopeValue1269,
        type: "builtin",
        sourceType: "preset",
        fontAssetId: "",
        fontFormat: ""
      };
    }
    function scopeValue342(scopeValue1273) {
      scopeValue1273.type === "builtin" || scopeValue1273.key ? (scopeValue27.fontMode = "preset", scopeValue27.fontPresetKey = scopeValue1273.key || "system-default") : (scopeValue27.fontMode = "saved", scopeValue27.fontPresetKey = scopeValue1273.id);
      scopeValue27.fontFamily = scopeValue1273.family || scopeValue21;
      scopeValue27.fontCssName = scopeValue1273.cssName || "";
      scopeValue27.fontSources = scopeValue330(scopeValue1273.sources);
      scopeValue27.fontSourceType = scopeValue1273.sourceType || (scopeValue1273.type === "builtin" ? "preset" : "link");
      scopeValue27.fontAssetId = scopeValue1273.fontAssetId || "";
      scopeValue27.fontFormat = scopeValue336(scopeValue1273.fontFormat);
    }
    function scopeValue343() {
      let scopeValue1274 = document.getElementById("theme-font-applied-style");
      return !scopeValue1274 && (scopeValue1274 = document.createElement("style"), scopeValue1274.id = "theme-font-applied-style", document.head.appendChild(scopeValue1274)), scopeValue1274;
    }
    function scopeValue344() {
      let scopeValue1275 = document.getElementById("theme-font-scale-style");
      return !scopeValue1275 && (scopeValue1275 = document.createElement("style"), scopeValue1275.id = "theme-font-scale-style", document.head.appendChild(scopeValue1275)), scopeValue1275;
    }
    function scopeValue345(scopeValue1276) {
      return Number(scopeValue1276).toFixed(2).replace(/\.?0+$/, "");
    }
    function scopeValue346(scopeValue1277 = scopeValue27.fontSize) {
      const scopeValue1278 = scopeValue331(scopeValue1277) / scopeValue309,
        scopeValue1279 = Array.from(scopeValue316, Number).filter(Number.isFinite).sort((scopeValue1280, scopeValue1281) => scopeValue1280 - scopeValue1281).map(scopeValue1282 => {
          const scopeValue1283 = scopeValue345(scopeValue1282),
            scopeValue1284 = Math.max(1, scopeValue1282 * scopeValue1278).toFixed(3).replace(/\.?0+$/, "");
          return "[data-theme-font-base-size=\"" + scopeValue1283 + "\"] { font-size: " + scopeValue1284 + "px !important; }";
        }),
        newScope1289 = scopeValue344(),
        newScope1290 = scopeValue1279.join("\n");
      if (newScope1289.textContent !== newScope1290) newScope1289.textContent = newScope1290;
      document.documentElement.style.setProperty("--theme-font-scale", String(scopeValue1278));
    }
    function scopeValue347(scopeValue1285, {
      recapture: scopeValue1286 = false
    } = {}, newScope1298 = true) {
      const newScope1299 = new Set(),
        newScope1300 = scopeValue1288 => {
          if (!(scopeValue1288 instanceof HTMLElement) || scopeValue1288.matches(scopeValue310) || scopeValue1288.closest(scopeValue313) || !scopeValue1286 && scopeValue1288.hasAttribute("data-theme-font-base-size")) return;
          newScope1299.add(scopeValue1288);
        };
      scopeValue1285.forEach(scopeValue1290 => {
        if (!(scopeValue1290 instanceof Element)) return;
        newScope1300(scopeValue1290), newScope1298 && scopeValue1290.querySelectorAll(scopeValue1286 ? "*" : ":not([data-theme-font-base-size])").forEach(newScope1300);
      });
      if (!newScope1299.size) return false;
      const newScope1301 = window.u2Perf ? performance.now() : 0,
        scopeValue1293 = document.getElementById("theme-font-scale-style")?.["sheet"],
        scopeValue1294 = !!scopeValue1293?.["disabled"],
        newScope1304 = [];
      if (scopeValue1293) scopeValue1293.disabled = true;
      try {
        if (scopeValue1286) newScope1299.forEach(scopeValue1296 => scopeValue1296.removeAttribute("data-theme-font-base-size"));
        newScope1299.forEach(newScope1309 => {
          const newScope1310 = Number.parseFloat(window.getComputedStyle(newScope1309).fontSize);
          if (Number.isFinite(newScope1310) && newScope1310 > 0) newScope1304.push([newScope1309, scopeValue345(newScope1310)]);
        });
      } finally {
        if (scopeValue1293) scopeValue1293.disabled = scopeValue1294;
      }
      const newScope1305 = scopeValue316.size;
      newScope1304.forEach(([newScope1311, newScope1312]) => {
        newScope1311.setAttribute("data-theme-font-base-size", newScope1312), scopeValue316.add(newScope1312);
      });
      if (window.u2Perf) window.u2Perf.sample("theme-font-capture", performance.now() - newScope1301);
      return scopeValue316.size !== newScope1305;
    }
    function scopeValue349() {
      if (scopeValue329) return;
      scopeValue329 = window.requestAnimationFrame(() => {
        scopeValue329 = 0;
        scopeValue346();
      });
    }
    function scopeValue350() {
      const scopeValue1297 = document.getElementById("u2-login-screen");
      return !!scopeValue1297 && !scopeValue1297.classList.contains("is-hidden");
    }
    function scopeValue351() {
      if (!document.body) return [];
      const scopeValue1298 = document.getElementById("u2-login-screen");
      if (scopeValue350()) return scopeValue1298 ? [scopeValue1298] : [];
      const scopeValue1299 = Array.from(document.querySelectorAll(scopeValue312));
      return !document.querySelector(".app-view.active, .settings-view.active, .edit-view.active") && document.querySelectorAll(scopeValue314).forEach(scopeValue1300 => scopeValue1299.push(scopeValue1300)), Array.from(new Set(scopeValue1299));
    }
    function scopeValue352(scopeValue1301) {
      if (!(scopeValue1301 instanceof Element)) return null;
      const scopeValue1302 = document.getElementById("u2-login-screen");
      if (scopeValue350()) return scopeValue1302?.contains(scopeValue1301) ? scopeValue1302 : null;
      if (scopeValue1301.closest(scopeValue313)) return null;
      const scopeValue1303 = scopeValue1301.matches(scopeValue312) ? scopeValue1301 : scopeValue1301.closest(scopeValue312);
      if (scopeValue1303) return scopeValue1303;
      if (!document.querySelector(".app-view.active, .settings-view.active, .edit-view.active")) return scopeValue1301.matches(scopeValue314) ? scopeValue1301 : scopeValue1301.closest(scopeValue314);
      return null;
    }
    function scopeValue353(scopeValue1304) {
      if (!(scopeValue1304 instanceof Element)) return null;
      return scopeValue1304.matches(scopeValue311) ? scopeValue1304 : scopeValue1304.closest(scopeValue311);
    }
    function scopeValue354(scopeValue1305) {
      const scopeValue1306 = scopeValue353(scopeValue1305);
      if (!scopeValue1306) return;
      if (!scopeValue320.has(scopeValue1306)) scopeValue320.set(scopeValue1306, new Set());
      scopeValue320.get(scopeValue1306).add(scopeValue1305);
    }
    function scopeValue355() {
      scopeValue328 = 0;
      const scopeValue1307 = [];
      scopeValue321.forEach(scopeValue1309 => {
        if (!scopeValue1309.isConnected) return;
        if (scopeValue352(scopeValue1309)) scopeValue1307.push(scopeValue1309);else scopeValue354(scopeValue1309);
      }), scopeValue321.clear();
      const newScope1324 = new Set(scopeValue1307),
        newScope1325 = scopeValue1307.filter(newScope1328 => {
          for (let newScope1329 = newScope1328.parentElement; newScope1329; newScope1329 = newScope1329.parentElement) {
            if (newScope1324.has(newScope1329)) return false;
          }
          return true;
        }),
        scopeValue1308 = scopeValue347(newScope1325);
      scopeValue1307.forEach(newScope1330 => {
        scopeValue319.has(newScope1330) && (scopeValue319["delete"](newScope1330), scopeValue318.add(newScope1330), scopeValue320["delete"](newScope1330), newScope1330.querySelectorAll(scopeValue311).forEach(scopeValue1310 => {
          if (!scopeValue352(scopeValue1310)) return;
          scopeValue318.add(scopeValue1310);
          scopeValue320["delete"](scopeValue1310);
        }));
      });
      if (scopeValue1308) scopeValue349();
    }
    function scopeValue356(scopeValue1311, {
      fullSurface: scopeValue1312 = false
    } = {}) {
      if (!(scopeValue1311 instanceof Element)) return;
      if (!scopeValue352(scopeValue1311)) {
        scopeValue354(scopeValue1311);
        return;
      }
      if (scopeValue1312) scopeValue319.add(scopeValue1311);
      scopeValue321.add(scopeValue1311);
      if (scopeValue328) return;
      scopeValue328 = window.requestAnimationFrame(scopeValue355);
    }
    function scopeValue357(scopeValue1313) {
      if (!(scopeValue1313 instanceof Element) || !scopeValue352(scopeValue1313)) return;
      if (!scopeValue318.has(scopeValue1313)) {
        scopeValue356(scopeValue1313, {
          fullSurface: true
        });
        return;
      }
      const scopeValue1314 = scopeValue320.get(scopeValue1313);
      if (!scopeValue1314) return;
      scopeValue320["delete"](scopeValue1313);
      scopeValue1314.forEach(scopeValue1315 => scopeValue356(scopeValue1315));
    }
    function scopeValue358(scopeValue1316) {
      if (!(scopeValue1316 instanceof Element) || !scopeValue352(scopeValue1316)) return;
      if (!scopeValue318.has(scopeValue1316)) {
        scopeValue356(scopeValue1316, {
          fullSurface: true
        });
        return;
      }
      scopeValue357(scopeValue1316);
      scopeValue1316.querySelectorAll(scopeValue311).forEach(scopeValue1317 => {
        if (scopeValue352(scopeValue1317)) scopeValue357(scopeValue1317);
      });
    }
    function scopeValue359() {
      scopeValue351().forEach(scopeValue1318 => {
        scopeValue1318.matches(scopeValue311) ? scopeValue357(scopeValue1318) : scopeValue356(scopeValue1318);
      });
    }
    function scopeValue360(scopeValue1319) {
      if (!(scopeValue1319 instanceof Element) || scopeValue317.has(scopeValue1319)) return;
      scopeValue317.add(scopeValue1319);
      scopeValue327.observe(scopeValue1319, {
        attributes: true,
        attributeFilter: ["class", "hidden", "aria-hidden"]
      });
    }
    function scopeValue361(scopeValue1320) {
      if (!(scopeValue1320 instanceof Element)) return;
      if (scopeValue1320.matches(scopeValue311)) scopeValue360(scopeValue1320);
      scopeValue1320.querySelectorAll(scopeValue311).forEach(scopeValue360);
    }
    function scopeValue362() {
      if (!document.body) return;
      if (scopeValue326) return;
      const newScope1342 = scopeValue351(),
        scopeValue1321 = scopeValue347(newScope1342);
      newScope1342.forEach(scopeValue1322 => {
        if (scopeValue1322.matches(scopeValue311)) scopeValue318.add(scopeValue1322);
      });
      if (scopeValue1321) scopeValue346();
      scopeValue327 = new MutationObserver(scopeValue1323 => {
        scopeValue1323.forEach(scopeValue1324 => {
          const scopeValue1325 = scopeValue1324.target;
          if (!(scopeValue1325 instanceof Element)) return;
          if (scopeValue1325.id === "u2-login-screen") {
            scopeValue359();
            return;
          }
          scopeValue358(scopeValue1325);
        });
      });
      scopeValue361(document.body);
      scopeValue326 = new MutationObserver(scopeValue1326 => {
        scopeValue1326.forEach(scopeValue1327 => {
          scopeValue1327.addedNodes.forEach(scopeValue1328 => {
            if (!(scopeValue1328 instanceof Element)) return;
            scopeValue361(scopeValue1328);
            scopeValue1328.matches(scopeValue311) ? scopeValue357(scopeValue1328) : scopeValue356(scopeValue1328);
          });
        });
      });
      scopeValue326.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
    function scopeValue363(scopeValue1329, scopeValue1330) {
      const scopeValue1331 = scopeValue331(scopeValue1330) + "px",
        scopeValue1332 = scopeValue343();
      scopeValue1332.textContent = (`
            :root {
                --theme-font-family: ` + scopeValue1329 + `;
                --theme-font-size: ` + scopeValue1331 + `;
            }
            body {
                font-family: var(--theme-font-family) !important;
            }
            body :where(*:not(i):not(.fa):not(.fas):not(.far):not(.fab):not(.fal):not(.fa-solid):not(.fa-regular):not(.fa-brands)) {
                font-family: var(--theme-font-family) !important;
            }
            body :where(i, .fa, .fas, .far, .fab, .fal, .fa-solid, .fa-regular, .fa-brands),
            body :where(i, .fa, .fas, .far, .fab, .fal, .fa-solid, .fa-regular, .fa-brands)::before {
                font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands" !important;
            }
            body :where(#theme-bubble-css-input, #theme-chat-css-input, #theme-group-css-input, #theme-status-template-prompt, #theme-status-template-regex, #theme-status-template-html, #bubble-css-input, #status-css-input, textarea[placeholder*="CSS"], textarea[placeholder*="css"]) {
                font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace !important;
                font-size: 13px !important;
            }`).trim();
      document.documentElement.style.setProperty("--theme-font-family", scopeValue1329);
      document.documentElement.style.setProperty("--theme-font-size", scopeValue1331);
      scopeValue362();
      scopeValue346(scopeValue1330);
    }
    async function scopeValue364(scopeValue1333) {
      if (!scopeValue1333 || scopeValue1333.type === "builtin" || scopeValue1333.key) return null;
      if (scopeValue1333.sourceType === "local") {
        if (!scopeValue1333.fontAssetId || typeof window.appStorage?.getAssetUrl !== "function") throw new Error("本地字体文件不存在");
        const scopeValue1337 = await window.appStorage.getAssetUrl(scopeValue1333.fontAssetId);
        if (!scopeValue1337) throw new Error("本地字体文件已丢失");
        return {
          url: scopeValue1337,
          format: scopeValue336(scopeValue1333.fontFormat)
        };
      }
      const scopeValue1334 = scopeValue330(scopeValue1333.sources),
        scopeValue1335 = scopeValue1334.woff2 ? "woff2" : scopeValue1334.woff ? "woff" : scopeValue1334.ttf ? "ttf" : scopeValue1334.otf ? "otf" : "",
        scopeValue1336 = scopeValue1334[scopeValue1335] || "";
      if (!scopeValue1336) throw new Error("字体链接为空");
      return {
        url: scopeValue1336,
        format: scopeValue336(scopeValue1333.fontFormat) || scopeValue1335
      };
    }
    async function scopeValue365(scopeValue1338) {
      if (!scopeValue1338 || scopeValue1338.type === "builtin" || scopeValue1338.key) return scopeValue1338?.family || scopeValue21;
      if (typeof FontFace !== "function" || !document.fonts) throw new Error("当前浏览器不支持自定义字体");
      const scopeValue1339 = await scopeValue364(scopeValue1338),
        scopeValue1340 = scopeValue1338.cssName + "|" + scopeValue1339.url + "|" + scopeValue1339.format,
        scopeValue1341 = scopeValue315.get(scopeValue1340);
      if (scopeValue1341?.status === "loaded") return scopeValue1338.family;
      const scopeValue1342 = scopeValue338(scopeValue1339.format),
        scopeValue1343 = "url(" + JSON.stringify(scopeValue1339.url) + ")" + (scopeValue1342 ? " format(" + JSON.stringify(scopeValue1342) + ")" : ""),
        scopeValue1344 = new FontFace(scopeValue1338.cssName, scopeValue1343, {
          style: "normal",
          weight: "normal",
          display: "swap"
        });
      return await scopeValue1344.load(), document.fonts.add(scopeValue1344), scopeValue315.set(scopeValue1340, scopeValue1344), scopeValue1338.family;
    }
    async function scopeValue366(scopeValue1345 = scopeValue27, {
      fallbackOnError: scopeValue1346 = true
    } = {}) {
      scopeValue340();
      const scopeValue1347 = scopeValue341(scopeValue1345),
        scopeValue1348 = ++scopeValue325;
      try {
        const scopeValue1349 = await scopeValue365(scopeValue1347);
        if (scopeValue1348 !== scopeValue325) return false;
        return scopeValue363(scopeValue1349, scopeValue1345.fontSize), scopeValue367(), true;
      } catch (scopeValue1350) {
        console.warn("Failed to load theme font:", scopeValue1350);
        if (scopeValue1348 !== scopeValue325) return false;
        if (scopeValue1346) scopeValue363(scopeValue21, scopeValue1345.fontSize);
        return false;
      }
    }
    function scopeValue367() {
      scopeValue340();
      const scopeValue1351 = scopeValue341(scopeValue27),
        scopeValue1352 = scopeValue331(scopeValue27.fontSize) + "px";
      scopeValue292 && (scopeValue292.textContent = scopeValue305, scopeValue292.style.fontFamily = scopeValue1351.family || scopeValue21, scopeValue292.style.fontSize = scopeValue1352);
      if (scopeValue304) scopeValue304.textContent = scopeValue1352;
      if (scopeValue303) scopeValue303.value = String(scopeValue331(scopeValue27.fontSize));
    }
    function scopeValue368() {
      scopeValue340();
      scopeValue367();
      const scopeValue1353 = scopeValue27.fontMode === "saved" ? scopeValue27.savedFontPresets.find(scopeValue1354 => scopeValue1354.id === scopeValue27.fontPresetKey) : null;
      if (scopeValue1353?.sourceType === "link") {
        scopeValue294.value = scopeValue1353.name || "";
        scopeValue295.value = scopeValue1353.sources.woff2 || scopeValue1353.sources.woff || scopeValue1353.sources.ttf || scopeValue1353.sources.otf || "";
      } else {
        if (scopeValue294) scopeValue294.value = "";
        if (scopeValue295) scopeValue295.value = "";
      }
      if (scopeValue296) scopeValue296.value = "";
      scopeValue323 = null;
      if (scopeValue298) scopeValue298.value = "";
      scopeValue375();
    }
    function scopeValue369() {
      if (scopeValue322) clearTimeout(scopeValue322);
      scopeValue322 = setTimeout(() => {
        scopeValue322 = null;
        scopeValue381();
      }, 300);
    }
    function scopeValue370({
      label: scopeValue1355,
      family: scopeValue1356,
      isActive: scopeValue1357,
      onSelect: scopeValue1358,
      onDelete: scopeValue1359 = null
    }) {
      const scopeValue1360 = document.createElement("div");
      scopeValue1360.className = "theme-font-pill " + (scopeValue1357 ? "active" : "");
      const scopeValue1361 = document.createElement("button");
      scopeValue1361.type = "button";
      scopeValue1361.className = "theme-font-pill-select";
      scopeValue1361.textContent = scopeValue1355;
      scopeValue1361.style.fontFamily = scopeValue1356 || scopeValue21;
      scopeValue1361.addEventListener("click", () => scopeValue1358?.());
      scopeValue1360.appendChild(scopeValue1361);
      if (typeof scopeValue1359 === "function") {
        const scopeValue1362 = document.createElement("button");
        scopeValue1362.type = "button";
        scopeValue1362.className = "theme-font-pill-delete";
        scopeValue1362.setAttribute("aria-label", "删除字体 " + scopeValue1355);
        scopeValue1362.innerHTML = "<i class=\"fas fa-times\"></i>";
        scopeValue1362.addEventListener("click", () => scopeValue1359());
        scopeValue1360.appendChild(scopeValue1362);
      }
      return scopeValue1360;
    }
    async function scopeValue371(scopeValue1363, scopeValue1364 = "") {
      try {
        if (scopeValue300) scopeValue300.disabled = true;
        await scopeValue365(scopeValue1363);
        scopeValue342(scopeValue1363);
        scopeValue373();
        scopeValue367();
        await scopeValue366(scopeValue27, {
          fallbackOnError: false
        });
        await scopeValue381();
        if (scopeValue1364) showToast(scopeValue1364);
        return true;
      } catch (scopeValue1365) {
        return console.warn("Failed to activate theme font:", scopeValue1365), showToast(scopeValue1365?.message || "字体加载失败"), false;
      } finally {
        if (scopeValue300) scopeValue300.disabled = false;
      }
    }
    async function scopeValue372(scopeValue1366) {
      const scopeValue1367 = scopeValue27.fontMode === "saved" && scopeValue27.fontPresetKey === scopeValue1366.id;
      scopeValue27.savedFontPresets = scopeValue27.savedFontPresets.filter(scopeValue1368 => scopeValue1368.id !== scopeValue1366.id);
      if (scopeValue1367) scopeValue342({
        ...scopeValue23[0],
        type: "builtin"
      });
      scopeValue373();
      scopeValue367();
      if (scopeValue1367) await scopeValue366(scopeValue27);
      await scopeValue381();
      if (scopeValue1366.fontAssetId && typeof window.appStorage?.deleteAsset === "function") {
        const scopeValue1369 = scopeValue27.savedFontPresets.some(scopeValue1370 => scopeValue1370.fontAssetId === scopeValue1366.fontAssetId);
        if (!scopeValue1369) await window.appStorage.deleteAsset(scopeValue1366.fontAssetId);
      }
      showToast("已删除字体 " + scopeValue1366.label);
    }
    function scopeValue373() {
      if (!scopeValue293) return;
      scopeValue293.innerHTML = "";
      const scopeValue1371 = scopeValue23[0];
      scopeValue293.appendChild(scopeValue370({
        label: scopeValue1371.label,
        family: scopeValue1371.family,
        isActive: scopeValue27.fontMode === "preset",
        onSelect: () => scopeValue371({
          ...scopeValue1371,
          type: "builtin"
        }, "已切换到 " + scopeValue1371.label)
      }));
      scopeValue27.savedFontPresets.forEach(scopeValue1372 => {
        scopeValue293.appendChild(scopeValue370({
          label: scopeValue1372.label,
          family: scopeValue1372.family,
          isActive: scopeValue27.fontMode === "saved" && scopeValue27.fontPresetKey === scopeValue1372.id,
          onSelect: () => scopeValue371(scopeValue1372, "已切换到 " + scopeValue1372.label),
          onDelete: () => scopeValue372(scopeValue1372)
        }));
      });
    }
    function scopeValue374(scopeValue1373) {
      scopeValue324 = scopeValue1373 === "link" ? "link" : "local";
      scopeValue301.forEach(scopeValue1374 => {
        const scopeValue1375 = scopeValue1374.dataset.fontSource === scopeValue324;
        scopeValue1374.classList.toggle("active", scopeValue1375);
        scopeValue1374.setAttribute("aria-selected", String(scopeValue1375));
      });
      scopeValue302.forEach(scopeValue1376 => {
        const scopeValue1377 = scopeValue1376.dataset.fontSourcePanel === scopeValue324;
        scopeValue1376.classList.toggle("active", scopeValue1377);
        scopeValue1376.hidden = !scopeValue1377;
      });
    }
    function scopeValue375(scopeValue1378 = "") {
      if (!scopeValue299) return;
      scopeValue299.classList.remove("is-ready", "is-warning");
      if (!scopeValue323) {
        scopeValue299.textContent = scopeValue1378 || "支持 TTF、OTF、WOFF、WOFF2，单个文件不超过 20 MB";
        return;
      }
      const scopeValue1379 = (scopeValue323.size / 1048576).toFixed(1),
        scopeValue1380 = scopeValue323.size > scopeValue307;
      scopeValue299.classList.add(scopeValue1380 ? "is-warning" : "is-ready");
      scopeValue299.textContent = scopeValue1380 ? scopeValue323.name + " · " + scopeValue1379 + " MB，文件较大，建议优先使用 WOFF2" : scopeValue323.name + " · " + scopeValue1379 + " MB，已准备添加";
    }
    async function scopeValue376(scopeValue1381) {
      if (typeof window.appStorage?.blobToDataUrl === "function") return window.appStorage.blobToDataUrl(scopeValue1381);
      return new Promise((scopeValue1382, scopeValue1383) => {
        const scopeValue1384 = new FileReader();
        scopeValue1384.onload = () => scopeValue1382(String(scopeValue1384.result || ""));
        scopeValue1384.onerror = () => scopeValue1383(scopeValue1384.error || new Error("字体文件读取失败"));
        scopeValue1384.readAsDataURL(scopeValue1381);
      });
    }
    function scopeValue377(scopeValue1385, scopeValue1386) {
      const scopeValue1387 = scopeValue330();
      return scopeValue1387[scopeValue1386 || "woff2"] = scopeValue1385, scopeValue1387;
    }
    async function scopeValue378() {
      scopeValue340();
      const scopeValue1388 = scopeValue324 === "local" ? scopeValue296?.value : scopeValue294?.value,
        scopeValue1389 = scopeValue333(scopeValue1388 || "");
      if (!String(scopeValue1388 || "").trim()) {
        showToast("请填写字体名称");
        return;
      }
      const scopeValue1390 = scopeValue27.savedFontPresets.findIndex(scopeValue1396 => scopeValue1396.name === scopeValue1389),
        scopeValue1391 = scopeValue1390 >= 0 ? scopeValue27.savedFontPresets[scopeValue1390] : null,
        scopeValue1392 = scopeValue1391?.id || "font_preset_" + Date.now(),
        scopeValue1393 = scopeValue335(scopeValue1392);
      let scopeValue1394 = null,
        scopeValue1395 = "";
      try {
        if (scopeValue300) scopeValue300.disabled = true;
        if (scopeValue324 === "local") {
          const scopeValue1397 = scopeValue323,
            scopeValue1398 = scopeValue337(scopeValue1397?.name || "");
          if (!scopeValue1397 || !scopeValue1398) throw new Error("请选择支持的字体文件");
          if (scopeValue1397.size <= 0) throw new Error("字体文件为空");
          if (scopeValue1397.size > scopeValue306) throw new Error("字体文件不能超过 20 MB");
          if (typeof window.appStorage?.saveAssetFromDataUrl !== "function") throw new Error("字体存储服务不可用");
          const scopeValue1399 = await scopeValue376(scopeValue1397);
          scopeValue1395 = "theme_font_" + scopeValue1392 + "_" + Date.now();
          await window.appStorage.saveAssetFromDataUrl(scopeValue1395, scopeValue1399, {
            kind: "theme-font",
            fileName: scopeValue1397.name,
            fontFormat: scopeValue1398
          });
          scopeValue1394 = scopeValue339({
            id: scopeValue1392,
            name: scopeValue1389,
            cssName: scopeValue1393,
            sourceType: "local",
            fontAssetId: scopeValue1395,
            fontFormat: scopeValue1398,
            sources: {}
          });
        } else {
          const scopeValue1400 = String(scopeValue295?.value || "").trim();
          let scopeValue1401;
          try {
            scopeValue1401 = new URL(scopeValue1400);
          } catch (scopeValue1403) {
            throw new Error("请输入完整的字体链接");
          }
          if (!["http:", "https:"].includes(scopeValue1401.protocol)) throw new Error("字体链接仅支持 HTTP 或 HTTPS");
          const scopeValue1402 = scopeValue337(scopeValue1401.pathname) || "woff2";
          scopeValue1394 = scopeValue339({
            id: scopeValue1392,
            name: scopeValue1389,
            cssName: scopeValue1393,
            sourceType: "link",
            fontFormat: scopeValue1402,
            sources: scopeValue377(scopeValue1400, scopeValue1402)
          });
        }
        await scopeValue365(scopeValue1394);
        if (scopeValue1390 >= 0) scopeValue27.savedFontPresets[scopeValue1390] = scopeValue1394;else scopeValue27.savedFontPresets.push(scopeValue1394);
        scopeValue342(scopeValue1394);
        scopeValue373();
        scopeValue367();
        await scopeValue366(scopeValue27, {
          fallbackOnError: false
        });
        await scopeValue381();
        scopeValue1391?.fontAssetId && scopeValue1391.fontAssetId !== scopeValue1395 && typeof window.appStorage?.deleteAsset === "function" && (await window.appStorage.deleteAsset(scopeValue1391.fontAssetId));
        scopeValue368();
        showToast(scopeValue1390 >= 0 ? "字体已更新并应用" : "字体已添加并应用");
      } catch (scopeValue1404) {
        console.warn("Failed to add theme font:", scopeValue1404);
        scopeValue1395 && typeof window.appStorage?.deleteAsset === "function" && (await window.appStorage.deleteAsset(scopeValue1395)["catch"](() => undefined));
        showToast(scopeValue1404?.message || "字体添加失败");
      } finally {
        if (scopeValue300) scopeValue300.disabled = false;
      }
    }
    function scopeValue379() {
      if (!scopeValue290) return;
      scopeValue368();
      scopeValue373();
      scopeValue374("local");
      scopeValue290.classList.add("active");
      scopeValue290.setAttribute("aria-hidden", "false");
    }
    function scopeValue380() {
      if (!scopeValue290) return;
      scopeValue290.classList.remove("active");
      scopeValue290.setAttribute("aria-hidden", "true");
    }
    scopeValue289?.addEventListener("click", scopeValue1405 => {
      scopeValue1405.stopPropagation();
      scopeValue379();
    });
    scopeValue291?.addEventListener("click", scopeValue380);
    scopeValue290?.addEventListener("click", scopeValue1406 => {
      if (scopeValue1406.target === scopeValue290) scopeValue380();
    });
    document.addEventListener("keydown", scopeValue1407 => {
      if (scopeValue1407.key === "Escape" && scopeValue290?.classList.contains("active")) scopeValue380();
    });
    scopeValue301.forEach(scopeValue1408 => scopeValue1408.addEventListener("click", () => scopeValue374(scopeValue1408.dataset.fontSource)));
    scopeValue297?.addEventListener("click", () => scopeValue298?.click());
    scopeValue298?.addEventListener("change", () => {
      const scopeValue1409 = scopeValue298.files?.[0] || null,
        scopeValue1410 = scopeValue337(scopeValue1409?.name || "");
      if (!scopeValue1409 || !scopeValue1410) {
        scopeValue323 = null;
        scopeValue375(scopeValue1409 ? "不支持该字体格式" : "");
        if (scopeValue1409) showToast("仅支持 TTF、OTF、WOFF、WOFF2");
        return;
      }
      if (scopeValue1409.size > scopeValue306) {
        scopeValue323 = null;
        scopeValue298.value = "";
        scopeValue375("字体文件不能超过 20 MB");
        showToast("字体文件不能超过 20 MB");
        return;
      }
      scopeValue323 = scopeValue1409;
      scopeValue296 && !scopeValue296.value.trim() && (scopeValue296.value = scopeValue1409.name.replace(/\.[^.]+$/, ""));
      scopeValue375();
    });
    scopeValue300?.addEventListener("click", scopeValue378);
    scopeValue303 && (scopeValue303.addEventListener("input", scopeValue1411 => {
      scopeValue27.fontSize = scopeValue331(scopeValue1411.target.value);
      scopeValue367();
      const scopeValue1412 = document.documentElement.style.getPropertyValue("--theme-font-family") || scopeValue341(scopeValue27).family;
      scopeValue363(scopeValue1412, scopeValue27.fontSize);
      scopeValue369();
    }), scopeValue303.addEventListener("change", () => {
      scopeValue322 && (clearTimeout(scopeValue322), scopeValue322 = null);
      scopeValue381();
      showToast("字体大小已调整为 " + scopeValue27.fontSize + "px");
    }));
    scopeValue28 = true;
    await scopeValue84();
    document.dispatchEvent(new CustomEvent("u2-theme-state-ready"));
    function scopeValue381() {
      return scopeValue9();
    }
    function scopeValue382(scopeValue1413) {
      if (window.u2Api?.normalizeVectorMemoryConfig) return window.u2Api.normalizeVectorMemoryConfig(scopeValue1413);
      const scopeValue1414 = scopeValue1413 && typeof scopeValue1413 === "object" ? scopeValue1413 : {};
      return {
        enabled: scopeValue1414.enabled === true,
        provider: String(scopeValue1414.provider || "siliconflow").trim(),
        endpoint: String(scopeValue1414.endpoint || "").trim(),
        apiKey: String(scopeValue1414.apiKey || "").trim(),
        model: String(scopeValue1414.model || "").trim()
      };
    }
    function scopeValue383() {
      return window.u2Api?.VECTOR_MEMORY_PROVIDERS || window.imVectorMemory?.PROVIDERS || {};
    }
    function scopeValue384(scopeValue1415) {
      const scopeValue1416 = scopeValue383();
      return scopeValue1416[scopeValue1415] || scopeValue1416.siliconflow || {
        defaultModel: "",
        models: []
      };
    }
    function scopeValue385() {
      const scopeValue1417 = String(UI.inputs.vectorMemoryModel?.value || "").trim();
      return scopeValue1417 === "__custom__" ? String(UI.inputs.vectorMemoryCustomModel?.value || "").trim() : scopeValue1417;
    }
    function scopeValue386() {
      return scopeValue382({
        enabled: !!UI.inputs.vectorMemoryEnabled?.checked,
        provider: String(UI.inputs.vectorMemoryProvider?.value || "siliconflow").trim(),
        endpoint: String(UI.inputs.vectorMemoryEndpoint?.value || "").trim(),
        apiKey: String(UI.inputs.vectorMemoryApiKey?.value || "").trim(),
        model: scopeValue385()
      });
    }
    function scopeValue387(scopeValue1418 = scopeValue12, scopeValue1419 = "") {
      const scopeValue1420 = UI.inputs.vectorMemoryModel;
      if (!scopeValue1420) return;
      const scopeValue1421 = String(scopeValue1418?.provider || UI.inputs.vectorMemoryProvider?.value || "siliconflow"),
        scopeValue1422 = scopeValue384(scopeValue1421),
        scopeValue1423 = String(scopeValue1419 || scopeValue1418?.model || scopeValue1422.defaultModel || "").trim(),
        scopeValue1424 = Array.isArray(scopeValue1422.models) ? scopeValue1422.models.map(String).filter(Boolean) : [];
      scopeValue1420.replaceChildren();
      scopeValue1424.forEach(scopeValue1427 => {
        const scopeValue1428 = document.createElement("option");
        scopeValue1428.value = scopeValue1427;
        scopeValue1428.textContent = scopeValue1427;
        scopeValue1420.append(scopeValue1428);
      });
      const scopeValue1425 = document.createElement("option");
      scopeValue1425.value = "__custom__";
      scopeValue1425.textContent = "自定义模型";
      scopeValue1420.append(scopeValue1425);
      const scopeValue1426 = !scopeValue1424.includes(scopeValue1423);
      scopeValue1420.value = scopeValue1426 ? "__custom__" : scopeValue1423;
      UI.inputs.vectorMemoryCustomModel && (UI.inputs.vectorMemoryCustomModel.value = scopeValue1426 ? scopeValue1423 : "");
      UI.inputs.vectorMemoryCustomModelRow && (UI.inputs.vectorMemoryCustomModelRow.hidden = !scopeValue1426);
    }
    function scopeValue388() {
      const scopeValue1429 = scopeValue382(scopeValue12);
      if (UI.inputs.vectorMemoryEnabled) UI.inputs.vectorMemoryEnabled.checked = scopeValue1429.enabled;
      if (UI.inputs.vectorMemoryProvider) UI.inputs.vectorMemoryProvider.value = scopeValue1429.provider;
      if (UI.inputs.vectorMemoryEndpoint) UI.inputs.vectorMemoryEndpoint.value = scopeValue1429.endpoint;
      if (UI.inputs.vectorMemoryApiKey) UI.inputs.vectorMemoryApiKey.value = scopeValue1429.apiKey;
      UI.inputs.vectorMemoryCustomEndpointRow && (UI.inputs.vectorMemoryCustomEndpointRow.hidden = scopeValue1429.provider !== "openai-compatible");
      scopeValue387(scopeValue1429);
      scopeValue389();
    }
    function scopeValue389() {
      const scopeValue1430 = document.getElementById("vector-memory-config-status"),
        scopeValue1431 = scopeValue382(scopeValue12);
      scopeValue1430 && (scopeValue1430.textContent = scopeValue1431.enabled ? scopeValue1431.apiKey && scopeValue1431.model && (scopeValue1431.provider !== "openai-compatible" || scopeValue1431.endpoint) ? "已启用" : "待配置" : "Close");
      const scopeValue1432 = window.imVectorMemory?.getStatus?.();
      UI.inputs.vectorMemoryIndexStatus && (UI.inputs.vectorMemoryIndexStatus.textContent = scopeValue1432?.message || (scopeValue1431.enabled ? "保存后将自动同步全部记忆" : "未启用"));
    }
    scopeValue389();
    function scopeValue390() {
      if (window.u2BackgroundActivity && typeof window.u2BackgroundActivity.getSettings === "function") return window.u2BackgroundActivity.getSettings();
      return {
        enabled: false,
        intervalSeconds: 60
      };
    }
    function scopeValue391() {
      const scopeValue1433 = scopeValue390();
      UI.inputs.bgActivityToggle && (UI.inputs.bgActivityToggle.checked = !!scopeValue1433.enabled);
    }
    function scopeValue392(scopeValue1434 = false) {
      const scopeValue1435 = scopeValue390(),
        scopeValue1436 = scopeValue1435.intervalSeconds || 60,
        scopeValue1437 = !!UI.inputs.bgActivityToggle?.checked;
      if (window.u2BackgroundActivity && typeof window.u2BackgroundActivity.updateSettings === "function") window.u2BackgroundActivity.updateSettings({
        enabled: scopeValue1437,
        intervalSeconds: scopeValue1436
      });else window.StorageManager && typeof window.StorageManager.save === "function" && window.StorageManager.save("u2_backgroundActivitySettings", {
        enabled: scopeValue1437,
        intervalSeconds: scopeValue1436,
        lastTickAt: 0
      });
      scopeValue1434 && typeof showToast === "function" && showToast(scopeValue1437 ? "后台保活已开启" : "后台保活已关闭");
    }
    UI.inputs.bgActivityToggle && (UI.inputs.bgActivityToggle.addEventListener("change", () => {
      scopeValue392(true);
    }), window.addEventListener("u2:background-activity-settings-changed", scopeValue391));
    const scopeValue393 = 5242880;
    function scopeValue394() {
      if (!UI.inputs.systemNotificationToggle) return;
      const scopeValue1438 = window.u2SystemNotifications?.getSettings ? window.u2SystemNotifications.getSettings() : {
          enabled: false,
          hasCustomSound: false
        },
        scopeValue1439 = !!scopeValue1438.enabled,
        scopeValue1440 = !!scopeValue1438.hasCustomSound;
      UI.inputs.systemNotificationToggle.checked = scopeValue1439;
      UI.inputs.notificationSettingsGroup?.classList.toggle("is-sound-expanded", scopeValue1439);
      UI.inputs.notificationSoundSettings?.classList.toggle("is-visible", scopeValue1439);
      UI.inputs.notificationSoundSettings?.setAttribute("aria-hidden", String(!scopeValue1439));
      UI.inputs.notificationSoundActions?.classList.toggle("is-visible", scopeValue1440);
      UI.inputs.notificationSoundActions?.setAttribute("aria-hidden", String(!scopeValue1440));
      UI.inputs.notificationSoundFileName && (UI.inputs.notificationSoundFileName.textContent = scopeValue1440 ? (scopeValue1438.soundFileName || "自定义提示音") + " · 已保存，可试听" : "默认使用系统提示音");
      UI.inputs.notificationSoundUploadLabel && (UI.inputs.notificationSoundUploadLabel.textContent = scopeValue1440 ? "更换" : "上传音频");
    }
    async function scopeValue395(scopeValue1441 = false) {
      if (!UI.inputs.systemNotificationToggle) return;
      const scopeValue1442 = !!UI.inputs.systemNotificationToggle.checked;
      if (window.u2SystemNotifications?.updateSettings) {
        const scopeValue1443 = await window.u2SystemNotifications.updateSettings({
          enabled: scopeValue1442
        });
        UI.inputs.systemNotificationToggle.checked = !!scopeValue1443.enabled;
        if (scopeValue1441 && typeof showToast === "function") {
          if (scopeValue1443.unsupported) showToast("当前浏览器不支持系统通知");else {
            if (scopeValue1442 && !scopeValue1443.enabled && window.u2NativeBridge?.isNativeAndroid?.()) showToast("通知权限未开启，请到安卓系统设置 → 应用 → u2phone → 通知中允许");else if (scopeValue1442 && !scopeValue1443.enabled && window.u2NativeBridge?.isNativeIOS?.()) showToast("通知权限未开启，请到 iPhone 设置 → 通知 → u2phone 中允许通知");else scopeValue1443.permission === "denied" ? showToast("系统通知权限被拒绝，请在浏览器设置中开启") : showToast(scopeValue1443.enabled ? "消息通知已开启" : "消息通知已关闭");
          }
        }
        return;
      }
      UI.inputs.systemNotificationToggle.checked = false;
      scopeValue1441 && typeof showToast === "function" && showToast("消息通知模块未加载");
    }
    UI.inputs.systemNotificationToggle && (UI.inputs.systemNotificationToggle.addEventListener("change", async () => {
      UI.inputs.systemNotificationToggle.disabled = true;
      try {
        await scopeValue395(true);
      } catch (scopeValue1444) {
        console.warn("[settings] Failed to update notification setting:", scopeValue1444);
        showToast("消息通知设置失败，请重试");
      } finally {
        UI.inputs.systemNotificationToggle.disabled = false;
        scopeValue394();
      }
    }), window.addEventListener("u2:system-notification-settings-changed", scopeValue394));
    function scopeValue396(scopeValue1445) {
      return new Promise((scopeValue1446, scopeValue1447) => {
        const scopeValue1448 = new FileReader();
        scopeValue1448.onload = () => scopeValue1446(String(scopeValue1448.result || ""));
        scopeValue1448.onerror = () => scopeValue1447(scopeValue1448.error || new Error("音频读取失败"));
        scopeValue1448.readAsDataURL(scopeValue1445);
      });
    }
    UI.inputs.notificationSoundUploadBtn && UI.inputs.notificationSoundFileInput && (UI.inputs.notificationSoundUploadBtn.addEventListener("click", () => {
      UI.inputs.notificationSoundFileInput.click();
    }), UI.inputs.notificationSoundFileInput.addEventListener("change", async scopeValue1449 => {
      const scopeValue1450 = scopeValue1449.target.files?.[0];
      if (!scopeValue1450) return;
      try {
        if (scopeValue1450.type && !scopeValue1450.type.startsWith("audio/")) {
          showToast("请选择音频文件");
          return;
        }
        if (scopeValue1450.size > scopeValue393) {
          showToast("提示音不能超过 5 MB");
          return;
        }
        if (!window.u2SystemNotifications?.setCustomSound) {
          showToast("消息通知模块未加载");
          return;
        }
        UI.inputs.notificationSoundUploadBtn.disabled = true;
        const scopeValue1451 = await scopeValue396(scopeValue1450);
        await window.u2SystemNotifications.setCustomSound({
          dataUrl: scopeValue1451,
          fileName: scopeValue1450.name,
          mimeType: scopeValue1450.type || "application/octet-stream"
        });
        scopeValue394();
        showToast("消息提示音已更新");
      } catch (scopeValue1452) {
        console.error("[settings] Failed to save notification sound:", scopeValue1452);
        showToast(scopeValue1452?.name === "QuotaExceededError" ? "存储空间不足，无法保存提示音" : "提示音保存失败");
      } finally {
        UI.inputs.notificationSoundUploadBtn.disabled = false;
        scopeValue1449.target.value = "";
      }
    }));
    UI.inputs.notificationSoundPreviewBtn && UI.inputs.notificationSoundPreviewBtn.addEventListener("click", async () => {
      const scopeValue1453 = await window.u2SystemNotifications?.playNotificationSound?.();
      if (!scopeValue1453) showToast("提示音暂时无法播放");
    });
    UI.inputs.notificationSoundRemoveBtn && UI.inputs.notificationSoundRemoveBtn.addEventListener("click", async () => {
      if (!window.u2SystemNotifications?.clearCustomSound) return;
      UI.inputs.notificationSoundRemoveBtn.disabled = true;
      try {
        await window.u2SystemNotifications.clearCustomSound();
        scopeValue394();
        showToast("已恢复系统提示音");
      } catch (scopeValue1454) {
        console.error("[settings] Failed to remove notification sound:", scopeValue1454);
        showToast("提示音移除失败");
      } finally {
        UI.inputs.notificationSoundRemoveBtn.disabled = false;
      }
    });
    const scopeValue397 = document.getElementById("assistive-ball-config-btn");
    let scopeValue398 = null,
      scopeValue399 = null,
      scopeValue400 = null,
      scopeValue401 = null,
      scopeValue402 = null,
      scopeValue403 = null,
      scopeValue404 = null;
    function scopeValue405() {
      if (!Array.isArray(scopeValue16)) return "";
      const scopeValue1455 = scopeValue16.find(scopeValue1456 => (scopeValue1456.provider || "openai-compatible") === (scopeValue11.provider || "openai-compatible") && (scopeValue1456.endpoint || "") === (scopeValue11.endpoint || "") && (scopeValue1456.apiKey || "") === (scopeValue11.apiKey || "") && (scopeValue1456.model || "") === (scopeValue11.model || "") && String(scopeValue1456.temperature ?? scopeValue1456.temp ?? 0.7) === String(scopeValue11.temperature ?? 0.7) && String(scopeValue1456.frequencyPenalty ?? 0) === String(scopeValue11.frequencyPenalty ?? 0) && window.u2Api.normalizeMaxTokens(scopeValue1456.maxTokens) === window.u2Api.normalizeMaxTokens(scopeValue11.maxTokens) && scopeValue1456.streamEnabled === true === (scopeValue11.streamEnabled === true));
      return scopeValue1455 ? String(scopeValue1455.id) : "";
    }
    function scopeValue406(scopeValue1457, scopeValue1458 = "未设置") {
      const scopeValue1459 = String(scopeValue1457 || "").trim();
      return scopeValue1459 || scopeValue1458;
    }
    function scopeValue407(scopeValue1460) {
      const scopeValue1461 = String(scopeValue1460 || "").trim();
      if (!scopeValue1461) return "未设置";
      if (scopeValue1461.length <= 8) return "已填写";
      return scopeValue1461.slice(0, 4) + "..." + scopeValue1461.slice(-4);
    }
    function scopeValue408(scopeValue1462) {
      const scopeValue1463 = parseFloat(scopeValue1462);
      if (!Number.isFinite(scopeValue1463)) return 0.72;
      return Math.max(0.2, Math.min(1, scopeValue1463 > 1 ? scopeValue1463 / 100 : scopeValue1463));
    }
    function scopeValue409(scopeValue1464) {
      const scopeValue1465 = parseFloat(scopeValue1464);
      if (!Number.isFinite(scopeValue1465)) return 58;
      return Math.round(Math.max(36, Math.min(96, scopeValue1465)) / 2) * 2;
    }
    function scopeValue410(scopeValue1466) {
      const scopeValue1467 = typeof scopeValue1466 === "string" ? scopeValue1466.trim() : "";
      if (!scopeValue1467) return "";
      if (/^data:image\/png;base64,/i.test(scopeValue1467)) return scopeValue1467;
      try {
        const scopeValue1468 = new URL(scopeValue1467);
        return scopeValue1468.protocol === "http:" || scopeValue1468.protocol === "https:" ? scopeValue1467 : "";
      } catch (scopeValue1469) {
        return "";
      }
    }
    function scopeValue411(scopeValue1470) {
      return new Promise((scopeValue1471, scopeValue1472) => {
        const scopeValue1473 = new Image();
        scopeValue1473.onload = () => scopeValue1471(scopeValue1470);
        scopeValue1473.onerror = () => scopeValue1472(new Error("Failed to load assistive ball image"));
        scopeValue1473.src = scopeValue1470;
      });
    }
    function scopeValue412() {
      if (!scopeValue398) return;
      const scopeValue1474 = scopeValue398.querySelector(".assistive-api-ball-inner");
      scopeValue398.classList.remove("has-custom-image");
      if (scopeValue1474) scopeValue1474.innerHTML = "<i class=\"fas fa-circle-dot\"></i>";
    }
    function scopeValue413() {
      if (!scopeValue398) return;
      const scopeValue1475 = scopeValue398.querySelector(".assistive-api-ball-inner"),
        scopeValue1476 = scopeValue410(scopeValue19.imageUrl);
      if (!scopeValue1475 || !scopeValue1476) {
        scopeValue412();
        return;
      }
      scopeValue398.classList.add("has-custom-image");
      scopeValue1475.innerHTML = "";
      const scopeValue1477 = document.createElement("img");
      scopeValue1477.className = "assistive-api-ball-image";
      scopeValue1477.alt = "";
      scopeValue1477.draggable = false;
      scopeValue1477.addEventListener("error", () => {
        scopeValue410(scopeValue19.imageUrl) === scopeValue1476 && scopeValue412();
      }, {
        once: true
      });
      scopeValue1477.src = scopeValue1476;
      scopeValue1475.appendChild(scopeValue1477);
    }
    function scopeValue414() {
      UI.inputs.assistiveBallImageUrl && (UI.inputs.assistiveBallImageUrl.value = scopeValue410(scopeValue19.imageUrl));
    }
    async function scopeValue415(scopeValue1478, scopeValue1479) {
      const scopeValue1480 = scopeValue410(scopeValue1478);
      if (!scopeValue1480) return showToast("请输入有效的 http(s) 图片链接"), false;
      try {
        await scopeValue411(scopeValue1480);
      } catch (scopeValue1481) {
        return showToast("图片加载失败，请检查链接或图片文件"), false;
      }
      return scopeValue19.imageUrl = scopeValue1480, scopeValue418(), scopeValue413(), scopeValue414(), await scopeValue381(), showToast(scopeValue1479), true;
    }
    function scopeValue416() {
      scopeValue19.opacity = scopeValue408(scopeValue19.opacity);
      const scopeValue1482 = Math.round(scopeValue19.opacity * 100);
      UI.inputs.assistiveBallOpacity && (UI.inputs.assistiveBallOpacity.value = String(scopeValue1482));
      UI.inputs.assistiveBallOpacityValue && (UI.inputs.assistiveBallOpacityValue.textContent = scopeValue1482 + "%");
      scopeValue398 && scopeValue398.style.setProperty("--assistive-ball-opacity", scopeValue19.opacity.toFixed(2));
    }
    function scopeValue417() {
      scopeValue19.size = scopeValue409(scopeValue19.size);
      UI.inputs.assistiveBallSize && (UI.inputs.assistiveBallSize.value = String(scopeValue19.size));
      UI.inputs.assistiveBallSizeValue && (UI.inputs.assistiveBallSizeValue.textContent = scopeValue19.size + "px");
      scopeValue398 && scopeValue398.style.setProperty("--assistive-ball-size", scopeValue19.size + "px");
    }
    function scopeValue418() {
      const scopeValue1483 = document.getElementById("app") || document.body;
      !scopeValue398 && (scopeValue398 = document.createElement("div"), scopeValue398.id = "global-assistive-api-ball", scopeValue398.className = "assistive-api-ball", scopeValue398.setAttribute("role", "button"), scopeValue398.setAttribute("aria-label", "API 悬浮球"), scopeValue398.innerHTML = "<div class=\"assistive-api-ball-inner\"><i class=\"fas fa-circle-dot\"></i></div>", scopeValue1483.appendChild(scopeValue398), scopeValue398.addEventListener("click", scopeValue1484 => {
        scopeValue1484.stopPropagation();
        if (scopeValue398.dataset.dragged === "true") {
          scopeValue398.dataset.dragged = "false";
          return;
        }
        scopeValue419();
      }), scopeValue398.addEventListener("pointerdown", scopeValue423), scopeValue416(), scopeValue417(), scopeValue413());
      !scopeValue399 && (scopeValue399 = document.createElement("div"), scopeValue399.id = "global-assistive-api-panel", scopeValue399.className = "assistive-api-panel", scopeValue399.innerHTML = `
                    <div class="assistive-api-panel-title">当前 API</div>
                    <div class="assistive-api-row">
                        <span>模型</span>
                        <strong id="assistive-api-model">未设置</strong>
                    </div>
                    <label class="assistive-api-select-wrap">
                        <span>API 预设</span>
                        <select id="assistive-api-preset-select"></select>
                        <i class="fas fa-chevron-down"></i>
                    </label>
                `, scopeValue1483.appendChild(scopeValue399), scopeValue400 = scopeValue399.querySelector("#assistive-api-preset-select"), scopeValue399.addEventListener("click", scopeValue1485 => {
        scopeValue1485.stopPropagation();
        scopeValue1485.target === scopeValue399 && scopeValue420();
      }), scopeValue400?.addEventListener("change", scopeValue1486 => {
        scopeValue429(scopeValue1486.target.value);
      }));
    }
    function scopeValue419() {
      scopeValue418();
      scopeValue427();
      scopeValue398.classList.remove("visible");
      scopeValue398.classList.add("panel-open");
      scopeValue399.classList.add("active");
    }
    function scopeValue420() {
      if (scopeValue399) scopeValue399.classList.remove("active");
      scopeValue398 && (scopeValue398.classList.remove("panel-open"), scopeValue398.classList.toggle("visible", scopeValue19.enabled));
    }
    function scopeValue421(scopeValue1487, scopeValue1488, scopeValue1489 = null) {
      if (!scopeValue398) return {
        x: 0,
        y: 0
      };
      let scopeValue1490 = scopeValue1489;
      if (!scopeValue1490) {
        const scopeValue1492 = scopeValue398.parentElement || document.body,
          scopeValue1493 = scopeValue1492.getBoundingClientRect(),
          scopeValue1494 = scopeValue398.getBoundingClientRect();
        scopeValue1490 = {
          parentWidth: scopeValue1493.width,
          parentHeight: scopeValue1493.height,
          ballWidth: scopeValue1494.width || 58,
          ballHeight: scopeValue1494.height || 58
        };
      }
      const scopeValue1491 = 8;
      return {
        x: Math.max(scopeValue1491, Math.min(scopeValue1487, scopeValue1490.parentWidth - scopeValue1490.ballWidth - scopeValue1491)),
        y: Math.max(scopeValue1491, Math.min(scopeValue1488, scopeValue1490.parentHeight - scopeValue1490.ballHeight - scopeValue1491))
      };
    }
    function scopeValue422() {
      if (!scopeValue398) return;
      const scopeValue1495 = scopeValue398.parentElement || document.body,
        scopeValue1496 = scopeValue1495.getBoundingClientRect(),
        scopeValue1497 = scopeValue398.getBoundingClientRect(),
        scopeValue1498 = scopeValue1496.width - (scopeValue1497.width || 58) - 12,
        scopeValue1499 = scopeValue1496.height * 0.46,
        scopeValue1500 = scopeValue421(Number.isFinite(scopeValue19.x) ? scopeValue19.x : scopeValue1498, Number.isFinite(scopeValue19.y) ? scopeValue19.y : scopeValue1499, {
          parentWidth: scopeValue1496.width,
          parentHeight: scopeValue1496.height,
          ballWidth: scopeValue1497.width || 58,
          ballHeight: scopeValue1497.height || 58
        });
      scopeValue19.x = scopeValue1500.x;
      scopeValue19.y = scopeValue1500.y;
      scopeValue398.style.left = scopeValue1500.x + "px";
      scopeValue398.style.top = scopeValue1500.y + "px";
    }
    function scopeValue423(scopeValue1501) {
      if (!scopeValue398) return;
      scopeValue403 !== null && (cancelAnimationFrame(scopeValue403), scopeValue403 = null);
      const scopeValue1502 = scopeValue398.parentElement || document.body,
        scopeValue1503 = scopeValue1502.getBoundingClientRect(),
        scopeValue1504 = scopeValue398.getBoundingClientRect();
      scopeValue401 = {
        pointerId: scopeValue1501.pointerId,
        startClientX: scopeValue1501.clientX,
        startClientY: scopeValue1501.clientY,
        offsetX: scopeValue1501.clientX - scopeValue1504.left,
        offsetY: scopeValue1501.clientY - scopeValue1504.top,
        parentLeft: scopeValue1503.left,
        parentTop: scopeValue1503.top,
        parentWidth: scopeValue1503.width,
        parentHeight: scopeValue1503.height,
        ballWidth: scopeValue1504.width || scopeValue19.size || 58,
        ballHeight: scopeValue1504.height || scopeValue19.size || 58,
        originX: scopeValue1504.left - scopeValue1503.left,
        originY: scopeValue1504.top - scopeValue1503.top,
        nextX: scopeValue1504.left - scopeValue1503.left,
        nextY: scopeValue1504.top - scopeValue1503.top,
        latestClientX: scopeValue1501.clientX,
        latestClientY: scopeValue1501.clientY,
        moved: false
      };
      scopeValue398.classList.add("dragging");
      scopeValue398.style.transform = "translate3d(0, 0, 0) scale(0.96)";
      scopeValue398.setPointerCapture?.(scopeValue1501.pointerId);
      scopeValue398.addEventListener("pointermove", scopeValue424);
      scopeValue398.addEventListener("pointerup", scopeValue426);
      scopeValue398.addEventListener("pointercancel", scopeValue426);
    }
    function scopeValue424(scopeValue1505) {
      if (!scopeValue401 || !scopeValue398 || scopeValue1505.pointerId !== scopeValue401.pointerId) return;
      scopeValue1505.preventDefault();
      scopeValue401.latestClientX = scopeValue1505.clientX;
      scopeValue401.latestClientY = scopeValue1505.clientY;
      const scopeValue1506 = scopeValue1505.clientX - scopeValue401.startClientX,
        scopeValue1507 = scopeValue1505.clientY - scopeValue401.startClientY;
      !scopeValue401.moved && Math.abs(scopeValue1506) + Math.abs(scopeValue1507) > 4 && (scopeValue401.moved = true, scopeValue420());
      scopeValue402 === null && (scopeValue402 = requestAnimationFrame(scopeValue425));
    }
    function scopeValue425() {
      scopeValue402 = null;
      if (!scopeValue401 || !scopeValue398) return;
      const scopeValue1508 = 8,
        scopeValue1509 = scopeValue401.latestClientX - scopeValue401.parentLeft - scopeValue401.offsetX,
        scopeValue1510 = scopeValue401.latestClientY - scopeValue401.parentTop - scopeValue401.offsetY,
        scopeValue1511 = Math.max(scopeValue1508, Math.min(scopeValue1509, scopeValue401.parentWidth - scopeValue401.ballWidth - scopeValue1508)),
        scopeValue1512 = Math.max(scopeValue1508, Math.min(scopeValue1510, scopeValue401.parentHeight - scopeValue401.ballHeight - scopeValue1508));
      scopeValue401.nextX = scopeValue1511;
      scopeValue401.nextY = scopeValue1512;
      const scopeValue1513 = scopeValue1511 - scopeValue401.originX,
        scopeValue1514 = scopeValue1512 - scopeValue401.originY;
      scopeValue398.style.transform = "translate3d(" + scopeValue1513 + "px, " + scopeValue1514 + "px, 0) scale(0.96)";
    }
    function scopeValue426(scopeValue1515) {
      if (!scopeValue398) return;
      const scopeValue1516 = !!scopeValue401?.moved;
      scopeValue402 !== null && (cancelAnimationFrame(scopeValue402), scopeValue402 = null, scopeValue425());
      const scopeValue1517 = scopeValue401?.nextX,
        scopeValue1518 = scopeValue401?.nextY;
      scopeValue398.releasePointerCapture?.(scopeValue1515.pointerId);
      scopeValue398.removeEventListener("pointermove", scopeValue424);
      scopeValue398.removeEventListener("pointerup", scopeValue426);
      scopeValue398.removeEventListener("pointercancel", scopeValue426);
      scopeValue401 = null;
      if (scopeValue1516) {
        scopeValue19.x = scopeValue1517;
        scopeValue19.y = scopeValue1518;
        scopeValue398.style.left = scopeValue1517 + "px";
        scopeValue398.style.top = scopeValue1518 + "px";
        scopeValue398.style.transform = "translate3d(0, 0, 0) scale(0.96)";
        scopeValue398.dataset.dragged = "true";
        scopeValue403 = requestAnimationFrame(() => {
          scopeValue403 = requestAnimationFrame(() => {
            scopeValue403 = null;
            !scopeValue401 && scopeValue398 && (scopeValue398.classList.remove("dragging"), scopeValue398.style.transform = "");
          });
        });
        if (scopeValue404 !== null) clearTimeout(scopeValue404);
        scopeValue404 = window.setTimeout(() => {
          scopeValue404 = null;
          scopeValue381();
        }, 50);
        window.setTimeout(() => {
          if (scopeValue398) scopeValue398.dataset.dragged = "false";
        }, 0);
      } else {
        scopeValue398.classList.remove("dragging");
        scopeValue398.style.transform = "";
      }
    }
    function scopeValue427() {
      if (!scopeValue399) return;
      const scopeValue1519 = scopeValue399.querySelector("#assistive-api-model");
      if (scopeValue1519) scopeValue1519.textContent = scopeValue406(scopeValue11.model);
      if (!scopeValue400) return;
      scopeValue400.innerHTML = "";
      const scopeValue1520 = document.createElement("option");
      scopeValue1520.value = "";
      scopeValue1520.textContent = Array.isArray(scopeValue16) && scopeValue16.length ? "选择 API 预设" : "暂无 API 预设";
      scopeValue400.appendChild(scopeValue1520);
      Array.isArray(scopeValue16) && scopeValue16.forEach(scopeValue1521 => {
        const scopeValue1522 = document.createElement("option");
        scopeValue1522.value = String(scopeValue1521.id);
        scopeValue1522.textContent = scopeValue1521.name || "未命名预设";
        scopeValue400.appendChild(scopeValue1522);
      });
      scopeValue400.value = scopeValue405();
    }
    function scopeValue428(scopeValue1523) {
      scopeValue19.enabled = !!scopeValue1523;
      UI.inputs.assistiveBallToggle && (UI.inputs.assistiveBallToggle.checked = scopeValue19.enabled);
      scopeValue418();
      scopeValue416();
      scopeValue417();
      scopeValue413();
      scopeValue422();
      scopeValue398.classList.toggle("visible", scopeValue19.enabled);
      !scopeValue19.enabled ? scopeValue420() : scopeValue427();
    }
    function scopeValue429(scopeValue1524) {
      const scopeValue1525 = Array.isArray(scopeValue16) ? scopeValue16.find(scopeValue1526 => String(scopeValue1526.id) === String(scopeValue1524)) : null;
      if (!scopeValue1525) {
        scopeValue427();
        return;
      }
      scopeValue11 = {
        provider: scopeValue1525.provider || "openai-compatible",
        endpoint: scopeValue1525.endpoint || "",
        apiKey: scopeValue1525.apiKey || "",
        model: scopeValue1525.model || "",
        temperature: scopeValue1525.temp ?? 0.7,
        frequencyPenalty: scopeValue1525.frequencyPenalty ?? 0,
        maxTokens: window.u2Api.normalizeMaxTokens(scopeValue1525.maxTokens),
        streamEnabled: scopeValue1525.streamEnabled === true
      };
      scopeValue20 = {
        ...scopeValue11
      };
      window.apiConfig = scopeValue11;
      if (UI.inputs.apiProvider) UI.inputs.apiProvider.value = scopeValue11.provider;
      scopeValue442({
        provider: scopeValue11.provider
      });
      if (UI.inputs.apiEndpoint) UI.inputs.apiEndpoint.value = scopeValue11.endpoint;
      if (UI.inputs.apiKey) UI.inputs.apiKey.value = scopeValue11.apiKey;
      if (UI.inputs.apiModel) scopeValue439(UI.inputs.apiModel, scopeValue11.model || "");
      if (UI.inputs.apiTemp) UI.inputs.apiTemp.value = scopeValue11.temperature;
      if (UI.inputs.apiStream) UI.inputs.apiStream.checked = scopeValue11.streamEnabled === true;
      if (UI.inputs.apiFrequencyPenalty) UI.inputs.apiFrequencyPenalty.value = scopeValue11.frequencyPenalty ?? 0;
      if (UI.inputs.apiMaxTokens) UI.inputs.apiMaxTokens.value = scopeValue11.maxTokens ?? "";
      scopeValue381();
      scopeValue427();
      showToast("已切换到 " + (scopeValue1525.name || "未命名预设"));
    }
    scopeValue397 && UI.overlays.assistiveBallSettings && scopeValue397.addEventListener("click", () => {
      scopeValue428(scopeValue19.enabled);
      scopeValue416();
      scopeValue417();
      scopeValue414();
      openView(UI.overlays.assistiveBallSettings);
    });
    UI.inputs.assistiveBallToggle && UI.inputs.assistiveBallToggle.addEventListener("change", () => {
      scopeValue428(UI.inputs.assistiveBallToggle.checked);
      scopeValue381();
      showToast(scopeValue19.enabled ? "悬浮球已开启" : "悬浮球已关闭");
    });
    UI.inputs.assistiveBallOpacity && (UI.inputs.assistiveBallOpacity.addEventListener("input", () => {
      scopeValue19.opacity = scopeValue408(UI.inputs.assistiveBallOpacity.value);
      scopeValue416();
    }), UI.inputs.assistiveBallOpacity.addEventListener("change", () => {
      scopeValue19.opacity = scopeValue408(UI.inputs.assistiveBallOpacity.value);
      scopeValue416();
      scopeValue381();
    }));
    UI.inputs.assistiveBallSize && (UI.inputs.assistiveBallSize.addEventListener("input", () => {
      scopeValue19.size = scopeValue409(UI.inputs.assistiveBallSize.value);
      scopeValue417();
      scopeValue422();
    }), UI.inputs.assistiveBallSize.addEventListener("change", () => {
      scopeValue19.size = scopeValue409(UI.inputs.assistiveBallSize.value);
      scopeValue417();
      scopeValue422();
      scopeValue381();
    }));
    UI.inputs.assistiveBallImageUrlApply && UI.inputs.assistiveBallImageUrlApply.addEventListener("click", () => {
      scopeValue415(UI.inputs.assistiveBallImageUrl?.value, "悬浮球图片已更新");
    });
    UI.inputs.assistiveBallImageUrl && UI.inputs.assistiveBallImageUrl.addEventListener("keydown", scopeValue1527 => {
      if (scopeValue1527.key !== "Enter") return;
      scopeValue1527.preventDefault();
      scopeValue415(UI.inputs.assistiveBallImageUrl.value, "悬浮球图片已更新");
    });
    UI.inputs.assistiveBallImageUpload && UI.inputs.assistiveBallImageFile && (UI.inputs.assistiveBallImageUpload.addEventListener("click", () => {
      UI.inputs.assistiveBallImageFile.click();
    }), UI.inputs.assistiveBallImageFile.addEventListener("change", async scopeValue1528 => {
      const scopeValue1529 = scopeValue1528.target.files?.[0];
      scopeValue1528.target.value = "";
      if (!scopeValue1529) return;
      if (scopeValue1529.type !== "image/png") {
        showToast("请上传 PNG 图片");
        return;
      }
      try {
        const scopeValue1530 = await scopeValue65(scopeValue1529, {
          maxWidth: 256,
          maxHeight: 256,
          outputType: "image/png"
        });
        await scopeValue415(scopeValue1530, "悬浮球图片已压缩并更新");
      } catch (scopeValue1531) {
        console.warn("Failed to compress assistive ball image:", scopeValue1531);
        showToast("图片压缩失败，请重试");
      }
    }));
    UI.inputs.assistiveBallImageReset && UI.inputs.assistiveBallImageReset.addEventListener("click", async () => {
      scopeValue19.imageUrl = "";
      scopeValue418();
      scopeValue413();
      scopeValue414();
      await scopeValue381();
      showToast("已恢复默认悬浮球");
    });
    document.addEventListener("click", scopeValue1532 => {
      scopeValue399?.classList.contains("active") && !scopeValue399.contains(scopeValue1532.target) && scopeValue420();
    });
    window.u2AssistiveApiBall = {
      sync: scopeValue427,
      setEnabled: scopeValue428,
      getSettings: () => ({
        ...scopeValue19
      })
    };
    scopeValue428(scopeValue19.enabled);
    const scopeValue430 = 50,
      scopeValue431 = 150;
    let scopeValue432 = 0,
      scopeValue433 = "",
      scopeValue434 = null;
    function scopeValue435() {
      scopeValue432 += 1;
      scopeValue433 = "";
      scopeValue434 && (clearTimeout(scopeValue434), scopeValue434 = null);
    }
    function scopeValue436(scopeValue1533 = UI.inputs.apiModelSearch?.value || "", scopeValue1534 = {}) {
      if (!UI.inputs.apiModelList) return;
      if (!scopeValue1534.force && UI.inputs.apiModelPicker?.hidden) return;
      const scopeValue1535 = String(scopeValue1533 || "").trim().toLocaleLowerCase(),
        scopeValue1536 = (Array.isArray(scopeValue17) ? scopeValue17 : []).filter(scopeValue1541 => !scopeValue1535 || String(scopeValue1541).toLocaleLowerCase().includes(scopeValue1535)),
        scopeValue1537 = String(UI.inputs.apiModel?.value || "").trim(),
        scopeValue1538 = scopeValue432 + "|" + scopeValue1535 + "|" + scopeValue1537;
      if (scopeValue433 === scopeValue1538) return;
      scopeValue433 = scopeValue1538;
      const scopeValue1539 = scopeValue1536.slice(0, scopeValue430);
      !scopeValue1535 && scopeValue1537 && !scopeValue1539.includes(scopeValue1537) && scopeValue1536.includes(scopeValue1537) && (scopeValue1539.pop(), scopeValue1539.unshift(scopeValue1537));
      const scopeValue1540 = document.createDocumentFragment();
      if (!scopeValue1536.length) {
        const scopeValue1542 = document.createElement("div");
        scopeValue1542.className = "api-model-empty";
        scopeValue1542.textContent = scopeValue17.length ? "没有匹配的模型" : "暂无模型列表，可先获取模型或直接填写名称";
        scopeValue1540.appendChild(scopeValue1542);
        UI.inputs.apiModelList.replaceChildren(scopeValue1540);
        return;
      }
      scopeValue1539.forEach(scopeValue1543 => {
        const scopeValue1544 = document.createElement("button");
        scopeValue1544.type = "button";
        scopeValue1544.className = "api-model-option";
        scopeValue1544.setAttribute("role", "option");
        scopeValue1544.setAttribute("aria-selected", String(scopeValue1543 === scopeValue1537));
        scopeValue1544.classList.toggle("is-selected", scopeValue1543 === scopeValue1537);
        scopeValue1544.textContent = scopeValue1543;
        scopeValue1544.addEventListener("click", () => {
          scopeValue439(UI.inputs.apiModel, scopeValue1543);
          scopeValue20.model = scopeValue1543;
          scopeValue438(false);
        });
        scopeValue1540.appendChild(scopeValue1544);
      });
      if (scopeValue1536.length > scopeValue1539.length) {
        const scopeValue1545 = document.createElement("div");
        scopeValue1545.className = "api-model-limit-hint";
        scopeValue1545.textContent = "已显示前 " + scopeValue430 + " 个模型，请继续搜索";
        scopeValue1540.appendChild(scopeValue1545);
      }
      UI.inputs.apiModelList.replaceChildren(scopeValue1540);
    }
    function scopeValue437(scopeValue1546) {
      if (scopeValue434) clearTimeout(scopeValue434);
      scopeValue434 = setTimeout(() => {
        scopeValue434 = null;
        scopeValue436(scopeValue1546);
      }, scopeValue431);
    }
    function scopeValue438(scopeValue1547) {
      if (!UI.inputs.apiModelPicker || !UI.inputs.apiModelPickerToggle) return;
      const scopeValue1548 = !!scopeValue1547;
      UI.inputs.apiModelPicker.hidden = !scopeValue1548;
      UI.inputs.apiModelPickerToggle.setAttribute("aria-expanded", String(scopeValue1548));
      if (!scopeValue1548) {
        scopeValue434 && (clearTimeout(scopeValue434), scopeValue434 = null);
        return;
      }
      if (UI.inputs.apiModelSearch) UI.inputs.apiModelSearch.value = "";
      scopeValue436("", {
        force: true
      });
      setTimeout(() => UI.inputs.apiModelSearch?.focus({
        preventScroll: true
      }), 0);
    }
    function scopeValue439(scopeValue1549, scopeValue1550) {
      if (!scopeValue1549) return;
      scopeValue1549.value = scopeValue1550;
    }
    const scopeValue440 = Object.freeze({
      openai: {
        endpoint: "https://api.openai.com/v1",
        model: "gpt-4o-mini",
        hint: "使用 OpenAI 官方 Chat Completions 接口。"
      },
      deepseek: {
        endpoint: "https://api.deepseek.com/v1",
        model: "deepseek-chat",
        hint: "使用 DeepSeek 的 OpenAI 兼容接口。"
      },
      siliconflow: {
        endpoint: "https://api.siliconflow.cn/v1",
        model: "deepseek-ai/DeepSeek-V3",
        hint: "使用硅基流动的 OpenAI 兼容接口。"
      },
      gemini: {
        endpoint: "https://generativelanguage.googleapis.com/v1beta",
        model: "gemini-2.5-flash",
        hint: "使用 Gemini 官方协议与 x-goog-api-key；不要填写 OpenAI 的 /chat/completions 路径。"
      },
      anthropic: {
        endpoint: "https://api.anthropic.com/v1",
        model: "claude-sonnet-4-20250514",
        hint: "使用 Claude 官方 Messages API 与 x-api-key。"
      },
      "openai-compatible": {
        endpoint: "",
        model: "",
        hint: "填写任意 OpenAI 兼容服务的地址、密钥和模型。"
      }
    });
    function scopeValue441(scopeValue1551) {
      const scopeValue1552 = window.u2Api.normalizeApiProvider(scopeValue1551);
      return scopeValue440[scopeValue1552] || scopeValue440["openai-compatible"];
    }
    function scopeValue442(scopeValue1553 = {}) {
      const scopeValue1554 = window.u2Api.normalizeApiProvider(scopeValue1553.provider || UI.inputs.apiProvider?.value || scopeValue20.provider || scopeValue11.provider),
        scopeValue1555 = scopeValue441(scopeValue1554);
      if (UI.inputs.apiProvider) UI.inputs.apiProvider.value = scopeValue1554;
      if (UI.inputs.apiProviderHint) UI.inputs.apiProviderHint.textContent = scopeValue1555.hint;
      scopeValue1553.applyPreset && scopeValue1555.endpoint && UI.inputs.apiEndpoint && (UI.inputs.apiEndpoint.value = scopeValue1555.endpoint);
      if (scopeValue1553.applyPreset && scopeValue1555.model && UI.inputs.apiModel) {
        const scopeValue1556 = scopeValue441(scopeValue1553.previousProvider),
          scopeValue1557 = String(UI.inputs.apiModel.value || "").trim();
        (!scopeValue1557 || scopeValue1557 === scopeValue1556.model) && scopeValue439(UI.inputs.apiModel, scopeValue1555.model);
      }
      return scopeValue1553.applyPreset && scopeValue1554 !== window.u2Api.normalizeApiProvider(scopeValue1553.previousProvider) && (scopeValue17 = [], scopeValue435()), scopeValue20.provider = scopeValue1554, scopeValue1554;
    }
    function readMaxTokensInput() {
      const input = UI.inputs.apiMaxTokens;
      if (input?.validity?.badInput) throw new Error("最大生成 Token 请输入正整数，或留空使用默认值");
      return window.u2Api.validateMaxTokens(input?.value);
    }
    function scopeValue443(scopeValue1558 = true) {
      const scopeValue1559 = window.u2Api.validateApiConfig({
        provider: UI.inputs.apiProvider?.value,
        endpoint: UI.inputs.apiEndpoint?.value,
        apiKey: UI.inputs.apiKey?.value,
        model: UI.inputs.apiModel?.value,
        temperature: UI.inputs.apiTemp?.value,
        frequencyPenalty: UI.inputs.apiFrequencyPenalty?.value,
        maxTokens: readMaxTokensInput(),
        streamEnabled: UI.inputs.apiStream?.checked === true
      }, {
        requireModel: scopeValue1558
      });
      return scopeValue1559.endpoint = window.u2Api.normalizeApiEndpoint(scopeValue1559.endpoint, scopeValue1559.provider), scopeValue1559;
    }
    function scopeValue444(scopeValue1560, scopeValue1561) {
      const scopeValue1562 = Number(scopeValue1560?.status) || 0,
        scopeValue1563 = String(scopeValue1560?.message || "").trim();
      if (scopeValue1562) return scopeValue1561 + "（HTTP " + scopeValue1562 + (scopeValue1563 ? "：" + scopeValue1563 : "") + "）";
      return scopeValue1563 || scopeValue1561;
    }
    const scopeValue445 = document.getElementById("api-config-btn");
    scopeValue445 && UI.overlays.apiConfig && scopeValue445.addEventListener("click", scopeValue1564 => {
      scopeValue1564.stopPropagation();
      scopeValue438(false);
      scopeValue20 = {
        provider: scopeValue11.provider || "openai-compatible",
        endpoint: scopeValue11.endpoint || "",
        apiKey: scopeValue11.apiKey || "",
        model: scopeValue11.model || "",
        temperature: scopeValue11.temperature ?? 0.7,
        frequencyPenalty: scopeValue11.frequencyPenalty ?? 0,
        maxTokens: scopeValue11.maxTokens ?? null,
        streamEnabled: scopeValue11.streamEnabled === true
      };
      scopeValue442({
        provider: scopeValue20.provider
      });
      UI.inputs.apiEndpoint.value = scopeValue20.endpoint || "";
      UI.inputs.apiKey.value = scopeValue20.apiKey || "";
      scopeValue439(UI.inputs.apiModel, scopeValue20.model || "");
      UI.inputs.apiTemp.value = scopeValue20.temperature ?? 0.7;
      if (UI.inputs.apiStream) UI.inputs.apiStream.checked = scopeValue20.streamEnabled === true;
      if (UI.inputs.apiFrequencyPenalty) UI.inputs.apiFrequencyPenalty.value = scopeValue20.frequencyPenalty ?? 0;
      if (UI.inputs.apiMaxTokens) UI.inputs.apiMaxTokens.value = scopeValue20.maxTokens ?? "";
      scopeValue391();
      scopeValue394();
      scopeValue49();
    });
    UI.inputs.apiProvider && UI.inputs.apiProvider.addEventListener("change", () => {
      const scopeValue1565 = scopeValue20.provider || scopeValue11.provider || "openai-compatible";
      scopeValue442({
        provider: UI.inputs.apiProvider.value,
        previousProvider: scopeValue1565,
        applyPreset: true
      });
    });
    const scopeValue446 = document.getElementById("vector-memory-config-btn");
    scopeValue446 && UI.overlays.vectorMemoryConfig && scopeValue446.addEventListener("click", scopeValue1566 => {
      scopeValue1566.stopPropagation();
      scopeValue388();
      openView(UI.overlays.vectorMemoryConfig);
    });
    const scopeValue447 = {
      openai: {
        name: "OpenAI",
        keyLabel: "OpenAI API Key",
        endpointHint: "使用支持图片输入的 OpenAI 模型；接口可填写完整 chat/completions 地址或 /v1 基础地址。"
      },
      gemini: {
        name: "Gemini",
        keyLabel: "Gemini API Key",
        endpointHint: "使用 Gemini Interactions API；请填写支持图片理解的 Gemini 模型。"
      },
      claude: {
        name: "Claude",
        keyLabel: "Anthropic API Key",
        endpointHint: "使用 Anthropic Messages API；远程图片地址需要浏览器可读取。"
      },
      grok: {
        name: "Grok",
        keyLabel: "xAI API Key",
        endpointHint: "使用支持图片输入的 Grok 模型。"
      },
      qwen: {
        name: "Qwen / DashScope",
        keyLabel: "DashScope API Key",
        endpointHint: "使用百炼 OpenAI 兼容接口；请选择支持视觉输入的 Qwen-VL 或多模态模型。"
      },
      zhipu: {
        name: "智谱 GLM",
        keyLabel: "智谱 API Key",
        endpointHint: "使用智谱 OpenAI 兼容接口；请选择支持视觉输入的 GLM 模型。"
      },
      "openai-compatible": {
        name: "OpenAI 兼容",
        keyLabel: "API 密钥",
        endpointHint: "可接入支持 OpenAI Chat Completions 图像输入的中转站或兼容服务。"
      }
    };
    let scopeValue448 = window.u2ImageUnderstanding ? window.u2ImageUnderstanding.normalizeConfig(scopeValue14) : scopeValue4(scopeValue14);
    function scopeValue449() {
      const scopeValue1567 = scopeValue448.activeProvider;
      if (!scopeValue1567 || !scopeValue448.providers?.[scopeValue1567]) return;
      scopeValue448.providers[scopeValue1567] = {
        endpoint: String(UI.inputs.visionEndpoint?.value || "").trim(),
        apiKey: String(UI.inputs.visionApiKey?.value || "").trim(),
        model: String(UI.inputs.visionModel?.value || "").trim(),
        models: Array.isArray(scopeValue448.providers[scopeValue1567].models) ? scopeValue448.providers[scopeValue1567].models.slice() : []
      };
    }
    function scopeValue450(scopeValue1568) {
      const scopeValue1569 = UI.inputs.visionModelSelect;
      if (!scopeValue1569) return;
      const scopeValue1570 = Array.isArray(scopeValue1568?.models) ? scopeValue1568.models : [];
      scopeValue1569.replaceChildren();
      const scopeValue1571 = document.createElement("option");
      scopeValue1571.value = "";
      scopeValue1571.textContent = scopeValue1570.length ? "选择已获取模型" : "暂无已获取模型";
      scopeValue1569.appendChild(scopeValue1571);
      scopeValue1570.forEach(scopeValue1572 => {
        const scopeValue1573 = document.createElement("option");
        scopeValue1573.value = scopeValue1572;
        scopeValue1573.textContent = scopeValue1572;
        scopeValue1569.appendChild(scopeValue1573);
      });
      scopeValue1569.value = scopeValue1570.includes(String(scopeValue1568?.model || "").trim()) ? String(scopeValue1568.model).trim() : "";
      scopeValue1569.disabled = scopeValue1570.length === 0;
    }
    function scopeValue451() {
      const scopeValue1574 = scopeValue448.activeProvider || "gemini",
        scopeValue1575 = scopeValue448.providers?.[scopeValue1574] || {},
        scopeValue1576 = scopeValue447[scopeValue1574] || scopeValue447["openai-compatible"];
      if (UI.inputs.visionProvider) UI.inputs.visionProvider.value = scopeValue1574;
      if (UI.inputs.visionEndpoint) UI.inputs.visionEndpoint.value = scopeValue1575.endpoint || "";
      UI.inputs.visionApiKey && (UI.inputs.visionApiKey.value = scopeValue1575.apiKey || "", UI.inputs.visionApiKey.placeholder = scopeValue1574 === "gemini" ? "AIza..." : "sk-...");
      UI.inputs.visionModel && (UI.inputs.visionModel.value = scopeValue1575.model || "", UI.inputs.visionModel.placeholder = "填写支持视觉输入的模型");
      scopeValue450(scopeValue1575);
      if (UI.inputs.visionKeyLabel) UI.inputs.visionKeyLabel.textContent = scopeValue1576.keyLabel;
      if (UI.inputs.visionEndpointHint) UI.inputs.visionEndpointHint.textContent = scopeValue1576.endpointHint;
    }
    const scopeValue452 = document.getElementById("vision-config-btn");
    scopeValue452 && UI.overlays.visionConfig && scopeValue452.addEventListener("click", scopeValue1577 => {
      scopeValue1577.stopPropagation();
      if (!window.u2ImageUnderstanding) {
        showToast("识图模块尚未加载，请刷新后重试");
        return;
      }
      scopeValue448 = window.u2ImageUnderstanding.normalizeConfig(scopeValue14);
      scopeValue451();
      openView(UI.overlays.visionConfig);
    });
    UI.inputs.visionProvider?.addEventListener("change", () => {
      scopeValue449();
      scopeValue448.activeProvider = UI.inputs.visionProvider.value;
      scopeValue451();
    });
    [UI.inputs.visionEndpoint, UI.inputs.visionApiKey].forEach(scopeValue1578 => {
      scopeValue1578?.addEventListener("input", scopeValue449);
      scopeValue1578?.addEventListener("change", scopeValue449);
    });
    UI.inputs.visionModel?.addEventListener("input", () => {
      scopeValue449();
      const scopeValue1579 = scopeValue448.activeProvider,
        scopeValue1580 = scopeValue448.providers?.[scopeValue1579]?.models || [];
      UI.inputs.visionModelSelect && (UI.inputs.visionModelSelect.value = scopeValue1580.includes(String(UI.inputs.visionModel.value || "").trim()) ? String(UI.inputs.visionModel.value).trim() : "");
    });
    UI.inputs.visionModel?.addEventListener("change", scopeValue449);
    UI.inputs.visionModelSelect?.addEventListener("change", () => {
      const scopeValue1581 = String(UI.inputs.visionModelSelect.value || "").trim();
      if (!scopeValue1581 || !UI.inputs.visionModel) return;
      UI.inputs.visionModel.value = scopeValue1581;
      scopeValue449();
    });
    const scopeValue453 = document.getElementById("fetch-vision-models-btn");
    scopeValue453 && scopeValue453.addEventListener("click", async () => {
      const scopeValue1582 = scopeValue453.innerHTML;
      try {
        if (!window.u2ImageUnderstanding) throw new Error("识图模块尚未加载，请刷新后重试");
        scopeValue449();
        const scopeValue1583 = scopeValue448.activeProvider,
          scopeValue1584 = scopeValue448.providers?.[scopeValue1583] || {};
        scopeValue453.innerHTML = "<i class=\"fas fa-spinner fa-spin\"></i><div class=\"settings-text\" style=\"color:var(--blue-color);\">正在获取模型…</div>";
        scopeValue453.style.pointerEvents = "none";
        const scopeValue1585 = await window.u2ImageUnderstanding.fetchModels({
          provider: scopeValue1583,
          ...scopeValue1584
        });
        if (!scopeValue1585.length) throw new Error("接口返回成功，但没有找到可用模型");
        scopeValue448.providers[scopeValue1583].models = scopeValue1585.slice();
        scopeValue450(scopeValue448.providers[scopeValue1583]);
        UI.inputs.visionModel && !UI.inputs.visionModel.value.trim() && (UI.inputs.visionModel.value = scopeValue1585[0], scopeValue449());
        if (UI.inputs.visionModelSelect) UI.inputs.visionModelSelect.value = UI.inputs.visionModel.value;
        UI.inputs.visionModel?.focus({
          preventScroll: true
        });
        showToast("成功获取 " + scopeValue1585.length + " 个模型");
      } catch (scopeValue1586) {
        console.error("Fetch Vision Models Error:", scopeValue1586);
        if (!window.u2Api?.isRequestError?.(scopeValue1586) || !window.u2Api.reportError(scopeValue1586, {
          operation: "获取识图模型"
        })) showToast(scopeValue1586?.message || "获取识图模型失败");
      } finally {
        scopeValue453.innerHTML = scopeValue1582;
        scopeValue453.style.pointerEvents = "";
      }
    });
    const scopeValue454 = document.getElementById("confirm-vision-config-btn");
    scopeValue454 && scopeValue454.addEventListener("click", async () => {
      const scopeValue1587 = scopeValue14;
      try {
        if (!window.u2ImageUnderstanding) throw new Error("识图模块尚未加载，请刷新后重试");
        scopeValue449();
        const scopeValue1588 = scopeValue448.activeProvider,
          scopeValue1589 = scopeValue448.providers?.[scopeValue1588] || {};
        window.u2ImageUnderstanding.validateActiveConfig({
          provider: scopeValue1588,
          ...scopeValue1589
        });
        scopeValue454.classList.add("is-busy");
        scopeValue454.style.pointerEvents = "none";
        scopeValue14 = window.u2ImageUnderstanding.normalizeConfig(scopeValue448);
        window.visionConfig = scopeValue14;
        const scopeValue1590 = await scopeValue381();
        if (!scopeValue1590) throw new Error("识图配置未能写入本地存储，请重试");
        closeView(UI.overlays.visionConfig);
        const scopeValue1591 = scopeValue447[scopeValue1588]?.name || "识图服务";
        showToast("已启用 " + scopeValue1591);
      } catch (scopeValue1592) {
        scopeValue14 = scopeValue1587;
        window.visionConfig = scopeValue1587;
        console.error("Save Vision Config Error:", scopeValue1592);
        showToast(scopeValue1592?.message || "识图配置保存失败");
      } finally {
        scopeValue454.classList.remove("is-busy");
        scopeValue454.style.pointerEvents = "";
      }
    });
    const scopeValue455 = {
      openai: {
        name: "GPT Image（OpenAI）",
        keyLabel: "OpenAI API Key",
        endpointHint: "使用 OpenAI 官方 GPT Image 接口，也可替换为同协议代理地址"
      },
      gemini: {
        name: "Gemini Image",
        keyLabel: "Gemini API Key",
        endpointHint: "使用 x-goog-api-key 调用 Nano Banana / Gemini Image"
      },
      novelai: {
        name: "NovelAI",
        keyLabel: "Persistent Token",
        endpointHint: "使用 NovelAI Persistent API Token，返回图片将保存到聊天记录"
      },
      grok: {
        name: "Grok",
        keyLabel: "xAI API Key",
        endpointHint: "使用 Grok Imagine 图片生成接口"
      },
      relay: {
        name: "OpenAI 兼容中转站",
        keyLabel: "API 密钥",
        endpointHint: "可填写基础地址或完整 /v1/images/generations 地址"
      }
    };
    let scopeValue456 = window.u2ImageGeneration ? window.u2ImageGeneration.normalizeConfig(scopeValue13) : scopeValue4(scopeValue13);
    function scopeValue457() {
      const scopeValue1593 = scopeValue456.activeProvider;
      if (!scopeValue1593 || !scopeValue456.providers?.[scopeValue1593]) return;
      scopeValue456.providers[scopeValue1593] = {
        endpoint: String(UI.inputs.imageEndpoint?.value || "").trim(),
        apiKey: String(UI.inputs.imageApiKey?.value || "").trim(),
        model: String(UI.inputs.imageModel?.value || "").trim(),
        size: UI.inputs.imageSize?.value || "1024x1024",
        models: Array.isArray(scopeValue456.providers[scopeValue1593].models) ? scopeValue456.providers[scopeValue1593].models.slice() : []
      };
    }
    function scopeValue458(scopeValue1594) {
      const scopeValue1595 = UI.inputs.imageModelSelect;
      if (!scopeValue1595) return;
      const scopeValue1596 = Array.isArray(scopeValue1594?.models) ? scopeValue1594.models : [];
      scopeValue1595.replaceChildren();
      const scopeValue1597 = document.createElement("option");
      scopeValue1597.value = "";
      scopeValue1597.textContent = scopeValue1596.length ? "选择已获取模型" : "暂无已获取模型";
      scopeValue1595.appendChild(scopeValue1597);
      scopeValue1596.forEach(scopeValue1598 => {
        const scopeValue1599 = document.createElement("option");
        scopeValue1599.value = scopeValue1598;
        scopeValue1599.textContent = scopeValue1598;
        scopeValue1595.appendChild(scopeValue1599);
      });
      scopeValue1595.value = scopeValue1596.includes(String(scopeValue1594?.model || "").trim()) ? String(scopeValue1594.model).trim() : "";
      scopeValue1595.disabled = scopeValue1596.length === 0;
    }
    function scopeValue459() {
      const scopeValue1600 = scopeValue456.activeProvider || "gemini",
        scopeValue1601 = scopeValue456.providers?.[scopeValue1600] || {},
        scopeValue1602 = scopeValue455[scopeValue1600] || scopeValue455.relay;
      if (UI.inputs.imageProvider) UI.inputs.imageProvider.value = scopeValue1600;
      if (UI.inputs.imageEndpoint) UI.inputs.imageEndpoint.value = scopeValue1601.endpoint || "";
      UI.inputs.imageApiKey && (UI.inputs.imageApiKey.value = scopeValue1601.apiKey || "", UI.inputs.imageApiKey.placeholder = scopeValue1600 === "novelai" ? "pst-..." : "sk-...");
      UI.inputs.imageModel && (UI.inputs.imageModel.value = scopeValue1601.model || "", UI.inputs.imageModel.placeholder = scopeValue1600 === "novelai" ? "填写账号可用的 NovelAI 图片模型" : scopeValue1600 === "relay" ? "填写中转站图片模型" : "填写图片模型");
      if (UI.inputs.imageSize) UI.inputs.imageSize.value = scopeValue1601.size || "1024x1024";
      scopeValue458(scopeValue1601);
      if (UI.inputs.imageKeyLabel) UI.inputs.imageKeyLabel.textContent = scopeValue1602.keyLabel;
      if (UI.inputs.imageEndpointHint) UI.inputs.imageEndpointHint.textContent = scopeValue1602.endpointHint;
    }
    const scopeValue460 = document.getElementById("image-generation-config-btn");
    scopeValue460 && UI.overlays.imageGenerationConfig && scopeValue460.addEventListener("click", scopeValue1603 => {
      scopeValue1603.stopPropagation();
      scopeValue456 = window.u2ImageGeneration ? window.u2ImageGeneration.normalizeConfig(scopeValue13) : scopeValue4(scopeValue13);
      scopeValue459();
      openView(UI.overlays.imageGenerationConfig);
    });
    UI.inputs.imageProvider && UI.inputs.imageProvider.addEventListener("change", () => {
      scopeValue457();
      scopeValue456.activeProvider = UI.inputs.imageProvider.value;
      scopeValue459();
    });
    [UI.inputs.imageEndpoint, UI.inputs.imageApiKey, UI.inputs.imageSize].forEach(scopeValue1604 => {
      scopeValue1604?.addEventListener("input", scopeValue457);
      scopeValue1604?.addEventListener("change", scopeValue457);
    });
    [UI.inputs.imageModel].forEach(scopeValue1605 => {
      scopeValue1605?.addEventListener("input", () => {
        scopeValue457();
        const scopeValue1606 = scopeValue456.activeProvider,
          scopeValue1607 = scopeValue456.providers?.[scopeValue1606]?.models || [];
        UI.inputs.imageModelSelect && (UI.inputs.imageModelSelect.value = scopeValue1607.includes(String(scopeValue1605.value || "").trim()) ? String(scopeValue1605.value).trim() : "");
      });
      scopeValue1605?.addEventListener("change", scopeValue457);
    });
    UI.inputs.imageModelSelect?.addEventListener("change", () => {
      const scopeValue1608 = String(UI.inputs.imageModelSelect.value || "").trim();
      if (!scopeValue1608 || !UI.inputs.imageModel) return;
      UI.inputs.imageModel.value = scopeValue1608;
      scopeValue457();
    });
    const scopeValue461 = document.getElementById("fetch-image-generation-models-btn");
    scopeValue461 && scopeValue461.addEventListener("click", async () => {
      const scopeValue1609 = scopeValue461.innerHTML;
      try {
        scopeValue457();
        const scopeValue1610 = scopeValue456.activeProvider,
          scopeValue1611 = scopeValue456.providers?.[scopeValue1610] || {};
        scopeValue461.innerHTML = "<i class=\"fas fa-spinner fa-spin\"></i><div class=\"settings-text\" style=\"color:var(--blue-color);\">正在获取模型…</div>";
        scopeValue461.style.pointerEvents = "none";
        const scopeValue1612 = await window.u2ImageGeneration.fetchModels({
          provider: scopeValue1610,
          ...scopeValue1611
        });
        if (!scopeValue1612.length) throw new Error("接口返回成功，但没有找到可用模型");
        scopeValue456.providers[scopeValue1610].models = scopeValue1612.slice();
        scopeValue458(scopeValue456.providers[scopeValue1610]);
        UI.inputs.imageModel && !UI.inputs.imageModel.value.trim() && (UI.inputs.imageModel.value = scopeValue1612[0], scopeValue457());
        if (UI.inputs.imageModelSelect) UI.inputs.imageModelSelect.value = UI.inputs.imageModel.value;
        UI.inputs.imageModel?.focus({
          preventScroll: true
        });
        showToast("成功获取 " + scopeValue1612.length + " 个模型");
      } catch (scopeValue1613) {
        console.error("Fetch Image Generation Models Error:", scopeValue1613);
        if (!window.u2Api?.isRequestError?.(scopeValue1613) || !window.u2Api.reportError(scopeValue1613, {
          operation: "获取生图模型"
        })) showToast(scopeValue1613?.message || "获取生图模型失败");
      } finally {
        scopeValue461.innerHTML = scopeValue1609;
        scopeValue461.style.pointerEvents = "";
      }
    });
    const scopeValue462 = document.getElementById("confirm-image-generation-btn");
    scopeValue462 && scopeValue462.addEventListener("click", async () => {
      const scopeValue1614 = scopeValue13;
      try {
        scopeValue457();
        const scopeValue1615 = scopeValue456.activeProvider,
          scopeValue1616 = scopeValue456.providers?.[scopeValue1615] || {};
        window.u2ImageGeneration.validateActiveConfig({
          provider: scopeValue1615,
          ...scopeValue1616
        });
        scopeValue462.classList.add("is-busy");
        scopeValue462.style.pointerEvents = "none";
        scopeValue13 = window.u2ImageGeneration.normalizeConfig(scopeValue456);
        window.imageGenerationConfig = scopeValue13;
        const scopeValue1617 = await scopeValue381();
        if (!scopeValue1617) throw new Error("生图配置未能写入本地存储，请重试");
        closeView(UI.overlays.imageGenerationConfig);
        const scopeValue1618 = scopeValue455[scopeValue1615]?.name || "生图服务";
        showToast("已启用 " + scopeValue1618);
      } catch (scopeValue1619) {
        scopeValue13 = scopeValue1614;
        window.imageGenerationConfig = scopeValue1614;
        console.error("Save Image Generation Config Error:", scopeValue1619);
        showToast(scopeValue1619?.message || "生图配置保存失败");
      } finally {
        scopeValue462.classList.remove("is-busy");
        scopeValue462.style.pointerEvents = "";
      }
    });
    let scopeValue463 = window.u2Tts ? window.u2Tts.normalizeConfig(scopeValue15) : scopeValue4(scopeValue15);
    const newScope462 = window.u2ConfigPresets.createLibrary({
        get: () => newScope16,
        set: newScope1653 => {
          newScope16 = newScope1653;
        },
        persist: () => scopeValue9({
          immediate: true
        })
      }),
      newScope463 = window.u2ConfigPresets.createLibrary({
        get: () => newScope17,
        set: newScope1654 => {
          newScope17 = newScope1654;
        },
        persist: () => scopeValue9({
          immediate: true
        })
      }),
      newScope464 = window.u2ConfigPresets.createManager({
        id: "image-generation-preset",
        title: "生图配置",
        library: newScope462,
        getDraft: () => {
          scopeValue457();
          const newScope1655 = scopeValue456.activeProvider;
          return {
            provider: newScope1655,
            config: scopeValue4(scopeValue456.providers[newScope1655])
          };
        },
        applyDraft: newScope1656 => {
          scopeValue457(), scopeValue456 = window.u2ConfigPresets.mergeProviderConfig(scopeValue456, newScope1656, window.u2ImageGeneration.normalizeConfig), scopeValue459();
        },
        describe: newScope1657 => ({
          meta: (scopeValue455[newScope1657.provider]?.["name"] || newScope1657.provider) + " · " + (newScope1657.config?.["model"] || "未选择模型"),
          endpoint: newScope1657.config?.["endpoint"]
        })
      }),
      newScope465 = window.u2ConfigPresets.createManager({
        id: "tts-preset",
        title: "TTS 配置",
        library: newScope463,
        getDraft: () => {
          scopeValue465();
          const newScope1658 = scopeValue463.activeProvider;
          return {
            provider: newScope1658,
            config: scopeValue4(scopeValue463.providers[newScope1658])
          };
        },
        applyDraft: newScope1659 => {
          scopeValue465(), scopeValue463 = window.u2ConfigPresets.mergeProviderConfig(scopeValue463, newScope1659, window.u2Tts.normalizeConfig), scopeValue468();
        },
        describe: newScope1660 => ({
          meta: window.u2Tts.getProviderName(newScope1660.provider) + " · " + (newScope1660.config?.["model"] || "未选择模型"),
          endpoint: newScope1660.config?.["endpoint"]
        })
      });
    document.getElementById("save-image-generation-preset-btn")?.["addEventListener"]("click", newScope464.openSave), document.getElementById("load-image-generation-preset-btn")?.["addEventListener"]("click", newScope464.openLoad), document.getElementById("save-tts-preset-btn")?.["addEventListener"]("click", newScope465.openSave), document.getElementById("load-tts-preset-btn")?.["addEventListener"]("click", newScope465.openLoad);
    function scopeValue464() {
      const scopeValue1620 = scopeValue463.activeProvider;
      return {
        provider: scopeValue1620,
        ...(scopeValue463.providers?.[scopeValue1620] || {})
      };
    }
    function scopeValue465() {
      const scopeValue1621 = scopeValue463.activeProvider;
      if (!scopeValue1621 || !scopeValue463.providers?.[scopeValue1621]) return;
      const scopeValue1622 = scopeValue463.providers[scopeValue1621];
      scopeValue1622.endpoint = String(UI.inputs.ttsEndpoint?.value || "").trim();
      scopeValue1622.apiKey = String(UI.inputs.ttsApiKey?.value || "").trim();
      scopeValue1622.model = String(UI.inputs.ttsModel?.value || "").trim();
      UI.inputs.ttsExtraFields?.querySelectorAll("[data-tts-field]").forEach(scopeValue1623 => {
        scopeValue1622[scopeValue1623.dataset.ttsField] = String(scopeValue1623.value || "").trim();
      });
    }
    function scopeValue466(scopeValue1624) {
      const scopeValue1625 = UI.inputs.ttsModelSelect;
      if (!scopeValue1625) return;
      const scopeValue1626 = window.u2Tts.getModelOptions(scopeValue463.activeProvider, scopeValue1624);
      scopeValue1625.replaceChildren();
      const scopeValue1627 = document.createElement("option");
      scopeValue1627.value = "", scopeValue1627.textContent = scopeValue1626.length ? "请选择" : "获取列表或手动填写", scopeValue1625.appendChild(scopeValue1627);
      const newScope1669 = {
        fetched: "已获取",
        builtin: "内置选项",
        current: "当前填写"
      };
      Object.entries(newScope1669).forEach(([newScope1670, newScope1671]) => {
        const scopeValue1629 = scopeValue1626.filter(newScope1674 => newScope1674.source === newScope1670);
        if (!scopeValue1629.length) return;
        const newScope1673 = document.createElement("optgroup");
        newScope1673.label = newScope1671, scopeValue1629.forEach(scopeValue1628 => {
          const newScope1676 = document.createElement("option");
          newScope1676.value = scopeValue1628.id, newScope1676.textContent = scopeValue1628.label, newScope1673.appendChild(newScope1676);
        }), scopeValue1625.appendChild(newScope1673);
      }), scopeValue1625.value = String(scopeValue1624?.["model"] || "").trim(), scopeValue1625.disabled = scopeValue1626.length === 0;
    }
    function scopeValue467(scopeValue1630, scopeValue1631) {
      const scopeValue1632 = UI.inputs.ttsExtraFields;
      if (!scopeValue1632) return;
      scopeValue1632.replaceChildren();
      const scopeValue1633 = window.u2Tts?.getProviderDefinition?.(scopeValue1630);
      (scopeValue1633?.fields || []).forEach((scopeValue1634, scopeValue1635, scopeValue1636) => {
        const scopeValue1637 = document.createElement("div");
        scopeValue1637.className = "form-item";
        if (scopeValue1635 === scopeValue1636.length - 1) scopeValue1637.style.borderBottom = "none";
        const scopeValue1638 = document.createElement("label");
        scopeValue1638.style.width = "112px";
        scopeValue1638.style.whiteSpace = "nowrap";
        scopeValue1638.textContent = scopeValue1634.label;
        scopeValue1637.appendChild(scopeValue1638);
        let scopeValue1639;
        scopeValue1634.type === "select" ? (scopeValue1639 = document.createElement("select"), scopeValue1639.style.cssText = "flex:1; border:none; text-align:right; direction:rtl; appearance:none; background:transparent; color:var(--blue-color); outline:none; font-size:16px; min-width:0;", (scopeValue1634.options || []).forEach(([scopeValue1640, scopeValue1641]) => {
          const scopeValue1642 = document.createElement("option");
          scopeValue1642.value = scopeValue1640;
          scopeValue1642.textContent = scopeValue1641;
          scopeValue1639.appendChild(scopeValue1642);
        })) : (scopeValue1639 = document.createElement("input"), scopeValue1639.type = scopeValue1634.type || "text", scopeValue1639.autocomplete = "off", scopeValue1639.placeholder = scopeValue1634.placeholder || "填写" + scopeValue1634.label);
        scopeValue1639.dataset.ttsField = scopeValue1634.key;
        scopeValue1639.value = scopeValue1631[scopeValue1634.key] || "";
        scopeValue1639.addEventListener("input", scopeValue465);
        scopeValue1639.addEventListener("change", scopeValue465);
        scopeValue1637.appendChild(scopeValue1639);
        scopeValue1632.appendChild(scopeValue1637);
      });
    }
    function scopeValue468() {
      const scopeValue1643 = scopeValue463.activeProvider || "minimax",
        scopeValue1644 = scopeValue463.providers?.[scopeValue1643] || {},
        scopeValue1645 = window.u2Tts?.getProviderDefinition?.(scopeValue1643);
      if (UI.inputs.ttsProvider) UI.inputs.ttsProvider.value = scopeValue1643;
      if (UI.inputs.ttsEndpoint) UI.inputs.ttsEndpoint.value = scopeValue1644.endpoint || "";
      if (UI.inputs.ttsApiKey) UI.inputs.ttsApiKey.value = scopeValue1644.apiKey || "";
      if (UI.inputs.ttsModel) UI.inputs.ttsModel.value = scopeValue1644.model || "";
      if (UI.inputs.ttsKeyLabel) UI.inputs.ttsKeyLabel.textContent = scopeValue1645?.keyLabel || "API 密钥";
      const scopeValue1646 = scopeValue1645?.modelLabel || "TTS 模型";
      if (UI.inputs.ttsModelLabel) UI.inputs.ttsModelLabel.textContent = scopeValue1646;
      if (UI.inputs.ttsModelSelectLabel) UI.inputs.ttsModelSelectLabel.textContent = "选择" + (scopeValue1645?.["modelIsVoice"] ? "音色" : scopeValue1643 === "volcengine" ? "集群" : "模型");
      UI.inputs.ttsEndpointHint && (UI.inputs.ttsEndpointHint.textContent = scopeValue1643 === "fish-audio" ? "选择合成模型；每位联系人的音色 ID 在 Chat Settings Info 中填写。也可手动填写模型 ID。" : window.u2Tts.supportsModelListFetch(scopeValue1643) ? "可获取账号的模型或音色列表，也可手动填写。" : scopeValue1643 === "volcengine" ? "选择业务集群，或填写控制台提供的集群名称。" : "可直接选择内置选项，或填写已开通的模型或音色 ID。");
      const newScope1694 = document.getElementById("tts-model-select-row");
      if (newScope1694) newScope1694.style.display = "";
      const newScope1695 = document.getElementById("fetch-tts-models-btn")?.["parentElement"];
      if (newScope1695) newScope1695.style.display = window.u2Tts.supportsModelListFetch(scopeValue1643) ? "" : "none";
      scopeValue467(scopeValue1643, scopeValue1644), scopeValue466(scopeValue1644);
    }
    const scopeValue469 = document.getElementById("tts-config-btn");
    scopeValue469 && UI.overlays.ttsConfig && scopeValue469.addEventListener("click", scopeValue1650 => {
      scopeValue1650.stopPropagation();
      if (!window.u2Tts) {
        showToast("TTS 模块尚未加载，请刷新后重试");
        return;
      }
      scopeValue15 = window.u2Tts.getConfig();
      scopeValue463 = window.u2Tts.normalizeConfig(scopeValue15);
      scopeValue468();
      openView(UI.overlays.ttsConfig);
    });
    UI.inputs.ttsProvider?.["addEventListener"]("change", () => {
      scopeValue465(), scopeValue463.activeProvider = UI.inputs.ttsProvider.value, scopeValue468();
    }), [UI.inputs.ttsEndpoint, UI.inputs.ttsApiKey].forEach(scopeValue1651 => {
      scopeValue1651?.["addEventListener"]("input", scopeValue465), scopeValue1651?.["addEventListener"]("change", scopeValue465);
    }), UI.inputs.ttsModel?.["addEventListener"]("input", () => {
      scopeValue465(), scopeValue466(scopeValue463.providers[scopeValue463.activeProvider]);
    }), UI.inputs.ttsModel?.["addEventListener"]("change", scopeValue465), UI.inputs.ttsModelSelect?.["addEventListener"]("change", () => {
      const scopeValue1653 = String(UI.inputs.ttsModelSelect.value || "").trim();
      if (!scopeValue1653 || !UI.inputs.ttsModel) return;
      UI.inputs.ttsModel.value = scopeValue1653;
      scopeValue465();
    });
    const scopeValue470 = document.getElementById("fetch-tts-models-btn");
    scopeValue470 && scopeValue470.addEventListener("click", async () => {
      const scopeValue1654 = scopeValue470.innerHTML;
      try {
        if (!window.u2Tts) throw new Error("TTS 模块尚未加载，请刷新后重试");
        scopeValue465();
        const scopeValue1655 = scopeValue464();
        scopeValue470.innerHTML = "<i class=\"fas fa-spinner fa-spin\"></i><div class=\"settings-text\" style=\"color:var(--blue-color);\">正在获取模型…</div>";
        scopeValue470.style.pointerEvents = "none";
        const scopeValue1656 = await window.u2Tts.fetchModels(scopeValue1655);
        scopeValue463.providers[scopeValue1655.provider].models = scopeValue1656.slice();
        if (scopeValue463.activeProvider === scopeValue1655.provider) scopeValue466(scopeValue463.providers[scopeValue1655.provider]);
        showToast("成功获取 " + scopeValue1656.length + " 个" + (window.u2Tts.getProviderDefinition(scopeValue1655.provider)?.["modelIsVoice"] ? "音色" : "模型"));
      } catch (scopeValue1657) {
        console.error("Fetch TTS Models Error:", scopeValue1657);
        if (!window.u2Api?.isRequestError?.(scopeValue1657) || !window.u2Api.reportError(scopeValue1657, {
          operation: "获取 TTS 模型"
        })) showToast(scopeValue1657?.message || "获取 TTS 模型失败");
      } finally {
        scopeValue470.innerHTML = scopeValue1654;
        scopeValue470.style.pointerEvents = "";
      }
    });
    const scopeValue471 = document.getElementById("confirm-tts-btn");
    scopeValue471 && scopeValue471.addEventListener("click", async () => {
      const scopeValue1658 = scopeValue15;
      try {
        if (!window.u2Tts) throw new Error("TTS 模块尚未加载，请刷新后重试");
        scopeValue465();
        const scopeValue1659 = scopeValue464();
        window.u2Tts.validateActiveConfig(scopeValue1659);
        scopeValue471.classList.add("is-busy");
        scopeValue471.style.pointerEvents = "none";
        scopeValue15 = window.u2Tts.setConfig(scopeValue463);
        const scopeValue1660 = await scopeValue381();
        if (!scopeValue1660) throw new Error("TTS 配置未能写入本地存储，请重试");
        closeView(UI.overlays.ttsConfig);
        showToast(window.u2Tts.getProviderName(scopeValue1659.provider) + " TTS 已保存");
      } catch (scopeValue1661) {
        scopeValue15 = scopeValue1658;
        window.ttsConfig = scopeValue1658;
        console.error("Save TTS Config Error:", scopeValue1661);
        showToast(scopeValue1661?.message || "TTS 配置保存失败");
      } finally {
        scopeValue471.classList.remove("is-busy");
        scopeValue471.style.pointerEvents = "";
      }
    });
    const scopeValue472 = document.getElementById("test-vector-memory-connection-btn");
    scopeValue472 && scopeValue472.addEventListener("click", async () => {
      const scopeValue1662 = scopeValue472.innerHTML;
      scopeValue472.innerHTML = "<i class=\"fas fa-spinner fa-spin\"></i><div class=\"settings-text\" style=\"color:var(--blue-color);\">正在测试服务…</div>";
      scopeValue472.style.pointerEvents = "none";
      try {
        const scopeValue1663 = {
            ...scopeValue386(),
            enabled: true
          },
          scopeValue1664 = await window.imVectorMemory?.testConnection?.(scopeValue1663);
        if (!scopeValue1664?.ok) throw new Error(scopeValue1664?.error || "嵌入服务连接失败");
        showToast("嵌入服务连接成功");
      } catch (scopeValue1665) {
        console.error("Test Vector Memory Connection Error:", scopeValue1665);
        showToast(scopeValue1665?.message || "嵌入服务连接失败");
      } finally {
        scopeValue472.innerHTML = scopeValue1662;
        scopeValue472.style.pointerEvents = "";
      }
    });
    const scopeValue473 = document.getElementById("rebuild-vector-memory-index-btn");
    scopeValue473 && scopeValue473.addEventListener("click", async () => {
      const scopeValue1666 = scopeValue473.innerHTML;
      scopeValue473.innerHTML = "<i class=\"fas fa-spinner fa-spin\"></i><div class=\"settings-text\" style=\"color:var(--blue-color);\">正在构建索引…</div>";
      scopeValue473.style.pointerEvents = "none";
      try {
        const scopeValue1667 = await window.imVectorMemory?.rebuildAllMemoryIndexes?.();
        if (!scopeValue1667?.ok) throw new Error(scopeValue1667?.error || "索引构建失败");
        showToast("已同步 " + (scopeValue1667.count || 0) + " 条记忆");
      } catch (scopeValue1668) {
        console.error("Rebuild Vector Memory Index Error:", scopeValue1668);
        showToast(scopeValue1668?.message || "索引构建失败");
      } finally {
        scopeValue473.innerHTML = scopeValue1666;
        scopeValue473.style.pointerEvents = "";
        scopeValue389();
      }
    });
    UI.inputs.vectorMemoryProvider && UI.inputs.vectorMemoryProvider.addEventListener("change", () => {
      const scopeValue1669 = String(UI.inputs.vectorMemoryProvider.value || "siliconflow"),
        scopeValue1670 = scopeValue384(scopeValue1669);
      UI.inputs.vectorMemoryCustomEndpointRow && (UI.inputs.vectorMemoryCustomEndpointRow.hidden = scopeValue1669 !== "openai-compatible");
      scopeValue387({
        ...scopeValue386(),
        provider: scopeValue1669,
        model: scopeValue1670.defaultModel || ""
      });
    });
    UI.inputs.vectorMemoryModel && UI.inputs.vectorMemoryModel.addEventListener("change", () => {
      const scopeValue1671 = UI.inputs.vectorMemoryModel.value === "__custom__";
      UI.inputs.vectorMemoryCustomModelRow && (UI.inputs.vectorMemoryCustomModelRow.hidden = !scopeValue1671);
      if (scopeValue1671) UI.inputs.vectorMemoryCustomModel?.focus();
    });
    window.addEventListener("u2:vector-memory-status", scopeValue389);
    const scopeValue474 = document.getElementById("close-vector-memory-config-btn");
    scopeValue474 && scopeValue474.addEventListener("click", scopeValue51);
    const scopeValue475 = document.getElementById("confirm-vector-memory-config-btn");
    scopeValue475 && scopeValue475.addEventListener("click", async () => {
      const scopeValue1672 = scopeValue12;
      let scopeValue1673 = false;
      try {
        const scopeValue1674 = scopeValue386();
        if (scopeValue1674.enabled && !scopeValue1674.apiKey) throw new Error("启用向量记忆前请填写 API 密钥");
        if (scopeValue1674.enabled && !scopeValue1674.model) throw new Error("启用向量记忆前请选择嵌入模型");
        if (scopeValue1674.enabled && scopeValue1674.provider === "openai-compatible" && !scopeValue1674.endpoint) throw new Error("请填写兼容服务的嵌入接口地址");
        scopeValue475.classList.add("is-busy");
        scopeValue475.style.pointerEvents = "none";
        scopeValue12 = scopeValue1674;
        window.vectorMemoryConfig = scopeValue12;
        const scopeValue1675 = await scopeValue381();
        if (!scopeValue1675) throw new Error("向量记忆设置未能写入本地存储，请重试");
        scopeValue1673 = true;
        scopeValue389();
        if (scopeValue1674.enabled) {
          const scopeValue1676 = await window.imVectorMemory?.rebuildAllMemoryIndexes?.();
          if (!scopeValue1676?.ok) throw new Error(scopeValue1676?.error || "设置已保存，但索引同步失败");
        }
        scopeValue51();
        showToast(scopeValue1674.enabled ? "向量记忆已同步" : "向量记忆设置已保存");
      } catch (scopeValue1677) {
        !scopeValue1673 && (scopeValue12 = scopeValue1672, window.vectorMemoryConfig = scopeValue12);
        console.error("Save Vector Memory Config Error:", scopeValue1677);
        showToast(scopeValue1677?.message || "向量记忆设置保存失败");
      } finally {
        scopeValue475.classList.remove("is-busy");
        scopeValue475.style.pointerEvents = "";
      }
    });
    const scopeValue476 = document.getElementById("confirm-api-btn");
    scopeValue476 && scopeValue476.addEventListener("click", async () => {
      const scopeValue1678 = scopeValue11;
      try {
        const scopeValue1679 = scopeValue443(true);
        scopeValue476.classList.add("is-busy");
        scopeValue476.style.pointerEvents = "none";
        scopeValue20 = {
          ...scopeValue1679
        };
        scopeValue11 = {
          ...scopeValue1679
        };
        window.apiConfig = scopeValue11;
        scopeValue392(false);
        await scopeValue395(false);
        const scopeValue1680 = await scopeValue381();
        if (!scopeValue1680) throw new Error("API 设置未能写入本地存储，请重试");
        scopeValue18(), scopeValue427(), newScope46(), showToast("API 设置已保存");
      } catch (scopeValue1681) {
        scopeValue11 = scopeValue1678;
        window.apiConfig = scopeValue11;
        console.error("Save API Config Error:", scopeValue1681);
        showToast(scopeValue1681?.message || "API 设置保存失败");
      } finally {
        scopeValue476.classList.remove("is-busy");
        scopeValue476.style.pointerEvents = "";
      }
    });
    const scopeValue477 = document.getElementById("fetch-models-btn");
    scopeValue477 && scopeValue477.addEventListener("click", async () => {
      const scopeValue1682 = scopeValue477.innerHTML;
      scopeValue477.innerHTML = "<i class=\"fas fa-spinner fa-spin\"></i> Fetching...";
      scopeValue477.style.pointerEvents = "none";
      try {
        const scopeValue1683 = scopeValue443(false),
          scopeValue1684 = window.u2Api.resolveModelsEndpoint(scopeValue1683.endpoint),
          scopeValue1685 = window.u2Api.buildApiHeaders(scopeValue1683, {
            [window.u2Api.INTERNAL_SILENT_ERROR_HEADER]: "1"
          }),
          scopeValue1686 = await fetch(scopeValue1684, {
            method: "GET",
            headers: scopeValue1685,
            u2ApiTrace: {
              service: "models",
              source: "设置 › API 配置",
              purpose: "获取模型列表",
              provider: scopeValue1683.provider,
              tokenApplicable: false
            }
          });
        if (!scopeValue1686.ok) {
          const scopeValue1690 = await window.u2Api.readApiError(scopeValue1686);
          throw Object.assign(new Error(scopeValue1690.message), scopeValue1690);
        }
        const scopeValue1687 = await scopeValue1686.json(),
          scopeValue1688 = Array.isArray(scopeValue1687?.data) ? scopeValue1687.data : Array.isArray(scopeValue1687?.models) ? scopeValue1687.models : Array.isArray(scopeValue1687) ? scopeValue1687 : [],
          scopeValue1689 = scopeValue1683.provider === "gemini" ? scopeValue1688.filter(scopeValue1691 => {
            if (typeof scopeValue1691 === "string") return true;
            const scopeValue1692 = scopeValue1691?.supportedGenerationMethods;
            return !Array.isArray(scopeValue1692) || scopeValue1692.includes("generateContent");
          }) : scopeValue1688;
        scopeValue17 = Array.from(new Set(scopeValue1689.map(scopeValue1693 => typeof scopeValue1693 === "string" ? scopeValue1693 : scopeValue1693?.id || scopeValue1693?.name || "").map(scopeValue1694 => scopeValue1683.provider === "gemini" ? String(scopeValue1694 || "").replace(/^models\//i, "") : scopeValue1694).map(scopeValue1695 => String(scopeValue1695 || "").trim()).filter(Boolean))).sort((scopeValue1696, scopeValue1697) => scopeValue1696.localeCompare(scopeValue1697));
        if (scopeValue17.length) {
          const scopeValue1698 = UI.inputs.apiModel?.value || scopeValue20.model || "";
          await scopeValue381();
          scopeValue435();
          scopeValue436();
          scopeValue439(UI.inputs.apiModel, scopeValue1698);
          showToast("成功获取 " + scopeValue17.length + " 个模型");
        } else throw new Error("接口返回成功，但没有识别到模型列表；可直接手动填写模型名称");
      } catch (scopeValue1699) {
        console.error("Fetch Models Error:", scopeValue1699);
        if (!window.u2Api?.isRequestError?.(scopeValue1699) || !window.u2Api.reportError(scopeValue1699, {
          operation: "获取模型"
        })) showToast(scopeValue444(scopeValue1699, "获取模型失败"));
      } finally {
        scopeValue477.innerHTML = scopeValue1682;
        scopeValue477.style.pointerEvents = "";
      }
    });
    const scopeValue478 = document.getElementById("test-api-connection-btn");
    scopeValue478 && scopeValue478.addEventListener("click", async () => {
      const scopeValue1700 = scopeValue478.innerHTML;
      scopeValue478.innerHTML = "<i class=\"fas fa-spinner fa-spin\"></i> Testing...";
      scopeValue478.style.pointerEvents = "none";
      try {
        const scopeValue1701 = scopeValue443(true),
          scopeValue1702 = window.u2Api.resolveChatCompletionsEndpoint(scopeValue1701.endpoint),
          scopeValue1703 = window.u2Api.buildApiHeaders(scopeValue1701, {
            [window.u2Api.INTERNAL_SILENT_ERROR_HEADER]: "1"
          }),
          scopeValue1704 = {
            model: scopeValue1701.model,
            messages: [{
              role: "user",
              content: "Reply with OK."
            }],
            temperature: 0
          },
          scopeValue1705 = typeof window.u2Api.fetchChatCompletion === "function",
          scopeValue1706 = scopeValue1705 ? window.u2Api.fetchChatCompletion : fetch,
          scopeValue1707 = await scopeValue1706(scopeValue1702, {
            u2ApiTrace: {
              service: "test",
              source: "设置 › API 配置",
              purpose: "测试连接"
            },
            method: "POST",
            headers: scopeValue1703,
            apiConfig: scopeValue1701,
            body: scopeValue1705 ? scopeValue1704 : JSON.stringify(scopeValue1704)
          });
        if (!scopeValue1707.ok) {
          const scopeValue1710 = await window.u2Api.readApiError(scopeValue1707);
          throw Object.assign(new Error(scopeValue1710.message), scopeValue1710);
        }
        const scopeValue1708 = await scopeValue1707.json(),
          scopeValue1709 = Array.isArray(scopeValue1708?.choices) || Array.isArray(scopeValue1708?.output);
        if (!scopeValue1709) throw new Error("接口已连接，但返回格式不是兼容的聊天响应");
        showToast("连接测试成功");
      } catch (scopeValue1711) {
        console.error("Test API Connection Error:", scopeValue1711);
        if (!window.u2Api?.isRequestError?.(scopeValue1711) || !window.u2Api.reportError(scopeValue1711, {
          operation: "连接测试"
        })) showToast(scopeValue444(scopeValue1711, "连接测试失败"));
      } finally {
        scopeValue478.innerHTML = scopeValue1700;
        scopeValue478.style.pointerEvents = "";
      }
    });
    UI.inputs.apiModel && (UI.inputs.apiModel.addEventListener("input", scopeValue1712 => {
      scopeValue20.model = scopeValue1712.target.value;
    }), UI.inputs.apiModel.addEventListener("change", scopeValue1713 => {
      scopeValue20.model = scopeValue1713.target.value;
    }));
    UI.inputs.apiModelPickerToggle && UI.inputs.apiModelPickerToggle.addEventListener("click", () => {
      const scopeValue1714 = UI.inputs.apiModelPickerToggle.getAttribute("aria-expanded") === "true";
      scopeValue438(!scopeValue1714);
    });
    UI.inputs.apiModelSearch && UI.inputs.apiModelSearch.addEventListener("input", () => {
      scopeValue437(UI.inputs.apiModelSearch.value);
    });
    const scopeValue479 = document.getElementById("save-preset-btn"),
      scopeValue480 = document.getElementById("load-preset-btn"),
      scopeValue481 = document.getElementById("confirm-save-preset-btn"),
      scopeValue482 = document.getElementById("api-preset-search-input"),
      scopeValue483 = document.getElementById("api-preset-count"),
      scopeValue484 = document.querySelectorAll("[data-api-preset-close]");
    function scopeValue485() {
      const scopeValue1715 = Number.parseFloat(UI.inputs.apiTemp && UI.inputs.apiTemp.value),
        scopeValue1716 = Number.parseFloat(UI.inputs.apiFrequencyPenalty && UI.inputs.apiFrequencyPenalty.value);
      return {
        provider: window.u2Api.normalizeApiProvider(UI.inputs.apiProvider && UI.inputs.apiProvider.value || scopeValue20.provider),
        endpoint: String(UI.inputs.apiEndpoint && UI.inputs.apiEndpoint.value || "").trim(),
        apiKey: String(UI.inputs.apiKey && UI.inputs.apiKey.value || "").trim(),
        model: String(UI.inputs.apiModel && UI.inputs.apiModel.value || "").trim(),
        temperature: Number.isFinite(scopeValue1715) ? Math.max(0, Math.min(2, scopeValue1715)) : 0.7,
        frequencyPenalty: Number.isFinite(scopeValue1716) ? Math.max(-2, Math.min(2, scopeValue1716)) : 0,
        maxTokens: readMaxTokensInput(),
        streamEnabled: UI.inputs.apiStream?.checked === true
      };
    }
    async function scopeValue486(scopeValue1717, scopeValue1718 = {}) {
      if (!scopeValue1717 || typeof scopeValue1717 !== "object") return false;
      const scopeValue1719 = Number(scopeValue1717.temperature !== undefined ? scopeValue1717.temperature : scopeValue1717.temp),
        scopeValue1720 = Number(scopeValue1717.frequencyPenalty),
        scopeValue1721 = {
          provider: window.u2Api.normalizeApiProvider(scopeValue1717.provider || "openai-compatible"),
          endpoint: String(scopeValue1717.endpoint || "").trim(),
          apiKey: String(scopeValue1717.apiKey || "").trim(),
          model: String(scopeValue1717.model || "").trim(),
          temperature: Number.isFinite(scopeValue1719) ? Math.max(0, Math.min(2, scopeValue1719)) : 0.7,
          frequencyPenalty: Number.isFinite(scopeValue1720) ? Math.max(-2, Math.min(2, scopeValue1720)) : 0,
          maxTokens: window.u2Api.normalizeMaxTokens(scopeValue1717.maxTokens),
          streamEnabled: scopeValue1717.streamEnabled === true
        };
      scopeValue20 = {
        ...scopeValue1721
      };
      scopeValue11 = {
        ...scopeValue1721
      };
      window.apiConfig = scopeValue11;
      if (UI.inputs.apiProvider) UI.inputs.apiProvider.value = scopeValue1721.provider;
      scopeValue442({
        provider: scopeValue1721.provider
      });
      if (UI.inputs.apiEndpoint) UI.inputs.apiEndpoint.value = scopeValue1721.endpoint;
      if (UI.inputs.apiKey) UI.inputs.apiKey.value = scopeValue1721.apiKey;
      if (UI.inputs.apiModel) scopeValue439(UI.inputs.apiModel, scopeValue1721.model);
      if (UI.inputs.apiTemp) UI.inputs.apiTemp.value = String(scopeValue1721.temperature);
      if (UI.inputs.apiStream) UI.inputs.apiStream.checked = scopeValue1721.streamEnabled === true;
      if (UI.inputs.apiFrequencyPenalty) UI.inputs.apiFrequencyPenalty.value = String(scopeValue1721.frequencyPenalty);
      if (UI.inputs.apiMaxTokens) UI.inputs.apiMaxTokens.value = scopeValue1721.maxTokens ?? "";
      if (scopeValue1718.persist !== false) {
        const scopeValue1722 = await scopeValue381();
        if (!scopeValue1722) throw new Error("API 设置未能写入本地存储");
      }
      return scopeValue18(), scopeValue427(), true;
    }
    function scopeValue487(scopeValue1723) {
      const scopeValue1724 = {
        openai: "OpenAI 官方",
        deepseek: "DeepSeek",
        siliconflow: "硅基流动",
        gemini: "Gemini 官方",
        anthropic: "Claude 官方",
        "openai-compatible": "OpenAI 兼容"
      };
      return scopeValue1724[window.u2Api.normalizeApiProvider(scopeValue1723)] || "自定义服务商";
    }
    function scopeValue488(scopeValue1725, scopeValue1726) {
      if (!scopeValue483) return;
      scopeValue483.textContent = scopeValue1725 === scopeValue1726 ? scopeValue1726 + " 个预设" : scopeValue1725 + " / " + scopeValue1726 + " 个预设";
    }
    function scopeValue489() {
      if (!UI.lists.presets) return;
      const scopeValue1727 = Array.isArray(scopeValue16) ? scopeValue16 : [],
        scopeValue1728 = String(scopeValue482 && scopeValue482.value || "").trim().toLocaleLowerCase(),
        scopeValue1729 = scopeValue1727.filter(scopeValue1731 => {
          if (!scopeValue1728) return true;
          return [scopeValue1731.name, scopeValue1731.provider, scopeValue487(scopeValue1731.provider), scopeValue1731.model, scopeValue1731.endpoint].some(scopeValue1732 => String(scopeValue1732 || "").toLocaleLowerCase().includes(scopeValue1728));
        });
      UI.lists.presets.replaceChildren();
      scopeValue488(scopeValue1729.length, scopeValue1727.length);
      if (!scopeValue1727.length || !scopeValue1729.length) {
        const scopeValue1733 = document.createElement("div");
        scopeValue1733.className = "api-preset-empty";
        scopeValue1733.textContent = scopeValue1727.length ? "没有匹配的预设" : "暂无 API 预设";
        UI.lists.presets.appendChild(scopeValue1733);
        return;
      }
      const scopeValue1730 = document.createDocumentFragment();
      scopeValue1729.forEach(scopeValue1734 => {
        const scopeValue1735 = document.createElement("article");
        scopeValue1735.className = "api-preset-card";
        scopeValue1735.setAttribute("role", "listitem");
        const scopeValue1736 = document.createElement("button");
        scopeValue1736.type = "button";
        scopeValue1736.className = "api-preset-card-main";
        scopeValue1736.setAttribute("aria-label", "加载预设 " + (scopeValue1734.name || "未命名预设"));
        const scopeValue1737 = document.createElement("span");
        scopeValue1737.className = "api-preset-card-icon";
        scopeValue1737.innerHTML = "<i class=\"fas fa-server\" aria-hidden=\"true\"></i>";
        const scopeValue1738 = document.createElement("span");
        scopeValue1738.className = "api-preset-card-content";
        const scopeValue1739 = document.createElement("strong");
        scopeValue1739.className = "api-preset-card-name";
        scopeValue1739.textContent = String(scopeValue1734.name || "未命名预设");
        const scopeValue1740 = document.createElement("span");
        scopeValue1740.className = "api-preset-card-meta";
        scopeValue1740.textContent = scopeValue487(scopeValue1734.provider) + " · " + (scopeValue1734.model || "未选择模型");
        const scopeValue1741 = document.createElement("span");
        scopeValue1741.className = "api-preset-card-endpoint";
        scopeValue1741.textContent = scopeValue1734.endpoint || "未填写接口地址";
        scopeValue1738.append(scopeValue1739, scopeValue1740, scopeValue1741);
        const scopeValue1742 = document.createElement("i");
        scopeValue1742.className = "fas fa-chevron-right api-preset-card-arrow";
        scopeValue1742.setAttribute("aria-hidden", "true");
        scopeValue1736.append(scopeValue1737, scopeValue1738, scopeValue1742);
        scopeValue1736.addEventListener("click", async () => {
          scopeValue1736.disabled = true;
          try {
            await scopeValue486(scopeValue1734);
            closeView(UI.overlays.loadPreset);
            showToast("已应用预设“" + (scopeValue1734.name || "未命名预设") + "”");
          } catch (scopeValue1744) {
            console.error("Apply API preset error:", scopeValue1744);
            showToast(scopeValue1744 && scopeValue1744.message || "预设加载失败");
          } finally {
            scopeValue1736.disabled = false;
          }
        });
        const scopeValue1743 = document.createElement("button");
        scopeValue1743.type = "button";
        scopeValue1743.className = "api-preset-card-delete";
        scopeValue1743.setAttribute("aria-label", "删除预设 " + (scopeValue1734.name || "未命名预设"));
        scopeValue1743.innerHTML = "<i class=\"fas fa-trash-can\" aria-hidden=\"true\"></i>";
        scopeValue1743.addEventListener("click", scopeValue1745 => {
          scopeValue1745.stopPropagation();
          if (!window.confirm("删除预设“" + (scopeValue1734.name || "未命名预设") + "”？")) return;
          scopeValue16 = scopeValue16.filter(scopeValue1746 => scopeValue1746.id !== scopeValue1734.id);
          void scopeValue381().then(() => {
            scopeValue18();
            scopeValue427();
            scopeValue489();
            showToast("预设已删除");
          });
        });
        scopeValue1735.append(scopeValue1736, scopeValue1743);
        scopeValue1730.appendChild(scopeValue1735);
      });
      UI.lists.presets.appendChild(scopeValue1730);
    }
    scopeValue484.forEach(scopeValue1747 => scopeValue1747.addEventListener("click", () => {
      const scopeValue1748 = scopeValue1747.dataset.apiPresetClose === "save" ? UI.overlays.savePreset : UI.overlays.loadPreset;
      closeView(scopeValue1748);
    }));
    if (scopeValue482) scopeValue482.addEventListener("input", scopeValue489);
    scopeValue479 && scopeValue479.addEventListener("click", () => {
      if (UI.inputs.presetName) UI.inputs.presetName.value = "";
      openView(UI.overlays.savePreset);
      setTimeout(() => UI.inputs.presetName && UI.inputs.presetName.focus({
        preventScroll: true
      }), 80);
    });
    scopeValue481 && scopeValue481.addEventListener("click", async () => {
      const scopeValue1749 = String(UI.inputs.presetName && UI.inputs.presetName.value || "").trim() || "未命名预设";
      let scopeValue1750;
      try {
        scopeValue1750 = scopeValue485();
      } catch (scopeValue1751) {
        showToast(scopeValue1751.message);
        return;
      }
      const scopeValue1751 = scopeValue1749.toLocaleLowerCase(),
        scopeValue1752 = Array.isArray(scopeValue16) ? scopeValue16.findIndex(scopeValue1755 => String(scopeValue1755.name || "").trim().toLocaleLowerCase() === scopeValue1751) : -1,
        scopeValue1753 = scopeValue1752 >= 0 ? scopeValue16[scopeValue1752] : null,
        scopeValue1754 = {
          id: scopeValue1753 && scopeValue1753.id !== undefined ? scopeValue1753.id : "api-preset-" + Date.now(),
          name: scopeValue1749,
          ...scopeValue1750,
          temp: scopeValue1750.temperature
        };
      scopeValue16 = scopeValue1752 >= 0 ? scopeValue16.map((scopeValue1756, scopeValue1757) => scopeValue1757 === scopeValue1752 ? scopeValue1754 : scopeValue1756) : Array.isArray(scopeValue16) ? scopeValue16.concat(scopeValue1754) : [scopeValue1754];
      scopeValue481.disabled = true;
      try {
        const scopeValue1758 = await scopeValue381();
        if (!scopeValue1758) throw new Error("预设未能写入本地存储");
        scopeValue18();
        scopeValue427();
        closeView(UI.overlays.savePreset);
        showToast(scopeValue1753 ? "预设“" + scopeValue1749 + "”已更新" : "预设“" + scopeValue1749 + "”已保存");
      } catch (scopeValue1759) {
        console.error("Save API preset error:", scopeValue1759);
        showToast(scopeValue1759 && scopeValue1759.message || "预设保存失败");
      } finally {
        scopeValue481.disabled = false;
      }
    });
    UI.inputs.presetName && typeof window.mobileInputCompat?.register === "function" && window.mobileInputCompat.register({
      input: UI.inputs.presetName,
      onSend: () => scopeValue481?.click(),
      enterKeyHint: "done",
      blurAfterSend: false,
      restoreWindowScroll: false
    });
    scopeValue482 && typeof window.mobileInputCompat?.register === "function" && window.mobileInputCompat.register({
      input: scopeValue482,
      onSend: () => scopeValue489(),
      enterKeyHint: "search",
      blurAfterSend: false,
      restoreWindowScroll: false
    });
    typeof window.mobileInputCompat?.registerFocusScope === "function" && window.mobileInputCompat.registerFocusScope({
      selector: ".api-preset-overlay.active",
      priority: 30,
      preferFocusScope: true,
      resolveScrollContainer: (scopeValue1760, scopeValue1761) => scopeValue1761.querySelector(".api-preset-list"),
      scrollBehavior: "focus",
      viewportClassName: "u2-android-api-preset-viewport-sized",
      viewportHeightCssVariable: "--u2-android-api-preset-viewport-height",
      viewportTopCssVariable: "--u2-android-api-preset-viewport-top"
    });
    scopeValue480 && scopeValue480.addEventListener("click", () => {
      if (scopeValue482) scopeValue482.value = "";
      scopeValue489();
      openView(UI.overlays.loadPreset);
    });
    const scopeValue490 = document.getElementById("export-data-btn"),
      scopeValue491 = document.getElementById("import-data-btn"),
      scopeValue492 = document.getElementById("import-data-file"),
      scopeValue493 = document.getElementById("export-imessage-data-btn"),
      scopeValue494 = document.getElementById("export-char-lite-btn"),
      scopeValue495 = document.getElementById("char-lite-export-picker"),
      scopeValue496 = document.getElementById("char-lite-export-select"),
      scopeValue497 = document.getElementById("char-lite-export-confirm"),
      scopeValue498 = document.getElementById("import-char-lite-btn"),
      scopeValue499 = document.getElementById("import-char-lite-file"),
      scopeValue500 = document.getElementById("char-lite-change-file"),
      scopeValue501 = document.getElementById("import-imessage-data-btn"),
      scopeValue502 = document.getElementById("import-imessage-data-file"),
      scopeValue503 = document.getElementById("clear-data-btn");
    (function scopeValue1762() {
      const scopeValue1763 = document.getElementById("data-import-preview"),
        scopeValue1764 = document.getElementById("data-import-file-name"),
        scopeValue1765 = document.getElementById("data-import-version"),
        scopeValue1766 = document.getElementById("data-import-records"),
        scopeValue1767 = document.getElementById("data-import-assets"),
        scopeValue1768 = document.getElementById("data-import-size");
      let scopeValue1769 = null,
        scopeValue1770 = null;
      const scopeValue1771 = document.getElementById("imessage-import-preview"),
        scopeValue1772 = document.getElementById("imessage-import-file-name"),
        scopeValue1773 = document.getElementById("imessage-import-friends"),
        scopeValue1774 = document.getElementById("imessage-import-messages"),
        scopeValue1775 = document.getElementById("imessage-import-assets"),
        scopeValue1776 = document.getElementById("imessage-import-size");
      let scopeValue1777 = null,
        scopeValue1778 = null,
        scopeValue1779 = null,
        scopeValue1780 = null,
        scopeValue1781 = null,
        scopeValue1782 = null,
        scopeValue1783 = null,
        scopeValue1784 = null;
      const scopeValue1785 = document.getElementById("storage-health-dot"),
        scopeValue1786 = document.getElementById("storage-health-status"),
        scopeValue1787 = document.getElementById("storage-health-persistence"),
        scopeValue1788 = document.getElementById("storage-health-last-save"),
        scopeValue1789 = document.getElementById("storage-health-warning"),
        scopeValue1790 = document.getElementById("storage-health-compaction"),
        scopeValue1791 = document.getElementById("storage-health-image-compression"),
        scopeValue1792 = document.getElementById("storage-clean-cache-btn"),
        scopeValue1793 = document.getElementById("storage-deep-optimize-btn"),
        newScope1839 = document.getElementById("storage-clear-voice-btn"),
        newScope1840 = document.getElementById("storage-compress-images-btn"),
        scopeValue1794 = document.getElementById("storage-retry-btn"),
        scopeValue1795 = document.getElementById("storage-total-usage"),
        scopeValue1796 = document.getElementById("storage-summary-description"),
        scopeValue1797 = document.getElementById("storage-usage-bar"),
        scopeValue1798 = document.getElementById("storage-usage-legend"),
        scopeValue1799 = document.getElementById("storage-category-list");
      let scopeValue1800 = false;
      const scopeValue1801 = new Set(),
        scopeValue1802 = {
          iMessage: "#ff3b30",
          X: "#0a84ff",
          本地资源: "#ff9500",
          书库: "#af52de",
          应用状态: "#34c759",
          冗余历史: "#8e8e93"
        };
      function scopeValue1803(scopeValue1822) {
        scopeValue1822.preventDefault();
        scopeValue1822.stopImmediatePropagation();
      }
      function scopeValue1804(scopeValue1823, scopeValue1824) {
        if (!scopeValue1823) return;
        scopeValue1823.disabled = !!scopeValue1824, scopeValue1823.classList.toggle("is-busy", !!scopeValue1824), scopeValue1823.setAttribute("aria-busy", String(!!scopeValue1824));
      }
      function scopeValue1805(scopeValue1825) {
        return new Promise((scopeValue1826, scopeValue1827) => {
          const scopeValue1828 = new FileReader();
          scopeValue1828.onload = scopeValue1829 => scopeValue1826(scopeValue1829.target.result || "");
          scopeValue1828.onerror = () => scopeValue1827(scopeValue1828.error || new Error("File read failed"));
          scopeValue1828.readAsText(scopeValue1825);
        });
      }
      function scopeValue1806(scopeValue1830) {
        if (window.appStorage && typeof window.appStorage.formatBytes === "function") return window.appStorage.formatBytes(scopeValue1830);
        const scopeValue1831 = Math.max(0, Number(scopeValue1830) || 0);
        return scopeValue1831 < 1024 ? scopeValue1831 + " B" : (scopeValue1831 / 1024).toFixed(1) + " KB";
      }
      function scopeValue1807(scopeValue1832) {
        const scopeValue1833 = Number(scopeValue1832) || 0;
        if (!scopeValue1833) return "未知时间";
        try {
          return new Date(scopeValue1833).toLocaleString();
        } catch (scopeValue1834) {
          return "未知时间";
        }
      }
      function scopeValue1808(scopeValue1835) {
        return Object.entries(scopeValue1835?.["breakdown"]?.["logicalGroups"] || scopeValue1835?.["breakdown"]?.["groups"] || {}).map(([newScope1893, newScope1894]) => ({
          name: newScope1893,
          bytes: Math.max(0, Number(newScope1894?.["bytes"]) || 0),
          count: Math.max(0, Number(newScope1894?.["count"]) || 0)
        })).filter(scopeValue1838 => scopeValue1838.bytes > 0).sort((scopeValue1839, scopeValue1840) => scopeValue1840.bytes - scopeValue1839.bytes);
      }
      function scopeValue1809(scopeValue1841) {
        return scopeValue1802[scopeValue1841] || "#c7c7cc";
      }
      function scopeValue1810(scopeValue1842) {
        const scopeValue1843 = document.createElement("div"),
          scopeValue1844 = document.createElement("p"),
          scopeValue1845 = document.createElement("div"),
          scopeValue1846 = scopeValue1842?.breakdown?.assetBreakdown?.sources || [];
        scopeValue1843.id = "storage-asset-details";
        scopeValue1843.className = "storage-asset-details";
        scopeValue1843.hidden = !scopeValue1800;
        scopeValue1844.className = "storage-asset-note";
        scopeValue1844.textContent = "按资源记录的保存来源统计；同一文件只计一次。";
        scopeValue1845.className = "storage-asset-source-list";
        scopeValue1845.setAttribute("role", "list");
        scopeValue1846.forEach(scopeValue1847 => {
          const scopeValue1848 = document.createElement("div"),
            scopeValue1849 = document.createElement("button"),
            scopeValue1850 = document.createElement("span"),
            scopeValue1851 = document.createElement("strong"),
            scopeValue1852 = document.createElement("small"),
            scopeValue1853 = document.createElement("span"),
            scopeValue1854 = document.createElement("i"),
            scopeValue1855 = document.createElement("div"),
            scopeValue1856 = "storage-asset-types-" + scopeValue1847.key,
            scopeValue1857 = scopeValue1801.has(scopeValue1847.key);
          scopeValue1848.className = "storage-asset-source-item";
          scopeValue1848.setAttribute("role", "listitem");
          scopeValue1849.type = "button";
          scopeValue1849.className = "storage-asset-source-row";
          scopeValue1849.setAttribute("aria-expanded", String(scopeValue1857));
          scopeValue1849.setAttribute("aria-controls", scopeValue1856);
          scopeValue1850.className = "storage-category-copy";
          scopeValue1851.textContent = scopeValue1847.label;
          scopeValue1852.textContent = scopeValue1847.count + " 个文件";
          scopeValue1853.className = "storage-category-size";
          scopeValue1853.textContent = scopeValue1806(scopeValue1847.bytes);
          scopeValue1854.className = "fas fa-chevron-right storage-category-chevron";
          scopeValue1854.setAttribute("aria-hidden", "true");
          scopeValue1855.id = scopeValue1856;
          scopeValue1855.className = "storage-asset-types";
          scopeValue1855.setAttribute("role", "list");
          scopeValue1855.hidden = !scopeValue1857;
          (scopeValue1847.types || []).forEach(scopeValue1858 => {
            const scopeValue1859 = document.createElement("div"),
              scopeValue1860 = document.createElement("span"),
              scopeValue1861 = document.createElement("strong"),
              scopeValue1862 = document.createElement("small"),
              scopeValue1863 = document.createElement("span");
            scopeValue1859.className = "storage-asset-type-row";
            scopeValue1859.setAttribute("role", "listitem");
            scopeValue1860.className = "storage-category-copy";
            scopeValue1861.textContent = scopeValue1858.label;
            scopeValue1862.textContent = scopeValue1858.count + " 个文件";
            scopeValue1863.className = "storage-category-size";
            scopeValue1863.textContent = scopeValue1806(scopeValue1858.bytes);
            scopeValue1860.append(scopeValue1861, scopeValue1862);
            scopeValue1859.append(scopeValue1860, scopeValue1863);
            scopeValue1855.appendChild(scopeValue1859);
          });
          scopeValue1849.addEventListener("click", () => {
            const scopeValue1864 = !scopeValue1801.has(scopeValue1847.key);
            if (scopeValue1864) scopeValue1801.add(scopeValue1847.key);else scopeValue1801["delete"](scopeValue1847.key);
            scopeValue1849.setAttribute("aria-expanded", String(scopeValue1864));
            scopeValue1855.hidden = !scopeValue1864;
          });
          scopeValue1850.append(scopeValue1851, scopeValue1852);
          scopeValue1849.append(scopeValue1850, scopeValue1853, scopeValue1854);
          scopeValue1848.append(scopeValue1849, scopeValue1855);
          scopeValue1845.appendChild(scopeValue1848);
        });
        if (!scopeValue1846.length) {
          const scopeValue1865 = document.createElement("div");
          scopeValue1865.className = "storage-category-empty";
          scopeValue1865.textContent = "暂无可统计的本地资源";
          scopeValue1845.appendChild(scopeValue1865);
        }
        return scopeValue1843.append(scopeValue1844, scopeValue1845), scopeValue1843;
      }
      function scopeValue1811(scopeValue1866) {
        const scopeValue1867 = scopeValue1808(scopeValue1866),
          scopeValue1868 = Math.max(0, Number(scopeValue1866?.breakdown?.logicalBytes) || 0),
          scopeValue1869 = scopeValue1868 || scopeValue1867.reduce((scopeValue1870, scopeValue1871) => scopeValue1870 + scopeValue1871.bytes, 0);
        scopeValue1795 && (scopeValue1795.textContent = "已使用 " + scopeValue1806(scopeValue1869));
        scopeValue1796 && (scopeValue1796.textContent = scopeValue1869 > 0 ? "根据当前应用内保存的数据实时统计" : "当前还没有可统计的应用数据");
        scopeValue1797 && (scopeValue1797.replaceChildren(), scopeValue1867.forEach(scopeValue1872 => {
          const scopeValue1873 = document.createElement("span"),
            scopeValue1874 = scopeValue1869 > 0 ? scopeValue1872.bytes / scopeValue1869 * 100 : 0;
          scopeValue1873.className = "data-storage-usage-segment";
          scopeValue1873.style.width = scopeValue1874 + "%";
          scopeValue1873.style.backgroundColor = scopeValue1809(scopeValue1872.name);
          scopeValue1873.title = scopeValue1872.name + " " + scopeValue1806(scopeValue1872.bytes);
          scopeValue1797.appendChild(scopeValue1873);
        }), scopeValue1797.setAttribute("aria-label", scopeValue1867.length ? "应用数据已使用 " + scopeValue1806(scopeValue1869) + "，" + scopeValue1867.map(scopeValue1875 => scopeValue1875.name + " " + scopeValue1806(scopeValue1875.bytes)).join("，") : "当前没有可统计的应用数据"));
        scopeValue1798 && (scopeValue1798.replaceChildren(), scopeValue1867.forEach(scopeValue1876 => {
          const scopeValue1877 = document.createElement("span"),
            scopeValue1878 = document.createElement("i"),
            scopeValue1879 = document.createElement("span");
          scopeValue1877.className = "data-storage-legend-item";
          scopeValue1878.className = "data-storage-color-dot";
          scopeValue1878.style.backgroundColor = scopeValue1809(scopeValue1876.name);
          scopeValue1879.textContent = scopeValue1876.name + " " + scopeValue1806(scopeValue1876.bytes);
          scopeValue1877.append(scopeValue1878, scopeValue1879);
          scopeValue1798.appendChild(scopeValue1877);
        }));
        if (scopeValue1799) {
          scopeValue1799.replaceChildren();
          if (!scopeValue1867.length) {
            const scopeValue1880 = document.createElement("div");
            scopeValue1880.className = "storage-category-empty";
            scopeValue1880.textContent = "暂无可统计的应用数据";
            scopeValue1799.appendChild(scopeValue1880);
            return;
          }
          scopeValue1867.forEach(scopeValue1881 => {
            const scopeValue1882 = scopeValue1881.name === "本地资源",
              scopeValue1883 = document.createElement("div"),
              scopeValue1884 = document.createElement(scopeValue1882 ? "button" : "div"),
              scopeValue1885 = document.createElement("span"),
              scopeValue1886 = document.createElement("span"),
              scopeValue1887 = document.createElement("strong"),
              scopeValue1888 = document.createElement("small"),
              scopeValue1889 = document.createElement("span");
            scopeValue1883.className = "storage-category-item";
            scopeValue1883.setAttribute("role", "listitem");
            scopeValue1884.className = "storage-category-row";
            scopeValue1885.className = "storage-category-color-dot";
            scopeValue1885.style.backgroundColor = scopeValue1809(scopeValue1881.name);
            scopeValue1886.className = "storage-category-copy";
            scopeValue1887.textContent = scopeValue1881.name;
            scopeValue1888.textContent = scopeValue1881.count > 0 ? scopeValue1881.count + " " + (scopeValue1882 ? "个文件" : "条记录") : "应用数据";
            scopeValue1889.className = "storage-category-size";
            scopeValue1889.textContent = scopeValue1806(scopeValue1881.bytes);
            scopeValue1886.append(scopeValue1887, scopeValue1888);
            scopeValue1884.append(scopeValue1885, scopeValue1886, scopeValue1889);
            if (scopeValue1882) {
              const scopeValue1890 = document.createElement("i"),
                scopeValue1891 = scopeValue1810(scopeValue1866);
              scopeValue1884.type = "button";
              scopeValue1884.classList.add("storage-category-button");
              scopeValue1884.setAttribute("aria-expanded", String(scopeValue1800));
              scopeValue1884.setAttribute("aria-controls", scopeValue1891.id);
              scopeValue1890.className = "fas fa-chevron-right storage-category-chevron";
              scopeValue1890.setAttribute("aria-hidden", "true");
              scopeValue1884.appendChild(scopeValue1890);
              scopeValue1884.addEventListener("click", () => {
                scopeValue1800 = !scopeValue1800;
                scopeValue1884.setAttribute("aria-expanded", String(scopeValue1800));
                scopeValue1891.hidden = !scopeValue1800;
              });
              scopeValue1883.append(scopeValue1884, scopeValue1891);
            } else scopeValue1883.appendChild(scopeValue1884);
            scopeValue1799.appendChild(scopeValue1883);
          });
        }
      }
      async function scopeValue1812() {
        if (!window.appStorage?.getStorageHealth) return;
        const scopeValue1892 = await window.appStorage.getStorageHealth(),
          scopeValue1893 = {
            initializing: "正在初始化",
            saving: "保存中",
            saved: "已保存",
            error: "保存失败"
          };
        if (scopeValue1786) scopeValue1786.textContent = scopeValue1893[scopeValue1892.status] || "存储状态未知";
        scopeValue1785 && (scopeValue1785.classList.toggle("is-saved", scopeValue1892.status === "saved"), scopeValue1785.classList.toggle("is-error", scopeValue1892.status === "error"));
        scopeValue1787 && (scopeValue1787.textContent = "有效数据：" + scopeValue1806(scopeValue1892.breakdown?.logicalBytes) + " · 持久存储：" + (scopeValue1892.persisted ? "已启用" : "浏览器未授予"));
        scopeValue1788 && (scopeValue1788.textContent = "最后保存：" + scopeValue1807(scopeValue1892.lastCommitAt));
        if (scopeValue1789) {
          const scopeValue1894 = scopeValue1892.lastError ? "错误：" + scopeValue1892.lastError : "";
          scopeValue1789.textContent = scopeValue1894;
          scopeValue1789.hidden = !scopeValue1894;
        }
        if (scopeValue1794) scopeValue1794.hidden = scopeValue1892.status !== "error";
        scopeValue1811(scopeValue1892);
        if (scopeValue1790) {
          const scopeValue1895 = scopeValue1892.lastCacheCleanup;
          scopeValue1790.textContent = scopeValue1895?.["clearedAt"] ? "最近日常清理：" + scopeValue1807(scopeValue1895.clearedAt) + " · 有效数据减少 " + scopeValue1806(scopeValue1895.logicalBytesFreed) : "尚未执行日常清理";
        }
        const newScope1951 = document.getElementById("storage-health-optimization");
        if (newScope1951) newScope1951.textContent = scopeValue1892.lastOptimization?.["optimizedAt"] ? "最近深度整理：" + scopeValue1807(scopeValue1892.lastOptimization.optimizedAt) + " · " + scopeValue1892.lastOptimization.verifiedStores + " 类数据已校验" : "尚未执行深度整理";
        const newScope1952 = document.getElementById("storage-health-voice-cleanup");
        if (newScope1952) newScope1952.textContent = scopeValue1892.lastVoiceCleanup?.["clearedAt"] ? "最近语音清理：" + scopeValue1807(scopeValue1892.lastVoiceCleanup.clearedAt) + " · 清理 " + scopeValue1892.lastVoiceCleanup.count + " 项" : "";
        try {
          const newScope1955 = await window.appStorage.inspectVoiceCache(),
            newScope1956 = document.getElementById("storage-voice-summary");
          if (newScope1956) newScope1956.textContent = newScope1955.count ? newScope1955.count + " 项 · " + scopeValue1806(newScope1955.bytes) : "暂无可清理的语音缓存";
          if (newScope1839) newScope1839.disabled = !newScope1955.count && !newScope1955.recordCount;
        } catch (newScope1957) {
          const newScope1958 = document.getElementById("storage-voice-summary");
          if (newScope1958) newScope1958.textContent = "统计失败，可重试清理";
        }
        if (scopeValue1791) {
          const scopeValue1897 = scopeValue1892.lastImageCompression;
          scopeValue1791.textContent = scopeValue1897?.compressedAt ? "最近图片压缩：" + scopeValue1807(scopeValue1897.compressedAt) + "，压缩 " + (Number(scopeValue1897.compressed) || 0) + " 张，释放 " + scopeValue1806(scopeValue1897.bytesFreed) : "尚未执行图片压缩";
        }
      }
      function newScope1860(newScope1960, newScope1961) {
        let newScope1962 = document.getElementById("storage-maintenance-result");
        !newScope1962 && (newScope1962 = document.createElement("p"), newScope1962.id = "storage-maintenance-result", newScope1962.className = "storage-health-compaction", newScope1962.setAttribute("role", "status"), document.getElementById("storage-health-card").appendChild(newScope1962));
        const newScope1963 = (newScope1961.orphanAssetsRemoved || 0) + (newScope1961.checkpointRecordsDeleted || 0) + (newScope1961.recordsRewritten || 0) + (newScope1961.cachesDeleted || 0),
          newScope1964 = newScope1961.browserUsageAvailable && newScope1961.browserBytesFreed > 0 ? "浏览器报告空间减少 " + scopeValue1806(newScope1961.browserBytesFreed) : "浏览器暂未反馈空间变化";
        newScope1962.textContent = newScope1960 + "完成" + (newScope1961.verifiedStores ? "，已校验 " + newScope1961.verifiedStores + " 类数据" : "，处理 " + newScope1963 + " 项") + "。" + ("有效数据 " + scopeValue1806(newScope1961.logicalBytesBefore) + " → " + scopeValue1806(newScope1961.logicalBytesAfter) + "；" + newScope1964) + (newScope1961.cacheDeleteFailures ? "；" + newScope1961.cacheDeleteFailures + " 项页面缓存未能清理，可稍后重试" : ""), showToast(!newScope1961.verifiedStores && !newScope1963 && !newScope1961.logicalBytesFreed ? "没有需要清理的内容" : newScope1960 + "完成");
      }
      async function newScope1861(newScope1965, newScope1966) {
        if (!confirm(newScope1966 ? "将校验安全副本后进行深度整理，保留应用内容。整理期间请保持页面打开，继续吗？" : "将清理冗余数据、无引用资源及可重新下载的页面缓存，保留正在使用的内容和语音缓存。继续吗？")) return;
        scopeValue1804(newScope1965, true), scopeValue1815(newScope1966 ? "正在准备深度整理..." : "正在优化存储...");
        try {
          if (window.saveGlobalData) await window.saveGlobalData();
          if (window.imApp?.["saveState"]?.["dirty"] && window.imApp.flushGlobalSave && !(await window.imApp.flushGlobalSave({
            silent: true
          }))) throw new Error("聊天数据尚未完成保存");
          const newScope1967 = await window.appStorage[newScope1966 ? "optimizeStorage" : "clearSafeCache"]({
            progressCallback: scopeValue1816
          });
          scopeValue1817(), newScope1860(newScope1966 ? "深度整理" : "存储优化", newScope1967);
        } catch (newScope1968) {
          console.error("Storage maintenance failed:", newScope1968), scopeValue1817(), showToast(newScope1968?.["message"] || "操作未完成，请重试");
        } finally {
          scopeValue1804(newScope1965, false), await scopeValue1812();
        }
      }
      scopeValue1792?.["addEventListener"]("click", () => newScope1861(scopeValue1792, false)), scopeValue1793?.["addEventListener"]("click", () => newScope1861(scopeValue1793, true)), newScope1839?.["addEventListener"]("click", async () => {
        scopeValue1804(newScope1839, true), scopeValue1815("正在统计语音缓存...");
        try {
          const newScope1969 = await window.appStorage.inspectVoiceCache();
          scopeValue1817();
          if (!newScope1969.count && !newScope1969.recordCount) {
            showToast("暂无可清理的语音缓存");
            return;
          }
          if (!confirm("将清空 " + newScope1969.count + " 项生成的语音缓存（" + scopeValue1806(newScope1969.bytes) + "），保留文字、原始音频与收藏副本。再次播放需要重新生成，可能产生 TTS 调用费用。继续吗？")) return;
          scopeValue1815("正在清空语音缓存...");
          if (window.saveGlobalData) await window.saveGlobalData();
          if (window.imApp?.["saveState"]?.["dirty"] && window.imApp.flushGlobalSave && !(await window.imApp.flushGlobalSave({
            silent: true
          }))) throw new Error("聊天数据尚未完成保存");
          const newScope1970 = await window.appStorage.clearVoiceCache({
            progressCallback: scopeValue1816
          });
          scopeValue1816({
            message: "已清理 " + newScope1970.count + " 项语音缓存，保留 " + newScope1970.preservedSharedCount + " 项共享资源，正在重新载入...",
            progress: 100
          }), setTimeout(() => window.location.reload(), 1200);
        } catch (newScope1971) {
          scopeValue1817(), showToast(newScope1971?.["message"] || "语音缓存清理失败，请重试");
        } finally {
          scopeValue1804(newScope1839, false), await scopeValue1812();
        }
      }), newScope1840?.["addEventListener"]("click", async () => {
        scopeValue1804(newScope1840, true), scopeValue1815("正在扫描图片资源...");
        try {
          const scopeValue1901 = await window.appStorage.inspectImageCompression({
            scope: "all",
            profile: "balanced"
          });
          scopeValue1817();
          if (!scopeValue1901.eligible) {
            showToast("图片已经足够精简");
            return;
          }
          const scopeValue1902 = confirm("找到 " + scopeValue1901.eligible + " 张可压缩图片，当前共 " + scopeValue1806(scopeValue1901.bytes) + `。

` + `将按图片用途限制尺寸，并以约 82% 质量转换为 WebP；只有明显变小的图片才会替换。GIF、SVG、音频、字体和内置素材不会处理。

` + "压缩不可恢复，重要数据建议先导出备份。继续吗？");
          if (!scopeValue1902) return;
          scopeValue1815("正在准备压缩图片...");
          const scopeValue1903 = await window.appStorage.compressImageAssets({
            scope: "all",
            profile: "balanced",
            progressCallback: scopeValue1816
          });
          scopeValue1817();
          showToast("图片压缩完成：压缩 " + scopeValue1903.compressed + " 张，跳过 " + scopeValue1903.skipped + " 张" + ((scopeValue1903.failed ? "，失败 " + scopeValue1903.failed + " 张" : "") + "，") + (scopeValue1806(scopeValue1903.bytesBefore) + " → " + scopeValue1806(scopeValue1903.bytesAfter) + "，") + ("释放 " + scopeValue1806(scopeValue1903.bytesFreed)));
        } catch (scopeValue1904) {
          console.error("Image compression failed:", scopeValue1904);
          scopeValue1817();
          showToast(scopeValue1904?.message || "图片压缩中止，原图片仍被保留");
        } finally {
          scopeValue1804(newScope1840, false), await scopeValue1812();
        }
      });
      scopeValue1794?.addEventListener("click", async () => {
        scopeValue1794.disabled = true;
        try {
          const scopeValue1905 = await window.appStorage.flushPendingWrites();
          showToast(scopeValue1905 ? "待保存数据已完成写入" : "仍有数据保存失败");
        } finally {
          scopeValue1794.disabled = false;
          await scopeValue1812();
        }
      });
      let scopeValue1813 = null;
      const scopeValue1814 = () => !!scopeValue60 && (scopeValue60.classList.contains("active") || scopeValue60.style.display === "flex");
      window.appStorage?.subscribe?.(() => {
        if (!scopeValue1814()) return;
        clearTimeout(scopeValue1813);
        scopeValue1813 = setTimeout(() => scopeValue1812(), 180);
      });
      scopeValue59?.addEventListener("click", () => setTimeout(() => scopeValue1812(), 0));
      function scopeValue1815(scopeValue1906) {
        !scopeValue1782 && (scopeValue1782 = document.createElement("div"), scopeValue1782.className = "data-operation-overlay", scopeValue1782.setAttribute("data-ios-back-surface", ""), scopeValue1782.setAttribute("data-ios-back-block", ""), scopeValue1782.innerHTML = `
                        <div class="data-operation-card">
                            <i class="fas fa-spinner fa-spin data-operation-spinner"></i>
                            <div class="data-operation-text"></div>
                            <div class="data-operation-progress"><div></div></div>
                        </div>
                    `, scopeValue1783 = scopeValue1782.querySelector(".data-operation-text"), scopeValue1784 = scopeValue1782.querySelector(".data-operation-progress > div"), document.body.appendChild(scopeValue1782));
        scopeValue1783.textContent = scopeValue1906 || "处理中...";
        scopeValue1784.style.width = "0%";
        scopeValue1782.style.display = "flex";
      }
      function scopeValue1816(scopeValue1907 = {}) {
        if (scopeValue1783) scopeValue1783.textContent = scopeValue1907.message || "处理中...";
        if (scopeValue1784) {
          const scopeValue1908 = Math.max(0, Math.min(100, Number(scopeValue1907.progress) || 0));
          scopeValue1784.style.width = scopeValue1908 + "%";
        }
      }
      function scopeValue1817() {
        if (scopeValue1782) scopeValue1782.style.display = "none";
      }
      window.u2InitIosBackup?.({
        showOperation: scopeValue1815,
        updateOperation: scopeValue1816,
        hideOperation: scopeValue1817,
        refreshStorageHealth: scopeValue1812
      });
      function scopeValue1818(scopeValue1909, scopeValue1910) {
        if (!scopeValue1763) return;
        scopeValue1763.style.display = "block";
        if (scopeValue1764) scopeValue1764.textContent = scopeValue1909?.name || "未命名备份";
        if (scopeValue1765) scopeValue1765.textContent = "v" + (scopeValue1910.schemaVersion || "-");
        if (scopeValue1766) scopeValue1766.textContent = String(scopeValue1910.recordCount || 0);
        if (scopeValue1767) scopeValue1767.textContent = String(scopeValue1910.assetCount || 0);
        if (scopeValue1768) scopeValue1768.textContent = scopeValue1806(scopeValue1910.approximateBytes || scopeValue1909?.size || 0);
      }
      function scopeValue1819() {
        scopeValue1769 = null;
        scopeValue1770 = null;
        if (scopeValue1763) scopeValue1763.style.display = "none";
      }
      window.u2InitIosBackup?.({
        showOperation: scopeValue1815,
        updateOperation: scopeValue1816,
        hideOperation: scopeValue1817,
        refreshStorageHealth: scopeValue1812
      });
      let newScope1869 = null;
      const newScope1870 = document.getElementById("app-export-picker"),
        newScope1871 = document.getElementById("app-export-list"),
        newScope1872 = document.getElementById("app-export-confirm"),
        newScope1873 = document.getElementById("app-import-list"),
        newScope1874 = newScope1982 => Array.from(newScope1982?.["querySelectorAll"]("input:checked") || []).map(newScope1983 => newScope1983.value);
      function newScope1875(newScope1984, newScope1985, newScope1986) {
        newScope1984.replaceChildren(), newScope1985.forEach(newScope1987 => {
          const newScope1988 = document.createElement("label");
          newScope1988.className = "data-backup-app-option";
          const newScope1989 = document.createElement("input");
          newScope1989.type = "checkbox", newScope1989.value = newScope1987.id, newScope1989.checked = newScope1986.includes(newScope1987.id);
          const newScope1990 = document.createElement("span"),
            newScope1991 = document.createElement("strong");
          newScope1991.textContent = newScope1987.name;
          const newScope1992 = document.createElement("small");
          newScope1992.textContent = newScope1987.recordCount == null ? newScope1987.description : newScope1987.recordCount + " 条记录 · " + newScope1987.assetCount + " 个资源 · " + scopeValue1806(newScope1987.approximateBytes), newScope1990.append(newScope1991, newScope1992), newScope1988.append(newScope1989, newScope1990), newScope1984.appendChild(newScope1988);
        });
      }
      function newScope1876() {
        const newScope1993 = newScope1874(newScope1871).length;
        document.getElementById("app-export-count").textContent = "已选 " + newScope1993 + " 个应用", newScope1872.disabled = newScope1993 === 0;
      }
      newScope1871?.["addEventListener"]("change", newScope1876);
      for (const [newScope1994, newScope1995] of [["app-export-select-all", true], ["app-export-clear", false]]) {
        document.getElementById(newScope1994)?.["addEventListener"]("click", () => {
          newScope1871.querySelectorAll("input").forEach(newScope1996 => {
            newScope1996.checked = newScope1995;
          }), newScope1876();
        });
      }
      newScope1873?.["addEventListener"]("change", () => {
        scopeValue501.disabled = newScope1874(newScope1873).length === 0;
      });
      function newScope1877(newScope1997, newScope1998) {
        if (!scopeValue1771) return;
        scopeValue1771.style.display = "block", newScope1869 = newScope1998, newScope1875(newScope1873, newScope1998.apps, newScope1998.appIds);
        if (scopeValue1772) scopeValue1772.textContent = newScope1997?.["name"] || "未命名应用备份";
        if (scopeValue1773) scopeValue1773.textContent = String(newScope1998.apps.length);
        if (scopeValue1774) scopeValue1774.textContent = String(newScope1998.recordCount || 0);
        if (scopeValue1775) scopeValue1775.textContent = String(newScope1998.assetCount || 0);
        if (scopeValue1776) scopeValue1776.textContent = scopeValue1806(newScope1997?.["size"] || newScope1998.approximateBytes || 0);
      }
      function newScope1878() {
        scopeValue1777 = null, scopeValue1778 = null, newScope1869 = null;
        if (scopeValue1771) scopeValue1771.style.display = "none";
        if (scopeValue501) scopeValue501.disabled = false;
      }
      document.getElementById("app-import-change-file")?.["addEventListener"]("click", () => {
        newScope1878(), scopeValue502.click();
      }), document.getElementById("data-import-change-file")?.["addEventListener"]("click", () => {
        scopeValue1819(), scopeValue492.click();
      });
      scopeValue490 && scopeValue490.addEventListener("click", async scopeValue1913 => {
        scopeValue1803(scopeValue1913);
        try {
          scopeValue1804(scopeValue490, true);
          scopeValue1815("正在准备导出数据...");
          const scopeValue1914 = await window.appStorage.exportAllData(scopeValue1816);
          scopeValue1816({
            message: "准备下载...",
            progress: 99
          });
          scopeValue1817();
          const scopeValue1915 = await window.u2ExportFile({
            blob: scopeValue1914,
            fileName: "u2phone_backup_" + new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19) + ".json",
            title: "U2 完整数据备份"
          });
          if (scopeValue1915 === "shared" || scopeValue1915 === "downloaded") showToast("数据导出成功");else {
            if (scopeValue1915 === "failed") showToast("导出失败，请重试");
          }
        } catch (scopeValue1916) {
          console.error("Export failed:", scopeValue1916);
          scopeValue1817();
          showToast("导出失败，请查看控制台");
        } finally {
          scopeValue1804(scopeValue490, false);
        }
      }, true);
      scopeValue491 && scopeValue492 && (scopeValue491.addEventListener("click", scopeValue1917 => {
        scopeValue1803(scopeValue1917);
        if (!scopeValue1769 || !scopeValue1770) {
          scopeValue492.click();
          return;
        }
        if (!confirm("将用「" + scopeValue1770.name + "」完整替换当前手机里的应用数据和配置。此操作不可撤销，确定继续？")) return;
        (async () => {
          try {
            scopeValue1804(scopeValue491, true);
            scopeValue1815("正在导入备份...");
            const scopeValue1918 = await window.appStorage.importAllData(scopeValue1769, scopeValue1816),
              scopeValue1919 = scopeValue1918?.stickers,
              scopeValue1920 = Math.max(0, Number(scopeValue1919?.skippedItems) || 0),
              scopeValue1921 = scopeValue1920 > 0 ? "导入成功，已跳过 " + scopeValue1920 + " 张无法恢复的表情，正在重启..." : "导入成功，正在重启...";
            scopeValue1816({
              message: scopeValue1921,
              progress: 100
            });
            setTimeout(() => window.location.reload(), 1200);
          } catch (scopeValue1922) {
            console.error("Import failed:", scopeValue1922);
            scopeValue1817();
            showToast(scopeValue1922?.message || "导入失败，当前数据未替换");
            scopeValue1804(scopeValue491, false);
          }
        })();
      }, true), scopeValue492.addEventListener("change", async scopeValue1923 => {
        scopeValue1923.stopImmediatePropagation();
        const scopeValue1924 = scopeValue1923.target.files[0];
        if (!scopeValue1924) return;
        try {
          scopeValue1804(scopeValue491, true);
          scopeValue1815("正在读取备份文件...");
          const scopeValue1925 = await scopeValue1805(scopeValue1924);
          scopeValue1816({
            message: "正在校验备份...",
            progress: 30
          });
          const scopeValue1926 = JSON.parse(scopeValue1925),
            scopeValue1927 = window.appStorage.inspectBackupPayload(scopeValue1926);
          scopeValue1769 = scopeValue1926, scopeValue1770 = scopeValue1924, scopeValue1818(scopeValue1924, scopeValue1927), scopeValue1817(), showToast("备份已校验，请再次点导入图标");
        } catch (scopeValue1928) {
          console.error("Import preview failed:", scopeValue1928);
          scopeValue1819();
          scopeValue1817();
          showToast(scopeValue1928?.message || "文件格式错误或备份已损坏");
        } finally {
          scopeValue1804(scopeValue491, false);
          scopeValue1923.target.value = "";
        }
      }, true));
      scopeValue493 && (scopeValue493.setAttribute("aria-controls", "app-export-picker"), scopeValue493.setAttribute("aria-expanded", "false"), scopeValue493.addEventListener("click", scopeValue1929 => {
        scopeValue1803(scopeValue1929);
        if (!newScope1871.childElementCount) newScope1875(newScope1871, window.appStorage.listBackupApps(), ["imessage"]);
        newScope1870.hidden = !newScope1870.hidden, scopeValue493.setAttribute("aria-expanded", String(!newScope1870.hidden)), newScope1876();
      }, true));
      newScope1872?.["addEventListener"]("click", async () => {
        const newScope2016 = newScope1874(newScope1871);
        if (!newScope2016.length) return;
        scopeValue1804(newScope1872, true), scopeValue1815("正在准备应用备份...");
        try {
          if (window.saveGlobalData) await window.saveGlobalData();
          if (window.imApp?.["saveState"]?.["dirty"] && window.imApp.flushGlobalSave && !(await window.imApp.flushGlobalSave({
            silent: true
          }))) throw new Error("聊天数据尚未完成保存");
          const scopeValue1930 = await window.appStorage.exportAppBackup(newScope2016, scopeValue1816);
          scopeValue1817();
          const scopeValue1931 = await window.u2ExportFile({
            blob: scopeValue1930,
            fileName: "u2phone_apps_backup_" + new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19) + ".json",
            title: "U2 应用备份"
          });
          if (scopeValue1931 === "shared" || scopeValue1931 === "downloaded") showToast("已导出 " + newScope2016.length + " 个应用");else {
            if (scopeValue1931 === "failed") showToast("应用备份导出失败，请重试");
          }
        } catch (scopeValue1932) {
          console.error("App backup export failed:", scopeValue1932), scopeValue1817(), showToast(scopeValue1932?.["message"] || "应用备份导出失败");
        } finally {
          scopeValue1804(newScope1872, false), newScope1876();
        }
      });
      scopeValue494 && scopeValue495 && scopeValue496 && scopeValue497 && (scopeValue494.addEventListener("click", async scopeValue1933 => {
        scopeValue1803(scopeValue1933);
        if (!scopeValue495.hidden) {
          scopeValue495.hidden = true;
          scopeValue494.setAttribute("aria-expanded", "false");
          return;
        }
        try {
          scopeValue1804(scopeValue494, true);
          const scopeValue1934 = await window.appStorage.listCharLiteExportChoices();
          if (!scopeValue1934.length) {
            showToast("没有可导出的 Char");
            return;
          }
          scopeValue496.replaceChildren();
          const scopeValue1935 = document.createElement("option");
          scopeValue1935.value = "";
          scopeValue1935.textContent = "全部 Char（" + scopeValue1934.length + "）";
          scopeValue496.appendChild(scopeValue1935);
          const scopeValue1936 = new Map();
          scopeValue1934.forEach(({
            name: scopeValue1938
          }) => scopeValue1936.set(scopeValue1938, (scopeValue1936.get(scopeValue1938) || 0) + 1));
          const scopeValue1937 = new Map();
          scopeValue1934.forEach(({
            id: scopeValue1939,
            name: scopeValue1940
          }) => {
            const scopeValue1941 = document.createElement("option");
            scopeValue1941.value = scopeValue1939;
            const scopeValue1942 = (scopeValue1937.get(scopeValue1940) || 0) + 1;
            scopeValue1937.set(scopeValue1940, scopeValue1942);
            scopeValue1941.textContent = scopeValue1936.get(scopeValue1940) > 1 ? scopeValue1940 + "（第 " + scopeValue1942 + " 位）" : scopeValue1940;
            scopeValue496.appendChild(scopeValue1941);
          });
          scopeValue495.hidden = false;
          scopeValue494.setAttribute("aria-expanded", "true");
        } catch (scopeValue1943) {
          console.error("Failed to list Char export choices:", scopeValue1943);
          showToast(scopeValue1943?.message || "读取 Char 列表失败");
        } finally {
          scopeValue1804(scopeValue494, false);
        }
      }, true), scopeValue497.addEventListener("click", async scopeValue1944 => {
        scopeValue1803(scopeValue1944);
        try {
          scopeValue1804(scopeValue497, true);
          scopeValue1815("正在准备轻量备份...");
          if (window.imApp?.saveState?.dirty && window.imApp.flushGlobalSave) {
            if (!(await window.imApp.flushGlobalSave({
              silent: true
            }))) throw new Error("待保存的聊天数据未能完成保存");
          }
          const scopeValue1945 = scopeValue496.value || null,
            scopeValue1946 = await window.appStorage.exportCharChatMemoryLite(scopeValue1945, scopeValue1816);
          scopeValue1817();
          const scopeValue1947 = scopeValue496.selectedOptions?.[0]?.textContent || "char",
            scopeValue1948 = scopeValue1945 ? scopeValue1947.replace(/[\\/:*?"<>|]/g, "_").replace(/\s+/g, "_").slice(0, 48) || "char" : "all_char",
            scopeValue1949 = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19),
            scopeValue1950 = await window.u2ExportFile({
              blob: scopeValue1946,
              fileName: "u2phone_char_chat_memory_" + scopeValue1948 + "_" + scopeValue1949 + ".json",
              title: "U2 Char 轻量备份"
            });
          if (scopeValue1950 === "shared" || scopeValue1950 === "downloaded") showToast("轻量备份已导出");else {
            if (scopeValue1950 === "failed") showToast("轻量导出失败，请重试");
          }
        } catch (scopeValue1951) {
          console.error("Char lite export failed:", scopeValue1951);
          scopeValue1817();
          showToast(scopeValue1951?.message || "轻量导出失败");
        } finally {
          scopeValue1804(scopeValue497, false);
        }
      }, true));
      if (scopeValue498 && scopeValue499) {
        const scopeValue1952 = document.getElementById("char-lite-import-preview"),
          scopeValue1953 = document.getElementById("char-lite-import-file-name"),
          scopeValue1954 = document.getElementById("char-lite-import-names"),
          scopeValue1955 = document.getElementById("char-lite-import-chars"),
          scopeValue1956 = document.getElementById("char-lite-import-messages"),
          scopeValue1957 = document.getElementById("char-lite-import-offline-sessions"),
          newScope2045 = document.getElementById("char-lite-import-size"),
          scopeValue1958 = document.getElementById("char-lite-import-note"),
          newScope2047 = () => {
            scopeValue1779 = null, scopeValue1780 = null, scopeValue1781 = null;
            if (scopeValue1952) scopeValue1952.style.display = "none";
          };
        scopeValue498.addEventListener("click", scopeValue1959 => {
          scopeValue1803(scopeValue1959);
          if (!scopeValue1779 || !scopeValue1780) {
            scopeValue499.click();
            return;
          }
          const scopeValue1960 = scopeValue1781,
            newScope2050 = scopeValue1960.formatVersion >= 2 ? "聊天、记忆、人设与线下记录" : "聊天与记忆";
          if (!confirm("将用“" + scopeValue1780.name + "”替换 " + scopeValue1960.charCount + " 个对应 Char 的" + newScope2050 + "（" + scopeValue1960.messageCount + " 条消息）。已有 Char 的其他资料保留；备份中没有的 Char 会创建基础联系人。确定导入？")) return;
          (async () => {
            try {
              scopeValue1804(scopeValue498, true);
              scopeValue1815("正在导入轻量备份...");
              if (window.imApp?.saveState?.dirty && window.imApp.flushGlobalSave) {
                if (!(await window.imApp.flushGlobalSave({
                  silent: true
                }))) throw new Error("待保存的聊天数据未能完成保存");
              }
              const scopeValue1961 = await window.appStorage.importCharChatMemoryLite(scopeValue1779, scopeValue1816);
              scopeValue1816({
                message: "已恢复 " + scopeValue1961.charCount + " 个 Char、" + scopeValue1961.messageCount + " 条消息，正在重启...",
                progress: 100
              }), newScope2047(), setTimeout(() => window.location.reload(), 1200);
            } catch (scopeValue1962) {
              console.error("Char lite import failed:", scopeValue1962);
              scopeValue1817();
              showToast(scopeValue1962?.message || "轻量备份导入失败，当前数据未修改");
              scopeValue1804(scopeValue498, false);
            }
          })();
        }, true);
        scopeValue499.addEventListener("change", async scopeValue1963 => {
          scopeValue1963.stopImmediatePropagation();
          const scopeValue1964 = scopeValue1963.target.files[0];
          if (!scopeValue1964) return;
          newScope2047();
          try {
            scopeValue1804(scopeValue498, true);
            scopeValue1815("正在读取轻量备份...");
            const scopeValue1965 = JSON.parse(await scopeValue1805(scopeValue1964)),
              scopeValue1966 = window.appStorage.inspectCharChatMemoryLitePayload(scopeValue1965);
            scopeValue1779 = scopeValue1965;
            scopeValue1780 = scopeValue1964;
            scopeValue1781 = scopeValue1966;
            if (scopeValue1953) scopeValue1953.textContent = scopeValue1964.name;
            if (scopeValue1954) {
              const scopeValue1967 = new Map();
              scopeValue1965.chars.forEach(scopeValue1969 => {
                const scopeValue1970 = scopeValue1969.name.trim() || "未命名 Char";
                scopeValue1967.set(scopeValue1970, (scopeValue1967.get(scopeValue1970) || 0) + 1);
              });
              const scopeValue1968 = new Map();
              scopeValue1954.textContent = scopeValue1965.chars.map(scopeValue1971 => {
                const scopeValue1972 = scopeValue1971.name.trim() || "未命名 Char",
                  scopeValue1973 = (scopeValue1968.get(scopeValue1972) || 0) + 1;
                return scopeValue1968.set(scopeValue1972, scopeValue1973), scopeValue1967.get(scopeValue1972) > 1 ? scopeValue1972 + "（第 " + scopeValue1973 + " 位）" : scopeValue1972;
              }).join("、");
            }
            if (scopeValue1955) scopeValue1955.textContent = String(scopeValue1966.charCount);
            if (scopeValue1956) scopeValue1956.textContent = String(scopeValue1966.messageCount);
            if (scopeValue1957) scopeValue1957.textContent = scopeValue1966.formatVersion >= 2 ? String(scopeValue1966.offlineSessionCount) : "旧版";
            if (scopeValue1958) scopeValue1958.textContent = scopeValue1966.formatVersion >= 2 ? "再次点导入图标确认替换所列 Char 的聊天、记忆、人设与线下记录；其他资料保留。" : "旧版备份仅替换所列 Char 的聊天与记忆；现有人设和线下记录保留。";
            if (newScope2045) newScope2045.textContent = scopeValue1806(scopeValue1964.size);
            if (scopeValue1952) scopeValue1952.style.display = "block";
            scopeValue1817(), showToast("轻量备份已校验，请再次点导入图标");
          } catch (scopeValue1974) {
            newScope2047(), scopeValue1817(), showToast(scopeValue1974?.["message"] || "轻量备份文件无效");
          } finally {
            scopeValue1804(scopeValue498, false);
            scopeValue1963.target.value = "";
          }
        }, true), scopeValue500?.["addEventListener"]("click", scopeValue1975 => {
          scopeValue1803(scopeValue1975), newScope2047(), scopeValue499.click();
        }, true);
      }
      scopeValue501 && scopeValue502 && (scopeValue501.addEventListener("click", scopeValue1976 => {
        scopeValue1803(scopeValue1976);
        if (!scopeValue1777 || !scopeValue1778) {
          scopeValue502.click();
          return;
        }
        const newScope2067 = newScope1874(newScope1873);
        if (!newScope2067.length) return;
        const newScope2068 = newScope1869.apps.filter(newScope2069 => newScope2067.includes(newScope2069.id)).map(newScope2070 => newScope2070.name).join("、");
        if (!confirm("将用“" + scopeValue1778.name + "”替换以下应用的数据：" + newScope2068 + "。空备份也会清空对应应用内容。未选择的应用及公共配置保留。确定继续？")) return;
        (async () => {
          try {
            scopeValue1804(scopeValue501, true), scopeValue1815("正在恢复所选应用...");
            if (window.saveGlobalData) await window.saveGlobalData();
            if (window.imApp?.["saveState"]?.["dirty"] && window.imApp.flushGlobalSave && !(await window.imApp.flushGlobalSave({
              silent: true
            }))) throw new Error("聊天数据尚未完成保存");
            const newScope2071 = await window.appStorage.importAppBackup(scopeValue1777, {
              appIds: newScope2067,
              progressCallback: scopeValue1816
            });
            scopeValue1816({
              message: "已恢复 " + newScope2071.appIds.length + " 个应用，正在重启...",
              progress: 100
            }), setTimeout(() => window.location.reload(), 1200);
          } catch (scopeValue1987) {
            console.error("iMessage import failed:", scopeValue1987), scopeValue1817(), showToast(scopeValue1987?.["message"] || "应用备份导入失败，当前数据未修改"), scopeValue1804(scopeValue501, false);
          }
        })();
      }, true), scopeValue502.addEventListener("change", async newScope2073 => {
        newScope2073.stopImmediatePropagation();
        const newScope2074 = newScope2073.target.files[0];
        if (!newScope2074) return;
        try {
          scopeValue1804(scopeValue501, true), scopeValue1815("正在读取应用备份文件...");
          const newScope2075 = await scopeValue1805(newScope2074);
          scopeValue1816({
            message: "正在校验应用备份...",
            progress: 30
          });
          const newScope2076 = JSON.parse(newScope2075),
            newScope2077 = window.appStorage.inspectAppBackupPayload(newScope2076);
          scopeValue1777 = newScope2076, scopeValue1778 = newScope2074, newScope1877(newScope2074, newScope2077), scopeValue1817(), showToast("应用备份已校验，勾选应用后再次点导入图标");
        } catch (newScope2078) {
          console.error("iMessage import preview failed:", newScope2078), newScope1878(), scopeValue1817(), showToast(newScope2078?.["message"] || "应用备份格式错误或已损坏");
        } finally {
          scopeValue1804(scopeValue501, false), newScope2073.target.value = "";
        }
      }, true)), scopeValue503 && scopeValue503.addEventListener("click", async newScope2079 => {
        scopeValue1803(newScope2079);
        if (!confirm("确定清空所有应用数据和配置吗？此操作不可恢复，系统将重启到默认状态。")) return;
        try {
          scopeValue1804(scopeValue503, true);
          scopeValue1815("正在清空应用数据...");
          await window.appStorage.clearAllPersistentData();
          await window.u2ApiConsole?.clear().catch(() => {});
          scopeValue1816({
            message: "已清空，正在重启...",
            progress: 100
          }), setTimeout(() => window.location.reload(), 1200);
        } catch (newScope2080) {
          console.error("Clear data failed:", newScope2080), scopeValue1817(), showToast("清空数据失败"), scopeValue1804(scopeValue503, false);
        }
      }, true);
    })();
  });
})();
