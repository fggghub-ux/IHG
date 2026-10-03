const startLiveOptionBtn = ytCreateSheet
        ? ytCreateSheet.querySelectorAll('.yt-create-bubble-btn')[0]
        : null,
    userLiveSetupSheet = document.getElementById('yt-user-live-setup-sheet'),
    startUserLiveBtn = document.getElementById('start-user-live-btn'),
    userLiveView = document.getElementById('yt-user-live-view'),
    userLiveBackBtn = document.getElementById('yt-user-live-back-btn'),
    userLiveVideoArea = document.getElementById('yt-user-live-video-area');
let userLiveBgUrl = '';
const userLiveBgUpload = document.getElementById('yt-user-live-bg-upload'),
    userLiveBgBtn = document.getElementById('yt-user-live-bg-btn'),
    userLiveBgImg = document.getElementById('yt-user-live-bg-img');
function getCurrentYtLiveUser() {
    if (typeof window.getYtEffectiveUserState === 'function')
        return window.getYtEffectiveUserState() || {};
    return ytUserState || {};
}
function stopUserLiveControlEvent(e) {
    if (!e) return;
    e.stopPropagation();
}
userLiveBgBtn &&
    userLiveBgUpload &&
    (userLiveBgBtn.addEventListener('click', (e_3) => {
        stopUserLiveControlEvent(e_3);
        userLiveBgUpload.click();
    }),
    userLiveBgUpload.addEventListener('change', (event) => {
        const value_3 = event.target.files[0];
        if (value_3) {
            const value_4 = new FileReader();
            value_4.onload = (ev) => {
                if (window.compressImage)
                    window.compressImage(ev.target.result, 900, 600, (value_6) => {
                        userLiveBgUrl = value_6;
                        userLiveBgImg &&
                            ((userLiveBgImg.src = userLiveBgUrl),
                            (userLiveBgImg.style.display = 'block'));
                        const ytUserLiveBgDisplayElement =
                            document.getElementById('yt-user-live-bg-display');
                        ytUserLiveBgDisplayElement &&
                            (ytUserLiveBgDisplayElement.src = userLiveBgUrl);
                    });
                else {
                    userLiveBgUrl = ev.target.result;
                    userLiveBgImg &&
                        ((userLiveBgImg.src = userLiveBgUrl),
                        (userLiveBgImg.style.display = 'block'));
                    const ytUserLiveBgDisplayElement_7 =
                        document.getElementById('yt-user-live-bg-display');
                    ytUserLiveBgDisplayElement_7 &&
                        (ytUserLiveBgDisplayElement_7.src = userLiveBgUrl);
                }
            };
            value_4.readAsDataURL(value_3);
        }
    }));
startLiveOptionBtn &&
    userLiveSetupSheet &&
    (startLiveOptionBtn.addEventListener('click', () => {
        if (ytCreateSheet) ytCreateSheet.classList.remove('active');
        userLiveSetupSheet.classList.add('active');
    }),
    userLiveSetupSheet.addEventListener('mousedown', (event_8) => {
        if (event_8.target === userLiveSetupSheet) userLiveSetupSheet.classList.remove('active');
    }));
startUserLiveBtn &&
    userLiveView &&
    startUserLiveBtn.addEventListener('click', () => {
        typeof window.validateUserLiveSelectedGuests === 'function' &&
            window.validateUserLiveSelectedGuests();
        const ytUserLiveTitleInputElement = document.getElementById('yt-user-live-title-input'),
            textContent_2 =
                ytUserLiveTitleInputElement && ytUserLiveTitleInputElement.value
                    ? ytUserLiveTitleInputElement.value
                    : '我的直播间';
        document.getElementById('yt-user-live-title-display').textContent = textContent_2;
        userLiveBgUrl
            ? (document.getElementById('yt-user-live-bg-display').src = userLiveBgUrl)
            : (document.getElementById('yt-user-live-bg-display').src =
                  'https://picsum.photos/900/600');
        userLiveSetupSheet.classList.remove('active');
        document.getElementById('yt-user-live-chat-container').innerHTML = '';
        document.getElementById('yt-user-live-bubbles-container').innerHTML = '';
        document.getElementById('yt-user-live-alert-container').innerHTML = '';
        userLiveConnectionCard?.replaceChildren();
        userLiveHistory = [];
        if (typeof window.openYtUserLiveView === 'function') {
            window.openYtUserLiveView();
            return;
        }
        userLiveView.classList.add('active');
    });
userLiveBackBtn &&
    userLiveBackBtn.addEventListener('click', () => {
        if (isUserLiveLotteryActive()) {
            if (window.showToast) window.showToast('抽奖进行中，请等待开奖后再结束直播');
            renderUserLiveLotteryStatus(true);
            return;
        }
        window.showCustomModal({
            title: '结束直播',
            message: '确定要结束当前的直播吗？',
            confirmText: '结束',
            cancelText: '继续',
            isDestructive: true,
            onConfirm: () => {
                archiveAllUserLiveConnections();
                if (typeof window.releaseYtChatKeyboardLock === 'function')
                    window.releaseYtChatKeyboardLock();
                userLiveView.classList.remove('active');
                document.getElementById('yt-summary-views').textContent = userLiveTotalViews;
                document.getElementById('yt-summary-hot').textContent = userLiveMaxHot;
                document.getElementById('yt-summary-subs').textContent = '+' + userLiveNewSubs;
                document.getElementById('yt-summary-sc').textContent = '￥' + userLiveTotalSC;
                if (userLiveSummarySheet) userLiveSummarySheet.classList.add('active');
            },
        });
    });
window.renderDataCenter = function () {
    const ytDataCenterBtnElement = document.getElementById('yt-data-center-btn'),
        ytDataCenterSheetElement = document.getElementById('yt-data-center-sheet'),
        ytWithdrawBtnElement = document.getElementById('yt-withdraw-btn'),
        dcTotalViews = document.getElementById('dc-total-views'),
        dcTotalSc = document.getElementById('dc-total-sc'),
        dcTotalSubs = document.getElementById('dc-total-subs'),
        dcTotalCommission = document.getElementById('dc-total-commission'),
        dcTotalRevenue = document.getElementById('dc-total-revenue'),
        dcOffersList = document.getElementById('dc-offers-list'),
        dcReceivedGiftsList_2 = document.getElementById('dc-received-gifts-list');
    !channelState.dataCenter &&
        (channelState.dataCenter = {
            views: 0,
            sc: 0,
            subs: 0,
            commission: 0,
            receivedGifts: [],
        });
    if (channelState.dataCenter.commission === undefined) channelState.dataCenter.commission = 0;
    if (!Array.isArray(channelState.dataCenter.receivedGifts))
        channelState.dataCenter.receivedGifts = [];
    if (dcTotalViews) dcTotalViews.textContent = channelState.dataCenter.views || 0;
    if (dcTotalSc) dcTotalSc.textContent = (channelState.dataCenter.sc || 0).toFixed(2);
    if (dcTotalSubs) dcTotalSubs.textContent = channelState.dataCenter.subs || 0;
    if (dcTotalCommission)
        dcTotalCommission.textContent = (channelState.dataCenter.commission || 0).toFixed(2);
    const total_2 =
        parseFloat(channelState.dataCenter.sc || 0) +
        parseFloat(channelState.dataCenter.commission || 0);
    if (dcTotalRevenue) dcTotalRevenue.textContent = total_2.toFixed(2);
    ytWithdrawBtnElement &&
        (total_2 > 0
            ? ((ytWithdrawBtnElement.style.opacity = '1'),
              (ytWithdrawBtnElement.style.pointerEvents = 'auto'))
            : ((ytWithdrawBtnElement.style.opacity = '0.5'),
              (ytWithdrawBtnElement.style.pointerEvents = 'none')));
    if (dcOffersList) {
        dcOffersList.innerHTML = '';
        let enabled = false;
        mockSubscriptions.forEach((sub) => {
            sub.dmHistory &&
                sub.dmHistory.forEach((msg) => {
                    if (msg.isOffer && msg.offerStatus === 'accepted') {
                        enabled = true;
                        const el_2 = document.createElement('div');
                        el_2.className = 'settings-item';
                        el_2.style.padding = '12px 16px';
                        el_2.style.cursor = 'pointer';
                        const priceStr = msg.offerData.price || '0',
                            avatarUrl_2 =
                                typeof resolveYtChannelAvatar === 'function'
                                    ? resolveYtChannelAvatar(sub)
                                    : sub.avatar || 'https://picsum.photos/80/80?grayscale';
                        el_2.innerHTML =
                            `
                                <div style="width: 36px; height: 36px; border-radius: 50%; overflow: hidden; margin-right: 12px; flex-shrink: 0;">
                                    <img src="` +
                            avatarUrl_2 +
                            `" style="width: 100%; height: 100%; object-fit: cover;">
                                </div>
                                <div style="flex: 1; overflow: hidden;">
                                    <div style="font-weight: 600; font-size: 15px; color: #000; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">` +
                            (msg.offerData.title || '商单任务') +
                            `</div>
                                    <div style="font-size: 12px; color: #8e8e93; margin-top: 2px;">来自: ` +
                            sub.name +
                            `</div>
                                </div>
                                <div style="color: #ff3b30; font-weight: 600; font-size: 15px;">` +
                            priceStr +
                            `</div>
                            `;
                        el_2.addEventListener('click', () => {
                            currentSubChannelData = sub;
                            openOfferDetailSheet(msg);
                        });
                        dcOffersList.appendChild(el_2);
                    }
                });
        });
        !enabled &&
            (dcOffersList.innerHTML =
                '<div style="padding: 16px; text-align: center; color: #8e8e93; font-size: 14px;">暂无进行中的商单</div>');
    }
    ytDataCenterSheetElement &&
        !ytDataCenterSheetElement.dataset.bound &&
        ((ytDataCenterSheetElement.dataset.bound = 'true'),
        ytDataCenterSheetElement.addEventListener('mousedown', (event_13) => {
            if (event_13.target === ytDataCenterSheetElement)
                ytDataCenterSheetElement.classList.remove('active');
        }));
};
setTimeout(() => {
    const dataCenterBtn = document.getElementById('yt-data-center-btn'),
        dataCenterSheet = document.getElementById('yt-data-center-sheet');
    dataCenterBtn &&
        dataCenterSheet &&
        !dataCenterBtn.dataset.bound &&
        ((dataCenterBtn.dataset.bound = 'true'),
        dataCenterBtn.addEventListener('click', (e_4) => {
            e_4.stopPropagation();
            window.renderDataCenter();
            dataCenterSheet.classList.add('active');
        }));
}, 500);
const ytWithdrawBtn = document.getElementById('yt-withdraw-btn');
ytWithdrawBtn &&
    ytWithdrawBtn.addEventListener('click', () => {
        const total_3 =
            parseFloat(channelState.dataCenter.sc || 0) +
            parseFloat(channelState.dataCenter.commission || 0);
        if (total_3 <= 0) return;
        if (window.showCustomModal)
            window.showCustomModal({
                title: '收益提现',
                message:
                    '确认将 YouTube 创作者收益 ￥' + total_3.toFixed(2) + ' 提现到 Pay 钱包吗？',
                confirmText: '确认提现',
                cancelText: '取消',
                onConfirm: () => {
                    channelState.dataCenter.sc = 0;
                    channelState.dataCenter.commission = 0;
                    saveYoutubeData();
                    renderDataCenter();
                    window.addPayTransaction &&
                        window.addPayTransaction(total_3, 'YouTube 创作者收益', 'income');
                    if (window.showToast) window.showToast('提现成功，已存入 Pay 钱包');
                },
            });
        else {
            if (confirm('确认提现 ￥' + total_3.toFixed(2) + ' 吗？')) {
                channelState.dataCenter.sc = 0;
                channelState.dataCenter.commission = 0;
                saveYoutubeData();
                renderDataCenter();
                if (window.addPayTransaction)
                    window.addPayTransaction(total_3, 'YouTube 创作者收益', 'income');
                alert('提现成功！');
            }
        }
    });
let userLiveHistory = [],
    userLiveComments = [],
    userLiveTotalSC = 0,
    userLiveTotalViews = 0,
    userLiveMaxHot = 0,
    userLiveNewSubs = 0,
    userLiveSessionId = null;
const userLiveConnectionDelayTimers = new Map(),
    userLiveConnectionDurationTimers = new Map(),
    userLiveChatInput = document.getElementById('yt-user-live-chat-input'),
    userLiveChatSend = document.getElementById('yt-user-live-chat-send'),
    userLiveBubblesContainer = document.getElementById('yt-user-live-bubbles-container'),
    userLiveChatContainer = document.getElementById('yt-user-live-chat-container'),
    userLiveTriggerApiBtn = document.getElementById('yt-user-live-trigger-api-btn'),
    userLiveConnectBtn = document.getElementById('yt-user-live-connect-btn'),
    userLiveConnectionCard = document.getElementById('yt-user-live-connection-card'),
    userLiveMinimizeBtn = document.getElementById('yt-user-live-minimize-btn'),
    userLiveLotteryBtn = document.getElementById('yt-user-live-lottery-btn'),
    userLiveLotterySheet = document.getElementById('yt-user-live-lottery-sheet'),
    userLiveLotteryClose = document.getElementById('yt-user-live-lottery-close'),
    userLiveLotteryDuration = document.getElementById('yt-user-live-lottery-duration'),
    userLiveLotteryPrizes = document.getElementById('yt-user-live-lottery-prizes'),
    userLiveLotteryAddPrize = document.getElementById('yt-user-live-lottery-add-prize'),
    userLiveLotteryConfirm = document.getElementById('yt-user-live-lottery-confirm'),
    userLiveLotteryStatus = document.getElementById('yt-user-live-lottery-status'),
    userLiveLotteryParticipants = document.getElementById('yt-user-live-lottery-participants'),
    userLiveLotteryCountdown = document.getElementById('yt-user-live-lottery-countdown'),
    userLiveLotteryResultModal = document.getElementById('yt-user-live-lottery-result-modal'),
    userLiveLotteryResultSummary = document.getElementById('yt-user-live-lottery-result-summary'),
    userLiveLotteryResultList = document.getElementById('yt-user-live-lottery-result-list'),
    userLiveLotteryResultClose = document.getElementById('yt-user-live-lottery-result-close'),
    userLiveLotteryResultConfirm = document.getElementById('yt-user-live-lottery-result-confirm');
