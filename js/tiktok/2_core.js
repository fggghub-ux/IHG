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
    const defaults = createDefaultTkState(),
        safeState = rawState && typeof rawState === 'object' ? rawState : {},
        imFriends =
            typeof window.getImFriends === 'function'
                ? window.getImFriends()
                : Array.isArray(window.imData?.friends)
                  ? window.imData.friends
                  : [],
        isLinkedImFriend = (char = {}) => {
            if (!Array.isArray(imFriends) || imFriends.length === 0) return false;
            return imFriends.some((friend) => {
                if (!friend || friend.isOfficial || friend.type === 'official') return false;
                return (
                    String(friend.id) === String(char.imCharId || char.id) ||
                    String(friend.nickname || '') === String(char.name || '') ||
                    String(friend.realName || '') === String(char.name || '')
                );
            });
        },
        chars_2 = Array.isArray(safeState.chars)
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
        },
        chars: chars_2,
        videos:
            Array.isArray(safeState.videos) && safeState.videos.length > 0
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
function invalidateTkTabRenders() {
    document
        .querySelectorAll('.tk-tab-content')
        .forEach((value_7) => delete value_7.dataset.tkRendered);
}
function persistTkState() {
    invalidateTkTabRenders();
    const nextState = normalizeTkState(tkState);
    if (typeof window.setAppState === 'function') {
        window.setAppState('tiktok', nextState);
        return;
    }
    window.saveGlobalData && window.saveGlobalData();
}
window.tkGetChar = function (charId) {
    return tkState.chars.find((c) => c.id === charId);
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
    persistTkState();
}
window.tkPersistStateAfterPaint = function () {
    if (tkInteractiveSaveTimer !== null) clearTimeout(tkInteractiveSaveTimer);
    tkInteractiveSaveTimer = setTimeout(flushTkInteractiveSave, 48);
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
          .then(() => {
              return (window.tkLoadStateFromStore(), refreshTkUiAfterHydration(), true);
          })
          ['catch']((error_2) => {
              return (console.warn('TikTok global data recovery failed:', error_2), false);
          }))
    : (window.tkDataReadyPromise = Promise.resolve(true));
(
    window.u2OnStorageReady ||
    ((callback) => document.addEventListener('DOMContentLoaded', callback))
)(() => {
    const tkAppBtn = document.getElementById('app-tiktok-btn'),
        tkView = document.getElementById('tiktok-view'),
        homeBar = document.getElementById('home-bar'),
        tkNavItems = document.querySelectorAll('.tk-bottom-nav .tk-nav-item[data-target]'),
        tkTabContents = document.querySelectorAll('.tk-tab-content');
    function initTikTok() {
        handleAction_15(count);
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
            window.closeView(tkView);
            window.closeView(document.getElementById('tk-video-detail-sheet'));
            window.closeView(document.getElementById('tk-edit-profile-sheet'));
            window.closeView(document.getElementById('tk-edit-char-sheet'));
            window.closeView(document.getElementById('tk-import-char-sheet'));
            window.closeView(document.getElementById('tk-share-sheet'));
            document.getElementById('tk-sub-profile-view').classList.remove('active');
        },
        homeBackBtn = document.getElementById('tk-home-back-btn');
    if (homeBackBtn) homeBackBtn.addEventListener('click', closeTkApp);
    const tkNavIndicator = document.querySelector('.tk-nav-indicator'),
        mainContent = document.querySelector('.tk-main-content');
    let count = 0,
        enabled = false,
        count_13 = 0;
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
    let count_16 = 0,
        count_17 = 0,
        enabled_18 = false;
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
