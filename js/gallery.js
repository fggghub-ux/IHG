(function () {
  'use strict';

  const options = {
    library: "gallery-library-page",
    collections: "gallery-collections-page",
    search: "gallery-search-page"
  };
  let value_2 = null,
    text_3 = "library",
    text_4 = "library",
    items = [],
    items_5 = [],
    value_6 = new Map(),
    count = 0,
    value_7 = null,
    value_8 = null,
    count_9 = 0,
    value_10 = null,
    count_11 = 0,
    text_12 = "",
    value_13 = null,
    value_14 = null;
  function handleAction_15(value_68) {
    return String(value_68 == null ? "" : value_68).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  function handleAction_16(value_69) {
    const trim_70 = String(value_69 || "").trim();
    return /^(?:https?:\/\/|data:image\/|blob:|assets\/)/i.test(trim_70) ? trim_70 : "";
  }
  function handleAction_17(value_71) {
    return String(value_71?.nickname || value_71?.realName || value_71?.name || "聊天").trim() || "聊天";
  }
  function handleAction_18(value_72) {
    const value_73 = new Date(Number(value_72) || 0);
    if (Number.isNaN(value_73.getTime())) return "unknown";
    return value_73.getFullYear() + "-" + String(value_73.getMonth() + 1).padStart(2, "0") + "-" + String(value_73.getDate()).padStart(2, "0");
  }
  function handleAction_19(value_74) {
    const value_75 = Number(value_74) || 0;
    if (!value_75) return "日期未知";
    const value_76 = new Date(),
      value_77 = new Date(value_75),
      handleAction_18_78 = handleAction_18(value_76.getTime()),
      handleAction_18_79 = handleAction_18(value_75);
    if (handleAction_18_79 === handleAction_18_78) return "今天";
    const value_80 = new Date(value_76.getFullYear(), value_76.getMonth(), value_76.getDate() - 1);
    if (handleAction_18_79 === handleAction_18(value_80.getTime())) return "昨天";
    return new Intl.DateTimeFormat("zh-CN", {
      month: "long",
      day: "numeric"
    }).format(value_77);
  }
  function handleAction_20(value_81) {
    const value_82 = Number(value_81) || 0;
    if (!value_82) return "日期未知";
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(value_82));
  }
  function normalizeGalleryItems_2(value_83, value_84) {
    const value_85 = new Map((Array.isArray(value_84) ? value_84 : []).map(value_86 => [String(value_86?.id || ""), value_86]));
    return (Array.isArray(value_83) ? value_83 : []).filter(message => message?.type === "image" && handleAction_16(message.content)).map((contact, value_87) => {
      const friendId_2 = String(contact.friendId || ""),
        value_88 = value_85.get(friendId_2) || null,
        friendName_2 = handleAction_17(value_88),
        timestamp_2 = Number(contact.timestamp) || 0,
        senderName_2 = String(contact.senderName || contact.speaker || (contact.role === "user" ? "我" : friendName_2)).trim(),
        description_2 = String(contact.description || contact.text || contact.fileName || "").trim(),
        key_2 = friendId_2 + ":" + String(contact.id || timestamp_2 || value_87) + ":" + value_87,
        value_94 = timestamp_2 ? handleAction_18(timestamp_2) + " " + handleAction_19(timestamp_2) + " " + handleAction_20(timestamp_2) : "日期未知";
      return {
        source: "chat",
        key: key_2,
        id: String(contact.id || ""),
        friendId: friendId_2,
        friendName: friendName_2,
        friendType: String(value_88?.type || ""),
        senderId: String(contact.senderId || ""),
        senderName: senderName_2,
        description: description_2,
        timestamp: timestamp_2,
        dateKey: handleAction_18(timestamp_2),
        url: handleAction_16(contact.content),
        assetId: String(contact.contentAssetId || ""),
        searchText: (description_2 + " " + friendName_2 + " " + senderName_2 + " " + value_94).toLocaleLowerCase("zh-CN")
      };
    }).sort((message_95, message_96) => message_96.timestamp - message_95.timestamp);
  }
  function filterGalleryItems_2(items_97, value_98) {
    const toLocaleLowerCase_99 = String(value_98 || "").trim().toLocaleLowerCase("zh-CN");
    if (!toLocaleLowerCase_99) return Array.isArray(items_97) ? items_97.slice() : [];
    return (Array.isArray(items_97) ? items_97 : []).filter(value_100 => String(value_100.searchText || "").includes(toLocaleLowerCase_99));
  }
  function handleAction_23(value_101) {
    if (window.galleryData?.normalizeAlbumPhotos) return window.galleryData.normalizeAlbumPhotos(value_101);
    return (Array.isArray(value_101?.galleryAlbumImages) ? value_101.galleryAlbumImages : []).map((value_102, index_2) => {
      const value_104 = typeof value_102 === "string" ? value_102 : value_102?.url,
        url_2 = handleAction_16(value_104),
        assetId_2 = typeof value_102 === "object" ? String(value_102?.assetId || "") : "";
      if (!url_2 && !assetId_2) return null;
      return {
        url: url_2,
        assetId: assetId_2,
        addedAt: Math.max(0, Number(typeof value_102 === "object" ? value_102?.addedAt : 0) || 0),
        sourceFriendId: typeof value_102 === "object" ? String(value_102?.sourceFriendId || "") : "",
        sourceMessageId: typeof value_102 === "object" ? String(value_102?.sourceMessageId || "") : "",
        index: index_2
      };
    }).filter(value_107 => value_107 && value_107.url).sort((value_108, value_109) => value_109.addedAt - value_108.addedAt || value_109.index - value_108.index);
  }
  function buildSharedAlbums_2(value_110) {
    return (Array.isArray(value_110) ? value_110 : []).filter(value_111 => value_111?.type === "char").map(friend_2 => {
      const id_2 = String(friend_2.id || "");
      return {
        id: id_2,
        name: handleAction_17(friend_2),
        avatarUrl: handleAction_16(friend_2.avatarUrl || friend_2.avatar || ""),
        photos: handleAction_23(friend_2),
        friend: friend_2
      };
    });
  }
  function handleAction_25() {
    value_2 = {
      view: document.getElementById("gallery-view"),
      back: document.getElementById("gallery-back-btn"),
      libraryContent: document.getElementById("gallery-library-content"),
      libraryCount: document.getElementById("gallery-library-count"),
      sharedGrid: document.getElementById("gallery-shared-grid"),
      searchInput: document.getElementById("gallery-search-input"),
      searchClear: document.getElementById("gallery-search-clear"),
      searchSummary: document.getElementById("gallery-search-summary"),
      searchResults: document.getElementById("gallery-search-results"),
      shell: document.querySelector(".gallery-shell"),
      tabPill: document.querySelector(".gallery-tab-pill"),
      tabButtons: Array.from(document.querySelectorAll("[data-gallery-tab]")),
      pages: Object.fromEntries(Object.entries(options).map(([value_114, value_115]) => [value_114, document.getElementById(value_115)])),
      preview: document.getElementById("gallery-preview"),
      previewClose: document.getElementById("gallery-preview-close"),
      previewImage: document.getElementById("gallery-preview-image"),
      previewThumbnail: document.getElementById("gallery-preview-thumbnail"),
      previewSource: document.getElementById("gallery-preview-source"),
      previewDescription: document.getElementById("gallery-preview-description"),
      previewDescriptionText: document.getElementById("gallery-preview-description-text"),
      previewDescriptionEdit: document.getElementById("gallery-preview-description-edit"),
      previewDescriptionEditor: document.getElementById("gallery-preview-description-editor"),
      previewDescriptionInput: document.getElementById("gallery-preview-description-input"),
      previewDescriptionCancel: document.getElementById("gallery-preview-description-cancel"),
      previewAddAlbum: document.getElementById("gallery-preview-add-album"),
      previewDelete: document.getElementById("gallery-preview-delete"),
      deleteConfirm: document.getElementById("gallery-delete-confirm"),
      deleteConfirmCopy: document.getElementById("gallery-delete-confirm-copy"),
      deleteConfirmAction: document.getElementById("gallery-delete-confirm-action"),
      deleteConfirmCancel: document.getElementById("gallery-delete-confirm-cancel"),
      deleteStatus: document.getElementById("gallery-delete-status"),
      albumDetail: document.getElementById("gallery-album-detail"),
      albumDetailBack: document.getElementById("gallery-album-detail-back"),
      albumDetailTitle: document.getElementById("gallery-album-detail-title"),
      albumDetailAvatar: document.getElementById("gallery-album-detail-avatar"),
      albumDetailGrid: document.getElementById("gallery-album-detail-grid"),
      albumUrlForm: document.getElementById("gallery-album-url-form"),
      albumUrlInput: document.getElementById("gallery-album-url-input"),
      albumDescriptionInput: document.getElementById("gallery-album-description-input"),
      albumUrlSubmit: document.getElementById("gallery-album-url-submit"),
      albumUrlStatus: document.getElementById("gallery-album-url-status")
    };
  }
  function handleAction_26(value_116, value_117, value_118 = "far fa-images") {
    return "<div class=\"gallery-empty-state\"><i class=\"" + value_118 + "\" aria-hidden=\"true\"></i><strong>" + handleAction_15(value_116) + "</strong><span>" + handleAction_15(value_117) + "</span></div>";
  }
  function handleAction_27() {
    return "<div class=\"gallery-loading-state\"><i class=\"fas fa-circle-notch\" aria-hidden=\"true\"></i><span>正在整理照片</span></div>";
  }
  function handleAction_28(value_119, value_120, value_121) {
    const value_122 = value_121 >= 4 && value_120 === 0 ? " is-featured" : "",
      value_123 = value_119.description || value_119.friendName + "的照片";
    return "<button type=\"button\" class=\"gallery-photo-tile" + value_122 + "\" data-gallery-photo-key=\"" + handleAction_15(value_119.key) + "\" aria-label=\"预览" + handleAction_15(value_123) + "\">\n            <img src=\"" + handleAction_15(value_119.url) + "\" alt=\"" + handleAction_15(value_123) + "\" loading=\"lazy\" decoding=\"async\">\n            <span class=\"gallery-broken-mark\"><i class=\"far fa-image\" aria-hidden=\"true\"></i></span>\n        </button>";
  }
  function handleAction_29(element, items_124, value_125, value_126) {
    if (!element) return;
    if (!items_124.length) {
      element.innerHTML = handleAction_26(value_125, value_126, "far fa-images");
      return;
    }
    const value_127 = new Map();
    items_124.forEach(value_128 => {
      if (!value_127.has(value_128.dateKey)) value_127.set(value_128.dateKey, []);
      value_127.get(value_128.dateKey).push(value_128);
    });
    element.innerHTML = Array.from(value_127.values()).map(items_129 => "\n            <section class=\"gallery-date-group\">\n                <div class=\"gallery-date-heading\"><strong>" + handleAction_15(handleAction_19(items_129[0].timestamp)) + "</strong><span>" + items_129.length + " 张</span></div>\n                <div class=\"gallery-photo-grid\">" + items_129.map((value_130, value_131) => handleAction_28(value_130, value_131, items_129.length)).join("") + "</div>\n            </section>\n        ").join("");
    handleAction_30(element);
  }
  function handleAction_30(value_132) {
    value_132.querySelectorAll(".gallery-photo-tile img").forEach(value_133 => {
      value_133.addEventListener("error", () => value_133.closest(".gallery-photo-tile")?.classList.add("is-broken"), {
        once: true
      });
      value_133.addEventListener("load", () => value_133.closest(".gallery-photo-tile")?.classList.remove("is-broken"), {
        once: true
      });
    });
  }
  function handleAction_31(value_134) {
    const length_135 = value_134.photos.length,
      min_136 = Math.min(4, length_135),
      items_137 = ["", "one-image", "two-images", "three-images", "four-images"],
      value_138 = min_136 ? " has-" + items_137[min_136] : "",
      value_139 = length_135 ? value_134.photos.slice(0, 4).map(value_141 => "<img src=\"" + handleAction_15(value_141.url) + "\" alt=\"\" loading=\"lazy\" decoding=\"async\">").join("") : "<span class=\"gallery-album-placeholder\">" + (value_134.avatarUrl ? "<img src=\"" + handleAction_15(value_134.avatarUrl) + "\" alt=\"\" loading=\"lazy\" decoding=\"async\">" : "<i class=\"far fa-images\" aria-hidden=\"true\"></i>") + "</span>",
      value_140 = value_134.avatarUrl ? "<img src=\"" + handleAction_15(value_134.avatarUrl) + "\" alt=\"\" loading=\"lazy\" decoding=\"async\">" : "<i class=\"fas fa-user\" aria-hidden=\"true\"></i>";
    return "<button type=\"button\" class=\"gallery-album-card\" data-gallery-album-id=\"" + handleAction_15(value_134.id) + "\" aria-label=\"打开" + handleAction_15(value_134.name) + "的相册\">\n            <div class=\"gallery-album-cover" + value_138 + "\">" + value_139 + "<span class=\"gallery-album-avatar\">" + value_140 + "</span></div>\n            <span class=\"gallery-album-copy\"><strong>" + handleAction_15(value_134.name) + "</strong><span>" + (length_135 ? length_135 + " 张照片" : "共享相册") + "</span></span>\n        </button>";
  }
  function handleAction_32() {
    if (!value_2?.sharedGrid) return;
    const handleAction_24_142 = buildSharedAlbums_2(items_5);
    value_2.sharedGrid.innerHTML = handleAction_24_142.length ? handleAction_24_142.map(handleAction_31).join("") : handleAction_26("暂无共享相册", "添加 Char 后，会在这里显示对应相册。", "fas fa-user-group");
  }
  function handleAction_33() {
    return buildSharedAlbums_2(items_5).find(value_143 => value_143.id === text_12) || null;
  }
  function handleAction_34() {
    const handleAction_33_144 = handleAction_33();
    if (!handleAction_33_144 || !value_2?.albumDetail) return;
    value_2.albumDetailTitle.textContent = handleAction_33_144.name;
    value_2.albumDetailAvatar.innerHTML = handleAction_33_144.avatarUrl ? "<img src=\"" + handleAction_15(handleAction_33_144.avatarUrl) + "\" alt=\"\">" : "<i class=\"fas fa-user\" aria-hidden=\"true\"></i>";
    value_2.albumDetailGrid.innerHTML = handleAction_33_144.photos.length ? handleAction_33_144.photos.map((value_145, value_146) => "<button type=\"button\" class=\"gallery-photo-tile\" data-gallery-album-photo-index=\"" + value_146 + "\" aria-label=\"预览" + handleAction_15(handleAction_33_144.name) + "相册照片\"><img src=\"" + handleAction_15(value_145.url) + "\" alt=\"" + handleAction_15(handleAction_33_144.name) + "相册照片\" loading=\"lazy\" decoding=\"async\"><span class=\"gallery-broken-mark\"><i class=\"far fa-image\" aria-hidden=\"true\"></i></span></button>").join("") : handleAction_26("相册还是空的", "在上方粘贴图片 URL，建立这个 Char 自己的相册。", "far fa-images");
    handleAction_30(value_2.albumDetailGrid);
  }
  function handleAction_35(value_147) {
    text_12 = String(value_147 || "");
    if (!handleAction_33() || !value_2?.albumDetail) return;
    handleAction_34();
    if (value_2.albumUrlInput) value_2.albumUrlInput.value = "";
    if (value_2.albumDescriptionInput) value_2.albumDescriptionInput.value = "";
    if (value_2.albumUrlStatus) value_2.albumUrlStatus.textContent = "";
    value_2.albumDetail.hidden = false;
    value_2.albumDetail.inert = false;
    value_2.albumDetail.setAttribute("aria-hidden", "false");
    value_2.shell?.classList.add("album-detail-open");
  }
  function handleAction_36() {
    if (!value_2?.albumDetail) return;
    const activeElement_148 = document.activeElement;
    if (activeElement_148 && value_2.albumDetail.contains(activeElement_148) && typeof activeElement_148.blur === "function") activeElement_148.blur();
    value_2.albumDetail.inert = true;
    value_2.albumDetail.setAttribute("aria-hidden", "true");
    value_2.albumDetail.hidden = true;
    value_2.shell?.classList.remove("album-detail-open");
    text_12 = "";
  }
  async function handleAction_37(value_149, galleryAlbumImages_3) {
    if (!value_149?.id) throw new Error("gallery_album_missing");
    const galleryAlbumImages_2 = window.galleryData?.serializeAlbumPhotos ? window.galleryData.serializeAlbumPhotos(value_149.id, galleryAlbumImages_3) : galleryAlbumImages_3;
    if (window.imApp?.commitFriendMetaPatch) {
      const value_152 = await window.imApp.commitFriendMetaPatch(value_149.id, {
        galleryAlbumImages: galleryAlbumImages_2
      });
      if (!value_152) throw new Error("gallery_album_save_failed");
    } else {
      if (window.imStorage?.patchFriendMeta) await window.imStorage.patchFriendMeta(value_149.id, {
        galleryAlbumImages: galleryAlbumImages_2
      });else throw new Error("gallery_album_storage_unavailable");
    }
    value_149.friend.galleryAlbumImages = galleryAlbumImages_3;
    const result = (window.imData?.friends || []).find(value_153 => String(value_153.id) === value_149.id);
    if (result) result.galleryAlbumImages = galleryAlbumImages_3;
  }
  async function handleAction_38(event) {
    event.preventDefault();
    const handleAction_33_154 = handleAction_33();
    if (!handleAction_33_154 || !value_2?.albumUrlInput) return;
    const url_3 = String(value_2.albumUrlInput.value || "").trim(),
      description_3 = String(value_2.albumDescriptionInput?.value || "").trim().slice(0, 300);
    if (!/^https?:\/\/[^\s]+$/i.test(url_3)) {
      value_2.albumUrlStatus.textContent = "请输入以 http:// 或 https:// 开头的图片 URL。";
      return;
    }
    const slice_157 = [{
      id: window.galleryData?.createPhotoId?.(handleAction_33_154.id, {
        url: url_3,
        addedAt: Date.now()
      }),
      url: url_3,
      description: description_3,
      addedAt: Date.now()
    }, ...handleAction_23(handleAction_33_154.friend).map(value_158 => ({
      ...value_158
    }))].filter((value_159, value_160, value_161) => value_161.findIndex(value_162 => value_162.url === value_159.url) === value_160).slice(0, 100);
    value_2.albumUrlSubmit.disabled = true;
    value_2.albumUrlStatus.textContent = "正在添加…";
    try {
      await handleAction_37(handleAction_33_154, slice_157);
      value_2.albumUrlInput.value = "";
      if (value_2.albumDescriptionInput) value_2.albumDescriptionInput.value = "";
      value_2.albumUrlStatus.textContent = "已添加到这个 Char 的相册。";
      handleAction_32();
      handleAction_34();
    } catch (value_163) {
      console.error("[gallery] Failed to save Char album URL", value_163);
      value_2.albumUrlStatus.textContent = "添加失败，请稍后重试。";
    } finally {
      value_2.albumUrlSubmit.disabled = false;
    }
  }
  function handleAction_39() {
    if (value_2?.libraryCount) value_2.libraryCount.textContent = items.length ? items.length + " 张照片" : "";
    handleAction_29(value_2?.libraryContent, items, "图库还是空的", "聊天中出现的图片会自动汇总到这里。");
  }
  function handleAction_40() {
    if (!value_2) return;
    const value_164 = value_2.searchInput?.value || "",
      handleAction_22_165 = filterGalleryItems_2(items, value_164);
    if (value_2.searchClear) value_2.searchClear.hidden = !value_164;
    if (value_2.searchSummary) value_2.searchSummary.textContent = value_164 ? handleAction_22_165.length + " 个结果" : items.length + " 张照片";
    handleAction_29(value_2.searchResults, handleAction_22_165, value_164 ? "没有找到相关照片" : "图库还是空的", value_164 ? "试试人物、描述或其他日期。" : "聊天中出现的图片会自动汇总到这里。");
  }
  function handleAction_41() {
    value_6 = new Map(items.map(value_166 => [value_166.key, value_166]));
  }
  async function handleAction_42() {
    const value_167 = ++count;
    if (value_2?.libraryContent) value_2.libraryContent.innerHTML = handleAction_27();
    if (value_2?.sharedGrid) value_2.sharedGrid.innerHTML = handleAction_27();
    try {
      const value_168 = Array.isArray(window.imData?.friends) ? window.imData.friends : [],
        [value_169, value_170] = await Promise.all([window.imStorage?.loadFriends ? window.imStorage.loadFriends() : Promise.resolve(value_168), window.imStorage?.loadGalleryImageMessages ? window.imStorage.loadGalleryImageMessages() : Promise.resolve([])]);
      if (value_167 !== count) return;
      items_5 = Array.isArray(value_169) ? value_169 : value_168;
      items = normalizeGalleryItems_2(value_170, items_5);
      handleAction_41();
      handleAction_39();
      handleAction_32();
      handleAction_40();
    } catch (value_171) {
      console.error("[gallery] Failed to load gallery data", value_171);
      if (value_167 !== count) return;
      items = [];
      items_5 = Array.isArray(window.imData?.friends) ? window.imData.friends : [];
      handleAction_41();
      if (value_2?.libraryContent) value_2.libraryContent.innerHTML = handleAction_26("无法读取图库", "请稍后重新打开 Gallery。", "fas fa-triangle-exclamation");
      handleAction_32();
      handleAction_40();
    }
  }
  function switchTab_2(value_172) {
    if (!value_2 || !options[value_172]) return;
    const activeElement_173 = document.activeElement,
      result_174 = Object.entries(value_2.pages).find(([value_175, value_176]) => value_175 !== value_172 && value_176 && activeElement_173 && value_176.contains(activeElement_173));
    if (result_174) {
      const value_177 = value_2.tabButtons.find(value_178 => value_178.dataset.galleryTab === value_172) || value_2.back;
      if (value_177 && typeof value_177.focus === "function") value_177.focus({
        preventScroll: true
      });else {
        if (typeof activeElement_173.blur === "function") activeElement_173.blur();
      }
    }
    text_3 = value_172;
    value_2.tabPill?.classList.toggle("search-active", value_172 === "search");
    (value_172 === "library" || value_172 === "collections") && (text_4 = value_172, value_2.tabPill?.setAttribute("data-active-tab", value_172));
    Object.entries(value_2.pages).forEach(([value_179, element_180]) => {
      if (!element_180) return;
      const value_181 = value_179 === value_172;
      element_180.hidden = false;
      element_180.classList.toggle("active", value_181);
      element_180.setAttribute("aria-hidden", String(!value_181));
      element_180.inert = !value_181;
    });
    value_2.tabButtons.forEach(element_182 => {
      const value_183 = element_182.dataset.galleryTab === value_172;
      element_182.classList.toggle("active", value_183);
      if (element_182.getAttribute("role") === "tab") element_182.setAttribute("aria-selected", String(value_183));else element_182.setAttribute("aria-pressed", String(value_183));
    });
    value_2.pages[value_172]?.querySelector(".gallery-page-scroll")?.scrollTo?.({
      top: 0,
      behavior: "auto"
    });
    if (value_172 === "search") handleAction_40();
  }
  function handleAction_44() {
    if (!value_2?.tabPill) return;
    if (count_9) window.cancelAnimationFrame(count_9);
    count_9 = 0;
    value_10 = null;
    value_8 = null;
    value_2.tabPill.classList.remove("dragging");
    value_2.tabPill.style.removeProperty("--slider-left");
    value_2.tabPill.setAttribute("data-active-tab", text_4);
  }
  function handleAction_45(value_184) {
    if (!value_2?.tabPill) return text_4;
    const value_185 = value_8;
    if (value_185) return value_184 < value_185.left + value_185.width / 2 ? "library" : "collections";
    const boundingClientRect = value_2.tabPill.getBoundingClientRect();
    return value_184 < boundingClientRect.left + boundingClientRect.width / 2 ? "library" : "collections";
  }
  function handleAction_46(value_186) {
    if (!value_2?.tabPill || !value_8) return;
    const max_187 = Math.max(value_8.inset, Math.min(value_8.width - value_8.inset - value_8.sliderWidth, value_186 - value_8.left - value_8.sliderWidth / 2));
    value_2.tabPill.style.setProperty("--slider-left", max_187 + "px");
  }
  function handleAction_47(value_188) {
    value_10 = value_188;
    if (count_9) return;
    count_9 = window.requestAnimationFrame(() => {
      count_9 = 0;
      handleAction_46(value_10);
    });
  }
  function handleAction_48() {
    if (!value_2?.tabPill) return;
    value_2.tabPill.addEventListener("pointerdown", event_189 => {
      if (!event_189.target.closest("[data-gallery-tab=\"library\"], [data-gallery-tab=\"collections\"]")) return;
      value_7 = event_189.pointerId;
      const boundingClientRect_190 = value_2.tabPill.getBoundingClientRect(),
        inset_2 = 5;
      value_8 = {
        left: boundingClientRect_190.left,
        width: boundingClientRect_190.width,
        inset: inset_2,
        sliderWidth: (boundingClientRect_190.width - inset_2 * 2) / 2
      };
      value_2.tabPill.classList.add("dragging");
      value_2.tabPill.setPointerCapture?.(event_189.pointerId);
      handleAction_46(event_189.clientX);
    });
    value_2.tabPill.addEventListener("pointermove", event_192 => {
      if (value_7 === event_192.pointerId) handleAction_47(event_192.clientX);
    });
    value_2.tabPill.addEventListener("pointerup", event_193 => {
      if (value_7 !== event_193.pointerId) return;
      const handleAction_45_194 = handleAction_45(event_193.clientX);
      value_7 = null;
      count_11 = Date.now() + 220;
      switchTab_2(handleAction_45_194);
      handleAction_44();
    });
    value_2.tabPill.addEventListener("pointercancel", value_195 => {
      if (value_7 !== value_195.pointerId) return;
      value_7 = null;
      handleAction_44();
    });
  }
  function handleAction_49() {
    if (value_2?.previewDescriptionEditor) value_2.previewDescriptionEditor.hidden = true;
    if (value_2?.previewDescriptionText) value_2.previewDescriptionText.hidden = false;
    if (value_2?.previewDescriptionEdit) value_2.previewDescriptionEdit.disabled = false;
  }
  function handleAction_50() {
    if (!value_14 || value_14.source !== "album" || !value_2?.previewDescriptionEditor) return;
    value_2.previewDescriptionInput && (value_2.previewDescriptionInput.value = String(value_14.description || "").slice(0, 300));
    if (value_2.previewDescriptionText) value_2.previewDescriptionText.hidden = true;
    if (value_2.previewDescriptionEdit) value_2.previewDescriptionEdit.disabled = true;
    value_2.previewDescriptionEditor.hidden = false;
    value_2.previewDescriptionInput?.focus?.({
      preventScroll: true
    });
  }
  async function handleAction_51(event_196) {
    event_196.preventDefault();
    const value_197 = value_14;
    if (!value_197 || value_197.source !== "album") return;
    const result_198 = buildSharedAlbums_2(items_5).find(value_201 => value_201.id === String(value_197.albumId || ""));
    if (!result_198) return;
    const description_4 = String(value_2?.previewDescriptionInput?.value || "").trim().slice(0, 300),
      map_200 = result_198.photos.map(value_202 => value_202.id === value_197.photoId ? {
        ...value_202,
        description: description_4
      } : {
        ...value_202
      }),
      buttonTypeSubmitElement = value_2.previewDescriptionEditor?.querySelector("button[type=\"submit\"]");
    if (buttonTypeSubmitElement) buttonTypeSubmitElement.disabled = true;
    try {
      await handleAction_37(result_198, map_200);
      value_197.description = description_4;
      if (value_2.previewDescriptionText) value_2.previewDescriptionText.textContent = description_4;
      handleAction_49();
      handleAction_32();
      if (text_12 === result_198.id) handleAction_34();
      window.showToast?.("图片描述已保存");
    } catch (value_203) {
      console.error("[gallery] Failed to update album photo description", value_203);
      window.showToast?.("图片描述保存失败");
    } finally {
      if (buttonTypeSubmitElement) buttonTypeSubmitElement.disabled = false;
    }
  }
  function handleAction_52(value_204) {
    if (!value_2?.preview || !value_204?.url) return;
    value_14 = value_204;
    value_13 = document.activeElement && !value_2.preview.contains(document.activeElement) ? document.activeElement : null;
    value_2.previewImage.src = value_204.url;
    value_2.previewImage.alt = value_204.description || value_204.friendName + "的照片";
    if (value_2.previewThumbnail) value_2.previewThumbnail.src = value_204.url;
    if (value_2.previewSource) value_2.previewSource.textContent = value_204.source === "album" ? value_204.friendName + " · 共享相册" : value_204.friendName;
    const textContent_2 = String(value_204.description || "").trim();
    if (value_2.previewDescriptionText) value_2.previewDescriptionText.textContent = textContent_2;
    if (value_2.previewDescription) value_2.previewDescription.hidden = !textContent_2 && value_204.source !== "album";
    if (value_2.previewDescriptionEdit) value_2.previewDescriptionEdit.hidden = value_204.source !== "album";
    handleAction_49();
    const handleAction_58_206 = handleAction_58(value_204);
    if (value_2.previewAddAlbum) {
      const spanElement = value_2.previewAddAlbum.querySelector("span"),
        value_207 = handleAction_58_206 && handleAction_59(handleAction_58_206, value_204);
      value_2.previewAddAlbum.disabled = value_204.source === "album" || !handleAction_58_206 || value_207;
      if (spanElement) spanElement.textContent = value_204.source === "album" || value_207 ? "已在共享相册" : "加入共享相册";
    }
    if (value_2.previewDelete) value_2.previewDelete.disabled = false;
    handleAction_54({
      restoreFocus: false
    });
    value_2.preview.hidden = false;
    value_2.preview.inert = false;
    value_2.preview.setAttribute("aria-hidden", "false");
    value_2.previewClose?.focus?.({
      preventScroll: true
    });
  }
  function handleAction_53() {
    if (!value_2?.deleteConfirm || !value_14) return;
    const value_208 = value_14;
    value_2.deleteConfirmCopy && (value_2.deleteConfirmCopy.textContent = value_208.source === "album" ? "此照片将从 " + value_208.friendName + " 的独立相册中删除，且无法恢复。" : "此照片及其消息会从对应" + (value_208.friendType === "group" ? "群聊" : "单聊") + "中删除，且无法恢复。");
    if (value_2.deleteStatus) value_2.deleteStatus.textContent = "";
    value_2.deleteConfirm.hidden = false;
    value_2.deleteConfirm.inert = false;
    value_2.deleteConfirm.setAttribute("aria-hidden", "false");
    value_2.deleteConfirmCancel?.focus?.({
      preventScroll: true
    });
  }
  function handleAction_54(value_209 = {}) {
    if (!value_2?.deleteConfirm) return;
    const activeElement_210 = document.activeElement;
    if (activeElement_210 && value_2.deleteConfirm.contains(activeElement_210)) {
      const value_211 = value_2.previewDelete && !value_2.previewDelete.disabled ? value_2.previewDelete : value_2.previewClose;
      if (value_209.restoreFocus !== false && value_211 && typeof value_211.focus === "function") value_211.focus({
        preventScroll: true
      });else typeof activeElement_210.blur === "function" && activeElement_210.blur();
    }
    value_2.deleteConfirm.inert = true;
    value_2.deleteConfirm.setAttribute("aria-hidden", "true");
    value_2.deleteConfirm.hidden = true;
    if (value_2.deleteStatus) value_2.deleteStatus.textContent = "";
  }
  function handleAction_55(contact_212) {
    const elementById = document.getElementById("chat-interface-" + contact_212.friendId),
      value_213 = elementById?.querySelector(".ins-chat-messages") || null;
    if (value_213 && window.imChat?.removeMessageFromContainer) {
      const removeMessageFromContainer_214 = window.imChat.removeMessageFromContainer(value_213, {
        id: contact_212.id || null,
        timestamp: contact_212.timestamp || null
      }, {
        scroll: false
      });
      if (!removeMessageFromContainer_214 && window.imChat?.rerenderChatContainer) {
        const result_215 = (window.imData?.friends || []).find(value_216 => String(value_216.id) === String(contact_212.friendId));
        if (result_215) window.imChat.rerenderChatContainer(result_215, value_213, {
          scroll: false
        });
      }
    }
    window.imChat?.renderChatsList?.();
  }
  async function handleAction_56(contact_217) {
    if (!contact_217?.friendId || !contact_217.id && !contact_217.timestamp || !window.imApp?.removeFriendMessages) throw new Error("gallery_chat_delete_unavailable");
    const value_218 = await window.imApp.removeFriendMessages(contact_217.friendId, {
      id: contact_217.id || null,
      timestamp: contact_217.timestamp || null
    }, {
      silent: true
    });
    if (!value_218) throw new Error("gallery_chat_delete_failed");
    handleAction_55(contact_217);
    items = items.filter(value_219 => value_219.key !== contact_217.key);
    handleAction_41();
  }
  async function handleAction_57(message_220) {
    const result_221 = buildSharedAlbums_2(items_5).find(value_223 => value_223.id === String(message_220.albumId || ""));
    if (!result_221) throw new Error("gallery_album_delete_missing");
    const map_222 = handleAction_23(result_221.friend).filter(value_224 => message_220.photoId ? value_224.id !== message_220.photoId : !(value_224.url === message_220.url && value_224.addedAt === message_220.timestamp)).map(value_225 => ({
      ...value_225
    }));
    await handleAction_37(result_221, map_222);
  }
  function handleAction_58(contact_226) {
    if (!contact_226 || contact_226.source === "album") return null;
    const handleAction_24_227 = buildSharedAlbums_2(items_5);
    if (contact_226.friendType === "char") return handleAction_24_227.find(value_230 => value_230.id === String(contact_226.friendId)) || null;
    if (contact_226.senderId) {
      const result_231 = handleAction_24_227.find(value_232 => value_232.id === String(contact_226.senderId));
      if (result_231) return result_231;
    }
    const toLocaleLowerCase_228 = String(contact_226.senderName || "").trim().toLocaleLowerCase("zh-CN");
    if (!toLocaleLowerCase_228 || toLocaleLowerCase_228 === "我") return null;
    const filter_229 = handleAction_24_227.filter(value_233 => value_233.name.toLocaleLowerCase("zh-CN") === toLocaleLowerCase_228);
    return filter_229.length === 1 ? filter_229[0] : null;
  }
  function handleAction_59(value_234, contact_235) {
    return value_234.photos.some(value_236 => contact_235.photoId && value_236.id === contact_235.photoId || contact_235.assetId && value_236.assetId === contact_235.assetId || contact_235.url && value_236.url === contact_235.url || contact_235.id && value_236.sourceFriendId === contact_235.friendId && value_236.sourceMessageId === contact_235.id);
  }
  async function handleAction_60() {
    const contact_237 = value_14,
      handleAction_58_238 = handleAction_58(contact_237);
    if (!contact_237 || !handleAction_58_238 || contact_237.source === "album" || !value_2?.previewAddAlbum) return;
    if (handleAction_59(handleAction_58_238, contact_237)) {
      window.showToast?.("已在 " + handleAction_58_238.name + " 的共享相册中");
      return;
    }
    if (!contact_237.assetId && !/^https?:\/\//i.test(contact_237.url || "")) {
      window.showToast?.("这张照片暂时无法加入共享相册");
      return;
    }
    const slice_239 = [{
      id: window.galleryData?.createPhotoId?.(handleAction_58_238.id, contact_237),
      url: contact_237.url,
      assetId: contact_237.assetId,
      description: String(contact_237.description || "").trim().slice(0, 300),
      addedAt: Date.now(),
      sourceFriendId: contact_237.friendId,
      sourceMessageId: contact_237.id
    }, ...handleAction_58_238.photos.map(value_240 => ({
      ...value_240
    }))].slice(0, 100);
    value_2.previewAddAlbum.disabled = true;
    try {
      await handleAction_37(handleAction_58_238, slice_239);
      const spanElement_241 = value_2.previewAddAlbum.querySelector("span");
      if (spanElement_241) spanElement_241.textContent = "已在共享相册";
      handleAction_32();
      if (text_12 === handleAction_58_238.id) handleAction_34();
      window.showToast?.("已加入 " + handleAction_58_238.name + " 的共享相册");
    } catch (value_242) {
      console.error("[gallery] Failed to add chat photo to Char album", value_242);
      value_2.previewAddAlbum.disabled = false;
      window.showToast?.("加入共享相册失败");
    }
  }
  async function handleAction_61() {
    const value_243 = value_14;
    if (!value_243) return;
    if (value_2.deleteConfirmAction) value_2.deleteConfirmAction.disabled = true;
    if (value_2.deleteConfirmCancel) value_2.deleteConfirmCancel.disabled = true;
    if (value_2.previewDelete) value_2.previewDelete.disabled = true;
    if (value_2.deleteStatus) value_2.deleteStatus.textContent = "正在删除…";
    try {
      if (value_243.source === "album") await handleAction_57(value_243);else await handleAction_56(value_243);
      handleAction_54({
        restoreFocus: true
      });
      handleAction_62();
      handleAction_39();
      handleAction_32();
      handleAction_40();
      if (text_12) handleAction_34();
      window.showToast?.(value_243.source === "album" ? "已从 Char 相册删除" : "照片及对应聊天消息已删除");
    } catch (value_244) {
      console.error("[gallery] Failed to delete photo", value_244);
      if (value_2.deleteStatus) value_2.deleteStatus.textContent = "删除失败，请稍后重试。";
      if (value_2.previewDelete) value_2.previewDelete.disabled = false;
    } finally {
      if (value_2.deleteConfirmAction) value_2.deleteConfirmAction.disabled = false;
      if (value_2.deleteConfirmCancel) value_2.deleteConfirmCancel.disabled = false;
    }
  }
  function handleAction_62() {
    if (!value_2?.preview) return;
    handleAction_54({
      restoreFocus: false
    });
    const activeElement_245 = document.activeElement;
    if (activeElement_245 && value_2.preview.contains(activeElement_245)) {
      if (value_13?.isConnected && typeof value_13.focus === "function") value_13.focus({
        preventScroll: true
      });else typeof activeElement_245.blur === "function" && activeElement_245.blur();
    }
    value_2.preview.inert = true;
    value_2.preview.setAttribute("aria-hidden", "true");
    value_2.preview.hidden = true;
    value_2.previewImage && (value_2.previewImage.removeAttribute("src"), value_2.previewImage.alt = "");
    value_2.previewThumbnail?.removeAttribute("src");
    if (value_2.previewDescriptionText) value_2.previewDescriptionText.textContent = "";
    if (value_2.previewDescription) value_2.previewDescription.hidden = true;
    handleAction_49();
    value_13 = null;
    value_14 = null;
  }
  function handleAction_63() {
    if (value_2?.searchInput) value_2.searchInput.value = "";
    handleAction_40();
  }
  function open_2() {
    if (!value_2?.view) return;
    handleAction_62();
    handleAction_36();
    handleAction_63();
    text_4 = "library";
    switchTab_2("library");
    value_2.view.inert = false;
    value_2.view.setAttribute("aria-hidden", "false");
    if (typeof window.openView === "function") window.openView(value_2.view);else value_2.view.classList.add("active");
    handleAction_42();
  }
  function close_2() {
    if (!value_2?.view) return;
    const activeElement_246 = document.activeElement;
    if (activeElement_246 && value_2.view.contains(activeElement_246) && typeof activeElement_246.blur === "function") activeElement_246.blur();
    count += 1;
    handleAction_62();
    handleAction_36();
    handleAction_63();
    text_4 = "library";
    switchTab_2("library");
    value_2.view.inert = true;
    value_2.view.setAttribute("aria-hidden", "true");
    if (typeof window.closeView === "function") window.closeView(value_2.view);else value_2.view.classList.remove("active");
  }
  function handleAction_66() {
    if (!value_2?.view || value_2.view.dataset.galleryBound === "true") return;
    value_2.view.dataset.galleryBound = "true";
    value_2.back?.addEventListener("click", close_2);
    value_2.previewClose?.addEventListener("click", handleAction_62);
    value_2.previewDescriptionEdit?.addEventListener("click", handleAction_50);
    value_2.previewDescriptionCancel?.addEventListener("click", handleAction_49);
    value_2.previewDescriptionEditor?.addEventListener("submit", handleAction_51);
    value_2.previewAddAlbum?.addEventListener("click", handleAction_60);
    value_2.previewDelete?.addEventListener("click", handleAction_53);
    value_2.deleteConfirmAction?.addEventListener("click", handleAction_61);
    value_2.deleteConfirmCancel?.addEventListener("click", () => handleAction_54({
      restoreFocus: true
    }));
    value_2.albumDetailBack?.addEventListener("click", handleAction_36);
    value_2.albumUrlForm?.addEventListener("submit", handleAction_38);
    value_2.tabButtons.forEach(value_247 => value_247.addEventListener("click", () => {
      const galleryTab_248 = value_247.dataset.galleryTab;
      if (galleryTab_248 !== "search" && Date.now() < count_11) return;
      if (galleryTab_248 === "search" && text_3 === "search") switchTab_2(text_4);else switchTab_2(galleryTab_248);
    }));
    value_2.searchInput?.addEventListener("input", handleAction_40);
    value_2.searchClear?.addEventListener("click", handleAction_63);
    value_2.view.addEventListener("click", event_249 => {
      const closest_250 = event_249.target.closest("[data-gallery-photo-key]");
      if (closest_250 && !closest_250.classList.contains("is-broken")) {
        handleAction_52(value_6.get(closest_250.dataset.galleryPhotoKey));
        return;
      }
      const closest_251 = event_249.target.closest("[data-gallery-album-id]");
      if (closest_251) {
        handleAction_35(closest_251.dataset.galleryAlbumId);
        return;
      }
      const closest_252 = event_249.target.closest("[data-gallery-album-photo-index]");
      if (closest_252 && !closest_252.classList.contains("is-broken")) {
        const handleAction_33_253 = handleAction_33(),
          value_254 = handleAction_33_253?.photos[Number(closest_252.dataset.galleryAlbumPhotoIndex)];
        if (value_254) handleAction_52({
          source: "album",
          albumId: handleAction_33_253.id,
          photoId: value_254.id,
          assetId: value_254.assetId,
          url: value_254.url,
          description: value_254.description,
          friendName: handleAction_33_253.name,
          senderName: "共享相册",
          timestamp: value_254.addedAt
        });
      }
    });
    value_2.view.addEventListener("keydown", value_255 => {
      if (value_255.key !== "Escape") return;
      if (!value_2.deleteConfirm?.hidden) handleAction_54({
        restoreFocus: true
      });else {
        if (!value_2.preview?.hidden) handleAction_62();else {
          if (!value_2.albumDetail?.hidden) handleAction_36();else {
            if (text_3 === "search") switchTab_2(text_4);else close_2();
          }
        }
      }
    });
    handleAction_48();
  }
  function handleDOMContentLoaded() {
    handleAction_25();
    if (!value_2.view) return;
    handleAction_66();
    switchTab_2("library");
    handleAction_39();
    handleAction_32();
    handleAction_40();
  }
  window.galleryApp = {
    open: open_2,
    close: close_2,
    switchTab: switchTab_2,
    normalizeGalleryItems: normalizeGalleryItems_2,
    filterGalleryItems: filterGalleryItems_2,
    buildSharedAlbums: buildSharedAlbums_2,
    getActiveTab: () => text_3
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", handleDOMContentLoaded, {
    once: true
  });else handleDOMContentLoaded();
})();