let userLiveLotteryTimer = null,
    isFinalizingUserLiveLottery = false,
    userLiveChatNeedsRefresh = false;
function isUserLiveVisible() {
    return (
        !document.hidden &&
        userLiveView?.classList.contains('active') &&
        document.getElementById('youtube-view')?.classList.contains('active')
    );
}
function positionUserLiveLotteryStatus() {
    if (!userLiveLotteryStatus || !userLiveView || !isUserLiveVisible()) return;
    const chatShell = userLiveView.querySelector('.yt-user-live-chat-shell');
    if (!chatShell) return;
    const viewRect = userLiveView.getBoundingClientRect(),
        chatRect = chatShell.getBoundingClientRect(),
        chatHeightFromBottom = Math.max(0, viewRect.bottom - chatRect.top);
    userLiveLotteryStatus.style.bottom = Math.round(chatHeightFromBottom + 8) + 'px';
}
function escapeYtUserLiveHtml(value_2) {
    return String(value_2 ?? '').replace(
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
function getActiveUserLiveLottery() {
    const lottery_2 = channelState?.activeUserLive?.lottery;
    return lottery_2 && typeof lottery_2 === 'object' ? lottery_2 : null;
}
function isUserLiveLotteryActive() {
    return getActiveUserLiveLottery()?.status === 'active';
}
function getUserLiveTitle() {
    const titleInput = document.getElementById('yt-user-live-title-input');
    return titleInput && titleInput.value ? titleInput.value : '我的直播间';
}
function getUserLiveTopic() {
    const topicInput = document.getElementById('yt-user-live-topic-input');
    return topicInput && topicInput.value ? topicInput.value : '';
}
function getSelectedUserLiveGuests() {
    return typeof window.getUserLiveSelectedGuests === 'function'
        ? window.getUserLiveSelectedGuests()
        : [];
}
function buildActiveUserLiveState(value_21 = {}) {
    const currentYtLiveUser = getCurrentYtLiveUser(),
        totalViews_2 = Number(userLiveTotalViews) || 0;
    return {
        ...(channelState.activeUserLive || {}),
        title: getUserLiveTitle(),
        desc: getUserLiveTopic(),
        views: totalViews_2 + ' 人正在观看',
        thumbnail:
            userLiveBgUrl ||
            channelState.activeUserLive?.thumbnail ||
            'https://picsum.photos/320/180',
        backgroundUrl: userLiveBgUrl || channelState.activeUserLive?.backgroundUrl || '',
        comments: Array.isArray(userLiveComments) ? [...userLiveComments] : [],
        history: Array.isArray(userLiveHistory) ? [...userLiveHistory] : [],
        totalSC: Number(userLiveTotalSC) || 0,
        totalViews: totalViews_2,
        maxHot: Number(userLiveMaxHot) || totalViews_2,
        newSubs: Number(userLiveNewSubs) || 0,
        liveSessionId: userLiveSessionId || channelState.activeUserLive?.liveSessionId || null,
        guests: getSelectedUserLiveGuests(),
        user: {
            name: currentYtLiveUser.name || '我',
            avatarUrl: currentYtLiveUser.avatarUrl || '',
            subs: currentYtLiveUser.subs || '0',
        },
        updatedAt: Date.now(),
        ...value_21,
    };
}
function persistActiveUserLive(extra = {}) {
    if (!channelState) return null;
    return (
        (channelState.activeUserLive = buildActiveUserLiveState(extra)),
        saveYoutubeData(),
        channelState.activeUserLive
    );
}
function formatUserLiveConnectionDuration(startedAt_2) {
    const totalSeconds = Math.max(
            0,
            Math.floor((Date.now() - Number(startedAt_2 || Date.now())) / 1000),
        ),
        hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0'),
        minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0'),
        seconds = String(totalSeconds % 60).padStart(2, '0');
    return hours + ':' + minutes + ':' + seconds;
}
function normalizeUserLiveTranscriptItem(item_2 = {}) {
    const kind_2 = item_2.kind === 'narrative' ? 'narrative' : 'speech';
    return {
        speakerType: item_2.speakerType || 'char',
        speakerId: item_2.speakerId || null,
        name: item_2.name || '',
        text: String(item_2.text || '').trim(),
        ...(item_2.translationZh
            ? {
                  translationZh: String(item_2.translationZh),
              }
            : {}),
        kind: kind_2,
        timestamp: Number(item_2.timestamp) || Date.now(),
    };
}
function getUserLiveConnections() {
    const live = channelState?.activeUserLive;
    if (!live) return [];
    !Array.isArray(live.connections) &&
        ((live.connections =
            live.connection && typeof live.connection === 'object' ? [live.connection] : []),
        (live.connection = null));
    live.connections = live.connections
        .filter(Boolean)
        .slice(0, 3)
        .map((connection_2) => ({
            ...connection_2,
            id:
                connection_2.id ||
                'connection_' +
                    (connection_2.requestedAt || Date.now()) +
                    '_' +
                    Math.random().toString(36).slice(2, 7),
            transcript: Array.isArray(connection_2.transcript)
                ? connection_2.transcript.map(normalizeUserLiveTranscriptItem)
                : [],
        }));
    if (!Array.isArray(live.connectionHistory)) live.connectionHistory = [];
    return live.connections;
}
function getActiveUserLiveConnections() {
    return getUserLiveConnections().filter((connection_3) => connection_3.status === 'active');
}
function getUserLiveConnectionById(connectionId_2) {
    return (
        getUserLiveConnections().find(
            (connection_4) => String(connection_4.id) === String(connectionId_2),
        ) || null
    );
}
function stopUserLiveConnectionTimers(connectionId_3 = null) {
    const value_37 = (map_2, value_38) => {
        if (connectionId_3 !== null) {
            const userLiveLotteryTimer_2 = map_2.get(String(connectionId_3));
            if (userLiveLotteryTimer_2) value_38(userLiveLotteryTimer_2);
            map_2['delete'](String(connectionId_3));
            return;
        }
        map_2.forEach(value_38);
        map_2.clear();
    };
    value_37(userLiveConnectionDelayTimers, clearTimeout);
    value_37(userLiveConnectionDurationTimers, clearInterval);
}
function stopUserLiveConnectionDurationTimers() {
    userLiveConnectionDurationTimers.forEach(clearInterval);
    userLiveConnectionDurationTimers.clear();
}
function setUserLiveConnectionButtonState() {
    if (!userLiveConnectBtn) return;
    const connections_2 = getUserLiveConnections(),
        isFull = connections_2.length >= 3;
    userLiveConnectBtn.disabled = !channelState?.activeUserLive || isFull;
    userLiveConnectBtn.classList.toggle(
        'is-connecting',
        connections_2.some((item) => item.status === 'connecting'),
    );
    userLiveConnectBtn.innerHTML = '<i class="fas fa-phone-volume"></i>';
    userLiveConnectBtn.title = isFull ? '最多同时连线 3 位嘉宾' : '添加连线嘉宾';
    userLiveConnectBtn.setAttribute('aria-label', userLiveConnectBtn.title);
}
function appendUserLiveConnectionTranscript(value_41, value_42, value_43 = {}) {
    const connection_5 = getUserLiveConnectionById(value_41),
        normalized = normalizeUserLiveTranscriptItem(value_42);
    if (!connection_5 || !normalized.text) return null;
    return (
        connection_5.transcript.push(normalized),
        value_43.includeLiveHistory !== false &&
            userLiveHistory.push({
                type: normalized.kind === 'narrative' ? 'guest-narrative' : 'guest',
                senderType: normalized.speakerType,
                ...normalized,
            }),
        persistActiveUserLive({
            connections: getUserLiveConnections(),
            connection: null,
        }),
        normalized
    );
}
function addUserLiveConnectionBubble(connectionId_4, message_45, value_46 = {}) {
    const connection_6 = getUserLiveConnectionById(connectionId_4),
        text_2 = String(message_45?.text || message_45?.content || message_45 || '').trim(),
        translationZh_2 = String(message_45?.translationZh || message_45?.translation || '').trim();
    if (!connection_6 || !userLiveBubblesContainer || !text_2) return;
    value_46.persist !== false &&
        appendUserLiveConnectionTranscript(connectionId_4, {
            speakerType: 'char',
            speakerId: connection_6.participant?.imCharId || connection_6.participant?.id,
            name: connection_6.participant?.name || '连线嘉宾',
            text: text_2,
            translationZh: translationZh_2,
            kind: 'speech',
        });
    if (!isUserLiveVisible()) return;
    const participantName = connection_6.participant?.name || '连线嘉宾',
        element_51 = document.createElement('div');
    element_51.className = 'yt-user-live-bubble';
    element_51.innerHTML =
        `
            <div class="yt-localized-original">` +
        escapeYtUserLiveHtml(participantName + '：' + text_2) +
        `</div>
            ` +
        (translationZh_2
            ? '<div class="yt-char-live-translation">' +
              escapeYtUserLiveHtml(participantName + '：' + translationZh_2) +
              '</div>'
            : '');
    userLiveBubblesContainer.appendChild(element_51);
    setTimeout(() => {
        element_51.style.opacity = '0';
        element_51.style.transition = 'opacity 1s ease';
        setTimeout(() => element_51.remove(), 1000);
    }, 8000);
}
function addUserLiveConnectionNarrative(connectionId_5, message_53, value_54 = {}) {
    const connection_7 = getUserLiveConnectionById(connectionId_5),
        text_3 = String(message_53?.text || message_53?.content || message_53 || '').trim(),
        translationZh_3 = String(message_53?.translationZh || message_53?.translation || '').trim();
    if (!connection_7 || !text_3) return;
    value_54.persist !== false &&
        appendUserLiveConnectionTranscript(connectionId_5, {
            speakerType: 'char',
            speakerId: connection_7.participant?.imCharId || connection_7.participant?.id,
            name: connection_7.participant?.name || '连线嘉宾',
            text: text_3,
            translationZh: translationZh_3,
            kind: 'narrative',
        });
    if (!isUserLiveVisible()) return;
    const querySelector_58 = userLiveConnectionCard?.querySelector(
        '[data-connection-id="' +
            CSS.escape(String(connectionId_5)) +
            '"] .yt-live-connection-narratives',
    );
    if (!querySelector_58) return;
    const narrative_2 = document.createElement('div');
    narrative_2.className = 'yt-live-connection-narrative';
    narrative_2.textContent = translationZh_3 ? text_3 + '（' + translationZh_3 + '）' : text_3;
    querySelector_58.appendChild(narrative_2);
    while (querySelector_58.children.length > 2) querySelector_58.firstElementChild?.remove();
    setTimeout(() => narrative_2.remove(), 10000);
}
function renderUserLiveConnections() {
    if (!userLiveConnectionCard) return;
    stopUserLiveConnectionDurationTimers();
    userLiveConnectionCard.replaceChildren();
    const activeConnections = channelState?.activeUserLive ? getActiveUserLiveConnections() : [];
    activeConnections.forEach((connection_8) => {
        const participant_2 = connection_8.participant || {},
            seat = document.createElement('div');
        seat.className = 'yt-live-connection-card yt-user-live-connection-seat';
        seat.dataset.connectionId = connection_8.id;
        seat.innerHTML =
            `
                <div class="yt-live-connection-avatar-wrap">
                    <img class="yt-live-connection-avatar" src="` +
            escapeYtUserLiveHtml(
                participant_2.avatar ||
                    participant_2.avatarUrl ||
                    'https://picsum.photos/80/80?grayscale',
            ) +
            `" alt="">
                    <div class="yt-live-connection-wave" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
                </div>
                <div class="yt-live-connection-info">
                    <div class="yt-live-connection-name">` +
            escapeYtUserLiveHtml(participant_2.name || '连线嘉宾') +
            `</div>
                    <div class="yt-live-connection-duration">` +
            formatUserLiveConnectionDuration(connection_8.startedAt) +
            `</div>
                </div>
                <button type="button" class="yt-live-connection-exit" aria-label="退出连线" title="退出连线"><i class="fas fa-phone-slash"></i></button>
                <div class="yt-live-connection-narratives" aria-live="polite"></div>`;
        seat.querySelector('.yt-live-connection-exit')?.addEventListener('click', (event_2) => {
            event_2.stopPropagation();
            endUserLiveConnection(connection_8.id);
        });
        userLiveConnectionCard.appendChild(seat);
        const duration = seat.querySelector('.yt-live-connection-duration'),
            setInterval_63 = setInterval(() => {
                const latest_2 = getUserLiveConnectionById(connection_8.id);
                if (!latest_2 || latest_2.status !== 'active') return;
                if (!isUserLiveVisible()) return;
                if (duration)
                    duration.textContent = formatUserLiveConnectionDuration(latest_2.startedAt);
            }, 1000);
        userLiveConnectionDurationTimers.set(String(connection_8.id), setInterval_63);
    });
    setUserLiveConnectionButtonState();
}
function activateUserLiveConnection(value_66) {
    const connection_9 = getUserLiveConnectionById(value_66);
    if (!connection_9 || connection_9.status !== 'connecting') return;
    userLiveConnectionDelayTimers['delete'](String(value_66));
    connection_9.status = 'active';
    connection_9.startedAt = (Number(connection_9.requestedAt) || Date.now()) + 3000;
    persistActiveUserLive({
        connections: getUserLiveConnections(),
        connection: null,
    });
    renderUserLiveConnections();
    if (window.showToast)
        window.showToast('已与 ' + (connection_9.participant?.name || '嘉宾') + ' 接通');
}
function scheduleUserLiveConnectionRestore() {
    stopUserLiveConnectionTimers();
    getUserLiveConnections().forEach((connection_10) => {
        if (connection_10.status !== 'connecting') return;
        const remaining = Math.max(0, Number(connection_10.requestedAt) + 3000 - Date.now()),
            timer = setTimeout(() => activateUserLiveConnection(connection_10.id), remaining);
        userLiveConnectionDelayTimers.set(String(connection_10.id), timer);
    });
    renderUserLiveConnections();
}
function beginUserLiveConnection(guest_2) {
    if (!channelState?.activeUserLive || !guest_2) return false;
    const validatedGuest =
        typeof window.validateYtLiveGuestOption === 'function'
            ? window.validateYtLiveGuestOption(guest_2)
            : guest_2;
    if (!validatedGuest) return (window.showToast?.('该好友已不在订阅栏中'), false);
    const connections_3 = getUserLiveConnections(),
        participantId_2 = String(validatedGuest.imCharId || validatedGuest.id || '');
    if (
        connections_3.some(
            (item_3) =>
                String(item_3.participant?.imCharId || item_3.participant?.id || '') ===
                participantId_2,
        )
    )
        return (window.showToast?.('该嘉宾已经在连线中'), false);
    if (connections_3.length >= 3) return (window.showToast?.('最多同时连线 3 位嘉宾'), false);
    const participant_3 = {
            id: validatedGuest.id,
            imCharId: validatedGuest.imCharId || null,
            name: validatedGuest.name || '连线嘉宾',
            avatar: validatedGuest.avatar || validatedGuest.avatarUrl || '',
            desc: validatedGuest.desc || validatedGuest.persona || '',
            persona: validatedGuest.persona || validatedGuest.desc || '',
            guestSource: validatedGuest.guestSource || 'youtube-subscription',
        },
        comment_2 = {
            id: 'connection_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
            status: 'connecting',
            requestedAt: Date.now(),
            startedAt: null,
            participant: participant_3,
            transcript: [],
        };
    return (
        connections_3.push(comment_2),
        persistActiveUserLive({
            connections: connections_3,
            connection: null,
        }),
        scheduleUserLiveConnectionRestore(),
        window.showToast?.('已向 ' + participant_3.name + ' 发送连线请求，等待接通...'),
        true
    );
}
function endUserLiveConnection(value_77, value_78 = {}) {
    const live_2 = channelState?.activeUserLive,
        connection_11 = getUserLiveConnectionById(value_77);
    if (!live_2 || !connection_11) return;
    stopUserLiveConnectionTimers(connection_11.id);
    const connectionHistory_2 = Array.isArray(live_2.connectionHistory)
        ? [...live_2.connectionHistory]
        : [];
    connectionHistory_2.push({
        ...connection_11,
        participant: {
            ...(connection_11.participant || {}),
        },
        transcript: Array.isArray(connection_11.transcript)
            ? connection_11.transcript.map((item_4) => ({
                  ...item_4,
              }))
            : [],
        endedAt: Date.now(),
    });
    const connections_4 = getUserLiveConnections().filter(
        (item_5) => String(item_5.id) !== String(connection_11.id),
    );
    persistActiveUserLive({
        connections: connections_4,
        connection: null,
        connectionHistory: connectionHistory_2,
    });
    renderUserLiveConnections();
    if (!value_78.silent)
        window.showToast?.('已结束与 ' + (connection_11.participant?.name || '嘉宾') + ' 的连线');
}
function archiveAllUserLiveConnections() {
    const ids = getUserLiveConnections().map((connection_12) => connection_12.id);
    ids.forEach((id_2) =>
        endUserLiveConnection(id_2, {
            silent: true,
        }),
    );
}
userLiveConnectBtn &&
    userLiveConnectBtn.addEventListener('click', (event_87) => {
        event_87.stopPropagation();
        if (!channelState?.activeUserLive) return;
        const connections_5 = getUserLiveConnections();
        if (connections_5.length >= 3) {
            window.showToast?.('最多同时连线 3 位嘉宾');
            return;
        }
        const excludeIds_2 = connections_5
                .flatMap((item_6) => [item_6.participant?.id, item_6.participant?.imCharId])
                .filter(Boolean),
            opened = window.openYtLiveConnectionPicker?.(
                (selectedGuest) => {
                    if (!selectedGuest) return;
                    const onConfirm_2 = () => beginUserLiveConnection(selectedGuest);
                    if (window.showCustomModal)
                        window.showCustomModal({
                            title: '请求连线',
                            message: '确定向 ' + (selectedGuest.name || '该好友') + ' 发起连线吗？',
                            confirmText: '请求连线',
                            cancelText: '取消',
                            onConfirm: onConfirm_2,
                        });
                    else onConfirm_2();
                },
                {
                    includeNone: false,
                    title: '添加连线嘉宾',
                    excludeIds: excludeIds_2,
                },
            );
        if (opened === false) window.showToast?.('暂无可连线的订阅好友');
    });
function getUserLiveLotteryPrizeName(value_93) {
    const names = [
        '一等奖',
        '二等奖',
        '三等奖',
        '四等奖',
        '五等奖',
        '六等奖',
        '七等奖',
        '八等奖',
        '九等奖',
        '十等奖',
    ];
    return names[value_93] || '奖项' + (value_93 + 1);
}
function createDefaultUserLiveLotteryPrize(value_95 = 0) {
    return {
        id:
            'lottery_prize_' +
            Date.now() +
            '_' +
            value_95 +
            '_' +
            Math.random().toString(36).slice(2, 7),
        name: getUserLiveLotteryPrizeName(value_95),
        type: 'custom',
        prize: '',
        amount: 0,
        winnerCount: 1,
    };
}
function renderUserLiveLotteryPrizeRows(prizes_2 = null) {
    if (!userLiveLotteryPrizes) return;
    const source_2 =
        Array.isArray(prizes_2) && prizes_2.length > 0
            ? prizes_2
            : [createDefaultUserLiveLotteryPrize(0)];
    userLiveLotteryPrizes.innerHTML = '';
    source_2.slice(0, 10).forEach((prize_2, index_2) => {
        const row = document.createElement('div');
        row.className = 'yt-user-live-lottery-prize-row';
        row.dataset.prizeId = prize_2.id || createDefaultUserLiveLotteryPrize(index_2).id;
        const prizeType = prize_2.type === 'cash' ? 'cash' : 'custom';
        row.innerHTML =
            `
                <input class="yt-lottery-prize-name" type="text" maxlength="20" aria-label="奖项名称" value="` +
            escapeYtUserLiveHtml(prize_2.name || getUserLiveLotteryPrizeName(index_2)) +
            `">
                <select class="yt-lottery-prize-type" aria-label="奖品类型">
                    <option value="cash"` +
            (prizeType === 'cash' ? ' selected' : '') +
            `>金额</option>
                    <option value="custom"` +
            (prizeType === 'custom' ? ' selected' : '') +
            `>自定义</option>
                </select>
                <input class="yt-lottery-prize-count" type="number" min="1" max="100" step="1" inputmode="numeric" aria-label="中奖人数" value="` +
            Math.max(1, Math.min(100, Math.round(Number(prize_2.winnerCount) || 1))) +
            `">
                <button type="button" class="yt-user-live-lottery-prize-remove" aria-label="删除奖项"><i class="fas fa-minus-circle"></i></button>
                <div class="yt-lottery-prize-value">
                    <label class="yt-lottery-prize-amount-wrap">
                        <span>¥</span>
                        <input class="yt-lottery-prize-amount" type="number" min="0.01" max="1000000" step="0.01" inputmode="decimal" aria-label="每位中奖者金额" placeholder="每人金额" value="` +
            (Number(prize_2.amount) > 0 ? Number(prize_2.amount) : '') +
            `">
                    </label>
                    <input class="yt-lottery-prize-content" type="text" maxlength="60" aria-label="自定义奖品内容" placeholder="填写自定义奖品" value="` +
            escapeYtUserLiveHtml(prizeType === 'custom' ? prize_2.prize || '' : '') +
            `">
                </div>
            `;
        const typeSelect = row.querySelector('.yt-lottery-prize-type'),
            syncPrizeValueInput = () => {
                const isCash = typeSelect?.value === 'cash';
                row.querySelector('.yt-lottery-prize-amount-wrap')?.classList.toggle(
                    'is-visible',
                    isCash,
                );
                row.querySelector('.yt-lottery-prize-content')?.classList.toggle(
                    'is-visible',
                    !isCash,
                );
            };
        typeSelect?.addEventListener('change', syncPrizeValueInput);
        syncPrizeValueInput();
        const removeButton = row.querySelector('.yt-user-live-lottery-prize-remove');
        removeButton &&
            removeButton.addEventListener('click', () => {
                if (userLiveLotteryPrizes.children.length <= 1) {
                    if (window.showToast) window.showToast('至少保留一个奖项');
                    return;
                }
                row.remove();
            });
        userLiveLotteryPrizes.appendChild(row);
    });
}
function collectUserLiveLotteryConfig() {
    const durationSec_2 = Math.round(Number(userLiveLotteryDuration?.value));
    if (!Number.isFinite(durationSec_2) || durationSec_2 < 5 || durationSec_2 > 3600) {
        if (window.showToast) window.showToast('开奖时间请输入 5–3600 秒');
        return null;
    }
    const rows = userLiveLotteryPrizes
        ? Array.from(userLiveLotteryPrizes.querySelectorAll('.yt-user-live-lottery-prize-row'))
        : [];
    if (rows.length === 0 || rows.length > 10) {
        if (window.showToast) window.showToast('请设置 1–10 个奖项');
        return null;
    }
    const prizes_3 = [];
    let totalCashAmount_2 = 0;
    for (let index_3 = 0; index_3 < rows.length; index_3++) {
        const row_2 = rows[index_3],
            name_2 =
                String(row_2.querySelector('.yt-lottery-prize-name')?.value || '').trim() ||
                getUserLiveLotteryPrizeName(index_3),
            type_2 =
                row_2.querySelector('.yt-lottery-prize-type')?.value === 'cash' ? 'cash' : 'custom',
            winnerCount_2 = Math.round(
                Number(row_2.querySelector('.yt-lottery-prize-count')?.value),
            );
        if (!Number.isFinite(winnerCount_2) || winnerCount_2 < 1 || winnerCount_2 > 100) {
            if (window.showToast) window.showToast(name_2 + '中奖人数需为 1–100');
            return null;
        }
        let prize_3 = '',
            amount_2 = 0;
        if (type_2 === 'cash') {
            amount_2 =
                Math.round(Number(row_2.querySelector('.yt-lottery-prize-amount')?.value) * 100) /
                100;
            if (!Number.isFinite(amount_2) || amount_2 < 0.01 || amount_2 > 1000000) {
                if (window.showToast) window.showToast(name_2 + '每人金额需为 ¥0.01–¥1,000,000');
                return (row_2.querySelector('.yt-lottery-prize-amount')?.focus(), null);
            }
            prize_3 = '¥' + amount_2.toFixed(2);
            totalCashAmount_2 =
                Math.round((totalCashAmount_2 + amount_2 * winnerCount_2) * 100) / 100;
        } else {
            prize_3 = String(row_2.querySelector('.yt-lottery-prize-content')?.value || '').trim();
            if (!prize_3) {
                if (window.showToast) window.showToast('请填写' + name_2 + '的自定义奖品');
                return (row_2.querySelector('.yt-lottery-prize-content')?.focus(), null);
            }
        }
        prizes_3.push({
            id: row_2.dataset.prizeId || createDefaultUserLiveLotteryPrize(index_3).id,
            name: name_2,
            type: type_2,
            prize: prize_3,
            amount: amount_2,
            winnerCount: winnerCount_2,
        });
    }
    return {
        durationSec: durationSec_2,
        prizes: prizes_3,
        totalCashAmount: totalCashAmount_2,
    };
}
function closeUserLiveLotterySheet() {
    userLiveLotterySheet?.classList.remove('active');
}
function formatUserLiveLotteryCountdown(milliseconds) {
    const totalSeconds_2 = Math.max(0, Math.ceil(milliseconds / 1000)),
        minutes_2 = Math.floor(totalSeconds_2 / 60),
        value_115 = totalSeconds_2 % 60;
    return String(minutes_2).padStart(2, '0') + ':' + String(value_115).padStart(2, '0');
}
function renderUserLiveLotteryStatus(value_116 = false) {
    const lottery_3 = getActiveUserLiveLottery();
    if (!userLiveLotteryStatus) return;
    if (!isUserLiveVisible()) return;
    if (!lottery_3 || lottery_3.status !== 'active') {
        userLiveLotteryStatus.style.display = 'none';
        userLiveLotteryStatus.classList.remove('is-highlighted');
        return;
    }
    userLiveLotteryStatus.style.display = 'flex';
    positionUserLiveLotteryStatus();
    if (userLiveLotteryParticipants)
        userLiveLotteryParticipants.textContent = String(
            Array.isArray(lottery_3.participants) ? lottery_3.participants.length : 0,
        );
    if (userLiveLotteryCountdown)
        userLiveLotteryCountdown.textContent = formatUserLiveLotteryCountdown(
            Number(lottery_3.endAt) - Date.now(),
        );
    value_116 &&
        (userLiveLotteryStatus.classList.remove('is-highlighted'),
        void userLiveLotteryStatus.offsetWidth,
        userLiveLotteryStatus.classList.add('is-highlighted'));
}
function stopUserLiveLotteryTimer() {
    if (userLiveLotteryTimer) clearInterval(userLiveLotteryTimer);
    userLiveLotteryTimer = null;
}
function getUserLiveOnlineViewerLimit() {
    const displayValue = Number.parseInt(
        document.getElementById('yt-user-live-views-display')?.textContent || '',
        10,
    );
    return Math.max(0, Math.round(Number(userLiveTotalViews) || displayValue || 0));
}
function createSimulatedUserLiveLotteryParticipantName(value_117, sequence) {
    const names_2 = [
            'Liam Carter',
            'Emma Wilson',
            'Noah Reed',
            'Olivia Stone',
            'Haruto',
            'Aiko',
            'Sakura',
            'Min-jun',
            'Seo-yeon',
            'Camille',
            'Lucas Martin',
            'Lucía',
            'Mateo',
            'Elena Rossi',
            'Mia Schmidt',
            'Ethan Brooks',
            'Yuna',
            'Ren',
        ],
        baseName = names_2[sequence % names_2.length],
        cycle = Math.floor(sequence / names_2.length);
    return cycle > 0 ? baseName + ' ' + (cycle + 1) : baseName;
}
function growSimulatedUserLiveLotteryParticipants(lottery_4) {
    if (!lottery_4 || lottery_4.status !== 'active') return false;
    const onlineLimit = getUserLiveOnlineViewerLimit();
    if (onlineLimit <= 0) return false;
    lottery_4.participants = Array.isArray(lottery_4.participants) ? lottery_4.participants : [];
    if (lottery_4.participants.length >= onlineLimit) return false;
    const winnerSlots = (Array.isArray(lottery_4.prizes) ? lottery_4.prizes : []).reduce(
        (total, prize_4) => total + Math.max(0, Math.round(Number(prize_4?.winnerCount) || 0)),
        0,
    );
    if (
        !Number.isFinite(Number(lottery_4.simulatedTargetParticipants)) ||
        Number(lottery_4.simulatedTargetParticipants) <= 0
    ) {
        const ratio = 0.35 + Math.random() * 0.3;
        lottery_4.simulatedTargetParticipants = Math.min(
            onlineLimit,
            Math.max(winnerSlots, Math.round(onlineLimit * ratio)),
        );
    }
    const target_2 = Math.min(
        onlineLimit,
        Math.max(
            lottery_4.participants.length,
            Math.round(Number(lottery_4.simulatedTargetParticipants) || 0),
        ),
    );
    lottery_4.simulatedTargetParticipants = target_2;
    const now_2 = Date.now(),
        duration_2 = Math.max(1, Number(lottery_4.endAt) - Number(lottery_4.createdAt)),
        progress = Math.max(0, Math.min(1, (now_2 - Number(lottery_4.createdAt)) / duration_2)),
        desiredCount = Math.min(
            onlineLimit,
            Math.floor(target_2 * Math.min(1, 0.08 + progress * 0.92)),
        );
    if (desiredCount <= lottery_4.participants.length) return false;
    if (
        now_2 < Number(lottery_4.endAt) &&
        now_2 - Number(lottery_4.lastSimulatedGrowthAt || 0) < 1500
    )
        return false;
    const existingNames = new Set(
        lottery_4.participants.map((item_7) =>
            String(item_7?.name || '')
                .trim()
                .toLocaleLowerCase(),
        ),
    );
    let max_130 = Math.max(0, Math.round(Number(lottery_4.simulatedNameSequence) || 0));
    while (
        lottery_4.participants.length < desiredCount &&
        lottery_4.participants.length < onlineLimit
    ) {
        let name_3 = createSimulatedUserLiveLotteryParticipantName(lottery_4, max_130++);
        while (existingNames.has(name_3.toLocaleLowerCase()))
            name_3 = createSimulatedUserLiveLotteryParticipantName(lottery_4, max_130++);
        existingNames.add(name_3.toLocaleLowerCase());
        lottery_4.participants.push({
            name: name_3,
            joinedAt: now_2,
            source: 'frontend-random',
        });
    }
    return (
        (lottery_4.simulatedNameSequence = max_130),
        (lottery_4.lastSimulatedGrowthAt = now_2),
        persistActiveUserLive({
            lottery: lottery_4,
        }),
        true
    );
}
function startUserLiveLotteryTimer() {
    stopUserLiveLotteryTimer();
    const tick = () => {
        const lottery_5 = getActiveUserLiveLottery();
        if (!lottery_5 || lottery_5.status !== 'active') {
            stopUserLiveLotteryTimer();
            renderUserLiveLotteryStatus();
            return;
        }
        growSimulatedUserLiveLotteryParticipants(lottery_5);
        renderUserLiveLotteryStatus();
        if (Date.now() >= Number(lottery_5.endAt)) finalizeUserLiveLottery();
    };
    tick();
    if (isUserLiveLotteryActive()) userLiveLotteryTimer = setInterval(tick, 500);
}
function addUserLiveLotteryParticipant(value_135, source_3 = 'lottery-api') {
    const lottery_6 = getActiveUserLiveLottery();
    if (!lottery_6 || lottery_6.status !== 'active') return false;
    const name_4 = String(value_135 || '').trim();
    if (!name_4) return false;
    const hostName = String(getCurrentYtLiveUser()?.name || '我')
            .trim()
            .toLocaleLowerCase(),
        normalizedName = name_4.toLocaleLowerCase();
    if (normalizedName === hostName) return false;
    lottery_6.participants = Array.isArray(lottery_6.participants) ? lottery_6.participants : [];
    const onlineLimit_2 = getUserLiveOnlineViewerLimit();
    if (onlineLimit_2 <= 0 || lottery_6.participants.length >= onlineLimit_2) return false;
    if (
        lottery_6.participants.some(
            (item_8) =>
                String(item_8?.name || '')
                    .trim()
                    .toLocaleLowerCase() === normalizedName,
        )
    )
        return false;
    return (
        lottery_6.participants.push({
            name: name_4,
            joinedAt: Date.now(),
            source: source_3,
        }),
        persistActiveUserLive({
            lottery: lottery_6,
        }),
        renderUserLiveLotteryStatus(),
        true
    );
}
function shuffleUserLiveLotteryParticipants(value_142) {
    const result_2 = [...value_142],
        getRandomIndex = (max_2) => {
            if (window.crypto?.getRandomValues) {
                const values_2 = new Uint32Array(1);
                return (window.crypto.getRandomValues(values_2), values_2[0] % max_2);
            }
            return Math.floor(Math.random() * max_2);
        };
    for (let index_4 = result_2.length - 1; index_4 > 0; index_4--) {
        const swapIndex = getRandomIndex(index_4 + 1);
        [result_2[index_4], result_2[swapIndex]] = [result_2[swapIndex], result_2[index_4]];
    }
    return result_2;
}
function drawUserLiveLotteryWinners(lottery_7) {
    const pool = shuffleUserLiveLotteryParticipants(
            Array.isArray(lottery_7.participants) ? lottery_7.participants : [],
        ),
        winners_2 = [];
    let cursor_2 = 0;
    return (
        (Array.isArray(lottery_7.prizes) ? lottery_7.prizes : []).forEach((prize_5) => {
            const count_2 = Math.max(0, Math.round(Number(prize_5.winnerCount) || 0));
            for (let index = 0; index < count_2 && cursor_2 < pool.length; index++, cursor_2++) {
                winners_2.push({
                    prizeId: prize_5.id,
                    prizeName: prize_5.name,
                    prize: prize_5.prize,
                    name: pool[cursor_2].name,
                });
            }
        }),
        winners_2
    );
}
function renderUserLiveLotteryResult(lottery_8, shouldOpen = true) {
    if (!lottery_8 || !userLiveLotteryResultList) return;
    const participants_2 = Array.isArray(lottery_8.participants) ? lottery_8.participants : [],
        winners_3 = Array.isArray(lottery_8.winners) ? lottery_8.winners : [];
    userLiveLotteryResultSummary &&
        (userLiveLotteryResultSummary.textContent =
            participants_2.length + ' 人参与，共产生 ' + winners_3.length + ' 位中奖者');
    userLiveLotteryResultList.innerHTML = '';
    (Array.isArray(lottery_8.prizes) ? lottery_8.prizes : []).forEach((prize_6) => {
        const tierWinners = winners_3.filter(
                (winner) => String(winner.prizeId) === String(prize_6.id),
            ),
            missing = Math.max(0, Number(prize_6.winnerCount) - tierWinners.length),
            item_9 = document.createElement('div');
        item_9.className = 'yt-user-live-lottery-result-tier';
        item_9.innerHTML =
            `
                <div style="font-size:14px;font-weight:700;">` +
            escapeYtUserLiveHtml(prize_6.name) +
            ' · ' +
            escapeYtUserLiveHtml(prize_6.prize) +
            `</div>
                <div class="yt-user-live-lottery-result-names">` +
            (tierWinners.length > 0
                ? tierWinners.map((winner_2) => escapeYtUserLiveHtml(winner_2.name)).join('、')
                : '暂无中奖者') +
            `</div>
                ` +
            (missing > 0
                ? '<div style="margin-top:5px;color:#ff9500;font-size:12px;">参与人数不足，空缺 ' +
                  missing +
                  ' 个名额</div>'
                : '') +
            `
            `;
        userLiveLotteryResultList.appendChild(item_9);
    });
    if (shouldOpen) userLiveLotteryResultModal?.classList.add('active');
}
async function requestUserLiveLotteryJson(content_2) {
    if (!window.apiConfig?.endpoint || !window.apiConfig?.apiKey)
        throw new Error('API_NOT_CONFIGURED');
    const chatCompletionsEndpoint = window.u2Api.resolveChatCompletionsEndpoint(
            window.apiConfig.endpoint,
        ),
        value_164 = await fetch(chatCompletionsEndpoint, {
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
                temperature: 0.85,
                response_format: {
                    type: 'json_object',
                },
            }),
        });
    if (!value_164.ok)
        throw (
            window.u2Api?.createHttpError?.(
                value_164,
                await window.u2Api?.readApiError?.(value_164),
            ) ||
            Object.assign(new Error('HTTP ' + value_164.status), {
                status: value_164.status,
            })
        );
    const data_2 = await value_164.json(),
        rawText = String(data_2?.choices?.[0]?.message?.content || '')
            .replace(/```json\n?/gi, '')
            .replace(/```/g, '')
            .trim();
    return sanitizeObj(JSON.parse(rawText));
}
function buildUserLiveLotteryLaunchPrompt(value_167) {
    const currentYtLiveUser_168 = getCurrentYtLiveUser(),
        value_169 = window.getYtWorldBookContext
            ? window.getYtWorldBookContext(
                  getUserLiveTitle() +
                      `
` +
                      getUserLiveTopic() +
                      `
` +
                      JSON.stringify(value_167.prizes),
              )
            : '';
    return (
        `你正在模拟真实 YouTube 直播间宣布抽奖后的即时评论。
主播：` +
        (currentYtLiveUser_168.name || '我') +
        `
主播人设：` +
        (currentYtLiveUser_168.persona || '普通主播') +
        `
直播标题：` +
        getUserLiveTitle() +
        `
直播主题：` +
        getUserLiveTopic() +
        `
世界书：` +
        (value_169 || '无') +
        `
开奖剩余时间：` +
        value_167.durationSec +
        ` 秒
奖项：` +
        JSON.stringify(value_167.prizes) +
        `

生成不少于 10 条与本次抽奖直接相关、昵称不重复的短评论。评论者可以报名、期待、讨论奖品或围观；只有明确想参加抽奖的人 participates 才能为 true。至少一半评论必须来自使用英语、日语、韩语、法语、西班牙语等非中文语言的外国观众，外国观众使用符合其语言习惯的昵称和原文；非中文评论必须填写自然准确的简体中文 translationZh，中文评论的 translationZh 为空字符串。
只返回严格 JSON：{"comments":[{"name":"viewer name","text":"original comment","translationZh":"简体中文翻译或空字符串","participates":true}]}。comments 不少于 10 条，不要 Markdown，不要 emoji。`
    );
}
function buildUserLiveLotteryFollowupPrompt(value_170) {
    const currentYtLiveUser_171 = getCurrentYtLiveUser(),
        value_172 = window.getYtWorldBookContext
            ? window.getYtWorldBookContext(
                  getUserLiveTitle() +
                      `
` +
                      getUserLiveTopic() +
                      `
` +
                      JSON.stringify(value_170.winners),
              )
            : '';
    return (
        `你正在模拟真实 YouTube 直播抽奖开奖后的观众反应。
主播：` +
        (currentYtLiveUser_171.name || '我') +
        `
主播人设：` +
        (currentYtLiveUser_171.persona || '普通主播') +
        `
直播标题：` +
        getUserLiveTitle() +
        `
直播主题：` +
        getUserLiveTopic() +
        `
世界书：` +
        (value_172 || '无') +
        `
奖项：` +
        JSON.stringify(value_170.prizes) +
        `
参与人数：` +
        value_170.participants.length +
        `
中奖结果：` +
        JSON.stringify(value_170.winners) +
        `

生成不少于 10 条短评论，必须同时包含中奖者的惊喜回应、未中奖者的反应和围观观众的祝贺或调侃；不得篡改中奖名单。至少一半评论使用英语、日语、韩语、法语、西班牙语等非中文语言，并使用符合语言地区的外国昵称。所有非中文评论必须填写自然准确的简体中文 translationZh，中文评论的 translationZh 为空字符串。
此外，每一位实际中奖者都要给主播发送 2 至 5 条连续私信。私信可以谈论本场直播或刚刚获得的奖品，语气要符合中奖后的即时反应。winnerName 必须逐字使用中奖结果中的昵称，不得给未中奖者生成私信；同一中奖者的 messages 数量必须在 2 到 5 条之间。私信若不是中文，translationZh 必须提供自然准确的简体中文；中文私信的 translationZh 为空字符串。
只返回严格 JSON：{"comments":[{"name":"viewer name","text":"original comment","translationZh":"简体中文翻译或空字符串"}],"winnerDMs":[{"winnerName":"中奖者原昵称","messages":[{"text":"私信原文","translationZh":"简体中文翻译或空字符串"}]}]}。comments 不少于 10 条；每位中奖者必须各有 2 至 5 条 messages；不要 Markdown，不要 emoji。`
    );
}
function normalizeUserLiveLotteryWinnerDmBatches(lottery_9, value_174) {
    const winners_4 = Array.isArray(lottery_9?.winners) ? lottery_9.winners : [],
        winnerNames = [
            ...new Set(
                winners_4.map((winner_3) => String(winner_3?.name || '').trim()).filter(Boolean),
            ),
        ];
    if (winnerNames.length === 0) return [];
    const source_4 = Array.isArray(value_174) ? value_174 : [];
    return winnerNames.map((winnerName_2) => {
        const normalizedWinnerName = winnerName_2.toLocaleLowerCase(),
            batch = source_4.find(
                (item_10) =>
                    String(item_10?.winnerName || item_10?.name || '')
                        .trim()
                        .toLocaleLowerCase() === normalizedWinnerName,
            ),
            messages_2 = (Array.isArray(batch?.messages) ? batch.messages : [])
                .map((message_2) => {
                    if (typeof message_2 === 'string')
                        return {
                            text: message_2.trim(),
                            translationZh: '',
                        };
                    return {
                        text: String(message_2?.text || message_2?.content || '').trim(),
                        translationZh: String(message_2?.translationZh || '').trim(),
                    };
                })
                .filter((message_3) => message_3.text)
                .slice(0, 5);
        if (messages_2.length < 2) throw new Error('TOO_FEW_WINNER_DMS:' + winnerName_2);
        return {
            winnerName: winnerName_2,
            messages: messages_2,
        };
    });
}
function appendUserLiveLotteryWinnerDms(lottery_10, items_186) {
    const lotteryId_2 = String(lottery_10?.id || '').trim();
    if (!lotteryId_2 || lottery_10?.winnerDmsAppliedAt) return;
    const now_188 = Date.now();
    items_186.forEach((batch_2, batchIndex) => {
        const normalizedName_2 = batch_2.winnerName.toLocaleLowerCase();
        let contact_2 = mockSubscriptions.find(
            (sub_2) =>
                String(sub_2?.name || '')
                    .trim()
                    .toLocaleLowerCase() === normalizedName_2 && !sub_2?.isBusiness,
        );
        if (!contact_2) {
            const id_3 = createStableYtChannelId(
                'lottery-winner-' + batch_2.winnerName,
                'yt_lottery_winner',
            );
            contact_2 = {
                id: id_3,
                name: batch_2.winnerName,
                handle:
                    'lottery_' +
                    String(id_3)
                        .replace(/[^a-zA-Z0-9_]/g, '')
                        .slice(-24),
                avatar:
                    'https://picsum.photos/seed/' + encodeURIComponent(id_3) + '/80/80?grayscale',
                desc: '直播抽奖观众',
                isFriend: false,
                isBusiness: false,
                isSubscribed: false,
                dmHistory: [],
            };
            mockSubscriptions.unshift(contact_2);
        }
        if (!Array.isArray(contact_2.dmHistory)) contact_2.dmHistory = [];
        batch_2.messages.forEach((message_4, messageIndex) => {
            contact_2.dmHistory.push({
                type: 'char',
                name: batch_2.winnerName,
                text: message_4.text,
                translationZh: message_4.translationZh,
                timestamp: now_188 + batchIndex * 10 + messageIndex,
                lotteryId: lotteryId_2,
            });
        });
        typeof window.markYtMessagesUnread === 'function'
            ? window.markYtMessagesUnread(contact_2, batch_2.messages.length)
            : (contact_2.unreadDmCount =
                  Math.max(0, Math.round(Number(contact_2.unreadDmCount) || 0)) +
                  batch_2.messages.length);
    });
    lottery_10.winnerDmsAppliedAt = now_188;
    window.updateYtMessageUnreadIndicators?.();
    if (typeof renderMessagesList === 'function') renderMessagesList();
}
function scheduleUserLiveLotteryComments(value_196, options_2 = {}) {
    const items_198 = Array.isArray(value_196) ? value_196 : [];
    items_198.forEach((comment_3, value_200) => {
        setTimeout(() => {
            const name_5 = String(comment_3?.name || '观众' + (value_200 + 1)).trim(),
                text_4 = String(comment_3?.text || comment_3?.content || '').trim();
            if (!text_4) return;
            if (channelState?.activeUserLive)
                addUserLiveChatMessage(name_5, text_4, null, null, comment_3?.translationZh);
            else {
                const latestPastVideo = Array.isArray(channelState?.pastVideos)
                    ? channelState.pastVideos[0]
                    : null;
                latestPastVideo &&
                    ((latestPastVideo.comments = Array.isArray(latestPastVideo.comments)
                        ? latestPastVideo.comments
                        : []),
                    latestPastVideo.comments.push({
                        name: name_5,
                        text: text_4,
                        translationZh: String(comment_3?.translationZh || '').trim(),
                        amount: null,
                        color: null,
                    }),
                    saveYoutubeData());
            }
            options_2.collectParticipants &&
                comment_3?.participates === true &&
                addUserLiveLotteryParticipant(name_5, options_2.source || 'lottery-api');
        }, 180 * value_200);
    });
}
async function requestUserLiveLotteryLaunchComments(value_204) {
    try {
        const value_205 = await requestUserLiveLotteryJson(
                buildUserLiveLotteryLaunchPrompt(value_204),
            ),
            comments_2 = Array.isArray(value_205?.comments)
                ? value_205.comments.filter((message_207) =>
                      String(message_207?.text || message_207?.content || '').trim(),
                  )
                : [];
        if (comments_2.length < 10) throw new Error('TOO_FEW_LOTTERY_COMMENTS');
        comments_2
            .filter((comment) => comment?.participates === true)
            .forEach((comment_4) => {
                addUserLiveLotteryParticipant(comment_4.name, 'lottery-launch-api');
            });
        scheduleUserLiveLotteryComments(comments_2, {
            collectParticipants: false,
        });
    } catch (error_2) {
        console.error('User live lottery launch comments failed:', error_2);
        if (window.showToast) window.showToast('抽奖互动生成失败，抽奖仍会继续');
    }
}
async function requestUserLiveLotteryFollowup(lottery_11) {
    try {
        const parsed = await requestUserLiveLotteryJson(
                buildUserLiveLotteryFollowupPrompt(lottery_11),
            ),
            comments_3 = Array.isArray(parsed?.comments)
                ? parsed.comments.filter((message_213) =>
                      String(message_213?.text || message_213?.content || '').trim(),
                  )
                : [];
        if (comments_3.length < 10) throw new Error('TOO_FEW_LOTTERY_FOLLOWUP_COMMENTS');
        const winnerDmBatches = normalizeUserLiveLotteryWinnerDmBatches(
            lottery_11,
            parsed?.winnerDMs,
        );
        appendUserLiveLotteryWinnerDms(lottery_11, winnerDmBatches);
        scheduleUserLiveLotteryComments(comments_3, {
            collectParticipants: false,
        });
        lottery_11.followupStatus = 'succeeded';
    } catch (error_3) {
        console.error('User live lottery follow-up failed:', error_3);
        lottery_11.followupStatus = 'failed';
        if (window.showToast) window.showToast('开奖结果已保存，后续互动生成失败');
    } finally {
        String(channelState?.activeUserLive?.lottery?.id || '') === String(lottery_11.id || '')
            ? persistActiveUserLive({
                  lottery: lottery_11,
              })
            : saveYoutubeData();
    }
    if (dcReceivedGiftsList) {
        const receivedGifts_2 = channelState.dataCenter.receivedGifts;
        receivedGifts_2.length === 0
            ? (dcReceivedGiftsList.innerHTML =
                  '<div style="padding: 16px; text-align: center; color: #8e8e93; font-size: 14px;">暂无获得的礼物</div>')
            : (dcReceivedGiftsList.innerHTML = receivedGifts_2
                  .map((gift) => {
                      const name_6 = escapeYtUserLiveHtml(gift?.name || '神秘礼物'),
                          fromName_2 = escapeYtUserLiveHtml(gift?.fromName || '主播'),
                          receivedAt_2 = Number(gift?.receivedAt)
                              ? new Date(Number(gift.receivedAt)).toLocaleString('zh-CN')
                              : '刚刚',
                          value_220 =
                              gift?.type === 'cash' && Number(gift?.cashAmount) > 0
                                  ? ' · ¥' + Number(gift.cashAmount).toFixed(2) + ' 已收入 Pay'
                                  : '';
                      return (
                          `
                        <div class="settings-item" style="padding:12px 16px;">
                            <div style="width:36px;height:36px;border-radius:50%;margin-right:12px;flex-shrink:0;background:#fff0f3;color:#ff0033;display:flex;align-items:center;justify-content:center;">
                                <i class="fas fa-gift"></i>
                            </div>
                            <div style="flex:1;min-width:0;">
                                <div style="font-weight:600;font-size:15px;color:#000;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">` +
                          name_6 +
                          `</div>
                                <div style="font-size:12px;color:#8e8e93;margin-top:2px;">来自 ` +
                          fromName_2 +
                          value_220 +
                          ' · ' +
                          escapeYtUserLiveHtml(receivedAt_2) +
                          `</div>
                            </div>
                        </div>`
                      );
                  })
                  .join(''));
    }
}
async function finalizeUserLiveLottery() {
    const lottery_12 = getActiveUserLiveLottery();
    if (!lottery_12 || lottery_12.status !== 'active' || isFinalizingUserLiveLottery) return;
    isFinalizingUserLiveLottery = true;
    try {
        lottery_12.status = 'completed';
        lottery_12.completedAt = Date.now();
        lottery_12.winners = drawUserLiveLotteryWinners(lottery_12);
        lottery_12.followupStatus = 'requesting';
        lottery_12.followupRequestedAt = Date.now();
        persistActiveUserLive({
            lottery: lottery_12,
        });
        stopUserLiveLotteryTimer();
        renderUserLiveLotteryStatus();
        renderUserLiveLotteryResult(lottery_12, true);
        requestUserLiveLotteryFollowup(lottery_12);
    } finally {
        isFinalizingUserLiveLottery = false;
    }
}
function closeUserLiveLotteryResult() {
    userLiveLotteryResultModal?.classList.remove('active');
}
function openUserLiveLotterySetup() {
    if (isUserLiveLotteryActive()) {
        renderUserLiveLotteryStatus(true);
        if (window.showToast) window.showToast('当前抽奖正在进行中');
        return;
    }
    if (userLiveLotteryDuration) userLiveLotteryDuration.value = '30';
    renderUserLiveLotteryPrizeRows();
    userLiveLotterySheet?.classList.add('active');
}
if (userLiveLotteryBtn) {
    const activateLotteryButton = (event_3) => {
        event_3?.stopPropagation();
        openUserLiveLotterySetup();
    };
    userLiveLotteryBtn.addEventListener('click', activateLotteryButton);
    userLiveLotteryBtn.addEventListener('keydown', (event_4) => {
        if (event_4.key !== 'Enter' && event_4.key !== ' ') return;
        event_4.preventDefault();
        activateLotteryButton(event_4);
    });
}
userLiveLotteryAddPrize &&
    userLiveLotteryAddPrize.addEventListener('click', () => {
        const currentRows = userLiveLotteryPrizes
            ? Array.from(userLiveLotteryPrizes.querySelectorAll('.yt-user-live-lottery-prize-row'))
            : [];
        if (currentRows.length >= 10) {
            if (window.showToast) window.showToast('最多设置 10 个奖项');
            return;
        }
        const currentPrizes = currentRows.map((row_3, index_5) => ({
            id: row_3.dataset.prizeId,
            name:
                row_3.querySelector('.yt-lottery-prize-name')?.value ||
                getUserLiveLotteryPrizeName(index_5),
            type:
                row_3.querySelector('.yt-lottery-prize-type')?.value === 'cash' ? 'cash' : 'custom',
            prize: row_3.querySelector('.yt-lottery-prize-content')?.value || '',
            amount: row_3.querySelector('.yt-lottery-prize-amount')?.value || 0,
            winnerCount: row_3.querySelector('.yt-lottery-prize-count')?.value || 1,
        }));
        currentPrizes.push(createDefaultUserLiveLotteryPrize(currentPrizes.length));
        renderUserLiveLotteryPrizeRows(currentPrizes);
    });
