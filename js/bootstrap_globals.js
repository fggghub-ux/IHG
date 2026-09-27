(function () {
  const API_PROVIDERS = Object.freeze(["openai", "deepseek", "siliconflow", "gemini", "anthropic", "openai-compatible"]),
    defaultApiConfig = {
      provider: "openai-compatible",
      endpoint: "",
      apiKey: "",
      model: "",
      temperature: 0.7,
      frequencyPenalty: 0
    },
    VECTOR_MEMORY_PROVIDERS_2 = Object.freeze({
      siliconflow: {
        label: "硅基流动",
        endpoint: "https://api.siliconflow.cn/v1/embeddings",
        defaultModel: "BAAI/bge-m3",
        models: ["BAAI/bge-m3", "BAAI/bge-large-zh-v1.5"]
      },
      openai: {
        label: "OpenAI",
        endpoint: "https://api.openai.com/v1/embeddings",
        defaultModel: "text-embedding-3-small",
        models: ["text-embedding-3-small", "text-embedding-3-large"]
      },
      dashscope: {
        label: "阿里云百炼",
        endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/embeddings",
        defaultModel: "text-embedding-v4",
        models: ["text-embedding-v4", "text-embedding-v3"]
      },
      zhipu: {
        label: "智谱 AI",
        endpoint: "https://open.bigmodel.cn/api/paas/v4/embeddings",
        defaultModel: "embedding-3",
        models: ["embedding-3", "embedding-2"]
      },
      "openai-compatible": {
        label: "自定义 OpenAI 兼容",
        endpoint: "",
        defaultModel: "",
        models: []
      }
    }),
    defaultVectorMemoryConfig = {
      enabled: false,
      provider: "siliconflow",
      endpoint: "",
      apiKey: "",
      model: "BAAI/bge-m3"
    },
    defaultImageGenerationConfig = {
      activeProvider: "gemini",
      providers: {
        openai: {
          endpoint: "https://api.openai.com/v1/images/generations",
          apiKey: "",
          model: "gpt-image-1.5",
          size: "1024x1024",
          models: []
        },
        gemini: {
          endpoint: "https://generativelanguage.googleapis.com/v1beta/interactions",
          apiKey: "",
          model: "gemini-3.1-flash-image",
          size: "1024x1024",
          models: []
        },
        novelai: {
          endpoint: "https://image.novelai.net/ai/generate-image",
          apiKey: "",
          model: "",
          size: "1024x1024",
          models: []
        },
        grok: {
          endpoint: "https://api.x.ai/v1/images/generations",
          apiKey: "",
          model: "grok-imagine-image",
          size: "1024x1024",
          models: []
        },
        relay: {
          endpoint: "",
          apiKey: "",
          model: "",
          size: "1024x1024",
          models: []
        }
      }
    },
    VISION_PROVIDERS_2 = Object.freeze({
      openai: {
        label: "OpenAI",
        endpoint: "https://api.openai.com/v1/chat/completions"
      },
      gemini: {
        label: "Gemini",
        endpoint: "https://generativelanguage.googleapis.com/v1beta/interactions"
      },
      claude: {
        label: "Claude",
        endpoint: "https://api.anthropic.com/v1/messages"
      },
      grok: {
        label: "Grok",
        endpoint: "https://api.x.ai/v1/chat/completions"
      },
      qwen: {
        label: "Qwen / DashScope",
        endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
      },
      zhipu: {
        label: "智谱 GLM",
        endpoint: "https://open.bigmodel.cn/api/paas/v4/chat/completions"
      },
      "openai-compatible": {
        label: "OpenAI 兼容",
        endpoint: ""
      }
    }),
    defaultVisionConfig = {
      activeProvider: "gemini",
      providers: Object.fromEntries(Object.entries(VISION_PROVIDERS_2).map(([provider_2, meta]) => [provider_2, {
        endpoint: meta.endpoint,
        apiKey: "",
        model: "",
        models: []
      }]))
    },
    TTS_PROVIDER_IDS = Object.freeze(["minimax", "openai", "openai-compatible", "elevenlabs", "azure", "google", "aws-polly", "volcengine", "dashscope", "tencent", "baidu", "xfyun"]),
    defaultTtsConfig = {
      activeProvider: "minimax",
      providers: {}
    },
    defaultUserState = {
      name: "",
      phone: "",
      persona: "",
      avatarUrl: null
    };
  function safeLoad(key_2, fallback) {
    try {
      if (window.StorageManager && typeof window.StorageManager.load === "function") return window.StorageManager.load(key_2, fallback);
      return fallback;
    } catch (value_59) {
      return console.warn("[bootstrap_globals] Failed to load " + key_2 + ":", value_59), fallback;
    }
  }
  function handleAction_10(value_2) {
    const normalized = sanitizeApiConfig_2({
      ...defaultApiConfig,
      ...(value_2 && typeof value_2 === "object" ? value_2 : {})
    });
    if (normalized.endpoint) try {
      normalized.endpoint = normalizeApiEndpoint_2(normalized.endpoint, normalized.provider);
    } catch (value_62) {}
    return normalized;
  }
  function normalizeVectorMemoryConfig_2(value_63) {
    const source = value_63 && typeof value_63 === "object" && !Array.isArray(value_63) ? value_63 : {},
      isLegacyConfig = !source.provider && ["namespace", "embeddingModel", "embeddingDimensions", "embeddingRevision", "topK", "timeoutMs"].some(key_3 => Object.prototype.hasOwnProperty.call(source, key_3)),
      rawProvider = String(source.provider || defaultVectorMemoryConfig.provider).trim().toLowerCase(),
      provider_3 = Object.prototype.hasOwnProperty.call(VECTOR_MEMORY_PROVIDERS_2, rawProvider) ? rawProvider : defaultVectorMemoryConfig.provider;
    let endpoint_2 = String(source.endpoint || "").trim();
    if (endpoint_2) try {
      endpoint_2 = parseHttpUrl_2(endpoint_2).toString().replace(/\/+$/, "");
    } catch (value_71) {
      endpoint_2 = "";
    }
    const providerMeta = VECTOR_MEMORY_PROVIDERS_2[provider_3];
    return {
      enabled: !isLegacyConfig && source.enabled === true,
      provider: provider_3,
      endpoint: provider_3 === "openai-compatible" ? endpoint_2.slice(0, 1024) : "",
      apiKey: !isLegacyConfig ? String(source.apiKey || "").trim().slice(0, 512) : "",
      model: String(source.model || providerMeta.defaultModel || "").trim().slice(0, 256)
    };
  }
  function normalizeTtsConfig(value_72) {
    const source_2 = value_72 && typeof value_72 === "object" && !Array.isArray(value_72) ? value_72 : {},
      isLegacyMinimaxConfig = !source_2.providers && ["region", "customEndpointEnabled", "endpoint", "apiKey", "groupId", "ttsModel"].some(key_4 => Object.prototype.hasOwnProperty.call(source_2, key_4)),
      legacyMinimax = isLegacyMinimaxConfig ? source_2 : {},
      sourceProviders = source_2.providers && typeof source_2.providers === "object" ? source_2.providers : {},
      providers_2 = {};
    TTS_PROVIDER_IDS.forEach(provider_4 => {
      const saved = sourceProviders[provider_4] && typeof sourceProviders[provider_4] === "object" ? sourceProviders[provider_4] : {};
      providers_2[provider_4] = {
        ...saved
      };
    });
    if (isLegacyMinimaxConfig) {
      const region_2 = legacyMinimax.region === "intl" ? "intl" : "cn";
      providers_2.minimax = {
        region: region_2,
        endpoint: legacyMinimax.customEndpointEnabled ? String(legacyMinimax.endpoint || "").trim() : region_2 === "intl" ? "https://api.minimax.io" : "https://api.minimax.chat",
        apiKey: String(legacyMinimax.apiKey || "").trim(),
        groupId: String(legacyMinimax.groupId || "").trim(),
        model: String(legacyMinimax.ttsModel || "").trim(),
        models: []
      };
    }
    const activeProvider_2 = TTS_PROVIDER_IDS.includes(source_2.activeProvider) ? source_2.activeProvider : "minimax";
    return {
      ...defaultTtsConfig,
      activeProvider: activeProvider_2,
      providers: providers_2
    };
  }
  function normalizeImageGenerationConfig(value_81) {
    const value_82 = value_81 && typeof value_81 === "object" ? value_81 : {},
      value_83 = value_82.providers && typeof value_82.providers === "object" ? value_82.providers : {},
      providers_3 = {},
      normalizeImageModels = value_87 => {
        const value_88 = new Set();
        return (Array.isArray(value_87) ? value_87 : []).map(value_89 => String(value_89 || "").trim().slice(0, 256)).filter(value_90 => value_90 && !value_88.has(value_90) && (value_88.add(value_90) || true)).slice(0, 100);
      };
    Object.keys(defaultImageGenerationConfig.providers).forEach(provider_5 => {
      const defaults = defaultImageGenerationConfig.providers[provider_5],
        saved_2 = value_83[provider_5] && typeof value_83[provider_5] === "object" ? value_83[provider_5] : {};
      providers_3[provider_5] = {
        endpoint: String(saved_2.endpoint ?? defaults.endpoint).trim(),
        apiKey: String(saved_2.apiKey ?? defaults.apiKey).trim(),
        model: String(saved_2.model ?? defaults.model).trim(),
        size: ["1024x1024", "1024x1536", "1536x1024"].includes(saved_2.size) ? saved_2.size : defaults.size,
        models: normalizeImageModels(saved_2.models)
      };
    });
    const activeProvider_3 = Object.prototype.hasOwnProperty.call(providers_3, value_82.activeProvider) ? value_82.activeProvider : defaultImageGenerationConfig.activeProvider;
    return {
      activeProvider: activeProvider_3,
      providers: providers_3
    };
  }
  function normalizeVisionConfig_2(value_94) {
    const value_95 = value_94 && typeof value_94 === "object" && !Array.isArray(value_94) ? value_94 : {},
      sourceProviders_2 = value_95.providers && typeof value_95.providers === "object" ? value_95.providers : {},
      normalizeModels = value_99 => {
        const value_100 = new Set();
        return (Array.isArray(value_99) ? value_99 : []).map(value_101 => String(value_101 || "").trim().slice(0, 256)).filter(value_102 => value_102 && !value_100.has(value_102) && (value_100.add(value_102) || true)).slice(0, 100);
      },
      providers_4 = {};
    Object.entries(VISION_PROVIDERS_2).forEach(([provider_6, meta_2]) => {
      const saved_3 = sourceProviders_2[provider_6] && typeof sourceProviders_2[provider_6] === "object" ? sourceProviders_2[provider_6] : {};
      providers_4[provider_6] = {
        endpoint: String(saved_3.endpoint ?? meta_2.endpoint).trim().slice(0, 1024),
        apiKey: String(saved_3.apiKey || "").trim().slice(0, 512),
        model: String(saved_3.model || "").trim().slice(0, 256),
        models: normalizeModels(saved_3.models)
      };
    });
    const activeProvider_4 = Object.prototype.hasOwnProperty.call(providers_4, value_95.activeProvider) ? value_95.activeProvider : defaultVisionConfig.activeProvider;
    return {
      activeProvider: activeProvider_4,
      providers: providers_4
    };
  }
  function handleAction_15(key_5, value_3) {
    try {
      if (window.StorageManager && typeof window.StorageManager.save === "function") {
        window.StorageManager.save(key_5, value_3);
        return;
      }
      console.warn("[bootstrap_globals] StorageManager unavailable for " + key_5);
    } catch (value_108) {
      console.warn("[bootstrap_globals] Failed to save " + key_5 + ":", value_108);
    }
  }
  function resolveUserStateFromAccounts() {
    const accounts = safeLoad("u2_accounts", []),
      currentAccountId = safeLoad("u2_currentAccountId", null);
    if (Array.isArray(accounts) && currentAccountId != null) {
      const account = accounts.find(item => String(item.id) === String(currentAccountId));
      if (account) return {
        name: account.name || "",
        phone: account.phone || "",
        persona: account.persona || account.signature || "",
        avatarUrl: account.avatarUrl || null
      };
    }
    return {
      ...defaultUserState
    };
  }
  window.apiConfig = handleAction_10(window.apiConfig || safeLoad("u2_apiConfig", defaultApiConfig));
  window.vectorMemoryConfig = normalizeVectorMemoryConfig_2(window.vectorMemoryConfig || safeLoad("u2_vectorMemoryConfig", defaultVectorMemoryConfig));
  window.imageGenerationConfig = normalizeImageGenerationConfig(window.imageGenerationConfig || safeLoad("u2_imageGenerationConfig", defaultImageGenerationConfig));
  window.visionConfig = normalizeVisionConfig_2(window.visionConfig || safeLoad("u2_visionConfig", defaultVisionConfig));
  const storedTtsConfig = safeLoad("u2_ttsConfig", null),
    storedLegacyMinimaxConfig = safeLoad("u2_minimaxConfig", null);
  window.ttsConfig = normalizeTtsConfig(window.ttsConfig || storedTtsConfig || storedLegacyMinimaxConfig);
  window.userState = {
    ...defaultUserState,
    ...(window.userState && typeof window.userState === "object" ? window.userState : resolveUserStateFromAccounts())
  };
  window.getApiConfig = function value_111() {
    return window.apiConfig = handleAction_10(window.apiConfig || safeLoad("u2_apiConfig", defaultApiConfig)), window.apiConfig;
  };
  window.getVectorMemoryConfig = function value_112() {
    return window.vectorMemoryConfig = normalizeVectorMemoryConfig_2(window.vectorMemoryConfig || safeLoad("u2_vectorMemoryConfig", defaultVectorMemoryConfig)), window.vectorMemoryConfig;
  };
  window.getImageGenerationConfig = function value_113() {
    return window.imageGenerationConfig = normalizeImageGenerationConfig(window.imageGenerationConfig), window.imageGenerationConfig;
  };
  window.getActiveImageGenerationConfig = function getActiveImageGenerationConfig_2() {
    const config_2 = window.getImageGenerationConfig();
    return {
      provider: config_2.activeProvider,
      ...(config_2.providers[config_2.activeProvider] || {})
    };
  };
  window.getVisionConfig = function value_116() {
    return window.visionConfig = normalizeVisionConfig_2(window.visionConfig || safeLoad("u2_visionConfig", defaultVisionConfig)), window.visionConfig;
  };
  window.getActiveVisionConfig = function getActiveVisionConfig_2() {
    const config_3 = window.getVisionConfig();
    return {
      provider: config_3.activeProvider,
      ...(config_3.providers[config_3.activeProvider] || {})
    };
  };
  window.getTtsConfig = function value_119() {
    return window.ttsConfig = normalizeTtsConfig(window.ttsConfig || safeLoad("u2_ttsConfig", storedLegacyMinimaxConfig)), window.ttsConfig;
  };
  window.getUserState = function value_120() {
    return (!window.userState || typeof window.userState !== "object") && (window.userState = resolveUserStateFromAccounts()), window.userState;
  };
  const INTERNAL_SILENT_ERROR_HEADER_2 = "X-U2-Silent-Errors",
    INTERNAL_GLOBAL_ERROR_HEADER_2 = "X-U2-Global-Errors";
  function parseHttpUrl_2(value_4, value_122 = "接口地址") {
    const text_2 = String(value_4 || "").trim();
    if (!text_2) throw new Error("请填写" + value_122);
    let parsed;
    try {
      parsed = new URL(text_2);
    } catch (value_125) {
      throw new Error(value_122 + "格式无效");
    }
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error(value_122 + "仅支持 HTTP 或 HTTPS");
    return parsed;
  }
  function trimTrailingSlashes(pathname_2) {
    const trimmed = String(pathname_2 || "").replace(/\/+$/, "");
    return trimmed || "/";
  }
  function normalizeApiProvider_2(value_5) {
    const provider_7 = String(value_5 || "").trim().toLowerCase();
    return API_PROVIDERS.includes(provider_7) ? provider_7 : defaultApiConfig.provider;
  }
  function isGeminiProvider(provider_8) {
    return normalizeApiProvider_2(provider_8) === "gemini";
  }
  function isAnthropicProvider(provider_9) {
    return normalizeApiProvider_2(provider_9) === "anthropic";
  }
  function detectApiProviderFromEndpoint_2(endpoint_3) {
    try {
      const hostname_2 = parseHttpUrl_2(endpoint_3).hostname.toLowerCase();
      if (hostname_2 === "generativelanguage.googleapis.com") return "gemini";
      if (hostname_2 === "api.anthropic.com") return "anthropic";
    } catch (error_2) {}
    return "openai-compatible";
  }
  function normalizeNativeApiEndpoint(value_134, value_135) {
    const httpUrl_21 = parseHttpUrl_2(value_134),
      apiProvider_22 = normalizeApiProvider_2(value_135);
    let pathname_3 = trimTrailingSlashes(httpUrl_21.pathname);
    httpUrl_21.search = "";
    httpUrl_21.hash = "";
    if (isGeminiProvider(apiProvider_22)) pathname_3 = pathname_3.replace(/\/chat\/completions$/i, "").replace(/\/models\/[^/]+:(?:generateContent|streamGenerateContent)$/i, "");else isAnthropicProvider(apiProvider_22) && (pathname_3 = pathname_3.replace(/\/(?:chat\/completions|messages|models)$/i, ""));
    return httpUrl_21.pathname = pathname_3, httpUrl_21.toString();
  }
  function normalizeApiEndpoint_2(endpoint_4, provider_10) {
    const resolvedProvider = normalizeApiProvider_2(provider_10 || detectApiProviderFromEndpoint_2(endpoint_4));
    if (isGeminiProvider(resolvedProvider) || isAnthropicProvider(resolvedProvider)) return normalizeNativeApiEndpoint(endpoint_4, resolvedProvider);
    return resolveChatCompletionsEndpoint_2(endpoint_4);
  }
  function resolveChatCompletionsEndpoint_2(value_140) {
    const httpUrl_21_141 = parseHttpUrl_2(value_140),
      pathname_5 = trimTrailingSlashes(httpUrl_21_141.pathname);
    if (/\/chat\/completions$/i.test(pathname_5)) httpUrl_21_141.pathname = pathname_5;else /\/v\d+(?:[a-z0-9._-]*)?$/i.test(pathname_5) ? httpUrl_21_141.pathname = pathname_5 + "/chat/completions" : httpUrl_21_141.pathname = (pathname_5 === "/" ? "" : pathname_5) + "/v1/chat/completions";
    return httpUrl_21_141.toString();
  }
  function resolveModelsEndpoint_2(value_143) {
    const parsed_2 = parseHttpUrl_2(value_143),
      pathname_4 = trimTrailingSlashes(parsed_2.pathname),
      detectApiProviderFromEndpoint_23_146 = detectApiProviderFromEndpoint_2(value_143);
    parsed_2.search = "";
    parsed_2.hash = "";
    if (isGeminiProvider(detectApiProviderFromEndpoint_23_146)) return parsed_2.pathname = (pathname_4.replace(/\/chat\/completions$/i, "") + "/models").replace(/\/\/+/g, "/"), parsed_2.toString();
    if (isAnthropicProvider(detectApiProviderFromEndpoint_23_146)) {
      const basePath = pathname_4.replace(/\/(?:chat\/completions|messages)$/i, "");
      return parsed_2.pathname = (basePath + "/models").replace(/\/\/+/g, "/"), parsed_2.toString();
    }
    if (/\/models$/i.test(pathname_4)) parsed_2.pathname = pathname_4;else {
      if (/\/chat\/completions$/i.test(pathname_4)) parsed_2.pathname = pathname_4.replace(/\/chat\/completions$/i, "/models");else /\/v\d+(?:[a-z0-9._-]*)?$/i.test(pathname_4) ? parsed_2.pathname = pathname_4 + "/models" : parsed_2.pathname = (pathname_4 === "/" ? "" : pathname_4) + "/v1/models";
    }
    return parsed_2.toString();
  }
  function sanitizeApiConfig_2(value_148) {
    const config_4 = value_148 && typeof value_148 === "object" ? value_148 : {},
      temperature_2 = Number.parseFloat(config_4.temperature),
      float_150 = Number.parseFloat(config_4.frequencyPenalty);
    return {
      provider: normalizeApiProvider_2(config_4.provider),
      endpoint: String(config_4.endpoint || "").trim(),
      apiKey: String(config_4.apiKey || "").trim(),
      model: String(config_4.model || "").trim(),
      temperature: Number.isFinite(temperature_2) ? Math.max(0, Math.min(2, temperature_2)) : 0.7,
      frequencyPenalty: Number.isFinite(float_150) ? Math.max(-2, Math.min(2, float_150)) : 0
    };
  }
  function validateApiConfig_2(value_6, options_2 = {}) {
    const config = sanitizeApiConfig_2(value_6);
    parseHttpUrl_2(config.endpoint);
    if (!config.apiKey) throw new Error("请填写 API 密钥");
    if (options_2.requireModel !== false && !config.model) throw new Error("请填写模型名称");
    return config;
  }
  function buildApiHeaders_2(config_5, extraHeaders = {}) {
    const endpoint_5 = String(config_5?.endpoint || ""),
      provider_11 = normalizeApiProvider_2(config_5?.provider || detectApiProviderFromEndpoint_2(endpoint_5)),
      headers_2 = new Headers({
        "Content-Type": "application/json",
        ...extraHeaders
      });
    if (isGeminiProvider(provider_11)) headers_2.set("x-goog-api-key", String(config_5?.apiKey || ""));else {
      if (isAnthropicProvider(provider_11)) {
        headers_2.set("x-api-key", String(config_5?.apiKey || ""));
        headers_2.set("anthropic-version", "2023-06-01");
      } else /\.openai\.azure\.com(?=\/|$)/i.test(endpoint_5) ? headers_2.set("api-key", String(config_5?.apiKey || "")) : headers_2.set("Authorization", "Bearer " + String(config_5?.apiKey || ""));
    }
    const float_157 = Number.parseFloat(config_5?.frequencyPenalty),
      value_158 = Number.isFinite(float_157) ? Math.max(-2, Math.min(2, float_157)) : 0;
    return !isGeminiProvider(provider_11) && !isAnthropicProvider(provider_11) && value_158 !== 0 && headers_2.set(text_33, String(value_158)), Object.fromEntries(headers_2.entries());
  }
  async function readApiError_2(value_159) {
    let rawBody_2 = "";
    try {
      rawBody_2 = await value_159.clone().text();
    } catch (value_162) {
      rawBody_2 = "";
    }
    let detail_2 = rawBody_2;
    try {
      const parsed_3 = JSON.parse(rawBody_2);
      detail_2 = parsed_3?.error?.message || parsed_3?.message || parsed_3?.error || rawBody_2;
    } catch (value_164) {}
    return {
      status: value_159.status,
      statusText: value_159.statusText || "",
      rawBody: rawBody_2,
      message: String(detail_2 || "HTTP " + value_159.status)
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
    fetchChatCompletion: fetchChatCompletion_2
  });
  const originalFetch = window.fetch,
    text_33 = "X-U2-Frequency-Penalty";
  function fetchChatCompletion_2(value_165, value_166 = {}) {
    const value_167 = value_166 && typeof value_166 === "object" ? value_166 : {},
      body_168 = value_167.body;
    if (!body_168 || typeof body_168 !== "object" || Array.isArray(body_168)) return window.fetch(value_165, value_167);
    const value_169 = value_167.apiConfig && typeof value_167.apiConfig === "object" ? sanitizeApiConfig_2(value_167.apiConfig) : null,
      value_170 = value_167.headers instanceof Headers ? new Headers(value_167.headers) : new Headers(value_167.headers || (value_169 ? buildApiHeaders_2(value_169) : {})),
      silentErrors_2 = value_170.get(INTERNAL_SILENT_ERROR_HEADER_2) === "1",
      showGlobalErrors_2 = value_170.get(INTERNAL_GLOBAL_ERROR_HEADER_2) === "1",
      value_173 = value_169 ? value_169.frequencyPenalty : value_170.get(text_33);
    value_170["delete"](INTERNAL_SILENT_ERROR_HEADER_2);
    value_170["delete"](INTERNAL_GLOBAL_ERROR_HEADER_2);
    value_170["delete"](text_33);
    let requestUrl = String(value_165 || "");
    if (/\.openai\.azure\.com(?=\/|$)/i.test(requestUrl)) {
      const bearer_2 = String(value_170.get("Authorization") || "").match(/^Bearer\s+(.+)$/i)?.[1] || "";
      if (bearer_2 && !value_170.has("api-key")) value_170.set("api-key", bearer_2);
      value_170["delete"]("Authorization");
    }
    const value_175 = value_169?.provider || "";
    !isGeminiProvider(value_175) && !isAnthropicProvider(value_175) && handleAction_54(requestUrl, value_170, body_168, value_173);
    const nativeAdapter_2 = createNativeRequestAdapter(requestUrl, value_170, body_168, value_175);
    if (nativeAdapter_2) requestUrl = nativeAdapter_2.url;
    const options_177 = {
      ...value_167
    };
    return delete options_177.apiConfig, options_177.headers = value_170, options_177.body = JSON.stringify(nativeAdapter_2 ? nativeAdapter_2.body : body_168), handleAction_55([requestUrl, options_177], {
      nativeAdapter: nativeAdapter_2,
      silentErrors: silentErrors_2,
      showGlobalErrors: showGlobalErrors_2,
      isAiApiRequest: true,
      signal: options_177.signal
    });
  }
  function createHttpError_2(value_179, value_180, value_181 = "API 请求失败") {
    const value_182 = new Error(String(value_180?.message || value_181 + "（HTTP " + value_179.status + "）"));
    return value_182.name = "ApiHttpError", value_182.status = Number(value_180?.status || value_179.status) || 0, value_182.statusText = String(value_180?.statusText || value_179.statusText || ""), value_182.rawBody = String(value_180?.rawBody || ""), value_182.apiDetail = String(value_180?.message || ""), value_182;
  }
  function isRequestError_2(value_183) {
    return Number(value_183?.status) > 0 || ["ApiHttpError", "ApiResponseError", "TimeoutError"].includes(value_183?.name) || value_183?.name === "TypeError" && /(?:failed to fetch|networkerror|cors)/i.test(String(value_183?.message || "")) || ["network", "http_error", "api_error", "api_timeout", "invalid_api_response", "empty_response"].includes(value_183?.code) || /\bHTTP\s*\d{3}\b|(?:API|接口).*(?:超时|请求失败|返回内容)|(?:failed to fetch|networkerror|cors|无法连接)/i.test(String(value_183?.message || ""));
  }
  function handleAction_37(value_7) {
    let text_3 = String(value_7 || "").trim();
    if (!text_3) return "";
    try {
      const result_186 = JSON.parse(text_3);
      text_3 = String(result_186?.error?.message || result_186?.message || result_186?.detail || result_186?.error || text_3);
    } catch (value_187) {}
    return text_3 = text_3.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\bBearer\s+[^\s"',}]+/gi, "Bearer [已隐藏]").replace(/\b(?:sk|rk|pk|sess)-[A-Za-z0-9._-]{6,}\b/gi, "[已隐藏的密钥]").replace(/([?&](?:api[_-]?key|key|token)=)[^&\s]+/gi, "$1[已隐藏]").replace(/((?:api[_ -]?key|x-api-key|x-goog-api-key|authorization)\s*[:=]\s*["']?)[^"',}\s]+/gi, "$1[已隐藏]").replace(/\s+/g, " ").trim(), text_3.length > 500 ? text_3.slice(0, 500) + "…" : text_3;
  }
  function handleAction_38(value_188) {
    const status_2 = Number(value_188?.status || value_188?.response?.status) || Number(/\bHTTP\s*(\d{3})\b/i.exec(String(value_188?.message || ""))?.[1]) || 0,
      detail_3 = handleAction_37(value_188?.apiDetail || value_188?.rawBody || value_188?.detail || value_188?.message),
      value_191 = value_188?.name === "TimeoutError" || value_188?.code === "timeout" || /(?:timed? out|超时)/i.test(String(value_188?.message || "")),
      value_192 = value_188?.name === "TypeError" || value_188?.code === "network" || /(?:failed to fetch|networkerror|cors|无法连接)/i.test(String(value_188?.message || "")),
      options_193 = {
        400: ["请求参数或上下文可能不符合当前模型要求。", "检查模型名称与参数；若上下文过长，减少消息或记忆后重试。"],
        401: ["API 密钥可能无效、过期或未正确填写。", "检查密钥和对应的服务商，更新后重试。"],
        402: ["服务商账户可能需要充值，或可用额度已经耗尽。", "检查账户余额与额度，或改用其他 API 预设。"],
        403: ["当前密钥可能没有模型权限；中转站余额、额度或账户状态也可能导致拒绝。", "检查站点余额与模型权限，或更换模型、API 预设后重试。"],
        404: ["接口地址或模型名称可能不存在。", "核对接口地址和模型名称，或重新获取模型列表。"],
        408: ["服务商处理请求的时间过长。", "稍后重试；若经常发生，可换一个模型。"],
        413: ["发送给模型的内容可能超过接口允许的大小。", "缩短聊天上下文或减少附件后重试。"],
        422: ["接口无法处理当前请求参数或内容。", "检查模型及参数设置，调整输入内容后重试。"],
        429: ["请求可能过于频繁，也可能达到并发或额度限制。", "稍后重试，并检查服务商额度；必要时更换模型或预设。"]
      };
    let reason_3, advice_2;
    if (options_193[status_2]) [reason_3, advice_2] = options_193[status_2];else {
      if (status_2 >= 500 && status_2 <= 599) [reason_3, advice_2] = ["服务商或中转站暂时无法完成请求。", "稍后重试；若持续失败，可更换模型或 API 预设。"];else {
        if (value_191) [reason_3, advice_2] = ["接口长时间没有返回结果。", "稍后重试，或尝试响应更快的模型。"];else {
          if (value_192) [reason_3, advice_2] = ["设备暂时无法连接到 API 接口。", "检查网络、接口地址、代理或跨域设置后重试。"];else {
            if (/(?:请.*(?:配置|填写).*(?:API|密钥|模型|接口)|API.*(?:未配置|配置不完整))/i.test(String(value_188?.message || ""))) [reason_3, advice_2] = ["API 配置可能不完整。", "填写接口地址、密钥和模型后重试。"];else [reason_3, advice_2] = ["接口没有完成这次请求，暂时无法确定具体原因。", "稍后重试，并检查 API 配置或接口详情。"];
          }
        }
      }
    }
    return {
      status: status_2,
      detail: detail_3,
      label: status_2 ? "HTTP " + status_2 : value_191 ? "请求超时" : value_192 ? "连接失败" : "请求失败",
      reason: reason_3,
      advice: advice_2
    };
  }
  const items = [],
    value = new Map();
  let value_39 = null;
  function handleAction_40() {
    if (value_39 || !items.length || !document.body) return;
    const {
        operation: operation_2,
        info: info_2
      } = items.shift(),
      activeElement_198 = document.activeElement,
      overlay = document.createElement("div");
    overlay.id = "global-api-error-overlay";
    overlay.className = "api-error-overlay";
    const element_199 = document.createElement("section");
    element_199.className = "api-error-modal";
    element_199.setAttribute("role", "alertdialog");
    element_199.setAttribute("aria-modal", "true");
    element_199.setAttribute("aria-labelledby", "api-error-title");
    element_199.setAttribute("aria-describedby", "api-error-reason api-error-advice");
    const content_2 = document.createElement("div");
    content_2.className = "api-error-content";
    const element_201 = document.createElement("header");
    element_201.className = "api-error-note-header";
    const element_202 = document.createElement("span");
    element_202.className = "api-error-kicker";
    element_202.textContent = "API_ERROR";
    const element_203 = document.createElement("div");
    element_203.className = "api-error-status";
    element_203.textContent = info_2.label;
    const titleEl = document.createElement("h2");
    titleEl.id = "api-error-title";
    titleEl.className = "api-error-title";
    titleEl.textContent = operation_2 + "失败";
    element_201.append(element_202, element_203, titleEl);
    const content_3 = document.createElement("section");
    content_3.className = "api-error-section";
    const titleEl_2 = document.createElement("div");
    titleEl_2.className = "api-error-section-label";
    titleEl_2.textContent = "可能原因";
    const messageEl = document.createElement("p");
    messageEl.id = "api-error-reason";
    messageEl.className = "api-error-message";
    messageEl.textContent = info_2.reason;
    content_3.append(titleEl_2, messageEl);
    const content_4 = document.createElement("section");
    content_4.className = "api-error-section";
    const titleEl_3 = document.createElement("div");
    titleEl_3.className = "api-error-section-label";
    titleEl_3.textContent = "可以尝试";
    const messageEl_2 = document.createElement("p");
    messageEl_2.id = "api-error-advice";
    messageEl_2.className = "api-error-message";
    messageEl_2.textContent = info_2.advice;
    content_4.append(titleEl_3, messageEl_2);
    content_2.append(element_201, content_3, content_4);
    if (info_2.detail) {
      const rawWrapper = document.createElement("details");
      rawWrapper.className = "api-error-raw-wrapper";
      const titleEl_4 = document.createElement("summary");
      titleEl_4.textContent = "接口详情";
      const rawEl = document.createElement("pre");
      rawEl.className = "api-error-raw";
      rawEl.textContent = info_2.detail;
      rawWrapper.append(titleEl_4, rawEl);
      content_2.appendChild(rawWrapper);
    }
    const button = document.createElement("button");
    button.className = "api-error-button";
    button.type = "button";
    button.textContent = "知道了";
    let enabled_212 = false;
    const handleClick = () => {
        if (enabled_212) return;
        enabled_212 = true;
        overlay.classList.remove("show");
        overlay.removeEventListener("keydown", handleKeydown);
        setTimeout(() => {
          overlay.remove();
          value_39 = null;
          if (activeElement_198?.isConnected) activeElement_198.focus?.();
          handleAction_40();
        }, 250);
      },
      handleKeydown = event => {
        event.key === "Escape" && (event.preventDefault(), handleClick());
        if (event.key === "Tab") {
          const result_2 = Array.from(element_199.querySelectorAll("button, summary")),
            value_219 = result_2[0],
            last = result_2[result_2.length - 1];
          if (event.shiftKey && document.activeElement === value_219) {
            event.preventDefault();
            last?.focus();
          } else !event.shiftKey && document.activeElement === last && (event.preventDefault(), value_219?.focus());
        }
      };
    button.addEventListener("click", handleClick);
    overlay.addEventListener("keydown", handleKeydown);
    element_199.append(content_2, button);
    overlay.appendChild(element_199);
    document.body.appendChild(overlay);
    value_39 = overlay;
    overlay.getBoundingClientRect();
    overlay.classList.add("show");
    button.focus?.();
  }
  function reportError_2(value_221, value_222 = {}) {
    if (value_221?.name === "AbortError" || value_222.signal?.aborted && value_221?.name !== "TimeoutError") return false;
    const operation_3 = String(value_222.operation || "API 请求").trim().replace(/失败$/, "") || "API 请求",
      info_3 = handleAction_38(value_221),
      value_225 = operation_3 + "|" + info_3.label + "|" + info_3.detail,
      now_226 = Date.now();
    for (const [value_227, value_228] of value) if (now_226 - value_228 > 1500) value["delete"](value_227);
    if (value.has(value_225)) return true;
    return value.set(value_225, now_226), items.push({
      operation: operation_3,
      info: info_3
    }), handleAction_40(), true;
  }
  function getMessageText(content_5) {
    if (typeof content_5 === "string") return content_5;
    if (!Array.isArray(content_5)) return String(content_5 || "");
    return content_5.map(part => {
      if (typeof part === "string") return part;
      if (!part || typeof part !== "object") return "";
      if (typeof part.text === "string") return part.text;
      if (typeof part.content === "string") return part.content;
      return "";
    }).filter(Boolean).join("\n");
  }
  function getApiRequestMessages(body_2) {
    return Array.isArray(body_2?.messages) ? body_2.messages : [];
  }
  function getSystemInstruction(messages_2) {
    return messages_2.filter(message_2 => ["system", "developer"].includes(String(message_2?.role || "").toLowerCase())).map(message_3 => getMessageText(message_3?.content).trim()).filter(Boolean).join("\n\n");
  }
  function handleAction_42(value_234, value_235) {
    return value_234.reduce((result_3, value_237) => {
      const mapped = value_235(value_237);
      if (!mapped) return result_3;
      const last_2 = result_3[result_3.length - 1];
      return last_2 && last_2.role === mapped.role ? last_2.parts.push(...mapped.parts) : result_3.push(mapped), result_3;
    }, []);
  }
  function handleAction_43(body_3) {
    const filter_241 = getApiRequestMessages(body_3).filter(message_246 => {
        const toLowerCase_247 = String(message_246?.role || "").toLowerCase();
        return toLowerCase_247 !== "system" && toLowerCase_247 !== "developer";
      }),
      contents_2 = handleAction_42(filter_241, message_248 => {
        const toLowerCase_249 = String(message_248?.role || "").toLowerCase(),
          parts_2 = [],
          text_4 = getMessageText(message_248?.content).trim();
        if (text_4 && toLowerCase_249 !== "tool") parts_2.push({
          text: text_4
        });
        toLowerCase_249 === "assistant" && Array.isArray(message_248?.tool_calls) && message_248.tool_calls.forEach(value_252 => {
          const name_2 = String(value_252?.["function"]?.name || "").trim();
          if (!name_2) return;
          let args_3 = {};
          try {
            args_3 = typeof value_252["function"].arguments === "string" ? JSON.parse(value_252["function"].arguments || "{}") : value_252["function"].arguments || {};
          } catch (value_255) {}
          parts_2.push({
            functionCall: {
              name: name_2,
              args: args_3
            }
          });
        });
        if (toLowerCase_249 === "tool") {
          let result_4 = message_248?.content ?? "";
          try {
            result_4 = JSON.parse(String(result_4));
          } catch (value_257) {}
          parts_2.push({
            functionResponse: {
              name: String(message_248?.name || "mcp_tool"),
              response: {
                result: result_4
              }
            }
          });
        }
        if (!parts_2.length) return null;
        return {
          role: toLowerCase_249 === "assistant" ? "model" : "user",
          parts: parts_2
        };
      });
    if (!contents_2.length) contents_2.push({
      role: "user",
      parts: [{
        text: ""
      }]
    });
    const generationConfig_2 = {};
    if (Number.isFinite(Number(body_3?.temperature))) generationConfig_2.temperature = Number(body_3.temperature);
    const maxTokens = Number(body_3?.max_completion_tokens ?? body_3?.max_tokens);
    if (Number.isFinite(maxTokens) && maxTokens > 0) generationConfig_2.maxOutputTokens = Math.round(maxTokens);
    if (body_3?.response_format?.type === "json_object") generationConfig_2.responseMimeType = "application/json";
    const nativeBody = {
        contents: contents_2
      },
      systemInstruction_245 = getSystemInstruction(getApiRequestMessages(body_3));
    if (systemInstruction_245) nativeBody.systemInstruction = {
      parts: [{
        text: systemInstruction_245
      }]
    };
    Array.isArray(body_3?.tools) && body_3.tools.length && (nativeBody.tools = [{
      functionDeclarations: body_3.tools.map(value_258 => ({
        name: String(value_258?.["function"]?.name || "").slice(0, 64),
        description: String(value_258?.["function"]?.description || "").slice(0, 4096),
        parameters: value_258?.["function"]?.parameters || {
          type: "object",
          properties: {}
        }
      })).filter(value_259 => value_259.name)
    }], nativeBody.toolConfig = {
      functionCallingConfig: {
        mode: body_3.tool_choice === "none" ? "NONE" : "AUTO"
      }
    });
    if (Object.keys(generationConfig_2).length) nativeBody.generationConfig = generationConfig_2;
    return nativeBody;
  }
  function handleAction_44(body_4) {
    const filter_261 = getApiRequestMessages(body_4).filter(message_266 => {
        const toLowerCase_267 = String(message_266?.role || "").toLowerCase();
        return toLowerCase_267 !== "system" && toLowerCase_267 !== "developer";
      }),
      handleAction_42_262 = handleAction_42(filter_261, message_268 => {
        const toLowerCase_269 = String(message_268?.role || "").toLowerCase(),
          parts_3 = [],
          text_5 = getMessageText(message_268?.content).trim();
        if (text_5 && toLowerCase_269 !== "tool") parts_3.push({
          type: "text",
          text: text_5
        });
        toLowerCase_269 === "assistant" && Array.isArray(message_268?.tool_calls) && message_268.tool_calls.forEach(value_272 => {
          const name_3 = String(value_272?.["function"]?.name || "").trim();
          if (!name_3) return;
          let input_2 = {};
          try {
            input_2 = typeof value_272["function"].arguments === "string" ? JSON.parse(value_272["function"].arguments || "{}") : value_272["function"].arguments || {};
          } catch (value_275) {}
          parts_3.push({
            type: "tool_use",
            id: String(value_272.id || "tool-" + Date.now()),
            name: name_3,
            input: input_2
          });
        });
        toLowerCase_269 === "tool" && parts_3.push({
          type: "tool_result",
          tool_use_id: String(message_268?.tool_call_id || ""),
          content: String(message_268?.content || ""),
          is_error: /"isError"\s*:\s*true/.test(String(message_268?.content || ""))
        });
        if (!parts_3.length) return null;
        return {
          role: toLowerCase_269 === "assistant" ? "assistant" : "user",
          parts: parts_3
        };
      });
    if (!handleAction_42_262.length) handleAction_42_262.push({
      role: "user",
      parts: [{
        type: "text",
        text: ""
      }]
    });
    const maxTokens_2 = Number(body_4?.max_tokens ?? body_4?.max_completion_tokens),
      nativeBody_2 = {
        model: String(body_4?.model || "").trim(),
        max_tokens: Number.isFinite(maxTokens_2) && maxTokens_2 > 0 ? Math.round(maxTokens_2) : 2048,
        messages: handleAction_42_262.map(message_276 => {
          const every_277 = message_276.parts.every(part_2 => part_2?.type === "text");
          return {
            role: message_276.role,
            content: every_277 ? message_276.parts.map(part_3 => String(part_3.text || "")).join("\n") : message_276.parts
          };
        })
      };
    if (Number.isFinite(Number(body_4?.temperature))) nativeBody_2.temperature = Number(body_4.temperature);
    const system_2 = getSystemInstruction(getApiRequestMessages(body_4));
    if (system_2) nativeBody_2.system = system_2;
    if (Array.isArray(body_4?.tools) && body_4.tools.length) {
      nativeBody_2.tools = body_4.tools.map(value_280 => ({
        name: String(value_280?.["function"]?.name || "").slice(0, 64),
        description: String(value_280?.["function"]?.description || "").slice(0, 4096),
        input_schema: value_280?.["function"]?.parameters || {
          type: "object",
          properties: {}
        }
      })).filter(value_281 => value_281.name);
      if (body_4.tool_choice !== "none") nativeBody_2.tool_choice = {
        type: "auto"
      };
    }
    return nativeBody_2;
  }
  function getNativeApiKey(headers_3) {
    const bearer = String(headers_3.get("Authorization") || "").match(/^Bearer\s+(.+)$/i)?.[1] || "";
    return String(headers_3.get("x-goog-api-key") || headers_3.get("x-api-key") || bearer).trim();
  }
  function resolveGeminiRequestUrl(value_283, model_2) {
    const parsed_4 = parseHttpUrl_2(value_283),
      version = String(parsed_4.pathname || "").match(/^(.*\/v\d+(?:beta|alpha)?\d*)(?:\/|$)/i)?.[1] || "/v1beta",
      normalizedModel = String(model_2 || "").trim().replace(/^models\//i, "");
    return parsed_4.pathname = version + "/models/" + encodeURIComponent(normalizedModel) + ":generateContent", parsed_4.search = "", parsed_4.hash = "", parsed_4.toString();
  }
  function handleAction_46(value_288) {
    const parsed_5 = parseHttpUrl_2(value_288),
      version_2 = String(parsed_5.pathname || "").match(/^(.*\/v\d+)(?:\/|$)/i)?.[1] || "/v1";
    return parsed_5.pathname = version_2 + "/messages", parsed_5.search = "", parsed_5.hash = "", parsed_5.toString();
  }
  function createNativeRequestAdapter(requestUrl_2, requestHeaders, body_5, value_294 = "") {
    const provider_12 = value_294 ? normalizeApiProvider_2(value_294) : detectApiProviderFromEndpoint_2(requestUrl_2);
    if (!isGeminiProvider(provider_12) && !isAnthropicProvider(provider_12)) return null;
    if (!body_5 || typeof body_5 !== "object" || Array.isArray(body_5)) return null;
    const apiKey_2 = getNativeApiKey(requestHeaders);
    if (!apiKey_2 || !String(body_5.model || "").trim()) return null;
    if (isGeminiProvider(provider_12)) return requestHeaders.set("x-goog-api-key", apiKey_2), requestHeaders["delete"]("Authorization"), requestHeaders["delete"]("x-api-key"), requestHeaders["delete"]("anthropic-version"), {
      provider: provider_12,
      stream: body_5.stream === true,
      model: String(body_5.model).trim().replace(/^models\//i, ""),
      url: resolveGeminiRequestUrl(requestUrl_2, body_5.model),
      body: handleAction_43(body_5)
    };
    return requestHeaders.set("x-api-key", apiKey_2), requestHeaders.set("anthropic-version", requestHeaders.get("anthropic-version") || "2023-06-01"), requestHeaders["delete"]("Authorization"), requestHeaders["delete"]("x-goog-api-key"), {
      provider: provider_12,
      stream: body_5.stream === true,
      model: String(body_5.model).trim(),
      url: handleAction_46(requestUrl_2),
      body: handleAction_44(body_5)
    };
  }
  function mapFinishReason(value_8) {
    const reason_2 = String(value_8 || "").toUpperCase();
    if (reason_2 === "STOP" || reason_2 === "END_TURN") return "stop";
    if (reason_2 === "TOOL_USE" || reason_2 === "FUNCTION_CALL") return "tool_calls";
    if (reason_2 === "MAX_TOKENS" || reason_2 === "MAX_TOKENS_REACHED") return "length";
    if (reason_2 === "SAFETY" || reason_2 === "CONTENT_FILTER") return "content_filter";
    return reason_2 ? reason_2.toLowerCase() : "stop";
  }
  function normalizeNativeResponse(value_298, data, model_3) {
    if (isGeminiProvider(value_298)) {
      const candidate = Array.isArray(data?.candidates) ? data.candidates[0] : null,
        items_306 = Array.isArray(candidate?.content?.parts) ? candidate.content.parts : [],
        content_7 = items_306.map(part_4 => String(part_4?.text || "")).join(""),
        tool_calls_2 = items_306.map((value_311, value_312) => {
          const functionCall_313 = value_311?.functionCall;
          if (!functionCall_313?.name) return null;
          return {
            id: String(functionCall_313.id || "gemini-tool-" + Date.now() + "-" + value_312),
            type: "function",
            "function": {
              name: String(functionCall_313.name),
              arguments: JSON.stringify(functionCall_313.args || {})
            }
          };
        }).filter(Boolean),
        usage_2 = data?.usageMetadata || {};
      return {
        id: "gemini-" + Date.now(),
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model: model_3,
        choices: [{
          index: 0,
          message: {
            role: "assistant",
            content: content_7,
            ...(tool_calls_2.length ? {
              tool_calls: tool_calls_2
            } : {})
          },
          finish_reason: tool_calls_2.length ? "tool_calls" : mapFinishReason(candidate?.finishReason)
        }],
        usage: {
          prompt_tokens: Number(usage_2.promptTokenCount) || 0,
          completion_tokens: Number(usage_2.candidatesTokenCount) || 0,
          total_tokens: Number(usage_2.totalTokenCount) || 0
        }
      };
    }
    const items_301 = Array.isArray(data?.content) ? data.content : [],
      content_8 = items_301.filter(part_5 => part_5?.type === "text").map(part_6 => String(part_6.text || "")).join(""),
      tool_calls_3 = items_301.map(value_316 => value_316?.type === "tool_use" && value_316?.name ? {
        id: String(value_316.id || "anthropic-tool-" + Date.now()),
        type: "function",
        "function": {
          name: String(value_316.name),
          arguments: JSON.stringify(value_316.input || {})
        }
      } : null).filter(Boolean),
      value_304 = data?.usage || {};
    return {
      id: String(data?.id || "anthropic-" + Date.now()),
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: String(data?.model || model_3 || ""),
      choices: [{
        index: 0,
        message: {
          role: "assistant",
          content: content_8,
          ...(tool_calls_3.length ? {
            tool_calls: tool_calls_3
          } : {})
        },
        finish_reason: tool_calls_3.length ? "tool_calls" : mapFinishReason(data?.stop_reason)
      }],
      usage: {
        prompt_tokens: Number(value_304.input_tokens) || 0,
        completion_tokens: Number(value_304.output_tokens) || 0,
        total_tokens: (Number(value_304.input_tokens) || 0) + (Number(value_304.output_tokens) || 0)
      }
    };
  }
  function createCompatibleNativeResponse(response_2, adapter, data_2) {
    const payload = normalizeNativeResponse(adapter.provider, data_2, adapter.model),
      headers_4 = new Headers(response_2.headers);
    if (!adapter.stream) return headers_4.set("Content-Type", "application/json"), new Response(JSON.stringify(payload), {
      status: response_2.status,
      statusText: response_2.statusText,
      headers: headers_4
    });
    const choice = payload.choices[0] || {},
      content_6 = String(choice?.message?.content || ""),
      chunk = {
        id: payload.id,
        object: "chat.completion.chunk",
        created: payload.created,
        model: payload.model,
        choices: [{
          index: 0,
          delta: {
            content: content_6
          },
          finish_reason: null
        }]
      },
      finalChunk = {
        id: payload.id,
        object: "chat.completion.chunk",
        created: payload.created,
        model: payload.model,
        choices: [{
          index: 0,
          delta: {},
          finish_reason: choice.finish_reason || "stop"
        }],
        usage: payload.usage
      };
    return headers_4.set("Content-Type", "text/event-stream; charset=utf-8"), new Response("data: " + JSON.stringify(chunk) + "\n\ndata: " + JSON.stringify(finalChunk) + "\n\ndata: [DONE]\n\n", {
      status: response_2.status,
      statusText: response_2.statusText,
      headers: headers_4
    });
  }
  async function handleAction_51(value_326, value_327) {
    let body_6 = value_327.body;
    body_6 === undefined && value_326 instanceof Request && (body_6 = await value_326.clone().text());
    if (typeof body_6 !== "string" || !body_6.trim()) return null;
    try {
      return JSON.parse(body_6);
    } catch (value_329) {
      return null;
    }
  }
  function handleAction_52(value_330) {
    if (!value_330 || typeof value_330 !== "object" || Array.isArray(value_330) || !Array.isArray(value_330.messages)) return false;
    return value_330.messages.some(Boolean) && value_330.messages.every(message_331 => {
      const content_332 = message_331?.content;
      return content_332 == null || typeof content_332 === "string";
    });
  }
  function handleAction_53(value_333, body_7) {
    const value_335 = window.getApiConfig ? window.getApiConfig() : window.apiConfig,
      sanitizeApiConfig_28_336 = sanitizeApiConfig_2(value_335);
    if (!sanitizeApiConfig_28_336.endpoint || !sanitizeApiConfig_28_336.model || isGeminiProvider(sanitizeApiConfig_28_336.provider) || isAnthropicProvider(sanitizeApiConfig_28_336.provider)) return null;
    if (String(body_7?.model || "").trim() !== sanitizeApiConfig_28_336.model) return null;
    try {
      return normalizeApiEndpoint_2(sanitizeApiConfig_28_336.endpoint, sanitizeApiConfig_28_336.provider) === value_333 ? sanitizeApiConfig_28_336.frequencyPenalty : null;
    } catch (value_337) {
      return null;
    }
  }
  function handleAction_54(value_338, value_339, value_340, value_341) {
    if (!handleAction_52(value_340) || Object.prototype.hasOwnProperty.call(value_340, "frequency_penalty")) return false;
    const detectApiProviderFromEndpoint_23_342 = detectApiProviderFromEndpoint_2(value_338);
    if (isGeminiProvider(detectApiProviderFromEndpoint_23_342) || isAnthropicProvider(detectApiProviderFromEndpoint_23_342)) return false;
    const float_343 = Number.parseFloat(value_341),
      frequency_penalty_2 = Number.isFinite(float_343) ? Math.max(-2, Math.min(2, float_343)) : handleAction_53(value_338, value_340);
    if (!Number.isFinite(frequency_penalty_2) || frequency_penalty_2 === 0) return false;
    return value_340.frequency_penalty = frequency_penalty_2, true;
  }
  async function handleAction_55(networkArgs, value_346 = {}) {
    const {
      nativeAdapter = null,
      silentErrors = false,
      showGlobalErrors = false,
      isAiApiRequest = false,
      signal = null
    } = value_346;
    try {
      const response_3 = await originalFetch(...networkArgs);
      if (response_3.ok && nativeAdapter) try {
        const nativeData = await response_3.json();
        return createCompatibleNativeResponse(response_3, nativeAdapter, nativeData);
      } catch (value_351) {
        return response_3;
      }
      if (response_3.ok) return response_3;
      if (silentErrors || !showGlobalErrors || !isAiApiRequest) return response_3;
      const clonedResponse = response_3.clone();
      let rawBody_3 = "";
      try {
        rawBody_3 = await clonedResponse.text();
      } catch (value_352) {
        rawBody_3 = "[无法读取接口返回内容]";
      }
      return setTimeout(() => reportError_2(createHttpError_2(response_3, {
        rawBody: rawBody_3
      }), {
        operation: "API 请求"
      }), 0), response_3;
    } catch (value_353) {
      const value_354 = value_353?.name === "AbortError" || signal?.aborted === true;
      !silentErrors && showGlobalErrors && !value_354 && isAiApiRequest && setTimeout(() => reportError_2(value_353, {
        operation: "API 请求"
      }), 0);
      throw value_353;
    }
  }
  window.fetch = async function (...args_2) {
    const url_2 = args_2[0],
      requestInit = args_2[1] && typeof args_2[1] === "object" ? args_2[1] : {},
      headers_5 = requestInit.headers instanceof Headers ? requestInit.headers : new Headers(requestInit.headers || (url_2 instanceof Request ? url_2.headers : undefined)),
      silentErrors_3 = headers_5.get(INTERNAL_SILENT_ERROR_HEADER_2) === "1",
      showGlobalErrors_3 = headers_5.get(INTERNAL_GLOBAL_ERROR_HEADER_2) === "1",
      result_361 = headers_5.get(text_33);
    headers_5["delete"](INTERNAL_SILENT_ERROR_HEADER_2);
    headers_5["delete"](INTERNAL_GLOBAL_ERROR_HEADER_2);
    headers_5["delete"](text_33);
    let requestUrl_3 = "";
    try {
      requestUrl_3 = String(url_2 instanceof Request ? url_2.url : url_2 || "");
    } catch (value_368) {
      requestUrl_3 = "";
    }
    const isAiApiRequest_2 = /\/(?:chat\/completions|models)(?:[/?#]|$)/i.test(requestUrl_3);
    if (isAiApiRequest_2 && /\.openai\.azure\.com(?=\/|$)/i.test(requestUrl_3)) {
      const bearer_3 = String(headers_5.get("Authorization") || "").match(/^Bearer\s+(.+)$/i)?.[1] || "";
      if (bearer_3 && !headers_5.has("api-key")) headers_5.set("api-key", bearer_3);
      headers_5["delete"]("Authorization");
    }
    let nativeAdapter_3 = null,
      requestBody = null,
      enabled_366 = false;
    if (isAiApiRequest_2 && String(requestInit.method || (url_2 instanceof Request ? url_2.method : "GET")).toUpperCase() === "POST") {
      requestBody = await handleAction_51(url_2, requestInit);
      const handleAction_54_370 = handleAction_54(requestUrl_3, headers_5, requestBody, result_361);
      enabled_366 = handleAction_54_370;
      nativeAdapter_3 = createNativeRequestAdapter(requestUrl_3, headers_5, requestBody);
      if (nativeAdapter_3) requestUrl_3 = nativeAdapter_3.url;
    }
    let value_367;
    return url_2 instanceof Request ? value_367 = nativeAdapter_3 ? [new Request(requestUrl_3, {
      method: requestInit.method || url_2.method,
      headers: headers_5,
      body: JSON.stringify(nativeAdapter_3.body),
      signal: requestInit.signal || url_2.signal
    })] : [new Request(url_2, {
      ...requestInit,
      headers: headers_5,
      ...(enabled_366 ? {
        body: JSON.stringify(requestBody)
      } : {})
    })] : value_367 = [nativeAdapter_3 ? requestUrl_3 : url_2, {
      ...requestInit,
      headers: headers_5,
      ...(nativeAdapter_3 ? {
        body: JSON.stringify(nativeAdapter_3.body)
      } : enabled_366 ? {
        body: JSON.stringify(requestBody)
      } : {})
    }], handleAction_55(value_367, {
      nativeAdapter: nativeAdapter_3,
      silentErrors: silentErrors_3,
      showGlobalErrors: showGlobalErrors_3,
      isAiApiRequest: isAiApiRequest_2,
      signal: requestInit.signal
    });
  };
})();
