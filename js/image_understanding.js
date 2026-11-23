(function () {
  const localValue1 = Object.freeze(["openai", "gemini", "claude", "grok", "qwen", "zhipu", "openai-compatible"]),
    localValue2 = 60000,
    localValue3 = Object.freeze({
      "activeProvider": "gemini",
      "providers": Object.freeze({
        "openai": Object.freeze({
          "endpoint": "https://api.openai.com/v1/chat/completions",
          "apiKey": "",
          "model": "",
          "models": []
        }),
        "gemini": Object.freeze({
          "endpoint": "https://generativelanguage.googleapis.com/v1beta/interactions",
          "apiKey": "",
          "model": "",
          "models": []
        }),
        "claude": Object.freeze({
          "endpoint": "https://api.anthropic.com/v1/messages",
          "apiKey": "",
          "model": "",
          "models": []
        }),
        "grok": Object.freeze({
          "endpoint": "https://api.x.ai/v1/chat/completions",
          "apiKey": "",
          "model": "",
          "models": []
        }),
        "qwen": Object.freeze({
          "endpoint": "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
          "apiKey": "",
          "model": "",
          "models": []
        }),
        "zhipu": Object.freeze({
          "endpoint": "https://open.bigmodel.cn/api/paas/v4/chat/completions",
          "apiKey": "",
          "model": "",
          "models": []
        }),
        "openai-compatible": Object.freeze({
          "endpoint": "",
          "apiKey": "",
          "model": "",
          "models": []
        })
      })
    }),
    localValue4 = "Analyze this image for a fictional X/Twitter feed. Return JSON only, with this exact shape:\n{\"summary\":\"\",\"visibleText\":[],\"subjects\":[],\"scene\":\"\",\"mood\":\"\",\"notableDetails\":[]}\nRules: describe only visible facts; transcribe text only when readable; do not identify real people, infer private attributes, or invent events. Keep every value concise and useful for generating natural social-media reactions.";
  function localValue5(localValue31) {
    if (typeof window.u2Api?.["normalizeVisionConfig"] === "function") return window.u2Api.normalizeVisionConfig(localValue31);
    const localValue32 = localValue31 && typeof localValue31 === "object" ? localValue31 : {},
      localValue33 = localValue32.providers && typeof localValue32.providers === "object" ? localValue32.providers : {},
      localValue34 = {},
      localValue35 = localValue36 => {
        const localValue37 = new Set();
        return (Array.isArray(localValue36) ? localValue36 : []).map(localValue38 => String(localValue38 || "").trim().slice(0, 256)).filter(localValue39 => localValue39 && !localValue37.has(localValue39) && (localValue37.add(localValue39) || true)).slice(0, 100);
      };
    return localValue1.forEach(localValue40 => {
      const localValue41 = localValue3.providers[localValue40],
        localValue42 = localValue33[localValue40] && typeof localValue33[localValue40] === "object" ? localValue33[localValue40] : {};
      localValue34[localValue40] = {
        "endpoint": String(localValue42.endpoint ?? localValue41.endpoint).trim().slice(0, 1024),
        "apiKey": String(localValue42.apiKey || "").trim().slice(0, 512),
        "model": String(localValue42.model || "").trim().slice(0, 256),
        "models": localValue35(localValue42.models)
      };
    }), {
      "activeProvider": localValue1.includes(localValue32.activeProvider) ? localValue32.activeProvider : localValue3.activeProvider,
      "providers": localValue34
    };
  }
  function localValue6() {
    const localValue43 = localValue5(typeof window.getVisionConfig === "function" ? window.getVisionConfig() : window.visionConfig);
    return window.visionConfig = localValue43, localValue43;
  }
  function localValue7() {
    const localValue44 = localValue6();
    return {
      "provider": localValue44.activeProvider,
      ...localValue44.providers[localValue44.activeProvider]
    };
  }
  function localValue8(localValue45, localValue46 = "识图接口地址") {
    if (window.u2Api?.["parseHttpUrl"]) return window.u2Api.parseHttpUrl(localValue45, localValue46);
    const localValue47 = String(localValue45 || "").trim();
    if (!localValue47) throw new Error("请填写" + localValue46);
    let localValue48;
    try {
      localValue48 = new URL(localValue47);
    } catch (localValue49) {
      throw new Error(localValue46 + "格式无效");
    }
    if (!["http:", "https:"].includes(localValue48.protocol)) throw new Error(localValue46 + "仅支持 HTTP 或 HTTPS");
    return localValue48;
  }
  function localValue9(localValue50) {
    const localValue51 = localValue8(localValue50),
      localValue52 = String(localValue51.pathname || "/").replace(/\/+$/, "") || "/";
    if (/\/chat\/completions$/i.test(localValue52)) localValue51.pathname = localValue52;else {
      if (/\/v\d+(?:[a-z0-9._-]*)?$/i.test(localValue52)) localValue51.pathname = localValue52 + "/chat/completions";else localValue51.pathname = (localValue52 === "/" ? "" : localValue52) + "/v1/chat/completions";
    }
    return localValue51.toString();
  }
  function localValue10(localValue53, localValue54) {
    const localValue55 = localValue8(localValue53),
      localValue56 = String(localValue55.pathname || "/").replace(/\/+$/, "") || "/";
    if (localValue54 === "gemini") {
      const localValue57 = localValue56.match(/^(.*\/v\d+(?:beta|alpha)?)(?:\/.*)?$/i)?.[1] || "/v1beta";
      return localValue55.pathname = localValue57 + "/models", localValue55.toString();
    }
    if (/\/models$/i.test(localValue56)) localValue55.pathname = localValue56;else {
      if (/\/(?:chat\/completions|messages)$/i.test(localValue56)) localValue55.pathname = localValue56.replace(/\/(?:chat\/completions|messages)$/i, "/models");else {
        if (/\/v\d+(?:[a-z0-9._-]*)?$/i.test(localValue56)) localValue55.pathname = localValue56 + "/models";else localValue55.pathname = (localValue56 === "/" ? "" : localValue56) + "/v1/models";
      }
    }
    return localValue55.toString();
  }
  function localValue11(localValue58 = localValue7()) {
    if (!localValue1.includes(localValue58?.["provider"])) throw new Error("请选择识图服务商");
    const localValue59 = localValue8(localValue58.endpoint).toString(),
      localValue60 = String(localValue58.apiKey || "").trim(),
      localValue61 = String(localValue58.model || "").trim();
    if (!localValue60) throw new Error("请填写识图 API 密钥");
    if (!localValue61) throw new Error("请填写识图模型");
    return {
      "provider": localValue58.provider,
      "endpoint": localValue59,
      "apiKey": localValue60,
      "model": localValue61
    };
  }
  function localValue12(localValue62 = localValue7()) {
    try {
      return localValue11(localValue62), true;
    } catch (localValue63) {
      return false;
    }
  }
  function localValue13() {
    const localValue64 = window.u2Api?.["INTERNAL_SILENT_ERROR_HEADER"] || "X-U2-Silent-Errors";
    return {
      [localValue64]: "1"
    };
  }
  async function localValue14(localValue65, localValue66) {
    const localValue67 = window.u2Api?.["readApiError"] ? await window.u2Api.readApiError(localValue65) : {
        "message": await localValue65.text()["catch"](() => "")
      },
      localValue68 = String(localValue67?.["message"] || localValue65.statusText || "").trim();
    return window.u2Api?.["createHttpError"]?.(localValue65, localValue67, localValue66 + " 识图失败") || Object.assign(new Error(localValue66 + " 识图失败（HTTP " + localValue65.status + (localValue68 ? "：" + localValue68 : "") + "）"), {
      "status": localValue65.status,
      "apiDetail": localValue68
    });
  }
  async function localValue15(localValue69, localValue70, localValue71, trace, localValue72) {
    const localValue73 = new AbortController();
    let localValue74 = false;
    const localValue75 = () => localValue73.abort();
    localValue72?.["throwIfAborted"]?.(), localValue72?.["addEventListener"]("abort", localValue75, {
      "once": true
    });
    const localValue76 = setTimeout(() => {
      window.u2ApiConsole?.markTimeout(localValue73.signal);
      localValue74 = true, localValue73.abort();
    }, localValue2);
    try {
      const localValue77 = await fetch(localValue69, {
        ...localValue70,
        u2ApiTrace: trace,
        "signal": localValue73.signal
      });
      if (!localValue77.ok) throw await localValue14(localValue77, localValue71);
      const localValue78 = await localValue77.json();
      return localValue72?.["throwIfAborted"]?.(), localValue78;
    } catch (localValue79) {
      localValue72?.["throwIfAborted"]?.();
      if (localValue74) throw Object.assign(new Error(localValue71 + " 识图超时，请稍后重试"), {
        "name": "TimeoutError"
      });
      if (localValue79 instanceof SyntaxError) throw new Error(localValue71 + " 返回了无法解析的数据");
      throw localValue79;
    } finally {
      clearTimeout(localValue76), localValue72?.["removeEventListener"]("abort", localValue75);
    }
  }
  function localValue16(localValue80) {
    const localValue81 = String(typeof localValue80 === "string" ? localValue80 : localValue80?.["url"] || "").trim();
    if (!localValue81) throw new Error("没有可供识别的图片");
    if (/^data:image\//i.test(localValue81)) {
      const localValue82 = localValue81.match(/^data:([^;,]+);base64,(.+)$/i);
      if (!localValue82) throw new Error("图片数据格式无效");
      return {
        "kind": "base64",
        "value": localValue81,
        "mimeType": localValue82[1],
        "base64": localValue82[2]
      };
    }
    if (!/^https?:\/\//i.test(localValue81)) throw new Error("图片地址仅支持 http(s) URL 或 data URL");
    return {
      "kind": "url",
      "value": localValue81,
      "mimeType": String(localValue80?.["mimeType"] || "").trim()
    };
  }
  function localValue17(localValue83) {
    const localValue84 = String(localValue83 || "").match(/^data:([^;,]+);base64,(.+)$/i);
    if (!localValue84) throw new Error("图片数据格式无效");
    return {
      "mimeType": localValue84[1],
      "base64": localValue84[2]
    };
  }
  async function localValue18(localValue85, localValue86) {
    localValue86?.["throwIfAborted"]?.();
    const localValue87 = await fetch(localValue85, {
      "headers": localValue13(),
      "signal": localValue86
    });
    if (!localValue87.ok) throw new Error("远程图片无法读取");
    const localValue88 = await localValue87.blob();
    if (!/^image\//i.test(localValue88.type || "")) throw new Error("远程地址不是有效图片");
    return new Promise((localValue89, localValue90) => {
      const localValue91 = new FileReader(),
        localValue92 = () => localValue91.abort(),
        localValue93 = (localValue94, localValue95) => {
          localValue86?.["removeEventListener"]("abort", localValue92), localValue94(localValue95);
        };
      localValue91.onload = () => localValue93(localValue89, String(localValue91.result || "")), localValue91.onerror = () => localValue93(localValue90, new Error("远程图片读取失败")), localValue91.onabort = () => localValue93(localValue90, Object.assign(new Error("图片读取已取消"), {
        "name": "AbortError"
      })), localValue86?.["throwIfAborted"]?.(), localValue86?.["addEventListener"]("abort", localValue92, {
        "once": true
      }), localValue91.readAsDataURL(localValue88);
    });
  }
  function localValue19(localValue96) {
    if (typeof localValue96 === "string") return localValue96;
    if (!Array.isArray(localValue96)) return "";
    return localValue96.map(localValue97 => {
      if (typeof localValue97 === "string") return localValue97;
      return String(localValue97?.["text"] || localValue97?.["content"] || "");
    }).filter(Boolean).join("\n");
  }
  function localValue20(localValue98) {
    const localValue99 = localValue98?.["choices"]?.[0]?.["message"]?.["content"];
    if (typeof localValue99 === "string" && localValue99.trim()) return localValue99.trim();
    if (typeof localValue98?.["choices"]?.[0]?.["text"] === "string" && localValue98.choices[0].text.trim()) return localValue98.choices[0].text.trim();
    if (typeof localValue98?.["output_text"] === "string" && localValue98.output_text.trim()) return localValue98.output_text.trim();
    return localValue19(localValue99).trim();
  }
  function localValue21(localValue100) {
    return localValue19(localValue100?.["content"]).trim();
  }
  function localValue22(localValue101) {
    const localValue102 = localValue101?.["candidates"]?.[0]?.["content"]?.["parts"];
    if (Array.isArray(localValue102)) return localValue102.filter(localValue104 => localValue104?.["thought"] !== true).map(localValue105 => String(localValue105?.["text"] || "")).join("\n").trim();
    if (typeof localValue101?.["output_text"] === "string") return localValue101.output_text.trim();
    const localValue103 = [localValue101?.["output"], localValue101?.["candidates"], localValue101?.["content"]].filter(Boolean);
    while (localValue103.length) {
      const localValue106 = localValue103.shift();
      if (Array.isArray(localValue106)) {
        localValue103.push(...localValue106);
        continue;
      }
      if (!localValue106 || typeof localValue106 !== "object") continue;
      if (typeof localValue106.text === "string" && /output_text|text/i.test(String(localValue106.type || ""))) return localValue106.text.trim();
      if (typeof localValue106.output_text === "string") return localValue106.output_text.trim();
      Object.values(localValue106).forEach(localValue107 => {
        if (localValue107 && typeof localValue107 === "object") localValue103.push(localValue107);
      });
    }
    return "";
  }
  function localValue23(localValue108) {
    const localValue109 = String(localValue108 || "").trim();
    if (!localValue109) throw new Error("识图模型没有返回内容");
    try {
      return JSON.parse(localValue109);
    } catch (localValue110) {
      const localValue111 = localValue109.match(/```(?:json)?\s*([\s\S]*?)```/i) || localValue109.match(/(\{[\s\S]*\})/);
      if (!localValue111) throw new Error("识图模型未返回有效 JSON");
      try {
        return JSON.parse(localValue111[1]);
      } catch (localValue112) {
        throw new Error("识图模型未返回有效 JSON");
      }
    }
  }
  function localValue24(localValue113, localValue114 = 300) {
    return String(localValue113 || "").replace(/\s+/g, " ").trim().slice(0, localValue114);
  }
  function localValue25(localValue115, localValue116 = 12, localValue117 = 160) {
    const localValue118 = Array.isArray(localValue115) ? localValue115 : localValue115 ? [localValue115] : [],
      localValue119 = new Set();
    return localValue118.map(localValue120 => localValue24(localValue120, localValue117)).filter(localValue121 => localValue121 && !localValue119.has(localValue121) && (localValue119.add(localValue121) || true)).slice(0, localValue116);
  }
  function localValue26(localValue122, localValue123) {
    const localValue124 = localValue122 && typeof localValue122 === "object" && !Array.isArray(localValue122) ? localValue122 : {},
      localValue125 = {
        "status": "ready",
        "summary": localValue24(localValue124.summary, 500),
        "visibleText": localValue25(localValue124.visibleText, 12, 200),
        "subjects": localValue25(localValue124.subjects, 12, 160),
        "scene": localValue24(localValue124.scene, 300),
        "mood": localValue24(localValue124.mood, 120),
        "notableDetails": localValue25(localValue124.notableDetails, 12, 160),
        "provider": localValue123.provider,
        "model": localValue123.model,
        "analyzedAt": Date.now()
      };
    if (!localValue125.summary && !localValue125.scene && localValue125.subjects.length === 0 && localValue125.notableDetails.length === 0) throw new Error("识图结果缺少可用画面摘要");
    return localValue125;
  }
  function localValue27(localValue126) {
    return {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localValue126.apiKey,
      ...localValue13()
    };
  }
  function localValue28(localValue127) {
    const localValue128 = localValue127 && typeof localValue127 === "object" ? localValue127 : {},
      localValue129 = localValue8(localValue128.endpoint),
      localValue130 = localValue128.provider || (localValue129.hostname === "generativelanguage.googleapis.com" ? "gemini" : localValue129.hostname === "api.anthropic.com" ? "anthropic" : "openai-compatible"),
      localValue131 = {
        "provider": localValue130 === "anthropic" ? "claude" : localValue1.includes(localValue130) ? localValue130 : "openai-compatible",
        "endpoint": localValue129.toString(),
        "apiKey": localValue128.apiKey,
        "model": localValue128.model
      };
    if (localValue131.provider === "gemini") {
      const localValue132 = localValue129.pathname.match(/^(.*\/v\d+(?:beta|alpha)?\d*)(?:\/|$)/i)?.[1] || "/v1beta",
        localValue133 = String(localValue128.model || "").trim().replace(/^models\//i, "");
      localValue129.pathname = localValue132 + "/models/" + encodeURIComponent(localValue133) + ":generateContent", localValue129.search = "", localValue129.hash = "", localValue131.endpoint = localValue129.toString();
    } else {
      if (localValue131.provider === "claude") {
        const localValue134 = localValue129.pathname.match(/^(.*\/v\d+)(?:\/|$)/i)?.[1] || "/v1";
        localValue129.pathname = localValue134 + "/messages", localValue129.search = "", localValue129.hash = "", localValue131.endpoint = localValue129.toString();
      }
    }
    return localValue11(localValue131);
  }
  async function localValue29(localValue135, localValue136 = {}) {
    localValue136.signal?.["throwIfAborted"]?.();
    const localValue137 = localValue11(localValue136.config || localValue7()),
      localValue138 = localValue16(localValue135),
      localValue139 = typeof localValue136.prompt === "string" && localValue136.prompt.trim() ? localValue136.prompt.trim().slice(0, 4000) : localValue4,
      localValue140 = Math.min(4096, Math.max(600, Math.round(Number(localValue136.maxTokens) || 600)));
    const trace = {
      service: "vision",
      source: localValue136.traceSource || "识图",
      purpose: "识别图片",
      provider: localValue137.provider === "claude" ? "anthropic" : localValue137.provider,
      model: localValue137.model
    };
    let localValue141,
      localValue142 = "";
    if (localValue137.provider === "gemini") {
      const localValue143 = /:generateContent(?:\?|$)/i.test(localValue137.endpoint),
        localValue144 = localValue143 && localValue138.kind !== "base64" ? await localValue18(localValue138.value, localValue136.signal) : "",
        localValue145 = localValue143 ? localValue144 ? localValue17(localValue144) : localValue138 : null,
        localValue146 = localValue138.kind === "base64" ? {
          "type": "image",
          "data": localValue138.base64,
          "mime_type": localValue138.mimeType
        } : {
          "type": "image",
          "uri": localValue138.value,
          "mime_type": localValue138.mimeType || undefined
        };
      localValue141 = await localValue15(localValue137.endpoint, {
        "method": "POST",
        "headers": {
          "Content-Type": "application/json",
          "x-goog-api-key": localValue137.apiKey,
          ...localValue13()
        },
        "body": JSON.stringify(localValue143 ? {
          "contents": [{
            "role": "user",
            "parts": [{
              "text": localValue139
            }, {
              "inlineData": {
                "mimeType": localValue145.mimeType,
                "data": localValue145.base64
              }
            }]
          }],
          "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": localValue140,
            ...(localValue136.raw ? {} : {
              "responseMimeType": "application/json"
            })
          }
        } : {
          "model": localValue137.model,
          "input": [{
            "type": "text",
            "text": localValue139
          }, localValue146],
          ...(localValue136.raw ? {} : {
            "response_format": {
              "type": "text",
              "mime_type": "application/json"
            }
          })
        })
      }, "Gemini", trace, localValue136.signal), localValue142 = localValue22(localValue141);
    } else {
      if (localValue137.provider === "claude") {
        const localValue147 = localValue138.kind === "base64" ? localValue138.value : await localValue18(localValue138.value, localValue136.signal),
          localValue148 = localValue17(localValue147);
        localValue141 = await localValue15(localValue137.endpoint, {
          "method": "POST",
          "headers": {
            "Content-Type": "application/json",
            "x-api-key": localValue137.apiKey,
            "anthropic-version": "2023-06-01",
            ...localValue13()
          },
          "body": JSON.stringify({
            "model": localValue137.model,
            "max_tokens": localValue140,
            "temperature": 0.2,
            "system": localValue136.raw ? "Describe only visible facts. Do not invent details." : "You are a precise image-analysis service. Output JSON only.",
            "messages": [{
              "role": "user",
              "content": [{
                "type": "image",
                "source": {
                  "type": "base64",
                  "media_type": localValue148.mimeType,
                  "data": localValue148.base64
                }
              }, {
                "type": "text",
                "text": localValue139
              }]
            }]
          })
        }, "Claude", trace, localValue136.signal), localValue142 = localValue21(localValue141);
      } else {
        const localValue149 = localValue137.provider === "openai" ? "OpenAI" : localValue137.provider === "grok" ? "Grok" : localValue137.provider === "qwen" ? "Qwen / DashScope" : localValue137.provider === "zhipu" ? "智谱 GLM" : "OpenAI 兼容服务";
        localValue141 = await localValue15(localValue9(localValue137.endpoint), {
          "method": "POST",
          "headers": localValue27(localValue137),
          "body": JSON.stringify({
            "model": localValue137.model,
            "temperature": 0.2,
            "max_tokens": localValue140,
            ...(localValue136.raw ? {} : {
              "response_format": {
                "type": "json_object"
              }
            }),
            "messages": [{
              "role": "system",
              "content": localValue136.raw ? "Describe only visible facts. Do not invent details." : "You are a precise image-analysis service. Output JSON only."
            }, {
              "role": "user",
              "content": [{
                "type": "text",
                "text": localValue139
              }, {
                "type": "image_url",
                "image_url": {
                  "url": localValue138.value
                }
              }]
            }]
          })
        }, localValue149, trace, localValue136.signal), localValue142 = localValue20(localValue141);
      }
    }
    localValue136.signal?.["throwIfAborted"]?.();
    if (!localValue142.trim()) throw new Error("识图模型没有返回内容");
    return localValue136.raw ? localValue142.trim() : localValue26(localValue23(localValue142), localValue137);
  }
  async function localValue30(localValue150 = localValue7()) {
    const localValue151 = localValue1.includes(localValue150?.["provider"]) ? localValue150.provider : localValue6().activeProvider,
      localValue152 = {
        "provider": localValue151,
        "endpoint": String(localValue150?.["endpoint"] || "").trim(),
        "apiKey": String(localValue150?.["apiKey"] || "").trim()
      };
    localValue8(localValue152.endpoint);
    if (!localValue152.apiKey) throw new Error("请填写识图 API 密钥");
    const localValue153 = {
      ...localValue13()
    };
    if (localValue151 === "gemini") localValue153["x-goog-api-key"] = localValue152.apiKey;else {
      if (localValue151 === "claude") localValue153["x-api-key"] = localValue152.apiKey, localValue153["anthropic-version"] = "2023-06-01";else localValue153.Authorization = "Bearer " + localValue152.apiKey;
    }
    const localValue154 = await localValue15(localValue10(localValue152.endpoint, localValue151), {
        "method": "GET",
        "headers": localValue153
      }, "识图服务", {
        service: "models",
        source: "设置 › 识图配置",
        purpose: "获取模型列表",
        provider: localValue151,
        tokenApplicable: false
      }),
      localValue155 = Array.isArray(localValue154?.["data"]) ? localValue154.data : Array.isArray(localValue154?.["models"]) ? localValue154.models : [],
      localValue156 = localValue155.map(localValue157 => typeof localValue157 === "string" ? localValue157 : localValue157?.["id"] || localValue157?.["name"] || localValue157?.["model"] || "").map(localValue158 => String(localValue158 || "").replace(/^models\//, "").trim()).filter(Boolean);
    return Array.from(new Set(localValue156)).sort((localValue159, localValue160) => localValue159.localeCompare(localValue160));
  }
  window.visionConfig = localValue5(window.visionConfig), window.u2ImageUnderstanding = Object.freeze({
    "PROVIDERS": localValue1,
    "DEFAULT_CONFIG": localValue3,
    "REQUEST_TIMEOUT_MS": localValue2,
    "normalizeConfig": localValue5,
    "getConfig": localValue6,
    "getActiveConfig": localValue7,
    "configFromChatApi": localValue28,
    "validateActiveConfig": localValue11,
    "isConfigured": localValue12,
    "resolveChatEndpoint": localValue9,
    "resolveModelsEndpoint": localValue10,
    "parseJsonPayload": localValue23,
    "normalizeAnalysis": localValue26,
    "fetchModels": localValue30,
    "analyze": localValue29
  });
})();
