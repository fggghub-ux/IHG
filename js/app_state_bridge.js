(function () {
  const scopeValue0 = 120,
    scopeValue1 = {
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
        pastVideos: [],
        communityPosts: [],
        userCommunityChannel: null
      },
      subscriptions: [],
      userState: null
    };
  function scopeValue2() {
    return {
      youtube: scopeValue3(scopeValue1),
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
        videos: [],
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
          bio: "",
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
        boundWorldBookIds: [],
        xVisitors: [],
        xDirectMessages: [],
        xPostThreads: {},
        xGeneratedPosts: [],
        xAccounts: [],
        xTrends: [{
          id: "default-stage-style",
          title: "#ParisFashionWeek",
          category: "Fashion · Trending",
          heat: "248K",
          movement: "none"
        }, {
          id: "default-topic-host",
          title: "#LVMHResults",
          category: "Business · Trending",
          heat: "19.8K",
          movement: "none"
        }, {
          id: "default-citywalk",
          title: "#ChristiesAuction",
          category: "Art · Rising",
          heat: "14.6K",
          movement: "none"
        }],
        xAdvancePreferences: {
          strangersEnabled: true,
          strangersCount: 5,
          trendsEnabled: true,
          trendsCount: 3,
          postsEnabled: true,
          postsCount: 3
        },
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
  function scopeValue3(scopeValue29) {
    if (scopeValue29 == null || typeof scopeValue29 !== "object") return scopeValue29;
    if (typeof structuredClone === "function") return structuredClone(scopeValue29);
    return JSON.parse(JSON.stringify(scopeValue29));
  }
  function scopeValue4(scopeValue30, scopeValue31 = new WeakSet()) {
    if (typeof scopeValue30 === "string") return scopeValue30.startsWith("blob:") ? null : scopeValue30;
    if (scopeValue30 == null || typeof scopeValue30 !== "object") return scopeValue30;
    if (scopeValue31.has(scopeValue30)) return undefined;
    scopeValue31.add(scopeValue30);
    if (Array.isArray(scopeValue30)) return scopeValue30.map(scopeValue33 => scopeValue4(scopeValue33, scopeValue31)).filter(scopeValue34 => scopeValue34 !== undefined);
    const scopeValue32 = {};
    return Object.keys(scopeValue30).forEach(scopeValue35 => {
      const scopeValue36 = scopeValue4(scopeValue30[scopeValue35], scopeValue31);
      if (scopeValue36 !== undefined) scopeValue32[scopeValue35] = scopeValue36;
    }), scopeValue32;
  }
  function scopeValue5(scopeValue37) {
    return scopeValue37 && typeof scopeValue37 === "object" && !Array.isArray(scopeValue37);
  }
  function scopeValue6(scopeValue38) {
    if (!scopeValue5(scopeValue38)) return false;
    const scopeValue39 = scopeValue45 => Array.isArray(scopeValue45) && scopeValue45.some(scopeValue46 => Array.isArray(scopeValue46?.chatHistory) && scopeValue46.chatHistory.length > 0),
      scopeValue40 = ["teams", "bstageOrders", "bstageFanChatHistory", "chatPhotos"];
    if (scopeValue40.some(scopeValue47 => Array.isArray(scopeValue38[scopeValue47]) && scopeValue38[scopeValue47].length > 0)) return true;
    if (Array.isArray(scopeValue38.teams) && scopeValue38.teams.some(scopeValue48 => scopeValue39(scopeValue48?.members))) return true;
    const scopeValue41 = scopeValue38.bstageUserTeamState;
    if (scopeValue5(scopeValue41)) {
      if (scopeValue39(scopeValue41.members)) return true;
      if (Array.isArray(scopeValue41.members) && scopeValue41.members.length > 1) return true;
      if (Array.isArray(scopeValue41.videos) && scopeValue41.videos.length > 0) return true;
      if (Array.isArray(scopeValue41.shopItems) && scopeValue41.shopItems.length > 0) return true;
      if (scopeValue41.customName || scopeValue41.customDesc || scopeValue41.customAvatar || scopeValue41.customBg) return true;
    }
    const scopeValue42 = scopeValue38.bstageFanChatSettings;
    if (scopeValue5(scopeValue42) && (scopeValue42.chatBg || scopeValue42.chatCssId || scopeValue42.bubbleCssId)) return true;
    const scopeValue43 = scopeValue38.bstagePresets;
    if (scopeValue5(scopeValue43) && Object.keys(scopeValue43).some(scopeValue49 => Array.isArray(scopeValue43[scopeValue49]) && scopeValue43[scopeValue49].length > 0)) return true;
    const scopeValue44 = scopeValue38.bstageRevenueState;
    if (scopeValue5(scopeValue44) && Number(scopeValue44.withdrawnCny) > 0) return true;
    return false;
  }
  function scopeValue7(scopeValue50) {
    const scopeValue51 = Number(scopeValue50 && scopeValue50.updatedAt);
    return Number.isFinite(scopeValue51) ? scopeValue51 : 0;
  }
  function scopeValue8(scopeValue52, scopeValue53) {
    if (!scopeValue6(scopeValue53)) return false;
    if (!scopeValue6(scopeValue52)) return true;
    const scopeValue54 = scopeValue7(scopeValue53),
      scopeValue55 = scopeValue7(scopeValue52);
    return scopeValue54 > 0 && scopeValue54 > scopeValue55;
  }
  function scopeValue9(scopeValue56, scopeValue57) {
    const scopeValue58 = scopeValue12(scopeValue56),
      scopeValue59 = scopeValue12(scopeValue57);
    return scopeValue8(scopeValue58.bstage, scopeValue59.bstage) && (scopeValue58.bstage = scopeValue3(scopeValue59.bstage)), scopeValue12(scopeValue58);
  }
  function scopeValue10(scopeValue60, scopeValue61) {
    const scopeValue62 = scopeValue12(scopeValue60),
      scopeValue63 = scopeValue12(scopeValue61);
    return scopeValue6(scopeValue62.bstage) && !scopeValue8(scopeValue62.bstage, scopeValue63.bstage) && (scopeValue63.bstage = scopeValue3(scopeValue62.bstage)), scopeValue12(scopeValue63);
  }
  function scopeValue11(scopeValue64) {
    const scopeValue65 = scopeValue5(scopeValue64) ? scopeValue64 : {},
      scopeValue66 = scopeValue5(scopeValue65.channelState) ? scopeValue65.channelState : {};
    return {
      ...scopeValue3(scopeValue1),
      ...scopeValue65,
      channelState: {
        ...scopeValue3(scopeValue1.channelState),
        ...scopeValue66,
        boundWorldBookIds: Array.isArray(scopeValue66.boundWorldBookIds) ? scopeValue66.boundWorldBookIds.filter(Boolean) : [],
        liveSummaries: Array.isArray(scopeValue66.liveSummaries) ? scopeValue66.liveSummaries.filter(Boolean) : [],
        groupChatHistory: Array.isArray(scopeValue66.groupChatHistory) ? scopeValue66.groupChatHistory.filter(Boolean) : [],
        activeUserLive: scopeValue5(scopeValue66.activeUserLive) ? scopeValue66.activeUserLive : null,
        pastVideos: Array.isArray(scopeValue66.pastVideos) ? scopeValue66.pastVideos.filter(Boolean) : [],
        communityPosts: Array.isArray(scopeValue66.communityPosts) ? scopeValue66.communityPosts.filter(Boolean) : [],
        userCommunityChannel: scopeValue5(scopeValue66.userCommunityChannel) ? scopeValue66.userCommunityChannel : null
      },
      subscriptions: Array.isArray(scopeValue65.subscriptions) ? scopeValue65.subscriptions.filter(Boolean) : [],
      userState: scopeValue5(scopeValue65.userState) ? scopeValue65.userState : null
    };
  }
  function scopeValue12(scopeValue67) {
    const scopeValue68 = scopeValue2(),
      scopeValue69 = scopeValue5(scopeValue67) ? scopeValue67 : {},
      scopeValue70 = scopeValue5(scopeValue69.x) ? scopeValue69.x : {},
      scopeValue71 = {
        ...scopeValue68.x,
        ...scopeValue70,
        xData: {
          ...scopeValue68.x.xData,
          ...(scopeValue5(scopeValue70.xData) ? scopeValue70.xData : {})
        },
        xPlayerAccounts: Array.isArray(scopeValue70.xPlayerAccounts) ? scopeValue70.xPlayerAccounts : scopeValue68.x.xPlayerAccounts,
        activeXPlayerAccountId: typeof scopeValue70.activeXPlayerAccountId === "string" ? scopeValue70.activeXPlayerAccountId : scopeValue68.x.activeXPlayerAccountId,
        xAccountSchemaVersion: Math.max(1, Number(scopeValue70.xAccountSchemaVersion) || scopeValue68.x.xAccountSchemaVersion),
        xCharIdentityMigrationVersion: Math.max(0, Number(scopeValue70.xCharIdentityMigrationVersion) || scopeValue68.x.xCharIdentityMigrationVersion),
        xCharProfileMediaMigrationVersion: Math.max(0, Number(scopeValue70.xCharProfileMediaMigrationVersion) || scopeValue68.x.xCharProfileMediaMigrationVersion),
        xTopics: Array.isArray(scopeValue70.xTopics) ? scopeValue70.xTopics : scopeValue68.x.xTopics,
        boundWorldBookIds: Array.isArray(scopeValue70.boundWorldBookIds) ? scopeValue70.boundWorldBookIds.map(String) : scopeValue68.x.boundWorldBookIds,
        xVisitors: Array.isArray(scopeValue70.xVisitors) ? scopeValue70.xVisitors : scopeValue68.x.xVisitors,
        xDirectMessages: Array.isArray(scopeValue70.xDirectMessages) ? scopeValue70.xDirectMessages : scopeValue68.x.xDirectMessages,
        xPostThreads: scopeValue5(scopeValue70.xPostThreads) ? scopeValue70.xPostThreads : scopeValue68.x.xPostThreads,
        xGeneratedPosts: Array.isArray(scopeValue70.xGeneratedPosts) ? scopeValue70.xGeneratedPosts : scopeValue68.x.xGeneratedPosts,
        xAccounts: Array.isArray(scopeValue70.xAccounts) ? scopeValue70.xAccounts : scopeValue68.x.xAccounts,
        xTrends: Array.isArray(scopeValue70.xTrends) ? scopeValue70.xTrends : scopeValue68.x.xTrends,
        xAdvancePreferences: scopeValue5(scopeValue70.xAdvancePreferences) ? scopeValue70.xAdvancePreferences : scopeValue68.x.xAdvancePreferences,
        xHomeBannerUrl: typeof scopeValue70.xHomeBannerUrl === "string" ? scopeValue70.xHomeBannerUrl : scopeValue68.x.xHomeBannerUrl,
        xSearchBannerUrl: typeof scopeValue70.xSearchBannerUrl === "string" ? scopeValue70.xSearchBannerUrl : scopeValue68.x.xSearchBannerUrl
      };
    return delete scopeValue71.xCurrentDate, {
      ...scopeValue68,
      ...scopeValue69,
      youtube: scopeValue11(scopeValue69.youtube),
      tiktok: {
        ...scopeValue68.tiktok,
        ...(scopeValue5(scopeValue69.tiktok) ? scopeValue69.tiktok : {})
      },
      pay: {
        ...scopeValue68.pay,
        ...(scopeValue5(scopeValue69.pay) ? scopeValue69.pay : {})
      },
      spotify: {
        ...scopeValue68.spotify,
        ...(scopeValue5(scopeValue69.spotify) ? scopeValue69.spotify : {})
      },
      diary: {
        ...scopeValue68.diary,
        ...(scopeValue5(scopeValue69.diary) ? scopeValue69.diary : {})
      },
      treasure: {
        ...scopeValue68.treasure,
        ...(scopeValue5(scopeValue69.treasure) ? scopeValue69.treasure : {})
      },
      cycle: {
        ...scopeValue68.cycle,
        ...(scopeValue5(scopeValue69.cycle) ? scopeValue69.cycle : {})
      },
      maps: {
        ...scopeValue68.maps,
        ...(scopeValue5(scopeValue69.maps) ? scopeValue69.maps : {})
      },
      netflix: scopeValue5(scopeValue69.netflix) ? scopeValue69.netflix : scopeValue68.netflix,
      desktop: scopeValue5(scopeValue69.desktop) ? scopeValue69.desktop : scopeValue68.desktop,
      bstage: scopeValue5(scopeValue69.bstage) ? scopeValue69.bstage : scopeValue68.bstage,
      x: scopeValue71,
      imessage: {
        uiState: {
          ...scopeValue68.imessage.uiState,
          ...(scopeValue5(scopeValue69.imessage?.uiState) ? scopeValue69.imessage.uiState : {})
        }
      }
    };
  }
  function scopeValue13() {
    return null;
  }
  function scopeValue14() {
    return true;
  }
  function scopeValue15(scopeValue72 = {}) {
    return {
      ...(scopeValue5(scopeValue72) ? scopeValue72 : {}),
      appState: scopeValue4(scopeValue12(scopeValue20))
    };
  }
  const scopeValue16 = scopeValue13();
  let scopeValue17 = !!scopeValue16,
    scopeValue18 = false;
  const scopeValue19 = new Set();
  let scopeValue20 = scopeValue12(scopeValue16);
  const scopeValue21 = Object.create(null);
  let scopeValue22 = null,
    scopeValue23 = null;
  function scopeValue24(scopeValue73) {
    const scopeValue74 = String(scopeValue73 || "");
    if (!scopeValue74) return 0;
    return scopeValue21[scopeValue74] = Math.max(0, Number(scopeValue21[scopeValue74]) || 0) + 1, scopeValue21[scopeValue74];
  }
  function scopeValue25() {
    window.__u2AppState = scopeValue20;
    window.__iisonAppState = scopeValue20;
  }
  async function scopeValue26() {
    if (!window.appStorage || typeof window.appStorage.commitDomain !== "function") return false;
    if (!scopeValue18 && scopeValue19.size === 0) return true;
    try {
      await window.appStorage.ready;
      const scopeValue75 = scopeValue4(scopeValue12(scopeValue20)),
        scopeValue76 = scopeValue19.size > 0 ? Array.from(scopeValue19) : Object.keys(scopeValue75);
      return await Promise.all(scopeValue76.filter(newScope76 => newScope76 !== "treasure").map(scopeValue77 => window.appStorage.commitDomain(scopeValue77, scopeValue75[scopeValue77], {
        critical: true,
        reason: "app-state:" + scopeValue77
      }))), scopeValue19.clear(), scopeValue18 = false, scopeValue22 = scopeValue15(scopeValue22 || {}), true;
    } catch (scopeValue78) {
      return console.warn("[app_state_bridge] Failed to persist app state:", scopeValue78), false;
    }
  }
  function scopeValue27() {
    if (scopeValue23) clearTimeout(scopeValue23);
    const scopeValue79 = () => {
      scopeValue23 = null;
      scopeValue26();
    };
    scopeValue23 = setTimeout(scopeValue79, scopeValue0);
  }
  window.getAllAppState = function scopeValue80() {
    return scopeValue20;
  };
  window.getAppState = function scopeValue82(scopeValue81) {
    if (!scopeValue81) return null;
    return scopeValue20 && Object.prototype.hasOwnProperty.call(scopeValue20, scopeValue81) ? scopeValue3(scopeValue20[scopeValue81]) : null;
  };
  window.getAppStateRevision = function scopeValue84(scopeValue83) {
    return Math.max(0, Number(scopeValue21[String(scopeValue83 || "")]) || 0);
  };
  window.setAppState = function scopeValue88(scopeValue85, scopeValue86, scopeValue87 = {}) {
    if (!scopeValue85) return null;
    scopeValue20[scopeValue85] = scopeValue5(scopeValue86) || Array.isArray(scopeValue86) ? scopeValue3(scopeValue86) : scopeValue86, scopeValue20 = scopeValue12(scopeValue20), scopeValue24(scopeValue85), scopeValue25();
    if (scopeValue87.persisted === true) return scopeValue87.returnState === false ? null : scopeValue3(scopeValue20[scopeValue85]);
    scopeValue18 = true, scopeValue19.add(String(scopeValue85));
    if (scopeValue87.save !== false) scopeValue27();
    return scopeValue87.returnState === false ? null : scopeValue3(scopeValue20[scopeValue85]);
  };
  window.updateAppState = function scopeValue92(scopeValue89, scopeValue90, scopeValue91 = {}) {
    if (!scopeValue89) return null;
    const scopeValue93 = window.getAppState(scopeValue89),
      scopeValue94 = scopeValue5(scopeValue93) || Array.isArray(scopeValue93) ? scopeValue3(scopeValue93) : scopeValue93,
      scopeValue95 = typeof scopeValue90 === "function" ? scopeValue90(scopeValue94) ?? scopeValue94 : scopeValue90;
    return window.setAppState(scopeValue89, scopeValue95, scopeValue91);
  };
  window.resetUnifiedAppState = function scopeValue97(scopeValue96 = {}) {
    scopeValue20 = scopeValue12();
    Object.keys(scopeValue20).forEach(scopeValue24);
    scopeValue25();
    scopeValue18 = true;
    Object.keys(scopeValue20).forEach(scopeValue98 => scopeValue19.add(scopeValue98));
    if (scopeValue96.save !== false) scopeValue27();
    return scopeValue3(scopeValue20);
  };
  window.saveGlobalData = async function scopeValue99() {
    return scopeValue23 && (clearTimeout(scopeValue23), scopeValue23 = null), scopeValue14(), scopeValue26();
  };
  window.loadGlobalData = async function scopeValue100() {
    if (window.appStorage && typeof window.appStorage.readDomain === "function") try {
      await window.appStorage.ready;
      const scopeValue101 = scopeValue2(),
        scopeValue102 = {};
      return Object.keys(scopeValue101).forEach(scopeValue103 => {
        scopeValue102[scopeValue103] = window.appStorage.readDomain(scopeValue103, scopeValue101[scopeValue103]);
      }), scopeValue20 = scopeValue12(scopeValue102), scopeValue18 && (scopeValue19.forEach(scopeValue104 => {
        if (scopeValue104 === "bstage") return;
        scopeValue20[scopeValue104] = scopeValue3(window.__u2AppState?.[scopeValue104] ?? scopeValue20[scopeValue104]);
      }), scopeValue20 = scopeValue10(window.__u2AppState, scopeValue20), scopeValue20 = scopeValue12(scopeValue20)), Object.keys(scopeValue20).forEach(scopeValue24), scopeValue22 = typeof window.appStorage.loadGlobalData === "function" ? await window.appStorage.loadGlobalData({
        includeAppState: false
      }) : {}, scopeValue22.appState = scopeValue3(scopeValue20), scopeValue25(), scopeValue15(scopeValue22);
    } catch (scopeValue105) {
      console.warn("[app_state_bridge] Failed to load global data:", scopeValue105);
    }
    return scopeValue15(scopeValue22 || {});
  };
  scopeValue25();
  function scopeValue28() {
    typeof window.saveGlobalData === "function" && window.saveGlobalData();
  }
  window.addEventListener("pagehide", scopeValue28);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") scopeValue28();
  });
  window.globalDataReadyPromise = window.loadGlobalData();
})();