userLiveLotteryClose?.addEventListener('click', closeUserLiveLotterySheet);
userLiveLotterySheet?.addEventListener('mousedown', (event_226) => {
    if (event_226.target === userLiveLotterySheet) closeUserLiveLotterySheet();
});
userLiveLotteryResultClose?.addEventListener('click', closeUserLiveLotteryResult);
userLiveLotteryResultConfirm?.addEventListener('click', closeUserLiveLotteryResult);
userLiveLotteryResultModal?.addEventListener('mousedown', (event_227) => {
    if (event_227.target === userLiveLotteryResultModal) closeUserLiveLotteryResult();
});
userLiveLotteryConfirm &&
    userLiveLotteryConfirm.addEventListener('click', async () => {
        if (isUserLiveLotteryActive()) {
            closeUserLiveLotterySheet();
            renderUserLiveLotteryStatus(true);
            return;
        }
        if (!window.apiConfig?.endpoint || !window.apiConfig?.apiKey) {
            if (window.showToast) window.showToast('请先配置 API');
            return;
        }
        const config = collectUserLiveLotteryConfig();
        if (!config || !channelState?.activeUserLive) return;
        if (config.totalCashAmount > 0) {
            if (
                typeof window.getPayBalance !== 'function' ||
                typeof window.addPayTransaction !== 'function'
            ) {
                if (window.showToast) window.showToast('Pay 尚未加载，暂时无法发放金额奖品');
                return;
            }
            const payBalance = Number(window.getPayBalance());
            if (!Number.isFinite(payBalance) || payBalance < config.totalCashAmount) {
                if (window.showToast)
                    window.showToast('Pay 余额不足，需要 ¥' + config.totalCashAmount.toFixed(2));
                return;
            }
        }
        const createdAt_2 = Date.now(),
            lottery_13 = {
                id:
                    'user_live_lottery_' +
                    createdAt_2 +
                    '_' +
                    Math.random().toString(36).slice(2, 8),
                status: 'active',
                createdAt: createdAt_2,
                endAt: createdAt_2 + config.durationSec * 1000,
                durationSec: config.durationSec,
                prizes: config.prizes,
                participants: [],
                winners: [],
                simulatedTargetParticipants: Math.min(
                    getUserLiveOnlineViewerLimit(),
                    Math.max(
                        config.prizes.reduce(
                            (total_4, prize_7) => total_4 + prize_7.winnerCount,
                            0,
                        ),
                        Math.round(getUserLiveOnlineViewerLimit() * (0.35 + Math.random() * 0.3)),
                    ),
                ),
                payAmountCharged: config.totalCashAmount,
                payChargedAt: null,
                followupStatus: 'pending',
            };
        userLiveLotteryConfirm.disabled = true;
        try {
            if (config.totalCashAmount > 0) {
                const paid = window.addPayTransaction(
                    config.totalCashAmount,
                    'YouTube 直播抽奖奖金',
                    'expense',
                );
                if (!paid) {
                    if (window.showToast) window.showToast('Pay 扣款失败，抽奖未开始');
                    return;
                }
                lottery_13.payChargedAt = Date.now();
            }
            persistActiveUserLive({
                lottery: lottery_13,
            });
            closeUserLiveLotterySheet();
            closeUserLiveLotteryResult();
            startUserLiveLotteryTimer();
            requestUserLiveLotteryLaunchComments(lottery_13);
        } finally {
            userLiveLotteryConfirm.disabled = false;
        }
    });
