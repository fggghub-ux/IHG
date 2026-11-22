(function () {
  "use strict";

  const scopeValue0 = 300;
  function scopeValue1(scopeValue13) {
    const scopeValue14 = String(scopeValue13 || "").trim();
    return /^(?:https?:\/\/|data:image\/|blob:|assets\/)/i.test(scopeValue14) ? scopeValue14 : "";
  }
  function scopeValue2(scopeValue15) {
    let scopeValue16 = 2166136261;
    const scopeValue17 = String(scopeValue15 || "");
    for (let scopeValue18 = 0; scopeValue18 < scopeValue17.length; scopeValue18 += 1) {
      scopeValue16 ^= scopeValue17.charCodeAt(scopeValue18);
      scopeValue16 = Math.imul(scopeValue16, 16777619);
    }
    return (scopeValue16 >>> 0).toString(36);
  }
  function scopeValue3(scopeValue19, scopeValue20 = {}, scopeValue21 = 0) {
    const scopeValue22 = String(scopeValue20.id || "").trim();
    if (/^[a-zA-Z0-9_-]{6,160}$/.test(scopeValue22)) return scopeValue22;
    const scopeValue23 = String(scopeValue20.assetId || scopeValue20.sourceMessageId || scopeValue20.url || (scopeValue20.addedAt || 0) + ":" + scopeValue21);
    return "gallery_" + scopeValue2(String(scopeValue19 || "") + "|" + scopeValue23);
  }
  function scopeValue4(scopeValue24) {
    const scopeValue25 = String(scopeValue24?.id || "");
    return (Array.isArray(scopeValue24?.galleryAlbumImages) ? scopeValue24.galleryAlbumImages : []).map((scopeValue26, scopeValue27) => {
      const scopeValue28 = typeof scopeValue26 === "string" ? {
          url: scopeValue26
        } : scopeValue26 && typeof scopeValue26 === "object" ? scopeValue26 : {},
        scopeValue29 = scopeValue1(scopeValue28.url),
        scopeValue30 = String(scopeValue28.assetId || "");
      if (!scopeValue29 && !scopeValue30) return null;
      return {
        id: scopeValue3(scopeValue25, scopeValue28, scopeValue27),
        url: scopeValue29,
        assetId: scopeValue30,
        description: String(scopeValue28.description || "").trim().slice(0, scopeValue0),
        addedAt: Math.max(0, Number(scopeValue28.addedAt) || 0),
        sourceFriendId: String(scopeValue28.sourceFriendId || ""),
        sourceMessageId: String(scopeValue28.sourceMessageId || ""),
        index: scopeValue27
      };
    }).filter(scopeValue31 => scopeValue31 && scopeValue31.url).sort((scopeValue32, scopeValue33) => scopeValue33.addedAt - scopeValue32.addedAt || scopeValue33.index - scopeValue32.index);
  }
  function scopeValue5(scopeValue34, scopeValue35) {
    return (Array.isArray(scopeValue35) ? scopeValue35 : []).slice(0, 100).map((scopeValue36, scopeValue37) => ({
      id: scopeValue3(scopeValue34, scopeValue36, scopeValue37),
      url: /^https?:\/\//i.test(scopeValue36?.url || "") ? String(scopeValue36.url) : "",
      ...(scopeValue36?.assetId ? {
        assetId: String(scopeValue36.assetId)
      } : {}),
      description: String(scopeValue36?.description || "").trim().slice(0, scopeValue0),
      addedAt: Math.max(0, Number(scopeValue36?.addedAt) || 0),
      ...(scopeValue36?.sourceFriendId ? {
        sourceFriendId: String(scopeValue36.sourceFriendId)
      } : {}),
      ...(scopeValue36?.sourceMessageId ? {
        sourceMessageId: String(scopeValue36.sourceMessageId)
      } : {})
    }));
  }
  function scopeValue6(scopeValue38) {
    if (!scopeValue38 || scopeValue38.role !== "user" || scopeValue38.type === "image") return "";
    return [scopeValue38.content, scopeValue38.text, scopeValue38.description].map(scopeValue39 => String(scopeValue39 || "").trim()).filter(Boolean).join(`
`).slice(0, 1000);
  }
  function scopeValue7(scopeValue40) {
    const scopeValue41 = typeof scopeValue40 === "string" ? scopeValue40.trim() : scopeValue6(scopeValue40);
    if (!scopeValue41) return null;
    const scopeValue42 = scopeValue41.replace(/[\s，。！？、,.!?:：；;“”"'（）()【】\[\]-]/g, "").toLowerCase(),
      scopeValue43 = /头像|profilepicture|profilepic|pfp|avatar/i.test(scopeValue42),
      scopeValue44 = /换|更换|换成|改|改成|设|设置|用|选|挑|change|switch|set|use|choose|pick/i.test(scopeValue42);
    if (!scopeValue43 || !scopeValue44) return null;
    const scopeValue45 = /要不要|想不想|愿不愿意|考不考虑|需不需要|可不可以|可以吗|好吗|怎么样|是否|wouldyou|doyouwant|couldyou/i.test(scopeValue42),
      scopeValue46 = scopeValue8(scopeValue41),
      scopeValue47 = /最新|最近|最早|最旧|第一张|最后一张|newest|latest|oldest|first|last/i.test(scopeValue41),
      scopeValue48 = /这张|那张|某张|照片里|相册里|图库里|穿|戴|拿|背景|衣服|颜色|发型|表情|场景|photo|picture|image/i.test(scopeValue41),
      scopeValue49 = scopeValue42.replace(/profilepicture|profilepic|avatar|pfp|头像/g, "").replace(/更换|换成|改成|设置|换|改|设|用|选|挑|change|switch|set|use|choose|pick/g, "").replace(/一下|一个|个|吧|嘛|呢|请|帮我|给我|你的|自己|please/g, ""),
      scopeValue50 = !!scopeValue46 || scopeValue47 || scopeValue48 || scopeValue49.length >= 4;
    return {
      text: scopeValue41,
      mode: scopeValue45 ? "optional" : "required",
      specified: scopeValue50,
      ordinal: scopeValue46
    };
  }
  function scopeValue8(scopeValue51) {
    const scopeValue52 = String(scopeValue51 || ""),
      scopeValue53 = scopeValue52.match(/第\s*(\d{1,3})\s*张/);
    if (scopeValue53) return Math.max(1, Number(scopeValue53[1]) || 1);
    const scopeValue54 = {
        一: 1,
        二: 2,
        两: 2,
        三: 3,
        四: 4,
        五: 5,
        六: 6,
        七: 7,
        八: 8,
        九: 9,
        十: 10
      },
      scopeValue55 = scopeValue52.match(/第\s*([一二两三四五六七八九十])\s*张/);
    return scopeValue55 ? scopeValue54[scopeValue55[1]] : null;
  }
  function scopeValue9(scopeValue56) {
    const scopeValue57 = String(scopeValue56 || "").toLocaleLowerCase("zh-CN").replace(/头像|更换|换成|改成|设置|图库|相册|照片|图片|这张|那张|一个|一下|帮我|你的|自己|profile|picture|avatar|photo|image|change|switch|choose|pick/g, " ").replace(/[^\p{L}\p{N}]+/gu, " ").trim(),
      scopeValue58 = new Set(scopeValue57.split(/\s+/).filter(scopeValue60 => scopeValue60.length >= 2)),
      scopeValue59 = scopeValue57.replace(/\s+/g, "");
    for (let scopeValue61 = 0; scopeValue61 < scopeValue59.length - 1; scopeValue61 += 1) scopeValue58.add(scopeValue59.slice(scopeValue61, scopeValue61 + 2));
    return Array.from(scopeValue59).forEach(scopeValue62 => {
      if (/\p{Script=Han}/u.test(scopeValue62) && !/[的了把给请张个]/.test(scopeValue62)) scopeValue58.add(scopeValue62);
    }), Array.from(scopeValue58).slice(0, 30);
  }
  function scopeValue10(scopeValue63, scopeValue64) {
    const scopeValue65 = scopeValue9(scopeValue64.text);
    return scopeValue63.map((scopeValue66, scopeValue67) => {
      const scopeValue68 = (scopeValue66.description + " " + (scopeValue67 + 1)).toLocaleLowerCase("zh-CN"),
        scopeValue69 = scopeValue65.reduce((scopeValue70, scopeValue71) => scopeValue70 + (scopeValue68.includes(scopeValue71) ? Math.max(2, scopeValue71.length) : 0), 0);
      return {
        photo: scopeValue66,
        index: scopeValue67,
        score: scopeValue69
      };
    }).sort((scopeValue72, scopeValue73) => scopeValue73.score - scopeValue72.score || scopeValue72.index - scopeValue73.index);
  }
  function scopeValue11(scopeValue74, scopeValue75) {
    if (!scopeValue74 || scopeValue74.type !== "char") return null;
    const scopeValue76 = scopeValue7(scopeValue75);
    if (!scopeValue76) return null;
    const scopeValue77 = scopeValue4(scopeValue74);
    let scopeValue78 = [];
    if (!scopeValue76.specified) scopeValue78 = scopeValue77.slice(0, 20);else {
      const scopeValue81 = [];
      if (scopeValue76.ordinal && scopeValue77[scopeValue76.ordinal - 1]) scopeValue81.push(scopeValue77[scopeValue76.ordinal - 1]);
      if (/最早|最旧|oldest/i.test(scopeValue76.text) && scopeValue77.length) scopeValue81.push(scopeValue77[scopeValue77.length - 1]);
      if (/最新|最近|newest|latest/i.test(scopeValue76.text) && scopeValue77.length) scopeValue81.push(scopeValue77[0]);
      scopeValue78 = [...scopeValue81, ...scopeValue10(scopeValue77, scopeValue76).slice(0, 20).map(scopeValue82 => scopeValue82.photo), ...scopeValue77.slice(0, 10)];
    }
    const scopeValue79 = new Set(),
      scopeValue80 = scopeValue78.filter(scopeValue83 => {
        if (!scopeValue83 || scopeValue79.has(scopeValue83.id)) return false;
        return scopeValue79.add(scopeValue83.id), true;
      }).slice(0, 30).map(scopeValue84 => ({
        photoId: scopeValue84.id,
        position: scopeValue77.findIndex(scopeValue85 => scopeValue85.id === scopeValue84.id) + 1,
        description: scopeValue84.description,
        addedAt: scopeValue84.addedAt,
        current: String(scopeValue74.avatarUpdatedFromGalleryPhotoId || "") === scopeValue84.id
      }));
    return {
      request: scopeValue76,
      catalog: scopeValue80,
      total: scopeValue77.length
    };
  }
  function scopeValue12(scopeValue86, scopeValue87) {
    const scopeValue88 = String(scopeValue87 || "").trim();
    if (!scopeValue88 || scopeValue86?.type !== "char") return null;
    return scopeValue4(scopeValue86).find(scopeValue89 => scopeValue89.id === scopeValue88) || null;
  }
  function newScope13(newScope93, newScope94) {
    if (newScope93?.["type"] !== "char") return null;
    const newScope95 = scopeValue11(newScope93, newScope94),
      newScope96 = scopeValue4(newScope93).slice(0, 100),
      newScope97 = (newScope95?.["catalog"] || []).map(newScope99 => newScope99.photoId),
      newScope98 = newScope96.map((newScope100, newScope101) => ({
        photoId: newScope100.id,
        position: newScope101 + 1,
        description: newScope100.description,
        addedAt: newScope100.addedAt,
        current: newScope14(newScope93, newScope100)
      }));
    return newScope95?.["request"]["specified"] && newScope98.sort((newScope102, newScope103) => {
      const newScope104 = newScope105 => newScope97.includes(newScope105) ? newScope97.indexOf(newScope105) : 100;
      return newScope104(newScope102.photoId) - newScope104(newScope103.photoId) || newScope102.position - newScope103.position;
    }), {
      friendId: String(newScope93.id),
      request: newScope95?.["request"] || null,
      catalog: newScope98,
      total: newScope96.length
    };
  }
  function newScope14(newScope106, newScope107) {
    return String(newScope106?.["avatarUpdatedFromGalleryPhotoId"] || "") === newScope107.id || !!newScope107.assetId && newScope107.assetId === newScope106?.["avatarAssetId"] || !!newScope107.url && newScope107.url === newScope106?.["avatarUrl"];
  }
  function newScope15(newScope108, newScope109, newScope110) {
    const newScope111 = String(newScope109 || "").trim();
    if (!newScope111 || newScope108?.["type"] !== "char" || String(newScope108.id) !== newScope110?.["friendId"] || !newScope110.catalog.some(newScope112 => newScope112.photoId === newScope111)) return null;
    return scopeValue12(newScope108, newScope111);
  }
  window.galleryData = Object.freeze({
    DESCRIPTION_LIMIT: scopeValue0,
    safeImageUrl: scopeValue1,
    createPhotoId: scopeValue3,
    normalizeAlbumPhotos: scopeValue4,
    serializeAlbumPhotos: scopeValue5,
    classifyAvatarRequest: scopeValue7,
    buildAvatarCatalog: scopeValue11,
    resolveAlbumPhoto: scopeValue12,
    buildChatCatalog: newScope13,
    isCurrentAvatar: newScope14,
    resolveCatalogPhoto: newScope15
  });
})();
