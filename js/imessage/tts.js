(function () {
    const PROVIDER_IDS_2 = Object.freeze([
            'minimax',
            'openai',
            'openai-compatible',
            'elevenlabs',
            'azure',
            'google',
            'aws-polly',
            'volcengine',
            'dashscope',
            'tencent',
            'baidu',
            'xfyun',
        ]),
        PROVIDERS_2 = Object.freeze({
            minimax: {
                label: 'MiniMax',
                endpoint: 'https://api.minimax.chat',
                keyLabel: 'API Key',
                modelLabel: 'TTS 模型',
                fields: [
                    {
                        key: 'region',
                        label: '区域',
                        type: 'select',
                        options: [
                            ['cn', '国内版'],
                            ['intl', '海外版'],
                        ],
                    },
                    {
                        key: 'groupId',
                        label: 'Group ID',
                        placeholder: '旧版凭据可填写 Group ID',
                        optional: true,
                    },
                ],
            },
            openai: {
                label: 'OpenAI',
                endpoint: 'https://api.openai.com/v1',
                keyLabel: 'OpenAI API Key',
                modelLabel: 'TTS 模型',
                fields: [],
            },
            'openai-compatible': {
                label: 'OpenAI 兼容中转站',
                endpoint: '',
                keyLabel: '中转 API Key',
                modelLabel: 'TTS 模型',
                fields: [],
            },
            elevenlabs: {
                label: 'ElevenLabs',
                endpoint: 'https://api.elevenlabs.io/v1',
                keyLabel: 'ElevenLabs API Key',
                modelLabel: 'TTS 模型',
                fields: [],
            },
            azure: {
                label: 'Azure Speech',
                endpoint: '',
                keyLabel: 'Speech Key',
                modelLabel: '默认音色',
                modelIsVoice: true,
                fields: [
                    {
                        key: 'region',
                        label: '区域',
                        placeholder: '例如 eastasia',
                    },
                ],
            },
            google: {
                label: 'Google Cloud TTS',
                endpoint: 'https://texttospeech.googleapis.com/v1',
                keyLabel: 'Google API Key',
                modelLabel: '默认音色',
                modelIsVoice: true,
                fields: [],
            },
            'aws-polly': {
                label: 'AWS Polly',
                endpoint: '',
                keyLabel: 'Access Key ID',
                modelLabel: '默认音色',
                modelIsVoice: true,
                fields: [
                    {
                        key: 'region',
                        label: '区域',
                        placeholder: '例如 ap-east-1',
                    },
                    {
                        key: 'secretKey',
                        label: 'Secret Access Key',
                        type: 'password',
                    },
                    {
                        key: 'sessionToken',
                        label: 'Session Token',
                        type: 'password',
                        optional: true,
                    },
                ],
            },
            volcengine: {
                label: '火山引擎 / 豆包语音',
                endpoint: 'https://openspeech.bytedance.com/api/v1/tts',
                keyLabel: 'Access Token',
                modelLabel: '资源 ID',
                fields: [
                    {
                        key: 'appId',
                        label: 'App ID',
                    },
                    {
                        key: 'resourceId',
                        label: 'Resource ID',
                        placeholder: '填写资源 ID',
                    },
                ],
            },
            dashscope: {
                label: '阿里云 DashScope',
                endpoint:
                    'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation',
                keyLabel: 'DashScope API Key',
                modelLabel: 'TTS 模型',
                fields: [],
            },
            tencent: {
                label: '腾讯云 TTS',
                endpoint: 'wss://tts.cloud.tencent.com/stream_ws',
                keyLabel: 'SecretId',
                modelLabel: '默认音色',
                modelIsVoice: true,
                fields: [
                    {
                        key: 'appId',
                        label: 'App ID',
                    },
                    {
                        key: 'secretKey',
                        label: 'SecretKey',
                        type: 'password',
                    },
                    {
                        key: 'region',
                        label: '区域',
                        placeholder: '例如 ap-beijing',
                    },
                ],
            },
            baidu: {
                label: '百度智能云 TTS',
                endpoint: 'https://tsn.baidu.com/text2audio',
                keyLabel: 'API Key',
                modelLabel: '默认音色',
                modelIsVoice: true,
                fields: [
                    {
                        key: 'secretKey',
                        label: 'Secret Key',
                        type: 'password',
                    },
                ],
            },
            xfyun: {
                label: '讯飞 TTS',
                endpoint: 'wss://tts-api.xfyun.cn/v2/tts',
                keyLabel: 'API Key',
                modelLabel: '默认音色',
                modelIsVoice: true,
                fields: [
                    {
                        key: 'appId',
                        label: 'App ID',
                    },
                    {
                        key: 'apiSecret',
                        label: 'API Secret',
                        type: 'password',
                    },
                ],
            },
        }),
        REQUEST_TIMEOUT_MS_2 = 45000,
        count_3 = 9999;
    let currentAudio = null;
    function clone_2(value_2) {
        if (typeof structuredClone === 'function') return structuredClone(value_2);
        return JSON.parse(JSON.stringify(value_2));
    }
    function safeLoad(key_2, fallback_2) {
        try {
            return window.StorageManager?.load
                ? window.StorageManager.load(key_2, fallback_2)
                : fallback_2;
        } catch (error_2) {
            return (console.warn('[tts] Failed to load config:', error_2), fallback_2);
        }
    }
    function safeSave(key_3, value_3) {
        try {
            if (window.StorageManager?.save) window.StorageManager.save(key_3, value_3);
        } catch (error_3) {
            console.warn('[tts] Failed to save config:', error_3);
        }
    }
    function cleanString(value_4, maxLength = 2048) {
        return String(value_4 == null ? '' : value_4)
            .trim()
            .slice(0, maxLength);
    }
    function normalizeModels(value_5) {
        const seen = new Set();
        return (Array.isArray(value_5) ? value_5 : [])
            .map((item) => cleanString(item, 256))
            .filter((item_2) => item_2 && !seen.has(item_2) && (seen.add(item_2) || true))
            .slice(0, 200);
    }
    function isLegacyMinimaxConfig(value_6) {
        return (
            value_6 &&
            typeof value_6 === 'object' &&
            !value_6.providers &&
            ['region', 'customEndpointEnabled', 'endpoint', 'apiKey', 'groupId', 'ttsModel'].some(
                (key_4) => Object.prototype.hasOwnProperty.call(value_6, key_4),
            )
        );
    }
    function createProviderConfig(provider_2, saved = {}) {
        const definition = PROVIDERS_2[provider_2],
            result = {
                endpoint: cleanString(saved.endpoint ?? definition.endpoint),
                apiKey: cleanString(saved.apiKey, 1024),
                model: cleanString(saved.model, 256),
                models: normalizeModels(saved.models),
            };
        definition.fields.forEach((field) => {
            result[field.key] = cleanString(
                saved[field.key],
                field.key === 'secretKey' || field.key === 'apiSecret' ? 1024 : 512,
            );
        });
        if (provider_2 === 'minimax')
            result.region = ['cn', 'intl'].includes(saved.region) ? saved.region : 'cn';
        return result;
    }
    function migrateLegacyMinimaxConfig(legacy) {
        const region_2 = legacy?.region === 'intl' ? 'intl' : 'cn',
            defaultEndpoint =
                region_2 === 'intl' ? 'https://api.minimax.io' : 'https://api.minimax.chat';
        return {
            activeProvider: 'minimax',
            providers: {
                minimax: {
                    region: region_2,
                    endpoint: legacy?.customEndpointEnabled
                        ? cleanString(legacy?.endpoint)
                        : defaultEndpoint,
                    apiKey: cleanString(legacy?.apiKey, 1024),
                    groupId: cleanString(legacy?.groupId, 512),
                    model: cleanString(legacy?.ttsModel, 256),
                    models: [],
                },
            },
        };
    }
    function normalizeConfig_2(value_7) {
        const raw = isLegacyMinimaxConfig(value_7)
                ? migrateLegacyMinimaxConfig(value_7)
                : value_7 && typeof value_7 === 'object'
                  ? value_7
                  : {},
            savedProviders =
                raw.providers && typeof raw.providers === 'object' ? raw.providers : {},
            providers_2 = {};
        return (
            PROVIDER_IDS_2.forEach((provider_3) => {
                providers_2[provider_3] = createProviderConfig(
                    provider_3,
                    savedProviders[provider_3] || {},
                );
            }),
            {
                activeProvider: PROVIDER_IDS_2.includes(raw.activeProvider)
                    ? raw.activeProvider
                    : 'minimax',
                providers: providers_2,
            }
        );
    }
    function getLegacyConfig() {
        return safeLoad('u2_minimaxConfig', null);
    }
    function getConfig_2() {
        const source =
            window.ttsConfig || safeLoad('u2_ttsConfig', null) || getLegacyConfig() || {};
        return ((window.ttsConfig = normalizeConfig_2(source)), window.ttsConfig);
    }
    function getActiveConfig_2() {
        const config_2 = getConfig_2();
        return {
            provider: config_2.activeProvider,
            ...(config_2.providers[config_2.activeProvider] || {}),
        };
    }
    function setConfig_3(nextConfig) {
        window.ttsConfig = normalizeConfig_2(nextConfig);
        safeSave('u2_ttsConfig', window.ttsConfig);
        try {
            window.dispatchEvent?.(
                new CustomEvent('u2:tts-config-updated', {
                    detail: clone_2(window.ttsConfig),
                }),
            );
        } catch (_) {}
        return window.ttsConfig;
    }
    function getProviderDefinition_2(provider_4) {
        return PROVIDERS_2[provider_4] || PROVIDERS_2['openai-compatible'];
    }
    function getProviderName_2(provider_5) {
        return getProviderDefinition_2(provider_5).label;
    }
    function getBaseEndpoint(value_66, value_67 = '接口地址') {
        const cleanString_68 = cleanString(value_66);
        if (!cleanString_68) throw new Error('请填写' + value_67);
        let parsed_2;
        try {
            parsed_2 = new URL(cleanString_68);
        } catch (value_70) {
            throw new Error(value_67 + '格式无效');
        }
        if (!['http:', 'https:', 'ws:', 'wss:'].includes(parsed_2.protocol))
            throw new Error(value_67 + '仅支持 HTTP(S) 或 WebSocket');
        return parsed_2;
    }
    function handleAction_13(value_71, value_72 = '接口地址') {
        const parsed_3 = getBaseEndpoint(value_71, value_72);
        if (!['http:', 'https:'].includes(parsed_3.protocol))
            throw new Error(value_72 + '仅支持 HTTP 或 HTTPS');
        return parsed_3;
    }
    function required(config_3, key_5, value_76) {
        const value_8 = cleanString(config_3?.[key_5]);
        if (!value_8) throw new Error('请填写' + value_76);
        return value_8;
    }
    function validateActiveConfig_2(input_2 = getActiveConfig_2(), value_79 = {}) {
        const provider_6 = PROVIDER_IDS_2.includes(input_2?.provider)
                ? input_2.provider
                : getConfig_2().activeProvider,
            config_4 = {
                provider: provider_6,
                ...(input_2 || {}),
            },
            definition_2 = getProviderDefinition_2(provider_6);
        if (
            provider_6 !== 'aws-polly' &&
            !(provider_6 === 'azure' && !cleanString(config_4.endpoint))
        )
            getBaseEndpoint(config_4.endpoint);
        required(config_4, 'apiKey', definition_2.keyLabel);
        definition_2.fields
            .filter((field_2) => !field_2.optional && field_2.key !== 'region')
            .forEach((field_3) => required(config_4, field_3.key, field_3.label));
        if (['azure', 'aws-polly', 'tencent'].includes(provider_6))
            required(config_4, 'region', '区域');
        return (
            value_79.requireModel !== false &&
                [
                    'minimax',
                    'openai',
                    'openai-compatible',
                    'elevenlabs',
                    'dashscope',
                    'volcengine',
                ].includes(provider_6) &&
                required(config_4, 'model', definition_2.modelLabel),
            config_4
        );
    }
    function resolveFriendTtsSettings_3(friend) {
        const tts_2 =
            friend?.ttsVoice && typeof friend.ttsVoice === 'object'
                ? friend.ttsVoice
                : friend?.minimaxVoice && typeof friend.minimaxVoice === 'object'
                  ? friend.minimaxVoice
                  : {};
        return {
            enabled: tts_2.enabled === true,
            voiceId: cleanString(tts_2.voiceId, 256),
            speed: Math.max(0.5, Math.min(2, Number.parseFloat(tts_2.speed) || 1)),
            language: cleanString(friend?.language, 80) || 'zh',
        };
    }
    function isTtsCharacter(friend_2) {
        return !!friend_2 && friend_2.type !== 'group' && friend_2.type !== 'official';
    }
    function resolveMessageTtsFriend_2(conversation_2, message_2 = {}) {
        if (!conversation_2) return null;
        if (conversation_2.type !== 'group')
            return isTtsCharacter(conversation_2) ? conversation_2 : null;
        const memberId = message_2?.speakerMemberId ?? message_2?.senderMemberId ?? null;
        if (message_2?.role === 'user' || String(memberId || '') === '__user__') return null;
        const member = window.imChat?.getGroupMessageSpeaker
            ? window.imChat.getGroupMessageSpeaker(conversation_2, message_2)
            : null;
        return isTtsCharacter(member) ? member : null;
    }
    function canSpeakForFriend_2(friend_3) {
        const settings = resolveFriendTtsSettings_3(friend_3);
        return isTtsCharacter(friend_3) && settings.enabled === true && !!settings.voiceId;
    }
    function canSpeakMessage_3(conversation, message_3 = {}) {
        return canSpeakForFriend_2(resolveMessageTtsFriend_2(conversation, message_3));
    }
    function getVoiceId(config_5, voiceSettings_2) {
        const definition_3 = getProviderDefinition_2(config_5.provider),
            voiceId_2 =
                voiceSettings_2.voiceId ||
                (definition_3.modelIsVoice ? cleanString(config_5.model) : '');
        if (!voiceId_2) throw new Error('请先在 Chat Settings Info 填写 TTS 音色 ID');
        return voiceId_2;
    }
    function normalizeLanguage_2(language_2) {
        const aliases = {
                zh: 'Chinese',
                'zh-cn': 'Chinese',
                chinese: 'Chinese',
                中文: 'Chinese',
                yue: 'Chinese,Yue',
                粤语: 'Chinese,Yue',
                cantonese: 'Chinese,Yue',
                'traditional chinese with cantonese': 'Chinese,Yue',
                en: 'English',
                english: 'English',
                ja: 'Japanese',
                japanese: 'Japanese',
                日语: 'Japanese',
                ko: 'Korean',
                korean: 'Korean',
                韩语: 'Korean',
                fr: 'French',
                french: 'French',
                法语: 'French',
                de: 'German',
                german: 'German',
                德语: 'German',
                ru: 'Russian',
                russian: 'Russian',
                俄语: 'Russian',
                es: 'Spanish',
                西班牙语: 'Spanish',
                pt: 'Portuguese',
                葡萄牙语: 'Portuguese',
            },
            normalized = cleanString(language_2).toLowerCase();
        return aliases[normalized] || 'auto';
    }
    function isLikelyChinese(text_2) {
        return /[\u3400-\u9fff]/.test(String(text_2 || ''));
    }
    function getSilentHeaders() {
        const header = window.u2Api?.INTERNAL_SILENT_ERROR_HEADER || 'X-U2-Silent-Errors';
        return {
            [header]: '1',
        };
    }
    async function readError(response) {
        try {
            const data_2 = await response.clone().json();
            return cleanString(
                data_2?.error?.message ||
                    data_2?.message ||
                    data_2?.msg ||
                    data_2?.base_resp?.status_msg ||
                    data_2?.detail,
                500,
            );
        } catch (__2) {
            try {
                return cleanString(await response.text(), 500);
            } catch (__3) {
                return '';
            }
        }
    }
    async function fetchWithTimeout(url_2, init = {}, value_105 = 'TTS 服务') {
        const controller = new AbortController(),
            timeoutId_2 = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS_2);
        try {
            const response_2 = await fetch(url_2, {
                ...init,
                signal: controller.signal,
            });
            if (!response_2.ok) {
                const value_108 = await readError(response_2);
                throw (
                    window.u2Api?.createHttpError?.(
                        response_2,
                        {
                            message: value_108,
                        },
                        value_105 + '请求失败',
                    ) ||
                    Object.assign(
                        new Error(
                            value_105 +
                                '请求失败（HTTP ' +
                                response_2.status +
                                (value_108 ? '：' + value_108 : '') +
                                '）',
                        ),
                        {
                            status: response_2.status,
                            apiDetail: value_108,
                        },
                    )
                );
            }
            return response_2;
        } catch (value_109) {
            if (value_109?.name === 'AbortError')
                throw Object.assign(new Error(value_105 + '请求超时，请稍后重试'), {
                    name: 'TimeoutError',
                });
            throw value_109;
        } finally {
            clearTimeout(timeoutId_2);
        }
    }
    function resolveOperationEndpoint(value_110, operation_2) {
        const handleAction_13_112 = handleAction_13(value_110),
            suffix = String(operation_2 || '').replace(/^\/+/, '');
        let pathname_2 = String(handleAction_13_112.pathname || '/').replace(/\/+$/, '');
        pathname_2 = pathname_2.replace(
            /\/(?:audio\/speech|models|chat\/completions|images\/generations)$/i,
            '',
        );
        if (!/\/v\d+(?:[a-z0-9._-]*)?$/i.test(pathname_2)) pathname_2 = (pathname_2 || '') + '/v1';
        return (
            (handleAction_13_112.pathname = (pathname_2 + '/' + suffix).replace(/\/+/g, '/')),
            (handleAction_13_112.search = ''),
            (handleAction_13_112.hash = ''),
            handleAction_13_112.toString()
        );
    }
    function handleAction_22(config_6) {
        const parsed_4 = handleAction_13(config_6.endpoint),
            pathname_3 = String(parsed_4.pathname || '/').replace(/\/+$/, '');
        if (!/\/v1\/t2a_v2$/i.test(pathname_3))
            parsed_4.pathname = ((pathname_3 || '') + '/v1/t2a_v2').replace(/\/+/g, '/');
        const groupId_2 = cleanString(config_6.groupId);
        if (groupId_2) parsed_4.searchParams.set('GroupId', groupId_2);
        return parsed_4.toString();
    }
    function resolveAzureEndpoint(config_7, value_120) {
        const region_3 = cleanString(config_7.region),
            value_122 =
                cleanString(config_7.endpoint) ||
                'https://' + region_3 + '.tts.speech.microsoft.com',
            handleAction_13_123 = handleAction_13(value_122);
        let pathname_4 = String(handleAction_13_123.pathname || '/').replace(/\/+$/, '');
        return (
            (pathname_4 = pathname_4.replace(/\/cognitiveservices\/(?:v1|voices\/list)$/i, '')),
            (handleAction_13_123.pathname = (
                (pathname_4 || '') +
                '/cognitiveservices/' +
                value_120
            ).replace(/\/+/g, '/')),
            (handleAction_13_123.search = ''),
            handleAction_13_123.toString()
        );
    }
    function resolveGoogleEndpoint(config_8, value_126) {
        const parsed_5 = handleAction_13(config_8.endpoint);
        let pathname_5 = String(parsed_5.pathname || '/').replace(/\/+$/, '');
        pathname_5 = pathname_5.replace(/\/(?:text:synthesize|voices)$/i, '');
        if (!/\/v\d+(?:beta\d*)?$/i.test(pathname_5)) pathname_5 = (pathname_5 || '') + '/v1';
        return (
            (parsed_5.pathname = (pathname_5 + '/' + value_126).replace(/\/+/g, '/')),
            parsed_5.searchParams.set('key', required(config_8, 'apiKey', 'Google API Key')),
            parsed_5.toString()
        );
    }
    function base64ToBlobUrl(value_9, type_4 = 'audio/mpeg') {
        const base64 = String(value_9 || '')
            .replace(/^data:audio\/[^;]+;base64,/i, '')
            .replace(/\s+/g, '');
        if (!base64) return '';
        const binary = atob(base64),
            bytes_2 = new Uint8Array(binary.length);
        for (let index_2 = 0; index_2 < binary.length; index_2 += 1)
            bytes_2[index_2] = binary.charCodeAt(index_2);
        return URL.createObjectURL(
            new Blob([bytes_2], {
                type: type_4,
            }),
        );
    }
    function hexToBlobUrl(value_10, type_5 = 'audio/mpeg') {
        const hex = String(value_10 || '')
            .replace(/^0x/i, '')
            .replace(/\s+/g, '');
        if (!hex || hex.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(hex)) return '';
        const bytes = new Uint8Array(hex.length / 2);
        for (let index = 0; index < hex.length; index += 2)
            bytes[index / 2] = Number.parseInt(hex.slice(index, index + 2), 16);
        return URL.createObjectURL(
            new Blob([bytes], {
                type: type_5,
            }),
        );
    }
    function handleAction_25(data_3) {
        const value_11 = [
                data_3?.data?.audio,
                data_3?.data?.audio_base64,
                data_3?.data?.audio_file,
                data_3?.data?.url,
                data_3?.output?.audio?.url,
                data_3?.output?.audio?.data,
                data_3?.output?.audio,
                data_3?.audio,
                data_3?.audio_base64,
                data_3?.audioContent,
                data_3?.url,
            ].find(Boolean),
            audio_2 = String(value_11 == null ? '' : value_11).trim();
        if (!audio_2) return '';
        if (/^(https?:|blob:|data:audio\/)/i.test(audio_2)) return audio_2;
        if (/^[0-9a-f]+$/i.test(audio_2) && audio_2.length > 32) return hexToBlobUrl(audio_2);
        return base64ToBlobUrl(audio_2);
    }
    function handleAction_26(data_4) {
        const statusCode = data_4?.base_resp?.status_code;
        if (statusCode != null && Number(statusCode) !== 0) {
            const statusMessage = cleanString(data_4?.base_resp?.status_msg, 500);
            return statusMessage || '服务返回错误代码 ' + statusCode;
        }
        return cleanString(
            data_4?.error?.message ||
                data_4?.error?.detail ||
                data_4?.message ||
                data_4?.msg ||
                data_4?.detail,
            500,
        );
    }
    function getUserErrorMessage_3(error_4, fallback = '语音播放失败') {
        const message_4 = cleanString(error_4?.message, 500).replace(
            /\b(api[ _-]?key|authorization|token|secret)\b\s*[:=]\s*[^\s,;]+/gi,
            '$1：已隐藏',
        );
        return message_4 || fallback;
    }
    async function responseToAudioUrl(response_3, value_145 = 'TTS 服务') {
        const contentType = String(response_3.headers.get('content-type') || '').toLowerCase();
        if (contentType.includes('application/json') || contentType.includes('text/json')) {
            const tokenData = await response_3.json(),
                audioUrl = handleAction_25(tokenData);
            if (audioUrl) return audioUrl;
            const handleAction_26_150 = handleAction_26(tokenData);
            if (handleAction_26_150)
                throw new Error(value_145 + '合成失败：' + handleAction_26_150);
            if (!audioUrl) throw new Error('TTS 服务未返回音频');
        }
        const blob_2 = await response_3.blob();
        if (!blob_2.size) throw new Error('TTS 服务未返回音频');
        return URL.createObjectURL(
            new Blob([blob_2], {
                type: blob_2.type || 'audio/mpeg',
            }),
        );
    }
    async function handleAction_29(value_151) {
        let value_152;
        try {
            value_152 = await value_151.json();
        } catch (value_155) {
            throw new Error('MiniMax TTS 返回的音频响应不是有效 JSON');
        }
        const handleAction_26_153 = handleAction_26(value_152);
        if (handleAction_26_153) throw new Error('MiniMax TTS合成失败：' + handleAction_26_153);
        const audioUrl_2 = handleAction_25(value_152);
        if (!audioUrl_2) throw new Error('MiniMax TTS 未返回音频');
        return audioUrl_2;
    }
    async function playAudioUrl_2(value_12, value_13 = false) {
        if (!value_12) throw new Error('没有可播放的音频');
        currentAudio && (currentAudio.pause(), (currentAudio = null));
        const value_14 = new Audio(value_12);
        value_14.preload = 'auto';
        currentAudio = value_14;
        try {
            const value_15 = value_13
                ? new Promise((value_16) => {
                      value_14.addEventListener('ended', value_16, {
                          once: true,
                      });
                      value_14.addEventListener('error', value_16, {
                          once: true,
                      });
                      value_14.addEventListener('pause', value_16, {
                          once: true,
                      });
                  })
                : null;
            await value_14.play();
            if (value_15) await value_15;
            return value_14;
        } catch (error_5) {
            if (currentAudio === value_14) currentAudio = null;
            if (error_5?.name === 'NotAllowedError')
                throw new Error('浏览器阻止音频播放，请再次点击播放按钮');
            if (error_5?.name === 'NotSupportedError')
                throw new Error('浏览器不支持返回的音频格式');
            const details = cleanString(error_5?.message, 300);
            throw new Error('音频播放失败' + (details ? '：' + details : ''));
        }
    }
    function escapeXml(value_12_2) {
        return String(value_12_2 || '').replace(
            /[<>&'\"]/g,
            (char) =>
                ({
                    '<': '&lt;',
                    '>': '&gt;',
                    '&': '&amp;',
                    "'": '&apos;',
                    '"': '&quot;',
                })[char],
        );
    }
    function utf8ToBase64(value_13_2) {
        const bytes_3 = new TextEncoder().encode(String(value_13_2 || ''));
        let text_163 = '';
        return (
            bytes_3.forEach((value_164) => {
                text_163 += String.fromCharCode(value_164);
            }),
            btoa(text_163)
        );
    }
    async function synthesizeMiniMax(config_9, text_3, voiceSettings_3) {
        const voice_id_2 = getVoiceId(config_9, voiceSettings_3),
            body_2 = {
                model: required(config_9, 'model', 'TTS 模型'),
                text: text_3,
                stream: false,
                output_format: 'hex',
                voice_setting: {
                    voice_id: voice_id_2,
                    speed: voiceSettings_3.speed,
                    vol: 1,
                    pitch: 0,
                },
                audio_setting: {
                    sample_rate: 32000,
                    bitrate: 128000,
                    format: 'mp3',
                    channel: 1,
                },
            },
            language_3 = normalizeLanguage_2(voiceSettings_3.language);
        if (language_3 !== 'auto' && (language_3 !== 'Chinese' || isLikelyChinese(text_3)))
            body_2.language_boost = language_3;
        const value_171 = await fetchWithTimeout(
            handleAction_22(config_9),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + config_9.apiKey,
                    ...getSilentHeaders(),
                },
                body: JSON.stringify(body_2),
            },
            'MiniMax TTS',
        );
        return handleAction_29(value_171);
    }
    async function synthesizeOpenAi(config_10, input_3, voiceSettings_4) {
        const value_175 = await fetchWithTimeout(
            resolveOperationEndpoint(config_10.endpoint, 'audio/speech'),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + config_10.apiKey,
                    ...getSilentHeaders(),
                },
                body: JSON.stringify({
                    model: required(config_10, 'model', 'TTS 模型'),
                    input: input_3,
                    voice: getVoiceId(config_10, voiceSettings_4),
                    speed: voiceSettings_4.speed,
                    response_format: 'mp3',
                }),
            },
            getProviderName_2(config_10.provider) + ' TTS',
        );
        return responseToAudioUrl(value_175);
    }
    async function synthesizeElevenLabs(config_11, text_4, value_178) {
        const parsed_6 = handleAction_13(config_11.endpoint);
        let pathname_6 = String(parsed_6.pathname || '/')
            .replace(/\/+$/, '')
            .replace(/\/text-to-speech\/[^/]+$/i, '');
        if (!/\/v1$/i.test(pathname_6)) pathname_6 = (pathname_6 || '') + '/v1';
        parsed_6.pathname = (
            pathname_6 +
            '/text-to-speech/' +
            encodeURIComponent(getVoiceId(config_11, value_178))
        ).replace(/\/+/g, '/');
        parsed_6.searchParams.set('output_format', 'mp3_44100_128');
        const response_4 = await fetchWithTimeout(
            parsed_6.toString(),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': config_11.apiKey,
                    ...getSilentHeaders(),
                },
                body: JSON.stringify({
                    text: text_4,
                    model_id: required(config_11, 'model', 'TTS 模型'),
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75,
                    },
                }),
            },
            'ElevenLabs TTS',
        );
        return responseToAudioUrl(response_4);
    }
    async function synthesizeAzure(config_12, value_183, voiceSettings_5) {
        const voiceId_185 = getVoiceId(config_12, voiceSettings_5),
            value_186 = await fetchWithTimeout(
                resolveAzureEndpoint(config_12, 'v1'),
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/ssml+xml',
                        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
                        'Ocp-Apim-Subscription-Key': config_12.apiKey,
                        'User-Agent': 'u2phone',
                        ...getSilentHeaders(),
                    },
                    body:
                        '<speak version="1.0" xml:lang="' +
                        escapeXml(voiceSettings_5.language || 'zh-CN') +
                        '"><voice name="' +
                        escapeXml(voiceId_185) +
                        '"><prosody rate="' +
                        Math.round((voiceSettings_5.speed - 1) * 100) +
                        '%">' +
                        escapeXml(value_183) +
                        '</prosody></voice></speak>',
                },
                'Azure Speech',
            );
        return responseToAudioUrl(value_186);
    }
    async function synthesizeGoogle(config_13, text_5, voiceSettings_6) {
        const response_5 = await fetchWithTimeout(
            resolveGoogleEndpoint(config_13, 'text:synthesize'),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getSilentHeaders(),
                },
                body: JSON.stringify({
                    input: {
                        text: text_5,
                    },
                    voice: {
                        name: getVoiceId(config_13, voiceSettings_6),
                        languageCode: voiceSettings_6.language || undefined,
                    },
                    audioConfig: {
                        audioEncoding: 'MP3',
                        speakingRate: voiceSettings_6.speed,
                    },
                }),
            },
            'Google Cloud TTS',
        );
        return responseToAudioUrl(response_5);
    }
    function toHex(buffer) {
        return Array.from(new Uint8Array(buffer))
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join('');
    }
    async function sha256Hex(value_14_2) {
        return toHex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value_14_2)));
    }
    async function hmac(key_6, value_15_2, algorithm = 'SHA-256') {
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            key_6 instanceof Uint8Array ? key_6 : new TextEncoder().encode(key_6),
            {
                name: 'HMAC',
                hash: algorithm,
            },
            false,
            ['sign'],
        );
        return new Uint8Array(
            await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(value_15_2)),
        );
    }
    function awsDate(date = new Date()) {
        const iso = date.toISOString().replace(/[:-]|\.\d{3}/g, '');
        return {
            short: iso.slice(0, 8),
            long: iso.slice(0, 15) + 'Z',
        };
    }
    async function signAwsRequest(config_14, value_24, value_25, value_26) {
        if (!window.crypto?.subtle) throw new Error('当前浏览器不支持 AWS Polly 所需的请求签名');
        const parsed_7 = new URL(value_25),
            date_2 = awsDate(),
            value_29 = await sha256Hex(value_26),
            headers_2 = {
                'content-type': 'application/x-amz-json-1.0',
                host: parsed_7.host,
                'x-amz-date': date_2.long,
            };
        if (cleanString(config_14.sessionToken))
            headers_2['x-amz-security-token'] = config_14.sessionToken;
        const signedNames = Object.keys(headers_2).sort(),
            join_32 = signedNames
                .map(
                    (value_41) =>
                        value_41 +
                        ':' +
                        headers_2[value_41] +
                        `
`,
                )
                .join(''),
            value_33 =
                value_24 +
                `
` +
                parsed_7.pathname +
                `
` +
                parsed_7.search.slice(1) +
                `
` +
                join_32 +
                `
` +
                signedNames.join(';') +
                `
` +
                value_29,
            value_205 = date_2.short + '/' + config_14.region + '/polly/aws4_request',
            stringToSign =
                `AWS4-HMAC-SHA256
` +
                date_2.long +
                `
` +
                value_205 +
                `
` +
                (await sha256Hex(value_33)),
            dateKey = await hmac('AWS4' + config_14.secretKey, date_2.short),
            regionKey = await hmac(dateKey, config_14.region),
            serviceKey = await hmac(regionKey, 'polly'),
            signingKey = await hmac(serviceKey, 'aws4_request'),
            signature = toHex(await hmac(signingKey, stringToSign));
        return {
            ...headers_2,
            Authorization:
                'AWS4-HMAC-SHA256 Credential=' +
                config_14.apiKey +
                '/' +
                value_205 +
                ', SignedHeaders=' +
                signedNames.join(';') +
                ', Signature=' +
                signature,
        };
    }
    async function synthesizeAwsPolly(config_15, Text_2, voiceSettings_7) {
        const value_216 =
                cleanString(config_15.endpoint) ||
                'https://polly.' + config_15.region + '.amazonaws.com',
            parsed_8 = handleAction_13(value_216);
        parsed_8.pathname = '/v1/speech';
        parsed_8.search = '';
        const body_3 = JSON.stringify({
                OutputFormat: 'mp3',
                Text: Text_2,
                VoiceId: getVoiceId(config_15, voiceSettings_7),
                SampleRate: '24000',
            }),
            headers_3 = await signAwsRequest(config_15, 'POST', parsed_8.toString(), body_3),
            response_6 = await fetchWithTimeout(
                parsed_8.toString(),
                {
                    method: 'POST',
                    headers: {
                        ...headers_3,
                        ...getSilentHeaders(),
                    },
                    body: body_3,
                },
                'AWS Polly',
            );
        return responseToAudioUrl(response_6);
    }
    async function synthesizeVolcengine(value_221, text_12, value_223) {
        const options_224 = {
                app: {
                    appid: value_221.appId,
                    token: value_221.apiKey,
                    cluster: value_221.resourceId || value_221.model,
                },
                user: {
                    uid: 'u2-' + Date.now(),
                },
                audio: {
                    voice_type: getVoiceId(value_221, value_223),
                    encoding: 'mp3',
                    speed_ratio: value_223.speed,
                },
                request: {
                    reqid: 'u2-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
                    text: text_12,
                    operation: 'query',
                },
            },
            value_225 = await fetchWithTimeout(
                value_221.endpoint,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer;' + value_221.apiKey,
                        ...getSilentHeaders(),
                    },
                    body: JSON.stringify(options_224),
                },
                '火山引擎 TTS',
            );
        return responseToAudioUrl(value_225);
    }
    async function synthesizeDashScope(config_16, text_6, voiceSettings_8) {
        const value_229 = await fetchWithTimeout(
            config_16.endpoint,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + config_16.apiKey,
                    ...getSilentHeaders(),
                },
                body: JSON.stringify({
                    model: required(config_16, 'model', 'TTS 模型'),
                    input: {
                        text: text_6,
                    },
                    parameters: {
                        voice: getVoiceId(config_16, voiceSettings_8),
                        format: 'mp3',
                        sample_rate: 44100,
                    },
                }),
            },
            'DashScope TTS',
        );
        return responseToAudioUrl(value_229);
    }
    function waitForWebSocket(value_230, onOpen, onMessage, value_231) {
        if (typeof WebSocket !== 'function')
            return Promise.reject(new Error('当前环境不支持 WebSocket TTS'));
        return new Promise((resolve, reject_2) => {
            let settled = false;
            const socket = new WebSocket(value_230),
                timeoutId = setTimeout(
                    () => finish(new Error(value_231 + '连接超时')),
                    REQUEST_TIMEOUT_MS_2,
                ),
                finish = (error_6, value_16_2) => {
                    if (settled) return;
                    settled = true;
                    clearTimeout(timeoutId);
                    try {
                        socket.close();
                    } catch (__4) {}
                    if (error_6) reject_2(error_6);
                    else resolve(value_16_2);
                };
            socket.onerror = () =>
                finish(new Error(value_231 + '连接失败，请检查地址、凭据或浏览器跨域限制'));
            socket.onopen = () => {
                try {
                    onOpen(socket);
                } catch (error_7) {
                    finish(error_7);
                }
            };
            socket.onmessage = (event) => {
                try {
                    onMessage(event, finish);
                } catch (error_8) {
                    finish(error_8);
                }
            };
        });
    }
    async function synthesizeTencent(config_17, Text_3, voiceSettings_9) {
        if (!window.crypto?.subtle) throw new Error('当前浏览器不支持腾讯云 TTS 所需的请求签名');
        const parsed = getBaseEndpoint(config_17.endpoint),
            floor_241 = Math.floor(Date.now() / 1000),
            Nonce_2 = Math.floor(Math.random() * 1000000000),
            params = {
                Action: 'TextToVoice',
                AppId: config_17.appId,
                Expired: floor_241 + 3600,
                Nonce: Nonce_2,
                SecretId: config_17.apiKey,
                Timestamp: floor_241,
                VoiceType: getVoiceId(config_17, voiceSettings_9),
            };
        Object.entries(params).forEach(([key_7, value_17_2]) =>
            parsed.searchParams.set(key_7, String(value_17_2)),
        );
        const sorted = Array.from(parsed.searchParams.entries()).sort(([left], [right]) =>
                left.localeCompare(right),
            ),
            source_2 =
                'GET' +
                parsed.host +
                parsed.pathname +
                '?' +
                sorted.map(([value_249, value_250]) => value_249 + '=' + value_250).join('&'),
            signatureBytes = await hmac(config_17.secretKey, source_2, 'SHA-1');
        let binary_2 = '';
        signatureBytes.forEach((value_251) => {
            binary_2 += String.fromCharCode(value_251);
        });
        parsed.searchParams.set('Signature', btoa(binary_2));
        const chunks = [];
        return waitForWebSocket(
            parsed.toString(),
            (value_252) => {
                value_252.send(
                    JSON.stringify({
                        Action: 'TextToVoice',
                        Text: Text_3,
                        SessionId: 'u2-' + Date.now(),
                        ModelType: 1,
                        Codec: 'mp3',
                        SampleRate: 16000,
                        Speed: Math.round((voiceSettings_9.speed - 1) * 10),
                    }),
                );
            },
            (event_2, finish_2) => {
                const data_5 = JSON.parse(String(event_2.data || '{}'));
                if (Number(data_5.code) !== 0 && data_5.code != null)
                    return finish_2(new Error(data_5.message || '腾讯云 TTS 合成失败'));
                const audio_4 = data_5.data || data_5.Audio || data_5.audio;
                if (audio_4) chunks.push(String(audio_4));
                if (data_5.final === 1 || data_5.Final === 1 || data_5.status === 2) {
                    const url_4 = base64ToBlobUrl(chunks.join(''));
                    finish_2(url_4 ? null : new Error('腾讯云 TTS 未返回音频'), url_4);
                }
            },
            '腾讯云 TTS',
        );
    }
    async function synthesizeBaidu(config_18, text_7, voiceSettings_10) {
        const tokenBody = new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: config_18.apiKey,
                client_secret: config_18.secretKey,
            }),
            tokenResponse = await fetchWithTimeout(
                'https://aip.baidubce.com/oauth/2.0/token',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        ...getSilentHeaders(),
                    },
                    body: tokenBody.toString(),
                },
                '百度智能云鉴权',
            ),
            tokenData_2 = await tokenResponse.json(),
            token_2 = cleanString(tokenData_2?.access_token);
        if (!token_2) throw new Error('百度智能云未返回 Access Token');
        const parsed_9 = handleAction_13(config_18.endpoint);
        parsed_9.searchParams.set('tex', text_7);
        parsed_9.searchParams.set('tok', token_2);
        parsed_9.searchParams.set('cuid', 'u2phone');
        parsed_9.searchParams.set('ctp', '1');
        parsed_9.searchParams.set('lan', String(voiceSettings_10.language || 'zh').split('-')[0]);
        parsed_9.searchParams.set('per', getVoiceId(config_18, voiceSettings_10));
        parsed_9.searchParams.set('spd', String(Math.round(5 + (voiceSettings_10.speed - 1) * 5)));
        const response_7 = await fetchWithTimeout(
            parsed_9.toString(),
            {
                headers: getSilentHeaders(),
            },
            '百度智能云 TTS',
        );
        return responseToAudioUrl(response_7);
    }
    async function synthesizeXfyun(config_19, text_8, voiceSettings) {
        if (!window.crypto?.subtle) throw new Error('当前浏览器不支持讯飞 TTS 所需的请求签名');
        const parsed_10 = getBaseEndpoint(config_19.endpoint),
            date_3 = new Date().toUTCString(),
            signatureOrigin =
                'host: ' +
                parsed_10.host +
                `
date: ` +
                date_3 +
                `
GET ` +
                parsed_10.pathname +
                ' HTTP/1.1',
            signatureBytes_2 = await hmac(config_19.apiSecret, signatureOrigin);
        let text_273 = '';
        signatureBytes_2.forEach((value_50) => {
            text_273 += String.fromCharCode(value_50);
        });
        const authorization = btoa(
            'api_key="' +
                config_19.apiKey +
                '", algorithm="hmac-sha256", headers="host date request-line", signature="' +
                btoa(text_273) +
                '"',
        );
        parsed_10.searchParams.set('authorization', authorization);
        parsed_10.searchParams.set('date', date_3);
        parsed_10.searchParams.set('host', parsed_10.host);
        const chunks_2 = [];
        return waitForWebSocket(
            parsed_10.toString(),
            (socket_2) => {
                socket_2.send(
                    JSON.stringify({
                        common: {
                            app_id: config_19.appId,
                        },
                        business: {
                            aue: 'lame',
                            auf: 'audio/L16;rate=16000',
                            vcn: getVoiceId(config_19, voiceSettings),
                            speed: Math.round((voiceSettings.speed - 1) * 50),
                        },
                        data: {
                            status: 2,
                            text: utf8ToBase64(text_8),
                        },
                    }),
                );
            },
            (event_3, finish_3) => {
                const data_6 = JSON.parse(String(event_3.data || '{}'));
                if (Number(data_6.code) !== 0 && data_6.code != null)
                    return finish_3(new Error(data_6.message || '讯飞 TTS 合成失败'));
                if (data_6.data?.audio) chunks_2.push(data_6.data.audio);
                if (Number(data_6.data?.status) === 2) {
                    const url_5 = base64ToBlobUrl(chunks_2.join(''));
                    finish_3(url_5 ? null : new Error('讯飞 TTS 未返回音频'), url_5);
                }
            },
            '讯飞 TTS',
        );
    }
    async function synthesize(config_20, text_9, voiceSettings_11) {
        if (config_20.provider === 'minimax')
            return synthesizeMiniMax(config_20, text_9, voiceSettings_11);
        if (config_20.provider === 'openai' || config_20.provider === 'openai-compatible')
            return synthesizeOpenAi(config_20, text_9, voiceSettings_11);
        if (config_20.provider === 'elevenlabs')
            return synthesizeElevenLabs(config_20, text_9, voiceSettings_11);
        if (config_20.provider === 'azure')
            return synthesizeAzure(config_20, text_9, voiceSettings_11);
        if (config_20.provider === 'google')
            return synthesizeGoogle(config_20, text_9, voiceSettings_11);
        if (config_20.provider === 'aws-polly')
            return synthesizeAwsPolly(config_20, text_9, voiceSettings_11);
        if (config_20.provider === 'volcengine')
            return synthesizeVolcengine(config_20, text_9, voiceSettings_11);
        if (config_20.provider === 'dashscope')
            return synthesizeDashScope(config_20, text_9, voiceSettings_11);
        if (config_20.provider === 'tencent')
            return synthesizeTencent(config_20, text_9, voiceSettings_11);
        if (config_20.provider === 'baidu')
            return synthesizeBaidu(config_20, text_9, voiceSettings_11);
        if (config_20.provider === 'xfyun')
            return synthesizeXfyun(config_20, text_9, voiceSettings_11);
        throw new Error('不支持的 TTS 服务商');
    }
    function getCacheKey(config_21, voiceSettings_12) {
        return [
            config_21.provider,
            config_21.endpoint,
            config_21.model,
            config_21.region,
            config_21.resourceId,
            voiceSettings_12.voiceId,
            voiceSettings_12.speed,
        ]
            .map((item_3) => cleanString(item_3))
            .join('|');
    }
    async function prepareSpeech_2(text_10, value_52 = null, options_2 = {}) {
        const cleanText = cleanString(text_10, 12000);
        if (!cleanText) throw new Error('没有可播放的文本');
        const voiceSettings_13 = resolveFriendTtsSettings_3(value_52);
        if (!voiceSettings_13.enabled && !options_2.ignoreFriendToggle)
            throw new Error('请先在 Chat Settings Info 开启 TTS');
        const config_22 = validateActiveConfig_2(options_2.config || getActiveConfig_2());
        if (config_22.provider === 'minimax' && cleanText.length > count_3)
            throw new Error('MiniMax TTS 单次文本不能超过 ' + count_3.toLocaleString() + ' 个字符');
        return synthesize(config_22, cleanText, {
            ...voiceSettings_13,
            voiceId: options_2.voiceId || voiceSettings_13.voiceId,
        });
    }
    async function handleAction_4(text_10_2, value_57 = null, options_2_2 = {}) {
        const cleanText_2 = cleanString(text_10_2, 12000);
        if (!cleanText_2) {
            if (window.showToast) window.showToast('没有可播放的文本');
            return null;
        }
        const voiceSettings_13_2 = resolveFriendTtsSettings_3(value_57);
        if (!voiceSettings_13_2.enabled && !options_2_2.ignoreFriendToggle) {
            if (window.showToast) window.showToast('请先在 Chat Settings Info 开启 TTS');
            return null;
        }
        const config_22_2 = validateActiveConfig_2(options_2_2.config || getActiveConfig_2());
        if (config_22_2.provider === 'minimax' && cleanText_2.length > count_3)
            throw new Error('MiniMax TTS 单次文本不能超过 ' + count_3.toLocaleString() + ' 个字符');
        if (!options_2_2.suppressToast && window.showToast) window.showToast('语音生成中...');
        const audioUrl_3 = await synthesize(config_22_2, cleanText_2, {
            ...voiceSettings_13_2,
            voiceId: options_2_2.voiceId || voiceSettings_13_2.voiceId,
        });
        if (options_2_2.canPlay && !options_2_2.canPlay()) return null;
        return (await playAudioUrl_2(audioUrl_3, options_2_2.awaitEnd === true), audioUrl_3);
    }
    async function speakTextCached_2(text_11, friend_4 = null, cacheOwner = null, options_3 = {}) {
        const voiceSettings_14 = resolveFriendTtsSettings_3(friend_4);
        if (!voiceSettings_14.enabled && !options_3.ignoreFriendToggle)
            return handleAction_4(text_11, friend_4, options_3);
        const config_23 = validateActiveConfig_2(options_3.config || getActiveConfig_2()),
            cacheKey = getCacheKey(config_23, {
                ...voiceSettings_14,
                voiceId: options_3.voiceId || voiceSettings_14.voiceId,
            });
        if (cacheOwner?.ttsAudioCache?.key === cacheKey && cacheOwner.ttsAudioCache.url) {
            if (options_3.canPlay && !options_3.canPlay()) return null;
            return (
                await playAudioUrl_2(cacheOwner.ttsAudioCache.url, options_3.awaitEnd === true),
                cacheOwner.ttsAudioCache.url
            );
        }
        if (cacheOwner?.ttsAudioPromise) {
            const cached = await cacheOwner.ttsAudioPromise;
            if (options_3.canPlay && !options_3.canPlay()) return null;
            if (cached) await playAudioUrl_2(cached, options_3.awaitEnd === true);
            return cached;
        }
        const handleAction_4_71 = handleAction_4(text_11, friend_4, {
            ...options_3,
            config: config_23,
        });
        if (cacheOwner) cacheOwner.ttsAudioPromise = handleAction_4_71;
        try {
            const value_302 = await handleAction_4_71;
            if (cacheOwner && value_302)
                cacheOwner.ttsAudioCache = {
                    key: cacheKey,
                    url: value_302,
                };
            return value_302;
        } finally {
            if (cacheOwner) delete cacheOwner.ttsAudioPromise;
        }
    }
    function getModelRows(data_7) {
        return Array.isArray(data_7)
            ? data_7
            : Array.isArray(data_7?.data)
              ? data_7.data
              : Array.isArray(data_7?.models)
                ? data_7.models
                : [];
    }
    function getModelId(item_4) {
        return typeof item_4 === 'string'
            ? item_4
            : item_4?.id || item_4?.model_id || item_4?.name || item_4?.model || '';
    }
    function isTtsModelRow(item_5) {
        const modelId = cleanString(getModelId(item_5), 256).toLowerCase(),
            capabilities_2 = item_5 && typeof item_5 === 'object' ? item_5.capabilities : null,
            hasDeclaredTtsCapability =
                item_5 &&
                typeof item_5 === 'object' &&
                (item_5.can_do_text_to_speech === true ||
                    item_5.supports_tts === true ||
                    item_5.supportsTextToSpeech === true ||
                    capabilities_2?.tts === true ||
                    capabilities_2?.text_to_speech === true ||
                    capabilities_2?.['text-to-speech'] === true ||
                    capabilities_2?.audio?.text_to_speech === true);
        return (
            hasDeclaredTtsCapability ||
            /(^|[-_])(?:tts|text[-_]?to[-_]?speech)(?:[-_]|$)/i.test(modelId)
        );
    }
    function extractTtsModelRows(data_8) {
        return getModelRows(data_8)
            .filter(isTtsModelRow)
            .map(getModelId)
            .map((item_6) => cleanString(item_6, 256))
            .filter(Boolean);
    }
    async function handleAction_35(config_24) {
        const response_8 = await fetchWithTimeout(
            resolveOperationEndpoint(config_24.endpoint, 'models'),
            {
                headers: {
                    Authorization: 'Bearer ' + config_24.apiKey,
                    ...getSilentHeaders(),
                },
            },
            getProviderName_2(config_24.provider) + ' 模型列表',
        );
        return extractTtsModelRows(await response_8.json());
    }
    async function handleAction_36(config_25) {
        const parsed_11 = handleAction_13(config_25.endpoint);
        let pathname_7 = String(parsed_11.pathname || '/')
            .replace(/\/+$/, '')
            .replace(/\/models$/i, '');
        if (!/\/v1$/i.test(pathname_7)) pathname_7 = (pathname_7 || '') + '/v1';
        parsed_11.pathname = (pathname_7 + '/models').replace(/\/+/g, '/');
        const value_316 = await fetchWithTimeout(
                parsed_11.toString(),
                {
                    headers: {
                        'xi-api-key': config_25.apiKey,
                        ...getSilentHeaders(),
                    },
                },
                'ElevenLabs 模型列表',
            ),
            data_9 = await value_316.json();
        return (Array.isArray(data_9) ? data_9 : [])
            .filter((item_7) => item_7?.can_do_text_to_speech !== false)
            .map((item_8) => cleanString(item_8?.model_id || item_8?.id, 256))
            .filter(Boolean);
    }
    async function handleAction_37(config_26) {
        const value_321 = await fetchWithTimeout(
                resolveAzureEndpoint(config_26, 'voices/list'),
                {
                    headers: {
                        'Ocp-Apim-Subscription-Key': config_26.apiKey,
                        ...getSilentHeaders(),
                    },
                },
                'Azure Speech 音色列表',
            ),
            data_10 = await value_321.json();
        return (Array.isArray(data_10) ? data_10 : [])
            .map((item_9) => cleanString(item_9?.ShortName || item_9?.Name, 256))
            .filter(Boolean);
    }
    async function handleAction_38(config_27) {
        const value_325 = await fetchWithTimeout(
                resolveGoogleEndpoint(config_27, 'voices'),
                {
                    headers: getSilentHeaders(),
                },
                'Google Cloud TTS 音色列表',
            ),
            data_11 = await value_325.json();
        return (Array.isArray(data_11?.voices) ? data_11.voices : [])
            .map((item_10) => cleanString(item_10?.name, 256))
            .filter(Boolean);
    }
    async function handleAction_39(config_28) {
        const value_329 =
                cleanString(config_28.endpoint) ||
                'https://polly.' + config_28.region + '.amazonaws.com',
            parsed_12 = handleAction_13(value_329);
        parsed_12.pathname = '/v1/voices';
        parsed_12.search = '';
        const headers_4 = await signAwsRequest(config_28, 'GET', parsed_12.toString(), ''),
            value_332 = await fetchWithTimeout(
                parsed_12.toString(),
                {
                    headers: {
                        ...headers_4,
                        ...getSilentHeaders(),
                    },
                },
                'AWS Polly 音色列表',
            ),
            data_12 = await value_332.json();
        return (Array.isArray(data_12?.Voices) ? data_12.Voices : [])
            .map((item_11) => cleanString(item_11?.Id, 256))
            .filter(Boolean);
    }
    async function fetchModels_3(input_4 = getActiveConfig_2()) {
        const config_29 = validateActiveConfig_2(
            {
                ...input_4,
                provider: PROVIDER_IDS_2.includes(input_4?.provider)
                    ? input_4.provider
                    : getConfig_2().activeProvider,
            },
            {
                requireModel: false,
            },
        );
        let models_2;
        if (config_29.provider === 'openai' || config_29.provider === 'openai-compatible')
            models_2 = await handleAction_35(config_29);
        else {
            if (config_29.provider === 'elevenlabs') models_2 = await handleAction_36(config_29);
            else {
                if (config_29.provider === 'azure') models_2 = await handleAction_37(config_29);
                else {
                    if (config_29.provider === 'google')
                        models_2 = await handleAction_38(config_29);
                    else {
                        if (config_29.provider === 'aws-polly')
                            models_2 = await handleAction_39(config_29);
                        else {
                            if (['minimax', 'volcengine', 'dashscope'].includes(config_29.provider))
                                throw new Error(
                                    getProviderName_2(config_29.provider) +
                                        ' 暂不支持可靠的 TTS 模型拉取，请手动填写 TTS 模型或音色 ID',
                                );
                            else
                                throw new Error(
                                    getProviderName_2(config_29.provider) +
                                        ' 未提供可在浏览器中拉取的模型列表；请手动填写模型或音色 ID',
                                );
                        }
                    }
                }
            }
        }
        const unique = normalizeModels(models_2).sort((left_2, right_2) =>
            left_2.localeCompare(right_2),
        );
        if (!unique.length) throw new Error('接口返回成功，但没有发现可用模型或音色');
        return unique;
    }
    window.ttsConfig = normalizeConfig_2(
        window.ttsConfig || safeLoad('u2_ttsConfig', null) || getLegacyConfig(),
    );
    window.getTtsConfig = getConfig_2;
    window.u2Tts = Object.freeze({
        PROVIDER_IDS: PROVIDER_IDS_2,
        PROVIDERS: PROVIDERS_2,
        REQUEST_TIMEOUT_MS: REQUEST_TIMEOUT_MS_2,
        normalizeConfig: normalizeConfig_2,
        getConfig: getConfig_2,
        getActiveConfig: getActiveConfig_2,
        setConfig: setConfig_3,
        getProviderDefinition: getProviderDefinition_2,
        getProviderName: getProviderName_2,
        validateActiveConfig: validateActiveConfig_2,
        resolveFriendTtsSettings: resolveFriendTtsSettings_3,
        resolveMessageTtsFriend: resolveMessageTtsFriend_2,
        canSpeakForFriend: canSpeakForFriend_2,
        canSpeakMessage: canSpeakMessage_3,
        normalizeLanguage: normalizeLanguage_2,
        getUserErrorMessage: getUserErrorMessage_3,
        fetchModels: fetchModels_3,
        speakText: handleAction_4,
        speakTextCached: speakTextCached_2,
        prepareSpeech: prepareSpeech_2,
        playAudioUrl: playAudioUrl_2,
        stopPlayback() {
            currentAudio && (currentAudio.pause(), (currentAudio = null));
        },
    });
})();
