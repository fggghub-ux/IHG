(function () {
  "use strict";

  const localValue1 = Object.freeze({
      "online": "线上",
      "voice": "语音",
      "offline": "线下",
      "file": "文件",
      "status": "状态栏"
    }),
    localValue2 = new Map(),
    localValue3 = new Map();
  const displayTimeFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true
  });
  function formatTime(value) {
    return Number(value) ? displayTimeFormatter.format(new Date(Number(value))) : "";
  }
  let localValue4 = null;
  function localValue5() {
    localValue3.clear(), localValue4 = null;
  }
  const localValue6 = localValue34 => JSON.parse(JSON.stringify(localValue34)),
    localValue7 = () => window.crypto?.["randomUUID"]?.() || Date.now() + "_" + Math.random().toString(36).slice(2),
    localValue8 = localValue35 => String(localValue35?.["nickname"] || localValue35?.["realName"] || localValue35?.["name"] || "聊天");
  function localValue9(localValue36 = {}) {
    return {
      "schemaVersion": 1,
      "entries": (Array.isArray(localValue36?.["entries"]) ? localValue36.entries : []).filter(localValue37 => localValue37?.["id"] && localValue37.conversation?.["id"] && localValue1[localValue37.category]),
      "lastConversationId": String(localValue36?.["lastConversationId"] || ""),
      "activeCategory": localValue1[localValue36?.["activeCategory"]] ? localValue36.activeCategory : "online"
    };
  }
  function localValue10() {
    return localValue9(window.appStorage?.["readDomain"]?.("treasure", {}));
  }
  async function localValue11() {
    if (!window.appStorage) throw new Error("收藏存储尚未加载，请刷新后重试");
    await window.appStorage.ready;
  }
  function localValue12(localValue38, localValue39, localValue40, localValue41 = "") {
    const localValue42 = localValue40.map(localValue43 => String(localValue43?.["id"] || "time:" + (localValue43?.["timestamp"] || ""))).sort();
    return JSON.stringify([String(localValue38.id), localValue39, localValue42, String(localValue41)]);
  }
  function localValue13(localValue44) {
    return localValue10().entries.find(localValue45 => localValue45.sourceKey === localValue44) || null;
  }
  function localValue14(localValue46, localValue47) {
    const localValue48 = String(localValue47 || "").trim().toLocaleLowerCase("zh-CN").split(/\s+/).filter(Boolean),
      localValue49 = localValue50 => {
        if (typeof localValue50 === "string" || typeof localValue50 === "number") return String(localValue50);
        if (!localValue50 || typeof localValue50 !== "object") return "";
        return Object.entries(localValue50).filter(([localValue51]) => !/^(?:id|sourceKey|reasoning|thought|tokens|statusPresentation)$|(?:AssetId|AssetIds|MemberId|speakerId|sourceMessageId)$/i.test(localValue51)).map(([, localValue52]) => localValue49(localValue52)).join(" ");
      };
    return localValue46.filter(localValue53 => {
      let localValue54 = localValue3.get(localValue53.id);
      return localValue54 === undefined && (localValue54 = localValue49([localValue53.messages, localValue53.speech, localValue1[localValue53.category], localValue53.conversation.name, formatTime(localValue53.createdAt), localValue53.messages.map(item => formatTime(item.message?.timestamp))]).toLocaleLowerCase("zh-CN"), localValue3.set(localValue53.id, localValue54)), localValue48.every(localValue55 => localValue54.includes(localValue55));
    });
  }
  function localValue15(localValue56 = true) {
    window.setAppState?.("treasure", localValue10(), {
      "save": false,
      "persisted": true
    }), localValue56 && (localValue5(), window.dispatchEvent(new CustomEvent("treasurechange")));
  }
  async function localValue16(localValue57, localValue58 = [], localValue59 = true) {
    await localValue11(), await window.appStorage.commitDomain("treasure", localValue60 => localValue57(localValue9(localValue60)), {
      "reason": "treasure",
      "assetRecords": localValue58
    }), localValue15(localValue59);
  }
  function localValue17(localValue61, localValue62) {
    let localValue63;
    if (localValue62.role === "user") localValue63 = window.imApp?.["getMessageUserIdentity"]?.(localValue61, localValue62) || window.userState || {};else {
      if (localValue61.type === "group") localValue63 = window.imChat?.["getGroupMessageSpeaker"]?.(localValue61, localValue62) || {};else localValue63 = localValue61;
    }
    return {
      "name": String(localValue63?.["name"] || localValue63?.["nickname"] || localValue63?.["realName"] || localValue62.speaker || localValue62.senderName || (localValue62.role === "user" ? "User" : localValue8(localValue61))),
      "avatarUrl": String(localValue63?.["avatarUrl"] || localValue63?.["avatar"] || localValue62.senderAvatarUrl || ""),
      "avatarAssetId": String(localValue63?.["avatarAssetId"] || localValue62.senderAvatarAssetId || "")
    };
  }
  function localValue18(localValue64, localValue65) {
    const localValue66 = new Map(localValue65.filter(Boolean).map(localValue68 => [String(localValue68.id || "time:" + localValue68.timestamp), localValue68])),
      localValue67 = [];
    for (const localValue69 of localValue64.messages || []) {
      const localValue70 = String(localValue69.id || "time:" + localValue69.timestamp);
      localValue66.has(localValue70) && (localValue67.push(localValue66.get(localValue70)), localValue66["delete"](localValue70));
    }
    return localValue67.concat([...localValue66.values()].sort((localValue71, localValue72) => (Number(localValue71.timestamp) || 0) - (Number(localValue72.timestamp) || 0)));
  }
  function localValue19(localValue73, localValue74) {
    const localValue75 = localValue74.map(localValue76 => (localValue73.messages || []).find(localValue77 => localValue76.id ? String(localValue77.id || "") === String(localValue76.id) : String(localValue77.timestamp || "") === String(localValue76.timestamp)));
    if (localValue75.some(localValue78 => !localValue78)) throw new Error("所选消息已变化，请重新选择");
    return localValue75;
  }
  async function localValue20(localValue79, localValue80 = false) {
    if (!localValue80 && window.u2ImageResources?.["readBlob"]) return window.u2ImageResources.readBlob(localValue79);
    const localValue81 = window.AbortController ? new window.AbortController() : null,
      localValue82 = localValue81 ? setTimeout(() => localValue81.abort(), 30000) : null;
    try {
      const localValue83 = await fetch(localValue79, localValue81 ? {
        "signal": localValue81.signal
      } : undefined);
      if (!localValue83.ok) throw new Error("无法读取收藏中的媒体");
      return await localValue83.blob();
    } finally {
      if (localValue82) clearTimeout(localValue82);
    }
  }
  function localValue21(localValue84) {
    const localValue85 = window.imApp?.["sanitizeHtmlTemplate"];
    if (!localValue85) throw new Error("状态栏组件尚未加载，请重试");
    const localValue86 = document.createElement("template");
    localValue86.innerHTML = localValue85(localValue84.html);
    const localValue87 = [],
      localValue88 = new Map(),
      localValue89 = "u2-treasure-media-" + localValue7() + "-",
      localValue90 = localValue93 => {
        const localValue94 = String(localValue93 || "").trim();
        if (!localValue94 || localValue94.startsWith("#")) return localValue94;
        let localValue95 = localValue94;
        if (!/^(?:https?:|data:|blob:)/i.test(localValue95)) try {
          localValue95 = new URL(localValue95, document.baseURI || window.location?.["href"]).href;
        } catch (localValue96) {
          if (!localValue95.startsWith("assets/")) throw new Error("状态栏图片地址不可用");
        }
        if (!localValue88.has(localValue95)) {
          const localValue97 = "" + localValue89 + localValue87.length + "__";
          localValue87.push({
            "token": localValue97,
            "url": localValue95,
            "resourceType": "status"
          }), localValue88.set(localValue95, localValue97);
        }
        return localValue88.get(localValue95);
      },
      localValue91 = localValue98 => String(localValue98 || "").replace(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/gi, (localValue99, localValue100, localValue101, localValue102) => "url(\"" + localValue90(localValue100 ?? localValue101 ?? localValue102) + "\")");
    localValue86.content.querySelectorAll("*").forEach(localValue103 => {
      for (const localValue104 of ["src", "poster"]) if (localValue103.hasAttribute(localValue104)) localValue103.setAttribute(localValue104, localValue90(localValue103.getAttribute(localValue104)));
      if (localValue103.localName === "image") for (const localValue105 of ["href", "xlink:href"]) {
        if (localValue103.hasAttribute(localValue105)) localValue103.setAttribute(localValue105, localValue90(localValue103.getAttribute(localValue105)));
      }
      localValue103.hasAttribute("srcset") && localValue103.setAttribute("srcset", localValue103.getAttribute("srcset").replace(/(data:[^\s]+|[^\s,]+)(\s+[\d.]+[wx])?/g, (localValue106, localValue107, localValue108 = "") => "" + localValue90(localValue107.replace(/,$/, "")) + localValue108 + (localValue107.endsWith(",") ? "," : "")));
      if (localValue103.hasAttribute("style")) localValue103.setAttribute("style", localValue91(localValue103.getAttribute("style")));
    });
    const localValue92 = document.createElement("div");
    localValue92.appendChild(localValue86.content), localValue84.html = localValue92.innerHTML, localValue84.css = localValue91(localValue84.css), localValue84.resources = localValue87;
  }
  async function localValue22(localValue109, localValue110, localValue111, localValue112 = {}) {
    const localValue113 = "treasure_" + localValue7(),
      localValue114 = {
        "id": localValue113,
        "sourceKey": localValue12(localValue109, localValue111, localValue110, localValue112.detail),
        "category": localValue111,
        "createdAt": Date.now(),
        "conversation": {
          "id": String(localValue109.id),
          "type": localValue109.type === "group" ? "group" : "char",
          "name": localValue8(localValue109),
          "avatarUrl": localValue109.avatarUrl || "",
          "avatarAssetId": localValue109.avatarAssetId || ""
        },
        "messages": localValue110.map(localValue121 => ({
          "message": localValue6(localValue121),
          "sender": localValue17(localValue109, localValue121)
        }))
      };
    if (localValue112.speech) localValue114.speech = localValue6(localValue112.speech);
    const localValue115 = [],
      localValue116 = new Map(),
      localValue117 = (localValue122, localValue123) => {
        if (!(localValue123 instanceof Blob)) throw new Error("原始媒体已丢失，无法完整收藏");
        const localValue124 = localValue113 + "_" + localValue115.length;
        return localValue115.push({
          "id": localValue124,
          "blob": localValue123,
          "mimeType": localValue123.type,
          "ownerType": "treasure",
          "ownerId": localValue113
        }), localValue116.set(localValue122, localValue124), localValue124;
      };
    async function localValue118(localValue125, localValue126) {
      if (localValue116.has(localValue125)) return localValue116.get(localValue125);
      const localValue127 = await window.appStorage.getAssetBlob(localValue125);
      if (!localValue127) {
        if (localValue126) return "";
        throw new Error("原始媒体已丢失，无法完整收藏");
      }
      return localValue117(localValue125, localValue127);
    }
    async function localValue119(localValue128, localValue129, localValue130 = false) {
      if (localValue116.has(localValue128)) return localValue116.get(localValue128);
      const localValue131 = localValue130 && /^(?:capacitor|ionic|file):/i.test(localValue128);
      if (!/^(https?:|data:|blob:|assets\/)/i.test(localValue128) && !localValue131) {
        if (localValue129) return "";
        throw new Error("媒体地址不可用");
      }
      try {
        return localValue117(localValue128, await localValue20(localValue128, localValue130));
      } catch (localValue132) {
        if (localValue129) return "";
        throw new Error("媒体读取失败，请重试后再收藏");
      }
    }
    async function localValue120(localValue133) {
      if (!localValue133 || typeof localValue133 !== "object") return;
      for (const [localValue135, localValue136] of Object.entries(localValue133)) {
        if ((localValue135 === "assetId" || localValue135.endsWith("AssetId")) && typeof localValue136 === "string" && localValue136) localValue133[localValue135] = await localValue118(localValue136, /avatar/i.test(localValue135));else {
          if (localValue135.endsWith("AssetIds") && localValue136 && typeof localValue136 === "object") {
            for (const localValue137 of Object.keys(localValue136)) if (localValue136[localValue137]) localValue136[localValue137] = await localValue118(localValue136[localValue137], false);
          } else {
            if (localValue136 && typeof localValue136 === "object") await localValue120(localValue136);
          }
        }
      }
      const localValue134 = [["avatarUrl", "avatarAssetId"], ["senderAvatarUrl", "senderAvatarAssetId"], ["imageUrl", "imageAssetId"], ["stickerUrl", "stickerAssetId"], ["coverImage", "coverAssetId"], ["coverImageUrl", "coverImageAssetId"], ["img", "imageAssetId"], ["image", "imageAssetId"]];
      for (const localValue138 of Object.keys(localValue133)) if (/(?:Avatar|Image|Cover)Url$/.test(localValue138) && !localValue134.some(localValue139 => localValue139[0] === localValue138)) localValue134.push([localValue138, localValue138.replace(/Url$/, "AssetId")]);
      if (localValue133.type === "image" || localValue133.type === "sticker") localValue134.push(["content", localValue133.type === "image" ? "contentAssetId" : "stickerAssetId"]);
      if ("url" in localValue133) localValue134.push(["url", "assetId"]);
      for (const [localValue140, localValue141] of localValue134) {
        const localValue142 = localValue133[localValue140];
        if (!localValue142 || typeof localValue142 !== "string") continue;
        const localValue143 = /avatar|cover/i.test(localValue140);
        if (!localValue133[localValue141]) localValue133[localValue141] = await localValue119(localValue142, localValue143, localValue133.resourceType === "status");
        localValue133[localValue140] = "";
      }
    }
    for (const localValue144 of localValue114.messages) {
      const localValue145 = localValue144.message;
      if (localValue111 === "status" && localValue145.statusPresentation) localValue21(localValue145.statusPresentation);
      if (localValue145.type === "moment_forward") try {
        localValue145.treasureMoment = JSON.parse(localValue145.content);
      } catch (localValue146) {}
      if (localValue145.fileData && !localValue145.fileData.assetId) {
        const localValue147 = new Blob([localValue145.fileData.text || ""], {
            "type": localValue145.fileData.mimeType || "text/plain"
          }),
          localValue148 = "composed:" + localValue115.length;
        localValue145.fileData.assetId = localValue148, localValue116.set(localValue148, localValue117(localValue148, localValue147));
      }
    }
    await localValue120(localValue114);
    for (const localValue149 of localValue114.messages) {
      if (localValue149.message.fileData) localValue149.message.fileData.source = "upload";
      if (localValue149.message.treasureMoment) localValue149.message.content = JSON.stringify(localValue149.message.treasureMoment);
    }
    return {
      "entry": localValue114,
      "assets": localValue115
    };
  }
  async function localValue23(localValue150, localValue151, localValue152 = "online", localValue153 = {}) {
    if (!localValue150?.["id"] || !localValue1[localValue152]) throw new Error("无法确定收藏来源");
    const localValue154 = localValue18(localValue150, localValue151);
    if (!localValue154.length) throw new Error("请选择要收藏的消息");
    const localValue155 = localValue12(localValue150, localValue152, localValue154, localValue153.detail);
    if (localValue2.has(localValue155)) return localValue2.get(localValue155);
    const localValue156 = (async () => {
      await localValue11();
      const localValue157 = localValue13(localValue155);
      if (localValue157) return {
        "entry": localValue157,
        "duplicate": true
      };
      const localValue158 = {
          "id": localValue150.id,
          "type": localValue150.type,
          "nickname": localValue8(localValue150),
          "avatarUrl": localValue150.avatarUrl,
          "avatarAssetId": localValue150.avatarAssetId
        },
        localValue159 = localValue154.map(localValue162 => ({
          ...localValue6(localValue162),
          "treasureSender": localValue17(localValue150, localValue162)
        }));
      if (localValue153.prepareAudio) {
        const localValue163 = await localValue153.prepareAudio();
        if (!localValue163?.["assetId"] || !(localValue163.blob instanceof Blob)) throw new Error("语音保存失败，请重试");
        if (!localValue153.speech && String(localValue154[0].transcript || localValue154[0].text || "") !== String(localValue159[0].transcript || localValue159[0].text || "")) throw new Error("语音文字已变化，请重新收藏");
        localValue159[0].ttsAudioAssetId = localValue163.assetId, localValue159[0].ttsAudioText = localValue153.speech?.["text"] || localValue159[0].transcript || localValue159[0].text || "";
        if (localValue153.speech) localValue159[0].ttsAudioAssets = [];
      }
      const localValue160 = await localValue22(localValue158, localValue159, localValue152, localValue153);
      for (let localValue164 = 0; localValue164 < localValue160.entry.messages.length; localValue164++) {
        const localValue165 = localValue160.entry.messages[localValue164];
        localValue165.sender = localValue165.message.treasureSender, delete localValue165.message.treasureSender;
      }
      let localValue161 = localValue160.entry;
      return await localValue16(localValue166 => {
        const localValue167 = localValue166.entries.find(localValue168 => localValue168.sourceKey === localValue155);
        if (localValue167) return localValue161 = localValue167, localValue166;
        return localValue166.entries.unshift(localValue160.entry), localValue166;
      }, localValue160.assets), {
        "entry": localValue161,
        "duplicate": localValue161.id !== localValue160.entry.id
      };
    })();
    localValue2.set(localValue155, localValue156);
    try {
      return await localValue156;
    } finally {
      if (localValue2.get(localValue155) === localValue156) localValue2["delete"](localValue155);
    }
  }
  async function localValue24(localValue169) {
    const localValue170 = new Set(localValue169.map(String));
    let localValue171 = [];
    await localValue16(localValue172 => {
      return localValue171 = localValue172.entries.filter(localValue173 => localValue170.has(localValue173.id)), localValue172.entries = localValue172.entries.filter(localValue174 => !localValue170.has(localValue174.id)), localValue172;
    });
    try {
      await window.appStorage.releaseAssetsFromDeletedRecords(localValue171);
    } catch (localValue175) {
      console.warn("[Treasure] Deferred asset cleanup", localValue175);
    }
    return localValue171.length;
  }
  async function localValue25(localValue176, localValue177, localValue178, localValue179 = {}) {
    await localValue11();
    const localValue180 = localValue12(localValue176, localValue178, [localValue177], localValue179.detail);
    if (localValue2.has(localValue180)) return localValue2.get(localValue180);
    const localValue181 = localValue13(localValue180);
    if (!localValue181) return localValue23(localValue176, [localValue177], localValue178, localValue179);
    const localValue182 = localValue24([localValue181.id]).then(() => ({
      "removed": true
    }));
    localValue2.set(localValue180, localValue182);
    try {
      return await localValue182;
    } finally {
      if (localValue2.get(localValue180) === localValue182) localValue2["delete"](localValue180);
    }
  }
  function localValue26(localValue183, localValue184, localValue185, localValue186 = "") {
    if (!localValue183?.["id"]) return false;
    if (!localValue4) localValue4 = new Set(localValue10().entries.map(localValue187 => localValue187.sourceKey));
    return localValue4.has(localValue12(localValue183, localValue185, [localValue184], localValue186));
  }
  function localValue27(localValue188, localValue189, localValue190, localValue191, localValue192 = "") {
    if (!localValue188) return;
    const localValue193 = localValue26(localValue189, localValue190, localValue191, localValue192);
    localValue188.classList.toggle("is-saved", localValue193), localValue188.setAttribute("aria-pressed", String(localValue193)), localValue188.title = localValue193 ? "取消收藏" : "收藏到 Treasure", localValue188.setAttribute("aria-label", localValue188.title), localValue188.innerHTML = "<i class=\"" + (localValue193 ? "fas" : "far") + " fa-bookmark\" aria-hidden=\"true\"></i>";
  }
  function localValue28(localValue194) {
    return {
      "id": "status:" + (localValue194?.["id"] || ""),
      "type": "profile_status",
      "role": "assistant",
      "timestamp": localValue194?.["createdAt"] || null,
      "content": String(localValue194?.["thought"] || "")
    };
  }
  function localValue29(localValue195, localValue196) {
    return !!localValue196?.["id"] && localValue26(localValue195, localValue28(localValue196), "status");
  }
  function localValue30(localValue197, localValue198, localValue199) {
    localValue27(localValue197, localValue198, localValue28(localValue199), "status");
  }
  function localValue31(localValue200, localValue201, localValue202 = {}) {
    if (!localValue201?.["id"] || !localValue200?.["id"]) return Promise.reject(new Error("暂无可收藏的状态"));
    const localValue203 = {
        ...localValue28(localValue201),
        "statusSnapshot": localValue6(localValue201),
        "statusPresentation": {
          "html": String(localValue202.html || ""),
          "css": String(localValue202.css || ""),
          "cssActive": localValue202.cssActive === true
        }
      },
      localValue204 = {
        "id": localValue200.id,
        "type": localValue200.type,
        "nickname": localValue8(localValue200),
        "avatarUrl": localValue200.avatarUrl,
        "avatarAssetId": localValue200.avatarAssetId
      };
    return localValue25(localValue204, localValue203, "status");
  }
  function localValue32(localValue205, localValue206, localValue207, localValue208, localValue209 = {}) {
    if (!localValue205 || localValue205._treasureBound) return;
    localValue205._treasureBound = true;
    const localValue210 = () => localValue27(localValue205, localValue206, localValue207, localValue208, localValue209.detail);
    localValue210(), localValue205._treasureSync = localValue210, localValue205.addEventListener("click", async localValue211 => {
      localValue211.preventDefault(), localValue211.stopPropagation();
      if (localValue205.disabled || window.imData?.["batchSelectMode"]) return;
      localValue205.disabled = true, localValue205.setAttribute("aria-busy", "true"), localValue205.innerHTML = "<i class=\"fas fa-spinner fa-spin\" aria-hidden=\"true\"></i>";
      try {
        const localValue212 = await localValue25(localValue206, localValue207, localValue208, localValue209);
        window.showToast?.(localValue212.removed ? "已取消收藏" : "已收藏到 Treasure");
      } catch (localValue213) {
        window.showToast?.(localValue213.message || "收藏失败，请重试");
      } finally {
        localValue205.disabled = false, localValue205.setAttribute("aria-busy", "false"), localValue210();
      }
    });
  }
  function localValue33() {
    document.querySelectorAll("[data-treasure-button]").forEach(localValue214 => localValue214._treasureSync?.());
  }
  window.addEventListener("treasurechange", localValue33), window.addEventListener("u2-storage-ready", () => {
    localValue5(), localValue33();
  }), window.appStorage?.["subscribe"]?.(localValue215 => {
    const localValue216 = /import|restore|recovery|optimization-complete/.test(localValue215.reason || "");
    if (localValue215.commit?.["domain"] === "treasure" || localValue216) localValue5();
    if (localValue216) localValue33();
  }), window.treasureStore = Object.freeze({
    "categories": localValue1,
    "formatTime": formatTime,
    "normalize": localValue9,
    "state": localValue10,
    "ready": localValue11,
    "sourceKey": localValue12,
    "searchEntries": localValue14,
    "resetIndexes": localValue5,
    "orderedMessages": localValue18,
    "resolveMessages": localValue19,
    "save": localValue23,
    "toggle": localValue25,
    "remove": localValue24,
    "has": localValue26,
    "bindButton": localValue32,
    "syncButton": localValue27,
    "toggleStatus": localValue31,
    "hasStatus": localValue29,
    "syncStatusButton": localValue30,
    async "setUi"(localValue217, localValue218) {
      const localValue219 = localValue10();
      if (localValue219.lastConversationId === localValue217 && localValue219.activeCategory === localValue218) return;
      await localValue16(localValue220 => ({
        ...localValue220,
        "lastConversationId": localValue217,
        "activeCategory": localValue218
      }), [], false);
    }
  });
  window.imChat = window.imChat || {};
  window.imChat.bindTreasureMenuButton = function(button, resolveSource, category) {
    if (!button) return;
    button._treasureMenuSource = resolveSource;
    button.setAttribute('data-treasure-button', '');
    const sync = () => {
      const source = button._treasureMenuSource?.();
      window.treasureStore.syncButton(button, source?.friend, source?.message, category);
      let label = button.querySelector('span');
      if (!label) {
        label = document.createElement('span');
        button.prepend(label);
      }
      label.textContent = category === 'voice' ? 'Treasure' : 'Saved';
    };
    button._treasureSync = sync;
    sync();
    if (button._treasureMenuBound) return;
    button._treasureMenuBound = true;
    button.addEventListener('click', async event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (button._treasureSaving || window.imData?.batchSelectMode) return;
      const source = button._treasureMenuSource?.();
      if (!source?.friend || !source.message) return;
      if (category === 'voice') window.imChat.closeContextMenu();
      button._treasureSaving = true;
      button.setAttribute('aria-busy', 'true');
      try {
        const options = category === 'voice' && source.message.role === 'assistant'
            ? { prepareAudio: () => window.imVoiceMessageAudio.getOrCreate(source.friend, source.message) }
            : {};
        const result = await window.treasureStore.toggle(source.friend, source.message, category, options);
        window.showToast?.(result.removed ? '已取消收藏' : '已收藏到 Treasure');
      } catch (error) {
        window.showToast?.(error.message || '收藏失败，请重试');
      } finally {
        button._treasureSaving = false;
        button.setAttribute('aria-busy', 'false');
        sync();
      }
    });
  };
})();
