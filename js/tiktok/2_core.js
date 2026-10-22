function createDefaultTkState() {
    return {
        profile: {
            name: 'User',
            handle: 'user123',
            avatar: null,
            status: '思考中...',
            bio: '点击添加个人简介',
            persona: '',
            following: 0,
            followers: 0,
            likes: 0,
            posts: [],
            visitors: [],
        },
        activity: {
            newFollowers: '暂无新粉丝',
            likesSaves: '互动消息',
            commentsMentions: '互动消息',
            followers: [],
            likes: [],
            saves: [],
            comments: [],
        },
        settings: {
            boundWorldBookIds: [],
        },
        chars: [],
        videos: [
            {
                id: 'v_default_1',
                authorId: 'user_default_1',
                authorName: 'Mew',
                desc: '周末的正确打开方式，当然是和猫猫一起虚度光阴啦 🐈 #猫咪日常 #周末vlog',
                sceneText:
                    '阳光穿过窗纱洒在木地板上，一只橘猫正四仰八叉地躺在阳光里打呼噜。镜头缓慢拉近，画面色调温暖治愈，配着慵懒的 lofi 音乐。',
                likes: 12543,
                commentsCount: 432,
                shares: 128,
                isLiked: false,
                comments: [
                    {
                        authorName: 'Cici',
                        text: '好治愈的画面，想去你家偷猫！',
                        likes: 231,
                    },
                    {
                        authorName: '鱼蛋',
                        text: '这猫怎么长得跟人一样哈哈哈',
                        likes: 89,
                    },
                ],
            },
            {
                id: 'v_default_2',
                authorId: 'user_default_2',
                authorName: 'CityWalker',
                desc: '下雨天的城市，也有别样的浪漫 🌧️ 📸 #扫街 #下雨天 #摄影',
                sceneText:
                    '镜头跟随着一把透明雨伞，穿梭在霓虹闪烁的积水街道。水面倒映着红蓝色的灯牌，雨滴砸在伞面上发出清脆的白噪音，氛围感拉满。',
                likes: 8762,
                commentsCount: 215,
                shares: 342,
                isLiked: false,
                comments: [
                    {
                        authorName: '光影',
                        text: '色彩太棒了，求个滤镜参数',
                        likes: 156,
                    },
                    {
                        authorName: 'Jay',
                        text: '喜欢下雨天的人，内心都很温柔吧',
                        likes: 44,
                    },
                ],
            },
        ],
        dms: [],
    };
}
function normalizeTkState(rawState = {}) {
    const defaults = createDefaultTkState();
    const safeState = rawState && typeof rawState === 'object' ? rawState : {};
    const imFriends =
        typeof window.getImFriends === 'function'
            ? window.getImFriends()
            : Array.isArray(window.imData?.friends)
              ? window.imData.friends
              : [];
    const isLinkedImFriend = (char = {}) => {
            if (!Array.isArray(imFriends) || imFriends.length === 0) return false;
            return imFriends.some((friend) => {
                if (!friend || friend.isOfficial || friend.type === 'official') return false;
                return (
                    String(friend.id) === String(char.imCharId || char.id) ||
                    String(friend.nickname || '') === String(char.name || '') ||
                    String(friend.realName || '') === String(char.name || '')
                );
            });
        };
    const chars_2 = Array.isArray(safeState.chars)
        ? safeState.chars.map((char_2) => ({
                  ...char_2,
                  isFollowed: Boolean(char_2.isFollowed),
                  isFollower: Boolean(
                      char_2.isFollower || (char_2.isFollowed && isLinkedImFriend(char_2)),
                  ),
              }))
        : defaults.chars;
    return {
        ...defaults,
        ...safeState,
        profile: {
            ...defaults.profile,
            ...(safeState.profile && typeof safeState.profile === 'object'
                ? safeState.profile
                : {}),
        },
        activity: {
            ...defaults.activity,
            ...(safeState.activity && typeof safeState.activity === 'object'
                ? safeState.activity
                : {}),
            followers: Array.isArray(safeState.activity?.followers)
                ? safeState.activity.followers
                : [],
            likes: Array.isArray(safeState.activity?.likes) ? safeState.activity.likes : [],
            saves: Array.isArray(safeState.activity?.saves) ? safeState.activity.saves : [],
            comments: Array.isArray(safeState.activity?.comments)
                ? safeState.activity.comments
                : [],
        },
        settings: {
            ...defaults.settings,
            ...(safeState.settings && typeof safeState.settings === 'object'
                ? safeState.settings
                : {}),
            boundWorldBookIds: Array.isArray(safeState.settings?.boundWorldBookIds)
                ? safeState.settings.boundWorldBookIds.filter(Boolean)
                : [],
            feedDefaultsVersion: 1,
        },
        chars: chars_2,
        // The bridge's empty fallback has no TikTok activity state. An already
        // initialized empty feed (including older explicit clears) stays empty.
        videos:
            Array.isArray(safeState.videos) &&
            (safeState.videos.length ||
                safeState.settings?.feedDefaultsVersion === 1 ||
                safeState.settings?.videosCleared === true ||
                Object.prototype.hasOwnProperty.call(safeState, 'activity'))
                ? safeState.videos
                : defaults.videos,
        dms: Array.isArray(safeState.dms) ? safeState.dms : defaults.dms,
    };
}
function loadTkStateFromStore() {
    const raw = typeof window.getAppState === 'function' ? window.getAppState('tiktok') : null,
        normalized = normalizeTkState(raw);
    return (
        window.userState &&
            ((!normalized.profile.name || normalized.profile.name === 'User') &&
                (normalized.profile.name = window.userState.name || 'User'),
            !normalized.profile.avatar &&
                window.userState.avatarUrl &&
                (normalized.profile.avatar = window.userState.avatarUrl)),
        normalized
    );
}
const tkState = loadTkStateFromStore();
window.tkState = tkState;
function invalidateTkTabRenders(_value = ['tk-home-tab', 'tk-chat-tab', 'tk-profile-tab']) {
    _value.forEach((value_7) => {
        const _value2 = document.getElementById(value_7);
        if (_value2) delete _value2.dataset.tkRendered;
    });
}
function persistTkState(_value3 = {}) {
    invalidateTkTabRenders(_value3.dirtyTabs);
    const nextState = normalizeTkState(tkState);
    if (typeof window.setAppState === 'function') {
        window.setAppState('tiktok', nextState);
        return;
    }
    window.saveGlobalData && window.saveGlobalData();
}
window.tkGetChar = function (charId) {
    return tkState.chars.find((c) => String(c.id) === String(charId));
};
const tkVideoAssetUrls = new Map();
window.tkCacheVideoAsset = (_value4, _value5) => tkVideoAssetUrls.set(_value4, _value5);
window.tkNormalizeMediaUrl = function (source) {
    if (typeof source !== 'string') return '';
    let url = source.trim().replace(/&amp;/g, '&');
    if (!url || /^(?:null|undefined|\[object Object\])$/i.test(url)) return '';
    const bundled = url.match(
        /^(?:file:\/\/\/android_asset\/(?:www|public)\/|(?:capacitor|ionic|https?):\/\/localhost\/)(assets\/.+)$/i,
    );
    if (bundled) url = bundled[1];
    if (url.startsWith('/assets/')) url = url.slice(1);
    if (/^http:\/\/(?:picsum\.photos|api\.dicebear\.com)\//i.test(url))
        url = url.replace(/^http:/i, 'https:');
    if (/^(?:https?:|blob:|data:image\/)/i.test(url) || url.startsWith('//')) return url;
    if (/^(?:\/|\.\.?\/|assets\/)/i.test(url) || /\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i.test(url))
        return url;
    return '';
};
window.tkGetVideoCover = function (_value6 = {}) {
    return (
        tkVideoAssetUrls.get(_value6.generatedCoverAssetId) ||
        window.tkNormalizeMediaUrl(_value6.cover) ||
        window.tkNormalizeMediaUrl(_value6.bgImage) ||
        window.tkNormalizeMediaUrl(_value6.imageUrl) ||
        ''
    );
};
window.tkHydrateVideoAssets = async function () {
    const _value7 = [...tkState.videos, ...(tkState.profile.posts || [])];
    const _value8 = [
        ...new Set(_value7.map((_value9) => _value9.generatedCoverAssetId).filter(Boolean)),
    ];
    await Promise.all(
        _value8.map(async (_value0) => {
            try {
                const _value1 = await window.appStorage?.getAssetUrl?.(_value0);
                if (_value1) tkVideoAssetUrls.set(_value0, _value1);
            } catch (error) {
                console.warn('TikTok image recovery failed:', error);
            }
        }),
    );
    const restores = [];
    const seen = new WeakSet();
    const visit = (entry) => {
        if (!entry || typeof entry !== 'object' || seen.has(entry)) return;
        seen.add(entry);
        for (const field of ['avatar', 'authorAvatar', 'cover', 'bgImage', 'imageUrl']) {
            const assetId = entry[field + 'AssetId'];
            if (!assetId || (entry[field] && !String(entry[field]).startsWith('blob:'))) continue;
            restores.push(
                Promise.resolve(window.appStorage?.getAssetUrl?.(assetId))
                    .then((url) => { if (url) entry[field] = url; })
                    .catch((error) => console.warn('TikTok media recovery failed:', error)),
            );
        }
        Object.values(entry).forEach(visit);
    };
    visit(tkState);
    await Promise.all(restores);
};
window.tkSaveChar = function (charData) {
    const existing = tkState.chars.find((c_2) => c_2.id === charData.id);
    existing
        ? Object.assign(existing, {
              isFollowed: Boolean(existing.isFollowed),
              isFollower: Boolean(existing.isFollower),
              ...charData,
          })
        : tkState.chars.push({
              isFollowed: false,
              isFollower: false,
              ...charData,
          });
    persistTkState();
};
window.tkPersistState = persistTkState;
let tkInteractiveSaveTimer = null;
function flushTkInteractiveSave() {
    if (tkInteractiveSaveTimer === null) return;
    clearTimeout(tkInteractiveSaveTimer);
    tkInteractiveSaveTimer = null;
    persistTkState({
        dirtyTabs: [],
    });
}
window.tkPersistStateAfterPaint = function (_value10 = {}) {
    invalidateTkTabRenders(_value10.dirtyTabs || ['tk-chat-tab', 'tk-profile-tab']);
    if (tkInteractiveSaveTimer !== null) clearTimeout(tkInteractiveSaveTimer);
    tkInteractiveSaveTimer = setTimeout(flushTkInteractiveSave, 160);
};
const tkDataRevisions = {
    videos: 0,
    dms: 0,
};
const tkPendingRequests = new Set();
const tkBlockedScopes = new Set();
let tkCleanupInProgress = false;
window.tkCaptureDataGuard = function (_value11) {
    const _value12 = tkDataRevisions[_value11];
    return () => !tkBlockedScopes.has(_value11) && _value12 === tkDataRevisions[_value11];
};
function tkCancelledRequest() {
    return Object.assign(new Error('清理前的请求已取消'), {
        name: 'AbortError',
    });
}
window.tkFetch = async function (_value13, _value14, _value15 = {}) {
    const _value16 = window.tkCaptureDataGuard(_value13);
    if (!_value16()) throw tkCancelledRequest();
    const _value17 = new AbortController();
    const _value18 = {
        scope: _value13,
        controller: _value17,
    };
    tkPendingRequests.add(_value18);
    try {
        const _value19 = await fetch(_value14, {
            ..._value15,
            signal: _value17.signal,
        });
        if (!_value16()) throw tkCancelledRequest();
        const _value20 = _value19.json.bind(_value19);
        _value19.json = async () => {
            try {
                const _value21 = await _value20();
                if (!_value16()) throw tkCancelledRequest();
                return _value21;
            } finally {
                tkPendingRequests['delete'](_value18);
            }
        };
        if (!_value19.ok) tkPendingRequests['delete'](_value18);
        return _value19;
    } catch (_value22) {
        tkPendingRequests['delete'](_value18);
        throw _value22;
    }
};
window.tkClearData = async function (_value23) {
    if (!['videos', 'dms', 'all'].includes(_value23)) throw new Error('未知的清理类型');
    if (tkCleanupInProgress) return false;
    tkCleanupInProgress = true;
    const _value24 = _value23 === 'all' ? ['videos', 'dms'] : [_value23];
    _value24.forEach((_value28) => {
        tkDataRevisions[_value28]++;
        tkBlockedScopes.add(_value28);
    });
    tkPendingRequests.forEach((_value29) => {
        _value24.includes(_value29.scope) &&
            (_value29.controller.abort(), tkPendingRequests['delete'](_value29));
    });
    if (tkInteractiveSaveTimer !== null) clearTimeout(tkInteractiveSaveTimer);
    tkInteractiveSaveTimer = null;
    const _value25 = {
        ...tkState,
    };
    let _value26;
    if (_value23 === 'all') {
        _value26 = createDefaultTkState();
        _value26.videos = [];
        _value26.profile.name = window.userState?.name || _value26.profile.name;
        _value26.profile.avatar = window.userState?.avatarUrl || null;
    } else
        _value23 === 'dms'
            ? (_value26 = {
                  ...tkState,
                  dms: [],
              })
            : (_value26 = {
                  ...tkState,
                  videos: [],
                  profile: {
                      ...tkState.profile,
                      posts: [],
                  },
                  chars: tkState.chars.map((_value30) => ({
                      ..._value30,
                      likedVideoIds: [],
                  })),
                  activity: {
                      ...tkState.activity,
                      likes: [],
                      saves: [],
                      comments: [],
                      likesSaves: '互动消息',
                      commentsMentions: '互动消息',
                  },
                  dms: tkState.dms.map((_value31) => ({
                      ..._value31,
                      messages: (_value31.messages || []).map((_value32) => {
                          if (!_value32.sharedVideoId) return _value32;
                          const { sharedVideoId: _value33, ..._value34 } = _value32;
                          return {
                              ..._value34,
                              text: /^\[分享(?:了)?视频\]$/.test(_value32.text || '')
                                  ? '[视频已清理]'
                                  : _value32.text,
                          };
                      }),
                  })),
              });
    if (_value23 === 'videos' || _value23 === 'all') {
        _value26.settings = {
            ..._value26.settings,
            feedDefaultsVersion: 1,
            videosCleared: true,
        };
    }
    const _value27 = (_value35) => {
        Object.keys(tkState).forEach((_value36) => delete tkState[_value36]);
        Object.assign(tkState, _value35);
    };
    try {
        _value27(_value26);
        persistTkState();
        const _value37 = await window.saveGlobalData?.();
        if (_value37 === false) throw new Error('清理保存失败，请重试');
    } catch (_value38) {
        _value27(_value25);
        persistTkState();
        tkCleanupInProgress = false;
        _value24.forEach((_value39) => tkBlockedScopes['delete'](_value39));
        throw _value38;
    }
    try {
        if (_value23 !== 'dms') tkVideoAssetUrls.clear();
        document.dispatchEvent(
            new CustomEvent('tk:data-cleared', {
                detail: {
                    kind: _value23,
                },
            }),
        );
        window.tkRenderHome?.();
        window.tkRenderChat?.();
        window.tkRenderProfile?.();
        const _value40 =
            _value23 === 'all'
                ? _value25
                : _value23 === 'videos'
                  ? [_value25.videos, _value25.profile.posts]
                  : _value25.dms;
        await window.appStorage
            ?.releaseAssetsFromDeletedRecords?.(_value40)
            ['catch']((_value41) => {
                console.warn('TikTok unused resource cleanup failed:', _value41);
            });
        return true;
    } finally {
        tkCleanupInProgress = false;
        _value24.forEach((_value42) => tkBlockedScopes['delete'](_value42));
    }
};
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushTkInteractiveSave();
});
window.addEventListener?.('pagehide', flushTkInteractiveSave);
window.tkLoadStateFromStore = function () {
    const nextState_2 = loadTkStateFromStore();
    return (Object.assign(tkState, nextState_2), invalidateTkTabRenders(), tkState);
};
function refreshTkUiAfterHydration() {
    const tkView_2 = document.getElementById('tiktok-view');
    if (!tkView_2 || !tkView_2.classList.contains('active')) return;
    const id_10 = tkView_2.querySelector('.tk-tab-content.active')?.id;
    if (id_10 === 'tk-chat-tab') window.tkRenderChat?.();
    else {
        if (id_10 === 'tk-profile-tab') window.tkRenderProfile?.();
        else window.tkRenderHome?.();
    }
}
window.globalDataReadyPromise && typeof window.globalDataReadyPromise.then === 'function'
    ? (window.tkDataReadyPromise = window.globalDataReadyPromise
          .then(async () => {
              window.tkLoadStateFromStore();
              if (window.getAppState?.('tiktok')?.settings?.feedDefaultsVersion !== 1)
                  persistTkState();
              await window.tkHydrateVideoAssets();
              refreshTkUiAfterHydration();
              return true;
          })
          ['catch']((error_2) => {
              return (console.warn('TikTok global data recovery failed:', error_2), false);
          }))
    : (window.tkDataReadyPromise = window
          .tkHydrateVideoAssets()
          .then(() => true)
          ['catch'](() => false));
