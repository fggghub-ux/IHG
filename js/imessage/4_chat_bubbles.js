(
    window.u2OnStorageReady ||
    ((callback) => document.addEventListener('DOMContentLoaded', callback))
)(() => {
    const { apiConfig: apiConfig_2, userState: userState_2 } = window;
    window.imChat = window.imChat || {};
    const imChat_3 = window.imChat;
    const count = 20;
    const count_5 = 60;
    const HISTORY_LOAD_MORE_USER_ROUNDS = 10;
    const renderMessageContextByFriend = new WeakMap();
    const scrollTop_4 = 1000000000;
    const count_4 = 72;
    const count_6 = 2;
    const count_11 = 2;
    const count_12 = 1200;
    const enabled = true;
    const renderMessageContextByFriend_3 = new WeakMap();
    const renderMessageContextByFriend_2 = new WeakMap();
    imChat_3.attachNoticeDeleteButton = function (
        row,
        friend,
        message,
        { parent = row, key = '' } = {},
    ) {
        const live = window.imApp?.getFriendById?.(friend?.id) || friend;
        if (key && window.imApp?.isChatNoticeDismissed?.(live, key)) return false;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'chat-notice-delete';
        button.textContent = '×';
        button.setAttribute('aria-label', '删除提示');
        button.title = '删除提示';
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (button.disabled) return;
            button.disabled = true;
            try {
                const saved = key
                    ? await window.imApp.dismissChatNotice(friend.id, key)
                    : await window.imApp.removeFriendMessages(
                          friend.id,
                          { id: message?.id || null, timestamp: message?.timestamp || null },
                          { silent: true },
                      );
                if (!saved) throw new Error('save failed');
                row.remove();
                window.imApp.requestChatsListRefresh?.();
            } catch (error) {
                button.disabled = false;
                window.showToast?.('删除提示失败');
            }
        });
        button.addEventListener('keydown', (event) => event.stopPropagation());
        parent.appendChild(button);
        return true;
    };
    function formatBubbleTime(value) {
        if (window.imDataUtils?.formatUsTime) return window.imDataUtils.formatUsTime(value);
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    }

    function escapeHtml(value_4) {
        return window.imDataUtils.normalizeCurrencySymbols(value_4)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    function handleAction_15(value_107) {
        const trim_108 = String(value_107 || '').trim();
        if (/^https?:\/\//i.test(trim_108)) return trim_108;
        if (/^data:image\/(?:png|jpe?g|gif|webp|avif);base64,/i.test(trim_108)) return trim_108;
        if (/^blob:/i.test(trim_108) || /^(?:\.\/)?assets\//i.test(trim_108)) return trim_108;
        return '';
    }
    function getEffectiveUserProfile(friend_2 = null, message_2 = null) {
        if (friend_2?.type === 'group' && window.imApp?.getMessageUserIdentity) {
            const apk110New_135 = window.imApp.getMessageUserIdentity(
                friend_2,
                message_2 || {
                    role: 'user',
                },
            );
            return {
                ...apk110New_135,
                avatarUrl:
                    window.imApp.getGroupUserAvatarUrl?.(friend_2, message_2) ||
                    apk110New_135.avatarUrl,
            };
        }
        const boundAccount = window.imApp?.getBoundAccountByFriend
                ? window.imApp.getBoundAccountByFriend(friend_2)
                : null,
            source_2 = boundAccount || window.userState || userState_2 || {};
        return {
            name: source_2.name || source_2.realName || source_2.nickname || 'User',
            avatarUrl:
                window.imApp?.getChatUserAvatarUrl?.(friend_2, source_2) ||
                source_2.avatarUrl ||
                'assets/moren-thumb.jpg',
        };
    }
    function syncGroupUserAvatarState_3(friend, container) {
        syncSingleChatAvatarState(friend, container);
    }
    function syncSingleChatAvatarState(friend, container) {
        if (!container) return;
        const isTwo =
            friend?.type === 'group' || ((!friend?.type || friend.type === 'char') &&
            friend?.showAvatar === true && friend?.avatarDisplayMode === 'two');
        container.classList.toggle('avatar-mode-two', isTwo);
    }

    function decorateMessageRowAvatar(row, friend, message = {}) {
        const isGroup = friend?.type === 'group';
        const isCharFriend = !friend?.type || friend.type === 'char';
        const isEveryMessageMode = friend?.avatarDisplayMode === 'two';
        if (
            !row ||
            !(isGroup ? (message.role !== 'user' || friend.showGroupUserAvatar === true)
                : (friend?.showAvatar && isCharFriend && isEveryMessageMode)) ||
            row.querySelector(':scope > .im-message-avatar')
        )
            return row;
        if (
            message.type === 'memory_request' ||
            message.type === 'system_notice' ||
            row.classList.contains('chat-system-row') ||
            row.classList.contains('typing-row')
        )
            return row;

        const isUser = message.role === 'user' || row.classList.contains('user-row');
        let profile;
        if (isUser) {
            profile = getEffectiveUserProfile(friend, message);
        } else if (isGroup) {
            profile = resolveGroupBubbleIdentity(friend, message);
        } else {
            profile = {
                name: friend?.nickname || friend?.realName || 'AI',
                avatarUrl: friend?.avatarUrl || 'assets/moren-thumb.jpg',
            };
        }

        const avatar = document.createElement('span');
        avatar.className = `im-message-avatar ${isUser ? 'is-user' : 'is-assistant'}`;
        avatar.setAttribute('aria-hidden', 'true');
        avatar.dataset.messageRole = isUser ? 'user' : 'assistant';
        avatar.innerHTML = `<img src="${escapeHtml(profile.avatarUrl || 'assets/moren-thumb.jpg')}" alt="" loading="lazy" decoding="async" onerror="this.src='assets/moren-thumb.jpg'">`;
        row.appendChild(avatar);
        return row;
    }
    function handleAction_18(value_122, value_123) {
        for (
            let value_124 = value_122?.lastElementChild || null;
            value_124;
            value_124 = value_124.previousElementSibling
        ) {
            if (value_123(value_124)) return value_124;
        }
        return null;
    }
    function handleAction_19(message_4, friend_5, value_127) {
        syncSingleChatAvatarState(friend_5, value_127);
        const messageId_2 = String(message_4?.id || ''),
            row_3 = handleAction_18(
                value_127,
                (candidate) =>
                    candidate.classList?.contains('chat-row') &&
                    (!messageId_2 ||
                        String(candidate.getAttribute('data-message-id') || '') === messageId_2),
            );
        if (row_3) {
            decorateMessageRowAvatar(row_3, friend_5, message_4);
            apk110New_23(row_3, friend_5, message_4);
        }
        if (message_4?.role === 'assistant') {
            value_127
                ?.querySelectorAll?.('.gift-message-card[data-gift-timestamp]')
                .forEach((card) => {
                    const giftTime = Number(card.dataset.giftTimestamp) || 0;
                    if ((Number(message_4.timestamp) || 0) <= giftTime) return;
                    card.classList.add('is-received');
                    const copy = card.querySelector('.gift-message-copy');
                    if (copy && !copy.querySelector('.gift-message-status')) {
                        copy.insertAdjacentHTML(
                            'beforeend',
                            '<div class="gift-message-status">Received</div>',
                        );
                    }
                });
        }
        return true;
    }
    function apk110New_23(apk110New_155, apk110New_156, apk110New_157) {
        if (
            !apk110New_155 ||
            !window.imApp?.areGroupTitlesEnabled?.(apk110New_156) ||
            !['user', 'assistant'].includes(apk110New_157?.role)
        )
            return;
        const apk110New_158 = apk110New_157.role === 'user',
            apk110New_159 = apk110New_158
                ? ''
                : String(resolveGroupBubbleIdentity(apk110New_156, apk110New_157).memberId || ''),
            apk110New_160 = apk110New_158
                ? window.imApp?.getGroupOwnerTitle?.(apk110New_156)
                : window.imApp?.getGroupMemberTitle?.(apk110New_156, apk110New_159);
        if (!apk110New_160) return;
        const apk110New_161 = document.createElement('span');
        apk110New_161.className =
            'im-group-title-badge' +
            (!apk110New_158 && window.imApp?.isGroupAdmin?.(apk110New_156, apk110New_159)
                ? ' is-admin'
                : '');
        apk110New_161.textContent = apk110New_160;
        const apk110New_162 = apk110New_155.querySelector(
            apk110New_158
                ? '.user-header .chat-header-name'
                : '.group-ai-speaker-name, .ai-header .chat-header-name',
        );
        if (apk110New_162) {
            apk110New_162.appendChild(apk110New_161);
            return;
        }
        if (!apk110New_158 || apk110New_155.classList.contains('has-prev')) return;
        const apk110New_163 = apk110New_155.querySelector('.user-bubble')?.parentElement;
        if (!apk110New_163?.parentElement) return;
        const apk110New_164 = document.createElement('div');
        apk110New_164.className = 'im-group-user-speaker-name';
        apk110New_164.append(
            document.createTextNode(
                getEffectiveUserProfile(apk110New_156, apk110New_157).name || 'User',
            ),
            apk110New_161,
        );
        apk110New_163.parentElement.insertBefore(apk110New_164, apk110New_163);
    }
    function handleAction_20(row, friend, message = renderMessageContextByFriend.get(friend)) {
        if (!row || friend?.type !== 'group' || message?.role !== 'user') return;
        const profile = getEffectiveUserProfile(friend, message);
        row.setAttribute('data-user-account-id', profile.accountId || '');
        const avatar = row.querySelector(':scope > .im-message-avatar.is-user');
        if (!friend.showGroupUserAvatar) avatar?.remove();
        else if (avatar) avatar.querySelector('img').src = profile.avatarUrl || 'assets/moren-thumb.jpg';
        else decorateMessageRowAvatar(row, friend, message);
        return profile;
    }
    function apk110New_25() {
        const apk110New_169 = Array.isArray(window.imData?.friends) ? window.imData.friends : [];
        document
            .querySelectorAll('.active-chat-interface.im-chat-group[id^="chat-interface-"]')
            .forEach((apk110New_170) => {
                const apk110New_171 = String(apk110New_170.id).replace(/^chat-interface-/, ''),
                    apk110New_172 = apk110New_169.find(
                        (apk110New_175) =>
                            apk110New_175?.type === 'group' &&
                            String(apk110New_175.id) === apk110New_171,
                    ),
                    apk110New_173 = apk110New_170.querySelector('.ins-chat-messages');
                if (!apk110New_172 || !apk110New_173) return;
                syncGroupUserAvatarState_3(apk110New_172, apk110New_173);
                const apk110New_174 = new Map(
                    (Array.isArray(apk110New_172.messages) ? apk110New_172.messages : [])
                        .filter(
                            (apk110New_176) =>
                                apk110New_176?.role === 'user' && apk110New_176.id != null,
                        )
                        .map((apk110New_177) => [String(apk110New_177.id), apk110New_177]),
                );
                apk110New_173
                    .querySelectorAll('.chat-row.user-row[data-message-id]')
                    .forEach((apk110New_178) => {
                        let apk110New_179 = apk110New_174.get(
                            String(apk110New_178.getAttribute('data-message-id')),
                        );
                        if (!apk110New_179) {
                            const apk110New_181 =
                                    apk110New_178.getAttribute('data-user-account-id') || '',
                                apk110New_182 = (window.getAccounts?.() || []).some(
                                    (apk110New_183) => String(apk110New_183?.id) === apk110New_181,
                                );
                            if (apk110New_181 && !apk110New_182) return;
                            apk110New_179 = {
                                role: 'user',
                                userIdentity: {
                                    accountId: apk110New_181,
                                },
                            };
                        }
                        const apk110New_180 = handleAction_20(
                            apk110New_178,
                            apk110New_172,
                            apk110New_179,
                        );
                        if (!apk110New_180) return;
                        apk110New_178
                            .querySelectorAll(
                                '.user-header .chat-header-avatar img, .group-poll-voter.is-user-voter img',
                            )
                            .forEach((apk110New_184) => {
                                if (apk110New_184.getAttribute('src') !== apk110New_180.avatarUrl)
                                    apk110New_184.src = apk110New_180.avatarUrl;
                            });
                    });
            });
    }
    function resolveGroupBubbleIdentity(friend_7, msg_2 = {}) {
        const member_2 =
            friend_7?.type === 'group' && window.imChat?.getGroupMessageSpeaker
                ? window.imChat.getGroupMessageSpeaker(friend_7, msg_2)
                : null;
        return {
            member: member_2,
            memberId: member_2?.id ?? msg_2.speakerMemberId ?? msg_2.senderMemberId ?? '',
            name:
                member_2?.nickname ||
                member_2?.realName ||
                msg_2.speaker ||
                msg_2.senderName ||
                '群成员',
            avatarUrl: member_2?.avatarUrl || msg_2.senderAvatarUrl || null,
        };
    }
    function handleAction_22(row_5, friend_8, value_138 = {}) {
        if (!row_5 || friend_8?.type !== 'group') return;
        const groupIdentity = resolveGroupBubbleIdentity(friend_8, value_138);
        groupIdentity.memberId !== '' &&
            row_5.setAttribute('data-speaker-member-id', String(groupIdentity.memberId));
    }
    function handleAction_23(msg_3 = {}, friend_9 = null) {
        if (typeof window.imChat.normalizePayTransferMessage === 'function')
            return window.imChat.normalizePayTransferMessage(msg_3, friend_9);
        if (typeof window.imChat.resolvePayTransferParties === 'function')
            return window.imChat.resolvePayTransferParties(msg_3, friend_9);
        const payKind_2 =
                msg_3.payKind || (msg_3.role === 'user' ? 'user_to_char' : 'char_received'),
            apk110New_195 =
                friend_9?.type !== 'group' && friend_9?.boundAccountId
                    ? window.imApp?.getBoundAccountByFriend?.(friend_9)
                    : null,
            apk110New_196 = String(
                apk110New_195?.name || apk110New_195?.realName || apk110New_195?.nickname || '',
            ).trim(),
            userName = getEffectiveUserProfile(friend_9, msg_3).name,
            charName_2 =
                msg_3.speaker ||
                msg_3.charName ||
                friend_9?.nickname ||
                friend_9?.realName ||
                friend_9?.name ||
                'Char',
            targetName_2 = msg_3.targetName || '',
            charToUserKinds = [
                'char_to_user_pending',
                'char_to_user_claimed',
                'user_received_from_char',
                'user_rejected_from_char',
            ],
            claimedKinds = ['char_received', 'char_to_user_claimed', 'user_received_from_char'],
            rejectedKinds = [
                'user_to_char_rejected',
                'char_to_user_rejected',
                'user_rejected_from_char',
            ],
            direction_2 =
                msg_3.payDirection === 'char_to_user' || msg_3.payDirection === 'user_to_char'
                    ? msg_3.payDirection
                    : charToUserKinds.includes(payKind_2)
                      ? 'char_to_user'
                      : 'user_to_char';
        let status_2 = rejectedKinds.includes(payKind_2)
            ? 'rejected'
            : claimedKinds.includes(payKind_2)
              ? 'claimed'
              : 'pending';
        if (status_2 === 'pending' && msg_3.claimed) status_2 = 'claimed';
        let payerName_2 = msg_3.payerName || '',
            payeeName_2 = msg_3.payeeName || '';
        if (direction_2 === 'char_to_user') {
            payerName_2 = payerName_2 || msg_3.senderName || targetName_2 || charName_2;
            payeeName_2 = payeeName_2 || msg_3.receiverName || userName;
            if (apk110New_196) payeeName_2 = apk110New_196;
        } else {
            payerName_2 = payerName_2 || msg_3.senderName || userName;
            payeeName_2 =
                payeeName_2 ||
                msg_3.receiverName ||
                (targetName_2 && targetName_2 !== userName ? targetName_2 : charName_2);
            if (apk110New_196) payerName_2 = apk110New_196;
        }
        const payerType_2 = direction_2 === 'user_to_char' ? 'user' : 'char',
            payeeType_2 = direction_2 === 'user_to_char' ? 'char' : 'user';
        return {
            payKind: payKind_2,
            direction: direction_2,
            status: status_2,
            payerName: payerName_2,
            payeeName: payeeName_2,
            payerType: payerType_2,
            payeeType: payeeType_2,
            canCurrentUserClaim:
                direction_2 === 'char_to_user' && status_2 === 'pending' && !msg_3.claimed,
            senderName: payerName_2,
            receiverName: payeeName_2,
            senderType: payerType_2,
            receiverType: payeeType_2,
            isUserSender: payerType_2 === 'user',
        };
    }
    function getChatDisplayTimestamp(value_44, friend_10) {
        return window.imDataUtils?.getChatTimestamp?.(value_44, friend_10) ?? friend_10;
    }
    function openCustomChatTimeEditor(_value10, _value11, _value12 = '') {
        if (!window.imDataUtils?.isCustomChatTimeEnabled?.(_value10)) return;
        let _value13 = document.getElementById('im-custom-time-overlay');
        if (!_value13) {
            _value13 = document.createElement('div');
            _value13.id = 'im-custom-time-overlay';
            _value13.className = 'im-custom-time-overlay';
            _value13.innerHTML =
                '<form class="im-custom-time-dialog" role="dialog" aria-modal="true" aria-labelledby="im-custom-time-title">\n                <h3 id="im-custom-time-title">修改聊天时间</h3>\n                <label for="im-custom-time-input">日期和时间</label>\n                <input id="im-custom-time-input" type="datetime-local" step="60" required>\n                <p>从这里开始，后续聊天按设定的时间继续。</p>\n                <div class="im-custom-time-error" role="alert"></div>\n                <div class="im-custom-time-actions"><button type="button" class="im-custom-time-cancel">取消</button><button type="submit">保存</button></div>\n            </form>';
            (document.getElementById('app') || document.body).appendChild(_value13);
            const _value14 = () => {
                if (_value13._saving) return;
                _value13.hidden = true;
                _value13._returnFocus?.focus?.();
            };
            _value13.querySelector('.im-custom-time-cancel').addEventListener('click', _value14);
            _value13.addEventListener('click', (_value15) => {
                if (_value15.target === _value13) _value14();
            });
            _value13.addEventListener('keydown', (_value16) => {
                _value16.key === 'Escape' && (_value16.preventDefault(), _value14());
                if (_value16.key === 'Tab') {
                    const _value17 = Array.from(_value13.querySelectorAll('input, button')).filter(
                        (_value20) => !_value20.disabled,
                    );
                    const _value18 = _value17[0];
                    const _value19 = _value17[_value17.length - 1];
                    if (_value16.shiftKey && document.activeElement === _value18) {
                        _value16.preventDefault();
                        _value19.focus();
                    } else
                        !_value16.shiftKey &&
                            document.activeElement === _value19 &&
                            (_value16.preventDefault(), _value18.focus());
                }
            });
            _value13.querySelector('form').addEventListener('submit', async (_value21) => {
                _value21.preventDefault();
                if (_value13._saving) return;
                const _value22 = _value13.querySelector('input');
                const _value23 = _value13.querySelector('.im-custom-time-error');
                const _value24 = new Date(_value22.value).getTime();
                if (!_value22.value || !Number.isFinite(_value24)) {
                    _value23.textContent = '请选择有效的日期和时间';
                    return;
                }
                const _value25 = _value13._edit;
                _value13._saving = true;
                _value13.querySelectorAll('button').forEach((_value26) => {
                    _value26.disabled = true;
                });
                try {
                    const _value27 = await window.imApp.setCustomChatTime(
                        _value25.friendId,
                        _value25.timestamp,
                        _value24,
                        _value25.messageId,
                    );
                    if (!_value27) throw new Error('Time persistence failed');
                    _value13.hidden = true;
                    const _value28 = window.imApp.getFriendById(_value25.friendId);
                    const _value29 = document
                        .getElementById('chat-interface-' + _value25.friendId)
                        ?.querySelector('.ins-chat-messages');
                    if (_value28 && _value29)
                        rerenderChatContainer_2(_value28, _value29, {
                            scroll: false,
                        });
                } catch (_value30) {
                    _value23.textContent = '时间保存失败，请重试';
                } finally {
                    _value13._saving = false;
                    _value13.querySelectorAll('button').forEach((_value31) => {
                        _value31.disabled = false;
                    });
                }
            });
        }
        if (_value13._saving) return;
        _value13._edit = {
            friendId: _value10.id,
            timestamp: _value11,
            messageId: _value12,
        };
        _value13._returnFocus = document.activeElement;
        _value13.querySelector('input').value = window.imDataUtils.formatChatDateTime(
            getChatDisplayTimestamp(_value10, _value11),
            true,
        );
        _value13.querySelector('.im-custom-time-error').textContent = '';
        _value13.hidden = false;
        _value13.querySelector('input').focus();
    }
    function buildMessageHeaderHtml(
        value_44,
        friend_10,
        value_46,
        speakerName_3,
        speakerAvatar,
        hasPrev,
        message_6 = null,
    ) {
        if (!friend_10 || friend_10.type === 'group' || !friend_10.showAvatar || hasPrev) return '';
        if ((!friend_10.type || friend_10.type === 'char') && friend_10.avatarDisplayMode === 'two') return '';
        const date = new Date(getChatDisplayTimestamp(friend_10, value_46));
        const dateStr = date.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
        });
        const ampmTimeStr = date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });
        if (value_44) {
            const effectiveUserProfile_164 = getEffectiveUserProfile(
                friend_10,
                message_6 || renderMessageContextByFriend.get(friend_10),
            );
            const name_54 = effectiveUserProfile_164.name;
            const avatarUrl_55 = effectiveUserProfile_164.avatarUrl;
            return (
                '\n                <div class="chat-message-header user-header" style="display: flex; justify-content: flex-end; width: 100%; margin-bottom: 4px; padding-right: 0px; align-items: flex-start;">\n                    <div class="chat-header-info" style="display: flex; flex-direction: column; align-items: flex-end; justify-content: center; padding-right: 25px; margin-bottom: 0px; margin-right: -20px; padding-bottom: 0px;">\n                        <div class="chat-header-name" style="font-size: 14px; font-weight: 600; color: #333; margin-bottom: 2px;">' +
                name_54 +
                '</div>\n                        <div class="chat-header-date" style="font-size: 12px; color: #888;">' +
                dateStr +
                ' ' +
                ampmTimeStr +
                '</div>\n                    </div>\n                    <div class="chat-header-avatar" style="width: 44px; height: 44px; border-radius: 50%; overflow: hidden; border: 1px solid #eee; z-index: 2; background: #fff; flex-shrink: 0;">\n                        <img src="' +
                avatarUrl_55 +
                '" onerror="this.src=\'assets/moren-thumb.jpg\'" loading="lazy" decoding="async" style="width: 100%; height: 100%; object-fit: cover;">\n                    </div>\n                </div>\n            '
            );
        } else {
            const aiName = speakerName_3 || friend_10.nickname || friend_10.realName || 'AI';
            const aiAvatar = speakerAvatar || friend_10.avatarUrl || 'assets/moren-thumb.jpg';
            return (
                '\n                <div class="chat-message-header ai-header" style="display: flex; justify-content: flex-start; width: 100%; margin-bottom: 4px; padding-left: 0px; align-items: flex-start;">\n                    <div class="chat-header-avatar" style="width: 44px; height: 44px; border-radius: 50%; overflow: hidden; border: 1px solid #eee; z-index: 2; background: #fff; flex-shrink: 0;">\n                        <img src="' +
                aiAvatar +
                '" onerror="this.src=\'assets/moren-thumb.jpg\'" loading="lazy" decoding="async" style="width: 100%; height: 100%; object-fit: cover;">\n                    </div>\n                    <div class="chat-header-info" style="display: flex; flex-direction: column; align-items: flex-start; justify-content: center; padding-left: 25px; margin-bottom: 0px; margin-left: -20px; padding-bottom: 0px;">\n                        <div class="chat-header-name" style="font-size: 14px; font-weight: 600; color: #333; margin-bottom: 2px;">' +
                aiName +
                '</div>\n                        <div class="chat-header-date" style="font-size: 12px; color: #888;">' +
                dateStr +
                ' ' +
                ampmTimeStr +
                '</div>\n                    </div>\n                </div>\n            '
            );
        }
    }
    async function handleAction_25(value_169, message_170, value_171, value_172) {
        const narrationText = String(value_172 || '').trim();
        if (!value_169 || !message_170 || !narrationText) return false;
        const friendId_2 = value_169.id,
            value_174 =
                (window.imData?.friends || []).find(
                    (value_177) => String(value_177.id) === String(friendId_2),
                ) || value_169,
            descriptor_2 = {
                id: message_170.id || null,
                timestamp: message_170.timestamp || null,
            },
            saved_2 = window.imApp?.updateFriendMessage
                ? await window.imApp.updateFriendMessage(
                      friendId_2,
                      descriptor_2,
                      (targetMsg) => {
                          if (!targetMsg) return;
                          targetMsg.type = 'system_notice';
                          targetMsg.noticeKind = 'narration';
                          targetMsg.role = 'system';
                          targetMsg.content = narrationText;
                          targetMsg.text = narrationText;
                      },
                      {
                          silent: true,
                      },
                  )
                : false;
        if (!saved_2) {
            if (window.showToast) window.showToast('旁白保存失败');
            return false;
        }
        const value_176 =
            (window.imData?.friends || []).find(
                (value_178) => String(value_178.id) === String(friendId_2),
            ) || value_174;
        return (
            value_171 &&
                window.imChat.rerenderChatContainer &&
                window.imChat.rerenderChatContainer(value_176, value_171, {
                    scroll: true,
                }),
            window.imChat.renderChatsList && window.imChat.renderChatsList(),
            true
        );
    }
    async function deleteNarrationNoticeMessage(value_179, msg, value_180) {
        if (!value_179 || !msg) return false;
        const friendId_3 = value_179.id,
            value_182 =
                (window.imData?.friends || []).find(
                    (value_186) => String(value_186.id) === String(friendId_3),
                ) || value_179,
            descriptor_3 = {
                id: msg.id || null,
                timestamp: msg.timestamp || null,
            };
        let saved_3 = false;
        if (window.imApp?.removeFriendMessages)
            saved_3 = await window.imApp.removeFriendMessages(friendId_3, descriptor_3, {
                silent: true,
            });
        else
            window.imApp?.commitScopedFriendChange &&
                (saved_3 = await window.imApp.commitScopedFriendChange(
                    value_182,
                    (targetFriend) => {
                        if (!Array.isArray(targetFriend.messages)) return;
                        targetFriend.messages = targetFriend.messages.filter((targetMsg_2) => {
                            if (msg.id && targetMsg_2?.id)
                                return String(targetMsg_2.id) !== String(msg.id);
                            if (msg.timestamp && targetMsg_2?.timestamp)
                                return String(targetMsg_2.timestamp) !== String(msg.timestamp);
                            return targetMsg_2 !== msg;
                        });
                        window.imApp.clearFriendRuntimeMessageContext &&
                            window.imApp.clearFriendRuntimeMessageContext(targetFriend);
                    },
                    {
                        silent: true,
                    },
                ));
        if (!saved_3) {
            if (window.showToast) window.showToast('删除失败');
            return false;
        }
        const value_185 =
            (window.imData?.friends || []).find(
                (value_189) => String(value_189.id) === String(friendId_3),
            ) || value_182;
        return (
            value_180 &&
                window.imChat.rerenderChatContainer &&
                window.imChat.rerenderChatContainer(value_185, value_180, {
                    scroll: true,
                }),
            window.imChat.renderChatsList && window.imChat.renderChatsList(),
            true
        );
    }
    function openNarrationNoticeEditor(msg_4, friend, container) {
        if (!msg_4 || msg_4.noticeKind !== 'narration') return;
        const value_5 = msg_4.content || msg_4.text || '',
            resetPromptLayout = () => {
                const modalInputGroupElement = document.getElementById('modal-input-group'),
                    modalTextareaGroupElement = document.getElementById('modal-textarea-group'),
                    textarea = document.getElementById('modal-textarea'),
                    deleteBtn_2 = document.getElementById('modal-narration-delete-btn');
                if (modalInputGroupElement) modalInputGroupElement.style.display = 'block';
                if (modalTextareaGroupElement) modalTextareaGroupElement.style.display = 'none';
                if (textarea) textarea.value = '';
                if (deleteBtn_2) deleteBtn_2.remove();
            };
        if (!window.showCustomModal) {
            const nextText = window.prompt ? window.prompt('编辑旁白/动描', value_5) : null;
            nextText !== null && void handleAction_25(friend, msg_4, container, nextText);
            return;
        }
        window.showCustomModal({
            type: 'prompt',
            title: '编辑旁白/动描',
            placeholder: '修改旁白/动描...',
            confirmText: '保存',
            confirmTone: 'dark',
            defaultValue: value_5,
            onCancel: resetPromptLayout,
            onConfirm: async (newValue) => {
                const textarea_2 = document.getElementById('modal-textarea'),
                    textareaGroup = document.getElementById('modal-textarea-group'),
                    finalValue =
                        textarea_2 && textareaGroup && textareaGroup.style.display !== 'none'
                            ? textarea_2.value
                            : newValue;
                if (!String(finalValue || '').trim()) {
                    if (window.showToast) window.showToast('请输入旁白/动描内容');
                    resetPromptLayout();
                    return;
                }
                await handleAction_25(friend, msg_4, container, finalValue);
                resetPromptLayout();
            },
        });
        setTimeout(() => {
            const modalInputGroupElement_197 = document.getElementById('modal-input-group'),
                modalTextareaGroupElement_198 = document.getElementById('modal-textarea-group'),
                textarea_3 = document.getElementById('modal-textarea');
            if (modalInputGroupElement_197) modalInputGroupElement_197.style.display = 'none';
            if (modalTextareaGroupElement_198)
                modalTextareaGroupElement_198.style.display = 'block';
            textarea_3 &&
                ((textarea_3.placeholder = '修改旁白/动描...'),
                (textarea_3.value = value_5),
                textarea_3.focus());
            const modalTitle = document.getElementById('modal-title'),
                modalHeader = modalTitle?.closest('.wb-centered-modal-header') || null;
            if (modalHeader && !document.getElementById('modal-narration-delete-btn')) {
                modalHeader.style.position = 'relative';
                const deleteBtn = document.createElement('button');
                deleteBtn.id = 'modal-narration-delete-btn';
                deleteBtn.type = 'button';
                deleteBtn.setAttribute('aria-label', '删除旁白/动描');
                deleteBtn.title = '删除旁白/动描';
                deleteBtn.style.cssText =
                    'position:absolute; right:16px; top:50%; transform:translateY(-50%); width:32px; height:32px; border:none; border-radius:16px; background:#ffe5e5; color:#ff3b30; display:flex; align-items:center; justify-content:center; font-size:15px; cursor:pointer;';
                deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
                deleteBtn.addEventListener('click', async (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (window.confirm && !window.confirm('确定删除这条旁白/动描并清理上下文吗？'))
                        return;
                    deleteBtn.style.pointerEvents = 'none';
                    deleteBtn.style.opacity = '0.65';
                    const saved = await deleteNarrationNoticeMessage(friend, msg_4, container);
                    if (saved) {
                        resetPromptLayout();
                        if (window.closeCustomModal) window.closeCustomModal(false);
                        if (window.showToast) window.showToast('已删除旁白/动描');
                        return;
                    }
                    deleteBtn.style.pointerEvents = '';
                    deleteBtn.style.opacity = '';
                });
                modalHeader.appendChild(deleteBtn);
            }
        }, 10);
    }
    function openRecalledMessageDetail_2(content_2, value_202 = '') {
        const modal = document.getElementById('recalled-message-detail-modal'),
            contentEl = document.getElementById('recalled-message-detail-content'),
            translationEl = document.getElementById('recalled-message-detail-translation'),
            translateBtn = document.getElementById('recalled-message-detail-translate'),
            closeBtn = document.getElementById('recalled-message-detail-close');
        if (!modal || !contentEl) return false;
        contentEl.textContent = String(content_2 || '');
        const textContent_2 = String(value_202 || '').trim();
        translationEl &&
            ((translationEl.textContent = textContent_2), (translationEl.hidden = true));
        translateBtn &&
            ((translateBtn.hidden = !textContent_2),
            (translateBtn.textContent = '翻译'),
            translateBtn.setAttribute('aria-expanded', 'false'),
            (translateBtn.onclick = () => {
                if (!translationEl || !textContent_2) return;
                const willShow = translationEl.hidden;
                translationEl.hidden = !willShow;
                translateBtn.textContent = willShow ? '收起翻译' : '翻译';
                translateBtn.setAttribute('aria-expanded', willShow ? 'true' : 'false');
            }));
        const closeModal = () => {
            if (window.closeView) window.closeView(modal);
            else modal.classList.remove('active');
        };
        closeBtn &&
            closeBtn.dataset.bound !== 'true' &&
            ((closeBtn.dataset.bound = 'true'), closeBtn.addEventListener('click', closeModal));
        modal.dataset.bound !== 'true' &&
            ((modal.dataset.bound = 'true'),
            modal.addEventListener('click', (event_2) => {
                if (event_2.target === modal) closeModal();
            }));
        if (window.openView) window.openView(modal);
        else modal.classList.add('active');
        return true;
    }
    function renderLovesUnbindBubble_2(value_204, value_205_2, value_206, value_207 = Date.now()) {
        const value_208 = value_204.type === 'loves_unbind_decision',
            value_209_2 = value_204.decision === 'accept' || value_204.requestStatus === 'accepted',
            value_210 = value_204.decision === 'reject' || value_204.requestStatus === 'rejected',
            value_211_2 = value_208
                ? value_209_2
                    ? '解绑已同意'
                    : '解绑已拒绝'
                : 'Loves 解绑申请',
            value_212_2 = value_208
                ? value_209_2
                    ? '我同意解除 Loves 关系，历史内容会为你保留'
                    : '我暂时不想解除 Loves 关系'
                : '我申请解除我们的 Loves 关系',
            value_213_2 = value_208
                ? value_209_2
                    ? '已同意'
                    : '已拒绝'
                : value_209_2
                  ? '已同意'
                  : value_210
                    ? '已拒绝'
                    : '等待对方处理',
            content_4 =
                `
            <div class="loves-unbind-card ` +
                (value_208 ? 'is-decision' : 'is-request') +
                ' ' +
                (value_209_2 ? 'is-accepted' : '') +
                ' ' +
                (value_210 ? 'is-rejected' : '') +
                `">
                <span class="loves-unbind-card-icon"><i class="fas fa-heart"></i></span>
                <span class="loves-unbind-card-copy">
                    <strong>` +
                escapeHtml(value_211_2) +
                `</strong>
                    <small>` +
                escapeHtml(value_212_2) +
                `</small>
                    <em>` +
                escapeHtml(value_213_2) +
                `</em>
                </span>
            </div>`;
        return renderHtmlBubble_2(
            {
                ...value_204,
                type: 'html',
                content: content_4,
            },
            value_205_2,
            value_206,
            value_207,
        );
    }
    function renderTogetherListeningInviteBubble_2(
        msg_5,
        value_216_2,
        value_217,
        value_72 = Date.now(),
    ) {
        const value_219_2 = msg_5.inviteStatus === 'accepted',
            handleAction_15_220 = handleAction_15(msg_5.coverUrl),
            string = String(msg_5.title || '未知歌曲'),
            string_221 = String(msg_5.artist || '未知歌手'),
            string_222 = String(msg_5.playlistName || '我的歌单'),
            content_5 =
                `
            <section class="im-together-invite-card` +
                (value_219_2 ? ' is-accepted' : '') +
                `" aria-label="一起听邀请">
                <div class="im-together-invite-heading"><span><i class="fas fa-headphones"></i></span><div><small>LISTEN TOGETHER</small><strong>邀请你一起听</strong></div></div>
                <div class="im-together-invite-track">
                    <span class="im-together-invite-art">` +
                (handleAction_15_220
                    ? '<img src="' +
                      escapeHtml(handleAction_15_220) +
                      '" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">'
                    : '<i class="fas fa-music"></i>') +
                `</span>
                    <span class="im-together-invite-copy"><strong>` +
                escapeHtml(string) +
                '</strong><small>' +
                escapeHtml(string_221) +
                '</small><em>' +
                escapeHtml(string_222) +
                `</em></span>
                </div>
                <div class="im-together-invite-footer">
                    <span class="im-together-invite-status">` +
                (value_219_2 ? '已加入一起听' : '点击后将播放这首歌') +
                `</span>
                    <button type="button" class="im-together-invite-accept" ` +
                (value_219_2 ? 'disabled' : '') +
                '>' +
                (value_219_2 ? '已接受' : '一起听') +
                `</button>
                </div>
            </section>`;
        renderHtmlBubble_2(
            {
                ...msg_5,
                type: 'html',
                content: content_5,
            },
            value_216_2,
            value_217,
            value_72,
        );
        const messageId_3 = String(msg_5.id || ''),
            result = Array.from(value_217.children || [])
                .reverse()
                .find(
                    (candidate_2) =>
                        candidate_2.classList?.contains('chat-row') &&
                        String(candidate_2.getAttribute('data-message-id') || '') === messageId_3,
                ),
            imTogetherInviteCardElement = result?.querySelector('.im-together-invite-card'),
            imTogetherInviteAcceptElement = imTogetherInviteCardElement?.querySelector(
                '.im-together-invite-accept',
            ),
            imTogetherInviteStatusElement = imTogetherInviteCardElement?.querySelector(
                '.im-together-invite-status',
            );
        if (!imTogetherInviteAcceptElement || value_219_2 || value_216_2?.type !== 'char') return;
        imTogetherInviteAcceptElement.addEventListener('click', async () => {
            if (imTogetherInviteAcceptElement.disabled) return;
            imTogetherInviteAcceptElement.disabled = true;
            imTogetherInviteAcceptElement.textContent = '正在进入…';
            let value_226_2 = false;
            try {
                value_226_2 = await window.libraryApp?.acceptTogetherListeningInvitation?.(
                    value_216_2,
                    msg_5.trackId,
                );
            } catch (value_80) {
                console.error(
                    '[iMessage] Library failed to accept the listening invitation',
                    value_80,
                );
            }
            if (!value_226_2) {
                imTogetherInviteAcceptElement.disabled = false;
                imTogetherInviteAcceptElement.textContent = '一起听';
                if (imTogetherInviteStatusElement)
                    imTogetherInviteStatusElement.textContent = '歌曲暂时不可用，可稍后重试';
                return;
            }
            const acceptedAt_3 = Date.now();
            msg_5.inviteStatus = 'accepted';
            msg_5.acceptedAt = acceptedAt_3;
            imTogetherInviteCardElement?.classList.add('is-accepted');
            imTogetherInviteAcceptElement.textContent = '已接受';
            if (imTogetherInviteStatusElement)
                imTogetherInviteStatusElement.textContent = '已加入一起听';
            const value_228_2 = window.imApp?.updateFriendMessage
                ? await window.imApp.updateFriendMessage(
                      value_216_2.id,
                      {
                          id: msg_5.id,
                          timestamp: msg_5.timestamp,
                      },
                      (value_229) => {
                          value_229.inviteStatus = 'accepted';
                          value_229.acceptedAt = acceptedAt_3;
                      },
                      {
                          silent: true,
                      },
                  )
                : false;
            if (!value_228_2 && window.showToast)
                window.showToast('已进入一起听，但卡片状态保存失败');
        });
    }
    function renderContactCardBubble_2(message_230, value_231, element_232, value_81 = Date.now()) {
        const value_234_2 = message_230.role === 'user',
            handleAction_18_83 = handleAction_18(
                element_232,
                (element_96) =>
                    !element_96.classList.contains('chat-timestamp') &&
                    !element_96.classList.contains('typing-row'),
            );
        let enabled_84 = false;
        if (handleAction_18_83) {
            if (value_234_2 && handleAction_18_83.classList.contains('user-row')) {
                enabled_84 = true;
                handleAction_18_83.classList.add('has-next');
            } else
                !value_234_2 &&
                    handleAction_18_83.classList.contains('ai-row') &&
                    ((enabled_84 = true), handleAction_18_83.classList.add('has-next'));
        }
        const result_237 = (window.imData?.friends || []).find(
                (value_249) =>
                    (value_249?.type === 'char' || value_249?.type === 'npc') &&
                    String(value_249.id) === String(message_230.contactId || ''),
            ),
            value_238 =
                message_230.contactType === 'npc'
                    ? 'npc'
                    : message_230.contactType === 'char'
                      ? 'char'
                      : result_237?.type || 'char',
            slice_239 = String(
                message_230.contactName ||
                    result_237?.nickname ||
                    result_237?.realName ||
                    '未命名人物',
            )
                .trim()
                .slice(0, 200),
            slice_240 = String(message_230.contactRealName || result_237?.realName || '')
                .trim()
                .slice(0, 200),
            slice_241 = String(
                message_230.contactSignature || result_237?.signature || result_237?.persona || '',
            )
                .trim()
                .slice(0, 1000),
            handleAction_15_242 = handleAction_15(
                message_230.contactAvatarUrl || result_237?.avatarUrl || '',
            ),
            value_243_2 = handleAction_15_242
                ? '<img src="' +
                  escapeHtml(handleAction_15_242) +
                  '" alt="" loading="lazy" decoding="async" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';"><span class="im-contact-card-avatar-fallback" style="display:none;">' +
                  escapeHtml(slice_239.charAt(0) || '?') +
                  '</span>'
                : '<span class="im-contact-card-avatar-fallback">' +
                  escapeHtml(slice_239.charAt(0) || '?') +
                  '</span>',
            value_244_2 = slice_240 && slice_240 !== slice_239 ? slice_240 : '',
            value_245 = slice_241 || (value_238 === 'npc' ? 'NPC 联系人' : 'Char 联系人'),
            element_246 = document.createElement('div');
        element_246.className =
            'chat-row ' +
            (value_234_2 ? 'user-row' : 'ai-row') +
            ' ' +
            (enabled_84 ? 'has-prev' : '');
        element_246.setAttribute('data-timestamp', value_81);
        element_246.setAttribute(
            'data-message-id',
            window.imChat.ensureMessageId(message_230, 'contact-card'),
        );
        const handleAction_7_95 = buildMessageHeaderHtml(
            value_234_2,
            value_231,
            value_81,
            null,
            null,
            enabled_84,
            message_230,
        );
        element_246.innerHTML =
            `
            <div class="chat-checkbox-wrapper" style="display:` +
            (window.imData.batchSelectMode ? 'flex' : 'none') +
            `;width:40px;justify-content:center;align-items:flex-end;padding-bottom:10px;flex-shrink:0;cursor:pointer;transition:all .2s;">
                <i class="far fa-circle chat-checkbox" data-timestamp="` +
            value_81 +
            `" style="color:#c7c7cc;font-size:22px;"></i>
            </div>
            <div style="flex:1;display:flex;flex-direction:column;min-width:0;">
                ` +
            handleAction_7_95 +
            `
                <div style="display:flex;justify-content:` +
            (value_234_2 ? 'flex-end' : 'flex-start') +
            `;align-items:flex-end;width:100%;">
                    <div class="chat-bubble ` +
            (value_234_2 ? 'user-bubble' : 'ai-bubble') +
            ' im-card-bubble im-contact-card-bubble' +
            (value_234_2 ? '' : ' is-actionable') +
            '"' +
            (value_234_2 ? '' : ' role="button" tabindex="0" aria-label="查看个人名片"') +
            `>
                        <div class="im-contact-card-topline"><i class="fas fa-address-card" aria-hidden="true"></i><span>个人名片</span></div>
                        <div class="im-contact-card-profile">
                            <div class="im-contact-card-avatar">` +
            value_243_2 +
            `</div>
                            <div class="im-contact-card-copy">
                                <div class="im-contact-card-name-row"><strong>` +
            escapeHtml(slice_239) +
            '</strong><span class="' +
            (value_238 === 'npc' ? 'is-npc' : 'is-char') +
            '">' +
            (value_238 === 'npc' ? 'NPC' : 'Char') +
            `</span></div>
                                ` +
            (value_244_2 ? '<small>' + escapeHtml(value_244_2) + '</small>' : '') +
            `
                                <p>` +
            escapeHtml(value_245) +
            `</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        if (!value_234_2) {
            const imContactCardBubbleElement = element_246.querySelector('.im-contact-card-bubble'),
                openFakeLink = (event_250) => {
                    event_250?.preventDefault?.();
                    event_250?.stopPropagation?.();
                    window.imApp?.openContactCardActionModal?.(value_231, message_230);
                };
            imContactCardBubbleElement?.addEventListener('click', openFakeLink);
            imContactCardBubbleElement?.addEventListener('keydown', (event_3) => {
                if (event_3.key === 'Enter' || event_3.key === ' ') openFakeLink(event_3);
            });
        }
        return (
            element_232.appendChild(element_246),
            window.imChat.scrollToBottom(element_232),
            element_246
        );
    }
    function handleAction_30() {
        let overlay = document.getElementById('user-phone-access-detail-modal');
        const host = document.getElementById('app') || document.body;
        if (overlay) {
            if (overlay.parentNode !== host) host.appendChild(overlay);
            return overlay;
        }
        overlay = document.createElement('div');
        overlay.id = 'user-phone-access-detail-modal';
        overlay.className =
            'bottom-sheet-overlay detail-sheet-overlay wb-centered-modal-overlay user-phone-access-detail-overlay';
        overlay.style.display = 'none';
        overlay.innerHTML = `
            <div class="bottom-sheet wb-centered-modal-card user-phone-access-detail-card" role="dialog" aria-modal="true" aria-labelledby="user-phone-access-detail-title">
                <div class="user-phone-access-detail-header">
                    <button type="button" data-phone-access-close aria-label="关闭"><i class="fas fa-chevron-left" aria-hidden="true"></i></button>
                    <strong id="user-phone-access-detail-title">查手机记录</strong>
                    <span aria-hidden="true"></span>
                </div>
                <div class="user-phone-access-detail-list"></div>
            </div>`;
        const value_253 = () => {
            if (window.closeView) window.closeView(overlay);
            else {
                overlay.classList.remove('active');
                overlay.style.display = 'none';
            }
        };
        return (
            overlay.addEventListener('click', (event_254) => {
                if (
                    event_254.target === overlay ||
                    event_254.target.closest('[data-phone-access-close]')
                )
                    value_253();
            }),
            host.appendChild(overlay),
            overlay
        );
    }
    function openUserPhoneAccessDetail_2(value_255 = {}) {
        const overlay_2 = handleAction_30(),
            userPhoneAccessDetailListElement = overlay_2.querySelector(
                '.user-phone-access-detail-list',
            ),
            items_257 = Array.isArray(value_255.visits) ? value_255.visits : [];
        userPhoneAccessDetailListElement.innerHTML = '';
        items_257.forEach((value_258, value_259) => {
            const card_2 = document.createElement('section');
            card_2.className = 'user-phone-access-detail-item';
            const element_261 = document.createElement('div');
            element_261.className = 'user-phone-access-detail-item-heading';
            const element_262 = document.createElement('strong');
            element_262.textContent = String(value_258?.remark || '未命名联系人');
            const avatar_2 = document.createElement('span');
            avatar_2.textContent =
                '停留 ' +
                Math.min(120, Math.max(1, Math.round(Number(value_258?.durationSeconds) || 1))) +
                ' 秒';
            const element_264 = document.createElement('p');
            element_264.textContent = '内心 OS：' + String(value_258?.innerOs || '').trim();
            const element_265 = document.createElement('small');
            element_265.textContent = String(value_259 + 1).padStart(2, '0');
            element_261.append(element_262, avatar_2);
            card_2.append(element_265, element_261, element_264);
            userPhoneAccessDetailListElement.appendChild(card_2);
        });
        overlay_2.style.display = 'flex';
        if (window.openView) window.openView(overlay_2);
        else overlay_2.classList.add('active');
    }
    function renderUserPhoneAccessCard_2(
        value_266,
        value_267,
        element_268,
        value_269_2 = Date.now(),
    ) {
        const value_270 = Array.isArray(value_266.visits) ? value_266.visits : [],
            reduce_271 = value_270.reduce(
                (value_277, value_278) =>
                    value_277 +
                    Math.min(120, Math.max(1, Math.round(Number(value_278?.durationSeconds) || 1))),
                0,
            ),
            handleAction_18_272 = handleAction_18(
                element_268,
                (element_110) =>
                    !element_110.classList.contains('chat-timestamp') &&
                    !element_110.classList.contains('typing-row'),
            ),
            value_273_2 = !!handleAction_18_272?.classList.contains('ai-row');
        if (value_273_2) handleAction_18_272.classList.add('has-next');
        const element_274 = document.createElement('div');
        element_274.className =
            'chat-row ai-row user-phone-access-card-row ' + (value_273_2 ? 'has-prev' : '');
        element_274.setAttribute('data-timestamp', value_269_2);
        element_274.setAttribute(
            'data-message-id',
            window.imChat.ensureMessageId(value_266, 'phone-access'),
        );
        const handleAction_24_275 = buildMessageHeaderHtml(
            false,
            value_267,
            value_269_2,
            null,
            null,
            value_273_2,
            value_266,
        );
        element_274.innerHTML =
            `
            <div class="chat-checkbox-wrapper" style="display:` +
            (window.imData.batchSelectMode ? 'flex' : 'none') +
            `;width:40px;justify-content:center;align-items:flex-end;padding-bottom:10px;flex-shrink:0;cursor:pointer;transition:all .2s;">
                <i class="far fa-circle chat-checkbox" data-timestamp="` +
            value_269_2 +
            `" style="color:#c7c7cc;font-size:22px;"></i>
            </div>
            <div style="flex:1;display:flex;flex-direction:column;min-width:0;">
                ` +
            handleAction_24_275 +
            `
                <div style="display:flex;justify-content:flex-start;align-items:flex-end;width:100%;">
                    <div class="chat-bubble ai-bubble im-card-bubble user-phone-access-card" role="button" tabindex="0" aria-label="查看查手机记录详情">
                        <div class="user-phone-access-card-heading">
                            <span><i class="fas fa-mobile-alt" aria-hidden="true"></i></span>
                            <div><small>LOVES · MY PHONE</small><strong>查手机记录</strong></div>
                        </div>
                        <div class="user-phone-access-card-summary">查看了 ` +
            value_270.length +
            ' 个聊天 · 共停留 ' +
            reduce_271 +
            ` 秒</div>
                        <div class="user-phone-access-card-footer"><span>查看详情</span><i class="fas fa-chevron-right" aria-hidden="true"></i></div>
                    </div>
                </div>
            </div>`;
        const userPhoneAccessCardElement = element_274.querySelector('.user-phone-access-card'),
            openFakeLink_2 = (event_280) => {
                if (Date.now() < Number(window.imData?.suppressCardClickUntil || 0)) {
                    event_280?.preventDefault?.();
                    event_280?.stopPropagation?.();
                    return;
                }
                event_280?.preventDefault?.();
                event_280?.stopPropagation?.();
                openUserPhoneAccessDetail_2(value_266);
            };
        return (
            userPhoneAccessCardElement?.addEventListener('click', openFakeLink_2),
            userPhoneAccessCardElement?.addEventListener('keydown', (event_4) => {
                if (event_4.key === 'Enter' || event_4.key === ' ') openFakeLink_2(event_4);
            }),
            element_268.appendChild(element_274),
            window.imChat.scrollToBottom(element_268),
            element_274
        );
    }
    function handleAction_12(message_112, value_113) {
        const value_114 = window.imApp?.getFriendById?.(value_113.id) || value_113,
            value_115 =
                (Array.isArray(value_114.messages) ? value_114.messages : []).find(
                    (value_119) => String(value_119.id) === String(message_112.id),
                ) || message_112,
            value_116 = value_115.inviteStatus || 'pending',
            element_871 = document.createElement('div');
        element_871.className = 'offline-invite-detail-overlay';
        element_871.innerHTML =
            `<div class="offline-invite-detail" role="dialog" aria-modal="true" aria-label="线下邀请">
            <button type="button" class="offline-invite-close" aria-label="关闭">×</button>
            <div class="offline-invite-detail-icon"><i class="fas fa-location-dot" aria-hidden="true"></i></div>
            <small>线下邀请</small>
            <h2>` +
            escapeHtml(value_115.title || '见面邀请') +
            `</h2>
            <p>` +
            escapeHtml(value_115.invitationText || '') +
            `</p>
            ` +
            (value_115.place
                ? '<div class="offline-invite-place"><i class="fas fa-map-marker-alt" aria-hidden="true"></i>' +
                  escapeHtml(value_115.place) +
                  '</div>'
                : '') +
            `
            ` +
            (value_116 === 'pending'
                ? '<div class="offline-invite-detail-actions"><button type="button" data-offline-invite-action="accept">接受邀请</button><button type="button" data-offline-invite-action="decline">婉拒</button></div>'
                : '<div class="offline-invite-resolved">' +
                  ({
                      accepted: '已接受',
                      declined: '已婉拒',
                      superseded: '邀请已失效',
                  }[value_116] || '邀请已结束') +
                  '</div>') +
            `
        </div>`;
        (document.getElementById('app') || document.body).appendChild(element_871);
        const value_872_2 = () => element_871.remove(),
            value_118 = () => {
                const value_120 = window.imApp?.getFriendById?.(value_113.id) || value_113,
                    querySelector_121 = document.querySelector(
                        '#chat-interface-' +
                            CSS.escape(String(value_113.id)) +
                            ' .ins-chat-messages',
                    );
                if (querySelector_121)
                    window.imChat.rerenderChatContainer?.(value_120, querySelector_121, {
                        scroll: false,
                    });
            };
        element_871.addEventListener('click', async (event_122) => {
            if (
                event_122.target === element_871 ||
                event_122.target.closest('.offline-invite-close')
            )
                return value_872_2();
            const closest_123 = event_122.target.closest('[data-offline-invite-action]');
            if (!closest_123 || closest_123.disabled) return;
            closest_123.disabled = true;
            const offlineInviteAction_124 = closest_123.dataset.offlineInviteAction;
            if (offlineInviteAction_124 === 'accept') {
                const value_130 = await window.imChat.acceptOfflineInvitation?.(
                    value_113.id,
                    message_112.id,
                );
                if (!value_130) {
                    closest_123.disabled = false;
                    window.showToast?.('进入线下失败，请重试');
                    return;
                }
                value_118();
                value_872_2();
                return;
            }
            const respondedAt_2 = Date.now(),
                value_126 = window.imApp?.getFriendById?.(value_113.id) || value_113,
                result_127 = value_126.messages?.find(
                    (value_131) => String(value_131.id) === String(message_112.id),
                );
            if (result_127?.inviteStatus !== 'pending') {
                value_118();
                value_872_2();
                return;
            }
            const value_128 = await window.imApp?.updateFriendMessage?.(
                    value_113.id,
                    {
                        id: message_112.id,
                        timestamp: message_112.timestamp,
                    },
                    (value_132) => {
                        if (
                            value_132.type !== 'offline_invite' ||
                            value_132.inviteStatus !== 'pending'
                        )
                            return;
                        value_132.inviteStatus = 'declined';
                        value_132.respondedAt = respondedAt_2;
                    },
                    {
                        silent: true,
                    },
                ),
                result_129 = window.imApp
                    ?.getFriendById?.(value_113.id)
                    ?.messages?.find(
                        (value_133) => String(value_133.id) === String(message_112.id),
                    );
            if (!value_128 || result_129?.inviteStatus !== 'declined') {
                closest_123.disabled = false;
                window.showToast?.('邀请状态保存失败');
                return;
            }
            value_118();
            value_872_2();
        });
    }
    function renderOfflineInviteBubble_2(
        value_266_2,
        value_267_2,
        element_136,
        value_269_3 = Date.now(),
    ) {
        const handleAction_18_272_2 = handleAction_18(
                element_136,
                (element_144) =>
                    !element_144.classList.contains('chat-timestamp') &&
                    !element_144.classList.contains('typing-row'),
            ),
            value_273_3 = !!handleAction_18_272_2?.classList.contains('ai-row');
        if (value_273_3) handleAction_18_272_2.classList.add('has-next');
        const element_140 = document.createElement('div');
        element_140.className =
            'chat-row ai-row offline-invite-row ' + (value_273_3 ? 'has-prev' : '');
        element_140.setAttribute('data-timestamp', value_269_3);
        element_140.setAttribute(
            'data-message-id',
            window.imChat.ensureMessageId(value_266_2, 'offline-invite'),
        );
        const value_141 =
                {
                    pending: '查看邀请',
                    accepted: '已接受',
                    declined: '已婉拒',
                    superseded: '邀请已失效',
                }[value_266_2.inviteStatus] || '查看邀请',
            handleAction_24_275_2 = buildMessageHeaderHtml(
                false,
                value_267_2,
                value_269_3,
                null,
                null,
                value_273_3,
                value_266_2,
            );
        element_140.innerHTML =
            '<div class="chat-checkbox-wrapper" style="display:' +
            (window.imData.batchSelectMode ? 'flex' : 'none') +
            ';width:40px;justify-content:center;align-items:flex-end;padding-bottom:10px;flex-shrink:0;cursor:pointer;transition:all .2s;"><i class="far fa-circle chat-checkbox" data-timestamp="' +
            value_269_3 +
            `" style="color:#c7c7cc;font-size:22px;"></i></div>
            <div style="flex:1;display:flex;flex-direction:column;min-width:0;">` +
            handleAction_24_275_2 +
            `<div style="display:flex;justify-content:flex-start;align-items:flex-end;width:100%;">
            <div class="chat-bubble ai-bubble im-card-bubble offline-invite-card" role="button" tabindex="0" aria-label="查看线下邀请">
                <div class="offline-invite-card-heading"><span><i class="fas fa-location-dot" aria-hidden="true"></i></span><div><small>MEET OFFLINE</small><strong>` +
            escapeHtml(value_266_2.title || '见面邀请') +
            `</strong></div></div>
                <div class="offline-invite-card-summary">` +
            escapeHtml(value_266_2.invitationText || '') +
            `</div>
                ` +
            (value_266_2.place
                ? '<div class="offline-invite-card-place">' +
                  escapeHtml(value_266_2.place) +
                  '</div>'
                : '') +
            `
                <div class="offline-invite-card-footer"><span>` +
            value_141 +
            `</span><i class="fas fa-chevron-right" aria-hidden="true"></i></div>
            </div></div></div>`;
        const offlineInviteCardElement = element_140.querySelector('.offline-invite-card'),
            value_143 = (event_145) => {
                if (Date.now() < Number(window.imData?.suppressCardClickUntil || 0)) return;
                event_145.preventDefault();
                event_145.stopPropagation();
                handleAction_12(value_266_2, value_267_2);
            };
        offlineInviteCardElement?.addEventListener('click', value_143);
        offlineInviteCardElement?.addEventListener('keydown', (value_146) => {
            if (value_146.key === 'Enter' || value_146.key === ' ') value_143(value_146);
        });
        element_136.appendChild(element_140);
    }
    function renderSystemNoticeBubble_2(apk110New_408, apk110New_409) {
        return (
            window.imApp?.isGiftContextMessage?.(apk110New_409) ||
            (apk110New_408?.type === 'group' &&
                apk110New_409?.type === 'system_notice' &&
                apk110New_409.noticeKind === 'group_title_changed' &&
                window.imApp?.areGroupTitlesEnabled?.(apk110New_408) === false)
        );
    }
    function apk110New_43(msg_6, friend_11, container_3, value_147 = Date.now()) {
        if (renderSystemNoticeBubble_2(friend_11, msg_6)) return null;
        const row_6 = document.createElement('div');
        row_6.className = 'chat-system-row';
        row_6.setAttribute('data-timestamp', value_147);
        row_6.setAttribute('data-message-id', window.imChat.ensureMessageId(msg_6, 'notice'));
        const noticeKind_2 = msg_6.noticeKind || '';
        const noticeText =
            window.imApp?.getGroupManagementNoticeText?.(friend_11, msg_6) ||
            msg_6.text ||
            msg_6.content ||
            '系统提示';
        if (
            noticeKind_2 === 'user_phone_access' ||
            noticeKind_2 === 'user_remark_changed' ||
            noticeKind_2 === 'relationship_changed'
        ) {
            row_6.classList.add('user-phone-access-notice-row');
            const change = msg_6.remarkChange;
            const hasDetails =
                noticeKind_2 === 'user_remark_changed' &&
                typeof change?.oldRemark === 'string' &&
                typeof change?.newRemark === 'string';
            row_6.innerHTML =
                '<div class="user-phone-access-notice-pill" role="status">' +
                escapeHtml(noticeText) +
                (hasDetails
                    ? '<button type="button" class="char-user-remark-view-link" aria-label="查看备注修改详情">查看</button>'
                    : '') +
                '</div>';
            row_6
                .querySelector('.char-user-remark-view-link')
                ?.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const modal = document.getElementById('char-user-remark-detail-modal');
                    if (!modal) return;
                    document.getElementById('char-user-remark-detail-old').textContent =
                        change.oldRemark || '未设置备注';
                    document.getElementById('char-user-remark-detail-new').textContent =
                        change.newRemark;
                    if (!modal.dataset.bound) {
                        modal.dataset.bound = 'true';
                        modal.addEventListener('click', (event) => {
                            if (
                                event.target === modal ||
                                event.target.closest('[data-char-user-remark-close]')
                            )
                                window.closeView?.(modal);
                        });
                    }
                    window.openView?.(modal);
                });
            imChat_3.attachNoticeDeleteButton(row_6, friend_11, msg_6, {
                parent:
                    row_6.querySelector(
                        '.system-notice-card, .user-phone-access-notice-pill, .chat-block-status-pill, .message-recalled-notice',
                    ) || row_6,
            });
            container_3.appendChild(row_6);
            window.imChat.scrollToBottom(container_3);
            return row_6;
        }
        if (
            [
                'user_blocked_char',
                'char_blocked_user',
                'user_unblocked_char',
                'char_unblocked_user',
            ].includes(noticeKind_2)
        ) {
            const value_293_2 =
                noticeKind_2 === 'char_blocked_user' &&
                friend_11?.blockState?.charBlocksUser === true &&
                !window.imApp?.getPendingUnblockRequest?.(friend_11, 'user');
            row_6.innerHTML =
                '\n                <div class="chat-block-status-pill">\n                    <span>' +
                escapeHtml(noticeText) +
                '</span>\n                    ' +
                (value_293_2
                    ? '<button type="button" class="chat-block-request-link">请求解除</button>'
                    : '') +
                '\n                </div>\n            ';
            const chatBlockRequestLinkElement = row_6.querySelector('.chat-block-request-link');
            chatBlockRequestLinkElement?.addEventListener('click', (event_294) => {
                    event_294.preventDefault();
                    event_294.stopPropagation();
                    window.showCustomModal?.({
                        type: 'prompt',
                        multiline: true,
                        title: '请求解除拉黑',
                        message:
                            '填写你希望对方看到的申请理由。发送后，需要手动调用单聊 API 让 Char 决定。',
                        placeholder: '请输入申请理由',
                        confirmText: '发送',
                        cancelText: '取消',
                        onConfirm: async (value_295) => {
                            const trim_296 = String(value_295 || '').trim();
                            if (!trim_296) {
                                window.showToast?.('请填写申请理由');
                                return;
                            }
                            const value_297 = await window.imApp?.submitUnblockRequest?.(
                                friend_11,
                                'user',
                                trim_296,
                            );
                            window.showToast?.(
                                value_297 ? '解除申请已发送' : '已有待处理申请或发送失败',
                            );
                        },
                    });
                });
            imChat_3.attachNoticeDeleteButton(row_6, friend_11, msg_6, {
                parent:
                    row_6.querySelector(
                        '.system-notice-card, .user-phone-access-notice-pill, .chat-block-status-pill, .message-recalled-notice',
                    ) || row_6,
            });
            container_3.appendChild(row_6);
            window.imChat.scrollToBottom(container_3);
            return row_6;
        }
        if (noticeKind_2 === 'message_recalled') {
            const isUserRecall = msg_6.actorRole === 'user';
            const actorName_2 = String(
                msg_6.actorName || friend_11?.nickname || friend_11?.realName || '对方',
            ).trim();
            const value_300_2 = isUserRecall ? '你撤回了一条消息' : actorName_2 + '撤回了一条消息';
            const recalledContent_2 = !isUserRecall
                ? String(msg_6.payload?.recalledContent || '').trim()
                : '';
            const recalledTranslation_2 = !isUserRecall
                ? String(msg_6.payload?.recalledTranslation || '').trim()
                : '';
            row_6.innerHTML =
                '\n                <div class="message-recalled-notice">\n                    <span>' +
                escapeHtml(value_300_2) +
                '</span>' +
                (recalledContent_2 ? '<span class="message-recalled-view-link">查看</span>' : '') +
                '\n                </div>\n            ';
            const viewLink = row_6.querySelector('.message-recalled-view-link');
            viewLink &&
                viewLink.addEventListener('click', (event_5) => {
                        event_5.preventDefault();
                        event_5.stopPropagation();
                        openRecalledMessageDetail_2(recalledContent_2, recalledTranslation_2);
                    });
            imChat_3.attachNoticeDeleteButton(row_6, friend_11, msg_6, {
                parent:
                    row_6.querySelector(
                        '.system-notice-card, .user-phone-access-notice-pill, .chat-block-status-pill, .message-recalled-notice',
                    ) || row_6,
            });
            container_3.appendChild(row_6);
            window.imChat.scrollToBottom(container_3);
            return row_6;
        }
        const iconMap = {
            group_left: {
                icon: 'fa-sign-out-alt',
                color: '#ff3b30',
            },
            group_rejoined: {
                icon: 'fa-sign-in-alt',
                color: '#34c759',
            },
            narration: {
                icon: 'fa-quote-left',
                color: '#5856d6',
            },
            red_packet_claim: {
                icon: 'fa-envelope-open-text',
                color: '#ff9500',
            },
            offline_meeting_active: {
                icon: 'fa-user-friends',
                color: '#34c759',
            },
            group_private_to_user: {
                icon: 'fa-envelope',
                color: '#007aff',
            },
            group_friend_private_chat: {
                icon: 'fa-comments',
                color: '#5856d6',
            },
            group_admin_promoted: {
                icon: 'fa-user-shield',
                color: '#007aff',
            },
            group_admin_removed: {
                icon: 'fa-user-minus',
                color: '#8e8e93',
            },
            group_title_changed: {
                icon: 'fa-award',
                color: '#ff9500',
            },
            family_card_spend: {
                icon: 'fa-credit-card',
                color: '#a97642',
            },
            mcp_tool_success: {
                icon: 'fa-check',
                color: '#34c759',
            },
        };
        const iconMeta = iconMap[noticeKind_2] || {
            icon: 'fa-info-circle',
            color: '#8e8e93',
        };
        const textAlign = noticeKind_2 === 'narration' ? 'left' : 'center';
        const value_292_2 =
            noticeKind_2 === 'group_friend_private_chat'
                ? '<span>' +
                  escapeHtml(noticeText) +
                  '</span><span class="group-private-chat-view-link">查看</span>'
                : '<span>' + escapeHtml(noticeText) + '</span>';
        row_6.innerHTML =
            '\n            <div style="width:100%; display:flex; justify-content:center; padding:2px 0; margin:10px 0;">\n                <div class="voice-call-record-card im-card-content system-notice-card system-notice-' +
            escapeHtml(noticeKind_2 || 'default') +
            '" style="max-width:80%; padding:10px 16px; border-radius:18px; background:rgba(0,0,0,0.05); color:#000; font-size:13px; line-height:1.4; text-align:' +
            textAlign +
            '; display:flex; align-items:flex-start; gap:8px; white-space:pre-wrap; word-break:break-word; ' +
            (noticeKind_2 === 'narration' ? 'cursor:pointer;' : '') +
            '">\n                    <i class="fas ' +
            iconMeta.icon +
            '" style="color:' +
            iconMeta.color +
            '; line-height:1.4; flex-shrink:0;"></i>\n                    <span style="display:inline-flex; align-items:center; flex-wrap:wrap; justify-content:center;">' +
            value_292_2 +
            '</span>\n                </div>\n            </div>\n        ';
        if (noticeKind_2 === 'narration') {
            const card_3 = row_6.querySelector('.system-notice-card');
            card_3 &&
                ((card_3.title = '点击编辑旁白'),
                card_3.addEventListener('click', (event_6) => {
                    event_6.preventDefault();
                    event_6.stopPropagation();
                    openNarrationNoticeEditor(msg_6, friend_11, container_3);
                }));
        }
        if (noticeKind_2 === 'group_friend_private_chat') {
            const viewLink_2 = row_6.querySelector('.group-private-chat-view-link');
            viewLink_2 &&
                viewLink_2.addEventListener('click', (event_305) => {
                    event_305.preventDefault();
                    event_305.stopPropagation();
                    window.imApp?.openGroupPrivateChatDetail &&
                        window.imApp.openGroupPrivateChatDetail(
                            msg_6.privateChatSnapshot || msg_6.payload?.privateChatSnapshot,
                        );
                });
        }
        imChat_3.attachNoticeDeleteButton(row_6, friend_11, msg_6, {
            parent:
                row_6.querySelector(
                    '.system-notice-card, .user-phone-access-notice-pill, .chat-block-status-pill, .message-recalled-notice',
                ) || row_6,
        });
        container_3.appendChild(row_6);
        window.imChat.scrollToBottom(container_3);
    }
    function handleAction_34() {
        let modal_2 = document.getElementById('unblock-request-detail-modal');
        if (modal_2) return modal_2;
        return (
            (modal_2 = document.createElement('div')),
            (modal_2.id = 'unblock-request-detail-modal'),
            (modal_2.className =
                'bottom-sheet-overlay detail-sheet-overlay wb-centered-modal-overlay'),
            (modal_2.style.zIndex = '1080'),
            (modal_2.innerHTML = `
            <div class="bottom-sheet wb-centered-modal-card unblock-request-detail-card">
                <div class="unblock-request-detail-header">
                    <button type="button" data-unblock-close>关闭</button>
                    <strong>解除拉黑申请</strong>
                    <button type="button" class="unblock-request-detail-delete" data-unblock-delete aria-label="删除申请" title="删除申请">
                        <i class="fas fa-trash-alt" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="unblock-request-detail-body">
                    <div class="unblock-request-detail-reason"></div>
                    <div class="unblock-request-detail-status"></div>
                </div>
                <div class="unblock-request-detail-actions">
                    <button type="button" class="is-reject" data-unblock-reject>拒绝</button>
                    <button type="button" class="is-accept" data-unblock-accept>同意</button>
                </div>
            </div>
        `),
            document.body.appendChild(modal_2),
            modal_2.addEventListener('click', (event_306) => {
                (event_306.target === modal_2 ||
                    event_306.target.closest('[data-unblock-close]')) &&
                    (window.closeView
                        ? window.closeView(modal_2)
                        : (modal_2.style.display = 'none'));
            }),
            modal_2
        );
    }
    function handleAction_35(message_307, friend_12) {
        const handleAction_34_309 = handleAction_34(),
            unblockRequestDetailReasonElement = handleAction_34_309.querySelector(
                '.unblock-request-detail-reason',
            ),
            unblockRequestDetailStatusElement = handleAction_34_309.querySelector(
                '.unblock-request-detail-status',
            ),
            dataUnblockAcceptElement = handleAction_34_309.querySelector('[data-unblock-accept]'),
            dataUnblockRejectElement = handleAction_34_309.querySelector('[data-unblock-reject]'),
            dataUnblockDeleteElement = handleAction_34_309.querySelector('[data-unblock-delete]'),
            options_310 = {
                pending: '待处理',
                accepted: '已同意',
                rejected: '已拒绝',
                resolved: '已解除',
            };
        unblockRequestDetailReasonElement.textContent =
            message_307.requestText || message_307.content || '未填写申请理由';
        unblockRequestDetailStatusElement.textContent =
            options_310[message_307.requestStatus] || '待处理';
        const value_311 =
            message_307.requesterRole === 'assistant' && message_307.requestStatus === 'pending';
        dataUnblockAcceptElement.style.display = value_311 ? '' : 'none';
        dataUnblockRejectElement.style.display = value_311 ? '' : 'none';
        const value_312 = async (value_313) => {
            dataUnblockAcceptElement.disabled = true;
            dataUnblockRejectElement.disabled = true;
            const value_314 = await window.imApp?.resolveUnblockRequest?.(
                friend_12,
                message_307.id,
                value_313,
            );
            dataUnblockAcceptElement.disabled = false;
            dataUnblockRejectElement.disabled = false;
            if (!value_314) {
                window.showToast?.('申请状态更新失败');
                return;
            }
            window.closeView
                ? window.closeView(handleAction_34_309)
                : (handleAction_34_309.style.display = 'none');
            window.showToast?.(value_313 === 'accept' ? '已同意解除拉黑' : '已拒绝解除拉黑');
        };
        dataUnblockAcceptElement.onclick = () => void value_312('accept');
        dataUnblockRejectElement.onclick = () => void value_312('reject');
        dataUnblockDeleteElement.onclick = async () => {
            if (window.confirm && !window.confirm('确定删除这条解除拉黑申请吗？')) return;
            dataUnblockDeleteElement.disabled = true;
            const value_315 = await window.imApp?.removeFriendMessages?.(
                friend_12.id,
                {
                    id: message_307.id || null,
                    timestamp: message_307.timestamp || null,
                },
                {
                    silent: true,
                },
            );
            dataUnblockDeleteElement.disabled = false;
            if (!value_315) {
                window.showToast?.('删除失败');
                return;
            }
            window.closeView
                ? window.closeView(handleAction_34_309)
                : (handleAction_34_309.style.display = 'none');
            const value_316 =
                    (window.imData?.friends || []).find(
                        (item) => String(item.id) === String(friend_12.id),
                    ) || friend_12,
                querySelector_317 = document.querySelector(
                    '#chat-interface-' + friend_12.id + ' .ins-chat-messages',
                );
            querySelector_317 &&
                window.imChat?.rerenderChatContainer &&
                window.imChat.rerenderChatContainer(value_316, querySelector_317, {
                    scroll: false,
                });
            window.imChat?.renderChatsList?.();
            window.showToast?.('已删除申请');
        };
        window.openView
            ? window.openView(handleAction_34_309)
            : (handleAction_34_309.style.display = 'flex');
    }
    function renderUnblockRequestBubble_2(
        message_318,
        value_319,
        element_158,
        value_159 = Date.now(),
    ) {
        const element_322 = document.createElement('div'),
            value_323 = message_318.requesterRole === 'user';
        element_322.className =
            'chat-row unblock-request-row ' + (value_323 ? 'user-row' : 'ai-row');
        element_322.setAttribute('data-timestamp', value_159);
        element_322.setAttribute(
            'data-message-id',
            window.imChat.ensureMessageId(message_318, 'unblock'),
        );
        const options_162 = {
            pending: '待处理',
            accepted: '已同意',
            rejected: '已拒绝',
            resolved: '已解除',
        };
        return (
            (element_322.innerHTML =
                `
            <button type="button" class="unblock-request-card ` +
                (value_323 ? 'is-user' : 'is-char') +
                `">
                <span class="unblock-request-card-icon"><i class="fas fa-user-check"></i></span>
                <span class="unblock-request-card-copy">
                    <strong>解除拉黑申请</strong>
                    <small>` +
                escapeHtml(
                    String(message_318.requestText || message_318.content || '').slice(0, 48),
                ) +
                `</small>
                </span>
                <span class="unblock-request-card-status">` +
                (options_162[message_318.requestStatus] || '待处理') +
                `</span>
            </button>
        `),
            element_322
                .querySelector('.unblock-request-card')
                ?.addEventListener('click', () => handleAction_35(message_318, value_319)),
            element_158.appendChild(element_322),
            window.imChat.scrollToBottom(element_158),
            element_322
        );
    }
    function handleAction_37() {
        let modal_3 = document.getElementById('memory-request-detail-modal');
        if (modal_3) return modal_3;
        return (
            (modal_3 = document.createElement('div')),
            (modal_3.id = 'memory-request-detail-modal'),
            (modal_3.className =
                'bottom-sheet-overlay detail-sheet-overlay wb-centered-modal-overlay'),
            (modal_3.style.zIndex = '1080'),
            (modal_3.innerHTML = `
            <div class="bottom-sheet wb-centered-modal-card memory-request-detail-card">
                <div class="memory-request-detail-header">
                    <button type="button" data-memory-request-close>关闭</button>
                    <strong>想记住一些事</strong>
                    <span aria-hidden="true"></span>
                </div>
                <div class="memory-request-detail-body">
                    <div class="memory-request-detail-title"></div>
                    <div class="memory-request-detail-content"></div>
                    <div class="memory-request-detail-meta"></div>
                    <div class="memory-request-detail-reason"></div>
                </div>
                <div class="memory-request-detail-actions">
                    <button type="button" class="is-cancel" data-memory-request-cancel>算了</button>
                    <button type="button" class="is-confirm" data-memory-request-confirm>记住</button>
                </div>
            </div>
        `),
            document.body.appendChild(modal_3),
            modal_3.addEventListener('click', (event_325) => {
                if (
                    event_325.target === modal_3 ||
                    event_325.target.closest('[data-memory-request-close]')
                ) {
                    if (window.closeView) window.closeView(modal_3);
                    else modal_3.style.display = 'none';
                }
            }),
            modal_3
        );
    }
    function handleAction_38(message_326, value_327) {
        if (!message_326 || !value_327 || value_327.type === 'group') return;
        const detailModal_2 = handleAction_37(),
            message_329 =
                message_326.memoryPayload && typeof message_326.memoryPayload === 'object'
                    ? message_326.memoryPayload
                    : {},
            trim_330 = String(message_326.memoryRequestId || message_326.id || '').trim(),
            value_331 = message_326.requestStatus === 'pending',
            memoryRequestDetailTitleElement = detailModal_2.querySelector(
                '.memory-request-detail-title',
            ),
            memoryRequestDetailContentElement = detailModal_2.querySelector(
                '.memory-request-detail-content',
            ),
            memoryRequestDetailMetaElement = detailModal_2.querySelector(
                '.memory-request-detail-meta',
            ),
            memoryRequestDetailReasonElement = detailModal_2.querySelector(
                '.memory-request-detail-reason',
            ),
            dataMemoryRequestConfirmElement = detailModal_2.querySelector(
                '[data-memory-request-confirm]',
            ),
            dataMemoryRequestCancelElement = detailModal_2.querySelector(
                '[data-memory-request-cancel]',
            );
        if (
            !trim_330 ||
            !memoryRequestDetailTitleElement ||
            !memoryRequestDetailContentElement ||
            !memoryRequestDetailMetaElement ||
            !memoryRequestDetailReasonElement ||
            !dataMemoryRequestConfirmElement ||
            !dataMemoryRequestCancelElement
        )
            return;
        memoryRequestDetailTitleElement.textContent =
            String(message_329.title || '珍视回忆').trim() || '珍视回忆';
        memoryRequestDetailContentElement.textContent =
            String(message_329.content || message_326.content || '').trim() || '没有可保存的内容。';
        const items_332 = [];
        if (message_329.createdAt) items_332.push(String(message_329.createdAt));
        items_332.push(
            message_326.requestStatus === 'confirmed'
                ? '已记住'
                : message_326.requestStatus === 'cancelled'
                  ? '已忽略'
                  : '等待你的选择',
        );
        memoryRequestDetailMetaElement.textContent = items_332.join(' · ');
        memoryRequestDetailReasonElement.textContent = String(
            message_329.reason || message_329.detail || '',
        ).trim();
        memoryRequestDetailReasonElement.hidden = !memoryRequestDetailReasonElement.textContent;
        dataMemoryRequestConfirmElement.hidden = !value_331;
        dataMemoryRequestCancelElement.hidden = !value_331;
        let enabled_333 = false;
        const value_334 = async (value_335) => {
            if (enabled_333 || message_326.requestStatus !== 'pending') return;
            enabled_333 = true;
            dataMemoryRequestConfirmElement.disabled = true;
            dataMemoryRequestCancelElement.disabled = true;
            let enabled_336 = false;
            try {
                enabled_336 = await window.imApp?.resolveMemoryRequest?.(
                    value_327,
                    trim_330,
                    value_335,
                );
            } finally {
                enabled_333 = false;
                dataMemoryRequestConfirmElement.disabled = false;
                dataMemoryRequestCancelElement.disabled = false;
            }
            if (!enabled_336) {
                window.showToast?.(value_335 === 'confirm' ? '记忆保存失败' : '请求状态更新失败');
                return;
            }
            message_326.requestStatus = value_335 === 'confirm' ? 'confirmed' : 'cancelled';
            const elementById = document.getElementById('chat-interface-' + value_327.id),
                result_337 = Array.from(
                    elementById?.querySelectorAll('.memory-request-narration[data-message-id]') ||
                        [],
                ).find(
                    (value_338) =>
                        value_338.getAttribute('data-message-id') ===
                        String(message_326.id || trim_330),
                ),
                memoryRequestNarrationPillElement = result_337?.querySelector(
                    '.memory-request-narration-pill',
                );
            memoryRequestNarrationPillElement &&
                ((memoryRequestNarrationPillElement.textContent =
                    '想记住一些事\u3000' + (value_335 === 'confirm' ? '已记住' : '已忽略')),
                memoryRequestNarrationPillElement.removeAttribute('role'),
                memoryRequestNarrationPillElement.removeAttribute('tabindex'));
            if (window.closeView) window.closeView(detailModal_2);
            else detailModal_2.style.display = 'none';
            window.showToast?.(value_335 === 'confirm' ? '已记住' : '已忽略');
        };
        dataMemoryRequestConfirmElement.onclick = () => void value_334('confirm');
        dataMemoryRequestCancelElement.onclick = () => void value_334('cancel');
        if (window.openView) window.openView(detailModal_2);
        else detailModal_2.style.display = 'flex';
    }
    function renderMemoryRequestBubble_3(
        value_339,
        value_340,
        element_341,
        value_342 = Date.now(),
    ) {
        const element_343 = document.createElement('div');
        element_343.className = 'chat-row memory-recall-narration memory-request-narration';
        element_343.setAttribute('data-timestamp', value_342);
        element_343.setAttribute(
            'data-message-id',
            window.imChat.ensureMessageId(value_339, 'memory-request'),
        );
        const value_344 =
                value_339.requestStatus === 'confirmed'
                    ? '已记住'
                    : value_339.requestStatus === 'cancelled'
                      ? '已忽略'
                      : '',
            element_345 = document.createElement('span');
        element_345.className = 'memory-recall-narration-pill memory-request-narration-pill';
        element_345.textContent = '想记住一些事\u3000' + (value_344 || '查看');
        element_343.appendChild(element_345);
        imChat_3.attachNoticeDeleteButton(element_343, value_340, value_339);
        !value_344 && (element_345.setAttribute('role', 'button'), (element_345.tabIndex = 0));
        const handleClick_2 = (event_347) => {
            event_347.preventDefault();
            event_347.stopPropagation();
            if (value_339.requestStatus !== 'pending') return;
            handleAction_38(value_339, value_340);
        };
        return (
            !value_344 &&
                (element_345.addEventListener('click', handleClick_2),
                element_345.addEventListener('keydown', (event_7) => {
                    if (event_7.key !== 'Enter' && event_7.key !== ' ') return;
                    handleClick_2(event_7);
                })),
            element_341.appendChild(element_343),
            window.imChat.scrollToBottom(element_341),
            element_343
        );
    }
    function renderGroupRedPacketBubble_2(msg_7, friend_13, element_351, value_163 = Date.now()) {
        window.imChat.normalizeGroupRedPacketState(msg_7, friend_13);
        const isUser_3 = msg_7.role === 'user';
        const isGroupMessage = friend_13.type === 'group' && !isUser_3;
        const groupBubbleIdentity = resolveGroupBubbleIdentity(friend_13, msg_7);
        const name_166 = groupBubbleIdentity.name;
        const avatarUrl_167 = groupBubbleIdentity.avatarUrl;
        const lastElementChild_168 = element_351.lastElementChild;
        let enabled_169 = false;
        let enabled_170 = false;
        if (lastElementChild_168) {
            if (isUser_3 && lastElementChild_168.classList.contains('user-row')) {
                enabled_169 = true;
                lastElementChild_168.classList.add('has-next');
            } else {
                if (!isUser_3 && lastElementChild_168.classList.contains('ai-row')) {
                    const value_190 = lastElementChild_168.getAttribute('data-speaker') || null;
                    if (isGroupMessage)
                        value_190 === name_166 &&
                            ((enabled_169 = true),
                            (enabled_170 = true),
                            lastElementChild_168.classList.add('has-next'));
                    else
                        !value_190 &&
                            ((enabled_169 = true),
                            (enabled_170 = true),
                            lastElementChild_168.classList.add('has-next'));
                }
            }
        }
        const row_7 = document.createElement('div');
        row_7.className =
            'chat-row ' +
            (isUser_3 ? 'user-row' : 'ai-row') +
            ' ' +
            (enabled_169 ? 'has-prev' : '') +
            ' ' +
            (isGroupMessage ? 'group-ai-row' : '') +
            ' ' +
            (isGroupMessage && enabled_170 ? 'group-ai-row-continuous' : '');
        row_7.setAttribute('data-timestamp', value_163);
        row_7.setAttribute('data-message-id', window.imChat.ensureMessageId(msg_7, 'packet'));
        name_166 && row_7.setAttribute('data-speaker', name_166);
        groupBubbleIdentity.memberId !== '' &&
            row_7.setAttribute('data-speaker-member-id', String(groupBubbleIdentity.memberId));
        handleAction_20(row_7, friend_13, msg_7);
        const totalAmount_2 = Number(msg_7.totalAmount) || 0;
        const packetCount_2 = parseInt(msg_7.packetCount, 10) || 0;
        const claimedCount = Array.isArray(msg_7.claimRecords) ? msg_7.claimRecords.length : 0;
        const value_365_2 = msg_7.currentUserClaimed
            ? '已领取 · ' + claimedCount + '/' + packetCount_2
            : msg_7.isFinished
              ? claimedCount + '/' + packetCount_2 + ' 已领取'
              : '点击领取红包';
        const value_366_2 =
            '\n            <div class="group-red-packet-card im-card-content" role="button" tabindex="0">\n                <div class="group-red-packet-main">\n                    <i class="fas fa-gift group-red-packet-icon" aria-hidden="true"></i>\n                    <div class="group-red-packet-copy">\n                        <strong class="group-red-packet-title">' +
            escapeHtml(msg_7.description || '恭喜发财') +
            '</strong>\n                        <span class="group-red-packet-status">' +
            escapeHtml(value_365_2) +
            '</span>\n                    </div>\n                </div>\n                <strong class="group-red-packet-amount">$' +
            totalAmount_2.toFixed(2) +
            '</strong>\n            </div>\n        ';
        const value_187 =
            formatBubbleTime(getChatDisplayTimestamp(friend_13, value_163));
        const handleAction_7_188 = buildMessageHeaderHtml(
            isUser_3,
            friend_13,
            value_163,
            name_166,
            avatarUrl_167,
            enabled_169,
            msg_7,
        );
        if (isUser_3) {
            const text_192 = '';
            row_7.innerHTML =
                '\n                <div class="chat-checkbox-wrapper" style="display: ' +
                (window.imData.batchSelectMode ? 'flex' : 'none') +
                '; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">\n                    <i class="far fa-circle chat-checkbox" data-timestamp="' +
                value_163 +
                '" style="color: #c7c7cc; font-size: 22px;"></i>\n                </div>\n                <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">\n                    ' +
                handleAction_7_188 +
                '\n                    <div style="display: flex; justify-content: flex-end; align-items: flex-end; width: 100%;">\n                        <div class="chat-bubble user-bubble im-card-bubble pay-transfer-bubble group-red-packet-bubble">' +
                value_366_2 +
                text_192 +
                '</div>\n                    </div>\n                </div>\n            ';
        } else {
            const text_372 = '';
            let text_373 = '';
            if (isGroupMessage) {
                text_373 =
                    '\n                    <div class="group-ai-bubble-wrap">\n                        ' +
                    (enabled_170
                        ? ''
                        : '<div class="group-ai-speaker-name">' + name_166 + '</div>') +
                    '\n                        <div class="group-ai-bubble-row">\n                            ' + '\n                            <div class="chat-bubble ai-bubble im-card-bubble pay-transfer-bubble group-red-packet-bubble">' +
                    value_366_2 +
                    text_372 +
                    '</div>\n                        </div>\n                    </div>\n                ';
            } else
                text_373 =
                    '<div class="chat-bubble ai-bubble im-card-bubble pay-transfer-bubble group-red-packet-bubble">' +
                    value_366_2 +
                    text_372 +
                    '</div>';
            row_7.innerHTML =
                '\n                <div class="chat-checkbox-wrapper" style="display: ' +
                (window.imData.batchSelectMode ? 'flex' : 'none') +
                '; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">\n                    <i class="far fa-circle chat-checkbox" data-timestamp="' +
                value_163 +
                '" style="color: #c7c7cc; font-size: 22px;"></i>\n                </div>\n                <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">\n                    ' +
                handleAction_7_188 +
                '\n                    <div style="display: flex; justify-content: flex-start; align-items: flex-end; width: 100%;">\n                        ' +
                text_373 +
                '\n                    </div>\n                </div>\n            ';
        }
        const clickableBubble = row_7.querySelector('.group-red-packet-card');
        clickableBubble &&
            (clickableBubble.addEventListener('click', (event_376) => {
                event_376.preventDefault();
                event_376.stopPropagation();
                const activePage = element_351.closest('.active-chat-interface');
                if (!activePage) return;
                !activePage._openGroupRedPacketInteraction &&
                    window.imChat.ensureRedPacketDetailOverlayForExistingPage(
                        activePage,
                        friend_13,
                    );
                activePage._openGroupRedPacketInteraction &&
                    activePage._openGroupRedPacketInteraction(msg_7);
            }),
            clickableBubble.addEventListener('keydown', (apk110New_527) => {
                if (apk110New_527.key !== 'Enter' && apk110New_527.key !== ' ') return;
                apk110New_527.preventDefault();
                clickableBubble.click();
            }));
        element_351.appendChild(row_7);
        window.imChat.scrollToBottom(element_351);
    }
    function renderGroupPollBubble_2(msg_8, friend_14, container_4, timestamp_2 = Date.now()) {
        if (!msg_8 || !friend_14 || friend_14.type !== 'group' || !container_4) return;
        const options_2 = Array.isArray(msg_8.pollOptions) ? msg_8.pollOptions : [],
            votes = Array.isArray(msg_8.pollVotes) ? msg_8.pollVotes : [],
            userVote = votes.find((vote) => vote?.voterType === 'user'),
            status_3 = String(msg_8.pollStatus || 'completed'),
            messageId_4 = window.imChat.ensureMessageId(msg_8, 'poll'),
            join_202 = options_2
                .map((option) => {
                    const optionId_2 = String(option?.id || ''),
                        optionVotes = votes.filter(
                            (vote_2) => String(vote_2?.optionId || '') === optionId_2,
                        ),
                        join_393 = optionVotes
                            .map((vote_3) => {
                                const isUser_4 = vote_3?.voterType === 'user',
                                    member_3 = isUser_4
                                        ? null
                                        : (window.imData?.friends || []).find(
                                              (item_2) =>
                                                  String(item_2.id) === String(vote_3?.voterId),
                                          ),
                                    profile_3 = isUser_4
                                        ? getEffectiveUserProfile(friend_14, msg_8)
                                        : null,
                                    voterName_2 =
                                        vote_3?.voterName ||
                                        member_3?.nickname ||
                                        member_3?.realName ||
                                        (isUser_4 ? profile_3?.name : '群成员'),
                                    avatarUrl_3 = isUser_4
                                        ? profile_3?.avatarUrl
                                        : vote_3?.voterAvatarUrl || member_3?.avatarUrl;
                                return (
                                    '<span class="group-poll-voter' +
                                    (isUser_4 ? ' is-user-voter' : '') +
                                    '"><img src="' +
                                    escapeHtml(avatarUrl_3 || 'assets/moren-thumb.jpg') +
                                    '" alt="">' +
                                    escapeHtml(voterName_2) +
                                    '</span>'
                                );
                            })
                            .join('');
                    return (
                        `
                <button type="button" class="group-poll-card-option` +
                        (String(userVote?.optionId || '') === optionId_2
                            ? ' is-user-selected'
                            : '') +
                        '" data-poll-option-id="' +
                        escapeHtml(optionId_2) +
                        `">
                    <span class="group-poll-card-option-main">
                        <span class="group-poll-radio"></span>
                        <span class="group-poll-option-text">` +
                        escapeHtml(option?.text || '') +
                        `</span>
                        <span class="group-poll-option-count">` +
                        optionVotes.length +
                        ` 票</span>
                    </span>
                    ` +
                        (join_393
                            ? '<span class="group-poll-voters">' + join_393 + '</span>'
                            : '') +
                        `
                </button>
            `
                    );
                })
                .join('');
        let value_388 = votes.length + ' 人已投';
        if (status_3 === 'idle')
            value_388 = userVote ? '已选择，发送群聊回复后角色会投票' : '请选择你的选项';
        else {
            if (status_3 === 'pending') value_388 = '等待群聊回复';
            else
                status_3 === 'error' &&
                    (value_388 = userVote ? '已选择，发送群聊回复后角色会投票' : '请选择你的选项');
        }
        const row_8 = document.createElement('div');
        row_8.className = 'chat-row user-row group-poll-row';
        row_8.setAttribute('data-timestamp', String(timestamp_2));
        row_8.setAttribute('data-message-id', messageId_4);
        handleAction_20(row_8, friend_14, msg_8);
        row_8.innerHTML =
            `
            <div class="chat-checkbox-wrapper" style="display:` +
            (window.imData.batchSelectMode ? 'flex' : 'none') +
            `;width:40px;justify-content:center;align-items:flex-end;padding-bottom:10px;flex-shrink:0;cursor:pointer;transition:all .2s;">
                <i class="far fa-circle chat-checkbox" data-timestamp="` +
            timestamp_2 +
            `" style="color:#c7c7cc;font-size:22px;"></i>
            </div>
            <div class="group-poll-message-content">
                <div class="group-poll-bubble-line">
                    <div class="chat-bubble user-bubble im-card-bubble group-poll-bubble">
                        <div class="group-poll-card">
                            <div class="group-poll-card-head">
                                <div class="group-poll-card-kicker"><i class="fas fa-poll-h"></i> 群投票 · 公开单选</div>
                                <div class="group-poll-card-title">` +
            escapeHtml(msg_8.pollQuestion || '群投票') +
            `</div>
                            </div>
                            <div class="group-poll-card-options">` +
            join_202 +
            `</div>
                            <div class="group-poll-card-footer"><span>` +
            value_388 +
            `</span></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        row_8.querySelectorAll('.group-poll-card-option').forEach((button_2) => {
            button_2.addEventListener('click', (event_403) => {
                event_403.preventDefault();
                event_403.stopPropagation();
                const optionId_3 = button_2.getAttribute('data-poll-option-id') || '';
                optionId_3 &&
                    window.imChat?.selectGroupPollOption &&
                    window.imChat.selectGroupPollOption(friend_14.id, messageId_4, optionId_3);
            });
        });
        container_4.appendChild(row_8);
    }
    function renderCotSummaryCard_3(msg_9, friend_15, container_5) {
        const textContent_3 = typeof msg_9?.cotSummary === 'string' ? msg_9.cotSummary.trim() : '';
        if (!textContent_3 || !friend_15 || friend_15.type === 'group' || !container_5) return null;
        const cotKey_2 = String(msg_9.apiRunId || msg_9.id || '').trim();
        if (cotKey_2) {
            const duplicate = Array.from(container_5.querySelectorAll('.chat-cot-row')).some(
                (row) => row.dataset.cotKey === cotKey_2,
            );
            if (duplicate) return null;
        }
        const row_9 = document.createElement('div');
        row_9.className = 'chat-cot-row';
        if (cotKey_2) row_9.dataset.cotKey = cotKey_2;
        const card = document.createElement('section');
        card.className = 'chat-cot-card';
        const id_2 =
                'chat-cot-content-' + String(msg_9.id || Date.now()).replace(/[^a-zA-Z0-9_-]/g, ''),
            toggle_2 = document.createElement('button');
        toggle_2.type = 'button';
        toggle_2.className = 'chat-cot-toggle';
        toggle_2.setAttribute('aria-expanded', 'false');
        toggle_2.setAttribute('aria-controls', id_2);
        toggle_2.innerHTML =
            '<span class="chat-cot-title"><span>COT</span></span><i class="fas fa-chevron-down chat-cot-chevron" aria-hidden="true"></i>';
        const content_3 = document.createElement('div');
        content_3.id = id_2;
        content_3.className = 'chat-cot-content';
        content_3.hidden = true;
        content_3.textContent = textContent_3;
        toggle_2.addEventListener('click', (event_8) => {
            event_8.preventDefault();
            event_8.stopPropagation();
            const expanded = toggle_2.getAttribute('aria-expanded') !== 'true';
            toggle_2.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            card.classList.toggle('is-expanded', expanded);
            content_3.hidden = !expanded;
        });
        card.append(toggle_2, content_3);
        row_9.appendChild(card);
        const placeBelowAvatar = () => {
            const messageId_5 = String(msg_9.id || ''),
                messageRow = Array.from(container_5.children).find(
                    (child) =>
                        String(child.getAttribute?.('data-message-id') || '') === messageId_5,
                ),
                messageColumn = messageRow?.classList?.contains('ai-row')
                    ? messageRow.children?.[1]
                    : null,
                bubbleLine = messageColumn?.lastElementChild;
            if (messageColumn && bubbleLine) {
                row_9.classList.add('chat-cot-row-inline');
                messageColumn.insertBefore(row_9, bubbleLine);
            } else
                messageRow?.parentNode === container_5
                    ? messageRow.insertAdjacentElement('afterend', row_9)
                    : container_5.appendChild(row_9);
        };
        return (
            typeof queueMicrotask === 'function'
                ? queueMicrotask(placeBelowAvatar)
                : Promise.resolve().then(placeBelowAvatar),
            row_9
        );
    }
    function renderMessageBubble_3(msg_10, friend_16, container_6, timestamp_3 = Date.now()) {
        if (!msg_10 || !container_6) return false;
        if (renderSystemNoticeBubble_2(friend_16, msg_10)) return true;
        if (friend_16 && typeof friend_16 === 'object')
            renderMessageContextByFriend.set(friend_16, msg_10);
        window.imChat.ensureMessageId(msg_10, msg_10.type === 'pay_transfer' ? 'pay' : 'msg');
        const msgTime = timestamp_3 || msg_10.timestamp || Date.now();
        renderCotSummaryCard_3(msg_10, friend_16, container_6);
        if (
            msg_10.type === 'official_artifact' &&
            typeof window.imChat.renderOfficialArtifactBubble === 'function'
        )
            return (
                window.imChat.renderOfficialArtifactBubble(msg_10, friend_16, container_6, msgTime),
                handleAction_19(msg_10, friend_16, container_6)
            );
        if (msg_10.type === 'group_poll')
            return (
                renderGroupPollBubble_2(msg_10, friend_16, container_6, msgTime),
                handleAction_19(msg_10, friend_16, container_6)
            );
        if (msg_10.type === 'chat_record_forward')
            return (
                window.imChat.renderChatRecordForwardBubble(
                    msg_10,
                    friend_16,
                    container_6,
                    msgTime,
                ),
                handleAction_19(msg_10, friend_16, container_6)
            );
        if (msg_10.type === 'moment_forward')
            return (
                window.imChat.renderMomentForwardBubble(msg_10, friend_16, container_6, msgTime),
                handleAction_19(msg_10, friend_16, container_6)
            );
        if (msg_10.type === 'voice_call_record')
            return (
                window.imChat.renderVoiceCallRecordBubble(msg_10, friend_16, container_6, msgTime),
                handleAction_19(msg_10, friend_16, container_6)
            );
        if (msg_10.type === 'offline_meeting_record')
            return (
                window.imChat.renderOfflineMeetingRecordBubble(
                    msg_10,
                    friend_16,
                    container_6,
                    msgTime,
                ),
                handleAction_19(msg_10, friend_16, container_6)
            );
        if (msg_10.type === 'voice_message')
            return (
                window.imChat.renderVoiceMessageBubble(msg_10, friend_16, container_6, msgTime),
                handleAction_19(msg_10, friend_16, container_6)
            );
        if (msg_10.type === 'sticker')
            return (
                window.imChat.renderStickerMessageBubble(msg_10, friend_16, container_6, msgTime),
                handleAction_19(msg_10, friend_16, container_6)
            );
        if (msg_10.type === 'fake_link')
            return (
                window.imChat.renderFakeLinkBubble(msg_10, friend_16, container_6, msgTime),
                handleAction_19(msg_10, friend_16, container_6)
            );
        if (msg_10.type === 'file') {
            renderFileBubble(msg_10, friend_16, container_6, msgTime);
            return handleAction_19(msg_10, friend_16, container_6);
        }
        if (msg_10.type === 'image')
            return (
                window.imChat.renderImageBubble(msg_10, friend_16, container_6, msgTime),
                handleAction_19(msg_10, friend_16, container_6)
            );
        if (msg_10.type === 'location')
            return (
                window.imChat.renderLocationBubble(msg_10, friend_16, container_6, msgTime),
                handleAction_19(msg_10, friend_16, container_6)
            );
        if (msg_10.type === 'pay_transfer')
            return (
                window.imChat.renderPayTransferBubble(msg_10, friend_16, container_6, msgTime),
                handleAction_19(msg_10, friend_16, container_6)
            );
        if (msg_10.type === 'group_red_packet')
            return (
                window.imChat.renderGroupRedPacketBubble(msg_10, friend_16, container_6, msgTime),
                handleAction_19(msg_10, friend_16, container_6)
            );
        if (msg_10.type === 'memory_request')
            return (
                window.imChat.renderMemoryRequestBubble(msg_10, friend_16, container_6, msgTime),
                handleAction_19(msg_10, friend_16, container_6)
            );
        if (msg_10.type === 'unblock_request')
            return (
                window.imChat.renderUnblockRequestBubble(msg_10, friend_16, container_6, msgTime),
                handleAction_19(msg_10, friend_16, container_6)
            );
        if (msg_10.type === 'loves_unbind_request' || msg_10.type === 'loves_unbind_decision')
            return (
                window.imChat.renderLovesUnbindBubble(msg_10, friend_16, container_6, msgTime),
                handleAction_19(msg_10, friend_16, container_6)
            );
        if (msg_10.type === 'together_listening_invite')
            return (
                window.imChat.renderTogetherListeningInviteBubble(
                    msg_10,
                    friend_16,
                    container_6,
                    msgTime,
                ),
                handleAction_19(msg_10, friend_16, container_6)
            );
        if (msg_10.type === 'contact_card')
            return (
                window.imChat.renderContactCardBubble(msg_10, friend_16, container_6, msgTime),
                handleAction_19(msg_10, friend_16, container_6)
            );
        if (msg_10.type === 'user_phone_access_card')
            return (
                window.imChat.renderUserPhoneAccessCard(msg_10, friend_16, container_6, msgTime),
                handleAction_19(msg_10, friend_16, container_6)
            );
        if (msg_10.type === 'offline_invite')
            return (
                window.imChat.renderOfflineInviteBubble(msg_10, friend_16, container_6, msgTime),
                handleAction_19(msg_10, friend_16, container_6)
            );
        if (msg_10.type === 'system_notice')
            return (
                window.imChat.renderSystemNoticeBubble(msg_10, friend_16, container_6, msgTime),
                true
            );
        if (
            msg_10.type === 'gift' ||
            (msg_10.type === 'html' &&
                /Gift Received/i.test(`${msg_10.text || ''} ${msg_10.content || ''}`))
        ) {
            window.imChat.renderGiftBubble(msg_10, friend_16, container_6, msgTime);
            return handleAction_19(msg_10, friend_16, container_6);
        }
        if (msg_10.type === 'html')
            return (
                window.imChat.renderHtmlBubble(msg_10, friend_16, container_6, msgTime),
                handleAction_19(msg_10, friend_16, container_6)
            );
        if (msg_10.role === 'user')
            return (
                window.imChat.renderUserBubble(
                    msg_10.content,
                    container_6,
                    msgTime,
                    msg_10.replyTo,
                    msg_10.translation,
                    msg_10.showTranslation,
                    msg_10.id,
                    friend_16,
                    msg_10,
                ),
                handleAction_19(msg_10, friend_16, container_6)
            );
        if (msg_10.role === 'assistant') {
            let safeSpeakerName = msg_10.speaker || msg_10.senderName || null,
                speakerAvatar_2 = msg_10.senderAvatarUrl || null;
            if (friend_16.type === 'group') {
                const groupIdentity_3 = resolveGroupBubbleIdentity(friend_16, msg_10);
                safeSpeakerName = groupIdentity_3.name;
                speakerAvatar_2 = groupIdentity_3.avatarUrl;
            }
            window.imChat.renderAiBubble(
                msg_10.content,
                friend_16,
                container_6,
                msgTime,
                msg_10.translation,
                msg_10.showTranslation,
                msg_10.replyTo,
                safeSpeakerName,
                speakerAvatar_2,
                msg_10.id,
                msg_10.thought || null,
                msg_10.offlineScene || null,
                msg_10.offlineAction || null,
                msg_10.speakerMemberId || msg_10.senderMemberId || null,
                msg_10,
            );
            const acceptedGift = findGiftAcceptedByAssistant(msg_10, friend_16);
            if (acceptedGift) {
                const acceptanceId = `gift-accepted-${acceptedGift.id || acceptedGift.timestamp}`;
                const alreadyRendered = Array.from(
                    container_6.querySelectorAll('.chat-row[data-message-id]'),
                ).some((row) => String(row.dataset.messageId || '') === acceptanceId);
                if (!alreadyRendered) {
                    window.imChat.renderGiftBubble(
                        {
                            ...acceptedGift,
                            id: acceptanceId,
                            role: 'assistant',
                            giftStatus: 'received',
                            status: 'received',
                            syntheticGiftAcceptance: true,
                            timestamp: msgTime,
                        },
                        friend_16,
                        container_6,
                        msgTime,
                    );
                }
            }
            return handleAction_19(msg_10, friend_16, container_6);
        }
        return false;
    }
    function normalizeGiftMessage(msg) {
        const raw = `${msg?.text || ''} ${msg?.content || ''}`;
        const legacyName =
            raw.match(/Pay for me\s*\n?\s*:\s*([^\n<]+)/i)?.[1] ||
            raw.match(/Gift Received:\s*([^。\n<]+)/i)?.[1] ||
            'Gift';
        const legacyValue = raw.match(/(?:Value|Price)\s*\$\s*([\d.]+)/i)?.[1];
        const legacyReceived = msg?.type === 'html' && /Gift Received/i.test(raw);
        return {
            name: String(msg?.giftName || legacyName || 'Gift').trim(),
            value: Math.max(0, Number(msg?.giftValue ?? legacyValue) || 0),
            description: String(msg?.giftDescription || msg?.description || '').trim(),
            status:
                legacyReceived || msg?.giftStatus === 'received' || msg?.status === 'received'
                    ? 'received'
                    : 'pending',
        };
    }
    function findGiftAcceptedByAssistant(assistantMessage, friend) {
        if (!assistantMessage || assistantMessage.role !== 'assistant') return null;
        const messages = Array.isArray(friend?.messages) ? friend.messages : [];
        let assistantIndex = messages.findIndex((message) => message === assistantMessage);
        if (assistantIndex < 0 && assistantMessage.id != null) {
            assistantIndex = messages.findIndex(
                (message) => String(message?.id || '') === String(assistantMessage.id),
            );
        }
        if (assistantIndex < 0) {
            assistantIndex = messages.findIndex(
                (message) => Number(message?.timestamp) === Number(assistantMessage.timestamp),
            );
        }
        if (assistantIndex < 0) return null;
        for (let index = assistantIndex - 1; index >= 0; index -= 1) {
            const candidate = messages[index];
            if (!candidate || candidate.role === 'system' || candidate.type === 'hidden_context')
                continue;
            if (candidate.role === 'assistant') return null;
            if (candidate.type === 'gift' && candidate.role === 'user') return candidate;
        }
        return null;
    }
    function openGiftDetailOverlay(msg, friend, anchor) {
        const page = anchor?.closest?.('.active-chat-interface');
        if (!page) return;
        page.querySelector('.gift-detail-overlay')?.remove();
        const data = normalizeGiftMessage(msg);
        const isUser = msg?.role === 'user';
        const profile = isUser
            ? getEffectiveUserProfile(friend)
            : {
                  name: friend?.nickname || friend?.realName || friend?.name || 'Char',
                  avatarUrl: friend?.avatarUrl || friend?.avatar || 'assets/moren-thumb.jpg',
              };
        const overlay = document.createElement('div');
        overlay.className = 'gift-detail-overlay';
        overlay.innerHTML = `
            <div class="gift-detail-card" role="dialog" aria-modal="true" aria-label="Gift details">
                <div class="gift-detail-sender">
                    <img class="gift-detail-avatar" src="${escapeHtml(profile.avatarUrl || 'assets/moren-thumb.jpg')}" alt="">
                    <div class="gift-detail-sender-name">${escapeHtml(profile.name || (isUser ? 'User' : 'Char'))}</div>
                </div>
                <div class="gift-detail-name">${escapeHtml(data.name)}</div>
                <div class="gift-detail-value">Value $${data.value.toFixed(2)}</div>
                <div class="gift-detail-info"><div class="gift-detail-info-label">Details</div>${data.description ? `<div class="gift-detail-info-text">Note：${escapeHtml(data.description)}</div>` : ''}</div>
            </div>`;
        page.appendChild(overlay);
        overlay.style.display = 'flex';
        const close = (event) => {
            if (event && event.target !== overlay) return;
            overlay.remove();
        };
        overlay.addEventListener('click', close);
    }
    // Invitations share the gift presentation, but keep their own immutable state.
    function getLovesInvitationStatus(message) {
        const content = String(message?.content || message?.text || '');
        const explicit = content.match(/data-loves-invitation=["'](pending|received)["']/)?.[1];
        if (explicit) return explicit;
        // Old saved HTML is recognized at render time; its UI is never mounted.
        if (!/class=["'][^"']*\b(?:loves|lover)-invite-bubble\b/.test(content)) return null;
        return /邀请已接受|我接受了你的邀请|TA 已接受|我已经接受/.test(content + ' ' + (message.text || ''))
            ? 'received' : 'pending';
    }
    function buildGiftStyleCardHtml(received, timestamp, invitationStatus = null) {
        const bowSvg =
            '<svg class="gift-message-bow" viewBox="0 0 52 58" fill="none" aria-hidden="true"><path d="M25.8 27.5C16 16.1 7.4 15.1 5 20.3c-2.8 6.2 7.5 11.3 20.8 7.2Zm.4 0C36 16.1 44.6 15.1 47 20.3c2.8 6.2-7.5 11.3-20.8 7.2ZM26 27.5V56M13 31l13-3.5L7.5 48M39 31l-13-3.5L44.5 48M26 27.5V3" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        return `
            <div class="gift-message-card im-card-content${received ? ' is-received' : ''}${invitationStatus ? ' loves-invitation-card' : ''}" ${invitationStatus ? `data-loves-invitation="${invitationStatus}"` : `data-gift-timestamp="${timestamp}" role="button" tabindex="0"`}>
                <div class="gift-message-main">${bowSvg}<div class="gift-message-copy"><div class="gift-message-title">${invitationStatus ? 'Lover Invitation' : 'A Gift For You'}</div>${received ? '<div class="gift-message-status">Received</div>' : ''}</div></div>
                <div class="gift-message-footer">${invitationStatus ? 'Lover' : 'Gift'}</div>
            </div>`;
    }
    window.imChat.buildLovesInvitationCardHtml = status =>
        buildGiftStyleCardHtml(status === 'received', null, status === 'received' ? 'received' : 'pending');

    function renderGiftBubble(msg, friend, container, timestamp = Date.now(), invitationStatus = null) {
        const isUser = msg.role === 'user';
        const rows = Array.from(container.children).filter((el) =>
            el.classList?.contains('chat-row'),
        );
        const lastRow = rows[rows.length - 1] || null;
        let hasPrev = false;
        if (lastRow?.classList.contains(isUser ? 'user-row' : 'ai-row')) {
            hasPrev = true;
            lastRow.classList.add('has-next');
        }
        const row = document.createElement('div');
        row.className = `chat-row ${isUser ? 'user-row' : 'ai-row'}${hasPrev ? ' has-prev' : ''}`;
        row.dataset.timestamp = String(timestamp);
        row.dataset.messageId = window.imChat.ensureMessageId(msg, invitationStatus ? 'html' : 'gift');
        handleAction_20(row, friend, msg);
        const data = invitationStatus ? {status: invitationStatus} : normalizeGiftMessage(msg);
        const card = buildGiftStyleCardHtml(data.status === 'received', timestamp, invitationStatus);
        const headerHtml = buildMessageHeaderHtml(
            isUser,
            friend,
            timestamp,
            null,
            null,
            hasPrev,
            msg,
        );
        row.innerHTML = `<div class="chat-checkbox-wrapper" style="display:${window.imData.batchSelectMode ? 'flex' : 'none'};width:40px;justify-content:center;align-items:flex-end;padding-bottom:10px;flex-shrink:0;"><i class="far fa-circle chat-checkbox" data-timestamp="${timestamp}" style="color:#c7c7cc;font-size:22px;"></i></div><div style="flex:1;display:flex;flex-direction:column;min-width:0;">${headerHtml}<div style="display:flex;justify-content:${isUser ? 'flex-end' : 'flex-start'};align-items:flex-end;width:100%;"><div class="chat-bubble ${isUser ? 'user-bubble' : 'ai-bubble'} im-card-bubble gift-message-bubble">${card}</div></div></div>`;
        const cardEl = row.querySelector('.gift-message-card');
        if (!invitationStatus) cardEl?.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            openGiftDetailOverlay(msg, friend, cardEl);
        });
        if (!invitationStatus) cardEl?.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openGiftDetailOverlay(msg, friend, cardEl);
            }
        });
        container.appendChild(row);
        decorateMessageRowAvatar(row, friend, msg);
        window.imChat.scrollToBottom(container);
    }
    function getMessageUserRoundCount(value_429, value_430 = 0, endIndex_2 = null) {
        const safeMessages_2 = Array.isArray(value_429) ? value_429 : [];
        let count_2 = 0;
        const start = Math.max(0, Number(value_430) || 0),
            end = Math.min(
                safeMessages_2.length,
                Math.max(
                    start,
                    endIndex_2 == null
                        ? safeMessages_2.length
                        : Number(endIndex_2) || safeMessages_2.length,
                ),
            );
        for (let i = start; i < end; i += 1) {
            if (safeMessages_2[i] && safeMessages_2[i].role === 'user') count_2 += 1;
        }
        return count_2;
    }
    function handleAction_45(value_437, value_438) {
        const safeMessages_3 = Array.isArray(value_437) ? value_437 : [],
            limit_2 = Math.max(0, Number(value_438) || 0);
        if (limit_2 <= 0 || safeMessages_3.length === 0) return 0;
        let count_441 = 0;
        for (let value_442 = safeMessages_3.length - 1; value_442 >= 0; value_442 -= 1) {
            if (safeMessages_3[value_442] && safeMessages_3[value_442].role === 'user') {
                count_441 += 1;
                if (count_441 >= limit_2) return value_442;
            }
        }
        return 0;
    }
    function handleAction_46(value_443, currentStartIndex, additionalUserRounds) {
        const safeMessages_4 = Array.isArray(value_443) ? value_443 : [],
            currentStart = Math.max(
                0,
                Math.min(safeMessages_4.length, Number(currentStartIndex) || 0),
            ),
            additionalRounds = Math.max(
                1,
                Number(additionalUserRounds) || HISTORY_LOAD_MORE_USER_ROUNDS,
            );
        let count_449 = 0;
        for (let value_450 = currentStart - 1; value_450 >= 0; value_450 -= 1) {
            if (safeMessages_4[value_450] && safeMessages_4[value_450].role === 'user') {
                count_449 += 1;
                if (count_449 >= additionalRounds) return value_450;
            }
        }
        return 0;
    }
    function handleAction_47(value_451) {
        const handleAction_45_452 = handleAction_45(value_451, count),
            max_453 = Math.max(0, (Array.isArray(value_451) ? value_451.length : 0) - count_5);
        return Math.max(handleAction_45_452, max_453);
    }
    function clampHistoryStartIndex(messages_2, startIndex_2) {
        const safeMessages = Array.isArray(messages_2) ? messages_2 : [];
        return Math.max(0, Math.min(safeMessages.length, Number(startIndex_2) || 0));
    }
    function handleAction_48(friend_17, container_7, value_458, options_3 = {}) {
        const safeMessages_5 = Array.isArray(value_458) ? value_458 : [],
            friendId_4 = friend_17 && friend_17.id != null ? String(friend_17.id) : '',
            previousState = container_7 ? container_7._imHistoryState : null;
        let visibleStartIndex_2;
        if (options_3.resetWindow) visibleStartIndex_2 = handleAction_47(safeMessages_5);
        else {
            if (Number.isFinite(Number(options_3.startIndex)))
                visibleStartIndex_2 = clampHistoryStartIndex(safeMessages_5, options_3.startIndex);
            else
                previousState &&
                previousState.friendId === friendId_4 &&
                Number.isFinite(Number(previousState.visibleStartIndex))
                    ? (visibleStartIndex_2 = clampHistoryStartIndex(
                          safeMessages_5,
                          previousState.visibleStartIndex,
                      ))
                    : (visibleStartIndex_2 = handleAction_47(safeMessages_5));
        }
        let visibleEndIndex_2 = safeMessages_5.length;
        if (!options_3.resetWindow && Number.isFinite(Number(options_3.endIndex)))
            visibleEndIndex_2 = Math.max(
                visibleStartIndex_2,
                Math.min(safeMessages_5.length, Number(options_3.endIndex)),
            );
        else
            !options_3.resetWindow &&
                previousState?.friendId === friendId_4 &&
                Number.isFinite(Number(previousState.visibleEndIndex)) &&
                Number(previousState.visibleEndIndex) < Number(previousState.totalMessages) &&
                (visibleEndIndex_2 = Math.max(
                    visibleStartIndex_2,
                    Math.min(safeMessages_5.length, Number(previousState.visibleEndIndex)),
                ));
        const _imHistoryState_2 = {
            friendId: friendId_4,
            visibleStartIndex: visibleStartIndex_2,
            visibleEndIndex: visibleEndIndex_2,
            totalMessages: safeMessages_5.length,
        };
        if (container_7) container_7._imHistoryState = _imHistoryState_2;
        return _imHistoryState_2;
    }
    function handleAction_49(value_465, container_8, messages_3, state) {
        if (!container_8 || !state) return;
        const friendRecentMessageWindow = window.imApp?.getFriendRecentMessageWindow?.(value_465),
            value_469 = friendRecentMessageWindow?.hasMore
                ? Math.max(
                      1,
                      (Number(value_465?.messageCount) || messages_3.length + 1) -
                          messages_3.length,
                  )
                : 0;
        if (state.visibleStartIndex <= 0 && value_469 <= 0) return;
        const value_470_2 = state.visibleStartIndex + value_469,
            hiddenUserRounds = getMessageUserRoundCount(messages_3, 0, state.visibleStartIndex),
            wrapper = document.createElement('div');
        wrapper.className = 'chat-history-loader';
        const button_3 = document.createElement('button');
        button_3.type = 'button';
        button_3.className = 'chat-history-load-more-btn';
        button_3.innerHTML =
            `
            <span class="chat-history-load-more-title">查看更多历史记录</span>
            <span class="chat-history-load-more-meta">` +
            (value_469 > 0
                ? value_470_2 + '条更早消息'
                : hiddenUserRounds + '轮 / ' + value_470_2 + '条更早消息') +
            `</span>
        `;
        button_3.addEventListener('click', async (event_474) => {
            event_474.preventDefault();
            event_474.stopPropagation();
            button_3.disabled = true;
            const previousScrollHeight = container_8.scrollHeight,
                previousScrollTop = container_8.scrollTop;
            try {
                let value_477 = Array.isArray(value_465.messages) ? value_465.messages : [];
                const value_478 = container_8._imHistoryState || state;
                let hiddenMessageCount = value_478.visibleStartIndex,
                    count_480 = 0;
                if (hiddenMessageCount <= 0 && window.imApp?.loadEarlierFriendMessages) {
                    const value_483 = await window.imApp.loadEarlierFriendMessages(value_465, {
                        limit: 60,
                    });
                    value_477 = Array.isArray(value_465.messages) ? value_465.messages : [];
                    count_480 = Math.max(0, Number(value_483?.addedCount) || 0);
                    hiddenMessageCount = count_480;
                }
                const startIndex_3 = handleAction_46(
                    value_477,
                    hiddenMessageCount,
                    HISTORY_LOAD_MORE_USER_ROUNDS,
                );
                container_8.innerHTML = '';
                renderChatHistory_2(value_465, container_8, {
                    startIndex: startIndex_3,
                    endIndex:
                        value_478.visibleEndIndex < value_478.totalMessages
                            ? value_478.visibleEndIndex + count_480
                            : undefined,
                    scroll: false,
                });
                const heightDelta = container_8.scrollHeight - previousScrollHeight;
                container_8.scrollTop = previousScrollTop + heightDelta;
            } catch (value_484) {
                console.error('Failed to load earlier chat messages', value_484);
                button_3.disabled = false;
                window.showToast?.('历史记录加载失败');
            }
        });
        wrapper.appendChild(button_3);
        container_8.appendChild(wrapper);
    }
    function handleAction_50(value_485, container_9, value_487, state_2) {
        const value_489 = value_487.length - state_2.visibleEndIndex;
        if (!container_9 || value_489 <= 0) return;
        const element_490 = document.createElement('div');
        element_490.className = 'chat-history-loader chat-history-newer-actions';
        const button_4 = document.createElement('button');
        button_4.type = 'button';
        button_4.className = 'chat-history-load-more-btn';
        button_4.textContent = '查看较新记录 · 还有 ' + value_489 + ' 条';
        button_4.addEventListener('click', () => {
            const updatedFriend_2 = window.imApp?.getFriendById?.(value_485.id) || value_485,
                currentState = container_9._imHistoryState || state_2,
                scrollTop_2 = container_9.scrollTop;
            container_9.innerHTML = '';
            renderChatHistory_2(updatedFriend_2, container_9, {
                startIndex: currentState.visibleStartIndex,
                endIndex: Math.min(
                    updatedFriend_2.messages.length,
                    currentState.visibleEndIndex + 60,
                ),
                scroll: false,
                preserveFollowerState: true,
            });
            container_9.scrollTop = scrollTop_2;
        });
        const button_5 = document.createElement('button');
        button_5.type = 'button';
        button_5.className = 'chat-history-load-more-btn';
        button_5.textContent = '回到最新消息';
        button_5.addEventListener('click', () => {
            const updatedFriend_3 = window.imApp?.getFriendById?.(value_485.id) || value_485;
            container_9.innerHTML = '';
            renderChatHistory_2(updatedFriend_3, container_9, {
                resetWindow: true,
            });
        });
        element_490.append(button_4, button_5);
        container_9.appendChild(element_490);
    }
    function getChatHistoryRenderKey(friend_18) {
        const rows = Array.isArray(friend_18?.messages) ? friend_18.messages : [];
        const lastMessage = rows[rows.length - 1] || null;
        const recallPresentation_2 = friend_18?.memory?.recallPresentation || null;
        return [
            String(friend_18?.id ?? ''),
            rows.length,
            String(lastMessage?.id ?? ''),
            Number(lastMessage?.timestamp) || 0,
            String(lastMessage?.content ?? lastMessage?.text ?? ''),
            lastMessage?.showTranslation ? 1 : 0,
            friend_18?.showAvatar ? 1 : 0,
            friend_18?.showGroupUserAvatar ? 1 : 0,
            String(friend_18?.avatarDisplayMode || 'one'),
            friend_18?.continuousBubbles === false ? 0 : 1,
            String(friend_18?.replyStyle || 'inside'),
            friend_18?.showTimestamp ? 1 : 0,
            friend_18?.timeAware === false ? 0 : 1,
            friend_18?.customTimeEnabled === true ? 1 : 0,
            JSON.stringify(friend_18?.customTimeAnchors || []),
            String(friend_18?.timestampPosition || ''),
            String(recallPresentation_2?.apiRunId || ''),
            String(recallPresentation_2?.triggerUserMessageId || ''),
        ].join('');
    }
    function markChatHistoryRenderCurrent(friend_19, container_10) {
        if (container_10) container_10._imHistoryRenderKey = getChatHistoryRenderKey(friend_19);
    }
    function isChatHistoryRenderCurrent_3(friend_20, container_11) {
        return (
            !!container_11 &&
            container_11.childElementCount > 0 &&
            container_11._imHistoryRenderKey === getChatHistoryRenderKey(friend_20)
        );
    }
    function handleAction_52(value_222) {
        if (!value_222) return true;
        return value_222.scrollHeight - value_222.scrollTop - value_222.clientHeight <= count_4;
    }
    function handleAction_53(value_223) {
        if (!value_223) return true;
        return value_223.scrollHeight - value_223.scrollTop - value_223.clientHeight <= count_6;
    }
    function handleAction_54(value_507, value_508 = renderMessageContextByFriend_3.get(value_507)) {
        if (!value_507) return;
        const closest_509 = value_507.closest('.active-chat-interface'),
            imChatScrollLatestElement = closest_509?.querySelector('.im-chat-scroll-latest');
        if (!imChatScrollLatestElement) return;
        const insChatInputContainerElement = closest_509.querySelector('.ins-chat-input-container'),
            value_510 = insChatInputContainerElement?.getBoundingClientRect().height || 0;
        imChatScrollLatestElement.style.setProperty(
            '--im-chat-latest-bottom',
            Math.max(0, Math.round(value_510)) + 12 + 'px',
        );
        const value_511 = value_507.scrollHeight - value_507.clientHeight > 1,
            value_512 = value_511 && value_508?.following === false && !handleAction_53(value_507);
        !value_512 &&
            (document.activeElement === imChatScrollLatestElement ||
                imChatScrollLatestElement.contains(document.activeElement)) &&
            imChatScrollLatestElement.blur();
        imChatScrollLatestElement.classList.toggle('is-visible', value_512);
        imChatScrollLatestElement.toggleAttribute('inert', !value_512);
        imChatScrollLatestElement.setAttribute('aria-hidden', value_512 ? 'false' : 'true');
        imChatScrollLatestElement.tabIndex = value_512 ? 0 : -1;
    }
    function handleAction_55(friend_21) {
        if (!friend_21 || enabled) return;
        const result_514 = renderMessageContextByFriend_2.get(friend_21);
        if (result_514) {
            result_514.schedule();
            return;
        }
        const closest_515 = friend_21.closest('.active-chat-interface'),
            button_6 = closest_515?.querySelector('.im-chat-scroll-latest');
        if (!button_6) return;
        const msg_11 = {
            frame: 0,
            following: true,
            observer: null,
        };
        msg_11.schedule = () => {
            if (msg_11.frame) return;
            msg_11.frame = requestAnimationFrame(() => {
                msg_11.frame = 0;
                if (friend_21.isConnected === false) {
                    handleAction_56(friend_21);
                    return;
                }
                msg_11.following = handleAction_52(friend_21);
                handleAction_54(friend_21, msg_11);
            });
        };
        msg_11.handleClick = (event_518) => {
            event_518.preventDefault();
            event_518.stopPropagation();
            scrollOnlineChatToBottomOnce_2(friend_21);
            msg_11.schedule();
        };
        msg_11.button = button_6;
        renderMessageContextByFriend_2.set(friend_21, msg_11);
        friend_21.addEventListener('scroll', msg_11.schedule, {
            passive: true,
        });
        friend_21.addEventListener('load', msg_11.schedule, true);
        friend_21.addEventListener('error', msg_11.schedule, true);
        button_6.addEventListener('click', msg_11.handleClick);
        if (typeof window.ResizeObserver === 'function') {
            msg_11.observer = new window.ResizeObserver(msg_11.schedule);
            msg_11.observer.observe(friend_21);
            const insChatInputContainerElement_519 = closest_515.querySelector(
                '.ins-chat-input-container',
            );
            if (insChatInputContainerElement_519)
                msg_11.observer.observe(insChatInputContainerElement_519);
        }
        msg_11.schedule();
    }
    function handleAction_56(value_520) {
        const result_521 = renderMessageContextByFriend_2.get(value_520);
        if (!result_521) return;
        if (result_521.frame) cancelAnimationFrame(result_521.frame);
        value_520.removeEventListener('scroll', result_521.schedule);
        value_520.removeEventListener('load', result_521.schedule, true);
        value_520.removeEventListener('error', result_521.schedule, true);
        result_521.button.removeEventListener('click', result_521.handleClick);
        result_521.observer?.disconnect();
        renderMessageContextByFriend_2['delete'](value_520);
    }
    function disposeOnlineChatBottomFollower_2(value_522) {
        if (!value_522) return;
        handleAction_56(value_522);
        const result_523 = renderMessageContextByFriend_3.get(value_522);
        if (!result_523) return;
        if (result_523.frame) cancelAnimationFrame(result_523.frame);
        if (result_523.uiFrame) cancelAnimationFrame(result_523.uiFrame);
        if (result_523.entrySettleFrame) cancelAnimationFrame(result_523.entrySettleFrame);
        value_522.removeEventListener('scroll', result_523.handleScroll);
        value_522.removeEventListener('load', result_523.handleMediaSizeChange, true);
        value_522.removeEventListener('error', result_523.handleMediaSizeChange, true);
        value_522.removeEventListener('pointerdown', result_523.handleUserScrollIntent, true);
        value_522.removeEventListener('touchstart', result_523.handleUserScrollIntent, true);
        value_522.removeEventListener('wheel', result_523.handleWheel, true);
        result_523.resizeObserver?.disconnect();
        result_523.mutationObserver?.disconnect();
        result_523.inputResizeObserver?.disconnect();
        result_523.latestButton &&
            result_523.handleLatestClick &&
            result_523.latestButton.removeEventListener('click', result_523.handleLatestClick);
        renderMessageContextByFriend_3['delete'](value_522);
    }
    function handleAction_58(value_524) {
        if (!value_524) return null;
        const result_525 = renderMessageContextByFriend_3.get(value_524);
        if (result_525) return result_525;
        const msg_12 = {
            following: handleAction_52(value_524),
            userReleasedFollowing: false,
            frame: 0,
            uiFrame: 0,
            entrySettleFrame: 0,
            entrySettleToken: 0,
            resizeObserver: null,
            mutationObserver: null,
            inputResizeObserver: null,
            observedTail: null,
            latestButton: null,
            userScrollStartTop: value_524.scrollTop,
            userScrollIntentUntil: 0,
            handleScroll: null,
            handleMediaSizeChange: null,
            handleUserScrollIntent: null,
            handleWheel: null,
            handleLatestClick: null,
        };
        msg_12.scheduleUiSync = () => {
            if (msg_12.uiFrame) return;
            msg_12.uiFrame = requestAnimationFrame(() => {
                msg_12.uiFrame = 0;
                if (value_524.isConnected === false) {
                    disposeOnlineChatBottomFollower_2(value_524);
                    return;
                }
                handleAction_54(value_524, msg_12);
            });
        };
        msg_12.releaseFollowing = () => {
            msg_12.entrySettleToken += 1;
            if (msg_12.entrySettleFrame) cancelAnimationFrame(msg_12.entrySettleFrame);
            if (msg_12.frame) cancelAnimationFrame(msg_12.frame);
            msg_12.entrySettleFrame = 0;
            msg_12.frame = 0;
            msg_12.userReleasedFollowing = true;
            msg_12.following = false;
            msg_12.scheduleUiSync();
        };
        msg_12.handleScroll = () => {
            const previousScrollTop_2 = value_524.scrollTop;
            if (handleAction_53(value_524)) {
                msg_12.following = true;
                msg_12.userReleasedFollowing = false;
            } else {
                if (
                    !msg_12.userReleasedFollowing &&
                    Date.now() <= msg_12.userScrollIntentUntil &&
                    previousScrollTop_2 < msg_12.userScrollStartTop - count_11
                )
                    msg_12.releaseFollowing();
                else msg_12.userReleasedFollowing && (msg_12.following = false);
            }
            msg_12.scheduleUiSync();
        };
        msg_12.handleMediaSizeChange = () => {
            followOnlineChatBottom_2(value_524);
            msg_12.scheduleUiSync();
        };
        msg_12.handleUserScrollIntent = () => {
            msg_12.userScrollStartTop = value_524.scrollTop;
            msg_12.userScrollIntentUntil = Date.now() + count_12;
            handleAction_53(value_524) &&
                ((msg_12.following = true), (msg_12.userReleasedFollowing = false));
            msg_12.scheduleUiSync();
        };
        msg_12.handleWheel = (value_530) => {
            msg_12.handleUserScrollIntent();
            if ((Number(value_530?.deltaY) || 0) < 0) msg_12.releaseFollowing();
        };
        value_524.addEventListener('scroll', msg_12.handleScroll, {
            passive: true,
        });
        value_524.addEventListener('load', msg_12.handleMediaSizeChange, true);
        value_524.addEventListener('error', msg_12.handleMediaSizeChange, true);
        value_524.addEventListener('pointerdown', msg_12.handleUserScrollIntent, {
            passive: true,
            capture: true,
        });
        value_524.addEventListener('touchstart', msg_12.handleUserScrollIntent, {
            passive: true,
            capture: true,
        });
        value_524.addEventListener('wheel', msg_12.handleWheel, {
            passive: true,
            capture: true,
        });
        const closest_527 = value_524.closest('.active-chat-interface');
        msg_12.latestButton = closest_527?.querySelector('.im-chat-scroll-latest') || null;
        msg_12.handleLatestClick = (event_531) => {
            event_531.preventDefault();
            event_531.stopPropagation();
            followOnlineChatBottom_2(value_524, {
                force: true,
            });
        };
        msg_12.latestButton?.addEventListener('click', msg_12.handleLatestClick);
        const insChatInputContainerElement_528 = closest_527?.querySelector(
            '.ins-chat-input-container',
        );
        return (
            insChatInputContainerElement_528 &&
                typeof window.ResizeObserver === 'function' &&
                ((msg_12.inputResizeObserver = new window.ResizeObserver(() => {
                    followOnlineChatBottom_2(value_524);
                    msg_12.scheduleUiSync();
                })),
                msg_12.inputResizeObserver.observe(insChatInputContainerElement_528)),
            typeof window.ResizeObserver === 'function' &&
                ((msg_12.resizeObserver = new window.ResizeObserver(() => {
                    followOnlineChatBottom_2(value_524);
                    msg_12.scheduleUiSync();
                })),
                msg_12.resizeObserver.observe(value_524),
                (msg_12.syncTailResizeObserver = () => {
                    const observedTail_2 = value_524.lastElementChild || null;
                    if (observedTail_2 === msg_12.observedTail) return;
                    if (msg_12.observedTail) msg_12.resizeObserver.unobserve?.(msg_12.observedTail);
                    msg_12.observedTail = observedTail_2;
                    if (msg_12.observedTail) msg_12.resizeObserver.observe(msg_12.observedTail);
                }),
                msg_12.syncTailResizeObserver()),
            typeof window.MutationObserver === 'function' &&
                ((msg_12.mutationObserver = new window.MutationObserver(() => {
                    msg_12.syncTailResizeObserver?.();
                    followOnlineChatBottom_2(value_524);
                    msg_12.scheduleUiSync();
                })),
                msg_12.mutationObserver.observe(value_524, {
                    childList: true,
                })),
            renderMessageContextByFriend_3.set(value_524, msg_12),
            handleAction_54(value_524, msg_12),
            msg_12
        );
    }
    function followOnlineChatBottom_2(value_533, value_534 = {}) {
        if (!value_533 || value_533._imIsRenderingHistory) return;
        handleAction_55(value_533);
        if (!enabled) {
            value_533.scrollTop = scrollTop_4;
            return;
        }
        const handleAction_58_535 = handleAction_58(value_533);
        if (!handleAction_58_535) return;
        value_534.force === true &&
            ((handleAction_58_535.userReleasedFollowing = false),
            (handleAction_58_535.following = true));
        if (!handleAction_58_535.following || handleAction_58_535.frame) return;
        handleAction_58_535.frame = requestAnimationFrame(() => {
            handleAction_58_535.frame = 0;
            if (value_533.isConnected === false) {
                disposeOnlineChatBottomFollower_2(value_533);
                return;
            }
            if (!handleAction_58_535.following) return;
            value_533.scrollTop = scrollTop_4;
            handleAction_58_535.userScrollStartTop = value_533.scrollTop;
            handleAction_54(value_533, handleAction_58_535);
        });
    }
    function settleOnlineChatAtLatest_3(value_536) {
        if (!value_536) return;
        handleAction_55(value_536);
        if (!enabled) {
            value_536.scrollTop = scrollTop_4;
            return;
        }
        const handleAction_58_537 = handleAction_58(value_536);
        if (!handleAction_58_537) return;
        const entrySettleToken_2 = handleAction_58_537.entrySettleToken + 1;
        handleAction_58_537.entrySettleToken = entrySettleToken_2;
        if (handleAction_58_537.entrySettleFrame)
            cancelAnimationFrame(handleAction_58_537.entrySettleFrame);
        handleAction_58_537.entrySettleFrame = 0;
        followOnlineChatBottom_2(value_536, {
            force: true,
        });
        let count_539 = 2;
        const value_540 = () => {
            if (
                handleAction_58_537.entrySettleToken !== entrySettleToken_2 ||
                value_536.isConnected === false
            ) {
                handleAction_58_537.entrySettleFrame = 0;
                return;
            }
            followOnlineChatBottom_2(value_536, {
                force: true,
            });
            count_539 -= 1;
            count_539 > 0
                ? (handleAction_58_537.entrySettleFrame = requestAnimationFrame(value_540))
                : (handleAction_58_537.entrySettleFrame = 0);
        };
        handleAction_58_537.entrySettleFrame = requestAnimationFrame(value_540);
    }
    function scrollOnlineChatToBottomOnce_2(value_541) {
        if (!value_541) return;
        handleAction_55(value_541);
        if (!enabled) {
            value_541.scrollTop = scrollTop_4;
            return;
        }
        const handleAction_58_542 = handleAction_58(value_541);
        if (!handleAction_58_542) return;
        if (handleAction_58_542.frame) cancelAnimationFrame(handleAction_58_542.frame);
        handleAction_58_542.userReleasedFollowing = false;
        handleAction_58_542.following = true;
        handleAction_58_542.frame = requestAnimationFrame(() => {
            handleAction_58_542.frame = 0;
            if (value_541.isConnected === false) {
                disposeOnlineChatBottomFollower_2(value_541);
                return;
            }
            value_541.scrollTop = scrollTop_4;
            handleAction_58_542.userScrollStartTop = value_541.scrollTop;
            handleAction_54(value_541, handleAction_58_542);
        });
    }
    function handleAction_62(value_543) {
        const handleAction_58_544 = handleAction_58(value_543);
        if (
            !handleAction_58_544 ||
            handleAction_58_544.following ||
            (!handleAction_58_544.userReleasedFollowing && handleAction_52(value_543))
        )
            return {
                followBottom: true,
            };
        const top_545 = value_543.getBoundingClientRect().top,
            result_546 = Array.from(value_543.children).find(
                (element_547) =>
                    element_547.classList?.contains('chat-row') &&
                    element_547.getBoundingClientRect().bottom > top_545,
            );
        return {
            followBottom: false,
            messageId: String(result_546?.getAttribute('data-message-id') || ''),
            timestamp: String(result_546?.getAttribute('data-timestamp') || ''),
            offset: result_546 ? result_546.getBoundingClientRect().top - top_545 : 0,
            scrollTop: value_543.scrollTop,
        };
    }
    function markChatHistoryRenderCurrent_2(value_548, message_549) {
        if (!value_548 || !message_549) return;
        const handleAction_58_550 = handleAction_58(value_548);
        if (!handleAction_58_550) return;
        if (message_549.followBottom) {
            handleAction_58_550.following = true;
            followOnlineChatBottom_2(value_548, {
                force: true,
            });
            return;
        }
        handleAction_58_550.following = false;
        handleAction_54(value_548, handleAction_58_550);
        const result_551 = Array.from(value_548.children).find(
            (element_552) =>
                element_552.classList?.contains('chat-row') &&
                ((message_549.messageId &&
                    String(element_552.getAttribute('data-message-id') || '') ===
                        message_549.messageId) ||
                    (!message_549.messageId &&
                        message_549.timestamp &&
                        String(element_552.getAttribute('data-timestamp') || '') ===
                            message_549.timestamp)),
        );
        if (!result_551) {
            value_548.scrollTop = message_549.scrollTop;
            return;
        }
        value_548.scrollTop +=
            result_551.getBoundingClientRect().top -
            value_548.getBoundingClientRect().top -
            message_549.offset;
    }
    function appendMessageToContainer_3(friend_22, container_12, msg_13, value_556 = {}) {
        if (!friend_22 || !container_12 || !msg_13) return false;
        const _imHistoryState_557 = container_12._imHistoryState;
        if (
            _imHistoryState_557?.friendId === String(friend_22.id) &&
            _imHistoryState_557.visibleEndIndex < _imHistoryState_557.totalMessages
        )
            return rerenderChatContainer_2(friend_22, container_12, {
                resetWindow: value_556.scroll !== false,
            });
        if (renderSystemNoticeBubble_2(friend_22, msg_13)) {
            if (_imHistoryState_557?.friendId === String(friend_22.id)) {
                const apk110New_729 = Array.isArray(friend_22.messages)
                    ? friend_22.messages.length
                    : _imHistoryState_557.totalMessages;
                _imHistoryState_557.visibleEndIndex = apk110New_729;
                _imHistoryState_557.totalMessages = apk110New_729;
            }
            markChatHistoryRenderCurrent(friend_22, container_12);
            return true;
        }
        const msgTime_2 = msg_13.timestamp || Date.now();
        const handleAction_18_559 = handleAction_18(
            container_12,
            (row_10) =>
                    row_10.classList.contains('chat-row') &&
                    Number(row_10.getAttribute('data-timestamp')) > 0,
        );
        const value_560 = Number(handleAction_18_559?.getAttribute('data-timestamp')) || 0;
        (!value_560 || msgTime_2 - value_560 > 300000) &&
            window.imChat.renderTimestamp(msgTime_2, container_12, friend_22, msg_13);
        const rendered = renderMessageBubble_3(msg_13, friend_22, container_12, msgTime_2);
        if (
            rendered &&
            container_12._imHistoryState &&
            container_12._imHistoryState.friendId === String(friend_22.id)
        ) {
            const value_563 = Array.isArray(friend_22.messages)
                ? friend_22.messages.length
                : container_12._imHistoryState.totalMessages;
            container_12._imHistoryState.visibleEndIndex = value_563;
            container_12._imHistoryState.totalMessages = value_563;
        }
        if (rendered) markChatHistoryRenderCurrent(friend_22, container_12);
        rendered && value_556.scroll !== false && window.imChat.scrollToBottom(container_12);
        return rendered;
    }
    function rerenderChatContainer_2(value_564, friend_23, value_566 = {}) {
        if (!value_564 || !friend_23) return false;
        const value_567 = value_566.resetWindow ? null : handleAction_62(friend_23);
        friend_23.innerHTML = '';
        window.imChat.renderChatHistory(value_564, friend_23, {
            resetWindow: !!value_566.resetWindow,
            scroll: value_566.resetWindow ? true : false,
            preserveFollowerState: true,
        });
        if (value_567) markChatHistoryRenderCurrent_2(friend_23, value_567);
        return true;
    }
    function handleAction_66(container_13, descriptor_4) {
        if (!container_13 || descriptor_4 == null) return null;
        const descriptorId =
                typeof descriptor_4 === 'object' && descriptor_4 !== null && descriptor_4.id != null
                    ? String(descriptor_4.id)
                    : typeof descriptor_4 !== 'object' && descriptor_4 != null
                      ? String(descriptor_4)
                      : null,
            descriptorTimestamp =
                typeof descriptor_4 === 'object' &&
                descriptor_4 !== null &&
                descriptor_4.timestamp != null
                    ? String(descriptor_4.timestamp)
                    : null;
        if (descriptorId) {
            const querySelector_571 = container_13.querySelector(
                '.chat-row[data-message-id="' + descriptorId + '"]',
            );
            if (querySelector_571) return querySelector_571;
        }
        if (descriptorTimestamp) {
            const rows = Array.from(container_13.querySelectorAll('.chat-row'));
            return (
                rows.find(
                    (row_11) =>
                        String(row_11.getAttribute('data-timestamp') || '') === descriptorTimestamp,
                ) || null
            );
        }
        return null;
    }
    function replaceMessageInContainer_3(
        friend_24,
        container_14,
        msg_14,
        descriptor,
        options_4 = {},
    ) {
        if (!friend_24 || !container_14 || !msg_14) return false;
        return rerenderChatContainer_2(friend_24, container_14, options_4);
    }
    function removeMessageFromContainer_3(value_578, value_579, value_580 = {}) {
        if (!value_578) return false;
        const targetRow = handleAction_66(value_578, value_579);
        if (!targetRow) return false;
        const previousElement = targetRow.previousElementSibling,
            nextElement = targetRow.nextElementSibling;
        return (
            targetRow.remove(),
            previousElement &&
                previousElement.classList &&
                previousElement.classList.contains('chat-timestamp') &&
                (!nextElement ||
                    !nextElement.classList ||
                    !nextElement.classList.contains('chat-row')) &&
                previousElement.remove(),
            value_580.scroll && window.imChat.scrollToBottom(value_578),
            true
        );
    }
    function renderChatHistory_2(friend_25, container_15, value_586 = {}) {
        syncSingleChatAvatarState(friend_25, container_15);
        if (!friend_25 || !container_15) return;
        const handleAction_58_587 = handleAction_58(container_15);
        if (
            value_586.scroll === false &&
            value_586.preserveFollowerState !== true &&
            handleAction_58_587
        ) {
            handleAction_58_587.entrySettleToken += 1;
            if (handleAction_58_587.entrySettleFrame)
                cancelAnimationFrame(handleAction_58_587.entrySettleFrame);
            if (handleAction_58_587.frame) cancelAnimationFrame(handleAction_58_587.frame);
            handleAction_58_587.entrySettleFrame = 0;
            handleAction_58_587.frame = 0;
            handleAction_58_587.userReleasedFollowing = true;
            handleAction_58_587.following = false;
            handleAction_58_587.scheduleUiSync?.();
        }
        syncGroupUserAvatarState_3(friend_25, container_15);
        const messages_5 = Array.isArray(friend_25.messages) ? friend_25.messages : [];
        const handleAction_48_589 = handleAction_48(friend_25, container_15, messages_5, value_586);
        let count_590 = 0;
        const recallPresentation_3 = friend_25.memory?.recallPresentation || null;
        const recallApiRunId = String(recallPresentation_3?.apiRunId || '');
        const triggerUserMessageId_2 = String(recallPresentation_3?.triggerUserMessageId || '');
        const triggerMessageExists =
            !triggerUserMessageId_2 ||
            messages_5.some(
                (message_7) =>
                        message_7?.role === 'user' &&
                        String(message_7.id || '') === triggerUserMessageId_2,
            );
        const recallAnchorMessage =
            recallApiRunId && triggerMessageExists
                ? messages_5.find(
                      (message_8) =>
                              message_8?.role === 'assistant' &&
                              String(message_8.apiRunId || '') === recallApiRunId,
                  )
                : null;
        try {
            container_15._imIsRenderingHistory = true;
            handleAction_49(friend_25, container_15, messages_5, handleAction_48_589);
            messages_5.length > 0 &&
                messages_5
                    .slice(
                        handleAction_48_589.visibleStartIndex,
                        handleAction_48_589.visibleEndIndex,
                    )
                    .forEach((message_597) => {
                        if (renderSystemNoticeBubble_2(friend_25, message_597)) return;
                        window.imChat.ensureMessageId(
                            message_597,
                            message_597.type === 'pay_transfer' ? 'pay' : 'msg',
                        );
                        const value_598 = message_597.timestamp || 0;
                        const timeAnchor =
                            count_590 > 0 &&
                            window.imDataUtils?.isCustomChatTimeEnabled?.(friend_25)
                                ? (friend_25.customTimeAnchors || [])
                                      .filter(
                                          (anchor) =>
                                              anchor.sourceTimestamp > count_590 &&
                                              anchor.sourceTimestamp <= value_598,
                                      )
                                      .at(-1)
                                : null;
                        if (!count_590 || value_598 - count_590 > 300000 || timeAnchor) {
                            window.imChat.renderTimestamp(
                                timeAnchor?.sourceTimestamp || value_598,
                                container_15,
                                friend_25,
                                message_597,
                            );
                            count_590 = value_598;
                        }
                        message_597 === recallAnchorMessage &&
                            window.imChat.renderMemoryRecallPresentation &&
                            window.imChat.renderMemoryRecallPresentation(
                                friend_25,
                                container_15,
                                recallPresentation_3,
                            );
                        renderMessageBubble_3(message_597, friend_25, container_15, value_598);
                    });
            handleAction_50(friend_25, container_15, messages_5, handleAction_48_589);
        } finally {
            container_15._imIsRenderingHistory = false;
        }
        window.imChat.syncBatchSelectionUi &&
            window.imChat.syncBatchSelectionUi(
                friend_25,
                container_15.closest('.active-chat-interface'),
            );
        value_586.scroll !== false &&
            window.imChat.scrollToBottom(container_15, {
                force: value_586.resetWindow === true,
            });
        markChatHistoryRenderCurrent(friend_25, container_15);
        window.imChat.restoreCharFakeLinkStatuses?.(friend_25, container_15);
    }
    function scrollToBottom_3(value_599, value_600 = {}) {
        followOnlineChatBottom_2(value_599, value_600);
    }
    function renderTimestamp_3(
        timestamp_4,
        element_602,
        _value142 = window.imData?.currentActiveFriend,
        _value143 = null,
    ) {
        if (!timestamp_4) return;
        const div = document.createElement('div');
        div.className = 'chat-timestamp';
        div.dataset.sourceTimestamp = String(timestamp_4);
        const _value144 = !!window.imDataUtils?.isCustomChatTimeEnabled?.(_value142);
        const _value145 = getChatDisplayTimestamp(_value142, timestamp_4);
        const _value146 = document.createElement('span');
        _value146.textContent = window.imApp.formatTime?.(_value145) || '';
        if (_value144) {
            div.classList.add('chat-timestamp-editable');
            _value146.setAttribute('role', 'button');
            _value146.tabIndex = 0;
            _value146.setAttribute('aria-label', '修改聊天时间：' + _value146.textContent);
            _value146.title = '点击修改日期和时间';
            const _value147 = () =>
                openCustomChatTimeEditor(
                    window.imApp.getFriendById(_value142.id) || _value142,
                    timestamp_4,
                    _value143?.id || '',
                );
            _value146.addEventListener('click', _value147);
            _value146.addEventListener('keydown', (_value148) => {
                (_value148.key === 'Enter' || _value148.key === ' ') &&
                    (_value148.preventDefault(), _value147());
            });
        }
        div.appendChild(_value146);
        element_602.appendChild(div);
        return div;
    }
    function renderUserBubble_2(
        value_224,
        element_606_2,
        timestamp_5 = Date.now(),
        value_608_2 = null,
        value_609_2 = null,
        value_230 = false,
        value_232 = null,
        friend_26 = null,
        message_9 = null,
    ) {
        const handleAction_18_614 = handleAction_18(
            element_606_2,
            (el) => el.classList.contains('chat-row') && !el.classList.contains('typing-row'),
        );
        let hasPrev_2 = false;
        handleAction_18_614 &&
            handleAction_18_614.classList.contains('user-row') &&
            ((hasPrev_2 = true), handleAction_18_614.classList.add('has-next'));
        const userMessage = message_9 || {
            role: 'user',
        };
        const headerHtml = buildMessageHeaderHtml(
            true,
            friend_26,
            timestamp_5,
            null,
            null,
            hasPrev_2,
            userMessage,
        );
        const element_618 = document.createElement('div');
        element_618.className = 'chat-row user-row ' + (hasPrev_2 ? 'has-prev' : '');
        element_618.setAttribute('data-timestamp', timestamp_5);
        element_618.setAttribute(
            'data-message-id',
            value_232 || window.imChat.createMessageId('msg'),
        );
        handleAction_20(element_618, friend_26, userMessage);
        let text_619 = '';
        const apk110New_822 =
            friend_26?.type === 'char' && friend_26.replyStyle === 'outside' && !!value_608_2;
        value_608_2 &&
            !apk110New_822 &&
            (text_619 +=
                '<div class="msg-reply-quote" style="font-size: 13px; color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.15); padding: 8px 12px; border-radius: 14px; margin-bottom: 8px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' +
                value_608_2 +
                '</div>');
        text_619 += value_224;
        value_609_2 &&
            value_230 &&
            (text_619 +=
                '<div class="msg-translation" style="margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.4; word-wrap: break-word; white-space: normal;">' +
                value_609_2 +
                '</div>');
        const value_620 =
            formatBubbleTime(getChatDisplayTimestamp(friend_26, timestamp_5));
        text_619 +=
            '<span class="bubble-meta"><span class="bubble-time">' +
            value_620 +
            '</span><i class="fas fa-check bubble-read-icon"></i></span>';
        element_618.innerHTML =
            '\n            <div class="chat-checkbox-wrapper" style="display: ' +
            (window.imData.batchSelectMode ? 'flex' : 'none') +
            '; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">\n                <i class="far fa-circle chat-checkbox" data-timestamp="' +
            timestamp_5 +
            '" style="color: #c7c7cc; font-size: 22px;"></i>\n            </div>\n            <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">\n                ' +
            headerHtml +
            '\n                <div style="display: flex; justify-content: flex-end; align-items: flex-end; width: 100%;">\n                    ' +
            (userMessage.deliveryStatus === 'blocked'
                ? '<i class="fas fa-exclamation-circle chat-delivery-failed is-user" aria-label="发送失败"></i>'
                : '') +
            '\n                    ' +
            (apk110New_822
                ? '<div class="im-reply-stack is-user"><div class="msg-reply-quote im-reply-outside-quote"><span>' +
                  escapeHtml(String(value_608_2)) +
                  '</span></div><div class="chat-bubble user-bubble">' +
                  text_619 +
                  '</div></div>'
                : '<div class="chat-bubble user-bubble">' + text_619 + '</div>') +
            '\n                </div>\n            </div>\n        ';
        element_606_2.appendChild(element_618);
        decorateMessageRowAvatar(element_618, friend_26, userMessage);
        window.imChat.scrollToBottom(element_606_2, {
            force: true,
        });
    }
    function renderAiBubble_2(
        value_243,
        friend_27,
        element_245,
        timestamp_6 = Date.now(),
        value_626 = null,
        value_248 = false,
        value_628 = null,
        speakerName_5 = null,
        speakerAvatar_3 = null,
        value_254 = null,
        thought_2 = null,
        value_257 = null,
        value_260 = null,
        speakerMemberId_2 = null,
        value_262 = null,
    ) {
        const handleAction_18_637 = handleAction_18(
            element_245,
            (element_272) =>
                    !element_272.classList.contains('chat-timestamp') &&
                    !element_272.classList.contains('typing-row'),
        );
        const isGroupMessage_2 = friend_27.type === 'group' && !!speakerName_5;
        let hasPrev_3 = false;
        let enabled_640 = false;
        if (handleAction_18_637 && handleAction_18_637.classList.contains('ai-row')) {
            const value_647 = handleAction_18_637.getAttribute('data-speaker') || null;
            if (isGroupMessage_2)
                value_647 === speakerName_5 &&
                    ((hasPrev_3 = true),
                    (enabled_640 = true),
                    handleAction_18_637.classList.add('has-next'));
            else
                !value_647 &&
                    ((hasPrev_3 = true),
                    (enabled_640 = true),
                    handleAction_18_637.classList.add('has-next'));
        }
        const row_12 = document.createElement('div');
        row_12.className =
            'chat-row ai-row ' +
            (hasPrev_3 ? 'has-prev' : '') +
            ' ' +
            (isGroupMessage_2 ? 'group-ai-row' : '') +
            ' ' +
            (isGroupMessage_2 && enabled_640 ? 'group-ai-row-continuous' : '');
        row_12.setAttribute('data-timestamp', timestamp_6);
        row_12.setAttribute('data-message-id', value_254 || window.imChat.createMessageId('msg'));
        speakerName_5 && row_12.setAttribute('data-speaker', speakerName_5);
        speakerMemberId_2 != null &&
            String(speakerMemberId_2).trim() &&
            row_12.setAttribute('data-speaker-member-id', String(speakerMemberId_2));
        thought_2 && row_12.setAttribute('data-thought', thought_2);
        let text_642 = '';
        const apk110New_847 =
            friend_27?.type === 'char' && friend_27.replyStyle === 'outside' && !!value_628;
        value_628 &&
            !apk110New_847 &&
            (text_642 +=
                '<div class="msg-reply-quote" style="font-size: 13px; color: rgba(0,0,0,0.6); background: rgba(0,0,0,0.05); padding: 8px 12px; border-radius: 14px; margin-bottom: 8px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' +
                value_628 +
                '</div>');
        text_642 += value_243;
        value_626 &&
            value_248 &&
            (text_642 +=
                '<div class="msg-translation" style="margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(0,0,0,0.1); font-size: 13px; color: #8e8e93; line-height: 1.4; word-wrap: break-word; white-space: normal;">' +
                value_626 +
                '</div>');
        const value_643 =
            formatBubbleTime(getChatDisplayTimestamp(friend_27, timestamp_6));
        text_642 +=
            '<span class="bubble-meta"><span class="bubble-time">' + value_643 + '</span></span>';
        const headerHtml_2 = buildMessageHeaderHtml(
            false,
            friend_27,
            timestamp_6,
            speakerName_5,
            speakerAvatar_3,
            hasPrev_3,
        );
        let text_645 = '';
        if (isGroupMessage_2) {
            text_645 =
                '\n                    <div class="group-ai-bubble-wrap">\n                    ' +
                (enabled_640
                    ? ''
                    : '<div class="group-ai-speaker-name">' + speakerName_5 + '</div>') +
                '\n                    <div class="group-ai-bubble-row">\n                        ' + '\n                        <div class="chat-bubble ai-bubble">' +
                text_642 +
                '</div>\n                    </div>\n                </div>\n            ';
        } else
            text_645 = apk110New_847
                ? '<div class="im-reply-stack is-ai"><div class="msg-reply-quote im-reply-outside-quote"><span>' +
                  escapeHtml(String(value_628)) +
                  '</span></div><div class="chat-bubble ai-bubble">' +
                  text_642 +
                  '</div></div>'
                : '<div class="chat-bubble ai-bubble">' + text_642 + '</div>';
        row_12.innerHTML =
            '\n            <div class="chat-checkbox-wrapper" style="display: ' +
            (window.imData.batchSelectMode ? 'flex' : 'none') +
            '; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">\n                <i class="far fa-circle chat-checkbox" data-timestamp="' +
            timestamp_6 +
            '" style="color: #c7c7cc; font-size: 22px;"></i>\n            </div>\n            <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">\n                ' +
            headerHtml_2 +
            '\n                <div style="display: flex; justify-content: flex-start; align-items: flex-end; width: 100%;">\n                    ' +
            text_645 +
            '\n                    ' +
            (value_262?.deliveryStatus === 'blocked'
                ? '<i class="fas fa-exclamation-circle chat-delivery-failed is-char" aria-label="发送失败"></i>'
                : '') +
            '\n                </div>\n            </div>\n        ';
        element_245.appendChild(row_12);
        decorateMessageRowAvatar(
            row_12,
            friend_27,
            value_262 || {
                role: 'assistant',
            },
        );
        window.imChat.scrollToBottom(element_245);
    }
    function getGeneratedChatImageFileName(timestamp_7, mimeType = '') {
        const extensionByMimeType = {
                'image/jpeg': 'jpg',
                'image/jpg': 'jpg',
                'image/webp': 'webp',
                'image/gif': 'gif',
                'image/avif': 'avif',
                'image/png': 'png',
            },
            extension = extensionByMimeType[String(mimeType || '').toLowerCase()] || 'png',
            date_2 = new Date(timestamp_7 || Date.now()),
            stamp = Number.isNaN(date_2.getTime())
                ? String(Date.now())
                : date_2.toISOString().replace(/[:.]/g, '-').slice(0, 19);
        return 'imessage-generated-' + stamp + '.' + extension;
    }
    async function saveGeneratedChatImage(imageUrl_2, timestamp_8) {
        if (!imageUrl_2 || typeof window.u2ExportFile !== 'function')
            throw new Error('图片保存功能尚未加载，请刷新后重试');
        const response = await fetch(imageUrl_2);
        if (!response.ok) throw new Error('无法读取这张图片，请稍后重试');
        const blob_2 = await response.blob();
        if (!/^image\//i.test(blob_2.type || '')) throw new Error('图片数据无效，无法保存');
        const result_2 = await window.u2ExportFile({
            blob: blob_2,
            fileName: getGeneratedChatImageFileName(timestamp_8, blob_2.type),
            title: 'iMessage 生成图片',
        });
        if (result_2 === 'failed') throw new Error('图片保存失败，请稍后重试');
        return result_2;
    }
    function getGeneratedImageRerollInput(apk120Value941, apk120Value942) {
  const apk120Value943 = apk120Value942?.imagePromptConfig && typeof apk120Value942.imagePromptConfig === "object" ? apk120Value942.imagePromptConfig : {},
    apk120Value944 = apk120Value941?.imageGenerationConfig && typeof apk120Value941.imageGenerationConfig === 'object' ? apk120Value941.imageGenerationConfig : null,
    apk120Value945 = String(apk120Value941?.imageGenerationPrompt || apk120Value941?.description || apk120Value941?.text || '').trim(),
    apk120Value946 = apk120Value941?.imageSource === "generated" && apk120Value941?.imageGenerationPrompt && (!apk120Value944 || !Object.prototype.hasOwnProperty.call(apk120Value944, "basePrompt")),
    apk120Value947 = apk120Value946 ? '' : apk120Value944 ? String(apk120Value944.basePrompt || '').trim() : String(apk120Value943.basePrompt || apk120Value943.lastPrompt || '').trim(),
    apk120Value948 = apk120Value945;
  return {
    'prompt': apk120Value948,
    'config': {
      'basePrompt': apk120Value947,
      'charAppearance': String(apk120Value944?.charAppearance ?? apk120Value943.charAppearance ?? '').trim(),
      'userAppearance': String(apk120Value944?.userAppearance ?? apk120Value943.userAppearance ?? '').trim(),
      'artistPrompt': String(apk120Value944?.artistPrompt ?? apk120Value943.artistPrompt ?? '').trim(),
      'negativePrompt': String(apk120Value944?.negativePrompt ?? apk120Value943.negativePrompt ?? '').trim(),
      'includeCharAppearance': apk120Value944?.includeCharAppearance !== ![],
      'includeUserAppearance': apk120Value944 ? apk120Value944.includeUserAppearance !== ![] : apk120Value941?.imageSource === "generated" || apk120Value941?.userFaceReferenceUsed === !![],
      'useReferenceFace': apk120Value944 ? apk120Value944.useReferenceFace === !![] : apk120Value941?.faceReferenceUsed === !![],
      'useCharReferenceFace': apk120Value944 ? apk120Value944.useCharReferenceFace === !![] || apk120Value944.useCharReferenceFace == null && apk120Value944.useReferenceFace === !![] : apk120Value941?.charFaceReferenceUsed === !![] || apk120Value941?.faceReferenceUsed === !![] && apk120Value941?.userFaceReferenceUsed !== !![],
      'useUserReferenceFace': apk120Value944 ? apk120Value944.useUserReferenceFace === !![] : apk120Value941?.userFaceReferenceUsed === !![]
    }
  };
}
    async function rerollGeneratedChatImage(apk120Value949, apk120Value950, apk120Value951 = null) {
  if (!canGenerateChatImage120(apk120Value949) || apk120Value950?.id == null) throw new Error('这张图片不支持重新生成');
  const apk120Value952 = String(apk120Value950.id);
  if (imageGenerationJobs120.has(apk120Value952) || window.imChat.isChatImageGenerationRunning?.(apk120Value950.id)) throw new Error("这段聊天已有图片正在生成");
  imageGenerationJobs120.add(apk120Value952);
  try {
    const apk120Value953 = window.imApp?.getFriendById?.(apk120Value950.id) || (window.imData?.friends || []).find(apk120Value969 => String(apk120Value969.id) === String(apk120Value950.id));
    if (!apk120Value953) throw new Error('原聊天已不存在，请重新进入聊天');
    const apk120Value954 = {
      'id': apk120Value949.id || null,
      'timestamp': apk120Value949.timestamp || null
    };
    await window.imApp.ensureFriendMessagesLoaded?.(apk120Value953);
    const apk120Value955 = (apk120Value953.messages || []).find(apk120Value970 => apk120Value954.id ? String(apk120Value970.id) === String(apk120Value954.id) : String(apk120Value970.timestamp) === String(apk120Value954.timestamp));
    if (!canGenerateChatImage120(apk120Value955)) throw new Error("原图片消息已删除或不再支持生成");
    const apk120Value956 = getImageSpeaker120(apk120Value955, apk120Value953),
      apk120Value957 = apk120Value951 || getGeneratedImageRerollInput(apk120Value955, apk120Value956),
      apk120Value958 = String(apk120Value957.prompt || '').trim(),
      apk120Value959 = {
        ...apk120Value957.config
      };
    apk120Value959.useCharReferenceFace = apk120Value959.includeCharAppearance !== ![] && apk120Value959.useCharReferenceFace === !![], apk120Value959.useUserReferenceFace = apk120Value959.includeUserAppearance !== ![] && apk120Value959.useUserReferenceFace === !![], apk120Value959.useReferenceFace = apk120Value959.useCharReferenceFace;
    if (!apk120Value958) throw new Error("请填写画面提示词");
    const apk120Value960 = await window.imChat.resolveImageReferenceFaces(apk120Value956, {
        'charPresent': apk120Value959.useCharReferenceFace,
        'userPresent': apk120Value959.useUserReferenceFace
      }, {
        'requireChar': apk120Value959.useCharReferenceFace,
        'requireUser': apk120Value959.useUserReferenceFace
      }),
      apk120Value961 = await window.imChat.generateChatImage(apk120Value958, apk120Value953, {
        'referenceImages': apk120Value960,
        'basePrompt': apk120Value959.basePrompt,
        'charAppearance': apk120Value959.charAppearance,
        'userAppearance': apk120Value959.userAppearance,
        'artistPrompt': apk120Value959.artistPrompt,
        'negativePrompt': apk120Value959.negativePrompt,
        'includeCharAppearance': apk120Value959.includeCharAppearance,
        'includeUserAppearance': apk120Value959.includeUserAppearance
      }),
      apk120Value962 = String(apk120Value955.contentAssetId || '').trim(),
      apk120Value963 = await window.imApp.updateFriendMessage(apk120Value950.id, apk120Value954, apk120Value971 => {
        apk120Value971.content = apk120Value961.imageUrl, apk120Value971.contentAssetId = '', apk120Value971.imageSource = "generated", apk120Value971.imageProvider = apk120Value961.provider || '', apk120Value971.imageModel = apk120Value961.model || '', apk120Value971.imageSize = apk120Value961.size || '', apk120Value971.faceReferenceUsed = !!apk120Value961.faceReferenceUsed, apk120Value971.charFaceReferenceUsed = !!apk120Value961.charFaceReferenceUsed, apk120Value971.userFaceReferenceUsed = !!apk120Value961.userFaceReferenceUsed, apk120Value971.imageGenerationPrompt = apk120Value958, apk120Value971.imageGenerationConfig = apk120Value959, apk120Value971.imageGenerationCompiledPrompt = apk120Value961.compiledPrompt || '', apk120Value971.imageRerollCount = Math.max(0x0, Number(apk120Value971.imageRerollCount) || 0x0) + 0x1, apk120Value971.imageRerolledAt = Date.now();
      }, {
        'silent': !![]
      });
    if (!apk120Value963) throw new Error("新图片保存失败");
    const apk120Value964 = window.imApp?.getFriendById?.(apk120Value950.id) || apk120Value953,
      apk120Value965 = (apk120Value964.messages || []).find(apk120Value972 => {
        if (apk120Value954.id && apk120Value972?.id) return String(apk120Value972.id) === String(apk120Value954.id);
        return apk120Value954.timestamp && String(apk120Value972?.timestamp || '') === String(apk120Value954.timestamp);
      }) || apk120Value949,
      apk120Value966 = String(apk120Value965.contentAssetId || '').trim();
    apk120Value962 && apk120Value962 !== apk120Value966 && (await window.appStorage?.markAssetOrphaned?.(apk120Value962)["catch"](() => undefined));
    const apk120Value967 = document.getElementById("chat-interface-" + apk120Value950.id),
      apk120Value968 = apk120Value967?.querySelector(".ins-chat-messages");
    if (apk120Value968) {
      const apk120Value973 = Array.from(apk120Value968.querySelectorAll('.chat-row')).find(apk120Value975 => {
          if (apk120Value954.id && apk120Value975.dataset.messageId) return String(apk120Value975.dataset.messageId) === String(apk120Value954.id);
          return apk120Value954.timestamp && String(apk120Value975.dataset.timestamp || '') === String(apk120Value954.timestamp);
        }),
        apk120Value974 = apk120Value973?.querySelector('.chat-image-bubble-img');
      if (apk120Value974 && apk120Value965.content) apk120Value974.src = apk120Value965.content;
    }
    return {
      'updatedFriend': apk120Value964,
      'updatedMessage': apk120Value965
    };
  } finally {
    imageGenerationJobs120['delete'](apk120Value952);
  }
}
    function handleAction_77(error_2) {
        let reason_2 = String(error_2?.message || error_2 || '').trim();
        if (error_2?.name === 'AbortError' || /abort|timeout|超时/i.test(reason_2))
            reason_2 = reason_2 || '生图请求超时，请稍后重试';
        else {
            if (error_2?.name === 'QuotaExceededError')
                reason_2 = '本地存储空间不足，无法保存新图片';
            else !reason_2 && (reason_2 = '生图接口未返回具体错误');
        }
        return (
            (reason_2 = reason_2.replace(/^图片(?:重新生成|重\s*roll)失败[：:]?\s*/i, '').trim()),
            (reason_2 = reason_2.replace(/[。.!！]+$/g, '').trim()),
            '图片重 roll 失败：' + reason_2 + '。旧图片已保留'
        );
    }
    async function handleAction_27(message_277, value_279) {
        if (value_279 === 0)
            return (
                message_277.content ||
                (message_277.contentAssetId && window.appStorage?.getAssetUrl
                    ? await window.appStorage.getAssetUrl(message_277.contentAssetId)
                    : '')
            );
        const value_280 = message_277.albumImages?.[value_279 - 1];
        if (!value_280) return '';
        if (value_280.url) return value_280.url;
        if (!value_280.assetId || !window.appStorage?.getAssetUrl) return '';
        return (await window.appStorage.getAssetUrl(value_280.assetId)) || '';
    }
    function openChatImageDetail(apk120Value1004, apk120Value1005, apk120Value1006, apk120Value1007, apk120Value1008 = 0x0) {
  let apk120Value1009 = document.getElementById("chat-image-detail-overlay");
  !apk120Value1009 && (apk120Value1009 = document.createElement("div"), apk120Value1009.id = "chat-image-detail-overlay", apk120Value1009.className = 'chat-image-detail-overlay', apk120Value1009.innerHTML = "\n                <div class=\"chat-image-detail-card\">\n                    <div class=\"chat-image-detail-header\">\n                        <div class=\"chat-image-detail-heading\">\n                            <div class=\"chat-image-detail-sender\"></div>\n                            <div class=\"chat-image-detail-time\"></div>\n                        </div>\n                        <div class=\"chat-image-detail-actions\">\n                            <button type=\"button\" class=\"chat-image-detail-reroll\"><i class=\"fas fa-redo\"></i> 重 roll</button>\n                            <button type=\"button\" class=\"chat-image-detail-save\">保存</button>\n                            <button type=\"button\" class=\"chat-image-detail-close\" aria-label=\"关闭\"><i class=\"fas fa-times\"></i></button>\n                        </div>\n                    </div>\n                    <div class=\"chat-image-detail-media\">\n                        <button type=\"button\" class=\"chat-image-detail-prev\" aria-label=\"上一张图片\">‹</button>\n                        <img class=\"chat-image-detail-img\" src=\"\" alt=\"\">\n                        <button type=\"button\" class=\"chat-image-detail-next\" aria-label=\"下一张图片\">›</button>\n                        <span class=\"chat-image-detail-counter\" aria-live=\"polite\"></span>\n                    </div>\n                    <div class=\"chat-image-detail-reroll-error\" role=\"alert\" aria-live=\"assertive\"></div>\n                    <div class=\"chat-image-detail-copy\">\n                        <div class=\"chat-image-detail-label\">图片详情</div>\n                        <div class=\"chat-image-detail-desc\" style=\"font-size:15px; color:#222; line-height:1.55; white-space:pre-wrap; word-break:break-word;\"></div>\n                    </div>\n                </div>\n            ", document.body.appendChild(apk120Value1009), apk120Value1009.addEventListener('click', apk120Value1038 => {
    (apk120Value1038.target === apk120Value1009 || apk120Value1038.target.closest('.chat-image-detail-close')) && (apk120Value1009.style.display = 'none');
  }));
  const apk120Value1010 = apk120Value1009.querySelector(".chat-image-detail-img"),
    apk120Value1011 = apk120Value1009.querySelector(".chat-image-detail-card"),
    apk120Value1012 = apk120Value1009.querySelector('.chat-image-detail-header'),
    apk120Value1013 = apk120Value1009.querySelector(".chat-image-detail-media"),
    apk120Value1014 = apk120Value1009.querySelector(".chat-image-detail-copy"),
    apk120Value1015 = apk120Value1009.querySelector('.chat-image-detail-sender'),
    apk120Value1016 = apk120Value1009.querySelector(".chat-image-detail-time"),
    apk120Value1017 = apk120Value1009.querySelector(".chat-image-detail-desc"),
    apk120Value1018 = apk120Value1009.querySelector(".chat-image-detail-reroll-error"),
    apk120Value1019 = apk120Value1009.querySelector(".chat-image-detail-reroll"),
    apk120Value1020 = apk120Value1009.querySelector('.chat-image-detail-save'),
    apk120Value1021 = apk120Value1009.querySelector(".chat-image-detail-prev"),
    apk120Value1022 = apk120Value1009.querySelector('.chat-image-detail-next'),
    apk120Value1023 = apk120Value1009.querySelector(".chat-image-detail-counter"),
    apk120Value1024 = new Date(getChatDisplayTimestamp(apk120Value1005, apk120Value1006 || apk120Value1004.timestamp || Date.now())),
    apk120Value1025 = typeof window.formatChatBubbleTime === "function" ? window.formatChatBubbleTime(getChatDisplayTimestamp(apk120Value1005, apk120Value1006 || apk120Value1004.timestamp || Date.now())) : apk120Value1024.getHours() + ':' + apk120Value1024.getMinutes().toString().padStart(0x2, '0'),
    apk120Value1026 = apk120Value1004.content || window.imChat.CHAT_IMAGE_PLACEHOLDER_URL || '',
    apk120Value1027 = 0x1 + (Array.isArray(apk120Value1004.albumImages) ? apk120Value1004.albumImages.length : 0x0);
  let apk120Value1028 = Math.min(apk120Value1027 - 0x1, Math.max(0x0, Number(apk120Value1008) || 0x0));
  const apk120Value1029 = apk120Value1004.imageSource === "generated" && !isImagePlaceholder120(apk120Value1004),
    apk120Value1030 = canGenerateChatImage120(apk120Value1004),
    apk120Value1031 = String(apk120Value1004.id || apk120Value1006 || apk120Value1004.timestamp || '');
  let apk120Value1032 = apk120Value1031 + ':' + apk120Value1028;
  const apk120Value1033 = () => {
      if (!apk120Value1010?.naturalWidth || !apk120Value1010?.naturalHeight || !apk120Value1011 || !apk120Value1013) return;
      const apk120Value1039 = window.visualViewport?.height || window.innerHeight,
        apk120Value1040 = Math.min(apk120Value1039 * 0.86, 0x2a8),
        apk120Value1041 = apk120Value1018 ? window.getComputedStyle(apk120Value1018) : null,
        apk120Value1042 = apk120Value1041?.display !== "none" ? apk120Value1018.offsetHeight + (parseFloat(apk120Value1041.marginTop) || 0x0) : 0x0,
        apk120Value1043 = (apk120Value1012?.offsetHeight || 0x0) + (apk120Value1014?.offsetHeight || 0x0) + apk120Value1042,
        apk120Value1044 = Math.max(0x40, Math.floor(apk120Value1040 - apk120Value1043)),
        apk120Value1045 = Math.max(0x1, Math.floor(apk120Value1011.getBoundingClientRect().width)),
        apk120Value1046 = Math.min(apk120Value1045 / apk120Value1010.naturalWidth, apk120Value1044 / apk120Value1010.naturalHeight),
        apk120Value1047 = Math.max(0x1, Math.floor(apk120Value1010.naturalWidth * apk120Value1046)),
        apk120Value1048 = Math.max(0x1, Math.floor(apk120Value1010.naturalHeight * apk120Value1046));
      apk120Value1013.style.width = apk120Value1047 + 'px', apk120Value1013.style.height = apk120Value1048 + 'px', apk120Value1013.style.aspectRatio = apk120Value1010.naturalWidth + " / " + apk120Value1010.naturalHeight;
    },
    apk120Value1034 = () => {
      window.requestAnimationFrame(() => {
        if (apk120Value1010?.dataset.detailImageKey === apk120Value1032) apk120Value1033();
      });
    };
  apk120Value1009.dataset.messageKey = apk120Value1031;
  apk120Value1010 && (apk120Value1010.onload = apk120Value1034);
  const apk120Value1035 = async apk120Value1049 => {
    if (apk120Value1049 < 0x0 || apk120Value1049 >= apk120Value1027) return;
    apk120Value1028 = apk120Value1049, apk120Value1032 = apk120Value1031 + ':' + apk120Value1028;
    apk120Value1023 && (apk120Value1023.style.display = apk120Value1027 > 0x1 ? '' : 'none', apk120Value1023.textContent = apk120Value1028 + 0x1 + '/' + apk120Value1027);
    apk120Value1021 && (apk120Value1021.style.display = apk120Value1027 > 0x1 ? '' : 'none', apk120Value1021.disabled = apk120Value1028 === 0x0);
    apk120Value1022 && (apk120Value1022.style.display = apk120Value1027 > 0x1 ? '' : "none", apk120Value1022.disabled = apk120Value1028 === apk120Value1027 - 0x1);
    apk120Value1013?.style.removeProperty("width"), apk120Value1013?.style.removeProperty("height"), apk120Value1013?.style.removeProperty("aspect-ratio"), apk120Value1010.dataset.detailImageKey = apk120Value1032, apk120Value1010.alt = '第\x20' + (apk120Value1028 + 0x1) + " 张图片", apk120Value1010.removeAttribute("src");
    try {
      const apk120Value1050 = await handleAction_27(apk120Value1004, apk120Value1028);
      if (apk120Value1010.dataset.detailImageKey === apk120Value1032 && apk120Value1009.style.display !== 'none') {
        if (apk120Value1050) apk120Value1010.src = apk120Value1050;else window.showToast?.("图片加载失败");
      }
    } catch (apk120Value1051) {
      if (apk120Value1010.dataset.detailImageKey === apk120Value1032) window.showToast?.('图片加载失败');
    }
  };
  apk120Value1021.onclick = () => {
    void apk120Value1035(apk120Value1028 - 0x1);
  }, apk120Value1022.onclick = () => {
    void apk120Value1035(apk120Value1028 + 0x1);
  };
  let apk120Value1036 = null;
  const apk120Value1037 = (apk120Value1052, apk120Value1053) => {
    if (!apk120Value1036 || apk120Value1027 < 0x2) return;
    const apk120Value1054 = apk120Value1052 - apk120Value1036.x,
      apk120Value1055 = apk120Value1053 - apk120Value1036.y;
    apk120Value1036 = null, Math.abs(apk120Value1054) > 0x20 && Math.abs(apk120Value1054) > Math.abs(apk120Value1055) * 1.15 && void apk120Value1035(apk120Value1028 + (apk120Value1054 < 0x0 ? 0x1 : -0x1));
  };
  apk120Value1013.onpointerdown = apk120Value1056 => {
    if (apk120Value1056.pointerType !== "touch") apk120Value1036 = {
      'x': apk120Value1056.clientX,
      'y': apk120Value1056.clientY
    };
  }, apk120Value1013.onpointerup = apk120Value1057 => {
    if (apk120Value1057.pointerType !== "touch") apk120Value1037(apk120Value1057.clientX, apk120Value1057.clientY);
  }, apk120Value1013.onpointercancel = () => {
    apk120Value1036 = null;
  }, apk120Value1013.ontouchstart = apk120Value1058 => {
    const apk120Value1059 = apk120Value1058.touches?.[0x0];
    if (apk120Value1059) apk120Value1036 = {
      'x': apk120Value1059.clientX,
      'y': apk120Value1059.clientY
    };
  }, apk120Value1013.ontouchend = apk120Value1060 => {
    const apk120Value1061 = apk120Value1060.changedTouches?.[0x0];
    if (apk120Value1061) apk120Value1037(apk120Value1061.clientX, apk120Value1061.clientY);
  }, apk120Value1013.ontouchcancel = () => {
    apk120Value1036 = null;
  }, apk120Value1009.onkeydown = apk120Value1062 => {
    apk120Value1062.key === "ArrowLeft" && (apk120Value1062.preventDefault(), void apk120Value1035(apk120Value1028 - 0x1));
    apk120Value1062.key === "ArrowRight" && (apk120Value1062.preventDefault(), void apk120Value1035(apk120Value1028 + 0x1));
    if (apk120Value1062.key === "Escape") apk120Value1009.style.display = "none";
  };
  if (apk120Value1015) apk120Value1015.textContent = apk120Value1007 || apk120Value1005?.nickname || apk120Value1005?.realName || '图片';
  if (apk120Value1016) apk120Value1016.textContent = apk120Value1025;
  if (apk120Value1017) apk120Value1017.textContent = apk120Value1004.text || apk120Value1004.description || "暂无图片描述";
  apk120Value1018 && (apk120Value1018.style.display = "none", apk120Value1018.textContent = ''), apk120Value1020 && (apk120Value1020.style.display = apk120Value1029 ? 'inline-flex' : 'none', apk120Value1020.disabled = ![], apk120Value1020.textContent = '保存', apk120Value1020.onclick = async () => {
    if (!apk120Value1029 || apk120Value1020.disabled) return;
    const apk120Value1063 = apk120Value1020.textContent;
    apk120Value1020.disabled = !![], apk120Value1020.textContent = '保存中…';
    try {
      const apk120Value1064 = await saveGeneratedChatImage(await handleAction_27(apk120Value1004, apk120Value1028), apk120Value1006 || apk120Value1004.timestamp);
      if (apk120Value1064 === 'downloaded' || apk120Value1064 === "shared") window.showToast?.("图片已保存");
    } catch (apk120Value1065) {
      window.showToast?.(apk120Value1065?.message || "图片保存失败，请稍后重试");
    } finally {
      apk120Value1020.disabled = ![], apk120Value1020.textContent = apk120Value1063;
    }
  }), apk120Value1019 && (apk120Value1019.style.display = apk120Value1030 ? "inline-flex" : "none", apk120Value1019.disabled = ![], apk120Value1019.innerHTML = apk120Value1029 ? "<i class=\"fas fa-redo\"></i> 重 roll" : "<i class=\"fas fa-magic\"></i> 生成图片", apk120Value1019.onclick = () => {
    if (!apk120Value1030 || apk120Value1019.disabled) return;
    openChatImagePrompt120(apk120Value1004, apk120Value1005, apk120Value1006, apk120Value1007);
  }), apk120Value1009.style.display = "flex", apk120Value1009.tabIndex = -0x1, apk120Value1009.focus(), void apk120Value1035(apk120Value1028);
}
    /* PhotoStack by Wren036 (https://github.com/Wren036/PhotoStack).
       https://polyformproject.org/licenses/noncommercial/1.0.0/
       Adapted from fggghub-ux/PhotoStack README, “展开 / 收起动画”:
       shared 280ms X/rotation/scale timeline; 280+45*i ms Y timelines;
       solid, reused images; FLIP following rows; no scripted viewport scrolling.
       The source explicitly does not ship a host-independent expand/collapse function. */
    function attachPhotoAlbumMorph(summary, stack, cards, cardOrder, motion, container, groupId) {
        const expandedGroups = container._imExpandedPhotoGroups || new Set();
        container._imExpandedPhotoGroups = expandedGroups;
        const toggle = summary.querySelector('.photo-batch-toggle');
        const expandedLayout = () => {
            const size = stack.offsetWidth;
            stack.style.height = (cards.length * (size + 3) - 3) + 'px';
            cards.forEach((card, index) => {
                card.style.width = card.style.height = size + 'px';
                card.style.transition = 'none';
                card.style.transform = `translate(0, ${index * (size + 3)}px)`;
                card.style.opacity = '1';
                card.style.zIndex = String(100 - index);
            });
        };
        // Capture components rather than interpolating CSS matrices (iOS scale jump).
        const pose = card => {
            const matrix = new DOMMatrix(getComputedStyle(card).transform);
            const rect = stack.getBoundingClientRect();
            const width = card.offsetWidth, height = card.offsetHeight;
            return {
                x: rect.left + width * .5 + matrix.e,
                y: rect.top + container.scrollTop + height * .86 + matrix.f,
                width: width * Math.hypot(matrix.a, matrix.b),
                height: height * Math.hypot(matrix.c, matrix.d),
                rotation: Math.atan2(matrix.b, matrix.a) * 180 / Math.PI,
            };
        };
        toggle.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            if (summary.classList.contains('is-morphing') || motion.frame) return;
            const expanding = !summary.classList.contains('is-expanded');
            // Opening an album is a reading action, not a request to follow new content.
            // Cancel the existing follower's pending frame before the album changes size.
            renderMessageContextByFriend_3.get(container)?.releaseFollowing();
            const following = [];
            for (let node = summary.closest('.chat-row').nextElementSibling; node; node = node.nextElementSibling) {
                if (!node.offsetHeight) continue;
                following.push({ node, top: node.getBoundingClientRect().top, transform: node.style.transform });
            }
            const originalZ = cards.map(card => card.style.zIndex);
            const visibleOuter = cardOrder[Math.min(2, cards.length - 1)];
            const from = cards.map(card => !expanding || Number(card.style.opacity) > 0
                ? pose(card) : pose(visibleOuter));
            summary.classList.add('is-morphing');
            summary.classList.toggle('is-expanded', expanding);
            if (expanding) expandedGroups.add(groupId);
            else expandedGroups.delete(groupId);
            toggle.setAttribute('aria-expanded', String(expanding));
            toggle.setAttribute('aria-label', expanding ? '收起图片' : '展开图片');
            if (expanding) expandedLayout();
            else motion.apply();
            // Put invisible cards behind the outer peek, not at an arbitrary distant pose.
            const to = cards.map(card => !expanding && Number(card.style.opacity) === 0
                ? pose(visibleOuter) : pose(card));
            if (expanding) cards.forEach((card, index) => { card.style.zIndex = originalZ[index]; });
            following.forEach(item => { item.delta = item.top - item.node.getBoundingClientRect().top; });
            const duration = matchMedia('(prefers-reduced-motion: reduce)').matches
                ? 0 : 280 + 45 * (cards.length - 1);
            const ease = progress => 1 - (1 - progress) * (1 - progress);
            const lerp = (a, b, p) => a + (b - a) * p;
            const startedAt = performance.now();
            const draw = now => {
                const elapsed = now - startedAt;
                const progress = duration ? Math.min(1, elapsed / duration) : 1;
                const horizontal = duration ? ease(Math.min(1, elapsed / 280)) : 1;
                const rect = stack.getBoundingClientRect();
                cards.forEach((card, index) => {
                    const a = from[index], b = to[index];
                    const vertical = duration ? ease(Math.min(1, elapsed / (280 + 45 * index))) : 1;
                    const width = card.offsetWidth, height = card.offsetHeight;
                    const x = lerp(a.x, b.x, horizontal) - rect.left - width * .5;
                    const y = lerp(a.y, b.y, vertical) - container.scrollTop - rect.top - height * .86;
                    const sx = lerp(a.width, b.width, horizontal) / width;
                    const sy = lerp(a.height, b.height, horizontal) / height;
                    card.style.transition = 'none';
                    card.style.opacity = '1';
                    card.style.transform = `translate(${x}px, ${y}px) rotate(${lerp(a.rotation, b.rotation, horizontal)}deg) scale(${sx}, ${sy})`;
                });
                following.forEach(({ node, delta }) => {
                    node.style.transform = `translateY(${delta * (1 - ease(progress))}px)`;
                });
                if (progress < 1 && summary.isConnected) requestAnimationFrame(draw);
                else {
                    if (expanding) expandedLayout();
                    else motion.apply();
                    following.forEach(({ node, transform }) => { node.style.transform = transform; });
                    summary.classList.remove('is-morphing');
                }
            };
            draw(startedAt);
        });
        if (expandedGroups.has(groupId)) {
            summary.classList.add('is-expanded');
            toggle.setAttribute('aria-expanded', 'true');
            toggle.setAttribute('aria-label', '收起图片');
            requestAnimationFrame(() => { if (summary.isConnected) expandedLayout(); });
        }
        // Reflow the expanded album when its own available width changes.
        let previousWidth = 0;
        const resize = new ResizeObserver(() => {
            if (!summary.isConnected) { resize.disconnect(); return; }
            const width = stack.offsetWidth;
            if (width === previousWidth || summary.classList.contains('is-morphing')) return;
            previousWidth = width;
            if (summary.classList.contains('is-expanded')) expandedLayout();
        });
        resize.observe(stack);
    }

    // GX/GPT renderPhotoBatchGroup presentation and swipe motion, adapted to
    // IHG's one image message with albumImages and its existing detail viewer.
    function mountChatPhotoAlbum(summary, message, container, openDetail) {
        const count = 1 + message.albumImages.length;
        const gridIconSvg = `<svg class="photo-batch-grid-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor"></rect><rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor"></rect><rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor"></rect><rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor"></rect></svg>`;
        const downloadIconSvg = `<svg class="photo-batch-download-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></polyline><line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"></line></svg>`;
        summary.innerHTML = `
            <div class="photo-batch-content">
                <div class="photo-batch-label">${gridIconSvg}<span>${count} photos</span></div>
                <div class="photo-batch-stack" aria-label="${count} photos"></div>
            </div>
            <button type="button" class="photo-batch-toggle" aria-label="展开图片" aria-expanded="false">
                ${downloadIconSvg}
            </button>
        `;

        const stack = summary.querySelector('.photo-batch-stack');
        const cards = Array.from({ length: count }, (_, index) => {
            const card = document.createElement('div');
            card.className = 'photo-batch-card';
            card.dataset.photoIndex = String(index);
            card.tabIndex = 0;
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', '查看第 ' + (index + 1) + ' 张图片');
            const image = document.createElement('img');
            image.alt = '';
            image.draggable = false;
            card.appendChild(image);
            stack.appendChild(card);
            // Keep IHG's asset URL lookup, including albums restored from storage.
            void handleAction_27(message, index).then(src => {
                if (src) image.src = src;
            }).catch(() => undefined);
            card.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openDetail(index);
                }
            });
            return card;
        });
        const cardOrder = cards.slice();

        // Gesture timing and scrub behavior adapted from fggghub-ux/PhotoStack
        // (PolyForm Noncommercial 1.0.0). The order wraps so either direction
        // moves the visible card to the back, as required by this chat UI.
        let suppressClickUntil = 0;
        const stackMotion = {
            frame: 0,
            apply() {
                stack.style.height = '';
                cardOrder.forEach((card, depth) => {
                    card.style.width = card.style.height = '';
                    card.style.transition = '';
                    card.classList.toggle('is-top', depth === 0);
                    card.style.zIndex = String(100 - depth);
                    card.style.opacity = depth < 3 ? '1' : '0';
                    if (depth === 0) card.style.transform = 'translateX(0) rotate(0deg) scale(1)';
                    else {
                        const offset = 8 + (depth - 1) * 7;
                        const rotation = 2.2 * Math.min(depth, 3);
                        const scale = Math.max(.82, 1 - .055 * depth);
                        card.style.transform = `translateX(${offset}px) rotate(${rotation}deg) scale(${scale})`;
                    }
                });
            },
            scrub(direction, progress) {
                const width = stack?.offsetWidth || 140;
                const peak = width * .52;
                cardOrder.forEach(card => { card.style.transition = 'none'; });
                this.apply();
                cardOrder.forEach(card => { card.style.transition = 'none'; });
                const current = cardOrder[0];
                const next = cardOrder[1];
                const third = cardOrder[2];
                let x;
                let rotation;
                let scale = 1;
                if (progress <= .5) {
                    const phase = progress / .5;
                    x = direction * peak * phase;
                    rotation = direction * 8 * phase;
                } else {
                    const phase = (progress - .5) / .5;
                    x = direction * (peak - (peak - 8) * phase);
                    rotation = direction * (8 - 5.8 * phase);
                    scale = 1 - .055 * phase;
                }
                current.style.transform = `translateX(${x}px) rotate(${rotation}deg) scale(${scale})`;
                current.style.zIndex = progress < .5 ? '110' : '98';
                if (next) {
                    next.style.transform = `translateX(${8 * (1 - progress)}px) rotate(${2.2 * (1 - progress)}deg) scale(${.945 + .055 * progress})`;
                    next.style.opacity = '1';
                    next.style.zIndex = '105';
                }
                if (third) {
                    third.style.transform = `translateX(${15 - 7 * progress}px) rotate(${4.4 - 2.2 * progress}deg) scale(${.89 + .055 * progress})`;
                    third.style.opacity = '1';
                }
            },
            finish(direction, fromProgress) {
                if (this.frame) cancelAnimationFrame(this.frame);
                const duration = Math.max(140, (1 - fromProgress) * 340);
                const startedAt = performance.now();
                const step = (now) => {
                    const elapsed = Math.min(1, (now - startedAt) / duration);
                    const eased = 1 - Math.pow(1 - elapsed, 2);
                    this.scrub(direction, fromProgress + (1 - fromProgress) * eased);
                    if (elapsed < 1) {
                        this.frame = requestAnimationFrame(step);
                        return;
                    }
                    this.frame = 0;
                    cardOrder.push(cardOrder.shift());
                    this.apply();
                };
                this.frame = requestAnimationFrame(step);
            }
        };
        stackMotion.apply();

        if (stack) {
            let pointerId = null;
            let startX = 0;
            let startY = 0;
            let lastX = 0;
            let lastTime = 0;
            let velocity = 0;
            let dragging = false;
            let deltaX = 0;
            stack.style.touchAction = 'pan-y';
            stack.addEventListener('pointerdown', (event) => {
                if (summary.classList.contains('is-expanded') || summary.classList.contains('is-morphing') || event.button > 0) return;
                if (stackMotion.frame) return;
                pointerId = event.pointerId;
                startX = lastX = event.clientX;
                startY = event.clientY;
                lastTime = event.timeStamp;
                velocity = 0;
                deltaX = 0;
                dragging = false;
                stack.setPointerCapture?.(pointerId);
            });
            stack.addEventListener('pointermove', (event) => {
                if (pointerId !== event.pointerId) return;
                const dx = event.clientX - startX;
                const dy = event.clientY - startY;
                if (!dragging && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) dragging = true;
                if (!dragging) return;
                suppressClickUntil = Date.now() + 450;
                event.preventDefault();
                if (event.timeStamp > lastTime) {
                    velocity = .7 * ((event.clientX - lastX) / (event.timeStamp - lastTime)) + .3 * velocity;
                }
                lastX = event.clientX;
                lastTime = event.timeStamp;
                deltaX = dx;
                stackMotion.scrub(dx < 0 ? -1 : 1, Math.min(1, Math.abs(dx) / Math.max(120, stack.offsetWidth * 1.45)));
            });
            const release = (event, cancelled = false) => {
                if (pointerId !== event.pointerId) return;
                stack.releasePointerCapture?.(pointerId);
                pointerId = null;
                const progress = Math.min(1, Math.abs(deltaX) / Math.max(120, stack.offsetWidth * 1.45));
                const fling = Math.abs(velocity) > .4 && progress > .04;
                if (!cancelled && dragging && (progress > .32 || fling)) {
                    stackMotion.finish(deltaX < 0 ? -1 : 1, progress);
                } else {
                    stackMotion.apply();
                }
                dragging = false;
            };
            stack.addEventListener('pointerup', event => release(event));
            stack.addEventListener('pointercancel', event => release(event, true));
        }

        stack.addEventListener('click', event => {
            if (Date.now() < suppressClickUntil || summary.classList.contains('is-morphing')) return;
            event.preventDefault();
            event.stopPropagation();
            const index = summary.classList.contains('is-expanded')
                ? Number(event.target.closest('.photo-batch-card')?.dataset.photoIndex)
                : Number(cardOrder[0].dataset.photoIndex);
            if (Number.isInteger(index)) openDetail(index);
        });
        attachPhotoAlbumMorph(summary, stack, cards, cardOrder, stackMotion, container, String(message.id || message.timestamp));
    }

    function renderImageBubble_2(msg_18, friend_31, element_304, timestamp_10 = Date.now()) {
        const isUser = msg_18.role === 'user';
        const value_722 = !isUser && friend_31.type === 'group';
        const value_306 =
            value_722 && window.imChat.getGroupMessageSpeaker
                ? window.imChat.getGroupMessageSpeaker(friend_31, msg_18)
                : null;
        const speakerName = value_722
            ? (value_306 && value_306.nickname) ||
              msg_18.speaker ||
              msg_18.senderName ||
              'Group member'
            : null;
        const value_724 = (value_306 && value_306.avatarUrl) || msg_18.senderAvatarUrl || null;
        const handleAction_18_725 = handleAction_18(
            element_304,
            (element_327) =>
                    !element_327.classList.contains('chat-timestamp') &&
                    !element_327.classList.contains('typing-row'),
        );
        let enabled_726 = false;
        let enabled_727 = false;
        if (handleAction_18_725) {
            if (isUser && handleAction_18_725.classList.contains('user-row')) {
                enabled_726 = true;
                handleAction_18_725.classList.add('has-next');
            } else {
                if (!isUser && handleAction_18_725.classList.contains('ai-row')) {
                    const value_738 = handleAction_18_725.getAttribute('data-speaker') || null;
                    if (value_722)
                        value_738 === speakerName &&
                            ((enabled_726 = true),
                            (enabled_727 = true),
                            handleAction_18_725.classList.add('has-next'));
                    else
                        !value_738 &&
                            ((enabled_726 = true), handleAction_18_725.classList.add('has-next'));
                }
            }
        }
        const row_14 = document.createElement('div');
        row_14.className =
            'chat-row ' +
            (isUser ? 'user-row' : 'ai-row') +
            ' ' +
            (enabled_726 ? 'has-prev' : '') +
            ' ' +
            (value_722 ? 'group-ai-row' : '') +
            ' ' +
            (value_722 && enabled_727 ? 'group-ai-row-continuous' : '');
        row_14.setAttribute('data-timestamp', timestamp_10);
        row_14.setAttribute('data-message-id', window.imChat.ensureMessageId(msg_18, 'img'));
        if (speakerName) row_14.setAttribute('data-speaker', speakerName);
        handleAction_22(row_14, friend_31, msg_18);
        handleAction_20(row_14, friend_31, msg_18);
        const value_317 = msg_18.content || window.imChat.CHAT_IMAGE_PLACEHOLDER_URL || '';
        const value_318 = 1 + (Array.isArray(msg_18.albumImages) ? msg_18.albumImages.length : 0);
        const value_320 = value_318 > 1;
        const value_321 = value_320
            ? '<div class="photo-batch-summary ' + (isUser ? 'is-user' : 'is-char') + '"></div>'
            : '<img class="chat-image-bubble-img" src="' +
              escapeHtml(value_317) +
              '" style="width: min(56vw, 200px); height: min(56vw, 200px); max-width: 200px; max-height: 200px; aspect-ratio: 1 / 1; border-radius: 12px; object-fit: cover; display: block; background: #e5e5ea; cursor: pointer;">';
        const value_322 =
            formatBubbleTime(getChatDisplayTimestamp(friend_31, timestamp_10));
        const text_323 = '';
        const value_324 =
            '<div class="chat-bubble ' +
            (isUser ? 'user-bubble' : 'ai-bubble') +
            ' im-card-bubble image-message-bubble ' +
            (value_320 ? 'album-image-message-bubble' : '') +
            '" style="padding: 0; background: transparent; ">' +
            value_321 +
            text_323 +
            '</div>';
        let value_325 = value_324;
        if (value_722) {
            value_325 =
                '\n                    <div class="group-ai-bubble-wrap">\n                    ' +
                (enabled_727
                    ? ''
                    : '<div class="group-ai-speaker-name">' + escapeHtml(speakerName) + '</div>') +
                '\n                    <div class="group-ai-bubble-row">\n                        ' + '\n                        ' +
                value_324 +
                '\n                    </div>\n                </div>\n            ';
        }
        const handleAction_7_326 = buildMessageHeaderHtml(
            isUser,
            friend_31,
            timestamp_10,
            speakerName,
            value_724,
            enabled_726,
            msg_18,
        );
        row_14.innerHTML =
            '\n            <div class="chat-checkbox-wrapper" style="display: ' +
            (window.imData.batchSelectMode ? 'flex' : 'none') +
            '; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">\n                <i class="far fa-circle chat-checkbox" data-timestamp="' +
            timestamp_10 +
            '" style="color: #c7c7cc; font-size: 22px;"></i>\n            </div>\n            <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">\n                ' +
            handleAction_7_326 +
            '\n                <div style="display: flex; justify-content: ' +
            (isUser ? 'flex-end' : 'flex-start') +
            '; align-items: flex-end; width: 100%;">\n                    ' +
            value_325 +
            '\n                </div>\n            </div>\n        ';
        const imageEl_2 = row_14.querySelector('.chat-image-bubble-img');
        imageEl_2 &&
            imageEl_2.addEventListener('click', (event_10) => {
                event_10.preventDefault();
                event_10.stopPropagation();
                const senderName_3 = isUser
                    ? getEffectiveUserProfile(friend_31).name
                    : speakerName || friend_31?.nickname || friend_31?.realName || 'Char';
                openChatImageDetail(msg_18, friend_31, timestamp_10, senderName_3);
            });
        if (value_320) {
            const senderName = isUser
                ? getEffectiveUserProfile(friend_31).name
                : speakerName || friend_31?.nickname || friend_31?.realName || 'Char';
            mountChatPhotoAlbum(row_14.querySelector('.photo-batch-summary'), msg_18,
                element_304, index => openChatImageDetail(
                    msg_18, friend_31, timestamp_10, senderName, index));
        }
        element_304.appendChild(row_14);
        window.imChat.scrollToBottom(element_304);
    }
    function renderGroupOrFamilyTransferBubble(msg_19, friend_32, element_746, value_365 = Date.now()) {
        const value_366 = msg_19.role === 'user';
        const value_367 = !value_366 && friend_32.type === 'group';
        const value_368 = value_367 ? resolveGroupBubbleIdentity(friend_32, msg_19) : null;
        const speakerName_6 = value_368?.name || null;
        const value_370 = value_368?.avatarUrl || null;
        const lastElementChild_371 = element_746.lastElementChild;
        let enabled_372 = false;
        let enabled_373 = false;
        if (lastElementChild_371) {
            if (value_366 && lastElementChild_371.classList.contains('user-row')) {
                enabled_372 = true;
                lastElementChild_371.classList.add('has-next');
            } else {
                if (!value_366 && lastElementChild_371.classList.contains('ai-row')) {
                    const value_392 = lastElementChild_371.getAttribute('data-speaker') || null;
                    (!value_367 || value_392 === speakerName_6) &&
                        ((enabled_372 = true),
                        (enabled_373 = value_367),
                        lastElementChild_371.classList.add('has-next'));
                }
            }
        }
        const row_15 = document.createElement('div');
        row_15.className =
            'chat-row ' +
            (value_366 ? 'user-row' : 'ai-row') +
            ' ' +
            (enabled_372 ? 'has-prev' : '') +
            ' ' +
            (value_367 ? 'group-ai-row' : '') +
            ' ' +
            (value_367 && enabled_373 ? 'group-ai-row-continuous' : '');
        row_15.setAttribute('data-timestamp', value_365);
        row_15.setAttribute('data-message-id', window.imChat.ensureMessageId(msg_19, 'pay'));
        if (speakerName_6) row_15.setAttribute('data-speaker', speakerName_6);
        handleAction_22(row_15, friend_32, msg_19);
        handleAction_20(row_15, friend_32, msg_19);
        const amount_2 = Number(msg_19.amount) || 0;
        const value_758 = '$' + amount_2.toFixed(2);
        const description_2 = window.imDataUtils.normalizeCurrencySymbols(msg_19.description).trim();
        const parties = handleAction_23(msg_19, friend_32);
        const {
            payKind: payKind_3,
            status: status_4,
            payerName: payerName_3,
            payeeName: payeeName_3,
        } = parties;
        const isOfficialReceipt =
            msg_19.targetName === 'Payment' ||
            msg_19.cardTitle === '收款通知' ||
            msg_19.cardTitle === '支付凭证';
        const familyCardText =
            (msg_19.paymentAction || '') +
            ' ' +
            (msg_19.cardTitle || '') +
            ' ' +
            (msg_19.description || '') +
            ' ' +
            (msg_19.content || '');
        const isFamilyCard =
            msg_19.paymentAction === 'family_card' ||
            msg_19.paymentAction === 'family_card_increase' ||
            familyCardText.includes('亲属卡');
        const startsWith_768 = String(msg_19.payKind || '').startsWith('family_card_');
        let cardTitle_2 = msg_19.cardTitle || 'Payment';
        let value_770 = payerName_3 + ' 向 ' + payeeName_3 + ' 转账';
        let extraClass = '';
        if (status_4 === 'claimed') {
            cardTitle_2 = msg_19.cardTitle || payeeName_3 + '已收款';
            value_770 = payeeName_3 + '已收取 ' + payerName_3 + ' 的转账';
            extraClass = payKind_3 === 'char_received' ? ' is-received' : ' is-income';
        } else {
            if (status_4 === 'rejected') {
                cardTitle_2 = msg_19.cardTitle || '已退还';
                value_770 = payeeName_3 + '已退还 ' + payerName_3 + ' 的转账';
                extraClass = ' is-rejected';
            } else
                payKind_3 === 'char_to_user_pending' &&
                    ((cardTitle_2 = msg_19.cardTitle || '转账'),
                    (value_770 = payerName_3 + ' 向 ' + payeeName_3 + ' 转账'),
                    (extraClass = ' is-pending'));
        }
        startsWith_768 &&
            ((cardTitle_2 = msg_19.cardTitle || '亲属卡'),
            (value_770 =
                msg_19.familyCardStatus === 'pending'
                    ? '等待对方收下'
                    : msg_19.familyCardStatus === 'rejected'
                      ? '已退回'
                      : msg_19.familyCardStatus === 'unbound'
                        ? '已解绑'
                        : '已生效'),
            (extraClass = ['rejected', 'unbound'].includes(msg_19.familyCardStatus)
                ? ' is-rejected'
                : msg_19.familyCardStatus === 'pending'
                  ? ' is-pending'
                  : ' is-income'));
        const apk110New_1052 =
            msg_19.familyCardStatus === 'pending'
                ? '待领取'
                : msg_19.familyCardStatus === 'rejected'
                  ? '已退回'
                  : msg_19.familyCardStatus === 'unbound'
                    ? '已解绑'
                    : '已生效';
        const apk110New_1053 = isFamilyCard
            ? apk110New_1052
            : status_4 === 'rejected'
              ? '已退回'
              : status_4 === 'claimed'
                ? ''
                : payKind_3 === 'char_to_user_pending'
                  ? '待收款'
                  : '';
        const handleAction_7_389 = buildMessageHeaderHtml(
            value_366,
            friend_32,
            value_365,
            speakerName_6,
            value_370,
            enabled_372,
            msg_19,
        );
        const value_390 = new Date(getChatDisplayTimestamp(friend_32, value_365));
        const value_391 =
            formatBubbleTime(getChatDisplayTimestamp(friend_32, value_365));
        if (isOfficialReceipt) {
            const sign = msg_19.cardTitle === '收款通知' ? '+' : '-';
            row_15.innerHTML =
                '\n                <div class="chat-checkbox-wrapper" style="display: ' +
                (window.imData.batchSelectMode ? 'flex' : 'none') +
                '; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">\n                    <i class="far fa-circle chat-checkbox" data-timestamp="' +
                value_365 +
                '" style="color: #c7c7cc; font-size: 22px;"></i>\n                </div>\n                    <div style="width:100%; display:flex; justify-content:center; padding:10px 0;">\n                    <div class="im-card-content pay-receipt-card">\n                        <div class="pay-receipt-card-title">' +
                escapeHtml(msg_19.cardTitle || '支付通知') +
                '</div>\n                        <strong class="pay-receipt-card-amount">' +
                sign +
                '$' +
                amount_2.toFixed(2) +
                '</strong>\n                        <span class="pay-receipt-card-status">' +
                (msg_19.cardTitle === '收款通知' ? '已收款' : '已付款') +
                '</span>\n                        ' +
                (description_2
                    ? '<small class="pay-receipt-card-description">' +
                      escapeHtml(description_2) +
                      '</small>'
                    : '') +
                '\n                    </div>\n                </div>\n            ';
        } else {
            const value_394 =
                '\n                <div class="pay-transfer-card im-card-content' +
                extraClass +
                '">\n                    <div class="pay-transfer-card-top">\n                        <div class="pay-transfer-card-icon"><i class="fas fa-wallet" aria-hidden="true"></i></div>\n                        <div class="pay-transfer-card-meta">\n                            <div class="pay-transfer-card-title">' +
                escapeHtml(cardTitle_2) +
                '</div>\n                            ' +
                (isFamilyCard && !startsWith_768
                    ? ''
                    : '<div class="pay-transfer-card-subtitle">' +
                      escapeHtml(value_770) +
                      '</div>') +
                '\n                        </div>\n                    </div>\n                    <strong class="pay-transfer-card-amount">' +
                value_758 +
                '</strong>\n                    ' +
                (apk110New_1053
                    ? '<span class="pay-transfer-card-status">' +
                      escapeHtml(apk110New_1053) +
                      '</span>'
                    : '') +
                '\n                    ' +
                (description_2 && (!/^转账$/.test(description_2) || isFamilyCard)
                    ? '<small class="pay-transfer-card-desc">' +
                      escapeHtml(description_2) +
                      '</small>'
                    : '') +
                '\n                </div>\n            ';
            if (value_366) {
                const text_395 = '';
                row_15.innerHTML =
                    '\n                    <div class="chat-checkbox-wrapper" style="display: ' +
                    (window.imData.batchSelectMode ? 'flex' : 'none') +
                    '; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">\n                        <i class="far fa-circle chat-checkbox" data-timestamp="' +
                    value_365 +
                    '" style="color: #c7c7cc; font-size: 22px;"></i>\n                    </div>\n                    <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">\n                        ' +
                    handleAction_7_389 +
                    '\n                        <div style="display: flex; justify-content: flex-end; align-items: flex-end; width: 100%;">\n                            <div class="chat-bubble user-bubble im-card-bubble pay-transfer-bubble">' +
                    value_394 +
                    text_395 +
                    '</div>\n                        </div>\n                    </div>\n                ';
            } else {
                const text_396 = '';
                const value_397 = value_367
                    ? '<div class="group-ai-bubble-wrap">\n                        ' +
                      (enabled_373
                          ? ''
                          : '<div class="group-ai-speaker-name">' +
                            escapeHtml(speakerName_6) +
                            '</div>') +
                      '\n                        <div class="group-ai-bubble-row">\n                            ' +
                      '\n                            <div class="chat-bubble ai-bubble im-card-bubble pay-transfer-bubble">' +
                      value_394 +
                      text_396 +
                      '</div>\n                        </div>\n                    </div>'
                    : '<div class="chat-bubble ai-bubble im-card-bubble pay-transfer-bubble">' +
                      value_394 +
                      text_396 +
                      '</div>';
                row_15.innerHTML =
                    '\n                    <div class="chat-checkbox-wrapper" style="display: ' +
                    (window.imData.batchSelectMode ? 'flex' : 'none') +
                    '; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">\n                        <i class="far fa-circle chat-checkbox" data-timestamp="' +
                    value_365 +
                    '" style="color: #c7c7cc; font-size: 22px;"></i>\n                    </div>\n                    <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">\n                        ' +
                    handleAction_7_389 +
                    '\n                        <div style="display: flex; justify-content: flex-start; align-items: flex-end; width: 100%;">' +
                    value_397 +
                    '</div>\n                    </div>\n                ';
            }
        }
        element_746.appendChild(row_15);
        if (payKind_3 === 'char_to_user_pending' || payKind_3 === 'user_to_char') {
            const clickableBubble_2 =
                row_15.querySelector('.chat-bubble.pay-transfer-bubble') ||
                row_15.querySelector('.pay-transfer-card');
            clickableBubble_2 &&
                ((clickableBubble_2.style.cursor = 'pointer'),
                clickableBubble_2.addEventListener('click', (event_782) => {
                    event_782.preventDefault();
                    event_782.stopPropagation();
                    const activePage_2 = element_746.closest('.active-chat-interface');
                    if (!activePage_2) {
                        if (window.showToast) window.showToast('未找到聊天页面');
                        return;
                    }
                    !activePage_2._openTransferDetailOverlay &&
                        window.imChat.ensureTransferDetailOverlayForExistingPage(
                            activePage_2,
                            friend_32,
                        );
                    if (activePage_2._openTransferDetailOverlay) {
                        const messageId_6 = row_15.getAttribute('data-message-id'),
                            rowTimestamp = row_15.getAttribute('data-timestamp'),
                            liveFriend_2 =
                                window.imData.currentActiveFriend &&
                                String(window.imData.currentActiveFriend.id) ===
                                    String(friend_32.id)
                                    ? window.imData.currentActiveFriend
                                    : friend_32,
                            liveMsg = Array.isArray(liveFriend_2?.messages)
                                ? liveFriend_2.messages.find((item_6) => {
                                      if (messageId_6 && String(item_6.id) === String(messageId_6))
                                          return true;
                                      return (
                                          rowTimestamp &&
                                          String(item_6.timestamp) === String(rowTimestamp)
                                      );
                                  })
                                : null;
                        activePage_2._openTransferDetailOverlay(liveMsg || msg_19);
                    } else window.showToast && window.showToast('详情卡片初始化失败');
                }));
        }
        window.imChat.scrollToBottom(element_746);
    }

    function renderPayTransferBubble_2(msg, friend, container, timestamp = Date.now()) {
        const familyCardText = [msg.paymentAction, msg.cardTitle, msg.description, msg.content].join(
            ' ',
        );
        if (
            friend.type === 'group' ||
            String(msg.payKind || '').startsWith('family_card_') ||
            msg.paymentAction === 'family_card' ||
            msg.paymentAction === 'family_card_increase' ||
            familyCardText.includes('亲属卡')
        ) {
            return renderGroupOrFamilyTransferBubble(msg, friend, container, timestamp);
        }
        const isUser = msg.role === 'user';
        const isGroupMessage = !isUser && friend.type === 'group';
        const groupIdentity = isGroupMessage ? resolveGroupBubbleIdentity(friend, msg) : null;
        const speakerName = groupIdentity?.name || null;
        const speakerAvatar = groupIdentity?.avatarUrl || null;
        const lastRow = container.lastElementChild;
        let hasPrev = false;
        let sameSpeaker = false;

        if (lastRow) {
            if (isUser && lastRow.classList.contains('user-row')) {
                hasPrev = true;
                lastRow.classList.add('has-next');
            } else if (!isUser && lastRow.classList.contains('ai-row')) {
                const previousSpeaker = lastRow.getAttribute('data-speaker') || null;
                if (!isGroupMessage || previousSpeaker === speakerName) {
                    hasPrev = true;
                    sameSpeaker = isGroupMessage;
                    lastRow.classList.add('has-next');
                }
            }
        }

        const row = document.createElement('div');
        row.className = `chat-row ${isUser ? 'user-row' : 'ai-row'} ${hasPrev ? 'has-prev' : ''} ${isGroupMessage ? 'group-ai-row' : ''} ${isGroupMessage && sameSpeaker ? 'group-ai-row-continuous' : ''}`;
        row.setAttribute('data-timestamp', timestamp);
        row.setAttribute('data-message-id', window.imChat.ensureMessageId(msg, 'pay'));
        if (speakerName) row.setAttribute('data-speaker', speakerName);
        handleAction_22(row, friend, msg);
        handleAction_20(row, friend, msg);

        const amount = Number(msg.amount) || 0;
        const amountText = `$${amount.toFixed(2)}`;
        const description = msg.description || '转账';
        const parties = handleAction_23(msg, friend);
        const { status } = parties;

        const isOfficialReceipt =
            msg.targetName === 'Payment' ||
            msg.cardTitle === '收款通知' ||
            msg.cardTitle === '支付凭证';
        const sourceFamilyCardText = `${msg.paymentAction || ''} ${msg.cardTitle || ''} ${msg.description || ''} ${msg.content || ''}`;
        const isFamilyCard =
            msg.paymentAction === 'family_card' ||
            msg.paymentAction === 'family_card_increase' ||
            sourceFamilyCardText.includes('亲属卡');
        let extraClass = '';

        if (status === 'claimed') {
            extraClass = ' is-claimed';
        } else if (status === 'rejected') {
            extraClass = ' is-rejected';
        } else {
            extraClass = ' is-pending';
        }

        const headerHtml = buildMessageHeaderHtml(
            isUser,
            friend,
            timestamp,
            speakerName,
            speakerAvatar,
            hasPrev,
            msg,
        );

        const timeStr = formatBubbleTime(timestamp);

        if (isOfficialReceipt) {
            // 微信支付样式居中大卡片
            const sign = msg.cardTitle === '收款通知' ? '+' : '-';
            row.innerHTML = `
                    <div class="chat-checkbox-wrapper" style="display: ${window.imData.batchSelectMode ? 'flex' : 'none'}; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">
                        <i class="far fa-circle chat-checkbox" data-timestamp="${timestamp}" style="color: #c7c7cc; font-size: 22px;"></i>
                    </div>
                        <div style="width:100%; display:flex; justify-content:center; padding:10px 0;">
                        <div class="im-card-content pay-receipt-card" style="width:280px; background:#fff; border-radius:12px; padding:16px;  display:flex; flex-direction:column; align-items:center;">
                            <div style="font-size:14px; color:#111; margin-bottom:8px;">${description}</div>
                            <div style="font-size:28px; font-weight:bold; color:#111; margin-bottom:12px;">${sign}$${amount.toFixed(2)}</div>
                              <div style="background:#f2f2f7; border-radius:16px; padding:4px 12px; font-size:12px; color:#8e8e93; margin-bottom:16px;">
                                  ${timeStr}
                              </div>
                            <div style="width:100%; border-top:1px solid #f2f2f7; padding-top:12px; display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-size:13px; color:#8e8e93;">账单详情</span>
                                <i class="fas fa-chevron-right" style="font-size:12px; color:#c7c7cc;"></i>
                            </div>
                        </div>
                    </div>
                `;
        } else {
            const appleLogoSvg = `<svg class="pay-transfer-apple-mark" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.05 12.54c-.03-3.04 2.48-4.5 2.59-4.57-1.42-2.08-3.63-2.36-4.42-2.39-1.86-.2-3.67 1.11-4.62 1.11-.97 0-2.43-1.09-4.01-1.06-2.03.03-3.93 1.21-4.97 3.05-2.14 3.7-.54 9.14 1.5 12.13 1.02 1.46 2.2 3.09 3.78 3.03 1.54-.06 2.12-.97 3.98-.97 1.84 0 2.39.97 4 .93 1.66-.03 2.71-1.47 3.69-2.95 1.18-1.67 1.65-3.32 1.67-3.4-.04-.01-3.16-1.2-3.19-4.81ZM14 3.61A5.37 5.37 0 0 0 15.23 0a5.46 5.46 0 0 0-3.53 1.72 5.09 5.09 0 0 0-1.26 3.47A4.52 4.52 0 0 0 14 3.61Z"></path></svg>`;
            const statusIconSvg =
                status === 'claimed'
                    ? `<svg class="pay-transfer-status-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 6.8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`
                    : `<svg class="pay-transfer-status-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
            const contentHtml = `
                    <div class="pay-transfer-card im-card-content${extraClass}">
                        <div class="pay-transfer-card-top">
                            <div class="pay-transfer-card-brand">${appleLogoSvg}<span>Apple Cash</span></div>
                        </div>
                        <div class="pay-transfer-card-bottom">
                            <div class="pay-transfer-card-amount">${amountText}</div>
                            <div class="pay-transfer-card-status" aria-label="${status}">${statusIconSvg}</div>
                        </div>
                    </div>
                `;

            if (isUser) {
                const metaHtml = '';
                row.innerHTML = `
                        <div class="chat-checkbox-wrapper" style="display: ${window.imData.batchSelectMode ? 'flex' : 'none'}; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">
                            <i class="far fa-circle chat-checkbox" data-timestamp="${timestamp}" style="color: #c7c7cc; font-size: 22px;"></i>
                        </div>
                        <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">
                            ${headerHtml}
                            <div style="display: flex; justify-content: flex-end; align-items: flex-end; width: 100%;">
                                <div class="chat-bubble user-bubble im-card-bubble pay-transfer-bubble apple-cash-bubble">${contentHtml}${metaHtml}</div>
                            </div>
                        </div>
                    `;
            } else {
                const metaHtml = '';
                const groupContent = isGroupMessage
                    ? `<div class="group-ai-bubble-wrap">
                            ${sameSpeaker ? '' : `<div class="group-ai-speaker-name">${escapeHtml(speakerName)}</div>`}
                            <div class="group-ai-bubble-row">
                                <div class="chat-bubble ai-bubble im-card-bubble pay-transfer-bubble apple-cash-bubble">${contentHtml}${metaHtml}</div>
                            </div>
                        </div>`
                    : `<div class="chat-bubble ai-bubble im-card-bubble pay-transfer-bubble apple-cash-bubble">${contentHtml}${metaHtml}</div>`;
                row.innerHTML = `
                        <div class="chat-checkbox-wrapper" style="display: ${window.imData.batchSelectMode ? 'flex' : 'none'}; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">
                            <i class="far fa-circle chat-checkbox" data-timestamp="${timestamp}" style="color: #c7c7cc; font-size: 22px;"></i>
                        </div>
                        <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">
                            ${headerHtml}
                            <div style="display: flex; justify-content: flex-start; align-items: flex-end; width: 100%;">${groupContent}</div>
                        </div>
                    `;
            }
        }

        container.appendChild(row);

        // 允许用户向AI转账时，以及AI向用户转账时，都可以点击打开弹窗
        if (!isOfficialReceipt && !isFamilyCard) {
            const clickableBubble =
                row.querySelector('.chat-bubble.pay-transfer-bubble apple-cash-bubble') ||
                row.querySelector('.pay-transfer-card');
            if (clickableBubble) {
                clickableBubble.style.cursor = 'pointer';
                clickableBubble.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const activePage = container.closest('.active-chat-interface');
                    if (!activePage) {
                        if (window.showToast) window.showToast('未找到聊天页面');
                        return;
                    }

                    if (!activePage._openTransferDetailOverlay) {
                        window.imChat.ensureTransferDetailOverlayForExistingPage(activePage, friend);
                    }

                    if (activePage._openTransferDetailOverlay) {
                        const messageId = row.getAttribute('data-message-id');
                        const rowTimestamp = row.getAttribute('data-timestamp');
                        const liveFriend =
                            window.imData.currentActiveFriend &&
                            String(window.imData.currentActiveFriend.id) === String(friend.id)
                                ? window.imData.currentActiveFriend
                                : friend;
                        const liveMsg = Array.isArray(liveFriend?.messages)
                            ? liveFriend.messages.find((item) => {
                                  if (messageId && String(item.id) === String(messageId)) return true;
                                  return (
                                      rowTimestamp && String(item.timestamp) === String(rowTimestamp)
                                  );
                              })
                            : null;
                        activePage._openTransferDetailOverlay(liveMsg || msg);
                    } else if (window.showToast) {
                        window.showToast('详情卡片初始化失败');
                    }
                });
            }
        }

        window.imChat.scrollToBottom(container);
    }
    function renderMomentForwardBubble_2(msg_20, value_400, element_401, value_402 = Date.now()) {
        let momentData = {};
        try {
            momentData = JSON.parse(msg_20.content);
        } catch (value_410) {
            momentData = {
                text: '[解析错误]',
            };
        }
        const value_403 = msg_20.role === 'user';
        const lastElementChild_404 = element_401.lastElementChild;
        let enabled_405 = false;
        if (lastElementChild_404) {
            if (value_403 && lastElementChild_404.classList.contains('user-row')) {
                enabled_405 = true;
                lastElementChild_404.classList.add('has-next');
            } else
                !value_403 &&
                    lastElementChild_404.classList.contains('ai-row') &&
                    ((enabled_405 = true), lastElementChild_404.classList.add('has-next'));
        }
        const row_16 = document.createElement('div');
        row_16.className =
            'chat-row ' +
            (value_403 ? 'user-row' : 'ai-row') +
            ' ' +
            (enabled_405 ? 'has-prev' : '');
        row_16.setAttribute('data-message-id', window.imChat.ensureMessageId(msg_20, 'moment'));
        handleAction_20(row_16, value_400, msg_20);
        const text_407 =
            '\n            <div class="moment-forward-bubble im-card-content">\n                <div style="width: 44px; height: 44px; border-radius: 12px; background: #1c1c1e; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #fff; font-size: 20px;">\n                    <i class="far fa-images"></i>\n                </div>\n                <div style="flex: 1; overflow: hidden;">\n                    <div style="font-size: 15px; font-weight: 600; color: #262626; margin-bottom: 2px;">分享了动态</div>\n                    <div style="font-size: 13px; color: #8e8e93;">点击查看详情</div>\n                </div>\n            </div>\n        ';
        const handleAction_7_408 = buildMessageHeaderHtml(
            value_403,
            value_400,
            value_402,
            null,
            null,
            enabled_405,
            msg_20,
        );
        const value_409 =
            formatBubbleTime(getChatDisplayTimestamp(value_400, value_402));
        if (value_403) {
            let text_412 = '';
            row_16.innerHTML =
                '\n                <div class="chat-checkbox-wrapper" style="display: ' +
                (window.imData.batchSelectMode ? 'flex' : 'none') +
                '; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">\n                    <i class="far fa-circle chat-checkbox" data-timestamp="' +
                value_402 +
                '" style="color: #c7c7cc; font-size: 22px;"></i>\n                </div>\n                <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">\n                    ' +
                handleAction_7_408 +
                '\n                    <div style="display: flex; justify-content: flex-end; align-items: flex-end; width: 100%;">\n                        ' +
                text_407 +
                '\n                        ' +
                text_412 +
                '\n                    </div>\n                </div>\n            ';
        } else {
            let text_413 = '';
            row_16.innerHTML =
                '\n                <div class="chat-checkbox-wrapper" style="display: ' +
                (window.imData.batchSelectMode ? 'flex' : 'none') +
                '; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">\n                    <i class="far fa-circle chat-checkbox" data-timestamp="' +
                value_402 +
                '" style="color: #c7c7cc; font-size: 22px;"></i>\n                </div>\n                <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">\n                    ' +
                handleAction_7_408 +
                '\n                    <div style="display: flex; justify-content: flex-start; align-items: flex-end; width: 100%;">\n                        ' +
                text_407 +
                '\n                        ' +
                text_413 +
                '\n                    </div>\n                </div>\n            ';
        }
        row_16.querySelector('.moment-forward-bubble').addEventListener('click', () => {
            const foundMoment = window.imData.moments.find((m) => m.id == momentData.id);
            if (foundMoment) {
                if (window.imApp.openMomentDetail) window.imApp.openMomentDetail(foundMoment);
            } else {
                if (window.showToast) window.showToast('该朋友圈已删除或不存在');
            }
        });
        element_401.appendChild(row_16);
        window.imChat.scrollToBottom(element_401);
    }
    function renderVoiceMessageBubble_2(msg_21, friend_33, element_805, timestamp_11 = Date.now()) {
        if (msg_21.role === 'user' && friend_33.type !== 'group') return renderUserVoiceMessageBubble(msg_21, friend_33, element_805, timestamp_11);
        const value_418 = msg_21.role !== 'assistant';
        const handleAction_18_808 = handleAction_18(
            element_805,
            (el_2) =>
                    !el_2.classList.contains('chat-timestamp') &&
                    !el_2.classList.contains('typing-row') &&
                    !el_2.classList.contains('chat-offline-scene-row'),
        );
        const isGroupMessage_3 = !value_418 && friend_33.type === 'group';
        const safeSpeaker =
            isGroupMessage_3 && window.imChat.getGroupMessageSpeaker
                ? window.imChat.getGroupMessageSpeaker(friend_33, msg_21)
                : null;
        const speakerName_7 = isGroupMessage_3
            ? (safeSpeaker && safeSpeaker.nickname) ||
              msg_21.speaker ||
              msg_21.senderName ||
              '群成员'
            : null;
        const value_812 = (safeSpeaker && safeSpeaker.avatarUrl) || msg_21.senderAvatarUrl || null;
        let enabled_424 = false;
        let enabled_425 = false;
        if (handleAction_18_808) {
            if (value_418 && handleAction_18_808.classList.contains('user-row')) {
                enabled_424 = true;
                handleAction_18_808.classList.add('has-next');
            } else {
                if (!value_418 && handleAction_18_808.classList.contains('ai-row')) {
                    const value_439 = handleAction_18_808.getAttribute('data-speaker') || null;
                    if (isGroupMessage_3)
                        value_439 === speakerName_7 &&
                            ((enabled_424 = true),
                            (enabled_425 = true),
                            handleAction_18_808.classList.add('has-next'));
                    else
                        !value_439 &&
                            ((enabled_424 = true),
                            (enabled_425 = true),
                            handleAction_18_808.classList.add('has-next'));
                }
            }
        }
        const row_17 = document.createElement('div');
        row_17.className =
            'chat-row ' +
            (value_418 ? 'user-row' : 'ai-row') +
            ' ' +
            (enabled_424 ? 'has-prev' : '') +
            ' ' +
            (isGroupMessage_3 ? 'group-ai-row' : '') +
            ' ' +
            (isGroupMessage_3 && enabled_425 ? 'group-ai-row-continuous' : '');
        row_17.setAttribute('data-timestamp', timestamp_11);
        row_17.setAttribute('data-message-id', window.imChat.ensureMessageId(msg_21, 'voice'));
        speakerName_7 && row_17.setAttribute('data-speaker', speakerName_7);
        handleAction_22(row_17, friend_33, msg_21);
        handleAction_20(row_17, friend_33, msg_21);
        const transcript_2 = String(msg_21.transcript || msg_21.text || '').trim();
        const calculatedDuration = Math.min(18, Math.max(3, Math.ceil(transcript_2.length / 3)));
        const duration_2 = Math.min(18, Math.max(3, Number(msg_21.duration) || calculatedDuration));
        const safeTranscript = escapeHtml(transcript_2 || '暂无转文字');
        const cleanTranslation = String(msg_21.translation || '').trim();
        const value_432 =
            formatBubbleTime(getChatDisplayTimestamp(friend_33, timestamp_11));
        const text_433 = '';
        const value_823 = !value_418 && window.imVoiceMessageAudio?.canManage?.(friend_33, msg_21);
        const apk111New_1110 = value_823
            ? '\n            <div class="voice-message-actions" role="group" aria-label="语音操作">\n                <button type="button" class="voice-message-action" data-voice-action="regenerate" title="重新生成语音" aria-label="重新生成语音"><i class="fas fa-redo-alt" aria-hidden="true"></i></button>\n                <button type="button" class="voice-message-action" data-voice-action="download" title="下载语音" aria-label="下载语音"><i class="fas fa-download" aria-hidden="true"></i></button>\n            </div>\n        '
            : '';
        const apk111New_1111 =
            `
            <div class="voice-message-bubble-main">
                ${value_823 ? '<button type="button" class="voice-message-play" aria-label="生成或播放语音" title="生成或播放语音"><i class="fas fa-play" aria-hidden="true"></i></button>' : ''}
                <button type="button" class="voice-message-bubble-inner" aria-expanded="false" aria-label="展开语音转文字">
                    <span class="voice-message-wave" aria-hidden="true">
                        <span></span><span></span><span></span><span></span><span></span>
                    </span>
                    <span class="voice-message-duration">` +
            duration_2 +
            's</span>\n                </button>\n                ' +
            apk111New_1110 +
            '\n            </div>\n            <span class="voice-message-playback-status" role="status" aria-live="polite"></span>\n            <div class="voice-message-transcript" hidden>' +
            safeTranscript +
            '</div>\n            ' +
            (cleanTranslation && msg_21.showTranslation
                ? '<div class="msg-translation" style="margin-top: 6px; padding-top: 6px; border-top: 1px solid ' +
                  (value_418 ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)') +
                  '; font-size: 13px; color: ' +
                  (value_418 ? 'rgba(255,255,255,0.7)' : '#8e8e93') +
                  '; line-height: 1.4; word-wrap: break-word; white-space: normal;">' +
                  escapeHtml(cleanTranslation) +
                  '</div>'
                : '') +
            '\n            ' +
            text_433 +
            '\n        ';
        const value_824 =
            '<div class="chat-bubble ' +
            (value_418 ? 'user-bubble' : 'ai-bubble') +
            ((!friend_33.type || friend_33.type === 'char') && !value_418
                ? ' im-text-bubble-shell voice-message-bubble'
                : ' im-card-bubble voice-message-bubble') +
            (value_823 ? ' has-voice-actions' : '') +
            '">' +
            apk111New_1111 +
            '</div>';
        let value_436 = value_824;
        if (isGroupMessage_3) {
            value_436 =
                '\n                <div class="group-ai-bubble-wrap">\n                    ' +
                (enabled_425
                    ? ''
                    : '<div class="group-ai-speaker-name">' +
                      escapeHtml(speakerName_7) +
                      '</div>') +
                '\n                    <div class="group-ai-bubble-row">\n                        ' + '\n                        ' +
                value_824 +
                '\n                    </div>\n                </div>\n            ';
        }
        const handleAction_7_437 = buildMessageHeaderHtml(
            value_418,
            friend_33,
            timestamp_11,
            speakerName_7,
            value_812,
            enabled_424,
            msg_21,
        );
        row_17.innerHTML =
            '\n            <div class="chat-checkbox-wrapper" style="display: ' +
            (window.imData.batchSelectMode ? 'flex' : 'none') +
            '; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">\n                <i class="far fa-circle chat-checkbox" data-timestamp="' +
            timestamp_11 +
            '" style="color: #c7c7cc; font-size: 22px;"></i>\n            </div>\n            <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">\n                ' +
            handleAction_7_437 +
            '\n                <div style="display: flex; justify-content: ' +
            (value_418 ? 'flex-end' : 'flex-start') +
            '; align-items: flex-end; width: 100%;">\n                    ' +
            value_436 +
            '\n                </div>\n            </div>\n        ';
        const toggle_3 = row_17.querySelector('.voice-message-bubble-inner');
        const transcriptEl = row_17.querySelector('.voice-message-transcript');
        const apk111New_1117 = Array.from(row_17.querySelectorAll('.voice-message-action'));
        const apk111New_1118 = (apk111New_1124) => {
                row_17.querySelectorAll('.voice-message-play').forEach((button) => {
                    button.disabled = apk111New_1124;
                });
                apk111New_1117.forEach((apk111New_1125) => {
                    apk111New_1125.disabled = apk111New_1124;
                });
                row_17
                    .querySelector('.voice-message-actions')
                    ?.setAttribute('aria-busy', apk111New_1124 ? 'true' : 'false');
            };
        apk111New_1117.forEach((apk111New_1126) =>
            apk111New_1126.addEventListener('click', async (apk111New_1127) => {
                apk111New_1127.preventDefault();
                apk111New_1127.stopPropagation();
                if (apk111New_1126.disabled) return;
                const apk111New_1128 = apk111New_1126.querySelector('i'),
                    apk111New_1129 = apk111New_1128?.className || '',
                    apk111New_1130 = apk111New_1126.getAttribute('aria-label') || '';
                if (apk111New_1128)
                    apk111New_1128.className = 'fas fa-spinner voice-message-action-spinner';
                apk111New_1126.setAttribute(
                    'aria-label',
                    apk111New_1126.dataset.voiceAction === 'regenerate'
                        ? '正在重新生成语音'
                        : '正在准备语音下载',
                );
                apk111New_1118(true);
                try {
                    if (apk111New_1126.dataset.voiceAction === 'regenerate') {
                        await window.imVoiceMessageAudio.regenerate(friend_33, msg_21);
                        const status = row_17.querySelector('.voice-message-playback-status');
                        if (status) status.textContent = '语音已准备好，再点播放';
                        window.showToast?.('语音已重新生成并保存');
                    } else {
                        const apk111New_1131 = await window.imVoiceMessageAudio.download(
                            friend_33,
                            msg_21,
                        );
                        if (apk111New_1131 === 'downloaded' || apk111New_1131 === 'shared')
                            window.showToast?.('语音已保存');
                    }
                } catch (apk111New_1132) {
                    console.error('Voice message action failed', apk111New_1132);
                    (!window.u2Api?.isRequestError?.(apk111New_1132) ||
                        !window.u2Api.reportError(apk111New_1132, {
                            operation: '语音生成',
                        })) &&
                        window.showToast &&
                        window.showToast(
                            window.u2Tts?.getUserErrorMessage?.(apk111New_1132) ||
                                apk111New_1132?.message ||
                                '语音操作失败',
                        );
                } finally {
                    if (apk111New_1128) apk111New_1128.className = apk111New_1129;
                    apk111New_1126.setAttribute('aria-label', apk111New_1130);
                    apk111New_1118(false);
                }
            }),
        );
        const playButton = row_17.querySelector('.voice-message-play');
        const playbackStatus = row_17.querySelector('.voice-message-playback-status');
        playButton?.addEventListener('click', async (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (playButton.disabled) return;
            const ready = window.imVoiceMessageAudio.isReady?.(friend_33, msg_21);
            playbackStatus.textContent = ready ? '' : '正在准备语音…';
            playButton.querySelector('i').className = 'fas fa-spinner voice-message-action-spinner';
            apk111New_1118(true);
            try {
                const result = await window.imVoiceMessageAudio.play(friend_33, msg_21);
                playbackStatus.textContent = result?.readyForTap ? '语音已准备好，再点播放' : '';
            } catch (error) {
                playbackStatus.textContent = '';
                console.error('Voice message playback failed', error);
                if (
                    !window.u2Api?.isRequestError?.(error) ||
                    !window.u2Api.reportError(error, { operation: '语音生成' })
                )
                    window.showToast?.(
                        window.u2Tts?.getUserErrorMessage?.(error) || '语音播放失败',
                    );
            } finally {
                playButton.querySelector('i').className = 'fas fa-play';
                const label = window.imVoiceMessageAudio.isReady?.(friend_33, msg_21)
                    ? '播放语音'
                    : '生成或播放语音';
                playButton.setAttribute('aria-label', label);
                playButton.title = label;
                apk111New_1118(false);
            }
        });
        toggle_3 &&
            transcriptEl &&
            toggle_3.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                const expanded = transcriptEl.hidden;
                transcriptEl.hidden = !expanded;
                toggle_3.setAttribute('aria-expanded', expanded ? 'true' : 'false');
                toggle_3.setAttribute('aria-label', expanded ? '收起语音转文字' : '展开语音转文字');
            });
        element_805.appendChild(row_17);
        window.imChat.scrollToBottom(element_805);
    }

    function renderUserVoiceMessageBubble(msg, friend, container, timestamp = Date.now()) {
        const isUser = msg.role !== 'assistant';
        const rows = Array.from(container.children).filter(
            (el) =>
                !el.classList.contains('chat-timestamp') &&
                !el.classList.contains('typing-row') &&
                !el.classList.contains('chat-offline-scene-row'),
        );
        const lastRow = rows.length > 0 ? rows[rows.length - 1] : null;
        const isGroupMessage = !isUser && friend.type === 'group';
        const safeSpeaker =
            isGroupMessage && window.imChat.getGroupMessageSpeaker
                ? window.imChat.getGroupMessageSpeaker(friend, msg)
                : null;
        const speakerName = isGroupMessage
            ? (safeSpeaker && safeSpeaker.nickname) || msg.speaker || msg.senderName || '群成员'
            : null;
        const speakerAvatar = (safeSpeaker && safeSpeaker.avatarUrl) || msg.senderAvatarUrl || null;
        let hasPrev = false;
        let sameSpeaker = false;

        if (lastRow) {
            if (isUser && lastRow.classList.contains('user-row')) {
                hasPrev = true;
                lastRow.classList.add('has-next');
            } else if (!isUser && lastRow.classList.contains('ai-row')) {
                const prevSpeaker = lastRow.getAttribute('data-speaker') || null;
                if (isGroupMessage) {
                    if (prevSpeaker === speakerName) {
                        hasPrev = true;
                        sameSpeaker = true;
                        lastRow.classList.add('has-next');
                    }
                } else if (!prevSpeaker) {
                    hasPrev = true;
                    sameSpeaker = true;
                    lastRow.classList.add('has-next');
                }
            }
        }

        const row = document.createElement('div');
        row.className = `chat-row ${isUser ? 'user-row' : 'ai-row'} ${hasPrev ? 'has-prev' : ''} ${isGroupMessage ? 'group-ai-row' : ''} ${isGroupMessage && sameSpeaker ? 'group-ai-row-continuous' : ''}`;
        row.setAttribute('data-timestamp', timestamp);
        row.setAttribute('data-message-id', window.imChat.ensureMessageId(msg, 'voice'));
        if (speakerName) {
            row.setAttribute('data-speaker', speakerName);
        }
        handleAction_22(row, friend, msg);
        handleAction_20(row, friend, msg);

        const transcript = String(msg.transcript || msg.text || '').trim();
        const calculatedDuration = Math.min(18, Math.max(3, Math.ceil(transcript.length / 3)));
        const duration = Math.min(18, Math.max(3, Number(msg.duration) || calculatedDuration));
        const safeTranscript = escapeHtml(transcript || '暂无转文字');
        const cleanTranslation = String(msg.translation || '').trim();
        const timeStr = formatBubbleTime(timestamp);
        const metaHtml = '';

        const contentHtml = `
                <button type="button" class="voice-message-bubble-inner" aria-expanded="false">
                    <span class="voice-message-mic"><i class="fas fa-microphone-alt"></i></span>
                    <span class="voice-message-wave" aria-hidden="true">
                        <span></span><span></span><span></span><span></span><span></span>
                    </span>
                    <span class="voice-message-duration">${duration}s</span>
                </button>
                <div class="voice-message-transcript" hidden>${safeTranscript}</div>
                ${cleanTranslation && msg.showTranslation ? `<div class="msg-translation" style="margin-top: 6px; padding-top: 6px; border-top: 1px solid ${isUser ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}; font-size: 13px; color: ${isUser ? 'rgba(255,255,255,0.7)' : '#8e8e93'}; line-height: 1.4; word-wrap: break-word; white-space: normal;">${escapeHtml(cleanTranslation)}</div>` : ''}
                ${metaHtml}
            `;

        const bubbleHtml = `<div class="chat-bubble ${isUser ? 'user-bubble' : 'ai-bubble'} voice-message-bubble">${contentHtml}</div>`;
        let bubbleWrapperHtml = bubbleHtml;
        if (isGroupMessage) {

            bubbleWrapperHtml = `
                    <div class="group-ai-bubble-wrap">
                        ${sameSpeaker ? '' : `<div class="group-ai-speaker-name">${escapeHtml(speakerName)}</div>`}
                        <div class="group-ai-bubble-row">
                            ${bubbleHtml}
                        </div>
                    </div>
                `;
        }

        const headerHtml = buildMessageHeaderHtml(
            isUser,
            friend,
            timestamp,
            speakerName,
            speakerAvatar,
            hasPrev,
            msg,
        );

        row.innerHTML = `
                <div class="chat-checkbox-wrapper" style="display: ${window.imData.batchSelectMode ? 'flex' : 'none'}; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">
                    <i class="far fa-circle chat-checkbox" data-timestamp="${timestamp}" style="color: #c7c7cc; font-size: 22px;"></i>
                </div>
                <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">
                    ${headerHtml}
                    <div style="display: flex; justify-content: ${isUser ? 'flex-end' : 'flex-start'}; align-items: flex-end; width: 100%;">
                        ${bubbleWrapperHtml}
                    </div>
                </div>
            `;

        const voiceBubble = row.querySelector('.voice-message-bubble');
        const voiceInner = row.querySelector('.voice-message-bubble-inner');
        if (voiceBubble) {
            const forcedBubbleStyle = {
                display: 'inline-flex',
                flexDirection: 'column',
                width: 'max-content',
                minWidth: '0',
                maxWidth: 'min(77%, 240px)',
                height: 'auto',
                minHeight: '0',
                maxHeight: 'none',
                aspectRatio: 'auto',
                flex: '0 0 auto',
                padding: '8px 12px',
                boxSizing: 'border-box',
            };
            Object.entries(forcedBubbleStyle).forEach(([property, value]) => {
                const cssProperty = property.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
                voiceBubble.style.setProperty(cssProperty, value, 'important');
            });
        }
        if (voiceInner) {
            voiceInner.style.setProperty('display', 'inline-flex', 'important');
            voiceInner.style.setProperty('width', 'max-content', 'important');
            voiceInner.style.setProperty('height', 'auto', 'important');
            voiceInner.style.setProperty('min-height', '0', 'important');
            voiceInner.style.setProperty('max-height', 'none', 'important');
            voiceInner.style.setProperty('aspect-ratio', 'auto', 'important');
        }

        const toggle = voiceInner;
        const transcriptEl = row.querySelector('.voice-message-transcript');
        if (toggle && transcriptEl) {
            toggle.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const shouldExpand = transcriptEl.hidden;
                transcriptEl.hidden = !shouldExpand;
                toggle.setAttribute('aria-expanded', shouldExpand ? 'true' : 'false');

                const ttsFriend = window.u2Tts?.resolveMessageTtsFriend
                    ? window.u2Tts.resolveMessageTtsFriend(friend, msg)
                    : friend;
                const canPlayTts = window.u2Tts?.canSpeakForFriend
                    ? window.u2Tts.canSpeakForFriend(ttsFriend)
                    : true;
                if (
                    shouldExpand &&
                    canPlayTts &&
                    window.u2Tts &&
                    typeof window.u2Tts.speakTextCached === 'function'
                ) {
                    try {
                        const cacheOwner = msg && typeof msg === 'object' ? msg : {};
                        const audioUrl = await window.u2Tts.speakTextCached(
                            transcript,
                            ttsFriend,
                            cacheOwner,
                        );
                        if (
                            audioUrl &&
                            msg &&
                            typeof msg === 'object' &&
                            !msg.ttsAudioUrl &&
                            window.imApp?.updateFriendMessage
                        ) {
                            await window.imApp.updateFriendMessage(
                                friend.id,
                                {
                                    id: msg.id || row.getAttribute('data-message-id') || null,
                                    timestamp: row.getAttribute('data-timestamp') || timestamp || null,
                                },
                                (targetMsg) => {
                                    if (targetMsg) targetMsg.ttsAudioUrl = audioUrl;
                                },
                                { silent: true },
                            );
                        }
                    } catch (error) {
                        console.error('Voice message playback failed', error);
                        if (window.showToast)
                            window.showToast(
                                window.u2Tts?.getUserErrorMessage?.(error) || '语音播放失败',
                            );
                    }
                }
            });
        }

        container.appendChild(row);
        window.imChat.scrollToBottom(container);
    }
    function renderStickerMessageBubble_2(msg_22, value_454, element_455, value_456 = Date.now()) {
        const value_457 = msg_22.role !== 'assistant';
        const handleAction_18_458 = handleAction_18(
            element_455,
            (element_473) =>
                    !element_473.classList.contains('chat-timestamp') &&
                    !element_473.classList.contains('typing-row'),
        );
        const value_459 = !value_457 && value_454.type === 'group';
        const value_460 =
            value_459 && window.imChat.getGroupMessageSpeaker
                ? window.imChat.getGroupMessageSpeaker(value_454, msg_22)
                : null;
        const value_461 = value_459
            ? (value_460 && value_460.nickname) ||
              msg_22.speaker ||
              msg_22.senderName ||
              'Group member'
            : null;
        const value_848 = (value_460 && value_460.avatarUrl) || msg_22.senderAvatarUrl || null;
        let enabled_463 = false;
        let enabled_464 = false;
        if (handleAction_18_458) {
            if (value_457 && handleAction_18_458.classList.contains('user-row')) {
                enabled_463 = true;
                handleAction_18_458.classList.add('has-next');
            } else {
                if (!value_457 && handleAction_18_458.classList.contains('ai-row')) {
                    const value_474 = handleAction_18_458.getAttribute('data-speaker') || null;
                    if (value_459)
                        value_474 === value_461 &&
                            ((enabled_463 = true),
                            (enabled_464 = true),
                            handleAction_18_458.classList.add('has-next'));
                    else
                        !value_474 &&
                            ((enabled_463 = true),
                            (enabled_464 = true),
                            handleAction_18_458.classList.add('has-next'));
                }
            }
        }
        const row_18 = document.createElement('div');
        row_18.className =
            'chat-row ' +
            (value_457 ? 'user-row' : 'ai-row') +
            ' ' +
            (enabled_463 ? 'has-prev' : '') +
            ' ' +
            (value_459 ? 'group-ai-row' : '') +
            ' ' +
            (value_459 && enabled_464 ? 'group-ai-row-continuous' : '');
        row_18.setAttribute('data-timestamp', value_456);
        row_18.setAttribute('data-message-id', window.imChat.ensureMessageId(msg_22, 'sticker'));
        value_461 && row_18.setAttribute('data-speaker', value_461);
        handleAction_22(row_18, value_454, msg_22);
        handleAction_20(row_18, value_454, msg_22);
        const stickerUrl_2 = String(msg_22.stickerUrl || msg_22.content || '').trim();
        const stickerName_2 = String(msg_22.stickerName || msg_22.text || 'Sticker').trim();
        const value_468 =
            formatBubbleTime(getChatDisplayTimestamp(value_454, value_456));
        const text_469 = '';
        const value_470 =
            '\n            <div class="sticker-message-wrap" title="' +
            escapeHtml(stickerName_2) +
            '">\n                <img class="sticker-message-img" src="' +
            escapeHtml(stickerUrl_2) +
            '" alt="' +
            escapeHtml(stickerName_2) +
            '">\n                ' +
            text_469 +
            '\n            </div>\n        ';
        let value_471 = value_470;
        if (value_459) {
            value_471 =
                '\n                <div class="group-ai-bubble-wrap sticker-group-wrap">\n                    ' +
                (enabled_464
                    ? ''
                    : '<div class="group-ai-speaker-name">' + escapeHtml(value_461) + '</div>') +
                '\n                    <div class="group-ai-bubble-row">\n                        ' + '\n                        ' +
                value_470 +
                '\n                    </div>\n                </div>\n            ';
        }
        const handleAction_7_472 = buildMessageHeaderHtml(
            value_457,
            value_454,
            value_456,
            value_461,
            value_848,
            enabled_463,
            msg_22,
        );
        row_18.innerHTML =
            '\n            <div class="chat-checkbox-wrapper" style="display: ' +
            (window.imData.batchSelectMode ? 'flex' : 'none') +
            '; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">\n                <i class="far fa-circle chat-checkbox" data-timestamp="' +
            value_456 +
            '" style="color: #c7c7cc; font-size: 22px;"></i>\n            </div>\n            <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">\n                ' +
            handleAction_7_472 +
            '\n                <div style="display: flex; justify-content: ' +
            (value_457 ? 'flex-end' : 'flex-start') +
            '; align-items: flex-end; width: 100%;">\n                    ' +
            value_471 +
            '\n                </div>\n            </div>\n        ';
        element_455.appendChild(row_18);
        window.imChat.scrollToBottom(element_455);
    }
    function handleAction_83(value_864) {
        document.getElementById('location-detail-overlay')?.remove();
        const slice_865 = String(value_864?.locationName || value_864?.name || '共享位置')
                .trim()
                .slice(0, 80),
            slice_866 = String(value_864?.locationAddress || value_864?.address || '')
                .trim()
                .slice(0, 160),
            slice_867 = String(
                value_864?.locationNameTranslation || value_864?.nameTranslation || '',
            )
                .trim()
                .slice(0, 80),
            slice_868 = String(
                value_864?.locationAddressTranslation || value_864?.addressTranslation || '',
            )
                .trim()
                .slice(0, 160),
            value_486 = '' + slice_865 + (slice_867 ? '（' + slice_867 + '）' : ''),
            value_870 = slice_866
                ? '' + slice_866 + (slice_868 ? '（' + slice_868 + '）' : '')
                : '未填写详细地址',
            element_871_2 = document.createElement('div');
        element_871_2.id = 'location-detail-overlay';
        element_871_2.className = 'location-detail-overlay';
        element_871_2.innerHTML =
            `
            <div class="location-detail-card" role="dialog" aria-modal="true" aria-label="定位详情">
                <div class="location-detail-header">
                    <strong>定位详情</strong>
                    <button type="button" class="location-detail-close" aria-label="关闭"><i class="fas fa-times"></i></button>
                </div>
                <div class="location-detail-map" aria-hidden="true">
                    <span class="location-detail-road road-a"></span>
                    <span class="location-detail-road road-b"></span>
                    <span class="location-detail-road road-c"></span>
                    <span class="location-detail-pin"><i class="fas fa-location-dot"></i></span>
                </div>
                <div class="location-detail-copy">
                    <strong>` +
            escapeHtml(value_486) +
            `</strong>
                    <span>` +
            escapeHtml(value_870) +
            `</span>
                </div>
            </div>`;
        document.body.appendChild(element_871_2);
        const value_872 = () => element_871_2.remove();
        element_871_2.addEventListener('click', (event_873) => {
            if (
                event_873.target === element_871_2 ||
                event_873.target.closest('.location-detail-close')
            )
                value_872();
        });
        element_871_2.addEventListener('keydown', (value_874) => {
            if (value_874.key === 'Escape') value_872();
        });
        element_871_2.querySelector('.location-detail-close')?.focus();
    }
    function renderLocationBubble_2(message_875, value_876, element_491, value_492 = Date.now()) {
        const value_879 = message_875.role === 'user',
            value_880 = !value_879 && value_876?.type === 'group',
            value_495 = value_880 ? resolveGroupBubbleIdentity(value_876, message_875) : null,
            speakerName_8 = value_495?.name || null,
            value_497 = value_495?.avatarUrl || null,
            handleAction_18_498 = handleAction_18(
                element_491,
                (element_516) =>
                    !element_516.classList.contains('chat-timestamp') &&
                    !element_516.classList.contains('typing-row'),
            );
        let enabled_499 = false,
            enabled_500 = false;
        if (handleAction_18_498) {
            if (value_879 && handleAction_18_498.classList.contains('user-row')) {
                enabled_499 = true;
                handleAction_18_498.classList.add('has-next');
            } else {
                if (!value_879 && handleAction_18_498.classList.contains('ai-row')) {
                    const value_517 = handleAction_18_498.getAttribute('data-speaker') || null;
                    (!value_880 || value_517 === speakerName_8) &&
                        ((enabled_499 = true),
                        (enabled_500 = value_880),
                        handleAction_18_498.classList.add('has-next'));
                }
            }
        }
        const element_887 = document.createElement('div');
        element_887.className =
            'chat-row ' +
            (value_879 ? 'user-row' : 'ai-row') +
            ' ' +
            (enabled_499 ? 'has-prev' : '') +
            ' ' +
            (value_880 ? 'group-ai-row' : '') +
            ' ' +
            (value_880 && enabled_500 ? 'group-ai-row-continuous' : '');
        element_887.setAttribute('data-timestamp', value_492);
        element_887.setAttribute(
            'data-message-id',
            window.imChat.ensureMessageId(message_875, 'location'),
        );
        if (speakerName_8) element_887.setAttribute('data-speaker', speakerName_8);
        handleAction_22(element_887, value_876, message_875);
        handleAction_20(element_887, value_876, message_875);
        const slice_888 = String(message_875.locationName || message_875.name || '共享位置')
                .trim()
                .slice(0, 80),
            slice_889 = String(message_875.locationAddress || message_875.address || '')
                .trim()
                .slice(0, 160),
            slice_890 = String(
                message_875.locationNameTranslation || message_875.nameTranslation || '',
            )
                .trim()
                .slice(0, 80),
            slice_891 = String(
                message_875.locationAddressTranslation || message_875.addressTranslation || '',
            )
                .trim()
                .slice(0, 160),
            value_506 = '' + slice_888 + (slice_890 ? '（' + slice_890 + '）' : ''),
            value_893 = slice_889
                ? '' + slice_889 + (slice_891 ? '（' + slice_891 + '）' : '')
                : '虚拟定位',
            value_513 =
                `
            <div class="chat-bubble ` +
                (value_879 ? 'user-bubble' : 'ai-bubble') +
                ' im-card-bubble location-message-bubble" role="button" tabindex="0" aria-label="查看定位：' +
                escapeHtml(value_506) +
                `">
                <div class="location-message-map" aria-hidden="true">
                    <span class="location-message-road road-a"></span>
                    <span class="location-message-road road-b"></span>
                    <span class="location-message-pin"><i class="fas fa-location-dot"></i></span>
                </div>
                <div class="location-message-copy">
                    <strong>` +
                escapeHtml(value_506) +
                `</strong>
                    <span>` +
                escapeHtml(value_893) +
                `</span>
                </div>
            </div>`;
        let value_514 = value_513;
        if (value_880) {
            value_514 =
                `<div class="group-ai-bubble-wrap">
                ` +
                (enabled_500
                    ? ''
                    : '<div class="group-ai-speaker-name">' +
                      escapeHtml(speakerName_8) +
                      '</div>') +
                `
                <div class="group-ai-bubble-row">` + '' +
                value_513 +
                `</div>
            </div>`;
        }
        const handleAction_7_515 = buildMessageHeaderHtml(
            value_879,
            value_876,
            value_492,
            speakerName_8,
            value_497,
            enabled_499,
            message_875,
        );
        element_887.innerHTML =
            `
            <div class="chat-checkbox-wrapper" style="display:` +
            (window.imData.batchSelectMode ? 'flex' : 'none') +
            `;width:40px;justify-content:center;align-items:flex-end;padding-bottom:10px;flex-shrink:0;cursor:pointer;transition:all .2s;">
                <i class="far fa-circle chat-checkbox" data-timestamp="` +
            value_492 +
            `" style="color:#c7c7cc;font-size:22px;"></i>
            </div>
            <div style="flex:1;display:flex;flex-direction:column;min-width:0;">
                ` +
            handleAction_7_515 +
            `
                <div style="display:flex;justify-content:` +
            (value_879 ? 'flex-end' : 'flex-start') +
            ';align-items:flex-end;width:100%;">' +
            value_514 +
            `</div>
            </div>`;
        const locationMessageBubbleElement = element_887.querySelector('.location-message-bubble');
        locationMessageBubbleElement?.addEventListener('click', () => handleAction_83(message_875));
        locationMessageBubbleElement?.addEventListener('keydown', (event_11) => {
            if (event_11.key !== 'Enter' && event_11.key !== ' ') return;
            event_11.preventDefault();
            handleAction_83(message_875);
        });
        element_491.appendChild(element_887);
        window.imChat.scrollToBottom(element_491);
    }
    function cleanFakeLinkText(value_6, maxLength = 50000) {
        return String(value_6 == null ? '' : value_6)
            .replace(/\u0000/g, '')
            .trim()
            .slice(0, maxLength);
    }
    function handleAction_85(value_8) {
        try {
            const parsed = new URL(String(value_8 || ''));
            return (
                parsed.protocol === 'https:' &&
                (parsed.hostname === 'picsum.photos' || parsed.hostname === 'fastly.picsum.photos')
            );
        } catch (value_905) {
            return false;
        }
    }
    function stripFakeLinkHtmlToPlainText_3(value_9, maxLength_2 = 12000) {
        return cleanFakeLinkText(value_9, maxLength_2)
            .replace(
                /<\s*(script|style|iframe|object|embed|svg|canvas)[\s\S]*?<\s*\/\s*\1\s*>/gi,
                ' ',
            )
            .replace(/<[^>]+>/g, ' ')
            .replace(/&nbsp;/gi, ' ')
            .replace(/&amp;/gi, '&')
            .replace(/&lt;/gi, '<')
            .replace(/&gt;/gi, '>')
            .replace(/&quot;/gi, '"')
            .replace(/&#039;/gi, "'")
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, maxLength_2);
    }
    function sanitizeFakeLinkCssText(value_10) {
        return cleanFakeLinkText(value_10, 40000)
            .replace(/@import[^;]+;/gi, '')
            .replace(/url\s*\([^)]*\)/gi, 'none')
            .replace(/expression\s*\([^)]*\)/gi, '')
            .replace(/javascript\s*:/gi, '')
            .replace(/behavior\s*:/gi, '')
            .replace(/-moz-binding\s*:/gi, '')
            .replace(/position\s*:\s*fixed\s*;?/gi, 'position:absolute;')
            .slice(0, 40000);
    }
    function sanitizeFakeLinkJsText(value_11) {
        return cleanFakeLinkText(value_11, 12000)
            .replace(/<\/script/gi, '<\\/script')
            .slice(0, 12000);
    }
    function normalizeFakeLinkInteractionForRender(source_3 = {}) {
        if (!source_3 || typeof source_3 !== 'object') return null;
        const allowedTypes = new Set(['toggleClass', 'toggleText', 'increment', 'switchPanel']),
            type_2 = allowedTypes.has(source_3.type) ? source_3.type : 'toggleClass',
            selector_2 = cleanFakeLinkText(source_3.selector || source_3.target || '', 160);
        if (!selector_2 || /[<>{}]/.test(selector_2)) return null;
        return {
            type: type_2,
            selector: selector_2,
            targetSelector: cleanFakeLinkText(
                source_3.targetSelector || source_3.target || selector_2,
                160,
            ),
            className: cleanFakeLinkText(source_3.className || 'is-active', 60) || 'is-active',
            activeText: cleanFakeLinkText(source_3.activeText || '', 80),
            inactiveText: cleanFakeLinkText(source_3.inactiveText || '', 80),
            countSelector: cleanFakeLinkText(source_3.countSelector || '', 160),
            panelGroup: cleanFakeLinkText(source_3.panelGroup || '', 80),
        };
    }
    function sanitizeFakeLinkElementTree(parent) {
        if (!parent || !parent.childNodes) return;
        const allowedTags = new Set([
                'article',
                'section',
                'main',
                'header',
                'footer',
                'nav',
                'div',
                'p',
                'span',
                'strong',
                'em',
                'b',
                'i',
                'small',
                'ul',
                'ol',
                'li',
                'h1',
                'h2',
                'h3',
                'h4',
                'h5',
                'h6',
                'button',
                'figure',
                'figcaption',
                'blockquote',
                'hr',
                'br',
                'img',
            ]),
            forbiddenTags = new Set([
                'script',
                'style',
                'iframe',
                'object',
                'embed',
                'svg',
                'canvas',
                'link',
                'meta',
                'base',
                'form',
                'input',
                'textarea',
                'select',
                'option',
            ]);
        Array.from(parent.childNodes).forEach((node) => {
            if (!node || node.nodeType !== 1) return;
            const tag = String(node.tagName || '').toLowerCase();
            if (forbiddenTags.has(tag)) {
                node.remove();
                return;
            }
            if (!allowedTags.has(tag)) {
                const fragment = document.createDocumentFragment();
                while (node.firstChild) fragment.appendChild(node.firstChild);
                node.replaceWith(fragment);
                sanitizeFakeLinkElementTree(parent);
                return;
            }
            Array.from(node.attributes || []).forEach((attr) => {
                const name_2 = String(attr.name || '').toLowerCase(),
                    value_12 = cleanFakeLinkText(attr.value || '', 500);
                if (
                    !name_2 ||
                    name_2.startsWith('on') ||
                    name_2 === 'style' ||
                    name_2 === 'href' ||
                    name_2 === 'srcset' ||
                    name_2 === 'action' ||
                    name_2 === 'formaction'
                ) {
                    node.removeAttribute(attr.name);
                    return;
                }
                if (name_2 === 'src') {
                    tag === 'img' && (/^data:image\//i.test(value_12) || handleAction_85(value_12))
                        ? (node.setAttribute('src', value_12), node.setAttribute('loading', 'lazy'))
                        : node.removeAttribute(attr.name);
                    return;
                }
                if (name_2 === 'type' && tag === 'button') {
                    node.setAttribute('type', 'button');
                    return;
                }
                if (
                    name_2 === 'class' ||
                    name_2 === 'role' ||
                    name_2 === 'title' ||
                    name_2 === 'aria-label' ||
                    name_2.indexOf('data-') === 0
                ) {
                    node.setAttribute(attr.name, value_12);
                    return;
                }
                node.removeAttribute(attr.name);
            });
            if (tag === 'button' && !node.getAttribute('type')) node.setAttribute('type', 'button');
            sanitizeFakeLinkElementTree(node);
        });
    }
    function sanitizeFakeLinkHtmlForRender(value_15) {
        const html_2 = cleanFakeLinkText(value_15, 80000);
        if (!html_2) return '';
        if (typeof document === 'undefined' || !document.createElement)
            return html_2
                .replace(
                    /<\s*(script|style|iframe|object|embed|form|input|textarea|select|option)[\s\S]*?<\s*\/\s*\1\s*>/gi,
                    '',
                )
                .replace(
                    /<\s*\/?\s*(script|style|iframe|object|embed|form|input|textarea|select|option)[^>]*>/gi,
                    '',
                )
                .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
                .replace(
                    /\s+(href|src|srcset|action|formaction)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi,
                    '',
                );
        const template = document.createElement('template');
        return (
            (template.innerHTML = html_2),
            sanitizeFakeLinkElementTree(template.content),
            template.innerHTML
        );
    }
    function normalizeFakeLinkWebPageForRender(value_925 = {}) {
        const safeSource = value_925 && typeof value_925 === 'object' ? value_925 : {},
            rawHtml = safeSource.html || safeSource.bodyHtml || '',
            html_3 =
                safeSource.js && window.imChat?.sanitizeFakeLinkHtmlForStorage
                    ? window.imChat.sanitizeFakeLinkHtmlForStorage(rawHtml)
                    : sanitizeFakeLinkHtmlForRender(rawHtml),
            css_2 = sanitizeFakeLinkCssText(safeSource.css || safeSource.style || ''),
            js_2 = sanitizeFakeLinkJsText(safeSource.js || ''),
            rawInteractions = Array.isArray(safeSource.interactions) ? safeSource.interactions : [];
        return {
            theme: cleanFakeLinkText(safeSource.theme || 'generic', 40).toLowerCase() || 'generic',
            html: html_3,
            css: css_2,
            js: js_2,
            interactions: rawInteractions
                .map(normalizeFakeLinkInteractionForRender)
                .filter(Boolean)
                .slice(0, 24),
            source: cleanFakeLinkText(safeSource.source || '', 30),
        };
    }
    function sanitizeFakeLinkPagePackage_3(webPage_2 = {}) {
        return normalizeFakeLinkWebPageForRender(webPage_2);
    }
    function scopeFakeLinkCss(css_3, scopeSelector) {
        const safeCss = sanitizeFakeLinkCssText(css_3);
        if (!safeCss) return '';
        return safeCss.replace(/(^|})\s*([^@}{][^{]+)\{/g, (match_2, closeBrace, selectors) => {
            const scopedSelectors = selectors
                .split(',')
                .map((selector_3) => selector_3.trim())
                .filter(Boolean)
                .map((selector_4) =>
                    selector_4.indexOf(scopeSelector) === 0
                        ? selector_4
                        : scopeSelector + ' ' + selector_4,
                )
                .join(', ');
            return closeBrace + ' ' + scopedSelectors + '{';
        });
    }
    function safeQueryAll(root, selector_5) {
        try {
            return Array.from(root.querySelectorAll(selector_5));
        } catch (_) {
            return [];
        }
    }
    function bindFakeLinkInteractions(root_2, interactions_2 = []) {
        if (!root_2 || !Array.isArray(interactions_2)) return;
        interactions_2.forEach((value_940) => {
            const normalized = normalizeFakeLinkInteractionForRender(value_940);
            if (!normalized) return;
            safeQueryAll(root_2, normalized.selector).forEach((trigger) => {
                trigger.addEventListener('click', (event_943) => {
                    event_943.preventDefault();
                    const target_2 = safeQueryAll(root_2, normalized.targetSelector)[0] || trigger;
                    if (normalized.type === 'switchPanel') {
                        const targetName_3 =
                                trigger.getAttribute('data-fake-target') ||
                                target_2.getAttribute('data-fake-panel') ||
                                '',
                            groupSelector = normalized.panelGroup
                                ? '[data-fake-panel-group="' + normalized.panelGroup + '"]'
                                : '[data-fake-panel]';
                        safeQueryAll(root_2, groupSelector).forEach((panel) => {
                            const active =
                                targetName_3 &&
                                panel.getAttribute('data-fake-panel') === targetName_3;
                            panel.hidden = !active;
                            panel.classList.toggle('is-active', active);
                        });
                        return;
                    }
                    if (normalized.type === 'toggleText') {
                        const isActive = target_2.classList.toggle(normalized.className);
                        (normalized.activeText || normalized.inactiveText) &&
                            (target_2.textContent = isActive
                                ? normalized.activeText || target_2.textContent
                                : normalized.inactiveText || target_2.textContent);
                        return;
                    }
                    if (normalized.type === 'increment') {
                        const countNode = normalized.countSelector
                            ? safeQueryAll(root_2, normalized.countSelector)[0] || null
                            : target_2;
                        if (countNode) {
                            const counted = trigger.dataset.fakeIncremented === 'true',
                                current =
                                    Number(
                                        String(countNode.textContent || '').replace(/[^\d.-]/g, ''),
                                    ) || 0;
                            countNode.textContent = String(
                                Math.max(0, current + (counted ? -1 : 1)),
                            );
                            trigger.dataset.fakeIncremented = counted ? 'false' : 'true';
                        }
                        return;
                    }
                    target_2.classList.toggle(normalized.className);
                });
            });
        });
    }
    function renderFakeLinkWebPage_2(apk119Value1351, apk119Value1352 = {}) {
  if (!apk119Value1351) return false;
  const apk119Value1353 = sanitizeFakeLinkPagePackage_3(apk119Value1352);
  if (!apk119Value1353.html) return false;
  if (apk119Value1353.js) {
    const apk119Value1358 = window.imChat?.["buildFakeLinkSandboxDocument"];
    if (typeof apk119Value1358 !== "function") return false;
    apk119Value1351.innerHTML = "";
    const apk119Value1359 = document.createElement("iframe");
    apk119Value1359.className = "im-fake-link-detail-iframe", apk119Value1359.setAttribute("sandbox", "allow-scripts"), apk119Value1359.setAttribute("referrerpolicy", "no-referrer"), apk119Value1359.setAttribute("title", "链接小剧场");
    if (window.imChat?.["setFakeLinkFrameDocument"]) window.imChat.setFakeLinkFrameDocument(apk119Value1359, apk119Value1353);else apk119Value1359.srcdoc = apk119Value1358(apk119Value1353);
    return apk119Value1351.appendChild(apk119Value1359), true;
  }
  const apk119Value1354 = "fake-link-page-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8),
    apk119Value1355 = "[data-fake-page-id=\"" + apk119Value1354 + "\"]";
  apk119Value1351.innerHTML = "";
  const apk119Value1356 = document.createElement("style");
  apk119Value1356.className = "im-fake-link-web-style", apk119Value1356.textContent = scopeFakeLinkCss(apk119Value1353.css, apk119Value1355);
  const apk119Value1357 = document.createElement("div");
  return apk119Value1357.className = "im-fake-link-web-root", apk119Value1357.setAttribute("data-fake-page-id", apk119Value1354), apk119Value1357.setAttribute("data-theme", apk119Value1353.theme || "generic"), apk119Value1357.innerHTML = apk119Value1353.html, apk119Value1351.appendChild(apk119Value1356), apk119Value1351.appendChild(apk119Value1357), bindFakeLinkInteractions(apk119Value1357, apk119Value1353.interactions), true;
}
    function normalizeFakeLinkDisplayValue(value_16) {
        const raw = cleanFakeLinkText(value_16, 220);
        if (!raw) return '';
        if (window.imChat?.normalizeFakeLinkDomain) {
            const normalized_2 = window.imChat.normalizeFakeLinkDomain(raw);
            if (normalized_2) return normalized_2;
        }
        try {
            const parsed_2 = new URL(/^https?:\/\//i.test(raw) ? raw : 'https://' + raw),
                domain_2 = parsed_2.hostname.toLowerCase(),
                path = parsed_2.pathname && parsed_2.pathname !== '/' ? parsed_2.pathname : '';
            return (domain_2 + path + (parsed_2.search || '')).replace(/\/+$/, '');
        } catch (value_965) {
            return raw
                .replace(/^https?:\/\//i, '')
                .replace(/\/+$/, '')
                .slice(0, 180);
        }
    }
    function handleAction_94(apk119Value1367 = {}) {
  const apk119Value1368 = apk119Value1367.fakeLinkData && typeof apk119Value1367.fakeLinkData === "object" ? apk119Value1367.fakeLinkData : {},
    apk119Value1369 = normalizeFakeLinkDisplayValue(apk119Value1368.displayUrl || apk119Value1368.canonicalUrl || apk119Value1367.content || ""),
    apk119Value1370 = cleanFakeLinkText(apk119Value1368.domain || apk119Value1369.split(/[/?#]/)[0] || "", 120),
    apk119Value1371 = cleanFakeLinkText(apk119Value1368.siteName || apk119Value1368.platformLabel || apk119Value1368.author || apk119Value1370 || "假网页", 80),
    apk119Value1372 = cleanFakeLinkText(apk119Value1368.title || apk119Value1367.title || apk119Value1370 || "假网页", 180),
    apk119Value1373 = cleanFakeLinkText(apk119Value1368.summary || apk119Value1368.description || "", 800),
    apk119Value1374 = cleanFakeLinkText(apk119Value1368.bodyText || apk119Value1368.content || "", 50000),
    apk119Value1375 = apk119Value1368.webPage && typeof apk119Value1368.webPage === "object" ? apk119Value1368.webPage : null,
    apk119Value1376 = apk119Value1375 ? normalizeFakeLinkWebPageForRender(apk119Value1375) : null;
  return {
    domain: apk119Value1370,
    displayUrl: apk119Value1369,
    siteName: apk119Value1371,
    title: apk119Value1372,
    summary: apk119Value1373,
    bodyText: apk119Value1374,
    webPage: apk119Value1376 && apk119Value1376.html ? apk119Value1376 : null,
    translation: window.imChat?.["normalizeFakeLinkTranslation"]?.(apk119Value1368.translation) || null,
    prompt: cleanFakeLinkText(apk119Value1368.prompt || "", 1000),
    generatedBy: cleanFakeLinkText(apk119Value1368.generatedBy || "manual", 40),
    createdAt: Number(apk119Value1368.createdAt || apk119Value1367.timestamp) || Date.now()
  };
}
    function handleAction_95() {
  let apk119Value1377 = document.getElementById("im-fake-link-detail-overlay");
  const apk119Value1378 = document.getElementById("app") || document.body;
  if (apk119Value1377) {
    if (apk119Value1377.parentNode !== apk119Value1378) apk119Value1378.appendChild(apk119Value1377);
    return apk119Value1377;
  }
  apk119Value1377 = document.createElement("div"), apk119Value1377.id = "im-fake-link-detail-overlay", apk119Value1377.className = "bottom-sheet-overlay detail-sheet-overlay wb-centered-modal-overlay im-fake-link-detail-overlay", apk119Value1377.style.display = "none", apk119Value1377.inert = true, apk119Value1377.setAttribute("aria-hidden", "true"), apk119Value1377.innerHTML = ["<div class=\"bottom-sheet wb-centered-modal-card im-fake-link-detail-sheet\">", "  <div class=\"im-fake-link-browser-bar\">", "    <button type=\"button\" class=\"im-fake-link-browser-close\" aria-label=\"关闭\"><i class=\"fas fa-chevron-left\"></i></button>", "    <div class=\"im-fake-link-address\"></div>", "    <button type=\"button\" class=\"im-fake-link-browser-translate\" aria-label=\"切换中文翻译\" title=\"切换中文翻译\" aria-pressed=\"false\"><i class=\"fas fa-language\" aria-hidden=\"true\"></i></button>", "  </div>", "  <article class=\"im-fake-link-page\"></article>", "</div>"].join("");
  const apk119Value1379 = () => {
    clearTimeout(apk119Value1377._fakeLinkDetail?.["prewarmTimer"]), apk119Value1377.inert = true, apk119Value1377.setAttribute("aria-hidden", "true");
  };
  apk119Value1377.addEventListener("u2:view-closing", apk119Value1379);
  const apk119Value1380 = () => {
    apk119Value1379();
    if (window.closeView) window.closeView(apk119Value1377);else apk119Value1377.classList.remove("active"), apk119Value1377.style.display = "none";
  };
  return apk119Value1377.addEventListener("click", apk119Value1381 => {
    if (apk119Value1381.target === apk119Value1377 || apk119Value1381.target.closest(".im-fake-link-browser-close")) apk119Value1380();else apk119Value1381.target.closest(".im-fake-link-browser-translate") && apk119Value1377._fakeLinkDetail?.["data"]["translation"] && switchFakeLinkDetailLanguage(apk119Value1377, !apk119Value1377._fakeLinkDetail.translated);
  }), apk119Value1378.appendChild(apk119Value1377), apk119Value1377;
}
    function handleAction_96(apk119Value1404 = {}, apk119Value1405 = null) {
  const apk119Value1406 = handleAction_95();
  let apk119Value1407 = apk119Value1406._fakeLinkDetail;
  if (!apk119Value1407 || apk119Value1407.message !== apk119Value1404 || apk119Value1407.source !== apk119Value1404.fakeLinkData) {
    clearTimeout(apk119Value1407?.["prewarmTimer"]);
    const apk119Value1408 = handleAction_94(apk119Value1404);
    apk119Value1406.querySelector(".im-fake-link-address").textContent = apk119Value1408.displayUrl || apk119Value1408.domain || "", apk119Value1406.querySelector(".im-fake-link-page").replaceChildren(), apk119Value1407 = apk119Value1406._fakeLinkDetail = {
      data: apk119Value1408,
      message: apk119Value1404,
      source: apk119Value1404.fakeLinkData,
      translated: false,
      panes: new Map()
    };
  }
  switchFakeLinkDetailLanguage(apk119Value1406, false), apk119Value1406.inert = false, apk119Value1406.setAttribute("aria-hidden", "false"), apk119Value1406.style.display = "flex";
  if (window.openView) window.openView(apk119Value1406);else apk119Value1406.classList.add("active");
  apk119Value1407.data.translation && !apk119Value1407.panes.has("zh") && (clearTimeout(apk119Value1407.prewarmTimer), apk119Value1407.prewarmTimer = setTimeout(() => {
    if (apk119Value1406._fakeLinkDetail === apk119Value1407 && apk119Value1406.classList.contains("active")) ensureFakeLinkLanguagePane(apk119Value1406, apk119Value1407, "zh");
  }, 80));
}
    function renderFakeLinkBubble_2(apk119Value1409, apk119Value1410, apk119Value1411, apk119Value1412 = Date.now()) {
  const apk119Value1413 = apk119Value1409.role === "user",
    apk119Value1414 = !apk119Value1413 && apk119Value1410.type === "group",
    apk119Value1415 = apk119Value1414 && window.imChat.getGroupMessageSpeaker ? window.imChat.getGroupMessageSpeaker(apk119Value1410, apk119Value1409) : null,
    apk119Value1416 = apk119Value1414 ? apk119Value1415 && apk119Value1415.nickname || apk119Value1409.speaker || apk119Value1409.senderName || "Group member" : null,
    apk119Value1417 = apk119Value1415 && apk119Value1415.avatarUrl || apk119Value1409.senderAvatarUrl || null,
    apk119Value1418 = handleAction_18(apk119Value1411, apk119Value1442 => !apk119Value1442.classList.contains("chat-timestamp") && !apk119Value1442.classList.contains("typing-row"));
  let apk119Value1419 = false,
    apk119Value1420 = false;
  if (apk119Value1418) {
    if (apk119Value1413 && apk119Value1418.classList.contains("user-row")) apk119Value1419 = true, apk119Value1418.classList.add("has-next");else {
      if (!apk119Value1413 && apk119Value1418.classList.contains("ai-row")) {
        const apk119Value1443 = apk119Value1418.getAttribute("data-speaker") || null;
        if (apk119Value1414 && apk119Value1443 === apk119Value1416) apk119Value1419 = true, apk119Value1420 = true, apk119Value1418.classList.add("has-next");else !apk119Value1414 && !apk119Value1443 && (apk119Value1419 = true, apk119Value1418.classList.add("has-next"));
      }
    }
  }
  const apk119Value1421 = handleAction_94(apk119Value1409),
    apk119Value1422 = apk119Value1421.displayUrl,
    apk119Value1423 = apk119Value1421.domain || apk119Value1422,
    apk119Value1424 = apk119Value1421.siteName || "假网页",
    apk119Value1425 = apk119Value1421.webPage?.["theme"] || "",
    apk119Value1426 = apk119Value1425 === "xiaohongshu" ? "#ff2442" : "#3a3a3c",
    apk119Value1427 = apk119Value1421.title || apk119Value1424 || "假网页",
    apk119Value1428 = apk119Value1421.summary || apk119Value1421.bodyText.slice(0, 120),
    apk119Value1429 = "",
    apk119Value1430 = "",
    apk119Value1431 = "站内假网页",
    apk119Value1432 = apk119Value1430 ? "<img src=\"" + escapeHtml(apk119Value1430) + "\" alt=\"\">" : "<i class=\"fas fa-link\"></i>",
    apk119Value1433 = !apk119Value1413 ? "点击查看" : apk119Value1421.webPage ? apk119Value1421.generatedBy === "ai" ? "AI 仿真网页" : "站内仿真网页" : apk119Value1431,
    apk119Value1434 = "\n            <div class=\"chat-link-card\" role=\"link\" tabindex=\"0\" style=\"--link-card-color:" + escapeHtml(apk119Value1426) + ";\">\n                <div class=\"chat-link-card-cover\">" + apk119Value1432 + "</div>\n                <div class=\"chat-link-card-body\">\n                    <div class=\"chat-link-card-platform\">" + escapeHtml(apk119Value1424) + "</div>\n                    <div class=\"chat-link-card-title\">" + escapeHtml(apk119Value1427) + "</div>\n                    " + (apk119Value1429 || apk119Value1428 ? "<div class=\"chat-link-card-summary\">" + escapeHtml(apk119Value1429 ? "" + (apk119Value1428 ? " · " + apk119Value1428 : "") : apk119Value1428) + "</div>" : "") + "\n                    <div class=\"chat-link-card-footer\">\n                        <span>" + escapeHtml(apk119Value1423 || apk119Value1422) + "</span>\n                        <strong>" + escapeHtml(apk119Value1433) + "</strong>\n                    </div>\n                </div>\n            </div>\n        ",
    apk119Value1435 = "<div class=\"chat-bubble " + (apk119Value1413 ? "user-bubble" : "ai-bubble") + " im-card-bubble im-link-bubble\">" + apk119Value1434 + "</div>";
  let apk119Value1436 = apk119Value1435;
  if (apk119Value1414) {
    const apk119Value1444 = String(apk119Value1416).trim().charAt(0) || "?",
      apk119Value1445 = apk119Value1417 ? "<img src=\"" + escapeHtml(apk119Value1417) + "\" onerror=\"this.src='assets/moren-thumb.jpg'\" loading=\"lazy\" decoding=\"async\" style=\"width:28px;height:28px;border-radius:50%;object-fit:cover;\">" : "<div class=\"chat-avatar-small\">" + escapeHtml(apk119Value1444) + "</div>";
    apk119Value1436 = "\n                <div class=\"group-ai-bubble-wrap\">\n                    " + (apk119Value1420 ? "" : "<div class=\"group-ai-speaker-name\">" + escapeHtml(apk119Value1416) + "</div>") + "\n                    <div class=\"group-ai-bubble-row\">\n                        <div class=\"group-ai-avatar-slot\">" + (apk119Value1420 ? "<div class=\"group-ai-avatar-placeholder\"></div>" : apk119Value1445) + "</div>\n                        " + apk119Value1435 + "\n                    </div>\n                </div>\n            ";
  }
  const apk119Value1437 = document.createElement("div");
  apk119Value1437.className = "chat-row " + (apk119Value1413 ? "user-row" : "ai-row") + " " + (apk119Value1419 ? "has-prev" : "") + " " + (apk119Value1414 ? "group-ai-row" : "") + " " + (apk119Value1414 && apk119Value1420 ? "group-ai-row-continuous" : ""), apk119Value1437.setAttribute("data-timestamp", apk119Value1412), apk119Value1437.setAttribute("data-message-id", window.imChat.ensureMessageId(apk119Value1409, "link"));
  if (apk119Value1416) apk119Value1437.setAttribute("data-speaker", apk119Value1416);
  handleAction_22(apk119Value1437, apk119Value1410, apk119Value1409), handleAction_20(apk119Value1437, apk119Value1410, apk119Value1409);
  const apk119Value1438 = buildMessageHeaderHtml(apk119Value1413, apk119Value1410, apk119Value1412, apk119Value1416, apk119Value1417, apk119Value1419, apk119Value1409);
  apk119Value1437.innerHTML = "\n            <div class=\"chat-checkbox-wrapper\" style=\"display:" + (window.imData.batchSelectMode ? "flex" : "none") + ";width:40px;justify-content:center;align-items:flex-end;padding-bottom:10px;flex-shrink:0;cursor:pointer;transition:all 0.2s;\">\n                <i class=\"far fa-circle chat-checkbox\" data-timestamp=\"" + apk119Value1412 + "\" style=\"color:#c7c7cc;font-size:22px;\"></i>\n            </div>\n            <div style=\"flex:1;display:flex;flex-direction:column;min-width:0;\">\n                " + apk119Value1438 + "\n                <div style=\"display:flex;justify-content:" + (apk119Value1413 ? "flex-end" : "flex-start") + ";align-items:flex-end;width:100%;\">\n                    " + apk119Value1436 + "\n                </div>\n            </div>\n        ";
  const apk119Value1439 = apk119Value1437.querySelector(".chat-link-card"),
    apk119Value1440 = apk119Value1446 => {
      apk119Value1446 && (apk119Value1446.preventDefault(), apk119Value1446.stopPropagation()), handleAction_96(apk119Value1409, apk119Value1410);
    };
  apk119Value1439 && (apk119Value1439.addEventListener("click", apk119Value1440), apk119Value1439.addEventListener("keydown", apk119Value1447 => {
    if (apk119Value1447.key === "Enter" || apk119Value1447.key === " ") apk119Value1440(apk119Value1447);
  }));
  const apk119Value1441 = apk119Value1437.querySelector(".chat-link-card-cover img");
  apk119Value1441 && apk119Value1441.addEventListener("error", () => {
    const apk119Value1448 = apk119Value1441.closest(".chat-link-card-cover");
    if (apk119Value1448) apk119Value1448.innerHTML = "<i class=\"fas fa-link\"></i>";
  }, {
    once: true
  }), apk119Value1411.appendChild(apk119Value1437), window.imChat.scrollToBottom(apk119Value1411);
}
    function getOfflineMeetingSummaryText(msg_25 = {}) {
        const explicitSummary = String(msg_25.summary || '').trim();
        if (explicitSummary) return explicitSummary;
        const rawSummary_2 = String(msg_25.rawSummary || '').trim(),
            rawMatch = rawSummary_2.match(/(?:见面内容|总结)[:：]\s*([\s\S]+)$/);
        if (rawMatch?.[1]?.trim()) return rawMatch[1].trim();
        const contentParts = String(msg_25.content || '')
            .split(/\n\s*\n/)
            .map((part) => part.trim())
            .filter(Boolean);
        if (contentParts.length >= 3)
            return contentParts.slice(2).join(`

`);
        return (
            contentParts.join(`

`) || '暂无见面总结'
        );
    }
    function formatOfflineMeetingTimestamp(timestamp) {
        const value = Number(timestamp) || Date.now();
        const date = new Date(value);
        return window.imDataUtils?.formatUsDateTime
            ? window.imDataUtils.formatUsDateTime(date)
            : date.toLocaleString('en-US', { hour12: true });
    }
    function handleAction_100(element_578, msg_26) {
        element_578.innerHTML =
            `
            <div style="white-space:pre-wrap; word-break:break-word; line-height:1.7; color:#111; font-size:15px;">` +
            escapeHtml(getOfflineMeetingSummaryText(msg_26)) +
            `</div>
        `;
    }
    function handleAction_101(msg_27, friend_34) {
        const sessionId = String(msg_27?.offlineSessionId || ''),
            session =
                sessionId && Array.isArray(friend_34?.offlineMeetingSessions)
                    ? friend_34.offlineMeetingSessions.find(
                          (item_7) => String(item_7?.id || '') === sessionId,
                      )
                    : null;
        if (!session) return msg_27;
        return {
            ...msg_27,
            dateText: msg_27.dateText || session.dateText || '',
            title: msg_27.title || session.title || '',
            summary: msg_27.summary || session.summary || '',
            rawSummary: msg_27.rawSummary || session.rawSummary || '',
            meetingMessages: Array.isArray(session.messages) ? session.messages : [],
        };
    }
    function handleAction_102() {
        let modal_4 = document.getElementById('offline-meeting-detail-modal');
        if (modal_4) return modal_4;
        return (
            (modal_4 = document.createElement('div')),
            (modal_4.id = 'offline-meeting-detail-modal'),
            (modal_4.className =
                'bottom-sheet-overlay detail-sheet-overlay wb-centered-modal-overlay'),
            (modal_4.style.zIndex = '1060'),
            (modal_4.innerHTML = `
            <div class="bottom-sheet wb-centered-modal-card" style="width:min(calc(100% - 40px), 420px); max-height:min(72%, 620px); padding:0; border-radius:24px; background:#fff; display:flex; flex-direction:column; overflow:hidden;">
                <div style="display:flex; align-items:center; justify-content:space-between; padding:17px 18px 14px; border-bottom:1px solid rgba(17,17,17,0.08);">
                    <button id="offline-meeting-detail-close-btn" type="button" style="border:none; background:transparent; color:#007aff; font-size:16px; font-weight:700; cursor:pointer;">关闭</button>
                    <div style="font-size:17px; font-weight:800;">见面总结</div>
                    <button id="offline-meeting-detail-delete-btn" type="button" style="border:none; background:transparent; color:#ff3b30; font-size:16px; font-weight:700; cursor:pointer;">删除</button>
                </div>
                <div id="offline-meeting-detail-content" class="detail-sheet-content" style="flex:1; overflow-y:auto; padding:18px 20px 22px;"></div>
            </div>
        `),
            document.body.appendChild(modal_4),
            modal_4
        );
    }
    window.imChat.openOfflineMeetingDetail = function (value_1039, friend_35 = null) {
        const detailModal = handleAction_102(),
            detailContent = document.getElementById('offline-meeting-detail-content'),
            closeBtn_2 = document.getElementById('offline-meeting-detail-close-btn'),
            deleteBtn_3 = document.getElementById('offline-meeting-detail-delete-btn'),
            detailFriend = friend_35 || window.imData?.currentActiveFriend || null;
        if (!detailModal || !detailContent) return;
        closeBtn_2 &&
            (closeBtn_2.onclick = () => {
                if (window.closeView) window.closeView(detailModal);
                else detailModal.style.display = 'none';
            });
        const detailMessage = handleAction_101(value_1039, detailFriend);
        if (deleteBtn_3) {
            const canDelete =
                !!detailMessage?.offlineSessionId &&
                typeof window.imChat.confirmDeleteOfflineMeetingRecord === 'function';
            deleteBtn_3.style.visibility = canDelete ? 'visible' : 'hidden';
            deleteBtn_3.disabled = !canDelete;
            deleteBtn_3.onclick = () => {
                if (!canDelete) return;
                window.imChat.confirmDeleteOfflineMeetingRecord(
                    detailFriend,
                    detailMessage,
                    deleteBtn_3,
                    {
                        onDeleted: () => {
                            if (window.closeView) window.closeView(detailModal);
                            else detailModal.style.display = 'none';
                        },
                    },
                );
            };
        }
        handleAction_100(detailContent, detailMessage);
        if (window.openView) window.openView(detailModal);
        else detailModal.style.display = 'flex';
    };
    function renderOfflineMeetingRecordBubble_2(
        msg_28,
        friend_36,
        element_582,
        timestamp_13 = Date.now(),
    ) {
        const row_20 = document.createElement('div');
        row_20.className = 'chat-system-row';
        row_20.setAttribute('data-timestamp', timestamp_13);
        row_20.setAttribute('data-message-id', window.imChat.ensureMessageId(msg_28, 'meeting'));
        const dateText_2 = msg_28.dateText || formatOfflineMeetingTimestamp(timestamp_13),
            text_586 = '见面记录';
        row_20.innerHTML =
            `
            <div style="width:100%; display:flex; justify-content:center; padding:2px 0; margin:10px 0;">
                <div class="voice-call-record-card im-card-content offline-meeting-record-card" aria-label="查看见面总结">
                    <div style="width:32px; height:32px; border-radius:16px; background:#34c759; color:#fff; display:flex; justify-content:center; align-items:center; flex-shrink:0;">
                        <i class="fas fa-user-friends"></i>
                    </div>
                    <div style="min-width:0;">
                        <div style="font-size:15px; font-weight:800; line-height:1.25;">` +
            escapeHtml(text_586) +
            `</div>
                        <div style="font-size:12px; color:#8e8e93; margin-top:2px;">` +
            escapeHtml(dateText_2) +
            `</div>
                    </div>
                </div>
            </div>
        `;
        const card_5 = row_20.querySelector('.offline-meeting-record-card');
        if (card_5) {
            card_5.setAttribute('role', 'button');
            card_5.setAttribute('tabindex', '0');
            const openDetail = () => window.imChat.openOfflineMeetingDetail(msg_28, friend_36);
            card_5.addEventListener('click', openDetail);
            card_5.addEventListener('keydown', (event_14) => {
                if (event_14.key !== 'Enter' && event_14.key !== ' ') return;
                event_14.preventDefault();
                openDetail();
            });
        }
        element_582.appendChild(row_20);
        window.imChat.scrollToBottom(element_582);
    }
    window.imChat.renderSystemNoticeBubble = apk110New_43;
    window.imChat.renderUnblockRequestBubble = renderUnblockRequestBubble_2;
    window.imChat.renderMemoryRequestBubble = renderMemoryRequestBubble_3;
    window.imChat.renderLovesUnbindBubble = renderLovesUnbindBubble_2;
    window.imChat.renderTogetherListeningInviteBubble = renderTogetherListeningInviteBubble_2;
    window.imChat.renderContactCardBubble = renderContactCardBubble_2;
    window.imChat.renderUserPhoneAccessCard = renderUserPhoneAccessCard_2;
    window.imChat.renderOfflineInviteBubble = renderOfflineInviteBubble_2;
    window.imChat.openUserPhoneAccessDetail = openUserPhoneAccessDetail_2;
    window.imChat.renderOfflineMeetingRecordBubble = renderOfflineMeetingRecordBubble_2;
    window.imChat.renderGroupRedPacketBubble = renderGroupRedPacketBubble_2;
    window.imChat.renderStickerMessageBubble = renderStickerMessageBubble_2;
    window.imChat.openRecalledMessageDetail = openRecalledMessageDetail_2;
    window.imChat.renderGiftBubble = renderGiftBubble;
    window.imChat.renderMessageBubble = renderMessageBubble_3;
    window.imChat.renderGroupPollBubble = renderGroupPollBubble_2;
    window.imChat.appendMessageToContainer = appendMessageToContainer_3;
    window.imChat.replaceMessageInContainer = replaceMessageInContainer_3;
    window.imChat.removeMessageFromContainer = removeMessageFromContainer_3;
    window.imChat.rerenderChatContainer = rerenderChatContainer_2;
    window.imChat.renderChatHistory = renderChatHistory_2;
    window.imChat.isChatHistoryRenderCurrent = isChatHistoryRenderCurrent_3;
    window.imChat.followOnlineChatBottom = followOnlineChatBottom_2;
    window.imChat.settleOnlineChatAtLatest = settleOnlineChatAtLatest_3;
    window.imChat.scrollOnlineChatToBottomOnce = scrollOnlineChatToBottomOnce_2;
    window.imChat.disposeOnlineChatBottomFollower = disposeOnlineChatBottomFollower_2;
    window.imChat.scrollToBottom = scrollToBottom_3;
    window.imChat.renderTimestamp = renderTimestamp_3;
    window.imChat.renderMessageBubble = renderMessageBubble_3;
    window.imChat.renderCotSummaryCard = renderCotSummaryCard_3;
    window.imChat.renderUserBubble = renderUserBubble_2;
    window.imChat.syncGroupUserAvatarState = syncGroupUserAvatarState_3;
    window.imChat.renderAiBubble = renderAiBubble_2;
    window.imChat.renderImageBubble = renderImageBubble_2;
    window.imChat.renderLocationBubble = renderLocationBubble_2;
    window.imChat.renderFakeLinkBubble = renderFakeLinkBubble_2;
    window.imChat.renderFileBubble = renderFileBubble;
    window.imChat.sanitizeFakeLinkPagePackage = sanitizeFakeLinkPagePackage_3;
    window.imChat.renderFakeLinkWebPage = renderFakeLinkWebPage_2;
    window.imChat.stripFakeLinkHtmlToPlainText = stripFakeLinkHtmlToPlainText_3;
    window.imChat.renderPayTransferBubble = renderPayTransferBubble_2;
    window.imChat.renderVoiceMessageBubble = renderVoiceMessageBubble_2;
    function renderHtmlBubble_2(msg_29, value_588, element_589, value_590 = Date.now()) {
        const invitationStatus = getLovesInvitationStatus(msg_29);
        if (invitationStatus) return renderGiftBubble(msg_29, value_588, element_589, value_590, invitationStatus);
        const value_591 = msg_29.role === 'user';
        const lastElementChild_592 = element_589.lastElementChild;
        let enabled_593 = false;
        if (lastElementChild_592) {
            if (value_591 && lastElementChild_592.classList.contains('user-row')) {
                enabled_593 = true;
                lastElementChild_592.classList.add('has-next');
            } else
                !value_591 &&
                    lastElementChild_592.classList.contains('ai-row') &&
                    ((enabled_593 = true), lastElementChild_592.classList.add('has-next'));
        }
        const row_21 = document.createElement('div');
        row_21.className =
            'chat-row ' +
            (value_591 ? 'user-row' : 'ai-row') +
            ' ' +
            (enabled_593 ? 'has-prev' : '');
        row_21.setAttribute('data-timestamp', value_590);
        row_21.setAttribute('data-message-id', window.imChat.ensureMessageId(msg_29, 'html'));
        handleAction_20(row_21, value_588, msg_29);
        const value_595 = window.imDataUtils.normalizeCurrencySymbols(msg_29.content || msg_29.text || '');
        const handleAction_7_596 = buildMessageHeaderHtml(
            value_591,
            value_588,
            value_590,
            null,
            null,
            enabled_593,
            msg_29,
        );
        const value_597 = new Date(getChatDisplayTimestamp(value_588, value_590));
        const value_601 =
            formatBubbleTime(getChatDisplayTimestamp(value_588, value_590));
        if (value_591) {
            const text_602 = '';
            row_21.innerHTML =
                '\n                <div class="chat-checkbox-wrapper" style="display: ' +
                (window.imData.batchSelectMode ? 'flex' : 'none') +
                '; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">\n                    <i class="far fa-circle chat-checkbox" data-timestamp="' +
                value_590 +
                '" style="color: #c7c7cc; font-size: 22px;"></i>\n                </div>\n                <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">\n                    ' +
                handleAction_7_596 +
                '\n                    <div style="display: flex; justify-content: flex-end; align-items: flex-end; width: 100%;">\n                        <div class="chat-bubble html-bubble im-card-bubble">\n                            ' +
                value_595 +
                '\n                            <div style="position: absolute; bottom: 8px; right: -30px;">' +
                text_602 +
                '</div>\n                        </div>\n                    </div>\n                </div>\n            ';
        } else {
            const text_603 = '';
            row_21.innerHTML =
                '\n                <div class="chat-checkbox-wrapper" style="display: ' +
                (window.imData.batchSelectMode ? 'flex' : 'none') +
                '; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">\n                    <i class="far fa-circle chat-checkbox" data-timestamp="' +
                value_590 +
                '" style="color: #c7c7cc; font-size: 22px;"></i>\n                </div>\n                <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">\n                    ' +
                handleAction_7_596 +
                '\n                    <div style="display: flex; justify-content: flex-start; align-items: flex-end; width: 100%;">\n                        <div class="chat-bubble html-bubble im-card-bubble">\n                            ' +
                value_595 +
                '\n                            <div style="position: absolute; bottom: 8px; right: -25px;">' +
                text_603 +
                '</div>\n                        </div>\n                    </div>\n                </div>\n            ';
        }
        element_589.appendChild(row_21);
        window.imChat.scrollToBottom(element_589);
    }
    function renderVoiceCallRecordBubble_2(
        msg_30,
        friend_37,
        element_606,
        timestamp_14 = Date.now(),
    ) {
        const isSystem = msg_30.role === 'system';
        const isUser_5 =
            msg_30.senderId === (window.imData.currentUser ? window.imData.currentUser.id : 'me') ||
            msg_30.senderId === '__user__' ||
            isSystem;
        if (isSystem && friend_37.type === 'group') {
            const element_621 = document.createElement('div');
            element_621.className = 'chat-system-row';
            element_621.setAttribute('data-timestamp', timestamp_14);
            element_621.setAttribute(
                'data-message-id',
                window.imChat.ensureMessageId(msg_30, 'notice'),
            );
            element_621.innerHTML =
                '\n                <div style="width:100%; display:flex; justify-content:center; padding:2px 0; margin: 10px 0; cursor: pointer;">\n                    <div class="voice-call-record-card im-card-content group-voice-call-record-card">\n                        <i class="fas fa-phone-alt" style="color: #34c759;"></i>\n                        <span>' +
                (msg_30.statusText || '群通话记录') +
                '</span>\n                    </div>\n                </div>\n            ';
            const voiceCallRecordCardElement_622 =
                element_621.querySelector('.voice-call-record-card');
            voiceCallRecordCardElement_622 &&
                voiceCallRecordCardElement_622.addEventListener('click', (event_623) => {
                    event_623.preventDefault();
                    event_623.stopPropagation();
                    window.imChat &&
                        window.imChat.openVoiceCallDetail &&
                        window.imChat.openVoiceCallDetail(msg_30, friend_37);
                });
            element_606.appendChild(element_621);
            window.imChat.scrollToBottom(element_606);
            return;
        }
        const row_22 = document.createElement('div');
        row_22.className = 'chat-row ' + (isUser_5 ? 'user-row' : 'ai-row');
        row_22.setAttribute('data-timestamp', timestamp_14);
        row_22.setAttribute('data-message-id', window.imChat.ensureMessageId(msg_30, 'call'));
        handleAction_20(row_22, friend_37, msg_30);
        const duration_3 = msg_30.duration || 0;
        const padStart_612 = Math.floor(duration_3 / 60)
            .toString()
            .padStart(2, '0');
        const padStart_613 = (duration_3 % 60).toString().padStart(2, '0');
        const detailImageKey_2_2 = padStart_612 + ':' + padStart_613;
        const value_615 = msg_30.isVideo ? 'Video Call' : 'Voice Call';
        const statusText_2 = msg_30.statusText || '通话记录';
        let text_1077 = '';
        statusText_2 === '已拒绝' || statusText_2 === '已取消'
            ? (text_1077 =
                  '<div style="font-size: 13px; color: #ff3b30; margin-top: 2px; font-weight: 500;">' +
                  statusText_2 +
                  '</div>')
            : (text_1077 =
                  '<div style="font-size: 13px; color: #8e8e93; margin-top: 2px;">Duration ' +
                  detailImageKey_2_2 +
                  '</div>');
        const value_618 =
            '\n            <div class="voice-call-record-card im-card-content' +
            (isUser_5 ? ' is-user' : '') +
            '">\n                <div style="width: 32px; height: 32px; border-radius: 16px; background: ' +
            (statusText_2 === '已拒绝' || statusText_2 === '已取消' ? '#ff3b30' : '#34c759') +
            '; color: #fff; display: flex; justify-content: center; align-items: center; flex-shrink: 0;">\n                    <i class="fas fa-phone-alt"></i>\n                </div>\n                <div>\n                    <div style="font-size: 15px; font-weight: 600;">' +
            value_615 +
            '</div>\n                    ' +
            text_1077 +
            '\n                </div>\n            </div>\n        ';
        const value_619 =
            formatBubbleTime(getChatDisplayTimestamp(friend_37, timestamp_14));
        const headerHtml_3 = buildMessageHeaderHtml(
            isUser_5,
            friend_37,
            timestamp_14,
            null,
            null,
            false,
            msg_30,
        );
        if (isUser_5) {
            const text_625 = '';
            row_22.innerHTML =
                '\n                <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">\n                    ' +
                headerHtml_3 +
                '\n                    <div style="display: flex; justify-content: flex-end; align-items: flex-end; width: 100%;">\n                        <div class="chat-bubble user-bubble im-card-bubble voice-call-record-bubble">' +
                value_618 +
                text_625 +
                '</div>\n                    </div>\n                </div>\n            ';
        } else {
            const text_626 = '';
            row_22.innerHTML =
                '\n                <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">\n                    ' +
                headerHtml_3 +
                '\n                    <div style="display: flex; justify-content: flex-start; align-items: flex-end; width: 100%;">\n                        <div class="chat-bubble ai-bubble im-card-bubble voice-call-record-bubble">' +
                value_618 +
                text_626 +
                '</div>\n                    </div>\n                </div>\n            ';
        }
        const voiceCallRecordCardElement = row_22.querySelector('.voice-call-record-card');
        voiceCallRecordCardElement &&
            voiceCallRecordCardElement.addEventListener('click', (event_627) => {
                event_627.preventDefault();
                event_627.stopPropagation();
                window.imChat &&
                    window.imChat.openVoiceCallDetail &&
                    window.imChat.openVoiceCallDetail(msg_30, friend_37);
            });
        element_606.appendChild(row_22);
        window.imChat.scrollToBottom(element_606);
    }
    window.imChat.renderMomentForwardBubble = renderMomentForwardBubble_2;
    window.imChat.renderVoiceCallRecordBubble = renderVoiceCallRecordBubble_2;
    window.imChat.renderHtmlBubble = renderHtmlBubble_2;
    window.addEventListener('account-updated', apk110New_25);
    window.addEventListener('user-state-updated', apk110New_25);
function renderFileBubble(apk119Value1269, apk119Value1270, apk119Value1271, apk119Value1272 = Date.now()) {
  const apk119Value1273 = apk119Value1269.role === "user",
    apk119Value1274 = !apk119Value1273 && apk119Value1270?.["type"] === "group",
    apk119Value1275 = apk119Value1274 ? resolveGroupBubbleIdentity(apk119Value1270, apk119Value1269) : null,
    apk119Value1276 = apk119Value1275?.["name"] || null,
    apk119Value1277 = apk119Value1275?.["avatarUrl"] || null,
    apk119Value1278 = handleAction_18(apk119Value1271, apk119Value1286 => !apk119Value1286.classList.contains("chat-timestamp") && !apk119Value1286.classList.contains("typing-row"));
  let apk119Value1279 = false,
    apk119Value1280 = false;
  if (apk119Value1278) {
    if (apk119Value1273 && apk119Value1278.classList.contains("user-row")) apk119Value1279 = true, apk119Value1278.classList.add("has-next");else {
      if (!apk119Value1273 && apk119Value1278.classList.contains("ai-row")) {
        const apk119Value1287 = apk119Value1278.getAttribute("data-speaker") || null;
        (!apk119Value1274 || apk119Value1287 === apk119Value1276) && (apk119Value1279 = true, apk119Value1280 = apk119Value1274, apk119Value1278.classList.add("has-next"));
      }
    }
  }
  const apk119Value1281 = document.createElement("div");
  apk119Value1281.className = "chat-row " + (apk119Value1273 ? "user-row" : "ai-row") + " " + (apk119Value1279 ? "has-prev" : "") + " " + (apk119Value1274 ? "group-ai-row" : "") + " " + (apk119Value1274 && apk119Value1280 ? "group-ai-row-continuous" : ""), apk119Value1281.setAttribute("data-timestamp", apk119Value1272), apk119Value1281.setAttribute("data-message-id", window.imChat.ensureMessageId(apk119Value1269, "file"));
  if (apk119Value1276) apk119Value1281.setAttribute("data-speaker", apk119Value1276);
  handleAction_22(apk119Value1281, apk119Value1270, apk119Value1269), handleAction_20(apk119Value1281, apk119Value1270, apk119Value1269);
  const apk119Value1282 = "<div class=\"chat-bubble " + (apk119Value1273 ? "user-bubble" : "ai-bubble") + " im-card-bubble im-file-card\" role=\"button\" tabindex=\"0\" aria-label=\"查看文件：" + escapeHtml(apk119Value1269.fileData?.["name"] || "文件") + "\">" + window.imChat.buildFileCardHtml(apk119Value1269) + "</div>";
  let apk119Value1283 = apk119Value1282;
  if (apk119Value1274) {
    const apk119Value1288 = String(apk119Value1276 || "?").trim().charAt(0) || "?",
      apk119Value1289 = apk119Value1277 ? "<img src=\"" + escapeHtml(apk119Value1277) + "\" onerror=\"this.src='assets/moren-thumb.jpg'\" loading=\"lazy\" decoding=\"async\" style=\"width:28px;height:28px;border-radius:50%;object-fit:cover;\">" : "<div class=\"chat-avatar-small\">" + escapeHtml(apk119Value1288) + "</div>";
    apk119Value1283 = "<div class=\"group-ai-bubble-wrap\">\n                " + (apk119Value1280 ? "" : "<div class=\"group-ai-speaker-name\">" + escapeHtml(apk119Value1276) + "</div>") + "\n                <div class=\"group-ai-bubble-row\"><div class=\"group-ai-avatar-slot\">" + (apk119Value1280 ? "<div class=\"group-ai-avatar-placeholder\"></div>" : apk119Value1289) + "</div>" + apk119Value1282 + "</div>\n            </div>";
  }
  const apk119Value1284 = buildMessageHeaderHtml(apk119Value1273, apk119Value1270, apk119Value1272, apk119Value1276, apk119Value1277, apk119Value1279, apk119Value1269);
  apk119Value1281.innerHTML = "\n            <div class=\"chat-checkbox-wrapper\" style=\"display:" + (window.imData.batchSelectMode ? "flex" : "none") + ";width:40px;justify-content:center;align-items:flex-end;padding-bottom:10px;flex-shrink:0;cursor:pointer;transition:all .2s;\">\n                <i class=\"far fa-circle chat-checkbox\" data-timestamp=\"" + apk119Value1272 + "\" style=\"color:#c7c7cc;font-size:22px;\"></i>\n            </div>\n            <div style=\"flex:1;display:flex;flex-direction:column;min-width:0;\">\n                " + apk119Value1284 + "\n                <div style=\"display:flex;justify-content:" + (apk119Value1273 ? "flex-end" : "flex-start") + ";align-items:flex-end;width:100%;\">" + apk119Value1283 + "</div>\n            </div>";
  const apk119Value1285 = apk119Value1281.querySelector(".im-file-card");
  apk119Value1285?.["addEventListener"]("click", () => {
    if (!window.imData.batchSelectMode) window.imChat.openFileDetail(apk119Value1269);
  }), apk119Value1285?.["addEventListener"]("keydown", apk119Value1290 => {
    if (apk119Value1290.key !== "Enter" && apk119Value1290.key !== " ") return;
    apk119Value1290.preventDefault();
    if (!window.imData.batchSelectMode) window.imChat.openFileDetail(apk119Value1269);
  }), apk119Value1271.appendChild(apk119Value1281), window.imChat.scrollToBottom(apk119Value1271);
}
function renderFakeLinkDetailPane(apk119Value1382, apk119Value1383) {
  apk119Value1382.innerHTML = "<div class=\"im-fake-link-page-legacy\"><div class=\"im-fake-link-page-site\"></div><h1 class=\"im-fake-link-page-title\"></h1><p class=\"im-fake-link-page-summary\"></p><div class=\"im-fake-link-page-body\"></div></div><div class=\"im-fake-link-web-host\" hidden></div>";
  const apk119Value1384 = apk119Value1382.querySelector(".im-fake-link-page-legacy"),
    apk119Value1385 = apk119Value1382.querySelector(".im-fake-link-web-host");
  let apk119Value1386 = false;
  if (apk119Value1383.webPage && apk119Value1383.webPage.html && apk119Value1385) try {
    apk119Value1386 = renderFakeLinkWebPage_2(apk119Value1385, apk119Value1383.webPage);
  } catch (apk119Value1388) {
    console.warn("[iMessage fake link] detail render failed, falling back to text view", apk119Value1388), apk119Value1386 = false;
  }
  if (!apk119Value1386 && apk119Value1385) apk119Value1385.innerHTML = "";
  apk119Value1382.classList.toggle("is-webpage", apk119Value1386), apk119Value1382.classList.toggle("is-framed", !!apk119Value1385.querySelector("iframe")), apk119Value1384.hidden = apk119Value1386, apk119Value1385.hidden = !apk119Value1386, apk119Value1382.querySelector(".im-fake-link-page-site").textContent = apk119Value1383.siteName || apk119Value1383.domain || "", apk119Value1382.querySelector(".im-fake-link-page-title").textContent = apk119Value1383.title || apk119Value1383.siteName || "";
  const apk119Value1387 = apk119Value1382.querySelector(".im-fake-link-page-summary");
  apk119Value1387.textContent = apk119Value1383.summary || "", apk119Value1387.hidden = !apk119Value1387.textContent, apk119Value1382.querySelector(".im-fake-link-page-body").textContent = apk119Value1383.bodyText || apk119Value1383.summary || "此链接暂无正文。";
}
function ensureFakeLinkLanguagePane(apk119Value1389, apk119Value1390, apk119Value1391) {
  let apk119Value1392 = apk119Value1390.panes.get(apk119Value1391);
  if (!apk119Value1392) {
    apk119Value1392 = document.createElement("div"), apk119Value1392.className = "im-fake-link-language-pane", apk119Value1392.dataset.language = apk119Value1391, apk119Value1392.setAttribute("aria-hidden", "true"), apk119Value1392.inert = true, apk119Value1389.querySelector(".im-fake-link-page").appendChild(apk119Value1392), renderFakeLinkDetailPane(apk119Value1392, apk119Value1391 === "zh" ? apk119Value1390.data.translation : apk119Value1390.data), apk119Value1390.panes.set(apk119Value1391, apk119Value1392);
    const apk119Value1393 = apk119Value1392.querySelector("iframe");
    apk119Value1392._fakeLinkReady = !apk119Value1393, apk119Value1393?.["addEventListener"]("load", () => {
      apk119Value1392._fakeLinkReady = true;
      if (apk119Value1389._fakeLinkDetail === apk119Value1390 && apk119Value1390.requested === apk119Value1391) switchFakeLinkDetailLanguage(apk119Value1389, apk119Value1391 === "zh");
    }, {
      once: true
    });
  }
  return apk119Value1392;
}
function switchFakeLinkDetailLanguage(apk119Value1394, apk119Value1395) {
  const apk119Value1396 = apk119Value1394._fakeLinkDetail;
  if (!apk119Value1396) return;
  apk119Value1395 = !!(apk119Value1395 && apk119Value1396.data.translation);
  const apk119Value1397 = apk119Value1395 ? "zh" : "original";
  apk119Value1396.requested = apk119Value1397;
  const apk119Value1398 = ensureFakeLinkLanguagePane(apk119Value1394, apk119Value1396, apk119Value1397),
    apk119Value1399 = apk119Value1394.querySelector(".im-fake-link-browser-translate");
  if (apk119Value1395 && !apk119Value1398._fakeLinkReady) {
    apk119Value1399.setAttribute("aria-busy", "true"), apk119Value1399.disabled = true;
    return;
  }
  apk119Value1396.panes.forEach((apk119Value1401, apk119Value1402) => {
    const apk119Value1403 = apk119Value1402 === apk119Value1397;
    apk119Value1401.classList.toggle("is-active", apk119Value1403), apk119Value1401.setAttribute("aria-hidden", String(!apk119Value1403)), apk119Value1401.inert = !apk119Value1403;
  }), apk119Value1396.translated = apk119Value1395, apk119Value1399.setAttribute("aria-busy", "false"), apk119Value1399.disabled = !apk119Value1396.data.translation, apk119Value1399.setAttribute("aria-pressed", String(apk119Value1395));
  const apk119Value1400 = !apk119Value1396.data.translation ? "此链接暂无中文翻译" : apk119Value1395 ? "查看原文" : "查看中文翻译";
  apk119Value1399.setAttribute("aria-label", apk119Value1400), apk119Value1399.title = apk119Value1400;
}
function isImagePlaceholder120(apk120Value929) {
  if (!apk120Value929?.content) return !apk120Value929?.contentAssetId;
  const apk120Value930 = String(apk120Value929.content).split(/[?#]/)[0x0].replace(/^\.?\//, '');
  return [window.imChat.CHAT_IMAGE_PLACEHOLDER_URL, "assets/imessage/chat-image-placeholder.jpg", 'assets/imessage/chat-image-placeholder-512.jpg'].includes(apk120Value930);
}
function canGenerateChatImage120(apk120Value931) {
  if (!apk120Value931 || apk120Value931.type !== "image" || apk120Value931.albumImages?.length) return ![];
  return apk120Value931.imageSource === "generated" || apk120Value931.role === "assistant" && apk120Value931.imageSource !== "real" && isImagePlaceholder120(apk120Value931);
}
function getImageSpeaker120(apk120Value932, apk120Value933) {
  if (apk120Value933?.type !== "group") return apk120Value933;
  const apk120Value934 = [apk120Value932.speakerMemberId, apk120Value932.senderMemberId].find(apk120Value937 => apk120Value937 != null && String(apk120Value937).trim());
  if (apk120Value934 != null) return (window.imData?.friends || []).find(apk120Value938 => (apk120Value938.type === "char" || apk120Value938.type === 'npc') && String(apk120Value938.id) === String(apk120Value934).trim()) || null;
  const apk120Value935 = String(apk120Value932.speaker || apk120Value932.senderName || '').trim().toLowerCase();
  if (!apk120Value935) return null;
  const apk120Value936 = (window.imChat.getGroupMemberFriends?.(apk120Value933) || []).filter(apk120Value939 => [apk120Value939.nickname, apk120Value939.realName].some(apk120Value940 => String(apk120Value940 || '').trim().toLowerCase() === apk120Value935));
  return apk120Value936.length === 0x1 ? apk120Value936[0x0] : null;
}
function openChatImagePrompt120(apk120Value976, apk120Value977, apk120Value978, apk120Value979) {
  const apk120Value980 = window.imApp?.showCustomModal || window.showCustomModal;
  if (!apk120Value980) {
    window.showToast?.("无法打开生图提示词窗口，请刷新后重试");
    return;
  }
  const apk120Value981 = window.imApp?.getFriendById?.(apk120Value977.id) || apk120Value977,
    apk120Value982 = getGeneratedImageRerollInput(apk120Value976, getImageSpeaker120(apk120Value976, apk120Value981)),
    apk120Value983 = document.getElementById("chat-image-detail-overlay"),
    apk120Value984 = (apk120Value985 = apk120Value981, apk120Value986 = apk120Value976) => {
      const apk120Value987 = window.imApp?.getFriendById?.(apk120Value985.id) || apk120Value985,
        apk120Value988 = (apk120Value987.messages || []).find(apk120Value989 => apk120Value986.id ? String(apk120Value989.id) === String(apk120Value986.id) : String(apk120Value989.timestamp) === String(apk120Value986.timestamp));
      if (apk120Value988) openChatImageDetail(apk120Value988, apk120Value987, apk120Value978, apk120Value979);
    };
  if (apk120Value983) apk120Value983.style.display = "none";
  apk120Value980({
    'type': 'prompt',
    'ownerId': "chat-image-" + apk120Value977.id + '-' + (apk120Value976.id || apk120Value978),
    'title': apk120Value976.imageSource === "generated" && !isImagePlaceholder120(apk120Value976) ? "图片重 roll" : "生成图片",
    'textareaLabel': '画面提示词',
    'placeholder': "描述这张图片的主体、动作、场景和构图",
    'defaultValue': apk120Value982.prompt,
    'secondaryTextarea': {
      'label': "正向提示词",
      'placeholder': "基础正向提示词（选填）",
      'defaultValue': apk120Value982.config.basePrompt
    },
    'multiline': !![],
    'autoFocus': ![],
    'confirmText': '开始生成',
    'confirmTone': "dark",
    'generationPrompt': {
      ...apk120Value982.config,
      'showSubjects': !![],
      'showPresets': ![],
      'showAutoGenerate': ![]
    },
    'onCancel': () => apk120Value984(),
    'onConfirm': async (apk120Value990, apk120Value991 = {}) => {
      apk120Value991.setPromptError?.('');
      const apk120Value992 = {
        'prompt': String(apk120Value990 || '').trim(),
        'config': {
          ...apk120Value982.config,
          'basePrompt': String(apk120Value991.secondaryValue ?? '').trim(),
          ...Object.fromEntries(["charAppearance", "userAppearance", "artistPrompt", "negativePrompt"].map(apk120Value993 => [apk120Value993, String(apk120Value991[apk120Value993] ?? '').trim()])),
          ...Object.fromEntries(["includeCharAppearance", "includeUserAppearance", "useCharReferenceFace", "useUserReferenceFace"].map(apk120Value994 => [apk120Value994, apk120Value991[apk120Value994] === !![]]))
        }
      };
      try {
        const {
          updatedFriend: apk120Value995,
          updatedMessage: apk120Value996
        } = await rerollGeneratedChatImage(apk120Value976, apk120Value977, apk120Value992);
        window.showToast?.("图片已生成");
        if (apk120Value991.isCurrent?.() !== ![]) apk120Value984(apk120Value995, apk120Value996);
        return !![];
      } catch (apk120Value997) {
        console.error('[iMessage]\x20Image\x20reroll\x20failed:', apk120Value997);
        const apk120Value998 = handleAction_77(apk120Value997);
        return apk120Value991.setPromptError?.(apk120Value998), window.u2Api?.isRequestError?.(apk120Value997) && window.u2Api.reportError?.(apk120Value997, {
          'operation': "图片重新生成"
        }), ![];
      }
    }
  });
}
const imageGenerationJobs120 = new Set();
});
