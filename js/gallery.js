(function () {
  "use strict";

  const scopeValue0 = {
    library: "gallery-library-page",
    collections: "gallery-collections-page",
    search: "gallery-search-page"
  };
  let scopeValue1 = null,
    scopeValue2 = "library",
    scopeValue3 = "library",
    scopeValue4 = [],
    scopeValue5 = [],
    scopeValue6 = new Map(),
    scopeValue7 = 0,
    scopeValue8 = null,
    scopeValue9 = null,
    scopeValue10 = 0,
    scopeValue11 = null,
    scopeValue12 = 0,
    scopeValue13 = "",
    scopeValue14 = null,
    scopeValue15 = null,
    newScope16 = false,
    newScope17 = false;
  function scopeValue16(scopeValue69) {
    return String(scopeValue69 == null ? "" : scopeValue69).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  function scopeValue17(scopeValue70) {
    const scopeValue71 = String(scopeValue70 || "").trim();
    return /^(?:https?:\/\/|data:image\/|blob:|assets\/)/i.test(scopeValue71) ? scopeValue71 : "";
  }
  function scopeValue18(scopeValue72) {
    return String(scopeValue72?.nickname || scopeValue72?.realName || scopeValue72?.name || "聊天").trim() || "聊天";
  }
  function scopeValue19(scopeValue73) {
    const scopeValue74 = new Date(Number(scopeValue73) || 0);
    if (Number.isNaN(scopeValue74.getTime())) return "unknown";
    return scopeValue74.getFullYear() + "-" + String(scopeValue74.getMonth() + 1).padStart(2, "0") + "-" + String(scopeValue74.getDate()).padStart(2, "0");
  }
  function scopeValue20(scopeValue75) {
    const scopeValue76 = Number(scopeValue75) || 0;
    if (!scopeValue76) return "日期未知";
    const scopeValue77 = new Date(),
      scopeValue78 = new Date(scopeValue76),
      scopeValue79 = scopeValue19(scopeValue77.getTime()),
      scopeValue80 = scopeValue19(scopeValue76);
    if (scopeValue80 === scopeValue79) return "今天";
    const scopeValue81 = new Date(scopeValue77.getFullYear(), scopeValue77.getMonth(), scopeValue77.getDate() - 1);
    if (scopeValue80 === scopeValue19(scopeValue81.getTime())) return "昨天";
    return new Intl.DateTimeFormat("zh-CN", {
      month: "long",
      day: "numeric"
    }).format(scopeValue78);
  }
  function scopeValue21(scopeValue82) {
    const scopeValue83 = Number(scopeValue82) || 0;
    if (!scopeValue83) return "日期未知";
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(scopeValue83));
  }
  function scopeValue22(scopeValue84, scopeValue85) {
    const scopeValue86 = new Map((Array.isArray(scopeValue85) ? scopeValue85 : []).map(scopeValue87 => [String(scopeValue87?.id || ""), scopeValue87]));
    return (Array.isArray(scopeValue84) ? scopeValue84 : []).filter(scopeValue88 => scopeValue88?.type === "image").flatMap((scopeValue89, scopeValue90) => {
      const scopeValue91 = String(scopeValue89.friendId || ""),
        scopeValue92 = scopeValue86.get(scopeValue91) || null,
        scopeValue93 = scopeValue18(scopeValue92),
        scopeValue94 = Number(scopeValue89.timestamp) || 0,
        scopeValue95 = String(scopeValue89.senderName || scopeValue89.speaker || (scopeValue89.role === "user" ? "我" : scopeValue93)).trim(),
        scopeValue96 = String(typeof scopeValue89.description === "string" ? scopeValue89.description : scopeValue89.text || scopeValue89.fileName || "").trim(),
        scopeValue97 = scopeValue91 + ":" + String(scopeValue89.id || scopeValue94 || scopeValue90) + ":" + scopeValue90,
        scopeValue98 = scopeValue94 ? scopeValue19(scopeValue94) + " " + scopeValue20(scopeValue94) + " " + scopeValue21(scopeValue94) : "日期未知";
      const scopeValue99 = [{
        url: scopeValue89.content,
        assetId: scopeValue89.contentAssetId
      }, ...(Array.isArray(scopeValue89.albumImages) ? scopeValue89.albumImages : [])];
      return scopeValue99.flatMap((scopeValue100, scopeValue101) => {
        const scopeValue102 = scopeValue17(scopeValue100?.url);
        if (!scopeValue102) return [];
        return [{
          source: "chat",
          key: scopeValue97 + ":" + scopeValue101,
          id: String(scopeValue89.id || ""),
          photoIndex: scopeValue101,
          photoCount: scopeValue99.length,
          friendId: scopeValue91,
          friendName: scopeValue93,
          friendType: String(scopeValue92?.type || ""),
          senderId: String(scopeValue89.senderId || ""),
          senderName: scopeValue95,
          description: scopeValue96,
          timestamp: scopeValue94,
          dateKey: scopeValue19(scopeValue94),
          url: scopeValue102,
          assetId: String(scopeValue100.assetId || ""),
          searchText: (scopeValue96 + " " + scopeValue93 + " " + scopeValue95 + " " + scopeValue98).toLocaleLowerCase("zh-CN")
        }];
      });
    }).sort((scopeValue103, scopeValue104) => scopeValue104.timestamp - scopeValue103.timestamp);
  }
  function scopeValue23(scopeValue105, scopeValue106) {
    const scopeValue107 = String(scopeValue106 || "").trim().toLocaleLowerCase("zh-CN");
    if (!scopeValue107) return Array.isArray(scopeValue105) ? scopeValue105.slice() : [];
    return (Array.isArray(scopeValue105) ? scopeValue105 : []).filter(scopeValue108 => String(scopeValue108.searchText || "").includes(scopeValue107));
  }
  function scopeValue24(scopeValue109) {
    if (window.galleryData?.normalizeAlbumPhotos) return window.galleryData.normalizeAlbumPhotos(scopeValue109);
    return (Array.isArray(scopeValue109?.galleryAlbumImages) ? scopeValue109.galleryAlbumImages : []).map((scopeValue110, scopeValue111) => {
      const scopeValue112 = typeof scopeValue110 === "string" ? scopeValue110 : scopeValue110?.url,
        scopeValue113 = scopeValue17(scopeValue112),
        scopeValue114 = typeof scopeValue110 === "object" ? String(scopeValue110?.assetId || "") : "";
      if (!scopeValue113 && !scopeValue114) return null;
      return {
        url: scopeValue113,
        assetId: scopeValue114,
        addedAt: Math.max(0, Number(typeof scopeValue110 === "object" ? scopeValue110?.addedAt : 0) || 0),
        sourceFriendId: typeof scopeValue110 === "object" ? String(scopeValue110?.sourceFriendId || "") : "",
        sourceMessageId: typeof scopeValue110 === "object" ? String(scopeValue110?.sourceMessageId || "") : "",
        index: scopeValue111
      };
    }).filter(scopeValue115 => scopeValue115 && scopeValue115.url).sort((scopeValue116, scopeValue117) => scopeValue117.addedAt - scopeValue116.addedAt || scopeValue117.index - scopeValue116.index);
  }
  function scopeValue25(scopeValue118) {
    return (Array.isArray(scopeValue118) ? scopeValue118 : []).filter(scopeValue119 => scopeValue119?.type === "char").map(scopeValue120 => {
      const scopeValue121 = String(scopeValue120.id || "");
      return {
        id: scopeValue121,
        name: scopeValue18(scopeValue120),
        avatarUrl: scopeValue17(scopeValue120.avatarUrl || scopeValue120.avatar || ""),
        photos: scopeValue24(scopeValue120),
        friend: scopeValue120
      };
    });
  }
  function scopeValue26() {
    scopeValue1 = {
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
      pages: Object.fromEntries(Object.entries(scopeValue0).map(([scopeValue122, scopeValue123]) => [scopeValue122, document.getElementById(scopeValue123)])),
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
      previewDownload: document.getElementById("gallery-preview-download"),
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
  function scopeValue27(scopeValue124, scopeValue125, scopeValue126 = "far fa-images") {
    return "<div class=\"gallery-empty-state\"><i class=\"" + scopeValue126 + "\" aria-hidden=\"true\"></i><strong>" + scopeValue16(scopeValue124) + "</strong><span>" + scopeValue16(scopeValue125) + "</span></div>";
  }
  function scopeValue28() {
    return "<div class=\"gallery-loading-state\"><i class=\"fas fa-circle-notch\" aria-hidden=\"true\"></i><span>正在整理照片</span></div>";
  }
  function scopeValue29(scopeValue127, scopeValue128, scopeValue129) {
    const scopeValue130 = scopeValue129 >= 4 && scopeValue128 === 0 ? " is-featured" : "",
      scopeValue131 = scopeValue127.description || scopeValue127.friendName + "的照片";
    return "<button type=\"button\" class=\"gallery-photo-tile" + scopeValue130 + "\" data-gallery-photo-key=\"" + scopeValue16(scopeValue127.key) + "\" aria-label=\"预览" + scopeValue16(scopeValue131) + `">
            <img src="` + scopeValue16(scopeValue127.url) + "\" alt=\"" + scopeValue16(scopeValue131) + `" loading="lazy" decoding="async">
            <span class="gallery-broken-mark"><i class="far fa-image" aria-hidden="true"></i></span>
        </button>`;
  }
  function scopeValue30(scopeValue132, scopeValue133, scopeValue134, scopeValue135) {
    if (!scopeValue132) return;
    if (!scopeValue133.length) {
      scopeValue132.innerHTML = scopeValue27(scopeValue134, scopeValue135, "far fa-images");
      return;
    }
    const scopeValue136 = new Map();
    scopeValue133.forEach(scopeValue137 => {
      if (!scopeValue136.has(scopeValue137.dateKey)) scopeValue136.set(scopeValue137.dateKey, []);
      scopeValue136.get(scopeValue137.dateKey).push(scopeValue137);
    });
    scopeValue132.innerHTML = Array.from(scopeValue136.values()).map(scopeValue138 => `
            <section class="gallery-date-group">
                <div class="gallery-date-heading"><strong>` + scopeValue16(scopeValue20(scopeValue138[0].timestamp)) + "</strong><span>" + scopeValue138.length + ` 张</span></div>
                <div class="gallery-photo-grid">` + scopeValue138.map((scopeValue139, scopeValue140) => scopeValue29(scopeValue139, scopeValue140, scopeValue138.length)).join("") + `</div>
            </section>
        `).join("");
    scopeValue31(scopeValue132);
  }
  function scopeValue31(scopeValue141) {
    scopeValue141.querySelectorAll(".gallery-photo-tile img").forEach(scopeValue142 => {
      scopeValue142.addEventListener("error", () => scopeValue142.closest(".gallery-photo-tile")?.classList.add("is-broken"), {
        once: true
      });
      scopeValue142.addEventListener("load", () => scopeValue142.closest(".gallery-photo-tile")?.classList.remove("is-broken"), {
        once: true
      });
    });
  }
  function scopeValue32(scopeValue143) {
    const scopeValue144 = scopeValue143.photos.length,
      scopeValue145 = Math.min(4, scopeValue144),
      scopeValue146 = ["", "one-image", "two-images", "three-images", "four-images"],
      scopeValue147 = scopeValue145 ? " has-" + scopeValue146[scopeValue145] : "",
      scopeValue148 = scopeValue144 ? scopeValue143.photos.slice(0, 4).map(scopeValue150 => "<img src=\"" + scopeValue16(scopeValue150.url) + "\" alt=\"\" loading=\"lazy\" decoding=\"async\">").join("") : "<span class=\"gallery-album-placeholder\">" + (scopeValue143.avatarUrl ? "<img src=\"" + scopeValue16(scopeValue143.avatarUrl) + "\" alt=\"\" loading=\"lazy\" decoding=\"async\">" : "<i class=\"far fa-images\" aria-hidden=\"true\"></i>") + "</span>",
      scopeValue149 = scopeValue143.avatarUrl ? "<img src=\"" + scopeValue16(scopeValue143.avatarUrl) + "\" alt=\"\" loading=\"lazy\" decoding=\"async\">" : "<i class=\"fas fa-user\" aria-hidden=\"true\"></i>";
    return "<button type=\"button\" class=\"gallery-album-card\" data-gallery-album-id=\"" + scopeValue16(scopeValue143.id) + "\" aria-label=\"打开" + scopeValue16(scopeValue143.name) + `的相册">
            <div class="gallery-album-cover` + scopeValue147 + "\">" + scopeValue148 + "<span class=\"gallery-album-avatar\">" + scopeValue149 + `</span></div>
            <span class="gallery-album-copy"><strong>` + scopeValue16(scopeValue143.name) + "</strong><span>" + (scopeValue144 ? scopeValue144 + " 张照片" : "共享相册") + `</span></span>
        </button>`;
  }
  function scopeValue33() {
    if (!scopeValue1?.sharedGrid) return;
    const scopeValue151 = scopeValue25(scopeValue5);
    scopeValue1.sharedGrid.innerHTML = scopeValue151.length ? scopeValue151.map(scopeValue32).join("") : scopeValue27("暂无共享相册", "添加 Char 后，会在这里显示对应相册。", "fas fa-user-group");
  }
  function scopeValue34() {
    return scopeValue25(scopeValue5).find(scopeValue152 => scopeValue152.id === scopeValue13) || null;
  }
  function scopeValue35() {
    const scopeValue153 = scopeValue34();
    if (!scopeValue153 || !scopeValue1?.albumDetail) return;
    scopeValue1.albumDetailTitle.textContent = scopeValue153.name;
    scopeValue1.albumDetailAvatar.innerHTML = scopeValue153.avatarUrl ? "<img src=\"" + scopeValue16(scopeValue153.avatarUrl) + "\" alt=\"\">" : "<i class=\"fas fa-user\" aria-hidden=\"true\"></i>";
    scopeValue1.albumDetailGrid.innerHTML = scopeValue153.photos.length ? scopeValue153.photos.map((scopeValue154, scopeValue155) => "<button type=\"button\" class=\"gallery-photo-tile\" data-gallery-album-photo-index=\"" + scopeValue155 + "\" aria-label=\"预览" + scopeValue16(scopeValue153.name) + "相册照片\"><img src=\"" + scopeValue16(scopeValue154.url) + "\" alt=\"" + scopeValue16(scopeValue153.name) + "相册照片\" loading=\"lazy\" decoding=\"async\"><span class=\"gallery-broken-mark\"><i class=\"far fa-image\" aria-hidden=\"true\"></i></span></button>").join("") : scopeValue27("相册还是空的", "在上方粘贴图片 URL，建立这个 Char 自己的相册。", "far fa-images");
    scopeValue31(scopeValue1.albumDetailGrid);
  }
  function scopeValue36(scopeValue156) {
    scopeValue13 = String(scopeValue156 || "");
    if (!scopeValue34() || !scopeValue1?.albumDetail) return;
    scopeValue35();
    if (scopeValue1.albumUrlInput) scopeValue1.albumUrlInput.value = "";
    if (scopeValue1.albumDescriptionInput) scopeValue1.albumDescriptionInput.value = "";
    if (scopeValue1.albumUrlStatus) scopeValue1.albumUrlStatus.textContent = "";
    scopeValue1.albumDetail.hidden = false;
    scopeValue1.albumDetail.inert = false;
    scopeValue1.albumDetail.setAttribute("aria-hidden", "false");
    scopeValue1.shell?.classList.add("album-detail-open");
  }
  function scopeValue37() {
    if (!scopeValue1?.albumDetail) return;
    const scopeValue157 = document.activeElement;
    if (scopeValue157 && scopeValue1.albumDetail.contains(scopeValue157) && typeof scopeValue157.blur === "function") scopeValue157.blur();
    window.mobileInputCompat?.["releaseForOverlay"]?.(scopeValue1.albumDetail), newScope17 = false, scopeValue1.albumDetail.inert = true, scopeValue1.albumDetail.setAttribute("aria-hidden", "true"), scopeValue1.albumDetail.hidden = true, scopeValue1.shell?.["classList"]["remove"]("album-detail-open"), scopeValue13 = "";
  }
  async function scopeValue38(scopeValue158, scopeValue159) {
    if (!scopeValue158?.id) throw new Error("gallery_album_missing");
    const scopeValue160 = window.galleryData?.serializeAlbumPhotos ? window.galleryData.serializeAlbumPhotos(scopeValue158.id, scopeValue159) : scopeValue159;
    if (window.imApp?.commitFriendMetaPatch) {
      const scopeValue162 = await window.imApp.commitFriendMetaPatch(scopeValue158.id, {
        galleryAlbumImages: scopeValue160
      });
      if (!scopeValue162) throw new Error("gallery_album_save_failed");
    } else {
      if (window.imStorage?.patchFriendMeta) await window.imStorage.patchFriendMeta(scopeValue158.id, {
        galleryAlbumImages: scopeValue160
      });else throw new Error("gallery_album_storage_unavailable");
    }
    scopeValue158.friend.galleryAlbumImages = scopeValue159;
    const scopeValue161 = (window.imData?.friends || []).find(scopeValue163 => String(scopeValue163.id) === scopeValue158.id);
    if (scopeValue161) scopeValue161.galleryAlbumImages = scopeValue159;
  }
  async function scopeValue39(scopeValue164) {
    scopeValue164.preventDefault();
    if (newScope17 || scopeValue1?.["albumUrlSubmit"]?.["disabled"]) return;
    const scopeValue165 = scopeValue34();
    if (!scopeValue165 || !scopeValue1?.albumUrlInput) return;
    const scopeValue166 = String(scopeValue1.albumUrlInput.value || "").trim(),
      scopeValue167 = String(scopeValue1.albumDescriptionInput?.value || "").trim().slice(0, 300);
    if (!/^https?:\/\/[^\s]+$/i.test(scopeValue166)) {
      scopeValue1.albumUrlStatus.textContent = "请输入以 http:// 或 https:// 开头的图片 URL。";
      return;
    }
    const scopeValue168 = [{
      id: window.galleryData?.createPhotoId?.(scopeValue165.id, {
        url: scopeValue166,
        addedAt: Date.now()
      }),
      url: scopeValue166,
      description: scopeValue167,
      addedAt: Date.now()
    }, ...scopeValue24(scopeValue165.friend).map(scopeValue169 => ({
      ...scopeValue169
    }))].filter((scopeValue170, scopeValue171, scopeValue172) => scopeValue172.findIndex(scopeValue173 => scopeValue173.url === scopeValue170.url) === scopeValue171).slice(0, 100);
    scopeValue1.albumUrlSubmit.disabled = true;
    scopeValue1.albumUrlStatus.textContent = "正在添加…";
    try {
      await scopeValue38(scopeValue165, scopeValue168);
      scopeValue1.albumUrlInput.value = "";
      if (scopeValue1.albumDescriptionInput) scopeValue1.albumDescriptionInput.value = "";
      scopeValue1.albumUrlStatus.textContent = "已添加到这个 Char 的相册。";
      scopeValue33();
      scopeValue35();
    } catch (scopeValue174) {
      console.error("[gallery] Failed to save Char album URL", scopeValue174);
      scopeValue1.albumUrlStatus.textContent = "添加失败，请稍后重试。";
    } finally {
      scopeValue1.albumUrlSubmit.disabled = false;
    }
  }
  function scopeValue40() {
    if (scopeValue1?.libraryCount) scopeValue1.libraryCount.textContent = scopeValue4.length ? scopeValue4.length + " 张照片" : "";
    scopeValue30(scopeValue1?.libraryContent, scopeValue4, "图库还是空的", "聊天中出现的图片会自动汇总到这里。");
  }
  function scopeValue41() {
    if (!scopeValue1) return;
    const scopeValue175 = scopeValue1.searchInput?.value || "",
      scopeValue176 = scopeValue23(scopeValue4, scopeValue175);
    if (scopeValue1.searchClear) scopeValue1.searchClear.hidden = !scopeValue175;
    if (scopeValue1.searchSummary) scopeValue1.searchSummary.textContent = scopeValue175 ? scopeValue176.length + " 个结果" : scopeValue4.length + " 张照片";
    scopeValue30(scopeValue1.searchResults, scopeValue176, scopeValue175 ? "没有找到相关照片" : "图库还是空的", scopeValue175 ? "试试人物、描述或其他日期。" : "聊天中出现的图片会自动汇总到这里。");
  }
  function scopeValue42() {
    scopeValue6 = new Map(scopeValue4.map(scopeValue177 => [scopeValue177.key, scopeValue177]));
  }
  async function scopeValue43() {
    const scopeValue178 = ++scopeValue7;
    if (scopeValue1?.libraryContent) scopeValue1.libraryContent.innerHTML = scopeValue28();
    if (scopeValue1?.sharedGrid) scopeValue1.sharedGrid.innerHTML = scopeValue28();
    try {
      const scopeValue179 = Array.isArray(window.imData?.friends) ? window.imData.friends : [],
        [scopeValue180, scopeValue181] = await Promise.all([window.imStorage?.loadFriends ? window.imStorage.loadFriends() : Promise.resolve(scopeValue179), window.imStorage?.loadGalleryImageMessages ? window.imStorage.loadGalleryImageMessages() : Promise.resolve([])]);
      if (scopeValue178 !== scopeValue7) return;
      scopeValue5 = Array.isArray(scopeValue180) ? scopeValue180 : scopeValue179;
      scopeValue4 = scopeValue22(scopeValue181, scopeValue5);
      scopeValue42();
      scopeValue40();
      scopeValue33();
      scopeValue41();
    } catch (scopeValue182) {
      console.error("[gallery] Failed to load gallery data", scopeValue182);
      if (scopeValue178 !== scopeValue7) return;
      scopeValue4 = [];
      scopeValue5 = Array.isArray(window.imData?.friends) ? window.imData.friends : [];
      scopeValue42();
      if (scopeValue1?.libraryContent) scopeValue1.libraryContent.innerHTML = scopeValue27("无法读取图库", "请稍后重新打开 Gallery。", "fas fa-triangle-exclamation");
      scopeValue33();
      scopeValue41();
    }
  }
  function scopeValue44(scopeValue183) {
    if (!scopeValue1 || !scopeValue0[scopeValue183]) return;
    const scopeValue184 = document.activeElement,
      scopeValue185 = Object.entries(scopeValue1.pages).find(([scopeValue186, scopeValue187]) => scopeValue186 !== scopeValue183 && scopeValue187 && scopeValue184 && scopeValue187.contains(scopeValue184));
    if (scopeValue185) {
      const scopeValue188 = scopeValue1.tabButtons.find(scopeValue189 => scopeValue189.dataset.galleryTab === scopeValue183) || scopeValue1.back;
      if (scopeValue188 && typeof scopeValue188.focus === "function") scopeValue188.focus({
        preventScroll: true
      });else {
        if (typeof scopeValue184.blur === "function") scopeValue184.blur();
      }
    }
    scopeValue2 = scopeValue183;
    scopeValue1.tabPill?.classList.toggle("search-active", scopeValue183 === "search");
    (scopeValue183 === "library" || scopeValue183 === "collections") && (scopeValue3 = scopeValue183, scopeValue1.tabPill?.setAttribute("data-active-tab", scopeValue183));
    Object.entries(scopeValue1.pages).forEach(([scopeValue190, scopeValue191]) => {
      if (!scopeValue191) return;
      const scopeValue192 = scopeValue190 === scopeValue183;
      scopeValue191.hidden = false;
      scopeValue191.classList.toggle("active", scopeValue192);
      scopeValue191.setAttribute("aria-hidden", String(!scopeValue192));
      scopeValue191.inert = !scopeValue192;
    });
    scopeValue1.tabButtons.forEach(scopeValue193 => {
      const scopeValue194 = scopeValue193.dataset.galleryTab === scopeValue183;
      scopeValue193.classList.toggle("active", scopeValue194);
      if (scopeValue193.getAttribute("role") === "tab") scopeValue193.setAttribute("aria-selected", String(scopeValue194));else scopeValue193.setAttribute("aria-pressed", String(scopeValue194));
    });
    scopeValue1.pages[scopeValue183]?.querySelector(".gallery-page-scroll")?.scrollTo?.({
      top: 0,
      behavior: "auto"
    });
    if (scopeValue183 === "search") scopeValue41();
  }
  function scopeValue45() {
    if (!scopeValue1?.tabPill) return;
    if (scopeValue10) window.cancelAnimationFrame(scopeValue10);
    scopeValue10 = 0;
    scopeValue11 = null;
    scopeValue9 = null;
    scopeValue1.tabPill.classList.remove("dragging");
    scopeValue1.tabPill.style.removeProperty("--slider-left");
    scopeValue1.tabPill.setAttribute("data-active-tab", scopeValue3);
  }
  function scopeValue46(scopeValue195) {
    if (!scopeValue1?.tabPill) return scopeValue3;
    const scopeValue196 = scopeValue9;
    if (scopeValue196) return scopeValue195 < scopeValue196.left + scopeValue196.width / 2 ? "library" : "collections";
    const scopeValue197 = scopeValue1.tabPill.getBoundingClientRect();
    return scopeValue195 < scopeValue197.left + scopeValue197.width / 2 ? "library" : "collections";
  }
  function scopeValue47(scopeValue198) {
    if (!scopeValue1?.tabPill || !scopeValue9) return;
    const scopeValue199 = Math.max(scopeValue9.inset, Math.min(scopeValue9.width - scopeValue9.inset - scopeValue9.sliderWidth, scopeValue198 - scopeValue9.left - scopeValue9.sliderWidth / 2));
    scopeValue1.tabPill.style.setProperty("--slider-left", scopeValue199 + "px");
  }
  function scopeValue48(scopeValue200) {
    scopeValue11 = scopeValue200;
    if (scopeValue10) return;
    scopeValue10 = window.requestAnimationFrame(() => {
      scopeValue10 = 0;
      scopeValue47(scopeValue11);
    });
  }
  function scopeValue49() {
    if (!scopeValue1?.tabPill) return;
    scopeValue1.tabPill.addEventListener("pointerdown", scopeValue201 => {
      if (!scopeValue201.target.closest("[data-gallery-tab=\"library\"], [data-gallery-tab=\"collections\"]")) return;
      scopeValue8 = scopeValue201.pointerId;
      const scopeValue202 = scopeValue1.tabPill.getBoundingClientRect(),
        scopeValue203 = 5;
      scopeValue9 = {
        left: scopeValue202.left,
        width: scopeValue202.width,
        inset: scopeValue203,
        sliderWidth: (scopeValue202.width - scopeValue203 * 2) / 2
      };
      scopeValue1.tabPill.classList.add("dragging");
      scopeValue1.tabPill.setPointerCapture?.(scopeValue201.pointerId);
      scopeValue47(scopeValue201.clientX);
    });
    scopeValue1.tabPill.addEventListener("pointermove", scopeValue204 => {
      if (scopeValue8 === scopeValue204.pointerId) scopeValue48(scopeValue204.clientX);
    });
    scopeValue1.tabPill.addEventListener("pointerup", scopeValue205 => {
      if (scopeValue8 !== scopeValue205.pointerId) return;
      const scopeValue206 = scopeValue46(scopeValue205.clientX);
      scopeValue8 = null;
      scopeValue12 = Date.now() + 220;
      scopeValue44(scopeValue206);
      scopeValue45();
    });
    scopeValue1.tabPill.addEventListener("pointercancel", scopeValue207 => {
      if (scopeValue8 !== scopeValue207.pointerId) return;
      scopeValue8 = null;
      scopeValue45();
    });
  }
  function scopeValue50() {
    if (scopeValue1?.["previewDescriptionEditor"]?.["contains"](document.activeElement)) document.activeElement.blur?.();
    window.mobileInputCompat?.["releaseForOverlay"]?.(scopeValue1?.["previewDescriptionEditor"]), newScope17 = false;
    if (scopeValue1?.["previewDescriptionEditor"]) scopeValue1.previewDescriptionEditor.hidden = true;
    if (scopeValue1?.["previewDescriptionText"]) scopeValue1.previewDescriptionText.hidden = false;
    if (scopeValue1?.["previewDescriptionEdit"]) scopeValue1.previewDescriptionEdit.disabled = false;
    scopeValue1?.["preview"]?.["classList"]["remove"]("is-editing-description");
  }
  function scopeValue51() {
    if (!scopeValue15 || !scopeValue1?.["previewDescriptionEditor"]) return;
    scopeValue1.previewDescriptionInput && (scopeValue1.previewDescriptionInput.value = String(scopeValue15.description || "").slice(0, 300));
    if (scopeValue1.previewDescriptionText) scopeValue1.previewDescriptionText.hidden = true;
    if (scopeValue1.previewDescriptionEdit) scopeValue1.previewDescriptionEdit.disabled = true;
    scopeValue1.previewDescriptionEditor.hidden = false, scopeValue1.previewDescription.hidden = false, scopeValue1.preview.classList.add("is-editing-description"), scopeValue1.previewDescriptionInput?.["focus"]?.({
      preventScroll: true
    });
  }
  async function scopeValue52(scopeValue208) {
    scopeValue208.preventDefault();
    if (newScope17 || newScope16) return;
    const scopeValue209 = scopeValue15;
    if (!scopeValue209) return;
    const newScope210 = String(scopeValue1?.["previewDescriptionInput"]?.["value"] || "").trim().slice(0, 300),
      newScope211 = scopeValue1.previewDescriptionEditor?.["querySelector"]("button[type=\"submit\"]");
    newScope16 = true;
    if (newScope211) newScope211.disabled = true;
    try {
      if (scopeValue209.source === "album") {
        const scopeValue210 = scopeValue25(scopeValue5).find(scopeValue214 => scopeValue214.id === String(scopeValue209.albumId || ""));
        if (!scopeValue210 || !scopeValue210.photos.some(scopeValue215 => scopeValue215.id === scopeValue209.photoId)) throw new Error("gallery_photo_missing");
        const newScope213 = scopeValue210.photos.map(newScope216 => newScope216.id === scopeValue209.photoId ? {
          ...newScope216,
          description: newScope210
        } : {
          ...newScope216
        });
        await scopeValue38(scopeValue210, newScope213), scopeValue33();
        if (scopeValue13 === scopeValue210.id) scopeValue35();
      } else {
        const newScope217 = await window.imApp?.["updateFriendMessage"]?.(scopeValue209.friendId, {
          id: scopeValue209.id || null,
          timestamp: scopeValue209.timestamp || null
        }, newScope218 => {
          if (newScope218.type !== "image") throw new Error("gallery_photo_missing");
          newScope218.description = newScope210, newScope218.text = newScope210;
        }, {
          silent: true
        });
        if (!newScope217) throw new Error("gallery_description_save_failed");
        scopeValue209.searchText = (newScope210 + " " + scopeValue209.friendName + " " + scopeValue209.senderName + " " + scopeValue19(scopeValue209.timestamp) + " " + scopeValue20(scopeValue209.timestamp) + " " + scopeValue21(scopeValue209.timestamp)).toLocaleLowerCase("zh-CN"), newScope55(scopeValue209);
      }
      scopeValue209.description = newScope210, scopeValue40(), scopeValue41();
      if (scopeValue15 === scopeValue209) {
        if (scopeValue1.previewDescriptionText) scopeValue1.previewDescriptionText.textContent = newScope210;
        if (scopeValue1.previewImage) scopeValue1.previewImage.alt = newScope210 || scopeValue209.friendName + "的照片";
        scopeValue50();
      }
      window.showToast?.("图片描述已保存");
    } catch (newScope219) {
      console.error("[gallery] Failed to update photo description", newScope219), window.showToast?.("图片描述保存失败");
    } finally {
      newScope16 = false;
      if (newScope211) newScope211.disabled = false;
    }
  }
  function newScope55(newScope220) {
    const newScope221 = (window.imData?.["friends"] || []).find(newScope223 => String(newScope223.id) === String(newScope220.friendId)),
      newScope222 = document.getElementById("chat-interface-" + newScope220.friendId)?.["querySelector"](".ins-chat-messages");
    if (newScope221 && newScope222) window.imChat?.["rerenderChatContainer"]?.(newScope221, newScope222, {
      scroll: false
    });
    window.imChat?.["renderChatsList"]?.();
  }
  async function newScope56() {
    const newScope224 = scopeValue15,
      scopeValue213 = scopeValue1?.["previewDownload"];
    if (!newScope224?.["url"] || scopeValue213?.["disabled"]) return;
    if (scopeValue213) scopeValue213.disabled = true;
    try {
      if (typeof window.u2ExportFile !== "function") throw new Error("图片下载功能尚未加载");
      let newScope226 = null;
      try {
        if (newScope224.assetId && window.appStorage?.["getAssetBlob"]) newScope226 = await window.appStorage.getAssetBlob(newScope224.assetId);
        if (!newScope226) {
          const newScope229 = await fetch(newScope224.url);
          if (!newScope229.ok) throw new Error("图片源无法读取");
          newScope226 = await newScope229.blob();
        }
        if (!newScope226?.["size"] || newScope226.type && !/^image\//i.test(newScope226.type)) newScope226 = null;
      } catch (newScope230) {
        console.warn("[gallery] Opening image save options", newScope230);
      }
      const newScope227 = {
          "image/jpeg": "jpg",
          "image/png": "png",
          "image/webp": "webp",
          "image/gif": "gif",
          "image/avif": "avif",
          "image/svg+xml": "svg"
        }[newScope226?.["type"]] || "jpg",
        newScope228 = await window.u2ExportFile({
          blob: newScope226,
          fileName: "Gallery-" + (newScope224.timestamp || Date.now()) + "." + newScope227,
          title: "Gallery 图片",
          mode: "image",
          imageUrl: newScope224.url,
          showOptions: !newScope226
        });
      if (!newScope228 || newScope228 === "failed" || newScope228 === "unavailable") throw new Error("图片下载失败，请稍后重试");
      if (newScope228 === "downloaded" || newScope228 === "download-started") window.showToast?.("已发起图片下载");
    } catch (newScope231) {
      window.showToast?.(newScope231?.["message"] || "图片下载失败，请稍后重试");
    } finally {
      if (scopeValue213) scopeValue213.disabled = false;
    }
  }
  function scopeValue53(scopeValue217) {
    if (!scopeValue1?.preview || !scopeValue217?.url) return;
    scopeValue15 = scopeValue217;
    scopeValue14 = document.activeElement && !scopeValue1.preview.contains(document.activeElement) ? document.activeElement : null;
    scopeValue1.previewImage.src = scopeValue217.url;
    scopeValue1.previewImage.alt = scopeValue217.description || scopeValue217.friendName + "的照片";
    if (scopeValue1.previewThumbnail) scopeValue1.previewThumbnail.src = scopeValue217.url;
    if (scopeValue1.previewSource) scopeValue1.previewSource.textContent = scopeValue217.source === "album" ? scopeValue217.friendName + " · 共享相册" : scopeValue217.friendName;
    const scopeValue218 = String(scopeValue217.description || "").trim();
    if (scopeValue1.previewDescriptionText) scopeValue1.previewDescriptionText.textContent = scopeValue218;
    if (scopeValue1.previewDescription) scopeValue1.previewDescription.hidden = !scopeValue218;
    scopeValue50();
    const scopeValue219 = scopeValue59(scopeValue217);
    if (scopeValue1.previewAddAlbum) {
      const scopeValue220 = scopeValue1.previewAddAlbum.querySelector("span"),
        scopeValue221 = scopeValue219 && scopeValue60(scopeValue219, scopeValue217);
      scopeValue1.previewAddAlbum.disabled = scopeValue217.source === "album" || !scopeValue219 || scopeValue221;
      if (scopeValue220) scopeValue220.textContent = scopeValue217.source === "album" || scopeValue221 ? "已在共享相册" : "加入共享相册";
    }
    if (scopeValue1.previewDelete) scopeValue1.previewDelete.disabled = false;
    scopeValue55({
      restoreFocus: false
    });
    scopeValue1.preview.hidden = false;
    scopeValue1.preview.inert = false;
    scopeValue1.preview.setAttribute("aria-hidden", "false");
    scopeValue1.previewClose?.focus?.({
      preventScroll: true
    });
  }
  function scopeValue54() {
    if (!scopeValue1?.deleteConfirm || !scopeValue15) return;
    const scopeValue222 = scopeValue15;
    scopeValue1.deleteConfirmCopy && (scopeValue1.deleteConfirmCopy.textContent = scopeValue222.source === "album" ? "此照片将从 " + scopeValue222.friendName + " 的独立相册中删除，且无法恢复。" : (scopeValue222.photoCount > 1 ? "此照片所在的整条多图消息（共 " + scopeValue222.photoCount + " 张照片）会从对应" : "此照片及其消息会从对应") + (scopeValue222.friendType === "group" ? "群聊" : "单聊") + "中删除，且无法恢复。");
    if (scopeValue1.deleteStatus) scopeValue1.deleteStatus.textContent = "";
    scopeValue1.deleteConfirm.hidden = false;
    scopeValue1.deleteConfirm.inert = false;
    scopeValue1.deleteConfirm.setAttribute("aria-hidden", "false");
    scopeValue1.deleteConfirmCancel?.focus?.({
      preventScroll: true
    });
  }
  function scopeValue55(scopeValue223 = {}) {
    if (!scopeValue1?.deleteConfirm) return;
    const scopeValue224 = document.activeElement;
    if (scopeValue224 && scopeValue1.deleteConfirm.contains(scopeValue224)) {
      const scopeValue225 = scopeValue1.previewDelete && !scopeValue1.previewDelete.disabled ? scopeValue1.previewDelete : scopeValue1.previewClose;
      if (scopeValue223.restoreFocus !== false && scopeValue225 && typeof scopeValue225.focus === "function") scopeValue225.focus({
        preventScroll: true
      });else typeof scopeValue224.blur === "function" && scopeValue224.blur();
    }
    scopeValue1.deleteConfirm.inert = true;
    scopeValue1.deleteConfirm.setAttribute("aria-hidden", "true");
    scopeValue1.deleteConfirm.hidden = true;
    if (scopeValue1.deleteStatus) scopeValue1.deleteStatus.textContent = "";
  }
  function scopeValue56(scopeValue226) {
    const scopeValue227 = document.getElementById("chat-interface-" + scopeValue226.friendId),
      scopeValue228 = scopeValue227?.querySelector(".ins-chat-messages") || null;
    if (scopeValue228 && window.imChat?.removeMessageFromContainer) {
      const scopeValue229 = window.imChat.removeMessageFromContainer(scopeValue228, {
        id: scopeValue226.id || null,
        timestamp: scopeValue226.timestamp || null
      }, {
        scroll: false
      });
      if (!scopeValue229 && window.imChat?.rerenderChatContainer) {
        const scopeValue230 = (window.imData?.friends || []).find(scopeValue231 => String(scopeValue231.id) === String(scopeValue226.friendId));
        if (scopeValue230) window.imChat.rerenderChatContainer(scopeValue230, scopeValue228, {
          scroll: false
        });
      }
    }
    window.imChat?.renderChatsList?.();
  }
  async function scopeValue57(scopeValue232) {
    if (!scopeValue232?.friendId || !scopeValue232.id && !scopeValue232.timestamp || !window.imApp?.removeFriendMessages) throw new Error("gallery_chat_delete_unavailable");
    const scopeValue233 = await window.imApp.removeFriendMessages(scopeValue232.friendId, {
      id: scopeValue232.id || null,
      timestamp: scopeValue232.timestamp || null
    }, {
      silent: true
    });
    if (!scopeValue233) throw new Error("gallery_chat_delete_failed");
    scopeValue56(scopeValue232);
    scopeValue4 = scopeValue4.filter(scopeValue234 => !(scopeValue234.friendId === scopeValue232.friendId && scopeValue234.id === scopeValue232.id));
    scopeValue42();
  }
  async function scopeValue58(scopeValue235) {
    const scopeValue236 = scopeValue25(scopeValue5).find(scopeValue238 => scopeValue238.id === String(scopeValue235.albumId || ""));
    if (!scopeValue236) throw new Error("gallery_album_delete_missing");
    const scopeValue237 = scopeValue24(scopeValue236.friend).filter(scopeValue239 => scopeValue235.photoId ? scopeValue239.id !== scopeValue235.photoId : !(scopeValue239.url === scopeValue235.url && scopeValue239.addedAt === scopeValue235.timestamp)).map(scopeValue240 => ({
      ...scopeValue240
    }));
    await scopeValue38(scopeValue236, scopeValue237);
  }
  function scopeValue59(scopeValue241) {
    if (!scopeValue241 || scopeValue241.source === "album") return null;
    const scopeValue242 = scopeValue25(scopeValue5);
    if (scopeValue241.friendType === "char") return scopeValue242.find(scopeValue245 => scopeValue245.id === String(scopeValue241.friendId)) || null;
    if (scopeValue241.senderId) {
      const scopeValue246 = scopeValue242.find(scopeValue247 => scopeValue247.id === String(scopeValue241.senderId));
      if (scopeValue246) return scopeValue246;
    }
    const scopeValue243 = String(scopeValue241.senderName || "").trim().toLocaleLowerCase("zh-CN");
    if (!scopeValue243 || scopeValue243 === "我") return null;
    const scopeValue244 = scopeValue242.filter(scopeValue248 => scopeValue248.name.toLocaleLowerCase("zh-CN") === scopeValue243);
    return scopeValue244.length === 1 ? scopeValue244[0] : null;
  }
  function scopeValue60(scopeValue249, scopeValue250) {
    return scopeValue249.photos.some(scopeValue251 => scopeValue250.photoId && scopeValue251.id === scopeValue250.photoId || scopeValue250.assetId && scopeValue251.assetId === scopeValue250.assetId || scopeValue250.url && scopeValue251.url === scopeValue250.url || !scopeValue250.assetId && !scopeValue250.url && scopeValue250.id && scopeValue251.sourceFriendId === scopeValue250.friendId && scopeValue251.sourceMessageId === scopeValue250.id);
  }
  async function scopeValue61() {
    const scopeValue252 = scopeValue15,
      scopeValue253 = scopeValue59(scopeValue252);
    if (!scopeValue252 || !scopeValue253 || scopeValue252.source === "album" || !scopeValue1?.previewAddAlbum) return;
    if (scopeValue60(scopeValue253, scopeValue252)) {
      window.showToast?.("已在 " + scopeValue253.name + " 的共享相册中");
      return;
    }
    if (!scopeValue252.assetId && !/^https?:\/\//i.test(scopeValue252.url || "")) {
      window.showToast?.("这张照片暂时无法加入共享相册");
      return;
    }
    const scopeValue254 = [{
      id: window.galleryData?.createPhotoId?.(scopeValue253.id, {
        assetId: scopeValue252.assetId,
        url: scopeValue252.url,
        sourceMessageId: scopeValue252.id + ":" + scopeValue252.photoIndex
      }),
      url: scopeValue252.url,
      assetId: scopeValue252.assetId,
      description: String(scopeValue252.description || "").trim().slice(0, 300),
      addedAt: Date.now(),
      sourceFriendId: scopeValue252.friendId,
      sourceMessageId: scopeValue252.id
    }, ...scopeValue253.photos.map(newScope270 => ({
      ...newScope270
    }))].slice(0, 100);
    scopeValue1.previewAddAlbum.disabled = true;
    try {
      await scopeValue38(scopeValue253, scopeValue254);
      const newScope271 = scopeValue1.previewAddAlbum.querySelector("span");
      if (newScope271) newScope271.textContent = "已在共享相册";
      scopeValue33();
      if (scopeValue13 === scopeValue253.id) scopeValue35();
      window.showToast?.("已加入 " + scopeValue253.name + " 的共享相册");
    } catch (newScope272) {
      console.error("[gallery] Failed to add chat photo to Char album", newScope272), scopeValue1.previewAddAlbum.disabled = false, window.showToast?.("加入共享相册失败");
    }
  }
  async function scopeValue62() {
    const scopeValue258 = scopeValue15;
    if (!scopeValue258) return;
    if (scopeValue1.deleteConfirmAction) scopeValue1.deleteConfirmAction.disabled = true;
    if (scopeValue1.deleteConfirmCancel) scopeValue1.deleteConfirmCancel.disabled = true;
    if (scopeValue1.previewDelete) scopeValue1.previewDelete.disabled = true;
    if (scopeValue1.deleteStatus) scopeValue1.deleteStatus.textContent = "正在删除…";
    try {
      if (scopeValue258.source === "album") await scopeValue58(scopeValue258);else await scopeValue57(scopeValue258);
      scopeValue55({
        restoreFocus: true
      });
      scopeValue63();
      scopeValue40();
      scopeValue33();
      scopeValue41();
      if (scopeValue13) scopeValue35();
      window.showToast?.(scopeValue258.source === "album" ? "已从 Char 相册删除" : "照片及对应聊天消息已删除");
    } catch (scopeValue259) {
      console.error("[gallery] Failed to delete photo", scopeValue259);
      if (scopeValue1.deleteStatus) scopeValue1.deleteStatus.textContent = "删除失败，请稍后重试。";
      if (scopeValue1.previewDelete) scopeValue1.previewDelete.disabled = false;
    } finally {
      if (scopeValue1.deleteConfirmAction) scopeValue1.deleteConfirmAction.disabled = false;
      if (scopeValue1.deleteConfirmCancel) scopeValue1.deleteConfirmCancel.disabled = false;
    }
  }
  function scopeValue63() {
    if (!scopeValue1?.preview) return;
    scopeValue55({
      restoreFocus: false
    });
    const scopeValue260 = document.activeElement;
    if (scopeValue260 && scopeValue1.preview.contains(scopeValue260)) {
      if (scopeValue14?.isConnected && typeof scopeValue14.focus === "function") scopeValue14.focus({
        preventScroll: true
      });else typeof scopeValue260.blur === "function" && scopeValue260.blur();
    }
    window.mobileInputCompat?.["releaseForOverlay"]?.(scopeValue1.preview), scopeValue1.preview.inert = true, scopeValue1.preview.setAttribute("aria-hidden", "true"), scopeValue1.preview.hidden = true;
    scopeValue1.previewImage && (scopeValue1.previewImage.removeAttribute("src"), scopeValue1.previewImage.alt = "");
    scopeValue1.previewThumbnail?.removeAttribute("src");
    if (scopeValue1.previewDescriptionText) scopeValue1.previewDescriptionText.textContent = "";
    if (scopeValue1.previewDescription) scopeValue1.previewDescription.hidden = true;
    scopeValue50();
    scopeValue14 = null;
    scopeValue15 = null;
  }
  function scopeValue64() {
    if (scopeValue1?.searchInput) scopeValue1.searchInput.value = "";
    scopeValue41();
  }
  function scopeValue65() {
    if (!scopeValue1?.view) return;
    scopeValue63();
    scopeValue37();
    scopeValue64();
    scopeValue3 = "library";
    scopeValue44("library");
    scopeValue1.view.inert = false;
    scopeValue1.view.setAttribute("aria-hidden", "false");
    if (typeof window.openView === "function") window.openView(scopeValue1.view);else scopeValue1.view.classList.add("active");
    scopeValue43();
  }
  function scopeValue66() {
    if (!scopeValue1?.view) return;
    const scopeValue261 = document.activeElement;
    if (scopeValue261 && scopeValue1.view.contains(scopeValue261) && typeof scopeValue261.blur === "function") scopeValue261.blur();
    window.mobileInputCompat?.["releaseForOverlay"]?.(scopeValue1.view), newScope17 = false, scopeValue7 += 1, scopeValue63(), scopeValue37(), scopeValue64(), scopeValue3 = "library", scopeValue44("library"), scopeValue1.view.inert = true, scopeValue1.view.setAttribute("aria-hidden", "true");
    if (typeof window.closeView === "function") window.closeView(scopeValue1.view);else scopeValue1.view.classList.remove("active");
  }
  function scopeValue67() {
    if (!scopeValue1?.["view"] || scopeValue1.view.dataset.galleryBound === "true") return;
    scopeValue1.view.dataset.galleryBound = "true", scopeValue1.back?.["addEventListener"]("click", scopeValue66), scopeValue1.previewClose?.["addEventListener"]("click", scopeValue63), scopeValue1.previewDescriptionEdit?.["addEventListener"]("click", scopeValue51), scopeValue1.previewDescriptionCancel?.["addEventListener"]("click", scopeValue50), scopeValue1.previewDescriptionEditor?.["addEventListener"]("submit", scopeValue52), scopeValue1.previewDownload?.["addEventListener"]("click", newScope56), scopeValue1.previewAddAlbum?.["addEventListener"]("click", scopeValue61), scopeValue1.previewDelete?.["addEventListener"]("click", scopeValue54), scopeValue1.deleteConfirmAction?.["addEventListener"]("click", scopeValue62), scopeValue1.deleteConfirmCancel?.["addEventListener"]("click", () => scopeValue55({
      restoreFocus: true
    }));
    scopeValue1.albumDetailBack?.addEventListener("click", scopeValue37);
    scopeValue1.albumUrlForm?.addEventListener("submit", scopeValue39);
    scopeValue1.tabButtons.forEach(scopeValue262 => scopeValue262.addEventListener("click", () => {
      const scopeValue263 = scopeValue262.dataset.galleryTab;
      if (scopeValue263 !== "search" && Date.now() < scopeValue12) return;
      if (scopeValue263 === "search" && scopeValue2 === "search") scopeValue44(scopeValue3);else scopeValue44(scopeValue263);
    })), scopeValue1.searchInput?.["addEventListener"]("input", scopeValue41), scopeValue1.searchClear?.["addEventListener"]("click", scopeValue64), scopeValue1.view.addEventListener("compositionstart", () => {
      newScope17 = true;
    }), scopeValue1.view.addEventListener("compositionend", () => {
      newScope17 = false;
    }), scopeValue1.view.addEventListener("keydown", newScope279 => {
      if (newScope279.key !== "Enter") return;
      if (newScope17 || newScope279.isComposing || newScope279.keyCode === 229) newScope279.preventDefault();else newScope279.target === scopeValue1.albumUrlInput && (newScope279.preventDefault(), scopeValue1.albumDescriptionInput?.["focus"]?.({
        preventScroll: true
      }));
    }), scopeValue1.view.addEventListener("click", scopeValue264 => {
      const scopeValue265 = scopeValue264.target.closest("[data-gallery-photo-key]");
      if (scopeValue265 && !scopeValue265.classList.contains("is-broken")) {
        scopeValue53(scopeValue6.get(scopeValue265.dataset.galleryPhotoKey));
        return;
      }
      const scopeValue266 = scopeValue264.target.closest("[data-gallery-album-id]");
      if (scopeValue266) {
        scopeValue36(scopeValue266.dataset.galleryAlbumId);
        return;
      }
      const scopeValue267 = scopeValue264.target.closest("[data-gallery-album-photo-index]");
      if (scopeValue267 && !scopeValue267.classList.contains("is-broken")) {
        const scopeValue268 = scopeValue34(),
          scopeValue269 = scopeValue268?.photos[Number(scopeValue267.dataset.galleryAlbumPhotoIndex)];
        if (scopeValue269) scopeValue53({
          source: "album",
          albumId: scopeValue268.id,
          photoId: scopeValue269.id,
          assetId: scopeValue269.assetId,
          url: scopeValue269.url,
          description: scopeValue269.description,
          friendName: scopeValue268.name,
          senderName: "共享相册",
          timestamp: scopeValue269.addedAt
        });
      }
    }), scopeValue1.view.addEventListener("keydown", scopeValue270 => {
      if (scopeValue270.key !== "Escape" || newScope17 || scopeValue270.isComposing) return;
      if (!scopeValue1.deleteConfirm?.["hidden"]) scopeValue55({
        restoreFocus: true
      });else {
        if (!scopeValue1.previewDescriptionEditor?.["hidden"]) scopeValue50();else {
          if (!scopeValue1.preview?.["hidden"]) scopeValue63();else {
            if (!scopeValue1.albumDetail?.["hidden"]) scopeValue37();else {
              if (scopeValue2 === "search") scopeValue44(scopeValue3);else scopeValue66();
            }
          }
        }
      }
    }), scopeValue49(), window.mobileInputCompat?.["registerFocusScope"]?.({
      selector: "#gallery-view",
      priority: 20,
      preferFocusScope: true,
      preferNativeResize: true,
      preserveVisibleTarget: true,
      scrollBehavior: "focus",
      "resolveScrollContainer"(newScope287, newScope288) {
        if (newScope287.closest("#gallery-preview")) return newScope288.querySelector(".gallery-preview-sheet");
        if (newScope287.closest("#gallery-album-detail")) return newScope288.querySelector(".gallery-album-detail-scroll");
        return newScope288.querySelector("#gallery-search-page .gallery-page-scroll");
      },
      viewportClassName: "gallery-keyboard-open",
      viewportHeightCssVariable: "--gallery-viewport-height",
      viewportTopCssVariable: "--gallery-viewport-top"
    });
  }
  function scopeValue68() {
    scopeValue26();
    if (!scopeValue1.view) return;
    scopeValue67();
    scopeValue44("library");
    scopeValue40();
    scopeValue33();
    scopeValue41();
  }
  window.galleryApp = {
    open: scopeValue65,
    close: scopeValue66,
    switchTab: scopeValue44,
    normalizeGalleryItems: scopeValue22,
    filterGalleryItems: scopeValue23,
    buildSharedAlbums: scopeValue25,
    getActiveTab: () => scopeValue2
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scopeValue68, {
    once: true
  });else scopeValue68();
})();
