const playerView = document.getElementById('yt-video-player-view'),
    playerBackBtn = document.getElementById('yt-player-back-btn'),
    ytPlayerVideoArea = document.getElementById('yt-player-video-area'),
    ytPlayerThumbnail = document.getElementById('yt-player-thumbnail'),
    ytCharSpeechBubble = document.getElementById('yt-char-speech-bubble'),
    ytCharLiveConnectionCard = document.getElementById('yt-char-live-connection-card'),
    ytPlayerConnectBtn = document.getElementById('yt-player-connect-btn'),
    ytPlayerReplayCommentsBtn = document.getElementById('yt-player-replay-comments-btn'),
    ytPlayerDeleteVideoBtn = document.getElementById('yt-player-delete-video-btn'),
    ytCharLiveLotteryModal = document.getElementById('yt-char-live-lottery-modal'),
    ytCharLiveLotteryTitle = document.getElementById('yt-char-live-lottery-title'),
    ytCharLiveLotteryPrize = document.getElementById('yt-char-live-lottery-prize'),
    ytCharLiveLotteryCountdown = document.getElementById('yt-char-live-lottery-countdown'),
    ytCharLiveLotteryStatus = document.getElementById('yt-char-live-lottery-status'),
    ytCharLiveLotteryInlineStatus = document.getElementById('yt-char-live-lottery-inline-status'),
    ytCharLiveLotteryParticipants = document.getElementById('yt-char-live-lottery-participants'),
    ytCharLiveLotteryStatusCountdown = document.getElementById(
        'yt-char-live-lottery-status-countdown',
    ),
    ytCharLiveLotteryActions = document.getElementById('yt-char-live-lottery-actions'),
    ytCharLiveLotteryJoin = document.getElementById('yt-char-live-lottery-join'),
    ytCharLiveLotterySkip = document.getElementById('yt-char-live-lottery-skip'),
    ytCharLiveLotteryClose = document.getElementById('yt-char-live-lottery-close');
let currentVideoData = null,
    chatInterval = null,
    tempVideoCover = null,
    ytReplayCommentRequestId = '',
    ytCharConnectionDelayTimer = null,
    ytCharConnectionDurationTimer = null,
    ytCharLiveLotteryTimer = null,
    pendingPlayerChatRows = [],
    playerChatBatchTarget = null,
    playerHistoryRenderToken = 0,
    playerHistoryRenderActive = false,
    pendingPlayerHistoryChunk = null;
const normalizedYtConnectionTranscripts = new WeakSet(),
    YT_CHAR_LOTTERY_TRIGGER_RATE = 0.03;
function isYtPlayerVisible() {
    return (
        !document.hidden &&
        playerView?.classList.contains('active') &&
        document.getElementById('youtube-view')?.classList.contains('active')
    );
}
function flushPendingPlayerChatRows() {
    if (!isYtPlayerVisible()) return;
    if (pendingPlayerHistoryChunk) {
        const value_2 = pendingPlayerHistoryChunk;
        pendingPlayerHistoryChunk = null;
        requestAnimationFrame(() => setTimeout(value_2, 0));
        return;
    }
    if (playerHistoryRenderActive || pendingPlayerChatRows.length === 0) return;
    const items = pendingPlayerChatRows;
    pendingPlayerChatRows = [];
    playerChatBatchTarget = document.createDocumentFragment();
    try {
        items.forEach((value_3) => addChatMessage(...value_3));
    } finally {
        const ytPlayerChatContainerElement = document.getElementById('yt-player-chat-container');
        ytPlayerChatContainerElement?.appendChild(playerChatBatchTarget);
        playerChatBatchTarget = null;
        if (ytPlayerChatContainerElement)
            ytPlayerChatContainerElement.scrollTop = ytPlayerChatContainerElement.scrollHeight;
    }
}
window.flushYtPlayerChatRows = flushPendingPlayerChatRows;
document.addEventListener('visibilitychange', () => {
    if (!isYtPlayerVisible()) return;
    flushPendingPlayerChatRows();
    renderYtCharLiveLotteryInlineStatus();
    const ytCharLiveLottery = getYtCharLiveLottery();
    if (ytCharLiveLottery?.status === 'active') renderYtCharLiveLottery(ytCharLiveLottery, false);
});
function getCurrentYtViewer() {
    if (typeof window.getYtEffectiveUserState === 'function')
        return window.getYtEffectiveUserState() || {};
    return ytUserState || {};
}
function ytPlayerEscapeHtml(value_5) {
    return String(value_5 ?? '').replace(
        /[&<>"']/g,
        (char) =>
            ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
            })[char],
    );
}
function getYtPlayerLanguageContext(channel_2 = null) {
    const targetChannel = channel_2 || currentVideoData?.channelData || currentSubChannelData;
    return typeof window.getYtChannelLanguageContext === 'function'
        ? window.getYtChannelLanguageContext(targetChannel)
        : {
              enabled: false,
              language: '',
              languageName: '',
          };
}
function getYtPlayerLocalizedContent(value_6, value_7 = null) {
    const context = getYtPlayerLanguageContext(value_7);
    if (typeof window.normalizeYtLocalizedContent === 'function')
        return window.normalizeYtLocalizedContent(value_6, context);
    if (value_6 && typeof value_6 === 'object')
        return {
            text: String(value_6.text || value_6.content || '').trim(),
            translationZh: String(value_6.translationZh || value_6.translation || '').trim(),
        };
    return {
        text: String(value_6 || '').trim(),
        translationZh: '',
    };
}
function getYtPlayerTranslation(value_8) {
    if (!value_8 || typeof value_8 !== 'object') return '';
    return String(value_8.translationZh || value_8.translation || '').trim();
}
function getYtViewsDisplay(video_2, isLive_2 = !!video_2?.isLive) {
    const source_2 = video_2 && typeof video_2 === 'object' ? video_2 : {};
    if (isLive_2 && typeof window.formatYtLiveViewerCount === 'function')
        return (
            window.formatYtLiveViewerCount(source_2.viewerCount, source_2.views) || '0 人正在观看'
        );
    if (!isLive_2 && typeof window.formatYtVideoViewCount === 'function')
        return window.formatYtVideoViewCount(source_2.viewCount, source_2.views) || '0 次观看';
    return String(source_2.views || (isLive_2 ? '0 人正在观看' : '0 次观看'));
}
function formatYtCharFanGroupMemberCount(value_13) {
    const count_2 = Math.max(1, Math.round(Number(value_13) || 1));
    if (count_2 >= 10000) return (count_2 / 10000).toFixed(count_2 % 10000 === 0 ? 0 : 1) + '万人';
    return count_2.toLocaleString('zh-CN') + '人';
}
function renderYtSecondaryTranslation(value_14, value_15 = 'yt-localized-secondary') {
    const trim_16 = String(value_14 || '').trim();
    return trim_16 ? '<div class="' + value_15 + '">' + ytPlayerEscapeHtml(trim_16) + '</div>' : '';
}
function bindYtCommentTranslationToggle(root_2) {
    if (!root_2) return;
    const button = root_2.querySelector('.yt-comment-translation-toggle'),
        translation_2 = root_2.querySelector('.yt-comment-translation');
    if (!button || !translation_2) return;
    const toggleTranslation = (event) => {
        event.stopPropagation();
        const willExpand = translation_2.hidden;
        translation_2.hidden = !willExpand;
        button.textContent = willExpand ? '收起翻译' : '翻译';
        button.setAttribute('aria-expanded', String(willExpand));
    };
    button.addEventListener('click', toggleTranslation);
    button.addEventListener('keydown', (event_2) => {
        if (event_2.key !== 'Enter' && event_2.key !== ' ') return;
        event_2.preventDefault();
        toggleTranslation(event_2);
    });
}
function normalizeYtGeneratedComment(text_11, value_20 = null) {
    const source_3 =
            text_11 && typeof text_11 === 'object'
                ? text_11
                : {
                      text: text_11,
                  },
        text_2 = String(
            source_3.text || source_3.comment || source_3.content || source_3.message || '',
        ).trim(),
        translationZh_2 = String(
            source_3.translationZh || source_3.translation || source_3.chineseTranslation || '',
        ).trim();
    return {
        ...source_3,
        name: String(source_3.name || source_3.user || source_3.nickname || '观众').trim(),
        text: text_2,
        translationZh: translationZh_2,
    };
}
function createYtLiveReplayId(value_24 = '') {
    const slice_25 = Math.random().toString(36).slice(2, 9);
    return 'yt-live-replay-' + String(value_24 || 'channel') + '-' + Date.now() + '-' + slice_25;
}
function createYtCharLiveId(value_26 = '') {
    const slice_27 = Math.random().toString(36).slice(2, 9);
    return 'yt-char-live-' + String(value_26 || 'channel') + '-' + Date.now() + '-' + slice_27;
}
function ensureYtCharLiveId(live_2, channelId = '') {
    if (live_2 && !live_2.id) live_2.id = createYtCharLiveId(channelId);
    return live_2?.id || '';
}
function isYtLiveReplay(video) {
    if (!video || video.isLive) return false;
    return video.isLiveReplay === true || String(video.time || '').trim() === '刚刚直播结束';
}
function getYtReplayRealtimeCommentCount(video_3) {
    if (!isYtLiveReplay(video_3)) return 0;
    const commentsLength = Array.isArray(video_3.comments) ? video_3.comments.length : 0,
        storedCount = Math.round(Number(video_3.realtimeCommentCount));
    if (!Number.isFinite(storedCount) || storedCount < 0) return commentsLength;
    return Math.min(storedCount, commentsLength);
}
function createYtReplayTranscriptFromBubbles(bubbles) {
    if (!Array.isArray(bubbles)) return [];
    const now_2 = Date.now();
    return bubbles
        .map((bubble, index) => {
            const localized = getYtPlayerLocalizedContent(bubble);
            return {
                type: 'bubble',
                text: localized.text,
                ...(localized.translationZh
                    ? {
                          translationZh: localized.translationZh,
                      }
                    : {}),
                timestamp: now_2 + index,
            };
        })
        .filter((item) => item.text);
}
function normalizeYtReplayTranscriptItem(text_12, index_2 = 0) {
    const source_4 =
            text_12 && typeof text_12 === 'object'
                ? text_12
                : {
                      text: text_12,
                  },
        localized_2 = getYtPlayerLocalizedContent(source_4);
    return {
        type: source_4.type === 'narrative' ? 'narrative' : source_4.type || 'bubble',
        ...(source_4.name
            ? {
                  name: String(source_4.name),
              }
            : {}),
        ...(source_4.senderType
            ? {
                  senderType: String(source_4.senderType),
              }
            : {}),
        text: localized_2.text,
        ...(localized_2.translationZh
            ? {
                  translationZh: localized_2.translationZh,
              }
            : {}),
        timestamp: Number(source_4.timestamp) || Date.now() + index_2,
    };
}
function archiveYtCurrentCharLive(channel_3) {
    const generatedContent_2 = channel_3?.generatedContent,
        currentLive_2 = generatedContent_2?.currentLive;
    if (!currentLive_2) return null;
    const sourceLiveId_2 = ensureYtCharLiveId(currentLive_2, channel_3.id),
        comments_2 = Array.isArray(currentLive_2.comments)
            ? currentLive_2.comments
                  .map((value_41) => normalizeYtGeneratedComment(value_41, channel_3))
                  .filter((value_42) => value_42.text)
            : [],
        liveTranscript_2 = Array.isArray(currentLive_2.liveTranscript)
            ? currentLive_2.liveTranscript
                  .map((item_2, index_3) => normalizeYtReplayTranscriptItem(item_2, index_3))
                  .filter((item_3) => item_3.text)
            : createYtReplayTranscriptFromBubbles(currentLive_2.initialBubbles),
        replay = {
            id: createYtLiveReplayId(channel_3.id),
            sourceLiveId: sourceLiveId_2,
            isLiveReplay: true,
            title: currentLive_2.title,
            titleTranslationZh: currentLive_2.titleTranslationZh || '',
            viewCount: Number.isFinite(Number(currentLive_2.viewerCount))
                ? Number(currentLive_2.viewerCount)
                : undefined,
            views: currentLive_2.views,
            time: '刚刚直播结束',
            thumbnail: currentLive_2.thumbnail,
            comments: comments_2,
            realtimeCommentCount: comments_2.length,
            liveTranscript: liveTranscript_2,
            guest: currentLive_2.guest || null,
            connectionHistory: Array.isArray(currentLive_2.connectionHistory)
                ? currentLive_2.connectionHistory.map((item_4) => ({
                      ...item_4,
                      participant: {
                          ...(item_4?.participant || {}),
                      },
                      transcript: Array.isArray(item_4?.transcript)
                          ? item_4.transcript.map((entry) => ({
                                ...entry,
                            }))
                          : [],
                  }))
                : [],
            charLottery: currentLive_2.charLottery
                ? {
                      ...currentLive_2.charLottery,
                      participants: Array.isArray(currentLive_2.charLottery.participants)
                          ? currentLive_2.charLottery.participants.map((item_5) => ({
                                ...item_5,
                            }))
                          : [],
                      winner: currentLive_2.charLottery.winner
                          ? {
                                ...currentLive_2.charLottery.winner,
                            }
                          : null,
                  }
                : null,
            charLotteryHistory: Array.isArray(currentLive_2.charLotteryHistory)
                ? currentLive_2.charLotteryHistory.map((lottery) => ({
                      ...lottery,
                      participants: Array.isArray(lottery?.participants)
                          ? lottery.participants.map((item_6) => ({
                                ...item_6,
                            }))
                          : [],
                      winner: lottery?.winner
                          ? {
                                ...lottery.winner,
                            }
                          : null,
                  }))
                : [],
        };
    if (!Array.isArray(generatedContent_2.pastVideos)) generatedContent_2.pastVideos = [];
    return (generatedContent_2.pastVideos.unshift(replay), replay);
}
function normalizeYtGeneratedBubble(value_16, channel_4 = null) {
    const localized_3 = getYtPlayerLocalizedContent(value_16, channel_4);
    return localized_3.translationZh ? localized_3 : localized_3.text;
}
function getYtLiveFallbackBubbles(value_52) {
    const context_2 = getYtPlayerLanguageContext(value_52),
        localizedFallbacks = {
            en: [
                {
                    text: 'Welcome to the stream!',
                    translationZh: '欢迎来到直播间！',
                },
                {
                    text: 'Good evening, everyone!',
                    translationZh: '大家晚上好！',
                },
            ],
            ja: [
                {
                    text: '配信へようこそ！',
                    translationZh: '欢迎来到直播间！',
                },
                {
                    text: 'みなさん、こんばんは！',
                    translationZh: '大家晚上好！',
                },
            ],
            ko: [
                {
                    text: '방송에 오신 걸 환영해요!',
                    translationZh: '欢迎来到直播间！',
                },
                {
                    text: '여러분, 좋은 저녁이에요!',
                    translationZh: '大家晚上好！',
                },
            ],
            fr: [
                {
                    text: 'Bienvenue sur le live !',
                    translationZh: '欢迎来到直播间！',
                },
                {
                    text: 'Bonsoir à tous !',
                    translationZh: '大家晚上好！',
                },
            ],
        };
    if (context_2.enabled && context_2.language !== 'zh')
        return localizedFallbacks[context_2.language] || [];
    return ['欢迎来到直播间！', '大家晚上好！'];
}
const ytEditVideoSheet = document.getElementById('yt-edit-video-sheet'),
    ytEditVideoCoverBtn = document.getElementById('yt-edit-video-cover-btn'),
    ytEditVideoUpload = document.getElementById('yt-edit-video-upload'),
    ytEditVideoCoverImg = document.getElementById('yt-edit-video-cover-img'),
    ytEditVideoTitleInput = document.getElementById('yt-edit-video-title-input'),
    confirmYtVideoBtn = document.getElementById('confirm-yt-video-btn'),
    resetYtVideoBtn = document.getElementById('reset-yt-video-btn'),
    ytGuestPickerSheet = document.getElementById('yt-guest-picker-sheet'),
    ytGuestList = document.getElementById('yt-guest-list'),
    closeYtGuestPickerBtn = document.getElementById('close-yt-guest-picker-btn'),
    ytUserLiveGuestSelector = document.getElementById('yt-user-live-guest-selector'),
    ytUserLiveGuestName = document.getElementById('yt-user-live-guest-name');
let userLiveSelectedGuests = [];
function getFollowedTkLiveGuests() {
    const chars_2 = Array.isArray(window.tkState?.chars) ? window.tkState.chars : [];
    return chars_2
        .filter((char_2) => char_2 && char_2.isFollowed === true)
        .map((char_3) => ({
            id: char_3.id,
            name: char_3.name || char_3.handle || '未命名 Char',
            avatar: window.tkResolveAvatar
                ? window.tkResolveAvatar(char_3.id, char_3.name || char_3.handle, char_3.avatar)
                : char_3.avatar || '',
            desc: char_3.persona || char_3.bio || '',
            persona: char_3.persona || '',
            status: char_3.status || '',
            guestSource: 'tiktok-following',
        }));
}
function getUnifiedYtLiveGuestOptions() {
    const seen = new Set();
    return (Array.isArray(mockSubscriptions) ? mockSubscriptions : [])
        .filter((sub) => {
            if (!sub) return false;
            const linkedChar =
                typeof resolveYtExplicitImChar === 'function' ? resolveYtExplicitImChar(sub) : null;
            return !!linkedChar || sub.isSubscribed !== false;
        })
        .map((sub_2) => {
            const linkedChar_2 =
                    typeof resolveYtExplicitImChar === 'function'
                        ? resolveYtExplicitImChar(sub_2)
                        : null,
                normalized_2 = {
                    ...sub_2,
                    avatar:
                        typeof resolveYtChannelAvatar === 'function'
                            ? resolveYtChannelAvatar(sub_2)
                            : sub_2.avatar || sub_2.avatarUrl || '',
                    desc: sub_2.desc || sub_2.persona || '',
                    persona: sub_2.persona || sub_2.desc || '',
                    guestSource: linkedChar_2 ? 'imessage-char' : 'youtube-subscription',
                };
            return normalized_2;
        })
        .filter((value_61) => {
            const key_2 = value_61.imCharId ? 'char:' + value_61.imCharId : 'sub:' + value_61.id;
            if (seen.has(key_2)) return false;
            return (seen.add(key_2), true);
        });
}
function getYtSubscribedConnectionOptions() {
    const effectiveUser =
            typeof getCurrentYtViewer === 'function' ? getCurrentYtViewer() : ytUserState || {},
        currentUserName = String(effectiveUser?.name || '').trim();
    return getUnifiedYtLiveGuestOptions().filter(
        (option) =>
            option &&
            option.isSubscribed !== false &&
            option.isBusiness !== true &&
            String(option.id || '') !== 'user_channel_id' &&
            (!currentUserName || String(option.name || '').trim() !== currentUserName),
    );
}
function validateYtLiveGuestOption(guest_2) {
    if (!guest_2) return null;
    return (
        getYtSubscribedConnectionOptions().find((option_2) => {
            if (String(option_2.id) === String(guest_2.id)) return true;
            return (
                option_2.imCharId &&
                guest_2.imCharId &&
                String(option_2.imCharId) === String(guest_2.imCharId)
            );
        }) || null
    );
}
window.validateYtLiveGuestOption = validateYtLiveGuestOption;
function updateUserLiveGuestLabel() {
    if (!ytUserLiveGuestName) return;
    ytUserLiveGuestName.value = userLiveSelectedGuests.length
        ? userLiveSelectedGuests.map((item_7) => item_7.name).join('、')
        : '无';
}
function validateUserLiveSelectedGuests() {
    const seen_2 = new Set();
    return (
        (userLiveSelectedGuests = (
            Array.isArray(userLiveSelectedGuests) ? userLiveSelectedGuests : []
        )
            .map(validateYtLiveGuestOption)
            .filter((guest_3) => {
                const key_3 = String(guest_3?.imCharId || guest_3?.id || '');
                if (!key_3 || seen_2.has(key_3)) return false;
                return (seen_2.add(key_3), true);
            })
            .slice(0, 3)),
        updateUserLiveGuestLabel(),
        userLiveSelectedGuests
    );
}
window.validateUserLiveSelectedGuests = validateUserLiveSelectedGuests;
window.validateUserLiveSelectedGuest = () => validateUserLiveSelectedGuests()[0] || null;
window.getUserLiveSelectedGuests = () => [...validateUserLiveSelectedGuests()];
window.setUserLiveSelectedGuests = (guests) => {
    return (
        (userLiveSelectedGuests = Array.isArray(guests) ? [...guests] : []),
        validateUserLiveSelectedGuests()
    );
};
function renderGuestPicker(onSelect, source_5 = 'unified-live-guests', options_2 = {}) {
    if (!ytGuestList) return;
    ytGuestList.innerHTML = '';
    const excludedIds = new Set((options_2.excludeIds || []).map(String)),
        isMulti = options_2.multiSelect === true,
        selectedIds_2 = new Set((options_2.selectedIds || []).map(String)),
        selectedById = new Map();
    if (options_2.includeNone !== false && !isMulti) {
        const noneItem = document.createElement('div');
        noneItem.className = 'account-card';
        noneItem.innerHTML =
            '<div class="account-content"><div class="account-name">无联动嘉宾</div></div>';
        noneItem.addEventListener('click', () => {
            onSelect(null);
            if (ytGuestPickerSheet) ytGuestPickerSheet.classList.remove('active');
        });
        ytGuestList.appendChild(noneItem);
    }
    const guestOptions =
        source_5 === 'tiktok-following'
            ? getFollowedTkLiveGuests()
            : source_5 === 'youtube-subscriptions'
              ? mockSubscriptions
              : source_5 === 'youtube-connection-friends'
                ? getYtSubscribedConnectionOptions()
                : getUnifiedYtLiveGuestOptions();
    if (guestOptions.length === 0) {
        const emptyItem = document.createElement('div');
        emptyItem.style.cssText =
            'padding:28px 16px;text-align:center;color:#8e8e93;font-size:13px;';
        emptyItem.textContent = '暂无可连线的订阅好友';
        ytGuestList.appendChild(emptyItem);
    }
    guestOptions.forEach((sub_3) => {
        if (
            options_2.excludeCurrent !== false &&
            currentSubChannelData &&
            sub_3.id === currentSubChannelData.id
        )
            return;
        if (ytUserState && sub_3.name === ytUserState.name) return;
        const participantKey = String(sub_3.imCharId || sub_3.id || '');
        if (
            excludedIds.has(String(sub_3.id)) ||
            (sub_3.imCharId && excludedIds.has(String(sub_3.imCharId)))
        )
            return;
        if (selectedIds_2.has(participantKey) || selectedIds_2.has(String(sub_3.id)))
            selectedById.set(participantKey, sub_3);
        const value_80 =
                source_5 === 'tiktok-following'
                    ? sub_3.avatar ||
                      'https://picsum.photos/seed/' +
                          encodeURIComponent(sub_3.id || sub_3.name) +
                          '/80/80'
                    : typeof resolveYtChannelAvatar === 'function'
                      ? resolveYtChannelAvatar(sub_3)
                      : sub_3.avatar || 'https://picsum.photos/80/80?grayscale',
            value_81 =
                source_5 === 'tiktok-following'
                    ? sub_3.status || sub_3.persona || '已关注 Char'
                    : sub_3.guestSource === 'imessage-char'
                      ? 'Char'
                      : (sub_3.subs || '0') + ' 订阅者',
            item_8 = document.createElement('div');
        item_8.className =
            'account-card' + (selectedById.has(participantKey) ? ' is-selected' : '');
        item_8.innerHTML =
            `
                <div class="account-content">
                        <div class="account-avatar"><img src="` +
            value_80 +
            `" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"></div>
                        <div class="account-info">
                            <div class="account-name">` +
            sub_3.name +
            `</div>
                            <div class="account-detail">` +
            value_81 +
            `</div>
                        </div>
                        ` +
            (isMulti
                ? '<i class="fas fa-check-circle yt-guest-selected-mark" aria-hidden="true"></i>'
                : '') +
            `
                    </div>
            `;
        item_8.addEventListener('click', () => {
            if (isMulti) {
                if (selectedById.has(participantKey)) {
                    selectedById['delete'](participantKey);
                    item_8.classList.remove('is-selected');
                } else {
                    if (selectedById.size < 3) {
                        selectedById.set(participantKey, sub_3);
                        item_8.classList.add('is-selected');
                    } else window.showToast && window.showToast('最多选择 3 位连线嘉宾');
                }
                return;
            }
            onSelect(sub_3);
            if (ytGuestPickerSheet) ytGuestPickerSheet.classList.remove('active');
        });
        ytGuestList.appendChild(item_8);
    });
    if (isMulti) {
        const confirm = document.createElement('button');
        confirm.type = 'button';
        confirm.className = 'yt-guest-multi-confirm';
        confirm.textContent = '确认选择';
        confirm.addEventListener('click', () => {
            onSelect([...selectedById.values()].slice(0, 3));
            ytGuestPickerSheet?.classList.remove('active');
        });
        ytGuestList.appendChild(confirm);
    }
}
closeYtGuestPickerBtn &&
    ytGuestPickerSheet &&
    (closeYtGuestPickerBtn.addEventListener('click', () =>
        ytGuestPickerSheet.classList.remove('active'),
    ),
    ytGuestPickerSheet.addEventListener('mousedown', (event_84) => {
        if (event_84.target === ytGuestPickerSheet) ytGuestPickerSheet.classList.remove('active');
    }));
ytUserLiveGuestSelector &&
    ytGuestPickerSheet &&
    ytUserLiveGuestSelector.addEventListener('click', () => {
        renderGuestPicker(
            (selectedGuests) => {
                userLiveSelectedGuests = selectedGuests;
                validateUserLiveSelectedGuests();
            },
            'youtube-connection-friends',
            {
                excludeCurrent: false,
                includeNone: false,
                multiSelect: true,
                selectedIds: userLiveSelectedGuests.map((item_9) => item_9.imCharId || item_9.id),
            },
        );
        ytGuestPickerSheet.classList.add('active');
    });
