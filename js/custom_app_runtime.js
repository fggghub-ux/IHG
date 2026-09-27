(function () {
  'use strict';

  const text_2 = "custom_apps",
    text_3 = "custom_app_data:",
    schemaVersion_2 = 1,
    maxAppBytes_2 = 2097152,
    maxDataBytes_2 = 1048576,
    count_6 = 262144,
    value_7 = new Set(["ai", "characters", "profile"]),
    value_8 = /^[a-z0-9][a-z0-9._-]{2,63}$/,
    value_9 = /^[a-zA-Z0-9._:-]{1,100}$/,
    text_10 = "u2-custom-app",
    source_3 = "u2-custom-app-host",
    id_3 = "custom-app-runner-view",
    text_13 = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; media-src data: blob:; font-src data:; connect-src 'none'; child-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'";
  let options = {
      schemaVersion: schemaVersion_2,
      apps: []
    },
    value_14 = null,
    value_15 = null,
    value_16 = null;
  function handleAction_17(value_56) {
    if (value_56 == null || typeof value_56 !== "object") return value_56;
    if (typeof structuredClone === "function") return structuredClone(value_56);
    return JSON.parse(JSON.stringify(value_56));
  }
  function handleAction_18(value_57) {
    return new TextEncoder().encode(String(value_57 || "")).byteLength;
  }
  function handleAction_19(value_58) {
    const items = Array.isArray(value_58?.apps) ? value_58.apps : [],
      value_59 = new Set();
    return {
      schemaVersion: schemaVersion_2,
      apps: items.filter(value_60 => {
        if (!value_60 || !value_8.test(String(value_60.id || "")) || value_59.has(value_60.id)) return false;
        return value_59.add(value_60.id), typeof value_60.source === "string" && value_60.source.length > 0;
      }).map(value_61 => ({
        id: String(value_61.id),
        name: String(value_61.name || value_61.id).slice(0, 30),
        version: String(value_61.version || "1.0.0").slice(0, 20),
        description: String(value_61.description || "").slice(0, 160),
        icon: handleAction_26(value_61.icon),
        permissions: handleAction_25(value_61.permissions, false),
        source: String(value_61.source),
        installedAt: Number(value_61.installedAt) || Date.now(),
        updatedAt: Number(value_61.updatedAt) || Date.now()
      }))
    };
  }
  async function ready_2() {
    if (value_16) return value_16;
    return value_16 = (async () => {
      if (!window.appStorage) throw new Error("本地存储尚未准备好");
      return await window.appStorage.ready, options = handleAction_19(window.appStorage.readDomain(text_2, options)), handleU2HomeDesktopReady(), true;
    })()["catch"](value_62 => {
      return console.warn("[custom_app_runtime] Initialization failed.", value_62), false;
    }), value_16;
  }
  function handleAction_21(value_63) {
    if (!value_63) return null;
    return handleAction_17({
      id: value_63.id,
      name: value_63.name,
      version: value_63.version,
      description: value_63.description,
      icon: value_63.icon,
      permissions: value_63.permissions,
      installedAt: value_63.installedAt,
      updatedAt: value_63.updatedAt
    });
  }
  function getInstalledApps_2() {
    return options.apps.map(handleAction_21);
  }
  function handleAction_23(value_64) {
    return options.apps.find(value_65 => value_65.id === String(value_64 || "")) || null;
  }
  function handleAction_24(element, value_66) {
    return String(element.querySelector("meta[name=\"" + value_66 + "\"]")?.getAttribute("content") || "").trim();
  }
  function handleAction_25(value_67, value_68 = true) {
    const items_69 = Array.isArray(value_67) ? value_67 : String(value_67 || "").split(/[\s,]+/),
      from_70 = Array.from(new Set(items_69.map(value_72 => String(value_72 || "").trim().toLowerCase()).filter(Boolean))),
      filter_71 = from_70.filter(value_73 => !value_7.has(value_73));
    if (value_68 && filter_71.length) throw handleAction_44("invalid_permissions", "不支持的权限：" + filter_71.join("、"));
    return from_70.filter(value_74 => value_7.has(value_74));
  }
  function handleAction_26(value_75) {
    const trim_76 = String(value_75 || "").trim();
    if (!trim_76) return "🎮";
    if (/^data:image\/(?:png|jpeg|jpg|webp|gif|svg\+xml);base64,/i.test(trim_76)) {
      if (handleAction_18(trim_76) > count_6) throw handleAction_44("icon_too_large", "App 图标不能超过 256KB");
      return trim_76;
    }
    if (trim_76.length <= 16 && !/[<>]/.test(trim_76)) return trim_76;
    throw handleAction_44("invalid_icon", "App 图标必须是 emoji 或 data:image 图片");
  }
  function inspectSource_2(value_77, value_78 = "") {
    const source_2 = String(value_77 || "");
    if (!source_2.trim()) throw handleAction_44("empty_file", "HTML 文件为空");
    if (handleAction_18(source_2) > maxAppBytes_2) throw handleAction_44("file_too_large", "HTML 文件不能超过 2MB");
    if (typeof DOMParser !== "function") throw handleAction_44("parser_unavailable", "当前浏览器无法解析 HTML App");
    const fromString = new DOMParser().parseFromString(source_2, "text/html"),
      id_2 = handleAction_24(fromString, "u2-app-id").toLowerCase(),
      name_2 = handleAction_24(fromString, "u2-app-name"),
      version_2 = handleAction_24(fromString, "u2-app-version"),
      description_2 = handleAction_24(fromString, "u2-app-description"),
      icon_2 = handleAction_26(handleAction_24(fromString, "u2-app-icon")),
      permissions_2 = handleAction_25(handleAction_24(fromString, "u2-app-permissions"));
    if (!value_8.test(id_2)) throw handleAction_44("invalid_id", "u2-app-id 需为 3–64 位小写字母、数字、点、横线或下划线");
    if (!name_2 || name_2.length > 30) throw handleAction_44("invalid_name", "u2-app-name 必填且不能超过 30 个字符");
    if (!version_2 || version_2.length > 20) throw handleAction_44("invalid_version", "u2-app-version 必填且不能超过 20 个字符");
    if (description_2.length > 160) throw handleAction_44("invalid_description", "u2-app-description 不能超过 160 个字符");
    if (fromString.querySelector("script[src], link[rel=\"stylesheet\"][href]")) throw handleAction_44("external_assets", "第一版仅支持自包含 HTML，请将 CSS 和 JS 写入文件内部");
    return {
      id: id_2,
      name: name_2,
      version: version_2,
      description: description_2,
      icon: icon_2,
      permissions: permissions_2,
      source: source_2,
      fileName: String(value_78 || ""),
      isUpdate: Boolean(handleAction_23(id_2))
    };
  }
  async function inspectFile_2(value_85) {
    if (!value_85 || !/\.html?$/i.test(String(value_85.name || ""))) throw handleAction_44("invalid_file", "请选择 .html 文件");
    if (Number(value_85.size) > maxAppBytes_2) throw handleAction_44("file_too_large", "HTML 文件不能超过 2MB");
    return inspectSource_2(await value_85.text(), value_85.name);
  }
  function handleAction_29() {
    const string_86 = String(window.U2_CUSTOM_APP_TEMPLATE_BASE64 || "");
    if (!string_86) throw handleAction_44("template_unavailable", "内置 App 模板未加载");
    try {
      const from_87 = Uint8Array.from(window.atob(string_86), value_89 => value_89.charCodeAt(0)),
        decode_88 = new TextDecoder().decode(from_87);
      if (!decode_88.includes("u2-app-id") || handleAction_18(decode_88) > maxAppBytes_2) throw handleAction_44("invalid_template", "内置 App 模板无效");
      return decode_88;
    } catch (value_90) {
      if (value_90?.code) throw value_90;
      throw handleAction_44("invalid_template", "内置 App 模板无法解析");
    }
  }
  function handleAction_30(value_2) {
    const element_92 = document.createElement("textarea");
    element_92.value = value_2;
    element_92.readOnly = true;
    element_92.setAttribute("aria-hidden", "true");
    element_92.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0;";
    document.body.appendChild(element_92);
    element_92.focus();
    element_92.select();
    element_92.setSelectionRange(0, element_92.value.length);
    const value_93 = document.execCommand?.("copy") === true;
    element_92.remove();
    if (!value_93) throw handleAction_44("clipboard_unavailable", "无法访问剪贴板，请检查浏览器权限后重试");
  }
  async function copyTemplate_2() {
    const handleAction_29_94 = handleAction_29();
    if (window.navigator.clipboard?.writeText) try {
      return await window.navigator.clipboard.writeText(handleAction_29_94), "copied";
    } catch (value_95) {
      console.warn("[custom_app_runtime] Clipboard API failed, trying fallback.", value_95);
    }
    return handleAction_30(handleAction_29_94), "copied";
  }
  async function install_2(value_96) {
    await ready_2();
    const handleAction_27_97 = inspectSource_2(value_96?.source, value_96?.fileName),
      handleAction_23_98 = handleAction_23(handleAction_27_97.id),
      updatedAt_2 = Date.now(),
      options_100 = {
        id: handleAction_27_97.id,
        name: handleAction_27_97.name,
        version: handleAction_27_97.version,
        description: handleAction_27_97.description,
        icon: handleAction_27_97.icon,
        permissions: handleAction_27_97.permissions,
        source: handleAction_27_97.source,
        installedAt: handleAction_23_98?.installedAt || updatedAt_2,
        updatedAt: updatedAt_2
      };
    return options = handleAction_19({
      ...options,
      apps: [...options.apps.filter(value_101 => value_101.id !== options_100.id), options_100]
    }), await handleAction_35(), handleAction_37(options_100), handleAction_55(handleAction_23_98 ? "updated" : "installed", options_100.id), handleAction_21(options_100);
  }
  async function uninstall_2(value_102) {
    await ready_2();
    const handleAction_23_103 = handleAction_23(value_102);
    if (!handleAction_23_103) return false;
    options = {
      ...options,
      apps: options.apps.filter(value_104 => value_104.id !== handleAction_23_103.id)
    };
    await Promise.all([handleAction_35(), window.appStorage.commitDomain("" + text_3 + handleAction_23_103.id, {}, {
      critical: true,
      reason: "custom-app-uninstall"
    })]);
    if (value_15?.id === handleAction_23_103.id) close_2();
    return handleAction_37(handleAction_23_103), handleAction_55("uninstalled", handleAction_23_103.id), true;
  }
  async function exportApp_2(value_105) {
    await ready_2();
    const handleAction_23_106 = handleAction_23(value_105);
    if (!handleAction_23_106) throw handleAction_44("app_not_found", "没有找到这个 App");
    if (typeof window.u2ExportFile !== "function") throw handleAction_44("export_unavailable", "文件导出功能尚未加载");
    const value_107 = String(handleAction_23_106.name || handleAction_23_106.id).replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_").replace(/[. ]+$/g, "").slice(0, 80) || "u2-app";
    return window.u2ExportFile({
      blob: new window.Blob([handleAction_23_106.source], {
        type: "text/html;charset=utf-8"
      }),
      fileName: value_107 + ".html",
      title: "导出 " + handleAction_23_106.name
    });
  }
  function handleAction_35() {
    return window.appStorage.commitDomain(text_2, options, {
      critical: true,
      reason: "custom-app-registry"
    });
  }
  function handleAction_36(value_108) {
    return "custom-app-launcher-" + value_108;
  }
  function handleAction_37(value_109) {
    if (typeof window.unregisterHomeAppLauncher === "function") window.unregisterHomeAppLauncher(handleAction_36(value_109.id));else document.getElementById(handleAction_36(value_109.id))?.remove();
  }
  function handleU2HomeDesktopReady() {
    options.apps.forEach(handleAction_37);
  }
  function handleAction_39() {
    if (value_14?.view?.isConnected) return value_14;
    const view_2 = document.createElement("div");
    view_2.id = id_3;
    view_2.className = "app-view custom-app-runner-view";
    view_2.setAttribute("role", "application");
    view_2.setAttribute("aria-hidden", "true");
    view_2.inert = true;
    view_2.innerHTML = "\n            <button type=\"button\" class=\"custom-app-runner-back\" aria-label=\"返回\"><i class=\"fas fa-chevron-left\" aria-hidden=\"true\"></i></button>\n            <iframe class=\"custom-app-runner-frame\" sandbox=\"allow-scripts allow-forms allow-same-origin\" csp=\"" + text_13 + "\" referrerpolicy=\"no-referrer\" title=\"自制 App\"></iframe>\n        ";
    document.getElementById("app")?.appendChild(view_2);
    const frame_2 = view_2.querySelector(".custom-app-runner-frame");
    return view_2.querySelector(".custom-app-runner-back")?.addEventListener("click", close_2), value_14 = {
      view: view_2,
      frame: frame_2
    }, value_14;
  }
  function handleAction_40(value_111) {
    const stringify_112 = JSON.stringify(value_111);
    return "<script>(function(){'use strict';var APP_ID=" + stringify_112 + ",seq=0,pending=new Map();function call(method,args){return new Promise(function(resolve,reject){var requestId=APP_ID+':' + Date.now()+':' + (++seq);pending.set(requestId,{resolve:resolve,reject:reject});parent.postMessage({source:'" + text_10 + "',appId:APP_ID,requestId:requestId,method:method,args:args||{}},'*')})}addEventListener('message',function(event){var data=event.data;if(!data||data.source!=='" + source_3 + "'||data.appId!==APP_ID)return;var task=pending.get(data.requestId);if(!task)return;pending.delete(data.requestId);if(data.ok)task.resolve(data.value);else{var error=new Error(data.error&&data.error.message||'请求失败');error.code=data.error&&data.error.code||'request_failed';task.reject(error)}});window.U2App=Object.freeze({ready:function(){return call('ready')},storage:Object.freeze({get:function(key,fallback){return call('storage.get',{key:key,fallback:fallback})},set:function(key,value){return call('storage.set',{key:key,value:value})},remove:function(key){return call('storage.remove',{key:key})},clear:function(){return call('storage.clear')}}),characters:Object.freeze({list:function(){return call('characters.list')},get:function(id){return call('characters.get',{id:id})}}),profile:Object.freeze({get:function(){return call('profile.get')}}),ai:Object.freeze({chat:function(options){return call('ai.chat',options||{})}}),ui:Object.freeze({toast:function(message){return call('ui.toast',{message:message})},close:function(){return call('ui.close')}})})})();</script>";
  }
  function handleAction_41(value_113) {
    const value_114 = "<meta http-equiv=\"Content-Security-Policy\" content=\"" + text_13 + "\">",
      handleAction_40_115 = handleAction_40(value_113.id);
    let replace_116 = String(value_113.source || "").replace(/<meta\s+[^>]*http-equiv\s*=\s*["']?content-security-policy["']?[^>]*>/gi, "");
    if (/<head(?:\s[^>]*)?>/i.test(replace_116)) return replace_116.replace(/<head(?:\s[^>]*)?>/i, value_117 => "" + value_117 + value_114 + handleAction_40_115);
    return "<!doctype html><html><head>" + value_114 + handleAction_40_115 + "</head><body>" + replace_116 + "</body></html>";
  }
  async function open_2(value_118) {
    await ready_2();
    const handleAction_23_119 = handleAction_23(value_118);
    if (!handleAction_23_119) throw handleAction_44("app_not_found", "这个 App 已被卸载");
    const handleAction_39_120 = handleAction_39();
    value_15 = handleAction_23_119;
    handleAction_39_120.frame.title = handleAction_23_119.name;
    handleAction_39_120.frame.srcdoc = handleAction_41(handleAction_23_119);
    handleAction_39_120.view.inert = false;
    handleAction_39_120.view.setAttribute("aria-hidden", "false");
    if (typeof window.openView === "function") window.openView(handleAction_39_120.view);else handleAction_39_120.view.classList.add("active");
    return true;
  }
  function close_2() {
    if (!value_14?.view) return;
    const activeElement_121 = document.activeElement;
    activeElement_121 && value_14.view.contains(activeElement_121) && typeof activeElement_121.blur === "function" && activeElement_121.blur();
    value_14.view.inert = true;
    value_14.view.setAttribute("aria-hidden", "true");
    if (typeof window.closeView === "function") window.closeView(value_14.view);else value_14.view.classList.remove("active");
    value_14.frame.removeAttribute("srcdoc");
    value_15 = null;
  }
  function handleAction_44(code_2, value_123) {
    const value_124 = new Error(value_123);
    return value_124.code = code_2, value_124;
  }
  function handleAction_45(value_125, value_126) {
    if (!value_125.permissions.includes(value_126)) throw handleAction_44("permission_denied", "App 未申请 " + value_126 + " 权限");
  }
  function handleAction_46(value_127) {
    const string_128 = String(value_127 || "");
    if (!value_9.test(string_128) || ["__proto__", "prototype", "constructor"].includes(string_128)) throw handleAction_44("invalid_storage_key", "存储 key 格式无效");
    return string_128;
  }
  function handleAction_47(value_129) {
    let value_130;
    try {
      value_130 = JSON.stringify(value_129);
    } catch (value_131) {
      throw handleAction_44("not_serializable", "存档只能包含可 JSON 序列化的数据");
    }
    if (value_130 === undefined) throw handleAction_44("not_serializable", "存档只能包含可 JSON 序列化的数据");
    return value_130;
  }
  async function handleAction_48() {
    const value_132 = Array.isArray(window.imData?.friends) ? window.imData.friends : [];
    let items_133 = [];
    if (window.imStorage?.loadFriends) try {
      items_133 = await window.imStorage.loadFriends();
    } catch (value_135) {
      console.warn("[custom_app_runtime] Falling back to loaded character data.", value_135);
    }
    const value_134 = new Map();
    return [...(Array.isArray(items_133) ? items_133 : []), ...value_132].forEach(value_136 => {
      if (value_136?.id != null) value_134.set(String(value_136.id), value_136);
    }), Array.from(value_134.values()).filter(value_137 => value_137?.type === "char");
  }
  async function handleAction_49() {
    return (await handleAction_48()).map(contact => ({
      id: String(contact.id),
      name: String(contact.nickname || contact.realName || contact.realname || "未命名角色"),
      avatarUrl: String(contact.avatarUrl || ""),
      description: String(contact.signature || "").slice(0, 500),
      persona: String(contact.persona || "").slice(0, 8000),
      relationship: String(contact.relationship || "").slice(0, 2500)
    }));
  }
  function handleAction_50() {
    const contact_138 = typeof window.getUserState === "function" ? window.getUserState() : window.userState || {};
    return {
      name: String(contact_138?.name || contact_138?.realName || contact_138?.nickname || "User").slice(0, 100),
      persona: String(contact_138?.persona || "").slice(0, 8000)
    };
  }
  function handleAction_51(value_139) {
    const items_140 = Array.isArray(value_139?.messages) ? value_139.messages : [];
    if (!items_140.length || items_140.length > 30) throw handleAction_44("invalid_messages", "消息数量需为 1–30 条");
    let count_141 = 0;
    const messages_2 = items_140.map(message_144 => {
      const role_2 = String(message_144?.role || "").toLowerCase(),
        content_2 = String(message_144?.content || "");
      if (!["system", "user", "assistant"].includes(role_2) || !content_2 || content_2.length > 12000) throw handleAction_44("invalid_messages", "每条消息需包含有效 role 和不超过 12000 字的文本");
      return count_141 += content_2.length, {
        role: role_2,
        content: content_2
      };
    });
    if (count_141 > 40000) throw handleAction_44("messages_too_large", "消息总长度不能超过 40000 字");
    const number = Number(value_139?.temperature),
      number_143 = Number(value_139?.maxTokens);
    return {
      messages: messages_2,
      temperature: Number.isFinite(number) ? Math.max(0, Math.min(2, number)) : undefined,
      maxTokens: Number.isFinite(number_143) ? Math.max(1, Math.min(4096, Math.round(number_143))) : undefined
    };
  }
  async function handleAction_52(value_147) {
    const handleAction_51_148 = handleAction_51(value_147);
    if (!window.u2Api || typeof window.u2Api.fetchChatCompletion !== "function") throw handleAction_44("api_unavailable", "AI 接口尚未准备好");
    const value_149 = typeof window.getApiConfig === "function" ? window.getApiConfig() : window.apiConfig;
    let apiConfig_2;
    try {
      apiConfig_2 = window.u2Api.validateApiConfig(value_149);
    } catch (value_153) {
      throw handleAction_44("api_not_configured", "请先在设置中完成 API 配置");
    }
    const apiEndpoint = window.u2Api.normalizeApiEndpoint(apiConfig_2.endpoint, apiConfig_2.provider),
      value_151 = new AbortController(),
      setTimeout_152 = window.setTimeout(() => value_151.abort(), 60000);
    try {
      const value_154 = await window.u2Api.fetchChatCompletion(apiEndpoint, {
        method: "POST",
        headers: window.u2Api.buildApiHeaders(apiConfig_2, {
          [window.u2Api.INTERNAL_SILENT_ERROR_HEADER]: "1"
        }),
        apiConfig: apiConfig_2,
        signal: value_151.signal,
        body: {
          model: apiConfig_2.model,
          messages: handleAction_51_148.messages,
          temperature: handleAction_51_148.temperature ?? apiConfig_2.temperature,
          ...(handleAction_51_148.maxTokens == null ? {} : {
            max_tokens: handleAction_51_148.maxTokens
          }),
          stream: false
        }
      });
      if (!value_154.ok) {
        const value_157 = await window.u2Api.readApiError(value_154);
        throw handleAction_44("api_error", value_157.message || "API 请求失败 (" + value_154.status + ")");
      }
      const value_155 = await value_154.json(),
        text_4 = value_155?.choices?.[0]?.message?.content;
      if (typeof text_4 !== "string") throw handleAction_44("invalid_api_response", "API 没有返回有效文本");
      return {
        text: text_4,
        usage: value_155?.usage || null,
        model: String(value_155?.model || apiConfig_2.model)
      };
    } catch (value_158) {
      if (value_158?.name === "AbortError") throw handleAction_44("api_timeout", "API 请求超时");
      throw value_158;
    } finally {
      window.clearTimeout(setTimeout_152);
    }
  }
  async function handleAction_53(value_159, value_160, value_161) {
    const value_162 = "" + text_3 + value_159.id;
    if (value_160 === "ready") return handleAction_21(value_159);
    if (value_160 === "storage.get") {
      const handleAction_46_163 = handleAction_46(value_161?.key),
        domain = window.appStorage.readDomain(value_162, {});
      return Object.prototype.hasOwnProperty.call(domain, handleAction_46_163) ? handleAction_17(domain[handleAction_46_163]) : handleAction_17(value_161?.fallback);
    }
    if (value_160 === "storage.set") {
      const handleAction_46_164 = handleAction_46(value_161?.key);
      return handleAction_47(value_161?.value), await window.appStorage.commitDomain(value_162, value_165 => {
        const value_166 = value_165 && typeof value_165 === "object" && !Array.isArray(value_165) ? value_165 : {};
        value_166[handleAction_46_164] = handleAction_17(value_161.value);
        if (handleAction_18(handleAction_47(value_166)) > maxDataBytes_2) throw handleAction_44("storage_limit", "单个 App 的存档不能超过 1MB");
        return value_166;
      }, {
        critical: true,
        reason: "custom-app-data"
      }), true;
    }
    if (value_160 === "storage.remove") {
      const handleAction_46_167 = handleAction_46(value_161?.key);
      return await window.appStorage.commitDomain(value_162, value_168 => {
        if (value_168 && typeof value_168 === "object") delete value_168[handleAction_46_167];
        return value_168 || {};
      }, {
        critical: true,
        reason: "custom-app-data"
      }), true;
    }
    if (value_160 === "storage.clear") return await window.appStorage.commitDomain(value_162, {}, {
      critical: true,
      reason: "custom-app-data-clear"
    }), true;
    if (value_160 === "characters.list") return handleAction_45(value_159, "characters"), handleAction_49();
    if (value_160 === "characters.get") return handleAction_45(value_159, "characters"), (await handleAction_49()).find(value_169 => value_169.id === String(value_161?.id || "")) || null;
    if (value_160 === "profile.get") return handleAction_45(value_159, "profile"), handleAction_50();
    if (value_160 === "ai.chat") return handleAction_45(value_159, "ai"), handleAction_52(value_161);
    if (value_160 === "ui.toast") {
      const slice_170 = String(value_161?.message || "").slice(0, 300);
      if (slice_170) window.showToast?.(slice_170);
      return true;
    }
    if (value_160 === "ui.close") return close_2(), true;
    throw handleAction_44("unknown_method", "不支持的 U2App 接口");
  }
  async function handleMessage(value_171) {
    const data_172 = value_171.data;
    if (!data_172 || data_172.source !== text_10 || !value_14?.frame || value_171.source !== value_14.frame.contentWindow) return;
    const value_173 = value_15;
    if (!value_173 || data_172.appId !== value_173.id || !handleAction_23(value_173.id)) return;
    const requestId_2 = String(data_172.requestId || "");
    if (!requestId_2 || requestId_2.length > 180) return;
    try {
      const value_3 = await handleAction_53(value_173, String(data_172.method || ""), data_172.args || {});
      value_171.source.postMessage({
        source: source_3,
        appId: value_173.id,
        requestId: requestId_2,
        ok: true,
        value: value_3
      }, "*");
    } catch (value_176) {
      value_171.source.postMessage({
        source: source_3,
        appId: value_173.id,
        requestId: requestId_2,
        ok: false,
        error: {
          code: String(value_176?.code || "request_failed"),
          message: String(value_176?.message || "请求失败")
        }
      }, "*");
    }
  }
  function handleAction_55(action_2, appId_2) {
    window.dispatchEvent(new CustomEvent("u2-custom-apps-changed", {
      detail: {
        action: action_2,
        appId: appId_2
      }
    }));
  }
  window.addEventListener("message", handleMessage);
  window.addEventListener("u2-home-desktop-ready", handleU2HomeDesktopReady);
  window.customAppRuntime = Object.freeze({
    ready: ready_2,
    copyTemplate: copyTemplate_2,
    inspectFile: inspectFile_2,
    inspectSource: inspectSource_2,
    install: install_2,
    uninstall: uninstall_2,
    exportApp: exportApp_2,
    open: open_2,
    close: close_2,
    getInstalledApps: getInstalledApps_2,
    getApp: value_179 => handleAction_21(handleAction_23(value_179)),
    limits: Object.freeze({
      maxAppBytes: maxAppBytes_2,
      maxDataBytes: maxDataBytes_2
    })
  });
  ready_2();
})();
