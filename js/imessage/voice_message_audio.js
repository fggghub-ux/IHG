(function () {
  const localValue1 = new Map(),
    localValue2 = new Map();
  function localValue3(localValue20) {
    return String(localValue20?.["transcript"] || localValue20?.["text"] || "").trim();
  }
  function localValue4(localValue21, localValue22) {
    const localValue23 = String(localValue22?.["id"] || "");
    return (localValue21?.["messages"] || []).find(localValue24 => String(localValue24?.["id"] || "") === localValue23) || localValue22;
  }
  function localValue5(localValue25, localValue26) {
    if (localValue26?.["role"] !== "assistant" || localValue26?.["type"] !== "voice_message") return null;
    const localValue27 = window.u2Tts?.["resolveMessageTtsFriend"]?.(localValue25, localValue26);
    return localValue27 && (localValue27.type === "char" || localValue27.type === "friend") ? localValue27 : null;
  }
  function localValue6(localValue28, localValue29) {
    return !!localValue5(localValue28, localValue29);
  }
  function localValue7(localValue30, localValue31) {
    return String(localValue30?.["id"] || "") + ":" + String(localValue31?.["id"] || localValue31?.["timestamp"] || "");
  }
  function localValue8(localValue32, localValue33) {
    const localValue34 = localValue7(localValue32, localValue33),
      localValue35 = localValue4(localValue32, localValue33),
      localValue36 = localValue2.get(localValue34);
    if (!localValue36) return null;
    if (localValue36.assetId !== localValue35?.["ttsAudioAssetId"] || localValue36.text !== localValue3(localValue35) || localValue35?.["ttsAudioText"] !== localValue36.text) return localValue2["delete"](localValue34), null;
    return localValue36;
  }
  function localValue9() {
    const localValue37 = typeof navigator === "undefined" ? null : navigator,
      localValue38 = String(localValue37?.["userAgent"] || "");
    return /iPad|iPhone|iPod/i.test(localValue38) || /Macintosh/i.test(localValue38) && Number(localValue37?.["maxTouchPoints"]) > 1;
  }
  async function localValue10(localValue39) {
    const localValue40 = String(localValue39 || "").trim();
    if (!localValue40) throw new Error("TTS 未返回可保存的音频");
    if (localValue40.startsWith("data:")) {
      const localValue43 = window.appStorage?.["dataUrlToBlob"]?.(localValue40);
      if (localValue43?.["size"]) return localValue43;
    }
    const localValue41 = await fetch(localValue40);
    if (!localValue41.ok) throw new Error("无法读取生成的音频 (" + localValue41.status + ")");
    const localValue42 = await localValue41.blob();
    if (!localValue42.size) throw new Error("生成的音频为空");
    return localValue42;
  }
  async function localValue11(localValue44, localValue45) {
    const localValue46 = localValue4(localValue44, localValue45),
      localValue47 = localValue3(localValue46),
      localValue48 = String(localValue46?.["ttsAudioAssetId"] || "");
    if (!localValue48 || !localValue47 || localValue46.ttsAudioText !== localValue47) return null;
    const localValue49 = await window.appStorage?.["getAssetBlob"]?.(localValue48);
    return localValue49?.["size"] ? {
      "assetId": localValue48,
      "blob": localValue49
    } : null;
  }
  function localValue12(localValue50, localValue51) {
    const localValue52 = ((localValue50?.["id"] || "") + "_" + (localValue51?.["id"] || "")).replace(/[^a-z0-9_-]+/gi, "-").slice(0, 140),
      localValue53 = window.crypto?.["randomUUID"]?.() || Date.now() + "_" + Math.random().toString(36).slice(2);
    return "im_voice_tts_" + localValue52 + "_" + localValue53;
  }
  async function localValue13(localValue54, localValue55) {
    const localValue56 = window.appStorage?.["voiceCacheEpoch"],
      localValue57 = localValue4(localValue54, localValue55),
      localValue58 = localValue5(localValue54, localValue57),
      localValue59 = localValue3(localValue57);
    if (!localValue58) throw new Error("无法确定这条语音的发送角色");
    if (!localValue59) throw new Error("这条语音没有可合成的文字");
    if (!window.u2Tts?.["canSpeakForFriend"]?.(localValue58)) throw new Error("请先为该角色开启 TTS 并设置音色 ID");
    if (!window.appStorage?.["saveAssetFromBlob"] || !window.appStorage?.["getAssetBlob"] || !window.imApp?.["updateFriendMessage"]) throw new Error("语音存储服务不可用，请刷新后重试");
    const localValue60 = await window.u2Tts.prepareSpeech(localValue59, localValue58);
    let localValue61;
    try {
      localValue61 = await localValue10(localValue60);
    } finally {
      if (String(localValue60 || "").startsWith("blob:")) URL.revokeObjectURL(localValue60);
    }
    const localValue62 = localValue12(localValue54, localValue57);
    await window.appStorage.saveAssetFromBlob(localValue62, localValue61, {
      "ownerType": "imessage_voice_tts",
      "voiceCacheEpoch": localValue56,
      "ownerId": String(localValue57.id || ""),
      "friendId": String(localValue54.id || "")
    });
    try {
      const localValue63 = await window.imApp.updateFriendMessage(localValue54.id, {
        "id": localValue57.id || null,
        "timestamp": localValue57.timestamp || null
      }, localValue64 => {
        if (localValue56 !== window.appStorage?.["voiceCacheEpoch"]) throw new Error("语音缓存已清理，请重新生成");
        if (!localValue64 || localValue3(localValue64) !== localValue59) throw new Error("语音文字已变化，请重试");
        localValue64.ttsAudioAssetId = localValue62, localValue64.ttsAudioText = localValue59;
      }, {
        "silent": true
      });
      if (!localValue63) throw new Error("语音保存失败，请重试");
    } catch (localValue65) {
      await window.appStorage.deleteAsset?.(localValue62)["catch"](() => undefined);
      throw localValue65;
    }
    return localValue55.ttsAudioAssetId = localValue62, localValue55.ttsAudioText = localValue59, {
      "assetId": localValue62,
      "blob": localValue61
    };
  }
  async function localValue14(localValue66, localValue67, {
    regenerate = false
  } = {}) {
    if (!localValue6(localValue66, localValue67)) throw new Error("这条语音不能生成音频");
    const localValue68 = localValue7(localValue66, localValue67),
      localValue69 = localValue1.get(localValue68);
    if (localValue69) {
      if (!regenerate) return localValue69;
      try {
        await localValue69;
      } catch (localValue71) {}
    }
    const localValue70 = (async () => {
      if (!regenerate) {
        const localValue72 = await localValue11(localValue66, localValue67);
        if (localValue72) return localValue72;
      }
      return localValue13(localValue66, localValue67);
    })();
    localValue1.set(localValue68, localValue70);
    try {
      return await localValue70;
    } finally {
      if (localValue1.get(localValue68) === localValue70) localValue1["delete"](localValue68);
    }
  }
  async function localValue15(localValue73, localValue74, localValue75 = {}) {
    const {
        assetId: localValue76
      } = await localValue14(localValue73, localValue74, localValue75),
      localValue77 = await window.appStorage.getAssetUrl(localValue76);
    if (!localValue77) throw new Error("已保存的语音无法读取，请重试");
    const localValue78 = localValue4(localValue73, localValue74),
      localValue79 = localValue3(localValue78);
    if (String(localValue78?.["ttsAudioAssetId"] || "") !== localValue76 || localValue78?.["ttsAudioText"] !== localValue79) throw new Error("语音文字已变化，请重试");
    const localValue80 = {
      "assetId": localValue76,
      "url": localValue77,
      "text": localValue79
    };
    return localValue2.set(localValue7(localValue73, localValue74), localValue80), localValue80;
  }
  function localValue16(localValue81, localValue82) {
    const localValue83 = localValue8(localValue81, localValue82);
    if (localValue83) return window.u2Tts.playAudioUrl(localValue83.url);
    return localValue15(localValue81, localValue82).then(localValue84 => localValue9() ? {
      "readyForTap": true
    } : window.u2Tts.playAudioUrl(localValue84.url));
  }
  async function localValue17(localValue85, localValue86) {
    return localValue15(localValue85, localValue86, {
      "regenerate": true
    });
  }
  function localValue18(localValue87, localValue88) {
    const localValue89 = {
        "audio/mpeg": "mp3",
        "audio/mp3": "mp3",
        "audio/wav": "wav",
        "audio/x-wav": "wav",
        "audio/ogg": "ogg",
        "audio/mp4": "m4a",
        "audio/webm": "webm",
        "audio/flac": "flac"
      }[String(localValue88 || "").toLowerCase()] || "mp3",
      localValue90 = new Date(localValue87?.["timestamp"] || Date.now()),
      localValue91 = Number.isNaN(localValue90.getTime()) ? String(Date.now()) : localValue90.toISOString().replace(/[:.]/g, "-").slice(0, 19);
    return "imessage-voice-" + localValue91 + "." + localValue89;
  }
  async function localValue19(localValue92, localValue93) {
    if (typeof window.u2ExportFile !== "function") throw new Error("文件下载功能尚未加载，请刷新后重试");
    const {
        blob: localValue94
      } = await localValue14(localValue92, localValue93),
      localValue95 = await window.u2ExportFile({
        "blob": localValue94,
        "fileName": localValue18(localValue93, localValue94.type),
        "title": "iMessage 语音"
      });
    if (localValue95 === "failed") throw new Error("语音下载失败，请重试");
    return localValue95;
  }
  window.imVoiceMessageAudio = Object.freeze({
    "canManage": localValue6,
    "getOrCreate": localValue14,
    "isReady": (localValue96, localValue97) => !!localValue8(localValue96, localValue97),
    "play": localValue16,
    "regenerate": localValue17,
    "download": localValue19,
    "clearCache": () => {
      localValue2.clear(), localValue1.clear();
    }
  });
})();
