(function () {
  const localValue1 = "imagePromptPresetLibrary",
    localValue2 = ["basePrompt", "charAppearance", "userAppearance", "artistPrompt", "negativePrompt"];
  let localValue3 = Promise.resolve();
  function localValue4(localValue16 = {}) {
    const localValue17 = {
      "id": String(localValue16.id || "").trim(),
      "name": String(localValue16.name || "").trim().slice(0, 80),
      "createdAt": Math.max(0, Number(localValue16.createdAt) || Date.now()),
      "updatedAt": Math.max(0, Number(localValue16.updatedAt) || Number(localValue16.createdAt) || Date.now())
    };
    return localValue2.forEach(localValue18 => {
      localValue17[localValue18] = String(localValue18 === "basePrompt" ? localValue16.basePrompt ?? localValue16.prompt ?? "" : localValue16[localValue18] || "").trim().slice(0, localValue18 === "basePrompt" ? 8000 : 4000);
    }), localValue17.prompt = localValue17.basePrompt, localValue17.name && localValue2.some(localValue19 => localValue17[localValue19]) ? localValue17 : null;
  }
  const localValue5 = localValue20 => JSON.stringify([localValue20.name, ...localValue2.map(localValue21 => localValue20[localValue21])]),
    localValue6 = () => "image-preset-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
  function localValue7(localValue22, localValue23 = []) {
    const localValue24 = [],
      localValue25 = (localValue27, localValue28, localValue29) => {
        (localValue27?.["imagePromptConfig"]?.["presets"] || []).forEach((localValue30, localValue31) => localValue24.push({
          "preset": localValue30,
          "key": localValue28 + ":" + (localValue30.id || localValue31),
          "label": localValue29
        }));
      };
    [...localValue23, ...(window.imData?.["friends"] || [])].forEach(localValue32 => localValue25(localValue32, "im:" + localValue32.id, localValue32.nickname || localValue32.realName || String(localValue32.id)));
    const localValue26 = window.appStorage.readDomain("tiktok", {});
    return [localValue26, window.tkState].filter(Boolean).forEach(localValue33 => {
      localValue25(localValue33.profile, "tk:profile", "TikTok User"), (localValue33.chars || []).forEach(localValue34 => localValue25(localValue34, "tk:" + localValue34.id, localValue34.name || "TikTok " + localValue34.id)), Object.entries(localValue33.settings?.["imagePromptConfigs"] || {}).forEach(([localValue35, localValue36]) => localValue25(localValue36, "tk:" + localValue35, "TikTok " + localValue35));
    }), (localValue22 || []).forEach((localValue37, localValue38) => localValue24.push({
      "preset": localValue37,
      "key": "modal:" + (localValue37.id || localValue38),
      "label": "旧预设"
    })), localValue24;
  }
  function localValue8(localValue39, localValue40) {
    const localValue41 = (Array.isArray(localValue39?.["presets"]) ? localValue39.presets : []).map(localValue4).filter(Boolean),
      localValue42 = {
        ...(localValue39?.["legacyImports"] || {})
      };
    return localValue40.forEach(({
      preset: localValue43,
      key: localValue44,
      label: localValue45
    }) => {
      const localValue46 = localValue4(localValue43);
      if (!localValue46) return;
      const localValue47 = localValue5(localValue46);
      if (localValue42[localValue44] === localValue47) return;
      const localValue48 = Object.values(localValue42).includes(localValue47);
      localValue42[localValue44] = localValue47;
      if (localValue48) return;
      if (localValue41.some(localValue51 => localValue5(localValue51) === localValue47)) return;
      const localValue49 = localValue46.name;
      let localValue50 = 1;
      while (localValue41.some(localValue52 => localValue52.name === localValue46.name)) {
        const localValue53 = "（" + String(localValue45).slice(0, 30) + (localValue50 > 1 ? " " + localValue50 : "") + "）";
        localValue46.name = localValue49.slice(0, 80 - localValue53.length) + localValue53, localValue50++;
      }
      if (!localValue46.id || localValue41.some(localValue54 => localValue54.id === localValue46.id)) localValue46.id = localValue6();
      localValue41.push(localValue46);
    }), {
      "presets": localValue41,
      "legacyImports": localValue42
    };
  }
  function localValue9(localValue55, localValue56, localValue57 = "") {
    const localValue58 = localValue3["catch"](() => {}).then(async () => {
      const localValue59 = window.appStorage;
      if (!localValue59?.["readDomain"] || !localValue59?.["commitDomain"]) throw new Error("预设存储尚未加载，请刷新后重试");
      await localValue59.ready;
      const localValue60 = !window.imData?.["friends"]?.["length"] && localValue59.loadFriends ? await localValue59.loadFriends() : [],
        localValue61 = localValue7(localValue55, localValue60),
        localValue62 = localValue59.readDomain("settings", {})[localValue1],
        localValue63 = localValue8(localValue62, localValue61);
      if (!localValue56 && !localValue57 && JSON.stringify(localValue62) === JSON.stringify(localValue63)) return localValue63.presets;
      let localValue64;
      return await localValue59.commitDomain("settings", localValue65 => {
        const localValue66 = localValue8(localValue65[localValue1], localValue61);
        if (localValue57) localValue66.presets = localValue66.presets.filter(localValue67 => localValue67.id !== localValue57);
        if (localValue56) {
          const localValue68 = localValue4(localValue56);
          if (!localValue68) throw new Error("请填写预设名称和至少一项提示词");
          const localValue69 = localValue66.presets.find(localValue70 => localValue70.name === localValue68.name);
          localValue68.id = localValue69?.["id"] || localValue6(), localValue68.createdAt = localValue69?.["createdAt"] || localValue68.createdAt, localValue68.updatedAt = Date.now(), localValue66.presets = localValue66.presets.filter(localValue71 => localValue71.id !== localValue68.id), localValue66.presets.push(localValue68), localValue64 = localValue68;
        }
        localValue65[localValue1] = localValue66;
      }, {
        "critical": true,
        "reason": localValue57 ? "image-prompt-preset-delete" : localValue56 ? "image-prompt-preset-save" : "image-prompt-preset-migration"
      }), localValue56 ? {
        "preset": localValue64,
        "presets": localValue59.readDomain("settings", {})[localValue1].presets
      } : localValue59.readDomain("settings", {})[localValue1].presets;
    });
    return localValue3 = localValue58, localValue58;
  }
  window.u2ImagePromptPresets = Object.freeze({
    "load": (localValue72 = []) => localValue9(localValue72),
    "save": localValue73 => localValue9([], localValue73),
    "remove": localValue74 => localValue9([], null, String(localValue74 || "").trim())
  });
  function localValue10(localValue75, localValue76, localValue77) {
    return Object.assign(new Error(localValue76), {
      "code": localValue75,
      "cause": localValue77
    });
  }
  async function localValue11(localValue78) {
    if (!localValue78?.["size"]) throw localValue10("IMAGE_EMPTY", "图片数据为空，请重试");
    if (/^image\//i.test(localValue78.type || "")) return localValue78;
    const localValue79 = new Uint8Array(await localValue78.slice(0, 32).arrayBuffer()),
      localValue80 = String.fromCharCode(...localValue79),
      localValue81 = localValue79[0] === 137 && localValue80.slice(1, 4) === "PNG" ? "image/png" : localValue79[0] === 255 && localValue79[1] === 216 && localValue79[2] === 255 ? "image/jpeg" : localValue80.startsWith("GIF8") ? "image/gif" : localValue80.startsWith("RIFF") && localValue80.slice(8, 12) === "WEBP" ? "image/webp" : localValue80.slice(4, 8) === "ftyp" && /avif|avis/.test(localValue80.slice(8)) ? "image/avif" : "";
    if (!localValue81) throw localValue10("IMAGE_INVALID", "返回的内容不是有效图片，无法保存");
    return new Blob([localValue78], {
      "type": localValue81
    });
  }
  async function localValue12(localValue82, {
    timeoutMs = 30000
  } = {}) {
    if (!localValue82) throw localValue10("IMAGE_MISSING", "图片资源不存在，请重新生成");
    const localValue83 = new AbortController(),
      localValue84 = setTimeout(() => localValue83.abort(), timeoutMs);
    try {
      const localValue85 = await fetch(localValue82, {
        "signal": localValue83.signal
      });
      if (!localValue85.ok) throw localValue10("IMAGE_HTTP", [401, 403, 404, 410].includes(localValue85.status) ? "图片链接已失效或无权读取（HTTP " + localValue85.status + "），请重新生成" : "图片读取失败（HTTP " + localValue85.status + "），请稍后重试");
      return await localValue11(await localValue85.blob());
    } catch (localValue86) {
      if (typeof localValue86.code === "string" && localValue86.code.startsWith("IMAGE_")) throw localValue86;
      if (localValue86.name === "AbortError") throw localValue10("IMAGE_TIMEOUT", "图片读取超时，请检查网络后重试", localValue86);
      throw localValue10("IMAGE_READ", "图片读取失败，可能是网络或图片源的跨域限制；可尝试备用保存", localValue86);
    } finally {
      clearTimeout(localValue84);
    }
  }
  function localValue13(localValue87, localValue88 = 0) {
    return localValue88 === 0 ? {
      "assetId": localValue87.contentAssetId,
      "url": localValue87.content
    } : {
      "assetId": localValue87.albumImages?.[localValue88 - 1]?.["assetId"],
      "url": localValue87.albumImages?.[localValue88 - 1]?.["url"]
    };
  }
  async function localValue14(localValue89, localValue90 = 0, {
    refresh = false
  } = {}) {
    const {
      assetId: localValue91,
      url: localValue92
    } = localValue13(localValue89, localValue90);
    if (localValue91 && window.appStorage?.["getAssetUrl"]) {
      const localValue93 = await window.appStorage.getAssetUrl(localValue91, {
        "refresh": refresh
      });
      if (localValue93) return localValue93;
    }
    return localValue92 || "";
  }
  async function localValue15(localValue94, localValue95 = 0) {
    const {
      assetId: localValue96,
      url: localValue97
    } = localValue13(localValue94, localValue95);
    if (localValue96 && window.appStorage?.["getAssetBlob"]) {
      const localValue98 = await window.appStorage.getAssetBlob(localValue96);
      if (localValue98) return localValue11(localValue98);
      if (!localValue97 || /^blob:/i.test(localValue97)) throw localValue10("IMAGE_MISSING", "本地图片资源已丢失，请重新生成");
    }
    return localValue12(await localValue14(localValue94, localValue95));
  }
  window.u2ImageResources = Object.freeze({
    "readBlob": localValue12,
    "readMessageBlob": localValue15,
    "resolveMessageUrl": localValue14
  });
})();