function buildUserLiveCommentTextHtml(comment_5, value_234 = '#0f0f0f') {
    const translationZh_4 = String(comment_5?.translationZh || '').trim();
    return (
        `
            <span style="color:` +
        value_234 +
        ';">' +
        escapeYtUserLiveHtml(comment_5?.text || '') +
        `</span>
            ` +
        (translationZh_4
            ? '<span class="yt-user-live-comment-translation-toggle" role="button" tabindex="0">翻译</span><span class="yt-user-live-comment-translation" hidden>' +
              escapeYtUserLiveHtml(translationZh_4) +
              '</span>'
            : '') +
        `
        `
    );
}
function bindUserLiveCommentTranslation(row_4) {
    const toggle_2 = row_4?.querySelector('.yt-user-live-comment-translation-toggle'),
        translation_2 = row_4?.querySelector('.yt-user-live-comment-translation');
    if (!toggle_2 || !translation_2) return;
    const handleClick = () => {
        const shouldExpand = translation_2.hidden;
        translation_2.hidden = !shouldExpand;
        toggle_2.textContent = shouldExpand ? '收起翻译' : '翻译';
        toggle_2.setAttribute('aria-expanded', String(shouldExpand));
    };
    toggle_2.addEventListener('click', handleClick);
    toggle_2.addEventListener('keydown', (event_240) => {
        if (event_240.key !== 'Enter' && event_240.key !== ' ') return;
        event_240.preventDefault();
        handleClick();
    });
}
function renderUserLiveChatRow(comment_6, element_242 = userLiveChatContainer) {
    if (!userLiveChatContainer || !comment_6) return;
    const element_243 = document.createElement('div');
    element_243.className = element_242 === userLiveChatContainer ? 'yt-live-chat-row-anim' : '';
    if (comment_6.amount) {
        const value_244 =
            typeof comment_6.amount === 'number' || /^\d+(\.\d+)?$/.test(String(comment_6.amount))
                ? '￥' + comment_6.amount
                : comment_6.amount;
        element_243.classList.add('yt-user-live-superchat');
        element_243.style.backgroundColor = comment_6.color || '#8e8e93';
        element_243.style.padding = '8px 12px';
        element_243.style.borderRadius = '8px';
        element_243.style.marginBottom = '4px';
        element_243.innerHTML =
            `
                <div style="font-weight: bold; font-size: 13px; color: rgba(255,255,255,0.9); margin-bottom: 4px;">` +
            escapeYtUserLiveHtml(comment_6.name || '') +
            ' <span style="margin-left: 8px;">' +
            escapeYtUserLiveHtml(value_244) +
            `</span></div>
                <div style="font-size: 14px; color: #fff;">` +
            buildUserLiveCommentTextHtml(comment_6, '#fff') +
            `</div>
            `;
    } else {
        const items_245 = ['#333333', '#4d4d4d', '#666666', '#808080', '#999999', '#b3b3b3'],
            value_246 = items_245[Math.floor(Math.random() * items_245.length)];
        element_243.style.display = 'flex';
        element_243.style.gap = '8px';
        element_243.style.alignItems = 'flex-start';
        element_243.style.marginBottom = '12px';
        element_243.innerHTML =
            `
                <div style="width:24px; height:24px; border-radius:50%; background-color:` +
            value_246 +
            `; display:flex; justify-content:center; align-items:center; color:#fff; font-size:10px; font-weight:bold; flex-shrink:0;">
                    ` +
            escapeYtUserLiveHtml(
                comment_6.name && comment_6.name.length > 0 ? comment_6.name[0].toUpperCase() : '?',
            ) +
            `
                </div>
                <div style="font-size:13px; margin-top:2px;">
                    <span style="font-size:12px; margin-right:4px; color:#606060;">` +
            escapeYtUserLiveHtml(comment_6.name || '') +
            `</span>
                    ` +
            buildUserLiveCommentTextHtml(comment_6) +
            `
                </div>
            `;
    }
    bindUserLiveCommentTranslation(element_243);
    element_242.appendChild(element_243);
    if (element_242 === userLiveChatContainer)
        userLiveChatContainer.scrollTop = userLiveChatContainer.scrollHeight;
}
function syncUserLiveChatRows() {
    if (!userLiveChatContainer || !isUserLiveVisible()) return;
    userLiveChatContainer.replaceChildren();
    const documentFragment = document.createDocumentFragment();
    userLiveComments.forEach((value_247) => renderUserLiveChatRow(value_247, documentFragment));
    userLiveChatContainer.appendChild(documentFragment);
    userLiveChatContainer.scrollTop = userLiveChatContainer.scrollHeight;
    userLiveChatNeedsRefresh = false;
}
window.refreshYtUserLiveUi = function () {
    if (!isUserLiveVisible()) return;
    if (userLiveChatNeedsRefresh) syncUserLiveChatRows();
    renderUserLiveLotteryStatus();
};
function restoreActiveUserLiveState() {
    const activeLive = channelState && channelState.activeUserLive;
    if (!activeLive || typeof activeLive !== 'object') return;
    userLiveBgUrl = activeLive.backgroundUrl || activeLive.thumbnail || '';
    userLiveHistory = Array.isArray(activeLive.history) ? [...activeLive.history] : [];
    userLiveComments = Array.isArray(activeLive.comments) ? [...activeLive.comments] : [];
    userLiveTotalSC = Number(activeLive.totalSC) || 0;
    userLiveTotalViews = Number(activeLive.totalViews) || 0;
    userLiveMaxHot = Number(activeLive.maxHot) || userLiveTotalViews;
    userLiveNewSubs = Number(activeLive.newSubs) || 0;
    userLiveSessionId = activeLive.liveSessionId || activeLive.id || null;
    getUserLiveConnections();
    const restoredGuests = activeLive.connections
        .map((item_11) => item_11.participant)
        .filter(Boolean);
    window.setUserLiveSelectedGuests?.(
        restoredGuests.length ? restoredGuests : activeLive.guests || [],
    );
    const titleInput_2 = document.getElementById('yt-user-live-title-input'),
        topicInput_2 = document.getElementById('yt-user-live-topic-input'),
        titleDisplay = document.getElementById('yt-user-live-title-display'),
        bgDisplay = document.getElementById('yt-user-live-bg-display'),
        ytUserLiveViewsDisplayElement = document.getElementById('yt-user-live-views-display');
    if (titleInput_2) titleInput_2.value = activeLive.title || '';
    if (topicInput_2) topicInput_2.value = activeLive.desc || '';
    if (titleDisplay) titleDisplay.textContent = activeLive.title || '我的直播间';
    userLiveBgImg &&
        userLiveBgUrl &&
        ((userLiveBgImg.src = userLiveBgUrl), (userLiveBgImg.style.display = 'block'));
    if (bgDisplay) bgDisplay.src = userLiveBgUrl || 'https://picsum.photos/900/600';
    if (ytUserLiveViewsDisplayElement)
        ytUserLiveViewsDisplayElement.textContent =
            activeLive.views || userLiveTotalViews + ' 人正在观看';
    const guestNameInput = document.getElementById('yt-user-live-guest-name');
    if (guestNameInput)
        guestNameInput.value = restoredGuests.length
            ? restoredGuests.map((item_12) => item_12.name).join('、')
            : '无';
    userLiveChatNeedsRefresh = true;
    syncUserLiveChatRows();
    const restoredLottery = activeLive.lottery;
    if (restoredLottery?.status === 'active') startUserLiveLotteryTimer();
    else {
        renderUserLiveLotteryStatus();
        if (restoredLottery?.status === 'completed')
            renderUserLiveLotteryResult(restoredLottery, false);
    }
    scheduleUserLiveConnectionRestore();
}
window.openYtUserLiveView = function () {
    if (typeof window.releaseYtChatKeyboardLock === 'function')
        window.releaseYtChatKeyboardLock(userLiveView);
    const playerView = document.getElementById('yt-video-player-view');
    if (playerView) playerView.classList.remove('active', 'yt-char-live-mode');
    if (userLiveView) userLiveView.classList.add('active');
    window.refreshYtUserLiveUi();
    requestAnimationFrame(positionUserLiveLotteryStatus);
    scheduleUserLiveConnectionRestore();
    window.resetYtViewportOffset?.();
};
window.addEventListener('resize', positionUserLiveLotteryStatus);
window.visualViewport?.addEventListener('resize', positionUserLiveLotteryStatus);
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) window.refreshYtUserLiveUi();
});
[
    userLiveVideoArea,
    userLiveBackBtn,
    userLiveMinimizeBtn,
    userLiveLotteryBtn,
    document.getElementById('yt-user-live-views-display'),
    userLiveTriggerApiBtn,
    userLiveConnectBtn,
    userLiveConnectionCard,
    userLiveChatContainer,
    userLiveChatInput,
    userLiveChatSend,
]
    .filter(Boolean)
    .forEach((el) => {
        el.addEventListener('click', stopUserLiveControlEvent);
        el.addEventListener('pointerdown', stopUserLiveControlEvent);
    });