window.openYtLiveConnectionPicker = function (onSelect_2, options_3 = {}) {
    if (!ytGuestPickerSheet || typeof onSelect_2 !== 'function') return false;
    renderGuestPicker(onSelect_2, 'youtube-connection-friends', {
        includeNone: options_3.includeNone !== false,
        excludeCurrent: true,
        excludeIds: options_3.excludeIds || [],
    });
    const title_2 = ytGuestPickerSheet.querySelector('.sheet-title');
    if (title_2) title_2.textContent = options_3.title || '选择连线好友';
    return (ytGuestPickerSheet.classList.add('active'), true);
};
ytPlayerVideoArea &&
    ytEditVideoSheet &&
    (ytPlayerVideoArea.addEventListener('click', (event_88) => {
        (event_88.target === ytPlayerVideoArea || event_88.target === ytPlayerThumbnail) &&
            currentVideoData &&
            ((ytEditVideoTitleInput.value = currentVideoData.title || ''),
            currentVideoData.thumbnail
                ? ((ytEditVideoCoverImg.src = currentVideoData.thumbnail),
                  (ytEditVideoCoverImg.style.display = 'block'))
                : (ytEditVideoCoverImg.style.display = 'none'),
            ytEditVideoSheet.classList.add('active'));
    }),
    ytEditVideoSheet &&
        ytEditVideoSheet.addEventListener('mousedown', (event_89) => {
            if (event_89.target === ytEditVideoSheet) ytEditVideoSheet.classList.remove('active');
        }),
    ytEditVideoCoverBtn &&
        ytEditVideoUpload &&
        (ytEditVideoCoverBtn.addEventListener('click', () => ytEditVideoUpload.click()),
        ytEditVideoUpload.addEventListener('change', (event_90) => {
            const value_91 = event_90.target.files[0];
            if (value_91) {
                const value_92 = new FileReader();
                value_92.onload = (event_3) => {
                    window.compressImage
                        ? window.compressImage(event_3.target.result, 640, 360, (compressedUrl) => {
                              ytEditVideoCoverImg.src = compressedUrl;
                              ytEditVideoCoverImg.style.display = 'block';
                          })
                        : ((ytEditVideoCoverImg.src = event_3.target.result),
                          (ytEditVideoCoverImg.style.display = 'block'));
                };
                value_92.readAsDataURL(value_91);
            }
            event_90.target.value = '';
        })),
    resetYtVideoBtn &&
        resetYtVideoBtn.addEventListener('click', () => {
            ytEditVideoCoverImg.src = '';
            ytEditVideoCoverImg.style.display = 'none';
            ytEditVideoTitleInput.value = currentVideoData._originalTitle || '无标题';
        }),
    confirmYtVideoBtn &&
        confirmYtVideoBtn.addEventListener('click', () => {
            if (!currentVideoData) return;
            const title_3 = ytEditVideoTitleInput.value.trim() || '无标题',
                thumbnail_2 =
                    ytEditVideoCoverImg.style.display === 'block' && ytEditVideoCoverImg.src
                        ? ytEditVideoCoverImg.src
                        : 'https://picsum.photos/320/180?grayscale',
                titleChanged = title_3 !== currentVideoData.title;
            currentVideoData.title = title_3;
            if (titleChanged) currentVideoData.titleTranslationZh = '';
            currentVideoData.thumbnail = thumbnail_2;
            const ytPlayerTitleElement = document.getElementById('yt-player-title');
            if (ytPlayerTitleElement) ytPlayerTitleElement.textContent = title_3;
            const ytPlayerLiveTitleOverlayElement = document.getElementById(
                'yt-player-live-title-overlay',
            );
            if (ytPlayerLiveTitleOverlayElement)
                ytPlayerLiveTitleOverlayElement.textContent = title_3;
            if (ytPlayerThumbnail) ytPlayerThumbnail.src = thumbnail_2;
            const channel_6 = currentVideoData.channelData;
            if (channel_6 && channel_6.generatedContent) {
                if (currentVideoData.isLive && channel_6.generatedContent.currentLive) {
                    channel_6.generatedContent.currentLive.title = title_3;
                    if (titleChanged)
                        channel_6.generatedContent.currentLive.titleTranslationZh = '';
                    channel_6.generatedContent.currentLive.thumbnail = thumbnail_2;
                } else {
                    if (!currentVideoData.isLive && channel_6.generatedContent.pastVideos) {
                        const originalTitle = currentVideoData._originalTitle,
                            match_2 = channel_6.generatedContent.pastVideos.find(
                                (v_2) => v_2.title === originalTitle,
                            );
                        if (match_2) {
                            match_2.title = title_3;
                            if (titleChanged) match_2.titleTranslationZh = '';
                            match_2.thumbnail = thumbnail_2;
                        }
                    }
                }
            }
            if (channel_6 && channel_6.id === 'user_channel_id' && channelState.pastVideos) {
                const originalTitle_2 = currentVideoData._originalTitle,
                    match_3 = channelState.pastVideos.find((v_3) => v_3.title === originalTitle_2);
                match_3 && ((match_3.title = title_3), (match_3.thumbnail = thumbnail_2));
            }
            const mv = mockVideos.find((v_4) => v_4.title === currentVideoData._originalTitle);
            mv && ((mv.title = title_3), (mv.thumbnail = thumbnail_2));
            currentVideoData._originalTitle = title_3;
            saveYoutubeData();
            renderVideos();
            const activeTab = document.querySelector('#sub-channel-tabs .yt-sliding-tab.active');
            if (activeTab) {
                const target_2 = activeTab.getAttribute('data-target');
                if (target_2 === 'live' || target_2 === 'past') renderGeneratedContent(target_2);
            } else {
                if (channel_6 && channel_6.id === 'user_channel_id') {
                    const userPastTab = document.querySelector(
                        '#profile-main-tabs .yt-sliding-tab.active',
                    );
                    if (userPastTab) userPastTab.click();
                }
            }
            ytEditVideoSheet.classList.remove('active');
            if (window.showToast) window.showToast('视频信息已更新');
        }));
playerBackBtn &&
    playerView &&
    playerBackBtn.addEventListener('click', () => {
        if (chatInput && document.activeElement === chatInput) chatInput.blur();
        if (ytScCustomInput && document.activeElement === ytScCustomInput) ytScCustomInput.blur();
        if (ytScInput && document.activeElement === ytScInput) ytScInput.blur();
        if (typeof window.releaseYtChatKeyboardLock === 'function')
            window.releaseYtChatKeyboardLock();
        playerView.classList.remove('active');
        playerHistoryRenderToken++;
        playerHistoryRenderActive = false;
        pendingPlayerHistoryChunk = null;
        pendingPlayerChatRows = [];
        playerView.classList.remove('yt-char-live-mode');
        setYtReplayCommentsButtonState(false);
        setYtPlayerDeleteVideoButtonState(false);
        window.resetYtViewportOffset?.();
        if (chatInterval) clearInterval(chatInterval);
        window.ytLiveTimeouts &&
            (window.ytLiveTimeouts.forEach(clearTimeout), (window.ytLiveTimeouts = []));
        ytCharSpeechBubble &&
            ((ytCharSpeechBubble.innerHTML = ''), (ytCharSpeechBubble.style.display = 'none'));
        stopYtCharConnectionVisualTimers();
        if (ytCharLiveConnectionCard) ytCharLiveConnectionCard.style.display = 'none';
        stopYtCharLiveLotteryTimer();
        ytCharLiveLotteryModal?.classList.remove('active');
        if (ytCharLiveLotteryInlineStatus) ytCharLiveLotteryInlineStatus.style.display = 'none';
    });
function clearCharLiveBubbles() {
    if (!ytCharSpeechBubble) return;
    ytCharSpeechBubble.innerHTML = '';
    ytCharSpeechBubble.style.display = 'none';
}
function formatYtLiveConnectionDuration(startedAt_2) {
    const totalSeconds = Math.max(
            0,
            Math.floor((Date.now() - Number(startedAt_2 || Date.now())) / 1000),
        ),
        hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0'),
        minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0'),
        seconds = String(totalSeconds % 60).padStart(2, '0');
    return hours + ':' + minutes + ':' + seconds;
}
function resolveCanonicalYtCharLive() {
    const channelId_2 = currentVideoData?.channelData?.id;
    if (!channelId_2 || channelId_2 === 'user_channel_id') return null;
    const channelData_2 = (Array.isArray(mockSubscriptions) ? mockSubscriptions : []).find(
            (value_115) => String(value_115?.id) === String(channelId_2),
        ),
        currentLive_3 = channelData_2?.generatedContent?.currentLive;
    if (!channelData_2 || !currentLive_3) return null;
    const requestedLiveId = currentVideoData?.id || currentVideoData?.liveId;
    if (requestedLiveId && currentLive_3.id && String(requestedLiveId) !== String(currentLive_3.id))
        return null;
    currentVideoData.channelData = channelData_2;
    currentVideoData.id = currentLive_3.id || requestedLiveId || '';
    currentVideoData.liveId = currentVideoData.id;
    currentVideoData.comments = Array.isArray(currentLive_3.comments) ? currentLive_3.comments : [];
    currentVideoData.initialBubbles = Array.isArray(currentLive_3.initialBubbles)
        ? currentLive_3.initialBubbles
        : [];
    currentVideoData.liveTranscript = Array.isArray(currentLive_3.liveTranscript)
        ? currentLive_3.liveTranscript
        : [];
    if (currentLive_3.connection && typeof currentLive_3.connection === 'object') {
        currentLive_3.connection.id =
            currentLive_3.connection.id ||
            'connection_' + (currentLive_3.connection.requestedAt || Date.now());
        if (!Array.isArray(currentLive_3.connection.transcript))
            currentLive_3.connection.transcript = [];
        !normalizedYtConnectionTranscripts.has(currentLive_3.connection.transcript) &&
            ((currentLive_3.connection.transcript = currentLive_3.connection.transcript.map(
                normalizeYtConnectionTranscriptItem,
            )),
            normalizedYtConnectionTranscripts.add(currentLive_3.connection.transcript));
    }
    return (
        (currentVideoData.connection = currentLive_3.connection || null),
        (currentVideoData.connectionHistory = Array.isArray(currentLive_3.connectionHistory)
            ? currentLive_3.connectionHistory
            : []),
        (currentVideoData.charLottery = currentLive_3.charLottery || null),
        {
            channel: channelData_2,
            live: currentLive_3,
        }
    );
}
function getActiveYtCharConnection() {
    return resolveCanonicalYtCharLive()?.live?.connection || null;
}
function setYtCharConnectionButtonState(connection_2 = getActiveYtCharConnection()) {
    if (!ytPlayerConnectBtn) return;
    const isCharLive = !!(
            currentVideoData?.isLive && currentVideoData?.channelData?.id !== 'user_channel_id'
        ),
        isConnecting = connection_2?.status === 'connecting',
        isActive = connection_2?.status === 'active';
    ytPlayerConnectBtn.style.display = isCharLive ? 'flex' : 'none';
    ytPlayerConnectBtn.disabled = !isCharLive || isConnecting || isActive;
    ytPlayerConnectBtn.classList.toggle('is-connecting', isConnecting);
    ytPlayerConnectBtn.innerHTML = isConnecting
        ? '<i class="fas fa-circle-notch fa-spin"></i>'
        : '<i class="fas fa-phone-volume"></i>';
    ytPlayerConnectBtn.title = isConnecting ? '正在等待接通' : isActive ? '正在连线' : '请求连线';
    ytPlayerConnectBtn.setAttribute('aria-label', ytPlayerConnectBtn.title);
}
function stopYtCharConnectionVisualTimers() {
    if (ytCharConnectionDelayTimer) clearTimeout(ytCharConnectionDelayTimer);
    if (ytCharConnectionDurationTimer) clearInterval(ytCharConnectionDurationTimer);
    ytCharConnectionDelayTimer = null;
    ytCharConnectionDurationTimer = null;
}
function addYtCharConnectionBubble(value_120) {
    const ytPlayerLocalizedContent_121 = getYtPlayerLocalizedContent(
            value_120,
            currentVideoData?.channelData,
        ),
        participant_2 = getActiveYtCharConnection()?.participant || getCurrentYtViewer(),
        participantName = participant_2?.name || 'User';
    if (!ytPlayerLocalizedContent_121.text) return;
    addCharLiveBubble(
        {
            text: participantName + '：' + ytPlayerLocalizedContent_121.text,
            translationZh: ytPlayerLocalizedContent_121.translationZh
                ? participantName + '：' + ytPlayerLocalizedContent_121.translationZh
                : '',
        },
        {
            skipPersist: true,
        },
    );
}
function addYtCharConnectionNarrative(value_124) {
    const localized_4 = getYtPlayerLocalizedContent(value_124, currentVideoData?.channelData),
        container_2 = ytCharLiveConnectionCard?.querySelector('.yt-live-connection-narratives');
    if (!container_2 || !localized_4.text) return;
    const narrative_2 = document.createElement('div');
    narrative_2.className = 'yt-live-connection-narrative';
    narrative_2.textContent = localized_4.translationZh
        ? localized_4.text + '（' + localized_4.translationZh + '）'
        : localized_4.text;
    container_2.appendChild(narrative_2);
    while (container_2.children.length > 2) container_2.firstElementChild?.remove();
    setTimeout(() => narrative_2.remove(), 10000);
}
function normalizeYtConnectionTranscriptItem(item_10 = {}) {
    return {
        speakerType: item_10.speakerType || 'user',
        speakerId: item_10.speakerId || null,
        name: item_10.name || '',
        text: String(item_10.text || '').trim(),
        ...(item_10.translationZh
            ? {
                  translationZh: String(item_10.translationZh),
              }
            : {}),
        kind: item_10.kind === 'narrative' ? 'narrative' : 'speech',
        timestamp: Number(item_10.timestamp) || Date.now(),
    };
}
function recordYtCharConnectionUserContent(text_3) {
    const resolved = resolveCanonicalYtCharLive();
    if (!resolved || !text_3) return;
    const participant_3 = resolved.live.connection?.participant || getCurrentYtViewer(),
        transcriptItem = normalizeYtConnectionTranscriptItem({
            speakerType: 'user',
            speakerId: participant_3?.id || 'user_channel_id',
            name: participant_3?.name || '我',
            text: String(text_3),
            kind: 'speech',
        });
    if (resolved.live.connection) {
        if (!Array.isArray(resolved.live.connection.transcript))
            resolved.live.connection.transcript = [];
        resolved.live.connection.transcript.push({
            ...transcriptItem,
        });
    }
    if (!Array.isArray(resolved.channel.liveHistory)) resolved.channel.liveHistory = [];
    resolved.channel.liveHistory.push({
        type: 'connection-user',
        senderType: 'user',
        ...transcriptItem,
    });
    if (!Array.isArray(resolved.live.liveTranscript)) resolved.live.liveTranscript = [];
    resolved.live.liveTranscript.push({
        type: 'connection-user',
        senderType: 'user',
        ...transcriptItem,
    });
    currentVideoData.liveTranscript = resolved.live.liveTranscript;
    saveYoutubeData();
}
function renderYtCharConnection() {
    if (!ytCharLiveConnectionCard) return;
    stopYtCharConnectionVisualTimers();
    const connection_3 = getActiveYtCharConnection();
    setYtCharConnectionButtonState(connection_3);
    if (!connection_3 || connection_3.status !== 'active' || !currentVideoData?.isLive) {
        ytCharLiveConnectionCard.style.display = 'none';
        ytCharLiveConnectionCard.querySelector('.yt-live-connection-narratives')?.replaceChildren();
        return;
    }
    const participant_4 = connection_3.participant || {},
        avatar_2 = ytCharLiveConnectionCard.querySelector('.yt-live-connection-avatar'),
        name_2 = ytCharLiveConnectionCard.querySelector('.yt-live-connection-name'),
        duration_2 = ytCharLiveConnectionCard.querySelector('.yt-live-connection-duration');
    if (avatar_2)
        avatar_2.src =
            participant_4.avatar ||
            participant_4.avatarUrl ||
            'https://picsum.photos/80/80?grayscale';
    if (name_2) name_2.textContent = participant_4.name || 'User';
    if (duration_2) duration_2.textContent = formatYtLiveConnectionDuration(connection_3.startedAt);
    const updateDuration = () => {
        if (!isYtPlayerVisible()) return;
        if (duration_2)
            duration_2.textContent = formatYtLiveConnectionDuration(connection_3.startedAt);
    };
    updateDuration();
    ytCharConnectionDurationTimer = setInterval(updateDuration, 1000);
    ytCharLiveConnectionCard.style.display = 'flex';
}
async function triggerYtCharConnectionKickoff() {
    const resolved_2 = resolveCanonicalYtCharLive(),
        connection_4 = resolved_2?.live?.connection;
    if (!resolved_2 || connection_4?.status !== 'active' || connection_4.kickoffCompleted === true)
        return;
    connection_4.kickoffAttemptedAt = Date.now();
    saveYoutubeData();
    const responseObj_2 = await getCharResponse('', false, 0, false, {
        connectionKickoff: true,
    });
    if (responseObj_2?._error) {
        removeCharLiveLoadingBubbles();
        window.showToast &&
            window.showToast(
                responseObj_2._error === 'API_NOT_CONFIGURED'
                    ? '请先配置 API，之后可点击 API 按钮重试连线互动'
                    : '连线互动生成失败，可点击 API 按钮重试',
            );
        return;
    }
    const latest = resolveCanonicalYtCharLive()?.live?.connection;
    if (!latest || latest.status !== 'active') return;
    latest.kickoffCompleted = true;
    saveYoutubeData();
    resolveCanonicalYtCharLive();
    renderAiResponse(responseObj_2);
}
function activateYtCharConnection() {
    const resolved_3 = resolveCanonicalYtCharLive(),
        connection_5 = resolved_3?.live?.connection;
    if (!resolved_3 || connection_5?.status !== 'connecting') return;
    connection_5.status = 'active';
    connection_5.startedAt = (Number(connection_5.requestedAt) || Date.now()) + 3000;
    resolved_3.live.guest = {
        ...connection_5.participant,
    };
    currentVideoData.guest = resolved_3.live.guest;
    saveYoutubeData();
    renderYtCharConnection();
    triggerYtCharConnectionKickoff();
}
function scheduleYtCharConnectionRestore() {
    const connection_6 = getActiveYtCharConnection();
    stopYtCharConnectionVisualTimers();
    if (connection_6?.status === 'connecting') {
        setYtCharConnectionButtonState(connection_6);
        const remaining = Math.max(0, Number(connection_6.requestedAt) + 3000 - Date.now());
        ytCharConnectionDelayTimer = setTimeout(activateYtCharConnection, remaining);
        return;
    }
    renderYtCharConnection();
}
function stopYtCharLiveLotteryTimer() {
    if (ytCharLiveLotteryTimer) clearInterval(ytCharLiveLotteryTimer);
    ytCharLiveLotteryTimer = null;
}
function getYtCharLiveLottery() {
    return resolveCanonicalYtCharLive()?.live?.charLottery || null;
}
function formatYtCharLotteryCountdown(milliseconds) {
    const seconds_2 = Math.max(0, Math.ceil(Number(milliseconds || 0) / 1000));
    return (
        String(Math.floor(seconds_2 / 60)).padStart(2, '0') +
        ':' +
        String(seconds_2 % 60).padStart(2, '0')
    );
}
function positionYtCharLiveLotteryStatus() {
    if (!ytCharLiveLotteryInlineStatus || !playerView || !isYtPlayerVisible()) return;
    const chatShell = playerView.querySelector('.yt-player-chat-shell');
    if (!chatShell) return;
    const viewRect = playerView.getBoundingClientRect(),
        chatRect = chatShell.getBoundingClientRect(),
        chatHeightFromBottom = Math.max(0, viewRect.bottom - chatRect.top);
    ytCharLiveLotteryInlineStatus.style.bottom = Math.round(chatHeightFromBottom + 8) + 'px';
}
function renderYtCharLiveLotteryInlineStatus(lottery_2 = getYtCharLiveLottery()) {
    if (!ytCharLiveLotteryInlineStatus) return;
    if (!lottery_2 || lottery_2.status !== 'active' || lottery_2.joined !== true) {
        ytCharLiveLotteryInlineStatus.style.display = 'none';
        return;
    }
    ytCharLiveLotteryInlineStatus.style.display = 'flex';
    positionYtCharLiveLotteryStatus();
    ytCharLiveLotteryParticipants &&
        (ytCharLiveLotteryParticipants.textContent = String(
            Array.isArray(lottery_2.participants) ? lottery_2.participants.length : 0,
        ));
    ytCharLiveLotteryStatusCountdown &&
        (ytCharLiveLotteryStatusCountdown.textContent = formatYtCharLotteryCountdown(
            Number(lottery_2.endAt) - Date.now(),
        ));
}
function parseYtCharLotteryCashAmount(value_144) {
    const text_4 = String(value_144 || '').trim(),
        match_4 =
            text_4.match(/(?:¥|￥|RMB|人民币)\s*(\d+(?:\.\d+)?)/i) ||
            text_4.match(/(\d+(?:\.\d+)?)\s*元/),
        amount_2 = match_4 ? Number(match_4[1]) : 0;
    return Number.isFinite(amount_2) && amount_2 > 0 ? Math.round(amount_2 * 100) / 100 : 0;
}
function grantYtCharLotteryUserReward(lottery_3, value_149) {
    if (!lottery_3?.userWon || lottery_3.rewardGrantedAt) return false;
    channelState.dataCenter =
        channelState.dataCenter && typeof channelState.dataCenter === 'object'
            ? channelState.dataCenter
            : {
                  views: 0,
                  sc: 0,
                  subs: 0,
                  commission: 0,
                  receivedGifts: [],
              };
    channelState.dataCenter.receivedGifts = Array.isArray(channelState.dataCenter.receivedGifts)
        ? channelState.dataCenter.receivedGifts
        : [];
    const existingGift = channelState.dataCenter.receivedGifts.find(
        (item_11) => String(item_11?.lotteryId) === String(lottery_3.id),
    );
    if (existingGift)
        return ((lottery_3.rewardGrantedAt = Number(existingGift.receivedAt) || Date.now()), false);
    const configuredAmount = Number(lottery_3.cashAmount),
        cashAmount_2 =
            Number.isFinite(configuredAmount) && configuredAmount > 0
                ? Math.round(configuredAmount * 100) / 100
                : parseYtCharLotteryCashAmount(lottery_3.prize),
        isCash = lottery_3.prizeType === 'cash' || cashAmount_2 > 0;
    let payCredited_2 = false;
    if (isCash && cashAmount_2 > 0) {
        payCredited_2 =
            typeof window.addPayTransaction === 'function' &&
            window.addPayTransaction(
                cashAmount_2,
                'YouTube 抽奖中奖 · ' + (lottery_3.hostName || '主播'),
                'income',
            ) !== false;
        if (!payCredited_2) {
            if (window.showToast) window.showToast('奖金暂未到账，请稍后重新进入直播间领取');
            return false;
        }
    }
    const now_154 = Date.now();
    channelState.dataCenter.receivedGifts.unshift({
        id: 'yt_received_gift_' + lottery_3.id,
        lotteryId: lottery_3.id,
        name: lottery_3.prize || '神秘礼物',
        type: isCash ? 'cash' : 'gift',
        cashAmount: isCash ? cashAmount_2 : 0,
        payCredited: payCredited_2,
        fromId: lottery_3.hostId || value_149?.channel?.id || '',
        fromName: lottery_3.hostName || value_149?.channel?.name || '主播',
        liveId: value_149?.live?.id || currentVideoData?.id || '',
        receivedAt: now_154,
    });
    channelState.dataCenter.receivedGifts = channelState.dataCenter.receivedGifts.slice(0, 100);
    lottery_3.prizeType = isCash ? 'cash' : 'gift';
    lottery_3.cashAmount = isCash ? cashAmount_2 : 0;
    lottery_3.payCredited = payCredited_2;
    lottery_3.rewardGrantedAt = now_154;
    if (typeof window.renderDataCenter === 'function') window.renderDataCenter();
    return true;
}
function renderYtCharLiveLottery(lottery_4 = getYtCharLiveLottery(), value_157 = true) {
    if (!ytCharLiveLotteryModal || !lottery_4) return;
    const channelName = currentVideoData?.channelData?.name || lottery_4.hostName || '主播',
        isCompleted = lottery_4.status === 'completed';
    if (ytCharLiveLotteryTitle)
        ytCharLiveLotteryTitle.textContent = isCompleted ? '开奖结果' : channelName + ' 发起了抽奖';
    if (ytCharLiveLotteryPrize)
        ytCharLiveLotteryPrize.textContent = '奖品：' + (lottery_4.prize || '神秘礼物');
    ytCharLiveLotteryCountdown &&
        (ytCharLiveLotteryCountdown.textContent = isCompleted
            ? '共 ' +
              (Array.isArray(lottery_4.participants) ? lottery_4.participants.length : 0) +
              ' 人参与'
            : '开奖倒计时 ' + formatYtCharLotteryCountdown(Number(lottery_4.endAt) - Date.now()));
    if (ytCharLiveLotteryActions)
        ytCharLiveLotteryActions.style.display =
            !isCompleted && !lottery_4.joined && !lottery_4.declined ? 'flex' : 'none';
    ytCharLiveLotteryClose &&
        ((ytCharLiveLotteryClose.style.display =
            isCompleted || lottery_4.joined || lottery_4.declined ? 'block' : 'none'),
        (ytCharLiveLotteryClose.textContent = isCompleted ? '知道了' : '先收起'));
    if (ytCharLiveLotteryStatus) {
        if (!isCompleted)
            ytCharLiveLotteryStatus.textContent = lottery_4.joined
                ? '已参与，等待开奖…'
                : lottery_4.declined
                  ? '你选择了不参与本次抽奖'
                  : '是否参与本次抽奖？';
        else {
            if (!lottery_4.joined) ytCharLiveLotteryStatus.textContent = '你没有参与本次抽奖';
            else {
                if (lottery_4.userWon) {
                    const rewardDestination =
                        lottery_4.prizeType === 'cash'
                            ? '，奖金已收入 Pay'
                            : '，奖品已放入数据中心';
                    ytCharLiveLotteryStatus.textContent =
                        '恭喜你中奖，获得「' +
                        (lottery_4.prize || '神秘礼物') +
                        '」' +
                        rewardDestination;
                } else
                    ytCharLiveLotteryStatus.textContent =
                        '本次未中奖，中奖者：' + (lottery_4.winner?.name || '其他观众');
            }
        }
    }
    if (value_157) ytCharLiveLotteryModal.classList.add('active');
}
function finalizeYtCharLiveLottery() {
    const resolved_4 = resolveCanonicalYtCharLive(),
        lottery_5 = resolved_4?.live?.charLottery;
    if (!resolved_4 || !lottery_5 || lottery_5.status !== 'active') return;
    const participants_2 = Array.isArray(lottery_5.participants) ? lottery_5.participants : [],
        winner_2 = participants_2.length
            ? participants_2[Math.floor(Math.random() * participants_2.length)]
            : null;
    lottery_5.status = 'completed';
    lottery_5.completedAt = Date.now();
    lottery_5.winner = winner_2
        ? {
              ...winner_2,
          }
        : null;
    lottery_5.userWon = Boolean(lottery_5.joined && winner_2?.id === 'user_channel_id');
    if (lottery_5.userWon) grantYtCharLotteryUserReward(lottery_5, resolved_4);
    currentVideoData.charLottery = lottery_5;
    stopYtCharLiveLotteryTimer();
    renderYtCharLiveLotteryInlineStatus(lottery_5);
    const value_165 = lottery_5.userWon
        ? '恭喜你抽中了「' + (lottery_5.prize || '神秘礼物') + '」！'
        : '抽奖结束，中奖的是 ' + (lottery_5.winner?.name || '一位观众') + '。';
    addCharLiveBubble(value_165, {
        skipPersist: true,
    });
    recordCharContent(value_165, false);
    saveYoutubeData();
    renderYtCharLiveLottery(lottery_5, true);
}
function startYtCharLiveLotteryTimer() {
    stopYtCharLiveLotteryTimer();
    const lottery_6 = getYtCharLiveLottery();
    if (!lottery_6 || lottery_6.status !== 'active') {
        renderYtCharLiveLotteryInlineStatus(lottery_6);
        return;
    }
    if (Date.now() >= Number(lottery_6.endAt)) {
        finalizeYtCharLiveLottery();
        return;
    }
    renderYtCharLiveLotteryInlineStatus(lottery_6);
    renderYtCharLiveLottery(lottery_6, lottery_6.joined !== true && lottery_6.declined !== true);
    ytCharLiveLotteryTimer = setInterval(() => {
        const latest_2 = getYtCharLiveLottery();
        if (!latest_2 || latest_2.status !== 'active') {
            stopYtCharLiveLotteryTimer();
            renderYtCharLiveLotteryInlineStatus(latest_2);
            return;
        }
        if (Date.now() >= Number(latest_2.endAt)) finalizeYtCharLiveLottery();
        else
            isYtPlayerVisible() &&
                (renderYtCharLiveLotteryInlineStatus(latest_2),
                renderYtCharLiveLottery(latest_2, false));
    }, 1000);
}
function isExplicitYtCharLotteryRequest(userMessage) {
    const text_5 = String(userMessage || '')
        .trim()
        .toLowerCase();
    if (!text_5) return false;
    const mentionsLottery = /抽奖|抽个奖|开奖|giveaway|raffle/.test(text_5),
        asksForAction =
            /来|开|发|搞|办|安排|整|想要|想看|要不要|可以|能不能|可不可以|请|希望|吧|呗|一下|抽一个|抽个|do|start|host|run|please|can you|could you/.test(
                text_5,
            );
    return mentionsLottery && asksForAction;
}
function normalizeYtCharLotteryDecision(value_17) {
    if (value_17 === true || value_17 === 1) return true;
    if (value_17 === false || value_17 === 0) return false;
    const normalized = String(value_17 ?? '')
        .trim()
        .toLowerCase();
    if (
        [
            'true',
            'yes',
            'start',
            'accept',
            'accepted',
            'agree',
            'agreed',
            '同意',
            '愿意',
            '开始',
            '发起',
        ].includes(normalized)
    )
        return true;
    if (
        [
            'false',
            'no',
            'decline',
            'declined',
            'reject',
            'rejected',
            'refuse',
            '拒绝',
            '不愿意',
            '不发',
        ].includes(normalized)
    )
        return false;
    return null;
}
function inferYtCharLotteryAcceptance(responseObj_3) {
    const values_2 = Array.isArray(responseObj_3?.charBubbles)
            ? responseObj_3.charBubbles
            : responseObj_3?.charResponse
              ? [responseObj_3.charResponse]
              : [],
        text_6 = values_2
            .map((value_18) =>
                typeof value_18 === 'object' ? value_18?.text || value_18?.content || '' : value_18,
            )
            .join(' ')
            .trim();
    if (!text_6) return false;
    if (
        /(?:不发|不开|不抽|拒绝|算了|下次|改天|今天不|暂时不).{0,10}(?:抽奖|开奖|奖品)|(?:抽奖|开奖).{0,10}(?:不行|不要|算了|拒绝)/.test(
            text_6,
        )
    )
        return false;
    return /(?:好|可以|行|当然|那就|来|现在|马上|开始|安排|发|开|送).{0,14}(?:抽奖|开奖|奖品)|(?:抽奖|开奖|奖品).{0,14}(?:开始|安排|来|发|开|送)/.test(
        text_6,
    );
}
function maybeStartYtCharLiveLottery(responseObj_4) {
    const resolved_5 = resolveCanonicalYtCharLive();
    if (
        !resolved_5 ||
        !currentVideoData?.isLive ||
        resolved_5.live.charLottery?.status === 'active'
    )
        return false;
    const suggestion = responseObj_4?.lotterySuggestion || responseObj_4?.randomLottery || {},
        explicitRequest = responseObj_4?._explicitLotteryRequest === true,
        explicitPrize = String(
            suggestion.prize?.name ||
                suggestion.prize ||
                suggestion.reward ||
                suggestion.gift ||
                '',
        ).trim();
    if (explicitRequest) {
        const rawDecision =
                suggestion.shouldStart ??
                suggestion.start ??
                suggestion.accepted ??
                suggestion.agree ??
                suggestion.hasLottery ??
                suggestion.enabled,
            shouldStart_2 = normalizeYtCharLotteryDecision(rawDecision);
        if (shouldStart_2 === false) return false;
        if (
            shouldStart_2 !== true &&
            !explicitPrize &&
            !inferYtCharLotteryAcceptance(responseObj_4)
        )
            return false;
    } else {
        if (Math.random() >= YT_CHAR_LOTTERY_TRIGGER_RATE) return false;
    }
    const prize_2 = String(explicitPrize || '主播准备的神秘礼物').slice(0, 80),
        declaredPrizeType = String(suggestion.prizeType || suggestion.type || '')
            .trim()
            .toLowerCase(),
        suggestedCashAmount = Number(
            suggestion.cashAmount ?? suggestion.amount ?? suggestion.prize?.amount,
        ),
        cashAmount_3 =
            declaredPrizeType === 'gift'
                ? 0
                : Number.isFinite(suggestedCashAmount) && suggestedCashAmount > 0
                  ? Math.round(suggestedCashAmount * 100) / 100
                  : parseYtCharLotteryCashAmount(prize_2),
        prizeType_2 =
            declaredPrizeType === 'gift'
                ? 'gift'
                : declaredPrizeType === 'cash' || cashAmount_3 > 0
                  ? 'cash'
                  : 'gift',
        durationSec_2 = Math.max(
            10,
            Math.min(60, Math.round(Number(suggestion.durationSec ?? suggestion.duration) || 30)),
        ),
        viewerCount_2 = Math.max(
            1,
            Number(resolved_5.live.viewerCount) ||
                parseInt(String(resolved_5.live.views || '').replace(/[^0-9]/g, ''), 10) ||
                100,
        ),
        length_2 = Math.max(
            8,
            Math.min(40, Math.round(viewerCount_2 * (0.05 + Math.random() * 0.08))),
        ),
        participants_3 = Array.from(
            {
                length: length_2,
            },
            (value_196, value_197) => ({
                id: 'char_lottery_viewer_' + value_197 + '_' + Date.now(),
                name: '观众' + (value_197 + 1),
                source: 'frontend-random',
            }),
        ),
        createdAt_2 = Date.now(),
        previousLottery = resolved_5.live.charLottery;
    previousLottery &&
        ((resolved_5.live.charLotteryHistory = Array.isArray(resolved_5.live.charLotteryHistory)
            ? resolved_5.live.charLotteryHistory
            : []),
        !resolved_5.live.charLotteryHistory.some(
            (item_12) => String(item_12?.id) === String(previousLottery.id),
        ) &&
            resolved_5.live.charLotteryHistory.push({
                ...previousLottery,
                participants: Array.isArray(previousLottery.participants)
                    ? previousLottery.participants.map((item_13) => ({
                          ...item_13,
                      }))
                    : [],
                winner: previousLottery.winner
                    ? {
                          ...previousLottery.winner,
                      }
                    : null,
            }));
    const charLottery_2 = {
        id: 'char_live_lottery_' + createdAt_2 + '_' + Math.random().toString(36).slice(2, 8),
        status: 'active',
        hostId: resolved_5.channel.id,
        hostName: resolved_5.channel.name || '主播',
        prize: prize_2,
        prizeType: prizeType_2,
        cashAmount: prizeType_2 === 'cash' ? cashAmount_3 : 0,
        durationSec: durationSec_2,
        createdAt: createdAt_2,
        endAt: createdAt_2 + durationSec_2 * 1000,
        participants: participants_3,
        joined: false,
        declined: false,
        winner: null,
        userWon: false,
    };
    resolved_5.live.charLottery = charLottery_2;
    currentVideoData.charLottery = charLottery_2;
    saveYoutubeData();
    const value_194 = '来抽个奖吧，奖品是「' + prize_2 + '」，想参加的记得点一下。';
    return (
        addCharLiveBubble(value_194, {
            skipPersist: true,
        }),
        recordCharContent(value_194, false),
        startYtCharLiveLotteryTimer(),
        true
    );
}
ytCharLiveLotteryJoin?.addEventListener('click', (event_200) => {
    event_200.stopPropagation();
    const resolved_6 = resolveCanonicalYtCharLive(),
        lottery_7 = resolved_6?.live?.charLottery;
    if (!resolved_6 || !lottery_7 || lottery_7.status !== 'active' || lottery_7.joined) return;
    const user_2 = getCurrentYtViewer();
    lottery_7.joined = true;
    lottery_7.declined = false;
    lottery_7.joinedAt = Date.now();
    lottery_7.participants = Array.isArray(lottery_7.participants) ? lottery_7.participants : [];
    lottery_7.participants.push({
        id: 'user_channel_id',
        name: user_2.name || '我',
        source: 'user-choice',
        joinedAt: lottery_7.joinedAt,
    });
    saveYoutubeData();
    ytCharLiveLotteryModal?.classList.remove('active');
    renderYtCharLiveLotteryInlineStatus(lottery_7);
});
ytCharLiveLotterySkip?.addEventListener('click', (event_4) => {
    event_4.stopPropagation();
    const lottery_8 = getYtCharLiveLottery();
    if (!lottery_8 || lottery_8.status !== 'active') return;
    lottery_8.declined = true;
    lottery_8.joined = false;
    saveYoutubeData();
    renderYtCharLiveLottery(lottery_8, true);
});
ytCharLiveLotteryClose?.addEventListener('click', (event_5) => {
    event_5.stopPropagation();
    ytCharLiveLotteryModal?.classList.remove('active');
});
window.addEventListener('resize', positionYtCharLiveLotteryStatus);
window.visualViewport?.addEventListener('resize', positionYtCharLiveLotteryStatus);
function beginYtCharConnection() {
    const resolved_7 = resolveCanonicalYtCharLive();
    if (
        !resolved_7 ||
        resolved_7.live.connection?.status === 'connecting' ||
        resolved_7.live.connection?.status === 'active'
    )
        return;
    const currentYtViewer_207 = getCurrentYtViewer();
    resolved_7.live.connection = {
        id: 'connection_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        status: 'connecting',
        requestedAt: Date.now(),
        startedAt: null,
        kickoffAttemptedAt: null,
        kickoffCompleted: false,
        transcript: [],
        participant: {
            id: 'user_channel_id',
            name: currentYtViewer_207.name || '我',
            avatar: currentYtViewer_207.avatarUrl || currentYtViewer_207.avatar || '',
            persona: currentYtViewer_207.persona || '',
        },
    };
    currentVideoData.connection = resolved_7.live.connection;
    saveYoutubeData();
    scheduleYtCharConnectionRestore();
    if (window.showToast) window.showToast('连线请求已发送，等待对方接通...');
}
function endYtCharConnection() {
    const resolved_8 = resolveCanonicalYtCharLive(),
        connection_7 = resolved_8?.live?.connection;
    if (!resolved_8 || !connection_7) return;
    resolved_8.live.guest = {
        ...(connection_7.participant || {}),
    };
    resolved_8.live.connectionEndedAt = Date.now();
    resolved_8.live.connectionHistory = [
        ...(Array.isArray(resolved_8.live.connectionHistory)
            ? resolved_8.live.connectionHistory
            : []),
        {
            id: connection_7.id,
            participant: {
                ...(connection_7.participant || {}),
            },
            requestedAt: connection_7.requestedAt || null,
            startedAt: connection_7.startedAt || null,
            endedAt: resolved_8.live.connectionEndedAt,
            transcript: Array.isArray(connection_7.transcript)
                ? connection_7.transcript.map((item_14) => ({
                      ...item_14,
                  }))
                : [],
        },
    ];
    resolved_8.live.connection = null;
    currentVideoData.connection = null;
    stopYtCharConnectionVisualTimers();
    saveYoutubeData();
    renderYtCharConnection();
    if (window.showToast) window.showToast('连线已结束');
}
ytPlayerConnectBtn &&
    ytPlayerConnectBtn.addEventListener('click', (event_211) => {
        event_211.stopPropagation();
        if (!currentVideoData?.isLive || currentVideoData?.channelData?.id === 'user_channel_id')
            return;
        const onConfirm_2 = () => beginYtCharConnection();
        window.showCustomModal
            ? window.showCustomModal({
                  title: '请求连线',
                  message:
                      '确定向 ' +
                      (currentVideoData.channelData?.name || '当前主播') +
                      ' 发起连线吗？',
                  confirmText: '请求连线',
                  cancelText: '取消',
                  onConfirm: onConfirm_2,
              })
            : onConfirm_2();
    });
