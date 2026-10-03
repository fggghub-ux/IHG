(
    window.u2OnStorageReady ||
    ((callback) => document.addEventListener('DOMContentLoaded', callback))
)(() => {
    const { apiConfig: apiConfig_2, userState: userState_2 } = window;
    window.imChat = window.imChat || {};
    const imChat_2 = window.imChat,
        offlineRegexEngine = window.imOfflineRegex,
        offlineReasoning = window.imOfflineReasoning,
        imOfflineSummaryErrors_6 = window.imOfflineSummaryErrors,
        count = 30000,
        OFFLINE_STREAM_RENDER_INTERVAL = 80,
        count_8 = 10,
        count_9 = 10,
        scrollTop_2 = 1000000000,
        threshold_2 = 2,
        count_12 = 2,
        count_13 = 1200,
        OFFLINE_COT_PROMPT_IDS = new Set([
            'cot_before',
            'cot_scene_planning',
            'cot_literary_guidance',
            'cot_language_check',
            'cot_read_previous_recap_haru',
            'cot_output_audit',
            'cot_after',
        ]),
        value_15 = (value_46) => {
            if (offlineReasoning?.isCotEntry)
                return offlineReasoning.isCotEntry(value_46, OFFLINE_COT_PROMPT_IDS);
            if (OFFLINE_COT_PROMPT_IDS.has(value_46?.id)) return true;
            if (value_46?.cotEnabled === true) return true;
            if (value_46?.cotEnabled === false) return false;
            if (!/^custom-/i.test(String(value_46?.id || '').trim())) return false;
            return /\bcot(?:\b|\d)|(?:思维|思考)链/i.test(String(value_46?.name || '').trim());
        },
        OFFLINE_CHAT_HISTORY_PROMPT_ID = 'chat_history',
        type_3 = 'offline_summary',
        type_2 = 'offline_generated_image',
        value_19 = new Set(),
        value_20 = (value_47) => {
            const value_48 =
                typeof value_47 === 'object' && value_47 !== null ? value_47.id : value_47;
            return value_48 == null ? '' : String(value_48);
        },
        isOfflineAutoImageMessage_2 = (value_49) => {
            const value_20_50 = value_20(value_49);
            return !!value_20_50 && value_19.has(value_20_50);
        },
        buildOfflineThinkingHtml_2 = (value_51, value_52) => {
            const value_20_53 = value_20(value_51);
            if (!value_20_53) return;
            if (value_52) value_19.add(value_20_53);
            else value_19['delete'](value_20_53);
            const activeFriend_2 = window.imData?.currentActiveFriend;
            if (!activeFriend_2 || String(activeFriend_2.id) !== value_20_53) return;
            document
                .querySelectorAll('#offline-chat-content [data-offline-action]')
                .forEach((value_55) => {
                    if (value_52) {
                        value_55.disabled = true;
                        value_55.dataset.offlineBusy = 'true';
                    } else
                        value_55.dataset.offlineBusy === 'true' &&
                            ((value_55.disabled = false), delete value_55.dataset.offlineBusy);
                });
        },
        OFFLINE_AUTO_IMAGE_MARKER = '【线下生图】',
        OFFLINE_CHAT_PROMPT_ORDER = [
            'role_identity',
            'data_zone',
            'memory_system',
            OFFLINE_CHAT_HISTORY_PROMPT_ID,
            'task_instruction',
            'length_words',
            'nsfw',
            'bilingual_dialogue',
            'perspective_first',
            'perspective_second',
            'perspective_third',
            'style_creative_guidance',
            'style_baimiao',
            'style_green_apple',
            'barrage_comments',
            'offline_recap_haru',
            'format_rules',
            'player_choices',
            'cot_before',
            'cot_scene_planning',
            'cot_literary_guidance',
            'cot_language_check',
            'cot_read_previous_recap_haru',
            'cot_output_audit',
            'cot_after',
        ],
        value_25 = (() => {
            let value_56 = null,
                count_57 = 0;
            const value_58 = () => document.getElementById('offline-result-preview-modal'),
                value_59 = () => document.getElementById('offline-result-preview-title'),
                value_60 = () => document.getElementById('offline-result-preview-subtitle'),
                value_61 = () => document.getElementById('offline-result-preview-editor'),
                value_62 = () => document.getElementById('offline-result-preview-textarea'),
                value_63 = () => document.getElementById('offline-result-preview-readonly'),
                value_64 = () => document.getElementById('offline-result-preview-regenerate'),
                value_65 = () => document.getElementById('offline-result-preview-confirm'),
                value_66 = () => document.getElementById('offline-result-preview-cancel'),
                value_67 = (value_72) => {
                    [value_66(), value_64(), value_65()].forEach((value_73) => {
                        if (value_73) value_73.disabled = !!value_72;
                    });
                },
                value_68 = (value_74) => {
                    const value_58_75 = value_58();
                    if (!value_58_75) return;
                    if (value_74) {
                        value_58_75.style.display = 'flex';
                        requestAnimationFrame(() => {
                            if (value_56 && value_58_75 === value_58())
                                value_58_75.classList.add('active');
                        });
                        return;
                    }
                    value_58_75.classList.remove('active');
                    setTimeout(() => {
                        if (!value_56 && value_58_75 === value_58())
                            value_58_75.style.display = 'none';
                    }, 180);
                },
                value_69 = (value_76) => {
                    Promise.resolve(value_76?.())['catch']((value_77) => {
                        console.error('Generated result preview action failed', value_77);
                    });
                },
                close_2 = () => {
                    value_56 = null;
                    ++count_57;
                    value_68(false);
                },
                bindControls_2 = () => {
                    const value_78 = (value_79, value_80, value_81) => {
                        if (!value_79 || value_79.dataset.generatedResultPreviewBound === 'true')
                            return;
                        value_79.dataset.generatedResultPreviewBound = 'true';
                        value_79.addEventListener(value_80, value_81);
                    };
                    value_78(value_66(), 'click', () => {
                        const value_82 = value_56;
                        if (!value_82 || value_82.busy) return;
                        close_2();
                        value_69(value_82.onCancel);
                    });
                    value_78(value_64(), 'click', () => {
                        const value_83 = value_56;
                        if (!value_83 || value_83.busy) return;
                        value_69(value_83.onRegenerate);
                    });
                    value_78(value_65(), 'click', () => {
                        const value_84 = value_56;
                        if (!value_84 || value_84.busy) return;
                        value_69(value_84.onConfirm);
                    });
                    value_78(value_58(), 'click', (event_85) => {
                        if (event_85.target !== value_58()) return;
                        const value_86 = value_56;
                        if (!value_86 || value_86.busy) return;
                        close_2();
                        value_69(value_86.onCancel);
                    });
                };
            return {
                open(value_87) {
                    bindControls_2();
                    value_56 = {
                        ...value_87,
                        token: ++count_57,
                        busy: false,
                    };
                    const hidden_2 = value_56.editable !== false;
                    if (value_59()) value_59().textContent = value_56.title || 'Preview';
                    if (value_60()) value_60().textContent = value_56.subtitle || '';
                    if (value_61()) value_61().hidden = !hidden_2;
                    if (value_62()) value_62().value = String(value_56.text || '');
                    value_63() &&
                        ((value_63().hidden = hidden_2),
                        (value_63().textContent = String(value_56.text || '')));
                    value_64() &&
                        ((value_64().hidden = typeof value_56.onRegenerate !== 'function'),
                        (value_64().textContent = value_56.regenerateText || 'Regenerate'));
                    if (value_65()) value_65().textContent = value_56.confirmText || 'Confirm';
                    return (value_67(false), value_68(true), value_56.token);
                },
                getState() {
                    return value_56;
                },
                getText() {
                    return String(value_62()?.value || '').trim();
                },
                setBusy(value_89) {
                    if (!value_56) return;
                    value_56.busy = !!value_89;
                    value_67(value_56.busy);
                },
                update(value_90) {
                    if (!value_56) return;
                    value_56 = {
                        ...value_56,
                        ...value_90,
                    };
                    if (value_59()) value_59().textContent = value_56.title || 'Preview';
                    if (value_60()) value_60().textContent = value_56.subtitle || '';
                    if (value_62()) value_62().value = String(value_56.text || '');
                    if (value_63()) value_63().textContent = String(value_56.text || '');
                },
                close: close_2,
                isCurrent(value_91) {
                    return !!value_56 && value_56.token === value_91;
                },
                bindControls: bindControls_2,
            };
        })();
    imChat_2.openGeneratedResultPreview = (value_92) => value_25.open(value_92);
    imChat_2.getGeneratedResultPreviewState = () => value_25.getState();
    imChat_2.getGeneratedResultPreviewText = () => value_25.getText();
    imChat_2.updateGeneratedResultPreview = (value_93) => value_25.update(value_93);
    imChat_2.setGeneratedResultPreviewBusy = (value_94) => value_25.setBusy(value_94);
    imChat_2.closeGeneratedResultPreview = () => value_25.close();
    imChat_2.isGeneratedResultPreviewCurrent = (value_95) => value_25.isCurrent(value_95);
    value_25.bindControls();
    async function commitSheetFriendChange(value_96, value_97, value_98 = {}) {
        if (!window.imApp.commitFriendChange) return false;
        const value_99 = typeof value_96 === 'object' && value_96 !== null ? value_96.id : value_96;
        return window.imApp.commitFriendChange(
            value_99,
            (currentActiveFriend_3) => {
                if (!currentActiveFriend_3) return;
                return (
                    window.imData.currentActiveFriend &&
                        String(window.imData.currentActiveFriend.id) ===
                            String(currentActiveFriend_3.id) &&
                        (window.imData.currentActiveFriend = currentActiveFriend_3),
                    value_97(currentActiveFriend_3)
                );
            },
            value_98,
        );
    }
    function handleAction_26(friend_2) {
        const latestFriend =
            friend_2?.id != null
                ? window.imApp?.getFriendById?.(friend_2.id) || friend_2
                : friend_2;
        if (!latestFriend || latestFriend.type === 'group' || !latestFriend.boundAccountId)
            return null;
        if (window.imApp?.getBoundAccountByFriend)
            return window.imApp.getBoundAccountByFriend(latestFriend);
        const accounts = typeof window.getAccounts === 'function' ? window.getAccounts() : [];
        return (
            accounts.find(
                (account) => String(account?.id) === String(latestFriend.boundAccountId),
            ) || null
        );
    }
    function handleAction_27(value_103, currentUserState_2 = null) {
        const fallback =
                currentUserState_2 ||
                (window.getUserState
                    ? window.getUserState()
                    : window.userState || userState_2 || {}),
            boundAccount = handleAction_26(value_103),
            source_2 = boundAccount || fallback || {};
        return {
            name:
                String(source_2.name || source_2.realName || source_2.nickname || 'User').trim() ||
                'User',
            avatarUrl: source_2.avatarUrl || source_2.avatar || '',
            signature: String(source_2.signature || '').trim(),
            persona: String(source_2.persona || '').trim(),
            boundAccountId: boundAccount?.id ?? null,
        };
    }
    function refreshOfflineUserIdentity_2(value_107) {
        const requestedId =
                typeof value_107 === 'object' && value_107 !== null ? value_107.id : value_107,
            activeFriend_3 = window.imData?.currentActiveFriend;
        if (
            !activeFriend_3 ||
            activeFriend_3.type === 'group' ||
            String(activeFriend_3.id) !== String(requestedId)
        )
            return false;
        const friend_3 = window.imApp?.getFriendById?.(requestedId) || activeFriend_3,
            profile = handleAction_27(friend_3),
            contentArea_2 = document.getElementById('offline-chat-content');
        if (!contentArea_2) return false;
        return (
            contentArea_2.querySelectorAll('.offline-chat-bubble.user').forEach((bubble_2) => {
                const nameEl = bubble_2.querySelector('.offline-chat-name');
                if (nameEl) nameEl.textContent = profile.name;
                const avatarEl = bubble_2.querySelector('.offline-chat-avatar');
                if (avatarEl) {
                    avatarEl.replaceChildren();
                    if (profile.avatarUrl) {
                        const img = document.createElement('img');
                        img.src = profile.avatarUrl;
                        img.alt = 'avatar';
                        avatarEl.appendChild(img);
                    } else {
                        const icon_2 = document.createElement('i');
                        icon_2.className = 'fas fa-user';
                        avatarEl.appendChild(icon_2);
                    }
                }
                const header = bubble_2.querySelector('.offline-chat-bubble-header');
                let signEl = bubble_2.querySelector('.offline-chat-sign');
                if (!profile.signature) signEl?.remove();
                else {
                    if (signEl) signEl.textContent = profile.signature;
                    else {
                        if (header) {
                            signEl = document.createElement('div');
                            signEl.className = 'offline-chat-sign';
                            signEl.textContent = profile.signature;
                            const nameContainer = header.querySelector(
                                '.offline-chat-name-container',
                            );
                            header.insertBefore(
                                signEl,
                                nameContainer?.nextSibling || header.firstChild,
                            );
                        }
                    }
                }
            }),
            true
        );
    }
    imChat_2.refreshOfflineUserIdentity = refreshOfflineUserIdentity_2;
    function getChatImagePlaceholderUrl() {
        return (
            window.imChat.CHAT_IMAGE_PLACEHOLDER_URL ||
            'assets/imessage/chat-image-placeholder-512.jpg'
        );
    }
    function resolveChatCompletionsEndpoint_2(config) {
        const endpoint_2 = String(config?.endpoint || '').trim();
        return endpoint_2 ? window.u2Api.resolveChatCompletionsEndpoint(endpoint_2) : '';
    }
    function getVisionResponseContent(data) {
        const firstChoice = Array.isArray(data?.choices) ? data.choices[0] : null;
        return (
            firstChoice?.message?.content || firstChoice?.text || firstChoice?.delta?.content || ''
        );
    }
    async function identifyChatImage_2(url_2) {
        const currentApiConfig = window.apiConfig || apiConfig_2 || {},
            chatCompletionsEndpoint_29 = resolveChatCompletionsEndpoint_2(currentApiConfig);
        if (!chatCompletionsEndpoint_29 || !currentApiConfig.apiKey || !currentApiConfig.model)
            throw new Error('请先在 API 配置中填写可识图的接口、密钥和模型');
        const controller = new AbortController(),
            timeoutId = setTimeout(() => controller.abort(), 30000);
        try {
            const response_2 = await fetch(chatCompletionsEndpoint_29, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + currentApiConfig.apiKey,
                },
                body: JSON.stringify({
                    model: currentApiConfig.model || '',
                    temperature: parseFloat(currentApiConfig.temperature) || 0.3,
                    messages: [
                        {
                            role: 'system',
                            content:
                                '你是图片识别助手。只输出一段简洁中文图片描述，包含主体、场景、明显文字和情绪氛围，不要解释过程。',
                        },
                        {
                            role: 'user',
                            content: [
                                {
                                    type: 'text',
                                    text: '请识别这张图片，输出可供聊天 AI 理解的中文描述。',
                                },
                                {
                                    type: 'image_url',
                                    image_url: {
                                        url: url_2,
                                    },
                                },
                            ],
                        },
                    ],
                }),
                signal: controller.signal,
            });
            if (!response_2.ok) {
                let errorText = response_2.status + ' ' + response_2.statusText;
                try {
                    errorText = JSON.stringify(await response_2.json());
                } catch (value_123) {}
                throw new Error(errorText);
            }
            const data_2 = await response_2.json(),
                content_2 = String(getVisionResponseContent(data_2) || '').trim();
            if (!content_2) throw new Error('Vision API returned empty content');
            return content_2;
        } finally {
            clearTimeout(timeoutId);
        }
    }
    function handleAction_31(value_124) {
        const trim_125 = String(value_124 || '')
            .replace(/^```(?:json|text)?\s*|\s*```$/gi, '')
            .trim();
        if (!trim_125)
            return {
                scenePrompt: '',
                charPresent: null,
                userPresent: null,
            };
        try {
            const result = JSON.parse(trim_125),
                scenePrompt_2 = String(result?.scenePrompt || result?.scene_prompt || '')
                    .trim()
                    .slice(0, 12000);
            if (scenePrompt_2)
                return {
                    scenePrompt: scenePrompt_2,
                    charPresent:
                        result.charPresent === true || result.char_present === true
                            ? true
                            : result.charPresent === false || result.char_present === false
                              ? false
                              : null,
                    userPresent:
                        result.userPresent === true || result.user_present === true
                            ? true
                            : result.userPresent === false || result.user_present === false
                              ? false
                              : null,
                };
        } catch (value_127) {}
        return {
            scenePrompt: trim_125.slice(0, 12000),
            charPresent: null,
            userPresent: null,
        };
    }
    async function handleAction_32(friend_4) {
        const currentApiConfig_2 = window.getApiConfig
                ? window.getApiConfig()
                : window.apiConfig || apiConfig_2 || {},
            chatCompletionsEndpoint_29_130 = resolveChatCompletionsEndpoint_2(currentApiConfig_2);
        if (
            !chatCompletionsEndpoint_29_130 ||
            !currentApiConfig_2.apiKey ||
            !currentApiConfig_2.model
        )
            throw new Error('请先完成 API 配置，再根据剧情生成提示词');
        if (window.imApp?.ensureFriendMessagesLoaded)
            await window.imApp.ensureFriendMessagesLoaded(friend_4);
        const latestFriend_2 = window.imApp?.getFriendById?.(friend_4.id) || friend_4,
            charName_2 = latestFriend_2.nickname || latestFriend_2.realName || 'Char',
            currentUser = window.getUserState?.() || window.userState || {},
            userName_2 = currentUser.name || 'User',
            context_2 = (Array.isArray(latestFriend_2.messages) ? latestFriend_2.messages : [])
                .filter(
                    (message_2) =>
                        message_2 && (message_2.role === 'user' || message_2.role === 'assistant'),
                )
                .slice(-30)
                .map((message_3) => {
                    const speaker_2 =
                            message_3.role === 'user'
                                ? userName_2
                                : message_3.speaker || message_3.senderName || charName_2,
                        value_141 =
                            message_3.type === 'image'
                                ? '[图片：' +
                                  (message_3.description || message_3.text || '无描述') +
                                  ']'
                                : String(message_3.content || message_3.text || '').trim();
                    return value_141 ? speaker_2 + '：' + value_141 : '';
                })
                .filter(Boolean)
                .join(
                    `
`,
                )
                .slice(-12000);
        if (!context_2) throw new Error('当前聊天还没有可用于生成画面的剧情');
        const controller_2 = new AbortController(),
            timeoutId_2 = setTimeout(() => controller_2.abort(), 60000);
        try {
            const headers_2 = window.u2Api?.buildApiHeaders
                    ? window.u2Api.buildApiHeaders(currentApiConfig_2, {
                          'X-U2-Silent-Errors': '1',
                      })
                    : {
                          'Content-Type': 'application/json',
                          Authorization: 'Bearer ' + currentApiConfig_2.apiKey,
                          'X-U2-Silent-Errors': '1',
                      },
                value_143 = await fetch(chatCompletionsEndpoint_29_130, {
                    method: 'POST',
                    headers: headers_2,
                    body: JSON.stringify({
                        model: currentApiConfig_2.model,
                        temperature: 0.6,
                        messages: [
                            {
                                role: 'system',
                                content:
                                    '你是剧情画面提炼助手。根据最近聊天选择最适合视觉化的当前剧情瞬间。只输出一个 JSON 对象，不要 Markdown、解释或额外字段：{"scenePrompt":"中文画面提示词","charPresent":true,"userPresent":false}。scenePrompt 只写本次画面的主体、动作、场景、构图、光线、氛围；不要写角色固定外貌、用户固定外貌、画师串、质量词或负面提示词。charPresent 和 userPresent 必须如实表示本次画面是否出现对应人物。',
                            },
                            {
                                role: 'user',
                                content:
                                    'Char 名称：' +
                                    charName_2 +
                                    `
User 名称：` +
                                    userName_2 +
                                    `
最近剧情：
` +
                                    context_2,
                            },
                        ],
                    }),
                    signal: controller_2.signal,
                });
            if (!value_143.ok) {
                const value_147 = await window.u2Api?.readApiError?.(value_143);
                throw (
                    window.u2Api?.createHttpError?.(value_143, value_147, '剧情提示词生成失败') ||
                    Object.assign(
                        new Error('剧情提示词生成失败（HTTP ' + value_143.status + '）'),
                        {
                            status: value_143.status,
                        },
                    )
                );
            }
            const value_144 = await value_143.json(),
                rawContent = getVisionResponseContent(value_144),
                content_3 = Array.isArray(rawContent)
                    ? rawContent.map((item) => item?.text || '').join('')
                    : String(rawContent || ''),
                handleAction_31_146 = handleAction_31(content_3);
            if (!handleAction_31_146.scenePrompt) throw new Error('API 没有返回剧情生图提示词');
            return handleAction_31_146;
        } catch (error_2) {
            if (error_2?.name === 'AbortError') throw new Error('剧情提示词生成超时，请稍后重试');
            throw error_2;
        } finally {
            clearTimeout(timeoutId_2);
        }
    }
    const isOfflineAutoImageMessage = (value_149) => value_149?.type === type_2,
        shouldAutoGenerateOfflineImage = (friend) =>
            !!friend && friend.type === 'char' && friend.offlineAutoImageGeneration === true,
        splitOfflineAutoImageMarker = (value_150) => {
            const source_3 = String(value_150 || ''),
                markerIndex = source_3.lastIndexOf(OFFLINE_AUTO_IMAGE_MARKER);
            if (markerIndex < 0)
                return {
                    content: source_3.trim(),
                    scene: '',
                };
            const before = source_3.slice(0, markerIndex).trimEnd(),
                after = source_3.slice(markerIndex + OFFLINE_AUTO_IMAGE_MARKER.length).trim(),
                lineBreakIndex = after.search(/[\r\n]/),
                scene_2 = (lineBreakIndex < 0 ? after : after.slice(0, lineBreakIndex))
                    .trim()
                    .slice(0, 4000),
                trailingText = lineBreakIndex < 0 ? '' : after.slice(lineBreakIndex).trim();
            return {
                content: [before, trailingText]
                    .filter(Boolean)
                    .join(
                        `

`,
                    )
                    .trim(),
                scene: scene_2,
            };
        },
        value_35 = (value_157) => {
            return String(value_157 || '').trim();
        },
        buildOfflineAutoImageRequirement = () =>
            `<offline_auto_image_rule>
Only when the current offline story reaches a moment that is genuinely worth visualizing, append exactly one final line in this exact format:
` +
            OFFLINE_AUTO_IMAGE_MARKER +
            ` concise Chinese image scene prompt
The prompt must describe the same current moment with characters, action, setting, composition, light, and atmosphere. Do not use this marker for ordinary dialogue or routine transitions. If no visual image is needed, do not output the marker at all. The marker line is frontend-only and must be the final line after all prose, barrage, choices, and recap content.
</offline_auto_image_rule>`;
    function createAttachmentSheet_2(page) {
        if (window.imData.attachmentSheet)
            return (
                window.imData.attachmentSheet.parentNode !== page &&
                    page.appendChild(window.imData.attachmentSheet),
                window.imData.attachmentSheet
            );
        const attachmentSheet_2 = document.createElement('div');
        attachmentSheet_2.id = 'chat-attachment-sheet';
        window.imData.attachmentSheet = attachmentSheet_2;
        attachmentSheet_2.style.position = 'absolute';
        attachmentSheet_2.style.inset = '0';
        attachmentSheet_2.style.zIndex = '45';
        attachmentSheet_2.style.display = 'none';
        attachmentSheet_2.style.flexDirection = 'column';
        attachmentSheet_2.style.justifyContent = 'flex-end';
        attachmentSheet_2.style.overflow = 'hidden';
        attachmentSheet_2.innerHTML = `
            <div class="sheet-overlay" style="position: absolute; inset: 0; background: rgba(0,0,0,0.4); opacity: 0; transition: opacity 0.3s;"></div>
            <div class="sheet-content" style="position: relative; height: 50%; width: 100%; background: #fff; border-radius: 24px 24px 0 0; display: flex; flex-direction: column; overflow: hidden; transform: translateY(100%); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1); ">
                <!-- Header -->
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; background: rgba(255,255,255,0.95);   z-index: 10;">
                    <div class="close-sheet-btn" style="width: 32px; height: 32px; background: #f2f2f7; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; color: #000;"><i class="fas fa-times"></i></div>
                    <div style="font-weight: 600; font-size: 18px; color: #000;">Recents <i class="fas fa-chevron-down" style="font-size: 12px; color: #8e8e93; margin-left: 4px;"></i></div>
                    <div style="width: 32px;"></div>
                </div>
                
                <!-- Views Container -->
                <div style="flex: 1; position: relative; overflow: hidden; background: #fff;">
                    <!-- Gallery View -->
                    <div class="sheet-view view-gallery" style="position: absolute; inset: 0; overflow-y: auto; padding: 14px 16px 120px; display: flex; flex-direction: column; gap: 10px; align-items: stretch; scrollbar-width: none;">
                        <div class="grid-item album-image-entry" style="min-height: 68px; box-sizing: border-box; background: #f7f7fa; border-radius: 16px; border: 1px solid #ececf1; display: flex; align-items: center; gap: 13px; padding: 12px 14px; cursor: pointer;">
                            <div style="width: 42px; height: 42px; border-radius: 13px; background: rgba(52,199,89,0.12); display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-images" style="font-size: 20px; color: #34c759;"></i></div>
                            <div style="display: flex; flex-direction: column; gap: 3px; min-width: 0; flex: 1;"><span style="font-size: 15px; color: #111; font-weight: 750;">相册图片</span><span style="font-size: 12px; color: #8e8e93;">上传图片或自定义图片内容</span></div>
                            <i class="fas fa-chevron-right" style="font-size: 13px; color: #c7c7cc; flex-shrink: 0;"></i>
                        </div>
                        <div class="grid-item generated-image-entry" style="min-height: 68px; box-sizing: border-box; background: #f7f7fa; border-radius: 16px; border: 1px solid #ececf1; display: flex; align-items: center; gap: 13px; padding: 12px 14px; cursor: pointer;">
                            <div style="width: 42px; height: 42px; border-radius: 13px; background: rgba(175,82,222,0.12); display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-wand-magic-sparkles" style="font-size: 20px; color: #af52de;"></i></div>
                            <div style="display: flex; flex-direction: column; gap: 3px; min-width: 0; flex: 1;"><span style="font-size: 15px; color: #111; font-weight: 750;">生成图片</span><span style="font-size: 12px; color: #8e8e93;">输入提示词生成</span></div>
                            <i class="fas fa-chevron-right" style="font-size: 13px; color: #c7c7cc; flex-shrink: 0;"></i>
                        </div>
                    </div>

                    <!-- Linked Friends View -->
                    <div class="sheet-view view-file" style="position: absolute; inset: 0; display: none; background: #fff; padding: 14px 14px 112px; box-sizing: border-box; overflow-y: auto; -webkit-overflow-scrolling: touch;">
                        <div class="linked-accounts-panel" style="width: 100%; display: flex; flex-direction: column; gap: 12px;">
                            <div class="linked-accounts-empty" style="display:none; text-align:center; color:#8e8e93; font-size:13px; line-height:1.45; padding:42px 18px;"></div>
                            <div class="linked-accounts-controls" style="display:flex; flex-direction:column; gap:10px;">
                                <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px 14px; border-radius:18px; background:#f7f7fa;">
                                    <div style="min-width:0;">
                                        <div style="font-size:15px; font-weight:800; color:#111;">是否开启关联好友</div>
                                        <div class="linked-accounts-status" style="font-size:12px; color:#8e8e93; margin-top:2px;">开启后会自动生成好友会话</div>
                                    </div>
                                    <label class="toggle-switch" style="flex-shrink:0;">
                                        <input type="checkbox" class="linked-accounts-toggle">
                                        <span class="slider"></span>
                                    </label>
                                </div>
                                <div class="linked-accounts-interval-row" style="display:none; align-items:center; justify-content:space-between; gap:12px; padding:12px 14px; border-radius:18px; background:#f7f7fa;">
                                    <div>
                                        <div style="font-size:15px; font-weight:700; color:#111;">多少秒自动调用一次 API</div>
                                        <div style="font-size:12px; color:#8e8e93; margin-top:2px;">开启后按此间隔自动生成消息</div>
                                    </div>
                                    <input type="number" class="linked-accounts-interval-input" min="5" step="1" value="60" style="width:82px; height:34px; border:1px solid #e5e5ea; border-radius:12px; background:#fff; color:#111; font-size:15px; text-align:center; outline:none;">
                                </div>
                            </div>
                            <div class="linked-accounts-list" style="display:flex; flex-direction:column; gap:10px;"></div>
                        </div>
                    </div>

                    <!-- Location opens a dedicated composer overlay. -->
                    <div class="sheet-view view-location" style="position: absolute; inset: 0; display: none; flex-direction: column; align-items: center; justify-content: center; background: #fff; padding-bottom: 60px;">
                        <i class="fas fa-map-marked-alt" style="font-size: 64px; color: #5d5d5d; margin-bottom: 16px;"></i>
                        <div style="font-size: 16px; color: #242424; font-weight: 700;">发送虚拟定位</div>
                        <div style="font-size: 13px; color: #7b7b7b; margin-top: 5px;">填写地点名和详细地址</div>
                        <button type="button" class="location-open-composer-btn" style="height: 44px; min-width: 148px; margin-top: 20px; border: none; border-radius: 14px; background: #292929; color: #f7f7f7; font-size: 15px; font-weight: 800; cursor: pointer;">发送定位</button>
                    </div>

                    <!-- Stickers View -->
                    <div class="sheet-view view-stickers" style="position: absolute; inset: 0; display: none; flex-direction: column; background: #fff; padding: 12px 0 112px; overflow: hidden;">
                        <div class="sheet-sticker-category-tabs"></div>
                        <div class="sheet-stickers-list"></div>
                    </div>

                    <!-- More View -->
                    <div class="sheet-view view-more" style="position: absolute; inset: 0; display: none; flex-direction: column; align-items: flex-start; justify-content: flex-start; overflow-y: auto; background: #fff; padding: 20px 18px 120px; gap: 14px;">
                        <div class="attachment-more-icon-grid">
                            <div class="attachment-more-regenerate-entry">
                                <div class="attachment-more-regenerate-icon">
                                    <i class="fas fa-rotate-left"></i>
                                </div>
                                <div class="attachment-more-regenerate-label">重回</div>
                            </div>
                            <div class="attachment-more-pay-entry">
                                <div class="attachment-more-pay-icon">
                                    <i class="fas fa-wallet"></i>
                                </div>
                                <div class="attachment-more-pay-label">Pay</div>
                            </div>
                            <div class="attachment-more-contact-entry" style="display:none;">
                                <div class="attachment-more-contact-icon">
                                    <i class="fas fa-address-card"></i>
                                </div>
                                <div class="attachment-more-contact-label">名片</div>
                            </div>
                            <div class="attachment-more-offline-entry" id="open-offline-chats-btn">
                                <div class="attachment-more-offline-icon">
                                    <i class="fas fa-people-arrows"></i>
                                </div>
                                <div class="attachment-more-offline-label">线下</div>
                            </div>
                            <div class="attachment-more-voice-entry">
                                <div class="attachment-more-voice-icon">
                                    <i class="fas fa-microphone-alt"></i>
                                </div>
                                <div class="attachment-more-voice-label">Voice</div>
                            </div>
                            <div class="attachment-more-listen-entry" style="display:none;">
                                <div class="attachment-more-listen-icon">
                                    <i class="fas fa-headphones"></i>
                                </div>
                                <div class="attachment-more-listen-label">一起听</div>
                            </div>
                            <div class="attachment-more-link-entry">
                                <div class="attachment-more-link-icon">
                                    <i class="fas fa-link"></i>
                                </div>
                                <div class="attachment-more-link-label">链接</div>
                            </div>
                            <div class="attachment-more-narration-entry">
                                <div class="attachment-more-narration-icon">
                                    <i class="fas fa-quote-left"></i>
                                </div>
                                <div class="attachment-more-narration-label">旁白</div>
                            </div>
                            <div class="attachment-more-dynamic-action-entry">
                                <div class="attachment-more-dynamic-action-icon">
                                    <i class="fas fa-running"></i>
                                </div>
                                <div class="attachment-more-dynamic-action-label">动描</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bottom Tabs (Floating Pill, Left Aligned, Tap to Select) -->
                <div class="sheet-tabs-container" style="position: absolute; bottom: 16px; left: 20px; right: 20px; border-radius: 40px; display: flex; padding: 10px 16px; overflow-x: auto; background: rgba(250, 250, 250, 0.75);    scrollbar-width: none; gap: 24px; align-items: center; justify-content: flex-start;">
                    <style>
                        #chat-attachment-sheet ::-webkit-scrollbar { display: none; }

                        .attachment-more-pay-entry,
                        .attachment-more-link-entry,
                        .attachment-more-contact-entry,
                        .attachment-more-voice-entry,
                        .attachment-more-listen-entry,
                        .attachment-more-narration-entry,
                        .attachment-more-dynamic-action-entry,
                        .attachment-more-offline-entry {
                            cursor: pointer;
                            transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s;
                        }
                        .attachment-more-regenerate-entry {
                            cursor: pointer;
                            transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s;
                        }
                        .attachment-more-pay-entry:active,
                        .attachment-more-link-entry:active,
                        .attachment-more-contact-entry:active,
                        .attachment-more-voice-entry:active,
                        .attachment-more-listen-entry:active,
                        .attachment-more-narration-entry:active,
                        .attachment-more-dynamic-action-entry:active,
                        .attachment-more-offline-entry:active {
                            transform: scale(0.85);
                            opacity: 0.7;
                        }
                        .attachment-more-regenerate-entry:active {
                            transform: scale(0.85);
                            opacity: 0.7;
                        }

                        .sheet-tab-item {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            gap: 3px;
                            min-width: 44px;
                            cursor: pointer;
                            transition: transform 0.2s, opacity 0.2s;
                            flex-shrink: 0;
                        }
                        .sheet-tab-icon {
                            font-size: 24px;
                            color: #8e8e93;
                            transition: color 0.2s, transform 0.2s;
                        }
                        .sheet-tab-text {
                            font-size: 10px;
                            color: #8e8e93;
                            font-weight: 500;
                            transition: color 0.2s;
                        }
                        .sheet-tab-item.active .sheet-tab-icon {
                            color: #007aff;
                            transform: scale(1.1);
                        }
                        .sheet-tab-item.active .sheet-tab-text {
                            color: #007aff;
                            font-weight: 600;
                        }
                        .sheet-stickers-list {
                            width: 100%;
                            flex: 1;
                            min-height: 0;
                            overflow-y: auto;
                            padding: 12px 14px 0;
                            box-sizing: border-box;
                        }
                        .sheet-sticker-category-tabs {
                            width: 100%;
                            display: flex;
                            gap: 8px;
                            overflow-x: auto;
                            padding: 0 14px 10px;
                            box-sizing: border-box;
                            border-bottom: 1px solid #f2f2f7;
                            flex-shrink: 0;
                        }
                        .sheet-sticker-category-tab {
                            height: 32px;
                            border: none;
                            border-radius: 999px;
                            background: #f7f7fa;
                            color: #636366;
                            padding: 0 13px;
                            font-size: 13px;
                            font-weight: 700;
                            white-space: nowrap;
                            cursor: pointer;
                            flex-shrink: 0;
                        }
                        .sheet-sticker-category-tab.active {
                            background: #111;
                            color: #fff;
                        }
                        .sheet-sticker-grid {
                            display: grid;
                            grid-template-columns: repeat(4, minmax(0, 1fr));
                            gap: 10px;
                        }
                        .sheet-sticker-item {
                            border: none;
                            border-radius: 14px;
                            background: #f7f7fa;
                            padding: 7px;
                            cursor: pointer;
                            overflow: hidden;
                            min-width: 0;
                            display: flex;
                            flex-direction: column;
                            gap: 5px;
                            align-items: stretch;
                        }
                        .sheet-sticker-item img {
                            width: 100%;
                            aspect-ratio: 1;
                            object-fit: contain;
                            display: block;
                            min-height: 0;
                        }
                        .sheet-sticker-name {
                            display: block;
                            min-width: 0;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            color: #3a3a3c;
                            font-size: 11px;
                            line-height: 1.2;
                            text-align: center;
                        }
                    </style>
                    
                    <div class="sheet-tab-item active" data-tab="gallery">
                        <i class="fas fa-image sheet-tab-icon"></i>
                        <span class="sheet-tab-text">Gallery</span>
                    </div>
                    <div class="sheet-tab-item" data-tab="file">
                        <i class="fas fa-user-friends sheet-tab-icon"></i>
                        <span class="sheet-tab-text">Friends</span>
                    </div>
                    <div class="sheet-tab-item" data-tab="location">
                        <i class="fas fa-map-marker-alt sheet-tab-icon"></i>
                        <span class="sheet-tab-text">Location</span>
                    </div>
                    <div class="sheet-tab-item" data-tab="stickers">
                        <i class="fas fa-smile sheet-tab-icon"></i>
                        <span class="sheet-tab-text">Stickers</span>
                    </div>
                    <div class="sheet-tab-item" data-tab="more">
                        <i class="fas fa-ellipsis-h sheet-tab-icon"></i>
                        <span class="sheet-tab-text">More</span>
                    </div>
                </div>
            </div>

            <div class="contact-card-picker-overlay">
                <div class="contact-card-picker-panel" role="dialog" aria-modal="true" aria-label="选择名片">
                    <div class="contact-card-picker-header"><strong>选择名片</strong><span>选择一个 Char 或 NPC 发送给对方</span></div>
                    <div class="contact-card-picker-list"></div>
                    <div class="contact-card-picker-actions">
                        <button type="button" class="contact-card-picker-cancel">取消</button>
                        <button type="button" class="contact-card-picker-confirm" disabled>确定发送</button>
                    </div>
                </div>
            </div>
            
            <!-- Pay Transfer Overlay moved to attachmentSheet root so it floats centrally and isn't cropped -->
            <div class="pay-transfer-form-overlay" style="position: absolute; inset: 0; display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.18); z-index: 20; padding: 20px;">
                <div class="pay-transfer-form-card" style="width: 100%; max-width: 348px; border-radius: 30px; background: rgba(255,255,255,0.98);  padding: 18px 16px 16px; box-sizing: border-box;  ">
                    <div class="pay-transfer-form-title" style="font-size: 18px; font-weight: 800; color: #111; text-align: center; margin-bottom: 10px;">Pay</div>
                    <div class="pay-transfer-mode-tabs" style="display: flex; justify-content: center; gap: 22px; margin-bottom: 14px; border-bottom: 1px solid rgba(0,0,0,0.08);">
                        <button type="button" class="pay-mode-tab active" data-pay-mode="transfer" style="position: relative; border: none; background: none; color: #000; font-size: 15px; font-weight: 600; padding: 0 2px 10px; cursor: pointer;">转账</button>
                        <button type="button" class="pay-mode-tab" data-pay-mode="red_packet" style="position: relative; border: none; background: none; color: #8e8e93; font-size: 15px; font-weight: 600; padding: 0 2px 10px; cursor: pointer;">红包</button>
                    </div>

                    <div class="pay-mode-panel pay-mode-panel-transfer" style="display: block;">
                        <div class="pay-form-field" style="margin-bottom: 10px;">
                            <div style="font-size: 12px; color: #8e8e93; margin-bottom: 6px;">金额</div>
                            <input type="number" class="pay-transfer-amount-input" placeholder="金额，例如 88.88" min="0" step="0.01" style="width: 100%; height: 42px; border: none; border-radius: 16px; background: #f7f7fa; padding: 0 14px; box-sizing: border-box; font-size: 14px; color: #111;">
                        </div>
                        <div class="pay-form-field" style="margin-bottom: 10px;">
                            <div style="font-size: 12px; color: #8e8e93; margin-bottom: 6px;">描述</div>
                            <input type="text" class="pay-transfer-desc-input" placeholder="描述，例如 奶茶钱 / 晚餐AA" style="width: 100%; height: 42px; border: none; border-radius: 16px; background: #f7f7fa; padding: 0 14px; box-sizing: border-box; font-size: 14px; color: #111;">
                        </div>
                        <div class="pay-form-field pay-group-recipient-field" style="display: none; margin-bottom: 6px; position: relative;">
                            <div style="font-size: 12px; color: #8e8e93; margin-bottom: 8px;">转账给谁</div>
                            <button type="button" class="pay-group-recipient-trigger" style="width: 100%; height: 48px; border: none; border-radius: 16px; background: #f7f7fa; padding: 0 14px; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                                <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                                    <div class="pay-group-recipient-avatar" style="width: 28px; height: 28px; border-radius: 50%; overflow: hidden; background: #e5e5ea; color: #8e8e93; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 12px;">
                                        <i class="fas fa-user"></i>
                                    </div>
                                    <div class="pay-group-recipient-label" style="font-size: 14px; color: #111; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">请选择群成员</div>
                                </div>
                                <i class="fas fa-chevron-down pay-group-recipient-arrow" style="font-size: 12px; color: #8e8e93;"></i>
                            </button>
                            <div class="pay-group-recipient-dropdown" style="display: none; margin-top: 8px; border-radius: 18px; background: #fff;  padding: 8px; max-height: 220px; overflow-y: auto;"></div>
                        </div>
                    </div>

                    <div class="pay-mode-panel pay-mode-panel-red-packet" style="display: none;">
                        <div class="pay-form-field" style="margin-bottom: 10px;">
                            <div style="font-size: 12px; color: #8e8e93; margin-bottom: 6px;">红包个数</div>
                            <input type="number" class="pay-red-packet-count-input" placeholder="例如 3" min="1" step="1" style="width: 100%; height: 42px; border: none; border-radius: 16px; background: #f7f7fa; padding: 0 14px; box-sizing: border-box; font-size: 14px; color: #111;">
                        </div>
                        <div class="pay-form-field" style="margin-bottom: 10px;">
                            <div style="font-size: 12px; color: #8e8e93; margin-bottom: 6px;">总金额</div>
                            <input type="number" class="pay-red-packet-amount-input" placeholder="总金额，例如 88.88" min="0" step="0.01" style="width: 100%; height: 42px; border: none; border-radius: 16px; background: #f7f7fa; padding: 0 14px; box-sizing: border-box; font-size: 14px; color: #111;">
                        </div>
                        <div class="pay-form-field" style="margin-bottom: 6px;">
                            <div style="font-size: 12px; color: #8e8e93; margin-bottom: 6px;">描述</div>
                            <input type="text" class="pay-red-packet-desc-input" placeholder="描述，例如 恭喜发财 / 今晚奶茶" style="width: 100%; height: 42px; border: none; border-radius: 16px; background: #f7f7fa; padding: 0 14px; box-sizing: border-box; font-size: 14px; color: #111;">
                        </div>
                    </div>

                    <div class="pay-transfer-form-actions" style="display: flex; gap: 4px; margin-top: 16px;">
                        <div class="pay-transfer-cancel-btn" style="flex: 1; height: 44px; border-radius: 16px; background: #f2f2f7; color: #666; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700; cursor: pointer;">取消</div>
                        <div class="pay-transfer-submit-btn" style="flex: 1; height: 44px; border-radius: 16px; background: #111; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 800; cursor: pointer;">发送</div>
                    </div>
                </div>
            </div>
            <div class="voice-message-form-overlay" style="position: absolute; inset: 0; display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.18); z-index: 21; padding: 20px;">
                <div class="voice-message-form-card" style="width: 100%; max-width: 348px; border-radius: 30px; background: rgba(255,255,255,0.98);  padding: 18px 16px 16px; box-sizing: border-box;  ">
                    <div style="display:flex; align-items:center; justify-content:center; gap:8px; font-size:18px; font-weight:800; color:#111; text-align:center; margin-bottom:12px;">
                        <i class="fas fa-microphone-alt" style="color:#111;"></i>
                        <span>Voice</span>
                    </div>
                    <textarea class="voice-message-transcript-input" placeholder="输入语音内容..." style="width:100%; min-height:112px; max-height:180px; resize:none; border:none; outline:none; border-radius:20px; background:#f7f7fa; padding:13px 14px; box-sizing:border-box; font-size:15px; line-height:1.45; color:#111; font-family:inherit;"></textarea>
                    <div style="font-size:12px; color:#8e8e93; line-height:1.45; margin:10px 2px 0;">将以语音气泡发送，并把这段文字作为转文字内容给 AI。</div>
                    <div class="voice-message-form-actions" style="display:flex; gap:8px; margin-top:16px;">
                        <div class="voice-message-cancel-btn" style="flex:1; height:44px; border-radius:16px; background:#f2f2f7; color:#666; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:700; cursor:pointer;">取消</div>
                        <div class="voice-message-submit-btn" style="flex:1; height:44px; border-radius:16px; background:#111; color:#fff; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:800; cursor:pointer;">发送</div>
                    </div>
                </div>
            </div>
            <div class="narration-form-overlay" style="position: absolute; inset: 0; display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.18); z-index: 22; padding: 20px;">
                <div class="narration-form-card" style="width: 100%; max-width: 348px; border-radius: 30px; background: rgba(255,255,255,0.98); padding: 18px 16px 16px; box-sizing: border-box;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:8px; font-size:18px; font-weight:800; color:#111; text-align:center; margin-bottom:12px;">
                        <i class="fas fa-quote-left" style="color:#5856d6;"></i>
                        <span>旁白</span>
                    </div>
                    <textarea class="narration-message-input" placeholder="输入旁白，例如：窗外雨声慢慢停了" style="width:100%; min-height:120px; max-height:200px; resize:none; border:none; outline:none; border-radius:20px; background:#f7f7fa; padding:13px 14px; box-sizing:border-box; font-size:15px; line-height:1.45; color:#111; font-family:inherit;"></textarea>
                    <div style="font-size:12px; color:#8e8e93; line-height:1.45; margin:10px 2px 0;">会作为居中事件进入聊天上下文，不会自动触发 AI。</div>
                    <div class="narration-form-actions" style="display:flex; gap:8px; margin-top:16px;">
                        <div class="narration-cancel-btn" style="flex:1; height:44px; border-radius:16px; background:#f2f2f7; color:#666; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:700; cursor:pointer;">取消</div>
                        <div class="narration-submit-btn" style="flex:1; height:44px; border-radius:16px; background:#111; color:#fff; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:800; cursor:pointer;">发送</div>
                    </div>
                </div>
            </div>
            <div class="regenerate-form-overlay" style="position: absolute; inset: 0; display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.18); z-index: 23; padding: 20px;">
                <div class="regenerate-form-card" style="width: 100%; max-width: 348px; border-radius: 30px; background: rgba(255,255,255,0.98); padding: 18px 16px 16px; box-sizing: border-box;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:8px; font-size:18px; font-weight:800; color:#111; text-align:center; margin-bottom:12px;">
                        <i class="fas fa-rotate-left" style="color:#8e8e93;"></i>
                        <span>重回上一轮回复</span>
                    </div>
                    <textarea class="regenerate-requirement-input" placeholder="可以写为什么重回，或希望 TA 怎样回复。例如：角色ooc了，注意人设" style="width:100%; min-height:120px; max-height:200px; resize:none; border:none; outline:none; border-radius:20px; background:#f7f7fa; padding:13px 14px; box-sizing:border-box; font-size:15px; line-height:1.45; color:#111; font-family:inherit;"></textarea>
                    <div style="font-size:12px; color:#8e8e93; line-height:1.45; margin:10px 2px 0;">参考：按上方要求重回生成；重回：不带要求直接重回。</div>
                    <div class="regenerate-form-actions" style="display:flex; gap:8px; margin-top:16px;">
                        <div class="regenerate-reference-btn" style="flex:1; height:44px; border-radius:16px; background:#8e8e93; color:#fff; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:800; cursor:pointer;">参考</div>
                        <div class="regenerate-direct-btn" style="flex:1; height:44px; border-radius:16px; background:#111; color:#fff; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:800; cursor:pointer;">重回</div>
                    </div>
                </div>
            </div>
        `;
        page.appendChild(attachmentSheet_2);
        const sheetOverlayElement = attachmentSheet_2.querySelector('.sheet-overlay'),
            content_4 = attachmentSheet_2.querySelector('.sheet-content'),
            closeBtn = attachmentSheet_2.querySelector('.close-sheet-btn'),
            tabsContainer = attachmentSheet_2.querySelector('.sheet-tabs-container'),
            tabItems = attachmentSheet_2.querySelectorAll('.sheet-tab-item'),
            payEntry = attachmentSheet_2.querySelector('.attachment-more-pay-entry'),
            linkEntry = attachmentSheet_2.querySelector('.attachment-more-link-entry'),
            attachmentMoreContactEntryElement = attachmentSheet_2.querySelector(
                '.attachment-more-contact-entry',
            ),
            regenerateEntry = attachmentSheet_2.querySelector('.attachment-more-regenerate-entry'),
            voiceEntry = attachmentSheet_2.querySelector('.attachment-more-voice-entry'),
            listenEntry = attachmentSheet_2.querySelector('.attachment-more-listen-entry'),
            narrationEntry = attachmentSheet_2.querySelector('.attachment-more-narration-entry'),
            attachmentMoreDynamicActionEntryElement = attachmentSheet_2.querySelector(
                '.attachment-more-dynamic-action-entry',
            ),
            attachmentMoreDynamicActionLabelElement = attachmentSheet_2.querySelector(
                '.attachment-more-dynamic-action-label',
            ),
            attachmentMoreOfflineEntryElement = attachmentSheet_2.querySelector(
                '.attachment-more-offline-entry',
            ),
            attachmentMoreOfflineLabelElement = attachmentSheet_2.querySelector(
                '.attachment-more-offline-label',
            ),
            payFormOverlay = attachmentSheet_2.querySelector('.pay-transfer-form-overlay'),
            voiceFormOverlay = attachmentSheet_2.querySelector('.voice-message-form-overlay'),
            voiceTranscriptInput = attachmentSheet_2.querySelector(
                '.voice-message-transcript-input',
            ),
            voiceCancelBtn = attachmentSheet_2.querySelector('.voice-message-cancel-btn'),
            voiceSubmitBtn = attachmentSheet_2.querySelector('.voice-message-submit-btn'),
            narrationFormOverlay = attachmentSheet_2.querySelector('.narration-form-overlay'),
            narrationInput = attachmentSheet_2.querySelector('.narration-message-input'),
            narrationCancelBtn = attachmentSheet_2.querySelector('.narration-cancel-btn'),
            narrationSubmitBtn = attachmentSheet_2.querySelector('.narration-submit-btn'),
            regenerateFormOverlay = attachmentSheet_2.querySelector('.regenerate-form-overlay'),
            regenerateRequirementInput = attachmentSheet_2.querySelector(
                '.regenerate-requirement-input',
            ),
            regenerateReferenceBtn = attachmentSheet_2.querySelector('.regenerate-reference-btn'),
            regenerateDirectBtn = attachmentSheet_2.querySelector('.regenerate-direct-btn'),
            stickersList = attachmentSheet_2.querySelector('.sheet-stickers-list'),
            stickerCategoryTabs = attachmentSheet_2.querySelector('.sheet-sticker-category-tabs'),
            payAmountInput = attachmentSheet_2.querySelector('.pay-transfer-amount-input'),
            payDescInput = attachmentSheet_2.querySelector('.pay-transfer-desc-input'),
            payCancelBtn = attachmentSheet_2.querySelector('.pay-transfer-cancel-btn'),
            paySubmitBtn = attachmentSheet_2.querySelector('.pay-transfer-submit-btn'),
            payModeTabs = attachmentSheet_2.querySelectorAll('.pay-mode-tab'),
            payTransferPanel = attachmentSheet_2.querySelector('.pay-mode-panel-transfer'),
            payRedPacketPanel = attachmentSheet_2.querySelector('.pay-mode-panel-red-packet'),
            payRecipientField = attachmentSheet_2.querySelector('.pay-group-recipient-field'),
            payRecipientTrigger = attachmentSheet_2.querySelector('.pay-group-recipient-trigger'),
            payRecipientAvatar = attachmentSheet_2.querySelector('.pay-group-recipient-avatar'),
            payRecipientLabel = attachmentSheet_2.querySelector('.pay-group-recipient-label'),
            payRecipientArrow = attachmentSheet_2.querySelector('.pay-group-recipient-arrow'),
            payRecipientDropdown = attachmentSheet_2.querySelector('.pay-group-recipient-dropdown'),
            payRedPacketCountInput = attachmentSheet_2.querySelector('.pay-red-packet-count-input'),
            payRedPacketAmountInput = attachmentSheet_2.querySelector(
                '.pay-red-packet-amount-input',
            ),
            payRedPacketDescInput = attachmentSheet_2.querySelector('.pay-red-packet-desc-input'),
            linkedAccountsEmpty = attachmentSheet_2.querySelector('.linked-accounts-empty'),
            linkedAccountsControls = attachmentSheet_2.querySelector('.linked-accounts-controls'),
            linkedAccountsToggle = attachmentSheet_2.querySelector('.linked-accounts-toggle'),
            linkedAccountsIntervalRow = attachmentSheet_2.querySelector(
                '.linked-accounts-interval-row',
            ),
            linkedAccountsIntervalInput = attachmentSheet_2.querySelector(
                '.linked-accounts-interval-input',
            ),
            linkedAccountsStatus = attachmentSheet_2.querySelector('.linked-accounts-status'),
            linkedAccountsList = attachmentSheet_2.querySelector('.linked-accounts-list'),
            summarySheet = attachmentSheet_2.querySelector('.contact-card-picker-overlay'),
            contactCardPickerListElement = attachmentSheet_2.querySelector(
                '.contact-card-picker-list',
            ),
            contactCardPickerCancelElement = attachmentSheet_2.querySelector(
                '.contact-card-picker-cancel',
            ),
            contactCardPickerConfirmElement = attachmentSheet_2.querySelector(
                '.contact-card-picker-confirm',
            ),
            sheetViews = attachmentSheet_2.querySelectorAll('.sheet-view');
        let currentPayMode = 'transfer',
            selectedRecipientId = null,
            text_160 = '',
            activeStickerCategoryName = '',
            value_161 = null,
            value_162 = null,
            count_163 = 0,
            renderTimerId_2 = null,
            renderFrameId_2 = null,
            count_166 = 0,
            value_167 = null,
            value_168 = null,
            renderFrameId_3 = null,
            count_170 = 0;
        const value_171 = () => {
                count_166 += 1;
                if (renderFrameId_2 === null) return;
                if (typeof window.cancelAnimationFrame === 'function')
                    window.cancelAnimationFrame(renderFrameId_2);
                else clearTimeout(renderFrameId_2);
                renderFrameId_2 = null;
            },
            scheduleAttachmentSheetOpenAnimation_2 = () => {
                renderTimerId_2 !== null &&
                    (clearTimeout(renderTimerId_2), (renderTimerId_2 = null));
                value_171();
                const value_372 = count_166,
                    render = () => {
                        renderFrameId_2 = null;
                        if (value_372 !== count_166 || attachmentSheet_2.style.display !== 'flex')
                            return;
                        sheetOverlayElement.style.opacity = '1';
                        content_4.style.transform = 'translateY(0)';
                    };
                typeof window.requestAnimationFrame === 'function'
                    ? (renderFrameId_2 = window.requestAnimationFrame(render))
                    : (renderFrameId_2 = setTimeout(render, 0));
            },
            value_173 = (value_374) => {
                value_168 = value_374;
                if (value_167 !== null) return;
                const render_2 = () => {
                    value_167 = null;
                    const value_376 = value_168;
                    value_168 = null;
                    if (!value_376?.isConnected) return;
                    const boundingClientRect = tabsContainer.getBoundingClientRect(),
                        boundingClientRect_377 = value_376.getBoundingClientRect(),
                        scrollLeft_2 = Math.max(
                            0,
                            tabsContainer.scrollLeft +
                                (boundingClientRect_377.left < boundingClientRect.left
                                    ? boundingClientRect_377.left - boundingClientRect.left
                                    : boundingClientRect_377.right > boundingClientRect.right
                                      ? boundingClientRect_377.right - boundingClientRect.right
                                      : 0),
                        );
                    typeof tabsContainer.scrollTo === 'function'
                        ? tabsContainer.scrollTo({
                              left: scrollLeft_2,
                              behavior: 'auto',
                          })
                        : (tabsContainer.scrollLeft = scrollLeft_2);
                };
                if (typeof window.requestAnimationFrame === 'function')
                    value_167 = window.requestAnimationFrame(render_2);
                else value_167 = setTimeout(render_2, 0);
            },
            escapeSheetHtml = (value_4) =>
                String(value_4 == null ? '' : value_4)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;'),
            value_175 = (value_380) =>
                (window.imData.friends || []).filter(
                    (value_381) =>
                        value_381 &&
                        (value_381.type === 'char' || value_381.type === 'npc') &&
                        String(value_381.id) !== String(value_380?.id || ''),
                ),
            closeOfflineSummarySheet = () => {
                text_160 = '';
                if (summarySheet) summarySheet.style.display = 'none';
                if (contactCardPickerConfirmElement)
                    contactCardPickerConfirmElement.disabled = true;
            },
            value_176 = (value_382) => {
                if (!contactCardPickerListElement || !contactCardPickerConfirmElement) return;
                const value_175_383 = value_175(value_382);
                contactCardPickerListElement.innerHTML = '';
                contactCardPickerConfirmElement.disabled = !text_160;
                if (value_175_383.length === 0) {
                    contactCardPickerListElement.innerHTML =
                        '<div class="contact-card-picker-empty">暂无可发送的 Char 或 NPC 名片</div>';
                    return;
                }
                value_175_383.forEach((value_384) => {
                    const contactId_2 = String(value_384.id),
                        trim_386 = String(
                            value_384.nickname || value_384.realName || '未命名人物',
                        ).trim(),
                        trim_387 = String(
                            value_384.realName && value_384.realName !== value_384.nickname
                                ? value_384.realName
                                : value_384.signature ||
                                      (value_384.type === 'npc' ? 'NPC 联系人' : 'Char 联系人'),
                        ).trim(),
                        trim_388 = String(value_384.avatarUrl || '').trim(),
                        element_389 = document.createElement('button');
                    element_389.type = 'button';
                    element_389.className =
                        'contact-card-picker-item' +
                        (text_160 === contactId_2 ? ' is-selected' : '');
                    element_389.dataset.contactId = contactId_2;
                    element_389.innerHTML =
                        `
                    <span class="contact-card-picker-avatar">` +
                        (trim_388
                            ? '<img src="' +
                              escapeSheetHtml(trim_388) +
                              '" alt="" onerror="this.remove();this.parentElement.textContent=\'' +
                              escapeSheetHtml(trim_386.charAt(0) || '?') +
                              '\'">'
                            : escapeSheetHtml(trim_386.charAt(0) || '?')) +
                        `</span>
                    <span class="contact-card-picker-copy"><strong>` +
                        escapeSheetHtml(trim_386) +
                        '</strong><small>' +
                        escapeSheetHtml(trim_387) +
                        `</small></span>
                    <span class="contact-card-picker-type ` +
                        (value_384.type === 'npc' ? 'is-npc' : 'is-char') +
                        '">' +
                        (value_384.type === 'npc' ? 'NPC' : 'Char') +
                        '</span>';
                    element_389.addEventListener('click', () => {
                        text_160 = contactId_2;
                        value_176(value_382);
                    });
                    contactCardPickerListElement.appendChild(element_389);
                });
            },
            handleClick_2 = () => {
                const value_370_390 = getAttachmentTargetFriend();
                if (!value_370_390 || value_370_390.type !== 'char') {
                    window.showToast?.('名片仅支持 Char 单聊');
                    return;
                }
                text_160 = '';
                value_176(value_370_390);
                if (summarySheet) summarySheet.style.display = 'flex';
            },
            value_178 = () => {
                const value_370_391 = getAttachmentTargetFriend();
                if (!value_370_391 || value_370_391.type !== 'char') {
                    window.showToast?.('定位仅支持 Char 单聊');
                    return;
                }
                attachmentSheet_2.querySelector('.location-composer-overlay')?.remove();
                const element_392 = document.createElement('div');
                element_392.className = 'location-composer-overlay';
                element_392.style.cssText =
                    'position:absolute;inset:0;z-index:90;background:rgba(0,0,0,.42);display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;';
                element_392.innerHTML = `
                <div style="width:min(100%,360px);background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.24);">
                    <div style="height:136px;position:relative;overflow:hidden;background-color:#d8d8d8;background-image:linear-gradient(32deg,transparent 45%,rgba(245,245,245,.92) 46%,rgba(245,245,245,.92) 51%,transparent 52%),linear-gradient(145deg,transparent 37%,rgba(238,238,238,.86) 38%,rgba(238,238,238,.86) 43%,transparent 44%),linear-gradient(90deg,rgba(60,60,60,.08) 1px,transparent 1px),linear-gradient(rgba(60,60,60,.08) 1px,transparent 1px);background-size:auto,auto,28px 28px,28px 28px;">
                        <span style="position:absolute;left:50%;top:50%;transform:translate(-50%,-58%);width:42px;height:42px;border-radius:50% 50% 50% 8px;background:#333;rotate:-45deg;box-shadow:0 5px 13px rgba(0,0,0,.24);"></span>
                        <span style="position:absolute;left:50%;top:50%;transform:translate(-50%,-76%);width:13px;height:13px;border-radius:50%;background:#fff;"></span>
                    </div>
                    <div style="padding:18px;display:flex;flex-direction:column;gap:12px;">
                        <div style="font-size:18px;font-weight:800;color:#242424;">发送位置</div>
                        <input class="location-composer-name" maxlength="80" placeholder="地点名（必填）" style="height:44px;border:1px solid #cecece;border-radius:12px;background:#fafafa;color:#242424;padding:0 12px;font-size:15px;outline:none;box-sizing:border-box;">
                        <input class="location-composer-address" maxlength="160" placeholder="详细地址（选填）" style="height:44px;border:1px solid #cecece;border-radius:12px;background:#fafafa;color:#242424;padding:0 12px;font-size:15px;outline:none;box-sizing:border-box;">
                        <div style="display:flex;gap:10px;margin-top:2px;">
                            <button type="button" class="location-composer-cancel" style="flex:1;height:44px;border:0;border-radius:13px;background:#dfdfe0;color:#444;font-size:15px;font-weight:700;">取消</button>
                            <button type="button" class="location-composer-submit" style="flex:1;height:44px;border:0;border-radius:13px;background:#292929;color:#f7f7f7;font-size:15px;font-weight:800;">发送</button>
                        </div>
                    </div>
                </div>`;
                attachmentSheet_2.appendChild(element_392);
                const textarea = element_392.querySelector('.location-composer-name'),
                    locationComposerAddressElement = element_392.querySelector(
                        '.location-composer-address',
                    ),
                    value_393 = () => element_392.remove();
                element_392.addEventListener('click', (event_394) => {
                    if (
                        event_394.target === element_392 ||
                        event_394.target.closest('.location-composer-cancel')
                    )
                        value_393();
                });
                element_392
                    .querySelector('.location-composer-submit')
                    ?.addEventListener('click', async () => {
                        const slice_395 = String(textarea?.value || '')
                                .trim()
                                .slice(0, 80),
                            slice_396 = String(locationComposerAddressElement?.value || '')
                                .trim()
                                .slice(0, 160);
                        if (!slice_395) {
                            window.showToast?.('请填写地点名');
                            textarea?.focus();
                            return;
                        }
                        const value_397 = await window.imChat.sendLocationMessage?.(
                            slice_395,
                            slice_396,
                            {
                                friendId: value_370_391.id,
                            },
                        );
                        if (!value_397) return;
                        value_393();
                        closeSheet();
                    });
                [textarea, locationComposerAddressElement].forEach((value_398, value_399) =>
                    value_398?.addEventListener('keydown', (event_400) => {
                        if (
                            event_400.isComposing ||
                            event_400.keyCode === 229 ||
                            event_400.key !== 'Enter'
                        )
                            return;
                        event_400.preventDefault();
                        if (value_399 === 0) locationComposerAddressElement?.focus();
                        else element_392.querySelector('.location-composer-submit')?.click();
                    }),
                );
                setTimeout(() => textarea?.focus(), 0);
            },
            value_179 = new Map(),
            offlineBarrageRuntimeStore = new Map(),
            value_181 = new Map(),
            parseOfflineTagAttributes = (value_401) => {
                const attrs_2 = {};
                return (
                    String(value_401 || '').replace(
                        /([\w:-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g,
                        (value_403, key_2, value_405, doubleValue, singleValue, bareValue) => {
                            return (
                                (attrs_2[String(key_2 || '').toLowerCase()] =
                                    doubleValue ?? singleValue ?? bareValue ?? ''),
                                ''
                            );
                        },
                    ),
                    attrs_2
                );
            },
            isLikelyChineseText = (value_5) => /[\u3400-\u9fff]/.test(String(value_5 || '')),
            parseOfflineBilingualDialogue = (value_6, language_2) => {
                if (window.imDataUtils?.parseBilingualDialogue)
                    return window.imDataUtils.parseBilingualDialogue(value_6, language_2);
                return {
                    original: String(value_6 || '').trim(),
                    translation: '',
                };
            },
            getOfflineChatLanguageName = (language_3) =>
                window.imDataUtils?.getChatLanguageName
                    ? window.imDataUtils.getChatLanguageName(language_3)
                    : 'Chinese',
            value_185 = (value_413) => {
                const text_2 = String(value_413 || '').trim();
                if (!text_2) return '';
                if (text_2.startsWith('「') && text_2.endsWith('」')) return text_2;
                return '「' + text_2 + '」';
            },
            getOfflineSpeechDisplayText = (value_415, value_416 = '') => {
                const trim_417 = String(value_415 || '').trim(),
                    trim_418 = String(value_416 || '').trim();
                if (!trim_417) return '';
                if (trim_418 && trim_418 !== trim_417 && !isLikelyChineseText(trim_417))
                    return value_185(trim_417 + '（' + trim_418 + '）');
                return value_185(trim_417);
            },
            normalizeOfflineSectionHeading = (value_7) =>
                String(value_7 || '')
                    .trim()
                    .replace(/[ \t]/g, ''),
            isOfflineSectionHeading = (value_420, value_421) => {
                const value_186_422 = normalizeOfflineSectionHeading(value_420);
                return value_421.some(
                    (value_423) =>
                        value_186_422 === '【' + value_423 + '】' ||
                        value_186_422 === '[' + value_423 + ']' ||
                        value_186_422 === value_423 + ':' ||
                        value_186_422 === value_423 + '：',
                );
            },
            isOfflineBarrageSectionHeading = (line) =>
                isOfflineSectionHeading(line, ['弹幕', '弹幕评论', '观众弹幕']),
            isOfflineChoiceSectionHeading = (line_2) =>
                isOfflineSectionHeading(line_2, [
                    '选项',
                    '玩家选项',
                    '后续选项',
                    '可选行动',
                    '选择',
                ]),
            isOfflineRecapSectionHeading = (line_3) => isOfflineSectionHeading(line_3, ['回顾']),
            extractOfflineRecapBlock = (value_8) => {
                const keptLines = [],
                    recapLines = [];
                let capturing = false,
                    found = false;
                return (
                    String(value_8 || '')
                        .replace(
                            /\r\n/g,
                            `
`,
                        )
                        .split(
                            `
`,
                        )
                        .forEach((line_4) => {
                            if (isOfflineRecapSectionHeading(line_4)) {
                                capturing = true;
                                found = true;
                                recapLines.push('【回顾】');
                                return;
                            }
                            if (
                                capturing &&
                                (isOfflineBarrageSectionHeading(line_4) ||
                                    isOfflineChoiceSectionHeading(line_4))
                            ) {
                                capturing = false;
                                keptLines.push(line_4);
                                return;
                            }
                            if (capturing) recapLines.push(line_4);
                            else keptLines.push(line_4);
                        }),
                    {
                        cleanText: keptLines
                            .join(
                                `
`,
                            )
                            .replace(
                                /\n{3,}/g,
                                `

`,
                            )
                            .trim(),
                        recap: found
                            ? recapLines
                                  .join(
                                      `
`,
                                  )
                                  .replace(
                                      /\n{3,}/g,
                                      `

`,
                                  )
                                  .trim()
                            : '',
                    }
                );
            },
            normalizeOfflineListLine = (value_9) =>
                String(value_9 || '')
                    .replace(/<[^>]+>/g, '')
                    .replace(/^[\s\-*•·]+/, '')
                    .replace(/^(?:\d+|[①②③④⑤⑥⑦⑧⑨]|[A-Za-z])[\).、:：-]?\s*/, '')
                    .trim(),
            getOfflineBarrageRandomLikes = () => Math.floor(Math.random() * 999) + 1,
            parseOfflineBarrageTextBlock = (value_10) =>
                String(value_10 || '')
                    .split(/\r?\n/)
                    .map((line_5) => normalizeOfflineListLine(line_5))
                    .filter(Boolean)
                    .map((text_3, value_432) => {
                        const match_2 = text_3.match(
                            /^([^:：|]{1,16})[:：|]\s*(.*?)\s*(?:\|\s*(\d+)\s*)?$/,
                        );
                        if (match_2 && match_2[2])
                            return {
                                name: match_2[1].trim() || '观众' + (value_432 + 1),
                                text: match_2[2].trim(),
                                likes: getOfflineBarrageRandomLikes(),
                            };
                        return {
                            name: '观众' + (value_432 + 1),
                            text: text_3,
                            likes: getOfflineBarrageRandomLikes(),
                        };
                    })
                    .filter((value_434) => value_434.text),
            parseOfflineBarrageBlocks = (value_435) => {
                const barragesByParagraph_3 = [],
                    plainBarrageSections_2 = [],
                    replace_438 = String(value_435 || '').replace(
                        /<barrages?\b[^>]*>([\s\S]*?)<\/barrages?>/gi,
                        (value_441, body_2) => {
                            const items_2 = [];
                            return (
                                String(body_2 || '').replace(
                                    /<barrage\b([^>]*)>([\s\S]*?)<\/barrage>/gi,
                                    (value_444, value_445, commentText) => {
                                        const attrs_3 = parseOfflineTagAttributes(value_445),
                                            name_2 =
                                                String(
                                                    attrs_3.name ||
                                                        attrs_3.user ||
                                                        attrs_3.author ||
                                                        '观众',
                                                ).trim() || '观众',
                                            text_4 = String(commentText || attrs_3.text || '')
                                                .replace(/<[^>]+>/g, '')
                                                .trim(),
                                            likes_2 = getOfflineBarrageRandomLikes();
                                        if (text_4)
                                            items_2.push({
                                                name: name_2,
                                                text: text_4,
                                                likes: likes_2,
                                            });
                                        return '';
                                    },
                                ),
                                items_2.length === 0 &&
                                    String(body_2 || '')
                                        .split(/\r?\n/)
                                        .map((line_6) => line_6.trim())
                                        .filter(Boolean)
                                        .forEach((line_7) => {
                                            const match_3 = line_7.match(
                                                /^([^:：|]+)[:：|]\s*(.*?)\s*(?:\|\s*(\d+)\s*)?$/,
                                            );
                                            match_3 &&
                                                items_2.push({
                                                    name: match_3[1].trim() || '观众',
                                                    text: match_3[2].trim(),
                                                    likes: getOfflineBarrageRandomLikes(),
                                                });
                                        }),
                                barragesByParagraph_3.push(items_2),
                                `

`
                            );
                        },
                    ),
                    items_439 = [];
                let captureBuffer = null;
                const flushPlainBarrage = () => {
                    if (!captureBuffer) return;
                    const items_3 = parseOfflineBarrageTextBlock(
                        captureBuffer.join(`
`),
                    );
                    if (items_3.length > 0) plainBarrageSections_2.push(items_3);
                    captureBuffer = null;
                };
                return (
                    replace_438.split(/\r?\n/).forEach((value_453) => {
                        if (isOfflineBarrageSectionHeading(value_453)) {
                            flushPlainBarrage();
                            captureBuffer = [];
                            return;
                        }
                        if (captureBuffer && isOfflineChoiceSectionHeading(value_453)) {
                            flushPlainBarrage();
                            items_439.push(value_453);
                            return;
                        }
                        if (captureBuffer) {
                            captureBuffer.push(value_453);
                            return;
                        }
                        items_439.push(value_453);
                    }),
                    flushPlainBarrage(),
                    {
                        cleanText: items_439
                            .join(
                                `
`,
                            )
                            .replace(
                                /\n{3,}/g,
                                `

`,
                            )
                            .trim(),
                        barragesByParagraph: barragesByParagraph_3,
                        plainBarrageSections: plainBarrageSections_2,
                    }
                );
            },
            normalizeOfflineChoiceText = (value_11) =>
                normalizeOfflineListLine(value_11)
                    .replace(/^(?:选项|选择|Choice)\s*\d*\s*[:：.、-]?\s*/i, '')
                    .trim(),
            parseOfflineChoiceBlocks = (value_455) => {
                let choices_2 = [],
                    cleanText_2 = String(value_455 || '').replace(
                        /<choices?\b[^>]*>([\s\S]*?)<\/choices?>/gi,
                        (value_461, body_3) => {
                            const parsed_2 = [];
                            return (
                                String(body_3 || '').replace(
                                    /<choice\b[^>]*>([\s\S]*?)<\/choice>/gi,
                                    (_, choiceText) => {
                                        const cleanChoice = normalizeOfflineChoiceText(choiceText);
                                        if (cleanChoice) parsed_2.push(cleanChoice);
                                        return '';
                                    },
                                ),
                                parsed_2.length === 0 &&
                                    String(body_3 || '')
                                        .split(/\r?\n/)
                                        .forEach((line_8) => {
                                            const cleanChoice_2 =
                                                normalizeOfflineChoiceText(line_8);
                                            if (cleanChoice_2) parsed_2.push(cleanChoice_2);
                                        }),
                                (choices_2 = choices_2.concat(parsed_2)),
                                `

`
                            );
                        },
                    );
                const keptLines_2 = [],
                    plainChoices = [];
                let captureBuffer_2 = null;
                const flushPlainChoices = () => {
                    if (!captureBuffer_2) return;
                    captureBuffer_2
                        .map((line_9) => normalizeOfflineChoiceText(line_9))
                        .filter(Boolean)
                        .forEach((choice) => plainChoices.push(choice));
                    captureBuffer_2 = null;
                };
                cleanText_2.split(/\r?\n/).forEach((value_467) => {
                    if (isOfflineChoiceSectionHeading(value_467)) {
                        flushPlainChoices();
                        captureBuffer_2 = [];
                        return;
                    }
                    if (captureBuffer_2 && isOfflineBarrageSectionHeading(value_467)) {
                        flushPlainChoices();
                        keptLines_2.push(value_467);
                        return;
                    }
                    if (captureBuffer_2) {
                        captureBuffer_2.push(value_467);
                        return;
                    }
                    keptLines_2.push(value_467);
                });
                flushPlainChoices();
                plainChoices.length > 0 &&
                    ((choices_2 = choices_2.concat(plainChoices)),
                    (cleanText_2 = keptLines_2
                        .join(
                            `
`,
                        )
                        .replace(
                            /\n{3,}/g,
                            `

`,
                        )
                        .trim()));
                if (choices_2.length === 0) {
                    const fallbackMatch = cleanText_2.match(
                        /(?:^|\n)\s*(?:玩家选项|可选行动|后续选项|选项|选择)\s*[:：]\s*\n([\s\S]*?)$/,
                    );
                    if (fallbackMatch) {
                        const block = fallbackMatch[1] || '',
                            parsed_3 = block
                                .split(/\r?\n/)
                                .map((line_10) => normalizeOfflineChoiceText(line_10))
                                .filter(Boolean);
                        parsed_3.length > 0 &&
                            ((choices_2 = parsed_3),
                            (cleanText_2 = cleanText_2.slice(0, fallbackMatch.index).trim()));
                    }
                }
                if (choices_2.length === 0) {
                    const lines = cleanText_2.split(/\r?\n/),
                        tail = [];
                    for (
                        let index_2 = lines.length - 1;
                        index_2 >= 0 && tail.length < 5;
                        index_2 -= 1
                    ) {
                        const line_11 = lines[index_2].trim();
                        if (!line_11) continue;
                        if (/^(?:\d+|[①②③④⑤⑥⑦⑧⑨]|[A-Ca-c])[\).、:：-]\s*\S+/.test(line_11))
                            tail.unshift({
                                index: index_2,
                                value: normalizeOfflineChoiceText(line_11),
                            });
                        else break;
                    }
                    if (tail.length >= 2) {
                        choices_2 = tail.map((item_2) => item_2.value).filter(Boolean);
                        const firstIndex = tail[0].index;
                        cleanText_2 = lines
                            .slice(0, firstIndex)
                            .join(
                                `
`,
                            )
                            .trim();
                    }
                }
                return {
                    cleanText: cleanText_2,
                    choices: choices_2
                        .map((choice_2) => choice_2.trim())
                        .filter(Boolean)
                        .slice(0, 3),
                };
            },
            stripOfflineDecorativeMarkup = (value_12) => {
                let text_5 = String(value_12 == null ? '' : value_12).replace(
                    /\r\n/g,
                    `
`,
                );
                text_5 = offlineReasoning
                    ? offlineReasoning.normalizeResponse(text_5, '').content
                    : text_5
                          .replace(/<\s*think(?:ing)?\s*>[\s\S]*?<\s*\/\s*think(?:ing)?\s*>/gi, '')
                          .trim();
                const recapExtraction = extractOfflineRecapBlock(text_5);
                text_5 = parseOfflineBarrageBlocks(recapExtraction.cleanText).cleanText;
                text_5 = parseOfflineChoiceBlocks(text_5).cleanText;
                text_5 = text_5.replace(
                    /<speech\b([^>]*)>([\s\S]*?)<\/speech>/gi,
                    (value_483, value_484, innerText) => {
                        const attrs_4 = parseOfflineTagAttributes(value_484),
                            original_2 =
                                attrs_4.original || attrs_4.text || String(innerText || '').trim(),
                            translation_2 = attrs_4.translation || attrs_4.zh || attrs_4.cn || '';
                        return getOfflineSpeechDisplayText(original_2, translation_2);
                    },
                );
                text_5 = text_5.replace(/<speech\b([^>]*)\/>/gi, (__2, attrText) => {
                    const attrs = parseOfflineTagAttributes(attrText);
                    return getOfflineSpeechDisplayText(
                        attrs.original || attrs.text || '',
                        attrs.translation || attrs.zh || attrs.cn || '',
                    );
                });
                text_5 = text_5.replace(
                    /<\/?paragraph\b[^>]*>/gi,
                    `

`,
                );
                const plainText = text_5
                    .replace(/<[^>]+>/g, '')
                    .replace(
                        /\n{3,}/g,
                        `

`,
                    )
                    .trim();
                return [plainText, recapExtraction.recap]
                    .filter(Boolean)
                    .join(
                        `

`,
                    )
                    .trim();
            },
            renderOfflinePlainTextWithFallbackSpeech = (
                value_490,
                items_491,
                value_492,
                value_493,
                language_4,
            ) => {
                const text_6 = String(value_490 || '');
                if (!value_493) return escapeSheetHtml(text_6).replace(/\n/g, '<br>');
                const value_496 = /「([^」\n]{1,180})」/g;
                let html_2 = '',
                    lastIndex = 0,
                    match_4 = null;
                while ((match_4 = value_496.exec(text_6)) !== null) {
                    const bilingual = parseOfflineBilingualDialogue(match_4[1], language_4);
                    if (!bilingual.original) continue;
                    html_2 += escapeSheetHtml(text_6.slice(lastIndex, match_4.index)).replace(
                        /\n/g,
                        '<br>',
                    );
                    const length_501 = items_491.length;
                    if (value_492) items_491.push(bilingual);
                    const value_502 = value_492 ? ' is-playable' : '',
                        value_503 = value_492
                            ? ' data-offline-speech-index="' +
                              length_501 +
                              '" role="button" tabindex="0" title="播放语音" aria-label="播放这段对话" aria-busy="false"'
                            : '';
                    html_2 +=
                        '<span class="offline-chat-speech offline-chat-dialogue' +
                        value_502 +
                        '"' +
                        value_503 +
                        '>' +
                        escapeSheetHtml(match_4[0]) +
                        '</span>';
                    lastIndex = match_4.index + match_4[0].length;
                }
                return (
                    (html_2 += escapeSheetHtml(text_6.slice(lastIndex)).replace(/\n/g, '<br>')),
                    html_2
                );
            },
            renderOfflineParagraphText = (value_504, speechItems, enableVoice_2, language_5) => {
                const text_7 = String(value_504 || ''),
                    speechRegex = /<speech\b([^>]*?)>([\s\S]*?)<\/speech>|<speech\b([^>]*?)\/>/gi;
                let html_3 = '',
                    lastIndex_2 = 0,
                    hasExplicitSpeech = false,
                    match_5 = null;
                while ((match_5 = speechRegex.exec(text_7)) !== null) {
                    hasExplicitSpeech = true;
                    html_3 += renderOfflinePlainTextWithFallbackSpeech(
                        text_7.slice(lastIndex_2, match_5.index),
                        speechItems,
                        enableVoice_2,
                        false,
                        language_5,
                    );
                    const attrText_2 = match_5[1] || match_5[3] || '',
                        attrs_5 = parseOfflineTagAttributes(attrText_2),
                        innerText_2 = String(match_5[2] || '')
                            .replace(/<[^>]+>/g, '')
                            .trim(),
                        original_3 = String(
                            attrs_5.original || attrs_5.text || innerText_2 || '',
                        ).trim(),
                        translation_3 = String(
                            attrs_5.translation || attrs_5.zh || attrs_5.cn || '',
                        ).trim(),
                        offlineSpeechDisplayText = getOfflineSpeechDisplayText(
                            original_3,
                            translation_3,
                        );
                    if (offlineSpeechDisplayText) {
                        const length_519 = speechItems.length;
                        speechItems.push({
                            original: original_3,
                            translation: translation_3,
                        });
                        const value_520 = enableVoice_2 ? ' is-playable' : '',
                            value_521 = enableVoice_2
                                ? ' data-offline-speech-index="' +
                                  length_519 +
                                  '" role="button" tabindex="0" title="播放语音" aria-label="播放这段对话" aria-busy="false"'
                                : '';
                        html_3 +=
                            '<span class="offline-chat-speech offline-chat-dialogue' +
                            value_520 +
                            '"' +
                            value_521 +
                            '>' +
                            escapeSheetHtml(offlineSpeechDisplayText) +
                            '</span>';
                    }
                    lastIndex_2 = match_5.index + match_5[0].length;
                }
                return (
                    (html_3 += renderOfflinePlainTextWithFallbackSpeech(
                        text_7.slice(lastIndex_2),
                        speechItems,
                        enableVoice_2,
                        !hasExplicitSpeech,
                        language_5,
                    )),
                    html_3
                );
            },
            isTtsEnabledForFriend = (friend_5) =>
                !!window.u2Tts?.resolveFriendTtsSettings?.(friend_5)?.enabled,
            value_193 = (value_13, options_2 = {}) => {
                const messageId_2 = options_2.messageId ? String(options_2.messageId) : '',
                    enableVoice_3 = options_2.enableVoice !== false,
                    enableBarrage_2 = !!options_2.enableBarrage,
                    enableChoices_2 = !!options_2.enableChoices,
                    enableRecap_2 = !!options_2.enableRecap,
                    language_6 = options_2.language || 'zh',
                    trim_531 = String(value_13 == null ? '' : value_13)
                        .replace(
                            /\r\n/g,
                            `
`,
                        )
                        .trim();
                if (!trim_531)
                    return (
                        messageId_2 &&
                            (value_179['delete'](messageId_2),
                            offlineBarrageRuntimeStore['delete'](messageId_2),
                            value_181['delete'](messageId_2)),
                        ''
                    );
                const speechItems_2 = [],
                    recapExtraction_2 = enableRecap_2
                        ? extractOfflineRecapBlock(trim_531)
                        : {
                              cleanText: trim_531,
                              recap: '',
                          },
                    {
                        cleanText: cleanText_3,
                        barragesByParagraph: barragesByParagraph_2,
                        plainBarrageSections: plainBarrageSections_3,
                    } = parseOfflineBarrageBlocks(recapExtraction_2.cleanText),
                    choiceParseResult = parseOfflineChoiceBlocks(cleanText_3),
                    choices_3 = choiceParseResult.choices,
                    normalizedText = choiceParseResult.cleanText
                        .replace(/<paragraph\b[^>]*>/gi, '')
                        .replace(
                            /<\/paragraph>/gi,
                            `

`,
                        )
                        .trim(),
                    paragraphs = normalizedText
                        .split(/\n{2,}/)
                        .map((part) => part.trim())
                        .filter(Boolean),
                    allBarrageItems = []
                        .concat(
                            ...barragesByParagraph_2.map((items_4) =>
                                Array.isArray(items_4) ? items_4 : [],
                            ),
                        )
                        .concat(
                            ...(plainBarrageSections_3 || []).map((items_5) =>
                                Array.isArray(items_5) ? items_5 : [],
                            ),
                        )
                        .filter((item_3) => item_3 && item_3.text);
                messageId_2 &&
                    (offlineBarrageRuntimeStore.set(messageId_2, [allBarrageItems]),
                    value_181.set(messageId_2, choices_3));
                const paragraphHtml_2 = paragraphs
                        .map((part_2, value_552) => {
                            const paragraphHtml = renderOfflineParagraphText(
                                part_2,
                                speechItems_2,
                                enableVoice_3,
                                language_6,
                            );
                            return (
                                '<div class="offline-chat-paragraph-wrap"><p class="offline-chat-paragraph">' +
                                paragraphHtml +
                                '</p></div>'
                            );
                        })
                        .join(''),
                    barrageButtonHtml =
                        enableBarrage_2 && allBarrageItems.length > 0
                            ? '<button type="button" class="offline-chat-barrage-btn offline-chat-barrage-final-btn" data-offline-barrage-index="0" title="查看弹幕" aria-label="查看弹幕"><i class="fas fa-comment-dots"></i><span>' +
                              allBarrageItems.length +
                              '</span></button>'
                            : '',
                    choiceHtml =
                        enableChoices_2 && choices_3.length > 0
                            ? '<div class="offline-chat-choice-list">' +
                              choices_3
                                  .map(
                                      (value_554, value_555) =>
                                          '<button type="button" class="offline-chat-choice-btn" data-offline-choice-index="' +
                                          value_555 +
                                          '"><span class="offline-chat-choice-index">' +
                                          (value_555 + 1) +
                                          '</span><span class="offline-chat-choice-text">' +
                                          escapeSheetHtml(value_554) +
                                          '</span></button>',
                                  )
                                  .join('') +
                              '</div>'
                            : '',
                    recapHtml = recapExtraction_2.recap
                        ? '<section class="offline-chat-recap"><div class="offline-chat-recap-title">【回顾】</div><div class="offline-chat-recap-content">' +
                          escapeSheetHtml(
                              recapExtraction_2.recap.replace(/^【回顾】\s*/, ''),
                          ).replace(/\n/g, '<br>') +
                          '</div></section>'
                        : '',
                    html_4 = paragraphHtml_2 + barrageButtonHtml + choiceHtml + recapHtml;
                return (messageId_2 && value_179.set(messageId_2, speechItems_2), html_4);
            },
            OFFLINE_ACTIVE_NOTICE_KIND = 'offline_meeting_active',
            OFFLINE_MEETING_RECORD_TYPE = 'offline_meeting_record',
            value_194 = (value_556) =>
                (Array.isArray(value_556) ? value_556 : [])
                    .map((value_557) => ({
                        speechIndex: Math.max(0, Math.floor(Number(value_557?.speechIndex) || 0)),
                        text: String(value_557?.text || '').trim(),
                        assetId: String(value_557?.assetId || '').trim(),
                    }))
                    .filter((value_558) => value_558.text && value_558.assetId)
                    .filter(
                        (value_559, value_560, value_561) =>
                            value_561.findIndex(
                                (value_562) => value_562.speechIndex === value_559.speechIndex,
                            ) === value_560,
                    ),
            value_195 = (value_563, value_564, value_565) =>
                value_194(value_563?.ttsAudioAssets).find(
                    (value_566) =>
                        value_566.speechIndex === value_564 && value_566.text === value_565,
                ) || null,
            value_196 = (value_567, value_568, value_569) =>
                ['im_offline_tts', value_567, value_568, value_569]
                    .map((value_570) => String(value_570 || '').replace(/[^a-z0-9_-]+/gi, '-'))
                    .join('_')
                    .slice(0, 220),
            value_197 = async (value_571) => {
                const trim_572 = String(value_571 || '').trim();
                if (!trim_572) throw new Error('TTS 未返回可保存的音频');
                if (trim_572.startsWith('data:')) {
                    const dataUrlToBlob_575 = window.appStorage?.dataUrlToBlob?.(trim_572);
                    if (dataUrlToBlob_575?.size) return dataUrlToBlob_575;
                }
                const value_573 = await fetch(trim_572);
                if (!value_573.ok) throw new Error('音频下载失败 (' + value_573.status + ')');
                const value_574 = await value_573.blob();
                if (!value_574.size) throw new Error('TTS 音频为空');
                return value_574;
            },
            value_198 = async (value_576, value_577, speechIndex_3, text_13, value_580) => {
                if (!window.appStorage?.saveAssetFromBlob) throw new Error('音频存储服务不可用');
                const assetId_3 = value_196(value_576?.id, value_577?.id, speechIndex_3),
                    value_582 = await value_197(value_580);
                await window.appStorage.saveAssetFromBlob(assetId_3, value_582, {
                    ownerType: 'imessage_offline_tts',
                    ownerId: String(value_577?.id || ''),
                    friendId: String(value_576?.id || ''),
                    speechIndex: speechIndex_3,
                });
                const options_583 = {
                    speechIndex: speechIndex_3,
                    text: text_13,
                    assetId: assetId_3,
                };
                let enabled_584 = false;
                const value_585 = await commitSheetFriendChange(
                    value_576?.id,
                    (value_586) => {
                        const value_587 = (value_588) => {
                            if (
                                !value_588 ||
                                String(value_588.id || '') !== String(value_577?.id || '')
                            )
                                return false;
                            const filter_589 = value_194(value_588.ttsAudioAssets).filter(
                                (value_590) => value_590.speechIndex !== speechIndex_3,
                            );
                            return (
                                (value_588.ttsAudioAssets = filter_589
                                    .concat(options_583)
                                    .sort((a, b) => a.speechIndex - b.speechIndex)),
                                (enabled_584 = true),
                                true
                            );
                        };
                        (Array.isArray(value_586.offlineMessages)
                            ? value_586.offlineMessages
                            : []
                        ).some(value_587);
                        (Array.isArray(value_586.offlineMeetingSessions)
                            ? value_586.offlineMeetingSessions
                            : []
                        ).some((activeFriend_4) =>
                            (Array.isArray(activeFriend_4?.messages)
                                ? activeFriend_4.messages
                                : []
                            ).some(value_587),
                        );
                    },
                    {
                        silent: true,
                        metaOnly: true,
                    },
                );
                if (!value_585 || !enabled_584) {
                    await window.appStorage.deleteAsset?.(assetId_3);
                    throw new Error('线下语音记录保存失败');
                }
                return (
                    (value_577.ttsAudioAssets = value_194(value_577.ttsAudioAssets)
                        .filter((value_592) => value_592.speechIndex !== speechIndex_3)
                        .concat(options_583)
                        .sort((a_593, b_594) => a_593.speechIndex - b_594.speechIndex)),
                    assetId_3
                );
            },
            bindOfflineChatTextControls = (bubbleDiv_2, value_596, friend_6, floor_2) => {
                if (!bubbleDiv_2 || !value_596?.id) return;
                const messageId_3 = String(value_596.id);
                bubbleDiv_2
                    .querySelectorAll('.offline-chat-speech.is-playable')
                    .forEach((speechEl) => {
                        if (speechEl.dataset.bound === 'true') return;
                        speechEl.dataset.bound = 'true';
                        const playSpeech = async (event_601) => {
                            event_601.preventDefault();
                            event_601.stopPropagation();
                            if (speechEl.getAttribute('aria-busy') === 'true') return;
                            const speechIndex_2 = Number(
                                    speechEl.getAttribute('data-offline-speech-index'),
                                ),
                                value_603 = value_179.get(messageId_3) || [],
                                speech = value_603[speechIndex_2],
                                originalText = String(speech?.original || '').trim();
                            if (!originalText) return;
                            if (
                                !window.u2Tts ||
                                typeof window.u2Tts.speakTextCached !== 'function'
                            ) {
                                if (window.showToast) window.showToast('TTS 不可用');
                                return;
                            }
                            speechEl.classList.add('is-loading');
                            speechEl.setAttribute('aria-busy', 'true');
                            try {
                                const value_195_606 = value_195(
                                    value_596,
                                    speechIndex_2,
                                    originalText,
                                );
                                if (value_195_606?.assetId && window.appStorage?.getAssetUrl) {
                                    const value_608 = await window.appStorage.getAssetUrl(
                                        value_195_606.assetId,
                                    );
                                    if (value_608) {
                                        await window.u2Tts.playAudioUrl(value_608);
                                        return;
                                    }
                                }
                                const value_607 = await window.u2Tts.speakTextCached(
                                    originalText,
                                    friend_6,
                                    speech,
                                );
                                if (value_607)
                                    try {
                                        await value_198(
                                            friend_6,
                                            value_596,
                                            speechIndex_2,
                                            originalText,
                                            value_607,
                                        );
                                    } catch (value_609) {
                                        console.error(
                                            'Offline speech persistence failed',
                                            value_609,
                                        );
                                        if (window.showToast)
                                            window.showToast('语音已播放，但永久保存失败');
                                    }
                            } catch (error_3) {
                                console.error('Offline speech playback failed', error_3);
                                if (
                                    (!window.u2Api?.isRequestError?.(error_3) ||
                                        !window.u2Api.reportError(error_3, {
                                            operation: '语音生成',
                                        })) &&
                                    window.showToast
                                )
                                    window.showToast(
                                        window.u2Tts?.getUserErrorMessage?.(error_3) ||
                                            '语音播放失败',
                                    );
                            } finally {
                                speechEl.classList.remove('is-loading');
                                speechEl.setAttribute('aria-busy', 'false');
                            }
                        };
                        speechEl.addEventListener('click', (event_2) => {
                            const selection =
                                typeof window.getSelection === 'function'
                                    ? window.getSelection()
                                    : null;
                            if (selection && !selection.isCollapsed && selection.toString().trim())
                                return;
                            playSpeech(event_2);
                        });
                        speechEl.addEventListener('keydown', (event_3) => {
                            if (event_3.key !== 'Enter' && event_3.key !== ' ') return;
                            playSpeech(event_3);
                        });
                    });
                bubbleDiv_2.querySelectorAll('.offline-chat-barrage-btn').forEach((button_2) => {
                    if (button_2.dataset.bound === 'true') return;
                    button_2.dataset.bound = 'true';
                    button_2.addEventListener('click', (event_4) => {
                        event_4.preventDefault();
                        event_4.stopPropagation();
                        const paragraphIndex_2 =
                            Number(button_2.getAttribute('data-offline-barrage-index')) || 0;
                        openOfflineBarrageView({
                            messageId: messageId_3,
                            paragraphIndex: paragraphIndex_2,
                            floor: floor_2,
                            barrages:
                                (offlineBarrageRuntimeStore.get(messageId_3) || [])[
                                    paragraphIndex_2
                                ] || [],
                        });
                    });
                });
                bubbleDiv_2.querySelectorAll('.offline-chat-choice-btn').forEach((button_3) => {
                    if (button_3.dataset.bound === 'true') return;
                    button_3.dataset.bound = 'true';
                    button_3.addEventListener('click', (event_617) => {
                        event_617.preventDefault();
                        event_617.stopPropagation();
                        const choiceIndex =
                                Number(button_3.getAttribute('data-offline-choice-index')) || 0,
                            choices_4 = value_181.get(messageId_3) || [],
                            value_16 = String(choices_4[choiceIndex] || '').trim(),
                            offlineChatInputElement = document.getElementById('offline-chat-input');
                        if (!value_16 || !offlineChatInputElement) return;
                        offlineChatInputElement.value = value_16;
                        offlineChatInputElement.focus();
                        offlineChatInputElement.dispatchEvent(
                            new Event('input', {
                                bubbles: true,
                            }),
                        );
                        const view_2 = document.getElementById('offline-chat-view'),
                            contentArea_3 = document.getElementById('offline-chat-content');
                        if (view_2 && contentArea_3)
                            contentArea_3.scrollTop = contentArea_3.scrollHeight;
                    });
                });
            },
            isOfflineBarragePromptEnabled = (friend_7) => {
                const prompts_2 = ensureGlobalOfflinePrompts(friend_7);
                return prompts_2.some(
                    (prompt_2) =>
                        prompt_2.id === 'barrage_comments' &&
                        (prompt_2.alwaysEnabled || prompt_2.enabled),
                );
            },
            isOfflineChoicesPromptEnabled = (friend_8) => {
                const prompts_3 = ensureGlobalOfflinePrompts(friend_8);
                return prompts_3.some(
                    (prompt_3) =>
                        prompt_3.id === 'player_choices' &&
                        (prompt_3.alwaysEnabled || prompt_3.enabled),
                );
            },
            createOfflineChatId = (prefix = 'offline') => {
                if (window.imChat?.createMessageId) return window.imChat.createMessageId(prefix);
                return prefix + '-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
            },
            estimateOfflineTextTokens = (value_17) => {
                const text_8 = stripOfflineDecorativeMarkup(value_17).trim();
                if (!text_8) return 0;
                if (typeof window.calculateTokens === 'function')
                    try {
                        return Math.max(
                            1,
                            Number(
                                window.calculateTokens([
                                    {
                                        title: '',
                                        keyword: '',
                                        content: text_8,
                                    },
                                ]),
                            ) || 0,
                        );
                    } catch (error_4) {
                        console.warn('Offline token estimate failed', error_4);
                    }
                return Math.max(1, Math.ceil(text_8.length * 0.75));
            },
            countOfflineTextCharacters = (value_18) => {
                const text_9 = stripOfflineDecorativeMarkup(value_18).replace(/\s+/g, '');
                return text_9.length;
            },
            formatOfflineBubbleTime = (value_634) => {
                const value_635 = new Date(Number(value_634) || Date.now()),
                    value_636 = (value_637) => String(value_637).padStart(2, '0');
                return value_636(value_635.getHours()) + ':' + value_636(value_635.getMinutes());
            },
            formatOfflineMeetingDate = (value_638) => {
                const value_639 = new Date(Number(value_638) || Date.now()),
                    value_640 = (value_641) => String(value_641).padStart(2, '0');
                return (
                    value_639.getFullYear() +
                    '年' +
                    (value_639.getMonth() + 1) +
                    '月' +
                    value_639.getDate() +
                    '日 ' +
                    value_640(value_639.getHours()) +
                    ':' +
                    value_640(value_639.getMinutes())
                );
            },
            isOfflineSummaryMessage = (value_642) => value_642?.type === type_3,
            value_206 = new WeakMap(),
            value_207 = (message_643) => {
                const content_26 = message_643?.content || '',
                    reasoning_3 = message_643?.reasoning || '',
                    value_646 = message_643 && typeof message_643 === 'object',
                    message_647 = value_646 ? value_206.get(message_643) : null;
                if (
                    message_647 &&
                    message_647.content === content_26 &&
                    message_647.reasoning === reasoning_3
                )
                    return message_647.parsed;
                const parsed_13 = offlineReasoning.normalizeResponse(content_26, reasoning_3);
                if (value_646)
                    value_206.set(message_643, {
                        content: content_26,
                        reasoning: reasoning_3,
                        parsed: parsed_13,
                    });
                return parsed_13;
            },
            cloneOfflineMeetingMessages = (value_648) =>
                (Array.isArray(value_648) ? value_648 : []).map((message_4, value_650) => {
                    const isSummary = isOfflineSummaryMessage(message_4),
                        isAutoImage = isOfflineAutoImageMessage(message_4),
                        role_2 = isSummary
                            ? 'system'
                            : message_4?.role === 'assistant'
                              ? 'assistant'
                              : 'user',
                        parsed_4 =
                            role_2 === 'assistant' && !isAutoImage && offlineReasoning
                                ? value_207(message_4)
                                : {
                                      content: String(message_4?.content || ''),
                                      reasoning: '',
                                  },
                        options_655 = {
                            id:
                                message_4?.id ||
                                createOfflineChatId(
                                    isSummary
                                        ? 'offline-summary'
                                        : isAutoImage
                                          ? 'offline-image'
                                          : role_2 === 'assistant'
                                            ? 'offline-ai'
                                            : 'offline-user',
                                ),
                            role: role_2,
                            type: isSummary ? type_3 : isAutoImage ? type_2 : undefined,
                            content: parsed_4.content,
                            reasoning:
                                role_2 === 'assistant' && parsed_4.reasoning
                                    ? parsed_4.reasoning
                                    : undefined,
                            timestamp: Number(message_4?.timestamp) || Date.now() + value_650,
                            tokens:
                                role_2 === 'assistant'
                                    ? Math.max(
                                          0,
                                          Number(message_4?.tokens) ||
                                              estimateOfflineTextTokens(parsed_4.content),
                                      )
                                    : undefined,
                            imageUrl: isAutoImage
                                ? String(message_4?.imageUrl || message_4?.url || '').trim()
                                : '',
                            sourceMessageId: isAutoImage
                                ? String(message_4?.sourceMessageId || '').trim()
                                : '',
                            imageProvider: isAutoImage
                                ? String(message_4?.imageProvider || '').trim()
                                : '',
                            imageModel: isAutoImage
                                ? String(message_4?.imageModel || '').trim()
                                : '',
                            imageSize: isAutoImage ? String(message_4?.imageSize || '').trim() : '',
                            faceReferenceUsed: isAutoImage && message_4?.faceReferenceUsed === true,
                            updatedAt: message_4?.updatedAt || undefined,
                            generationState: ['failed', 'truncated'].includes(
                                String(message_4?.generationState || ''),
                            )
                                ? String(message_4.generationState)
                                : undefined,
                            continuationState:
                                message_4?.continuationState === 'available'
                                    ? 'available'
                                    : undefined,
                            generationError: message_4?.generationError
                                ? String(message_4.generationError)
                                : undefined,
                            archivedBySummaryId:
                                !isSummary && message_4?.archivedBySummaryId
                                    ? String(message_4.archivedBySummaryId)
                                    : '',
                            sourceMessageIds:
                                isSummary && Array.isArray(message_4?.sourceMessageIds)
                                    ? message_4.sourceMessageIds
                                          .map((id_2) => String(id_2 || ''))
                                          .filter(Boolean)
                                    : [],
                            sourceFloorStart: isSummary
                                ? Math.max(1, Math.round(Number(message_4?.sourceFloorStart) || 1))
                                : 0,
                            sourceFloorEnd: isSummary
                                ? Math.max(1, Math.round(Number(message_4?.sourceFloorEnd) || 1))
                                : 0,
                            ttsAudioAssets:
                                role_2 === 'assistant' && !isSummary && !isAutoImage
                                    ? value_194(message_4?.ttsAudioAssets)
                                    : [],
                        };
                    return (
                        role_2 === 'assistant' &&
                            !isAutoImage &&
                            offlineReasoning &&
                            parsed_4.content === (message_4?.content || '') &&
                            (parsed_4.reasoning || '') === (message_4?.reasoning || '') &&
                            value_206.set(options_655, {
                                content: options_655.content || '',
                                reasoning: options_655.reasoning || '',
                                parsed: parsed_4,
                            }),
                        options_655
                    );
                }),
            getOfflineDialogueRows = (value_657) => {
                let floor_5 = 0;
                return (Array.isArray(value_657) ? value_657 : []).reduce((rows, message_5) => {
                    if (
                        isOfflineSummaryMessage(message_5) ||
                        isOfflineAutoImageMessage(message_5) ||
                        (message_5?.role !== 'user' && message_5?.role !== 'assistant')
                    )
                        return rows;
                    return (
                        (floor_5 += 1),
                        rows.push({
                            message: message_5,
                            floor: floor_5,
                        }),
                        rows
                    );
                }, []);
            },
            getOfflineMessageFloor = (messages_2, messageId_4) =>
                getOfflineDialogueRows(messages_2).find(
                    (row) => String(row.message?.id || '') === String(messageId_4 || ''),
                )?.floor || 1,
            getOfflineUnarchivedDialogueRows = (messages_3) =>
                getOfflineDialogueRows(messages_3).filter(
                    (row_2) => !row_2.message?.archivedBySummaryId,
                ),
            getOfflineSummarySourceMessages = (messages_4, summaryMessage) => {
                const sourceIds = new Set((summaryMessage?.sourceMessageIds || []).map(String));
                return getOfflineDialogueRows(messages_4).filter((row_3) =>
                    sourceIds.has(String(row_3.message?.id || '')),
                );
            },
            value_211 = (message_667) => ({
                id: message_667.id,
                role: message_667.role,
                type: message_667.type || '',
                content: message_667.content,
                reasoning: message_667.reasoning || '',
                timestamp: message_667.timestamp,
                tokens: message_667.tokens || 0,
                imageUrl: message_667.imageUrl || '',
                sourceMessageId: message_667.sourceMessageId || '',
                imageProvider: message_667.imageProvider || '',
                imageModel: message_667.imageModel || '',
                imageSize: message_667.imageSize || '',
                faceReferenceUsed: !!message_667.faceReferenceUsed,
                updatedAt: message_667.updatedAt || '',
                generationState: message_667.generationState || '',
                continuationState: message_667.continuationState || '',
                generationError: message_667.generationError || '',
                archivedBySummaryId: message_667.archivedBySummaryId || '',
                sourceMessageIds: message_667.sourceMessageIds || [],
                sourceFloorStart: message_667.sourceFloorStart || 0,
                sourceFloorEnd: message_667.sourceFloorEnd || 0,
                ttsAudioAssets: message_667.ttsAudioAssets || [],
            }),
            value_212 = (value_668, value_669) => {
                if (value_668.length !== value_669.length) return false;
                return value_668.every((value_670, value_671) => {
                    const value_211_672 = value_211(value_670),
                        value_211_673 = value_211(value_669[value_671]);
                    return Object.keys(value_211_673).every((value_674) => {
                        if (value_674 === 'ttsAudioAssets') {
                            const value_677 = value_211_672[value_674],
                                value_678 = value_211_673[value_674];
                            return (
                                Array.isArray(value_677) &&
                                value_677.length === value_678.length &&
                                value_677.every(
                                    (value_679, value_680) =>
                                        value_679.speechIndex ===
                                            value_678[value_680]?.speechIndex &&
                                        value_679.text === value_678[value_680]?.text &&
                                        value_679.assetId === value_678[value_680]?.assetId,
                                )
                            );
                        }
                        if (value_674 !== 'sourceMessageIds')
                            return value_211_672[value_674] === value_211_673[value_674];
                        const value_675 = value_211_672[value_674],
                            value_676 = value_211_673[value_674];
                        return (
                            Array.isArray(value_675) &&
                            value_675.length === value_676.length &&
                            value_675.every(
                                (value_681, value_682) => value_681 === value_676[value_682],
                            )
                        );
                    });
                });
            },
            value_213 = () =>
                offlineRegexEngine
                    ? offlineRegexEngine.normalizeHtmlTemplateRules(
                          window.imData?.offlineHtmlTemplateRules,
                      )
                    : [],
            value_214 = () =>
                offlineRegexEngine
                    ? offlineRegexEngine.normalizeTextReplacementRules(
                          window.imData?.offlineTextReplacementRules,
                      )
                    : [],
            value_215 = (value_683, role_4, depth_6) =>
                offlineRegexEngine
                    ? offlineRegexEngine.applyTextReplacementRules(value_683, {
                          rules: value_214(),
                          role: role_4,
                          depth: depth_6,
                      })
                    : String(value_683 || ''),
            value_216 = (value_686, role_5, depth_7) =>
                offlineRegexEngine
                    ? offlineRegexEngine.stripHtmlTemplateRules(value_686, {
                          rules: value_213(),
                          role: role_5,
                          depth: depth_7,
                      })
                    : String(value_686 || ''),
            value_217 = (value_689, value_690, value_691) =>
                value_216(value_689, value_690, value_691),
            value_218 = (value_692, value_693, value_694) =>
                value_215(value_216(value_692, value_693, value_694), value_693, value_694),
            value_219 = (data_3) => {
                const getVisionResponseContent_2 = window.imApp?.sanitizeHtmlTemplate;
                return typeof getVisionResponseContent_2 === 'function'
                    ? String(getVisionResponseContent_2(data_3) || '')
                    : '';
            },
            value_220 = (value_697, role_6, depth_8, value_700 = {}) => {
                const items_701 = offlineRegexEngine
                    ? offlineRegexEngine.applyHtmlTemplateRules(value_697, {
                          rules: value_213(),
                          role: role_6,
                          depth: depth_8,
                          transformText: (value_702) => value_215(value_702, role_6, depth_8),
                      })
                    : [
                          {
                              type: 'text',
                              text: String(value_697 || ''),
                          },
                      ];
                return items_701
                    .map((value_703) => {
                        if (value_703.type !== 'html') return value_193(value_703.text, value_700);
                        const value_219_704 = value_219(value_703.html);
                        if (value_219_704)
                            return (
                                '<section class="offline-chat-html-template">' +
                                value_219_704 +
                                '</section>'
                            );
                        return value_193(value_703.raw, value_700);
                    })
                    .join('');
            },
            value_221 = (activeFriend_5) => {
                if (!activeFriend_5) return [];
                const value_706 = Array.isArray(activeFriend_5.offlineMessages)
                        ? activeFriend_5.offlineMessages
                        : [],
                    offlineMessages_2 = cloneOfflineMeetingMessages(value_706);
                return (
                    !value_212(value_706, offlineMessages_2) &&
                        (window.imApp?.commitFriendMetaPatch
                            ? void window.imApp.commitFriendMetaPatch(
                                  activeFriend_5.id,
                                  {
                                      offlineMessages: offlineMessages_2,
                                  },
                                  {
                                      silent: true,
                                  },
                              )
                            : commitSheetFriendChange(
                                  activeFriend_5,
                                  (targetFriend_2) => {
                                      targetFriend_2.offlineMessages = offlineMessages_2;
                                  },
                                  {
                                      silent: true,
                                      metaOnly: true,
                                  },
                              )),
                    offlineMessages_2
                );
            },
            normalizeOfflineMeetingSessions = (activeFriend_6) => {
                if (!activeFriend_6) return [];
                const sessions = Array.isArray(activeFriend_6.offlineMeetingSessions)
                        ? activeFriend_6.offlineMeetingSessions
                        : [],
                    offlineMeetingSessions_2 = sessions.map((session_2, value_714) => {
                        const messages_5 = cloneOfflineMeetingMessages(session_2?.messages || []),
                            startedAt_2 =
                                Number(session_2?.startedAt) ||
                                messages_5[0]?.timestamp ||
                                Date.now() + value_714,
                            endedAt_2 = Number(session_2?.endedAt) || startedAt_2;
                        return {
                            id: session_2?.id || createOfflineChatId('offline-session'),
                            startedAt: startedAt_2,
                            endedAt: endedAt_2,
                            messages: messages_5,
                            dateText: session_2?.dateText || formatOfflineMeetingDate(endedAt_2),
                            title: session_2?.title || '见面记录',
                            summary: session_2?.summary || '',
                            rawSummary: session_2?.rawSummary || '',
                            updatedAt: session_2?.updatedAt || undefined,
                        };
                    }),
                    every_712 = sessions.every((value_718, value_719) => {
                        const value_720 = offlineMeetingSessions_2[value_719];
                        return (
                            value_718 &&
                            Object.keys(value_720).every((value_721) =>
                                value_721 === 'messages'
                                    ? value_212(
                                          Array.isArray(value_718.messages)
                                              ? value_718.messages
                                              : [],
                                          value_720.messages,
                                      )
                                    : value_718[value_721] === value_720[value_721],
                            )
                        );
                    });
                return (
                    !every_712 &&
                        (window.imApp?.commitFriendMetaPatch
                            ? void window.imApp.commitFriendMetaPatch(
                                  activeFriend_6.id,
                                  {
                                      offlineMeetingSessions: offlineMeetingSessions_2,
                                  },
                                  {
                                      silent: true,
                                  },
                              )
                            : commitSheetFriendChange(
                                  activeFriend_6,
                                  (targetFriend_3) => {
                                      targetFriend_3.offlineMeetingSessions =
                                          offlineMeetingSessions_2;
                                  },
                                  {
                                      silent: true,
                                      metaOnly: true,
                                  },
                              )),
                    offlineMeetingSessions_2
                );
            },
            getCurrentOnlineChatContainer = (value_723) => {
                if (!value_723?.id) return null;
                const page_2 = document.getElementById('chat-interface-' + value_723.id);
                return page_2 ? page_2.querySelector('.ins-chat-messages') : null;
            },
            rerenderOnlineChatForFriend = (friend_9, options_3 = {}) => {
                const container_2 = getCurrentOnlineChatContainer(friend_9);
                if (container_2 && window.imChat?.rerenderChatContainer) {
                    const latestFriend_3 =
                        (window.imData?.friends || []).find(
                            (item_4) => String(item_4.id) === String(friend_9.id),
                        ) || friend_9;
                    window.imChat.rerenderChatContainer(latestFriend_3, container_2, {
                        scroll: options_3.scroll !== false,
                    });
                }
                if (window.imChat?.renderChatsList) window.imChat.renderChatsList();
            },
            value_224 = async (activeFriend_7) => {
                if (!activeFriend_7?.id) return false;
                window.imApp?.ensureFriendMessagesLoaded &&
                    (await window.imApp.ensureFriendMessagesLoaded(activeFriend_7));
                if (!Array.isArray(activeFriend_7.messages)) activeFriend_7.messages = [];
                const activeNotices = activeFriend_7.messages.filter(
                        (message_6) =>
                            message_6?.type === 'system_notice' &&
                            message_6.noticeKind === OFFLINE_ACTIVE_NOTICE_KIND,
                    ),
                    now_2 = Date.now(),
                    offlineSessionId_2 =
                        activeFriend_7.offlineCurrentSessionId ||
                        createOfflineChatId('offline-session'),
                    baseNotice = {
                        id: activeNotices[0]?.id || createOfflineChatId('notice'),
                        role: 'system',
                        type: 'system_notice',
                        noticeKind: OFFLINE_ACTIVE_NOTICE_KIND,
                        content: '见面中',
                        text: '见面中',
                        offlineSessionId: offlineSessionId_2,
                        timestamp: activeNotices[0]?.timestamp || now_2,
                    };
                activeNotices.length > 1 &&
                    window.imApp?.removeFriendMessages &&
                    (await window.imApp.removeFriendMessages(
                        activeFriend_7.id,
                        activeNotices.slice(1).map((message_7) => ({
                            id: message_7.id || null,
                            timestamp: message_7.timestamp || null,
                        })),
                        {
                            silent: true,
                        },
                    ));
                let saved_2 = true;
                if (activeNotices[0] && window.imApp?.updateFriendMessage)
                    saved_2 = await window.imApp.updateFriendMessage(
                        activeFriend_7.id,
                        {
                            id: activeNotices[0].id || null,
                            timestamp: activeNotices[0].timestamp || null,
                        },
                        (targetMsg) => {
                            Object.assign(targetMsg, baseNotice);
                        },
                        {
                            silent: true,
                        },
                    );
                else
                    window.imApp?.appendFriendMessage
                        ? (saved_2 = await window.imApp.appendFriendMessage(
                              activeFriend_7.id,
                              baseNotice,
                              {
                                  silent: true,
                              },
                          ))
                        : (saved_2 = await commitSheetFriendChange(
                              activeFriend_7,
                              (targetFriend) => {
                                  if (!Array.isArray(targetFriend.messages))
                                      targetFriend.messages = [];
                                  targetFriend.messages.push(baseNotice);
                              },
                              {
                                  silent: true,
                              },
                          ));
                if (saved_2)
                    rerenderOnlineChatForFriend(activeFriend_7, {
                        scroll: true,
                    });
                return saved_2;
            },
            value_225 = async (activeFriend_8) => {
                if (!activeFriend_8?.id) return true;
                if (window.imApp?.ensureFriendRecentMessagesLoaded)
                    await window.imApp.ensureFriendRecentMessagesLoaded(activeFriend_8, {
                        limit: 60,
                    });
                else
                    window.imApp?.ensureFriendMessagesLoaded &&
                        (await window.imApp.ensureFriendMessagesLoaded(activeFriend_8));
                const notices = (activeFriend_8.messages || []).filter(
                    (message_8) =>
                        message_8?.type === 'system_notice' &&
                        message_8.noticeKind === OFFLINE_ACTIVE_NOTICE_KIND,
                );
                if (notices.length === 0) return true;
                let saved_3 = true;
                window.imApp?.removeFriendMessages
                    ? (saved_3 = await window.imApp.removeFriendMessages(
                          activeFriend_8.id,
                          notices.map((message_9) => ({
                              id: message_9.id || null,
                              timestamp: message_9.timestamp || null,
                          })),
                          {
                              silent: true,
                          },
                      ))
                    : (saved_3 = await commitSheetFriendChange(
                          activeFriend_8,
                          (targetFriend_4) => {
                              targetFriend_4.messages = (targetFriend_4.messages || []).filter(
                                  (message_10) =>
                                      !(
                                          message_10?.type === 'system_notice' &&
                                          message_10.noticeKind === OFFLINE_ACTIVE_NOTICE_KIND
                                      ),
                              );
                          },
                          {
                              silent: true,
                          },
                      ));
                if (saved_3)
                    rerenderOnlineChatForFriend(activeFriend_8, {
                        scroll: false,
                    });
                return saved_3;
            },
            isOfflineMeetingRecordForSession = (message_11, session_3) => {
                if (!message_11 || !session_3 || message_11.type !== OFFLINE_MEETING_RECORD_TYPE)
                    return false;
                const sessionId_2 = String(session_3.id || '');
                if (sessionId_2 && String(message_11.offlineSessionId || '') === sessionId_2)
                    return true;
                const messageTime = Number(message_11.timestamp) || 0,
                    endedAt_3 = Number(session_3.endedAt) || 0,
                    messageTitle = String(message_11.title || '').trim(),
                    sessionTitle = String(session_3.title || '').trim();
                return !!(
                    messageTime &&
                    endedAt_3 &&
                    Math.abs(messageTime - endedAt_3) <= 1000 &&
                    messageTitle &&
                    messageTitle === sessionTitle
                );
            },
            buildOfflineMeetingRecordContent = (session, summary_2) => {
                return [
                    session?.dateText || formatOfflineMeetingDate(session?.endedAt),
                    session?.title || '见面记录',
                    String(summary_2 || ''),
                ].filter(Boolean).join(`

`);
            },
            buildOfflineMeetingRawSummary = (value_751, value_752) => {
                return [
                    '标题：' + (value_751?.title || '见面记录'),
                    '见面内容：' + String(value_752 || ''),
                ].join(`
`);
            },
            updateOfflineMeetingSessionSummary = async (value_753, session_4, value_755) => {
                if (!value_753?.id || !session_4?.id) return false;
                window.imApp?.ensureFriendMessagesLoaded &&
                    (await window.imApp.ensureFriendMessagesLoaded(value_753));
                const sessionId_3 = String(session_4.id),
                    summary_3 = String(value_755 || '').trim(),
                    rawSummary_2 = buildOfflineMeetingRawSummary(session_4, summary_3),
                    content_5 = buildOfflineMeetingRecordContent(session_4, summary_3),
                    value_758 = await commitSheetFriendChange(
                        value_753,
                        (targetFriend_5) => {
                            if (!targetFriend_5) return;
                            targetFriend_5.offlineMeetingSessions = (
                                Array.isArray(targetFriend_5.offlineMeetingSessions)
                                    ? targetFriend_5.offlineMeetingSessions
                                    : []
                            ).map((item_5) => {
                                if (String(item_5?.id || '') !== sessionId_3) return item_5;
                                return {
                                    ...item_5,
                                    summary: summary_3,
                                    rawSummary: rawSummary_2,
                                    updatedAt: Date.now(),
                                };
                            });
                            targetFriend_5.memory =
                                window.imApp.normalizeFriendData(targetFriend_5).memory;
                            const linkedMemory = (
                                targetFriend_5.memory.shortTermEntries || []
                            ).find(
                                (entry) =>
                                    entry?.sourceType === 'offline_meeting' &&
                                    String(entry.sourceId || '') === sessionId_3,
                            );
                            linkedMemory &&
                                ((linkedMemory.title =
                                    session_4.title || linkedMemory.title || '线下见面'),
                                (linkedMemory.event = summary_3));
                            if (Array.isArray(targetFriend_5.messages)) {
                                targetFriend_5.messages.forEach((message_12) => {
                                    if (!isOfflineMeetingRecordForSession(message_12, session_4))
                                        return;
                                    message_12.summary = summary_3;
                                    message_12.rawSummary = rawSummary_2;
                                    message_12.content = content_5;
                                    message_12.text =
                                        '见面记录：' + (session_4.title || '见面记录');
                                });
                                if (window.imApp?.syncFriendMessageSummary)
                                    window.imApp.syncFriendMessageSummary(targetFriend_5);
                                if (window.imApp?.clearFriendRuntimeMessageContext)
                                    window.imApp.clearFriendRuntimeMessageContext(targetFriend_5);
                                if (window.imApp?.syncActiveFriendReference)
                                    window.imApp.syncActiveFriendReference(targetFriend_5);
                                if (window.imApp?.syncSettingsFriendReference)
                                    window.imApp.syncSettingsFriendReference(targetFriend_5);
                            }
                        },
                        {
                            silent: true,
                            includeMessages: true,
                        },
                    );
                if (!value_758) return false;
                const currentActiveFriend_4 =
                    (window.imData?.friends || []).find(
                        (value_764) => String(value_764.id) === String(value_753.id),
                    ) || value_753;
                return (
                    window.imData?.currentActiveFriend &&
                        String(window.imData.currentActiveFriend.id) ===
                            String(currentActiveFriend_4.id) &&
                        (window.imData.currentActiveFriend = currentActiveFriend_4),
                    rerenderOnlineChatForFriend(currentActiveFriend_4, {
                        scroll: false,
                    }),
                    true
                );
            },
            value_227 = async (activeFriend_9, session_5) => {
                if (!activeFriend_9?.id || !session_5?.id) return false;
                window.imApp?.ensureFriendMessagesLoaded &&
                    (await window.imApp.ensureFriendMessagesLoaded(activeFriend_9));
                const sessionId_4 = String(session_5.id),
                    saved_4 = await commitSheetFriendChange(
                        activeFriend_9,
                        (targetFriend_6) => {
                            if (!targetFriend_6) return;
                            targetFriend_6.offlineMeetingSessions = (
                                Array.isArray(targetFriend_6.offlineMeetingSessions)
                                    ? targetFriend_6.offlineMeetingSessions
                                    : []
                            ).filter((item_6) => String(item_6?.id || '') !== sessionId_4);
                            targetFriend_6.memory =
                                window.imApp.normalizeFriendData(targetFriend_6).memory;
                            targetFriend_6.memory.shortTermEntries = (
                                targetFriend_6.memory.shortTermEntries || []
                            ).filter(
                                (entry_2) =>
                                    !(
                                        entry_2?.sourceType === 'offline_meeting' &&
                                        String(entry_2.sourceId || '') === sessionId_4
                                    ),
                            );
                            if (Array.isArray(targetFriend_6.messages)) {
                                targetFriend_6.messages = targetFriend_6.messages.filter(
                                    (message_13) =>
                                        !isOfflineMeetingRecordForSession(message_13, session_5),
                                );
                                if (window.imApp?.reindexFriendMessages)
                                    window.imApp.reindexFriendMessages(targetFriend_6);
                                if (window.imApp?.syncFriendMessageSummary)
                                    window.imApp.syncFriendMessageSummary(targetFriend_6);
                                if (window.imApp?.clearFriendRuntimeMessageContext)
                                    window.imApp.clearFriendRuntimeMessageContext(targetFriend_6);
                                if (window.imApp?.syncActiveFriendReference)
                                    window.imApp.syncActiveFriendReference(targetFriend_6);
                                if (window.imApp?.syncSettingsFriendReference)
                                    window.imApp.syncSettingsFriendReference(targetFriend_6);
                            }
                        },
                        {
                            silent: true,
                            includeMessages: true,
                        },
                    );
                if (!saved_4) return false;
                const currentActiveFriend_5 =
                    (window.imData?.friends || []).find(
                        (value_774) => String(value_774.id) === String(activeFriend_9.id),
                    ) || activeFriend_9;
                return (
                    window.imData?.currentActiveFriend &&
                        String(window.imData.currentActiveFriend.id) ===
                            String(currentActiveFriend_5.id) &&
                        (window.imData.currentActiveFriend = currentActiveFriend_5),
                    handleAction_285(currentActiveFriend_5),
                    rerenderOnlineChatForFriend(currentActiveFriend_5, {
                        scroll: false,
                    }),
                    true
                );
            },
            confirmDeleteOfflineMeetingSession = (
                value_775,
                value_776,
                value_777 = null,
                options_4 = {},
            ) => {
                const onConfirm_2 = async () => {
                    value_777 && ((value_777.disabled = true), (value_777.dataset.busy = 'true'));
                    try {
                        const saved_5 = await value_227(value_775, value_776);
                        if (window.showToast)
                            window.showToast(saved_5 ? '见面记录已删除' : '删除见面记录失败');
                        if (saved_5 && typeof options_4.onDeleted === 'function')
                            options_4.onDeleted();
                    } catch (error_5) {
                        console.error('Delete offline meeting session failed', error_5);
                        if (window.showToast) window.showToast('删除见面记录失败');
                    } finally {
                        value_777 &&
                            ((value_777.disabled = false), (value_777.dataset.busy = 'false'));
                    }
                };
                if (window.showCustomModal) {
                    window.showCustomModal({
                        title: '删除见面记录',
                        message: '确定彻底删除这条见面记录吗？这会同时清理聊天上下文，无法恢复。',
                        confirmText: '删除',
                        isDestructive: true,
                        onConfirm: onConfirm_2,
                    });
                    return;
                }
                window.confirm('确定彻底删除这条见面记录吗？这会同时清理聊天上下文，无法恢复。') &&
                    onConfirm_2();
            };
        imChat_2.confirmDeleteOfflineMeetingRecord = (
            friend_10,
            record,
            value_784 = null,
            value_785 = {},
        ) => {
            const friendId_2 = friend_10?.id ?? window.imData?.currentActiveFriend?.id,
                activeFriend_10 =
                    friendId_2 != null
                        ? window.imApp?.getFriendById?.(friendId_2) ||
                          (window.imData?.friends || []).find(
                              (item_7) => String(item_7?.id) === String(friendId_2),
                          ) ||
                          friend_10
                        : null,
                sessionId_5 = String(record?.offlineSessionId || ''),
                session_6 =
                    sessionId_5 && Array.isArray(activeFriend_10?.offlineMeetingSessions)
                        ? activeFriend_10.offlineMeetingSessions.find(
                              (item_8) => String(item_8?.id || '') === sessionId_5,
                          )
                        : null;
            if (!activeFriend_10 || !session_6) {
                if (window.showToast) window.showToast('见面记录已不存在');
                return false;
            }
            return (
                confirmDeleteOfflineMeetingSession(
                    activeFriend_10,
                    session_6,
                    value_784,
                    value_785,
                ),
                true
            );
        };
        const getActiveLinkedAccountsFriend = () => {
                const activeFriend_11 = window.imData.currentActiveFriend;
                if (
                    !activeFriend_11 ||
                    activeFriend_11.type === 'group' ||
                    activeFriend_11.type === 'official'
                )
                    return null;
                return activeFriend_11;
            },
            formatLinkedAccountTime = (timestamp_2) => {
                const time_2 = Number(timestamp_2) || 0;
                if (!time_2) return '';
                if (window.imApp?.formatTime) return window.imApp.formatTime(time_2);
                return new Date(time_2).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                });
            },
            getLinkedAccountDisplayName = (chat) => {
                if (!chat) return '关联好友';
                return chat.remark || chat.name || chat.realName || '关联好友';
            },
            getLinkedAccountInitial = (chat_2) => {
                return (
                    String(getLinkedAccountDisplayName(chat_2)).trim().charAt(0).toUpperCase() ||
                    'A'
                );
            },
            value_231 = (chat_3, size_2 = 42) => {
                const seed = String(
                    chat_3?.avatarSeed ||
                        chat_3?.remark ||
                        chat_3?.realName ||
                        getLinkedAccountDisplayName(chat_3) ||
                        'linked',
                );
                let hash = 0;
                for (let i_2 = 0; i_2 < seed.length; i_2 += 1) {
                    hash = (hash << 5) - hash + seed.charCodeAt(i_2);
                    hash |= 0;
                }
                const value_800 = Math.abs(hash) % 360,
                    value_801 = (value_800 + 38) % 360;
                return (
                    'width:' +
                    size_2 +
                    'px; height:' +
                    size_2 +
                    'px; border-radius:50%; background:linear-gradient(135deg, hsl(' +
                    value_800 +
                    ', 62%, 40%), hsl(' +
                    value_801 +
                    ', 68%, 48%)); color:#fff; display:flex; align-items:center; justify-content:center; font-size:' +
                    Math.max(14, Math.round(size_2 * 0.38)) +
                    'px; font-weight:800; flex-shrink:0;'
                );
            },
            value_232 = (value_803) => {
                const OFFLINE_CHAT_PROMPT_ORDER_2 = Number(value_803) || 0;
                if (!OFFLINE_CHAT_PROMPT_ORDER_2) return '';
                const date = new Date(OFFLINE_CHAT_PROMPT_ORDER_2);
                return (
                    date.getMonth() +
                    1 +
                    '/' +
                    date.getDate() +
                    ' ' +
                    date.getHours().toString().padStart(2, '0') +
                    ':' +
                    date.getMinutes().toString().padStart(2, '0')
                );
            },
            getLinkedAccountMessageTranslation = (message_14) => {
                if (!message_14 || typeof message_14 !== 'object') return '';
                return typeof message_14.translation === 'string' && message_14.translation.trim()
                    ? message_14.translation.trim()
                    : typeof message_14.translationZh === 'string' &&
                        message_14.translationZh.trim()
                      ? message_14.translationZh.trim()
                      : typeof message_14.trans === 'string' && message_14.trans.trim()
                        ? message_14.trans.trim()
                        : '';
            },
            value_234 = (message_15) => {
                const text_10 = escapeSheetHtml(message_15?.text || ''),
                    value_233_809 = getLinkedAccountMessageTranslation(message_15);
                if (!value_233_809)
                    return (
                        '<div class="group-private-chat-detail-bubble"><span class="group-private-chat-detail-original">' +
                        text_10 +
                        '</span></div>'
                    );
                return (
                    `
                <button type="button" class="group-private-chat-detail-bubble has-translation" aria-expanded="false" title="点击展开翻译">
                    <span class="group-private-chat-detail-original">` +
                    text_10 +
                    `</span>
                    <span class="group-private-chat-detail-translation" hidden>` +
                    escapeSheetHtml(value_233_809) +
                    `</span>
                </button>
            `
                );
            },
            toggleLinkedAccountBubbleTranslation = (bubble) => {
                if (!bubble) return;
                const translation_4 = bubble.querySelector(
                    '.group-private-chat-detail-translation',
                );
                if (!translation_4) return;
                const willExpand = translation_4.hidden;
                translation_4.hidden = !willExpand;
                bubble.classList.toggle('is-expanded', willExpand);
                bubble.setAttribute('aria-expanded', willExpand ? 'true' : 'false');
                bubble.title = willExpand ? '点击收起翻译' : '点击展开翻译';
            },
            findLinkedAccountChat = (chatId) => {
                const activeFriend_12 = getActiveLinkedAccountsFriend(),
                    chats = Array.isArray(activeFriend_12?.linkedAccountChats)
                        ? activeFriend_12.linkedAccountChats
                        : [];
                return chats.find((chat_4) => String(chat_4.id) === String(chatId)) || null;
            };
        let linkedAccountModalOverlay = null;
        const closeLinkedAccountModal = () => {
                if (linkedAccountModalOverlay) linkedAccountModalOverlay.style.display = 'none';
            },
            value_237 = (innerHTML_2) => {
                !linkedAccountModalOverlay &&
                    ((linkedAccountModalOverlay = document.createElement('div')),
                    (linkedAccountModalOverlay.className = 'linked-account-modal-overlay'),
                    (linkedAccountModalOverlay.style.cssText =
                        'position:absolute; inset:0; z-index:30; display:none; align-items:center; justify-content:center; background:rgba(0,0,0,0.22); padding:max(18px, env(safe-area-inset-top, 0px)) 18px max(18px, env(safe-area-inset-bottom, 0px)); box-sizing:border-box;'),
                    linkedAccountModalOverlay.addEventListener('click', (event_5) => {
                        const translationBubble = event_5.target.closest(
                            '.group-private-chat-detail-bubble.has-translation',
                        );
                        if (translationBubble) {
                            event_5.preventDefault();
                            event_5.stopPropagation();
                            toggleLinkedAccountBubbleTranslation(translationBubble);
                            return;
                        }
                        const deleteBtn_2 = event_5.target.closest(
                            '.linked-account-delete-chat-btn',
                        );
                        if (deleteBtn_2) {
                            event_5.preventDefault();
                            event_5.stopPropagation();
                            deleteLinkedAccountChat(
                                deleteBtn_2.getAttribute('data-linked-chat-id'),
                            );
                            return;
                        }
                        (event_5.target === linkedAccountModalOverlay ||
                            event_5.target.closest('.linked-account-modal-close')) &&
                            closeLinkedAccountModal();
                    }),
                    attachmentSheet_2.appendChild(linkedAccountModalOverlay));
                linkedAccountModalOverlay.innerHTML = innerHTML_2;
                linkedAccountModalOverlay.style.display = 'flex';
            },
            openLinkedAccountChatModal = (chat_5) => {
                const activeFriend_13 = getActiveLinkedAccountsFriend();
                if (!chat_5 || !activeFriend_13) return;
                const displayName = getLinkedAccountDisplayName(chat_5),
                    value_821 = chat_5.realName || chat_5.name || displayName,
                    charName_3 = activeFriend_13.nickname || activeFriend_13.realName || 'TA',
                    messages_6 = Array.isArray(chat_5.messages)
                        ? [...chat_5.messages].sort(
                              (a_2, b_2) =>
                                  (Number(a_2.timestamp) || 0) - (Number(b_2.timestamp) || 0),
                          )
                        : [],
                    value_824 =
                        messages_6.length > 0
                            ? messages_6
                                  .map((message_16, index_3) => {
                                      const isChar = message_16.role === 'char',
                                          currentName = isChar ? charName_3 : displayName,
                                          previousRole =
                                              index_3 > 0 ? messages_6[index_3 - 1]?.role : null,
                                          isGroupStart =
                                              index_3 === 0 || previousRole !== message_16?.role,
                                          value_833 = Number(message_16.timestamp) || 0,
                                          prevTime =
                                              index_3 > 0
                                                  ? Number(messages_6[index_3 - 1]?.timestamp) || 0
                                                  : 0,
                                          value_835 =
                                              index_3 === 0 ||
                                              (value_833 &&
                                                  prevTime &&
                                                  value_833 - prevTime > 300000);
                                      return (
                                          `
                        ` +
                                          (value_835
                                              ? '<div class="group-private-chat-detail-time-chip">' +
                                                escapeSheetHtml(value_232(value_833)) +
                                                '</div>'
                                              : '') +
                                          `
                        <div class="group-private-chat-detail-row` +
                                          (isChar ? ' is-sender' : '') +
                                          (isGroupStart ? ' is-group-start' : '') +
                                          `">
                            ` +
                                          (isGroupStart
                                              ? '<div class="group-private-chat-detail-name">' +
                                                escapeSheetHtml(currentName) +
                                                '</div>'
                                              : '') +
                                          `
                            ` +
                                          value_234(message_16) +
                                          `
                        </div>
                    `
                                      );
                                  })
                                  .join('')
                            : '<div style="text-align:center; color:#8e8e93; font-size:13px; padding:34px 0;">暂无消息</div>';
                value_237(
                    `
                <div class="group-private-chat-detail-card linked-account-chat-detail-card">
                    <div style="display:flex; align-items:center; gap:10px; padding:14px 16px; border-bottom:1px solid #f2f2f7; flex-shrink:0;">
                        <div style="` +
                        value_231(chat_5, 38) +
                        '">' +
                        escapeSheetHtml(getLinkedAccountInitial(chat_5)) +
                        `</div>
                        <div style="min-width:0; flex:1;">
                            <div style="font-size:16px; font-weight:800; color:#111; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">` +
                        escapeSheetHtml(displayName) +
                        `</div>
                            <div style="font-size:12px; color:#8e8e93; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">` +
                        escapeSheetHtml(value_821) +
                        (chat_5.relationship ? ' · ' + escapeSheetHtml(chat_5.relationship) : '') +
                        `</div>
                        </div>
                        <button type="button" class="linked-account-modal-close" style="width:30px; height:30px; border:none; border-radius:50%; background:#f2f2f7; color:#636366; cursor:pointer;"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="group-private-chat-detail-messages linked-account-chat-detail-messages">
                        ` +
                        value_824 +
                        `
                    </div>
                </div>
            `,
                );
            },
            deleteLinkedAccountChat = async (value_836) => {
                const activeFriend_14 = getActiveLinkedAccountsFriend();
                if (!activeFriend_14 || !value_836) return false;
                const safeChatId = String(value_836),
                    saved_6 = await commitSheetFriendChange(
                        activeFriend_14.id,
                        (targetFriend_7) => {
                            targetFriend_7.linkedAccountChats = window.imApp
                                ?.normalizeLinkedAccountChats
                                ? window.imApp.normalizeLinkedAccountChats(
                                      targetFriend_7.linkedAccountChats,
                                  )
                                : Array.isArray(targetFriend_7.linkedAccountChats)
                                  ? targetFriend_7.linkedAccountChats
                                  : [];
                            targetFriend_7.linkedAccountChats =
                                targetFriend_7.linkedAccountChats.filter(
                                    (item_9) => String(item_9.id) !== safeChatId,
                                );
                        },
                        {
                            silent: true,
                            metaOnly: true,
                        },
                    );
                if (!saved_6) {
                    if (window.showToast) window.showToast('删除好友会话失败');
                    return false;
                }
                activeFriend_14.linkedAccountChats = (
                    Array.isArray(activeFriend_14.linkedAccountChats)
                        ? activeFriend_14.linkedAccountChats
                        : []
                ).filter((item_10) => String(item_10.id) !== safeChatId);
                closeLinkedAccountModal();
                renderLinkedAccountsPanel_2();
                if (window.showToast) window.showToast('已删除好友会话');
                return true;
            },
            markLinkedAccountChatRead = async (value_842) => {
                const activeFriend_15 = getActiveLinkedAccountsFriend();
                if (!activeFriend_15 || !value_842) return false;
                const safeChatId_2 = String(value_842);
                let nextReadAt = 0;
                const saved_7 = await commitSheetFriendChange(
                    activeFriend_15.id,
                    (targetFriend_8) => {
                        targetFriend_8.linkedAccountChats = window.imApp
                            ?.normalizeLinkedAccountChats
                            ? window.imApp.normalizeLinkedAccountChats(
                                  targetFriend_8.linkedAccountChats,
                              )
                            : Array.isArray(targetFriend_8.linkedAccountChats)
                              ? targetFriend_8.linkedAccountChats
                              : [];
                        const targetChat = targetFriend_8.linkedAccountChats.find(
                            (item_11) => String(item_11.id) === safeChatId_2,
                        );
                        if (!targetChat) return;
                        nextReadAt = Math.max(Number(targetChat.updatedAt) || 0, Date.now());
                        targetChat.readAt = nextReadAt;
                    },
                    {
                        silent: true,
                        metaOnly: true,
                    },
                );
                if (!saved_7) return false;
                const localChat = (
                    Array.isArray(activeFriend_15.linkedAccountChats)
                        ? activeFriend_15.linkedAccountChats
                        : []
                ).find((item_12) => String(item_12.id) === safeChatId_2);
                if (localChat) localChat.readAt = nextReadAt;
                return (renderLinkedAccountsPanel_2(), true);
            },
            openLinkedAccountProfileModal = (chat_6) => {
                if (!chat_6) return;
                const displayName_2 = getLinkedAccountDisplayName(chat_6),
                    realName_2 = chat_6.realName || chat_6.name || displayName_2,
                    rows_2 = [
                        ['真名', realName_2],
                        ['备注', chat_6.remark || displayName_2],
                        ['关系', chat_6.relationship || '未填写'],
                        ['人设', chat_6.persona || '未填写'],
                    ];
                value_237(
                    `
                <div class="linked-account-profile-card">
                    <div class="linked-account-profile-header" style="position:relative; padding:24px 18px 16px; display:flex; flex-direction:column; align-items:center; border-bottom:1px solid #f2f2f7;">
                        <button type="button" class="linked-account-modal-close" style="position:absolute; right:14px; top:14px; width:30px; height:30px; border:none; border-radius:50%; background:#f2f2f7; color:#636366; cursor:pointer;"><i class="fas fa-times"></i></button>
                        <div style="` +
                        value_231(chat_6, 72) +
                        '">' +
                        escapeSheetHtml(getLinkedAccountInitial(chat_6)) +
                        `</div>
                        <div style="font-size:19px; font-weight:850; color:#111; margin-top:12px; max-width:100%; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">` +
                        escapeSheetHtml(displayName_2) +
                        `</div>
                        <div style="font-size:12px; color:#8e8e93; margin-top:3px;">只读资料</div>
                    </div>
                    <div class="linked-account-profile-body" style="padding:10px 16px 16px;">
                        ` +
                        rows_2
                            .map(
                                ([value_854, value_855]) =>
                                    `
                            <div style="display:flex; gap:12px; align-items:flex-start; padding:11px 0; border-bottom:1px solid #f2f2f7;">
                                <div style="width:48px; color:#8e8e93; font-size:13px; flex-shrink:0;">` +
                                    escapeSheetHtml(value_854) +
                                    `</div>
                                <div style="flex:1; color:#111; font-size:14px; line-height:1.42; word-break:break-word;">` +
                                    escapeSheetHtml(value_855) +
                                    `</div>
                            </div>
                        `,
                            )
                            .join('') +
                        `
                        <button type="button" class="linked-account-delete-chat-btn" data-linked-chat-id="` +
                        escapeSheetHtml(chat_6.id) +
                        `" style="width:100%; margin-top:14px; height:42px; border:none; border-radius:14px; background:#ff3b30; color:#fff; font-size:14px; font-weight:800; display:flex; align-items:center; justify-content:center; gap:7px; cursor:pointer;">
                            <i class="fas fa-trash-alt"></i>
                            <span>删除会话</span>
                        </button>
                    </div>
                </div>
            `,
                );
            },
            stopLinkedAccountTimer_2 = () => {
                value_161 && (clearInterval(value_161), (value_161 = null));
                value_162 = null;
                count_163 = 0;
            },
            getActiveAttachmentTab = () => {
                const activeTab = attachmentSheet_2.querySelector('.sheet-tab-item.active');
                return activeTab ? activeTab.getAttribute('data-tab') : '';
            },
            syncLinkedAccountTimer = () => {
                const activeFriend_16 = getActiveLinkedAccountsFriend(),
                    bot = window.imApp?.normalizeLinkedAccountBot
                        ? window.imApp.normalizeLinkedAccountBot(activeFriend_16?.linkedAccountBot)
                        : activeFriend_16?.linkedAccountBot || {},
                    shouldRun =
                        !!activeFriend_16 &&
                        attachmentSheet_2.style.display === 'flex' &&
                        getActiveAttachmentTab() === 'file' &&
                        !!bot.enabled,
                    nextFriendId = activeFriend_16 ? String(activeFriend_16.id) : null,
                    nextIntervalMs = Math.max(5, Number(bot.intervalSeconds) || 60) * 1000;
                if (!shouldRun) {
                    stopLinkedAccountTimer_2();
                    return;
                }
                if (value_161 && value_162 === nextFriendId && count_163 === nextIntervalMs) return;
                stopLinkedAccountTimer_2();
                value_162 = nextFriendId;
                value_161 = setInterval(async () => {
                    const latestFriend_4 = getActiveLinkedAccountsFriend();
                    if (
                        !latestFriend_4 ||
                        String(latestFriend_4.id) !== nextFriendId ||
                        getActiveAttachmentTab() !== 'file'
                    ) {
                        stopLinkedAccountTimer_2();
                        return;
                    }
                    window.imChat.runLinkedAccountBotNow &&
                        (await window.imChat.runLinkedAccountBotNow(latestFriend_4, {
                            silent: false,
                        }));
                }, nextIntervalMs);
                count_163 = nextIntervalMs;
            };
        let text_242 = '',
            value_243 = null,
            value_244 = null,
            enabled_245 = true;
        const renderLinkedAccountsPanel_2 = (value_862 = {}) => {
                const activeFriend_17 = getActiveLinkedAccountsFriend();
                if (!linkedAccountsEmpty || !linkedAccountsControls || !linkedAccountsList) return;
                if (
                    value_862.ifUnchanged &&
                    !enabled_245 &&
                    activeFriend_17 &&
                    text_242 === String(activeFriend_17.id) &&
                    value_243 === activeFriend_17.linkedAccountChats &&
                    value_244 === activeFriend_17.linkedAccountBot
                ) {
                    syncLinkedAccountTimer();
                    return;
                }
                if (!activeFriend_17) {
                    text_242 = '';
                    enabled_245 = true;
                    linkedAccountsEmpty.style.display = 'block';
                    linkedAccountsEmpty.textContent = '关联好友仅支持单聊 Char。';
                    linkedAccountsControls.style.display = 'none';
                    linkedAccountsList.style.display = 'none';
                    stopLinkedAccountTimer_2();
                    return;
                }
                activeFriend_17.linkedAccountBot = window.imApp?.normalizeLinkedAccountBot
                    ? window.imApp.normalizeLinkedAccountBot(activeFriend_17.linkedAccountBot)
                    : activeFriend_17.linkedAccountBot || {
                          enabled: false,
                          intervalSeconds: 60,
                          lastRunAt: 0,
                      };
                activeFriend_17.linkedAccountChats = window.imApp?.normalizeLinkedAccountChats
                    ? window.imApp.normalizeLinkedAccountChats(activeFriend_17.linkedAccountChats)
                    : Array.isArray(activeFriend_17.linkedAccountChats)
                      ? activeFriend_17.linkedAccountChats
                      : [];
                text_242 = String(activeFriend_17.id);
                value_243 = activeFriend_17.linkedAccountChats;
                value_244 = activeFriend_17.linkedAccountBot;
                enabled_245 = false;
                linkedAccountsEmpty.style.display = 'none';
                linkedAccountsControls.style.display = 'flex';
                linkedAccountsList.style.display = 'flex';
                if (linkedAccountsToggle)
                    linkedAccountsToggle.checked = !!activeFriend_17.linkedAccountBot.enabled;
                if (linkedAccountsIntervalRow)
                    linkedAccountsIntervalRow.style.display = activeFriend_17.linkedAccountBot
                        .enabled
                        ? 'flex'
                        : 'none';
                if (linkedAccountsIntervalInput)
                    linkedAccountsIntervalInput.value = String(
                        activeFriend_17.linkedAccountBot.intervalSeconds || 60,
                    );
                linkedAccountsStatus &&
                    (linkedAccountsStatus.textContent = activeFriend_17.linkedAccountBot.enabled
                        ? '已开启，每 ' +
                          (activeFriend_17.linkedAccountBot.intervalSeconds || 60) +
                          ' 秒自动调用一次 API'
                        : '开启后会自动生成好友会话');
                const chats_2 = [...activeFriend_17.linkedAccountChats].sort(
                    (a_3, b_3) => (Number(b_3.updatedAt) || 0) - (Number(a_3.updatedAt) || 0),
                );
                if (chats_2.length === 0) {
                    linkedAccountsList.innerHTML =
                        '<div style="text-align:center; color:#8e8e93; font-size:13px; line-height:1.45; padding:28px 12px;">暂无好友会话。开启后，系统会自动生成好友发来的消息。</div>';
                    syncLinkedAccountTimer();
                    return;
                }
                linkedAccountsList.innerHTML = chats_2
                    .map((chat_7) => {
                        const messages_7 = Array.isArray(chat_7.messages) ? chat_7.messages : [],
                            lastMessage =
                                messages_7.length > 0 ? messages_7[messages_7.length - 1] : null,
                            linkedAccountDisplayName_870 = getLinkedAccountDisplayName(chat_7),
                            value_871 =
                                chat_7.realName || chat_7.name || linkedAccountDisplayName_870,
                            latestText = lastMessage
                                ? escapeSheetHtml(lastMessage.text || '')
                                : '暂无消息',
                            value_873 =
                                lastMessage && lastMessage.role === 'char'
                                    ? escapeSheetHtml(activeFriend_17.nickname || 'Char') + ': '
                                    : '',
                            unreadCount = messages_7.filter(
                                (message_17) =>
                                    (Number(message_17.timestamp) || 0) >
                                    (Number(chat_7.readAt) || 0),
                            ).length,
                            countText = unreadCount > 99 ? '99+' : String(unreadCount),
                            value_876 =
                                unreadCount > 0
                                    ? '<div style="min-width:20px; height:20px; padding:0 6px; box-sizing:border-box; border-radius:999px; background:#ff3b30; color:#fff; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:850; line-height:1;">' +
                                      escapeSheetHtml(countText) +
                                      '</div>'
                                    : '';
                        return (
                            `
                    <div class="linked-account-chat-card" data-linked-chat-id="` +
                            escapeSheetHtml(chat_7.id) +
                            `" style="display:flex; gap:10px; align-items:center; padding:11px 12px; border-radius:18px; background:#f7f7fa; cursor:pointer;">
                        <button type="button" class="linked-account-avatar-btn" data-linked-chat-id="` +
                            escapeSheetHtml(chat_7.id) +
                            '" style="' +
                            value_231(chat_7, 42) +
                            ' border:none; padding:0; cursor:pointer;">' +
                            escapeSheetHtml(getLinkedAccountInitial(chat_7)) +
                            `</button>
                        <div style="min-width:0; flex:1;">
                            <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
                                <div style="font-size:15px; font-weight:800; color:#111; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">` +
                            escapeSheetHtml(linkedAccountDisplayName_870) +
                            `</div>
                                <div style="display:flex; align-items:center; gap:7px; flex-shrink:0;">
                                    <div style="font-size:11px; color:#8e8e93;">` +
                            escapeSheetHtml(formatLinkedAccountTime(chat_7.updatedAt)) +
                            `</div>
                                    ` +
                            value_876 +
                            `
                                </div>
                            </div>
                            <div style="font-size:12px; color:#8e8e93; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:1px;">` +
                            escapeSheetHtml(value_871) +
                            (chat_7.relationship
                                ? ' · ' + escapeSheetHtml(chat_7.relationship)
                                : '') +
                            `</div>
                            <div style="font-size:13px; color:#3a3a3c; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:4px;">` +
                            value_873 +
                            latestText +
                            `</div>
                        </div>
                    </div>
                `
                        );
                    })
                    .join('');
                syncLinkedAccountTimer();
            },
            saveLinkedAccountBotSettings = async (patch = {}) => {
                const activeFriend_18 = getActiveLinkedAccountsFriend();
                if (!activeFriend_18) return false;
                const currentBot = window.imApp?.normalizeLinkedAccountBot
                        ? window.imApp.normalizeLinkedAccountBot(activeFriend_18.linkedAccountBot)
                        : activeFriend_18.linkedAccountBot || {
                              enabled: false,
                              intervalSeconds: 60,
                              lastRunAt: 0,
                          },
                    linkedAccountBot_2 = window.imApp?.normalizeLinkedAccountBot
                        ? window.imApp.normalizeLinkedAccountBot({
                              ...currentBot,
                              ...patch,
                          })
                        : {
                              ...currentBot,
                              ...patch,
                          },
                    saved_8 = await commitSheetFriendChange(
                        activeFriend_18.id,
                        (targetFriend_9) => {
                            targetFriend_9.linkedAccountBot = linkedAccountBot_2;
                        },
                        {
                            silent: true,
                            metaOnly: true,
                        },
                    );
                if (!saved_8) {
                    if (window.showToast) window.showToast('关联好友设置保存失败');
                    return false;
                }
                return (
                    (activeFriend_18.linkedAccountBot = linkedAccountBot_2),
                    renderLinkedAccountsPanel_2(),
                    true
                );
            };
        let enabled_247 = true,
            value_248 = null,
            count_249 = 0;
        const value_250 = async () => {
                if (!stickersList || !stickerCategoryTabs) return;
                const stickers_884 = window.imData?.stickers;
                if (!enabled_247 && value_248 === stickers_884) return;
                const value_885 = ++count_249;
                enabled_247 &&
                    ((stickersList.innerHTML =
                        '<div style="text-align:center; color:#8e8e93; padding:28px 0; font-size:13px;">Loading stickers...</div>'),
                    (stickerCategoryTabs.innerHTML = ''));
                try {
                    window.imApp?.ensureStickersReady && (await window.imApp.ensureStickersReady());
                } catch (error_6) {
                    console.error('Failed to load stickers for attachment sheet', error_6);
                }
                if (
                    value_885 !== count_249 ||
                    getActiveAttachmentTab() !== 'stickers' ||
                    attachmentSheet_2.style.display !== 'flex'
                )
                    return;
                const categories = (
                    Array.isArray(window.imData?.stickers) ? window.imData.stickers : []
                ).filter(
                    (category_2) =>
                        category_2 &&
                        Array.isArray(category_2.items) &&
                        category_2.items.length > 0,
                );
                value_248 = window.imData?.stickers;
                enabled_247 = false;
                if (categories.length === 0) {
                    stickersList.innerHTML =
                        '<div style="text-align:center; color:#8e8e93; padding:32px 14px; font-size:13px; line-height:1.45;">No stickers yet. Add stickers from Home first.</div>';
                    return;
                }
                (!activeStickerCategoryName ||
                    !categories.some(
                        (category_3) => category_3.categoryName === activeStickerCategoryName,
                    )) &&
                    (activeStickerCategoryName = categories[0].categoryName || '');
                const renderActiveStickerGrid = (category_4) => {
                    stickersList.innerHTML = '';
                    const grid = document.createElement('div');
                    grid.className = 'sheet-sticker-grid';
                    const items_6 = Array.isArray(category_4?.items) ? category_4.items : [];
                    if (items_6.length === 0) {
                        stickersList.innerHTML =
                            '<div style="text-align:center; color:#8e8e93; padding:32px 14px; font-size:13px;">This category is empty.</div>';
                        return;
                    }
                    items_6.forEach((sticker) => {
                        if (!sticker || !sticker.url) return;
                        const button_4 = document.createElement('button');
                        button_4.type = 'button';
                        button_4.className = 'sheet-sticker-item';
                        button_4.title = sticker.name || '';
                        button_4.innerHTML =
                            '<img src="' +
                            escapeSheetHtml(sticker.url) +
                            '" alt="' +
                            escapeSheetHtml(sticker.name || 'Sticker') +
                            '"><span class="sheet-sticker-name">' +
                            escapeSheetHtml(sticker.name || 'Sticker') +
                            '</span>';
                        button_4.addEventListener('click', async () => {
                            closeSheet();
                            await window.imChat.sendStickerMessage({
                                category: category_4.categoryName || '',
                                name: sticker.name || 'Sticker',
                                url: sticker.url,
                            });
                        });
                        grid.appendChild(button_4);
                    });
                    stickersList.appendChild(grid);
                };
                stickerCategoryTabs.innerHTML = '';
                categories.forEach((category_5) => {
                    const tab = document.createElement('button');
                    tab.type = 'button';
                    tab.className =
                        'sheet-sticker-category-tab ' +
                        (category_5.categoryName === activeStickerCategoryName ? 'active' : '');
                    tab.textContent = category_5.categoryName || 'Stickers';
                    tab.addEventListener('click', () => {
                        activeStickerCategoryName = category_5.categoryName || '';
                        stickerCategoryTabs
                            .querySelectorAll('.sheet-sticker-category-tab')
                            .forEach((item_13) => {
                                item_13.classList.toggle('active', item_13 === tab);
                            });
                        renderActiveStickerGrid(category_5);
                    });
                    stickerCategoryTabs.appendChild(tab);
                });
                const activeCategory =
                    categories.find(
                        (category_6) => category_6.categoryName === activeStickerCategoryName,
                    ) || categories[0];
                renderActiveStickerGrid(activeCategory);
            },
            value_251 = () => {
                const activeFriend_19 = window.imData.currentActiveFriend,
                    isOffline_2 = !!activeFriend_19?.offlineMeetEnabled;
                if (attachmentMoreOfflineLabelElement)
                    attachmentMoreOfflineLabelElement.textContent = isOffline_2
                        ? '退出线下'
                        : '线下';
                if (attachmentMoreOfflineEntryElement)
                    attachmentMoreOfflineEntryElement.classList.toggle('active', isOffline_2);
            },
            value_252 = () => {
                const activeFriend_20 = window.imData.currentActiveFriend,
                    isEnabled = !!activeFriend_20?.dynamicActionNarrationEnabled;
                if (attachmentMoreDynamicActionLabelElement)
                    attachmentMoreDynamicActionLabelElement.textContent = isEnabled
                        ? '关闭'
                        : '动描';
                if (attachmentMoreDynamicActionEntryElement)
                    attachmentMoreDynamicActionEntryElement.classList.toggle('active', isEnabled);
            },
            value_253 = async () => {
                const activeFriend_21 = window.imData.currentActiveFriend;
                if (!activeFriend_21) {
                    if (window.showToast) window.showToast('当前聊天不存在');
                    return;
                }
                const dynamicActionNarrationEnabled_2 =
                        !activeFriend_21.dynamicActionNarrationEnabled,
                    saved_9 = await commitSheetFriendChange(
                        activeFriend_21.id,
                        (targetFriend_10) => {
                            if (!targetFriend_10) return;
                            targetFriend_10.dynamicActionNarrationEnabled =
                                dynamicActionNarrationEnabled_2;
                        },
                        {
                            silent: true,
                            metaOnly: true,
                        },
                    );
                if (!saved_9) {
                    if (window.showToast) window.showToast('动描设置保存失败');
                    return;
                }
                activeFriend_21.dynamicActionNarrationEnabled = dynamicActionNarrationEnabled_2;
                value_252();
                if (window.showToast)
                    window.showToast(dynamicActionNarrationEnabled_2 ? '动描已开启' : '动描已关闭');
            };
        window.addEventListener('u2:stickers-binding-changed', () => {
            enabled_247 = true;
            if (attachmentSheet_2.style.display === 'flex') {
                const sheetTabItemActiveElement =
                    attachmentSheet_2.querySelector('.sheet-tab-item.active');
                sheetTabItemActiveElement &&
                    sheetTabItemActiveElement.getAttribute('data-tab') === 'stickers' &&
                    value_250();
            }
        });
        window.addEventListener('u2:stickers-data-changed', () => {
            enabled_247 = true;
            if (attachmentSheet_2.style.display === 'flex') {
                const sheetTabItemActiveElement_905 =
                    attachmentSheet_2.querySelector('.sheet-tab-item.active');
                sheetTabItemActiveElement_905 &&
                    sheetTabItemActiveElement_905.getAttribute('data-tab') === 'stickers' &&
                    value_250();
            }
        });
        window.addEventListener('u2:linked-accounts-changed', (event_6) => {
            const activeFriend_22 = getActiveLinkedAccountsFriend();
            if (!activeFriend_22) return;
            if (
                event_6?.detail?.friendId &&
                String(event_6.detail.friendId) !== String(activeFriend_22.id)
            )
                return;
            enabled_245 = true;
            attachmentSheet_2.style.display === 'flex' &&
                getActiveAttachmentTab() === 'file' &&
                renderLinkedAccountsPanel_2();
        });
        linkedAccountsToggle &&
            linkedAccountsToggle.addEventListener('change', async () => {
                await saveLinkedAccountBotSettings({
                    enabled: linkedAccountsToggle.checked,
                });
            });
        linkedAccountsIntervalInput &&
            linkedAccountsIntervalInput.addEventListener('change', async () => {
                const intervalSeconds_2 = Math.max(
                    5,
                    Math.round(Number(linkedAccountsIntervalInput.value) || 60),
                );
                linkedAccountsIntervalInput.value = String(intervalSeconds_2);
                await saveLinkedAccountBotSettings({
                    intervalSeconds: intervalSeconds_2,
                });
            });
        linkedAccountsList &&
            linkedAccountsList.addEventListener('click', (event_7) => {
                const avatarBtn = event_7.target.closest('.linked-account-avatar-btn');
                if (avatarBtn) {
                    event_7.preventDefault();
                    event_7.stopPropagation();
                    const chat_8 = findLinkedAccountChat(
                        avatarBtn.getAttribute('data-linked-chat-id'),
                    );
                    openLinkedAccountProfileModal(chat_8);
                    return;
                }
                const card = event_7.target.closest('.linked-account-chat-card');
                if (!card) return;
                const chat_9 = findLinkedAccountChat(card.getAttribute('data-linked-chat-id'));
                openLinkedAccountChatModal(chat_9);
                markLinkedAccountChatRead(card.getAttribute('data-linked-chat-id'));
            });
        tabItems.forEach((item_14) => {
            item_14.addEventListener('click', () => {
                if (item_14.classList.contains('active')) return;
                tabItems.forEach((i) => i.classList.remove('active'));
                item_14.classList.add('active');
                const targetTab = item_14.getAttribute('data-tab');
                targetTab === 'more' && (value_251(), value_252());
                sheetViews.forEach((linkedAccountsEmpty_2) => {
                    if (linkedAccountsEmpty_2.classList.contains('view-' + targetTab)) {
                        if (targetTab === 'gallery') linkedAccountsEmpty_2.style.display = 'flex';
                        else
                            targetTab === 'file'
                                ? (linkedAccountsEmpty_2.style.display = 'block')
                                : (linkedAccountsEmpty_2.style.display = 'flex');
                    } else linkedAccountsEmpty_2.style.display = 'none';
                });
                targetTab !== 'file' && stopLinkedAccountTimer_2();
                const value_913 = ++count_170;
                renderFrameId_3 !== null &&
                    typeof window.cancelAnimationFrame === 'function' &&
                    window.cancelAnimationFrame(renderFrameId_3);
                renderFrameId_3 = window.requestAnimationFrame(() => {
                    renderFrameId_3 = window.requestAnimationFrame(() => {
                        renderFrameId_3 = null;
                        if (value_913 !== count_170 || getActiveAttachmentTab() !== targetTab)
                            return;
                        if (targetTab === 'stickers') void value_250();
                        if (targetTab === 'file')
                            renderLinkedAccountsPanel_2({
                                ifUnchanged: true,
                            });
                    });
                });
                value_173(item_14);
            });
        });
        const setRecipientTriggerDisplay = (member_2) => {
                payRecipientLabel &&
                    (payRecipientLabel.textContent = member_2
                        ? member_2.nickname || member_2.realName || '群成员'
                        : '请选择群成员');
                if (payRecipientAvatar) {
                    if (member_2 && member_2.avatarUrl)
                        payRecipientAvatar.innerHTML =
                            '<img src="' +
                            member_2.avatarUrl +
                            '" style="width:100%; height:100%; object-fit:cover; display:block;">';
                    else
                        member_2
                            ? (payRecipientAvatar.innerHTML =
                                  '<span>' +
                                  String(member_2.nickname || member_2.realName || '群').charAt(0) +
                                  '</span>')
                            : (payRecipientAvatar.innerHTML = '<i class="fas fa-user"></i>');
                }
            },
            setRecipientDropdownOpen = (isOpen_2) => {
                if (payRecipientDropdown)
                    payRecipientDropdown.style.display = isOpen_2 ? 'block' : 'none';
                payRecipientArrow &&
                    (payRecipientArrow.style.transform = isOpen_2
                        ? 'rotate(180deg)'
                        : 'rotate(0deg)');
            },
            value_254 = (activeFriend_23) => {
                if (!payRecipientDropdown) return;
                payRecipientDropdown.innerHTML = '';
                selectedRecipientId = null;
                setRecipientTriggerDisplay(null);
                setRecipientDropdownOpen(false);
                if (!activeFriend_23 || activeFriend_23.type !== 'group') return;
                const recipients = window.imChat.getAvailableGroupRecipients(activeFriend_23);
                recipients.forEach((member_3) => {
                    const option = document.createElement('button');
                    option.type = 'button';
                    option.className = 'pay-group-recipient-option';
                    option.setAttribute('data-member-id', member_3.id);
                    option.style.width = '100%';
                    option.style.border = 'none';
                    option.style.borderRadius = '14px';
                    option.style.background = 'transparent';
                    option.style.padding = '10px 10px';
                    option.style.display = 'flex';
                    option.style.alignItems = 'center';
                    option.style.justifyContent = 'space-between';
                    option.style.cursor = 'pointer';
                    option.innerHTML =
                        `
                    <div style="display:flex; align-items:center; gap:10px; min-width:0;">
                        <div style="width:30px; height:30px; border-radius:50%; overflow:hidden; background:#e5e5ea; color:#8e8e93; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:12px;">
                            ` +
                        (member_3.avatarUrl
                            ? '<img src="' +
                              member_3.avatarUrl +
                              '" style="width:100%; height:100%; object-fit:cover; display:block;">'
                            : '<span>' +
                              String(member_3.nickname || member_3.realName || '群').charAt(0) +
                              '</span>') +
                        `
                        </div>
                        <div style="font-size:14px; color:#111; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">` +
                        (member_3.nickname || member_3.realName || '群成员') +
                        `</div>
                    </div>
                    <i class="fas fa-check" style="font-size:12px; color:transparent;"></i>
                `;
                    option.addEventListener('click', () => {
                        selectedRecipientId = member_3.id;
                        setRecipientTriggerDisplay(member_3);
                        payRecipientDropdown
                            .querySelectorAll('.pay-group-recipient-option')
                            .forEach((item_15) => {
                                item_15.style.background = 'transparent';
                                const icon_3 = item_15.querySelector('.fa-check');
                                if (icon_3) icon_3.style.color = 'transparent';
                            });
                        option.style.background = '#f7f7fa';
                        const icon_4 = option.querySelector('.fa-check');
                        if (icon_4) icon_4.style.color = '#111';
                        setRecipientDropdownOpen(false);
                    });
                    payRecipientDropdown.appendChild(option);
                });
                if (recipients.length > 0) {
                    const firstOption = payRecipientDropdown.querySelector(
                        '.pay-group-recipient-option',
                    );
                    if (firstOption) firstOption.click();
                }
            },
            syncPayModeUi = (value_922, nextMode = 'transfer') => {
                currentPayMode = nextMode === 'red_packet' ? 'red_packet' : 'transfer';
                payModeTabs.forEach((tab_2) => {
                    const isActive = tab_2.getAttribute('data-pay-mode') === currentPayMode;
                    tab_2.classList.toggle('active', isActive);
                    tab_2.style.color = isActive ? '#000' : '#8e8e93';
                    tab_2.style.fontWeight = isActive ? '700' : '600';
                    tab_2.style.boxShadow = 'none';
                    tab_2.style.background = 'none';
                    tab_2.style.borderRadius = '0';
                    tab_2.style.setProperty('--tab-line-opacity', isActive ? '1' : '0');
                    isActive
                        ? (tab_2.style.borderBottom = '2px solid #111')
                        : (tab_2.style.borderBottom = '2px solid transparent');
                });
                if (payTransferPanel)
                    payTransferPanel.style.display =
                        currentPayMode === 'transfer' ? 'block' : 'none';
                if (payRedPacketPanel)
                    payRedPacketPanel.style.display =
                        currentPayMode === 'red_packet' ? 'block' : 'none';
                const isGroupChat_2 = value_922 && value_922.type === 'group';
                payRecipientField &&
                    (payRecipientField.style.display =
                        isGroupChat_2 && currentPayMode === 'transfer' ? 'block' : 'none');
            },
            closePayTransferForm = () => {
                if (!payFormOverlay) return;
                payFormOverlay.style.display = 'none';
                if (payAmountInput) payAmountInput.value = '';
                if (payDescInput) payDescInput.value = '';
                if (payRedPacketCountInput) payRedPacketCountInput.value = '';
                if (payRedPacketAmountInput) payRedPacketAmountInput.value = '';
                if (payRedPacketDescInput) payRedPacketDescInput.value = '';
                selectedRecipientId = null;
                if (payRecipientDropdown) payRecipientDropdown.innerHTML = '';
                setRecipientTriggerDisplay(null);
                setRecipientDropdownOpen(false);
                currentPayMode = 'transfer';
            },
            closeVoiceMessageForm = () => {
                if (!voiceFormOverlay) return;
                voiceFormOverlay.style.display = 'none';
                if (voiceTranscriptInput) voiceTranscriptInput.value = '';
            },
            value_257 = () => {
                if (!narrationFormOverlay) return;
                narrationFormOverlay.style.display = 'none';
                if (narrationInput) narrationInput.value = '';
            },
            setRegenerateBusyState = (busy_2) => {
                const controls = [regenerateEntry, regenerateReferenceBtn, regenerateDirectBtn];
                controls.forEach((control) => {
                    if (!control) return;
                    control.dataset.busy = busy_2 ? 'true' : 'false';
                    control.style.opacity = busy_2 ? '0.45' : '';
                    control.style.pointerEvents = busy_2 ? 'none' : '';
                });
            },
            closeRegenerateForm = () => {
                if (!regenerateFormOverlay) return;
                regenerateFormOverlay.style.display = 'none';
                if (regenerateRequirementInput) regenerateRequirementInput.value = '';
            },
            value_260 = (requiredAmount, callback_2) => {
                const sheet = document.getElementById('pay-method-selection-sheet'),
                    listEl_2 = document.getElementById('pay-method-selection-list');
                if (!sheet || !listEl_2) return false;
                const cards = typeof window.getPayCards === 'function' ? window.getPayCards() : [];
                if (cards.length === 0) {
                    if (window.showToast) window.showToast('没有可用的银行卡');
                    return false;
                }
                listEl_2.innerHTML = '';
                cards.forEach((c) => {
                    const el = document.createElement('div');
                    el.className = 'pay-bank-card';
                    el.style.background = '#ffffff';
                    el.style.color = '#000000';
                    el.style.borderRadius = '16px';
                    el.style.cursor = 'pointer';
                    el.style.border = '1px solid #e5e5ea';
                    el.style.boxShadow = 'none';
                    el.style.height = 'auto';
                    el.style.padding = '12px 16px';
                    const isInsufficient = c.balance < requiredAmount;
                    isInsufficient &&
                        ((el.style.opacity = '0.5'), (el.style.cursor = 'not-allowed'));
                    el.innerHTML =
                        `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; flex-direction: column;">
                            <div class="pay-bank-name" style="font-size: 15px; display: flex; align-items: center; gap: 8px;"><i class="` +
                        c.icon +
                        '"></i> ' +
                        c.name +
                        `</div>
                            <div class="pay-bank-type" style="font-size: 11px; margin-top: 4px; opacity: 0.8;">` +
                        c.cardType +
                        ' - ' +
                        c.number +
                        `</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 15px; font-weight: 600;">¥` +
                        c.balance.toFixed(2) +
                        `</div>
                            ` +
                        (isInsufficient
                            ? '<div style="font-size: 11px; color: #ff3b30; margin-top: 4px;">余额不足</div>'
                            : '') +
                        `
                        </div>
                    </div>
                `;
                    !isInsufficient &&
                        el.addEventListener('click', () => {
                            if (window.closeView) window.closeView(sheet);
                            else sheet.style.display = 'none';
                            setTimeout(() => {
                                callback_2(c.id);
                            }, 300);
                        });
                    listEl_2.appendChild(el);
                });
                if (window.openView) window.openView(sheet);
                else sheet.style.display = 'flex';
                return true;
            },
            value_261 = () => {
                if (!payFormOverlay) return;
                const activeFriend_24 = window.imData.currentActiveFriend,
                    isGroupChat = activeFriend_24 && activeFriend_24.type === 'group';
                if (content_4) content_4.style.transform = 'translateY(100%)';
                if (sheetOverlayElement) sheetOverlayElement.style.opacity = '0';
                payFormOverlay.style.display = 'flex';
                if (payAmountInput) payAmountInput.value = '';
                if (payDescInput) payDescInput.value = '';
                if (payRedPacketCountInput) payRedPacketCountInput.value = '';
                if (payRedPacketAmountInput) payRedPacketAmountInput.value = '';
                if (payRedPacketDescInput) payRedPacketDescInput.value = '';
                payModeTabs.length > 0 &&
                    payModeTabs.forEach((tab_3) => {
                        tab_3.style.display = isGroupChat ? 'inline-flex' : 'none';
                    });
                value_254(activeFriend_24);
                syncPayModeUi(activeFriend_24, 'transfer');
                setTimeout(() => {
                    if (payAmountInput) payAmountInput.focus();
                }, 30);
            },
            value_262 = () => {
                if (!voiceFormOverlay) return;
                if (content_4) content_4.style.transform = 'translateY(100%)';
                if (sheetOverlayElement) sheetOverlayElement.style.opacity = '0';
                voiceFormOverlay.style.display = 'flex';
                voiceTranscriptInput &&
                    ((voiceTranscriptInput.value = ''),
                    setTimeout(() => voiceTranscriptInput.focus(), 30));
            },
            value_263 = () => {
                if (!narrationFormOverlay) return;
                if (content_4) content_4.style.transform = 'translateY(100%)';
                if (sheetOverlayElement) sheetOverlayElement.style.opacity = '0';
                narrationFormOverlay.style.display = 'flex';
                narrationInput &&
                    ((narrationInput.value = ''), setTimeout(() => narrationInput.focus(), 30));
            },
            openRegenerateForm = () => {
                if (!regenerateFormOverlay) return;
                if (regenerateEntry?.dataset?.busy === 'true') return;
                const currentActiveFriend_935 = window.imData.currentActiveFriend;
                if (!currentActiveFriend_935 || !window.imChat.regenerateLastAiReply) {
                    if (window.showToast) window.showToast('暂无可重回的回复');
                    return;
                }
                if (content_4) content_4.style.transform = 'translateY(100%)';
                if (sheetOverlayElement) sheetOverlayElement.style.opacity = '0';
                regenerateFormOverlay.style.display = 'flex';
                regenerateRequirementInput &&
                    ((regenerateRequirementInput.value = ''),
                    setTimeout(() => regenerateRequirementInput.focus(), 30));
            },
            buildOfflineThinkingHtml = (value_936, value_937 = false) => {
                const trim_938 = String(value_936 || '').trim();
                if (!trim_938) return '';
                return (
                    `
                <section class="offline-chat-thinking` +
                    (value_937 ? ' is-expanded' : '') +
                    `" data-offline-thinking>
                    <button type="button" class="offline-chat-thinking-toggle" aria-expanded="` +
                    (value_937 ? 'true' : 'false') +
                    `">
                        <span class="offline-chat-thinking-label"><span>COT</span></span>
                        <i class="fas fa-chevron-down offline-chat-thinking-icon" aria-hidden="true"></i>
                    </button>
                    <div class="offline-chat-thinking-content" data-raw-thinking="` +
                    escapeSheetHtml(trim_938) +
                    '"' +
                    (value_937 ? '' : ' hidden') +
                    '>' +
                    escapeSheetHtml(trim_938) +
                    `</div>
                </section>
            `
                );
            },
            setOfflineThinkingExpanded = (bubble_3, expanded_2) => {
                const panel_2 = bubble_3?.querySelector?.('[data-offline-thinking]');
                if (!panel_2) return;
                const toggle_2 = panel_2.querySelector('.offline-chat-thinking-toggle'),
                    content_6 = panel_2.querySelector('.offline-chat-thinking-content');
                panel_2.classList.toggle('is-expanded', !!expanded_2);
                if (toggle_2) toggle_2.setAttribute('aria-expanded', expanded_2 ? 'true' : 'false');
                if (content_6) content_6.hidden = !expanded_2;
            },
            bindOfflineThinkingToggle = (bubble_4) => {
                const toggle_3 = bubble_4?.querySelector?.('.offline-chat-thinking-toggle');
                if (!toggle_3 || toggle_3.dataset.bound === 'true') return;
                toggle_3.dataset.bound = 'true';
                toggle_3.addEventListener('click', (event_8) => {
                    event_8.preventDefault();
                    event_8.stopPropagation();
                    setOfflineThinkingExpanded(
                        bubble_4,
                        toggle_3.getAttribute('aria-expanded') !== 'true',
                    );
                });
            },
            renderOfflineThinkingState = (bubble_5, value_945, options_5 = {}) => {
                const body_4 = bubble_5?.querySelector?.('.offline-chat-bubble-body');
                if (!body_4) return null;
                const textContent_2 = String(value_945 || '').trim();
                let panel_3 = body_4.querySelector('[data-offline-thinking]');
                if (!textContent_2) return (panel_3?.remove(), null);
                !panel_3 &&
                    (body_4.insertAdjacentHTML(
                        'afterbegin',
                        buildOfflineThinkingHtml(textContent_2, !!options_5.expanded),
                    ),
                    (panel_3 = body_4.querySelector('[data-offline-thinking]')),
                    bindOfflineThinkingToggle(bubble_5));
                const content_7 = panel_3?.querySelector('.offline-chat-thinking-content');
                return (
                    content_7 &&
                        (content_7.setAttribute('data-raw-thinking', textContent_2),
                        (content_7.textContent = textContent_2)),
                    setOfflineThinkingExpanded(bubble_5, !!options_5.expanded),
                    panel_3
                );
            },
            isOfflineChatNearBottom = (contentArea, threshold = 96) => {
                if (!contentArea) return false;
                return (
                    contentArea.scrollHeight - contentArea.scrollTop - contentArea.clientHeight <=
                    threshold
                );
            },
            value_268 = (contentArea_4) => {
                if (!contentArea_4) return false;
                return (
                    contentArea_4.scrollHeight -
                        contentArea_4.scrollTop -
                        contentArea_4.clientHeight <=
                    threshold_2
                );
            },
            value_269 = (value_951, value_952 = {}) => {
                if (!value_951) return;
                const offlineChatScrollLatestElement = document.getElementById(
                    'offline-chat-scroll-latest',
                );
                if (!offlineChatScrollLatestElement) return;
                if (Number.isFinite(value_952.inputHeight)) {
                    const _offlineLatestBottom_2 =
                        Math.max(0, Math.round(value_952.inputHeight)) + 12 + 'px';
                    offlineChatScrollLatestElement._offlineLatestBottom !==
                        _offlineLatestBottom_2 &&
                        (offlineChatScrollLatestElement.style.setProperty(
                            '--im-chat-latest-bottom',
                            _offlineLatestBottom_2,
                        ),
                        (offlineChatScrollLatestElement._offlineLatestBottom =
                            _offlineLatestBottom_2));
                }
                const value_953 =
                        value_952.hasOverflow == null
                            ? value_951.scrollHeight - value_951.clientHeight > 1
                            : value_952.hasOverflow,
                    value_954 = value_951.dataset.offlineChatMode === 'current',
                    value_955 =
                        value_952.following == null
                            ? isOfflineChatNearBottom(value_951)
                            : value_952.following === true,
                    _offlineLatestVisible_2 = value_954 && value_953 && !value_955;
                offlineChatScrollLatestElement._offlineLatestVisible !== _offlineLatestVisible_2 &&
                    (offlineChatScrollLatestElement.classList.toggle(
                        'is-visible',
                        _offlineLatestVisible_2,
                    ),
                    offlineChatScrollLatestElement.setAttribute(
                        'aria-hidden',
                        _offlineLatestVisible_2 ? 'false' : 'true',
                    ),
                    (offlineChatScrollLatestElement.tabIndex = _offlineLatestVisible_2 ? 0 : -1),
                    (offlineChatScrollLatestElement._offlineLatestVisible =
                        _offlineLatestVisible_2));
            },
            value_270 = (() => {
                let value_958 = null,
                    following_2 = false,
                    enabled_960 = false,
                    renderFrameId_4 = null,
                    renderFrameId_5 = null,
                    offlinePromptMigrationSavePromise_2 = null,
                    value_964 = null,
                    value_965 = null,
                    value_966 = null,
                    value_967 = null,
                    inputHeight_2 = 0,
                    enabled_969 = false,
                    count_970 = 0,
                    count_971 = 0;
                const value_972 = () => {
                        if (renderFrameId_4 === null) return;
                        if (typeof window.cancelAnimationFrame === 'function')
                            window.cancelAnimationFrame(renderFrameId_4);
                        else clearTimeout(renderFrameId_4);
                        renderFrameId_4 = null;
                    },
                    value_973 = () => {
                        if (renderFrameId_5 === null) return;
                        if (typeof window.cancelAnimationFrame === 'function')
                            window.cancelAnimationFrame(renderFrameId_5);
                        else clearTimeout(renderFrameId_5);
                        renderFrameId_5 = null;
                    },
                    value_974 = () => {
                        if (offlinePromptMigrationSavePromise_2 === null) return;
                        clearTimeout(offlinePromptMigrationSavePromise_2);
                        offlinePromptMigrationSavePromise_2 = null;
                    },
                    scheduleLegacyOfflinePromptCleanup_2 = () => {
                        renderFrameId_5 !== null &&
                            (value_973(), scheduleLegacyOfflinePromptCleanup_4());
                        if (!value_958 || enabled_960 || !following_2) return;
                        value_958.scrollTop = scrollTop_2;
                        count_970 = value_958.scrollTop;
                        value_269(value_958, {
                            following: true,
                        });
                    },
                    scheduleLegacyOfflinePromptCleanup_3 = () => {
                        if (!value_958 || enabled_960 || !following_2 || renderFrameId_4 !== null)
                            return;
                        const render_3 = () => {
                            renderFrameId_4 = null;
                            scheduleLegacyOfflinePromptCleanup_2();
                        };
                        if (typeof window.requestAnimationFrame === 'function')
                            renderFrameId_4 = window.requestAnimationFrame(render_3);
                        else renderFrameId_4 = setTimeout(render_3, 0);
                    },
                    value_977 = () => {
                        if (!value_958 || enabled_960 || !following_2) return;
                        value_974();
                        scheduleLegacyOfflinePromptCleanup_3();
                        offlinePromptMigrationSavePromise_2 = setTimeout(() => {
                            offlinePromptMigrationSavePromise_2 = null;
                            scheduleLegacyOfflinePromptCleanup_3();
                        }, 120);
                    },
                    value_978 = () => {
                        if (!value_965 || !value_958) return;
                        const messages_8 = value_958.querySelectorAll('.offline-chat-bubble'),
                            lastMessage_2 =
                                messages_8.length > 0 ? messages_8[messages_8.length - 1] : null;
                        if (lastMessage_2 === value_967) return;
                        if (value_967) value_965.unobserve(value_967);
                        value_967 = lastMessage_2;
                        if (value_967) value_965.observe(value_967);
                    },
                    value_979 = () => {
                        value_972();
                        value_973();
                        value_974();
                        if (value_964) value_964.disconnect();
                        if (value_965) value_965.disconnect();
                        if (value_966) value_966.disconnect();
                        value_958 &&
                            (value_958.removeEventListener('scroll', handleScroll),
                            value_958.removeEventListener('load', value_985, true),
                            value_958.removeEventListener('error', value_985, true),
                            value_958.removeEventListener('pointerdown', value_983, true),
                            value_958.removeEventListener('touchstart', value_983, true),
                            value_958.removeEventListener('wheel', handleWheel, true));
                        value_964 = null;
                        value_965 = null;
                        value_966 = null;
                        value_967 = null;
                        value_958 = null;
                    },
                    value_980 = () => {
                        value_972();
                        value_974();
                        enabled_969 = true;
                        following_2 = false;
                    },
                    scheduleLegacyOfflinePromptCleanup_4 = () => {
                        if (!value_958 || enabled_960) return;
                        const scrollTop_989 = value_958.scrollTop,
                            scrollHeight_990 = value_958.scrollHeight,
                            clientHeight_991 = value_958.clientHeight;
                        if (scrollHeight_990 - scrollTop_989 - clientHeight_991 <= threshold_2) {
                            following_2 = true;
                            enabled_969 = false;
                        } else {
                            if (
                                !enabled_969 &&
                                Date.now() <= count_971 &&
                                scrollTop_989 < count_970 - count_12
                            )
                                value_980();
                            else enabled_969 && (following_2 = false);
                        }
                        value_269(value_958, {
                            following: following_2,
                            hasOverflow: scrollHeight_990 - clientHeight_991 > 1,
                        });
                    },
                    handleScroll = () => {
                        if (!value_958 || enabled_960 || renderFrameId_5 !== null) return;
                        const render_4 = () => {
                            renderFrameId_5 = null;
                            scheduleLegacyOfflinePromptCleanup_4();
                        };
                        if (typeof window.requestAnimationFrame === 'function')
                            renderFrameId_5 = window.requestAnimationFrame(render_4);
                        else renderFrameId_5 = setTimeout(render_4, 0);
                    },
                    value_983 = () => {
                        if (!value_958 || enabled_960) return;
                        count_970 = value_958.scrollTop;
                        count_971 = Date.now() + count_13;
                        handleScroll();
                    },
                    handleWheel = (value_993) => {
                        value_983();
                        (Number(value_993?.deltaY) || 0) < 0 && (value_980(), handleScroll());
                    },
                    value_985 = (event_994) => {
                        const target_995 = event_994?.target;
                        if (target_995?.matches?.('.offline-chat-generated-image img'))
                            scheduleLegacyOfflinePromptCleanup_3();
                    },
                    value_986 = (value_996, value_997 = {}) => {
                        if (!value_996) return;
                        if (value_958 !== value_996) {
                            value_979();
                            value_958 = value_996;
                            value_958.addEventListener('scroll', handleScroll, {
                                passive: true,
                            });
                            value_958.addEventListener('load', value_985, true);
                            value_958.addEventListener('error', value_985, true);
                            value_958.addEventListener('pointerdown', value_983, {
                                passive: true,
                                capture: true,
                            });
                            value_958.addEventListener('touchstart', value_983, {
                                passive: true,
                                capture: true,
                            });
                            value_958.addEventListener('wheel', handleWheel, {
                                passive: true,
                                capture: true,
                            });
                            typeof window.MutationObserver === 'function' &&
                                ((value_964 = new window.MutationObserver(() => {
                                    value_978();
                                    scheduleLegacyOfflinePromptCleanup_3();
                                    handleScroll();
                                })),
                                value_964.observe(value_958, {
                                    childList: true,
                                }));
                            const offlineChatViewOfflineChatInputAreaElement =
                                document.querySelector(
                                    '#offline-chat-view .offline-chat-input-area',
                                );
                            inputHeight_2 =
                                offlineChatViewOfflineChatInputAreaElement?.getBoundingClientRect()
                                    .height || 0;
                            typeof window.ResizeObserver === 'function' &&
                                ((value_965 = new window.ResizeObserver(() => {
                                    scheduleLegacyOfflinePromptCleanup_3();
                                    handleScroll();
                                })),
                                value_965.observe(value_958),
                                offlineChatViewOfflineChatInputAreaElement &&
                                    ((value_966 = new window.ResizeObserver((value_998) => {
                                        inputHeight_2 =
                                            value_998?.[0]?.borderBoxSize?.[0]?.blockSize ??
                                            offlineChatViewOfflineChatInputAreaElement.getBoundingClientRect()
                                                .height ??
                                            0;
                                        value_269(value_958, {
                                            following: following_2,
                                            inputHeight: inputHeight_2,
                                        });
                                        scheduleLegacyOfflinePromptCleanup_3();
                                    })),
                                    value_966.observe(offlineChatViewOfflineChatInputAreaElement)));
                        }
                        enabled_960 = false;
                        following_2 =
                            value_997.force === true ||
                            (value_997.following == null
                                ? isOfflineChatNearBottom(value_958)
                                : value_997.following === true);
                        enabled_969 = !following_2;
                        count_970 = value_958.scrollTop;
                        value_978();
                        if (value_997.immediate !== false) scheduleLegacyOfflinePromptCleanup_2();
                        scheduleLegacyOfflinePromptCleanup_3();
                        value_269(value_958, {
                            following: following_2,
                            inputHeight: inputHeight_2,
                        });
                    };
                return {
                    follow: (value_999, value_1000 = {}) => {
                        value_986(value_999, {
                            ...value_1000,
                            force: value_1000.force !== false,
                        });
                        value_977();
                    },
                    preserve: (value_1001) => {
                        if (value_958 !== value_1001)
                            return {
                                following: isOfflineChatNearBottom(value_1001),
                            };
                        return (
                            (enabled_960 = true),
                            value_972(),
                            value_974(),
                            {
                                following: following_2,
                            }
                        );
                    },
                    restore: (value_1002, value_1003, value_1004 = {}) =>
                        value_986(value_1002, {
                            following: value_1004.force === true || value_1003?.following === true,
                            immediate: value_1004.immediate,
                        }),
                    refresh: () => scheduleLegacyOfflinePromptCleanup_3(),
                    settle: () => value_977(),
                    isFollowing: (value_1005) =>
                        value_958 === value_1005
                            ? following_2 && !enabled_960
                            : isOfflineChatNearBottom(value_1005),
                };
            })(),
            scrollOfflineChatToBottom = (value_1006) => {
                if (value_1006) value_270.follow(value_1006);
            },
            value_272 = (value_1007) => {
                const toggle_4 = document.getElementById('offline-chat-scroll-latest');
                if (!toggle_4 || toggle_4.dataset.bound === 'true') return;
                toggle_4.dataset.bound = 'true';
                toggle_4.addEventListener('click', (event_1009) => {
                    event_1009.preventDefault();
                    event_1009.stopPropagation();
                    scrollOfflineChatToBottom(
                        value_1007 || document.getElementById('offline-chat-content'),
                    );
                });
            },
            value_273 = (value_1010) => {
                if (!value_1010) return null;
                const from_1011 = Array.from(
                        value_1010.querySelectorAll('[data-message-id], [data-summary-id]'),
                    ),
                    scrollTop_3 = value_1010.scrollTop,
                    index_1013 = from_1011.findIndex(
                        (value_1016) =>
                            value_1016.offsetTop + value_1016.offsetHeight > scrollTop_3 + 4,
                    ),
                    index_10 = index_1013 >= 0 ? index_1013 : Math.max(0, from_1011.length - 1),
                    value_1015 = from_1011[index_10];
                return {
                    nearBottom: isOfflineChatNearBottom(value_1010),
                    messageId: value_1015?.getAttribute('data-message-id') || '',
                    summaryId: value_1015?.getAttribute('data-summary-id') || '',
                    index: index_10,
                    offset: value_1015 ? value_1015.offsetTop - scrollTop_3 : 0,
                    scrollTop: scrollTop_3,
                };
            },
            value_274 = (value_1017, value_1018) => {
                if (!value_1017 || !value_1018) return;
                const render_5 = () => {
                    if (value_1018.nearBottom) {
                        scrollOfflineChatToBottom(value_1017);
                        return;
                    }
                    const result_1020 = Array.from(
                        value_1017.querySelectorAll('[data-message-id], [data-summary-id]'),
                    ).find(
                        (value_1024) =>
                            (value_1018.messageId &&
                                value_1024.getAttribute('data-message-id') ===
                                    value_1018.messageId) ||
                            (value_1018.summaryId &&
                                value_1024.getAttribute('data-summary-id') ===
                                    value_1018.summaryId),
                    );
                    if (result_1020) {
                        value_1017.scrollTop = Math.max(
                            0,
                            result_1020.offsetTop - value_1018.offset,
                        );
                        return;
                    }
                    const from_1021 = Array.from(
                            value_1017.querySelectorAll('[data-message-id], [data-summary-id]'),
                        ),
                        value_1022 = Number.isInteger(value_1018.index)
                            ? Math.min(
                                  Math.max(value_1018.index, 0),
                                  Math.max(0, from_1021.length - 1),
                              )
                            : -1,
                        value_1023 = value_1022 >= 0 ? from_1021[value_1022] : null;
                    if (value_1023) {
                        value_1017.scrollTop = Math.max(
                            0,
                            value_1023.offsetTop - value_1018.offset,
                        );
                        return;
                    }
                    value_1017.scrollTop = Math.min(
                        Math.max(0, value_1018.scrollTop),
                        Math.max(0, value_1017.scrollHeight - value_1017.clientHeight),
                    );
                };
                typeof window.requestAnimationFrame === 'function'
                    ? window.requestAnimationFrame(() => {
                          render_5();
                          window.requestAnimationFrame(render_5);
                      })
                    : setTimeout(render_5, 0);
            },
            getOfflineGeneratedImageFileName = (timestamp_3, mimeType_2 = '') => {
                const extensionByMimeType = {
                        'image/jpeg': 'jpg',
                        'image/jpg': 'jpg',
                        'image/webp': 'webp',
                        'image/gif': 'gif',
                        'image/avif': 'avif',
                        'image/png': 'png',
                    },
                    extension =
                        extensionByMimeType[String(mimeType_2 || '').toLowerCase()] || 'png',
                    date_2 = new Date(timestamp_3 || Date.now()),
                    stamp = Number.isNaN(date_2.getTime())
                        ? String(Date.now())
                        : date_2.toISOString().replace(/[:.]/g, '-').slice(0, 19);
                return 'imessage-offline-generated-' + stamp + '.' + extension;
            };
        async function handleAction_276(message_18) {
            const imageUrl_2 = String(message_18?.imageUrl || '').trim();
            if (!imageUrl_2 || typeof window.u2ExportFile !== 'function')
                throw new Error('图片保存功能尚未加载，请刷新后重试');
            const response_3 = await fetch(imageUrl_2);
            if (!response_3.ok) throw new Error('无法读取这张图片，请稍后重试');
            const blob_2 = await response_3.blob();
            if (!/^image\//i.test(blob_2.type || '')) throw new Error('图片数据无效，无法保存');
            const result_2 = await window.u2ExportFile({
                blob: blob_2,
                fileName: getOfflineGeneratedImageFileName(message_18.timestamp, blob_2.type),
                title: 'iMessage 线下剧情图片',
            });
            if (result_2 === 'failed') throw new Error('图片保存失败，请稍后重试');
            return result_2;
        }
        const getOfflineChatActionButtonsHtml = (
                value_1036,
                value_1037 = false,
                value_1038 = null,
            ) => {
                if (value_1037) return '';
                if (isOfflineAutoImageMessage(value_1038))
                    return '<div class="offline-chat-bubble-actions"><button type="button" class="offline-chat-action-btn" data-offline-action="save-image" title="保存到本地" aria-label="保存到本地"><i class="fas fa-download"></i></button><button type="button" class="offline-chat-action-btn danger" data-offline-action="delete" title="删除" aria-label="删除"><i class="fas fa-trash"></i></button></div>';
                return (
                    `
                <div class="offline-chat-bubble-actions">
                    <button type="button" class="offline-chat-action-btn" data-offline-action="edit" title="编辑" aria-label="编辑"><i class="fas fa-pen"></i></button>
                    ` +
                    (!value_1036
                        ? '<button type="button" class="offline-chat-action-btn" data-offline-action="reroll" title="重回" aria-label="重回"><i class="fas fa-redo"></i></button>'
                        : '') +
                    `
                    ` +
                    (!value_1036 && value_1038?.continuationState === 'available'
                        ? '<button type="button" class="offline-chat-action-btn" data-offline-action="continue" title="继续生成" aria-label="继续生成"><i class="fas fa-forward"></i></button>'
                        : '') +
                    `
                    <button type="button" class="offline-chat-action-btn danger" data-offline-action="delete" title="删除" aria-label="删除"><i class="fas fa-trash"></i></button>
                </div>
            `
                );
            },
            bindOfflineChatBubbleActions = (value_1039, message_19) => {
                if (!value_1039 || !message_19?.id) return;
                value_1039.querySelectorAll('[data-offline-action]').forEach((button_5) => {
                    if (button_5.dataset.bound === 'true') return;
                    button_5.dataset.bound = 'true';
                    button_5.addEventListener('click', async (event_1042) => {
                        event_1042.preventDefault();
                        event_1042.stopPropagation();
                        const action_2 = button_5.getAttribute('data-offline-action'),
                            currentActiveFriend_1044 = window.imData?.currentActiveFriend;
                        if (isOfflineAutoImageMessage_2(currentActiveFriend_1044)) return;
                        if (action_2 === 'edit') await openOfflineMessageEditor(message_19.id);
                        if (action_2 === 'delete') {
                            buildOfflineThinkingHtml_2(currentActiveFriend_1044, true);
                            try {
                                await handleAction_290(message_19.id);
                            } finally {
                                buildOfflineThinkingHtml_2(currentActiveFriend_1044, false);
                            }
                        }
                        if (action_2 === 'reroll')
                            await rerollOfflineAssistantMessage(message_19.id, button_5);
                        if (action_2 === 'continue')
                            await rerollOfflineAssistantMessage_2(message_19.id, button_5);
                        if (action_2 === 'save-image') {
                            if (button_5.disabled) return;
                            const innerHTML_3 = button_5.innerHTML,
                                title_2 = button_5.title;
                            button_5.disabled = true;
                            button_5.title = '保存中…';
                            button_5.setAttribute('aria-label', '保存中…');
                            button_5.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                            try {
                                const result_3 = await handleAction_276(message_19);
                                if (result_3 === 'downloaded')
                                    window.showToast?.('图片已保存到本地');
                                if (result_3 === 'shared')
                                    window.showToast?.('已打开系统保存，请选择“存储到文件”');
                            } catch (value_1048) {
                                window.showToast?.(
                                    value_1048?.message || '图片保存失败，请稍后重试',
                                );
                            } finally {
                                button_5.disabled = false;
                                button_5.title = title_2;
                                button_5.setAttribute('aria-label', title_2 || '保存到本地');
                                button_5.innerHTML = innerHTML_3;
                            }
                        }
                    });
                });
            },
            enableOfflineChatBubbleActions = (bubbleDiv, message_20) => {
                const footer = bubbleDiv?.querySelector?.('.offline-chat-bubble-footer');
                if (!footer || !message_20?.id) return;
                footer.querySelector('.offline-chat-bubble-actions')?.remove();
                footer.insertAdjacentHTML(
                    'beforeend',
                    getOfflineChatActionButtonsHtml(message_20.role === 'user', false, message_20),
                );
                bindOfflineChatBubbleActions(bubbleDiv, message_20);
            },
            renderOfflineChatBubble = (messageOrText, isUser = true, options_6 = {}) => {
                const contentArea_5 = document.getElementById('offline-chat-content');
                if (!contentArea_5) return null;
                const friend_11 = window.imData.currentActiveFriend;
                if (!options_6.skipTheme) applyOfflineChatTheme_2(friend_11);
                const rawMessage =
                        messageOrText && typeof messageOrText === 'object'
                            ? messageOrText
                            : {
                                  role: isUser ? 'user' : 'assistant',
                                  content: String(messageOrText || ''),
                                  timestamp: Date.now(),
                              },
                    message_21 = {
                        id:
                            rawMessage.id ||
                            createOfflineChatId(
                                rawMessage.role === 'assistant' ? 'offline-ai' : 'offline-user',
                            ),
                        role: rawMessage.role === 'assistant' ? 'assistant' : 'user',
                        type: rawMessage.type || '',
                        content: String(rawMessage.content || ''),
                        reasoning:
                            rawMessage.role === 'assistant'
                                ? String(rawMessage.reasoning || '')
                                : '',
                        timestamp: Number(rawMessage.timestamp) || Date.now(),
                        tokens: Number(rawMessage.tokens) || 0,
                        imageUrl: String(rawMessage.imageUrl || '').trim(),
                        sourceMessageId: String(rawMessage.sourceMessageId || '').trim(),
                        imageProvider: String(rawMessage.imageProvider || '').trim(),
                        imageModel: String(rawMessage.imageModel || '').trim(),
                        imageSize: String(rawMessage.imageSize || '').trim(),
                        faceReferenceUsed: rawMessage.faceReferenceUsed === true,
                        generationState: ['failed', 'truncated'].includes(
                            String(rawMessage.generationState || ''),
                        )
                            ? String(rawMessage.generationState)
                            : undefined,
                        continuationState:
                            rawMessage.continuationState === 'available' ? 'available' : undefined,
                    };
                isUser = message_21.role === 'user';
                const isAutoImage_2 = isOfflineAutoImageMessage(message_21),
                    offlineUserProfile = handleAction_27(friend_11),
                    userName_3 = isUser
                        ? offlineUserProfile.name
                        : friend_11?.nickname || friend_11?.realName || 'TA',
                    userSign = isUser ? offlineUserProfile.signature : friend_11?.signature || '',
                    userAvatar = isUser ? offlineUserProfile.avatarUrl : friend_11?.avatarUrl || '',
                    floor_3 = Number(options_6.floor) || 1,
                    value_1063 = Number.isInteger(Number(options_6.depth))
                        ? Number(options_6.depth)
                        : 0,
                    isReadOnly = !!options_6.readOnly,
                    actionsDisabled_2 = isReadOnly || !!options_6.actionsDisabled,
                    enableBarrage_3 = !isUser && isOfflineBarragePromptEnabled(friend_11),
                    enableChoices_3 = !isUser && isOfflineChoicesPromptEnabled(friend_11),
                    timeText = formatOfflineBubbleTime(message_21.timestamp),
                    value_1069 = isAutoImage_2
                        ? '图片 · ' + timeText
                        : isUser
                          ? '#' +
                            floor_3 +
                            ' · ' +
                            countOfflineTextCharacters(message_21.content) +
                            '字 · ' +
                            timeText
                          : '#' +
                            floor_3 +
                            ' · ' +
                            (message_21.tokens || estimateOfflineTextTokens(message_21.content)) +
                            ' tokens · ' +
                            timeText,
                    bubbleDiv_3 = document.createElement('div');
                bubbleDiv_3.className = 'offline-chat-bubble ' + (isUser ? 'user' : 'ai');
                bubbleDiv_3.setAttribute('data-message-id', message_21.id);
                bubbleDiv_3.setAttribute('data-floor', String(floor_3));
                let text_1071 =
                    '<div class="offline-chat-avatar"><i class="fas fa-user"></i></div>';
                userAvatar &&
                    (text_1071 =
                        '<div class="offline-chat-avatar"><img src="' +
                        escapeSheetHtml(userAvatar) +
                        '" alt="avatar"></div>');
                const parsedMessage =
                        !isUser && !isAutoImage_2 && offlineReasoning
                            ? offlineReasoning.normalizeResponse(
                                  message_21.content,
                                  message_21.reasoning,
                              )
                            : {
                                  content: String(message_21.content || ''),
                                  reasoning: '',
                              },
                    rawThinking = parsedMessage.reasoning,
                    content_8 = value_218(parsedMessage.content, message_21.role, value_1063),
                    value_220_1075 = value_220(parsedMessage.content, message_21.role, value_1063, {
                        messageId: message_21.id,
                        enableVoice: !isUser && isTtsEnabledForFriend(friend_11),
                        enableBarrage: enableBarrage_3,
                        enableChoices: enableChoices_3,
                        enableRecap: !isUser,
                        language: friend_11?.language || 'zh',
                    }),
                    displayThinking = rawThinking
                        ? buildOfflineThinkingHtml(rawThinking, false)
                        : '',
                    offlineChatActionButtonsHtml = getOfflineChatActionButtonsHtml(
                        isUser,
                        actionsDisabled_2,
                        message_21,
                    ),
                    match_1077 = String(message_21.imageSize || '').match(
                        /(\d{2,5})\s*[x×]\s*(\d{2,5})/i,
                    ),
                    value_1078 = match_1077
                        ? Number(match_1077[1]) + ' / ' + Number(match_1077[2])
                        : '1 / 1',
                    value_1079 = isAutoImage_2
                        ? '<figure class="offline-chat-generated-image"><img src="' +
                          escapeSheetHtml(message_21.imageUrl) +
                          '" alt="' +
                          escapeSheetHtml(message_21.content || '线下剧情图片') +
                          '" loading="lazy" decoding="async" style="--offline-generated-image-ratio: ' +
                          value_1078 +
                          ';"><figcaption>' +
                          escapeSheetHtml(message_21.content || '线下剧情图片') +
                          '</figcaption></figure>'
                        : '';
                bubbleDiv_3.innerHTML =
                    `
                <div class="offline-chat-bubble-header">
                    ` +
                    text_1071 +
                    `
                    <div class="offline-chat-name-container">
                        <span class="offline-chat-name">` +
                    escapeSheetHtml(userName_3) +
                    `</span>
                    </div>
                    ` +
                    (userSign
                        ? '<div class="offline-chat-sign">' + escapeSheetHtml(userSign) + '</div>'
                        : '') +
                    `
                </div>
                <div class="offline-chat-bubble-body">
                    ` +
                    (isAutoImage_2 ? value_1079 : displayThinking) +
                    `
                    ` +
                    (isAutoImage_2
                        ? ''
                        : '<div class="offline-chat-bubble-text" ' +
                          (value_220_1075 ? '' : 'style="display:none;"') +
                          '>' +
                          value_220_1075 +
                          '</div>') +
                    `
                    <div class="offline-chat-bubble-footer">
                        <div class="offline-chat-bubble-meta">` +
                    escapeSheetHtml(value_1069) +
                    `</div>
                        ` +
                    offlineChatActionButtonsHtml +
                    `
                    </div>
                </div>
            `;
                if (!isAutoImage_2) bindOfflineThinkingToggle(bubbleDiv_3);
                bindOfflineChatBubbleActions(bubbleDiv_3, message_21);
                if (!isAutoImage_2)
                    bindOfflineChatTextControls(
                        bubbleDiv_3,
                        {
                            ...message_21,
                            content: content_8,
                            reasoning: rawThinking || undefined,
                        },
                        friend_11,
                        floor_3,
                    );
                const container_3 = options_6.container || contentArea_5;
                container_3.appendChild(bubbleDiv_3);
                if (options_6.scroll !== false && container_3 === contentArea_5)
                    scrollOfflineChatToBottom(contentArea_5);
                return bubbleDiv_3;
            },
            createStreamingBubble = (content_9 = '', isUser_2 = false, options_7 = {}) => {
                const message_22 = {
                        id:
                            options_7.id ||
                            createOfflineChatId(isUser_2 ? 'offline-user' : 'offline-ai'),
                        role: isUser_2 ? 'user' : 'assistant',
                        content: content_9,
                        reasoning: options_7.reasoning || '',
                        timestamp: options_7.timestamp || Date.now(),
                        tokens: options_7.tokens || 0,
                    },
                    bubbleDiv_4 = renderOfflineChatBubble(message_22, isUser_2, {
                        floor: options_7.floor,
                        depth: options_7.depth,
                        actionsDisabled: true,
                    });
                if (!bubbleDiv_4) return null;
                let currentContent = content_9,
                    currentNativeReasoning = String(options_7.reasoning || ''),
                    lastVisibleReasoning = String(options_7.reasoning || '').trim(),
                    generationFinished = false,
                    renderFrameId = null,
                    renderTimerId = null,
                    lastRenderAt = 0;
                const cancelPendingRender = () => {
                        renderFrameId !== null &&
                            typeof window.cancelAnimationFrame === 'function' &&
                            window.cancelAnimationFrame(renderFrameId);
                        if (renderTimerId !== null) clearTimeout(renderTimerId);
                        renderFrameId = null;
                        renderTimerId = null;
                    },
                    renderStreamingState = () => {
                        const currentParsed = offlineReasoning
                            ? offlineReasoning.normalizeResponse(
                                  currentContent,
                                  currentNativeReasoning,
                                  {
                                      streaming: !generationFinished,
                                  },
                              )
                            : {
                                  content: currentContent,
                                  reasoning: currentNativeReasoning,
                                  incomplete: false,
                              };
                        String(currentParsed.reasoning || '').trim() &&
                            (lastVisibleReasoning = String(currentParsed.reasoning).trim());
                        const parsed_5 =
                                lastVisibleReasoning &&
                                !String(currentParsed.reasoning || '').trim()
                                    ? {
                                          ...currentParsed,
                                          reasoning: lastVisibleReasoning,
                                      }
                                    : currentParsed,
                            currentActiveFriend_1089 = window.imData.currentActiveFriend,
                            value_1090 = Number.isInteger(Number(options_7.depth))
                                ? Number(options_7.depth)
                                : 0,
                            finalDisplayContent = splitOfflineAutoImageMarker(
                                parsed_5.content,
                            ).content,
                            textContent_8 = generationFinished
                                ? value_218(finalDisplayContent, message_22.role, value_1090)
                                : value_215(finalDisplayContent, message_22.role, value_1090);
                        renderOfflineThinkingState(bubbleDiv_4, parsed_5.reasoning, {
                            expanded: !generationFinished,
                        });
                        const textEl_2 = bubbleDiv_4.querySelector('.offline-chat-bubble-text');
                        textEl_2 &&
                            (textContent_8
                                ? ((textEl_2.style.display = ''),
                                  textEl_2.classList.toggle('is-streaming', !generationFinished),
                                  generationFinished
                                      ? ((textEl_2.innerHTML = value_220(
                                            finalDisplayContent,
                                            message_22.role,
                                            value_1090,
                                            {
                                                messageId: message_22.id,
                                                enableVoice:
                                                    !isUser_2 &&
                                                    isTtsEnabledForFriend(currentActiveFriend_1089),
                                                enableBarrage:
                                                    !isUser_2 &&
                                                    isOfflineBarragePromptEnabled(
                                                        currentActiveFriend_1089,
                                                    ),
                                                enableChoices:
                                                    !isUser_2 &&
                                                    isOfflineChoicesPromptEnabled(
                                                        currentActiveFriend_1089,
                                                    ),
                                                enableRecap: !isUser_2,
                                                language:
                                                    currentActiveFriend_1089?.language || 'zh',
                                            },
                                        )),
                                        bindOfflineChatTextControls(
                                            bubbleDiv_4,
                                            {
                                                ...message_22,
                                                content: textContent_8,
                                                reasoning: parsed_5.reasoning,
                                            },
                                            currentActiveFriend_1089,
                                            Number(options_7.floor) || 1,
                                        ))
                                      : (textEl_2.textContent = textContent_8))
                                : ((textEl_2.innerHTML = ''), (textEl_2.style.display = 'none')));
                        if (generationFinished) value_270.settle();
                        else value_270.refresh();
                        return parsed_5;
                    },
                    value_1086 = () => {
                        if (renderFrameId !== null || renderTimerId !== null) return;
                        const queueFrame = () => {
                                renderTimerId = null;
                                const render_6 = () => {
                                    renderFrameId = null;
                                    renderTimerId = null;
                                    lastRenderAt = Date.now();
                                    renderStreamingState();
                                };
                                typeof window.requestAnimationFrame === 'function'
                                    ? (renderFrameId = window.requestAnimationFrame(render_6))
                                    : (renderTimerId = setTimeout(render_6, 0));
                            },
                            delay = Math.max(
                                0,
                                OFFLINE_STREAM_RENDER_INTERVAL - (Date.now() - lastRenderAt),
                            );
                        if (delay > 0) renderTimerId = setTimeout(queueFrame, delay);
                        else queueFrame();
                    };
                return {
                    appendContentChunk: (value_1096) => {
                        currentContent += String(value_1096 || '');
                        value_1086();
                    },
                    appendReasoningChunk: (value_1097) => {
                        currentNativeReasoning += String(value_1097 || '');
                        value_1086();
                    },
                    appendChunk: (value_1098) => {
                        currentContent += String(value_1098 || '');
                        value_1086();
                    },
                    finish: () => {
                        generationFinished = true;
                        cancelPendingRender();
                        const parsed_6 = renderStreamingState();
                        return lastVisibleReasoning && !String(parsed_6.reasoning || '').trim()
                            ? {
                                  ...parsed_6,
                                  reasoning: lastVisibleReasoning,
                              }
                            : parsed_6;
                    },
                    setTokens: (value_1100) => {
                        const max_1101 = Math.max(0, Number(value_1100) || 0),
                            metaEl = bubbleDiv_4.querySelector('.offline-chat-bubble-meta');
                        metaEl &&
                            (metaEl.textContent =
                                '#' +
                                (Number(options_7.floor) || 1) +
                                ' · ' +
                                (max_1101 || estimateOfflineTextTokens(currentContent)) +
                                ' tokens · ' +
                                formatOfflineBubbleTime(message_22.timestamp));
                    },
                    enableActions: (finalMessage) =>
                        enableOfflineChatBubbleActions(bubbleDiv_4, finalMessage || message_22),
                    getResult: () => {
                        const parsed_7 = offlineReasoning
                            ? offlineReasoning.normalizeResponse(
                                  currentContent,
                                  currentNativeReasoning,
                              )
                            : {
                                  content: currentContent,
                                  reasoning: currentNativeReasoning,
                              };
                        return lastVisibleReasoning && !String(parsed_7.reasoning || '').trim()
                            ? {
                                  ...parsed_7,
                                  reasoning: lastVisibleReasoning,
                              }
                            : parsed_7;
                    },
                    getFullText: () => currentContent,
                    reset: () => {
                        currentContent = '';
                        currentNativeReasoning = '';
                        lastVisibleReasoning = '';
                        generationFinished = false;
                        cancelPendingRender();
                        renderStreamingState();
                    },
                };
            },
            persistOfflineMessages = async (activeFriend_25, value_1104, value_1105 = {}) => {
                if (!activeFriend_25) return [];
                const offlineMessages_3 = cloneOfflineMeetingMessages(value_1104),
                    saved_10 = window.imApp?.commitFriendMetaPatch
                        ? await window.imApp.commitFriendMetaPatch(
                              activeFriend_25.id,
                              {
                                  offlineMessages: offlineMessages_3,
                              },
                              {
                                  silent: true,
                              },
                          )
                        : await commitSheetFriendChange(
                              activeFriend_25.id,
                              (targetFriend_11) => {
                                  targetFriend_11.offlineMessages = offlineMessages_3;
                              },
                              {
                                  silent: true,
                                  metaOnly: true,
                              },
                          );
                if (!saved_10) throw new Error('Failed to persist offline meeting messages');
                return offlineMessages_3;
            };
        async function generateOfflineAutoImage(
            activeFriend_26,
            value_1110,
            scene_3,
            value_1112 = null,
        ) {
            const liveFriend =
                window.imApp?.getFriendById?.(activeFriend_26?.id) || activeFriend_26;
            if (!shouldAutoGenerateOfflineImage(liveFriend) || !String(scene_3 || '').trim())
                return null;
            if (!window.imChat?.generateChatImage)
                return (window.showToast?.('线下剧情已保留，但生图功能尚未加载'), null);
            if (window.imChat.isChatImageGenerationRunning?.(liveFriend.id))
                return (window.showToast?.('线下剧情已保留，当前聊天已有图片正在生成'), null);
            const value_1114 = liveFriend.imagePromptConfig || {},
                imageGenerationPrompt_2 = value_35(scene_3);
            if (!imageGenerationPrompt_2) return null;
            try {
                window.showToast?.('线下剧情图片开始生成…');
                const referenceImage_2 =
                        await window.imChat.resolveAutoImageReferenceFace(liveFriend),
                    result_4 = await window.imChat.generateChatImage(
                        imageGenerationPrompt_2,
                        liveFriend,
                        {
                            referenceImage: referenceImage_2,
                            basePrompt: value_1114.basePrompt || value_1114.lastPrompt || '',
                            charAppearance: value_1114.charAppearance || '',
                            userAppearance: value_1114.userAppearance || '',
                            artistPrompt: value_1114.artistPrompt || '',
                            negativePrompt: value_1114.negativePrompt || '',
                        },
                    );
                if (!result_4?.imageUrl) throw new Error('image_generation_empty');
                const value_1118 = window.imApp?.getFriendById?.(liveFriend.id) || liveFriend,
                    value_221_1119 = value_221(value_1118),
                    sourceIndex = value_221_1119.findIndex(
                        (value_1123) => String(value_1123.id) === String(value_1110),
                    );
                if (sourceIndex < 0) return null;
                const imageMessage = {
                        id: createOfflineChatId('offline-image'),
                        role: 'assistant',
                        type: type_2,
                        content: String(scene_3).trim(),
                        imageUrl: result_4.imageUrl,
                        sourceMessageId: String(value_1110),
                        imageProvider: result_4.provider || '',
                        imageModel: result_4.model || '',
                        imageSize: result_4.size || '',
                        faceReferenceUsed: result_4.faceReferenceUsed === true,
                        imageGenerationPrompt: imageGenerationPrompt_2,
                        imageGenerationConfig: {
                            basePrompt: value_1114.basePrompt || value_1114.lastPrompt || '',
                            charAppearance: value_1114.charAppearance || '',
                            userAppearance: value_1114.userAppearance || '',
                            artistPrompt: value_1114.artistPrompt || '',
                            negativePrompt: value_1114.negativePrompt || '',
                            useReferenceFace: !!referenceImage_2,
                        },
                        imageGenerationCompiledPrompt: result_4.compiledPrompt || '',
                        timestamp: Date.now(),
                    },
                    nextMessages = value_221_1119.slice();
                return (
                    nextMessages.splice(sourceIndex + 1, 0, imageMessage),
                    await persistOfflineMessages(value_1118, nextMessages),
                    window.showToast?.('线下剧情图片生成完成'),
                    window.imData.currentActiveFriend &&
                        String(window.imData.currentActiveFriend.id) === String(value_1118.id) &&
                        renderOfflineCurrentMessages(value_1118, {
                            scroll: true,
                            preserveScroll: false,
                        }),
                    imageMessage
                );
            } catch (error_7) {
                return (
                    console.error('Offline automatic image generation failed', error_7),
                    window.showToast?.('线下剧情图片生成失败，文字剧情已保留'),
                    null
                );
            }
        }
        const value_279 = async (activeFriend_27) => {
                if (!activeFriend_27) return null;
                const needsNewSession =
                    activeFriend_27.offlineMeetingActive !== true ||
                    !activeFriend_27.offlineCurrentSessionId;
                if (needsNewSession) {
                    normalizeOfflineMeetingSessions(activeFriend_27);
                    value_221(activeFriend_27);
                    const now_3 = Date.now(),
                        offlineCurrentSessionId_2 =
                            activeFriend_27.offlineCurrentSessionId ||
                            createOfflineChatId('offline-session'),
                        offlineMeetingStartedAt_2 =
                            Number(activeFriend_27.offlineMeetingStartedAt) || now_3,
                        offlineMessages_4 = Array.isArray(activeFriend_27.offlineMessages)
                            ? activeFriend_27.offlineMessages
                            : [],
                        saved_11 = window.imApp?.commitFriendMetaPatch
                            ? await window.imApp.commitFriendMetaPatch(
                                  activeFriend_27.id,
                                  {
                                      offlineMeetingActive: true,
                                      offlineCurrentSessionId: offlineCurrentSessionId_2,
                                      offlineMeetingStartedAt: offlineMeetingStartedAt_2,
                                      offlineMessages: offlineMessages_4,
                                  },
                                  {
                                      silent: true,
                                  },
                              )
                            : await commitSheetFriendChange(
                                  activeFriend_27.id,
                                  (targetFriend_12) => {
                                      targetFriend_12.offlineMeetingActive = true;
                                      targetFriend_12.offlineCurrentSessionId =
                                          offlineCurrentSessionId_2;
                                      targetFriend_12.offlineMeetingStartedAt =
                                          offlineMeetingStartedAt_2;
                                      targetFriend_12.offlineMessages = offlineMessages_4;
                                  },
                                  {
                                      silent: true,
                                      metaOnly: true,
                                  },
                              );
                    if (!saved_11) throw new Error('Failed to persist offline meeting state');
                    const value_1132 =
                        window.imApp?.getFriendById?.(activeFriend_27.id) || activeFriend_27;
                    await value_225(value_1132);
                }
                const latestFriend_5 =
                    window.imApp?.getFriendById?.(activeFriend_27.id) || activeFriend_27;
                return latestFriend_5.offlineCurrentSessionId;
            },
            value_280 = (element_1134, value_1135) => {
                const sessions_2 = normalizeOfflineMeetingSessions(value_1135);
                if (sessions_2.length === 0) return;
                const button_6 = document.createElement('button');
                button_6.type = 'button';
                button_6.className = 'offline-chat-history-card';
                button_6.innerHTML = '<i class="fas fa-history"></i><span>查看历史见面</span>';
                button_6.addEventListener('click', () => handleAction_285(value_1135));
                element_1134.appendChild(button_6);
            },
            value_281 = (value_1138, value_1139) => {
                const length_1140 = value_1138.length,
                    max_1141 = Math.max(0, length_1140 - count_8);
                if (!Number.isFinite(value_1139)) return max_1141;
                return Math.max(0, Math.min(Math.floor(value_1139), max_1141));
            },
            renderOfflineParagraphText_2 = (
                summaryMessage_2,
                value_1143,
                value_1144,
                value_1145 = {},
            ) => {
                const friendId_3 = String(summaryMessage_2?.id || ''),
                    _offlineHistoryState_1147 = value_1143?._offlineHistoryState,
                    value_1148 = value_1145.resetWindow
                        ? undefined
                        : Number.isFinite(value_1145.visibleStartFloor)
                          ? value_1145.visibleStartFloor
                          : _offlineHistoryState_1147?.friendId === friendId_3
                            ? _offlineHistoryState_1147.visibleStartFloor
                            : undefined,
                    _offlineHistoryState_2 = {
                        friendId: friendId_3,
                        totalFloors: value_1144.length,
                        visibleStartFloor: value_281(value_1144, value_1148),
                    };
                if (value_1143) value_1143._offlineHistoryState = _offlineHistoryState_2;
                return _offlineHistoryState_2;
            },
            value_283 = (element_1150, value_1151, value_1152) => {
                if (!element_1150 || !value_1151 || value_1152.visibleStartFloor <= 0) return;
                const element_1153 = document.createElement('div');
                element_1153.className = 'offline-chat-floor-loader';
                const element_1154 = document.createElement('button');
                element_1154.type = 'button';
                element_1154.className = 'offline-chat-load-more-floors';
                element_1154.textContent = '查看更早楼层';
                const element_1155 = document.createElement('span');
                element_1155.className = 'offline-chat-load-more-floor-count';
                element_1155.textContent = '还有 ' + value_1152.visibleStartFloor + ' 楼';
                element_1153.append(element_1154, element_1155);
                element_1154.addEventListener('click', () => {
                    const offlineChatContentElement_1156 =
                            document.getElementById('offline-chat-content'),
                        value_1157 = window.imApp?.getFriendById?.(value_1151.id) || value_1151;
                    if (!offlineChatContentElement_1156 || !value_1157) return;
                    const value_221_1158 = value_221(value_1157),
                        value_209_1159 = getOfflineUnarchivedDialogueRows(value_221_1158),
                        value_282_1160 = renderOfflineParagraphText_2(
                            value_1157,
                            offlineChatContentElement_1156,
                            value_209_1159,
                        ),
                        visibleStartFloor_2 = Math.max(
                            0,
                            value_282_1160.visibleStartFloor - count_9,
                        ),
                        scrollHeight_1162 = offlineChatContentElement_1156.scrollHeight,
                        scrollTop_1163 = offlineChatContentElement_1156.scrollTop;
                    renderOfflineCurrentMessages(value_1157, {
                        visibleStartFloor: visibleStartFloor_2,
                        scroll: false,
                        preserveScroll: false,
                    });
                    offlineChatContentElement_1156.scrollTop =
                        scrollTop_1163 +
                        Math.max(
                            0,
                            offlineChatContentElement_1156.scrollHeight - scrollHeight_1162,
                        );
                });
                element_1150.appendChild(element_1153);
            },
            getOfflineSummaryShortTermMemory = (activeFriend_28, summaryId_2) => {
                const sourceId_2 = String(summaryId_2 || '');
                if (!sourceId_2) return null;
                const entries_2 = Array.isArray(activeFriend_28?.memory?.shortTermEntries)
                    ? activeFriend_28.memory.shortTermEntries
                    : [];
                return (
                    entries_2.find(
                        (entry_3) =>
                            String(entry_3?.sourceType || '') === 'offline_segment_summary' &&
                            String(entry_3?.sourceId || '') === sourceId_2,
                    ) || null
                );
            },
            addOfflineSummaryToShortTermMemory = async (activeFriend_29, summaryMessage_3) => {
                const sourceId_3 = String(summaryMessage_3?.id || ''),
                    trim_1172 = String(summaryMessage_3?.content || '').trim();
                if (!activeFriend_29?.id || !sourceId_3 || !trim_1172)
                    throw new Error('Offline summary is unavailable');
                if (typeof window.imApp?.applyGeneratedShortTermMemory !== 'function')
                    throw new Error('Short-term memory service is unavailable');
                const startFloor = Math.max(1, Number(summaryMessage_3.sourceFloorStart) || 1),
                    endFloor = Math.max(
                        startFloor,
                        Number(summaryMessage_3.sourceFloorEnd) || startFloor,
                    ),
                    now_4 = Number(summaryMessage_3.timestamp) || Date.now();
                let savedMemory = null;
                const saved_12 = await commitSheetFriendChange(
                    activeFriend_29.id,
                    (value_1178) => {
                        savedMemory = window.imApp.applyGeneratedShortTermMemory(
                            value_1178,
                            {
                                id: 'offline-summary-memory-' + sourceId_3,
                                title: '线下总结 ' + startFloor + '-' + endFloor + '楼',
                                time: formatOfflineMeetingDate(now_4),
                                event: trim_1172,
                                memoryPoints:
                                    '线下见面第 ' + startFloor + '-' + endFloor + ' 楼的分段总结',
                                memoryTags: ['线下见面', '线下总结'],
                                triggerKeywords: ['线下见面', '线下总结'],
                                raw: trim_1172,
                                sourceType: 'offline_segment_summary',
                                sourceId: sourceId_3,
                            },
                            {
                                now: now_4,
                                updateSummaryCursor: false,
                            },
                        );
                        window.imApp.clearFriendRuntimeMessageContext?.(value_1178);
                    },
                    {
                        silent: true,
                        metaOnly: true,
                    },
                );
                if (!saved_12 || !savedMemory)
                    throw new Error('Failed to save offline summary memory');
                return (
                    window.dispatchEvent?.(
                        new CustomEvent('u2:memory-entries-updated', {
                            detail: {
                                friendId: String(activeFriend_29.id),
                                action: 'create',
                                sourceType: 'offline_segment_summary',
                                sourceId: sourceId_3,
                            },
                        }),
                    ),
                    savedMemory
                );
            },
            renderOfflineSummaryCard = (
                container_4,
                activeFriend_30,
                summaryMessage_4,
                value_1182,
            ) => {
                if (!container_4 || !summaryMessage_4) return null;
                const sourceRows = getOfflineSummarySourceMessages(value_1182, summaryMessage_4),
                    startFloor_2 =
                        Number(summaryMessage_4.sourceFloorStart) || sourceRows[0]?.floor || 1,
                    endFloor_2 =
                        Number(summaryMessage_4.sourceFloorEnd) ||
                        sourceRows[sourceRows.length - 1]?.floor ||
                        startFloor_2,
                    value_292_1186 = getOfflineIdentityContext(activeFriend_30),
                    existingMemory = getOfflineSummaryShortTermMemory(
                        activeFriend_30,
                        summaryMessage_4.id,
                    ),
                    join_1188 = sourceRows.map(({ message: message_39, floor: floor_6 }) => {
                        const value_1192 =
                            message_39.role === 'assistant'
                                ? value_292_1186.charName
                                : value_292_1186.userName;
                        return (
                            '#' +
                            floor_6 +
                            ' ' +
                            value_1192 +
                            '：' +
                            stripOfflineDecorativeMarkup(message_39.content)
                        );
                    }).join(`

`),
                    card_2 = document.createElement('details');
                card_2.className = 'offline-chat-summary-card';
                card_2.setAttribute('data-summary-id', String(summaryMessage_4.id || ''));
                card_2.innerHTML =
                    `
                <summary class="offline-chat-summary-card-head">
                    <span><i class="fas fa-file-lines"></i> 线下总结</span>
                    <small>第 ` +
                    startFloor_2 +
                    '–' +
                    endFloor_2 +
                    ` 楼 · 已归档</small>
                </summary>
                <div class="offline-chat-summary-card-content">` +
                    escapeSheetHtml(summaryMessage_4.content || '').replace(/\n/g, '<br>') +
                    `</div>
                <div class="offline-chat-summary-memory-action">
                    <button type="button" class="offline-chat-summary-memory-btn" ` +
                    (existingMemory ? 'disabled' : '') +
                    '>' +
                    (existingMemory ? '已加入短期记忆' : '加入短期记忆') +
                    `</button>
                </div>
                <details class="offline-chat-summary-source">
                    <summary>查看已归档原楼层（不会再作为上下文）</summary>
                    <div>` +
                    (join_1188
                        ? escapeSheetHtml(join_1188).replace(/\n/g, '<br>')
                        : '原楼层不可用') +
                    `</div>
                </details>
            `;
                const memoryButton = card_2.querySelector('.offline-chat-summary-memory-btn');
                return (
                    memoryButton &&
                        !existingMemory &&
                        memoryButton.addEventListener('click', async () => {
                            if (memoryButton.disabled) return;
                            memoryButton.disabled = true;
                            try {
                                await addOfflineSummaryToShortTermMemory(
                                    activeFriend_30,
                                    summaryMessage_4,
                                );
                                memoryButton.textContent = '已加入短期记忆';
                                if (window.showToast) window.showToast('已加入线上短期记忆');
                            } catch (error_8) {
                                console.error(
                                    'Failed to add offline summary to short-term memory',
                                    error_8,
                                );
                                memoryButton.disabled = false;
                                if (window.showToast) window.showToast('加入短期记忆失败，请重试');
                            }
                        }),
                    container_4.appendChild(card_2),
                    card_2
                );
            };
        function renderOfflineCurrentMessages(value_1194, value_1195 = {}) {
            const offlineChatContentElement_1196 = document.getElementById('offline-chat-content');
            if (!offlineChatContentElement_1196 || !value_1194) return;
            offlineChatContentElement_1196.dataset.offlineChatMode = 'current';
            value_272(offlineChatContentElement_1196);
            const value_1197 =
                    value_1195.preserveScroll === true ||
                    (value_1195.preserveScroll !== false &&
                        offlineChatContentElement_1196.children.length > 0 &&
                        value_1195.scroll !== true),
                value_1198 = value_1197 ? value_273(offlineChatContentElement_1196) : null,
                preserve_1199 = value_270.preserve(offlineChatContentElement_1196);
            offlineChatContentElement_1196.innerHTML = '';
            const offlineChatViewOfflineChatTitleElement = document.querySelector(
                '#offline-chat-view .offline-chat-title',
            );
            if (offlineChatViewOfflineChatTitleElement)
                offlineChatViewOfflineChatTitleElement.textContent = '线下';
            applyOfflineChatTheme_2(value_1194);
            const documentFragment = document.createDocumentFragment();
            value_280(documentFragment, value_1194);
            const messages_9 = value_221(value_1194),
                value_209_1201 = getOfflineUnarchivedDialogueRows(messages_9),
                paragraphHtml_3 = renderOfflineParagraphText_2(
                    value_1194,
                    offlineChatContentElement_1196,
                    value_209_1201,
                    value_1195,
                ),
                selectedIds_2 = new Set(
                    value_209_1201
                        .slice(paragraphHtml_3.visibleStartFloor)
                        .map((value_1205) => String(value_1205.message?.id || '')),
                ),
                value_1204 = new Map(
                    value_209_1201.map((value_1206, value_1207) => [
                        String(value_1206.message.id || ''),
                        value_1207,
                    ]),
                );
            value_283(documentFragment, value_1194, paragraphHtml_3);
            messages_9.forEach((message_23) => {
                if (isOfflineSummaryMessage(message_23)) {
                    renderOfflineSummaryCard(documentFragment, value_1194, message_23, messages_9);
                    return;
                }
                if (message_23.archivedBySummaryId) return;
                const sessionId_6 = String(message_23.id || '');
                if (isOfflineAutoImageMessage(message_23)) {
                    if (!selectedIds_2.has(String(message_23.sourceMessageId || ''))) return;
                } else {
                    if (!selectedIds_2.has(sessionId_6)) return;
                }
                const rowIndex_2 = value_1204.get(String(message_23.id || ''));
                renderOfflineChatBubble(message_23, message_23.role === 'user', {
                    floor: getOfflineMessageFloor(messages_9, message_23.id),
                    depth: rowIndex_2 == null ? 0 : value_209_1201.length - 1 - rowIndex_2,
                    container: documentFragment,
                    scroll: false,
                    skipTheme: true,
                });
            });
            if (
                messages_9.length === 0 &&
                normalizeOfflineMeetingSessions(value_1194).length === 0
            ) {
                const placeholder_2 = document.createElement('div');
                placeholder_2.className = 'offline-chat-placeholder';
                placeholder_2.textContent = '开始一次线下见面';
                documentFragment.appendChild(placeholder_2);
            }
            offlineChatContentElement_1196.appendChild(documentFragment);
            value_270.restore(offlineChatContentElement_1196, preserve_1199, {
                force: !value_1198 && value_1195.scroll !== false,
            });
            if (isOfflineAutoImageMessage_2(value_1194))
                buildOfflineThinkingHtml_2(value_1194, true);
            if (value_1198) value_274(offlineChatContentElement_1196, value_1198);
            else {
                if (value_1195.scroll !== false)
                    scrollOfflineChatToBottom(offlineChatContentElement_1196);
            }
        }
        function handleAction_285(activeFriend_31) {
            const contentArea_6 = document.getElementById('offline-chat-content');
            if (!contentArea_6 || !activeFriend_31) return;
            contentArea_6.dataset.offlineChatMode = 'history';
            value_269(contentArea_6, {
                following: true,
            });
            const sessions_3 = normalizeOfflineMeetingSessions(activeFriend_31)
                .slice()
                .sort((a_4, b_4) => Number(b_4.endedAt) - Number(a_4.endedAt));
            contentArea_6.innerHTML = '';
            const titleEl = document.querySelector('#offline-chat-view .offline-chat-title');
            if (titleEl) titleEl.textContent = '历史见面';
            const backBtn = document.createElement('button');
            backBtn.type = 'button';
            backBtn.className = 'offline-chat-history-back';
            backBtn.innerHTML = '<i class="fas fa-chevron-left"></i> 返回当前见面';
            backBtn.addEventListener('click', () => renderOfflineCurrentMessages(activeFriend_31));
            contentArea_6.appendChild(backBtn);
            if (sessions_3.length === 0) {
                const placeholder_3 = document.createElement('div');
                placeholder_3.className = 'offline-chat-placeholder';
                placeholder_3.textContent = '还没有历史见面';
                contentArea_6.appendChild(placeholder_3);
                return;
            }
            sessions_3.forEach((session_7) => {
                const card_3 = document.createElement('div');
                card_3.className = 'offline-chat-history-session';
                card_3.setAttribute('role', 'button');
                card_3.tabIndex = 0;
                const trim_1222 = String(session_7.summary || session_7.rawSummary || '').trim();
                card_3.innerHTML =
                    `
                    <button type="button" class="offline-chat-history-delete" aria-label="删除见面记录" title="删除见面记录"><i class="fas fa-trash"></i></button>
                    <div class="offline-chat-history-title">` +
                    escapeSheetHtml(session_7.title || '见面记录') +
                    `</div>
                    <div class="offline-chat-history-meta">` +
                    escapeSheetHtml(
                        session_7.dateText || formatOfflineMeetingDate(session_7.endedAt),
                    ) +
                    ' · ' +
                    session_7.messages.length +
                    ` 楼</div>
                    ` +
                    (trim_1222
                        ? '<div class="offline-chat-history-summary">' +
                          escapeSheetHtml(trim_1222) +
                          '</div>'
                        : '') +
                    `
                `;
                const openSession = () =>
                    renderOfflineHistoricalSession(activeFriend_31, session_7);
                card_3.addEventListener('click', (event_9) => {
                    const targetEl = event_9.target instanceof Element ? event_9.target : null;
                    if (targetEl?.closest('.offline-chat-history-delete')) return;
                    openSession();
                });
                card_3.addEventListener('keydown', (event_1224) => {
                    const value_1225 =
                        event_1224.target instanceof Element ? event_1224.target : null;
                    if (value_1225?.closest('.offline-chat-history-delete')) return;
                    (event_1224.key === 'Enter' || event_1224.key === ' ') &&
                        (event_1224.preventDefault(), openSession());
                });
                const deleteBtn = card_3.querySelector('.offline-chat-history-delete');
                deleteBtn &&
                    deleteBtn.addEventListener('click', (event_10) => {
                        event_10.preventDefault();
                        event_10.stopPropagation();
                        confirmDeleteOfflineMeetingSession(activeFriend_31, session_7, deleteBtn);
                    });
                contentArea_6.appendChild(card_3);
            });
        }
        function handleAction_286(activeFriend_32, session_8) {
            const offlineChatContentElement_1229 = document.getElementById('offline-chat-content');
            if (!offlineChatContentElement_1229 || !session_8) return;
            const card_4 = document.createElement('div');
            card_4.className = 'offline-chat-history-detail-summary';
            const trim_1231 = String(session_8.summary || session_8.rawSummary || '').trim();
            card_4.innerHTML =
                `
                <div class="offline-chat-history-detail-summary-head">
                    <div>
                        <div class="offline-chat-history-detail-summary-title">见面总结</div>
                        <div class="offline-chat-history-detail-summary-meta">` +
                escapeSheetHtml(session_8.dateText || formatOfflineMeetingDate(session_8.endedAt)) +
                `</div>
                    </div>
                    <button type="button" class="offline-chat-history-summary-edit" aria-label="编辑总结" title="编辑总结"><i class="fas fa-pen"></i></button>
                </div>
                <div class="offline-chat-history-detail-summary-text">` +
                (trim_1231 ? escapeSheetHtml(trim_1231) : '暂无总结') +
                `</div>
                <textarea class="offline-chat-history-summary-textarea" aria-label="见面总结">` +
                escapeSheetHtml(trim_1231) +
                `</textarea>
                <div class="offline-chat-history-summary-actions">
                    <button type="button" class="offline-chat-history-summary-cancel">取消</button>
                    <button type="button" class="offline-chat-history-summary-save">保存</button>
                </div>
            `;
            const textEl = card_4.querySelector('.offline-chat-history-detail-summary-text'),
                textarea_2 = card_4.querySelector('.offline-chat-history-summary-textarea'),
                actionsEl = card_4.querySelector('.offline-chat-history-summary-actions'),
                editBtn = card_4.querySelector('.offline-chat-history-summary-edit'),
                cancelBtn = card_4.querySelector('.offline-chat-history-summary-cancel'),
                saveBtn = card_4.querySelector('.offline-chat-history-summary-save');
            let isEditing = false;
            const setEditing = (editing_2) => {
                isEditing = editing_2;
                card_4.classList.toggle('is-editing', editing_2);
                if (textarea_2)
                    textarea_2.value = editing_2
                        ? String(session_8.summary || session_8.rawSummary || '').trim()
                        : textarea_2.value;
                if (editing_2) setTimeout(() => textarea_2?.focus(), 30);
            };
            editBtn?.addEventListener('click', () => setEditing(true));
            cancelBtn?.addEventListener('click', () => setEditing(false));
            saveBtn?.addEventListener('click', async () => {
                if (!isEditing || !textarea_2) return;
                const nextSummary = textarea_2.value.trim();
                saveBtn.disabled = true;
                cancelBtn.disabled = true;
                try {
                    const saved = await updateOfflineMeetingSessionSummary(
                        activeFriend_32,
                        session_8,
                        nextSummary,
                    );
                    if (!saved) {
                        if (window.showToast) window.showToast('总结保存失败');
                        return;
                    }
                    session_8.summary = nextSummary;
                    session_8.rawSummary = buildOfflineMeetingRawSummary(session_8, nextSummary);
                    if (textEl) textEl.textContent = nextSummary || '暂无总结';
                    setEditing(false);
                    if (window.showToast) window.showToast('总结已保存');
                } catch (error_9) {
                    console.error('Update offline meeting summary failed', error_9);
                    if (window.showToast) window.showToast('总结保存失败');
                } finally {
                    saveBtn.disabled = false;
                    cancelBtn.disabled = false;
                }
            });
            textarea_2?.addEventListener('keydown', (event_1235) => {
                if (event_1235.isComposing || event_1235.keyCode === 229) return;
                (event_1235.ctrlKey || event_1235.metaKey) &&
                    (event_1235.key === 'Enter' || event_1235.keyCode === 13) &&
                    (event_1235.preventDefault(), saveBtn?.click());
                event_1235.key === 'Escape' && (event_1235.preventDefault(), setEditing(false));
            });
            offlineChatContentElement_1229.appendChild(card_4);
        }
        function renderOfflineHistoricalSession(activeFriend_33, session_9) {
            const contentArea_7 = document.getElementById('offline-chat-content');
            if (!contentArea_7 || !session_9) return;
            contentArea_7.dataset.offlineChatMode = 'history';
            value_269(contentArea_7, {
                following: true,
            });
            contentArea_7.innerHTML = '';
            const titleEl_2 = document.querySelector('#offline-chat-view .offline-chat-title');
            if (titleEl_2) titleEl_2.textContent = session_9.title || '历史见面';
            const backBtn_2 = document.createElement('button');
            backBtn_2.type = 'button';
            backBtn_2.className = 'offline-chat-history-back';
            backBtn_2.innerHTML = '<i class="fas fa-chevron-left"></i> 返回历史见面';
            backBtn_2.addEventListener('click', () => handleAction_285(activeFriend_33));
            contentArea_7.appendChild(backBtn_2);
            const messages_10 = cloneOfflineMeetingMessages(session_9.messages || []),
                visibleRows = getOfflineUnarchivedDialogueRows(messages_10),
                visibleRowIndexById = new Map(
                    visibleRows.map((value_1242, value_1243) => [
                        String(value_1242.message.id || ''),
                        value_1243,
                    ]),
                );
            messages_10.forEach((message_24) => {
                if (isOfflineSummaryMessage(message_24)) {
                    renderOfflineSummaryCard(
                        contentArea_7,
                        activeFriend_33,
                        message_24,
                        messages_10,
                    );
                    return;
                }
                if (message_24.archivedBySummaryId) return;
                const rowIndex = visibleRowIndexById.get(String(message_24.id || ''));
                renderOfflineChatBubble(message_24, message_24.role === 'user', {
                    floor: getOfflineMessageFloor(messages_10, message_24.id),
                    depth: rowIndex == null ? 0 : visibleRows.length - 1 - rowIndex,
                    readOnly: true,
                });
            });
            handleAction_286(activeFriend_33, session_9);
            contentArea_7.scrollTop = contentArea_7.scrollHeight;
        }
        function handleAction_287() {
            let view = document.getElementById('offline-chat-barrage-view');
            if (view) return view;
            view = document.createElement('div');
            view.id = 'offline-chat-barrage-view';
            view.className = 'offline-chat-barrage-view';
            view.innerHTML = `
                <div class="offline-chat-barrage-header">
                    <button type="button" class="offline-chat-barrage-close" id="offline-chat-barrage-close-btn" aria-label="返回"><i class="fas fa-chevron-left"></i></button>
                    <div class="offline-chat-barrage-title" id="offline-chat-barrage-title">弹幕</div>
                    <div class="offline-chat-barrage-spacer"></div>
                </div>
                <div class="offline-chat-barrage-list" id="offline-chat-barrage-list"></div>
            `;
            document.body.appendChild(view);
            applyOfflineChatTheme_2(window.imData.currentActiveFriend);
            const closeBtn_2 = view.querySelector('#offline-chat-barrage-close-btn');
            return (
                closeBtn_2 &&
                    closeBtn_2.addEventListener('click', () => {
                        view.classList.remove('active');
                        setTimeout(() => {
                            view.style.display = 'none';
                        }, 180);
                    }),
                view
            );
        }
        function openOfflineBarrageView({ floor = 1, paragraphIndex = 0, barrages = [] } = {}) {
            const view_3 = handleAction_287(),
                titleEl_3 = view_3.querySelector('#offline-chat-barrage-title'),
                listEl_3 = view_3.querySelector('#offline-chat-barrage-list'),
                cleanBarrages = (Array.isArray(barrages) ? barrages : [])
                    .filter((item_16) => item_16 && item_16.text)
                    .map((item_17) => ({
                        name: String(item_17.name || '观众').trim() || '观众',
                        text: String(item_17.text || '').trim(),
                        likes:
                            Number(item_17.likes) > 0
                                ? Math.max(0, Math.round(Number(item_17.likes) || 0))
                                : getOfflineBarrageRandomLikes(),
                    }));
            if (titleEl_3) titleEl_3.textContent = '#' + floor + ' · 弹幕';
            listEl_3 &&
                ((listEl_3.innerHTML =
                    cleanBarrages.length > 0
                        ? cleanBarrages
                              .map(
                                  (value_1249) =>
                                      `
                        <div class="offline-chat-barrage-row">
                            <span class="offline-chat-barrage-name">` +
                                      escapeSheetHtml(value_1249.name) +
                                      `</span>
                            <span class="offline-chat-barrage-text">` +
                                      escapeSheetHtml(value_1249.text) +
                                      `</span>
                            <span class="offline-chat-barrage-likes"><i class="fas fa-thumbs-up"></i>` +
                                      value_1249.likes +
                                      `</span>
                        </div>
                    `,
                              )
                              .join('')
                        : '<div class="offline-chat-barrage-empty">暂无弹幕</div>'),
                (listEl_3.scrollTop = 0));
            view_3.style.display = 'flex';
            void view_3.offsetWidth;
            view_3.classList.add('active');
        }
        async function openOfflineMessageEditor(messageId_5) {
            const currentActiveFriend_1251 = window.imData.currentActiveFriend;
            if (!currentActiveFriend_1251) return;
            const messages_11 = value_221(currentActiveFriend_1251),
                index_4 = messages_11.findIndex(
                    (value_1264) => String(value_1264.id) === String(messageId_5),
                );
            if (index_4 < 0) return;
            const bubble_6 = Array.from(document.querySelectorAll('.offline-chat-bubble')).find(
                    (value_1265) =>
                        String(value_1265.getAttribute('data-message-id') || '') ===
                        String(messageId_5),
                ),
                textEl_3 = bubble_6 ? bubble_6.querySelector('.offline-chat-bubble-text') : null,
                actionsEl_2 = bubble_6
                    ? bubble_6.querySelector('.offline-chat-bubble-actions')
                    : null;
            if (!bubble_6 || !textEl_3 || textEl_3.dataset.editing === 'true') return;
            const originalText_2 = messages_11[index_4].content || '',
                innerHTML_4 = textEl_3.innerHTML,
                display_2 = textEl_3.style.display,
                minHeight_2 = textEl_3.style.minHeight,
                innerHTML_5 = actionsEl_2 ? actionsEl_2.innerHTML : '',
                measuredHeight = Math.ceil(textEl_3.getBoundingClientRect().height || 0);
            textEl_3.dataset.editing = 'true';
            textEl_3.style.display = '';
            if (measuredHeight > 0) textEl_3.style.minHeight = measuredHeight + 'px';
            textEl_3.innerHTML =
                '<textarea class="offline-chat-inline-editor">' +
                escapeSheetHtml(originalText_2) +
                '</textarea>';
            actionsEl_2 &&
                (actionsEl_2.innerHTML = `
                    <button type="button" class="offline-chat-action-btn" data-inline-edit-action="save" title="保存" aria-label="保存"><i class="fas fa-check"></i></button>
                    <button type="button" class="offline-chat-action-btn" data-inline-edit-action="cancel" title="取消" aria-label="取消"><i class="fas fa-times"></i></button>
                `);
            const textarea_3 = textEl_3.querySelector('.offline-chat-inline-editor'),
                restore_2 = () => {
                    textEl_3.dataset.editing = 'false';
                    textEl_3.innerHTML = innerHTML_4;
                    textEl_3.style.display = display_2;
                    textEl_3.style.minHeight = minHeight_2;
                    textEl_3.querySelectorAll('[data-bound]').forEach((value_1266) => {
                        delete value_1266.dataset.bound;
                    });
                    bindOfflineChatTextControls(
                        bubble_6,
                        messages_11[index_4],
                        currentActiveFriend_1251,
                        index_4 + 1,
                    );
                    actionsEl_2 &&
                        ((actionsEl_2.innerHTML = innerHTML_5),
                        actionsEl_2
                            .querySelectorAll('[data-offline-action]')
                            .forEach((button_7) => {
                                button_7.addEventListener('click', async (event_1268) => {
                                    event_1268.preventDefault();
                                    event_1268.stopPropagation();
                                    const action_3 = button_7.getAttribute('data-offline-action');
                                    if (isOfflineAutoImageMessage_2(currentActiveFriend_1251))
                                        return;
                                    if (action_3 === 'edit')
                                        await openOfflineMessageEditor(messageId_5);
                                    if (action_3 === 'delete') {
                                        buildOfflineThinkingHtml_2(currentActiveFriend_1251, true);
                                        try {
                                            await handleAction_290(messageId_5);
                                        } finally {
                                            buildOfflineThinkingHtml_2(
                                                currentActiveFriend_1251,
                                                false,
                                            );
                                        }
                                    }
                                    if (action_3 === 'reroll')
                                        await rerollOfflineAssistantMessage(messageId_5, button_7);
                                    if (action_3 === 'continue')
                                        await rerollOfflineAssistantMessage_2(
                                            messageId_5,
                                            button_7,
                                        );
                                });
                            }));
                },
                save = async () => {
                    const content_10 = textarea_3 ? textarea_3.value : originalText_2,
                        slice_1271 = messages_11.slice();
                    slice_1271[index_4] = {
                        ...slice_1271[index_4],
                        content: content_10,
                        tokens:
                            slice_1271[index_4].role === 'assistant'
                                ? estimateOfflineTextTokens(content_10)
                                : undefined,
                        updatedAt: new Date().toISOString(),
                    };
                    const filter_1272 = slice_1271.filter(
                        (value_1273, value_1274) =>
                            value_1274 === index_4 ||
                            String(value_1273.sourceMessageId || '') !== String(messageId_5),
                    );
                    await persistOfflineMessages(currentActiveFriend_1251, filter_1272, {
                        resetMessageIds: [messageId_5],
                    });
                    renderOfflineCurrentMessages(currentActiveFriend_1251);
                };
            if (actionsEl_2) {
                const saveBtn_2 = actionsEl_2.querySelector('[data-inline-edit-action="save"]'),
                    cancelBtn_2 = actionsEl_2.querySelector('[data-inline-edit-action="cancel"]');
                if (saveBtn_2)
                    saveBtn_2.addEventListener('click', async (event_11) => {
                        event_11.preventDefault();
                        event_11.stopPropagation();
                        await save();
                    });
                if (cancelBtn_2)
                    cancelBtn_2.addEventListener('click', (event_12) => {
                        event_12.preventDefault();
                        event_12.stopPropagation();
                        restore_2();
                    });
            }
            textarea_3 &&
                (textarea_3.focus(),
                (textarea_3.selectionStart = textarea_3.value.length),
                (textarea_3.selectionEnd = textarea_3.value.length),
                textarea_3.addEventListener('keydown', async (event_1277) => {
                    if (event_1277.isComposing || event_1277.keyCode === 229) return;
                    (event_1277.ctrlKey || event_1277.metaKey) &&
                        (event_1277.key === 'Enter' || event_1277.keyCode === 13) &&
                        (event_1277.preventDefault(), await save());
                    event_1277.key === 'Escape' && (event_1277.preventDefault(), restore_2());
                }));
        }
        async function handleAction_290(messageId_6) {
            const currentActiveFriend_1279 = window.imData.currentActiveFriend;
            if (!currentActiveFriend_1279) return;
            if (!window.confirm('删除这一楼？')) return;
            const messages_12 = value_221(currentActiveFriend_1279),
                nextMessages_2 = messages_12.filter(
                    (message_25) =>
                        String(message_25.id) !== String(messageId_6) &&
                        String(message_25.sourceMessageId || '') !== String(messageId_6),
                );
            await persistOfflineMessages(currentActiveFriend_1279, nextMessages_2);
            renderOfflineCurrentMessages(currentActiveFriend_1279);
        }
        const getOfflineGroupMembers = (activeFriend_34) => {
                if (!activeFriend_34 || activeFriend_34.type !== 'group') return [];
                const snapshots = Array.isArray(activeFriend_34.leftGroupMemberSnapshot)
                    ? activeFriend_34.leftGroupMemberSnapshot
                    : [];
                if (Number(activeFriend_34.leftGroupAt) > 0 && snapshots.length > 0)
                    return snapshots.map((value_1286) => ({
                        id: value_1286.id,
                        realName: value_1286.realName || '',
                        nickname: value_1286.nickname || '',
                        persona: '',
                    }));
                const liveMembers = window.imChat?.getGroupMemberFriends
                    ? window.imChat.getGroupMemberFriends(activeFriend_34)
                    : [];
                if (liveMembers.length > 0) return liveMembers;
                return snapshots.map((value_1287) => ({
                    id: value_1287.id,
                    realName: value_1287.realName || '',
                    nickname: value_1287.nickname || '',
                    persona: '',
                }));
            },
            getOfflineIdentityContext = (activeFriend_35, currentUserState_3 = null) => {
                const userState_3 =
                        currentUserState_3 ||
                        (window.getUserState ? window.getUserState() : window.userState || {}),
                    userProfile = handleAction_27(activeFriend_35, userState_3),
                    userName_4 = userProfile.name,
                    isGroup_2 = activeFriend_35?.type === 'group',
                    groupMembers_2 = isGroup_2 ? getOfflineGroupMembers(activeFriend_35) : [],
                    memberNames = Array.from(
                        new Set(
                            groupMembers_2
                                .map((member_4) =>
                                    String(member_4?.realName || member_4?.nickname || '').trim(),
                                )
                                .filter(Boolean),
                        ),
                    ),
                    charName_4 = isGroup_2
                        ? memberNames.join('、') ||
                          String(
                              activeFriend_35?.realName || activeFriend_35?.nickname || '群成员',
                          ).trim() ||
                          '群成员'
                        : String(
                              activeFriend_35?.realName || activeFriend_35?.nickname || 'Char',
                          ).trim() || 'Char';
                return {
                    userName: userName_4,
                    userPersona: userProfile.persona,
                    userAvatarUrl: userProfile.avatarUrl,
                    userSignature: userProfile.signature,
                    boundAccountId: userProfile.boundAccountId,
                    charName: charName_4,
                    isGroup: isGroup_2,
                    groupMembers: groupMembers_2,
                };
            },
            replaceOfflinePromptVariables = (content_11, identityContext_2) =>
                String(content_11 || '')
                    .replace(/\{\{user\}\}/g, () => identityContext_2.userName)
                    .replace(/\{\{char\}\}/g, () => identityContext_2.charName),
            value_294 = (activeFriend_36, items_1301) => {
                const currentUserState_4 = window.getUserState
                        ? window.getUserState()
                        : window.userState || {},
                    { userName: userName_5 } = getOfflineIdentityContext(
                        activeFriend_36,
                        currentUserState_4,
                    ),
                    items_1304 =
                        activeFriend_36?.offlineEpisodeMode === true
                            ? []
                            : Array.isArray(activeFriend_36?.messages)
                              ? activeFriend_36.messages.slice(-60)
                              : [],
                    value_1305 = Array.isArray(items_1301) ? items_1301.slice(-60) : [],
                    combined = [],
                    value_1307 =
                        items_1304.length > 0 && window.imApp?.normalizeFriendData
                            ? window.imApp.normalizeFriendData(activeFriend_36)
                            : activeFriend_36;
                items_1304.forEach((message_26) => {
                    if (
                        message_26?.type === 'system_notice' &&
                        message_26.noticeKind === OFFLINE_ACTIVE_NOTICE_KIND
                    )
                        return;
                    let formatted = null;
                    window.imApp?.formatMessageForApiContext &&
                        (formatted = window.imApp.formatMessageForApiContext(
                            message_26,
                            value_1307,
                            {
                                userName: userName_5,
                                friendIsNormalized: true,
                            },
                        ));
                    const role_3 =
                            formatted?.role ||
                            (message_26.role === 'assistant' || message_26.role === 'char'
                                ? 'assistant'
                                : message_26.role === 'system'
                                  ? 'system'
                                  : 'user'),
                        content_12 =
                            formatted?.content || message_26.content || message_26.text || '';
                    content_12 &&
                        combined.push({
                            role: role_3,
                            content: content_12,
                            timestamp: Number(message_26.timestamp) || 0,
                            isOffline: false,
                        });
                });
                cloneOfflineMeetingMessages(value_1305).forEach((message_27) => {
                    if (isOfflineAutoImageMessage(message_27)) return;
                    if (isOfflineSummaryMessage(message_27) && message_27.content) {
                        const value_1315 = Number(message_27.sourceFloorStart) || 1,
                            value_1316 = Number(message_27.sourceFloorEnd) || value_1315;
                        combined.push({
                            role: 'system',
                            content:
                                '<offline_segment_summary floors="' +
                                value_1315 +
                                '-' +
                                value_1316 +
                                `">
` +
                                message_27.content +
                                `
</offline_segment_summary>`,
                            timestamp: Number(message_27.timestamp) || 0,
                            isOffline: true,
                        });
                        return;
                    }
                    !message_27.archivedBySummaryId &&
                        message_27.content &&
                        combined.push({
                            role: message_27.role === 'assistant' ? 'assistant' : 'user',
                            content: message_27.content,
                            timestamp: Number(message_27.timestamp) || 0,
                            isOffline: true,
                        });
                });
                combined.sort((a_5, b_5) => a_5.timestamp - b_5.timestamp);
                const mounted = combined.slice(-60);
                let count_1309 = 0;
                for (let value_1319 = mounted.length - 1; value_1319 >= 0; value_1319 -= 1) {
                    const message_28 = mounted[value_1319];
                    if (message_28.role !== 'user' && message_28.role !== 'assistant') continue;
                    const promptContent = message_28.isOffline
                        ? value_217(message_28.content, message_28.role, count_1309)
                        : message_28.content;
                    message_28.content = message_28.isOffline
                        ? stripOfflineDecorativeMarkup(promptContent)
                        : promptContent;
                    count_1309 += 1;
                }
                return mounted
                    .map(({ isOffline: isOffline_3, ...message_29 }) => message_29)
                    .filter((message_30) => message_30.content);
            },
            value_295 = async () => {
                if (window.scheduler?.['yield']) {
                    await window.scheduler['yield']();
                    return;
                }
                await new Promise((value_1325) => setTimeout(value_1325, 0));
            },
            value_296 = async (activeFriend_59, value_1327) => {
                const currentUserState_5 = window.getUserState
                        ? window.getUserState()
                        : window.userState || {},
                    identityContext_3 = getOfflineIdentityContext(
                        activeFriend_59,
                        currentUserState_5,
                    ),
                    { userName: userName_6, charName: charName_5 } = identityContext_3,
                    episodeMode_2 = activeFriend_59?.offlineEpisodeMode === true,
                    historyMessages_2 = value_294(activeFriend_59, value_1327);
                await value_295();
                const join_1334 = [
                        ...historyMessages_2.map((m) => m.content || ''),
                        activeFriend_59.persona || '',
                        identityContext_3.userPersona || '',
                        episodeMode_2 ? '' : activeFriend_59.memory?.overview || '',
                    ].filter(Boolean).join(`
`),
                    worldBookContexts_2 = await value_351(activeFriend_59, join_1334);
                await value_295();
                const crossGroupMemoryContext_2 = episodeMode_2
                    ? ''
                    : await value_352(activeFriend_59, identityContext_3.groupMembers, userName_6);
                await value_295();
                const value_353_1337 = value_353({
                    activeFriend: activeFriend_59,
                    currentUserState: currentUserState_5,
                    userName: userName_6,
                    charName: charName_5,
                    identityContext: identityContext_3,
                    historyMessages: historyMessages_2,
                    worldBookContexts: worldBookContexts_2,
                    crossGroupMemoryContext: crossGroupMemoryContext_2,
                    episodeMode: episodeMode_2,
                });
                await value_295();
                const value_1338 = episodeMode_2 ? '' : value_355(activeFriend_59, join_1334);
                await value_295();
                const globalOfflinePrompts = ensureGlobalOfflinePrompts(activeFriend_59),
                    enabled_1339 = true,
                    apiMessages = [],
                    enabledCotPrompts = globalOfflinePrompts
                        .filter(
                            (value_1344) =>
                                value_15(value_1344) &&
                                (value_1344.alwaysEnabled || value_1344.enabled),
                        )
                        .map((message_1345) =>
                            episodeMode_2 && message_1345.id === 'cot_scene_planning'
                                ? {
                                      ...message_1345,
                                      content: String(message_1345.content || '')
                                          .replace(
                                              /世界书、人设、记忆、线上与线下上下文/g,
                                              '世界书、人设、当前线下上下文',
                                          )
                                          .replace(/线上与线下上下文/g, '当前线下上下文'),
                                  }
                                : message_1345,
                        ),
                    cotCompilation = offlineReasoning?.buildCotInstructionBlock
                        ? offlineReasoning.buildCotInstructionBlock(enabledCotPrompts)
                        : {
                              content: '',
                              expectedTitles: [],
                          };
                let historyMounted = false,
                    enabled_1342 = false;
                const mountHistory = () => {
                    if (historyMounted) return;
                    apiMessages.push(
                        ...historyMessages_2.map((message_31) => ({
                            role: message_31.role,
                            content: message_31.content,
                        })),
                    );
                    historyMounted = true;
                };
                for (let p of globalOfflinePrompts) {
                    if (p.id === OFFLINE_CHAT_HISTORY_PROMPT_ID) {
                        mountHistory();
                        continue;
                    }
                    const isEnabled_2 = p.alwaysEnabled || p.enabled;
                    if (!isEnabled_2) continue;
                    if (episodeMode_2 && p.id === 'memory_system') continue;
                    if (value_15(p)) {
                        enabled_1339 &&
                            !enabled_1342 &&
                            cotCompilation.content &&
                            (apiMessages.push({
                                role: 'system',
                                content: cotCompilation.content,
                            }),
                            (enabled_1342 = true));
                        continue;
                    }
                    let text_1349 = '';
                    if (p.id === 'data_zone')
                        text_1349 = replaceOfflinePromptVariables(
                            value_353_1337,
                            identityContext_3,
                        );
                    else {
                        if (p.id === 'memory_system')
                            text_1349 = replaceOfflinePromptVariables(
                                value_1338,
                                identityContext_3,
                            );
                        else {
                            if (p.content && p.content.trim())
                                text_1349 = replaceOfflinePromptVariables(
                                    p.content.trim(),
                                    identityContext_3,
                                );
                        }
                    }
                    if (!text_1349) continue;
                    apiMessages.push({
                        role: 'system',
                        content: text_1349,
                    });
                }
                return (
                    mountHistory(),
                    episodeMode_2 &&
                        apiMessages.push({
                            role: 'system',
                            content:
                                '当前为番外模式。只依据本次线下上下文、人设和世界书推进情景；不要引用或推断线上聊天、角色记忆或其他群聊经历。',
                        }),
                    shouldAutoGenerateOfflineImage(activeFriend_59) &&
                        apiMessages.push({
                            role: 'system',
                            content: buildOfflineAutoImageRequirement(),
                        }),
                    {
                        messages: apiMessages,
                        cotValidation: {
                            expectedTitles: cotCompilation.expectedTitles || [],
                        },
                    }
                );
            },
            value_297 = async (messages_13, streamingBubble = null, options_8 = {}) => {
                const currentApiConfig_3 = window.getApiConfig
                    ? window.getApiConfig()
                    : window.apiConfig || {};
                if (!currentApiConfig_3.endpoint || !currentApiConfig_3.apiKey)
                    throw new Error('API config missing');
                const signal_2 = options_8.signal || null,
                    chatCompletionsEndpoint = window.u2Api.resolveChatCompletionsEndpoint(
                        currentApiConfig_3.endpoint,
                    ),
                    activeOfflineFriend = window.imData.currentActiveFriend,
                    value_1356 =
                        options_8.stream !== false &&
                        activeOfflineFriend?.offlineStreamEnabled !== false,
                    finishStream = (
                        content_13,
                        nativeReasoning = '',
                        value_1371 = 0,
                        aborted_2 = false,
                        finishReason_2 = '',
                        value_1374 = true,
                        value_1375 = false,
                    ) => {
                        const streamedResult = streamingBubble?.finish
                                ? streamingBubble.finish()
                                : streamingBubble?.getResult
                                  ? streamingBubble.getResult()
                                  : null,
                            normalized_2 =
                                streamedResult ||
                                (offlineReasoning
                                    ? offlineReasoning.normalizeResponse(
                                          content_13,
                                          nativeReasoning,
                                      )
                                    : {
                                          content: String(content_13 || ''),
                                          reasoning: String(nativeReasoning || ''),
                                      });
                        if (!aborted_2 && !String(normalized_2.content || '').trim()) {
                            const exhaustedTokens = [
                                    'length',
                                    'max_tokens',
                                    'max_completion_tokens',
                                ].includes(String(finishReason_2 || '').toLowerCase()),
                                error_10 = new Error(
                                    exhaustedTokens && String(normalized_2.reasoning || '').trim()
                                        ? 'Offline assistant exhausted the response token limit during reasoning'
                                        : 'Offline assistant returned empty content',
                                );
                            error_10.code =
                                exhaustedTokens && String(normalized_2.reasoning || '').trim()
                                    ? 'reasoning_tokens_exhausted'
                                    : 'empty_response';
                            error_10.finishReason = finishReason_2 || '';
                            throw error_10;
                        }
                        const toLowerCase_1378 = String(finishReason_2 || '').toLowerCase(),
                            value_1379 = !!String(normalized_2.content || '').trim(),
                            includes_1380 = [
                                'length',
                                'max_tokens',
                                'max_completion_tokens',
                            ].includes(toLowerCase_1378),
                            includes_1381 = ['stop', 'tool_calls', 'function_call'].includes(
                                toLowerCase_1378,
                            ),
                            truncated_2 =
                                !aborted_2 &&
                                value_1379 &&
                                (includes_1380 || value_1375 || (!value_1374 && !includes_1381)),
                            tokens_2 =
                                value_1371 ||
                                estimateOfflineTextTokens(
                                    (normalized_2.reasoning || '') +
                                        `
` +
                                        (normalized_2.content || ''),
                                );
                        if (streamingBubble?.setTokens) streamingBubble.setTokens(tokens_2);
                        return {
                            content: normalized_2.content,
                            reasoning: normalized_2.reasoning || '',
                            tokens: tokens_2,
                            aborted: aborted_2,
                            finishReason: finishReason_2 || '',
                            streamComplete: value_1374 !== false,
                            truncated: truncated_2,
                            streamReadError: !!value_1375,
                        };
                    },
                    requestBody = {
                        model: currentApiConfig_3.model || '',
                        messages: messages_13,
                        temperature: Number.isFinite(
                            Number.parseFloat(currentApiConfig_3.temperature),
                        )
                            ? Number.parseFloat(currentApiConfig_3.temperature)
                            : 0.7,
                        stream: value_1356,
                    },
                    reasoningRequest = offlineReasoning?.buildReasoningRequestConfig({
                        endpoint: currentApiConfig_3.endpoint,
                        model: currentApiConfig_3.model,
                        enabled: options_8.requestReasoning !== false,
                        maxTokens: count,
                    }) || {
                        enabled: options_8.requestReasoning !== false,
                        hasReasoningParameter: false,
                        parameters: {
                            max_tokens: count,
                        },
                    };
                Object.assign(requestBody, reasoningRequest.parameters);
                let response_4 = null;
                try {
                    const value_1386 = typeof window.u2Api?.fetchChatCompletion === 'function',
                        value_1387 = value_1386 ? window.u2Api.fetchChatCompletion : fetch;
                    response_4 = await value_1387(chatCompletionsEndpoint, {
                        method: 'POST',
                        headers: window.u2Api.buildApiHeaders(currentApiConfig_3),
                        apiConfig: currentApiConfig_3,
                        body: value_1386 ? requestBody : JSON.stringify(requestBody),
                        signal: signal_2 || undefined,
                    });
                } catch (value_1388) {
                    if (signal_2?.aborted || value_1388?.name === 'AbortError')
                        return finishStream('', '', 0, true);
                    throw value_1388;
                }
                if (!response_4.ok) {
                    const isUnsupportedReasoningConfig =
                            reasoningRequest.hasReasoningParameter &&
                            (response_4.status === 400 || response_4.status === 422),
                        value_1390 = await window.u2Api?.readApiError?.(response_4),
                        error_11 = new Error(
                            isUnsupportedReasoningConfig
                                ? 'Current API does not support automatic reasoning configuration'
                                : 'HTTP Error: ' + response_4.status,
                        );
                    error_11.code = isUnsupportedReasoningConfig
                        ? 'reasoning_config_unsupported'
                        : 'http_error';
                    error_11.status = response_4.status;
                    error_11.rawBody = value_1390?.rawBody || '';
                    error_11.apiDetail = value_1390?.message || '';
                    throw error_11;
                }
                const isEventStream =
                    value_1356 &&
                    /text\/event-stream/i.test(
                        String(response_4.headers?.get?.('content-type') || ''),
                    ) &&
                    !!response_4.body?.getReader;
                if (isEventStream) {
                    let streamedContent = '',
                        streamedReasoning = '',
                        completionTokens = 0,
                        finishReason_3 = '',
                        streamBuffer = '',
                        streamFinished = false;
                    const appendStreamPayload = (payload) => {
                            const streamChoice = payload?.choices?.[0] || {},
                                delta_2 = streamChoice.delta || streamChoice.message || {},
                                responseParts = offlineReasoning?.extractResponseParts(
                                    [
                                        delta_2.content,
                                        delta_2.output_text,
                                        streamChoice.text,
                                        payload?.output_text,
                                    ],
                                    [
                                        delta_2.reasoning,
                                        delta_2.reasoning_content,
                                        delta_2.reasoning_details,
                                        delta_2.analysis,
                                        streamChoice.reasoning,
                                        streamChoice.reasoning_content,
                                        streamChoice.reasoning_details,
                                        payload?.reasoning,
                                        payload?.reasoning_content,
                                        payload?.reasoning_details,
                                    ],
                                ) || {
                                    content: '',
                                    reasoning: '',
                                },
                                string_1402 = String(responseParts.content || ''),
                                string_1403 = String(responseParts.reasoning || '');
                            string_1403 &&
                                ((streamedReasoning += string_1403),
                                streamingBubble?.appendReasoningChunk?.(string_1403));
                            string_1402 &&
                                ((streamedContent += string_1402),
                                (
                                    streamingBubble?.appendContentChunk ||
                                    streamingBubble?.appendChunk
                                )?.(string_1402));
                            completionTokens =
                                Number(payload?.usage?.completion_tokens) || completionTokens;
                            finishReason_3 =
                                streamChoice.finish_reason ||
                                payload?.finish_reason ||
                                finishReason_3;
                        },
                        consumeStreamFrame = (frame) => {
                            const payloadText = String(frame || '')
                                .split(/\r?\n/)
                                .filter((line_12) => line_12.startsWith('data:'))
                                .map((line_13) => line_13.slice(5).trimStart())
                                .join(
                                    `
`,
                                )
                                .trim();
                            if (!payloadText) return;
                            if (payloadText === '[DONE]') {
                                streamFinished = true;
                                return;
                            }
                            try {
                                appendStreamPayload(JSON.parse(payloadText));
                            } catch (error_12) {
                                console.warn(
                                    '[iMessage Offline] Ignored malformed stream frame',
                                    error_12,
                                );
                            }
                        };
                    try {
                        const reader = response_4.body.getReader(),
                            decoder = new TextDecoder();
                        while (!streamFinished) {
                            const { value: value_23, done: done_2 } = await reader.read();
                            if (done_2) break;
                            streamBuffer += decoder.decode(value_23, {
                                stream: true,
                            });
                            const frames = streamBuffer.split(/\r?\n\r?\n/);
                            streamBuffer = frames.pop() || '';
                            for (const value_1411 of frames) {
                                consumeStreamFrame(value_1411);
                                if (streamFinished) break;
                            }
                        }
                        streamBuffer += decoder.decode();
                        if (streamBuffer.trim() && !streamFinished)
                            consumeStreamFrame(streamBuffer);
                    } catch (value_1412) {
                        if (signal_2?.aborted || value_1412?.name === 'AbortError')
                            return finishStream(
                                streamedContent,
                                streamedReasoning,
                                completionTokens,
                                true,
                                finishReason_3,
                            );
                        return finishStream(
                            streamedContent,
                            streamedReasoning,
                            completionTokens,
                            false,
                            finishReason_3,
                            false,
                            true,
                        );
                    }
                    return finishStream(
                        streamedContent,
                        streamedReasoning,
                        completionTokens,
                        false,
                        finishReason_3,
                        streamFinished,
                        false,
                    );
                }
                const data_4 = await response_4.json(),
                    responseChoice = data_4?.choices?.[0] || {},
                    responseMessage = responseChoice.message || {},
                    responseParts_2 = offlineReasoning?.extractResponseParts(
                        [
                            responseMessage.content,
                            responseMessage.output_text,
                            responseChoice.text,
                            data_4?.output_text,
                        ],
                        [
                            responseMessage.reasoning,
                            responseMessage.reasoning_content,
                            responseMessage.reasoning_details,
                            responseChoice.reasoning,
                            responseChoice.reasoning_content,
                            responseChoice.reasoning_details,
                            data_4?.reasoning,
                            data_4?.reasoning_content,
                            data_4?.reasoning_details,
                        ],
                    ) || {
                        content: '',
                        reasoning: '',
                    },
                    content_14 = responseParts_2.content || '',
                    nativeReasoning_2 = responseParts_2.reasoning || '',
                    completionTokens_2 = Number(data_4?.usage?.completion_tokens) || 0;
                if (streamingBubble && nativeReasoning_2)
                    streamingBubble.appendReasoningChunk?.(nativeReasoning_2);
                if (streamingBubble && content_14)
                    (streamingBubble.appendContentChunk || streamingBubble.appendChunk)?.(
                        content_14,
                    );
                return finishStream(
                    content_14,
                    nativeReasoning_2,
                    completionTokens_2,
                    false,
                    responseChoice.finish_reason,
                    true,
                    false,
                );
            },
            requestOfflineAssistantReplyWithCotValidation = async (
                requestContext,
                streamingBubble_2 = null,
                value_1415 = {},
            ) => {
                const apiMessages_2 = Array.isArray(requestContext)
                        ? requestContext
                        : requestContext?.messages || [],
                    expectedTitles_2 = Array.isArray(requestContext?.cotValidation?.expectedTitles)
                        ? requestContext.cotValidation.expectedTitles
                        : [],
                    firstResult = await value_297(apiMessages_2, streamingBubble_2, value_1415);
                if (
                    firstResult.aborted ||
                    !expectedTitles_2.length ||
                    !offlineReasoning?.validateCotResponse
                )
                    return firstResult;
                const firstRawContent = streamingBubble_2?.getFullText?.() || '',
                    firstValidation = offlineReasoning.validateCotResponse(
                        firstRawContent,
                        expectedTitles_2,
                    );
                if (firstValidation.valid) return firstResult;
                if (window.showToast) window.showToast('模型未完全按 COT 预设输出，已保留首轮回复');
                return firstResult;
            },
            value_299 = (value_1421, value_1422) => {
                const { userName: userName_8, charName: charName_8 } =
                        getOfflineIdentityContext(value_1421),
                    normalizedMessages = cloneOfflineMeetingMessages(value_1422);
                return normalizedMessages
                    .map((message_32, value_1427) => {
                        if (isOfflineSummaryMessage(message_32)) {
                            const value_1432 = Number(message_32.sourceFloorStart) || 1,
                                value_1433 = Number(message_32.sourceFloorEnd) || value_1432;
                            return (
                                '【已归档线下总结｜第 ' +
                                value_1432 +
                                '–' +
                                value_1433 +
                                ` 楼】
` +
                                message_32.content
                            );
                        }
                        if (isOfflineAutoImageMessage(message_32)) return '';
                        if (message_32.archivedBySummaryId) return '';
                        const value_1428 =
                                message_32.role === 'assistant' ? charName_8 : userName_8,
                            visibleMessages = normalizedMessages.filter(
                                (item_18) =>
                                    !isOfflineSummaryMessage(item_18) &&
                                    !item_18.archivedBySummaryId,
                            ),
                            depth_2 = Math.max(
                                0,
                                visibleMessages.length -
                                    1 -
                                    visibleMessages.findIndex(
                                        (item_19) => String(item_19.id) === String(message_32.id),
                                    ),
                            ),
                            value_217_1431 = value_217(
                                message_32.content,
                                message_32.role,
                                depth_2,
                            );
                        return (
                            '#' +
                            (value_1427 + 1) +
                            ' ' +
                            value_1428 +
                            ': ' +
                            stripOfflineDecorativeMarkup(value_217_1431)
                        );
                    })
                    .filter(Boolean).join(`

`);
            },
            value_300 = (value_1436) => {
                const date_3 = new Date(Number(value_1436) || Date.now());
                if (Number.isNaN(date_3.getTime())) return '';
                const value_1438 = (value_1439) => String(value_1439).padStart(2, '0');
                return (
                    date_3.getFullYear() +
                    '-' +
                    value_1438(date_3.getMonth() + 1) +
                    '-' +
                    value_1438(date_3.getDate()) +
                    ' ' +
                    value_1438(date_3.getHours()) +
                    ':' +
                    value_1438(date_3.getMinutes())
                );
            },
            formatOfflineTxtSession = (value_1440, session_10, options_9 = {}) => {
                const { userName: userName_9, charName: charName_9 } =
                        getOfflineIdentityContext(value_1440),
                    value_208_1445 = cloneOfflineMeetingMessages(session_10?.messages || []),
                    sessionTitle_2 = String(
                        session_10?.title ||
                            (options_9.isCurrent ? '进行中的线下见面' : '线下见面记录'),
                    ).trim(),
                    sessionDate = String(
                        session_10?.dateText ||
                            formatOfflineMeetingDate(session_10?.endedAt || session_10?.startedAt),
                    ).trim(),
                    lines_2 = ['【' + sessionTitle_2 + '】', '时间：' + sessionDate];
                let floor_4 = 0;
                value_208_1445.forEach((message_33) => {
                    if (isOfflineSummaryMessage(message_33)) {
                        const summary_4 = String(message_33.content || '').trim();
                        if (summary_4)
                            lines_2.push(
                                `
[已归档线下总结]
` + summary_4,
                            );
                        return;
                    }
                    if (isOfflineAutoImageMessage(message_33)) {
                        lines_2.push(
                            `
[已生成线下剧情图片｜` +
                                value_300(message_33.timestamp) +
                                ']',
                        );
                        return;
                    }
                    if (message_33.role !== 'user' && message_33.role !== 'assistant') return;
                    const content_15 = stripOfflineDecorativeMarkup(message_33.content).trim();
                    if (!content_15) return;
                    floor_4 += 1;
                    const value_1452 = message_33.role === 'assistant' ? charName_9 : userName_9;
                    lines_2.push(
                        `
#` +
                            floor_4 +
                            ' ' +
                            value_1452 +
                            '｜' +
                            value_300(message_33.timestamp) +
                            `
` +
                            content_15,
                    );
                });
                if (floor_4 === 0 && lines_2.length === 2)
                    lines_2.push(`
（暂无文字聊天记录）`);
                return lines_2.join(`
`);
            },
            value_302 = (activeFriend_37) => {
                const sessions_4 = normalizeOfflineMeetingSessions(activeFriend_37)
                        .slice()
                        .sort((a_6, b_6) => Number(a_6.startedAt) - Number(b_6.startedAt)),
                    currentMessages_2 = value_221(activeFriend_37),
                    currentSession =
                        currentMessages_2.length > 0
                            ? {
                                  id: activeFriend_37.offlineCurrentSessionId || 'current',
                                  startedAt:
                                      Number(activeFriend_37.offlineMeetingStartedAt) ||
                                      currentMessages_2[0]?.timestamp ||
                                      Date.now(),
                                  endedAt: Date.now(),
                                  dateText: formatOfflineMeetingDate(
                                      Number(activeFriend_37.offlineMeetingStartedAt) ||
                                          currentMessages_2[0]?.timestamp ||
                                          Date.now(),
                                  ),
                                  title: '进行中的线下见面',
                                  messages: currentMessages_2,
                              }
                            : null,
                    value_1458 =
                        getOfflineIdentityContext(activeFriend_37).charName + ' 的线下聊天记录',
                    sessionTexts = sessions_4
                        .map((session_11) => formatOfflineTxtSession(activeFriend_37, session_11))
                        .concat(
                            currentSession
                                ? [
                                      formatOfflineTxtSession(activeFriend_37, currentSession, {
                                          isCurrent: true,
                                      }),
                                  ]
                                : [],
                        );
                return [
                    value_1458,
                    '导出时间：' + value_300(Date.now()),
                    '',
                    ...(sessionTexts.length > 0 ? sessionTexts : ['（暂无线下聊天记录）']),
                ].join(`

`);
            },
            getOfflineChatTxtFileName = (activeFriend_38) => {
                const rawName = String(
                        activeFriend_38?.nickname || activeFriend_38?.realName || '线下聊天记录',
                    ).trim(),
                    safeName = rawName.replace(/[\\/:*?"<>|]/g, '_').slice(0, 80) || '线下聊天记录',
                    stamp_2 = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
                return safeName + '-线下聊天记录-' + stamp_2 + '.txt';
            };
        async function handleAction_304(activeFriend_39) {
            if (!activeFriend_39) throw new Error('当前线下聊天状态已失效，请重新进入');
            if (typeof window.u2ExportFile !== 'function')
                throw new Error('文件导出功能尚未加载，请刷新后重试');
            const value_302_1468 = value_302(activeFriend_39),
                blob_3 = new Blob(['﻿' + value_302_1468], {
                    type: 'text/plain;charset=utf-8',
                }),
                result_5 = await window.u2ExportFile({
                    blob: blob_3,
                    fileName: getOfflineChatTxtFileName(activeFriend_39),
                    title: 'iMessage 线下聊天记录',
                });
            if (result_5 === 'failed') throw new Error('聊天记录导出失败，请稍后重试');
            return result_5;
        }
        const normalizeOfflineSummarySettings = (source) => ({
                apiPresetId: String(source?.apiPresetId || '').trim(),
                prompt: String(source?.prompt || '')
                    .trim()
                    .slice(0, 12000),
            }),
            getOfflineSummarySettings = (friend_12) =>
                normalizeOfflineSummarySettings(friend_12?.offlineSummarySettings),
            getOfflineSummaryApiPresets = () => {
                const presets_2 =
                    typeof window.getApiPresets === 'function' ? window.getApiPresets() : [];
                return Array.isArray(presets_2) ? presets_2 : [];
            },
            resolveOfflineSummaryApiConfig = (settings_2 = {}) => {
                const selectedId = String(settings_2?.apiPresetId || '').trim(),
                    selectedPreset = selectedId
                        ? getOfflineSummaryApiPresets().find(
                              (preset_2) => String(preset_2?.id || '') === selectedId,
                          )
                        : null;
                if (selectedPreset)
                    return {
                        provider: selectedPreset.provider || 'openai-compatible',
                        endpoint: selectedPreset.endpoint || '',
                        apiKey: selectedPreset.apiKey || '',
                        model: selectedPreset.model || '',
                        temperature: selectedPreset.temperature ?? selectedPreset.temp ?? 0.7,
                        frequencyPenalty: selectedPreset.frequencyPenalty ?? 0,
                        presetId: selectedId,
                    };
                const current = window.getApiConfig
                    ? window.getApiConfig()
                    : window.apiConfig || {};
                return {
                    ...current,
                    presetId: '',
                };
            },
            value_308 = (value_1478, value_1479, value_1480 = {}) => {
                if (imOfflineSummaryErrors_6?.createError)
                    return imOfflineSummaryErrors_6.createError(value_1478, value_1479, value_1480);
                return Object.assign(
                    new Error(String(value_1479 || value_1478 || 'Offline summary failed')),
                    {
                        name: 'OfflineSummaryError',
                        code: String(value_1478 || 'unknown'),
                        ...value_1480,
                    },
                );
            },
            value_309 = (value_1481) => {
                if (imOfflineSummaryErrors_6?.formatFailure)
                    return imOfflineSummaryErrors_6.formatFailure(value_1481);
                const value_1482 = Number(value_1481?.status) || 0,
                    trim_1483 = String(value_1481?.message || '').trim();
                return (
                    '' +
                    (value_1482 ? 'HTTP ' + value_1482 : '线下总结发生错误') +
                    (trim_1483 ? '：' + trim_1483 : '')
                );
            },
            value_310 = (value_1484, value_1485) => {
                const value_309_1486 = value_309(value_1485),
                    value_1487 =
                        Number(value_1485?.status) > 0 ||
                        ['http_error', 'network', 'invalid_json', 'empty_response'].includes(
                            value_1485?.code,
                        );
                return (
                    (!value_1487 ||
                        !window.u2Api?.reportError?.(value_1485, {
                            operation: value_1484.replace(/失败$/, ''),
                        })) &&
                        window.showToast?.(value_1484 + '：' + value_309_1486),
                    value_309_1486
                );
            },
            value_311 = (value_1488) => {
                const items_1489 =
                    value_1488?.choices?.[0]?.message?.content ??
                    value_1488?.choices?.[0]?.text ??
                    '';
                if (Array.isArray(items_1489))
                    return items_1489
                        .map((message_1490) => {
                            if (typeof message_1490 === 'string') return message_1490;
                            return String(message_1490?.text || message_1490?.content || '');
                        })
                        .filter(Boolean)
                        .join(
                            `
`,
                        )
                        .trim();
                return typeof items_1489 === 'string' ? items_1489.trim() : '';
            },
            value_312 = async (apiConfig_3, messages_17) => {
                const missingFields_2 = [];
                if (!String(apiConfig_3?.endpoint || '').trim()) missingFields_2.push('接口地址');
                if (!String(apiConfig_3?.apiKey || '').trim()) missingFields_2.push('API Key');
                if (missingFields_2.length)
                    throw value_308('config_missing', 'Offline summary API config is incomplete', {
                        missingFields: missingFields_2,
                    });
                let text_1494 = '';
                try {
                    text_1494 = window.u2Api.resolveChatCompletionsEndpoint(apiConfig_3.endpoint);
                } catch (value_1504) {
                    throw value_308('invalid_endpoint', 'Offline summary API endpoint is invalid', {
                        detail: value_1504?.message || String(value_1504 || ''),
                    });
                }
                const options_1495 = {
                        model: apiConfig_3.model || '',
                        temperature: parseFloat(apiConfig_3.temperature ?? apiConfig_3.temp) || 0.5,
                        stream: false,
                        messages: messages_17,
                    },
                    options_1496 = {
                        'X-U2-Silent-Errors': '1',
                    },
                    headers_3 = window.u2Api?.buildApiHeaders
                        ? window.u2Api.buildApiHeaders(apiConfig_3, options_1496)
                        : {
                              'Content-Type': 'application/json',
                              Authorization: 'Bearer ' + apiConfig_3.apiKey,
                              ...options_1496,
                          },
                    value_1498 = typeof window.u2Api?.fetchChatCompletion === 'function',
                    value_1499 = value_1498 ? window.u2Api.fetchChatCompletion : fetch;
                let value_1500;
                try {
                    value_1500 = await value_1499(text_1494, {
                        method: 'POST',
                        headers: headers_3,
                        apiConfig: apiConfig_3,
                        body: value_1498 ? options_1495 : JSON.stringify(options_1495),
                    });
                } catch (cause_2) {
                    throw value_308('network', 'Offline summary API network request failed', {
                        detail: cause_2?.message || String(cause_2 || ''),
                        cause: cause_2,
                    });
                }
                let rawBody_2 = '';
                try {
                    rawBody_2 = await value_1500.text();
                } catch (cause_3) {
                    throw value_308(
                        'invalid_json',
                        'Offline summary API response could not be read',
                        {
                            status: Number(value_1500?.status) || 0,
                            statusText: value_1500?.statusText || '',
                            detail: cause_3?.message || String(cause_3 || ''),
                            cause: cause_3,
                        },
                    );
                }
                if (!value_1500.ok)
                    throw value_308(
                        'http_error',
                        'Offline summary API returned HTTP ' + value_1500.status,
                        {
                            status: Number(value_1500.status) || 0,
                            statusText: value_1500.statusText || '',
                            rawBody: rawBody_2,
                        },
                    );
                let value_1502;
                try {
                    value_1502 = JSON.parse(rawBody_2);
                } catch (cause_4) {
                    throw value_308('invalid_json', 'Offline summary API returned invalid JSON', {
                        status: Number(value_1500.status) || 0,
                        statusText: value_1500.statusText || '',
                        detail: rawBody_2 || cause_4?.message || '',
                        cause: cause_4,
                    });
                }
                const value_311_1503 = value_311(value_1502);
                if (!value_311_1503)
                    throw value_308(
                        'empty_response',
                        'Offline summary API returned no completion content',
                        {
                            rawBody: rawBody_2,
                        },
                    );
                return value_311_1503;
            },
            persistOfflineSummarySettings = async (activeFriend_40, value_1509) => {
                const offlineSummarySettings_1510 = normalizeOfflineSummarySettings(value_1509),
                    saved_13 = await commitSheetFriendChange(
                        activeFriend_40?.id || activeFriend_40,
                        (targetFriend_13) => {
                            targetFriend_13.offlineSummarySettings = offlineSummarySettings_1510;
                        },
                        {
                            silent: true,
                            metaOnly: true,
                        },
                    );
                if (!saved_13)
                    throw value_308(
                        'settings_persistence',
                        'Failed to persist offline summary settings',
                    );
                return offlineSummarySettings_1510;
            },
            value_313 = (value_1513) => {
                const entries_3 = Array.isArray(value_1513?.memory?.shortTermEntries)
                    ? value_1513.memory.shortTermEntries
                    : [];
                if (entries_3.length === 0) return '无';
                return entries_3.slice(-30).map((entry_4) =>
                    [
                        'ID: ' + (entry_4.id || ''),
                        '标题: ' + (entry_4.title || '对话总结'),
                        '时间: ' + (entry_4.time || ''),
                        '事件: ' + (entry_4.event || ''),
                        '标签: ' + (entry_4.memoryTags || entry_4.triggerKeywords || []).join('、'),
                        '记忆程度: ' + (entry_4.degree || '高'),
                    ].join(`
`),
                ).join(`

`);
            },
            requestOfflineMeetingSummary = async (value_1516, value_1517, value_1518 = {}) => {
                const value_1519 =
                        value_1518.apiConfig ||
                        resolveOfflineSummaryApiConfig(
                            value_1518.settings || getOfflineSummarySettings(value_1516),
                        ),
                    identityContext_4 = getOfflineIdentityContext(value_1516),
                    charName_6 = identityContext_4.charName,
                    value_299_1522 = value_299(value_1516, value_1517),
                    value_313_1523 = value_313(value_1516),
                    trim_1524 = String(
                        value_1518.settings?.prompt ||
                            getOfflineSummarySettings(value_1516).prompt ||
                            '',
                    ).trim(),
                    value_1525 = trim_1524
                        ? `
<user_summary_instructions>
` +
                          trim_1524 +
                          `
</user_summary_instructions>
除 JSON 结构、第三人称 Char 限定视角、群聊公开范围与隐私规则外，总结内容的重点、取舍、语言和表达必须服从以上自定义要求。
`
                        : '',
                    value_1526 = identityContext_4.isGroup
                        ? `
- meetingSummary 和 shortTermMemory 都只能使用本次群体线下见面中公开发生的内容。
- 不得写入、推断或复述任何群成员私信或其他私密联系中的内容。
- shortTermMemory.event 必须使用第三人称公开记录视角。`
                        : `
- shortTermMemory.event 要作为 ` +
                          charName_6 +
                          ` 自己的短期记忆，使用 Char 第一人称视角。
- 不得进入 User 或其他人的私密内心，只能写 Char 观察、经历或能合理推断的事。`,
                    content_27 =
                        '请把下方已结束的' +
                        (identityContext_4.isGroup ? '群体线下见面' : '线下见面') +
                        '同时整理成“线上见面总结”和“短期记忆”。' +
                        value_1525 +
                        `

User 名称：` +
                        identityContext_4.userName +
                        `
Char：` +
                        charName_6 +
                        `

已有短期记忆：
` +
                        value_313_1523 +
                        `

严格规则：
- meetingSummary 必须使用第三人称 Char 限定视角，只写 Char 看到、听到、说出、做出、注意到或能合理推断的事情。
- meetingSummary.title 不超过 10 字；meetingSummary.summary 说清前因、过程和结果，不得生成日期或时间。
- shortTermMemory.memoryTags 输出 3-6 个 2-16 字、可独立触发的主题、人物、地点、物品或感受标签，必须包含“线下见面”。
- shortTermMemory.degree 只能是“高”。
- activatedEntryIds 只能使用上面已有短期记忆的 ID，没有相关记忆时输出空数组。` +
                        value_1526 +
                        `

必须只输出可解析 JSON，不要 markdown，不要解释：
{
  "meetingSummary": {
    "title": "见面事件标题",
    "summary": "第三人称 Char 限定视角的完整见面总结"
  },
  "shortTermMemory": {
    "title": "10字内的记忆标题",
    "event": "本次见面形成的可召回记忆",
    "memoryPoints": "关键参与者、目标或矛盾、情绪变化、结果或未决点",
    "memoryTags": ["线下见面", "具体主题", "具体人物"],
    "degree": "高"
  },
  "activatedEntryIds": []
}

线下见面全部楼层：
` +
                        value_299_1522;
                return value_312(value_1519, [
                    {
                        role: 'system',
                        content: '你只输出严格、可解析的 JSON，不要 markdown，不要解释。',
                    },
                    {
                        role: 'user',
                        content: content_27,
                    },
                ]);
            },
            requestOfflineSegmentSummary = async (value_1528, sourceRows_2, value_1530 = {}) => {
                const value_1531 =
                        value_1530.apiConfig ||
                        resolveOfflineSummaryApiConfig(
                            value_1530.settings || getOfflineSummarySettings(value_1528),
                        ),
                    rows_3 = (Array.isArray(sourceRows_2) ? sourceRows_2 : []).filter(
                        ({ message: message_34 }) => !isOfflineAutoImageMessage(message_34),
                    );
                if (rows_3.length === 0) throw new Error('No offline floors selected');
                const value_292_1533 = getOfflineIdentityContext(value_1528),
                    trim_1534 = String(
                        value_1530.settings?.prompt ||
                            getOfflineSummarySettings(value_1528).prompt ||
                            '',
                    ).trim(),
                    join_1535 = rows_3.map(({ message: message_40, floor: floor_7 }, index_5) => {
                        const value_1545 =
                                message_40.role === 'assistant'
                                    ? value_292_1533.charName
                                    : value_292_1533.userName,
                            depth_3 = rows_3.length - 1 - index_5,
                            stripOfflineDecorativeMarkup_1547 = stripOfflineDecorativeMarkup(
                                value_217(message_40.content, message_40.role, depth_3),
                            );
                        return (
                            '#' +
                            floor_7 +
                            ' ' +
                            value_1545 +
                            ': ' +
                            stripOfflineDecorativeMarkup_1547
                        );
                    }).join(`

`),
                    value_1536 = value_292_1533.isGroup
                        ? '只能总结本次群体线下见面里公开发生的内容；不得写入、推断或复述任何私聊或秘密联系内容。'
                        : '只写 ' +
                          value_292_1533.charName +
                          ' 看到、听到、说出、做出、注意到或能合理推断的事情，不得进入 User 的私密内心。',
                    value_1537 = trim_1534
                        ? `
<user_summary_instructions>
` +
                          trim_1534 +
                          `
</user_summary_instructions>
在不违背隐私规则的前提下，内容重点、取舍、语言和表达必须服从这份自定义要求。
`
                        : '',
                    content_28 =
                        '请为下方线下见面的指定楼层生成一份可作为后续上下文的简明总结。' +
                        value_1537 +
                        `
User：` +
                        value_292_1533.userName +
                        `
Char：` +
                        value_292_1533.charName +
                        `

规则：
- ` +
                        value_1536 +
                        `
- 保留关键事件、关系或情绪变化、约定、未决事项与必要的时间顺序。
- 只输出总结正文，不要 JSON、Markdown、标题前后解释或“总结如下”。

指定线下楼层：
` +
                        join_1535,
                    value_1539 = await value_312(value_1531, [
                        {
                            role: 'system',
                            content: '只输出可直接作为线下剧情上下文的总结正文。',
                        },
                        {
                            role: 'user',
                            content: content_28,
                        },
                    ]),
                    summary_5 = offlineReasoning
                        ? offlineReasoning.normalizeResponse(value_1539, '').content.trim()
                        : String(value_1539 || '').trim();
                if (!summary_5)
                    throw value_308(
                        'empty_response',
                        'Offline segment summary is empty after normalization',
                        {
                            detail: value_1539,
                        },
                    );
                return summary_5;
            },
            value_316 = (value_1548, startFloor_3, endFloor_3) => {
                const start = Math.max(1, Math.round(Number(startFloor_3) || 0)),
                    end = Math.max(start, Math.round(Number(endFloor_3) || 0)),
                    rows_4 = getOfflineDialogueRows(value_1548),
                    selectedRows = rows_4.filter(
                        (row_4) => row_4.floor >= start && row_4.floor <= end,
                    );
                if (
                    !selectedRows.length ||
                    selectedRows[0].floor !== start ||
                    selectedRows[selectedRows.length - 1].floor !== end
                )
                    throw new Error('Summary floor range is invalid');
                if (selectedRows.some((row_5) => row_5.message.archivedBySummaryId))
                    throw new Error('Selected floors are already summarized');
                return selectedRows;
            },
            value_317 = async (activeFriend_41, value_1555, value_1556, value_1557 = {}) => {
                const value_221_1558 = value_221(activeFriend_41),
                    selectedRows_2 = value_316(value_221_1558, value_1555, value_1556),
                    settings_3 = await persistOfflineSummarySettings(activeFriend_41, value_1557),
                    apiConfig_4 = resolveOfflineSummaryApiConfig(settings_3),
                    summary_6 = await requestOfflineSegmentSummary(
                        activeFriend_41,
                        selectedRows_2,
                        {
                            settings: settings_3,
                            apiConfig: apiConfig_4,
                        },
                    );
                return {
                    kind: 'segment',
                    friendId: String(activeFriend_41.id),
                    summary: summary_6,
                    settings: settings_3,
                    sourceMessageIds: selectedRows_2.map((row_6) => String(row_6.message.id)),
                    sourceFloorStart: selectedRows_2[0].floor,
                    sourceFloorEnd: selectedRows_2[selectedRows_2.length - 1].floor,
                    createdAt: Date.now(),
                };
            },
            getOfflineSpeechDisplayText_2 = async (value_1564, value_1565, value_1566 = null) => {
                if (!value_1564 || !value_1565 || value_1565.kind !== 'segment')
                    throw new Error('Invalid offline summary draft');
                const messages_14 = value_221(value_1564),
                    value_316_1568 = value_316(
                        messages_14,
                        value_1565.sourceFloorStart,
                        value_1565.sourceFloorEnd,
                    ),
                    sourceMessageIds_2 = value_1565.sourceMessageIds.map(String);
                if (
                    value_316_1568.length !== sourceMessageIds_2.length ||
                    value_316_1568.some(
                        (value_1575, value_1576) =>
                            String(value_1575.message.id) !== sourceMessageIds_2[value_1576],
                    )
                )
                    throw new Error('Summary source floors changed');
                const content_29 = String(
                    value_1566 == null ? value_1565.summary : value_1566,
                ).trim();
                if (!content_29) throw new Error('Offline summary is empty');
                const summaryId_3 = createOfflineChatId('offline-summary'),
                    summaryMessage_5 = {
                        id: summaryId_3,
                        role: 'system',
                        type: type_3,
                        content: content_29,
                        sourceMessageIds: sourceMessageIds_2,
                        sourceFloorStart: value_316_1568[0].floor,
                        sourceFloorEnd: value_316_1568[value_316_1568.length - 1].floor,
                        timestamp: Date.now(),
                    },
                    selectedIds = new Set(summaryMessage_5.sourceMessageIds),
                    nextMessages_3 = messages_14
                        .map((message_35) =>
                            selectedIds.has(String(message_35.id || '')) ||
                            (isOfflineAutoImageMessage(message_35) &&
                                selectedIds.has(String(message_35.sourceMessageId || '')))
                                ? {
                                      ...message_35,
                                      archivedBySummaryId: summaryId_3,
                                  }
                                : message_35,
                        )
                        .concat(summaryMessage_5);
                await persistOfflineMessages(value_1564, nextMessages_3);
                const value_1574 = window.imApp?.getFriendById?.(value_1564.id) || value_1564;
                return (
                    renderOfflineCurrentMessages(value_1574, {
                        preserveScroll: true,
                    }),
                    summaryMessage_5
                );
            },
            value_319 = async (original_4, value_1579, value_1580, value_1581 = {}) => {
                const translation_5 = await value_317(
                    original_4,
                    value_1579,
                    value_1580,
                    value_1581,
                );
                return getOfflineSpeechDisplayText_2(original_4, translation_5);
            },
            persistOfflineSummarySettings_2 = async (activeFriend_42, value_1584 = {}) => {
                const messages_15 = value_221(activeFriend_42);
                if (messages_15.length === 0) throw new Error('No offline meeting content');
                const endedAt_5 = Date.now(),
                    settings_4 = await persistOfflineSummarySettings(activeFriend_42, value_1584),
                    value_1588 = await requestOfflineMeetingSummary(activeFriend_42, messages_15, {
                        settings: settings_4,
                        apiConfig: resolveOfflineSummaryApiConfig(settings_4),
                    }),
                    identityContext_5 = getOfflineIdentityContext(activeFriend_42),
                    dateText_2 = formatOfflineMeetingDate(endedAt_5),
                    parsed_8 = window.imDataUtils?.parseOfflineMeetingArtifacts
                        ? window.imDataUtils.parseOfflineMeetingArtifacts(value_1588, {
                              dateText: dateText_2,
                              userName: identityContext_5.userName,
                              charName: identityContext_5.charName,
                              isGroup: identityContext_5.isGroup,
                          })
                        : null;
                if (!parsed_8?.meetingSummary?.summary)
                    throw value_308('invalid_artifacts', 'Invalid offline meeting artifacts', {
                        detail: value_1588,
                    });
                const sessionId_8 =
                        activeFriend_42.offlineCurrentSessionId ||
                        createOfflineChatId('offline-session'),
                    meetingSummary_2 = parsed_8.meetingSummary;
                return {
                    kind: 'end',
                    friendId: String(activeFriend_42.id),
                    settings: settings_4,
                    endedAt: endedAt_5,
                    dateText: dateText_2,
                    sessionId: sessionId_8,
                    messages: cloneOfflineMeetingMessages(messages_15),
                    meetingSummary: {
                        title: String(meetingSummary_2.title || '线下见面'),
                        summary: String(meetingSummary_2.summary || '').trim(),
                    },
                    parsed: parsed_8,
                };
            },
            value_321 = async (value_1594, parsed_9, actionButton_2 = null) => {
                if (!value_1594 || !parsed_9 || parsed_9.kind !== 'end')
                    throw new Error('Invalid offline meeting draft');
                if (parsed_9.friendId && String(parsed_9.friendId) !== String(value_1594.id))
                    throw new Error('Offline meeting draft belongs to another chat');
                const value_221_1597 = value_221(value_1594);
                if (!value_221_1597.length) throw new Error('No offline meeting content');
                const map_1598 = (Array.isArray(parsed_9.messages) ? parsed_9.messages : []).map(
                        (value_1600) => String(value_1600?.id || ''),
                    ),
                    map_1599 = value_221_1597.map((value_1601) => String(value_1601?.id || ''));
                if (
                    map_1598.length !== map_1599.length ||
                    map_1598.some((value_1602, value_1603) => value_1602 !== map_1599[value_1603])
                )
                    throw new Error('Offline meeting changed');
                actionButton_2 &&
                    ((actionButton_2.dataset.busy = 'true'),
                    (actionButton_2.style.opacity = '0.45'),
                    (actionButton_2.style.pointerEvents = 'none'));
                try {
                    if (window.imApp?.ensureFriendMessagesLoaded)
                        await window.imApp.ensureFriendMessagesLoaded(value_1594);
                    const endedAt_4 = Number(parsed_9.endedAt) || Date.now(),
                        dateText_3 = parsed_9.dateText || formatOfflineMeetingDate(endedAt_4),
                        sessionId_7 =
                            parsed_9.sessionId ||
                            value_1594.offlineCurrentSessionId ||
                            createOfflineChatId('offline-session'),
                        meetingSummary_3 = parsed_9.meetingSummary,
                        parsed_10 = parsed_9.parsed,
                        session_12 = {
                            id: sessionId_7,
                            startedAt:
                                Number(value_1594.offlineMeetingStartedAt) ||
                                parsed_9.messages?.[0]?.timestamp ||
                                endedAt_4,
                            endedAt: endedAt_4,
                            messages: cloneOfflineMeetingMessages(
                                parsed_9.messages || value_221_1597,
                            ),
                            dateText: dateText_3,
                            title: meetingSummary_3.title,
                            summary: meetingSummary_3.summary,
                            rawSummary: [
                                '标题：' + meetingSummary_3.title,
                                '见面内容：' + meetingSummary_3.summary,
                            ].join(`
`),
                        },
                        memoryEntry = {
                            ...parsed_10.shortTermMemory,
                            id: 'stm-offline-' + sessionId_7,
                            time: dateText_3,
                            degree: '高',
                            sourceType: 'offline_meeting',
                            sourceId: String(sessionId_7),
                        },
                        content_16 = [
                            dateText_3,
                            meetingSummary_3.title,
                            meetingSummary_3.summary,
                        ].filter(Boolean).join(`

`),
                        recordMsg = {
                            id: createOfflineChatId('meeting'),
                            role: 'system',
                            type: OFFLINE_MEETING_RECORD_TYPE,
                            offlineSessionId: sessionId_7,
                            endedAt: endedAt_4,
                            dateText: dateText_3,
                            title: meetingSummary_3.title,
                            summary: meetingSummary_3.summary,
                            rawSummary: session_12.rawSummary,
                            content: content_16,
                            text: '见面记录：' + meetingSummary_3.title,
                            timestamp: endedAt_4,
                        },
                        value_1611 = await commitSheetFriendChange(
                            value_1594.id,
                            (targetFriend_14) => {
                                if (!Array.isArray(targetFriend_14.messages))
                                    targetFriend_14.messages = [];
                                targetFriend_14.messages = targetFriend_14.messages.filter(
                                    (message_36) =>
                                        !(
                                            (message_36?.type === 'system_notice' &&
                                                message_36.noticeKind ===
                                                    OFFLINE_ACTIVE_NOTICE_KIND) ||
                                            (message_36?.type === OFFLINE_MEETING_RECORD_TYPE &&
                                                String(message_36.offlineSessionId || '') ===
                                                    String(sessionId_7))
                                        ),
                                );
                                targetFriend_14.messages.push(recordMsg);
                                if (window.imApp?.reindexFriendMessages)
                                    window.imApp.reindexFriendMessages(targetFriend_14);
                                if (window.imApp?.syncFriendMessageSummary)
                                    window.imApp.syncFriendMessageSummary(targetFriend_14);
                                targetFriend_14.offlineMeetingSessions = (
                                    Array.isArray(targetFriend_14.offlineMeetingSessions)
                                        ? targetFriend_14.offlineMeetingSessions
                                        : []
                                )
                                    .filter(
                                        (item_20) =>
                                            String(item_20?.id || '') !== String(sessionId_7),
                                    )
                                    .concat(session_12);
                                window.imApp.applyGeneratedShortTermMemory(
                                    targetFriend_14,
                                    memoryEntry,
                                    {
                                        activatedEntryIds: parsed_10.activatedEntryIds,
                                        now: new Date(endedAt_4),
                                        nowString: dateText_3,
                                        updateSummaryCursor: false,
                                    },
                                );
                                targetFriend_14.offlineMessages = [];
                                targetFriend_14.offlineMeetingActive = false;
                                targetFriend_14.offlineCurrentSessionId = null;
                                targetFriend_14.offlineMeetingStartedAt = null;
                                if (window.imApp?.clearFriendRuntimeMessageContext)
                                    window.imApp.clearFriendRuntimeMessageContext(targetFriend_14);
                                if (window.imApp?.syncActiveFriendReference)
                                    window.imApp.syncActiveFriendReference(targetFriend_14);
                                if (window.imApp?.syncSettingsFriendReference)
                                    window.imApp.syncSettingsFriendReference(targetFriend_14);
                            },
                            {
                                silent: true,
                                includeMessages: true,
                                immediate: true,
                                onRollback: () => {
                                    const currentActiveFriend_2 = window.imApp?.getFriendById?.(
                                        value_1594.id,
                                    );
                                    if (!currentActiveFriend_2) return;
                                    window.imData?.currentActiveFriend &&
                                        String(window.imData.currentActiveFriend.id) ===
                                            String(currentActiveFriend_2.id) &&
                                        (window.imData.currentActiveFriend = currentActiveFriend_2);
                                    if (window.imApp?.syncActiveFriendReference)
                                        window.imApp.syncActiveFriendReference(
                                            currentActiveFriend_2,
                                        );
                                    if (window.imApp?.syncSettingsFriendReference)
                                        window.imApp.syncSettingsFriendReference(
                                            currentActiveFriend_2,
                                        );
                                },
                            },
                        );
                    if (!value_1611)
                        throw value_308('persistence', 'Failed to save offline meeting artifacts');
                    const value_1612 = window.imApp?.getFriendById?.(value_1594.id) || value_1594;
                    renderOfflineCurrentMessages(value_1612, {
                        preserveScroll: true,
                    });
                    rerenderOnlineChatForFriend(value_1612, {
                        scroll: true,
                    });
                    if (window.imApp?.renderMemoryView) window.imApp.renderMemoryView();
                    if (window.showToast)
                        window.showToast(
                            parsed_10.usedMemoryFallback
                                ? '见面记录已生成，短期记忆使用基础版本'
                                : '见面记录与短期记忆已生成',
                        );
                    return true;
                } finally {
                    actionButton_2 &&
                        ((actionButton_2.dataset.busy = 'false'),
                        (actionButton_2.style.opacity = ''),
                        (actionButton_2.style.pointerEvents = ''));
                }
            };
        async function handleAction_322(value_1616 = null, options_10 = {}) {
            const activeFriend_43 = window.imData.currentActiveFriend;
            if (!activeFriend_43) return false;
            try {
                if (window.showToast) window.showToast('正在生成见面总结...');
                const normalizedSettings = await persistOfflineSummarySettings_2(
                    activeFriend_43,
                    options_10.settings || getOfflineSummarySettings(activeFriend_43),
                );
                if (options_10.previewOnly) return normalizedSettings;
                return await value_321(activeFriend_43, normalizedSettings, value_1616);
            } catch (error_13) {
                return (
                    console.error('End offline meeting failed', error_13),
                    value_310('结束见面失败', error_13),
                    false
                );
            }
        }
        const value_323 = (() => {
            let value_1621 = null,
                count_1622 = 0;
            const value_1623 = () => document.getElementById('offline-result-preview-modal'),
                value_1624 = () => document.getElementById('offline-result-preview-title'),
                value_1625 = () => document.getElementById('offline-result-preview-subtitle'),
                value_1626 = () => document.getElementById('offline-result-preview-editor'),
                value_1627 = () => document.getElementById('offline-result-preview-textarea'),
                value_1628 = () => document.getElementById('offline-result-preview-readonly'),
                value_1629 = () => document.getElementById('offline-result-preview-regenerate'),
                value_1630 = () => document.getElementById('offline-result-preview-confirm'),
                value_1631 = (value_1633) => {
                    const disabled_2 = !!value_1633;
                    [
                        document.getElementById('offline-result-preview-cancel'),
                        value_1629(),
                        value_1630(),
                    ].forEach((value_1635) => {
                        if (value_1635) value_1635.disabled = disabled_2;
                    });
                },
                value_1632 = (value_1636) => {
                    const value_1623_1637 = value_1623();
                    if (!value_1623_1637) return;
                    value_1636
                        ? ((value_1623_1637.style.display = 'flex'),
                          void value_1623_1637.offsetWidth,
                          value_1623_1637.classList.add('active'))
                        : (value_1623_1637.classList.remove('active'),
                          setTimeout(() => {
                              value_1623_1637.style.display = 'none';
                          }, 180));
                };
            return {
                open(value_1638) {
                    value_1621 = {
                        ...value_1638,
                        token: ++count_1622,
                        busy: false,
                    };
                    const hidden_3 = value_1621.editable !== false;
                    if (value_1624()) value_1624().textContent = value_1621.title || '预览';
                    if (value_1625()) value_1625().textContent = value_1621.subtitle || '';
                    if (value_1626()) value_1626().hidden = !hidden_3;
                    if (value_1627()) value_1627().value = String(value_1621.text || '');
                    value_1628() &&
                        ((value_1628().hidden = hidden_3),
                        (value_1628().textContent = String(value_1621.text || '')));
                    value_1629() &&
                        ((value_1629().hidden = typeof value_1621.onRegenerate !== 'function'),
                        (value_1629().textContent = value_1621.regenerateText || '重新总结'));
                    if (value_1630())
                        value_1630().textContent = value_1621.confirmText || '确认保存';
                    return (value_1631(false), value_1632(true), value_1621.token);
                },
                getState() {
                    return value_1621;
                },
                getText() {
                    return String(value_1627()?.value || '').trim();
                },
                setBusy(value_1640) {
                    if (!value_1621) return;
                    value_1621.busy = !!value_1640;
                    value_1631(value_1621.busy);
                },
                update(value_1641) {
                    if (!value_1621) return;
                    value_1621 = {
                        ...value_1621,
                        ...value_1641,
                    };
                    if (value_1624()) value_1624().textContent = value_1621.title || '预览';
                    if (value_1625()) value_1625().textContent = value_1621.subtitle || '';
                    if (value_1627()) value_1627().value = String(value_1621.text || '');
                    if (value_1628()) value_1628().textContent = String(value_1621.text || '');
                },
                close() {
                    value_1621 = null;
                    ++count_1622;
                    value_1632(false);
                },
                isCurrent(value_1642) {
                    return !!value_1621 && value_1621.token === value_1642;
                },
            };
        })();
        window.imChat.openGeneratedResultPreview =
            window.imChat.openGeneratedResultPreview ||
            ((value_1643) => value_323.open(value_1643));
        window.imChat.getGeneratedResultPreviewState =
            window.imChat.getGeneratedResultPreviewState || (() => value_323.getState());
        window.imChat.getGeneratedResultPreviewText =
            window.imChat.getGeneratedResultPreviewText || (() => value_323.getText());
        window.imChat.updateGeneratedResultPreview =
            window.imChat.updateGeneratedResultPreview ||
            ((value_1644) => value_323.update(value_1644));
        window.imChat.setGeneratedResultPreviewBusy =
            window.imChat.setGeneratedResultPreviewBusy ||
            ((value_1645) => value_323.setBusy(value_1645));
        window.imChat.closeGeneratedResultPreview =
            window.imChat.closeGeneratedResultPreview || (() => value_323.close());
        window.imChat.isGeneratedResultPreviewCurrent =
            window.imChat.isGeneratedResultPreviewCurrent ||
            ((value_1646) => value_323.isCurrent(value_1646));
        const value_324 = value_25,
            value_325 = (value_1647, value_1648) => {
                const string_1649 = String(value_1647 || ''),
                    string_1650 = String(value_1648 || '');
                if (!string_1649) return string_1650;
                if (!string_1650) return string_1649;
                const min_1651 = Math.min(512, string_1649.length, string_1650.length);
                for (let value_1652 = min_1651; value_1652 > 0; value_1652 -= 1) {
                    if (string_1649.slice(-value_1652) === string_1650.slice(0, value_1652))
                        return string_1649 + string_1650.slice(value_1652);
                }
                return string_1649 + string_1650;
            };
        async function rerollOfflineAssistantMessage_2(messageId_7, value_1654 = null) {
            const currentActiveFriend_1655 = window.imData.currentActiveFriend;
            if (!currentActiveFriend_1655) return;
            if (isOfflineAutoImageMessage_2(currentActiveFriend_1655)) return;
            const rows_5 = value_221(currentActiveFriend_1655),
                index_6 = rows_5.findIndex(
                    (value_1671) => String(value_1671.id) === String(messageId_7),
                ),
                value_1658 = rows_5[index_6];
            if (
                index_6 < 0 ||
                value_1658?.role !== 'assistant' ||
                value_1658.continuationState !== 'available'
            )
                return;
            const bubble_7 = Array.from(document.querySelectorAll('.offline-chat-bubble')).find(
                    (value_1672) =>
                        String(value_1672.getAttribute('data-message-id') || '') ===
                        String(messageId_7),
                ),
                offlineChatBubbleTextElement_1660 = bubble_7?.querySelector(
                    '.offline-chat-bubble-text',
                ),
                metaEl_2 = bubble_7?.querySelector('.offline-chat-bubble-meta'),
                actionsEl_3 = bubble_7?.querySelector('.offline-chat-bubble-actions'),
                innerHTML_7 = offlineChatBubbleTextElement_1660?.innerHTML || '',
                textContent_3 = metaEl_2?.textContent || '',
                actionButtons = actionsEl_3
                    ? Array.from(actionsEl_3.querySelectorAll('button'))
                    : [],
                string_1665 = String(value_1658.content || '');
            let content_17 = string_1665,
                reasoning_2 = String(value_1658.reasoning || ''),
                value_1668 = Number(value_1658.tokens) || 0;
            const value_1669 = (streaming_2 = true) => {
                    if (!offlineChatBubbleTextElement_1660) return;
                    const parsed_11 = offlineReasoning
                        ? offlineReasoning.normalizeResponse(content_17, reasoning_2, {
                              streaming: streaming_2,
                          })
                        : {
                              content: content_17,
                              reasoning: reasoning_2,
                          };
                    renderOfflineThinkingState(bubble_7, parsed_11.reasoning, {
                        expanded: streaming_2 && !!parsed_11.reasoning,
                    });
                    const depth_4 = rows_5.length - 1 - index_6,
                        value_215_1676 = value_215(parsed_11.content, 'assistant', depth_4),
                        innerHTML_6 = streaming_2
                            ? ''
                            : value_220(parsed_11.content, 'assistant', depth_4, {
                                  messageId: messageId_7,
                                  enableVoice: isTtsEnabledForFriend(currentActiveFriend_1655),
                                  enableBarrage:
                                      isOfflineBarragePromptEnabled(currentActiveFriend_1655),
                                  enableChoices:
                                      isOfflineChoicesPromptEnabled(currentActiveFriend_1655),
                                  enableRecap: true,
                                  language: currentActiveFriend_1655?.language || 'zh',
                              });
                    offlineChatBubbleTextElement_1660.style.display = streaming_2
                        ? value_215_1676
                            ? ''
                            : 'none'
                        : innerHTML_6
                          ? ''
                          : 'none';
                    offlineChatBubbleTextElement_1660.classList.toggle('is-streaming', streaming_2);
                    if (streaming_2)
                        offlineChatBubbleTextElement_1660.textContent =
                            value_215_1676 || '正在继续生成...';
                    else offlineChatBubbleTextElement_1660.innerHTML = innerHTML_6;
                },
                streamingBubble_3 = {
                    appendContentChunk: (value_1678) => {
                        content_17 += String(value_1678 || '');
                        value_1669(true);
                    },
                    appendChunk: (value_1679) => {
                        content_17 += String(value_1679 || '');
                        value_1669(true);
                    },
                    appendReasoningChunk: (value_1680) => {
                        reasoning_2 += String(value_1680 || '');
                        value_1669(true);
                    },
                    finish: () => {
                        return (
                            value_1669(false),
                            {
                                content: content_17.slice(string_1665.length),
                                reasoning: reasoning_2,
                            }
                        );
                    },
                    getResult: () => ({
                        content: content_17.slice(string_1665.length),
                        reasoning: reasoning_2,
                    }),
                    getFullText: () => content_17,
                    setTokens: (value_1681) => {
                        value_1668 = Math.max(0, Number(value_1681) || 0);
                        if (metaEl_2)
                            metaEl_2.textContent =
                                '#' +
                                (index_6 + 1) +
                                ' · ' +
                                (value_1668 || estimateOfflineTextTokens(content_17)) +
                                ' tokens · ' +
                                formatOfflineBubbleTime(value_1658.timestamp);
                    },
                };
            actionButtons.forEach((actionButton) => {
                actionButton.disabled = true;
                actionButton.style.opacity = '0.45';
            });
            buildOfflineThinkingHtml_2(currentActiveFriend_1655, true);
            try {
                value_1669(true);
                const requestContext_2 = await value_296(
                        currentActiveFriend_1655,
                        rows_5.slice(0, index_6),
                    ),
                    items_1683 = Array.isArray(requestContext_2)
                        ? requestContext_2
                        : requestContext_2.messages,
                    max_1684 = Math.max(0, rows_5.length - 1 - index_6);
                items_1683.push({
                    role: 'assistant',
                    content: stripOfflineDecorativeMarkup(
                        value_217(value_1658.content, 'assistant', max_1684),
                    ),
                });
                items_1683.push({
                    role: 'user',
                    content:
                        '请从上一条回复中断的位置继续生成后续内容，只输出尚未生成的部分，不要重复已有文字。',
                });
                const message_1685 = await requestOfflineAssistantReplyWithCotValidation(
                        requestContext_2,
                        streamingBubble_3,
                        {
                            requestReasoning: true,
                        },
                    ),
                    content_18 = value_325(value_1658.content, message_1685.content),
                    slice_1687 = rows_5.slice();
                slice_1687[index_6] = {
                    ...value_1658,
                    content: splitOfflineAutoImageMarker(content_18).content,
                    reasoning: message_1685.reasoning || value_1658.reasoning || undefined,
                    tokens: message_1685.tokens || value_1668,
                    generationState: message_1685.truncated ? 'truncated' : undefined,
                    continuationState: message_1685.truncated ? 'available' : undefined,
                    generationError: message_1685.truncated ? 'stream_truncated' : undefined,
                    updatedAt: new Date().toISOString(),
                };
                const nextScene = splitOfflineAutoImageMarker(content_18).scene,
                    value_1689 = await persistOfflineMessages(
                        currentActiveFriend_1655,
                        slice_1687,
                        {
                            resetMessageIds: [messageId_7],
                        },
                    );
                if (nextScene)
                    await generateOfflineAutoImage(
                        currentActiveFriend_1655,
                        messageId_7,
                        nextScene,
                        value_1689,
                    );
                renderOfflineCurrentMessages(currentActiveFriend_1655, {
                    preserveScroll: true,
                });
                window.showToast?.(
                    message_1685.truncated ? '回复仍未生成完，可继续生成' : '回复已续写完成',
                );
            } catch (value_1690) {
                if (offlineChatBubbleTextElement_1660)
                    offlineChatBubbleTextElement_1660.innerHTML = innerHTML_7;
                if (metaEl_2) metaEl_2.textContent = textContent_3;
                renderOfflineCurrentMessages(currentActiveFriend_1655, {
                    preserveScroll: true,
                });
                console.error('Offline continuation failed', value_1690);
                window.showToast?.('续写失败，请稍后重试');
            } finally {
                buildOfflineThinkingHtml_2(currentActiveFriend_1655, false);
                actionButtons.forEach((actionButton_3) => {
                    actionButton_3.disabled = false;
                    actionButton_3.style.opacity = '';
                });
                if (value_1654) value_1654.disabled = false;
            }
        }
        async function rerollOfflineAssistantMessage(messageId_8, actionButton_6 = null) {
            const activeFriend_44 = window.imData.currentActiveFriend;
            if (!activeFriend_44) return;
            if (isOfflineAutoImageMessage_2(activeFriend_44)) return;
            if (actionButton_6 && actionButton_6.dataset.confirmed !== 'true') {
                const value_1709 = window.imApp?.showCustomModal || window.showCustomModal;
                if (value_1709) {
                    value_1709({
                        title: '确认重回',
                        message: '将重新生成这一条回复，生成完成后会直接替换原回复。',
                        confirmText: '继续生成',
                        onConfirm: () => {
                            actionButton_6.dataset.confirmed = 'true';
                            Promise.resolve(
                                rerollOfflineAssistantMessage(messageId_8, actionButton_6),
                            )['finally'](() => {
                                delete actionButton_6.dataset.confirmed;
                            });
                        },
                    });
                    return;
                }
                if (
                    typeof window.confirm === 'function' &&
                    !window.confirm('确认重新生成这条回复吗？生成完成后会直接替换原回复。')
                )
                    return;
            }
            const messages_16 = value_221(activeFriend_44),
                targetIndex = messages_16.findIndex(
                    (value_1710) => String(value_1710.id) === String(messageId_8),
                );
            if (targetIndex < 0 || messages_16[targetIndex].role !== 'assistant') return;
            const originalMessage = messages_16[targetIndex],
                bubble_8 = Array.from(document.querySelectorAll('.offline-chat-bubble')).find(
                    (value_1711) =>
                        String(value_1711.getAttribute('data-message-id') || '') ===
                        String(messageId_8),
                ),
                textEl_4 = bubble_8 ? bubble_8.querySelector('.offline-chat-bubble-text') : null,
                metaEl_3 = bubble_8 ? bubble_8.querySelector('.offline-chat-bubble-meta') : null,
                actionsEl_4 = bubble_8
                    ? bubble_8.querySelector('.offline-chat-bubble-actions')
                    : null,
                innerHTML_8 = textEl_4 ? textEl_4.innerHTML : '',
                display_3 = textEl_4 ? textEl_4.style.display : '',
                textContent_4 = metaEl_3 ? metaEl_3.textContent : '',
                actionButtons_2 = actionsEl_4
                    ? Array.from(actionsEl_4.querySelectorAll('button'))
                    : [],
                timestamp_4 = Date.now();
            let streamContent = '',
                streamReasoning = '';
            const getStreamResult = (streaming_3 = true) =>
                    offlineReasoning
                        ? offlineReasoning.normalizeResponse(streamContent, streamReasoning, {
                              streaming: streaming_3,
                          })
                        : {
                              content: streamContent,
                              reasoning: streamReasoning,
                          },
                renderStreamState = (streaming_4 = true) => {
                    if (!textEl_4 || !bubble_8) return;
                    const parsed_12 = getStreamResult(streaming_4),
                        depth_5 = messages_16.length - 1 - targetIndex,
                        content_19 = streaming_4
                            ? value_215(parsed_12.content, 'assistant', depth_5)
                            : value_218(parsed_12.content, 'assistant', depth_5).trim(),
                        value_1717 = streaming_4
                            ? ''
                            : value_220(parsed_12.content, 'assistant', depth_5, {
                                  messageId: messageId_8,
                                  enableVoice: isTtsEnabledForFriend(activeFriend_44),
                                  enableBarrage: isOfflineBarragePromptEnabled(activeFriend_44),
                                  enableChoices: isOfflineChoicesPromptEnabled(activeFriend_44),
                                  language: activeFriend_44?.language || 'zh',
                              });
                    renderOfflineThinkingState(bubble_8, parsed_12.reasoning, {
                        expanded: streaming_4 && !!parsed_12.reasoning,
                    });
                    textEl_4.style.display = '';
                    streaming_4
                        ? (textEl_4.textContent = content_19 || '正在重新思考...')
                        : ((textEl_4.innerHTML =
                              value_1717 ||
                              '<div class="offline-chat-reroll-placeholder">正在重新思考...</div>'),
                          bindOfflineChatTextControls(
                              bubble_8,
                              {
                                  ...originalMessage,
                                  content: content_19,
                                  timestamp: timestamp_4,
                              },
                              activeFriend_44,
                              targetIndex + 1,
                          ));
                },
                streamingBubble_4 = textEl_4
                    ? {
                          appendContentChunk: (value_1718) => {
                              streamContent += String(value_1718 || '');
                              renderStreamState(true);
                          },
                          appendReasoningChunk: (value_1719) => {
                              streamReasoning += String(value_1719 || '');
                              renderStreamState(true);
                          },
                          appendChunk: (value_1720) => {
                              streamContent += String(value_1720 || '');
                              renderStreamState(true);
                          },
                          finish: () => {
                              const result_6 = getStreamResult(false);
                              return (renderStreamState(false), result_6);
                          },
                          setTokens: (value_1722) => {
                              if (metaEl_3) {
                                  const max_1723 = Math.max(0, Number(value_1722) || 0);
                                  metaEl_3.textContent =
                                      '#' +
                                      (targetIndex + 1) +
                                      ' · ' +
                                      (max_1723 ||
                                          estimateOfflineTextTokens(
                                              streamReasoning +
                                                  `
` +
                                                  streamContent,
                                          )) +
                                      ' tokens · ' +
                                      formatOfflineBubbleTime(timestamp_4);
                              }
                          },
                          getResult: () => getStreamResult(false),
                          getFullText: () => streamContent,
                          reset: () => {
                              streamContent = '';
                              streamReasoning = '';
                              renderStreamState(true);
                          },
                      }
                    : null;
            actionButton_6 &&
                ((actionButton_6.disabled = true), (actionButton_6.style.opacity = '0.45'));
            actionButtons_2.forEach((actionButton_4) => {
                actionButton_4.disabled = true;
                actionButton_4.style.opacity = '0.45';
            });
            buildOfflineThinkingHtml_2(activeFriend_44, true);
            textEl_4 &&
                (renderOfflineThinkingState(bubble_8, ''),
                (textEl_4.dataset.rerolling = 'true'),
                (textEl_4.style.display = ''),
                (textEl_4.innerHTML =
                    '<div class="offline-chat-reroll-placeholder">正在重新思考...</div>'));
            try {
                const contextMessages = messages_16.slice(0, targetIndex),
                    requestContext_3 = await value_296(activeFriend_44, contextMessages),
                    {
                        content: content_20,
                        reasoning: reasoning_4,
                        tokens: tokens_3,
                        truncated: truncated_3,
                    } = await requestOfflineAssistantReplyWithCotValidation(
                        requestContext_3,
                        streamingBubble_4,
                        {
                            requestReasoning: true,
                        },
                    ),
                    slice_1731 = messages_16.slice(),
                    options_1732 = {
                        ...slice_1731[targetIndex],
                        content: splitOfflineAutoImageMarker(content_20).content,
                        reasoning: reasoning_4 || undefined,
                        tokens: tokens_3,
                        timestamp: timestamp_4,
                        updatedAt: new Date().toISOString(),
                        generationState: truncated_3 ? 'truncated' : undefined,
                        continuationState: truncated_3 ? 'available' : undefined,
                        generationError: truncated_3 ? 'stream_truncated' : undefined,
                    };
                slice_1731[targetIndex] = options_1732;
                const nextScene_2 = splitOfflineAutoImageMarker(content_20).scene,
                    filter_1734 = slice_1731.filter(
                        (value_1736, value_1737) =>
                            value_1737 === targetIndex ||
                            String(value_1736.sourceMessageId || '') !== String(messageId_8),
                    ),
                    value_1735 = await persistOfflineMessages(activeFriend_44, filter_1734, {
                        resetMessageIds: [messageId_8],
                    });
                if (nextScene_2)
                    await generateOfflineAutoImage(
                        activeFriend_44,
                        messageId_8,
                        nextScene_2,
                        value_1735,
                    );
                renderOfflineCurrentMessages(activeFriend_44, {
                    preserveScroll: true,
                });
                window.showToast?.('Offline reply regenerated');
                return;
            } catch (error_14) {
                textEl_4 &&
                    ((textEl_4.dataset.rerolling = 'false'),
                    (textEl_4.innerHTML = innerHTML_8),
                    (textEl_4.style.display = display_3),
                    textEl_4.querySelectorAll('[data-bound]').forEach((value_1739) => {
                        delete value_1739.dataset.bound;
                    }),
                    bindOfflineChatTextControls(
                        bubble_8,
                        originalMessage,
                        activeFriend_44,
                        targetIndex + 1,
                    ));
                if (metaEl_3) metaEl_3.textContent = textContent_4;
                renderOfflineCurrentMessages(activeFriend_44);
                console.error('Offline reroll failed', error_14);
                if (
                    !window.u2Api?.isRequestError?.(error_14) ||
                    !window.u2Api.reportError(error_14, {
                        operation: '线下重回',
                    })
                ) {
                    if (window.showToast)
                        window.showToast(
                            error_14?.code === 'reasoning_config_unsupported'
                                ? '当前接口不支持自动推理配置'
                                : error_14?.code === 'reasoning_tokens_exhausted'
                                  ? '思考已用完固定的 30000 回复 Token，请重试或更换模型'
                                  : error_14?.code === 'empty_response'
                                    ? '模型返回了空回复，请重试或更换模型'
                                    : '重回失败，请检查 API 配置或网络',
                        );
                }
            } finally {
                buildOfflineThinkingHtml_2(activeFriend_44, false);
                actionButtons_2.forEach((actionButton_5) => {
                    actionButton_5.disabled = false;
                    actionButton_5.style.opacity = '';
                });
                actionButton_6 &&
                    ((actionButton_6.disabled = false), (actionButton_6.style.opacity = ''));
            }
        }
        const value_328 = async () => {
                closeSheet();
                const chatView = document.getElementById('offline-chat-view');
                if (chatView) {
                    const offlineChatInputAreaElement = chatView.querySelector(
                        '.offline-chat-input-area',
                    );
                    if (offlineChatInputAreaElement) offlineChatInputAreaElement.style.display = '';
                    const titleEl_4 = chatView.querySelector('.offline-chat-title');
                    if (titleEl_4) titleEl_4.textContent = '线下';
                    const settingsBtn = chatView.querySelector('.offline-chat-settings');
                    if (settingsBtn) settingsBtn.style.display = '';
                    chatView.style.display = 'flex';
                    void chatView.offsetWidth;
                    chatView.classList.add('active');
                    const currentActiveFriend_1742 = window.imData.currentActiveFriend;
                    currentActiveFriend_1742 &&
                        (applyOfflineChatTheme_2(currentActiveFriend_1742),
                        await value_279(currentActiveFriend_1742),
                        renderOfflineCurrentMessages(currentActiveFriend_1742, {
                            scroll: true,
                            preserveScroll: false,
                            resetWindow: true,
                        }));
                }
            },
            OFFLINE_LEGACY_PROMPT_ID_BY_NAME = {
                破限和身份定义: 'role_identity',
                身份定义: 'role_identity',
                资料区: 'data_zone',
                语言和字数: 'length_words',
                字数要求: 'length_words',
                双语对话: 'bilingual_dialogue',
                NSFW: 'nsfw',
                文风基调: 'style_baimiao',
                '文风-白描': 'style_baimiao',
                '文风-创作指导': 'style_creative_guidance',
                文学指导: 'style_creative_guidance',
                创作指导: 'perspective_third',
                '创作指导-第一人称视角': 'perspective_first',
                '创作指导-第二人称视角': 'perspective_second',
                '创作指导-第三人称视角': 'perspective_third',
                弹幕评论: 'barrage_comments',
                玩家选项: 'player_choices',
                后续选项: 'player_choices',
                任务要求: 'task_instruction',
                记忆系统: 'memory_system',
                记忆区: 'memory_system',
                格式示例: 'format_rules',
                COT: 'cot',
                COT前: 'cot_before',
                COT内容: 'cot_content',
                'cot-情景规划': 'cot_scene_planning',
                'cot-文学指导': 'cot_literary_guidance',
                'cot-语言检查': 'cot_language_check',
                'cot-输出审查': 'cot_output_audit',
                COT后: 'cot_after',
            },
            createOfflineDefaultPrompts = () => [
                {
                    id: 'role_identity',
                    name: '身份定义',
                    enabled: true,
                    presetVersion: 3,
                    content: `<role_setting>
You are U2, not a character inside the story. You are a skilled editor and director creating a fictional cinematic roleplay scene.
{{user}} is the viewpoint center of the scene. {{char}} is the participating Char identity in a private scene, or the complete list of participating Char identities in a group scene.
Output language: Simplified Chinese (plain text).
Preserve their identities, relationship history, boundaries, and current emotional momentum. In a group scene, never treat the group itself as one speaking character.
Write as narrative fiction, not as a real-world assistant. Do not explain your process, policies, or system messages in the final prose.
Keep every scene grounded in concrete action, visible behavior, sensory detail, and continuity from the mounted context.
</role_setting>`,
                    editable: true,
                    deletable: false,
                },
                {
                    id: 'data_zone',
                    name: '资料区',
                    enabled: true,
                    content: `<data_zone>
System managed. Mounted world books, User persona, Char persona, and recent online/offline context are inserted here when sending.
</data_zone>`,
                    systemManaged: true,
                    editable: false,
                    deletable: false,
                    alwaysEnabled: true,
                },
                {
                    id: OFFLINE_CHAT_HISTORY_PROMPT_ID,
                    name: '上下文',
                    enabled: true,
                    content: '',
                    systemManaged: true,
                    editable: false,
                    deletable: false,
                    alwaysEnabled: true,
                    presetVersion: 3,
                },
                {
                    id: 'length_words',
                    name: '字数要求',
                    enabled: true,
                    content: `<length_requirement>
字数要求：最少800字，最多1200字。
正文必须分段输出。每段约100至150字，段落之间必须保留一个空行，不要把所有文字挤在同一个长段落里。
如果包含对白，仍要让叙述段落和对白自然分开，保持阅读呼吸感。
</length_requirement>`,
                    editable: true,
                    deletable: false,
                },
                {
                    id: 'bilingual_dialogue',
                    name: '双语对话',
                    enabled: true,
                    presetVersion: 1,
                    content: `<bilingual_dialogue>
All spoken dialogue in the response must use {{char}}'s default language configured in Chat Settings.
When the default language is not Chinese, every spoken line must use this exact format without variation: 「default-language dialogue（Chinese translation）」. Example: 「잘자（晚安）」.
The text before the full-width parentheses must contain only the default-language dialogue. The text inside the parentheses must contain only its Chinese translation.
When the default language is Chinese, output only Chinese dialogue in corner quotes, for example: 「晚安」. Do not append a duplicate Chinese translation.
</bilingual_dialogue>`,
                    editable: true,
                    deletable: false,
                },
                {
                    id: 'nsfw',
                    name: 'NSFW',
                    enabled: true,
                    content: `<nsfw_rules>
允许符合当前角色关系、场景和用户设定的成人向描写。不要机械跳过情绪、动作、环境和人物反应。
</nsfw_rules>`,
                    editable: true,
                    deletable: false,
                },
                {
                    id: 'style_creative_guidance',
                    name: '文学指导',
                    enabled: true,
                    presetVersion: 4,
                    content: `<literary_guidance>
Literary Writing Guidance

I. Fundamental Logic

1. Narrative Principle
Summary and dramatized scene work should complement each other. Use concise narration to move through routine events, transitions, elapsed time, and background information. Fully dramatize emotional turns, character decisions, and other crucial moments through concrete scenes and detailed development; never rush past them.

2. Principle of Restraint
Reveal only a small portion of emotion and background information, leaving most of it beneath the surface. Imply emotion through actions, details, and contrasting scenery instead of directly stating that someone is sad or happy. What remains unsaid should carry more force than explanation.

3. Form Serves Content
Every description, figure of speech, and plot arrangement must shape character, advance conflict, or deepen theme. Remove ornamental language and showy description that do not serve the central story.

4. Narrative Distance
Deliberately adjust the emotional, moral, temporal, and cognitive distance between reader and character. Excessive closeness can erase suspense; excessive distance can flatten character. Control how much the reader knows and when that knowledge arrives.

5. Timeline
Anchor fragments of the past to concrete objects, sounds, and situations in the present so that memory arises naturally instead of entering as a forced flashback. Let past and present echo each other to deepen emotional history without interrupting narrative flow.

II. Language and Prose Rules

1. Diction
Prefer short, concrete words and active constructions. Remove unnecessary adverbs and clichés. Replace abstract emotion words with specific images and objects. Break this rule only for a deliberate artistic effect.

2. Rhythm
Use longer, flowing sentences in quiet or reflective scenes so the prose can breathe. Use short, fractured sentences in tense or confrontational scenes to create pressure and urgency. Alternate sentence lengths instead of maintaining one rhythm throughout.

3. Single-Sense Focus
When describing a scene, select one representative sensory detail rather than piling up adjectives to intensify the effect. Metaphors must arise from the character's own experience and viewpoint, never from the author's desire to display elegant language.

4. Minimalist Expression
Resist ornamental language. Let plain, everyday details carry emotional weight. Revise by subtraction: remove excess lines and repeated statements that express the same idea.

5. Emotion Through Scenery
In calm moments, let the environment harmonize with the character's state of mind. At emotional turns or breaking points, contrasting scenery may deepen the emotional layers.

6. Literary Reference and Emulation
Draw extensively on and emulate relevant literary classics.

III. Character, Dialogue, and Foreshadowing

1. Echoing Details
Objects, lines, and habits deliberately introduced earlier should later receive resolution or serve a purpose. Avoid useless incidental details, or keep them extremely brief.

2. Subtextual Dialogue
Characters rarely state their true thoughts directly. They conceal them through avoidance, testing questions, counterquestions, and changes of subject. Include pauses and interruptions so dialogue feels natural. Give every character distinct speaking logic and verbal habits; avoid making every voice sound alike. Use actions instead of emotional dialogue tags. Say less and do more.

3. Open-Ended Conclusions
Close with an incomplete sentence or a quiet image instead of explaining the emotion and theme in full. The emotional arc may move from repression, to a restrained release, and finally back into silence.
</literary_guidance>`,
                    editable: true,
                    deletable: false,
                },
                {
                    id: 'style_baimiao',
                    name: '文风-白描',
                    enabled: true,
                    content: `<writing_style name="文风-白描">
Use plain description. Prefer nouns and verbs over adjectives.
Show emotion through actions, objects, silence, distance, light, sound, smell, and touch.
Avoid ornate metaphors, abstract emotional labels, and author commentary.
Keep sentences clean and concrete. Let the reader infer what the characters feel from what they do.
</writing_style>`,
                    editable: true,
                    deletable: false,
                },
                {
                    id: 'style_green_apple',
                    name: '文风-青苹果',
                    enabled: false,
                    presetVersion: 3,
                    content: `<writing_style name="文风-青苹果">
一、基调
温柔清透，留白感强。心动靠细节和沉默传递，不靠直白告白或浓烈抒情。舞台多为日常场景：教室、放学路、屋顶、便利店、雨天共伞。

二、句子节奏
短句为主，长短交错；关键瞬间用短句甚至单句成段"定格"。多用"……"表现欲言又止。对话与描写穿插，避免大段连续叙述。

三、描写重点
- 环境：光线、季节、声音（风声、脚步声）点到为止，做情绪的"容器"，不堆砌辞藻。
- 动作：小动作最出彩——耳朵发红、绞衣角、视线飘忽、欲靠近又退开半步。
- 心理：用陌生化比喻代替直说，避免"心如撞鹿""脸红如苹果"式老套修辞。

四、对话风格
口语化、简短，害羞时有短暂沉默或话题被岔开。拌嘴、反差萌制造心动，少用"喜欢"之类直白词汇。

五、甜度把控
一次互动只放大1个心动瞬间，不堆叠高糖桥段。结尾常留白或转移话题，不把情绪说满。

六、禁忌
不用夸张比喻、不堆砌形容词、不写大段爱意宣言，不写狗血冲突或突兀的剧烈情绪转折。

七、技巧参考（仿写示范，非引用原文）
- 环境即情绪（新海诚式）：
　雨伞骨架滴着水，屋檐下的光线被切成一格一格。她没说话，我也没问。
- 轻语气藏重量（住野夜式）：
　"如果明天世界毁灭，你会先做什么？"
　"先把作业写完吧，不然很亏。"
- 短句定格（时间暂停感）：
　风停了。她的头发还在动。我盯着那一秒，没敢眨眼。
- 拌嘴式反差萌（有川浩式）：
　"你干嘛看我。"
　"没看你，看你后面的猫。"
　"这里哪来的猫。"
</writing_style>`,
                    editable: true,
                    deletable: false,
                },
                {
                    id: 'perspective_first',
                    name: '创作指导-第一人称视角',
                    enabled: false,
                    content: `<perspective_rule type="first_person">
Use first-person narration. "I" refers to User.
Only narrate what User can directly see, hear, feel, remember, or infer from the scene.
Do not reveal Char's private thoughts unless they are expressed through visible behavior or dialogue.
</perspective_rule>`,
                    editable: true,
                    deletable: false,
                },
                {
                    id: 'perspective_second',
                    name: '创作指导-第二人称视角',
                    enabled: false,
                    content: `<perspective_rule type="second_person">
Use second-person narration. "You" refers to User.
Keep the camera close to User's perception and bodily experience.
Do not summarize information that User cannot perceive inside the current scene.
</perspective_rule>`,
                    editable: true,
                    deletable: false,
                },
                {
                    id: 'perspective_third',
                    name: '创作指导-第三人称视角',
                    enabled: true,
                    presetVersion: 2,
                    content: `<perspective_rule type="third_person">
必须使用以 {{user}} 为主导、为中心的第三人称限定视角。这是第三人称叙事，不得用“我”代替 {{user}}，也不得把正文写成对 {{user}} 使用“你”的第二人称叙事。
叙事镜头优先贴近 {{user}} 当下能够看见、听见、触碰、回忆或合理推断的内容，并由 {{user}} 的动作、选择和注意力带动剧情。
不得随意进入 {{char}} 的内心或使用全知总结；Char 的情绪、动机和隐私必须通过动作、对白、停顿、表情及场景线索呈现。
群聊场景仍以 {{user}} 为视角锚点，同时观察成员之间的关系、反应与彼此影响，形成层次清楚的群像，而不是轮流点名发言。
</perspective_rule>`,
                    editable: true,
                    deletable: false,
                },
                {
                    id: 'barrage_comments',
                    name: '弹幕评论',
                    enabled: true,
                    presetVersion: 3,
                    content: `<barrage_comment_rules>
This rule is enabled by default, but the user may turn it off in the offline settings.
When enabled, keep using it in every later offline reply for this character unless the user disables the setting.
Output only barrage comment text. The frontend will create exactly one barrage button after the prose and will generate random likes.
After all prose is finished, add one plain text section headed exactly:
【弹幕】
Then write at least 10 short audience-style comments, one comment per line.
Every line must include the viewer name and content in this exact plain text shape:
观众名字：评论内容
Do not output likes, numbers, XML, HTML, JSON, buttons, labels, or UI instructions.
Comments should sound like viewers reading a novel or watching a film: react to tension, notice details, guess what may happen next, praise the protagonist, or lightly tease the plot.
Do not let barrage comments change the story. They are UI reactions only, not canon and not dialogue.
</barrage_comment_rules>`,
                    editable: true,
                    deletable: false,
                },
                {
                    id: 'player_choices',
                    name: '玩家选项',
                    enabled: true,
                    presetVersion: 2,
                    content: `<player_choice_rules>
After the final narrative paragraph and any barrage section, output only choice button text. The frontend will create all buttons and option UI.
Add one plain text section headed exactly:
【选项】
Then write exactly 3 short choices, one choice per line. Do not output XML, HTML, JSON, button markup, numbering requirements, or UI instructions.
Each choice should be about 10 Chinese characters, actionable, and able to lead naturally into the next scene or deepen the current tension.
Do not make choices generic. Tie them to the current scene, relationship, objects, and unresolved momentum.
</player_choice_rules>`,
                    editable: true,
                    deletable: false,
                },
                {
                    id: 'task_instruction',
                    name: '任务要求',
                    enabled: true,
                    presetVersion: 2,
                    content: `<task_instruction>
根据当前剧情、人物动机和最近互动推进故事。优先承接 {{user}} 的最新动作或话语。
处理好互动、对白、身体动作、环境变化和场景节奏，不要只做解释或总结。
若 {{char}} 包含多位群成员，每轮依据最新输入和剧情连续性选取 1 至 2 位主要 Char 重点推动当前片段；其他成员可通过短暂反应、插话、行动和成员间关系自然参与，保持群像小说般的整体感。不要随机轮换主角，也不要让所有成员机械地平均发言。
一件事情不得在一次回复中从开端直接写到完整结局。每轮只推进当前阶段，保留尚未完成的动作、仍在变化的关系或未解决的矛盾。
结尾必须留白：停在一个自然的动作、视线、声音、悬念或等待 {{user}} 决定的节点。不要用总结句收束事件，不要替 {{user}} 做出下一步选择，也不要一次性解决全部问题。
</task_instruction>`,
                    editable: true,
                    deletable: false,
                },
                {
                    id: 'memory_system',
                    name: '记忆区',
                    enabled: true,
                    content: `<memory_system>
System managed. Vectorized Char short-term, long-term, and cherished memories are inserted here when sending.
</memory_system>`,
                    systemManaged: true,
                    editable: false,
                    deletable: false,
                    alwaysEnabled: true,
                },
                {
                    id: 'format_rules',
                    name: '格式示例',
                    enabled: true,
                    presetVersion: 2,
                    content: `<formatting_rules>
Output narrative prose only. Do not output JSON or Markdown code fences.
Use normal paragraph prose with a blank line between paragraphs.
Every spoken line from Char must be wrapped in Chinese corner quotes, for example: 「我在这里。」 Do not write bare Char dialogue and do not use "Char: dialogue" labels.
If barrage comments are enabled, append exactly one plain 【弹幕】 section after all prose, containing at least 10 lines in the shape 观众名字：评论内容. Do not output likes; the frontend controls random likes.
If player choices are enabled, append a plain 【选项】 section containing exactly three choice text lines.
Do not output XML tags such as <speech>, <barrages>, <barrage>, <choices>, or <choice>; the frontend owns all UI.
If a <thinking> block is produced for the frontend, put it before the prose and keep the final prose outside it.
</formatting_rules>`,
                    editable: true,
                    deletable: false,
                },
                {
                    id: 'offline_recap_haru',
                    name: '线下回顾byHaru',
                    enabled: false,
                    presetVersion: 2,
                    content: `AI 必须在每轮正文回复的末尾，严格维护并更新【回顾】模块。

【继承与更新硬性法则】（重点）
在生成【回顾】前，你必须读取上一轮回复末尾的所有【回顾】内容：
1. **内容继承**：你必须原样保留上一轮已有的所有“短期回顾”条目（1 到 N 条），绝对不能遗漏或删减！
2. **递增追加**：在继承的历史条目下方，追加 1 条当轮产生的新回顾。
3. **计数更新**：若上一轮是（N/10），本轮标题必须更新为（N+1/10）。严禁每轮都重新重置为（1/10）！

【回顾板块格式要求】
在所有正文内容结束后，添加独立标题行：
【回顾】
标题下方分为“短期回顾”和“长期回顾”两个独立板块。

【短期回顾机制】
1. 标识格式：短期回顾（x/10）
2. 单条字数：严格控制在 20-50 字之间。
3. 满额归档重置（当达到 10/10 时）：
- 当上一轮短期回顾已达到（10/10）时，在当前轮次触发归档。
- 归档操作：将旧的 10 条短期回顾中具备纪念意义的核心事件，提炼融合为 1 条约 200 字的“长期回顾”，永久追加到【长期回顾】板块。
- 重置操作：清空旧的 10 条短期回顾，仅保留当前轮次生成的新回顾，计数重置为：短期回顾（1/10）。

【长期回顾机制】
1. 标识格式：长期回顾（永久）
2. 永久保留：归档生成的长期回顾一旦写入，后续每轮必须原样完整保留，不可删除。

【多轮演化示范】（必须严格遵守此递增逻辑）
▶ 第一轮输出示例：
【回顾】
短期回顾（1/10）：
1. 在星月湖公园长椅上，将祖传的银色怀表送给了对方，并约定每年初雪在此相见。（36字）
2. 下一条接上
长期回顾：
无
▶ 第二轮输出示例（必须原样继承第1条，并追加第2条，计数变为2/10）：
【回顾】
短期回顾（2/10）：
1. （上一条）在星月湖公园长椅上，将祖传的银色怀表送给了对方，并约定每年初雪在此相见。（36字）
2. 共同在路边救助并领养了一只白色的三花幼猫，给它取名“奶油”。（28字）
3. 下一条接上直到10
长期记忆：
无`,
                    editable: true,
                    deletable: false,
                },
                {
                    id: 'cot_before',
                    name: 'COT前',
                    enabled: true,
                    presetVersion: 6,
                    content: `请先思考并逐项检查：
<thinking>`,
                    editable: true,
                    deletable: false,
                },
                {
                    id: 'cot_scene_planning',
                    name: 'cot-情景规划',
                    enabled: true,
                    presetVersion: 3,
                    content:
                        '是否结合世界书、人设、记忆、线上与线下上下文及角色动机规划当前情景；是否承接前文、避免重复，并推进下一步因果发展。',
                    editable: true,
                    deletable: false,
                },
                {
                    id: 'cot_literary_guidance',
                    name: 'cot-文学指导',
                    enabled: true,
                    presetVersion: 4,
                    content:
                        '是否遵循已启用的 <literary_guidance> 标签；是否仿写并参照至少三部与当前题材、风格相关的名著。',
                    editable: true,
                    deletable: false,
                },
                {
                    id: 'cot_language_check',
                    name: 'cot-语言检查',
                    enabled: true,
                    presetVersion: 3,
                    content:
                        '是否按照角色默认语言书写台词；非中文台词是否紧跟准确的中文翻译，并使用规定的直角引号和全角括号。',
                    editable: true,
                    deletable: false,
                },
                {
                    id: 'cot_output_audit',
                    name: 'cot-输出审查',
                    enabled: true,
                    presetVersion: 3,
                    content:
                        '是否遵循全部启用的格式规则与任务要求；是否保持情节连续并输出所有必需部分；是否将思考完整留在 <thinking> 内、正文置于标签后。',
                    editable: true,
                    deletable: false,
                },
                {
                    id: 'cot_read_previous_recap_haru',
                    name: 'cot-读取上轮回顾byHaru',
                    enabled: false,
                    presetVersion: 1,
                    content: `是否读取了上一轮线下回复中的所有回顾里的内容：
[记忆机制自查]
1. 历史回顾继承：检查是否已完整读取上一条回复中的所有“短期回顾”与“长期回顾”？必须将其原封不动地复制保留在当轮的【回顾】模块中。
2. 满额检测与状态转换：
- 若上一条短期回顾未满（N < 10）：在继承的短期回顾下方，以 (N+1)/10 的格式追加当轮产生的新短期回顾（字数 20-50 字）。
- 若上一条短期回顾已满（10/10）：触发归档！清空旧的 10 条短期回顾，将这 10 条的核心事件提炼总结成 1 条新的长期回顾（约 200 字），追加至原有【长期回顾】末尾；同时生成当轮唯一的 1 条新短期回顾，格式重置为 1/10。`,
                    editable: true,
                    deletable: false,
                },
                {
                    id: 'cot_after',
                    name: 'COT后',
                    enabled: true,
                    presetVersion: 5,
                    content: '</thinking>',
                    editable: true,
                    deletable: false,
                },
            ],
            cloneOfflinePrompt = (defaultPrompt) => ({
                id: defaultPrompt.id,
                name: defaultPrompt.name,
                enabled: defaultPrompt.alwaysEnabled ? true : defaultPrompt.enabled !== false,
                content: defaultPrompt.content || '',
                cotEnabled:
                    typeof defaultPrompt.cotEnabled === 'boolean'
                        ? defaultPrompt.cotEnabled
                        : undefined,
                systemManaged: !!defaultPrompt.systemManaged,
                editable: defaultPrompt.editable !== false,
                deletable: !!defaultPrompt.deletable,
                alwaysEnabled: !!defaultPrompt.alwaysEnabled,
                presetVersion: Math.max(0, Number(defaultPrompt.presetVersion) || 0),
            }),
            slugOfflinePromptName = (name_3) =>
                String(name_3 || 'custom')
                    .trim()
                    .toLowerCase()
                    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
                    .replace(/^-+|-+$/g, '')
                    .slice(0, 32) || 'custom',
            orderOfflinePromptsForHistoryAnchor = (value_1745) => {
                const source_4 = Array.isArray(value_1745) ? value_1745 : [],
                    canonicalIds = new Set(OFFLINE_CHAT_PROMPT_ORDER),
                    builtInById = new Map(),
                    customBuckets = new Map();
                let precedingBuiltInId = '';
                const appendCustom = (anchorId, prompt_4) => {
                    const bucket = customBuckets.get(anchorId) || [];
                    bucket.push(prompt_4);
                    customBuckets.set(anchorId, bucket);
                };
                source_4.forEach((prompt_5) => {
                    const id_3 = String(prompt_5?.id || '');
                    if (canonicalIds.has(id_3) && !builtInById.has(id_3)) {
                        builtInById.set(id_3, prompt_5);
                        precedingBuiltInId = id_3;
                        return;
                    }
                    appendCustom(precedingBuiltInId, prompt_5);
                });
                const ordered = [...(customBuckets.get('') || [])];
                return (
                    OFFLINE_CHAT_PROMPT_ORDER.forEach((id_4) => {
                        const prompt_6 = builtInById.get(id_4);
                        if (prompt_6) ordered.push(prompt_6);
                        ordered.push(...(customBuckets.get(id_4) || []));
                    }),
                    ordered
                );
            },
            moveOfflineRecapBeforeFormatRules = (prompts_4) => {
                const ordered_2 = Array.isArray(prompts_4) ? prompts_4.slice() : [],
                    recapIndex = ordered_2.findIndex(
                        (prompt_7) => prompt_7?.id === 'offline_recap_haru',
                    ),
                    formatIndex = ordered_2.findIndex(
                        (value_1759) => value_1759?.id === 'format_rules',
                    );
                if (recapIndex < 0 || formatIndex < 0 || recapIndex === formatIndex - 1)
                    return ordered_2;
                const [recapPrompt] = ordered_2.splice(recapIndex, 1),
                    nextFormatIndex = ordered_2.findIndex(
                        (value_1760) => value_1760?.id === 'format_rules',
                    );
                return (ordered_2.splice(nextFormatIndex, 0, recapPrompt), ordered_2);
            },
            normalizeOfflinePrompts = (value_1761) => {
                const defaults = createOfflineDefaultPrompts(),
                    defaultById = new Map(defaults.map((prompt_8) => [prompt_8.id, prompt_8])),
                    source_5 = Array.isArray(value_1761) ? value_1761 : [];
                if (source_5.length === 0)
                    return orderOfflinePromptsForHistoryAnchor(defaults.map(cloneOfflinePrompt));
                const normalized = [],
                    usedIds = new Set(),
                    modularCotIds = [
                        'cot_scene_planning',
                        'cot_literary_guidance',
                        'cot_language_check',
                        'cot_read_previous_recap_haru',
                        'cot_output_audit',
                    ],
                    fullCotIds = ['cot_before', ...modularCotIds, 'cot_after'],
                    sourceIds_2 = new Set(
                        source_5.map((value_1772, value_1773) => {
                            const value_1774 =
                                    value_1772 && typeof value_1772 === 'object' ? value_1772 : {},
                                trim_1775 = String(value_1774.name || '').trim();
                            return (
                                value_1774.id ||
                                OFFLINE_LEGACY_PROMPT_ID_BY_NAME[trim_1775] ||
                                'custom-' + slugOfflinePromptName(trim_1775) + '-' + value_1773
                            );
                        }),
                    ),
                    historyAnchorOrderVersion = Math.max(
                        0,
                        Number(
                            source_5.find(
                                (prompt_9) => prompt_9?.id === OFFLINE_CHAT_HISTORY_PROMPT_ID,
                            )?.presetVersion,
                        ) || 0,
                    ),
                    recapOrderVersion = Math.max(
                        0,
                        Number(
                            source_5.find((prompt_10) => prompt_10?.id === 'offline_recap_haru')
                                ?.presetVersion,
                        ) || 0,
                    ),
                    appendMigratedCotPrompts = (cotIds, enabled_2) => {
                        cotIds.forEach((cotId) => {
                            if (
                                usedIds.has(cotId) ||
                                (sourceIds_2.has(cotId) && !['cot', 'cot_content'].includes(cotId))
                            )
                                return;
                            const cotDefault = defaultById.get(cotId);
                            if (!cotDefault) return;
                            const cotPrompt = cloneOfflinePrompt(cotDefault);
                            cotPrompt.enabled =
                                cotId === 'cot_read_previous_recap_haru' ? false : enabled_2;
                            normalized.push(cotPrompt);
                            usedIds.add(cotId);
                        });
                    };
                source_5.forEach((value_1779, value_1780) => {
                    const prompt_11 =
                            value_1779 && typeof value_1779 === 'object' ? value_1779 : {},
                        rawName_2 = String(prompt_11.name || '').trim(),
                        id_5 =
                            prompt_11.id ||
                            OFFLINE_LEGACY_PROMPT_ID_BY_NAME[rawName_2] ||
                            'custom-' + slugOfflinePromptName(rawName_2) + '-' + value_1780;
                    if (id_5 === 'cot') {
                        appendMigratedCotPrompts(fullCotIds, prompt_11.enabled !== false);
                        return;
                    }
                    if (id_5 === 'cot_content') {
                        appendMigratedCotPrompts(modularCotIds, prompt_11.enabled !== false);
                        return;
                    }
                    const defaultPrompt_2 = defaultById.get(id_5),
                        isDuplicateDefault = defaultPrompt_2 && usedIds.has(id_5);
                    if (isDuplicateDefault) {
                        const id_10 =
                            'custom-' +
                            slugOfflinePromptName(rawName_2 || defaultPrompt_2.name) +
                            '-' +
                            value_1780;
                        normalized.push({
                            id: id_10,
                            name: rawName_2 || defaultPrompt_2.name + ' 副本',
                            enabled: prompt_11.enabled !== false,
                            content: String(prompt_11.content || ''),
                            cotEnabled:
                                typeof prompt_11.cotEnabled === 'boolean'
                                    ? prompt_11.cotEnabled
                                    : undefined,
                            systemManaged: false,
                            editable: true,
                            deletable: true,
                            alwaysEnabled: false,
                        });
                        usedIds.add(id_10);
                        return;
                    }
                    if (defaultPrompt_2) {
                        const item_21 = cloneOfflinePrompt(defaultPrompt_2);
                        item_21.enabled = item_21.alwaysEnabled
                            ? true
                            : typeof prompt_11.enabled === 'boolean'
                              ? prompt_11.enabled
                              : item_21.enabled;
                        item_21.name =
                            rawName_2 && !item_21.systemManaged ? rawName_2 : defaultPrompt_2.name;
                        const presetVersion_2 = Math.max(
                                0,
                                Number(defaultPrompt_2.presetVersion) || 0,
                            ),
                            sourcePresetVersion = Math.max(0, Number(prompt_11.presetVersion) || 0),
                            refreshBuiltInContent =
                                (['style_creative_guidance', 'style_green_apple'].includes(id_5) ||
                                    fullCotIds.includes(id_5)) &&
                                sourcePresetVersion < presetVersion_2;
                        if (refreshBuiltInContent) item_21.name = defaultPrompt_2.name;
                        item_21.content =
                            item_21.systemManaged || refreshBuiltInContent
                                ? defaultPrompt_2.content
                                : typeof prompt_11.content === 'string'
                                  ? prompt_11.content
                                  : defaultPrompt_2.content;
                        id_5 === 'barrage_comments' &&
                            ((item_21.alwaysEnabled = false),
                            (item_21.enabled =
                                typeof prompt_11.enabled === 'boolean'
                                    ? prompt_11.enabled
                                    : item_21.enabled));
                        item_21.presetVersion = presetVersion_2;
                        normalized.push(item_21);
                        usedIds.add(id_5);
                        return;
                    }
                    normalized.push({
                        id: id_5,
                        name: rawName_2 || '自定义条目',
                        enabled: prompt_11.enabled !== false,
                        content: String(prompt_11.content || ''),
                        cotEnabled:
                            typeof prompt_11.cotEnabled === 'boolean'
                                ? prompt_11.cotEnabled
                                : undefined,
                        systemManaged: false,
                        editable: true,
                        deletable: prompt_11.deletable !== false,
                        alwaysEnabled: false,
                    });
                    usedIds.add(id_5);
                });
                defaults.forEach((defaultPrompt_3) => {
                    if (!usedIds.has(defaultPrompt_3.id)) {
                        const missingPrompt = cloneOfflinePrompt(defaultPrompt_3);
                        if (defaultPrompt_3.id === 'style_green_apple') {
                            const styleIndex = normalized.findIndex(
                                (prompt_12) => prompt_12.id === 'style_baimiao',
                            );
                            normalized.splice(
                                styleIndex >= 0 ? styleIndex + 1 : normalized.length,
                                0,
                                missingPrompt,
                            );
                        } else {
                            if (defaultPrompt_3.id === 'offline_recap_haru') {
                                const formatIndex_2 = normalized.findIndex(
                                    (prompt_13) => prompt_13.id === 'format_rules',
                                );
                                normalized.splice(
                                    formatIndex_2 >= 0 ? formatIndex_2 : normalized.length,
                                    0,
                                    missingPrompt,
                                );
                            } else {
                                if (modularCotIds.includes(defaultPrompt_3.id)) {
                                    const cotAfterIndex = normalized.findIndex(
                                        (prompt_14) => prompt_14.id === 'cot_after',
                                    );
                                    normalized.splice(
                                        cotAfterIndex >= 0 ? cotAfterIndex : normalized.length,
                                        0,
                                        missingPrompt,
                                    );
                                } else normalized.push(missingPrompt);
                            }
                        }
                        usedIds.add(defaultPrompt_3.id);
                    }
                });
                const orderedPrompts =
                    historyAnchorOrderVersion >= 3
                        ? normalized
                        : orderOfflinePromptsForHistoryAnchor(normalized);
                return recapOrderVersion >= 2
                    ? orderedPrompts
                    : moveOfflineRecapBeforeFormatRules(orderedPrompts);
            },
            serializeOfflinePrompts = (prompts_5) =>
                JSON.stringify((prompts_5 || []).map((prompt_15) => cloneOfflinePrompt(prompt_15))),
            value_335 = (value_1801) =>
                offlineRegexEngine
                    ? offlineRegexEngine.normalizeTextReplacementRules(value_1801)
                    : [],
            value_336 = (value_1802) =>
                offlineRegexEngine ? offlineRegexEngine.normalizeHtmlTemplateRules(value_1802) : [],
            value_337 = (value_1803) => JSON.stringify(value_336(value_1803));
        let value_338 = null,
            value_339 = null,
            value_340 = null;
        const createOfflinePromptPresetId = () =>
                'offline-prompts-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
            normalizeOfflinePromptPresets_2 = (value_1804) => {
                const items_1805 = [],
                    value_1806 = new Set(),
                    usedNames = new Set();
                return (
                    (Array.isArray(value_1804) ? value_1804 : []).forEach((rawPreset) => {
                        if (
                            !rawPreset ||
                            typeof rawPreset !== 'object' ||
                            !Array.isArray(rawPreset.prompts) ||
                            rawPreset.prompts.length === 0
                        )
                            return;
                        const name_4 = String(rawPreset.name || '')
                            .trim()
                            .slice(0, 40);
                        if (!name_4 || usedNames.has(name_4.toLocaleLowerCase())) return;
                        let id_6 =
                            String(rawPreset.id || '').trim() || createOfflinePromptPresetId();
                        while (value_1806.has(id_6)) id_6 = createOfflinePromptPresetId();
                        value_1806.add(id_6);
                        usedNames.add(name_4.toLocaleLowerCase());
                        items_1805.push({
                            id: id_6,
                            name: name_4,
                            prompts: normalizeOfflinePrompts(rawPreset.prompts),
                            textReplacementRules: value_335(rawPreset.textReplacementRules),
                            htmlTemplateRules: value_336(rawPreset.htmlTemplateRules),
                        });
                    }),
                    items_1805
                );
            },
            value_343 = (value_1811) =>
                JSON.stringify(
                    normalizeOfflinePromptPresets_2(value_1811).map((value_1812) => ({
                        id: value_1812.id,
                        name: value_1812.name,
                        prompts: value_1812.prompts.map(cloneOfflinePrompt),
                        textReplacementRules: value_335(value_1812.textReplacementRules),
                        htmlTemplateRules: value_336(value_1812.htmlTemplateRules),
                    })),
                ),
            value_344 = (value_1813, value_1814 = 0) =>
                String(
                    value_1813?.nickname ||
                        value_1813?.realName ||
                        value_1813?.name ||
                        value_1813?.groupName ||
                        '角色 ' + (value_1814 + 1),
                ).trim() || '角色 ' + (value_1814 + 1),
            value_345 = (baseName, value_1816) => {
                const cleanBase =
                    String(baseName || '迁移提示词')
                        .trim()
                        .slice(0, 36) || '迁移提示词';
                let value_1818 = cleanBase,
                    count_1819 = 2;
                while (value_1816.has(value_1818.toLocaleLowerCase()))
                    value_1818 = (cleanBase + ' ' + count_1819++).slice(0, 40);
                return (value_1816.add(value_1818.toLocaleLowerCase()), value_1818);
            };
        let legacyOfflinePromptCleanupPromise = null,
            offlinePromptMigrationSavePromise = null;
        const scheduleLegacyOfflinePromptCleanup = () => {
                if (offlinePromptMigrationSavePromise) return;
                const legacyFriends = (
                    Array.isArray(window.imData?.friends) ? window.imData.friends : []
                ).filter(
                    (friend_13) =>
                        friend_13 &&
                        Object.prototype.hasOwnProperty.call(friend_13, 'offlinePrompts'),
                );
                if (!legacyFriends.length || legacyOfflinePromptCleanupPromise) return;
                legacyOfflinePromptCleanupPromise = Promise.allSettled(
                    legacyFriends.map((friend_14) =>
                        commitSheetFriendChange(
                            friend_14.id,
                            (targetFriend_15) => {
                                delete targetFriend_15.offlinePrompts;
                            },
                            {
                                silent: true,
                                metaOnly: true,
                            },
                        ),
                    ),
                )['finally'](() => {
                    legacyOfflinePromptCleanupPromise = null;
                });
            },
            persistGlobalOfflinePromptState = async ({
                prompts: prompts_6,
                presets: presets_3,
                activePresetId: activePresetId_2,
                textReplacementRules: textReplacementRules_2,
                htmlTemplateRules: htmlTemplateRules_2,
            } = {}) => {
                value_338 && (clearTimeout(value_338), (value_338 = null));
                value_339 && (clearTimeout(value_339), (value_339 = null));
                value_340 && (clearTimeout(value_340), (value_340 = null));
                const offlinePrompts_2 = normalizeOfflinePrompts(
                        prompts_6 ?? window.imData.offlinePrompts,
                    ),
                    value_342_1830 = normalizeOfflinePromptPresets_2(
                        presets_3 ?? window.imData.offlinePromptPresets,
                    ),
                    offlineTextReplacementRules_2 = value_335(
                        textReplacementRules_2 ?? window.imData.offlineTextReplacementRules,
                    ),
                    offlineHtmlTemplateRules_2 = value_336(
                        htmlTemplateRules_2 ?? window.imData.offlineHtmlTemplateRules,
                    ),
                    offlinePromptActivePresetId_2 = value_342_1830.some(
                        (preset_3) => preset_3.id === activePresetId_2,
                    )
                        ? activePresetId_2
                        : '';
                window.imData.offlinePrompts = offlinePrompts_2;
                window.imData.offlinePromptPresets = value_342_1830;
                window.imData.offlinePromptActivePresetId = offlinePromptActivePresetId_2;
                window.imData.offlinePromptsInitialized = true;
                window.imData.offlineTextReplacementRules = offlineTextReplacementRules_2;
                window.imData.offlineHtmlTemplateRules = offlineHtmlTemplateRules_2;
                if (window.imApp?.saveImessageUiState) await window.imApp.saveImessageUiState();
                return (scheduleLegacyOfflinePromptCleanup(), offlinePrompts_2);
            },
            ensureGlobalOfflinePrompts = (preferredFriend = null) => {
                if (!window.imData.offlinePromptsInitialized) {
                    const legacyFriends_2 = (
                            Array.isArray(window.imData.friends) ? window.imData.friends : []
                        ).filter(
                            (friend_15) =>
                                Array.isArray(friend_15?.offlinePrompts) &&
                                friend_15.offlinePrompts.length > 0,
                        ),
                        presets_4 = [],
                        signatureToPreset = new Map(),
                        value_1839 = new Set();
                    legacyFriends_2.forEach((friend_16, value_1846) => {
                        const prompts_7 = normalizeOfflinePrompts(friend_16.offlinePrompts),
                            signature_2 = serializeOfflinePrompts(prompts_7);
                        if (signatureToPreset.has(signature_2)) return;
                        const options_1849 = {
                            id: createOfflinePromptPresetId(),
                            name: value_345(
                                value_344(friend_16, value_1846) + ' 提示词',
                                value_1839,
                            ),
                            prompts: prompts_7,
                        };
                        signatureToPreset.set(signature_2, options_1849);
                        presets_4.push(options_1849);
                    });
                    const activeLegacyFriend = preferredFriend || window.imData.currentActiveFriend,
                        preferredLegacyFriend =
                            activeLegacyFriend &&
                            Array.isArray(activeLegacyFriend.offlinePrompts) &&
                            activeLegacyFriend.offlinePrompts.length
                                ? activeLegacyFriend
                                : legacyFriends_2[0],
                        currentPrompts = preferredLegacyFriend
                            ? normalizeOfflinePrompts(preferredLegacyFriend.offlinePrompts)
                            : createOfflineDefaultPrompts(),
                        matchingPreset = signatureToPreset.get(
                            serializeOfflinePrompts(currentPrompts),
                        );
                    window.imData.offlinePrompts = normalizeOfflinePrompts(currentPrompts);
                    window.imData.offlinePromptPresets = normalizeOfflinePromptPresets_2(presets_4);
                    window.imData.offlinePromptActivePresetId = matchingPreset?.id || '';
                    window.imData.offlinePromptsInitialized = true;
                    window.imData.offlineTextReplacementRules = value_335(
                        window.imData.offlineTextReplacementRules,
                    );
                    window.imData.offlineHtmlTemplateRules = value_336(
                        window.imData.offlineHtmlTemplateRules,
                    );
                    window.imApp?.saveImessageUiState &&
                        (offlinePromptMigrationSavePromise = Promise.resolve(
                            window.imApp.saveImessageUiState(),
                        )
                            .then(() => {
                                offlinePromptMigrationSavePromise = null;
                                scheduleLegacyOfflinePromptCleanup();
                            })
                            ['catch']((error_15) => {
                                offlinePromptMigrationSavePromise = null;
                                console.error(
                                    'Global offline prompts migration save failed',
                                    error_15,
                                );
                            }));
                } else {
                    window.imData.offlinePrompts = normalizeOfflinePrompts(
                        window.imData.offlinePrompts,
                    );
                    window.imData.offlinePromptPresets = normalizeOfflinePromptPresets_2(
                        window.imData.offlinePromptPresets,
                    );
                    window.imData.offlineTextReplacementRules = value_335(
                        window.imData.offlineTextReplacementRules,
                    );
                    window.imData.offlineHtmlTemplateRules = value_336(
                        window.imData.offlineHtmlTemplateRules,
                    );
                    !window.imData.offlinePromptPresets.some(
                        (preset_4) => preset_4.id === window.imData.offlinePromptActivePresetId,
                    ) && (window.imData.offlinePromptActivePresetId = '');
                }
                return (scheduleLegacyOfflinePromptCleanup(), window.imData.offlinePrompts);
            },
            persistOfflinePrompts = async (prompts_9, value_1853 = {}) =>
                persistGlobalOfflinePromptState({
                    prompts: prompts_9,
                    presets: value_1853.presets ?? window.imData.offlinePromptPresets,
                    activePresetId: value_1853.activePresetId ?? '',
                    textReplacementRules:
                        value_1853.textReplacementRules ??
                        window.imData.offlineTextReplacementRules,
                    htmlTemplateRules:
                        value_1853.htmlTemplateRules ?? window.imData.offlineHtmlTemplateRules,
                }),
            scheduleOfflinePromptsPersist = (value_1854) => {
                const offlinePrompts_3 = normalizeOfflinePrompts(value_1854);
                window.imData.offlinePrompts = offlinePrompts_3;
                window.imData.offlinePromptActivePresetId = '';
                window.imData.offlinePromptsInitialized = true;
                if (value_338) clearTimeout(value_338);
                value_338 = setTimeout(() => {
                    persistOfflinePrompts(offlinePrompts_3)['catch']((error_16) => {
                        console.error('Offline prompts persistence failed', error_16);
                        if (window.showToast) window.showToast('线下提示词保存失败');
                    });
                }, 350);
            };
        window.imApp.normalizeOfflinePromptPresets = normalizeOfflinePromptPresets_2;
        window.imApp.getGlobalOfflinePrompts = ensureGlobalOfflinePrompts;
        window.imApp.saveGlobalOfflinePrompts = persistGlobalOfflinePromptState;
        const applyOfflineChatTheme_2 = (value_1857 = null) => {
                return (
                    !window.imData.offlineThemeInitialized &&
                        value_1857?.offlineTheme &&
                        ((window.imData.offlineTheme = window.imApp.normalizeOfflineThemeState(
                            value_1857.offlineTheme,
                        )),
                        (window.imData.offlineThemeInitialized = true),
                        window.imApp.saveImessageUiState?.()),
                    window.imApp.applyOfflineChatTheme()
                );
            },
            createCustomOfflinePrompt = () => ({
                id: 'custom-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
                name: '自定义条目',
                enabled: true,
                content: `<custom_instruction>
在这里输入新的线下提示词。
</custom_instruction>`,
                cotEnabled: undefined,
                systemManaged: false,
                editable: true,
                deletable: true,
                alwaysEnabled: false,
            }),
            value_348 = (value_1858) => {
                const value_24 = Number(value_1858);
                if (!Number.isFinite(value_24) || value_24 <= 0) return '';
                const canonicalIds_2 = new Date(value_24),
                    value_1861 = (value_1862) => String(value_1862).padStart(2, '0');
                return (
                    canonicalIds_2.getFullYear() +
                    '-' +
                    value_1861(canonicalIds_2.getMonth() + 1) +
                    '-' +
                    value_1861(canonicalIds_2.getDate()) +
                    ' ' +
                    value_1861(canonicalIds_2.getHours()) +
                    ':' +
                    value_1861(canonicalIds_2.getMinutes())
                );
            },
            formatOfflineHistoryForPrompt = (value_1863, value_1864, value_1865) => {
                const items_1866 = Array.isArray(value_1863) ? value_1863 : [];
                return items_1866
                    .slice(-60)
                    .map((message_1867) => {
                        const value_1868 =
                                message_1867.role === 'assistant' ? value_1865 : value_1864,
                            value_1869 = message_1867.timestamp
                                ? '[' + value_348(message_1867.timestamp) + '] '
                                : '';
                        return '' + value_1869 + value_1868 + ': ' + (message_1867.content || '');
                    })
                    .filter((value_1870) => value_1870.trim()).join(`
`);
            },
            getOfflineWorldBookFriend = (friend_17) => {
                const boundIds = [
                    ...(Array.isArray(friend_17?.boundBooks) ? friend_17.boundBooks : []),
                    ...(Array.isArray(friend_17?.worldbooks) ? friend_17.worldbooks : []),
                ].map((id_7) => String(id_7));
                return {
                    ...(friend_17 || {}),
                    boundBooks: Array.from(new Set(boundIds)),
                };
            },
            value_351 = async (value_1873, value_1874) => {
                const value_350_1875 = getOfflineWorldBookFriend(value_1873),
                    getter =
                        window.imApp?.getWorldBookContextForFriendByPosition ||
                        window.getWorldBookContextForFriendByPosition,
                    options_11 = {
                        includeBuiltin: false,
                    },
                    value_1878 = (value_1882) =>
                        getter
                            ? getter(value_1882, value_350_1875, value_1874, options_11)
                            : window.getGlobalWorldBookContextByPosition
                              ? window.getGlobalWorldBookContextByPosition(
                                    value_1882,
                                    value_1874,
                                    options_11,
                                )
                              : '',
                    systemDepth_2 = value_1878('system_depth');
                await value_295();
                const beforeRole_2 = value_1878('before_role');
                await value_295();
                const afterRole_2 = value_1878('after_role');
                return {
                    systemDepth: systemDepth_2,
                    beforeRole: beforeRole_2,
                    afterRole: afterRole_2,
                };
            },
            value_352 = async (value_1883, value_1884, userName_10) => {
                if (
                    !value_1883 ||
                    value_1883.type !== 'group' ||
                    !window.imApp?.getGroupChatMemoryCandidates
                )
                    return '';
                const value_1886 = window.imApp.normalizeFriendData
                        ? window.imApp.normalizeFriendData(value_1883)
                        : value_1883,
                    value_1887 = value_1886.memory?.crossGroupMemorySettings || {},
                    items_1888 = new Map(),
                    value_1889 = new Map();
                (Array.isArray(value_1884) ? value_1884 : []).forEach((value_1892) => {
                    const member_6 = window.imApp.getFriendById?.(value_1892?.id) || value_1892;
                    if (!member_6 || value_1887[String(member_6.id)] === false) return;
                    const groups_2 = window.imApp
                        .getGroupChatMemoryCandidates(member_6)
                        .filter(
                            (value_1895) =>
                                value_1895 &&
                                value_1895.type === 'group' &&
                                String(value_1895.id) !== String(value_1883.id),
                        )
                        .slice(0, 3);
                    if (groups_2.length === 0) return;
                    value_1889.set(String(member_6.id), {
                        member: member_6,
                        groups: groups_2,
                    });
                    groups_2.forEach((value_1896) =>
                        items_1888.set(String(value_1896.id), value_1896),
                    );
                });
                if (items_1888.size === 0) return '';
                const items_1890 = [];
                items_1888.forEach((value_1897) => {
                    if (window.imApp.ensureFriendRecentMessagesLoaded)
                        items_1890.push(
                            window.imApp.ensureFriendRecentMessagesLoaded(value_1897, {
                                limit: 20,
                            }),
                        );
                    else
                        window.imApp.ensureFriendMessagesLoaded &&
                            items_1890.push(window.imApp.ensureFriendMessagesLoaded(value_1897));
                });
                if (items_1890.length > 0) await Promise.all(items_1890);
                const filter_1891 = Array.from(value_1889.values())
                    .map(({ member: member_7, groups: groups_3 }) => {
                        const filter_1900 = groups_3
                            .map((value_1902) => {
                                const value_1903 =
                                        window.imApp.getFriendById?.(value_1902.id) || value_1902,
                                    value_1904 = window.imApp.normalizeFriendData
                                        ? window.imApp.normalizeFriendData(value_1903)
                                        : value_1903,
                                    items_1905 = window.imDataUtils?.getRecentPublicGroupMessages
                                        ? window.imDataUtils.getRecentPublicGroupMessages(
                                              value_1903.messages,
                                              20,
                                          ).selectedMessages
                                        : (Array.isArray(value_1903.messages)
                                              ? value_1903.messages
                                              : []
                                          )
                                              .filter(
                                                  (value_1907) =>
                                                      value_1907?.excludedFromContext !== true &&
                                                      value_1907?.noticeKind !==
                                                          'group_private_to_user' &&
                                                      value_1907?.noticeKind !==
                                                          'group_friend_private_chat',
                                              )
                                              .slice(-20),
                                    filter_1906 = items_1905
                                        .map((message_1908) => {
                                            const formatMessageForApiContext_1909 =
                                                    window.imApp.formatMessageForApiContext?.(
                                                        message_1908,
                                                        value_1904,
                                                        {
                                                            userName: userName_10,
                                                            friendIsNormalized: true,
                                                        },
                                                    ),
                                                trim_1910 = String(
                                                    formatMessageForApiContext_1909?.content ||
                                                        message_1908.content ||
                                                        message_1908.text ||
                                                        '',
                                                ).trim();
                                            if (!trim_1910) return '';
                                            const value_1911 = message_1908.timestamp
                                                ? '[' + value_348(message_1908.timestamp) + '] '
                                                : '';
                                            return '' + value_1911 + trim_1910;
                                        })
                                        .filter(Boolean);
                                if (filter_1906.length === 0) return '';
                                return (
                                    '  <source_group name="' +
                                    (value_1903.nickname || value_1903.realName || '未命名群聊') +
                                    `">
` +
                                    filter_1906.join(`
`) +
                                    `
  </source_group>`
                                );
                            })
                            .filter(Boolean);
                        if (filter_1900.length === 0) return '';
                        const value_1901 =
                            member_7.nickname || member_7.realName || member_7.id || '成员';
                        return (
                            '<member_cross_group_memory member="' +
                            value_1901 +
                            `">
规则：只有 ` +
                            value_1901 +
                            ` 本人可以参考这些其他群公开记录；当前群其他成员默认不知道，也不能把它们当作当前群发言。
` +
                            filter_1900.join(`
`) +
                            `
</member_cross_group_memory>`
                        );
                    })
                    .filter(Boolean);
                return filter_1891.length > 0
                    ? `<cross_group_memories>
` +
                          filter_1891.join(`
`) +
                          `
</cross_group_memories>`
                    : '';
            },
            value_353 = ({
                activeFriend: activeFriend_45,
                currentUserState: currentUserState_6,
                userName: userName_7,
                charName: charName_7,
                identityContext: identityContext_6,
                historyMessages: historyMessages_3,
                worldBookContexts: worldBookContexts_3,
                crossGroupMemoryContext: crossGroupMemoryContext_3,
                episodeMode: episodeMode_3,
            }) => {
                const userPersona_2 = identityContext_6?.userPersona || 'A normal user',
                    charPersona = activeFriend_45?.persona || 'No specific persona',
                    historyText =
                        formatOfflineHistoryForPrompt(historyMessages_3, userName_7, charName_7) ||
                        'None',
                    value_1924 = worldBookContexts_3 || {},
                    isGroup_3 = !!identityContext_6?.isGroup,
                    groupMembers_3 = Array.isArray(identityContext_6?.groupMembers)
                        ? identityContext_6.groupMembers
                        : [],
                    defaultLanguage = getOfflineChatLanguageName(activeFriend_45?.language),
                    value_1928 = isGroup_3
                        ? `<group_profile>
Group Name: ` +
                          (activeFriend_45?.nickname || activeFriend_45?.realName || 'Group') +
                          `
Default Language: ` +
                          defaultLanguage +
                          `
Members:
` +
                          (groupMembers_3.length > 0
                              ? groupMembers_3.map(
                                    (contact_1929, value_1930) =>
                                        '- Member ' +
                                        (value_1930 + 1) +
                                        `
  True Name: ` +
                                        (contact_1929.realName ||
                                            contact_1929.nickname ||
                                            'Unknown') +
                                        `
  Display Name: ` +
                                        (contact_1929.nickname ||
                                            contact_1929.realName ||
                                            'Unknown') +
                                        `
  Persona: ` +
                                        (contact_1929.persona || 'No specific persona'),
                                ).join(`
`)
                              : '- ' + charName_7) +
                          `
</group_profile>`
                        : `<char_profile>
Name: ` +
                          charName_7 +
                          `
Default Language: ` +
                          defaultLanguage +
                          `
Persona: ` +
                          charPersona +
                          `
</char_profile>`;
                return (
                    `<data_zone>
<world_books>
<system_depth>
` +
                    (value_1924.systemDepth || 'None') +
                    `
</system_depth>
<before_role>
` +
                    (value_1924.beforeRole || 'None') +
                    `
</before_role>
<after_role>
` +
                    (value_1924.afterRole || 'None') +
                    `
</after_role>
</world_books>

<user_profile>
Name: ` +
                    userName_7 +
                    `
Persona: ` +
                    userPersona_2 +
                    `
</user_profile>

` +
                    value_1928 +
                    `

` +
                    (crossGroupMemoryContext_3 || '') +
                    `

<recent_context source="` +
                    (episodeMode_3 ? 'offline_only' : 'online_and_offline_last_30_rounds') +
                    `">
` +
                    historyText +
                    `
</recent_context>
</data_zone>`
                );
            },
            isOfflineMemoryEntryTriggered = (entry_5, value_1932) => {
                if (!entry_5) return false;
                const text_11 = String(value_1932 || ''),
                    values_2 = [
                        entry_5.keyword,
                        entry_5.title,
                        entry_5.memoryPoints,
                        entry_5.event,
                        entry_5.content,
                    ]
                        .map((value_26) => String(value_26 || '').trim())
                        .filter(Boolean);
                return values_2.some(
                    (value_27) => value_27.length >= 2 && text_11.includes(value_27),
                );
            },
            pickOfflineMemoryEntries = (entries_4, recentText, limit_2) => {
                const cleanEntries = Array.isArray(entries_4)
                    ? entries_4.filter(
                          (entry_6) =>
                              entry_6 &&
                              (entry_6.title ||
                                  entry_6.event ||
                                  entry_6.content ||
                                  entry_6.memoryPoints ||
                                  entry_6.detail),
                      )
                    : [];
                if (cleanEntries.length === 0) return [];
                const triggered = cleanEntries.filter((entry_7) =>
                    isOfflineMemoryEntryTriggered(entry_7, recentText),
                );
                return (triggered.length > 0 ? triggered : cleanEntries).slice(-limit_2);
            },
            value_355 = (friend_18, recentText_2) => {
                const normalizedFriend = window.imApp?.normalizeFriendData
                        ? window.imApp.normalizeFriendData(friend_18 || {})
                        : friend_18 || {},
                    memory_2 = normalizedFriend.memory || {},
                    items_1945 = [];
                memory_2.overview &&
                    items_1945.push(
                        `<core_memory_overview>
` +
                            memory_2.overview +
                            `
</core_memory_overview>`,
                    );
                memory_2.context?.notes &&
                    items_1945.push(
                        `<extra_context_notes>
` +
                            memory_2.context.notes +
                            `
</extra_context_notes>`,
                    );
                const shortTermEntries_2 = pickOfflineMemoryEntries(
                    memory_2.shortTermEntries,
                    recentText_2,
                    8,
                );
                shortTermEntries_2.length > 0 &&
                    items_1945.push(
                        `<short_term_memories source="vectorized_char_memory">
` +
                            shortTermEntries_2.map(
                                (message_1951) =>
                                    `<short_term_memory>
<title>` +
                                    (message_1951.title || 'Memory') +
                                    `</title>
<time>` +
                                    (message_1951.time || message_1951.createdAt || '') +
                                    `</time>
<content>` +
                                    (message_1951.event || message_1951.content || '') +
                                    `</content>
<memory_points>` +
                                    (message_1951.memoryPoints || '') +
                                    `</memory_points>
<degree>` +
                                    (message_1951.degree || '') +
                                    `</degree>
</short_term_memory>`,
                            ).join(`
`) +
                            `
</short_term_memories>`,
                    );
                const longTermEntries_2 = pickOfflineMemoryEntries(
                        memory_2.longTermEntries,
                        recentText_2,
                        8,
                    ),
                    items_1948 = [];
                if (memory_2.longTerm)
                    items_1948.push(
                        `<memory_text>
` +
                            memory_2.longTerm +
                            `
</memory_text>`,
                    );
                longTermEntries_2.forEach((message_1952) => {
                    items_1948.push(
                        `<memory>
<title>` +
                            (message_1952.title || 'Long-term memory') +
                            `</title>
<content>` +
                            (message_1952.content || '') +
                            `</content>
<time>` +
                            (message_1952.createdAt || message_1952.time || '') +
                            `</time>
</memory>`,
                    );
                });
                items_1948.length > 0 &&
                    items_1945.push(
                        `<long_term_memories source="vectorized_char_memory">
` +
                            items_1948.join(`
`) +
                            `
</long_term_memories>`,
                    );
                const cherishedEntries_2 = pickOfflineMemoryEntries(
                        memory_2.cherishedEntries,
                        recentText_2,
                        8,
                    ),
                    items_1950 = [];
                if (memory_2.cherished)
                    items_1950.push(
                        `<memory_text>
` +
                            memory_2.cherished +
                            `
</memory_text>`,
                    );
                return (
                    cherishedEntries_2.forEach((message_1953) => {
                        items_1950.push(
                            `<memory>
<title>` +
                                (message_1953.title || 'Cherished memory') +
                                `</title>
<content>` +
                                (message_1953.content || '') +
                                `</content>
<detail>` +
                                (message_1953.detail || '') +
                                `</detail>
<reason>` +
                                (message_1953.reason || '') +
                                `</reason>
<time>` +
                                (message_1953.createdAt || message_1953.time || '') +
                                `</time>
</memory>`,
                        );
                    }),
                    items_1950.length > 0 &&
                        items_1945.push(
                            `<cherished_memories source="vectorized_char_memory">
` +
                                items_1950.join(`
`) +
                                `
</cherished_memories>`,
                        ),
                    `<character_memory_system>
` +
                        (items_1945.length > 0
                            ? items_1945.join(`

`)
                            : 'No active vectorized character memory is available yet.') +
                        `
</character_memory_system>`
                );
            },
            value_356 = async (value_1954, value_1955 = {}) => {
                if (!offlineRegexEngine) return [];
                value_339 && (clearTimeout(value_339), (value_339 = null));
                const textReplacementRules_3 = value_335(value_1954);
                await persistGlobalOfflinePromptState({
                    prompts: window.imData.offlinePrompts,
                    presets: window.imData.offlinePromptPresets,
                    activePresetId: '',
                    textReplacementRules: textReplacementRules_3,
                    htmlTemplateRules: window.imData.offlineHtmlTemplateRules,
                });
                if (value_1955.rerender !== false) {
                    const currentActiveFriend_1957 = window.imData.currentActiveFriend,
                        offlineChatViewOfflineChatTitleElement_1958 = document.querySelector(
                            '#offline-chat-view .offline-chat-title',
                        );
                    if (
                        currentActiveFriend_1957 &&
                        offlineChatViewOfflineChatTitleElement_1958?.textContent === '线下'
                    )
                        renderOfflineCurrentMessages(currentActiveFriend_1957);
                }
                return textReplacementRules_3;
            },
            value_357 = (value_1959) => {
                if (!offlineRegexEngine) return;
                const offlineTextReplacementRules_3 = value_335(value_1959);
                window.imData.offlineTextReplacementRules = offlineTextReplacementRules_3;
                window.imData.offlinePromptActivePresetId = '';
                if (value_339) clearTimeout(value_339);
                value_339 = setTimeout(() => {
                    value_356(offlineTextReplacementRules_3)['catch']((value_1961) => {
                        console.error('Offline text replacement persistence failed', value_1961);
                        window.showToast?.('线下文字替换保存失败');
                    });
                }, 350);
            },
            getOfflineRegexValidationError = (value_1962) => {
                if (!offlineRegexEngine) return '正则引擎未加载';
                const validateTextReplacementRule_1963 =
                    offlineRegexEngine.validateTextReplacementRule(value_1962);
                return validateTextReplacementRule_1963.valid
                    ? ''
                    : validateTextReplacementRule_1963.error;
            },
            value_359 = (element_1964) => {
                const scripts = value_214(),
                    element_1966 = document.createElement('section');
                element_1966.className =
                    'offline-html-template-section offline-text-replacement-section';
                element_1966.innerHTML = `
                <div class="offline-html-template-heading">
                    <div><strong>文字替换</strong><span>全局 · 仅显示</span></div>
                    <p class="offline-regex-section-hint">只改变线下气泡的呈现；消息原文、导出、总结和 AI 上下文保持不变。</p>
                </div>
            `;
                const element_1967 = document.createElement('div');
                element_1967.className = 'offline-html-template-list offline-text-replacement-list';
                element_1966.appendChild(element_1967);
                if (scripts.length === 0) {
                    const empty = document.createElement('div');
                    empty.className = 'offline-regex-empty';
                    empty.textContent = '还没有文字替换规则';
                    element_1967.appendChild(empty);
                }
                scripts.forEach((rule_2, index_7) => {
                    const card_5 = document.createElement('details');
                    card_5.className =
                        'offline-regex-card offline-text-replacement-card' +
                        (rule_2.disabled ? ' is-disabled' : '');
                    card_5.open = index_7 === 0;
                    card_5.innerHTML =
                        `
                    <summary class="offline-regex-summary">
                        <span class="offline-regex-summary-name">` +
                        escapeSheetHtml(rule_2.name || '文字替换 ' + (index_7 + 1)) +
                        `</span>
                        <span class="offline-regex-summary-state">` +
                        (rule_2.disabled ? '已停用' : '已启用') +
                        `</span>
                    </summary>
                    <div class="offline-regex-editor">
                        <div class="offline-regex-toolbar">
                            <label class="offline-regex-enabled"><input type="checkbox" data-text-replacement-field="enabled" ` +
                        (rule_2.disabled ? '' : 'checked') +
                        `><span>启用</span></label>
                            <div class="offline-regex-order-actions">
                                <button type="button" data-text-replacement-action="up" title="上移" ` +
                        (index_7 === 0 ? 'disabled' : '') +
                        `><i class="fas fa-arrow-up"></i></button>
                                <button type="button" data-text-replacement-action="down" title="下移" ` +
                        (index_7 === scripts.length - 1 ? 'disabled' : '') +
                        `><i class="fas fa-arrow-down"></i></button>
                                <button type="button" data-text-replacement-action="export" title="导出" aria-label="导出文字替换规则"><i class="fas fa-file-export"></i></button>
                                <button type="button" data-text-replacement-action="import" title="导入" aria-label="导入文字替换规则"><i class="fas fa-file-import"></i></button>
                                <button type="button" class="danger" data-text-replacement-action="delete" title="删除"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                        <input type="file" data-text-replacement-import accept=".json,application/json" hidden>
                        <label class="offline-regex-field"><span>名称</span><input type="text" data-text-replacement-field="name" value="` +
                        escapeSheetHtml(rule_2.name) +
                        `"></label>
                        <label class="offline-regex-field"><span>作用对象</span><select data-text-replacement-field="targetRole"><option value="assistant" ` +
                        (rule_2.targetRole === 'assistant' ? 'selected' : '') +
                        '>仅 AI</option><option value="user" ' +
                        (rule_2.targetRole === 'user' ? 'selected' : '') +
                        '>仅用户</option><option value="both" ' +
                        (rule_2.targetRole === 'both' ? 'selected' : '') +
                        `>用户和 AI</option></select></label>
                        <label class="offline-regex-field"><span>匹配正则</span><textarea data-text-replacement-field="findRegex" rows="3" placeholder="例如 /小明/g">` +
                        escapeSheetHtml(rule_2.findRegex) +
                        `</textarea></label>
                        <label class="offline-regex-field"><span>替换文字</span><textarea data-text-replacement-field="replaceString" rows="3" placeholder="例如 阿明；留空表示删除">` +
                        escapeSheetHtml(rule_2.replaceString) +
                        `</textarea></label>
                        <div class="offline-regex-hint">支持 <code>$1</code>、<code>$&lt;name&gt;</code>、<code>$&amp;</code>和 <code>$$</code>；正则带 <code>g</code> 时替换全部匹配。</div>
                        <div class="offline-regex-depths">
                            <label class="offline-regex-field"><span>最小深度</span><input type="number" min="0" step="1" data-text-replacement-field="minDepth" value="` +
                        (rule_2.minDepth === null ? '' : rule_2.minDepth) +
                        `" placeholder="无限"></label>
                            <label class="offline-regex-field"><span>最大深度</span><input type="number" min="0" step="1" data-text-replacement-field="maxDepth" value="` +
                        (rule_2.maxDepth === null ? '' : rule_2.maxDepth) +
                        `" placeholder="无限"></label>
                        </div>
                        <div class="offline-regex-error" role="alert"></div>
                    </div>
                `;
                    const errorEl = card_5.querySelector('.offline-regex-error'),
                        summaryName = card_5.querySelector('.offline-regex-summary-name'),
                        summaryState = card_5.querySelector('.offline-regex-summary-state'),
                        refreshValidation = (temporaryError = '') => {
                            const textContent_5 =
                                temporaryError || getOfflineRegexValidationError(rule_2);
                            errorEl &&
                                ((errorEl.textContent = textContent_5),
                                (errorEl.style.display = textContent_5 ? 'block' : 'none'));
                            card_5.classList.toggle('has-error', !!textContent_5);
                        },
                        updateRule = (value_1977) => {
                            value_1977(rule_2);
                            rule_2.revision = Math.max(1, Number(rule_2.revision) || 1) + 1;
                            value_357(scripts);
                            refreshValidation();
                        };
                    card_5
                        .querySelectorAll('[data-text-replacement-field]')
                        .forEach((control_2) => {
                            const field = control_2.getAttribute('data-text-replacement-field'),
                                value_1979 =
                                    control_2 instanceof HTMLInputElement &&
                                    control_2.type === 'checkbox'
                                        ? 'change'
                                        : control_2 instanceof HTMLSelectElement
                                          ? 'change'
                                          : 'input';
                            control_2.addEventListener(value_1979, () => {
                                if (field === 'enabled') {
                                    updateRule((item_22) => {
                                        item_22.disabled = !control_2.checked;
                                    });
                                    card_5.classList.toggle('is-disabled', rule_2.disabled);
                                    if (summaryState)
                                        summaryState.textContent = rule_2.disabled
                                            ? '已停用'
                                            : '已启用';
                                    return;
                                }
                                if (field === 'minDepth' || field === 'maxDepth') {
                                    const rawValue = control_2.value.trim();
                                    if (rawValue !== '' && !/^\d+$/.test(rawValue)) {
                                        refreshValidation('深度只接受非负整数');
                                        return;
                                    }
                                    updateRule((item_23) => {
                                        item_23[field] = rawValue === '' ? null : Number(rawValue);
                                    });
                                    return;
                                }
                                updateRule((item_24) => {
                                    item_24[field] = control_2.value;
                                });
                                if (field === 'name' && summaryName)
                                    summaryName.textContent =
                                        control_2.value || '文字替换 ' + (index_7 + 1);
                            });
                        });
                    const importPresetInput = card_5.querySelector(
                        '[data-text-replacement-import]',
                    );
                    importPresetInput?.addEventListener('change', async () => {
                        const file_2 = importPresetInput.files?.[0];
                        importPresetInput.value = '';
                        if (!file_2) return;
                        try {
                            const payload_2 = JSON.parse(await file_2.text()),
                                value_1985 =
                                    payload_2?.rule && typeof payload_2.rule === 'object'
                                        ? payload_2.rule
                                        : payload_2;
                            if (
                                !value_1985 ||
                                typeof value_1985 !== 'object' ||
                                Array.isArray(value_1985)
                            )
                                throw new Error('Invalid offline text replacement file');
                            const baseNotice_2 = offlineRegexEngine.normalizeTextReplacementRule({
                                    ...value_1985,
                                    id: rule_2.id,
                                    revision: Math.max(1, Number(rule_2.revision) || 1) + 1,
                                }),
                                value_358_1986 = getOfflineRegexValidationError(baseNotice_2);
                            if (value_358_1986) throw new Error(value_358_1986);
                            Object.assign(rule_2, baseNotice_2);
                            await value_356(scripts);
                            value_364(element_1964);
                            window.showToast?.('已导入文字替换：' + rule_2.name);
                        } catch (value_1987) {
                            console.error('Import offline text replacement failed', value_1987);
                            window.showToast?.('文字替换文件无效，导入失败');
                        }
                    });
                    card_5
                        .querySelectorAll('[data-text-replacement-action]')
                        .forEach((value_1988) => {
                            value_1988.addEventListener('click', async (event_1989) => {
                                event_1989.preventDefault();
                                event_1989.stopPropagation();
                                const action_4 = value_1988.getAttribute(
                                    'data-text-replacement-action',
                                );
                                if (action_4 === 'export') {
                                    const name_7 = String(
                                            rule_2.name || '文字替换 ' + (index_7 + 1),
                                        ).trim(),
                                        payload_3 = {
                                            type: 'u2-offline-text-replacement',
                                            version: 1,
                                            name: name_7,
                                            rule: {
                                                ...rule_2,
                                            },
                                        },
                                        blob_4 = new Blob([JSON.stringify(payload_3, null, 2)], {
                                            type: 'application/json',
                                        }),
                                        value_1994 = await window.u2ExportFile({
                                            blob: blob_4,
                                            fileName:
                                                (name_7.replace(/[\\/:*?"<>|]/g, '_') ||
                                                    'offline-text-replacement') + '.json',
                                            title: 'U2 文字替换',
                                        });
                                    if (
                                        (value_1994 === 'shared' || value_1994 === 'downloaded') &&
                                        window.showToast
                                    )
                                        window.showToast('文字替换已导出');
                                    else {
                                        if (value_1994 === 'failed' && window.showToast)
                                            window.showToast('文字替换导出失败');
                                    }
                                    return;
                                }
                                if (action_4 === 'import') {
                                    importPresetInput?.click();
                                    return;
                                }
                                if (action_4 === 'delete') {
                                    if (!window.confirm('删除文字替换“' + rule_2.name + '”？'))
                                        return;
                                    scripts.splice(index_7, 1);
                                } else {
                                    const targetIndex_2 =
                                        action_4 === 'up' ? index_7 - 1 : index_7 + 1;
                                    if (targetIndex_2 < 0 || targetIndex_2 >= scripts.length)
                                        return;
                                    [scripts[index_7], scripts[targetIndex_2]] = [
                                        scripts[targetIndex_2],
                                        scripts[index_7],
                                    ];
                                }
                                await value_356(scripts);
                                value_364(element_1964);
                            });
                        });
                    refreshValidation();
                    element_1967.appendChild(card_5);
                });
                const element_1968 = document.createElement('button');
                element_1968.type = 'button';
                element_1968.className = 'offline-regex-add offline-text-replacement-add';
                element_1968.innerHTML = '<i class="fas fa-font"></i><span>添加文字替换</span>';
                element_1968.addEventListener('click', async () => {
                    const concat_1996 = scripts.concat(
                        offlineRegexEngine.createTextReplacementRule(),
                    );
                    await value_356(concat_1996, {
                        rerender: false,
                    });
                    value_364(element_1964);
                });
                element_1966.appendChild(element_1968);
                element_1964.appendChild(element_1966);
            },
            value_360 = async (value_1997, value_1998 = {}) => {
                if (!offlineRegexEngine) return [];
                value_340 && (clearTimeout(value_340), (value_340 = null));
                const htmlTemplateRules_3 = value_336(value_1997);
                await persistGlobalOfflinePromptState({
                    prompts: window.imData.offlinePrompts,
                    presets: window.imData.offlinePromptPresets,
                    activePresetId: '',
                    htmlTemplateRules: htmlTemplateRules_3,
                });
                if (value_1998.rerender !== false) {
                    const currentActiveFriend_2000 = window.imData.currentActiveFriend,
                        offlineChatViewOfflineChatTitleElement_2001 = document.querySelector(
                            '#offline-chat-view .offline-chat-title',
                        );
                    if (
                        currentActiveFriend_2000 &&
                        offlineChatViewOfflineChatTitleElement_2001?.textContent === '线下'
                    )
                        renderOfflineCurrentMessages(currentActiveFriend_2000);
                }
                return htmlTemplateRules_3;
            },
            value_361 = (value_2002) => {
                if (!offlineRegexEngine) return;
                const offlineHtmlTemplateRules_3 = value_336(value_2002);
                window.imData.offlineHtmlTemplateRules = offlineHtmlTemplateRules_3;
                window.imData.offlinePromptActivePresetId = '';
                if (value_340) clearTimeout(value_340);
                value_340 = setTimeout(() => {
                    value_360(offlineHtmlTemplateRules_3)['catch']((value_2004) => {
                        console.error('Offline HTML template persistence failed', value_2004);
                        window.showToast?.('线下 HTML 模板保存失败');
                    });
                }, 350);
            },
            getOfflineRegexValidationError_2 = (value_2005) => {
                if (!offlineRegexEngine) return '正则引擎未加载';
                const validateHtmlTemplateRule_2006 =
                    offlineRegexEngine.validateHtmlTemplateRule(value_2005);
                if (!validateHtmlTemplateRule_2006.valid)
                    return validateHtmlTemplateRule_2006.error;
                if (!value_219(validateHtmlTemplateRule_2006.rule.html).trim())
                    return 'HTML 模板不包含可用内容';
                return '';
            },
            value_363 = (element_2007) => {
                const scripts_2 = value_213(),
                    element_2009 = document.createElement('section');
                element_2009.className = 'offline-html-template-section';
                element_2009.innerHTML = `
                <div class="offline-html-template-heading">
                    <div><strong>HTML 模板</strong><span>全局 · AI 输出</span></div>
                </div>
            `;
                const element_2010 = document.createElement('div');
                element_2010.className = 'offline-html-template-list';
                element_2009.appendChild(element_2010);
                if (scripts_2.length === 0) {
                    const empty_2 = document.createElement('div');
                    empty_2.className = 'offline-regex-empty';
                    empty_2.textContent = '还没有模板';
                    element_2010.appendChild(empty_2);
                }
                scripts_2.forEach((rule_3, index_8) => {
                    const card_6 = document.createElement('details');
                    card_6.className =
                        'offline-regex-card offline-html-template-card' +
                        (rule_3.disabled ? ' is-disabled' : '');
                    card_6.open = index_8 === 0;
                    card_6.innerHTML =
                        `
                    <summary class="offline-regex-summary">
                        <span class="offline-regex-summary-name">` +
                        escapeSheetHtml(rule_3.scriptName || 'HTML 模板 ' + (index_8 + 1)) +
                        `</span>
                        <span class="offline-regex-summary-state">` +
                        (rule_3.disabled ? '已停用' : '已启用') +
                        `</span>
                    </summary>
                    <div class="offline-regex-editor">
                        <div class="offline-regex-toolbar">
                            <label class="offline-regex-enabled"><input type="checkbox" data-html-template-field="enabled" ` +
                        (rule_3.disabled ? '' : 'checked') +
                        `><span>启用</span></label>
                            <div class="offline-regex-order-actions">
                                <button type="button" data-html-template-action="up" title="上移" ` +
                        (index_8 === 0 ? 'disabled' : '') +
                        `><i class="fas fa-arrow-up"></i></button>
                                <button type="button" data-html-template-action="down" title="下移" ` +
                        (index_8 === scripts_2.length - 1 ? 'disabled' : '') +
                        `><i class="fas fa-arrow-down"></i></button>
                                <button type="button" data-html-template-action="export" title="导出" aria-label="导出 HTML 模板"><i class="fas fa-file-export"></i></button>
                                <button type="button" data-html-template-action="import" title="导入" aria-label="导入 HTML 模板"><i class="fas fa-file-import"></i></button>
                                <button type="button" class="danger" data-html-template-action="delete" title="删除"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                        <input type="file" data-html-template-import accept=".json,application/json" hidden>
                        <label class="offline-regex-field"><span>名称</span><input type="text" data-html-template-field="scriptName" value="` +
                        escapeSheetHtml(rule_3.scriptName) +
                        `"></label>
                        <label class="offline-regex-field"><span>匹配正则（命名捕获）</span><textarea data-html-template-field="findRegex" rows="3" placeholder="例如 /\\[状态\\](?<mood>[^\\n]+)/g">` +
                        escapeSheetHtml(rule_3.findRegex) +
                        `</textarea></label>
                        <label class="offline-regex-field"><span>HTML 模板</span><textarea data-html-template-field="html" rows="5" placeholder="例如 &lt;div class=&quot;offline-status-card&quot;&gt;{{mood}} · {{place}}&lt;/div&gt;">` +
                        escapeSheetHtml(rule_3.html) +
                        `</textarea></label>
                        <div class="offline-regex-depths">
                            <label class="offline-regex-field"><span>最小深度</span><input type="number" min="0" step="1" data-html-template-field="minDepth" value="` +
                        (rule_3.minDepth === null ? '' : rule_3.minDepth) +
                        `" placeholder="无限"></label>
                            <label class="offline-regex-field"><span>最大深度</span><input type="number" min="0" step="1" data-html-template-field="maxDepth" value="` +
                        (rule_3.maxDepth === null ? '' : rule_3.maxDepth) +
                        `" placeholder="无限"></label>
                        </div>
                        <div class="offline-regex-error" role="alert"></div>
                    </div>
                `;
                    const errorEl_2 = card_6.querySelector('.offline-regex-error'),
                        summaryName_2 = card_6.querySelector('.offline-regex-summary-name'),
                        summaryState_2 = card_6.querySelector('.offline-regex-summary-state'),
                        refreshValidation_2 = (temporaryError_2 = '') => {
                            const textContent_6 =
                                temporaryError_2 || getOfflineRegexValidationError_2(rule_3);
                            errorEl_2 &&
                                ((errorEl_2.textContent = textContent_6),
                                (errorEl_2.style.display = textContent_6 ? 'block' : 'none'));
                            card_6.classList.toggle('has-error', !!textContent_6);
                        },
                        updateRule_2 = (value_2023) => {
                            value_2023(rule_3);
                            rule_3.revision = Math.max(1, Number(rule_3.revision) || 1) + 1;
                            value_361(scripts_2);
                            refreshValidation_2();
                        };
                    card_6.querySelectorAll('[data-html-template-field]').forEach((control_3) => {
                        const field_2 = control_3.getAttribute('data-html-template-field'),
                            eventName =
                                control_3 instanceof HTMLInputElement &&
                                control_3.type === 'checkbox'
                                    ? 'change'
                                    : 'input';
                        control_3.addEventListener(eventName, () => {
                            if (field_2 === 'enabled') {
                                updateRule_2((item_25) => {
                                    item_25.disabled = !control_3.checked;
                                });
                                card_6.classList.toggle('is-disabled', rule_3.disabled);
                                if (summaryState_2)
                                    summaryState_2.textContent = rule_3.disabled
                                        ? '已停用'
                                        : '已启用';
                                return;
                            }
                            if (field_2 === 'minDepth' || field_2 === 'maxDepth') {
                                const rawValue_2 = control_3.value.trim();
                                if (rawValue_2 !== '' && !/^\d+$/.test(rawValue_2)) {
                                    refreshValidation_2('深度只接受非负整数');
                                    return;
                                }
                                updateRule_2((item_26) => {
                                    item_26[field_2] =
                                        rawValue_2 === '' ? null : Number(rawValue_2);
                                });
                                return;
                            }
                            updateRule_2((item_27) => {
                                item_27[field_2] = control_3.value;
                            });
                            if (field_2 === 'scriptName' && summaryName_2)
                                summaryName_2.textContent =
                                    control_3.value || 'HTML 模板 ' + (index_8 + 1);
                        });
                    });
                    const importPresetInput_2 = card_6.querySelector('[data-html-template-import]');
                    importPresetInput_2?.addEventListener('change', async () => {
                        const file_3 = importPresetInput_2.files?.[0];
                        importPresetInput_2.value = '';
                        if (!file_3) return;
                        try {
                            const payload_4 = JSON.parse(await file_3.text()),
                                value_2033 =
                                    payload_4?.rule && typeof payload_4.rule === 'object'
                                        ? payload_4.rule
                                        : payload_4;
                            if (
                                !value_2033 ||
                                typeof value_2033 !== 'object' ||
                                Array.isArray(value_2033)
                            )
                                throw new Error('Invalid offline HTML template file');
                            const baseNotice_3 = offlineRegexEngine.normalizeHtmlTemplateRule({
                                    ...value_2033,
                                    id: rule_3.id,
                                    revision: Math.max(1, Number(rule_3.revision) || 1) + 1,
                                }),
                                value_362_2034 = getOfflineRegexValidationError_2(baseNotice_3);
                            if (value_362_2034) throw new Error(value_362_2034);
                            Object.assign(rule_3, baseNotice_3);
                            await value_360(scripts_2);
                            value_364(element_2007);
                            window.showToast?.('已导入 HTML 模板：' + rule_3.scriptName);
                        } catch (value_2035) {
                            console.error('Import offline HTML template failed', value_2035);
                            window.showToast?.('模板文件无效，导入失败');
                        }
                    });
                    card_6.querySelectorAll('[data-html-template-action]').forEach((value_2036) => {
                        value_2036.addEventListener('click', async (event_2037) => {
                            event_2037.preventDefault();
                            event_2037.stopPropagation();
                            const action_5 = value_2036.getAttribute('data-html-template-action');
                            if (action_5 === 'export') {
                                const name_8 = String(
                                        rule_3.scriptName || 'HTML 模板 ' + (index_8 + 1),
                                    ).trim(),
                                    payload_5 = {
                                        type: 'u2-offline-html-template',
                                        version: 1,
                                        name: name_8,
                                        rule: {
                                            ...rule_3,
                                        },
                                    },
                                    blob_5 = new Blob([JSON.stringify(payload_5, null, 2)], {
                                        type: 'application/json',
                                    }),
                                    value_2042 = await window.u2ExportFile({
                                        blob: blob_5,
                                        fileName:
                                            (name_8.replace(/[\\/:*?"<>|]/g, '_') ||
                                                'offline-html-template') + '.json',
                                        title: 'U2 HTML 模板',
                                    });
                                if (
                                    (value_2042 === 'shared' || value_2042 === 'downloaded') &&
                                    window.showToast
                                )
                                    window.showToast('HTML 模板已导出');
                                else {
                                    if (value_2042 === 'failed' && window.showToast)
                                        window.showToast('HTML 模板导出失败');
                                }
                                return;
                            }
                            if (action_5 === 'import') {
                                importPresetInput_2?.click();
                                return;
                            }
                            if (action_5 === 'delete') {
                                if (!window.confirm('删除 HTML 模板“' + rule_3.scriptName + '”？'))
                                    return;
                                scripts_2.splice(index_8, 1);
                            } else {
                                const targetIndex_3 = action_5 === 'up' ? index_8 - 1 : index_8 + 1;
                                if (targetIndex_3 < 0 || targetIndex_3 >= scripts_2.length) return;
                                [scripts_2[index_8], scripts_2[targetIndex_3]] = [
                                    scripts_2[targetIndex_3],
                                    scripts_2[index_8],
                                ];
                            }
                            await value_360(scripts_2);
                            value_364(element_2007);
                        });
                    });
                    refreshValidation_2();
                    element_2010.appendChild(card_6);
                });
                const element_2011 = document.createElement('button');
                element_2011.type = 'button';
                element_2011.className = 'offline-regex-add offline-html-template-add';
                element_2011.innerHTML = '<i class="fas fa-code"></i><span>添加模板</span>';
                element_2011.addEventListener('click', async () => {
                    const concat_2044 = scripts_2.concat(
                        offlineRegexEngine.createHtmlTemplateRule(),
                    );
                    await value_360(concat_2044, {
                        rerender: false,
                    });
                    value_364(element_2007);
                });
                element_2009.appendChild(element_2011);
                element_2007.appendChild(element_2009);
            },
            value_364 = (listEl_4) => {
                if (!listEl_4) return;
                listEl_4.innerHTML = '';
                if (!offlineRegexEngine) {
                    listEl_4.innerHTML = '<div class="offline-regex-empty">正则引擎加载失败</div>';
                    return;
                }
                value_359(listEl_4);
                value_363(listEl_4);
            },
            renderOfflineChatSettingsEditor = (listEl, activeFriend_46) => {
                listEl.innerHTML = '';
                const streamRow = document.createElement('div');
                streamRow.className = 'offline-settings-streaming';
                streamRow.innerHTML = `
                <div class="offline-settings-worldbook-main">
                    <i class="fas fa-bolt"></i>
                    <span><strong>流式传输</strong><small>STREAM RESPONSE</small></span>
                </div>
            `;
                const streamToggle = document.createElement('label');
                streamToggle.className = 'toggle-switch';
                streamToggle.setAttribute('aria-label', '线下流式传输');
                const streamCheckbox = document.createElement('input');
                streamCheckbox.type = 'checkbox';
                streamCheckbox.checked = activeFriend_46.offlineStreamEnabled !== false;
                streamCheckbox.addEventListener('change', async () => {
                    await commitSheetFriendChange(
                        activeFriend_46.id,
                        (targetFriend_16) => {
                            targetFriend_16.offlineStreamEnabled = streamCheckbox.checked;
                        },
                        {
                            silent: true,
                            metaOnly: true,
                        },
                    );
                });
                const element_2049 = document.createElement('span');
                element_2049.className = 'slider';
                streamToggle.append(streamCheckbox, element_2049);
                streamRow.appendChild(streamToggle);
                listEl.appendChild(streamRow);
                if (activeFriend_46.type === 'char') {
                    const autoImageRow = document.createElement('div');
                    autoImageRow.className =
                        'offline-settings-streaming offline-settings-auto-image';
                    autoImageRow.innerHTML = `
                    <div class="offline-settings-worldbook-main">
                        <i class="fas fa-wand-magic-sparkles"></i>
                        <span><strong>线下自动生图</strong><small>按剧情决定是否生成；复用线上生图提示词配置</small></span>
                    </div>
                `;
                    const autoImageToggle = document.createElement('label');
                    autoImageToggle.className = 'toggle-switch';
                    autoImageToggle.setAttribute('aria-label', '线下自动生图');
                    const autoImageCheckbox = document.createElement('input');
                    autoImageCheckbox.type = 'checkbox';
                    autoImageCheckbox.checked = activeFriend_46.offlineAutoImageGeneration === true;
                    autoImageCheckbox.addEventListener('change', async () => {
                        const saved_14 = await commitSheetFriendChange(
                            activeFriend_46.id,
                            (targetFriend_17) => {
                                targetFriend_17.offlineAutoImageGeneration =
                                    autoImageCheckbox.checked;
                            },
                            {
                                silent: true,
                                metaOnly: true,
                            },
                        );
                        !saved_14 &&
                            ((autoImageCheckbox.checked = !autoImageCheckbox.checked),
                            window.showToast?.('线下自动生图设置保存失败'));
                    });
                    const element_2069 = document.createElement('span');
                    element_2069.className = 'slider';
                    autoImageToggle.append(autoImageCheckbox, element_2069);
                    autoImageRow.appendChild(autoImageToggle);
                    listEl.appendChild(autoImageRow);
                }
                const wbBtnDiv = document.createElement('div');
                wbBtnDiv.className = 'offline-settings-worldbook';
                wbBtnDiv.innerHTML =
                    `
                <div class="offline-settings-worldbook-main">
                    <i class="fas fa-book"></i>
                    <span><strong>挂载世界书</strong><small>WORLD BOOK</small></span>
                </div>
                <div class="offline-settings-worldbook-meta">
                    <span id="offline-chat-wb-count">` +
                    (activeFriend_46.worldbooks || activeFriend_46.boundBooks || []).length +
                    ` 项</span>
                    <i class="fas fa-chevron-right"></i>
                </div>
            `;
                wbBtnDiv.addEventListener('click', () => {
                    const currentIds =
                            activeFriend_46.worldbooks || activeFriend_46.boundBooks || [],
                        handleSelection = (worldbooks_2) => {
                            commitSheetFriendChange(
                                activeFriend_46.id,
                                (targetFriend_18) => {
                                    targetFriend_18.worldbooks = worldbooks_2;
                                },
                                {
                                    silent: true,
                                    metaOnly: true,
                                },
                            );
                            const countSpan = document.getElementById('offline-chat-wb-count');
                            if (countSpan) countSpan.textContent = worldbooks_2.length + ' 项';
                        };
                    if (window.renderWorldBookSelector)
                        window.renderWorldBookSelector(currentIds, handleSelection);
                    else
                        window.renderLegacyWorldBookSelector &&
                            window.renderLegacyWorldBookSelector(currentIds, handleSelection);
                });
                listEl.appendChild(wbBtnDiv);
                let prompts_8 = ensureGlobalOfflinePrompts(activeFriend_46),
                    presets_5 = normalizeOfflinePromptPresets_2(window.imData.offlinePromptPresets),
                    promptPresetSelect = null,
                    deletePromptPresetBtn = null;
                const refreshPromptPresetSelect = () => {
                        if (!promptPresetSelect) return;
                        promptPresetSelect.innerHTML =
                            '<option value="">自定义提示词</option>' +
                            presets_5
                                .map(
                                    (value_2076) =>
                                        '<option value="' +
                                        escapeSheetHtml(value_2076.id) +
                                        '">' +
                                        escapeSheetHtml(value_2076.name) +
                                        '</option>',
                                )
                                .join('');
                        promptPresetSelect.value = presets_5.some(
                            (preset_5) => preset_5.id === window.imData.offlinePromptActivePresetId,
                        )
                            ? window.imData.offlinePromptActivePresetId
                            : '';
                        if (deletePromptPresetBtn)
                            deletePromptPresetBtn.disabled = !promptPresetSelect.value;
                    },
                    markPromptWorkCopyCustom = () => {
                        window.imData.offlinePromptActivePresetId = '';
                        if (promptPresetSelect) promptPresetSelect.value = '';
                        if (deletePromptPresetBtn) deletePromptPresetBtn.disabled = true;
                    },
                    promptPresetCard = document.createElement('section');
                promptPresetCard.className = 'offline-theme-card offline-prompt-preset-card';
                const promptPresetHeading = document.createElement('div');
                promptPresetHeading.className = 'offline-theme-heading';
                promptPresetHeading.innerHTML =
                    '<div><strong>提示词预设</strong><span>PROMPT PRESETS</span></div><p>所有角色和群聊共用当前线下提示词。</p>';
                promptPresetCard.appendChild(promptPresetHeading);
                const element_2056 = document.createElement('div');
                element_2056.className = 'offline-theme-preset-controls';
                promptPresetSelect = document.createElement('select');
                promptPresetSelect.className = 'offline-theme-preset-select';
                promptPresetSelect.setAttribute('aria-label', '选择全局线下提示词预设');
                deletePromptPresetBtn = document.createElement('button');
                deletePromptPresetBtn.type = 'button';
                deletePromptPresetBtn.className = 'offline-theme-preset-delete';
                deletePromptPresetBtn.textContent = '删除';
                promptPresetSelect.addEventListener('change', async () => {
                    const preset_6 = presets_5.find(
                        (value_2079) => value_2079.id === promptPresetSelect.value,
                    );
                    if (!preset_6) {
                        await persistGlobalOfflinePromptState({
                            prompts: prompts_8,
                            presets: presets_5,
                            activePresetId: '',
                        });
                        refreshPromptPresetSelect();
                        return;
                    }
                    prompts_8 = preset_6.prompts.map(cloneOfflinePrompt);
                    await persistGlobalOfflinePromptState({
                        prompts: prompts_8,
                        presets: presets_5,
                        activePresetId: preset_6.id,
                        textReplacementRules: preset_6.textReplacementRules,
                        htmlTemplateRules: preset_6.htmlTemplateRules,
                    });
                    renderOfflineChatSettingsEditor(listEl, activeFriend_46);
                    if (window.showToast) window.showToast('已应用提示词预设：' + preset_6.name);
                });
                const onConfirm_3 = async () => {
                    const selectedId_2 = promptPresetSelect.value;
                    if (!selectedId_2) return;
                    presets_5 = normalizeOfflinePromptPresets_2(
                        presets_5.filter((preset_7) => preset_7.id !== selectedId_2),
                    );
                    await persistGlobalOfflinePromptState({
                        prompts: prompts_8,
                        presets: presets_5,
                        activePresetId: '',
                    });
                    renderOfflineChatSettingsEditor(listEl, activeFriend_46);
                    if (window.showToast) window.showToast('提示词预设已删除，当前提示词保持不变');
                };
                deletePromptPresetBtn.addEventListener('click', () => {
                    const result_2082 = presets_5.find(
                        (value_2083) => value_2083.id === promptPresetSelect.value,
                    );
                    if (!result_2082) return;
                    window.showCustomModal
                        ? window.showCustomModal({
                              title: '删除提示词预设',
                              message:
                                  '确定删除“' +
                                  result_2082.name +
                                  '”吗？当前已应用的提示词不会被清空。',
                              confirmText: '删除',
                              cancelText: '取消',
                              isDestructive: true,
                              onConfirm: onConfirm_3,
                          })
                        : onConfirm_3();
                });
                element_2056.append(promptPresetSelect, deletePromptPresetBtn);
                promptPresetCard.appendChild(element_2056);
                const element_2058 = document.createElement('div');
                element_2058.className = 'offline-theme-save-row';
                const promptPresetNameInput = document.createElement('input');
                promptPresetNameInput.type = 'text';
                promptPresetNameInput.maxLength = 40;
                promptPresetNameInput.placeholder = '输入提示词预设名称';
                const savePromptPresetBtn = document.createElement('button');
                savePromptPresetBtn.type = 'button';
                savePromptPresetBtn.textContent = '保存预设';
                savePromptPresetBtn.addEventListener('click', async () => {
                    const name_5 = promptPresetNameInput.value.trim().slice(0, 40);
                    if (!name_5) {
                        if (window.showToast) window.showToast('请先输入提示词预设名称');
                        promptPresetNameInput.focus();
                        return;
                    }
                    const existing = presets_5.find(
                            (value_2088) =>
                                value_2088.name.toLocaleLowerCase() === name_5.toLocaleLowerCase(),
                        ),
                        id_8 = existing?.id || createOfflinePromptPresetId(),
                        nextPreset = {
                            id: id_8,
                            name: name_5,
                            prompts: normalizeOfflinePrompts(prompts_8),
                            textReplacementRules: value_214(),
                            htmlTemplateRules: value_213(),
                        };
                    presets_5 = normalizeOfflinePromptPresets_2(
                        existing
                            ? presets_5.map((preset_8) =>
                                  preset_8.id === id_8 ? nextPreset : preset_8,
                              )
                            : presets_5.concat(nextPreset),
                    );
                    await persistGlobalOfflinePromptState({
                        prompts: prompts_8,
                        presets: presets_5,
                        activePresetId: id_8,
                    });
                    promptPresetNameInput.value = '';
                    refreshPromptPresetSelect();
                    if (window.showToast)
                        window.showToast(
                            existing
                                ? '已覆盖提示词预设：' + name_5
                                : '已保存提示词预设：' + name_5,
                        );
                });
                element_2058.append(promptPresetNameInput, savePromptPresetBtn);
                promptPresetCard.appendChild(element_2058);
                listEl.appendChild(promptPresetCard);
                refreshPromptPresetSelect();
                const variableHint = document.createElement('div');
                variableHint.className = 'offline-settings-variable-hint';
                variableHint.innerHTML =
                    '<div class="offline-settings-section-kicker"><strong>可用变量</strong><span>VARIABLES</span></div><div><code>{{user}}</code> 当前 User 名字</div><div><code>{{char}}</code> 单聊为 Char 真名；群聊为全部群成员真名</div>';
                listEl.appendChild(variableHint);
                const promptsContainer = document.createElement('div');
                promptsContainer.className = 'offline-settings-prompts';
                listEl.appendChild(promptsContainer);
                const makeIconButton = (value_2090, title_3, disabled_3 = false) => {
                    const button_8 = document.createElement('button');
                    return (
                        (button_8.type = 'button'),
                        button_8.setAttribute('aria-label', title_3),
                        (button_8.title = title_3),
                        (button_8.disabled = disabled_3),
                        (button_8.className = 'offline-settings-icon-btn'),
                        (button_8.innerHTML = '<i class="' + value_2090 + '"></i>'),
                        button_8
                    );
                };
                prompts_8.forEach((prompt_16, index_9) => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'offline-settings-prompt-item';
                    const isHistoryAnchor = prompt_16.id === OFFLINE_CHAT_HISTORY_PROMPT_ID;
                    if (isHistoryAnchor) itemDiv.classList.add('offline-settings-history-anchor');
                    const topRow = document.createElement('div');
                    topRow.className = 'offline-settings-prompt-row';
                    const moveGroup = document.createElement('div');
                    moveGroup.className = 'offline-settings-move-actions';
                    const upBtn = makeIconButton('fas fa-arrow-up', '上移', index_9 === 0),
                        downBtn = makeIconButton(
                            'fas fa-arrow-down',
                            '下移',
                            index_9 === prompts_8.length - 1,
                        );
                    upBtn.addEventListener('click', async (event_13) => {
                        event_13.stopPropagation();
                        if (index_9 === 0) return;
                        const nextPrompts = prompts_8.slice();
                        [nextPrompts[index_9 - 1], nextPrompts[index_9]] = [
                            nextPrompts[index_9],
                            nextPrompts[index_9 - 1],
                        ];
                        await persistOfflinePrompts(nextPrompts);
                        renderOfflineChatSettingsEditor(listEl, activeFriend_46);
                    });
                    downBtn.addEventListener('click', async (event_14) => {
                        event_14.stopPropagation();
                        if (index_9 >= prompts_8.length - 1) return;
                        const nextPrompts_2 = prompts_8.slice();
                        [nextPrompts_2[index_9], nextPrompts_2[index_9 + 1]] = [
                            nextPrompts_2[index_9 + 1],
                            nextPrompts_2[index_9],
                        ];
                        await persistOfflinePrompts(nextPrompts_2);
                        renderOfflineChatSettingsEditor(listEl, activeFriend_46);
                    });
                    moveGroup.appendChild(upBtn);
                    moveGroup.appendChild(downBtn);
                    topRow.appendChild(moveGroup);
                    const nameWrap = document.createElement('div');
                    nameWrap.className = 'offline-settings-prompt-name';
                    if (prompt_16.editable !== false) {
                        const nameInput = document.createElement('input');
                        nameInput.type = 'text';
                        nameInput.value = prompt_16.name || '未命名提示词';
                        nameInput.className = 'offline-settings-name-input';
                        nameInput.addEventListener('click', (event_15) =>
                            event_15.stopPropagation(),
                        );
                        nameInput.addEventListener('input', () => {
                            prompt_16.name = nameInput.value || '未命名提示词';
                            markPromptWorkCopyCustom();
                            scheduleOfflinePromptsPersist(prompts_8);
                        });
                        nameWrap.appendChild(nameInput);
                    } else {
                        const nameLabel = document.createElement('div');
                        nameLabel.className = 'offline-settings-name-label';
                        nameLabel.textContent = prompt_16.name || '系统条目';
                        nameWrap.appendChild(nameLabel);
                    }
                    if (prompt_16.systemManaged) {
                        const managedLabel = document.createElement('div');
                        managedLabel.className = 'offline-settings-state-label';
                        managedLabel.textContent = isHistoryAnchor
                            ? '历史插入位置'
                            : '系统挂载 · 始终开启';
                        nameWrap.appendChild(managedLabel);
                    } else {
                        if (prompt_16.alwaysEnabled) {
                            const alwaysLabel = document.createElement('div');
                            alwaysLabel.className = 'offline-settings-state-label';
                            alwaysLabel.textContent = '已永久开启';
                            nameWrap.appendChild(alwaysLabel);
                        }
                    }
                    topRow.appendChild(nameWrap);
                    const itemDiv_2 = document.createElement('div');
                    itemDiv_2.className = 'offline-settings-prompt-actions';
                    let element_2104 = null,
                        contentDiv_3 = null,
                        contentDiv_2 = null;
                    prompt_16.deletable &&
                        ((element_2104 = makeIconButton('fas fa-trash', '删除')),
                        element_2104.classList.add('danger'),
                        element_2104.addEventListener('click', async (event_16) => {
                            event_16.stopPropagation();
                            const nextPrompts_3 = prompts_8.filter(
                                (__3, promptIndex) => promptIndex !== index_9,
                            );
                            await persistOfflinePrompts(nextPrompts_3);
                            renderOfflineChatSettingsEditor(listEl, activeFriend_46);
                        }));
                    if (!prompt_16.alwaysEnabled) {
                        contentDiv_2 = document.createElement('label');
                        contentDiv_2.className = 'toggle-switch';
                        contentDiv_2.style.cssText = 'margin:0;';
                        contentDiv_2.addEventListener('click', (event_2119) =>
                            event_2119.stopPropagation(),
                        );
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.checked = !!prompt_16.enabled;
                        checkbox.addEventListener('change', () => {
                            prompt_16.enabled = checkbox.checked;
                            markPromptWorkCopyCustom();
                            scheduleOfflinePromptsPersist(prompts_8);
                        });
                        const element_2118 = document.createElement('span');
                        element_2118.className = 'slider';
                        contentDiv_2.appendChild(checkbox);
                        contentDiv_2.appendChild(element_2118);
                    }
                    if (prompt_16.deletable) {
                        contentDiv_3 = document.createElement('label');
                        contentDiv_3.className = 'offline-settings-cot-mode-toggle';
                        contentDiv_3.title = '纳入本轮可见 COT 思考清单';
                        contentDiv_3.addEventListener('click', (event_2122) =>
                            event_2122.stopPropagation(),
                        );
                        const element_2120 = document.createElement('input');
                        element_2120.type = 'checkbox';
                        element_2120.checked = value_15(prompt_16);
                        element_2120.setAttribute('aria-label', '纳入 COT 思考');
                        element_2120.addEventListener('change', () => {
                            prompt_16.cotEnabled = element_2120.checked;
                            markPromptWorkCopyCustom();
                            scheduleOfflinePromptsPersist(prompts_8);
                        });
                        const element_2121 = document.createElement('span');
                        element_2121.textContent = 'COT';
                        contentDiv_3.append(element_2120, element_2121);
                    }
                    let contentDiv = null,
                        setExpanded = null,
                        expandBtn = null;
                    if (!isHistoryAnchor) {
                        contentDiv = document.createElement('div');
                        contentDiv.className = 'offline-settings-prompt-content';
                        if (prompt_16.editable !== false) {
                            const textarea_4 = document.createElement('textarea');
                            textarea_4.value = prompt_16.content || '';
                            textarea_4.placeholder = '输入提示词内容...';
                            textarea_4.className = 'offline-settings-prompt-textarea';
                            textarea_4.addEventListener('click', (event_17) =>
                                event_17.stopPropagation(),
                            );
                            textarea_4.addEventListener('input', () => {
                                prompt_16.content = textarea_4.value;
                                markPromptWorkCopyCustom();
                                scheduleOfflinePromptsPersist(prompts_8);
                            });
                            contentDiv.appendChild(textarea_4);
                        } else {
                            const preview = document.createElement('div');
                            preview.className = 'offline-settings-prompt-preview';
                            preview.textContent = prompt_16.content || '';
                            contentDiv.appendChild(preview);
                        }
                        expandBtn = makeIconButton('fas fa-chevron-down', '展开提示词');
                        expandBtn.classList.add('offline-settings-expand-btn');
                        expandBtn.setAttribute('aria-expanded', 'false');
                        setExpanded = (expanded_3) => {
                            contentDiv.style.display = expanded_3 ? 'block' : 'none';
                            expandBtn.setAttribute('aria-expanded', String(expanded_3));
                            expandBtn.setAttribute(
                                'aria-label',
                                expanded_3 ? '收起提示词' : '展开提示词',
                            );
                            expandBtn.title = expanded_3 ? '收起提示词' : '展开提示词';
                        };
                        expandBtn.addEventListener('click', (event_18) => {
                            event_18.stopPropagation();
                            setExpanded(expandBtn.getAttribute('aria-expanded') !== 'true');
                        });
                    }
                    if (contentDiv_3) itemDiv_2.appendChild(contentDiv_3);
                    if (element_2104) itemDiv_2.appendChild(element_2104);
                    if (contentDiv_2) itemDiv_2.appendChild(contentDiv_2);
                    if (expandBtn) itemDiv_2.appendChild(expandBtn);
                    topRow.appendChild(itemDiv_2);
                    topRow.addEventListener('click', (event_19) => {
                        if (!setExpanded || !expandBtn) return;
                        if (event_19.target.closest('button, input, textarea, label')) return;
                        setExpanded(expandBtn.getAttribute('aria-expanded') !== 'true');
                    });
                    itemDiv.appendChild(topRow);
                    if (contentDiv) itemDiv.appendChild(contentDiv);
                    promptsContainer.appendChild(itemDiv);
                });
                promptsContainer.lastElementChild &&
                    (promptsContainer.lastElementChild.style.borderBottom = 'none');
                const addBtn = document.createElement('button');
                addBtn.type = 'button';
                addBtn.className = 'offline-settings-add-btn';
                addBtn.innerHTML = '<i class="fas fa-plus"></i><span>增加条目</span>';
                addBtn.addEventListener('click', async () => {
                    const nextPrompts_4 = prompts_8.concat(createCustomOfflinePrompt());
                    await persistOfflinePrompts(nextPrompts_4);
                    renderOfflineChatSettingsEditor(listEl, activeFriend_46);
                });
                listEl.appendChild(addBtn);
            },
            renderOfflineChatSettings = () => {
                const listEl_5 = document.getElementById('offline-chat-settings-list'),
                    regexListEl = document.getElementById('offline-chat-regex-list');
                if (!listEl_5 || !regexListEl) return;
                listEl_5.innerHTML = '';
                regexListEl.innerHTML = '';
                const currentActiveFriend_2130 = window.imData.currentActiveFriend;
                if (!currentActiveFriend_2130) return;
                renderOfflineChatSettingsEditor(listEl_5, currentActiveFriend_2130);
                value_364(regexListEl, currentActiveFriend_2130);
                const tabButtons = Array.from(
                        document.querySelectorAll(
                            '#offline-chat-settings-tabs [data-offline-settings-tab]',
                        ),
                    ),
                    panels = {
                        prompts: document.getElementById('offline-chat-prompts-panel'),
                        regex: document.getElementById('offline-chat-regex-panel'),
                    },
                    activateTab = (tabName) => {
                        Object.entries(panels).forEach(([name_6, panel]) => {
                            if (!panel) return;
                            const active = name_6 === tabName;
                            panel.hidden = !active;
                            panel.classList.toggle('active', active);
                        });
                        tabButtons.forEach((button) => {
                            const active_2 =
                                button.getAttribute('data-offline-settings-tab') === tabName;
                            button.classList.toggle('active', active_2);
                            button.setAttribute('aria-selected', String(active_2));
                        });
                    };
                tabButtons.forEach((button_9) => {
                    button_9.onclick = () =>
                        activateTab(button_9.getAttribute('data-offline-settings-tab'));
                });
                activateTab('prompts');
            },
            value_365 = () => {
                const sendBtn = document.getElementById('offline-chat-send-btn'),
                    offlineChatInputElement_2134 = document.getElementById('offline-chat-input'),
                    attachmentBtn = document.getElementById('offline-chat-attachment-btn'),
                    actionSheet = document.getElementById('offline-chat-action-sheet'),
                    actionCancel = document.getElementById('offline-chat-action-cancel'),
                    offlineChatEpisodeToggleElement = document.getElementById(
                        'offline-chat-episode-toggle',
                    ),
                    clearBtn = document.getElementById('offline-chat-clear-btn'),
                    endBtn = document.getElementById('offline-chat-end-btn'),
                    exportTxtBtn = document.getElementById('offline-chat-export-txt-btn'),
                    offlineChatViewElement_2135 = document.getElementById('offline-chat-view'),
                    summarySheet_2 = document.getElementById('offline-chat-summary-sheet'),
                    summaryApiSelect = document.getElementById('offline-summary-api-select'),
                    summaryPromptInput = document.getElementById('offline-summary-prompt-input'),
                    summaryStartInput = document.getElementById('offline-summary-start-floor'),
                    summaryEndInput = document.getElementById('offline-summary-end-floor'),
                    summaryOnlyBtn = document.getElementById('offline-summary-only-btn'),
                    summaryEndBtn = document.getElementById('offline-summary-end-btn'),
                    summaryCancelBtn = document.getElementById('offline-summary-cancel-btn'),
                    offlineResultPreviewModalElement = document.getElementById(
                        'offline-result-preview-modal',
                    ),
                    offlineResultPreviewCancelElement = document.getElementById(
                        'offline-result-preview-cancel',
                    ),
                    offlineResultPreviewRegenerateElement = document.getElementById(
                        'offline-result-preview-regenerate',
                    ),
                    offlineResultPreviewConfirmElement = document.getElementById(
                        'offline-result-preview-confirm',
                    );
                let enabled_2137 = false,
                    value_2138 = null,
                    value_2139 = null,
                    value_2140 = null,
                    value_2141 = null;
                const closeOfflineSummarySheet_2 = () => {
                        if (!summarySheet_2) return;
                        summarySheet_2.classList.remove('active');
                        setTimeout(() => {
                            summarySheet_2.style.display = 'none';
                        }, 180);
                    },
                    getOfflineSummarySettingsFromModal = () =>
                        normalizeOfflineSummarySettings({
                            apiPresetId: summaryApiSelect?.value || '',
                            prompt: summaryPromptInput?.value || '',
                        }),
                    saveOfflineSummarySettingsFromModal = async () => {
                        const activeFriend_47 = window.imData.currentActiveFriend;
                        if (!activeFriend_47) return;
                        await persistOfflineSummarySettings(
                            activeFriend_47,
                            getOfflineSummarySettingsFromModal(),
                        );
                    },
                    value_2144 = (value_2147) => {
                        if (!summaryApiSelect) return;
                        const normalized_3 = normalizeOfflineSummarySettings(value_2147),
                            presets_6 = getOfflineSummaryApiPresets();
                        summaryApiSelect.replaceChildren();
                        const currentOption = document.createElement('option');
                        currentOption.value = '';
                        currentOption.textContent = '跟随当前 API';
                        summaryApiSelect.appendChild(currentOption);
                        presets_6.forEach((preset_9) => {
                            const option_2 = document.createElement('option');
                            option_2.value = String(preset_9?.id || '');
                            option_2.textContent = String(preset_9?.name || '未命名预设');
                            summaryApiSelect.appendChild(option_2);
                        });
                        summaryApiSelect.value = presets_6.some(
                            (preset_10) => String(preset_10?.id || '') === normalized_3.apiPresetId,
                        )
                            ? normalized_3.apiPresetId
                            : '';
                    },
                    value_2145 = (value_2154, value_2155) => {
                        const rawThinking_2 = window.imData.currentActiveFriend;
                        if (!rawThinking_2 || !value_2155) return;
                        const value_2157 = value_2154 === 'end',
                            text_14 = value_2157
                                ? value_2155.meetingSummary.summary
                                : value_2155.summary;
                        value_2140 = value_2157 ? value_2155 : null;
                        value_2141 = value_2157 ? value_2155 : null;
                        buildOfflineThinkingHtml_2(rawThinking_2, true);
                        value_324.open({
                            title: value_2157 ? '结束见面预览' : '线下总结预览',
                            subtitle: value_2157
                                ? '标题：' + value_2155.meetingSummary.title
                                : '第 ' +
                                  value_2155.sourceFloorStart +
                                  '–' +
                                  value_2155.sourceFloorEnd +
                                  ' 楼',
                            text: text_14,
                            editable: true,
                            confirmText: value_2157 ? '确认结束见面' : '确认保存总结',
                            regenerateText: '重新总结',
                            onCancel: () => {
                                buildOfflineThinkingHtml_2(rawThinking_2, false);
                                openOfflineSummarySheet();
                            },
                            onRegenerate: async () => {
                                const offlineSummarySettingsFromModal =
                                        getOfflineSummarySettingsFromModal(),
                                    token_2159 = value_324.getState()?.token;
                                value_324.setBusy(true);
                                try {
                                    const value_2160 = value_2157
                                        ? await persistOfflineSummarySettings_2(
                                              rawThinking_2,
                                              offlineSummarySettingsFromModal,
                                          )
                                        : await value_317(
                                              rawThinking_2,
                                              value_2155.sourceFloorStart,
                                              value_2155.sourceFloorEnd,
                                              offlineSummarySettingsFromModal,
                                          );
                                    if (!value_324.isCurrent(token_2159)) return;
                                    if (value_2157) value_2141 = value_2160;
                                    else value_2140 = value_2160;
                                    value_324.update({
                                        text: value_2157
                                            ? value_2160.meetingSummary.summary
                                            : value_2160.summary,
                                        subtitle: value_2157
                                            ? '标题：' + value_2160.meetingSummary.title
                                            : '第 ' +
                                              value_2160.sourceFloorStart +
                                              '–' +
                                              value_2160.sourceFloorEnd +
                                              ' 楼',
                                    });
                                } catch (value_2161) {
                                    console.error(
                                        'Offline preview regeneration failed',
                                        value_2161,
                                    );
                                    value_310('重新总结失败', value_2161);
                                } finally {
                                    if (value_324.isCurrent(token_2159)) value_324.setBusy(false);
                                }
                            },
                            onConfirm: async () => {
                                const state = value_324.getState();
                                if (!state) return;
                                const summary_7 = value_324.getText();
                                if (!summary_7) {
                                    window.showToast?.('预览内容不能为空');
                                    return;
                                }
                                value_324.setBusy(true);
                                try {
                                    if (value_2157) {
                                        const value_2163 = value_2141 || value_2155;
                                        value_2163.meetingSummary = {
                                            ...value_2163.meetingSummary,
                                            summary: summary_7,
                                        };
                                        const value_2164 = await value_321(
                                            rawThinking_2,
                                            value_2163,
                                            summaryEndBtn,
                                        );
                                        value_2164 &&
                                            (value_324.close(), closeOfflineSummarySheet_2());
                                    } else {
                                        await getOfflineSpeechDisplayText_2(
                                            rawThinking_2,
                                            value_2140 || value_2155,
                                            summary_7,
                                        );
                                        value_324.close();
                                        closeOfflineSummarySheet_2();
                                        window.showToast?.(
                                            '第 ' +
                                                value_2155.sourceFloorStart +
                                                '–' +
                                                value_2155.sourceFloorEnd +
                                                ' 楼已总结并归档',
                                        );
                                    }
                                } catch (value_2165) {
                                    console.error(
                                        'Offline preview confirmation failed',
                                        value_2165,
                                    );
                                    window.showToast?.(
                                        /source floors changed/i.test(
                                            String(value_2165?.message || ''),
                                        )
                                            ? '原楼层内容已变化，请重新生成总结'
                                            : '保存预览内容失败，请稍后重试',
                                    );
                                } finally {
                                    if (value_324.getState()) value_324.setBusy(false);
                                    buildOfflineThinkingHtml_2(rawThinking_2, false);
                                }
                            },
                        });
                        closeOfflineSummarySheet_2();
                    },
                    openOfflineSummarySheet = () => {
                        const currentActiveFriend_2166 = window.imData.currentActiveFriend;
                        if (!currentActiveFriend_2166 || !summarySheet_2) return;
                        const value_221_2167 = value_221(currentActiveFriend_2166),
                            unarchivedRows = getOfflineUnarchivedDialogueRows(value_221_2167),
                            allRows = getOfflineDialogueRows(value_221_2167),
                            canEnd = value_221_2167.some(
                                (message_2172) =>
                                    isOfflineSummaryMessage(message_2172) ||
                                    message_2172.role === 'user' ||
                                    message_2172.role === 'assistant',
                            );
                        if (!canEnd) {
                            if (window.showToast) window.showToast('没有可结束的见面内容');
                            return;
                        }
                        const firstFloor = unarchivedRows[0]?.floor || allRows[0]?.floor || 1,
                            lastFloor =
                                unarchivedRows[unarchivedRows.length - 1]?.floor ||
                                allRows[allRows.length - 1]?.floor ||
                                firstFloor,
                            settings_5 = getOfflineSummarySettings(currentActiveFriend_2166);
                        value_2144(settings_5);
                        if (summaryPromptInput) summaryPromptInput.value = settings_5.prompt;
                        [summaryStartInput, summaryEndInput].forEach((input) => {
                            if (!input) return;
                            input.min = String(firstFloor);
                            input.max = String(lastFloor);
                        });
                        if (summaryStartInput) summaryStartInput.value = String(firstFloor);
                        if (summaryEndInput) summaryEndInput.value = String(lastFloor);
                        if (summaryOnlyBtn) summaryOnlyBtn.disabled = unarchivedRows.length === 0;
                        if (summaryEndBtn) summaryEndBtn.disabled = false;
                        summarySheet_2.style.display = 'flex';
                        void summarySheet_2.offsetWidth;
                        summarySheet_2.classList.add('active');
                    };
                summaryApiSelect &&
                    summaryApiSelect.addEventListener('change', () => {
                        saveOfflineSummarySettingsFromModal()['catch']((error_17) => {
                            console.error('Offline summary API setting save failed', error_17);
                            if (window.showToast) window.showToast('线下总结设置保存失败');
                        });
                    });
                summaryPromptInput &&
                    summaryPromptInput.addEventListener('input', () => {
                        if (value_2139) clearTimeout(value_2139);
                        value_2139 = setTimeout(() => {
                            saveOfflineSummarySettingsFromModal()['catch']((error_18) =>
                                console.error('Offline summary prompt save failed', error_18),
                            );
                        }, 350);
                    });
                if (summaryCancelBtn)
                    summaryCancelBtn.addEventListener('click', closeOfflineSummarySheet_2);
                summarySheet_2 &&
                    summarySheet_2.addEventListener('click', (event_20) => {
                        if (event_20.target === summarySheet_2) closeOfflineSummarySheet_2();
                    });
                offlineResultPreviewCancelElement &&
                    offlineResultPreviewCancelElement.dataset.generatedResultPreviewBound !==
                        'true' &&
                    offlineResultPreviewCancelElement.addEventListener('click', async () => {
                        const state_2176 = value_324.getState();
                        if (!state_2176 || state_2176.busy) return;
                        value_324.close();
                        await state_2176.onCancel?.();
                    });
                offlineResultPreviewRegenerateElement &&
                    offlineResultPreviewRegenerateElement.dataset.generatedResultPreviewBound !==
                        'true' &&
                    offlineResultPreviewRegenerateElement.addEventListener('click', async () => {
                        const state_2177 = value_324.getState();
                        if (!state_2177 || state_2177.busy) return;
                        await state_2177.onRegenerate?.();
                    });
                offlineResultPreviewConfirmElement &&
                    offlineResultPreviewConfirmElement.dataset.generatedResultPreviewBound !==
                        'true' &&
                    offlineResultPreviewConfirmElement.addEventListener('click', async () => {
                        const state_2178 = value_324.getState();
                        if (!state_2178 || state_2178.busy) return;
                        await state_2178.onConfirm?.();
                    });
                offlineResultPreviewModalElement &&
                    offlineResultPreviewModalElement.dataset.generatedResultPreviewBound !==
                        'true' &&
                    offlineResultPreviewModalElement.addEventListener('click', (event_2179) => {
                        if (event_2179.target !== offlineResultPreviewModalElement) return;
                        const state_2180 = value_324.getState();
                        if (!state_2180 || state_2180.busy) return;
                        value_324.close();
                        state_2180.onCancel?.();
                    });
                summaryOnlyBtn &&
                    summaryOnlyBtn.addEventListener('click', async () => {
                        const rawThinking_3 = window.imData.currentActiveFriend;
                        if (!rawThinking_3 || summaryOnlyBtn.disabled) return;
                        const offlineSummarySettingsFromModal_2182 =
                                getOfflineSummarySettingsFromModal(),
                            number_2183 = Number(summaryStartInput?.value),
                            number_2184 = Number(summaryEndInput?.value);
                        summaryOnlyBtn.disabled = true;
                        if (summaryEndBtn) summaryEndBtn.disabled = true;
                        let enabled_2185 = false;
                        buildOfflineThinkingHtml_2(rawThinking_3, true);
                        try {
                            if (window.showToast) window.showToast('正在生成线下总结...');
                            const value_2186 = await value_317(
                                rawThinking_3,
                                number_2183,
                                number_2184,
                                offlineSummarySettingsFromModal_2182,
                            );
                            value_2145('segment', value_2186);
                            enabled_2185 = true;
                        } catch (error_19) {
                            console.error('Offline segment summary failed', error_19);
                            const value_2188 = /already summarized/i.test(
                                String(error_19?.message || ''),
                            )
                                ? '所选楼层包含已归档内容，请选择连续的未归档楼层'
                                : /range is invalid/i.test(String(error_19?.message || ''))
                                  ? '请输入有效且连续的未归档楼层范围'
                                  : '';
                            if (value_2188) window.showToast?.(value_2188);
                            else value_310('线下总结失败', error_19);
                        } finally {
                            if (!enabled_2185) buildOfflineThinkingHtml_2(rawThinking_3, false);
                            summaryOnlyBtn.disabled = false;
                            if (summaryEndBtn) summaryEndBtn.disabled = false;
                        }
                    });
                summaryEndBtn &&
                    summaryEndBtn.addEventListener('click', async () => {
                        const rawThinking_4 = window.imData.currentActiveFriend;
                        if (!rawThinking_4 || summaryEndBtn.disabled) return;
                        const settings_6 = getOfflineSummarySettingsFromModal();
                        summaryEndBtn.disabled = true;
                        if (summaryOnlyBtn) summaryOnlyBtn.disabled = true;
                        let enabled_2191 = false;
                        buildOfflineThinkingHtml_2(rawThinking_4, true);
                        try {
                            const value_2192 = await handleAction_322(null, {
                                settings: settings_6,
                                previewOnly: true,
                            });
                            value_2192 && (value_2145('end', value_2192), (enabled_2191 = true));
                        } catch (value_2193) {
                            console.error('Offline meeting preview failed', value_2193);
                            value_310('结束见面总结失败', value_2193);
                        } finally {
                            if (!enabled_2191) buildOfflineThinkingHtml_2(rawThinking_4, false);
                            summaryEndBtn.disabled = false;
                            if (summaryOnlyBtn) summaryOnlyBtn.disabled = false;
                        }
                    });
                if (attachmentBtn && actionSheet) {
                    const value_2194 = () => {
                        if (!offlineChatEpisodeToggleElement) return;
                        const value_2195 =
                            window.imData.currentActiveFriend?.offlineEpisodeMode === true;
                        offlineChatEpisodeToggleElement.setAttribute(
                            'aria-pressed',
                            value_2195 ? 'true' : 'false',
                        );
                        const offlineChatEpisodeStateElement =
                            offlineChatEpisodeToggleElement.querySelector(
                                '.offline-chat-episode-state',
                            );
                        if (offlineChatEpisodeStateElement)
                            offlineChatEpisodeStateElement.textContent = value_2195
                                ? '已开启'
                                : '已关闭';
                    };
                    attachmentBtn.addEventListener('click', () => {
                        value_2194();
                        actionSheet.style.display = 'flex';
                        void actionSheet.offsetWidth;
                        actionSheet.classList.add('active');
                    });
                    offlineChatEpisodeToggleElement?.addEventListener('click', async () => {
                        const currentActiveFriend_2196 = window.imData.currentActiveFriend;
                        if (!currentActiveFriend_2196 || offlineChatEpisodeToggleElement.disabled)
                            return;
                        const offlineEpisodeMode_2 =
                            currentActiveFriend_2196.offlineEpisodeMode !== true;
                        offlineChatEpisodeToggleElement.disabled = true;
                        try {
                            const value_2198 = await window.imApp?.commitFriendMetaPatch?.(
                                currentActiveFriend_2196.id,
                                {
                                    offlineEpisodeMode: offlineEpisodeMode_2,
                                },
                                {
                                    silent: true,
                                },
                            );
                            if (!value_2198) throw new Error('Failed to save offline episode mode');
                            window.showToast?.(
                                offlineEpisodeMode_2 ? '番外模式已开启' : '番外模式已关闭',
                            );
                        } catch (value_2199) {
                            console.error('Failed to save offline episode mode', value_2199);
                            window.showToast?.('番外模式保存失败，请重试');
                        } finally {
                            offlineChatEpisodeToggleElement.disabled = false;
                            value_2194();
                        }
                    });
                    actionCancel &&
                        actionCancel.addEventListener('click', () => {
                            actionSheet.classList.remove('active');
                            setTimeout(() => {
                                actionSheet.style.display = 'none';
                            }, 300);
                        });
                    actionSheet.addEventListener('click', (event_2200) => {
                        event_2200.target === actionSheet &&
                            (actionSheet.classList.remove('active'),
                            setTimeout(() => {
                                actionSheet.style.display = 'none';
                            }, 300));
                    });
                }
                clearBtn &&
                    offlineChatViewElement_2135 &&
                    clearBtn.addEventListener('click', async () => {
                        actionSheet.classList.remove('active');
                        setTimeout(() => {
                            actionSheet.style.display = 'none';
                        }, 300);
                        const clearOfflineHistory = async () => {
                                const activeFriend_48 = window.imData.currentActiveFriend;
                                if (!activeFriend_48) return;
                                clearBtn.dataset.busy = 'true';
                                clearBtn.style.pointerEvents = 'none';
                                try {
                                    await persistOfflineMessages(activeFriend_48, []);
                                    renderOfflineCurrentMessages(activeFriend_48);
                                    if (window.showToast) window.showToast('线下聊天记录已清空');
                                } catch (error_20) {
                                    console.error('Failed to clear offline chat history', error_20);
                                    if (window.showToast)
                                        window.showToast('清空线下聊天记录失败，请重试');
                                } finally {
                                    clearBtn.dataset.busy = 'false';
                                    clearBtn.style.pointerEvents = '';
                                }
                            },
                            onConfirm_4 = () => {
                                void clearOfflineHistory();
                            };
                        if (window.showCustomModal)
                            window.showCustomModal({
                                title: '清空线下聊天记录',
                                message: '确定清空本次线下见面的全部聊天记录吗？此操作无法恢复。',
                                confirmText: '清空',
                                isDestructive: true,
                                onConfirm: onConfirm_4,
                            });
                        else
                            window.confirm(
                                '确定清空本次线下见面的全部聊天记录吗？此操作无法恢复。',
                            ) && onConfirm_4();
                    });
                endBtn &&
                    actionSheet &&
                    endBtn.addEventListener('click', async () => {
                        actionSheet.classList.remove('active');
                        setTimeout(() => {
                            actionSheet.style.display = 'none';
                        }, 300);
                        openOfflineSummarySheet();
                    });
                exportTxtBtn &&
                    actionSheet &&
                    exportTxtBtn.addEventListener('click', async () => {
                        const currentActiveFriend_2204 = window.imData.currentActiveFriend;
                        if (!currentActiveFriend_2204 || exportTxtBtn.disabled) return;
                        exportTxtBtn.disabled = true;
                        exportTxtBtn.style.pointerEvents = 'none';
                        const metaEl_4 = exportTxtBtn.querySelector('.offline-chat-action-label'),
                            textContent_7 = metaEl_4?.textContent || '';
                        if (metaEl_4) metaEl_4.textContent = '正在导出…';
                        try {
                            const result_7 = await handleAction_304(currentActiveFriend_2204);
                            actionSheet.classList.remove('active');
                            setTimeout(() => {
                                actionSheet.style.display = 'none';
                            }, 300);
                            if (result_7 === 'downloaded')
                                window.showToast?.('线下聊天记录已导出为 TXT');
                            if (result_7 === 'shared')
                                window.showToast?.('已打开系统保存，请选择“存储到文件”');
                        } catch (value_2207) {
                            window.showToast?.(
                                value_2207?.message || '线下聊天记录导出失败，请稍后重试',
                            );
                        } finally {
                            exportTxtBtn.disabled = false;
                            exportTxtBtn.style.pointerEvents = '';
                            if (metaEl_4) metaEl_4.textContent = textContent_7;
                        }
                    });
                if (sendBtn && offlineChatInputElement_2134) {
                    const handleClick = async () => {
                        if (enabled_2137) {
                            value_2138 &&
                                !value_2138.signal.aborted &&
                                (value_2138.abort(),
                                sendBtn.classList.remove('is-generating'),
                                sendBtn.classList.add('is-stopping'),
                                (sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'),
                                (sendBtn.title = '正在暂停'));
                            return;
                        }
                        const content_21 = offlineChatInputElement_2134.value.trim(),
                            activeFriend_49 = window.imData.currentActiveFriend;
                        if (!activeFriend_49) return;
                        if (isOfflineAutoImageMessage_2(activeFriend_49)) return;
                        if (!content_21) {
                            const value_221_2212 = value_221(activeFriend_49),
                                lastCurrentMessage = value_221_2212[value_221_2212.length - 1];
                            if (lastCurrentMessage?.role !== 'user') return;
                        }
                        const currentApiConfig_4 = window.getApiConfig
                            ? window.getApiConfig()
                            : window.apiConfig || {};
                        if (!currentApiConfig_4.endpoint || !currentApiConfig_4.apiKey) {
                            if (window.showToast) window.showToast('请先配置 API');
                            return;
                        }
                        {
                            offlineChatInputElement_2134.value = '';
                            enabled_2137 = true;
                            buildOfflineThinkingHtml_2(activeFriend_49, true);
                            const generationController = new AbortController();
                            value_2138 = generationController;
                            const innerHTML_9 = sendBtn.innerHTML,
                                title_4 = sendBtn.title || '';
                            sendBtn.classList.add('is-generating');
                            sendBtn.classList.remove('is-stopping');
                            sendBtn.innerHTML = '<i class="fas fa-pause"></i>';
                            sendBtn.title = '暂停生成';
                            let pendingAiMessage = null,
                                streamingBubble_5 = null,
                                userMsg = null,
                                element_2220 = null,
                                enabled_2221 = false;
                            try {
                                if (content_21) {
                                    const value_2237 = Array.isArray(
                                        activeFriend_49.offlineMessages,
                                    )
                                        ? activeFriend_49.offlineMessages
                                        : [];
                                    userMsg = {
                                        id: createOfflineChatId('offline-user'),
                                        role: 'user',
                                        content: content_21,
                                        timestamp: Date.now(),
                                    };
                                    element_2220 = renderOfflineChatBubble(userMsg, true, {
                                        floor: getOfflineDialogueRows(value_2237).length + 1,
                                        depth: 0,
                                        actionsDisabled: true,
                                    });
                                    element_2220?.classList.add('is-persistence-pending');
                                    element_2220?.setAttribute('aria-busy', 'true');
                                    await new Promise((render_7) => {
                                        typeof window.requestAnimationFrame === 'function'
                                            ? window.requestAnimationFrame(() =>
                                                  window.requestAnimationFrame(render_7),
                                              )
                                            : setTimeout(render_7, 0);
                                    });
                                }
                                await value_279(activeFriend_49);
                                const previousMessages = value_221(activeFriend_49),
                                    lastPreviousMessage =
                                        previousMessages[previousMessages.length - 1],
                                    resumeTrailingUser =
                                        !content_21 && lastPreviousMessage?.role === 'user';
                                if (!content_21 && !resumeTrailingUser) return;
                                let messagesWithUser = previousMessages;
                                if (content_21) {
                                    messagesWithUser = await persistOfflineMessages(
                                        activeFriend_49,
                                        previousMessages.concat(userMsg),
                                    );
                                    enabled_2221 = true;
                                    const persistedUserMsg =
                                        messagesWithUser.find(
                                            (message_37) =>
                                                String(message_37.id) === String(userMsg.id),
                                        ) || userMsg;
                                    element_2220?.classList.remove('is-persistence-pending');
                                    element_2220?.removeAttribute('aria-busy');
                                    enableOfflineChatBubbleActions(element_2220, persistedUserMsg);
                                }
                                const timestamp_5 = Date.now(),
                                    id_9 = createOfflineChatId('offline-ai');
                                pendingAiMessage = {
                                    id: id_9,
                                    role: 'assistant',
                                    content: '',
                                    timestamp: timestamp_5,
                                    tokens: 0,
                                };
                                streamingBubble_5 = createStreamingBubble('', false, {
                                    id: id_9,
                                    floor: getOfflineDialogueRows(messagesWithUser).length + 1,
                                    timestamp: timestamp_5,
                                    depth: 0,
                                });
                                if (!streamingBubble_5)
                                    throw new Error('Failed to create streaming bubble');
                                const requestContext_4 = await value_296(
                                        activeFriend_49,
                                        messagesWithUser,
                                    ),
                                    {
                                        content: content_22,
                                        reasoning: reasoning_5,
                                        tokens: tokens_4,
                                        aborted: aborted_3,
                                        truncated: truncated_4,
                                    } = await requestOfflineAssistantReplyWithCotValidation(
                                        requestContext_4,
                                        streamingBubble_5,
                                        {
                                            signal: generationController.signal,
                                            requestReasoning: true,
                                        },
                                    ),
                                    latestMessages = value_221(activeFriend_49),
                                    autoImageOutput = splitOfflineAutoImageMarker(content_22),
                                    aiMsgObj = {
                                        ...pendingAiMessage,
                                        content: autoImageOutput.content,
                                        reasoning: reasoning_5 || undefined,
                                        tokens: Math.max(0, Number(tokens_4) || 0),
                                        generationState: truncated_4 ? 'truncated' : undefined,
                                        continuationState: truncated_4 ? 'available' : undefined,
                                        generationError: truncated_4
                                            ? 'stream_truncated'
                                            : undefined,
                                    };
                                if (!String(content_22 || '').trim())
                                    renderOfflineCurrentMessages(activeFriend_49, {
                                        scroll: true,
                                        preserveScroll: false,
                                    });
                                else {
                                    if (!String(autoImageOutput.content || '').trim())
                                        renderOfflineCurrentMessages(activeFriend_49, {
                                            scroll: true,
                                            preserveScroll: false,
                                        });
                                    else {
                                        const persistedMessages = await persistOfflineMessages(
                                            activeFriend_49,
                                            latestMessages.concat(aiMsgObj),
                                        );
                                        streamingBubble_5.enableActions(aiMsgObj);
                                        autoImageOutput.scene &&
                                            (await generateOfflineAutoImage(
                                                activeFriend_49,
                                                aiMsgObj.id,
                                                autoImageOutput.scene,
                                                persistedMessages,
                                            ));
                                    }
                                }
                                aborted_3 &&
                                    window.showToast &&
                                    window.showToast(
                                        content_22 ? '已暂停生成' : '已暂停生成，可重回空白楼层',
                                    );
                            } catch (error_21) {
                                console.error('Offline Chat API Error:', error_21);
                                const isPersistenceFailure =
                                    /Failed to persist offline meeting/.test(
                                        String(error_21?.message || ''),
                                    );
                                if (userMsg && !enabled_2221) {
                                    element_2220?.remove();
                                    if (!offlineChatInputElement_2134.value)
                                        offlineChatInputElement_2134.value = userMsg.content;
                                }
                                let failureFloorPersistenceFailed = false;
                                if (!isPersistenceFailure && pendingAiMessage)
                                    try {
                                        const latestMessages_2 = value_221(activeFriend_49),
                                            alreadyPersisted = latestMessages_2.some(
                                                (message_38) =>
                                                    String(message_38.id) ===
                                                    String(pendingAiMessage.id),
                                            );
                                        if (!alreadyPersisted) {
                                            const failedResult =
                                                    streamingBubble_5?.getResult?.() || {},
                                                content_23 = String(failedResult.content || '');
                                            if (!content_23.trim())
                                                renderOfflineCurrentMessages(activeFriend_49, {
                                                    scroll: true,
                                                    preserveScroll: false,
                                                });
                                            else {
                                                const failedMessage = {
                                                    ...pendingAiMessage,
                                                    content: content_23,
                                                    reasoning:
                                                        String(
                                                            failedResult.reasoning || '',
                                                        ).trim() || undefined,
                                                    generationState: 'failed',
                                                    generationError:
                                                        error_21?.code ===
                                                        'reasoning_config_unsupported'
                                                            ? 'reasoning_unsupported'
                                                            : error_21?.code ===
                                                                'reasoning_tokens_exhausted'
                                                              ? 'reasoning_tokens_exhausted'
                                                              : 'request_failed',
                                                };
                                                await persistOfflineMessages(
                                                    activeFriend_49,
                                                    latestMessages_2.concat(failedMessage),
                                                );
                                                renderOfflineCurrentMessages(activeFriend_49, {
                                                    scroll: true,
                                                    preserveScroll: false,
                                                });
                                            }
                                        }
                                    } catch (persistError) {
                                        console.error(
                                            'Failed to persist offline failure floor:',
                                            persistError,
                                        );
                                        failureFloorPersistenceFailed = true;
                                    }
                                if (
                                    !isPersistenceFailure &&
                                    !failureFloorPersistenceFailed &&
                                    window.u2Api?.isRequestError?.(error_21) &&
                                    window.u2Api.reportError(error_21, {
                                        operation: '线下聊天回复',
                                        signal: generationController.signal,
                                    })
                                ) {
                                } else
                                    window.showToast &&
                                        !generationController.signal.aborted &&
                                        window.showToast(
                                            isPersistenceFailure || failureFloorPersistenceFailed
                                                ? '线下聊天记录保存失败'
                                                : error_21?.code === 'reasoning_config_unsupported'
                                                  ? '当前接口不支持自动推理配置'
                                                  : error_21?.code === 'reasoning_tokens_exhausted'
                                                    ? '思考已用完固定的 30000 回复 Token，请重试或更换模型'
                                                    : error_21?.code === 'empty_response'
                                                      ? '模型返回了空回复，请重试或更换模型'
                                                      : '请求失败，请检查网络或 API 配置',
                                        );
                            } finally {
                                buildOfflineThinkingHtml_2(activeFriend_49, false);
                                enabled_2137 = false;
                                value_2138 = null;
                                sendBtn.classList.remove('is-generating', 'is-stopping');
                                sendBtn.innerHTML = innerHTML_9;
                                sendBtn.title = title_4;
                                const offlineChatContentElement_2252 =
                                        document.getElementById('offline-chat-content'),
                                    isFollowing_2253 = value_270.isFollowing(
                                        offlineChatContentElement_2252,
                                    );
                                setTimeout(() => {
                                    try {
                                        offlineChatInputElement_2134.focus({
                                            preventScroll: true,
                                        });
                                    } catch (value_2254) {
                                        offlineChatInputElement_2134.focus();
                                    }
                                    if (isFollowing_2253)
                                        scrollOfflineChatToBottom(offlineChatContentElement_2252);
                                }, 50);
                            }
                        }
                        return;
                    };
                    sendBtn.addEventListener('click', handleClick);
                    offlineChatInputElement_2134.addEventListener('keydown', (event_2255) => {
                        if (event_2255.isComposing || event_2255.keyCode === 229) return;
                        (event_2255.ctrlKey || event_2255.metaKey) &&
                            (event_2255.key === 'Enter' || event_2255.keyCode === 13) &&
                            (event_2255.preventDefault(), handleClick());
                    });
                }
            };
        value_365();
        const closeSheet = () => {
                const currentPage = attachmentSheet_2.parentElement || page,
                    insChatInputContainerElement = currentPage.querySelector(
                        '.ins-chat-input-container',
                    );
                value_171();
                stopLinkedAccountTimer_2();
                closeLinkedAccountModal();
                closePayTransferForm();
                closeVoiceMessageForm();
                value_257();
                closeRegenerateForm();
                closeOfflineSummarySheet();
                sheetOverlayElement.style.opacity = '0';
                content_4.style.transform = 'translateY(100%)';
                if (renderTimerId_2 !== null) clearTimeout(renderTimerId_2);
                renderTimerId_2 = setTimeout(() => {
                    attachmentSheet_2.style.display = 'none';
                    renderTimerId_2 = null;
                }, 300);
            },
            submitVoiceMessage = async () => {
                const transcript_2 = String(
                    voiceTranscriptInput ? voiceTranscriptInput.value : '',
                ).trim();
                if (!transcript_2) {
                    if (window.showToast) window.showToast('请输入语音内容');
                    return;
                }
                closeVoiceMessageForm();
                closeSheet();
                await window.imChat.sendVoiceMessage(transcript_2);
            },
            value_367 = async () => {
                const value_370_2258 = getAttachmentTargetFriend(),
                    currentActiveFriend_2259 = window.imData.currentActiveFriend;
                if (
                    !value_370_2258 ||
                    value_370_2258.type !== 'char' ||
                    !currentActiveFriend_2259 ||
                    String(currentActiveFriend_2259.id) !== String(value_370_2258.id)
                ) {
                    closeOfflineSummarySheet();
                    window.showToast?.('当前聊天已切换，请重新选择名片');
                    return;
                }
                const result_2260 = value_175(value_370_2258).find(
                    (value_2262) => String(value_2262.id) === String(text_160),
                );
                if (!result_2260) {
                    value_176(value_370_2258);
                    window.showToast?.('该名片已失效，请重新选择');
                    return;
                }
                if (contactCardPickerConfirmElement)
                    contactCardPickerConfirmElement.disabled = true;
                closeOfflineSummarySheet();
                closeSheet();
                const value_2261 = await window.imChat.sendContactCard?.(result_2260.id, {
                    friendId: value_370_2258.id,
                    role: 'user',
                });
                if (!value_2261) window.showToast?.('名片发送失败');
            },
            value_368 = async () => {
                const trim_2263 = String(narrationInput ? narrationInput.value : '').trim();
                if (!trim_2263) {
                    if (window.showToast) window.showToast('请输入旁白内容');
                    return;
                }
                const activeFriend_50 = window.imData.currentActiveFriend;
                if (!activeFriend_50) {
                    if (window.showToast) window.showToast('当前聊天不存在');
                    return;
                }
                if (activeFriend_50.type === 'group' && Number(activeFriend_50.leftGroupAt) > 0) {
                    if (window.showToast) window.showToast('已退出该群，不能添加旁白');
                    return;
                }
                const elementById_2265 = document.getElementById(
                        'chat-interface-' + activeFriend_50.id,
                    ),
                    value_2266 = elementById_2265
                        ? elementById_2265.querySelector('.ins-chat-messages')
                        : null,
                    timestamp_9 = Date.now(),
                    options_2268 = {
                        id: window.imChat.createMessageId
                            ? window.imChat.createMessageId('notice')
                            : 'notice-' + timestamp_9,
                        role: 'system',
                        type: 'system_notice',
                        noticeKind: 'narration',
                        narrationSource: 'manual',
                        content: trim_2263,
                        text: trim_2263,
                        timestamp: timestamp_9,
                    },
                    saved_15 = window.imApp.appendFriendMessage
                        ? await window.imApp.appendFriendMessage(activeFriend_50.id, options_2268, {
                              silent: true,
                          })
                        : await commitSheetFriendChange(
                              activeFriend_50,
                              (value_2271) => {
                                  if (!value_2271.messages) value_2271.messages = [];
                                  value_2271.messages.push(options_2268);
                              },
                              {
                                  silent: true,
                              },
                          );
                if (!saved_15) {
                    if (window.showToast) window.showToast('旁白保存失败');
                    return;
                }
                value_257();
                closeSheet();
                const latestFriend_6 =
                    (window.imData.friends || []).find(
                        (item_28) => String(item_28.id) === String(activeFriend_50.id),
                    ) || activeFriend_50;
                if (value_2266) {
                    const value_2273 = window.imChat.appendMessageToContainer
                        ? window.imChat.appendMessageToContainer(
                              latestFriend_6,
                              value_2266,
                              options_2268,
                              {
                                  scroll: true,
                              },
                          )
                        : false;
                    !value_2273 &&
                        window.imChat.rerenderChatContainer &&
                        window.imChat.rerenderChatContainer(latestFriend_6, value_2266, {
                            scroll: true,
                        });
                }
            },
            submitRegenerateRequest = async (useRequirement) => {
                if (regenerateEntry?.dataset?.busy === 'true') return;
                const activeFriend_51 = window.imData.currentActiveFriend;
                if (!activeFriend_51 || !window.imChat.regenerateLastAiReply) {
                    if (window.showToast) window.showToast('暂无可重回的回复');
                    return;
                }
                const userRequirement_2 = useRequirement
                    ? String(
                          regenerateRequirementInput ? regenerateRequirementInput.value : '',
                      ).trim()
                    : '';
                if (useRequirement && !userRequirement_2) {
                    if (window.showToast) window.showToast('请先输入参考要求');
                    if (regenerateRequirementInput) regenerateRequirementInput.focus();
                    return;
                }
                setRegenerateBusyState(true);
                closeRegenerateForm();
                closeSheet();
                try {
                    await window.imChat.regenerateLastAiReply(activeFriend_51, regenerateEntry, {
                        userRequirement: userRequirement_2,
                    });
                } finally {
                    setRegenerateBusyState(false);
                }
            },
            value_369 = async () => {
                const activeFriend_52 = window.imData.currentActiveFriend;
                if (!activeFriend_52) {
                    if (window.showToast) window.showToast('当前聊天不存在');
                    return;
                }
                const isGroupChat_3 = activeFriend_52.type === 'group',
                    value_2279 = 'chat-interface-' + activeFriend_52.id,
                    elementById_2280 = document.getElementById(value_2279),
                    value_2281 = elementById_2280
                        ? elementById_2280.querySelector('.ins-chat-messages')
                        : null,
                    timestamp_10 = Date.now(),
                    lastMsg =
                        activeFriend_52.messages && activeFriend_52.messages.length > 0
                            ? activeFriend_52.messages[activeFriend_52.messages.length - 1]
                            : null;
                if (currentPayMode === 'red_packet' && isGroupChat_3) {
                    const packetCount_2 = parseInt(
                            payRedPacketCountInput ? payRedPacketCountInput.value : '',
                            10,
                        ),
                        totalAmount_2 = Number(
                            payRedPacketAmountInput ? payRedPacketAmountInput.value : '',
                        ),
                        description_2 =
                            String(
                                payRedPacketDescInput ? payRedPacketDescInput.value : '',
                            ).trim() || '恭喜发财';
                    if (!Number.isInteger(packetCount_2) || packetCount_2 <= 0) {
                        if (window.showToast) window.showToast('红包个数无效');
                        return;
                    }
                    if (!Number.isFinite(totalAmount_2) || totalAmount_2 <= 0) {
                        if (window.showToast) window.showToast('总金额无效');
                        return;
                    }
                    const allocations_2 = window.imChat.createRedPacketAllocations(
                        totalAmount_2,
                        packetCount_2,
                    );
                    if (allocations_2.length !== packetCount_2) {
                        if (window.showToast) window.showToast('红包金额需至少满足每包 0.01');
                        return;
                    }
                    const value_260_2292 = value_260(totalAmount_2, async (value_2293) => {
                        const success =
                            typeof window.addPayTransaction === 'function'
                                ? window.addPayTransaction(
                                      totalAmount_2,
                                      description_2 + ' · 群红包',
                                      'expense',
                                      value_2293,
                                  )
                                : false;
                        if (!success) {
                            if (window.showToast) window.showToast('红包发送失败');
                            return;
                        }
                        const groupRedPacketState = window.imChat.normalizeGroupRedPacketState(
                            {
                                id: window.imChat.createMessageId('packet'),
                                packetId: window.imChat.createMessageId('packet'),
                                role: 'user',
                                type: 'group_red_packet',
                                totalAmount: totalAmount_2,
                                packetCount: packetCount_2,
                                description: description_2,
                                allocations: allocations_2,
                                claimRecords: [],
                                claimedMemberIds: [],
                                content:
                                    '[群红包] ' +
                                    description_2 +
                                    ' ¥' +
                                    Number(totalAmount_2).toFixed(2),
                                timestamp: timestamp_10,
                            },
                            activeFriend_52,
                        );
                        window.imApp.captureGroupUserIdentity?.(
                            activeFriend_52,
                            groupRedPacketState,
                        );
                        const saved_16 = window.imApp.appendFriendMessage
                            ? await window.imApp.appendFriendMessage(
                                  activeFriend_52.id,
                                  groupRedPacketState,
                                  {
                                      silent: true,
                                  },
                              )
                            : await commitSheetFriendChange(
                                  activeFriend_52,
                                  (value_2296) => {
                                      if (!value_2296.messages) value_2296.messages = [];
                                      value_2296.messages.push(groupRedPacketState);
                                  },
                                  {
                                      silent: true,
                                  },
                              );
                        if (!saved_16) {
                            if (window.showToast) window.showToast('红包记录保存失败');
                            return;
                        }
                        closeSheet();
                        if (value_2281) {
                            const value_2297 = window.imChat.appendMessageToContainer
                                ? window.imChat.appendMessageToContainer(
                                      activeFriend_52,
                                      value_2281,
                                      groupRedPacketState,
                                      {
                                          scroll: true,
                                      },
                                  )
                                : false;
                            !value_2297 &&
                                window.imChat.rerenderChatContainer &&
                                window.imChat.rerenderChatContainer(activeFriend_52, value_2281, {
                                    scroll: true,
                                });
                        }
                    });
                    if (!value_260_2292) {
                        if (window.showToast) window.showToast('支付方式拉取失败');
                    }
                    return;
                }
                const amount_2 = Number(payAmountInput ? payAmountInput.value : ''),
                    description_3 = String(payDescInput ? payDescInput.value : '').trim() || '转账';
                if (!Number.isFinite(amount_2) || amount_2 <= 0) {
                    if (window.showToast) window.showToast('金额无效');
                    return;
                }
                let targetName_2 =
                    activeFriend_52.type === 'group'
                        ? activeFriend_52.nickname || '群聊'
                        : activeFriend_52.nickname || activeFriend_52.realName || '对方';
                const groupUserIdentity =
                        isGroupChat_3 && window.imApp?.getGroupUserIdentity
                            ? window.imApp.getGroupUserIdentity(activeFriend_52)
                            : null,
                    senderName_2 =
                        groupUserIdentity?.name ||
                        userState_2?.name ||
                        userState_2?.realName ||
                        userState_2?.nickname ||
                        'User';
                if (isGroupChat_3) {
                    const selectedMember = window.imChat
                        .getAvailableGroupRecipients(activeFriend_52)
                        .find((member_5) => String(member_5.id) === String(selectedRecipientId));
                    if (!selectedMember) {
                        if (window.showToast) window.showToast('请选择群成员');
                        return;
                    }
                    targetName_2 = selectedMember.nickname || selectedMember.realName || '群成员';
                }
                const value_260_2289 = value_260(amount_2, async (value_2300) => {
                    const success_2 =
                        typeof window.addPayTransaction === 'function'
                            ? window.addPayTransaction(
                                  amount_2,
                                  description_3 + ' · ' + targetName_2,
                                  'expense',
                                  value_2300,
                              )
                            : false;
                    if (!success_2) {
                        if (window.showToast) window.showToast('转账失败');
                        return;
                    }
                    const options_2302 = {
                        id: window.imChat.createMessageId('pay'),
                        role: 'user',
                        type: 'pay_transfer',
                        payKind: 'user_to_char',
                        payDirection: 'user_to_char',
                        amount: amount_2,
                        description: description_3,
                        payerName: senderName_2,
                        payeeName: targetName_2,
                        senderName: senderName_2,
                        receiverName: targetName_2,
                        targetName: targetName_2,
                        targetMemberId: isGroupChat_3 ? selectedRecipientId : null,
                        cardTitle: isGroupChat_3 ? '群转账' : 'Pay 转账',
                        payStatus: 'completed',
                        content: '[用户转账] ' + description_3 + ' ¥' + amount_2.toFixed(2),
                        timestamp: timestamp_10,
                    };
                    window.imApp.captureGroupUserIdentity?.(activeFriend_52, options_2302);
                    const saved_17 = window.imApp.appendFriendMessage
                        ? await window.imApp.appendFriendMessage(activeFriend_52.id, options_2302, {
                              silent: true,
                          })
                        : await commitSheetFriendChange(
                              activeFriend_52,
                              (value_2304) => {
                                  if (!value_2304.messages) value_2304.messages = [];
                                  value_2304.messages.push(options_2302);
                              },
                              {
                                  silent: true,
                              },
                          );
                    if (!saved_17) {
                        if (window.showToast) window.showToast('转账记录保存失败');
                        return;
                    }
                    closeSheet();
                    if (value_2281) {
                        const value_2305 = window.imChat.appendMessageToContainer
                            ? window.imChat.appendMessageToContainer(
                                  activeFriend_52,
                                  value_2281,
                                  options_2302,
                                  {
                                      scroll: true,
                                  },
                              )
                            : false;
                        !value_2305 &&
                            window.imChat.rerenderChatContainer &&
                            window.imChat.rerenderChatContainer(activeFriend_52, value_2281, {
                                scroll: true,
                            });
                    }
                });
                if (!value_260_2289) {
                    if (window.showToast) window.showToast('支付方式拉取失败');
                }
            };
        sheetOverlayElement.addEventListener('click', closeSheet);
        closeBtn.addEventListener('click', closeSheet);
        payEntry &&
            payEntry.addEventListener('click', () => {
                value_261();
            });
        linkEntry &&
            linkEntry.addEventListener('click', () => {
                closeSheet();
                if (window.imChat.openFakeLinkComposer) window.imChat.openFakeLinkComposer();
                else window.showToast && window.showToast('链接功能加载失败');
            });
        attachmentMoreContactEntryElement &&
            attachmentMoreContactEntryElement.addEventListener('click', handleClick_2);
        contactCardPickerCancelElement?.addEventListener('click', closeOfflineSummarySheet);
        contactCardPickerConfirmElement?.addEventListener('click', value_367);
        summarySheet?.addEventListener('click', (event_21) => {
            if (event_21.target === summarySheet) closeOfflineSummarySheet();
        });
        voiceEntry &&
            voiceEntry.addEventListener('click', () => {
                value_262();
            });
        listenEntry &&
            listenEntry.addEventListener('click', () => {
                const activeFriend_53 = window.imData.currentActiveFriend;
                if (!activeFriend_53 || activeFriend_53.type !== 'char') return;
                closeSheet();
                window.libraryApp?.openTogetherListeningPicker?.(activeFriend_53);
            });
        narrationEntry &&
            narrationEntry.addEventListener('click', () => {
                value_263();
            });
        attachmentMoreDynamicActionEntryElement &&
            attachmentMoreDynamicActionEntryElement.addEventListener('click', async () => {
                await value_253();
            });
        regenerateEntry &&
            regenerateEntry.addEventListener('click', () => {
                if (regenerateEntry.dataset.busy === 'true') return;
                const activeFriend_54 = window.imData.currentActiveFriend;
                if (!activeFriend_54 || !window.imChat.regenerateLastAiReply) {
                    if (window.showToast) window.showToast('暂无可重回的回复');
                    return;
                }
                openRegenerateForm();
            });
        payRecipientTrigger &&
            payRecipientTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const activeFriend_55 = window.imData.currentActiveFriend;
                if (!activeFriend_55 || activeFriend_55.type !== 'group') return;
                const hasOptions = payRecipientDropdown && payRecipientDropdown.children.length > 0;
                if (!hasOptions) return;
                const isOpen =
                    payRecipientDropdown && payRecipientDropdown.style.display === 'block';
                setRecipientDropdownOpen(!isOpen);
            });
        payModeTabs.length > 0 &&
            payModeTabs.forEach((tab_4) => {
                tab_4.addEventListener('click', () => {
                    const currentActiveFriend_2311 = window.imData.currentActiveFriend,
                        nextMode_2 = tab_4.getAttribute('data-pay-mode') || 'transfer';
                    setRecipientDropdownOpen(false);
                    syncPayModeUi(currentActiveFriend_2311, nextMode_2);
                    setTimeout(() => {
                        if (nextMode_2 === 'red_packet') {
                            if (payRedPacketCountInput) payRedPacketCountInput.focus();
                        } else payAmountInput && payAmountInput.focus();
                    }, 20);
                });
            });
        payFormOverlay &&
            payFormOverlay.addEventListener('click', (e_2) => {
                if (e_2.target === payFormOverlay) {
                    closePayTransferForm();
                    return;
                }
                payRecipientDropdown &&
                    payRecipientDropdown.style.display === 'block' &&
                    !e_2.target.closest('.pay-group-recipient-field') &&
                    setRecipientDropdownOpen(false);
            });
        voiceFormOverlay &&
            voiceFormOverlay.addEventListener('click', (event_2314) => {
                event_2314.target === voiceFormOverlay && closeSheet();
            });
        narrationFormOverlay &&
            narrationFormOverlay.addEventListener('click', (event_2315) => {
                event_2315.target === narrationFormOverlay && closeSheet();
            });
        regenerateFormOverlay &&
            regenerateFormOverlay.addEventListener('click', (event_2316) => {
                event_2316.target === regenerateFormOverlay && closeSheet();
            });
        voiceCancelBtn &&
            voiceCancelBtn.addEventListener('click', () => {
                closeSheet();
            });
        voiceSubmitBtn &&
            voiceSubmitBtn.addEventListener('click', async () => {
                await submitVoiceMessage();
            });
        narrationCancelBtn &&
            narrationCancelBtn.addEventListener('click', () => {
                closeSheet();
            });
        narrationSubmitBtn &&
            narrationSubmitBtn.addEventListener('click', async () => {
                await value_368();
            });
        regenerateReferenceBtn &&
            regenerateReferenceBtn.addEventListener('click', async () => {
                await submitRegenerateRequest(true);
            });
        regenerateDirectBtn &&
            regenerateDirectBtn.addEventListener('click', async () => {
                await submitRegenerateRequest(false);
            });
        attachmentMoreOfflineEntryElement &&
            attachmentMoreOfflineEntryElement.addEventListener('click', () => {
                value_328();
            });
        const chatCloseBtn = document.getElementById('offline-chat-close-btn');
        chatCloseBtn &&
            chatCloseBtn.addEventListener('click', () => {
                const offlineChatViewElement_2317 = document.getElementById('offline-chat-view');
                offlineChatViewElement_2317 &&
                    (offlineChatViewElement_2317.classList.remove('active'),
                    setTimeout(() => {
                        offlineChatViewElement_2317.style.display = 'none';
                    }, 300));
            });
        const chatSettingsBtn = document.getElementById('offline-chat-settings-btn');
        chatSettingsBtn &&
            chatSettingsBtn.addEventListener('click', () => {
                renderOfflineChatSettings();
                window.openView(document.getElementById('offline-chat-settings-sheet'));
            });
        const chatSettingsBackBtn = document.getElementById('offline-chat-settings-back-btn');
        chatSettingsBackBtn &&
            chatSettingsBackBtn.addEventListener('click', () => {
                window.closeView(document.getElementById('offline-chat-settings-sheet'));
            });
        voiceTranscriptInput &&
            voiceTranscriptInput.addEventListener('keydown', (event_2318) => {
                if (event_2318.isComposing || event_2318.keyCode === 229) return;
                (event_2318.ctrlKey || event_2318.metaKey) &&
                    (event_2318.key === 'Enter' || event_2318.keyCode === 13) &&
                    (event_2318.preventDefault(), submitVoiceMessage());
            });
        narrationInput &&
            narrationInput.addEventListener('keydown', (event_2319) => {
                if (event_2319.isComposing || event_2319.keyCode === 229) return;
                (event_2319.ctrlKey || event_2319.metaKey) &&
                    (event_2319.key === 'Enter' || event_2319.keyCode === 13) &&
                    (event_2319.preventDefault(), value_368());
            });
        regenerateRequirementInput &&
            regenerateRequirementInput.addEventListener('keydown', (event_2320) => {
                if (event_2320.isComposing || event_2320.keyCode === 229) return;
                (event_2320.ctrlKey || event_2320.metaKey) &&
                    (event_2320.key === 'Enter' || event_2320.keyCode === 13) &&
                    (event_2320.preventDefault(), submitRegenerateRequest(true));
            });
        payCancelBtn &&
            payCancelBtn.addEventListener('click', () => {
                closePayTransferForm();
            });
        paySubmitBtn &&
            paySubmitBtn.addEventListener('click', async () => {
                await value_369();
            });
        payAmountInput &&
            payAmountInput.addEventListener('keydown', (e_3) => {
                if (e_3.isComposing || e_3.keyCode === 229) return;
                if (e_3.key === 'Enter' || e_3.keyCode === 13) {
                    e_3.preventDefault();
                    if (payDescInput) payDescInput.focus();
                }
            });
        payDescInput &&
            payDescInput.addEventListener('keydown', (event_2322) => {
                if (event_2322.isComposing || event_2322.keyCode === 229) return;
                (event_2322.key === 'Enter' || event_2322.keyCode === 13) &&
                    (event_2322.preventDefault(), value_369());
            });
        const getAttachmentTargetFriend = () => {
            const friendId_4 = attachmentSheet_2.dataset.friendId;
            if (friendId_4 != null && friendId_4 !== '') {
                const storedFriend =
                    window.imApp?.getFriendById?.(friendId_4) ||
                    (window.imData.friends || []).find(
                        (item_29) => String(item_29.id) === String(friendId_4),
                    );
                if (storedFriend) return storedFriend;
            }
            return window.imData.currentActiveFriend || null;
        };
        async function handleAction_371(
            imageGenerationPrompt_3,
            value_2326,
            referenceImage_3 = '',
            value_2328 = {},
            value_2329 = {},
        ) {
            const friendId_5 = value_2326?.id,
                runKey = String(friendId_5 ?? '');
            if (!runKey) return (window.showToast?.('当前聊天状态已失效，请重新进入聊天'), false);
            if (window.imChat.isChatImageGenerationRunning?.(runKey))
                return (window.showToast?.('这段聊天已有图片正在生成'), false);
            window.showToast?.('正在生成图片…');
            try {
                const value_2332 = await window.imChat.generateChatImage(
                        imageGenerationPrompt_3,
                        value_2326,
                        {
                            referenceImage: referenceImage_3,
                            basePrompt: value_2328.basePrompt || value_2328.lastPrompt || '',
                            charAppearance: value_2328.charAppearance || '',
                            userAppearance: value_2328.userAppearance || '',
                            artistPrompt: value_2328.artistPrompt || '',
                            negativePrompt: value_2328.negativePrompt || '',
                            includeCharAppearance: value_2329.charPresent !== false,
                            includeUserAppearance: value_2329.userPresent !== false,
                        },
                    ),
                    sent = await window.imChat.sendImageMessage(
                        value_2332.imageUrl,
                        imageGenerationPrompt_3,
                        {
                            role: 'assistant',
                            imageSource: 'generated',
                            imageProvider: value_2332.provider,
                            imageModel: value_2332.model,
                            imageSize: value_2332.size,
                            faceReferenceUsed: value_2332.faceReferenceUsed,
                            imageGenerationPrompt: imageGenerationPrompt_3,
                            imageGenerationConfig: {
                                basePrompt: value_2328.basePrompt || value_2328.lastPrompt || '',
                                charAppearance: value_2328.charAppearance || '',
                                userAppearance: value_2328.userAppearance || '',
                                artistPrompt: value_2328.artistPrompt || '',
                                negativePrompt: value_2328.negativePrompt || '',
                                includeCharAppearance: value_2329.charPresent !== false,
                                includeUserAppearance: value_2329.userPresent !== false,
                                useReferenceFace: !!referenceImage_3,
                            },
                            imageGenerationCompiledPrompt: value_2332.compiledPrompt || '',
                            senderName: value_2326.nickname || value_2326.realName || 'Char',
                            senderAvatarUrl: value_2326.avatarUrl || '',
                            senderAvatarAssetId: value_2326.avatarAssetId || '',
                            friendId: friendId_5,
                        },
                    );
                if (sent) window.showToast?.('图片已生成并发送');
                return sent;
            } catch (error_22) {
                console.error('Failed to generate chat image', error_22);
                if (
                    !window.u2Api?.isRequestError?.(error_22) ||
                    !window.u2Api.reportError(error_22, {
                        operation: '图片生成',
                    })
                )
                    window.showToast?.(error_22?.message || '图片生成失败，请稍后重试');
                return false;
            }
        }
        const albumImageEntry = attachmentSheet_2.querySelector('.album-image-entry');
        albumImageEntry?.addEventListener('click', () => {
            const targetFriend_19 = getAttachmentTargetFriend();
            closeSheet();
            if (!targetFriend_19) {
                if (window.showToast) window.showToast('当前聊天状态已失效，请重新进入聊天');
                return;
            }
            const value_2336 = window.imApp?.showCustomModal || window.showCustomModal;
            value_2336 &&
                value_2336({
                    type: 'prompt',
                    title: '相册图片',
                    message: '上传图片后可手动描述，或使用识图生成内容',
                    placeholder: '填写图片内容（供 AI 理解）',
                    multiline: true,
                    confirmText: '发送',
                    imageComposer: {
                        imageUrl: '',
                        fileName: '',
                        onUpload: async (file_4) => {
                            if (!/^image\//i.test(file_4?.type || ''))
                                throw new Error('请选择图片文件');
                            const imageUrl_3 = window.imApp?.compressImageFile
                                ? await window.imApp.compressImageFile(file_4, {
                                      maxWidth: 1600,
                                      maxHeight: 1600,
                                      mimeType: 'image/jpeg',
                                      quality: 0.82,
                                  })
                                : await window.imApp?.readFileAsDataUrl?.(file_4);
                            if (!imageUrl_3) throw new Error('图片处理失败');
                            return {
                                imageUrl: imageUrl_3,
                                fileName: file_4.name,
                            };
                        },
                        onRecognize: (value_2339) => identifyChatImage_2(value_2339),
                    },
                    onConfirm: (value_2340, modalState_2 = {}) => {
                        const description_4 = String(value_2340 || '').trim();
                        if (!description_4)
                            return (window.showToast?.('请填写图片内容或使用识图生成'), false);
                        const imageUrl_4 =
                            modalState_2.uploadedImage || getChatImagePlaceholderUrl();
                        return (
                            window.imChat.sendImageMessage(imageUrl_4, description_4, {
                                imageSource: modalState_2.uploadedImage ? 'real' : 'virtual',
                                fileName: modalState_2.uploadedFileName || '',
                                friendId: targetFriend_19.id,
                            }),
                            true
                        );
                    },
                });
        });
        const generatedImageEntry = attachmentSheet_2.querySelector('.generated-image-entry');
        return (
            generatedImageEntry?.addEventListener('click', async () => {
                const targetFriend_20 = getAttachmentTargetFriend();
                closeSheet();
                if (!targetFriend_20) {
                    window.showToast?.('当前聊天状态已失效，请重新进入聊天');
                    return;
                }
                if (targetFriend_20.type === 'group') {
                    window.showToast?.('请进入对应 Char 的单聊生成图片');
                    return;
                }
                const runKey_2 = String(targetFriend_20.id ?? '');
                if (window.imChat.isChatImageGenerationRunning?.(runKey_2)) {
                    window.showToast?.('这段聊天已有图片正在生成');
                    return;
                }
                const showModal = window.imApp?.showCustomModal || window.showCustomModal;
                if (!showModal) {
                    window.showToast?.('无法打开生图提示词窗口');
                    return;
                }
                const latestTargetFriend =
                        window.imApp?.getFriendById?.(targetFriend_20.id) || targetFriend_20,
                    faceAssetId = latestTargetFriend.imageFaceReferenceAssetId || '';
                let imageUrl_5 = '';
                if (latestTargetFriend.imageFaceReferenceUrl)
                    imageUrl_5 = latestTargetFriend.imageFaceReferenceUrl;
                else
                    faceAssetId &&
                        typeof window.appStorage?.getAssetUrl === 'function' &&
                        (imageUrl_5 = await window.appStorage
                            .getAssetUrl(faceAssetId)
                            ['catch'](() => ''));
                const supportsCharacterReference = latestTargetFriend.type !== 'group',
                    value_2351 = latestTargetFriend.imagePromptConfig || {},
                    buildPromptConfig = (modalState_3 = {}, previous = value_2351) => ({
                        ...(previous && typeof previous === 'object' ? previous : {}),
                        charAppearance: String(modalState_3.charAppearance || '').trim(),
                        userAppearance: String(modalState_3.userAppearance || '').trim(),
                        artistPrompt: String(modalState_3.artistPrompt || '').trim(),
                        negativePrompt: String(modalState_3.negativePrompt || '').trim(),
                        basePrompt: String(modalState_3.promptValue || '').trim(),
                        lastPrompt: String(modalState_3.promptValue || '').trim(),
                        activePresetId: String(modalState_3.activePresetId || '').trim(),
                        autoGenerate: modalState_3.autoGenerate === true,
                        autoUseReferenceFace: modalState_3.autoUseReferenceFace === true,
                        presets: Array.isArray(modalState_3.presets)
                            ? modalState_3.presets
                            : Array.isArray(previous?.presets)
                              ? previous.presets
                              : [],
                    });
                showModal({
                    type: 'prompt',
                    title: '生成图片',
                    message: '将自动根据当前聊天上下文生成画面',
                    placeholder: '基础正向提示词：持续应用的主体、场景或质量要求（选填）',
                    defaultValue: value_2351.basePrompt || value_2351.lastPrompt || '',
                    multiline: true,
                    confirmText: '开始生成',
                    confirmTone: 'dark',
                    generationPrompt: {
                        charAppearance: value_2351.charAppearance || '',
                        userAppearance: value_2351.userAppearance || '',
                        artistPrompt: value_2351.artistPrompt || '',
                        negativePrompt: value_2351.negativePrompt || '',
                        presets: Array.isArray(value_2351.presets) ? value_2351.presets : [],
                        activePresetId: value_2351.activePresetId || '',
                        autoGenerate: value_2351.autoGenerate === true,
                        autoUseReferenceFace: value_2351.autoUseReferenceFace === true,
                    },
                    referenceFace: supportsCharacterReference
                        ? {
                              title:
                                  (latestTargetFriend.nickname ||
                                      latestTargetFriend.realName ||
                                      '当前角色') + '的参考脸',
                              imageUrl: imageUrl_5,
                              fileName: latestTargetFriend.imageFaceReferenceFileName || '',
                              onUpload: async (file) => {
                                  if (!/^image\//i.test(file?.type || ''))
                                      throw new Error('请选择图片文件');
                                  if (
                                      !window.imApp?.compressImageFile ||
                                      !window.appStorage?.saveAssetFromDataUrl
                                  )
                                      throw new Error('图片存储服务不可用');
                                  const dataUrl = await window.imApp.compressImageFile(file, {
                                          maxWidth: 1536,
                                          maxHeight: 1536,
                                          quality: 0.9,
                                          mimeType: 'image/jpeg',
                                      }),
                                      assetId_2 =
                                          'im-face-reference-' +
                                          targetFriend_20.id +
                                          '-' +
                                          Date.now(),
                                      value_2356 =
                                          (
                                              window.imApp?.getFriendById?.(targetFriend_20.id) ||
                                              targetFriend_20
                                          ).imageFaceReferenceAssetId || '';
                                  await window.appStorage.saveAssetFromDataUrl(assetId_2, dataUrl, {
                                      ownerType: 'im_friend_face_reference',
                                      ownerId: String(targetFriend_20.id),
                                      fileName: file.name,
                                  });
                                  const imageUrl_6 = await window.appStorage.getAssetUrl(assetId_2),
                                      saved_18 = await commitSheetFriendChange(
                                          targetFriend_20,
                                          (friend_19) => {
                                              friend_19.imageFaceReferenceAssetId = assetId_2;
                                              friend_19.imageFaceReferenceUrl = null;
                                              friend_19.imageFaceReferenceFileName = file.name;
                                          },
                                          {
                                              metaOnly: true,
                                          },
                                      );
                                  if (!saved_18) {
                                      await window.appStorage
                                          .deleteAsset(assetId_2)
                                          ['catch'](() => undefined);
                                      throw new Error('参考脸保存失败，请重试');
                                  }
                                  return (
                                      value_2356 &&
                                          value_2356 !== assetId_2 &&
                                          (await window.appStorage
                                              .deleteAsset(value_2356)
                                              ['catch'](() => undefined)),
                                      window.showToast?.('已保存当前角色的参考脸'),
                                      {
                                          imageUrl: imageUrl_6,
                                          fileName: file.name,
                                      }
                                  );
                              },
                              onDelete: async () => {
                                  const value_2360 =
                                          (
                                              window.imApp?.getFriendById?.(targetFriend_20.id) ||
                                              targetFriend_20
                                          ).imageFaceReferenceAssetId || '',
                                      saved_19 = await commitSheetFriendChange(
                                          targetFriend_20,
                                          (friend_20) => {
                                              friend_20.imageFaceReferenceAssetId = null;
                                              friend_20.imageFaceReferenceUrl = null;
                                              friend_20.imageFaceReferenceFileName = '';
                                              friend_20.imagePromptConfig = {
                                                  ...(friend_20.imagePromptConfig || {}),
                                                  autoUseReferenceFace: false,
                                              };
                                          },
                                          {
                                              metaOnly: true,
                                          },
                                      );
                                  if (!saved_19) throw new Error('参考脸删除失败，请重试');
                                  value_2360 &&
                                      (await window.appStorage
                                          ?.deleteAsset?.(value_2360)
                                          ['catch'](() => undefined));
                                  window.showToast?.('已删除当前角色的参考脸');
                              },
                          }
                        : null,
                    onCancel: (modalState = {}) => {
                        const imagePromptConfig_2 = buildPromptConfig(modalState);
                        commitSheetFriendChange(
                            targetFriend_20,
                            (friend_21) => {
                                friend_21.imagePromptConfig = imagePromptConfig_2;
                            },
                            {
                                metaOnly: true,
                                silent: true,
                            },
                        );
                    },
                    onConfirm: (value_2364, modalState_4 = {}) => {
                        const promptValue_2 = String(value_2364 || '').trim(),
                            imagePromptConfig_3 = buildPromptConfig({
                                ...modalState_4,
                                promptValue: promptValue_2,
                            });
                        return (
                            (async () => {
                                try {
                                    const saved_20 = await commitSheetFriendChange(
                                        targetFriend_20,
                                        (friend_22) => {
                                            friend_22.imagePromptConfig = imagePromptConfig_3;
                                        },
                                        {
                                            metaOnly: true,
                                        },
                                    );
                                    if (!saved_20) {
                                        window.showToast?.('生图提示词保存失败，请重试');
                                        return;
                                    }
                                    window.showToast?.('正在根据聊天上下文整理画面…');
                                    const value_2369 = await handleAction_32(latestTargetFriend);
                                    await handleAction_371(
                                        value_2369.scenePrompt,
                                        targetFriend_20,
                                        modalState_4.toggleChecked
                                            ? modalState_4.referenceImage
                                            : '',
                                        imagePromptConfig_3,
                                        value_2369,
                                    );
                                } catch (error_23) {
                                    console.error(
                                        'Failed to prepare contextual chat image prompt',
                                        error_23,
                                    );
                                    window.showToast?.(
                                        error_23?.message || '根据聊天上下文生成画面失败',
                                    );
                                }
                            })(),
                            true
                        );
                    },
                    onSavePreset: async ({
                        presets: presets_7,
                        activePresetId: activePresetId_3,
                        preset: preset_11,
                    }) => {
                        const imagePromptConfig_4 = {
                                ...value_2351,
                                charAppearance: preset_11.charAppearance,
                                userAppearance: preset_11.userAppearance,
                                artistPrompt: preset_11.artistPrompt,
                                negativePrompt: preset_11.negativePrompt,
                                basePrompt: preset_11.basePrompt || preset_11.prompt,
                                lastPrompt: preset_11.basePrompt || preset_11.prompt,
                                presets: presets_7,
                                activePresetId: activePresetId_3,
                            },
                            saved_21 = await commitSheetFriendChange(
                                targetFriend_20,
                                (friend_23) => {
                                    friend_23.imagePromptConfig = imagePromptConfig_4;
                                },
                                {
                                    metaOnly: true,
                                    silent: true,
                                },
                            );
                        if (!saved_21) throw new Error('提示词预设保存失败，请重试');
                    },
                });
            }),
            attachmentSheet_2
                .querySelector('.location-open-composer-btn')
                ?.addEventListener('click', value_178),
            (window.imChat.renderLinkedAccountsPanel = renderLinkedAccountsPanel_2),
            (window.imChat.stopLinkedAccountTimer = stopLinkedAccountTimer_2),
            (window.imChat.scheduleAttachmentSheetOpenAnimation =
                scheduleAttachmentSheetOpenAnimation_2),
            attachmentSheet_2
        );
    }
    async function sendContactCard_2(value_2378, options_12 = {}) {
        const friendId_6 = options_12.friendId ?? window.imData.currentActiveFriend?.id,
            activeFriend_56 =
                friendId_6 != null
                    ? window.imApp?.getFriendById?.(friendId_6) ||
                      (window.imData.friends || []).find(
                          (item_30) => String(item_30.id) === String(friendId_6),
                      )
                    : null;
        if (!activeFriend_56 || activeFriend_56.type !== 'char') return false;
        const trim_2382 = String(value_2378 || '').trim(),
            value_2383 = options_12.generatedProfile != null;
        if (value_2383 && trim_2382) return false;
        const contact_2384 = value_2383
            ? window.imApp.normalizeGeneratedContactProfile?.(options_12.generatedProfile, {
                  strict: true,
              })
            : null;
        if (value_2383 && !contact_2384) return false;
        const contact_2385 = value_2383
            ? null
            : (window.imData.friends || []).find(
                  (value_2398) =>
                      value_2398 &&
                      (value_2398.type === 'char' || value_2398.type === 'npc') &&
                      String(value_2398.id) === trim_2382 &&
                      String(value_2398.id) !== String(activeFriend_56.id),
              );
        if (!contact_2385 && !contact_2384) return false;
        if (contact_2384 && options_12.role !== 'assistant') return false;
        if (options_12.requireRelationship === true) {
            const value_2399 = Array.isArray(activeFriend_56.memory?.relationships)
                    ? activeFriend_56.memory.relationships
                    : [],
                value_2400 =
                    contact_2385 &&
                    value_2399.some(
                        (value_2401) =>
                            String(value_2401?.targetId ?? value_2401?.npcId ?? '') ===
                            String(contact_2385.id),
                    );
            if (!value_2400) return false;
        }
        const role_7 = options_12.role === 'assistant' ? 'assistant' : 'user',
            contactId_3 = contact_2384
                ? (() => {
                      let text_2402 = '';
                      do {
                          const value_2403 =
                              globalThis.crypto?.randomUUID?.() ||
                              Date.now() + '-' + Math.random().toString(36).slice(2, 10);
                          text_2402 = 'generated-char-' + value_2403;
                      } while (
                          (window.imData.friends || []).some(
                              (value_2404) => String(value_2404.id) === text_2402,
                          ) ||
                          (window.imData.friendRequests || []).some(
                              (value_2405) => String(value_2405.contactId) === text_2402,
                          )
                      );
                      return text_2402;
                  })()
                : String(contact_2385.id),
            contactName_2 = String(
                contact_2384?.nickname ||
                    contact_2385?.nickname ||
                    contact_2385?.realName ||
                    '未命名人物',
            )
                .trim()
                .slice(0, 200),
            contactType_2 = contact_2384 ? 'char' : contact_2385.type === 'npc' ? 'npc' : 'char',
            value_2390 = !contact_2384
                ? (Array.isArray(activeFriend_56.memory?.relationships)
                      ? activeFriend_56.memory.relationships
                      : []
                  ).find(
                      (value_2406) =>
                          String(value_2406?.targetId ?? value_2406?.npcId ?? '') ===
                          String(contact_2385.id),
                  )
                : null,
            value_2391 =
                '[名片] ' +
                contactName_2 +
                '（' +
                (contactType_2 === 'npc' ? 'NPC' : 'Char') +
                '）',
            baseNotice_4 = {
                id: window.imChat.createMessageId('contact-card'),
                role: role_7,
                type: 'contact_card',
                contactId: contactId_3,
                contactType: contactType_2,
                contactName: contactName_2,
                contactRealName: String(contact_2384?.realName || contact_2385?.realName || '')
                    .trim()
                    .slice(0, 200),
                contactAvatarUrl: String(
                    contact_2384?.avatarUrl || contact_2385?.avatarUrl || '',
                ).trim(),
                contactAvatarAssetId: String(
                    contact_2384?.avatarAssetId || contact_2385?.avatarAssetId || '',
                ).trim(),
                contactSignature: String(
                    contact_2384?.signature ||
                        contact_2385?.signature ||
                        contact_2385?.persona ||
                        '',
                )
                    .trim()
                    .slice(0, 1000),
                contactPersona: String(contact_2384?.persona || contact_2385?.persona || '')
                    .trim()
                    .slice(0, 8000),
                contactReferrerRelation: String(
                    contact_2384?.referrerRelation || value_2390?.relation || '',
                )
                    .trim()
                    .slice(0, 200),
                contactSource: contact_2384 ? 'generated' : 'existing',
                contactReferrerId: role_7 === 'assistant' ? String(activeFriend_56.id) : '',
                contactActionStatus: 'idle',
                contactRequestId: '',
                content: value_2391,
                text: value_2391,
                timestamp: Date.now(),
            };
        if (options_12.apiRunId) baseNotice_4.apiRunId = String(options_12.apiRunId);
        role_7 === 'user' &&
            activeFriend_56.blockState?.charBlocksUser === true &&
            ((baseNotice_4.deliveryStatus = 'blocked'),
            (baseNotice_4.excludedFromContext = true),
            (baseNotice_4.blockedDirection = 'char_blocks_user'));
        const value_2393 = window.imApp.appendFriendMessage
            ? await window.imApp.appendFriendMessage(activeFriend_56.id, baseNotice_4, {
                  silent: true,
              })
            : await commitSheetFriendChange(
                  activeFriend_56,
                  (targetFriend_21) => {
                      if (!Array.isArray(targetFriend_21.messages)) targetFriend_21.messages = [];
                      targetFriend_21.messages.push(baseNotice_4);
                  },
                  {
                      silent: true,
                  },
              );
        if (!value_2393) return false;
        const value_2394 =
                window.imApp?.getFriendById?.(activeFriend_56.id) ||
                (window.imData.friends || []).find(
                    (item_31) => String(item_31.id) === String(activeFriend_56.id),
                ) ||
                activeFriend_56,
            elementById_2395 = document.getElementById('chat-interface-' + activeFriend_56.id),
            value_2396 = elementById_2395?.querySelector('.ins-chat-messages') || null;
        if (value_2396) {
            const value_2409 = window.imChat.appendMessageToContainer
                ? window.imChat.appendMessageToContainer(value_2394, value_2396, baseNotice_4, {
                      scroll: true,
                  })
                : false;
            !value_2409 &&
                window.imChat.rerenderChatContainer &&
                window.imChat.rerenderChatContainer(value_2394, value_2396, {
                    scroll: true,
                });
        }
        return true;
    }
    async function sendImageMessage_2(content_24, description_5, options_13 = {}) {
        const friendId_7 = options_13.friendId ?? window.imData.currentActiveFriend?.id,
            friend_24 =
                friendId_7 != null
                    ? window.imApp?.getFriendById?.(friendId_7) ||
                      (window.imData.friends || []).find(
                          (item_32) => String(item_32.id) === String(friendId_7),
                      )
                    : null;
        if (!friend_24) {
            if (window.showToast) window.showToast('未找到当前聊天对象，图片发送失败');
            return false;
        }
        const value_2415 = 'chat-interface-' + friend_24.id,
            page_3 = document.getElementById(value_2415);
        if (!page_3) {
            if (window.showToast) window.showToast('聊天页面已关闭，图片发送失败');
            return false;
        }
        const insChatMessagesElement = page_3.querySelector('.ins-chat-messages'),
            timestamp_6 = Date.now(),
            msgObj = {
                id: window.imChat.createMessageId('img'),
                role: options_13.role === 'assistant' ? 'assistant' : 'user',
                type: 'image',
                content: content_24,
                text: description_5,
                description: description_5,
                imageSource: options_13.imageSource || 'unknown',
                imageProvider: options_13.imageProvider || '',
                imageModel: options_13.imageModel || '',
                imageSize: options_13.imageSize || '',
                faceReferenceUsed: !!options_13.faceReferenceUsed,
                imageGenerationPrompt: options_13.imageGenerationPrompt || '',
                imageGenerationConfig: options_13.imageGenerationConfig || null,
                fileName: options_13.fileName || '',
                senderName: options_13.senderName || '',
                senderAvatarUrl: options_13.senderAvatarUrl || '',
                senderAvatarAssetId: options_13.senderAvatarAssetId || '',
                timestamp: timestamp_6,
            };
        window.imApp.captureGroupUserIdentity?.(friend_24, msgObj);
        const saved_22 = window.imApp.appendFriendMessage
            ? await window.imApp.appendFriendMessage(friend_24.id, msgObj, {
                  silent: true,
              })
            : await commitSheetFriendChange(
                  friend_24,
                  (value_2421) => {
                      if (!value_2421.messages) value_2421.messages = [];
                      value_2421.messages.push(msgObj);
                  },
                  {
                      silent: true,
                  },
              );
        if (!saved_22) {
            if (window.showToast) window.showToast('图片消息保存失败');
            return false;
        }
        if (insChatMessagesElement) {
            const value_2422 = window.imChat.appendMessageToContainer
                ? window.imChat.appendMessageToContainer(
                      friend_24,
                      insChatMessagesElement,
                      msgObj,
                      {
                          scroll: true,
                      },
                  )
                : false;
            !value_2422 &&
                window.imChat.rerenderChatContainer &&
                window.imChat.rerenderChatContainer(friend_24, insChatMessagesElement, {
                    scroll: true,
                });
        }
        return true;
    }
    async function sendLocationMessage_2(value_2423, value_2424 = '', options_14 = {}) {
        const friendId_8 = options_14.friendId ?? window.imData.currentActiveFriend?.id,
            friend_25 =
                friendId_8 != null
                    ? window.imApp?.getFriendById?.(friendId_8) ||
                      (window.imData.friends || []).find(
                          (item_33) => String(item_33.id) === String(friendId_8),
                      )
                    : null;
        if (!friend_25 || friend_25.type !== 'char')
            return (window.showToast?.('定位仅支持 Char 单聊'), false);
        const locationName_2 = String(value_2423 || '')
                .trim()
                .slice(0, 80),
            locationAddress_2 = String(value_2424 || '')
                .trim()
                .slice(0, 160);
        if (!locationName_2) return (window.showToast?.('请填写地点名'), false);
        const elementById_2430 = document.getElementById('chat-interface-' + friend_25.id);
        if (!elementById_2430) return (window.showToast?.('聊天页面已关闭，定位发送失败'), false);
        const value_2431 =
                '[位置] ' + locationName_2 + (locationAddress_2 ? ' — ' + locationAddress_2 : ''),
            options_2432 = {
                id: window.imChat.createMessageId('location'),
                role: options_14.role === 'assistant' ? 'assistant' : 'user',
                type: 'location',
                locationName: locationName_2,
                locationAddress: locationAddress_2,
                content: value_2431,
                text: value_2431,
                timestamp: Date.now(),
            },
            value_2433 = window.imApp.appendFriendMessage
                ? await window.imApp.appendFriendMessage(friend_25.id, options_2432, {
                      silent: true,
                  })
                : await commitSheetFriendChange(
                      friend_25,
                      (value_2436) => {
                          if (!value_2436.messages) value_2436.messages = [];
                          value_2436.messages.push(options_2432);
                      },
                      {
                          silent: true,
                      },
                  );
        if (!value_2433) return (window.showToast?.('定位消息保存失败'), false);
        const insChatMessagesElement_2434 = elementById_2430.querySelector('.ins-chat-messages');
        if (insChatMessagesElement_2434) {
            const value_2437 = window.imChat.appendMessageToContainer
                ? window.imChat.appendMessageToContainer(
                      friend_25,
                      insChatMessagesElement_2434,
                      options_2432,
                      {
                          scroll: true,
                      },
                  )
                : false;
            if (!value_2437)
                window.imChat.rerenderChatContainer?.(friend_25, insChatMessagesElement_2434, {
                    scroll: true,
                });
        }
        return true;
    }
    async function sendStickerMessage_2(value_2438) {
        if (!window.imData.currentActiveFriend) return;
        const currentActiveFriend_2439 = window.imData.currentActiveFriend,
            value_2440 = 'chat-interface-' + currentActiveFriend_2439.id,
            elementById_2441 = document.getElementById(value_2440);
        if (!elementById_2441) return;
        const insChatMessagesElement_2442 = elementById_2441.querySelector('.ins-chat-messages'),
            safeSticker = value_2438 || {},
            stickerUrl_2 = String(safeSticker.url || safeSticker.stickerUrl || '').trim(),
            stickerName_2 =
                String(safeSticker.name || safeSticker.stickerName || 'Sticker').trim() ||
                'Sticker',
            stickerCategory_2 = String(
                safeSticker.category || safeSticker.stickerCategory || '',
            ).trim();
        if (!stickerUrl_2) return;
        const timestamp_7 = Date.now(),
            text_12 = stickerCategory_2
                ? '用户发了一个表情包：' + stickerCategory_2 + ' / ' + stickerName_2
                : '用户发了一个表情包：' + stickerName_2,
            msgObj_2 = {
                id: window.imChat.createMessageId('sticker'),
                role: 'user',
                type: 'sticker',
                content: '[表情包]',
                text: text_12,
                stickerCategory: stickerCategory_2,
                stickerName: stickerName_2,
                stickerUrl: stickerUrl_2,
                timestamp: timestamp_7,
            };
        window.imApp.captureGroupUserIdentity?.(currentActiveFriend_2439, msgObj_2);
        const saved_23 = window.imApp.appendFriendMessage
            ? await window.imApp.appendFriendMessage(currentActiveFriend_2439.id, msgObj_2, {
                  silent: true,
              })
            : await commitSheetFriendChange(
                  currentActiveFriend_2439,
                  (value_2451) => {
                      if (!value_2451.messages) value_2451.messages = [];
                      value_2451.messages.push(msgObj_2);
                  },
                  {
                      silent: true,
                  },
              );
        if (!saved_23) {
            if (window.showToast) window.showToast('表情包消息保存失败');
            return;
        }
        if (insChatMessagesElement_2442) {
            const value_2452 = window.imChat.appendMessageToContainer
                ? window.imChat.appendMessageToContainer(
                      currentActiveFriend_2439,
                      insChatMessagesElement_2442,
                      msgObj_2,
                      {
                          scroll: true,
                      },
                  )
                : false;
            !value_2452 &&
                window.imChat.rerenderChatContainer &&
                window.imChat.rerenderChatContainer(
                    currentActiveFriend_2439,
                    insChatMessagesElement_2442,
                    {
                        scroll: true,
                    },
                );
        }
    }
    async function sendVoiceMessage_2(value_2453) {
        if (!window.imData.currentActiveFriend) return;
        const currentActiveFriend_2454 = window.imData.currentActiveFriend,
            value_2455 = 'chat-interface-' + currentActiveFriend_2454.id,
            elementById_2456 = document.getElementById(value_2455);
        if (!elementById_2456) return;
        const insChatMessagesElement_2457 = elementById_2456.querySelector('.ins-chat-messages'),
            safeTranscript = String(value_2453 || '').trim();
        if (!safeTranscript) return;
        const timestamp_8 = Date.now(),
            duration_2 = Math.min(18, Math.max(3, Math.ceil(safeTranscript.length / 3))),
            msgObj_3 = {
                id: window.imChat.createMessageId('voice'),
                role: 'user',
                type: 'voice_message',
                content: '[语音消息]',
                text: safeTranscript,
                transcript: safeTranscript,
                duration: duration_2,
                timestamp: timestamp_8,
            };
        window.imApp.captureGroupUserIdentity?.(currentActiveFriend_2454, msgObj_3);
        const saved_24 = window.imApp.appendFriendMessage
            ? await window.imApp.appendFriendMessage(currentActiveFriend_2454.id, msgObj_3, {
                  silent: true,
              })
            : await commitSheetFriendChange(
                  currentActiveFriend_2454,
                  (value_2463) => {
                      if (!value_2463.messages) value_2463.messages = [];
                      value_2463.messages.push(msgObj_3);
                  },
                  {
                      silent: true,
                  },
              );
        if (!saved_24) {
            if (window.showToast) window.showToast('语音消息保存失败');
            return;
        }
        if (insChatMessagesElement_2457) {
            const value_2464 = window.imChat.appendMessageToContainer
                ? window.imChat.appendMessageToContainer(
                      currentActiveFriend_2454,
                      insChatMessagesElement_2457,
                      msgObj_3,
                      {
                          scroll: true,
                      },
                  )
                : false;
            !value_2464 &&
                window.imChat.rerenderChatContainer &&
                window.imChat.rerenderChatContainer(
                    currentActiveFriend_2454,
                    insChatMessagesElement_2457,
                    {
                        scroll: true,
                    },
                );
        }
    }
    function openAttachmentSheet_2() {
        const activeFriend_57 = window.imData.currentActiveFriend;
        if (!activeFriend_57) return;
        const value_2466 = 'chat-interface-' + activeFriend_57.id,
            page_4 = document.getElementById(value_2466);
        if (!page_4) return;
        const sheet_2 = window.imChat.createAttachmentSheet(page_4);
        sheet_2.dataset.friendId = String(activeFriend_57.id);
        const sheetTabItemDataTabLocationElement = sheet_2.querySelector(
                '.sheet-tab-item[data-tab="location"]',
            ),
            value_2469 = activeFriend_57.type !== 'char';
        if (sheetTabItemDataTabLocationElement)
            sheetTabItemDataTabLocationElement.style.display = value_2469 ? 'none' : 'flex';
        const attachmentMoreContactEntryElement_2470 = sheet_2.querySelector(
            '.attachment-more-contact-entry',
        );
        if (attachmentMoreContactEntryElement_2470)
            attachmentMoreContactEntryElement_2470.style.display =
                activeFriend_57.type === 'char' ? 'flex' : 'none';
        value_2469 &&
            sheetTabItemDataTabLocationElement?.classList.contains('active') &&
            sheet_2.querySelector('.sheet-tab-item[data-tab="gallery"]')?.click();
        const insChatInputContainerElement_2471 = page_4.querySelector('.ins-chat-input-container');
        sheet_2.style.display = 'flex';
        const overlay = sheet_2.querySelector('.sheet-overlay'),
            content_25 = sheet_2.querySelector('.sheet-content');
        if (window.imChat.syncOfflineMeetEntry) window.imChat.syncOfflineMeetEntry();
        const sheetTabItemActiveElement_2474 = sheet_2.querySelector('.sheet-tab-item.active');
        if (
            sheetTabItemActiveElement_2474 &&
            sheetTabItemActiveElement_2474.getAttribute('data-tab') === 'file' &&
            typeof window.imChat.renderLinkedAccountsPanel === 'function'
        )
            window.imChat.renderLinkedAccountsPanel({
                ifUnchanged: true,
            });
        else
            typeof window.imChat.stopLinkedAccountTimer === 'function' &&
                window.imChat.stopLinkedAccountTimer();
        if (window.imChat.scheduleAttachmentSheetOpenAnimation)
            window.imChat.scheduleAttachmentSheetOpenAnimation();
        else {
            const render_8 = () => {
                if (sheet_2.style.display !== 'flex') return;
                if (overlay) overlay.style.opacity = '1';
                if (content_25) content_25.style.transform = 'translateY(0)';
            };
            if (typeof window.requestAnimationFrame === 'function')
                window.requestAnimationFrame(render_8);
            else setTimeout(render_8, 0);
        }
    }
    function showBannerNotification_2(friend_26, messageText) {
        !window.imApp?.isChatConversationOpen?.() &&
            window.showBannerNotification &&
            window.showBannerNotification(friend_26, messageText);
    }
    function hideBannerNotification_2(clearQueue = false) {
        window.hideBannerNotification && window.hideBannerNotification(clearQueue);
    }
    window.imChat.createAttachmentSheet = createAttachmentSheet_2;
    window.imChat.syncOfflineMeetEntry = function () {
        const sheet_3 = window.imData.attachmentSheet;
        if (!sheet_3) return;
        const attachmentMoreOfflineEntryElement_2480 = sheet_3.querySelector(
                '.attachment-more-offline-entry',
            ),
            attachmentMoreOfflineLabelElement_2481 = sheet_3.querySelector(
                '.attachment-more-offline-label',
            ),
            attachmentMoreDynamicActionEntryElement_2482 = sheet_3.querySelector(
                '.attachment-more-dynamic-action-entry',
            ),
            attachmentMoreDynamicActionLabelElement_2483 = sheet_3.querySelector(
                '.attachment-more-dynamic-action-label',
            ),
            listenEntry_2 = sheet_3.querySelector('.attachment-more-listen-entry'),
            listenLabel = sheet_3.querySelector('.attachment-more-listen-label'),
            activeFriend_58 = window.imData.currentActiveFriend,
            isOffline_4 = !!window.imData.currentActiveFriend?.offlineMeetEnabled,
            isDynamicActionEnabled =
                !!window.imData.currentActiveFriend?.dynamicActionNarrationEnabled,
            canListenTogether = activeFriend_58?.type === 'char',
            isListeningTogether =
                canListenTogether &&
                !!window.libraryApp?.getTogetherListeningSnapshot?.(activeFriend_58.id);
        if (attachmentMoreOfflineLabelElement_2481)
            attachmentMoreOfflineLabelElement_2481.textContent = isOffline_4 ? '退出线下' : '线下';
        if (attachmentMoreOfflineEntryElement_2480)
            attachmentMoreOfflineEntryElement_2480.classList.toggle('active', isOffline_4);
        if (attachmentMoreDynamicActionLabelElement_2483)
            attachmentMoreDynamicActionLabelElement_2483.textContent = isDynamicActionEnabled
                ? '关闭'
                : '动描';
        if (attachmentMoreDynamicActionEntryElement_2482)
            attachmentMoreDynamicActionEntryElement_2482.classList.toggle(
                'active',
                isDynamicActionEnabled,
            );
        listenEntry_2 &&
            ((listenEntry_2.style.display = canListenTogether ? 'flex' : 'none'),
            listenEntry_2.classList.toggle('active', isListeningTogether));
        if (listenLabel) listenLabel.textContent = isListeningTogether ? '退出一起听' : '一起听';
    };
    window.imChat.identifyChatImage = identifyChatImage_2;
    window.imChat.sendContactCard = sendContactCard_2;
    window.imChat.sendImageMessage = sendImageMessage_2;
    window.imChat.sendLocationMessage = sendLocationMessage_2;
    window.imChat.sendStickerMessage = sendStickerMessage_2;
    window.imChat.sendVoiceMessage = sendVoiceMessage_2;
    window.imChat.openAttachmentSheet = openAttachmentSheet_2;
    window.imChat.showBannerNotification = showBannerNotification_2;
    window.imChat.hideBannerNotification = hideBannerNotification_2;
});