if (userLiveChatContainer) {
    let isDraggingUserLive = false;
    userLiveChatContainer.addEventListener(
        'touchstart',
        () => {
            isDraggingUserLive = false;
        },
        {
            passive: true,
        },
    );
    userLiveChatContainer.addEventListener(
        'touchmove',
        () => {
            isDraggingUserLive = true;
        },
        {
            passive: true,
        },
    );
    userLiveChatContainer.addEventListener('touchend', () => {
        if (isDraggingUserLive) {
            if (userLiveChatInput && document.activeElement === userLiveChatInput)
                userLiveChatInput.blur();
        }
    });
    userLiveChatContainer.addEventListener('click', () => {
        if (userLiveChatInput && document.activeElement === userLiveChatInput)
            userLiveChatInput.blur();
    });
}
userLiveBackBtn &&
    userLiveBackBtn.addEventListener('click', () => {
        if (userLiveChatInput && document.activeElement === userLiveChatInput)
            userLiveChatInput.blur();
    });
userLiveChatInput &&
    (userLiveChatInput.addEventListener('focus', () => {
        if (typeof window.setYtChatKeyboardLock === 'function')
            window.setYtChatKeyboardLock(userLiveView, true);
        else {
            if (userLiveView) userLiveView.classList.add('keyboard-open');
        }
    }),
    userLiveChatInput.addEventListener('blur', () => {
        if (typeof window.setYtChatKeyboardLock === 'function')
            window.setYtChatKeyboardLock(userLiveView, false);
        else {
            if (userLiveView) userLiveView.classList.remove('keyboard-open');
        }
        window.resetYtViewportOffset?.();
    }));
