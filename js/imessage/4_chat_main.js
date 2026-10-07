(
    window.u2OnStorageReady ||
    ((callback) => document.addEventListener('DOMContentLoaded', callback))
)(() => {
    const {
        apiConfig: apiConfig_2,
        userState: userState_2,
        openView: openView_2,
        closeView: closeView_2,
        showToast: showToast_2,
    } = window;
    async function commitMainFriendChange(friendOrId, value_11, value_12 = {}) {
        if (!window.imApp.commitFriendChange) return false;
        const targetId =
            typeof friendOrId === 'object' && friendOrId !== null ? friendOrId.id : friendOrId;
        return window.imApp.commitFriendChange(
            targetId,
            (currentActiveFriend_2) => {
                if (!currentActiveFriend_2) return;
                return (
                    window.imData.currentActiveFriend &&
                        String(window.imData.currentActiveFriend.id) ===
                            String(currentActiveFriend_2.id) &&
                        (window.imData.currentActiveFriend = currentActiveFriend_2),
                    value_11(currentActiveFriend_2)
                );
            },
            value_12,
        );
    }
    const chatsContent = document.getElementById('chats-content'),
        msgContextOverlay = document.getElementById('msg-context-overlay'),
        msgContextMenu = document.getElementById('msg-context-menu'),
        value_7 = new Map();
    function handleAction_8(element, element_15, value_16, innerHTML_2) {
        if (!element) return;
        const msgTranslationElement = element.querySelector('.msg-translation');
        if (value_16) {
            if (msgTranslationElement) return;
            const bubbleMetaElement = element.querySelector('.bubble-meta'),
                element_18 = document.createElement('div');
            element_18.className = 'msg-translation';
            element_18.style.cssText = element_15?.classList.contains('user-row')
                ? 'margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.4; word-wrap: break-word; white-space: normal;'
                : 'margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(0,0,0,0.1); font-size: 13px; color: #8e8e93; line-height: 1.4; word-wrap: break-word; white-space: normal;';
            element_18.innerHTML = innerHTML_2;
            if (bubbleMetaElement) element.insertBefore(element_18, bubbleMetaElement);
            else element.appendChild(element_18);
            return;
        }
        msgTranslationElement?.remove();
    }
    if (chatsContent) {
        let startX, startY;
        const startPress = (e_2) => {
                if (window.imData.batchSelectMode) return;
                const row = e_2.target.closest('.chat-row');
                if (!row || row.classList.contains('unblock-request-row')) return;
                if (window.imData.longPressTimer) clearTimeout(window.imData.longPressTimer);
                startX = e_2.type.includes('touch') ? e_2.touches[0].clientX : e_2.clientX;
                startY = e_2.type.includes('touch') ? e_2.touches[0].clientY : e_2.clientY;
                window.imData.longPressTimer = setTimeout(() => {
                    window.imData.longPressTimer = null;
                    window.imData.suppressCardClickUntil = Date.now() + 800;
                    window.imChat.showContextMenu(row, e_2);
                }, 500);
            },
            value_22 = (value_25) => {
                window.imData.longPressTimer &&
                    (clearTimeout(window.imData.longPressTimer),
                    (window.imData.longPressTimer = null));
            },
            movePress = (e_3) => {
                if (!window.imData.longPressTimer) return;
                const currentX = e_3.type.includes('mouse') ? e_3.pageX : e_3.touches[0].clientX,
                    currentY = e_3.type.includes('mouse') ? e_3.pageY : e_3.touches[0].clientY;
                (Math.abs(currentX - startX) > 10 || Math.abs(currentY - startY) > 10) &&
                    value_22();
            };
        chatsContent.addEventListener('touchstart', startPress, {
            passive: true,
        });
        chatsContent.addEventListener('touchend', value_22);
        chatsContent.addEventListener('touchmove', movePress, {
            passive: true,
        });
        chatsContent.addEventListener('mousedown', startPress);
        chatsContent.addEventListener('mouseup', value_22);
        chatsContent.addEventListener('mousemove', movePress);
        chatsContent.addEventListener('contextmenu', (event_29) => {
            event_29.target.closest('.chat-row') && event_29.preventDefault();
        });
        chatsContent.addEventListener('click', async (e_4) => {
            const selection = window.getSelection();
            if (selection && selection.toString().trim().length > 0) return;
            const bubble = e_4.target.closest('.chat-bubble');
            if (bubble) {
                if (bubble.querySelector('.chat-image-bubble-img')) return;
                if (bubble.classList.contains('pay-transfer-bubble')) return;
                if (bubble.classList.contains('group-red-packet-bubble')) return;
                if (bubble.classList.contains('moment-forward-bubble')) return;
                if (bubble.classList.contains('voice-message-bubble')) return;
                if (bubble.classList.contains('sticker-bubble')) return;
                if (bubble.classList.contains('voice-call-record-bubble')) return;
                const row_2 = bubble.closest('.chat-row');
                if (!row_2) return;
                const ts_2 = row_2.getAttribute('data-timestamp');
                if (ts_2 && window.imData.currentActiveFriend) {
                    const id_33 = window.imData.currentActiveFriend.id,
                        liveFriend =
                            (window.imData.friends || []).find(
                                (value_35) => String(value_35.id) === String(id_33),
                            ) || window.imData.currentActiveFriend,
                        msg = (liveFriend.messages || []).find(
                            (m_2) => String(m_2.timestamp) === String(ts_2),
                        );
                    if (msg && msg.translation) {
                        const showTranslation_2 = !msg.showTranslation,
                            translation_37 = msg.translation,
                            value_38 = id_33 + ':' + (msg.id || ts_2),
                            value_39 = (value_7.get(value_38) || 0) + 1,
                            showTranslation_3 = !!msg.showTranslation;
                        value_7.set(value_38, value_39);
                        msg.showTranslation = showTranslation_2;
                        handleAction_8(bubble, row_2, showTranslation_2, translation_37);
                        const value_41 = window.imApp.updateFriendMessage
                            ? await window.imApp.updateFriendMessage(
                                  id_33,
                                  {
                                      id: msg.id || null,
                                      timestamp: ts_2 || null,
                                  },
                                  (value_42) => {
                                      if (!value_42) return;
                                      value_42.showTranslation = showTranslation_2;
                                  },
                                  {
                                      silent: true,
                                  },
                              )
                            : await commitMainFriendChange(
                                  liveFriend,
                                  (value_43) => {
                                      if (!Array.isArray(value_43.messages)) return;
                                      const result_44 = value_43.messages.find(
                                          (message_45) =>
                                              String(message_45.timestamp) === String(ts_2),
                                      );
                                      if (!result_44) return;
                                      result_44.showTranslation = showTranslation_2;
                                  },
                                  {
                                      silent: true,
                                  },
                              );
                        if (value_7.get(value_38) !== value_39) return;
                        !value_41
                            ? ((msg.showTranslation = showTranslation_3),
                              handleAction_8(bubble, row_2, showTranslation_3, translation_37),
                              window.showToast?.('翻译状态保存失败'))
                            : value_7['delete'](value_38);
                    }
                }
            }
        });
    }
    msgContextOverlay &&
        msgContextOverlay.addEventListener('click', (e) => {
            if (e.target === msgContextOverlay) window.imChat.closeContextMenu();
        });
    function handleAction_9() {
        const currentActiveFriend_46 = window.imData.currentActiveFriend;
        if (currentActiveFriend_46?.id != null) {
            const page = document.getElementById('chat-interface-' + currentActiveFriend_46.id);
            if (page && page.classList.contains('active-chat-interface')) return page;
        }
        return document.querySelector(
            '.active-chat-interface[style*="display: flex"], .active-chat-interface[style*="display:flex"]',
        );
    }
    function prepareReplyFromCurrentContextRow() {
        const row_3 = window.imData.currentActiveRow;
        if (!row_3) return false;
        const messageId_2 = String(row_3.getAttribute('data-message-id') || '').trim(),
            messageTimestamp = String(row_3.getAttribute('data-timestamp') || '').trim(),
            activeFriend = window.imData.currentActiveFriend,
            sourceMessages = Array.isArray(activeFriend?.messages) ? activeFriend.messages : [],
            sourceMessage = window.imDataUtils?.findMessageByReference
                ? window.imDataUtils.findMessageByReference(
                      sourceMessages,
                      messageId_2,
                      messageTimestamp,
                  )
                : sourceMessages.find(
                      (message_2) => messageId_2 && String(message_2?.id || '') === messageId_2,
                  ) ||
                  sourceMessages.find(
                      (message_3) =>
                          messageTimestamp &&
                          String(message_3?.timestamp || '') === messageTimestamp,
                  ) ||
                  null;
        let text_2 =
            sourceMessage && window.imApp.getFriendMessagePreview
                ? String(window.imApp.getFriendMessagePreview(sourceMessage) || '').trim()
                : '';
        if (!text_2) {
            const bubble_2 =
                row_3.querySelector('.chat-bubble') || row_3.querySelector('.sticker-message-wrap');
            if (!bubble_2) return false;
            const clone = bubble_2.cloneNode(true);
            clone
                .querySelectorAll(
                    '.bubble-meta, .msg-translation, .msg-reply-quote, .bubble-reaction-icon',
                )
                .forEach((node) => node.remove());
            text_2 = (clone.innerText || clone.textContent || '').trim();
        }
        if (!text_2) return false;
        window.imData.currentReplyText = text_2;
        window.imData.currentReplyMessageId = sourceMessage?.id || messageId_2 || null;
        const page_2 = handleAction_9();
        if (page_2) {
            const previewContainer = page_2.querySelector('.reply-preview-container'),
                previewText = page_2.querySelector('.reply-preview-text'),
                input = page_2.querySelector('.chat-input');
            previewContainer &&
                previewText &&
                ((previewText.textContent = text_2), (previewContainer.style.display = 'block'));
            input && input.focus();
        }
        return true;
    }
    if (msgContextMenu) {
        let suppressReplyClickUntil = 0;
        const commitReplyMenuAction = (e_5) => {
                e_5.preventDefault();
                e_5.stopPropagation();
                suppressReplyClickUntil = Date.now() + 700;
                prepareReplyFromCurrentContextRow();
                window.imChat.closeContextMenu();
            },
            handleReplyPointerCommit = (e_6) => {
                const replyItem = e_6.target.closest('.msg-menu-item[data-action="reply"]');
                if (!replyItem) return;
                commitReplyMenuAction(e_6);
            };
        window.PointerEvent
            ? msgContextMenu.addEventListener('pointerup', handleReplyPointerCommit)
            : msgContextMenu.addEventListener('touchend', handleReplyPointerCommit);
        msgContextMenu.addEventListener('click', async (e_7) => {
            const menuItem = e_7.target.closest('.msg-menu-item');
            if (menuItem) {
                const action = menuItem.getAttribute('data-action');
                if (action === 'reply') {
                    if (Date.now() < suppressReplyClickUntil) {
                        e_7.preventDefault();
                        e_7.stopPropagation();
                        return;
                    }
                    commitReplyMenuAction(e_7);
                    return;
                }
                if (action === 'select') {
                    if (window.imData.currentActiveRow) {
                        const row_4 = window.imData.currentActiveRow,
                            page_3 = handleAction_9(),
                            activeFriend_2 = window.imData.currentActiveFriend;
                        page_3 &&
                            activeFriend_2 &&
                            window.imChat.enterBatchSelectMode &&
                            window.imChat.enterBatchSelectMode(activeFriend_2, row_4, page_3);
                    }
                    window.imChat.closeContextMenu();
                    return;
                }
                if (action === 'forward') {
                    const currentActiveRow_70 = window.imData.currentActiveRow,
                        currentActiveFriend_71 = window.imData.currentActiveFriend;
                    if (currentActiveRow_70 && currentActiveFriend_71) {
                        const id_2 = currentActiveRow_70.getAttribute('data-message-id'),
                            timestamp_2 = currentActiveRow_70.getAttribute('data-timestamp'),
                            liveFriend_2 =
                                (window.imData.friends || []).find(
                                    (value_76) =>
                                        String(value_76.id) === String(currentActiveFriend_71.id),
                                ) || currentActiveFriend_71,
                            messages_2 = window.imApp.findForwardMessagesByDescriptors
                                ? window.imApp.findForwardMessagesByDescriptors(liveFriend_2, [
                                      {
                                          id: id_2,
                                          timestamp: timestamp_2,
                                      },
                                  ])
                                : [];
                        window.imChat.closeContextMenu();
                        window.imChat.openChatRecordForwardPicker?.(liveFriend_2, messages_2);
                    } else window.imChat.closeContextMenu();
                    return;
                }
                if (action === 'more') {
                    const moreActions = document.getElementById('msg-context-more-actions'),
                        mainActions = document.getElementById('msg-context-actions');
                    moreActions &&
                        mainActions &&
                        ((mainActions.style.display = 'none'),
                        (moreActions.style.display = 'flex'),
                        requestAnimationFrame(() => {
                            window.imChat.fitContextMenuToViewport?.();
                        }));
                    return;
                }
                if (action === 'recall') {
                    const row_5 = window.imData.currentActiveRow,
                        activeFriend_3 = window.imData.currentActiveFriend;
                    if (!row_5 || !activeFriend_3) {
                        window.imChat.closeContextMenu();
                        return;
                    }
                    const messageId_3 = row_5.getAttribute('data-message-id'),
                        timestamp_3 = row_5.getAttribute('data-timestamp'),
                        liveFriend_3 =
                            (window.imData.friends || []).find(
                                (value_86) => String(value_86.id) === String(activeFriend_3.id),
                            ) || activeFriend_3,
                        targetMessage = (liveFriend_3.messages || []).find((message_87) => {
                            if (!message_87) return false;
                            if (messageId_3 && String(message_87.id) === String(messageId_3))
                                return true;
                            return (
                                timestamp_3 && String(message_87.timestamp) === String(timestamp_3)
                            );
                        });
                    if (!window.imApp?.isRecallableUserMessage?.(targetMessage)) {
                        if (window.showToast) window.showToast('这条消息不能撤回');
                        window.imChat.closeContextMenu();
                        return;
                    }
                    const recalledNotice = window.imApp.createRecalledNoticeMessage(targetMessage, {
                            actorRole: 'user',
                            actorName: window.userState?.name || 'User',
                        }),
                        saved = window.imApp.updateFriendMessage
                            ? await window.imApp.updateFriendMessage(
                                  liveFriend_3.id,
                                  {
                                      id: messageId_3 || targetMessage.id || null,
                                      timestamp: timestamp_3 || targetMessage.timestamp || null,
                                  },
                                  (storedMessage) => {
                                      Object.keys(storedMessage).forEach(
                                          (key) => delete storedMessage[key],
                                      );
                                      Object.assign(storedMessage, recalledNotice);
                                  },
                                  {
                                      silent: true,
                                  },
                              )
                            : false;
                    if (!saved) {
                        if (window.showToast) window.showToast('撤回消息失败');
                        window.imChat.closeContextMenu();
                        return;
                    }
                    const updatedFriend = window.imApp.getFriendById
                            ? window.imApp.getFriendById(liveFriend_3.id) || liveFriend_3
                            : liveFriend_3,
                        closest_85 = row_5.closest('.ins-chat-messages');
                    closest_85 &&
                        window.imChat.rerenderChatContainer &&
                        window.imChat.rerenderChatContainer(updatedFriend, closest_85, {
                            scroll: true,
                        });
                    if (window.showToast) window.showToast('已撤回');
                    window.imChat.closeContextMenu();
                    return;
                }
                if (action === 'delete') {
                    if (window.imData.currentActiveRow && window.imData.currentActiveFriend) {
                        const currentActiveRow_88 = window.imData.currentActiveRow,
                            ts = currentActiveRow_88.getAttribute('data-timestamp'),
                            messageId = currentActiveRow_88.getAttribute('data-message-id'),
                            saved_2 = window.imApp.removeFriendMessages
                                ? await window.imApp.removeFriendMessages(
                                      window.imData.currentActiveFriend.id,
                                      {
                                          id: messageId || null,
                                          timestamp: ts || null,
                                      },
                                      {
                                          silent: true,
                                      },
                                  )
                                : await commitMainFriendChange(
                                      window.imData.currentActiveFriend,
                                      (targetFriend) => {
                                          if (!Array.isArray(targetFriend.messages)) return;
                                          targetFriend.messages = targetFriend.messages.filter(
                                              (m) => {
                                                  if (!m) return false;
                                                  if (
                                                      messageId &&
                                                      String(m.id) === String(messageId)
                                                  )
                                                      return false;
                                                  if (ts && String(m.timestamp) === String(ts))
                                                      return false;
                                                  return true;
                                              },
                                          );
                                      },
                                      {
                                          silent: true,
                                      },
                                  );
                        if (!saved_2) {
                            if (window.showToast) window.showToast('删除消息失败');
                            window.imChat.closeContextMenu();
                            return;
                        }
                        const latestFriend = window.imApp.getFriendById
                                ? window.imApp.getFriendById(
                                      window.imData.currentActiveFriend.id,
                                  ) || window.imData.currentActiveFriend
                                : window.imData.currentActiveFriend,
                            container = currentActiveRow_88.closest('.ins-chat-messages');
                        if (container) {
                            const removed = window.imChat.removeMessageFromContainer
                                ? window.imChat.removeMessageFromContainer(
                                      container,
                                      {
                                          id: messageId || null,
                                          timestamp: ts || null,
                                      },
                                      {
                                          scroll: true,
                                      },
                                  )
                                : false;
                            !removed &&
                                window.imChat.rerenderChatContainer &&
                                window.imChat.rerenderChatContainer(latestFriend, container, {
                                    scroll: true,
                                });
                        }
                        if (window.showToast) window.showToast('已删除该消息');
                    }
                } else {
                    if (action === 'copy') {
                        if (window.imData.currentActiveRow) {
                            const bubble_3 =
                                window.imData.currentActiveRow.querySelector('.chat-bubble');
                            if (bubble_3) {
                                const text_3 = bubble_3.innerText || bubble_3.textContent;
                                navigator.clipboard
                                    .writeText(text_3)
                                    .then(() => {
                                        if (window.showToast) window.showToast('已复制');
                                    })
                                    ['catch'](() => {
                                        if (window.showToast) window.showToast('已复制');
                                    });
                            }
                        }
                    } else {
                        if (action === 'speak') {
                            if (
                                window.imData.currentActiveRow &&
                                window.imData.currentActiveFriend
                            ) {
                                const row_6 = window.imData.currentActiveRow,
                                    ts_3 = row_6.getAttribute('data-timestamp'),
                                    messageId_4 = row_6.getAttribute('data-message-id'),
                                    friendId = window.imData.currentActiveFriend.id,
                                    liveFriend_4 =
                                        (window.imData.friends || []).find(
                                            (value_51) => String(value_51.id) === String(friendId),
                                        ) || window.imData.currentActiveFriend,
                                    msg_2 = (liveFriend_4.messages || []).find((message_52) => {
                                        if (!message_52) return false;
                                        if (
                                            messageId_4 &&
                                            String(message_52.id) === String(messageId_4)
                                        )
                                            return true;
                                        return (
                                            ts_3 && String(message_52.timestamp) === String(ts_3)
                                        );
                                    });
                                if (
                                    row_6.classList.contains('user-row') &&
                                    (msg_2?.type === 'voice_message' ||
                                        row_6.querySelector('.voice-message-bubble'))
                                ) {
                                    window.imChat.closeContextMenu();
                                    return;
                                }
                                const bubble_4 = row_6.querySelector('.chat-bubble');
                                let text_4 =
                                    msg_2?.type === 'voice_message'
                                        ? msg_2.transcript || msg_2.text || ''
                                        : msg_2 &&
                                          (msg_2.content || msg_2.text || msg_2.description || '');
                                if (!text_4 && bubble_4) {
                                    const clone_2 = bubble_4.cloneNode(true);
                                    clone_2
                                        .querySelectorAll(
                                            '.bubble-meta, .msg-translation, .msg-reply-quote, .bubble-reaction-icon',
                                        )
                                        .forEach((node_2) => node_2.remove());
                                    text_4 = clone_2.innerText || clone_2.textContent || '';
                                }
                                const ttsMessage = msg_2 || {
                                        role: row_6.classList.contains('user-row')
                                            ? 'user'
                                            : 'assistant',
                                        speaker: row_6.getAttribute('data-speaker') || '',
                                        speakerMemberId:
                                            row_6.getAttribute('data-speaker-member-id') || null,
                                    },
                                    ttsFriend = window.u2Tts?.resolveMessageTtsFriend
                                        ? window.u2Tts.resolveMessageTtsFriend(
                                              liveFriend_4,
                                              ttsMessage,
                                          )
                                        : liveFriend_4,
                                    canSpeakTts = window.u2Tts?.canSpeakForFriend
                                        ? window.u2Tts.canSpeakForFriend(ttsFriend)
                                        : true;
                                if (!canSpeakTts) {
                                    window.imChat.closeContextMenu();
                                    return;
                                }
                                try {
                                    if (
                                        !window.u2Tts ||
                                        typeof window.u2Tts.speakTextCached !== 'function'
                                    )
                                        throw new Error('TTS 未初始化');
                                    const cacheOwner =
                                            msg_2 && typeof msg_2 === 'object' ? msg_2 : {},
                                        audioUrl = await window.u2Tts.speakTextCached(
                                            text_4,
                                            ttsFriend,
                                            cacheOwner,
                                        );
                                    audioUrl &&
                                        msg_2 &&
                                        typeof msg_2 === 'object' &&
                                        !msg_2.ttsAudioUrl &&
                                        window.imApp?.updateFriendMessage &&
                                        (await window.imApp.updateFriendMessage(
                                            friendId,
                                            {
                                                id: msg_2.id || messageId_4 || null,
                                                timestamp: ts_3 || null,
                                            },
                                            (targetMsg) => {
                                                if (targetMsg) targetMsg.ttsAudioUrl = audioUrl;
                                            },
                                            {
                                                silent: true,
                                            },
                                        ));
                                } catch (error_2) {
                                    console.error('TTS speech failed', error_2);
                                    if (
                                        (!window.u2Api?.isRequestError?.(error_2) ||
                                            !window.u2Api.reportError(error_2, {
                                                operation: '语音生成',
                                            })) &&
                                        window.showToast
                                    )
                                        window.showToast(
                                            window.u2Tts?.getUserErrorMessage?.(error_2) ||
                                                '语音播放失败',
                                        );
                                }
                            }
                        } else {
                            if (action === 'translate') {
                                if (window.imData.currentActiveRow) {
                                    const currentActiveRow_111 = window.imData.currentActiveRow,
                                        attribute_112 =
                                            currentActiveRow_111.getAttribute('data-timestamp');
                                    if (attribute_112 && window.imData.currentActiveFriend) {
                                        const id_113 = window.imData.currentActiveFriend.id,
                                            value_114 =
                                                (window.imData.friends || []).find(
                                                    (value_118) =>
                                                        String(value_118.id) === String(id_113),
                                                ) || window.imData.currentActiveFriend,
                                            attribute_115 =
                                                currentActiveRow_111.getAttribute(
                                                    'data-message-id',
                                                ),
                                            options = {
                                                id: attribute_115 || null,
                                                timestamp: attribute_112 || null,
                                            },
                                            value_116 = window.imApp.findFriendMessageIndex
                                                ? window.imApp.findFriendMessageIndex(
                                                      value_114,
                                                      options,
                                                  )
                                                : (value_114.messages || []).findIndex(
                                                      (message_119) =>
                                                          String(message_119.timestamp) ===
                                                          String(attribute_112),
                                                  ),
                                            value_117 =
                                                value_116 >= 0
                                                    ? value_114.messages[value_116]
                                                    : null;
                                        if (value_117) {
                                            if (value_117.translation) {
                                                const showTranslation_4 =
                                                        !value_117.showTranslation,
                                                    innerHTML_4 = value_117.translation,
                                                    saved_3 = window.imApp.updateFriendMessage
                                                        ? await window.imApp.updateFriendMessage(
                                                              id_113,
                                                              {
                                                                  id: value_117.id || null,
                                                                  timestamp: attribute_112 || null,
                                                              },
                                                              (value_124) => {
                                                                  if (!value_124) return;
                                                                  value_124.showTranslation =
                                                                      showTranslation_4;
                                                              },
                                                              {
                                                                  silent: true,
                                                              },
                                                          )
                                                        : await commitMainFriendChange(
                                                              value_114,
                                                              (value_125) => {
                                                                  if (
                                                                      !Array.isArray(
                                                                          value_125.messages,
                                                                      )
                                                                  )
                                                                      return;
                                                                  const result_126 =
                                                                      value_125.messages.find(
                                                                          (message_127) =>
                                                                              String(
                                                                                  message_127.timestamp,
                                                                              ) ===
                                                                              String(attribute_112),
                                                                      );
                                                                  if (!result_126) return;
                                                                  result_126.showTranslation =
                                                                      showTranslation_4;
                                                              },
                                                              {
                                                                  silent: true,
                                                              },
                                                          );
                                                if (!saved_3) {
                                                    if (window.showToast)
                                                        window.showToast('翻译状态保存失败');
                                                    window.imChat.closeContextMenu();
                                                    return;
                                                }
                                                const chatBubbleElement_123 =
                                                    currentActiveRow_111.querySelector(
                                                        '.chat-bubble',
                                                    );
                                                if (chatBubbleElement_123) {
                                                    const msgTranslationElement_128 =
                                                        chatBubbleElement_123.querySelector(
                                                            '.msg-translation',
                                                        );
                                                    if (showTranslation_4) {
                                                        if (!msgTranslationElement_128) {
                                                            const bubbleMetaElement_129 =
                                                                    chatBubbleElement_123.querySelector(
                                                                        '.bubble-meta',
                                                                    ),
                                                                element_130 =
                                                                    document.createElement('div');
                                                            element_130.className =
                                                                'msg-translation';
                                                            currentActiveRow_111.classList.contains(
                                                                'user-row',
                                                            )
                                                                ? (element_130.style.cssText =
                                                                      'margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.4; word-wrap: break-word; white-space: normal;')
                                                                : (element_130.style.cssText =
                                                                      'margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(0,0,0,0.1); font-size: 13px; color: #8e8e93; line-height: 1.4; word-wrap: break-word; white-space: normal;');
                                                            element_130.innerHTML = innerHTML_4;
                                                            bubbleMetaElement_129
                                                                ? chatBubbleElement_123.insertBefore(
                                                                      element_130,
                                                                      bubbleMetaElement_129,
                                                                  )
                                                                : chatBubbleElement_123.appendChild(
                                                                      element_130,
                                                                  );
                                                        }
                                                    } else
                                                        msgTranslationElement_128 &&
                                                            msgTranslationElement_128.remove();
                                                }
                                            } else {
                                                if (window.showToast)
                                                    window.showToast('该消息无需翻译或暂无翻译');
                                            }
                                        }
                                    }
                                }
                                window.imChat.closeContextMenu();
                                return;
                            } else {
                                if (action === 'edit') {
                                    if (window.imData.currentActiveRow) {
                                        const currentActiveRow_131 = window.imData.currentActiveRow,
                                            attribute_132 =
                                                currentActiveRow_131.getAttribute('data-timestamp');
                                        if (attribute_132 && window.imData.currentActiveFriend) {
                                            const friendId_2 = window.imData.currentActiveFriend.id,
                                                liveFriend_5 =
                                                    (window.imData.friends || []).find(
                                                        (value_139) =>
                                                            String(value_139.id) ===
                                                            String(friendId_2),
                                                    ) || window.imData.currentActiveFriend,
                                                attribute_135 =
                                                    currentActiveRow_131.getAttribute(
                                                        'data-message-id',
                                                    ),
                                                options_136 = {
                                                    id: attribute_135 || null,
                                                    timestamp: attribute_132 || null,
                                                },
                                                value_137 = window.imApp.findFriendMessageIndex
                                                    ? window.imApp.findFriendMessageIndex(
                                                          liveFriend_5,
                                                          options_136,
                                                      )
                                                    : (liveFriend_5.messages || []).findIndex(
                                                          (message_140) =>
                                                              String(message_140.timestamp) ===
                                                              String(attribute_132),
                                                      ),
                                                message_138 =
                                                    value_137 >= 0
                                                        ? liveFriend_5.messages[value_137]
                                                        : null;
                                            if (message_138) {
                                                if (window.showCustomModal) {
                                                    const defaultValue_2 =
                                                            typeof message_138.translation ===
                                                                'string' &&
                                                            message_138.translation.trim()
                                                                ? message_138.translation
                                                                : typeof message_138.translationZh ===
                                                                        'string' &&
                                                                    message_138.translationZh.trim()
                                                                  ? message_138.translationZh
                                                                  : '',
                                                        value_142 = !!defaultValue_2;
                                                    window.showCustomModal({
                                                        type: 'prompt',
                                                        title: '编辑消息',
                                                        placeholder: '修改内容...',
                                                        multiline: true,
                                                        textareaLabel: value_142 ? '默认语言' : '',
                                                        defaultValue: message_138.content || '',
                                                        secondaryTextarea: value_142
                                                            ? {
                                                                  label: '翻译',
                                                                  defaultValue: defaultValue_2,
                                                                  placeholder:
                                                                      '修改翻译（留空将清除）',
                                                              }
                                                            : null,
                                                        confirmText: '保存',
                                                        confirmTone: 'dark',
                                                        onConfirm: async (
                                                            value_143,
                                                            value_144 = {},
                                                        ) => {
                                                            if (
                                                                value_143 !== null &&
                                                                value_143.trim() !== ''
                                                            ) {
                                                                const content_2 = value_143.trim(),
                                                                    value_146 = value_142
                                                                        ? String(
                                                                              value_144.secondaryValue ||
                                                                                  '',
                                                                          ).trim()
                                                                        : null,
                                                                    saved_4 = window.imApp
                                                                        .updateFriendMessage
                                                                        ? await window.imApp.updateFriendMessage(
                                                                              friendId_2,
                                                                              {
                                                                                  id:
                                                                                      message_138.id ||
                                                                                      attribute_135 ||
                                                                                      null,
                                                                                  timestamp:
                                                                                      message_138.timestamp ||
                                                                                      attribute_132 ||
                                                                                      null,
                                                                              },
                                                                              (message_149) => {
                                                                                  if (!message_149)
                                                                                      return;
                                                                                  message_149.content =
                                                                                      content_2;
                                                                                  value_142 &&
                                                                                      ((message_149.translation =
                                                                                          value_146),
                                                                                      Object.prototype.hasOwnProperty.call(
                                                                                          message_149,
                                                                                          'translationZh',
                                                                                      ) &&
                                                                                          (message_149.translationZh =
                                                                                              value_146));
                                                                              },
                                                                              {
                                                                                  silent: true,
                                                                              },
                                                                          )
                                                                        : await commitMainFriendChange(
                                                                              liveFriend_5,
                                                                              (value_150) => {
                                                                                  if (
                                                                                      !Array.isArray(
                                                                                          value_150.messages,
                                                                                      )
                                                                                  )
                                                                                      return;
                                                                                  const result_151 =
                                                                                      value_150.messages.find(
                                                                                          (
                                                                                              message_152,
                                                                                          ) =>
                                                                                              String(
                                                                                                  message_152.timestamp,
                                                                                              ) ===
                                                                                              String(
                                                                                                  attribute_132,
                                                                                              ),
                                                                                      );
                                                                                  if (!result_151)
                                                                                      return;
                                                                                  result_151.content =
                                                                                      content_2;
                                                                                  value_142 &&
                                                                                      ((result_151.translation =
                                                                                          value_146),
                                                                                      Object.prototype.hasOwnProperty.call(
                                                                                          result_151,
                                                                                          'translationZh',
                                                                                      ) &&
                                                                                          (result_151.translationZh =
                                                                                              value_146));
                                                                              },
                                                                              {
                                                                                  silent: true,
                                                                              },
                                                                          );
                                                                if (!saved_4) {
                                                                    if (window.showToast)
                                                                        window.showToast(
                                                                            '消息保存失败',
                                                                        );
                                                                    return;
                                                                }
                                                                const container_2 =
                                                                    currentActiveRow_131.closest(
                                                                        '.ins-chat-messages',
                                                                    );
                                                                if (
                                                                    container_2 &&
                                                                    window.imChat
                                                                        .rerenderChatContainer
                                                                ) {
                                                                    const updatedFriend_2 =
                                                                        (
                                                                            window.imData.friends ||
                                                                            []
                                                                        ).find(
                                                                            (f) =>
                                                                                String(f.id) ===
                                                                                String(friendId_2),
                                                                        ) || liveFriend_5;
                                                                    window.imChat.rerenderChatContainer(
                                                                        updatedFriend_2,
                                                                        container_2,
                                                                        {
                                                                            scroll: true,
                                                                        },
                                                                    );
                                                                }
                                                            }
                                                        },
                                                    });
                                                }
                                            }
                                        }
                                    }
                                    window.imChat.closeContextMenu();
                                    return;
                                } else {
                                    if (window.showToast) window.showToast(action + ' 功能未实现');
                                }
                            }
                        }
                    }
                }
                window.imChat.closeContextMenu();
                return;
            }
            const reaction = e_7.target.closest('.msg-reaction');
            if (reaction) {
                const innerHTML_2_2 = reaction.innerHTML;
                if (window.imData.currentActiveRow) {
                    const bubble_5 = window.imData.currentActiveRow.querySelector('.chat-bubble');
                    if (bubble_5) {
                        const existingReaction = bubble_5.querySelector('.bubble-reaction-icon');
                        existingReaction && existingReaction.remove();
                        const reactionBadge = document.createElement('div');
                        reactionBadge.className = 'bubble-reaction-icon';
                        reactionBadge.innerHTML = innerHTML_2_2;
                        reactionBadge.style.position = 'absolute';
                        reactionBadge.style.bottom = '-8px';
                        reactionBadge.style.left = '-8px';
                        reactionBadge.style.width = '24px';
                        reactionBadge.style.height = '24px';
                        reactionBadge.style.backgroundColor = '#f2f2f7';
                        reactionBadge.style.border = '2px solid #ffffff';
                        reactionBadge.style.borderRadius = '50%';
                        reactionBadge.style.display = 'flex';
                        reactionBadge.style.justifyContent = 'center';
                        reactionBadge.style.alignItems = 'center';
                        reactionBadge.style.fontSize = '12px';
                        reactionBadge.style.color = '#8e8e93';
                        reactionBadge.style.zIndex = '10';
                        reactionBadge.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                        bubble_5.style.position = 'relative';
                        window.imData.currentActiveRow.classList.contains('user-row') &&
                            ((reactionBadge.style.left = 'auto'),
                            (reactionBadge.style.right = '-8px'));
                        reactionBadge.textContent.includes('HA') &&
                            ((reactionBadge.style.fontSize = '8px'),
                            (reactionBadge.style.fontWeight = '900'),
                            (reactionBadge.style.lineHeight = '0.9'),
                            (reactionBadge.style.letterSpacing = '-0.5px'),
                            (reactionBadge.style.fontFamily = 'sans-serif'));
                        bubble_5.appendChild(reactionBadge);
                    }
                }
                window.imChat.closeContextMenu();
                return;
            }
        });
    }
    window.imApp.updateChatsView = window.imChat.updateChatsView;
    window.imApp.renderChatsList = window.imChat.renderChatsList;
    window.imApp.openChatTab = window.imChat.openChatTab;
    window.imApp.scrollToBottom = window.imChat.scrollToBottom;
    window.imApp.renderTimestamp = window.imChat.renderTimestamp;
    window.imApp.renderMomentForwardBubble = window.imChat.renderMomentForwardBubble;
    window.imApp.renderImageBubble = window.imChat.renderImageBubble;
    window.imApp.renderPayTransferBubble = window.imChat.renderPayTransferBubble;
    window.imApp.openAttachmentSheet = window.imChat.openAttachmentSheet;
    window.imApp.showBannerNotification = window.showBannerNotification;
});
