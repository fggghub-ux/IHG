(function () {
    const PROVIDERS_2 = Object.freeze(['openai', 'gemini', 'novelai', 'grok', 'relay']),
        REQUEST_TIMEOUT_MS_2 = 120000,
        DEFAULT_CONFIG_2 = Object.freeze({
            activeProvider: 'gemini',
            providers: Object.freeze({
                openai: Object.freeze({
                    endpoint: 'https://api.openai.com/v1/images/generations',
                    apiKey: '',
                    model: 'gpt-image-1.5',
                    size: '1024x1024',
                    models: [],
                }),
                gemini: Object.freeze({
                    endpoint: 'https://generativelanguage.googleapis.com/v1beta/interactions',
                    apiKey: '',
                    model: 'gemini-3.1-flash-image',
                    size: '1024x1024',
                    models: [],
                }),
                novelai: Object.freeze({
                    endpoint: 'https://image.novelai.net/ai/generate-image',
                    apiKey: '',
                    model: '',
                    size: '1024x1024',
                    models: [],
                }),
                grok: Object.freeze({
                    endpoint: 'https://api.x.ai/v1/images/generations',
                    apiKey: '',
                    model: 'grok-imagine-image',
                    size: '1024x1024',
                    models: [],
                }),
                relay: Object.freeze({
                    endpoint: '',
                    apiKey: '',
                    model: '',
                    size: '1024x1024',
                    models: [],
                }),
            }),
        });
    function normalizeConfig_2(value) {
        const source = value && typeof value === 'object' ? value : {},
            savedProviders =
                source.providers && typeof source.providers === 'object' ? source.providers : {},
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
                const defaults = DEFAULT_CONFIG_2.providers[provider_2],
                    saved =
                        savedProviders[provider_2] && typeof savedProviders[provider_2] === 'object'
                            ? savedProviders[provider_2]
                            : {};
                providers_2[provider_2] = {
                    endpoint: String(saved.endpoint ?? defaults.endpoint).trim(),
                    apiKey: String(saved.apiKey ?? defaults.apiKey).trim(),
                    model: String(saved.model ?? defaults.model).trim(),
                    size: ['1024x1024', '1024x1536', '1536x1024'].includes(saved.size)
                        ? saved.size
                        : defaults.size,
                    models: normalizeModels(saved.models),
                };
            }),
            {
                activeProvider: PROVIDERS_2.includes(source.activeProvider)
                    ? source.activeProvider
                    : DEFAULT_CONFIG_2.activeProvider,
                providers: providers_2,
            }
        );
    }
    function getConfig_2() {
        const imageGenerationConfig_2 = normalizeConfig_2(
            typeof window.getImageGenerationConfig === 'function'
                ? window.getImageGenerationConfig()
                : window.imageGenerationConfig,
        );
        return ((window.imageGenerationConfig = imageGenerationConfig_2), imageGenerationConfig_2);
    }
    function getActiveConfig_2() {
        const config_2 = getConfig_2();
        return {
            provider: config_2.activeProvider,
            ...config_2.providers[config_2.activeProvider],
        };
    }
    function handleAction_7(value_2, fieldName = '生图接口地址') {
        if (window.u2Api?.parseHttpUrl) return window.u2Api.parseHttpUrl(value_2, fieldName);
        const trim_40 = String(value_2 || '').trim();
        if (!trim_40) throw new Error('请填写' + fieldName);
        let parsed;
        try {
            parsed = new URL(trim_40);
        } catch (value_42) {
            throw new Error(fieldName + '格式无效');
        }
        if (!['http:', 'https:'].includes(parsed.protocol))
            throw new Error(fieldName + '仅支持 HTTP 或 HTTPS');
        return parsed;
    }
    function resolveImagesEndpoint_2(value_43) {
        const handleAction_7_44 = handleAction_7(value_43),
            pathname_4 = String(handleAction_7_44.pathname || '/').replace(/\/+$/, '') || '/';
        if (/\/images\/generations$/i.test(pathname_4)) handleAction_7_44.pathname = pathname_4;
        else
            /\/v\d+(?:[a-z0-9._-]*)?$/i.test(pathname_4)
                ? (handleAction_7_44.pathname = pathname_4 + '/images/generations')
                : (handleAction_7_44.pathname =
                      (pathname_4 === '/' ? '' : pathname_4) + '/v1/images/generations');
        return handleAction_7_44.toString();
    }
    function validateActiveConfig_2(config_3 = getActiveConfig_2()) {
        if (!PROVIDERS_2.includes(config_3.provider)) throw new Error('请选择生图服务商');
        handleAction_7(config_3.endpoint);
        if (!String(config_3.apiKey || '').trim())
            throw new Error(
                config_3.provider === 'novelai'
                    ? '请填写 NovelAI Persistent API Token'
                    : '请填写生图 API 密钥',
            );
        if (!String(config_3.model || '').trim()) throw new Error('请填写生图模型');
        return {
            provider: config_3.provider,
            endpoint: String(config_3.endpoint).trim(),
            apiKey: String(config_3.apiKey).trim(),
            model: String(config_3.model).trim(),
            size: ['1024x1024', '1024x1536', '1536x1024'].includes(config_3.size)
                ? config_3.size
                : '1024x1024',
        };
    }
    function getSilentHeaders() {
        const header = window.u2Api?.INTERNAL_SILENT_ERROR_HEADER || 'X-U2-Silent-Errors';
        return {
            [header]: '1',
        };
    }
    function base64ToDataUrl(value_47, value_48 = 'image/png') {
        const trim_49 = String(value_47 || '').trim();
        if (!trim_49) return '';
        if (/^data:image\//i.test(trim_49)) return trim_49;
        return 'data:' + (value_48 || 'image/png') + ';base64,' + trim_49;
    }
    function dataUrlMimeType(dataUrl, fallback = 'image/png') {
        const match_2 = String(dataUrl || '').match(/^data:([^;,]+)[;,]/i);
        return match_2?.[1] || fallback;
    }
    async function imageUrlToDataUrl(value_3) {
        const url_2 = String(value_3 || '').trim();
        if (!url_2) return '';
        if (/^data:image\//i.test(url_2)) return url_2;
        const response = await fetch(url_2);
        if (!response.ok) throw new Error('参考脸图片读取失败，请重新上传');
        const blob_2 = await response.blob();
        if (!/^image\//i.test(blob_2.type || '')) throw new Error('参考脸文件不是有效图片');
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => reject(new Error('参考脸图片读取失败，请重新上传'));
            reader.readAsDataURL(blob_2);
        });
    }
    function dataUrlParts(dataUrl_2) {
        const match_3 = String(dataUrl_2 || '').match(/^data:([^;,]+);base64,(.+)$/i);
        if (!match_3) throw new Error('参考脸图片格式无效，请重新上传');
        return {
            mimeType: match_3[1],
            base64: match_3[2],
        };
    }
    function handleAction_11(dataUrl_3) {
        const { mimeType: mimeType_2, base64: base64_2 } = dataUrlParts(dataUrl_3),
            bytes = atob(base64_2),
            array = new Uint8Array(bytes.length);
        for (let index = 0; index < bytes.length; index += 1)
            array[index] = bytes.charCodeAt(index);
        return new Blob([array], {
            type: mimeType_2,
        });
    }
    function resolveEditsEndpoint_2(value_62) {
        const parsed_2 = handleAction_7(value_62),
            pathname_2 = String(parsed_2.pathname || '/').replace(/\/+$/, '') || '/';
        if (/\/images\/(?:generations|edits)$/i.test(pathname_2))
            parsed_2.pathname = pathname_2.replace(
                /\/images\/(?:generations|edits)$/i,
                '/images/edits',
            );
        else
            /\/v\d+(?:[a-z0-9._-]*)?$/i.test(pathname_2)
                ? (parsed_2.pathname = pathname_2 + '/images/edits')
                : (parsed_2.pathname = (pathname_2 === '/' ? '' : pathname_2) + '/v1/images/edits');
        return parsed_2.toString();
    }
    async function handleAction_13(response_2, value_66) {
        let detail = null;
        if (window.u2Api?.readApiError) detail = await window.u2Api.readApiError(response_2);
        const apiDetail_2 = String(detail?.message || response_2.statusText || '').trim();
        return (
            window.u2Api?.createHttpError?.(response_2, detail, value_66 + ' 生图失败') ||
            Object.assign(
                new Error(
                    value_66 +
                        ' 生图失败（HTTP ' +
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
    async function fetchJson(endpoint_2, init, value_71) {
        const controller = new AbortController(),
            timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS_2);
        try {
            const response_3 = await fetch(endpoint_2, {
                ...init,
                signal: controller.signal,
            });
            if (!response_3.ok) throw await handleAction_13(response_3, value_71);
            return await response_3.json();
        } catch (value_74) {
            if (value_74?.name === 'AbortError')
                throw Object.assign(new Error(value_71 + ' 生图超时，请稍后重试'), {
                    name: 'TimeoutError',
                });
            if (value_74 instanceof SyntaxError)
                throw new Error(value_71 + ' 返回了无法解析的数据');
            throw value_74;
        } finally {
            clearTimeout(timeoutId);
        }
    }
    function findGeminiImage_2(value_4) {
        if (!value_4 || typeof value_4 !== 'object') return null;
        if (
            typeof value_4.data === 'string' &&
            (/^image\//i.test(String(value_4.mime_type || value_4.mimeType || '')) ||
                value_4.type === 'image' ||
                value_4.type === 'output_image')
        )
            return {
                base64: value_4.data,
                mimeType: value_4.mime_type || value_4.mimeType || 'image/png',
            };
        if (value_4.output_image && typeof value_4.output_image.data === 'string')
            return {
                base64: value_4.output_image.data,
                mimeType:
                    value_4.output_image.mime_type || value_4.output_image.mimeType || 'image/png',
            };
        const inlineData_2 = value_4.inline_data || value_4.inlineData;
        if (inlineData_2 && typeof inlineData_2.data === 'string')
            return {
                base64: inlineData_2.data,
                mimeType: inlineData_2.mime_type || inlineData_2.mimeType || 'image/png',
            };
        const children = Array.isArray(value_4) ? value_4 : Object.values(value_4);
        for (const value_78 of children) {
            const handleAction_15_79 = findGeminiImage_2(value_78);
            if (handleAction_15_79) return handleAction_15_79;
        }
        return null;
    }
    function parseOpenAiImage_2(data_2) {
        const row = Array.isArray(data_2?.data) ? data_2.data[0] : null,
            base64_3 =
                row?.b64_json ||
                row?.base64 ||
                row?.image ||
                data_2?.b64_json ||
                data_2?.base64 ||
                data_2?.image,
            mimeType_3 =
                row?.mime_type ||
                row?.mimeType ||
                data_2?.mime_type ||
                data_2?.mimeType ||
                'image/png';
        if (base64_3)
            return {
                imageUrl: base64ToDataUrl(base64_3, mimeType_3),
                mimeType: mimeType_3,
            };
        const url_3 = row?.url || row?.image_url || data_2?.url || data_2?.image_url;
        if (url_3)
            return {
                imageUrl: String(url_3),
                mimeType: mimeType_3,
            };
        return null;
    }
    async function handleAction_17(value_85, config_4, referenceImage_2 = '') {
        const aspectRatio =
                config_4.size === '1024x1536'
                    ? '2:3'
                    : config_4.size === '1536x1024'
                      ? '3:2'
                      : '1:1',
            input_2 = [];
        if (referenceImage_2) {
            const reference = dataUrlParts(referenceImage_2);
            input_2.push({
                type: 'image',
                data: reference.base64,
                mime_type: reference.mimeType,
            });
        }
        input_2.push({
            type: 'text',
            text: referenceImage_2
                ? '请以输入图片中的人物面部身份特征为参考，保持同一人物，但不要照搬背景、姿势或构图。' +
                  value_85
                : value_85,
        });
        const data_3 = await fetchJson(
                config_4.endpoint,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-goog-api-key': config_4.apiKey,
                        ...getSilentHeaders(),
                    },
                    body: JSON.stringify({
                        model: config_4.model,
                        input: input_2,
                        response_format: {
                            type: 'image',
                            mime_type: 'image/png',
                            aspect_ratio: aspectRatio,
                            image_size: '1K',
                        },
                    }),
                },
                'Gemini Image',
            ),
            image_2 = findGeminiImage_2(data_3);
        return image_2
            ? {
                  imageUrl: base64ToDataUrl(image_2.base64, image_2.mimeType),
                  mimeType: image_2.mimeType,
              }
            : null;
    }
    async function handleAction_18(
        prompt_2,
        config_5,
        referenceImage_3 = '',
        negative_prompt_2 = '',
    ) {
        const [width_2, height_2] = config_5.size.split('x').map(Number);
        if (referenceImage_3 && !/4[-_.]?5/i.test(config_5.model))
            throw new Error('NovelAI 参考脸需要支持 Precise Reference 的 V4.5 图片模型');
        const reference_2 = referenceImage_3 ? dataUrlParts(referenceImage_3) : null,
            referenceParameters = reference_2
                ? {
                      director_reference_images: [reference_2.base64],
                      director_reference_descriptions: [
                          {
                              caption: {
                                  base_caption: 'character',
                                  char_captions: [],
                              },
                              legacy_uc: false,
                              use_coords: false,
                              use_order: true,
                          },
                      ],
                      director_reference_strength_values: [0.75],
                      director_reference_secondary_strength_values: [0.85],
                      director_reference_information_extracted: [1],
                  }
                : {},
            data_4 = await fetchJson(
                config_5.endpoint,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: 'Bearer ' + config_5.apiKey,
                        ...getSilentHeaders(),
                    },
                    body: JSON.stringify({
                        action: 'generate',
                        input: prompt_2,
                        model: config_5.model,
                        parameters: {
                            prompt: prompt_2,
                            width: width_2,
                            height: height_2,
                            n_samples: 1,
                            steps: 28,
                            scale: 5,
                            sampler: 'k_euler_ancestral',
                            seed: Math.floor(Math.random() * 4294967295),
                            qualityToggle: true,
                            negative_prompt: negative_prompt_2,
                            image_format: 'png',
                            ...referenceParameters,
                        },
                    }),
                },
                'NovelAI',
            ),
            row_2 = Array.isArray(data_4?.images) ? data_4.images[0] : null;
        return row_2?.image
            ? {
                  imageUrl: base64ToDataUrl(row_2.image, 'image/png'),
                  mimeType: 'image/png',
              }
            : null;
    }
    async function generateImageEdit(prompt_3, config_6, value_104, url_4, value_106 = false) {
        const endpoint_3 = resolveEditsEndpoint_2(config_6.endpoint);
        if (value_104 === 'Grok') {
            const value_110 = await fetchJson(
                endpoint_3,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + config_6.apiKey,
                        ...getSilentHeaders(),
                    },
                    body: JSON.stringify({
                        model: config_6.model,
                        prompt: prompt_3,
                        image: {
                            url: url_4,
                            type: 'image_url',
                        },
                        aspect_ratio:
                            config_6.size === '1024x1536'
                                ? '2:3'
                                : config_6.size === '1536x1024'
                                  ? '3:2'
                                  : '1:1',
                        response_format: 'b64_json',
                    }),
                },
                value_104,
            );
            return parseOpenAiImage_2(value_110);
        }
        const form = new FormData(),
            handleAction_11_109 = handleAction_11(url_4);
        form.append(
            'image',
            handleAction_11_109,
            'face-reference.' + (handleAction_11_109.type === 'image/jpeg' ? 'jpg' : 'png'),
        );
        form.append('model', config_6.model);
        form.append('prompt', prompt_3);
        form.append('n', '1');
        form.append('size', config_6.size);
        form.append('input_fidelity', 'high');
        form.append('output_format', 'png');
        try {
            const value_111 = await fetchJson(
                endpoint_3,
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + config_6.apiKey,
                        ...getSilentHeaders(),
                    },
                    body: form,
                },
                value_104,
            );
            return parseOpenAiImage_2(value_111);
        } catch (value_112) {
            if (config_6.provider === 'relay') {
                value_112.message =
                    '当前中转站不支持参考脸或图片编辑接口：' + (value_112?.message || '请求失败');
                throw value_112;
            }
            throw value_112;
        }
    }
    async function handleAction_20(
        prompt_4,
        config_7,
        providerLabel,
        isRelay = false,
        referenceImage_4 = '',
    ) {
        if (referenceImage_4)
            return generateImageEdit(prompt_4, config_7, providerLabel, referenceImage_4, isRelay);
        const endpoint_4 = isRelay ? resolveImagesEndpoint_2(config_7.endpoint) : config_7.endpoint,
            body_2 = {
                model: config_7.model,
                prompt: prompt_4,
                n: 1,
            };
        if (isRelay) {
            body_2.size = config_7.size;
            if (providerLabel === 'OpenAI') body_2.output_format = 'png';
            else body_2.response_format = 'b64_json';
        } else {
            body_2.aspect_ratio =
                config_7.size === '1024x1536'
                    ? '2:3'
                    : config_7.size === '1536x1024'
                      ? '3:2'
                      : '1:1';
            body_2.response_format = 'b64_json';
        }
        const value_120 = await fetchJson(
            endpoint_4,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + config_7.apiKey,
                    ...getSilentHeaders(),
                },
                body: JSON.stringify(body_2),
            },
            providerLabel,
        );
        return parseOpenAiImage_2(value_120);
    }
    function resolveModelsEndpoint_2(value_121, value_122) {
        const parsed_3 = handleAction_7(value_121),
            pathname_3 = String(parsed_3.pathname || '/').replace(/\/+$/, '') || '/';
        parsed_3.search = '';
        parsed_3.hash = '';
        if (value_122 === 'gemini') {
            const versionMatch = pathname_3.match(/^(.*?\/v\d+(?:beta\d*|alpha\d*)?)(?:\/.*)?$/i);
            return (
                (parsed_3.pathname = (versionMatch?.[1] || '/v1beta') + '/models'),
                parsed_3.toString()
            );
        }
        if (value_122 === 'grok')
            return (
                (parsed_3.pathname = pathname_3.replace(
                    /\/images\/generations$/i,
                    '/image-generation-models',
                )),
                parsed_3.toString()
            );
        if (/\/models$/i.test(pathname_3)) parsed_3.pathname = pathname_3;
        else {
            if (/\/images\/generations$/i.test(pathname_3))
                parsed_3.pathname = pathname_3.replace(/\/images\/generations$/i, '/models');
            else
                /\/v\d+(?:[a-z0-9._-]*)?$/i.test(pathname_3)
                    ? (parsed_3.pathname = pathname_3 + '/models')
                    : (parsed_3.pathname = (pathname_3 === '/' ? '' : pathname_3) + '/v1/models');
        }
        return parsed_3.toString();
    }
    async function fetchModels_2(configInput = getActiveConfig_2()) {
        const provider_3 = PROVIDERS_2.includes(configInput?.provider)
                ? configInput.provider
                : getConfig_2().activeProvider,
            config_8 = {
                provider: provider_3,
                endpoint: String(configInput?.endpoint || '').trim(),
                apiKey: String(configInput?.apiKey || '').trim(),
                model: String(configInput?.model || '').trim(),
                size: configInput?.size || '1024x1024',
            };
        handleAction_7(config_8.endpoint);
        if (!config_8.apiKey)
            throw new Error(
                provider_3 === 'novelai'
                    ? '请填写 NovelAI Persistent API Token'
                    : '请填写生图 API 密钥',
            );
        if (config_8.provider === 'novelai')
            throw new Error('NovelAI 官方生图接口不提供模型列表，请手动填写模型');
        const endpoint_5 = resolveModelsEndpoint_2(config_8.endpoint, config_8.provider),
            headers_2 = {
                ...getSilentHeaders(),
            };
        if (config_8.provider === 'gemini') headers_2['x-goog-api-key'] = config_8.apiKey;
        else headers_2.Authorization = 'Bearer ' + config_8.apiKey;
        const label =
                config_8.provider === 'gemini'
                    ? 'Gemini Image'
                    : config_8.provider === 'grok'
                      ? 'Grok'
                      : config_8.provider === 'openai'
                        ? 'OpenAI'
                        : '中转站',
            data_5 = await fetchJson(
                endpoint_5,
                {
                    method: 'GET',
                    headers: headers_2,
                },
                label,
            );
        let rows = [];
        if (config_8.provider === 'gemini')
            rows = Array.isArray(data_5?.models) ? data_5.models : [];
        else {
            if (config_8.provider === 'grok')
                rows = Array.isArray(data_5?.models) ? data_5.models : [];
            else
                rows = Array.isArray(data_5?.data)
                    ? data_5.data
                    : Array.isArray(data_5?.models)
                      ? data_5.models
                      : [];
        }
        let models_3 = rows
            .map((item) => (typeof item === 'string' ? item : item?.id || item?.name || ''))
            .map((item_2) =>
                String(item_2 || '')
                    .replace(/^models\//, '')
                    .trim(),
            )
            .filter(Boolean);
        if (config_8.provider === 'gemini') {
            const imageModels = models_3.filter((model_4) => /image|imagen/i.test(model_4));
            if (imageModels.length) models_3 = imageModels;
        }
        if (config_8.provider === 'openai') {
            const imageModels_2 = models_3.filter((model_5) =>
                /gpt-image|dall-e|image/i.test(model_5),
            );
            if (imageModels_2.length) models_3 = imageModels_2;
        }
        return Array.from(new Set(models_3)).sort((a, b) => a.localeCompare(b));
    }
    async function localizeRemoteImage(result_2) {
        if (!result_2?.imageUrl || /^data:image\//i.test(result_2.imageUrl)) return result_2;
        try {
            const response_4 = await fetch(result_2.imageUrl);
            if (!response_4.ok) return result_2;
            const blob_3 = await response_4.blob();
            if (!/^image\//i.test(blob_3.type || '')) return result_2;
            const imageUrl_2 = await new Promise((resolve_2, reject_2) => {
                const reader_2 = new FileReader();
                reader_2.onload = () => resolve_2(String(reader_2.result || ''));
                reader_2.onerror = () => reject_2(reader_2.error || new Error('图片读取失败'));
                reader_2.readAsDataURL(blob_3);
            });
            return {
                imageUrl: imageUrl_2,
                mimeType: blob_3.type || result_2.mimeType || 'image/png',
            };
        } catch (_) {
            return result_2;
        }
    }
    function handleAction_24(value_148, value_149 = 8000) {
        return String(value_148 || '')
            .trim()
            .slice(0, value_149);
    }
    function compilePromptForProvider_2(value_150, value_151 = {}, value_152 = '') {
        const scenePrompt_2 = handleAction_24(value_150, 12000);
        if (!scenePrompt_2) throw new Error('请输入生图提示词');
        const basePrompt_2 = handleAction_24(value_151.basePrompt),
            charAppearance_2 =
                value_151.includeCharAppearance === false
                    ? ''
                    : handleAction_24(value_151.charAppearance, 4000),
            userAppearance_2 =
                value_151.includeUserAppearance === false
                    ? ''
                    : handleAction_24(value_151.userAppearance, 4000),
            artistPrompt_2 = handleAction_24(value_151.artistPrompt, 4000),
            negativePrompt_2 = handleAction_24(value_151.negativePrompt, 4000);
        if (value_152 === 'novelai')
            return {
                scenePrompt: scenePrompt_2,
                basePrompt: basePrompt_2,
                charAppearance: charAppearance_2,
                userAppearance: userAppearance_2,
                artistPrompt: artistPrompt_2,
                negativePrompt: negativePrompt_2,
                prompt: [
                    scenePrompt_2,
                    basePrompt_2,
                    charAppearance_2,
                    userAppearance_2,
                    artistPrompt_2,
                ]
                    .filter(Boolean)
                    .join(', '),
            };
        const filter_159 = [
            '生成一张连贯的图片，并按以下独立区域理解提示词。',
            `【画面提示词】
` + scenePrompt_2,
            basePrompt_2
                ? `【基础正向提示词】
` + basePrompt_2
                : '',
            charAppearance_2
                ? `【Char 外貌｜仅当画面包含 Char 时保持】
` + charAppearance_2
                : '',
            userAppearance_2
                ? `【User 外貌｜仅当画面包含 User 时保持】
` + userAppearance_2
                : '',
            artistPrompt_2
                ? `【画风与画师串】
` + artistPrompt_2
                : '',
            negativePrompt_2
                ? `【避免出现的元素】
` + negativePrompt_2
                : '',
        ].filter(Boolean);
        return {
            scenePrompt: scenePrompt_2,
            basePrompt: basePrompt_2,
            charAppearance: charAppearance_2,
            userAppearance: userAppearance_2,
            artistPrompt: artistPrompt_2,
            negativePrompt: negativePrompt_2,
            prompt: filter_159.join(`

`),
        };
    }
    async function generate_2(value_160, options_2 = {}) {
        const config_9 = validateActiveConfig_2(options_2.config || getActiveConfig_2()),
            handleAction_25_163 = compilePromptForProvider_2(
                value_160,
                options_2,
                config_9.provider,
            ),
            referenceImage_5 = options_2.referenceImage
                ? await imageUrlToDataUrl(options_2.referenceImage)
                : '';
        let result_3 = null;
        if (config_9.provider === 'gemini')
            result_3 = await handleAction_17(
                handleAction_25_163.prompt,
                config_9,
                referenceImage_5,
            );
        if (config_9.provider === 'novelai')
            result_3 = await handleAction_18(
                handleAction_25_163.prompt,
                config_9,
                referenceImage_5,
                handleAction_25_163.negativePrompt,
            );
        if (config_9.provider === 'grok')
            result_3 = await handleAction_20(
                handleAction_25_163.prompt,
                config_9,
                'Grok',
                false,
                referenceImage_5,
            );
        if (config_9.provider === 'openai')
            result_3 = await handleAction_20(
                handleAction_25_163.prompt,
                config_9,
                'OpenAI',
                true,
                referenceImage_5,
            );
        if (config_9.provider === 'relay')
            result_3 = await handleAction_20(
                handleAction_25_163.prompt,
                config_9,
                '中转站',
                true,
                referenceImage_5,
            );
        if (!result_3?.imageUrl) throw new Error('生图接口返回成功，但没有找到图片数据');
        const localized = await localizeRemoteImage(result_3);
        return {
            imageUrl: localized.imageUrl,
            mimeType: localized.mimeType || dataUrlMimeType(localized.imageUrl),
            provider: config_9.provider,
            model: config_9.model,
            size: config_9.size,
            faceReferenceUsed: !!referenceImage_5,
            compiledPrompt: handleAction_25_163.prompt,
            promptParts: {
                scenePrompt: handleAction_25_163.scenePrompt,
                basePrompt: handleAction_25_163.basePrompt,
                charAppearance: handleAction_25_163.charAppearance,
                userAppearance: handleAction_25_163.userAppearance,
                artistPrompt: handleAction_25_163.artistPrompt,
                negativePrompt: handleAction_25_163.negativePrompt,
            },
        };
    }
    window.imageGenerationConfig = normalizeConfig_2(window.imageGenerationConfig);
    window.u2ImageGeneration = Object.freeze({
        PROVIDERS: PROVIDERS_2,
        DEFAULT_CONFIG: DEFAULT_CONFIG_2,
        REQUEST_TIMEOUT_MS: REQUEST_TIMEOUT_MS_2,
        normalizeConfig: normalizeConfig_2,
        getConfig: getConfig_2,
        getActiveConfig: getActiveConfig_2,
        compilePromptForProvider: compilePromptForProvider_2,
        validateActiveConfig: validateActiveConfig_2,
        resolveImagesEndpoint: resolveImagesEndpoint_2,
        resolveEditsEndpoint: resolveEditsEndpoint_2,
        parseOpenAiImage: parseOpenAiImage_2,
        findGeminiImage: findGeminiImage_2,
        resolveModelsEndpoint: resolveModelsEndpoint_2,
        fetchModels: fetchModels_2,
        generate: generate_2,
    });
})();