restoreActiveUserLiveState();
window.youtubeDataReadyPromise &&
    typeof window.youtubeDataReadyPromise.then === 'function' &&
    window.youtubeDataReadyPromise.then(() => restoreActiveUserLiveState())['catch'](() => {});
startUserLiveBtn &&
    startUserLiveBtn.addEventListener('click', () => {
        userLiveComments = [];
        userLiveTotalSC = 0;
        userLiveTotalViews = Math.floor(Math.random() * 500) + 100;
        userLiveMaxHot = userLiveTotalViews;
        userLiveNewSubs = 0;
        userLiveSessionId = 'user_live_' + Date.now();
        stopUserLiveLotteryTimer();
        const initialGuests = getSelectedUserLiveGuests().slice(0, 3);
        persistActiveUserLive({
            minimized: false,
            lottery: null,
            connection: null,
            connections: [],
            connectionHistory: [],
        });
        renderUserLiveLotteryStatus();
        const viewsEl = document.getElementById('yt-user-live-views-display');
        if (viewsEl) viewsEl.textContent = userLiveTotalViews + ' 人正在观看';
        initialGuests.forEach(beginUserLiveConnection);
        if (initialGuests.length === 0) renderUserLiveConnections();
    });
userLiveMinimizeBtn &&
    userLiveMinimizeBtn.addEventListener('click', () => {
        if (typeof window.releaseYtChatKeyboardLock === 'function')
            window.releaseYtChatKeyboardLock();
        if (userLiveView) userLiveView.classList.remove('active');
        stopUserLiveConnectionTimers();
        if (window.showToast) window.showToast('直播已最小化并在后台运行');
        const effectiveYtUser = getCurrentYtLiveUser();
        if (effectiveYtUser) {
            persistActiveUserLive({
                minimized: true,
            });
            if (typeof rebuildYoutubeMockVideos === 'function') rebuildYoutubeMockVideos();
            else {
                const index_258 = mockVideos.findIndex(
                    (value_260) =>
                        value_260.channelData && value_260.channelData.id === 'user_channel_id',
                );
                if (index_258 > -1) mockVideos.splice(index_258, 1);
                const activeLive_2 = channelState.activeUserLive;
                mockVideos.unshift({
                    title: activeLive_2.title,
                    desc: activeLive_2.desc,
                    views: activeLive_2.views,
                    time: 'LIVE',
                    thumbnail: activeLive_2.thumbnail,
                    isLive: true,
                    comments: activeLive_2.comments || [],
                    initialBubbles: [],
                    guest:
                        activeLive_2.connections?.[0]?.participant ||
                        activeLive_2.guests?.[0] ||
                        null,
                    channelData: {
                        id: 'user_channel_id',
                        name: effectiveYtUser.name || '我',
                        avatar: effectiveYtUser.avatarUrl || 'https://picsum.photos/80/80',
                        subs: effectiveYtUser.subs || '0',
                    },
                });
            }
            renderVideos();
        }
    });