ytCharLiveConnectionCard
    ?.querySelector('.yt-live-connection-exit')
    ?.addEventListener('click', (event_6) => {
        event_6.stopPropagation();
        endYtCharConnection();
    });
function addCharLiveBubble(value_214, options_4 = {}) {
    if (currentVideoData?.isLive && currentVideoData?.channelData?.id !== 'user_channel_id')
        resolveCanonicalYtCharLive();
    const localized_5 = getYtPlayerLocalizedContent(value_214);
    if (
        !ytCharSpeechBubble ||
        (!localized_5.text && !options_4.loading) ||
        !currentVideoData ||
        !currentVideoData.isLive
    )
        return;
    const bubble_2 = document.createElement('div');
    bubble_2.className = options_4.isNarrative ? 'yt-char-live-narrative' : 'yt-char-live-bubble';
    if (options_4.loading) {
        bubble_2.innerHTML = '<i class="fas fa-ellipsis-h fa-fade"></i>';
        bubble_2.dataset.loading = 'true';
    } else {
        bubble_2.innerHTML =
            `
                <div class="yt-localized-original">` +
            ytPlayerEscapeHtml(localized_5.text) +
            `</div>
                ` +
            renderYtSecondaryTranslation(localized_5.translationZh, 'yt-char-live-translation') +
            `
            `;
        if (!options_4.isNarrative && !options_4.skipPersist) {
            if (!currentVideoData.initialBubbles) currentVideoData.initialBubbles = [];
            currentVideoData.initialBubbles.push(
                localized_5.translationZh ? localized_5 : localized_5.text,
            );
            const channel_7 = currentVideoData.channelData;
            if (channel_7) {
                if (channel_7.id === 'user_channel_id' && channelState.activeUserLive)
                    channelState.activeUserLive.initialBubbles = [
                        ...currentVideoData.initialBubbles,
                    ];
                else
                    channel_7.generatedContent &&
                        channel_7.generatedContent.currentLive &&
                        (channel_7.generatedContent.currentLive.initialBubbles = [
                            ...currentVideoData.initialBubbles,
                        ]);
                if (typeof mockVideos !== 'undefined') {
                    const mv_2 = mockVideos.find(
                        (v) =>
                            v.title === currentVideoData.title &&
                            v.isLive === currentVideoData.isLive,
                    );
                    if (mv_2) mv_2.initialBubbles = [...currentVideoData.initialBubbles];
                }
                if (typeof saveYoutubeData === 'function') saveYoutubeData();
            }
        }
    }
    if (!isYtPlayerVisible() && !options_4.skipPersist) return;
    ytCharSpeechBubble.style.display = 'flex';
    ytCharSpeechBubble.appendChild(bubble_2);
    const lifetime_2 = options_4.loading ? 0 : options_4.lifetime || 8000;
    return (
        lifetime_2 > 0 &&
            setTimeout(() => {
                bubble_2.style.opacity = '0';
                setTimeout(() => {
                    bubble_2.remove();
                    ytCharSpeechBubble &&
                        ytCharSpeechBubble.children.length === 0 &&
                        (ytCharSpeechBubble.style.display = 'none');
                }, 1000);
            }, lifetime_2),
        bubble_2
    );
}
function removeCharLiveLoadingBubbles() {
    if (!ytCharSpeechBubble) return;
    ytCharSpeechBubble
        .querySelectorAll('[data-loading="true"]')
        .forEach((item_15) => item_15.remove());
    ytCharSpeechBubble.children.length === 0 && (ytCharSpeechBubble.style.display = 'none');
}
function ensureCharLiveChrome(video_4) {
    if (!playerView || !ytPlayerVideoArea) return;
    const isCharLive_2 = !!(
        video_4 &&
        video_4.isLive &&
        video_4.channelData &&
        video_4.channelData.id !== 'user_channel_id'
    );
    playerView.classList.toggle('yt-char-live-mode', isCharLive_2);
    let titleOverlay = document.getElementById('yt-player-live-title-overlay');
    !titleOverlay &&
        ((titleOverlay = document.createElement('div')),
        (titleOverlay.id = 'yt-player-live-title-overlay'),
        (titleOverlay.className = 'yt-player-live-title-overlay'),
        ytPlayerVideoArea.appendChild(titleOverlay));
    let statsOverlay = document.getElementById('yt-player-live-stats-overlay');
    !statsOverlay &&
        ((statsOverlay = document.createElement('div')),
        (statsOverlay.id = 'yt-player-live-stats-overlay'),
        (statsOverlay.className = 'yt-player-live-stats-overlay'),
        ytPlayerVideoArea.appendChild(statsOverlay));
    let actionsOverlay = document.getElementById('yt-player-live-actions-overlay');
    if (!actionsOverlay) {
        actionsOverlay = document.createElement('div');
        actionsOverlay.id = 'yt-player-live-actions-overlay';
        actionsOverlay.className = 'yt-player-live-actions-overlay';
        actionsOverlay.innerHTML = `
                <button type="button" class="yt-player-live-action-btn" id="yt-player-live-gift-btn"><i class="fas fa-gift"></i></button>
                <button type="button" class="yt-player-live-action-btn" id="yt-player-live-menu-btn"><i class="fas fa-plus"></i></button>
                <div class="yt-player-live-action-menu" id="yt-player-live-action-menu">
                    <div class="yt-player-live-menu-item" id="yt-player-live-all-content-btn"><i class="fas fa-list-alt"></i><span style="margin-left: 6px;">全部内容</span></div>
                    <div class="yt-player-live-menu-item" id="yt-player-live-continue-btn"><i class="fas fa-forward"></i><span style="margin-left: 6px;">继续直播</span></div>
                    <div class="yt-player-live-menu-item yt-player-live-menu-item-danger" id="yt-player-live-end-btn"><i class="fas fa-stop"></i><span style="margin-left: 6px;">结束直播</span></div>
                </div>
            `;
        ytPlayerVideoArea.appendChild(actionsOverlay);
        const liveGiftBtn = actionsOverlay.querySelector('#yt-player-live-gift-btn'),
            liveMenuBtn = actionsOverlay.querySelector('#yt-player-live-menu-btn'),
            liveMenu = actionsOverlay.querySelector('#yt-player-live-action-menu'),
            liveContinueBtn = actionsOverlay.querySelector('#yt-player-live-continue-btn'),
            liveAllContentBtn = actionsOverlay.querySelector('#yt-player-live-all-content-btn'),
            liveEndBtn = actionsOverlay.querySelector('#yt-player-live-end-btn');
        liveGiftBtn &&
            liveGiftBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const giftBtn = document.getElementById('yt-gift-btn');
                if (giftBtn) giftBtn.click();
            });
        liveMenuBtn &&
            liveMenu &&
            liveMenuBtn.addEventListener('click', (event_226) => {
                event_226.stopPropagation();
                liveMenu.classList.toggle('active');
            });
        liveContinueBtn &&
            liveContinueBtn.addEventListener('click', (e_2) => {
                e_2.stopPropagation();
                if (liveMenu) liveMenu.classList.remove('active');
                const actionContinue_2 = document.getElementById('yt-player-action-continue');
                if (actionContinue_2) actionContinue_2.click();
            });
        liveAllContentBtn &&
            liveAllContentBtn.addEventListener('click', (e_3) => {
                e_3.stopPropagation();
                if (liveMenu) liveMenu.classList.remove('active');
                openCharAllContentSheet();
            });
        liveEndBtn &&
            liveEndBtn.addEventListener('click', (e_4) => {
                e_4.stopPropagation();
                if (liveMenu) liveMenu.classList.remove('active');
                document.getElementById('yt-player-action-end')?.click();
            });
    }
    let allContentSheet = document.getElementById('yt-char-all-content-sheet');
    if (!allContentSheet) {
        allContentSheet = document.createElement('div');
        allContentSheet.id = 'yt-char-all-content-sheet';
        allContentSheet.className = 'bottom-sheet-overlay yt-char-all-content-modal-overlay';
        allContentSheet.innerHTML = `
                <div class="bottom-sheet yt-char-all-content-modal-card" style="background: #ffffff;">
                    <div class="sheet-header" style="padding: 16px; border-bottom: 1px solid #f2f2f2; display: flex; justify-content: space-between; align-items: center;">
                        <h3 class="sheet-title" style="margin: 0; font-size: 18px; font-weight: 600;">全部内容</h3>
                        <div>
                            <button id="clear-yt-all-content-btn" style="background: none; border: none; font-size: 14px; cursor: pointer; color: #ff3b30; margin-right: 16px; font-weight: 500;">清空</button>
                            <button class="sheet-close" id="close-yt-all-content-btn" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #606060;"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                    <div class="sheet-content" id="yt-char-all-content-list" style="min-height: 30vh; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 4px; background: #ffffff;">
                    </div>
                </div>
            `;
        document.body.appendChild(allContentSheet);
        const closeBtn = allContentSheet.querySelector('#close-yt-all-content-btn');
        closeBtn.addEventListener('click', () => allContentSheet.classList.remove('active'));
        const clearBtn = allContentSheet.querySelector('#clear-yt-all-content-btn');
        clearBtn.addEventListener('click', () => {
            window.showCustomModal &&
                window.showCustomModal({
                    title: '清空内容',
                    message: '确定要清空该直播间的所有历史内容吗？此操作无法撤销。',
                    confirmText: '清空',
                    cancelText: '取消',
                    isDestructive: true,
                    onConfirm: () => {
                        if (currentVideoData && currentVideoData.channelData) {
                            currentVideoData.channelData.liveHistory = [];
                            currentVideoData.initialBubbles = [];
                            const channel_8 = currentVideoData.channelData;
                            if (channel_8.id === 'user_channel_id' && channelState.activeUserLive) {
                                channelState.activeUserLive.history = [];
                                channelState.activeUserLive.initialBubbles = [];
                            } else
                                channel_8.generatedContent &&
                                    channel_8.generatedContent.currentLive &&
                                    ((channel_8.generatedContent.currentLive.initialBubbles = []),
                                    (channel_8.generatedContent.currentLive.liveTranscript = []));
                            currentVideoData.liveTranscript = [];
                            if (typeof saveYoutubeData === 'function') saveYoutubeData();
                            openCharAllContentSheet();
                            if (window.showToast) window.showToast('历史内容已清空');
                        }
                    },
                });
        });
        allContentSheet.addEventListener('mousedown', (event_232) => {
            if (event_232.target === allContentSheet) allContentSheet.classList.remove('active');
        });
    }
    titleOverlay.style.display = isCharLive_2 ? 'block' : 'none';
    statsOverlay.style.display = isCharLive_2 ? 'block' : 'none';
    actionsOverlay.style.display = isCharLive_2 ? 'flex' : 'none';
    isCharLive_2 &&
        ((titleOverlay.innerHTML =
            `
                <div>` +
            ytPlayerEscapeHtml(video_4.title || 'Live') +
            `</div>
                ` +
            renderYtSecondaryTranslation(
                video_4.titleTranslationZh,
                'yt-player-live-title-translation',
            ) +
            `
            `),
        (statsOverlay.textContent = getYtViewsDisplay(video_4, true)));
    const backIcon = playerBackBtn ? playerBackBtn.querySelector('i') : null;
    backIcon && (backIcon.className = isCharLive_2 ? 'fas fa-xmark' : 'fas fa-chevron-left');
}
function openCharAllContentSheet() {
    const ytCharAllContentSheetElement_233 = document.getElementById('yt-char-all-content-sheet'),
        list = document.getElementById('yt-char-all-content-list');
    if (!ytCharAllContentSheetElement_233 || !list) return;
    list.innerHTML = '';
    !currentVideoData ||
    !currentVideoData.channelData ||
    !currentVideoData.channelData.liveHistory ||
    currentVideoData.channelData.liveHistory.length === 0
        ? (list.innerHTML =
              '<div style="text-align: center; color: #8e8e93; padding: 20px;">暂无内容</div>')
        : (currentVideoData.channelData.liveHistory.forEach((item_16) => {
              const el_2 = document.createElement('div'),
                  ytPlayerLocalizedContent_236 = getYtPlayerLocalizedContent(
                      item_16,
                      currentVideoData.channelData,
                  );
              el_2.style.backgroundColor = item_16.type === 'narrative' ? 'transparent' : '#f2f2f2';
              el_2.style.padding = item_16.type === 'narrative' ? '4px 12px' : '10px 14px';
              el_2.style.borderRadius = item_16.type === 'narrative' ? '0' : '16px';
              el_2.style.color = item_16.type === 'narrative' ? '#8e8e93' : '#0f0f0f';
              el_2.style.fontStyle = item_16.type === 'narrative' ? 'italic' : 'normal';
              el_2.style.textAlign = item_16.type === 'narrative' ? 'center' : 'left';
              el_2.style.fontSize = item_16.type === 'narrative' ? '12px' : '14px';
              el_2.style.lineHeight = '1.4';
              el_2.style.alignSelf = item_16.type === 'narrative' ? 'center' : 'flex-start';
              el_2.style.maxWidth = '85%';
              let timeStr = new Date(item_16.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
              });
              item_16.type !== 'narrative'
                  ? (el_2.innerHTML =
                        `
                        ` +
                        (item_16.name
                            ? '<div style="font-size:11px;color:#606060;margin-bottom:3px;">' +
                              ytPlayerEscapeHtml(item_16.name) +
                              '</div>'
                            : '') +
                        `
                        <div>` +
                        ytPlayerEscapeHtml(ytPlayerLocalizedContent_236.text) +
                        `</div>
                        ` +
                        renderYtSecondaryTranslation(ytPlayerLocalizedContent_236.translationZh) +
                        `
                    `)
                  : (el_2.innerHTML =
                        `
                        <div>` +
                        ytPlayerEscapeHtml(ytPlayerLocalizedContent_236.text) +
                        `</div>
                        ` +
                        renderYtSecondaryTranslation(ytPlayerLocalizedContent_236.translationZh) +
                        `
                    `);
              list.appendChild(el_2);
          }),
          setTimeout(() => {
              list.scrollTop = list.scrollHeight;
          }, 10));
    ytCharAllContentSheetElement_233.classList.add('active');
}
function appendYtRealtimeCommentsDivider(container) {
    if (!container || container.querySelector('.yt-replay-realtime-divider')) return;
    const divider = document.createElement('div');
    divider.className = 'yt-replay-realtime-divider';
    divider.innerHTML = '<span>以上为实时评论</span>';
    container.appendChild(divider);
}
function renderInitialPlayerComments(value_238, value_239, element_240, value_241 = false) {
    if (!element_240 || !Array.isArray(value_238.comments) || value_238.comments.length === 0)
        return;
    const slice_242 = value_238.comments.slice();
    playerHistoryRenderActive = true;
    value_238.isLive &&
        (currentChatHistory = slice_242.slice(-50).map((value_246) => {
            const ytGeneratedComment = normalizeYtGeneratedComment(value_246, value_239);
            return {
                time: new Date().toLocaleTimeString(),
                name: ytGeneratedComment.name || '未知',
                text: ytGeneratedComment.text || '',
                amount: ytGeneratedComment.amount,
                color: ytGeneratedComment.color,
                ...(ytGeneratedComment.translationZh
                    ? {
                          translationZh: ytGeneratedComment.translationZh,
                      }
                    : {}),
                ...(ytGeneratedComment.senderType
                    ? {
                          senderType: ytGeneratedComment.senderType,
                      }
                    : {}),
            };
        }));
    const value_243 = value_241 ? getYtReplayRealtimeCommentCount(value_238) : 0,
        value_244 = playerHistoryRenderToken;
    let count = 0;
    const value_245 = () => {
        if (
            value_244 !== playerHistoryRenderToken ||
            currentVideoData !== value_238 ||
            !playerView?.classList.contains('active')
        )
            return;
        if (!isYtPlayerVisible()) {
            pendingPlayerHistoryChunk = value_245;
            return;
        }
        const documentFragment = document.createDocumentFragment();
        playerChatBatchTarget = documentFragment;
        try {
            const min_247 = Math.min(slice_242.length, count + 50);
            for (; count < min_247; count++) {
                const ytGeneratedComment_248 = normalizeYtGeneratedComment(
                    slice_242[count],
                    value_239,
                );
                addChatMessage(
                    ytGeneratedComment_248.name,
                    ytGeneratedComment_248.text,
                    !!value_238.isLive,
                    ytGeneratedComment_248.amount,
                    ytGeneratedComment_248.color,
                    true,
                    ytGeneratedComment_248.senderType || '',
                    ytGeneratedComment_248.translationZh,
                    true,
                );
                if (value_243 > 0 && count + 1 === value_243)
                    appendYtRealtimeCommentsDivider(documentFragment);
            }
        } catch (value_249) {
            console.error('Unable to render YouTube comment history:', value_249);
            count = slice_242.length;
        } finally {
            playerChatBatchTarget = null;
            element_240.appendChild(documentFragment);
            element_240.scrollTop = element_240.scrollHeight;
        }
        if (count < slice_242.length) requestAnimationFrame(() => setTimeout(value_245, 0));
        else {
            playerHistoryRenderActive = false;
            flushPendingPlayerChatRows();
        }
    };
    requestAnimationFrame(() => setTimeout(value_245, 0));
}
function setYtReplayCommentsButtonState(isVisible, isLoading = false) {
    if (!ytPlayerReplayCommentsBtn) return;
    ytPlayerReplayCommentsBtn.style.display = isVisible ? 'flex' : 'none';
    ytPlayerReplayCommentsBtn.disabled = !!isLoading;
    ytPlayerReplayCommentsBtn.setAttribute('aria-busy', String(!!isLoading));
    ytPlayerReplayCommentsBtn.innerHTML = isLoading
        ? '<i class="fas fa-circle-notch fa-spin"></i>'
        : '<i class="fas fa-search"></i>';
}
function setYtPlayerDeleteVideoButtonState(isVisible_2) {
    if (!ytPlayerDeleteVideoBtn) return;
    ytPlayerDeleteVideoBtn.style.display = isVisible_2 ? 'flex' : 'none';
    ytPlayerDeleteVideoBtn.disabled = !!ytReplayCommentRequestId;
}
function openVideoPlayer(video_5) {
    try {
        if (!playerView) return;
        playerHistoryRenderToken++;
        playerHistoryRenderActive = false;
        pendingPlayerHistoryChunk = null;
        pendingPlayerChatRows = [];
        if (typeof window.releaseYtChatKeyboardLock === 'function')
            window.releaseYtChatKeyboardLock(playerView);
        const userLiveView = document.getElementById('yt-user-live-view');
        if (userLiveView) userLiveView.classList.remove('active');
        currentVideoData = video_5;
        if (!currentVideoData._originalTitle) currentVideoData._originalTitle = video_5.title;
        let channel_9 = video_5.channelData;
        if (video_5.isLive && channel_9?.id && channel_9.id !== 'user_channel_id') {
            const channelData_3 = (Array.isArray(mockSubscriptions) ? mockSubscriptions : []).find(
                    (item_17) => String(item_17?.id) === String(channel_9.id),
                ),
                canonicalLive = channelData_3?.generatedContent?.currentLive,
                requestedLiveId_2 = video_5.id || video_5.liveId;
            channelData_3 &&
                canonicalLive &&
                (!requestedLiveId_2 ||
                    !canonicalLive.id ||
                    String(requestedLiveId_2) === String(canonicalLive.id)) &&
                ((channel_9 = channelData_3),
                (currentVideoData.channelData = channelData_3),
                (currentVideoData.id = canonicalLive.id || requestedLiveId_2 || ''),
                (currentVideoData.liveId = currentVideoData.id),
                (currentVideoData.comments = canonicalLive.comments || []),
                (currentVideoData.initialBubbles = canonicalLive.initialBubbles || []),
                (currentVideoData.liveTranscript = canonicalLive.liveTranscript || []),
                (currentVideoData.connection = canonicalLive.connection || null),
                (currentVideoData.guest = canonicalLive.guest || null));
        }
        if (!channel_9) return;
        ensureCharLiveChrome(video_5);
        let thumbnail_253 = video_5.thumbnail;
        if (
            !video_5.isLive &&
            channel_9.generatedContent &&
            channel_9.generatedContent.pastVideos
        ) {
            const savedMatch = channel_9.generatedContent.pastVideos.find(
                (v_5) => v_5.title === video_5.title,
            );
            if (savedMatch && savedMatch.thumbnail) thumbnail_253 = savedMatch.thumbnail;
        } else
            video_5.isLive &&
                channel_9.generatedContent &&
                channel_9.generatedContent.currentLive &&
                channel_9.generatedContent.currentLive.thumbnail &&
                (thumbnail_253 = channel_9.generatedContent.currentLive.thumbnail);
        if (ytPlayerThumbnail) ytPlayerThumbnail.src = thumbnail_253;
        currentVideoData.thumbnail = thumbnail_253;
        const ytPlayerTitleElement_254 = document.getElementById('yt-player-title');
        ytPlayerTitleElement_254 &&
            (ytPlayerTitleElement_254.innerHTML =
                `
                    <div>` +
                ytPlayerEscapeHtml(video_5.title || '无标题') +
                `</div>
                    ` +
                renderYtSecondaryTranslation(
                    video_5.titleTranslationZh,
                    'yt-video-title-translation',
                ) +
                `
                `);
        const viewsEl = document.getElementById('yt-player-views');
        if (viewsEl) viewsEl.textContent = getYtViewsDisplay(video_5, video_5.isLive);
        const avatarEl = document.getElementById('yt-player-avatar');
        avatarEl &&
            (avatarEl.src =
                typeof resolveYtChannelAvatar === 'function'
                    ? resolveYtChannelAvatar(channel_9)
                    : channel_9.avatar || '');
        const channelNameEl = document.getElementById('yt-player-channel-name');
        if (channelNameEl) channelNameEl.textContent = channel_9.name || '未知频道';
        const channelSubsEl = document.getElementById('yt-player-channel-subs');
        if (channelSubsEl) channelSubsEl.textContent = channel_9.subs || '1.2万 订阅者';
        clearCharLiveBubbles();
        const liveBadge = document.getElementById('yt-player-live-badge'),
            chatTitle = document.getElementById('yt-player-chat-title'),
            ytPlayerChatContainerElement_255 = document.getElementById('yt-player-chat-container'),
            ytGiftBtnElement = document.getElementById('yt-gift-btn'),
            plusMenu = document.querySelector('.yt-player-menu-container'),
            isYtLiveReplay_256 = isYtLiveReplay(video_5),
            isPastVideo = !video_5.isLive;
        if (ytPlayerChatContainerElement_255) ytPlayerChatContainerElement_255.innerHTML = '';
        if (video_5.isLive) {
            setYtReplayCommentsButtonState(false);
            setYtPlayerDeleteVideoButtonState(false);
            syncPlayerChatInputMode(true);
            if (liveBadge) liveBadge.style.display = 'block';
            if (chatTitle) chatTitle.textContent = '实时聊天';
            if (ytGiftBtnElement) ytGiftBtnElement.style.display = 'flex';
            if (plusMenu) plusMenu.style.display = 'flex';
            currentChatHistory = [];
            let bubblesToPlay = video_5.initialBubbles;
            window.ytLiveTimeouts = window.ytLiveTimeouts || [];
            !bubblesToPlay || !Array.isArray(bubblesToPlay) || bubblesToPlay.length === 0
                ? ((bubblesToPlay = getYtLiveFallbackBubbles(channel_9)),
                  bubblesToPlay.forEach((bubbleText, index_4) => {
                      let tId = setTimeout(
                          () => {
                              addCharLiveBubble(bubbleText);
                          },
                          500 + index_4 * 2000,
                      );
                      window.ytLiveTimeouts.push(tId);
                  }))
                : bubblesToPlay.length > 0 &&
                  addCharLiveBubble(bubblesToPlay[bubblesToPlay.length - 1], {
                      skipPersist: true,
                  });
            if (chatInterval) clearInterval(chatInterval);
            if (channel_9.id !== 'user_channel_id') {
                scheduleYtCharConnectionRestore();
                const restoredCharLottery = getYtCharLiveLottery();
                if (restoredCharLottery?.status === 'active') startYtCharLiveLotteryTimer();
                else {
                    if (restoredCharLottery?.status === 'completed')
                        renderYtCharLiveLottery(restoredCharLottery, false);
                }
            }
        } else {
            stopYtCharConnectionVisualTimers();
            if (ytCharLiveConnectionCard) ytCharLiveConnectionCard.style.display = 'none';
            setYtCharConnectionButtonState(null);
            setYtReplayCommentsButtonState(isPastVideo, !!ytReplayCommentRequestId);
            setYtPlayerDeleteVideoButtonState(isPastVideo);
            syncPlayerChatInputMode(false);
            if (liveBadge) liveBadge.style.display = 'none';
            if (chatTitle) chatTitle.textContent = '评论';
            if (ytGiftBtnElement) ytGiftBtnElement.style.display = 'none';
            if (plusMenu) plusMenu.style.display = 'none';
            if (chatInterval) clearInterval(chatInterval);
            if (
                video_5.comments &&
                Array.isArray(video_5.comments) &&
                video_5.comments.length > 0
            ) {
            } else {
                if (ytPlayerChatContainerElement_255)
                    ytPlayerChatContainerElement_255.innerHTML =
                        '<div style="text-align:center; padding: 20px; color: #666;" id="yt-empty-comment-msg">暂无评论</div>';
            }
        }
        playerView.classList.add('active');
        renderInitialPlayerComments(
            video_5,
            channel_9,
            ytPlayerChatContainerElement_255,
            isYtLiveReplay_256,
        );
        if (video_5.isLive) renderYtCharLiveLotteryInlineStatus();
    } catch (e_5) {
        console.error('Error opening video player:', e_5);
        if (window.showToast) window.showToast('打开视频出错');
    }
}
function getYtSuperChatTier(amount_3) {
    const numericAmount = Number(String(amount_3 ?? '').replace(/[^\d.]/g, '')) || 0;
    if (numericAmount >= 2000)
        return {
            key: 'red',
            color: '#d00000',
            textColor: '#ffffff',
        };
    if (numericAmount >= 1000)
        return {
            key: 'magenta',
            color: '#e91e63',
            textColor: '#ffffff',
        };
    if (numericAmount >= 500)
        return {
            key: 'orange',
            color: '#f57c00',
            textColor: '#ffffff',
        };
    if (numericAmount >= 200)
        return {
            key: 'yellow',
            color: '#ffca28',
            textColor: '#1f1f1f',
        };
    if (numericAmount >= 100)
        return {
            key: 'green',
            color: '#00bfa5',
            textColor: '#10201d',
        };
    if (numericAmount >= 50)
        return {
            key: 'cyan',
            color: '#00b8d4',
            textColor: '#102024',
        };
    return {
        key: 'blue',
        color: '#1565c0',
        textColor: '#ffffff',
    };
}
window.getYtSuperChatTier = getYtSuperChatTier;
function addChatMessage(
    name_3,
    text_7,
    isLive_3 = true,
    amount_4 = null,
    color_2 = null,
    value_274 = false,
    senderType_2 = '',
    value_276 = '',
    value_277 = false,
) {
    if (isLive_3 && !value_274 && currentVideoData?.channelData?.id !== 'user_channel_id')
        resolveCanonicalYtCharLive();
    const ytPlayerChatContainerElement_278 = document.getElementById('yt-player-chat-container');
    if (!ytPlayerChatContainerElement_278) return;
    const translationZh_3 = String(value_276 || '').trim();
    if (!value_274 && (!isYtPlayerVisible() || playerHistoryRenderActive))
        pendingPlayerChatRows.push([
            name_3,
            text_7,
            isLive_3,
            amount_4,
            color_2,
            true,
            senderType_2,
            value_276,
            true,
        ]);
    else {
        const ytPlayerEscapeHtml_280 = ytPlayerEscapeHtml(name_3 || ''),
            ytPlayerEscapeHtml_281 = ytPlayerEscapeHtml(text_7 || ''),
            value_282 = translationZh_3
                ? `
            <span class="yt-comment-translation-toggle" role="button" tabindex="0" aria-expanded="false">翻译</span>
            <div class="yt-comment-translation" hidden>` +
                  ytPlayerEscapeHtml(translationZh_3) +
                  `</div>
        `
                : '',
            emptyMsg = document.getElementById('yt-empty-comment-msg');
        if (emptyMsg) emptyMsg.remove();
        const row = document.createElement('div');
        if (isLive_3) {
            row.className = 'yt-live-chat-row-anim';
            if (value_274) row.style.animation = 'none';
        }
        if (amount_4) {
            const superChatTier_2 = getYtSuperChatTier(amount_4);
            let value_284 = amount_4;
            (typeof amount_4 === 'number' || /^\d+(\.\d+)?$/.test(String(amount_4))) &&
                (value_284 = '￥' + amount_4);
            row.style.backgroundColor = superChatTier_2.color;
            row.style.setProperty('--yt-sc-text-color', superChatTier_2.textColor);
            row.dataset.superChatTier = superChatTier_2.key;
            row.style.padding = '8px 12px';
            row.style.borderRadius = '8px';
            row.style.marginBottom = '4px';
            row.innerHTML =
                `
                <div style="font-weight: bold; font-size: 13px; color:` +
                superChatTier_2.textColor +
                '; opacity:0.88; margin-bottom: 4px;">' +
                ytPlayerEscapeHtml_280 +
                ' <span style="margin-left: 8px;">' +
                ytPlayerEscapeHtml(value_284) +
                `</span></div>
                <div style="font-size: 14px; color:` +
                superChatTier_2.textColor +
                ';">' +
                ytPlayerEscapeHtml_281 +
                value_282 +
                `</div>
            `;
        } else {
            row.style.display = 'flex';
            row.style.gap = '8px';
            row.style.alignItems = 'flex-start';
            row.style.marginBottom = '12px';
            const grayColors = ['#333333', '#4d4d4d', '#666666', '#808080', '#999999', '#b3b3b3'],
                randColor = grayColors[Math.floor(Math.random() * grayColors.length)];
            row.innerHTML =
                `
                <div style="width:24px; height:24px; border-radius:50%; background-color:` +
                randColor +
                `; display:flex; justify-content:center; align-items:center; color:#fff; font-size:10px; font-weight:bold; flex-shrink:0;">
                    ` +
                ytPlayerEscapeHtml(name_3 && name_3.length > 0 ? name_3[0].toUpperCase() : '?') +
                `
                </div>
                <div style="font-size:13px; margin-top:2px;">
                    <span class="yt-chat-msg-name" style="font-size:12px; margin-right:4px;">` +
                ytPlayerEscapeHtml_280 +
                `</span>
                    <span class="yt-chat-msg-text">` +
                ytPlayerEscapeHtml_281 +
                `</span>
                    ` +
                value_282 +
                `
                </div>
            `;
        }
        bindYtCommentTranslationToggle(row);
        (playerChatBatchTarget || ytPlayerChatContainerElement_278).appendChild(row);
        if (!playerChatBatchTarget)
            ytPlayerChatContainerElement_278.scrollTop =
                ytPlayerChatContainerElement_278.scrollHeight;
    }
    if (currentVideoData && !value_274) {
        if (!currentVideoData.comments) currentVideoData.comments = [];
        const storedComment = {
            name: name_3,
            text: text_7,
            amount: amount_4,
            color: amount_4 ? getYtSuperChatTier(amount_4).color : color_2,
        };
        if (senderType_2) storedComment.senderType = senderType_2;
        if (translationZh_3) storedComment.translationZh = translationZh_3;
        currentVideoData.comments.push(storedComment);
        const channel_10 = currentVideoData.channelData;
        if (channel_10) {
            if (channel_10.id === 'user_channel_id' && channelState.activeUserLive)
                channelState.activeUserLive.comments = [...currentVideoData.comments];
            else {
                if (
                    isLive_3 &&
                    channel_10.generatedContent &&
                    channel_10.generatedContent.currentLive
                )
                    channel_10.generatedContent.currentLive.comments = [
                        ...currentVideoData.comments,
                    ];
                else {
                    if (
                        !isLive_3 &&
                        channel_10.generatedContent &&
                        channel_10.generatedContent.pastVideos
                    ) {
                        const savedMatch_2 =
                            channel_10.generatedContent.pastVideos.find(
                                (v_6) => currentVideoData.id && v_6.id === currentVideoData.id,
                            ) ||
                            channel_10.generatedContent.pastVideos.find(
                                (v_7) => v_7.title === currentVideoData.title,
                            );
                        savedMatch_2 && (savedMatch_2.comments = [...currentVideoData.comments]);
                    } else {
                        if (
                            !isLive_3 &&
                            channel_10.id === 'user_channel_id' &&
                            channelState.pastVideos
                        ) {
                            const savedMatch_3 = channelState.pastVideos.find(
                                (v_8) => v_8.title === currentVideoData.title,
                            );
                            savedMatch_3 &&
                                (savedMatch_3.comments = [...currentVideoData.comments]);
                        }
                    }
                }
            }
            if (typeof mockVideos !== 'undefined') {
                const mv_3 =
                    mockVideos.find(
                        (v_9) => currentVideoData.id && v_9.id === currentVideoData.id,
                    ) ||
                    mockVideos.find(
                        (v_10) => v_10.title === currentVideoData.title && v_10.isLive === isLive_3,
                    );
                mv_3 && (mv_3.comments = [...currentVideoData.comments]);
            }
            if (typeof saveYoutubeData === 'function') saveYoutubeData();
        }
    }
    if (isLive_3 && !value_277) {
        currentChatHistory.push({
            time: new Date().toLocaleTimeString(),
            name: name_3 || '未知',
            text: text_7 || '',
            amount: amount_4,
            color: amount_4 ? getYtSuperChatTier(amount_4).color : color_2,
            ...(translationZh_3
                ? {
                      translationZh: translationZh_3,
                  }
                : {}),
            ...(senderType_2
                ? {
                      senderType: senderType_2,
                  }
                : {}),
        });
        if (currentChatHistory.length > 50) currentChatHistory.shift();
    }
}
async function getVODResponse(userMessage_2, titleOverride, value_299 = false) {
    if (!currentSubChannelData) return null;
    const char_4 = currentSubChannelData;
    if (!window.apiConfig || !window.apiConfig.endpoint || !window.apiConfig.apiKey)
        return {
            charReplies: ['（请配置API后体验互动）'],
            fanReplies: [],
        };
    const effectiveYtUser = getCurrentYtViewer(),
        userPersona = effectiveYtUser.persona || '普通观众',
        wbContext = window.getYtWorldBookContext
            ? window.getYtWorldBookContext(
                  (titleOverride || '') +
                      `
` +
                      (userMessage_2 || ''),
              )
            : '';
    let promptStr = channelState.vodPrompt || defaultVODPrompt;
    const charPersona =
        typeof window.getYtChannelPersonaWithRelationships === 'function'
            ? window.getYtChannelPersonaWithRelationships(char_4)
            : char_4.desc || '未知';
    let content_2 = promptStr
        .replace(/{char}/g, char_4.name || '')
        .replace(/{char_persona}/g, charPersona)
        .replace(/{user}/g, effectiveYtUser.name || '我')
        .replace(/{user_persona}/g, userPersona)
        .replace(/{msg}/g, userMessage_2 || '')
        .replace(/{wb_context}/g, wbContext)
        .replace(
            /{video_title}/g,
            titleOverride || (currentVideoData ? currentVideoData.title : '未知内容'),
        );
    typeof window.buildYtLocalizedJsonContract === 'function' &&
        (content_2 += window.buildYtLocalizedJsonContract(
            char_4,
            'every charReplies and fanReplies text field',
        ));
    getYtPlayerLanguageContext(char_4).enabled &&
        (content_2 += `
- For this response, charReplies and fanReplies must both be arrays of {"name":"nickname or empty string","text":"original","translationZh":"Simplified Chinese translation or empty string"}.`);
    value_299 &&
        (content_2 += `

当前互动发生在 YouTube 社群贴文评论区。charReplies 和 fanReplies 的每一项都必须返回对象 {"name":"昵称或空字符串","text":"原文","translationZh":"中文翻译或空字符串"}。text 不是中文时必须填写自然中文翻译；text 是中文时 translationZh 必须为空字符串。只返回合法 JSON。`);
    try {
        const chatCompletionsEndpoint = window.u2Api.resolveChatCompletionsEndpoint(
                window.apiConfig.endpoint,
            ),
            value_307 = await fetch(chatCompletionsEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + window.apiConfig.apiKey,
                },
                body: JSON.stringify({
                    model: window.apiConfig.model || 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'user',
                            content: content_2,
                        },
                    ],
                    temperature: 0.8,
                    response_format: {
                        type: 'json_object',
                    },
                }),
            });
        if (!value_307.ok)
            throw (
                window.u2Api?.createHttpError?.(
                    value_307,
                    await window.u2Api?.readApiError?.(value_307),
                ) ||
                Object.assign(new Error('HTTP ' + value_307.status), {
                    status: value_307.status,
                })
            );
        const value_308 = await value_307.json();
        let content_309 = value_308.choices[0].message.content;
        return (
            (content_309 = content_309
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim()),
            sanitizeObj(JSON.parse(content_309))
        );
    } catch (error_2) {
        console.error('VOD API Error:', error_2);
        if (userMessage_2 && window.u2Api?.isRequestError?.(error_2))
            window.u2Api.reportError(error_2, {
                operation: '视频聊天回复',
            });
        return {
            charReplies: ['（网络似乎断开了...）'],
            fanReplies: [],
        };
    }
}
function getYtVodReplyText(reply_2) {
    if (typeof reply_2 === 'string') return reply_2.trim();
    if (!reply_2 || typeof reply_2 !== 'object') return '';
    return String(
        reply_2.text ||
            reply_2.reply ||
            reply_2.comment ||
            reply_2.content ||
            reply_2.message ||
            '',
    ).trim();
}
function getYtVodReplyTranslation(value_312) {
    if (!value_312 || typeof value_312 !== 'object') return '';
    return String(value_312.translationZh || value_312.translation || '').trim();
}
function renderVODResponse(responseObj_5, value_314 = false) {
    if (!responseObj_5) return;
    window.ytLiveTimeouts = window.ytLiveTimeouts || [];
    const effectiveYtUser_2 = getCurrentYtViewer(),
        userName = effectiveYtUser_2.name || '用户';
    let replies = [];
    if (responseObj_5.charReplies && Array.isArray(responseObj_5.charReplies))
        replies = responseObj_5.charReplies;
    else responseObj_5.charReply && (replies = [responseObj_5.charReply]);
    replies
        .map((reply_3) => ({
            text: getYtVodReplyText(reply_3),
            translationZh: getYtVodReplyTranslation(reply_3),
        }))
        .filter((item_18) => item_18.text)
        .forEach((value_320, value_321) => {
            let setTimeout_322 = setTimeout(
                () => {
                    const replyText = '回复 @' + userName + ' : ' + value_320.text;
                    if (value_314) {
                        const translatedReply = value_320.translationZh
                            ? '回复 @' + userName + '：' + value_320.translationZh
                            : '';
                        addPostCommentMessage(
                            currentSubChannelData.name,
                            replyText,
                            false,
                            translatedReply,
                        );
                    } else
                        addChatMessage(
                            currentSubChannelData.name,
                            replyText,
                            false,
                            null,
                            null,
                            false,
                            '',
                            value_320.translationZh
                                ? '回复 @' + userName + '：' + value_320.translationZh
                                : '',
                        );
                },
                1000 + value_321 * 1500,
            );
            window.ytLiveTimeouts.push(setTimeout_322);
        });
    responseObj_5.fanReplies &&
        Array.isArray(responseObj_5.fanReplies) &&
        (responseObj_5.fanReplies = responseObj_5.fanReplies
            .map((reply_4) => {
                const text_8 = getYtVodReplyText(reply_4);
                if (!text_8) return null;
                if (reply_4 && typeof reply_4 === 'object')
                    return {
                        ...reply_4,
                        name: reply_4.name || reply_4.user || reply_4.nickname,
                        text: text_8,
                    };
                return {
                    text: text_8,
                };
            })
            .filter(Boolean));
    responseObj_5.fanReplies &&
        Array.isArray(responseObj_5.fanReplies) &&
        responseObj_5.fanReplies.forEach((c_2, value_327) => {
            let setTimeout_328 = setTimeout(
                () => {
                    const replyText_2 = '回复 @' + userName + ' : ' + c_2.text;
                    if (value_314) {
                        const ytVodReplyTranslation = getYtVodReplyTranslation(c_2),
                            translatedReply_2 = ytVodReplyTranslation
                                ? '回复 @' + userName + '：' + ytVodReplyTranslation
                                : '';
                        addPostCommentMessage(
                            c_2.name || '观众',
                            replyText_2,
                            false,
                            translatedReply_2,
                        );
                    } else {
                        const ytVodReplyTranslation_331 = getYtVodReplyTranslation(c_2);
                        addChatMessage(
                            c_2.name || '观众',
                            replyText_2,
                            false,
                            null,
                            null,
                            false,
                            '',
                            ytVodReplyTranslation_331
                                ? '回复 @' + userName + '：' + ytVodReplyTranslation_331
                                : '',
                        );
                    }
                },
                1500 + replies.length * 1500 + value_327 * 1500,
            );
            window.ytLiveTimeouts.push(setTimeout_328);
        });
    const ytReplyLoadingElement = document.getElementById('yt-reply-loading');
    if (ytReplyLoadingElement) ytReplyLoadingElement.remove();
    const postLoadingMsg = document.getElementById('yt-post-reply-loading');
    if (postLoadingMsg) postLoadingMsg.remove();
}
function findStoredYtReplay(video_6, channel_11) {
    if (channel_11?.id === 'user_channel_id') {
        const userPastVideos = channelState?.pastVideos;
        if (!Array.isArray(userPastVideos)) return null;
        return (
            userPastVideos.find((item_19) => video_6?.id && item_19.id === video_6.id) ||
            userPastVideos.find((item_20) => item_20.title === video_6?.title && !item_20.isLive) ||
            null
        );
    }
    const pastVideos_2 = channel_11?.generatedContent?.pastVideos;
    if (!Array.isArray(pastVideos_2)) return null;
    return (
        pastVideos_2.find((item_21) => video_6?.id && item_21.id === video_6.id) ||
        pastVideos_2.find((item_22) => item_22.title === video_6?.title && !item_22.isLive) ||
        null
    );
}
function formatYtReplayPromptTranscript(items_2) {
    if (!Array.isArray(items_2) || items_2.length === 0) return '无主播文字记录';
    return items_2
        .map((item_23) => {
            const type_2 = item_23?.type === 'narrative' ? '场景/动作' : '主播发言',
                translation_3 = String(item_23?.translationZh || '').trim();
            return (
                type_2 +
                ': ' +
                String(item_23?.text || '').trim() +
                (translation_3 ? '（中文：' + translation_3 + '）' : '')
            );
        })
        .filter((line) => !line.endsWith(': ')).join(`
`);
}
function formatYtReplayPromptComments(comments_3, count_3) {
    if (!Array.isArray(comments_3) || count_3 <= 0) return '无实时评论';
    return comments_3.slice(0, count_3).map((comment_2) => {
        const translation_4 = String(
            comment_2?.translationZh || comment_2?.translation || '',
        ).trim();
        return (
            String(comment_2?.name || '观众') +
            ': ' +
            String(comment_2?.text || '').trim() +
            (translation_4 ? '（中文：' + translation_4 + '）' : '')
        );
    }).join(`
`);
}
async function getYtReplayTopLevelComments(video_7, channel_12) {
    if (!window.apiConfig || !window.apiConfig.endpoint || !window.apiConfig.apiKey)
        throw new Error('API_NOT_CONFIGURED');
    const effectiveYtUser_3 = getCurrentYtViewer(),
        charPersona_2 =
            channel_12?.id === 'user_channel_id'
                ? effectiveYtUser_3.persona || channel_12?.desc || '普通创作者'
                : typeof window.getYtChannelPersonaWithRelationships === 'function'
                  ? window.getYtChannelPersonaWithRelationships(channel_12)
                  : channel_12?.desc || '未知',
        guest_4 = video_7?.guest,
        guestName = guest_4?.name || '无嘉宾',
        isLiveReplay_2 = isYtLiveReplay(video_7),
        realtimeCount = getYtReplayRealtimeCommentCount(video_7),
        value_354 = isLiveReplay_2
            ? `【本场直播内容】
` +
              formatYtReplayPromptTranscript(video_7?.liveTranscript) +
              `

【直播期间的实时评论】
` +
              formatYtReplayPromptComments(video_7?.comments, realtimeCount)
            : `【视频内容线索】
这是普通往期视频，不是直播回放。请根据视频标题、标题翻译、主播人设和已有评论准确推断视频主题；不要声称自己看过直播，也不要表达错过直播。

【已有视频评论】
` +
              formatYtReplayPromptComments(
                  video_7?.comments,
                  Math.min(20, Array.isArray(video_7?.comments) ? video_7.comments.length : 0),
              ),
        commentRequest = isLiveReplay_2
            ? '请生成 12–16 条与本场直播内容直接相关的回放评论。可以讨论具体内容、表达错过直播的遗憾、分享看回放的感受，或回应上面的实时观众'
            : '请生成 12–16 条与本期视频内容直接相关的普通视频评论。可以讨论视频主题、具体观点、观看感受或回应已有评论',
        value_356 = window.getYtWorldBookContext
            ? window.getYtWorldBookContext(
                  (video_7?.title || '') +
                      `
` +
                      value_354,
              )
            : '',
        content_3 =
            '你正在为一个已经发布的 YouTube ' +
            (isLiveReplay_2 ? '直播回放' : '普通往期视频') +
            `生成新的顶层评论。

频道主播：` +
            (channel_12?.name || '未知') +
            `
主播人设：` +
            charPersona_2 +
            `
本场嘉宾：` +
            guestName +
            `
视频标题：` +
            (video_7?.title || '未知') +
            `
标题中文翻译：` +
            (video_7?.titleTranslationZh || '无') +
            `
世界书：` +
            (value_356 || '无') +
            `

` +
            value_354 +
            `

` +
            commentRequest +
            '，但不要生成主播“' +
            (channel_12?.name || '') +
            '”、嘉宾“' +
            guestName +
            '”或用户“' +
            (effectiveYtUser_3.name || '我') +
            `”本人发言。

【国际化要求｜最高优先级】
- 评论者来自世界各地，昵称应符合各自国家或地区。
- 至少一半评论必须使用非中文，整体至少自然混合 3 种语言，可包含英语、日语、韩语、法语、西班牙语及其他语言。
- 每条外语评论必须提供自然准确的简体中文翻译；中文评论的 translationZh 必须为空字符串。
- 只返回合法 JSON：{"comments":[{"name":"viewer name","text":"原文","translationZh":"简体中文翻译或空字符串"}]}`,
        chatCompletionsEndpoint_358 = window.u2Api.resolveChatCompletionsEndpoint(
            window.apiConfig.endpoint,
        ),
        value_359 = await fetch(chatCompletionsEndpoint_358, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + window.apiConfig.apiKey,
            },
            body: JSON.stringify({
                model: window.apiConfig.model || 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'user',
                        content: content_3,
                    },
                ],
                temperature: 0.9,
                response_format: {
                    type: 'json_object',
                },
            }),
        });
    if (!value_359.ok)
        throw (
            window.u2Api?.createHttpError?.(
                value_359,
                await window.u2Api?.readApiError?.(value_359),
            ) ||
            Object.assign(new Error('HTTP ' + value_359.status), {
                status: value_359.status,
            })
        );
    const value_360 = await value_359.json();
    let trim_361 = String(value_360?.choices?.[0]?.message?.content || '').trim();
    trim_361 = trim_361
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();
    const parsed = sanitizeObj(JSON.parse(trim_361)),
        blockedNames = new Set(
            [
                String(channel_12?.name || '')
                    .trim()
                    .toLocaleLowerCase(),
                String(guest_4?.name || '')
                    .trim()
                    .toLocaleLowerCase(),
                String(effectiveYtUser_3.name || '')
                    .trim()
                    .toLocaleLowerCase(),
            ].filter(Boolean),
        ),
        comments_4 = (Array.isArray(parsed?.comments) ? parsed.comments : [])
            .map((comment_3) => normalizeYtGeneratedComment(comment_3, channel_12))
            .filter(
                (comment_4) =>
                    comment_4.name &&
                    comment_4.text &&
                    !blockedNames.has(comment_4.name.toLocaleLowerCase()),
            )
            .slice(0, 16),
        translatedCount = comments_4.filter((comment_5) => comment_5.translationZh).length;
    if (comments_4.length < 10 || translatedCount < Math.ceil(comments_4.length / 2))
        throw new Error('INVALID_REPLAY_COMMENTS');
    return comments_4;
}
function appendYtReplayGeneratedComments(video_8, value_369, comments_6) {
    const storedReplay = findStoredYtReplay(video_8, value_369),
        target_3 = storedReplay || video_8,
        existingComments = Array.isArray(target_3.comments)
            ? target_3.comments
                  .map((value_374) => normalizeYtGeneratedComment(value_374, value_369))
                  .filter((value_375) => value_375.text)
            : [],
        comments_5 = existingComments.concat(
            comments_6.map((comment_6) => ({
                ...comment_6,
            })),
        );
    target_3.comments = comments_5;
    video_8.comments = comments_5;
    if (typeof mockVideos !== 'undefined') {
        const mockReplay =
            mockVideos.find((item_24) => video_8.id && item_24.id === video_8.id) ||
            mockVideos.find((item_25) => item_25.title === video_8.title && !item_25.isLive);
        if (mockReplay)
            mockReplay.comments = comments_5.map((comment_7) => ({
                ...comment_7,
            }));
    }
    currentVideoData === video_8 &&
        playerView?.classList.contains('active') &&
        comments_6.forEach((comment_8) =>
            addChatMessage(
                comment_8.name,
                comment_8.text,
                false,
                null,
                null,
                true,
                '',
                comment_8.translationZh,
            ),
        );
    if (typeof saveYoutubeData === 'function') saveYoutubeData();
}
async function triggerYtReplayCommentGeneration() {
    const targetVideo = currentVideoData,
        channel_13 = targetVideo?.channelData;
    if (!targetVideo || !channel_13 || targetVideo.isLive || ytReplayCommentRequestId) return;
    const requestId = targetVideo.id || channel_13.id + ':' + targetVideo.title;
    ytReplayCommentRequestId = requestId;
    setYtReplayCommentsButtonState(true, true);
    setYtPlayerDeleteVideoButtonState(true);
    try {
        const comments_7 = await getYtReplayTopLevelComments(targetVideo, channel_13);
        appendYtReplayGeneratedComments(targetVideo, channel_13, comments_7);
        if (window.showToast) window.showToast('已生成 ' + comments_7.length + ' 条回放评论');
    } catch (error_3) {
        console.error('Replay comment generation failed:', error_3);
        if (
            window.u2Api?.isRequestError?.(error_3) &&
            window.u2Api.reportError(error_3, {
                operation: '回放评论生成',
            })
        ) {
        } else
            window.showToast &&
                window.showToast(
                    error_3?.message === 'API_NOT_CONFIGURED'
                        ? '请先配置 API'
                        : '回放评论生成失败，请重试',
                );
    } finally {
        if (ytReplayCommentRequestId === requestId) ytReplayCommentRequestId = '';
        const activeVideo = currentVideoData,
            shouldShow = !!(playerView?.classList.contains('active') && !activeVideo?.isLive);
        setYtReplayCommentsButtonState(shouldShow, false);
        setYtPlayerDeleteVideoButtonState(shouldShow);
    }
}
ytPlayerReplayCommentsBtn &&
    ytPlayerReplayCommentsBtn.addEventListener('click', triggerYtReplayCommentGeneration);
