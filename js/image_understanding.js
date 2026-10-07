(function () {
    const PROVIDERS_2 = Object.freeze([
            'openai',
            'gemini',
            'claude',
            'grok',
            'qwen',
            'zhipu',
            'openai-compatible',
        ]),
        REQUEST_TIMEOUT_MS_2 = 60000,
        DEFAULTS = Object.freeze({
            activeProvider: 'gemini',
            providers: Object.freeze({
                openai: Object.freeze({
                    endpoint: 'https://api.openai.com/v1/chat/completions',
                    apiKey: '',
                    model: '',
                    models: [],
                }),
                gemini: Object.freeze({
                    endpoint: 'https://generativelanguage.googleapis.com/v1beta/interactions',
                    apiKey: '',
                    model: '',
                    models: [],
                }),
                claude: Object.freeze({
                    endpoint: 'https://api.anthropic.com/v1/messages',
                    apiKey: '',
                    model: '',
                    models: [],
                }),
                grok: Object.freeze({
                    endpoint: 'https://api.x.ai/v1/chat/completions',
                    apiKey: '',
                    model: '',
                    models: [],
                }),
                qwen: Object.freeze({
                    endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
                    apiKey: '',
                    model: '',
                    models: [],
                }),
                zhipu: Object.freeze({
                    endpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
                    apiKey: '',
                    model: '',
                    models: [],
                }),
                'openai-compatible': Object.freeze({
                    endpoint: '',
                    apiKey: '',
                    model: '',
                    models: [],
                }),
            }),
        }),
        text_2 = `Analyze this image for a fictional X/Twitter feed. Return JSON only, with this exact shape:
{"summary":"","visibleText":[],"subjects":[],"scene":"","mood":"","notableDetails":[]}
Rules: describe only visible facts; transcribe text only when readable; do not identify real people, infer private attributes, or invent events. Keep every value concise and useful for generating natural social-media reactions.`;
    function normalizeConfig_2(value_2) {
        if (typeof window.u2Api?.normalizeVisionConfig === 'function')
            return window.u2Api.normalizeVisionConfig(value_2);
        const source_2 = value_2 && typeof value_2 === 'object' ? value_2 : {},
            savedProviders =
                source_2.providers && typeof source_2.providers === 'object'
                    ? source_2.providers
                    : {},
            providers_2 = {},
            normalizeModels = (models_2) => {
                const seen = new Set();
                return (Array.isArray(models_2) ? models_2 : [])
                    .map((model_2) =>
                        String(model_2 || '')
                            .trim()
                            .slice(0, 256),
                    )
                    .filter(
                        (model_3) => model_3 && !seen.has(model_3) && (seen.add(model_3) || true),
                    )
                    .slice(0, 100);
            };
        return (
            PROVIDERS_2.forEach((provider_2) => {
                const defaults = DEFAULTS.providers[provider_2],
                    saved =
                        savedProviders[provider_2] && typeof savedProviders[provider_2] === 'object'
                            ? savedProviders[provider_2]
                            : {};
                providers_2[provider_2] = {
                    endpoint: String(saved.endpoint ?? defaults.endpoint)
                        .trim()
                        .slice(0, 1024),
                    apiKey: String(saved.apiKey || '')
                        .trim()
                        .slice(0, 512),
                    model: String(saved.model || '')
                        .trim()
                        .slice(0, 256),
                    models: normalizeModels(saved.models),
                };
            }),
            {
                activeProvider: PROVIDERS_2.includes(source_2.activeProvider)
                    ? source_2.activeProvider
                    : DEFAULTS.activeProvider,
                providers: providers_2,
            }
        );
    }
    function getConfig_2() {
        const visionConfig_2 = normalizeConfig_2(
            typeof window.getVisionConfig === 'function'
                ? window.getVisionConfig()
                : window.visionConfig,
        );
        return ((window.visionConfig = visionConfig_2), visionConfig_2);
    }
    function getActiveConfig_2() {
        const config_2 = getConfig_2();
        return {
            provider: config_2.activeProvider,
            ...config_2.providers[config_2.activeProvider],
        };
    }
    function handleAction_8(value_3, fieldName = '识图接口地址') {
        if (window.u2Api?.parseHttpUrl) return window.u2Api.parseHttpUrl(value_3, fieldName);
        const trim_37 = String(value_3 || '').trim();
        if (!trim_37) throw new Error('请填写' + fieldName);
        let parsed;
        try {
            parsed = new URL(trim_37);
        } catch (value_39) {
            throw new Error(fieldName + '格式无效');
        }
        if (!['http:', 'https:'].includes(parsed.protocol))
            throw new Error(fieldName + '仅支持 HTTP 或 HTTPS');
        return parsed;
    }
    function resolveChatEndpoint_2(value_40) {
        const handleAction_8_41 = handleAction_8(value_40),
            pathname_2 = String(handleAction_8_41.pathname || '/').replace(/\/+$/, '') || '/';
        if (/\/chat\/completions$/i.test(pathname_2)) handleAction_8_41.pathname = pathname_2;
        else {
            if (/\/v\d+(?:[a-z0-9._-]*)?$/i.test(pathname_2))
                handleAction_8_41.pathname = pathname_2 + '/chat/completions';
            else
                handleAction_8_41.pathname =
                    (pathname_2 === '/' ? '' : pathname_2) + '/v1/chat/completions';
        }
        return handleAction_8_41.toString();
    }
    function resolveModelsEndpoint_2(value_43, value_44) {
        const parsed_2 = handleAction_8(value_43),
            pathname_3 = String(parsed_2.pathname || '/').replace(/\/+$/, '') || '/';
        if (value_44 === 'gemini') {
            const version =
                pathname_3.match(/^(.*\/v\d+(?:beta|alpha)?)(?:\/.*)?$/i)?.[1] || '/v1beta';
            return ((parsed_2.pathname = version + '/models'), parsed_2.toString());
        }
        if (/\/models$/i.test(pathname_3)) parsed_2.pathname = pathname_3;
        else {
            if (/\/(?:chat\/completions|messages)$/i.test(pathname_3))
                parsed_2.pathname = pathname_3.replace(
                    /\/(?:chat\/completions|messages)$/i,
                    '/models',
                );
            else {
                if (/\/v\d+(?:[a-z0-9._-]*)?$/i.test(pathname_3))
                    parsed_2.pathname = pathname_3 + '/models';
                else parsed_2.pathname = (pathname_3 === '/' ? '' : pathname_3) + '/v1/models';
            }
        }
        return parsed_2.toString();
    }
    function validateActiveConfig_2(config_3 = getActiveConfig_2()) {
        if (!PROVIDERS_2.includes(config_3?.provider)) throw new Error('请选择识图服务商');
        const endpoint_2 = handleAction_8(config_3.endpoint).toString(),
            apiKey_2 = String(config_3.apiKey || '').trim(),
            model_4 = String(config_3.model || '').trim();
        if (!apiKey_2) throw new Error('请填写识图 API 密钥');
        if (!model_4) throw new Error('请填写识图模型');
        return {
            provider: config_3.provider,
            endpoint: endpoint_2,
            apiKey: apiKey_2,
            model: model_4,
        };
    }
    function isConfigured_2(value_52 = getActiveConfig_2()) {
        try {
            return (validateActiveConfig_2(value_52), true);
        } catch (value_53) {
            return false;
        }
    }
    function getSilentHeaders() {
        const header = window.u2Api?.INTERNAL_SILENT_ERROR_HEADER || 'X-U2-Silent-Errors';
        return {
            [header]: '1',
        };
    }
    async function readError(response_2, value_55) {
        const detail = window.u2Api?.readApiError
                ? await window.u2Api.readApiError(response_2)
                : {
                      message: await response_2.text()['catch'](() => ''),
                  },
            apiDetail_2 = String(detail?.message || response_2.statusText || '').trim();
        return (
            window.u2Api?.createHttpError?.(response_2, detail, value_55 + ' 识图失败') ||
            Object.assign(
                new Error(
                    value_55 +
                        ' 识图失败（HTTP ' +
                        response_2.status +
                        (apiDetail_2 ? '：' + apiDetail_2 : '') +
                        '）',
                ),
                {
                    status: response_2.status,
                    apiDetail: apiDetail_2,
                },
            )
        );
    }
    async function fetchJson(endpoint_3, init, provider_3) {
        const controller = new AbortController(),
            timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS_2);
        try {
            const response_3 = await fetch(endpoint_3, {
                ...init,
                signal: controller.signal,
            });
            if (!response_3.ok) throw await readError(response_3, provider_3);
            return await response_3.json();
        } catch (value_63) {
            if (value_63?.name === 'AbortError')
                throw Object.assign(new Error(provider_3 + ' 识图超时，请稍后重试'), {
                    name: 'TimeoutError',
                });
            if (value_63 instanceof SyntaxError)
                throw new Error(provider_3 + ' 返回了无法解析的数据');
            throw value_63;
        } finally {
            clearTimeout(timeoutId);
        }
    }
    function normalizeImageInput(image) {
        const value_4 = String(typeof image === 'string' ? image : image?.url || '').trim();
        if (!value_4) throw new Error('没有可供识别的图片');
        if (/^data:image\//i.test(value_4)) {
            const match_2 = value_4.match(/^data:([^;,]+);base64,(.+)$/i);
            if (!match_2) throw new Error('图片数据格式无效');
            return {
                kind: 'base64',
                value: value_4,
                mimeType: match_2[1],
                base64: match_2[2],
            };
        }
        if (!/^https?:\/\//i.test(value_4))
            throw new Error('图片地址仅支持 http(s) URL 或 data URL');
        return {
            kind: 'url',
            value: value_4,
            mimeType: String(image?.mimeType || '').trim(),
        };
    }
    function dataUrlParts(dataUrl) {
        const match_3 = String(dataUrl || '').match(/^data:([^;,]+);base64,(.+)$/i);
        if (!match_3) throw new Error('图片数据格式无效');
        return {
            mimeType: match_3[1],
            base64: match_3[2],
        };
    }
    async function remoteImageToDataUrl(url_2) {
        const response = await fetch(url_2, {
            headers: getSilentHeaders(),
        });
        if (!response.ok) throw new Error('远程图片无法读取');
        const blob_2 = await response.blob();
        if (!/^image\//i.test(blob_2.type || '')) throw new Error('远程地址不是有效图片');
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => reject(new Error('远程图片读取失败'));
            reader.readAsDataURL(blob_2);
        });
    }
    function contentText(value_5) {
        if (typeof value_5 === 'string') return value_5;
        if (!Array.isArray(value_5)) return '';
        return value_5
            .map((item) => {
                if (typeof item === 'string') return item;
                return String(item?.text || item?.content || '');
            })
            .filter(Boolean).join(`
`);
    }
    function extractOpenAiText(data_2) {
        const content_2 = data_2?.choices?.[0]?.message?.content;
        if (typeof content_2 === 'string' && content_2.trim()) return content_2.trim();
        if (typeof data_2?.choices?.[0]?.text === 'string' && data_2.choices[0].text.trim())
            return data_2.choices[0].text.trim();
        if (typeof data_2?.output_text === 'string' && data_2.output_text.trim())
            return data_2.output_text.trim();
        return contentText(content_2).trim();
    }
    function extractClaudeText(data_3) {
        return contentText(data_3?.content).trim();
    }
    function handleAction_16(data_4) {
        if (typeof data_4?.output_text === 'string') return data_4.output_text.trim();
        const queue = [data_4?.output, data_4?.candidates, data_4?.content].filter(Boolean);
        while (queue.length) {
            const current = queue.shift();
            if (Array.isArray(current)) {
                queue.push(...current);
                continue;
            }
            if (!current || typeof current !== 'object') continue;
            if (
                typeof current.text === 'string' &&
                /output_text|text/i.test(String(current.type || ''))
            )
                return current.text.trim();
            if (typeof current.output_text === 'string') return current.output_text.trim();
            Object.values(current).forEach((value_6) => {
                if (value_6 && typeof value_6 === 'object') queue.push(value_6);
            });
        }
        return '';
    }
    function parseJsonPayload_2(text_2_2) {
        const raw_2 = String(text_2_2 || '').trim();
        if (!raw_2) throw new Error('识图模型没有返回内容');
        try {
            return JSON.parse(raw_2);
        } catch (_) {
            const match_4 =
                raw_2.match(/```(?:json)?\s*([\s\S]*?)```/i) || raw_2.match(/(\{[\s\S]*\})/);
            if (!match_4) throw new Error('识图模型未返回有效 JSON');
            try {
                return JSON.parse(match_4[1]);
            } catch (error) {
                throw new Error('识图模型未返回有效 JSON');
            }
        }
    }
    function compactText(value_7, maxLength = 300) {
        return String(value_7 || '')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, maxLength);
    }
    function compactList(value_8, maxItems = 12, maxLength_2 = 160) {
        const values_2 = Array.isArray(value_8) ? value_8 : value_8 ? [value_8] : [],
            seen_2 = new Set();
        return values_2
            .map((item_2) => compactText(item_2, maxLength_2))
            .filter((item_3) => item_3 && !seen_2.has(item_3) && (seen_2.add(item_3) || true))
            .slice(0, maxItems);
    }
    function normalizeAnalysis_2(payload, config_4) {
        const source_3 =
                payload && typeof payload === 'object' && !Array.isArray(payload) ? payload : {},
            result_2 = {
                status: 'ready',
                summary: compactText(source_3.summary, 500),
                visibleText: compactList(source_3.visibleText, 12, 200),
                subjects: compactList(source_3.subjects, 12, 160),
                scene: compactText(source_3.scene, 300),
                mood: compactText(source_3.mood, 120),
                notableDetails: compactList(source_3.notableDetails, 12, 160),
                provider: config_4.provider,
                model: config_4.model,
                analyzedAt: Date.now(),
            };
        if (
            !result_2.summary &&
            !result_2.scene &&
            result_2.subjects.length === 0 &&
            result_2.notableDetails.length === 0
        )
            throw new Error('识图结果缺少可用画面摘要');
        return result_2;
    }
    function openAiHeaders(value_90) {
        return {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + value_90.apiKey,
            ...getSilentHeaders(),
        };
    }
    async function analyze_2(value_9, options_2 = {}) {
        const config_5 = validateActiveConfig_2(options_2.config || getActiveConfig_2()),
            input_2 = normalizeImageInput(value_9),
            text_4 =
                typeof options_2.prompt === 'string' && options_2.prompt.trim()
                    ? options_2.prompt.trim().slice(0, 4000)
                    : text_2;
        let value_13,
            text_3 = '';
        if (config_5.provider === 'gemini') {
            const imagePart =
                input_2.kind === 'base64'
                    ? {
                          type: 'image',
                          data: input_2.base64,
                          mime_type: input_2.mimeType,
                      }
                    : {
                          type: 'image',
                          uri: input_2.value,
                          mime_type: input_2.mimeType || undefined,
                      };
            value_13 = await fetchJson(
                config_5.endpoint,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-goog-api-key': config_5.apiKey,
                        ...getSilentHeaders(),
                    },
                    body: JSON.stringify({
                        model: config_5.model,
                        input: [
                            {
                                type: 'text',
                                text: text_4,
                            },
                            imagePart,
                        ],
                        ...(options_2.raw
                            ? {}
                            : {
                                  response_format: {
                                      type: 'text',
                                      mime_type: 'application/json',
                                  },
                              }),
                    }),
                },
                'Gemini',
            );
            text_3 = handleAction_16(value_13);
        } else {
            if (config_5.provider === 'claude') {
                const dataUrl_2 =
                        input_2.kind === 'base64'
                            ? input_2.value
                            : await remoteImageToDataUrl(input_2.value),
                    dataUrlParts_17 = dataUrlParts(dataUrl_2);
                value_13 = await fetchJson(
                    config_5.endpoint,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': config_5.apiKey,
                            'anthropic-version': '2023-06-01',
                            ...getSilentHeaders(),
                        },
                        body: JSON.stringify({
                            model: config_5.model,
                            max_tokens: 600,
                            temperature: 0.2,
                            system: options_2.raw
                                ? 'Describe only visible facts. Do not invent details.'
                                : 'You are a precise image-analysis service. Output JSON only.',
                            messages: [
                                {
                                    role: 'user',
                                    content: [
                                        {
                                            type: 'image',
                                            source: {
                                                type: 'base64',
                                                media_type: dataUrlParts_17.mimeType,
                                                data: dataUrlParts_17.base64,
                                            },
                                        },
                                        {
                                            type: 'text',
                                            text: text_4,
                                        },
                                    ],
                                },
                            ],
                        }),
                    },
                    'Claude',
                );
                text_3 = extractClaudeText(value_13);
            } else {
                const label =
                    config_5.provider === 'openai'
                        ? 'OpenAI'
                        : config_5.provider === 'grok'
                          ? 'Grok'
                          : config_5.provider === 'qwen'
                            ? 'Qwen / DashScope'
                            : config_5.provider === 'zhipu'
                              ? '智谱 GLM'
                              : 'OpenAI 兼容服务';
                value_13 = await fetchJson(
                    resolveChatEndpoint_2(config_5.endpoint),
                    {
                        method: 'POST',
                        headers: openAiHeaders(config_5),
                        body: JSON.stringify({
                            model: config_5.model,
                            temperature: 0.2,
                            max_tokens: 600,
                            ...(options_2.raw
                                ? {}
                                : {
                                      response_format: {
                                          type: 'json_object',
                                      },
                                  }),
                            messages: [
                                {
                                    role: 'system',
                                    content: options_2.raw
                                        ? 'Describe only visible facts. Do not invent details.'
                                        : 'You are a precise image-analysis service. Output JSON only.',
                                },
                                {
                                    role: 'user',
                                    content: [
                                        {
                                            type: 'text',
                                            text: text_4,
                                        },
                                        {
                                            type: 'image_url',
                                            image_url: {
                                                url: input_2.value,
                                            },
                                        },
                                    ],
                                },
                            ],
                        }),
                    },
                    label,
                );
                text_3 = extractOpenAiText(value_13);
            }
        }
        return options_2.raw
            ? text_3.trim()
            : normalizeAnalysis_2(parseJsonPayload_2(text_3), config_5);
    }
    async function fetchModels_2(configInput = getActiveConfig_2()) {
        const provider_4 = PROVIDERS_2.includes(configInput?.provider)
                ? configInput.provider
                : getConfig_2().activeProvider,
            config_6 = {
                provider: provider_4,
                endpoint: String(configInput?.endpoint || '').trim(),
                apiKey: String(configInput?.apiKey || '').trim(),
            };
        handleAction_8(config_6.endpoint);
        if (!config_6.apiKey) throw new Error('请填写识图 API 密钥');
        const headers_2 = {
            ...getSilentHeaders(),
        };
        if (provider_4 === 'gemini') headers_2['x-goog-api-key'] = config_6.apiKey;
        else {
            if (provider_4 === 'claude') {
                headers_2['x-api-key'] = config_6.apiKey;
                headers_2['anthropic-version'] = '2023-06-01';
            } else headers_2.Authorization = 'Bearer ' + config_6.apiKey;
        }
        const data_6 = await fetchJson(
                resolveModelsEndpoint_2(config_6.endpoint, provider_4),
                {
                    method: 'GET',
                    headers: headers_2,
                },
                '识图服务',
            ),
            rows = Array.isArray(data_6?.data)
                ? data_6.data
                : Array.isArray(data_6?.models)
                  ? data_6.models
                  : [],
            models_3 = rows
                .map((item_4) =>
                    typeof item_4 === 'string'
                        ? item_4
                        : item_4?.id || item_4?.name || item_4?.model || '',
                )
                .map((model_5) =>
                    String(model_5 || '')
                        .replace(/^models\//, '')
                        .trim(),
                )
                .filter(Boolean);
        return Array.from(new Set(models_3)).sort((a, b) => a.localeCompare(b));
    }
    window.visionConfig = normalizeConfig_2(window.visionConfig);
    window.u2ImageUnderstanding = Object.freeze({
        PROVIDERS: PROVIDERS_2,
        DEFAULT_CONFIG: DEFAULTS,
        REQUEST_TIMEOUT_MS: REQUEST_TIMEOUT_MS_2,
        normalizeConfig: normalizeConfig_2,
        getConfig: getConfig_2,
        getActiveConfig: getActiveConfig_2,
        validateActiveConfig: validateActiveConfig_2,
        isConfigured: isConfigured_2,
        resolveChatEndpoint: resolveChatEndpoint_2,
        resolveModelsEndpoint: resolveModelsEndpoint_2,
        parseJsonPayload: parseJsonPayload_2,
        normalizeAnalysis: normalizeAnalysis_2,
        fetchModels: fetchModels_2,
        analyze: analyze_2,
    });
})();
