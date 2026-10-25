(function () {
  const apk119Value1 = "u2_systemNotificationSettings",
    apk119Value2 = "u2_system_notification_sound",
    apk119Value3 = {
      enabled: false,
      permission: typeof Notification !== "undefined" ? Notification.permission : "unsupported",
      soundAssetId: "",
      soundFileName: "",
      soundMimeType: "",
      soundDataUrl: ""
    };
  let apk119Value4 = apk119Value11(apk119Value14()),
    apk119Value5 = false,
    apk119Value6 = null,
    apk119Value7 = null;
  function apk119Value8() {
    return window.u2NativeBridge?.["isNativeAndroid"]?.() === true || window.u2NativeBridge?.["isNativeIOS"]?.() === true;
  }
  function apk119Value9() {
    if (apk119Value8()) return false;
    const apk119Value31 = window.navigator || (typeof navigator !== "undefined" ? navigator : null),
      apk119Value32 = /iPhone|iPad|iPod/i.test(apk119Value31?.["userAgent"] || "") || apk119Value31?.["platform"] === "MacIntel" && Number(apk119Value31?.["maxTouchPoints"]) > 1;
    return apk119Value32 && (apk119Value31?.["standalone"] === true || window.matchMedia?.("(display-mode: standalone)")?.["matches"] === true);
  }
  async function apk119Value10() {
    const apk119Value33 = window.navigator?.["serviceWorker"];
    if (!apk119Value33?.["register"]) throw new Error("Mobile notifications require Service Worker support");
    return !apk119Value7 && (apk119Value7 = apk119Value33.register("notification-sw.js", {
      scope: "./"
    }).then(async apk119Value34 => {
      if (typeof apk119Value34.showNotification !== "function") throw new Error("Service Worker notifications are unavailable");
      const apk119Value35 = apk119Value34.installing || apk119Value34.waiting;
      return !apk119Value34.active && apk119Value35 && apk119Value35.state !== "activated" && (await new Promise((apk119Value36, apk119Value37) => {
        const apk119Value38 = setTimeout(() => apk119Value39(new Error("Notification worker activation timed out")), 5000),
          apk119Value39 = apk119Value41 => {
            clearTimeout(apk119Value38), apk119Value35.removeEventListener("statechange", apk119Value40), apk119Value41 ? apk119Value37(apk119Value41) : apk119Value36();
          },
          apk119Value40 = () => {
            if (apk119Value35.state === "activated") apk119Value39();else {
              if (apk119Value35.state === "redundant") apk119Value39(new Error("Notification worker activation failed"));
            }
          };
        apk119Value35.addEventListener("statechange", apk119Value40), apk119Value40();
      })), apk119Value34;
    })["catch"](apk119Value42 => {
      apk119Value7 = null;
      throw apk119Value42;
    })), apk119Value7;
  }
  function apk119Value11(apk119Value43) {
    const apk119Value44 = apk119Value43 && typeof apk119Value43 === "object" ? apk119Value43 : {},
      apk119Value45 = apk119Value13();
    return {
      enabled: !!apk119Value44.enabled && apk119Value45 !== "unsupported" && (!apk119Value8() || apk119Value45 !== "denied"),
      permission: apk119Value45,
      soundAssetId: typeof apk119Value44.soundAssetId === "string" ? apk119Value44.soundAssetId : "",
      soundFileName: typeof apk119Value44.soundFileName === "string" ? apk119Value44.soundFileName.slice(0, 180) : "",
      soundMimeType: typeof apk119Value44.soundMimeType === "string" ? apk119Value44.soundMimeType.slice(0, 100) : "",
      soundDataUrl: typeof apk119Value44.soundDataUrl === "string" && /^data:(?:audio\/|application\/octet-stream)/i.test(apk119Value44.soundDataUrl) ? apk119Value44.soundDataUrl : ""
    };
  }
  function apk119Value12(apk119Value46 = {}) {
    return {
      enabled: !!apk119Value4.enabled,
      permission: apk119Value4.permission,
      soundAssetId: apk119Value4.soundAssetId,
      soundFileName: apk119Value4.soundFileName,
      soundMimeType: apk119Value4.soundMimeType,
      hasCustomSound: !!(apk119Value4.soundAssetId || apk119Value4.soundDataUrl),
      ...apk119Value46
    };
  }
  function apk119Value13() {
    if (apk119Value8()) return window.u2NativeBridge.getNotificationPermission?.() || "default";
    if (typeof Notification === "undefined") return "unsupported";
    return Notification.permission;
  }
  function apk119Value14() {
    try {
      if (window.StorageManager && typeof window.StorageManager.load === "function") return window.StorageManager.load(apk119Value1, apk119Value3);
      return apk119Value3;
    } catch (apk119Value47) {
      return console.warn("[system_notifications] Failed to load settings:", apk119Value47), apk119Value3;
    }
  }
  async function apk119Value15() {
    try {
      if (window.appStorage && typeof window.appStorage.saveLegacyKey === "function") return await window.appStorage.saveLegacyKey(apk119Value1, apk119Value4), true;
      if (window.StorageManager && typeof window.StorageManager.save === "function") return window.StorageManager.save(apk119Value1, apk119Value4) !== false;
    } catch (apk119Value48) {
      console.warn("[system_notifications] Failed to save settings:", apk119Value48);
    }
    return false;
  }
  function apk119Value16(apk119Value49) {
    window.dispatchEvent(new CustomEvent("u2:system-notification-settings-changed", {
      detail: apk119Value12({
        reason: apk119Value49
      })
    }));
  }
  async function apk119Value17() {
    if (apk119Value5) return {
      ...apk119Value4
    };
    apk119Value5 = true;
    const apk119Value50 = apk119Value14(),
      apk119Value51 = apk119Value11(apk119Value50),
      apk119Value52 = !!apk119Value50?.["enabled"] !== apk119Value51.enabled || apk119Value50?.["permission"] !== apk119Value51.permission;
    apk119Value4 = apk119Value51;
    if (apk119Value52) await apk119Value15();
    return apk119Value16("storage-ready"), apk119Value12();
  }
  function apk119Value18() {
    const apk119Value53 = apk119Value13(),
      apk119Value54 = apk119Value4.permission !== apk119Value53;
    apk119Value4.permission = apk119Value53;
    if (apk119Value8() && apk119Value53 === "denied") apk119Value4.enabled = false;
    if (apk119Value54) {
      if (apk119Value5) void apk119Value15();
      apk119Value16("permission");
    }
    return apk119Value12();
  }
  async function apk119Value19(apk119Value55 = {}) {
    const apk119Value56 = !!apk119Value55.enabled;
    if (apk119Value8()) await window.u2NativeBridge.ready?.();
    if (!apk119Value8() && apk119Value13() === "unsupported") return apk119Value4.enabled = false, apk119Value4.permission = "unsupported", await apk119Value15(), apk119Value16("settings"), apk119Value12({
      unsupported: true
    });
    let apk119Value57 = apk119Value13();
    if (apk119Value56 && apk119Value57 === "default") try {
      apk119Value57 = apk119Value8() ? await window.u2NativeBridge.requestNotificationPermission() : await Notification.requestPermission();
    } catch (apk119Value58) {
      console.warn("[system_notifications] Failed to request permission:", apk119Value58), apk119Value57 = apk119Value13();
    }
    if (apk119Value56 && apk119Value57 === "granted" && apk119Value9()) try {
      await apk119Value10();
    } catch (apk119Value59) {
      return console.warn("[system_notifications] iOS notification registration failed:", apk119Value59), apk119Value4.enabled = false, apk119Value4.permission = apk119Value57, await apk119Value15(), apk119Value16("settings"), apk119Value12({
        unsupported: true
      });
    }
    apk119Value4.enabled = apk119Value56 && (!apk119Value8() || apk119Value57 === "granted"), apk119Value4.permission = apk119Value57;
    if (!apk119Value4.enabled) apk119Value24();
    return await apk119Value15(), apk119Value16("settings"), apk119Value12();
  }
  async function apk119Value20(apk119Value60 = {}) {
    const apk119Value61 = typeof apk119Value60.dataUrl === "string" ? apk119Value60.dataUrl : "";
    if (!/^data:(?:audio\/|application\/octet-stream)/i.test(apk119Value61)) throw new TypeError("Invalid audio data URL");
    const apk119Value62 = String(apk119Value60.fileName || "自定义提示音").slice(0, 180),
      apk119Value63 = String(apk119Value60.mimeType || apk119Value61.slice(5, apk119Value61.indexOf(";")) || "audio/*").slice(0, 100);
    let apk119Value64 = "",
      apk119Value65 = apk119Value61;
    if (window.appStorage && typeof window.appStorage.saveAssetFromDataUrl === "function") {
      apk119Value64 = await window.appStorage.saveAssetFromDataUrl(apk119Value2, apk119Value61, {
        ownerType: "system_notification",
        ownerId: "global",
        field: "sound",
        mimeType: apk119Value63
      }), apk119Value65 = "";
      const apk119Value66 = await window.appStorage.getAssetUrl?.(apk119Value64);
      if (!apk119Value66) {
        console.warn("[system_notifications] Custom sound asset could not be resolved after upload");
        throw new Error("提示音资源保存后无法读取");
      }
      if (!apk119Value23(apk119Value66)) throw new Error("提示音资源无法预加载");
    }
    apk119Value24(), apk119Value4.soundAssetId = apk119Value64 || "", apk119Value4.soundFileName = apk119Value62, apk119Value4.soundMimeType = apk119Value63, apk119Value4.soundDataUrl = apk119Value65;
    if (apk119Value65 && !apk119Value23(apk119Value65)) throw new Error("提示音资源无法预加载");
    return await apk119Value15(), apk119Value16("sound"), apk119Value12();
  }
  async function apk119Value21() {
    const apk119Value67 = apk119Value4.soundAssetId;
    apk119Value24(), apk119Value4.soundAssetId = "", apk119Value4.soundFileName = "", apk119Value4.soundMimeType = "", apk119Value4.soundDataUrl = "", await apk119Value15();
    if (apk119Value67 && window.appStorage && typeof window.appStorage.deleteAsset === "function") try {
      await window.appStorage.deleteAsset(apk119Value67);
    } catch (apk119Value68) {
      console.warn("[system_notifications] Failed to delete custom sound asset:", apk119Value68);
    }
    return apk119Value16("sound"), apk119Value12();
  }
  async function apk119Value22() {
    if (apk119Value4.soundAssetId && window.appStorage && typeof window.appStorage.getAssetUrl === "function") return window.appStorage.getAssetUrl(apk119Value4.soundAssetId);
    return apk119Value4.soundDataUrl || "";
  }
  function apk119Value23(apk119Value69) {
    if (!apk119Value69) return console.warn("[system_notifications] Cannot preload custom sound: empty resource URL"), false;
    if (typeof window.Audio !== "function") return console.warn("[system_notifications] Cannot preload custom sound: Audio is unavailable"), false;
    try {
      const apk119Value70 = new window.Audio(apk119Value69);
      return apk119Value70.preload = "auto", apk119Value70.load?.(), true;
    } catch (apk119Value71) {
      return console.warn("[system_notifications] Failed to preload custom sound:", apk119Value71), false;
    }
  }
  function apk119Value24() {
    if (!apk119Value6) return;
    try {
      apk119Value6.pause(), apk119Value6.currentTime = 0;
    } catch (apk119Value72) {}
    apk119Value6 = null;
  }
  async function apk119Value25() {
    if (!(apk119Value4.soundAssetId || apk119Value4.soundDataUrl) || typeof window.Audio !== "function") return false;
    try {
      const apk119Value73 = await apk119Value22();
      if (!apk119Value73) return console.warn("[system_notifications] Custom sound asset is missing"), false;
      return apk119Value24(), apk119Value6 = new window.Audio(apk119Value73), apk119Value6.preload = "auto", apk119Value6.playsInline = true, apk119Value6.addEventListener?.("ended", () => {
        apk119Value6 = null;
      }, {
        once: true
      }), await apk119Value6.play(), true;
    } catch (apk119Value74) {
      return console.warn("[system_notifications] Failed to play custom sound:", apk119Value74), false;
    }
  }
  function apk119Value26(apk119Value75 = {}) {
    const apk119Value76 = apk119Value75.friend || {},
      apk119Value77 = apk119Value75.message || {};
    return apk119Value77.speaker || apk119Value77.senderName || apk119Value76.nickname || apk119Value76.realName || apk119Value76.realname || apk119Value76.name || "iMessage";
  }
  function apk119Value27(apk119Value78 = {}) {
    const apk119Value79 = apk119Value78.message || {},
      apk119Value80 = window.imApp?.["getFriendMessagePreview"] ? window.imApp.getFriendMessagePreview(apk119Value79) : apk119Value79.content || apk119Value79.text || apk119Value79.message || "";
    return String(apk119Value80 || "新消息").replace(/\s+/g, " ").trim().slice(0, 180);
  }
  async function apk119Value28(apk119Value81) {
    let apk119Value82 = apk119Value81?.["avatarUrl"] || "";
    if (!apk119Value82 && apk119Value81?.["avatarAssetId"] && window.appStorage?.["getAssetUrl"]) try {
      apk119Value82 = (await window.appStorage.getAssetUrl(apk119Value81.avatarAssetId)) || "";
    } catch (apk119Value83) {
      console.warn("[system_notifications] Avatar unavailable:", apk119Value83);
    }
    return /^(?:javascript|file):/i.test(String(apk119Value82).trim()) ? "" : String(apk119Value82);
  }
  async function apk119Value29(apk119Value84, apk119Value85, apk119Value86, apk119Value87, apk119Value88, apk119Value89) {
    const apk119Value90 = apk119Value84.friend || {},
      apk119Value91 = await apk119Value28(apk119Value90);
    let apk119Value92 = false;
    apk119Value85.hasCustomSound && (apk119Value92 = await apk119Value25());
    const apk119Value93 = {
      body: apk119Value87,
      tag: apk119Value88,
      renotify: true,
      silent: apk119Value85.hasCustomSound && apk119Value92,
      icon: apk119Value91 || "assets/moren-thumb.jpg",
      badge: "assets/moren-thumb.jpg",
      data: apk119Value89
    };
    try {
      if (apk119Value8()) {
        const apk119Value95 = await window.u2NativeBridge.showNotification({
          title: apk119Value86,
          body: apk119Value87,
          tag: apk119Value88,
          senderId: ["group", "official"].includes(apk119Value90.type) ? "" : String(apk119Value90.id || ""),
          senderName: apk119Value86,
          avatarUrl: apk119Value91,
          data: apk119Value93.data,
          silent: apk119Value93.silent
        });
        if (apk119Value95) return true;
        return window.showBannerNotification?.(apk119Value84.friend || {}, apk119Value87, {
          force: true
        }), false;
      }
      if (window.navigator?.["serviceWorker"]?.["register"]) try {
        const apk119Value96 = await apk119Value10();
        return await apk119Value96.showNotification(apk119Value86, apk119Value93), true;
      } catch (apk119Value97) {
        if (apk119Value9()) throw apk119Value97;
        console.warn("[system_notifications] Worker notification unavailable:", apk119Value97);
      }
      const apk119Value94 = new Notification(apk119Value86, apk119Value93);
      return apk119Value94.onclick = () => {
        window.focus(), apk119Value94.close();
      }, true;
    } catch (apk119Value98) {
      return console.warn("[system_notifications] Failed to show notification:", apk119Value98), apk119Value8() && window.showBannerNotification?.(apk119Value84.friend || {}, apk119Value87, {
        force: true
      }), false;
    }
  }
  function apk119Value30(apk119Value99 = {}) {
    const apk119Value100 = apk119Value18();
    if (!apk119Value100.enabled || apk119Value100.permission !== "granted") return false;
    const apk119Value101 = apk119Value99.friend || {},
      apk119Value102 = apk119Value26(apk119Value99),
      apk119Value103 = apk119Value27(apk119Value99),
      apk119Value104 = apk119Value99.message?.["id"] ? "imessage-" + apk119Value99.message.id : "imessage-" + (apk119Value101.id || Date.now()),
      apk119Value105 = {
        app: "imessage",
        friendId: apk119Value101.id || null,
        messageId: apk119Value99.message?.["id"] || null
      };
    return void apk119Value29(apk119Value99, apk119Value100, apk119Value102, apk119Value103, apk119Value104, apk119Value105), true;
  }
  window.u2SystemNotifications = {
    getSettings: apk119Value18,
    updateSettings: apk119Value19,
    setCustomSound: apk119Value20,
    clearCustomSound: apk119Value21,
    playNotificationSound: apk119Value25,
    stopNotificationSound: apk119Value24,
    notifyIncomingMessage: apk119Value30
  }, window.addEventListener("u2-storage-ready", apk119Value17, {
    once: true
  }), window.addEventListener("u2:native-notification-permission-changed", apk119Value106 => {
    const apk119Value107 = String(apk119Value106?.["detail"]?.["permission"] || apk119Value13());
    apk119Value4.permission = apk119Value107;
    if (apk119Value8() && apk119Value107 === "denied") apk119Value4.enabled = false;
    if (apk119Value5) void apk119Value15();
    apk119Value16("native-permission");
  }), window.appStorage?.["ready"] && typeof window.appStorage.ready.then === "function" && window.appStorage.ready.then(() => {
    if (!apk119Value5) return apk119Value17();
    return undefined;
  })["catch"](apk119Value108 => {
    console.warn("[system_notifications] Storage hydration failed:", apk119Value108);
  });
})();