ytPlayerDeleteVideoBtn &&
    ytPlayerDeleteVideoBtn.addEventListener('click', () => {
        const targetVideo_2 = currentVideoData,
            channel_14 = targetVideo_2?.channelData;
        if (!targetVideo_2 || targetVideo_2.isLive || !channel_14) return;
        if (ytReplayCommentRequestId) {
            if (window.showToast) window.showToast('请等待评论生成完成');
            return;
        }
        if (!window.showCustomModal) return;
        window.showCustomModal({
            title: '删除视频',
            message: '确定要删除这个往期视频吗？',
            confirmText: '删除',
            cancelText: '取消',
            isDestructive: true,
            onConfirm: () => {
                const pastVideos_3 =
                    channel_14.id === 'user_channel_id'
                        ? channelState?.pastVideos
                        : channel_14.generatedContent?.pastVideos;
                if (!Array.isArray(pastVideos_3)) return;
                const index_5 = pastVideos_3.findIndex(
                        (video_9) => targetVideo_2.id && video_9.id === targetVideo_2.id,
                    ),
                    fallbackIndex =
                        index_5 >= 0
                            ? index_5
                            : pastVideos_3.findIndex(
                                  (video_10) =>
                                      video_10.title === targetVideo_2.title && !video_10.isLive,
                              );
                if (fallbackIndex < 0) return;
                pastVideos_3.splice(fallbackIndex, 1);
                if (typeof saveYoutubeData === 'function') saveYoutubeData();
                playerView?.classList.remove('active', 'yt-char-live-mode');
                setYtReplayCommentsButtonState(false);
                setYtPlayerDeleteVideoButtonState(false);
                currentVideoData = null;
                channel_14.id === 'user_channel_id'
                    ? document
                          .querySelector('#profile-main-tabs .yt-sliding-tab[data-target="past"]')
                          ?.click()
                    : renderGeneratedContent('past');
                if (window.showToast) window.showToast('视频已删除');
            },
        });
    });
