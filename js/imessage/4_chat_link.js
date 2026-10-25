(window.u2OnStorageReady || (apk119Value1 => document.addEventListener("DOMContentLoaded", apk119Value1)))(() => {
  window.imChat = window.imChat || {};
  const apk119Value2 = window.imChat,
    apk119Value3 = "u2_fakeLinkAiContextOptions",
    apk119Value4 = "picsum.photos",
    apk119Value5 = new Set([apk119Value4, "fastly.picsum.photos"]),
    apk119Value6 = 10,
    apk119Value7 = 50,
    apk119Value8 = new Map(),
    apk119Value9 = new Map(),
    apk119Value10 = new Map(),
    apk119Value11 = 120000;
  function apk119Value12(apk119Value57) {
    if (typeof window.imApp?.["getFriendById"] === "function") return window.imApp.getFriendById(apk119Value57) || null;
    return (window.imData?.["friends"] || []).find(apk119Value58 => String(apk119Value58.id) === String(apk119Value57)) || null;
  }
  function apk119Value13(apk119Value59, apk119Value60 = 50000) {
    return String(apk119Value59 == null ? "" : apk119Value59).replace(/\u0000/g, "").trim().slice(0, apk119Value60);
  }
  function apk119Value14(apk119Value61) {
    return String(apk119Value61 == null ? "" : apk119Value61).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  function apk119Value15(apk119Value62, apk119Value63 = 20000) {
    return apk119Value13(apk119Value62, 50000).replace(/<\s*(script|style|iframe|object|embed|svg|canvas)[\s\S]*?<\s*\/\s*\1\s*>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, "\"").replace(/&#039;/gi, "'").replace(/\s+/g, " ").trim().slice(0, apk119Value63);
  }
  function apk119Value16(apk119Value64) {
    const apk119Value65 = String(apk119Value64 == null ? "" : apk119Value64);
    let apk119Value66 = 2166136261;
    for (let apk119Value67 = 0; apk119Value67 < apk119Value65.length; apk119Value67 += 1) {
      apk119Value66 ^= apk119Value65.charCodeAt(apk119Value67), apk119Value66 = Math.imul(apk119Value66, 16777619);
    }
    return (apk119Value66 >>> 0).toString(36);
  }
  function apk119Value17(apk119Value68 = [], apk119Value69 = 0, apk119Value70 = 900, apk119Value71 = 600) {
    const apk119Value72 = apk119Value16([].concat(apk119Value68, apk119Value69).join("|")) || "u2";
    return "https://picsum.photos/seed/u2-" + apk119Value72 + "-" + apk119Value69 + "/" + apk119Value70 + "/" + apk119Value71;
  }
  function apk119Value18(apk119Value73) {
    try {
      const apk119Value74 = new URL(String(apk119Value73 || ""));
      return apk119Value74.protocol === "https:" && apk119Value5.has(apk119Value74.hostname);
    } catch (apk119Value75) {
      return false;
    }
  }
  function apk119Value19(apk119Value76, apk119Value77 = {}) {
    const apk119Value78 = apk119Value13(apk119Value76, 20000);
    if (!apk119Value78) return "";
    const apk119Value79 = [apk119Value13(apk119Value77.domain || "", 180), apk119Value13(apk119Value77.prompt || "", 1000), apk119Value13(apk119Value77.siteName || "", 80)];
    let apk119Value80 = 0;
    return apk119Value78.replace(/<img\b([^>]*)>/gi, (apk119Value81, apk119Value82 = "") => {
      const apk119Value83 = String(apk119Value82).match(/\s+src\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/i),
        apk119Value84 = apk119Value83 ? apk119Value83[1].replace(/^['"]|['"]$/g, "") : "",
        apk119Value85 = apk119Value18(apk119Value84) ? apk119Value84 : apk119Value17(apk119Value79, apk119Value80);
      apk119Value80 += 1;
      let apk119Value86 = String(apk119Value82).replace(/\s+src\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/ig, "").replace(/\s+srcset\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/ig, "").replace(/\s+loading\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/ig, "");
      if (!/\salt\s*=/i.test(apk119Value86)) apk119Value86 += " alt=\"\"";
      return "<img" + apk119Value86 + " src=\"" + apk119Value14(apk119Value85) + "\" loading=\"lazy\">";
    });
  }
  function apk119Value20(apk119Value87) {
    const apk119Value88 = Math.round(Number(apk119Value87) || apk119Value6);
    return Math.min(apk119Value7, Math.max(1, apk119Value88));
  }
  function apk119Value21() {
    const apk119Value89 = {
      includeCharPersona: false,
      includeUserPersona: false,
      includeRecentContext: false,
      recentContextLimit: apk119Value6
    };
    try {
      const apk119Value90 = window.StorageManager && typeof window.StorageManager.load === "function" ? window.StorageManager.load(apk119Value3, apk119Value89) : null;
      return {
        includeCharPersona: !!apk119Value90?.["includeCharPersona"],
        includeUserPersona: !!apk119Value90?.["includeUserPersona"],
        includeRecentContext: !!apk119Value90?.["includeRecentContext"],
        recentContextLimit: apk119Value20(apk119Value90?.["recentContextLimit"])
      };
    } catch (apk119Value91) {
      return apk119Value89;
    }
  }
  function apk119Value22(apk119Value92 = {}) {
    const apk119Value93 = {
      includeCharPersona: !!apk119Value92.includeCharPersona,
      includeUserPersona: !!apk119Value92.includeUserPersona,
      includeRecentContext: !!apk119Value92.includeRecentContext,
      recentContextLimit: apk119Value20(apk119Value92.recentContextLimit)
    };
    try {
      window.StorageManager && typeof window.StorageManager.save === "function" && window.StorageManager.save(apk119Value3, apk119Value93);
    } catch (apk119Value94) {}
    return apk119Value93;
  }
  function apk119Value23() {
    return document.getElementById("app") || document.body;
  }
  function apk119Value24(apk119Value95) {
    if (!apk119Value95 || typeof apk119Value95.focus !== "function") return;
    try {
      apk119Value95.focus({
        preventScroll: true
      });
    } catch (apk119Value96) {
      apk119Value95.focus();
    }
  }
  function apk119Value25(apk119Value97, apk119Value98 = "") {
    const apk119Value99 = ["system_depth", "before_role", "after_role"],
      apk119Value100 = [];
    return apk119Value99.forEach(apk119Value101 => {
      let apk119Value102 = "";
      if (apk119Value97 && window.imApp?.["getWorldBookContextForFriendByPosition"]) apk119Value102 = window.imApp.getWorldBookContextForFriendByPosition(apk119Value101, apk119Value97, apk119Value98) || "";else window.getGlobalWorldBookContextByPosition && (apk119Value102 = window.getGlobalWorldBookContextByPosition(apk119Value101, apk119Value98) || "");
      if (apk119Value102) apk119Value100.push(apk119Value101 + ":\n" + apk119Value102);
    }), apk119Value13(apk119Value100.join("\n\n"), 6000);
  }
  function apk119Value26(apk119Value103) {
    if (!apk119Value103 || typeof apk119Value103 !== "object") return "";
    const apk119Value104 = apk119Value103.realName || apk119Value103.nickname || apk119Value103.name || "Char",
      apk119Value105 = apk119Value13(apk119Value103.persona || apk119Value103.signature || apk119Value103.description || "", 2000);
    return apk119Value105 ? "Char name: " + apk119Value104 + "\nChar persona:\n" + apk119Value105 : "";
  }
  function apk119Value27(apk119Value106) {
    const apk119Value107 = window.getUserState ? window.getUserState() : window.userState || {},
      apk119Value108 = apk119Value106?.["type"] === "group" ? window.imApp?.["getGroupUserIdentity"]?.(apk119Value106) : window.imApp?.["getCharUserIdentity"]?.(apk119Value106),
      apk119Value109 = apk119Value108?.["name"] || apk119Value107.name || apk119Value107.realName || "User",
      apk119Value110 = apk119Value13(apk119Value108?.["persona"] || (window.imApp?.["getEffectivePersonaForFriend"] ? window.imApp.getEffectivePersonaForFriend(apk119Value106) : "") || apk119Value107.persona || apk119Value107.signature || "", 2000);
    return apk119Value110 ? "User name: " + apk119Value109 + "\nUser persona:\n" + apk119Value110 : "";
  }
  function apk119Value28(apk119Value111, apk119Value112 = apk119Value6) {
    if (!apk119Value111 || typeof apk119Value111 !== "object") return "";
    const apk119Value113 = apk119Value20(apk119Value112),
      apk119Value114 = (Array.isArray(apk119Value111.messages) ? apk119Value111.messages : []).filter(apk119Value117 => apk119Value117 && (apk119Value117.role === "user" || apk119Value117.role === "assistant") && apk119Value117.excludedFromContext !== true && !apk119Value117.privateChatSnapshot && !apk119Value117.privateFromGroup && !apk119Value117.payload?.["privateChatSnapshot"] && !apk119Value117.payload?.["privateFromGroup"] && !["group_private_message", "group_private_chat", "group_friend_private_chat", "user_phone_access_card", "memory_request"].includes(apk119Value117.type)).slice(-apk119Value113);
    let apk119Value115 = 0;
    const apk119Value116 = [];
    return apk119Value114.forEach(apk119Value118 => {
      let apk119Value119 = apk119Value118.role === "assistant" ? "Char" : "User",
        apk119Value120 = "";
      if (window.imApp?.["formatMessageForApiContext"]) {
        const apk119Value123 = window.imApp.formatMessageForApiContext(apk119Value118, apk119Value111, {
          userName: window.getUserState?.()?.["name"] || "User",
          expandLinkContent: false,
          maxLinkBodyChars: 400
        });
        if (!apk119Value123) return;
        if (apk119Value123?.["role"] === "assistant") apk119Value119 = "Char";
        if (apk119Value123?.["role"] === "user") apk119Value119 = "User";
        apk119Value120 = apk119Value123?.["content"] || "";
      }
      !apk119Value120 && (apk119Value120 = apk119Value118.text || apk119Value118.content || apk119Value118.fakeLinkData?.["summary"] || "");
      const apk119Value121 = 4000 - apk119Value115;
      if (apk119Value121 <= 0) return;
      const apk119Value122 = apk119Value119 + ": " + apk119Value13(apk119Value120, Math.min(400, apk119Value121));
      if (!apk119Value122.replace(/^(User|Char):\s*$/, "").trim()) return;
      apk119Value116.push(apk119Value122), apk119Value115 += apk119Value122.length + 1;
    }), apk119Value13(apk119Value116.join("\n"), 4000);
  }
  function apk119Value29(apk119Value124) {
    const apk119Value125 = apk119Value13(apk119Value124, 220);
    if (!apk119Value125 || /[\u0000-\u001F\u007F]/.test(apk119Value125) || /[\s<>"'\x60\\]/.test(apk119Value125)) return null;
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(apk119Value125) && !/^https?:\/\//i.test(apk119Value125)) return null;
    const apk119Value126 = /^https?:\/\//i.test(apk119Value125) ? apk119Value125 : "https://" + apk119Value125;
    try {
      const apk119Value127 = new URL(apk119Value126);
      if (!["http:", "https:"].includes(apk119Value127.protocol) || !apk119Value127.hostname) return null;
      const apk119Value128 = apk119Value127.hostname.toLowerCase(),
        apk119Value129 = apk119Value127.pathname && apk119Value127.pathname !== "/" ? apk119Value127.pathname : "",
        apk119Value130 = apk119Value127.search || "",
        apk119Value131 = ("" + apk119Value128 + apk119Value129 + apk119Value130).replace(/\/+$/, "");
      if (!apk119Value131 || apk119Value131.length > 180) return null;
      return {
        domain: apk119Value128,
        path: apk119Value129,
        search: apk119Value130,
        displayUrl: apk119Value131,
        canonicalUrl: "https://" + apk119Value131
      };
    } catch (apk119Value132) {
      return null;
    }
  }
  function apk119Value30(apk119Value133) {
    return apk119Value29(apk119Value133)?.["displayUrl"] || "";
  }
  function apk119Value31(apk119Value134 = {}) {
    const apk119Value135 = String(apk119Value134.endpoint || "").trim();
    return apk119Value135 ? window.u2Api.resolveChatCompletionsEndpoint(apk119Value135) : "";
  }
  function apk119Value32(apk119Value136) {
    const apk119Value137 = String(apk119Value136 || "").trim();
    if (!apk119Value137) return null;
    const apk119Value138 = apk119Value137.match(/\x60\x60\x60(?:json)?\s*([\s\S]*?)\x60\x60\x60/i),
      apk119Value139 = apk119Value138 ? apk119Value138[1].trim() : apk119Value137;
    try {
      return JSON.parse(apk119Value139);
    } catch (apk119Value140) {
      const apk119Value141 = apk119Value139.indexOf("{"),
        apk119Value142 = apk119Value139.lastIndexOf("}");
      if (apk119Value141 >= 0 && apk119Value142 > apk119Value141) try {
        return JSON.parse(apk119Value139.slice(apk119Value141, apk119Value142 + 1));
      } catch (apk119Value143) {}
    }
    return null;
  }
  function apk119Value33(apk119Value144) {
    return apk119Value13(apk119Value144, 20000).replace(/<\s*(script|style|iframe|object|embed|link|meta|base)[\s\S]*?<\s*\/\s*\1\s*>/gi, "").replace(/<\s*\/?\s*(script|style|iframe|object|embed|link|meta|base)[^>]*>/gi, "").replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "").replace(/\s+(href|action|formaction)\s*=\s*("https?:[^"]*"|'https?:[^']*'|https?:[^\s>]+)/gi, "").slice(0, 20000);
  }
  function apk119Value34(apk119Value145) {
    return apk119Value13(apk119Value145, 16000).replace(/@import[^;]+;/gi, "").replace(/url\s*\([^)]*\)/gi, "none").replace(/expression\s*\([^)]*\)/gi, "").replace(/javascript\s*:/gi, "").replace(/behavior\s*:/gi, "").replace(/-moz-binding\s*:/gi, "").slice(0, 16000);
  }
  function apk119Value35(apk119Value146) {
    return apk119Value13(apk119Value146, 12000).replace(/<\/script/gi, "<\\/script").slice(0, 12000);
  }
  function apk119Value36(apk119Value147 = {}, apk119Value148 = {}) {
    const apk119Value149 = apk119Value147 && typeof apk119Value147 === "object" ? apk119Value147 : {},
      apk119Value150 = apk119Value33(apk119Value19(apk119Value149.html || "", {
        domain: apk119Value148.domain || "",
        prompt: apk119Value148.prompt || "",
        siteName: apk119Value148.siteName || ""
      }));
    return {
      html: apk119Value150,
      css: apk119Value34(apk119Value149.css || ""),
      js: apk119Value35(apk119Value149.js || ""),
      source: apk119Value13(apk119Value149.source || apk119Value148.source || "ai", 30) || "ai"
    };
  }
  function apk119Value37(apk119Value151) {
    return "(function(channel) {\n        let viewportHeight = 0;\n        let scheduled = false;\n        let reportScheduled = false;\n        let lastWidth = 0;\n        let lastRepairFrame = -1;\n        let lastHeight = 0;\n        const setStyle = (node, name, value) => {\n            if (node.style.getPropertyValue(name) !== value || node.style.getPropertyPriority(name) !== 'important') {\n                node.style.setProperty(name, value, 'important');\n            }\n        };\n        const measure = frameTime => {\n            scheduled = false;\n            const body = document.body;\n            if (!body || !body.getClientRects().length) return;\n            if (!viewportHeight) viewportHeight = Math.max(1, window.innerHeight || 600);\n            // Generated app shells can be fixed or clipped independently of html/body.\n            // Only unlock viewport-sized shells; small accordions and dialogs keep their behavior.\n            const width = Math.max(1, window.innerWidth || document.documentElement.clientWidth);\n            lastWidth = width;\n            const repairs = [];\n            for (const node of body.querySelectorAll('*')) {\n                if (node.hidden || node.closest('[hidden],dialog,[role=\"dialog\"],[aria-modal=\"true\"]')) continue;\n                const rect = node.getBoundingClientRect();\n                if (rect.width < width * 0.7 || rect.height < viewportHeight * 0.4) continue;\n                const style = window.getComputedStyle(node);\n                const isRoot = node.parentElement === body || node.parentElement?.parentElement === body;\n                const fixedShell = isRoot && ['fixed', 'absolute'].includes(style.position) && rect.height >= viewportHeight * 0.7;\n                const clippedShell = node.scrollHeight > node.clientHeight + 4 && ['hidden', 'clip', 'auto', 'scroll'].includes(style.overflowY);\n                if (!fixedShell && !clippedShell && !(isRoot && rect.height >= viewportHeight * 0.9)) continue;\n                repairs.push({ node, isRoot, fixedShell });\n            }\n            // Read all geometry first, then write together. Our own changes must\n            // not schedule another scan through MutationObserver.\n            observer.disconnect();\n            for (const node of [document.documentElement, body]) {\n                setStyle(node, 'height', 'auto');\n                setStyle(node, 'max-height', 'none');\n                setStyle(node, 'touch-action', 'pan-y pinch-zoom');\n            }\n            setStyle(document.documentElement, 'min-height', '0');\n            setStyle(document.documentElement, 'overflow-y', 'hidden');\n            setStyle(body, 'position', 'relative');\n            setStyle(body, 'inset', 'auto');\n            setStyle(body, 'overflow-y', 'visible');\n            setStyle(body, 'min-height', viewportHeight + 'px');\n            for (const { node, isRoot, fixedShell } of repairs) {\n                if (fixedShell) {\n                    setStyle(node, 'position', 'relative');\n                    setStyle(node, 'inset', 'auto');\n                }\n                setStyle(node, 'height', 'auto');\n                setStyle(node, 'min-height', isRoot ? viewportHeight + 'px' : '0');\n                setStyle(node, 'max-height', 'none');\n                setStyle(node, 'overflow-y', 'visible');\n                setStyle(node, 'touch-action', 'pan-y pinch-zoom');\n            }\n            observer.observe(body, observerOptions);\n            lastRepairFrame = frameTime;\n            scheduleReport();\n        };\n        const report = frameTime => {\n            reportScheduled = false;\n            if (scheduled || frameTime === lastRepairFrame) { scheduleReport(); return; }\n            const body = document.body;\n            if (!body || !body.getClientRects().length) return;\n            const height = Math.min(200000, Math.max(viewportHeight, Math.ceil(Math.max(\n                body.scrollHeight, body.offsetHeight, body.getBoundingClientRect().height\n            ))));\n            if (height !== lastHeight) {\n                lastHeight = height;\n                window.parent.postMessage({ type: 'u2-fake-link-height', channel, height }, '*');\n            }\n        };\n        const schedule = () => {\n            if (!scheduled) { scheduled = true; window.requestAnimationFrame(measure); }\n        };\n        const scheduleReport = () => {\n            if (!reportScheduled) { reportScheduled = true; window.requestAnimationFrame(report); }\n        };\n        const observerOptions = { subtree: true, childList: true, characterData: true,\n            attributes: true, attributeFilter: ['hidden', 'open', 'class', 'style'] };\n        const observer = new MutationObserver(schedule);\n        observer.observe(document.body, observerOptions);\n        if (typeof ResizeObserver === 'function') new ResizeObserver(scheduleReport).observe(document.body);\n        window.addEventListener('load', schedule);\n        window.addEventListener('resize', () => { if (window.innerWidth !== lastWidth) schedule(); else scheduleReport(); });\n        document.addEventListener('load', schedule, true);\n        schedule();\n        })(" + JSON.stringify(apk119Value151).replace(/</g, "\\u003c") + ");";
  }
  function apk119Value38(apk119Value152 = {}, apk119Value153 = {}) {
    const apk119Value154 = apk119Value36(apk119Value152),
      apk119Value155 = apk119Value154.css.replace(/<\/style/gi, "<\\/style"),
      apk119Value156 = apk119Value154.js.replace(/<\/script/gi, "<\\/script"),
      apk119Value157 = ["default-src 'none'", "img-src https://picsum.photos https://fastly.picsum.photos data:", "style-src 'unsafe-inline'", "script-src 'unsafe-inline'", "connect-src 'none'", "font-src data:", "media-src 'none'", "object-src 'none'", "base-uri 'none'", "form-action 'none'"].join("; ");
    return ["<!doctype html>", "<html><head><meta charset=\"utf-8\">", "<meta http-equiv=\"Content-Security-Policy\" content=\"" + apk119Value14(apk119Value157) + "\">", "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1,viewport-fit=cover\">", "<style>html,body{margin:0;min-height:100%;overflow-x:hidden}*,*::before,*::after{box-sizing:border-box}button,input,textarea,select{font:inherit}</style>", "<style>" + apk119Value155 + "</style>", "<style>html{height:auto!important;min-height:0!important;overflow-y:" + (apk119Value153.resizeChannel ? "hidden" : "auto") + "!important;touch-action:pan-y pinch-zoom!important}body{height:auto!important;min-height:0!important;max-height:none!important;overflow-y:visible!important;position:relative!important;touch-action:pan-y pinch-zoom!important}</style>", "</head><body>", apk119Value154.html, apk119Value153.resizeChannel ? "<script>" + apk119Value37(apk119Value153.resizeChannel) + "</script>" : "", "<script>\"use strict\";" + apk119Value156 + "</script>", "</body></html>"].join("");
  }
  function apk119Value39(apk119Value158, apk119Value159) {
    const apk119Value160 = "link-height-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
    apk119Value158.setAttribute("data-fake-link-height-channel", apk119Value160), apk119Value158.srcdoc = apk119Value38(apk119Value159, {
      resizeChannel: apk119Value160
    });
  }
  window.addEventListener?.("message", apk119Value161 => {
    const apk119Value162 = apk119Value161.data;
    if (!apk119Value162 || apk119Value162.type !== "u2-fake-link-height" || typeof apk119Value162.channel !== "string" || typeof apk119Value162.height !== "number" || !Number.isFinite(apk119Value162.height) || apk119Value162.height < 1 || apk119Value162.height > 200000) return;
    for (const apk119Value163 of document.querySelectorAll("iframe[data-fake-link-height-channel]")) {
      if (apk119Value161.source !== apk119Value163.contentWindow || apk119Value162.channel !== apk119Value163.getAttribute("data-fake-link-height-channel")) continue;
      apk119Value163.style.height = Math.ceil(apk119Value162.height) + "px";
      break;
    }
  });
  function apk119Value40(apk119Value164) {
    if (!apk119Value164) return false;
    const apk119Value165 = window.imDataUtils?.["normalizeChatLanguage"]?.(apk119Value164) || String(apk119Value164).toLowerCase();
    return !/^(zh(?:[-_].*)?|中文|chinese)$/.test(apk119Value165);
  }
  function apk119Value41(apk119Value166, apk119Value167 = {}) {
    if (!apk119Value166 || typeof apk119Value166 !== "object" || !apk119Value166.webPage?.["html"]) return null;
    const apk119Value168 = apk119Value36(apk119Value166.webPage, apk119Value167),
      apk119Value169 = apk119Value13(apk119Value166.siteName, 80),
      apk119Value170 = apk119Value13(apk119Value166.title, 180);
    if (!apk119Value169 || !apk119Value170 || !apk119Value168.html || !apk119Value168.css || !apk119Value168.js) return null;
    return {
      siteName: apk119Value169,
      title: apk119Value170,
      summary: apk119Value13(apk119Value166.summary, 800),
      bodyText: apk119Value15(apk119Value168.html, 20000),
      webPage: apk119Value168
    };
  }
  function apk119Value42({
    domain: apk119Value171,
    prompt: apk119Value172,
    worldBookContext = "",
    charPersonaContext = "",
    userPersonaContext = "",
    recentChatContext = "",
    includeCharPersona = false,
    includeUserPersona = false,
    includeRecentContext = false,
    pageLanguage = ""
  }) {
    const apk119Value173 = ["", "World-book context (only for setting consistency; ignore if empty):", worldBookContext || "None"];
    if (pageLanguage) apk119Value173.push("Write the visible page, siteName, title, and summary in this character's configured language: " + pageLanguage + ". Proper nouns may keep their original spelling.");
    return includeCharPersona && charPersonaContext && apk119Value173.push("", "Char persona:", charPersonaContext), includeUserPersona && userPersonaContext && apk119Value173.push("", "User persona:", userPersonaContext), includeRecentContext && recentChatContext && apk119Value173.push("", "Recent chat context (make the page feel natural to this relationship and story; do not repeat messages line by line):", recentChatContext), ["Create a fictional but credible, interactive webpage for the in-app iMessage link scene.", "Do not visit or claim to have read a real website. Create only from the domain, User prompt, and supplied context.", "Return valid JSON only, without Markdown, code fences, comments, or explanation.", "Fixed top-level JSON shape:", apk119Value40(pageLanguage) ? "{\"siteName\":\"original site name\",\"title\":\"original card title\",\"summary\":\"original summary\",\"webPage\":{\"html\":\"original page HTML\",\"css\":\"page CSS\",\"js\":\"page JavaScript\"},\"translation\":{\"siteName\":\"中文站点名\",\"title\":\"中文卡片标题\",\"summary\":\"中文摘要\",\"webPage\":{\"html\":\"完整中文页面 HTML\",\"css\":\"page CSS\",\"js\":\"page JavaScript\"}}}" : "{\"siteName\":\"site name\",\"title\":\"chat card title\",\"summary\":\"chat card summary\",\"webPage\":{\"html\":\"page body HTML fragment\",\"css\":\"page CSS\",\"js\":\"plain page JavaScript\"}}", apk119Value40(pageLanguage) ? "In the SAME response, translation MUST contain a complete Simplified Chinese version of the original page, including every visible label, button, hidden panel, and JavaScript-created text. Preserve the same facts, layout, IDs, images, and working interactions in both versions. Do not mix the two languages on one page; do not omit either version." : "The page is in the requested language; no translation field is needed for a Chinese page.", "html, css, and js must each be nonempty strings. html must not include html/head/body/style/script wrapper tags.", "Build a complete small interactive scene naturally related to the characters, relationship, or situation, with one to three meaningful interactions.", "JavaScript must be native and dependency-free. Use DOM queries to bind buttons, toggles, counters, animations, or panels.", "Do not use fetch, XMLHttpRequest, WebSocket, external links, login, payment, credential collection, pop-ups, or parent-page access.", "Do not use localStorage, sessionStorage, indexedDB, window.parent, window.top, window.opener, or postMessage.", "Keep code compact: aim below 8 KB HTML, 6 KB CSS, and 4 KB JS. Do not build a large site, multiple routes, or a framework.", "The page lives in a narrow, fixed-height reader. Let long content scroll vertically: use natural document flow, min-height instead of fixed height, and never lock html/body scrolling or put the whole page in a fixed-position container. Buttons and expandable sections must remain reachable on mobile.", "Use <img> for image positions. src may be empty or use https://picsum.photos/seed/...; the system replaces other image URLs.", "", "Domain: " + apk119Value171, "User prompt: " + (apk119Value172 || "Create a readable, polished, interactive link scene that fits the current chat naturally.")].concat(apk119Value173).join("\n");
  }
  async function apk119Value43({
    domain: apk119Value174,
    prompt: apk119Value175,
    friend = null,
    speakerFriend = null,
    signal = null,
    apiConfig = null,
    includeCharPersona = false,
    includeUserPersona = false,
    includeRecentContext = false,
    recentContextLimit = apk119Value6
  }) {
    const apk119Value176 = apiConfig || (window.getApiConfig ? window.getApiConfig() : window.apiConfig || {}),
      apk119Value177 = apk119Value31(apk119Value176);
    if (!apk119Value177 || !apk119Value176.apiKey || !apk119Value176.model) throw new Error("API_NOT_CONFIGURED");
    if (signal?.["aborted"]) throw signal.reason || Object.assign(new Error("Cancelled"), {
      name: "AbortError"
    });
    const apk119Value178 = new AbortController(),
      apk119Value179 = () => apk119Value178.abort(signal.reason || Object.assign(new Error("Cancelled"), {
        name: "AbortError"
      }));
    signal?.["addEventListener"]("abort", apk119Value179, {
      once: true
    });
    const apk119Value180 = setTimeout(() => apk119Value178.abort(Object.assign(new Error("网页生成超时，请重试"), {
      name: "TimeoutError"
    })), apk119Value11);
    let apk119Value181;
    const apk119Value182 = new Promise((apk119Value183, apk119Value184) => {
      apk119Value181 = () => apk119Value184(apk119Value178.signal.reason || Object.assign(new Error("Cancelled"), {
        name: "AbortError"
      })), apk119Value178.signal.addEventListener("abort", apk119Value181, {
        once: true
      });
    });
    try {
      const apk119Value185 = [apk119Value174, apk119Value175 || ""].filter(Boolean).join("\n"),
        apk119Value186 = apk119Value25(friend, apk119Value185),
        apk119Value187 = includeCharPersona ? apk119Value26(speakerFriend || friend) : "",
        apk119Value188 = includeUserPersona ? apk119Value27(friend) : "",
        apk119Value189 = includeRecentContext ? apk119Value28(friend, recentContextLimit) : "",
        apk119Value190 = speakerFriend ? speakerFriend.language || "zh" : "",
        apk119Value191 = (async () => {
          const apk119Value192 = await fetch(apk119Value177, {
            method: "POST",
            headers: window.u2Api?.["buildApiHeaders"]?.(apk119Value176, {
              "X-U2-Silent-Errors": "1"
            }) || {
              "Content-Type": "application/json",
              Authorization: "Bearer " + apk119Value176.apiKey,
              "X-U2-Silent-Errors": "1"
            },
            signal: apk119Value178.signal,
            body: JSON.stringify({
              model: apk119Value176.model,
              temperature: Number.isFinite(Number(apk119Value176.temperature)) ? Number(apk119Value176.temperature) : 0.72,
              messages: [{
                role: "system",
                content: "You generate lightweight interactive webpages. Output strict JSON only, with compact, dependency-free HTML, CSS, and JavaScript."
              }, {
                role: "user",
                content: apk119Value42({
                  domain: apk119Value174,
                  prompt: apk119Value175,
                  worldBookContext: apk119Value186,
                  charPersonaContext: apk119Value187,
                  userPersonaContext: apk119Value188,
                  recentChatContext: apk119Value189,
                  includeCharPersona: includeCharPersona,
                  includeUserPersona: includeUserPersona,
                  includeRecentContext: includeRecentContext,
                  pageLanguage: apk119Value190
                })
              }]
            })
          });
          if (!apk119Value192.ok) throw window.u2Api?.["createHttpError"]?.(apk119Value192, await window.u2Api?.["readApiError"]?.(apk119Value192)) || Object.assign(new Error("HTTP " + apk119Value192.status), {
            status: apk119Value192.status
          });
          const apk119Value193 = await apk119Value192.json()["catch"](() => null);
          if (apk119Value178.signal.aborted) throw apk119Value178.signal.reason;
          if (!apk119Value193) throw Object.assign(new Error("接口返回内容格式不兼容"), {
            name: "ApiResponseError"
          });
          const apk119Value194 = apk119Value193.choices?.[0]?.["message"]?.["content"] || apk119Value193.choices?.[0]?.["text"] || "",
            apk119Value195 = apk119Value32(apk119Value194);
          if (!apk119Value195 || typeof apk119Value195 !== "object") throw new Error("INVALID_JSON");
          const apk119Value196 = apk119Value13(apk119Value195.siteName, 80),
            apk119Value197 = apk119Value13(apk119Value195.title, 180),
            apk119Value198 = apk119Value13(apk119Value195.summary, 800),
            apk119Value199 = apk119Value36(apk119Value195.webPage, {
              source: "ai",
              domain: apk119Value174,
              prompt: apk119Value175,
              siteName: apk119Value196
            });
          if (!apk119Value196 || !apk119Value197 || !apk119Value199.html || !apk119Value199.css || !apk119Value199.js) throw new Error("INVALID_PAGE_PACKAGE");
          const apk119Value200 = apk119Value41(apk119Value195.translation, {
            source: "ai",
            domain: apk119Value174,
            prompt: apk119Value175
          });
          if (apk119Value40(apk119Value190) && !apk119Value200) throw new Error("中文翻译不完整，请重试生成链接");
          return {
            siteName: apk119Value196,
            title: apk119Value197,
            summary: apk119Value198,
            bodyText: apk119Value15(apk119Value199.html, 20000),
            webPage: apk119Value199,
            language: apk119Value13(apk119Value190, 40),
            translation: apk119Value200
          };
        })();
      return await Promise.race([apk119Value191, apk119Value182]);
    } finally {
      clearTimeout(apk119Value180), signal?.["removeEventListener"]("abort", apk119Value179), apk119Value178.signal.removeEventListener("abort", apk119Value181);
    }
  }
  function apk119Value44(apk119Value201) {
    if (!apk119Value201 || typeof apk119Value201.url !== "string" || typeof apk119Value201.prompt !== "string" || !apk119Value201.prompt.trim()) return null;
    const apk119Value202 = apk119Value29(apk119Value201.url);
    if (!apk119Value202) return null;
    return {
      kind: "fake_link",
      url: apk119Value202.displayUrl,
      prompt: apk119Value13(apk119Value201.prompt, 1000),
      speaker: apk119Value13(apk119Value201.speaker, 120),
      speakerMemberId: apk119Value13(apk119Value201.speakerMemberId, 180),
      thought: apk119Value13(apk119Value201.thought, 1000)
    };
  }
  async function apk119Value45(apk119Value203, apk119Value204 = {}) {
    const apk119Value205 = apk119Value204.friendId ?? window.imData?.["currentActiveFriend"]?.["id"],
      apk119Value206 = apk119Value12(apk119Value205),
      apk119Value207 = apk119Value204.role === "assistant" ? "assistant" : "user";
    if (!apk119Value206 || apk119Value206.type === "group" && Number(apk119Value206.leftGroupAt) > 0) return false;
    if (apk119Value207 === "assistant" && !["char", "group"].includes(apk119Value206.type)) return false;
    if (apk119Value204.isCurrent && !apk119Value204.isCurrent()) return false;
    const apk119Value208 = apk119Value29(apk119Value203?.["displayUrl"] || apk119Value203?.["canonicalUrl"] || apk119Value203?.["domain"]);
    if (!apk119Value208) throw new Error("链接地址无效");
    const apk119Value209 = apk119Value36(apk119Value203.webPage, {
      source: "ai",
      domain: apk119Value208.displayUrl,
      prompt: apk119Value203.prompt,
      siteName: apk119Value203.siteName
    });
    if (!apk119Value209.html || !apk119Value209.css || !apk119Value209.js || !apk119Value13(apk119Value203.siteName) || !apk119Value13(apk119Value203.title)) throw new Error("网页内容不完整，请重试");
    const apk119Value210 = apk119Value204.messageId || apk119Value2.createMessageId("fake-link");
    if (apk119Value10.has(apk119Value210)) return apk119Value10.get(apk119Value210);
    if ((apk119Value206.messages || []).some(apk119Value212 => String(apk119Value212.id) === apk119Value210)) return true;
    const apk119Value211 = (async () => {
      const apk119Value213 = Date.now(),
        apk119Value214 = {
          ...apk119Value208,
          siteName: apk119Value13(apk119Value203.siteName, 80),
          title: apk119Value13(apk119Value203.title, 180),
          summary: apk119Value13(apk119Value203.summary, 800),
          bodyText: apk119Value15(apk119Value209.html, 20000),
          prompt: apk119Value13(apk119Value203.prompt, 1000),
          includeCharPersona: !!apk119Value203.includeCharPersona,
          includeUserPersona: !!apk119Value203.includeUserPersona,
          includeRecentContext: !!apk119Value203.includeRecentContext,
          recentContextLimit: apk119Value20(apk119Value203.recentContextLimit),
          generatedBy: "ai",
          webPage: apk119Value209,
          language: apk119Value13(apk119Value203.language, 40),
          translation: apk119Value41(apk119Value203.translation, {
            source: "ai",
            domain: apk119Value208.displayUrl
          }),
          createdAt: apk119Value213
        },
        apk119Value215 = {
          id: apk119Value210,
          role: apk119Value207,
          type: "fake_link",
          content: apk119Value214.displayUrl,
          text: "[链接] " + apk119Value214.siteName + "：" + apk119Value214.title,
          fakeLinkData: apk119Value214,
          timestamp: apk119Value213,
          apiRunId: apk119Value204.apiRunId || "",
          speaker: apk119Value204.speaker || "",
          speakerMemberId: apk119Value204.speakerMemberId ?? "",
          senderAvatarUrl: apk119Value204.senderAvatarUrl || "",
          senderAvatarAssetId: apk119Value204.senderAvatarAssetId || "",
          thought: apk119Value204.thought || "",
          cotSummary: apk119Value204.getCotSummary ? apk119Value204.getCotSummary() : apk119Value204.cotSummary || ""
        };
      if (apk119Value207 === "user") window.imApp.captureGroupUserIdentity?.(apk119Value206, apk119Value215);
      const apk119Value216 = apk119Value206.type === "char" && (apk119Value207 === "user" ? apk119Value206.blockState?.["charBlocksUser"] : apk119Value206.blockState?.["userBlocksChar"]);
      if (apk119Value216) Object.assign(apk119Value215, {
        deliveryStatus: "blocked",
        excludedFromContext: true,
        blockedDirection: apk119Value207 === "user" ? "char_blocks_user" : "user_blocks_char"
      });
      if (apk119Value204.isCurrent && !apk119Value204.isCurrent()) return false;
      const apk119Value217 = await window.imApp.appendFriendMessage(apk119Value206.id, apk119Value215, {
        silent: true
      });
      if (!apk119Value217) throw new Error("链接消息保存失败");
      if (apk119Value204.isCurrent && !apk119Value204.isCurrent()) return await window.imApp.removeFriendMessages?.(apk119Value206.id, {
        id: apk119Value215.id
      }, {
        silent: true,
        preserveConversationRuntime: true
      }), false;
      apk119Value204.onCommitted?.(apk119Value215);
      try {
        const apk119Value218 = apk119Value12(apk119Value206.id) || apk119Value206,
          apk119Value219 = document.getElementById("chat-interface-" + apk119Value206.id)?.["querySelector"](".ins-chat-messages");
        if (apk119Value219) {
          const apk119Value220 = apk119Value2.appendMessageToContainer?.(apk119Value218, apk119Value219, apk119Value215, {
            scroll: true
          });
          if (!apk119Value220) apk119Value2.rerenderChatContainer?.(apk119Value218, apk119Value219, {
            scroll: true
          });
        }
        if (apk119Value207 === "user") apk119Value2.maybeAutoReplyAfterUserMessage?.(apk119Value218, apk119Value219, apk119Value215);else {
          if (!apk119Value216 && !window.imApp?.["isChatConversationOpen"]?.()) window.showBannerNotification?.(apk119Value218, apk119Value215.text);
        }
      } catch (apk119Value221) {
        console.warn("[iMessage link] Saved card could not be displayed", apk119Value221);
      }
      return true;
    })();
    apk119Value10.set(apk119Value210, apk119Value211);
    try {
      return await apk119Value211;
    } finally {
      apk119Value10["delete"](apk119Value210);
    }
  }
  function apk119Value46(apk119Value222) {
    apk119Value222.controller.abort(), apk119Value222.options.signal?.["removeEventListener"]("abort", apk119Value222.abortFromParent), apk119Value222.row?.["remove"]();
    if (apk119Value9.get(apk119Value222.key) === apk119Value222) apk119Value9["delete"](apk119Value222.key);
  }
  function apk119Value47(apk119Value223) {
    const apk119Value224 = String(apk119Value223?.["id"] ?? apk119Value223 ?? "");
    for (const apk119Value225 of apk119Value9.values()) {
      if (apk119Value225.friendId === apk119Value224) apk119Value46(apk119Value225);
    }
  }
  function apk119Value48(apk119Value226, apk119Value227 = null) {
    if (!apk119Value226.isCurrent()) {
      apk119Value46(apk119Value226);
      return;
    }
    apk119Value227 = apk119Value227 || document.getElementById("chat-interface-" + apk119Value226.friendId)?.["querySelector"](".ins-chat-messages");
    if (!apk119Value227 || !["generating", "failed"].includes(apk119Value226.status)) return;
    if (apk119Value226.row?.["parentNode"] !== apk119Value227) {
      apk119Value226.row?.["remove"](), apk119Value226.row = document.createElement("div"), apk119Value226.row.className = "im-char-link-status-row", apk119Value226.row.setAttribute("role", "status"), apk119Value226.row.setAttribute("aria-live", "polite");
      const apk119Value229 = document.createElement("span"),
        apk119Value230 = document.createElement("button");
      apk119Value230.type = "button", apk119Value230.textContent = "重试生成链接", apk119Value230.addEventListener("click", () => void apk119Value50(apk119Value226)), apk119Value226.row.append(apk119Value229, apk119Value230), apk119Value227.appendChild(apk119Value226.row);
    }
    apk119Value226.row.querySelector("span").textContent = apk119Value226.status === "generating" ? (apk119Value226.options.speaker || "对方") + "正在搜索链接…" : "链接生成失败";
    const apk119Value228 = apk119Value226.row.querySelector("button");
    apk119Value228.hidden = apk119Value226.status !== "failed", apk119Value228.disabled = apk119Value226.status === "generating";
    if (apk119Value226.status === "failed") apk119Value226.row.title = apk119Value226.errorMessage || "可以重试本次网页生成";
    apk119Value2.scrollToBottom?.(apk119Value227);
  }
  function apk119Value49(apk119Value231, apk119Value232) {
    for (const apk119Value233 of apk119Value9.values()) {
      if (String(apk119Value231.id) === apk119Value233.friendId) apk119Value48(apk119Value233, apk119Value232);
    }
  }
  async function apk119Value50(apk119Value234) {
    if (apk119Value234.promise) return apk119Value234.promise;
    if (!apk119Value234.isCurrent()) return apk119Value46(apk119Value234), {
      status: "cancelled"
    };
    return apk119Value234.status = "generating", apk119Value48(apk119Value234), apk119Value234.promise = (async () => {
      try {
        const apk119Value235 = apk119Value12(apk119Value234.friendId),
          apk119Value236 = apk119Value234.generated || (await apk119Value2.generateFakeLinkPage({
            domain: apk119Value234.item.url,
            prompt: apk119Value234.item.prompt,
            friend: apk119Value235,
            speakerFriend: apk119Value234.options.speakerFriend || apk119Value235,
            signal: apk119Value234.controller.signal,
            apiConfig: apk119Value234.options.apiConfig,
            includeCharPersona: true,
            includeUserPersona: true,
            includeRecentContext: true
          }));
        if (!apk119Value234.isCurrent()) return {
          status: "cancelled"
        };
        apk119Value234.generated = apk119Value236;
        const apk119Value237 = await apk119Value2.sendFakeLinkMessage({
          ...apk119Value236,
          displayUrl: apk119Value234.item.url,
          prompt: apk119Value234.item.prompt,
          includeCharPersona: true,
          includeUserPersona: true,
          includeRecentContext: true
        }, {
          ...apk119Value234.options,
          friendId: apk119Value234.friendId,
          role: "assistant",
          messageId: apk119Value234.messageId,
          isCurrent: apk119Value234.isCurrent
        });
        if (!apk119Value237) {
          if (!apk119Value234.isCurrent()) return {
            status: "cancelled"
          };
          throw new Error("链接发送失败，请重试");
        }
        return apk119Value234.status = "sent", apk119Value46(apk119Value234), {
          status: "sent"
        };
      } catch (apk119Value238) {
        if (!apk119Value234.isCurrent()) return {
          status: "cancelled"
        };
        return apk119Value234.status = "failed", apk119Value234.errorMessage = apk119Value238?.["message"] === "API_NOT_CONFIGURED" ? "请先完成 API 配置" : apk119Value238?.["message"] || "网页生成失败", apk119Value48(apk119Value234), window.showToast?.("链接生成失败，可点击重试"), {
          status: "failed"
        };
      } finally {
        apk119Value234.promise = null;
        if (!apk119Value234.isCurrent()) apk119Value46(apk119Value234);
      }
    })(), apk119Value234.promise;
  }
  async function apk119Value51(apk119Value239, apk119Value240 = {}) {
    const apk119Value241 = apk119Value44({
      type: "fake_link",
      ...apk119Value239
    });
    if (!apk119Value241) return {
      status: "invalid"
    };
    const apk119Value242 = String(apk119Value240.friendId ?? ""),
      apk119Value243 = apk119Value12(apk119Value242);
    if (!apk119Value243 || !["char", "group"].includes(apk119Value243.type) || apk119Value243.type === "group" && Number(apk119Value243.leftGroupAt) > 0) return {
      status: "cancelled"
    };
    const apk119Value244 = JSON.stringify([apk119Value242, String(apk119Value240.apiRunId || "")]),
      apk119Value245 = apk119Value9.get(apk119Value244);
    if (apk119Value245) return apk119Value245.promise || {
      status: apk119Value245.status
    };
    const apk119Value246 = "char-link-" + apk119Value242 + "-" + (apk119Value240.apiRunId || apk119Value2.createMessageId("run"));
    if ((apk119Value243.messages || []).some(apk119Value248 => apk119Value248.id === apk119Value246)) return {
      status: "sent"
    };
    const apk119Value247 = {
      key: apk119Value244,
      friendId: apk119Value242,
      messageId: apk119Value246,
      item: apk119Value241,
      options: apk119Value240,
      controller: new AbortController(),
      status: "generating",
      row: null,
      promise: null,
      generated: null
    };
    return apk119Value247.isCurrent = () => {
      const apk119Value249 = apk119Value12(apk119Value242);
      return !apk119Value247.controller.signal.aborted && !apk119Value240.signal?.["aborted"] && !!apk119Value249 && !(apk119Value249.type === "group" && Number(apk119Value249.leftGroupAt) > 0) && (!apk119Value240.isCurrent || apk119Value240.isCurrent());
    }, apk119Value247.abortFromParent = () => apk119Value46(apk119Value247), apk119Value240.signal?.["addEventListener"]("abort", apk119Value247.abortFromParent, {
      once: true
    }), apk119Value9.set(apk119Value244, apk119Value247), apk119Value50(apk119Value247);
  }
  function apk119Value52(apk119Value250) {
    const apk119Value251 = apk119Value21();
    return {
      friendId: String(apk119Value250),
      domainInput: "",
      promptInput: "",
      ...apk119Value251,
      status: "idle",
      generatedData: null,
      errorMessage: "",
      promise: null,
      sending: false
    };
  }
  function apk119Value53(apk119Value252) {
    const apk119Value253 = String(apk119Value252 || "");
    if (!apk119Value8.has(apk119Value253)) apk119Value8.set(apk119Value253, apk119Value52(apk119Value253));
    return apk119Value8.get(apk119Value253);
  }
  function apk119Value54(apk119Value254, apk119Value255) {
    const apk119Value256 = document.createElement("iframe");
    return apk119Value256.className = apk119Value255, apk119Value256.setAttribute("sandbox", "allow-scripts"), apk119Value256.setAttribute("referrerpolicy", "no-referrer"), apk119Value256.setAttribute("title", "AI 生成的链接小剧场预览"), apk119Value39(apk119Value256, apk119Value254), apk119Value256;
  }
  function apk119Value55(apk119Value257) {
    const apk119Value258 = apk119Value23();
    let apk119Value259 = document.getElementById("im-fake-link-composer-overlay");
    if (apk119Value259) {
      if (apk119Value259.parentNode !== apk119Value258) apk119Value258.appendChild(apk119Value259);
      return apk119Value259._imFakeLinkPage = apk119Value257, apk119Value259;
    }
    apk119Value259 = document.createElement("div"), apk119Value259.id = "im-fake-link-composer-overlay", apk119Value259.className = "im-fake-link-composer-overlay", apk119Value259.innerHTML = ["<div class=\"im-fake-link-composer-backdrop\"></div>", "<section class=\"im-fake-link-composer-card\" role=\"dialog\" aria-modal=\"true\" aria-label=\"发送链接\">", "  <header class=\"im-fake-link-composer-header\">", "    <button type=\"button\" class=\"im-fake-link-composer-close\" aria-label=\"关闭\"><i class=\"fas fa-times\"></i></button>", "    <strong>链接小剧场</strong>", "    <span></span>", "  </header>", "  <div class=\"im-fake-link-composer-body\">", "    <label class=\"im-fake-link-field\"><span>域名 / 地址</span><input class=\"im-fake-link-ai-domain-input\" type=\"text\" inputmode=\"url\" autocomplete=\"off\" placeholder=\"example.com/story\"></label>", "    <label class=\"im-fake-link-field\"><span>生成提示</span><textarea class=\"im-fake-link-ai-prompt-input\" rows=\"4\" placeholder=\"例如：生成一个和当前聊天剧情有关的互动网页，包含角色会看到的内容和自然的小互动\"></textarea></label>", "    <div class=\"im-fake-link-context-options\">", "      <label class=\"im-fake-link-context-toggle\"><input class=\"im-fake-link-char-persona-toggle\" type=\"checkbox\"><span>挂载 Char 人设</span></label>", "      <label class=\"im-fake-link-context-toggle\"><input class=\"im-fake-link-user-persona-toggle\" type=\"checkbox\"><span>挂载 User 人设</span></label>", "      <div class=\"im-fake-link-context-row\">", "        <label class=\"im-fake-link-context-toggle\"><input class=\"im-fake-link-recent-context-toggle\" type=\"checkbox\"><span>挂载最近聊天上下文</span></label>", "        <label class=\"im-fake-link-context-limit\"><input class=\"im-fake-link-context-limit-input\" type=\"number\" min=\"1\" max=\"50\" value=\"10\" inputmode=\"numeric\"><span>条</span></label>", "      </div>", "    </div>", "    <div class=\"im-fake-link-generation-row\">", "      <button type=\"button\" class=\"im-fake-link-generate-btn\" aria-label=\"调用 API 生成网页\" title=\"调用 API 生成网页\"><i class=\"fas fa-search\"></i></button>", "      <span class=\"im-fake-link-status\">填写地址和提示后生成链接小剧场</span>", "    </div>", "    <div class=\"im-fake-link-web-mini-preview\" hidden>", "      <div class=\"im-fake-link-web-mini-label\">生成结果</div>", "      <div class=\"im-fake-link-web-mini-frame\"></div>", "    </div>", "  </div>", "  <footer class=\"im-fake-link-composer-actions\">", "    <button type=\"button\" class=\"im-fake-link-composer-cancel\">取消</button>", "    <button type=\"button\" class=\"im-fake-link-composer-send\">发送</button>", "  </footer>", "</section>"].join(""), apk119Value258.appendChild(apk119Value259), apk119Value259._imFakeLinkPage = apk119Value257;
    const apk119Value260 = apk119Value259.querySelector(".im-fake-link-ai-domain-input"),
      apk119Value261 = apk119Value259.querySelector(".im-fake-link-ai-prompt-input"),
      apk119Value262 = apk119Value259.querySelector(".im-fake-link-char-persona-toggle"),
      apk119Value263 = apk119Value259.querySelector(".im-fake-link-user-persona-toggle"),
      apk119Value264 = apk119Value259.querySelector(".im-fake-link-recent-context-toggle"),
      apk119Value265 = apk119Value259.querySelector(".im-fake-link-context-limit-input"),
      apk119Value266 = apk119Value259.querySelector(".im-fake-link-generate-btn"),
      apk119Value267 = apk119Value259.querySelector(".im-fake-link-status"),
      apk119Value268 = apk119Value259.querySelector(".im-fake-link-web-mini-preview"),
      apk119Value269 = apk119Value259.querySelector(".im-fake-link-web-mini-frame"),
      apk119Value270 = apk119Value259.querySelector(".im-fake-link-composer-close"),
      apk119Value271 = apk119Value259.querySelector(".im-fake-link-composer-cancel"),
      apk119Value272 = apk119Value259.querySelector(".im-fake-link-composer-send"),
      apk119Value273 = apk119Value259.querySelector(".im-fake-link-composer-backdrop"),
      apk119Value274 = [apk119Value260, apk119Value261, apk119Value262, apk119Value263, apk119Value264, apk119Value265];
    function apk119Value275() {
      return apk119Value53(apk119Value259._imFakeLinkFriendId);
    }
    function apk119Value276(apk119Value284) {
      const apk119Value285 = apk119Value266.querySelector("i");
      if (apk119Value285) apk119Value285.className = apk119Value284 ? "fas fa-spinner fa-spin" : "fas fa-search";
      apk119Value266.setAttribute("aria-busy", String(!!apk119Value284));
    }
    function apk119Value277(apk119Value286, apk119Value287 = "idle") {
      apk119Value267.textContent = apk119Value286 || "", apk119Value267.dataset.status = apk119Value287;
    }
    function apk119Value278({
      invalidate = true
    } = {}) {
      const apk119Value288 = apk119Value275();
      if (apk119Value288.status === "generating") return apk119Value288;
      return apk119Value288.domainInput = apk119Value260.value, apk119Value288.promptInput = apk119Value261.value, apk119Value288.includeCharPersona = !!apk119Value262.checked, apk119Value288.includeUserPersona = !!apk119Value263.checked, apk119Value288.includeRecentContext = !!apk119Value264.checked, apk119Value288.recentContextLimit = apk119Value20(apk119Value265.value), apk119Value265.value = String(apk119Value288.recentContextLimit), apk119Value22(apk119Value288), invalidate && apk119Value288.generatedData && (apk119Value288.generatedData = null, apk119Value288.status = "idle", apk119Value288.errorMessage = ""), apk119Value288;
    }
    function apk119Value279() {
      const apk119Value289 = apk119Value275(),
        apk119Value290 = apk119Value289.status === "generating";
      apk119Value274.forEach(apk119Value291 => {
        apk119Value291.disabled = apk119Value290;
      }), apk119Value265.disabled = apk119Value290 || !apk119Value264.checked, apk119Value266.disabled = apk119Value290, apk119Value272.disabled = apk119Value290 || apk119Value289.status !== "ready" || !apk119Value289.generatedData, apk119Value276(apk119Value290), apk119Value268.hidden = apk119Value289.status !== "ready" || !apk119Value289.generatedData?.["webPage"], apk119Value269.innerHTML = "";
      !apk119Value268.hidden && apk119Value269.appendChild(apk119Value54(apk119Value289.generatedData.webPage, "im-fake-link-preview-iframe"));
      if (apk119Value289.status === "generating") apk119Value277("AI 正在生成链接小剧场，退出此界面也会继续…", "loading");else {
        if (apk119Value289.status === "ready") apk119Value277("生成完成，可以预览或发送", "ready");else apk119Value289.status === "error" ? apk119Value277(apk119Value289.errorMessage || "生成失败，请重试", "error") : apk119Value277("填写地址和提示后生成链接小剧场", "idle");
      }
    }
    function apk119Value280(apk119Value292) {
      apk119Value260.value = apk119Value292.domainInput || "", apk119Value261.value = apk119Value292.promptInput || "", apk119Value262.checked = !!apk119Value292.includeCharPersona, apk119Value263.checked = !!apk119Value292.includeUserPersona, apk119Value264.checked = !!apk119Value292.includeRecentContext, apk119Value265.value = String(apk119Value20(apk119Value292.recentContextLimit)), apk119Value279();
    }
    function apk119Value281() {
      const apk119Value293 = document.activeElement;
      apk119Value293 && apk119Value259.contains(apk119Value293) && typeof apk119Value293.blur === "function" && apk119Value293.blur(), apk119Value259.classList.remove("active"), setTimeout(() => {
        if (!apk119Value259.classList.contains("active")) apk119Value259.style.display = "none";
      }, 220);
    }
    async function apk119Value282() {
      const apk119Value294 = apk119Value278({
          invalidate: true
        }),
        apk119Value295 = apk119Value29(apk119Value294.domainInput);
      if (!apk119Value295) {
        apk119Value294.status = "error", apk119Value294.errorMessage = "请先输入有效域名或 http/https 地址", apk119Value279(), apk119Value24(apk119Value260);
        return;
      }
      if (apk119Value294.status === "generating") return;
      const apk119Value296 = String(apk119Value259._imFakeLinkFriendId || ""),
        apk119Value297 = (window.imData?.["friends"] || []).find(apk119Value299 => String(apk119Value299.id) === apk119Value296) || window.imData?.["currentActiveFriend"] || null;
      apk119Value294.domainInput = apk119Value295.displayUrl, apk119Value260.value = apk119Value295.displayUrl, apk119Value294.status = "generating", apk119Value294.generatedData = null, apk119Value294.errorMessage = "";
      const apk119Value298 = apk119Value2.generateFakeLinkPage({
        domain: apk119Value295.displayUrl,
        prompt: apk119Value13(apk119Value294.promptInput, 1000),
        friend: apk119Value297,
        includeCharPersona: apk119Value294.includeCharPersona,
        includeUserPersona: apk119Value294.includeUserPersona,
        includeRecentContext: apk119Value294.includeRecentContext,
        recentContextLimit: apk119Value294.recentContextLimit
      });
      apk119Value294.promise = apk119Value298, apk119Value279();
      try {
        const apk119Value300 = await apk119Value298;
        if (apk119Value294.promise !== apk119Value298) return;
        apk119Value294.generatedData = {
          ...apk119Value300,
          siteName: apk119Value300.siteName || apk119Value295.domain,
          title: apk119Value300.title || apk119Value295.domain,
          webPage: apk119Value36(apk119Value300.webPage, {
            source: "ai",
            domain: apk119Value295.displayUrl,
            prompt: apk119Value294.promptInput,
            siteName: apk119Value300.siteName || apk119Value295.domain
          })
        }, apk119Value294.status = "ready", apk119Value294.errorMessage = "";
        const apk119Value301 = apk119Value259.classList.contains("active") && String(apk119Value259._imFakeLinkFriendId) === apk119Value296;
        if (!apk119Value301 && window.showToast) window.showToast("链接小剧场已生成");
      } catch (apk119Value302) {
        if (apk119Value294.promise !== apk119Value298) return;
        console.warn("[iMessage fake link] AI generation failed", apk119Value302), apk119Value294.status = "error", apk119Value294.errorMessage = apk119Value302?.["message"] === "API_NOT_CONFIGURED" ? "未配置 API，请到设置中填写后再生成" : apk119Value302?.["message"] === "INVALID_PAGE_PACKAGE" ? "AI 返回的网页代码不完整，请重试" : "AI 生成失败，请重试";
        if (!window.u2Api?.["isRequestError"]?.(apk119Value302) || !window.u2Api.reportError(apk119Value302, {
          operation: "链接小剧场生成"
        })) {
          if (window.showToast) window.showToast(apk119Value294.errorMessage);
        }
      } finally {
        if (apk119Value294.promise === apk119Value298) apk119Value294.promise = null;
        if (String(apk119Value259._imFakeLinkFriendId) === apk119Value296) apk119Value279();
      }
    }
    async function apk119Value283() {
      const apk119Value303 = apk119Value275();
      if (apk119Value303.sending || apk119Value303.status !== "ready" || !apk119Value303.generatedData) return;
      const apk119Value304 = apk119Value29(apk119Value303.domainInput);
      if (!apk119Value304) {
        apk119Value303.status = "error", apk119Value303.errorMessage = "请先输入有效域名", apk119Value279();
        return;
      }
      const apk119Value305 = String(apk119Value259._imFakeLinkFriendId || ""),
        apk119Value306 = apk119Value12(apk119Value305);
      if (!apk119Value306 || apk119Value306.type === "group" && Number(apk119Value306.leftGroupAt) > 0) {
        window.showToast?.("当前聊天无法发送链接");
        return;
      }
      apk119Value303.sending = true, apk119Value272.disabled = true, apk119Value272.textContent = "发送中…";
      try {
        const apk119Value307 = await apk119Value2.sendFakeLinkMessage({
          ...apk119Value303.generatedData,
          displayUrl: apk119Value304.displayUrl,
          prompt: apk119Value13(apk119Value303.promptInput, 1000),
          includeCharPersona: apk119Value303.includeCharPersona,
          includeUserPersona: apk119Value303.includeUserPersona,
          includeRecentContext: apk119Value303.includeRecentContext,
          recentContextLimit: apk119Value303.recentContextLimit
        }, {
          friendId: apk119Value305,
          role: "user"
        });
        if (!apk119Value307) throw new Error("链接消息保存失败");
        apk119Value8["delete"](apk119Value305), apk119Value281();
      } catch (apk119Value308) {
        window.showToast?.(apk119Value308?.["message"] || "链接消息保存失败");
      } finally {
        apk119Value303.sending = false, apk119Value272.textContent = "发送";
        if (apk119Value259.classList.contains("active")) apk119Value279();
      }
    }
    return apk119Value274.forEach(apk119Value309 => {
      apk119Value309.addEventListener("input", () => {
        apk119Value278({
          invalidate: true
        }), apk119Value279();
      }), apk119Value309.addEventListener("change", () => {
        apk119Value278({
          invalidate: true
        }), apk119Value279();
      });
    }), apk119Value266.addEventListener("click", () => void apk119Value282()), apk119Value272.addEventListener("click", () => void apk119Value283()), apk119Value270.addEventListener("click", apk119Value281), apk119Value271.addEventListener("click", apk119Value281), apk119Value273.addEventListener("click", apk119Value281), apk119Value259._renderFakeLinkComposerState = apk119Value279, apk119Value259._openFakeLinkComposer = (apk119Value310, apk119Value311) => {
      apk119Value259._imFakeLinkFriendId = String(apk119Value310.id), apk119Value259._imFakeLinkPage = apk119Value311 || apk119Value257, apk119Value280(apk119Value53(apk119Value310.id)), apk119Value272.textContent = "发送", apk119Value259.style.display = "flex", void apk119Value259.offsetWidth, apk119Value259.classList.add("active");
    }, apk119Value259;
  }
  function apk119Value56() {
    const apk119Value312 = window.imData.currentActiveFriend;
    if (!apk119Value312) return;
    const apk119Value313 = document.getElementById("chat-interface-" + apk119Value312.id);
    if (!apk119Value313) return;
    const apk119Value314 = apk119Value55(apk119Value313);
    apk119Value314._openFakeLinkComposer(apk119Value312, apk119Value313);
  }
  apk119Value2.normalizeFakeLinkOutputItem = apk119Value44, apk119Value2.setFakeLinkFrameDocument = apk119Value39, apk119Value2.normalizeFakeLinkTranslation = apk119Value41, apk119Value2.generateFakeLinkPage = apk119Value43, apk119Value2.sendFakeLinkMessage = apk119Value45, apk119Value2.generateAndSendCharFakeLink = apk119Value51, apk119Value2.cancelCharFakeLinks = apk119Value47, apk119Value2.restoreCharFakeLinkStatuses = apk119Value49, apk119Value2.normalizeFakeLinkInput = apk119Value29, apk119Value2.normalizeFakeLinkDomain = apk119Value30, apk119Value2.buildFakeLinkPrompt = apk119Value42, apk119Value2.resolveFakeLinkRecentChatContext = apk119Value28, apk119Value2.buildRandomFakeLinkImageUrl = apk119Value17, apk119Value2.isAllowedFakeLinkImageUrl = apk119Value18, apk119Value2.injectRandomFakeLinkImages = apk119Value19, apk119Value2.normalizeFakeLinkWebPage = apk119Value36, apk119Value2.sanitizeFakeLinkHtmlForStorage = apk119Value33, apk119Value2.sanitizeFakeLinkCssForStorage = apk119Value34, apk119Value2.sanitizeFakeLinkJsForStorage = apk119Value35, apk119Value2.buildFakeLinkSandboxDocument = apk119Value38, apk119Value2.openFakeLinkComposer = apk119Value56;
});