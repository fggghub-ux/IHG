(function () {
  "use strict";

  const localValue1 = new Map(),
    localValue2 = /^(?:payH5Url|payOrderUrl|paymentUrl|payment_url|checkoutUrl|checkout_url)$/i,
    localValue3 = /^(?:payOrderQrCodeUrl|paymentQrCodeUrl|payment_qr_code_url)$/i;
  function localValue4(localValue15) {
    if (typeof localValue15 !== "string") return "";
    const localValue16 = localValue15.trim();
    if (!/^https:\/\//i.test(localValue16) || /[\x00-\x20\x7f\\]/.test(localValue16)) return "";
    try {
      const localValue17 = new URL(localValue16);
      return localValue17.protocol === "https:" && localValue17.hostname && !localValue17.username && !localValue17.password ? localValue16 : "";
    } catch (localValue18) {
      return "";
    }
  }
  function localValue5(localValue19) {
    if (typeof localValue19 === "number" && (!Number.isFinite(localValue19) || !Number.isSafeInteger(localValue19) && Number.isInteger(localValue19))) return "";
    return typeof localValue19 === "string" || typeof localValue19 === "number" ? String(localValue19).slice(0, 160) : "";
  }
  function localValue6(localValue20) {
    if (!localValue20 || typeof localValue20 !== "object") return null;
    const localValue21 = localValue4(localValue20.paymentUrl),
      localValue22 = localValue4(localValue20.qrCodeUrl);
    if (!localValue21 && !localValue22) return null;
    const localValue23 = localValue5(localValue20.serverId),
      localValue24 = localValue5(localValue20.orderId);
    return {
      "key": JSON.stringify([localValue23, localValue24 || localValue21 || localValue22]),
      "serverId": localValue23,
      "serverName": localValue5(localValue20.serverName) || "MCP",
      "toolName": localValue5(localValue20.toolName),
      "orderId": localValue24,
      "amount": localValue5(localValue20.amount),
      "currency": localValue5(localValue20.currency),
      "paymentUrl": localValue21,
      "qrCodeUrl": localValue22
    };
  }
  function localValue7(localValue25, localValue26 = {}) {
    if (localValue25?.["isError"] === true) return [];
    const localValue27 = new Map(),
      localValue28 = new WeakSet();
    let localValue29 = 0;
    function localValue30(localValue31, localValue32 = {}, localValue33 = 0) {
      if (localValue33 > 10 || ++localValue29 > 2000) return;
      if (typeof localValue31 === "string") {
        try {
          localValue30(JSON.parse(localValue31), localValue32, localValue33 + 1);
        } catch (localValue38) {}
        return;
      }
      if (!localValue31 || typeof localValue31 !== "object" || localValue28.has(localValue31)) return;
      localValue28.add(localValue31);
      if (Array.isArray(localValue31)) {
        localValue31.forEach(localValue39 => localValue30(localValue39, localValue32, localValue33 + 1));
        return;
      }
      const localValue34 = localValue31.orderDetail && typeof localValue31.orderDetail === "object" ? localValue31.orderDetail : {};
      if (localValue31.success === false || localValue31.ok === false || localValue31.isError === true || localValue31.needPay === false || localValue31.paid === true || localValue31.isPaid === true || /^(?:paid|completed|cancelled|canceled|已支付|支付成功|已完成|已取消)$/i.test(String(localValue31.orderStatus || localValue31.paymentStatus || localValue34.orderStatus || ""))) return;
      const localValue35 = {
        "orderId": localValue5(localValue31.orderIdStr ?? localValue31.orderId ?? localValue31.order_id) || localValue32.orderId || "",
        "amount": localValue5(localValue34.realTotalAmount ?? localValue31.realTotalAmount ?? localValue31.orderPayAmount ?? localValue31.discountPrice ?? localValue31.amount ?? localValue31.totalAmount) || localValue32.amount || "",
        "currency": localValue5(localValue31.currency) || localValue32.currency || ""
      };
      let localValue36 = "",
        localValue37 = "";
      Object.entries(localValue31).forEach(([localValue40, localValue41]) => {
        if (localValue2.test(localValue40)) localValue36 ||= localValue4(localValue41);
        if (localValue3.test(localValue40)) localValue37 ||= localValue4(localValue41);
      });
      if (localValue36 || localValue37) {
        const localValue42 = localValue6({
          ...localValue35,
          "paymentUrl": localValue36,
          "qrCodeUrl": localValue37,
          "serverId": localValue26.serverId,
          "serverName": localValue26.serverName,
          "toolName": localValue26.name || localValue26.toolName
        });
        localValue27.set(localValue42.key, localValue42);
      }
      Object.values(localValue31).forEach(localValue43 => localValue30(localValue43, localValue35, localValue33 + 1));
    }
    return localValue30(localValue25?.["structuredContent"]), (Array.isArray(localValue25?.["content"]) ? localValue25.content : []).forEach(localValue44 => {
      if (localValue44?.["type"] === "text") localValue30(localValue44.text);
    }), Array.from(localValue27.values());
  }
  function localValue8(localValue45) {
    if (String(window.imData?.["currentActiveFriend"]?.["id"]) !== String(localValue45)) return null;
    return document.getElementById("chat-interface-" + localValue45)?.["querySelector"](".ins-chat-messages") || null;
  }
  function localValue9(localValue46, localValue47) {
    const localValue48 = String(localValue46 || "").trim();
    let localValue49;
    try {
      localValue49 = new URL(/^https?:\/\//i.test(localValue48) ? localValue48 : "https://" + localValue48);
    } catch (localValue51) {
      return false;
    }
    const localValue50 = window.imApp?.["getFriendById"]?.(localValue47) || window.imData?.["friends"]?.["find"](localValue52 => String(localValue52.id) === String(localValue47));
    return (localValue50?.["messages"] || []).some(localValue53 => localValue53.type === "mcp_payment" && [localValue53.mcpPayment?.["paymentUrl"], localValue53.mcpPayment?.["qrCodeUrl"]].filter(Boolean).some(localValue54 => {
      try {
        const localValue55 = new URL(localValue54);
        return localValue49.origin === localValue55.origin && localValue49.pathname === localValue55.pathname;
      } catch (localValue56) {
        return false;
      }
    }));
  }
  async function localValue10(localValue57, localValue58, localValue59) {
    const localValue60 = window.imApp?.["getFriendById"]?.(localValue57) || window.imData?.["friends"]?.["find"](localValue61 => String(localValue61.id) === String(localValue57));
    if (!localValue60) throw new Error("订单已创建，但未找到原聊天，付款入口未能保存");
    await window.imApp?.["ensureFriendMessagesLoaded"]?.(localValue60);
    for (const localValue62 of localValue58) {
      const localValue63 = localValue6(localValue62);
      if (!localValue63) continue;
      const localValue64 = window.imApp?.["getFriendById"]?.(localValue57) || window.imData?.["friends"]?.["find"](localValue68 => String(localValue68.id) === String(localValue57));
      if (!localValue64) throw new Error("订单已创建，但未找到原聊天，付款入口未能保存");
      const localValue65 = (localValue64.messages || []).find(localValue69 => localValue69.type === "mcp_payment" && localValue69.mcpPayment?.["key"] === localValue63.key);
      if (localValue65) {
        const localValue70 = Array.from(new Set([localValue65.apiRunId, ...(localValue65.mcpPaymentRunIds || []), localValue59].filter(Boolean)));
        if (JSON.stringify(localValue65.mcpPayment) === JSON.stringify(localValue63) && localValue70.length === (localValue65.mcpPaymentRunIds || []).length) continue;
        const localValue71 = await window.imApp.updateFriendMessage(localValue57, {
          "id": localValue65.id,
          "timestamp": localValue65.timestamp
        }, localValue74 => {
          localValue74.mcpPayment = localValue63, localValue74.mcpPaymentRunIds = localValue70;
        });
        if (!localValue71) throw new Error("付款入口更新失败，请保留原始支付链接");
        const localValue72 = localValue8(localValue57),
          localValue73 = localValue72 && Array.from(localValue72.querySelectorAll(".im-mcp-payment-row")).find(localValue75 => localValue75.dataset.messageId === String(localValue65.id));
        if (localValue73) {
          const localValue76 = localValue14({
            ...localValue65,
            "mcpPayment": localValue63
          }, localValue64, localValue72);
          localValue73.replaceWith(localValue76);
        }
        continue;
      }
      const localValue66 = {
        "id": window.imChat?.["createMessageId"]?.("mcp-payment") || "mcp-payment-" + Date.now() + "-" + Math.random().toString(36).slice(2),
        "role": "system",
        "type": "mcp_payment",
        "excludedFromContext": true,
        "timestamp": Date.now(),
        "apiRunId": String(localValue59 || ""),
        "mcpPaymentRunIds": localValue59 ? [String(localValue59)] : [],
        "mcpPayment": localValue63
      };
      if (!(await window.imApp?.["appendFriendMessage"]?.(localValue57, localValue66, {
        "silent": true
      }))) throw new Error("订单已创建，但付款入口保存失败，请保留原始支付链接");
      const localValue67 = localValue8(localValue57);
      if (localValue67) localValue14(localValue66, localValue64, localValue67);
    }
  }
  function localValue11(localValue77, localValue78, localValue79 = {}) {
    const localValue80 = String(localValue77),
      localValue81 = localValue1.get(localValue80) || Promise.resolve(),
      localValue82 = localValue81["catch"](() => {}).then(() => localValue10(localValue77, localValue78, localValue79.apiRunId));
    return localValue1.set(localValue80, localValue82), void localValue82["finally"](() => {
      if (localValue1.get(localValue80) === localValue82) localValue1["delete"](localValue80);
    })["catch"](() => {}), localValue82;
  }
  function localValue12(localValue83, localValue84) {
    return (localValue83?.["messages"] || []).filter(localValue85 => localValue85.type === "mcp_payment" && localValue84 && (localValue85.apiRunId === localValue84 || localValue85.mcpPaymentRunIds?.["includes"](localValue84))).map(localValue86 => {
      const localValue87 = localValue6(localValue86.mcpPayment);
      return localValue87 ? {
        "callId": String(localValue86.id),
        "callName": "mcp_existing_payment",
        "arguments": "{}",
        "payments": [localValue87],
        "result": JSON.stringify({
          "isError": false,
          "structuredContent": {
            "existingOrder": localValue87
          },
          "content": [{
            "type": "text",
            "text": "此订单已经创建，仅复用真实付款入口，不应重新下单；支付是否成功尚未确认。"
          }]
        })
      } : null;
    }).filter(Boolean);
  }
  async function localValue13(localValue88) {
    if (window.navigator?.["clipboard"]?.["writeText"]) return window.navigator.clipboard.writeText(localValue88);
    const localValue89 = document.createElement("textarea");
    localValue89.value = localValue88, localValue89.style.cssText = "position:fixed;opacity:0;", document.body.appendChild(localValue89), localValue89.select();
    const localValue90 = document.execCommand?.("copy");
    localValue89.remove();
    if (!localValue90) throw new Error("复制失败，请在外部支付页面复制地址");
  }
  function localValue14(localValue91, localValue92, localValue93) {
    const localValue94 = localValue6(localValue91.mcpPayment);
    if (!localValue94) return null;
    const localValue95 = document.createElement("div");
    localValue95.className = "chat-row im-mcp-payment-row", localValue95.dataset.messageId = String(localValue91.id || ""), localValue95.dataset.timestamp = String(localValue91.timestamp || "");
    const localValue96 = document.createElement("section");
    localValue96.className = "im-mcp-payment-card", localValue96.setAttribute("aria-label", "MCP 付款入口");
    const localValue97 = (localValue102, localValue103, localValue104) => {
      const localValue105 = document.createElement(localValue102);
      localValue105.textContent = localValue103;
      if (localValue104) localValue105.className = localValue104;
      return localValue96.appendChild(localValue105), localValue105;
    };
    localValue97("small", "来自 " + localValue94.serverName, "im-mcp-payment-source"), localValue97("strong", "待确认支付", "im-mcp-payment-title");
    if (localValue94.orderId) localValue97("p", "订单号：" + localValue94.orderId);
    if (localValue94.amount) localValue97("p", "金额：" + localValue94.amount + (localValue94.currency ? " " + localValue94.currency : ""));
    localValue97("p", "支付域名：" + new URL(localValue94.paymentUrl || localValue94.qrCodeUrl).hostname, "im-mcp-payment-domain");
    if (localValue94.qrCodeUrl) {
      const localValue106 = document.createElement("img");
      localValue106.src = localValue94.qrCodeUrl, localValue106.alt = "服务返回的支付二维码", localValue106.referrerPolicy = "no-referrer", localValue106.loading = "lazy", localValue106.addEventListener("error", () => {
        localValue106.hidden = true, localValue97("p", "支付二维码暂不可用，可复制链接重试");
      }, {
        "once": true
      }), localValue96.appendChild(localValue106);
    }
    const localValue98 = document.createElement("div");
    localValue98.className = "im-mcp-payment-actions";
    const localValue99 = document.createElement("button");
    localValue99.type = "button", localValue99.textContent = localValue94.paymentUrl ? "去付款" : "查看支付二维码";
    const localValue100 = localValue94.paymentUrl || localValue94.qrCodeUrl;
    localValue99.addEventListener("click", () => {
      try {
        if (!window.u2NativeBridge?.["openExternalUrl"]) throw new Error("外部打开功能尚未加载，请刷新或复制链接");
        Promise.resolve(window.u2NativeBridge.openExternalUrl(localValue100))["catch"](localValue107 => window.showToast?.(localValue107.message || "无法打开支付页面，请复制链接"));
      } catch (localValue108) {
        window.showToast?.(localValue108.message);
      }
    });
    const localValue101 = document.createElement("button");
    return localValue101.type = "button", localValue101.textContent = "复制链接", localValue101.addEventListener("click", () => {
      void localValue13(localValue100).then(() => window.showToast?.("支付链接已复制"))["catch"](localValue109 => window.showToast?.(localValue109.message));
    }), localValue98.append(localValue99, localValue101), localValue96.appendChild(localValue98), localValue97("small", "请在官方页面确认付款；打开页面不代表已支付。"), localValue95.appendChild(localValue96), localValue93.appendChild(localValue95), window.imChat?.["scrollToBottom"]?.(localValue93), localValue95;
  }
  window.imMcpPayments = Object.freeze({
    "extract": localValue7,
    "normalize": localValue6,
    "publish": localValue11,
    "render": localValue14,
    "httpsUrl": localValue4,
    "isPaymentLink": localValue9,
    "replayTraceFor": localValue12
  });
})();
