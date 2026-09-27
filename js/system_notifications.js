(function () {
  const STORAGE_KEY = "u2_systemNotificationSettings",
    SOUND_ASSET_ID = "u2_system_notification_sound",
    defaults = {
      enabled: false,
      permission: typeof Notification !== "undefined" ? Notification.permission : "unsupported",
      soundAssetId: "",
      soundFileName: "",
      soundMimeType: "",
      soundDataUrl: ""
    };
  let settings = normalize(loadSettings()),
    storageHydrated = false,
    activeSound = null,
    value = null;
  function handleAction_4() {
    return window.u2NativeBridge?.isNativeAndroid?.() === true;
  }
  function handleAction_5() {
    const value_24 = window.navigator || (typeof navigator !== "undefined" ? navigator : null),
      value_25 = /iPhone|iPad|iPod/i.test(value_24?.userAgent || "") || value_24?.platform === "MacIntel" && Number(value_24?.maxTouchPoints) > 1;
    return value_25 && (value_24?.standalone === true || window.matchMedia?.("(display-mode: standalone)")?.matches === true);
  }
  async function resolveCustomSoundUrl_2() {
    const serviceWorker_26 = window.navigator?.serviceWorker;
    if (!serviceWorker_26?.register) throw new Error("iOS Home Screen notifications require Service Worker support");
    return !value && (value = serviceWorker_26.register("notification-sw.js", {
      scope: "./"
    }).then(value_27 => {
      if (typeof value_27.showNotification !== "function") throw new Error("Service Worker notifications are unavailable");
      return value_27;
    })["catch"](value_28 => {
      value = null;
      throw value_28;
    })), value;
  }
  function normalize(value_2) {
    const safe = value_2 && typeof value_2 === "object" ? value_2 : {},
      permission_3 = handleAction_8();
    return {
      enabled: !!safe.enabled && permission_3 !== "unsupported",
      permission: permission_3,
      soundAssetId: typeof safe.soundAssetId === "string" ? safe.soundAssetId : "",
      soundFileName: typeof safe.soundFileName === "string" ? safe.soundFileName.slice(0, 180) : "",
      soundMimeType: typeof safe.soundMimeType === "string" ? safe.soundMimeType.slice(0, 100) : "",
      soundDataUrl: typeof safe.soundDataUrl === "string" && /^data:(?:audio\/|application\/octet-stream)/i.test(safe.soundDataUrl) ? safe.soundDataUrl : ""
    };
  }
  function getSettingsSnapshot(extra = {}) {
    return {
      enabled: !!settings.enabled,
      permission: settings.permission,
      soundAssetId: settings.soundAssetId,
      soundFileName: settings.soundFileName,
      soundMimeType: settings.soundMimeType,
      hasCustomSound: !!(settings.soundAssetId || settings.soundDataUrl),
      ...extra
    };
  }
  function handleAction_8() {
    if (handleAction_4()) return window.u2NativeBridge.getNotificationPermission?.() || "default";
    if (typeof Notification === "undefined") return "unsupported";
    return Notification.permission;
  }
  function loadSettings() {
    try {
      if (window.StorageManager && typeof window.StorageManager.load === "function") return window.StorageManager.load(STORAGE_KEY, defaults);
      return defaults;
    } catch (error_2) {
      return console.warn("[system_notifications] Failed to load settings:", error_2), defaults;
    }
  }
  async function saveSettings() {
    try {
      if (window.appStorage && typeof window.appStorage.saveLegacyKey === "function") return await window.appStorage.saveLegacyKey(STORAGE_KEY, settings), true;
      if (window.StorageManager && typeof window.StorageManager.save === "function") return window.StorageManager.save(STORAGE_KEY, settings) !== false;
    } catch (error_3) {
      console.warn("[system_notifications] Failed to save settings:", error_3);
    }
    return false;
  }
  function notifySettingsChanged(reason_2) {
    window.dispatchEvent(new CustomEvent("u2:system-notification-settings-changed", {
      detail: getSettingsSnapshot({
        reason: reason_2
      })
    }));
  }
  async function hydrateSettingsFromStorage() {
    if (storageHydrated) return {
      ...settings
    };
    storageHydrated = true;
    const loaded = loadSettings(),
      normalized = normalize(loaded),
      needsReconcile = !!loaded?.enabled !== normalized.enabled || loaded?.permission !== normalized.permission;
    settings = normalized;
    if (needsReconcile) await saveSettings();
    return notifySettingsChanged("storage-ready"), getSettingsSnapshot();
  }
  function getSettings_2() {
    const permission_2 = handleAction_8(),
      permissionChanged = settings.permission !== permission_2;
    return settings.permission = permission_2, permissionChanged && (void saveSettings(), notifySettingsChanged("permission")), getSettingsSnapshot();
  }
  async function updateSettings_2(value_40 = {}) {
    const enabled_2 = !!value_40.enabled;
    if (!handleAction_4() && handleAction_8() === "unsupported") return settings.enabled = false, settings.permission = "unsupported", await saveSettings(), notifySettingsChanged("settings"), getSettingsSnapshot({
      unsupported: true
    });
    let permission_4 = handleAction_8();
    if (enabled_2 && permission_4 === "default") try {
      permission_4 = handleAction_4() ? await window.u2NativeBridge.requestNotificationPermission() : await Notification.requestPermission();
    } catch (error_4) {
      console.warn("[system_notifications] Failed to request permission:", error_4);
      permission_4 = handleAction_8();
    }
    if (enabled_2 && permission_4 === "granted" && handleAction_5()) try {
      await resolveCustomSoundUrl_2();
    } catch (value_44) {
      return console.warn("[system_notifications] iOS notification registration failed:", value_44), settings.enabled = false, settings.permission = permission_4, await saveSettings(), notifySettingsChanged("settings"), getSettingsSnapshot({
        unsupported: true
      });
    }
    settings.enabled = enabled_2;
    settings.permission = permission_4;
    if (!settings.enabled) stopNotificationSound_2();
    return await saveSettings(), notifySettingsChanged("settings"), getSettingsSnapshot();
  }
  async function setCustomSound_2(sound = {}) {
    const dataUrl_2 = typeof sound.dataUrl === "string" ? sound.dataUrl : "";
    if (!/^data:(?:audio\/|application\/octet-stream)/i.test(dataUrl_2)) throw new TypeError("Invalid audio data URL");
    const soundFileName_2 = String(sound.fileName || "自定义提示音").slice(0, 180),
      mimeType_2 = String(sound.mimeType || dataUrl_2.slice(5, dataUrl_2.indexOf(";")) || "audio/*").slice(0, 100);
    let soundAssetId_2 = "",
      soundDataUrl_2 = dataUrl_2;
    if (window.appStorage && typeof window.appStorage.saveAssetFromDataUrl === "function") {
      soundAssetId_2 = await window.appStorage.saveAssetFromDataUrl(SOUND_ASSET_ID, dataUrl_2, {
        ownerType: "system_notification",
        ownerId: "global",
        field: "sound",
        mimeType: mimeType_2
      });
      soundDataUrl_2 = "";
      const value_50 = await window.appStorage.getAssetUrl?.(soundAssetId_2);
      if (!value_50) {
        console.warn("[system_notifications] Custom sound asset could not be resolved after upload");
        throw new Error("提示音资源保存后无法读取");
      }
      if (!handleAction_17(value_50)) throw new Error("提示音资源无法预加载");
    }
    stopNotificationSound_2();
    settings.soundAssetId = soundAssetId_2 || "";
    settings.soundFileName = soundFileName_2;
    settings.soundMimeType = mimeType_2;
    settings.soundDataUrl = soundDataUrl_2;
    if (soundDataUrl_2 && !handleAction_17(soundDataUrl_2)) throw new Error("提示音资源无法预加载");
    return await saveSettings(), notifySettingsChanged("sound"), getSettingsSnapshot();
  }
  async function clearCustomSound_2() {
    const assetId = settings.soundAssetId;
    stopNotificationSound_2();
    settings.soundAssetId = "";
    settings.soundFileName = "";
    settings.soundMimeType = "";
    settings.soundDataUrl = "";
    await saveSettings();
    if (assetId && window.appStorage && typeof window.appStorage.deleteAsset === "function") try {
      await window.appStorage.deleteAsset(assetId);
    } catch (error_5) {
      console.warn("[system_notifications] Failed to delete custom sound asset:", error_5);
    }
    return notifySettingsChanged("sound"), getSettingsSnapshot();
  }
  async function resolveCustomSoundUrl() {
    if (settings.soundAssetId && window.appStorage && typeof window.appStorage.getAssetUrl === "function") return window.appStorage.getAssetUrl(settings.soundAssetId);
    return settings.soundDataUrl || "";
  }
  function handleAction_17(value_53) {
    if (!value_53) return console.warn("[system_notifications] Cannot preload custom sound: empty resource URL"), false;
    if (typeof window.Audio !== "function") return console.warn("[system_notifications] Cannot preload custom sound: Audio is unavailable"), false;
    try {
      const value_54 = new window.Audio(value_53);
      return value_54.preload = "auto", value_54.load?.(), true;
    } catch (value_55) {
      return console.warn("[system_notifications] Failed to preload custom sound:", value_55), false;
    }
  }
  function stopNotificationSound_2() {
    if (!activeSound) return;
    try {
      activeSound.pause();
      activeSound.currentTime = 0;
    } catch (error) {}
    activeSound = null;
  }
  async function playNotificationSound_2() {
    if (!(settings.soundAssetId || settings.soundDataUrl) || typeof window.Audio !== "function") return false;
    try {
      const soundUrl = await resolveCustomSoundUrl();
      if (!soundUrl) return console.warn("[system_notifications] Custom sound asset is missing"), false;
      return stopNotificationSound_2(), activeSound = new window.Audio(soundUrl), activeSound.preload = "auto", activeSound.playsInline = true, activeSound.addEventListener?.("ended", () => {
        activeSound = null;
      }, {
        once: true
      }), await activeSound.play(), true;
    } catch (error_6) {
      return console.warn("[system_notifications] Failed to play custom sound:", error_6), false;
    }
  }
  function normalize_2(value_58 = {}) {
    const friend_2 = value_58.friend || {},
      message_2 = value_58.message || {};
    return message_2.speaker || message_2.senderName || friend_2.nickname || friend_2.realName || friend_2.realname || friend_2.name || "iMessage";
  }
  function normalize_3(value_61 = {}) {
    const message_3 = value_61.message || {},
      preview = window.imApp?.getFriendMessagePreview ? window.imApp.getFriendMessagePreview(message_3) : message_3.content || message_3.text || message_3.message || "";
    return String(preview || "新消息").replace(/\s+/g, " ").trim().slice(0, 180);
  }
  async function handleAction_22(value_64, value_65, title_2, body_2, tag_2, data_2) {
    let enabled_70 = false;
    value_65.hasCustomSound && (enabled_70 = await playNotificationSound_2());
    const options_2 = {
      body: body_2,
      tag: tag_2,
      renotify: true,
      silent: value_65.hasCustomSound && enabled_70,
      icon: value_64.friend?.avatarUrl || "assets/moren-thumb.jpg",
      badge: "assets/moren-thumb.jpg",
      data: data_2
    };
    try {
      if (handleAction_4()) return await window.u2NativeBridge.showNotification({
        title: title_2,
        body: body_2,
        tag: tag_2,
        data: options_2.data,
        silent: options_2.silent
      }), true;
      if (handleAction_5()) {
        const soundUrl_2 = await resolveCustomSoundUrl_2();
        return await soundUrl_2.showNotification(title_2, {
          body: options_2.body,
          tag: options_2.tag,
          icon: options_2.icon,
          badge: options_2.badge,
          data: options_2.data
        }), true;
      }
      const notification = new Notification(title_2, options_2);
      return notification.onclick = () => {
        window.focus();
        notification.close();
      }, true;
    } catch (error_7) {
      return console.warn("[system_notifications] Failed to show notification:", error_7), false;
    }
  }
  function notifyIncomingMessage_2(loaded_2 = {}) {
    const current = getSettings_2();
    if (!current.enabled || current.permission !== "granted") return false;
    const value_76 = loaded_2.friend || {},
      normalized_2 = normalize_2(loaded_2),
      normalized_3 = normalize_3(loaded_2),
      value_79 = loaded_2.message?.id ? "imessage-" + loaded_2.message.id : "imessage-" + (value_76.id || Date.now()),
      options_80 = {
        app: "imessage",
        friendId: value_76.id || null,
        messageId: loaded_2.message?.id || null
      };
    return void handleAction_22(loaded_2, current, normalized_2, normalized_3, value_79, options_80), true;
  }
  window.u2SystemNotifications = {
    getSettings: getSettings_2,
    updateSettings: updateSettings_2,
    setCustomSound: setCustomSound_2,
    clearCustomSound: clearCustomSound_2,
    playNotificationSound: playNotificationSound_2,
    stopNotificationSound: stopNotificationSound_2,
    notifyIncomingMessage: notifyIncomingMessage_2
  };
  window.addEventListener("u2-storage-ready", hydrateSettingsFromStorage, {
    once: true
  });
  window.addEventListener("u2:native-notification-permission-changed", value_81 => {
    const permission_5 = String(value_81?.detail?.permission || handleAction_8());
    settings.permission = permission_5;
    void saveSettings();
    notifySettingsChanged("native-permission");
  });
  window.appStorage?.ready && typeof window.appStorage.ready.then === "function" && window.appStorage.ready.then(() => {
    if (!storageHydrated) return hydrateSettingsFromStorage();
    return undefined;
  })["catch"](error_8 => {
    console.warn("[system_notifications] Storage hydration failed:", error_8);
  });
})();
