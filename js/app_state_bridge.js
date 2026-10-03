(function () {
    const SAVE_DEBOUNCE_MS = 120,
        defaultYoutubeState = {
            channelState: {
                bannerUrl: null,
                url: '',
                boundWorldBookIds: [],
                systemPrompt: '',
                summaryPrompt: '',
                groupChatPrompt: '',
                vodPrompt: '',
                postPrompt: '',
                liveSummaryPrompt: '',
                liveSummaries: [],
                groupChatHistory: [],
                cachedTrendingLive: null,
                cachedTrendingSub: null,
                activeUserLive: null,
                pastVideos: [],
                communityPosts: [],
                userCommunityChannel: null,
            },
            subscriptions: [],
            userState: null,
        };
    function handleAction_2() {
        return {
            youtube: clone(defaultYoutubeState),
            tiktok: {
                profile: {
                    name: 'User',
                    handle: 'user123',
                    avatar: null,
                    status: '',
                    bio: '',
                    persona: '',
                    following: 0,
                    followers: 0,
                    likes: 0,
                    posts: [],
                },
                chars: [],
                videos: [],
                dms: [],
            },
            pay: {
                transactions: [],
                balance: 1000,
            },
            spotify: {
                customName: '',
                avatarUrl: '',
                backgroundUrl: '',
            },
            diary: {
                schemaVersion: 2,
                profile: {
                    name: 'Diary User',
                    avatarUrl: '',
                    initialized: false,
                    sourceAccountId: null,
                },
                generationSettings: {
                    targetLength: 300,
                    contextCount: 30,
                    customPromptEnabled: false,
                    customPrompt: '',
                },
                entries: [],
            },
            maps: {
                mapsStore: [],
                activeMapId: null,
                friendPositionsStore: {},
            },
            netflix: {
                schemaVersion: 4,
                homeCatalog: null,
                activeRun: null,
                saveSlots: {
                    auto: null,
                    manual: [null, null, null, null, null, null],
                },
                mediaLibrary: {},
                unlockedEndings: [],
                uiSettings: {
                    textSpeed: 'normal',
                    reduceMotion: false,
                },
            },
            desktop: {},
            bstage: {},
            x: {
                xData: {
                    name: 'User',
                    handle: '@user',
                    bio: '',
                    location: '',
                    following: '0',
                    followers: '0',
                    persona: '',
                    avatar: '',
                    banner: '',
                },
                xPlayerAccounts: [],
                activeXPlayerAccountId: '',
                xAccountSchemaVersion: 1,
                xCharIdentityMigrationVersion: 0,
                xCharProfileMediaMigrationVersion: 0,
                xTopics: [],
                boundWorldBookIds: [],
                xVisitors: [],
                xDirectMessages: [],
                xPostThreads: {},
                xGeneratedPosts: [],
                xAccounts: [],
                xTrends: [
                    {
                        id: 'default-stage-style',
                        title: '#黑白舞台造型',
                        category: 'Entertainment · Trending',
                        heat: '52.8K',
                        movement: 'none',
                    },
                    {
                        id: 'default-topic-host',
                        title: '#超话主持人招募',
                        category: 'Community · Trending',
                        heat: '18.2K',
                        movement: 'none',
                    },
                    {
                        id: 'default-citywalk',
                        title: '#周末Citywalk',
                        category: 'City · Rising',
                        heat: '9.6K',
                        movement: 'none',
                    },
                ],
                xAdvancePreferences: {
                    strangersEnabled: true,
                    strangersCount: 5,
                    trendsEnabled: true,
                    trendsCount: 3,
                    postsEnabled: true,
                    postsCount: 3,
                },
                xHomeBannerUrl: '',
                xSearchBannerUrl: '',
            },
            imessage: {
                uiState: {
                    cssPresets: [],
                },
            },
        };
    }
    function clone(value_2) {
        if (value_2 == null || typeof value_2 !== 'object') return value_2;
        if (typeof structuredClone === 'function') return structuredClone(value_2);
        return JSON.parse(JSON.stringify(value_2));
    }
    function stripVolatileBlobUrls(value_3, seen = new WeakSet()) {
        if (typeof value_3 === 'string') return value_3.startsWith('blob:') ? null : value_3;
        if (value_3 == null || typeof value_3 !== 'object') return value_3;
        if (seen.has(value_3)) return undefined;
        seen.add(value_3);
        if (Array.isArray(value_3))
            return value_3
                .map((item) => stripVolatileBlobUrls(item, seen))
                .filter((item_2) => item_2 !== undefined);
        const result = {};
        return (
            Object.keys(value_3).forEach((key) => {
                const nextValue = stripVolatileBlobUrls(value_3[key], seen);
                if (nextValue !== undefined) result[key] = nextValue;
            }),
            result
        );
    }
    function isPlainObject(value_4) {
        return value_4 && typeof value_4 === 'object' && !Array.isArray(value_4);
    }
    function hasUsefulBstageState(value_5) {
        if (!isPlainObject(value_5)) return false;
        const hasMemberChatHistory = (members_2) =>
                Array.isArray(members_2) &&
                members_2.some(
                    (member) => Array.isArray(member?.chatHistory) && member.chatHistory.length > 0,
                ),
            meaningfulArrays = ['teams', 'bstageOrders', 'bstageFanChatHistory', 'chatPhotos'];
        if (
            meaningfulArrays.some(
                (key_2) => Array.isArray(value_5[key_2]) && value_5[key_2].length > 0,
            )
        )
            return true;
        if (
            Array.isArray(value_5.teams) &&
            value_5.teams.some((team) => hasMemberChatHistory(team?.members))
        )
            return true;
        const userTeam = value_5.bstageUserTeamState;
        if (isPlainObject(userTeam)) {
            if (hasMemberChatHistory(userTeam.members)) return true;
            if (Array.isArray(userTeam.members) && userTeam.members.length > 1) return true;
            if (Array.isArray(userTeam.videos) && userTeam.videos.length > 0) return true;
            if (Array.isArray(userTeam.shopItems) && userTeam.shopItems.length > 0) return true;
            if (
                userTeam.customName ||
                userTeam.customDesc ||
                userTeam.customAvatar ||
                userTeam.customBg
            )
                return true;
        }
        const fanChatSettings = value_5.bstageFanChatSettings;
        if (
            isPlainObject(fanChatSettings) &&
            (fanChatSettings.chatBg || fanChatSettings.chatCssId || fanChatSettings.bubbleCssId)
        )
            return true;
        const presets = value_5.bstagePresets;
        if (
            isPlainObject(presets) &&
            Object.keys(presets).some(
                (key_3) => Array.isArray(presets[key_3]) && presets[key_3].length > 0,
            )
        )
            return true;
        const revenue = value_5.bstageRevenueState;
        if (isPlainObject(revenue) && Number(revenue.withdrawnCny) > 0) return true;
        return false;
    }
    function getStateUpdatedAt(value_6) {
        const parsed = Number(value_6 && value_6.updatedAt);
        return Number.isFinite(parsed) ? parsed : 0;
    }
    function handleAction_4(localBstage, value_24) {
        if (!hasUsefulBstageState(value_24)) return false;
        if (!hasUsefulBstageState(localBstage)) return true;
        const durableUpdatedAt = getStateUpdatedAt(value_24),
            localUpdatedAt = getStateUpdatedAt(localBstage);
        return durableUpdatedAt > 0 && durableUpdatedAt > localUpdatedAt;
    }
    function handleAction_5(value_26, value_27) {
        const appState_28 = normalizeAppState(value_26),
            appState_29 = normalizeAppState(value_27);
        return (
            handleAction_4(appState_28.bstage, appState_29.bstage) &&
                (appState_28.bstage = clone(appState_29.bstage)),
            normalizeAppState(appState_28)
        );
    }
    function mergeDurableBaseWithRuntimeState(value_30, value_31) {
        const runtime = normalizeAppState(value_30),
            appState_33 = normalizeAppState(value_31);
        return (
            hasUsefulBstageState(runtime.bstage) &&
                !handleAction_4(runtime.bstage, appState_33.bstage) &&
                (appState_33.bstage = clone(runtime.bstage)),
            normalizeAppState(appState_33)
        );
    }
    function normalizeYoutubeState(value_34) {
        const safe = isPlainObject(value_34) ? value_34 : {},
            channelState_2 = isPlainObject(safe.channelState) ? safe.channelState : {};
        return {
            ...clone(defaultYoutubeState),
            ...safe,
            channelState: {
                ...clone(defaultYoutubeState.channelState),
                ...channelState_2,
                boundWorldBookIds: Array.isArray(channelState_2.boundWorldBookIds)
                    ? channelState_2.boundWorldBookIds.filter(Boolean)
                    : [],
                liveSummaries: Array.isArray(channelState_2.liveSummaries)
                    ? channelState_2.liveSummaries.filter(Boolean)
                    : [],
                groupChatHistory: Array.isArray(channelState_2.groupChatHistory)
                    ? channelState_2.groupChatHistory.filter(Boolean)
                    : [],
                activeUserLive: isPlainObject(channelState_2.activeUserLive)
                    ? channelState_2.activeUserLive
                    : null,
                pastVideos: Array.isArray(channelState_2.pastVideos)
                    ? channelState_2.pastVideos.filter(Boolean)
                    : [],
                communityPosts: Array.isArray(channelState_2.communityPosts)
                    ? channelState_2.communityPosts.filter(Boolean)
                    : [],
                userCommunityChannel: isPlainObject(channelState_2.userCommunityChannel)
                    ? channelState_2.userCommunityChannel
                    : null,
            },
            subscriptions: Array.isArray(safe.subscriptions)
                ? safe.subscriptions.filter(Boolean)
                : [],
            userState: isPlainObject(safe.userState) ? safe.userState : null,
        };
    }
    function normalizeAppState(value_37) {
        const defaults_2 = handleAction_2(),
            safe_2 = isPlainObject(value_37) ? value_37 : {},
            safeX = isPlainObject(safe_2.x) ? safe_2.x : {},
            x_2 = {
                ...defaults_2.x,
                ...safeX,
                xData: {
                    ...defaults_2.x.xData,
                    ...(isPlainObject(safeX.xData) ? safeX.xData : {}),
                },
                xPlayerAccounts: Array.isArray(safeX.xPlayerAccounts)
                    ? safeX.xPlayerAccounts
                    : defaults_2.x.xPlayerAccounts,
                activeXPlayerAccountId:
                    typeof safeX.activeXPlayerAccountId === 'string'
                        ? safeX.activeXPlayerAccountId
                        : defaults_2.x.activeXPlayerAccountId,
                xAccountSchemaVersion: Math.max(
                    1,
                    Number(safeX.xAccountSchemaVersion) || defaults_2.x.xAccountSchemaVersion,
                ),
                xCharIdentityMigrationVersion: Math.max(
                    0,
                    Number(safeX.xCharIdentityMigrationVersion) ||
                        defaults_2.x.xCharIdentityMigrationVersion,
                ),
                xCharProfileMediaMigrationVersion: Math.max(
                    0,
                    Number(safeX.xCharProfileMediaMigrationVersion) ||
                        defaults_2.x.xCharProfileMediaMigrationVersion,
                ),
                xTopics: Array.isArray(safeX.xTopics) ? safeX.xTopics : defaults_2.x.xTopics,
                boundWorldBookIds: Array.isArray(safeX.boundWorldBookIds)
                    ? safeX.boundWorldBookIds.map(String)
                    : defaults_2.x.boundWorldBookIds,
                xVisitors: Array.isArray(safeX.xVisitors)
                    ? safeX.xVisitors
                    : defaults_2.x.xVisitors,
                xDirectMessages: Array.isArray(safeX.xDirectMessages)
                    ? safeX.xDirectMessages
                    : defaults_2.x.xDirectMessages,
                xPostThreads: isPlainObject(safeX.xPostThreads)
                    ? safeX.xPostThreads
                    : defaults_2.x.xPostThreads,
                xGeneratedPosts: Array.isArray(safeX.xGeneratedPosts)
                    ? safeX.xGeneratedPosts
                    : defaults_2.x.xGeneratedPosts,
                xAccounts: Array.isArray(safeX.xAccounts)
                    ? safeX.xAccounts
                    : defaults_2.x.xAccounts,
                xTrends: Array.isArray(safeX.xTrends) ? safeX.xTrends : defaults_2.x.xTrends,
                xAdvancePreferences: isPlainObject(safeX.xAdvancePreferences)
                    ? safeX.xAdvancePreferences
                    : defaults_2.x.xAdvancePreferences,
                xHomeBannerUrl:
                    typeof safeX.xHomeBannerUrl === 'string'
                        ? safeX.xHomeBannerUrl
                        : defaults_2.x.xHomeBannerUrl,
                xSearchBannerUrl:
                    typeof safeX.xSearchBannerUrl === 'string'
                        ? safeX.xSearchBannerUrl
                        : defaults_2.x.xSearchBannerUrl,
            };
        return (
            delete x_2.xCurrentDate,
            {
                ...defaults_2,
                ...safe_2,
                youtube: normalizeYoutubeState(safe_2.youtube),
                tiktok: {
                    ...defaults_2.tiktok,
                    ...(isPlainObject(safe_2.tiktok) ? safe_2.tiktok : {}),
                },
                pay: {
                    ...defaults_2.pay,
                    ...(isPlainObject(safe_2.pay) ? safe_2.pay : {}),
                },
                spotify: {
                    ...defaults_2.spotify,
                    ...(isPlainObject(safe_2.spotify) ? safe_2.spotify : {}),
                },
                diary: {
                    ...defaults_2.diary,
                    ...(isPlainObject(safe_2.diary) ? safe_2.diary : {}),
                },
                maps: {
                    ...defaults_2.maps,
                    ...(isPlainObject(safe_2.maps) ? safe_2.maps : {}),
                },
                netflix: isPlainObject(safe_2.netflix) ? safe_2.netflix : defaults_2.netflix,
                desktop: isPlainObject(safe_2.desktop) ? safe_2.desktop : defaults_2.desktop,
                bstage: isPlainObject(safe_2.bstage) ? safe_2.bstage : defaults_2.bstage,
                x: x_2,
                imessage: {
                    uiState: {
                        ...defaults_2.imessage.uiState,
                        ...(isPlainObject(safe_2.imessage?.uiState) ? safe_2.imessage.uiState : {}),
                    },
                },
            }
        );
    }
    function loadLocalAppState() {
        return null;
    }
    function saveLocalAppState() {
        return true;
    }
    function buildGlobalDataForSave(base = {}) {
        return {
            ...(isPlainObject(base) ? base : {}),
            appState: stripVolatileBlobUrls(normalizeAppState(appState_2)),
        };
    }
    const localAppState = loadLocalAppState();
    let value = !!localAppState,
        runtimeDirty = false;
    const dirtyAppKeys = new Set();
    let appState_2 = normalizeAppState(localAppState);
    const appStateRevisions = Object.create(null);
    let globalDataCache = null,
        saveTimer = null;
    function bumpAppStateRevision(value_42) {
        const key_4 = String(value_42 || '');
        if (!key_4) return 0;
        return (
            (appStateRevisions[key_4] = Math.max(0, Number(appStateRevisions[key_4]) || 0) + 1),
            appStateRevisions[key_4]
        );
    }
    function syncWindowState() {
        window.__u2AppState = appState_2;
        window.__iisonAppState = appState_2;
    }
    async function persistToAppStorage() {
        if (!window.appStorage || typeof window.appStorage.commitDomain !== 'function')
            return false;
        if (!runtimeDirty && dirtyAppKeys.size === 0) return true;
        try {
            await window.appStorage.ready;
            const normalized = stripVolatileBlobUrls(normalizeAppState(appState_2)),
                keys_2 = dirtyAppKeys.size > 0 ? Array.from(dirtyAppKeys) : Object.keys(normalized);
            return (
                await Promise.all(
                    keys_2.map((value_45) =>
                        window.appStorage.commitDomain(value_45, normalized[value_45], {
                            critical: true,
                            reason: 'app-state:' + value_45,
                        }),
                    ),
                ),
                dirtyAppKeys.clear(),
                (runtimeDirty = false),
                (globalDataCache = buildGlobalDataForSave(globalDataCache || {})),
                true
            );
        } catch (error) {
            return (console.warn('[app_state_bridge] Failed to persist app state:', error), false);
        }
    }
    function scheduleSave() {
        if (saveTimer) clearTimeout(saveTimer);
        const runPersist = () => {
            saveTimer = null;
            persistToAppStorage();
        };
        saveTimer = setTimeout(runPersist, SAVE_DEBOUNCE_MS);
    }
    window.getAllAppState = function getAllAppState_2() {
        return appState_2;
    };
    window.getAppState = function getAppState_2(appKey) {
        if (!appKey) return null;
        return appState_2 && Object.prototype.hasOwnProperty.call(appState_2, appKey)
            ? clone(appState_2[appKey])
            : null;
    };
    window.getAppStateRevision = function getAppStateRevision_2(appKey_2) {
        return Math.max(0, Number(appStateRevisions[String(appKey_2 || '')]) || 0);
    };
    window.setAppState = function setAppState_2(appKey_3, nextState, options_2 = {}) {
        if (!appKey_3) return null;
        appState_2[appKey_3] =
            isPlainObject(nextState) || Array.isArray(nextState) ? clone(nextState) : nextState;
        appState_2 = normalizeAppState(appState_2);
        bumpAppStateRevision(appKey_3);
        syncWindowState();
        runtimeDirty = true;
        dirtyAppKeys.add(String(appKey_3));
        if (options_2.save !== false) scheduleSave();
        return clone(appState_2[appKey_3]);
    };
    window.updateAppState = function value_57(appKey_4, updater, options_3 = {}) {
        if (!appKey_4) return null;
        const previous = window.getAppState(appKey_4),
            draft = isPlainObject(previous) || Array.isArray(previous) ? clone(previous) : previous,
            nextState_2 = typeof updater === 'function' ? (updater(draft) ?? draft) : updater;
        return window.setAppState(appKey_4, nextState_2, options_3);
    };
    window.resetUnifiedAppState = function resetUnifiedAppState_2(options_4 = {}) {
        appState_2 = normalizeAppState();
        Object.keys(appState_2).forEach(bumpAppStateRevision);
        syncWindowState();
        runtimeDirty = true;
        Object.keys(appState_2).forEach((key_5) => dirtyAppKeys.add(key_5));
        if (options_4.save !== false) scheduleSave();
        return clone(appState_2);
    };
    window.saveGlobalData = async function value_64() {
        return (
            saveTimer && (clearTimeout(saveTimer), (saveTimer = null)),
            saveLocalAppState(),
            persistToAppStorage()
        );
    };
    window.loadGlobalData = async function value_65() {
        if (window.appStorage && typeof window.appStorage.readDomain === 'function')
            try {
                await window.appStorage.ready;
                const defaults = handleAction_2(),
                    durableState = {};
                return (
                    Object.keys(defaults).forEach((key_6) => {
                        durableState[key_6] = window.appStorage.readDomain(key_6, defaults[key_6]);
                    }),
                    (appState_2 = normalizeAppState(durableState)),
                    runtimeDirty &&
                        (dirtyAppKeys.forEach((key_7) => {
                            if (key_7 === 'bstage') return;
                            appState_2[key_7] = clone(
                                window.__u2AppState?.[key_7] ?? appState_2[key_7],
                            );
                        }),
                        (appState_2 = mergeDurableBaseWithRuntimeState(
                            window.__u2AppState,
                            appState_2,
                        )),
                        (appState_2 = normalizeAppState(appState_2))),
                    Object.keys(appState_2).forEach(bumpAppStateRevision),
                    (globalDataCache =
                        typeof window.appStorage.loadGlobalData === 'function'
                            ? await window.appStorage.loadGlobalData()
                            : {}),
                    (globalDataCache.appState = clone(appState_2)),
                    syncWindowState(),
                    buildGlobalDataForSave(globalDataCache)
                );
            } catch (error_2) {
                console.warn('[app_state_bridge] Failed to load global data:', error_2);
            }
        return buildGlobalDataForSave(globalDataCache || {});
    };
    syncWindowState();
    function flushAppStateForPageLifecycle() {
        typeof window.saveGlobalData === 'function' && window.saveGlobalData();
    }
    window.addEventListener('pagehide', flushAppStateForPageLifecycle);
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') flushAppStateForPageLifecycle();
    });
    window.globalDataReadyPromise = window.loadGlobalData();
})();
