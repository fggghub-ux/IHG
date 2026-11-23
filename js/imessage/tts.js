(function () {
  const localValue1 = Object.freeze(["minimax", "openai", "openai-compatible", "elevenlabs", "fish-audio", "azure", "google", "aws-polly", "volcengine", "dashscope", "tencent", "baidu", "xfyun"]),
    localValue2 = Object.freeze({
      "minimax": {
        "label": "MiniMax",
        "endpoint": "https://api.minimax.chat",
        "keyLabel": "API Key",
        "modelLabel": "TTS 模型",
        "fields": [{
          "key": "region",
          "label": "区域",
          "type": "select",
          "options": [["cn", "国内版"], ["intl", "海外版"]]
        }, {
          "key": "groupId",
          "label": "Group ID",
          "placeholder": "旧版凭据可填写 Group ID",
          "optional": true
        }]
      },
      "openai": {
        "label": "OpenAI",
        "endpoint": "https://api.openai.com/v1",
        "keyLabel": "OpenAI API Key",
        "modelLabel": "TTS 模型",
        "fields": []
      },
      "openai-compatible": {
        "label": "OpenAI 兼容中转站",
        "endpoint": "",
        "keyLabel": "中转 API Key",
        "modelLabel": "TTS 模型",
        "fields": []
      },
      "elevenlabs": {
        "label": "ElevenLabs",
        "endpoint": "https://api.elevenlabs.io/v1",
        "keyLabel": "ElevenLabs API Key",
        "modelLabel": "TTS 模型",
        "fields": []
      },
      "fish-audio": {
        "label": "Fish Audio",
        "endpoint": "https://api.fish.audio",
        "keyLabel": "Fish Audio API Key",
        "modelLabel": "TTS 模型",
        "fields": []
      },
      "azure": {
        "label": "Azure Speech",
        "endpoint": "",
        "keyLabel": "Speech Key",
        "modelLabel": "默认音色",
        "modelIsVoice": true,
        "fields": [{
          "key": "region",
          "label": "区域",
          "placeholder": "例如 eastasia"
        }]
      },
      "google": {
        "label": "Google Cloud TTS",
        "endpoint": "https://texttospeech.googleapis.com/v1",
        "keyLabel": "Google API Key",
        "modelLabel": "默认音色",
        "modelIsVoice": true,
        "fields": []
      },
      "aws-polly": {
        "label": "AWS Polly",
        "endpoint": "",
        "keyLabel": "Access Key ID",
        "modelLabel": "默认音色",
        "modelIsVoice": true,
        "fields": [{
          "key": "region",
          "label": "区域",
          "placeholder": "例如 ap-east-1"
        }, {
          "key": "secretKey",
          "label": "Secret Access Key",
          "type": "password"
        }, {
          "key": "sessionToken",
          "label": "Session Token",
          "type": "password",
          "optional": true
        }]
      },
      "volcengine": {
        "label": "火山引擎 / 豆包语音",
        "endpoint": "https://openspeech.bytedance.com/api/v1/tts",
        "keyLabel": "Access Token",
        "modelLabel": "业务集群",
        "fields": [{
          "key": "appId",
          "label": "App ID"
        }]
      },
      "dashscope": {
        "label": "阿里云 DashScope",
        "endpoint": "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation",
        "keyLabel": "DashScope API Key",
        "modelLabel": "TTS 模型",
        "fields": []
      },
      "tencent": {
        "label": "腾讯云 TTS",
        "endpoint": "wss://tts.cloud.tencent.com/stream_ws",
        "keyLabel": "SecretId",
        "modelLabel": "默认音色",
        "modelIsVoice": true,
        "fields": [{
          "key": "appId",
          "label": "App ID"
        }, {
          "key": "secretKey",
          "label": "SecretKey",
          "type": "password"
        }, {
          "key": "region",
          "label": "区域",
          "placeholder": "例如 ap-beijing"
        }]
      },
      "baidu": {
        "label": "百度智能云 TTS",
        "endpoint": "https://tsn.baidu.com/text2audio",
        "keyLabel": "API Key",
        "modelLabel": "默认音色",
        "modelIsVoice": true,
        "fields": [{
          "key": "secretKey",
          "label": "Secret Key",
          "type": "password"
        }]
      },
      "xfyun": {
        "label": "讯飞 TTS",
        "endpoint": "wss://tts-api.xfyun.cn/v2/tts",
        "keyLabel": "API Key",
        "modelLabel": "默认音色",
        "modelIsVoice": true,
        "fields": [{
          "key": "appId",
          "label": "App ID"
        }, {
          "key": "apiSecret",
          "label": "API Secret",
          "type": "password"
        }]
      }
    }),
    localValue3 = 45000,
    localValue4 = Object.freeze({
      "minimax": ["speech-2.8-hd", "speech-2.8-turbo", "speech-2.6-hd", "speech-2.6-turbo", "speech-02-hd", "speech-02-turbo", "speech-01-hd", "speech-01-turbo"],
      "fish-audio": ["s2.1-pro", "s2.1-pro-free", "s2-pro", ["s1", "s1（旧版）"]],
      "dashscope": ["qwen-audio-3.1-tts-plus", "qwen-audio-3.1-tts-flash", "qwen-audio-3.0-tts-plus", "qwen-audio-3.0-tts-flash", "cosyvoice-v3.5-plus", "cosyvoice-v3.5-flash", "cosyvoice-v3-plus", "cosyvoice-v3-flash", "cosyvoice-v2", "qwen3-tts-flash", "qwen3-tts-flash-2025-11-27", "qwen3-tts-flash-2025-09-18", "qwen3-tts-instruct-flash", "qwen3-tts-instruct-flash-2026-01-26", "qwen3-tts-vc-2026-01-22", "qwen3-tts-vd-2026-01-26", "MiniMax/speech-2.8-hd", "MiniMax/speech-2.8-turbo", "MiniMax/speech-02-hd", "MiniMax/speech-02-turbo"],
      "volcengine": [["volcano_tts", "通用语音合成 · volcano_tts"]],
      "tencent": [["402000", "云晓芙"], ["402001", "云小团"], ["402002", "云大围"], ["403009", "云嘉尔"], ["403010", "云嘉和"], ["403011", "云嘉瑜"], ["403012", "云嘉辉"], ["403013", "云小璇"], ["403014", "云佳洁"], ["404000", "云佳妍（粤语）"], ["403000", "云小朵"], ["403001", "云小和"], ["403002", "云小帅"], ["403003", "云小天"], ["403004", "云大川"], ["403005", "云雅琴"], ["403006", "YunMia"], ["403007", "YunLeo"], ["403008", "云小洋"], ["502007", "智小虎"], ["502006", "智小悟"], ["502005", "智小解"], ["502004", "智小满"], ["502003", "智小敏"], ["502001", "智小柔"], ["602004", "暖心阿灿"], ["602005", "专业梓欣"]],
      "baidu": [["0", "度小美"], ["1", "度小宇"], ["3", "度逍遥（基础）"], ["4", "度丫丫"], ["5003", "度逍遥（精品）"], ["5118", "度小鹿"], ["106", "度博文"], ["110", "度小童"], ["111", "度小萌"], ["103", "度米朵"], ["5", "度小娇"], ["4003", "度逍遥（臻品）"], ["4106", "度博文（臻品）"], ["4115", "度小贤"], ["4119", "度小鹿（臻品）"], ["4105", "度灵儿"], ["4117", "度小乔"], ["4100", "度小雯"], ["4103", "度米朵（臻品）"], ["4144", "度姗姗"], ["4278", "度小贝"], ["4143", "度清风"], ["4140", "度小新"], ["4129", "度小彦"], ["4149", "度星河"], ["4254", "度小清"], ["4206", "度博文"], ["4226", "南方"], ["4189", "度涵竹"], ["4194", "度嫣然"], ["4193", "度泽言"], ["4195", "度怀安"], ["4196", "度清影"], ["4197", "度沁遥"], ["20100", "度小粤"], ["20101", "度晓芸"], ["4257", "四川小哥"], ["4132", "度阿闽"], ["4139", "度小蓉"], ["5977", "台媒女声"], ["4007", "度小台"], ["4150", "度湘玉"], ["4134", "度阿锦"], ["4172", "度筱林"]],
      "xfyun": ["x4_xiaoyan", "xiaoyan", "xiaoyu", "xiaofeng", "xiaoqi", "catherine", "mary"]
    }),
    localValue5 = new Set(["openai", "openai-compatible", "elevenlabs", "azure", "google", "aws-polly"]);
  function localValue6(localValue95) {
    return localValue5.has(localValue95);
  }
  function localValue7(localValue96, localValue97 = {}) {
    const localValue98 = [],
      localValue99 = new Set(),
      localValue100 = (localValue101, localValue102, localValue103) => {
        localValue101 = localValue13(localValue101, 256);
        if (!localValue101 || localValue99.has(localValue101)) return;
        localValue99.add(localValue101), localValue98.push({
          "id": localValue101,
          "label": localValue102 && localValue102 !== localValue101 ? localValue102 + " · " + localValue101 : localValue101,
          "source": localValue103
        });
      };
    return localValue14(localValue97.models).forEach(localValue104 => localValue100(localValue104, localValue104, "fetched")), (localValue4[localValue96] || []).forEach(localValue105 => {
      const [localValue106, localValue107] = Array.isArray(localValue105) ? localValue105 : [localValue105, localValue105];
      localValue100(localValue106, localValue107, "builtin");
    }), localValue100(localValue97.model, localValue97.model, "current"), localValue98;
  }
  const localValue8 = 9999;
  let localValue9 = null;
  function localValue10(localValue108) {
    if (typeof structuredClone === "function") return structuredClone(localValue108);
    return JSON.parse(JSON.stringify(localValue108));
  }
  function localValue11(localValue109, localValue110) {
    try {
      return window.StorageManager?.["load"] ? window.StorageManager.load(localValue109, localValue110) : localValue110;
    } catch (localValue111) {
      return console.warn("[tts] Failed to load config:", localValue111), localValue110;
    }
  }
  function localValue12(localValue112, localValue113) {
    try {
      if (window.StorageManager?.["save"]) window.StorageManager.save(localValue112, localValue113);
    } catch (localValue114) {
      console.warn("[tts] Failed to save config:", localValue114);
    }
  }
  function localValue13(localValue115, localValue116 = 2048) {
    return String(localValue115 == null ? "" : localValue115).trim().slice(0, localValue116);
  }
  function localValue14(localValue117) {
    const localValue118 = new Set();
    return (Array.isArray(localValue117) ? localValue117 : []).map(localValue119 => localValue13(localValue119, 256)).filter(localValue120 => localValue120 && !localValue118.has(localValue120) && (localValue118.add(localValue120) || true)).slice(0, 200);
  }
  function localValue15(localValue121) {
    return localValue121 && typeof localValue121 === "object" && !localValue121.providers && ["region", "customEndpointEnabled", "endpoint", "apiKey", "groupId", "ttsModel"].some(localValue122 => Object.prototype.hasOwnProperty.call(localValue121, localValue122));
  }
  function localValue16(localValue123, localValue124 = {}) {
    const localValue125 = localValue2[localValue123],
      localValue126 = {
        "endpoint": localValue13(localValue124.endpoint ?? localValue125.endpoint),
        "apiKey": localValue13(localValue124.apiKey, 1024),
        "model": localValue13(localValue124.model, 256),
        "models": localValue14(localValue124.models)
      };
    localValue125.fields.forEach(localValue127 => {
      localValue126[localValue127.key] = localValue13(localValue124[localValue127.key], localValue127.key === "secretKey" || localValue127.key === "apiSecret" ? 1024 : 512);
    });
    if (localValue123 === "minimax") localValue126.region = ["cn", "intl"].includes(localValue124.region) ? localValue124.region : "cn";
    if (localValue123 === "volcengine") localValue126.model = localValue13(localValue124.resourceId || localValue124.model, 256);
    return localValue126;
  }
  function localValue17(localValue128) {
    const localValue129 = localValue128?.["region"] === "intl" ? "intl" : "cn",
      localValue130 = localValue129 === "intl" ? "https://api.minimax.io" : "https://api.minimax.chat";
    return {
      "activeProvider": "minimax",
      "providers": {
        "minimax": {
          "region": localValue129,
          "endpoint": localValue128?.["customEndpointEnabled"] ? localValue13(localValue128?.["endpoint"]) : localValue130,
          "apiKey": localValue13(localValue128?.["apiKey"], 1024),
          "groupId": localValue13(localValue128?.["groupId"], 512),
          "model": localValue13(localValue128?.["ttsModel"], 256),
          "models": []
        }
      }
    };
  }
  function localValue18(localValue131) {
    const localValue132 = localValue15(localValue131) ? localValue17(localValue131) : localValue131 && typeof localValue131 === "object" ? localValue131 : {},
      localValue133 = localValue132.providers && typeof localValue132.providers === "object" ? localValue132.providers : {},
      localValue134 = {};
    return localValue1.forEach(localValue135 => {
      localValue134[localValue135] = localValue16(localValue135, localValue133[localValue135] || {});
    }), {
      "activeProvider": localValue1.includes(localValue132.activeProvider) ? localValue132.activeProvider : "minimax",
      "providers": localValue134
    };
  }
  function localValue19() {
    return localValue11("u2_minimaxConfig", null);
  }
  function localValue20() {
    const localValue136 = window.ttsConfig || localValue11("u2_ttsConfig", null) || localValue19() || {};
    return window.ttsConfig = localValue18(localValue136), window.ttsConfig;
  }
  function localValue21() {
    const localValue137 = localValue20();
    return {
      "provider": localValue137.activeProvider,
      ...(localValue137.providers[localValue137.activeProvider] || {})
    };
  }
  function localValue22(localValue138) {
    window.ttsConfig = localValue18(localValue138), localValue12("u2_ttsConfig", window.ttsConfig);
    try {
      window.dispatchEvent?.(new CustomEvent("u2:tts-config-updated", {
        "detail": localValue10(window.ttsConfig)
      }));
    } catch (localValue139) {}
    return window.ttsConfig;
  }
  function localValue23(localValue140) {
    return localValue2[localValue140] || localValue2["openai-compatible"];
  }
  function localValue24(localValue141) {
    return localValue23(localValue141).label;
  }
  function localValue25(localValue142, localValue143 = "接口地址") {
    const localValue144 = localValue13(localValue142);
    if (!localValue144) throw new Error("请填写" + localValue143);
    let localValue145;
    try {
      localValue145 = new URL(localValue144);
    } catch (localValue146) {
      throw new Error(localValue143 + "格式无效");
    }
    if (!["http:", "https:", "ws:", "wss:"].includes(localValue145.protocol)) throw new Error(localValue143 + "仅支持 HTTP(S) 或 WebSocket");
    return localValue145;
  }
  function localValue26(localValue147, localValue148 = "接口地址") {
    const localValue149 = localValue25(localValue147, localValue148);
    if (!["http:", "https:"].includes(localValue149.protocol)) throw new Error(localValue148 + "仅支持 HTTP 或 HTTPS");
    return localValue149;
  }
  function localValue27(localValue150, localValue151, localValue152) {
    const localValue153 = localValue13(localValue150?.[localValue151]);
    if (!localValue153) throw new Error("请填写" + localValue152);
    return localValue153;
  }
  function localValue28(localValue154 = localValue21(), localValue155 = {}) {
    const localValue156 = localValue1.includes(localValue154?.["provider"]) ? localValue154.provider : localValue20().activeProvider,
      localValue157 = {
        "provider": localValue156,
        ...(localValue154 || {})
      },
      localValue158 = localValue23(localValue156);
    if (localValue156 !== "aws-polly" && !(localValue156 === "azure" && !localValue13(localValue157.endpoint))) localValue25(localValue157.endpoint);
    localValue27(localValue157, "apiKey", localValue158.keyLabel), localValue158.fields.filter(localValue159 => !localValue159.optional && localValue159.key !== "region").forEach(localValue160 => localValue27(localValue157, localValue160.key, localValue160.label));
    if (["azure", "aws-polly", "tencent"].includes(localValue156)) localValue27(localValue157, "region", "区域");
    return localValue155.requireModel !== false && ["minimax", "openai", "openai-compatible", "elevenlabs", "fish-audio", "dashscope", "volcengine"].includes(localValue156) && localValue27(localValue157, "model", localValue158.modelLabel), localValue157;
  }
  function localValue29(localValue161) {
    const localValue162 = localValue161?.["ttsVoice"] && typeof localValue161.ttsVoice === "object" ? localValue161.ttsVoice : localValue161?.["minimaxVoice"] && typeof localValue161.minimaxVoice === "object" ? localValue161.minimaxVoice : {};
    return {
      "enabled": localValue162.enabled === true,
      "voiceId": localValue13(localValue162.voiceId, 256),
      "speed": Math.max(0.5, Math.min(2, Number.parseFloat(localValue162.speed) || 1)),
      "language": localValue13(localValue161?.["language"], 80) || "zh"
    };
  }
  function localValue30(localValue163) {
    return !!localValue163 && localValue163.type !== "group" && localValue163.type !== "official";
  }
  function localValue31(localValue164, localValue165 = {}) {
    if (!localValue164) return null;
    if (localValue164.type !== "group") return localValue30(localValue164) ? localValue164 : null;
    const localValue166 = localValue165?.["speakerMemberId"] ?? localValue165?.["senderMemberId"] ?? null;
    if (localValue165?.["role"] === "user" || String(localValue166 || "") === "__user__") return null;
    const localValue167 = window.imChat?.["getGroupMessageSpeaker"] ? window.imChat.getGroupMessageSpeaker(localValue164, localValue165) : null;
    return localValue30(localValue167) ? localValue167 : null;
  }
  function localValue32(localValue168) {
    const localValue169 = localValue29(localValue168);
    return localValue30(localValue168) && localValue169.enabled === true && !!localValue169.voiceId;
  }
  function localValue33(localValue170, localValue171 = {}) {
    return localValue32(localValue31(localValue170, localValue171));
  }
  function localValue34(localValue172, localValue173) {
    const localValue174 = localValue23(localValue172.provider),
      localValue175 = localValue173.voiceId || (localValue174.modelIsVoice ? localValue13(localValue172.model) : "");
    if (!localValue175) throw new Error("请先在 Chat Settings Info 填写 TTS 音色 ID");
    return localValue175;
  }
  function localValue35(localValue176) {
    const localValue177 = {
        "zh": "Chinese",
        "zh-cn": "Chinese",
        "chinese": "Chinese",
        "中文": "Chinese",
        "yue": "Chinese,Yue",
        "粤语": "Chinese,Yue",
        "cantonese": "Chinese,Yue",
        "traditional chinese with cantonese": "Chinese,Yue",
        "en": "English",
        "english": "English",
        "ja": "Japanese",
        "japanese": "Japanese",
        "日语": "Japanese",
        "ko": "Korean",
        "korean": "Korean",
        "韩语": "Korean",
        "fr": "French",
        "french": "French",
        "法语": "French",
        "de": "German",
        "german": "German",
        "德语": "German",
        "ru": "Russian",
        "russian": "Russian",
        "俄语": "Russian",
        "es": "Spanish",
        "西班牙语": "Spanish",
        "pt": "Portuguese",
        "葡萄牙语": "Portuguese"
      },
      localValue178 = localValue13(localValue176).toLowerCase();
    return localValue177[localValue178] || "auto";
  }
  function localValue36(localValue179) {
    return /[\u3400-\u9fff]/.test(String(localValue179 || ""));
  }
  function localValue37() {
    const localValue180 = window.u2Api?.["INTERNAL_SILENT_ERROR_HEADER"] || "X-U2-Silent-Errors";
    return {
      [localValue180]: "1"
    };
  }
  async function localValue38(localValue181) {
    try {
      const localValue182 = await localValue181.clone().json();
      return localValue13(localValue182?.["error"]?.["message"] || localValue182?.["message"] || localValue182?.["msg"] || localValue182?.["base_resp"]?.["status_msg"] || localValue182?.["detail"], 500);
    } catch (localValue183) {
      try {
        return localValue13(await localValue181.text(), 500);
      } catch (localValue184) {
        return "";
      }
    }
  }
  async function localValue39(localValue185, localValue186, localValue187, config, purpose = "合成语音") {
    const localValue188 = new AbortController(),
      localValue189 = setTimeout(() => {
        window.u2ApiConsole?.markTimeout(localValue188.signal);
        localValue188.abort();
      }, localValue3),
      listRequest = purpose === "获取模型列表" || purpose === "获取音色列表",
      trace = {
        service: listRequest ? "models" : "tts",
        source: listRequest ? "设置 › TTS 配置" : config.traceSource || "iMessage › 语音合成",
        purpose: purpose,
        provider: config.provider,
        model: listRequest ? "" : config.model,
        tokenApplicable: purpose === "合成语音",
        format: purpose === "合成语音" ? "manual" : "json"
      };
    try {
      const localValue190 = await fetch(localValue185, {
        ...localValue186,
        u2ApiTrace: trace,
        "signal": localValue188.signal
      });
      if (!localValue190.ok) {
        const localValue191 = await localValue38(localValue190);
        throw window.u2Api?.["createHttpError"]?.(localValue190, {
          "message": localValue191
        }, localValue187 + "请求失败") || Object.assign(new Error(localValue187 + "请求失败（HTTP " + localValue190.status + (localValue191 ? "：" + localValue191 : "") + "）"), {
          "status": localValue190.status,
          "apiDetail": localValue191
        });
      }
      return localValue190;
    } catch (localValue192) {
      if (localValue192?.["name"] === "AbortError") throw Object.assign(new Error(localValue187 + "请求超时，请稍后重试"), {
        "name": "TimeoutError"
      });
      throw localValue192;
    } finally {
      clearTimeout(localValue189);
    }
  }
  function localValue40(localValue193, localValue194) {
    const localValue195 = localValue26(localValue193),
      localValue196 = String(localValue194 || "").replace(/^\/+/, "");
    let localValue197 = String(localValue195.pathname || "/").replace(/\/+$/, "");
    localValue197 = localValue197.replace(/\/(?:audio\/speech|models|chat\/completions|images\/generations)$/i, "");
    if (!/\/v\d+(?:[a-z0-9._-]*)?$/i.test(localValue197)) localValue197 = (localValue197 || "") + "/v1";
    return localValue195.pathname = (localValue197 + "/" + localValue196).replace(/\/+/g, "/"), localValue195.search = "", localValue195.hash = "", localValue195.toString();
  }
  function localValue41(localValue198) {
    const localValue199 = localValue26(localValue198.endpoint),
      localValue200 = String(localValue199.pathname || "/").replace(/\/+$/, "");
    if (!/\/v1\/t2a_v2$/i.test(localValue200)) localValue199.pathname = ((localValue200 || "") + "/v1/t2a_v2").replace(/\/+/g, "/");
    const localValue201 = localValue13(localValue198.groupId);
    if (localValue201) localValue199.searchParams.set("GroupId", localValue201);
    return localValue199.toString();
  }
  function localValue42(localValue202) {
    const localValue203 = localValue26(localValue202),
      localValue204 = String(localValue203.pathname || "/").replace(/\/+$/, "");
    if (/\/v1\/tts$/i.test(localValue204)) localValue203.pathname = localValue204;else {
      if (/\/v1$/i.test(localValue204)) localValue203.pathname = localValue204 + "/tts";else localValue203.pathname = (localValue204 + "/v1/tts").replace(/\/+/g, "/");
    }
    return localValue203.hash = "", localValue203.toString();
  }
  function localValue43(localValue205) {
    const localValue206 = localValue42(localValue205),
      localValue207 = new URL(localValue206),
      localValue208 = String(window.location?.["hostname"] || "").toLowerCase();
    if (localValue207.protocol === "https:" && localValue207.hostname.toLowerCase() === "api.fish.audio" && localValue207.pathname === "/v1/tts" && !localValue207.search && /\.pages\.dev$/.test(localValue208)) return {
      "url": "/api/fish-audio/tts",
      "throughRelay": true
    };
    return {
      "url": localValue206,
      "throughRelay": false
    };
  }
  function localValue44(localValue209, localValue210) {
    const localValue211 = localValue13(localValue209.region),
      localValue212 = localValue13(localValue209.endpoint) || "https://" + localValue211 + ".tts.speech.microsoft.com",
      localValue213 = localValue26(localValue212);
    let localValue214 = String(localValue213.pathname || "/").replace(/\/+$/, "");
    return localValue214 = localValue214.replace(/\/cognitiveservices\/(?:v1|voices\/list)$/i, ""), localValue213.pathname = ((localValue214 || "") + "/cognitiveservices/" + localValue210).replace(/\/+/g, "/"), localValue213.search = "", localValue213.toString();
  }
  function localValue45(localValue215, localValue216) {
    const localValue217 = localValue26(localValue215.endpoint);
    let localValue218 = String(localValue217.pathname || "/").replace(/\/+$/, "");
    localValue218 = localValue218.replace(/\/(?:text:synthesize|voices)$/i, "");
    if (!/\/v\d+(?:beta\d*)?$/i.test(localValue218)) localValue218 = (localValue218 || "") + "/v1";
    return localValue217.pathname = (localValue218 + "/" + localValue216).replace(/\/+/g, "/"), localValue217.searchParams.set("key", localValue27(localValue215, "apiKey", "Google API Key")), localValue217.toString();
  }
  function localValue46(localValue219, localValue220 = "audio/mpeg") {
    const localValue221 = String(localValue219 || "").replace(/^data:audio\/[^;]+;base64,/i, "").replace(/\s+/g, "");
    if (!localValue221) return "";
    const localValue222 = atob(localValue221),
      localValue223 = new Uint8Array(localValue222.length);
    for (let localValue224 = 0; localValue224 < localValue222.length; localValue224 += 1) localValue223[localValue224] = localValue222.charCodeAt(localValue224);
    return URL.createObjectURL(new Blob([localValue223], {
      "type": localValue220
    }));
  }
  function localValue47(localValue225, localValue226 = "audio/mpeg") {
    const localValue227 = String(localValue225 || "").replace(/^0x/i, "").replace(/\s+/g, "");
    if (!localValue227 || localValue227.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(localValue227)) return "";
    const localValue228 = new Uint8Array(localValue227.length / 2);
    for (let localValue229 = 0; localValue229 < localValue227.length; localValue229 += 2) localValue228[localValue229 / 2] = Number.parseInt(localValue227.slice(localValue229, localValue229 + 2), 16);
    return URL.createObjectURL(new Blob([localValue228], {
      "type": localValue226
    }));
  }
  function localValue48(localValue230) {
    const localValue231 = [localValue230?.["data"]?.["audio"], localValue230?.["data"]?.["audio_base64"], localValue230?.["data"]?.["audio_file"], localValue230?.["data"]?.["url"], localValue230?.["output"]?.["audio"]?.["url"], localValue230?.["output"]?.["audio"]?.["data"], localValue230?.["output"]?.["audio"], localValue230?.["audio"], localValue230?.["audio_base64"], localValue230?.["audioContent"], localValue230?.["url"]].find(Boolean),
      localValue232 = String(localValue231 == null ? "" : localValue231).trim();
    if (!localValue232) return "";
    if (/^(https?:|blob:|data:audio\/)/i.test(localValue232)) return localValue232;
    if (/^[0-9a-f]+$/i.test(localValue232) && localValue232.length > 32) return localValue47(localValue232);
    return localValue46(localValue232);
  }
  function localValue49(localValue233) {
    const localValue234 = localValue233?.["base_resp"]?.["status_code"];
    if (localValue234 != null && Number(localValue234) !== 0) {
      const localValue235 = localValue13(localValue233?.["base_resp"]?.["status_msg"], 500);
      return localValue235 || "服务返回错误代码 " + localValue234;
    }
    return localValue13(localValue233?.["error"]?.["message"] || localValue233?.["error"]?.["detail"] || localValue233?.["message"] || localValue233?.["msg"] || localValue233?.["detail"], 500);
  }
  function localValue50(localValue236, localValue237 = "语音播放失败") {
    const localValue238 = localValue13(localValue236?.["message"], 500).replace(/\b(api[ _-]?key|authorization|token|secret)\b\s*[:=]\s*[^\s,;]+/gi, "$1：已隐藏");
    return localValue238 || localValue237;
  }
  async function withResponseTrace(response, consume) {
    const trace = window.u2ApiConsole?.forResponse(response);
    try {
      const result = await consume(trace);
      return trace?.finish(), result;
    } catch (error) {
      trace?.fail(error);
      throw error;
    }
  }
  function localValue51(localValue239, localValue240 = "TTS 服务") {
    return withResponseTrace(localValue239, async trace => {
    const localValue241 = String(localValue239.headers.get("content-type") || "").toLowerCase();
    if (localValue241.includes("application/json") || localValue241.includes("text/json")) {
      const localValue243 = await localValue239.json();
      trace?.payload(localValue243);
      const localValue244 = localValue48(localValue243);
      if (localValue244) return localValue244;
      const localValue245 = localValue49(localValue243);
      if (localValue245) throw new Error(localValue240 + "合成失败：" + localValue245);
      throw new Error("TTS 服务未返回音频");
    }
    const localValue242 = await localValue239.blob();
    if (!localValue242.size) throw new Error("TTS 服务未返回音频");
    return URL.createObjectURL(new Blob([localValue242], {
      "type": localValue242.type || "audio/mpeg"
    }));
    });
  }
  function localValue52(localValue246) {
    return withResponseTrace(localValue246, async trace => {
    let localValue247;
    try {
      localValue247 = await localValue246.json();
    } catch (localValue250) {
        trace?.fail(localValue250);
      throw new Error("MiniMax TTS 返回的音频响应不是有效 JSON");
    }
      trace?.payload(localValue247);
    const localValue248 = localValue49(localValue247);
    if (localValue248) throw new Error("MiniMax TTS合成失败：" + localValue248);
    const localValue249 = localValue48(localValue247);
    if (!localValue249) throw new Error("MiniMax TTS 未返回音频");
    return localValue249;
    });
  }
  async function localValue53(localValue251, localValue252 = false) {
    if (!localValue251) throw new Error("没有可播放的音频");
    localValue9 && (localValue9.pause(), localValue9 = null);
    let localValue253 = localValue251;
    window.Capacitor?.["isNativePlatform"]?.() && window.Capacitor.getPlatform?.() === "android" && ((localValue251.endsWith(".wav") || localValue251.endsWith(".mp3")) && !localValue251.includes("/") && !localValue251.startsWith("http") && !localValue251.startsWith("blob:") && !localValue251.startsWith("data:") && (localValue253 = "res://raw/" + localValue251.replace(/\.\w+$/, "")), typeof window.Capacitor.convertFileSrc === "function" && (localValue253 = window.Capacitor.convertFileSrc(localValue253)));
    const localValue254 = new Audio(localValue253);
    localValue254.preload = "auto", localValue9 = localValue254;
    try {
      const localValue255 = localValue252 ? new Promise(localValue256 => {
        localValue254.addEventListener("ended", localValue256, {
          "once": true
        }), localValue254.addEventListener("error", localValue256, {
          "once": true
        }), localValue254.addEventListener("pause", localValue256, {
          "once": true
        });
      }) : null;
      await localValue254.play();
      if (localValue255) await localValue255;
      return localValue254;
    } catch (localValue257) {
      if (localValue9 === localValue254) localValue9 = null;
      if (localValue257?.["name"] === "NotAllowedError") throw new Error("浏览器阻止音频播放，请再次点击播放按钮");
      if (localValue257?.["name"] === "NotSupportedError") throw new Error("浏览器不支持返回的音频格式");
      const localValue258 = localValue13(localValue257?.["message"], 300);
      throw new Error("音频播放失败" + (localValue258 ? "：" + localValue258 : ""));
    }
  }
  function localValue54(localValue259) {
    return String(localValue259 || "").replace(/[<>&'\"]/g, localValue260 => ({
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      "\"": "&quot;"
    })[localValue260]);
  }
  function localValue55(localValue261) {
    const localValue262 = new TextEncoder().encode(String(localValue261 || ""));
    let localValue263 = "";
    return localValue262.forEach(localValue264 => {
      localValue263 += String.fromCharCode(localValue264);
    }), btoa(localValue263);
  }
  async function localValue56(localValue265, localValue266, localValue267) {
    const localValue268 = localValue34(localValue265, localValue267),
      localValue269 = {
        "model": localValue27(localValue265, "model", "TTS 模型"),
        "text": localValue266,
        "stream": false,
        "output_format": "hex",
        "voice_setting": {
          "voice_id": localValue268,
          "speed": localValue267.speed,
          "vol": 1,
          "pitch": 0
        },
        "audio_setting": {
          "sample_rate": 32000,
          "bitrate": 128000,
          "format": "mp3",
          "channel": 1
        }
      },
      localValue270 = localValue35(localValue267.language);
    if (localValue270 !== "auto" && (localValue270 !== "Chinese" || localValue36(localValue266))) localValue269.language_boost = localValue270;
    const localValue271 = await localValue39(localValue41(localValue265), {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localValue265.apiKey,
        ...localValue37()
      },
      "body": JSON.stringify(localValue269)
    }, "MiniMax TTS", localValue265);
    return localValue52(localValue271);
  }
  async function localValue57(localValue272, localValue273, localValue274) {
    const localValue275 = await localValue39(localValue40(localValue272.endpoint, "audio/speech"), {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localValue272.apiKey,
        ...localValue37()
      },
      "body": JSON.stringify({
        "model": localValue27(localValue272, "model", "TTS 模型"),
        "input": localValue273,
        "voice": localValue34(localValue272, localValue274),
        "speed": localValue274.speed,
        "response_format": "mp3"
      })
    }, localValue24(localValue272.provider) + " TTS", localValue272);
    return localValue51(localValue275);
  }
  async function localValue58(localValue276, localValue277, localValue278) {
    const localValue279 = localValue26(localValue276.endpoint);
    let localValue280 = String(localValue279.pathname || "/").replace(/\/+$/, "").replace(/\/text-to-speech\/[^/]+$/i, "");
    if (!/\/v1$/i.test(localValue280)) localValue280 = (localValue280 || "") + "/v1";
    localValue279.pathname = (localValue280 + "/text-to-speech/" + encodeURIComponent(localValue34(localValue276, localValue278))).replace(/\/+/g, "/"), localValue279.searchParams.set("output_format", "mp3_44100_128");
    const localValue281 = await localValue39(localValue279.toString(), {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "xi-api-key": localValue276.apiKey,
        ...localValue37()
      },
      "body": JSON.stringify({
        "text": localValue277,
        "model_id": localValue27(localValue276, "model", "TTS 模型"),
        "voice_settings": {
          "stability": 0.5,
          "similarity_boost": 0.75
        }
      })
    }, "ElevenLabs TTS", localValue276);
    return localValue51(localValue281);
  }
  async function localValue59(localValue282, localValue283, localValue284) {
    const localValue285 = window.u2NativeBridge,
      localValue286 = window.u2NativeBridge?.isNativeIOS?.() || window.Capacitor?.isNativePlatform?.() && window.Capacitor?.getPlatform?.() === "ios";
    if (localValue286 && typeof localValue285?.["requestFishAudioTts"] !== "function") throw new Error("当前 App 缺少 Fish Audio 原生请求组件，请更新 App 后重试");
    const localValue287 = localValue286 ? {
        "url": localValue42(localValue282.endpoint),
        "throughRelay": false
      } : localValue43(localValue282.endpoint),
      localValue288 = localValue27(localValue282, "model", "TTS 模型"),
      localValue289 = {
        "text": localValue283,
        "reference_id": localValue34(localValue282, localValue284),
        "prosody": {
          "speed": localValue284.speed
        },
        "format": "mp3"
      },
      localValue290 = new AbortController(),
      localValue291 = Object.assign(new Error("Fish Audio TTS 请求超时，请稍后重试"), {
        "name": "TimeoutError"
      }),
      trace = window.u2ApiConsole?.start({
        service: "tts",
        source: localValue282.traceSource || "iMessage › 语音合成",
        purpose: "合成语音",
        provider: "fish-audio",
        model: localValue288
      });
    let localValue292;
    const localValue293 = new Promise((localValue294, localValue295) => {
      localValue292 = setTimeout(() => {
        localValue295(localValue291), localValue290.abort();
      }, localValue3);
    });
    try {
      const localValue296 = (async () => {
        const localValue297 = localValue286 ? await localValue285.requestFishAudioTts({
          "url": localValue287.url,
          "apiKey": localValue282.apiKey,
          "model": localValue288,
          "body": localValue289,
          "timeoutMs": localValue3
        }) : await fetch(localValue287.url, {
          "method": "POST",
          "signal": localValue290.signal,
          "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localValue282.apiKey,
            "model": localValue288,
            ...localValue37()
          },
          "body": JSON.stringify(localValue289)
        });
        if (localValue290.signal.aborted) throw localValue291;
          trace?.response(localValue297);
        if (!localValue297.ok) {
          if (localValue287.throughRelay && localValue297.status === 404) throw new Error("当前网站未部署 Fish Audio 转发接口，请更新 Cloudflare Pages 部署");
          const localValue300 = await localValue38(localValue297);
          throw window.u2Api?.["createHttpError"]?.(localValue297, {
            "message": localValue300
          }, "Fish Audio TTS 请求失败") || Object.assign(new Error("Fish Audio TTS 请求失败（HTTP " + localValue297.status + (localValue300 ? "：" + localValue300 : "") + "）"), {
            "status": localValue297.status,
            "apiDetail": localValue300
          });
        }
        if (localValue287.throughRelay && localValue297.headers.get("x-u2-fish-relay") !== "1") throw new Error("当前网站未部署 Fish Audio 转发接口，请更新 Cloudflare Pages 部署");
        const localValue298 = String(localValue297.headers.get("content-type") || "").toLowerCase();
        if (localValue298.startsWith("text/") && !localValue298.includes("json")) {
          const localValue301 = localValue13(await localValue297.text(), 500);
          throw new Error("Fish Audio TTS 未返回音频" + (localValue301 ? "：" + localValue301 : ""));
        }
        const localValue299 = await localValue51(localValue297, "Fish Audio TTS");
        if (localValue290.signal.aborted) {
          if (localValue299.startsWith("blob:")) URL.revokeObjectURL(localValue299);
          throw localValue291;
        }
        return localValue299;
      })(),
      result = await Promise.race([localValue296, localValue293]);
    return trace?.finish(), result;
    } catch (localValue302) {
      if (localValue290.signal.aborted || localValue302?.name === "AbortError" || localValue286 && /timed?\s*out|timeout/i.test(String(localValue302?.message || localValue302?.code || ""))) {
        trace?.fail(localValue291);
        throw localValue291;
      }
      trace?.fail(localValue302);
      throw localValue302;
    } finally {
      clearTimeout(localValue292);
    }
  }
  async function localValue60(localValue303, localValue304, localValue305) {
    const localValue306 = localValue34(localValue303, localValue305),
      localValue307 = await localValue39(localValue44(localValue303, "v1"), {
        "method": "POST",
        "headers": {
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
          "Ocp-Apim-Subscription-Key": localValue303.apiKey,
          "User-Agent": "u2phone",
          ...localValue37()
        },
        "body": "<speak version=\"1.0\" xml:lang=\"" + localValue54(localValue305.language || "zh-CN") + "\"><voice name=\"" + localValue54(localValue306) + "\"><prosody rate=\"" + Math.round((localValue305.speed - 1) * 100) + "%\">" + localValue54(localValue304) + "</prosody></voice></speak>"
      }, "Azure Speech", localValue303);
    return localValue51(localValue307);
  }
  async function localValue61(localValue308, localValue309, localValue310) {
    const localValue311 = await localValue39(localValue45(localValue308, "text:synthesize"), {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        ...localValue37()
      },
      "body": JSON.stringify({
        "input": {
          "text": localValue309
        },
        "voice": {
          "name": localValue34(localValue308, localValue310),
          "languageCode": localValue310.language || undefined
        },
        "audioConfig": {
          "audioEncoding": "MP3",
          "speakingRate": localValue310.speed
        }
      })
    }, "Google Cloud TTS", localValue308);
    return localValue51(localValue311);
  }
  function localValue62(localValue312) {
    return Array.from(new Uint8Array(localValue312)).map(localValue313 => localValue313.toString(16).padStart(2, "0")).join("");
  }
  async function localValue63(localValue314) {
    return localValue62(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(localValue314)));
  }
  async function localValue64(localValue315, localValue316, localValue317 = "SHA-256") {
    const localValue318 = await crypto.subtle.importKey("raw", localValue315 instanceof Uint8Array ? localValue315 : new TextEncoder().encode(localValue315), {
      "name": "HMAC",
      "hash": localValue317
    }, false, ["sign"]);
    return new Uint8Array(await crypto.subtle.sign("HMAC", localValue318, new TextEncoder().encode(localValue316)));
  }
  function localValue65(localValue319 = new Date()) {
    const localValue320 = localValue319.toISOString().replace(/[:-]|\.\d{3}/g, "");
    return {
      "short": localValue320.slice(0, 8),
      "long": localValue320.slice(0, 15) + "Z"
    };
  }
  async function localValue66(localValue321, localValue322, localValue323, localValue324) {
    if (!window.crypto?.["subtle"]) throw new Error("当前浏览器不支持 AWS Polly 所需的请求签名");
    const localValue325 = new URL(localValue323),
      localValue326 = localValue65(),
      localValue327 = await localValue63(localValue324),
      localValue328 = {
        "content-type": "application/x-amz-json-1.0",
        "host": localValue325.host,
        "x-amz-date": localValue326.long
      };
    if (localValue13(localValue321.sessionToken)) localValue328["x-amz-security-token"] = localValue321.sessionToken;
    const localValue329 = Object.keys(localValue328).sort(),
      localValue330 = localValue329.map(localValue339 => localValue339 + ":" + localValue328[localValue339] + "\n").join(""),
      localValue331 = localValue322 + "\n" + localValue325.pathname + "\n" + localValue325.search.slice(1) + "\n" + localValue330 + "\n" + localValue329.join(";") + "\n" + localValue327,
      localValue332 = localValue326.short + "/" + localValue321.region + "/polly/aws4_request",
      localValue333 = "AWS4-HMAC-SHA256\n" + localValue326.long + "\n" + localValue332 + "\n" + (await localValue63(localValue331)),
      localValue334 = await localValue64("AWS4" + localValue321.secretKey, localValue326.short),
      localValue335 = await localValue64(localValue334, localValue321.region),
      localValue336 = await localValue64(localValue335, "polly"),
      localValue337 = await localValue64(localValue336, "aws4_request"),
      localValue338 = localValue62(await localValue64(localValue337, localValue333));
    return {
      ...localValue328,
      "Authorization": "AWS4-HMAC-SHA256 Credential=" + localValue321.apiKey + "/" + localValue332 + ", SignedHeaders=" + localValue329.join(";") + ", Signature=" + localValue338
    };
  }
  async function localValue67(localValue340, localValue341, localValue342) {
    const localValue343 = localValue13(localValue340.endpoint) || "https://polly." + localValue340.region + ".amazonaws.com",
      localValue344 = localValue26(localValue343);
    localValue344.pathname = "/v1/speech", localValue344.search = "";
    const localValue345 = JSON.stringify({
        "OutputFormat": "mp3",
        "Text": localValue341,
        "VoiceId": localValue34(localValue340, localValue342),
        "SampleRate": "24000"
      }),
      localValue346 = await localValue66(localValue340, "POST", localValue344.toString(), localValue345),
      localValue347 = await localValue39(localValue344.toString(), {
        "method": "POST",
        "headers": {
          ...localValue346,
          ...localValue37()
        },
        "body": localValue345
      }, "AWS Polly", localValue340);
    return localValue51(localValue347);
  }
  async function localValue68(localValue348, localValue349, localValue350) {
    const localValue351 = {
        "app": {
          "appid": localValue348.appId,
          "token": localValue348.apiKey,
          "cluster": localValue348.resourceId || localValue348.model
        },
        "user": {
          "uid": "u2-" + Date.now()
        },
        "audio": {
          "voice_type": localValue34(localValue348, localValue350),
          "encoding": "mp3",
          "speed_ratio": localValue350.speed
        },
        "request": {
          "reqid": "u2-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
          "text": localValue349,
          "operation": "query"
        }
      },
      localValue352 = await localValue39(localValue348.endpoint, {
        "method": "POST",
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer;" + localValue348.apiKey,
          ...localValue37()
        },
        "body": JSON.stringify(localValue351)
      }, "火山引擎 TTS", localValue348);
    return localValue51(localValue352);
  }
  async function localValue69(localValue353, localValue354, localValue355) {
    const localValue356 = localValue27(localValue353, "model", "TTS 模型"),
      localValue357 = localValue34(localValue353, localValue355),
      localValue358 = /^(?:qwen-audio-|cosyvoice-)/.test(localValue356),
      localValue359 = /^MiniMax\//.test(localValue356),
      localValue360 = localValue26(localValue353.endpoint);
    localValue360.pathname = localValue360.pathname.replace(/\/api\/v1\/services\/(?:aigc\/multimodal-generation\/generation|audio\/tts\/SpeechSynthesizer)\/?$/i, localValue358 ? "/api/v1/services/audio/tts/SpeechSynthesizer" : "/api/v1/services/aigc/multimodal-generation/generation");
    const localValue361 = localValue359 ? {
        "text": localValue354,
        "voice_setting": {
          "voice_id": localValue357,
          "speed": localValue355.speed
        },
        "audio_setting": {
          "format": "mp3",
          "sample_rate": 32000
        }
      } : localValue358 ? {
        "text": localValue354,
        "voice": localValue357,
        "format": "mp3",
        "sample_rate": 24000
      } : {
        "text": localValue354,
        "voice": localValue357
      },
      localValue362 = await localValue39(localValue360.toString(), {
        "method": "POST",
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localValue353.apiKey,
          ...localValue37()
        },
        "body": JSON.stringify({
          "model": localValue356,
          "input": localValue361
        })
      }, "DashScope TTS", localValue353);
    return localValue51(localValue362);
  }
  function localValue70(socketUrl, localValue364, localValue365, serviceName, config) {
    if (typeof WebSocket !== "function") return Promise.reject(new Error("当前环境不支持 WebSocket TTS"));
    return new Promise((localValue367, localValue368) => {
      let localValue369 = false;
      const trace = window.u2ApiConsole?.start({
        service: "tts",
        source: config.traceSource || "iMessage › 语音合成",
        purpose: "合成语音",
        provider: config.provider,
        model: config.model
      });
      let localValue370;
      try {
        localValue370 = new WebSocket(socketUrl);
      } catch (error) {
        trace?.fail(error);
        localValue368(error);
        return;
      }
      const localValue371 = setTimeout(() => localValue372(Object.assign(new Error(serviceName + "连接超时"), {
          name: "TimeoutError"
        })), localValue3),
        localValue372 = (localValue373, localValue374) => {
          if (localValue369) return;
          localValue369 = true, clearTimeout(localValue371);
          try {
            localValue370.close();
          } catch (localValue375) {}
          localValue373 ? (trace?.fail(localValue373), localValue368(localValue373)) : (trace?.finish(), localValue367(localValue374));
        };
      localValue370.onerror = () => {
        trace?.finish("network");
        localValue372(new Error(serviceName + "连接失败，请检查地址、凭据或浏览器跨域限制"));
      };
      localValue370.onclose = () => {
        if (!localValue369) trace?.finish("network");
      };
      localValue370.onopen = () => {
        try {
          localValue364(localValue370);
        } catch (localValue376) {
          localValue372(localValue376);
        }
      }, localValue370.onmessage = localValue377 => {
        try {
          localValue365(localValue377, localValue372);
        } catch (localValue378) {
          localValue372(localValue378);
        }
      };
    });
  }
  async function localValue71(localValue379, localValue380, localValue381) {
    if (!window.crypto?.["subtle"]) throw new Error("当前浏览器不支持腾讯云 TTS 所需的请求签名");
    const localValue382 = localValue25(localValue379.endpoint),
      localValue383 = Math.floor(Date.now() / 1000),
      localValue384 = Math.floor(Math.random() * 1000000000),
      localValue385 = {
        "Action": "TextToVoice",
        "AppId": localValue379.appId,
        "Expired": localValue383 + 3600,
        "Nonce": localValue384,
        "SecretId": localValue379.apiKey,
        "Timestamp": localValue383,
        "VoiceType": localValue34(localValue379, localValue381)
      };
    Object.entries(localValue385).forEach(([localValue391, localValue392]) => localValue382.searchParams.set(localValue391, String(localValue392)));
    const localValue386 = Array.from(localValue382.searchParams.entries()).sort(([localValue393], [localValue394]) => localValue393.localeCompare(localValue394)),
      localValue387 = "GET" + localValue382.host + localValue382.pathname + "?" + localValue386.map(([localValue395, localValue396]) => localValue395 + "=" + localValue396).join("&"),
      localValue388 = await localValue64(localValue379.secretKey, localValue387, "SHA-1");
    let localValue389 = "";
    localValue388.forEach(localValue397 => {
      localValue389 += String.fromCharCode(localValue397);
    }), localValue382.searchParams.set("Signature", btoa(localValue389));
    const localValue390 = [];
    return localValue70(localValue382.toString(), localValue398 => {
      localValue398.send(JSON.stringify({
        "Action": "TextToVoice",
        "Text": localValue380,
        "SessionId": "u2-" + Date.now(),
        "ModelType": 1,
        "Codec": "mp3",
        "SampleRate": 16000,
        "Speed": Math.round((localValue381.speed - 1) * 10)
      }));
    }, (localValue399, localValue400) => {
      const localValue401 = JSON.parse(String(localValue399.data || "{}"));
      if (Number(localValue401.code) !== 0 && localValue401.code != null) return localValue400(new Error(localValue401.message || "腾讯云 TTS 合成失败"));
      const localValue402 = localValue401.data || localValue401.Audio || localValue401.audio;
      if (localValue402) localValue390.push(String(localValue402));
      if (localValue401.final === 1 || localValue401.Final === 1 || localValue401.status === 2) {
        const localValue403 = localValue46(localValue390.join(""));
        localValue400(localValue403 ? null : new Error("腾讯云 TTS 未返回音频"), localValue403);
      }
    }, "腾讯云 TTS", localValue379);
  }
  async function localValue72(localValue404, localValue405, localValue406) {
    const localValue407 = new URLSearchParams({
        "grant_type": "client_credentials",
        "client_id": localValue404.apiKey,
        "client_secret": localValue404.secretKey
      }),
      localValue408 = await localValue39("https://aip.baidubce.com/oauth/2.0/token", {
        "method": "POST",
        "headers": {
          "Content-Type": "application/x-www-form-urlencoded",
          ...localValue37()
        },
        "body": localValue407.toString()
      }, "百度智能云鉴权", localValue404, "获取语音服务凭据"),
      localValue409 = await localValue408.json(),
      localValue410 = localValue13(localValue409?.["access_token"]);
    if (!localValue410) throw new Error("百度智能云未返回 Access Token");
    const localValue411 = localValue26(localValue404.endpoint);
    localValue411.searchParams.set("tex", localValue405), localValue411.searchParams.set("tok", localValue410), localValue411.searchParams.set("cuid", "u2phone"), localValue411.searchParams.set("ctp", "1"), localValue411.searchParams.set("lan", String(localValue406.language || "zh").split("-")[0]), localValue411.searchParams.set("per", localValue34(localValue404, localValue406)), localValue411.searchParams.set("spd", String(Math.round(5 + (localValue406.speed - 1) * 5)));
    const localValue412 = await localValue39(localValue411.toString(), {
      "headers": localValue37()
    }, "百度智能云 TTS", localValue404);
    return localValue51(localValue412);
  }
  async function localValue73(localValue413, localValue414, localValue415) {
    if (!window.crypto?.["subtle"]) throw new Error("当前浏览器不支持讯飞 TTS 所需的请求签名");
    const localValue416 = localValue25(localValue413.endpoint),
      localValue417 = new Date().toUTCString(),
      localValue418 = "host: " + localValue416.host + "\ndate: " + localValue417 + "\nGET " + localValue416.pathname + " HTTP/1.1",
      localValue419 = await localValue64(localValue413.apiSecret, localValue418);
    let localValue420 = "";
    localValue419.forEach(localValue423 => {
      localValue420 += String.fromCharCode(localValue423);
    });
    const localValue421 = btoa("api_key=\"" + localValue413.apiKey + "\", algorithm=\"hmac-sha256\", headers=\"host date request-line\", signature=\"" + btoa(localValue420) + "\"");
    localValue416.searchParams.set("authorization", localValue421), localValue416.searchParams.set("date", localValue417), localValue416.searchParams.set("host", localValue416.host);
    const localValue422 = [];
    return localValue70(localValue416.toString(), localValue424 => {
      localValue424.send(JSON.stringify({
        "common": {
          "app_id": localValue413.appId
        },
        "business": {
          "aue": "lame",
          "auf": "audio/L16;rate=16000",
          "vcn": localValue34(localValue413, localValue415),
          "speed": Math.round((localValue415.speed - 1) * 50)
        },
        "data": {
          "status": 2,
          "text": localValue55(localValue414)
        }
      }));
    }, (localValue425, localValue426) => {
      const localValue427 = JSON.parse(String(localValue425.data || "{}"));
      if (Number(localValue427.code) !== 0 && localValue427.code != null) return localValue426(new Error(localValue427.message || "讯飞 TTS 合成失败"));
      if (localValue427.data?.["audio"]) localValue422.push(localValue427.data.audio);
      if (Number(localValue427.data?.["status"]) === 2) {
        const localValue428 = localValue46(localValue422.join(""));
        localValue426(localValue428 ? null : new Error("讯飞 TTS 未返回音频"), localValue428);
      }
    }, "讯飞 TTS", localValue413);
  }
  async function localValue74(localValue429, localValue430, localValue431) {
    if (localValue429.provider === "minimax") return localValue56(localValue429, localValue430, localValue431);
    if (localValue429.provider === "openai" || localValue429.provider === "openai-compatible") return localValue57(localValue429, localValue430, localValue431);
    if (localValue429.provider === "elevenlabs") return localValue58(localValue429, localValue430, localValue431);
    if (localValue429.provider === "fish-audio") return localValue59(localValue429, localValue430, localValue431);
    if (localValue429.provider === "azure") return localValue60(localValue429, localValue430, localValue431);
    if (localValue429.provider === "google") return localValue61(localValue429, localValue430, localValue431);
    if (localValue429.provider === "aws-polly") return localValue67(localValue429, localValue430, localValue431);
    if (localValue429.provider === "volcengine") return localValue68(localValue429, localValue430, localValue431);
    if (localValue429.provider === "dashscope") return localValue69(localValue429, localValue430, localValue431);
    if (localValue429.provider === "tencent") return localValue71(localValue429, localValue430, localValue431);
    if (localValue429.provider === "baidu") return localValue72(localValue429, localValue430, localValue431);
    if (localValue429.provider === "xfyun") return localValue73(localValue429, localValue430, localValue431);
    throw new Error("不支持的 TTS 服务商");
  }
  const localValue75 = new Set();
  let localValue76 = new WeakSet();
  function localValue77() {
    const localValue432 = [];
    for (const localValue433 of localValue75) {
      const localValue434 = localValue433.deref();
      if (localValue434) localValue432.push(localValue434);else localValue75["delete"](localValue433);
    }
    return localValue432;
  }
  function localValue78() {
    return [...new Set(localValue77().map(localValue435 => localValue435?.["ttsAudioCache"]?.["url"]).filter(Boolean))];
  }
  function localValue79() {
    localValue9 && (localValue9.pause(), localValue9 = null);
    for (const localValue436 of localValue77()) {
      const localValue437 = localValue436?.["ttsAudioCache"]?.["url"];
      if (String(localValue437 || "").startsWith("blob:")) URL.revokeObjectURL(localValue437);
      delete localValue436.ttsAudioCache, delete localValue436.ttsAudioPromise;
    }
    localValue75.clear(), localValue76 = new WeakSet();
  }
  async function localValue80(localValue438, localValue439, localValue440) {
    const localValue441 = window.appStorage?.["voiceCacheEpoch"];
    if (window.appStorage?.["voiceCleanupActive"]) throw new Error("语音缓存正在清理，请稍后重试");
    const localValue442 = await localValue74(localValue438, localValue439, localValue440);
    if (localValue441 !== window.appStorage?.["voiceCacheEpoch"] || window.appStorage?.["voiceCleanupActive"]) {
      if (String(localValue442 || "").startsWith("blob:")) URL.revokeObjectURL(localValue442);
      throw new Error("语音缓存已清理，请重新生成");
    }
    return localValue442;
  }
  function localValue81(localValue443, localValue444) {
    return [localValue443.provider, localValue443.endpoint, localValue443.model, localValue443.region, localValue443.resourceId, localValue444.voiceId, localValue444.speed].map(localValue445 => localValue13(localValue445)).join("|");
  }
  async function localValue82(localValue446, localValue447 = null, localValue448 = {}) {
    const localValue449 = localValue13(localValue446, 12000);
    if (!localValue449) throw new Error("没有可播放的文本");
    const localValue450 = localValue29(localValue447);
    if (!localValue450.enabled && !localValue448.ignoreFriendToggle) throw new Error("请先在 Chat Settings Info 开启 TTS");
    const localValue451 = localValue28(localValue448.config || localValue21());
    if (localValue451.provider === "minimax" && localValue449.length > localValue8) throw new Error("MiniMax TTS 单次文本不能超过 " + localValue8.toLocaleString() + " 个字符");
    return localValue80({
      ...localValue451,
      traceSource: localValue448.traceSource
    }, localValue449, {
      ...localValue450,
      "voiceId": localValue448.voiceId || localValue450.voiceId
    });
  }
  async function localValue83(localValue452, localValue453 = null, localValue454 = {}) {
    const localValue455 = localValue13(localValue452, 12000);
    if (!localValue455) {
      if (window.showToast) window.showToast("没有可播放的文本");
      return null;
    }
    const localValue456 = localValue29(localValue453);
    if (!localValue456.enabled && !localValue454.ignoreFriendToggle) {
      if (window.showToast) window.showToast("请先在 Chat Settings Info 开启 TTS");
      return null;
    }
    const localValue457 = localValue28(localValue454.config || localValue21());
    if (localValue457.provider === "minimax" && localValue455.length > localValue8) throw new Error("MiniMax TTS 单次文本不能超过 " + localValue8.toLocaleString() + " 个字符");
    if (!localValue454.suppressToast && window.showToast) window.showToast("语音生成中...");
    const localValue458 = await localValue80({
      ...localValue457,
      traceSource: localValue454.traceSource
    }, localValue455, {
      ...localValue456,
      "voiceId": localValue454.voiceId || localValue456.voiceId
    });
    if (localValue454.canPlay && !localValue454.canPlay()) return null;
    return await localValue53(localValue458, localValue454.awaitEnd === true), localValue458;
  }
  async function localValue84(localValue459, localValue460 = null, localValue461 = null, localValue462 = {}) {
    const localValue463 = window.appStorage?.["voiceCacheEpoch"];
    if (window.appStorage?.["voiceCleanupActive"]) throw new Error("语音缓存正在清理，请稍后重试");
    localValue461 && !localValue76.has(localValue461) && (localValue76.add(localValue461), localValue75.add(typeof WeakRef === "function" ? new WeakRef(localValue461) : {
      "deref": () => localValue461
    }));
    const localValue464 = localValue29(localValue460);
    if (!localValue464.enabled && !localValue462.ignoreFriendToggle) return localValue83(localValue459, localValue460, localValue462);
    const localValue465 = localValue28(localValue462.config || localValue21()),
      localValue466 = localValue81(localValue465, {
        ...localValue464,
        "voiceId": localValue462.voiceId || localValue464.voiceId
      });
    if (localValue461?.["ttsAudioCache"]?.["key"] === localValue466 && localValue461.ttsAudioCache.url) {
      if (localValue462.canPlay && !localValue462.canPlay()) return null;
      return await localValue53(localValue461.ttsAudioCache.url, localValue462.awaitEnd === true), localValue461.ttsAudioCache.url;
    }
    if (localValue461?.["ttsAudioPromise"]) {
      const localValue468 = await localValue461.ttsAudioPromise;
      if (localValue462.canPlay && !localValue462.canPlay()) return null;
      if (localValue468) await localValue53(localValue468, localValue462.awaitEnd === true);
      return localValue468;
    }
    const localValue467 = localValue83(localValue459, localValue460, {
      ...localValue462,
      "config": localValue465
    });
    if (localValue461) localValue461.ttsAudioPromise = localValue467;
    try {
      const localValue469 = await localValue467;
      if (localValue463 !== window.appStorage?.["voiceCacheEpoch"]) return null;
      if (localValue461 && localValue469) localValue461.ttsAudioCache = {
        "key": localValue466,
        "url": localValue469
      };
      return localValue469;
    } finally {
      if (localValue461) delete localValue461.ttsAudioPromise;
    }
  }
  function localValue85(localValue470) {
    return Array.isArray(localValue470) ? localValue470 : Array.isArray(localValue470?.["data"]) ? localValue470.data : Array.isArray(localValue470?.["models"]) ? localValue470.models : [];
  }
  function localValue86(localValue471) {
    return typeof localValue471 === "string" ? localValue471 : localValue471?.["id"] || localValue471?.["model_id"] || localValue471?.["name"] || localValue471?.["model"] || "";
  }
  function localValue87(localValue472) {
    const localValue473 = localValue13(localValue86(localValue472), 256).toLowerCase(),
      localValue474 = localValue472 && typeof localValue472 === "object" ? localValue472.capabilities : null,
      localValue475 = localValue472 && typeof localValue472 === "object" && (localValue472.can_do_text_to_speech === true || localValue472.supports_tts === true || localValue472.supportsTextToSpeech === true || localValue474?.["tts"] === true || localValue474?.["text_to_speech"] === true || localValue474?.["text-to-speech"] === true || localValue474?.["audio"]?.["text_to_speech"] === true);
    return localValue475 || /(^|[-_])(?:tts|text[-_]?to[-_]?speech)(?:[-_]|$)/i.test(localValue473);
  }
  function localValue88(localValue476) {
    return localValue85(localValue476).filter(localValue87).map(localValue86).map(localValue477 => localValue13(localValue477, 256)).filter(Boolean);
  }
  async function localValue89(localValue478) {
    const localValue479 = await localValue39(localValue40(localValue478.endpoint, "models"), {
      "headers": {
        "Authorization": "Bearer " + localValue478.apiKey,
        ...localValue37()
      }
    }, localValue24(localValue478.provider) + " 模型列表", localValue478, "获取模型列表");
    return localValue88(await localValue479.json());
  }
  async function localValue90(localValue480) {
    const localValue481 = localValue26(localValue480.endpoint);
    let localValue482 = String(localValue481.pathname || "/").replace(/\/+$/, "").replace(/\/models$/i, "");
    if (!/\/v1$/i.test(localValue482)) localValue482 = (localValue482 || "") + "/v1";
    localValue481.pathname = (localValue482 + "/models").replace(/\/+/g, "/");
    const localValue483 = await localValue39(localValue481.toString(), {
        "headers": {
          "xi-api-key": localValue480.apiKey,
          ...localValue37()
        }
      }, "ElevenLabs 模型列表", localValue480, "获取模型列表"),
      localValue484 = await localValue483.json();
    return (Array.isArray(localValue484) ? localValue484 : []).filter(localValue485 => localValue485?.["can_do_text_to_speech"] !== false).map(localValue486 => localValue13(localValue486?.["model_id"] || localValue486?.["id"], 256)).filter(Boolean);
  }
  async function localValue91(localValue487) {
    const localValue488 = await localValue39(localValue44(localValue487, "voices/list"), {
        "headers": {
          "Ocp-Apim-Subscription-Key": localValue487.apiKey,
          ...localValue37()
        }
      }, "Azure Speech 音色列表", localValue487, "获取音色列表"),
      localValue489 = await localValue488.json();
    return (Array.isArray(localValue489) ? localValue489 : []).map(localValue490 => localValue13(localValue490?.["ShortName"] || localValue490?.["Name"], 256)).filter(Boolean);
  }
  async function localValue92(localValue491) {
    const localValue492 = await localValue39(localValue45(localValue491, "voices"), {
        "headers": localValue37()
      }, "Google Cloud TTS 音色列表", localValue491, "获取音色列表"),
      localValue493 = await localValue492.json();
    return (Array.isArray(localValue493?.["voices"]) ? localValue493.voices : []).map(localValue494 => localValue13(localValue494?.["name"], 256)).filter(Boolean);
  }
  async function localValue93(localValue495) {
    const localValue496 = localValue13(localValue495.endpoint) || "https://polly." + localValue495.region + ".amazonaws.com",
      localValue497 = localValue26(localValue496);
    localValue497.pathname = "/v1/voices", localValue497.search = "";
    const localValue498 = await localValue66(localValue495, "GET", localValue497.toString(), ""),
      localValue499 = await localValue39(localValue497.toString(), {
        "headers": {
          ...localValue498,
          ...localValue37()
        }
      }, "AWS Polly 音色列表", localValue495, "获取音色列表"),
      localValue500 = await localValue499.json();
    return (Array.isArray(localValue500?.["Voices"]) ? localValue500.Voices : []).map(localValue501 => localValue13(localValue501?.["Id"], 256)).filter(Boolean);
  }
  async function localValue94(localValue502 = localValue21()) {
    const localValue503 = localValue1.includes(localValue502?.["provider"]) ? localValue502.provider : localValue20().activeProvider;
    if (!localValue6(localValue503)) return localValue7(localValue503).map(localValue507 => localValue507.id);
    const localValue504 = localValue28({
      ...localValue502,
      "provider": localValue503
    }, {
      "requireModel": false
    });
    let localValue505;
    if (localValue504.provider === "openai" || localValue504.provider === "openai-compatible") localValue505 = await localValue89(localValue504);else {
      if (localValue504.provider === "elevenlabs") localValue505 = await localValue90(localValue504);else {
        if (localValue504.provider === "azure") localValue505 = await localValue91(localValue504);else {
          if (localValue504.provider === "google") localValue505 = await localValue92(localValue504);else {
            if (localValue504.provider === "aws-polly") localValue505 = await localValue93(localValue504);
          }
        }
      }
    }
    const localValue506 = localValue14(localValue505).sort((localValue508, localValue509) => localValue508.localeCompare(localValue509));
    if (!localValue506.length) throw new Error("接口返回成功，但没有发现可用模型或音色");
    return localValue506;
  }
  window.ttsConfig = localValue18(window.ttsConfig || localValue11("u2_ttsConfig", null) || localValue19()), window.getTtsConfig = localValue20, window.u2Tts = Object.freeze({
    "PROVIDER_IDS": localValue1,
    "PROVIDERS": localValue2,
    "REQUEST_TIMEOUT_MS": localValue3,
    "normalizeConfig": localValue18,
    "getConfig": localValue20,
    "getActiveConfig": localValue21,
    "setConfig": localValue22,
    "getProviderDefinition": localValue23,
    "getProviderName": localValue24,
    "supportsModelListFetch": localValue6,
    "getModelOptions": localValue7,
    "validateActiveConfig": localValue28,
    "resolveFriendTtsSettings": localValue29,
    "resolveMessageTtsFriend": localValue31,
    "canSpeakForFriend": localValue32,
    "canSpeakMessage": localValue33,
    "normalizeLanguage": localValue35,
    "getUserErrorMessage": localValue50,
    "fetchModels": localValue94,
    "speakText": localValue83,
    "speakTextCached": localValue84,
    "prepareSpeech": localValue82,
    "playAudioUrl": localValue53,
    "getCachedAudioUrls": localValue78,
    "clearAudioCache": localValue79,
    "stopPlayback"() {
      localValue9 && (localValue9.pause(), localValue9 = null);
    }
  });
})();