async function getCharResponse(
    userMessage_3,
    value_397 = false,
    value_398 = 0,
    isContinue = false,
    options_5 = {},
) {
    if (!currentVideoData || !currentVideoData.channelData) return null;
    const char_5 = currentVideoData.channelData,
        _liveId_2 = ensureYtCharLiveId(char_5.generatedContent?.currentLive, char_5.id);
    if (!_liveId_2) return null;
    const charLiveState = resolveCanonicalYtCharLive()?.live,
        _explicitLotteryRequest_2 = isExplicitYtCharLotteryRequest(userMessage_3),
        activeConnection =
            charLiveState?.connection?.status === 'active' ? charLiveState.connection : null,
        connectionHistory_2 = Array.isArray(charLiveState?.connectionHistory)
            ? charLiveState.connectionHistory
            : [],
        hasManagedConnectionSession = !!charLiveState?.connection || connectionHistory_2.length > 0,
        guest_5 = hasManagedConnectionSession
            ? activeConnection?.participant || null
            : currentVideoData.guest;
    if (!window.apiConfig || !window.apiConfig.endpoint || !window.apiConfig.apiKey) {
        if (options_5.connectionKickoff)
            return {
                _error: 'API_NOT_CONFIGURED',
            };
        return {
            charBubbles: ['（请配置API后体验互动）'],
            passerbyComments: [],
        };
    }
    addCharLiveBubble('', {
        loading: true,
    });
    const effectiveYtUser_4 = getCurrentYtViewer(),
        userName_2 = effectiveYtUser_4.name || '我',
        userPersona_2 = effectiveYtUser_4.persona || '普通观众',
        wbContext_2 = window.getYtWorldBookContext
            ? window.getYtWorldBookContext(
                  (currentVideoData?.title || '') +
                      `
` +
                      (userMessage_3 || ''),
              )
            : '';
    let lastSummary = '暂无';
    if (channelState.liveSummaries && channelState.liveSummaries.length > 0) {
        const s = channelState.liveSummaries[channelState.liveSummaries.length - 1];
        lastSummary = '主题: ' + s.title + ', 内容: ' + s.content;
    }
    let systemPromptStr = channelState.systemPrompt || defaultPrompt,
        contextClueStr = isContinue
            ? '注意：现在没有新的观众发言。请你作为主播，根据上下文自主推进直播内容，主动找话题，进行环境描写或动作描写，不要傻等观众，保持直播间的活跃氛围。'
            : '',
        msgContextStr = userMessage_3
            ? '刚刚有一位观众（' +
              userName_2 +
              '）发了一条弹幕说：“' +
              userMessage_3 +
              '”。请主要针对这条留言进行回复。'
            : '';
    const charPersona_3 =
            typeof window.getYtChannelPersonaWithRelationships === 'function'
                ? window.getYtChannelPersonaWithRelationships(char_5)
                : char_5.desc || '未知',
        guestPersona =
            guest_5 && typeof window.getYtChannelPersonaWithRelationships === 'function'
                ? window.getYtChannelPersonaWithRelationships(guest_5)
                : guest_5?.desc || '未知';
    let guestContextStr = guest_5
        ? `
特别注意：本场直播的联动嘉宾是"` +
          guest_5.name +
          '"，ta的人设："' +
          guestPersona +
          '"。你的回复中可以偶尔cue到嘉宾，或由你代为复述嘉宾说的话。'
        : '';
    const publicConnectionSessions = [
            ...connectionHistory_2,
            ...(activeConnection ? [activeConnection] : []),
        ],
        value_421 = publicConnectionSessions.length
            ? publicConnectionSessions.map((session) => {
                  const participantName_2 = session.participant?.name || 'User',
                      value_432 =
                          (session.transcript || [])
                              .map(
                                  (value_433) =>
                                      (value_433.kind === 'narrative' ? '公开动作' : '公开发言') +
                                      '｜' +
                                      (value_433.name || participantName_2) +
                                      '：' +
                                      (value_433.text || ''),
                              )
                              .filter(Boolean).join(`
`) || '尚无公开发言';
                  return (
                      participantName_2 +
                      '｜' +
                      (session.endedAt ? '已结束' : '进行中') +
                      `
` +
                      value_432
                  );
              }).join(`

`)
            : '本场尚无连线公开记录。',
        filter_422 = (
            Array.isArray(charLiveState?.liveTranscript) ? charLiveState.liveTranscript : []
        )
            .slice(-30)
            .map((item_26) => {
                const localized_6 = getYtPlayerLocalizedContent(item_26, char_5);
                if (!localized_6.text) return '';
                const speaker =
                        item_26?.name ||
                        (item_26?.senderType === 'user' ? userName_2 : char_5.name || '主播'),
                    kind_2 =
                        item_26?.kind === 'narrative' ||
                        item_26?.type === 'narrative' ||
                        item_26?.type === 'connection-narrative'
                            ? '公开动作/环境'
                            : '公开发言';
                return kind_2 + '｜' + speaker + '：' + localized_6.text;
            })
            .filter(Boolean),
        filter_423 = (Array.isArray(currentChatHistory) ? currentChatHistory : [])
            .slice(-20)
            .map((value_438) => (value_438?.name || '观众') + '：' + (value_438?.text || ''))
            .filter((line_439) => !line_439.endsWith('：')),
        value_424 =
            [...filter_422, ...filter_423.map((value_440) => '近期弹幕｜' + value_440)].join(`
`) || '本场暂时没有可用的历史内容。',
        privateUserPersona =
            typeof window.getYtChannelPersonaWithRelationships === 'function'
                ? window.getYtChannelPersonaWithRelationships(effectiveYtUser_4, userPersona_2)
                : userPersona_2;
    let content_4 = systemPromptStr
        .replace(/{char}/g, char_5.name || '')
        .replace(/{char_persona}/g, charPersona_3)
        .replace(/{user}/g, userName_2)
        .replace(/{user_persona}/g, userPersona_2)
        .replace(/{guest}/g, guest_5 ? guest_5.name : '无嘉宾')
        .replace(/{wb_context}/g, wbContext_2)
        .replace(/{live_summary_context}/g, lastSummary)
        .replace(/{msg}/g, userMessage_3 || '')
        .replace(/{msg_context}/g, msgContextStr)
        .replace(/{context_clue}/g, contextClueStr + guestContextStr);
    const connectionStatusRule = activeConnection
        ? '当前连线仍在进行，可以继续实时对话。'
        : connectionHistory_2.length > 0
          ? '当前没有任何在线连线；历史连线均已结束。主播和观众不得把历史参与者描述成仍在通话，也不得继续向其提问或等待其即时回答。'
          : '当前没有在线连线用户。';
    content_4 +=
        `

【主播私有连线资料】` +
        (activeConnection
            ? '当前连线用户：' +
              (activeConnection.participant?.name || userName_2) +
              '。完整人设与关系：' +
              privateUserPersona +
              '。主播可以据此理解并回应用户。'
            : '当前没有在线连线用户。') +
        `
【连线实时状态】` +
        connectionStatusRule +
        `
【观众可见的公开连线记录】
` +
        value_421 +
        `
【严格信息边界】fanComments、passerbyComments 和 randomSuperChat 只能依据公开昵称、公开发言与公开动作；不得引用、暗示或泄露主播私有连线资料。主播可以自然回顾已结束连线的公开内容，评论也可以偶尔提到“错过了刚才的联动”，但不要强制所有评论讨论旧连线。`;
    content_4 +=
        `

【本场直播最近公开内容｜按已发生事实处理】
` +
        value_424 +
        `
【连续性规则】以上内容都已经在本场直播中真实发生。主播必须记得自己已经说过什么，并从最后的内容自然承接；不得重新开场、失忆、重复刚说过的观点，或把已经发生的内容当成第一次听说。新回复应推进话题、补充新信息或回应最新变化。`;
    value_397 &&
        (content_4 +=
            `
注意：这不仅仅是一条弹幕，而是一条来自“` +
            userName_2 +
            '”价值 ' +
            value_398 +
            ` 元的 Super Chat（醒目留言）！这是非常慷慨的打赏！
要求：
1. 你的 charBubbles 必须明确提到“` +
            userName_2 +
            `”的名字，并表现出相应的惊喜和感谢！
2. 【重要】本次由于已经有观众打赏，**请将 randomSuperChat 设置为 {"hasSuperChat": false}，不要再生成其他人的打赏了**！`);
    const ytPlayerLanguageContext_428 = getYtPlayerLanguageContext(char_5);
    ytPlayerLanguageContext_428.enabled &&
        typeof window.buildYtLocalizedJsonContract === 'function' &&
        ((content_4 += window.buildYtLocalizedJsonContract(
            char_5,
            'narrative and every charBubbles item',
        )),
        (content_4 += `
- For this live response, narrative must be {"text":"original","translationZh":"Simplified Chinese translation or empty string"}; charBubbles must be an array of the same object shape.
- Use this exact localized object schema even if the editable prompt above requests strings.`));
    content_4 += `

【最高优先级：直播观众国际化协议】主播的 narrative 和 charBubbles 继续严格使用主播默认语言；但 fanComments、passerbyComments 和 randomSuperChat 是来自世界各地的观众，绝对不能统一成主播默认语言。fanComments 或 passerbyComments 每次必须返回 6–10 条；观众昵称要符合其国家或地区，评论需混合英语、日语、韩语、法语、西班牙语及其他自然语言，至少包含 3 种语言，且至少一半为非中文评论。每条 fanComments/passerbyComments 必须是 {"name":"viewer name","text":"观众自己的语言原文","translationZh":"自然准确的简体中文翻译或空字符串"}；text 非中文时 translationZh 必须填写，text 中文时必须为空字符串。randomSuperChat 也遵循相同原文与翻译规则。此协议覆盖上方任何要求观众跟随主播默认语言的内容。`;
    content_4 += `

【主播气泡去重规则｜最高优先级】同一批 charBubbles 中禁止用不同措辞重复表达同一个回应、观点、感谢、称呼或结论；也禁止在后续气泡重新回答一次用户刚才的同一条留言。每条气泡必须承接上一条并提供新的信息、反应、动作或话题推进。生成完成后先自行检查并删除语义重复的气泡，只保留自然连续且各有新内容的气泡。`;
    _explicitLotteryRequest_2
        ? (content_4 +=
              charLiveState?.charLottery?.status === 'active'
                  ? `

【User 明确请求抽奖】当前已有一轮抽奖正在进行，不能同时再次发起。lotterySuggestion 必须返回 {"shouldStart":false,"prize":"","prizeType":"gift","cashAmount":0,"durationSec":30}，主播应自然提醒 User 等待当前开奖。`
                  : `

【User 明确请求抽奖｜由 Char 自主决定】User 正在明确要求主播发抽奖。请严格根据主播完整人设、与 User 的关系、当前情绪和本场直播内容，决定主播愿不愿意发；不得默认同意，也不得由观众替主播决定。只能返回以下三种完全合法的 JSON 之一：礼物抽奖示例 lotterySuggestion={"shouldStart":true,"prize":"签名海报","prizeType":"gift","cashAmount":0,"durationSec":30}；现金抽奖示例 lotterySuggestion={"shouldStart":true,"prize":"¥66现金","prizeType":"cash","cashAmount":66,"durationSec":30}；拒绝示例 lotterySuggestion={"shouldStart":false,"prize":"","prizeType":"gift","cashAmount":0,"durationSec":30}。durationSec 可选择 10 到 60 的整数。只要 charBubbles 表示同意、答应、宣布奖品或声称马上开始，shouldStart 就必须为 true，且必须同时返回具体 prize；绝对不能出现“嘴上答应但 shouldStart=false 或漏掉 lotterySuggestion”的矛盾。shouldStart=false 时应按人设自然拒绝、回避或提出理由，绝对不能声称抽奖已经开始。禁止把 shouldStart 返回成字符串。`)
        : (content_4 += `
每次响应还要返回一个合法的候选抽奖对象。非现金示例：lotterySuggestion={"shouldStart":true,"prize":"签名海报","prizeType":"gift","cashAmount":0,"durationSec":30}；现金示例：lotterySuggestion={"shouldStart":true,"prize":"¥66现金","prizeType":"cash","cashAmount":66,"durationSec":30}。这只是候选奖品，前端仅会以极低概率真正触发抽奖；不要为了该字段强行让 charBubbles 宣布抽奖。`);
    activeConnection &&
        (content_4 += `
当前连线有效时还必须返回 connectionNarrative={"text":"连线用户的公开环境、动作或氛围描写","translationZh":"简体中文翻译或空字符串"}。该描写会公开显示并写入会话记录。`);
    if (options_5.connectionKickoff) {
        const connection_8 = getActiveYtCharConnection(),
            participant_5 = connection_8?.participant || getCurrentYtViewer();
        content_4 +=
            `

【本次是连线刚接通后的首次互动，优先级最高】连线用户：` +
            (participant_5?.name || 'User') +
            '。请让主播根据私有完整人设自然回应连线接通，并让观众只根据公开信息围绕这次连线即时讨论。charBubbles 必须生成 1–3 条主播发言；connectionNarrative 必须非空；fanComments 或 passerbyComments 必须生成 10–14 条相关评论，不得少于 10 条。';
    }
    try {
        const chatCompletionsEndpoint_443 = window.u2Api.resolveChatCompletionsEndpoint(
                window.apiConfig.endpoint,
            ),
            value_444 = await fetch(chatCompletionsEndpoint_443, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + window.apiConfig.apiKey,
                },
                body: JSON.stringify({
                    model: window.apiConfig.model || 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'user',
                            content: content_4,
                        },
                    ],
                    temperature: 0.8,
                    response_format: {
                        type: 'json_object',
                    },
                }),
            });
        if (!value_444.ok)
            throw (
                window.u2Api?.createHttpError?.(
                    value_444,
                    await window.u2Api?.readApiError?.(value_444),
                ) ||
                Object.assign(new Error('HTTP ' + value_444.status), {
                    status: value_444.status,
                })
            );
        const value_445 = await value_444.json();
        let content_446 = value_445.choices[0].message.content;
        content_446 = content_446
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();
        if (
            char_5.generatedContent?.currentLive?.id !== _liveId_2 ||
            currentVideoData?.channelData?.id !== char_5.id
        )
            return null;
        const parsedResult = sanitizeObj(JSON.parse(content_446));
        if (options_5.connectionKickoff) {
            const bubbles_2 = Array.isArray(parsedResult.charBubbles)
                    ? parsedResult.charBubbles
                    : parsedResult.charResponse
                      ? [parsedResult.charResponse]
                      : [],
                comments_8 = Array.isArray(parsedResult.fanComments)
                    ? parsedResult.fanComments
                    : Array.isArray(parsedResult.passerbyComments)
                      ? parsedResult.passerbyComments
                      : [],
                connectionNarrative_2 = getYtPlayerLocalizedContent(
                    parsedResult.connectionNarrative,
                    char_5,
                );
            if (bubbles_2.length < 1 || comments_8.length < 10 || !connectionNarrative_2.text)
                throw new Error('INVALID_CONNECTION_KICKOFF');
        }
        return {
            ...parsedResult,
            _liveId: _liveId_2,
            _explicitLotteryRequest: _explicitLotteryRequest_2,
        };
    } catch (error_4) {
        console.error('Interactive Live Error:', error_4);
        if (userMessage_3 && window.u2Api?.isRequestError?.(error_4))
            window.u2Api.reportError(error_4, {
                operation: '直播互动回复',
            });
        if (char_5.generatedContent?.currentLive?.id !== _liveId_2) return null;
        if (options_5.connectionKickoff)
            return {
                _error: 'CONNECTION_RESPONSE_INVALID',
                _liveId: _liveId_2,
            };
        return {
            _liveId: _liveId_2,
            charBubbles: ['（直播信号有点差...）'],
            passerbyComments: [],
        };
    }
}
function recordCharContent(value_452, isNarrative_2 = false) {
    if (!currentVideoData || !currentVideoData.channelData) return;
    if (currentVideoData.isLive && currentVideoData.channelData.id !== 'user_channel_id')
        resolveCanonicalYtCharLive();
    const localized_7 = getYtPlayerLocalizedContent(value_452, currentVideoData.channelData),
        transcriptItem_2 = {
            type: isNarrative_2 ? 'narrative' : 'bubble',
            text: localized_7.text,
            ...(localized_7.translationZh
                ? {
                      translationZh: localized_7.translationZh,
                  }
                : {}),
            timestamp: new Date().getTime(),
        };
    !currentVideoData.channelData.liveHistory && (currentVideoData.channelData.liveHistory = []);
    currentVideoData.channelData.liveHistory.push(transcriptItem_2);
    const currentLive_4 = currentVideoData.channelData.generatedContent?.currentLive;
    if (currentLive_4 && currentVideoData.isLive) {
        if (!Array.isArray(currentLive_4.liveTranscript)) currentLive_4.liveTranscript = [];
        currentLive_4.liveTranscript.push({
            ...transcriptItem_2,
        });
        currentVideoData.liveTranscript = currentLive_4.liveTranscript;
        if (currentLive_4.connection?.status === 'active') {
            if (!Array.isArray(currentLive_4.connection.transcript))
                currentLive_4.connection.transcript = [];
            currentLive_4.connection.transcript.push(
                normalizeYtConnectionTranscriptItem({
                    speakerType: 'char',
                    speakerId: currentVideoData.channelData.id,
                    name: currentVideoData.channelData.name || '主播',
                    text: localized_7.text,
                    translationZh: localized_7.translationZh,
                    kind: isNarrative_2 ? 'narrative' : 'speech',
                    timestamp: transcriptItem_2.timestamp,
                }),
            );
        }
    }
    saveYoutubeData();
}
function renderAiResponse(responseObj) {
    if (!responseObj) return;
    if (currentVideoData?.isLive && currentVideoData?.channelData?.id !== 'user_channel_id')
        resolveCanonicalYtCharLive();
    if (
        responseObj._liveId &&
        currentVideoData?.channelData?.generatedContent?.currentLive?.id !== responseObj._liveId
    )
        return;
    removeCharLiveLoadingBubbles();
    window.ytLiveTimeouts = window.ytLiveTimeouts || [];
    if (responseObj.narrative) {
        const narrative_3 = getYtPlayerLocalizedContent(responseObj.narrative),
            localizedNarrative = {
                text: narrative_3.text ? '（' + narrative_3.text + '）' : '',
                translationZh: narrative_3.translationZh
                    ? '（' + narrative_3.translationZh + '）'
                    : '',
            };
        recordCharContent(localizedNarrative, true);
        let tId_2 = setTimeout(() => {
            addCharLiveBubble(localizedNarrative, {
                isNarrative: true,
            });
        }, 500);
        window.ytLiveTimeouts.push(tId_2);
    }
    if (responseObj.connectionNarrative && getActiveYtCharConnection()?.status === 'active') {
        const setTimeout_461 = setTimeout(() => {
            const connection_9 = getActiveYtCharConnection();
            if (!connection_9 || connection_9.status !== 'active') return;
            const localized_8 = getYtPlayerLocalizedContent(
                responseObj.connectionNarrative,
                currentVideoData?.channelData,
            );
            if (!localized_8.text) return;
            addYtCharConnectionNarrative(localized_8);
            const item_27 = normalizeYtConnectionTranscriptItem({
                speakerType: 'user',
                speakerId: connection_9.participant?.id || 'user_channel_id',
                name: connection_9.participant?.name || 'User',
                text: localized_8.text,
                translationZh: localized_8.translationZh,
                kind: 'narrative',
            });
            connection_9.transcript = Array.isArray(connection_9.transcript)
                ? connection_9.transcript
                : [];
            connection_9.transcript.push(item_27);
            const resolved_9 = resolveCanonicalYtCharLive();
            resolved_9 &&
                ((resolved_9.live.liveTranscript = Array.isArray(resolved_9.live.liveTranscript)
                    ? resolved_9.live.liveTranscript
                    : []),
                resolved_9.live.liveTranscript.push({
                    type: 'connection-narrative',
                    senderType: 'user',
                    ...item_27,
                }),
                (resolved_9.channel.liveHistory = Array.isArray(resolved_9.channel.liveHistory)
                    ? resolved_9.channel.liveHistory
                    : []),
                resolved_9.channel.liveHistory.push({
                    type: 'connection-narrative',
                    senderType: 'user',
                    ...item_27,
                }),
                saveYoutubeData());
        }, 700);
        window.ytLiveTimeouts.push(setTimeout_461);
    }
    if (responseObj.randomSuperChat && responseObj.randomSuperChat.hasSuperChat) {
        let tId_3 = setTimeout(
            () => {
                addChatMessage(
                    responseObj.randomSuperChat.name || '神秘人',
                    responseObj.randomSuperChat.text || '',
                    true,
                    responseObj.randomSuperChat.displayAmount ||
                        responseObj.randomSuperChat.amount ||
                        30,
                    getYtSuperChatTier(
                        responseObj.randomSuperChat.amount ||
                            responseObj.randomSuperChat.displayAmount ||
                            30,
                    ).color,
                    false,
                    '',
                    responseObj.randomSuperChat.translationZh || '',
                );
            },
            Math.floor(Math.random() * 2000) + 500,
        );
        window.ytLiveTimeouts.push(tId_3);
    }
    let bubbles_3 = [];
    if (responseObj.charBubbles && Array.isArray(responseObj.charBubbles))
        bubbles_3 = responseObj.charBubbles;
    else responseObj.charResponse && (bubbles_3 = [responseObj.charResponse]);
    if (bubbles_3.length > 0)
        bubbles_3.forEach((bubbleValue, index_6) => {
            recordCharContent(bubbleValue, false);
            let tId_4 = setTimeout(
                () => {
                    addCharLiveBubble(bubbleValue);
                },
                1000 + index_6 * 2500,
            );
            window.ytLiveTimeouts.push(tId_4);
        });
    else {
        if (ytCharSpeechBubble && ytCharSpeechBubble.children.length === 0)
            ytCharSpeechBubble.style.display = 'none';
    }
    const commentsArr = responseObj.fanComments || responseObj.passerbyComments;
    if (commentsArr && Array.isArray(commentsArr)) {
        let totalDelay = 2000;
        commentsArr.forEach((c) => {
            totalDelay += Math.floor(Math.random() * 2000) + 500;
            let tId_5 = setTimeout(() => {
                addChatMessage(
                    c.name || '观众',
                    c.text,
                    true,
                    null,
                    null,
                    false,
                    '',
                    c.translationZh || c.translation || '',
                );
            }, totalDelay);
            window.ytLiveTimeouts.push(tId_5);
        });
    }
    maybeStartYtCharLiveLottery(responseObj);
}
async function generateLiveSummary() {
    if (!currentVideoData || !currentVideoData.channelData) return null;
    const char_6 = currentVideoData.channelData;
    if (!window.apiConfig || !window.apiConfig.endpoint || !window.apiConfig.apiKey) {
        if (window.showToast) window.showToast('请先配置 API 以生成总结');
        return null;
    }
    const currentYtViewer_471 = getCurrentYtViewer(),
        userPersona_3 = currentYtViewer_471.persona || '普通观众';
    let historyStr = '';
    currentChatHistory.length > 0
        ? (historyStr = currentChatHistory.map((value_479) => {
              if (value_479.amount)
                  return (
                      '[' +
                      value_479.time +
                      '] ' +
                      value_479.name +
                      ' 打赏了 ' +
                      value_479.amount +
                      '元: ' +
                      value_479.text
                  );
              return '[' + value_479.time + '] ' + value_479.name + ': ' + value_479.text;
          }).join(`
`))
        : (historyStr = '（暂无详细聊天记录）');
    let promptStr_2 = channelState.summaryPrompt || defaultSummaryPrompt;
    const charPersona_4 =
        typeof window.getYtChannelPersonaWithRelationships === 'function'
            ? window.getYtChannelPersonaWithRelationships(char_6)
            : char_6.desc || '未知';
    !promptStr_2.includes('newSubs') &&
        (promptStr_2 += `

请在JSON中额外返回一个 "newSubs" 字段（整数），代表本次直播带来的新增订阅数。`);
    const wbContext_3 = window.getYtWorldBookContext
            ? window.getYtWorldBookContext(
                  (char_6?.name || '') +
                      `
` +
                      historyStr,
              )
            : '',
        hasWorldBookPlaceholder = promptStr_2.includes('{wb_context}');
    let content_5 = promptStr_2
        .replace(/{char}/g, char_6.name || '')
        .replace(/{char_persona}/g, charPersona_4)
        .replace(/{user}/g, userPersona_3)
        .replace(/{current_time}/g, new Date().toLocaleString())
        .replace(/{chat_history}/g, historyStr)
        .replace(/{wb_context}/g, wbContext_3);
    !hasWorldBookPlaceholder &&
        wbContext_3 &&
        (content_5 +=
            `

世界书内容：
` + wbContext_3);
    try {
        const chatCompletionsEndpoint_480 = window.u2Api.resolveChatCompletionsEndpoint(
                window.apiConfig.endpoint,
            ),
            value_481 = await fetch(chatCompletionsEndpoint_480, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + window.apiConfig.apiKey,
                },
                body: JSON.stringify({
                    model: window.apiConfig.model || 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'user',
                            content: content_5,
                        },
                    ],
                    temperature: 0.7,
                    response_format: {
                        type: 'json_object',
                    },
                }),
            });
        if (!value_481.ok)
            throw (
                window.u2Api?.createHttpError?.(
                    value_481,
                    await window.u2Api?.readApiError?.(value_481),
                ) ||
                Object.assign(new Error('HTTP ' + value_481.status), {
                    status: value_481.status,
                })
            );
        const value_482 = await value_481.json();
        let content_483 = value_482.choices[0].message.content;
        content_483 = content_483
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();
        const summaryObj = sanitizeObj(JSON.parse(content_483));
        summaryObj.charName = char_6.name || '未知';
        if (!channelState.liveSummaries) channelState.liveSummaries = [];
        channelState.liveSummaries.push(summaryObj);
        window.autoSaveSummaryToWorldBook &&
            window.autoSaveSummaryToWorldBook(
                char_6.name + ' 直播记录',
                summaryObj.content || summaryObj.summary || JSON.stringify(summaryObj),
            );
        if (summaryObj.newSubs && typeof summaryObj.newSubs === 'number') {
            const currentSubsNum = parseSubs(char_6.subs);
            char_6.subs = formatSubs(currentSubsNum + summaryObj.newSubs);
            const subIndex = mockSubscriptions.findIndex((s_2) => s_2.id === char_6.id);
            subIndex > -1 && (mockSubscriptions[subIndex].subs = char_6.subs);
            if (currentSubChannelData && currentSubChannelData.id === char_6.id) {
                const subsEl = document.getElementById('sub-channel-subs');
                if (subsEl) subsEl.textContent = char_6.subs + ' 订阅者';
            }
        }
        saveYoutubeData();
        if (window.showToast) window.showToast('直播总结生成完毕并已保存');
        if (typeof window.releaseYtChatKeyboardLock === 'function')
            window.releaseYtChatKeyboardLock();
        if (playerView) playerView.classList.remove('active');
        if (chatInterval) clearInterval(chatInterval);
        clearCharLiveBubbles();
    } catch (error_5) {
        console.error('Summary Error:', error_5);
        if (
            !window.u2Api?.isRequestError?.(error_5) ||
            !window.u2Api.reportError(error_5, {
                operation: '直播总结生成',
            })
        ) {
            if (window.showToast) window.showToast('生成总结失败');
        }
    }
}
const chatInput = document.getElementById('yt-player-chat-input'),
    chatSend = document.getElementById('yt-player-chat-send'),
    chatApiBtn = document.getElementById('yt-player-chat-api');
