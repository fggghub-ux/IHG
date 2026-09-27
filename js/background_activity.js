(function () {
  const STORAGE_KEY = "u2_backgroundActivitySettings",
    MIN_INTERVAL_SECONDS = 1,
    MAX_INTERVAL_SECONDS = 3600,
    defaults = {
      enabled: false,
      intervalSeconds: 60,
      lastTickAt: 0
    };
  let settings = normalize(loadSettings()),
    timerId = null,
    wakeLock_3 = null,
    keepAliveAudio = null,
    keepAliveAudioUrl = "",
    audioUnlockBound = false,
    storageHydrated = false;
  function clampInterval(value_2) {
    const number = Number.parseInt(value_2, 10);
    if (!Number.isFinite(number)) return defaults.intervalSeconds;
    return Math.max(MIN_INTERVAL_SECONDS, Math.min(MAX_INTERVAL_SECONDS, number));
  }
  function normalize(value_3) {
    const safe = value_3 && typeof value_3 === "object" ? value_3 : {};
    return {
      enabled: !!safe.enabled,
      intervalSeconds: clampInterval(safe.intervalSeconds),
      lastTickAt: Number.isFinite(Number(safe.lastTickAt)) ? Number(safe.lastTickAt) : 0
    };
  }
  function loadSettings() {
    try {
      if (window.StorageManager && typeof window.StorageManager.load === "function") return window.StorageManager.load(STORAGE_KEY, defaults);
      return defaults;
    } catch (error_2) {
      return console.warn("[background_activity] Failed to load settings:", error_2), defaults;
    }
  }
  function saveSettings() {
    try {
      if (window.StorageManager && typeof window.StorageManager.save === "function") {
        window.StorageManager.save(STORAGE_KEY, settings);
        return;
      }
    } catch (error) {
      console.warn("[background_activity] Failed to save settings:", error);
    }
  }
  function notifySettingsChanged(reason_2) {
    window.dispatchEvent(new CustomEvent("u2:background-activity-settings-changed", {
      detail: {
        ...getSettings_2(),
        reason: reason_2
      }
    }));
  }
  function hydrateSettingsFromStorage() {
    settings = normalize(loadSettings());
    storageHydrated = true;
    if (settings.enabled) start_2("storage-ready");else stop_2();
    return notifySettingsChanged("storage-ready"), getSettings_2();
  }
  function clearTimer() {
    timerId && (clearInterval(timerId), timerId = null);
  }
  async function releaseWakeLock() {
    if (!wakeLock_3) return;
    try {
      await wakeLock_3.release();
    } catch (error_3) {
      console.warn("[background_activity] Failed to release wake lock:", error_3);
    } finally {
      wakeLock_3 = null;
    }
  }
  function createKeepAliveAudioUrl() {
    if (keepAliveAudioUrl) return keepAliveAudioUrl;
    const sampleRate = 8000,
      count_18 = 1,
      value_19 = sampleRate * count_18,
      bytesPerSample = 2,
      dataSize = value_19 * bytesPerSample,
      buffer = new ArrayBuffer(44 + dataSize),
      view = new DataView(buffer);
    let offset = 0;
    const writeString = value_4 => {
      for (let index = 0; index < value_4.length; index += 1) {
        view.setUint8(offset + index, value_4.charCodeAt(index));
      }
      offset += value_4.length;
    };
    writeString("RIFF");
    view.setUint32(offset, 36 + dataSize, true);
    offset += 4;
    writeString("WAVE");
    writeString("fmt ");
    view.setUint32(offset, 16, true);
    offset += 4;
    view.setUint16(offset, 1, true);
    offset += 2;
    view.setUint16(offset, 1, true);
    offset += 2;
    view.setUint32(offset, sampleRate, true);
    offset += 4;
    view.setUint32(offset, sampleRate * bytesPerSample, true);
    offset += 4;
    view.setUint16(offset, bytesPerSample, true);
    offset += 2;
    view.setUint16(offset, 8 * bytesPerSample, true);
    offset += 2;
    writeString("data");
    view.setUint32(offset, dataSize, true);
    offset += 4;
    for (let index_2 = 0; index_2 < value_19; index_2 += 1) {
      const sample = Math.sin(2 * Math.PI * 18 * index_2 / sampleRate) * 6;
      view.setInt16(offset, sample, true);
      offset += bytesPerSample;
    }
    if (location.protocol === "file:") {
      const bytes = new Uint8Array(buffer),
        chunkSize = 32768;
      let binary = "";
      for (let index_3 = 0; index_3 < bytes.length; index_3 += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(index_3, index_3 + chunkSize));
      }
      keepAliveAudioUrl = "data:audio/wav;base64," + btoa(binary);
    } else keepAliveAudioUrl = URL.createObjectURL(new Blob([buffer], {
      type: "audio/wav"
    }));
    return keepAliveAudioUrl;
  }
  function ensureKeepAliveAudio() {
    if (keepAliveAudio) return keepAliveAudio;
    keepAliveAudio = document.createElement("audio");
    keepAliveAudio.loop = true;
    keepAliveAudio.preload = "auto";
    keepAliveAudio.playsInline = true;
    keepAliveAudio.volume = 1;
    keepAliveAudio.src = createKeepAliveAudioUrl();
    keepAliveAudio.setAttribute("aria-hidden", "true");
    keepAliveAudio.setAttribute("webkit-playsinline", "true");
    keepAliveAudio.style.position = "fixed";
    keepAliveAudio.style.width = "1px";
    keepAliveAudio.style.height = "1px";
    keepAliveAudio.style.opacity = "0";
    keepAliveAudio.style.pointerEvents = "none";
    keepAliveAudio.style.left = "-9999px";
    keepAliveAudio.style.top = "-9999px";
    const handleDOMContentLoaded = () => {
      document.body && !keepAliveAudio.isConnected && document.body.appendChild(keepAliveAudio);
    };
    return document.body ? handleDOMContentLoaded() : document.addEventListener("DOMContentLoaded", handleDOMContentLoaded, {
      once: true
    }), keepAliveAudio;
  }
  function bindAudioUnlock() {
    if (audioUnlockBound) return;
    audioUnlockBound = true;
    ["pointerdown", "touchstart", "click", "keydown"].forEach(eventName => {
      document.addEventListener(eventName, handleAudioUnlock, {
        capture: true,
        passive: true
      });
    });
  }
  function unbindAudioUnlock() {
    if (!audioUnlockBound) return;
    audioUnlockBound = false;
    ["pointerdown", "touchstart", "click", "keydown"].forEach(eventName_2 => {
      document.removeEventListener(eventName_2, handleAudioUnlock, true);
    });
  }
  function handleAudioUnlock() {
    settings.enabled ? startKeepAliveAudio("user-gesture") : unbindAudioUnlock();
  }
  async function startKeepAliveAudio(reason_3 = "audio") {
    if (!settings.enabled) return false;
    const audio = ensureKeepAliveAudio();
    try {
      return (audio.paused || audio.ended) && (await audio.play()), unbindAudioUnlock(), window.dispatchEvent(new CustomEvent("u2:background-audio-active", {
        detail: {
          reason: reason_3,
          activeAt: Date.now()
        }
      })), true;
    } catch (error_4) {
      return bindAudioUnlock(), console.info("[background_activity] Audio keep-alive is waiting for a user gesture:", error_4), false;
    }
  }
  function stopKeepAliveAudio() {
    unbindAudioUnlock();
    if (!keepAliveAudio) return;
    keepAliveAudio.pause();
    keepAliveAudio.currentTime = 0;
  }
  async function handleAction_7() {
    if (!settings.enabled || document.hidden || wakeLock_3 || !navigator.wakeLock?.request) return;
    try {
      wakeLock_3 = await navigator.wakeLock.request("screen");
      wakeLock_3.addEventListener("release", () => {
        wakeLock_3 = null;
      });
    } catch (error_5) {
      wakeLock_3 = null;
      console.info("[background_activity] Wake Lock is unavailable:", error_5);
    }
  }
  function dispatchTick(reason_4) {
    const now_38 = Date.now(),
      previousTickAt_2 = settings.lastTickAt || 0;
    settings.lastTickAt = now_38;
    saveSettings();
    window.dispatchEvent(new CustomEvent("u2:background-activity-tick", {
      detail: {
        reason: reason_4,
        enabled: settings.enabled,
        intervalSeconds: settings.intervalSeconds,
        tickAt: now_38,
        previousTickAt: previousTickAt_2,
        elapsedSeconds: previousTickAt_2 ? Math.max(0, Math.round((now_38 - previousTickAt_2) / 1000)) : 0
      }
    }));
  }
  function handleAction_8() {
    if (!settings.enabled || !settings.lastTickAt) return;
    const elapsedMs = Date.now() - settings.lastTickAt;
    elapsedMs >= settings.intervalSeconds * 1000 && dispatchTick("resume");
  }
  function schedule() {
    clearTimer();
    if (!settings.enabled) return;
    timerId = setInterval(() => {
      dispatchTick("interval");
    }, settings.intervalSeconds * 1000);
  }
  function start_2(value_41 = "start") {
    if (!settings.enabled) {
      stop_2();
      return;
    }
    !settings.lastTickAt ? dispatchTick(value_41) : handleAction_8();
    schedule();
    handleAction_7();
    startKeepAliveAudio(value_41);
  }
  function stop_2() {
    clearTimer();
    releaseWakeLock();
    stopKeepAliveAudio();
  }
  function updateSettings_2(nextSettings = {}) {
    return settings = normalize({
      ...settings,
      ...nextSettings
    }), saveSettings(), settings.enabled ? start_2("settings") : stop_2(), notifySettingsChanged("settings"), getSettings_2();
  }
  function getSettings_2() {
    return {
      ...settings
    };
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      releaseWakeLock();
      schedule();
      startKeepAliveAudio("hidden");
      return;
    }
    start_2("visible");
  });
  window.addEventListener("pagehide", () => {
    clearTimer();
    releaseWakeLock();
    stopKeepAliveAudio();
  });
  window.addEventListener("pageshow", () => {
    start_2("pageshow");
  });
  window.addEventListener("u2:native-pause", () => {
    if (!settings.enabled) return;
    schedule();
    startKeepAliveAudio("native-pause");
  });
  window.addEventListener("u2:native-resume", () => {
    start_2("native-resume");
  });
  window.u2BackgroundActivity = {
    getSettings: getSettings_2,
    updateSettings: updateSettings_2,
    start: start_2,
    stop: stop_2
  };
  window.addEventListener("u2-storage-ready", hydrateSettingsFromStorage, {
    once: true
  });
  window.appStorage?.ready && typeof window.appStorage.ready.then === "function" && window.appStorage.ready.then(() => {
    if (!storageHydrated) hydrateSettingsFromStorage();
  })["catch"](error_6 => {
    console.warn("[background_activity] Storage hydration failed:", error_6);
  });
  settings.enabled && start_2("boot");
})();
