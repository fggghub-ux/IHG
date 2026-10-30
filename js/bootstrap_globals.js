(function () {
    const API_PROVIDERS = Object.freeze([
            'openai',
            'deepseek',
            'siliconflow',
            'gemini',
            'anthropic',
            'openai-compatible',
        ]),
        defaultApiConfig = {
            provider: 'openai-compatible',
            endpoint: '',
            apiKey: '',
            model: '',
            temperature: 0.7,
            frequencyPenalty: 0,
            streamEnabled: false,
        },
        VECTOR_MEMORY_PROVIDERS_2 = Object.freeze({
            siliconflow: {
                label: '硅基流动',
                endpoint: 'https://api.siliconflow.cn/v1/embeddings',
                defaultModel: 'BAAI/bge-m3',
                models: ['BAAI/bge-m3', 'BAAI/bge-large-zh-v1.5'],
            },
            openai: {
                label: 'OpenAI',
                endpoint: 'https://api.openai.com/v1/embeddings',
                defaultModel: 'text-embedding-3-small',
                models: ['text-embedding-3-small', 'text-embedding-3-large'],
            },
            dashscope: {
                label: '阿里云百炼',
                endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/embeddings',
                defaultModel: 'text-embedding-v4',
                models: ['text-embedding-v4', 'text-embedding-v3'],
            },
            zhipu: {
                label: '智谱 AI',
                endpoint: 'https://open.bigmodel.cn/api/paas/v4/embeddings',
                defaultModel: 'embedding-3',
                models: ['embedding-3', 'embedding-2'],
            },
            'openai-compatible': {
                label: '自定义 OpenAI 兼容',
                endpoint: '',
                defaultModel: '',
                models: [],
            },
        }),
        defaultVectorMemoryConfig = {
            enabled: false,
            provider: 'siliconflow',
            endpoint: '',
            apiKey: '',
            model: 'BAAI/bge-m3',
        },
        defaultImageGenerationConfig = {
            activeProvider: 'gemini',
            providers: {
                openai: {
                    endpoint: 'https://api.openai.com/v1/images/generations',
                    apiKey: '',
                    model: 'gpt-image-1.5',
                    size: '1024x1024',
                    models: [],
                },
                gemini: {
                    endpoint: 'https://generativelanguage.googleapis.com/v1beta/interactions',
                    apiKey: '',
                    model: 'gemini-3.1-flash-image',
                    size: '1024x1024',
                    models: [],
                },
                novelai: {
                    endpoint: 'https://image.novelai.net/ai/generate-image',
                    apiKey: '',
                    model: '',
                    size: '1024x1024',
                    models: [],
                },
                grok: {
                    endpoint: 'https://api.x.ai/v1/images/generations',
                    apiKey: '',
                    model: 'grok-imagine-image',
                    size: '1024x1024',
                    models: [],
                },
                relay: {
                    endpoint: '',
                    apiKey: '',
                    model: '',
                    size: '1024x1024',
                    models: [],
                },
            },
        },
        VISION_PROVIDERS_2 = Object.freeze({
            openai: {
                label: 'OpenAI',
                endpoint: 'https://api.openai.com/v1/chat/completions',
            },
            gemini: {
                label: 'Gemini',
                endpoint: 'https://generativelanguage.googleapis.com/v1beta/interactions',
            },
            claude: {
                label: 'Claude',
                endpoint: 'https://api.anthropic.com/v1/messages',
            },
            grok: {
                label: 'Grok',
                endpoint: 'https://api.x.ai/v1/chat/completions',
            },
            qwen: {
                label: 'Qwen / DashScope',
                endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            },
            zhipu: {
                label: '智谱 GLM',
                endpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
            },
            'openai-compatible': {
                label: 'OpenAI 兼容',
                endpoint: '',
            },
        }),
        defaultVisionConfig = {
            activeProvider: 'gemini',
            providers: Object.fromEntries(
                Object.entries(VISION_PROVIDERS_2).map(([provider_2, meta]) => [
                    provider_2,
                    {
                        endpoint: meta.endpoint,
                        apiKey: '',
                        model: '',
                        models: [],
                    },
                ]),
            ),
        },
        TTS_PROVIDER_IDS = Object.freeze([
            'minimax',
            'openai',
            'openai-compatible',
            'elevenlabs',
            'fish-audio',
            'azure',
            'google',
            'aws-polly',
            'volcengine',
            'dashscope',
            'tencent',
            'baidu',
            'xfyun',
        ]),
        defaultTtsConfig = {
            activeProvider: 'minimax',
            providers: {},
        },
        defaultUserState = {
            name: '',
            phone: '',
            persona: '',
            avatarUrl: null,
        };
    function safeLoad(key_2, fallback) {
        try {
            if (window.StorageManager && typeof window.StorageManager.load === 'function')
                return window.StorageManager.load(key_2, fallback);
            return fallback;
        } catch (value_59) {
            return (
                console.warn('[bootstrap_globals] Failed to load ' + key_2 + ':', value_59),
                fallback
            );
        }
    }
    function handleAction_10(value_2) {
        const normalized = sanitizeApiConfig_2({
            ...defaultApiConfig,
            ...(value_2 && typeof value_2 === 'object' ? value_2 : {}),
        });
        if (normalized.endpoint)
            try {
                normalized.endpoint = normalizeApiEndpoint_2(
                    normalized.endpoint,
                    normalized.provider,
                );
            } catch (value_62) {}
        return normalized;
    }
    function normalizeVectorMemoryConfig_2(value_63) {
        const source =
                value_63 && typeof value_63 === 'object' && !Array.isArray(value_63)
                    ? value_63
                    : {},
            isLegacyConfig =
                !source.provider &&
                [
                    'namespace',
                    'embeddingModel',
                    'embeddingDimensions',
                    'embeddingRevision',
                    'topK',
                    'timeoutMs',
                ].some((key_3) => Object.prototype.hasOwnProperty.call(source, key_3)),
            rawProvider = String(source.provider || defaultVectorMemoryConfig.provider)
                .trim()
                .toLowerCase(),
            provider_3 = Object.prototype.hasOwnProperty.call(
                VECTOR_MEMORY_PROVIDERS_2,
                rawProvider,
            )
                ? rawProvider
                : defaultVectorMemoryConfig.provider;
        let endpoint_2 = String(source.endpoint || '').trim();
        if (endpoint_2)
            try {
                endpoint_2 = parseHttpUrl_2(endpoint_2).toString().replace(/\/+$/, '');
            } catch (value_71) {
                endpoint_2 = '';
            }
        const providerMeta = VECTOR_MEMORY_PROVIDERS_2[provider_3];
        return {
            enabled: !isLegacyConfig && source.enabled === true,
            provider: provider_3,
            endpoint: provider_3 === 'openai-compatible' ? endpoint_2.slice(0, 1024) : '',
            apiKey: !isLegacyConfig
                ? String(source.apiKey || '')
                      .trim()
                      .slice(0, 512)
                : '',
            model: String(source.model || providerMeta.defaultModel || '')
                .trim()
                .slice(0, 256),
        };
    }
    function normalizeTtsConfig(value_72) {
        const source_2 =
                value_72 && typeof value_72 === 'object' && !Array.isArray(value_72)
                    ? value_72
                    : {},
            isLegacyMinimaxConfig =
                !source_2.providers &&
                [
                    'region',
                    'customEndpointEnabled',
                    'endpoint',
                    'apiKey',
                    'groupId',
                    'ttsModel',
                ].some((key_4) => Object.prototype.hasOwnProperty.call(source_2, key_4)),
            legacyMinimax = isLegacyMinimaxConfig ? source_2 : {},
            sourceProviders =
                source_2.providers && typeof source_2.providers === 'object'
                    ? source_2.providers
                    : {},
            providers_2 = {};
        TTS_PROVIDER_IDS.forEach((provider_4) => {
            const saved =
                sourceProviders[provider_4] && typeof sourceProviders[provider_4] === 'object'
                    ? sourceProviders[provider_4]
                    : {};
            providers_2[provider_4] = {
                ...saved,
            };
        });
        if (isLegacyMinimaxConfig) {
            const region_2 = legacyMinimax.region === 'intl' ? 'intl' : 'cn';
            providers_2.minimax = {
                region: region_2,
                endpoint: legacyMinimax.customEndpointEnabled
                    ? String(legacyMinimax.endpoint || '').trim()
                    : region_2 === 'intl'
                      ? 'https://api.minimax.io'
                      : 'https://api.minimax.chat',
                apiKey: String(legacyMinimax.apiKey || '').trim(),
                groupId: String(legacyMinimax.groupId || '').trim(),
                model: String(legacyMinimax.ttsModel || '').trim(),
                models: [],
            };
        }
        const activeProvider_2 = TTS_PROVIDER_IDS.includes(source_2.activeProvider)
            ? source_2.activeProvider
            : 'minimax';
        return {
            ...defaultTtsConfig,
            activeProvider: activeProvider_2,
            providers: providers_2,
        };
    }
    function normalizeImageGenerationConfig(value_81) {
        const value_82 = value_81 && typeof value_81 === 'object' ? value_81 : {},
            value_83 =
                value_82.providers && typeof value_82.providers === 'object'
                    ? value_82.providers
                    : {},
            providers_3 = {},
            normalizeImageModels = (value_87) => {
                const value_88 = new Set();
                return (Array.isArray(value_87) ? value_87 : [])
                    .map((value_89) =>
                        String(value_89 || '')
                            .trim()
                            .slice(0, 256),
                    )
                    .filter(
                        (value_90) =>
                            value_90 && !value_88.has(value_90) && (value_88.add(value_90) || true),
                    )
                    .slice(0, 100);
            };
        Object.keys(defaultImageGenerationConfig.providers).forEach((provider_5) => {
            const defaults = defaultImageGenerationConfig.providers[provider_5],
                saved_2 =
                    value_83[provider_5] && typeof value_83[provider_5] === 'object'
                        ? value_83[provider_5]
                        : {};
            providers_3[provider_5] = {
                endpoint: String(saved_2.endpoint ?? defaults.endpoint).trim(),
                apiKey: String(saved_2.apiKey ?? defaults.apiKey).trim(),
                model: String(saved_2.model ?? defaults.model).trim(),
                size: ['1024x1024', '1024x1536', '1536x1024'].includes(saved_2.size)
                    ? saved_2.size
                    : defaults.size,
                models: normalizeImageModels(saved_2.models),
            };
        });
        const activeProvider_3 = Object.prototype.hasOwnProperty.call(
            providers_3,
            value_82.activeProvider,
        )
            ? value_82.activeProvider
            : defaultImageGenerationConfig.activeProvider;
        return {
            activeProvider: activeProvider_3,
            providers: providers_3,
        };
    }
    function normalizeVisionConfig_2(value_94) {
        const value_95 =
                value_94 && typeof value_94 === 'object' && !Array.isArray(value_94)
                    ? value_94
                    : {},
            sourceProviders_2 =
                value_95.providers && typeof value_95.providers === 'object'
                    ? value_95.providers
                    : {},
            normalizeModels = (value_99) => {
                const value_100 = new Set();
                return (Array.isArray(value_99) ? value_99 : [])
                    .map((value_101) =>
                        String(value_101 || '')
                            .trim()
                            .slice(0, 256),
                    )
                    .filter(
                        (value_102) =>
                            value_102 &&
                            !value_100.has(value_102) &&
                            (value_100.add(value_102) || true),
                    )
                    .slice(0, 100);
            },
            providers_4 = {};
        Object.entries(VISION_PROVIDERS_2).forEach(([provider_6, meta_2]) => {
            const saved_3 =
                sourceProviders_2[provider_6] && typeof sourceProviders_2[provider_6] === 'object'
                    ? sourceProviders_2[provider_6]
                    : {};
            providers_4[provider_6] = {
                endpoint: String(saved_3.endpoint ?? meta_2.endpoint)
                    .trim()
                    .slice(0, 1024),
                apiKey: String(saved_3.apiKey || '')
                    .trim()
                    .slice(0, 512),
                model: String(saved_3.model || '')
                    .trim()
                    .slice(0, 256),
                models: normalizeModels(saved_3.models),
            };
        });
        const activeProvider_4 = Object.prototype.hasOwnProperty.call(
            providers_4,
            value_95.activeProvider,
        )
            ? value_95.activeProvider
            : defaultVisionConfig.activeProvider;
        return {
            activeProvider: activeProvider_4,
            providers: providers_4,
        };
    }
    function handleAction_15(key_5, value_3) {
        try {
            if (window.StorageManager && typeof window.StorageManager.save === 'function') {
                window.StorageManager.save(key_5, value_3);
                return;
            }
            console.warn('[bootstrap_globals] StorageManager unavailable for ' + key_5);
        } catch (value_108) {
            console.warn('[bootstrap_globals] Failed to save ' + key_5 + ':', value_108);
        }
    }
    function resolveUserStateFromAccounts() {
        const accounts = safeLoad('u2_accounts', []),
            currentAccountId = safeLoad('u2_currentAccountId', null);
        if (Array.isArray(accounts) && currentAccountId != null) {
            const account = accounts.find((item) => String(item.id) === String(currentAccountId));
            if (account)
                return {
                    name: account.name || '',
                    phone: account.phone || '',
                    persona: account.persona || account.signature || '',
                    avatarUrl: account.avatarUrl || null,
                };
        }
        return {
            ...defaultUserState,
        };
    }
    window.apiConfig = handleAction_10(
        window.apiConfig || safeLoad('u2_apiConfig', defaultApiConfig),
    );
    window.vectorMemoryConfig = normalizeVectorMemoryConfig_2(
        window.vectorMemoryConfig || safeLoad('u2_vectorMemoryConfig', defaultVectorMemoryConfig),
    );
    window.imageGenerationConfig = normalizeImageGenerationConfig(
        window.imageGenerationConfig ||
            safeLoad('u2_imageGenerationConfig', defaultImageGenerationConfig),
    );
    window.visionConfig = normalizeVisionConfig_2(
        window.visionConfig || safeLoad('u2_visionConfig', defaultVisionConfig),
    );
    const storedTtsConfig = safeLoad('u2_ttsConfig', null),
        storedLegacyMinimaxConfig = safeLoad('u2_minimaxConfig', null);
    window.ttsConfig = normalizeTtsConfig(
        window.ttsConfig || storedTtsConfig || storedLegacyMinimaxConfig,
    );
    window.userState = {
        ...defaultUserState,
        ...(window.userState && typeof window.userState === 'object'
            ? window.userState
            : resolveUserStateFromAccounts()),
    };
    window.getApiConfig = function value_111() {
        return (
            (window.apiConfig = handleAction_10(
                window.apiConfig || safeLoad('u2_apiConfig', defaultApiConfig),
            )),
            window.apiConfig
        );
    };
    window.getVectorMemoryConfig = function value_112() {
        return (
            (window.vectorMemoryConfig = normalizeVectorMemoryConfig_2(
                window.vectorMemoryConfig ||
                    safeLoad('u2_vectorMemoryConfig', defaultVectorMemoryConfig),
            )),
            window.vectorMemoryConfig
        );
    };
    window.getImageGenerationConfig = function value_113() {
        return (
            (window.imageGenerationConfig = normalizeImageGenerationConfig(
                window.imageGenerationConfig,
            )),
            window.imageGenerationConfig
        );
    };
    window.getActiveImageGenerationConfig = function getActiveImageGenerationConfig_2() {
        const config_2 = window.getImageGenerationConfig();
        return {
            provider: config_2.activeProvider,
            ...(config_2.providers[config_2.activeProvider] || {}),
        };
    };
    window.getVisionConfig = function value_116() {
        return (
            (window.visionConfig = normalizeVisionConfig_2(
                window.visionConfig || safeLoad('u2_visionConfig', defaultVisionConfig),
            )),
            window.visionConfig
        );
    };
    window.getActiveVisionConfig = function getActiveVisionConfig_2() {
        const config_3 = window.getVisionConfig();
        return {
            provider: config_3.activeProvider,
            ...(config_3.providers[config_3.activeProvider] || {}),
        };
    };
    window.getTtsConfig = function value_119() {
        return (
            (window.ttsConfig = normalizeTtsConfig(
                window.ttsConfig || safeLoad('u2_ttsConfig', storedLegacyMinimaxConfig),
            )),
            window.ttsConfig
        );
    };
    window.getUserState = function value_120() {
        return (
            (!window.userState || typeof window.userState !== 'object') &&
                (window.userState = resolveUserStateFromAccounts()),
            window.userState
        );
    };
    const INTERNAL_SILENT_ERROR_HEADER_2 = 'X-U2-Silent-Errors',
        INTERNAL_GLOBAL_ERROR_HEADER_2 = 'X-U2-Global-Errors';
    function parseHttpUrl_2(value_4, value_122 = '接口地址') {
        const text_2 = String(value_4 || '').trim();
        if (!text_2) throw new Error('请填写' + value_122);
        let parsed;
        try {
            parsed = new URL(text_2);
        } catch (value_125) {
            throw new Error(value_122 + '格式无效');
        }
        if (!['http:', 'https:'].includes(parsed.protocol))
            throw new Error(value_122 + '仅支持 HTTP 或 HTTPS');
        return parsed;
    }
    function trimTrailingSlashes(pathname_2) {
        const trimmed = String(pathname_2 || '').replace(/\/+$/, '');
        return trimmed || '/';
    }
    function normalizeApiProvider_2(value_5) {
        const provider_7 = String(value_5 || '')
            .trim()
            .toLowerCase();
        return API_PROVIDERS.includes(provider_7) ? provider_7 : defaultApiConfig.provider;
    }
    function isGeminiProvider(provider_8) {
        return normalizeApiProvider_2(provider_8) === 'gemini';
    }
    function isAnthropicProvider(provider_9) {
        return normalizeApiProvider_2(provider_9) === 'anthropic';
    }
    function detectApiProviderFromEndpoint_2(endpoint_3) {
        try {
            const hostname_2 = parseHttpUrl_2(endpoint_3).hostname.toLowerCase();
            if (hostname_2 === 'generativelanguage.googleapis.com') return 'gemini';
            if (hostname_2 === 'api.anthropic.com') return 'anthropic';
        } catch (error_2) {}
        return 'openai-compatible';
    }
    function normalizeNativeApiEndpoint(value_134, value_135) {
        const httpUrl_21 = parseHttpUrl_2(value_134),
            apiProvider_22 = normalizeApiProvider_2(value_135);
        let pathname_3 = trimTrailingSlashes(httpUrl_21.pathname);
        httpUrl_21.search = '';
        httpUrl_21.hash = '';
        if (isGeminiProvider(apiProvider_22))
            pathname_3 = pathname_3
                .replace(/\/chat\/completions$/i, '')
                .replace(/\/models\/[^/]+:(?:generateContent|streamGenerateContent)$/i, '');
        else
            isAnthropicProvider(apiProvider_22) &&
                (pathname_3 = pathname_3.replace(/\/(?:chat\/completions|messages|models)$/i, ''));
        return ((httpUrl_21.pathname = pathname_3), httpUrl_21.toString());
    }
    function normalizeApiEndpoint_2(endpoint_4, provider_10) {
        const resolvedProvider = normalizeApiProvider_2(
            provider_10 || detectApiProviderFromEndpoint_2(endpoint_4),
        );
        if (isGeminiProvider(resolvedProvider) || isAnthropicProvider(resolvedProvider))
            return normalizeNativeApiEndpoint(endpoint_4, resolvedProvider);
        return resolveChatCompletionsEndpoint_2(endpoint_4);
    }
    function resolveChatCompletionsEndpoint_2(value_140) {
        const httpUrl_21_141 = parseHttpUrl_2(value_140),
            pathname_5 = trimTrailingSlashes(httpUrl_21_141.pathname);
        if (/\/chat\/completions$/i.test(pathname_5)) httpUrl_21_141.pathname = pathname_5;
        else
            /\/v\d+(?:[a-z0-9._-]*)?$/i.test(pathname_5)
                ? (httpUrl_21_141.pathname = pathname_5 + '/chat/completions')
                : (httpUrl_21_141.pathname =
                      (pathname_5 === '/' ? '' : pathname_5) + '/v1/chat/completions');
        return httpUrl_21_141.toString();
    }
    function resolveModelsEndpoint_2(value_143) {
        const parsed_2 = parseHttpUrl_2(value_143),
            pathname_4 = trimTrailingSlashes(parsed_2.pathname),
            detectApiProviderFromEndpoint_23_146 = detectApiProviderFromEndpoint_2(value_143);
        parsed_2.search = '';
        parsed_2.hash = '';
        if (isGeminiProvider(detectApiProviderFromEndpoint_23_146))
            return (
                (parsed_2.pathname = (
                    pathname_4.replace(/\/chat\/completions$/i, '') + '/models'
                ).replace(/\/\/+/g, '/')),
                parsed_2.toString()
            );
        if (isAnthropicProvider(detectApiProviderFromEndpoint_23_146)) {
            const basePath = pathname_4.replace(/\/(?:chat\/completions|messages)$/i, '');
            return (
                (parsed_2.pathname = (basePath + '/models').replace(/\/\/+/g, '/')),
                parsed_2.toString()
            );
        }
        if (/\/models$/i.test(pathname_4)) parsed_2.pathname = pathname_4;
        else {
            if (/\/chat\/completions$/i.test(pathname_4))
                parsed_2.pathname = pathname_4.replace(/\/chat\/completions$/i, '/models');
            else
                /\/v\d+(?:[a-z0-9._-]*)?$/i.test(pathname_4)
                    ? (parsed_2.pathname = pathname_4 + '/models')
                    : (parsed_2.pathname = (pathname_4 === '/' ? '' : pathname_4) + '/v1/models');
        }
        return parsed_2.toString();
    }
    function sanitizeApiConfig_2(apk120Value170) {
  const apk120Value171 = apk120Value170 && typeof apk120Value170 === "object" ? apk120Value170 : {},
    apk120Value172 = Number.parseFloat(apk120Value171.temperature),
    apk120Value173 = Number.parseFloat(apk120Value171.frequencyPenalty);
  return {
    'provider': normalizeApiProvider_2(apk120Value171.provider),
    'endpoint': String(apk120Value171.endpoint || '').trim(),
    'apiKey': String(apk120Value171.apiKey || '').trim(),
    'model': String(apk120Value171.model || '').trim(),
    'temperature': Number.isFinite(apk120Value172) ? Math.max(0x0, Math.min(0x2, apk120Value172)) : 0.7,
    'frequencyPenalty': Number.isFinite(apk120Value173) ? Math.max(-0x2, Math.min(0x2, apk120Value173)) : 0x0,
    'streamEnabled': apk120Value171.streamEnabled === !![]
  };
}
    function validateApiConfig_2(value_6, options_2 = {}) {
        const config = sanitizeApiConfig_2(value_6);
        parseHttpUrl_2(config.endpoint);
        if (!config.apiKey) throw new Error('请填写 API 密钥');
        if (options_2.requireModel !== false && !config.model) throw new Error('请填写模型名称');
        return config;
    }
    function buildApiHeaders_2(apk120Value177, apk120Value178 = {}) {
  const apk120Value179 = String(apk120Value177?.endpoint || ''),
    apk120Value180 = normalizeApiProvider_2(apk120Value177?.provider || detectApiProviderFromEndpoint_2(apk120Value179)),
    apk120Value181 = new Headers({
      'Content-Type': 'application/json',
      ...apk120Value178
    });
  apk120Value181.set("X-U2-Stream-Enabled", apk120Value177?.streamEnabled === !![] ? '1' : '0');
  if (isGeminiProvider(apk120Value180)) apk120Value181.set('x-goog-api-key', String(apk120Value177?.apiKey || ''));else {
    if (isAnthropicProvider(apk120Value180)) apk120Value181.set('x-api-key', String(apk120Value177?.apiKey || '')), apk120Value181.set("anthropic-version", '2023-06-01');else /\.openai\.azure\.com(?=\/|$)/i.test(apk120Value179) ? apk120Value181.set("api-key", String(apk120Value177?.apiKey || '')) : apk120Value181.set("Authorization", 'Bearer\x20' + String(apk120Value177?.apiKey || ''));
  }
  const apk120Value182 = Number.parseFloat(apk120Value177?.frequencyPenalty),
    apk120Value183 = Number.isFinite(apk120Value182) ? Math.max(-0x2, Math.min(0x2, apk120Value182)) : 0x0;
  return !isGeminiProvider(apk120Value180) && !isAnthropicProvider(apk120Value180) && apk120Value183 !== 0x0 && apk120Value181.set(text_33, String(apk120Value183)), Object.fromEntries(apk120Value181.entries());
}
    async function readApiError_2(value_159) {
        let rawBody_2 = '';
        try {
            rawBody_2 = await value_159.clone().text();
        } catch (value_162) {
            rawBody_2 = '';
        }
        let detail_2 = rawBody_2;
        try {
            const parsed_3 = JSON.parse(rawBody_2);
            detail_2 =
                parsed_3?.error?.message || parsed_3?.message || parsed_3?.error || rawBody_2;
        } catch (value_164) {}
        return {
            status: value_159.status,
            statusText: value_159.statusText || '',
            rawBody: rawBody_2,
            message: String(detail_2 || 'HTTP ' + value_159.status),
        };
    }
    window.u2Api = Object.freeze({
        INTERNAL_SILENT_ERROR_HEADER: INTERNAL_SILENT_ERROR_HEADER_2,
        INTERNAL_GLOBAL_ERROR_HEADER: INTERNAL_GLOBAL_ERROR_HEADER_2,
        parseHttpUrl: parseHttpUrl_2,
        normalizeApiProvider: normalizeApiProvider_2,
        detectApiProviderFromEndpoint: detectApiProviderFromEndpoint_2,
        normalizeApiEndpoint: normalizeApiEndpoint_2,
        resolveChatCompletionsEndpoint: resolveChatCompletionsEndpoint_2,
        resolveModelsEndpoint: resolveModelsEndpoint_2,
        sanitizeApiConfig: sanitizeApiConfig_2,
        VECTOR_MEMORY_PROVIDERS: VECTOR_MEMORY_PROVIDERS_2,
        normalizeVectorMemoryConfig: normalizeVectorMemoryConfig_2,
        VISION_PROVIDERS: VISION_PROVIDERS_2,
        normalizeVisionConfig: normalizeVisionConfig_2,
        validateApiConfig: validateApiConfig_2,
        buildApiHeaders: buildApiHeaders_2,
        readApiError: readApiError_2,
        createHttpError: createHttpError_2,
        isRequestError: isRequestError_2,
        reportError: reportError_2,
        fetchChatCompletion: fetchChatCompletion_2,
    });
    const originalFetch = window.fetch,
        text_33 = 'X-U2-Frequency-Penalty';
    const API_STREAM_HEADER_120 = 'X-U2-Stream-Enabled';
function applyApiStreamMode_120(apk120Value190, apk120Value191, apk120Value192, apk120Value193, apk120Value194) {
  if (!apk120Value192 || !Array.isArray(apk120Value192.messages) || !apk120Value192.messages.some(Boolean)) return null;
  if (typeof apk120Value194 === 'boolean') return apk120Value192.stream = apk120Value194, apk120Value194;
  const apk120Value195 = apk120Value191.get(API_STREAM_HEADER_120);
  if (apk120Value193 || apk120Value195 !== null) return apk120Value192.stream = apk120Value193 ? apk120Value193.streamEnabled === !![] : apk120Value195 === '1', apk120Value192.stream;
  const apk120Value196 = window.getApiConfig?.();
  if (apk120Value196?.endpoint && String(apk120Value192.model || '') === apk120Value196.model) try {
    const apk120Value197 = new Headers(buildApiHeaders_2(apk120Value196)),
      apk120Value198 = ["Authorization", 'api-key', "x-api-key", "x-goog-api-key"].every(apk120Value199 => (apk120Value197.get(apk120Value199) || '') === (apk120Value191.get(apk120Value199) || ''));
    if (apk120Value198 && normalizeApiEndpoint_2(apk120Value196.endpoint, apk120Value196.provider) === apk120Value190) return apk120Value192.stream = apk120Value196.streamEnabled === !![], apk120Value192.stream;
  } catch (apk120Value200) {}
  return null;
}
    function fetchChatCompletion_2(apk120Value201, apk120Value202 = {}) {
  const apk120Value203 = apk120Value202 && typeof apk120Value202 === "object" ? apk120Value202 : {},
    apk120Value204 = apk120Value203.body && typeof apk120Value203.body === 'object' && !Array.isArray(apk120Value203.body) ? {
      ...apk120Value203.body
    } : apk120Value203.body;
  if (!apk120Value204 || typeof apk120Value204 !== "object" || Array.isArray(apk120Value204)) return window.fetch(apk120Value201, apk120Value203);
  const apk120Value205 = apk120Value203.apiConfig && typeof apk120Value203.apiConfig === "object" ? sanitizeApiConfig_2(apk120Value203.apiConfig) : null,
    apk120Value206 = apk120Value203.headers instanceof Headers ? new Headers(apk120Value203.headers) : new Headers(apk120Value203.headers || (apk120Value205 ? buildApiHeaders_2(apk120Value205) : {})),
    apk120Value207 = apk120Value206.get(INTERNAL_SILENT_ERROR_HEADER_2) === '1',
    apk120Value208 = apk120Value206.get(INTERNAL_GLOBAL_ERROR_HEADER_2) === '1',
    apk120Value209 = apk120Value205 ? apk120Value205.frequencyPenalty : apk120Value206.get(text_33),
    apk120Value210 = apk120Value204.stream === !![];
  applyApiStreamMode_120(String(apk120Value201 || ''), apk120Value206, apk120Value204, apk120Value205, apk120Value203.streamOverride), apk120Value206['delete'](API_STREAM_HEADER_120), apk120Value206["delete"](INTERNAL_SILENT_ERROR_HEADER_2), apk120Value206["delete"](INTERNAL_GLOBAL_ERROR_HEADER_2), apk120Value206["delete"](text_33);
  let apk120Value211 = String(apk120Value201 || '');
  if (/\.openai\.azure\.com(?=\/|$)/i.test(apk120Value211)) {
    const apk120Value215 = String(apk120Value206.get("Authorization") || '').match(/^Bearer\s+(.+)$/i)?.[0x1] || '';
    if (apk120Value215 && !apk120Value206.has('api-key')) apk120Value206.set("api-key", apk120Value215);
    apk120Value206["delete"]("Authorization");
  }
  const apk120Value212 = apk120Value205?.provider || '';
  !isGeminiProvider(apk120Value212) && !isAnthropicProvider(apk120Value212) && handleAction_54(apk120Value211, apk120Value206, apk120Value204, apk120Value209);
  const apk120Value213 = createNativeRequestAdapter(apk120Value211, apk120Value206, apk120Value204, apk120Value212);
  if (apk120Value213) apk120Value211 = apk120Value213.url;
  const apk120Value214 = {
    ...apk120Value203
  };
  return delete apk120Value214.apiConfig, delete apk120Value214.streamOverride, apk120Value214.headers = apk120Value206, apk120Value214.body = JSON.stringify(apk120Value213 ? apk120Value213.body : apk120Value204), handleAction_55([apk120Value211, apk120Value214], {
    'nativeAdapter': apk120Value213,
    'responseStream': apk120Value210,
    'silentErrors': apk120Value207,
    'showGlobalErrors': apk120Value208,
    'isAiApiRequest': !![],
    'signal': apk120Value214.signal
  });
}
    function createHttpError_2(value_179, value_180, value_181 = 'API 请求失败') {
        const value_182 = new Error(
            String(value_180?.message || value_181 + '（HTTP ' + value_179.status + '）'),
        );
        return (
            (value_182.name = 'ApiHttpError'),
            (value_182.status = Number(value_180?.status || value_179.status) || 0),
            (value_182.statusText = String(value_180?.statusText || value_179.statusText || '')),
            (value_182.rawBody = String(value_180?.rawBody || '')),
            (value_182.apiDetail = String(value_180?.message || '')),
            value_182
        );
    }
    function isRequestError_2(value_183) {
        return (
            Number(value_183?.status) > 0 ||
            ['ApiHttpError', 'ApiResponseError', 'TimeoutError'].includes(value_183?.name) ||
            (value_183?.name === 'TypeError' &&
                /(?:failed to fetch|networkerror|cors)/i.test(String(value_183?.message || ''))) ||
            [
                'network',
                'http_error',
                'api_error',
                'api_timeout',
                'invalid_api_response',
                'empty_response',
            ].includes(value_183?.code) ||
            /\bHTTP\s*\d{3}\b|(?:API|接口).*(?:超时|请求失败|返回内容)|(?:failed to fetch|networkerror|cors|无法连接)/i.test(
                String(value_183?.message || ''),
            )
        );
    }
    function handleAction_37(value_7) {
        let text_3 = String(value_7 || '').trim();
        if (!text_3) return '';
        try {
            const result_186 = JSON.parse(text_3);
            text_3 = String(
                result_186?.error?.message ||
                    result_186?.message ||
                    result_186?.detail ||
                    result_186?.error ||
                    text_3,
            );
        } catch (value_187) {}
        return (
            (text_3 = text_3
                .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
                .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\bBearer\s+[^\s"',}]+/gi, 'Bearer [已隐藏]')
                .replace(/\b(?:sk|rk|pk|sess)-[A-Za-z0-9._-]{6,}\b/gi, '[已隐藏的密钥]')
                .replace(/([?&](?:api[_-]?key|key|token)=)[^&\s]+/gi, '$1[已隐藏]')
                .replace(
                    /((?:api[_ -]?key|x-api-key|x-goog-api-key|authorization)\s*[:=]\s*["']?)[^"',}\s]+/gi,
                    '$1[已隐藏]',
                )
                .replace(/\s+/g, ' ')
                .trim()),
            text_3.length > 500 ? text_3.slice(0, 500) + '…' : text_3
        );
    }
    function handleAction_38(value_188) {
        const status_2 =
                Number(value_188?.status || value_188?.response?.status) ||
                Number(/\bHTTP\s*(\d{3})\b/i.exec(String(value_188?.message || ''))?.[1]) ||
                0,
            detail_3 = handleAction_37(
                value_188?.apiDetail ||
                    value_188?.rawBody ||
                    value_188?.detail ||
                    value_188?.message,
            ),
            value_191 =
                value_188?.name === 'TimeoutError' ||
                value_188?.code === 'timeout' ||
                /(?:timed? out|超时)/i.test(String(value_188?.message || '')),
            value_192 =
                value_188?.name === 'TypeError' ||
                value_188?.code === 'network' ||
                /(?:failed to fetch|networkerror|cors|无法连接)/i.test(
                    String(value_188?.message || ''),
                ),
            options_193 = {
                400: [
                    '请求参数或上下文可能不符合当前模型要求。',
                    '检查模型名称与参数；若上下文过长，减少消息或记忆后重试。',
                ],
                401: [
                    'API 密钥可能无效、过期或未正确填写。',
                    '检查密钥和对应的服务商，更新后重试。',
                ],
                402: [
                    '服务商账户可能需要充值，或可用额度已经耗尽。',
                    '检查账户余额与额度，或改用其他 API 预设。',
                ],
                403: [
                    '当前密钥可能没有模型权限；中转站余额、额度或账户状态也可能导致拒绝。',
                    '检查站点余额与模型权限，或更换模型、API 预设后重试。',
                ],
                404: [
                    '接口地址或模型名称可能不存在。',
                    '核对接口地址和模型名称，或重新获取模型列表。',
                ],
                408: ['服务商处理请求的时间过长。', '稍后重试；若经常发生，可换一个模型。'],
                413: [
                    '发送给模型的内容可能超过接口允许的大小。',
                    '缩短聊天上下文或减少附件后重试。',
                ],
                422: [
                    '接口无法处理当前请求参数或内容。',
                    '检查模型及参数设置，调整输入内容后重试。',
                ],
                429: [
                    '请求可能过于频繁，也可能达到并发或额度限制。',
                    '稍后重试，并检查服务商额度；必要时更换模型或预设。',
                ],
            };
        let reason_3, advice_2;
        if (options_193[status_2]) [reason_3, advice_2] = options_193[status_2];
        else {
            if (status_2 >= 500 && status_2 <= 599)
                [reason_3, advice_2] = [
                    '服务商或中转站暂时无法完成请求。',
                    '稍后重试；若持续失败，可更换模型或 API 预设。',
                ];
            else {
                if (value_191)
                    [reason_3, advice_2] = [
                        '接口长时间没有返回结果。',
                        '稍后重试，或尝试响应更快的模型。',
                    ];
                else {
                    if (value_192)
                        [reason_3, advice_2] = [
                            '设备暂时无法连接到 API 接口。',
                            '检查网络、接口地址、代理或跨域设置后重试。',
                        ];
                    else {
                        if (
                            /(?:请.*(?:配置|填写).*(?:API|密钥|模型|接口)|API.*(?:未配置|配置不完整))/i.test(
                                String(value_188?.message || ''),
                            )
                        )
                            [reason_3, advice_2] = [
                                'API 配置可能不完整。',
                                '填写接口地址、密钥和模型后重试。',
                            ];
                        else
                            [reason_3, advice_2] = [
                                '接口没有完成这次请求，暂时无法确定具体原因。',
                                '稍后重试，并检查 API 配置或接口详情。',
                            ];
                    }
                }
            }
        }
        return {
            status: status_2,
            detail: detail_3,
            label: status_2
                ? 'HTTP ' + status_2
                : value_191
                  ? '请求超时'
                  : value_192
                    ? '连接失败'
                    : '请求失败',
            reason: reason_3,
            advice: advice_2,
        };
    }
    const items = [],
        value = new Map();
    let value_39 = null;
    function handleAction_40() {
        if (value_39 || !items.length || !document.body) return;
        const { operation: operation_2, info: info_2 } = items.shift(),
            activeElement_198 = document.activeElement,
            overlay = document.createElement('div');
        overlay.id = 'global-api-error-overlay';
        overlay.className = 'api-error-overlay';
        const element_199 = document.createElement('section');
        element_199.className = 'api-error-modal';
        element_199.setAttribute('role', 'alertdialog');
        element_199.setAttribute('aria-modal', 'true');
        element_199.setAttribute('aria-labelledby', 'api-error-title');
        element_199.setAttribute('aria-describedby', 'api-error-reason api-error-advice');
        const content_2 = document.createElement('div');
        content_2.className = 'api-error-content';
        const element_201 = document.createElement('header');
        element_201.className = 'api-error-note-header';
        const element_202 = document.createElement('span');
        element_202.className = 'api-error-kicker';
        element_202.textContent = 'API_ERROR';
        const element_203 = document.createElement('div');
        element_203.className = 'api-error-status';
        element_203.textContent = info_2.label;
        const titleEl = document.createElement('h2');
        titleEl.id = 'api-error-title';
        titleEl.className = 'api-error-title';
        titleEl.textContent = operation_2 + '失败';
        element_201.append(element_202, element_203, titleEl);
        const content_3 = document.createElement('section');
        content_3.className = 'api-error-section';
        const titleEl_2 = document.createElement('div');
        titleEl_2.className = 'api-error-section-label';
        titleEl_2.textContent = '可能原因';
        const messageEl = document.createElement('p');
        messageEl.id = 'api-error-reason';
        messageEl.className = 'api-error-message';
        messageEl.textContent = info_2.reason;
        content_3.append(titleEl_2, messageEl);
        const content_4 = document.createElement('section');
        content_4.className = 'api-error-section';
        const titleEl_3 = document.createElement('div');
        titleEl_3.className = 'api-error-section-label';
        titleEl_3.textContent = '可以尝试';
        const messageEl_2 = document.createElement('p');
        messageEl_2.id = 'api-error-advice';
        messageEl_2.className = 'api-error-message';
        messageEl_2.textContent = info_2.advice;
        content_4.append(titleEl_3, messageEl_2);
        content_2.append(element_201, content_3, content_4);
        if (info_2.detail) {
            const rawWrapper = document.createElement('details');
            rawWrapper.className = 'api-error-raw-wrapper';
            const titleEl_4 = document.createElement('summary');
            titleEl_4.textContent = '接口详情';
            const rawEl = document.createElement('pre');
            rawEl.className = 'api-error-raw';
            rawEl.textContent = info_2.detail;
            rawWrapper.append(titleEl_4, rawEl);
            content_2.appendChild(rawWrapper);
        }
        const button = document.createElement('button');
        button.className = 'api-error-button';
        button.type = 'button';
        button.textContent = '知道了';
        let enabled_212 = false;
        const handleClick = () => {
                if (enabled_212) return;
                enabled_212 = true;
                overlay.classList.remove('show');
                overlay.removeEventListener('keydown', handleKeydown);
                setTimeout(() => {
                    overlay.remove();
                    value_39 = null;
                    if (activeElement_198?.isConnected) activeElement_198.focus?.();
                    handleAction_40();
                }, 250);
            },
            handleKeydown = (event) => {
                event.key === 'Escape' && (event.preventDefault(), handleClick());
                if (event.key === 'Tab') {
                    const result_2 = Array.from(element_199.querySelectorAll('button, summary')),
                        value_219 = result_2[0],
                        last = result_2[result_2.length - 1];
                    if (event.shiftKey && document.activeElement === value_219) {
                        event.preventDefault();
                        last?.focus();
                    } else
                        !event.shiftKey &&
                            document.activeElement === last &&
                            (event.preventDefault(), value_219?.focus());
                }
            };
        button.addEventListener('click', handleClick);
        overlay.addEventListener('keydown', handleKeydown);
        element_199.append(content_2, button);
        overlay.appendChild(element_199);
        document.body.appendChild(overlay);
        value_39 = overlay;
        overlay.getBoundingClientRect();
        overlay.classList.add('show');
        button.focus?.();
    }
    function reportError_2(value_221, value_222 = {}) {
        if (
            value_221?.name === 'AbortError' ||
            (value_222.signal?.aborted && value_221?.name !== 'TimeoutError')
        )
            return false;
        const operation_3 =
                String(value_222.operation || 'API 请求')
                    .trim()
                    .replace(/失败$/, '') || 'API 请求',
            info_3 = handleAction_38(value_221),
            value_225 = operation_3 + '|' + info_3.label + '|' + info_3.detail,
            now_226 = Date.now();
        for (const [value_227, value_228] of value)
            if (now_226 - value_228 > 1500) value['delete'](value_227);
        if (value.has(value_225)) return true;
        return (
            value.set(value_225, now_226),
            items.push({
                operation: operation_3,
                info: info_3,
            }),
            handleAction_40(),
            true
        );
    }
    function getMessageText(content_5) {
        if (typeof content_5 === 'string') return content_5;
        if (!Array.isArray(content_5)) return String(content_5 || '');
        return content_5
            .map((part) => {
                if (typeof part === 'string') return part;
                if (!part || typeof part !== 'object') return '';
                if (typeof part.text === 'string') return part.text;
                if (typeof part.content === 'string') return part.content;
                return '';
            })
            .filter(Boolean).join(`
`);
    }
    function getApiRequestMessages(body_2) {
        return Array.isArray(body_2?.messages) ? body_2.messages : [];
    }
    function getSystemInstruction(messages_2) {
        return messages_2
            .filter((message_2) =>
                ['system', 'developer'].includes(String(message_2?.role || '').toLowerCase()),
            )
            .map((message_3) => getMessageText(message_3?.content).trim())
            .filter(Boolean).join(`

`);
    }
    function handleAction_42(value_234, value_235) {
        return value_234.reduce((result_3, value_237) => {
            const mapped = value_235(value_237);
            if (!mapped) return result_3;
            const last_2 = result_3[result_3.length - 1];
            return (
                last_2 && last_2.role === mapped.role
                    ? last_2.parts.push(...mapped.parts)
                    : result_3.push(mapped),
                result_3
            );
        }, []);
    }
    function handleAction_43(apk120Value280) {
  const apk120Value281 = getApiRequestMessages(apk120Value280).filter(apk120Value287 => {
      const apk120Value288 = String(apk120Value287?.role || '').toLowerCase();
      return apk120Value288 !== 'system' && apk120Value288 !== "developer";
    }),
    apk120Value282 = handleAction_42(apk120Value281, apk120Value289 => {
      const apk120Value290 = String(apk120Value289?.role || '').toLowerCase(),
        apk120Value291 = [],
        apk120Value292 = getMessageText(apk120Value289?.content).trim();
      if (apk120Value292 && apk120Value290 !== "tool") apk120Value291.push({
        'text': apk120Value292
      });
      apk120Value290 === "assistant" && Array.isArray(apk120Value289?.tool_calls) && apk120Value289.tool_calls.forEach(apk120Value293 => {
        const apk120Value294 = String(apk120Value293?.['function']?.name || '').trim();
        if (!apk120Value294) return;
        let apk120Value295 = {};
        try {
          apk120Value295 = typeof apk120Value293["function"].arguments === "string" ? JSON.parse(apk120Value293["function"].arguments || '{}') : apk120Value293["function"].arguments || {};
        } catch (apk120Value296) {}
        apk120Value291.push({
          'functionCall': {
            'name': apk120Value294,
            'args': apk120Value295
          }
        });
      });
      if (apk120Value290 === "tool") {
        let apk120Value297 = apk120Value289?.content ?? '';
        try {
          apk120Value297 = JSON.parse(String(apk120Value297));
        } catch (apk120Value298) {}
        apk120Value291.push({
          'functionResponse': {
            'name': String(apk120Value289?.name || "mcp_tool"),
            'response': {
              'result': apk120Value297
            }
          }
        });
      }
      if (!apk120Value291.length) return null;
      return {
        'role': apk120Value290 === 'assistant' ? "model" : "user",
        'parts': apk120Value291
      };
    });
  if (!apk120Value282.length) apk120Value282.push({
    'role': "user",
    'parts': [{
      'text': ''
    }]
  });
  const apk120Value283 = {};
  if (Number.isFinite(Number(apk120Value280?.temperature))) apk120Value283.temperature = Number(apk120Value280.temperature);
  const apk120Value284 = Number(apk120Value280?.max_completion_tokens ?? apk120Value280?.max_tokens);
  if (Number.isFinite(apk120Value284) && apk120Value284 > 0x0) apk120Value283.maxOutputTokens = Math.round(apk120Value284);
  if (apk120Value280?.response_format?.type === "json_object") apk120Value283.responseMimeType = "application/json";
  const apk120Value285 = {
      'contents': apk120Value282
    },
    apk120Value286 = getSystemInstruction(getApiRequestMessages(apk120Value280));
  if (apk120Value286) apk120Value285.systemInstruction = {
    'parts': [{
      'text': apk120Value286
    }]
  };
  Array.isArray(apk120Value280?.tools) && apk120Value280.tools.length && (apk120Value285.tools = [{
    'functionDeclarations': apk120Value280.tools.map(apk120Value299 => ({
      'name': String(apk120Value299?.['function']?.name || '').slice(0x0, 0x40),
      'description': String(apk120Value299?.['function']?.description || '').slice(0x0, 0x1000),
      'parameters': apk120Value299?.["function"]?.parameters || {
        'type': "object",
        'properties': {}
      }
    })).filter(apk120Value300 => apk120Value300.name)
  }], apk120Value285.toolConfig = {
    'functionCallingConfig': {
      'mode': apk120Value280.tool_choice === "none" ? "NONE" : "AUTO"
    }
  });
  if (Object.keys(apk120Value283).length) apk120Value285.generationConfig = apk120Value283;
  return apk120Value285;
}
    function handleAction_44(apk120Value301) {
  const apk120Value302 = getApiRequestMessages(apk120Value301).filter(apk120Value307 => {
      const apk120Value308 = String(apk120Value307?.role || '').toLowerCase();
      return apk120Value308 !== "system" && apk120Value308 !== 'developer';
    }),
    apk120Value303 = handleAction_42(apk120Value302, apk120Value309 => {
      const apk120Value310 = String(apk120Value309?.role || '').toLowerCase(),
        apk120Value311 = [],
        apk120Value312 = getMessageText(apk120Value309?.content).trim();
      if (apk120Value312 && apk120Value310 !== "tool") apk120Value311.push({
        'type': "text",
        'text': apk120Value312
      });
      apk120Value310 === "assistant" && Array.isArray(apk120Value309?.tool_calls) && apk120Value309.tool_calls.forEach(apk120Value313 => {
        const apk120Value314 = String(apk120Value313?.["function"]?.name || '').trim();
        if (!apk120Value314) return;
        let apk120Value315 = {};
        try {
          apk120Value315 = typeof apk120Value313["function"].arguments === "string" ? JSON.parse(apk120Value313["function"].arguments || '{}') : apk120Value313["function"].arguments || {};
        } catch (apk120Value316) {}
        apk120Value311.push({
          'type': 'tool_use',
          'id': String(apk120Value313.id || "tool-" + Date.now()),
          'name': apk120Value314,
          'input': apk120Value315
        });
      });
      apk120Value310 === "tool" && apk120Value311.push({
        'type': "tool_result",
        'tool_use_id': String(apk120Value309?.tool_call_id || ''),
        'content': String(apk120Value309?.content || ''),
        'is_error': /"isError"\s*:\s*true/.test(String(apk120Value309?.content || ''))
      });
      if (!apk120Value311.length) return null;
      return {
        'role': apk120Value310 === 'assistant' ? "assistant" : "user",
        'parts': apk120Value311
      };
    });
  if (!apk120Value303.length) apk120Value303.push({
    'role': "user",
    'parts': [{
      'type': 'text',
      'text': ''
    }]
  });
  const apk120Value304 = Number(apk120Value301?.max_tokens ?? apk120Value301?.max_completion_tokens),
    apk120Value305 = {
      'model': String(apk120Value301?.model || '').trim(),
      'max_tokens': Number.isFinite(apk120Value304) && apk120Value304 > 0x0 ? Math.round(apk120Value304) : 0x800,
      'messages': apk120Value303.map(apk120Value317 => {
        const apk120Value318 = apk120Value317.parts.every(apk120Value319 => apk120Value319?.type === "text");
        return {
          'role': apk120Value317.role,
          'content': apk120Value318 ? apk120Value317.parts.map(apk120Value320 => String(apk120Value320.text || '')).join('\x0a') : apk120Value317.parts
        };
      })
    };
  if (Number.isFinite(Number(apk120Value301?.temperature))) apk120Value305.temperature = Number(apk120Value301.temperature);
  const apk120Value306 = getSystemInstruction(getApiRequestMessages(apk120Value301));
  if (apk120Value306) apk120Value305.system = apk120Value306;
  if (Array.isArray(apk120Value301?.tools) && apk120Value301.tools.length) {
    apk120Value305.tools = apk120Value301.tools.map(apk120Value321 => ({
      'name': String(apk120Value321?.["function"]?.name || '').slice(0x0, 0x40),
      'description': String(apk120Value321?.["function"]?.description || '').slice(0x0, 0x1000),
      'input_schema': apk120Value321?.["function"]?.parameters || {
        'type': "object",
        'properties': {}
      }
    })).filter(apk120Value322 => apk120Value322.name);
    if (apk120Value301.tool_choice !== "none") apk120Value305.tool_choice = {
      'type': 'auto'
    };
  }
  return apk120Value305;
}
    function getNativeApiKey(headers_3) {
        const bearer =
            String(headers_3.get('Authorization') || '').match(/^Bearer\s+(.+)$/i)?.[1] || '';
        return String(
            headers_3.get('x-goog-api-key') || headers_3.get('x-api-key') || bearer,
        ).trim();
    }
    function resolveGeminiRequestUrl(apk120Value325, apk120Value326, apk120Value327 = ![]) {
  const apk120Value328 = parseHttpUrl_2(apk120Value325),
    apk120Value329 = String(apk120Value328.pathname || '').match(/^(.*\/v\d+(?:beta|alpha)?\d*)(?:\/|$)/i)?.[0x1] || "/v1beta",
    apk120Value330 = String(apk120Value326 || '').trim().replace(/^models\//i, '');
  return apk120Value328.pathname = apk120Value329 + '/models/' + encodeURIComponent(apk120Value330) + ':' + (apk120Value327 ? "streamGenerateContent" : "generateContent"), apk120Value328.search = apk120Value327 ? "?alt=sse" : '', apk120Value328.hash = '', apk120Value328.toString();
}
    function handleAction_46(value_288) {
        const parsed_5 = parseHttpUrl_2(value_288),
            version_2 = String(parsed_5.pathname || '').match(/^(.*\/v\d+)(?:\/|$)/i)?.[1] || '/v1';
        return (
            (parsed_5.pathname = version_2 + '/messages'),
            (parsed_5.search = ''),
            (parsed_5.hash = ''),
            parsed_5.toString()
        );
    }
    function createNativeRequestAdapter(apk120Value334, apk120Value335, apk120Value336, apk120Value337 = '') {
  const apk120Value338 = apk120Value337 ? normalizeApiProvider_2(apk120Value337) : apk120Value335.has("x-goog-api-key") ? "gemini" : apk120Value335.has("x-api-key") ? "anthropic" : detectApiProviderFromEndpoint_2(apk120Value334);
  if (!isGeminiProvider(apk120Value338) && !isAnthropicProvider(apk120Value338)) return null;
  if (!apk120Value336 || typeof apk120Value336 !== "object" || Array.isArray(apk120Value336)) return null;
  const apk120Value339 = getNativeApiKey(apk120Value335);
  if (!apk120Value339 || !String(apk120Value336.model || '').trim()) return null;
  if (isGeminiProvider(apk120Value338)) return apk120Value335.set('x-goog-api-key', apk120Value339), apk120Value335["delete"]("Authorization"), apk120Value335["delete"]("x-api-key"), apk120Value335["delete"]("anthropic-version"), {
    'provider': apk120Value338,
    'stream': apk120Value336.stream === !![],
    'model': String(apk120Value336.model).trim().replace(/^models\//i, ''),
    'url': resolveGeminiRequestUrl(apk120Value334, apk120Value336.model, apk120Value336.stream === !![]),
    'body': handleAction_43(apk120Value336)
  };
  return apk120Value335.set("x-api-key", apk120Value339), apk120Value335.set("anthropic-version", apk120Value335.get("anthropic-version") || "2023-06-01"), apk120Value335["delete"]('Authorization'), apk120Value335["delete"]("x-goog-api-key"), {
    'provider': apk120Value338,
    'stream': apk120Value336.stream === !![],
    'model': String(apk120Value336.model).trim(),
    'url': handleAction_46(apk120Value334),
    'body': {
      ...handleAction_44(apk120Value336),
      'stream': apk120Value336.stream === !![]
    }
  };
}
    function mapFinishReason(value_8) {
        const reason_2 = String(value_8 || '').toUpperCase();
        if (reason_2 === 'STOP' || reason_2 === 'END_TURN') return 'stop';
        if (reason_2 === 'TOOL_USE' || reason_2 === 'FUNCTION_CALL') return 'tool_calls';
        if (reason_2 === 'MAX_TOKENS' || reason_2 === 'MAX_TOKENS_REACHED') return 'length';
        if (reason_2 === 'SAFETY' || reason_2 === 'CONTENT_FILTER') return 'content_filter';
        return reason_2 ? reason_2.toLowerCase() : 'stop';
    }
    function normalizeNativeResponse(value_298, data, model_3) {
        if (isGeminiProvider(value_298)) {
            const candidate = Array.isArray(data?.candidates) ? data.candidates[0] : null,
                items_306 = Array.isArray(candidate?.content?.parts) ? candidate.content.parts : [],
                content_7 = items_306.map((part_4) => String(part_4?.text || '')).join(''),
                tool_calls_2 = items_306
                    .map((value_311, value_312) => {
                        const functionCall_313 = value_311?.functionCall;
                        if (!functionCall_313?.name) return null;
                        return {
                            id: String(
                                functionCall_313.id ||
                                    'gemini-tool-' + Date.now() + '-' + value_312,
                            ),
                            type: 'function',
                            function: {
                                name: String(functionCall_313.name),
                                arguments: JSON.stringify(functionCall_313.args || {}),
                            },
                        };
                    })
                    .filter(Boolean),
                usage_2 = data?.usageMetadata || {};
            return {
                id: 'gemini-' + Date.now(),
                object: 'chat.completion',
                created: Math.floor(Date.now() / 1000),
                model: model_3,
                choices: [
                    {
                        index: 0,
                        message: {
                            role: 'assistant',
                            content: content_7,
                            ...(tool_calls_2.length
                                ? {
                                      tool_calls: tool_calls_2,
                                  }
                                : {}),
                        },
                        finish_reason: tool_calls_2.length
                            ? 'tool_calls'
                            : mapFinishReason(candidate?.finishReason),
                    },
                ],
                usage: {
                    prompt_tokens: Number(usage_2.promptTokenCount) || 0,
                    completion_tokens: Number(usage_2.candidatesTokenCount) || 0,
                    total_tokens: Number(usage_2.totalTokenCount) || 0,
                },
            };
        }
        const items_301 = Array.isArray(data?.content) ? data.content : [],
            content_8 = items_301
                .filter((part_5) => part_5?.type === 'text')
                .map((part_6) => String(part_6.text || ''))
                .join(''),
            tool_calls_3 = items_301
                .map((value_316) =>
                    value_316?.type === 'tool_use' && value_316?.name
                        ? {
                              id: String(value_316.id || 'anthropic-tool-' + Date.now()),
                              type: 'function',
                              function: {
                                  name: String(value_316.name),
                                  arguments: JSON.stringify(value_316.input || {}),
                              },
                          }
                        : null,
                )
                .filter(Boolean),
            value_304 = data?.usage || {};
        return {
            id: String(data?.id || 'anthropic-' + Date.now()),
            object: 'chat.completion',
            created: Math.floor(Date.now() / 1000),
            model: String(data?.model || model_3 || ''),
            choices: [
                {
                    index: 0,
                    message: {
                        role: 'assistant',
                        content: content_8,
                        ...(tool_calls_3.length
                            ? {
                                  tool_calls: tool_calls_3,
                              }
                            : {}),
                    },
                    finish_reason: tool_calls_3.length
                        ? 'tool_calls'
                        : mapFinishReason(data?.stop_reason),
                },
            ],
            usage: {
                prompt_tokens: Number(value_304.input_tokens) || 0,
                completion_tokens: Number(value_304.output_tokens) || 0,
                total_tokens:
                    (Number(value_304.input_tokens) || 0) + (Number(value_304.output_tokens) || 0),
            },
        };
    }
    function createCompatibleNativeResponse(apk120Value368, apk120Value369, apk120Value370) {
  const apk120Value371 = normalizeNativeResponse(apk120Value369.provider, apk120Value370, apk120Value369.model),
    apk120Value372 = new Headers(apk120Value368.headers);
  apk120Value372["delete"]("Content-Length"), apk120Value372['delete']('Content-Encoding');
  if (!apk120Value369.stream) return apk120Value372.set("Content-Type", "application/json"), new Response(JSON.stringify(apk120Value371), {
    'status': apk120Value368.status,
    'statusText': apk120Value368.statusText,
    'headers': apk120Value372
  });
  const apk120Value373 = apk120Value371.choices[0x0] || {},
    apk120Value374 = String(apk120Value373?.message?.content || ''),
    apk120Value375 = {
      'id': apk120Value371.id,
      'object': "chat.completion.chunk",
      'created': apk120Value371.created,
      'model': apk120Value371.model,
      'choices': [{
        'index': 0x0,
        'delta': {
          ...apk120Value373.message,
          'content': apk120Value374,
          ...(apk120Value373.message?.tool_calls ? {
            'tool_calls': apk120Value373.message.tool_calls.map((apk120Value377, apk120Value378) => ({
              ...apk120Value377,
              'index': apk120Value378
            }))
          } : {})
        },
        'finish_reason': null
      }]
    },
    apk120Value376 = {
      'id': apk120Value371.id,
      'object': "chat.completion.chunk",
      'created': apk120Value371.created,
      'model': apk120Value371.model,
      'choices': [{
        'index': 0x0,
        'delta': {},
        'finish_reason': apk120Value373.finish_reason || "stop"
      }],
      'usage': apk120Value371.usage
    };
  return apk120Value372.set('Content-Type', "text/event-stream; charset=utf-8"), new Response("data: " + JSON.stringify(apk120Value375) + "\n\ndata: " + JSON.stringify(apk120Value376) + "\n\ndata: [DONE]\n\n", {
    'status': apk120Value368.status,
    'statusText': apk120Value368.statusText,
    'headers': apk120Value372
  });
}
    async function handleAction_51(value_326, value_327) {
        let body_6 = value_327.body;
        body_6 === undefined &&
            value_326 instanceof Request &&
            (body_6 = await value_326.clone().text());
        if (typeof body_6 !== 'string' || !body_6.trim()) return null;
        try {
            return JSON.parse(body_6);
        } catch (value_329) {
            return null;
        }
    }
    function handleAction_52(value_330) {
        if (
            !value_330 ||
            typeof value_330 !== 'object' ||
            Array.isArray(value_330) ||
            !Array.isArray(value_330.messages)
        )
            return false;
        return (
            value_330.messages.some(Boolean) &&
            value_330.messages.every((message_331) => {
                const content_332 = message_331?.content;
                return content_332 == null || typeof content_332 === 'string';
            })
        );
    }
    function handleAction_53(value_333, body_7) {
        const value_335 = window.getApiConfig ? window.getApiConfig() : window.apiConfig,
            sanitizeApiConfig_28_336 = sanitizeApiConfig_2(value_335);
        if (
            !sanitizeApiConfig_28_336.endpoint ||
            !sanitizeApiConfig_28_336.model ||
            isGeminiProvider(sanitizeApiConfig_28_336.provider) ||
            isAnthropicProvider(sanitizeApiConfig_28_336.provider)
        )
            return null;
        if (String(body_7?.model || '').trim() !== sanitizeApiConfig_28_336.model) return null;
        try {
            return normalizeApiEndpoint_2(
                sanitizeApiConfig_28_336.endpoint,
                sanitizeApiConfig_28_336.provider,
            ) === value_333
                ? sanitizeApiConfig_28_336.frequencyPenalty
                : null;
        } catch (value_337) {
            return null;
        }
    }
    function handleAction_54(value_338, value_339, value_340, value_341) {
        if (
            !handleAction_52(value_340) ||
            Object.prototype.hasOwnProperty.call(value_340, 'frequency_penalty')
        )
            return false;
        const detectApiProviderFromEndpoint_23_342 = detectApiProviderFromEndpoint_2(value_338);
        if (
            isGeminiProvider(detectApiProviderFromEndpoint_23_342) ||
            isAnthropicProvider(detectApiProviderFromEndpoint_23_342)
        )
            return false;
        const float_343 = Number.parseFloat(value_341),
            frequency_penalty_2 = Number.isFinite(float_343)
                ? Math.max(-2, Math.min(2, float_343))
                : handleAction_53(value_338, value_340);
        if (!Number.isFinite(frequency_penalty_2) || frequency_penalty_2 === 0) return false;
        return ((value_340.frequency_penalty = frequency_penalty_2), true);
    }
    async function handleAction_55(apk120Value398, apk120Value399 = {}) {
  const {
    nativeAdapter = null,
    responseStream = ![],
    silentErrors = ![],
    showGlobalErrors = ![],
    isAiApiRequest = ![],
    signal = null
  } = apk120Value399;
  try {
    const apk120Value400 = await originalFetch(...apk120Value398);
    if (apk120Value400.ok && isAiApiRequest && /text\/event-stream/i.test(apk120Value400.headers.get("Content-Type") || '')) {
      if (!window.u2ApiStream) throw new Error('流式传输模块未加载，请刷新页面重试');
      return await window.u2ApiStream.adaptResponse(apk120Value400, {
        'provider': nativeAdapter?.provider,
        'model': nativeAdapter?.model,
        'responseStream': responseStream,
        'signal': signal
      });
    }
    if (apk120Value400.ok && nativeAdapter) {
      const apk120Value403 = await apk120Value400.json();
      return createCompatibleNativeResponse(apk120Value400, {
        ...nativeAdapter,
        'stream': responseStream
      }, apk120Value403);
    }
    if (apk120Value400.ok) return apk120Value400;
    if (silentErrors || !showGlobalErrors || !isAiApiRequest) return apk120Value400;
    const apk120Value401 = apk120Value400.clone();
    let apk120Value402 = '';
    try {
      apk120Value402 = await apk120Value401.text();
    } catch (apk120Value404) {
      apk120Value402 = "[无法读取接口返回内容]";
    }
    return setTimeout(() => reportError_2(createHttpError_2(apk120Value400, {
      'rawBody': apk120Value402
    }), {
      'operation': "API 请求"
    }), 0x0), apk120Value400;
  } catch (apk120Value405) {
    const apk120Value406 = apk120Value405?.name === 'AbortError' || signal?.aborted === !![];
    !silentErrors && showGlobalErrors && !apk120Value406 && isAiApiRequest && setTimeout(() => reportError_2(apk120Value405, {
      'operation': "API 请求"
    }), 0x0);
    throw apk120Value405;
  }
}
    window.fetch = async function (...apk120Value407) {
  const apk120Value408 = apk120Value407[0x0],
    apk120Value409 = apk120Value407[0x1] && typeof apk120Value407[0x1] === 'object' ? apk120Value407[0x1] : {},
    apk120Value410 = apk120Value409.headers instanceof Headers ? new Headers(apk120Value409.headers) : new Headers(apk120Value409.headers || (apk120Value408 instanceof Request ? apk120Value408.headers : undefined)),
    apk120Value411 = apk120Value410.get(INTERNAL_SILENT_ERROR_HEADER_2) === '1',
    apk120Value412 = apk120Value410.get(INTERNAL_GLOBAL_ERROR_HEADER_2) === '1',
    apk120Value413 = apk120Value410.get(text_33);
  apk120Value410['delete'](INTERNAL_SILENT_ERROR_HEADER_2), apk120Value410['delete'](INTERNAL_GLOBAL_ERROR_HEADER_2), apk120Value410["delete"](text_33);
  let apk120Value414 = '';
  try {
    apk120Value414 = String(apk120Value408 instanceof Request ? apk120Value408.url : apk120Value408 || '');
  } catch (apk120Value422) {
    apk120Value414 = '';
  }
  const apk120Value415 = /\/(?:chat\/completions|models)(?:[/?#]|$)/i.test(apk120Value414);
  if (apk120Value415 && /\.openai\.azure\.com(?=\/|$)/i.test(apk120Value414)) {
    const apk120Value423 = String(apk120Value410.get("Authorization") || '').match(/^Bearer\s+(.+)$/i)?.[0x1] || '';
    if (apk120Value423 && !apk120Value410.has("api-key")) apk120Value410.set("api-key", apk120Value423);
    apk120Value410['delete']("Authorization");
  }
  let apk120Value416 = null,
    apk120Value417 = null,
    apk120Value418 = ![],
    apk120Value419 = ![];
  if (apk120Value415 && String(apk120Value409.method || (apk120Value408 instanceof Request ? apk120Value408.method : "GET")).toUpperCase() === "POST") {
    apk120Value417 = await handleAction_51(apk120Value408, apk120Value409), apk120Value419 = apk120Value417?.stream === !![];
    const apk120Value424 = applyApiStreamMode_120(apk120Value414, apk120Value410, apk120Value417, apk120Value409.apiConfig ? sanitizeApiConfig_2(apk120Value409.apiConfig) : null, apk120Value409.streamOverride),
      apk120Value425 = handleAction_54(apk120Value414, apk120Value410, apk120Value417, apk120Value413);
    apk120Value418 = apk120Value425 || apk120Value424 !== null, apk120Value416 = createNativeRequestAdapter(apk120Value414, apk120Value410, apk120Value417);
    if (apk120Value416) apk120Value414 = apk120Value416.url;
  }
  apk120Value410["delete"](API_STREAM_HEADER_120);
  const apk120Value420 = {
    ...apk120Value409
  };
  delete apk120Value420.apiConfig, delete apk120Value420.streamOverride;
  let apk120Value421;
  return apk120Value408 instanceof Request ? apk120Value421 = apk120Value416 ? [new Request(apk120Value414, {
    'method': apk120Value409.method || apk120Value408.method,
    'headers': apk120Value410,
    'body': JSON.stringify(apk120Value416.body),
    'signal': apk120Value409.signal || apk120Value408.signal
  })] : [new Request(apk120Value408, {
    ...apk120Value420,
    'headers': apk120Value410,
    ...(apk120Value418 ? {
      'body': JSON.stringify(apk120Value417)
    } : {})
  })] : apk120Value421 = [apk120Value416 ? apk120Value414 : apk120Value408, {
    ...apk120Value420,
    'headers': apk120Value410,
    ...(apk120Value416 ? {
      'body': JSON.stringify(apk120Value416.body)
    } : apk120Value418 ? {
      'body': JSON.stringify(apk120Value417)
    } : {})
  }], handleAction_55(apk120Value421, {
    'nativeAdapter': apk120Value416,
    'responseStream': apk120Value419,
    'silentErrors': apk120Value411,
    'showGlobalErrors': apk120Value412,
    'isAiApiRequest': apk120Value415,
    'signal': apk120Value409.signal || (apk120Value408 instanceof Request ? apk120Value408.signal : undefined)
  });
};
})();