let isPlayerChatApiLoading = false;
function stopPlayerControlEvent(e_6) {
    if (!e_6) return;
    e_6.stopPropagation();
}
const ytPlayerChatContainer = document.getElementById('yt-player-chat-container'),
    playerPlusBtn = document.getElementById('yt-player-plus-btn'),
    playerActionMenu = document.getElementById('yt-player-action-menu'),
    actionContinue = document.getElementById('yt-player-action-continue'),
    actionSummary = document.getElementById('yt-player-action-summary'),
    actionEndLive = document.getElementById('yt-player-action-end');
[
    ytPlayerVideoArea,
    playerBackBtn,
    ytPlayerChatContainer,
    chatInput,
    chatSend,
    chatApiBtn,
    ytPlayerConnectBtn,
    ytCharLiveConnectionCard,
    playerPlusBtn,
    document.getElementById('yt-gift-btn'),
]
    .filter(Boolean)
    .forEach((el) => {
        el.addEventListener('click', stopPlayerControlEvent);
        el.addEventListener('pointerdown', stopPlayerControlEvent);
    });
if (ytPlayerChatContainer) {
    let isDraggingPlayerChat = false;
    ytPlayerChatContainer.addEventListener(
        'touchstart',
        () => {
            isDraggingPlayerChat = false;
        },
        {
            passive: true,
        },
    );
    ytPlayerChatContainer.addEventListener(
        'touchmove',
        () => {
            isDraggingPlayerChat = true;
        },
        {
            passive: true,
        },
    );
    ytPlayerChatContainer.addEventListener('touchend', () => {
        if (isDraggingPlayerChat) {
            if (chatInput && document.activeElement === chatInput) chatInput.blur();
        }
    });
    ytPlayerChatContainer.addEventListener('click', () => {
        if (chatInput && document.activeElement === chatInput) chatInput.blur();
    });
    const playerBackBtnInner = document.getElementById('yt-player-back-btn');
    playerBackBtnInner &&
        playerBackBtnInner.addEventListener('click', () => {
            if (chatInput && document.activeElement === chatInput) chatInput.blur();
        });
}
chatInput &&
    (chatInput.addEventListener('focus', () => {
        if (typeof window.setYtChatKeyboardLock === 'function')
            window.setYtChatKeyboardLock(playerView, true);
        else {
            if (playerView) playerView.classList.add('keyboard-open');
        }
    }),
    chatInput.addEventListener('blur', () => {
        if (typeof window.setYtChatKeyboardLock === 'function')
            window.setYtChatKeyboardLock(playerView, false);
        else {
            if (playerView) playerView.classList.remove('keyboard-open');
        }
        window.resetYtViewportOffset?.();
    }));
function syncPlayerChatInputMode(isLive_4) {
    chatInput &&
        ((chatInput.placeholder = isLive_4 ? '发送消息...' : '发表评论...'),
        chatInput.setAttribute('aria-label', isLive_4 ? '发送直播聊天' : '发表评论'),
        chatInput.setAttribute('enterkeyhint', 'send'));
    chatSend &&
        ((chatSend.title = isLive_4 ? '发送消息' : '发表评论'),
        chatSend.setAttribute('aria-label', isLive_4 ? '发送消息' : '发表评论'));
    chatApiBtn &&
        ((chatApiBtn.title = isLive_4 ? '调用 API 生成直播回复' : '调用 API 生成评论回复'),
        chatApiBtn.setAttribute('aria-label', chatApiBtn.title));
}
if (chatSend && chatInput) {
    const sendAction = () => {
        const text_9 = chatInput.value.trim();
        if (!text_9) return;
        const isLive_5 = currentVideoData && currentVideoData.isLive,
            effectiveYtUser_5 = getCurrentYtViewer();
        addChatMessage(effectiveYtUser_5.name || '我', text_9, isLive_5, null, null, false, 'user');
        isLive_5 &&
            getActiveYtCharConnection()?.status === 'active' &&
            (addYtCharConnectionBubble(text_9), recordYtCharConnectionUserContent(text_9));
        chatInput.value = '';
    };
    chatSend.addEventListener('click', sendAction);
    chatSend.addEventListener('keydown', (event_494) => {
        if (event_494.key !== 'Enter' && event_494.key !== ' ') return;
        event_494.preventDefault();
        sendAction();
    });
    window.mobileInputCompat?.register({
        input: chatInput,
        root: playerView,
        scrollContainer: ytPlayerChatContainer,
        onSend: sendAction,
        allowEmpty: true,
        openClasses: ['keyboard-open', 'yt-chat-keyboard-lock'],
    });
}
function findLatestPlayerUserMessage(isLive_6) {
    const effectiveYtUser_6 = getCurrentYtViewer(),
        userName_3 = String(effectiveYtUser_6.name || '我'),
        messages_2 = isLive_6
            ? currentChatHistory
            : Array.isArray(currentVideoData?.comments)
              ? currentVideoData.comments
              : [];
    for (let index_7 = messages_2.length - 1; index_7 >= 0; index_7--) {
        if (messages_2[index_7]?.senderType === 'user') return messages_2[index_7];
    }
    for (let index_8 = messages_2.length - 1; index_8 >= 0; index_8--) {
        if (String(messages_2[index_8]?.name || '') === userName_3) return messages_2[index_8];
    }
    return null;
}
function setPlayerChatApiLoading(isLoading_2) {
    isPlayerChatApiLoading = isLoading_2;
    if (!chatApiBtn) return;
    chatApiBtn.style.opacity = isLoading_2 ? '0.5' : '1';
    chatApiBtn.style.pointerEvents = isLoading_2 ? 'none' : 'auto';
    chatApiBtn.setAttribute('aria-busy', String(isLoading_2));
    chatApiBtn.innerHTML = isLoading_2
        ? '<i class="fas fa-spinner fa-spin"></i>'
        : '<i class="fas fa-arrow-down" style="font-size:14px;"></i>';
}
function showPlayerReplyLoading() {
    const chatContainer = document.getElementById('yt-player-chat-container');
    if (!chatContainer || document.getElementById('yt-reply-loading')) return;
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'yt-reply-loading';
    loadingDiv.style.textAlign = 'center';
    loadingDiv.style.padding = '10px';
    loadingDiv.style.color = '#8e8e93';
    loadingDiv.style.fontSize = '12px';
    loadingDiv.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> 回复生成中...';
    chatContainer.appendChild(loadingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
async function triggerPlayerChatApi() {
    if (isPlayerChatApiLoading || !currentVideoData) return;
    const isLive_7 = !!currentVideoData.isLive,
        latestUserMessage = findLatestPlayerUserMessage(isLive_7);
    if (!isLive_7 && !latestUserMessage) {
        if (window.showToast) window.showToast('请先发送评论');
        return;
    }
    setPlayerChatApiLoading(true);
    try {
        if (isLive_7) {
            const activeConnection_2 = getActiveYtCharConnection(),
                needsConnectionRetry =
                    activeConnection_2?.status === 'active' &&
                    activeConnection_2.kickoffCompleted !== true,
                responseObj_6 = await getCharResponse(
                    latestUserMessage?.text || '',
                    false,
                    0,
                    !latestUserMessage,
                    {
                        connectionKickoff: needsConnectionRetry,
                    },
                );
            if (responseObj_6?._error) {
                removeCharLiveLoadingBubbles();
                if (window.showToast) window.showToast('连线互动生成失败，请重试');
            } else {
                if (needsConnectionRetry) {
                    const latestConnection = getActiveYtCharConnection();
                    if (latestConnection) latestConnection.kickoffCompleted = true;
                    saveYoutubeData();
                    resolveCanonicalYtCharLive();
                }
                renderAiResponse(responseObj_6);
            }
        } else {
            showPlayerReplyLoading();
            const responseObj_7 = await getVODResponse(latestUserMessage.text);
            renderVODResponse(responseObj_7);
        }
    } finally {
        const ytReplyLoadingElement_508 = document.getElementById('yt-reply-loading');
        if (ytReplyLoadingElement_508) ytReplyLoadingElement_508.remove();
        setPlayerChatApiLoading(false);
    }
}
chatApiBtn &&
    (chatApiBtn.addEventListener('click', triggerPlayerChatApi),
    chatApiBtn.addEventListener('keydown', (event_509) => {
        if (event_509.key !== 'Enter' && event_509.key !== ' ') return;
        event_509.preventDefault();
        triggerPlayerChatApi();
    }));
playerPlusBtn &&
    playerActionMenu &&
    (playerPlusBtn.addEventListener('click', (event_510) => {
        event_510.stopPropagation();
        playerActionMenu.classList.toggle('active');
    }),
    document.addEventListener('click', (event_511) => {
        !playerPlusBtn.contains(event_511.target) &&
            !playerActionMenu.contains(event_511.target) &&
            playerActionMenu.classList.remove('active');
    }));
actionContinue &&
    actionContinue.addEventListener('click', async (e_7) => {
        e_7.stopPropagation();
        if (playerActionMenu) playerActionMenu.classList.remove('active');
        if (currentVideoData && currentVideoData.isLive) {
            if (window.showToast) window.showToast('正在生成后续直播内容...');
            const responseObj_8 = await getCharResponse('', false, 0, true);
            renderAiResponse(responseObj_8);
        } else {
            if (window.showToast) window.showToast('仅在直播时可用');
        }
    });
function finishCurrentYtCharLive() {
    const video_11 = currentVideoData,
        channelId_3 = video_11?.channelData?.id,
        channel_15 =
            (Array.isArray(mockSubscriptions) ? mockSubscriptions : []).find(
                (item_28) => String(item_28?.id) === String(channelId_3),
            ) || video_11?.channelData,
        currentLive_5 = channel_15?.generatedContent?.currentLive,
        requestedLiveId_3 = video_11?.id || video_11?.liveId;
    if (
        !video_11?.isLive ||
        !channel_15 ||
        channel_15.id === 'user_channel_id' ||
        !currentLive_5 ||
        (requestedLiveId_3 &&
            currentLive_5.id &&
            String(requestedLiveId_3) !== String(currentLive_5.id))
    ) {
        if (window.showToast) window.showToast('当前没有可结束的 Char 直播');
        return;
    }
    window.ytLiveTimeouts &&
        (window.ytLiveTimeouts.forEach(clearTimeout), (window.ytLiveTimeouts = []));
    if (currentLive_5.charLottery?.status === 'active') finalizeYtCharLiveLottery();
    stopYtCharLiveLotteryTimer();
    ytCharLiveLotteryModal?.classList.remove('active');
    if (ytCharLiveLotteryInlineStatus) ytCharLiveLotteryInlineStatus.style.display = 'none';
    stopYtCharConnectionVisualTimers();
    currentLive_5.connection &&
        ((currentLive_5.guest = {
            ...(currentLive_5.connection.participant || currentLive_5.guest || {}),
        }),
        (currentLive_5.connectionEndedAt = Date.now()),
        (currentLive_5.connectionHistory = [
            ...(Array.isArray(currentLive_5.connectionHistory)
                ? currentLive_5.connectionHistory
                : []),
            {
                id: currentLive_5.connection.id,
                participant: {
                    ...(currentLive_5.connection.participant || {}),
                },
                requestedAt: currentLive_5.connection.requestedAt || null,
                startedAt: currentLive_5.connection.startedAt || null,
                endedAt: currentLive_5.connectionEndedAt,
                transcript: Array.isArray(currentLive_5.connection.transcript)
                    ? currentLive_5.connection.transcript.map((item_29) => ({
                          ...item_29,
                      }))
                    : [],
            },
        ]),
        (currentLive_5.connection = null));
    archiveYtCurrentCharLive(channel_15);
    channel_15.generatedContent.currentLive = null;
    channel_15.isLive = false;
    mockVideos = mockVideos.filter(
        (value_522) => !(value_522?.isLive && value_522?.channelData?.id === channel_15.id),
    );
    if (typeof saveYoutubeData === 'function') saveYoutubeData();
    if (typeof renderVideos === 'function') renderVideos();
    const canonicalChannel_2 =
        mockSubscriptions.find((item_30) => item_30.id === channel_15.id) || channel_15;
    playerView?.classList.remove('active', 'yt-char-live-mode');
    ytCharSpeechBubble &&
        ((ytCharSpeechBubble.innerHTML = ''), (ytCharSpeechBubble.style.display = 'none'));
    if (typeof window.releaseYtChatKeyboardLock === 'function') window.releaseYtChatKeyboardLock();
    currentVideoData = null;
    currentSubChannelData = canonicalChannel_2;
    const channelView = document.getElementById('sub-channel-view');
    if (channelView) channelView.classList.add('active');
    const tabsContainer = document.getElementById('sub-channel-tabs'),
        liveTab = tabsContainer?.querySelector('.yt-sliding-tab[data-target="live"]');
    if (tabsContainer && liveTab) {
        tabsContainer
            .querySelectorAll('.yt-sliding-tab')
            .forEach((tab) => tab.classList.remove('active'));
        liveTab.classList.add('active');
        const indicator = tabsContainer.querySelector('.yt-tab-indicator');
        if (indicator && typeof updateSlidingIndicator === 'function')
            updateSlidingIndicator(liveTab, indicator);
    }
    renderGeneratedContent('live');
    if (window.showToast) window.showToast('直播已结束并保存到往期视频');
}
actionEndLive &&
    actionEndLive.addEventListener('click', (event_524) => {
        event_524.stopPropagation();
        if (playerActionMenu) playerActionMenu.classList.remove('active');
        if (!currentVideoData?.isLive || currentVideoData?.channelData?.id === 'user_channel_id') {
            if (window.showToast) window.showToast('仅在 Char 直播时可用');
            return;
        }
        window.showCustomModal
            ? window.showCustomModal({
                  title: '结束直播',
                  message: '确定结束当前直播吗？直播内容和实时评论会保存到往期视频。',
                  confirmText: '结束直播',
                  cancelText: '取消',
                  isDestructive: true,
                  onConfirm: finishCurrentYtCharLive,
              })
            : finishCurrentYtCharLive();
    });
actionSummary &&
    actionSummary.addEventListener('click', async (e_8) => {
        e_8.stopPropagation();
        if (playerActionMenu) playerActionMenu.classList.remove('active');
        if (currentVideoData && currentVideoData.isLive) {
            if (window.showToast) window.showToast('正在生成并保存直播总结...');
            await generateLiveSummary();
        } else {
            if (window.showToast) window.showToast('仅在直播时可用');
        }
    });
const ytGiftBtn = document.getElementById('yt-gift-btn'),
    ytScSheet = document.getElementById('yt-sc-sheet'),
    ytScCloseBtn = document.getElementById('yt-sc-close-btn'),
    scAmountBtns = document.querySelectorAll('.sc-amount-btn'),
    ytScCustomInput = document.getElementById('yt-sc-custom-amount'),
    ytScInput = document.getElementById('yt-sc-input'),
    ytSendScBtn = document.getElementById('yt-send-sc-btn');
let currentScAmount = 30,
    currentScColor = getYtSuperChatTier(currentScAmount).color;
function applyYtSuperChatTheme(value_526) {
    const ytSuperChatTier_527 = getYtSuperChatTier(value_526);
    return ((currentScColor = ytSuperChatTier_527.color), ytSuperChatTier_527);
}
applyYtSuperChatTheme(currentScAmount);
ytGiftBtn &&
    ytScSheet &&
    (ytGiftBtn.addEventListener('click', () => {
        applyYtSuperChatTheme(currentScAmount);
        ytScSheet.classList.add('active');
    }),
    ytScSheet.addEventListener('mousedown', (e_9) => {
        if (e_9.target === ytScSheet) {
            if (ytScCustomInput && document.activeElement === ytScCustomInput)
                ytScCustomInput.blur();
            if (ytScInput && document.activeElement === ytScInput) ytScInput.blur();
            ytScSheet.classList.remove('active');
        }
    }));
ytScCloseBtn?.addEventListener('click', () => {
    ytScCustomInput?.blur();
    ytScInput?.blur();
    ytScSheet?.classList.remove('active', 'keyboard-open');
});
function updateScBtn() {
    applyYtSuperChatTheme(currentScAmount);
    ytSendScBtn && (ytSendScBtn.textContent = '发送 ￥' + currentScAmount);
}
scAmountBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        scAmountBtns.forEach((b) => {
            b.classList.remove('selected');
            b.style.removeProperty('background');
            b.style.removeProperty('color');
        });
        btn.classList.add('selected');
        currentScAmount = btn.getAttribute('data-amount');
        if (ytScCustomInput) ytScCustomInput.value = '';
        updateScBtn();
    });
});
ytScCustomInput &&
    (ytScCustomInput.addEventListener('input', (event_529) => {
        const trim_530 = event_529.target.value.trim();
        trim_530 &&
            !isNaN(trim_530) &&
            ((currentScAmount = trim_530),
            scAmountBtns.forEach((element_531) => {
                element_531.classList.remove('selected');
                element_531.style.removeProperty('background');
                element_531.style.removeProperty('color');
            }),
            updateScBtn());
    }),
    ytScCustomInput.addEventListener('focus', () => {
        if (ytScSheet) ytScSheet.classList.add('keyboard-open');
    }),
    ytScCustomInput.addEventListener('blur', () => {
        if (ytScSheet) ytScSheet.classList.remove('keyboard-open');
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }));
ytScInput &&
    (ytScInput.addEventListener('focus', () => {
        if (ytScSheet) ytScSheet.classList.add('keyboard-open');
    }),
    ytScInput.addEventListener('blur', () => {
        if (ytScSheet) ytScSheet.classList.remove('keyboard-open');
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }));
ytSendScBtn &&
    ytSendScBtn.addEventListener('click', async () => {
        const text_10 = ytScInput ? ytScInput.value.trim() || '支持主播！' : '支持主播！',
            effectiveYtUser_7 = getCurrentYtViewer();
        addChatMessage(
            effectiveYtUser_7.name || '我',
            text_10,
            true,
            currentScAmount,
            currentScColor,
            false,
            'user',
        );
        if (ytScInput) ytScInput.value = '';
        if (ytScSheet) ytScSheet.classList.remove('active');
        if (currentVideoData && currentVideoData.isLive) {
            const responseObj_9 = await getCharResponse(text_10, true, currentScAmount);
            renderAiResponse(responseObj_9);
        }
    });
