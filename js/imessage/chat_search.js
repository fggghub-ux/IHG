(function scopeValue1(scopeValue0) {
  "use strict";

  const scopeValue2 = scopeValue0.imChat = scopeValue0.imChat || {};
  function newScope3(newScope16, newScope17) {
    let newScope18 = null;
    return function newScope20(...newScope19) {
      clearTimeout(newScope18), newScope18 = setTimeout(() => newScope16.apply(this, newScope19), newScope17);
    };
  }
  function scopeValue3(scopeValue15) {
    const scopeValue16 = String(scopeValue15 == null ? "" : scopeValue15);
    if (!scopeValue16) return "";
    if (typeof document !== "undefined" && document.createElement) {
      const scopeValue17 = document.createElement("div");
      return scopeValue17.innerHTML = scopeValue16, scopeValue17.querySelectorAll("script,style").forEach(scopeValue18 => scopeValue18.remove()), String(scopeValue17.textContent || scopeValue17.innerText || "").replace(/\s+/g, " ").trim();
    }
    return scopeValue16.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ").replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, "\"").replace(/&#0?39;/gi, "'").replace(/\s+/g, " ").trim();
  }
  function scopeValue4(scopeValue19, scopeValue20, scopeValue21 = {}) {
    if (scopeValue20 == null) return;
    const scopeValue22 = scopeValue21.html ? scopeValue3(scopeValue20) : String(scopeValue20).replace(/\s+/g, " ").trim();
    if (!scopeValue22 || scopeValue19.includes(scopeValue22)) return;
    scopeValue19.push(scopeValue22);
  }
  function scopeValue5(scopeValue23, scopeValue24) {
    if (!Array.isArray(scopeValue24)) return;
    scopeValue24.forEach(scopeValue25 => {
      if (!scopeValue25 || typeof scopeValue25 !== "object") return;
      scopeValue4(scopeValue23, scopeValue25.speaker || scopeValue25.senderName || scopeValue25.roleName);
      scopeValue4(scopeValue23, scopeValue25.text || scopeValue25.content);
    });
  }
  function scopeValue6(scopeValue26, scopeValue27) {
    if (!scopeValue27 || typeof scopeValue27 !== "string") return;
    try {
      const scopeValue28 = JSON.parse(scopeValue27);
      if (!scopeValue28 || typeof scopeValue28 !== "object") return;
      scopeValue4(scopeValue26, scopeValue28.authorName || scopeValue28.nickname || scopeValue28.userName || scopeValue28.author?.name || scopeValue28.author?.nickname);
      scopeValue4(scopeValue26, scopeValue28.text || scopeValue28.caption || scopeValue28.description || scopeValue28.content);
    } catch (scopeValue29) {}
  }
  function scopeValue7(scopeValue30 = {}, scopeValue31 = null) {
    if (!scopeValue30 || typeof scopeValue30 !== "object") return "";
    if (scopeValue31?.type === "group" && scopeValue30.type === "system_notice" && scopeValue30.noticeKind === "group_title_changed" && scopeValue0.imApp?.areGroupTitlesEnabled?.(scopeValue31) === false) return "";
    const scopeValue32 = [],
      scopeValue33 = String(scopeValue30.type || "").trim();
    scopeValue4(scopeValue32, scopeValue30.replyTo);
    scopeValue4(scopeValue32, scopeValue30.translation);
    switch (scopeValue33) {
      case "file":
        scopeValue4(scopeValue32, scopeValue30.fileData?.name);
        scopeValue4(scopeValue32, scopeValue30.fileData?.text);
        break;
      case "voice_message":
        scopeValue4(scopeValue32, scopeValue30.transcript || scopeValue30.text);
        break;
      case "image":
        scopeValue4(scopeValue32, scopeValue30.text || scopeValue30.description || scopeValue30.caption);
        break;
      case "location":
        scopeValue4(scopeValue32, scopeValue30.locationName || scopeValue30.name);
        scopeValue4(scopeValue32, scopeValue30.locationNameTranslation || scopeValue30.nameTranslation);
        scopeValue4(scopeValue32, scopeValue30.locationAddress || scopeValue30.address);
        scopeValue4(scopeValue32, scopeValue30.locationAddressTranslation || scopeValue30.addressTranslation);
        break;
      case "sticker":
        scopeValue4(scopeValue32, scopeValue30.stickerName || scopeValue30.text);
        break;
      case "fake_link":
        scopeValue4(scopeValue32, scopeValue30.fakeLinkData?.siteName);
        scopeValue4(scopeValue32, scopeValue30.fakeLinkData?.title || scopeValue30.title || scopeValue30.linkTitle);
        scopeValue4(scopeValue32, scopeValue30.fakeLinkData?.summary || scopeValue30.fakeLinkData?.description || scopeValue30.description || scopeValue30.linkDescription);
        scopeValue4(scopeValue32, scopeValue30.fakeLinkData?.bodyText);
        scopeValue4(scopeValue32, scopeValue30.fakeLinkData?.displayUrl || scopeValue30.displayUrl || scopeValue30.domain || scopeValue30.urlLabel);
        break;
      case "pay_transfer":
      case "group_red_packet":
        scopeValue4(scopeValue32, scopeValue30.paymentAction);
        scopeValue4(scopeValue32, scopeValue30.cardTitle || scopeValue30.title);
        scopeValue4(scopeValue32, scopeValue30.description);
        scopeValue4(scopeValue32, scopeValue30.amount);
        scopeValue4(scopeValue32, scopeValue30.payerName || scopeValue30.senderName);
        scopeValue4(scopeValue32, scopeValue30.payeeName || scopeValue30.receiverName || scopeValue30.targetName);
        scopeValue4(scopeValue32, scopeValue30.statusText);
        if (scopeValue33 === "group_red_packet") scopeValue4(scopeValue32, scopeValue30.totalAmount);
        break;
      case "system_notice":
        scopeValue4(scopeValue32, scopeValue0.imApp?.getGroupManagementNoticeText?.(scopeValue31, scopeValue30) ?? (scopeValue30.text || scopeValue30.content));
        break;
      case "voice_call_record":
        scopeValue4(scopeValue32, scopeValue30.isVideo ? "视频通话" : "语音通话");
        scopeValue4(scopeValue32, scopeValue30.title);
        scopeValue4(scopeValue32, scopeValue30.statusText);
        scopeValue4(scopeValue32, scopeValue30.summary);
        scopeValue5(scopeValue32, scopeValue30.messages || scopeValue30.callMessages);
        break;
      case "offline_meeting_record":
        scopeValue4(scopeValue32, scopeValue30.title);
        scopeValue4(scopeValue32, scopeValue30.summary || scopeValue30.rawSummary || scopeValue30.content);
        scopeValue4(scopeValue32, scopeValue30.dateText);
        scopeValue5(scopeValue32, scopeValue30.meetingMessages);
        break;
      case "moment_forward":
        scopeValue6(scopeValue32, scopeValue30.content);
        break;
      case "group_announcement":
        scopeValue4(scopeValue32, scopeValue30.payload?.["announcement"]?.["content"]), scopeValue4(scopeValue32, scopeValue30.payload?.["announcement"]?.["publishedBy"]?.["name"]), scopeValue4(scopeValue32, scopeValue30.payload?.["announcement"]?.["updatedBy"]?.["name"]);
        break;
      case "group_poll":
        scopeValue4(scopeValue32, scopeValue30.pollQuestion);
        (Array.isArray(scopeValue30.pollOptions) ? scopeValue30.pollOptions : []).forEach(scopeValue34 => {
          scopeValue4(scopeValue32, scopeValue34?.text);
        });
        break;
      case "chat_record_forward":
        scopeValue4(scopeValue32, scopeValue30.record?.title);
        scopeValue4(scopeValue32, scopeValue30.record?.sourceName);
        (Array.isArray(scopeValue30.record?.entries) ? scopeValue30.record.entries : []).forEach(scopeValue35 => {
          scopeValue4(scopeValue32, scopeValue35?.senderName);
          scopeValue4(scopeValue32, scopeValue35?.text || scopeValue35?.preview || scopeValue35?.content);
        });
        break;
      case "contact_card":
        scopeValue4(scopeValue32, scopeValue30.contactName || scopeValue30.name || scopeValue30.title);
        scopeValue4(scopeValue32, scopeValue30.contactRealName);
        scopeValue4(scopeValue32, scopeValue30.contactSignature || scopeValue30.description || scopeValue30.text);
        break;
      case "together_listening_invite":
        scopeValue4(scopeValue32, scopeValue30.title || scopeValue30.songName);
        scopeValue4(scopeValue32, scopeValue30.artist || scopeValue30.artistName || scopeValue30.description);
        break;
      case "html":
        scopeValue4(scopeValue32, scopeValue30.content || scopeValue30.text, {
          html: true
        });
        break;
      default:
        (scopeValue30.role === "user" || scopeValue30.role === "assistant") && scopeValue4(scopeValue32, scopeValue30.content || scopeValue30.text);
        break;
    }
    return scopeValue32.join(" · ");
  }
  function scopeValue8(scopeValue36 = {}) {
    const scopeValue37 = {
      voice_message: "语音",
      image: "图片",
      location: "定位",
      sticker: "表情",
      fake_link: "链接",
      pay_transfer: "转账",
      group_red_packet: "红包",
      system_notice: "系统提示",
      voice_call_record: "通话",
      offline_meeting_record: "见面记录",
      moment_forward: "朋友圈",
      group_announcement: "群公告",
      group_poll: "群投票",
      chat_record_forward: "聊天记录",
      contact_card: "联系人",
      together_listening_invite: "一起听",
      html: "卡片"
    };
    return scopeValue37[scopeValue36.type] || "消息";
  }
  function scopeValue9(scopeValue38, scopeValue39 = {}) {
    if (scopeValue39.role === "user") {
      if (scopeValue38?.type === "group") {
        const scopeValue40 = scopeValue0.imApp?.getMessageUserIdentity?.(scopeValue38, scopeValue39),
          scopeValue41 = scopeValue40?.name || scopeValue40?.realName || scopeValue40?.nickname;
        return scopeValue41 ? scopeValue41 + "（我）" : "我";
      }
      return "我";
    }
    if (scopeValue39.role !== "assistant") return "系统";
    if (scopeValue38?.type === "group") {
      const scopeValue42 = scopeValue2.getGroupMessageSpeaker?.(scopeValue38, scopeValue39);
      return scopeValue42?.nickname || scopeValue42?.realName || scopeValue39.speaker || scopeValue39.senderName || "群成员";
    }
    return scopeValue38?.nickname || scopeValue38?.realName || "Char";
  }
  function scopeValue10(scopeValue43, scopeValue44) {
    const scopeValue45 = String(scopeValue44 == null ? "" : scopeValue44).trim();
    if (!scopeValue43 || !scopeValue45) return [];
    const scopeValue46 = scopeValue45.toLocaleLowerCase(),
      scopeValue47 = Array.isArray(scopeValue43.messages) ? scopeValue43.messages : [],
      scopeValue48 = [];
    for (let scopeValue49 = scopeValue47.length - 1; scopeValue49 >= 0; scopeValue49 -= 1) {
      const scopeValue50 = scopeValue47[scopeValue49],
        scopeValue51 = scopeValue7(scopeValue50, scopeValue43);
      if (!scopeValue51) continue;
      const scopeValue52 = scopeValue51.toLocaleLowerCase().indexOf(scopeValue46);
      if (scopeValue52 < 0) continue;
      scopeValue48.push({
        message: scopeValue50,
        index: scopeValue49,
        text: scopeValue51,
        matchIndex: scopeValue52,
        typeLabel: scopeValue8(scopeValue50)
      });
    }
    return scopeValue48;
  }
  function scopeValue11(scopeValue53, scopeValue54 = {}) {
    const scopeValue55 = Array.isArray(scopeValue53?.messages) ? scopeValue53.messages : [],
      scopeValue56 = scopeValue54.id == null ? "" : String(scopeValue54.id),
      scopeValue57 = scopeValue54.timestamp == null ? "" : String(scopeValue54.timestamp);
    if (scopeValue56) {
      const scopeValue59 = scopeValue55.findIndex(scopeValue60 => String(scopeValue60?.id || "") === scopeValue56);
      if (scopeValue59 >= 0) return scopeValue59;
    }
    if (scopeValue57) {
      const scopeValue61 = scopeValue55.findIndex(scopeValue62 => String(scopeValue62?.timestamp || "") === scopeValue57 && (!scopeValue54.text || scopeValue7(scopeValue62, scopeValue53) === scopeValue54.text));
      if (scopeValue61 >= 0) return scopeValue61;
    }
    const scopeValue58 = Number(scopeValue54.index);
    if (Number.isInteger(scopeValue58) && scopeValue58 >= 0 && scopeValue58 < scopeValue55.length) {
      const scopeValue63 = scopeValue7(scopeValue55[scopeValue58], scopeValue53);
      if (!scopeValue54.text || scopeValue63 === scopeValue54.text) return scopeValue58;
    }
    return -1;
  }
  function scopeValue12(scopeValue64, scopeValue65, scopeValue66 = {}) {
    const scopeValue67 = Array.from(scopeValue64?.querySelectorAll?.(".chat-row") || []),
      scopeValue68 = String(scopeValue65?.id || scopeValue66.id || ""),
      scopeValue69 = String(scopeValue65?.timestamp || scopeValue66.timestamp || "");
    if (scopeValue68) {
      const scopeValue70 = scopeValue67.find(scopeValue71 => String(scopeValue71.getAttribute("data-message-id") || "") === scopeValue68);
      if (scopeValue70) return scopeValue70;
    }
    if (scopeValue69) return scopeValue67.find(scopeValue72 => String(scopeValue72.getAttribute("data-timestamp") || "") === scopeValue69) || null;
    return null;
  }
  function scopeValue13(scopeValue73, scopeValue74) {
    if (!scopeValue73 || !scopeValue74) return;
    const scopeValue75 = scopeValue73.getBoundingClientRect(),
      scopeValue76 = scopeValue74.getBoundingClientRect(),
      scopeValue77 = scopeValue76.top - scopeValue75.top,
      scopeValue78 = scopeValue73.scrollTop + scopeValue77 - Math.max(0, (scopeValue73.clientHeight - scopeValue76.height) / 2);
    scopeValue73.scrollTop = Math.max(0, scopeValue78);
  }
  function scopeValue14(scopeValue79, scopeValue80 = {}) {
    const scopeValue81 = scopeValue0.imApp?.getFriendById ? scopeValue0.imApp.getFriendById(scopeValue79) : typeof scopeValue79 === "object" ? scopeValue79 : null;
    if (!scopeValue81 || scopeValue81.type === "npc" || scopeValue81.type === "official") return {
      ok: false,
      reason: "friend"
    };
    const scopeValue82 = scopeValue11(scopeValue81, scopeValue80);
    if (scopeValue82 < 0) return {
      ok: false,
      reason: "missing"
    };
    const scopeValue83 = typeof document !== "undefined" ? document.getElementById("chat-interface-" + scopeValue81.id) : null,
      scopeValue84 = scopeValue83?.querySelector(".ins-chat-messages");
    if (!scopeValue83 || !scopeValue84 || typeof scopeValue2.renderChatHistory !== "function") return {
      ok: false,
      reason: "view"
    };
    const scopeValue85 = Number(scopeValue84._imHistoryState?.visibleStartIndex),
      scopeValue86 = Number(scopeValue84._imHistoryState?.visibleEndIndex),
      scopeValue87 = scopeValue84.scrollTop;
    scopeValue84.innerHTML = "";
    scopeValue2.renderChatHistory(scopeValue81, scopeValue84, {
      startIndex: Math.max(0, scopeValue82 - 4),
      endIndex: Math.min(scopeValue81.messages.length, scopeValue82 + 61),
      scroll: false
    });
    const scopeValue88 = scopeValue81.messages[scopeValue82],
      scopeValue89 = scopeValue12(scopeValue84, scopeValue88, scopeValue80);
    if (!scopeValue89) return scopeValue84.innerHTML = "", scopeValue2.renderChatHistory(scopeValue81, scopeValue84, {
      startIndex: Number.isFinite(scopeValue85) ? scopeValue85 : undefined,
      endIndex: Number.isFinite(scopeValue86) ? scopeValue86 : undefined,
      scroll: false
    }), scopeValue84.scrollTop = scopeValue87, {
      ok: false,
      reason: "row"
    };
    return scopeValue84.querySelectorAll(".chat-search-target").forEach(scopeValue90 => scopeValue90.classList.remove("chat-search-target")), scopeValue89.classList.add("chat-search-target"), scopeValue13(scopeValue84, scopeValue89), scopeValue0.setTimeout(() => scopeValue89.classList.remove("chat-search-target"), 2200), {
      ok: true,
      friend: scopeValue81,
      message: scopeValue88,
      index: scopeValue82,
      row: scopeValue89
    };
  }
  scopeValue2.stripChatSearchHtml = scopeValue3;
  scopeValue2.extractSearchableMessageText = scopeValue7;
  scopeValue2.searchFriendMessages = scopeValue10;
  scopeValue2.getSearchSenderName = scopeValue9;
  scopeValue2.resolveSearchMessageIndex = scopeValue11;
  scopeValue2.centerSearchMessageRow = scopeValue13;
  scopeValue2.revealChatMessage = scopeValue14;
  if (typeof document === "undefined") return;
  (window.u2OnStorageReady || (scopeValue91 => document.addEventListener("DOMContentLoaded", scopeValue91)))(() => {
    const scopeValue92 = document.getElementById("chat-settings-search-btn"),
      scopeValue93 = document.getElementById("chat-history-search-view"),
      scopeValue94 = document.getElementById("chat-history-search-back"),
      scopeValue95 = document.getElementById("chat-history-search-title"),
      scopeValue96 = document.getElementById("chat-history-search-input"),
      scopeValue97 = document.getElementById("chat-history-search-status"),
      scopeValue98 = document.getElementById("chat-history-search-results"),
      scopeValue99 = document.getElementById("chat-history-search-more");
    if (!scopeValue92 || !scopeValue93 || !scopeValue94 || !scopeValue95 || !scopeValue96 || !scopeValue97 || !scopeValue98 || !scopeValue99) return;
    let scopeValue100 = "",
      scopeValue101 = [],
      scopeValue102 = [],
      scopeValue103 = 0,
      scopeValue104 = "",
      scopeValue105 = "idle",
      scopeValue106 = 0,
      scopeValue107 = 0,
      scopeValue108 = 0,
      scopeValue109 = false;
    const scopeValue110 = 250,
      scopeValue111 = 60;
    scopeValue0.mobileInputCompat?.registerFocusScope?.({
      selector: "#chat-history-search-view",
      preferFocusScope: true
    });
    function scopeValue112() {
      if (!scopeValue100) return null;
      return scopeValue0.imApp?.getFriendById ? scopeValue0.imApp.getFriendById(scopeValue100) : (scopeValue0.imData?.friends || []).find(scopeValue126 => String(scopeValue126.id) === scopeValue100) || null;
    }
    function scopeValue113() {
      if (scopeValue108) scopeValue0.clearTimeout(scopeValue108);
      scopeValue108 = 0;
      scopeValue107 += 1;
      scopeValue106 += 1;
      scopeValue96.value = "";
      scopeValue98.replaceChildren();
      scopeValue99.hidden = true;
      scopeValue97.textContent = "输入关键词，搜索全部聊天记录";
      scopeValue97.className = "chat-history-search-status is-empty";
      scopeValue100 = "";
      scopeValue101 = [];
      scopeValue102 = [];
      scopeValue103 = 0;
      scopeValue104 = "";
      scopeValue105 = "idle";
      scopeValue109 = false;
      scopeValue96.disabled = false;
    }
    function scopeValue114() {
      scopeValue96.blur();
      if (scopeValue0.closeView) scopeValue0.closeView(scopeValue93);else scopeValue93.classList.remove("active");
      scopeValue113();
    }
    function scopeValue115(scopeValue127, scopeValue128, scopeValue129) {
      const scopeValue130 = String(scopeValue128 || ""),
        scopeValue131 = String(scopeValue129 || ""),
        scopeValue132 = scopeValue130.toLocaleLowerCase(),
        scopeValue133 = scopeValue131.toLocaleLowerCase();
      let scopeValue134 = 0,
        scopeValue135 = scopeValue132.indexOf(scopeValue133);
      while (scopeValue133 && scopeValue135 >= 0) {
        if (scopeValue135 > scopeValue134) scopeValue127.appendChild(document.createTextNode(scopeValue130.slice(scopeValue134, scopeValue135)));
        const scopeValue136 = document.createElement("mark");
        scopeValue136.textContent = scopeValue130.slice(scopeValue135, scopeValue135 + scopeValue131.length);
        scopeValue127.appendChild(scopeValue136);
        scopeValue134 = scopeValue135 + scopeValue131.length;
        scopeValue135 = scopeValue132.indexOf(scopeValue133, scopeValue134);
      }
      if (scopeValue134 < scopeValue130.length) scopeValue127.appendChild(document.createTextNode(scopeValue130.slice(scopeValue134)));
    }
    function scopeValue116(scopeValue137, scopeValue138) {
      const scopeValue139 = 46,
        scopeValue140 = Math.max(0, scopeValue137.matchIndex - scopeValue139),
        scopeValue141 = Math.min(scopeValue137.text.length, scopeValue137.matchIndex + scopeValue138.length + scopeValue139);
      return "" + (scopeValue140 > 0 ? "…" : "") + scopeValue137.text.slice(scopeValue140, scopeValue141) + (scopeValue141 < scopeValue137.text.length ? "…" : "");
    }
    function scopeValue117(scopeValue142) {
      const scopeValue143 = Number(scopeValue142);
      if (!Number.isFinite(scopeValue143) || scopeValue143 <= 0) return "";
      if (scopeValue0.imApp?.formatTime) return scopeValue0.imApp.formatTime(scopeValue143);
      return window.imDataUtils?.formatUsDateTime ? window.imDataUtils.formatUsDateTime(scopeValue143) : new Date(scopeValue143).toLocaleString("en-US", {
        hour12: true
      });
    }
    function scopeValue118() {
      return new Promise(scopeValue144 => scopeValue0.setTimeout(scopeValue144, 0));
    }
    function scopeValue119() {
      return new Promise(scopeValue145 => {
        scopeValue0.requestAnimationFrame ? scopeValue0.requestAnimationFrame(() => scopeValue0.setTimeout(scopeValue145, 0)) : scopeValue0.setTimeout(scopeValue145, 0);
      });
    }
    async function scopeValue120(scopeValue146, scopeValue147, scopeValue148) {
      const scopeValue149 = scopeValue147.message || {},
        scopeValue150 = {
          id: scopeValue149.id || null,
          timestamp: scopeValue149.timestamp || null,
          index: scopeValue147.index,
          text: scopeValue147.text
        },
        scopeValue151 = scopeValue106,
        scopeValue152 = scopeValue107;
      scopeValue96.blur();
      scopeValue148.disabled = true;
      scopeValue97.textContent = "正在载入并定位这条消息…";
      scopeValue97.className = "chat-history-search-status";
      await scopeValue119();
      if (scopeValue151 !== scopeValue106 || scopeValue152 !== scopeValue107) return;
      let scopeValue153 = scopeValue112() || scopeValue146;
      try {
        scopeValue0.imApp?.ensureFriendMessagesLoaded && (await scopeValue0.imApp.ensureFriendMessagesLoaded(scopeValue153, {
          requireComplete: true
        }));
        if (scopeValue151 !== scopeValue106 || scopeValue152 !== scopeValue107) return;
        scopeValue153 = scopeValue112() || scopeValue153;
      } catch (scopeValue156) {
        if (scopeValue151 !== scopeValue106 || scopeValue152 !== scopeValue107) return;
        console.error("Failed to load full conversation for search result", scopeValue156);
        scopeValue148.disabled = false;
        scopeValue97.textContent = "完整聊天记录读取失败，可再次点击结果重试";
        scopeValue97.className = "chat-history-search-status is-error";
        scopeValue0.showToast?.("聊天记录读取失败，请重试");
        return;
      }
      const scopeValue154 = scopeValue14(scopeValue153, scopeValue150);
      if (!scopeValue154.ok) {
        scopeValue148.disabled = false;
        scopeValue0.showToast?.(scopeValue154.reason === "missing" ? "这条消息已不存在" : "暂时无法定位这条消息");
        return;
      }
      const scopeValue155 = document.getElementById(scopeValue146.type === "group" ? "group-details-sheet" : "chat-settings-sheet");
      if (scopeValue0.closeView) {
        scopeValue0.closeView(scopeValue93);
        if (scopeValue155) scopeValue0.closeView(scopeValue155);
      } else {
        scopeValue93.classList.remove("active");
        scopeValue155?.classList.remove("active");
      }
      scopeValue113();
    }
    function scopeValue121() {
      const scopeValue157 = scopeValue112();
      if (!scopeValue157 || !scopeValue104) return;
      const scopeValue158 = Math.min(scopeValue102.length, scopeValue103 + scopeValue111),
        scopeValue159 = document.createDocumentFragment();
      for (let scopeValue161 = scopeValue103; scopeValue161 < scopeValue158; scopeValue161 += 1) {
        const scopeValue162 = scopeValue102[scopeValue161],
          scopeValue163 = scopeValue162.message || {},
          scopeValue164 = document.createElement("button");
        scopeValue164.type = "button";
        scopeValue164.className = "chat-history-search-result";
        scopeValue164.setAttribute("role", "listitem");
        const scopeValue165 = document.createElement("div");
        scopeValue165.className = "chat-history-search-result-heading";
        const scopeValue166 = document.createElement("strong");
        scopeValue166.textContent = scopeValue9(scopeValue157, scopeValue163);
        const scopeValue167 = document.createElement("span"),
          scopeValue168 = scopeValue117(scopeValue163.timestamp);
        scopeValue167.textContent = "" + scopeValue162.typeLabel + (scopeValue168 ? " · " + scopeValue168 : "");
        scopeValue165.append(scopeValue166, scopeValue167);
        const scopeValue169 = document.createElement("div");
        scopeValue169.className = "chat-history-search-result-text";
        scopeValue115(scopeValue169, scopeValue116(scopeValue162, scopeValue104), scopeValue104);
        scopeValue164.append(scopeValue165, scopeValue169);
        scopeValue164.addEventListener("click", () => void scopeValue120(scopeValue157, scopeValue162, scopeValue164));
        scopeValue159.appendChild(scopeValue164);
      }
      scopeValue98.appendChild(scopeValue159);
      scopeValue103 = scopeValue158;
      const scopeValue160 = scopeValue102.length - scopeValue103;
      scopeValue99.hidden = scopeValue160 <= 0;
      if (scopeValue160 > 0) scopeValue99.textContent = "显示更多结果（剩余 " + scopeValue160 + " 条）";
    }
    async function scopeValue122(scopeValue170, scopeValue171) {
      const scopeValue172 = scopeValue171.toLocaleLowerCase(),
        scopeValue173 = [];
      for (let scopeValue174 = scopeValue101.length; scopeValue174 > 0; scopeValue174 -= scopeValue110) {
        if (scopeValue170 !== scopeValue107) return;
        const scopeValue175 = Math.max(0, scopeValue174 - scopeValue110);
        for (let scopeValue176 = scopeValue174 - 1; scopeValue176 >= scopeValue175; scopeValue176 -= 1) {
          const scopeValue177 = scopeValue101[scopeValue176];
          if (!scopeValue177) continue;
          const scopeValue178 = scopeValue177.lowerText.indexOf(scopeValue172);
          scopeValue178 >= 0 && scopeValue173.push({
            message: scopeValue177.message,
            index: scopeValue176,
            text: scopeValue177.text,
            matchIndex: scopeValue178,
            typeLabel: scopeValue177.typeLabel
          });
        }
        if (scopeValue175 > 0) await scopeValue118();
      }
      if (scopeValue170 !== scopeValue107) return;
      scopeValue102 = scopeValue173;
      scopeValue104 = scopeValue171;
      if (scopeValue173.length === 0) {
        scopeValue97.textContent = "没有找到“" + scopeValue171 + "”";
        scopeValue97.className = "chat-history-search-status is-empty";
        return;
      }
      scopeValue97.textContent = scopeValue173.length + " 条结果";
      scopeValue97.className = "chat-history-search-status";
      scopeValue121();
    }
    function scopeValue123(scopeValue179 = {}) {
      if (scopeValue108) scopeValue0.clearTimeout(scopeValue108);
      scopeValue108 = 0;
      const scopeValue180 = ++scopeValue107,
        scopeValue181 = scopeValue96.value.trim();
      scopeValue102 = [];
      scopeValue103 = 0;
      scopeValue104 = "";
      scopeValue98.replaceChildren();
      scopeValue98.scrollTop = 0;
      scopeValue99.hidden = true;
      if (!scopeValue112()) return;
      if (scopeValue105 === "loading" || scopeValue105 === "indexing") {
        scopeValue97.textContent = scopeValue105 === "loading" ? "正在读取全部聊天记录…" : "正在整理聊天记录…";
        scopeValue97.className = "chat-history-search-status";
        return;
      }
      if (scopeValue105 === "error") {
        scopeValue97.textContent = "聊天记录读取失败，点此重试";
        scopeValue97.className = "chat-history-search-status is-error";
        return;
      }
      if (scopeValue105 !== "ready") return;
      if (!scopeValue181) {
        scopeValue97.textContent = "输入关键词，搜索全部聊天记录";
        scopeValue97.className = "chat-history-search-status is-empty";
        return;
      }
      scopeValue97.textContent = "正在搜索…";
      scopeValue97.className = "chat-history-search-status";
      scopeValue108 = scopeValue0.setTimeout(() => {
        scopeValue108 = 0;
        void scopeValue122(scopeValue180, scopeValue181);
      }, scopeValue179.immediate ? 0 : 120);
    }
    async function scopeValue124() {
      const scopeValue182 = scopeValue112();
      if (!scopeValue182) return false;
      const scopeValue183 = ++scopeValue106;
      scopeValue105 = "loading";
      scopeValue96.disabled = true;
      scopeValue123();
      try {
        let scopeValue184;
        if (scopeValue0.imStorage?.loadMessageIndexByFriendId) scopeValue184 = await scopeValue0.imStorage.loadMessageIndexByFriendId(scopeValue182.id);else {
          if (scopeValue0.imApp?.ensureFriendMessagesLoaded) {
            const scopeValue187 = await scopeValue0.imApp.ensureFriendMessagesLoaded(scopeValue182, {
              requireComplete: true
            });
            scopeValue184 = {
              messages: scopeValue187,
              totalCount: scopeValue187.length
            };
          } else throw new Error("Complete chat history reader is unavailable");
        }
        if (scopeValue183 !== scopeValue106 || String(scopeValue182.id) !== scopeValue100) return false;
        const scopeValue185 = Array.isArray(scopeValue184?.messages) ? scopeValue184.messages : [],
          scopeValue186 = new Array(scopeValue185.length);
        scopeValue105 = "indexing";
        scopeValue123();
        for (let scopeValue188 = 0; scopeValue188 < scopeValue185.length; scopeValue188 += scopeValue110) {
          if (scopeValue183 !== scopeValue106) return false;
          const scopeValue189 = Math.min(scopeValue185.length, scopeValue188 + scopeValue110);
          for (let scopeValue190 = scopeValue188; scopeValue190 < scopeValue189; scopeValue190 += 1) {
            const scopeValue191 = scopeValue185[scopeValue190],
              scopeValue192 = scopeValue7(scopeValue191, scopeValue182);
            if (scopeValue192) scopeValue186[scopeValue190] = {
              message: scopeValue191,
              text: scopeValue192,
              lowerText: scopeValue192.toLocaleLowerCase(),
              typeLabel: scopeValue8(scopeValue191)
            };
          }
          if (scopeValue189 < scopeValue185.length) await scopeValue118();
        }
        if (scopeValue183 !== scopeValue106) return false;
        return scopeValue101 = scopeValue186, scopeValue105 = "ready", scopeValue96.disabled = false, scopeValue0.imApp?.repairFriendMessageCount?.(scopeValue182, scopeValue184?.totalCount), scopeValue123(), scopeValue0.setTimeout(() => {
          if (scopeValue183 === scopeValue106) scopeValue96.focus({
            preventScroll: true
          });
        }, 0), true;
      } catch (scopeValue193) {
        if (scopeValue183 !== scopeValue106) return false;
        return console.error("Failed to load complete chat search index", scopeValue193), scopeValue105 = "error", scopeValue96.disabled = true, scopeValue123(), false;
      }
    }
    function scopeValue125(scopeValue194) {
      const scopeValue195 = scopeValue194?.id,
        scopeValue196 = scopeValue195 == null ? null : scopeValue0.imApp?.getFriendById?.(scopeValue195) || (scopeValue0.imData?.friends || []).find(scopeValue197 => String(scopeValue197.id) === String(scopeValue195));
      if (!scopeValue196 || scopeValue196.type === "npc" || scopeValue196.type === "official") return false;
      scopeValue113();
      scopeValue100 = String(scopeValue196.id);
      scopeValue95.textContent = scopeValue196.type === "group" ? "搜索 " + (scopeValue196.nickname || scopeValue196.realName || "群聊") + " 的聊天记录" : "搜索与 " + (scopeValue196.nickname || scopeValue196.realName || "Char") + " 的聊天";
      if (scopeValue0.openView) scopeValue0.openView(scopeValue93);else scopeValue93.classList.add("active");
      return void scopeValue124(), true;
    }
    scopeValue2.openChatHistorySearch = scopeValue125;
    scopeValue92.addEventListener("click", () => {
      const scopeValue198 = scopeValue0.imData?.currentSettingsFriend;
      if (!scopeValue198 || scopeValue198.type === "group" || scopeValue198.type === "npc" || scopeValue198.type === "official") return;
      scopeValue125(scopeValue198);
    });
    scopeValue94.addEventListener("click", scopeValue114);
    scopeValue96.addEventListener("input", () => {
      if (!scopeValue109) scopeValue123();
    });
    scopeValue96.addEventListener("compositionstart", () => {
      scopeValue109 = true;
    });
    scopeValue96.addEventListener("compositionend", () => {
      scopeValue109 = false;
      scopeValue123();
    });
    scopeValue96.addEventListener("keydown", scopeValue199 => {
      if (scopeValue199.key !== "Enter" && scopeValue199.key !== "NumpadEnter" && scopeValue199.key !== "Search") return;
      if (scopeValue109 || scopeValue199.isComposing || scopeValue199.keyCode === 229) return;
      scopeValue199.preventDefault();
      scopeValue96.blur();
      if (scopeValue105 === "error") void scopeValue124();else scopeValue123({
        immediate: true
      });
    });
    scopeValue96.addEventListener("search", () => {
      if (scopeValue109) return;
      if (scopeValue96.value.trim()) scopeValue96.blur();
      if (scopeValue105 === "error") void scopeValue124();else scopeValue123({
        immediate: true
      });
    });
    scopeValue99.addEventListener("click", scopeValue121);
    scopeValue97.addEventListener("click", () => {
      if (scopeValue105 === "error") void scopeValue124();
    });
  });
})(typeof window !== "undefined" ? window : globalThis);
