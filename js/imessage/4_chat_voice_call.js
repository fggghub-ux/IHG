(function () {
    window.imChat = window.imChat || {};
    let callTimer = null,
        callSeconds = 0,
        callFriend = null,
        items = [],
        count = 0,
        lastCallAiTurn = null,
        value_3 = null,
        value_4 = null,
        activeSingleCallContext = null;
    const isAndroidCallInput =
        !!window.mobileInputCompat?.isAndroid || /Android/i.test(navigator.userAgent || '');
    window.imChat.getActiveSingleCallContext = function (friendOrId) {
        if (!activeSingleCallContext?.connected) return null;
        const friendId_2 =
            friendOrId && typeof friendOrId === 'object' ? friendOrId.id : friendOrId;
        if (String(friendId_2 ?? '') !== activeSingleCallContext.friendId) return null;
        return {
            active: true,
            connected: true,
            minimized: !!activeSingleCallContext.minimized,
            friendId: activeSingleCallContext.friendId,
            durationSeconds: callSeconds,
        };
    };
    function bindCallFocusPreservingAction(element, handler) {
        if (!element || typeof handler !== 'function') return function () {};
        let lastPointerActivationAt = 0;
        const invoke = (value_23) => {
                try {
                    const value_22_24 = handler(value_23);
                    value_22_24 &&
                        typeof value_22_24['catch'] === 'function' &&
                        value_22_24['catch']((error_2) =>
                            console.error('[iMessage call] action failed', error_2),
                        );
                } catch (value_26) {
                    console.error('[iMessage call] action failed', value_26);
                }
            },
            handlePointerDown = (event) => {
                if (!isAndroidCallInput || (event.button !== undefined && event.button !== 0))
                    return;
                event.preventDefault();
                lastPointerActivationAt = Date.now();
                invoke(event);
            },
            handleClick = (event_2) => {
                if (isAndroidCallInput && Date.now() - lastPointerActivationAt < 700) {
                    event_2.preventDefault();
                    return;
                }
                invoke(event_2);
            };
        return (
            element.addEventListener('pointerdown', handlePointerDown, {
                passive: false,
            }),
            element.addEventListener('click', handleClick),
            () => {
                element.removeEventListener('pointerdown', handlePointerDown);
                element.removeEventListener('click', handleClick);
            }
        );
    }
    function handleAction_6(input_2, timeout = 460) {
        if (!isAndroidCallInput || !input_2 || document.activeElement !== input_2)
            return Promise.resolve();
        input_2.blur();
        const viewport = window.visualViewport;
        if (!viewport) return new Promise((resolve_2) => setTimeout(resolve_2, 280));
        const startingHeight = Math.round(viewport.height || 0);
        let lastHeight = startingHeight,
            stableFrames = 0;
        return new Promise((resolve_3) => {
            let finished = false;
            const finish = () => {
                    if (finished) return;
                    finished = true;
                    resolve_3();
                },
                hardTimeout = setTimeout(finish, timeout),
                check = () => {
                    if (finished) return;
                    const height_2 = Math.round(viewport.height || 0);
                    stableFrames = Math.abs(height_2 - lastHeight) <= 1 ? stableFrames + 1 : 0;
                    lastHeight = height_2;
                    if (height_2 >= startingHeight + 72 && stableFrames >= 2) {
                        clearTimeout(hardTimeout);
                        finish();
                        return;
                    }
                    requestAnimationFrame(check);
                };
            requestAnimationFrame(check);
        });
    }
    function bindCallVisualViewport(input_3, root_2, options_2 = {}) {
        if (
            window.appViewport?.managed ||
            !window.mobileInputCompat?.isAndroid ||
            !input_3 ||
            !root_2
        )
            return function () {};
        const viewport_2 = window.visualViewport,
            text_2 = options_2.keepRootAnchored === true,
            root_3 = text_2 ? options_2.viewportContent || root_2 : root_2,
            bottomControls_2 = options_2.bottomControls || null,
            collapseElements_2 = (options_2.collapseElements || []).filter(Boolean),
            originalRoot = {
                height: root_2.style.height,
                top: root_2.style.top,
                bottom: root_2.style.bottom,
            },
            originalRoot_2 = {
                height: root_3.style.height,
                top: root_3.style.top,
                bottom: root_3.style.bottom,
            },
            paddingBottom_2 = bottomControls_2?.style.paddingBottom || '',
            originalDisplays = collapseElements_2.map((element_2) => element_2.style.display),
            items_43 = [];
        let scrollLeft_2 = Math.round(
                window.scrollX ||
                    document.documentElement?.scrollLeft ||
                    document.body?.scrollLeft ||
                    0,
            ),
            scrollTop_2 = Math.round(
                window.scrollY ||
                    document.documentElement?.scrollTop ||
                    document.body?.scrollTop ||
                    0,
            ),
            callFriend_2 = false;
        const value_46 = () => {
                if (!text_2 || !callFriend_2) return;
                try {
                    window.scrollTo(scrollLeft_2, scrollTop_2);
                } catch (value_61) {}
                document.documentElement &&
                    ((document.documentElement.scrollLeft = scrollLeft_2),
                    (document.documentElement.scrollTop = scrollTop_2));
                document.body &&
                    ((document.body.scrollLeft = scrollLeft_2),
                    (document.body.scrollTop = scrollTop_2));
            },
            value_47 = () => {
                if (!text_2 || !callFriend_2) return;
                items_43.splice(0).forEach((value_62) => clearTimeout(value_62));
                requestAnimationFrame(value_46);
                [0, 60, 180, 360].forEach((value_63) => {
                    items_43.push(setTimeout(value_46, value_63));
                });
            },
            value_48 = () => {
                if (!text_2 || !callFriend_2) return;
                value_47();
                items_43.push(
                    setTimeout(() => {
                        value_46();
                        callFriend_2 = false;
                    }, 420),
                );
            },
            value_49 = () => {
                const layoutHeight_2 = Math.round(window.innerHeight || viewport_2?.height || 0),
                    visualHeight_2 = Math.round(viewport_2?.height || layoutHeight_2),
                    viewportOffsetTop = Math.round(viewport_2?.offsetTop || 0),
                    documentScrollTop = Math.round(
                        window.scrollY ||
                            document.documentElement?.scrollTop ||
                            document.body?.scrollTop ||
                            0,
                    );
                return {
                    layoutHeight: layoutHeight_2,
                    visualHeight: visualHeight_2,
                    origin: Math.max(0, documentScrollTop + viewportOffsetTop),
                };
            },
            initialViewport = value_49();
        let restingHeight = Math.max(initialViewport.layoutHeight, initialViewport.visualHeight),
            restingLayoutHeight = initialViewport.layoutHeight,
            restingViewportOrigin = initialViewport.origin,
            keyboardWasOpen = false;
        const captureRestingViewport = (value_68 = {}) => {
                const metrics = value_49();
                restingHeight = Math.max(restingHeight, metrics.layoutHeight, metrics.visualHeight);
                restingLayoutHeight = Math.max(restingLayoutHeight, metrics.layoutHeight);
                text_2 &&
                    !keyboardWasOpen &&
                    value_68.refreshScroll !== false &&
                    ((scrollLeft_2 = Math.round(
                        window.scrollX ||
                            document.documentElement?.scrollLeft ||
                            document.body?.scrollLeft ||
                            0,
                    )),
                    (scrollTop_2 = Math.round(
                        window.scrollY ||
                            document.documentElement?.scrollTop ||
                            document.body?.scrollTop ||
                            0,
                    )));
                value_68.refreshOrigin !== false &&
                    !keyboardWasOpen &&
                    (restingViewportOrigin = metrics.origin);
            },
            value_56 = (value_70 = false) => {
                text_2
                    ? ((root_3.style.height = originalRoot_2.height),
                      (root_3.style.top = originalRoot_2.top),
                      (root_3.style.bottom = originalRoot_2.bottom))
                    : ((root_2.style.height = originalRoot.height),
                      (root_2.style.top = originalRoot.top),
                      (root_2.style.bottom = originalRoot.bottom));
                root_2.classList.remove('im-call-keyboard-open');
                if (bottomControls_2) bottomControls_2.style.paddingBottom = paddingBottom_2;
                collapseElements_2.forEach((element_3, index) => {
                    element_3.style.display = originalDisplays[index];
                });
                value_70 &&
                    requestAnimationFrame(() => {
                        options_2.scrollContainer &&
                            (options_2.scrollContainer.scrollTop =
                                options_2.scrollContainer.scrollHeight);
                    });
            },
            applyViewport = () => {
                text_2 &&
                    (document.activeElement === input_3 || keyboardWasOpen) &&
                    ((callFriend_2 = true), value_46());
                const metrics_2 = value_49(),
                    layoutAlreadyResized = restingLayoutHeight - metrics_2.layoutHeight > 100,
                    viewportHeight = layoutAlreadyResized
                        ? metrics_2.layoutHeight
                        : metrics_2.visualHeight,
                    viewportOrigin = metrics_2.origin;
                if (viewportHeight <= 0) return;
                const focused = document.activeElement === input_3,
                    heightReduced = restingHeight - viewportHeight > 100,
                    originMoved = Math.abs(viewportOrigin - restingViewportOrigin) > 72,
                    value_79 = focused && (heightReduced || (!text_2 && originMoved));
                if (!value_79) {
                    const value_80 =
                        keyboardWasOpen &&
                        !focused &&
                        (restingHeight - viewportHeight > 72 ||
                            (!text_2 && Math.abs(viewportOrigin - restingViewportOrigin) > 48));
                    if (value_80) return;
                    const value_81 = keyboardWasOpen;
                    keyboardWasOpen = false;
                    value_56(value_81);
                    (!focused || viewportHeight >= restingHeight - 72) &&
                        captureRestingViewport({
                            refreshScroll: !text_2,
                        });
                    !focused && value_48();
                    return;
                }
                keyboardWasOpen = true;
                text_2
                    ? ((root_3.style.height = viewportHeight + 'px'),
                      (root_3.style.top = '0px'),
                      (root_3.style.bottom = 'auto'),
                      value_47())
                    : ((root_2.style.height = viewportHeight + 'px'),
                      (root_2.style.top = viewportOrigin + 'px'),
                      (root_2.style.bottom = 'auto'));
                root_2.classList.add('im-call-keyboard-open');
                bottomControls_2 && (bottomControls_2.style.paddingBottom = '10px');
                collapseElements_2.forEach((element_4, index_2) => {
                    element_4.style.display = 'none';
                });
                requestAnimationFrame(() => {
                    options_2.scrollContainer &&
                        (options_2.scrollContainer.scrollTop =
                            options_2.scrollContainer.scrollHeight);
                });
            };
        viewport_2 &&
            (viewport_2.addEventListener('resize', applyViewport, {
                passive: true,
            }),
            viewport_2.addEventListener('scroll', applyViewport, {
                passive: true,
            }));
        const handleFocus = () => {
                captureRestingViewport({
                    refreshOrigin: false,
                    refreshScroll: false,
                });
                callFriend_2 = text_2;
                value_47();
                applyViewport();
            },
            handleBlur = () => {
                const metrics_3 = value_49(),
                    visibleStateStillShifted =
                        restingHeight - metrics_3.visualHeight > 72 ||
                        Math.abs(metrics_3.origin - restingViewportOrigin) > 48;
                if (keyboardWasOpen && visibleStateStillShifted) return;
                const value_86 = keyboardWasOpen;
                keyboardWasOpen = false;
                value_56(value_86);
                value_48();
            };
        return (
            input_3.addEventListener('pointerdown', captureRestingViewport, {
                passive: true,
            }),
            input_3.addEventListener('touchstart', captureRestingViewport, {
                passive: true,
            }),
            input_3.addEventListener('focus', handleFocus),
            input_3.addEventListener('blur', handleBlur),
            value_56(),
            () => {
                viewport_2?.removeEventListener('resize', applyViewport);
                viewport_2?.removeEventListener('scroll', applyViewport);
                input_3.removeEventListener('pointerdown', captureRestingViewport);
                input_3.removeEventListener('touchstart', captureRestingViewport);
                input_3.removeEventListener('focus', handleFocus);
                input_3.removeEventListener('blur', handleBlur);
                keyboardWasOpen = false;
                value_56();
                callFriend_2 = true;
                value_46();
                callFriend_2 = false;
                items_43.splice(0).forEach((value_87) => clearTimeout(value_87));
            }
        );
    }
    function handleAction_8(input_4, options_3 = {}) {
        if (!input_4 || typeof options_3.onSend !== 'function') return function () {};
        const dismissAfterSend_2 = options_3.dismissAfterSend !== false,
            sendAndMaybeDismiss = () => {
                const sent = options_3.onSend();
                if (dismissAfterSend_2 && sent !== false) input_4.blur();
                return sent;
            };
        if (window.mobileInputCompat?.register) {
            const inputCleanup = window.mobileInputCompat.register({
                    input: input_4,
                    root: options_3.root || null,
                    scrollContainer: options_3.scrollContainer || null,
                    onSend: sendAndMaybeDismiss,
                    blurAfterSend: false,
                    enterKeyHint: 'send',
                    restoreWindowScroll: false,
                    managesOwnViewport: true,
                }),
                viewportCleanup = bindCallVisualViewport(input_4, options_3.root, options_3);
            return () => {
                inputCleanup();
                viewportCleanup();
            };
        }
        const handleKeydown = (event_3) => {
            if (
                event_3.key !== 'Enter' ||
                event_3.shiftKey ||
                event_3.ctrlKey ||
                event_3.metaKey ||
                event_3.altKey ||
                event_3.isComposing ||
                event_3.keyCode === 229
            )
                return;
            event_3.preventDefault();
            if (!String(input_4.value || '').trim()) return;
            sendAndMaybeDismiss();
        };
        return (
            input_4.setAttribute('enterkeyhint', 'send'),
            input_4.addEventListener('keydown', handleKeydown),
            () => input_4.removeEventListener('keydown', handleKeydown)
        );
    }
    function formatTime(seconds) {
        const m_2 = Math.floor(seconds / 60)
                .toString()
                .padStart(2, '0'),
            s = (seconds % 60).toString().padStart(2, '0');
        return m_2 + ':' + s;
    }
    let minTimeEl = null;
    function startTimer(statusEl, minEl) {
        callSeconds = 0;
        if (statusEl) statusEl.innerText = '00:00';
        if (minEl) minEl.innerText = '00:00';
        callTimer = setInterval(() => {
            callSeconds++;
            const t = formatTime(callSeconds);
            if (statusEl) statusEl.innerText = t;
            if (minEl) minEl.innerText = t;
            if (minTimeEl) minTimeEl.innerText = t;
        }, 1000);
    }
    function handleAction_9() {
        callTimer && (clearInterval(callTimer), (callTimer = null));
    }
    function getCallSpeakerName(message_2, friend_2 = callFriend) {
        if (message_2?.senderName) return message_2.senderName;
        if (message_2?.isSelf) {
            const group = friend_2?.type === 'group' ? friend_2 : groupCallTarget;
            if (group?.type === 'group' && window.imApp?.getGroupUserIdentity)
                return window.imApp.getGroupUserIdentity(group).name;
            return window.userState?.name || window.userState?.realName || 'User';
        }
        if (friend_2?.type === 'group' && message_2?.senderId) {
            const member_2 = (window.imData?.friends || []).find(
                (item_2) => String(item_2.id) === String(message_2.senderId),
            );
            if (member_2) return member_2.nickname || member_2.realName || 'Member';
        }
        return friend_2?.nickname || friend_2?.realName || 'Char';
    }
    function formatCallLineText(text_3) {
        const cleanText = String(text_3 || '').trim();
        return cleanText ? '「' + cleanText + '」' : '';
    }
    function createCallNovelLine(innerText_2, options_4 = {}) {
        const rowWrap = document.createElement('div');
        rowWrap.style.width = '100%';
        rowWrap.style.marginBottom = '10px';
        rowWrap.style.display = 'flex';
        rowWrap.style.flexDirection = 'column';
        if (options_4.callTurnId) rowWrap.dataset.callTurnId = options_4.callTurnId;
        if (options_4.callLineType) rowWrap.dataset.callLineType = options_4.callLineType;
        const row = document.createElement('div');
        row.style.width = '100%';
        row.style.display = 'flex';
        row.style.alignItems = 'flex-start';
        row.style.justifyContent = 'flex-start';
        row.style.gap = '8px';
        row.style.padding = '0 10px';
        row.style.boxSizing = 'border-box';
        row.style.fontSize = options_4.fontSize || '15px';
        row.style.lineHeight = '1.55';
        row.style.color = options_4.color || '#fff';
        row.style.textAlign = 'left';
        row.style.wordBreak = 'break-word';
        const textEl = document.createElement('div');
        textEl.style.minWidth = '0';
        textEl.style.flex = '1';
        textEl.style.whiteSpace = 'pre-wrap';
        if (options_4.speakerName) {
            const nameTag = document.createElement('span');
            nameTag.style.display = 'inline-block';
            nameTag.style.padding = '1px 6px';
            nameTag.style.borderRadius = '8px';
            nameTag.style.marginRight = '6px';
            nameTag.style.fontSize = '12px';
            nameTag.style.fontWeight = '500';
            nameTag.style.verticalAlign = 'baseline';
            options_4.isSelf
                ? ((nameTag.style.background = 'rgba(255, 255, 255, 0.15)'),
                  (nameTag.style.color = '#fff'))
                : ((nameTag.style.background = 'rgba(255, 255, 255, 0.15)'),
                  (nameTag.style.color = '#fff'));
            nameTag.innerText = '@' + options_4.speakerName;
            textEl.appendChild(nameTag);
            textEl.appendChild(document.createTextNode(innerText_2));
        } else textEl.innerText = innerText_2;
        row.appendChild(textEl);
        const actionsContainer = document.createElement('div');
        actionsContainer.style.display = 'flex';
        actionsContainer.style.gap = '4px';
        actionsContainer.style.flexShrink = '0';
        if (options_4.translationText) {
            const translateBtn = document.createElement('button');
            translateBtn.type = 'button';
            translateBtn.title = '显示翻译';
            translateBtn.style.width = '30px';
            translateBtn.style.height = '30px';
            translateBtn.style.border = '1px solid rgba(255,255,255,0.35)';
            translateBtn.style.borderRadius = '50%';
            translateBtn.style.background = 'rgba(255,255,255,0.14)';
            translateBtn.style.color = '#fff';
            translateBtn.style.display = 'inline-flex';
            translateBtn.style.alignItems = 'center';
            translateBtn.style.justifyContent = 'center';
            translateBtn.style.cursor = 'pointer';
            translateBtn.style.padding = '0';
            translateBtn.style.fontSize = '12px';
            translateBtn.innerText = '译';
            const translationEl = document.createElement('div');
            translationEl.style.padding = '4px 10px';
            translationEl.style.fontSize = '13px';
            translationEl.style.color = 'rgba(255,255,255,0.7)';
            translationEl.style.display = 'none';
            translationEl.style.marginTop = '4px';
            translationEl.innerText = options_4.translationText;
            translateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                translationEl.style.display =
                    translationEl.style.display === 'none' ? 'block' : 'none';
            });
            actionsContainer.appendChild(translateBtn);
            rowWrap.translationElNode = translationEl;
        }
        return (
            options_4.voiceButton && actionsContainer.appendChild(options_4.voiceButton),
            actionsContainer.children.length > 0 && row.appendChild(actionsContainer),
            rowWrap.appendChild(row),
            rowWrap.translationElNode && rowWrap.appendChild(rowWrap.translationElNode),
            rowWrap
        );
    }
    function createCallVoiceButton(text_4, message_3, friend_3 = callFriend) {
        const translateBtn_2 = document.createElement('button');
        return (
            (translateBtn_2.type = 'button'),
            (translateBtn_2.title = '播放语音'),
            translateBtn_2.setAttribute('aria-label', '播放语音'),
            (translateBtn_2.style.width = '30px'),
            (translateBtn_2.style.height = '30px'),
            (translateBtn_2.style.border = '1px solid rgba(255,255,255,0.35)'),
            (translateBtn_2.style.borderRadius = '50%'),
            (translateBtn_2.style.background = 'rgba(255,255,255,0.14)'),
            (translateBtn_2.style.color = '#fff'),
            (translateBtn_2.style.display = 'inline-flex'),
            (translateBtn_2.style.alignItems = 'center'),
            (translateBtn_2.style.justifyContent = 'center'),
            (translateBtn_2.style.cursor = 'pointer'),
            (translateBtn_2.style.flexShrink = '0'),
            (translateBtn_2.style.padding = '0'),
            (translateBtn_2.innerHTML =
                '<i class="fas fa-volume-up" style="font-size: 12px;"></i>'),
            translateBtn_2.addEventListener('click', async (event_113) => {
                event_113.preventDefault();
                event_113.stopPropagation();
                if (!window.u2Tts || typeof window.u2Tts.speakTextCached !== 'function') {
                    if (window.showToast) window.showToast('TTS 不可用');
                    return;
                }
                translateBtn_2.style.opacity = '0.55';
                translateBtn_2.style.pointerEvents = 'none';
                try {
                    await window.u2Tts.speakTextCached(text_4, friend_3, message_3);
                } catch (error_3) {
                    console.error('Call voice playback failed', error_3);
                    if (
                        (!window.u2Api?.isRequestError?.(error_3) ||
                            !window.u2Api.reportError(error_3, {
                                operation: '语音生成',
                            })) &&
                        window.showToast
                    )
                        window.showToast(
                            window.u2Tts?.getUserErrorMessage?.(error_3) || '语音播放失败',
                        );
                } finally {
                    translateBtn_2.style.opacity = '1';
                    translateBtn_2.style.pointerEvents = 'auto';
                }
            }),
            translateBtn_2
        );
    }
    function addCallBubble(
        text_5,
        isSelf_2,
        messagesArea_2,
        actionText_2 = '',
        thoughtText_2 = '',
        translationText_2 = '',
    ) {
        const callTurnId_2 = 'call-msg-' + Date.now() + '-' + ++count,
            message_4 = {
                text: text_5,
                actionText: actionText_2,
                thoughtText: thoughtText_2,
                translationText: translationText_2,
                isSelf: isSelf_2,
                timestamp: Date.now(),
                callTurnId: callTurnId_2,
            };
        items.push(message_4);
        actionText_2 &&
            messagesArea_2 &&
            messagesArea_2.appendChild(
                createCallNovelLine(actionText_2, {
                    callTurnId: callTurnId_2,
                    callLineType: 'action',
                }),
            );
        thoughtText_2 &&
            messagesArea_2 &&
            messagesArea_2.appendChild(
                createCallNovelLine(thoughtText_2, {
                    callTurnId: callTurnId_2,
                    callLineType: 'thought',
                    color: 'rgba(255,255,255,0.55)',
                    fontSize: '13px',
                }),
            );
        if (text_5 && messagesArea_2) {
            const speakerName_2 = getCallSpeakerName(message_4);
            messagesArea_2.appendChild(
                createCallNovelLine(formatCallLineText(text_5), {
                    voiceButton: isSelf_2 ? null : createCallVoiceButton(text_5, message_4),
                    callTurnId: callTurnId_2,
                    callLineType: 'text',
                    speakerName: speakerName_2,
                    isSelf: isSelf_2,
                    translationText: translationText_2,
                }),
            );
        }
        return (
            messagesArea_2 && (messagesArea_2.scrollTop = messagesArea_2.scrollHeight),
            message_4
        );
    }
    window.imChat.openVoiceCall = function (friend_4, isIncoming = false) {
        if (window.imChat.isVideoCallActive?.()) {
            if (window.showToast) window.showToast('请先结束当前视频通话');
            return;
        }
        const voiceCallViewElement = document.getElementById('voice-call-view');
        if (!voiceCallViewElement) return;
        value_3 && (value_3(), (value_3 = null));
        const newView_2 = voiceCallViewElement.cloneNode(true);
        voiceCallViewElement.parentNode.replaceChild(newView_2, voiceCallViewElement);
        const newMinimizeBtn = newView_2.querySelector('#voice-call-minimize-btn'),
            newAvatarImg = newView_2.querySelector('#voice-call-avatar'),
            newAvatarIcon = newView_2.querySelector('#voice-call-avatar-icon'),
            newNameEl = newView_2.querySelector('#voice-call-name'),
            newStatusEl = newView_2.querySelector('#voice-call-status'),
            newMessagesArea = newView_2.querySelector('#voice-call-messages'),
            newInputRow = newView_2.querySelector('#voice-call-input-row'),
            newActionsRow = newView_2.querySelector('#voice-call-actions-row'),
            newInput = newView_2.querySelector('#voice-call-input'),
            newSendBtn = newView_2.querySelector('#voice-call-send-btn'),
            newAiBtn = newView_2.querySelector('#voice-call-ai-btn'),
            newHangupBtn = newView_2.querySelector('#voice-call-hangup-btn'),
            newRegenerateBtn = newView_2.querySelector('#voice-call-regenerate-btn'),
            newAcceptBtn = newView_2.querySelector('#voice-call-accept-btn'),
            minimizedFloat = newView_2.querySelector('#voice-call-minimized-float'),
            mainContent = newView_2.querySelector('#voice-call-main-content'),
            bgEl = newView_2.querySelector('#voice-call-bg'),
            infoArea = newView_2.querySelector('#voice-call-info-area');
        minTimeEl = newView_2.querySelector('#voice-call-minimized-time');
        callFriend = friend_4;
        items = [];
        count = 0;
        lastCallAiTurn = null;
        if (newMessagesArea) newMessagesArea.innerHTML = '';
        if (newInput) newInput.value = '';
        if (friend_4.avatarUrl) {
            newAvatarImg &&
                ((newAvatarImg.src = friend_4.avatarUrl), (newAvatarImg.style.display = 'block'));
            if (newAvatarIcon) newAvatarIcon.style.display = 'none';
        } else {
            newAvatarImg && ((newAvatarImg.src = ''), (newAvatarImg.style.display = 'none'));
            if (newAvatarIcon) newAvatarIcon.style.display = 'block';
        }
        if (newNameEl) newNameEl.innerText = friend_4.nickname || '对方';
        newView_2.style.display = 'flex';
        newView_2.style.opacity = '1';
        newView_2.style.pointerEvents = 'auto';
        newView_2.classList.add('active');
        minimizedFloat &&
            mainContent &&
            ((minimizedFloat.style.display = 'none'),
            (mainContent.style.display = 'flex'),
            (mainContent.style.opacity = '1'),
            (mainContent.style.pointerEvents = 'auto'),
            bgEl && ((bgEl.style.opacity = '1'), (bgEl.style.pointerEvents = 'auto')));
        infoArea && (infoArea.style.transform = 'scale(1)');
        if (window.openView) window.openView(newView_2);
        let isConnected = false,
            dialTimeout = null;
        const sessionId_2 = Date.now() + '-' + Math.random().toString(36).slice(2);
        activeSingleCallContext = {
            sessionId: sessionId_2,
            friendId: String(friend_4.id ?? ''),
            connected: false,
            minimized: false,
        };
        isIncoming
            ? ((newStatusEl.innerText = '正在邀请你进行语音通话...'),
              (newInputRow.style.display = 'none'),
              (newAcceptBtn.style.display = 'flex'))
            : ((newStatusEl.innerText = '正在呼叫...'),
              (newInputRow.style.display = 'none'),
              (newAcceptBtn.style.display = 'none'),
              (dialTimeout = setTimeout(() => {
                  connectCall();
              }, 2000)));
        function connectCall() {
            isConnected = true;
            activeSingleCallContext?.sessionId === sessionId_2 &&
                (activeSingleCallContext.connected = true);
            newInputRow.style.display = 'flex';
            newAcceptBtn.style.display = 'none';
            newStatusEl.innerText = '00:00';
            infoArea && (infoArea.style.transform = 'scale(0.8)');
            startTimer(newStatusEl, minTimeEl);
        }
        newAcceptBtn && newAcceptBtn.addEventListener('click', connectCall);
        let enabled_130 = false;
        async function handleClick_2() {
            if (enabled_130) return;
            enabled_130 = true;
            await handleAction_6(newInput);
            if (dialTimeout) clearTimeout(dialTimeout);
            value_3 && (value_3(), (value_3 = null));
            const duration_2 = isConnected ? callSeconds : 0,
                callMessages_2 = [...items],
                statusText_2 = isConnected ? '通话记录' : isIncoming ? '已拒绝' : '已取消',
                targetFriend = callFriend;
            handleAction_9();
            minTimeEl = null;
            newView_2.style.display = 'none';
            newView_2.style.opacity = '0';
            newView_2.style.pointerEvents = 'none';
            newView_2.classList.remove('active');
            if (window.closeView) window.closeView(newView_2);
            if (targetFriend) {
                const value_139 = !isIncoming,
                    recordMsg = {
                        id: Date.now().toString(),
                        type: 'voice_call_record',
                        role: value_139 ? 'user' : 'assistant',
                        content: '[语音通话记录]',
                        senderId: value_139
                            ? window.imData.currentUser
                                ? window.imData.currentUser.id
                                : 'me'
                            : targetFriend.id,
                        timestamp: Date.now(),
                        duration: duration_2,
                        callMessages: callMessages_2,
                        isSelf: value_139,
                        statusText: statusText_2,
                    };
                if (window.imApp && window.imApp.appendFriendMessage) {
                    window.imApp.appendFriendMessage(targetFriend.id, recordMsg);
                    const value_141 = 'chat-interface-' + callFriend.id,
                        elementById = document.getElementById(value_141);
                    if (elementById) {
                        const insChatMessagesElement =
                            elementById.querySelector('.ins-chat-messages');
                        insChatMessagesElement &&
                            window.imChat.appendMessageToContainer &&
                            (window.imChat.appendMessageToContainer(
                                callFriend,
                                insChatMessagesElement,
                                recordMsg,
                            ),
                            window.imChat.scrollToBottom(insChatMessagesElement));
                    }
                }
            }
            activeSingleCallContext?.sessionId === sessionId_2 && (activeSingleCallContext = null);
            callFriend = null;
        }
        newHangupBtn && newHangupBtn.addEventListener('click', handleClick_2);
        newMinimizeBtn &&
            minimizedFloat &&
            mainContent &&
            newMinimizeBtn.addEventListener('click', async () => {
                await handleAction_6(newInput);
                activeSingleCallContext?.sessionId === sessionId_2 &&
                    (activeSingleCallContext.minimized = true);
                mainContent.style.opacity = '0';
                mainContent.style.pointerEvents = 'none';
                bgEl && ((bgEl.style.opacity = '0'), (bgEl.style.pointerEvents = 'none'));
                setTimeout(() => {
                    mainContent.style.display = 'none';
                    minimizedFloat.style.display = 'flex';
                }, 300);
                newView_2.style.pointerEvents = 'none';
                minimizedFloat.style.right = '20px';
                minimizedFloat.style.top = '100px';
                minimizedFloat.style.left = 'auto';
                minimizedFloat.style.bottom = 'auto';
            });
        if (minimizedFloat && mainContent) {
            let isDragging = false,
                startX,
                startY,
                initialX,
                initialY;
            const onDragStart = (e_2) => {
                    isDragging = false;
                    const touch = e_2.type.includes('touch') ? e_2.touches[0] : e_2;
                    startX = touch.clientX;
                    startY = touch.clientY;
                    const rect = minimizedFloat.getBoundingClientRect();
                    initialX = rect.left;
                    initialY = rect.top;
                    minimizedFloat.style.transition = 'none';
                    minimizedFloat.style.right = 'auto';
                    minimizedFloat.style.bottom = 'auto';
                    minimizedFloat.style.left = initialX + 'px';
                    minimizedFloat.style.top = initialY + 'px';
                    document.addEventListener('mousemove', onDragMove, {
                        passive: false,
                    });
                    document.addEventListener('touchmove', onDragMove, {
                        passive: false,
                    });
                    document.addEventListener('mouseup', onDragEnd);
                    document.addEventListener('touchend', onDragEnd);
                },
                onDragMove = (event_144) => {
                    const event_145 = event_144.type.includes('touch')
                            ? event_144.touches[0]
                            : event_144,
                        value_146 = event_145.clientX - startX,
                        value_147 = event_145.clientY - startY;
                    (Math.abs(value_146) > 5 || Math.abs(value_147) > 5) && (isDragging = true);
                    if (isDragging) {
                        event_144.preventDefault();
                        let value_148 = initialX + value_146,
                            value_149 = initialY + value_147;
                        const maxX = window.innerWidth - minimizedFloat.offsetWidth,
                            maxY = window.innerHeight - minimizedFloat.offsetHeight;
                        value_148 = Math.max(0, Math.min(value_148, maxX));
                        value_149 = Math.max(0, Math.min(value_149, maxY));
                        minimizedFloat.style.left = value_148 + 'px';
                        minimizedFloat.style.top = value_149 + 'px';
                    }
                },
                onDragEnd = () => {
                    minimizedFloat.style.transition = 'all 0.3s ease';
                    document.removeEventListener('mousemove', onDragMove);
                    document.removeEventListener('touchmove', onDragMove);
                    document.removeEventListener('mouseup', onDragEnd);
                    document.removeEventListener('touchend', onDragEnd);
                };
            minimizedFloat.addEventListener('mousedown', onDragStart);
            minimizedFloat.addEventListener('touchstart', onDragStart, {
                passive: false,
            });
            minimizedFloat.addEventListener('click', (e_3) => {
                if (isDragging) {
                    e_3.stopPropagation();
                    e_3.preventDefault();
                    return;
                }
                activeSingleCallContext?.sessionId === sessionId_2 &&
                    (activeSingleCallContext.minimized = false);
                minimizedFloat.style.display = 'none';
                mainContent.style.display = 'flex';
                bgEl && ((bgEl.style.opacity = '1'), (bgEl.style.pointerEvents = 'auto'));
                setTimeout(() => {
                    mainContent.style.opacity = '1';
                    mainContent.style.pointerEvents = 'auto';
                }, 10);
                newView_2.style.pointerEvents = 'auto';
            });
        }
        newSendBtn &&
            newInput &&
            newMessagesArea &&
            bindCallFocusPreservingAction(newSendBtn, async () => {
                if (!isConnected) return;
                const text_6 = newInput.value.trim();
                if (!text_6 || !callFriend) return;
                addCallBubble(text_6, true, newMessagesArea);
                lastCallAiTurn = null;
                newInput.value = '';
                if (window.imChat.handleCallApiReply)
                    await window.imChat.handleCallApiReply(callFriend, text_6, (txt, isSelf_3) =>
                        addCallBubble(txt, isSelf_3, newMessagesArea),
                    );
                else
                    window.imChat.generateMockReply &&
                        setTimeout(() => {
                            addCallBubble(
                                window.imChat.generateMockReply(callFriend, text_6),
                                false,
                                newMessagesArea,
                            );
                        }, 1000);
            });
        function handleAction_132(turn, messagesArea_3) {
            if (!turn?.message?.callTurnId || !messagesArea_3) return;
            messagesArea_3
                .querySelectorAll('[data-call-turn-id="' + turn.message.callTurnId + '"]')
                .forEach((value_157) => value_157.remove());
        }
        function handleAction_10(value_12) {
            return value_12
                ? `

【重回重新生成要求】：
- User 按下了“重回”，这通常代表 User 对上一轮语音回复不满意。
- 请先在内部思考：User 为什么重回、刚刚生成的内容不好的点在哪里、User 现在更需要怎样的电话回复。可能问题包括：语气不对、关系距离不对、动作氛围太泛、没有接住情绪、对话太长、太敷衍、太热情、偏离人设、节奏不像电话、没有回应重点。
- 上一轮的 action、thought、text 是同一个被否定的完整轮次；必须重新生成三个非空字段，不得沿用旧心声。
- 禁止与上一轮重复或高度相似，不能复用相同句式、称呼、情绪走向、动作安排、环境声细节或结尾。
- 新 text 仍应是自然的 2–4 句电话口语，不要因为重回而缩成一句。
- 不要在 action、thought 或 text 里解释“重回”。
【刚刚被重回的回复】：
` + value_12
                : '';
        }
        let enabled_134 = false;
        async function runCallAiReply(options_5 = {}) {
            const triggerBtn = options_5.regenerate ? newRegenerateBtn : newAiBtn;
            if (!isConnected || !callFriend || !newMessagesArea || enabled_134) return;
            const { apiConfig: apiConfig_2, userState: userState_2 } = window;
            if (!apiConfig_2 || !apiConfig_2.endpoint || !apiConfig_2.apiKey) {
                if (window.showToast) window.showToast('请先配置 API');
                return;
            }
            let value_162 = null;
            if (options_5.regenerate) {
                if (!lastCallAiTurn?.message) {
                    if (window.showToast) window.showToast('暂无可重回的回复');
                    return;
                }
                value_162 = {
                    callTurnId: String(lastCallAiTurn.message.callTurnId || ''),
                    previousAction: lastCallAiTurn.message.actionText || '',
                    previousThought: lastCallAiTurn.message.thoughtText || '',
                    previousText: lastCallAiTurn.message.text || '',
                    previousTranslation: lastCallAiTurn.message.translationText || '',
                    previousReply: [
                        lastCallAiTurn.message.actionText
                            ? '动作/氛围：' + lastCallAiTurn.message.actionText
                            : '',
                        lastCallAiTurn.message.thoughtText
                            ? '心声：' + lastCallAiTurn.message.thoughtText
                            : '',
                        lastCallAiTurn.message.text ? '对话：' + lastCallAiTurn.message.text : '',
                        lastCallAiTurn.message.translationText
                            ? '翻译：' + lastCallAiTurn.message.translationText
                            : '',
                    ].filter(Boolean).join(`
`),
                };
            }
            enabled_134 = true;
            triggerBtn &&
                ((triggerBtn.style.opacity = '0.5'), (triggerBtn.style.pointerEvents = 'none'));
            try {
                const value_16 = window.getGlobalWorldBookContextByPosition
                        ? window.getGlobalWorldBookContextByPosition('system_depth')
                        : '',
                    value_17 = window.getGlobalWorldBookContextByPosition
                        ? window.getGlobalWorldBookContextByPosition('before_role')
                        : '',
                    effectiveUserPersona = window.imApp?.getEffectivePersonaForFriend
                        ? window.imApp.getEffectivePersonaForFriend(callFriend)
                        : userState_2?.persona || '普通用户',
                    contextLimit = window.imApp?.getContextLimit
                        ? window.imApp.getContextLimit(callFriend)
                        : 20,
                    targetLanguage = callFriend.language || 'zh',
                    langMap = {
                        en: 'English',
                        ja: 'Japanese',
                        ko: 'Korean',
                        fr: 'French',
                        de: 'German',
                        ru: 'Russian',
                        es: 'Spanish',
                        pt: 'Portuguese',
                        it: 'Italian',
                        th: 'Thai',
                        vi: 'Vietnamese',
                        ar: 'Arabic',
                        hi: 'Hindi',
                    };
                let text_21 = '',
                    text_170 =
                        '{"action": "第三人称动作/环境声/氛围描写，必须带${charDisplayName}的名字", "thought": "角色当下心声，不说出口的话（第一人称视角）", "text": "角色说出口的对话内容"}',
                    isChinese = ['zh', 'cn', 'zh-cn', 'chinese'].includes(
                        targetLanguage.toLowerCase(),
                    );
                if (!isChinese) {
                    const langName =
                        langMap[targetLanguage.toLowerCase()] ||
                        langMap[targetLanguage] ||
                        targetLanguage;
                    text_21 =
                        `

【!!! CRITICAL LANGUAGE RULE / 绝对最高优先级语言指令 !!!】:
- [ABSOLUTE REQUIREMENT]: You MUST speak ONLY in ` +
                        langName +
                        ` for the "text" field. This overrides ALL persona and memory settings.
- Even if your persona is Chinese or the user speaks in Chinese, your spoken "text" MUST be in ` +
                        langName +
                        `.
- [TRANSLATION]: You MUST provide an accurate Chinese translation of your ` +
                        langName +
                        ` "text" in the "translation" field.
- [CHINESE ONLY]: The "thought" and "action" fields MUST ALWAYS be written in Chinese (必须使用中文).`;
                    text_170 =
                        '{"action": "第三人称动作/环境声/氛围描写，必须带${charDisplayName}的名字(必须用中文)", "thought": "角色当下心声，不说出口的话（第一人称视角）(必须用中文)", "text": "角色说出口的对话内容（使用' +
                        langName +
                        '）", "translation": "text字段对应的中文翻译（必须用中文）"}';
                }
                let text_24 = '';
                if (window.imApp?.getRecentContextMessages) {
                    const contextMsgs = window.imApp.getRecentContextMessages(callFriend);
                    contextMsgs &&
                        contextMsgs.length > 0 &&
                        (text_24 = contextMsgs.map((m_3) => {
                            const value_184 =
                                    m_3.role === 'user'
                                        ? userState_2.name || 'User'
                                        : m_3.speaker || callFriend.nickname,
                                content_2 = m_3.text || m_3.content || '';
                            let text_186 = '';
                            if (m_3.timestamp) {
                                const date = new Date(m_3.timestamp);
                                text_186 =
                                    '[' +
                                    (date.getMonth() + 1).toString().padStart(2, '0') +
                                    '/' +
                                    date.getDate().toString().padStart(2, '0') +
                                    ' ' +
                                    date.getHours().toString().padStart(2, '0') +
                                    ':' +
                                    date.getMinutes().toString().padStart(2, '0') +
                                    '] ';
                            }
                            return '' + text_186 + value_184 + ': ' + content_2;
                        }).join(`
`));
                }
                const join_25 = items
                        .filter(
                            (value_188) =>
                                !value_162?.callTurnId ||
                                String(value_188.callTurnId || '') !== value_162.callTurnId,
                        )
                        .slice(-contextLimit)
                        .map((m_4) => {
                            const speaker_2 = m_4.isSelf
                                    ? userState_2.name || 'User'
                                    : callFriend.nickname,
                                items_191 = [];
                            if (m_4.actionText) items_191.push('动作/氛围：' + m_4.actionText);
                            if (m_4.thoughtText) items_191.push('心声：' + m_4.thoughtText);
                            if (m_4.text) items_191.push('对话：' + m_4.text);
                            return speaker_2 + ': ' + items_191.join(' / ');
                        }).join(`
`),
                    charDisplayName = callFriend.realName || callFriend.nickname || 'Char',
                    handleAction_10_28 = handleAction_10(value_162?.previousReply || ''),
                    value_29 =
                        '' +
                        (value_16
                            ? `System Depth Rules:
` +
                              value_16 +
                              `

`
                            : '') +
                        (value_17
                            ? `Before Role Rules:
` +
                              value_17 +
                              `

`
                            : '') +
                        'You are playing the role of ' +
                        charDisplayName +
                        `.
【核心设定/Core Persona】：` +
                        (callFriend.persona || 'No specific persona') +
                        `。
You are talking to ` +
                        (userState_2.name || 'User') +
                        ', whose persona is: ' +
                        effectiveUserPersona +
                        `。

【之前的文字聊天记录】：
` +
                        (text_24 || '无') +
                        `

【当前场景】：你和用户正处于实时的语音通话中。
【要求】：
1. 思考来电/接听背景：仔细思考用户打来电话或接听电话的原因，用户目前的情绪是怎样的，你（` +
                        charDisplayName +
                        `）现在在做什么，以及此时应该用怎样的语气来应对。
2. 话题推进：如果这不是一通带有明确紧急事由的电话，仅仅是日常闲聊，你是否应该主动给用户分享你正在做的事情，或者主动挑起一些能够延续通话的有趣话题？请在内心（thought）进行推演，并在文本（text）中自然地表达出来。
3. 结合记录：请结合之前的文字聊天记录以及当前的语音通话上下文，给出一个连贯自然的电话回复。
4. action 必须用第三人称描写动作、环境声或通话氛围，必须包含角色名字“` +
                        charDisplayName +
                        `”，不要用“我/你”开头。
5. action 要像电话那头能听到或感受到的细节，例如：` +
                        charDisplayName +
                        '翻了个身，电话那头传来布料摩擦声；' +
                        charDisplayName +
                        `压低了呼吸，背景里有很轻的脚步声。
6. thought 是 ` +
                        charDisplayName +
                        ` 此刻没说出口的当下心声，必须使用第一人称自述视角（即以“我”自称），可以体现口是心非、犹豫、压住的情绪、真正想说但没说的话；必须贴合人设和当前电话氛围。
7. text 是角色真正说出口的话，可以和 thought 有反差，但不能让 text 解释 thought。
 8. action 和 thought 要简短、聚焦当下；text 默认说 2–4 句自然口语，先回应 User 当前内容，再根据情境补充感受、细节、追问或主动分享，让电话能自然延续。
 9. 2–4 句是自然目标，不是机械格式：简短应答、惊讶或紧急情境可以只说一句，确实需要解释时可以略多。不得为凑句数重复意思、连续盘问、写成长篇独白，也不得把多句话压成一个冗长的书面句。` +
                        text_21 +
                        `
【输出格式】：必须返回纯 JSON，格式为 ` +
                        text_170 +
                        handleAction_10_28 +
                        `

【当前的语音通话上下文】:
` +
                        join_25,
                    chatCompletionsEndpoint = window.u2Api.resolveChatCompletionsEndpoint(
                        apiConfig_2.endpoint,
                    ),
                    value_177 = await fetch(chatCompletionsEndpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + apiConfig_2.apiKey,
                        },
                        body: JSON.stringify({
                            model: apiConfig_2.model || '',
                            messages: [
                                {
                                    role: 'system',
                                    content: value_29,
                                },
                                {
                                    role: 'user',
                                    content: options_5.regenerate
                                        ? '请重回并重新生成这一轮语音通话回复'
                                        : '请继续语音通话',
                                },
                            ],
                            temperature: parseFloat(apiConfig_2.temperature) || 0.7,
                        }),
                    });
                if (!value_177.ok)
                    throw (
                        window.u2Api?.createHttpError?.(
                            value_177,
                            await window.u2Api?.readApiError?.(value_177),
                        ) ||
                        Object.assign(new Error('HTTP ' + value_177.status), {
                            status: value_177.status,
                        })
                    );
                const value_31 = await value_177.json();
                let content_32 = value_31.choices[0].message.content,
                    parsed = null,
                    cleanText_2 = content_32.trim();
                if (cleanText_2.startsWith('```json')) cleanText_2 = cleanText_2.substring(7);
                else {
                    if (cleanText_2.startsWith('```')) cleanText_2 = cleanText_2.substring(3);
                }
                if (cleanText_2.endsWith('```'))
                    cleanText_2 = cleanText_2.substring(0, cleanText_2.length - 3);
                try {
                    parsed = JSON.parse(cleanText_2);
                } catch (value_36) {
                    if (options_5.regenerate)
                        throw new Error('Regenerate response is not valid JSON');
                    parsed = {
                        action: '',
                        text: cleanText_2,
                    };
                }
                if (!callFriend) return;
                if (options_5.regenerate) {
                    const value_193 =
                        parsed &&
                        String(parsed.action || '').trim() &&
                        String(parsed.thought || '').trim() &&
                        String(parsed.text || '').trim();
                    if (!value_193)
                        throw new Error('Regenerate response is missing action, thought, or text');
                    if (String(lastCallAiTurn?.message?.callTurnId || '') !== value_162.callTurnId)
                        throw new Error('Regenerate target changed while request was pending');
                    handleAction_132(lastCallAiTurn, newMessagesArea);
                    items = items.filter(
                        (value_194) => String(value_194.callTurnId || '') !== value_162.callTurnId,
                    );
                    lastCallAiTurn = null;
                }
                if (parsed && (parsed.text || parsed.action || parsed.thought)) {
                    const message_5 = addCallBubble(
                        parsed.text || '',
                        false,
                        newMessagesArea,
                        parsed.action || '',
                        parsed.thought || '',
                        parsed.translation || '',
                    );
                    lastCallAiTurn = {
                        message: message_5,
                    };
                }
            } catch (value_196) {
                console.error(value_196);
                if (
                    !window.u2Api?.isRequestError?.(value_196) ||
                    !window.u2Api.reportError(value_196, {
                        operation: options_5.regenerate ? '语音通话重回' : '语音通话回复',
                    })
                ) {
                    if (window.showToast)
                        window.showToast(options_5.regenerate ? '重回失败' : 'API 请求失败');
                }
            } finally {
                enabled_134 = false;
                triggerBtn &&
                    ((triggerBtn.style.opacity = '1'), (triggerBtn.style.pointerEvents = 'auto'));
            }
        }
        newAiBtn &&
            newMessagesArea &&
            bindCallFocusPreservingAction(newAiBtn, async () => {
                await runCallAiReply();
            });
        newRegenerateBtn &&
            newMessagesArea &&
            bindCallFocusPreservingAction(newRegenerateBtn, async () => {
                await runCallAiReply({
                    regenerate: true,
                });
            });
        newInput &&
            newSendBtn &&
            (value_3 = handleAction_8(newInput, {
                root: newView_2,
                scrollContainer: newMessagesArea,
                bottomControls: newInputRow?.parentElement,
                collapseElements: [infoArea, newActionsRow],
                keepRootAnchored: true,
                viewportContent: mainContent,
                dismissAfterSend: false,
                onSend: () => {
                    if (!isConnected || !newInput.value.trim()) return false;
                    return (newSendBtn.click(), true);
                },
            }));
    };
    let groupCallTimer = null,
        groupCallSeconds = 0,
        groupCallTarget = null,
        groupCallMessages = [],
        items_3 = [],
        count_17 = 0,
        lastGroupCallAiTurn = null;
    function startGroupTimer(statusEl_2, minTimeTextEl) {
        groupCallSeconds = 0;
        if (statusEl_2) statusEl_2.innerText = '00:00';
        if (minTimeTextEl) minTimeTextEl.innerText = '00:00';
        groupCallTimer = setInterval(() => {
            groupCallSeconds++;
            const t_2 = formatTime(groupCallSeconds);
            if (statusEl_2) statusEl_2.innerText = t_2;
            if (minTimeTextEl) minTimeTextEl.innerText = t_2;
        }, 1000);
    }
    function handleAction_4() {
        groupCallTimer && (clearInterval(groupCallTimer), (groupCallTimer = null));
    }
    function addGroupCallBubble(
        text_8,
        senderId_2,
        messagesArea_4,
        actionText_3 = '',
        translationText_3 = '',
    ) {
        if (!text_8 && !actionText_3) return null;
        let isSelf_4 = senderId_2 === '__user__' || senderId_2 == null;
        const groupUserIdentity =
            groupCallTarget?.type === 'group' && window.imApp?.getGroupUserIdentity
                ? window.imApp.getGroupUserIdentity(groupCallTarget)
                : null;
        let senderName_2 = isSelf_4
                ? groupUserIdentity?.name || window.userState?.name || 'User'
                : 'Member',
            senderAvatar = isSelf_4 ? groupUserIdentity?.avatarUrl || '' : '',
            senderFriend = null;
        if (!isSelf_4 && groupCallTarget) {
            const groupMembers_2 = window.imChat?.getGroupMemberFriends
                    ? window.imChat.getGroupMemberFriends(groupCallTarget)
                    : [],
                friend_5 = groupMembers_2.find(
                    (member) => String(member.id) === String(senderId_2),
                );
            friend_5 &&
                ((senderName_2 = friend_5.nickname),
                (senderAvatar = friend_5.avatarUrl),
                (senderFriend = friend_5));
        }
        const callTurnId_3 = 'group-call-msg-' + Date.now() + '-' + ++count_17,
            message_6 = {
                text: text_8,
                actionText: actionText_3,
                thoughtText: '',
                translationText: translationText_3,
                senderId: senderId_2 == null ? '__user__' : senderId_2,
                senderName: senderName_2,
                senderAvatarUrl: senderAvatar || '',
                isSelf: isSelf_4,
                timestamp: Date.now(),
                callTurnId: callTurnId_3,
            };
        groupCallMessages.push(message_6);
        actionText_3 &&
            messagesArea_4 &&
            messagesArea_4.appendChild(
                createCallNovelLine(actionText_3, {
                    callTurnId: callTurnId_3,
                    callLineType: 'action',
                }),
            );
        if (text_8 && messagesArea_4) {
            const canPlayTts =
                !isSelf_4 && !!senderFriend && !!window.u2Tts?.canSpeakForFriend?.(senderFriend);
            messagesArea_4.appendChild(
                createCallNovelLine(formatCallLineText(text_8), {
                    voiceButton: canPlayTts
                        ? createCallVoiceButton(text_8, message_6, senderFriend)
                        : null,
                    callTurnId: callTurnId_3,
                    callLineType: 'text',
                    speakerName: senderName_2,
                    isSelf: isSelf_4,
                    translationText: translationText_3,
                }),
            );
        }
        return (
            messagesArea_4 && (messagesArea_4.scrollTop = messagesArea_4.scrollHeight),
            message_6
        );
    }
    window.imChat.openGroupVoiceCall = function (value_40, memberIds) {
        const groupVoiceCallViewElement = document.getElementById('group-voice-call-view');
        if (!groupVoiceCallViewElement) return;
        value_4 && (value_4(), (value_4 = null));
        const newView = groupVoiceCallViewElement.cloneNode(true);
        groupVoiceCallViewElement.parentNode.replaceChild(newView, groupVoiceCallViewElement);
        groupCallTarget = value_40;
        items_3 = memberIds;
        groupCallMessages = [];
        count_17 = 0;
        lastGroupCallAiTurn = null;
        const hangupBtn = newView.querySelector('#group-call-hangup-btn'),
            minimizeBtn = newView.querySelector('#group-call-minimize-btn'),
            statusText_3 = newView.querySelector('#group-call-status-text'),
            groupCallAvatarsGridElement = newView.querySelector('#group-call-avatars-grid'),
            messagesArea = newView.querySelector('#group-call-messages'),
            inputEl = newView.querySelector('#group-call-input'),
            sendBtn = newView.querySelector('#group-call-send-btn'),
            aiBtn = newView.querySelector('#group-call-ai-btn'),
            regenerateBtn = newView.querySelector('#group-call-regenerate-btn'),
            actionsRow = newView.querySelector('#group-call-actions-row'),
            groupBgEl = newView.querySelector('#group-call-bg');
        let minBanner = document.getElementById('group-call-minimized-banner'),
            minText = null,
            minTime = null;
        if (minBanner) {
            const cloneNode_225 = minBanner.cloneNode(true);
            minBanner.parentNode.replaceChild(cloneNode_225, minBanner);
            minBanner = cloneNode_225;
            minText = document.getElementById('group-call-minimized-text');
            minTime = document.getElementById('group-call-minimized-time');
            minBanner.addEventListener('click', () => {
                minBanner.style.display = 'none';
                newView.style.display = 'flex';
                const groupCallMainContentElement = newView.querySelector(
                    '#group-call-main-content',
                );
                groupCallMainContentElement &&
                    ((groupCallMainContentElement.style.opacity = '1'),
                    (groupCallMainContentElement.style.pointerEvents = 'auto'));
                groupBgEl &&
                    ((groupBgEl.style.opacity = '1'), (groupBgEl.style.pointerEvents = 'auto'));
                newView.style.opacity = '1';
                newView.style.pointerEvents = 'auto';
                newView.classList.add('active');
            });
        }
        messagesArea.innerHTML = '';
        inputEl.value = '';
        groupCallAvatarsGridElement.innerHTML = '';
        statusText_3.innerText = '等待接通...';
        newView.style.display = 'flex';
        newView.style.opacity = '1';
        newView.style.pointerEvents = 'auto';
        newView.classList.add('active');
        groupBgEl && ((groupBgEl.style.opacity = '1'), (groupBgEl.style.pointerEvents = 'auto'));
        window.openView && window.openView(newView);
        const allParticipants = [
            {
                id: '__user__',
                isUser: true,
            },
            ...memberIds
                .map((id_2) => window.imData.friends.find((f) => f.id === id_2))
                .filter(Boolean),
        ];
        allParticipants.forEach((p) => {
            const element_229 = document.createElement('div');
            element_229.style.display = 'flex';
            element_229.style.flexDirection = 'column';
            element_229.style.alignItems = 'center';
            element_229.style.gap = '6px';
            const avatar_2 = document.createElement('div');
            avatar_2.style.width = '64px';
            avatar_2.style.height = '64px';
            avatar_2.style.borderRadius = '50%';
            avatar_2.style.border = '2px solid rgba(255,255,255,0.1)';
            avatar_2.style.background = '#333';
            avatar_2.style.overflow = 'hidden';
            avatar_2.style.transition = 'all 0.5s ease';
            p.isUser
                ? ((avatar_2.style.filter = 'grayscale(0%) opacity(1)'),
                  (avatar_2.style.border = '2px solid #34c759'))
                : (avatar_2.style.filter = 'grayscale(100%) opacity(0.5)');
            if (p.isUser) {
                const groupUserIdentity_2 =
                        groupCallTarget?.type === 'group' && window.imApp?.getGroupUserIdentity
                            ? window.imApp.getGroupUserIdentity(groupCallTarget)
                            : null,
                    userAvatar =
                        groupUserIdentity_2?.avatarUrl ||
                        window.userState?.avatarUrl ||
                        window.userState?.avatar;
                userAvatar
                    ? (avatar_2.innerHTML =
                          '<img src="' +
                          userAvatar +
                          '" style="width:100%;height:100%;object-fit:cover;">')
                    : (avatar_2.innerHTML =
                          '<div style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;color:#fff;"><i class="fas fa-user"></i></div>');
            } else
                p.avatarUrl
                    ? (avatar_2.innerHTML =
                          '<img src="' +
                          p.avatarUrl +
                          '" style="width:100%;height:100%;object-fit:cover;">')
                    : (avatar_2.innerHTML =
                          '<div style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;color:#fff;"><i class="fas fa-robot"></i></div>');
            const name_2 = document.createElement('div');
            name_2.style.fontSize = '12px';
            name_2.style.color = 'rgba(255,255,255,0.6)';
            name_2.style.maxWidth = '70px';
            name_2.style.overflow = 'hidden';
            name_2.style.textOverflow = 'ellipsis';
            name_2.style.whiteSpace = 'nowrap';
            const groupUserIdentity_3 =
                groupCallTarget?.type === 'group' && window.imApp?.getGroupUserIdentity
                    ? window.imApp.getGroupUserIdentity(groupCallTarget)
                    : null;
            name_2.innerText = p.isUser
                ? groupUserIdentity_3?.name || window.userState?.name || 'User'
                : p.nickname;
            element_229.appendChild(avatar_2);
            element_229.appendChild(name_2);
            groupCallAvatarsGridElement.appendChild(element_229);
            !p.isUser &&
                setTimeout(
                    () => {
                        avatar_2.style.filter = 'grayscale(0%) opacity(1)';
                        avatar_2.style.border = '2px solid #34c759';
                    },
                    1000 + Math.random() * 2000,
                );
        });
        setTimeout(() => {
            startGroupTimer(statusText_3, minTime);
            if (minText) minText.innerText = allParticipants.length + '人正在群通话中...';
        }, 1000);
        let enabled_42 = false;
        const handleClick_4 = async () => {
            if (enabled_42) return;
            enabled_42 = true;
            await handleAction_6(inputEl);
            value_4 && (value_4(), (value_4 = null));
            const formatTime_235 = formatTime(groupCallSeconds),
                callMessages_4 = [...groupCallMessages],
                duration_3 = groupCallSeconds;
            handleAction_4();
            newView.style.display = 'none';
            newView.style.opacity = '0';
            newView.style.pointerEvents = 'none';
            newView.classList.remove('active');
            if (window.closeView) window.closeView(newView);
            if (minBanner) minBanner.style.display = 'none';
            if (groupCallTarget && window.imApp && window.imApp.appendFriendMessage) {
                let text_51 = '';
                callMessages_4.length > 0
                    ? (text_51 = callMessages_4
                          .map((value_243) => {
                              const items_244 = [];
                              if (value_243.actionText)
                                  items_244.push('动作：' + value_243.actionText);
                              if (value_243.text)
                                  items_244.push(value_243.senderName + ': ' + value_243.text);
                              if (value_243.translationText)
                                  items_244.push('翻译：' + value_243.translationText);
                              return items_244.join(' / ');
                          })
                          .filter(Boolean).join(`
  `))
                    : (text_51 = '无对话');
                const options_239 = {
                    id: Date.now().toString(),
                    type: 'voice_call_record',
                    role: 'system',
                    content: '[群语音通话记录]',
                    senderId: '__user__',
                    timestamp: Date.now(),
                    duration: duration_3,
                    callMessages: callMessages_4,
                    statusText: '群通话时长 ' + formatTime_235,
                    isSelf: true,
                };
                window.imApp.appendFriendMessage(groupCallTarget.id, options_239);
                const options_53 = {
                    id: (Date.now() + 1).toString(),
                    type: 'text',
                    role: 'system',
                    content:
                        '[系统提示：刚刚完成了一次群语音通话，时长 ' +
                        formatTime_235 +
                        `。通话内容：
` +
                        text_51 +
                        ']',
                    timestamp: Date.now() + 1,
                };
                window.imApp.appendFriendMessage(groupCallTarget.id, options_53);
                const value_54 = 'chat-interface-' + groupCallTarget.id,
                    elementById_55 = document.getElementById(value_54);
                if (elementById_55) {
                    const insChatMessagesElement_56 =
                        elementById_55.querySelector('.ins-chat-messages');
                    insChatMessagesElement_56 &&
                        window.imChat.appendMessageToContainer &&
                        (window.imChat.appendMessageToContainer(
                            groupCallTarget,
                            insChatMessagesElement_56,
                            options_239,
                        ),
                        window.imChat.scrollToBottom(insChatMessagesElement_56));
                }
            }
            groupCallTarget = null;
            groupCallMessages = [];
            lastGroupCallAiTurn = null;
        };
        if (hangupBtn) hangupBtn.addEventListener('click', handleClick_4);
        minimizeBtn &&
            minimizeBtn.addEventListener('click', async () => {
                await handleAction_6(inputEl);
                const groupCallMainContentElement_246 = newView.querySelector(
                    '#group-call-main-content',
                );
                groupCallMainContentElement_246 &&
                    ((groupCallMainContentElement_246.style.opacity = '0'),
                    (groupCallMainContentElement_246.style.pointerEvents = 'none'));
                groupBgEl &&
                    ((groupBgEl.style.opacity = '0'), (groupBgEl.style.pointerEvents = 'none'));
                setTimeout(() => {
                    newView.style.display = 'none';
                    newView.style.opacity = '0';
                    newView.classList.remove('active');
                }, 300);
                newView.style.pointerEvents = 'none';
                if (minBanner) minBanner.style.display = 'flex';
            });
        sendBtn &&
            bindCallFocusPreservingAction(sendBtn, () => {
                const text_9 = inputEl.value.trim();
                if (!text_9) return;
                addGroupCallBubble(text_9, '__user__', messagesArea);
                lastGroupCallAiTurn = null;
                inputEl.value = '';
            });
        inputEl &&
            sendBtn &&
            (value_4 = handleAction_8(inputEl, {
                root: newView,
                scrollContainer: messagesArea,
                bottomControls: inputEl.parentElement?.parentElement,
                collapseElements: [groupCallAvatarsGridElement, actionsRow],
                dismissAfterSend: false,
                onSend: () => {
                    if (!inputEl.value.trim()) return false;
                    return (sendBtn.click(), true);
                },
            }));
        let value_44 = null;
        function handleAction_45(value_57) {
            if (!value_57) return '';
            return (
                `

【重回重新生成要求】:
- User 按下了“重回”，请直接重新生成刚才那一轮群通话对话。
- 新一轮必须自然接住当前通话上下文，但不得复用下面旧回复中的句子、称呼、话题推进方式或结尾。
- 不要提及“重回”、旧回复或重新生成。
【刚才被重回的群通话对话】:
` + value_57
            );
        }
        function handleAction_223(turn_2) {
            const messages_2 = Array.isArray(turn_2?.messages) ? turn_2.messages : [],
                turnIds = new Set(
                    messages_2.map((message_7) => message_7?.callTurnId).filter(Boolean),
                );
            turnIds.size > 0 &&
                messagesArea &&
                turnIds.forEach((value_253) => {
                    messagesArea
                        .querySelectorAll('[data-call-turn-id="' + value_253 + '"]')
                        .forEach((value_254) => value_254.remove());
                });
            groupCallMessages = groupCallMessages.filter(
                (message_8) => !messages_2.includes(message_8),
            );
        }
        function restoreGroupCallAiTurn(messages_3) {
            const restoredMessages = [];
            return (
                (Array.isArray(messages_3) ? messages_3 : []).forEach((message_9) => {
                    const restored = addGroupCallBubble(
                        message_9?.text || '',
                        message_9?.senderId || '__user__',
                        messagesArea,
                        message_9?.actionText || '',
                        message_9?.translationText || '',
                    );
                    if (restored) restoredMessages.push(restored);
                }),
                restoredMessages
            );
        }
        aiBtn &&
            bindCallFocusPreservingAction(aiBtn, async () => {
                const groupCallTarget_2 = groupCallTarget;
                if (!groupCallTarget_2) return;
                const items_259 = [...items_3],
                    regenerateContext = value_44;
                value_44 = null;
                const { apiConfig: apiConfig_3 } = window,
                    userState_3 = window.userState || {};
                if (!apiConfig_3 || !apiConfig_3.endpoint || !apiConfig_3.apiKey) {
                    if (window.showToast) window.showToast('请先配置 API');
                    return;
                }
                [aiBtn, regenerateBtn].filter(Boolean).forEach((button_2) => {
                    button_2.style.opacity = '0.5';
                    button_2.style.pointerEvents = 'none';
                });
                try {
                    const groupMembers = items_259
                            .map((senderId_3) =>
                                window.imData.friends.find(
                                    (member_3) => String(member_3.id) === String(senderId_3),
                                ),
                            )
                            .filter(Boolean),
                        groupMemorySettings = groupCallTarget_2.memory?.mountSettings || {},
                        groupMemoryLimits = groupCallTarget_2.memory?.mountLimits || {},
                        value_266 = (value_295) => {
                            const string = String(value_295);
                            return groupMemorySettings[string] !== false;
                        },
                        value_267 = (value_296) => {
                            const string_297 = String(value_296),
                                number = Number(groupMemoryLimits[string_297] || 20);
                            return Number.isFinite(number) && number > 0
                                ? Math.max(1, Math.floor(number))
                                : 20;
                        },
                        value_268 = window.imApp?.getContextLimit
                            ? Number(window.imApp.getContextLimit(groupCallTarget_2))
                            : 100,
                        limit_2 =
                            Number.isFinite(value_268) && value_268 > 0
                                ? Math.max(1, Math.floor(value_268))
                                : 0,
                        filter_270 = groupMembers.filter(
                            (value_298) => value_298 && value_266(value_298.id),
                        ),
                        items_271 = [];
                    if (window.imApp?.ensureFriendRecentMessagesLoaded) {
                        limit_2 > 0 &&
                            items_271.push(
                                window.imApp.ensureFriendRecentMessagesLoaded(groupCallTarget_2, {
                                    limit: limit_2,
                                }),
                            );
                        items_271.push(
                            ...filter_270.map((value_299) =>
                                window.imApp.ensureFriendRecentMessagesLoaded(value_299, {
                                    limit: value_267(value_299.id),
                                }),
                            ),
                        );
                    } else
                        window.imApp?.ensureFriendMessagesLoaded &&
                            (limit_2 > 0 &&
                                items_271.push(
                                    window.imApp.ensureFriendMessagesLoaded(groupCallTarget_2),
                                ),
                            items_271.push(
                                ...filter_270.map((value_300) =>
                                    window.imApp.ensureFriendMessagesLoaded(value_300),
                                ),
                            ));
                    items_271.length > 0 && (await Promise.all(items_271));
                    if (groupCallTarget !== groupCallTarget_2) return;
                    const groupUserIdentity_4 = window.imApp?.getGroupUserIdentity
                            ? window.imApp.getGroupUserIdentity(groupCallTarget_2)
                            : null,
                        userName_2 = groupUserIdentity_4?.name || userState_3.name || 'User',
                        join_70 = groupMembers.map((contact_301) => {
                            let value_92 =
                                'Name: ' +
                                contact_301.nickname +
                                `
Persona: ` +
                                (contact_301.persona || 'None');
                            if (value_266(contact_301.id)) {
                                const value_267_303 = value_267(contact_301.id),
                                    slice_304 = (
                                        Array.isArray(contact_301.messages)
                                            ? contact_301.messages
                                            : []
                                    )
                                        .filter(
                                            (message_306) =>
                                                message_306 &&
                                                message_306.excludedFromContext !== true &&
                                                (message_306.text ||
                                                    message_306.content ||
                                                    message_306.transcript ||
                                                    message_306.description),
                                        )
                                        .slice(-value_267_303),
                                    value_95 =
                                        `

【挂载单聊记忆｜成员：` +
                                        contact_301.nickname +
                                        '｜成员ID：' +
                                        contact_301.id +
                                        '｜User：' +
                                        userName_2 +
                                        `】
以下内容只属于群成员「` +
                                        contact_301.nickname +
                                        '」（ID: ' +
                                        contact_301.id +
                                        '）与 User「' +
                                        userName_2 +
                                        `」之间的单聊记忆，不是当前群通话内公开发生的内容。
使用规则：
- 只有 ` +
                                        contact_301.nickname +
                                        ` 本人可以参考这段记忆，用于延续自己对 User 的称呼、态度、关系与共同经历。
- 其他群成员不是全知视角，默认完全不知道这些单聊内容；除非 ` +
                                        contact_301.nickname +
                                        ' 在当前群通话中主动说出，否则其他成员不得引用、回应或暗示知情。';
                                if (slice_304.length > 0) {
                                    const join_96 = slice_304.map((msg_2) => {
                                        const value_309 =
                                            msg_2.role === 'user'
                                                ? userName_2
                                                : msg_2.speaker || contact_301.nickname;
                                        let text_310 = '';
                                        if (msg_2.timestamp) {
                                            const date_2 = new Date(msg_2.timestamp);
                                            text_310 =
                                                '[' +
                                                (date_2.getMonth() + 1)
                                                    .toString()
                                                    .padStart(2, '0') +
                                                '/' +
                                                date_2.getDate().toString().padStart(2, '0') +
                                                ' ' +
                                                date_2.getHours().toString().padStart(2, '0') +
                                                ':' +
                                                date_2.getMinutes().toString().padStart(2, '0') +
                                                '] ';
                                        }
                                        return (
                                            '' +
                                            text_310 +
                                            value_309 +
                                            ': ' +
                                            (msg_2.text ||
                                                msg_2.content ||
                                                msg_2.transcript ||
                                                msg_2.description ||
                                                '')
                                        );
                                    }).join(`
`);
                                    value_92 +=
                                        value_95 +
                                        `
` +
                                        join_96;
                                } else
                                    value_92 +=
                                        value_95 +
                                        `
已开启挂载，但暂未找到可注入的单聊上下文。`;
                            }
                            return value_92;
                        }).join(`

-----------------

`),
                        filter_275 = (
                            Array.isArray(groupCallTarget_2.messages)
                                ? groupCallTarget_2.messages
                                : []
                        ).filter(
                            (value_312) => value_312 && value_312.excludedFromContext !== true,
                        ),
                        items_276 =
                            limit_2 > 0
                                ? window.imDataUtils?.getRecentPublicGroupMessages
                                    ? window.imDataUtils.getRecentPublicGroupMessages(
                                          filter_275,
                                          limit_2,
                                      ).selectedMessages
                                    : filter_275
                                          .filter(
                                              (value_313) =>
                                                  value_313.noticeKind !==
                                                      'group_private_to_user' &&
                                                  value_313.noticeKind !==
                                                      'group_friend_private_chat',
                                          )
                                          .slice(-limit_2)
                                : [],
                        value_277 = window.imApp?.normalizeFriendData
                            ? window.imApp.normalizeFriendData(groupCallTarget_2)
                            : groupCallTarget_2,
                        join_73 = items_276
                            .map((msg_3) => {
                                const message_315 = window.imApp?.formatMessageForApiContext
                                        ? window.imApp.formatMessageForApiContext(
                                              msg_3,
                                              value_277,
                                              {
                                                  userName: userName_2,
                                                  friendIsNormalized: true,
                                                  includeTime: true,
                                              },
                                          )
                                        : null,
                                    trim_316 = String(
                                        message_315?.content || msg_3.content || msg_3.text || '',
                                    ).trim();
                                if (!trim_316) return '';
                                let text_317 = '';
                                if (msg_3.timestamp) {
                                    const date_3 = new Date(msg_3.timestamp);
                                    text_317 =
                                        '[' +
                                        (date_3.getMonth() + 1).toString().padStart(2, '0') +
                                        '/' +
                                        date_3.getDate().toString().padStart(2, '0') +
                                        ' ' +
                                        date_3.getHours().toString().padStart(2, '0') +
                                        ':' +
                                        date_3.getMinutes().toString().padStart(2, '0') +
                                        '] ';
                                }
                                return '' + text_317 + trim_316;
                            })
                            .filter(Boolean).join(`
`),
                        value_74 = window.getGlobalWorldBookContextByPosition
                            ? window.getGlobalWorldBookContextByPosition('system_depth')
                            : '',
                        value_75 = window.getGlobalWorldBookContextByPosition
                            ? window.getGlobalWorldBookContextByPosition('before_role')
                            : '',
                        afterRole = window.getGlobalWorldBookContextByPosition
                            ? window.getGlobalWorldBookContextByPosition('after_role')
                            : '',
                        customGroupPrompt = groupCallTarget_2.memory?.context?.prompt || '',
                        handleAction_45_78 = handleAction_45(
                            regenerateContext?.previousReply || '',
                        ),
                        effectiveUserPersona_2 =
                            groupUserIdentity_4?.persona ||
                            (window.imApp?.getEffectivePersonaForFriend
                                ? window.imApp.getEffectivePersonaForFriend(groupCallTarget_2)
                                : userState_3?.persona || '普通用户'),
                        join_83 = groupCallMessages.slice(-20).map((value_319) => {
                            const items_320 = [];
                            if (value_319.actionText)
                                items_320.push('动作：' + value_319.actionText);
                            if (value_319.text) items_320.push('发言：' + value_319.text);
                            if (value_319.translationText)
                                items_320.push('翻译：' + value_319.translationText);
                            return value_319.senderName + ': ' + items_320.join(' / ');
                        }).join(`
`),
                        activeSpeakerNames = groupMembers
                            .map((m) => m.nickname || m.realName)
                            .filter(Boolean);
                    let text_85 = '';
                    if (value_74)
                        text_85 +=
                            `【系统规则 (System Depth)】
` +
                            value_74 +
                            `

`;
                    if (value_75)
                        text_85 +=
                            `【前置设定 (Before Role)】
` +
                            value_75 +
                            `

`;
                    text_85 +=
                        'You are simulating a group voice call in the group "' +
                        groupCallTarget_2.nickname +
                        `".
【群聊成员设定】:
` +
                        join_70 +
                        `

The user is ` +
                        (groupUserIdentity_4?.name || userState_3?.name || 'User') +
                        ', whose persona is: ' +
                        effectiveUserPersona_2 +
                        `.

【进入通话前的群聊历史｜公开上下文】:
` +
                        (join_73 ||
                            (limit_2 > 0 ? '暂无可读取的公开群聊记录。' : '群聊上下文已关闭。')) +
                        `
边界规则：以上是进入本次通话前已经公开发生的群聊记录，只用于承接话题、公开关系和共同事件；不得将它们伪装成当前群通话里刚说出的发言，也不得推断任何未公开的成员私聊。

【当前的语音通话记录】:
` +
                        (join_83 || '无') +
                        `
`;
                    if (customGroupPrompt)
                        text_85 +=
                            `
【群聊特殊设定】:
` +
                            customGroupPrompt +
                            `
`;
                    if (afterRole)
                        text_85 +=
                            `
【补充设定 (After Role)】:
` +
                            afterRole +
                            `
`;
                    text_85 +=
                        `
【!!!重要指示!!!】:
你现在正处于真实的群聊实时语音通话中。
【要求】:
1. 这是一段连续发生的多人通话，不是点名发言。根据上一句的具体内容、语气和关系自然选择谁接话；后一条必须回应、补充、打断、追问或纠正前一条，禁止每个人各说一段互不相关的话。
2. 每次生成 3-8 条按实际发生顺序排列的简短发言。无需让所有成员出现，也不限制一名成员只能说一次；允许两三个人围绕同一件事连续来回。有至少两名可用成员时，本轮通常应形成至少两人之间的接话。
3. 已接入成员名单：` +
                        (activeSpeakerNames.length > 0 ? activeSpeakerNames.join('、') : 'None') +
                        `。senderName 必须严格使用名单中的准确名字，禁止添加名单外的人，禁止替 User 发言。
4. 每条 text 都必须是成员真正说出口的短句，口语化、即时、自然；避免长篇独白、总结式轮流发言和重复上一句。
5. translation 必须是 text 对应的自然中文翻译；text 本身是中文时也给出自然中文复述，不要留空。
6. 只输出对话。严禁输出 action、thought、inner、monologue、心声、内心、心理活动、动作、环境声、旁白等字段或内容；不要展示任何未说出口的信息。
7. 【输出格式】：只返回纯 JSON 数组，数组顺序就是实际接话顺序。每项只能包含 senderName、text、translation 三个字段，格式为：[{"senderName":"成员名","text":"原文台词","translation":"中文翻译"}]。` +
                        handleAction_45_78;
                    const chatCompletionsEndpoint_288 = window.u2Api.resolveChatCompletionsEndpoint(
                            apiConfig_3.endpoint,
                        ),
                        value_289 = await fetch(chatCompletionsEndpoint_288, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + apiConfig_3.apiKey,
                            },
                            body: JSON.stringify({
                                model: apiConfig_3.model || '',
                                messages: [
                                    {
                                        role: 'system',
                                        content: text_85,
                                    },
                                    {
                                        role: 'user',
                                        content: '请继续群语音通话',
                                    },
                                ],
                                temperature: parseFloat(apiConfig_3.temperature) || 0.8,
                            }),
                        });
                    if (!value_289.ok)
                        throw (
                            window.u2Api?.createHttpError?.(
                                value_289,
                                await window.u2Api?.readApiError?.(value_289),
                            ) ||
                            Object.assign(new Error('HTTP ' + value_289.status), {
                                status: value_289.status,
                            })
                        );
                    const value_89 = await value_289.json();
                    let fullReply = value_89.choices[0].message.content,
                        parsed_2 = null;
                    try {
                        let match_2 = fullReply.match(/\[[\s\S]*\]/);
                        if (match_2) parsed_2 = JSON.parse(match_2[0]);
                        else {
                            let singleMatch = fullReply.match(/\{[\s\S]*\}/);
                            if (singleMatch) parsed_2 = [JSON.parse(singleMatch[0])];
                            else {
                                let cleanText_2_2 = fullReply.trim();
                                if (cleanText_2_2.startsWith('```json'))
                                    cleanText_2_2 = cleanText_2_2.substring(7);
                                else {
                                    if (cleanText_2_2.startsWith('```'))
                                        cleanText_2_2 = cleanText_2_2.substring(3);
                                }
                                if (cleanText_2_2.endsWith('```'))
                                    cleanText_2_2 = cleanText_2_2.substring(
                                        0,
                                        cleanText_2_2.length - 3,
                                    );
                                parsed_2 = JSON.parse(cleanText_2_2.trim());
                            }
                        }
                        if (!Array.isArray(parsed_2)) parsed_2 = [parsed_2];
                        parsed_2 = parsed_2.slice(0, 8).map((item) => ({
                            senderName:
                                typeof item?.senderName === 'string' ? item.senderName.trim() : '',
                            text: typeof item?.text === 'string' ? item.text.trim() : '',
                            translation:
                                typeof item?.translation === 'string'
                                    ? item.translation.trim()
                                    : '',
                        }));
                    } catch (e_4) {
                        console.error('Failed to parse JSON in group call', e_4, fullReply);
                        parsed_2 = [];
                        if (window.showToast) window.showToast('AI返回格式错误，请重试');
                    }
                    if (groupCallTarget !== groupCallTarget_2) return;
                    const generatedTurn = {
                        messages: [],
                    };
                    parsed_2.forEach((msgObj) => {
                        if (msgObj.senderName && msgObj.text) {
                            let friend = groupMembers.find(
                                (m_5) =>
                                    m_5.nickname === msgObj.senderName ||
                                    m_5.realName === msgObj.senderName ||
                                    (m_5.nickname && msgObj.senderName.includes(m_5.nickname)) ||
                                    (m_5.realName && msgObj.senderName.includes(m_5.realName)),
                            );
                            if (friend) {
                                const message_10 = addGroupCallBubble(
                                    msgObj.text,
                                    friend.id,
                                    messagesArea,
                                    '',
                                    msgObj.translation || '',
                                );
                                if (message_10) generatedTurn.messages.push(message_10);
                            }
                        }
                    });
                    if (generatedTurn.messages.length === 0)
                        throw new Error('No valid group call dialogue returned');
                    lastGroupCallAiTurn = generatedTurn;
                } catch (value_327) {
                    console.error(value_327);
                    if (regenerateContext?.previousMessages) {
                        const restoredMessages_2 = restoreGroupCallAiTurn(
                            regenerateContext.previousMessages,
                        );
                        lastGroupCallAiTurn = {
                            messages: restoredMessages_2,
                        };
                    }
                    if (
                        !window.u2Api?.isRequestError?.(value_327) ||
                        !window.u2Api.reportError(value_327, {
                            operation: '群语音通话回复',
                        })
                    ) {
                        if (window.showToast) window.showToast('API 请求失败');
                    }
                } finally {
                    [aiBtn, regenerateBtn].filter(Boolean).forEach((button_3) => {
                        button_3.style.opacity = '1';
                        button_3.style.pointerEvents = 'auto';
                    });
                }
            });
        regenerateBtn &&
            bindCallFocusPreservingAction(regenerateBtn, () => {
                if (!lastGroupCallAiTurn?.messages?.length) {
                    if (window.showToast) window.showToast('暂无可重回的回复');
                    return;
                }
                const items_103 = [...lastGroupCallAiTurn.messages];
                value_44 = {
                    previousMessages: items_103,
                    previousReply: items_103
                        .map(
                            (value_331) =>
                                (value_331.senderName || '成员') + '：' + (value_331.text || ''),
                        )
                        .filter(Boolean).join(`
`),
                };
                handleAction_223(lastGroupCallAiTurn);
                lastGroupCallAiTurn = null;
                aiBtn.click();
            });
    };
    window.imChat.openVoiceCallDetail = function (value_332) {
        const voiceCallDetailModalElement = document.getElementById('voice-call-detail-modal'),
            voiceCallDetailContentElement = document.getElementById('voice-call-detail-content'),
            voiceCallDetailMetaElement = document.getElementById('voice-call-detail-meta');
        if (
            !voiceCallDetailModalElement ||
            !voiceCallDetailContentElement ||
            !voiceCallDetailMetaElement
        )
            return;
        voiceCallDetailMetaElement.innerText = '通话时长: ' + formatTime(value_332.duration || 0);
        voiceCallDetailContentElement.innerHTML = '';
        !value_332.callMessages || value_332.callMessages.length === 0
            ? (voiceCallDetailContentElement.innerHTML =
                  '<div style="text-align: center; color: #8e8e93; padding: 20px;">无通话内容记录</div>')
            : value_332.callMessages.forEach((cMsg) => {
                  const row_2 = document.createElement('div');
                  row_2.style.marginBottom = '12px';
                  const name_3 = document.createElement('div');
                  name_3.style.fontSize = '12px';
                  name_3.style.color = '#8e8e93';
                  name_3.style.marginBottom = '4px';
                  name_3.innerText = cMsg.isSelf ? '我' : '对方';
                  const bubble = document.createElement('div');
                  bubble.style.display = 'inline-block';
                  bubble.style.padding = '8px 12px';
                  bubble.style.borderRadius = '12px';
                  bubble.style.fontSize = '14px';
                  bubble.style.maxWidth = '85%';
                  bubble.style.wordBreak = 'break-word';
                  cMsg.isSelf
                      ? ((bubble.style.background = '#e5e5ea'), (bubble.style.color = '#000'))
                      : ((bubble.style.background = '#f2f2f7'), (bubble.style.color = '#000'));
                  bubble.innerText = cMsg.text;
                  row_2.appendChild(name_3);
                  row_2.appendChild(bubble);
                  voiceCallDetailContentElement.appendChild(row_2);
              });
        window.openView
            ? window.openView(voiceCallDetailModalElement)
            : (voiceCallDetailModalElement.style.display = 'flex');
    };
    function serializeCallMessagesForEdit(value_104, value_105 = null) {
        const items_106 = Array.isArray(value_104) ? value_104 : [];
        return items_106
            .map((value_107) => {
                const items_108 = [];
                if (value_107.actionText) items_108.push(String(value_107.actionText).trim());
                if (value_107.thoughtText)
                    items_108.push('心声：' + String(value_107.thoughtText).trim());
                if (value_107.visualSummary)
                    items_108.push('当时可见画面：' + String(value_107.visualSummary).trim());
                if (value_107.text)
                    items_108.push(
                        getCallSpeakerName(value_107, value_105) +
                            '：' +
                            formatCallLineText(value_107.text),
                    );
                if (value_107.translationText)
                    items_108.push('翻译：' + String(value_107.translationText).trim());
                return items_108.join(`
`);
            })
            .filter(Boolean).join(`

`);
    }
    function handleAction_5(
        value_109,
        value_110 = null,
        duration_3_2 = 0,
        value_112 = '通话记录',
        value_113 = false,
    ) {
        const items_114 = Array.isArray(value_109) ? value_109 : [],
            value_347 =
                Math.floor((Number(duration_3_2) || 0) / 60) +
                '分' +
                ((Number(duration_3_2) || 0) % 60) +
                '秒';
        if (value_112 === '已拒绝')
            return (
                '[' +
                (value_113 ? '视频' : '语音') +
                '通话记录] 对方刚刚拒绝了这通' +
                (value_113 ? '视频' : '语音') +
                '通话。'
            );
        if (value_112 === '已取消')
            return (
                '[' +
                (value_113 ? '视频' : '语音') +
                '通话记录] 用户刚刚取消了这通' +
                (value_113 ? '视频' : '语音') +
                '通话。'
            );
        const join_116 = items_114
            .map((value_117) => {
                const items_118 = [];
                if (value_117.actionText) items_118.push(String(value_117.actionText).trim());
                if (value_117.thoughtText)
                    items_118.push('心声：' + String(value_117.thoughtText).trim());
                if (value_117.visualSummary)
                    items_118.push('当时可见画面：' + String(value_117.visualSummary).trim());
                if (value_117.text)
                    items_118.push(
                        getCallSpeakerName(value_117, value_110) +
                            '：' +
                            formatCallLineText(value_117.text),
                    );
                if (value_117.translationText)
                    items_118.push('翻译：' + String(value_117.translationText).trim());
                return items_118.join(`
`);
            })
            .filter(Boolean).join(`
`);
        return join_116
            ? '[' +
                  (value_113 ? '视频' : '语音') +
                  '通话记录] 时长 ' +
                  value_347 +
                  `
` +
                  join_116
            : '[' +
                  (value_113 ? '视频' : '语音') +
                  '通话记录] 时长 ' +
                  value_347 +
                  '，未产生可识别的文本记录。';
    }
    function parseCallMessagesFromEdit(rawText, value_120 = [], friend_6 = null) {
        const groupUserIdentity_5 =
                friend_6?.type === 'group' && window.imApp?.getGroupUserIdentity
                    ? window.imApp.getGroupUserIdentity(friend_6)
                    : null,
            userNames = [
                groupUserIdentity_5?.name,
                window.userState?.name,
                window.userState?.realName,
                'User',
                '我',
            ]
                .filter(Boolean)
                .map((name_4) => String(name_4).trim()),
            charNames = [friend_6?.nickname, friend_6?.realName, 'Char', '对方']
                .filter(Boolean)
                .map((name_5) => String(name_5).trim()),
            items_125 = [];
        let actionText_4 = '',
            thoughtText_3 = '',
            translationText_5 = '',
            visualSummary_2 = '';
        String(rawText || '')
            .split(/\r?\n/)
            .forEach((value_132) => {
                const line = value_132.trim();
                if (!line) return;
                const thoughtMatch = line.match(/^心声[：:]\s*(.+)$/);
                if (thoughtMatch) {
                    thoughtText_3 = String(thoughtMatch[1] || '').trim();
                    return;
                }
                const match_135 = line.match(/^翻译[：:]\s*(.+)$/);
                if (match_135) {
                    const translationText_4 = String(match_135[1] || '').trim();
                    if (items_125.length && !actionText_4 && !thoughtText_3 && !visualSummary_2)
                        items_125[items_125.length - 1].translationText = translationText_4;
                    else translationText_5 = translationText_4;
                    return;
                }
                const match_136 = line.match(/^当时可见画面[：:]\s*(.+)$/);
                if (match_136) {
                    visualSummary_2 = String(match_136[1] || '').trim();
                    return;
                }
                const dialogMatch = line.match(/^(?:(.+?)[：:]\s*)?[「"](.*?)[」"]$/);
                if (dialogMatch) {
                    const speaker_3 = String(dialogMatch[1] || '').trim(),
                        text_7 = String(dialogMatch[2] || '').trim(),
                        message_141 = value_120[items_125.length] || {};
                    let isSelf_5 = !!message_141.isSelf;
                    if (speaker_3) {
                        if (userNames.some((name_6) => name_6 && speaker_3.includes(name_6)))
                            isSelf_5 = true;
                        if (charNames.some((name_7) => name_7 && speaker_3.includes(name_7)))
                            isSelf_5 = false;
                    }
                    items_125.push({
                        text: text_7,
                        actionText: actionText_4,
                        thoughtText: thoughtText_3,
                        visualSummary: visualSummary_2,
                        translationText: translationText_5,
                        isSelf: isSelf_5,
                        timestamp: message_141.timestamp || Date.now(),
                    });
                    actionText_4 = '';
                    thoughtText_3 = '';
                    visualSummary_2 = '';
                    translationText_5 = '';
                    return;
                }
                actionText_4 = actionText_4
                    ? actionText_4 +
                      `
` +
                      line
                    : line;
            });
        if (actionText_4 || thoughtText_3 || translationText_5 || visualSummary_2) {
            const message_145 = value_120[items_125.length] || {};
            items_125.push({
                text: '',
                actionText: actionText_4,
                thoughtText: thoughtText_3,
                visualSummary: visualSummary_2,
                translationText: translationText_5,
                isSelf: !!message_145.isSelf,
                timestamp: message_145.timestamp || Date.now(),
            });
        }
        return items_125;
    }
    function renderCallDetailReadMode(detailContent_2, value_150, value_377 = null) {
        detailContent_2.innerHTML = '';
        const safeMessages = Array.isArray(value_150.callMessages) ? value_150.callMessages : [];
        if (safeMessages.length === 0) {
            detailContent_2.innerHTML =
                '<div style="text-align:left; color:#8e8e93; padding:20px 0;">无通话内容记录</div>';
            return;
        }
        safeMessages.forEach((cMsg_2) => {
            const block = document.createElement('div');
            block.style.marginBottom = '14px';
            block.style.textAlign = 'left';
            block.style.color = '#111';
            block.style.fontSize = '15px';
            block.style.lineHeight = '1.65';
            if (cMsg_2.actionText) {
                const action_2 = document.createElement('div');
                action_2.style.whiteSpace = 'pre-wrap';
                action_2.style.wordBreak = 'break-word';
                action_2.innerText = cMsg_2.actionText;
                block.appendChild(action_2);
            }
            if (cMsg_2.thoughtText) {
                const thought_2 = document.createElement('div');
                thought_2.style.whiteSpace = 'pre-wrap';
                thought_2.style.wordBreak = 'break-word';
                thought_2.style.color = '#8e8e93';
                thought_2.style.fontSize = '13px';
                thought_2.innerText = cMsg_2.thoughtText;
                block.appendChild(thought_2);
            }
            if (cMsg_2.visualSummary) {
                const element_157 = document.createElement('div');
                element_157.style.cssText =
                    'white-space:pre-wrap;word-break:break-word;color:#52647b;font-size:13px;margin:3px 0';
                element_157.textContent = '当时可见画面：' + cMsg_2.visualSummary;
                block.appendChild(element_157);
            }
            if (cMsg_2.text) {
                const element_383 = document.createElement('div');
                element_383.style.whiteSpace = 'pre-wrap';
                element_383.style.wordBreak = 'break-word';
                element_383.innerText =
                    getCallSpeakerName(cMsg_2, value_377) + '：' + formatCallLineText(cMsg_2.text);
                block.appendChild(element_383);
            }
            if (cMsg_2.translationText) {
                const element_384 = document.createElement('div');
                element_384.style.whiteSpace = 'pre-wrap';
                element_384.style.wordBreak = 'break-word';
                element_384.style.color = '#8e8e93';
                element_384.style.fontSize = '13px';
                element_384.style.marginTop = '4px';
                element_384.innerText = '翻译：' + cMsg_2.translationText;
                block.appendChild(element_384);
            }
            detailContent_2.appendChild(block);
        });
    }
    function renderCallDetailEditMode(detailContent, msg, friend_7 = null) {
        detailContent.innerHTML = '';
        const textarea = document.createElement('textarea');
        textarea.id = 'voice-call-detail-editor';
        textarea.value = serializeCallMessagesForEdit(msg.callMessages, friend_7);
        textarea.style.width = '100%';
        textarea.style.height = '100%';
        textarea.style.minHeight = '320px';
        textarea.style.boxSizing = 'border-box';
        textarea.style.border = '1px solid #d1d1d6';
        textarea.style.borderRadius = '12px';
        textarea.style.padding = '12px';
        textarea.style.fontSize = '15px';
        textarea.style.lineHeight = '1.6';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.background = '#fff';
        textarea.style.color = '#111';
        detailContent.appendChild(textarea);
        textarea.focus();
    }
    window.imChat.openVoiceCallDetail = function (msg_4, friend_8 = null) {
        const voiceCallDetailModalElement_161 = document.getElementById('voice-call-detail-modal'),
            detailContent_3 = document.getElementById('voice-call-detail-content'),
            voiceCallDetailMetaElement_162 = document.getElementById('voice-call-detail-meta'),
            editBtn = document.getElementById('voice-call-detail-edit-btn'),
            saveBtn = document.getElementById('voice-call-detail-save-btn'),
            cancelBtn = document.getElementById('voice-call-detail-cancel-btn');
        if (!voiceCallDetailModalElement_161 || !detailContent_3 || !voiceCallDetailMetaElement_162)
            return;
        const detailFriend = friend_8 || window.imData?.currentActiveFriend || null;
        let isEditing = false;
        const setEditMode = (nextEditing) => {
            isEditing = nextEditing;
            if (editBtn) editBtn.style.display = isEditing ? 'none' : 'block';
            if (saveBtn) saveBtn.style.display = isEditing ? 'block' : 'none';
            if (cancelBtn) cancelBtn.style.display = isEditing ? 'block' : 'none';
            if (isEditing) renderCallDetailEditMode(detailContent_3, msg_4, detailFriend);
            else renderCallDetailReadMode(detailContent_3, msg_4, detailFriend);
        };
        voiceCallDetailMetaElement_162.innerText =
            (msg_4.isVideo ? '视频' : '语音') + '通话时长: ' + formatTime(msg_4.duration || 0);
        if (editBtn) editBtn.onclick = () => setEditMode(true);
        if (cancelBtn) cancelBtn.onclick = () => setEditMode(false);
        saveBtn &&
            (saveBtn.onclick = async () => {
                const editor = document.getElementById('voice-call-detail-editor');
                if (!editor) return;
                const previousMessages_4 = Array.isArray(msg_4.callMessages)
                        ? msg_4.callMessages
                        : [],
                    callMessages_5 = parseCallMessagesFromEdit(
                        editor.value,
                        previousMessages_4,
                        detailFriend,
                    ),
                    nextContextText = handleAction_5(
                        callMessages_5,
                        detailFriend,
                        msg_4.duration || 0,
                        msg_4.statusText || '通话记录',
                        !!msg_4.isVideo,
                    );
                msg_4.callMessages = callMessages_5;
                msg_4.content = nextContextText;
                msg_4.text = nextContextText;
                msg_4.updatedAt = new Date().toISOString();
                let saved = true;
                detailFriend?.id &&
                    window.imApp?.updateFriendMessage &&
                    ((saved = await window.imApp.updateFriendMessage(
                        detailFriend.id,
                        {
                            id: msg_4.id || null,
                            timestamp: msg_4.timestamp || null,
                        },
                        (targetMsg) => {
                            targetMsg.callMessages = callMessages_5;
                            targetMsg.content = nextContextText;
                            targetMsg.text = nextContextText;
                            targetMsg.updatedAt = msg_4.updatedAt;
                        },
                        {
                            silent: true,
                        },
                    )),
                    !saved && window.showToast && window.showToast('通话记录保存失败'));
                const page = detailFriend?.id
                        ? document.getElementById('chat-interface-' + detailFriend.id)
                        : null,
                    msgContainer = page ? page.querySelector('.ins-chat-messages') : null;
                if (msgContainer && window.imChat.rerenderChatContainer) {
                    const latestFriend =
                        (window.imData?.friends || []).find(
                            (item_3) => String(item_3.id) === String(detailFriend.id),
                        ) || detailFriend;
                    window.imChat.rerenderChatContainer(latestFriend, msgContainer, {
                        scroll: false,
                    });
                }
                if (saved && window.showToast) window.showToast('通话上下文已更新');
                setEditMode(false);
            });
        setEditMode(false);
        window.openView
            ? window.openView(voiceCallDetailModalElement_161)
            : (voiceCallDetailModalElement_161.style.display = 'flex');
    };
})();
