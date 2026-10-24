(
    window.u2OnStorageReady ||
    ((callback) => document.addEventListener('DOMContentLoaded', callback))
)(() => {
    const { apiConfig: apiConfig_2, userState: userState_2 } = window;
    window.imChat = window.imChat || {};
    const imChat_3 = window.imChat;
    const chatsSearchInput = document.getElementById('chats-search-input');

    function handleAction_4(friend_2) {
        if (!friend_2)
            return {
                hasMessages: false,
                preview: 'No messages',
                timestamp: 0,
                count: 0,
            };
        const loadedMessages = Array.isArray(friend_2.messages) ? friend_2.messages : [],
            lastLoadedMsg =
                loadedMessages.length > 0 ? loadedMessages[loadedMessages.length - 1] : null,
            apk110New_22 =
                friend_2.type === 'group' &&
                window.imApp?.areGroupTitlesEnabled?.(friend_2) === false;
        const cachedGiftContext = window.imApp.isGiftContextMessage?.({
            role: 'system',
            content: friend_2.lastMessagePreview,
        });
        let preview_2 =
                cachedGiftContext
                    ? '[Gift]'
                    : !apk110New_22 && typeof friend_2.lastMessagePreview === 'string'
                      ? friend_2.lastMessagePreview
                      : '',
            timestamp_2 = Number(friend_2.lastMessageTimestamp) || 0,
            count_2 = window.imApp.getFriendMessageCount
                ? window.imApp.getFriendMessageCount(friend_2)
                : Number(friend_2.messageCount) || loadedMessages.length || 0;
        const cachedGift = /^Gift: (.+)\r?\nValue \$\d+\.\d{2}(?:\r?\nDescription: [\s\S]*)?$/.exec(
            preview_2,
        );
        if (cachedGift) preview_2 = `[Gift] ${cachedGift[1]}`.trim();
        if (lastLoadedMsg) {
            let apk110New_26 = lastLoadedMsg;
            if (
                (apk110New_22 || window.imApp.isGiftContextMessage?.(apk110New_26)) &&
                window.imApp.getFriendMessagePreview &&
                !window.imApp.getFriendMessagePreview(apk110New_26, friend_2)
            ) {
                apk110New_26 = null;
                for (
                    let apk110New_27 = loadedMessages.length - 2;
                    apk110New_27 >= 0;
                    apk110New_27 -= 1
                ) {
                    if (
                        window.imApp.getFriendMessagePreview(loadedMessages[apk110New_27], friend_2)
                    ) {
                        apk110New_26 = loadedMessages[apk110New_27];
                        break;
                    }
                }
            }
            preview_2 = window.imApp.getFriendMessagePreview
                ? apk110New_26
                    ? window.imApp.getFriendMessagePreview(apk110New_26, friend_2)
                    : preview_2
                : apk110New_26?.content || apk110New_26?.text || preview_2 || '';
            timestamp_2 = Number(lastLoadedMsg.timestamp) || timestamp_2 || 0;
            if (friend_2.messagesLoaded === true) count_2 = loadedMessages.length;
        }
        return {
            hasMessages: count_2 > 0,
            preview: preview_2 || (count_2 > 0 && apk110New_22 ? '群聊消息' : 'No messages'),
            timestamp: timestamp_2,
            count: count_2,
        };
    }
    function updateChatsView_2() {
        const emptyState = document.getElementById('chats-empty-state'),
            listContainer = document.getElementById('chats-list-container'),
            listSurface = document.getElementById('chats-list-surface'),
            lineHeader = document.querySelector('.line-header'),
            chatsContent = document.getElementById('chats-content'),
            imBottomNavContainer = document.querySelector('.line-bottom-nav-container'),
            id_23 = window.imData.currentActiveFriend?.id;
        chatsContent &&
            Array.from(chatsContent.children).forEach((element) => {
                if (element.classList.contains('active-chat-interface')) {
                    const value_24 = id_23 != null && element.id === 'chat-interface-' + id_23;
                    element.style.display = value_24 ? 'flex' : 'none';
                    !value_24 &&
                        window.imChat?.disposeOnlineChatBottomFollower?.(
                            element.querySelector('.ins-chat-messages'),
                        );
                }
            });
        if (window.imData.currentActiveFriend) {
            window.imApp?.setActiveThemeSurface?.('chat-detail');
            if (listSurface) listSurface.style.display = 'none';
            if (emptyState) emptyState.style.display = 'none';
            if (listContainer) listContainer.style.display = 'none';
            if (imBottomNavContainer) imBottomNavContainer.style.display = 'none';
            if (lineHeader) lineHeader.style.display = 'none';
            const pageId = 'chat-interface-' + window.imData.currentActiveFriend.id,
                page = document.getElementById(pageId);
            if (page) {
                const container = page.querySelector('.ins-chat-messages');
                window.imChat.settleOnlineChatAtLatest
                    ? window.imChat.settleOnlineChatAtLatest(container)
                    : window.imChat.scrollToBottom(container, {
                          force: true,
                      });
            }
        } else {
            window.imApp?.setActiveThemeSurface?.('chats');
            if (listSurface) listSurface.style.display = 'flex';
            window.imApp?.syncChatsLayout?.();
            if (imBottomNavContainer) imBottomNavContainer.style.display = 'flex';
            if (lineHeader) lineHeader.style.display = 'flex';
            window.imChat.renderChatsList();
            const hasChats = window.imData.friends.some((value_27) => {
                const handleAction_4_28 = handleAction_4(value_27);
                return (
                    handleAction_4_28.hasMessages ||
                    !!value_27.isPinned ||
                    (value_27.type === 'official' && value_27.officialConversationActive === true)
                );
            });
            if (hasChats) {
                if (emptyState) emptyState.style.display = 'none';
                if (listContainer) listContainer.style.display = 'block';
            } else {
                if (emptyState) emptyState.style.display = 'flex';
                if (listContainer) listContainer.style.display = 'none';
            }
        }
        if (window.imApp.updateChatsUnreadBadges) window.imApp.updateChatsUnreadBadges();
    }
    function handleAction_6(friend_3) {
        if (friend_3.type === 'group')
            return friend_3.avatarUrl
                ? '<img src="' + friend_3.avatarUrl + '">'
                : '<div style="width: 100%; height: 100%; background: linear-gradient(135deg, #ff9a9e, #fecfef); color: white; display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: 20px;">' +
                      friend_3.nickname.charAt(0).toUpperCase() +
                      '</div>';
        if (friend_3.avatarUrl) return '<img src="' + friend_3.avatarUrl + '">';
        if (!friend_3.type || friend_3.type === 'char') {
            return '<img src="assets/imessage/default-char-avatar.jpg">';
        }
        return '<i class="fas fa-user"></i>';
    }
    function handleAction_7(value_30) {
        let nickname_31 =
            value_30.type === 'official' && value_30.nickname === '有兔'
                ? 'LHV'
                : value_30.nickname;
        if (value_30.type === 'group')
            nickname_31 = '<span class="chat-group-name-text">' + nickname_31 +
                '</span><span class="chat-group-label">group</span>';
        else
            value_30.type === 'official' &&
                (nickname_31 +=
                    ' <span style="background:#e5e5ea; color:#8e8e93; font-size:10px; padding:2px 6px; border-radius:10px; margin-left:6px; vertical-align: middle;">office</span>');
        return nickname_31;
    }
    function buildChatUnreadHtml(friend) {
        if (friend.unreadCount && friend.unreadCount > 0) {
            const unreadText = friend.unreadCount > 99 ? '99+' : String(friend.unreadCount);
            return `<span class="chat-unread-dot" aria-hidden="true">${unreadText}</span>`;
        }
        return '';
    }

    function buildChatPinnedHtml(isPinned) {
        return isPinned ? '<span class="chat-pinned-dot" aria-hidden="true"></span>' : '';
    }

    async function setChatPinnedState(friendId, shouldPin, item) {
        const liveFriend = (window.imData.friends || []).find(friend => String(friend.id) === String(friendId));
        if (!liveFriend || !!liveFriend.isPinned === shouldPin) return false;
        const saved = window.imApp?.commitFriendChange
            ? await window.imApp.commitFriendChange(friendId, (targetFriend) => {
                if (targetFriend) targetFriend.isPinned = shouldPin;
            }, { silent: true, metaOnly: true })
            : false;
        item?.classList.remove('is-pin-gesture');
        if (!saved) {
            window.showToast?.('置顶状态保存失败');
            return false;
        }
        const latestFriend = (window.imData.friends || []).find(friend => String(friend.id) === String(friendId)) || liveFriend;
        window.imChat.renderChatsList?.();
        window.showToast?.(shouldPin ? `Pinned ${latestFriend.nickname || latestFriend.realName || 'Char'}` : 'Unpinned');
        return true;
    }

    function bindChatPinGesture(item) {
        if (!item || item.dataset.pinGestureBound === 'true') return;
        item.dataset.pinGestureBound = 'true';
        let pointerId = null;
        let startX = 0;
        let startY = 0;
        let deltaX = 0;
        let armed = false;
        let longPressTimer = null;

        const clearLongPress = () => {
            if (longPressTimer) window.clearTimeout(longPressTimer);
            longPressTimer = null;
        };
        const reset = () => {
            clearLongPress();
            pointerId = null;
            deltaX = 0;
            armed = false;
            item.classList.remove('is-pin-gesture');
            item.style.transform = '';
        };

        item.addEventListener('pointerdown', (event) => {
            if (event.button != null && event.button !== 0) return;
            pointerId = event.pointerId;
            startX = event.clientX;
            startY = event.clientY;
            deltaX = 0;
            armed = false;
            clearLongPress();
            longPressTimer = window.setTimeout(() => {
                armed = true;
                item.classList.add('is-pin-gesture');
                navigator.vibrate?.(20);
                item.setPointerCapture?.(pointerId);
            }, 480);
        });

        item.addEventListener('pointermove', (event) => {
            if (pointerId !== event.pointerId) return;
            const nextX = event.clientX - startX;
            const nextY = event.clientY - startY;
            if (!armed) {
                if (Math.abs(nextX) > 10 || Math.abs(nextY) > 10) reset();
                return;
            }
            if (Math.abs(nextY) > Math.abs(nextX) + 16) {
                reset();
                return;
            }
            deltaX = Math.max(-34, Math.min(34, nextX));
            item.style.transform = `translateX(${deltaX}px)`;
            event.preventDefault();
        });

        item.addEventListener('pointerup', (event) => {
            if (pointerId !== event.pointerId) return;
            clearLongPress();
            const friendId = item.dataset.friendId || '';
            const liveFriend = (window.imData.friends || []).find(friend => String(friend.id) === String(friendId));
            const shouldPin = !!liveFriend && !liveFriend.isPinned && deltaX <= -24;
            const shouldUnpin = !!liveFriend?.isPinned && deltaX >= 24;
            if (shouldPin || shouldUnpin) {
                item._suppressChatOpenUntil = Date.now() + 700;
                item.style.transition = 'transform .18s cubic-bezier(.2,.8,.2,1)';
                item.style.transform = `translateX(${shouldPin ? -18 : 18}px)`;
                window.setTimeout(() => {
                    item.style.transform = '';
                    window.setTimeout(() => { item.style.transition = ''; }, 190);
                }, 90);
                void setChatPinnedState(friendId, shouldPin, item);
            } else {
                reset();
            }
            pointerId = null;
            armed = false;
        });

        item.addEventListener('pointercancel', reset);
        item.addEventListener('contextmenu', event => event.preventDefault());
    }

    function createChatListItem(friend, isPinned) {
        const item = document.createElement('div');
        item.className = isPinned ? 'chat-item pinned' : 'chat-item';
        item.dataset.friendId = String(friend.id);
        item.addEventListener('click', (event) => {
            if (Date.now() < Number(item._suppressChatOpenUntil || 0)) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }
            const liveFriend = (window.imData.friends || []).find(entry => String(entry.id) === String(item.dataset.friendId)) || friend;
            window.imChat.openChatTab(liveFriend);
        });
        bindChatPinGesture(item);
        return item;
    }

    function handleAction_10(value_37, value_38, message_39) {
        return [
            String(value_37?.id ?? ''),
            value_38 ? 1 : 0,
            String(value_37?.type || ''),
            String(value_37?.nickname || ''),
            String(value_37?.avatarUrl || ''),
            String(message_39?.preview || ''),
            Number(message_39?.timestamp) || 0,
            Math.max(0, Number(value_37?.unreadCount) || 0),
        ].join('');
    }
    function handleAction_11(item, friend, isPinned, summary = handleAction_4(friend)) {
        const renderKey = handleAction_10(friend, isPinned, summary);
        if (item.dataset.renderKey === renderKey) return false;
        const msgPreview = summary.preview;
        const timeStr = summary.timestamp && window.imApp.formatTime
            ? window.imApp.formatTime(summary.timestamp)
            : '';

        item.className = isPinned ? 'chat-item pinned' : 'chat-item';
        item.dataset.friendId = String(friend.id);
        item.setAttribute('aria-label', friend.unreadCount > 0
            ? `${friend.nickname}, ${friend.unreadCount} unread`
            : friend.nickname);
        item.innerHTML = `
            ${buildChatPinnedHtml(isPinned)}
            <div class="chat-avatar-wrap">
                <div class="chat-avatar">${handleAction_6(friend)}</div>
                ${buildChatUnreadHtml(friend)}
            </div>
            <div class="chat-info">
                <div class="chat-row-top">
                    <div class="chat-name">${handleAction_7(friend)}</div>
                    <div class="chat-meta">
                        <div class="chat-time">${timeStr}</div>
                        <svg class="chat-chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </div>
                </div>
                <div class="chat-message">${msgPreview}</div>
            </div>
        `;
        item.dataset.renderKey = renderKey;
        return true;
    }

    let text_12 = '',
        enabled = false;
    const value_13 = new Set();
    function handleAction_14(value_47) {
        if (enabled || !window.imApp?.ensureFriendRecentMessagesLoaded) return;
        const slice_48 = (Array.isArray(value_47) ? value_47 : [])
            .map((value_50) => value_50?.friend)
            .filter((value_51) => value_51?.id != null && !value_13.has(String(value_51.id)))
            .slice(0, 4);
        if (slice_48.length === 0) return;
        enabled = true;
        const value_49 = async () => {
            try {
                for (const value_52 of slice_48) {
                    const string_53 = String(value_52.id);
                    value_13.add(string_53);
                    await window.imApp.ensureFriendRecentMessagesLoaded(value_52, {
                        limit: 60,
                    });
                }
            } finally {
                enabled = false;
            }
        };
        typeof window.requestIdleCallback === 'function'
            ? window.requestIdleCallback(() => void value_49(), {
                  timeout: 900,
              })
            : setTimeout(() => void value_49(), 80);
    }
    function handleAction_15(value_54, items, value_55) {
        const value_56 = new Set();
        let firstElementChild_57 = value_54.firstElementChild;
        return (
            items.forEach(({ friend: friend_5, summary: summary_3 }) => {
                const string_60 = String(friend_5.id);
                value_56.add(string_60);
                let result = value_55.get(string_60);
                !result &&
                    ((result = createChatListItem(friend_5, !!friend_5.isPinned)),
                    value_55.set(string_60, result));
                handleAction_11(result, friend_5, !!friend_5.isPinned, summary_3);
                result === firstElementChild_57
                    ? (firstElementChild_57 = firstElementChild_57.nextElementSibling)
                    : value_54.insertBefore(result, firstElementChild_57);
            }),
            value_56
        );
    }
    function handleAction_16(value_61, value_62) {
        Array.from(value_61.children).forEach((value_63) => {
            if (!value_62.has(String(value_63.dataset.friendId || ''))) value_63.remove();
        });
    }
    function renderChatsList_2() {
        const chatsList = document.getElementById('chats-list');
        if (!chatsList) return;
        const query = String(chatsSearchInput?.value || '').trim().toLocaleLowerCase();
        const allActiveFriends = window.imData.friends
            .map((friend_6) => ({
                friend: friend_6,
                summary: handleAction_4(friend_6),
            }))
            .filter(
                (value_73) =>
                    value_73.summary.hasMessages ||
                    value_73.friend.isPinned ||
                    (value_73.friend.type === 'official' &&
                        value_73.friend.officialConversationActive === true),
            );
        const filter_64 = query
            ? allActiveFriends.filter(({friend}) => String(friend.nickname || '').toLocaleLowerCase().includes(query))
            : allActiveFriends;
        filter_64.sort((value_74, value_75) => {
            if (value_74.friend.isPinned !== value_75.friend.isPinned)
                return value_74.friend.isPinned ? -1 : 1;
            return value_75.summary.timestamp - value_74.summary.timestamp;
        });
        handleAction_14(filter_64);
        const join_65 = query + '\u0003' + filter_64
                .map((value_76) =>
                    handleAction_10(value_76.friend, !!value_76.friend.isPinned, value_76.summary),
                )
                .join(''),
            length_66 = chatsList.querySelectorAll('.chat-item').length;
        if (text_12 === join_65 && length_66 === filter_64.length) {
            if (window.imApp.markChatsListRendered) window.imApp.markChatsListRendered();
            return false;
        }
        let pinnedContainer = chatsList.querySelector('.pinned-chats-container');
        !pinnedContainer &&
            ((pinnedContainer = document.createElement('div')),
            (pinnedContainer.className = 'pinned-chats-container'),
            chatsList.appendChild(pinnedContainer));
        let normalContainer = chatsList.querySelector('.normal-chats-container');
        !normalContainer &&
            ((normalContainer = document.createElement('div')),
            (normalContainer.className = 'normal-chats-container'),
            chatsList.appendChild(normalContainer));
        const value_67 = new Map();
        [...pinnedContainer.children, ...normalContainer.children].forEach((element_77) => {
            if (element_77.classList.contains('chat-item'))
                value_67.set(String(element_77.dataset.friendId || ''), element_77);
        });
        const filter_68 = filter_64.filter((value_78) => value_78.friend.isPinned),
            filter_69 = filter_64.filter((value_79) => !value_79.friend.isPinned),
            handleAction_15_70 = handleAction_15(pinnedContainer, filter_68, value_67),
            handleAction_15_71 = handleAction_15(normalContainer, filter_69, value_67);
        handleAction_16(pinnedContainer, handleAction_15_70);
        handleAction_16(normalContainer, handleAction_15_71);
        filter_68.length === 0 &&
            pinnedContainer.parentNode === chatsList &&
            (pinnedContainer.innerHTML = '');
        filter_69.length === 0 && (normalContainer.innerHTML = '');
        text_12 = join_65;
        if (window.imApp.updateChatsUnreadBadges) window.imApp.updateChatsUnreadBadges();
        if (window.imApp.markChatsListRendered) window.imApp.markChatsListRendered();
        return true;
    }
    window.imChat.updateChatsView = updateChatsView_2;
    window.imChat.renderChatsList = renderChatsList_2;
    chatsSearchInput?.addEventListener('input', renderChatsList_2);
});
