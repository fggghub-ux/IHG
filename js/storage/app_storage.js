(function () {
  const scopeValue0 = "iiso_app_storage";
  const scopeValue1 = "iiso_app_storage_optimization_shadow_v10";
  const scopeValue2 = "iiso_app_storage_import_shadow_v10";
  const scopeValue3 = "iiso_app_storage_import_rollback_v10";
  const scopeValue4 = 10;
  const scopeValue5 = 10;
  const scopeValue6 = "u2phone";
  const scopeValue7 = 30000;
  const scopeValue8 = 60000;
  const scopeValue9 = {
    meta: "meta",
    settings: "settings",
    accounts: "accounts",
    appState: "app_state",
    theme: "theme",
    worldbooks: "worldbooks",
    assets: "assets",
    imFriends: "im_friends",
    imChatSummaries: "im_chat_summaries",
    imMessages: "im_messages",
    imMoments: "im_moments",
    imMomentMessages: "im_moment_messages",
    imStickers: "im_stickers",
    libraryBooks: "library_books",
    libraryBookContent: "library_book_content",
    libraryPlaylists: "library_playlists",
    libraryTracks: "library_tracks",
    libraryDailyStats: "library_daily_stats",
    appDomains: "app_domains",
    xPosts: "x_posts",
    xThreads: "x_threads",
    xDms: "x_dms",
    xAccountWorlds: "x_account_worlds",
    vectorMemoryIndex: "vector_memory_index",
    storageCheckpoints: "storage_checkpoints",
    privateSessions: "private_sessions"
  };
  const scopeValue10 = Object.values(scopeValue9).filter(scopeValue322 => scopeValue322 !== scopeValue9.privateSessions);
  const scopeValue11 = "imessage";
  const scopeValue12 = 1;
  const scopeValue13 = [scopeValue9.imFriends, scopeValue9.imChatSummaries, scopeValue9.imMessages, scopeValue9.imMoments, scopeValue9.imMomentMessages, scopeValue9.imStickers];
  const scopeValue14 = [scopeValue9.appDomains, scopeValue9.meta, scopeValue9.assets];
  const scopeValue15 = [...scopeValue13, ...scopeValue14];
  const scopeValue16 = {
    schemaVersion: "schema_version",
    appVersion: "app_version",
    imMomentsCoverAssetId: "im_moments_cover_asset_id"
  };
  const scopeValue17 = new Map();
  const scopeValue18 = new Map();
  const scopeValue19 = 120;
  const scopeValue20 = 100 * 1024;
  const scopeValue21 = 32 * 1024;
  const scopeValue22 = 0.1;
  const scopeValue23 = 0.82;
  const scopeValue24 = new Set(["image/jpeg", "image/png", "image/webp"]);
  let scopeValue25 = null;
  const scopeValue26 = new Map();
  const scopeValue27 = new Map();
  const scopeValue28 = new Set();
  const scopeValue29 = new Set();
  const scopeValue30 = {
    status: "initializing",
    pendingWrites: 0,
    lastCommitAt: 0,
    lastError: null,
    migrationVersion: 0,
    lastCompaction: null,
    lastCacheCleanup: null,
    lastOptimization: null,
    lastVoiceCleanup: null,
    lastImageCompression: null
  };
  let scopeValue31 = null;
  let scopeValue32 = null;
  let scopeValue33 = false;
  const scopeValue34 = [];
  let scopeValue41 = false;
  let scopeValue36 = false;
  let scopeValue37 = null;
  let scopeValue38 = false;
  let scopeValue39 = null;
  let scopeValue40 = false;
  let newScope41 = false;
  let scopeValue42 = 0;
  let newScope43 = null;
  let newScope44 = Promise.resolve();
  let newScope45 = 0;
  const newScope46 = new Set();
  let newScope47 = 0;
  let newScope48 = false;
  function newScope49(newScope364) {
    if (!newScope43) {
      let newScope366;
      const newScope367 = new Promise(newScope368 => {
        newScope366 = newScope368;
      });
      newScope43 = {
        promise: newScope367,
        release: newScope366
      };
    }
    newScope45 += 1;
    const newScope365 = newScope44.catch(() => undefined).then(async () => {
      if (scopeValue32) await scopeValue32;
      const newScope369 = await Promise.allSettled(Array.from(newScope46));
      if (newScope369.some(newScope370 => newScope370.status === "rejected")) throw new Error("待保存操作失败，请重试后再整理或迁移数据");
      if (!(await scopeValue116())) throw new Error("待保存数据未完成，请先重试保存");
      while (scopeValue40) await scopeValue45(25);
      return newScope364();
    });
    newScope44 = newScope365;
    return newScope365.finally(() => {
      newScope45 -= 1;
      if (!newScope45) {
        const newScope371 = newScope43;
        newScope43 = null;
        newScope371.release();
        if (scopeValue38) scopeValue305();
      }
    });
  }
  function newScope50(newScope372, newScope373) {
    if (newScope43) return newScope43.promise.then(() => newScope50(newScope372, newScope373));
    const newScope374 = Promise.resolve().then(() => newScope372(...newScope373));
    newScope46.add(newScope374);
    newScope374.finally(() => newScope46.delete(newScope374)).catch(() => undefined);
    return newScope374;
  }
  function scopeValue43(scopeValue323) {
    const scopeValue324 = String(scopeValue323?.name || "");
    const scopeValue325 = String(scopeValue323?.message || scopeValue323 || "");
    return scopeValue324 === "AbortError" || scopeValue324 === "InvalidStateError" || scopeValue324 === "TransactionInactiveError" || /connection|closing|closed|transaction.*inactive|database.*not open/i.test(scopeValue325);
  }
  async function scopeValue44() {
    const scopeValue326 = scopeValue25;
    scopeValue25 = null;
    if (!scopeValue326) return;
    try {
      const scopeValue327 = await scopeValue326;
      scopeValue327?.close();
    } catch (scopeValue328) {}
  }
  function scopeValue45(scopeValue329) {
    return new Promise(scopeValue330 => setTimeout(scopeValue330, scopeValue329));
  }
  async function scopeValue46(scopeValue331, scopeValue332 = {}) {
    const scopeValue333 = Math.max(1, Number(scopeValue332.attempts) || 3);
    let scopeValue334;
    for (let scopeValue335 = 0; scopeValue335 < scopeValue333; scopeValue335 += 1) {
      try {
        return await scopeValue331();
      } catch (scopeValue336) {
        scopeValue334 = scopeValue336;
        if (!scopeValue43(scopeValue336) || scopeValue335 === scopeValue333 - 1) throw scopeValue336;
        const scopeValue337 = String(scopeValue336?.name || "");
        const scopeValue338 = String(scopeValue336?.message || scopeValue336 || "");
        if (scopeValue337 === "InvalidStateError" || /connection|closing|closed|database.*not open/i.test(scopeValue338)) {
          await scopeValue44();
        }
        await scopeValue45(60 * (scopeValue335 + 1));
      }
    }
    throw scopeValue334;
  }
  function scopeValue47(scopeValue339) {
    if (typeof structuredClone === "function") {
      return structuredClone(scopeValue339);
    }
    return JSON.parse(JSON.stringify(scopeValue339));
  }
  function scopeValue48(scopeValue340) {
    return !!(scopeValue340 && typeof scopeValue340 === "object" && typeof Node !== "undefined" && scopeValue340 instanceof Node);
  }
  function scopeValue49(scopeValue341, scopeValue342 = new WeakSet()) {
    if (scopeValue341 == null) return scopeValue341;
    if (typeof scopeValue341 === "function" || typeof scopeValue341 === "symbol") return undefined;
    if (typeof scopeValue341 === "string" && scopeValue64(scopeValue341)) return null;
    if (typeof scopeValue341 !== "object") return scopeValue341;
    if (scopeValue48(scopeValue341)) return undefined;
    if (scopeValue341 instanceof Date) return scopeValue341.toISOString();
    if (typeof Blob !== "undefined" && scopeValue341 instanceof Blob) return scopeValue341;
    if (typeof File !== "undefined" && scopeValue341 instanceof File) return scopeValue341;
    if (scopeValue342.has(scopeValue341)) return undefined;
    scopeValue342.add(scopeValue341);
    if (Array.isArray(scopeValue341)) {
      return scopeValue341.map(scopeValue344 => scopeValue49(scopeValue344, scopeValue342)).filter(scopeValue345 => scopeValue345 !== undefined);
    }
    const scopeValue343 = {};
    Object.keys(scopeValue341).forEach(scopeValue346 => {
      if (scopeValue346.charAt(0) === "_" && scopeValue346 !== "__default__") return;
      const scopeValue347 = scopeValue49(scopeValue341[scopeValue346], scopeValue342);
      if (scopeValue347 !== undefined) scopeValue343[scopeValue346] = scopeValue347;
    });
    return scopeValue343;
  }
  function scopeValue50(scopeValue348) {
    const scopeValue349 = Number(scopeValue348);
    if (!Number.isFinite(scopeValue349)) return 0;
    return Math.max(0, Math.min(100, Math.round(scopeValue349)));
  }
  function scopeValue51(scopeValue350, scopeValue351, scopeValue352) {
    if (typeof scopeValue350 === "function") {
      scopeValue350({
        message: scopeValue351,
        progress: scopeValue50(scopeValue352)
      });
    }
  }
  function scopeValue52(scopeValue353 = [], scopeValue354) {
    const scopeValue355 = Array.isArray(scopeValue353) ? scopeValue353.find(scopeValue356 => scopeValue356 && scopeValue356.key === scopeValue354) : null;
    return scopeValue355 ? scopeValue355.value : undefined;
  }
  function scopeValue53(scopeValue357 = [], scopeValue358) {
    const scopeValue359 = scopeValue52(scopeValue357, scopeValue358);
    if (scopeValue359 === undefined || scopeValue359 === null || scopeValue359 === "") return undefined;
    try {
      return JSON.parse(scopeValue359);
    } catch (scopeValue360) {
      console.warn(`Failed to parse legacy backup key "${scopeValue358}":`, scopeValue360);
      return undefined;
    }
  }
  function scopeValue54(scopeValue361) {
    if (scopeValue361 === undefined || scopeValue361 === null) return undefined;
    try {
      return scopeValue49(JSON.parse(String(scopeValue361)));
    } catch (scopeValue362) {
      return scopeValue64(String(scopeValue361)) ? "" : String(scopeValue361);
    }
  }
  async function scopeValue55(scopeValue363 = []) {
    const scopeValue364 = Array.isArray(scopeValue363) ? scopeValue363.filter(scopeValue366 => scopeValue366?.key) : [];
    if (scopeValue364.length === 0) return {
      migratedKeys: []
    };
    const scopeValue365 = {
      u2_userState: "userState",
      u2_apiConfig: "apiConfig",
      u2_vectorMemoryConfig: "vectorMemoryConfig",
      u2_ttsConfig: "ttsConfig",
      u2_minimaxConfig: "minimaxConfig",
      u2_apiPresets: "apiPresets",
      u2_fetchedModels: "fetchedModels",
      u2_assistiveBallSettings: "assistiveBallSettings",
      u2_accounts: "accounts",
      u2_currentAccountId: "currentAccountId",
      u2_themeState: "themeState",
      u2_worldBooks: "worldBooks",
      u2_wbGroups: "wbGroups"
    };
    await scopeValue83([scopeValue9.appDomains, scopeValue9.meta], "readwrite", async scopeValue367 => {
      const scopeValue368 = scopeValue367[scopeValue9.appDomains];
      const scopeValue369 = await scopeValue77(scopeValue368.get("settings"));
      const scopeValue370 = await scopeValue77(scopeValue368.get("legacy"));
      const scopeValue371 = scopeValue369?.value && typeof scopeValue369.value === "object" ? scopeValue47(scopeValue369.value) : {};
      const scopeValue372 = scopeValue370?.value && typeof scopeValue370.value === "object" ? scopeValue47(scopeValue370.value) : {};
      let scopeValue373 = false;
      let scopeValue374 = false;
      for (const scopeValue377 of scopeValue364) {
        if (scopeValue377.key === "u2_mockAuthSession" || scopeValue377.key === "u2_appState") continue;
        const scopeValue378 = scopeValue54(scopeValue377.value);
        const scopeValue379 = scopeValue365[scopeValue377.key];
        if (scopeValue379) {
          if (!Object.prototype.hasOwnProperty.call(scopeValue371, scopeValue379) && scopeValue378 !== undefined) {
            scopeValue371[scopeValue379] = scopeValue378;
            scopeValue373 = true;
          }
        } else if (!Object.prototype.hasOwnProperty.call(scopeValue372, scopeValue377.key) && scopeValue378 !== undefined) {
          scopeValue372[scopeValue377.key] = scopeValue378;
          scopeValue374 = true;
        }
      }
      const scopeValue375 = scopeValue53(scopeValue364, "u2_appState");
      if (scopeValue375 && typeof scopeValue375 === "object") {
        for (const [scopeValue380, scopeValue381] of Object.entries(scopeValue375)) {
          if (!scopeValue380 || !scopeValue381 || typeof scopeValue381 !== "object") continue;
          const scopeValue382 = await scopeValue77(scopeValue368.get(scopeValue380));
          if (!scopeValue382) {
            scopeValue368.put({
              name: scopeValue380,
              schemaVersion: scopeValue5,
              revision: 1,
              updatedAt: Date.now(),
              value: scopeValue49(scopeValue47(scopeValue381))
            });
          }
        }
      }
      const scopeValue376 = Date.now();
      if (scopeValue373 || !scopeValue369) {
        scopeValue368.put({
          name: "settings",
          schemaVersion: scopeValue5,
          revision: Math.max(0, Number(scopeValue369?.revision) || 0) + 1,
          updatedAt: scopeValue376,
          value: scopeValue49(scopeValue371)
        });
      }
      if (scopeValue374 || !scopeValue370) {
        scopeValue368.put({
          name: "legacy",
          schemaVersion: scopeValue5,
          revision: Math.max(0, Number(scopeValue370?.revision) || 0) + 1,
          updatedAt: scopeValue376,
          value: scopeValue49(scopeValue372)
        });
      }
      scopeValue367[scopeValue9.meta].put({
        key: "legacy_backup_imported_at",
        value: {
          importedAt: scopeValue376,
          keys: scopeValue364.map(scopeValue383 => scopeValue383.key)
        }
      });
    });
    return {
      importedKeys: scopeValue364.map(scopeValue384 => scopeValue384.key)
    };
  }
  function scopeValue56(scopeValue385) {
    try {
      return new Blob([JSON.stringify(scopeValue385)]).size;
    } catch (scopeValue386) {
      try {
        return JSON.stringify(scopeValue385).length;
      } catch (scopeValue387) {
        return 0;
      }
    }
  }
  function scopeValue57(scopeValue388) {
    let scopeValue389 = "";
    try {
      scopeValue389 = JSON.stringify(scopeValue388);
    } catch (scopeValue391) {
      scopeValue389 = String(scopeValue388 || "");
    }
    let scopeValue390 = 2166136261;
    for (let scopeValue392 = 0; scopeValue392 < scopeValue389.length; scopeValue392 += 1) {
      scopeValue390 ^= scopeValue389.charCodeAt(scopeValue392);
      scopeValue390 = Math.imul(scopeValue390, 16777619);
    }
    return (scopeValue390 >>> 0).toString(16).padStart(8, "0");
  }
  function scopeValue58(scopeValue393) {
    if (!scopeValue393) return;
    scopeValue18.set(scopeValue393, Date.now());
  }
  function scopeValue59(scopeValue394) {
    const scopeValue395 = scopeValue17.get(scopeValue394);
    if (scopeValue395) {
      try {
        URL.revokeObjectURL(scopeValue395);
      } catch (scopeValue396) {}
      scopeValue17.delete(scopeValue394);
    }
    scopeValue18.delete(scopeValue394);
  }
  function scopeValue60() {
    try {
      Array.from(scopeValue17.keys()).forEach(scopeValue397 => scopeValue59(scopeValue397));
    } catch (scopeValue398) {}
    scopeValue17.clear();
    scopeValue18.clear();
    return true;
  }
  async function scopeValue61() {
    const scopeValue399 = Array.from(scopeValue17.keys());
    if (scopeValue399.length === 0) return 0;
    let scopeValue400 = 0;
    for (const scopeValue401 of scopeValue399) {
      const scopeValue402 = await scopeValue142(scopeValue401);
      scopeValue400 += Number(scopeValue402?.size) || 0;
    }
    return scopeValue400;
  }
  function scopeValue62(scopeValue403 = scopeValue19) {
    const scopeValue404 = Math.max(0, Number(scopeValue403) || 0);
    if (scopeValue404 === 0) {
      scopeValue60();
      return 0;
    }
    if (scopeValue17.size <= scopeValue404) {
      return scopeValue17.size;
    }
    const scopeValue405 = Array.from(scopeValue17.keys()).sort((scopeValue406, scopeValue407) => (scopeValue18.get(scopeValue406) || 0) - (scopeValue18.get(scopeValue407) || 0)).slice(0, Math.max(0, scopeValue17.size - scopeValue404));
    scopeValue405.forEach(scopeValue408 => scopeValue59(scopeValue408));
    return scopeValue17.size;
  }
  function scopeValue63(scopeValue409) {
    return typeof scopeValue409 === "string" && scopeValue409.startsWith("data:");
  }
  function scopeValue64(scopeValue410) {
    return typeof scopeValue410 === "string" && scopeValue410.startsWith("blob:");
  }
  const scopeValue65 = "netflix-media://";
  function scopeValue66(scopeValue411) {
    const scopeValue412 = scopeValue47(scopeValue411 && typeof scopeValue411 === "object" ? scopeValue411 : {});
    const scopeValue413 = String(scopeValue412.currentAccountId ?? "");
    const scopeValue414 = Array.isArray(scopeValue412.accounts) ? scopeValue412.accounts : [];
    const scopeValue415 = scopeValue412.userState?.avatarUrl;
    const scopeValue416 = scopeValue414.find(scopeValue417 => String(scopeValue417?.id ?? "") === scopeValue413) || scopeValue414.find(scopeValue418 => scopeValue418?.avatarUrl === scopeValue415);
    if (scopeValue416 && scopeValue63(scopeValue415) && scopeValue415 === scopeValue416.avatarUrl) {
      scopeValue412.userState = {
        ...scopeValue412.userState,
        avatarUrl: null
      };
    }
    return scopeValue412;
  }
  function scopeValue67(scopeValue419) {
    const scopeValue420 = scopeValue47(scopeValue419 && typeof scopeValue419 === "object" ? scopeValue419 : {});
    const scopeValue421 = scopeValue420.profile && typeof scopeValue420.profile === "object" ? scopeValue420.profile : {};
    const scopeValue422 = scopeValue421.avatar;
    const scopeValue423 = String(scopeValue421.name || "").trim();
    if (!scopeValue63(scopeValue422)) return scopeValue420;
    const scopeValue424 = scopeValue426 => {
      if (!scopeValue426 || typeof scopeValue426 !== "object") return scopeValue426;
      const scopeValue427 = String(scopeValue426.authorId || "").trim();
      const scopeValue428 = String(scopeValue426.authorName || scopeValue426.name || "").trim();
      const scopeValue429 = scopeValue426.authorAvatar === scopeValue422;
      const scopeValue430 = scopeValue427 === "profile" || !scopeValue427 && scopeValue429 && scopeValue423 && scopeValue428 === scopeValue423;
      const scopeValue431 = {
        ...scopeValue426
      };
      if (scopeValue430 && scopeValue63(scopeValue431.authorAvatar)) {
        scopeValue431.authorId = "profile";
        scopeValue431.authorAvatar = null;
      }
      if (Array.isArray(scopeValue431.replies)) scopeValue431.replies = scopeValue431.replies.map(scopeValue424);
      return scopeValue431;
    };
    const scopeValue425 = scopeValue432 => Array.isArray(scopeValue432) ? scopeValue432.map(scopeValue433 => {
      if (!scopeValue433 || typeof scopeValue433 !== "object") return scopeValue433;
      const scopeValue434 = scopeValue424(scopeValue433);
      if (Array.isArray(scopeValue434.comments)) scopeValue434.comments = scopeValue434.comments.map(scopeValue424);
      return scopeValue434;
    }) : scopeValue432;
    scopeValue420.profile = {
      ...scopeValue421,
      posts: scopeValue425(scopeValue421.posts)
    };
    scopeValue420.videos = scopeValue425(scopeValue420.videos);
    return scopeValue420;
  }
  function scopeValue68(scopeValue435) {
    const scopeValue436 = scopeValue47(scopeValue435 && typeof scopeValue435 === "object" ? scopeValue435 : {});
    const scopeValue437 = scopeValue436.channelState?.userCommunityChannel;
    const scopeValue438 = scopeValue437?.generatedContent?.fanGroup;
    if (scopeValue437 && scopeValue438 && scopeValue63(scopeValue437.avatar) && scopeValue438.avatar === scopeValue437.avatar) {
      scopeValue438.avatar = null;
    }
    return scopeValue436;
  }
  function scopeValue69(scopeValue439) {
    const scopeValue440 = scopeValue47(scopeValue439 && typeof scopeValue439 === "object" ? scopeValue439 : {});
    const scopeValue441 = scopeValue440.mediaLibrary && typeof scopeValue440.mediaLibrary === "object" ? scopeValue440.mediaLibrary : {};
    const scopeValue442 = {};
    const scopeValue443 = new Map();
    let scopeValue444 = 1;
    Object.entries(scopeValue441).forEach(([scopeValue451, scopeValue452]) => {
      const scopeValue453 = String(scopeValue451 || "").trim();
      if (!scopeValue453 || !scopeValue63(scopeValue452)) return;
      scopeValue442[scopeValue453] = scopeValue452;
      scopeValue443.set(scopeValue452, scopeValue453);
      const scopeValue454 = scopeValue453.match(/^media_(\d+)$/);
      if (scopeValue454) scopeValue444 = Math.max(scopeValue444, Number(scopeValue454[1]) + 1);
    });
    const scopeValue445 = scopeValue455 => {
      if (!scopeValue63(scopeValue455)) return scopeValue455;
      let scopeValue456 = scopeValue443.get(scopeValue455);
      if (!scopeValue456) {
        do {
          scopeValue456 = `media_${scopeValue444}`;
          scopeValue444 += 1;
        } while (scopeValue442[scopeValue456]);
        scopeValue442[scopeValue456] = scopeValue455;
        scopeValue443.set(scopeValue455, scopeValue456);
      }
      return `${scopeValue65}${scopeValue456}`;
    };
    const scopeValue446 = scopeValue457 => {
      if (!scopeValue457 || typeof scopeValue457 !== "object") return scopeValue457;
      const scopeValue458 = {
        ...scopeValue457
      };
      if (scopeValue458.setup && typeof scopeValue458.setup === "object") {
        scopeValue458.setup = {
          ...scopeValue458.setup,
          coverUrl: scopeValue445(scopeValue458.setup.coverUrl),
          cast: Array.isArray(scopeValue458.setup.cast) ? scopeValue458.setup.cast.map(scopeValue459 => scopeValue459 && typeof scopeValue459 === "object" ? {
            ...scopeValue459,
            avatar: scopeValue445(scopeValue459.avatar)
          } : scopeValue459) : scopeValue458.setup.cast
        };
      }
      if (Array.isArray(scopeValue458.cast)) {
        scopeValue458.cast = scopeValue458.cast.map(scopeValue460 => scopeValue460 && typeof scopeValue460 === "object" ? {
          ...scopeValue460,
          avatar: scopeValue445(scopeValue460.avatar)
        } : scopeValue460);
      }
      return scopeValue458;
    };
    const scopeValue447 = scopeValue461 => scopeValue461 && typeof scopeValue461 === "object" ? {
      ...scopeValue461,
      run: scopeValue446(scopeValue461.run)
    } : scopeValue461;
    scopeValue440.activeRun = scopeValue446(scopeValue440.activeRun);
    const scopeValue448 = scopeValue440.saveSlots && typeof scopeValue440.saveSlots === "object" ? scopeValue440.saveSlots : {};
    scopeValue440.saveSlots = {
      ...scopeValue448,
      auto: scopeValue447(scopeValue448.auto),
      manual: Array.isArray(scopeValue448.manual) ? scopeValue448.manual.map(scopeValue447) : scopeValue448.manual
    };
    const scopeValue449 = new Set();
    const scopeValue450 = scopeValue462 => {
      if (typeof scopeValue462 === "string" && scopeValue462.startsWith(scopeValue65)) {
        scopeValue449.add(scopeValue462.slice(scopeValue65.length));
        return;
      }
      if (!scopeValue462 || typeof scopeValue462 !== "object") return;
      if (Array.isArray(scopeValue462)) scopeValue462.forEach(scopeValue450);else Object.values(scopeValue462).forEach(scopeValue450);
    };
    scopeValue450(scopeValue440.activeRun);
    scopeValue450(scopeValue440.saveSlots);
    scopeValue440.mediaLibrary = Object.fromEntries(Object.entries(scopeValue442).filter(([scopeValue463]) => scopeValue449.has(scopeValue463)));
    return scopeValue440;
  }
  function scopeValue70(scopeValue464) {
    const scopeValue465 = scopeValue47(scopeValue464 && typeof scopeValue464 === "object" ? scopeValue464 : {});
    const scopeValue466 = scopeValue465.mediaLibrary && typeof scopeValue465.mediaLibrary === "object" ? scopeValue465.mediaLibrary : {};
    const scopeValue467 = scopeValue468 => {
      if (typeof scopeValue468 === "string" && scopeValue468.startsWith(scopeValue65)) {
        return scopeValue466[scopeValue468.slice(scopeValue65.length)] || "";
      }
      if (!scopeValue468 || typeof scopeValue468 !== "object") return scopeValue468;
      if (Array.isArray(scopeValue468)) return scopeValue468.map(scopeValue467);
      return Object.fromEntries(Object.entries(scopeValue468).map(([scopeValue469, scopeValue470]) => [scopeValue469, scopeValue467(scopeValue470)]));
    };
    return scopeValue467(scopeValue465);
  }
  function scopeValue71(scopeValue471, scopeValue472) {
    if (scopeValue471 === "settings") return scopeValue66(scopeValue472);
    if (scopeValue471 === "tiktok") return scopeValue67(scopeValue472);
    if (scopeValue471 === "youtube") return scopeValue68(scopeValue472);
    if (scopeValue471 === "netflix") return scopeValue69(scopeValue472);
    return scopeValue47(scopeValue472 && typeof scopeValue472 === "object" ? scopeValue472 : {});
  }
  function scopeValue72(scopeValue473, scopeValue474) {
    if (!scopeValue473 || !scopeValue473.indexNames) return false;
    if (typeof scopeValue473.indexNames.contains === "function") {
      return scopeValue473.indexNames.contains(scopeValue474);
    }
    return Array.from(scopeValue473.indexNames).includes(scopeValue474);
  }
  function scopeValue73(scopeValue475) {
    const scopeValue476 = String(scopeValue475 || "");
    const scopeValue477 = scopeValue476.indexOf(",");
    if (!scopeValue476.startsWith("data:") || scopeValue477 < 0) throw new Error("Invalid data URL.");
    const scopeValue478 = scopeValue476.slice(0, scopeValue477);
    const scopeValue479 = scopeValue476.slice(scopeValue477 + 1);
    const scopeValue480 = scopeValue478.match(/^data:([^;,]*)/i);
    const scopeValue481 = scopeValue480?.[1] || "application/octet-stream";
    if (/;base64(?:;|$)/i.test(scopeValue478)) {
      let scopeValue482 = scopeValue479.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
      while (scopeValue482.length % 4 !== 0) scopeValue482 += "=";
      const scopeValue483 = atob(scopeValue482);
      const scopeValue484 = new Uint8Array(scopeValue483.length);
      for (let scopeValue485 = 0; scopeValue485 < scopeValue483.length; scopeValue485 += 1) scopeValue484[scopeValue485] = scopeValue483.charCodeAt(scopeValue485);
      return new Blob([scopeValue484], {
        type: scopeValue481
      });
    }
    return new Blob([decodeURIComponent(scopeValue479)], {
      type: scopeValue481
    });
  }
  async function scopeValue74(scopeValue486) {
    if (!scopeValue486 || !globalThis.crypto?.subtle) return "";
    const scopeValue487 = await scopeValue486.arrayBuffer();
    const scopeValue488 = await globalThis.crypto.subtle.digest("SHA-256", scopeValue487);
    return Array.from(new Uint8Array(scopeValue488), scopeValue489 => scopeValue489.toString(16).padStart(2, "0")).join("");
  }
  async function scopeValue75(scopeValue490, scopeValue491 = {}) {
    if (!scopeValue63(scopeValue490)) return null;
    await scopeValue139(scopeValue490);
    const scopeValue492 = scopeValue73(scopeValue490);
    const scopeValue493 = await scopeValue74(scopeValue492);
    const scopeValue494 = String(scopeValue491.fallbackId || `asset_${Date.now()}_${Math.random().toString(36).slice(2)}`);
    const scopeValue495 = scopeValue493 ? `sha256_${scopeValue493}` : scopeValue494;
    await scopeValue83([scopeValue9.assets], "readwrite", async scopeValue496 => {
      const scopeValue497 = await scopeValue77(scopeValue496[scopeValue9.assets].get(scopeValue495));
      if (scopeValue497?.blob && Number(scopeValue497.blob.size) === Number(scopeValue492.size)) return;
      scopeValue496[scopeValue9.assets].put({
        id: scopeValue495,
        blob: scopeValue492,
        sha256: scopeValue493 || null,
        mimeType: scopeValue492.type || scopeValue491.mimeType || "application/octet-stream",
        createdAt: Number(scopeValue497?.createdAt) || Date.now(),
        updatedAt: Date.now(),
        ...scopeValue491,
        fallbackId: undefined
      });
    });
    return scopeValue495;
  }
  function scopeValue76(scopeValue498) {
    return new Promise((scopeValue499, scopeValue500) => {
      const scopeValue501 = new FileReader();
      scopeValue501.onload = () => scopeValue499(scopeValue501.result);
      scopeValue501.onerror = scopeValue500;
      scopeValue501.readAsDataURL(scopeValue498);
    });
  }
  function scopeValue77(scopeValue502) {
    return new Promise((scopeValue503, scopeValue504) => {
      scopeValue502.onsuccess = () => scopeValue503(scopeValue502.result);
      scopeValue502.onerror = () => scopeValue504(scopeValue502.error);
    });
  }
  function scopeValue78(scopeValue505) {
    return new Promise(scopeValue506 => {
      if (!window.indexedDB || !scopeValue505) {
        scopeValue506({
          name: scopeValue505,
          deleted: false,
          reason: "indexeddb_unavailable"
        });
        return;
      }
      let scopeValue507 = false;
      const scopeValue508 = window.indexedDB.deleteDatabase(scopeValue505);
      scopeValue508.onsuccess = () => {
        if (scopeValue507) return;
        scopeValue507 = true;
        scopeValue506({
          name: scopeValue505,
          deleted: true,
          reason: "deleted"
        });
      };
      scopeValue508.onerror = () => {
        if (scopeValue507) return;
        scopeValue507 = true;
        scopeValue506({
          name: scopeValue505,
          deleted: false,
          reason: scopeValue508.error?.message || scopeValue508.error?.name || "delete_error"
        });
      };
      scopeValue508.onblocked = () => {
        if (scopeValue507) return;
        scopeValue507 = true;
        scopeValue506({
          name: scopeValue505,
          deleted: false,
          reason: "blocked"
        });
      };
    });
  }
  async function scopeValue79() {
    if (!window.caches || typeof window.caches.keys !== "function") {
      return [];
    }
    try {
      const scopeValue509 = await window.caches.keys();
      const scopeValue510 = [];
      for (const scopeValue511 of scopeValue509) {
        const scopeValue512 = await window.caches.delete(scopeValue511);
        scopeValue510.push({
          name: scopeValue511,
          deleted: !!scopeValue512
        });
      }
      return scopeValue510;
    } catch (scopeValue513) {
      return [{
        name: "*",
        deleted: false,
        reason: scopeValue513?.message || "cache_clear_failed"
      }];
    }
  }
  async function scopeValue80() {
    if (!navigator.serviceWorker || typeof navigator.serviceWorker.getRegistrations !== "function") {
      return [];
    }
    try {
      const scopeValue514 = await navigator.serviceWorker.getRegistrations();
      const scopeValue515 = [];
      for (const scopeValue516 of scopeValue514) {
        const scopeValue517 = scopeValue516?.scope || "unknown";
        const scopeValue518 = await scopeValue516.unregister();
        scopeValue515.push({
          scope: scopeValue517,
          unregistered: !!scopeValue518
        });
      }
      return scopeValue515;
    } catch (scopeValue519) {
      return [{
        scope: "*",
        unregistered: false,
        reason: scopeValue519?.message || "sw_unregister_failed"
      }];
    }
  }
  function scopeValue81(scopeValue520 = scopeValue0) {
    return new Promise((scopeValue521, scopeValue522) => {
      if (!window.indexedDB) {
        scopeValue522(new Error("IndexedDB is not supported in this browser."));
        return;
      }
      const scopeValue523 = window.indexedDB.open(scopeValue520, scopeValue4);
      scopeValue523.onerror = () => {
        scopeValue25 = null;
        scopeValue522(scopeValue523.error);
      };
      scopeValue523.onupgradeneeded = scopeValue524 => {
        const scopeValue525 = scopeValue524.target.result;
        if (!scopeValue525.objectStoreNames.contains(scopeValue9.meta)) {
          scopeValue525.createObjectStore(scopeValue9.meta, {
            keyPath: "key"
          });
        }
        if (!scopeValue525.objectStoreNames.contains(scopeValue9.settings)) {
          scopeValue525.createObjectStore(scopeValue9.settings, {
            keyPath: "key"
          });
        }
        if (!scopeValue525.objectStoreNames.contains(scopeValue9.accounts)) {
          scopeValue525.createObjectStore(scopeValue9.accounts, {
            keyPath: "id"
          });
        }
        if (!scopeValue525.objectStoreNames.contains(scopeValue9.appState)) {
          scopeValue525.createObjectStore(scopeValue9.appState, {
            keyPath: "key"
          });
        }
        if (!scopeValue525.objectStoreNames.contains(scopeValue9.theme)) {
          scopeValue525.createObjectStore(scopeValue9.theme, {
            keyPath: "key"
          });
        }
        if (!scopeValue525.objectStoreNames.contains(scopeValue9.worldbooks)) {
          scopeValue525.createObjectStore(scopeValue9.worldbooks, {
            keyPath: "key"
          });
        }
        if (!scopeValue525.objectStoreNames.contains(scopeValue9.assets)) {
          scopeValue525.createObjectStore(scopeValue9.assets, {
            keyPath: "id"
          });
        }
        if (!scopeValue525.objectStoreNames.contains(scopeValue9.imFriends)) {
          scopeValue525.createObjectStore(scopeValue9.imFriends, {
            keyPath: "id"
          });
        }
        if (!scopeValue525.objectStoreNames.contains(scopeValue9.imChatSummaries)) {
          scopeValue525.createObjectStore(scopeValue9.imChatSummaries, {
            keyPath: "friendId"
          });
        }
        if (!scopeValue525.objectStoreNames.contains(scopeValue9.imMessages)) {
          const scopeValue526 = scopeValue525.createObjectStore(scopeValue9.imMessages, {
            keyPath: "id"
          });
          scopeValue526.createIndex("friendId", "friendId", {
            unique: false
          });
          scopeValue526.createIndex("friendId_timestamp", ["friendId", "timestamp"], {
            unique: false
          });
          scopeValue526.createIndex("friendId_order", ["friendId", "order"], {
            unique: false
          });
        } else {
          const scopeValue527 = scopeValue524.target.transaction;
          if (scopeValue527) {
            const scopeValue528 = scopeValue527.objectStore(scopeValue9.imMessages);
            if (!scopeValue72(scopeValue528, "friendId")) {
              scopeValue528.createIndex("friendId", "friendId", {
                unique: false
              });
            }
            if (!scopeValue72(scopeValue528, "friendId_timestamp")) {
              scopeValue528.createIndex("friendId_timestamp", ["friendId", "timestamp"], {
                unique: false
              });
            }
            if (!scopeValue72(scopeValue528, "friendId_order")) {
              scopeValue528.createIndex("friendId_order", ["friendId", "order"], {
                unique: false
              });
            }
          }
        }
        if (!scopeValue525.objectStoreNames.contains(scopeValue9.imMoments)) {
          const scopeValue529 = scopeValue525.createObjectStore(scopeValue9.imMoments, {
            keyPath: "id"
          });
          scopeValue529.createIndex("userId", "userId", {
            unique: false
          });
          scopeValue529.createIndex("time", "time", {
            unique: false
          });
        }
        if (!scopeValue525.objectStoreNames.contains(scopeValue9.imMomentMessages)) {
          const scopeValue530 = scopeValue525.createObjectStore(scopeValue9.imMomentMessages, {
            keyPath: "id"
          });
          scopeValue530.createIndex("time", "time", {
            unique: false
          });
        }
        if (!scopeValue525.objectStoreNames.contains(scopeValue9.imStickers)) {
          scopeValue525.createObjectStore(scopeValue9.imStickers, {
            keyPath: "categoryName"
          });
        }
        if (!scopeValue525.objectStoreNames.contains(scopeValue9.libraryBooks)) {
          const scopeValue531 = scopeValue525.createObjectStore(scopeValue9.libraryBooks, {
            keyPath: "id"
          });
          scopeValue531.createIndex("updatedAt", "updatedAt", {
            unique: false
          });
        }
        if (!scopeValue525.objectStoreNames.contains(scopeValue9.libraryBookContent)) {
          scopeValue525.createObjectStore(scopeValue9.libraryBookContent, {
            keyPath: "id"
          });
        }
        if (!scopeValue525.objectStoreNames.contains(scopeValue9.libraryPlaylists)) {
          const scopeValue532 = scopeValue525.createObjectStore(scopeValue9.libraryPlaylists, {
            keyPath: "id"
          });
          scopeValue532.createIndex("updatedAt", "updatedAt", {
            unique: false
          });
        }
        if (!scopeValue525.objectStoreNames.contains(scopeValue9.libraryTracks)) {
          const scopeValue533 = scopeValue525.createObjectStore(scopeValue9.libraryTracks, {
            keyPath: "id"
          });
          scopeValue533.createIndex("playlistId", "playlistId", {
            unique: false
          });
          scopeValue533.createIndex("updatedAt", "updatedAt", {
            unique: false
          });
        }
        if (!scopeValue525.objectStoreNames.contains(scopeValue9.libraryDailyStats)) {
          const scopeValue534 = scopeValue525.createObjectStore(scopeValue9.libraryDailyStats, {
            keyPath: "id"
          });
          scopeValue534.createIndex("date", "date", {
            unique: false
          });
          scopeValue534.createIndex("kind", "kind", {
            unique: false
          });
          scopeValue534.createIndex("date_kind", ["date", "kind"], {
            unique: false
          });
        }
        if (!scopeValue525.objectStoreNames.contains(scopeValue9.privateSessions)) {
          scopeValue525.createObjectStore(scopeValue9.privateSessions, {
            keyPath: "key"
          });
        }
        if (!scopeValue525.objectStoreNames.contains(scopeValue9.appDomains)) {
          const scopeValue535 = scopeValue525.createObjectStore(scopeValue9.appDomains, {
            keyPath: "name"
          });
          scopeValue535.createIndex("updatedAt", "updatedAt", {
            unique: false
          });
        }
        if (!scopeValue525.objectStoreNames.contains(scopeValue9.xPosts)) {
          const scopeValue536 = scopeValue525.createObjectStore(scopeValue9.xPosts, {
            keyPath: "id"
          });
          scopeValue536.createIndex("createdAt", "createdAt", {
            unique: false
          });
          scopeValue536.createIndex("authorId", "authorId", {
            unique: false
          });
          scopeValue536.createIndex("topicTag", "topicTag", {
            unique: false
          });
        }
        if (!scopeValue525.objectStoreNames.contains(scopeValue9.xThreads)) {
          scopeValue525.createObjectStore(scopeValue9.xThreads, {
            keyPath: "postId"
          });
        }
        if (!scopeValue525.objectStoreNames.contains(scopeValue9.xDms)) {
          const scopeValue537 = scopeValue525.createObjectStore(scopeValue9.xDms, {
            keyPath: "id"
          });
          scopeValue537.createIndex("updatedAt", "updatedAt", {
            unique: false
          });
        }
        if (!scopeValue525.objectStoreNames.contains(scopeValue9.xAccountWorlds)) {
          const scopeValue538 = scopeValue525.createObjectStore(scopeValue9.xAccountWorlds, {
            keyPath: "accountId"
          });
          scopeValue538.createIndex("updatedAt", "updatedAt", {
            unique: false
          });
        }
        if (!scopeValue525.objectStoreNames.contains(scopeValue9.vectorMemoryIndex)) {
          const scopeValue539 = scopeValue525.createObjectStore(scopeValue9.vectorMemoryIndex, {
            keyPath: "id"
          });
          scopeValue539.createIndex("scopeFriendKey", "scopeFriendKey", {
            unique: false
          });
          scopeValue539.createIndex("scopeKey", "scopeKey", {
            unique: false
          });
        } else {
          const scopeValue540 = scopeValue524.target.transaction;
          if (scopeValue540) {
            const scopeValue541 = scopeValue540.objectStore(scopeValue9.vectorMemoryIndex);
            if (!scopeValue72(scopeValue541, "scopeFriendKey")) {
              scopeValue541.createIndex("scopeFriendKey", "scopeFriendKey", {
                unique: false
              });
            }
            if (!scopeValue72(scopeValue541, "scopeKey")) {
              scopeValue541.createIndex("scopeKey", "scopeKey", {
                unique: false
              });
            }
          }
        }
        if (!scopeValue525.objectStoreNames.contains(scopeValue9.storageCheckpoints)) {
          scopeValue525.createObjectStore(scopeValue9.storageCheckpoints, {
            keyPath: "id"
          });
        }
      };
      scopeValue523.onsuccess = () => {
        const scopeValue542 = scopeValue523.result;
        scopeValue542.onversionchange = () => {
          try {
            scopeValue542.close();
          } catch (scopeValue543) {}
          scopeValue25 = null;
        };
        scopeValue521(scopeValue542);
      };
    });
  }
  function scopeValue82() {
    if (!scopeValue25) {
      scopeValue25 = scopeValue81().catch(scopeValue544 => {
        scopeValue25 = null;
        throw scopeValue544;
      });
    }
    return scopeValue25;
  }
  async function scopeValue83(scopeValue545, scopeValue546, scopeValue547) {
    const scopeValue548 = await scopeValue82();
    return new Promise((scopeValue549, scopeValue550) => {
      const scopeValue551 = scopeValue548.transaction(scopeValue545, scopeValue546);
      const scopeValue552 = {};
      scopeValue545.forEach(scopeValue554 => {
        scopeValue552[scopeValue554] = scopeValue551.objectStore(scopeValue554);
      });
      let scopeValue553;
      try {
        scopeValue553 = scopeValue547(scopeValue552, scopeValue551);
      } catch (scopeValue555) {
        scopeValue550(scopeValue555);
        return;
      }
      Promise.resolve(scopeValue553).catch(() => undefined);
      scopeValue551.oncomplete = async () => {
        if (scopeValue546 === "readwrite") scopeValue306();
        try {
          const scopeValue556 = await Promise.resolve(scopeValue553);
          scopeValue549(scopeValue556);
        } catch (scopeValue557) {
          scopeValue550(scopeValue557);
        }
      };
      scopeValue551.onerror = () => scopeValue550(scopeValue551.error);
      scopeValue551.onabort = () => scopeValue550(scopeValue551.error || new Error("Transaction aborted"));
    });
  }
  async function scopeValue84(scopeValue558, scopeValue559) {
    return scopeValue83([scopeValue558], "readonly", async scopeValue560 => {
      const scopeValue561 = await scopeValue77(scopeValue560[scopeValue558].get(scopeValue559));
      return scopeValue561 || null;
    });
  }
  async function scopeValue85(scopeValue562, scopeValue563) {
    return scopeValue83([scopeValue562], "readwrite", scopeValue564 => {
      scopeValue564[scopeValue562].put(scopeValue563);
    });
  }
  async function scopeValue86(scopeValue565, scopeValue566) {
    return scopeValue83([scopeValue565], "readwrite", scopeValue567 => {
      scopeValue567[scopeValue565].delete(scopeValue566);
    });
  }
  async function scopeValue87(scopeValue568) {
    return scopeValue83([scopeValue568], "readonly", async scopeValue569 => {
      const scopeValue570 = await scopeValue77(scopeValue569[scopeValue568].getAll());
      return Array.isArray(scopeValue570) ? scopeValue570 : [];
    });
  }
  async function scopeValue88() {
    if (!window.indexedDB) return null;
    if (typeof window.indexedDB.databases === "function") {
      try {
        const scopeValue573 = await window.indexedDB.databases();
        if (!scopeValue573.some(scopeValue574 => scopeValue574?.name === scopeValue1)) return null;
      } catch (scopeValue575) {}
    }
    const scopeValue571 = await scopeValue81(scopeValue1);
    const scopeValue572 = await new Promise((scopeValue576, scopeValue577) => {
      const scopeValue578 = scopeValue571.transaction(scopeValue9.meta, "readonly").objectStore(scopeValue9.meta).get("optimization_shadow_ready");
      scopeValue578.onsuccess = () => scopeValue576(scopeValue578.result?.value || null);
      scopeValue578.onerror = () => scopeValue577(scopeValue578.error);
    });
    if (!scopeValue572) {
      scopeValue571.close();
      await scopeValue78(scopeValue1);
      return null;
    }
    return {
      db: scopeValue571,
      marker: scopeValue572
    };
  }
  async function scopeValue89(scopeValue579, scopeValue580) {
    return new Promise((scopeValue581, scopeValue582) => {
      const scopeValue583 = scopeValue579.transaction(scopeValue580, "readonly").objectStore(scopeValue580).getAll();
      scopeValue583.onsuccess = () => scopeValue581(Array.isArray(scopeValue583.result) ? scopeValue583.result : []);
      scopeValue583.onerror = () => scopeValue582(scopeValue583.error);
    });
  }
  function scopeValue90(scopeValue584, scopeValue585 = []) {
    const scopeValue586 = scopeValue259[scopeValue584];
    return (Array.isArray(scopeValue585) ? scopeValue585 : []).slice().sort((scopeValue587, scopeValue588) => {
      const scopeValue589 = String(scopeValue587?.[scopeValue586] ?? "");
      const scopeValue590 = String(scopeValue588?.[scopeValue586] ?? "");
      if (scopeValue589 < scopeValue590) return -1;
      if (scopeValue589 > scopeValue590) return 1;
      return 0;
    });
  }
  async function scopeValue91(scopeValue591, scopeValue592) {
    const scopeValue593 = scopeValue90(scopeValue591, scopeValue592);
    let scopeValue594 = scopeValue593;
    if (scopeValue591 === scopeValue9.assets) {
      scopeValue594 = [];
      for (const scopeValue595 of scopeValue593) {
        const scopeValue596 = scopeValue595?.blob;
        scopeValue594.push({
          ...scopeValue595,
          blob: scopeValue596 ? {
            size: Number(scopeValue596.size) || 0,
            type: scopeValue596.type || "",
            sha256: scopeValue595.sha256 || (await scopeValue74(scopeValue596))
          } : null
        });
      }
    }
    return {
      count: scopeValue593.length,
      bytes: scopeValue593.reduce((scopeValue597, scopeValue598) => scopeValue597 + scopeValue291(scopeValue598), 0),
      checksum: scopeValue57(scopeValue594)
    };
  }
  async function scopeValue92(scopeValue599, scopeValue600, scopeValue601) {
    return new Promise((scopeValue602, scopeValue603) => {
      const scopeValue604 = scopeValue599.transaction(scopeValue600, "readwrite");
      const scopeValue605 = scopeValue604.objectStore(scopeValue600);
      scopeValue605.clear();
      scopeValue601.forEach(scopeValue606 => scopeValue605.put(scopeValue606));
      scopeValue604.oncomplete = () => scopeValue602(true);
      scopeValue604.onerror = () => scopeValue603(scopeValue604.error);
      scopeValue604.onabort = () => scopeValue603(scopeValue604.error || new Error(`Copy aborted for ${scopeValue600}`));
    });
  }
  async function scopeValue93(scopeValue607, scopeValue608, scopeValue609, scopeValue610 = 0, scopeValue611 = 100) {
    const scopeValue612 = {};
    const scopeValue613 = Object.values(scopeValue9);
    for (let scopeValue614 = 0; scopeValue614 < scopeValue613.length; scopeValue614 += 1) {
      const scopeValue615 = scopeValue613[scopeValue614];
      const scopeValue616 = await scopeValue89(scopeValue607, scopeValue615);
      const scopeValue617 = scopeValue615 === scopeValue9.meta ? scopeValue616.filter(scopeValue621 => scopeValue621?.key !== "optimization_shadow_ready" && scopeValue621?.key !== "optimization_restore_complete") : scopeValue616;
      const scopeValue618 = await scopeValue91(scopeValue615, scopeValue617);
      await scopeValue92(scopeValue608, scopeValue615, scopeValue617);
      const scopeValue619 = await scopeValue89(scopeValue608, scopeValue615);
      const scopeValue620 = await scopeValue91(scopeValue615, scopeValue619);
      if (scopeValue618.count !== scopeValue620.count || scopeValue618.bytes !== scopeValue620.bytes || scopeValue618.checksum !== scopeValue620.checksum) {
        throw new Error(`Storage verification failed for ${scopeValue615}.`);
      }
      scopeValue612[scopeValue615] = scopeValue620;
      scopeValue51(scopeValue609, `校验 ${scopeValue615} (${scopeValue620.count})...`, scopeValue610 + (scopeValue614 + 1) / scopeValue613.length * scopeValue611);
    }
    return scopeValue612;
  }
  async function scopeValue94(scopeValue622, scopeValue623, scopeValue624) {
    return new Promise((scopeValue625, scopeValue626) => {
      const scopeValue627 = scopeValue622.transaction(scopeValue9.meta, "readwrite");
      scopeValue627.objectStore(scopeValue9.meta).put({
        key: scopeValue623,
        value: scopeValue624
      });
      scopeValue627.oncomplete = () => scopeValue625(true);
      scopeValue627.onerror = () => scopeValue626(scopeValue627.error);
      scopeValue627.onabort = () => scopeValue626(scopeValue627.error || new Error(`Meta write aborted for ${scopeValue623}`));
    });
  }
  function scopeValue95(scopeValue628) {
    scopeValue29.forEach(scopeValue629 => {
      try {
        scopeValue629(scopeValue47(scopeValue628));
      } catch (scopeValue630) {
        console.warn("[appStorage] storage subscriber failed", scopeValue630);
      }
    });
    try {
      window.dispatchEvent(new CustomEvent("u2-storage-status", {
        detail: scopeValue47(scopeValue628)
      }));
    } catch (scopeValue631) {}
  }
  function scopeValue96(scopeValue632) {
    scopeValue28.add(scopeValue632);
    scopeValue30.pendingWrites = scopeValue28.size;
    scopeValue30.status = "saving";
    scopeValue95({
      ...scopeValue30
    });
    scopeValue632.finally(() => {
      scopeValue28.delete(scopeValue632);
      scopeValue30.pendingWrites = scopeValue28.size;
      if (scopeValue28.size === 0 && scopeValue30.status !== "error") {
        scopeValue30.status = "saved";
      }
      scopeValue95({
        ...scopeValue30
      });
    }).catch(() => undefined);
    return scopeValue632;
  }
  function scopeValue97(scopeValue633, scopeValue634 = null) {
    if (!scopeValue633 || !scopeValue26.has(String(scopeValue633))) return scopeValue47(scopeValue634);
    return scopeValue47(scopeValue26.get(String(scopeValue633)));
  }
  function scopeValue98(scopeValue635 = {}) {
    const scopeValue636 = scopeValue635 && typeof scopeValue635 === "object" ? scopeValue47(scopeValue635) : {};
    delete scopeValue636.xGeneratedPosts;
    delete scopeValue636.xPostThreads;
    delete scopeValue636.xDirectMessages;
    return scopeValue636;
  }
  function scopeValue99(scopeValue637 = {}) {
    const scopeValue638 = scopeValue637 && typeof scopeValue637 === "object" ? scopeValue47(scopeValue637) : {};
    delete scopeValue638.xPlayerAccounts;
    delete scopeValue638.activeXPlayerAccountId;
    delete scopeValue638.xAccountSchemaVersion;
    return scopeValue638;
  }
  function scopeValue100(scopeValue639 = {}) {
    return String(scopeValue639?.activeXPlayerAccountId || "legacy").trim().replace(/[^a-z0-9_-]+/gi, "-").slice(0, 80) || "legacy";
  }
  function scopeValue101(scopeValue640, scopeValue641, scopeValue642, scopeValue643 = {}) {
    const scopeValue644 = scopeValue73(scopeValue642);
    scopeValue640.put({
      id: scopeValue641,
      blob: scopeValue644,
      mimeType: scopeValue644.type || "application/octet-stream",
      updatedAt: Date.now(),
      ...scopeValue643
    });
  }
  function scopeValue102(scopeValue645, scopeValue646) {
    const scopeValue647 = scopeValue47(scopeValue645 && typeof scopeValue645 === "object" ? scopeValue645 : {});
    const scopeValue648 = scopeValue100(scopeValue647);
    const scopeValue649 = scopeValue652 => `x_account_${scopeValue648}_${scopeValue652}`;
    const scopeValue650 = (scopeValue653, scopeValue654, scopeValue655, scopeValue656, scopeValue657) => {
      if (!scopeValue653 || !scopeValue63(scopeValue653[scopeValue654])) return;
      scopeValue101(scopeValue646, scopeValue656, scopeValue653[scopeValue654], scopeValue657);
      scopeValue653[scopeValue655] = scopeValue656;
      scopeValue653[scopeValue654] = null;
    };
    scopeValue650(scopeValue647.xData, "avatar", "avatarAssetId", scopeValue649("profile_avatar"), {
      ownerType: "x_profile",
      ownerId: scopeValue648,
      field: "avatar"
    });
    scopeValue650(scopeValue647.xData, "banner", "bannerAssetId", scopeValue649("profile_banner"), {
      ownerType: "x_profile",
      ownerId: scopeValue648,
      field: "banner"
    });
    scopeValue650(scopeValue647, "xHomeBannerUrl", "xHomeBannerAssetId", scopeValue649("home_banner"), {
      ownerType: "x_app",
      ownerId: scopeValue648,
      field: "homeBanner"
    });
    scopeValue650(scopeValue647, "xSearchBannerUrl", "xSearchBannerAssetId", scopeValue649("search_banner"), {
      ownerType: "x_app",
      ownerId: scopeValue648,
      field: "searchBanner"
    });
    (Array.isArray(scopeValue647.xPlayerAccounts) ? scopeValue647.xPlayerAccounts : []).forEach((scopeValue658, scopeValue659) => {
      const scopeValue660 = String(scopeValue658?.id || `account-${scopeValue659}`).replace(/[^a-z0-9_-]+/gi, "-").slice(0, 80) || `account-${scopeValue659}`;
      scopeValue650(scopeValue658, "avatar", "avatarAssetId", `x_account_${scopeValue660}_switcher_avatar`, {
        ownerType: "x_account",
        ownerId: scopeValue660,
        field: "avatar"
      });
    });
    (Array.isArray(scopeValue647.xTopics) ? scopeValue647.xTopics : []).forEach((scopeValue661, scopeValue662) => {
      const scopeValue663 = String(scopeValue661?.id ?? scopeValue661?.name ?? scopeValue662);
      scopeValue650(scopeValue661, "avatar", "avatarAssetId", scopeValue649(`topic_${scopeValue663}_avatar`), {
        ownerType: "x_topic",
        ownerId: scopeValue663,
        accountId: scopeValue648,
        field: "avatar"
      });
      scopeValue650(scopeValue661, "banner", "bannerAssetId", scopeValue649(`topic_${scopeValue663}_banner`), {
        ownerType: "x_topic",
        ownerId: scopeValue663,
        accountId: scopeValue648,
        field: "banner"
      });
    });
    const scopeValue651 = String(scopeValue647.xData?.avatarAssetId || "");
    (Array.isArray(scopeValue647.xGeneratedPosts) ? scopeValue647.xGeneratedPosts : []).forEach((scopeValue664, scopeValue665) => {
      const scopeValue666 = String(scopeValue664?.id ?? scopeValue665);
      if (String(scopeValue664?.authorId || "") === "me" && scopeValue651) {
        scopeValue664.authorAvatarAssetId = scopeValue651;
        scopeValue664.authorAvatar = null;
      } else {
        scopeValue650(scopeValue664, "authorAvatar", "authorAvatarAssetId", scopeValue649(`post_${scopeValue666}_author`), {
          ownerType: "x_post",
          ownerId: scopeValue666,
          accountId: scopeValue648,
          field: "authorAvatar"
        });
      }
      (Array.isArray(scopeValue664?.images) ? scopeValue664.images : []).forEach((scopeValue667, scopeValue668) => {
        if (!scopeValue667 || typeof scopeValue667 !== "object" || !scopeValue63(scopeValue667.url)) return;
        const scopeValue669 = String(scopeValue667.assetId || scopeValue649(`post_${scopeValue666}_image_${scopeValue668}`));
        scopeValue101(scopeValue646, scopeValue669, scopeValue667.url, {
          ownerType: "x_post",
          ownerId: scopeValue666,
          accountId: scopeValue648,
          field: "images",
          index: scopeValue668
        });
        scopeValue667.assetId = scopeValue669;
        scopeValue667.url = null;
      });
    });
    [...(Array.isArray(scopeValue647.xAccounts) ? scopeValue647.xAccounts : []), ...(Array.isArray(scopeValue647.xDirectMessages) ? scopeValue647.xDirectMessages : [])].forEach((scopeValue670, scopeValue671) => {
      const scopeValue672 = String(scopeValue670?.id ?? scopeValue671).replace(/[^a-z0-9_-]+/gi, "-").slice(0, 80) || `char-${scopeValue671}`;
      scopeValue650(scopeValue670, "avatar", "avatarAssetId", scopeValue649(`char_${scopeValue672}_avatar`), {
        ownerType: "x_char_profile",
        ownerId: String(scopeValue670?.id ?? scopeValue671),
        accountId: scopeValue648,
        field: "avatar"
      });
      scopeValue650(scopeValue670, "coverImage", "coverImageAssetId", scopeValue649(`char_${scopeValue672}_cover`), {
        ownerType: "x_char_profile",
        ownerId: String(scopeValue670?.id ?? scopeValue671),
        accountId: scopeValue648,
        field: "coverImage"
      });
      scopeValue650(scopeValue670, "profileImageFaceReferenceUrl", "profileImageFaceReferenceAssetId", scopeValue649(`char_${scopeValue672}_profile_face`), {
        ownerType: "x_char_profile_face",
        ownerId: String(scopeValue670?.id ?? scopeValue671),
        accountId: scopeValue648
      });
      (Array.isArray(scopeValue670?.profilePosts) ? scopeValue670.profilePosts : []).forEach((scopeValue673, scopeValue674) => {
        const scopeValue675 = String(scopeValue673?.id ?? scopeValue674).replace(/[^a-z0-9_-]+/gi, "-").slice(0, 100) || `post-${scopeValue674}`;
        (Array.isArray(scopeValue673?.images) ? scopeValue673.images : []).forEach((scopeValue676, scopeValue677) => {
          if (!scopeValue676 || typeof scopeValue676 !== "object" || !scopeValue63(scopeValue676.url)) return;
          const scopeValue678 = String(scopeValue676.assetId || scopeValue649(`char_${scopeValue672}_profile_post_${scopeValue675}_image_${scopeValue677}`));
          scopeValue101(scopeValue646, scopeValue678, scopeValue676.url, {
            ownerType: "x_char_profile_post",
            ownerId: scopeValue675,
            charId: String(scopeValue670?.id ?? scopeValue671),
            accountId: scopeValue648,
            field: "images",
            index: scopeValue677
          });
          scopeValue676.assetId = scopeValue678;
          scopeValue676.url = null;
        });
      });
    });
    return scopeValue647;
  }
  function scopeValue103(scopeValue679, scopeValue680) {
    return String(scopeValue679 || "").trim().replace(/[^a-z0-9_-]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 100) || scopeValue680;
  }
  function scopeValue104(scopeValue681, scopeValue682) {
    const scopeValue683 = scopeValue103(scopeValue681, "widget");
    const scopeValue684 = scopeValue103(scopeValue682, "image");
    return `desktop_widget_${scopeValue683}_${scopeValue684}`;
  }
  function scopeValue105(scopeValue685, scopeValue686) {
    const scopeValue687 = scopeValue47(scopeValue685 && typeof scopeValue685 === "object" ? scopeValue685 : {});
    const scopeValue688 = scopeValue687.widgets && typeof scopeValue687.widgets === "object" && !Array.isArray(scopeValue687.widgets) ? scopeValue687.widgets : null;
    if (!scopeValue688) return scopeValue687;
    Object.entries(scopeValue688).forEach(([scopeValue689, scopeValue690]) => {
      if (!scopeValue690 || typeof scopeValue690 !== "object" || Array.isArray(scopeValue690)) return;
      const scopeValue691 = scopeValue690.images && typeof scopeValue690.images === "object" && !Array.isArray(scopeValue690.images) ? {
        ...scopeValue690.images
      } : {};
      const scopeValue692 = scopeValue690.imageAssetIds && typeof scopeValue690.imageAssetIds === "object" && !Array.isArray(scopeValue690.imageAssetIds) ? {
        ...scopeValue690.imageAssetIds
      } : {};
      const scopeValue693 = new Set([...Object.keys(scopeValue691), ...Object.keys(scopeValue692)]);
      scopeValue693.forEach(scopeValue694 => {
        const scopeValue695 = scopeValue691[scopeValue694];
        if (scopeValue63(scopeValue695)) {
          const scopeValue696 = String(scopeValue692[scopeValue694] || "");
          const scopeValue697 = scopeValue696.startsWith("desktop_theme_") ? scopeValue104(scopeValue689, scopeValue694) : scopeValue696 || scopeValue104(scopeValue689, scopeValue694);
          scopeValue101(scopeValue686, scopeValue697, scopeValue695, {
            ownerType: "desktop_widget",
            ownerId: String(scopeValue689),
            field: String(scopeValue694)
          });
          scopeValue692[scopeValue694] = scopeValue697;
          scopeValue691[scopeValue694] = null;
          return;
        }
        if (scopeValue64(scopeValue695)) {
          scopeValue691[scopeValue694] = null;
          return;
        }
        if (typeof scopeValue695 === "string" && scopeValue695.trim()) delete scopeValue692[scopeValue694];
      });
      scopeValue690.images = scopeValue691;
      if (Object.keys(scopeValue692).length > 0) scopeValue690.imageAssetIds = scopeValue692;else delete scopeValue690.imageAssetIds;
    });
    return scopeValue687;
  }
  async function scopeValue106(scopeValue698) {
    const scopeValue699 = scopeValue47(scopeValue698 && typeof scopeValue698 === "object" ? scopeValue698 : {});
    const scopeValue700 = async (scopeValue701, scopeValue702, scopeValue703) => {
      if (scopeValue701?.[scopeValue703] && !scopeValue701[scopeValue702]) scopeValue701[scopeValue702] = await scopeValue143(scopeValue701[scopeValue703]);
    };
    await scopeValue700(scopeValue699.xData, "avatar", "avatarAssetId");
    await scopeValue700(scopeValue699.xData, "banner", "bannerAssetId");
    await scopeValue700(scopeValue699, "xHomeBannerUrl", "xHomeBannerAssetId");
    await scopeValue700(scopeValue699, "xSearchBannerUrl", "xSearchBannerAssetId");
    for (const scopeValue704 of Array.isArray(scopeValue699.xPlayerAccounts) ? scopeValue699.xPlayerAccounts : []) {
      await scopeValue700(scopeValue704, "avatar", "avatarAssetId");
    }
    for (const scopeValue705 of Array.isArray(scopeValue699.xTopics) ? scopeValue699.xTopics : []) {
      await scopeValue700(scopeValue705, "avatar", "avatarAssetId");
      await scopeValue700(scopeValue705, "banner", "bannerAssetId");
    }
    for (const scopeValue706 of Array.isArray(scopeValue699.xGeneratedPosts) ? scopeValue699.xGeneratedPosts : []) {
      await scopeValue700(scopeValue706, "authorAvatar", "authorAvatarAssetId");
      for (const scopeValue707 of Array.isArray(scopeValue706?.images) ? scopeValue706.images : []) {
        if (scopeValue707?.assetId && !scopeValue707.url) scopeValue707.url = await scopeValue143(scopeValue707.assetId);
      }
    }
    for (const scopeValue708 of [...(Array.isArray(scopeValue699.xAccounts) ? scopeValue699.xAccounts : []), ...(Array.isArray(scopeValue699.xDirectMessages) ? scopeValue699.xDirectMessages : [])]) {
      await scopeValue700(scopeValue708, "avatar", "avatarAssetId");
      await scopeValue700(scopeValue708, "coverImage", "coverImageAssetId");
      await scopeValue700(scopeValue708, "profileImageFaceReferenceUrl", "profileImageFaceReferenceAssetId");
      for (const scopeValue709 of Array.isArray(scopeValue708?.profilePosts) ? scopeValue708.profilePosts : []) {
        for (const scopeValue710 of Array.isArray(scopeValue709?.images) ? scopeValue709.images : []) {
          if (scopeValue710?.assetId && !scopeValue710.url) scopeValue710.url = await scopeValue143(scopeValue710.assetId);
        }
      }
    }
    return scopeValue699;
  }
  async function scopeValue107(scopeValue711) {
    const scopeValue712 = scopeValue47(scopeValue711 && typeof scopeValue711 === "object" ? scopeValue711 : {});
    const scopeValue713 = scopeValue712.widgets && typeof scopeValue712.widgets === "object" && !Array.isArray(scopeValue712.widgets) ? scopeValue712.widgets : null;
    if (!scopeValue713) return scopeValue712;
    for (const scopeValue714 of Object.values(scopeValue713)) {
      if (!scopeValue714 || typeof scopeValue714 !== "object" || Array.isArray(scopeValue714)) continue;
      const scopeValue715 = scopeValue714.imageAssetIds && typeof scopeValue714.imageAssetIds === "object" && !Array.isArray(scopeValue714.imageAssetIds) ? scopeValue714.imageAssetIds : null;
      if (!scopeValue715) continue;
      const scopeValue716 = scopeValue714.images && typeof scopeValue714.images === "object" && !Array.isArray(scopeValue714.images) ? {
        ...scopeValue714.images
      } : {};
      for (const [scopeValue717, scopeValue718] of Object.entries(scopeValue715)) {
        if (!scopeValue718 || scopeValue716[scopeValue717] && !scopeValue64(scopeValue716[scopeValue717])) continue;
        const scopeValue719 = await scopeValue143(scopeValue718);
        if (scopeValue719) scopeValue716[scopeValue717] = scopeValue719;
      }
      scopeValue714.images = scopeValue716;
    }
    return scopeValue712;
  }
  async function scopeValue108(scopeValue720, scopeValue721, scopeValue722) {
    const scopeValue723 = Array.isArray(scopeValue721) ? scopeValue721.filter(Boolean) : [];
    const scopeValue724 = new Set(scopeValue723.map(scopeValue726 => String(scopeValue726[scopeValue722])).filter(Boolean));
    const scopeValue725 = await scopeValue77(scopeValue720.getAllKeys());
    (Array.isArray(scopeValue725) ? scopeValue725 : []).forEach(scopeValue727 => {
      if (!scopeValue724.has(String(scopeValue727))) scopeValue720.delete(scopeValue727);
    });
    scopeValue723.forEach(scopeValue728 => scopeValue720.put(scopeValue49(scopeValue47(scopeValue728))));
  }
  async function scopeValue109(scopeValue729 = {}) {
    const [scopeValue730, scopeValue731, scopeValue732] = await Promise.all([scopeValue87(scopeValue9.xPosts), scopeValue87(scopeValue9.xThreads), scopeValue87(scopeValue9.xDms)]);
    return scopeValue106({
      ...(scopeValue729 && typeof scopeValue729 === "object" ? scopeValue729 : {}),
      xGeneratedPosts: scopeValue730.sort((scopeValue733, scopeValue734) => (Number(scopeValue734.createdAt) || 0) - (Number(scopeValue733.createdAt) || 0)),
      xPostThreads: Object.fromEntries(scopeValue731.map(scopeValue735 => [String(scopeValue735.postId), scopeValue735.value])),
      xDirectMessages: scopeValue732
    });
  }
  function scopeValue110(scopeValue736 = {}, scopeValue737 = "") {
    const scopeValue738 = String(scopeValue737 || "").trim();
    if (!scopeValue738) throw new Error("X account id is required.");
    return {
      accountId: scopeValue738,
      updatedAt: Date.now(),
      state: scopeValue99(scopeValue98(scopeValue736)),
      xGeneratedPosts: scopeValue47(Array.isArray(scopeValue736.xGeneratedPosts) ? scopeValue736.xGeneratedPosts : []),
      xPostThreads: scopeValue47(scopeValue736.xPostThreads && typeof scopeValue736.xPostThreads === "object" ? scopeValue736.xPostThreads : {}),
      xDirectMessages: scopeValue47(Array.isArray(scopeValue736.xDirectMessages) ? scopeValue736.xDirectMessages : [])
    };
  }
  function scopeValue111(scopeValue739 = {}, scopeValue740 = {}) {
    return {
      ...(scopeValue739.state && typeof scopeValue739.state === "object" ? scopeValue47(scopeValue739.state) : {}),
      xGeneratedPosts: scopeValue47(Array.isArray(scopeValue739.xGeneratedPosts) ? scopeValue739.xGeneratedPosts : []),
      xPostThreads: scopeValue47(scopeValue739.xPostThreads && typeof scopeValue739.xPostThreads === "object" ? scopeValue739.xPostThreads : {}),
      xDirectMessages: scopeValue47(Array.isArray(scopeValue739.xDirectMessages) ? scopeValue739.xDirectMessages : []),
      xPlayerAccounts: scopeValue47(Array.isArray(scopeValue740.xPlayerAccounts) ? scopeValue740.xPlayerAccounts : []),
      activeXPlayerAccountId: String(scopeValue740.activeXPlayerAccountId || scopeValue739.accountId || ""),
      xAccountSchemaVersion: Math.max(1, Number(scopeValue740.xAccountSchemaVersion) || 1)
    };
  }
  async function scopeValue112(scopeValue741, scopeValue742 = null) {
    if (scopeValue33) throw new Error("Storage replacement is in progress.");
    if (scopeValue32) await scopeValue32;
    const scopeValue743 = String(scopeValue741 || "").trim();
    if (!scopeValue743) throw new Error("Target X account id is required.");
    if (!(await scopeValue116())) throw new Error("Pending writes could not be completed before switching X accounts.");
    const scopeValue744 = scopeValue97("x", {});
    const scopeValue745 = String(scopeValue744.activeXPlayerAccountId || "").trim();
    if (scopeValue745 && scopeValue745 === scopeValue743) return scopeValue47(scopeValue744);
    const scopeValue746 = [scopeValue9.appDomains, scopeValue9.xPosts, scopeValue9.xThreads, scopeValue9.xDms, scopeValue9.xAccountWorlds, scopeValue9.assets];
    let scopeValue747 = null;
    const scopeValue748 = Date.now();
    await scopeValue113(() => scopeValue83(scopeValue746, "readwrite", async scopeValue750 => {
      const scopeValue751 = await scopeValue77(scopeValue750[scopeValue9.appDomains].get("x"));
      const scopeValue752 = scopeValue102(scopeValue744, scopeValue750[scopeValue9.assets]);
      const scopeValue753 = {
        xPlayerAccounts: scopeValue47(Array.isArray(scopeValue752.xPlayerAccounts) ? scopeValue752.xPlayerAccounts : []),
        activeXPlayerAccountId: scopeValue743,
        xAccountSchemaVersion: Math.max(1, Number(scopeValue752.xAccountSchemaVersion) || 1)
      };
      if (scopeValue745) {
        scopeValue750[scopeValue9.xAccountWorlds].put(scopeValue110(scopeValue752, scopeValue745));
      }
      let scopeValue754 = await scopeValue77(scopeValue750[scopeValue9.xAccountWorlds].get(scopeValue743));
      if (!scopeValue754) {
        if (!scopeValue742 || typeof scopeValue742 !== "object") {
          throw new Error(`X account world ${scopeValue743} was not found.`);
        }
        const scopeValue759 = scopeValue102({
          ...scopeValue47(scopeValue742),
          ...scopeValue753,
          activeXPlayerAccountId: scopeValue743
        }, scopeValue750[scopeValue9.assets]);
        scopeValue754 = scopeValue110(scopeValue759, scopeValue743);
      }
      const scopeValue755 = scopeValue111(scopeValue754, scopeValue753);
      const scopeValue756 = Math.max(0, Number(scopeValue751?.revision) || 0) + 1;
      scopeValue750[scopeValue9.appDomains].put({
        name: "x",
        schemaVersion: scopeValue5,
        revision: scopeValue756,
        updatedAt: scopeValue748,
        value: scopeValue98(scopeValue755)
      });
      await scopeValue108(scopeValue750[scopeValue9.xPosts], scopeValue755.xGeneratedPosts || [], "id");
      const scopeValue757 = Object.entries(scopeValue755.xPostThreads || {}).map(([scopeValue760, scopeValue761]) => ({
        postId: scopeValue760,
        value: scopeValue761
      }));
      await scopeValue108(scopeValue750[scopeValue9.xThreads], scopeValue757, "postId");
      const scopeValue758 = (scopeValue755.xDirectMessages || []).map((scopeValue762, scopeValue763) => ({
        ...scopeValue762,
        id: String(scopeValue762?.id ?? scopeValue762?.charId ?? `x-dm-${scopeValue763}`),
        updatedAt: Number(scopeValue762?.updatedAt) || scopeValue748
      }));
      await scopeValue108(scopeValue750[scopeValue9.xDms], scopeValue758, "id");
      scopeValue750[scopeValue9.xAccountWorlds].delete(scopeValue743);
      scopeValue747 = scopeValue755;
    }));
    const scopeValue749 = await scopeValue106(scopeValue747 || {});
    scopeValue26.set("x", scopeValue47(scopeValue749));
    scopeValue30.status = "saved";
    scopeValue30.lastCommitAt = scopeValue748;
    scopeValue30.lastError = null;
    scopeValue95({
      ...scopeValue30,
      reason: "x-account-switch"
    });
    return scopeValue47(scopeValue749);
  }
  async function scopeValue113(scopeValue764) {
    try {
      return await scopeValue764();
    } catch (scopeValue765) {
      const scopeValue766 = scopeValue765?.name === "QuotaExceededError" || /quota|storage.*full/i.test(String(scopeValue765?.message || ""));
      if (!scopeValue766) throw scopeValue765;
      await scopeValue166();
      return scopeValue764();
    }
  }
  async function scopeValue114(scopeValue767, scopeValue768, scopeValue769 = {}) {
    if (scopeValue33) throw new Error("Storage replacement is in progress.");
    const scopeValue770 = String(scopeValue767 || "").trim();
    if (!scopeValue770) throw new Error("Domain name is required.");
    if (scopeValue32) await scopeValue32;
    const scopeValue771 = scopeValue27.get(scopeValue770) || Promise.resolve();
    const scopeValue772 = scopeValue771.catch(() => undefined).then(async () => {
      const scopeValue773 = [scopeValue9.appDomains];
      const newScope826 = (Array.isArray(scopeValue769.assetRecords) ? scopeValue769.assetRecords : []).map(newScope835 => {
        if (typeof newScope835?.id !== "string" || !newScope835.id || !(newScope835.blob instanceof Blob)) throw new Error("Invalid snapshot asset");
        return scopeValue47(newScope835);
      });
      if (newScope826.length) scopeValue773.push(scopeValue9.assets);
      if (scopeValue770 === "x") {
        scopeValue773.push(scopeValue9.xPosts, scopeValue9.xThreads, scopeValue9.xDms, scopeValue9.assets);
      } else if (scopeValue770 === "desktop") {
        scopeValue773.push(scopeValue9.assets);
      }
      const scopeValue774 = scopeValue97(scopeValue770, {});
      const scopeValue775 = scopeValue47(scopeValue774 && typeof scopeValue774 === "object" ? scopeValue774 : {});
      const scopeValue776 = typeof scopeValue768 === "function" ? scopeValue768(scopeValue775) : scopeValue768;
      const scopeValue777 = scopeValue47(scopeValue776 === undefined ? scopeValue775 : scopeValue776);
      const scopeValue778 = scopeValue770 === "x" ? scopeValue777 : scopeValue71(scopeValue770, scopeValue777);
      const scopeValue779 = Date.now();
      let scopeValue780 = null;
      let scopeValue781 = [];
      await scopeValue113(() => scopeValue83(scopeValue773, "readwrite", async scopeValue782 => {
        const scopeValue783 = await scopeValue77(scopeValue782[scopeValue9.appDomains].get(scopeValue770));
        const scopeValue784 = Math.max(0, Number(scopeValue783?.revision) || 0) + 1;
        const scopeValue785 = new Set();
        if (scopeValue770 === "x") {
          const [scopeValue789, scopeValue790] = await Promise.all([scopeValue77(scopeValue782[scopeValue9.xPosts].getAll()), scopeValue77(scopeValue782[scopeValue9.xDms].getAll())]);
          scopeValue156([scopeValue783?.value, scopeValue789, scopeValue790], scopeValue785);
        }
        const scopeValue786 = scopeValue770 === "x" ? scopeValue49(scopeValue102(scopeValue778, scopeValue782[scopeValue9.assets])) : scopeValue770 === "desktop" ? scopeValue49(scopeValue105(scopeValue778, scopeValue782[scopeValue9.assets])) : scopeValue49(scopeValue778);
        const scopeValue787 = scopeValue770 === "x" ? scopeValue98(scopeValue786) : scopeValue786;
        const scopeValue788 = {
          name: scopeValue770,
          schemaVersion: scopeValue5,
          revision: scopeValue784,
          updatedAt: scopeValue779,
          value: scopeValue787
        };
        newScope826.forEach(newScope845 => {
          scopeValue782[scopeValue9.assets].put({
            ...newScope845,
            createdAt: scopeValue779,
            updatedAt: scopeValue779
          });
        });
        if (scopeValue770 === "x") {
          await scopeValue108(scopeValue782[scopeValue9.xPosts], Array.isArray(scopeValue786.xGeneratedPosts) ? scopeValue786.xGeneratedPosts : [], "id");
          const scopeValue791 = Object.entries(scopeValue786.xPostThreads || {}).map(([scopeValue794, scopeValue795]) => ({
            postId: scopeValue794,
            value: scopeValue795
          }));
          await scopeValue108(scopeValue782[scopeValue9.xThreads], scopeValue791, "postId");
          const scopeValue792 = (Array.isArray(scopeValue786.xDirectMessages) ? scopeValue786.xDirectMessages : []).map((scopeValue796, scopeValue797) => ({
            ...scopeValue796,
            id: String(scopeValue796?.id ?? scopeValue796?.charId ?? `x-dm-${scopeValue797}`),
            updatedAt: Number(scopeValue796?.updatedAt) || scopeValue779
          }));
          await scopeValue108(scopeValue782[scopeValue9.xDms], scopeValue792, "id");
          const scopeValue793 = scopeValue156(scopeValue786);
          scopeValue781 = Array.from(scopeValue785).filter(scopeValue798 => !scopeValue793.has(scopeValue798));
        }
        scopeValue782[scopeValue9.appDomains].put(scopeValue788);
        scopeValue780 = {
          revision: scopeValue784,
          updatedAt: scopeValue779,
          durable: true,
          domain: scopeValue770
        };
      }));
      if (scopeValue781.length > 0) {
        try {
          await scopeValue161(scopeValue781);
        } catch (scopeValue799) {
          console.warn("[appStorage] Failed to release removed X assets:", scopeValue799);
        }
      }
      scopeValue26.set(scopeValue770, scopeValue47(scopeValue770 === "netflix" ? scopeValue70(scopeValue778) : scopeValue778));
      scopeValue30.status = "saved";
      scopeValue30.lastCommitAt = scopeValue779;
      scopeValue30.lastError = null;
      scopeValue95({
        ...scopeValue30,
        commit: scopeValue780,
        reason: scopeValue769.reason || ""
      });
      return scopeValue780;
    }).catch(scopeValue800 => {
      scopeValue30.status = "error";
      scopeValue30.lastError = scopeValue800?.message || String(scopeValue800);
      scopeValue95({
        ...scopeValue30,
        domain: scopeValue770
      });
      throw scopeValue800;
    });
    scopeValue27.set(scopeValue770, scopeValue772);
    scopeValue96(scopeValue772);
    try {
      return await scopeValue772;
    } finally {
      if (scopeValue27.get(scopeValue770) === scopeValue772) scopeValue27.delete(scopeValue770);
    }
  }
  async function scopeValue115(scopeValue801 = [], scopeValue802 = {}) {
    if (scopeValue33) throw new Error("Storage replacement is in progress.");
    if (scopeValue32) await scopeValue32;
    const scopeValue803 = (Array.isArray(scopeValue801) ? scopeValue801 : []).filter(scopeValue806 => {
      return scopeValue806 && Object.values(scopeValue9).includes(scopeValue806.store);
    });
    if (scopeValue803.length === 0) return {
      durable: true,
      updatedAt: Date.now(),
      count: 0
    };
    const scopeValue804 = Array.from(new Set(scopeValue803.map(scopeValue807 => scopeValue807.store)));
    const scopeValue805 = scopeValue113(() => scopeValue83(scopeValue804, "readwrite", scopeValue808 => {
      scopeValue803.forEach(scopeValue809 => {
        const scopeValue810 = scopeValue808[scopeValue809.store];
        if (scopeValue809.type === "delete") scopeValue810.delete(scopeValue809.key);else scopeValue810.put(scopeValue49(scopeValue47(scopeValue809.value)));
      });
    })).then(() => {
      const scopeValue811 = {
        durable: true,
        updatedAt: Date.now(),
        count: scopeValue803.length,
        reason: scopeValue802.reason || ""
      };
      scopeValue30.lastCommitAt = scopeValue811.updatedAt;
      scopeValue30.lastError = null;
      return scopeValue811;
    });
    return scopeValue96(scopeValue805);
  }
  async function scopeValue116() {
    const scopeValue812 = Array.from(scopeValue28);
    if (scopeValue812.length === 0) return true;
    const scopeValue813 = await Promise.allSettled(scopeValue812);
    return scopeValue813.every(scopeValue814 => scopeValue814.status === "fulfilled");
  }
  function scopeValue117(scopeValue815) {
    if (typeof scopeValue815 !== "function") return () => {};
    scopeValue29.add(scopeValue815);
    return () => scopeValue29.delete(scopeValue815);
  }
  function scopeValue118(scopeValue816) {
    return scopeValue49(scopeValue47(scopeValue816 || {}));
  }
  function scopeValue119(scopeValue817) {
    const scopeValue818 = scopeValue118(scopeValue817);
    const scopeValue819 = typeof scopeValue818.text === "string" ? scopeValue818.text : null;
    const scopeValue820 = Array.isArray(scopeValue818.chapterIndex) ? scopeValue818.chapterIndex : null;
    const scopeValue821 = Array.isArray(scopeValue818.chunks) ? scopeValue818.chunks : null;
    const scopeValue822 = Array.isArray(scopeValue818.annotations) ? scopeValue818.annotations : null;
    delete scopeValue818.text;
    delete scopeValue818.chapterIndex;
    delete scopeValue818.chunks;
    delete scopeValue818.annotations;
    return {
      record: scopeValue818,
      text: scopeValue819,
      chapterIndex: scopeValue820,
      chunks: scopeValue821,
      annotations: scopeValue822
    };
  }
  async function scopeValue120() {
    return scopeValue83([scopeValue9.libraryBooks, scopeValue9.libraryBookContent], "readwrite", async scopeValue823 => {
      const scopeValue824 = await scopeValue77(scopeValue823[scopeValue9.libraryBooks].getAll());
      const scopeValue825 = [];
      scopeValue824.forEach(scopeValue826 => {
        const {
          record: scopeValue827,
          text: scopeValue828,
          chapterIndex: scopeValue829,
          chunks: scopeValue830,
          annotations: scopeValue831
        } = scopeValue119(scopeValue826);
        if (!scopeValue827.id) return;
        if (scopeValue828 !== null || scopeValue829 || scopeValue830 || scopeValue831) {
          scopeValue823[scopeValue9.libraryBookContent].put({
            id: scopeValue827.id,
            text: scopeValue828 || "",
            chapterIndex: scopeValue829 || [],
            chunks: scopeValue830 || [],
            annotations: scopeValue831 || [],
            updatedAt: Number(scopeValue827.updatedAt) || Date.now()
          });
          scopeValue823[scopeValue9.libraryBooks].put(scopeValue827);
        }
        scopeValue825.push(scopeValue827);
      });
      return scopeValue47(scopeValue825);
    });
  }
  async function scopeValue121(scopeValue832) {
    const {
      record: scopeValue833,
      text: scopeValue834,
      chapterIndex: scopeValue835,
      chunks: scopeValue836,
      annotations: scopeValue837
    } = scopeValue119(scopeValue832);
    if (!scopeValue833.id) throw new Error("Library book id is required.");
    if (scopeValue834 !== null || scopeValue835 || scopeValue836 || scopeValue837) {
      await scopeValue83([scopeValue9.libraryBooks, scopeValue9.libraryBookContent], "readwrite", scopeValue838 => {
        scopeValue838[scopeValue9.libraryBooks].put(scopeValue833);
        scopeValue838[scopeValue9.libraryBookContent].put({
          id: scopeValue833.id,
          text: scopeValue834 || "",
          chapterIndex: scopeValue835 || [],
          chunks: scopeValue836 || [],
          annotations: scopeValue837 || [],
          updatedAt: Number(scopeValue833.updatedAt) || Date.now()
        });
      });
    } else {
      await scopeValue85(scopeValue9.libraryBooks, scopeValue833);
    }
    return scopeValue47(scopeValue833);
  }
  async function scopeValue122(scopeValue839) {
    const scopeValue840 = await scopeValue84(scopeValue9.libraryBookContent, String(scopeValue839 || ""));
    return scopeValue840 ? scopeValue47(scopeValue840) : null;
  }
  async function scopeValue123(scopeValue841) {
    const scopeValue842 = String(scopeValue841 || "");
    return scopeValue83([scopeValue9.libraryBooks, scopeValue9.libraryBookContent], "readwrite", scopeValue843 => {
      scopeValue843[scopeValue9.libraryBooks].delete(scopeValue842);
      scopeValue843[scopeValue9.libraryBookContent].delete(scopeValue842);
    });
  }
  async function scopeValue124() {
    return scopeValue47(await scopeValue87(scopeValue9.libraryPlaylists));
  }
  async function scopeValue125() {
    return scopeValue47(await scopeValue87(scopeValue9.libraryTracks));
  }
  async function scopeValue126(scopeValue844, scopeValue845 = [], scopeValue846 = {}) {
    let scopeValue847 = scopeValue118(scopeValue844);
    if (!scopeValue847.id) throw new Error("Library playlist id is required.");
    let scopeValue848 = false;
    const scopeValue849 = (Array.isArray(scopeValue845) ? scopeValue845 : []).map(scopeValue118).filter(scopeValue850 => scopeValue850.id);
    await scopeValue83([scopeValue9.libraryPlaylists, scopeValue9.libraryTracks], "readwrite", scopeValue851 => {
      const scopeValue852 = scopeValue851[scopeValue9.libraryPlaylists];
      const scopeValue853 = scopeValue851[scopeValue9.libraryTracks];
      const scopeValue854 = () => {
        scopeValue852.put(scopeValue847);
        scopeValue849.forEach(scopeValue856 => scopeValue853.put(scopeValue856));
      };
      const scopeValue855 = () => {
        if (!scopeValue846.patchPlaylist && !scopeValue846.preserveCustomCover) return scopeValue854();
        const scopeValue857 = scopeValue852.get(scopeValue847.id);
        scopeValue857.onsuccess = () => {
          const scopeValue858 = scopeValue857.result;
          if (scopeValue846.patchPlaylist) {
            if (!scopeValue858) {
              scopeValue848 = true;
              return;
            }
            scopeValue847 = {
              ...scopeValue858,
              ...scopeValue847
            };
          }
          if (scopeValue846.preserveCustomCover && scopeValue858) {
            scopeValue847.customCoverUrl = String(scopeValue858.customCoverUrl || "");
          }
          scopeValue854();
        };
      };
      if (scopeValue846.replaceTracks) {
        const scopeValue859 = new Set(scopeValue849.map(scopeValue861 => scopeValue861.id));
        const scopeValue860 = scopeValue853.index("playlistId").getAllKeys(scopeValue847.id);
        scopeValue860.onsuccess = () => {
          (Array.isArray(scopeValue860.result) ? scopeValue860.result : []).forEach(scopeValue862 => {
            if (!scopeValue859.has(scopeValue862)) scopeValue853.delete(scopeValue862);
          });
          scopeValue855();
        };
        return;
      }
      scopeValue855();
    });
    if (scopeValue848) throw new Error("Library playlist no longer exists.");
    return {
      playlist: scopeValue47(scopeValue847),
      tracks: scopeValue47(scopeValue849)
    };
  }
  async function scopeValue127(scopeValue863) {
    const scopeValue864 = scopeValue118(scopeValue863);
    if (!scopeValue864.id) throw new Error("Library track id is required.");
    await scopeValue85(scopeValue9.libraryTracks, scopeValue864);
    return scopeValue47(scopeValue864);
  }
  async function scopeValue128(scopeValue865) {
    return scopeValue86(scopeValue9.libraryTracks, String(scopeValue865 || ""));
  }
  async function scopeValue129(scopeValue866) {
    const scopeValue867 = String(scopeValue866 || "");
    if (!scopeValue867) return;
    return scopeValue83([scopeValue9.libraryPlaylists, scopeValue9.libraryTracks], "readwrite", async scopeValue868 => {
      const scopeValue869 = await scopeValue77(scopeValue868[scopeValue9.libraryTracks].getAll());
      (Array.isArray(scopeValue869) ? scopeValue869 : []).forEach(scopeValue870 => {
        if (scopeValue870 && scopeValue870.playlistId === scopeValue867) {
          scopeValue868[scopeValue9.libraryTracks].delete(scopeValue870.id);
        }
      });
      scopeValue868[scopeValue9.libraryPlaylists].delete(scopeValue867);
    });
  }
  async function scopeValue130() {
    return scopeValue47(await scopeValue87(scopeValue9.libraryDailyStats));
  }
  async function scopeValue131({
    date: scopeValue871,
    kind: scopeValue872,
    itemId: scopeValue873,
    seconds: scopeValue874 = 0,
    count: scopeValue875 = 0
  }) {
    const scopeValue876 = String(scopeValue871 || "");
    const scopeValue877 = String(scopeValue872 || "");
    const scopeValue878 = String(scopeValue873 || "all");
    const scopeValue879 = Number(scopeValue874);
    const scopeValue880 = Number(scopeValue875);
    const scopeValue881 = Number.isFinite(scopeValue879) ? Math.max(0, scopeValue879) : 0;
    const scopeValue882 = Number.isFinite(scopeValue880) ? Math.max(0, Math.floor(scopeValue880)) : 0;
    if (!scopeValue876 || !scopeValue877 || scopeValue881 <= 0 && scopeValue882 <= 0) return null;
    const scopeValue883 = `${scopeValue876}|${scopeValue877}|${scopeValue878}`;
    return scopeValue83([scopeValue9.libraryDailyStats], "readwrite", async scopeValue884 => {
      const scopeValue885 = scopeValue884[scopeValue9.libraryDailyStats];
      const scopeValue886 = await scopeValue77(scopeValue885.get(scopeValue883));
      const scopeValue887 = {
        id: scopeValue883,
        date: scopeValue876,
        kind: scopeValue877,
        itemId: scopeValue878,
        seconds: Math.max(0, Number(scopeValue886?.seconds) || 0) + scopeValue881,
        count: Math.max(0, Number(scopeValue886?.count) || 0) + scopeValue882,
        updatedAt: Date.now()
      };
      scopeValue885.put(scopeValue887);
      return scopeValue47(scopeValue887);
    });
  }
  async function scopeValue132(scopeValue888) {
    const scopeValue889 = await scopeValue84(scopeValue9.meta, scopeValue888);
    return scopeValue889 ? scopeValue889.value : null;
  }
  async function scopeValue133(scopeValue890, scopeValue891) {
    return scopeValue85(scopeValue9.meta, {
      key: scopeValue890,
      value: scopeValue891
    });
  }
  async function scopeValue134(scopeValue892, scopeValue893 = null) {
    const scopeValue894 = await scopeValue84(scopeValue9.settings, scopeValue892);
    return scopeValue894 ? scopeValue47(scopeValue894.value) : scopeValue893;
  }
  async function scopeValue135(scopeValue895, scopeValue896) {
    return scopeValue85(scopeValue9.settings, {
      key: scopeValue895,
      value: scopeValue49(scopeValue47(scopeValue896))
    });
  }
  async function scopeValue136(scopeValue897) {
    const scopeValue898 = await scopeValue84(scopeValue9.privateSessions, String(scopeValue897 || ""));
    return typeof scopeValue898?.value === "string" ? scopeValue898.value : "";
  }
  async function scopeValue137(scopeValue899, scopeValue900) {
    const scopeValue901 = String(scopeValue899 || "").trim();
    const scopeValue902 = String(scopeValue900 || "");
    if (!scopeValue901) throw new Error("Private session key is required.");
    if (!scopeValue902) return scopeValue86(scopeValue9.privateSessions, scopeValue901);
    if (scopeValue902.length > 65536) throw new Error("Private session value is too large.");
    return scopeValue85(scopeValue9.privateSessions, {
      key: scopeValue901,
      value: scopeValue902,
      updatedAt: Date.now()
    });
  }
  async function scopeValue138(scopeValue903) {
    return scopeValue86(scopeValue9.privateSessions, String(scopeValue903 || ""));
  }
  async function scopeValue139(scopeValue904) {
    const scopeValue905 = typeof scopeValue904 === "string" ? scopeValue904.length : scopeValue904 instanceof Blob ? scopeValue904.size : 0;
    if (scopeValue905 < 350000 || !navigator.storage?.estimate) return;
    const scopeValue906 = await navigator.storage.estimate();
    const scopeValue907 = Math.max(0, Number(scopeValue906?.usage) || 0);
    const scopeValue908 = Math.max(0, Number(scopeValue906?.quota) || 0);
    if (scopeValue908 > 0 && scopeValue907 / scopeValue908 >= 0.9) {
      throw new DOMException("Storage is above 90%; new large images are temporarily blocked.", "QuotaExceededError");
    }
  }
  async function scopeValue140(scopeValue909, scopeValue910, scopeValue911 = {}) {
    if (!scopeValue909 || !scopeValue63(scopeValue910)) return null;
    await scopeValue139(scopeValue910);
    scopeValue59(scopeValue909);
    const scopeValue912 = scopeValue73(scopeValue910);
    return scopeValue83([scopeValue9.assets], "readwrite", scopeValue913 => {
      scopeValue913[scopeValue9.assets].put({
        id: scopeValue909,
        blob: scopeValue912,
        mimeType: scopeValue912.type || scopeValue911.mimeType || "application/octet-stream",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...scopeValue911
      });
    }).then(() => scopeValue909);
  }
  async function scopeValue141(scopeValue914, scopeValue915, scopeValue916 = {}) {
    if (scopeValue916.voiceCacheEpoch != null && (scopeValue916.voiceCacheEpoch !== newScope47 || newScope48)) {
      throw new Error("语音缓存已清理，请重新生成");
    }
    if (!scopeValue914 || !(scopeValue915 instanceof Blob) || !scopeValue915.size && scopeValue916.ownerType !== "im_file") return null;
    await scopeValue139(scopeValue915);
    scopeValue59(scopeValue914);
    return scopeValue83([scopeValue9.assets], "readwrite", scopeValue917 => {
      scopeValue917[scopeValue9.assets].put({
        id: scopeValue914,
        blob: scopeValue915,
        mimeType: scopeValue915.type || scopeValue916.mimeType || "application/octet-stream",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...scopeValue916
      });
    }).then(() => scopeValue914);
  }
  async function scopeValue142(scopeValue918) {
    if (!scopeValue918) return null;
    const scopeValue919 = await scopeValue84(scopeValue9.assets, scopeValue918);
    return scopeValue919 && scopeValue919.blob ? scopeValue919.blob : null;
  }
  async function scopeValue143(scopeValue920, {
    refresh: newScope976 = false
  } = {}) {
    if (!scopeValue920) return null;
    if (newScope976) scopeValue59(scopeValue920);
    const scopeValue921 = scopeValue17.get(scopeValue920);
    if (scopeValue921) {
      scopeValue58(scopeValue920);
      return scopeValue921;
    }
    const scopeValue922 = await scopeValue142(scopeValue920);
    if (!scopeValue922) return null;
    const scopeValue923 = URL.createObjectURL(scopeValue922);
    scopeValue17.set(scopeValue920, scopeValue923);
    scopeValue58(scopeValue920);
    scopeValue62();
    return scopeValue923;
  }
  async function scopeValue144(scopeValue924) {
    if (!scopeValue924) return;
    scopeValue59(scopeValue924);
    return scopeValue86(scopeValue9.assets, scopeValue924);
  }
  function scopeValue145(scopeValue925 = {}) {
    return String(scopeValue925?.blob?.type || scopeValue925?.mimeType || "").trim().toLowerCase();
  }
  function scopeValue146(scopeValue926 = {}) {
    const scopeValue927 = scopeValue926?.blob;
    return !!scopeValue927 && !scopeValue926?.compressedAt && scopeValue24.has(scopeValue145(scopeValue926)) && Number(scopeValue927.size) >= scopeValue20;
  }
  function scopeValue147(scopeValue928 = {}) {
    return scopeValue145(scopeValue928).startsWith("image/");
  }
  function scopeValue148(scopeValue929 = {}) {
    const scopeValue930 = [scopeValue929?.ownerType, scopeValue929?.field, scopeValue929?.id].map(scopeValue931 => String(scopeValue931 || "").toLowerCase()).join(" ");
    if (/(avatar|icon|sticker|face|reference)/.test(scopeValue930)) return 1024;
    if (/(cover|banner|background|wallpaper|bg)/.test(scopeValue930)) return 1920;
    return 1600;
  }
  function scopeValue149(scopeValue932) {
    if (!scopeValue932) return Promise.reject(new Error("Image blob is missing."));
    if (typeof createImageBitmap === "function") {
      return createImageBitmap(scopeValue932).then(scopeValue933 => ({
        source: scopeValue933,
        width: Number(scopeValue933.width) || 0,
        height: Number(scopeValue933.height) || 0,
        close: () => scopeValue933.close?.()
      }));
    }
    if (typeof Image !== "function" || typeof URL?.createObjectURL !== "function") {
      return Promise.reject(new Error("Image decoding is unavailable."));
    }
    return new Promise((scopeValue934, scopeValue935) => {
      const scopeValue936 = URL.createObjectURL(scopeValue932);
      const scopeValue937 = new Image();
      scopeValue937.onload = () => scopeValue934({
        source: scopeValue937,
        width: Number(scopeValue937.naturalWidth || scopeValue937.width) || 0,
        height: Number(scopeValue937.naturalHeight || scopeValue937.height) || 0,
        close: () => URL.revokeObjectURL(scopeValue936)
      });
      scopeValue937.onerror = () => {
        URL.revokeObjectURL(scopeValue936);
        scopeValue935(new Error("Image could not be decoded."));
      };
      scopeValue937.src = scopeValue936;
    });
  }
  function scopeValue150(scopeValue938, scopeValue939, scopeValue940) {
    return new Promise((scopeValue941, scopeValue942) => {
      if (!scopeValue938 || typeof scopeValue938.toBlob !== "function") {
        scopeValue942(new Error("Canvas image encoding is unavailable."));
        return;
      }
      scopeValue938.toBlob(scopeValue943 => {
        if (scopeValue943) scopeValue941(scopeValue943);else scopeValue942(new Error("Image encoding returned no data."));
      }, scopeValue939, scopeValue940);
    });
  }
  async function scopeValue151(scopeValue944) {
    const scopeValue945 = await scopeValue149(scopeValue944.blob);
    try {
      if (!scopeValue945.width || !scopeValue945.height) throw new Error("Image dimensions are invalid.");
      const scopeValue946 = scopeValue148(scopeValue944);
      const scopeValue947 = Math.min(1, scopeValue946 / Math.max(scopeValue945.width, scopeValue945.height));
      const scopeValue948 = Math.max(1, Math.round(scopeValue945.width * scopeValue947));
      const scopeValue949 = Math.max(1, Math.round(scopeValue945.height * scopeValue947));
      const scopeValue950 = document.createElement("canvas");
      scopeValue950.width = scopeValue948;
      scopeValue950.height = scopeValue949;
      const scopeValue951 = scopeValue950.getContext?.("2d", {
        alpha: true
      });
      if (!scopeValue951) throw new Error("Canvas rendering is unavailable.");
      scopeValue951.drawImage(scopeValue945.source, 0, 0, scopeValue948, scopeValue949);
      const scopeValue952 = await scopeValue150(scopeValue950, "image/webp", scopeValue23);
      const scopeValue953 = await scopeValue149(scopeValue952);
      try {
        if (!scopeValue953.width || !scopeValue953.height) throw new Error("Compressed image verification failed.");
      } finally {
        scopeValue953.close?.();
      }
      return {
        blob: scopeValue952,
        width: scopeValue948,
        height: scopeValue949,
        originalWidth: scopeValue945.width,
        originalHeight: scopeValue945.height
      };
    } finally {
      scopeValue945.close?.();
    }
  }
  async function scopeValue152(scopeValue954 = {}) {
    if (!scopeValue954.skipReady && scopeValue32) await scopeValue32;
    const scopeValue955 = await scopeValue87(scopeValue9.assets);
    const scopeValue956 = scopeValue955.filter(scopeValue147);
    const scopeValue957 = scopeValue956.filter(scopeValue146);
    return {
      scope: "all",
      profile: "balanced",
      scanned: scopeValue956.length,
      eligible: scopeValue957.length,
      skipped: Math.max(0, scopeValue956.length - scopeValue957.length),
      bytes: scopeValue957.reduce((scopeValue958, scopeValue959) => scopeValue958 + Math.max(0, Number(scopeValue959?.blob?.size) || 0), 0)
    };
  }
  async function scopeValue153(scopeValue960 = {}) {
    if (!scopeValue960.skipReady && scopeValue32) await scopeValue32;
    const scopeValue961 = typeof scopeValue960.progressCallback === "function" ? scopeValue960.progressCallback : null;
    if (scopeValue33) throw new Error("Storage replacement is in progress.");
    scopeValue30.status = "saving";
    scopeValue30.lastError = null;
    scopeValue95({
      ...scopeValue30,
      reason: "image-compression-start"
    });
    try {
      scopeValue51(scopeValue961, "正在完成待保存数据...", 2);
      if (!(await scopeValue116())) throw new Error("Pending writes could not be completed before image compression.");
      const scopeValue962 = await scopeValue87(scopeValue9.assets);
      const scopeValue963 = scopeValue962.filter(scopeValue147);
      const scopeValue964 = scopeValue963.filter(scopeValue146);
      const scopeValue965 = {
        scope: "all",
        profile: "balanced",
        compressedAt: Date.now(),
        scanned: scopeValue963.length,
        eligible: scopeValue964.length,
        compressed: 0,
        skipped: Math.max(0, scopeValue963.length - scopeValue964.length),
        failed: 0,
        bytesBefore: scopeValue964.reduce((scopeValue966, scopeValue967) => scopeValue966 + Math.max(0, Number(scopeValue967?.blob?.size) || 0), 0),
        bytesAfter: 0,
        bytesFreed: 0
      };
      for (let scopeValue968 = 0; scopeValue968 < scopeValue964.length; scopeValue968 += 1) {
        const scopeValue969 = scopeValue964[scopeValue968];
        const scopeValue970 = Math.max(0, Number(scopeValue969?.blob?.size) || 0);
        scopeValue51(scopeValue961, `正在压缩第 ${scopeValue968 + 1} / ${scopeValue964.length} 张图片...`, scopeValue964.length ? 5 + scopeValue968 / scopeValue964.length * 90 : 95);
        try {
          const scopeValue971 = await scopeValue151(scopeValue969);
          const scopeValue972 = scopeValue970 - scopeValue971.blob.size;
          const scopeValue973 = scopeValue970 > 0 ? scopeValue972 / scopeValue970 : 0;
          if (scopeValue972 < scopeValue21 || scopeValue973 < scopeValue22) {
            scopeValue965.skipped += 1;
            scopeValue965.bytesAfter += scopeValue970;
            continue;
          }
          const scopeValue974 = await scopeValue74(scopeValue971.blob);
          const scopeValue975 = await scopeValue83([scopeValue9.assets], "readwrite", async scopeValue976 => {
            const scopeValue977 = await scopeValue77(scopeValue976[scopeValue9.assets].get(String(scopeValue969.id)));
            if (!scopeValue977?.blob || Number(scopeValue977.blob.size) !== scopeValue970 || String(scopeValue977.updatedAt ?? "") !== String(scopeValue969.updatedAt ?? "")) return false;
            scopeValue976[scopeValue9.assets].put({
              ...scopeValue977,
              blob: scopeValue971.blob,
              mimeType: scopeValue971.blob.type || "image/webp",
              width: scopeValue971.width,
              height: scopeValue971.height,
              originalWidth: Number(scopeValue977.originalWidth) || scopeValue971.originalWidth,
              originalHeight: Number(scopeValue977.originalHeight) || scopeValue971.originalHeight,
              originalMimeType: scopeValue977.originalMimeType || scopeValue145(scopeValue977),
              sha256: scopeValue974 || scopeValue977.sha256 || null,
              compressionProfile: "balanced",
              compressedAt: Date.now(),
              updatedAt: Date.now()
            });
            return true;
          });
          if (!scopeValue975) {
            scopeValue965.skipped += 1;
            scopeValue965.bytesAfter += scopeValue970;
            continue;
          }
          scopeValue59(scopeValue969.id);
          scopeValue965.compressed += 1;
          scopeValue965.bytesAfter += scopeValue971.blob.size;
        } catch (scopeValue978) {
          console.warn("[Storage] Image compression skipped an asset:", scopeValue969?.id, scopeValue978);
          scopeValue965.failed += 1;
          scopeValue965.bytesAfter += scopeValue970;
        }
      }
      scopeValue965.bytesFreed = Math.max(0, scopeValue965.bytesBefore - scopeValue965.bytesAfter);
      await scopeValue133("storage_last_image_compression", scopeValue965);
      scopeValue30.status = "saved";
      scopeValue30.lastError = null;
      scopeValue30.lastImageCompression = scopeValue47(scopeValue965);
      scopeValue95({
        ...scopeValue30,
        reason: "image-compression-complete"
      });
      scopeValue51(scopeValue961, "图片压缩完成", 100);
      return scopeValue47(scopeValue965);
    } catch (scopeValue979) {
      scopeValue30.status = "error";
      scopeValue30.lastError = scopeValue979?.message || String(scopeValue979);
      scopeValue95({
        ...scopeValue30,
        reason: "image-compression-error"
      });
      throw scopeValue979;
    }
  }
  function scopeValue154(scopeValue980 = {}) {
    if (scopeValue31) return scopeValue31;
    scopeValue31 = scopeValue153(scopeValue980).finally(() => {
      scopeValue31 = null;
    });
    return scopeValue31;
  }
  async function scopeValue155(scopeValue981) {
    if (!scopeValue981) return false;
    return scopeValue83([scopeValue9.assets], "readwrite", async scopeValue982 => {
      const scopeValue983 = await scopeValue77(scopeValue982[scopeValue9.assets].get(String(scopeValue981)));
      if (!scopeValue983) return false;
      scopeValue982[scopeValue9.assets].put({
        ...scopeValue983,
        orphanedAt: scopeValue983.orphanedAt || Date.now()
      });
      return true;
    });
  }
  function scopeValue156(scopeValue984, scopeValue985 = new Set(), scopeValue986 = new WeakSet()) {
    if (!scopeValue984 || typeof scopeValue984 !== "object") return scopeValue985;
    if (scopeValue986.has(scopeValue984)) return scopeValue985;
    scopeValue986.add(scopeValue984);
    if (Array.isArray(scopeValue984)) {
      scopeValue984.forEach(scopeValue987 => scopeValue156(scopeValue987, scopeValue985, scopeValue986));
      return scopeValue985;
    }
    Object.entries(scopeValue984).forEach(([scopeValue988, scopeValue989]) => {
      if ((scopeValue988 === "assetId" || scopeValue988.endsWith("AssetId")) && typeof scopeValue989 === "string" && scopeValue989) {
        scopeValue985.add(scopeValue989);
      } else if (scopeValue988.endsWith("AssetIds") && scopeValue989 && typeof scopeValue989 === "object") {
        const scopeValue990 = Array.isArray(scopeValue989) ? scopeValue989 : Object.values(scopeValue989);
        scopeValue990.forEach(scopeValue991 => {
          if (typeof scopeValue991 === "string" && scopeValue991) scopeValue985.add(scopeValue991);
        });
      } else {
        scopeValue156(scopeValue989, scopeValue985, scopeValue986);
      }
    });
    return scopeValue985;
  }
  function scopeValue157() {
    return Object.values(scopeValue9).filter(scopeValue992 => ![scopeValue9.assets, scopeValue9.storageCheckpoints, scopeValue9.meta].includes(scopeValue992));
  }
  function scopeValue158(scopeValue993) {
    const scopeValue994 = scopeValue993 instanceof Set ? Array.from(scopeValue993) : Array.isArray(scopeValue993) ? scopeValue993 : [scopeValue993];
    return Array.from(new Set(scopeValue994.map(scopeValue995 => String(scopeValue995 || "").trim()).filter(Boolean)));
  }
  function scopeValue159(scopeValue996) {
    return scopeValue158(scopeValue156(scopeValue996));
  }
  async function scopeValue160(scopeValue997, scopeValue998) {
    const scopeValue999 = await Promise.all(scopeValue998.map(async scopeValue1002 => {
      const scopeValue1003 = await scopeValue77(scopeValue997[scopeValue1002].getAll());
      return Array.isArray(scopeValue1003) ? scopeValue1003 : [];
    }));
    const scopeValue1000 = new Set();
    scopeValue999.forEach(scopeValue1004 => scopeValue156(scopeValue1004, scopeValue1000));
    const scopeValue1001 = await scopeValue77(scopeValue997[scopeValue9.meta].get(scopeValue16.imMomentsCoverAssetId));
    if (typeof scopeValue1001?.value === "string") scopeValue1000.add(scopeValue1001.value);
    return scopeValue1000;
  }
  async function scopeValue161(scopeValue1005) {
    const scopeValue1006 = scopeValue158(scopeValue1005);
    if (scopeValue1006.length === 0) {
      return {
        candidateCount: 0,
        releasedAssetIds: [],
        retainedAssetIds: []
      };
    }
    const scopeValue1007 = scopeValue157();
    const scopeValue1008 = [scopeValue9.assets, scopeValue9.meta, ...scopeValue1007];
    const scopeValue1009 = await scopeValue83(scopeValue1008, "readwrite", async scopeValue1010 => {
      const scopeValue1011 = await scopeValue160(scopeValue1010, scopeValue1007);
      const scopeValue1012 = [];
      const scopeValue1013 = [];
      for (const scopeValue1014 of scopeValue1006) {
        if (scopeValue1011.has(scopeValue1014)) {
          scopeValue1013.push(scopeValue1014);
          continue;
        }
        const scopeValue1015 = await scopeValue77(scopeValue1010[scopeValue9.assets].get(scopeValue1014));
        if (!scopeValue1015) continue;
        scopeValue1010[scopeValue9.assets].delete(scopeValue1014);
        scopeValue1012.push(scopeValue1014);
      }
      return {
        candidateCount: scopeValue1006.length,
        releasedAssetIds: scopeValue1012,
        retainedAssetIds: scopeValue1013
      };
    });
    scopeValue1009.releasedAssetIds.forEach(scopeValue1016 => scopeValue59(scopeValue1016));
    return scopeValue1009;
  }
  async function scopeValue162(scopeValue1017) {
    return scopeValue161(scopeValue159(scopeValue1017));
  }
  async function scopeValue163() {
    const scopeValue1018 = await scopeValue83([scopeValue9.appDomains, scopeValue9.xPosts, scopeValue9.xAccountWorlds], "readwrite", async scopeValue1020 => {
      const [scopeValue1021, scopeValue1022, scopeValue1023] = await Promise.all([scopeValue77(scopeValue1020[scopeValue9.appDomains].get("x")), scopeValue77(scopeValue1020[scopeValue9.xPosts].getAll()), scopeValue77(scopeValue1020[scopeValue9.xAccountWorlds].getAll())]);
      const scopeValue1024 = new Set();
      let scopeValue1025 = 0;
      let scopeValue1026 = 0;
      const scopeValue1027 = (scopeValue1030, scopeValue1031) => {
        const scopeValue1032 = String(scopeValue1031 || "");
        if (!scopeValue1032 || !Array.isArray(scopeValue1030)) return {
          posts: scopeValue1030,
          changed: 0
        };
        let scopeValue1033 = 0;
        const scopeValue1034 = scopeValue1030.map(scopeValue1035 => {
          if (!scopeValue1035 || String(scopeValue1035.authorId || "") !== "me") return scopeValue1035;
          const scopeValue1036 = String(scopeValue1035.authorAvatarAssetId || "");
          const scopeValue1037 = scopeValue1036 === scopeValue1032 && !scopeValue1035.authorAvatar;
          if (scopeValue1037) return scopeValue1035;
          if (scopeValue1036 && scopeValue1036 !== scopeValue1032) scopeValue1024.add(scopeValue1036);
          scopeValue1033 += 1;
          return {
            ...scopeValue1035,
            authorAvatar: null,
            authorAvatarAssetId: scopeValue1032
          };
        });
        return {
          posts: scopeValue1034,
          changed: scopeValue1033
        };
      };
      const scopeValue1028 = scopeValue1021?.value?.xData?.avatarAssetId;
      const scopeValue1029 = scopeValue1027(scopeValue1022, scopeValue1028);
      if (scopeValue1029.changed > 0) {
        scopeValue1029.posts.forEach(scopeValue1038 => scopeValue1020[scopeValue9.xPosts].put(scopeValue49(scopeValue1038)));
        scopeValue1025 = scopeValue1029.changed;
      }
      (Array.isArray(scopeValue1023) ? scopeValue1023 : []).forEach(scopeValue1039 => {
        const scopeValue1040 = scopeValue1039?.state?.xData?.avatarAssetId;
        const scopeValue1041 = scopeValue1027(scopeValue1039?.xGeneratedPosts, scopeValue1040);
        if (scopeValue1041.changed === 0) return;
        scopeValue1020[scopeValue9.xAccountWorlds].put({
          ...scopeValue1039,
          updatedAt: Date.now(),
          xGeneratedPosts: scopeValue1041.posts
        });
        scopeValue1026 += scopeValue1041.changed;
      });
      return {
        activePostsRewritten: scopeValue1025,
        accountWorldsRewritten: scopeValue1026,
        replacedAssetIds: Array.from(scopeValue1024)
      };
    });
    const scopeValue1019 = await scopeValue161(scopeValue1018.replacedAssetIds);
    return {
      activePostsRewritten: scopeValue1018.activePostsRewritten,
      accountWorldsRewritten: scopeValue1018.accountWorldsRewritten,
      releasedAssetCount: scopeValue1019.releasedAssetIds.length
    };
  }
  async function scopeValue164() {
    const scopeValue1042 = await scopeValue83([scopeValue9.appDomains, scopeValue9.settings, scopeValue9.accounts], "readwrite", async scopeValue1043 => {
      const scopeValue1044 = await scopeValue77(scopeValue1043[scopeValue9.appDomains].getAll());
      const scopeValue1045 = [];
      let scopeValue1046 = 0;
      let scopeValue1047 = 0;
      (Array.isArray(scopeValue1044) ? scopeValue1044 : []).forEach(scopeValue1049 => {
        const scopeValue1050 = String(scopeValue1049?.name || "");
        if (!["settings", "tiktok", "youtube", "netflix"].includes(scopeValue1050)) return;
        const scopeValue1051 = scopeValue71(scopeValue1050, scopeValue1049.value);
        if (JSON.stringify(scopeValue1051) === JSON.stringify(scopeValue1049.value)) return;
        const scopeValue1052 = {
          ...scopeValue1049,
          revision: Math.max(0, Number(scopeValue1049.revision) || 0) + 1,
          updatedAt: Date.now(),
          value: scopeValue49(scopeValue1051)
        };
        scopeValue1043[scopeValue9.appDomains].put(scopeValue1052);
        scopeValue1045.push(scopeValue1052);
        scopeValue1046 += 1;
      });
      const scopeValue1048 = (Array.isArray(scopeValue1044) ? scopeValue1044 : []).some(scopeValue1053 => scopeValue1053?.name === "settings");
      if (scopeValue1048) {
        const [scopeValue1054, scopeValue1055] = await Promise.all([scopeValue77(scopeValue1043[scopeValue9.settings].get("userState")), scopeValue77(scopeValue1043[scopeValue9.accounts].get("__all__"))]);
        if (scopeValue1054) {
          scopeValue1043[scopeValue9.settings].delete("userState");
          scopeValue1047 += 1;
        }
        if (scopeValue1055) {
          scopeValue1043[scopeValue9.accounts].delete("__all__");
          scopeValue1047 += 1;
        }
      }
      return {
        recordsRewritten: scopeValue1046,
        normalizedDomains: scopeValue1045,
        legacySettingsCopiesRemoved: scopeValue1047
      };
    });
    scopeValue1042.normalizedDomains.forEach(scopeValue1056 => {
      const scopeValue1057 = scopeValue1056.name === "netflix" ? scopeValue70(scopeValue1056.value) : scopeValue1056.value;
      scopeValue26.set(scopeValue1056.name, scopeValue47(scopeValue1057));
    });
    return {
      recordsRewritten: scopeValue1042.recordsRewritten,
      legacySettingsCopiesRemoved: scopeValue1042.legacySettingsCopiesRemoved
    };
  }
  async function scopeValue165(scopeValue1058 = {}) {
    if (!scopeValue1058.skipReady && scopeValue32) await scopeValue32;
    const scopeValue1059 = scopeValue157();
    const scopeValue1060 = [scopeValue9.assets, scopeValue9.meta, ...scopeValue1059];
    const scopeValue1061 = await scopeValue83(scopeValue1060, "readwrite", async scopeValue1062 => {
      const scopeValue1063 = await scopeValue160(scopeValue1062, scopeValue1059);
      const scopeValue1064 = await scopeValue77(scopeValue1062[scopeValue9.assets].getAll());
      const scopeValue1065 = (Array.isArray(scopeValue1064) ? scopeValue1064 : []).map(scopeValue1066 => String(scopeValue1066?.id || "").trim()).filter(scopeValue1067 => scopeValue1067 && !scopeValue1063.has(scopeValue1067));
      scopeValue1065.forEach(scopeValue1068 => scopeValue1062[scopeValue9.assets].delete(scopeValue1068));
      return {
        scannedAssetCount: Array.isArray(scopeValue1064) ? scopeValue1064.length : 0,
        releasedAssetIds: scopeValue1065
      };
    });
    scopeValue1061.releasedAssetIds.forEach(scopeValue1069 => scopeValue59(scopeValue1069));
    return {
      scannedAssetCount: scopeValue1061.scannedAssetCount,
      releasedAssetIds: scopeValue1061.releasedAssetIds,
      releasedCount: scopeValue1061.releasedAssetIds.length
    };
  }
  async function scopeValue166(scopeValue1070 = {}) {
    const scopeValue1071 = Math.max(0, Number(scopeValue1070.graceMs) || 7 * 24 * 60 * 60 * 1000);
    const scopeValue1072 = Date.now();
    const scopeValue1073 = scopeValue157();
    const scopeValue1074 = [scopeValue9.assets, scopeValue9.meta, ...scopeValue1073];
    const scopeValue1075 = await scopeValue83(scopeValue1074, "readwrite", async scopeValue1076 => {
      const scopeValue1077 = await scopeValue160(scopeValue1076, scopeValue1073);
      const scopeValue1078 = await scopeValue77(scopeValue1076[scopeValue9.assets].getAll());
      const scopeValue1079 = (Array.isArray(scopeValue1078) ? scopeValue1078 : []).filter(scopeValue1080 => {
        return scopeValue1080?.id && scopeValue1080.orphanedAt && scopeValue1072 - Number(scopeValue1080.orphanedAt) >= scopeValue1071 && !scopeValue1077.has(String(scopeValue1080.id));
      });
      scopeValue1079.forEach(scopeValue1081 => scopeValue1076[scopeValue9.assets].delete(scopeValue1081.id));
      return scopeValue1079.map(scopeValue1082 => String(scopeValue1082.id));
    });
    scopeValue1075.forEach(scopeValue1083 => scopeValue59(scopeValue1083));
    return scopeValue1075.length;
  }
  function scopeValue167(scopeValue1084, scopeValue1085 = 0) {
    if (scopeValue1084 && Number.isFinite(Number(scopeValue1084.__messageOrder))) {
      return Number(scopeValue1084.__messageOrder);
    }
    return Number.isFinite(Number(scopeValue1085)) ? Number(scopeValue1085) : 0;
  }
  function scopeValue168(scopeValue1086) {
    if (!scopeValue1086 || typeof scopeValue1086 !== "object") return null;
    const scopeValue1087 = Number(scopeValue1086.price);
    return {
      orderId: String(scopeValue1086.orderId || "").slice(0, 160),
      itemName: String(scopeValue1086.itemName || "").slice(0, 80),
      price: Number.isFinite(scopeValue1087) && scopeValue1087 > 0 ? scopeValue1087 : 0,
      paymentMethod: String(scopeValue1086.paymentMethod || "").slice(0, 80),
      senderRole: scopeValue1086.senderRole === "assistant" ? "assistant" : "user",
      senderName: String(scopeValue1086.senderName || "").slice(0, 80),
      note: String(scopeValue1086.note || "").slice(0, 180)
    };
  }
  function scopeValue169(scopeValue1088) {
    if (!scopeValue1088 || typeof scopeValue1088 !== "object") return null;
    const scopeValue1089 = Number(scopeValue1088.amount);
    const scopeValue1090 = Number(scopeValue1088.balance);
    return {
      transactionId: String(scopeValue1088.transactionId || "").slice(0, 160),
      friendId: String(scopeValue1088.friendId || "").slice(0, 160),
      title: String(scopeValue1088.title || "").slice(0, 160),
      amount: Number.isFinite(scopeValue1089) && scopeValue1089 > 0 ? scopeValue1089 : 0,
      balance: Number.isFinite(scopeValue1090) ? scopeValue1090 : null
    };
  }
  function scopeValue170(scopeValue1091) {
    if (scopeValue1091.type !== "location") return {};
    const scopeValue1092 = /^\[位置\]\s?([\s\S]*)$/.exec(String(scopeValue1091.content || scopeValue1091.text || ""));
    const scopeValue1093 = scopeValue1092 ? scopeValue1092[1].split(" — ") : [];
    const scopeValue1094 = scopeValue1098 => {
      const scopeValue1099 = /^(.*)（([^（）]*)）$/.exec(scopeValue1098);
      return scopeValue1099 ? {
        text: scopeValue1099[1],
        translation: scopeValue1099[2]
      } : {
        text: scopeValue1098,
        translation: ""
      };
    };
    const scopeValue1095 = scopeValue1094(scopeValue1093.shift() || "");
    const scopeValue1096 = scopeValue1094(scopeValue1093.join(" — "));
    const scopeValue1097 = (scopeValue1100, scopeValue1101, scopeValue1102, scopeValue1103) => String(Object.prototype.hasOwnProperty.call(scopeValue1091, scopeValue1100) ? scopeValue1091[scopeValue1100] ?? "" : scopeValue1091[scopeValue1101] || scopeValue1102 || "").slice(0, scopeValue1103);
    return {
      locationName: scopeValue1097("locationName", "name", scopeValue1095.text, 80),
      locationAddress: scopeValue1097("locationAddress", "address", scopeValue1096.text, 160),
      locationNameTranslation: scopeValue1097("locationNameTranslation", "nameTranslation", scopeValue1091.locationName || scopeValue1091.name ? "" : scopeValue1095.translation, 80),
      locationAddressTranslation: scopeValue1097("locationAddressTranslation", "addressTranslation", scopeValue1091.locationAddress || scopeValue1091.address ? "" : scopeValue1096.translation, 160)
    };
  }
  function scopeValue171(scopeValue1104, scopeValue1105, scopeValue1106) {
    const scopeValue1107 = scopeValue1105 || {};
    const scopeValue1108 = scopeValue167(scopeValue1107, scopeValue1106);
    const scopeValue1109 = scopeValue1107.type === "user_phone_access_card";
    const scopeValue1110 = scopeValue1109 && Array.isArray(scopeValue1107.visits) ? scopeValue49(scopeValue47(scopeValue1107.visits)) : [];
    const scopeValue1111 = scopeValue1110.reduce((scopeValue1112, scopeValue1113) => {
      const scopeValue1114 = Number(scopeValue1113?.durationSeconds);
      return scopeValue1112 + (Number.isFinite(scopeValue1114) ? Math.max(0, Math.round(scopeValue1114)) : 0);
    }, 0);
    return {
      id: scopeValue1107.id || `${String(scopeValue1104)}_msg_${scopeValue1107.timestamp || Date.now()}_${scopeValue1108}`,
      friendId: String(scopeValue1104),
      order: scopeValue1108,
      role: scopeValue1107.role || "assistant",
      ...(typeof scopeValue1107.thought === "string" ? { thought: scopeValue1107.thought } : {}),
      type: scopeValue1107.type || "text",
      ...scopeValue170(scopeValue1107),
      ...(scopeValue1107.type === "file" ? {
        fileData: scopeValue49(scopeValue47(scopeValue1107.fileData || {}))
      } : {}),
      ...(scopeValue1107.awayActivity ? {
        awayActivity: scopeValue49(scopeValue47(scopeValue1107.awayActivity))
      } : {}),
      ...(Object.prototype.hasOwnProperty.call(scopeValue1107, "awayActivityBefore") ? {
        awayActivityBefore: scopeValue49(scopeValue47(scopeValue1107.awayActivityBefore))
      } : {}),
      deliveryStatus: scopeValue1107.deliveryStatus === "blocked" ? "blocked" : "",
      excludedFromContext: scopeValue1107.excludedFromContext === true,
      blockedDirection: ["user_blocks_char", "char_blocks_user"].includes(scopeValue1107.blockedDirection) ? scopeValue1107.blockedDirection : "",
      requesterRole: scopeValue1107.requesterRole === "assistant" ? "assistant" : scopeValue1107.requesterRole === "user" ? "user" : scopeValue1107.type === "unblock_request" ? scopeValue1107.role === "assistant" ? "assistant" : "user" : "",
      requestId: typeof scopeValue1107.requestId === "string" ? scopeValue1107.requestId : "",
      requestText: typeof scopeValue1107.requestText === "string" && scopeValue1107.requestText ? scopeValue1107.requestText.slice(0, 500) : scopeValue1107.type === "unblock_request" ? String(scopeValue1107.content || "").slice(0, 500) : "",
      requestStatus: ["pending", "accepted", "rejected", "resolved", "confirmed", "cancelled"].includes(scopeValue1107.requestStatus) ? scopeValue1107.requestStatus : scopeValue1107.type === "unblock_request" ? "pending" : "",
      memoryRequestId: scopeValue1107.type === "memory_request" ? String(scopeValue1107.memoryRequestId || scopeValue1107.id || "") : "",
      memoryPayload: scopeValue1107.type === "memory_request" && scopeValue1107.memoryPayload && typeof scopeValue1107.memoryPayload === "object" ? scopeValue49(scopeValue47(scopeValue1107.memoryPayload)) : null,
      decision: ["accept", "reject", "unblocked"].includes(scopeValue1107.decision) ? scopeValue1107.decision : "",
      decidedAt: Math.max(0, Number(scopeValue1107.decidedAt) || 0),
      noticeKind: typeof scopeValue1107.noticeKind === "string" ? scopeValue1107.noticeKind : "",
      familyCardSpend: scopeValue1107.type === "system_notice" && scopeValue1107.noticeKind === "family_card_spend" ? scopeValue169(scopeValue1107.familyCardSpend) : null,
      actorRole: scopeValue1107.actorRole === "user" || scopeValue1107.actorRole === "assistant" ? scopeValue1107.actorRole : "",
      actorName: typeof scopeValue1107.actorName === "string" ? scopeValue1107.actorName : "",
      content: typeof scopeValue1107.content === "string" ? scopeValue1107.content : "",
      contentAssetId: typeof scopeValue1107.contentAssetId === "string" ? scopeValue1107.contentAssetId : "",
      albumImages: Array.isArray(scopeValue1107.albumImages) ? scopeValue1107.albumImages.slice(0, 8).map(scopeValue1115 => ({
        url: typeof scopeValue1115?.url === "string" ? scopeValue1115.url : "",
        assetId: typeof scopeValue1115?.assetId === "string" ? scopeValue1115.assetId : "",
        fileName: typeof scopeValue1115?.fileName === "string" ? scopeValue1115.fileName : ""
      })) : [],
      text: typeof scopeValue1107.text === "string" ? scopeValue1107.text : "",
      giftName: String(scopeValue1107.giftName || ""),
      giftValue: Number(scopeValue1107.giftValue) || 0,
      giftDescription: String(scopeValue1107.giftDescription || ""),
      giftStatus: scopeValue1107.giftStatus === "received" ? "received" : "pending",
      giftPaymentMethod: String(scopeValue1107.giftPaymentMethod || ""),
      remarkChange: scopeValue1107.noticeKind === "user_remark_changed" && scopeValue1107.remarkChange ? {
        oldRemark: String(scopeValue1107.remarkChange.oldRemark || ""),
        newRemark: String(scopeValue1107.remarkChange.newRemark || "")
      } : null,
      shopGift: ["html", "gift"].includes(scopeValue1107.type) ? scopeValue168(scopeValue1107.shopGift) : null,
      transcript: typeof scopeValue1107.transcript === "string" ? scopeValue1107.transcript : "",
      ttsAudioAssetId: typeof scopeValue1107.ttsAudioAssetId === "string" ? scopeValue1107.ttsAudioAssetId : "",
      ttsAudioText: typeof scopeValue1107.ttsAudioText === "string" ? scopeValue1107.ttsAudioText : "",
      stickerCategory: typeof scopeValue1107.stickerCategory === "string" ? scopeValue1107.stickerCategory : "",
      stickerName: typeof scopeValue1107.stickerName === "string" ? scopeValue1107.stickerName : "",
      stickerUrl: typeof scopeValue1107.stickerUrl === "string" ? scopeValue1107.stickerUrl : "",
      stickerAssetId: typeof scopeValue1107.stickerAssetId === "string" ? scopeValue1107.stickerAssetId : "",
      translation: typeof scopeValue1107.translation === "string" ? scopeValue1107.translation : "",
      showTranslation: !!scopeValue1107.showTranslation,
      replyTo: scopeValue1107.replyTo || null,
      offlineMode: !!scopeValue1107.offlineMode,
      offlineScene: typeof scopeValue1107.offlineScene === "string" ? scopeValue1107.offlineScene : "",
      offlineAction: typeof scopeValue1107.offlineAction === "string" ? scopeValue1107.offlineAction : "",
      offlineSessionId: typeof scopeValue1107.offlineSessionId === "string" ? scopeValue1107.offlineSessionId : "",
      endedAt: Number(scopeValue1107.endedAt) || 0,
      dateText: typeof scopeValue1107.dateText === "string" ? scopeValue1107.dateText : "",
      title: typeof scopeValue1107.title === "string" ? scopeValue1107.title : "",
      invitationText: typeof scopeValue1107.invitationText === "string" ? scopeValue1107.invitationText.slice(0, 200) : "",
      place: typeof scopeValue1107.place === "string" ? scopeValue1107.place.slice(0, 80) : "",
      artist: typeof scopeValue1107.artist === "string" ? scopeValue1107.artist : "",
      trackId: typeof scopeValue1107.trackId === "string" ? scopeValue1107.trackId : "",
      playlistId: typeof scopeValue1107.playlistId === "string" ? scopeValue1107.playlistId : "",
      playlistName: typeof scopeValue1107.playlistName === "string" ? scopeValue1107.playlistName : "",
      coverUrl: typeof scopeValue1107.coverUrl === "string" ? scopeValue1107.coverUrl : "",
      contactId: typeof scopeValue1107.contactId === "string" ? scopeValue1107.contactId : "",
      contactType: scopeValue1107.contactType === "npc" ? "npc" : scopeValue1107.contactType === "char" ? "char" : "",
      contactName: typeof scopeValue1107.contactName === "string" ? scopeValue1107.contactName.slice(0, 200) : "",
      contactRealName: typeof scopeValue1107.contactRealName === "string" ? scopeValue1107.contactRealName.slice(0, 200) : "",
      contactAvatarUrl: typeof scopeValue1107.contactAvatarUrl === "string" ? scopeValue1107.contactAvatarUrl : "",
      contactAvatarAssetId: typeof scopeValue1107.contactAvatarAssetId === "string" ? scopeValue1107.contactAvatarAssetId : "",
      contactSignature: typeof scopeValue1107.contactSignature === "string" ? scopeValue1107.contactSignature.slice(0, 1000) : "",
      contactPersona: typeof scopeValue1107.contactPersona === "string" ? scopeValue1107.contactPersona.slice(0, 8000) : "",
      contactReferrerRelation: typeof scopeValue1107.contactReferrerRelation === "string" ? scopeValue1107.contactReferrerRelation.slice(0, 200) : "",
      contactSource: scopeValue1107.contactSource === "generated" ? "generated" : "existing",
      contactReferrerId: typeof scopeValue1107.contactReferrerId === "string" ? scopeValue1107.contactReferrerId : "",
      contactActionStatus: ["idle", "added", "request_pending", "request_accepted", "request_rejected"].includes(scopeValue1107.contactActionStatus) ? scopeValue1107.contactActionStatus : "idle",
      contactRequestId: typeof scopeValue1107.contactRequestId === "string" ? scopeValue1107.contactRequestId : "",
      inviteStatus: ["pending", "accepted", "declined", "superseded"].includes(scopeValue1107.inviteStatus) ? scopeValue1107.inviteStatus : "",
      acceptedAt: Math.max(0, Number(scopeValue1107.acceptedAt) || 0),
      respondedAt: Math.max(0, Number(scopeValue1107.respondedAt) || 0),
      summary: typeof scopeValue1107.summary === "string" ? scopeValue1107.summary : "",
      rawSummary: typeof scopeValue1107.rawSummary === "string" ? scopeValue1107.rawSummary : "",
      ...(scopeValue1109 ? {
        phoneAccessMode: scopeValue1107.phoneAccessMode === "auto" ? "auto" : "chat",
        visits: scopeValue1110,
        totalDurationSeconds: scopeValue1111
      } : {}),
      timestamp: Number(scopeValue1107.timestamp) || Date.now(),
      amount: scopeValue1107.amount,
      description: scopeValue1107.description,
      targetName: scopeValue1107.targetName,
      payKind: scopeValue1107.payKind,
      speaker: scopeValue1107.speaker,
      senderName: scopeValue1107.senderName,
      senderAvatarUrl: scopeValue1107.senderAvatarUrl,
      senderAvatarAssetId: typeof scopeValue1107.senderAvatarAssetId === "string" ? scopeValue1107.senderAvatarAssetId : "",
      userIdentity: scopeValue1107.userIdentity && typeof scopeValue1107.userIdentity === "object" ? {
        accountId: String(scopeValue1107.userIdentity.accountId || ""),
        name: String(scopeValue1107.userIdentity.name || ""),
        avatarUrl: String(scopeValue1107.userIdentity.avatarUrl || "")
      } : null,
      packetMsg: scopeValue1107.packetMsg,
      claims: scopeValue1107.claims,
      packetCount: scopeValue1107.packetCount,
      packetType: scopeValue1107.packetType,
      allocations: scopeValue1107.allocations,
      status: scopeValue1107.status,
      duration: scopeValue1107.duration,
      callMessages: scopeValue1107.callMessages,
      isSelf: scopeValue1107.isSelf,
      statusText: scopeValue1107.statusText,
      senderId: scopeValue1107.senderId,
      apiRunId: scopeValue1107.apiRunId,
      mcpPayment: scopeValue1107.type === "mcp_payment" && scopeValue1107.mcpPayment && typeof scopeValue1107.mcpPayment === "object" ? scopeValue49(scopeValue47(scopeValue1107.mcpPayment)) : undefined,
      mcpPaymentRunIds: scopeValue1107.type === "mcp_payment" && Array.isArray(scopeValue1107.mcpPaymentRunIds) ? scopeValue1107.mcpPaymentRunIds.filter(newScope1159 => typeof newScope1159 === "string") : undefined,
      cotSummary: typeof scopeValue1107.cotSummary === "string" ? scopeValue1107.cotSummary.slice(0, 4000) : "",
      rollbackSourceMessage: scopeValue1107.rollbackSourceMessage || null,
      paymentAction: scopeValue1107.paymentAction,
      familyCardId: scopeValue1107.familyCardId,
      familyCardStatus: scopeValue1107.familyCardStatus,
      previousLimit: scopeValue1107.previousLimit,
      payDirection: scopeValue1107.payDirection,
      payerName: scopeValue1107.payerName,
      payeeName: scopeValue1107.payeeName,
      receiverName: scopeValue1107.receiverName,
      cardTitle: scopeValue1107.cardTitle,
      payStatus: scopeValue1107.payStatus,
      claimed: !!scopeValue1107.claimed,
      imageSource: scopeValue1107.imageSource,
      imageProvider: typeof scopeValue1107.imageProvider === "string" ? scopeValue1107.imageProvider : "",
      imageModel: typeof scopeValue1107.imageModel === "string" ? scopeValue1107.imageModel : "",
      imageSize: typeof scopeValue1107.imageSize === "string" ? scopeValue1107.imageSize : "",
      faceReferenceUsed: !!scopeValue1107.faceReferenceUsed,
      charFaceReferenceUsed: !!scopeValue1107.charFaceReferenceUsed,
      userFaceReferenceUsed: !!scopeValue1107.userFaceReferenceUsed,
      imageGenerationPrompt: typeof scopeValue1107.imageGenerationPrompt === "string" ? scopeValue1107.imageGenerationPrompt.slice(0, 16000) : "",
      imageGenerationCompiledPrompt: typeof scopeValue1107.imageGenerationCompiledPrompt === "string" ? scopeValue1107.imageGenerationCompiledPrompt.slice(0, 24000) : "",
      imageGenerationConfig: scopeValue1107.imageGenerationConfig && typeof scopeValue1107.imageGenerationConfig === "object" ? {
        basePrompt: String(scopeValue1107.imageGenerationConfig.basePrompt || scopeValue1107.imageGenerationConfig.lastPrompt || "").slice(0, 8000),
        charAppearance: String(scopeValue1107.imageGenerationConfig.charAppearance || "").slice(0, 4000),
        userAppearance: String(scopeValue1107.imageGenerationConfig.userAppearance || "").slice(0, 4000),
        artistPrompt: String(scopeValue1107.imageGenerationConfig.artistPrompt || "").slice(0, 4000),
        negativePrompt: String(scopeValue1107.imageGenerationConfig.negativePrompt || "").slice(0, 4000),
        includeCharAppearance: scopeValue1107.imageGenerationConfig.includeCharAppearance !== false,
        includeUserAppearance: scopeValue1107.imageGenerationConfig.includeUserAppearance !== false,
        useReferenceFace: scopeValue1107.imageGenerationConfig.useReferenceFace === true,
        useCharReferenceFace: scopeValue1107.imageGenerationConfig.useCharReferenceFace === true || scopeValue1107.imageGenerationConfig.useCharReferenceFace == null && scopeValue1107.imageGenerationConfig.useReferenceFace === true,
        useUserReferenceFace: scopeValue1107.imageGenerationConfig.useUserReferenceFace === true
      } : null,
      imageRerollCount: Math.max(0, Number(scopeValue1107.imageRerollCount) || 0),
      imageRerolledAt: Math.max(0, Number(scopeValue1107.imageRerolledAt) || 0),
      fakeLinkData: scopeValue1107.fakeLinkData && typeof scopeValue1107.fakeLinkData === "object" ? scopeValue49(scopeValue47(scopeValue1107.fakeLinkData)) : null,
      record: scopeValue1107.record && typeof scopeValue1107.record === "object" ? scopeValue49(scopeValue47(scopeValue1107.record)) : null,
      officialArtifact: scopeValue1107.officialArtifact && typeof scopeValue1107.officialArtifact === "object" ? scopeValue49(scopeValue47(scopeValue1107.officialArtifact)) : null,
      officialFile: scopeValue1107.officialFile && typeof scopeValue1107.officialFile === "object" ? scopeValue49(scopeValue47(scopeValue1107.officialFile)) : null,
      packetId: scopeValue1107.packetId,
      totalAmount: scopeValue1107.totalAmount,
      claimRecords: scopeValue1107.claimRecords,
      claimedMemberIds: scopeValue1107.claimedMemberIds,
      speakerMemberId: scopeValue1107.speakerMemberId,
      pollId: typeof scopeValue1107.pollId === "string" ? scopeValue1107.pollId : "",
      pollQuestion: typeof scopeValue1107.pollQuestion === "string" ? scopeValue1107.pollQuestion : "",
      pollOptions: Array.isArray(scopeValue1107.pollOptions) ? scopeValue49(scopeValue47(scopeValue1107.pollOptions)) : [],
      pollVotes: Array.isArray(scopeValue1107.pollVotes) ? scopeValue49(scopeValue47(scopeValue1107.pollVotes)) : [],
      pollStatus: ["idle", "pending", "completed", "error"].includes(scopeValue1107.pollStatus) ? scopeValue1107.pollStatus : "",
      pollError: typeof scopeValue1107.pollError === "string" ? scopeValue1107.pollError : "",
      payload: scopeValue1107.payload || null
    };
  }
  function scopeValue172(scopeValue1116) {
    if (!scopeValue1116 || scopeValue1116.type !== "group_poll") return null;
    const scopeValue1117 = String(scopeValue1116.content || "");
    const scopeValue1118 = scopeValue1117.match(/^\[群投票：([^\n\]]+)/);
    const scopeValue1119 = scopeValue1117.match(/\n选项：([^\n\]]+)/);
    if (!scopeValue1118 || !scopeValue1119) return null;
    const scopeValue1120 = scopeValue1119[1].split(/\s*\/\s*/).map(scopeValue1127 => scopeValue1127.trim()).filter(Boolean);
    if (scopeValue1120.length < 2) return null;
    const scopeValue1121 = String(scopeValue1116.id || "legacy").replace(/[^a-zA-Z0-9_-]/g, "-");
    const scopeValue1122 = scopeValue1120.map((scopeValue1128, scopeValue1129) => ({
      id: `legacy-${scopeValue1121}-option-${scopeValue1129 + 1}`,
      text: scopeValue1128
    }));
    const scopeValue1123 = new Map(scopeValue1122.map(scopeValue1130 => [scopeValue1130.text, scopeValue1130.id]));
    const scopeValue1124 = String(window.userState?.name || "User");
    const scopeValue1125 = scopeValue1117.match(/\n当前投票：([^\n\]]+)/);
    const scopeValue1126 = !scopeValue1125 || scopeValue1125[1].trim() === "暂无" ? [] : scopeValue1125[1].split("；").map((scopeValue1131, scopeValue1132) => {
      const scopeValue1133 = scopeValue1131.split("→").map(scopeValue1136 => scopeValue1136.trim());
      const scopeValue1134 = scopeValue1123.get(scopeValue1133[1]);
      if (!scopeValue1133[0] || !scopeValue1134) return null;
      const scopeValue1135 = scopeValue1133[0] === scopeValue1124 || scopeValue1133[0] === "User";
      return {
        voterId: scopeValue1135 ? "__user__" : `legacy-${scopeValue1121}-voter-${scopeValue1132 + 1}`,
        voterName: scopeValue1133[0],
        optionId: scopeValue1134,
        voterType: scopeValue1135 ? "user" : "member"
      };
    }).filter(Boolean);
    return {
      pollId: `legacy-${scopeValue1121}`,
      pollQuestion: scopeValue1118[1].trim(),
      pollOptions: scopeValue1122,
      pollVotes: scopeValue1126,
      pollStatus: "completed",
      pollError: ""
    };
  }
  function scopeValue173(scopeValue1137) {
    const scopeValue1138 = scopeValue1137.noticeKind === "message_recalled" ? String(scopeValue1137.content || "").trim().startsWith("你撤回了") ? "user" : "assistant" : "";
    const scopeValue1139 = scopeValue172(scopeValue1137);
    const scopeValue1140 = scopeValue1137.type === "user_phone_access_card";
    const scopeValue1141 = scopeValue1140 && Array.isArray(scopeValue1137.visits) ? scopeValue47(scopeValue1137.visits) : [];
    const scopeValue1142 = scopeValue1141.reduce((scopeValue1143, scopeValue1144) => {
      const scopeValue1145 = Number(scopeValue1144?.durationSeconds);
      return scopeValue1143 + (Number.isFinite(scopeValue1145) ? Math.max(0, Math.round(scopeValue1145)) : 0);
    }, 0);
    return {
      id: scopeValue1137.id,
      role: scopeValue1137.role,
      ...(typeof scopeValue1137.thought === "string" ? { thought: scopeValue1137.thought } : {}),
      type: scopeValue1137.type,
      ...scopeValue170(scopeValue1137),
      ...(scopeValue1137.type === "file" ? {
        fileData: scopeValue47(scopeValue1137.fileData || {})
      } : {}),
      ...(scopeValue1137.awayActivity ? {
        awayActivity: scopeValue47(scopeValue1137.awayActivity)
      } : {}),
      ...(Object.prototype.hasOwnProperty.call(scopeValue1137, "awayActivityBefore") ? {
        awayActivityBefore: scopeValue47(scopeValue1137.awayActivityBefore)
      } : {}),
      deliveryStatus: scopeValue1137.deliveryStatus === "blocked" ? "blocked" : "",
      excludedFromContext: scopeValue1137.excludedFromContext === true,
      blockedDirection: ["user_blocks_char", "char_blocks_user"].includes(scopeValue1137.blockedDirection) ? scopeValue1137.blockedDirection : "",
      requesterRole: scopeValue1137.requesterRole === "assistant" ? "assistant" : scopeValue1137.requesterRole === "user" ? "user" : scopeValue1137.type === "unblock_request" ? scopeValue1137.role === "assistant" ? "assistant" : "user" : "",
      requestId: typeof scopeValue1137.requestId === "string" ? scopeValue1137.requestId : "",
      requestText: typeof scopeValue1137.requestText === "string" && scopeValue1137.requestText ? scopeValue1137.requestText : scopeValue1137.type === "unblock_request" ? String(scopeValue1137.content || "") : "",
      requestStatus: ["pending", "accepted", "rejected", "resolved", "confirmed", "cancelled"].includes(scopeValue1137.requestStatus) ? scopeValue1137.requestStatus : scopeValue1137.type === "unblock_request" ? "pending" : "",
      memoryRequestId: scopeValue1137.type === "memory_request" ? String(scopeValue1137.memoryRequestId || scopeValue1137.id || "") : "",
      memoryPayload: scopeValue1137.type === "memory_request" && scopeValue1137.memoryPayload && typeof scopeValue1137.memoryPayload === "object" ? scopeValue47(scopeValue1137.memoryPayload) : null,
      decision: ["accept", "reject", "unblocked"].includes(scopeValue1137.decision) ? scopeValue1137.decision : "",
      decidedAt: Math.max(0, Number(scopeValue1137.decidedAt) || 0),
      noticeKind: scopeValue1137.noticeKind || "",
      familyCardSpend: scopeValue1137.type === "system_notice" && scopeValue1137.noticeKind === "family_card_spend" ? scopeValue169(scopeValue1137.familyCardSpend) : null,
      actorRole: scopeValue1137.actorRole === "user" || scopeValue1137.actorRole === "assistant" ? scopeValue1137.actorRole : scopeValue1138,
      actorName: scopeValue1137.actorName || "",
      content: scopeValue1137.content,
      contentAssetId: scopeValue1137.contentAssetId || "",
      albumImages: Array.isArray(scopeValue1137.albumImages) ? scopeValue1137.albumImages.map(scopeValue1146 => ({
        url: scopeValue1146?.url || "",
        assetId: scopeValue1146?.assetId || "",
        fileName: scopeValue1146?.fileName || ""
      })) : [],
      text: scopeValue1137.text,
      giftName: String(scopeValue1137.giftName || ""),
      giftValue: Number(scopeValue1137.giftValue) || 0,
      giftDescription: String(scopeValue1137.giftDescription || ""),
      giftStatus: scopeValue1137.giftStatus === "received" ? "received" : "pending",
      giftPaymentMethod: String(scopeValue1137.giftPaymentMethod || ""),
      remarkChange: scopeValue1137.noticeKind === "user_remark_changed" && scopeValue1137.remarkChange ? {
        oldRemark: String(scopeValue1137.remarkChange.oldRemark || ""),
        newRemark: String(scopeValue1137.remarkChange.newRemark || "")
      } : null,
      shopGift: ["html", "gift"].includes(scopeValue1137.type) ? scopeValue168(scopeValue1137.shopGift) : null,
      transcript: scopeValue1137.transcript,
      ttsAudioAssetId: scopeValue1137.ttsAudioAssetId || "",
      ttsAudioText: scopeValue1137.ttsAudioText || "",
      stickerCategory: scopeValue1137.stickerCategory,
      stickerName: scopeValue1137.stickerName,
      stickerUrl: scopeValue1137.stickerUrl,
      stickerAssetId: scopeValue1137.stickerAssetId || "",
      translation: scopeValue1137.translation,
      showTranslation: scopeValue1137.showTranslation,
      replyTo: scopeValue1137.replyTo,
      offlineMode: !!scopeValue1137.offlineMode,
      offlineScene: scopeValue1137.offlineScene || "",
      offlineAction: scopeValue1137.offlineAction || "",
      offlineSessionId: scopeValue1137.offlineSessionId || "",
      endedAt: Number(scopeValue1137.endedAt) || 0,
      dateText: scopeValue1137.dateText || "",
      title: scopeValue1137.title || "",
      invitationText: scopeValue1137.invitationText || "",
      place: scopeValue1137.place || "",
      artist: scopeValue1137.artist || "",
      trackId: scopeValue1137.trackId || "",
      playlistId: scopeValue1137.playlistId || "",
      playlistName: scopeValue1137.playlistName || "",
      coverUrl: scopeValue1137.coverUrl || "",
      contactId: scopeValue1137.contactId || "",
      contactType: scopeValue1137.contactType === "npc" ? "npc" : scopeValue1137.contactType === "char" ? "char" : "",
      contactName: scopeValue1137.contactName || "",
      contactRealName: scopeValue1137.contactRealName || "",
      contactAvatarUrl: scopeValue1137.contactAvatarUrl || "",
      contactAvatarAssetId: scopeValue1137.contactAvatarAssetId || "",
      contactSignature: scopeValue1137.contactSignature || "",
      contactPersona: scopeValue1137.contactPersona || "",
      contactReferrerRelation: scopeValue1137.contactReferrerRelation || "",
      contactSource: scopeValue1137.contactSource === "generated" ? "generated" : "existing",
      contactReferrerId: scopeValue1137.contactReferrerId || "",
      contactActionStatus: ["idle", "added", "request_pending", "request_accepted", "request_rejected"].includes(scopeValue1137.contactActionStatus) ? scopeValue1137.contactActionStatus : "idle",
      contactRequestId: scopeValue1137.contactRequestId || "",
      inviteStatus: ["pending", "accepted", "declined", "superseded"].includes(scopeValue1137.inviteStatus) ? scopeValue1137.inviteStatus : "",
      acceptedAt: Math.max(0, Number(scopeValue1137.acceptedAt) || 0),
      respondedAt: Math.max(0, Number(scopeValue1137.respondedAt) || 0),
      summary: scopeValue1137.summary || "",
      rawSummary: scopeValue1137.rawSummary || "",
      ...(scopeValue1140 ? {
        phoneAccessMode: scopeValue1137.phoneAccessMode === "auto" ? "auto" : "chat",
        visits: scopeValue1141,
        totalDurationSeconds: scopeValue1142
      } : {}),
      timestamp: scopeValue1137.timestamp,
      amount: scopeValue1137.amount,
      description: scopeValue1137.description,
      targetName: scopeValue1137.targetName,
      payKind: scopeValue1137.payKind,
      speaker: scopeValue1137.speaker,
      senderName: scopeValue1137.senderName,
      senderAvatarUrl: scopeValue1137.senderAvatarUrl,
      senderAvatarAssetId: scopeValue1137.senderAvatarAssetId || "",
      userIdentity: scopeValue1137.userIdentity && typeof scopeValue1137.userIdentity === "object" ? {
        accountId: String(scopeValue1137.userIdentity.accountId || ""),
        name: String(scopeValue1137.userIdentity.name || ""),
        avatarUrl: String(scopeValue1137.userIdentity.avatarUrl || "")
      } : null,
      packetMsg: scopeValue1137.packetMsg,
      claims: scopeValue1137.claims,
      packetCount: scopeValue1137.packetCount,
      packetType: scopeValue1137.packetType,
      allocations: scopeValue1137.allocations,
      status: scopeValue1137.status,
      duration: scopeValue1137.duration,
      callMessages: scopeValue1137.callMessages,
      isSelf: scopeValue1137.isSelf,
      statusText: scopeValue1137.statusText,
      senderId: scopeValue1137.senderId,
      apiRunId: scopeValue1137.apiRunId,
      mcpPayment: scopeValue1137.type === "mcp_payment" && scopeValue1137.mcpPayment ? scopeValue47(scopeValue1137.mcpPayment) : undefined,
      mcpPaymentRunIds: scopeValue1137.type === "mcp_payment" && Array.isArray(scopeValue1137.mcpPaymentRunIds) ? scopeValue1137.mcpPaymentRunIds.slice() : undefined,
      cotSummary: typeof scopeValue1137.cotSummary === "string" ? scopeValue1137.cotSummary : "",
      rollbackSourceMessage: scopeValue1137.rollbackSourceMessage || null,
      paymentAction: scopeValue1137.paymentAction,
      familyCardId: scopeValue1137.familyCardId,
      familyCardStatus: scopeValue1137.familyCardStatus || {
        family_card_pending: "pending",
        family_card_accepted: "accepted",
        family_card_rejected: "rejected",
        family_card_unbound: "unbound"
      }[scopeValue1137.payKind],
      previousLimit: scopeValue1137.previousLimit,
      payDirection: scopeValue1137.payDirection,
      payerName: scopeValue1137.payerName,
      payeeName: scopeValue1137.payeeName,
      receiverName: scopeValue1137.receiverName,
      cardTitle: scopeValue1137.cardTitle,
      payStatus: scopeValue1137.payStatus,
      claimed: !!scopeValue1137.claimed,
      imageSource: scopeValue1137.imageSource,
      imageProvider: scopeValue1137.imageProvider || "",
      imageModel: scopeValue1137.imageModel || "",
      imageSize: scopeValue1137.imageSize || "",
      faceReferenceUsed: !!scopeValue1137.faceReferenceUsed,
      charFaceReferenceUsed: !!scopeValue1137.charFaceReferenceUsed,
      userFaceReferenceUsed: !!scopeValue1137.userFaceReferenceUsed,
      imageGenerationPrompt: scopeValue1137.imageGenerationPrompt || "",
      imageGenerationCompiledPrompt: scopeValue1137.imageGenerationCompiledPrompt || "",
      imageGenerationConfig: scopeValue1137.imageGenerationConfig && typeof scopeValue1137.imageGenerationConfig === "object" ? scopeValue47(scopeValue1137.imageGenerationConfig) : null,
      imageRerollCount: Math.max(0, Number(scopeValue1137.imageRerollCount) || 0),
      imageRerolledAt: Math.max(0, Number(scopeValue1137.imageRerolledAt) || 0),
      fakeLinkData: scopeValue1137.fakeLinkData && typeof scopeValue1137.fakeLinkData === "object" ? scopeValue47(scopeValue1137.fakeLinkData) : null,
      record: scopeValue1137.record && typeof scopeValue1137.record === "object" ? scopeValue47(scopeValue1137.record) : null,
      officialArtifact: scopeValue1137.officialArtifact && typeof scopeValue1137.officialArtifact === "object" ? scopeValue47(scopeValue1137.officialArtifact) : null,
      officialFile: scopeValue1137.officialFile && typeof scopeValue1137.officialFile === "object" ? scopeValue47(scopeValue1137.officialFile) : null,
      packetId: scopeValue1137.packetId,
      totalAmount: scopeValue1137.totalAmount,
      claimRecords: scopeValue1137.claimRecords,
      claimedMemberIds: scopeValue1137.claimedMemberIds,
      speakerMemberId: scopeValue1137.speakerMemberId,
      pollId: scopeValue1137.pollId || scopeValue1139?.pollId || "",
      pollQuestion: scopeValue1137.pollQuestion || scopeValue1139?.pollQuestion || "",
      pollOptions: Array.isArray(scopeValue1137.pollOptions) && scopeValue1137.pollOptions.length > 0 ? scopeValue47(scopeValue1137.pollOptions) : scopeValue1139?.pollOptions || [],
      pollVotes: Array.isArray(scopeValue1137.pollVotes) && scopeValue1137.pollVotes.length > 0 ? scopeValue47(scopeValue1137.pollVotes) : scopeValue1139?.pollVotes || [],
      pollStatus: ["idle", "pending", "completed", "error"].includes(scopeValue1137.pollStatus) ? scopeValue1137.pollStatus : scopeValue1139?.pollStatus || "",
      pollError: scopeValue1137.pollError || scopeValue1139?.pollError || "",
      payload: scopeValue1137.payload,
      __messageOrder: Number(scopeValue1137.order) || 0
    };
  }
  const scopeValue174 = [["content", "contentAssetId"], ["stickerUrl", "stickerAssetId"], ["senderAvatarUrl", "senderAvatarAssetId"], ["contactAvatarUrl", "contactAvatarAssetId"]];
  async function scopeValue175(scopeValue1147, scopeValue1148, scopeValue1149 = 0) {
    const scopeValue1150 = scopeValue47(scopeValue1148 || {});
    const scopeValue1151 = String(scopeValue1150.id || `${scopeValue1147}_msg_${scopeValue1150.timestamp || Date.now()}_${scopeValue1149}`);
    scopeValue1150.id = scopeValue1151;
    const scopeValue1152 = [];
    try {
      for (const [scopeValue1153, scopeValue1154] of scopeValue174) {
        const scopeValue1155 = scopeValue1150[scopeValue1153];
        if (scopeValue63(scopeValue1155)) {
          scopeValue1150[scopeValue1154] = await scopeValue75(scopeValue1155, {
            fallbackId: scopeValue177("im_message", scopeValue1151, scopeValue1153),
            ownerType: "im_message",
            ownerId: scopeValue1151,
            field: scopeValue1153
          });
          scopeValue1152.push(scopeValue1150[scopeValue1154]);
          scopeValue1150[scopeValue1153] = "";
        } else if (scopeValue1150[scopeValue1154] && scopeValue64(scopeValue1155)) {
          scopeValue1150[scopeValue1153] = "";
        }
      }
      if (Array.isArray(scopeValue1150.albumImages)) {
        for (let scopeValue1156 = 0; scopeValue1156 < scopeValue1150.albumImages.length; scopeValue1156++) {
          const scopeValue1157 = scopeValue1150.albumImages[scopeValue1156];
          if (!scopeValue1157 || typeof scopeValue1157 !== "object") continue;
          if (scopeValue63(scopeValue1157.url)) {
            scopeValue1157.assetId = await scopeValue75(scopeValue1157.url, {
              fallbackId: scopeValue177("im_message", scopeValue1151, `album_${scopeValue1156 + 1}`),
              ownerType: "im_message",
              ownerId: scopeValue1151,
              field: `album_${scopeValue1156 + 1}`
            });
            scopeValue1152.push(scopeValue1157.assetId);
            scopeValue1157.url = "";
          } else if (scopeValue1157.assetId && scopeValue64(scopeValue1157.url)) {
            scopeValue1157.url = "";
          }
        }
      }
      return scopeValue1150;
    } catch (scopeValue1158) {
      if (scopeValue1152.length) {
        try {
          await scopeValue161(scopeValue1152);
        } catch (scopeValue1159) {}
      }
      throw scopeValue1158;
    }
  }
  async function scopeValue176(scopeValue1160) {
    const scopeValue1161 = {
      ...(scopeValue1160 || {})
    };
    for (const [scopeValue1162, scopeValue1163] of scopeValue174) {
      if (scopeValue1161[scopeValue1163] && !scopeValue1161[scopeValue1162]) {
        try {
          scopeValue1161[scopeValue1162] = await scopeValue143(scopeValue1161[scopeValue1163]);
        } catch (scopeValue1164) {
          console.warn("Failed to hydrate message asset", scopeValue1161[scopeValue1163], scopeValue1164);
          scopeValue1161[scopeValue1162] = "";
        }
      }
    }
    return scopeValue1161;
  }
  function scopeValue177(scopeValue1165, scopeValue1166, scopeValue1167) {
    return `${scopeValue1165}_${String(scopeValue1166)}_${String(scopeValue1167)}`;
  }
  const scopeValue178 = [["avatarUrl", "avatarAssetId"], ["chatBg", "chatBgAssetId"], ["momentsCover", "momentsCoverAssetId"], ["imageFaceReferenceUrl", "imageFaceReferenceAssetId"]];
  async function scopeValue179(scopeValue1168) {
    if (!scopeValue1168) return scopeValue1168;
    const scopeValue1169 = scopeValue47(scopeValue1168);
    for (const [scopeValue1170, scopeValue1171] of scopeValue178) {
      const scopeValue1172 = scopeValue1169[scopeValue1170];
      if (scopeValue63(scopeValue1172)) {
        const scopeValue1173 = await scopeValue75(scopeValue1172, {
          fallbackId: scopeValue1169[scopeValue1171] || scopeValue177("friend", scopeValue1169.id, scopeValue1170),
          ownerType: "im_friend",
          ownerId: String(scopeValue1169.id),
          field: scopeValue1170
        });
        scopeValue1169[scopeValue1171] = scopeValue1173;
        scopeValue1169[scopeValue1170] = null;
        continue;
      }
      if (scopeValue1169[scopeValue1171] && scopeValue64(scopeValue1172)) {
        scopeValue1169[scopeValue1170] = null;
      }
    }
    if (Array.isArray(scopeValue1169.members)) {
      for (let scopeValue1174 = 0; scopeValue1174 < scopeValue1169.members.length; scopeValue1174 += 1) {
        const scopeValue1175 = scopeValue1169.members[scopeValue1174];
        if (!scopeValue1175 || typeof scopeValue1175 !== "object") continue;
        if (scopeValue63(scopeValue1175.avatarUrl)) {
          scopeValue1175.avatarAssetId = await scopeValue75(scopeValue1175.avatarUrl, {
            fallbackId: scopeValue177("friend_member", scopeValue1169.id, scopeValue1175.id ?? scopeValue1174),
            ownerType: "im_group_member",
            ownerId: String(scopeValue1175.id ?? scopeValue1174),
            field: "avatarUrl"
          });
          scopeValue1175.avatarUrl = null;
        } else if (scopeValue1175.avatarAssetId && scopeValue64(scopeValue1175.avatarUrl)) {
          scopeValue1175.avatarUrl = null;
        }
      }
    }
    if (Array.isArray(scopeValue1169.galleryAlbumImages)) {
      for (const scopeValue1176 of scopeValue1169.galleryAlbumImages) {
        if (scopeValue1176?.assetId && scopeValue64(scopeValue1176.url)) scopeValue1176.url = "";
      }
    }
    return scopeValue1169;
  }
  async function scopeValue180(scopeValue1177) {
    if (!scopeValue1177) return scopeValue1177;
    const scopeValue1178 = scopeValue47(scopeValue1177);
    const scopeValue1179 = [["avatarAssetId", "avatarUrl"], ["chatBgAssetId", "chatBg"], ["momentsCoverAssetId", "momentsCover"], ["imageFaceReferenceAssetId", "imageFaceReferenceUrl"]];
    for (const [scopeValue1180, scopeValue1181] of scopeValue1179) {
      if (scopeValue1178[scopeValue1180] && (!scopeValue1178[scopeValue1181] || scopeValue64(scopeValue1178[scopeValue1181]))) {
        scopeValue1178[scopeValue1181] = await scopeValue143(scopeValue1178[scopeValue1180]);
      }
    }
    if (Array.isArray(scopeValue1178.members)) {
      for (const scopeValue1182 of scopeValue1178.members) {
        if (scopeValue1182?.avatarAssetId && !scopeValue1182.avatarUrl) scopeValue1182.avatarUrl = await scopeValue143(scopeValue1182.avatarAssetId);
      }
    }
    if (Array.isArray(scopeValue1178.galleryAlbumImages)) {
      for (const scopeValue1183 of scopeValue1178.galleryAlbumImages) {
        if (scopeValue1183?.assetId && (!scopeValue1183.url || scopeValue64(scopeValue1183.url))) scopeValue1183.url = await scopeValue143(scopeValue1183.assetId);
      }
    }
    return scopeValue1178;
  }
  function scopeValue181(scopeValue1184) {
    if (!scopeValue1184) return [];
    const scopeValue1185 = scopeValue178.map(([, scopeValue1186]) => scopeValue1184[scopeValue1186] ? String(scopeValue1184[scopeValue1186]) : null).filter(Boolean);
    (Array.isArray(scopeValue1184.members) ? scopeValue1184.members : []).forEach(scopeValue1187 => {
      if (scopeValue1187?.avatarAssetId) scopeValue1185.push(String(scopeValue1187.avatarAssetId));
    });
    (Array.isArray(scopeValue1184.galleryAlbumImages) ? scopeValue1184.galleryAlbumImages : []).forEach(scopeValue1188 => {
      if (scopeValue1188?.assetId) scopeValue1185.push(String(scopeValue1188.assetId));
    });
    return Array.from(new Set(scopeValue1185));
  }
  function scopeValue182(scopeValue1189) {
    if (!scopeValue1189 || scopeValue1189.id == null) return [];
    const scopeValue1190 = scopeValue178.map(([scopeValue1191, scopeValue1192]) => {
      if (scopeValue1189[scopeValue1192]) return String(scopeValue1189[scopeValue1192]);
      if (scopeValue63(scopeValue1189[scopeValue1191])) return scopeValue177("friend", scopeValue1189.id, scopeValue1191);
      return null;
    }).filter(Boolean);
    (Array.isArray(scopeValue1189.members) ? scopeValue1189.members : []).forEach((scopeValue1193, scopeValue1194) => {
      if (scopeValue1193?.avatarAssetId) scopeValue1190.push(String(scopeValue1193.avatarAssetId));else if (scopeValue63(scopeValue1193?.avatarUrl)) scopeValue1190.push(scopeValue177("friend_member", scopeValue1189.id, scopeValue1193.id ?? scopeValue1194));
    });
    (Array.isArray(scopeValue1189.galleryAlbumImages) ? scopeValue1189.galleryAlbumImages : []).forEach(scopeValue1195 => {
      if (scopeValue1195?.assetId) scopeValue1190.push(String(scopeValue1195.assetId));
    });
    return Array.from(new Set(scopeValue1190));
  }
  async function scopeValue183(scopeValue1196) {
    if (scopeValue1196 == null) return null;
    return scopeValue84(scopeValue9.imFriends, String(scopeValue1196));
  }
  async function scopeValue184(scopeValue1197) {
    return scopeValue86(scopeValue9.imFriends, String(scopeValue1197));
  }
  async function scopeValue185(scopeValue1198, scopeValue1199, scopeValue1200 = new Set()) {
    if (!scopeValue1198) return;
    const scopeValue1201 = new Set(scopeValue182(scopeValue1199));
    const scopeValue1202 = [];
    for (const scopeValue1203 of scopeValue181(scopeValue1198)) {
      if (scopeValue1201.has(scopeValue1203) || scopeValue1200.has(scopeValue1203)) continue;
      scopeValue1202.push(scopeValue1203);
    }
    if (scopeValue1202.length > 0) await scopeValue161(scopeValue1202);
  }
  async function scopeValue186(scopeValue1204) {
    const scopeValue1205 = Array.isArray(scopeValue1204) ? scopeValue1204 : [];
    const scopeValue1206 = scopeValue1205.filter(scopeValue1209 => !(scopeValue1209?.role === "system" && [scopeValue1209.content, scopeValue1209.text].some(scopeValue1210 => typeof scopeValue1210 === "string" && /^\[Gift event\]/.test(scopeValue1210.trim()))));
    const scopeValue1207 = scopeValue1206.length > 0 ? scopeValue1206[scopeValue1206.length - 1] : null;
    let scopeValue1208 = "";
    if (scopeValue1207) {
      if (scopeValue1207.type === "image") {
        const scopeValue1211 = 1 + (Array.isArray(scopeValue1207.albumImages) ? scopeValue1207.albumImages.length : 0);
        scopeValue1208 = scopeValue1211 > 1 ? `[图片×${scopeValue1211}] ${scopeValue1207.text || ""}`.trim() : scopeValue1207.text || "[图片]";
      } else if (scopeValue1207.type === "voice_message") {
        scopeValue1208 = `[语音] ${scopeValue1207.transcript || scopeValue1207.text || ""}`.trim();
      } else if (scopeValue1207.type === "sticker") {
        scopeValue1208 = `[表情] ${scopeValue1207.stickerName || scopeValue1207.text || ""}`.trim();
      } else if (scopeValue1207.type === "moment_forward") {
        scopeValue1208 = "[朋友圈]";
      } else if (scopeValue1207.type === "pay_transfer") {
        scopeValue1208 = `[转账] ${scopeValue1207.description || ""}`.trim();
      } else if (scopeValue1207.type === "gift") {
        scopeValue1208 = `[Gift] ${scopeValue1207.giftName || scopeValue1207.text || ""}`.trim();
      } else if (scopeValue1207.type === "group_red_packet") {
        scopeValue1208 = `[群红包] ${scopeValue1207.description || ""}`.trim();
      } else if (scopeValue1207.type === "group_announcement") {
        scopeValue1208 = `[群公告] ${scopeValue1207.payload?.announcement?.content || scopeValue1207.text || ""}`;
      } else if (scopeValue1207.type === "group_poll") {
        scopeValue1208 = `[群投票] ${scopeValue1207.pollQuestion || ""}`.trim();
      } else if (scopeValue1207.type === "system_notice") {
        if (scopeValue1207.noticeKind === "group_left") {
          scopeValue1208 = "你已退出群聊";
        } else if (scopeValue1207.noticeKind === "group_rejoined") {
          scopeValue1208 = "你重新进入群聊";
        } else if (scopeValue1207.noticeKind === "narration") {
          scopeValue1208 = `[旁白] ${scopeValue1207.content || scopeValue1207.text || ""}`.trim();
        } else {
          scopeValue1208 = scopeValue1207.content || scopeValue1207.text || "";
        }
      } else {
        scopeValue1208 = scopeValue1207.content || scopeValue1207.text || "";
      }
    }
    return {
      lastMessagePreview: scopeValue1208 || "",
      lastMessageTimestamp: Number(scopeValue1207?.timestamp) || 0,
      messageCount: scopeValue1205.length
    };
  }
  function scopeValue187(scopeValue1212, scopeValue1213 = null) {
    if (!scopeValue1212 || scopeValue1212.messagesLoaded !== false) {
      return scopeValue186(scopeValue1212 ? scopeValue1212.messages : []);
    }
    const scopeValue1214 = typeof scopeValue1212.lastMessagePreview === "string" ? scopeValue1212.lastMessagePreview : typeof scopeValue1213?.lastMessagePreview === "string" ? scopeValue1213.lastMessagePreview : "";
    const scopeValue1215 = scopeValue1212.lastMessageTimestamp != null ? scopeValue1212.lastMessageTimestamp : scopeValue1213?.lastMessageTimestamp;
    const scopeValue1216 = scopeValue1212.messageCount != null ? scopeValue1212.messageCount : scopeValue1213?.messageCount;
    return {
      lastMessagePreview: scopeValue1214,
      lastMessageTimestamp: Number(scopeValue1215) || 0,
      messageCount: Number(scopeValue1216) || 0
    };
  }
  function scopeValue188(scopeValue1217, scopeValue1218 = {}) {
    return {
      friendId: String(scopeValue1217),
      lastMessagePreview: typeof scopeValue1218.lastMessagePreview === "string" ? scopeValue1218.lastMessagePreview : "",
      lastMessageTimestamp: Math.max(0, Number(scopeValue1218.lastMessageTimestamp) || 0),
      messageCount: Math.max(0, Number(scopeValue1218.messageCount) || 0),
      unreadCount: Math.max(0, Number(scopeValue1218.unreadCount) || 0),
      updatedAt: Date.now()
    };
  }
  async function scopeValue189(scopeValue1219, scopeValue1220 = {}) {
    const scopeValue1221 = scopeValue188(scopeValue1219, scopeValue1220);
    await scopeValue85(scopeValue9.imChatSummaries, scopeValue1221);
    return scopeValue1221;
  }
  function scopeValue190(scopeValue1222) {
    if (!scopeValue1222?.lovesData || !Object.prototype.hasOwnProperty.call(scopeValue1222.lovesData, "diaries")) return scopeValue1222;
    const scopeValue1223 = {
      ...scopeValue1222.lovesData
    };
    delete scopeValue1223.diaries;
    return {
      ...scopeValue1222,
      lovesData: scopeValue1223
    };
  }
  async function scopeValue191(scopeValue1224, scopeValue1225 = {}) {
    if (!scopeValue1224 || scopeValue1224.id == null) return false;
    const scopeValue1226 = Object.prototype.hasOwnProperty.call(scopeValue1225, "previousMeta") ? scopeValue1225.previousMeta : await scopeValue183(scopeValue1224.id);
    const scopeValue1227 = scopeValue190(scopeValue1224);
    const scopeValue1228 = await scopeValue179(scopeValue1227);
    const scopeValue1229 = {
      ...scopeValue1228
    };
    const scopeValue1230 = await scopeValue187(scopeValue1228, scopeValue1226);
    delete scopeValue1229.messages;
    scopeValue1229.id = String(scopeValue1229.id);
    scopeValue1229.updatedAt = Date.now();
    const scopeValue1231 = scopeValue188(scopeValue1229.id, {
      ...scopeValue1230,
      unreadCount: scopeValue1228.unreadCount
    });
    delete scopeValue1229.lastMessagePreview;
    delete scopeValue1229.lastMessageTimestamp;
    delete scopeValue1229.messageCount;
    delete scopeValue1229.unreadCount;
    await scopeValue83([scopeValue9.imFriends, scopeValue9.imChatSummaries], "readwrite", scopeValue1232 => {
      scopeValue1232[scopeValue9.imFriends].put(scopeValue49(scopeValue1229));
      scopeValue1232[scopeValue9.imChatSummaries].put(scopeValue1231);
    });
    return true;
  }
  async function scopeValue192(scopeValue1233, scopeValue1234, scopeValue1235 = 0) {
    const scopeValue1236 = String(scopeValue1233);
    const scopeValue1237 = await scopeValue175(scopeValue1236, scopeValue1234, scopeValue1235);
    const scopeValue1238 = scopeValue171(scopeValue1236, {
      ...scopeValue1237,
      __messageOrder: scopeValue167(scopeValue1234, scopeValue1235)
    }, scopeValue1235);
    const scopeValue1239 = await scopeValue84(scopeValue9.imMessages, scopeValue1238.id);
    try {
      await scopeValue85(scopeValue9.imMessages, scopeValue1238);
    } catch (scopeValue1240) {
      await scopeValue162([scopeValue1238]).catch(() => undefined);
      throw scopeValue1240;
    }
    if (scopeValue1239) {
      try {
        await scopeValue162([scopeValue1239]);
      } catch (scopeValue1241) {
        console.warn("[appStorage] Failed to release replaced message assets:", scopeValue1241);
      }
    }
    return scopeValue1238;
  }
  async function scopeValue193(newScope1283, scopeValue1243) {
    const newScope1285 = String(newScope1283);
    if (!scopeValue1243?.messageId) return {
      success: false,
      reason: "invalid"
    };
    return scopeValue83([scopeValue9.imFriends, scopeValue9.imMessages, scopeValue9.imChatSummaries], "readwrite", async (newScope1286, newScope1287) => {
      try {
        const newScope1288 = newScope1286[scopeValue9.imFriends],
          newScope1289 = newScope1286[scopeValue9.imMessages],
          newScope1290 = newScope1286[scopeValue9.imChatSummaries];
        const newScope1291 = await scopeValue77(newScope1288.get(newScope1285));
        if (!newScope1291 || newScope1291.type !== "group") return {
          success: false,
          reason: "not_group"
        };
        const newScope1292 = String(scopeValue1243.actorMemberId || "");
        const newScope1293 = scopeValue1243.actorRole === "assistant" && newScope1292 ? await scopeValue77(newScope1288.get(newScope1292)) : null;
        const newScope1294 = scopeValue1243.actorRole === "user" ? !(Number(newScope1291.leftGroupAt) > 0 || newScope1291.groupObserverMode === true) : scopeValue1243.actorRole === "assistant" && newScope1292 && (newScope1291.members || []).some(newScope1305 => String(newScope1305) === newScope1292) && (newScope1291.adminMemberIds || []).some(newScope1306 => String(newScope1306) === newScope1292) && ["char", "npc"].includes(newScope1293?.type) && [newScope1293?.nickname, newScope1293?.realName].some(newScope1307 => newScope1307 && newScope1307 === scopeValue1243.actorName);
        if (!newScope1294) return {
          success: false,
          reason: "forbidden"
        };
        const newScope1295 = typeof scopeValue1243.content === "string" ? scopeValue1243.content.trim() : "";
        if (!newScope1295) return {
          success: false,
          reason: "empty"
        };
        const newScope1296 = newScope1291.groupAnnouncement || null;
        if (newScope1296?.content === newScope1295) return {
          success: true,
          unchanged: true,
          announcement: newScope1296
        };
        const newScope1297 = await scopeValue77(newScope1290.get(newScope1285));
        if (scopeValue1243.isCurrent && !scopeValue1243.isCurrent()) return {
          success: false,
          reason: "cancelled"
        };
        const newScope1298 = Date.now();
        const newScope1299 = {
          role: scopeValue1243.actorRole,
          memberId: scopeValue1243.actorRole === "user" ? "__user__" : newScope1292,
          name: String(scopeValue1243.actorName || "群成员")
        };
        const newScope1300 = {
          id: String(scopeValue1243.messageId),
          content: newScope1295,
          publishedAt: newScope1296?.publishedAt || newScope1298,
          publishedBy: newScope1296?.publishedBy || newScope1299,
          updatedAt: newScope1296 ? newScope1298 : 0,
          updatedBy: newScope1296 ? newScope1299 : null,
          apiRunId: String(scopeValue1243.apiRunId || "")
        };
        const newScope1301 = {
          id: String(scopeValue1243.messageId),
          type: "group_announcement",
          role: scopeValue1243.actorRole,
          speaker: newScope1299.name,
          speakerMemberId: newScope1299.memberId,
          text: newScope1295,
          content: newScope1295,
          timestamp: newScope1298,
          ...(scopeValue1243.actorRole === "user" && scopeValue1243.userIdentity ? {
            userIdentity: scopeValue49(scopeValue1243.userIdentity)
          } : {}),
          apiRunId: newScope1300.apiRunId,
          payload: {
            action: newScope1296 ? "modified" : "published",
            announcement: newScope1300,
            previousAnnouncement: newScope1296
          }
        };
        const newScope1302 = Math.max(0, Number(newScope1297?.messageCount) || Number(newScope1291.messageCount) || 0);
        const newScope1303 = scopeValue171(newScope1285, newScope1301, newScope1302);
        const newScope1304 = scopeValue188(newScope1285, {
          ...newScope1297,
          messageCount: newScope1302 + 1,
          lastMessagePreview: `[群公告] ${newScope1295}`,
          lastMessageTimestamp: newScope1298,
          unreadCount: Math.max(0, Number(newScope1297?.unreadCount) || 0) + (scopeValue1243.incomingUnread ? 1 : 0)
        });
        newScope1288.put({
          ...newScope1291,
          groupAnnouncement: scopeValue49(newScope1300),
          updatedAt: newScope1298
        });
        newScope1289.put(newScope1303);
        newScope1290.put(newScope1304);
        return {
          success: true,
          announcement: newScope1300,
          message: {
            ...newScope1301,
            __messageOrder: newScope1302
          },
          summary: newScope1304
        };
      } catch (newScope1308) {
        newScope1287.abort();
        throw newScope1308;
      }
    });
  }
  async function newScope201(scopeValue1242, newScope1310, scopeValue1244 = 0) {
    if (!scopeValue1242 || scopeValue1242.id == null) throw new Error("Friend is required for atomic message commit.");
    const scopeValue1245 = String(scopeValue1242.id);
    const scopeValue1246 = await scopeValue175(scopeValue1245, newScope1310, scopeValue1244);
    const scopeValue1247 = scopeValue171(scopeValue1245, {
      ...scopeValue1246,
      __messageOrder: scopeValue167(newScope1310, scopeValue1244)
    }, scopeValue1244);
    const scopeValue1248 = await scopeValue187(scopeValue1242);
    const scopeValue1249 = scopeValue188(scopeValue1245, {
      ...scopeValue1248,
      unreadCount: scopeValue1242.unreadCount
    });
    let scopeValue1250 = null;
    try {
      await scopeValue113(() => scopeValue83([scopeValue9.imMessages, scopeValue9.imChatSummaries], "readwrite", async scopeValue1251 => {
        scopeValue1250 = await scopeValue77(scopeValue1251[scopeValue9.imMessages].get(scopeValue1247.id));
        scopeValue1251[scopeValue9.imMessages].put(scopeValue1247);
        scopeValue1251[scopeValue9.imChatSummaries].put(scopeValue1249);
      }));
    } catch (scopeValue1252) {
      await scopeValue162([scopeValue1247]).catch(() => undefined);
      throw scopeValue1252;
    }
    if (scopeValue1250) {
      try {
        await scopeValue162([scopeValue1250]);
      } catch (scopeValue1253) {
        console.warn("[appStorage] Failed to release replaced message assets:", scopeValue1253);
      }
    }
    scopeValue30.lastCommitAt = Date.now();
    scopeValue30.lastError = null;
    scopeValue95({
      ...scopeValue30,
      reason: "imessage-message-commit",
      friendId: scopeValue1245
    });
    return scopeValue1247;
  }
  async function newScope202(newScope1321, newScope1322, newScope1323 = Date.now()) {
    const newScope1324 = String(newScope1321),
      newScope1325 = `away-return:${newScope1324}:${String(newScope1322)}`;
    return scopeValue83([scopeValue9.imFriends, scopeValue9.imMessages, scopeValue9.meta], "readwrite", async newScope1326 => {
      const newScope1327 = newScope1326[scopeValue9.imFriends],
        newScope1328 = newScope1326[scopeValue9.imMessages],
        newScope1329 = newScope1326[scopeValue9.meta];
      const [newScope1330, newScope1331] = await Promise.all([scopeValue77(newScope1327.get(newScope1324)), scopeValue77(newScope1329.get(newScope1325))]);
      const newScope1332 = newScope1330?.awayActivity;
      if (!newScope1332 || newScope1332.id !== String(newScope1322)) return false;
      if (newScope1331) {
        const newScope1337 = {
          ...newScope1332,
          deliveryStatus: newScope1331.status,
          attemptedAt: newScope1331.attemptedAt
        };
        newScope1327.put({
          ...newScope1330,
          awayActivity: newScope1337
        });
        return {
          alreadyClaimed: true,
          activity: newScope1337
        };
      }
      if (newScope1330.type !== "char" || newScope1330.awayReturnEnabled !== true || newScope1332.status !== "active" || newScope1332.deliveryStatus !== "pending" || !Number.isFinite(newScope1332.returnAt) || newScope1332.returnAt > newScope1323 || newScope1330.blockState?.charBlocksUser || newScope1330.blockState?.userBlocksChar) return false;
      const newScope1333 = newScope1332.noticeId ? await scopeValue77(newScope1328.get(newScope1332.noticeId)) : null;
      if (!newScope1333 || String(newScope1333.friendId) !== newScope1324 || newScope1333.noticeKind !== "away_activity") return false;
      const newScope1334 = Array.isArray(newScope1332.sourceMessageIds) ? newScope1332.sourceMessageIds : [];
      if (!newScope1334.length) return false;
      const newScope1335 = await Promise.all(newScope1334.map(newScope1338 => scopeValue77(newScope1328.get(newScope1338))));
      if (newScope1335.some(newScope1339 => !newScope1339 || String(newScope1339.friendId) !== newScope1324 || newScope1339.role !== "assistant" || newScope1339.deliveryStatus === "blocked")) return false;
      const newScope1336 = {
        ...newScope1332,
        deliveryStatus: "sending",
        attemptedAt: newScope1323
      };
      newScope1329.put({
        key: newScope1325,
        friendId: newScope1324,
        activityId: newScope1332.id,
        status: "sending",
        attemptedAt: newScope1323
      });
      newScope1327.put({
        ...newScope1330,
        awayActivity: newScope1336
      });
      return {
        alreadyClaimed: false,
        activity: newScope1336
      };
    });
  }
  async function newScope203(newScope1340, newScope1341, newScope1342, newScope1343 = Date.now()) {
    const newScope1344 = String(newScope1340),
      newScope1345 = `away-return:${newScope1344}:${String(newScope1341)}`;
    if (!["sent", "failed"].includes(newScope1342)) return false;
    return scopeValue83([scopeValue9.imFriends, scopeValue9.meta], "readwrite", async newScope1346 => {
      const newScope1347 = newScope1346[scopeValue9.meta],
        newScope1348 = newScope1346[scopeValue9.imFriends];
      const [newScope1349, newScope1350] = await Promise.all([scopeValue77(newScope1347.get(newScope1345)), scopeValue77(newScope1348.get(newScope1344))]);
      if (!newScope1349) return false;
      newScope1347.put({
        ...newScope1349,
        status: newScope1342,
        finishedAt: newScope1343
      });
      if (newScope1350?.awayActivity?.id !== String(newScope1341)) return false;
      const newScope1351 = {
        ...newScope1350.awayActivity,
        deliveryStatus: newScope1342,
        status: newScope1350.awayActivity.status === "cancelled" ? "cancelled" : "finished",
        finishedAt: newScope1343
      };
      newScope1348.put({
        ...newScope1350,
        awayActivity: newScope1351
      });
      return newScope1351;
    });
  }
  async function newScope204(newScope1352, newScope1353) {
    const newScope1354 = String(newScope1352),
      newScope1355 = `away-return:${newScope1354}:${String(newScope1353)}`;
    return scopeValue83([scopeValue9.imFriends, scopeValue9.meta], "readonly", async newScope1356 => {
      const [newScope1357, newScope1358] = await Promise.all([scopeValue77(newScope1356[scopeValue9.imFriends].get(newScope1354)), scopeValue77(newScope1356[scopeValue9.meta].get(newScope1355))]);
      if (newScope1357?.awayActivity?.id !== String(newScope1353)) return null;
      return newScope1358 ? {
        ...newScope1357.awayActivity,
        deliveryStatus: newScope1358.status,
        attemptedAt: newScope1358.attemptedAt
      } : newScope1357.awayActivity;
    });
  }
  async function scopeValue194(scopeValue1254, scopeValue1255, scopeValue1256, scopeValue1257) {
    const scopeValue1258 = String(scopeValue1254 || "");
    const scopeValue1259 = String(scopeValue1255?.id || "");
    const scopeValue1260 = scopeValue1257 === "confirm" ? "confirmed" : scopeValue1257 === "cancel" ? "cancelled" : "";
    if (!scopeValue1258 || !scopeValue1259 || !scopeValue1260 || scopeValue1255?.type !== "memory_request") return false;
    const scopeValue1261 = Date.now();
    const scopeValue1262 = scopeValue1260 === "confirmed" ? scopeValue49(scopeValue47(scopeValue1256)) : null;
    const scopeValue1263 = scopeValue1255.memoryPayload && typeof scopeValue1255.memoryPayload === "object" ? scopeValue49(scopeValue47(scopeValue1255.memoryPayload)) : null;
    const scopeValue1264 = scopeValue1260 === "confirmed" ? [scopeValue9.imFriends, scopeValue9.imMessages] : [scopeValue9.imMessages];
    const scopeValue1265 = await scopeValue113(() => scopeValue83(scopeValue1264, "readwrite", async scopeValue1266 => {
      const [scopeValue1267, scopeValue1268] = await Promise.all([scopeValue1260 === "confirmed" ? scopeValue77(scopeValue1266[scopeValue9.imFriends].get(scopeValue1258)) : Promise.resolve(null), scopeValue77(scopeValue1266[scopeValue9.imMessages].get(scopeValue1259))]);
      if (scopeValue1260 === "confirmed" && !scopeValue1267 || !scopeValue1268 || String(scopeValue1268.friendId) !== scopeValue1258 || scopeValue1268.type !== "memory_request" || scopeValue1268.requestStatus && scopeValue1268.requestStatus !== "pending") return false;
      if (scopeValue1267) scopeValue1266[scopeValue9.imFriends].put({
        ...scopeValue1267,
        memory: scopeValue1262,
        updatedAt: scopeValue1261
      });
      scopeValue1266[scopeValue9.imMessages].put({
        ...scopeValue1268,
        memoryRequestId: String(scopeValue1255.memoryRequestId || scopeValue1259),
        memoryPayload: scopeValue1263,
        requestStatus: scopeValue1260,
        decidedAt: scopeValue1261
      });
      return true;
    }));
    if (scopeValue1265) {
      scopeValue30.lastCommitAt = scopeValue1261;
      scopeValue30.lastError = null;
      scopeValue95({
        ...scopeValue30,
        reason: "imessage-memory-request-decision",
        friendId: scopeValue1258
      });
    }
    return scopeValue1265 ? {
      status: scopeValue1260,
      decidedAt: scopeValue1261
    } : false;
  }
  async function scopeValue195(scopeValue1269) {
    return scopeValue196([scopeValue1269]);
  }
  async function scopeValue196(scopeValue1270) {
    const scopeValue1271 = Array.isArray(scopeValue1270) ? scopeValue1270.map(scopeValue1273 => String(scopeValue1273)).filter(Boolean) : [];
    if (scopeValue1271.length === 0) return true;
    const scopeValue1272 = await scopeValue83([scopeValue9.imMessages], "readwrite", async scopeValue1274 => {
      const scopeValue1275 = await Promise.all(scopeValue1271.map(scopeValue1276 => scopeValue77(scopeValue1274[scopeValue9.imMessages].get(scopeValue1276))));
      scopeValue1271.forEach(scopeValue1277 => scopeValue1274[scopeValue9.imMessages].delete(scopeValue1277));
      return scopeValue1275.filter(Boolean);
    });
    try {
      await scopeValue162(scopeValue1272);
    } catch (scopeValue1278) {
      console.warn("[appStorage] Failed to release deleted message assets:", scopeValue1278);
    }
    return true;
  }
  async function scopeValue197(scopeValue1279, scopeValue1280) {
    const scopeValue1281 = String(scopeValue1279);
    const scopeValue1282 = Array.isArray(scopeValue1280) ? scopeValue1280 : [];
    const scopeValue1283 = await Promise.all(scopeValue1282.map((scopeValue1287, scopeValue1288) => scopeValue175(scopeValue1281, scopeValue1287, scopeValue1288)));
    const scopeValue1284 = scopeValue1283.map((scopeValue1289, scopeValue1290) => scopeValue171(scopeValue1281, scopeValue1289, scopeValue1290));
    const scopeValue1285 = new Set(scopeValue1284.map(scopeValue1291 => String(scopeValue1291.id)));
    const scopeValue1286 = await scopeValue83([scopeValue9.imMessages, scopeValue9.imChatSummaries], "readwrite", async scopeValue1292 => {
      const scopeValue1293 = scopeValue1292[scopeValue9.imMessages].index("friendId");
      const scopeValue1294 = IDBKeyRange.only(scopeValue1281);
      const scopeValue1295 = await scopeValue77(scopeValue1293.getAll(scopeValue1294));
      const scopeValue1296 = await scopeValue77(scopeValue1292[scopeValue9.imChatSummaries].get(scopeValue1281));
      (Array.isArray(scopeValue1295) ? scopeValue1295 : []).forEach(scopeValue1298 => {
        if (!scopeValue1285.has(String(scopeValue1298?.id))) {
          scopeValue1292[scopeValue9.imMessages].delete(scopeValue1298.id);
        }
      });
      scopeValue1284.forEach(scopeValue1299 => scopeValue1292[scopeValue9.imMessages].put(scopeValue1299));
      const scopeValue1297 = await scopeValue186(scopeValue1284);
      scopeValue1292[scopeValue9.imChatSummaries].put(scopeValue188(scopeValue1281, {
        ...scopeValue1297,
        unreadCount: scopeValue1296?.unreadCount
      }));
      return Array.isArray(scopeValue1295) ? scopeValue1295 : [];
    });
    try {
      await scopeValue162(scopeValue1286);
    } catch (scopeValue1300) {
      console.warn("[appStorage] Failed to release replaced chat assets:", scopeValue1300);
    }
    return true;
  }
  async function scopeValue198(scopeValue1301, scopeValue1302) {
    return scopeValue197(scopeValue1301, scopeValue1302);
  }
  async function scopeValue199(scopeValue1303, scopeValue1304 = {}) {
    if (!scopeValue1303 || scopeValue1303.id == null) return false;
    const scopeValue1305 = await scopeValue183(scopeValue1303.id);
    const scopeValue1306 = new Set(scopeValue182(scopeValue1303));
    const scopeValue1307 = scopeValue1304.skipMessages !== true && scopeValue1303.messagesLoaded !== false;
    await scopeValue191(scopeValue1303, {
      previousMeta: scopeValue1305
    });
    if (scopeValue1307) {
      await scopeValue197(scopeValue1303.id, scopeValue1303.messages || []);
    }
    await scopeValue185(scopeValue1305, scopeValue1303, scopeValue1306);
    return true;
  }
  async function scopeValue200(scopeValue1308) {
    return scopeValue199(scopeValue1308, {
      skipMessages: true
    });
  }
  async function scopeValue201(scopeValue1309, scopeValue1310 = {}) {
    if (scopeValue1309 == null) return false;
    const scopeValue1311 = String(scopeValue1309);
    const scopeValue1312 = scopeValue1310 && typeof scopeValue1310 === "object" ? scopeValue47(scopeValue1310) : {};
    delete scopeValue1312.id;
    delete scopeValue1312.messages;
    if (scopeValue1312.lovesData && typeof scopeValue1312.lovesData === "object") {
      scopeValue1312.lovesData = scopeValue190({
        lovesData: scopeValue1312.lovesData
      }).lovesData;
    }
    const scopeValue1313 = {};
    ["lastMessagePreview", "lastMessageTimestamp", "messageCount", "unreadCount"].forEach(scopeValue1317 => {
      if (Object.prototype.hasOwnProperty.call(scopeValue1312, scopeValue1317)) scopeValue1313[scopeValue1317] = scopeValue1312[scopeValue1317];
      delete scopeValue1312[scopeValue1317];
    });
    const scopeValue1314 = Date.now();
    const scopeValue1315 = [];
    let scopeValue1316 = [];
    for (const [scopeValue1318, scopeValue1319] of scopeValue178) {
      if (!scopeValue63(scopeValue1312[scopeValue1318])) continue;
      const scopeValue1320 = await scopeValue75(scopeValue1312[scopeValue1318], {
        fallbackId: scopeValue1312[scopeValue1319] || scopeValue177("friend", scopeValue1311, scopeValue1318),
        ownerType: "im_friend",
        ownerId: scopeValue1311,
        field: scopeValue1318
      });
      scopeValue1312[scopeValue1319] = scopeValue1320;
      scopeValue1312[scopeValue1318] = null;
      scopeValue1315.push(scopeValue1320);
    }
    await scopeValue83([scopeValue9.imFriends, scopeValue9.imChatSummaries, scopeValue9.assets], "readwrite", async scopeValue1321 => {
      const scopeValue1322 = await scopeValue77(scopeValue1321[scopeValue9.imFriends].get(scopeValue1311));
      if (!scopeValue1322) throw new Error(`Friend ${scopeValue1311} does not exist.`);
      const scopeValue1323 = Object.keys(scopeValue1313).length > 0 ? await scopeValue77(scopeValue1321[scopeValue9.imChatSummaries].get(scopeValue1311)) : null;
      const scopeValue1324 = {
        ...scopeValue1322,
        ...scopeValue1312,
        id: scopeValue1311
      };
      if (Object.prototype.hasOwnProperty.call(scopeValue1312, "galleryAlbumImages")) {
        const scopeValue1326 = scopeValue156(scopeValue1322.galleryAlbumImages || []);
        const scopeValue1327 = scopeValue156(scopeValue1312.galleryAlbumImages || []);
        scopeValue1316 = Array.from(scopeValue1326).filter(scopeValue1328 => !scopeValue1327.has(scopeValue1328));
      }
      for (const [scopeValue1329, scopeValue1330] of scopeValue178) {
        if (!Object.prototype.hasOwnProperty.call(scopeValue1312, scopeValue1329)) continue;
        const scopeValue1331 = scopeValue1312[scopeValue1329];
        if (scopeValue63(scopeValue1331)) {
          const scopeValue1332 = String(scopeValue1312[scopeValue1330] || scopeValue1322[scopeValue1330] || scopeValue177("friend", scopeValue1311, scopeValue1329));
          const scopeValue1333 = scopeValue73(scopeValue1331);
          scopeValue1321[scopeValue9.assets].put({
            id: scopeValue1332,
            blob: scopeValue1333,
            mimeType: scopeValue1333.type || "application/octet-stream",
            ownerType: "im_friend",
            ownerId: scopeValue1311,
            field: scopeValue1329,
            updatedAt: scopeValue1314
          });
          scopeValue1324[scopeValue1330] = scopeValue1332;
          scopeValue1324[scopeValue1329] = null;
          scopeValue1315.push(scopeValue1332);
        } else if (!scopeValue1331 && scopeValue1312[scopeValue1330]) {
          scopeValue1324[scopeValue1329] = null;
          scopeValue1324[scopeValue1330] = scopeValue1312[scopeValue1330];
        } else if (!scopeValue1331) {
          scopeValue1324[scopeValue1329] = null;
          scopeValue1324[scopeValue1330] = null;
        } else if (scopeValue64(scopeValue1331) && scopeValue1322[scopeValue1330]) {
          scopeValue1324[scopeValue1329] = null;
          scopeValue1324[scopeValue1330] = scopeValue1322[scopeValue1330];
        }
      }
      for (const [scopeValue1334, scopeValue1335] of scopeValue178) {
        if (!Object.prototype.hasOwnProperty.call(scopeValue1312, scopeValue1334) && !Object.prototype.hasOwnProperty.call(scopeValue1312, scopeValue1335)) continue;
        const scopeValue1336 = String(scopeValue1322[scopeValue1335] || "");
        const scopeValue1337 = String(scopeValue1324[scopeValue1335] || "");
        if (scopeValue1336 && scopeValue1336 !== scopeValue1337) scopeValue1316.push(scopeValue1336);
      }
      scopeValue1324.updatedAt = scopeValue1314;
      scopeValue1324.revision = Math.max(0, Number(scopeValue1322.revision) || 0) + 1;
      const scopeValue1325 = Object.fromEntries(Object.keys(scopeValue1312).map(scopeValue1338 => [scopeValue1338, scopeValue1324[scopeValue1338]]));
      for (const [scopeValue1339, scopeValue1340] of scopeValue178) {
        if (Object.prototype.hasOwnProperty.call(scopeValue1312, scopeValue1339)) {
          scopeValue1325[scopeValue1340] = scopeValue1324[scopeValue1340];
        }
      }
      Object.keys(scopeValue1325).forEach(scopeValue1341 => {
        delete scopeValue1324[scopeValue1341];
      });
      Object.assign(scopeValue1324, scopeValue49(scopeValue1325));
      scopeValue1321[scopeValue9.imFriends].put(scopeValue1324);
      if (Object.keys(scopeValue1313).length > 0) {
        scopeValue1321[scopeValue9.imChatSummaries].put(scopeValue188(scopeValue1311, {
          ...(scopeValue1323 || {}),
          ...scopeValue1313
        }));
      }
    });
    scopeValue1315.forEach(scopeValue1342 => scopeValue59(scopeValue1342));
    if (scopeValue1316.length > 0) await scopeValue161(Array.from(new Set(scopeValue1316)));
    scopeValue30.lastCommitAt = scopeValue1314;
    scopeValue30.lastError = null;
    scopeValue95({
      ...scopeValue30,
      reason: "imessage-friend-patch",
      friendId: scopeValue1311
    });
    return true;
  }
  async function scopeValue202(scopeValue1343) {
    if (scopeValue1343 == null) return false;
    const scopeValue1344 = await scopeValue183(scopeValue1343);
    await scopeValue197(scopeValue1343, []);
    await scopeValue83([scopeValue9.imFriends, scopeValue9.imChatSummaries], "readwrite", scopeValue1345 => {
      scopeValue1345[scopeValue9.imFriends].delete(String(scopeValue1343));
      scopeValue1345[scopeValue9.imChatSummaries].delete(String(scopeValue1343));
    });
    await scopeValue185(scopeValue1344, null);
    return true;
  }
  async function scopeValue203(scopeValue1346) {
    const scopeValue1347 = String(scopeValue1346);
    return scopeValue83([scopeValue9.imMessages], "readonly", async scopeValue1348 => {
      const scopeValue1349 = scopeValue1348[scopeValue9.imMessages];
      if (scopeValue72(scopeValue1349, "friendId_order")) {
        const scopeValue1354 = scopeValue1349.index("friendId_order");
        const scopeValue1355 = IDBKeyRange.bound([scopeValue1347, Number.MIN_SAFE_INTEGER], [scopeValue1347, Number.MAX_SAFE_INTEGER]);
        const scopeValue1356 = await scopeValue77(scopeValue1354.getAll(scopeValue1355));
        return Promise.all(scopeValue1356.map(scopeValue1357 => scopeValue176(scopeValue173(scopeValue1357))));
      }
      const scopeValue1350 = scopeValue1349.index("friendId_timestamp");
      const scopeValue1351 = IDBKeyRange.bound([scopeValue1347, 0], [scopeValue1347, Number.MAX_SAFE_INTEGER]);
      const scopeValue1352 = await scopeValue77(scopeValue1350.getAll(scopeValue1351));
      const scopeValue1353 = scopeValue1352.sort((scopeValue1358, scopeValue1359) => {
        if ((scopeValue1358.timestamp || 0) !== (scopeValue1359.timestamp || 0)) return (scopeValue1358.timestamp || 0) - (scopeValue1359.timestamp || 0);
        return (scopeValue1358.order || 0) - (scopeValue1359.order || 0);
      }).map(scopeValue173);
      return Promise.all(scopeValue1353.map(scopeValue1360 => scopeValue176(scopeValue1360)));
    });
  }
  async function scopeValue204(scopeValue1361, scopeValue1362 = {}) {
    const scopeValue1363 = String(scopeValue1361);
    const scopeValue1364 = Number.isFinite(Number(scopeValue1362.afterOrder)) ? Number(scopeValue1362.afterOrder) : null;
    return scopeValue83([scopeValue9.imMessages], "readonly", async scopeValue1365 => {
      const scopeValue1366 = scopeValue1365[scopeValue9.imMessages];
      let scopeValue1367 = [];
      let scopeValue1368 = 0;
      if (scopeValue72(scopeValue1366, "friendId_order")) {
        const scopeValue1369 = scopeValue1366.index("friendId_order");
        const scopeValue1370 = IDBKeyRange.bound([scopeValue1363, Number.MIN_SAFE_INTEGER], [scopeValue1363, Number.MAX_SAFE_INTEGER]);
        scopeValue1368 = await scopeValue77(scopeValue1369.count(scopeValue1370));
        const scopeValue1371 = scopeValue1364 == null ? scopeValue1370 : IDBKeyRange.bound([scopeValue1363, scopeValue1364], [scopeValue1363, Number.MAX_SAFE_INTEGER], true, false);
        scopeValue1367 = await scopeValue77(scopeValue1369.getAll(scopeValue1371));
      } else {
        const scopeValue1372 = scopeValue1366.index("friendId_timestamp");
        const scopeValue1373 = IDBKeyRange.bound([scopeValue1363, 0], [scopeValue1363, Number.MAX_SAFE_INTEGER]);
        const scopeValue1374 = await scopeValue77(scopeValue1372.getAll(scopeValue1373));
        scopeValue1368 = scopeValue1374.length;
        scopeValue1367 = scopeValue1374.filter(scopeValue1375 => scopeValue1364 == null || Number(scopeValue1375.order) > scopeValue1364).sort((scopeValue1376, scopeValue1377) => {
          const scopeValue1378 = Number(scopeValue1376.order);
          const scopeValue1379 = Number(scopeValue1377.order);
          if (Number.isFinite(scopeValue1378) && Number.isFinite(scopeValue1379) && scopeValue1378 !== scopeValue1379) {
            return scopeValue1378 - scopeValue1379;
          }
          if ((scopeValue1376.timestamp || 0) !== (scopeValue1377.timestamp || 0)) {
            return (scopeValue1376.timestamp || 0) - (scopeValue1377.timestamp || 0);
          }
          return 0;
        });
      }
      return {
        messages: scopeValue1367.map(scopeValue173),
        totalCount: scopeValue1368
      };
    });
  }
  async function scopeValue205() {
    return scopeValue83([scopeValue9.imMessages], "readonly", async scopeValue1380 => {
      const scopeValue1381 = await scopeValue77(scopeValue1380[scopeValue9.imMessages].getAll());
      const scopeValue1382 = scopeValue1381.filter(scopeValue1384 => scopeValue1384 && scopeValue1384.type === "image" && (String(scopeValue1384.content || "").trim() || String(scopeValue1384.contentAssetId || "").trim() || scopeValue1384.albumImages?.some(scopeValue1385 => scopeValue1385?.url || scopeValue1385?.assetId)));
      const scopeValue1383 = await Promise.all(scopeValue1382.map(async scopeValue1386 => {
        const scopeValue1387 = await scopeValue176(scopeValue173(scopeValue1386));
        scopeValue1387.albumImages = await Promise.all(scopeValue1387.albumImages.map(async scopeValue1388 => {
          if (scopeValue1388.url || !scopeValue1388.assetId) return scopeValue1388;
          try {
            return {
              ...scopeValue1388,
              url: await scopeValue143(scopeValue1388.assetId)
            };
          } catch {
            return scopeValue1388;
          }
        }));
        return {
          ...scopeValue1387,
          friendId: String(scopeValue1386.friendId || "")
        };
      }));
      return scopeValue1383.filter(scopeValue1389 => String(scopeValue1389.content || "").trim() || scopeValue1389.albumImages.some(scopeValue1390 => scopeValue1390.url)).sort((scopeValue1391, scopeValue1392) => {
        const scopeValue1393 = (Number(scopeValue1392.timestamp) || 0) - (Number(scopeValue1391.timestamp) || 0);
        if (scopeValue1393) return scopeValue1393;
        return (Number(scopeValue1392.__messageOrder) || 0) - (Number(scopeValue1391.__messageOrder) || 0);
      });
    });
  }
  async function scopeValue206(scopeValue1394, scopeValue1395 = {}) {
    const scopeValue1396 = String(scopeValue1394);
    const scopeValue1397 = Math.min(200, Math.max(1, Math.round(Number(scopeValue1395.limit) || 90)));
    const scopeValue1398 = Number.isFinite(Number(scopeValue1395.beforeOrder)) ? Number(scopeValue1395.beforeOrder) : null;
    return scopeValue83([scopeValue9.imMessages], "readonly", async scopeValue1399 => {
      const scopeValue1400 = scopeValue1399[scopeValue9.imMessages];
      let scopeValue1401 = [];
      let scopeValue1402 = 0;
      if (scopeValue72(scopeValue1400, "friendId_order")) {
        const scopeValue1407 = scopeValue1400.index("friendId_order");
        const scopeValue1408 = IDBKeyRange.bound([scopeValue1396, Number.MIN_SAFE_INTEGER], [scopeValue1396, Number.MAX_SAFE_INTEGER]);
        scopeValue1402 = await scopeValue77(scopeValue1407.count(scopeValue1408));
        const scopeValue1409 = scopeValue1398 == null ? Number.MAX_SAFE_INTEGER : scopeValue1398;
        const scopeValue1410 = IDBKeyRange.bound([scopeValue1396, Number.MIN_SAFE_INTEGER], [scopeValue1396, scopeValue1409], false, scopeValue1398 != null);
        scopeValue1401 = await new Promise((scopeValue1411, scopeValue1412) => {
          const scopeValue1413 = [];
          const scopeValue1414 = scopeValue1407.openCursor(scopeValue1410, "prev");
          scopeValue1414.onerror = () => scopeValue1412(scopeValue1414.error || new Error("Failed to read recent messages"));
          scopeValue1414.onsuccess = () => {
            const scopeValue1415 = scopeValue1414.result;
            if (!scopeValue1415 || scopeValue1413.length >= scopeValue1397 + 1) {
              scopeValue1411(scopeValue1413);
              return;
            }
            scopeValue1413.push(scopeValue1415.value);
            scopeValue1415.continue();
          };
        });
      } else {
        const scopeValue1416 = scopeValue1400.index("friendId_timestamp");
        const scopeValue1417 = IDBKeyRange.bound([scopeValue1396, 0], [scopeValue1396, Number.MAX_SAFE_INTEGER]);
        const scopeValue1418 = await scopeValue77(scopeValue1416.getAll(scopeValue1417));
        scopeValue1402 = scopeValue1418.length;
        scopeValue1401 = scopeValue1418.sort((scopeValue1419, scopeValue1420) => {
          if ((scopeValue1419.timestamp || 0) !== (scopeValue1420.timestamp || 0)) return (scopeValue1420.timestamp || 0) - (scopeValue1419.timestamp || 0);
          return (scopeValue1420.order || 0) - (scopeValue1419.order || 0);
        }).filter(scopeValue1421 => scopeValue1398 == null || Number(scopeValue1421.order) < scopeValue1398).slice(0, scopeValue1397 + 1);
      }
      const scopeValue1403 = scopeValue1401.length > scopeValue1397;
      const scopeValue1404 = scopeValue1401.slice(0, scopeValue1397).reverse();
      const scopeValue1405 = await Promise.all(scopeValue1404.map(scopeValue1422 => scopeValue176(scopeValue173(scopeValue1422))));
      const scopeValue1406 = scopeValue1404.length > 0 ? Number(scopeValue1404[0].order ?? scopeValue1405[0]?.__messageOrder) : scopeValue1398;
      return {
        messages: scopeValue1405,
        totalCount: scopeValue1402,
        hasMore: scopeValue1403,
        oldestOrder: Number.isFinite(scopeValue1406) ? scopeValue1406 : null
      };
    });
  }
  async function scopeValue207(scopeValue1423) {
    const scopeValue1424 = Array.isArray(scopeValue1423) ? scopeValue1423.filter(scopeValue1429 => scopeValue1429 && scopeValue1429.id != null) : [];
    const scopeValue1425 = new Set(scopeValue1424.map(scopeValue1430 => String(scopeValue1430.id)));
    const scopeValue1426 = new Set();
    scopeValue1424.forEach(scopeValue1431 => {
      scopeValue182(scopeValue1431).forEach(scopeValue1432 => scopeValue1426.add(scopeValue1432));
    });
    const scopeValue1427 = await scopeValue87(scopeValue9.imFriends);
    const scopeValue1428 = new Map(scopeValue1427.map(scopeValue1433 => [String(scopeValue1433.id), scopeValue1433]));
    for (const scopeValue1434 of scopeValue1427) {
      const scopeValue1435 = String(scopeValue1434.id);
      if (!scopeValue1425.has(scopeValue1435)) {
        await scopeValue202(scopeValue1435);
      }
    }
    for (const scopeValue1436 of scopeValue1424) {
      const scopeValue1437 = scopeValue1428.get(String(scopeValue1436.id)) || null;
      await scopeValue191(scopeValue1436, {
        previousMeta: scopeValue1437
      });
      if (scopeValue1436.messagesLoaded !== false) {
        await scopeValue197(scopeValue1436.id, scopeValue1436.messages || []);
      }
      await scopeValue185(scopeValue1437, scopeValue1436, scopeValue1426);
    }
    return true;
  }
  async function scopeValue208() {
    const [scopeValue1438, scopeValue1439] = await Promise.all([scopeValue87(scopeValue9.imFriends), scopeValue87(scopeValue9.imChatSummaries)]);
    const scopeValue1440 = new Map(scopeValue1439.map(scopeValue1442 => [String(scopeValue1442.friendId), scopeValue1442]));
    const scopeValue1441 = await Promise.all(scopeValue1438.map(async scopeValue1443 => {
      const scopeValue1444 = scopeValue190(scopeValue1443);
      if (scopeValue1444 !== scopeValue1443) {
        await scopeValue85(scopeValue9.imFriends, scopeValue1444);
      }
      const scopeValue1445 = await scopeValue180(scopeValue1444);
      const scopeValue1446 = scopeValue1440.get(String(scopeValue1443.id)) || scopeValue1443;
      scopeValue1445.messages = [];
      scopeValue1445.messagesLoaded = false;
      scopeValue1445.lastMessagePreview = typeof scopeValue1446.lastMessagePreview === "string" ? scopeValue1446.lastMessagePreview : "";
      scopeValue1445.lastMessageTimestamp = Number(scopeValue1446.lastMessageTimestamp) || 0;
      scopeValue1445.messageCount = Number(scopeValue1446.messageCount) || 0;
      scopeValue1445.unreadCount = Math.max(0, Number(scopeValue1446.unreadCount) || 0);
      return scopeValue1445;
    }));
    scopeValue1441.sort((scopeValue1447, scopeValue1448) => {
      const scopeValue1449 = scopeValue1447.isPinned ? 1 : 0;
      const scopeValue1450 = scopeValue1448.isPinned ? 1 : 0;
      if (scopeValue1449 !== scopeValue1450) return scopeValue1450 - scopeValue1449;
      const scopeValue1451 = Number(scopeValue1447.lastMessageTimestamp) || 0;
      const scopeValue1452 = Number(scopeValue1448.lastMessageTimestamp) || 0;
      if (scopeValue1451 !== scopeValue1452) return scopeValue1452 - scopeValue1451;
      return String(scopeValue1447.id).localeCompare(String(scopeValue1448.id));
    });
    return scopeValue1441;
  }
  async function scopeValue209(scopeValue1453) {
    if (!scopeValue1453) return scopeValue1453;
    const scopeValue1454 = {
      ...scopeValue1453
    };
    if (scopeValue63(scopeValue1454.avatar)) {
      const scopeValue1455 = scopeValue1454.avatarAssetId || scopeValue177("moment_avatar", scopeValue1454.id, "avatar");
      await scopeValue140(scopeValue1455, scopeValue1454.avatar, {
        ownerType: "im_moment",
        ownerId: String(scopeValue1454.id),
        field: "avatar"
      });
      scopeValue1454.avatarAssetId = scopeValue1455;
      scopeValue1454.avatar = null;
    } else if (scopeValue1454.avatarAssetId && scopeValue64(scopeValue1454.avatar)) {
      scopeValue1454.avatar = null;
    }
    if (Array.isArray(scopeValue1454.images)) {
      const scopeValue1456 = [];
      for (let scopeValue1457 = 0; scopeValue1457 < scopeValue1454.images.length; scopeValue1457 += 1) {
        const scopeValue1458 = scopeValue1454.images[scopeValue1457];
        if (typeof scopeValue1458 === "string" && scopeValue63(scopeValue1458)) {
          const scopeValue1459 = scopeValue177("moment_img", scopeValue1454.id, scopeValue1457);
          await scopeValue140(scopeValue1459, scopeValue1458, {
            ownerType: "im_moment",
            ownerId: String(scopeValue1454.id),
            field: "images",
            index: scopeValue1457
          });
          scopeValue1456.push({
            assetId: scopeValue1459,
            desc: ""
          });
        } else if (scopeValue1458 && typeof scopeValue1458 === "object" && scopeValue63(scopeValue1458.src)) {
          const scopeValue1460 = scopeValue1458.assetId || scopeValue177("moment_img", scopeValue1454.id, scopeValue1457);
          await scopeValue140(scopeValue1460, scopeValue1458.src, {
            ownerType: "im_moment",
            ownerId: String(scopeValue1454.id),
            field: "images",
            index: scopeValue1457
          });
          scopeValue1456.push({
            ...scopeValue1458,
            assetId: scopeValue1460,
            src: null
          });
        } else if (scopeValue1458 && typeof scopeValue1458 === "object" && scopeValue1458.assetId && scopeValue64(scopeValue1458.src)) {
          scopeValue1456.push({
            ...scopeValue1458,
            src: null
          });
        } else {
          scopeValue1456.push(scopeValue1458);
        }
      }
      scopeValue1454.images = scopeValue1456;
    }
    return scopeValue1454;
  }
  async function scopeValue210(scopeValue1461) {
    if (!scopeValue1461) return scopeValue1461;
    const scopeValue1462 = {
      ...scopeValue1461
    };
    if (scopeValue1462.avatarAssetId && (!scopeValue1462.avatar || scopeValue64(scopeValue1462.avatar))) {
      scopeValue1462.avatar = await scopeValue143(scopeValue1462.avatarAssetId);
    }
    if (Array.isArray(scopeValue1462.images)) {
      const scopeValue1463 = [];
      for (const scopeValue1464 of scopeValue1462.images) {
        if (scopeValue1464 && typeof scopeValue1464 === "object" && scopeValue1464.assetId && (!scopeValue1464.src || scopeValue64(scopeValue1464.src))) {
          scopeValue1463.push({
            ...scopeValue1464,
            src: await scopeValue143(scopeValue1464.assetId)
          });
        } else {
          scopeValue1463.push(scopeValue1464);
        }
      }
      scopeValue1462.images = scopeValue1463;
    }
    return scopeValue1462;
  }
  function scopeValue211(scopeValue1465) {
    if (!scopeValue1465) return [];
    const scopeValue1466 = [];
    if (scopeValue1465.avatarAssetId) scopeValue1466.push(String(scopeValue1465.avatarAssetId));
    if (Array.isArray(scopeValue1465.images)) {
      scopeValue1465.images.forEach(scopeValue1467 => {
        if (scopeValue1467 && typeof scopeValue1467 === "object" && scopeValue1467.assetId) {
          scopeValue1466.push(String(scopeValue1467.assetId));
        }
      });
    }
    return Array.from(new Set(scopeValue1466));
  }
  function scopeValue212(scopeValue1468) {
    if (!scopeValue1468 || scopeValue1468.id == null) return [];
    const scopeValue1469 = [];
    if (scopeValue1468.avatarAssetId) {
      scopeValue1469.push(String(scopeValue1468.avatarAssetId));
    } else if (scopeValue63(scopeValue1468.avatar)) {
      scopeValue1469.push(scopeValue177("moment_avatar", scopeValue1468.id, "avatar"));
    }
    if (Array.isArray(scopeValue1468.images)) {
      scopeValue1468.images.forEach((scopeValue1470, scopeValue1471) => {
        if (scopeValue1470 && typeof scopeValue1470 === "object" && scopeValue1470.assetId) {
          scopeValue1469.push(String(scopeValue1470.assetId));
          return;
        }
        if (typeof scopeValue1470 === "string" && scopeValue63(scopeValue1470)) {
          scopeValue1469.push(scopeValue177("moment_img", scopeValue1468.id, scopeValue1471));
          return;
        }
        if (scopeValue1470 && typeof scopeValue1470 === "object" && scopeValue63(scopeValue1470.src)) {
          scopeValue1469.push(String(scopeValue1470.assetId || scopeValue177("moment_img", scopeValue1468.id, scopeValue1471)));
        }
      });
    }
    return Array.from(new Set(scopeValue1469));
  }
  async function scopeValue213(scopeValue1472) {
    if (scopeValue1472 == null) return null;
    return scopeValue84(scopeValue9.imMoments, scopeValue1472);
  }
  async function scopeValue214(scopeValue1473, scopeValue1474, scopeValue1475 = new Set()) {
    if (!scopeValue1473) return;
    const scopeValue1476 = new Set(scopeValue212(scopeValue1474));
    const scopeValue1477 = [];
    for (const scopeValue1478 of scopeValue211(scopeValue1473)) {
      if (scopeValue1476.has(scopeValue1478) || scopeValue1475.has(scopeValue1478)) continue;
      scopeValue1477.push(scopeValue1478);
    }
    if (scopeValue1477.length > 0) await scopeValue161(scopeValue1477);
  }
  async function scopeValue215(scopeValue1479) {
    if (!scopeValue1479 || scopeValue1479.id == null) return false;
    const scopeValue1480 = await scopeValue213(scopeValue1479.id);
    const scopeValue1481 = new Set(scopeValue212(scopeValue1479));
    const scopeValue1482 = await scopeValue209(scopeValue1479);
    await scopeValue85(scopeValue9.imMoments, {
      ...scopeValue1482,
      id: scopeValue1482.id,
      updatedAt: Date.now()
    });
    await scopeValue214(scopeValue1480, scopeValue1479, scopeValue1481);
    return true;
  }
  async function scopeValue216(scopeValue1483) {
    if (scopeValue1483 == null) return false;
    const scopeValue1484 = await scopeValue87(scopeValue9.imMoments);
    const scopeValue1485 = scopeValue1484.filter(scopeValue1490 => String(scopeValue1490?.id) === String(scopeValue1483));
    const scopeValue1486 = await scopeValue213(scopeValue1483);
    const scopeValue1487 = [];
    const scopeValue1488 = new Set([scopeValue1483]);
    if (scopeValue1486) {
      scopeValue1487.push(scopeValue1486);
      scopeValue1488.add(scopeValue1486.id);
    }
    scopeValue1485.forEach(scopeValue1491 => {
      if (!scopeValue1491) return;
      scopeValue1487.push(scopeValue1491);
      scopeValue1488.add(scopeValue1491.id);
    });
    for (const scopeValue1492 of scopeValue1488) {
      await scopeValue86(scopeValue9.imMoments, scopeValue1492);
    }
    const scopeValue1489 = new Set();
    for (const scopeValue1493 of scopeValue1487) {
      const scopeValue1494 = `${typeof scopeValue1493.id}:${String(scopeValue1493.id)}`;
      if (scopeValue1489.has(scopeValue1494)) continue;
      scopeValue1489.add(scopeValue1494);
      await scopeValue214(scopeValue1493, null);
    }
    return true;
  }
  async function scopeValue217(scopeValue1495) {
    const scopeValue1496 = Array.isArray(scopeValue1495) ? scopeValue1495 : [];
    const scopeValue1497 = await scopeValue87(scopeValue9.imMoments);
    const scopeValue1498 = new Set(scopeValue1496.map(scopeValue1500 => String(scopeValue1500.id)));
    const scopeValue1499 = new Set();
    scopeValue1496.forEach(scopeValue1501 => {
      scopeValue212(scopeValue1501).forEach(scopeValue1502 => scopeValue1499.add(scopeValue1502));
    });
    for (const scopeValue1503 of scopeValue1497) {
      if (!scopeValue1498.has(String(scopeValue1503.id))) {
        await scopeValue216(scopeValue1503.id);
      }
    }
    for (const scopeValue1504 of scopeValue1496) {
      await scopeValue215(scopeValue1504);
    }
    return true;
  }
  async function scopeValue218() {
    const scopeValue1505 = await scopeValue87(scopeValue9.imMoments);
    const scopeValue1506 = await Promise.all(scopeValue1505.map(scopeValue1507 => scopeValue210(scopeValue1507)));
    scopeValue1506.sort((scopeValue1508, scopeValue1509) => (scopeValue1509.time || 0) - (scopeValue1508.time || 0));
    return scopeValue1506;
  }
  async function scopeValue219(scopeValue1510) {
    const scopeValue1511 = Array.isArray(scopeValue1510) ? scopeValue1510 : [];
    const scopeValue1512 = scopeValue1511.map(scopeValue1514 => ({
      ...scopeValue1514,
      id: scopeValue1514?.id || `moment_msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    }));
    const scopeValue1513 = new Set(scopeValue1512.map(scopeValue1515 => String(scopeValue1515.id)));
    return scopeValue83([scopeValue9.imMomentMessages], "readwrite", async scopeValue1516 => {
      const scopeValue1517 = await scopeValue77(scopeValue1516[scopeValue9.imMomentMessages].getAll());
      const scopeValue1518 = new Map((Array.isArray(scopeValue1517) ? scopeValue1517 : []).map(scopeValue1519 => [String(scopeValue1519.id), scopeValue1519]));
      scopeValue1518.forEach((scopeValue1520, scopeValue1521) => {
        if (!scopeValue1513.has(scopeValue1521)) {
          scopeValue1516[scopeValue9.imMomentMessages].delete(scopeValue1520.id);
        }
      });
      scopeValue1512.forEach(scopeValue1522 => {
        scopeValue1516[scopeValue9.imMomentMessages].put(scopeValue1522);
      });
    });
  }
  async function scopeValue220() {
    const scopeValue1523 = await scopeValue87(scopeValue9.imMomentMessages);
    return Array.isArray(scopeValue1523) ? scopeValue1523.sort((scopeValue1524, scopeValue1525) => (scopeValue1525.time || 0) - (scopeValue1524.time || 0)) : [];
  }
  async function scopeValue221(scopeValue1526) {
    const scopeValue1527 = Array.isArray(scopeValue1526) ? scopeValue1526.filter(scopeValue1530 => scopeValue1530 && scopeValue1530.categoryName != null) : [];
    const scopeValue1528 = [];
    for (const scopeValue1531 of scopeValue1527) {
      const scopeValue1532 = scopeValue47(scopeValue1531);
      scopeValue1532.categoryName = String(scopeValue1531.categoryName);
      const scopeValue1533 = Array.isArray(scopeValue1532.items) ? scopeValue1532.items : [];
      for (let scopeValue1534 = 0; scopeValue1534 < scopeValue1533.length; scopeValue1534 += 1) {
        const scopeValue1535 = scopeValue1533[scopeValue1534];
        if (!scopeValue1535 || typeof scopeValue1535 !== "object") continue;
        if (scopeValue63(scopeValue1535.url)) {
          scopeValue1535.assetId = await scopeValue75(scopeValue1535.url, {
            fallbackId: scopeValue177("sticker", scopeValue1532.categoryName, scopeValue1535.name ?? scopeValue1534),
            ownerType: "im_sticker",
            ownerId: scopeValue1532.categoryName,
            field: String(scopeValue1535.name ?? scopeValue1534)
          });
          scopeValue1535.url = null;
        } else if (scopeValue1535.assetId && scopeValue64(scopeValue1535.url)) {
          scopeValue1535.url = null;
        }
      }
      scopeValue1528.push(scopeValue1532);
    }
    const scopeValue1529 = new Set(scopeValue1528.map(scopeValue1536 => scopeValue1536.categoryName));
    return scopeValue83([scopeValue9.imStickers], "readwrite", async scopeValue1537 => {
      const scopeValue1538 = await scopeValue77(scopeValue1537[scopeValue9.imStickers].getAll());
      const scopeValue1539 = new Map((Array.isArray(scopeValue1538) ? scopeValue1538 : []).map(scopeValue1540 => [String(scopeValue1540.categoryName), scopeValue1540]));
      scopeValue1539.forEach((scopeValue1541, scopeValue1542) => {
        if (!scopeValue1529.has(scopeValue1542)) {
          scopeValue1537[scopeValue9.imStickers].delete(scopeValue1541.categoryName);
        }
      });
      scopeValue1528.forEach(scopeValue1543 => scopeValue1537[scopeValue9.imStickers].put(scopeValue1543));
    });
  }
  async function scopeValue222() {
    const scopeValue1544 = await scopeValue87(scopeValue9.imStickers);
    for (const scopeValue1545 of scopeValue1544) {
      for (const scopeValue1546 of Array.isArray(scopeValue1545?.items) ? scopeValue1545.items : []) {
        if (scopeValue1546?.assetId && !scopeValue1546.url) scopeValue1546.url = await scopeValue143(scopeValue1546.assetId);
      }
    }
    return scopeValue1544;
  }
  async function scopeValue223() {
    const scopeValue1547 = await scopeValue87(scopeValue9.imStickers);
    return scopeValue1547.map(scopeValue1548 => ({
      categoryName: String(scopeValue1548?.categoryName || ""),
      boundFriendIds: Array.isArray(scopeValue1548?.boundFriendIds) ? [...scopeValue1548.boundFriendIds] : [],
      items: (Array.isArray(scopeValue1548?.items) ? scopeValue1548.items : []).map(scopeValue1549 => ({
        name: String(scopeValue1549?.name || ""),
        assetId: String(scopeValue1549?.assetId || ""),
        url: scopeValue1549?.assetId ? "" : String(scopeValue1549?.url || "")
      }))
    }));
  }
  async function scopeValue224(scopeValue1550) {
    const scopeValue1551 = Date.now();
    let scopeValue1552 = scopeValue1550 || null;
    if (scopeValue63(scopeValue1550)) await scopeValue139(scopeValue1550);
    await scopeValue83([scopeValue9.meta, scopeValue9.assets], "readwrite", async scopeValue1553 => {
      if (scopeValue63(scopeValue1550)) {
        const scopeValue1554 = "im_moments_cover_me";
        const scopeValue1555 = scopeValue73(scopeValue1550);
        scopeValue1553[scopeValue9.assets].put({
          id: scopeValue1554,
          blob: scopeValue1555,
          mimeType: scopeValue1555.type || "application/octet-stream",
          ownerType: "im_moments",
          ownerId: "me",
          field: "momentsCover",
          updatedAt: scopeValue1551
        });
        scopeValue1552 = scopeValue1554;
      } else if (scopeValue1550) {
        scopeValue1552 = {
          externalUrl: scopeValue1550
        };
      } else {
        scopeValue1552 = null;
      }
      scopeValue1553[scopeValue9.meta].put({
        key: scopeValue16.imMomentsCoverAssetId,
        value: scopeValue1552
      });
    });
    if (scopeValue1552 === "im_moments_cover_me") scopeValue59(scopeValue1552);
    return scopeValue1552;
  }
  async function scopeValue225() {
    const scopeValue1556 = await scopeValue132(scopeValue16.imMomentsCoverAssetId);
    if (!scopeValue1556) return null;
    if (typeof scopeValue1556 === "object" && scopeValue1556.externalUrl) return scopeValue1556.externalUrl;
    if (typeof scopeValue1556 === "string") return scopeValue143(scopeValue1556);
    return null;
  }
  function scopeValue226() {
    return {
      youtube: {
        channelState: {
          bannerUrl: null,
          url: "",
          boundWorldBookIds: [],
          systemPrompt: "",
          summaryPrompt: "",
          groupChatPrompt: "",
          vodPrompt: "",
          postPrompt: "",
          liveSummaryPrompt: "",
          liveSummaries: [],
          groupChatHistory: [],
          cachedTrendingLive: null,
          cachedTrendingSub: null,
          activeUserLive: null,
          pastVideos: []
        },
        subscriptions: [],
        userState: null
      },
      tiktok: {
        profile: {
          name: "User",
          handle: "user",
          avatar: null,
          status: "No Signa...",
          bio: "Add bio",
          persona: "",
          following: 0,
          followers: 0,
          likes: 0,
          posts: []
        },
        chars: [],
        videos: [{
          id: "v_default_1",
          authorId: "vegartatelier",
          authorName: "VEGART ATELIER",
          cover: "assets/tiktok/feed-default-1.jpg",
          desc: "Aurelia Forest House is designed as an ultra-luxury brutalist villa concept lost in nature but losing nothing from its architectural character.#ArchitecturalConcept #ForestHouse",
          sceneText: "Pale limestone surfaces, greige mineral concrete masses and warm travertine terraces create a calmer, more natural and more timeless luxury language within the dense wood texture. Brutalism is not harsh and cold here. On the contrary, it becomes more refined with the shadow of the forest, texture of the stone and soft light of the sunset.",
          likes: 143119,
          commentsCount: 1218,
          shares: 41280,
          isLiked: false,
          comments: [{
            authorName: "lewishartlily",
            text: "My dream home in another life",
            likes: 733
          }, {
            authorName: "ali_ibo89",
            text: "This,a wife and 4 kids,this is the final goal",
            likes: 237
          }]
        }, {
          id: "v_default_2",
          authorId: "pilotluana",
          authorName: "FRED",
          cover: "assets/tiktok/feed-default-2.jpg",
          desc: "If your business travels with you, your finances should too.#FlexGlobal #FlexElite #FlexPartner",
          sceneText: "Now expanding across 170 countries and 37 currencies, it gives founders and business owners an easier way to manage expenses and operate internationally.And for those looking for an even more premium experience, Flex Elite takes it one step further.",
          likes: 22157,
          commentsCount: 179,
          shares: 5915,
          isLiked: false,
          comments: [{
            authorName: "lucyinthesskyy",
            text: "Wow!!So dreamyyy",
            likes: 157
          }, {
            authorName: "hutravelstheworld",
            text: "I need to try",
            likes: 44
          }]
        }],
        dms: []
      },
      pay: {
        transactions: [],
        balance: 10000
      },
      spotify: {
        customName: "",
        avatarUrl: "",
        backgroundUrl: ""
      },
      diary: {
        schemaVersion: 2,
        profile: {
          name: "Diary User",
          avatarUrl: "",
          initialized: false,
          sourceAccountId: null
        },
        generationSettings: {
          targetLength: 300,
          contextCount: 30,
          customPromptEnabled: false,
          customPrompt: ""
        },
        entries: []
      },
      treasure: {
        schemaVersion: 1,
        entries: [],
        lastConversationId: "",
        activeCategory: "online"
      },
      cycle: {
        schemaVersion: 2,
        typicalCycleDays: 28,
        typicalPeriodDays: 5,
        periods: [],
        boundCharIds: []
      },
      maps: {
        mapsStore: [],
        activeMapId: null,
        friendPositionsStore: {}
      },
      netflix: {
        schemaVersion: 4,
        homeCatalog: null,
        activeRun: null,
        saveSlots: {
          auto: null,
          manual: [null, null, null, null, null, null]
        },
        mediaLibrary: {},
        unlockedEndings: [],
        uiSettings: {
          textSpeed: "normal",
          reduceMotion: false
        }
      },
      desktop: {},
      bstage: {},
      x: {
        xData: {
          name: "User",
          handle: "@user",
          bio: "点击编辑资料添加简介",
          location: "",
          following: "0",
          followers: "0",
          persona: "",
          avatar: "",
          banner: ""
        },
        xPlayerAccounts: [],
        activeXPlayerAccountId: "",
        xAccountSchemaVersion: 1,
        xCharIdentityMigrationVersion: 0,
        xCharProfileMediaMigrationVersion: 0,
        xAccountModeration: {},
        xOfficialNotifications: [],
        xTopics: [],
        xHomeBannerUrl: "",
        xSearchBannerUrl: ""
      },
      imessage: {
        uiState: {
          cssPresets: []
        }
      }
    };
  }
  function scopeValue227(scopeValue1557 = {}) {
    const scopeValue1558 = scopeValue226();
    const scopeValue1559 = scopeValue1557 && typeof scopeValue1557 === "object" ? scopeValue1557 : {};
    return {
      ...scopeValue1558,
      ...scopeValue1559,
      youtube: {
        ...scopeValue1558.youtube,
        ...(scopeValue1559.youtube && typeof scopeValue1559.youtube === "object" ? scopeValue1559.youtube : {})
      },
      tiktok: {
        ...scopeValue1558.tiktok,
        ...(scopeValue1559.tiktok && typeof scopeValue1559.tiktok === "object" ? scopeValue1559.tiktok : {})
      },
      pay: {
        ...scopeValue1558.pay,
        ...(scopeValue1559.pay && typeof scopeValue1559.pay === "object" ? scopeValue1559.pay : {})
      },
      spotify: {
        ...scopeValue1558.spotify,
        ...(scopeValue1559.spotify && typeof scopeValue1559.spotify === "object" ? scopeValue1559.spotify : {})
      },
      diary: {
        ...scopeValue1558.diary,
        ...(scopeValue1559.diary && typeof scopeValue1559.diary === "object" ? scopeValue1559.diary : {})
      },
      treasure: {
        ...scopeValue1558.treasure,
        ...(scopeValue1559.treasure && typeof scopeValue1559.treasure === "object" ? scopeValue1559.treasure : {})
      },
      cycle: {
        ...scopeValue1558.cycle,
        ...(scopeValue1559.cycle && typeof scopeValue1559.cycle === "object" ? scopeValue1559.cycle : {})
      },
      maps: {
        ...scopeValue1558.maps,
        ...(scopeValue1559.maps && typeof scopeValue1559.maps === "object" ? scopeValue1559.maps : {})
      },
      netflix: scopeValue1559.netflix && typeof scopeValue1559.netflix === "object" ? scopeValue1559.netflix : scopeValue1558.netflix,
      desktop: scopeValue1559.desktop && typeof scopeValue1559.desktop === "object" ? scopeValue1559.desktop : scopeValue1558.desktop,
      bstage: scopeValue1559.bstage && typeof scopeValue1559.bstage === "object" ? scopeValue1559.bstage : scopeValue1558.bstage,
      x: {
        ...scopeValue1558.x,
        ...(scopeValue1559.x && typeof scopeValue1559.x === "object" ? scopeValue1559.x : {}),
        xData: {
          ...scopeValue1558.x.xData,
          ...(scopeValue1559.x && scopeValue1559.x.xData && typeof scopeValue1559.x.xData === "object" ? scopeValue1559.x.xData : {})
        },
        xTopics: Array.isArray(scopeValue1559.x?.xTopics) ? scopeValue1559.x.xTopics : scopeValue1558.x.xTopics,
        xHomeBannerUrl: typeof scopeValue1559.x?.xHomeBannerUrl === "string" ? scopeValue1559.x.xHomeBannerUrl : scopeValue1558.x.xHomeBannerUrl,
        xSearchBannerUrl: typeof scopeValue1559.x?.xSearchBannerUrl === "string" ? scopeValue1559.x.xSearchBannerUrl : scopeValue1558.x.xSearchBannerUrl
      },
      imessage: {
        ...scopeValue1558.imessage,
        ...(scopeValue1559.imessage && typeof scopeValue1559.imessage === "object" ? scopeValue1559.imessage : {}),
        uiState: {
          ...scopeValue1558.imessage.uiState,
          ...(scopeValue1559.imessage && scopeValue1559.imessage.uiState && typeof scopeValue1559.imessage.uiState === "object" ? scopeValue1559.imessage.uiState : {})
        }
      }
    };
  }
  function scopeValue228(scopeValue1560 = {}) {
    const scopeValue1561 = scopeValue1560 && typeof scopeValue1560 === "object" ? scopeValue1560 : {};
    const scopeValue1562 = scopeValue1561.themeState && typeof scopeValue1561.themeState === "object" ? scopeValue1561.themeState : null;
    if (scopeValue1562) {
      scopeValue1562.imessageHomeCssEnabled = !!scopeValue1562.imessageHomeCssEnabled;
      scopeValue1562.imessageHomeCss = typeof scopeValue1562.imessageHomeCss === "string" ? scopeValue1562.imessageHomeCss : "";
      scopeValue1562.imessageChatCssEnabled = !!scopeValue1562.imessageChatCssEnabled;
      scopeValue1562.imessageChatCss = typeof scopeValue1562.imessageChatCss === "string" ? scopeValue1562.imessageChatCss : "";
      if (Array.isArray(scopeValue1562.apps)) {
        scopeValue1562.apps = scopeValue1562.apps.map(scopeValue1563 => {
          if (!scopeValue1563 || typeof scopeValue1563 !== "object") return scopeValue1563;
          if (scopeValue1563.id === "app-icon-8" && scopeValue1563.name === "Spotify") {
            return {
              ...scopeValue1563,
              name: "Loves"
            };
          }
          return scopeValue1563;
        });
      }
    }
    return {
      storageSchemaVersion: scopeValue5,
      userState: scopeValue1561.userState && typeof scopeValue1561.userState === "object" ? {
        name: scopeValue1561.userState.name || "",
        phone: scopeValue1561.userState.phone || "",
        persona: scopeValue1561.userState.persona || "",
        avatarUrl: scopeValue1561.userState.avatarUrl || null
      } : {
        name: "",
        phone: "",
        persona: "",
        avatarUrl: null
      },
      accounts: Array.isArray(scopeValue1561.accounts) ? scopeValue1561.accounts : [],
      currentAccountId: scopeValue1561.currentAccountId ?? null,
      apiConfig: scopeValue1561.apiConfig && typeof scopeValue1561.apiConfig === "object" ? {
        provider: ["openai", "deepseek", "siliconflow", "gemini", "anthropic", "openai-compatible"].includes(String(scopeValue1561.apiConfig.provider || "").toLowerCase()) ? String(scopeValue1561.apiConfig.provider).toLowerCase() : "openai-compatible",
        endpoint: typeof scopeValue1561.apiConfig.endpoint === "string" ? scopeValue1561.apiConfig.endpoint : "",
        apiKey: typeof scopeValue1561.apiConfig.apiKey === "string" ? scopeValue1561.apiConfig.apiKey : "",
        model: typeof scopeValue1561.apiConfig.model === "string" ? scopeValue1561.apiConfig.model : "",
        temperature: Number.isFinite(parseFloat(scopeValue1561.apiConfig.temperature)) ? parseFloat(scopeValue1561.apiConfig.temperature) : 0.7,
        frequencyPenalty: Number.isFinite(parseFloat(scopeValue1561.apiConfig.frequencyPenalty)) ? Math.max(-2, Math.min(2, parseFloat(scopeValue1561.apiConfig.frequencyPenalty))) : 0,
        streamEnabled: scopeValue1561.apiConfig.streamEnabled === true
      } : {
        provider: "openai-compatible",
        endpoint: "",
        apiKey: "",
        model: "",
        temperature: 0.7,
        frequencyPenalty: 0,
        streamEnabled: false
      },
      vectorMemoryConfig: (() => {
        const scopeValue1564 = scopeValue1561.vectorMemoryConfig && typeof scopeValue1561.vectorMemoryConfig === "object" ? scopeValue1561.vectorMemoryConfig : {};
        const scopeValue1565 = !scopeValue1564.provider && ["namespace", "embeddingModel", "embeddingDimensions", "embeddingRevision", "topK", "timeoutMs"].some(scopeValue1568 => Object.prototype.hasOwnProperty.call(scopeValue1564, scopeValue1568));
        const scopeValue1566 = ["siliconflow", "openai", "dashscope", "zhipu", "openai-compatible"].includes(String(scopeValue1564.provider || "").toLowerCase()) ? String(scopeValue1564.provider).toLowerCase() : "siliconflow";
        const scopeValue1567 = {
          siliconflow: "BAAI/bge-m3",
          openai: "text-embedding-3-small",
          dashscope: "text-embedding-v4",
          zhipu: "embedding-3",
          "openai-compatible": ""
        };
        return {
          enabled: !scopeValue1565 && scopeValue1564.enabled === true,
          provider: scopeValue1566,
          endpoint: scopeValue1566 === "openai-compatible" && typeof scopeValue1564.endpoint === "string" ? scopeValue1564.endpoint : "",
          apiKey: !scopeValue1565 && typeof scopeValue1564.apiKey === "string" ? scopeValue1564.apiKey : "",
          model: typeof scopeValue1564.model === "string" && scopeValue1564.model.trim() ? scopeValue1564.model : scopeValue1567[scopeValue1566]
        };
      })(),
      apiPresets: Array.isArray(scopeValue1561.apiPresets) ? scopeValue1561.apiPresets : [],
      fetchedModels: Array.isArray(scopeValue1561.fetchedModels) ? scopeValue1561.fetchedModels : [],
      assistiveBallSettings: scopeValue1561.assistiveBallSettings && typeof scopeValue1561.assistiveBallSettings === "object" ? {
        enabled: !!scopeValue1561.assistiveBallSettings.enabled,
        x: Number.isFinite(parseFloat(scopeValue1561.assistiveBallSettings.x)) ? parseFloat(scopeValue1561.assistiveBallSettings.x) : null,
        y: Number.isFinite(parseFloat(scopeValue1561.assistiveBallSettings.y)) ? parseFloat(scopeValue1561.assistiveBallSettings.y) : null,
        size: Number.isFinite(parseFloat(scopeValue1561.assistiveBallSettings.size)) ? Math.round(Math.max(36, Math.min(96, parseFloat(scopeValue1561.assistiveBallSettings.size))) / 2) * 2 : 58,
        opacity: Number.isFinite(parseFloat(scopeValue1561.assistiveBallSettings.opacity)) ? Math.max(0.2, Math.min(1, parseFloat(scopeValue1561.assistiveBallSettings.opacity) > 1 ? parseFloat(scopeValue1561.assistiveBallSettings.opacity) / 100 : parseFloat(scopeValue1561.assistiveBallSettings.opacity))) : 0.72,
        imageUrl: typeof scopeValue1561.assistiveBallSettings.imageUrl === "string" && /^(https?:\/\/|data:image\/png;base64,)/i.test(scopeValue1561.assistiveBallSettings.imageUrl.trim()) ? scopeValue1561.assistiveBallSettings.imageUrl.trim() : ""
      } : {
        enabled: false,
        x: null,
        y: null,
        size: 58,
        opacity: 0.72,
        imageUrl: ""
      },
      themeState: scopeValue1562 || {
        bgUrl: null,
        fontMode: "preset",
        fontPresetKey: "system-default",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, \"PingFang SC\", sans-serif",
        fontCssName: "",
        fontSize: 16,
        fontSources: {
          woff2: "",
          woff: "",
          ttf: ""
        },
        savedFontPresets: [],
        imessageHomeCssEnabled: false,
        imessageHomeCss: "",
        imessageChatCssEnabled: false,
        imessageChatCss: "",
        apps: [{
          id: "app-icon-1",
          name: "Pay",
          icon: null
        }, {
          id: "app-icon-2",
          name: "TikTok",
          icon: null
        }, {
          id: "app-icon-3",
          name: "b.stage",
          icon: null
        }, {
          id: "app-icon-4",
          name: "X",
          icon: null
        }, {
          id: "app-icon-5",
          name: "Shop",
          icon: null
        }, {
          id: "app-icon-6",
          name: "Library",
          icon: null
        }, {
          id: "app-icon-7",
          name: "Netflix",
          icon: null
        }, {
          id: "app-icon-8",
          name: "Loves",
          icon: null
        }, {
          id: "app-icon-9",
          name: "App Store",
          icon: null
        }, {
          id: "app-icon-10",
          name: "Gallery",
          icon: null
        }, {
          id: "app-icon-11",
          name: "MCP",
          icon: null
        }, {
          id: "app-icon-12",
          name: "AO3",
          icon: null
        }, {
          id: "app-icon-13",
          name: "Diary",
          icon: null
        }, {
          id: "app-icon-14",
          name: "call",
          icon: null
        }, {
          id: "app-icon-15",
          name: "Cphone",
          icon: null
        }, {
          id: "app-icon-16",
          name: "Cycle",
          icon: null
        }, {
          id: "dock-icon-settings",
          name: "设置",
          icon: null
        }, {
          id: "dock-icon-imessage",
          name: "信息",
          icon: null
        }, {
          id: "dock-icon-youtube",
          name: "YouTube",
          icon: null
        }]
      },
      wbGroups: Array.isArray(scopeValue1561.wbGroups) ? scopeValue1561.wbGroups : [],
      worldBooks: Array.isArray(scopeValue1561.worldBooks) ? scopeValue1561.worldBooks : [],
      appState: scopeValue227(scopeValue1561.appState)
    };
  }
  async function scopeValue229(scopeValue1569 = {}) {
    const scopeValue1570 = scopeValue228(scopeValue1569);
    await Promise.all([scopeValue135("currentAccountId", scopeValue1570.currentAccountId), scopeValue135("apiConfig", scopeValue1570.apiConfig), scopeValue135("vectorMemoryConfig", scopeValue1570.vectorMemoryConfig), scopeValue135("apiPresets", scopeValue1570.apiPresets), scopeValue135("fetchedModels", scopeValue1570.fetchedModels), scopeValue135("assistiveBallSettings", scopeValue1570.assistiveBallSettings), scopeValue135("themeState", scopeValue1570.themeState), scopeValue135("wbGroups", scopeValue1570.wbGroups), scopeValue135("worldBooks", scopeValue1570.worldBooks), scopeValue133(scopeValue16.schemaVersion, scopeValue5)]);
    if (scopeValue32) await scopeValue32;
    await scopeValue114("settings", scopeValue1571 => ({
      ...scopeValue1571,
      userState: scopeValue1570.userState,
      accounts: scopeValue1570.accounts,
      currentAccountId: scopeValue1570.currentAccountId,
      apiConfig: scopeValue1570.apiConfig,
      vectorMemoryConfig: scopeValue1570.vectorMemoryConfig,
      apiPresets: scopeValue1570.apiPresets,
      fetchedModels: scopeValue1570.fetchedModels,
      assistiveBallSettings: scopeValue1570.assistiveBallSettings,
      themeState: scopeValue1570.themeState,
      wbGroups: scopeValue1570.wbGroups,
      worldBooks: scopeValue1570.worldBooks
    }), {
      reason: "global-settings-save"
    });
    await Promise.all(Object.entries(scopeValue1570.appState || {}).map(([scopeValue1572, scopeValue1573]) => {
      return scopeValue114(scopeValue1572, scopeValue1573, {
        reason: `global-app-save:${scopeValue1572}`
      });
    }));
    return true;
  }
  async function scopeValue230(newScope1675 = {}) {
    const [scopeValue1574, scopeValue1575, scopeValue1576, scopeValue1577, scopeValue1578, scopeValue1579, scopeValue1580, scopeValue1581, scopeValue1582, scopeValue1583, scopeValue1584, scopeValue1585, scopeValue1586] = await Promise.all([scopeValue132(scopeValue16.schemaVersion), scopeValue134("userState", null), scopeValue134("currentAccountId", null), scopeValue134("apiConfig", null), scopeValue134("vectorMemoryConfig", null), scopeValue134("apiPresets", []), scopeValue134("fetchedModels", []), scopeValue134("assistiveBallSettings", {
      enabled: false
    }), scopeValue134("themeState", null), scopeValue134("wbGroups", []), scopeValue134("worldBooks", []), newScope1675.includeAppState === false ? Promise.resolve(null) : scopeValue134("appState", scopeValue226()), scopeValue84(scopeValue9.accounts, "__all__")]);
    const scopeValue1587 = scopeValue97("settings", {});
    const scopeValue1588 = newScope1675.includeAppState === false ? {} : scopeValue226();
    if (newScope1675.includeAppState !== false) {
      Object.keys(scopeValue1588).forEach(scopeValue1589 => {
        scopeValue1588[scopeValue1589] = scopeValue97(scopeValue1589, scopeValue1588[scopeValue1589]);
      });
    }
    return {
      ...scopeValue228({
        userState: scopeValue1587.userState ?? scopeValue1575,
        accounts: Array.isArray(scopeValue1587.accounts) ? scopeValue1587.accounts : scopeValue1586 && Array.isArray(scopeValue1586.value) ? scopeValue1586.value : [],
        currentAccountId: scopeValue1587.currentAccountId ?? scopeValue1576,
        apiConfig: scopeValue1587.apiConfig ?? scopeValue1577,
        vectorMemoryConfig: scopeValue1587.vectorMemoryConfig ?? scopeValue1578,
        apiPresets: scopeValue1587.apiPresets ?? scopeValue1579,
        fetchedModels: scopeValue1587.fetchedModels ?? scopeValue1580,
        assistiveBallSettings: scopeValue1587.assistiveBallSettings ?? scopeValue1581,
        themeState: scopeValue1587.themeState ?? scopeValue1582,
        wbGroups: scopeValue1587.wbGroups ?? scopeValue1583,
        worldBooks: scopeValue1587.worldBooks ?? scopeValue1584,
        appState: scopeValue1588
      }),
      storageSchemaVersion: Number(scopeValue1574) || 0
    };
  }
  async function scopeValue231(scopeValue1590, scopeValue1591) {
    const scopeValue1592 = scopeValue47(scopeValue1591);
    if (scopeValue1590 === scopeValue9.appDomains && scopeValue1592?.name === "legacy" && scopeValue1592.value) {
      ["u2phone_mcp_http_servers_v2", "u2phone_mcp_http_servers_v3"].forEach(scopeValue1593 => {
        const scopeValue1594 = scopeValue1592.value[scopeValue1593];
        if (Array.isArray(scopeValue1594)) {
          scopeValue1592.value[scopeValue1593] = scopeValue1594.map(scopeValue1595 => ({
            ...scopeValue1595,
            auth: {
              type: "none"
            },
            customHeaders: []
          }));
        }
      });
    }
    if (scopeValue1590 === scopeValue9.assets && scopeValue1592 && scopeValue1592.blob) {
      try {
        scopeValue1592.dataUrl = await scopeValue76(scopeValue1592.blob);
        delete scopeValue1592.blob;
      } catch (scopeValue1596) {
        throw new Error(`Asset ${scopeValue1592.id || "unknown"} could not be included in the backup: ${scopeValue1596?.message || scopeValue1596}`);
      }
    }
    return scopeValue1592;
  }
  function scopeValue232(scopeValue1597, scopeValue1598) {
    const scopeValue1599 = scopeValue47(scopeValue1598);
    if (scopeValue1597 === scopeValue9.assets && scopeValue1599 && scopeValue1599.dataUrl) {
      try {
        scopeValue1599.blob = scopeValue73(scopeValue1599.dataUrl);
        delete scopeValue1599.dataUrl;
      } catch (scopeValue1600) {
        throw new Error(`Backup asset ${scopeValue1599.id || "unknown"} contains invalid image data.`);
      }
    }
    return scopeValue1599;
  }
  function scopeValue233(scopeValue1601 = {}, scopeValue1602 = []) {
    const scopeValue1603 = {};
    let scopeValue1604 = 0;
    let scopeValue1605 = 0;
    scopeValue10.forEach(scopeValue1606 => {
      const scopeValue1607 = Array.isArray(scopeValue1601[scopeValue1606]) ? scopeValue1601[scopeValue1606].length : 0;
      scopeValue1603[scopeValue1606] = scopeValue1607;
      scopeValue1604 += scopeValue1607;
    });
    if (Array.isArray(scopeValue1601[scopeValue9.assets])) {
      scopeValue1605 = scopeValue1601[scopeValue9.assets].length;
    }
    return {
      stores: scopeValue1603,
      storeCount: scopeValue10.length,
      recordCount: scopeValue1604,
      assetCount: scopeValue1605,
      localStorageKeyCount: Array.isArray(scopeValue1602) ? scopeValue1602.length : 0,
      approximateBytes: scopeValue56({
        stores: scopeValue1601,
        localStorage: scopeValue1602
      })
    };
  }
  async function scopeValue234(scopeValue1608) {
    scopeValue51(scopeValue1608, "准备导出数据...", 0);
    const scopeValue1609 = {};
    const scopeValue1610 = scopeValue10;
    for (let scopeValue1614 = 0; scopeValue1614 < scopeValue1610.length; scopeValue1614 += 1) {
      const scopeValue1615 = scopeValue1610[scopeValue1614];
      const scopeValue1616 = Math.floor(scopeValue1614 / scopeValue1610.length * 82);
      scopeValue51(scopeValue1608, `读取 ${scopeValue1615}...`, scopeValue1616);
      const scopeValue1617 = await scopeValue87(scopeValue1615);
      const scopeValue1618 = [];
      for (let scopeValue1619 = 0; scopeValue1619 < scopeValue1617.length; scopeValue1619 += 1) {
        scopeValue1618.push(await scopeValue231(scopeValue1615, scopeValue1617[scopeValue1619]));
        if ((scopeValue1615 === scopeValue9.assets || scopeValue1615 === scopeValue9.imMessages) && scopeValue1619 > 0 && scopeValue1619 % 20 === 0) {
          const scopeValue1620 = Math.floor(scopeValue1619 / scopeValue1617.length * (82 / scopeValue1610.length));
          scopeValue51(scopeValue1608, `处理 ${scopeValue1615} (${scopeValue1619}/${scopeValue1617.length})...`, scopeValue1616 + scopeValue1620);
        }
      }
      scopeValue1609[scopeValue1615] = scopeValue1618;
    }
    scopeValue51(scopeValue1608, "校验 IndexedDB 数据...", 86);
    const scopeValue1611 = [];
    const scopeValue1612 = {
      stores: scopeValue1609,
      localStorage: scopeValue1611
    };
    const scopeValue1613 = scopeValue233(scopeValue1609, scopeValue1611);
    return {
      app: scopeValue6,
      schemaVersion: scopeValue5,
      version: scopeValue5,
      exportedAt: Date.now(),
      stores: scopeValue1609,
      localStorage: scopeValue1611,
      stats: scopeValue1613,
      checksum: {
        algorithm: "fnv1a32",
        value: scopeValue57(scopeValue1612)
      }
    };
  }
  async function scopeValue235(scopeValue1621, scopeValue1622) {
    scopeValue51(scopeValue1622, "生成备份文件...", 95);
    return new Blob([JSON.stringify(scopeValue1621)], {
      type: "application/json"
    });
  }
  function scopeValue236() {
    return Object.fromEntries(scopeValue15.map(scopeValue1623 => [scopeValue1623, []]));
  }
  function scopeValue237(scopeValue1624 = {}) {
    return {
      app: scopeValue1624.app,
      backupType: scopeValue1624.backupType,
      formatVersion: scopeValue1624.formatVersion,
      schemaVersion: scopeValue1624.schemaVersion,
      stores: scopeValue1624.stores
    };
  }
  function scopeValue238(scopeValue1625 = {}) {
    const scopeValue1626 = scopeValue1636 => Array.isArray(scopeValue1625[scopeValue1636]) ? scopeValue1625[scopeValue1636].length : 0;
    const scopeValue1627 = Object.fromEntries(scopeValue15.map(scopeValue1637 => [scopeValue1637, scopeValue1626(scopeValue1637)]));
    const scopeValue1628 = scopeValue1626(scopeValue9.imFriends);
    const scopeValue1629 = scopeValue1626(scopeValue9.imChatSummaries);
    const scopeValue1630 = scopeValue1626(scopeValue9.imMessages);
    const scopeValue1631 = scopeValue1626(scopeValue9.imMoments);
    const scopeValue1632 = scopeValue1626(scopeValue9.imMomentMessages);
    const scopeValue1633 = scopeValue1626(scopeValue9.imStickers);
    const scopeValue1634 = scopeValue1626(scopeValue9.assets);
    const scopeValue1635 = scopeValue1628 + scopeValue1629 + scopeValue1630 + scopeValue1631 + scopeValue1632 + scopeValue1633 + scopeValue1626(scopeValue9.appDomains) + scopeValue1626(scopeValue9.meta);
    return {
      stores: scopeValue1627,
      storeCount: scopeValue15.length,
      recordCount: scopeValue1635,
      assetCount: scopeValue1634,
      friendCount: scopeValue1628,
      chatSummaryCount: scopeValue1629,
      messageCount: scopeValue1630,
      momentCount: scopeValue1631,
      momentMessageCount: scopeValue1632,
      stickerCategoryCount: scopeValue1633,
      approximateBytes: scopeValue56({
        stores: scopeValue1625
      })
    };
  }
  function scopeValue239(scopeValue1638 = {}) {
    const scopeValue1639 = scopeValue1638 && typeof scopeValue1638 === "object" ? scopeValue1638 : {};
    const scopeValue1640 = scopeValue1639.stores && typeof scopeValue1639.stores === "object" ? scopeValue1639.stores : {};
    const scopeValue1641 = scopeValue1639.stats && typeof scopeValue1639.stats === "object" ? scopeValue1639.stats : scopeValue238(scopeValue1640);
    return {
      app: scopeValue1639.app || scopeValue6,
      backupType: scopeValue11,
      formatVersion: Number(scopeValue1639.formatVersion) || 0,
      schemaVersion: Number(scopeValue1639.schemaVersion || scopeValue1639.version) || 0,
      exportedAt: Number(scopeValue1639.exportedAt) || 0,
      storeCount: Number(scopeValue1641.storeCount) || scopeValue15.length,
      recordCount: Number(scopeValue1641.recordCount) || 0,
      assetCount: Number(scopeValue1641.assetCount) || 0,
      friendCount: Number(scopeValue1641.friendCount) || 0,
      chatSummaryCount: Number(scopeValue1641.chatSummaryCount) || 0,
      messageCount: Number(scopeValue1641.messageCount) || 0,
      momentCount: Number(scopeValue1641.momentCount) || 0,
      momentMessageCount: Number(scopeValue1641.momentMessageCount) || 0,
      stickerCategoryCount: Number(scopeValue1641.stickerCategoryCount) || 0,
      approximateBytes: Number(scopeValue1641.approximateBytes) || scopeValue56(scopeValue1639),
      checksum: scopeValue1639.checksum?.value || ""
    };
  }
  function scopeValue240(scopeValue1642, scopeValue1643, scopeValue1644) {
    if (!scopeValue1643 || typeof scopeValue1643 !== "object" || Array.isArray(scopeValue1643)) {
      throw new Error(`Invalid iMessage backup record ${scopeValue1642}[${scopeValue1644}].`);
    }
    const scopeValue1645 = scopeValue259[scopeValue1642];
    if (scopeValue1643[scopeValue1645] === undefined || scopeValue1643[scopeValue1645] === null || scopeValue1643[scopeValue1645] === "") {
      throw new Error(`iMessage backup record ${scopeValue1642}[${scopeValue1644}] is missing ${scopeValue1645}.`);
    }
  }
  function scopeValue241(scopeValue1646 = {}) {
    const scopeValue1647 = scopeValue156([...scopeValue13.map(scopeValue1649 => scopeValue1646[scopeValue1649]), scopeValue1646[scopeValue9.appDomains]]);
    const scopeValue1648 = Array.isArray(scopeValue1646[scopeValue9.meta]) ? scopeValue1646[scopeValue9.meta][0] : null;
    if (typeof scopeValue1648?.value === "string" && scopeValue1648.value) scopeValue1647.add(scopeValue1648.value);
    return scopeValue158(scopeValue1647);
  }
  function scopeValue242(scopeValue1650 = {}) {
    if (!scopeValue1650 || typeof scopeValue1650 !== "object") {
      throw new Error("Invalid iMessage backup payload.");
    }
    if (scopeValue1650.backupType !== scopeValue11) {
      throw new Error("This file is not an iMessage backup.");
    }
    if (scopeValue1650.app !== scopeValue6) {
      throw new Error("Unsupported iMessage backup application.");
    }
    if (Number(scopeValue1650.formatVersion) !== scopeValue12) {
      throw new Error(`Unsupported iMessage backup format version: ${scopeValue1650.formatVersion}.`);
    }
    if (!scopeValue1650.stores || typeof scopeValue1650.stores !== "object" || Array.isArray(scopeValue1650.stores)) {
      throw new Error("iMessage backup stores are missing.");
    }
    if (scopeValue1650.checksum?.algorithm !== "fnv1a32" || !scopeValue1650.checksum?.value) {
      throw new Error("iMessage backup checksum is missing.");
    }
    if (scopeValue57(scopeValue237(scopeValue1650)) !== scopeValue1650.checksum.value) {
      throw new Error("iMessage backup checksum mismatch.");
    }
    const scopeValue1651 = scopeValue236();
    scopeValue15.forEach(scopeValue1659 => {
      if (!Array.isArray(scopeValue1650.stores[scopeValue1659])) {
        throw new Error(`iMessage backup store ${scopeValue1659} is missing.`);
      }
    });
    if (scopeValue1650.stores[scopeValue9.appDomains].length > 1 || scopeValue1650.stores[scopeValue9.meta].length > 1) {
      throw new Error("iMessage backup contains duplicate scoped records.");
    }
    const scopeValue1652 = [];
    scopeValue15.forEach(scopeValue1660 => {
      const scopeValue1661 = new Set();
      scopeValue1650.stores[scopeValue1660].forEach((scopeValue1662, scopeValue1663) => {
        const scopeValue1664 = (scopeValue1660 === scopeValue9.appDomains || scopeValue1660 === scopeValue9.meta) && scopeValue1662 && typeof scopeValue1662 === "object" && !Array.isArray(scopeValue1662) && Object.keys(scopeValue1662).length === 0;
        if (scopeValue1664) {
          const scopeValue1667 = scopeValue1660 === scopeValue9.appDomains ? "iMessage 界面状态" : "朋友圈封面";
          scopeValue1652.push(`旧版备份未包含${scopeValue1667}，导入后将恢复默认。`);
          return;
        }
        scopeValue240(scopeValue1660, scopeValue1662, scopeValue1663);
        const scopeValue1665 = scopeValue259[scopeValue1660];
        const scopeValue1666 = String(scopeValue1662[scopeValue1665]);
        if (scopeValue1661.has(scopeValue1666)) throw new Error(`iMessage backup contains duplicate ${scopeValue1660} key ${scopeValue1666}.`);
        scopeValue1661.add(scopeValue1666);
        if (scopeValue1660 === scopeValue9.appDomains && scopeValue1662.name !== "imessage") {
          throw new Error("iMessage backup contains an out-of-scope app domain.");
        }
        if (scopeValue1660 === scopeValue9.meta && scopeValue1662.key !== scopeValue16.imMomentsCoverAssetId) {
          throw new Error("iMessage backup contains an out-of-scope metadata record.");
        }
        if (scopeValue1660 === scopeValue9.assets && (typeof scopeValue1662.dataUrl !== "string" || !scopeValue1662.dataUrl)) {
          throw new Error(`iMessage backup asset ${scopeValue1666} is missing image data.`);
        }
        scopeValue1651[scopeValue1660].push(scopeValue262(scopeValue1660, scopeValue1662, scopeValue1663));
      });
    });
    const scopeValue1653 = scopeValue241(scopeValue1651);
    const scopeValue1654 = new Set(scopeValue1651[scopeValue9.assets].map(scopeValue1668 => String(scopeValue1668?.id || "")).filter(Boolean));
    for (const scopeValue1669 of scopeValue1653) {
      if (!scopeValue1654.has(scopeValue1669)) {
        throw new Error(`iMessage backup references missing local asset ${scopeValue1669}.`);
      }
    }
    for (const scopeValue1670 of scopeValue1654) {
      if (!scopeValue1653.includes(scopeValue1670)) {
        throw new Error(`iMessage backup contains unreferenced local asset ${scopeValue1670}.`);
      }
    }
    const scopeValue1655 = scopeValue238(scopeValue1651);
    const scopeValue1656 = Number(scopeValue1650.stats?.approximateBytes) || 0;
    if (scopeValue1656 > 0) scopeValue1655.approximateBytes = scopeValue1656;
    const scopeValue1657 = {
      app: scopeValue6,
      backupType: scopeValue11,
      formatVersion: scopeValue12,
      schemaVersion: Number(scopeValue1650.schemaVersion || scopeValue1650.version) || scopeValue5,
      version: Number(scopeValue1650.schemaVersion || scopeValue1650.version) || scopeValue5,
      exportedAt: Number(scopeValue1650.exportedAt) || 0,
      stores: scopeValue1651,
      stats: scopeValue1655,
      checksum: scopeValue47(scopeValue1650.checksum)
    };
    const scopeValue1658 = scopeValue239(scopeValue1657);
    if (scopeValue1652.length > 0) scopeValue1658.compatibilityWarnings = scopeValue1652.slice();
    return {
      format: scopeValue11,
      payload: scopeValue1657,
      summary: scopeValue1658,
      referencedAssetIds: scopeValue1653,
      compatibilityWarnings: scopeValue1652
    };
  }
  function scopeValue243(scopeValue1671 = {}) {
    return scopeValue242(scopeValue1671).summary;
  }
  async function scopeValue244(scopeValue1672) {
    scopeValue51(scopeValue1672, "准备导出 iMessage 数据...", 0);
    const scopeValue1673 = scopeValue236();
    for (let scopeValue1681 = 0; scopeValue1681 < scopeValue13.length; scopeValue1681 += 1) {
      const scopeValue1682 = scopeValue13[scopeValue1681];
      scopeValue51(scopeValue1672, `读取 ${scopeValue1682}...`, Math.floor(scopeValue1681 / scopeValue13.length * 58));
      const scopeValue1683 = await scopeValue87(scopeValue1682);
      scopeValue1673[scopeValue1682] = await Promise.all(scopeValue1683.map(scopeValue1684 => scopeValue231(scopeValue1682, scopeValue1684)));
    }
    scopeValue51(scopeValue1672, "读取 iMessage 界面状态...", 62);
    const [scopeValue1674, scopeValue1675] = await Promise.all([scopeValue84(scopeValue9.appDomains, "imessage"), scopeValue84(scopeValue9.meta, scopeValue16.imMomentsCoverAssetId)]);
    if (scopeValue1674) {
      scopeValue1673[scopeValue9.appDomains] = [await scopeValue231(scopeValue9.appDomains, scopeValue1674)];
    }
    if (scopeValue1675) {
      scopeValue1673[scopeValue9.meta] = [await scopeValue231(scopeValue9.meta, scopeValue1675)];
    }
    const scopeValue1676 = new Set(scopeValue241(scopeValue1673));
    scopeValue51(scopeValue1672, "整理 iMessage 本地资源...", 70);
    const scopeValue1677 = await scopeValue87(scopeValue9.assets);
    const scopeValue1678 = scopeValue1677.filter(scopeValue1685 => scopeValue1676.has(String(scopeValue1685?.id || "")));
    const scopeValue1679 = new Set(scopeValue1678.map(scopeValue1686 => String(scopeValue1686?.id || "")).filter(Boolean));
    for (const scopeValue1687 of scopeValue1676) {
      if (!scopeValue1679.has(scopeValue1687)) {
        throw new Error(`iMessage data references missing local asset ${scopeValue1687}.`);
      }
    }
    for (let scopeValue1688 = 0; scopeValue1688 < scopeValue1678.length; scopeValue1688 += 1) {
      scopeValue1673[scopeValue9.assets].push(await scopeValue231(scopeValue9.assets, scopeValue1678[scopeValue1688]));
      if (scopeValue1688 > 0 && scopeValue1688 % 20 === 0) {
        scopeValue51(scopeValue1672, `处理本地资源 (${scopeValue1688}/${scopeValue1678.length})...`, 70 + Math.floor(scopeValue1688 / scopeValue1678.length * 20));
      }
    }
    const scopeValue1680 = {
      app: scopeValue6,
      backupType: scopeValue11,
      formatVersion: scopeValue12,
      schemaVersion: scopeValue5,
      version: scopeValue5,
      exportedAt: Date.now(),
      stores: scopeValue1673,
      stats: scopeValue238(scopeValue1673)
    };
    scopeValue1680.checksum = {
      algorithm: "fnv1a32",
      value: scopeValue57(scopeValue237(scopeValue1680))
    };
    return scopeValue1680;
  }
  async function scopeValue245(scopeValue1689) {
    scopeValue51(scopeValue1689, "正在完成待保存数据...", 0);
    if (!(await scopeValue116())) throw new Error("Pending writes could not be completed before export.");
    const scopeValue1690 = await scopeValue244(scopeValue1689);
    const scopeValue1691 = await scopeValue235(scopeValue1690, scopeValue1689);
    scopeValue51(scopeValue1689, "iMessage 备份导出完成", 100);
    return scopeValue1691;
  }
  async function scopeValue246() {
    const scopeValue1692 = await scopeValue87(scopeValue9.imFriends);
    return scopeValue1692.filter(scopeValue1693 => scopeValue1693?.type === "char").map(scopeValue1694 => ({
      id: String(scopeValue1694.id),
      name: String(scopeValue1694.nickname || scopeValue1694.realName || "未命名 Char")
    })).sort((scopeValue1695, scopeValue1696) => scopeValue1695.name.localeCompare(scopeValue1696.name, "zh-CN") || scopeValue1695.id.localeCompare(scopeValue1696.id));
  }
  function scopeValue247(scopeValue1697, scopeValue1698 = 0) {
    if (scopeValue1698 > 5 || scopeValue1697 == null) return null;
    if (typeof scopeValue1697 === "string") return /^(?:data:|blob:)/i.test(scopeValue1697) ? null : scopeValue1697;
    if (typeof scopeValue1697 === "number" || typeof scopeValue1697 === "boolean") return scopeValue1697;
    if (Array.isArray(scopeValue1697)) return scopeValue1697.map(scopeValue1700 => scopeValue247(scopeValue1700, scopeValue1698 + 1)).filter(scopeValue1701 => scopeValue1701 !== null);
    if (typeof scopeValue1697 !== "object") return null;
    const scopeValue1699 = {};
    for (const [scopeValue1702, scopeValue1703] of Object.entries(scopeValue1697)) {
      if (/(?:url|asset|image|audio|blob|base64|thumbnail|cover|file)/i.test(scopeValue1702)) continue;
      const scopeValue1704 = scopeValue247(scopeValue1703, scopeValue1698 + 1);
      if (scopeValue1704 !== null) scopeValue1699[scopeValue1702] = scopeValue1704;
    }
    return scopeValue1699;
  }
  function scopeValue248(scopeValue1705) {
    const scopeValue1706 = /^(?:image|voice|voice_message|audio|video|sticker|file)$/i.test(String(scopeValue1705.type || ""));
    const scopeValue1707 = ["id", "order", "role", "type", "timestamp", "content", "text", "transcript", "translation", "replyTo", "senderName", "speaker", "dateText", "title", "description", "statusText", "noticeKind", "familyCardSpend", "familyCardId", "familyCardStatus", "paymentAction", "previousLimit", "shopGift", "giftName", "giftValue", "giftDescription", "giftStatus", "giftPaymentMethod", "remarkChange", "offlineMode", "offlineScene", "offlineAction", "offlineSessionId", "endedAt", "duration", "callMessages", "summary", "rawSummary", "requestStatus", "memoryRequestId", "memoryPayload", "decidedAt", "excludedFromContext", "deliveryStatus", "locationName", "locationAddress", "locationNameTranslation", "locationAddressTranslation", "stickerName", "contactName", "contactRealName", "payKind", "amount", "status", "payload", "invitationText", "place", "inviteStatus", "respondedAt"];
    const scopeValue1708 = {};
    for (const scopeValue1709 of scopeValue1707) {
      if (!Object.prototype.hasOwnProperty.call(scopeValue1705, scopeValue1709)) continue;
      const scopeValue1710 = scopeValue1705[scopeValue1709];
      if (scopeValue1706 && scopeValue1709 === "content" && typeof scopeValue1710 === "string" && /^(?:https?:|data:|blob:)/i.test(scopeValue1710)) continue;
      const scopeValue1711 = scopeValue247(scopeValue1710);
      if (scopeValue1711 !== null) scopeValue1708[scopeValue1709] = scopeValue1711;
    }
    if (scopeValue1706) scopeValue1708.mediaOmitted = true;
    return scopeValue1708;
  }
  function scopeValue249(scopeValue1712) {
    return (Array.isArray(scopeValue1712) ? scopeValue1712 : []).filter(scopeValue1713 => scopeValue1713 && typeof scopeValue1713 === "object" && !["offline_generated_image", "image", "audio", "voice", "video", "file", "sticker"].includes(String(scopeValue1713.type || ""))).map(scopeValue1714 => scopeValue247(scopeValue1714)).filter(Boolean);
  }
  function scopeValue250(scopeValue1715) {
    return {
      messages: scopeValue249(scopeValue1715.offlineMessages),
      meetingSessions: (Array.isArray(scopeValue1715.offlineMeetingSessions) ? scopeValue1715.offlineMeetingSessions : []).filter(scopeValue1716 => scopeValue1716 && typeof scopeValue1716 === "object").map(scopeValue1717 => {
        const {
          messages: scopeValue1718,
          ...scopeValue1719
        } = scopeValue1717;
        return {
          ...scopeValue247(scopeValue1719),
          messages: scopeValue249(scopeValue1718)
        };
      }),
      meetingActive: scopeValue1715.offlineMeetingActive === true,
      currentSessionId: typeof scopeValue1715.offlineCurrentSessionId === "string" ? scopeValue1715.offlineCurrentSessionId : null,
      meetingStartedAt: Number.isFinite(Number(scopeValue1715.offlineMeetingStartedAt)) && scopeValue1715.offlineMeetingStartedAt != null ? Number(scopeValue1715.offlineMeetingStartedAt) : null,
      invitationContext: scopeValue1715.offlineInvitationContext && typeof scopeValue1715.offlineInvitationContext === "object" ? scopeValue247(scopeValue1715.offlineInvitationContext) : null
    };
  }
  async function scopeValue251(scopeValue1720 = null, scopeValue1721) {
    if (!(await scopeValue116())) throw new Error("Pending writes could not be completed before export.");
    const scopeValue1722 = await scopeValue87(scopeValue9.imFriends);
    const scopeValue1723 = scopeValue1722.filter(scopeValue1726 => scopeValue1726?.type === "char" && (scopeValue1720 == null || String(scopeValue1726.id) === String(scopeValue1720)));
    if (scopeValue1723.length === 0) throw new Error(scopeValue1720 == null ? "没有可导出的 Char" : "找不到所选 Char");
    scopeValue1723.sort((scopeValue1727, scopeValue1728) => String(scopeValue1727.id).localeCompare(String(scopeValue1728.id)));
    const scopeValue1724 = Date.now();
    const scopeValue1725 = ["{\"app\":\"u2phone\",\"exportType\":\"char-chat-memory-lite\",\"formatVersion\":2,\"exportedAt\":", String(scopeValue1724), ",\"chars\":["];
    for (let scopeValue1729 = 0; scopeValue1729 < scopeValue1723.length; scopeValue1729 += 1) {
      const scopeValue1730 = scopeValue1723[scopeValue1729];
      const scopeValue1731 = String(scopeValue1730.id);
      scopeValue51(scopeValue1721, `读取 ${scopeValue1730.nickname || scopeValue1730.realName || "未命名 Char"} 的聊天...`, Math.floor(scopeValue1729 / scopeValue1723.length * 90));
      const scopeValue1732 = await scopeValue83([scopeValue9.imMessages], "readonly", scopeValue1733 => scopeValue77(scopeValue1733[scopeValue9.imMessages].index("friendId").getAll(IDBKeyRange.only(scopeValue1731))));
      scopeValue1732.sort((scopeValue1734, scopeValue1735) => (Number(scopeValue1734.order) || 0) - (Number(scopeValue1735.order) || 0) || (Number(scopeValue1734.timestamp) || 0) - (Number(scopeValue1735.timestamp) || 0));
      if (scopeValue1729) scopeValue1725.push(",");
      scopeValue1725.push("{\"id\":", JSON.stringify(scopeValue1731), ",\"name\":", JSON.stringify(String(scopeValue1730.nickname || scopeValue1730.realName || "未命名 Char")), ",\"memory\":", JSON.stringify(scopeValue1730.memory || {}), ",\"persona\":", JSON.stringify(String(scopeValue1730.persona || "")), ",\"offline\":", JSON.stringify(scopeValue250(scopeValue1730)), ",\"messages\":[");
      for (let scopeValue1736 = 0; scopeValue1736 < scopeValue1732.length; scopeValue1736 += 1) {
        if (scopeValue1736) scopeValue1725.push(",");
        scopeValue1725.push(JSON.stringify(scopeValue248(scopeValue1732[scopeValue1736])));
        if (scopeValue1736 > 0 && scopeValue1736 % 100 === 0) {
          scopeValue51(scopeValue1721, `整理聊天记录 (${scopeValue1729 + 1}/${scopeValue1723.length})...`, Math.min(90, Math.floor((scopeValue1729 + scopeValue1736 / scopeValue1732.length) / scopeValue1723.length * 90)));
          await new Promise(scopeValue1737 => setTimeout(scopeValue1737, 0));
        }
      }
      scopeValue1725.push("]}");
      await new Promise(scopeValue1738 => setTimeout(scopeValue1738, 0));
    }
    scopeValue1725.push("]}");
    scopeValue51(scopeValue1721, "轻量导出已准备完成", 100);
    return new Blob(scopeValue1725, {
      type: "application/json"
    });
  }
  function scopeValue252(scopeValue1739) {
    const scopeValue1740 = Number(scopeValue1739?.formatVersion);
    if (!scopeValue1739 || scopeValue1739.app !== scopeValue6 || scopeValue1739.exportType !== "char-chat-memory-lite" || ![1, 2].includes(scopeValue1740) || !Array.isArray(scopeValue1739.chars) || scopeValue1739.chars.length === 0) {
      throw new Error("这不是有效的 Char 轻量备份");
    }
    const scopeValue1741 = new Set();
    const scopeValue1742 = new Set();
    let scopeValue1743 = 0;
    let scopeValue1744 = 0;
    let scopeValue1745 = 0;
    const scopeValue1746 = scopeValue1739.chars.map(scopeValue1747 => {
      const scopeValue1748 = String(scopeValue1747?.id || "").trim();
      if (!scopeValue1748 || scopeValue1741.has(scopeValue1748) || typeof scopeValue1747.name !== "string" || !scopeValue1747.memory || typeof scopeValue1747.memory !== "object" || Array.isArray(scopeValue1747.memory) || !Array.isArray(scopeValue1747.messages)) throw new Error("Char 轻量备份中的角色数据无效");
      if (scopeValue1740 === 2 && (typeof scopeValue1747.persona !== "string" || !scopeValue1747.offline || typeof scopeValue1747.offline !== "object" || Array.isArray(scopeValue1747.offline) || !Array.isArray(scopeValue1747.offline.messages) || !Array.isArray(scopeValue1747.offline.meetingSessions) || typeof scopeValue1747.offline.meetingActive !== "boolean" || scopeValue1747.offline.currentSessionId != null && typeof scopeValue1747.offline.currentSessionId !== "string" || scopeValue1747.offline.meetingStartedAt != null && !Number.isFinite(Number(scopeValue1747.offline.meetingStartedAt)))) {
        throw new Error("Char 轻量备份中的人设或线下记录无效");
      }
      scopeValue1741.add(scopeValue1748);
      const scopeValue1749 = scopeValue1747.messages.map((scopeValue1751, scopeValue1752) => {
        const scopeValue1753 = String(scopeValue1751?.id || "").trim();
        if (!scopeValue1753 || scopeValue1742.has(scopeValue1753) || typeof scopeValue1751.type !== "string" || typeof scopeValue1751.role !== "string" || !Number.isFinite(Number(scopeValue1751.timestamp))) {
          throw new Error("Char 轻量备份中的聊天记录无效");
        }
        scopeValue1742.add(scopeValue1753);
        const scopeValue1754 = scopeValue248(scopeValue1751);
        scopeValue1754.id = scopeValue1753;
        scopeValue1754.order = Number.isFinite(Number(scopeValue1751.order)) ? Number(scopeValue1751.order) : scopeValue1752;
        if (scopeValue1751.mediaOmitted === true) {
          const scopeValue1755 = {
            image: "图片",
            voice: "语音",
            voice_message: "语音",
            audio: "音频",
            video: "视频",
            sticker: "表情",
            file: "文件"
          }[scopeValue1751.type] || "媒体";
          const scopeValue1756 = String(scopeValue1754.transcript || scopeValue1754.text || scopeValue1754.stickerName || "").trim();
          scopeValue1754.type = "text";
          scopeValue1754.content = `[${scopeValue1755}未包含在轻量备份中]${scopeValue1756 ? ` ${scopeValue1756}` : ""}`;
        }
        return scopeValue171(scopeValue1748, scopeValue1754, scopeValue1754.order);
      });
      scopeValue1749.sort((scopeValue1757, scopeValue1758) => scopeValue1757.order - scopeValue1758.order || scopeValue1757.timestamp - scopeValue1758.timestamp);
      scopeValue1743 += scopeValue1749.length;
      let scopeValue1750 = null;
      if (scopeValue1740 === 2) {
        if (scopeValue1747.offline.meetingSessions.some(scopeValue1759 => !scopeValue1759 || typeof scopeValue1759 !== "object" || Array.isArray(scopeValue1759) || !Array.isArray(scopeValue1759.messages))) {
          throw new Error("Char 轻量备份中的历史见面记录无效");
        }
        scopeValue1750 = scopeValue250({
          offlineMessages: scopeValue1747.offline.messages,
          offlineMeetingSessions: scopeValue1747.offline.meetingSessions,
          offlineMeetingActive: scopeValue1747.offline.meetingActive,
          offlineCurrentSessionId: scopeValue1747.offline.currentSessionId,
          offlineMeetingStartedAt: scopeValue1747.offline.meetingStartedAt,
          offlineInvitationContext: scopeValue1747.offline.invitationContext
        });
        scopeValue1744 += scopeValue1750.meetingSessions.length;
        scopeValue1745 += scopeValue1750.messages.length + scopeValue1750.meetingSessions.reduce((scopeValue1760, scopeValue1761) => scopeValue1760 + scopeValue1761.messages.length, 0);
      }
      return {
        id: scopeValue1748,
        name: scopeValue1747.name.trim() || "未命名 Char",
        memory: scopeValue49(scopeValue47(scopeValue1747.memory)),
        messages: scopeValue1749,
        persona: scopeValue1740 === 2 ? scopeValue1747.persona : null,
        offline: scopeValue1750 ? scopeValue49(scopeValue1750) : null
      };
    });
    return {
      chars: scopeValue1746,
      summary: {
        formatVersion: scopeValue1740,
        charCount: scopeValue1746.length,
        messageCount: scopeValue1743,
        offlineSessionCount: scopeValue1744,
        offlineMessageCount: scopeValue1745,
        exportedAt: Number(scopeValue1739.exportedAt) || 0
      }
    };
  }
  function scopeValue253(scopeValue1762) {
    return scopeValue252(scopeValue1762).summary;
  }
  async function scopeValue254(scopeValue1763, scopeValue1764) {
    const {
      chars: scopeValue1765,
      summary: scopeValue1766
    } = scopeValue252(scopeValue1763);
    if (!(await scopeValue116())) throw new Error("Pending writes could not be completed before import.");
    const scopeValue1767 = new Set(scopeValue1765.map(scopeValue1770 => scopeValue1770.id));
    scopeValue51(scopeValue1764, "正在校验轻量备份与现有 Char...", 10);
    const scopeValue1768 = await Promise.all(scopeValue1765.map(async scopeValue1771 => ({
      ...scopeValue1771,
      chatSummary: scopeValue188(scopeValue1771.id, await scopeValue186(scopeValue1771.messages))
    })));
    const scopeValue1769 = await scopeValue83([scopeValue9.imFriends], "readonly", scopeValue1772 => Promise.all(scopeValue1768.map(scopeValue1773 => scopeValue77(scopeValue1772[scopeValue9.imFriends].get(scopeValue1773.id)))));
    if (scopeValue1769.some(scopeValue1774 => scopeValue1774 && scopeValue1774.type !== "char")) {
      throw new Error("备份中的 Char ID 与现有非 Char 联系人冲突");
    }
    await scopeValue113(() => scopeValue83([scopeValue9.imFriends, scopeValue9.imMessages, scopeValue9.imChatSummaries], "readwrite", async (scopeValue1775, scopeValue1776) => {
      try {
        const scopeValue1777 = await Promise.all(scopeValue1768.map(scopeValue1781 => scopeValue77(scopeValue1775[scopeValue9.imFriends].get(scopeValue1781.id))));
        if (scopeValue1777.some(scopeValue1782 => scopeValue1782 && scopeValue1782.type !== "char")) {
          throw new Error("备份中的 Char ID 与现有非 Char 联系人冲突");
        }
        const scopeValue1778 = scopeValue1768.flatMap(scopeValue1783 => scopeValue1783.messages);
        const scopeValue1779 = await Promise.all(scopeValue1778.map(scopeValue1784 => scopeValue77(scopeValue1775[scopeValue9.imMessages].get(scopeValue1784.id))));
        if (scopeValue1779.some(scopeValue1785 => scopeValue1785 && !scopeValue1767.has(String(scopeValue1785.friendId)))) {
          throw new Error("备份消息 ID 与其他聊天冲突，当前数据未修改");
        }
        const scopeValue1780 = await Promise.all(scopeValue1768.map(scopeValue1786 => scopeValue77(scopeValue1775[scopeValue9.imMessages].index("friendId").getAll(IDBKeyRange.only(scopeValue1786.id)))));
        scopeValue51(scopeValue1764, "正在恢复 Char 聊天与记忆...", 55);
        scopeValue1768.forEach((scopeValue1787, scopeValue1788) => {
          scopeValue1780[scopeValue1788].forEach(scopeValue1791 => scopeValue1775[scopeValue9.imMessages].delete(scopeValue1791.id));
          scopeValue1787.messages.forEach(scopeValue1792 => scopeValue1775[scopeValue9.imMessages].put(scopeValue1792));
          const scopeValue1789 = scopeValue1777[scopeValue1788];
          const scopeValue1790 = scopeValue1787.offline ? {
            persona: scopeValue1787.persona,
            offlineMessages: scopeValue1787.offline.messages,
            offlineMeetingSessions: scopeValue1787.offline.meetingSessions,
            offlineMeetingActive: scopeValue1787.offline.meetingActive,
            offlineCurrentSessionId: scopeValue1787.offline.currentSessionId,
            offlineMeetingStartedAt: scopeValue1787.offline.meetingStartedAt,
            offlineInvitationContext: scopeValue1787.offline.invitationContext
          } : {};
          scopeValue1775[scopeValue9.imFriends].put(scopeValue1789 ? {
            ...scopeValue1789,
            memory: scopeValue1787.memory,
            ...scopeValue1790,
            updatedAt: Date.now()
          } : {
            id: scopeValue1787.id,
            type: "char",
            nickname: scopeValue1787.name,
            memory: scopeValue1787.memory,
            ...scopeValue1790,
            updatedAt: Date.now()
          });
          scopeValue1775[scopeValue9.imChatSummaries].put(scopeValue1787.chatSummary);
        });
      } catch (scopeValue1793) {
        try {
          scopeValue1776.abort();
        } catch (scopeValue1794) {}
        throw scopeValue1793;
      }
    }));
    scopeValue51(scopeValue1764, "轻量备份导入完成", 100);
    return scopeValue1766;
  }
  async function scopeValue255(scopeValue1795, scopeValue1796) {
    const scopeValue1797 = scopeValue1795.clear();
    if (!scopeValue1797) throw new Error("Failed to clear iMessage backup target store.");
    await scopeValue77(scopeValue1797);
    for (const scopeValue1798 of scopeValue1796) {
      const scopeValue1799 = scopeValue1795.put(scopeValue49(scopeValue47(scopeValue1798)));
      if (!scopeValue1799) throw new Error("Failed to write iMessage backup record.");
      await scopeValue77(scopeValue1799);
    }
  }
  async function scopeValue256(scopeValue1800 = {}, scopeValue1801) {
    const scopeValue1802 = scopeValue242(scopeValue1800);
    const scopeValue1803 = scopeValue1802.payload;
    scopeValue51(scopeValue1801, "正在校验 iMessage 备份...", 6);
    const scopeValue1804 = scopeValue56(scopeValue1803);
    if (navigator.storage?.estimate) {
      const scopeValue1808 = await navigator.storage.estimate();
      const scopeValue1809 = Math.max(0, Number(scopeValue1808?.usage) || 0);
      const scopeValue1810 = Math.max(0, Number(scopeValue1808?.quota) || 0);
      const scopeValue1811 = Math.max(4 * 1024 * 1024, Math.ceil(scopeValue1804 * 1.2));
      if (scopeValue1810 > 0 && Math.max(0, scopeValue1810 - scopeValue1809) < scopeValue1811) {
        throw new DOMException(`安全导入需要约 ${scopeValue286(scopeValue1811)} 的临时空间。`, "QuotaExceededError");
      }
    }
    if (!(await scopeValue116())) throw new Error("Pending writes could not be completed before import.");
    scopeValue33 = true;
    const scopeValue1805 = scopeValue157();
    const scopeValue1806 = Array.from(new Set([...scopeValue15, scopeValue9.vectorMemoryIndex, ...scopeValue1805]));
    let scopeValue1807 = [];
    try {
      scopeValue51(scopeValue1801, "正在替换 iMessage 数据...", 18);
      const scopeValue1812 = await scopeValue113(() => scopeValue83(scopeValue1806, "readwrite", async (scopeValue1814, scopeValue1815) => {
        try {
          const [scopeValue1816, scopeValue1817, scopeValue1818] = await Promise.all([Promise.all(scopeValue13.map(scopeValue1825 => scopeValue77(scopeValue1814[scopeValue1825].getAll()))), scopeValue77(scopeValue1814[scopeValue9.appDomains].get("imessage")), scopeValue77(scopeValue1814[scopeValue9.meta].get(scopeValue16.imMomentsCoverAssetId))]);
          const scopeValue1819 = scopeValue156([scopeValue1816, scopeValue1817?.value]);
          if (typeof scopeValue1818?.value === "string" && scopeValue1818.value) scopeValue1819.add(scopeValue1818.value);
          for (const scopeValue1826 of scopeValue13) {
            await scopeValue255(scopeValue1814[scopeValue1826], scopeValue1803.stores[scopeValue1826]);
          }
          const scopeValue1820 = scopeValue1803.stores[scopeValue9.appDomains][0] || null;
          if (scopeValue1820) {
            const scopeValue1827 = scopeValue1814[scopeValue9.appDomains].put(scopeValue49(scopeValue47(scopeValue1820)));
            if (!scopeValue1827) throw new Error("Failed to write iMessage interface state.");
            await scopeValue77(scopeValue1827);
          } else {
            await scopeValue77(scopeValue1814[scopeValue9.appDomains].delete("imessage"));
          }
          const scopeValue1821 = scopeValue1803.stores[scopeValue9.meta][0] || null;
          if (scopeValue1821) {
            const scopeValue1828 = scopeValue1814[scopeValue9.meta].put(scopeValue49(scopeValue47(scopeValue1821)));
            if (!scopeValue1828) throw new Error("Failed to write iMessage cover state.");
            await scopeValue77(scopeValue1828);
          } else {
            await scopeValue77(scopeValue1814[scopeValue9.meta].delete(scopeValue16.imMomentsCoverAssetId));
          }
          for (const scopeValue1829 of scopeValue1803.stores[scopeValue9.assets]) {
            const scopeValue1830 = scopeValue1814[scopeValue9.assets].put(scopeValue49(scopeValue47(scopeValue1829)));
            if (!scopeValue1830) throw new Error("Failed to write iMessage local asset.");
            await scopeValue77(scopeValue1830);
          }
          const scopeValue1822 = scopeValue1814[scopeValue9.vectorMemoryIndex].clear();
          if (!scopeValue1822) throw new Error("Failed to clear vector memory index.");
          await scopeValue77(scopeValue1822);
          scopeValue51(scopeValue1801, "正在清理旧 iMessage 本地资源...", 76);
          const scopeValue1823 = await scopeValue160(scopeValue1814, scopeValue1805);
          const scopeValue1824 = [];
          for (const scopeValue1831 of scopeValue158(scopeValue1819)) {
            if (scopeValue1823.has(scopeValue1831)) continue;
            const scopeValue1832 = await scopeValue77(scopeValue1814[scopeValue9.assets].get(scopeValue1831));
            if (!scopeValue1832) continue;
            await scopeValue77(scopeValue1814[scopeValue9.assets].delete(scopeValue1831));
            scopeValue1824.push(scopeValue1831);
          }
          return {
            releasedAssetIds: scopeValue1824
          };
        } catch (scopeValue1833) {
          try {
            scopeValue1815.abort();
          } catch (scopeValue1834) {}
          throw scopeValue1833;
        }
      }));
      scopeValue1807 = scopeValue1812.releasedAssetIds;
      scopeValue1807.forEach(scopeValue1835 => scopeValue59(scopeValue1835));
      scopeValue1803.stores[scopeValue9.assets].forEach(scopeValue1836 => scopeValue59(scopeValue1836.id));
      const scopeValue1813 = scopeValue1803.stores[scopeValue9.appDomains][0];
      if (scopeValue1813) scopeValue26.set("imessage", scopeValue47(scopeValue1813.value));else scopeValue26.delete("imessage");
      scopeValue51(scopeValue1801, "iMessage 导入完成", 100);
      return {
        ...scopeValue47(scopeValue1803.stats),
        releasedAssetIds: scopeValue1807,
        releasedAssetCount: scopeValue1807.length,
        vectorIndexCleared: true,
        compatibilityWarnings: scopeValue1802.compatibilityWarnings.slice()
      };
    } finally {
      scopeValue33 = false;
    }
  }
  function scopeValue257(scopeValue1837 = {}) {
    const scopeValue1838 = scopeValue1837 && typeof scopeValue1837 === "object" ? scopeValue1837 : {};
    const scopeValue1839 = scopeValue1838.stores && typeof scopeValue1838.stores === "object" ? scopeValue1838.stores : {};
    const scopeValue1840 = Array.isArray(scopeValue1838.localStorage) ? scopeValue1838.localStorage : [];
    const scopeValue1841 = scopeValue1838.stats && typeof scopeValue1838.stats === "object" ? scopeValue1838.stats : scopeValue233(scopeValue1839, scopeValue1840);
    return {
      app: scopeValue1838.app || scopeValue6,
      schemaVersion: Number(scopeValue1838.schemaVersion || scopeValue1838.version) || 1,
      exportedAt: Number(scopeValue1838.exportedAt) || 0,
      storeCount: Number(scopeValue1841.storeCount) || Object.keys(scopeValue1839).length,
      recordCount: Number(scopeValue1841.recordCount) || 0,
      assetCount: Number(scopeValue1841.assetCount) || 0,
      localStorageKeyCount: Number(scopeValue1841.localStorageKeyCount) || scopeValue1840.length,
      approximateBytes: Number(scopeValue1841.approximateBytes) || scopeValue56(scopeValue1838),
      checksum: scopeValue1838.checksum?.value || ""
    };
  }
  function scopeValue258(scopeValue1842 = {}) {
    if (!scopeValue1842 || typeof scopeValue1842 !== "object") {
      throw new Error("Invalid backup payload.");
    }
    if (scopeValue1842.stores && typeof scopeValue1842.stores === "object") {
      const scopeValue1844 = scopeValue1842.checksum?.value;
      if (scopeValue1844) {
        const scopeValue1847 = scopeValue57({
          stores: scopeValue1842.stores,
          localStorage: Array.isArray(scopeValue1842.localStorage) ? scopeValue1842.localStorage : []
        });
        if (scopeValue1847 !== scopeValue1844) {
          throw new Error("Backup checksum mismatch.");
        }
      }
      const scopeValue1845 = {
        ...scopeValue1842.stores
      };
      scopeValue10.forEach(scopeValue1848 => {
        scopeValue1845[scopeValue1848] = Array.isArray(scopeValue1842.stores[scopeValue1848]) ? scopeValue1842.stores[scopeValue1848] : [];
      });
      const scopeValue1846 = {
        ...scopeValue1842,
        stores: scopeValue1845,
        localStorage: Array.isArray(scopeValue1842.localStorage) ? scopeValue1842.localStorage : []
      };
      return {
        format: "snapshot",
        payload: scopeValue1846,
        summary: scopeValue257(scopeValue1846)
      };
    }
    const scopeValue1843 = ["friends", "messages", "moments", "momentMessages", "stickers", "momentsCoverUrl"].some(scopeValue1849 => Object.prototype.hasOwnProperty.call(scopeValue1842, scopeValue1849));
    if (scopeValue1842.globalData || scopeValue1842.imessage || scopeValue1842.assets || scopeValue1843) {
      return {
        format: "legacy",
        payload: scopeValue1842,
        summary: {
          app: scopeValue6,
          schemaVersion: Number(scopeValue1842.version) || 1,
          exportedAt: Number(scopeValue1842.exportedAt) || 0,
          storeCount: 0,
          recordCount: 0,
          assetCount: Array.isArray(scopeValue1842.assets) ? scopeValue1842.assets.length : 0,
          localStorageKeyCount: 0,
          approximateBytes: scopeValue56(scopeValue1842),
          checksum: ""
        }
      };
    }
    throw new Error("Unsupported backup format.");
  }
  const scopeValue259 = {
    [scopeValue9.meta]: "key",
    [scopeValue9.settings]: "key",
    [scopeValue9.accounts]: "id",
    [scopeValue9.appState]: "key",
    [scopeValue9.theme]: "key",
    [scopeValue9.worldbooks]: "key",
    [scopeValue9.assets]: "id",
    [scopeValue9.imFriends]: "id",
    [scopeValue9.imChatSummaries]: "friendId",
    [scopeValue9.imMessages]: "id",
    [scopeValue9.imMoments]: "id",
    [scopeValue9.imMomentMessages]: "id",
    [scopeValue9.imStickers]: "categoryName",
    [scopeValue9.libraryBooks]: "id",
    [scopeValue9.libraryBookContent]: "id",
    [scopeValue9.libraryPlaylists]: "id",
    [scopeValue9.libraryTracks]: "id",
    [scopeValue9.libraryDailyStats]: "id",
    [scopeValue9.appDomains]: "name",
    [scopeValue9.xPosts]: "id",
    [scopeValue9.xThreads]: "postId",
    [scopeValue9.xDms]: "id",
    [scopeValue9.xAccountWorlds]: "accountId",
    [scopeValue9.vectorMemoryIndex]: "id",
    [scopeValue9.storageCheckpoints]: "id"
  };
  function scopeValue260() {
    return Object.fromEntries(scopeValue10.map(scopeValue1850 => [scopeValue1850, []]));
  }
  function scopeValue261(scopeValue1851, scopeValue1852, scopeValue1853) {
    const scopeValue1854 = scopeValue259[scopeValue1852];
    const scopeValue1855 = scopeValue1853?.[scopeValue1854];
    if (scopeValue1855 === undefined || scopeValue1855 === null || scopeValue1855 === "") return false;
    const scopeValue1856 = scopeValue1851[scopeValue1852];
    const scopeValue1857 = scopeValue1856.findIndex(scopeValue1858 => String(scopeValue1858?.[scopeValue1854]) === String(scopeValue1855));
    if (scopeValue1857 >= 0) scopeValue1856[scopeValue1857] = scopeValue1853;else scopeValue1856.push(scopeValue1853);
    return true;
  }
  function scopeValue262(scopeValue1859, scopeValue1860, scopeValue1861 = 0) {
    if (!scopeValue1860 || typeof scopeValue1860 !== "object" || Array.isArray(scopeValue1860)) {
      throw new Error(`Invalid ${scopeValue1859} record at index ${scopeValue1861}.`);
    }
    const scopeValue1862 = scopeValue49(scopeValue47(scopeValue1860));
    if (scopeValue1859 === scopeValue9.assets && scopeValue1860.dataUrl) {
      const scopeValue1864 = scopeValue232(scopeValue1859, scopeValue1860);
      if (!scopeValue1864?.id) throw new Error(`Backup record ${scopeValue1859}[${scopeValue1861}] is missing id.`);
      if (typeof Blob !== "undefined" && !(scopeValue1864.blob instanceof Blob)) {
        throw new Error(`Backup asset ${scopeValue1864.id} contains invalid image data.`);
      }
      return scopeValue1864;
    }
    if (scopeValue1859 === scopeValue9.assets && scopeValue1862.blob && typeof Blob !== "undefined" && !(scopeValue1862.blob instanceof Blob)) {
      throw new Error(`Backup asset ${scopeValue1862.id || scopeValue1861} contains an invalid blob.`);
    }
    if (scopeValue1859 === scopeValue9.imChatSummaries && scopeValue1862.friendId == null && scopeValue1862.id != null) scopeValue1862.friendId = String(scopeValue1862.id);
    if (scopeValue1859 === scopeValue9.imMessages) {
      const scopeValue1865 = String(scopeValue1862.friendId ?? scopeValue1862.chatId ?? "legacy");
      return scopeValue171(scopeValue1865, scopeValue1862, scopeValue1862.order ?? scopeValue1861);
    }
    if (scopeValue1859 === scopeValue9.imMoments && scopeValue1862.id == null) scopeValue1862.id = `legacy_moment_${scopeValue1862.time || scopeValue1862.timestamp || scopeValue1861}`;
    if (scopeValue1859 === scopeValue9.imMomentMessages && scopeValue1862.id == null) scopeValue1862.id = `legacy_moment_message_${scopeValue1862.time || scopeValue1862.timestamp || scopeValue1861}`;
    if (scopeValue1859 === scopeValue9.imStickers && scopeValue1862.categoryName == null) scopeValue1862.categoryName = String(scopeValue1862.name ?? scopeValue1862.title ?? `legacy_${scopeValue1861}`);
    if (scopeValue1859 === scopeValue9.appDomains && scopeValue1862.name == null && scopeValue1862.key != null) scopeValue1862.name = String(scopeValue1862.key);
    if (scopeValue1859 === scopeValue9.appDomains && scopeValue1862.name && scopeValue1862.value && typeof scopeValue1862.value === "object") {
      scopeValue1862.value = scopeValue49(scopeValue71(String(scopeValue1862.name), scopeValue1862.value));
    }
    if (scopeValue1859 === scopeValue9.xPosts && scopeValue1862.id == null) scopeValue1862.id = `legacy_x_post_${scopeValue1862.createdAt || scopeValue1861}`;
    if (scopeValue1859 === scopeValue9.xThreads && scopeValue1862.postId == null && scopeValue1862.id != null) scopeValue1862.postId = String(scopeValue1862.id);
    if (scopeValue1859 === scopeValue9.xDms && scopeValue1862.id == null) scopeValue1862.id = String(scopeValue1862.charId ?? `legacy_x_dm_${scopeValue1861}`);
    const scopeValue1863 = scopeValue259[scopeValue1859];
    if (scopeValue1862[scopeValue1863] === undefined || scopeValue1862[scopeValue1863] === null || scopeValue1862[scopeValue1863] === "") {
      throw new Error(`Backup record ${scopeValue1859}[${scopeValue1861}] is missing ${scopeValue1863}.`);
    }
    return scopeValue1862;
  }
  function scopeValue263(scopeValue1866, scopeValue1867 = []) {
    const scopeValue1868 = Array.isArray(scopeValue1867) ? scopeValue1867.filter(scopeValue1876 => scopeValue1876?.key) : [];
    if (scopeValue1868.length === 0) return;
    const scopeValue1869 = {
      u2_userState: "userState",
      u2_apiConfig: "apiConfig",
      u2_vectorMemoryConfig: "vectorMemoryConfig",
      u2_ttsConfig: "ttsConfig",
      u2_minimaxConfig: "minimaxConfig",
      u2_apiPresets: "apiPresets",
      u2_fetchedModels: "fetchedModels",
      u2_assistiveBallSettings: "assistiveBallSettings",
      u2_accounts: "accounts",
      u2_currentAccountId: "currentAccountId",
      u2_themeState: "themeState",
      u2_worldBooks: "worldBooks",
      u2_wbGroups: "wbGroups"
    };
    const scopeValue1870 = scopeValue1866[scopeValue9.appDomains].find(scopeValue1877 => scopeValue1877?.name === "settings");
    const scopeValue1871 = scopeValue1870?.value && typeof scopeValue1870.value === "object" ? scopeValue47(scopeValue1870.value) : {};
    const scopeValue1872 = scopeValue1866[scopeValue9.appDomains].find(scopeValue1878 => scopeValue1878?.name === "legacy");
    const scopeValue1873 = scopeValue1872?.value && typeof scopeValue1872.value === "object" ? scopeValue47(scopeValue1872.value) : {};
    scopeValue1868.forEach(scopeValue1879 => {
      if (scopeValue1879.key === "u2_mockAuthSession" || scopeValue1879.key === "u2_appState") return;
      const scopeValue1880 = scopeValue54(scopeValue1879.value);
      const scopeValue1881 = scopeValue1869[scopeValue1879.key];
      if (scopeValue1881 && !Object.prototype.hasOwnProperty.call(scopeValue1871, scopeValue1881)) scopeValue1871[scopeValue1881] = scopeValue1880;else if (!scopeValue1881 && !Object.prototype.hasOwnProperty.call(scopeValue1873, scopeValue1879.key)) scopeValue1873[scopeValue1879.key] = scopeValue1880;
    });
    const scopeValue1874 = Date.now();
    scopeValue261(scopeValue1866, scopeValue9.appDomains, {
      name: "settings",
      schemaVersion: scopeValue5,
      revision: 1,
      updatedAt: scopeValue1874,
      value: scopeValue1871
    });
    scopeValue261(scopeValue1866, scopeValue9.appDomains, {
      name: "legacy",
      schemaVersion: scopeValue5,
      revision: 1,
      updatedAt: scopeValue1874,
      value: scopeValue1873
    });
    const scopeValue1875 = scopeValue53(scopeValue1868, "u2_appState");
    if (scopeValue1875 && typeof scopeValue1875 === "object") {
      Object.entries(scopeValue1875).forEach(([scopeValue1882, scopeValue1883]) => {
        if (!scopeValue1882 || !scopeValue1883 || typeof scopeValue1883 !== "object") {
          scopeValue1873[`u2_appState_${scopeValue1882}`] = scopeValue49(scopeValue1883);
          return;
        }
        if (!scopeValue1866[scopeValue9.appDomains].some(scopeValue1884 => scopeValue1884?.name === scopeValue1882)) {
          scopeValue1866[scopeValue9.appDomains].push({
            name: scopeValue1882,
            schemaVersion: scopeValue5,
            revision: 1,
            updatedAt: scopeValue1874,
            value: scopeValue49(scopeValue47(scopeValue1883))
          });
        }
      });
    }
  }
  function scopeValue264(scopeValue1885, scopeValue1886 = {}) {
    const scopeValue1887 = scopeValue1886 && typeof scopeValue1886 === "object" ? scopeValue1886 : {};
    const scopeValue1888 = Array.isArray(scopeValue1887.messages) ? scopeValue1887.messages : [];
    (Array.isArray(scopeValue1887.friends) ? scopeValue1887.friends : []).forEach((scopeValue1889, scopeValue1890) => {
      if (!scopeValue1889 || scopeValue1889.id == null) return;
      const scopeValue1891 = String(scopeValue1889.id);
      const scopeValue1892 = scopeValue49(scopeValue47(scopeValue1889));
      const scopeValue1893 = Array.isArray(scopeValue1892.messages) ? scopeValue1892.messages : [];
      delete scopeValue1892.messages;
      scopeValue1892.id = scopeValue1891;
      scopeValue261(scopeValue1885, scopeValue9.imFriends, scopeValue1892);
      const scopeValue1894 = [...scopeValue1893, ...scopeValue1888.filter(scopeValue1895 => String(scopeValue1895?.friendId ?? scopeValue1895?.chatId ?? "") === scopeValue1891)];
      scopeValue1894.forEach((scopeValue1896, scopeValue1897) => {
        scopeValue261(scopeValue1885, scopeValue9.imMessages, scopeValue171(scopeValue1891, scopeValue1896, scopeValue1897));
      });
      scopeValue261(scopeValue1885, scopeValue9.imChatSummaries, scopeValue188(scopeValue1891, {
        lastMessagePreview: scopeValue1889.lastMessagePreview,
        lastMessageTimestamp: scopeValue1889.lastMessageTimestamp,
        messageCount: scopeValue1894.length || scopeValue1889.messageCount,
        unreadCount: scopeValue1889.unreadCount
      }));
    });
    scopeValue1888.forEach((scopeValue1898, scopeValue1899) => {
      const scopeValue1900 = String(scopeValue1898?.friendId ?? scopeValue1898?.chatId ?? "legacy");
      scopeValue261(scopeValue1885, scopeValue9.imMessages, scopeValue171(scopeValue1900, scopeValue1898, scopeValue1899));
    });
    (Array.isArray(scopeValue1887.moments) ? scopeValue1887.moments : []).forEach((scopeValue1901, scopeValue1902) => {
      scopeValue261(scopeValue1885, scopeValue9.imMoments, scopeValue262(scopeValue9.imMoments, scopeValue1901, scopeValue1902));
    });
    (Array.isArray(scopeValue1887.momentMessages) ? scopeValue1887.momentMessages : []).forEach((scopeValue1903, scopeValue1904) => {
      scopeValue261(scopeValue1885, scopeValue9.imMomentMessages, scopeValue262(scopeValue9.imMomentMessages, scopeValue1903, scopeValue1904));
    });
    (Array.isArray(scopeValue1887.stickers) ? scopeValue1887.stickers : []).forEach((scopeValue1905, scopeValue1906) => {
      if (!scopeValue1905 || typeof scopeValue1905 !== "object") return;
      const scopeValue1907 = scopeValue47(scopeValue1905);
      scopeValue1907.categoryName = String(scopeValue1907.categoryName ?? scopeValue1907.name ?? scopeValue1907.title ?? scopeValue1907.id ?? `legacy_${scopeValue1906}`);
      scopeValue261(scopeValue1885, scopeValue9.imStickers, scopeValue1907);
    });
    if (scopeValue1887.momentsCoverUrlMeta !== undefined) {
      scopeValue261(scopeValue1885, scopeValue9.meta, {
        key: scopeValue16.imMomentsCoverAssetId,
        value: scopeValue1887.momentsCoverUrlMeta
      });
    } else if (scopeValue1887.momentsCoverUrl) {
      scopeValue261(scopeValue1885, scopeValue9.meta, {
        key: scopeValue16.imMomentsCoverAssetId,
        value: {
          externalUrl: scopeValue1887.momentsCoverUrl
        }
      });
    }
  }
  function scopeValue265(scopeValue1908 = {}) {
    const scopeValue1909 = scopeValue260();
    const scopeValue1910 = Date.now();
    const scopeValue1911 = scopeValue228(scopeValue47(scopeValue1908.globalData || {}));
    const scopeValue1912 = {
      userState: scopeValue1911.userState,
      accounts: scopeValue1911.accounts,
      currentAccountId: scopeValue1911.currentAccountId,
      apiConfig: scopeValue1911.apiConfig,
      vectorMemoryConfig: scopeValue1911.vectorMemoryConfig,
      apiPresets: scopeValue1911.apiPresets,
      fetchedModels: scopeValue1911.fetchedModels,
      assistiveBallSettings: scopeValue1911.assistiveBallSettings,
      themeState: scopeValue1911.themeState,
      wbGroups: scopeValue1911.wbGroups,
      worldBooks: scopeValue1911.worldBooks
    };
    Object.entries(scopeValue1912).forEach(([scopeValue1914, scopeValue1915]) => {
      if (scopeValue1914 !== "accounts") scopeValue1909[scopeValue9.settings].push({
        key: scopeValue1914,
        value: scopeValue49(scopeValue47(scopeValue1915))
      });
    });
    scopeValue1909[scopeValue9.accounts].push({
      id: "__all__",
      value: scopeValue47(scopeValue1911.accounts)
    });
    scopeValue1909[scopeValue9.appDomains].push({
      name: "settings",
      schemaVersion: scopeValue5,
      revision: 1,
      updatedAt: scopeValue1910,
      value: scopeValue49(scopeValue47(scopeValue1912))
    });
    scopeValue1909[scopeValue9.appDomains].push({
      name: "legacy",
      schemaVersion: scopeValue5,
      revision: 1,
      updatedAt: scopeValue1910,
      value: {}
    });
    Object.entries(scopeValue1911.appState || {}).forEach(([scopeValue1916, scopeValue1917]) => {
      scopeValue1909[scopeValue9.appDomains].push({
        name: scopeValue1916,
        schemaVersion: scopeValue5,
        revision: 1,
        updatedAt: scopeValue1910,
        value: scopeValue49(scopeValue47(scopeValue1917))
      });
    });
    const scopeValue1913 = scopeValue1908.imessage && typeof scopeValue1908.imessage === "object" ? scopeValue1908.imessage : scopeValue1908;
    scopeValue264(scopeValue1909, scopeValue1913);
    (Array.isArray(scopeValue1908.assets) ? scopeValue1908.assets : []).forEach((scopeValue1918, scopeValue1919) => {
      scopeValue261(scopeValue1909, scopeValue9.assets, scopeValue262(scopeValue9.assets, scopeValue1918, scopeValue1919));
    });
    scopeValue1909[scopeValue9.meta].push({
      key: scopeValue16.schemaVersion,
      value: scopeValue5
    });
    return {
      stores: scopeValue1909,
      localStorage: []
    };
  }
  const scopeValue266 = ["stickers", "imessage_stickers", "imessageStickers", "stickerCategories"];
  function scopeValue267(scopeValue1920 = {}) {
    const scopeValue1921 = [scopeValue1920.items, scopeValue1920.stickers, scopeValue1920.emojis, scopeValue1920.list];
    const scopeValue1922 = scopeValue1921.find(Array.isArray);
    if (scopeValue1922) return scopeValue1922;
    const scopeValue1923 = scopeValue1921.find(scopeValue1924 => scopeValue1924 && typeof scopeValue1924 === "object");
    if (!scopeValue1923) return [];
    return Object.entries(scopeValue1923).map(([scopeValue1925, scopeValue1926]) => {
      if (typeof scopeValue1926 === "string") return {
        name: scopeValue1925,
        url: scopeValue1926
      };
      return scopeValue1926 && typeof scopeValue1926 === "object" ? {
        name: scopeValue1925,
        ...scopeValue1926
      } : null;
    }).filter(Boolean);
  }
  function scopeValue268(scopeValue1927 = {}) {
    const scopeValue1928 = scopeValue1927.assetId ?? scopeValue1927.imageAssetId ?? scopeValue1927.resourceId ?? "";
    return scopeValue1928 == null ? "" : String(scopeValue1928);
  }
  function scopeValue269(scopeValue1929 = {}) {
    const scopeValue1930 = [scopeValue1929.url, scopeValue1929.src, scopeValue1929.image, scopeValue1929.imageUrl, scopeValue1929.dataUrl, scopeValue1929.data];
    const scopeValue1931 = scopeValue1930.find(scopeValue1932 => typeof scopeValue1932 === "string" && scopeValue1932.trim());
    return typeof scopeValue1931 === "string" ? scopeValue1931.trim() : "";
  }
  function scopeValue270(scopeValue1933 = {}) {
    const scopeValue1934 = scopeValue1933.stores && typeof scopeValue1933.stores === "object" ? scopeValue1933.stores : {};
    const scopeValue1935 = Array.isArray(scopeValue1934[scopeValue9.imStickers]) ? [...scopeValue1934[scopeValue9.imStickers]] : [];
    scopeValue266.forEach(scopeValue1936 => {
      if (Array.isArray(scopeValue1934[scopeValue1936])) scopeValue1935.push(...scopeValue1934[scopeValue1936]);
    });
    return scopeValue1935;
  }
  function scopeValue271(scopeValue1937 = []) {
    const scopeValue1938 = new Set();
    scopeValue1937.forEach(scopeValue1939 => {
      scopeValue267(scopeValue1939).forEach(scopeValue1940 => {
        if (!scopeValue1940 || typeof scopeValue1940 !== "object") return;
        const scopeValue1941 = scopeValue268(scopeValue1940);
        if (scopeValue1941) scopeValue1938.add(scopeValue1941);
      });
    });
    return scopeValue1938;
  }
  function scopeValue272(scopeValue1942, scopeValue1943, scopeValue1944) {
    const scopeValue1945 = new Set(scopeValue1943[scopeValue9.assets].map(scopeValue1946 => String(scopeValue1946?.id || "")).filter(Boolean));
    scopeValue1942.forEach((scopeValue1947, scopeValue1948) => {
      if (!scopeValue1947 || typeof scopeValue1947 !== "object") {
        scopeValue1944.stickers.skippedCategories += 1;
        return;
      }
      const scopeValue1949 = String(scopeValue1947.categoryName ?? scopeValue1947.name ?? scopeValue1947.title ?? scopeValue1947.id ?? `旧表情包 ${scopeValue1948 + 1}`).trim();
      if (!scopeValue1949) {
        scopeValue1944.stickers.skippedCategories += 1;
        return;
      }
      const scopeValue1950 = [];
      scopeValue267(scopeValue1947).forEach((scopeValue1951, scopeValue1952) => {
        const scopeValue1953 = typeof scopeValue1951 === "string" ? {
          name: `表情 ${scopeValue1952 + 1}`,
          url: scopeValue1951
        } : scopeValue1951;
        if (!scopeValue1953 || typeof scopeValue1953 !== "object") {
          scopeValue1944.stickers.skippedItems += 1;
          return;
        }
        const scopeValue1954 = scopeValue49(scopeValue47(scopeValue1953));
        const scopeValue1955 = String(scopeValue1953.name ?? scopeValue1953.title ?? scopeValue1953.label ?? scopeValue1953.id ?? `表情 ${scopeValue1952 + 1}`).trim();
        let scopeValue1956 = scopeValue268(scopeValue1953);
        let scopeValue1957 = scopeValue269(scopeValue1953);
        if (scopeValue63(scopeValue1957)) {
          try {
            const scopeValue1958 = scopeValue73(scopeValue1957);
            if (!scopeValue1958.size) throw new Error("Empty sticker image.");
            scopeValue1956 = scopeValue1956 || `sticker_import_${scopeValue57(scopeValue1957)}`;
            scopeValue261(scopeValue1943, scopeValue9.assets, {
              id: scopeValue1956,
              blob: scopeValue1958,
              mimeType: scopeValue1958.type || "application/octet-stream",
              ownerType: "im_sticker",
              ownerId: scopeValue1949,
              field: scopeValue1955,
              updatedAt: Date.now()
            });
            scopeValue1945.add(scopeValue1956);
            scopeValue1957 = "";
          } catch (scopeValue1959) {
            scopeValue1944.stickers.invalidImages += 1;
            scopeValue1944.stickers.skippedItems += 1;
            return;
          }
        } else if (scopeValue64(scopeValue1957)) {
          scopeValue1957 = "";
          scopeValue1944.stickers.expiredBlobUrls += 1;
        }
        if (scopeValue1956 && !scopeValue1945.has(scopeValue1956)) {
          if (!scopeValue1957) {
            scopeValue1944.stickers.missingAssets += 1;
            scopeValue1944.stickers.skippedItems += 1;
            return;
          }
          scopeValue1956 = "";
        }
        if (!scopeValue1956 && !scopeValue1957) {
          scopeValue1944.stickers.skippedItems += 1;
          return;
        }
        scopeValue1950.push({
          ...scopeValue1954,
          name: scopeValue1955,
          url: scopeValue1957 || null,
          assetId: scopeValue1956 || ""
        });
        scopeValue1944.stickers.importedItems += 1;
      });
      if (scopeValue1950.length === 0) {
        scopeValue1944.stickers.skippedCategories += 1;
        return;
      }
      scopeValue261(scopeValue1943, scopeValue9.imStickers, {
        ...scopeValue49(scopeValue47(scopeValue1947)),
        categoryName: scopeValue1949,
        items: scopeValue1950
      });
      scopeValue1944.stickers.importedCategories += 1;
    });
  }
  function scopeValue273(scopeValue1960) {
    const scopeValue1961 = scopeValue1960.format === "legacy" ? scopeValue265(scopeValue1960.payload) : scopeValue1960.payload;
    const scopeValue1962 = scopeValue260();
    const scopeValue1963 = {
      sourceFormat: scopeValue1960.format,
      sourceVersion: scopeValue1960.summary.schemaVersion,
      stickers: {
        importedCategories: 0,
        importedItems: 0,
        skippedCategories: 0,
        skippedItems: 0,
        missingAssets: 0,
        invalidImages: 0,
        expiredBlobUrls: 0
      }
    };
    const scopeValue1964 = scopeValue270(scopeValue1961);
    const scopeValue1965 = scopeValue271(scopeValue1964);
    scopeValue10.forEach(scopeValue1968 => {
      if (scopeValue1968 === scopeValue9.imStickers) return;
      const scopeValue1969 = Array.isArray(scopeValue1961.stores?.[scopeValue1968]) ? scopeValue1961.stores[scopeValue1968] : [];
      scopeValue1969.forEach((scopeValue1970, scopeValue1971) => {
        try {
          scopeValue261(scopeValue1962, scopeValue1968, scopeValue262(scopeValue1968, scopeValue1970, scopeValue1971));
        } catch (scopeValue1972) {
          const scopeValue1973 = scopeValue1968 === scopeValue9.assets && scopeValue1970?.id != null ? String(scopeValue1970.id) : "";
          if (scopeValue1973 && scopeValue1965.has(scopeValue1973)) {
            scopeValue1963.stickers.invalidImages += 1;
            return;
          }
          throw scopeValue1972;
        }
      });
    });
    scopeValue272(scopeValue1964, scopeValue1962, scopeValue1963);
    scopeValue263(scopeValue1962, scopeValue1961.localStorage);
    const scopeValue1966 = scopeValue1962[scopeValue9.settings].findIndex(scopeValue1974 => scopeValue1974?.key === "appState");
    if (scopeValue1966 >= 0) {
      const scopeValue1975 = scopeValue1962[scopeValue9.settings][scopeValue1966]?.value;
      if (scopeValue1975 && typeof scopeValue1975 === "object") {
        const scopeValue1976 = [{
          key: "u2_appState",
          value: JSON.stringify(scopeValue1975)
        }];
        scopeValue263(scopeValue1962, scopeValue1976);
      }
      scopeValue1962[scopeValue9.settings].splice(scopeValue1966, 1);
    }
    scopeValue1962[scopeValue9.appDomains] = scopeValue1962[scopeValue9.appDomains].map((scopeValue1977, scopeValue1978) => scopeValue262(scopeValue9.appDomains, scopeValue1977, scopeValue1978));
    const scopeValue1967 = scopeValue1962[scopeValue9.appDomains].some(scopeValue1979 => scopeValue1979?.name === "settings" && scopeValue1979.value && typeof scopeValue1979.value === "object");
    if (scopeValue1967) {
      scopeValue1962[scopeValue9.settings] = scopeValue1962[scopeValue9.settings].filter(scopeValue1980 => scopeValue1980?.key !== "userState");
      scopeValue1962[scopeValue9.accounts] = scopeValue1962[scopeValue9.accounts].filter(scopeValue1981 => scopeValue1981?.id !== "__all__");
    }
    scopeValue261(scopeValue1962, scopeValue9.meta, {
      key: scopeValue16.schemaVersion,
      value: scopeValue5
    });
    return {
      stores: scopeValue1962,
      localStorage: [],
      report: scopeValue1963
    };
  }
  function scopeValue274(scopeValue1982 = {}) {
    return scopeValue258(scopeValue1982).summary;
  }
  async function scopeValue275() {
    try {
      scopeValue60();
    } catch (scopeValue1984) {}
    const scopeValue1983 = await scopeValue320();
    return {
      databaseDeleted: scopeValue1983
    };
  }
  async function scopeValue276(scopeValue1985, scopeValue1986 = {}, scopeValue1987) {
    const scopeValue1988 = {};
    for (let scopeValue1989 = 0; scopeValue1989 < scopeValue10.length; scopeValue1989 += 1) {
      const scopeValue1990 = scopeValue10[scopeValue1989];
      const scopeValue1991 = Array.isArray(scopeValue1986.stores?.[scopeValue1990]) ? scopeValue1986.stores[scopeValue1990] : [];
      const scopeValue1992 = scopeValue90(scopeValue1990, scopeValue1991);
      scopeValue51(scopeValue1987, `校验并写入 ${scopeValue1990}...`, 12 + (scopeValue1989 + 1) / scopeValue10.length * 58);
      await scopeValue92(scopeValue1985, scopeValue1990, scopeValue1992);
      const scopeValue1993 = await scopeValue89(scopeValue1985, scopeValue1990);
      const scopeValue1994 = await scopeValue91(scopeValue1990, scopeValue1992);
      const scopeValue1995 = await scopeValue91(scopeValue1990, scopeValue1993);
      if (scopeValue1994.count !== scopeValue1995.count || scopeValue1994.bytes !== scopeValue1995.bytes || scopeValue1994.checksum !== scopeValue1995.checksum) {
        throw new Error(`Import verification failed for ${scopeValue1990}.`);
      }
      scopeValue1988[scopeValue1990] = scopeValue1995;
    }
    return scopeValue1988;
  }
  async function scopeValue277(scopeValue1996, scopeValue1997, scopeValue1998) {
    let scopeValue1999 = null;
    let scopeValue2000 = false;
    let scopeValue2001 = false;
    let scopeValue2002 = false;
    try {
      const scopeValue2003 = await scopeValue82();
      await scopeValue78(scopeValue3);
      scopeValue1999 = await scopeValue81(scopeValue3);
      scopeValue51(scopeValue1998, "正在创建当前数据保护副本...", 76);
      const scopeValue2004 = await scopeValue93(scopeValue2003, scopeValue1999, scopeValue1998, 76, 2);
      await scopeValue94(scopeValue1999, "import_rollback_ready", {
        importId: scopeValue1997,
        createdAt: Date.now(),
        signatures: scopeValue2004
      });
      try {
        scopeValue2003.close();
      } catch (scopeValue2007) {}
      scopeValue25 = null;
      scopeValue51(scopeValue1998, "正在安全切换数据库...", 78);
      const scopeValue2005 = await scopeValue78(scopeValue0);
      if (!scopeValue2005.deleted) {
        throw new Error(scopeValue2005.reason === "blocked" ? "数据库正被其他页面占用，请关闭本项目的其他标签页后重试。" : `Current database could not be replaced: ${scopeValue2005.reason}`);
      }
      scopeValue2000 = true;
      const scopeValue2006 = await scopeValue82();
      await scopeValue93(scopeValue1996, scopeValue2006, scopeValue1998, 80, 17);
      await scopeValue94(scopeValue2006, "import_restore_complete", {
        importId: scopeValue1997,
        restoredAt: Date.now()
      });
      try {
        scopeValue2006.close();
      } catch (scopeValue2008) {}
      scopeValue25 = null;
      scopeValue1999.close();
      scopeValue1999 = null;
      try {
        await scopeValue78(scopeValue3);
      } catch (scopeValue2009) {}
      return true;
    } catch (scopeValue2010) {
      if (scopeValue2000 && scopeValue1999) {
        try {
          const scopeValue2011 = await scopeValue82();
          await scopeValue93(scopeValue1999, scopeValue2011, null);
          await scopeValue94(scopeValue2011, "import_rollback_restored", {
            importId: scopeValue1997,
            restoredAt: Date.now()
          });
          scopeValue2001 = true;
        } catch (scopeValue2012) {
          scopeValue2002 = true;
          console.error("Failed to restore the pre-import database", scopeValue2012);
        }
      }
      if (scopeValue2001) {
        scopeValue2010.message = `${scopeValue2010.message} 已自动恢复导入前的数据。`;
      } else if (scopeValue2000) {
        scopeValue2010.message = `${scopeValue2010.message} 导入前的数据保护副本仍保留，重新打开应用会自动恢复。`;
      }
      throw scopeValue2010;
    } finally {
      try {
        scopeValue1999?.close();
      } catch (scopeValue2013) {}
      if (!scopeValue2002) {
        try {
          await scopeValue78(scopeValue3);
        } catch (scopeValue2014) {}
      }
    }
  }
  async function scopeValue278() {
    if (!window.indexedDB) return null;
    if (typeof window.indexedDB.databases === "function") {
      try {
        const scopeValue2017 = await window.indexedDB.databases();
        if (!scopeValue2017.some(scopeValue2018 => scopeValue2018?.name === scopeValue3)) return null;
      } catch (scopeValue2019) {}
    }
    const scopeValue2015 = await scopeValue81(scopeValue3);
    const scopeValue2016 = await new Promise((scopeValue2020, scopeValue2021) => {
      const scopeValue2022 = scopeValue2015.transaction(scopeValue9.meta, "readonly").objectStore(scopeValue9.meta).get("import_rollback_ready");
      scopeValue2022.onsuccess = () => scopeValue2020(scopeValue2022.result?.value || null);
      scopeValue2022.onerror = () => scopeValue2021(scopeValue2022.error);
    });
    if (!scopeValue2016?.importId) {
      scopeValue2015.close();
      await scopeValue78(scopeValue3);
      return null;
    }
    return {
      db: scopeValue2015,
      marker: scopeValue2016
    };
  }
  async function scopeValue279() {
    const scopeValue2023 = await scopeValue278();
    if (!scopeValue2023) return false;
    const scopeValue2024 = await scopeValue82();
    const scopeValue2025 = await new Promise((scopeValue2027, scopeValue2028) => {
      const scopeValue2029 = scopeValue2024.transaction(scopeValue9.meta, "readonly").objectStore(scopeValue9.meta).get("import_restore_complete");
      scopeValue2029.onsuccess = () => scopeValue2027(scopeValue2029.result?.value || null);
      scopeValue2029.onerror = () => scopeValue2028(scopeValue2029.error);
    });
    const scopeValue2026 = scopeValue2025?.importId === scopeValue2023.marker.importId;
    if (!scopeValue2026) {
      await scopeValue93(scopeValue2023.db, scopeValue2024, null);
      await scopeValue94(scopeValue2024, "import_rollback_restored", {
        importId: scopeValue2023.marker.importId,
        restoredAt: Date.now(),
        recoveredAtStartup: true
      });
    }
    scopeValue2023.db.close();
    await scopeValue78(scopeValue3);
    if (!scopeValue2026) await scopeValue78(scopeValue2);
    return !scopeValue2026;
  }
  async function scopeValue280() {
    if (!window.indexedDB) return null;
    if (typeof window.indexedDB.databases === "function") {
      try {
        const scopeValue2032 = await window.indexedDB.databases();
        if (!scopeValue2032.some(scopeValue2033 => scopeValue2033?.name === scopeValue2)) return null;
      } catch (scopeValue2034) {}
    }
    const scopeValue2030 = await scopeValue81(scopeValue2);
    const scopeValue2031 = await new Promise((scopeValue2035, scopeValue2036) => {
      const scopeValue2037 = scopeValue2030.transaction(scopeValue9.meta, "readonly").objectStore(scopeValue9.meta).get("import_shadow_ready");
      scopeValue2037.onsuccess = () => scopeValue2035(scopeValue2037.result?.value || null);
      scopeValue2037.onerror = () => scopeValue2036(scopeValue2037.error);
    });
    if (!scopeValue2031?.importId) {
      scopeValue2030.close();
      await scopeValue78(scopeValue2);
      return null;
    }
    return {
      db: scopeValue2030,
      marker: scopeValue2031
    };
  }
  async function scopeValue281() {
    const scopeValue2038 = await scopeValue280();
    if (!scopeValue2038) return false;
    const scopeValue2039 = await scopeValue82();
    const scopeValue2040 = await new Promise((scopeValue2041, scopeValue2042) => {
      const scopeValue2043 = scopeValue2039.transaction(scopeValue9.meta, "readonly").objectStore(scopeValue9.meta).get("import_restore_complete");
      scopeValue2043.onsuccess = () => scopeValue2041(scopeValue2043.result?.value || null);
      scopeValue2043.onerror = () => scopeValue2042(scopeValue2043.error);
    });
    if (!scopeValue2040 || scopeValue2040.importId !== scopeValue2038.marker.importId) {
      await scopeValue93(scopeValue2038.db, scopeValue2039, null);
      await scopeValue94(scopeValue2039, "import_restore_complete", {
        importId: scopeValue2038.marker.importId,
        restoredAt: Date.now(),
        recoveredAtStartup: true
      });
    }
    scopeValue2038.db.close();
    await scopeValue78(scopeValue2);
    return true;
  }
  async function scopeValue282(scopeValue2044 = {}, scopeValue2045) {
    const scopeValue2046 = scopeValue2044.stores || {};
    const scopeValue2047 = scopeValue10;
    scopeValue51(scopeValue2045, "清理旧数据...", 0);
    await scopeValue275();
    scopeValue51(scopeValue2045, "恢复数据库...", 12);
    for (let scopeValue2049 = 0; scopeValue2049 < scopeValue2047.length; scopeValue2049 += 1) {
      const scopeValue2050 = scopeValue2047[scopeValue2049];
      const scopeValue2051 = Array.isArray(scopeValue2046[scopeValue2050]) ? scopeValue2046[scopeValue2050] : [];
      const scopeValue2052 = 12 + Math.floor(scopeValue2049 / scopeValue2047.length * 72);
      scopeValue51(scopeValue2045, `恢复 ${scopeValue2050}...`, scopeValue2052);
      if (scopeValue2051.length === 0) continue;
      await scopeValue83([scopeValue2050], "readwrite", scopeValue2053 => {
        const scopeValue2054 = scopeValue2053[scopeValue2050];
        scopeValue2051.forEach(scopeValue2055 => {
          scopeValue2054.put(scopeValue232(scopeValue2050, scopeValue2055));
        });
      });
    }
    const scopeValue2048 = (Array.isArray(scopeValue2044.localStorage) ? scopeValue2044.localStorage : []).filter(scopeValue2056 => scopeValue2056?.key);
    if (scopeValue2048.length > 0) {
      scopeValue51(scopeValue2045, "迁移旧版兼容数据...", 90);
      await scopeValue55(scopeValue2048);
    }
    scopeValue51(scopeValue2045, "导入完成", 100);
    return true;
  }
  async function scopeValue283(scopeValue2057 = {}, scopeValue2058) {
    const scopeValue2059 = scopeValue2057 && typeof scopeValue2057 === "object" ? scopeValue2057 : {};
    const scopeValue2060 = scopeValue2059.globalData || {};
    scopeValue51(scopeValue2058, "迁移旧格式全局数据...", 18);
    await scopeValue229(scopeValue2060);
    const scopeValue2061 = scopeValue2059.imessage && typeof scopeValue2059.imessage === "object" ? scopeValue2059.imessage : {};
    const scopeValue2062 = Array.isArray(scopeValue2061.friends) ? scopeValue2061.friends : [];
    if (scopeValue2062.length > 0) {
      scopeValue51(scopeValue2058, "迁移聊天联系人...", 36);
      await scopeValue83([scopeValue9.imFriends], "readwrite", scopeValue2068 => {
        scopeValue2062.forEach(scopeValue2069 => scopeValue2068[scopeValue9.imFriends].put(scopeValue2069));
      });
    }
    const scopeValue2063 = Array.isArray(scopeValue2061.messages) ? scopeValue2061.messages : [];
    if (scopeValue2063.length > 0) {
      scopeValue51(scopeValue2058, "迁移聊天记录...", 48);
      await scopeValue83([scopeValue9.imMessages], "readwrite", scopeValue2070 => {
        scopeValue2063.forEach(scopeValue2071 => scopeValue2070[scopeValue9.imMessages].put(scopeValue2071));
      });
    }
    const scopeValue2064 = Array.isArray(scopeValue2061.moments) ? scopeValue2061.moments : [];
    if (scopeValue2064.length > 0) {
      scopeValue51(scopeValue2058, "迁移朋友圈...", 58);
      await scopeValue83([scopeValue9.imMoments], "readwrite", scopeValue2072 => {
        scopeValue2064.forEach(scopeValue2073 => scopeValue2072[scopeValue9.imMoments].put(scopeValue2073));
      });
    }
    const scopeValue2065 = Array.isArray(scopeValue2061.momentMessages) ? scopeValue2061.momentMessages : [];
    if (scopeValue2065.length > 0) {
      scopeValue51(scopeValue2058, "迁移朋友圈消息...", 68);
      await scopeValue83([scopeValue9.imMomentMessages], "readwrite", scopeValue2074 => {
        scopeValue2065.forEach(scopeValue2075 => scopeValue2074[scopeValue9.imMomentMessages].put(scopeValue2075));
      });
    }
    const scopeValue2066 = Array.isArray(scopeValue2061.stickers) ? scopeValue2061.stickers : [];
    if (scopeValue2066.length > 0) {
      scopeValue51(scopeValue2058, "迁移贴纸...", 76);
      await scopeValue83([scopeValue9.imStickers], "readwrite", scopeValue2076 => {
        scopeValue2066.forEach(scopeValue2077 => scopeValue2076[scopeValue9.imStickers].put(scopeValue2077));
      });
    }
    if (scopeValue2061.momentsCoverUrlMeta !== undefined) {
      await scopeValue133(scopeValue16.imMomentsCoverAssetId, scopeValue2061.momentsCoverUrlMeta);
    } else if (scopeValue2061.momentsCoverUrl) {
      await scopeValue224(scopeValue2061.momentsCoverUrl);
    }
    const scopeValue2067 = Array.isArray(scopeValue2059.assets) ? scopeValue2059.assets : [];
    if (scopeValue2067.length > 0) {
      scopeValue51(scopeValue2058, "迁移图片资源...", 86);
      await scopeValue83([scopeValue9.assets], "readwrite", scopeValue2078 => {
        scopeValue2067.forEach(scopeValue2079 => {
          if (scopeValue2079 && scopeValue2079.id && scopeValue2079.dataUrl) {
            scopeValue2078[scopeValue9.assets].put(scopeValue232(scopeValue9.assets, scopeValue2079));
          }
        });
      });
    }
    scopeValue51(scopeValue2058, "旧格式迁移完成", 100);
    return true;
  }
  async function scopeValue284(scopeValue2080) {
    scopeValue51(scopeValue2080, "正在完成待保存数据...", 0);
    if (!(await scopeValue116())) throw new Error("Pending writes could not be completed before export.");
    const scopeValue2081 = await scopeValue234(scopeValue2080);
    const scopeValue2082 = await scopeValue235(scopeValue2081, scopeValue2080);
    scopeValue51(scopeValue2080, "导出完成", 100);
    return scopeValue2082;
  }
  async function scopeValue285(scopeValue2083 = {}, scopeValue2084) {
    const scopeValue2085 = scopeValue258(scopeValue2083);
    scopeValue51(scopeValue2084, "正在预迁移并校验备份...", 3);
    const scopeValue2086 = scopeValue273(scopeValue2085);
    const scopeValue2087 = scopeValue56(scopeValue2086);
    if (navigator.storage?.estimate) {
      const scopeValue2090 = await navigator.storage.estimate();
      const scopeValue2091 = Math.max(0, Number(scopeValue2090?.usage) || 0);
      const scopeValue2092 = Math.max(0, Number(scopeValue2090?.quota) || 0);
      const scopeValue2093 = Math.max(4 * 1024 * 1024, Math.ceil(scopeValue2087 * 1.2));
      if (scopeValue2092 > 0 && Math.max(0, scopeValue2092 - scopeValue2091) < scopeValue2093) {
        throw new DOMException(`安全导入需要约 ${scopeValue286(scopeValue2093)} 的临时空间。`, "QuotaExceededError");
      }
    }
    if (!(await scopeValue116())) throw new Error("Pending writes could not be completed before import.");
    scopeValue33 = true;
    let scopeValue2088 = null;
    const scopeValue2089 = `import_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    try {
      await scopeValue78(scopeValue2);
      scopeValue2088 = await scopeValue81(scopeValue2);
      const scopeValue2094 = await scopeValue276(scopeValue2088, scopeValue2086, scopeValue2084);
      await scopeValue94(scopeValue2088, "import_shadow_ready", {
        importId: scopeValue2089,
        createdAt: Date.now(),
        sourceVersion: scopeValue2085.summary.schemaVersion,
        sourceFormat: scopeValue2085.format,
        report: scopeValue2086.report,
        signatures: scopeValue2094
      });
      scopeValue51(scopeValue2084, "隔离数据校验完成...", 74);
      await scopeValue277(scopeValue2088, scopeValue2089, scopeValue2084);
      scopeValue2088.close();
      scopeValue2088 = null;
      await scopeValue78(scopeValue2);
      scopeValue26.clear();
      const scopeValue2095 = await scopeValue87(scopeValue9.appDomains);
      for (const scopeValue2096 of scopeValue2095) {
        if (!scopeValue2096?.name) continue;
        const scopeValue2097 = String(scopeValue2096.name);
        const scopeValue2098 = scopeValue2097 === "desktop" ? await scopeValue107(scopeValue2096.value) : scopeValue2097 === "netflix" ? scopeValue70(scopeValue2096.value) : scopeValue2096.value;
        scopeValue26.set(scopeValue2097, scopeValue47(scopeValue2098));
      }
      scopeValue51(scopeValue2084, "导入完成", 100);
      return scopeValue47(scopeValue2086.report);
    } catch (scopeValue2099) {
      try {
        if (scopeValue2088) scopeValue2088.close();
      } catch (scopeValue2100) {}
      try {
        await scopeValue78(scopeValue2);
      } catch (scopeValue2101) {}
      throw scopeValue2099;
    } finally {
      scopeValue33 = false;
    }
  }
  const newScope297 = {
    loves: ["lovesData", "hasLovesSpace", "pendingLovesInvite", "pendingLovesUnbindRequest", "lovesSpaceStartTime"],
    gallery: ["galleryAlbumImages"],
    cphone: ["musicData", "healthData", "payData", "gameData", "callData", "safariData", "filesData", "weiboData", "computerData", "computerBg", "computerGenApps", "computerGenCounts", "computerIncludeRealTime", "phoneGenApps", "phoneGenCounts", "phoneIncludeRealTime", "phoneIncludeChatContext", "cphoneWallpaperUrl", "cphoneWallpaperAssetId", "linkedAccountChats"]
  };
  const newScope298 = ["id", "type", "nickname", "name", "realName", "realname", "avatarUrl", "avatarAssetId", "language"];
  const newScope299 = Object.values(newScope297).flat();
  const newScope300 = [{
    id: "imessage",
    name: "iMessage",
    description: "联系人、聊天、朋友圈、表情及线下记录",
    domains: ["imessage"],
    stores: scopeValue13.filter(newScope2204 => newScope2204 !== scopeValue9.imFriends),
    meta: [scopeValue16.imMomentsCoverAssetId]
  }, {
    id: "youtube",
    name: "YouTube",
    domains: ["youtube"]
  }, {
    id: "tiktok",
    name: "TikTok",
    domains: ["tiktok"]
  }, {
    id: "pay",
    name: "Pay",
    domains: ["pay"]
  }, {
    id: "bstage",
    name: "b.stage",
    domains: ["bstage"]
  }, {
    id: "x",
    name: "X",
    domains: ["x"],
    stores: [scopeValue9.xPosts, scopeValue9.xThreads, scopeValue9.xDms, scopeValue9.xAccountWorlds]
  }, {
    id: "shop",
    name: "Shop",
    legacyPrefixes: ["shopping_"]
  }, {
    id: "library",
    name: "Library",
    stores: [scopeValue9.libraryBooks, scopeValue9.libraryBookContent, scopeValue9.libraryPlaylists, scopeValue9.libraryTracks, scopeValue9.libraryDailyStats],
    settings: ["libraryPreferences"]
  }, {
    id: "netflix",
    name: "Netflix",
    domains: ["netflix"]
  }, {
    id: "loves",
    name: "Loves",
    description: "情侣空间、日记、纪念日等独立内容"
  }, {
    id: "gallery",
    name: "Gallery",
    description: "仅独立相册；聊天来源图片随 iMessage 备份"
  }, {
    id: "mcp",
    name: "MCP",
    legacy: ["u2phone_mcp_http_servers_v3", "u2phone_mcp_chat_config_v1"]
  }, {
    id: "ao3",
    name: "AO3",
    domains: ["ao3"]
  }, {
    id: "diary",
    name: "Diary",
    domains: ["diary"]
  }, {
    id: "call",
    name: "call",
    domains: ["call"]
  }, {
    id: "cphone",
    name: "Cphone",
    metaPrefixes: ["cphone:"]
  }, {
    id: "treasure",
    name: "Treasure",
    domains: ["treasure"]
  }, {
    id: "cycle",
    name: "Cycle",
    domains: ["cycle"]
  }, {
    id: "appstore",
    name: "App Store",
    description: "包含自制 App、源码和存档",
    domains: ["appstore", "custom_apps"],
    domainPrefixes: ["custom_app_data:"]
  }];
  function newScope301() {
    return newScope300.map(({
      id: newScope2205,
      name: newScope2206,
      description: newScope2207
    }) => ({
      id: newScope2205,
      name: newScope2206,
      description: newScope2207 || "应用内容与本地资源"
    }));
  }
  function newScope302(newScope2208, newScope2209, newScope2210) {
    return (newScope2208[newScope2209] || []).includes(newScope2210) || (newScope2208[`${newScope2209 === "domains" ? "domain" : newScope2209}Prefixes`] || []).some(newScope2211 => newScope2210.startsWith(newScope2211));
  }
  function newScope303(newScope2212) {
    if (!Array.isArray(newScope2212) || !newScope2212.length || newScope2212.some(newScope2214 => typeof newScope2214 !== "string")) throw new Error("请至少选择一个应用");
    const newScope2213 = [...new Set(newScope2212)];
    if (newScope2213.some(newScope2215 => !newScope300.some(newScope2216 => newScope2216.id === newScope2215))) throw new Error("备份包含未知应用");
    return newScope2213;
  }
  function newScope304(newScope2217, newScope2218) {
    const newScope2219 = {};
    const newScope2220 = newScope2218 === "imessage" ? Object.keys(newScope2217).filter(newScope2221 => !newScope299.includes(newScope2221) && newScope2221 !== "messages") : [...newScope298, ...(newScope297[newScope2218] || [])];
    newScope2220.forEach(newScope2222 => {
      if (Object.hasOwn(newScope2217, newScope2222)) newScope2219[newScope2222] = scopeValue47(newScope2217[newScope2222]);
    });
    return newScope2219;
  }
  function newScope305(newScope2223) {
    const newScope2224 = new Set();
    const newScope2225 = new Set(["friendId", "charId", "imCharId", "linkedCharId", "linkedFriendId", "imFriendId", "sourceCharId", "sourceNpcId", "speakerMemberId", "senderMemberId", "boundCharIds", "memberIds", "members"]);
    const newScope2226 = newScope2227 => {
      if (!newScope2227 || typeof newScope2227 !== "object") return;
      for (const [newScope2228, newScope2229] of Object.entries(newScope2227)) {
        if (newScope2225.has(newScope2228)) {
          for (const newScope2230 of Array.isArray(newScope2229) ? newScope2229 : [newScope2229]) if (["string", "number"].includes(typeof newScope2230)) newScope2224.add(String(newScope2230));
        }
        newScope2226(newScope2229);
      }
    };
    newScope2226(newScope2223);
    for (const newScope2231 of newScope2223.domains) if (newScope2231.name === "call") Object.keys(newScope2231.value?.threads || {}).forEach(newScope2232 => newScope2224.add(newScope2232));
    return newScope2224;
  }
  function newScope306(newScope2233, newScope2234) {
    const newScope2235 = newScope2234[scopeValue9.appDomains]?.find(newScope2240 => newScope2240.name === "legacy")?.value || {};
    const newScope2236 = newScope2233.id === "imessage" || newScope297[newScope2233.id];
    const newScope2237 = {
      stores: Object.fromEntries((newScope2233.stores || []).map(newScope2241 => [newScope2241, scopeValue47(newScope2234[newScope2241] || [])])),
      domains: scopeValue47((newScope2234[scopeValue9.appDomains] || []).filter(newScope2242 => newScope302(newScope2233, "domains", newScope2242.name))),
      settings: scopeValue47((newScope2234[scopeValue9.settings] || []).filter(newScope2243 => newScope302(newScope2233, "settings", newScope2243.key))),
      meta: scopeValue47((newScope2234[scopeValue9.meta] || []).filter(newScope2244 => newScope302(newScope2233, "meta", newScope2244.key))),
      legacy: Object.fromEntries(Object.entries(newScope2235).filter(([newScope2245]) => newScope302(newScope2233, "legacy", newScope2245))),
      friends: newScope2236 ? (newScope2234[scopeValue9.imFriends] || []).filter(newScope2246 => newScope2233.id === "imessage" || newScope297[newScope2233.id].some(newScope2247 => Object.hasOwn(newScope2246, newScope2247))).map(newScope2248 => newScope304(newScope2248, newScope2233.id)) : []
    };
    const newScope2238 = new Set(newScope2237.friends.map(newScope2249 => String(newScope2249.id)));
    const newScope2239 = newScope305(newScope2237);
    for (const newScope2250 of newScope2234[scopeValue9.imFriends] || []) {
      if (!newScope2238.has(String(newScope2250.id)) && newScope2239.has(String(newScope2250.id))) newScope2237.friends.push(Object.fromEntries(newScope298.filter(newScope2251 => Object.hasOwn(newScope2250, newScope2251)).map(newScope2252 => [newScope2252, scopeValue47(newScope2250[newScope2252])])));
    }
    return newScope2237;
  }
  function newScope307(newScope2253) {
    const newScope2254 = scopeValue156(newScope2253);
    Object.values(newScope2253).forEach(newScope2255 => (newScope2255.meta || []).forEach(newScope2256 => {
      if (newScope2256.key === scopeValue16.imMomentsCoverAssetId && newScope2256.value) newScope2254.add(String(newScope2256.value));
    }));
    return newScope2254;
  }
  function newScope308(newScope2257) {
    return scopeValue57({
      app: newScope2257.app,
      backupType: newScope2257.backupType,
      formatVersion: newScope2257.formatVersion,
      schemaVersion: newScope2257.schemaVersion,
      appIds: newScope2257.appIds,
      apps: newScope2257.apps,
      assets: newScope2257.assets
    });
  }
  function newScope309(newScope2258, newScope2259) {
    const newScope2260 = {
      app: scopeValue6,
      backupType: "apps",
      formatVersion: 1,
      schemaVersion: scopeValue5,
      exportedAt: new Date().toISOString(),
      appIds: Object.keys(newScope2258),
      apps: newScope2258,
      assets: newScope2259
    };
    newScope2260.checksum = {
      algorithm: "fnv1a32",
      value: newScope308(newScope2260)
    };
    return newScope2260;
  }
  function newScope310(newScope2261) {
    if (newScope2261?.backupType !== scopeValue11) return newScope2261;
    const newScope2262 = scopeValue242(newScope2261).payload;
    const newScope2263 = {};
    for (const newScope2265 of ["imessage", ...Object.keys(newScope297)]) {
      const newScope2266 = newScope300.find(newScope2268 => newScope2268.id === newScope2265);
      const newScope2267 = newScope306(newScope2266, newScope2262.stores);
      if (newScope2265 === "imessage" || newScope2267.friends.length) newScope2263[newScope2265] = newScope2267;
    }
    const newScope2264 = newScope307(newScope2263);
    return newScope309(newScope2263, newScope2262.stores[scopeValue9.assets].filter(newScope2269 => newScope2264.has(newScope2269.id)));
  }
  function newScope311(newScope2270) {
    if (!newScope2270 || typeof newScope2270 !== "object") return;
    for (const [newScope2271, newScope2272] of Object.entries(newScope2270)) {
      if (["__proto__", "constructor", "prototype"].includes(newScope2271)) throw new Error("备份包含无效字段");
      newScope311(newScope2272);
    }
  }
  function newScope312(newScope2273) {
    newScope311(newScope2273);
    const newScope2274 = newScope310(newScope2273);
    if (newScope2274?.app !== scopeValue6 || newScope2274.backupType !== "apps" || newScope2274.formatVersion !== 1 || !Number.isInteger(newScope2274.schemaVersion) || newScope2274.schemaVersion > scopeValue5 || !newScope2274.apps || Array.isArray(newScope2274.apps) || !Array.isArray(newScope2274.assets)) throw new Error("应用备份格式不支持");
    const newScope2275 = newScope303(newScope2274.appIds);
    if (newScope2275.length !== newScope2274.appIds.length || Object.keys(newScope2274.apps).length !== newScope2275.length || Object.keys(newScope2274.apps).some(newScope2280 => !newScope2275.includes(newScope2280))) throw new Error("应用清单不一致");
    if (newScope2274.checksum?.value !== newScope308(newScope2274)) throw new Error("备份校验失败，文件可能已损坏");
    const newScope2276 = (newScope2281, newScope2282, newScope2283 = () => true) => {
      if (!Array.isArray(newScope2281)) throw new Error("备份记录格式无效");
      const newScope2284 = new Set();
      for (const newScope2285 of newScope2281) {
        const newScope2286 = newScope2285?.[newScope2282];
        if (!newScope2285 || typeof newScope2285 !== "object" || Array.isArray(newScope2285) || !["string", "number"].includes(typeof newScope2286) || String(newScope2286) === "" || newScope2284.has(String(newScope2286)) || !newScope2283(newScope2285)) {
          throw new Error("备份包含重复或越界记录");
        }
        newScope2284.add(String(newScope2286));
      }
    };
    const newScope2277 = [];
    for (const newScope2287 of newScope2275) {
      const newScope2288 = newScope300.find(newScope2291 => newScope2291.id === newScope2287);
      const newScope2289 = newScope2274.apps[newScope2287];
      if (!newScope2289 || !newScope2289.stores || !newScope2289.legacy || Array.isArray(newScope2289.legacy) || Object.keys(newScope2289).some(newScope2292 => !["stores", "domains", "settings", "meta", "legacy", "friends"].includes(newScope2292))) throw new Error("应用数据格式无效");
      if (Object.keys(newScope2289.stores).length !== (newScope2288.stores || []).length || Object.keys(newScope2289.stores).some(newScope2293 => !(newScope2288.stores || []).includes(newScope2293))) throw new Error("备份包含越界数据表");
      for (const newScope2294 of newScope2288.stores || []) newScope2276(newScope2289.stores[newScope2294], scopeValue259[newScope2294]);
      newScope2276(newScope2289.domains, "name", newScope2295 => newScope302(newScope2288, "domains", newScope2295.name));
      newScope2276(newScope2289.settings, "key", newScope2296 => newScope302(newScope2288, "settings", newScope2296.key));
      newScope2276(newScope2289.meta, "key", newScope2297 => newScope302(newScope2288, "meta", newScope2297.key));
      if (Object.keys(newScope2289.legacy).some(newScope2298 => !newScope302(newScope2288, "legacy", newScope2298))) throw new Error("备份包含越界设置");
      newScope2276(newScope2289.friends, "id", newScope2299 => {
        if (newScope2287 === "imessage") return !newScope299.some(newScope2300 => Object.hasOwn(newScope2299, newScope2300)) && !Object.hasOwn(newScope2299, "messages");
        return Object.keys(newScope2299).every(newScope2301 => [...newScope298, ...(newScope297[newScope2287] || [])].includes(newScope2301));
      });
      const newScope2290 = newScope2289.friends.length + newScope2289.domains.length + newScope2289.settings.length + newScope2289.meta.length + Object.keys(newScope2289.legacy).length + Object.values(newScope2289.stores).reduce((newScope2302, newScope2303) => newScope2302 + newScope2303.length, 0);
      newScope2277.push({
        ...newScope301().find(newScope2304 => newScope2304.id === newScope2287),
        recordCount: newScope2290,
        assetCount: newScope307({
          [newScope2287]: newScope2289
        }).size,
        approximateBytes: scopeValue56(newScope2289)
      });
    }
    newScope2276(newScope2274.assets, "id", newScope2305 => typeof newScope2305.dataUrl === "string" && !!scopeValue73(newScope2305.dataUrl));
    const newScope2278 = newScope307(newScope2274.apps);
    const newScope2279 = new Set(newScope2274.assets.map(newScope2306 => newScope2306.id));
    if ([...newScope2278].some(newScope2307 => !newScope2279.has(newScope2307)) || [...newScope2279].some(newScope2308 => !newScope2278.has(newScope2308))) throw new Error("备份中的本地资源缺失或越界");
    return {
      payload: newScope2274,
      summary: {
        apps: newScope2277,
        appIds: newScope2275,
        recordCount: newScope2277.reduce((newScope2309, newScope2310) => newScope2309 + newScope2310.recordCount, 0),
        assetCount: newScope2274.assets.length,
        approximateBytes: scopeValue56(newScope2274),
        legacy: newScope2273.backupType === scopeValue11
      }
    };
  }
  function newScope313(newScope2311) {
    return newScope312(newScope2311).summary;
  }
  async function newScope314(newScope2312, newScope2313) {
    const newScope2314 = newScope303(newScope2312);
    if (scopeValue32) await scopeValue32;
    if (!(await scopeValue116())) throw new Error("待保存数据未完成");
    scopeValue51(newScope2313, "正在读取所选应用...", 5);
    const newScope2315 = await scopeValue83(scopeValue10, "readonly", async newScope2320 => {
      const newScope2321 = await Promise.all(scopeValue10.map(newScope2322 => scopeValue77(newScope2320[newScope2322].getAll())));
      return Object.fromEntries(scopeValue10.map((newScope2323, newScope2324) => [newScope2323, newScope2321[newScope2324]]));
    });
    const newScope2316 = Object.fromEntries(newScope2314.map(newScope2325 => [newScope2325, newScope306(newScope300.find(newScope2326 => newScope2326.id === newScope2325), newScope2315)]));
    const newScope2317 = newScope307(newScope2316);
    const newScope2318 = [];
    for (const newScope2327 of newScope2315[scopeValue9.assets]) {
      if (newScope2317.has(newScope2327.id)) newScope2318.push(await scopeValue231(scopeValue9.assets, newScope2327));
    }
    const newScope2319 = newScope309(newScope2316, newScope2318);
    newScope312(newScope2319);
    scopeValue51(newScope2313, "应用备份已准备完成", 100);
    return new Blob([JSON.stringify(newScope2319)], {
      type: "application/json"
    });
  }
  function newScope315(newScope2328, newScope2329) {
    if (!newScope2328 || typeof newScope2328 !== "object") return;
    for (const [newScope2330, newScope2331] of Object.entries(newScope2328)) {
      if ((newScope2330 === "assetId" || newScope2330.endsWith("AssetId")) && typeof newScope2331 === "string" && newScope2329.has(newScope2331)) newScope2328[newScope2330] = newScope2329.get(newScope2331);else if (newScope2330.endsWith("AssetIds") && newScope2331 && typeof newScope2331 === "object") {
        Object.keys(newScope2331).forEach(newScope2332 => {
          if (newScope2329.has(newScope2331[newScope2332])) newScope2331[newScope2332] = newScope2329.get(newScope2331[newScope2332]);
        });
      } else newScope315(newScope2331, newScope2329);
    }
  }
  async function newScope316() {
    scopeValue26.clear();
    for (const newScope2333 of await scopeValue87(scopeValue9.appDomains)) {
      const newScope2334 = newScope2333.name === "x" ? await scopeValue109(newScope2333.value) : newScope2333.name === "desktop" ? await scopeValue107(newScope2333.value) : newScope2333.name === "netflix" ? scopeValue70(newScope2333.value) : newScope2333.value;
      scopeValue26.set(newScope2333.name, newScope2334);
    }
  }
  async function newScope317(newScope2335, newScope2336 = {}) {
    const newScope2337 = newScope312(newScope2335);
    const newScope2338 = newScope303(newScope2336.appIds || newScope2337.payload.appIds);
    if (newScope2338.some(newScope2349 => !newScope2337.payload.appIds.includes(newScope2349))) throw new Error("所选应用不在备份中");
    const newScope2339 = Object.fromEntries(newScope2338.map(newScope2350 => [newScope2350, scopeValue47(newScope2337.payload.apps[newScope2350])]));
    const newScope2340 = newScope307(newScope2339);
    const newScope2341 = newScope2337.payload.assets.filter(newScope2351 => newScope2340.has(newScope2351.id));
    const newScope2342 = await navigator.storage?.estimate?.();
    const newScope2343 = Math.max(4 * 1024 * 1024, scopeValue56({
      apps: newScope2339,
      assets: newScope2341
    }) * 1.2);
    if (newScope2342?.quota > 0 && newScope2342.quota - newScope2342.usage < newScope2343) throw new DOMException(`安全导入需要约 ${scopeValue286(newScope2343)} 的临时空间。`, "QuotaExceededError");
    const newScope2344 = window.crypto?.randomUUID?.() || `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const newScope2345 = new Map(newScope2341.map((newScope2352, newScope2353) => [newScope2352.id, `app_import_${newScope2344}_${newScope2353}`]));
    newScope315(newScope2339, newScope2345);
    Object.values(newScope2339).forEach(newScope2354 => newScope2354.meta.forEach(newScope2355 => {
      if (newScope2355.key === scopeValue16.imMomentsCoverAssetId && newScope2345.has(newScope2355.value)) newScope2355.value = newScope2345.get(newScope2355.value);
    }));
    const newScope2346 = newScope2341.map(newScope2356 => ({
      ...scopeValue232(scopeValue9.assets, newScope2356),
      id: newScope2345.get(newScope2356.id)
    }));
    scopeValue51(newScope2336.progressCallback, "正在替换所选应用...", 20);
    const newScope2347 = Object.values(scopeValue9);
    const newScope2348 = await scopeValue83(newScope2347, "readwrite", async (newScope2357, newScope2358) => {
      try {
        const newScope2359 = Object.fromEntries(await Promise.all(newScope2347.map(async newScope2368 => [newScope2368, await scopeValue77(newScope2357[newScope2368].getAll())])));
        const newScope2360 = newScope318(newScope2359);
        const newScope2361 = new Map(newScope2359[scopeValue9.imFriends].map(newScope2369 => [String(newScope2369.id), newScope2369]));
        const newScope2362 = new Set();
        if (newScope2338.includes("imessage")) for (const newScope2370 of newScope300.filter(newScope2371 => !newScope2338.includes(newScope2371.id))) {
          const newScope2372 = newScope306(newScope2370, newScope2359);
          newScope305(newScope2372).forEach(newScope2373 => newScope2362.add(newScope2373));
        }
        const newScope2363 = newScope2359[scopeValue9.appDomains].find(newScope2374 => newScope2374.name === "legacy");
        const newScope2364 = scopeValue47(newScope2363?.value || {});
        for (const newScope2375 of ["imessage", ...newScope2338.filter(newScope2376 => newScope2376 !== "imessage")].filter(newScope2377 => newScope2338.includes(newScope2377))) {
          const newScope2378 = newScope300.find(newScope2380 => newScope2380.id === newScope2375);
          const newScope2379 = newScope2339[newScope2375];
          for (const newScope2381 of newScope2378.stores || []) await scopeValue255(newScope2357[newScope2381], newScope2379.stores[newScope2381]);
          for (const [newScope2382, newScope2383, newScope2384] of [["domains", scopeValue9.appDomains, "name"], ["settings", scopeValue9.settings, "key"], ["meta", scopeValue9.meta, "key"]]) {
            for (const newScope2385 of newScope2359[newScope2383]) if (newScope302(newScope2378, newScope2382, newScope2385[newScope2384])) await scopeValue77(newScope2357[newScope2383].delete(newScope2385[newScope2384]));
            for (const newScope2386 of newScope2379[newScope2382]) await scopeValue77(newScope2357[newScope2383].put(scopeValue49(newScope2386)));
          }
          for (const newScope2387 of Object.keys(newScope2364)) if (newScope302(newScope2378, "legacy", newScope2387)) delete newScope2364[newScope2387];
          Object.assign(newScope2364, newScope2379.legacy);
          if (newScope2375 === "imessage") {
            for (const [newScope2388, newScope2389] of newScope2361) {
              if (newScope2362.has(newScope2388) || newScope299.some(newScope2390 => Object.hasOwn(newScope2389, newScope2390))) {
                newScope2361.set(newScope2388, Object.fromEntries([...newScope298, ...newScope299].filter(newScope2391 => Object.hasOwn(newScope2389, newScope2391)).map(newScope2392 => [newScope2392, newScope2389[newScope2392]])));
              } else newScope2361.delete(newScope2388);
            }
            for (const newScope2393 of newScope2379.friends) {
              const newScope2394 = newScope2361.get(String(newScope2393.id)) || {};
              newScope2361.set(String(newScope2393.id), {
                ...newScope2393,
                ...Object.fromEntries(newScope299.filter(newScope2395 => Object.hasOwn(newScope2394, newScope2395)).map(newScope2396 => [newScope2396, newScope2394[newScope2396]]))
              });
            }
          } else if (newScope297[newScope2375]) {
            for (const newScope2397 of newScope2361.values()) newScope297[newScope2375].forEach(newScope2398 => delete newScope2397[newScope2398]);
            for (const newScope2399 of newScope2379.friends) {
              const newScope2400 = String(newScope2399.id);
              const newScope2401 = newScope2361.get(newScope2400) || Object.fromEntries(newScope298.filter(newScope2402 => Object.hasOwn(newScope2399, newScope2402)).map(newScope2403 => [newScope2403, newScope2399[newScope2403]]));
              for (const newScope2404 of newScope297[newScope2375]) if (Object.hasOwn(newScope2399, newScope2404)) newScope2401[newScope2404] = newScope2399[newScope2404];
              newScope2361.set(newScope2400, newScope2401);
            }
          }
          if (newScope2375 !== "imessage") for (const newScope2405 of newScope2379.friends) {
            if (!newScope2361.has(String(newScope2405.id))) newScope2361.set(String(newScope2405.id), Object.fromEntries(newScope298.filter(newScope2406 => Object.hasOwn(newScope2405, newScope2406)).map(newScope2407 => [newScope2407, newScope2405[newScope2407]])));
          }
        }
        if (newScope2338.includes("imessage") || newScope2338.some(newScope2408 => newScope297[newScope2408] || newScope2339[newScope2408].friends.length)) await scopeValue255(newScope2357[scopeValue9.imFriends], [...newScope2361.values()]);
        if (newScope2338.some(newScope2409 => newScope2409 === "shop" || newScope2409 === "mcp")) await scopeValue77(newScope2357[scopeValue9.appDomains].put({
          ...newScope2363,
          name: "legacy",
          value: newScope2364
        }));
        if (newScope2338.includes("imessage")) await scopeValue77(newScope2357[scopeValue9.vectorMemoryIndex].clear());
        for (const newScope2410 of newScope2346) await scopeValue77(newScope2357[scopeValue9.assets].put(newScope2410));
        const newScope2365 = Object.fromEntries(await Promise.all(newScope2347.filter(newScope2411 => newScope2411 !== scopeValue9.assets).map(async newScope2412 => [newScope2412, await scopeValue77(newScope2357[newScope2412].getAll())])));
        const newScope2366 = newScope318(newScope2365);
        const newScope2367 = [];
        for (const newScope2413 of newScope2360) {
          if (!newScope2366.has(newScope2413)) {
            await scopeValue77(newScope2357[scopeValue9.assets].delete(newScope2413));
            newScope2367.push(newScope2413);
          }
        }
        return {
          appIds: newScope2338,
          assetCount: newScope2346.length,
          releasedAssetIds: newScope2367
        };
      } catch (newScope2414) {
        newScope2358.abort();
        throw newScope2414;
      }
    });
    scopeValue60();
    await newScope316();
    scopeValue30.status = "saved";
    scopeValue30.lastError = null;
    scopeValue30.lastCommitAt = Date.now();
    scopeValue95({
      ...scopeValue30,
      reason: "app-import-complete"
    });
    scopeValue51(newScope2336.progressCallback, "应用数据恢复完成", 100);
    return newScope2348;
  }
  function newScope318(newScope2415) {
    const newScope2416 = scopeValue156(Object.fromEntries(Object.entries(newScope2415).filter(([newScope2417]) => newScope2417 !== scopeValue9.assets)));
    for (const newScope2418 of newScope2415[scopeValue9.meta] || []) if (newScope2418.key === scopeValue16.imMomentsCoverAssetId && newScope2418.value) newScope2416.add(String(newScope2418.value));
    return newScope2416;
  }
  const newScope319 = new Set(["imessage_voice_tts", "imessage_offline_tts"]);
  const newScope320 = ["ttsAudioAssetId", "ttsAudioAssets", "ttsAudioUrl", "ttsAudioCache", "ttsAudioText", "ttsAudioPromise"];
  function newScope321(newScope2419, newScope2420, newScope2421 = new WeakSet()) {
    if (!newScope2419 || typeof newScope2419 !== "object" || newScope2421.has(newScope2419) || scopeValue48(newScope2419)) return false;
    newScope2421.add(newScope2419);
    let newScope2422 = false;
    for (const newScope2423 of Object.keys(newScope2419)) {
      if (newScope320.includes(newScope2423)) {
        const newScope2424 = newScope2419[newScope2423];
        if (newScope2423 === "ttsAudioAssetId" && newScope2424) newScope2420.assets.add(String(newScope2424));
        if (newScope2423 === "ttsAudioAssets") (Array.isArray(newScope2424) ? newScope2424 : []).forEach(newScope2425 => {
          if (newScope2425?.assetId) newScope2420.assets.add(String(newScope2425.assetId));
        });
        if (newScope2423 === "ttsAudioUrl" && newScope2424) newScope2420.urls.add(String(newScope2424));
        if (newScope2423 === "ttsAudioCache" && newScope2424?.url) newScope2420.urls.add(String(newScope2424.url));
        delete newScope2419[newScope2423];
        newScope2422 = true;
      } else if (newScope321(newScope2419[newScope2423], newScope2420, newScope2421)) newScope2422 = true;
    }
    return newScope2422;
  }
  function newScope322(newScope2426) {
    const newScope2427 = {
      assets: new Set(),
      urls: new Set()
    };
    const newScope2428 = [];
    for (const newScope2439 of [scopeValue9.imFriends, scopeValue9.imMessages, scopeValue9.imMomentMessages, scopeValue9.appDomains, scopeValue9.storageCheckpoints]) {
      for (const newScope2440 of newScope2426[newScope2439] || []) {
        if (newScope2439 === scopeValue9.appDomains && !["imessage", "call"].includes(newScope2440.name)) continue;
        if (newScope2439 === scopeValue9.storageCheckpoints && newScope2440.id === "domain:treasure") continue;
        const newScope2441 = scopeValue47(newScope2440);
        if (newScope321(newScope2441, newScope2427)) newScope2428.push({
          name: newScope2439,
          row: newScope2441
        });
      }
    }
    for (const newScope2442 of newScope2426[scopeValue9.assets] || []) if (newScope319.has(newScope2442.ownerType)) newScope2427.assets.add(newScope2442.id);
    for (const newScope2443 of window.u2Tts?.getCachedAudioUrls?.() || []) newScope2427.urls.add(newScope2443);
    const newScope2429 = {
      assets: new Set(),
      urls: new Set()
    };
    const newScope2430 = scopeValue49(window.imData?.friends || []);
    newScope321(newScope2430, newScope2429);
    newScope2429.assets.forEach(newScope2444 => newScope2427.assets.add(newScope2444));
    newScope2429.urls.forEach(newScope2445 => newScope2427.urls.add(newScope2445));
    const newScope2431 = {
      ...newScope2426
    };
    const newScope2432 = new Map(newScope2428.map(({
      name: newScope2446,
      row: newScope2447
    }) => [`${newScope2446}:${newScope2447[scopeValue259[newScope2446]]}`, newScope2447]));
    for (const newScope2448 of Object.keys(newScope2426)) newScope2431[newScope2448] = newScope2426[newScope2448].map(newScope2449 => newScope2432.get(`${newScope2448}:${newScope2449[scopeValue259[newScope2448]]}`) || newScope2449);
    const newScope2433 = newScope318(newScope2431);
    const newScope2434 = new Map((newScope2426[scopeValue9.assets] || []).map(newScope2450 => [newScope2450.id, newScope2450]));
    const newScope2435 = [...newScope2427.assets].filter(newScope2451 => newScope2434.has(newScope2451) && !newScope2433.has(newScope2451));
    const newScope2436 = [...newScope2427.assets].filter(newScope2452 => newScope2434.has(newScope2452) && newScope2433.has(newScope2452));
    const newScope2437 = newScope2435.reduce((newScope2453, newScope2454) => newScope2453 + scopeValue291(newScope2434.get(newScope2454)), 0);
    const newScope2438 = [...newScope2427.urls].reduce((newScope2455, newScope2456) => newScope2455 + (newScope2456.startsWith("data:audio/") ? scopeValue73(newScope2456)?.size || 0 : 0), 0);
    return {
      updates: newScope2428,
      removable: newScope2435,
      summary: {
        count: newScope2435.length + newScope2427.urls.size,
        bytes: newScope2437 + newScope2438,
        preservedSharedCount: newScope2436.length,
        recordCount: newScope2428.length
      }
    };
  }
  async function newScope323() {
    const newScope2457 = Object.values(scopeValue9);
    return scopeValue83(newScope2457, "readonly", async newScope2458 => Object.fromEntries(await Promise.all(newScope2457.map(async newScope2459 => [newScope2459, await scopeValue77(newScope2458[newScope2459].getAll())]))));
  }
  async function newScope324() {
    if (scopeValue32) await scopeValue32;
    return newScope322(await newScope323()).summary;
  }
  async function newScope325(newScope2460 = {}) {
    newScope48 = true;
    newScope47 += 1;
    scopeValue30.status = "saving";
    scopeValue51(newScope2460.progressCallback, "正在清理生成的语音缓存...", 10);
    try {
      const newScope2461 = await newScope323();
      const newScope2462 = newScope322(newScope2461);
      const newScope2463 = {
        ...newScope2462.summary,
        clearedAt: Date.now(),
        bytesFreed: newScope2462.summary.bytes
      };
      const newScope2464 = [...new Set([...newScope2462.updates.map(newScope2466 => newScope2466.name), scopeValue9.assets, scopeValue9.meta])];
      await scopeValue83(newScope2464, "readwrite", async (newScope2467, newScope2468) => {
        try {
          for (const {
            name: newScope2469,
            row: newScope2470
          } of newScope2462.updates) await scopeValue77(newScope2467[newScope2469].put(newScope2470));
          for (const newScope2471 of newScope2462.removable) await scopeValue77(newScope2467[scopeValue9.assets].delete(newScope2471));
          await scopeValue77(newScope2467[scopeValue9.meta].put({
            key: "storage_last_voice_cleanup",
            value: newScope2463
          }));
        } catch (newScope2472) {
          newScope2468.abort();
          throw newScope2472;
        }
      });
      const newScope2465 = {
        assets: new Set(),
        urls: new Set()
      };
      newScope321(window.imData?.friends, newScope2465);
      newScope321(window.imData?.currentActiveFriend, newScope2465);
      window.u2Tts?.clearAudioCache?.();
      window.imVoiceMessageAudio?.clearCache?.();
      scopeValue60();
      await newScope316();
      scopeValue30.status = "saved";
      scopeValue30.lastError = null;
      scopeValue30.lastVoiceCleanup = newScope2463;
      scopeValue95({
        ...scopeValue30,
        reason: "voice-cleanup-complete"
      });
      scopeValue51(newScope2460.progressCallback, "语音缓存已清理", 100);
      return scopeValue47(newScope2463);
    } catch (newScope2473) {
      scopeValue30.status = "error";
      scopeValue30.lastError = newScope2473?.message || String(newScope2473);
      scopeValue95({
        ...scopeValue30,
        reason: "voice-cleanup-error"
      });
      throw newScope2473;
    } finally {
      newScope48 = false;
    }
  }
  function scopeValue286(scopeValue2102 = 0) {
    const scopeValue2103 = Math.max(0, Number(scopeValue2102) || 0);
    if (scopeValue2103 < 1024) return `${scopeValue2103} B`;
    const scopeValue2104 = ["KB", "MB", "GB", "TB"];
    let scopeValue2105 = scopeValue2103 / 1024;
    let scopeValue2106 = 0;
    while (scopeValue2105 >= 1024 && scopeValue2106 < scopeValue2104.length - 1) {
      scopeValue2105 /= 1024;
      scopeValue2106 += 1;
    }
    const scopeValue2107 = scopeValue2105 >= 100 ? 0 : scopeValue2105 >= 10 ? 1 : 2;
    return `${scopeValue2105.toFixed(scopeValue2107)} ${scopeValue2104[scopeValue2106]}`;
  }
  async function scopeValue287() {
    const scopeValue2108 = await scopeValue298({
      skipReady: true
    });
    return Math.max(0, Number(scopeValue2108.logicalBytes) || 0);
  }
  async function scopeValue288() {
    const [scopeValue2109, scopeValue2110] = await Promise.all([scopeValue61(), scopeValue287()]);
    return {
      cacheBytes: scopeValue2109,
      totalBytes: scopeValue2110,
      cacheFormatted: scopeValue286(scopeValue2109),
      totalFormatted: scopeValue286(scopeValue2110),
      label: `${scopeValue286(scopeValue2109)} / ${scopeValue286(scopeValue2110)}`
    };
  }
  async function scopeValue289() {
    if (scopeValue32) await scopeValue32;
    let scopeValue2111 = 0;
    let scopeValue2112 = 0;
    let scopeValue2113 = false;
    try {
      if (navigator.storage?.estimate) {
        const scopeValue2115 = await navigator.storage.estimate();
        scopeValue2111 = Math.max(0, Number(scopeValue2115?.usage) || 0);
        scopeValue2112 = Math.max(0, Number(scopeValue2115?.quota) || 0);
      }
      if (navigator.storage?.persisted) scopeValue2113 = !!(await navigator.storage.persisted());
    } catch (scopeValue2116) {}
    const scopeValue2114 = await scopeValue298({
      skipReady: true
    });
    return {
      ...scopeValue47(scopeValue30),
      usage: scopeValue2111,
      quota: scopeValue2112,
      ratio: scopeValue2112 > 0 ? scopeValue2111 / scopeValue2112 : 0,
      persisted: scopeValue2113,
      breakdown: scopeValue2114
    };
  }
  function scopeValue290(scopeValue2117, scopeValue2118 = new WeakSet()) {
    if (!scopeValue2117 || typeof scopeValue2117 !== "object") return 0;
    if (typeof Blob !== "undefined" && scopeValue2117 instanceof Blob) return Math.max(0, Number(scopeValue2117.size) || 0);
    if (scopeValue2118.has(scopeValue2117)) return 0;
    scopeValue2118.add(scopeValue2117);
    if (Array.isArray(scopeValue2117)) return scopeValue2117.reduce((scopeValue2119, scopeValue2120) => scopeValue2119 + scopeValue290(scopeValue2120, scopeValue2118), 0);
    return Object.values(scopeValue2117).reduce((scopeValue2121, scopeValue2122) => scopeValue2121 + scopeValue290(scopeValue2122, scopeValue2118), 0);
  }
  function scopeValue291(scopeValue2123) {
    return scopeValue56(scopeValue2123) + scopeValue290(scopeValue2123);
  }
  const scopeValue292 = {
    appDomains: "应用状态",
    settings: "应用状态",
    accounts: "应用状态",
    appState: "应用状态",
    theme: "应用状态",
    worldbooks: "应用状态",
    meta: "应用状态",
    imFriends: "iMessage",
    imChatSummaries: "iMessage",
    imMessages: "iMessage",
    imMoments: "iMessage",
    imMomentMessages: "iMessage",
    imStickers: "iMessage",
    xPosts: "X",
    xThreads: "X",
    xDms: "X",
    xAccountWorlds: "X",
    assets: "本地资源",
    libraryBooks: "书库",
    libraryBookContent: "书库",
    libraryPlaylists: "书库",
    libraryTracks: "书库",
    libraryDailyStats: "书库",
    storageCheckpoints: "冗余历史"
  };
  const scopeValue293 = {
    imessage: "iMessage",
    x: "X",
    desktop: "桌面小组件",
    theme: "主题",
    notifications: "通知",
    other: "其他来源"
  };
  const scopeValue294 = {
    image: "图片",
    audio: "音频",
    video: "视频",
    font: "字体",
    other: "其他文件"
  };
  function scopeValue295(scopeValue2124 = {}) {
    const scopeValue2125 = String(scopeValue2124.ownerType || "").trim().toLowerCase();
    const scopeValue2126 = String(scopeValue2124.kind || "").trim().toLowerCase();
    if (scopeValue2125.startsWith("im_") || scopeValue2125.startsWith("imessage_")) return "imessage";
    if (scopeValue2125.startsWith("x_")) return "x";
    if (scopeValue2125 === "desktop_widget") return "desktop";
    if (scopeValue2125 === "system_notification") return "notifications";
    if (scopeValue2125 === "theme" || scopeValue2126 === "theme-font") return "theme";
    return "other";
  }
  function scopeValue296(scopeValue2127 = {}) {
    const scopeValue2128 = String(scopeValue2127.blob?.type || scopeValue2127.mimeType || "").trim().toLowerCase();
    if (scopeValue2128.startsWith("image/")) return "image";
    if (scopeValue2128.startsWith("audio/")) return "audio";
    if (scopeValue2128.startsWith("video/")) return "video";
    if (String(scopeValue2127.kind || "").trim().toLowerCase() === "theme-font" || scopeValue2128.startsWith("font/") || /^(application\/(?:font-|x-font-|woff|x-woff|vnd\.ms-fontobject))/.test(scopeValue2128)) return "font";
    return "other";
  }
  function scopeValue297(scopeValue2129 = []) {
    const scopeValue2130 = new Map();
    let scopeValue2131 = 0;
    let scopeValue2132 = 0;
    scopeValue2129.forEach(scopeValue2134 => {
      const scopeValue2135 = scopeValue291(scopeValue2134);
      const scopeValue2136 = scopeValue295(scopeValue2134);
      const scopeValue2137 = scopeValue296(scopeValue2134);
      if (!scopeValue2130.has(scopeValue2136)) {
        scopeValue2130.set(scopeValue2136, {
          key: scopeValue2136,
          label: scopeValue293[scopeValue2136],
          count: 0,
          bytes: 0,
          types: new Map()
        });
      }
      const scopeValue2138 = scopeValue2130.get(scopeValue2136);
      if (!scopeValue2138.types.has(scopeValue2137)) {
        scopeValue2138.types.set(scopeValue2137, {
          key: scopeValue2137,
          label: scopeValue294[scopeValue2137],
          count: 0,
          bytes: 0
        });
      }
      const scopeValue2139 = scopeValue2138.types.get(scopeValue2137);
      scopeValue2131 += 1;
      scopeValue2132 += scopeValue2135;
      scopeValue2138.count += 1;
      scopeValue2138.bytes += scopeValue2135;
      scopeValue2139.count += 1;
      scopeValue2139.bytes += scopeValue2135;
    });
    const scopeValue2133 = (scopeValue2140, scopeValue2141) => scopeValue2141.bytes - scopeValue2140.bytes || scopeValue2140.label.localeCompare(scopeValue2141.label, "zh-CN");
    return {
      count: scopeValue2131,
      bytes: scopeValue2132,
      sources: Array.from(scopeValue2130.values(), scopeValue2142 => ({
        key: scopeValue2142.key,
        label: scopeValue2142.label,
        count: scopeValue2142.count,
        bytes: scopeValue2142.bytes,
        types: Array.from(scopeValue2142.types.values()).sort(scopeValue2133)
      })).sort(scopeValue2133)
    };
  }
  async function scopeValue298(scopeValue2143 = {}) {
    if (!scopeValue2143.skipReady && scopeValue32) await scopeValue32;
    const scopeValue2144 = {};
    const scopeValue2145 = {};
    let scopeValue2146 = 0;
    let scopeValue2147 = {
      count: 0,
      bytes: 0,
      sources: []
    };
    for (const [scopeValue2159, scopeValue2160] of Object.entries(scopeValue9)) {
      const scopeValue2161 = await scopeValue87(scopeValue2160);
      if (scopeValue2159 === "assets") scopeValue2147 = scopeValue297(scopeValue2161);
      const scopeValue2162 = scopeValue2159 === "assets" ? scopeValue2147.bytes : scopeValue2161.reduce((scopeValue2165, scopeValue2166) => scopeValue2165 + scopeValue291(scopeValue2166), 0);
      scopeValue2144[scopeValue2160] = {
        count: scopeValue2161.length,
        bytes: scopeValue2162
      };
      scopeValue2146 += scopeValue2162;
      const scopeValue2163 = scopeValue292[scopeValue2159] || "其他数据";
      const scopeValue2164 = scopeValue2145[scopeValue2163] || {
        count: 0,
        bytes: 0
      };
      scopeValue2164.count += scopeValue2161.length;
      scopeValue2164.bytes += scopeValue2162;
      scopeValue2145[scopeValue2163] = scopeValue2164;
    }
    const scopeValue2148 = scopeValue47(scopeValue2145);
    let scopeValue2149 = 0;
    let scopeValue2150 = 0;
    let scopeValue2151 = {};
    try {
      const scopeValue2167 = navigator.storage?.estimate ? await navigator.storage.estimate() : null;
      scopeValue2149 = Math.max(0, Number(scopeValue2167?.usage) || 0);
      scopeValue2150 = Math.max(0, Number(scopeValue2167?.quota) || 0);
      scopeValue2151 = scopeValue2167?.usageDetails && typeof scopeValue2167.usageDetails === "object" ? Object.fromEntries(Object.entries(scopeValue2167.usageDetails).map(([scopeValue2168, scopeValue2169]) => [scopeValue2168, Math.max(0, Number(scopeValue2169) || 0)])) : {};
    } catch (scopeValue2170) {}
    const scopeValue2152 = (...scopeValue2171) => scopeValue2171.reduce((scopeValue2172, scopeValue2173) => scopeValue2172 || Math.max(0, Number(scopeValue2151[scopeValue2173]) || 0), 0);
    const scopeValue2153 = scopeValue2152("indexedDB", "indexeddb");
    const scopeValue2154 = scopeValue2152("caches", "cacheStorage", "cache_storage");
    const scopeValue2155 = scopeValue2152("serviceWorkerRegistrations", "service_workers");
    const scopeValue2156 = scopeValue2153 > 0 ? Math.max(0, scopeValue2153 - scopeValue2146) : 0;
    const scopeValue2157 = scopeValue2153 + scopeValue2154 + scopeValue2155;
    const scopeValue2158 = Math.max(0, scopeValue2149 - (scopeValue2157 || scopeValue2146));
    if (scopeValue2156 > 0) scopeValue2145["IndexedDB 数据库开销"] = {
      count: 0,
      bytes: scopeValue2156
    };
    if (scopeValue2154 > 0) scopeValue2145.页面缓存 = {
      count: 0,
      bytes: scopeValue2154
    };
    if (scopeValue2158 > 0) scopeValue2145[scopeValue2153 > 0 ? "浏览器其他占用" : "浏览器未分类占用（估算）"] = {
      count: 0,
      bytes: scopeValue2158
    };
    return {
      stores: scopeValue2144,
      groups: scopeValue2145,
      logicalGroups: scopeValue2148,
      assetBreakdown: scopeValue2147,
      indexedDbBytes: scopeValue2146,
      logicalBytes: scopeValue2146,
      indexedDbReportedBytes: scopeValue2153,
      databaseOverheadBytes: scopeValue2156,
      cacheBytes: scopeValue2154,
      browserOtherBytes: scopeValue2158,
      originUsage: scopeValue2149,
      quota: scopeValue2150,
      usageDetails: scopeValue2151,
      classificationExact: scopeValue2153 > 0 || scopeValue2154 > 0,
      otherBytes: scopeValue2158,
      measuredAt: Date.now()
    };
  }
  async function scopeValue299() {
    const [scopeValue2174, scopeValue2175, scopeValue2176] = await Promise.all([scopeValue87(scopeValue9.imFriends), scopeValue87(scopeValue9.imMessages), scopeValue87(scopeValue9.imStickers)]);
    let scopeValue2177 = 0;
    for (const scopeValue2179 of scopeValue2174) {
      const scopeValue2180 = scopeValue178.some(([scopeValue2182]) => scopeValue63(scopeValue2179?.[scopeValue2182])) || Array.isArray(scopeValue2179?.members) && scopeValue2179.members.some(scopeValue2183 => scopeValue63(scopeValue2183?.avatarUrl));
      if (!scopeValue2180) continue;
      const scopeValue2181 = await scopeValue179(scopeValue2179);
      await scopeValue85(scopeValue9.imFriends, scopeValue49(scopeValue2181));
      scopeValue2177 += 1;
    }
    for (let scopeValue2184 = 0; scopeValue2184 < scopeValue2175.length; scopeValue2184 += 1) {
      const scopeValue2185 = scopeValue2175[scopeValue2184];
      if (!scopeValue174.some(([scopeValue2187]) => scopeValue63(scopeValue2185?.[scopeValue2187]))) continue;
      const scopeValue2186 = await scopeValue175(scopeValue2185.friendId, scopeValue2185, scopeValue2185.order ?? scopeValue2184);
      await scopeValue85(scopeValue9.imMessages, scopeValue171(scopeValue2185.friendId, scopeValue2186, scopeValue2185.order ?? scopeValue2184));
      scopeValue2177 += 1;
    }
    const scopeValue2178 = scopeValue2176.some(scopeValue2188 => (Array.isArray(scopeValue2188?.items) ? scopeValue2188.items : []).some(scopeValue2189 => scopeValue63(scopeValue2189?.url)));
    if (scopeValue2178) {
      await scopeValue221(scopeValue2176);
      scopeValue2177 += scopeValue2176.length;
    }
    return scopeValue2177;
  }
  async function scopeValue300(scopeValue2190 = {}) {
    if (!scopeValue2190.skipReady && scopeValue32) await scopeValue32;
    const scopeValue2191 = await scopeValue132("storage_compacted_v9");
    if (scopeValue2191 && !scopeValue2190.force) {
      scopeValue30.lastCompaction = scopeValue47(scopeValue2191);
      return scopeValue47(scopeValue2191);
    }
    const scopeValue2192 = await scopeValue298({
      skipReady: true
    });
    const [scopeValue2193, scopeValue2194, scopeValue2195, scopeValue2196, scopeValue2197, scopeValue2198, scopeValue2199, scopeValue2200, scopeValue2201, scopeValue2202, scopeValue2203, scopeValue2204, scopeValue2205] = await Promise.all([scopeValue87(scopeValue9.storageCheckpoints), scopeValue87(scopeValue9.appDomains), scopeValue87(scopeValue9.imFriends), scopeValue87(scopeValue9.imChatSummaries), scopeValue87(scopeValue9.imMessages), scopeValue87(scopeValue9.imMoments), scopeValue87(scopeValue9.imMomentMessages), scopeValue87(scopeValue9.imStickers), scopeValue87(scopeValue9.xPosts), scopeValue87(scopeValue9.xThreads), scopeValue87(scopeValue9.xDms), scopeValue84(scopeValue9.settings, "appState"), scopeValue84(scopeValue9.meta, scopeValue16.imMomentsCoverAssetId)]);
    const scopeValue2206 = new Set(scopeValue2194.map(scopeValue2250 => String(scopeValue2250?.name || "")).filter(Boolean));
    const scopeValue2207 = new Set(scopeValue2195.map(scopeValue2251 => String(scopeValue2251?.id || "")).filter(Boolean));
    const scopeValue2208 = new Set(scopeValue2196.map(scopeValue2252 => String(scopeValue2252?.friendId || "")).filter(Boolean));
    const scopeValue2209 = new Set(scopeValue2197.map(scopeValue2253 => String(scopeValue2253?.id || "")).filter(Boolean));
    const scopeValue2210 = new Set(scopeValue2198.map(scopeValue2254 => String(scopeValue2254?.id || "")).filter(Boolean));
    const scopeValue2211 = new Set(scopeValue2199.map(scopeValue2255 => String(scopeValue2255?.id || "")).filter(Boolean));
    const scopeValue2212 = new Set(scopeValue2200.map(scopeValue2256 => String(scopeValue2256?.categoryName || "")).filter(Boolean));
    const scopeValue2213 = new Set(scopeValue2201.map(scopeValue2257 => String(scopeValue2257?.id || "")).filter(Boolean));
    const scopeValue2214 = new Set(scopeValue2202.map(scopeValue2258 => String(scopeValue2258?.postId || "")).filter(Boolean));
    const scopeValue2215 = new Set(scopeValue2203.map(scopeValue2259 => String(scopeValue2259?.id || "")).filter(Boolean));
    const scopeValue2216 = [];
    const scopeValue2217 = [];
    const scopeValue2218 = [];
    const scopeValue2219 = [];
    const scopeValue2220 = [];
    const scopeValue2221 = [];
    let scopeValue2222;
    const scopeValue2223 = new Map();
    scopeValue2193.forEach(scopeValue2260 => {
      if (scopeValue2260?.id?.startsWith("domain:") && scopeValue2260.current?.value && typeof scopeValue2260.current.value === "object") {
        scopeValue2223.set(scopeValue2260.id.slice("domain:".length), scopeValue2260.current.value);
      }
      if (scopeValue2260?.id?.startsWith("im-friend:") && scopeValue2260.current?.value) {
        const scopeValue2261 = scopeValue2260.id.slice("im-friend:".length);
        if (!scopeValue2207.has(scopeValue2261)) scopeValue2217.push(scopeValue49(scopeValue47(scopeValue2260.current.value)));
      }
      if (scopeValue2260?.id?.startsWith("im-messages:") && Array.isArray(scopeValue2260.current?.value)) {
        const scopeValue2262 = scopeValue2260.id.slice("im-messages:".length);
        scopeValue2260.current.value.forEach((scopeValue2263, scopeValue2264) => {
          if (!scopeValue2263?.id || scopeValue2209.has(String(scopeValue2263.id))) return;
          scopeValue2218.push(scopeValue171(scopeValue2262, scopeValue2263, scopeValue2264));
        });
      }
      if (scopeValue2260?.id === "im-moments-cover" && !scopeValue2205 && scopeValue2260.current?.value) {
        scopeValue2222 = scopeValue47(scopeValue2260.current.value);
      }
    });
    const scopeValue2224 = scopeValue2204?.value && typeof scopeValue2204.value === "object" ? scopeValue2204.value : {};
    const scopeValue2225 = scopeValue2194.find(scopeValue2265 => scopeValue2265?.name === "imessage");
    const scopeValue2226 = [scopeValue2224.imessage, scopeValue2225?.value].filter(scopeValue2266 => scopeValue2266 && typeof scopeValue2266 === "object");
    scopeValue2226.forEach(scopeValue2267 => {
      const scopeValue2268 = Array.isArray(scopeValue2267.friends) ? scopeValue2267.friends : [];
      scopeValue2268.forEach(scopeValue2269 => {
        if (!scopeValue2269 || scopeValue2269.id == null) return;
        const scopeValue2270 = String(scopeValue2269.id);
        if (!scopeValue2207.has(scopeValue2270)) {
          const scopeValue2271 = scopeValue49(scopeValue47(scopeValue2269));
          delete scopeValue2271.messages;
          scopeValue2217.push({
            ...scopeValue2271,
            id: scopeValue2270
          });
          scopeValue2207.add(scopeValue2270);
        }
        (Array.isArray(scopeValue2269.messages) ? scopeValue2269.messages : []).forEach((scopeValue2272, scopeValue2273) => {
          if (!scopeValue2272) return;
          const scopeValue2274 = scopeValue171(scopeValue2270, scopeValue2272, scopeValue2273);
          if (scopeValue2209.has(String(scopeValue2274.id))) return;
          scopeValue2218.push(scopeValue2274);
          scopeValue2209.add(String(scopeValue2274.id));
        });
      });
      (Array.isArray(scopeValue2267.messages) ? scopeValue2267.messages : []).forEach((scopeValue2275, scopeValue2276) => {
        if (!scopeValue2275) return;
        const scopeValue2277 = String(scopeValue2275.friendId ?? scopeValue2275.chatId ?? "legacy");
        const scopeValue2278 = scopeValue171(scopeValue2277, scopeValue2275, scopeValue2276);
        if (scopeValue2209.has(String(scopeValue2278.id))) return;
        scopeValue2218.push(scopeValue2278);
        scopeValue2209.add(String(scopeValue2278.id));
      });
      (Array.isArray(scopeValue2267.moments) ? scopeValue2267.moments : []).forEach(scopeValue2279 => {
        if (!scopeValue2279 || scopeValue2279.id == null || scopeValue2210.has(String(scopeValue2279.id))) return;
        scopeValue2219.push(scopeValue49(scopeValue47(scopeValue2279)));
        scopeValue2210.add(String(scopeValue2279.id));
      });
      (Array.isArray(scopeValue2267.momentMessages) ? scopeValue2267.momentMessages : []).forEach(scopeValue2280 => {
        if (!scopeValue2280 || scopeValue2280.id == null || scopeValue2211.has(String(scopeValue2280.id))) return;
        scopeValue2220.push(scopeValue49(scopeValue47(scopeValue2280)));
        scopeValue2211.add(String(scopeValue2280.id));
      });
      (Array.isArray(scopeValue2267.stickers) ? scopeValue2267.stickers : []).forEach(scopeValue2281 => {
        if (!scopeValue2281 || scopeValue2281.categoryName == null || scopeValue2212.has(String(scopeValue2281.categoryName))) return;
        scopeValue2221.push(scopeValue49(scopeValue47(scopeValue2281)));
        scopeValue2212.add(String(scopeValue2281.categoryName));
      });
    });
    const scopeValue2227 = new Set([...Object.keys(scopeValue2224), ...scopeValue2223.keys()]);
    scopeValue2227.forEach(scopeValue2282 => {
      if (scopeValue2206.has(scopeValue2282)) return;
      const scopeValue2283 = scopeValue2223.get(scopeValue2282) ?? scopeValue2224[scopeValue2282];
      if (!scopeValue2283 || typeof scopeValue2283 !== "object") {
        throw new Error(`Cannot safely recover missing domain ${scopeValue2282}.`);
      }
      scopeValue2216.push({
        name: scopeValue2282,
        value: scopeValue2282 === "imessage" ? {
          uiState: scopeValue47(scopeValue2283.uiState && typeof scopeValue2283.uiState === "object" ? scopeValue2283.uiState : {})
        } : scopeValue47(scopeValue2283)
      });
    });
    const scopeValue2228 = scopeValue2194.find(scopeValue2284 => scopeValue2284?.name === "x")?.value || {};
    const scopeValue2229 = scopeValue2223.get("x") || scopeValue2224.x || {};
    const scopeValue2230 = {
      ...scopeValue2229,
      ...scopeValue2228,
      xGeneratedPosts: Array.isArray(scopeValue2229.xGeneratedPosts) ? scopeValue2229.xGeneratedPosts : [],
      xPostThreads: scopeValue2229.xPostThreads && typeof scopeValue2229.xPostThreads === "object" ? scopeValue2229.xPostThreads : {},
      xDirectMessages: Array.isArray(scopeValue2229.xDirectMessages) ? scopeValue2229.xDirectMessages : []
    };
    const scopeValue2231 = [];
    const scopeValue2232 = [...scopeValue2197, ...scopeValue2218];
    for (const scopeValue2285 of [...scopeValue2195, ...scopeValue2217]) {
      const scopeValue2286 = String(scopeValue2285?.id || "");
      if (!scopeValue2286 || scopeValue2208.has(scopeValue2286)) continue;
      const scopeValue2287 = scopeValue2232.filter(scopeValue2289 => String(scopeValue2289?.friendId || "") === scopeValue2286).sort((scopeValue2290, scopeValue2291) => (Number(scopeValue2290.order) || 0) - (Number(scopeValue2291.order) || 0));
      const scopeValue2288 = scopeValue2287.length > 0 ? await scopeValue186(scopeValue2287) : {
        lastMessagePreview: scopeValue2285.lastMessagePreview || "",
        lastMessageTimestamp: Number(scopeValue2285.lastMessageTimestamp) || 0,
        messageCount: Number(scopeValue2285.messageCount) || 0
      };
      scopeValue2231.push(scopeValue188(scopeValue2286, {
        ...scopeValue2288,
        unreadCount: scopeValue2285.unreadCount
      }));
    }
    const scopeValue2233 = Date.now();
    await scopeValue83([scopeValue9.appDomains, scopeValue9.imFriends, scopeValue9.imChatSummaries, scopeValue9.imMessages, scopeValue9.imMoments, scopeValue9.imMomentMessages, scopeValue9.imStickers, scopeValue9.xPosts, scopeValue9.xThreads, scopeValue9.xDms, scopeValue9.assets, scopeValue9.meta], "readwrite", scopeValue2292 => {
      scopeValue2216.forEach(({
        name: scopeValue2294,
        value: scopeValue2295
      }) => {
        const scopeValue2296 = scopeValue2294 === "x" ? scopeValue102(scopeValue2295, scopeValue2292[scopeValue9.assets]) : scopeValue49(scopeValue47(scopeValue2295));
        scopeValue2292[scopeValue9.appDomains].put({
          name: scopeValue2294,
          schemaVersion: scopeValue5,
          revision: 1,
          updatedAt: scopeValue2233,
          value: scopeValue2294 === "x" ? scopeValue98(scopeValue2296) : scopeValue2296
        });
      });
      [...scopeValue2195, ...scopeValue2217].forEach(scopeValue2297 => {
        const scopeValue2298 = scopeValue49(scopeValue47(scopeValue2297));
        delete scopeValue2298.messages;
        delete scopeValue2298.lastMessagePreview;
        delete scopeValue2298.lastMessageTimestamp;
        delete scopeValue2298.messageCount;
        delete scopeValue2298.unreadCount;
        scopeValue2292[scopeValue9.imFriends].put(scopeValue2298);
      });
      scopeValue2231.forEach(scopeValue2299 => scopeValue2292[scopeValue9.imChatSummaries].put(scopeValue2299));
      scopeValue2218.forEach(scopeValue2300 => scopeValue2292[scopeValue9.imMessages].put(scopeValue2300));
      scopeValue2219.forEach(scopeValue2301 => scopeValue2292[scopeValue9.imMoments].put(scopeValue2301));
      scopeValue2220.forEach(scopeValue2302 => scopeValue2292[scopeValue9.imMomentMessages].put(scopeValue2302));
      scopeValue2221.forEach(scopeValue2303 => scopeValue2292[scopeValue9.imStickers].put(scopeValue2303));
      if (scopeValue2225) {
        scopeValue2292[scopeValue9.appDomains].put({
          ...scopeValue2225,
          schemaVersion: scopeValue5,
          revision: Math.max(0, Number(scopeValue2225.revision) || 0) + 1,
          updatedAt: scopeValue2233,
          value: {
            uiState: scopeValue47(scopeValue2225.value?.uiState && typeof scopeValue2225.value.uiState === "object" ? scopeValue2225.value.uiState : {})
          }
        });
      }
      if (scopeValue2222 !== undefined) {
        scopeValue2292[scopeValue9.meta].put({
          key: scopeValue16.imMomentsCoverAssetId,
          value: scopeValue2222
        });
      }
      const scopeValue2293 = scopeValue102(scopeValue2230, scopeValue2292[scopeValue9.assets]);
      (scopeValue2293.xGeneratedPosts || []).forEach(scopeValue2304 => {
        if (scopeValue2304?.id != null && !scopeValue2213.has(String(scopeValue2304.id))) scopeValue2292[scopeValue9.xPosts].put(scopeValue49(scopeValue2304));
      });
      Object.entries(scopeValue2293.xPostThreads || {}).forEach(([scopeValue2305, scopeValue2306]) => {
        if (!scopeValue2214.has(String(scopeValue2305))) scopeValue2292[scopeValue9.xThreads].put({
          postId: String(scopeValue2305),
          value: scopeValue49(scopeValue2306)
        });
      });
      (scopeValue2293.xDirectMessages || []).forEach((scopeValue2307, scopeValue2308) => {
        const scopeValue2309 = String(scopeValue2307?.id ?? scopeValue2307?.charId ?? `x-dm-${scopeValue2308}`);
        if (!scopeValue2215.has(scopeValue2309)) scopeValue2292[scopeValue9.xDms].put({
          ...scopeValue49(scopeValue2307),
          id: scopeValue2309,
          updatedAt: Number(scopeValue2307?.updatedAt) || scopeValue2233
        });
      });
    });
    if (scopeValue2225) {
      scopeValue26.set("imessage", {
        uiState: scopeValue47(scopeValue2225.value?.uiState && typeof scopeValue2225.value.uiState === "object" ? scopeValue2225.value.uiState : {})
      });
    }
    const [scopeValue2234, scopeValue2235, scopeValue2236] = await Promise.all([scopeValue87(scopeValue9.appDomains), scopeValue87(scopeValue9.imMessages), scopeValue87(scopeValue9.xPosts)]);
    const scopeValue2237 = new Set(scopeValue2234.map(scopeValue2310 => String(scopeValue2310?.name || "")));
    const scopeValue2238 = new Set(scopeValue2235.map(scopeValue2311 => String(scopeValue2311?.id || "")));
    const scopeValue2239 = new Set(scopeValue2236.map(scopeValue2312 => String(scopeValue2312?.id || "")));
    if (scopeValue2216.some(({
      name: scopeValue2313
    }) => !scopeValue2237.has(scopeValue2313))) throw new Error("Domain recovery verification failed.");
    if (scopeValue2218.some(scopeValue2314 => !scopeValue2238.has(String(scopeValue2314.id)))) throw new Error("Message recovery verification failed.");
    if ((scopeValue2230.xGeneratedPosts || []).some(scopeValue2315 => scopeValue2315?.id != null && !scopeValue2239.has(String(scopeValue2315.id)))) {
      throw new Error("X post recovery verification failed.");
    }
    const scopeValue2240 = scopeValue2225 ? scopeValue291({
      value: {
        uiState: scopeValue2225.value?.uiState || {}
      }
    }) : 0;
    const scopeValue2241 = scopeValue2225 ? Math.max(0, scopeValue291(scopeValue2225) - scopeValue2240) : 0;
    const scopeValue2242 = scopeValue2193.reduce((scopeValue2316, scopeValue2317) => scopeValue2316 + scopeValue291(scopeValue2317), 0) + (scopeValue2204 ? scopeValue291(scopeValue2204) : 0) + scopeValue2241;
    await scopeValue83([scopeValue9.storageCheckpoints, scopeValue9.settings, scopeValue9.meta], "readwrite", scopeValue2318 => {
      scopeValue2318[scopeValue9.storageCheckpoints].clear();
      scopeValue2318[scopeValue9.settings].delete("appState");
      scopeValue2318[scopeValue9.meta].put({
        key: scopeValue16.schemaVersion,
        value: scopeValue5
      });
    });
    const scopeValue2243 = await scopeValue299();
    const scopeValue2244 = await scopeValue163();
    const scopeValue2245 = await scopeValue164();
    const scopeValue2246 = await scopeValue166();
    const scopeValue2247 = scopeValue2190.repairAssets === true ? await scopeValue165({
      skipReady: true
    }) : {
      releasedCount: 0
    };
    const scopeValue2248 = await scopeValue298({
      skipReady: true
    });
    const scopeValue2249 = {
      schemaVersion: scopeValue5,
      compactedAt: Date.now(),
      checkpointRecordsDeleted: scopeValue2193.length,
      legacyAppStateDeleted: !!scopeValue2204,
      domainsRecovered: scopeValue2216.length,
      friendsRecovered: scopeValue2217.length,
      messagesRecovered: scopeValue2218.length,
      momentsRecovered: scopeValue2219.length,
      stickersRecovered: scopeValue2221.length,
      summariesCreated: scopeValue2231.length,
      legacyImessageBytesRemoved: scopeValue2241,
      mediaRecordsDeduplicated: scopeValue2243,
      xSelfPostAvatarsDeduplicated: scopeValue2244.activePostsRewritten + scopeValue2244.accountWorldsRewritten,
      xSelfPostAvatarAssetsReleased: scopeValue2244.releasedAssetCount,
      embeddedAppMediaRecordsRewritten: scopeValue2245.recordsRewritten,
      legacySettingsCopiesRemoved: scopeValue2245.legacySettingsCopiesRemoved,
      xPostsRecovered: Math.max(0, scopeValue2236.length - scopeValue2201.length),
      orphanAssetsRemoved: scopeValue2246,
      unreferencedAssetsRemoved: scopeValue2247.releasedCount,
      estimatedBytesFreed: Math.max(scopeValue2242, scopeValue2192.indexedDbBytes - scopeValue2248.indexedDbBytes),
      beforeIndexedDbBytes: scopeValue2192.indexedDbBytes,
      afterIndexedDbBytes: scopeValue2248.indexedDbBytes
    };
    await scopeValue133("storage_compacted_v9", scopeValue2249);
    await scopeValue133("storage_last_compaction", scopeValue2249);
    scopeValue30.lastCompaction = scopeValue47(scopeValue2249);
    return scopeValue47(scopeValue2249);
  }
  async function scopeValue301(scopeValue2319 = {}) {
    if (!scopeValue2319.skipReady && scopeValue32) await scopeValue32;
    const scopeValue2320 = typeof scopeValue2319.progressCallback === "function" ? scopeValue2319.progressCallback : null;
    scopeValue30.status = "saving";
    scopeValue30.lastError = null;
    scopeValue95({
      ...scopeValue30,
      reason: "cache-cleanup-start"
    });
    try {
      scopeValue51(scopeValue2320, "正在完成待保存数据...", 10);
      const scopeValue2321 = await scopeValue116();
      if (!scopeValue2321) throw new Error("Pending writes could not be completed before cache cleanup.");
      const scopeValue2322 = await scopeValue298({
        skipReady: true
      });
      scopeValue51(scopeValue2320, "正在校验并清理重复数据...", 35);
      const scopeValue2323 = await scopeValue300({
        skipReady: true,
        force: true,
        repairAssets: true
      });
      scopeValue51(scopeValue2320, "正在清理可重新下载的页面缓存...", 72);
      const scopeValue2324 = await scopeValue79();
      const scopeValue2325 = scopeValue2324.filter(scopeValue2333 => scopeValue2333?.deleted).length;
      const scopeValue2326 = scopeValue2324.filter(scopeValue2334 => !scopeValue2334?.deleted).length;
      scopeValue51(scopeValue2320, "正在重新统计空间...", 90);
      const scopeValue2327 = await scopeValue298({
        skipReady: true
      });
      const scopeValue2328 = Math.max(0, Number(scopeValue2322.usageDetails?.caches) || 0);
      const scopeValue2329 = Math.max(0, Number(scopeValue2327.usageDetails?.caches) || 0);
      const scopeValue2330 = scopeValue2324.length > 0 && scopeValue2326 === 0 ? Math.max(scopeValue2328, scopeValue2328 - scopeValue2329) : Math.max(0, scopeValue2328 - scopeValue2329);
      const scopeValue2331 = Math.max(0, scopeValue2322.originUsage - scopeValue2327.originUsage);
      const scopeValue2332 = {
        clearedAt: Date.now(),
        cacheEntriesFound: scopeValue2324.length,
        cachesDeleted: scopeValue2325,
        cacheDeleteFailures: scopeValue2326,
        checkpointRecordsDeleted: Number(scopeValue2323?.checkpointRecordsDeleted) || 0,
        orphanAssetsRemoved: (Number(scopeValue2323?.orphanAssetsRemoved) || 0) + (Number(scopeValue2323?.unreferencedAssetsRemoved) || 0),
        estimatedBytesFreed: Math.max(scopeValue2331, (Number(scopeValue2323?.estimatedBytesFreed) || 0) + scopeValue2330),
        beforeUsage: scopeValue2322.originUsage,
        afterUsage: scopeValue2327.originUsage,
        logicalBytesBefore: scopeValue2322.logicalBytes,
        logicalBytesAfter: scopeValue2327.logicalBytes,
        logicalBytesFreed: Math.max(0, scopeValue2322.logicalBytes - scopeValue2327.logicalBytes),
        browserBytesFreed: scopeValue2331,
        browserUsageAvailable: scopeValue2322.quota > 0 && scopeValue2327.quota > 0,
        recordsRewritten: (Number(scopeValue2323?.embeddedAppMediaRecordsRewritten) || 0) + (Number(scopeValue2323?.xSelfPostAvatarsDeduplicated) || 0) + (Number(scopeValue2323?.mediaRecordsDeduplicated) || 0) + (Number(scopeValue2323?.legacySettingsCopiesRemoved) || 0)
      };
      await scopeValue133("storage_last_cache_cleanup", scopeValue2332);
      scopeValue30.status = scopeValue2326 > 0 ? "error" : "saved";
      scopeValue30.lastError = scopeValue2326 > 0 ? `${scopeValue2326} browser cache item(s) could not be deleted.` : null;
      scopeValue30.lastCacheCleanup = scopeValue47(scopeValue2332);
      scopeValue95({
        ...scopeValue30,
        reason: "cache-cleanup-complete"
      });
      scopeValue51(scopeValue2320, "缓存清理完成", 100);
      return scopeValue47(scopeValue2332);
    } catch (scopeValue2335) {
      scopeValue30.status = "error";
      scopeValue30.lastError = scopeValue2335?.message || String(scopeValue2335);
      scopeValue95({
        ...scopeValue30,
        reason: "cache-cleanup-error"
      });
      throw scopeValue2335;
    }
  }
  async function scopeValue302(scopeValue2336 = {}) {
    if (!scopeValue2336.skipReady && scopeValue32) await scopeValue32;
    const scopeValue2337 = typeof scopeValue2336.progressCallback === "function" ? scopeValue2336.progressCallback : null;
    scopeValue30.status = "saving";
    scopeValue30.lastError = null;
    scopeValue95({
      ...scopeValue30,
      reason: "storage-optimization-start"
    });
    let scopeValue2338 = null;
    let newScope2711 = false;
    try {
      scopeValue51(scopeValue2337, "正在完成待保存数据...", 4);
      if (!(await scopeValue116())) throw new Error("Pending writes could not be completed before optimization.");
      const scopeValue2339 = await scopeValue298({
        skipReady: true
      });
      const scopeValue2340 = scopeValue2339.quota > 0 ? Math.max(0, scopeValue2339.quota - scopeValue2339.originUsage) : Number.POSITIVE_INFINITY;
      const scopeValue2341 = Math.max(8 * 1024 * 1024, Math.ceil(scopeValue2339.logicalBytes * 1.15));
      if (scopeValue2340 < scopeValue2341) {
        throw new DOMException(`Safe optimization needs about ${scopeValue286(scopeValue2341)} of free temporary space.`, "QuotaExceededError");
      }
      await scopeValue78(scopeValue1);
      scopeValue2338 = await scopeValue81(scopeValue1);
      const scopeValue2342 = await scopeValue82();
      const scopeValue2343 = `opt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      scopeValue51(scopeValue2337, "正在创建安全影子数据库...", 10);
      const scopeValue2344 = await scopeValue93(scopeValue2342, scopeValue2338, scopeValue2337, 10, 42);
      await scopeValue94(scopeValue2338, "optimization_shadow_ready", {
        optimizationId: scopeValue2343,
        createdAt: Date.now(),
        signatures: scopeValue2344
      });
      try {
        scopeValue2342.close();
      } catch (scopeValue2349) {}
      scopeValue25 = null;
      scopeValue51(scopeValue2337, "正在重建主数据库...", 56);
      const scopeValue2345 = await scopeValue78(scopeValue0);
      if (!scopeValue2345.deleted) {
        throw new Error(scopeValue2345.reason === "blocked" ? "数据库正被其他页面占用，请关闭本项目的其他标签页后重试。" : `Main database could not be rebuilt: ${scopeValue2345.reason}`);
      }
      newScope2711 = true;
      const newScope2719 = await scopeValue82();
      await scopeValue93(scopeValue2338, newScope2719, scopeValue2337, 58, 36);
      await scopeValue94(newScope2719, "optimization_restore_complete", {
        optimizationId: scopeValue2343,
        restoredAt: Date.now()
      });
      scopeValue2338.close();
      scopeValue2338 = null;
      await scopeValue78(scopeValue1);
      const scopeValue2347 = await scopeValue298({
        skipReady: true
      });
      const scopeValue2348 = {
        optimizedAt: Date.now(),
        compactedAt: Date.now(),
        optimizationId: scopeValue2343,
        logicalBytesBefore: scopeValue2339.logicalBytes,
        logicalBytesAfter: scopeValue2347.logicalBytes,
        logicalBytesFreed: Math.max(0, scopeValue2339.logicalBytes - scopeValue2347.logicalBytes),
        browserBytesFreed: Math.max(0, scopeValue2339.originUsage - scopeValue2347.originUsage),
        browserUsageAvailable: scopeValue2339.quota > 0 && scopeValue2347.quota > 0,
        browserUsageBefore: scopeValue2339.originUsage,
        browserUsageAfter: scopeValue2347.originUsage,
        estimatedBytesFreed: Math.max(0, scopeValue2339.originUsage - scopeValue2347.originUsage),
        databaseOverheadBefore: scopeValue2339.databaseOverheadBytes,
        databaseOverheadAfter: scopeValue2347.databaseOverheadBytes,
        verifiedStores: Object.keys(scopeValue2344).length
      };
      await scopeValue133("storage_last_optimization", scopeValue2348);
      scopeValue30.status = "saved";
      scopeValue30.lastOptimization = scopeValue47(scopeValue2348);
      scopeValue95({
        ...scopeValue30,
        reason: "storage-optimization-complete"
      });
      scopeValue51(scopeValue2337, "存储优化完成", 100);
      return scopeValue47(scopeValue2348);
    } catch (scopeValue2350) {
      try {
        if (scopeValue2338) scopeValue2338.close();
      } catch (scopeValue2351) {}
      if (newScope2711) {
        try {
          await scopeValue303();
          await newScope316();
        } catch (newScope2725) {
          scopeValue2350.message += " 已保留安全副本，重新打开应用后会自动恢复。";
        }
      }
      scopeValue30.status = "error";
      scopeValue30.lastError = scopeValue2350?.message || String(scopeValue2350);
      scopeValue95({
        ...scopeValue30,
        reason: "storage-optimization-error"
      });
      throw scopeValue2350;
    }
  }
  async function scopeValue303() {
    const scopeValue2352 = await scopeValue88();
    if (!scopeValue2352) return false;
    const scopeValue2353 = await scopeValue82();
    const scopeValue2354 = await new Promise((scopeValue2355, scopeValue2356) => {
      const scopeValue2357 = scopeValue2353.transaction(scopeValue9.meta, "readonly").objectStore(scopeValue9.meta).get("optimization_restore_complete");
      scopeValue2357.onsuccess = () => scopeValue2355(scopeValue2357.result?.value || null);
      scopeValue2357.onerror = () => scopeValue2356(scopeValue2357.error);
    });
    if (!scopeValue2354 || scopeValue2354.optimizationId !== scopeValue2352.marker.optimizationId) {
      await scopeValue93(scopeValue2352.db, scopeValue2353, null);
      await scopeValue94(scopeValue2353, "optimization_restore_complete", {
        optimizationId: scopeValue2352.marker.optimizationId,
        restoredAt: Date.now()
      });
    }
    scopeValue2352.db.close();
    await scopeValue78(scopeValue1);
    return true;
  }
  function scopeValue304() {
    const scopeValue2358 = window.u2NativeBridge;
    if (!scopeValue2358?.isNativeAndroid?.()) return null;
    if (typeof scopeValue2358.getStorageBackupStatus !== "function" || typeof scopeValue2358.writeStorageBackup !== "function" || typeof scopeValue2358.readStorageBackup !== "function" || typeof scopeValue2358.deleteStorageBackups !== "function") {
      return null;
    }
    return scopeValue2358;
  }
  function scopeValue305(scopeValue2359 = scopeValue7) {
    if (!scopeValue37 || scopeValue40 || !scopeValue38 || newScope43) return;
    const scopeValue2360 = Math.max(0, Number(scopeValue2359) || 0);
    if (scopeValue39) {
      if (scopeValue2360 > 0) return;
      window.clearTimeout(scopeValue39);
      scopeValue39 = null;
    }
    scopeValue39 = window.setTimeout(() => {
      scopeValue39 = null;
      void scopeValue307().catch(scopeValue2361 => {
        console.warn("[appStorage] Native backup failed", scopeValue2361);
      });
    }, scopeValue2360);
  }
  function scopeValue306(scopeValue2362 = {}) {
    if (!scopeValue37 || newScope41) return;
    scopeValue38 = true;
    scopeValue305(scopeValue2362.immediate === true ? 0 : scopeValue7);
  }
  async function scopeValue307() {
    if (!scopeValue37 || scopeValue40 || !scopeValue38 || scopeValue33 || newScope43) return false;
    if (scopeValue32) await scopeValue32;
    if (scopeValue40 || !scopeValue38 || scopeValue33 || newScope43) return false;
    scopeValue40 = true;
    scopeValue38 = false;
    try {
      if (!(await scopeValue116())) throw new Error("Pending writes could not be completed before native backup.");
      const scopeValue2363 = await scopeValue234();
      const scopeValue2364 = new Blob([JSON.stringify(scopeValue2363)], {
        type: "application/json"
      });
      const scopeValue2365 = await scopeValue37.writeStorageBackup({
        blob: scopeValue2364,
        metadata: {
          schemaVersion: scopeValue2363.schemaVersion,
          exportedAt: scopeValue2363.exportedAt,
          recordCount: scopeValue2363.stats?.recordCount,
          payloadChecksum: scopeValue2363.checksum?.value
        }
      });
      if (scopeValue2365?.status !== "saved") throw new Error("Native backup was not committed.");
      scopeValue42 = Math.max(0, Number(scopeValue2365.savedAt) || Date.now());
      scopeValue95({
        ...scopeValue30,
        reason: "native-backup-complete",
        nativeBackup: {
          savedAt: scopeValue42,
          compressedBytes: Math.max(0, Number(scopeValue2365.compressedBytes) || 0)
        }
      });
      return true;
    } catch (scopeValue2366) {
      scopeValue38 = true;
      window.setTimeout(() => scopeValue305(0), scopeValue8);
      throw scopeValue2366;
    } finally {
      scopeValue40 = false;
      if (scopeValue38) scopeValue305();
    }
  }
  async function scopeValue308() {
    const scopeValue2367 = scopeValue10.filter(scopeValue2368 => scopeValue2368 !== scopeValue9.meta);
    return scopeValue83(scopeValue2367, "readonly", async scopeValue2369 => {
      const scopeValue2370 = await Promise.all(scopeValue2367.map(scopeValue2371 => scopeValue77(scopeValue2369[scopeValue2371].count())));
      return scopeValue2370.some(scopeValue2372 => Number(scopeValue2372) > 0);
    });
  }
  async function scopeValue309() {
    if (!scopeValue37 || (await scopeValue308())) return false;
    const scopeValue2373 = await scopeValue37.getStorageBackupStatus();
    if (!scopeValue2373?.exists) return false;
    newScope41 = true;
    try {
      const scopeValue2374 = await scopeValue37.readStorageBackup();
      if (!scopeValue2374?.text) throw new Error("Native backup exists but could not be read.");
      const scopeValue2375 = JSON.parse(scopeValue2374.text);
      const scopeValue2376 = String(scopeValue2374.metadata?.payloadChecksum || "");
      const scopeValue2377 = String(scopeValue2375?.checksum?.value || "");
      if (scopeValue2376 && scopeValue2377 !== scopeValue2376) {
        throw new Error("Native backup payload checksum mismatch.");
      }
      scopeValue258(scopeValue2375);
      await scopeValue285(scopeValue2375);
      scopeValue42 = Math.max(0, Number(scopeValue2374.metadata?.savedAt) || 0);
      return true;
    } finally {
      newScope41 = false;
    }
  }
  async function scopeValue310() {
    scopeValue37 = scopeValue304();
    if (scopeValue37) await scopeValue309();
    const scopeValue2378 = await scopeValue311();
    if (scopeValue37) {
      const scopeValue2379 = await scopeValue37.getStorageBackupStatus();
      scopeValue42 = Math.max(0, Number(scopeValue2379?.savedAt) || 0);
      if (!scopeValue2379?.exists) {
        scopeValue38 = true;
        scopeValue305(5000);
      }
    }
    return scopeValue2378;
  }
  async function scopeValue311() {
    scopeValue30.status = "initializing";
    await scopeValue279();
    await scopeValue281();
    await scopeValue303();
    const scopeValue2380 = await scopeValue87(scopeValue9.appDomains);
    if (scopeValue2380.length === 0) {
      const [scopeValue2385, scopeValue2386, scopeValue2387] = await Promise.all([scopeValue87(scopeValue9.settings), scopeValue84(scopeValue9.settings, "appState"), scopeValue84(scopeValue9.accounts, "__all__")]);
      const scopeValue2388 = scopeValue2386 && scopeValue2386.value && typeof scopeValue2386.value === "object" ? scopeValue2386.value : null;
      const scopeValue2389 = scopeValue2388 || {};
      const scopeValue2390 = {};
      scopeValue2385.forEach(scopeValue2393 => {
        if (!scopeValue2393 || scopeValue2393.key === "appState") return;
        scopeValue2390[scopeValue2393.key] = scopeValue47(scopeValue2393.value);
      });
      if (Array.isArray(scopeValue2387?.value)) scopeValue2390.accounts = scopeValue47(scopeValue2387.value);
      const scopeValue2391 = {
        ...Object.fromEntries(Object.entries(scopeValue2389).map(([scopeValue2394, scopeValue2395]) => [scopeValue2394, scopeValue47(scopeValue2395)])),
        settings: scopeValue2390,
        legacy: {}
      };
      const scopeValue2392 = Date.now();
      await scopeValue83([scopeValue9.appDomains, scopeValue9.xPosts, scopeValue9.xThreads, scopeValue9.xDms, scopeValue9.assets, scopeValue9.meta], "readwrite", async scopeValue2396 => {
        for (const [scopeValue2397, scopeValue2398] of Object.entries(scopeValue2391)) {
          const scopeValue2399 = scopeValue71(scopeValue2397, scopeValue2398);
          const scopeValue2400 = scopeValue2397 === "x" ? scopeValue102(scopeValue2399, scopeValue2396[scopeValue9.assets]) : scopeValue2397 === "desktop" ? scopeValue49(scopeValue105(scopeValue2399, scopeValue2396[scopeValue9.assets])) : scopeValue49(scopeValue2399);
          const scopeValue2401 = scopeValue2397 === "x" ? scopeValue98(scopeValue2400) : scopeValue2400;
          scopeValue2396[scopeValue9.appDomains].put({
            name: scopeValue2397,
            schemaVersion: scopeValue5,
            revision: 1,
            updatedAt: scopeValue2392,
            value: scopeValue2401
          });
          if (scopeValue2397 === "x") {
            await scopeValue108(scopeValue2396[scopeValue9.xPosts], scopeValue2400.xGeneratedPosts || [], "id");
            const scopeValue2402 = Object.entries(scopeValue2400.xPostThreads || {}).map(([scopeValue2404, scopeValue2405]) => ({
              postId: scopeValue2404,
              value: scopeValue2405
            }));
            await scopeValue108(scopeValue2396[scopeValue9.xThreads], scopeValue2402, "postId");
            const scopeValue2403 = (scopeValue2400.xDirectMessages || []).map((scopeValue2406, scopeValue2407) => ({
              ...scopeValue2406,
              id: String(scopeValue2406?.id ?? scopeValue2406?.charId ?? `x-dm-${scopeValue2407}`),
              updatedAt: Number(scopeValue2406?.updatedAt) || scopeValue2392
            }));
            await scopeValue108(scopeValue2396[scopeValue9.xDms], scopeValue2403, "id");
          }
        }
        scopeValue2396[scopeValue9.meta].put({
          key: scopeValue16.schemaVersion,
          value: scopeValue5
        });
        scopeValue2396[scopeValue9.meta].put({
          key: "unified_storage_migrated_at",
          value: scopeValue2392
        });
      });
    }
    const [scopeValue2381, scopeValue2382] = await Promise.all([scopeValue84(scopeValue9.settings, "appState"), scopeValue87(scopeValue9.storageCheckpoints)]);
    const scopeValue2383 = Boolean(scopeValue2381) || scopeValue2382.length > 0;
    scopeValue30.lastCompaction = scopeValue2383 ? await scopeValue300({
      skipReady: true,
      force: true
    }) : await scopeValue132("storage_last_compaction");
    scopeValue30.lastCacheCleanup = await scopeValue132("storage_last_cache_cleanup");
    scopeValue30.lastOptimization = await scopeValue132("storage_last_optimization");
    scopeValue30.lastVoiceCleanup = await scopeValue132("storage_last_voice_cleanup");
    scopeValue30.lastImageCompression = await scopeValue132("storage_last_image_compression");
    const scopeValue2384 = await scopeValue87(scopeValue9.appDomains);
    for (const scopeValue2408 of scopeValue2384) {
      if (!scopeValue2408?.name) continue;
      const scopeValue2409 = scopeValue2408.name === "x" ? await scopeValue109(scopeValue2408.value) : scopeValue2408.name === "desktop" ? await scopeValue107(scopeValue2408.value) : scopeValue2408.name === "netflix" ? scopeValue70(scopeValue2408.value) : scopeValue2408.value;
      scopeValue26.set(String(scopeValue2408.name), scopeValue47(scopeValue2409));
    }
    scopeValue30.status = "saved";
    scopeValue30.migrationVersion = scopeValue5;
    scopeValue30.lastError = null;
    try {
      if (navigator.storage?.persist) await navigator.storage.persist();
    } catch (scopeValue2410) {}
    scopeValue95({
      ...scopeValue30
    });
    try {
      window.dispatchEvent(new CustomEvent("u2-storage-ready"));
    } catch (scopeValue2411) {}
    scopeValue312();
    return true;
  }
  function scopeValue312() {
    if (scopeValue36) return;
    scopeValue36 = true;
    const scopeValue2412 = async () => {
      try {
        scopeValue30.lastCompaction = await newScope49(() => scopeValue300({
          skipReady: true
        }));
        scopeValue95({
          ...scopeValue30,
          reason: "startup-maintenance-complete"
        });
      } catch (scopeValue2415) {
        console.warn("[appStorage] Deferred startup maintenance failed", scopeValue2415);
      }
    };
    const scopeValue2413 = () => {
      const newScope2790 = document.activeElement;
      if (document.visibilityState === "hidden" || newScope2790?.closest?.("#imessage-view") && newScope2790.matches?.("input, textarea, [contenteditable]")) {
        window.setTimeout(scopeValue2413, 5000);
        return;
      }
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(() => {
          void scopeValue2412();
        }, {
          timeout: 10000
        });
      } else {
        window.setTimeout(() => {
          void scopeValue2412();
        }, 0);
      }
    };
    const newScope2788 = () => {
      const scopeValue2414 = window.setTimeout(scopeValue2413, 5000);
      scopeValue2414?.unref?.();
    };
    if (window.u2SplashScreenRemoved || typeof window.addEventListener !== "function") newScope2788();else window.addEventListener("u2:splash-screen-removed", newScope2788, {
      once: true
    });
  }
  function scopeValue313() {
    scopeValue41 = false;
    const scopeValue2416 = scopeValue34.shift();
    if (!scopeValue2416) return;
    try {
      const scopeValue2417 = scopeValue2416();
      if (scopeValue2417 && typeof scopeValue2417.then === "function") {
        Promise.resolve(scopeValue2417).catch(scopeValue2418 => {
          console.error("[appStorage] Deferred startup initializer failed", scopeValue2418);
        });
      }
    } catch (scopeValue2419) {
      console.error("[appStorage] Deferred startup initializer failed", scopeValue2419);
    }
    if (scopeValue34.length > 0) scopeValue314();
  }
  function scopeValue314() {
    if (scopeValue41 || scopeValue34.length === 0) return;
    scopeValue41 = true;
    if (typeof window.requestAnimationFrame === "function") {
      window.requestAnimationFrame(scopeValue313);
    } else {
      window.setTimeout(scopeValue313, 0);
    }
  }
  function scopeValue315(scopeValue2420, scopeValue2421 = {}) {
    if (typeof scopeValue2420 !== "function") return Promise.resolve(false);
    const scopeValue2422 = scopeValue2421.queue !== false;
    const scopeValue2423 = () => scopeValue32.then(() => {
      if (!scopeValue2422) {
        scopeValue2420();
        return true;
      }
      scopeValue34.push(scopeValue2420);
      scopeValue314();
      return true;
    }).catch(scopeValue2424 => {
      console.warn("[appStorage] Startup initializer skipped because storage is unavailable", scopeValue2424);
      return false;
    });
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", scopeValue2423, {
        once: true
      });
    } else {
      scopeValue2423();
    }
    return scopeValue32;
  }
  const scopeValue316 = {
    u2_userState: "userState",
    u2_apiConfig: "apiConfig",
    u2_ttsConfig: "ttsConfig",
    u2_minimaxConfig: "minimaxConfig",
    u2_apiPresets: "apiPresets",
    u2_fetchedModels: "fetchedModels",
    u2_assistiveBallSettings: "assistiveBallSettings",
    u2_accounts: "accounts",
    u2_currentAccountId: "currentAccountId",
    u2_themeState: "themeState",
    u2_worldBooks: "worldBooks",
    u2_wbGroups: "wbGroups"
  };
  function scopeValue317(scopeValue2425, scopeValue2426 = null) {
    const scopeValue2427 = String(scopeValue2425 || "");
    const scopeValue2428 = scopeValue316[scopeValue2427];
    const scopeValue2429 = scopeValue97("settings", {});
    if (scopeValue2428) {
      return Object.prototype.hasOwnProperty.call(scopeValue2429 || {}, scopeValue2428) ? scopeValue47(scopeValue2429[scopeValue2428]) : scopeValue47(scopeValue2426);
    }
    const scopeValue2430 = scopeValue97("legacy", {});
    if (Object.prototype.hasOwnProperty.call(scopeValue2430 || {}, scopeValue2427)) return scopeValue47(scopeValue2430[scopeValue2427]);
    return scopeValue47(scopeValue2426);
  }
  function scopeValue318(scopeValue2431, scopeValue2432) {
    const scopeValue2433 = String(scopeValue2431 || "");
    const scopeValue2434 = scopeValue316[scopeValue2433];
    const scopeValue2435 = scopeValue2434 ? "settings" : "legacy";
    const scopeValue2436 = scopeValue2434 || scopeValue2433;
    const scopeValue2437 = scopeValue97(scopeValue2435, {});
    scopeValue2437[scopeValue2436] = scopeValue47(scopeValue2432);
    scopeValue26.set(scopeValue2435, scopeValue2437);
    return scopeValue114(scopeValue2435, scopeValue2438 => {
      scopeValue2438[scopeValue2436] = scopeValue47(scopeValue2432);
      return scopeValue2438;
    }, {
      reason: `legacy-key:${scopeValue2433}`
    });
  }
  function scopeValue319(scopeValue2439) {
    const scopeValue2440 = String(scopeValue2439 || "");
    const scopeValue2441 = scopeValue316[scopeValue2440];
    const scopeValue2442 = scopeValue2441 ? "settings" : "legacy";
    const scopeValue2443 = scopeValue2441 || scopeValue2440;
    const scopeValue2444 = scopeValue97(scopeValue2442, {});
    delete scopeValue2444[scopeValue2443];
    scopeValue26.set(scopeValue2442, scopeValue2444);
    return scopeValue114(scopeValue2442, scopeValue2445 => {
      delete scopeValue2445[scopeValue2443];
      return scopeValue2445;
    }, {
      reason: `legacy-key-remove:${scopeValue2440}`
    });
  }
  async function scopeValue320() {
    try {
      scopeValue60();
    } catch (scopeValue2447) {}
    try {
      const scopeValue2448 = await scopeValue25;
      if (scopeValue2448) scopeValue2448.close();
    } catch (scopeValue2449) {}
    scopeValue25 = null;
    const scopeValue2446 = await scopeValue78(scopeValue0);
    return !!scopeValue2446.deleted;
  }
  async function scopeValue321() {
    try {
      scopeValue60();
    } catch (scopeValue2455) {}
    if (scopeValue39) {
      window.clearTimeout(scopeValue39);
      scopeValue39 = null;
    }
    if (scopeValue37) {
      await scopeValue37.deleteStorageBackups();
      scopeValue38 = false;
      scopeValue42 = 0;
    }
    try {
      const scopeValue2456 = await scopeValue25;
      if (scopeValue2456) scopeValue2456.close();
    } catch (scopeValue2457) {}
    scopeValue25 = null;
    let scopeValue2450 = false;
    try {
      sessionStorage.clear();
      scopeValue2450 = true;
    } catch (scopeValue2458) {}
    const [scopeValue2451, scopeValue2452, scopeValue2453, scopeValue2454] = await Promise.all([scopeValue78(scopeValue0), scopeValue78("iiso_imessage_storage"), scopeValue79(), scopeValue80()]);
    return {
      runtimeCacheCleared: true,
      localStorageCleared: false,
      localStorageRemovedKeys: [],
      sessionStorageCleared: scopeValue2450,
      databases: [scopeValue2451, scopeValue2452],
      caches: scopeValue2453,
      serviceWorkers: scopeValue2454
    };
  }
  window.appStorage = {
    DB_NAME: scopeValue0,
    STORES: scopeValue9,
    openDb: scopeValue82,
    withStore: scopeValue83,
    requestToPromise: scopeValue77,
    cloneDeep: scopeValue47,
    dataUrlToBlob: scopeValue73,
    blobToDataUrl: scopeValue76,
    clearRuntimeAssetCache: scopeValue60,
    pruneRuntimeAssetCache: scopeValue62,
    measureRuntimeCacheUsage: scopeValue61,
    formatBytes: scopeValue286,
    getUsageSummary: scopeValue288,
    saveAssetFromDataUrl: scopeValue140,
    saveAssetFromBlob: scopeValue141,
    getAssetBlob: scopeValue142,
    getAssetUrl: scopeValue143,
    deleteAsset: scopeValue144,
    markAssetOrphaned: scopeValue155,
    releaseAssetsFromDeletedRecords: scopeValue162,
    sweepUnreferencedAssets: scopeValue165,
    getMeta: scopeValue132,
    setMeta: scopeValue133,
    getSetting: scopeValue134,
    setSetting: scopeValue135,
    getPrivateSession: scopeValue136,
    setPrivateSession: scopeValue137,
    deletePrivateSession: scopeValue138,
    saveGlobalData: scopeValue229,
    loadGlobalData: scopeValue230,
    collectBackupSnapshot: scopeValue234,
    inspectBackupPayload: scopeValue274,
    validateBackupPayload: scopeValue258,
    exportAllData: scopeValue284,
    importAllData: scopeValue285,
    collectImessageBackupSnapshot: scopeValue244,
    inspectImessageBackupPayload: scopeValue243,
    validateImessageBackupPayload: scopeValue242,
    exportImessageBackup: scopeValue245,
    listCharLiteExportChoices: scopeValue246,
    exportCharChatMemoryLite: scopeValue251,
    inspectCharChatMemoryLitePayload: scopeValue253,
    importCharChatMemoryLite: scopeValue254,
    importImessageBackup: scopeValue256,
    clearAllData: scopeValue320,
    clearManagedPersistence: scopeValue275,
    clearAllPersistentData: scopeValue321,
    clearBrowserCaches: scopeValue79,
    unregisterServiceWorkers: scopeValue80,
    measureApproximateUsage: scopeValue287,
    saveFriends: scopeValue207,
    saveFriend: scopeValue199,
    saveFriendMetaOnly: scopeValue200,
    saveFriendMeta: scopeValue191,
    patchFriendMeta: scopeValue201,
    deleteFriend: scopeValue202,
    loadFriends: scopeValue208,
    saveFriendMessage: scopeValue192,
    commitFriendMessage: newScope201,
    commitGroupAnnouncement: scopeValue193,
    claimAwayReturn: newScope202,
    finishAwayReturn: newScope203,
    getAwayReturnState: newScope204,
    commitMemoryRequestDecision: scopeValue194,
    saveChatSummary: scopeValue189,
    deleteFriendMessage: scopeValue195,
    deleteFriendMessages: scopeValue196,
    saveFriendMessages: scopeValue197,
    replaceFriendMessages: scopeValue198,
    loadMessagesByFriendId: scopeValue203,
    loadGalleryImageMessages: scopeValue205,
    loadMessageIndexByFriendId: scopeValue204,
    loadRecentMessagesByFriendId: scopeValue206,
    saveMoments: scopeValue217,
    saveMoment: scopeValue215,
    deleteMoment: scopeValue216,
    loadMoments: scopeValue218,
    saveMomentMessages: scopeValue219,
    loadMomentMessages: scopeValue220,
    saveStickers: scopeValue221,
    loadStickerMetadata: scopeValue223,
    loadStickers: scopeValue222,
    saveMomentsCover: scopeValue224,
    loadMomentsCoverUrl: scopeValue225,
    loadLibraryBooks: scopeValue120,
    loadLibraryBookContent: scopeValue122,
    saveLibraryBook: scopeValue121,
    deleteLibraryBook: scopeValue123,
    loadLibraryPlaylists: scopeValue124,
    loadLibraryTracks: scopeValue125,
    saveLibraryPlaylistBundle: scopeValue126,
    saveLibraryTrack: scopeValue127,
    deleteLibraryTrack: scopeValue128,
    deleteLibraryPlaylist: scopeValue129,
    loadLibraryDailyStats: scopeValue130,
    incrementLibraryDailyStat: scopeValue131,
    switchXAccountWorld: scopeValue112
  };
  Object.assign(window.appStorage, {
    readDomain: scopeValue97,
    commitDomain: scopeValue114,
    commitRecords: scopeValue115,
    flushPendingWrites: scopeValue116,
    getStorageHealth: scopeValue289,
    getStorageBreakdown: scopeValue298,
    compactStorage: scopeValue300,
    clearSafeCache: scopeValue301,
    optimizeStorage: scopeValue302,
    listBackupApps: newScope301,
    exportAppBackup: newScope314,
    inspectAppBackupPayload: newScope313,
    importAppBackup: newScope317,
    inspectVoiceCache: newScope324,
    clearVoiceCache: newScope325,
    inspectImageCompression: scopeValue152,
    compressImageAssets: scopeValue154,
    pruneOrphanedAssets: scopeValue166,
    subscribe: scopeValue117,
    loadLegacyKey: scopeValue317,
    saveLegacyKey: scopeValue318,
    removeLegacyKey: scopeValue319
  });
  const newScope362 = new Set(["importAllData", "importImessageBackup", "importCharChatMemoryLite", "importAppBackup", "exportAppBackup", "clearVoiceCache", "clearSafeCache", "optimizeStorage", "compressImageAssets", "compactStorage", "clearAllData", "clearManagedPersistence", "clearAllPersistentData"]);
  for (const [newScope2835, newScope2836] of Object.entries(window.appStorage)) {
    if (newScope362.has(newScope2835)) window.appStorage[newScope2835] = (...newScope2837) => newScope49(() => newScope2836(...newScope2837));else if (newScope2836?.constructor?.name === "AsyncFunction" || ["saveLegacyKey", "removeLegacyKey"].includes(newScope2835)) {
      window.appStorage[newScope2835] = (...newScope2838) => newScope50(newScope2836, newScope2838);
    }
  }
  Object.defineProperties(window.appStorage, {
    voiceCacheEpoch: {
      get: () => newScope47
    },
    voiceCleanupActive: {
      get: () => newScope48
    }
  });
  Object.defineProperty(window.appStorage, "ready", {
    enumerable: true,
    configurable: false,
    get() {
      return scopeValue32;
    }
  });
  window.u2OnStorageReady = scopeValue315;
  window.addEventListener?.("u2:native-pause", () => {
    if (scopeValue38) scopeValue305(0);
  });
  window.addEventListener?.("pagehide", () => {
    if (scopeValue38) scopeValue305(0);
  });
  scopeValue32 = scopeValue310().catch(scopeValue2459 => {
    scopeValue30.status = "error";
    scopeValue30.lastError = scopeValue2459?.message || String(scopeValue2459);
    console.error("[appStorage] unified storage initialization failed", scopeValue2459);
    scopeValue95({
      ...scopeValue30
    });
    try {
      const scopeValue2460 = document.createElement("div");
      scopeValue2460.id = "u2-storage-fatal";
      scopeValue2460.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:#f2f2f7;display:flex;align-items:center;justify-content:center;padding:24px;font-family:system-ui;color:#1c1c1e;";
      scopeValue2460.innerHTML = `<div style="max-width:420px;background:#fff;border-radius:18px;padding:22px;box-shadow:0 18px 50px rgba(0,0,0,.12)"><h2 style="margin:0 0 10px">存储初始化失败</h2><p style="line-height:1.55;margin:0 0 16px">为防止空数据覆盖原数据，应用已停止启动。请重试；若仍失败，请先导出浏览器站点数据。</p><pre style="white-space:pre-wrap;font-size:12px;color:#8e8e93">${String(scopeValue2459?.message || scopeValue2459).replace(/[<>]/g, "")}</pre><button type="button" style="border:0;border-radius:12px;background:#007aff;color:#fff;padding:11px 18px" onclick="location.reload()">重试</button></div>`;
      document.body.appendChild(scopeValue2460);
    } catch (scopeValue2461) {}
    throw scopeValue2459;
  });
})();