const userLiveSummarySheet = document.getElementById('yt-user-live-summary-sheet'),
    ytSummaryConfirmBtn = document.getElementById('yt-summary-confirm-btn');
userLiveSummarySheet &&
    userLiveSummarySheet.addEventListener('mousedown', (event_261) => {
        if (event_261.target === userLiveSummarySheet)
            userLiveSummarySheet.classList.remove('active');
    });
ytSummaryConfirmBtn &&
    userLiveSummarySheet &&
    ytSummaryConfirmBtn.addEventListener('click', () => {
        userLiveSummarySheet.classList.remove('active');
        const value_262 =
            userLiveSessionId ||
            channelState.activeUserLive?.liveSessionId ||
            'user_live_' + Date.now();
        archiveAllUserLiveConnections();
        const communityGrowth =
                typeof window.applyYtUserCommunityLiveGrowth === 'function'
                    ? window.applyYtUserCommunityLiveGrowth({
                          liveId: value_262,
                          newSubs: userLiveNewSubs,
                          totalViews: userLiveTotalViews,
                      })
                    : 0,
            index_264 = mockVideos.findIndex(
                (value_273) =>
                    value_273.channelData && value_273.channelData.id === 'user_channel_id',
            );
        if (index_264 > -1) mockVideos.splice(index_264, 1);
        !channelState.dataCenter &&
            (channelState.dataCenter = {
                views: 0,
                sc: 0,
                subs: 0,
            });
        channelState.dataCenter.views += userLiveTotalViews;
        channelState.dataCenter.sc += userLiveTotalSC;
        if (!channelState.dataCenter.subs) channelState.dataCenter.subs = 0;
        channelState.dataCenter.subs += userLiveNewSubs;
        const effectiveYtUser_2 = getCurrentYtLiveUser();
        if (effectiveYtUser_2) {
            const currentSubsNum = parseSubs(effectiveYtUser_2.subs);
            effectiveYtUser_2.subs = formatSubs(currentSubsNum + userLiveNewSubs);
            const currentNumStr = (effectiveYtUser_2.videos || '0').replace(/[^0-9]/g, '');
            let currentNum = parseInt(currentNumStr) || 0;
            effectiveYtUser_2.videos = (currentNum + 1).toString();
            ytUserState = effectiveYtUser_2;
            syncYtProfile();
        }
        if (!channelState.pastVideos) channelState.pastVideos = [];
        const ytUserLiveTitleInputElement_266 = document.getElementById('yt-user-live-title-input'),
            title_2 =
                ytUserLiveTitleInputElement_266 && ytUserLiveTitleInputElement_266.value
                    ? ytUserLiveTitleInputElement_266.value
                    : '我的直播间',
            topicInput_3 = document.getElementById('yt-user-live-topic-input'),
            desc_2 = topicInput_3 && topicInput_3.value ? topicInput_3.value : '',
            comments_4 = [...userLiveComments],
            pastVid = {
                id: 'yt-user-replay-' + value_262 + '-' + Date.now(),
                sourceLiveId: value_262,
                isLiveReplay: true,
                title: title_2,
                desc: desc_2,
                views: userLiveTotalViews + ' 次观看',
                time: '刚刚',
                thumbnail:
                    userLiveBgUrl || 'https://picsum.photos/seed/user_past/320/180?grayscale',
                comments: comments_4,
                realtimeCommentCount: comments_4.length,
                liveTranscript: Array.isArray(userLiveHistory)
                    ? userLiveHistory.map((item_13) => ({
                          ...item_13,
                      }))
                    : [],
                guest: channelState.activeUserLive?.connectionHistory?.[0]?.participant || null,
                participants: (channelState.activeUserLive?.connectionHistory || []).map(
                    (item_14) => ({
                        ...(item_14.participant || {}),
                    }),
                ),
                connectionHistory: Array.isArray(channelState.activeUserLive?.connectionHistory)
                    ? channelState.activeUserLive.connectionHistory.map((item_15) => ({
                          ...item_15,
                          participant: {
                              ...(item_15?.participant || {}),
                          },
                          transcript: Array.isArray(item_15?.transcript)
                              ? item_15.transcript.map((entry) => ({
                                    ...entry,
                                }))
                              : [],
                      }))
                    : [],
                lottery: channelState.activeUserLive?.lottery || null,
            };
        channelState.pastVideos.unshift(pastVid);
        const archivedGuests = [
            ...new Map(
                (channelState.activeUserLive?.connectionHistory || [])
                    .map((item_16) => item_16.participant)
                    .filter(Boolean)
                    .map((item_17) => [String(item_17.imCharId || item_17.id), item_17]),
            ).values(),
        ];
        archivedGuests.forEach((selectedLiveGuest) => {
            if (selectedLiveGuest.guestSource !== 'tiktok-following') {
                const guestSub = mockSubscriptions.find((s) => s.id === selectedLiveGuest.id);
                if (guestSub) {
                    !guestSub.generatedContent &&
                        (guestSub.generatedContent = {
                            pastVideos: [],
                            communityPosts: [],
                            currentLive: null,
                            fanGroup: null,
                        });
                    if (!guestSub.generatedContent.pastVideos)
                        guestSub.generatedContent.pastVideos = [];
                    guestSub.generatedContent.pastVideos.unshift({
                        title: '【联动录播】' + title_2,
                        views: Math.floor(userLiveTotalViews * 0.8) + ' 次观看',
                        time: '刚刚',
                        thumbnail: pastVid.thumbnail,
                        comments: [
                            {
                                name: effectiveYtUser_2.name || '我',
                                text: '这把打得不错！',
                            },
                        ],
                        guest: {
                            name: effectiveYtUser_2.name || '我',
                        },
                    });
                }
            }
        });
        stopUserLiveLotteryTimer();
        renderUserLiveLotteryStatus();
        channelState.activeUserLive = null;
        saveYoutubeData();
        window.showToast &&
            window.showToast(
                communityGrowth > 0
                    ? '录播已保存，社群新增 ' + communityGrowth + ' 人'
                    : '录播已保存至往期记录',
            );
        renderVideos();
        const activeTab = document.querySelector('#profile-main-tabs .yt-sliding-tab.active');
        activeTab && activeTab.getAttribute('data-target') === 'past' && activeTab.click();
    });