(
    window.u2OnStorageReady ||
    ((callback) => document.addEventListener('DOMContentLoaded', callback))
)(() => {
    const tkAppBtn = document.getElementById('app-tiktok-btn');
    const tkView = document.getElementById('tiktok-view');
    const homeBar = document.getElementById('home-bar');
    const tkNavItems = document.querySelectorAll('.tk-bottom-nav .tk-nav-item[data-target]');
    const tkTabContents = document.querySelectorAll('.tk-tab-content');
    const mediaLoads = new WeakMap();
    function prepareTkImage(image) {
        const source = image.getAttribute('src') || '';
        const previous = mediaLoads.get(image);
        image.referrerPolicy = 'no-referrer';
        if (!source || previous?.source === source) return;
        const normalized = window.tkNormalizeMediaUrl(source);
        mediaLoads.set(image, { source: normalized || source, retried: false });
        if (normalized && normalized !== source) image.src = normalized;
    }
    function prepareTkImages(root) {
        if (root?.matches?.('img')) prepareTkImage(root);
        root?.querySelectorAll?.('img').forEach(prepareTkImage);
    }
    prepareTkImages(tkView);
    tkView?.addEventListener('error', (event) => {
        const image = event.target;
        if (!(image instanceof HTMLImageElement)) return;
        prepareTkImage(image);
        const load = mediaLoads.get(image);
        if (!load || load.retried || !/^https?:\/\//i.test(image.src)) return;
        load.retried = true;
        image.src = load.source;
    }, true);
    if (tkView && typeof MutationObserver === 'function') {
        new MutationObserver((changes) => {
            changes.forEach((change) => {
                if (change.type === 'attributes') prepareTkImage(change.target);
                else change.addedNodes.forEach(prepareTkImages);
            });
        }).observe(tkView, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
    }
    function initTikTok() {
        handleAction_14(count);
    }
    tkAppBtn &&
        tkView &&
        tkAppBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.isJiggleMode) return;
            try {
                initTikTok();
            } catch (err) {
                console.error('TikTok Init Error:', err);
            }
            tkView.classList.add('active');
        });
    const closeTkApp = () => {
        window.closeView(document.getElementById('tk-search-generate-sheet'));
        window.tkCloseImageGeneration?.();
        window.closeView(tkView);
        window.closeView(document.getElementById('tk-video-detail-sheet'));
        window.closeView(document.getElementById('tk-edit-profile-sheet'));
        window.closeView(document.getElementById('tk-edit-char-sheet'));
        window.closeView(document.getElementById('tk-import-char-sheet'));
        window.closeView(document.getElementById('tk-share-sheet'));
        document.getElementById('tk-sub-profile-view').classList.remove('active');
    };
    const homeBackBtn = document.getElementById('tk-home-back-btn');
    if (homeBackBtn) homeBackBtn.addEventListener('click', closeTkApp);
    const tkNavIndicator = document.querySelector('.tk-nav-indicator');
    const mainContent = document.querySelector('.tk-main-content');
    let count = 0;
    let enabled = false;
    let count_13 = 0;
    function handleAction_14(currentTabIndex) {
        const targetId = tkNavItems[currentTabIndex]?.getAttribute('data-target'),
            value_20 = targetId && document.getElementById(targetId);
        if (!value_20 || value_20.dataset.tkRendered === 'true') return;
        const map_21 = Array.from(value_20.querySelectorAll('[id]'))
            .filter((value_22) => value_22.scrollTop || value_22.scrollLeft)
            .map((value_23) => [value_23.id, value_23.scrollTop, value_23.scrollLeft]);
        if (targetId === 'tk-home-tab') window.tkRenderHome?.();
        else {
            if (targetId === 'tk-chat-tab') window.tkRenderChat?.();
            else {
                if (targetId === 'tk-profile-tab') window.tkRenderProfile?.();
            }
        }
        map_21.forEach(([value_24, scrollTop_2, scrollLeft_2]) => {
            const elementById = document.getElementById(value_24);
            elementById &&
                value_20.contains(elementById) &&
                ((elementById.scrollTop = scrollTop_2), (elementById.scrollLeft = scrollLeft_2));
        });
    }
    function handleAction_15(value_27) {
        const value_28 = ++count_13;
        requestAnimationFrame(() =>
            requestAnimationFrame(() => {
                if (value_28 === count_13 && value_27 === count) handleAction_14(value_27);
            }),
        );
    }
    function switchTab(index, value_29 = {}) {
        if (index < 0 || index >= tkNavItems.length) return;
        if (enabled && index === count && !value_29.force) return;
        count = index;
        enabled = true;
        tkNavItems.forEach((nav, i) => {
            if (i === index) nav.classList.add('active');
            else nav.classList.remove('active');
        });
        if (tkNavIndicator) {
            const targetItem = tkNavItems[index],
                navRect = targetItem.parentElement.getBoundingClientRect(),
                itemRect = targetItem.getBoundingClientRect(),
                value_32 = itemRect.left - navRect.left - 4;
            tkNavIndicator.style.width = itemRect.width + 'px';
            tkNavIndicator.style.transform = 'translateX(' + value_32 + 'px)';
        }
        tkTabContents.forEach((element, value_33) => {
            element.classList.toggle('active', value_33 === index);
        });
        if (value_29.render === false) return;
        handleAction_15(index);
    }
    tkNavItems.forEach((item, index_2) => {
        item.addEventListener('click', () => {
            switchTab(index_2);
        });
    });
    let count_16 = 0;
    let count_17 = 0;
    let enabled_18 = false;
    mainContent &&
        (mainContent.addEventListener(
            'touchstart',
            (e_2) => {
                if (e_2.target.closest('.tk-following-bar')) return;
                count_16 = e_2.touches[0].clientX;
                count_17 = e_2.touches[0].clientY;
                enabled_18 = true;
            },
            {
                passive: true,
            },
        ),
        mainContent.addEventListener('touchend', (e_3) => {
            if (!enabled_18) return;
            enabled_18 = false;
            let endX = e_3.changedTouches[0].clientX,
                value_37 = count_16 - endX,
                abs_38 = Math.abs(count_17 - e_3.changedTouches[0].clientY);
            if (Math.abs(value_37) > 50 && Math.abs(value_37) > abs_38) {
                if (value_37 > 0 && count < tkNavItems.length - 1) switchTab(count + 1);
                else value_37 < 0 && count > 0 && switchTab(count - 1);
            }
        }));
    switchTab(0, {
        render: false,
    });
});
