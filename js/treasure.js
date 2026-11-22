(function () {
  "use strict";

  const localValue1 = window.treasureStore;
  if (!localValue1) return;
  const localValue2 = 20,
    localValue3 = localValue48 => String(localValue48 ?? "").replace(/[&<>"']/g, localValue49 => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    })[localValue49]),
    localValue4 = localValue50 => document.getElementById("treasure-" + localValue50),
    localValue5 = localValue1.formatTime;
  let localValue6 = "",
    localValue7 = "online",
    localValue8 = [],
    localValue9 = false,
    localValue10 = new Set(),
    localValue11 = 0,
    localValue12 = [],
    localValue13 = [],
    localValue14 = [],
    localValue15 = null,
    localValue16 = false,
    localValue17 = false,
    localValue18 = "",
    localValue19 = 0,
    localValue20 = "",
    localValue21 = null,
    localValue22 = false,
    localValue23 = 0;
  function localValue24(localValue52, {
    focus = false,
    restore = false
  } = {}) {
    localValue22 = localValue52;
    const localValue53 = localValue4("category-menu"),
      localValue54 = localValue4("category-button");
    localValue53.classList.toggle("is-open", localValue52), localValue53.inert = !localValue52, localValue53.toggleAttribute("inert", !localValue52), localValue53.setAttribute("aria-hidden", String(!localValue52)), localValue54.setAttribute("aria-expanded", String(localValue52)), localValue54.setAttribute("aria-label", localValue52 ? "收起收藏分类" : "展开收藏分类"), localValue4("menu-backdrop").hidden = !localValue52;
    if (focus && localValue52) (localValue53.querySelector("[aria-checked=\"true\"]") || localValue53.querySelector("button"))?.["focus"]();
    if (restore) localValue54.focus();
  }
  function localValue25(localValue55 = localValue1.state()) {
    const localValue56 = new Map(localValue8.filter(localValue57 => ["char", "friend", "group"].includes(localValue57.type)).map(localValue58 => [String(localValue58.id), {
      "id": String(localValue58.id),
      "type": localValue58.type === "group" ? "group" : "char",
      "name": localValue58.nickname || localValue58.realName || localValue58.name || "聊天",
      "avatarUrl": localValue58.avatarUrl || ""
    }]));
    for (const localValue59 of localValue55.entries) if (!localValue56.has(localValue59.conversation.id)) localValue56.set(localValue59.conversation.id, {
      ...localValue59.conversation,
      "deleted": true
    });
    return [...localValue56.values()];
  }
  function localValue26(localValue60) {
    return "<span class=\"treasure-avatar\">" + (localValue60?.["avatarUrl"] || localValue60?.["avatarAssetId"] ? "<img " + (localValue60.avatarUrl ? "src=\"" + localValue3(localValue60.avatarUrl) + "\"" : "") + " " + (localValue60.avatarAssetId ? "data-treasure-asset-id=\"" + localValue3(localValue60.avatarAssetId) + "\"" : "") + " alt=\"\" loading=\"lazy\">" : localValue3(String(localValue60?.["name"] || "?").slice(0, 1))) + "</span>";
  }
  async function localValue27(localValue61) {
    if (!localValue61 || typeof localValue61 !== "object") return;
    const localValue62 = [["avatarAssetId", "avatarUrl"], ["senderAvatarAssetId", "senderAvatarUrl"], ["imageAssetId", "imageUrl"], ["contentAssetId", "content"], ["stickerAssetId", "stickerUrl"], ["coverAssetId", "coverImage"], ["coverImageAssetId", "coverImageUrl"], ["ttsAudioAssetId", "treasureAudioUrl"], ["assetId", "url"]];
    await Promise.all(localValue62.map(async ([localValue63, localValue64]) => {
      if (localValue61[localValue63]) localValue61[localValue64] = (await window.appStorage.getAssetUrl(localValue61[localValue63])) || "";
    })), await Promise.all(Object.values(localValue61).filter(localValue65 => localValue65 && typeof localValue65 === "object").map(localValue27));
  }
  function localValue28() {
    localValue21?.["disconnect"]();
    const localValue66 = localValue68 => {
        const localValue69 = localValue68.dataset.treasureAssetId;
        if (!localValue68.isConnected || !localValue69 || localValue68._treasureLoading || localValue68.tagName === "AUDIO" && localValue68.paused === false) return;
        localValue68._treasureLoading = true, window.appStorage.getAssetUrl(localValue69).then(localValue70 => {
          if (localValue70 && localValue68.isConnected && localValue68.dataset.treasureAssetId === localValue69 && localValue68.getAttribute("src") !== localValue70) localValue68.setAttribute("src", localValue70);
        })["catch"](() => {
          localValue68.title = "媒体读取失败，请重新打开收藏";
        })["finally"](() => {
          localValue68._treasureLoading = false;
        });
      },
      localValue67 = [...localValue4("list").querySelectorAll("[data-treasure-asset-id]")];
    if (window.IntersectionObserver) localValue21 = new window.IntersectionObserver(localValue71 => {
      localValue71.filter(localValue72 => localValue72.isIntersecting).forEach(localValue73 => localValue66(localValue73.target));
    }, {
      "root": localValue4("view").querySelector(".treasure-scroll"),
      "rootMargin": "180px"
    }), localValue67.forEach(localValue74 => localValue21.observe(localValue74));else localValue67.forEach(localValue66);
  }
  const localValue29 = localValue75 => localValue75 ? "<p>" + localValue3(localValue75) + "</p>" : "";
  function localValue30(localValue76, localValue77 = "", localValue78 = false, localValue79 = "") {
    return localValue76 || localValue79 ? "<img class=\"treasure-media" + (localValue78 ? " is-sticker" : "") + "\" " + (localValue76 ? "src=\"" + localValue3(localValue76) + "\"" : "") + " " + (localValue79 ? "data-treasure-asset-id=\"" + localValue3(localValue79) + "\"" : "") + " alt=\"" + localValue3(localValue77 || "收藏的图片") + "\" loading=\"lazy\" data-treasure-image>" : "";
  }
  function localValue31(localValue80, localValue81) {
    return "<small><i class=\"fas fa-wave-square\" aria-hidden=\"true\"></i> " + localValue3(localValue81?.["speech"]?.["speakerName"] || "语音") + (localValue80.duration ? " · " + localValue3(localValue80.duration) + "s" : "") + "</small>" + localValue29(localValue80.transcript || localValue80.text || "") + (localValue80.ttsAudioAssetId ? "<audio controls preload=\"none\" data-treasure-asset-id=\"" + localValue3(localValue80.ttsAudioAssetId) + "\" aria-label=\"收藏的语音\"></audio><button type=\"button\" class=\"treasure-file-open\" data-treasure-audio-download><i class=\"fas fa-download\" aria-hidden=\"true\"></i><span>下载语音</span></button>" : "<small>暂无音频</small>");
  }
  function localValue32(localValue82, localValue83, localValue84) {
    return (localValue82.record?.["entries"] || []).map(localValue85 => "<div class=\"treasure-subrecord\"><strong>" + localValue3(localValue85.senderName || "聊天记录") + " · " + localValue3(localValue5(localValue85.timestamp)) + "</strong>" + localValue33({
      ...localValue85,
      "content": localValue85.imageUrl || localValue85.text,
      "transcript": localValue85.text,
      "type": localValue85.type,
      "fakeLinkData": localValue85.link
    }, localValue83, localValue84) + "</div>").join("");
  }
  function localValue33(localValue86, localValue87, localValue88) {
    const localValue89 = localValue86.type;
    if (localValue89 === "file" && localValue86.fileData) {
      const localValue90 = localValue88.push(localValue86) - 1;
      return '<button type="button" class="im-file-card treasure-file-open" data-treasure-file="' + localValue90 + '">' + window.imChat.buildFileCardHtml(localValue86) + '</button>';
    }
    if (localValue89 === "voice_message") return localValue31(localValue86, localValue87);
    if (localValue89 === "image") return localValue30(localValue86.content || localValue86.imageUrl, localValue86.description || localValue86.text, false, localValue86.contentAssetId || localValue86.imageAssetId) + (localValue86.albumImages || []).map(localValue91 => localValue30(localValue91.url, localValue91.fileName, false, localValue91.assetId)).join("") + localValue29(localValue86.description || localValue86.text);
    if (localValue89 === "sticker") return localValue30(localValue86.stickerUrl || localValue86.content, localValue86.stickerName, true, localValue86.stickerAssetId) + localValue29(localValue86.stickerName || localValue86.text);
    if (localValue89 === "chat_record_forward") return "<small>" + localValue3(localValue86.record?.["title"] || "聊天记录") + "</small>" + localValue32(localValue86, localValue87, localValue88);
    if (localValue89 === "location") return "<small>位置</small>" + localValue29(localValue86.locationName || localValue86.name || "共享位置") + localValue29(localValue86.locationAddress || localValue86.address) + localValue29(localValue86.locationNameTranslation) + localValue29(localValue86.locationAddressTranslation);
    if (localValue89 === "fake_link") {
      const localValue92 = localValue86.fakeLinkData || {};
      return "<small>" + localValue3(localValue92.siteName || localValue92.domain || "链接") + "</small>" + localValue30(localValue92.coverImage || localValue92.coverImageUrl || localValue92.imageUrl || localValue92.image, "", false, localValue92.coverAssetId || localValue92.coverImageAssetId || localValue92.imageAssetId) + localValue29(localValue92.title || localValue86.content) + localValue29(localValue92.summary) + localValue29(localValue92.displayUrl || localValue92.canonicalUrl) + localValue29(localValue92.bodyText || localValue92.content || localValue92.body || localValue92.article);
    }
    if (localValue89 === "moment_forward") {
      let localValue93 = localValue86.treasureMoment || {};
      if (!localValue86.treasureMoment) try {
        localValue93 = JSON.parse(localValue86.content || "{}");
      } catch (localValue94) {}
      return "<small>朋友圈</small>" + localValue29(localValue93.text) + localValue30(localValue93.imageUrl || localValue93.img, localValue93.imgDesc, false, localValue93.imageAssetId);
    }
    if (localValue89 === "pay_transfer") return "<small>" + localValue3(localValue86.cardTitle || "转账") + "</small>" + localValue29("¥" + (Number(localValue86.amount) || 0).toFixed(2)) + localValue29(localValue86.description) + localValue29(localValue86.content) + localValue29(localValue86.status);
    if (localValue89 === "group_red_packet") return "<small>群红包</small>" + localValue29(localValue86.redPacketGreeting || localValue86.greeting || localValue86.content) + (localValue86.totalAmount || localValue86.amount ? localValue29("¥" + (localValue86.totalAmount || localValue86.amount)) : "") + localValue29(localValue86.description) + localValue29(localValue86.statusText);
    if (localValue89 === "group_poll") return "<small>群投票</small>" + localValue29(localValue86.pollQuestion || localValue86.pollTitle || localValue86.content) + (localValue86.pollOptions || []).map(localValue95 => localValue29((localValue95.text || "") + " · " + (localValue86.pollVotes || []).filter(localValue96 => String(localValue96.optionId) === String(localValue95.id)).length + " 票")).join("");
    if (localValue89 === "voice_call_record" || localValue89 === "offline_meeting_record") {
      const localValue97 = localValue86.messages || localValue86.callMessages || localValue86.meetingMessages || [];
      return "<small>" + (localValue89 === "offline_meeting_record" ? "线下见面记录" : localValue86.isVideo ? "视频通话" : "语音通话") + "</small>" + localValue29(localValue86.title) + localValue29(localValue86.content || localValue86.summary || localValue86.rawSummary || localValue86.text) + localValue29(localValue86.statusText || localValue86.dateText) + (localValue86.duration ? localValue29(localValue86.duration + "s") : "") + localValue97.map(localValue98 => "<div class=\"treasure-subrecord\"><strong>" + localValue3(localValue98.senderName || localValue98.speaker || (localValue98.role === "user" ? "User" : "Char")) + "</strong>" + localValue29(localValue98.content || localValue98.text) + "</div>").join("");
    }
    if (localValue89 === "contact_card") {
      const localValue99 = localValue86.contactCard || localValue86.contactCardData || {};
      return "<small>联系人</small>" + localValue29(localValue99.name || localValue99.nickname || localValue86.contactName || localValue86.name) + localValue29(localValue86.contactRealName) + localValue29(localValue99.bio || localValue99.description || localValue86.contactSignature || localValue86.description) + localValue29(localValue86.content);
    }
    if (localValue89 === "together_listening_invite") return "<small>一起听歌</small>" + localValue29(localValue86.title || localValue86.songName) + localValue29(localValue86.artist || localValue86.artistName || localValue86.description) + localValue29(localValue86.content);
    return localValue30(localValue86.imageUrl, "", false, localValue86.imageAssetId) + localValue29(localValue86.content || localValue86.text || localValue86.description || window.imApp?.["getFriendMessagePreview"]?.(localValue86) || "消息");
  }
  function localValue34(localValue100, localValue101) {
    if (localValue100.category === "status") {
      const localValue102 = localValue100.messages[0]?.["message"] || {};
      return "<article class=\"treasure-card treasure-status-card" + (localValue10.has(localValue100.id) ? " is-selected" : "") + "\" data-treasure-entry=\"" + localValue3(localValue100.id) + "\">\n                <header class=\"treasure-card-head\">" + (localValue9 ? "<input type=\"checkbox\" class=\"treasure-card-select\" aria-label=\"选择这条收藏\" " + (localValue10.has(localValue100.id) ? "checked" : "") + ">" : "") + "<span>" + (localValue17 ? "状态栏 · " : "") + localValue3(localValue5(localValue100.createdAt)) + " 收藏</span>" + (localValue9 ? "" : "<button type=\"button\" data-treasure-delete aria-label=\"删除这条收藏\"><i class=\"far fa-trash-can\" aria-hidden=\"true\"></i></button>") + "</header>\n                <button type=\"button\" class=\"treasure-status-open\" data-treasure-status-detail aria-label=\"查看收藏的状态栏\"><time>" + localValue3(localValue5(localValue102.timestamp) || "时间未记录") + "</time><p class=\"treasure-status-excerpt\">" + localValue3(localValue102.content) + "</p></button></article>";
    }
    if (localValue100.category === "offline") return "<article class=\"treasure-card treasure-offline-card" + (localValue10.has(localValue100.id) ? " is-selected" : "") + "\" data-treasure-entry=\"" + localValue3(localValue100.id) + "\">" + (localValue9 ? "<input type=\"checkbox\" class=\"treasure-card-select\" aria-label=\"选择这条收藏\" " + (localValue10.has(localValue100.id) ? "checked" : "") + ">" : "") + "<button type=\"button\" class=\"treasure-offline-open\" data-treasure-offline-detail aria-label=\"查看 " + localValue3(localValue5(localValue100.messages[0]?.["message"]["timestamp"] || localValue100.createdAt)) + " 的线下收藏\"><time>" + localValue3(localValue5(localValue100.messages[0]?.["message"]["timestamp"] || localValue100.createdAt)) + "</time></button>" + (localValue9 ? "" : "<button type=\"button\" class=\"treasure-offline-delete\" data-treasure-delete aria-label=\"删除这条收藏\" title=\"删除收藏\"><i class=\"far fa-trash-can\" aria-hidden=\"true\"></i></button>") + "</article>";
    return "<article class=\"treasure-card im-chat-char" + (localValue10.has(localValue100.id) ? " is-selected" : "") + "\" data-treasure-entry=\"" + localValue3(localValue100.id) + "\">\n            <header class=\"treasure-card-head\">" + (localValue9 ? "<input type=\"checkbox\" class=\"treasure-card-select\" aria-label=\"选择这条收藏\" " + (localValue10.has(localValue100.id) ? "checked" : "") + ">" : "") + "\n                <span>" + (localValue17 ? localValue3(localValue1.categories[localValue100.category]) + " · " : "") + localValue3(localValue5(localValue100.createdAt)) + " 收藏" + (localValue100.messages.length > 1 ? " · " + localValue100.messages.length + " 条消息" : "") + "</span>\n                " + (localValue9 ? "" : "<button type=\"button\" data-treasure-delete aria-label=\"删除这条收藏\" title=\"删除收藏\"><i class=\"far fa-trash-can\" aria-hidden=\"true\"></i></button>") + "\n            </header>" + localValue100.messages.map(localValue103 => "<div class=\"treasure-message chat-row" + (localValue103.message.role === "user" ? " is-user user-row" : " ai-row") + "\">" + localValue26(localValue103.sender) + "<div class=\"treasure-message-body\"><div class=\"treasure-message-meta\"><strong>" + localValue3(localValue103.sender.name) + "</strong><time>" + localValue3(localValue5(localValue103.message.timestamp)) + ("</time></div><div class=\"" + (localValue103.message.type === 'file' ? 'treasure-file-content' : 'treasure-bubble chat-bubble ' + (localValue103.message.role === 'user' ? 'user-bubble' : 'ai-bubble')) + "\">") + localValue33(localValue103.message, localValue100, localValue101) + (localValue103.message.translation ? "<div class=\"treasure-translation\">" + localValue3(localValue103.message.translation) + "</div>" : "") + "</div></div></div>").join("") + "\n        </article>";
  }
  function localValue35() {
    localValue4("selected-count").textContent = "已选 " + localValue10.size + " 条", localValue4("delete-selected").disabled = !localValue10.size || localValue16, localValue4("select-all").textContent = localValue12.length && localValue12.every(localValue104 => localValue10.has(localValue104.id)) ? "取消本页全选" : "全选本页", localValue4("select-all").disabled = !localValue12.length, localValue4("list").querySelectorAll("[data-treasure-entry]").forEach(localValue105 => {
      const localValue106 = localValue10.has(localValue105.dataset.treasureEntry);
      localValue105.classList.toggle("is-selected", localValue106);
      const localValue107 = localValue105.querySelector("input");
      if (localValue107) localValue107.checked = localValue106;
    });
  }
  async function localValue36() {
    if (!localValue4("view")?.["classList"]["contains"]("active")) return;
    const localValue108 = ++localValue11,
      localValue109 = localValue1.state(),
      localValue110 = localValue25(localValue109);
    if (!localValue110.some(localValue119 => localValue119.id === localValue6)) localValue6 = localValue110[0]?.["id"] || "";
    const localValue111 = localValue110.find(localValue120 => localValue120.id === localValue6);
    localValue4("current-name").textContent = localValue111?.["name"] || "选择会话", localValue4("current-avatar").innerHTML = localValue111?.["avatarUrl"] ? "<img src=\"" + localValue3(localValue111.avatarUrl) + "\" alt=\"\">" : localValue3((localValue111?.["name"] || "?").slice(0, 1));
    let localValue112 = localValue109.entries.filter(localValue121 => localValue121.conversation.id === localValue6 && (localValue17 || localValue121.category === localValue7)).sort((localValue122, localValue123) => localValue123.createdAt - localValue122.createdAt);
    if (localValue17) localValue112 = localValue18.trim() ? localValue1.searchEntries(localValue112, localValue18) : [];
    const localValue113 = Math.max(1, Math.ceil(localValue112.length / localValue2)),
      localValue114 = localValue19;
    localValue19 = Math.max(0, Math.min(localValue19, localValue113 - 1));
    if (localValue19 !== localValue114) localValue4("view").querySelector(".treasure-scroll").scrollTop = 0;
    const localValue115 = JSON.stringify([localValue6, localValue7, localValue17, localValue18, localValue9, localValue19, localValue112.map(localValue124 => localValue124.id)]);
    if (localValue115 === localValue20) return;
    localValue20 = localValue115, localValue43();
    const localValue116 = new Set(localValue112.map(localValue125 => localValue125.id));
    localValue10 = new Set([...localValue10].filter(localValue126 => localValue116.has(localValue126))), localValue4("summary").textContent = localValue17 ? "全部分类 · " + localValue112.length + " 条搜索结果" : localValue1.categories[localValue7] + " · " + localValue112.length + " 条收藏", localValue4("search-panel").hidden = !localValue17, localValue4("search-button").setAttribute("aria-pressed", String(localValue17)), localValue4("search-clear").hidden = !localValue18, localValue4("management").hidden = !localValue9, localValue4("manage").setAttribute("aria-pressed", String(localValue9)), localValue4("manage").innerHTML = "<i class=\"" + (localValue9 ? "fas fa-xmark" : "far fa-circle-check") + "\" aria-hidden=\"true\"></i>", localValue4("manage").setAttribute("aria-label", localValue9 ? "退出多选" : "多选收藏"), localValue4("clear").hidden = localValue17 || !localValue112.length, localValue4("view").querySelectorAll("[data-treasure-category]").forEach(localValue127 => localValue127.setAttribute("aria-checked", String(!localValue17 && localValue127.dataset.treasureCategory === localValue7)));
    const localValue117 = localValue112.slice(localValue19 * localValue2, (localValue19 + 1) * localValue2);
    if (localValue108 !== localValue11) return;
    localValue13 = localValue112, localValue12 = localValue117;
    const localValue118 = [];
    localValue4("list").innerHTML = localValue117.length ? localValue117.map(localValue128 => localValue34(localValue128, localValue118)).join("") : "<div class=\"treasure-empty\"><i class=\"" + (localValue17 ? "fas fa-magnifying-glass" : "far fa-bookmark") + "\" aria-hidden=\"true\"></i><span>" + (localValue17 ? localValue18.trim() ? "没有找到相关收藏" : "输入关键词搜索收藏" : "暂无收藏") + "</span></div>", localValue4("pagination").hidden = localValue113 <= 1, localValue4("page-status").textContent = "第 " + (localValue19 + 1) + " / " + localValue113 + " 页", localValue4("page-previous").disabled = localValue19 === 0, localValue4("page-next").disabled = localValue19 === localValue113 - 1, localValue28(), localValue4("list").querySelectorAll("[data-treasure-file]").forEach(localValue129 => localValue129.addEventListener("click", () => {
      if (localValue9) return;
      const localValue130 = localValue117.find(localValue131 => localValue131.id === localValue129.closest("[data-treasure-entry]").dataset.treasureEntry);
      const message = localValue118[Number(localValue129.dataset.treasureFile)];
      if (!localValue130 || !message) return;
      closeFileReader?.();
      closeFileReader = window.imChat.openFileDetail(message, {
        container: localValue4("view"),
        "treasureEntryId": localValue130.category === "file" ? localValue130.id : null
      });
    })), localValue4("list").querySelectorAll("[data-treasure-audio-download]").forEach(localValue132 => localValue132.addEventListener("click", async () => {
      const localValue133 = localValue132.closest("[data-treasure-entry]"),
        localValue134 = localValue117.find(localValue137 => localValue137.id === localValue133.dataset.treasureEntry),
        localValue135 = [...localValue133.querySelectorAll(".treasure-message")].indexOf(localValue132.closest(".treasure-message")),
        localValue136 = localValue134?.["messages"][localValue135]?.["message"];
      if (!localValue136?.["ttsAudioAssetId"] || localValue132.disabled || localValue9) return;
      localValue132.disabled = true;
      try {
        const localValue138 = await window.appStorage.getAssetBlob(localValue136.ttsAudioAssetId);
        if (!localValue138) throw new Error("音频无法读取");
        const localValue139 = /wav/.test(localValue138.type) ? "wav" : /ogg/.test(localValue138.type) ? "ogg" : /mp4/.test(localValue138.type) ? "m4a" : /webm/.test(localValue138.type) ? "webm" : "mp3",
          localValue140 = await window.u2ExportFile({
            "blob": localValue138,
            "fileName": "treasure-" + localValue134.id + "." + localValue139,
            "title": "Treasure 语音"
          });
        if (localValue140 === "failed" || localValue140 === false) throw new Error("语音下载失败");
      } catch (localValue141) {
        window.showToast?.(localValue141.message);
      } finally {
        localValue132.disabled = false;
      }
    })), localValue35();
  }
  function localValue37(localValue142) {
    localValue24(false), localValue15 = document.activeElement, localValue4(localValue142).hidden = false, localValue4(localValue142).querySelector("button")?.["focus"]();
  }
  async function localValue38(localValue143) {
    const localValue144 = ++localValue23,
      localValue145 = localValue143.messages[0]?.["message"] || {},
      localValue146 = localValue145.statusPresentation,
      localValue147 = localValue4("status-content");
    localValue147.textContent = "正在读取状态栏…", localValue37("status-detail");
    try {
      if (!localValue146 || !window.imApp?.["sanitizeHtmlTemplate"]) throw new Error("状态栏样式暂不可用");
      let localValue148 = localValue146.html,
        localValue149 = localValue146.css || "";
      const localValue150 = await Promise.all((localValue146.resources || []).map(async localValue152 => {
        const localValue153 = await window.appStorage.getAssetUrl(localValue152.assetId);
        if (!localValue153) throw new Error("收藏图片无法读取，请重新打开");
        return {
          "token": localValue152.token,
          "url": localValue153
        };
      }));
      if (localValue144 !== localValue23 || localValue4("status-detail").hidden || !localValue4("view").classList.contains("active")) return;
      for (const {
        token: localValue154,
        url: localValue155
      } of localValue150) {
        localValue148 = localValue148.split(localValue154).join(localValue3(localValue155)), localValue149 = localValue149.split(localValue154).join(localValue155.replace(/["\\\r\n]/g, localValue156 => "\\" + localValue156));
      }
      const localValue151 = document.createElement("div");
      localValue151.className = "chat-profile-panel-overlay active treasure-status-surface", localValue151.dataset.statusCssActive = String(localValue146.cssActive === true), localValue151.innerHTML = window.imApp.sanitizeHtmlTemplate(localValue148), localValue151.querySelectorAll("button, input, select, textarea").forEach(localValue157 => {
        localValue157.disabled = true;
      }), localValue151.querySelectorAll("a").forEach(localValue158 => localValue158.removeAttribute("href")), localValue151.querySelectorAll("[contenteditable]").forEach(localValue159 => localValue159.removeAttribute("contenteditable")), localValue151.addEventListener("submit", localValue160 => localValue160.preventDefault()), localValue147.replaceChildren(localValue151);
      if (localValue146.cssActive && localValue149 && window.imApp.scopeUserCss) {
        const localValue161 = document.createElement("style");
        localValue161.textContent = window.imApp.scopeUserCss(localValue149, "#treasure-status-content .treasure-status-surface[data-status-css-active=\"true\"]"), localValue147.appendChild(localValue161);
      }
    } catch (localValue162) {
      if (localValue144 !== localValue23 || localValue4("status-detail").hidden) return;
      localValue147.textContent = (localValue162.message || "状态栏读取失败") + "\n\n" + (localValue145.content || "");
    }
  }
  function localValue39(localValue163) {
    localValue4("offline-time").textContent = localValue5(localValue163.messages[0]?.["message"]["timestamp"] || localValue163.createdAt), localValue4("offline-text").textContent = localValue163.messages.map(({
      message: localValue164
    }) => {
      const localValue165 = String(localValue164.content || localValue164.text || ""),
        localValue166 = localValue165.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "").replace(/<br\s*\/?\s*>|<\/(?:p|div|section|article|li)>/gi, "\n").replace(/<[^>]+>/g, ""),
        localValue167 = document.createElement("textarea");
      return localValue167.innerHTML = localValue166, localValue167.value.trim();
    }).join("\n\n"), localValue37("offline-detail");
  }
  function localValue40(localValue168) {
    if (localValue168 === "confirm" && localValue16) return;
    localValue4(localValue168).hidden = true, localValue4("conversation").setAttribute("aria-expanded", "false");
    if (localValue168 === "image-preview") localValue4("preview-img").removeAttribute("src");
    localValue168 === "status-detail" && (localValue23++, localValue4("status-content").replaceChildren());
    if (localValue15?.["isConnected"]) localValue15.focus();
  }
  async function localValue41() {
    localValue24(false);
    const localValue169 = localValue25();
    await localValue27(localValue169), localValue4("conversations").innerHTML = ["char", "group"].map(localValue170 => "<h3>" + (localValue170 === "char" ? "CHAR" : "群聊") + "</h3>" + (localValue169.filter(localValue171 => localValue171.type === localValue170).map(localValue172 => "<button type=\"button\" class=\"treasure-conversation-option\" data-conversation-id=\"" + localValue3(localValue172.id) + "\">" + localValue26(localValue172) + "<span>" + localValue3(localValue172.name) + (localValue172.deleted ? "<small>来源会话已删除</small>" : "") + "</span>" + (localValue172.id === localValue6 ? "<i class=\"fas fa-check\" aria-hidden=\"true\"></i>" : "") + "</button>").join("") || "<small>暂无会话</small>")).join(""), localValue4("conversation").setAttribute("aria-expanded", "true"), localValue37("picker");
  }
  function localValue42(localValue173) {
    if (!localValue173.length) return;
    localValue14 = localValue173.slice();
    const localValue174 = localValue25().find(localValue175 => localValue175.id === localValue6)?.["name"] || "该会话";
    localValue4("confirm-copy").textContent = "删除「" + localValue174 + "」" + (localValue17 ? "搜索结果中" : localValue1.categories[localValue7] + "分类的") + " " + localValue173.length + " 条收藏？\n聊天中的原始内容会保留。", localValue4("confirm-error").textContent = "", localValue37("confirm");
  }
  function localValue43() {
    localValue4("view").querySelectorAll("audio").forEach(localValue176 => localValue176.pause());
  }
  async function localValue44() {
    try {
      await localValue1.setUi(localValue6, localValue7);
    } catch (localValue177) {
      window.showToast?.("浏览位置保存失败");
    }
  }
  let closeFileReader;
  async function localValue45() {
    await localValue1.ready(), localValue8 = window.imData?.["friends"]?.["length"] ? window.imData.friends : await window.appStorage.loadFriends(), localValue1.resetIndexes(), localValue20 = "", localValue19 = 0;
    const localValue178 = localValue1.state();
    localValue6 = localValue178.lastConversationId, localValue7 = localValue178.activeCategory, localValue9 = false, localValue10.clear(), localValue17 = false, localValue18 = "", localValue4("search-input").value = "", localValue24(false), localValue23++, localValue4("status-detail").hidden = true, localValue4("status-content").replaceChildren();
    const localValue179 = localValue4("view");
    localValue179.inert = false, localValue179.setAttribute("aria-hidden", "false");
    if (window.openView) window.openView(localValue179);else localValue179.classList.add("active");
    await localValue36(), void localValue44();
  }
  function localValue46() {
    closeFileReader?.();
    closeFileReader = null;
    localValue43(), localValue11++, localValue24(false), localValue23++, localValue4("status-content").replaceChildren(), localValue21?.["disconnect"](), window.mobileInputCompat?.["releaseForOverlay"]?.(localValue4("view"));
    for (const localValue181 of ["picker", "confirm", "image-preview", "offline-detail", "status-detail"]) localValue4(localValue181).hidden = true;
    const localValue180 = localValue4("view");
    if (localValue180.contains(document.activeElement)) document.activeElement.blur?.();
    localValue180.inert = true, localValue180.setAttribute("aria-hidden", "true");
    if (window.closeView) window.closeView(localValue180);else localValue180.classList.remove("active");
  }
  function localValue47() {
    if (!localValue4("view")) return;
    window.mobileInputCompat?.["registerFocusScope"]?.({
      "selector": "#treasure-view",
      "priority": 20,
      "preferFocusScope": true,
      "preferNativeResize": true,
      "preserveVisibleTarget": true,
      "scrollBehavior": "focus",
      "resolveScrollContainer": (localValue182, localValue183) => localValue183.querySelector(".treasure-scroll"),
      "viewportClassName": "treasure-keyboard-open",
      "viewportHeightCssVariable": "--treasure-viewport-height",
      "viewportTopCssVariable": "--treasure-viewport-top"
    }), localValue4("back").addEventListener("click", localValue46), localValue4("category-button").addEventListener("click", () => {
      localValue4("search-input").blur(), localValue24(!localValue22);
    }), localValue4("menu-backdrop").addEventListener("click", localValue184 => {
      localValue184.preventDefault(), localValue184.stopPropagation(), localValue24(false, {
        "restore": true
      });
    }), localValue4("category-button").addEventListener("keydown", localValue185 => {
      (localValue185.key === "ArrowUp" || localValue185.key === "ArrowDown") && (localValue185.preventDefault(), localValue24(true, {
        "focus": true
      }));
    }), localValue4("category-menu").addEventListener("keydown", localValue186 => {
      const localValue187 = [...localValue4("category-menu").querySelectorAll("button")],
        localValue188 = localValue187.indexOf(document.activeElement);
      let localValue189;
      if (localValue186.key === "ArrowDown") localValue189 = (localValue188 + 1) % localValue187.length;
      if (localValue186.key === "ArrowUp") localValue189 = (localValue188 + localValue187.length - 1) % localValue187.length;
      if (localValue186.key === "Home") localValue189 = 0;
      if (localValue186.key === "End") localValue189 = localValue187.length - 1;
      localValue189 !== undefined && (localValue186.preventDefault(), localValue187[localValue189].focus());
    }), localValue4("conversation").addEventListener("click", () => void localValue41()["catch"](localValue190 => window.showToast?.(localValue190.message))), localValue4("manage").addEventListener("click", () => {
      localValue24(false), localValue9 = !localValue9, localValue10.clear(), localValue43(), void localValue36();
    });
    for (const [localValue191, localValue192] of [["page-previous", -1], ["page-next", 1]]) {
      localValue4(localValue191).addEventListener("click", () => {
        if (localValue4(localValue191).disabled) return;
        localValue19 += localValue192, localValue4("view").querySelector(".treasure-scroll").scrollTop = 0, void localValue36();
      });
    }
    localValue4("search-button").addEventListener("click", () => {
      localValue24(false), localValue17 = !localValue17, localValue18 = "", localValue4("search-input").value = "", localValue10.clear(), localValue9 = false, localValue19 = 0, localValue43(), localValue4("view").querySelector(".treasure-scroll").scrollTop = 0, void localValue36();
      if (localValue17) localValue4("search-input").focus();else localValue4("search-input").blur();
    }), localValue4("search-input").addEventListener("input", () => {
      localValue18 = localValue4("search-input").value, localValue19 = 0, localValue10.clear(), void localValue36();
    }), localValue4("search-input").addEventListener("keydown", localValue193 => {
      localValue193.key === "Enter" && !localValue193.isComposing && localValue193.keyCode !== 229 && (localValue193.preventDefault(), localValue4("search-input").blur());
    }), localValue4("search-clear").addEventListener("click", () => {
      localValue18 = "", localValue4("search-input").value = "", localValue19 = 0, localValue10.clear(), void localValue36(), localValue4("search-input").focus();
    }), localValue4("view").querySelectorAll("[data-treasure-category]").forEach(localValue194 => localValue194.addEventListener("click", () => {
      localValue24(false, {
        "restore": true
      }), localValue43(), localValue7 = localValue194.dataset.treasureCategory, localValue10.clear(), localValue19 = 0, localValue9 = false, localValue17 = false, localValue18 = "", localValue4("search-input").value = "", localValue4("search-input").blur(), localValue4("view").querySelector(".treasure-scroll").scrollTop = 0, void localValue36(), void localValue44();
    })), localValue4("view").querySelectorAll("[data-treasure-close]").forEach(localValue195 => localValue195.addEventListener("click", () => localValue40(localValue195.dataset.treasureClose)));
    for (const localValue196 of ["picker", "confirm", "image-preview", "offline-detail", "status-detail"]) localValue4(localValue196).addEventListener("click", localValue197 => {
      if (localValue197.target === localValue4(localValue196)) localValue40(localValue196);
    });
    localValue4("conversations").addEventListener("click", localValue198 => {
      const localValue199 = localValue198.target.closest("[data-conversation-id]");
      if (!localValue199) return;
      localValue43(), localValue6 = localValue199.dataset.conversationId, localValue10.clear(), localValue19 = 0, localValue9 = false, localValue40("picker"), void localValue36(), void localValue44();
    }), localValue4("select-all").addEventListener("click", () => {
      const localValue200 = localValue12.every(localValue201 => localValue10.has(localValue201.id));
      localValue12.forEach(localValue202 => {
        if (localValue200) localValue10["delete"](localValue202.id);else localValue10.add(localValue202.id);
      }), localValue35();
    }), localValue4("delete-selected").addEventListener("click", () => localValue42([...localValue10])), localValue4("clear").addEventListener("click", () => localValue42(localValue13.map(localValue203 => localValue203.id))), localValue4("list").addEventListener("click", localValue204 => {
      const localValue205 = localValue204.target.closest("[data-treasure-entry]");
      if (!localValue205) return;
      if (localValue9) {
        const localValue207 = localValue205.dataset.treasureEntry;
        if (localValue10.has(localValue207)) localValue10["delete"](localValue207);else localValue10.add(localValue207);
        localValue35();
        return;
      }
      if (localValue204.target.closest("[data-treasure-delete]")) localValue42([localValue205.dataset.treasureEntry]);
      if (localValue204.target.closest("[data-treasure-offline-detail]")) {
        const localValue208 = localValue12.find(localValue209 => localValue209.id === localValue205.dataset.treasureEntry);
        if (localValue208) localValue39(localValue208);
      }
      if (localValue204.target.closest("[data-treasure-status-detail]")) {
        const localValue210 = localValue12.find(localValue211 => localValue211.id === localValue205.dataset.treasureEntry);
        if (localValue210) void localValue38(localValue210);
      }
      const localValue206 = localValue204.target.closest("[data-treasure-image]");
      localValue206 && (localValue4("preview-img").src = localValue206.src, localValue37("image-preview"));
    }), localValue4("confirm-delete").addEventListener("click", async () => {
      if (localValue16) return;
      localValue16 = true, localValue4("confirm-delete").disabled = true;
      try {
        localValue43(), await localValue1.remove(localValue14), localValue16 = false, localValue40("confirm"), localValue10.clear(), await localValue36();
      } catch (localValue212) {
        localValue4("confirm-error").textContent = localValue212.message || "删除失败，请重试";
      } finally {
        localValue16 = false, localValue4("confirm-delete").disabled = false;
      }
    }), localValue4("view").addEventListener("play", localValue213 => {
      if (localValue213.target.tagName === "AUDIO") localValue4("view").querySelectorAll("audio").forEach(localValue214 => {
        if (localValue214 !== localValue213.target) localValue214.pause();
      });
    }, true), localValue4("view").addEventListener("keydown", localValue215 => {
      localValue22 && (localValue215.key === "Escape" || localValue215.key === "Tab") && (localValue24(false, {
        "restore": true
      }), localValue215.key === "Escape" && (localValue215.preventDefault(), localValue215.stopPropagation()));
      const localValue216 = ["image-preview", "confirm", "picker", "offline-detail", "status-detail"].map(localValue4).find(localValue217 => !localValue217.hidden);
      if (!localValue216) return;
      localValue215.key === "Escape" && (localValue215.preventDefault(), localValue40(localValue216.id.slice(9)));
      if (localValue215.key === "Tab") {
        const localValue218 = [...localValue216.querySelectorAll("button:not(:disabled)")],
          localValue219 = localValue218[0],
          localValue220 = localValue218[localValue218.length - 1];
        if (localValue215.shiftKey && document.activeElement === localValue219) localValue215.preventDefault(), localValue220?.["focus"]();else !localValue215.shiftKey && document.activeElement === localValue220 && (localValue215.preventDefault(), localValue219?.["focus"]());
      }
    }), window.addEventListener("treasurechange", () => {
      if (localValue4("view").classList.contains("active")) void localValue36();
    });
  }
  window.treasureApp = {
    "open": () => localValue45()["catch"](localValue221 => window.showToast?.(localValue221.message || "收藏馆打开失败")),
    "close": localValue46
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", localValue47, {
    "once": true
  });else localValue47();
})();
