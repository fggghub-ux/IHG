(
    window.u2OnStorageReady ||
    ((callback) => document.addEventListener('DOMContentLoaded', callback))
)(() => {
    const { apiConfig: apiConfig_2, userState: userState_2 } = window;
    window.imChat = window.imChat || {};
    const imChat_3 = window.imChat,
        count = 20,
        count_5 = 60,
        HISTORY_LOAD_MORE_USER_ROUNDS = 10,
        renderMessageContextByFriend = new WeakMap(),
        scrollTop_4 = 1000000000,
        count_4 = 72,
        count_6 = 2,
        count_11 = 2,
        count_12 = 1200,
        enabled = true,
        renderMessageContextByFriend_3 = new WeakMap(),
        renderMessageContextByFriend_2 = new WeakMap();
    function escapeHtml(value_4) {
        return String(value_4 == null ? '' : value_4)
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
        if (friend_2?.type === 'group' && window.imApp?.getMessageUserIdentity)
            return window.imApp.getMessageUserIdentity(
                friend_2,
                message_2 || {
                    role: 'user',
                },
            );
        const boundAccount = window.imApp?.getBoundAccountByFriend
                ? window.imApp.getBoundAccountByFriend(friend_2)
                : null,
            source_2 = boundAccount || window.userState || userState_2 || {};
        return {
            name: source_2.name || source_2.realName || source_2.nickname || 'User',
            avatarUrl: source_2.avatarUrl || 'assets/moren-thumb.jpg',
        };
    }
    function syncGroupUserAvatarState_3(friend_3, container_2) {
        if (!container_2) return;
        const enabled_2 = friend_3?.type === 'group' && friend_3.showGroupUserAvatar === true;
        container_2.classList.toggle('show-group-user-avatar', enabled_2);
        if (!enabled_2) {
            container_2.style.removeProperty('--group-user-avatar-image');
            return;
        }
        const avatarUrl_2 = getEffectiveUserProfile(friend_3).avatarUrl || 'assets/moren-thumb.jpg';
        container_2.style.setProperty(
            '--group-user-avatar-image',
            'url(' + JSON.stringify(String(avatarUrl_2)) + ')',
        );
    }
    function decorateMessageRowAvatar(row_2, friend_4, message_3 = {}) {
        if (
            !row_2 ||
            friend_4?.type === 'group' ||
            row_2.querySelector(':scope > .im-message-avatar')
        )
            return row_2;
        if (
            message_3.type === 'system_notice' ||
            message_3.type === 'memory_request' ||
            row_2.classList.contains('chat-system-row') ||
            row_2.classList.contains('typing-row')
        )
            return row_2;
        const isUser_2 = message_3.role === 'user' || row_2.classList.contains('user-row');
        let profile;
        isUser_2
            ? (profile = getEffectiveUserProfile(friend_4, message_3))
            : (profile = {
                  name: friend_4?.nickname || friend_4?.realName || 'AI',
                  avatarUrl: friend_4?.avatarUrl || 'assets/moren-thumb.jpg',
              });
        const avatar = document.createElement('span');
        return (
            (avatar.className = 'im-message-avatar ' + (isUser_2 ? 'is-user' : 'is-assistant')),
            avatar.setAttribute('aria-hidden', 'true'),
            (avatar.dataset.messageRole = isUser_2 ? 'user' : 'assistant'),
            (avatar.innerHTML =
                '<img src="' +
                escapeHtml(profile.avatarUrl || 'assets/moren-thumb.jpg') +
                '" alt="" loading="lazy" decoding="async" onerror="this.src=\'assets/moren-thumb.jpg\'">'),
            row_2.appendChild(avatar),
            row_2
        );
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
        const messageId_2 = String(message_4?.id || ''),
            row_3 = handleAction_18(
                value_127,
                (candidate) =>
                    candidate.classList?.contains('chat-row') &&
                    (!messageId_2 ||
                        String(candidate.getAttribute('data-message-id') || '') === messageId_2),
            );
        if (row_3) decorateMessageRowAvatar(row_3, friend_5, message_4);
        return true;
    }
    function handleAction_20(
        row_4,
        friend_6,
        message_5 = renderMessageContextByFriend.get(friend_6),
    ) {
        if (!row_4 || friend_6?.type !== 'group' || message_5?.role !== 'user') return;
        const profile_2 = getEffectiveUserProfile(friend_6, message_5);
        row_4.setAttribute('data-user-account-id', profile_2.accountId || '');
        row_4.style.setProperty(
            '--group-user-avatar-image',
            'url(' + JSON.stringify(String(profile_2.avatarUrl || 'assets/moren-thumb.jpg')) + ')',
        );
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
        direction_2 === 'char_to_user'
            ? ((payerName_2 = payerName_2 || msg_3.senderName || targetName_2 || charName_2),
              (payeeName_2 = payeeName_2 || msg_3.receiverName || userName))
            : ((payerName_2 = payerName_2 || msg_3.senderName || userName),
              (payeeName_2 =
                  payeeName_2 ||
                  msg_3.receiverName ||
                  (targetName_2 && targetName_2 !== userName ? targetName_2 : charName_2)));
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
    function buildMessageHeaderHtml(
        value_44,
        friend_10,
        value_46,
        speakerName_3,
        speakerAvatar,
        hasPrev,
        message_6 = null,
    ) {
        if (!friend_10 || !friend_10.showAvatar || hasPrev) return '';
        const date = new Date(value_46),
            dateStr = date.toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
            }),
            ampmTimeStr = date.toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            });
        if (value_44) {
            const effectiveUserProfile_164 = getEffectiveUserProfile(
                    friend_10,
                    message_6 || renderMessageContextByFriend.get(friend_10),
                ),
                name_54 = effectiveUserProfile_164.name,
                avatarUrl_55 = effectiveUserProfile_164.avatarUrl;
            return (
                `
                <div class="chat-message-header user-header" style="display: flex; justify-content: flex-end; width: 100%; margin-bottom: 4px; padding-right: 0px; align-items: flex-start;">
                    <div class="chat-header-info" style="display: flex; flex-direction: column; align-items: flex-end; justify-content: center; padding-right: 25px; margin-bottom: 0px; margin-right: -20px; padding-bottom: 0px;">
                        <div class="chat-header-name" style="font-size: 14px; font-weight: 600; color: #333; margin-bottom: 2px;">` +
                name_54 +
                `</div>
                        <div class="chat-header-date" style="font-size: 12px; color: #888;">` +
                dateStr +
                ' ' +
                ampmTimeStr +
                `</div>
                    </div>
                    <div class="chat-header-avatar" style="width: 44px; height: 44px; border-radius: 50%; overflow: hidden; border: 1px solid #eee; z-index: 2; background: #fff; flex-shrink: 0;">
                        <img src="` +
                avatarUrl_55 +
                `" onerror="this.src='assets/moren-thumb.jpg'" loading="lazy" decoding="async" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </div>
            `
            );
        } else {
            const aiName = speakerName_3 || friend_10.nickname || friend_10.realName || 'AI',
                aiAvatar = speakerAvatar || friend_10.avatarUrl || 'assets/moren-thumb.jpg';
            return (
                `
                <div class="chat-message-header ai-header" style="display: flex; justify-content: flex-start; width: 100%; margin-bottom: 4px; padding-left: 0px; align-items: flex-start;">
                    <div class="chat-header-avatar" style="width: 44px; height: 44px; border-radius: 50%; overflow: hidden; border: 1px solid #eee; z-index: 2; background: #fff; flex-shrink: 0;">
                        <img src="` +
                aiAvatar +
                `" onerror="this.src='assets/moren-thumb.jpg'" loading="lazy" decoding="async" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="chat-header-info" style="display: flex; flex-direction: column; align-items: flex-start; justify-content: center; padding-left: 25px; margin-bottom: 0px; margin-left: -20px; padding-bottom: 0px;">
                        <div class="chat-header-name" style="font-size: 14px; font-weight: 600; color: #333; margin-bottom: 2px;">` +
                aiName +
                `</div>
                        <div class="chat-header-date" style="font-size: 12px; color: #888;">` +
                dateStr +
                ' ' +
                ampmTimeStr +
                `</div>
                    </div>
                </div>
            `
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
    function renderSystemNoticeBubble_2(msg_6, friend_11, container_3, value_147 = Date.now()) {
        const row_6 = document.createElement('div');
        row_6.className = 'chat-system-row';
        row_6.setAttribute('data-timestamp', value_147);
        row_6.setAttribute('data-message-id', window.imChat.ensureMessageId(msg_6, 'notice'));
        const noticeKind_2 = msg_6.noticeKind || '',
            noticeText = msg_6.text || msg_6.content || '系统提示';
        if (noticeKind_2 === 'user_phone_access' || noticeKind_2 === 'user_remark_changed')
            return (
                row_6.classList.add('user-phone-access-notice-row'),
                (row_6.innerHTML =
                    '<div class="user-phone-access-notice-pill" role="status">' +
                    escapeHtml(noticeText) +
                    '</div>'),
                container_3.appendChild(row_6),
                window.imChat.scrollToBottom(container_3),
                row_6
            );
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
                `
                <div class="chat-block-status-pill">
                    <span>` +
                escapeHtml(noticeText) +
                `</span>
                    ` +
                (value_293_2
                    ? '<button type="button" class="chat-block-request-link">请求解除</button>'
                    : '') +
                `
                </div>
            `;
            const chatBlockRequestLinkElement = row_6.querySelector('.chat-block-request-link');
            return (
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
                }),
                container_3.appendChild(row_6),
                window.imChat.scrollToBottom(container_3),
                row_6
            );
        }
        if (noticeKind_2 === 'message_recalled') {
            const isUserRecall = msg_6.actorRole === 'user',
                actorName_2 = String(
                    msg_6.actorName || friend_11?.nickname || friend_11?.realName || '对方',
                ).trim(),
                value_300_2 = isUserRecall ? '你撤回了一条消息' : actorName_2 + '撤回了一条消息',
                recalledContent_2 = !isUserRecall
                    ? String(msg_6.payload?.recalledContent || '').trim()
                    : '',
                recalledTranslation_2 = !isUserRecall
                    ? String(msg_6.payload?.recalledTranslation || '').trim()
                    : '';
            row_6.innerHTML =
                `
                <div class="message-recalled-notice">
                    <span>` +
                escapeHtml(value_300_2) +
                '</span>' +
                (recalledContent_2 ? '<span class="message-recalled-view-link">查看</span>' : '') +
                `
                </div>
            `;
            const viewLink = row_6.querySelector('.message-recalled-view-link');
            return (
                viewLink &&
                    viewLink.addEventListener('click', (event_5) => {
                        event_5.preventDefault();
                        event_5.stopPropagation();
                        openRecalledMessageDetail_2(recalledContent_2, recalledTranslation_2);
                    }),
                container_3.appendChild(row_6),
                window.imChat.scrollToBottom(container_3),
                row_6
            );
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
                mcp_tool_success: {
                    icon: 'fa-check',
                    color: '#34c759',
                },
            },
            iconMeta = iconMap[noticeKind_2] || {
                icon: 'fa-info-circle',
                color: '#8e8e93',
            },
            textAlign = noticeKind_2 === 'narration' ? 'left' : 'center',
            value_292_2 =
                noticeKind_2 === 'group_friend_private_chat'
                    ? '<span>' +
                      escapeHtml(noticeText) +
                      '</span><span class="group-private-chat-view-link">查看</span>'
                    : '<span>' + escapeHtml(noticeText) + '</span>';
        row_6.innerHTML =
            `
            <div style="width:100%; display:flex; justify-content:center; padding:2px 0; margin:10px 0;">
                <div class="voice-call-record-card im-card-content system-notice-card system-notice-` +
            escapeHtml(noticeKind_2 || 'default') +
            '" style="max-width:80%; padding:10px 16px; border-radius:18px; background:rgba(0,0,0,0.05); color:#000; font-size:13px; line-height:1.4; text-align:' +
            textAlign +
            '; display:flex; align-items:flex-start; gap:8px; white-space:pre-wrap; word-break:break-word; ' +
            (noticeKind_2 === 'narration' ? 'cursor:pointer;' : '') +
            `">
                    <i class="fas ` +
            iconMeta.icon +
            '" style="color:' +
            iconMeta.color +
            `; line-height:1.4; flex-shrink:0;"></i>
                    <span style="display:inline-flex; align-items:center; flex-wrap:wrap; justify-content:center;">` +
            value_292_2 +
            `</span>
                </div>
            </div>
        `;
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
        const isUser_3 = msg_7.role === 'user',
            isGroupMessage = friend_13.type === 'group' && !isUser_3,
            groupBubbleIdentity = resolveGroupBubbleIdentity(friend_13, msg_7),
            name_166 = groupBubbleIdentity.name,
            avatarUrl_167 = groupBubbleIdentity.avatarUrl,
            lastElementChild_168 = element_351.lastElementChild;
        let enabled_169 = false,
            enabled_170 = false;
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
        const totalAmount_2 = Number(msg_7.totalAmount) || 0,
            packetCount_2 = parseInt(msg_7.packetCount, 10) || 0,
            claimedCount = Array.isArray(msg_7.claimRecords) ? msg_7.claimRecords.length : 0,
            value_365_2 = msg_7.currentUserClaimed
                ? '已领取 · ' + claimedCount + '/' + packetCount_2
                : msg_7.isFinished
                  ? claimedCount + '/' + packetCount_2 + ' 已领取'
                  : '点击领取红包',
            value_366_2 =
                `
            <div class="group-red-packet-card im-card-content" style="width:100%; min-width:0; max-width:268px; border-radius:18px; padding:12px 14px; background:#fff; color:#111;  border:1px solid rgba(0,0,0,0.08); cursor:pointer;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="width:40px; height:40px; border-radius:14px; background:#111; color:#fff; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0;">
                        <i class="fas fa-gift"></i>
                    </div>
                    <div style="min-width:0; flex:1;">
                        <div style="font-size:15px; font-weight:800; color:#111; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">` +
                (msg_7.description || '恭喜发财') +
                `</div>
                        <div style="font-size:12px; color:#8e8e93; margin-top:4px;">` +
                value_365_2 +
                `</div>
                    </div>
                </div>
                <div style="margin-top:10px; font-size:26px; font-weight:800; color:#111; letter-spacing:0.2px;">¥` +
                totalAmount_2.toFixed(2) +
                `</div>
            </div>
        `,
            value_187 =
                typeof window.formatChatBubbleTime === 'function'
                    ? window.formatChatBubbleTime(value_163)
                    : (() => {
                          const value_191 = new Date(value_163);
                          return (
                              value_191.getHours() +
                              ':' +
                              value_191.getMinutes().toString().padStart(2, '0')
                          );
                      })(),
            handleAction_7_188 = buildMessageHeaderHtml(
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
                `
                <div class="chat-checkbox-wrapper" style="display: ` +
                (window.imData.batchSelectMode ? 'flex' : 'none') +
                `; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">
                    <i class="far fa-circle chat-checkbox" data-timestamp="` +
                value_163 +
                `" style="color: #c7c7cc; font-size: 22px;"></i>
                </div>
                <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">
                    ` +
                handleAction_7_188 +
                `
                    <div style="display: flex; justify-content: flex-end; align-items: flex-end; width: 100%;">
                        <div class="chat-bubble user-bubble im-card-bubble pay-transfer-bubble group-red-packet-bubble" style="padding:6px;">` +
                value_366_2 +
                text_192 +
                `</div>
                    </div>
                </div>
            `;
        } else {
            const text_372 = '';
            let text_373 = '';
            if (isGroupMessage) {
                const value_195 = String(name_166).trim().charAt(0) || '?',
                    value_196 = avatarUrl_167
                        ? '<img src="' +
                          avatarUrl_167 +
                          '" onerror="this.src=\'assets/moren-thumb.jpg\'" loading="lazy" decoding="async" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;">'
                        : '<div class="chat-avatar-small">' + value_195 + '</div>';
                text_373 =
                    `
                    <div class="group-ai-bubble-wrap">
                        ` +
                    (enabled_170
                        ? ''
                        : '<div class="group-ai-speaker-name">' + name_166 + '</div>') +
                    `
                        <div class="group-ai-bubble-row">
                            <div class="group-ai-avatar-slot">` +
                    (enabled_170 ? '<div class="group-ai-avatar-placeholder"></div>' : value_196) +
                    `</div>
                            <div class="chat-bubble ai-bubble im-card-bubble pay-transfer-bubble group-red-packet-bubble" style="padding:6px;">` +
                    value_366_2 +
                    text_372 +
                    `</div>
                        </div>
                    </div>
                `;
            } else
                text_373 =
                    '<div class="chat-bubble ai-bubble im-card-bubble pay-transfer-bubble group-red-packet-bubble" style="padding:6px;">' +
                    value_366_2 +
                    text_372 +
                    '</div>';
            row_7.innerHTML =
                `
                <div class="chat-checkbox-wrapper" style="display: ` +
                (window.imData.batchSelectMode ? 'flex' : 'none') +
                `; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">
                    <i class="far fa-circle chat-checkbox" data-timestamp="` +
                value_163 +
                `" style="color: #c7c7cc; font-size: 22px;"></i>
                </div>
                <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">
                    ` +
                handleAction_7_188 +
                `
                    <div style="display: flex; justify-content: flex-start; align-items: flex-end; width: 100%;">
                        ` +
                text_373 +
                `
                    </div>
                </div>
            `;
        }
        const clickableBubble = row_7.querySelector('.group-red-packet-card');
        clickableBubble &&
            clickableBubble.addEventListener('click', (event_376) => {
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
            });
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
                                    avatarUrl_3 =
                                        vote_3?.voterAvatarUrl ||
                                        member_3?.avatarUrl ||
                                        profile_3?.avatarUrl ||
                                        'assets/moren-thumb.jpg';
                                return (
                                    '<span class="group-poll-voter"><img src="' +
                                    escapeHtml(avatarUrl_3) +
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
            <div style="flex:1;display:flex;justify-content:flex-end;min-width:0;">
                <div class="chat-bubble user-bubble im-card-bubble" style="padding:0;background:transparent;">
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
                true
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
            return (
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
                ),
                handleAction_19(msg_10, friend_16, container_6)
            );
        }
        return false;
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
        const messages_4 = Array.isArray(friend_18?.messages) ? friend_18.messages : [],
            lastMessage = messages_4[messages_4.length - 1] || null,
            recallPresentation_2 = friend_18?.memory?.recallPresentation || null;
        return [
            String(friend_18?.id ?? ''),
            messages_4.length,
            String(lastMessage?.id ?? ''),
            Number(lastMessage?.timestamp) || 0,
            String(lastMessage?.content ?? lastMessage?.text ?? ''),
            lastMessage?.showTranslation ? 1 : 0,
            friend_18?.showTimestamp ? 1 : 0,
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
        const msgTime_2 = msg_13.timestamp || Date.now(),
            handleAction_18_559 = handleAction_18(
                container_12,
                (row_10) =>
                    row_10.classList.contains('chat-row') &&
                    Number(row_10.getAttribute('data-timestamp')) > 0,
            ),
            value_560 = Number(handleAction_18_559?.getAttribute('data-timestamp')) || 0;
        (!value_560 || msgTime_2 - value_560 > 300000) &&
            window.imChat.renderTimestamp(msgTime_2, container_12);
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
        return (
            rendered && value_556.scroll !== false && window.imChat.scrollToBottom(container_12),
            rendered
        );
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
        const messages_5 = Array.isArray(friend_25.messages) ? friend_25.messages : [],
            handleAction_48_589 = handleAction_48(friend_25, container_15, messages_5, value_586);
        let count_590 = 0;
        const recallPresentation_3 = friend_25.memory?.recallPresentation || null,
            recallApiRunId = String(recallPresentation_3?.apiRunId || ''),
            triggerUserMessageId_2 = String(recallPresentation_3?.triggerUserMessageId || ''),
            triggerMessageExists =
                !triggerUserMessageId_2 ||
                messages_5.some(
                    (message_7) =>
                        message_7?.role === 'user' &&
                        String(message_7.id || '') === triggerUserMessageId_2,
                ),
            recallAnchorMessage =
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
                        window.imChat.ensureMessageId(
                            message_597,
                            message_597.type === 'pay_transfer' ? 'pay' : 'msg',
                        );
                        const value_598 = message_597.timestamp || 0;
                        value_598 - count_590 > 300000 &&
                            (window.imChat.renderTimestamp(value_598, container_15),
                            (count_590 = value_598));
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
    }
    function scrollToBottom_3(value_599, value_600 = {}) {
        followOnlineChatBottom_2(value_599, value_600);
    }
    function renderTimestamp_3(timestamp_4, element_602) {
        if (!timestamp_4) return;
        const div = document.createElement('div');
        div.className = 'chat-timestamp';
        let timeStr = window.imApp.formatTime ? window.imApp.formatTime(timestamp_4) : '';
        div.innerHTML = '<span>' + timeStr + '</span>';
        element_602.appendChild(div);
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
            },
            headerHtml = buildMessageHeaderHtml(
                true,
                friend_26,
                timestamp_5,
                null,
                null,
                hasPrev_2,
                userMessage,
            ),
            element_618 = document.createElement('div');
        element_618.className = 'chat-row user-row ' + (hasPrev_2 ? 'has-prev' : '');
        element_618.setAttribute('data-timestamp', timestamp_5);
        element_618.setAttribute(
            'data-message-id',
            value_232 || window.imChat.createMessageId('msg'),
        );
        handleAction_20(element_618, friend_26, userMessage);
        let text_619 = '';
        value_608_2 &&
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
            typeof window.formatChatBubbleTime === 'function'
                ? window.formatChatBubbleTime(timestamp_5)
                : (() => {
                      const value_242 = new Date(timestamp_5);
                      return (
                          value_242.getHours() +
                          ':' +
                          value_242.getMinutes().toString().padStart(2, '0')
                      );
                  })();
        text_619 +=
            '<span class="bubble-meta"><span class="bubble-time">' +
            value_620 +
            '</span><i class="fas fa-check bubble-read-icon"></i></span>';
        element_618.innerHTML =
            `
            <div class="chat-checkbox-wrapper" style="display: ` +
            (window.imData.batchSelectMode ? 'flex' : 'none') +
            `; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">
                <i class="far fa-circle chat-checkbox" data-timestamp="` +
            timestamp_5 +
            `" style="color: #c7c7cc; font-size: 22px;"></i>
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">
                ` +
            headerHtml +
            `
                <div style="display: flex; justify-content: flex-end; align-items: flex-end; width: 100%;">
                    ` +
            (userMessage.deliveryStatus === 'blocked'
                ? '<i class="fas fa-exclamation-circle chat-delivery-failed is-user" aria-label="发送失败"></i>'
                : '') +
            `
                    <div class="chat-bubble user-bubble">` +
            text_619 +
            `</div>
                </div>
            </div>
        `;
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
            ),
            isGroupMessage_2 = friend_27.type === 'group' && !!speakerName_5;
        let hasPrev_3 = false,
            enabled_640 = false;
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
        value_628 &&
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
            typeof window.formatChatBubbleTime === 'function'
                ? window.formatChatBubbleTime(timestamp_6)
                : (() => {
                      const value_274 = new Date(timestamp_6);
                      return (
                          value_274.getHours() +
                          ':' +
                          value_274.getMinutes().toString().padStart(2, '0')
                      );
                  })();
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
            const value_275 = String(speakerName_5).trim().charAt(0) || '?',
                value_276 = speakerAvatar_3
                    ? '<img src="' +
                      speakerAvatar_3 +
                      '" onerror="this.src=\'assets/moren-thumb.jpg\'" loading="lazy" decoding="async" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;">'
                    : '<div class="chat-avatar-small">' + value_275 + '</div>';
            text_645 =
                `
                    <div class="group-ai-bubble-wrap">
                    ` +
                (enabled_640
                    ? ''
                    : '<div class="group-ai-speaker-name">' + speakerName_5 + '</div>') +
                `
                    <div class="group-ai-bubble-row">
                        <div class="group-ai-avatar-slot">` +
                (enabled_640 ? '<div class="group-ai-avatar-placeholder"></div>' : value_276) +
                `</div>
                        <div class="chat-bubble ai-bubble">` +
                text_642 +
                `</div>
                    </div>
                </div>
            `;
        } else text_645 = '<div class="chat-bubble ai-bubble">' + text_642 + '</div>';
        row_12.innerHTML =
            `
            <div class="chat-checkbox-wrapper" style="display: ` +
            (window.imData.batchSelectMode ? 'flex' : 'none') +
            `; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">
                <i class="far fa-circle chat-checkbox" data-timestamp="` +
            timestamp_6 +
            `" style="color: #c7c7cc; font-size: 22px;"></i>
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">
                ` +
            headerHtml_2 +
            `
                <div style="display: flex; justify-content: flex-start; align-items: flex-end; width: 100%;">
                    ` +
            text_645 +
            `
                    ` +
            (value_262?.deliveryStatus === 'blocked'
                ? '<i class="fas fa-exclamation-circle chat-delivery-failed is-char" aria-label="发送失败"></i>'
                : '') +
            `
                </div>
            </div>
        `;
        element_245.appendChild(row_12);
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
    function getGeneratedImageRerollInput(msg_15, friend_28) {
        const currentConfig =
                friend_28?.imagePromptConfig && typeof friend_28.imagePromptConfig === 'object'
                    ? friend_28.imagePromptConfig
                    : {},
            savedConfig =
                msg_15?.imageGenerationConfig && typeof msg_15.imageGenerationConfig === 'object'
                    ? msg_15.imageGenerationConfig
                    : null,
            scenePrompt = String(
                msg_15?.imageGenerationPrompt || msg_15?.description || msg_15?.text || '',
            ).trim(),
            basePrompt_2 = savedConfig
                ? String(savedConfig.basePrompt || '').trim()
                : String(currentConfig.basePrompt || currentConfig.lastPrompt || '').trim(),
            prompt_3 = scenePrompt;
        return {
            prompt: prompt_3,
            config: {
                basePrompt: basePrompt_2,
                charAppearance: String(
                    savedConfig?.charAppearance ?? currentConfig.charAppearance ?? '',
                ).trim(),
                userAppearance: String(
                    savedConfig?.userAppearance ?? currentConfig.userAppearance ?? '',
                ).trim(),
                artistPrompt: String(
                    savedConfig?.artistPrompt ?? currentConfig.artistPrompt ?? '',
                ).trim(),
                negativePrompt: String(
                    savedConfig?.negativePrompt ?? currentConfig.negativePrompt ?? '',
                ).trim(),
                includeCharAppearance: savedConfig?.includeCharAppearance !== false,
                includeUserAppearance: savedConfig?.includeUserAppearance !== false,
                useReferenceFace: savedConfig
                    ? savedConfig.useReferenceFace === true
                    : msg_15?.faceReferenceUsed === true ||
                      currentConfig.autoUseReferenceFace === true,
            },
        };
    }
    async function rerollGeneratedChatImage(msg_16, friend_29) {
        if (!msg_16 || msg_16.imageSource !== 'generated' || !friend_29?.id)
            throw new Error('这张图片不支持重新生成');
        const liveFriend =
                window.imApp?.getFriendById?.(friend_29.id) ||
                (window.imData?.friends || []).find(
                    (item_3) => String(item_3.id) === String(friend_29.id),
                ) ||
                friend_29,
            { prompt: prompt_2, config: config_2 } = getGeneratedImageRerollInput(
                msg_16,
                liveFriend,
            );
        if (!prompt_2) throw new Error('这张图片没有可复用的生成提示词');
        const referenceImage_2 = config_2.useReferenceFace
                ? await window.imChat.resolveAutoImageReferenceFace(liveFriend, {
                      force: true,
                  })
                : '',
            result_3 = await window.imChat.generateChatImage(prompt_2, liveFriend, {
                referenceImage: referenceImage_2,
                basePrompt: config_2.basePrompt,
                charAppearance: config_2.charAppearance,
                userAppearance: config_2.userAppearance,
                artistPrompt: config_2.artistPrompt,
                negativePrompt: config_2.negativePrompt,
                includeCharAppearance: config_2.includeCharAppearance,
                includeUserAppearance: config_2.includeUserAppearance,
            }),
            trim_676 = String(msg_16.contentAssetId || '').trim(),
            descriptor_5 = {
                id: msg_16.id || null,
                timestamp: msg_16.timestamp || null,
            },
            saved_4 = await window.imApp.updateFriendMessage(
                friend_29.id,
                descriptor_5,
                (targetMsg_3) => {
                    targetMsg_3.content = result_3.imageUrl;
                    targetMsg_3.contentAssetId = '';
                    targetMsg_3.imageSource = 'generated';
                    targetMsg_3.imageProvider = result_3.provider || '';
                    targetMsg_3.imageModel = result_3.model || '';
                    targetMsg_3.imageSize = result_3.size || '';
                    targetMsg_3.faceReferenceUsed = !!result_3.faceReferenceUsed;
                    targetMsg_3.imageGenerationPrompt = prompt_2;
                    targetMsg_3.imageGenerationConfig = config_2;
                    targetMsg_3.imageGenerationCompiledPrompt = result_3.compiledPrompt || '';
                    targetMsg_3.imageRerollCount =
                        Math.max(0, Number(targetMsg_3.imageRerollCount) || 0) + 1;
                    targetMsg_3.imageRerolledAt = Date.now();
                },
                {
                    silent: true,
                },
            );
        if (!saved_4) throw new Error('新图片保存失败');
        const updatedFriend_4 = window.imApp?.getFriendById?.(friend_29.id) || liveFriend,
            updatedMessage_2 =
                (updatedFriend_4.messages || []).find((item_4) => {
                    if (descriptor_5.id && item_4?.id)
                        return String(item_4.id) === String(descriptor_5.id);
                    return (
                        descriptor_5.timestamp &&
                        String(item_4?.timestamp || '') === String(descriptor_5.timestamp)
                    );
                }) || msg_16,
            trim_681 = String(updatedMessage_2.contentAssetId || '').trim();
        trim_676 &&
            trim_676 !== trim_681 &&
            (await window.appStorage?.markAssetOrphaned?.(trim_676)['catch'](() => undefined));
        const page = document.getElementById('chat-interface-' + friend_29.id),
            container_16 = page?.querySelector('.ins-chat-messages');
        if (container_16) {
            const row_13 = Array.from(container_16.querySelectorAll('.chat-row')).find((item_5) => {
                    if (descriptor_5.id && item_5.dataset.messageId)
                        return String(item_5.dataset.messageId) === String(descriptor_5.id);
                    return (
                        descriptor_5.timestamp &&
                        String(item_5.dataset.timestamp || '') === String(descriptor_5.timestamp)
                    );
                }),
                image = row_13?.querySelector('.chat-image-bubble-img');
            if (image && updatedMessage_2.content) image.src = updatedMessage_2.content;
        }
        return {
            updatedFriend: updatedFriend_4,
            updatedMessage: updatedMessage_2,
        };
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
    function openChatImageDetail(msg_17, friend_30, timestamp_9, senderName_2, value_281 = 0) {
        let overlay_3 = document.getElementById('chat-image-detail-overlay');
        !overlay_3 &&
            ((overlay_3 = document.createElement('div')),
            (overlay_3.id = 'chat-image-detail-overlay'),
            (overlay_3.className = 'chat-image-detail-overlay'),
            (overlay_3.innerHTML = `
                <div class="chat-image-detail-card">
                    <div class="chat-image-detail-header">
                        <div class="chat-image-detail-heading">
                            <div class="chat-image-detail-sender"></div>
                            <div class="chat-image-detail-time"></div>
                        </div>
                        <div class="chat-image-detail-actions">
                            <button type="button" class="chat-image-detail-reroll"><i class="fas fa-redo"></i> 重 roll</button>
                            <button type="button" class="chat-image-detail-save">保存</button>
                            <button type="button" class="chat-image-detail-close" aria-label="关闭"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                    <div class="chat-image-detail-media">
                        <button type="button" class="chat-image-detail-prev" aria-label="上一张图片">‹</button>
                        <img class="chat-image-detail-img" src="" alt="">
                        <button type="button" class="chat-image-detail-next" aria-label="下一张图片">›</button>
                        <span class="chat-image-detail-counter" aria-live="polite"></span>
                    </div>
                    <div class="chat-image-detail-reroll-error" role="alert" aria-live="assertive"></div>
                    <div class="chat-image-detail-copy">
                        <div class="chat-image-detail-label">图片详情</div>
                        <div class="chat-image-detail-desc" style="font-size:15px; color:#222; line-height:1.55; white-space:pre-wrap; word-break:break-word;"></div>
                    </div>
                </div>
            `),
            document.body.appendChild(overlay_3),
            overlay_3.addEventListener('click', (event_9) => {
                (event_9.target === overlay_3 ||
                    event_9.target.closest('.chat-image-detail-close')) &&
                    (overlay_3.style.display = 'none');
            }));
        const imageEl = overlay_3.querySelector('.chat-image-detail-img'),
            chatImageDetailCardElement = overlay_3.querySelector('.chat-image-detail-card'),
            chatImageDetailHeaderElement = overlay_3.querySelector('.chat-image-detail-header'),
            chatImageDetailMediaElement = overlay_3.querySelector('.chat-image-detail-media'),
            chatImageDetailCopyElement = overlay_3.querySelector('.chat-image-detail-copy'),
            senderEl = overlay_3.querySelector('.chat-image-detail-sender'),
            timeEl = overlay_3.querySelector('.chat-image-detail-time'),
            descEl = overlay_3.querySelector('.chat-image-detail-desc'),
            rerollErrorEl = overlay_3.querySelector('.chat-image-detail-reroll-error'),
            rerollButton = overlay_3.querySelector('.chat-image-detail-reroll'),
            saveButton = overlay_3.querySelector('.chat-image-detail-save'),
            chatImageDetailPrevElement = overlay_3.querySelector('.chat-image-detail-prev'),
            chatImageDetailNextElement = overlay_3.querySelector('.chat-image-detail-next'),
            chatImageDetailCounterElement = overlay_3.querySelector('.chat-image-detail-counter'),
            date_3 = new Date(timestamp_9 || msg_17.timestamp || Date.now()),
            textContent_4 =
                typeof window.formatChatBubbleTime === 'function'
                    ? window.formatChatBubbleTime(timestamp_9 || msg_17.timestamp || Date.now())
                    : date_3.getHours() + ':' + date_3.getMinutes().toString().padStart(2, '0'),
            imageUrl_3 = msg_17.content || window.imChat.CHAT_IMAGE_PLACEHOLDER_URL || '',
            value_284 = 1 + (Array.isArray(msg_17.albumImages) ? msg_17.albumImages.length : 0);
        let imageUrl_3_2 = Math.min(value_284 - 1, Math.max(0, Number(value_281) || 0));
        const isGeneratedImage =
                msg_17.imageSource === 'generated' &&
                imageUrl_3 !== (window.imChat.CHAT_IMAGE_PLACEHOLDER_URL || ''),
            messageKey_2 = String(msg_17.id || timestamp_9 || msg_17.timestamp || '');
        let detailImageKey_2 = messageKey_2 + ':' + imageUrl_3_2;
        const value_699 = () => {
                if (
                    !imageEl?.naturalWidth ||
                    !imageEl?.naturalHeight ||
                    !chatImageDetailCardElement ||
                    !chatImageDetailMediaElement
                )
                    return;
                const value_702 = window.visualViewport?.height || window.innerHeight,
                    min_703 = Math.min(value_702 * 0.86, 680),
                    value_704 = rerollErrorEl ? window.getComputedStyle(rerollErrorEl) : null,
                    value_705 =
                        value_704?.display !== 'none'
                            ? rerollErrorEl.offsetHeight + (parseFloat(value_704.marginTop) || 0)
                            : 0,
                    value_706 =
                        (chatImageDetailHeaderElement?.offsetHeight || 0) +
                        (chatImageDetailCopyElement?.offsetHeight || 0) +
                        value_705,
                    max_707 = Math.max(64, Math.floor(min_703 - value_706)),
                    max_708 = Math.max(
                        1,
                        Math.floor(chatImageDetailCardElement.getBoundingClientRect().width),
                    ),
                    min_709 = Math.min(
                        max_708 / imageEl.naturalWidth,
                        max_707 / imageEl.naturalHeight,
                    ),
                    max_710 = Math.max(1, Math.floor(imageEl.naturalWidth * min_709)),
                    max_711 = Math.max(1, Math.floor(imageEl.naturalHeight * min_709));
                chatImageDetailMediaElement.style.width = max_710 + 'px';
                chatImageDetailMediaElement.style.height = max_711 + 'px';
                chatImageDetailMediaElement.style.aspectRatio =
                    imageEl.naturalWidth + ' / ' + imageEl.naturalHeight;
            },
            onload_2 = () => {
                window.requestAnimationFrame(() => {
                    if (imageEl?.dataset.detailImageKey === detailImageKey_2) value_699();
                });
            };
        overlay_3.dataset.messageKey = messageKey_2;
        imageEl && (imageEl.onload = onload_2);
        const value_286 = async (value_289) => {
            if (value_289 < 0 || value_289 >= value_284) return;
            imageUrl_3_2 = value_289;
            detailImageKey_2 = messageKey_2 + ':' + imageUrl_3_2;
            chatImageDetailCounterElement &&
                ((chatImageDetailCounterElement.style.display = value_284 > 1 ? '' : 'none'),
                (chatImageDetailCounterElement.textContent = imageUrl_3_2 + 1 + '/' + value_284));
            chatImageDetailPrevElement &&
                ((chatImageDetailPrevElement.style.display = value_284 > 1 ? '' : 'none'),
                (chatImageDetailPrevElement.disabled = imageUrl_3_2 === 0));
            chatImageDetailNextElement &&
                ((chatImageDetailNextElement.style.display = value_284 > 1 ? '' : 'none'),
                (chatImageDetailNextElement.disabled = imageUrl_3_2 === value_284 - 1));
            chatImageDetailMediaElement?.style.removeProperty('width');
            chatImageDetailMediaElement?.style.removeProperty('height');
            chatImageDetailMediaElement?.style.removeProperty('aspect-ratio');
            imageEl.dataset.detailImageKey = detailImageKey_2;
            imageEl.alt = '第 ' + (imageUrl_3_2 + 1) + ' 张图片';
            imageEl.removeAttribute('src');
            try {
                const src_2 = await handleAction_27(msg_17, imageUrl_3_2);
                if (
                    imageEl.dataset.detailImageKey === detailImageKey_2 &&
                    overlay_3.style.display !== 'none'
                ) {
                    if (src_2) imageEl.src = src_2;
                    else window.showToast?.('图片加载失败');
                }
            } catch (value_291) {
                if (imageEl.dataset.detailImageKey === detailImageKey_2)
                    window.showToast?.('图片加载失败');
            }
        };
        chatImageDetailPrevElement.onclick = () => {
            void value_286(imageUrl_3_2 - 1);
        };
        chatImageDetailNextElement.onclick = () => {
            void value_286(imageUrl_3_2 + 1);
        };
        let value_287 = null;
        const value_288 = (value_292, value_293) => {
            if (!value_287 || value_284 < 2) return;
            const value_294 = value_292 - value_287.x,
                value_296 = value_293 - value_287.y;
            value_287 = null;
            Math.abs(value_294) > 32 &&
                Math.abs(value_294) > Math.abs(value_296) * 1.15 &&
                void value_286(imageUrl_3_2 + (value_294 < 0 ? 1 : -1));
        };
        chatImageDetailMediaElement.onpointerdown = (event_297) => {
            if (event_297.pointerType !== 'touch')
                value_287 = {
                    x: event_297.clientX,
                    y: event_297.clientY,
                };
        };
        chatImageDetailMediaElement.onpointerup = (event_298) => {
            if (event_298.pointerType !== 'touch') value_288(event_298.clientX, event_298.clientY);
        };
        chatImageDetailMediaElement.onpointercancel = () => {
            value_287 = null;
        };
        chatImageDetailMediaElement.ontouchstart = (event_299) => {
            const value_300 = event_299.touches?.[0];
            if (value_300)
                value_287 = {
                    x: value_300.clientX,
                    y: value_300.clientY,
                };
        };
        chatImageDetailMediaElement.ontouchend = (value_301) => {
            const value_302 = value_301.changedTouches?.[0];
            if (value_302) value_288(value_302.clientX, value_302.clientY);
        };
        chatImageDetailMediaElement.ontouchcancel = () => {
            value_287 = null;
        };
        overlay_3.onkeydown = (event_303) => {
            event_303.key === 'ArrowLeft' &&
                (event_303.preventDefault(), void value_286(imageUrl_3_2 - 1));
            event_303.key === 'ArrowRight' &&
                (event_303.preventDefault(), void value_286(imageUrl_3_2 + 1));
            if (event_303.key === 'Escape') overlay_3.style.display = 'none';
        };
        if (senderEl)
            senderEl.textContent =
                senderName_2 || friend_30?.nickname || friend_30?.realName || '图片';
        if (timeEl) timeEl.textContent = textContent_4;
        if (descEl) descEl.textContent = msg_17.text || msg_17.description || '暂无图片描述';
        rerollErrorEl && ((rerollErrorEl.style.display = 'none'), (rerollErrorEl.textContent = ''));
        saveButton &&
            ((saveButton.style.display = isGeneratedImage ? 'inline-flex' : 'none'),
            (saveButton.disabled = false),
            (saveButton.textContent = '保存'),
            (saveButton.onclick = async () => {
                if (!isGeneratedImage || saveButton.disabled) return;
                const originalText = saveButton.textContent;
                saveButton.disabled = true;
                saveButton.textContent = '保存中…';
                try {
                    const result_4 = await saveGeneratedChatImage(
                        imageUrl_3,
                        timestamp_9 || msg_17.timestamp,
                    );
                    if (result_4 === 'downloaded' || result_4 === 'shared')
                        window.showToast?.('图片已保存');
                } catch (error_3) {
                    window.showToast?.(error_3?.message || '图片保存失败，请稍后重试');
                } finally {
                    saveButton.disabled = false;
                    saveButton.textContent = originalText;
                }
            }));
        rerollButton &&
            ((rerollButton.style.display = isGeneratedImage ? 'inline-flex' : 'none'),
            (rerollButton.disabled = false),
            (rerollButton.innerHTML = '<i class="fas fa-redo"></i> 重 roll'),
            (rerollButton.onclick = async () => {
                if (!isGeneratedImage || rerollButton.disabled) return;
                rerollButton.disabled = true;
                if (saveButton) saveButton.disabled = true;
                rerollErrorEl &&
                    ((rerollErrorEl.style.display = 'none'), (rerollErrorEl.textContent = ''));
                rerollButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 生成中…';
                try {
                    const { updatedFriend: updatedFriend_5, updatedMessage: updatedMessage_3 } =
                        await rerollGeneratedChatImage(msg_17, friend_30);
                    window.showToast?.('图片已重新生成');
                    overlay_3.dataset.messageKey === messageKey_2 &&
                        overlay_3.style.display !== 'none' &&
                        openChatImageDetail(
                            updatedMessage_3,
                            updatedFriend_5,
                            updatedMessage_3.timestamp,
                            senderName_2,
                        );
                } catch (error_4) {
                    console.error('[iMessage] Image reroll failed:', error_4);
                    const textContent_5 = handleAction_77(error_4);
                    if (
                        window.u2Api?.isRequestError?.(error_4) &&
                        window.u2Api.reportError(error_4, {
                            operation: '图片重新生成',
                        })
                    ) {
                    } else
                        rerollErrorEl
                            ? ((rerollErrorEl.textContent = textContent_5),
                              (rerollErrorEl.style.display = 'block'),
                              onload_2())
                            : window.alert(textContent_5);
                } finally {
                    rerollButton.disabled = false;
                    rerollButton.innerHTML = '<i class="fas fa-redo"></i> 重 roll';
                    if (saveButton) saveButton.disabled = false;
                }
            }));
        overlay_3.style.display = 'flex';
        overlay_3.tabIndex = -1;
        overlay_3.focus();
        void value_286(imageUrl_3_2);
    }
    function renderImageBubble_2(msg_18, friend_31, element_304, timestamp_10 = Date.now()) {
        const isUser = msg_18.role === 'user',
            value_722 = !isUser && friend_31.type === 'group',
            value_306 =
                value_722 && window.imChat.getGroupMessageSpeaker
                    ? window.imChat.getGroupMessageSpeaker(friend_31, msg_18)
                    : null,
            speakerName = value_722
                ? (value_306 && value_306.nickname) ||
                  msg_18.speaker ||
                  msg_18.senderName ||
                  'Group member'
                : null,
            value_724 = (value_306 && value_306.avatarUrl) || msg_18.senderAvatarUrl || null,
            handleAction_18_725 = handleAction_18(
                element_304,
                (element_327) =>
                    !element_327.classList.contains('chat-timestamp') &&
                    !element_327.classList.contains('typing-row'),
            );
        let enabled_726 = false,
            enabled_727 = false;
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
        const value_317 = msg_18.content || window.imChat.CHAT_IMAGE_PLACEHOLDER_URL || '',
            value_318 = 1 + (Array.isArray(msg_18.albumImages) ? msg_18.albumImages.length : 0),
            value_320 = value_318 > 1,
            value_321 = value_320
                ? '<div class="chat-image-album" role="group" aria-label="' +
                  value_318 +
                  ` 张图片，可左右滑动" tabindex="0">
                <button type="button" class="chat-image-album-expand" aria-label="展开 ` +
                  value_318 +
                  ' 张图片">展开 ' +
                  value_318 +
                  `</button>
                <div class="chat-image-album-stack">
                    <img class="chat-image-album-layer layer-back-2" alt="" loading="lazy" decoding="async" draggable="false">
                    <img class="chat-image-album-layer layer-back-1" alt="" loading="lazy" decoding="async" draggable="false">
                    <img class="chat-image-album-layer layer-front" src="` +
                  escapeHtml(value_317) +
                  `" alt="第 1 张图片" loading="lazy" decoding="async" draggable="false">
                    <span class="chat-image-album-counter">1/` +
                  value_318 +
                  `</span>
                </div>
            </div>`
                : '<img class="chat-image-bubble-img" src="' +
                  escapeHtml(value_317) +
                  '" style="width: min(56vw, 200px); height: min(56vw, 200px); max-width: 200px; max-height: 200px; aspect-ratio: 1 / 1; border-radius: 12px; object-fit: cover; display: block; background: #e5e5ea; cursor: pointer;">',
            value_322 =
                typeof window.formatChatBubbleTime === 'function'
                    ? window.formatChatBubbleTime(timestamp_10)
                    : (() => {
                          const value_329 = new Date(timestamp_10);
                          return (
                              value_329.getHours() +
                              ':' +
                              value_329.getMinutes().toString().padStart(2, '0')
                          );
                      })(),
            text_323 = '',
            value_324 =
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
            const value_740 = String(speakerName).trim().charAt(0) || '?',
                value_741 = value_724
                    ? '<img src="' +
                      escapeHtml(value_724) +
                      '" onerror="this.src=\'assets/moren-thumb.jpg\'" loading="lazy" decoding="async" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;">'
                    : '<div class="chat-avatar-small">' + escapeHtml(value_740) + '</div>';
            value_325 =
                `
                    <div class="group-ai-bubble-wrap">
                    ` +
                (enabled_727
                    ? ''
                    : '<div class="group-ai-speaker-name">' + escapeHtml(speakerName) + '</div>') +
                `
                    <div class="group-ai-bubble-row">
                        <div class="group-ai-avatar-slot">` +
                (enabled_727 ? '<div class="group-ai-avatar-placeholder"></div>' : value_741) +
                `</div>
                        ` +
                value_324 +
                `
                    </div>
                </div>
            `;
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
            `
            <div class="chat-checkbox-wrapper" style="display: ` +
            (window.imData.batchSelectMode ? 'flex' : 'none') +
            `; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">
                <i class="far fa-circle chat-checkbox" data-timestamp="` +
            timestamp_10 +
            `" style="color: #c7c7cc; font-size: 22px;"></i>
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">
                ` +
            handleAction_7_326 +
            `
                <div style="display: flex; justify-content: ` +
            (isUser ? 'flex-end' : 'flex-start') +
            `; align-items: flex-end; width: 100%;">
                    ` +
            value_325 +
            `
                </div>
            </div>
        `;
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
            const chatImageAlbumElement = row_14.querySelector('.chat-image-album'),
                items_333 = [
                    chatImageAlbumElement.querySelector('.layer-front'),
                    chatImageAlbumElement.querySelector('.layer-back-1'),
                    chatImageAlbumElement.querySelector('.layer-back-2'),
                ];
            let count_334 = 0,
                count_335 = 0;
            const value_336 = () => {
                    const value_345 = ++count_335;
                    chatImageAlbumElement.querySelector('.chat-image-album-counter').textContent =
                        count_334 + 1 + '/' + value_318;
                    items_333.forEach((element_346, value_347) => {
                        const value_348 = count_334 + value_347,
                            value_349 = value_348 < value_318;
                        element_346.style.display = value_349 ? 'block' : 'none';
                        element_346.removeAttribute('src');
                        if (!value_349) return;
                        element_346.alt =
                            value_347 === 0 ? '第 ' + (value_348 + 1) + ' 张图片' : '';
                        void handleAction_27(msg_18, value_348)
                            .then((src_3) => {
                                if (value_345 === count_335 && element_346.isConnected && src_3)
                                    element_346.src = src_3;
                            })
                            ['catch'](() => undefined);
                    });
                },
                value_337 = () => {
                    const senderName_3_2 = isUser
                        ? getEffectiveUserProfile(friend_31).name
                        : speakerName || friend_31?.nickname || friend_31?.realName || 'Char';
                    openChatImageDetail(msg_18, friend_31, timestamp_10, senderName_3_2, count_334);
                };
            chatImageAlbumElement
                .querySelector('.chat-image-album-expand')
                .addEventListener('click', (event_352) => {
                    event_352.preventDefault();
                    event_352.stopPropagation();
                    value_337();
                });
            let value_341 = null,
                count_342 = 0;
            const value_343 = (value_353, value_354) => {
                if (!value_341) return;
                const value_355 = value_353 - value_341.x,
                    value_356 = value_354 - value_341.y;
                value_341 = null;
                Math.abs(value_355) > 32 &&
                    Math.abs(value_355) > Math.abs(value_356) * 1.15 &&
                    ((count_334 = Math.max(
                        0,
                        Math.min(value_318 - 1, count_334 + (value_355 < 0 ? 1 : -1)),
                    )),
                    (count_342 = Date.now() + 450),
                    value_336());
            };
            chatImageAlbumElement.addEventListener('pointerdown', (event_357) => {
                if (event_357.pointerType === 'touch' || event_357.target.closest('button')) return;
                value_341 = {
                    x: event_357.clientX,
                    y: event_357.clientY,
                };
            });
            chatImageAlbumElement.addEventListener('pointerup', (event_358) => {
                if (event_358.pointerType !== 'touch')
                    value_343(event_358.clientX, event_358.clientY);
            });
            chatImageAlbumElement.addEventListener('pointercancel', () => {
                value_341 = null;
            });
            chatImageAlbumElement.addEventListener(
                'touchstart',
                (event_359) => {
                    if (event_359.target.closest('button')) return;
                    const value_360 = event_359.touches?.[0];
                    if (value_360)
                        value_341 = {
                            x: value_360.clientX,
                            y: value_360.clientY,
                        };
                },
                {
                    passive: true,
                },
            );
            chatImageAlbumElement.addEventListener(
                'touchend',
                (value_361) => {
                    const value_362 = value_361.changedTouches?.[0];
                    if (value_362) value_343(value_362.clientX, value_362.clientY);
                },
                {
                    passive: true,
                },
            );
            chatImageAlbumElement.addEventListener(
                'touchcancel',
                () => {
                    value_341 = null;
                },
                {
                    passive: true,
                },
            );
            chatImageAlbumElement.addEventListener('click', (event_363) => {
                if (event_363.target.closest('button')) return;
                if (Date.now() < count_342) return;
                value_337();
            });
            chatImageAlbumElement.addEventListener('keydown', (event_364) => {
                if (event_364.key === 'ArrowLeft' || event_364.key === 'ArrowRight') {
                    event_364.preventDefault();
                    count_334 = Math.max(
                        0,
                        Math.min(
                            value_318 - 1,
                            count_334 + (event_364.key === 'ArrowRight' ? 1 : -1),
                        ),
                    );
                    value_336();
                } else
                    (event_364.key === 'Enter' || event_364.key === ' ') &&
                        (event_364.preventDefault(), value_337());
            });
            value_336();
        }
        element_304.appendChild(row_14);
        window.imChat.scrollToBottom(element_304);
    }
    function renderPayTransferBubble_2(msg_19, friend_32, element_746, value_365 = Date.now()) {
        const value_366 = msg_19.role === 'user',
            value_367 = !value_366 && friend_32.type === 'group',
            value_368 = value_367 ? resolveGroupBubbleIdentity(friend_32, msg_19) : null,
            speakerName_6 = value_368?.name || null,
            value_370 = value_368?.avatarUrl || null,
            lastElementChild_371 = element_746.lastElementChild;
        let enabled_372 = false,
            enabled_373 = false;
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
        const amount_2 = Number(msg_19.amount) || 0,
            value_758 = '¥' + amount_2.toFixed(2),
            description_2 = msg_19.description || '转账',
            parties = handleAction_23(msg_19, friend_32),
            {
                payKind: payKind_3,
                status: status_4,
                payerName: payerName_3,
                payeeName: payeeName_3,
            } = parties,
            isOfficialReceipt =
                msg_19.targetName === 'Payment' ||
                msg_19.cardTitle === '收款通知' ||
                msg_19.cardTitle === '支付凭证',
            familyCardText =
                (msg_19.paymentAction || '') +
                ' ' +
                (msg_19.cardTitle || '') +
                ' ' +
                (msg_19.description || '') +
                ' ' +
                (msg_19.content || ''),
            isFamilyCard =
                msg_19.paymentAction === 'family_card' ||
                msg_19.paymentAction === 'family_card_increase' ||
                familyCardText.includes('亲属卡'),
            startsWith_768 = String(msg_19.payKind || '').startsWith('family_card_');
        let cardTitle_2 = msg_19.cardTitle || 'Payment',
            value_770 = payerName_3 + ' 向 ' + payeeName_3 + ' 转账',
            extraClass = '';
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
        const handleAction_7_389 = buildMessageHeaderHtml(
                value_366,
                friend_32,
                value_365,
                speakerName_6,
                value_370,
                enabled_372,
                msg_19,
            ),
            value_390 = new Date(value_365),
            value_391 =
                typeof window.formatChatBubbleTime === 'function'
                    ? window.formatChatBubbleTime(value_365)
                    : value_390.getHours() +
                      ':' +
                      value_390.getMinutes().toString().padStart(2, '0');
        if (isOfficialReceipt) {
            const sign = msg_19.cardTitle === '收款通知' ? '+' : '-';
            row_15.innerHTML =
                `
                <div class="chat-checkbox-wrapper" style="display: ` +
                (window.imData.batchSelectMode ? 'flex' : 'none') +
                `; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">
                    <i class="far fa-circle chat-checkbox" data-timestamp="` +
                value_365 +
                `" style="color: #c7c7cc; font-size: 22px;"></i>
                </div>
                    <div style="width:100%; display:flex; justify-content:center; padding:10px 0;">
                    <div class="im-card-content pay-receipt-card" style="width:280px; background:#fff; border-radius:12px; padding:16px;  display:flex; flex-direction:column; align-items:center;">
                        <div style="font-size:14px; color:#111; margin-bottom:8px;">` +
                description_2 +
                `</div>
                        <div style="font-size:28px; font-weight:bold; color:#111; margin-bottom:12px;">` +
                sign +
                '¥' +
                amount_2.toFixed(2) +
                `</div>
                          <div style="background:#f2f2f7; border-radius:16px; padding:4px 12px; font-size:12px; color:#8e8e93; margin-bottom:16px;">
                              ` +
                value_391 +
                `
                          </div>
                        <div style="width:100%; border-top:1px solid #f2f2f7; padding-top:12px; display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-size:13px; color:#8e8e93;">账单详情</span>
                            <i class="fas fa-chevron-right" style="font-size:12px; color:#c7c7cc;"></i>
                        </div>
                    </div>
                </div>
            `;
        } else {
            const value_394 =
                `
                <div class="pay-transfer-card im-card-content` +
                extraClass +
                `">
                    <div class="pay-transfer-card-top">
                        <div class="pay-transfer-card-icon"><i class="fas fa-wallet"></i></div>
                        <div class="pay-transfer-card-meta">
                            <div class="pay-transfer-card-title">` +
                escapeHtml(cardTitle_2) +
                `</div>
                            ` +
                (isFamilyCard && !startsWith_768
                    ? ''
                    : '<div class="pay-transfer-card-subtitle">' +
                      escapeHtml(value_770) +
                      '</div>') +
                `
                        </div>
                    </div>
                    <div class="pay-transfer-card-amount">` +
                value_758 +
                `</div>
                    <div class="pay-transfer-card-desc">` +
                escapeHtml(description_2) +
                `</div>
                </div>
            `;
            if (value_366) {
                const text_395 = '';
                row_15.innerHTML =
                    `
                    <div class="chat-checkbox-wrapper" style="display: ` +
                    (window.imData.batchSelectMode ? 'flex' : 'none') +
                    `; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">
                        <i class="far fa-circle chat-checkbox" data-timestamp="` +
                    value_365 +
                    `" style="color: #c7c7cc; font-size: 22px;"></i>
                    </div>
                    <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">
                        ` +
                    handleAction_7_389 +
                    `
                        <div style="display: flex; justify-content: flex-end; align-items: flex-end; width: 100%;">
                            <div class="chat-bubble user-bubble im-card-bubble pay-transfer-bubble">` +
                    value_394 +
                    text_395 +
                    `</div>
                        </div>
                    </div>
                `;
            } else {
                const text_396 = '',
                    value_397 = value_367
                        ? `<div class="group-ai-bubble-wrap">
                        ` +
                          (enabled_373
                              ? ''
                              : '<div class="group-ai-speaker-name">' +
                                escapeHtml(speakerName_6) +
                                '</div>') +
                          `
                        <div class="group-ai-bubble-row">
                            <div class="group-ai-avatar-slot">` +
                          (enabled_373
                              ? '<div class="group-ai-avatar-placeholder"></div>'
                              : value_370
                                ? '<img src="' +
                                  escapeHtml(value_370) +
                                  '" onerror="this.src=\'assets/moren-thumb.jpg\'" loading="lazy" decoding="async" style="width:28px;height:28px;border-radius:50%;object-fit:cover;">'
                                : '<div class="chat-avatar-small">' +
                                  escapeHtml(String(speakerName_6).charAt(0) || '?') +
                                  '</div>') +
                          `</div>
                            <div class="chat-bubble ai-bubble im-card-bubble pay-transfer-bubble">` +
                          value_394 +
                          text_396 +
                          `</div>
                        </div>
                    </div>`
                        : '<div class="chat-bubble ai-bubble im-card-bubble pay-transfer-bubble">' +
                          value_394 +
                          text_396 +
                          '</div>';
                row_15.innerHTML =
                    `
                    <div class="chat-checkbox-wrapper" style="display: ` +
                    (window.imData.batchSelectMode ? 'flex' : 'none') +
                    `; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">
                        <i class="far fa-circle chat-checkbox" data-timestamp="` +
                    value_365 +
                    `" style="color: #c7c7cc; font-size: 22px;"></i>
                    </div>
                    <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">
                        ` +
                    handleAction_7_389 +
                    `
                        <div style="display: flex; justify-content: flex-start; align-items: flex-end; width: 100%;">` +
                    value_397 +
                    `</div>
                    </div>
                `;
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
    function renderMomentForwardBubble_2(msg_20, value_400, element_401, value_402 = Date.now()) {
        let momentData = {};
        try {
            momentData = JSON.parse(msg_20.content);
        } catch (value_410) {
            momentData = {
                text: '[解析错误]',
            };
        }
        const value_403 = msg_20.role === 'user',
            lastElementChild_404 = element_401.lastElementChild;
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
        const text_407 = `
            <div class="moment-forward-bubble im-card-content" style="cursor: pointer; background: #fff; border-radius: 16px; padding: 12px;  border: 1px solid rgba(0,0,0,0.04); display: flex; align-items: center; gap: 12px; width: 220px; text-align: left; margin: 4px 0;">
                <div style="width: 44px; height: 44px; border-radius: 12px; background: #1c1c1e; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #fff; font-size: 20px;">
                    <i class="far fa-images"></i>
                </div>
                <div style="flex: 1; overflow: hidden;">
                    <div style="font-size: 15px; font-weight: 600; color: #262626; margin-bottom: 2px;">分享了动态</div>
                    <div style="font-size: 13px; color: #8e8e93;">点击查看详情</div>
                </div>
            </div>
        `,
            handleAction_7_408 = buildMessageHeaderHtml(
                value_403,
                value_400,
                value_402,
                null,
                null,
                enabled_405,
                msg_20,
            ),
            value_409 =
                typeof window.formatChatBubbleTime === 'function'
                    ? window.formatChatBubbleTime(value_402)
                    : (() => {
                          const value_411 = new Date(value_402);
                          return (
                              value_411.getHours() +
                              ':' +
                              value_411.getMinutes().toString().padStart(2, '0')
                          );
                      })();
        if (value_403) {
            let text_412 = '';
            row_16.innerHTML =
                `
                <div class="chat-checkbox-wrapper" style="display: ` +
                (window.imData.batchSelectMode ? 'flex' : 'none') +
                `; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">
                    <i class="far fa-circle chat-checkbox" data-timestamp="` +
                value_402 +
                `" style="color: #c7c7cc; font-size: 22px;"></i>
                </div>
                <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">
                    ` +
                handleAction_7_408 +
                `
                    <div style="display: flex; justify-content: flex-end; align-items: flex-end; width: 100%;">
                        ` +
                text_407 +
                `
                        ` +
                text_412 +
                `
                    </div>
                </div>
            `;
        } else {
            let text_413 = '';
            row_16.innerHTML =
                `
                <div class="chat-checkbox-wrapper" style="display: ` +
                (window.imData.batchSelectMode ? 'flex' : 'none') +
                `; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">
                    <i class="far fa-circle chat-checkbox" data-timestamp="` +
                value_402 +
                `" style="color: #c7c7cc; font-size: 22px;"></i>
                </div>
                <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">
                    ` +
                handleAction_7_408 +
                `
                    <div style="display: flex; justify-content: flex-start; align-items: flex-end; width: 100%;">
                        ` +
                text_407 +
                `
                        ` +
                text_413 +
                `
                    </div>
                </div>
            `;
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
        const value_418 = msg_21.role !== 'assistant',
            handleAction_18_808 = handleAction_18(
                element_805,
                (el_2) =>
                    !el_2.classList.contains('chat-timestamp') &&
                    !el_2.classList.contains('typing-row') &&
                    !el_2.classList.contains('chat-offline-scene-row'),
            ),
            isGroupMessage_3 = !value_418 && friend_33.type === 'group',
            safeSpeaker =
                isGroupMessage_3 && window.imChat.getGroupMessageSpeaker
                    ? window.imChat.getGroupMessageSpeaker(friend_33, msg_21)
                    : null,
            speakerName_7 = isGroupMessage_3
                ? (safeSpeaker && safeSpeaker.nickname) ||
                  msg_21.speaker ||
                  msg_21.senderName ||
                  '群成员'
                : null,
            value_812 = (safeSpeaker && safeSpeaker.avatarUrl) || msg_21.senderAvatarUrl || null;
        let enabled_424 = false,
            enabled_425 = false;
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
        const transcript_2 = String(msg_21.transcript || msg_21.text || '').trim(),
            calculatedDuration = Math.min(18, Math.max(3, Math.ceil(transcript_2.length / 3))),
            duration_2 = Math.min(18, Math.max(3, Number(msg_21.duration) || calculatedDuration)),
            safeTranscript = escapeHtml(transcript_2 || '暂无转文字'),
            cleanTranslation = String(msg_21.translation || '').trim(),
            value_432 =
                typeof window.formatChatBubbleTime === 'function'
                    ? window.formatChatBubbleTime(timestamp_11)
                    : (() => {
                          const value_440 = new Date(timestamp_11);
                          return (
                              value_440.getHours() +
                              ':' +
                              value_440.getMinutes().toString().padStart(2, '0')
                          );
                      })(),
            text_433 = '',
            value_823 =
                `
            <button type="button" class="voice-message-bubble-inner" aria-expanded="false">
                <span class="voice-message-mic"><i class="fas fa-microphone-alt"></i></span>
                <span class="voice-message-wave" aria-hidden="true">
                    <span></span><span></span><span></span><span></span><span></span>
                </span>
                <span class="voice-message-duration">` +
                duration_2 +
                `s</span>
            </button>
            <div class="voice-message-transcript" hidden>` +
                safeTranscript +
                `</div>
            ` +
                (cleanTranslation && msg_21.showTranslation
                    ? '<div class="msg-translation" style="margin-top: 6px; padding-top: 6px; border-top: 1px solid ' +
                      (value_418 ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)') +
                      '; font-size: 13px; color: ' +
                      (value_418 ? 'rgba(255,255,255,0.7)' : '#8e8e93') +
                      '; line-height: 1.4; word-wrap: break-word; white-space: normal;">' +
                      escapeHtml(cleanTranslation) +
                      '</div>'
                    : '') +
                `
            ` +
                text_433 +
                `
        `,
            value_824 =
                '<div class="chat-bubble ' +
                (value_418 ? 'user-bubble' : 'ai-bubble') +
                ' im-card-bubble voice-message-bubble">' +
                value_823 +
                '</div>';
        let value_436 = value_824;
        if (isGroupMessage_3) {
            const value_830 = String(speakerName_7).trim().charAt(0) || '?',
                value_831 = value_812
                    ? '<img src="' +
                      value_812 +
                      '" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;">'
                    : '<div class="chat-avatar-small">' + escapeHtml(value_830) + '</div>';
            value_436 =
                `
                <div class="group-ai-bubble-wrap">
                    ` +
                (enabled_425
                    ? ''
                    : '<div class="group-ai-speaker-name">' +
                      escapeHtml(speakerName_7) +
                      '</div>') +
                `
                    <div class="group-ai-bubble-row">
                        <div class="group-ai-avatar-slot">` +
                (enabled_425 ? '<div class="group-ai-avatar-placeholder"></div>' : value_831) +
                `</div>
                        ` +
                value_824 +
                `
                    </div>
                </div>
            `;
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
            `
            <div class="chat-checkbox-wrapper" style="display: ` +
            (window.imData.batchSelectMode ? 'flex' : 'none') +
            `; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">
                <i class="far fa-circle chat-checkbox" data-timestamp="` +
            timestamp_11 +
            `" style="color: #c7c7cc; font-size: 22px;"></i>
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">
                ` +
            handleAction_7_437 +
            `
                <div style="display: flex; justify-content: ` +
            (value_418 ? 'flex-end' : 'flex-start') +
            `; align-items: flex-end; width: 100%;">
                    ` +
            value_436 +
            `
                </div>
            </div>
        `;
        const toggle_3 = row_17.querySelector('.voice-message-bubble-inner'),
            transcriptEl = row_17.querySelector('.voice-message-transcript');
        toggle_3 &&
            transcriptEl &&
            toggle_3.addEventListener('click', async (event_445) => {
                event_445.preventDefault();
                event_445.stopPropagation();
                const friend_21_2 = transcriptEl.hidden;
                transcriptEl.hidden = !friend_21_2;
                toggle_3.setAttribute('aria-expanded', friend_21_2 ? 'true' : 'false');
                if (!friend_21_2 || value_418) return;
                const ttsFriend = window.u2Tts?.resolveMessageTtsFriend
                        ? window.u2Tts.resolveMessageTtsFriend(friend_33, msg_21)
                        : friend_33,
                    canPlayTts = window.u2Tts?.canSpeakForFriend
                        ? window.u2Tts.canSpeakForFriend(ttsFriend)
                        : true;
                if (
                    canPlayTts &&
                    window.u2Tts &&
                    typeof window.u2Tts.speakTextCached === 'function'
                )
                    try {
                        const cacheOwner = msg_21 && typeof msg_21 === 'object' ? msg_21 : {},
                            audioUrl = await window.u2Tts.speakTextCached(
                                transcript_2,
                                ttsFriend,
                                cacheOwner,
                            );
                        audioUrl &&
                            msg_21 &&
                            typeof msg_21 === 'object' &&
                            !msg_21.ttsAudioUrl &&
                            window.imApp?.updateFriendMessage &&
                            (await window.imApp.updateFriendMessage(
                                friend_33.id,
                                {
                                    id: msg_21.id || row_17.getAttribute('data-message-id') || null,
                                    timestamp:
                                        row_17.getAttribute('data-timestamp') ||
                                        timestamp_11 ||
                                        null,
                                },
                                (targetMsg_4) => {
                                    if (targetMsg_4) targetMsg_4.ttsAudioUrl = audioUrl;
                                },
                                {
                                    silent: true,
                                },
                            ));
                    } catch (error_5) {
                        console.error('Voice message playback failed', error_5);
                        if (
                            (!window.u2Api?.isRequestError?.(error_5) ||
                                !window.u2Api.reportError(error_5, {
                                    operation: '语音生成',
                                })) &&
                            window.showToast
                        )
                            window.showToast(
                                window.u2Tts?.getUserErrorMessage?.(error_5) || '语音播放失败',
                            );
                    }
            });
        element_805.appendChild(row_17);
        window.imChat.scrollToBottom(element_805);
    }
    function renderStickerMessageBubble_2(msg_22, value_454, element_455, value_456 = Date.now()) {
        const value_457 = msg_22.role !== 'assistant',
            handleAction_18_458 = handleAction_18(
                element_455,
                (element_473) =>
                    !element_473.classList.contains('chat-timestamp') &&
                    !element_473.classList.contains('typing-row'),
            ),
            value_459 = !value_457 && value_454.type === 'group',
            value_460 =
                value_459 && window.imChat.getGroupMessageSpeaker
                    ? window.imChat.getGroupMessageSpeaker(value_454, msg_22)
                    : null,
            value_461 = value_459
                ? (value_460 && value_460.nickname) ||
                  msg_22.speaker ||
                  msg_22.senderName ||
                  'Group member'
                : null,
            value_848 = (value_460 && value_460.avatarUrl) || msg_22.senderAvatarUrl || null;
        let enabled_463 = false,
            enabled_464 = false;
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
        const stickerUrl_2 = String(msg_22.stickerUrl || msg_22.content || '').trim(),
            stickerName_2 = String(msg_22.stickerName || msg_22.text || 'Sticker').trim(),
            value_468 =
                typeof window.formatChatBubbleTime === 'function'
                    ? window.formatChatBubbleTime(value_456)
                    : (() => {
                          const value_475 = new Date(value_456);
                          return (
                              value_475.getHours() +
                              ':' +
                              value_475.getMinutes().toString().padStart(2, '0')
                          );
                      })(),
            text_469 = '',
            value_470 =
                `
            <div class="sticker-message-wrap" title="` +
                escapeHtml(stickerName_2) +
                `">
                <img class="sticker-message-img" src="` +
                escapeHtml(stickerUrl_2) +
                '" alt="' +
                escapeHtml(stickerName_2) +
                `">
                ` +
                text_469 +
                `
            </div>
        `;
        let value_471 = value_470;
        if (value_459) {
            const value_862 = String(value_461).trim().charAt(0) || '?',
                value_863 = value_848
                    ? '<img src="' +
                      escapeHtml(value_848) +
                      '" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;">'
                    : '<div class="chat-avatar-small">' + escapeHtml(value_862) + '</div>';
            value_471 =
                `
                <div class="group-ai-bubble-wrap sticker-group-wrap">
                    ` +
                (enabled_464
                    ? ''
                    : '<div class="group-ai-speaker-name">' + escapeHtml(value_461) + '</div>') +
                `
                    <div class="group-ai-bubble-row">
                        <div class="group-ai-avatar-slot">` +
                (enabled_464 ? '<div class="group-ai-avatar-placeholder"></div>' : value_863) +
                `</div>
                        ` +
                value_470 +
                `
                    </div>
                </div>
            `;
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
            `
            <div class="chat-checkbox-wrapper" style="display: ` +
            (window.imData.batchSelectMode ? 'flex' : 'none') +
            `; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">
                <i class="far fa-circle chat-checkbox" data-timestamp="` +
            value_456 +
            `" style="color: #c7c7cc; font-size: 22px;"></i>
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">
                ` +
            handleAction_7_472 +
            `
                <div style="display: flex; justify-content: ` +
            (value_457 ? 'flex-end' : 'flex-start') +
            `; align-items: flex-end; width: 100%;">
                    ` +
            value_471 +
            `
                </div>
            </div>
        `;
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
            const value_899 =
                    String(speakerName_8 || '?')
                        .trim()
                        .charAt(0) || '?',
                value_519 = value_497
                    ? '<img src="' +
                      escapeHtml(value_497) +
                      '" onerror="this.src=\'assets/moren-thumb.jpg\'" loading="lazy" decoding="async" style="width:28px;height:28px;border-radius:50%;object-fit:cover;">'
                    : '<div class="chat-avatar-small">' + escapeHtml(value_899) + '</div>';
            value_514 =
                `<div class="group-ai-bubble-wrap">
                ` +
                (enabled_500
                    ? ''
                    : '<div class="group-ai-speaker-name">' +
                      escapeHtml(speakerName_8) +
                      '</div>') +
                `
                <div class="group-ai-bubble-row"><div class="group-ai-avatar-slot">` +
                (enabled_500 ? '<div class="group-ai-avatar-placeholder"></div>' : value_519) +
                '</div>' +
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
    function renderFakeLinkWebPage_2(element_951, value_952 = {}) {
        if (!element_951) return false;
        const pagePackage = sanitizeFakeLinkPagePackage_3(value_952);
        if (!pagePackage.html) return false;
        if (pagePackage.js) {
            const buildSandboxDocument = window.imChat?.buildFakeLinkSandboxDocument;
            if (typeof buildSandboxDocument !== 'function') return false;
            element_951.innerHTML = '';
            const frame_2 = document.createElement('iframe');
            return (
                (frame_2.className = 'im-fake-link-detail-iframe'),
                frame_2.setAttribute('sandbox', 'allow-scripts'),
                frame_2.setAttribute('referrerpolicy', 'no-referrer'),
                frame_2.setAttribute('title', '链接小剧场'),
                (frame_2.srcdoc = buildSandboxDocument(pagePackage)),
                element_951.appendChild(frame_2),
                true
            );
        }
        const pageId =
                'fake-link-page-' +
                Date.now().toString(36) +
                '-' +
                Math.random().toString(36).slice(2, 8),
            scopeSelector_2 = '[data-fake-page-id="' + pageId + '"]';
        element_951.innerHTML = '';
        const style_2 = document.createElement('style');
        style_2.className = 'im-fake-link-web-style';
        style_2.textContent = scopeFakeLinkCss(pagePackage.css, scopeSelector_2);
        const root_3 = document.createElement('div');
        return (
            (root_3.className = 'im-fake-link-web-root'),
            root_3.setAttribute('data-fake-page-id', pageId),
            root_3.setAttribute('data-theme', pagePackage.theme || 'generic'),
            (root_3.innerHTML = pagePackage.html),
            element_951.appendChild(style_2),
            element_951.appendChild(root_3),
            bindFakeLinkInteractions(root_3, pagePackage.interactions),
            true
        );
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
    function handleAction_94(msg_23 = {}) {
        const source_4 =
                msg_23.fakeLinkData && typeof msg_23.fakeLinkData === 'object'
                    ? msg_23.fakeLinkData
                    : {},
            displayUrl_2 = normalizeFakeLinkDisplayValue(
                source_4.displayUrl || source_4.canonicalUrl || msg_23.content || '',
            ),
            domain_3 = cleanFakeLinkText(
                source_4.domain || displayUrl_2.split(/[/?#]/)[0] || '',
                120,
            ),
            siteName_2 = cleanFakeLinkText(
                source_4.siteName ||
                    source_4.platformLabel ||
                    source_4.author ||
                    domain_3 ||
                    '假网页',
                80,
            ),
            title_2 = cleanFakeLinkText(
                source_4.title || msg_23.title || domain_3 || '假网页',
                180,
            ),
            summary_2 = cleanFakeLinkText(source_4.summary || source_4.description || '', 800),
            bodyText_2 = cleanFakeLinkText(source_4.bodyText || source_4.content || '', 50000),
            rawWebPage =
                source_4.webPage && typeof source_4.webPage === 'object' ? source_4.webPage : null,
            webPage_3 = rawWebPage ? normalizeFakeLinkWebPageForRender(rawWebPage) : null;
        return {
            domain: domain_3,
            displayUrl: displayUrl_2,
            siteName: siteName_2,
            title: title_2,
            summary: summary_2,
            bodyText: bodyText_2,
            webPage: webPage_3 && webPage_3.html ? webPage_3 : null,
            prompt: cleanFakeLinkText(source_4.prompt || '', 1000),
            generatedBy: cleanFakeLinkText(source_4.generatedBy || 'manual', 40),
            createdAt: Number(source_4.createdAt || msg_23.timestamp) || Date.now(),
        };
    }
    function handleAction_95() {
        let overlay_4 = document.getElementById('im-fake-link-detail-overlay');
        const host_2 = document.getElementById('app') || document.body;
        if (overlay_4) {
            if (overlay_4.parentNode !== host_2) host_2.appendChild(overlay_4);
            return overlay_4;
        }
        overlay_4 = document.createElement('div');
        overlay_4.id = 'im-fake-link-detail-overlay';
        overlay_4.className =
            'bottom-sheet-overlay detail-sheet-overlay wb-centered-modal-overlay im-fake-link-detail-overlay';
        overlay_4.style.display = 'none';
        overlay_4.innerHTML = [
            '<div class="bottom-sheet wb-centered-modal-card im-fake-link-detail-sheet">',
            '  <div class="im-fake-link-browser-bar">',
            '    <button type="button" class="im-fake-link-browser-close" aria-label="关闭"><i class="fas fa-chevron-left"></i></button>',
            '    <div class="im-fake-link-address"></div>',
            '    <span></span>',
            '  </div>',
            '  <article class="im-fake-link-page">',
            '    <div class="im-fake-link-page-legacy">',
            '      <div class="im-fake-link-page-site"></div>',
            '      <h1 class="im-fake-link-page-title"></h1>',
            '      <p class="im-fake-link-page-summary"></p>',
            '      <div class="im-fake-link-page-body"></div>',
            '    </div>',
            '    <div class="im-fake-link-web-host" hidden></div>',
            '  </article>',
            '</div>',
        ].join('');
        const closeOverlay = () => {
            if (window.closeView) window.closeView(overlay_4);
            else overlay_4.style.display = 'none';
        };
        return (
            overlay_4.addEventListener('click', (event_12) => {
                (event_12.target === overlay_4 ||
                    event_12.target.closest('.im-fake-link-browser-close')) &&
                    closeOverlay();
            }),
            host_2.appendChild(overlay_4),
            overlay_4
        );
    }
    function handleAction_96(value_979 = {}, value_980 = null) {
        const overlay_5 = handleAction_95(),
            data = handleAction_94(value_979),
            address_2 = overlay_5.querySelector('.im-fake-link-address'),
            site = overlay_5.querySelector('.im-fake-link-page-site'),
            title_3 = overlay_5.querySelector('.im-fake-link-page-title'),
            summary_3 = overlay_5.querySelector('.im-fake-link-page-summary'),
            body_2 = overlay_5.querySelector('.im-fake-link-page-body'),
            pageEl = overlay_5.querySelector('.im-fake-link-page'),
            legacy = overlay_5.querySelector('.im-fake-link-page-legacy'),
            webHost = overlay_5.querySelector('.im-fake-link-web-host');
        let useWebPage = false;
        if (data.webPage && data.webPage.html && webHost)
            try {
                useWebPage = renderFakeLinkWebPage_2(webHost, data.webPage);
            } catch (error_6) {
                console.warn(
                    '[iMessage fake link] detail render failed, falling back to text view',
                    error_6,
                );
                useWebPage = false;
            }
        if (!useWebPage && webHost) webHost.innerHTML = '';
        if (pageEl) pageEl.classList.toggle('is-webpage', useWebPage);
        if (legacy) legacy.hidden = useWebPage;
        if (webHost) webHost.hidden = !useWebPage;
        if (address_2) address_2.textContent = data.displayUrl || data.domain || 'fake.local';
        if (site) site.textContent = data.siteName || data.domain || '假网页';
        if (title_3) title_3.textContent = data.title || data.siteName || '假网页';
        summary_3 &&
            ((summary_3.textContent = data.summary || ''),
            (summary_3.style.display = summary_3.textContent ? 'block' : 'none'));
        body_2 &&
            (body_2.textContent = data.bodyText || data.summary || '这个假网页暂时没有正文内容。');
        overlay_5.style.display = 'flex';
        if (window.openView) window.openView(overlay_5);
        else overlay_5.classList.add('active');
    }
    function renderFakeLinkBubble_2(msg_24, value_986, element_529, value_531 = Date.now()) {
        const value_989 = msg_24.role === 'user',
            value_990 = !value_989 && value_986.type === 'group',
            value_537 =
                value_990 && window.imChat.getGroupMessageSpeaker
                    ? window.imChat.getGroupMessageSpeaker(value_986, msg_24)
                    : null,
            value_992 = value_990
                ? (value_537 && value_537.nickname) ||
                  msg_24.speaker ||
                  msg_24.senderName ||
                  'Group member'
                : null,
            value_539 = (value_537 && value_537.avatarUrl) || msg_24.senderAvatarUrl || null,
            handleAction_18_994 = handleAction_18(
                element_529,
                (element_566) =>
                    !element_566.classList.contains('chat-timestamp') &&
                    !element_566.classList.contains('typing-row'),
            );
        let enabled_995 = false,
            enabled_996 = false;
        if (handleAction_18_994) {
            if (value_989 && handleAction_18_994.classList.contains('user-row')) {
                enabled_995 = true;
                handleAction_18_994.classList.add('has-next');
            } else {
                if (!value_989 && handleAction_18_994.classList.contains('ai-row')) {
                    const value_1017 = handleAction_18_994.getAttribute('data-speaker') || null;
                    if (value_990 && value_1017 === value_992) {
                        enabled_995 = true;
                        enabled_996 = true;
                        handleAction_18_994.classList.add('has-next');
                    } else
                        !value_990 &&
                            !value_1017 &&
                            ((enabled_995 = true), handleAction_18_994.classList.add('has-next'));
                }
            }
        }
        const fakeLinkData_2 = handleAction_94(msg_24),
            displayUrl_3 = fakeLinkData_2.displayUrl,
            host_3 = fakeLinkData_2.domain || displayUrl_3,
            platformLabel_2 = fakeLinkData_2.siteName || '假网页',
            pageTheme = fakeLinkData_2.webPage?.theme || '',
            cardColor = pageTheme === 'xiaohongshu' ? '#ff2442' : '#3a3a3c',
            title_4 = fakeLinkData_2.title || platformLabel_2 || '假网页',
            summary_4 = fakeLinkData_2.summary || fakeLinkData_2.bodyText.slice(0, 120),
            text_1005 = '',
            text_1006 = '',
            statusLabel = '站内假网页',
            value_1008 = text_1006
                ? '<img src="' + escapeHtml(text_1006) + '" alt="">'
                : '<i class="fas fa-link"></i>',
            effectiveStatusLabel = fakeLinkData_2.webPage
                ? fakeLinkData_2.generatedBy === 'ai'
                    ? 'AI 仿真网页'
                    : '站内仿真网页'
                : statusLabel,
            value_1010 =
                `
            <div class="chat-link-card" role="link" tabindex="0" style="--link-card-color:` +
                escapeHtml(cardColor) +
                `;">
                <div class="chat-link-card-cover">` +
                value_1008 +
                `</div>
                <div class="chat-link-card-body">
                    <div class="chat-link-card-platform">` +
                escapeHtml(platformLabel_2) +
                `</div>
                    <div class="chat-link-card-title">` +
                escapeHtml(title_4) +
                `</div>
                    ` +
                (text_1005 || summary_4
                    ? '<div class="chat-link-card-summary">' +
                      escapeHtml(
                          text_1005
                              ? '' + text_1005 + (summary_4 ? ' · ' + summary_4 : '')
                              : summary_4,
                      ) +
                      '</div>'
                    : '') +
                `
                    <div class="chat-link-card-footer">
                        <span>` +
                escapeHtml(host_3 || displayUrl_3) +
                `</span>
                        <strong>` +
                escapeHtml(effectiveStatusLabel) +
                `</strong>
                    </div>
                </div>
            </div>
        `,
            value_1011 =
                '<div class="chat-bubble ' +
                (value_989 ? 'user-bubble' : 'ai-bubble') +
                ' im-card-bubble" style="padding:0; background:transparent;">' +
                value_1010 +
                '</div>';
        let value_561 = value_1011;
        if (value_990) {
            const value_569 = String(value_992).trim().charAt(0) || '?',
                value_570 = value_539
                    ? '<img src="' +
                      escapeHtml(value_539) +
                      '" onerror="this.src=\'assets/moren-thumb.jpg\'" loading="lazy" decoding="async" style="width:28px;height:28px;border-radius:50%;object-fit:cover;">'
                    : '<div class="chat-avatar-small">' + escapeHtml(value_569) + '</div>';
            value_561 =
                `
                <div class="group-ai-bubble-wrap">
                    ` +
                (enabled_996
                    ? ''
                    : '<div class="group-ai-speaker-name">' + escapeHtml(value_992) + '</div>') +
                `
                    <div class="group-ai-bubble-row">
                        <div class="group-ai-avatar-slot">` +
                (enabled_996 ? '<div class="group-ai-avatar-placeholder"></div>' : value_570) +
                `</div>
                        ` +
                value_1011 +
                `
                    </div>
                </div>
            `;
        }
        const row_19 = document.createElement('div');
        row_19.className =
            'chat-row ' +
            (value_989 ? 'user-row' : 'ai-row') +
            ' ' +
            (enabled_995 ? 'has-prev' : '') +
            ' ' +
            (value_990 ? 'group-ai-row' : '') +
            ' ' +
            (value_990 && enabled_996 ? 'group-ai-row-continuous' : '');
        row_19.setAttribute('data-timestamp', value_531);
        row_19.setAttribute('data-message-id', window.imChat.ensureMessageId(msg_24, 'link'));
        if (value_992) row_19.setAttribute('data-speaker', value_992);
        handleAction_22(row_19, value_986, msg_24);
        handleAction_20(row_19, value_986, msg_24);
        const handleAction_7_563 = buildMessageHeaderHtml(
            value_989,
            value_986,
            value_531,
            value_992,
            value_539,
            enabled_995,
            msg_24,
        );
        row_19.innerHTML =
            `
            <div class="chat-checkbox-wrapper" style="display:` +
            (window.imData.batchSelectMode ? 'flex' : 'none') +
            `;width:40px;justify-content:center;align-items:flex-end;padding-bottom:10px;flex-shrink:0;cursor:pointer;transition:all 0.2s;">
                <i class="far fa-circle chat-checkbox" data-timestamp="` +
            value_531 +
            `" style="color:#c7c7cc;font-size:22px;"></i>
            </div>
            <div style="flex:1;display:flex;flex-direction:column;min-width:0;">
                ` +
            handleAction_7_563 +
            `
                <div style="display:flex;justify-content:` +
            (value_989 ? 'flex-end' : 'flex-start') +
            `;align-items:flex-end;width:100%;">
                    ` +
            value_561 +
            `
                </div>
            </div>
        `;
        const card_4 = row_19.querySelector('.chat-link-card'),
            openFakeLink_3 = (event_1020) => {
                event_1020 && (event_1020.preventDefault(), event_1020.stopPropagation());
                handleAction_96(msg_24, value_986);
            };
        card_4 &&
            (card_4.addEventListener('click', openFakeLink_3),
            card_4.addEventListener('keydown', (event_13) => {
                if (event_13.key === 'Enter' || event_13.key === ' ') openFakeLink_3(event_13);
            }));
        const coverImage = row_19.querySelector('.chat-link-card-cover img');
        coverImage &&
            coverImage.addEventListener(
                'error',
                () => {
                    const cover = coverImage.closest('.chat-link-card-cover');
                    if (cover) cover.innerHTML = '<i class="fas fa-link"></i>';
                },
                {
                    once: true,
                },
            );
        element_529.appendChild(row_19);
        window.imChat.scrollToBottom(element_529);
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
    function formatOfflineMeetingTimestamp(timestamp_12) {
        const value_17 = Number(timestamp_12) || Date.now(),
            value_1030 = new Date(value_17),
            pad = (num) => String(num).padStart(2, '0');
        return (
            value_1030.getFullYear() +
            '年' +
            (value_1030.getMonth() + 1) +
            '月' +
            value_1030.getDate() +
            '日 ' +
            pad(value_1030.getHours()) +
            ':' +
            pad(value_1030.getMinutes())
        );
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
                <div class="voice-call-record-card im-card-content offline-meeting-record-card" aria-label="查看见面总结" style="max-width:84%; padding:11px 15px; border-radius:18px; background:rgba(0,0,0,0.05); color:#000; display:flex; align-items:flex-start; gap:10px; text-align:left;">
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
    window.imChat.renderSystemNoticeBubble = renderSystemNoticeBubble_2;
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
    window.imChat.sanitizeFakeLinkPagePackage = sanitizeFakeLinkPagePackage_3;
    window.imChat.renderFakeLinkWebPage = renderFakeLinkWebPage_2;
    window.imChat.stripFakeLinkHtmlToPlainText = stripFakeLinkHtmlToPlainText_3;
    window.imChat.renderPayTransferBubble = renderPayTransferBubble_2;
    window.imChat.renderVoiceMessageBubble = renderVoiceMessageBubble_2;
    function renderHtmlBubble_2(msg_29, value_588, element_589, value_590 = Date.now()) {
        const value_591 = msg_29.role === 'user',
            lastElementChild_592 = element_589.lastElementChild;
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
        const value_595 = msg_29.content || msg_29.text || '',
            handleAction_7_596 = buildMessageHeaderHtml(
                value_591,
                value_588,
                value_590,
                null,
                null,
                enabled_593,
                msg_29,
            ),
            value_597 = new Date(value_590),
            value_601 =
                typeof window.formatChatBubbleTime === 'function'
                    ? window.formatChatBubbleTime(value_590)
                    : value_597.getHours() +
                      ':' +
                      value_597.getMinutes().toString().padStart(2, '0');
        if (value_591) {
            const text_602 = '';
            row_21.innerHTML =
                `
                <div class="chat-checkbox-wrapper" style="display: ` +
                (window.imData.batchSelectMode ? 'flex' : 'none') +
                `; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">
                    <i class="far fa-circle chat-checkbox" data-timestamp="` +
                value_590 +
                `" style="color: #c7c7cc; font-size: 22px;"></i>
                </div>
                <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">
                    ` +
                handleAction_7_596 +
                `
                    <div style="display: flex; justify-content: flex-end; align-items: flex-end; width: 100%;">
                        <div class="chat-bubble html-bubble im-card-bubble" style="position: relative; background: transparent; padding: 0;">
                            ` +
                value_595 +
                `
                            <div style="position: absolute; bottom: 8px; right: -30px;">` +
                text_602 +
                `</div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            const text_603 = '';
            row_21.innerHTML =
                `
                <div class="chat-checkbox-wrapper" style="display: ` +
                (window.imData.batchSelectMode ? 'flex' : 'none') +
                `; width: 40px; justify-content: center; align-items: flex-end; padding-bottom: 10px; flex-shrink: 0; cursor: pointer; transition: all 0.2s;">
                    <i class="far fa-circle chat-checkbox" data-timestamp="` +
                value_590 +
                `" style="color: #c7c7cc; font-size: 22px;"></i>
                </div>
                <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">
                    ` +
                handleAction_7_596 +
                `
                    <div style="display: flex; justify-content: flex-start; align-items: flex-end; width: 100%;">
                        <div class="chat-bubble html-bubble im-card-bubble" style="position: relative; background: transparent; padding: 0;">
                            ` +
                value_595 +
                `
                            <div style="position: absolute; bottom: 8px; right: -25px;">` +
                text_603 +
                `</div>
                        </div>
                    </div>
                </div>
            `;
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
        const isSystem = msg_30.role === 'system',
            isUser_5 =
                msg_30.senderId ===
                    (window.imData.currentUser ? window.imData.currentUser.id : 'me') ||
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
                `
                <div style="width:100%; display:flex; justify-content:center; padding:2px 0; margin: 10px 0; cursor: pointer;">
                    <div class="voice-call-record-card im-card-content" style="max-width:80%; padding:10px 16px; border-radius:18px; background:rgba(0,0,0,0.05); color:#000; font-size:13px; line-height:1.4; text-align:center; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-phone-alt" style="color: #34c759;"></i>
                        <span>` +
                (msg_30.statusText || '群通话记录') +
                `</span>
                    </div>
                </div>
            `;
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
        const duration_3 = msg_30.duration || 0,
            padStart_612 = Math.floor(duration_3 / 60)
                .toString()
                .padStart(2, '0'),
            padStart_613 = (duration_3 % 60).toString().padStart(2, '0'),
            detailImageKey_2_2 = padStart_612 + ':' + padStart_613,
            value_615 = msg_30.isVideo ? 'Video Call' : 'Voice Call',
            statusText_2 = msg_30.statusText || '通话记录';
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
                `
            <div class="voice-call-record-card im-card-content" style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: ` +
                (isUser_5 ? '#e5e5ea' : '#f2f2f7') +
                `; border-radius: 18px; cursor: pointer; color: #111;">
                <div style="width: 32px; height: 32px; border-radius: 16px; background: ` +
                (statusText_2 === '已拒绝' || statusText_2 === '已取消' ? '#ff3b30' : '#34c759') +
                `; color: #fff; display: flex; justify-content: center; align-items: center; flex-shrink: 0;">
                    <i class="fas fa-phone-alt"></i>
                </div>
                <div>
                    <div style="font-size: 15px; font-weight: 600;">` +
                value_615 +
                `</div>
                    ` +
                text_1077 +
                `
                </div>
            </div>
        `,
            value_619 =
                typeof window.formatChatBubbleTime === 'function'
                    ? window.formatChatBubbleTime(timestamp_14)
                    : (() => {
                          const value_624 = new Date(timestamp_14);
                          return (
                              value_624.getHours() +
                              ':' +
                              value_624.getMinutes().toString().padStart(2, '0')
                          );
                      })(),
            headerHtml_3 = buildMessageHeaderHtml(
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
                `
                <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">
                    ` +
                headerHtml_3 +
                `
                    <div style="display: flex; justify-content: flex-end; align-items: flex-end; width: 100%;">
                        <div class="chat-bubble user-bubble im-card-bubble voice-call-record-bubble" style="padding: 0; background: transparent;">` +
                value_618 +
                text_625 +
                `</div>
                    </div>
                </div>
            `;
        } else {
            const text_626 = '';
            row_22.innerHTML =
                `
                <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">
                    ` +
                headerHtml_3 +
                `
                    <div style="display: flex; justify-content: flex-start; align-items: flex-end; width: 100%;">
                        <div class="chat-bubble ai-bubble im-card-bubble voice-call-record-bubble" style="padding: 0; background: transparent;">` +
                value_618 +
                text_626 +
                `</div>
                    </div>
                </div>
            `;
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
});
