(
    window.u2OnStorageReady ||
    ((callback) => document.addEventListener('DOMContentLoaded', callback))
)(() => {
    const { apiConfig: apiConfig_2, userState: userState_2 } = window;
    window.imChat = window.imChat || {};
    const imChat_2 = window.imChat;
    imChat_2.CHAT_IMAGE_PLACEHOLDER_URL = 'assets/imessage/chat-image-placeholder-512.jpg';
    const imageGenerationRuns = new Set();
    function createMessageId_2(value_8 = 'msg') {
        return value_8 + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    }
    function ensureMessageId_2(msg, prefix = 'msg') {
        if (!msg || typeof msg !== 'object') return '';
        if (!msg.id) msg.id = window.imChat.createMessageId(prefix);
        return msg.id;
    }
    async function resolveAutoImageReferenceFace_2(friend) {
        if (!friend || friend.type === 'group') return '';
        const assetId = String(friend.imageFaceReferenceAssetId || '').trim();
        if (assetId && typeof window.appStorage?.getAssetUrl === 'function') {
            const value_13 = await window.appStorage.getAssetUrl(assetId)['catch'](() => '');
            if (value_13) return value_13;
        }
        const directUrl = String(friend.imageFaceReferenceUrl || '').trim();
        if (directUrl) return directUrl;
        if (assetId) throw new Error('Char 参考脸不可用，请重新上传后重试');
        return '';
    }
    function apk110New_8() {
        const apk110New_21 = window.appStorage?.readDomain?.('settings', {}) || {},
            apk110New_22 = apk110New_21.imessageUserFaceReference || {};
        return {
            assetId: String(apk110New_22.assetId || '').trim(),
            fileName: String(apk110New_22.fileName || ''),
        };
    }
    async function generateChatImage_2() {
        const apk110New_23 = apk110New_8();
        if (!apk110New_23.assetId) return '';
        const apk110New_24 =
            typeof window.appStorage?.getAssetUrl === 'function'
                ? await window.appStorage.getAssetUrl(apk110New_23.assetId)['catch'](() => '')
                : '';
        if (!apk110New_24) throw new Error('User 参考脸不可用，请重新上传后重试');
        return apk110New_24;
    }
    async function apk110New_10(apk110New_25, apk110New_26 = {}, apk110New_27 = {}) {
        const apk110New_28 = [];
        if (apk110New_26.charPresent === true) {
            const apk110New_29 = await resolveAutoImageReferenceFace_2(apk110New_25);
            if (apk110New_29)
                apk110New_28.push({
                    role: 'char',
                    imageUrl: apk110New_29,
                });
            else {
                if (apk110New_27.requireChar)
                    throw new Error('原图片使用的 Char 参考脸已删除，请重新上传后重试');
            }
        }
        if (apk110New_26.userPresent === true) {
            const apk110New_30 = await generateChatImage_2();
            if (apk110New_30)
                apk110New_28.push({
                    role: 'user',
                    imageUrl: apk110New_30,
                });
            else {
                if (apk110New_27.requireUser)
                    throw new Error('原图片使用的 User 参考脸已删除，请重新上传后重试');
            }
        }
        return apk110New_28;
    }
    function apk110New_11(apk110New_31) {
        const apk110New_32 =
            apk110New_31?.choices?.[0]?.message?.content ??
            apk110New_31?.output_text ??
            apk110New_31?.output?.[0]?.content ??
            '';
        if (Array.isArray(apk110New_32))
            return apk110New_32.map((apk110New_33) => apk110New_33?.text || '').join('');
        return String(apk110New_32 || '');
    }
    async function apk110New_12(apk110New_34, apk110New_35, apk110New_36 = {}) {
        const apk110New_37 = String(apk110New_35 || '')
            .trim()
            .slice(-12000);
        if (!apk110New_37) throw new Error('当前没有可用于生图的剧情');
        const apk110New_38 = window.getApiConfig?.() || window.apiConfig || {},
            apk110New_39 = window.u2Api?.resolveChatCompletionsEndpoint?.(
                apk110New_38.endpoint || '',
            );
        if (!apk110New_39 || !apk110New_38.apiKey || !apk110New_38.model)
            throw new Error('请先完成 API 配置，再生成英文剧情提示词');
        const apk110New_40 = apk110New_34?.nickname || apk110New_34?.realName || 'Char',
            apk110New_41 = window.getUserState?.() || window.userState || {},
            apk110New_42 = apk110New_41.name || 'User',
            apk110New_43 = new AbortController(),
            apk110New_44 = setTimeout(() => apk110New_43.abort(), 60000);
        try {
            const apk110New_45 = window.u2Api?.buildApiHeaders
                    ? window.u2Api.buildApiHeaders(apk110New_38, {
                          'X-U2-Silent-Errors': '1',
                      })
                    : {
                          'Content-Type': 'application/json',
                          Authorization: 'Bearer ' + apk110New_38.apiKey,
                          'X-U2-Silent-Errors': '1',
                      },
                apk110New_46 = await fetch(apk110New_39, {
                    method: 'POST',
                    headers: apk110New_45,
                    body: JSON.stringify({
                        model: apk110New_38.model,
                        temperature: 0.3,
                        messages: [
                            {
                                role: 'system',
                                content:
                                    'You prepare image prompts from chat stories. ' +
                                    (apk110New_36.fromChat
                                        ? 'Choose the most visually meaningful current moment from the recent conversation.'
                                        : 'Describe the same current moment as the source text.') +
                                    ' Return only one JSON object, without Markdown or extra fields: {"scenePrompt":"English visual scene prompt","charPresent":true,"userPresent":false}. Write scenePrompt in English. Include subject, action, setting, composition, lighting, and atmosphere. Do not include fixed character appearance, artist tags, quality tags, or negative prompts. charPresent and userPresent must indicate whether those people appear in this image, not merely whether they were mentioned elsewhere.',
                            },
                            {
                                role: 'user',
                                content:
                                    'Char: ' +
                                    apk110New_40 +
                                    `
User: ` +
                                    apk110New_42 +
                                    `
` +
                                    (apk110New_36.fromChat
                                        ? 'Recent conversation'
                                        : 'Current scene') +
                                    `:
` +
                                    apk110New_37,
                            },
                        ],
                    }),
                    signal: apk110New_43.signal,
                });
            if (!apk110New_46.ok) {
                const apk110New_52 = await window.u2Api?.readApiError?.(apk110New_46);
                throw (
                    window.u2Api?.createHttpError?.(
                        apk110New_46,
                        apk110New_52,
                        '英文剧情提示词生成失败',
                    ) || new Error('英文剧情提示词生成失败（HTTP ' + apk110New_46.status + '）')
                );
            }
            const apk110New_47 = apk110New_11(await apk110New_46.json())
                .replace(/^```(?:json)?\s*|\s*```$/gi, '')
                .trim();
            let apk110New_48;
            try {
                apk110New_48 = JSON.parse(apk110New_47);
            } catch (apk110New_53) {
                throw new Error('API 没有返回有效的剧情提示词');
            }
            const apk110New_49 = String(
                    apk110New_48?.scenePrompt || apk110New_48?.scene_prompt || '',
                )
                    .trim()
                    .slice(0, 12000),
                apk110New_50 = apk110New_48?.charPresent ?? apk110New_48?.char_present,
                apk110New_51 = apk110New_48?.userPresent ?? apk110New_48?.user_present;
            if (
                !apk110New_49 ||
                typeof apk110New_50 !== 'boolean' ||
                typeof apk110New_51 !== 'boolean'
            )
                throw new Error('API 没有返回完整的剧情提示词和人物信息');
            return {
                scenePrompt: apk110New_49,
                charPresent: apk110New_50,
                userPresent: apk110New_51,
            };
        } catch (apk110New_54) {
            if (apk110New_54?.name === 'AbortError')
                throw new Error('英文剧情提示词生成超时，请稍后重试');
            throw apk110New_54;
        } finally {
            clearTimeout(apk110New_44);
        }
    }
    window.imChat.createMessageId = createMessageId_2;
    window.imChat.ensureMessageId = ensureMessageId_2;
    window.imChat.resolveAutoImageReferenceFace = resolveAutoImageReferenceFace_2;
    window.imChat.getUserFaceReferenceSettings = apk110New_8;
    window.imChat.resolveImageReferenceFaces = apk110New_10;
    window.imChat.prepareEnglishImageScene = apk110New_12;
    async function apk110New_13(value_14, value_15, value_16 = {}) {
        const friendId = value_15?.id,
            runKey = String(friendId ?? '').trim();
        if (!runKey) throw new Error('当前聊天状态已失效，请重新进入聊天');
        if (imageGenerationRuns.has(runKey)) throw new Error('这段聊天已有图片正在生成');
        if (!window.u2ImageGeneration?.generate) throw new Error('生图功能尚未加载，请刷新后重试');
        imageGenerationRuns.add(runKey);
        try {
            return await window.u2ImageGeneration.generate(String(value_14 || '').trim(), {
                referenceImages:
                    value_16.referenceImages ||
                    (value_16.referenceImage
                        ? [
                              {
                                  role: 'char',
                                  imageUrl: value_16.referenceImage,
                              },
                          ]
                        : []),
                basePrompt: value_16.basePrompt || '',
                charAppearance: value_16.charAppearance || '',
                userAppearance: value_16.userAppearance || '',
                artistPrompt: value_16.artistPrompt || '',
                negativePrompt: value_16.negativePrompt || '',
                includeCharAppearance: value_16.includeCharAppearance !== false,
                includeUserAppearance: value_16.includeUserAppearance !== false,
            });
        } finally {
            imageGenerationRuns['delete'](runKey);
        }
    }
    imChat_2.generateChatImage = apk110New_13;
    imChat_2.isChatImageGenerationRunning = (friendOrId) =>
        imageGenerationRuns.has(
            String(friendOrId && typeof friendOrId === 'object' ? friendOrId.id : friendOrId),
        );
});