if (userLiveChatSend && userLiveChatInput) {
    const sendAction = () => {
        const text_5 = userLiveChatInput.value.trim();
        if (!text_5) return;
        const effectiveHost = getCurrentYtLiveUser(),
            hostTurn = normalizeUserLiveTranscriptItem({
                speakerType: 'user',
                speakerId: effectiveHost.id || 'user_channel_id',
                name: effectiveHost.name || '我',
                text: text_5,
                kind: 'speech',
            });
        userLiveHistory.push({
            type: 'host',
            senderType: 'user',
            ...hostTurn,
        });
        getActiveUserLiveConnections().forEach((connection_13) => {
            appendUserLiveConnectionTranscript(connection_13.id, hostTurn, {
                includeLiveHistory: false,
            });
        });
        const element_285 = document.createElement('div');
        element_285.className = 'yt-user-live-bubble';
        element_285.textContent = text_5;
        userLiveBubblesContainer.appendChild(element_285);
        setTimeout(() => {
            element_285.style.opacity = '0';
            element_285.style.transition = 'opacity 1s ease';
            setTimeout(() => element_285.remove(), 1000);
        }, 8000);
        userLiveChatInput.value = '';
        persistActiveUserLive();
    };
    userLiveChatSend.addEventListener('click', sendAction);
    userLiveChatSend.addEventListener('keydown', (event_287) => {
        if (event_287.key !== 'Enter' && event_287.key !== ' ') return;
        event_287.preventDefault();
        sendAction();
    });
    window.mobileInputCompat?.register({
        input: userLiveChatInput,
        root: userLiveView,
        scrollContainer: userLiveChatContainer,
        onSend: sendAction,
        allowEmpty: true,
        openClasses: ['keyboard-open', 'yt-chat-keyboard-lock'],
    });
}
function buildUserLiveAudiencePrompt() {
    const effectiveYtUser_3 = getCurrentYtLiveUser(),
        hostName_2 = effectiveYtUser_3.name || '我',
        hostPersona = effectiveYtUser_3.persona || effectiveYtUser_3.desc || '普通主播',
        userLiveTitle = getUserLiveTitle(),
        userLiveTopic = getUserLiveTopic(),
        recentHostMsg =
            userLiveHistory
                .filter((item_18) => item_18?.type === 'host')
                .slice(-5)
                .map((m) => m.text)
                .filter(Boolean)
                .join(' | ') || '刚开播，还没有明显发言',
        activeConnections_2 = getActiveUserLiveConnections(),
        value_292 = window.getYtWorldBookContext
            ? window.getYtWorldBookContext(
                  hostName_2 +
                      `
` +
                      hostPersona +
                      `
` +
                      userLiveTitle +
                      `
` +
                      userLiveTopic,
              )
            : '',
        connectionHistory_3 = Array.isArray(channelState?.activeUserLive?.connectionHistory)
            ? channelState.activeUserLive.connectionHistory
            : [],
        formatPublicSession = (value_304) => {
            const value_305 = value_304.participant || {},
                value_306 =
                    (value_304.transcript || [])
                        .map((item_19) => {
                            const label = item_19.kind === 'narrative' ? '公开动作' : '公开发言';
                            return (
                                label +
                                '｜' +
                                (item_19.name || value_305.name || '嘉宾') +
                                '：' +
                                (item_19.text || '')
                            );
                        })
                        .filter(Boolean).join(`
`) || '尚无公开发言';
            return (
                '会话 ' +
                (value_304.id || 'unknown') +
                '｜' +
                (value_305.name || '未知嘉宾') +
                '｜' +
                (value_304.endedAt ? '已结束' : '进行中') +
                `
` +
                value_306
            );
        },
        publicConnectionContext = [...connectionHistory_3, ...activeConnections_2].length
            ? [...connectionHistory_3, ...activeConnections_2].map(formatPublicSession).join(`

`)
            : '本场尚无连线公开记录。',
        join_296 = activeConnections_2.map((value_309) => {
            const participant_4 = value_309.participant || {},
                canonical =
                    (Array.isArray(mockSubscriptions) ? mockSubscriptions : []).find(
                        (item_20) =>
                            String(item_20?.id || '') === String(participant_4.id || '') ||
                            (item_20?.imCharId &&
                                participant_4.imCharId &&
                                String(item_20.imCharId) === String(participant_4.imCharId)),
                    ) || participant_4,
                persona_2 =
                    typeof window.getYtChannelPersonaWithRelationships === 'function'
                        ? window.getYtChannelPersonaWithRelationships(
                              canonical,
                              participant_4.persona || participant_4.desc || '未知',
                          )
                        : participant_4.persona || participant_4.desc || '未知';
            return (
                'participantId=' +
                (participant_4.imCharId || participant_4.id) +
                `
姓名=` +
                (participant_4.name || '未知') +
                `
完整人设与关系=` +
                persona_2
            );
        }).join(`

`),
        needsGuestTurns = activeConnections_2.length > 0,
        value_298 = value_292
            ? `
已挂载世界书内容：
` +
              value_292 +
              `
`
            : '',
        activeLottery = getActiveUserLiveLottery(),
        value_300 =
            activeLottery?.status === 'active'
                ? `
当前直播正在抽奖。剩余约 ` +
                  Math.max(0, Math.ceil((Number(activeLottery.endAt) - Date.now()) / 1000)) +
                  ' 秒。奖项：' +
                  JSON.stringify(activeLottery.prizes) +
                  `。每条评论必须额外返回 participates 布尔值，只有明确报名参加抽奖的人为 true；其他围观评论为 false。
`
                : '',
        join_301 = activeConnections_2
            .map((connection_14) => {
                const participantId_3 =
                    connection_14.participant?.imCharId || connection_14.participant?.id;
                return (
                    '{"participantId":"' +
                    participantId_3 +
                    '","bubbles":[{"text":"嘉宾原话","translationZh":"简体中文翻译或空字符串"}],"narrative":{"text":"公开环境或动作描写","translationZh":"简体中文翻译或空字符串"}}'
                );
            })
            .join(',');
    return (
        `你正在为一个真实 YouTube 直播间生成观众实时反应与连线嘉宾回应。
主播名：` +
        hostName_2 +
        `
主播人设：` +
        hostPersona +
        `
直播标题：` +
        userLiveTitle +
        `
直播主题：` +
        userLiveTopic +
        `
最近主播发言或动作：` +
        recentHostMsg +
        `
` +
        value_298 +
        value_300 +
        `
【所有人可见的连线公开记录】
` +
        publicConnectionContext +
        `

【仅供连线嘉宾扮演使用的私密角色资料】
` +
        (join_296 || '当前没有在线嘉宾。') +
        `
这部分私密角色资料只能用于对应 participantId 的 guestTurns，comments 和 superchats 绝对不能引用、暗示或泄露未在公开记录中出现的人设、关系和身份信息。

请根据主播人设、直播标题、主题、最近发言和联动信息，生成像真实 YouTube 直播间一样的即时评论、打赏和新订阅。
评论要短、有弹幕感，允许观众有不同语气、追问、吐槽、起哄、支持和轻微跑题，但要贴合当前直播。
观众可以自然回顾已结束连线的公开内容，例如提到错过刚才的联动，但不要强制每条评论都讨论旧连线。
观众要有明显的国际构成：comments 至少一半来自使用英语、日语、韩语、法语、西班牙语等非中文语言的外国观众，昵称也要符合对应语言地区。非中文内容保留原语言，并提供自然准确的简体中文 translationZh；中文内容的 translationZh 为空字符串。不要把所有评论都写成中文。

只返回严格 JSON，不要 Markdown，不要代码块，不要解释，不要 emoji。
JSON 结构必须完全符合：
{
  "comments": [
    {"name": "viewer name", "text": "original comment", "translationZh": "简体中文翻译或空字符串", "participates": false},
    {"name": "观众2", "text": "中文弹幕内容", "translationZh": "", "participates": false}
  ],
  "superchats": [
    {"name": "supporter name", "text": "original message", "translationZh": "简体中文翻译或空字符串", "displayAmount": "$50", "amount": 350, "color": "#e65100"}
  ],
  "newSubs": ["新粉丝A", "新粉丝B"]` +
        (needsGuestTurns
            ? `,
  "guestTurns": [` +
              join_301 +
              ']'
            : '') +
        `
}
约束：
1. comments 必须是 5 到 10 条
2. superchats 必须是 0 到 2 条，displayAmount 是带币种符号的展示金额，amount 是换算成人民币的纯数字
3. newSubs 可以是空数组，也可以是 1 到 3 个名字
4. 抽奖进行中时 comments 每项必须包含 participates；没有抽奖时一律为 false
5. comments 和 superchats 的非中文内容必须带 translationZh，中文内容不重复翻译
6. 所有句子自然短促，不要在句末堆标点` +
        (needsGuestTurns
            ? `
7. guestTurns 必须且只能覆盖以下在线 participantId，各一次且不能重复：` +
              activeConnections_2
                  .map((item_21) => item_21.participant?.imCharId || item_21.participant?.id)
                  .join('、') +
              `
8. 每个 guestTurns.bubbles 必须生成 3 到 8 条，只能使用该 participantId 的人设，禁止多人串位
9. 每个 guestTurns.narrative 必须有至少一条公开环境、动作或氛围描写；嘉宾使用自己的默认语言，非中文时提供 translationZh`
            : '')
    );
}
userLiveTriggerApiBtn &&
    (userLiveTriggerApiBtn.addEventListener('click', async () => {
        if (!window.apiConfig || !window.apiConfig.endpoint || !window.apiConfig.apiKey) {
            if (window.showToast) window.showToast('请配置API');
            return;
        }
        userLiveTriggerApiBtn.style.opacity = '0.5';
        userLiveTriggerApiBtn.style.pointerEvents = 'none';
        userLiveTriggerApiBtn.setAttribute('aria-busy', 'true');
        userLiveTriggerApiBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        const requestedConnections = getActiveUserLiveConnections().map((connection_15) => ({
                id: connection_15.id,
                participantId: String(
                    connection_15.participant?.imCharId || connection_15.participant?.id || '',
                ),
                startedAt: connection_15.startedAt,
            })),
            requestedConnectionSignature = requestedConnections
                .map(
                    (value_320) =>
                        value_320.id +
                        ':' +
                        value_320.participantId +
                        ':' +
                        (value_320.startedAt || ''),
                )
                .sort()
                .join('|');
        try {
            const chatCompletionsEndpoint_321 = window.u2Api.resolveChatCompletionsEndpoint(
                    window.apiConfig.endpoint,
                ),
                value_322 = await fetch(chatCompletionsEndpoint_321, {
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
                                content: buildUserLiveAudiencePrompt(),
                            },
                        ],
                        temperature: 0.8,
                        response_format: {
                            type: 'json_object',
                        },
                    }),
                });
            if (!value_322.ok)
                throw (
                    window.u2Api?.createHttpError?.(
                        value_322,
                        await window.u2Api?.readApiError?.(value_322),
                    ) ||
                    Object.assign(new Error('HTTP ' + value_322.status), {
                        status: value_322.status,
                    })
                );
            const data_3 = await value_322.json();
            let resultText = data_3.choices[0].message.content
                    .replace(/```json\n?/g, '')
                    .replace(/```/g, '')
                    .trim(),
                parsed_2;
            try {
                parsed_2 = sanitizeObj(JSON.parse(resultText));
            } catch (parseErr) {
                console.error('JSON Parse Error in Live Audience:', parseErr, resultText);
                if (window.showToast) window.showToast('观众反应格式生成失败，请重试');
                return;
            }
            const guestTurns_2 = Array.isArray(parsed_2.guestTurns) ? parsed_2.guestTurns : [];
            if (requestedConnections.length > 0) {
                const expectedIds = new Set(
                        requestedConnections.map((item_22) => item_22.participantId),
                    ),
                    receivedIds = guestTurns_2.map((turn) => String(turn?.participantId || '')),
                    hasDuplicateId = new Set(receivedIds).size !== receivedIds.length,
                    hasUnknownId = receivedIds.some((id_4) => !expectedIds.has(id_4)),
                    hasMissingId =
                        expectedIds.size !== receivedIds.length ||
                        [...expectedIds].some((id_5) => !receivedIds.includes(id_5)),
                    hasInvalidTurn = guestTurns_2.some((turn_2) => {
                        const bubbles_2 = Array.isArray(turn_2?.bubbles)
                                ? turn_2.bubbles.filter((item_23) =>
                                      String(item_23?.text || item_23?.content || '').trim(),
                                  )
                                : [],
                            narrativeText = String(
                                turn_2?.narrative?.text || turn_2?.narrative?.content || '',
                            ).trim();
                        return bubbles_2.length < 3 || bubbles_2.length > 8 || !narrativeText;
                    });
                if (hasDuplicateId || hasUnknownId || hasMissingId || hasInvalidTurn) {
                    window.showToast?.('多人连线回复格式不完整或角色对应错误，请重试');
                    return;
                }
                const latestSignature = getActiveUserLiveConnections()
                    .map(
                        (value_343) =>
                            value_343.id +
                            ':' +
                            String(
                                value_343.participant?.imCharId || value_343.participant?.id || '',
                            ) +
                            ':' +
                            (value_343.startedAt || ''),
                    )
                    .sort()
                    .join('|');
                if (latestSignature !== requestedConnectionSignature) return;
                guestTurns_2.forEach((turn_3) => {
                    const participantId_4 = String(turn_3.participantId),
                        requested = requestedConnections.find(
                            (item_24) => item_24.participantId === participantId_4,
                        );
                    if (!requested) return;
                    setTimeout(() => {
                        const latest = getUserLiveConnectionById(requested.id);
                        if (latest?.status !== 'active') return;
                        addUserLiveConnectionNarrative(requested.id, turn_3.narrative);
                    }, 350);
                    turn_3.bubbles.forEach((bubble, value_348) => {
                        setTimeout(
                            () => {
                                const latest_3 = getUserLiveConnectionById(requested.id),
                                    latestParticipantId = String(
                                        latest_3?.participant?.imCharId ||
                                            latest_3?.participant?.id ||
                                            '',
                                    );
                                if (
                                    latest_3?.status !== 'active' ||
                                    latestParticipantId !== participantId_4
                                )
                                    return;
                                addUserLiveConnectionBubble(requested.id, bubble);
                            },
                            900 + value_348 * 1700,
                        );
                    });
                });
            }
            let events = [];
            parsed_2.comments &&
                Array.isArray(parsed_2.comments) &&
                parsed_2.comments.forEach((c) =>
                    events.push({
                        type: 'comment',
                        data: c,
                    }),
                );
            parsed_2.superchats &&
                Array.isArray(parsed_2.superchats) &&
                parsed_2.superchats.forEach((sc_2) =>
                    events.push({
                        type: 'sc',
                        data: sc_2,
                    }),
                );
            parsed_2.newSubs &&
                Array.isArray(parsed_2.newSubs) &&
                parsed_2.newSubs.forEach((sub_3) =>
                    events.push({
                        type: 'sub',
                        data: sub_3,
                    }),
                );
            events.sort(() => Math.random() - 0.5);
            let totalDelay = 0;
            events.forEach((ev_2) => {
                totalDelay += Math.floor(Math.random() * 2000) + 500;
                setTimeout(() => {
                    if (ev_2.type === 'comment') {
                        addUserLiveChatMessage(
                            ev_2.data.name,
                            ev_2.data.text,
                            null,
                            null,
                            ev_2.data.translationZh,
                        );
                        ev_2.data.participates === true &&
                            addUserLiveLotteryParticipant(ev_2.data.name, 'audience-api');
                    } else {
                        if (ev_2.type === 'sc') {
                            addUserLiveChatMessage(
                                ev_2.data.name,
                                ev_2.data.text,
                                ev_2.data.displayAmount || ev_2.data.amount,
                                ev_2.data.color,
                                ev_2.data.translationZh,
                            );
                            const amountNum = parseFloat(ev_2.data.amount) || 0;
                            userLiveTotalSC += amountNum;
                            persistActiveUserLive();
                        } else {
                            if (ev_2.type === 'sub') {
                                const alertContainer = document.getElementById(
                                    'yt-user-live-alert-container',
                                );
                                if (alertContainer) {
                                    const alert_2 = document.createElement('div');
                                    alert_2.className = 'yt-user-live-alert';
                                    alert_2.innerHTML =
                                        '<i class="fas fa-bell"></i> ' +
                                        ev_2.data +
                                        ' 刚刚订阅了你！';
                                    alert_2.style.top = Math.floor(Math.random() * 80) + '%';
                                    alertContainer.appendChild(alert_2);
                                    setTimeout(() => alert_2.remove(), 5000);
                                    userLiveNewSubs += 1;
                                    const viewsEl_2 = document.getElementById(
                                        'yt-user-live-views-display',
                                    );
                                    if (viewsEl_2) {
                                        let currentNum_2 = parseInt(viewsEl_2.textContent) || 0;
                                        const addedViews = Math.floor(Math.random() * 50) + 10;
                                        currentNum_2 += addedViews;
                                        userLiveTotalViews += addedViews;
                                        if (userLiveTotalViews > userLiveMaxHot)
                                            userLiveMaxHot = userLiveTotalViews;
                                        viewsEl_2.textContent = currentNum_2 + ' 人正在观看';
                                    }
                                    persistActiveUserLive();
                                }
                            }
                        }
                    }
                }, totalDelay);
            });
        } catch (value_358) {
            console.error(value_358);
            if (window.showToast) window.showToast('无法获取观众反应');
        } finally {
            userLiveTriggerApiBtn.style.opacity = '1';
            userLiveTriggerApiBtn.style.pointerEvents = 'auto';
            userLiveTriggerApiBtn.setAttribute('aria-busy', 'false');
            userLiveTriggerApiBtn.innerHTML =
                '<i class="fas fa-arrow-down" style="font-size:14px;"></i>';
        }
    }),
    userLiveTriggerApiBtn.addEventListener('keydown', (event_6) => {
        if (event_6.key !== 'Enter' && event_6.key !== ' ') return;
        event_6.preventDefault();
        userLiveTriggerApiBtn.click();
    }));
function addUserLiveChatMessage(name_7, text_6, amount_3, color_2, translationZh_5 = '') {
    if (!userLiveChatContainer) return;
    const comment_7 = {
        name: name_7,
        text: text_6,
        translationZh: String(translationZh_5 || '').trim(),
        amount: amount_3,
        color: color_2,
    };
    userLiveComments.push(comment_7);
    if (!isUserLiveVisible()) {
        userLiveChatNeedsRefresh = true;
        persistActiveUserLive();
        return;
    }
    const element_366 = document.createElement('div');
    element_366.className = 'yt-live-chat-row-anim';
    if (amount_3) {
        element_366.classList.add('yt-user-live-superchat');
        let value_367 = amount_3;
        (typeof amount_3 === 'number' || /^\d+(\.\d+)?$/.test(String(amount_3))) &&
            (value_367 = '￥' + amount_3);
        element_366.style.backgroundColor = color_2 || '#8e8e93';
        element_366.style.padding = '8px 12px';
        element_366.style.borderRadius = '8px';
        element_366.style.marginBottom = '4px';
        element_366.innerHTML =
            `
                <div style="font-weight: bold; font-size: 13px; color: rgba(255,255,255,0.9); margin-bottom: 4px;">` +
            escapeYtUserLiveHtml(name_7) +
            ' <span style="margin-left: 8px;">' +
            escapeYtUserLiveHtml(value_367) +
            `</span></div>
                <div style="font-size: 14px; color: #fff;">` +
            buildUserLiveCommentTextHtml(comment_7, '#fff') +
            `</div>
            `;
    } else {
        element_366.style.display = 'flex';
        element_366.style.gap = '8px';
        element_366.style.alignItems = 'flex-start';
        element_366.style.marginBottom = '12px';
        const items_368 = ['#333333', '#4d4d4d', '#666666', '#808080', '#999999', '#b3b3b3'],
            value_369 = items_368[Math.floor(Math.random() * items_368.length)];
        element_366.innerHTML =
            `
                <div style="width:24px; height:24px; border-radius:50%; background-color:` +
            value_369 +
            `; display:flex; justify-content:center; align-items:center; color:#fff; font-size:10px; font-weight:bold; flex-shrink:0;">
                    ` +
            escapeYtUserLiveHtml(name_7 && name_7.length > 0 ? name_7[0].toUpperCase() : '?') +
            `
                </div>
                <div style="font-size:13px; margin-top:2px;">
                    <span style="font-size:12px; margin-right:4px; color:#606060;">` +
            escapeYtUserLiveHtml(name_7) +
            `</span>
                    ` +
            buildUserLiveCommentTextHtml(comment_7) +
            `
                </div>
            `;
    }
    bindUserLiveCommentTranslation(element_366);
    userLiveChatContainer.appendChild(element_366);
    userLiveChatContainer.scrollTop = userLiveChatContainer.scrollHeight;
    persistActiveUserLive();
}
