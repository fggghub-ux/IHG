(function (value, value_2) {
  const value_2_3 = value_2();
  if (typeof module === "object" && module.exports) module.exports = value_2_3;
  if (value) value.imOfflineSummaryErrors = value_2_3;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  'use strict';

  const count = 500;
  function handleAction_4(value_11) {
    return String(value_11 || "").replace(/\bBearer\s+[A-Za-z0-9._~+/=-]{6,}\b/gi, "Bearer [已隐藏]").replace(/\b(?:sk|rk|pk|sess)-[A-Za-z0-9._-]{6,}\b/gi, "[已隐藏的密钥]").replace(/([?&](?:api[_-]?key|key|token)=)[^&\s]+/gi, "$1[已隐藏]").replace(/(["']?(?:api[_ -]?key|x-api-key|x-goog-api-key|authorization)["']?\s*[:=]\s*["'])([^"']+)(["'])/gi, "$1[已隐藏]$3").replace(/((?:api[_ -]?key|x-api-key|x-goog-api-key|authorization)\s*[:=]\s*)([^"',}\s]{3,})/gi, "$1[已隐藏]");
  }
  function cleanText_2(value_12, value_13 = count) {
    const replace_14 = String(value_12 || "").replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "),
      trim_15 = handleAction_4(replace_14).replace(/\s+/g, " ").trim();
    if (!trim_15) return "";
    return trim_15.length > value_13 ? trim_15.slice(0, value_13) + "…" : trim_15;
  }
  function handleAction_6(value_16) {
    for (const value_17 of value_16) {
      if (typeof value_17 === "string" && value_17.trim()) return value_17.trim();
      if (typeof value_17 === "number" || typeof value_17 === "boolean") return String(value_17);
    }
    return "";
  }
  function extractApiDetail_2(value_18) {
    const trim_19 = String(value_18 || "").trim();
    if (!trim_19) return "";
    try {
      const result = JSON.parse(trim_19),
        value_20 = result?.error && typeof result.error === "object" ? result.error : null,
        handleAction_6_21 = handleAction_6([value_20?.message, value_20?.detail, result?.message, result?.detail, result?.error_description, typeof result?.error === "string" ? result.error : ""]),
        filter_22 = [value_20?.code ?? result?.code, value_20?.type ?? result?.type, value_20?.param ?? result?.param].map(value_23 => cleanText_2(value_23, 80)).filter(Boolean);
      if (handleAction_6_21) {
        const value_24 = filter_22.length ? " [" + filter_22.join(" / ") + "]" : "";
        return cleanText_2("" + handleAction_6_21 + value_24);
      }
      return cleanText_2(JSON.stringify(result));
    } catch (value_25) {
      return cleanText_2(trim_19);
    }
  }
  function createError_2(value_26, value_27, value_28 = {}) {
    const value_29 = new Error(String(value_27 || value_26 || "线下总结失败"));
    return value_29.name = "OfflineSummaryError", value_29.code = String(value_26 || "unknown"), Object.assign(value_29, value_28), value_29;
  }
  function handleAction_9(value_30, value_31) {
    const toLowerCase_32 = String(value_31 || "").toLowerCase();
    if (value_30 === 400 && /(context|token|maximum|too long|length|context_length)/.test(toLowerCase_32)) return "发送的线下记录超过了当前模型的上下文限制";
    if (value_30 === 400) return "接口拒绝了请求，通常是模型名称、参数或接口格式不兼容";
    if (value_30 === 401) return "API Key 无效或已过期";
    if (value_30 === 403) return "当前 API Key 没有访问该模型的权限";
    if (value_30 === 404) return "接口地址或模型不存在";
    if (value_30 === 408) return "上游接口处理超时";
    if (value_30 === 413) return "线下总结请求体过大";
    if (value_30 === 422) return "接口无法处理当前请求参数";
    if (value_30 === 429) return "请求过于频繁、额度不足或并发数超限";
    if ([500, 502, 503, 504].includes(value_30)) return "上游 API 服务暂时不可用";
    return "API 请求失败";
  }
  function formatFailure_2(value_33) {
    const value_34 = Number(value_33?.status) || 0,
      handleAction_5_35 = cleanText_2(value_33?.statusText, 80),
      value_36 = value_34 ? "（HTTP " + value_34 + (handleAction_5_35 ? " " + handleAction_5_35 : "") + "）" : "",
      handleAction_7_37 = extractApiDetail_2(value_33?.rawBody),
      handleAction_5_38 = cleanText_2(value_33?.apiDetail || value_33?.detail || "", count),
      value_39 = handleAction_5_38 || handleAction_7_37,
      string = String(value_33?.code || "");
    if (value_34 && string === "http_error") {
      const handleAction_9_40 = handleAction_9(value_34, value_39 || value_33?.message);
      return "" + handleAction_9_40 + value_36 + (value_39 ? "｜接口详情：" + value_39 : "");
    }
    switch (string) {
      case "config_missing":
        {
          const value_41 = Array.isArray(value_33?.missingFields) ? value_33.missingFields.filter(Boolean) : [];
          return "线下总结 API 配置不完整" + (value_41.length ? "：缺少" + value_41.join("、") : "");
        }
      case "invalid_endpoint":
        return "API 接口地址无效" + (value_39 ? "｜详情：" + value_39 : "");
      case "invalid_json":
        return "API 返回的不是有效 JSON" + value_36 + (value_39 ? "｜返回片段：" + value_39 : "");
      case "empty_response":
        return "API 请求成功，但模型没有返回总结内容" + value_36 + (value_39 ? "｜返回片段：" + value_39 : "");
      case "invalid_artifacts":
        return "模型返回的见面总结格式不符合要求，缺少可用的 meetingSummary.summary" + (value_39 ? "｜模型返回：" + value_39 : "");
      case "settings_persistence":
        return "线下总结设置保存失败，本次请求尚未发送";
      case "persistence":
        return "见面总结已生成，但见面记录保存失败，当前聊天记录仍已保留";
      case "network":
        return "无法连接 API，请检查接口地址、网络、代理或跨域设置" + (value_39 ? "｜底层错误：" + value_39 : "");
      default:
        {
          if (value_34) {
            const handleAction_9_43 = handleAction_9(value_34, value_39 || value_33?.message);
            return "" + handleAction_9_43 + value_36 + (value_39 ? "｜接口详情：" + value_39 : "");
          }
          const handleAction_5_42 = cleanText_2(value_33?.message || "", count);
          return handleAction_5_42 && !/^offline summary/i.test(handleAction_5_42) ? "未预期错误：" + handleAction_5_42 : "线下总结发生未预期错误，请查看控制台日志";
        }
    }
  }
  return Object.freeze({
    cleanText: cleanText_2,
    extractApiDetail: extractApiDetail_2,
    createError: createError_2,
    formatFailure: formatFailure_2
  });
});
