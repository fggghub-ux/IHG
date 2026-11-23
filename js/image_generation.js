(function () {
  const localValue1 = Object.freeze(["openai", "gemini", "novelai", "grok", "relay"]),
    localValue2 = 120000,
    localValue3 = Object.freeze({
      "activeProvider": "gemini",
      "providers": Object.freeze({
        "openai": Object.freeze({
          "endpoint": "https://api.openai.com/v1/images/generations",
          "apiKey": "",
          "model": "gpt-image-1.5",
          "size": "1024x1024",
          "models": []
        }),
        "gemini": Object.freeze({
          "endpoint": "https://generativelanguage.googleapis.com/v1beta/interactions",
          "apiKey": "",
          "model": "gemini-3.1-flash-image",
          "size": "1024x1024",
          "models": []
        }),
        "novelai": Object.freeze({
          "endpoint": "https://image.novelai.net/ai/generate-image",
          "apiKey": "",
          "model": "",
          "size": "1024x1024",
          "models": []
        }),
        "grok": Object.freeze({
          "endpoint": "https://api.x.ai/v1/images/generations",
          "apiKey": "",
          "model": "grok-imagine-image",
          "size": "1024x1024",
          "models": []
        }),
        "relay": Object.freeze({
          "endpoint": "",
          "apiKey": "",
          "model": "",
          "size": "1024x1024",
          "models": []
        })
      })
    });
  function localValue4(localValue31) {
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
        "endpoint": String(localValue42.endpoint ?? localValue41.endpoint).trim(),
        "apiKey": String(localValue42.apiKey ?? localValue41.apiKey).trim(),
        "model": String(localValue42.model ?? localValue41.model).trim(),
        "size": ["1024x1024", "1024x1536", "1536x1024"].includes(localValue42.size) ? localValue42.size : localValue41.size,
        "models": localValue35(localValue42.models)
      };
    }), {
      "activeProvider": localValue1.includes(localValue32.activeProvider) ? localValue32.activeProvider : localValue3.activeProvider,
      "providers": localValue34
    };
  }
  function localValue5() {
    const localValue43 = localValue4(typeof window.getImageGenerationConfig === "function" ? window.getImageGenerationConfig() : window.imageGenerationConfig);
    return window.imageGenerationConfig = localValue43, localValue43;
  }
  function localValue6() {
    const localValue44 = localValue5();
    return {
      "provider": localValue44.activeProvider,
      ...localValue44.providers[localValue44.activeProvider]
    };
  }
  function localValue7(localValue45, localValue46 = "生图接口地址") {
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
  function localValue8(localValue50) {
    const localValue51 = localValue7(localValue50),
      localValue52 = String(localValue51.pathname || "/").replace(/\/+$/, "") || "/";
    if (/\/images\/generations$/i.test(localValue52)) localValue51.pathname = localValue52;else /\/v\d+(?:[a-z0-9._-]*)?$/i.test(localValue52) ? localValue51.pathname = localValue52 + "/images/generations" : localValue51.pathname = (localValue52 === "/" ? "" : localValue52) + "/v1/images/generations";
    return localValue51.toString();
  }
  function localValue9(localValue53 = localValue6()) {
    if (!localValue1.includes(localValue53.provider)) throw new Error("请选择生图服务商");
    localValue7(localValue53.endpoint);
    if (!String(localValue53.apiKey || "").trim()) throw new Error(localValue53.provider === "novelai" ? "请填写 NovelAI Persistent API Token" : "请填写生图 API 密钥");
    if (!String(localValue53.model || "").trim()) throw new Error("请填写生图模型");
    return {
      "provider": localValue53.provider,
      "endpoint": String(localValue53.endpoint).trim(),
      "apiKey": String(localValue53.apiKey).trim(),
      "model": String(localValue53.model).trim(),
      "size": ["1024x1024", "1024x1536", "1536x1024"].includes(localValue53.size) ? localValue53.size : "1024x1024"
    };
  }
  function localValue10() {
    const localValue54 = window.u2Api?.["INTERNAL_SILENT_ERROR_HEADER"] || "X-U2-Silent-Errors";
    return {
      [localValue54]: "1"
    };
  }
  function localValue11(localValue55, localValue56 = "image/png") {
    const localValue57 = String(localValue55 || "").trim();
    if (!localValue57) return "";
    if (/^data:image\//i.test(localValue57)) return localValue57;
    return "data:" + (localValue56 || "image/png") + ";base64," + localValue57;
  }
  function localValue12(localValue58, localValue59 = "image/png") {
    const localValue60 = String(localValue58 || "").match(/^data:([^;,]+)[;,]/i);
    return localValue60?.[1] || localValue59;
  }
  async function localValue13(localValue61) {
    const localValue62 = String(localValue61 || "").trim();
    if (!localValue62) return "";
    if (/^data:image\//i.test(localValue62)) return localValue62;
    const localValue63 = await fetch(localValue62);
    if (!localValue63.ok) throw new Error("参考脸图片读取失败，请重新上传");
    const localValue64 = await localValue63.blob();
    if (!/^image\//i.test(localValue64.type || "")) throw new Error("参考脸文件不是有效图片");
    return new Promise((localValue65, localValue66) => {
      const localValue67 = new FileReader();
      localValue67.onload = () => localValue65(String(localValue67.result || "")), localValue67.onerror = () => localValue66(new Error("参考脸图片读取失败，请重新上传")), localValue67.readAsDataURL(localValue64);
    });
  }
  function localValue14(localValue68) {
    const localValue69 = String(localValue68 || "").match(/^data:([^;,]+);base64,(.+)$/i);
    if (!localValue69) throw new Error("参考脸图片格式无效，请重新上传");
    return {
      "mimeType": localValue69[1],
      "base64": localValue69[2]
    };
  }
  function localValue15(localValue70) {
    const {
        mimeType: localValue71,
        base64: localValue72
      } = localValue14(localValue70),
      localValue73 = atob(localValue72),
      localValue74 = new Uint8Array(localValue73.length);
    for (let localValue75 = 0; localValue75 < localValue73.length; localValue75 += 1) localValue74[localValue75] = localValue73.charCodeAt(localValue75);
    return new Blob([localValue74], {
      "type": localValue71
    });
  }
  function localValue16(localValue76) {
    const localValue77 = localValue7(localValue76),
      localValue78 = String(localValue77.pathname || "/").replace(/\/+$/, "") || "/";
    if (/\/images\/(?:generations|edits)$/i.test(localValue78)) localValue77.pathname = localValue78.replace(/\/images\/(?:generations|edits)$/i, "/images/edits");else /\/v\d+(?:[a-z0-9._-]*)?$/i.test(localValue78) ? localValue77.pathname = localValue78 + "/images/edits" : localValue77.pathname = (localValue78 === "/" ? "" : localValue78) + "/v1/images/edits";
    return localValue77.toString();
  }
  async function localValue17(localValue79, localValue80) {
    let localValue81 = null;
    if (window.u2Api?.["readApiError"]) localValue81 = await window.u2Api.readApiError(localValue79);
    const localValue82 = String(localValue81?.["message"] || localValue79.statusText || "").trim();
    return window.u2Api?.["createHttpError"]?.(localValue79, localValue81, localValue80 + " 生图失败") || Object.assign(new Error(localValue80 + " 生图失败（HTTP " + localValue79.status + (localValue82 ? "：" + localValue82 : "") + "）"), {
      "status": localValue79.status,
      "apiDetail": localValue82
    });
  }
  async function localValue18(localValue83, localValue84, localValue85, config) {
    const localValue86 = new AbortController(),
      localValue87 = setTimeout(() => {
        window.u2ApiConsole?.markTimeout(localValue86.signal);
        localValue86.abort();
      }, localValue2),
      listRequest = localValue84.method === "GET",
      trace = {
        service: listRequest ? "models" : "image",
        source: listRequest ? "设置 › 生图配置" : config.traceSource || "生图",
        purpose: listRequest ? "获取模型列表" : "生成图片",
        provider: config.provider,
        model: listRequest ? "" : config.model,
        tokenApplicable: !listRequest
      };
    try {
      const localValue88 = await fetch(localValue83, {
        ...localValue84,
        u2ApiTrace: trace,
        "signal": localValue86.signal
      });
      if (!localValue88.ok) throw await localValue17(localValue88, localValue85);
      return await localValue88.json();
    } catch (localValue89) {
      if (localValue89?.["name"] === "AbortError") throw Object.assign(new Error(localValue85 + " 生图超时，请稍后重试"), {
        "name": "TimeoutError"
      });
      if (localValue89 instanceof SyntaxError) throw new Error(localValue85 + " 返回了无法解析的数据");
      throw localValue89;
    } finally {
      clearTimeout(localValue87);
    }
  }
  function localValue19(localValue90) {
    if (!localValue90 || typeof localValue90 !== "object") return null;
    if (typeof localValue90.data === "string" && (/^image\//i.test(String(localValue90.mime_type || localValue90.mimeType || "")) || localValue90.type === "image" || localValue90.type === "output_image")) return {
      "base64": localValue90.data,
      "mimeType": localValue90.mime_type || localValue90.mimeType || "image/png"
    };
    if (localValue90.output_image && typeof localValue90.output_image.data === "string") return {
      "base64": localValue90.output_image.data,
      "mimeType": localValue90.output_image.mime_type || localValue90.output_image.mimeType || "image/png"
    };
    const localValue91 = localValue90.inline_data || localValue90.inlineData;
    if (localValue91 && typeof localValue91.data === "string") return {
      "base64": localValue91.data,
      "mimeType": localValue91.mime_type || localValue91.mimeType || "image/png"
    };
    const localValue92 = Array.isArray(localValue90) ? localValue90 : Object.values(localValue90);
    for (const localValue93 of localValue92) {
      const localValue94 = localValue19(localValue93);
      if (localValue94) return localValue94;
    }
    return null;
  }
  function localValue20(localValue95) {
    const localValue96 = Array.isArray(localValue95?.["data"]) ? localValue95.data[0] : null,
      localValue97 = localValue96?.["b64_json"] || localValue96?.["base64"] || localValue96?.["image"] || localValue95?.["b64_json"] || localValue95?.["base64"] || localValue95?.["image"],
      localValue98 = localValue96?.["mime_type"] || localValue96?.["mimeType"] || localValue95?.["mime_type"] || localValue95?.["mimeType"] || "image/png";
    if (localValue97) return {
      "imageUrl": localValue11(localValue97, localValue98),
      "mimeType": localValue98
    };
    const localValue99 = localValue96?.["url"] || localValue96?.["image_url"] || localValue95?.["url"] || localValue95?.["image_url"];
    if (localValue99) return {
      "imageUrl": String(localValue99),
      "mimeType": localValue98
    };
    return null;
  }
  async function localValue21(localValue100, localValue101, localValue102 = []) {
    const localValue103 = localValue101.size === "1024x1536" ? "2:3" : localValue101.size === "1536x1024" ? "3:2" : "1:1",
      localValue104 = [];
    for (const localValue107 of localValue102) {
      const localValue108 = localValue14(localValue107.imageUrl);
      localValue104.push({
        "type": "text",
        "text": (localValue107.role === "user" ? "User" : "Char") + " face identity reference:"
      }), localValue104.push({
        "type": "image",
        "data": localValue108.base64,
        "mime_type": localValue108.mimeType
      });
    }
    localValue104.push({
      "type": "text",
      "text": localValue102.length ? "Use each labeled face reference only for that person's identity. Do not copy its background, pose, or composition. " + localValue100 : localValue100
    });
    const localValue105 = await localValue18(localValue101.endpoint, {
        "method": "POST",
        "headers": {
          "Content-Type": "application/json",
          "x-goog-api-key": localValue101.apiKey,
          ...localValue10()
        },
        "body": JSON.stringify({
          "model": localValue101.model,
          "input": localValue104,
          "response_format": {
            "type": "image",
            "mime_type": "image/png",
            "aspect_ratio": localValue103,
            "image_size": "1K"
          }
        })
      }, "Gemini Image", localValue101),
      localValue106 = localValue19(localValue105);
    return localValue106 ? {
      "imageUrl": localValue11(localValue106.base64, localValue106.mimeType),
      "mimeType": localValue106.mimeType
    } : null;
  }
  async function localValue22(localValue109, localValue110, localValue111 = [], localValue112 = "") {
    const [localValue113, localValue114] = localValue110.size.split("x").map(Number);
    if (localValue111.length && !/4[-_.]?5/i.test(localValue110.model)) throw new Error("NovelAI 参考脸需要支持 Precise Reference 的 V4.5 图片模型");
    const localValue115 = localValue111.length ? {
        "director_reference_images": localValue111.map(localValue118 => localValue14(localValue118.imageUrl).base64),
        "director_reference_descriptions": localValue111.map(() => ({
          "caption": {
            "base_caption": "character",
            "char_captions": []
          },
          "legacy_uc": false,
          "use_coords": false,
          "use_order": true
        })),
        "director_reference_strength_values": localValue111.map(() => 0.75),
        "director_reference_secondary_strength_values": localValue111.map(() => 0.85),
        "director_reference_information_extracted": localValue111.map(() => 1)
      } : {},
      localValue116 = await localValue18(localValue110.endpoint, {
        "method": "POST",
        "headers": {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Bearer " + localValue110.apiKey,
          ...localValue10()
        },
        "body": JSON.stringify({
          "action": "generate",
          "input": localValue109,
          "model": localValue110.model,
          "parameters": {
            "prompt": localValue109,
            "width": localValue113,
            "height": localValue114,
            "n_samples": 1,
            "steps": 28,
            "scale": 5,
            "sampler": "k_euler_ancestral",
            "seed": Math.floor(Math.random() * 4294967295),
            "qualityToggle": true,
            "negative_prompt": localValue112,
            "image_format": "png",
            ...localValue115
          }
        })
      }, "NovelAI", localValue110),
      localValue117 = Array.isArray(localValue116?.["images"]) ? localValue116.images[0] : null;
    return localValue117?.["image"] ? {
      "imageUrl": localValue11(localValue117.image, "image/png"),
      "mimeType": "image/png"
    } : null;
  }
  async function localValue23(localValue119, localValue120, localValue121, localValue122, localValue123 = false) {
    const localValue124 = localValue16(localValue120.endpoint);
    if (localValue121 === "Grok") {
      const localValue126 = localValue122.map(localValue128 => ({
          "url": localValue128.imageUrl,
          "type": "image_url"
        })),
        localValue127 = await localValue18(localValue124, {
          "method": "POST",
          "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localValue120.apiKey,
            ...localValue10()
          },
          "body": JSON.stringify({
            "model": localValue120.model,
            "prompt": localValue119,
            ...(localValue126.length === 1 ? {
              "image": localValue126[0]
            } : {
              "images": localValue126
            }),
            "aspect_ratio": localValue120.size === "1024x1536" ? "2:3" : localValue120.size === "1536x1024" ? "3:2" : "1:1",
            "response_format": "b64_json"
          })
        }, localValue121, localValue120);
      return localValue20(localValue127);
    }
    const localValue125 = new FormData();
    for (const localValue129 of localValue122) {
      const localValue130 = localValue15(localValue129.imageUrl);
      localValue125.append(localValue122.length === 1 ? "image" : "image[]", localValue130, localValue129.role + "-face-reference." + (localValue130.type === "image/jpeg" ? "jpg" : "png"));
    }
    localValue125.append("model", localValue120.model), localValue125.append("prompt", localValue119), localValue125.append("n", "1"), localValue125.append("size", localValue120.size), localValue125.append("input_fidelity", "high"), localValue125.append("output_format", "png");
    try {
      const localValue131 = await localValue18(localValue124, {
        "method": "POST",
        "headers": {
          "Authorization": "Bearer " + localValue120.apiKey,
          ...localValue10()
        },
        "body": localValue125
      }, localValue121, localValue120);
      return localValue20(localValue131);
    } catch (localValue132) {
      if (localValue120.provider === "relay") {
        localValue132.message = "当前中转站不支持" + (localValue122.length > 1 ? "多张参考脸" : "参考脸") + "或图片编辑接口：" + (localValue132?.["message"] || "请求失败");
        throw localValue132;
      }
      throw localValue132;
    }
  }
  async function localValue24(localValue133, localValue134, localValue135, localValue136 = false, localValue137 = []) {
    if (localValue137.length) return localValue23(localValue133, localValue134, localValue135, localValue137, localValue136);
    const localValue138 = localValue136 ? localValue8(localValue134.endpoint) : localValue134.endpoint,
      localValue139 = {
        "model": localValue134.model,
        "prompt": localValue133,
        "n": 1
      };
    if (localValue136) {
      localValue139.size = localValue134.size;
      if (localValue135 === "OpenAI") localValue139.output_format = "png";else localValue139.response_format = "b64_json";
    } else localValue139.aspect_ratio = localValue134.size === "1024x1536" ? "2:3" : localValue134.size === "1536x1024" ? "3:2" : "1:1", localValue139.response_format = "b64_json";
    const localValue140 = await localValue18(localValue138, {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localValue134.apiKey,
        ...localValue10()
      },
      "body": JSON.stringify(localValue139)
    }, localValue135, localValue134);
    return localValue20(localValue140);
  }
  function localValue25(localValue141, localValue142) {
    const localValue143 = localValue7(localValue141),
      localValue144 = String(localValue143.pathname || "/").replace(/\/+$/, "") || "/";
    localValue143.search = "", localValue143.hash = "";
    if (localValue142 === "gemini") {
      const localValue145 = localValue144.match(/^(.*?\/v\d+(?:beta\d*|alpha\d*)?)(?:\/.*)?$/i);
      return localValue143.pathname = (localValue145?.[1] || "/v1beta") + "/models", localValue143.toString();
    }
    if (localValue142 === "grok") return localValue143.pathname = localValue144.replace(/\/images\/generations$/i, "/image-generation-models"), localValue143.toString();
    if (/\/models$/i.test(localValue144)) localValue143.pathname = localValue144;else {
      if (/\/images\/generations$/i.test(localValue144)) localValue143.pathname = localValue144.replace(/\/images\/generations$/i, "/models");else /\/v\d+(?:[a-z0-9._-]*)?$/i.test(localValue144) ? localValue143.pathname = localValue144 + "/models" : localValue143.pathname = (localValue144 === "/" ? "" : localValue144) + "/v1/models";
    }
    return localValue143.toString();
  }
  async function localValue26(localValue146 = localValue6()) {
    const localValue147 = localValue1.includes(localValue146?.["provider"]) ? localValue146.provider : localValue5().activeProvider,
      localValue148 = {
        "provider": localValue147,
        "endpoint": String(localValue146?.["endpoint"] || "").trim(),
        "apiKey": String(localValue146?.["apiKey"] || "").trim(),
        "model": String(localValue146?.["model"] || "").trim(),
        "size": localValue146?.["size"] || "1024x1024"
      };
    localValue7(localValue148.endpoint);
    if (!localValue148.apiKey) throw new Error(localValue147 === "novelai" ? "请填写 NovelAI Persistent API Token" : "请填写生图 API 密钥");
    if (localValue148.provider === "novelai") throw new Error("NovelAI 官方生图接口不提供模型列表，请手动填写模型");
    const localValue149 = localValue25(localValue148.endpoint, localValue148.provider),
      localValue150 = {
        ...localValue10()
      };
    if (localValue148.provider === "gemini") localValue150["x-goog-api-key"] = localValue148.apiKey;else localValue150.Authorization = "Bearer " + localValue148.apiKey;
    const localValue151 = localValue148.provider === "gemini" ? "Gemini Image" : localValue148.provider === "grok" ? "Grok" : localValue148.provider === "openai" ? "OpenAI" : "中转站",
      localValue152 = await localValue18(localValue149, {
        "method": "GET",
        "headers": localValue150
      }, localValue151, localValue148);
    let localValue153 = [];
    if (localValue148.provider === "gemini") localValue153 = Array.isArray(localValue152?.["models"]) ? localValue152.models : [];else {
      if (localValue148.provider === "grok") localValue153 = Array.isArray(localValue152?.["models"]) ? localValue152.models : [];else localValue153 = Array.isArray(localValue152?.["data"]) ? localValue152.data : Array.isArray(localValue152?.["models"]) ? localValue152.models : [];
    }
    let localValue154 = localValue153.map(localValue155 => typeof localValue155 === "string" ? localValue155 : localValue155?.["id"] || localValue155?.["name"] || "").map(localValue156 => String(localValue156 || "").replace(/^models\//, "").trim()).filter(Boolean);
    if (localValue148.provider === "gemini") {
      const localValue157 = localValue154.filter(localValue158 => /image|imagen/i.test(localValue158));
      if (localValue157.length) localValue154 = localValue157;
    }
    if (localValue148.provider === "openai") {
      const localValue159 = localValue154.filter(localValue160 => /gpt-image|dall-e|image/i.test(localValue160));
      if (localValue159.length) localValue154 = localValue159;
    }
    return Array.from(new Set(localValue154)).sort((localValue161, localValue162) => localValue161.localeCompare(localValue162));
  }
  async function localValue27(localValue163) {
    if (!localValue163?.["imageUrl"] || /^data:image\//i.test(localValue163.imageUrl)) return localValue163;
    try {
      const localValue164 = await window.u2ImageResources.readBlob(localValue163.imageUrl),
        localValue165 = await new Promise((localValue166, localValue167) => {
          const localValue168 = new FileReader();
          localValue168.onload = () => localValue166(String(localValue168.result || "")), localValue168.onerror = () => localValue167(localValue168.error || new Error("图片读取失败")), localValue168.readAsDataURL(localValue164);
        });
      return {
        "imageUrl": localValue165,
        "mimeType": localValue164.type || localValue163.mimeType || "image/png"
      };
    } catch (localValue169) {
      const localValue170 = "图片已生成，但本地缓存失败：" + (localValue169.message || "图片读取失败") + "。外链可能失效";
      return console.warn("[imageGeneration] Image localization failed:", localValue169), window.showToast?.(localValue170), {
        ...localValue163,
        "imageCacheWarning": localValue170
      };
    }
  }
  function localValue28(localValue171, localValue172 = 8000) {
    return String(localValue171 || "").trim().slice(0, localValue172);
  }
  function localValue29(localValue173, localValue174 = {}, localValue175 = "") {
    const localValue176 = localValue28(localValue173, 12000);
    if (!localValue176) throw new Error("请输入生图提示词");
    const localValue177 = localValue28(localValue174.basePrompt),
      localValue178 = localValue174.includeCharAppearance === false ? "" : localValue28(localValue174.charAppearance, 4000),
      localValue179 = localValue174.includeUserAppearance === false ? "" : localValue28(localValue174.userAppearance, 4000),
      localValue180 = localValue28(localValue174.artistPrompt, 4000),
      localValue181 = localValue28(localValue174.negativePrompt, 4000);
    if (localValue175 === "novelai") return {
      "scenePrompt": localValue176,
      "basePrompt": localValue177,
      "charAppearance": localValue178,
      "userAppearance": localValue179,
      "artistPrompt": localValue180,
      "negativePrompt": localValue181,
      "prompt": [localValue176, localValue177, localValue178, localValue179, localValue180].filter(Boolean).join(", ")
    };
    const localValue182 = ["生成一张连贯的图片，并按以下独立区域理解提示词。", "【画面提示词】\n" + localValue176, localValue177 ? "【基础正向提示词】\n" + localValue177 : "", localValue178 ? "【Char 外貌｜仅当画面包含 Char 时保持】\n" + localValue178 : "", localValue179 ? "【User 外貌｜仅当画面包含 User 时保持】\n" + localValue179 : "", localValue180 ? "【画风与画师串】\n" + localValue180 : "", localValue181 ? "NEGATIVE PROMPT — exclusion constraints only. Never depict or include any of the following elements; they are not subjects to draw:\n" + localValue181 : ""].filter(Boolean);
    return {
      "scenePrompt": localValue176,
      "basePrompt": localValue177,
      "charAppearance": localValue178,
      "userAppearance": localValue179,
      "artistPrompt": localValue180,
      "negativePrompt": localValue181,
      "prompt": localValue182.join("\n\n")
    };
  }
  async function localValue30(localValue183, localValue184 = {}) {
    const localValue185 = {
        ...localValue9(localValue184.config || localValue6()),
        traceSource: localValue184.traceSource
      },
      localValue186 = localValue29(localValue183, localValue184, localValue185.provider),
      localValue187 = Array.isArray(localValue184.referenceImages) ? localValue184.referenceImages : localValue184.referenceImage ? [{
        "role": "char",
        "imageUrl": localValue184.referenceImage
      }] : [],
      localValue188 = [],
      localValue189 = new Set();
    for (const localValue194 of localValue187) {
      const localValue195 = localValue194?.["role"] === "user" ? "user" : localValue194?.["role"] === "char" ? "char" : "";
      if (!localValue195 || localValue189.has(localValue195) || !localValue194?.["imageUrl"]) continue;
      localValue188.push({
        "role": localValue195,
        "imageUrl": await localValue13(localValue194.imageUrl)
      }), localValue189.add(localValue195);
    }
    const localValue190 = localValue188.map((localValue196, localValue197) => "Input image " + (localValue197 + 1) + " is the " + (localValue196.role === "user" ? "User" : "Char") + " face identity reference.").join(" "),
      localValue191 = localValue190 && localValue185.provider !== "novelai" ? localValue190 + " Use each face only for its assigned person; do not copy reference backgrounds or poses.\n\n" + localValue186.prompt : localValue186.prompt;
    let localValue192 = null;
    if (localValue185.provider === "gemini") localValue192 = await localValue21(localValue191, localValue185, localValue188);
    if (localValue185.provider === "novelai") localValue192 = await localValue22(localValue191, localValue185, localValue188, localValue186.negativePrompt);
    if (localValue185.provider === "grok") localValue192 = await localValue24(localValue191, localValue185, "Grok", false, localValue188);
    if (localValue185.provider === "openai") localValue192 = await localValue24(localValue191, localValue185, "OpenAI", true, localValue188);
    if (localValue185.provider === "relay") localValue192 = await localValue24(localValue191, localValue185, "中转站", true, localValue188);
    if (!localValue192?.["imageUrl"]) throw new Error("生图接口返回成功，但没有找到图片数据");
    const localValue193 = await localValue27(localValue192);
    return {
      "imageUrl": localValue193.imageUrl,
      "mimeType": localValue193.mimeType || localValue12(localValue193.imageUrl),
      "imageCacheWarning": localValue193.imageCacheWarning || "",
      "provider": localValue185.provider,
      "model": localValue185.model,
      "size": localValue185.size,
      "faceReferenceUsed": localValue188.length > 0,
      "charFaceReferenceUsed": localValue188.some(localValue198 => localValue198.role === "char"),
      "userFaceReferenceUsed": localValue188.some(localValue199 => localValue199.role === "user"),
      "compiledPrompt": localValue191,
      "promptParts": {
        "scenePrompt": localValue186.scenePrompt,
        "basePrompt": localValue186.basePrompt,
        "charAppearance": localValue186.charAppearance,
        "userAppearance": localValue186.userAppearance,
        "artistPrompt": localValue186.artistPrompt,
        "negativePrompt": localValue186.negativePrompt
      }
    };
  }
  window.imageGenerationConfig = localValue4(window.imageGenerationConfig), window.u2ImageGeneration = Object.freeze({
    "PROVIDERS": localValue1,
    "DEFAULT_CONFIG": localValue3,
    "REQUEST_TIMEOUT_MS": localValue2,
    "normalizeConfig": localValue4,
    "getConfig": localValue5,
    "getActiveConfig": localValue6,
    "compilePromptForProvider": localValue29,
    "validateActiveConfig": localValue9,
    "resolveImagesEndpoint": localValue8,
    "resolveEditsEndpoint": localValue16,
    "parseOpenAiImage": localValue20,
    "findGeminiImage": localValue19,
    "resolveModelsEndpoint": localValue25,
    "fetchModels": localValue26,
    "generate": localValue30
  });
})();
