(function initFileMessages(apk119Value1) {
  'use strict';

  const apk119Value2 = apk119Value1.imChat = apk119Value1.imChat || {},
    apk119Value3 = 20971520,
    apk119Value4 = 100000,
    apk119Value5 = 12000,
    apk119Value6 = new Map(),
    apk119Value7 = new Set(),
    apk119Value8 = apk119Value28 => String(apk119Value28 ?? "").replace(/[&<>"']/g, apk119Value29 => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    })[apk119Value29]),
    apk119Value9 = apk119Value30 => String(apk119Value30 || "未命名.txt").replace(/[\u0000-\u001f/\\]/g, "_").slice(0, 240),
    apk119Value10 = apk119Value31 => apk119Value1.imApp?.["getFriendById"]?.(apk119Value31) || (apk119Value1.imData?.["friends"] || []).find(apk119Value32 => String(apk119Value32.id) === String(apk119Value31)),
    apk119Value11 = apk119Value33 => new URL("js/vendor/file-preview/" + apk119Value33, document.baseURI).href;
  function apk119Value12(apk119Value34 = {}) {
    const apk119Value35 = typeof apk119Value34.text === "string" ? apk119Value34.text.replace(/\u0000/g, "").slice(0, apk119Value4) : "";
    return {
      name: apk119Value9(apk119Value34.name),
      size: Math.max(0, Number(apk119Value34.size) || 0),
      mimeType: String(apk119Value34.mimeType || "application/octet-stream").slice(0, 180),
      source: ["upload", "composed", "char"].includes(apk119Value34.source) ? apk119Value34.source : "char",
      format: apk119Value34.format === "markdown" ? "markdown" : "text",
      text: apk119Value35,
      translation: typeof apk119Value34.translation === "string" ? apk119Value34.translation.replace(/\u0000/g, "").slice(0, apk119Value4) : "",
      assetId: typeof apk119Value34.assetId === "string" ? apk119Value34.assetId.slice(0, 500) : "",
      parseStatus: ["ready", "empty", "unsupported", "failed"].includes(apk119Value34.parseStatus) ? apk119Value34.parseStatus : apk119Value35 ? "ready" : "empty",
      truncated: apk119Value34.truncated === true || typeof apk119Value34.text === "string" && apk119Value34.text.length > apk119Value4
    };
  }
  function apk119Value13(apk119Value36, apk119Value37 = {}) {
    if (!apk119Value36 || typeof apk119Value36.fileName !== "string" || !apk119Value36.fileName.trim() || typeof apk119Value36.content !== "string" || !apk119Value36.content.trim() || apk119Value36.content.length > apk119Value4 || apk119Value37.requireTranslation && (typeof apk119Value36.translation !== "string" || !apk119Value36.translation.trim()) || typeof apk119Value36.translation === "string" && apk119Value36.translation.length > apk119Value4) return null;
    const apk119Value38 = apk119Value36.format === "markdown" ? "markdown" : "text",
      apk119Value39 = apk119Value12({
        name: apk119Value36.fileName,
        source: "char",
        format: apk119Value38,
        text: apk119Value36.content,
        translation: apk119Value36.translation,
        size: new Blob([apk119Value36.content]).size,
        mimeType: apk119Value38 === "markdown" ? "text/markdown;charset=utf-8" : "text/plain;charset=utf-8"
      });
    return {
      kind: "file",
      fileData: apk119Value39,
      text: apk119Value39.name,
      speaker: typeof apk119Value36.speaker === "string" ? apk119Value36.speaker.trim() : "",
      speakerMemberId: apk119Value36.speakerMemberId == null ? "" : String(apk119Value36.speakerMemberId),
      thought: typeof apk119Value36.thought === "string" ? apk119Value36.thought.trim() : ""
    };
  }
  function apk119Value14(apk119Value40, apk119Value41) {
    const apk119Value42 = apk119Value41?.["type"] === "group" ? apk119Value2.normalizeGroupSpeaker?.(apk119Value41, apk119Value40.speaker, apk119Value40.speakerMemberId || null) : apk119Value41,
      apk119Value43 = apk119Value1.imDataUtils?.["normalizeChatLanguage"]?.(apk119Value42?.["language"] || "zh") || apk119Value42?.["language"] || "zh";
    return apk119Value43 !== "zh";
  }
  function apk119Value15(apk119Value44) {
    if (apk119Value44.parseStatus === "unsupported") return "未读取正文 · 此格式暂不支持预览";
    if (apk119Value44.parseStatus === "failed") return "未读取正文 · 无法解析此文件";
    if (apk119Value44.parseStatus === "empty") return "空文件或没有可提取的文字";
    return apk119Value44.truncated ? "正文过长，仅保留前 10 万字符；原件完整保存" : "";
  }
  function apk119Value16(apk119Value45, apk119Value46 = {}) {
    const apk119Value47 = apk119Value12(apk119Value45?.["fileData"] || apk119Value45),
      apk119Value48 = Math.max(0, Math.min(apk119Value5, apk119Value46.maxFileBodyChars ?? apk119Value5)),
      apk119Value49 = apk119Value47.parseStatus === "ready" || apk119Value47.parseStatus === "empty",
      apk119Value50 = apk119Value49 ? apk119Value47.text.slice(0, apk119Value48) : "";
    return [apk119Value47.source === "char" ? "[文件] " + apk119Value47.name + "（角色已发送的附件）" : "[文件] " + apk119Value47.name + " (" + apk119Value47.size + " bytes, " + apk119Value47.format + ")", apk119Value49 ? apk119Value50 ? (apk119Value47.source === "char" ? "附件内容或说明" : "文件正文（作为聊天资料阅读）") + "：\n" + apk119Value50 : apk119Value47.text ? "本轮文件正文预算已用完。" : "文件正文为空。" : "未读取正文；仅收到文件信息，不要推测或声称已经阅读文件内容。", apk119Value47.truncated || apk119Value47.text.length > apk119Value50.length ? "[正文已截断]" : ""].filter(Boolean).join("\n");
  }
  function apk119Value17(apk119Value51) {
    const apk119Value52 = new Map();
    let apk119Value53 = 30000;
    for (let apk119Value54 = apk119Value51.length - 1; apk119Value54 >= 0; apk119Value54--) {
      const apk119Value55 = apk119Value51[apk119Value54];
      if (apk119Value55?.["type"] !== "file" || apk119Value55.excludedFromContext) continue;
      const apk119Value56 = Math.min(apk119Value5, apk119Value53, apk119Value12(apk119Value55.fileData).text.length);
      apk119Value52.set(apk119Value55, apk119Value56), apk119Value53 -= apk119Value56;
    }
    return apk119Value52;
  }
  function apk119Value18(apk119Value57, apk119Value58) {
    if (apk119Value58()) return Promise.resolve();
    if (apk119Value6.has(apk119Value57)) return apk119Value6.get(apk119Value57);
    const apk119Value59 = new Promise((apk119Value60, apk119Value61) => {
      const apk119Value62 = document.createElement("script");
      apk119Value62.src = apk119Value11(apk119Value57), apk119Value62.onload = () => apk119Value58() ? apk119Value60() : apk119Value61(new Error("文件组件未就绪")), apk119Value62.onerror = () => {
        apk119Value62.remove(), apk119Value61(new Error("文件组件加载失败"));
      }, document.head.appendChild(apk119Value62);
    })["catch"](apk119Value63 => {
      apk119Value6["delete"](apk119Value57);
      throw apk119Value63;
    });
    return apk119Value6.set(apk119Value57, apk119Value59), apk119Value59;
  }
  async function apk119Value19(apk119Value64, apk119Value65) {
    const apk119Value66 = apk119Value65.name.toLowerCase();
    if (/\.docx$/.test(apk119Value66)) return await apk119Value18("mammoth.js", () => !!apk119Value1.mammoth?.["extractRawText"]), (await apk119Value1.mammoth.extractRawText({
      arrayBuffer: await apk119Value64.arrayBuffer()
    })).value || "";
    if (/\.pdf$/.test(apk119Value66)) {
      let apk119Value71;
      if (apk119Value1.location?.["protocol"] === "file:") await apk119Value18("pdf.js", () => !!apk119Value1.U2FilePdf?.["getDocument"]), await apk119Value18("pdf.worker.js", () => !!apk119Value1.pdfjsWorker?.["WorkerMessageHandler"]), apk119Value71 = apk119Value1.U2FilePdf;else apk119Value71 = await import(apk119Value11("pdf.mjs"));
      apk119Value71.GlobalWorkerOptions.workerSrc = apk119Value11("pdf.worker.mjs");
      const apk119Value72 = apk119Value71.getDocument({
        data: new Uint8Array(await apk119Value64.arrayBuffer()),
        cMapUrl: apk119Value11("cmaps/"),
        cMapPacked: true,
        standardFontDataUrl: apk119Value11("standard_fonts/"),
        wasmUrl: apk119Value11("wasm/"),
        isEvalSupported: false
      });
      let apk119Value73;
      try {
        return await Promise.race([(async () => {
          const apk119Value74 = await apk119Value72.promise;
          let apk119Value75 = "";
          for (let apk119Value76 = 1; apk119Value76 <= apk119Value74.numPages && apk119Value75.length <= apk119Value4; apk119Value76++) {
            const apk119Value77 = await apk119Value74.getPage(apk119Value76),
              apk119Value78 = await apk119Value77.getTextContent();
            apk119Value75 += apk119Value78.items.map(apk119Value79 => (apk119Value79.str || "") + (apk119Value79.hasEOL ? "\n" : " ")).join("") + "\n\n", apk119Value77.cleanup();
          }
          return apk119Value75;
        })(), new Promise((apk119Value80, apk119Value81) => {
          apk119Value73 = setTimeout(() => apk119Value81(new Error("PDF 解析超时")), 20000);
        })]);
      } finally {
        clearTimeout(apk119Value73), await apk119Value72.destroy();
      }
    }
    const apk119Value67 = /^text\//i.test(apk119Value65.mimeType) || /\.(txt|text|md|markdown|json|csv|tsv|log|xml|html?|css|[cm]?js|ts|py|ya?ml|ini|conf|sql|sh)$/i.test(apk119Value66),
      apk119Value68 = new Uint8Array(await apk119Value64.slice(0, 8192).arrayBuffer());
    if (!apk119Value67 && (apk119Value68.includes(0) || apk119Value68.some(apk119Value82 => apk119Value82 < 9 || apk119Value82 > 13 && apk119Value82 < 32))) return null;
    let apk119Value69;
    try {
      new TextDecoder("utf-8", {
        fatal: true
      }).decode(apk119Value68, {
        stream: true
      }), apk119Value69 = new TextDecoder("utf-8");
    } catch (apk119Value83) {
      if (!apk119Value67) return null;
      apk119Value69 = new TextDecoder("gb18030");
    }
    const apk119Value70 = await apk119Value64.slice(0, 400004).arrayBuffer();
    return apk119Value69.decode(apk119Value70);
  }
  async function apk119Value20(apk119Value84) {
    if (!apk119Value84 || apk119Value84.size > apk119Value3) throw new Error("请选择不超过 20 MiB 的文件");
    const apk119Value85 = apk119Value12({
      name: apk119Value84.name,
      size: apk119Value84.size,
      mimeType: apk119Value84.type,
      source: "upload",
      format: /\.(md|markdown)$/i.test(apk119Value84.name) ? "markdown" : "text"
    });
    try {
      const apk119Value86 = await apk119Value19(apk119Value84, apk119Value85);
      apk119Value85.parseStatus = apk119Value86 === null ? "unsupported" : apk119Value86.trim() ? "ready" : /\.(pdf|docx)$/i.test(apk119Value85.name) && apk119Value84.size ? "failed" : "empty", apk119Value85.text = apk119Value86 === null ? "" : apk119Value86.slice(0, apk119Value4), apk119Value85.truncated = apk119Value86 !== null && apk119Value86.length > apk119Value4;
    } catch (apk119Value87) {
      console.warn("[iMessage] File text extraction failed:", apk119Value87), apk119Value85.parseStatus = "failed";
    }
    return apk119Value85;
  }
  async function apk119Value21(apk119Value88, apk119Value89 = {}) {
    if (apk119Value88?.["source"] !== "upload" && String(apk119Value88?.["text"] || "").length > apk119Value4) throw new Error("正文不能超过 10 万字符");
    const apk119Value90 = apk119Value89.friendId ?? apk119Value1.imData?.["currentActiveFriend"]?.["id"],
      apk119Value91 = apk119Value10(apk119Value90);
    if (!apk119Value91 || !["char", "group"].includes(apk119Value91.type)) throw new Error("未找到当前聊天对象");
    const apk119Value92 = apk119Value12(apk119Value88),
      apk119Value93 = apk119Value89.messageId || apk119Value2.createMessageId("file"),
      apk119Value94 = String(apk119Value89.operationId || apk119Value93);
    if (apk119Value7.has(apk119Value94)) return false;
    apk119Value7.add(apk119Value94);
    let apk119Value95 = "",
      apk119Value96 = false;
    try {
      if (apk119Value89.blob) {
        if (apk119Value89.blob.size > apk119Value3) throw new Error("文件不能超过 20 MiB");
        apk119Value95 = "im-file-" + apk119Value93;
        const apk119Value102 = await apk119Value1.appStorage.saveAssetFromBlob(apk119Value95, apk119Value89.blob, {
          ownerType: "im_file",
          ownerId: String(apk119Value91.id),
          fileName: apk119Value92.name
        });
        if (!apk119Value102) throw new Error("文件原件保存失败");
        apk119Value92.assetId = apk119Value102;
      }
      if (apk119Value92.source === "upload" && !apk119Value92.assetId) throw new Error("文件原件缺失，请重新选择");
      const apk119Value97 = apk119Value89.role === "assistant" ? "assistant" : "user",
        apk119Value98 = {
          id: apk119Value93,
          role: apk119Value97,
          type: "file",
          content: "[文件] " + apk119Value92.name,
          fileData: apk119Value92,
          timestamp: Date.now(),
          apiRunId: apk119Value89.apiRunId || "",
          cotSummary: apk119Value89.cotSummary || "",
          speaker: apk119Value89.speaker || "",
          speakerMemberId: apk119Value89.speakerMemberId || "",
          senderAvatarUrl: apk119Value89.senderAvatarUrl || "",
          thought: apk119Value89.thought || ""
        };
      if (apk119Value97 === "user") apk119Value1.imApp.captureGroupUserIdentity?.(apk119Value91, apk119Value98);
      const apk119Value99 = apk119Value91.type === "char" && (apk119Value97 === "user" ? apk119Value91.blockState?.["charBlocksUser"] : apk119Value91.blockState?.["userBlocksChar"]);
      if (apk119Value99 || apk119Value89.blocked) Object.assign(apk119Value98, {
        deliveryStatus: "blocked",
        excludedFromContext: true,
        blockedDirection: apk119Value97 === "user" ? "char_blocks_user" : "user_blocks_char"
      });
      apk119Value96 = !!(await apk119Value1.imApp.appendFriendMessage(apk119Value91.id, apk119Value98, {
        silent: true
      }));
      if (!apk119Value96) throw new Error("文件消息保存失败");
      const apk119Value100 = apk119Value10(apk119Value91.id) || apk119Value91,
        apk119Value101 = document.getElementById("chat-interface-" + apk119Value91.id)?.["querySelector"](".ins-chat-messages");
      try {
        if (apk119Value101) {
          const apk119Value103 = apk119Value2.appendMessageToContainer?.(apk119Value100, apk119Value101, apk119Value98, {
            scroll: true
          });
          if (!apk119Value103) apk119Value2.rerenderChatContainer?.(apk119Value100, apk119Value101, {
            scroll: true
          });
        }
        if (apk119Value97 === "user") apk119Value2.maybeAutoReplyAfterUserMessage?.(apk119Value100, apk119Value101, apk119Value98);else !apk119Value101 && !apk119Value99 && !apk119Value89.blocked && !apk119Value1.imApp?.["isChatConversationOpen"]?.() && apk119Value1.showBannerNotification?.(apk119Value100, apk119Value98.content);
      } catch (apk119Value104) {
        console.warn("[iMessage] Saved file message could not be presented:", apk119Value104);
      }
      return true;
    } finally {
      apk119Value7["delete"](apk119Value94);
      if (!apk119Value96 && apk119Value95) await apk119Value1.appStorage.deleteAsset(apk119Value95)["catch"](() => {});
    }
  }
  function apk119Value22(apk119Value105) {
    return apk119Value105 < 1024 ? apk119Value105 + " B" : apk119Value105 < 1048576 ? (apk119Value105 / 1024).toFixed(1) + " KB" : (apk119Value105 / 1048576).toFixed(1) + " MB";
  }
  function apk119Value23(apk119Value106) {
    const apk119Value107 = apk119Value12(apk119Value106.fileData),
      apk119Value108 = apk119Value107.name.includes(".") ? apk119Value107.name.split(".").pop().slice(0, 8).toUpperCase() : "FILE";
    return "<span class=\"im-file-icon\" aria-hidden=\"true\"><i class=\"far fa-file-lines\"></i><small>" + apk119Value8(apk119Value108) + "</small></span><span class=\"im-file-copy\"><strong>" + apk119Value8(apk119Value107.name) + "</strong><small>" + apk119Value8(apk119Value22(apk119Value107.size)) + " · 点击查看</small></span>";
  }
  function apk119Value24(apk119Value109) {
    const apk119Value110 = document.createElement("div");
    apk119Value110.className = "im-file-overlay", apk119Value110.innerHTML = "<section class=\"im-file-dialog\" role=\"dialog\" aria-modal=\"true\" aria-label=\"" + apk119Value8(apk119Value109) + "\"><header><strong>" + apk119Value8(apk119Value109) + "</strong><button type=\"button\" data-close aria-label=\"关闭\">×</button></header><div class=\"im-file-body\"></div><footer></footer></section>";
    const apk119Value111 = document.activeElement,
      apk119Value112 = () => {
        apk119Value110.remove(), document.removeEventListener("keydown", apk119Value113), apk119Value111?.["focus"]?.({
          preventScroll: true
        });
      },
      apk119Value113 = apk119Value114 => {
        if (apk119Value110 !== document.querySelector(".im-file-overlay:last-child")) return;
        apk119Value114.key === "Escape" && (apk119Value114.preventDefault(), apk119Value112());
        if (apk119Value114.key === "Tab") {
          const apk119Value115 = [...apk119Value110.querySelectorAll("button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href]")].filter(apk119Value118 => !apk119Value118.hidden && apk119Value118.type !== "file"),
            apk119Value116 = apk119Value115[0],
            apk119Value117 = apk119Value115[apk119Value115.length - 1];
          if (apk119Value114.shiftKey && document.activeElement === apk119Value116) apk119Value114.preventDefault(), apk119Value117?.["focus"]();else !apk119Value114.shiftKey && document.activeElement === apk119Value117 && (apk119Value114.preventDefault(), apk119Value116?.["focus"]());
        }
      };
    return apk119Value110.querySelector("[data-close]").addEventListener("click", apk119Value112), apk119Value110.addEventListener("click", apk119Value119 => {
      if (apk119Value119.target === apk119Value110) apk119Value112();
    }), document.addEventListener("keydown", apk119Value113), (document.getElementById("app") || document.body).appendChild(apk119Value110), apk119Value110.querySelector("[data-close]").focus({
      preventScroll: true
    }), {
      overlay: apk119Value110,
      close: apk119Value112,
      body: apk119Value110.querySelector(".im-file-body"),
      footer: apk119Value110.querySelector("footer")
    };
  }
  async function apk119Value25(apk119Value120) {
    try {
      await navigator.clipboard.writeText(apk119Value120), apk119Value1.showToast?.("已复制");
    } catch (apk119Value121) {
      apk119Value1.showToast?.("复制失败，请检查剪贴板权限");
    }
  }
  async function apk119Value26(apk119Value122) {
    const apk119Value123 = apk119Value12(apk119Value122.fileData),
      apk119Value124 = apk119Value24(apk119Value123.name);
    apk119Value124.overlay.classList.add("is-file-reader"), apk119Value124.body.innerHTML = "<div class=\"im-file-info\">" + apk119Value8(apk119Value22(apk119Value123.size)) + "</div><div class=\"im-file-status\" role=\"status\">" + apk119Value8(apk119Value15(apk119Value123)) + "</div><div class=\"im-file-document\"></div>";
    const apk119Value125 = apk119Value124.body.querySelector(".im-file-document");
    apk119Value125.classList.toggle("is-plain", apk119Value123.format !== "markdown"), apk119Value125.textContent = apk119Value123.text, apk119Value124.footer.innerHTML = "<button type=\"button\" data-copy title=\"复制正文\" aria-label=\"复制正文\"><i class=\"far fa-copy\" aria-hidden=\"true\"></i></button><button type=\"button\" data-translate title=\"查看翻译\" aria-label=\"查看翻译\" aria-pressed=\"false\"><i class=\"fas fa-language\" aria-hidden=\"true\"></i></button><button type=\"button\" data-download title=\"下载文件\" aria-label=\"下载文件\"><i class=\"fas fa-download\" aria-hidden=\"true\"></i></button>";
    let apk119Value126 = false;
    const apk119Value127 = apk119Value124.footer.querySelector("[data-copy]");
    apk119Value127.disabled = !apk119Value123.text, apk119Value127.addEventListener("click", () => apk119Value25(apk119Value126 ? apk119Value123.translation : apk119Value123.text));
    const apk119Value128 = apk119Value124.footer.querySelector("[data-translate]");
    apk119Value128.disabled = !apk119Value123.translation;
    if (!apk119Value123.translation) apk119Value128.title = "暂无翻译";
    apk119Value124.footer.querySelector("[data-download]").addEventListener("click", async apk119Value130 => {
      const apk119Value131 = apk119Value130.currentTarget;
      if (apk119Value131.disabled) return;
      apk119Value131.disabled = true;
      try {
        const apk119Value132 = apk119Value123.source === "upload" ? await apk119Value1.appStorage.getAssetBlob(apk119Value123.assetId) : new Blob([apk119Value123.text], {
          type: apk119Value123.mimeType
        });
        if (!apk119Value132) throw new Error("原始文件已丢失，无法下载");
        const apk119Value133 = await apk119Value1.u2ExportFile({
          blob: apk119Value132,
          fileName: apk119Value123.name,
          title: apk119Value123.name
        });
        if (apk119Value133 === false || apk119Value133 === "failed" || apk119Value133 === "unavailable") throw new Error("文件下载失败");
      } catch (apk119Value134) {
        apk119Value1.showToast?.(apk119Value134.message || "文件下载失败");
      } finally {
        apk119Value131.disabled = false;
      }
    });
    const apk119Value129 = async () => {
      const apk119Value135 = apk119Value126 ? apk119Value123.translation : apk119Value123.text;
      apk119Value125.textContent = apk119Value135, apk119Value125.classList.toggle("is-plain", apk119Value123.format !== "markdown"), apk119Value124.body.querySelector(".im-file-info").textContent = apk119Value22(apk119Value123.size) + " · " + (apk119Value126 ? "中文翻译" : "原文");
      if (apk119Value123.format !== "markdown" || !apk119Value135) return;
      try {
        await apk119Value18("markdown.js", () => !!apk119Value1.U2FileMarkdown);
        if (!apk119Value124.overlay.isConnected || apk119Value135 !== (apk119Value126 ? apk119Value123.translation : apk119Value123.text)) return;
        const apk119Value136 = new apk119Value1.U2FileMarkdown({
          html: false,
          linkify: false,
          breaks: true
        });
        apk119Value136.disable("image"), apk119Value125.innerHTML = apk119Value136.render(apk119Value135), apk119Value125.querySelectorAll("a").forEach(apk119Value137 => {
          apk119Value137.target = "_blank", apk119Value137.rel = "noopener noreferrer";
        });
      } catch (apk119Value138) {
        apk119Value125.classList.add("is-plain"), apk119Value124.body.querySelector(".im-file-status").textContent = "排版组件加载失败，已显示原文";
      }
    };
    apk119Value128.addEventListener("click", () => {
      apk119Value126 = !apk119Value126, apk119Value128.setAttribute("aria-pressed", String(apk119Value126)), apk119Value128.title = apk119Value126 ? "查看原文" : "查看翻译", apk119Value128.setAttribute("aria-label", apk119Value128.title), void apk119Value129();
    }), await apk119Value129();
  }
  function apk119Value27(apk119Value139) {
    const apk119Value140 = apk119Value139.id,
      apk119Value141 = apk119Value24("发送文件");
    apk119Value141.overlay.classList.add("is-file-composer");
    const apk119Value142 = apk119Value2.createMessageId("file-send");
    let apk119Value143 = null,
      apk119Value144 = null,
      apk119Value145 = 0,
      apk119Value146 = false;
    apk119Value141.body.innerHTML = "<label class=\"im-file-upload\">选择本地文件<input type=\"file\" aria-label=\"选择本地文件\"></label><small>支持任意格式，每个文件不超过 20 MiB</small><div class=\"im-file-status\" role=\"status\"></div><label>文件名<input data-name maxlength=\"240\" value=\"未命名.txt\"></label><label>正文格式<select data-format><option value=\"text\">TXT 纯文本</option><option value=\"markdown\">Markdown</option></select></label><label>文件正文<textarea data-text maxlength=\"100000\" placeholder=\"也可以直接在这里编写文件正文……\"></textarea></label><button type=\"button\" data-clear hidden>改为现场编写</button>", apk119Value141.footer.innerHTML = "<button type=\"button\" data-cancel>取消</button><button type=\"button\" data-send>发送</button>";
    const apk119Value147 = apk119Value141.body.querySelector("input[type=file]"),
      apk119Value148 = apk119Value141.body.querySelector("[data-name]"),
      apk119Value149 = apk119Value141.body.querySelector("[data-format]"),
      apk119Value150 = apk119Value141.body.querySelector("[data-text]"),
      apk119Value151 = apk119Value141.body.querySelector(".im-file-status"),
      apk119Value152 = apk119Value141.body.querySelector("[data-clear]"),
      apk119Value153 = apk119Value141.footer.querySelector("[data-send]"),
      apk119Value154 = apk119Value155 => {
        apk119Value148.disabled = !apk119Value155, apk119Value149.disabled = !apk119Value155, apk119Value150.readOnly = !apk119Value155;
      };
    return apk119Value147.addEventListener("change", async () => {
      const apk119Value156 = apk119Value147.files?.[0];
      if (!apk119Value156 || apk119Value146) return;
      const apk119Value157 = ++apk119Value145;
      apk119Value143 = apk119Value156, apk119Value144 = null, apk119Value153.disabled = true, apk119Value151.textContent = "正在读取文件……", apk119Value154(false), apk119Value152.hidden = false;
      try {
        const apk119Value158 = await apk119Value20(apk119Value156);
        if (apk119Value157 !== apk119Value145 || !apk119Value141.overlay.isConnected) return;
        apk119Value144 = apk119Value158, apk119Value148.value = apk119Value158.name, apk119Value149.value = apk119Value158.format, apk119Value150.value = apk119Value158.text, apk119Value151.textContent = apk119Value15(apk119Value158) || "已读取 · " + apk119Value22(apk119Value156.size), apk119Value153.disabled = false;
      } catch (apk119Value159) {
        if (apk119Value157 === apk119Value145) apk119Value151.textContent = apk119Value159.message;
      }
    }), apk119Value152.addEventListener("click", () => {
      if (apk119Value146) return;
      apk119Value145++, apk119Value143 = null, apk119Value144 = null, apk119Value147.value = "", apk119Value148.value = "未命名.txt", apk119Value149.value = "text", apk119Value150.value = "", apk119Value151.textContent = "", apk119Value152.hidden = true, apk119Value154(true), apk119Value153.disabled = false;
    }), apk119Value141.footer.querySelector("[data-cancel]").addEventListener("click", apk119Value141.close), apk119Value149.addEventListener("change", () => {
      apk119Value148.value = apk119Value148.value.replace(/\.(txt|md|markdown)$/i, "") + (apk119Value149.value === "markdown" ? ".md" : ".txt");
    }), apk119Value153.addEventListener("click", async () => {
      if (apk119Value146 || apk119Value153.disabled) return;
      if (!apk119Value143 && (!apk119Value148.value.trim() || !apk119Value150.value.trim())) {
        apk119Value151.textContent = "请填写文件名和正文";
        return;
      }
      if (!apk119Value143 && apk119Value150.value.length > apk119Value4) {
        apk119Value151.textContent = "正文不能超过 10 万字符";
        return;
      }
      apk119Value146 = true, apk119Value153.disabled = true, apk119Value147.disabled = true, apk119Value152.disabled = true, apk119Value154(false);
      try {
        const apk119Value160 = apk119Value143 ? apk119Value144 : apk119Value12({
          name: apk119Value148.value,
          source: "composed",
          text: apk119Value150.value,
          format: apk119Value149.value,
          size: new Blob([apk119Value150.value]).size,
          mimeType: apk119Value149.value === "markdown" ? "text/markdown;charset=utf-8" : "text/plain;charset=utf-8"
        });
        if (!apk119Value160) throw new Error("文件尚未读取完成");
        const apk119Value161 = await apk119Value21(apk119Value160, {
          friendId: apk119Value140,
          blob: apk119Value143,
          operationId: apk119Value142
        });
        if (apk119Value161) apk119Value141.close();
      } catch (apk119Value162) {
        apk119Value151.textContent = apk119Value162.message || "文件发送失败，请重试";
      } finally {
        apk119Value146 = false, apk119Value153.disabled = false, apk119Value147.disabled = false, apk119Value152.disabled = false, apk119Value154(!apk119Value143);
      }
    }), apk119Value141;
  }
  Object.assign(apk119Value2, {
    normalizeFileData: apk119Value12,
    normalizeFileOutputItem: apk119Value13,
    fileOutputNeedsTranslation: apk119Value14,
    formatFileForContext: apk119Value16,
    allocateFileContext: apk119Value17,
    prepareFileUpload: apk119Value20,
    sendFileMessage: apk119Value21,
    buildFileCardHtml: apk119Value23,
    openFileDetail: apk119Value26,
    openFileComposer: apk119Value27,
    copyFileText: apk119Value25
  });
})(window);