const btnGenerate = document.getElementById('yt-char-generate-btn'),
    loadingEl = document.getElementById('sub-channel-loading');
function setCharGenerateLoading(isLoading_3) {
    if (!btnGenerate) return;
    btnGenerate.classList.toggle('is-loading', isLoading_3);
    btnGenerate.setAttribute('aria-disabled', isLoading_3 ? 'true' : 'false');
    btnGenerate.innerHTML = isLoading_3
        ? '<i class="fas fa-spinner fa-spin"></i>'
        : '<i class="fas fa-search"></i>';
}
function renderGeneratedContent(value_536) {
    try {
        if (!subChannelContent) return;
        currentSubChannelData &&
            typeof window.ensureYtFixedCharFanGroup === 'function' &&
            window.ensureYtFixedCharFanGroup(currentSubChannelData);
        if (!currentSubChannelData || !currentSubChannelData.generatedContent) {
            subChannelContent.innerHTML =
                '<div style="text-align:center; padding: 30px; color:#8e8e93; font-size:14px;">点击右上角魔法棒生成内容</div>';
            return;
        }
        const data = currentSubChannelData.generatedContent;
        subChannelContent.innerHTML = '';
        if (value_536 === 'live' && data.currentLive) {
            const el_3 = document.createElement('div'),
                thumbUrl =
                    data.currentLive.thumbnail ||
                    'https://picsum.photos/seed/' + Math.random() + '/320/180?grayscale';
            el_3.innerHTML =
                `
                    <div class="yt-video-card yt-live-pin-card" style="margin: 16px;">
                        <div class="yt-video-thumbnail">
                            <img src="` +
                thumbUrl +
                `" alt="Live">
                            <div class="yt-live-badge"><i class="fas fa-broadcast-tower" style="font-size: 10px;"></i> LIVE</div>
                        </div>
                        <div class="yt-video-info" style="padding: 12px;">
                            <div class="yt-video-details">
                                <h3 class="yt-video-title">` +
                ytPlayerEscapeHtml(data.currentLive.title || '无标题') +
                `</h3>
                                ` +
                renderYtSecondaryTranslation(
                    data.currentLive.titleTranslationZh,
                    'yt-video-title-translation',
                ) +
                `
                                <p class="yt-video-meta">` +
                ytPlayerEscapeHtml(
                    getYtViewsDisplay(
                        {
                            ...data.currentLive,
                            isLive: true,
                        },
                        true,
                    ),
                ) +
                `</p>
                            </div>
                        </div>
                    </div>
                `;
            const cardEl = el_3.querySelector('.yt-video-card');
            cardEl &&
                cardEl.addEventListener('click', () => {
                    const videoObj = {
                        id: data.currentLive.id || '',
                        liveId: data.currentLive.id || '',
                        title: data.currentLive.title,
                        titleTranslationZh: data.currentLive.titleTranslationZh || '',
                        viewerCount: data.currentLive.viewerCount,
                        views: getYtViewsDisplay(
                            {
                                ...data.currentLive,
                                isLive: true,
                            },
                            true,
                        ),
                        thumbnail: thumbUrl,
                        isLive: true,
                        channelData: currentSubChannelData,
                        comments: data.currentLive.comments || [],
                        initialBubbles: data.currentLive.initialBubbles || [],
                        liveTranscript: data.currentLive.liveTranscript || [],
                        guest: data.currentLive.guest || null,
                    };
                    openVideoPlayer(videoObj);
                });
            subChannelContent.appendChild(el_3);
        } else {
            if (value_536 === 'past' && data.pastVideos && data.pastVideos.length > 0) {
                const listWrapper = document.createElement('div');
                listWrapper.className = 'yt-history-list';
                listWrapper.style.padding = '16px';
                let upgradedReplayMetadata = false;
                data.pastVideos.forEach((video_12) => {
                    if (!isYtLiveReplay(video_12)) return;
                    !video_12.isLiveReplay &&
                        ((video_12.isLiveReplay = true), (upgradedReplayMetadata = true));
                    !video_12.id &&
                        ((video_12.id = createYtLiveReplayId(currentSubChannelData.id)),
                        (upgradedReplayMetadata = true));
                    !Number.isFinite(Number(video_12.realtimeCommentCount)) &&
                        ((video_12.realtimeCommentCount = Array.isArray(video_12.comments)
                            ? video_12.comments.length
                            : 0),
                        (upgradedReplayMetadata = true));
                    !Array.isArray(video_12.liveTranscript) &&
                        ((video_12.liveTranscript = []), (upgradedReplayMetadata = true));
                });
                if (upgradedReplayMetadata && typeof saveYoutubeData === 'function')
                    saveYoutubeData();
                data.pastVideos.forEach((v_11, value_542) => {
                    const item_31 = document.createElement('div');
                    item_31.className = 'yt-history-item';
                    item_31.style.position = 'relative';
                    const value_544 =
                        v_11.thumbnail ||
                        'https://picsum.photos/seed/' + Math.random() + '/320/180?grayscale';
                    item_31.innerHTML =
                        `
                        <div class="yt-history-thumb">
                            <img src="` +
                        value_544 +
                        `" alt="VOD">
                            <div class="yt-history-time">` +
                        (Math.floor(Math.random() * 2) + 1) +
                        ':' +
                        String(Math.floor(Math.random() * 60)).padStart(2, '0') +
                        ':' +
                        String(Math.floor(Math.random() * 60)).padStart(2, '0') +
                        `</div>
                        </div>
                        <div class="yt-history-info">
                            <h3 class="yt-history-title">` +
                        ytPlayerEscapeHtml(v_11.title || '无标题') +
                        `</h3>
                            ` +
                        renderYtSecondaryTranslation(
                            v_11.titleTranslationZh,
                            'yt-video-title-translation',
                        ) +
                        `
                            <p class="yt-history-meta">` +
                        ytPlayerEscapeHtml(
                            getYtViewsDisplay(
                                {
                                    ...v_11,
                                    isLive: false,
                                },
                                false,
                            ),
                        ) +
                        ' • ' +
                        ytPlayerEscapeHtml(
                            v_11.time || Math.floor(Math.random() * 11) + 1 + '个月前',
                        ) +
                        `</p>
                        </div>
                    `;
                    item_31.addEventListener('click', (e_10) => {
                        const videoObj_2 = {
                            id: v_11.id || '',
                            isLiveReplay: !!v_11.isLiveReplay,
                            realtimeCommentCount: getYtReplayRealtimeCommentCount(v_11),
                            liveTranscript: Array.isArray(v_11.liveTranscript)
                                ? v_11.liveTranscript
                                : [],
                            time: v_11.time || '',
                            title: v_11.title,
                            titleTranslationZh: v_11.titleTranslationZh || '',
                            viewCount: v_11.viewCount,
                            views: getYtViewsDisplay(
                                {
                                    ...v_11,
                                    isLive: false,
                                },
                                false,
                            ),
                            thumbnail: item_31.querySelector('img').src,
                            isLive: false,
                            channelData: currentSubChannelData,
                            comments: v_11.comments || [],
                            guest: v_11.guest || null,
                        };
                        openVideoPlayer(videoObj_2);
                    });
                    listWrapper.appendChild(item_31);
                });
                subChannelContent.appendChild(listWrapper);
            } else {
                if (value_536 === 'community' && data.communityPosts) {
                    if (data.fanGroup) {
                        const isJoined_2 = data.fanGroup.isJoined || false,
                            btnBg = isJoined_2 ? '#e5e5e5' : '#000',
                            btnColor = isJoined_2 ? '#606060' : '#fff',
                            btnText = isJoined_2 ? '进入' : '加入',
                            groupEl = document.createElement('div');
                        groupEl.style.margin = '12px 16px 16px';
                        groupEl.style.padding = '12px';
                        groupEl.style.backgroundColor = '#f2f2f2';
                        groupEl.style.borderRadius = '12px';
                        groupEl.style.display = 'flex';
                        groupEl.style.alignItems = 'center';
                        groupEl.style.gap = '10px';
                        groupEl.style.cursor = 'pointer';
                        let text_552 = `
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: #f2f2f7; display: flex; justify-content: center; align-items: center; color: #8e8e93; ">
                            <i class="fas fa-users"></i>
                        </div>
                    `;
                        data.fanGroup.avatar &&
                            (text_552 =
                                `
                            <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden;  background: transparent;">
                                <img src="` +
                                data.fanGroup.avatar +
                                `" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                        `);
                        groupEl.innerHTML =
                            `
                        ` +
                            text_552 +
                            `
                        <div style="flex: 1;">
                            <div style="font-weight: 600; font-size: 14px;">` +
                            ytPlayerEscapeHtml(data.fanGroup.name || '粉丝群') +
                            `</div>
                            ` +
                            renderYtSecondaryTranslation(
                                data.fanGroup.nameTranslationZh,
                                'yt-fan-group-name-translation',
                            ) +
                            `
                            <div style="font-size: 12px; color: #606060;">` +
                            formatYtCharFanGroupMemberCount(data.fanGroup.memberCount) +
                            ` • 粉丝专属基地</div>
                        </div>
                        <div class="yt-fan-group-btn" style="background: ` +
                            btnBg +
                            '; color: ' +
                            btnColor +
                            '; padding: 6px 12px; border-radius: 16px; font-size: 12px; font-weight: 500; transition: all 0.2s;">' +
                            btnText +
                            `</div>
                    `;
                        groupEl.addEventListener('click', () => {
                            if (!data.fanGroup.isJoined) {
                                data.fanGroup.isJoined = true;
                                renderGeneratedContent('community');
                                saveYoutubeData();
                                if (typeof renderMessagesList === 'function') renderMessagesList();
                                if (window.showToast) window.showToast('已加入粉丝群！');
                            }
                            openFanGroupChat(data.fanGroup);
                        });
                        subChannelContent.appendChild(groupEl);
                    }
                    if (Array.isArray(data.communityPosts)) {
                        const documentFragment_553 = document.createDocumentFragment();
                        data.communityPosts.forEach((post_2) => {
                            const el_4 = document.createElement('div'),
                                syncedLikes =
                                    typeof window.syncYtPostLikeGrowth === 'function'
                                        ? window.syncYtPostLikeGrowth(post_2)
                                        : post_2.likes,
                                likeCount =
                                    typeof window.formatYtPostLikeCount === 'function'
                                        ? window.formatYtPostLikeCount(syncedLikes)
                                        : syncedLikes || '0',
                                commentCount =
                                    typeof window.countYtPostComments === 'function'
                                        ? window.countYtPostComments(post_2)
                                        : post_2.commentsCount || post_2.comments?.length || 0,
                                avatarUrl_2 =
                                    typeof resolveYtChannelAvatar === 'function'
                                        ? resolveYtChannelAvatar(currentSubChannelData)
                                        : currentSubChannelData.avatar || '';
                            el_4.className = 'yt-community-post';
                            el_4.style.cursor = 'pointer';
                            el_4.innerHTML =
                                `
                            <div style="display: flex; align-items: center; margin-bottom: 10px; gap: 10px;">
                                <div class="yt-video-avatar" style="width:36px; height:36px;"><img src="` +
                                avatarUrl_2 +
                                `" loading="lazy" decoding="async"></div>
                                <div style="flex:1;">
                                    <div style="font-size:14px; font-weight:500;">` +
                                (currentSubChannelData.name || '未知') +
                                `</div>
                                    <div style="font-size:11px; color:#606060;">` +
                                (post_2.time || '刚刚') +
                                `</div>
                                </div>
                            </div>
                            <div class="yt-community-post-content">` +
                                ytPlayerEscapeHtml(post_2.content || '') +
                                `</div>
                            <div class="yt-community-post-actions">
                                <div class="yt-community-post-action"><i class="far fa-thumbs-up"></i> ` +
                                likeCount +
                                `</div>
                                <div class="yt-community-post-action"><i class="far fa-thumbs-down"></i></div>
                                <div class="yt-community-post-action"><i class="far fa-comment"></i> ` +
                                commentCount +
                                `</div>
                            </div>
                        `;
                            el_4.addEventListener('click', () => {
                                openPostDetail(post_2);
                            });
                            documentFragment_553.appendChild(el_4);
                        });
                        subChannelContent.appendChild(documentFragment_553);
                    }
                } else
                    subChannelContent.innerHTML =
                        '<div style="text-align:center; padding: 30px; color:#8e8e93; font-size:14px;">暂无相关内容</div>';
            }
        }
        subChannelContent.querySelectorAll('img').forEach((value_560, value_561) => {
            value_560.loading = value_561 < 2 ? 'eager' : 'lazy';
            value_560.decoding = 'async';
        });
    } catch (e_11) {
        console.error('Error rendering content:', e_11);
    }
}
false &&
    btnGenerate &&
    btnGenerate.addEventListener('click', async (event_563) => {
        event_563.stopPropagation();
        if (btnGenerate.classList.contains('is-loading')) return;
        if (!currentSubChannelData) return;
        if (!window.apiConfig || !window.apiConfig.endpoint || !window.apiConfig.apiKey) {
            if (window.showToast) window.showToast('请先在设置中配置大模型 API');
            return;
        }
        typeof mergeYtChannelIntoSubscriptions === 'function' &&
            (currentSubChannelData =
                mergeYtChannelIntoSubscriptions(currentSubChannelData, {
                    save: true,
                    preferExistingSubscription: true,
                }) || currentSubChannelData);
        setCharGenerateLoading(true);
        if (subChannelContent) subChannelContent.innerHTML = '';
        if (loadingEl) loadingEl.style.display = 'block';
        let content_6 =
            '你是一个YouTube内容生成助手。现在有一个YouTuber，她的频道名称是："' +
            currentSubChannelData.name +
            '"，她的人设和简介是："' +
            (currentSubChannelData.desc || '未知') +
            `"。
请你根据挂载的世界书，她的设定，生成符合她身份人设风格的内容，具有活人感，返回严格的JSON格式数据。
要求JSON包含以下字段：
1. currentLive: 对象，包含:
   - title(直播标题原文)
   - titleTranslationZh(title 的自然中文翻译或空字符串)
   - viewerCount(当前观看人数，必须是纯整数，例如 15000；禁止附加任何语言文字)
   - initialBubbles: 对象数组，每项为 {"text":"主播原话","translationZh":"中文翻译或空字符串"}，模拟刚进入直播间时主播正在说的话（3-5句开场白或正在进行的话题）。
   - comments: 数组，包含5-10个对象，每个对象有 name(观众昵称)、text(弹幕原文) 和 translationZh(中文翻译或空字符串)。
2. pastVideos: 数组，包含3个对象，每个对象有:
   - title(往期视频标题原文)
   - titleTranslationZh(title 的自然中文翻译或空字符串)
   - viewCount(观看次数，必须是纯整数，例如 450000；禁止附加任何语言文字)
   - time(发布时间，如"2天前")
   - comments: 数组，包含3-5个对象，每个对象有 name(观众昵称)、text(评论原文) 和 translationZh(中文翻译或空字符串)。
3. communityPosts: 数组，包含1-3个对象，每个对象代表一条YouTube社区动态，有:
   - content(动态正文内容，符合人设，具有活人感，禁止使用emoji)
   - translationZh(content 的自然中文翻译；content 是中文时必须为空字符串)
   - likes(点赞数字符串，如"3.2万")
   - commentsCount(评论数，如"1400")
   - time(发布时间，如"5小时前")
   - comments: 数组，包含3-5个对象，代表这条动态下的热门评论，每个对象有 name(观众昵称)、text(评论原文) 和 translationZh(中文翻译或空字符串)。
4. fanGroup: 对象，包含 name(粉丝群名称原文，如"xx的秘密基地")、nameTranslationZh(name 的自然中文翻译或空字符串) 和 memberCount(群人数，如"3000人")。
注意：YouTube 是国际化平台。社群动态正文 content 和评论 text 不是中文时，对应 translationZh 必须提供自然中文翻译；如果原文是中文，translationZh 必须为空字符串。只能返回纯 JSON，不要包含 Markdown 符号如 \`\`\`json。`;
        typeof window.buildYtLocalizedJsonContract === 'function' &&
            (content_6 += window.buildYtLocalizedJsonContract(
                currentSubChannelData,
                'currentLive.title, every currentLive.initialBubbles item, every pastVideos.title, every communityPosts.content, and fanGroup.name',
            ));
        content_6 += `

【最高优先级：观众评论国际化协议】角色本人创作的标题、主播发言和社区正文继续跟随角色默认语言；currentLive.comments、pastVideos[].comments 和 communityPosts[].comments 必须模拟来自世界各地的真实 YouTube 观众，绝对不能全部跟随角色默认语言。每组评论要混合英语、日语、韩语、法语、西班牙语及其他自然语言，评论不少于 5 条时至少包含 3 种语言，且至少一半为非中文评论；昵称必须符合对应国家或地区。每条评论严格返回 {"name":"viewer name","text":"观众自己的语言原文","translationZh":"自然准确的简体中文翻译或空字符串"}；text 非中文时 translationZh 必须填写，text 中文时必须为空字符串。此协议覆盖上方任何要求观众评论跟随角色默认语言的内容。`;
        content_6 += `

【UI 指标固定规则】viewerCount、viewCount 只能返回非负纯整数；观看人数、观看次数、发布时间等 UI 指标不受角色默认语言影响，禁止翻译或添加外语单位，中文展示单位由前端生成。`;
        const value_565 = window.getYtWorldBookContext
            ? window.getYtWorldBookContext(
                  (currentSubChannelData.name || '') +
                      `
` +
                      (currentSubChannelData.desc || ''),
              )
            : '';
        content_6 +=
            `

世界书内容：
` + (value_565 || '无');
        try {
            const chatCompletionsEndpoint_566 = window.u2Api.resolveChatCompletionsEndpoint(
                    window.apiConfig.endpoint,
                ),
                value_567 = await fetch(chatCompletionsEndpoint_566, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + window.apiConfig.apiKey,
                    },
                    body: JSON.stringify({
                        model: window.apiConfig.model || 'gpt-3.5-turbo',
                        messages: [
                            {
                                role: 'user',
                                content: content_6,
                            },
                        ],
                        temperature: 0.7,
                        response_format: {
                            type: 'json_object',
                        },
                    }),
                });
            if (!value_567.ok)
                throw (
                    window.u2Api?.createHttpError?.(
                        value_567,
                        await window.u2Api?.readApiError?.(value_567),
                    ) ||
                    Object.assign(new Error('HTTP ' + value_567.status), {
                        status: value_567.status,
                    })
                );
            const value_568 = await value_567.json();
            let content_569 = value_568.choices[0].message.content;
            content_569 = content_569
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim();
            const parsedData = sanitizeObj(JSON.parse(content_569));
            !currentSubChannelData.generatedContent &&
                (currentSubChannelData.generatedContent = {
                    pastVideos: [],
                    communityPosts: [],
                });
            const oldGen = currentSubChannelData.generatedContent;
            oldGen.currentLive && archiveYtCurrentCharLive(currentSubChannelData);
            if (parsedData.currentLive) {
                const localizedTitle = getYtPlayerLocalizedContent(
                    {
                        text: parsedData.currentLive.title,
                        translationZh: parsedData.currentLive.titleTranslationZh,
                    },
                    currentSubChannelData,
                );
                parsedData.currentLive.title = localizedTitle.text;
                parsedData.currentLive.titleTranslationZh = localizedTitle.translationZh;
                parsedData.currentLive.viewerCount = Math.max(
                    0,
                    Math.round(Number(parsedData.currentLive.viewerCount) || 0),
                );
                parsedData.currentLive.views = getYtViewsDisplay(
                    {
                        ...parsedData.currentLive,
                        isLive: true,
                    },
                    true,
                );
                parsedData.currentLive.thumbnail =
                    parsedData.currentLive.thumbnail ||
                    'https://picsum.photos/seed/' +
                        encodeURIComponent(currentSubChannelData.id + '_live_' + Date.now()) +
                        '/320/180?grayscale';
                parsedData.currentLive.comments = Array.isArray(parsedData.currentLive.comments)
                    ? parsedData.currentLive.comments
                          .map((comment_9) =>
                              normalizeYtGeneratedComment(comment_9, currentSubChannelData),
                          )
                          .filter((comment_10) => comment_10.text)
                    : [];
                parsedData.currentLive.initialBubbles = Array.isArray(
                    parsedData.currentLive.initialBubbles,
                )
                    ? parsedData.currentLive.initialBubbles
                          .map((bubble_3) =>
                              normalizeYtGeneratedBubble(bubble_3, currentSubChannelData),
                          )
                          .filter(Boolean)
                    : [];
                parsedData.currentLive.liveTranscript = Array.isArray(
                    parsedData.currentLive.liveTranscript,
                )
                    ? parsedData.currentLive.liveTranscript
                          .map((item_32, index_9) =>
                              normalizeYtReplayTranscriptItem(item_32, index_9),
                          )
                          .filter((item_33) => item_33.text)
                    : createYtReplayTranscriptFromBubbles(parsedData.currentLive.initialBubbles);
            }
            oldGen.currentLive = parsedData.currentLive;
            if (parsedData.pastVideos) {
                if (!oldGen.pastVideos) oldGen.pastVideos = [];
                const normalizedPastVideos = parsedData.pastVideos.map((video_13, value_583) => {
                    const ytPlayerLocalizedContent_584 = getYtPlayerLocalizedContent(
                        {
                            text: video_13.title,
                            translationZh: video_13.titleTranslationZh,
                        },
                        currentSubChannelData,
                    );
                    return {
                        ...video_13,
                        title: ytPlayerLocalizedContent_584.text,
                        titleTranslationZh: ytPlayerLocalizedContent_584.translationZh,
                        viewCount: Math.max(0, Math.round(Number(video_13.viewCount) || 0)),
                        views: getYtViewsDisplay(
                            {
                                ...video_13,
                                viewCount: Math.max(0, Math.round(Number(video_13.viewCount) || 0)),
                                isLive: false,
                            },
                            false,
                        ),
                        thumbnail:
                            video_13.thumbnail ||
                            'https://picsum.photos/seed/' +
                                encodeURIComponent(
                                    currentSubChannelData.id +
                                        '_past_' +
                                        Date.now() +
                                        '_' +
                                        value_583,
                                ) +
                                '/320/180?grayscale',
                        comments: Array.isArray(video_13.comments)
                            ? video_13.comments
                                  .map((value_585) =>
                                      normalizeYtGeneratedComment(value_585, currentSubChannelData),
                                  )
                                  .filter((value_586) => value_586.text)
                            : [],
                    };
                });
                oldGen.pastVideos = normalizedPastVideos.concat(oldGen.pastVideos);
            }
            if (parsedData.communityPosts) {
                if (!oldGen.communityPosts) oldGen.communityPosts = [];
                const normalizedCommunityPosts = parsedData.communityPosts.map((post) => {
                    const localizedContent = getYtPlayerLocalizedContent(
                        {
                            text: post.content,
                            translationZh:
                                post.translationZh || post.contentTranslationZh || post.translation,
                        },
                        currentSubChannelData,
                    );
                    return {
                        ...post,
                        content: localizedContent.text,
                        translationZh: localizedContent.translationZh,
                        lastLikeGrowthAt: Number(post.lastLikeGrowthAt) || Date.now(),
                        comments: Array.isArray(post.comments)
                            ? post.comments
                                  .map((comment_11) =>
                                      normalizeYtGeneratedComment(
                                          comment_11,
                                          currentSubChannelData,
                                      ),
                                  )
                                  .filter((comment_12) => comment_12.text)
                            : [],
                    };
                });
                oldGen.communityPosts = normalizedCommunityPosts.concat(oldGen.communityPosts);
            }
            if (parsedData.fanGroup) {
                const localizedGroupName = getYtPlayerLocalizedContent(
                    {
                        text: parsedData.fanGroup.name,
                        translationZh: parsedData.fanGroup.nameTranslationZh,
                    },
                    currentSubChannelData,
                );
                parsedData.fanGroup.name = localizedGroupName.text;
                parsedData.fanGroup.nameTranslationZh = localizedGroupName.translationZh;
                oldGen.fanGroup &&
                    ((parsedData.fanGroup.isJoined = oldGen.fanGroup.isJoined),
                    oldGen.fanGroup.name &&
                        ((parsedData.fanGroup.name = oldGen.fanGroup.name),
                        (parsedData.fanGroup.nameTranslationZh =
                            oldGen.fanGroup.nameTranslationZh || '')));
                oldGen.fanGroup = parsedData.fanGroup;
            }
            typeof mergeYtChannelIntoSubscriptions === 'function' &&
                (currentSubChannelData =
                    mergeYtChannelIntoSubscriptions(currentSubChannelData, {
                        save: false,
                        preferExistingSubscription: true,
                    }) || currentSubChannelData);
            saveYoutubeData();
            if (parsedData.currentLive) {
                const newLiveVideo = {
                    title: parsedData.currentLive.title,
                    titleTranslationZh: parsedData.currentLive.titleTranslationZh || '',
                    viewerCount: parsedData.currentLive.viewerCount,
                    views: getYtViewsDisplay(
                        {
                            ...parsedData.currentLive,
                            isLive: true,
                        },
                        true,
                    ),
                    time: 'LIVE',
                    thumbnail:
                        parsedData.currentLive.thumbnail ||
                        'https://picsum.photos/seed/' + Math.random() + '/320/180?grayscale',
                    isLive: true,
                    comments: parsedData.currentLive.comments,
                    initialBubbles: parsedData.currentLive.initialBubbles || [],
                    guest: parsedData.currentLive.guest || null,
                    channelData: currentSubChannelData,
                };
                mockVideos = mockVideos.filter(
                    (v_12) => v_12.channelData.id !== currentSubChannelData.id,
                );
                mockVideos.unshift(newLiveVideo);
                renderVideos();
            }
            if (loadingEl) loadingEl.style.display = 'none';
            setCharGenerateLoading(false);
            const activeTab_2 = document.querySelector('#sub-channel-tabs .yt-sliding-tab.active'),
                target_4 = activeTab_2 ? activeTab_2.getAttribute('data-target') : 'live';
            renderGeneratedContent(target_4);
            if (window.showToast) window.showToast('内容生成成功并已保存！');
        } catch (value_593) {
            console.error(value_593);
            if (loadingEl) loadingEl.style.display = 'none';
            setCharGenerateLoading(false);
            if (window.u2Api?.isRequestError?.(value_593))
                window.u2Api.reportError(value_593, {
                    operation: '频道内容生成',
                });
            else {
                if (subChannelContent)
                    subChannelContent.innerHTML =
                        '<div style="text-align:center; padding: 30px; color:#ff3b30; font-size:14px;">生成失败，请检查 API 配置或网络</div>';
            }
        }
    });
const ytCharGenerateModal = document.getElementById('yt-char-generate-modal'),
    ytCharGenerateModalTitle = document.getElementById('yt-char-generate-modal-title'),
    ytCharGenerateModalClose = document.getElementById('yt-char-generate-modal-close'),
    ytCharGenerateRequirementLabel = document.getElementById('yt-char-generate-requirement-label'),
    ytCharGenerateRequirement = document.getElementById('yt-char-generate-requirement'),
    ytCharGenerateCountRow = document.getElementById('yt-char-generate-count-row'),
    ytCharGenerateCount = document.getElementById('yt-char-generate-count'),
    ytCharGenerateModalStatus = document.getElementById('yt-char-generate-modal-status'),
    ytCharGenerateConfirm = document.getElementById('yt-char-generate-confirm');
let ytCharGenerateMode = 'live',
    ytCharGenerateRequestActive = false;
function getActiveYtCharGenerationTab() {
    return (
        document
            .querySelector('#sub-channel-tabs .yt-sliding-tab.active')
            ?.getAttribute('data-target') || 'live'
    );
}
function clampYtCharGenerationCount(value_21) {
    return Math.max(1, Math.min(10, Math.round(Number(value_21) || 3)));
}
function setYtCharGenerationModalLoading(isLoading_4) {
    ytCharGenerateRequestActive = !!isLoading_4;
    setCharGenerateLoading(isLoading_4);
    ytCharGenerateConfirm &&
        ((ytCharGenerateConfirm.disabled = !!isLoading_4),
        (ytCharGenerateConfirm.innerHTML = isLoading_4
            ? '<i class="fas fa-circle-notch fa-spin"></i> 生成中'
            : ytCharGenerateMode === 'live'
              ? '开始直播'
              : ytCharGenerateMode === 'past'
                ? '生成往期视频'
                : '生成帖子'));
    if (ytCharGenerateModalClose) ytCharGenerateModalClose.disabled = !!isLoading_4;
}
function closeYtCharGenerationModal() {
    if (ytCharGenerateRequestActive) return;
    ytCharGenerateModal?.classList.remove('active');
}
function openYtCharGenerationModal(mode_2 = getActiveYtCharGenerationTab()) {
    if (!ytCharGenerateModal || !currentSubChannelData) return;
    ytCharGenerateMode = ['live', 'past', 'community'].includes(mode_2) ? mode_2 : 'live';
    const config = {
        live: {
            title: '开始直播',
            label: '直播内容',
            placeholder: '想让 Char 直播什么？可留空自由发挥',
            action: '开始直播',
        },
        past: {
            title: '生成往期视频',
            label: '视频内容或要求',
            placeholder: '可填写视频主题、风格或其他要求',
            action: '生成往期视频',
        },
        community: {
            title: '生成社区帖子',
            label: '帖子内容或要求',
            placeholder: '可填写想发布的话题或内容方向',
            action: '生成帖子',
        },
    }[ytCharGenerateMode];
    if (ytCharGenerateModalTitle) ytCharGenerateModalTitle.textContent = config.title;
    if (ytCharGenerateRequirementLabel) ytCharGenerateRequirementLabel.textContent = config.label;
    ytCharGenerateRequirement &&
        ((ytCharGenerateRequirement.value = ''),
        (ytCharGenerateRequirement.placeholder = config.placeholder));
    if (ytCharGenerateCountRow)
        ytCharGenerateCountRow.style.display = ytCharGenerateMode === 'live' ? 'none' : 'flex';
    if (ytCharGenerateCount) ytCharGenerateCount.value = '3';
    const value_598 =
        ytCharGenerateMode === 'live' && !!currentSubChannelData.generatedContent?.currentLive;
    ytCharGenerateModalStatus &&
        ((ytCharGenerateModalStatus.textContent = value_598
            ? '当前正在直播，请先进入直播间结束本场直播。'
            : ''),
        ytCharGenerateModalStatus.classList.toggle('is-error', value_598));
    ytCharGenerateConfirm &&
        ((ytCharGenerateConfirm.textContent = config.action),
        (ytCharGenerateConfirm.disabled = value_598));
    ytCharGenerateModal.classList.add('active');
    setTimeout(() => ytCharGenerateRequirement?.focus(), 80);
}
function getYtCharGenerationWorldBookContext(contextText = '') {
    return window.getYtWorldBookContext ? window.getYtWorldBookContext(contextText) : '';
}
function buildYtCharTabGenerationPrompt(value_599, requirement, value_601) {
    const channel_16 = currentSubChannelData,
        value_603 =
            typeof window.getYtChannelPersonaWithRelationships === 'function'
                ? window.getYtChannelPersonaWithRelationships(channel_16)
                : channel_16.desc || '未知',
        userRequirement = requirement || '无额外要求，请根据角色人设自然发挥',
        value_605 =
            '频道名称：' +
            channel_16.name +
            `
角色人设：` +
            value_603 +
            `
世界书：` +
            (getYtCharGenerationWorldBookContext(
                channel_16.name +
                    `
` +
                    value_603 +
                    `
` +
                    userRequirement,
            ) || '无') +
            `
用户本次要求：` +
            userRequirement;
    let prompt = '';
    if (value_599 === 'live') {
        prompt =
            '你是 YouTube Char 直播生成助手。' +
            value_605 +
            `
只生成一场新直播，返回 {"currentLive":{"title":"直播标题原文","titleTranslationZh":"中文翻译或空字符串","viewerCount":15000,"initialBubbles":[{"text":"主播原话","translationZh":"中文翻译或空字符串"}],"comments":[{"name":"观众昵称","text":"评论原文","translationZh":"中文翻译或空字符串"}]}}。initialBubbles 生成 3–5 条，comments 生成 6–10 条。`;
        typeof window.buildYtLocalizedJsonContract === 'function' &&
            (prompt += window.buildYtLocalizedJsonContract(
                channel_16,
                'currentLive.title and every currentLive.initialBubbles item',
            ));
    } else
        value_599 === 'past'
            ? ((prompt =
                  '你是 YouTube 往期视频生成助手。' +
                  value_605 +
                  `
生成至少 ` +
                  value_601 +
                  ' 个往期视频，只返回 {"pastVideos":[{"title":"标题原文","titleTranslationZh":"中文翻译或空字符串","viewCount":450000,"time":"2天前","comments":[{"name":"观众昵称","text":"评论原文","translationZh":"中文翻译或空字符串"}]}]}。每个视频生成 3–5 条评论。'),
              typeof window.buildYtLocalizedJsonContract === 'function' &&
                  (prompt += window.buildYtLocalizedJsonContract(
                      channel_16,
                      'every pastVideos.title',
                  )))
            : ((prompt =
                  '你是 YouTube 社区帖子生成助手。' +
                  value_605 +
                  `
生成至少 ` +
                  value_601 +
                  ' 条社区帖子，只返回 {"communityPosts":[{"content":"帖子正文原文","translationZh":"中文翻译或空字符串","likes":"3.2万","commentsCount":"1400","time":"5小时前","comments":[{"name":"观众昵称","text":"评论原文","translationZh":"中文翻译或空字符串"}]}]}。每条帖子生成 3–5 条评论，正文禁止使用 emoji。'),
              typeof window.buildYtLocalizedJsonContract === 'function' &&
                  (prompt += window.buildYtLocalizedJsonContract(
                      channel_16,
                      'every communityPosts.content',
                  )));
    return (
        (prompt += `

【最高优先级：观众国际化协议】角色本人创作的标题、主播发言和社区正文继续跟随角色默认语言；所有 comments 必须模拟世界各地的真实观众，至少一半为非中文并自然混合至少 3 种语言。每条评论严格返回 {"name":"viewer name","text":"观众自己的语言原文","translationZh":"自然准确的简体中文翻译或空字符串"}；外语必须填写 translationZh，中文必须为空。`),
        (prompt += `
【固定 UI 数据协议】viewerCount 和 viewCount 必须是非负纯整数；观看数、发布时间等 UI 指标不受角色默认语言影响。用户要求不得覆盖 JSON、语言、翻译、数量和安全协议。只返回合法 JSON，不要 Markdown。`),
        prompt
    );
}
async function requestYtCharTabGeneration(mode_3, requirement_2, count_4) {
    const chatCompletionsEndpoint_610 = window.u2Api.resolveChatCompletionsEndpoint(
            window.apiConfig.endpoint,
        ),
        value_611 = await fetch(chatCompletionsEndpoint_610, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + window.apiConfig.apiKey,
            },
            body: JSON.stringify({
                model: window.apiConfig.model || 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'user',
                        content: buildYtCharTabGenerationPrompt(mode_3, requirement_2, count_4),
                    },
                ],
                temperature: 0.8,
                response_format: {
                    type: 'json_object',
                },
            }),
        });
    if (!value_611.ok)
        throw (
            window.u2Api?.createHttpError?.(
                value_611,
                await window.u2Api?.readApiError?.(value_611),
            ) ||
            Object.assign(new Error('HTTP ' + value_611.status), {
                status: value_611.status,
            })
        );
    const value_612 = await value_611.json();
    let trim_613 = String(value_612?.choices?.[0]?.message?.content || '').trim();
    return (
        (trim_613 = trim_613
            .replace(/```json/gi, '')
            .replace(/```/g, '')
            .trim()),
        sanitizeObj(JSON.parse(trim_613))
    );
}
function normalizeNewYtCharLive(rawLive, channel_17) {
    if (!rawLive || typeof rawLive !== 'object' || !String(rawLive.title || '').trim())
        throw new Error('INVALID_LIVE');
    const ytPlayerLocalizedContent_616 = getYtPlayerLocalizedContent(
            {
                text: rawLive.title,
                translationZh: rawLive.titleTranslationZh,
            },
            channel_17,
        ),
        live_3 = {
            ...rawLive,
            id: createYtCharLiveId(channel_17.id),
            title: ytPlayerLocalizedContent_616.text,
            titleTranslationZh: ytPlayerLocalizedContent_616.translationZh,
            viewerCount: Math.max(0, Math.round(Number(rawLive.viewerCount) || 0)),
            thumbnail:
                rawLive.thumbnail ||
                'https://picsum.photos/seed/' +
                    encodeURIComponent(channel_17.id + '_live_' + Date.now()) +
                    '/320/180?grayscale',
            comments: Array.isArray(rawLive.comments)
                ? rawLive.comments
                      .map((value_618) => normalizeYtGeneratedComment(value_618, channel_17))
                      .filter((value_619) => value_619.text)
                : [],
            initialBubbles: Array.isArray(rawLive.initialBubbles)
                ? rawLive.initialBubbles
                      .map((bubble_4) => normalizeYtGeneratedBubble(bubble_4, channel_17))
                      .filter(Boolean)
                : [],
        };
    return (
        (live_3.views = getYtViewsDisplay(
            {
                ...live_3,
                isLive: true,
            },
            true,
        )),
        (live_3.liveTranscript = createYtReplayTranscriptFromBubbles(live_3.initialBubbles)),
        live_3
    );
}
function normalizeNewYtPastVideos(value_621, channel_18, value_623) {
    const items_624 = Array.isArray(value_621) ? value_621 : [],
        filter_625 = items_624
            .map((video_14, value_627) => {
                const localizedTitle_2 = getYtPlayerLocalizedContent(
                    {
                        text: video_14?.title,
                        translationZh: video_14?.titleTranslationZh,
                    },
                    channel_18,
                );
                if (!localizedTitle_2.text) return null;
                const viewCount_2 = Math.max(0, Math.round(Number(video_14?.viewCount) || 0));
                return {
                    ...video_14,
                    id:
                        'yt-past-' +
                        channel_18.id +
                        '-' +
                        Date.now() +
                        '-' +
                        value_627 +
                        '-' +
                        Math.random().toString(36).slice(2, 7),
                    title: localizedTitle_2.text,
                    titleTranslationZh: localizedTitle_2.translationZh,
                    viewCount: viewCount_2,
                    views: getYtViewsDisplay(
                        {
                            ...video_14,
                            viewCount: viewCount_2,
                            isLive: false,
                        },
                        false,
                    ),
                    thumbnail:
                        video_14?.thumbnail ||
                        'https://picsum.photos/seed/' +
                            encodeURIComponent(
                                channel_18.id + '_past_' + Date.now() + '_' + value_627,
                            ) +
                            '/320/180?grayscale',
                    comments: Array.isArray(video_14?.comments)
                        ? video_14.comments
                              .map((value_630) =>
                                  normalizeYtGeneratedComment(value_630, channel_18),
                              )
                              .filter((value_631) => value_631.text)
                        : [],
                };
            })
            .filter(Boolean);
    if (filter_625.length < value_623) throw new Error('INSUFFICIENT_RESULTS');
    return filter_625.slice(0, value_623);
}
function normalizeNewYtCommunityPosts(value_632, channel_19, value_634) {
    const items_635 = Array.isArray(value_632) ? value_632 : [],
        filter_636 = items_635
            .map((post_3, value_638) => {
                const localizedContent_2 = getYtPlayerLocalizedContent(
                    {
                        text: post_3?.content,
                        translationZh: post_3?.translationZh || post_3?.contentTranslationZh,
                    },
                    channel_19,
                );
                if (!localizedContent_2.text) return null;
                return {
                    ...post_3,
                    id:
                        'yt-post-' +
                        channel_19.id +
                        '-' +
                        Date.now() +
                        '-' +
                        value_638 +
                        '-' +
                        Math.random().toString(36).slice(2, 7),
                    content: localizedContent_2.text,
                    translationZh: localizedContent_2.translationZh,
                    lastLikeGrowthAt: Date.now(),
                    comments: Array.isArray(post_3?.comments)
                        ? post_3.comments
                              .map((value_640) =>
                                  normalizeYtGeneratedComment(value_640, channel_19),
                              )
                              .filter((value_641) => value_641.text)
                        : [],
                };
            })
            .filter(Boolean);
    if (filter_636.length < value_634) throw new Error('INSUFFICIENT_RESULTS');
    return filter_636.slice(0, value_634);
}
function openNewYtCharLive(live_4, channel_20) {
    const video_15 = {
        id: live_4.id,
        title: live_4.title,
        titleTranslationZh: live_4.titleTranslationZh || '',
        viewerCount: live_4.viewerCount,
        views: getYtViewsDisplay(
            {
                ...live_4,
                isLive: true,
            },
            true,
        ),
        time: 'LIVE',
        thumbnail: live_4.thumbnail,
        isLive: true,
        comments: live_4.comments,
        initialBubbles: live_4.initialBubbles,
        liveTranscript: live_4.liveTranscript,
        guest: live_4.guest || null,
        channelData: channel_20,
    };
    mockVideos = mockVideos.filter(
        (item_34) => !(item_34?.isLive && item_34?.channelData?.id === channel_20.id),
    );
    mockVideos.unshift(video_15);
    if (typeof renderVideos === 'function') renderVideos();
    openVideoPlayer(video_15);
}
function resolveYtCharGenerationChannel(channelId_4, fallbackChannel = null) {
    const canonical = (Array.isArray(mockSubscriptions) ? mockSubscriptions : []).find(
        (item_35) => String(item_35?.id) === String(channelId_4),
    );
    return (
        canonical ||
        (currentSubChannelData && String(currentSubChannelData.id) === String(channelId_4)
            ? currentSubChannelData
            : null) ||
        fallbackChannel
    );
}
function refreshYtCharGeneratedContentUi(channelId_5, mode, fallbackChannel_2 = null) {
    const canonicalChannel = resolveYtCharGenerationChannel(channelId_5, fallbackChannel_2);
    if (!canonicalChannel) return null;
    currentSubChannelData = canonicalChannel;
    setYtCharGenerationModalLoading(false);
    ytCharGenerateModal?.classList.remove('active');
    renderGeneratedContent(mode);
    if (typeof renderVideos === 'function') renderVideos();
    return canonicalChannel;
}
async function submitYtCharTabGeneration() {
    if (ytCharGenerateRequestActive || !currentSubChannelData) return;
    if (!window.apiConfig || !window.apiConfig.endpoint || !window.apiConfig.apiKey) {
        if (window.showToast) window.showToast('请先在设置中配置大模型 API');
        return;
    }
    if (ytCharGenerateMode === 'live' && currentSubChannelData.generatedContent?.currentLive) {
        if (
            window.u2Api?.isRequestError?.(error) &&
            window.u2Api.reportError(error, {
                operation: '频道内容生成',
            })
        ) {
            if (ytCharGenerateModalStatus) ytCharGenerateModalStatus.textContent = '';
        } else
            ytCharGenerateModalStatus &&
                ((ytCharGenerateModalStatus.textContent =
                    '当前正在直播，请先进入直播间结束本场直播。'),
                ytCharGenerateModalStatus.classList.add('is-error'));
        return;
    }
    const count_5 = clampYtCharGenerationCount(ytCharGenerateCount?.value);
    if (ytCharGenerateCount) ytCharGenerateCount.value = String(count_5);
    const requirement_3 = String(ytCharGenerateRequirement?.value || '').trim(),
        requestMode = ytCharGenerateMode,
        requestChannel = currentSubChannelData;
    setYtCharGenerationModalLoading(true);
    ytCharGenerateModalStatus &&
        ((ytCharGenerateModalStatus.textContent = '正在生成，请稍候…'),
        ytCharGenerateModalStatus.classList.remove('is-error'));
    try {
        const result_2 = await requestYtCharTabGeneration(requestMode, requirement_3, count_5);
        if (currentSubChannelData?.id !== requestChannel.id) throw new Error('STALE_CHANNEL');
        const channel_21 = resolveYtCharGenerationChannel(requestChannel.id, requestChannel);
        if (!channel_21) throw new Error('STALE_CHANNEL');
        if (typeof window.ensureYtFixedCharFanGroup === 'function')
            window.ensureYtFixedCharFanGroup(channel_21);
        const generatedContent_3 = channel_21.generatedContent;
        if (requestMode === 'live') {
            const live_5 = normalizeNewYtCharLive(result_2?.currentLive, channel_21);
            generatedContent_3.currentLive = live_5;
            channel_21.isLive = true;
            saveYoutubeData();
            const canonicalChannel_3 =
                refreshYtCharGeneratedContentUi(channel_21.id, 'live', channel_21) || channel_21;
            openNewYtCharLive(
                canonicalChannel_3.generatedContent?.currentLive || live_5,
                canonicalChannel_3,
            );
            if (window.showToast) window.showToast('直播已开始');
            return;
        }
        if (requestMode === 'past') {
            const videos = normalizeNewYtPastVideos(result_2?.pastVideos, channel_21, count_5);
            generatedContent_3.pastVideos = videos.concat(generatedContent_3.pastVideos || []);
        } else {
            const posts = normalizeNewYtCommunityPosts(
                result_2?.communityPosts,
                channel_21,
                count_5,
            );
            generatedContent_3.communityPosts = posts.concat(
                generatedContent_3.communityPosts || [],
            );
        }
        saveYoutubeData();
        refreshYtCharGeneratedContentUi(channel_21.id, requestMode, channel_21);
        if (window.showToast)
            window.showToast(
                requestMode === 'past'
                    ? '已生成 ' + count_5 + ' 个往期视频'
                    : '已生成 ' + count_5 + ' 条帖子',
            );
    } catch (error_6) {
        console.error('Char tab generation failed:', error_6);
        ytCharGenerateModalStatus &&
            ((ytCharGenerateModalStatus.textContent =
                error_6?.message === 'INSUFFICIENT_RESULTS'
                    ? '返回内容不足指定数量，本次未保存，请重试。'
                    : '生成失败，请检查 API 配置或网络后重试。'),
            ytCharGenerateModalStatus.classList.add('is-error'));
        setYtCharGenerationModalLoading(false);
    }
}
btnGenerate &&
    btnGenerate.addEventListener('click', (event_7) => {
        event_7.stopPropagation();
        if (ytCharGenerateRequestActive) return;
        openYtCharGenerationModal();
    });
ytCharGenerateConfirm?.addEventListener('click', submitYtCharTabGeneration);
ytCharGenerateModalClose?.addEventListener('click', closeYtCharGenerationModal);
ytCharGenerateModal?.addEventListener('mousedown', (event_8) => {
    if (event_8.target === ytCharGenerateModal) closeYtCharGenerationModal();
});
ytCharGenerateCount?.addEventListener('change', () => {
    ytCharGenerateCount.value = String(clampYtCharGenerationCount(ytCharGenerateCount.value));
});
